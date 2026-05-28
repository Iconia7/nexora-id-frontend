"use client";

export const dynamic = 'force-dynamic';

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShieldCheck, Mail, Globe, Zap, Loader2, RefreshCw } from "lucide-react";
import { OTPInput } from "@/components/ui/OTPInput";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { safeRedirectUrl } from "@/lib/redirect";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [timer, setTimer] = React.useState(0);

  const email = searchParams.get("email") || "your email";
  // Validate returnTo to prevent open-redirect attacks
  const returnTo = safeRedirectUrl(searchParams.get("returnTo"), '/dashboard/apps');

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleComplete = async (otp: string) => {
    setIsLoading(true);
    try {
      await apiFetch('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ otp }),
      });

      setIsSuccess(true);
      showToast("Email verified successfully", "success");
      setTimeout(() => {
        // Safe: returnTo has already been validated as same-origin
        router.push(returnTo);
      }, 2000);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setIsResending(true);
    try {
      await apiFetch('/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      showToast("A new code has been sent", "success");
      setTimer(60); // 60 seconds cooldown
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsResending(false);
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
            One last step to <span className="text-[#960c1d]">Nexora</span> access.
          </motion.h2>

          <div className="flex flex-row gap-8 w-full max-w-2xl pb-12">
            <FeatureItem icon={<Mail className="w-4 h-4" />} title="Fast Verify" desc="Instant verification via your secure Nexora Mail." delay={0.3} />
            <FeatureItem icon={<ShieldCheck className="w-4 h-4" />} title="Double Secure" desc="Adding an extra layer of protection to your ID." delay={0.4} />
            <FeatureItem icon={<Zap className="w-4 h-4" />} title="Quick Setup" desc="Verified in seconds, access forever." delay={0.5} />
          </div>
        </div>

        <div className="absolute bottom-12 z-10 text-white/30 text-[9px] font-medium uppercase tracking-[0.3em]">
          Secured by Nexora Trust
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

          <div className="text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-sm relative group">
              <div className="absolute inset-0 bg-red-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <ShieldCheck className="w-10 h-10 text-[#960c1d] relative z-10" />
            </div>

            <h1 className="text-4xl font-semibold text-[#010a26] mb-3 tracking-tight">Verify Identity</h1>
            <p className="text-slate-500 font-medium leading-relaxed mb-10">
              We&apos;ve sent a 6-digit verification code to <br />
              <span className="text-[#010a26] font-semibold">{email}</span>
            </p>

            <div className="mb-10">
              <OTPInput length={6} onComplete={handleComplete} disabled={isLoading || isSuccess} />
            </div>

            <div className="space-y-6">
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleResend}
                  disabled={isLoading || isSuccess || isResending || timer > 0}
                  className="flex items-center gap-2 text-sm font-semibold text-[#960c1d] hover:underline underline-offset-8 disabled:opacity-40 disabled:no-underline transition-all"
                >
                  {isResending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className={`w-4 h-4 ${timer > 0 ? '' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                  )}
                  {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive a code? Resend"}
                </button>
              </div>

              <button
                onClick={() => router.back()}
                className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Use a different email
              </button>
            </div>

            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 font-semibold flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" /> Verified Successfully!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-white" />}>
      <VerifyContent />
    </React.Suspense>
  );
}

function FeatureItem({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="flex flex-col items-center text-center gap-4 flex-1">
      <div className="flex-shrink-0 w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-white/80 transition-all">{icon}</div>
      <div>
        <h3 className="text-[13px] font-semibold text-white mb-2 tracking-tight">{title}</h3>
        <p className="text-white/40 text-[11px] leading-relaxed line-clamp-2 font-medium">{desc}</p>
      </div>
    </motion.div>
  );
}
