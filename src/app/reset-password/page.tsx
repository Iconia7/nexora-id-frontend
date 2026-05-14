"use client";

export const dynamic = 'force-dynamic';

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

import { Suspense } from "react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const token = searchParams.get("token");

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: ResetFormValues) => {
    if (!token) {
      showToast("Invalid reset token.", "error");
      return;
    }
    setIsLoading(true);
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password: data.password }),
      });
      setIsSuccess(true);
      showToast("Password reset successfully", "success");
      setTimeout(() => router.push('/login'), 3000);
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      {/* Left Section: Hero */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex lg:w-1/2 relative bg-[#010a26] p-16 flex-col justify-center items-center overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "url('/brand/pattern.png')", backgroundSize: "400px auto", filter: "invert(1)" }} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] bg-[#960c1d]/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[20%] left-[10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full" />
        </div>

        {/* Top Logo */}
        <div className="absolute top-16 z-10 flex flex-row items-center gap-6 text-white group">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 transition-transform group-hover:scale-105 duration-500">
            <img src="/brand/logo.png" alt="Nexora" className="w-10 h-10 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-[0.2em] uppercase text-white">Nexora ID</span>
            <span className="text-[9px] font-bold tracking-[0.4em] uppercase opacity-40">Identity Provider</span>
          </div>
        </div>

        <div className="relative z-10 mt-24 space-y-12 text-center flex flex-col items-center">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-white leading-tight max-w-sm pt-4"
          >
            Securing your <span className="text-[#960c1d]">Nexora</span> Identity.
          </motion.h2>

          <div className="flex flex-row gap-8 w-full max-w-2xl pb-12">
            <FeatureItem icon={<Lock className="w-4 h-4" />} title="Safe & Secure" desc="End-to-end encryption for all identity changes." />
            <FeatureItem icon={<ShieldCheck className="w-4 h-4" />} title="Guard Protection" desc="Real-time monitoring of sensitive actions." />
            <FeatureItem icon={<ShieldCheck className="w-4 h-4" />} title="Global Identity" desc="Updates reflect across all Nexora apps instantly." />
          </div>
        </div>

        <div className="absolute bottom-12 z-10 text-white/30 text-[9px] font-bold uppercase tracking-[0.3em]">
          Protected by Nexora Guard
        </div>
      </motion.div>

      {/* Right Section: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md py-8"
        >
          <div className="mb-6 lg:hidden flex flex-col items-center gap-4 text-center">
            <img src="/brand/logo.png" alt="Nexora" className="w-14 h-14 object-contain" />
            <span className="text-xl font-bold text-[#010a26] tracking-tight">Nexora ID</span>
          </div>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h1 className="text-3xl font-bold text-[#010a26] mb-4">Password Updated!</h1>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">Your account is now secure. Redirecting you to sign in to your Nexora ID...</p>
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <div className="mb-8 text-center lg:text-left">
                  <h1 className="text-3xl font-bold text-[#010a26] mb-1.5">New Password</h1>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">Choose a strong, unique password to secure your identity.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Create Password</label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password")}
                      className="h-12 placeholder:text-slate-400"
                      rightElement={
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600 transition-colors">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      }
                    />
                    {errors.password && <p className="text-[11px] text-red-500 mt-1 ml-1 font-medium">{errors.password.message}</p>}

                    <PasswordStrength password={passwordValue} />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Confirm Password</label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("confirmPassword")}
                      className="h-12 placeholder:text-slate-400"
                    />
                    {errors.confirmPassword && <p className="text-[11px] text-red-500 mt-1 ml-1 font-medium">{errors.confirmPassword.message}</p>}
                  </div>

                  <Button type="submit" isLoading={isLoading} className="w-full h-12 mt-4 bg-[#010a26] text-white rounded-2xl font-bold flex items-center justify-center gap-2 group hover:bg-[#051445] transition-all shadow-xl shadow-[#010a26]/10">
                    Update Password <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 flex-1">
      <div className="flex-shrink-0 w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-white/80 transition-all">{icon}</div>
      <div>
        <h3 className="text-[12px] font-bold text-white mb-1.5">{title}</h3>
        <p className="text-white/40 text-[10px] leading-relaxed line-clamp-2 font-medium">{desc}</p>
      </div>
    </div>
  );
}
