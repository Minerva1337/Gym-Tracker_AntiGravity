import { Play, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface QuickActionsProps {
    onCreatePlan?: () => void;
}

export function QuickActions({ onCreatePlan }: QuickActionsProps) {
    const navigate = useNavigate();

    const handleCreatePlan = () => {
        if (onCreatePlan) {
            onCreatePlan();
        } else {
            navigate('/exercises');
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4 mb-8">
            <Button
                onClick={() => navigate('/training')}
                className="h-auto flex-col items-start p-4 space-y-2 bg-gradient-to-br from-primary to-primary-dark border-none"
            >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Play className="w-5 h-5 fill-current" />
                </div>
                <div className="text-left">
                    <div className="font-bold">Training starten</div>
                    <div className="text-xs opacity-80 font-normal">Wähle einen Plan</div>
                </div>
            </Button>

            <Button
                variant="secondary"
                onClick={handleCreatePlan}
                className="h-auto flex-col items-start p-4 space-y-2"
            >
                <div className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center">
                    <Plus className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                    <div className="font-bold text-text-primary">Neuer Plan</div>
                    <div className="text-xs text-text-secondary font-normal">Erstelle Routine</div>
                </div>
            </Button>
        </div>
    );
}
