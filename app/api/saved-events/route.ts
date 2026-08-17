import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "../../../lib/auth";
import { getSavedEventSlugs, setSavedEvent } from "../../../lib/data";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ slugs: [] });
  const slugs = await getSavedEventSlugs(session.user.id);
  return NextResponse.json({ slugs });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Sign in to save events." }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body.slug !== "string" || typeof body.saved !== "boolean") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    await setSavedEvent(session.user.id, body.slug, body.saved);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }
}
