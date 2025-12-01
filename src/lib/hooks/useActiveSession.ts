import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, type TrainingSession, type ExerciseSet, type PlanExercise, type Exercise } from '../db';
import { useAuthStore } from '../../stores/useAuthStore';
import { useTrainingStore } from '../../stores/useTrainingStore';

export interface ActiveSessionData {
    planId: string;
    planName: string;
    exercises: (PlanExercise & { exercise: Exercise })[];
    sets: ExerciseSet[];
}

export function useActiveSessionData() {
    const { activeSessionId } = useTrainingStore();
    const { user } = useAuthStore();

    return useQuery({
        queryKey: ['activeSession', activeSessionId],
        queryFn: async () => {
            if (!activeSessionId || !user?.id) return null;

            // Fetch plan details
            const plan = await db.trainingPlans.get(activeSessionId);
            if (!plan) {
                console.error(`Plan with ID ${activeSessionId} not found`);
                return null;
            }

            // Fetch plan exercises with details
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

            // Fetch existing sets for this session (if any - though we might need a session ID first)
            // For now, we'll manage sets in local state or a temporary store until saved
            // OR we create the session record immediately when starting.
            // Let's assume we create the session record on "Finish" to avoid ghost sessions,
            // BUT we need to persist sets during the workout.
            // A better approach for "Offline First" is to create the session ID immediately.

            // However, the current store only holds `activeSessionId` which is the PLAN ID.
            // We should probably change `activeSessionId` to be the actual SESSION ID, 
            // or store both `activePlanId` and `activeSessionId`.

            // For this iteration, let's stick to the plan:
            // We will fetch previous sets for these exercises to show history (optional but good).

            return {
                planId: plan.id,
                planName: plan.name,
                exercises: exercisesWithDetails,
                sets: [] // We'll handle current sets in the component state for now
            };
        },
        enabled: !!activeSessionId && !!user?.id,
    });
}

export function useSaveSession() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { activeSessionId, startTime, endSession } = useTrainingStore();

    return useMutation({
        mutationFn: async (completedSets: Omit<ExerciseSet, 'id' | 'sessionId' | 'syncStatus' | 'createdAt'>[]) => {
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

            // 2. Create Set Records
            const sets: ExerciseSet[] = completedSets.map(set => ({
                ...set,
                id: crypto.randomUUID(),
                sessionId: sessionId,
                syncStatus: 'local',
                createdAt: Date.now()
            }));

            await db.exerciseSets.bulkAdd(sets);

            return sessionId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trainingSessions'] });
            queryClient.invalidateQueries({ queryKey: ['history'] });
            endSession();
        },
    });
}
