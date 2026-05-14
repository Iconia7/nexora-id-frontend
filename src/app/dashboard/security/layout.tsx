import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Settings",
  description: "Secure your account with 2FA, password management, and session monitoring.",
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
