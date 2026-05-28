"use client";

export const dynamic = 'force-dynamic';

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Lock, Mail, User, Sparkles, CreditCard, Layout, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { safeRedirectUrl } from "@/lib/redirect";
import Link from "next/link";

const registerSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

import { Suspense } from "react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const rawReturnTo = searchParams.get("returnTo");
  // Validate returnTo to prevent open-redirect attacks
  const returnTo = safeRedirectUrl(rawReturnTo);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          displayName: data.displayName,
        }),
      });

      showToast("Account created! Please verify.", "success");
      router.push(`/verify?email=${encodeURIComponent(data.email)}${returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ''}`);
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
            <span className="text-xl font-semibold tracking-wide text-white uppercase">Nexora ID</span>
            <span className="text-[9px] font-medium tracking-[0.4em] uppercase opacity-40">Identity Provider</span>
          </div>
        </div>

        <div className="relative z-10 mt-24 space-y-12 text-center flex flex-col items-center">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-semibold text-white leading-tight max-w-sm pt-4"
          >
            Empowering your <span className="text-[#960c1d]">Creative</span> journey through <span className="text-[#960c1d]">Nexora ID</span>.
          </motion.h2>

          <div className="flex flex-row gap-8 w-full max-w-2xl pb-12">
            <FeatureItem icon={<Sparkles className="w-4 h-4 text-white" />} title="Creative Suite" desc="Access Nexora POS, Menu, and Chai with one ID." />
            <FeatureItem icon={<CreditCard className="w-4 h-4 text-white" />} title="Unified Pay" desc="Manage withdrawals seamlessly across platforms." />
            <FeatureItem icon={<Layout className="w-4 h-4 text-white" />} title="Full Control" desc="One place to manage all your connected apps." />
          </div>
        </div>

        <div className="absolute bottom-12 z-10 text-white/30 text-[9px] font-medium uppercase tracking-[0.3em]">
          Empowering African Creatives
        </div>
      </motion.div>

      {/* Right Section: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-white overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md py-8"
        >
          <div className="mb-6 lg:hidden flex flex-col items-center gap-4 text-center">
            <img src="/brand/logo.png" alt="Nexora" className="w-14 h-14 object-contain" />
            <span className="text-xl font-semibold text-[#010a26] tracking-tight">Nexora ID</span>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-semibold text-[#010a26] mb-1.5 tracking-tight">Create your Nexora ID</h1>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Start your Nexora journey today in a few seconds.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700 ml-1">Full Name</label>
              <Input
                {...register("displayName")}
                placeholder="Jane Doe"
                className="h-12 placeholder:text-slate-400"
              />
              {errors.displayName && <p className="text-[11px] text-red-500 mt-1 ml-1 font-medium">{errors.displayName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700 ml-1">Email Address</label>
              <Input
                {...register("email")}
                type="email"
                placeholder="jane@nexoracreatives.co.ke"
                className="h-12 placeholder:text-slate-400"
              />
              {errors.email && <p className="text-[11px] text-red-500 mt-1 ml-1 font-medium">{errors.email.message}</p>}
            </div>

            <div className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-slate-700 ml-1">Password</label>
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
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
                <label className="text-[13px] font-medium text-slate-700 ml-1">Confirm Password</label>
                <Input
                  {...register("confirmPassword")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-12 placeholder:text-slate-400"
                />
                {errors.confirmPassword && <p className="text-[11px] text-red-500 mt-1 ml-1 font-medium">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-12 mt-2 bg-[#010a26] text-white rounded-2xl font-semibold hover:bg-[#051445] transition-all shadow-xl shadow-[#010a26]/10 flex items-center justify-center gap-2 group"
            >
              Create Nexora ID <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-6 text-center pt-6 border-t border-slate-100">
            <p className="text-[13px] text-slate-500 font-medium">
              Already have an account?{" "}
              <Link href={`/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`} className="text-[#960c1d] font-semibold hover:underline underline-offset-4">
                Sign In instead
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <RegisterContent />
    </Suspense>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 flex-1">
      <div className="flex-shrink-0 w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
        {icon}
      </div>
      <div>
        <h3 className="text-[12px] font-semibold text-white mb-1.5 tracking-tight">{title}</h3>
        <p className="text-red-50/50 text-[10px] leading-relaxed line-clamp-2 font-medium">{desc}</p>
      </div>
    </div>
  );
}
