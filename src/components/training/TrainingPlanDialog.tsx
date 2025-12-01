import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Check } from 'lucide-react';
import { useExercises } from '../../lib/hooks/useExercises';
import { cn } from '../../lib/utils';

interface TrainingPlanDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string; exercises: string[] }) => Promise<void>;
    initialData?: { name: string; exercises: string[] };
}

export function TrainingPlanDialog({ isOpen, onClose, onSave, initialData }: TrainingPlanDialogProps) {
    const [name, setName] = useState('');
    const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const { data: exercises } = useExercises();

    useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name);
            setSelectedExercises(initialData.exercises);
        } else if (isOpen) {
            setName('');
            setSelectedExercises([]);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || selectedExercises.length === 0) return;

        setLoading(true);
        try {
            await onSave({
                name,
                exercises: selectedExercises,
            });
            onClose();
        } catch (error) {
            console.error('Failed to save plan:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleExercise = (id: string) => {
        setSelectedExercises(prev =>
            prev.includes(id)
                ? prev.filter(exId => exId !== id)
                : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-bg-card rounded-2xl shadow-xl border border-border overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-bold font-heading">{initialData ? 'Plan bearbeiten' : 'Neuer Trainingsplan'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-bg-elevated rounded-full transition-colors">
                        <X className="w-5 h-5 text-text-muted" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
                    <div className="p-4 space-y-4 overflow-y-auto">
                        <Input
                            label="Name des Plans"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="z.B. Push Day"
                            required
                            autoFocus
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Übungen auswählen ({selectedExercises.length})</label>

                            <div className="space-y-2">
                                {!exercises || exercises.length === 0 ? (
                                    <div className="text-center p-4 text-text-muted text-sm bg-bg-elevated rounded-xl">
                                        Keine Übungen gefunden. Erstelle zuerst Übungen.
                                    </div>
                                ) : (
                                    exercises.map(exercise => {
                                        const isSelected = selectedExercises.includes(exercise.id);
                                        return (
                                            <div
                                                key={exercise.id}
                                                onClick={() => toggleExercise(exercise.id)}
                                                className={cn(
                                                    "p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between",
                                                    isSelected
                                                        ? "bg-primary/10 border-primary"
                                                        : "bg-bg-elevated border-transparent hover:border-border"
                                                )}
                                            >
                                                <div>
                                                    <div className={cn("font-medium", isSelected ? "text-primary" : "text-text-primary")}>
                                                        {exercise.name}
                                                    </div>
                                                    <div className="text-xs text-text-muted capitalize">{exercise.muscleGroupId}</div>
                                                </div>
                                                {isSelected && (
                                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                        <Check className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-border bg-bg-card">
                        <div className="flex gap-3">
                            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                                Abbrechen
                            </Button>
                            <Button type="submit" disabled={loading || !name || selectedExercises.length === 0} className="flex-1">
                                {loading ? 'Speichern...' : (initialData ? 'Speichern' : 'Erstellen')}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
