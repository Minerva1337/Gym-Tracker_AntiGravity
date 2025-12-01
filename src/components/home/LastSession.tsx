import { Card } from '../ui/Card';
import { Calendar, Trophy, RotateCcw } from 'lucide-react';
import { useTrainingHistory } from '../../lib/hooks/useActiveSession';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export function LastSession() {
    const { data: history, isLoading } = useTrainingHistory();
    const navigate = useNavigate();

    const handleRepeat = (planId: string) => {
        // We navigate to training page and select the plan (via store or query param?)
        // Since TrainingPage uses local state for selection, we might need to pass it via navigation state
        // OR we just start it directly? 
        // User said: "Training wiederholen, dann gelangt man in die detailansicht"
        // So we should probably navigate to TrainingPage with some state to open the detail view.
        // For now, let's just navigate to training. 
        // Ideally we would have a route like /training/plan/:id
        // But given the current structure, let's just start it for now or find a way to trigger preview.
        // Actually, if we set activeSessionId, it starts immediately.
        // If we want preview, we need to communicate with TrainingPage.
        // Let's assume for now we just navigate to training and user selects it, 
        // OR we implement a proper route for plan details.
        // Let's try to start it directly as "Repeat" usually implies quick start, 
        // BUT user asked for detail view.
        // Let's use a query param ?plan=ID and handle it in TrainingPage.
        navigate(`/training?plan=${planId}`);
    };

    if (isLoading) {
        return <div className="text-center py-8 text-text-muted">Lade Historie...</div>;
    }

    if (!history || history.length === 0) {
        return (
            <Card className="bg-gradient-to-br from-bg-card to-primary/5 border-primary-glow/50">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-semibold text-lg">Letzte Trainings</h2>
                    <span className="text-xs font-medium text-text-muted bg-bg-elevated px-2 py-1 rounded-full">
                        Keine Daten
                    </span>
                </div>
                <div className="py-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-bg-elevated mx-auto flex items-center justify-center mb-4">
                        <Trophy className="w-8 h-8 text-text-muted" />
                    </div>
                    <p className="text-text-secondary text-sm max-w-[200px] mx-auto">
                        Starte dein erstes Training, um hier deine Fortschritte zu sehen.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="font-heading font-semibold text-lg">Letzte Trainings</h2>

            {history.map((session) => (
                <Card key={session.id} className="bg-gradient-to-br from-bg-card to-primary/5 border-primary-glow/30">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-lg mb-1">{session.planName}</h3>
                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                                <Calendar className="w-3 h-3" />
                                <span>{session.completedAt ? new Date(session.completedAt).toLocaleDateString() : 'Unbekannt'}</span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRepeat(session.planId)}
                            className="text-primary hover:bg-primary/10"
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Wiederholen
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="text-center p-2 bg-bg-elevated rounded-lg">
                            <div className="font-bold text-text-primary">{session.completedAt && session.startedAt ? Math.round((session.completedAt - session.startedAt) / 60000) : 0}</div>
                            <div className="text-[10px] text-text-muted uppercase">Min</div>
                        </div>
                        <div className="text-center p-2 bg-bg-elevated rounded-lg">
                            <div className="font-bold text-text-primary">{session.totalSets}</div>
                            <div className="text-[10px] text-text-muted uppercase">Sätze</div>
                        </div>
                        <div className="text-center p-2 bg-bg-elevated rounded-lg">
                            <div className="font-bold text-text-primary">{Math.round(session.totalVolume / 1000)}t</div>
                            <div className="text-[10px] text-text-muted uppercase">Volumen</div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
