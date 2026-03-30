import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore - This prevents the red error line in VS Code
  apiVersion: '2026-03-25.dahlia',
});

export async function POST(req: Request) {
  try {
    const { entryId, email } = await req.json();

    // Create a Checkout Session with the Entry ID attached as metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'RSNS Masters Sweepstake Entry',
            },
            unit_amount: 1000, // €10.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      // Change these URLs if your domain changes
      success_url: `https://rsnsfundraiser.com/leaderboard`,
      cancel_url: `https://rsnsfundraiser.com/`,
      metadata: {
        entryId: entryId.toString(), // CRITICAL: This links the payment to the Supabase row
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}