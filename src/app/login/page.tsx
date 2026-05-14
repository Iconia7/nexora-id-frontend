"use client";

export const dynamic = 'force-dynamic';
// Note: Title is handled by the parent layout template, but we can override if needed
// Actually, in Client Components we don't export metadata. We use title inside layout or just rely on default.
// Wait, I can export metadata from a page.tsx IF IT'S A SERVER COMPONENT. 
// But these are Client Components ("use client").
// To set metadata for Client Components, I should use a separate layout.tsx in each folder.

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck, Loader2, Key } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

import { Suspense } from "react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [requires2FA, setRequires2FA] = React.useState(false);
  const [tempUserId, setTempUserId] = React.useState<string | null>(null);
  const [twoFactorCode, setTwoFactorCode] = React.useState("");

  const returnTo = searchParams.get("returnTo");

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response.requires2FA) {
        setRequires2FA(true);
        setTempUserId(response.tempUserId);
        showToast("Two-factor authentication required", "info");
        return;
      }

      showToast("Signed in successfully", "success");

      if (returnTo) {
        window.location.href = returnTo;
      } else {
        router.push('/dashboard/apps');
      }
    } catch (error: any) {
      if (error.unverified) {
        showToast(error.message, "error");
        router.push(`/verify?email=${encodeURIComponent(data.email)}${returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ''}`);
        return;
      }
      showToast(error.message || "Invalid credentials", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerify = async () => {
    if (twoFactorCode.length !== 6) return;
    setIsLoading(true);
    try {
      await apiFetch('/auth/login/2fa', {
        method: 'POST',
        body: JSON.stringify({
          userId: tempUserId,
          token: twoFactorCode
        }),
      });

      showToast("Identity verified", "success");
      if (returnTo) {
        window.location.href = returnTo;
      } else {
        router.push('/dashboard/apps');
      }
    } catch (error: any) {
      showToast(error.message || "Invalid 2FA code", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden font-sans">
      {/* Left Section: Branding */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex lg:w-1/2 relative bg-[#010a26] p-16 flex-col justify-center items-center overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "url('/brand/pattern.png')", backgroundSize: "400px auto", filter: "invert(1)" }} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] right-[10%] w-[60%] h-[60%] bg-[#960c1d]/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] left-[10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full" />
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

        <div className="flex flex-col items-center gap-12 z-10">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-semibold text-white leading-tight max-w-sm pt-4 tracking-tight text-center"
          >
            Your gateway to the <span className="text-[#960c1d]">Nexora</span> Ecosystem.
          </motion.h2>

          <div className="flex flex-row gap-8 w-full max-w-2xl pb-12">
            <FeatureItem icon={<Lock className="w-4 h-4" />} title="Secure Auth" desc="Enterprise-grade identity protection." />
            <FeatureItem icon={<ShieldCheck className="w-4 h-4" />} title="Trust Layer" desc="Verified credentials and encrypted sessions." />
            <FeatureItem icon={<ShieldCheck className="w-4 h-4" />} title="Universal ID" desc="One account for all Nexora tools." />
          </div>
        </div>

        <div className="absolute bottom-16 z-10 text-white/30 text-[10px] font-medium uppercase tracking-[0.3em]">
          Powered by Nexora Cloud
        </div>
      </motion.div>

      {/* Right Section: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md py-8"
      >
        <div className="mb-10 lg:hidden flex flex-col items-center gap-4 text-center">
          <img src="/brand/logo.png" alt="Nexora" className="w-14 h-14 object-contain" />
          <span className="text-xl font-semibold text-[#010a26] tracking-tight">Nexora ID</span>
        </div>

        <AnimatePresence mode="wait">
          {!requires2FA ? (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-10"
            >
              <div>
                <h1 className="text-4xl font-semibold text-[#010a26] mb-3 tracking-tight">Welcome back</h1>
                <p className="text-slate-500 font-medium leading-relaxed">Enter your credentials to access your Nexora ID command center.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[13px] font-semibold text-slate-700 ml-1">Email Address</label>
                  <Input
                    placeholder="name@nexoracreatives.co.ke"
                    {...register("email")}
                    error={errors.email?.message}
                    className="h-14"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-1 mb-1">
                    <label className="text-[13px] font-semibold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => router.push('/forgot-password')}
                      className="text-[11px] font-semibold text-[#960c1d] uppercase tracking-wider hover:underline underline-offset-4"
                    >
                      Forgot?
                    </button>
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    error={errors.password?.message}
                    className="h-14"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-14 bg-[#010a26] hover:bg-[#051445] text-white rounded-2xl font-semibold text-base transition-all shadow-xl shadow-[#010a26]/10"
                    isLoading={isLoading}
                  >
                    Sign in to Dashboard
                  </Button>
                </div>
              </form>



              <p className="text-center text-sm font-medium text-slate-500">
                New to Nexora?{" "}
                <button onClick={() => router.push('/register')} className="text-[#960c1d] font-semibold hover:underline underline-offset-4 transition-all">Create Account</button>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="2fa-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8 relative">
                  <div className="absolute inset-0 bg-[#960c1d]/5 rounded-3xl animate-pulse" />
                  <Key className="w-10 h-10 text-[#960c1d] relative z-10" />
                </div>
                <h1 className="text-3xl font-semibold text-[#010a26] mb-3 tracking-tight">Security Challenge</h1>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Enter the 6-digit code from your <br />
                  <span className="text-[#010a26] font-semibold">Authenticator App</span>
                </p>
              </div>

              <div className="space-y-6">
                <Input
                  placeholder="000 000"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="h-16 text-center text-2xl tracking-[0.5em] font-semibold"
                  maxLength={6}
                  autoFocus
                />

                <Button
                  onClick={handle2FAVerify}
                  className="w-full h-14 bg-[#960c1d] hover:bg-[#7a0918] text-white rounded-2xl font-semibold text-base transition-all shadow-xl shadow-red-900/10"
                  isLoading={isLoading}
                  disabled={twoFactorCode.length !== 6}
                >
                  Verify Identity
                </Button>

                <button
                  onClick={() => setRequires2FA(false)}
                  className="w-full py-2 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-all"
                >
                  Back to Login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      </div >
    </div >
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginContent />
    </Suspense>
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
