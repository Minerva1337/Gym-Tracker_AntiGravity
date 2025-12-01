import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'full';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all active:scale-98 disabled:opacity-50 disabled:pointer-events-none',
                    {
                        'bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary-glow hover:shadow-xl hover:shadow-primary/40': variant === 'primary',
                        'bg-bg-input text-text-primary border border-border hover:bg-bg-elevated': variant === 'secondary',
                        'bg-transparent text-primary hover:bg-primary-light/10': variant === 'ghost',
                        'px-3 py-1.5 text-sm min-h-[40px]': size === 'sm',
                        'px-6 py-3 text-base min-h-[52px]': size === 'md',
                        'px-8 py-4 text-lg min-h-[60px]': size === 'lg',
                        'w-full py-3 text-base min-h-[52px]': size === 'full',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';
