import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, type TrainingPlan, type PlanExercise } from '../db';
import { useAuthStore } from '../../stores/useAuthStore';

export interface TrainingPlanWithExercises extends TrainingPlan {
    exercises: PlanExercise[];
}

export function useTrainingPlans() {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: ['trainingPlans', user?.id],
        queryFn: async () => {
            if (!user?.id) return [];

            const plans = await db.trainingPlans
                .where('userId')
                .equals(user.id)
                .reverse()
                .sortBy('createdAt');

            // Fetch exercises for each plan to calculate stats (count, etc.)
            const plansWithExercises = await Promise.all(
                plans.map(async (plan) => {
                    const exercises = await db.planExercises
                        .where('planId')
                        .equals(plan.id)
                        .sortBy('order');
                    return { ...plan, exercises };
                })
            );

            return plansWithExercises;
        },
        enabled: !!user?.id,
    });
}

export function useCreateTrainingPlan() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async ({ name, exercises }: { name: string; exercises: string[] }) => {
            if (!user?.id) throw new Error('User not authenticated');

            const planId = crypto.randomUUID();

            const newPlan: TrainingPlan = {
                id: planId,
                userId: user.id,
                name,
                syncStatus: 'local',
                createdAt: Date.now(),
            };

            await db.trainingPlans.add(newPlan);

            // Add exercises to the plan
            const planExercises: PlanExercise[] = exercises.map((exerciseId, index) => ({
                id: crypto.randomUUID(),
                planId,
                exerciseId,
                order: index,
                defaultSets: 3, // Default value
            }));

            await db.planExercises.bulkAdd(planExercises);

            return newPlan;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trainingPlans'] });
        },
    });
}

export function useDeleteTrainingPlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (planId: string) => {
            await db.transaction('rw', db.trainingPlans, db.planExercises, async () => {
                await db.trainingPlans.delete(planId);
                await db.planExercises.where('planId').equals(planId).delete();
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trainingPlans'] });
        },
    });
}
