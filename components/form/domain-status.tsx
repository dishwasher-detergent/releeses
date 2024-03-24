"use client";

import { Loader } from "@/components/loading/loader";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useDomainStatus } from "./use-domain-status";

export default function DomainStatus({ domain }: { domain: string }) {
  const { status, loading } = useDomainStatus({ domain });

  return loading ? (
    <Loader className="mr-2 text-white" />
  ) : status === "Valid Configuration" ? (
    <CheckCircle2 className="bg-blue-500 text-white dark:text-black" />
  ) : status === "Pending Verification" ? (
    <AlertCircle className="bg-amber-500 text-white dark:text-black" />
  ) : (
    <XCircle className="bg-red-500 text-white dark:text-black" />
  );
}
