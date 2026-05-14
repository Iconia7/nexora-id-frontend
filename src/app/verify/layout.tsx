import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Identity",
  description: "Confirm your identity to secure your Nexora ID account.",
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
