"use client";

export const dynamic = 'force-dynamic';

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Code } from "lucide-react";
import Link from "next/link";

function CallbackContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  return (
    <div className="min-h-screen bg-[#010a26] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Branding Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "url('/brand/pattern.png')",
          backgroundSize: "400px auto",
          filter: "invert(1)"
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center relative z-10"
      >
        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>

        <h1 className="text-3xl font-bold text-[#010a26] mb-3">Authentication Successful</h1>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
          Nexora ID has successfully authenticated your account and issued an authorization code.
        </p>

        <div className="bg-slate-50 rounded-3xl p-6 mb-10 text-left border border-slate-100 shadow-inner">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Code className="w-4 h-4 text-[#960c1d]" />
            Authorization Code
          </div>
          <code className="text-sm text-[#960c1d] font-mono break-all leading-relaxed font-bold">
            {code || "No code received"}
          </code>
        </div>

        <div className="space-y-3">
          <Link
            href="/dashboard/apps"
            className="w-full h-14 bg-[#010a26] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#051445] transition-all group shadow-lg shadow-[#010a26]/10"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <p className="mt-10 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          Nexora ID &bull; Secure Authentication
        </p>
      </motion.div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#010a26]" />}>
      <CallbackContent />
    </Suspense>
  );
}
