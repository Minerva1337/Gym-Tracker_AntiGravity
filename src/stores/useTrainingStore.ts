import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ActiveSet {
    weight: number;
    reps: number;
    completed: boolean;
}

interface ActiveSessionState {
    activeSessionId: string | null;
    startTime: number | null;
    exerciseSets: Record<string, ActiveSet[]>;
    setActiveSession: (sessionId: string) => void;
    setExerciseSets: (sets: Record<string, ActiveSet[]>) => void;
    updateSet: (exerciseId: string, index: number, field: keyof ActiveSet, value: number | boolean) => void;
    addSet: (exerciseId: string) => void;
    endSession: () => void;
}

export const useTrainingStore = create<ActiveSessionState>()(
    persist(
        (set) => ({
            activeSessionId: null,
            startTime: null,
            exerciseSets: {},
            setActiveSession: (sessionId) => set({
                activeSessionId: sessionId,
                startTime: Date.now(),
                exerciseSets: {} // Reset sets on new session
            }),
            setExerciseSets: (sets) => set({ exerciseSets: sets }),
            updateSet: (exerciseId, index, field, value) => set((state) => ({
                exerciseSets: {
                    ...state.exerciseSets,
                    [exerciseId]: state.exerciseSets[exerciseId].map((s, i) =>
                        i === index ? { ...s, [field]: value } : s
                    )
                }
            })),
            addSet: (exerciseId) => set((state) => ({
                exerciseSets: {
                    ...state.exerciseSets,
                    [exerciseId]: [...(state.exerciseSets[exerciseId] || []), { weight: 0, reps: 0, completed: false }]
                }
            })),
            endSession: () => set({ activeSessionId: null, startTime: null, exerciseSets: {} }),
        }),
        {
            name: 'training-storage',
        }
    )
);
