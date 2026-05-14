"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info, ShieldCheck } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 50, scale: 0.9, filter: "blur(10px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="pointer-events-auto"
            >
              <div className={`
                flex items-center gap-4 p-4 pr-12 rounded-[1.5rem] shadow-[0_20px_50px_rgba(1,10,38,0.15)] 
                border backdrop-blur-xl relative overflow-hidden group min-w-[340px]
                ${toast.type === "success" ? "bg-white/90 border-emerald-100/50" : 
                  toast.type === "error" ? "bg-white/90 border-red-100/50" : 
                  "bg-white/90 border-[#010a26]/10"}
              `}>
                {/* Decorative Brand Accent */}
                <div className={`
                  absolute top-0 left-0 bottom-0 w-1.5
                  ${toast.type === "success" ? "bg-emerald-500" : 
                    toast.type === "error" ? "bg-[#960c1d]" : 
                    "bg-[#010a26]"}
                `} />

                <div className={`
                  w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm
                  ${toast.type === "success" ? "bg-emerald-50 text-emerald-600" : 
                    toast.type === "error" ? "bg-red-50 text-[#960c1d]" : 
                    "bg-[#010a26]/5 text-[#010a26]"}
                `}>
                  {toast.type === "success" ? <CheckCircle2 className="w-5.5 h-5.5" /> : 
                   toast.type === "error" ? <AlertCircle className="w-5.5 h-5.5" /> : 
                   <ShieldCheck className="w-5.5 h-5.5" />}
                </div>
                
                <div className="flex flex-col gap-0.5">
                  <p className="text-[13px] font-bold text-[#010a26] uppercase tracking-wider">
                    {toast.type === "success" ? "Verified" : toast.type === "error" ? "System Alert" : "Security Update"}
                  </p>
                  <p className="text-[14px] text-slate-500 font-medium leading-relaxed">{toast.message}</p>
                </div>

                <button 
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 text-slate-300 hover:text-slate-500 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
                
                {/* Micro Progress Indicator */}
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className={`
                    absolute bottom-0 left-0 h-[3px] opacity-40
                    ${toast.type === "success" ? "bg-emerald-500" : 
                      toast.type === "error" ? "bg-[#960c1d]" : 
                      "bg-[#010a26]"}
                  `}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
