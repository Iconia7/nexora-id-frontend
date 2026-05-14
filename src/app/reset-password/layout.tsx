import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Securely update your Nexora ID account password.",
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
