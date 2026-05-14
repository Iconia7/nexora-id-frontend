"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, ShieldCheck, Smartphone, Monitor, Clock, CheckCircle2, MoreVertical, X, AlertTriangle, ShieldAlert, Loader2, QrCode, Key } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface Session {
  id: string;
  isCurrent: boolean;
  ip: string;
  userAgent: string;
  lastActive: string;
}

interface SecurityStatus {
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export default function SecurityPage() {
  const { showToast } = useToast();
  const [status, setStatus] = React.useState<SecurityStatus | null>(null);
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = React.useState(false);
  const [twoFactorStep, setTwoFactorStep] = React.useState<'start' | 'qr' | 'verify' | 'recovery'>('start');
  const [qrData, setQrData] = React.useState<{ qrCode: string, secret: string } | null>(null);
  const [verificationCode, setVerificationCode] = React.useState("");
  const [recoveryCodes, setRecoveryCodes] = React.useState<string[]>([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const fetchData = React.useCallback(async () => {
    try {
      const [statusData, sessionsData] = await Promise.all([
        apiFetch('/api/security/status'),
        apiFetch('/api/security/sessions')
      ]);
      setStatus(statusData);
      setSessions(sessionsData);
    } catch (error: any) {
      // Don't show toasts for 401s (auth redirect will handle it)
      if (error.status !== 401) {
        showToast("Failed to load security matrix", "error");
      }
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsUpdatingPassword(true);
    try {
      await apiFetch('/api/auth/update-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      showToast("Password updated successfully", "success");
      reset();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await apiFetch(`/api/security/sessions/${id}`, { method: 'DELETE' });
      setSessions(prev => prev.filter(s => s.id !== id));
      showToast("Session revoked", "success");
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const start2FASetup = async () => {
    try {
      const data = await apiFetch('/api/security/2fa/setup', { method: 'POST' });
      setQrData(data);
      setTwoFactorStep('qr');
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const verify2FA = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch('/api/security/2fa/verify', {
        method: 'POST',
        body: JSON.stringify({ token: verificationCode })
      });
      setRecoveryCodes(data.recoveryCodes);
      setTwoFactorStep('recovery');
      setStatus(prev => prev ? { ...prev, twoFactorEnabled: true } : null);
      showToast("2FA Enabled Successfully", "success");
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !status) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 text-[#960c1d] animate-spin" />
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#010a26]/40">Securing Workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#010a26] rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#010a26]/40">Security Matrix</span>
          </div>
          <h1 className="text-4xl font-semibold text-[#010a26] tracking-tight">Account Protection</h1>
          <p className="text-slate-500 font-medium mt-2">Manage your authentication methods and active security sessions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Security Area */}
        <div className="lg:col-span-2 space-y-10">
          {/* Password Section */}
          <section className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
            <div className="flex items-center space-x-5 mb-10">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                <Lock className="w-7 h-7 text-[#960c1d]" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[#010a26]">Update Password</h2>
                <p className="text-sm text-slate-500 font-medium">Keep your Nexora ID secure with a fresh password.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-slate-700 ml-1">Current Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-14"
                  {...register("currentPassword")}
                />
                {errors.currentPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.currentPassword.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-700 ml-1">New Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-14"
                    {...register("newPassword")}
                  />
                  {errors.newPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.newPassword.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-700 ml-1">Confirm New Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-14"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Button 
                  type="submit" 
                  className="bg-[#010a26] hover:bg-[#051445] text-white px-10 h-14 rounded-2xl font-semibold transition-all shadow-xl shadow-[#010a26]/10" 
                  isLoading={isUpdatingPassword}
                >
                  Save New Password
                </Button>
                {status?.createdAt && (
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-4">
                    Member since {new Date(status.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </form>
          </section>

          {/* Active Sessions List */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-semibold text-[#010a26]">Active Security Sessions</h3>
              <div className="h-[1px] flex-1 mx-6 bg-slate-100" />
              <button 
                onClick={() => showToast("Functionality coming soon", "info")}
                className="text-[11px] font-semibold text-[#960c1d] uppercase tracking-widest hover:underline underline-offset-4"
              >
                Log out all
              </button>
            </div>
            
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/30">
              <AnimatePresence mode="popLayout">
                {sessions.map((session, i) => (
                  <motion.div 
                    key={session.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "p-8 flex items-center justify-between group transition-colors",
                      i !== 0 && "border-t border-slate-50",
                      session.isCurrent && "bg-slate-50/50"
                    )}
                  >
                    <div className="flex items-center space-x-6">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                        session.isCurrent ? "bg-[#010a26] text-white" : "bg-slate-50 text-slate-400"
                      )}>
                        {session.userAgent.toLowerCase().includes('mobile') ? <Smartphone className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-sm font-semibold text-[#010a26]">
                            {session.userAgent.split(')')[0].split('(')[1] || "Known Device"}
                          </h4>
                          {session.isCurrent && (
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-wider rounded-full border border-emerald-200">This Device</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-medium tracking-tight">
                          {session.ip} • Last active {new Date(session.lastActive).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    {!session.isCurrent && (
                      <button 
                        onClick={() => handleRevoke(session.id)}
                        className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        title="Revoke Access"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* Sidebar Status Column */}
        <div className="space-y-8">
          {/* 2FA Card */}
          <div className="bg-[#010a26] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#960c1d]/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
            <ShieldAlert className="w-12 h-12 text-[#960c1d] mb-8 relative z-10" />
            <h3 className="text-xl font-semibold mb-3 relative z-10 tracking-tight">Two-Factor Authentication</h3>
            <p className="text-sm text-white/50 mb-8 leading-relaxed font-medium relative z-10">
              Add a secondary layer of protection using your mobile authenticator app.
            </p>
            <Button 
              onClick={() => setIs2FAModalOpen(true)}
              className={cn(
                "w-full h-14 rounded-2xl font-semibold border-none shadow-xl transition-all relative z-10",
                status?.twoFactorEnabled 
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-900/20" 
                  : "bg-[#960c1d] hover:bg-[#7a0918] text-white shadow-red-900/20"
              )}
            >
              {status?.twoFactorEnabled ? "2FA Protected" : "Setup 2FA"}
            </Button>
          </div>

          {/* Security Pulse Checklist */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/30">
            <h3 className="text-sm font-semibold text-[#010a26] uppercase tracking-widest mb-8">Security Pulse</h3>
            <ul className="space-y-6">
              {[
                { label: "Strong password", done: true },
                { label: "Email verified", done: status?.emailVerified },
                { label: "2FA active", done: status?.twoFactorEnabled },
                { label: "Identity secure", done: status?.emailVerified && status?.twoFactorEnabled },
              ].map((item, i) => (
                <li key={i} className="flex items-center space-x-4">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500",
                    item.done ? "bg-emerald-500 text-white" : "bg-slate-50 border border-slate-200 text-slate-300"
                  )}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className={cn(
                    "text-[13px] font-medium",
                    item.done ? "text-[#010a26]" : "text-slate-400"
                  )}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 2FA Setup Modal */}
      <AnimatePresence>
        {is2FAModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIs2FAModalOpen(false)}
              className="absolute inset-0 bg-[#010a26]/60 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-[0_30px_100px_rgba(1,10,38,0.3)] overflow-hidden"
            >
              {twoFactorStep === 'start' && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Smartphone className="w-8 h-8 text-[#960c1d]" />
                  </div>
                  <h2 className="text-2xl font-semibold text-[#010a26] mb-2">Setup 2FA</h2>
                  <p className="text-sm text-slate-500 font-medium mb-8">Secure your Nexora ID using any authenticator app.</p>
                  <Button onClick={start2FASetup} className="w-full h-12 bg-[#010a26] text-white rounded-xl font-semibold">Start Setup</Button>
                </div>
              )}

              {twoFactorStep === 'qr' && qrData && (
                <div className="text-center">
                   <h2 className="text-xl font-semibold text-[#010a26] mb-6">Scan QR Code</h2>
                   <div className="bg-slate-50 p-4 rounded-2xl inline-block mb-6 border border-slate-100">
                     <img src={qrData.qrCode} alt="QR Code" className="w-36 h-36" />
                   </div>
                   <div className="text-left bg-slate-50 p-3 rounded-lg mb-6 flex items-center gap-3 overflow-hidden">
                      <Key className="w-4 h-4 text-slate-400 shrink-0" />
                      <code className="text-[10px] font-mono text-slate-500 font-bold truncate">{qrData.secret}</code>
                   </div>
                   <div className="space-y-4">
                      <Input 
                        placeholder="000000" 
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="h-12 text-center text-lg tracking-[0.4em] font-semibold"
                        maxLength={6}
                      />
                      <Button onClick={verify2FA} isLoading={isLoading} className="w-full h-12 bg-[#960c1d] text-white rounded-xl font-semibold">Verify & Activate</Button>
                   </div>
                </div>
              )}

              {twoFactorStep === 'recovery' && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-[#010a26] mb-2">You&apos;re Protected!</h2>
                  <p className="text-sm text-slate-500 font-medium mb-8">Save these recovery codes. They are the only way to access your account if you lose your phone.</p>
                  
                  <div id="recovery-codes-box" className="grid grid-cols-2 gap-3 mb-8 bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                    {recoveryCodes.map(code => (
                      <div key={code} className="bg-white p-2.5 rounded-lg text-[10px] font-mono font-bold text-slate-600 border border-slate-100 shadow-sm">{code}</div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                    <button 
                      onClick={() => {
                        const content = `NEXORA ID RECOVERY CODES\n\n${recoveryCodes.join('\n')}\n\nKeep these codes safe.`;
                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'nexora-recovery-codes.txt';
                        a.click();
                        showToast("Codes downloaded", "success");
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-[#010a26] text-xs font-semibold rounded-xl transition-all"
                    >
                      <Smartphone className="w-4 h-4 rotate-180" /> Download
                    </button>
                    <button 
                      onClick={() => {
                        const printWindow = window.open('', '_blank');
                        printWindow?.document.write(`
                          <html>
                            <head><title>Nexora ID Recovery Codes</title></head>
                            <body style="font-family: sans-serif; padding: 40px; text-align: center;">
                              <h1>Nexora ID Recovery Codes</h1>
                              <p>Keep these codes in a safe place.</p>
                              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px;">
                                ${recoveryCodes.map(c => `<div style="padding: 10px; border: 1px solid #ccc; font-family: monospace;">${c}</div>`).join('')}
                              </div>
                            </body>
                          </html>
                        `);
                        printWindow?.document.close();
                        printWindow?.print();
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-[#010a26] text-xs font-semibold rounded-xl transition-all"
                    >
                      <Loader2 className="w-4 h-4" /> Print
                    </button>
                  </div>

                  <Button onClick={() => setIs2FAModalOpen(false)} className="w-full h-12 bg-[#010a26] text-white rounded-xl font-semibold">I&apos;ve Saved Them</Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
