import { QuickActions } from '../components/home/QuickActions';
import { LastSession } from '../components/home/LastSession';

import { UserMenu } from '../components/home/UserMenu';

import { useAuthStore } from '../stores/useAuthStore';

export function HomePage() {
    const { user } = useAuthStore();

    const getInitials = () => {
        if (!user?.user_metadata) return 'JD';
        const { first_name, last_name } = user.user_metadata;
        if (first_name && last_name) {
            return `${first_name[0]}${last_name[0]}`.toUpperCase();
        }
        return user.email?.substring(0, 2).toUpperCase() || 'JD';
    };

    return (
        <div className="p-4 pt-[calc(env(safe-area-inset-top)+20px)]">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-heading font-bold">Willkommen zurück</h1>
                    <p className="text-text-secondary text-sm">Bereit für dein Training?</p>
                </div>
                <UserMenu initials={getInitials()} />
            </header>

            <QuickActions />
            <LastSession />
        </div>
    );
}
