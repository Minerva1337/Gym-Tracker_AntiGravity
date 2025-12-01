import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ExerciseList } from '../components/exercises/ExerciseList';
import { Input } from '../components/ui/Input';
import { useState } from 'react';
import { ExerciseDialog } from '../components/exercises/ExerciseDialog';
import { useCreateExercise } from '../lib/hooks/useExercises';

export function ExercisesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const createExercise = useCreateExercise();

    return (
        <div className="p-4 pt-[calc(env(safe-area-inset-top)+20px)]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-heading font-bold">Übungen</h1>
                <Button
                    size="sm"
                    className="h-10 w-10 p-0 rounded-full"
                    onClick={() => setIsDialogOpen(true)}
                >
                    <Plus className="w-5 h-5" />
                </Button>
            </div>

            <div className="mb-6">
                <Input placeholder="Suche..." className="bg-bg-card border-none" />
            </div>

            <ExerciseList />

            <ExerciseDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={async (data) => {
                    await createExercise.mutateAsync(data);
                }}
            />
        </div>
    );
}
