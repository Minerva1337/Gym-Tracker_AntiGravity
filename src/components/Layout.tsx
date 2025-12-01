import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Dumbbell, Play, BarChart2 } from 'lucide-react';
import clsx from 'clsx';

export function Layout() {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/exercises', icon: Dumbbell, label: 'Übungen' },
        { path: '/training', icon: Play, label: 'Training', isFab: true },
        { path: '/analysis', icon: BarChart2, label: 'Analyse' },
    ];

    return (
        <div className="flex flex-col h-screen bg-bg text-text-primary">
            <main className="flex-1 overflow-y-auto pb-24">
                <Outlet />
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-bg/80 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)]">
                <div className="flex justify-around items-end px-4 py-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        if (item.isFab) {
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className="relative -top-6 flex flex-col items-center gap-1"
                                >
                                    <div className={clsx(
                                        "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all",
                                        isActive
                                            ? "bg-primary shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                                            : "bg-gradient-to-br from-primary to-primary-dark"
                                    )}>
                                        <Icon className="w-7 h-7 text-white fill-current" />
                                    </div>
                                    <span className={clsx("text-[11px] font-medium", isActive ? "text-primary" : "text-text-muted")}>
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
