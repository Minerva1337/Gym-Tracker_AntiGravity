import { Card } from '../ui/Card';
import { Calendar, Trophy } from 'lucide-react';

export function LastSession() {
    // TODO: Fetch real data
    const hasData = false;

    if (!hasData) {
        return (
            <Card className="bg-gradient-to-br from-bg-card to-primary/5 border-primary-glow/50">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-semibold text-lg">Letztes Training</h2>
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
        <Card className="bg-gradient-to-br from-bg-card to-primary/10 border-primary-glow">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="font-heading font-bold text-xl mb-1">Push Day</h2>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <Calendar className="w-3 h-3" />
                        <span>Heute, 14:30</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-heading font-bold text-primary">45</div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wider">Minuten</div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-bg-elevated rounded-xl">
                    <div className="text-lg font-bold text-text-primary">6</div>
                    <div className="text-[10px] text-text-muted uppercase">Übungen</div>
                </div>
                <div className="text-center p-3 bg-bg-elevated rounded-xl">
                    <div className="text-lg font-bold text-text-primary">18</div>
                    <div className="text-[10px] text-text-muted uppercase">Sätze</div>
                </div>
                <div className="text-center p-3 bg-bg-elevated rounded-xl">
                    <div className="text-lg font-bold text-text-primary">4.2t</div>
                    <div className="text-[10px] text-text-muted uppercase">Volumen</div>
                </div>
            </div>
        </Card>
    );
}
