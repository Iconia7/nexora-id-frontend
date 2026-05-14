"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = loginSchema.extend({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const clientName = searchParams.get("client_name") || searchParams.get("client_id") || "Nexora";
  const returnTo = searchParams.get("returnTo");

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    // Simulate API call
    console.log("Login data:", data);
    setTimeout(() => {
      setIsLoading(false);
      if (returnTo) window.location.href = returnTo;
    }, 1500);
  };

  const onSignupSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    console.log("Signup data:", data);
    setTimeout(() => {
      setIsLoading(false);
      setIsLogin(true);
    }, 1500);
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-2xl rounded-[2.5rem] p-8 md:p-12 overflow-hidden"
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Shield className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
              {isLogin ? "Sign in to continue" : "Create your Nexora ID"}
            </h1>
            <p className="text-slate-500 font-medium">
              {isLogin 
                ? `Continue to ${clientName}` 
                : "One ID for all Nexora ecosystem services."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {isLogin ? (
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    {...loginForm.register("email")}
                    error={loginForm.formState.errors.email?.message}
                  />
                  <Input
                    label="Password"
                    type="password"
                    {...loginForm.register("password")}
                    error={loginForm.formState.errors.password?.message}
                  />
                  <div className="text-right mb-6">
                    <button type="button" className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                      Forgot Password?
                    </button>
                  </div>
                  <Button type="submit" className="w-full group" isLoading={isLoading}>
                    Continue <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              ) : (
                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                  <Input
                    label="Full Name"
                    {...signupForm.register("displayName")}
                    error={signupForm.formState.errors.displayName?.message}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    {...signupForm.register("email")}
                    error={signupForm.formState.errors.email?.message}
                  />
                  <Input
                    label="Password"
                    type="password"
                    {...signupForm.register("password")}
                    error={signupForm.formState.errors.password?.message}
                  />
                  <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
                    Create Nexora ID
                  </Button>
                </form>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Toggle */}
          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm">
              {isLogin ? "Don't have a Nexora ID?" : "Already have a Nexora ID?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-amber-600 font-bold hover:underline"
              >
                {isLogin ? "Join the ecosystem" : "Sign in instead"}
              </button>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-8 font-medium">
          One account for the entire Nexora ecosystem.
        </p>
      </div>
    </main>
  );
}
