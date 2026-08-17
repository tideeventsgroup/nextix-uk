import "server-only";
import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import * as schema from "../db/schema";
import type { EventRecord } from "../app/events-data";

function toEventRecord(row: typeof schema.event.$inferSelect, venue: typeof schema.venue.$inferSelect, organiserName: string | null): EventRecord {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    detailCategory: row.detailCategory,
    day: row.day,
    dateNum: row.dateNum,
    month: row.month,
    dateLabel: row.dateLabel,
    time: row.eventTime,
    isoStart: row.isoStart.toISOString(),
    isoEnd: row.isoEnd.toISOString(),
    venue: venue.name,
    city: venue.city,
    address: venue.address,
    price: Number(row.price),
    status: row.status,
    image: row.image,
    intro: row.intro,
    schedule: row.schedule,
    organiser: organiserName ?? "Crowdloop",
    runningTime: row.runningTime ?? "",
    ageGuidance: row.ageGuidance ?? ["All ages welcome", ""],
    generalAvailability: row.generalAvailability ?? row.status,
  };
}

export async function getEvents(): Promise<EventRecord[]> {
  const db = getDb();
  const rows = await db
    .select({ event: schema.event, venue: schema.venue, organiserName: schema.organiser.name })
    .from(schema.event)
    .innerJoin(schema.venue, eq(schema.event.venueId, schema.venue.id))
    .leftJoin(schema.organiser, eq(schema.event.organiserId, schema.organiser.id))
    .orderBy(schema.event.isoStart);
  return rows.map((row) => toEventRecord(row.event, row.venue, row.organiserName));
}

export async function getEvent(slug: string): Promise<EventRecord | undefined> {
  const db = getDb();
  const rows = await db
    .select({ event: schema.event, venue: schema.venue, organiserName: schema.organiser.name })
    .from(schema.event)
    .innerJoin(schema.venue, eq(schema.event.venueId, schema.venue.id))
    .leftJoin(schema.organiser, eq(schema.event.organiserId, schema.organiser.id))
    .where(eq(schema.event.slug, slug))
    .limit(1);
  const row = rows[0];
  return row ? toEventRecord(row.event, row.venue, row.organiserName) : undefined;
}

export async function getEventIdBySlug(slug: string): Promise<string | undefined> {
  const db = getDb();
  const rows = await db.select({ id: schema.event.id }).from(schema.event).where(eq(schema.event.slug, slug)).limit(1);
  return rows[0]?.id;
}

export async function getRelatedEvents(slug: string, category: string, limit = 3): Promise<EventRecord[]> {
  const all = await getEvents();
  return all.filter((event) => event.slug !== slug && event.category === category).slice(0, limit);
}

export async function getTicketTiers(slug: string) {
  const db = getDb();
  const rows = await db
    .select({ tier: schema.ticketTier })
    .from(schema.ticketTier)
    .innerJoin(schema.event, eq(schema.ticketTier.eventId, schema.event.id))
    .where(eq(schema.event.slug, slug))
    .orderBy(schema.ticketTier.sortOrder);
  return rows.map((row) => ({ id: row.tier.id, name: row.tier.name, price: Number(row.tier.price), description: row.tier.description ?? "" }));
}

export type VenueRecord = {
  slug: string;
  name: string;
  city: string;
  address: string;
  accessibility: string;
  travel: string;
  image: string;
  upcomingCount: number;
};

export async function getVenues(): Promise<VenueRecord[]> {
  const db = getDb();
  const venues = await db.select().from(schema.venue).orderBy(schema.venue.name);
  const events = await db.select({ venueId: schema.event.venueId }).from(schema.event);
  const counts = new Map<string, number>();
  for (const { venueId } of events) counts.set(venueId, (counts.get(venueId) ?? 0) + 1);
  return venues.map((v) => ({
    slug: v.slug,
    name: v.name,
    city: v.city,
    address: v.address,
    accessibility: v.accessibility ?? "",
    travel: v.travel ?? "",
    image: v.image ?? "",
    upcomingCount: counts.get(v.id) ?? 0,
  }));
}

type CreateOrderInput = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  eventSlug: string;
  tierName: string;
  unitPrice: number;
  quantity: number;
  fee: number;
  discount: number;
};

export async function createOrder(input: CreateOrderInput) {
  const db = getDb();
  const eventId = await getEventIdBySlug(input.eventSlug);
  if (!eventId) throw new Error("Event not found");

  const subtotal = input.unitPrice * input.quantity;
  const total = Math.max(0, subtotal + input.fee - input.discount);
  const reference = `CL-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  const [createdOrder] = await db.insert(schema.order).values({
    reference,
    userId: input.userId,
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    subtotal: String(subtotal),
    fee: String(input.fee),
    discount: String(input.discount),
    total: String(total),
  }).returning();

  const ticketRows = Array.from({ length: input.quantity }, () => ({
    orderId: createdOrder.id,
    eventId,
    tierName: input.tierName,
    unitPrice: String(input.unitPrice),
  }));
  await db.insert(schema.ticket).values(ticketRows);

  return { reference, total };
}

export type WalletTicket = {
  ref: string;
  slug: string;
  title: string;
  date: string;
  place: string;
  type: string;
  price: number;
  status: string;
  image: string;
  isUpcoming: boolean;
};

export async function getTicketsForUser(userId: string): Promise<WalletTicket[]> {
  const db = getDb();
  const rows = await db
    .select({ ticket: schema.ticket, order: schema.order, event: schema.event, venue: schema.venue })
    .from(schema.ticket)
    .innerJoin(schema.order, eq(schema.ticket.orderId, schema.order.id))
    .innerJoin(schema.event, eq(schema.ticket.eventId, schema.event.id))
    .innerJoin(schema.venue, eq(schema.event.venueId, schema.venue.id))
    .where(eq(schema.order.userId, userId))
    .orderBy(schema.event.isoStart);

  const now = Date.now();
  return rows.map((row) => ({
    ref: row.order.reference,
    slug: row.event.slug,
    title: row.event.title,
    date: row.event.dateLabel,
    place: `${row.venue.name}, ${row.venue.city}`,
    type: row.ticket.tierName,
    price: Number(row.ticket.unitPrice),
    status: row.ticket.status,
    image: row.event.image,
    isUpcoming: row.event.isoStart.getTime() >= now,
  }));
}

export async function getSavedEventSlugs(userId: string): Promise<string[]> {
  const db = getDb();
  const rows = await db
    .select({ slug: schema.event.slug })
    .from(schema.savedEvent)
    .innerJoin(schema.event, eq(schema.savedEvent.eventId, schema.event.id))
    .where(eq(schema.savedEvent.userId, userId));
  return rows.map((row) => row.slug);
}

export async function setSavedEvent(userId: string, eventSlug: string, saved: boolean) {
  const db = getDb();
  const eventId = await getEventIdBySlug(eventSlug);
  if (!eventId) throw new Error("Event not found");
  if (saved) {
    await db.insert(schema.savedEvent).values({ userId, eventId }).onConflictDoNothing();
  } else {
    await db.delete(schema.savedEvent).where(and(eq(schema.savedEvent.userId, userId), eq(schema.savedEvent.eventId, eventId)));
  }
}
