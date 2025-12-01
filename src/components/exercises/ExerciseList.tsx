import { type Exercise } from '../../lib/db';
import { ExerciseCard } from './ExerciseCard';

// Mock data for now
const MOCK_EXERCISES: Exercise[] = [
    { id: '1', userId: '1', name: 'Bankdrücken', muscleGroupId: 'chest', syncStatus: 'synced', createdAt: Date.now() },
    { id: '2', userId: '1', name: 'Kniebeugen', muscleGroupId: 'legs', syncStatus: 'synced', createdAt: Date.now() },
    { id: '3', userId: '1', name: 'Kreuzheben', muscleGroupId: 'back', syncStatus: 'synced', createdAt: Date.now() },
];

export function ExerciseList() {
    return (
        <div className="space-y-4">
            {MOCK_EXERCISES.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
        </div>
    );
}
