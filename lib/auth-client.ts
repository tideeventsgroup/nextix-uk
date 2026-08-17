"use client";

import { createAuthClient } from "better-auth/react";

// No baseURL: the client should always call the auth API on whatever origin
// served the page (Vercel serves both a stable domain and unique
// per-deployment URLs — hardcoding one causes cross-origin requests that get
// blocked by CORS when the page loads from the other).
export const authClient = createAuthClient();

export const { useSession, signIn, signOut, signUp, requestPasswordReset, resetPassword } = authClient;
