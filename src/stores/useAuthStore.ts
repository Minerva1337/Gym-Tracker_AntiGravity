import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { type User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    signOut: () => Promise<void>;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    setUser: (user) => {
        // Update DB context
        import('../lib/db').then(({ db }) => {
            db.currentUserId = user?.id || null;
        });
        set({ user });
    },
    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null });
    },
    checkSession: async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            set({ user: session?.user || null, loading: false });
        } catch (error) {
            console.error('Error checking session:', error);
            set({ user: null, loading: false });
        }
    },
}));
