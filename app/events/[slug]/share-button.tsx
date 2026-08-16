"use client";

import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [state, setState] = useState<"idle" | "shared" | "copied" | "error">("idle");

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        setState("shared");
      } catch {
        // user cancelled the share sheet, no feedback needed
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
      window.setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("error");
      window.setTimeout(() => setState("idle"), 2500);
    }
  }

  return <button type="button" className="event-action-link" onClick={share} aria-live="polite">
    {state === "copied" ? "Link copied" : state === "error" ? "Couldn’t copy link" : "Share event"}
  </button>;
}
