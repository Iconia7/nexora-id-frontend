import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = props.value || props.defaultValue;

    return (
      <div className="relative w-full mb-4">
        <div className={cn(
          "relative flex items-center rounded-2xl border bg-white transition-all duration-200",
          isFocused ? "border-amber-600 ring-2 ring-amber-500/10 shadow-sm" : "border-slate-200",
          error && "border-red-500 ring-red-500/10",
          className
        )}>
          <input
            {...props}
            type={type}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className="peer w-full px-4 pt-6 pb-2 text-slate-900 placeholder-transparent outline-none bg-transparent"
            placeholder={label}
          />
          <label className={cn(
            "absolute left-4 top-4 origin-[0] -translate-y-3 scale-75 transform text-slate-500 transition-all duration-200",
            "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-amber-600",
            (isFocused || hasValue) ? "-translate-y-3 scale-75 text-amber-600" : ""
          )}>
            {label}
          </label>
        </div>
        {error && <p className="mt-1 ml-2 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
