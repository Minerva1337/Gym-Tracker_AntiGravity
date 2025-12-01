import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Timer, Plus, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTrainingStore } from '../../stores/useTrainingStore';
import { useActiveSessionData } from '../../lib/hooks/useActiveSession';
import clsx from 'clsx';

export function ActiveSession() {
    const { startTime, exerciseSets, setExerciseSets, updateSet, addSet } = useTrainingStore();
    const [elapsed, setElapsed] = useState(0);
    const { data: sessionData, isLoading } = useActiveSessionData();

    useEffect(() => {
        if (!startTime) return;

        const interval = setInterval(() => {
            setElapsed(Date.now() - startTime);
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    const formatTime = (ms: number) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / 1000 / 60) % 60);
        const hours = Math.floor(ms / 1000 / 60 / 60);
        return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Initialize sets state when data loads
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

    const toggleSetComplete = (exerciseId: string, index: number) => {
        const set = exerciseSets[exerciseId]?.[index];
        if (set) {
            updateSet(exerciseId, index, 'completed', !set.completed);
        }
    };

    if (isLoading || !sessionData) {
        return <div className="p-4 text-center">Lade Training...</div>;
    }

    return (
        <div className="pb-24">
            <div className="bg-gradient-to-br from-primary-dark to-primary -mx-4 -mt-4 px-8 pt-[calc(env(safe-area-inset-top)+40px)] pb-12 rounded-b-[2.5rem] mb-8 shadow-lg shadow-primary/20">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-heading font-bold text-white leading-tight max-w-[60%]">
                        {sessionData.planName}
                    </h1>
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white backdrop-blur-sm">
                        <Timer className="w-5 h-5" />
                        <span className="font-mono text-xl font-bold tracking-wider">{formatTime(elapsed)}</span>
                    </div>
                </div>
                <p className="text-primary-light/90 font-medium">{sessionData.exercises.length} Übungen</p>
            </div>

            <div className="px-4 space-y-6">
                {sessionData.exercises.map((exercise) => (
                    <Card key={exercise.exerciseId} className="overflow-hidden">
                        <div className="p-4 bg-bg-elevated border-b border-border">
                            <h3 className="font-bold text-lg">{exercise.exercise.name}</h3>
                            <p className="text-sm text-text-muted capitalize">{exercise.exercise.muscleGroupId}</p>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 text-xs text-text-muted font-medium mb-2 px-2">
                                <div className="w-6 text-center">#</div>
                                <div className="text-center">kg</div>
                                <div className="text-center">Wdh.</div>
                                <div className="w-8"></div>
                            </div>

                            {exerciseSets[exercise.exerciseId]?.map((set, index) => (
                                <div
                                    key={index}
                                    className={clsx(
                                        "grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-center p-2 rounded-lg transition-colors",
                                        set.completed ? "bg-success/10" : "bg-bg"
                                    )}
                                >
                                    <div className="w-6 text-center font-bold text-text-secondary">{index + 1}</div>
                                    <input
                                        type="number"
                                        value={set.weight || ''}
                                        onChange={(e) => updateSet(exercise.exerciseId, index, 'weight', Number(e.target.value))}
                                        placeholder="0"
                                        className="w-full bg-bg-input rounded px-2 py-1 text-center font-mono focus:ring-1 focus:ring-primary outline-none"
                                    />
                                    <input
                                        type="number"
                                        value={set.reps || ''}
                                        onChange={(e) => updateSet(exercise.exerciseId, index, 'reps', Number(e.target.value))}
                                        placeholder="0"
                                        className="w-full bg-bg-input rounded px-2 py-1 text-center font-mono focus:ring-1 focus:ring-primary outline-none"
                                    />
                                    <button
                                        onClick={() => toggleSetComplete(exercise.exerciseId, index)}
                                        className={clsx(
                                            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                            set.completed
                                                ? "bg-success text-white shadow-lg shadow-success/20 scale-110"
                                                : "bg-bg-elevated text-text-muted hover:bg-bg-elevated/80"
                                        )}
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full mt-2 text-text-secondary hover:text-primary hover:bg-primary/5"
                                onClick={() => addSet(exercise.exerciseId)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Satz hinzufügen
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
