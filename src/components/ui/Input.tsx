import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, rightElement, ...props }, ref) => {
    return (
      <div className="w-full relative group">
        <input
          {...props}
          type={type}
          ref={ref}
          className={cn(
            "flex h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm ring-offset-white transition-all",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-slate-400 outline-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#960c1d]/10 focus-visible:border-[#960c1d]/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            rightElement && "pr-12",
            error && "border-red-500 focus-visible:ring-red-500/10",
            className
          )}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {rightElement}
          </div>
        )}
        {error && <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
