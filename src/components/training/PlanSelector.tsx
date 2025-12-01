
import { ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { useTrainingPlans, type TrainingPlanWithExercises } from '../../lib/hooks/useTrainingPlans';
import { useTrainingStore } from '../../stores/useTrainingStore';
import { motion, useMotionValue, type PanInfo } from 'framer-motion';
import { Button } from '../ui/Button';

interface PlanSelectorProps {
    onSelectPlan?: (planId: string) => void;
    onEditPlan?: (plan: TrainingPlanWithExercises) => void;
    onDeletePlan?: (planId: string) => void;
}

function PlanListItem({ plan, onSelect, onEdit, onDelete }: {
    plan: TrainingPlanWithExercises;
    onSelect: (id: string) => void;
    onEdit?: (plan: TrainingPlanWithExercises) => void;
    onDelete?: (id: string) => void;
}) {
    const x = useMotionValue(0);

    // Only allow swipe left
    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x < -100) {
            // Swiped far enough
            // Keep it open or trigger delete?
            // For now, let's just snap back but show the button clearly during drag
            // Or better: snap to -80 to show button
        }
    };

    return (
        <div className="relative mb-4">
            {/* Delete Button Background */}
            <div className="absolute inset-0 flex justify-end items-center pr-4 bg-destructive/10 rounded-xl">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/20 hover:text-destructive h-10 w-10 p-0"
                    onClick={() => onDelete?.(plan.id)}
                >
                    <Trash2 className="w-5 h-5" />
                </Button>
            </div>

            {/* Foreground Card */}
            <motion.div
                style={{ x }}
                drag="x"
                dragConstraints={{ left: -100, right: 0 }}
                onDragEnd={handleDragEnd}
                className="relative bg-bg-card rounded-xl"
            >
                <Card
                    className="cursor-pointer hover:bg-bg-elevated transition-colors group relative z-10"
                    onClick={() => onSelect(plan.id)}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                            <p className="text-sm text-text-secondary">
                                {plan.exercises.length} Übungen
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 text-text-muted hover:text-primary p-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit?.(plan);
                                }}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}

export function PlanSelector({ onSelectPlan, onEditPlan, onDeletePlan }: PlanSelectorProps) {
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
                <PlanListItem
                    key={plan.id}
                    plan={plan}
                    onSelect={handleSelectPlan}
                    onEdit={onEditPlan}
                    onDelete={onDeletePlan}
                />
            ))}
        </div>
    );
}
