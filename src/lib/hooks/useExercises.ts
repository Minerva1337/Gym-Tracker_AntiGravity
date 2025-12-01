import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, type Exercise } from '../db';
import { useAuthStore } from '../../stores/useAuthStore';

export function useExercises() {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: ['exercises', user?.id],
        queryFn: async () => {
            if (!user?.id) return [];
            return await db.exercises
                .where('userId')
                .equals(user.id)
                .reverse()
                .sortBy('createdAt');
        },
        enabled: !!user?.id,
    });
}

export function useCreateExercise() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async (exercise: Omit<Exercise, 'id' | 'userId' | 'syncStatus' | 'createdAt'>) => {
            if (!user?.id) throw new Error('User not authenticated');

            const newExercise: Exercise = {
                ...exercise,
                id: crypto.randomUUID(),
                userId: user.id,
                syncStatus: 'local',
                createdAt: Date.now(),
            };

            await db.exercises.add(newExercise);
            return newExercise;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exercises'] });
        },
    });
}

export function useUpdateExercise() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (exercise: Exercise) => {
            await db.exercises.put({
                ...exercise,
                syncStatus: 'local', // Mark as local change for sync
            });
            return exercise;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exercises'] });
        },
    });
}

export function useDeleteExercise() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await db.exercises.delete(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exercises'] });
        },
    });
}
