"use client";

import { Loader } from "@/components/loading/loader";
import { Button } from "@/components/ui/button";
import { LucideGithub } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginButton() {
  const [loading, setLoading] = useState(false);

  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    errorMessage && toast.error(errorMessage);
  }, [error]);

  return (
    <Button
      disabled={loading}
      onClick={() => {
        setLoading(true);
      }}
    >
      {loading ? (
        <>
          <Loader className="mr-2 size-4 text-white" />
          Logging In
        </>
      ) : (
        <>
          <LucideGithub className="mr-2 size-4" />
          Login with GitHub
        </>
      )}
    </Button>
  );
}
