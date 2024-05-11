"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/lib/supabase/client";
import { LucideGitBranch, LucideGithub, LucideGitlab } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <Card className="mx-auto w-full max-w-sm p-4">
      <CardHeader className="mb-4 border-b">
        <Link href="/" className="mb-4 flex items-center gap-2 font-semibold">
          <Logo variant="dynamic" />
          <span className="text-xl font-black">Releeses</span>
        </Link>
        <CardTitle className="text-lg">Sign In</CardTitle>
        <CardDescription>
          Use one of our 3rd party providers to sign in.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button
          className="w-full"
          onClick={async () => {
            const supabase = createClient();
            supabase.auth.signInWithOAuth({
              provider: "github",
              options: {
                redirectTo: `${
                  process.env.NEXT_PUBLIC_ROOT_DOMAIN?.includes("localhost")
                    ? "http"
                    : "https"
                }://app.${
                  process.env.NEXT_PUBLIC_ROOT_DOMAIN
                }/api/auth/callback`,
              },
            });
          }}
        >
          <LucideGithub className="mr-2 size-4" />
          GitHub
        </Button>
        <Button
          className="w-full"
          onClick={async () => {
            const supabase = createClient();
            supabase.auth.signInWithOAuth({
              provider: "bitbucket",
              options: {
                redirectTo: `${
                  process.env.NEXT_PUBLIC_ROOT_DOMAIN?.includes("localhost")
                    ? "http"
                    : "https"
                }://app.${
                  process.env.NEXT_PUBLIC_ROOT_DOMAIN
                }/api/auth/callback`,
              },
            });
          }}
        >
          <LucideGitBranch className="mr-2 size-4" />
          BitBucket
        </Button>
        <Button
          className="w-full"
          onClick={async () => {
            const supabase = createClient();
            supabase.auth.signInWithOAuth({
              provider: "gitlab",
              options: {
                redirectTo: `${
                  process.env.NEXT_PUBLIC_ROOT_DOMAIN?.includes("localhost")
                    ? "http"
                    : "https"
                }://app.${
                  process.env.NEXT_PUBLIC_ROOT_DOMAIN
                }/api/auth/callback`,
              },
            });
          }}
        >
          <LucideGitlab className="mr-2 size-4" />
          GitLab
        </Button>
      </CardContent>
    </Card>
  );
}
