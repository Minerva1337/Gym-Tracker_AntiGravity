import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Dumbbell, ChevronLeft, Clock } from 'lucide-react';
import { usePlan } from '../../lib/hooks/useActiveSession';

interface PlanDetailProps {
    planId: string;
    onStart: () => void;
    onBack: () => void;
}

export function PlanDetail({ planId, onBack }: Omit<PlanDetailProps, 'onStart'>) {
    const { data: plan, isLoading } = usePlan(planId);

    if (isLoading) {
        return <div className="text-center py-8 text-text-muted">Lade Plan...</div>;
    }

    if (!plan) {
        return (
            <div className="text-center py-8">
                <p className="text-text-muted mb-4">Plan nicht gefunden</p>
                <Button onClick={onBack} variant="secondary">Zurück</Button>
            </div>
        );
    }

    return (
        <div className="pb-20 pt-[calc(env(safe-area-inset-top)+20px)] px-4">
            <Button
                variant="ghost"
                size="sm"
                className="mb-4 pl-0 text-text-secondary hover:text-primary"
                onClick={onBack}
            >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Zurück
            </Button>

            <div className="mb-6">
                <h1 className="text-3xl font-heading font-bold mb-2">{plan.planName}</h1>
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-1">
                        <Dumbbell className="w-4 h-4" />
                        <span>{plan.exercises.length} Übungen</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>~45 Min</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4 mb-24">
                {plan.exercises.map((item, index) => (
                    <Card key={item.exerciseId} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center text-text-secondary font-bold text-sm">
                            {index + 1}
                        </div>
                        <div>
                            <h3 className="font-bold">{item.exercise.name}</h3>
                            <p className="text-xs text-text-muted capitalize">{item.exercise.muscleGroupId}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
