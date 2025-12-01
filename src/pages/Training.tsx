import { ActiveSession } from '../components/training/ActiveSession';
import { PlanSelector } from '../components/training/PlanSelector';
import { useTrainingStore } from '../stores/useTrainingStore';
import { Button } from '../components/ui/Button';

export function TrainingPage() {
    const { activeSessionId, setActiveSession } = useTrainingStore();

    if (activeSessionId) {
        return (
            <div className="p-4 pt-[calc(env(safe-area-inset-top)+20px)]">
                <ActiveSession />
            </div>
        );
    }

    return (
        <div className="p-4 pt-[calc(env(safe-area-inset-top)+20px)]">
            <h1 className="text-2xl font-heading font-bold mb-6">Training starten</h1>

            <div className="mb-8">
                <PlanSelector />
            </div>

            <div className="flex justify-center">
                <Button
                    onClick={() => setActiveSession('demo-session')}
                    className="w-full"
                >
                    Quick Start (Demo)
                </Button>
            </div>
        </div>
    );
}
