import { ChevronDown, Dumbbell, Edit2, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { type Exercise } from '../../lib/db';
import { Button } from '../ui/Button';

interface ExerciseCardProps {
    exercise: Exercise;
    onEdit: (exercise: Exercise) => void;
    onDelete: (id: string) => void;
}

export function ExerciseCard({ exercise, onEdit, onDelete }: ExerciseCardProps) {
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
                        <p className="text-xs text-text-muted capitalize">{exercise.muscleGroupId}</p>
                    </div>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-text-muted transition-transform", isExpanded && "rotate-180")} />
            </div>

            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-2 bg-bg-elevated rounded-lg">
                            <div className="text-lg font-bold text-text-primary">-</div>
                            <div className="text-[10px] text-text-muted uppercase">Max</div>
                        </div>
                        <div className="text-center p-2 bg-bg-elevated rounded-lg">
                            <div className="text-lg font-bold text-text-primary">-</div>
                            <div className="text-[10px] text-text-muted uppercase">Volumen</div>
                        </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-error hover:text-error hover:bg-error/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Möchtest du diese Übung wirklich löschen?')) {
                                    onDelete(exercise.id);
                                }
                            }}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Löschen
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(exercise);
                            }}
                        >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Bearbeiten
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
}
