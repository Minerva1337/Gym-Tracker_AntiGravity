import { AnalysisChart } from '../components/analysis/AnalysisChart';

export function AnalysisPage() {
    return (
        <div className="p-4 pt-[calc(env(safe-area-inset-top)+20px)]">
            <h1 className="text-2xl font-heading font-bold mb-6">Analyse</h1>

            <div className="space-y-6">
                <AnalysisChart />

                {/* Placeholder for more charts */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-bg-card border border-border rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-primary mb-1">12</div>
                        <div className="text-xs text-text-muted uppercase">Sessions</div>
                    </div>
                    <div className="bg-bg-card border border-border rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-success mb-1">+5%</div>
                        <div className="text-xs text-text-muted uppercase">Progress</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
