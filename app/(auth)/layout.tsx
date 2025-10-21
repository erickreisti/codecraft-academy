import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro - CodeCraft Academy",
  description:
    "Crie sua conta na CodeCraft Academy e comece sua jornada em programação",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
