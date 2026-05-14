import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connected Apps",
  description: "Manage applications that have access to your Nexora ID account.",
};

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
