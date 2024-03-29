import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(
    `${
      process.env.NEXT_PUBLIC_ROOT_DOMAIN?.includes("localhost")
        ? "http"
        : "https"
    }://app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
  );
}
