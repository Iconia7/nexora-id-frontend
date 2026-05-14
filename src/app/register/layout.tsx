import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join the Nexora ecosystem. One account to rule them all.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
