"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Trash2, ExternalLink, Calendar, Info, Loader2, AppWindow, MoreHorizontal, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface AppConsent {
  id: string;
  clientId: string;
  scopes: string[];
  client: {
    name: string;
    id: string;
  };
}

export default function ConnectedAppsPage() {
  const [apps, setApps] = React.useState<AppConsent[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [revokingId, setRevokingId] = React.useState<string | null>(null);
  const { showToast } = useToast();

  React.useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await apiFetch('/api/connected-apps');
        setApps(data);
      } catch (error) {
        console.error("Failed to fetch apps:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApps();
  }, []);

  const handleRevoke = async (clientId: string) => {
    try {
      await apiFetch(`/api/connected-apps/${clientId}`, {
        method: 'DELETE',
      });
      setApps(apps.filter(app => app.clientId !== clientId));
      setRevokingId(null);
      showToast("Access revoked successfully", "success");
    } catch (error) {
      showToast("Failed to revoke access", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-[#010a26]/10 rounded-full" />
          <div className="absolute inset-0 border-4 border-[#960c1d] rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#010a26]/40">Syncing Identity...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Page Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#010a26] rounded-xl flex items-center justify-center">
              <AppWindow className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#010a26]/40">Ecosystem Control</span>
          </div>
          <h1 className="text-4xl font-semibold text-[#010a26] tracking-tight">Connected Applications</h1>
          <p className="text-slate-500 font-medium mt-2">Manage third-party tools that have access to your Nexora ID.</p>
        </div>
        
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 min-w-[200px]">
          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-1">Total Connections</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-[#010a26]">{apps.length}</span>
            <span className="text-xs font-medium text-emerald-500 uppercase">Active</span>
          </div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {apps.map((app, index) => (
            <motion.div
              key={app.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl shadow-slate-200/40 border border-slate-100 flex flex-col group relative overflow-hidden transition-all hover:shadow-3xl hover:-translate-y-1 duration-500"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#960c1d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                  <Shield className="w-8 h-8 text-[#010a26]" />
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 relative z-10">
                <h3 className="text-xl font-semibold text-[#010a26] mb-2">{app.client.name}</h3>
                <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">
                  Trusted application authorized to access your secure Nexora profile data.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {app.scopes.map(scope => (
                    <span key={scope} className="px-3 py-1 bg-slate-100 text-[#010a26] text-[10px] uppercase tracking-[0.1em] font-semibold rounded-lg border border-slate-200/50">
                      {scope}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between relative z-10">
                <div className="flex items-center text-[11px] text-slate-400 font-semibold uppercase tracking-widest">
                  <Calendar className="w-3.5 h-3.5 mr-2 text-emerald-500" />
                  Active
                </div>
                <button 
                  onClick={() => setRevokingId(app.clientId)}
                  className="text-[11px] font-semibold uppercase tracking-widest text-red-500 hover:text-white px-4 py-2 hover:bg-[#960c1d] rounded-xl transition-all duration-300 shadow-lg shadow-red-500/0 hover:shadow-red-500/20"
                >
                  Revoke
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {apps.length === 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center px-6 py-20 sm:py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Shield className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-semibold text-[#010a26]">No active connections</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2 font-medium">When you authorize applications, they will securely appear here.</p>
          </motion.div>
        )}
      </div>

      {/* Security Banner */}
      <div className="bg-[#010a26] rounded-[3rem] p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#960c1d]/10 blur-[100px] rounded-full" />
        <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center shrink-0 border border-white/10">
          <AlertCircle className="w-10 h-10 text-white" />
        </div>
        <div className="relative z-10">
          <h4 className="text-xl font-semibold text-white mb-2">Security Protocol</h4>
          <p className="text-white/60 font-medium leading-relaxed max-w-2xl">
            Revoking access immediately terminates all active sessions for that application. If you detect suspicious activity, we recommend revoking access and refreshing your Nexora ID security keys in settings.
          </p>
        </div>
      </div>

      {/* Revocation Modal */}
      <AnimatePresence>
        {revokingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRevokingId(null)}
              className="absolute inset-0 bg-[#010a26]/60 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] p-6 sm:p-10 shadow-[0_30px_100px_rgba(1,10,38,0.3)]"
            >
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-8">
                <Trash2 className="w-10 h-10 text-[#960c1d]" />
              </div>
              <h2 className="text-3xl font-semibold text-[#010a26] tracking-tight mb-2">Revoke Access?</h2>
              <p className="text-slate-500 mb-10 font-medium leading-relaxed">
                Confirming this will immediately disconnect <span className="font-semibold text-[#010a26]">{apps.find(a => a.clientId === revokingId)?.client.name}</span> from your Nexora ID ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setRevokingId(null)}
                  className="flex-1 h-14 bg-slate-100 text-slate-600 rounded-2xl font-semibold hover:bg-slate-200 transition-all"
                >
                  Keep App
                </button>
                <button 
                  onClick={() => handleRevoke(revokingId)}
                  className="flex-1 h-14 bg-[#960c1d] text-white rounded-2xl font-semibold hover:bg-[#7a0918] transition-all shadow-xl shadow-red-900/20"
                >
                  Revoke Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
