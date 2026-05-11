import express from "express";
import Stripe from "stripe";
import { markPurchaseFulfilled } from "./db";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export function registerStripeWebhook(app: express.Express) {
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.warn("[Webhook] Stripe is not configured");
      return res.status(503).json({ error: "Stripe webhook is not configured" });
    }

    const signature = req.headers["stripe-signature"];
    if (!signature || Array.isArray(signature)) {
      return res.status(400).json({ error: "Missing Stripe signature" });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      console.error("[Webhook] Signature verification failed", error);
      return res.status(400).json({ error: "Invalid webhook signature" });
    }

    if (event.id.startsWith("evt_test_")) {
      console.log("[Webhook] Test event detected, returning verification response");
      return res.json({ verified: true });
    }

    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        await markPurchaseFulfilled({
          stripeCheckoutSessionId: session.id,
          stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
          stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
          stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : null,
        });
      }

      console.log("[Webhook] Processed", event.type, event.id);
      return res.json({ received: true });
    } catch (error) {
      console.error("[Webhook] Processing failed", error);
      return res.status(500).json({ error: "Webhook processing failed" });
    }
  });
}
