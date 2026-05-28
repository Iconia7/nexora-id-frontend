"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Code, Copy, Check, ExternalLink, ShieldAlert, ArrowRight, 
  Lock, Key, Server, Menu, X, ArrowLeft, Terminal, Layout, HelpCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type SectionId = "overview" | "getting-started" | "button-setup" | "nextauth" | "raw-oauth";

interface DocSection {
  id: SectionId;
  title: string;
  category: string;
}

const SECTIONS: DocSection[] = [
  { id: "overview", title: "Overview", category: "Introduction" },
  { id: "getting-started", title: "Developer Setup", category: "Introduction" },
  { id: "button-setup", title: "Adding the Button", category: "Integration" },
  { id: "nextauth", title: "NextAuth.js Setup", category: "SDK & Libraries" },
  { id: "raw-oauth", title: "Raw OAuth Protocol", category: "API Specs" },
];

export default function DocsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = React.useState<SectionId>("overview");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const nextAuthCode = `// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";

export const authOptions = {
  providers: [
    {
      id: "nexora",
      name: "Nexora ID",
      type: "oauth",
      authorization: "https://accounts.nexoracreatives.co.ke/oauth/authorize?scope=openid+profile+email",
      token: "https://accounts.nexoracreatives.co.ke/oauth/token",
      userinfo: "https://accounts.nexoracreatives.co.ke/oauth/userinfo",
      clientId: process.env.NEXORA_CLIENT_ID,
      clientSecret: process.env.NEXORA_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.avatar,
        };
      },
    },
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };`;

  const authorizeUrlCode = `https://accounts.nexoracreatives.co.ke/oauth/authorize
  ?client_id=YOUR_CLIENT_ID
  &redirect_uri=https://your-app.com/callback
  &response_type=code
  &scope=openid profile email
  &state=SECURE_RANDOM_STATE`;

  const tokenRequestCode = `curl -X POST https://accounts.nexoracreatives.co.ke/oauth/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=authorization_code" \\
  -d "code=AUTH_CODE_RECEIVED" \\
  -d "redirect_uri=https://your-app.com/callback" \\
  -d "client_id=YOUR_CLIENT_ID" \\
  -d "client_secret=YOUR_CLIENT_SECRET"`;

  const userInfoCode = `curl -X GET https://accounts.nexoracreatives.co.ke/oauth/userinfo \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-[#960c1d]/10 selection:text-[#960c1d]">
      
      {/* Light Premium Header (matches Dashboard Header) */}
      <header className="sticky top-0 z-50 h-24 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 lg:px-12 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-[#010a26] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#960c1d]" />
            <span className="hidden sm:inline">Portal Login</span>
          </button>
          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#010a26] rounded-xl flex items-center justify-center shadow-md">
              <img src="/brand/logo.png" alt="Nexora" className="w-6 h-6 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#010a26] tracking-tight">Nexora ID</span>
              <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-slate-400">Documentation</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            onClick={() => router.push("/register")}
            className="hidden md:flex h-10 px-5 bg-[#010a26] hover:bg-[#051445] text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all"
          >
            Sign Up
          </Button>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-slate-600 hover:text-[#010a26]"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Docs Layout */}
      <div className="flex-1 flex max-w-8xl mx-auto w-full relative">
        
        {/* Navigation Sidebar - Desktop (matches Dashboard Sidebar style) */}
        <aside className="hidden lg:flex flex-col w-80 bg-[#010a26] p-8 space-y-8 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto z-20">
          {/* Categories */}
          {["Introduction", "Integration", "SDK & Libraries", "API Specs"].map((category) => (
            <div key={category} className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{category}</h4>
              <div className="space-y-1">
                {SECTIONS.filter(s => s.category === category).map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full text-left px-5 py-3.5 rounded-2xl text-xs font-semibold transition-all duration-300 relative overflow-hidden group",
                        isActive 
                          ? "bg-white/10 text-white shadow-lg" 
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-pill-docs"
                          className="absolute left-0 w-1 h-5 bg-[#960c1d] rounded-r-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      {section.title}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 bg-[#f8fafc] px-4 sm:px-8 py-10 md:p-16 max-w-6xl relative z-10">
          
          {/* Animated Background Accents (matches layout client) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 z-0">
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#960c1d]/5 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-12 relative z-10"
            >
              
              {/* Section 1: Overview */}
              {activeSection === "overview" && (
                <div className="space-y-8">
                  {/* Premium Section Card (matches Dashboard sections) */}
                  <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#960c1d]/5 to-transparent opacity-100" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#960c1d]">Introduction</span>
                      <h1 className="text-3xl font-semibold text-[#010a26] mt-2 tracking-tight">Nexora ID Overview</h1>
                      <p className="text-slate-500 font-medium mt-4 leading-relaxed text-sm">
                        Nexora ID is a secure, single-sign-on (SSO) identity provider designed to simplify user authentication across all Nexora ecosystem properties. By integrating **Sign In with Nexora**, you let users sign in with a single click, instantly sharing profile information with your application in a safe and structured manner.
                      </p>
                    </div>
                  </section>

                  <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                        <Lock className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#010a26]">Unified Credentials</h4>
                        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                          One user account, secure credentials, and profile options. Users do not need to register separate login hashes across Nexora POS, Menu, or third-party client apps.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                    <h3 className="text-lg font-semibold text-[#010a26] mb-6">Core Protocol Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: "Standard OAuth 2.0", desc: "Built using OAuth 2.0 authorization code grant rules." },
                        { title: "PKCE Security", desc: "Supports PKCE code verifiers for native and public apps." },
                        { title: "Centralized Audit Logs", desc: "Users monitor all active sessions from their profile security pulse." },
                        { title: "2FA Integration", desc: "TOTP 2FA protects access to consent steps automatically." },
                      ].map((item, idx) => (
                        <li key={idx} className="p-5 border border-slate-100 rounded-2xl space-y-2">
                          <span className="text-xs font-bold text-[#010a26] block">{item.title}</span>
                          <span className="text-xs text-slate-500 font-medium leading-relaxed block">{item.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <div className="pt-6">
                    <Button 
                      onClick={() => setActiveSection("getting-started")}
                      className="h-12 bg-[#010a26] text-white px-8 rounded-xl font-bold flex items-center gap-2 group shadow-xl shadow-[#010a26]/10"
                    >
                      Getting Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Section 2: Getting Started */}
              {activeSection === "getting-started" && (
                <div className="space-y-8">
                  <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#960c1d]">Developer Portal</span>
                      <h1 className="text-3xl font-semibold text-[#010a26] mt-2 tracking-tight">Getting Started</h1>
                      <p className="text-slate-500 font-medium mt-4 leading-relaxed text-sm">
                        Follow these steps to sign up, configure your client application, and retrieve your credentials.
                      </p>
                    </div>
                  </section>

                  <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                    <div className="space-y-6 relative border-l-2 border-slate-100 pl-8 ml-4">
                      {[
                        {
                          title: "1. Create a Nexora ID Account",
                          desc: "If you don't have an account, register at accounts.nexoracreatives.co.ke/register. Verify your identity via the secure OTP code sent to your email."
                        },
                        {
                          title: "2. Navigate to the Developer Portal",
                          desc: "Log in to your Dashboard, and click on 'Developer Portal' in the left-hand navigation sidebar."
                        },
                        {
                          title: "3. Register Your Client Application",
                          desc: "Click 'Create New App'. Provide your app name (e.g. 'My Creative App') and callback Redirect URIs. These redirect URIs specify where Nexora ID returns users after authentication."
                        },
                        {
                          title: "4. Store Client Credentials",
                          desc: "After registration, a one-time dialog displays your Client ID and Client Secret. Copy the secret now—it is hashed and cannot be retrieved again."
                        }
                      ].map((step, idx) => (
                        <div key={idx} className="relative space-y-2">
                          <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-white border-2 border-[#960c1d] flex items-center justify-center text-[10px] font-bold text-[#960c1d]">
                            {idx + 1}
                          </div>
                          <h4 className="text-sm font-bold text-[#010a26]">{step.title}</h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                    <div className="flex items-start gap-4 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
                      <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-amber-900">Keep Your Credentials Secure</h4>
                        <p className="text-[11px] text-amber-800 mt-1 font-medium leading-relaxed">
                          Never check client secrets into version control (git). Always store client secrets in environment variables (`NEXORA_CLIENT_SECRET`) or secure vaults.
                        </p>
                      </div>
                    </div>
                  </section>

                  <div className="pt-6">
                    <Button 
                      onClick={() => setActiveSection("button-setup")}
                      className="h-12 bg-[#010a26] text-white px-8 rounded-xl font-bold flex items-center gap-2 group shadow-xl shadow-[#010a26]/10"
                    >
                      Add Login Button <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Section 3: Button Setup */}
              {activeSection === "button-setup" && (
                <div className="space-y-8">
                  <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#960c1d]">Frontend Integration</span>
                      <h1 className="text-3xl font-semibold text-[#010a26] mt-2 tracking-tight">Adding the Login Button</h1>
                      <p className="text-slate-500 font-medium mt-4 leading-relaxed text-sm">
                        Create a standard, professional "Sign In with Nexora ID" button in your project matching our brand guidelines.
                      </p>
                    </div>
                  </section>

                  {/* Visual Preview */}
                  <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                    <div className="border border-slate-100 p-8 rounded-[2rem] bg-slate-50/50 flex flex-col items-center justify-center gap-4 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Brand Button Preview</span>
                      
                      {/* Nexora ID Button */}
                      <button className="h-12 bg-[#010a26] hover:bg-[#06123a] text-white px-6 rounded-xl font-semibold text-sm flex items-center gap-3 transition-all shadow-lg shadow-[#010a26]/10">
                        <img src="/brand/logo.png" alt="Nexora" className="w-5 h-5 bg-white p-0.5 rounded-md object-contain shrink-0" />
                        Sign In with Nexora ID
                      </button>
                    </div>
                  </section>

                  {/* Code snippet for button HTML/CSS */}
                  <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">React Tailwind Button Component</h4>
                        <button 
                          onClick={() => copyToClipboard(`{/* Sign In with Nexora ID Button */}
