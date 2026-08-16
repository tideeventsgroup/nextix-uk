"use client";

import { useLocalList } from "./use-local-list";

const KEY = "crowdloop-saved-events";

export function useSavedEvents() {
  const { items, toggle, remove, has } = useLocalList(KEY);
  return { saved: items, toggle, remove, isSaved: has };
}
