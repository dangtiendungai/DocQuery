import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type");

  if (code) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.session) {
      // Check if this is an email verification
      if (type === "signup" || type === "email") {
        // Redirect to verify-email page to show success message
        const email = data.user?.email || "";
        return NextResponse.redirect(
          new URL(`/verify-email?email=${encodeURIComponent(email)}`, requestUrl.origin)
        );
      }
      
      // For password reset or other flows, check if email is verified
      if (data.user?.email_confirmed_at) {
        const redirectTo =
          process.env.NEXT_PUBLIC_POST_LOGIN_REDIRECT || "/chats";
        return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
      } else {
        // Email not verified yet, redirect to verify-email page
        const email = data.user?.email || "";
        return NextResponse.redirect(
          new URL(`/verify-email?email=${encodeURIComponent(email)}`, requestUrl.origin)
        );
      }
    }
  }

  // If there's an error or no code, redirect to login
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
