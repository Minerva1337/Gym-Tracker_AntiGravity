import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SetInputRow } from './SetInputRow';
import { Dumbbell, Plus, Timer } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTrainingStore } from '../../stores/useTrainingStore';

export function ActiveSession() {
    const { endSession, startTime } = useTrainingStore();
    const [elapsed, setElapsed] = useState(0);

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

    return (
        <div className="pb-20">
            <div className="bg-gradient-to-br from-primary-dark to-primary -mx-4 -mt-4 px-4 pt-4 pb-8 rounded-b-3xl mb-6 shadow-lg shadow-primary/20">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-heading font-bold text-white">Push Day</h1>
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-white text-sm font-medium backdrop-blur-sm">
                        <Timer className="w-4 h-4" />
                        <span>{formatTime(elapsed)}</span>
                    </div>
                </div>
                <p className="text-primary-light/80 text-sm">3 Übungen verbleibend</p>
            </div>

            <div className="space-y-6">
                {/* Exercise 1 */}
                <Card>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-light/10 flex items-center justify-center text-primary">
                            <Dumbbell className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Bankdrücken</h3>
                            <p className="text-xs text-text-muted">Brust • Langhantel</p>
                        </div>
                    </div>

                    <div className="mb-2 grid grid-cols-[40px_1fr_1fr_44px] gap-2 text-[10px] uppercase tracking-wider text-text-muted font-medium text-center">
                        <div>Set</div>
                        <div>kg</div>
                        <div>Reps</div>
                        <div>✓</div>
                    </div>

                    <div className="space-y-0">
                        <SetInputRow setNumber={1} prevWeight={80} prevReps={10} />
                        <SetInputRow setNumber={2} prevWeight={80} prevReps={8} />
                        <SetInputRow setNumber={3} prevWeight={75} prevReps={8} />
                    </div>

                    <Button variant="ghost" size="sm" className="w-full mt-2 text-text-secondary hover:text-primary">
                        <Plus className="w-4 h-4 mr-1" />
                        Satz hinzufügen
                    </Button>
                </Card>

                {/* Exercise 2 */}
                <Card>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-light/10 flex items-center justify-center text-primary">
                            <Dumbbell className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Schulterdrücken</h3>
                            <p className="text-xs text-text-muted">Schultern • Kurzhantel</p>
                        </div>
                    </div>

                    <div className="mb-2 grid grid-cols-[40px_1fr_1fr_44px] gap-2 text-[10px] uppercase tracking-wider text-text-muted font-medium text-center">
                        <div>Set</div>
                        <div>kg</div>
                        <div>Reps</div>
                        <div>✓</div>
                    </div>

                    <div className="space-y-0">
                        <SetInputRow setNumber={1} prevWeight={24} prevReps={12} />
                        <SetInputRow setNumber={2} prevWeight={24} prevReps={10} />
                        <SetInputRow setNumber={3} prevWeight={24} prevReps={9} />
                    </div>

                    <Button variant="ghost" size="sm" className="w-full mt-2 text-text-secondary hover:text-primary">
                        <Plus className="w-4 h-4 mr-1" />
                        Satz hinzufügen
                    </Button>
                </Card>

                <Button
                    size="lg"
                    className="w-full shadow-xl shadow-primary/20"
                    onClick={endSession}
                >
                    Training beenden
                </Button>
            </div>
        </div>
    );
}
