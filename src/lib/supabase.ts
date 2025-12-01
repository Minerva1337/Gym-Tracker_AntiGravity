import { createClient } from '@supabase/supabase-js';

// These should be environment variables in a real app
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Mock Client for development if credentials are missing
const isMock = SUPABASE_URL === 'https://your-project.supabase.co';

const mockClient = {
    auth: {
        signUp: async ({ email, password, options }: { email: string; password: string; options?: { data: Record<string, unknown> } }) => {
            console.log('Mock SignUp:', email, password, options);
            const user = {
                id: 'mock-user-id',
                email,
                user_metadata: options?.data || {}
            };
            localStorage.setItem('mock-session', JSON.stringify({ user }));
            return { data: { user }, error: null };
        },
        signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
            console.log('Mock SignIn:', email, password);
            if (password === 'error') return { data: null, error: { message: 'Invalid login' } };

            // Try to get existing user metadata from session if available, otherwise default
            const storedSession = localStorage.getItem('mock-session');
            const storedUser = storedSession ? JSON.parse(storedSession).user : null;

            const user = {
                id: 'mock-user-id',
                email,
                user_metadata: storedUser?.user_metadata || { first_name: 'John', last_name: 'Doe' }
            };
            const session = { user };
            localStorage.setItem('mock-session', JSON.stringify(session));
            return { data: { user, session }, error: null };
        },
        signOut: async () => {
            console.log('Mock SignOut');
            localStorage.removeItem('mock-session');
            return { error: null };
        },
        getSession: async () => {
            const session = localStorage.getItem('mock-session');
            return { data: { session: session ? JSON.parse(session) : null }, error: null };
        },
        onAuthStateChange: () => {
            return { data: { subscription: { unsubscribe: () => { } } } };
        }
    }
};

export const supabase = isMock ? (mockClient as unknown as ReturnType<typeof createClient>) : createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
