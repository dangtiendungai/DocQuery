import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimiters, getUserIdentifier } from "@/lib/rateLimit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - allow 5 submissions per hour per IP
    const identifier = getUserIdentifier(request);
    const rateLimitResult = await rateLimiters.contact(request, identifier);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: rateLimitResult.message || "Rate limit exceeded. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimitResult.retryAfter?.toString() || "3600",
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, email, company, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Create Supabase client (no auth required for contact form)
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Insert contact submission into database
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name: name.trim(),
          email: email.trim(),
          company: company?.trim() || null,
          message: message.trim(),
          ip_address: identifier, // Store IP for rate limiting tracking
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting contact submission:", error);
      return NextResponse.json(
        { error: "Failed to submit your message. Please try again later." },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
        id: data.id,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Remaining": (
            rateLimitResult.remaining || 0
          ).toString(),
        },
      }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}

