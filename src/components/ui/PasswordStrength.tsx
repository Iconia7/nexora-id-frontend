import * as React from "react";
import { motion } from "framer-motion";

interface PasswordStrengthProps {
  password?: string;
}

export const PasswordStrength = ({ password = "" }: PasswordStrengthProps) => {
  const requirements = [
    { label: "8+ Char", test: (p: string) => p.length >= 8 },
    { label: "Number", test: (p: string) => /[0-9]/.test(p) },
    { label: "Symbol", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ];

  const strength = requirements.filter((req) => req.test(password)).length;
  
  const getStrengthLabel = () => {
    if (password.length === 0) return "";
    if (strength <= 1) return "Weak";
    if (strength === 2) return "Good";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (strength <= 1) return "bg-red-500";
    if (strength === 2) return "bg-amber-500";
    return "bg-emerald-500";
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex justify-between items-center px-1">
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Security Strength</span>
        <span className={`text-[9px] font-black uppercase tracking-widest ${strength === 3 ? "text-emerald-600" : strength === 2 ? "text-amber-600" : "text-red-600"}`}>
          {getStrengthLabel()}
        </span>
      </div>
      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(strength / 3) * 100}%` }}
          className={`h-full rounded-full transition-colors duration-500 ${getStrengthColor()}`}
        />
      </div>
    </div>
  );
};
