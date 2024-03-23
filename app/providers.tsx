"use client";

import { ModalProvider } from "@/components/modal/provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <TooltipProvider delayDuration={0}>
        <ModalProvider>{children}</ModalProvider>
      </TooltipProvider>
    </>
  );
}
