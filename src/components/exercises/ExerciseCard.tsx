import { ChevronDown, Dumbbell } from 'lucide-react';
import { Card } from '../ui/Card';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { type Exercise } from '../../lib/db';

interface ExerciseCardProps {
    exercise: Exercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card className={cn("transition-all duration-200", isExpanded && "ring-1 ring-primary-glow")}>
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary-light/10 flex items-center justify-center text-primary">
                        <Dumbbell className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-text-primary">{exercise.name}</h3>
                        <p className="text-xs text-text-muted">Brust • Langhantel</p>
                    </div>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-text-muted transition-transform", isExpanded && "rotate-180")} />
            </div>

            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-2 bg-bg-elevated rounded-lg">
                            <div className="text-lg font-bold text-text-primary">85kg</div>
                            <div className="text-[10px] text-text-muted uppercase">Max</div>
                        </div>
                        <div className="text-center p-2 bg-bg-elevated rounded-lg">
                            <div className="text-lg font-bold text-text-primary">1.2t</div>
                            <div className="text-[10px] text-text-muted uppercase">Volumen</div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
