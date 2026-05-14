"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Lock, Settings, LogOut, Menu, X, Loader2, Bell, Search, ShieldCheck, User, Shield, Code, Layout, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

const navigation = [
  { name: "Connected Apps", href: "/dashboard/apps", icon: LayoutGrid },
  { name: "Security", href: "/dashboard/security", icon: Shield },
  { name: "Developer", href: "/dashboard/developer", icon: Code },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [isSearchLoading, setIsSearchLoading] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

  const fetchProfile = React.useCallback(async () => {
    try {
      const data = await apiFetch("/api/settings/profile");
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchNotifications = React.useCallback(async () => {
    try {
      const data = await apiFetch("/api/dashboard/notifications");
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  }, []);

  // Search Logic
  React.useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearchLoading(true);
      try {
        const results = await apiFetch(`/api/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed");
      } finally {
        setIsSearchLoading(false);
      }
    };

    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  React.useEffect(() => {
    fetchProfile();
    fetchNotifications();

    // Listen for profile updates from other components
    const handleProfileUpdate = () => fetchProfile();
    window.addEventListener("profileUpdate", handleProfileUpdate);

    const interval = setInterval(fetchNotifications, 30000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("profileUpdate", handleProfileUpdate);
    };
  }, [fetchProfile, fetchNotifications]);

  const handleMarkNotificationsRead = async () => {
    try {
      await apiFetch("/api/dashboard/notifications/read", { method: "POST" });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark notifications as read");
    }
  };

  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed");
    }
  };

  const getAvatarUrl = (path: string) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return `${baseUrl}${path}?t=${Date.now()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#960c1d]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-[#960c1d]/10 selection:text-[#960c1d]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#010a26] fixed inset-y-0 z-50">
        <div className="p-8">
          <Link href="/dashboard/apps" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-500">
              <img src="/brand/logo.png" alt="Nexora" className="w-8 h-8 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white">Nexora ID</span>
              <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-white/40">Identity Node</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "bg-white/10 text-white shadow-lg" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-[#960c1d] rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-[#960c1d]" : "text-inherit"
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72 min-h-screen flex flex-col">
        {/* Intelligence Header */}
        <header className="sticky top-0 z-40 h-24 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-xl relative">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#960c1d] transition-colors" />
              <input
                type="text"
                placeholder="Search resources, apps or activity..."
                className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-[#010a26]/5 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isSearchLoading && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-slate-400" />
              )}
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {searchQuery.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-4 z-50 overflow-hidden"
                >
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-4">Search Results</div>
                  <div className="space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
                    {searchResults.length > 0 ? searchResults.map((result: any) => (
                      <Link
                        key={`${result.type}-${result.id}`}
                        href={result.href}
                        onClick={() => setSearchQuery("")}
                        className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group"
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          result.type === 'APP' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                        )}>
                          {result.type === 'APP' ? <LayoutGrid className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#010a26] group-hover:text-[#960c1d] transition-colors">{result.title}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{result.subtitle}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                      </Link>
                    )) : !isSearchLoading && (
                      <div className="text-center py-10">
                        <p className="text-sm font-medium text-slate-400">No matches found for "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            {/* Intelligence Hub */}
            <div className="hidden xl:flex flex-col items-end mr-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Intelligence Hub
              </div>
              <div className="text-[11px] font-bold text-[#010a26]">All systems operational</div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all relative group"
              >
                <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#960c1d] border-2 border-white rounded-full" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6 z-50"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-[#010a26]">System Alerts</h3>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#960c1d] bg-red-50 px-2 py-1 rounded-lg">Real-time</span>
                    </div>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {notifications.length > 0 ? notifications.map((n: any) => (
                        <div key={n.id} className={cn(
                          "flex gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group relative",
                          !n.read && "bg-slate-50/50"
                        )}>
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                            n.type === 'SECURITY' ? 'bg-red-50' : 'bg-blue-50'
                          )}>
                            {n.type === 'SECURITY' ? <Lock className="w-4 h-4 text-[#960c1d]" /> : <Bell className="w-4 h-4 text-blue-600" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#010a26] mb-0.5">{n.title}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{n.message}</p>
                          </div>
                          {!n.read && (
                            <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-[#960c1d] rounded-full" />
                          )}
                        </div>
                      )) : (
                        <div className="text-center py-8">
                          <p className="text-xs font-medium text-slate-400">No new alerts</p>
                        </div>
                      )}
                    </div>

                    {notifications.some(n => !n.read) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkNotificationsRead();
                        }}
                        className="w-full mt-6 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile */}
            <Link href="/dashboard/settings" className="flex items-center gap-4 pl-4 border-l border-slate-100 group">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-[#010a26]">{user?.displayName || "Nexora User"}</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Session</span>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-[1.25rem] border-2 border-white shadow-lg overflow-hidden group-hover:scale-105 transition-transform duration-500">
                {user?.avatar ? (
                  <img src={getAvatarUrl(user.avatar) || ""} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold">
                    {user?.displayName?.[0] || <User className="w-5 h-5" />}
                  </div>
                )}
              </div>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-600"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <section className="flex-1 p-6 lg:p-10 relative">
           {/* Animated Background Accents */}
           <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
             <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#960c1d]/5 blur-[100px] rounded-full" />
             <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full" />
           </div>

           <div className="relative z-10">
             {children}
           </div>
        </section>

        {/* Intelligence Footer */}
        <footer className="h-16 bg-white border-t border-slate-100 px-10 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Region: NBO-1</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Node: Primary</span>
          </div>
          <div className="hidden sm:block">Nexora ID &bull; Secure Authentication Node &bull; v1.0.4</div>
          <div className="flex items-center gap-4">
             <Link href="#" className="hover:text-[#960c1d] transition-colors">Privacy</Link>
             <Link href="#" className="hover:text-[#960c1d] transition-colors">Legal</Link>
          </div>
        </footer>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#010a26]/60 backdrop-blur-sm z-[60]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-[#010a26] z-[70] p-8 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                    <img src="/brand/logo.png" alt="Nexora" className="w-6 h-6 object-contain" />
                  </div>
                  <span className="text-lg font-bold text-white tracking-tight">Nexora ID</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all duration-300",
                        isActive ? "bg-white/10 text-white shadow-lg" : "text-white/50 hover:text-white"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", isActive ? "text-[#960c1d]" : "text-inherit")} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-8 border-t border-white/5">
                <div className="flex items-center gap-4 px-5 py-4 mb-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl overflow-hidden">
                    {user?.avatar ? (
                       <img src={getAvatarUrl(user.avatar) || ""} alt="User" className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-white/40"><User className="w-5 h-5" /></div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{user?.displayName || "Nexora User"}</span>
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Online</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
