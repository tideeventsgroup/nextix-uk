"use client";

import { useSavedEvents } from "../../use-saved-events";

export function SaveEventButton({ slug, title }: { slug: string; title: string }) {
  const { isSaved, toggle } = useSavedEvents();
  const saved = isSaved(slug);
  return <button type="button" className={saved ? "event-action-link saved" : "event-action-link"} onClick={() => toggle(slug)} aria-pressed={saved} aria-label={`${saved ? "Remove" : "Save"} ${title} ${saved ? "from" : "to"} saved events`}>
    {saved ? "♥ Saved" : "♡ Save event"}
  </button>;
}
