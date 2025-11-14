import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-10-29.clover",
});

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

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    // Verify the session belongs to this user
    if (session.metadata?.userId !== user.id) {
      return NextResponse.json(
        { error: "Session does not belong to this user" },
        { status: 403 }
      );
    }

    // If subscription exists, retrieve and save it
    if (session.subscription) {
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      // Use service role key to upsert subscription
      const serviceSupabase = createClient(supabaseUrl, supabaseServiceKey);

      // Safely convert timestamps to ISO strings
      const currentPeriodStart =
        (subscription as any).current_period_start &&
        typeof (subscription as any).current_period_start === "number"
          ? new Date(
              (subscription as any).current_period_start * 1000
            ).toISOString()
          : null;

      const currentPeriodEnd =
        (subscription as any).current_period_end &&
        typeof (subscription as any).current_period_end === "number"
          ? new Date(
              (subscription as any).current_period_end * 1000
            ).toISOString()
          : null;

      const { data: subscriptionData, error: upsertError } =
        await serviceSupabase.from("subscriptions").upsert(
          {
            user_id: user.id,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscriptionId,
            stripe_price_id: subscription.items.data[0]?.price.id,
            plan: session.metadata?.plan || "unknown",
            status: subscription.status,
            current_period_start: currentPeriodStart,
            current_period_end: currentPeriodEnd,
            cancel_at_period_end:
              (subscription as any).cancel_at_period_end || false,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          }
        );

      if (upsertError) {
        console.error("Error upserting subscription:", upsertError);
        return NextResponse.json(
          { error: "Failed to save subscription" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        subscription: subscriptionData,
      });
    }

    return NextResponse.json({
      success: false,
      message: "No subscription found in session",
    });
  } catch (error) {
    console.error("Error verifying subscription:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
