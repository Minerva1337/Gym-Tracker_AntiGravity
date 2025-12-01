import { ActiveSession } from '../components/training/ActiveSession';
import { PlanSelector } from '../components/training/PlanSelector';
import { useTrainingStore } from '../stores/useTrainingStore';
import { Button } from '../components/ui/Button';
import { Play, Plus } from 'lucide-react';
import { useState } from 'react';
import { TrainingPlanDialog } from '../components/training/TrainingPlanDialog';
import { useCreateTrainingPlan } from '../lib/hooks/useTrainingPlans';

export function TrainingPage() {
    const { activeSessionId, setActiveSession } = useTrainingStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const createPlan = useCreateTrainingPlan();

    if (activeSessionId) {
        return <ActiveSession />;
    }

    return (
        <div className="p-4 pt-[calc(env(safe-area-inset-top)+20px)]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-heading font-bold">Training</h1>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="secondary"
                        className="h-10 w-10 p-0 rounded-full"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <Plus className="w-5 h-5" />
                    </Button>
                    <Button size="sm" className="h-10 w-10 p-0 rounded-full" onClick={() => setActiveSession('quick-start')}>
                        <Play className="w-5 h-5 fill-current" />
                    </Button>
                </div>
            </div>

            <PlanSelector />

            <TrainingPlanDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={async (data) => {
                    await createPlan.mutateAsync(data);
                }}
            />
        </div>
    );
}
