import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-10-29.clover",
});

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan || "unknown";

        console.log("Processing checkout.session.completed:", {
          sessionId: session.id,
          userId,
          plan,
          subscriptionId: session.subscription,
        });

        if (!userId) {
          console.error("No userId in session metadata");
          break;
        }

        if (!session.subscription) {
          console.error("No subscription ID in session");
          break;
        }

        try {
          // Get subscription details
          const subscriptionId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;

          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
          );

          console.log("Retrieved subscription:", {
            id: subscription.id,
            status: subscription.status,
            customer: subscription.customer,
          });

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

          // Upsert subscription record
          const subscriptionData = {
            user_id: userId,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscriptionId,
            stripe_price_id: subscription.items.data[0]?.price.id,
            plan: plan,
            status: subscription.status,
            current_period_start: currentPeriodStart,
            current_period_end: currentPeriodEnd,
            cancel_at_period_end:
              (subscription as any).cancel_at_period_end || false,
            updated_at: new Date().toISOString(),
          };

          console.log("Upserting subscription data:", subscriptionData);

          const { data, error } = await supabase
            .from("subscriptions")
            .upsert(subscriptionData, {
              onConflict: "user_id",
            })
            .select();

          if (error) {
            console.error("Error upserting subscription:", error);
          } else {
            console.log("Successfully saved subscription:", data);
          }
        } catch (err) {
          console.error("Error processing subscription:", err);
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by customer ID
        const { data: subscriptionData } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (subscriptionData) {
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

          const { error } = await supabase
            .from("subscriptions")
            .update({
              status: subscription.status,
              current_period_start: currentPeriodStart,
              current_period_end: currentPeriodEnd,
              cancel_at_period_end:
                (subscription as any).cancel_at_period_end || false,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", subscriptionData.user_id);

          if (error) {
            console.error("Error updating subscription:", error);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
