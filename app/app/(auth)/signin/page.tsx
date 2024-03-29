"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_DOMAIN ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      "http://app.localhost:3000/";
    // Make sure to include `https://` when not localhost.
    url = url.includes("http") ? url : `https://${url}`;
    // Make sure to include a trailing `/`.
    url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;

    console.log(url);

    return url;
  };

  return (
    <Card className="mx-auto w-full max-w-sm p-4">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full"
          onClick={async () => {
            const supabase = createClient();
            supabase.auth.signInWithOAuth({
              provider: "github",
              options: {
                redirectTo: `${getURL()}/api/auth/callback`,
              },
            });
          }}
        >
          Github
        </Button>
      </CardContent>
    </Card>
  );
}
