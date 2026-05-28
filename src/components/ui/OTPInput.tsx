import * as React from 'react';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  disabled?: boolean;
}

export const OTPInput = ({ length = 6, onComplete, disabled }: OTPInputProps) => {
  const [code, setCode] = React.useState<string[]>(new Array(length).fill(""));
  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    
    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    // Auto-focus next
    if (value && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (newCode.every(v => v !== "")) {
      onComplete(newCode.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputs.current[index] = el; }}
          type="text"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={cn(
            "w-10 sm:w-12 h-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl sm:rounded-2xl border-2 transition-all outline-none",
            digit ? "border-[#960c1d] bg-[#960c1d]/5 text-[#010a26]" : "border-slate-200 bg-slate-50 text-slate-400",
            "focus:border-[#960c1d] focus:ring-4 focus:ring-[#960c1d]/10",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      ))}
    </div>
  );
};
