import { ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { useTrainingPlans } from '../../lib/hooks/useTrainingPlans';
import { useTrainingStore } from '../../stores/useTrainingStore';

interface PlanSelectorProps {
    onSelectPlan?: (planId: string) => void;
}

export function PlanSelector({ onSelectPlan }: PlanSelectorProps) {
    const { data: plans, isLoading } = useTrainingPlans();
    const { setActiveSession } = useTrainingStore();

    const handleSelectPlan = (planId: string) => {
        if (onSelectPlan) {
            onSelectPlan(planId);
        } else {
            setActiveSession(planId);
        }
    };

    if (isLoading) {
        return <div className="text-center text-text-muted py-8">Lade Pläne...</div>;
    }

    if (!plans || plans.length === 0) {
        return (
            <div className="text-center text-text-muted py-8 bg-bg-elevated/50 rounded-xl border border-dashed border-border">
                <p>Noch keine Trainingspläne.</p>
                <p className="text-sm mt-1">Erstelle deinen ersten Plan!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-heading font-semibold text-text-muted uppercase tracking-wider text-sm mb-4">
                Wähle einen Plan
            </h2>

            {plans.map((plan) => (
                <Card
                    key={plan.id}
                    className="cursor-pointer hover:bg-bg-elevated transition-colors group"
                    onClick={() => handleSelectPlan(plan.id)}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                            <p className="text-sm text-text-secondary">
                                {plan.exercises.length} Übungen
                            </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                    </div>
                </Card>
            ))}
        </div>
    );
}
