import { ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';

export function PlanSelector() {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-heading font-semibold text-text-muted uppercase tracking-wider text-sm mb-4">
                Wähle einen Plan
            </h2>

            <Card className="cursor-pointer hover:bg-bg-elevated transition-colors group">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg mb-1">Push Day</h3>
                        <p className="text-sm text-text-secondary">Brust, Schultern, Trizeps</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                </div>
                <div className="mt-4 flex gap-2">
                    <span className="px-2 py-1 rounded-full bg-primary-glow text-primary text-xs font-medium">
                        6 Übungen
                    </span>
                    <span className="px-2 py-1 rounded-full bg-bg-input text-text-secondary text-xs font-medium">
                        ~45 Min
                    </span>
                </div>
            </Card>

            <Card className="cursor-pointer hover:bg-bg-elevated transition-colors group">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg mb-1">Pull Day</h3>
                        <p className="text-sm text-text-secondary">Rücken, Bizeps</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                </div>
                <div className="mt-4 flex gap-2">
                    <span className="px-2 py-1 rounded-full bg-primary-glow text-primary text-xs font-medium">
                        5 Übungen
                    </span>
                    <span className="px-2 py-1 rounded-full bg-bg-input text-text-secondary text-xs font-medium">
                        ~40 Min
                    </span>
                </div>
            </Card>
        </div>
    );
}
