import { ExerciseCard } from './ExerciseCard';
import { useExercises, useDeleteExercise, useUpdateExercise } from '../../lib/hooks/useExercises';
import { ExerciseDialog } from './ExerciseDialog';
import { useState } from 'react';
import { type Exercise } from '../../lib/db';

export function ExerciseList() {
    const { data: exercises, isLoading } = useExercises();
    const deleteExercise = useDeleteExercise();
    const updateExercise = useUpdateExercise();

    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

    if (isLoading) {
        return <div className="text-center text-text-muted py-8">Lade Übungen...</div>;
    }

    if (!exercises || exercises.length === 0) {
        return (
            <div className="text-center text-text-muted py-8 bg-bg-elevated/50 rounded-xl border border-dashed border-border">
                <p>Noch keine Übungen vorhanden.</p>
                <p className="text-sm mt-1">Erstelle deine erste Übung oben rechts.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {exercises.map((exercise) => (
                <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onDelete={(id) => deleteExercise.mutate(id)}
                    onEdit={(ex) => setEditingExercise(ex)}
                />
            ))}

            <ExerciseDialog
                isOpen={!!editingExercise}
                onClose={() => setEditingExercise(null)}
                onSave={async (data) => {
                    if (editingExercise) {
                        await updateExercise.mutateAsync({ ...editingExercise, ...data });
                    }
                }}
                initialData={editingExercise || undefined}
            />
        </div>
    );
}
