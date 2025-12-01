import { ActiveSession } from '../components/training/ActiveSession';
import { PlanSelector } from '../components/training/PlanSelector';
import { PlanDetail } from '../components/training/PlanDetail';
import { useTrainingStore } from '../stores/useTrainingStore';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { TrainingPlanDialog } from '../components/training/TrainingPlanDialog';
import { useCreateTrainingPlan, useDeleteTrainingPlan } from '../lib/hooks/useTrainingPlans';

import { useSearchParams } from 'react-router-dom';

import { type TrainingPlanWithExercises } from '../lib/hooks/useTrainingPlans';

export function TrainingPage() {
    const { activeSessionId } = useTrainingStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<TrainingPlanWithExercises | undefined>(undefined);

    const createPlan = useCreateTrainingPlan();
    const deletePlan = useDeleteTrainingPlan();
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedPlanId = searchParams.get('plan');

    if (activeSessionId) {
        return <ActiveSession />;
    }

    if (selectedPlanId) {
        return (
            <PlanDetail
                planId={selectedPlanId}
                onBack={() => setSearchParams({})}
            />
        );
    }

    const handleEditPlan = (plan: TrainingPlanWithExercises) => {
        setEditingPlan(plan);
        setIsDialogOpen(true);
    };

    const handleDeletePlan = async (planId: string) => {
        if (confirm('Möchtest du diesen Plan wirklich löschen?')) {
            await deletePlan.mutateAsync(planId);
        }
    };

    return (
        <div className="p-4 pt-[calc(env(safe-area-inset-top)+20px)]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-heading font-bold">Training</h1>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="secondary"
                        className="h-10 w-10 p-0 rounded-full"
                        onClick={() => {
                            setEditingPlan(undefined);
                            setIsDialogOpen(true);
                        }}
                    >
                        <Plus className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <PlanSelector
                onSelectPlan={(id) => setSearchParams({ plan: id })}
                onEditPlan={handleEditPlan}
                onDeletePlan={handleDeletePlan}
            />

            <TrainingPlanDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setEditingPlan(undefined);
                }}
                initialData={editingPlan ? {
                    name: editingPlan.name,
                    exercises: editingPlan.exercises.map(e => e.exerciseId)
                } : undefined}
                onSave={async (data) => {
                    if (editingPlan) {
                        // TODO: Implement update mutation
                        // For now, we might need to delete and recreate or add an update mutation
                        // Since update is not implemented in hooks yet, let's just log or maybe recreate
                        console.log('Update not implemented yet', data);
                        // Ideally we should have useUpdateTrainingPlan
                    } else {
                        await createPlan.mutateAsync(data);
                    }
                }}
            />
        </div>
    );
}
