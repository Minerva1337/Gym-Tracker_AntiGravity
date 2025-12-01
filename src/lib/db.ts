import Dexie, { type Table } from 'dexie';

export interface Exercise {
    id: string;
    userId: string;
    name: string;
    muscleGroupId: string;
    syncStatus: 'local' | 'pending' | 'synced' | 'conflict';
    createdAt: number;
}

export interface TrainingPlan {
    id: string;
    userId: string;
    name: string;
    syncStatus: 'local' | 'pending' | 'synced' | 'conflict';
    createdAt: number;
}

export interface PlanExercise {
    id: string;
    planId: string;
    exerciseId: string;
    order: number;
    defaultSets: number;
}

export interface TrainingSession {
    id: string;
    planId: string;
    startedAt: number;
    completedAt?: number;
    syncStatus: 'local' | 'pending' | 'synced' | 'conflict';
}

export interface ExerciseSet {
    id: string;
    sessionId: string;
    exerciseId: string;
    setNumber: number;
    weight?: number;
    reps?: number;
    notes?: string;
    excludeFromAnalysis: boolean;
    createdAt: number;
    syncStatus: 'local' | 'pending' | 'synced' | 'conflict';
}

export interface SyncQueueItem {
    id?: number;
    tableName: string;
    operation: 'create' | 'update' | 'delete';
    recordId: string;
    timestamp: number;
}

export class FitTrackDB extends Dexie {
    exercises!: Table<Exercise>;
    trainingPlans!: Table<TrainingPlan>;
    planExercises!: Table<PlanExercise>;
    trainingSessions!: Table<TrainingSession>;
    exerciseSets!: Table<ExerciseSet>;
    syncQueue!: Table<SyncQueueItem>;

    constructor() {
        super('FitTrackDB');
        this.version(1).stores({
            exercises: 'id, userId, muscleGroupId, syncStatus',
            trainingPlans: 'id, userId, syncStatus',
            planExercises: 'id, planId, exerciseId',
            trainingSessions: 'id, planId, startedAt, syncStatus',
            exerciseSets: 'id, sessionId, exerciseId, syncStatus',
            syncQueue: '++id, tableName, timestamp'
        });
    }
}

export const db = new FitTrackDB();
