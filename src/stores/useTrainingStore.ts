import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ActiveSessionState {
    activeSessionId: string | null;
    startTime: number | null;
    setActiveSession: (sessionId: string) => void;
    endSession: () => void;
}

export const useTrainingStore = create<ActiveSessionState>()(
    persist(
        (set) => ({
            activeSessionId: null,
            startTime: null,
            setActiveSession: (sessionId) => set({ activeSessionId: sessionId, startTime: Date.now() }),
            endSession: () => set({ activeSessionId: null, startTime: null }),
        }),
        {
            name: 'training-storage',
        }
    )
);
