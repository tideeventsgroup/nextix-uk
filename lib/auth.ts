import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { dash } from "@better-auth/infra";
import { getDb } from "../db";
import * as schema from "../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(getDb(), {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  // Vercel serves both a stable domain and a unique URL per deployment;
  // trust any *.vercel.app origin in addition to the canonical one so
  // requests aren't rejected regardless of which valid URL served the page.
  trustedOrigins: ["https://*.vercel.app", process.env.BETTER_AUTH_URL].filter(
    (origin): origin is string => Boolean(origin)
  ),
  plugins: [dash()],
});
