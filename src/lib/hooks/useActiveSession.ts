import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, type TrainingSession, type ExerciseSet, type PlanExercise, type Exercise } from '../db';
import { useAuthStore } from '../../stores/useAuthStore';
import { useTrainingStore } from '../../stores/useTrainingStore';

export interface PlanData {
    planId: string;
    planName: string;
    exercises: (PlanExercise & { exercise: Exercise })[];
}

export function usePlan(planId: string | null) {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: ['plan', planId],
        queryFn: async () => {
            if (!planId || !user?.id) return null;

            const plan = await db.trainingPlans.get(planId);
            if (!plan) return null;

            const planExercises = await db.planExercises
                .where('planId')
                .equals(plan.id)
                .sortBy('order');

            const exercisesWithDetails = await Promise.all(
                planExercises.map(async (pe) => {
                    const exercise = await db.exercises.get(pe.exerciseId);
                    return { ...pe, exercise: exercise! };
                })
            );

            return {
                planId: plan.id,
                planName: plan.name,
                exercises: exercisesWithDetails,
            };
        },
        enabled: !!planId && !!user?.id,
    });
}

export function useActiveSessionData() {
    const { activeSessionId } = useTrainingStore();
    return usePlan(activeSessionId);
}

export function useSaveSession() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { activeSessionId, startTime, endSession, exerciseSets } = useTrainingStore();

    return useMutation({
        mutationFn: async () => {
            if (!user?.id || !activeSessionId || !startTime) throw new Error('No active session');

            const sessionId = crypto.randomUUID();
            const endTime = Date.now();

            // 1. Create Session Record
            const session: TrainingSession = {
                id: sessionId,
                planId: activeSessionId,
                startedAt: startTime,
                completedAt: endTime,
                syncStatus: 'local'
            };

            await db.trainingSessions.add(session);

            // 2. Prepare Sets
            const setsToSave: ExerciseSet[] = [];
            Object.entries(exerciseSets).forEach(([exerciseId, sets]) => {
                sets.forEach((set, index) => {
                    if (set.completed) {
                        setsToSave.push({
                            id: crypto.randomUUID(),
                            sessionId: sessionId,
                            exerciseId,
                            setNumber: index + 1,
                            weight: set.weight,
                            reps: set.reps,
                            excludeFromAnalysis: false,
                            syncStatus: 'local',
                            createdAt: Date.now()
                        });
                    }
                });
            });

            await db.exerciseSets.bulkAdd(setsToSave);

            return sessionId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trainingSessions'] });
            queryClient.invalidateQueries({ queryKey: ['history'] });
            endSession();
        },
    });
}

export function useTrainingHistory() {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: ['history', user?.id],
        queryFn: async () => {
            if (!user?.id) return [];

            // Get last 10 completed sessions
            const sessions = await db.trainingSessions
                .where('completedAt').above(0) // Only completed sessions
                .reverse()
                .limit(10)
                .toArray();

            // Enrich with plan name and stats
            const history = await Promise.all(sessions.map(async (session) => {
                const plan = await db.trainingPlans.get(session.planId);
                const sets = await db.exerciseSets.where('sessionId').equals(session.id).toArray();

                return {
                    ...session,
                    planName: plan?.name || 'Unbekannter Plan',
                    totalSets: sets.length,
                    totalVolume: sets.reduce((acc, set) => acc + ((set.weight || 0) * (set.reps || 0)), 0)
                };
            }));

            return history;
        },
        enabled: !!user?.id
    });
}
