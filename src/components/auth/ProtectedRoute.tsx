import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useEffect } from 'react';

export function ProtectedRoute() {
    const { user, loading, checkSession } = useAuthStore();

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-bg">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/onboarding" replace />;
    }

    return <Outlet />;
}
