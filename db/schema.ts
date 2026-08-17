import { boolean, jsonb, numeric, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Better Auth's core tables. Column shapes must match what Better Auth
// expects for its Drizzle Postgres adapter (see lib/auth.ts).
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Ticketing platform tables.
export const venue = pgTable("venue", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  accessibility: text("accessibility"),
  travel: text("travel"),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const organiser = pgTable("organiser", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const event = pgTable("event", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  detailCategory: text("detail_category").notNull(),
  venueId: uuid("venue_id").notNull().references(() => venue.id),
  organiserId: uuid("organiser_id").references(() => organiser.id),
  day: text("day").notNull(),
  dateNum: text("date_num").notNull(),
  month: text("month").notNull(),
  dateLabel: text("date_label").notNull(),
  eventTime: text("event_time").notNull(),
  isoStart: timestamp("iso_start", { withTimezone: true }).notNull(),
  isoEnd: timestamp("iso_end", { withTimezone: true }).notNull(),
  price: numeric("price").notNull(),
  status: text("status").notNull(),
  image: text("image").notNull(),
  intro: text("intro").notNull(),
  schedule: jsonb("schedule").$type<[string, string][]>().notNull().default([]),
  runningTime: text("running_time"),
  ageGuidance: jsonb("age_guidance").$type<[string, string]>(),
  generalAvailability: text("general_availability"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const ticketTier = pgTable("ticket_tier", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").notNull().references(() => event.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: numeric("price").notNull(),
  description: text("description"),
  sortOrder: numeric("sort_order").notNull().default("0"),
});

export const order = pgTable("order", {
  id: uuid("id").primaryKey().defaultRandom(),
  reference: text("reference").notNull().unique(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  subtotal: numeric("subtotal").notNull(),
  fee: numeric("fee").notNull(),
  discount: numeric("discount").notNull().default("0"),
  total: numeric("total").notNull(),
  status: text("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const ticket = pgTable("ticket", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => order.id, { onDelete: "cascade" }),
  eventId: uuid("event_id").notNull().references(() => event.id),
  tierName: text("tier_name").notNull(),
  unitPrice: numeric("unit_price").notNull(),
  status: text("status").notNull().default("valid"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const savedEvent = pgTable("saved_event", {
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  eventId: uuid("event_id").notNull().references(() => event.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [primaryKey({ columns: [table.userId, table.eventId] })]);
