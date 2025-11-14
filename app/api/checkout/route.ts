import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-10-29.clover",
});

// Price IDs from Stripe Dashboard (these should be set in environment variables)
const PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_ID_STARTER || "",
  growth: process.env.STRIPE_PRICE_ID_GROWTH || "",
};

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // Create an authenticated Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId, plan } = await request.json();

    if (!priceId && !plan) {
      return NextResponse.json(
        { error: "priceId or plan is required" },
        { status: 400 }
      );
    }

    // Determine price ID
    let selectedPriceId = priceId;
    if (!selectedPriceId && plan) {
      selectedPriceId = PRICE_IDS[plan as keyof typeof PRICE_IDS];
    }

    if (!selectedPriceId) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    // Get user email
    const userEmail = user.email || "";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      payment_method_types: ["card"],
      line_items: [
        {
          price: selectedPriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${request.nextUrl.origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        userEmail: userEmail,
        plan: plan || "unknown",
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create checkout session",
      },
      { status: 500 }
    );
  }
}

