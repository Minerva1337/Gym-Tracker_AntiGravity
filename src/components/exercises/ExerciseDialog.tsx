import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';
import { type Exercise } from '../../lib/db';

interface ExerciseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (exercise: Omit<Exercise, 'id' | 'userId' | 'syncStatus' | 'createdAt'>) => Promise<void>;
    initialData?: Exercise;
}

export function ExerciseDialog({ isOpen, onClose, onSave, initialData }: ExerciseDialogProps) {
    const [name, setName] = useState('');
    const [muscleGroup, setMuscleGroup] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName(initialData?.name || '');
            setMuscleGroup(initialData?.muscleGroupId || '');
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        setLoading(true);
        try {
            await onSave({
                name,
                muscleGroupId: muscleGroup || 'other',
            });
            onClose();
        } catch (error) {
            console.error('Failed to save exercise:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-bg-card rounded-2xl shadow-xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-bold font-heading">
                        {initialData ? 'Übung bearbeiten' : 'Neue Übung'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-bg-elevated rounded-full transition-colors">
                        <X className="w-5 h-5 text-text-muted" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <Input
                        label="Name der Übung"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="z.B. Bankdrücken"
                        required
                        autoFocus
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Muskelgruppe</label>
                        <select
                            value={muscleGroup}
                            onChange={(e) => setMuscleGroup(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl bg-bg-elevated border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-text-primary"
                        >
                            <option value="">Bitte wählen...</option>
                            <option value="chest">Brust</option>
                            <option value="back">Rücken</option>
                            <option value="legs">Beine</option>
                            <option value="shoulders">Schultern</option>
                            <option value="arms">Arme</option>
                            <option value="core">Rumpf</option>
                            <option value="cardio">Cardio</option>
                            <option value="other">Andere</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                            Abbrechen
                        </Button>
                        <Button type="submit" disabled={loading || !name} className="flex-1">
                            {loading ? 'Speichern...' : 'Speichern'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
