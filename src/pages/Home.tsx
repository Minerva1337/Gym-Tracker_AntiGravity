import { QuickActions } from '../components/home/QuickActions';
import { LastSession } from '../components/home/LastSession';

export function HomePage() {
    return (
        <div className="p-4 pt-[calc(env(safe-area-inset-top)+20px)]">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-heading font-bold">Willkommen zurück</h1>
                    <p className="text-text-secondary text-sm">Bereit für dein Training?</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary-light/10 flex items-center justify-center text-primary font-bold">
                    JD
                </div>
            </header>

            <QuickActions />
            <LastSession />
        </div>
    );
}
