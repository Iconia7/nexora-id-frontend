import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Portal",
  description: "Register and manage your own OAuth applications on Nexora ID.",
};

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
