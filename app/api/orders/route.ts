import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "../../../lib/auth";
import { createOrder } from "../../../lib/data";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Sign in to complete checkout." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { eventSlug, tierName, unitPrice, quantity, fee, discount, firstName, lastName, email } = body;
  if (
    typeof eventSlug !== "string" ||
    typeof tierName !== "string" ||
    typeof unitPrice !== "number" ||
    typeof quantity !== "number" ||
    quantity < 1 ||
    quantity > 4 ||
    typeof fee !== "number" ||
    typeof discount !== "number" ||
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof email !== "string"
  ) {
    return NextResponse.json({ error: "Invalid order details." }, { status: 400 });
  }

  try {
    const result = await createOrder({
      userId: session.user.id,
      email,
      firstName,
      lastName,
      eventSlug,
      tierName,
      unitPrice,
      quantity,
      fee,
      discount,
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "We couldn't complete that order. Try again." }, { status: 500 });
  }
}
