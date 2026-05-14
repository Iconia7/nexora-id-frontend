"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Check, ArrowRightLeft, User } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ConsentPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = React.useState(false);

  const clientName = searchParams.get("client_name") || "Nexora Chai";
  const scopes = searchParams.get("scopes")?.split(",") || ["openid", "profile", "email"];

  const handleAllow = async () => {
    setIsLoading(true);
    // Simulate API call to /api/oauth/consent
    setTimeout(() => {
      setIsLoading(false);
      const returnTo = searchParams.get("returnTo");
      if (returnTo) window.location.href = returnTo;
    }, 1500);
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white shadow-2xl rounded-[2.5rem] p-8 md:p-12 overflow-hidden"
        >
          {/* Top Visual: Avatars & Arrow */}
          <div className="flex items-center justify-center space-x-8 mb-12">
            <div className="relative">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center shadow-inner">
                <User className="w-10 h-10 text-slate-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-px w-12 bg-slate-200 relative">
                <motion.div 
                  animate={{ x: [0, 12, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 right-0"
                >
                  <ArrowRightLeft className="w-4 h-4 text-amber-500" />
                </motion.div>
              </div>
            </div>

            <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center shadow-sm border border-amber-100">
              <Shield className="w-10 h-10 text-amber-600" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-4">
              {clientName} wants to access your Nexora Account
            </h1>
            <p className="text-slate-500 font-medium px-4">
              This application will be able to perform the following actions on your behalf.
            </p>
          </div>

          {/* Scopes List */}
          <div className="bg-slate-50 rounded-3xl p-6 mb-10 space-y-4">
            {scopes.map((scope) => (
              <div key={scope} className="flex items-start space-x-4">
                <div className="mt-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
                  <Check className="w-3 h-3 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 capitalize">
                    {scope === 'openid' ? 'Nexora Identity' : `View your ${scope}`}
                  </p>
                  <p className="text-xs text-slate-500">
                    {scope === 'email' ? 'Required to identify you across apps.' : 'Used to personalize your experience.'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-3">
            <Button className="w-full h-14" onClick={handleAllow} isLoading={isLoading}>
              Allow Access
            </Button>
            <Button variant="ghost" className="w-full h-14" onClick={handleCancel}>
              Cancel
            </Button>
          </div>

          {/* Security Footer */}
          <p className="text-center text-slate-400 text-[11px] mt-10 uppercase tracking-widest font-bold">
            🔒 Secure connection to Nexora Identity
          </p>
          <p className="text-center text-slate-400 text-xs mt-2">
            You can revoke this access at any time in your Nexora Security settings.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
