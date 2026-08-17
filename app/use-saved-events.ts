"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "../lib/auth-client";
import { useLocalList } from "./use-local-list";

const KEY = "crowdloop-saved-events";

// Signed-out visitors get localStorage-backed saved events (via useLocalList).
// Once signed in, saved events live in the database instead, so they follow
// the account across devices. Anything saved anonymously is migrated into
// the account the first time a session appears.
export function useSavedEvents() {
  const { data: session } = useSession();
  const local = useLocalList(KEY);
  const [dbSlugs, setDbSlugs] = useState<string[] | null>(null);
  const [migrated, setMigrated] = useState(false);

  useEffect(() => {
    if (!session) { setDbSlugs(null); setMigrated(false); return; }
    let cancelled = false;
    (async () => {
      if (!migrated) {
        const localSlugs = local.items;
        if (localSlugs.length > 0) {
          await Promise.all(localSlugs.map((slug) =>
            fetch("/api/saved-events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, saved: true }) }).catch(() => {})
          ));
          localStorage.removeItem(KEY);
        }
        setMigrated(true);
      }
      const response = await fetch("/api/saved-events");
      if (cancelled) return;
      const data = await response.json();
      setDbSlugs(Array.isArray(data.slugs) ? data.slugs : []);
    })();
    return () => { cancelled = true; };
    // local.items is only read once per sign-in, not on every keystroke of local state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, migrated]);

  const toggle = useCallback((slug: string) => {
    if (!session) { local.toggle(slug); return; }
    setDbSlugs((current) => {
      const list = current ?? [];
      const isSaved = list.includes(slug);
      fetch("/api/saved-events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, saved: !isSaved }) });
      return isSaved ? list.filter((item) => item !== slug) : [...list, slug];
    });
  }, [session, local]);

  const remove = useCallback((slug: string) => {
    if (!session) { local.remove(slug); return; }
    setDbSlugs((current) => (current ?? []).filter((item) => item !== slug));
    fetch("/api/saved-events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, saved: false }) });
  }, [session, local]);

  const saved = session ? (dbSlugs ?? []) : local.items;
  const isSaved = useCallback((slug: string) => saved.includes(slug), [saved]);

  return { saved, toggle, remove, isSaved };
}
