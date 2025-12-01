import * as React from 'react';
import { cn } from '../../lib/utils';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'bg-bg-card border border-border rounded-2xl p-4 shadow-sm',
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = 'Card';
