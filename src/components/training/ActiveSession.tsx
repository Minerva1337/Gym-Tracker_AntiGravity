import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Dumbbell, Plus, Timer, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTrainingStore } from '../../stores/useTrainingStore';
import { useActiveSessionData, useSaveSession } from '../../lib/hooks/useActiveSession';
import { type ExerciseSet } from '../../lib/db';

export function ActiveSession() {
    const { startTime } = useTrainingStore();
    const [elapsed, setElapsed] = useState(0);
    const { data: sessionData, isLoading } = useActiveSessionData();
    const saveSession = useSaveSession();

    useEffect(() => {
        if (!startTime) return;

        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Initialize sets state when data loads
    const [exerciseSets, setExerciseSets] = useState<Record<string, { weight: number; reps: number; completed: boolean }[]>>({});

    useEffect(() => {
        if (sessionData && Object.keys(exerciseSets).length === 0) {
            const initialSets: Record<string, { weight: number; reps: number; completed: boolean }[]> = {};
            sessionData.exercises.forEach(ex => {
                // Default to 3 empty sets
                initialSets[ex.exerciseId] = Array(3).fill({ weight: 0, reps: 0, completed: false });
            });
            setExerciseSets(initialSets);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionData]);

    const updateSet = (exerciseId: string, index: number, field: 'weight' | 'reps', value: number) => {
        setExerciseSets(prev => ({
            ...prev,
            [exerciseId]: prev[exerciseId].map((set, i) =>
                i === index ? { ...set, [field]: value } : set
            )
        }));
    };

    const toggleSetComplete = (exerciseId: string, index: number) => {
        setExerciseSets(prev => ({
            ...prev,
            [exerciseId]: prev[exerciseId].map((set, i) =>
                i === index ? { ...set, completed: !set.completed } : set
            )
        }));
    };

    const addSet = (exerciseId: string) => {
        setExerciseSets(prev => ({
            ...prev,
            [exerciseId]: [...prev[exerciseId], { weight: 0, reps: 0, completed: false }]
        }));
    };

    const handleFinishSession = async () => {
        if (!confirm('Training wirklich beenden?')) return;

        const setsToSave: Omit<ExerciseSet, 'id' | 'sessionId' | 'syncStatus' | 'createdAt'>[] = [];

        Object.entries(exerciseSets).forEach(([exerciseId, sets]) => {
            sets.forEach((set, index) => {
                if (set.completed) {
                    setsToSave.push({
                        exerciseId,
                        setNumber: index + 1,
                        weight: set.weight,
                        reps: set.reps,
                        excludeFromAnalysis: false
                    });
                }
            });
        });

        await saveSession.mutateAsync(setsToSave);
    };

    const { endSession } = useTrainingStore();

    if (isLoading) {
        return <div className="p-8 text-center text-text-muted">Lade Training...</div>;
    }

    if (!sessionData) {
        return (
            <div className="p-8 text-center space-y-4">
                <p className="text-text-muted">Trainingsplan nicht gefunden.</p>
                <Button onClick={endSession} variant="secondary">
                    Zurück zur Übersicht
                </Button>
            </div>
        );
    }

    return (
        <div className="pb-20">
            <div className="bg-gradient-to-br from-primary-dark to-primary -mx-4 -mt-4 px-4 pt-4 pb-8 rounded-b-3xl mb-6 shadow-lg shadow-primary/20">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-heading font-bold text-white">{sessionData.planName}</h1>
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-white text-sm font-medium backdrop-blur-sm">
                        <Timer className="w-4 h-4" />
                        <span>{formatTime(elapsed)}</span>
                    </div>
                </div>
                <p className="text-primary-light/80 text-sm">{sessionData.exercises.length} Übungen</p>
            </div>

            <div className="space-y-6">
                {sessionData.exercises.map((item) => (
                    <Card key={item.exerciseId}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-primary-light/10 flex items-center justify-center text-primary">
                                <Dumbbell className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{item.exercise.name}</h3>
                                <p className="text-xs text-text-muted capitalize">{item.exercise.muscleGroupId}</p>
                            </div>
                        </div>

                        <div className="mb-2 grid grid-cols-[40px_1fr_1fr_44px] gap-2 text-[10px] uppercase tracking-wider text-text-muted font-medium text-center">
                            <div>Set</div>
                            <div>kg</div>
                            <div>Reps</div>
                            <div>✓</div>
                        </div>

                        <div className="space-y-2">
                            {exerciseSets[item.exerciseId]?.map((set, index) => (
                                <div key={index} className="grid grid-cols-[40px_1fr_1fr_44px] gap-2 items-center">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-bg-elevated text-xs font-bold text-text-secondary">
                                        {index + 1}
                                    </div>
                                    <input
                                        type="number"
                                        value={set.weight || ''}
                                        onChange={(e) => updateSet(item.exerciseId, index, 'weight', parseFloat(e.target.value))}
                                        className="w-full h-10 rounded-lg bg-bg-input border border-transparent focus:border-primary focus:ring-1 focus:ring-primary text-center font-medium outline-none transition-all"
                                        placeholder="0"
                                    />
                                    <input
                                        type="number"
                                        value={set.reps || ''}
                                        onChange={(e) => updateSet(item.exerciseId, index, 'reps', parseFloat(e.target.value))}
                                        className="w-full h-10 rounded-lg bg-bg-input border border-transparent focus:border-primary focus:ring-1 focus:ring-primary text-center font-medium outline-none transition-all"
                                        placeholder="0"
                                    />
                                    <button
                                        onClick={() => toggleSetComplete(item.exerciseId, index)}
                                        className={`w-11 h-10 rounded-lg flex items-center justify-center transition-all ${set.completed
                                            ? 'bg-success text-white shadow-lg shadow-success/20'
                                            : 'bg-bg-elevated text-text-muted hover:bg-bg-elevated/80'
                                            }`}
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-4 text-text-secondary hover:text-primary"
                            onClick={() => addSet(item.exerciseId)}
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Satz hinzufügen
                        </Button>
                    </Card>
                ))}

                <Button
                    size="lg"
                    className="w-full shadow-xl shadow-primary/20"
                    onClick={handleFinishSession}
                    disabled={saveSession.isPending}
                >
                    {saveSession.isPending ? 'Speichere...' : 'Training beenden'}
                </Button>
            </div>
        </div>
    );
}
