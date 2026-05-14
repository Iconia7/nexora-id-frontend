import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'ghost' | 'outline';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, isLoading, variant = 'primary', children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-600/20',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
      outline: 'bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl py-4 px-6 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
          variants[variant],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
