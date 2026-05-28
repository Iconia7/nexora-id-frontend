"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Plus, Copy, ExternalLink, Trash2, Shield, Check, Loader2, Server, Key, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

export default function DeveloperPage() {
  const { showToast } = useToast();
  const [apps, setApps] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCreating, setIsCreating] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  // One-time secret modal — shown immediately after app creation, then never again
  const [newAppSecret, setNewAppSecret] = React.useState<{ clientId: string; clientSecret: string; name: string } | null>(null);
  const [secretCopied, setSecretCopied] = React.useState(false);

  // New App Form
  const [newName, setNewName] = React.useState("");
  const [newRedirectUris, setNewRedirectUris] = React.useState("");

  const fetchApps = React.useCallback(async () => {
    try {
      const data = await apiFetch("/api/developer/apps");
      setApps(data);
    } catch {
      // Silently fail — user sees empty state
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const created = await apiFetch("/api/developer/apps", {
        method: "POST",
        body: JSON.stringify({
          name: newName,
          redirectUris: newRedirectUris
        })
      });

      setNewName("");
      setNewRedirectUris("");
      setShowCreateModal(false);
      fetchApps();

      // Show the one-time secret modal — the secret is NOT shown again after this
      if (created?.clientSecret) {
        setNewAppSecret({
          clientId: created.clientId,
          clientSecret: created.clientSecret,
          name: created.name,
        });
        setSecretCopied(false);
      } else {
        showToast("Application registered successfully", "success");
      }
    } catch (error: any) {
      showToast(error.message || "Failed to create application", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteApp = async (id: string) => {
    if (!confirm("Are you sure? This will break all active integrations for this app.")) return;
    try {
      await apiFetch(`/api/developer/apps/${id}`, { method: "DELETE" });
      showToast("Application revoked", "success");
      fetchApps();
    } catch {
      showToast("Failed to delete application", "error");
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard`, "success");
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#960c1d]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-semibold text-[#010a26] mb-2 tracking-tight">Developer Portal</h1>
          <p className="text-slate-500 font-medium leading-relaxed">Build and manage secure integrations with Nexora ID.</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#960c1d] hover:bg-[#b31226] text-white px-8 h-12 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-[#960c1d]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New App
        </Button>
      </div>

      {apps.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-8 sm:p-20 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto">
            <Code className="w-10 h-10 text-slate-300" />
          </div>
          <div className="max-w-sm mx-auto">
            <h3 className="text-xl font-semibold text-[#010a26] mb-2">No Applications Found</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">Ready to build the next big thing? Register your first application to get started.</p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#010a26] text-white px-8 h-12 rounded-xl font-bold"
            >
              Get Started
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {apps.map((app) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] border border-slate-100 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)] transition-all group"
            >
              <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="w-16 h-16 bg-[#010a26] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
                    {app.name[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#010a26] mb-1">{app.name}</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <Server className="w-3 h-3" />
                        OAuth 2.0 Client
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold uppercase tracking-wider">
                        <Shield className="w-3 h-3" />
                        {app._count.consents} Active Users
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(app.clientId, "Client ID")}
                    className="h-10 rounded-lg px-4 border-slate-200 text-slate-600 font-bold text-xs gap-2"
                  >
                    <Copy className="w-3 h-3" />
                    Copy ID
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteApp(app.id)}
                    className="h-10 rounded-lg px-4 border-rose-100 text-rose-600 hover:bg-rose-50 font-bold text-xs gap-2"
                  >
                    <Trash2 className="w-3 h-3" />
                    Revoke
                  </Button>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Client Credentials</label>
                  <div className="space-y-3">
                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 flex items-center justify-between group/row">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Client ID</span>
                        <code className="text-xs font-mono text-slate-700">{app.clientId}</code>
                      </div>
                      <button onClick={() => copyToClipboard(app.clientId, "Client ID")} className="p-2 hover:bg-white rounded-lg transition-colors opacity-0 group-hover/row:opacity-100">
                        <Copy className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                    {/* SECURITY: Client Secret is never shown after creation.
                        Use "Create New App" to get a new secret if you've lost yours. */}
                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Client Secret</span>
                        <span className="text-xs font-mono text-slate-400 tracking-widest">••••••••••••••••••••••••</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Secret shown once at creation. Revoke and recreate the app to get a new secret.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Callback URLs</label>
                  <div className="space-y-2">
                    {app.redirectUris.split(',').map((uri: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100 break-all">
                        <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                        {uri}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-[#010a26]/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-xl p-6 sm:p-10 shadow-2xl relative z-10"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <Plus className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#010a26] mb-2">Register Application</h2>
              <p className="text-slate-500 font-medium mb-8">Get your credentials to start integrating Nexora ID.</p>

              <form onSubmit={handleCreateApp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Application Name</label>
                  <Input
                    placeholder="e.g. Nexora POS"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    className="h-12 bg-slate-50 border-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Redirect URIs</label>
                  <Input
                    placeholder="e.g. http://localhost:3001/callback"
                    value={newRedirectUris}
                    onChange={(e) => setNewRedirectUris(e.target.value)}
                    required
                    className="h-12 bg-slate-50 border-none"
                  />
                  <p className="text-[11px] text-slate-400 ml-1">Comma-separated for multiple URLs.</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 h-12 rounded-xl font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isCreating}
                    className="flex-1 h-12 rounded-xl font-bold bg-[#010a26] text-white shadow-lg shadow-[#010a26]/20"
                  >
                    Create Application
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* One-Time Secret Modal — shown immediately after creation */}
      <AnimatePresence>
        {newAppSecret && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#010a26]/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-xl p-6 sm:p-10 shadow-2xl relative z-10"
            >
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
                <Key className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#010a26] mb-1">Save your Client Secret</h2>
              <p className="text-slate-500 font-medium mb-6 text-sm leading-relaxed">
                <strong className="text-[#010a26]">{newAppSecret.name}</strong> was created. Copy your secret now — it will <strong>never be shown again</strong>.
              </p>

              {/* Warning banner */}
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700 font-medium leading-relaxed">
                  Store this secret in a secure vault (e.g. environment variable, secrets manager). It cannot be recovered after you close this dialog.
                </p>
              </div>

              {/* Client ID */}
              <div className="space-y-3 mb-6">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Client ID</span>
                  <code className="text-xs font-mono text-slate-700 break-all">{newAppSecret.clientId}</code>
                </div>

                {/* Client Secret */}
                <div className="bg-slate-50 rounded-xl p-3 border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-600 uppercase block mb-1">Client Secret (copy now)</span>
                  <code className="text-xs font-mono text-slate-700 break-all">{newAppSecret.clientSecret}</code>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(newAppSecret.clientSecret);
                    setSecretCopied(true);
                  }}
                  className="flex-1 h-12 rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white gap-2"
                >
                  {secretCopied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Secret</>}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setNewAppSecret(null)}
                  className="flex-1 h-12 rounded-xl font-bold border-slate-200"
                >
                  I've Saved It
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
