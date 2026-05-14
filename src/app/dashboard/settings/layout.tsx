import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Update your profile information and account preferences.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
