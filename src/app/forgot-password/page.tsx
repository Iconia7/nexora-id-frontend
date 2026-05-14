"use client";

export const dynamic = 'force-dynamic';

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Mail, Send, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Link from "next/link";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true);
    try {
      await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setIsSuccess(true);
      showToast("Reset link sent to your email", "success");
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden font-sans">
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
            <span className="text-xl font-semibold tracking-wide text-white uppercase">Nexora ID</span>
            <span className="text-[9px] font-medium tracking-[0.4em] uppercase opacity-40">Identity Provider</span>
          </div>
        </div>

        <div className="relative z-10 mt-24 space-y-12 text-center flex flex-col items-center">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-semibold text-white leading-tight max-w-sm pt-4 tracking-tight"
          >
            Securing your <span className="text-[#960c1d]">Nexora</span> Identity.
          </motion.h2>

          <div className="flex flex-row gap-8 w-full max-w-2xl pb-12">
            <FeatureItem icon={<Lock className="w-4 h-4" />} title="Safe & Secure" desc="End-to-end encryption for all identity changes." />
            <FeatureItem icon={<ShieldCheck className="w-4 h-4" />} title="Guard Protection" desc="Real-time monitoring of sensitive actions." />
            <FeatureItem icon={<ShieldCheck className="w-4 h-4" />} title="Global Identity" desc="Updates reflect across all Nexora apps instantly." />
          </div>
        </div>

        <div className="absolute bottom-12 z-10 text-white/30 text-[9px] font-medium uppercase tracking-[0.3em]">
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
            <span className="text-xl font-semibold text-[#010a26] tracking-tight">Nexora ID</span>
          </div>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h1 className="text-3xl font-semibold text-[#010a26] mb-4 tracking-tight">Check your email</h1>
                <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                  We&apos;ve sent a password reset link to your email address. Please follow the instructions to secure your account.
                </p>
                <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-[#010a26] hover:underline underline-offset-8">
                  <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="mb-10 text-center lg:text-left">
                  <h1 className="text-4xl font-semibold text-[#010a26] mb-3 tracking-tight">Forgot password?</h1>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    No worries! Enter your email and we&apos;ll send you a link to reset it.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-slate-700 ml-1">Email Address</label>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="name@company.com"
                      className="h-14 placeholder:text-slate-400"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.email.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="w-full h-14 bg-[#010a26] text-white rounded-2xl font-semibold hover:bg-[#051445] transition-all shadow-xl shadow-[#010a26]/10 flex items-center justify-center gap-2 group"
                  >
                    Send Reset Link <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </form>

                <div className="mt-10 text-center pt-8 border-t border-slate-100">
                  <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-[#960c1d] hover:underline underline-offset-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Sign In
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 flex-1">
      <div className="flex-shrink-0 w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-white/80 transition-all">{icon}</div>
      <div>
        <h3 className="text-[13px] font-semibold text-white mb-2 tracking-tight">{title}</h3>
        <p className="text-white/40 text-[11px] leading-relaxed line-clamp-2 font-medium">{desc}</p>
      </div>
    </div>
  );
}
