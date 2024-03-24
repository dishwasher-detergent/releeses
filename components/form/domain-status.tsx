"use client";

import { useDomainStatus } from "@/components/form/use-domain-status";
import { Loader } from "@/components/loading/loader";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export default function DomainStatus({ domain }: { domain: string }) {
  const { status, loading } = useDomainStatus({ domain });

  return loading ? (
    <Loader className="size-6" />
  ) : status === "Valid Configuration" ? (
    <CheckCircle2 className="text-blue-500" />
  ) : status === "Pending Verification" ? (
    <AlertCircle className="text-amber-500" />
  ) : (
    <XCircle className="text-red-500" />
  );
}