<button className="h-12 bg-[#010a26] hover:bg-[#06123a] text-white px-6 rounded-xl font-semibold text-sm flex items-center gap-3 transition-all shadow-lg">
  <img src="https://accounts.nexoracreatives.co.ke/brand/logo.png" alt="Nexora" className="w-5 h-5 bg-white p-0.5 rounded-md object-contain shrink-0" />
  Sign In with Nexora ID
</button>`, "btn-code")}
                          className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1.5"
                        >
                          {copiedId === "btn-code" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedId === "btn-code" ? "Copied" : "Copy Code"}
                        </button>
                      </div>
                      <pre className="bg-[#010a26] text-slate-300 p-5 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-white/5">
                        <code>{`{/* Sign In with Nexora ID Button */}
<button className="h-12 bg-[#010a26] hover:bg-[#06123a] text-white px-6 rounded-xl font-semibold text-sm flex items-center gap-3 transition-all shadow-lg">
  <img src="https://accounts.nexoracreatives.co.ke/brand/logo.png" alt="Nexora" className="w-5 h-5 bg-white p-0.5 rounded-md object-contain shrink-0" />
  Sign In with Nexora ID
</button>`}</code>
                      </pre>
                    </div>
                  </section>

                  <div className="pt-6">
                    <Button 
                      onClick={() => setActiveSection("nextauth")}
                      className="h-12 bg-[#010a26] text-white px-8 rounded-xl font-bold flex items-center gap-2 group shadow-xl shadow-[#010a26]/10"
                    >
                      Configure next-auth <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Section 4: NextAuth.js */}
              {activeSection === "nextauth" && (
                <div className="space-y-8">
                  <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#960c1d]">NextAuth.js Setup</span>
                      <h1 className="text-3xl font-semibold text-[#010a26] mt-2 tracking-tight">Integrating with NextAuth.js</h1>
                      <p className="text-slate-500 font-medium mt-4 leading-relaxed text-sm">
                        NextAuth.js (Auth.js) is the easiest way to add Nexora ID authentication to your Next.js project. Configure a custom OAuth provider as shown below.
                      </p>
                    </div>
                  </section>

                  <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">custom provider code</span>
                        <button 
                          onClick={() => copyToClipboard(nextAuthCode, "nextauth-code")}
                          className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1.5"
                        >
                          {copiedId === "nextauth-code" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedId === "nextauth-code" ? "Copied" : "Copy Code"}
                        </button>
                      </div>
                      <pre className="bg-[#010a26] text-slate-300 p-5 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-white/5">
                        <code>{nextAuthCode}</code>
                      </pre>
                    </div>
                  </section>

                  <div className="pt-6">
                    <Button 
                      onClick={() => setActiveSection("raw-oauth")}
                      className="h-12 bg-[#010a26] text-white px-8 rounded-xl font-bold flex items-center gap-2 group shadow-xl shadow-[#010a26]/10"
                    >
                      Raw OAuth Endpoints <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Section 5: Raw OAuth */}
              {activeSection === "raw-oauth" && (
                <div className="space-y-8">
                  <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#960c1d]">OAuth Endpoints</span>
                      <h1 className="text-3xl font-semibold text-[#010a26] mt-2 tracking-tight">OAuth 2.0 Protocol Specifications</h1>
                      <p className="text-slate-500 font-medium mt-4 leading-relaxed text-sm">
                        If you're building a custom client integration or using other languages (Python, Go, etc.), integrate directly with these OAuth endpoints.
                      </p>
                    </div>
                  </section>

                  {/* Flow Steps */}
                  <div className="space-y-6">
                    
                    {/* Step 1 */}
                    <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-[#010a26]">1. Redirect Users to Authorize</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Redirect users to the authorization page with parameters. `state` is strictly required to protect against CSRF.
                        </p>
                        <pre className="bg-[#010a26] text-slate-300 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                          <code>{authorizeUrlCode}</code>
                        </pre>
                      </div>
                    </section>

                    {/* Step 2 */}
                    <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-[#010a26]">2. Redeem Authorization Code</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Redeem the code for access/refresh tokens in your backend API:
                        </p>
                        <pre className="bg-[#010a26] text-slate-300 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                          <code>{tokenRequestCode}</code>
                        </pre>
                      </div>
                    </section>

                    {/* Step 3 */}
                    <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-[#010a26]">3. Request Profile Data</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Authorize requests by passing your bearer token:
                        </p>
                        <pre className="bg-[#010a26] text-slate-300 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                          <code>{userInfoCode}</code>
                        </pre>
                      </div>
                    </section>

                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-white/5 py-10 px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs gap-4 z-20">
        <span>© 2026 Nexora Creatives. All rights reserved.</span>
        <div className="flex gap-6">
          <button onClick={() => router.push("/login")} className="hover:text-white transition-colors">Client Login</button>
          <button onClick={() => router.push("/register")} className="hover:text-white transition-colors">Developer Portal</button>
        </div>
      </footer>

      {/* Mobile Menu Drawer (matches layout style) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[99]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-80 bg-[#010a26] z-[100] p-8 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-white/40">Menu</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto">
                {["Introduction", "Integration", "SDK & Libraries", "API Specs"].map((category) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-[9px] font-bold uppercase tracking-wider text-white/40">{category}</h4>
                    <div className="flex flex-col gap-1">
                      {SECTIONS.filter(s => s.category === category).map((section) => {
                        const isActive = activeSection === section.id;
                        return (
                          <button
                            key={section.id}
                            onClick={() => {
                              setActiveSection(section.id);
                              setMobileMenuOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all",
                              isActive 
                                ? "bg-white/10 text-white shadow-lg" 
                                : "text-white/50 hover:text-white hover:bg-white/5"
                            )}
                          >
                            {section.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
