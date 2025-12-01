import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block mb-2 text-xs font-medium text-text-secondary uppercase tracking-wider">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'w-full px-4 py-3 bg-bg-input border border-border rounded-xl text-text-primary text-lg font-medium placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-glow transition-all',
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);
Input.displayName = 'Input';
