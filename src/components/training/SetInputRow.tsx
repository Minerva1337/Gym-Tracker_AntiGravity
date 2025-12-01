import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';

interface SetInputRowProps {
    setNumber: number;
    prevWeight?: number;
    prevReps?: number;
}

export function SetInputRow({ setNumber, prevWeight, prevReps }: SetInputRowProps) {
    const [isCompleted, setIsCompleted] = useState(false);
    const [weight, setWeight] = useState(prevWeight?.toString() || '');
    const [reps, setReps] = useState(prevReps?.toString() || '');

    const isChanged = weight !== prevWeight?.toString() || reps !== prevReps?.toString();

    return (
        <div className="grid grid-cols-[40px_1fr_1fr_44px] gap-2 items-center py-2 border-b border-border last:border-0">
            <div className="w-8 h-8 flex items-center justify-center bg-bg-input rounded-lg text-sm font-semibold text-text-secondary">
                {setNumber}
            </div>

            <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={prevWeight?.toString() || '-'}
                className={cn(
                    "w-full p-2 bg-bg-input border border-border rounded-lg text-center font-semibold focus:outline-none focus:border-primary transition-colors",
                    isChanged && "border-success/50 bg-success/10"
                )}
            />

            <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder={prevReps?.toString() || '-'}
                className={cn(
                    "w-full p-2 bg-bg-input border border-border rounded-lg text-center font-semibold focus:outline-none focus:border-primary transition-colors",
                    isChanged && "border-success/50 bg-success/10"
                )}
            />

            <button
                onClick={() => setIsCompleted(!isCompleted)}
                className={cn(
                    "w-11 h-11 flex items-center justify-center border-2 rounded-lg transition-all",
                    isCompleted
                        ? "bg-success border-success text-white"
                        : "border-border text-transparent hover:border-primary/50"
                )}
            >
                <Check className="w-5 h-5" />
            </button>
        </div>
    );
}
