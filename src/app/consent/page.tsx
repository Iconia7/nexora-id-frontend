"use client";

export const dynamic = 'force-dynamic';

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Shield, Check, Info, ArrowRight, Lock, Key, AppWindow } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";

function ConsentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState<any>(null);

  const clientId = searchParams.get("client_id");
  const returnTo = searchParams.get("returnTo");
  const scopes = searchParams.get("scopes")?.split(",") || [];

  useEffect(() => {
    if (clientId) {
      apiFetch(`/api/oauth/client/${clientId}`)
        .then(data => setClient(data))
        .catch(() => setClient({ name: "Unknown Application" }));
    }
  }, [clientId]);

  const handleAuthorize = async () => {
    setIsLoading(true);
    try {
      await apiFetch("/api/oauth/consent", {
        method: "POST",
        body: JSON.stringify({ clientId, scopes }),
      });

      if (returnTo) {
        window.location.href = decodeURIComponent(returnTo);
      }
    } catch (error) {
      console.error("Failed to grant consent", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Section: Hero */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex lg:w-1/2 relative bg-[#010a26] p-16 flex-col justify-center items-center overflow-hidden"
      >
        {/* Branding Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: "url('/brand/pattern.png')",
            backgroundSize: "400px auto",
            filter: "invert(1)"
          }}
        />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-[20%] -right-[20%] w-[100%] h-[100%] bg-[#960c1d]/10 blur-[150px] rounded-full opacity-60" />
          <div className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%] bg-[#010a26] blur-[100px] rounded-full opacity-40" />
        </div>

        {/* Top Logo */}
        <div className="absolute top-20 z-10 flex flex-row items-center gap-6 text-white group">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl border border-white/20 transition-transform group-hover:scale-105 duration-500">
            <img src="/brand/logo.png" alt="Nexora" className="w-14 h-14 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-[0.2em] uppercase text-white">Nexora ID</span>
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">Identity Provider</span>
          </div>
        </div>

        <div className="relative z-10 mt-32 space-y-16 text-center flex flex-col items-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-white leading-tight mb-4 max-w-md">
              Your Security is our <span className="text-[#960c1d]">Priority</span>.
            </h2>
            <p className="text-slate-400 text-base max-w-sm font-medium mx-auto">
              You're in Control of your data. Review and Approve Access Requests from your favorite Nexora apps.
            </p>
          </motion.div>

          <div className="flex flex-row gap-8 w-full max-w-2xl pb-12">
            <FeatureItem
              icon={<Lock className="w-4 h-4 text-[#960c1d]" />}
              title="End-to-End Encryption"
              desc="Your data is encrypted at rest and in transit using industry standards."
            />
            <FeatureItem
              icon={<Key className="w-4 h-4 text-[#960c1d]" />}
              title="Granular Control"
              desc="Choose exactly what information you want to share with each application."
            />
            <FeatureItem
              icon={<AppWindow className="w-4 h-4 text-[#960c1d]" />}
              title="Verified Applications"
              desc="We only allow trusted Nexora ecosystem apps to request your identity."
            />
          </div>
        </div>

        <div className="absolute bottom-16 z-10 text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">
          Protected by Nexora Cloud Outh Server.
        </div>
      </motion.div>

      {/* Right Section: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 lg:hidden flex flex-col items-center gap-4 text-center">
            <img src="/brand/logo.png" alt="Nexora" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold text-[#010a26] tracking-tight">Nexora ID</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 mx-auto lg:mx-0 shadow-sm border border-slate-100">
              <AppWindow className="w-10 h-10 text-[#960c1d]" />
            </div>
            <h1 className="text-3xl font-bold text-[#010a26] mb-2 text-center lg:text-left">Authorize Access</h1>
            <p className="text-slate-500 font-medium leading-relaxed text-center lg:text-left">
              <span className="text-[#010a26] font-bold">{client?.name || "Nexora Chai"}</span> is requesting permission to access your Nexora ID.
            </p>
          </div>

          <div className="bg-slate-50 rounded-[2rem] p-8 mb-8 border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Requested Permissions</p>
            <div className="space-y-4">
              {scopes.map((scope) => (
                <div key={scope} className="flex items-center gap-4 group">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#960c1d] shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-slate-700 font-semibold capitalize">{scope.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-[#960c1d]/5 rounded-2xl border border-[#960c1d]/10 mb-8">
            <Info className="w-6 h-6 text-[#960c1d] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#960c1d] leading-relaxed font-medium">
              By authorizing, you allow this app to access the data listed above. You can revoke this access at any time in your dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              onClick={handleAuthorize}
              disabled={isLoading}
              className="w-full h-14 bg-[#010a26] text-white rounded-2xl font-bold hover:bg-[#051445] transition-all shadow-xl shadow-[#010a26]/10 flex items-center justify-center gap-2 group"
            >
              {isLoading ? "Authorizing..." : "Allow Access"}
              {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
            <button
              onClick={() => router.back()}
              className="h-14 w-full text-slate-500 font-bold hover:text-[#010a26] transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ConsentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ConsentContent />
    </Suspense>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 flex-1">
      <div className="flex-shrink-0 w-11 h-11 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 text-[#960c1d]">
        {icon}
      </div>
      <div>
        <h3 className="text-[13px] font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3 font-medium">{desc}</p>
      </div>
    </div>
  );
}
