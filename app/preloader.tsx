"use client";

import { useEffect, useState } from "react";

// A short, self-contained branded intro. Deliberately not gated on
// window.load: a single slow or blocked third-party resource (e.g. an
// external hero image) would otherwise leave it stuck on screen forever.
const DISPLAY_MS = 650;
const FADE_MS = 400;

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const displayTime = reduceMotion ? 0 : DISPLAY_MS;
    const fadeTime = reduceMotion ? 0 : FADE_MS;

    const showTimer = window.setTimeout(() => setFading(true), displayTime);
    const hideTimer = window.setTimeout(() => setVisible(false), displayTime + fadeTime);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={fading ? "preloader fading" : "preloader"} role="status" aria-live="polite">
      <img src="/crowdloop-logo.png" alt="" />
      <span className="preloader-bar"><span /></span>
      <span className="sr-only">Loading Crowdloop…</span>
    </div>
  );
}
