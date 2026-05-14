import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authorize Application",
  description: "Grant or deny permissions for third-party applications to access your Nexora ID.",
};

export default function ConsentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
