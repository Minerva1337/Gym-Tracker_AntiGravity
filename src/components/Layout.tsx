import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Home, Dumbbell, Play, BarChart2, Square } from 'lucide-react';
import clsx from 'clsx';
import { useSaveSession } from '../lib/hooks/useActiveSession';
import { useTrainingStore } from '../stores/useTrainingStore';

export function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { activeSessionId, setActiveSession } = useTrainingStore();
    const saveSession = useSaveSession();

    const planIdParam = searchParams.get('plan');
    const isPreviewMode = !!planIdParam;
    const isTrainingActive = !!activeSessionId;

    const handleFabClick = async () => {
        if (isPreviewMode) {
            // Start Training
            setActiveSession(planIdParam);
            setSearchParams({}); // Clear params
            navigate('/training');
        } else if (isTrainingActive) {
            // Finish Training
            if (confirm('Training wirklich beenden?')) {
                await saveSession.mutateAsync();
                navigate('/');
            }
        } else {
            // Default: Go to training view
            navigate('/training');
        }
    };

    const navItems: {
        path: string;
        icon: React.ElementType;
        label: string;
        isFab?: boolean;
        action?: () => void;
    }[] = [
            { path: '/', icon: Home, label: 'Home' },
            { path: '/exercises', icon: Dumbbell, label: 'Übungen' },
            {
                path: '/training',
                icon: isTrainingActive ? Square : Play, // Show Square if active (visual only for now), Play otherwise
                label: isPreviewMode ? 'Starten' : (isTrainingActive ? 'Training' : 'Training'),
                isFab: true,
                action: handleFabClick
            },
            { path: '/analysis', icon: BarChart2, label: 'Analyse' },
        ];

    return (
        <div className="flex flex-col h-screen bg-bg text-text-primary">
            <main className="flex-1 overflow-y-auto pb-24">
                <Outlet />
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-bg/80 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)] z-50">
                <div className="flex justify-around items-end px-4 py-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        if (item.isFab) {
                            return (
                                <button
                                    key={item.path}
                                    onClick={item.action || (() => navigate(item.path))}
                                    className="relative -top-6 flex flex-col items-center gap-1 group"
                                >
                                    <div className={clsx(
                                        "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
                                        isPreviewMode
                                            ? "bg-success shadow-[0_0_20px_rgba(34,197,94,0.5)] scale-110"
                                            : (isActive || isTrainingActive
                                                ? "bg-primary shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                                                : "bg-gradient-to-br from-primary to-primary-dark")
                                    )}>
                                        <Icon className={clsx(
                                            "w-7 h-7 text-white fill-current transition-transform",
                                            isPreviewMode && "ml-1" // Optical adjustment for Play icon
                                        )} />
                                    </div>
                                    <span className={clsx(
                                        "text-[11px] font-medium transition-colors",
                                        isPreviewMode ? "text-success font-bold" : (isActive ? "text-primary" : "text-text-muted")
                                    )}>
                                        {item.label}
                                    </span>
                                </button>
                            );
                        }

                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className="flex flex-col items-center gap-1 p-2"
                            >
                                <div className={clsx(
                                    "w-11 h-8 rounded-full flex items-center justify-center transition-colors",
                                    isActive && "bg-primary-glow"
                                )}>
                                    <Icon className={clsx("w-6 h-6", isActive ? "text-primary" : "text-text-muted")} />
                                </div>
                                <span className={clsx("text-[11px] font-medium", isActive ? "text-primary" : "text-text-muted")}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
