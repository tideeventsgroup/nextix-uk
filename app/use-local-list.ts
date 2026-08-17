"use client";

import { useCallback, useSyncExternalStore } from "react";

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const emptySnapshot: string[] = [];

export function useLocalList(key: string) {
  const changeEvent = `crowdloop-local-list-change:${key}`;

  const subscribe = useCallback((onStoreChange: () => void) => {
    window.addEventListener(changeEvent, onStoreChange);
    window.addEventListener("storage", onStoreChange);
    return () => {
      window.removeEventListener(changeEvent, onStoreChange);
      window.removeEventListener("storage", onStoreChange);
    };
  }, [changeEvent]);

  const getSnapshot = useCallback(() => JSON.stringify(readList(key)), [key]);
  const getServerSnapshot = useCallback(() => "[]", []);

  const serialised = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items: string[] = serialised === "[]" ? emptySnapshot : JSON.parse(serialised);

  const toggle = useCallback((id: string) => {
    const current = readList(key);
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new Event(changeEvent));
  }, [key, changeEvent]);

  const remove = useCallback((id: string) => {
    const next = readList(key).filter((item) => item !== id);
    localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new Event(changeEvent));
  }, [key, changeEvent]);

  const has = useCallback((id: string) => items.includes(id), [items]);

  return { items, toggle, remove, has };
}
