import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authenticating",
  description: "Completing your sign-in to the Nexora ecosystem.",
};

export default function CallbackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
