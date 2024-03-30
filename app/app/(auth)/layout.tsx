import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login | Platforms Starter Kit",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dotted flex min-h-screen flex-col justify-center  bg-muted py-12 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
