"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Globe, Bell, Shield, Save, Loader2, Camera, MapPin, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

export default function SettingsPage() {
  const { showToast } = useToast();
  const [user, setUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  // Form State
  const [displayName, setDisplayName] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [timezone, setTimezone] = React.useState("UTC");
  const [marketingEmails, setMarketingEmails] = React.useState(false);
  const [securityEmails, setSecurityEmails] = React.useState(true);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchProfile = React.useCallback(async () => {
    try {
      const data = await apiFetch("/api/settings/profile");
      setUser(data);
      setDisplayName(data.displayName || "");
      setBio(data.bio || "");
      setTimezone(data.timezone || "UTC");
      setMarketingEmails(data.marketingEmails);
      setSecurityEmails(data.securityEmails);
    } catch (error) {
      console.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiFetch("/api/settings/profile", {
        method: "PATCH",
        body: JSON.stringify({
          displayName,
          bio,
          timezone,
          marketingEmails,
          securityEmails
        })
      });
      showToast("Profile updated successfully", "success");
      // Notify other components
      window.dispatchEvent(new Event("profileUpdate"));
    } catch (error: any) {
      showToast(error.message || "Failed to save changes", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setIsUploading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${baseUrl}/api/settings/avatar`, {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      
      if (!response.ok) throw new Error("Upload failed");
      
      const data = await response.json();
      setUser((prev: any) => ({ ...prev, avatar: data.avatar }));
      showToast("Profile picture updated", "success");
      
      // Notify other components (Header)
      window.dispatchEvent(new Event("profileUpdate"));
    } catch (error) {
      showToast("Failed to upload image", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const getAvatarUrl = (path: string) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return `${baseUrl}${path}`;
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#960c1d]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-semibold text-[#010a26] mb-2 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 font-medium leading-relaxed">Manage your Nexora ID identity and global preferences.</p>
        </div>
        <Button 
          onClick={handleSave} 
          isLoading={isSaving}
          className="bg-[#010a26] hover:bg-[#051445] text-white px-8 h-12 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-[#010a26]/10 transition-all"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)]"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#010a26]">Public Profile</h2>
              <p className="text-sm text-slate-400 font-medium">This information is visible across the Nexora ecosystem.</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-10 items-start">
               <div className="relative group">
                  <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg relative">
                    {isUploading && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-[#960c1d]" />
                      </div>
                    )}
                    {user?.avatar ? (
                      <img src={getAvatarUrl(user.avatar) || ""} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-slate-300">{displayName[0]}</span>
                    )}
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-[#960c1d] transition-colors z-30"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
               </div>

               <div className="flex-1 w-full space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[13px] font-semibold text-slate-700 ml-1">Full Name</label>
                      <Input 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Newton Mwangi"
                        className="h-12 bg-slate-50/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-semibold text-slate-700 ml-1">Email Address</label>
                      <div className="relative group">
                        <Input 
                          value={user?.email || ""}
                          readOnly
                          className="h-12 bg-slate-50/50 opacity-60 pr-12 cursor-not-allowed"
                        />
                        <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Short Bio</label>
                    <textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us a bit about yourself..."
                      className="w-full min-h-[100px] bg-slate-50/50 border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#010a26]/5 transition-all outline-none placeholder:text-slate-400"
                    />
                  </div>
               </div>
            </div>
          </div>
        </motion.section>

        {/* Global Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-[#010a26]">Regional</h2>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-slate-700 ml-1">Timezone</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#010a26]/5 outline-none appearance-none cursor-pointer transition-all"
                    >
                      <option value="UTC">UTC (Universal Time)</option>
                      <option value="Africa/Nairobi">EAT (Nairobi, Kenya)</option>
                      <option value="Europe/London">GMT (London, UK)</option>
                      <option value="America/New_York">EST (New York, USA)</option>
                      <option value="Asia/Dubai">GST (Dubai, UAE)</option>
                    </select>
                  </div>
               </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-rose-600" />
              </div>
              <h2 className="text-xl font-semibold text-[#010a26]">Notifications</h2>
            </div>

            <div className="space-y-4">
               <PreferenceToggle 
                  title="Security Alerts" 
                  desc="Critical updates for your ID." 
                  active={securityEmails} 
                  onToggle={() => setSecurityEmails(!securityEmails)}
                  disabled={true}
               />
               <PreferenceToggle 
                  title="Marketing" 
                  desc="New feature announcements." 
                  active={marketingEmails} 
                  onToggle={() => setMarketingEmails(!marketingEmails)}
               />
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

function PreferenceToggle({ title, desc, active, onToggle, disabled = false }: { title: string, desc: string, active: boolean, onToggle: () => void, disabled?: boolean }) {
  return (
    <div className={`flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 transition-all ${disabled ? 'opacity-70' : 'hover:border-slate-200'}`}>
      <div className="flex-1 pr-4">
        <p className="text-[13px] font-semibold text-[#010a26]">{title}</p>
        <p className="text-[11px] text-slate-500 font-medium">{desc}</p>
      </div>
      <button 
        onClick={onToggle}
        disabled={disabled}
        className={`w-12 h-6 rounded-full relative transition-all duration-300 flex-shrink-0 ${active ? 'bg-[#960c1d]' : 'bg-slate-200'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <motion.div 
          animate={{ x: active ? 24 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}
