"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSavedEvents } from "./use-saved-events";

type PlaceResult = { label:string; detail:string; lat:number; lon:number };

function formatPlace(properties: Record<string,string> = {}) {
  const label = properties.name || properties.street || properties.city || properties.county || "Place";
  const parts = [properties.street !== label ? properties.street : "", properties.district, properties.city !== label ? properties.city : "", properties.county !== label ? properties.county : "", properties.postcode].filter(Boolean);
  return { label, detail:[...new Set(parts)].join(", ") };
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState<{lat:number;lon:number}|null>(null);
  const [locating, setLocating] = useState(false);
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [placesOpen, setPlacesOpen] = useState(false);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [activeOption, setActiveOption] = useState(-1);
  const { saved } = useSavedEvents();

  useEffect(() => {
    if (location.trim().length < 3 || coords) { setPlaces([]); setPlacesOpen(false); return; }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setPlacesLoading(true);
      try {
        const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(location)}&limit=6&lang=en&countrycode=GB`, {signal:controller.signal});
        const data = await response.json();
        setPlaces((data.features || []).map((feature: {properties:Record<string,string>;geometry:{coordinates:[number,number]}}) => ({...formatPlace(feature.properties), lon:feature.geometry.coordinates[0], lat:feature.geometry.coordinates[1]})));
        setPlacesOpen(true);
        setActiveOption(-1);
      } catch (error) { if ((error as Error).name !== "AbortError") setPlaces([]); }
      finally { setPlacesLoading(false); }
    }, 350);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [location, coords]);

  function selectPlace(place: PlaceResult) {
    setLocation([place.label, place.detail].filter(Boolean).join(", "));
    setCoords({ lat: place.lat, lon: place.lon });
    setPlacesOpen(false);
    setActiveOption(-1);
  }

  function onLocationKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!placesOpen || places.length === 0) return;
    if (event.key === "ArrowDown") { event.preventDefault(); setActiveOption((current) => (current + 1) % places.length); }
    else if (event.key === "ArrowUp") { event.preventDefault(); setActiveOption((current) => (current - 1 + places.length) % places.length); }
    else if (event.key === "Enter" && activeOption >= 0) { event.preventDefault(); selectPlace(places[activeOption]); }
    else if (event.key === "Escape") { setPlacesOpen(false); setActiveOption(-1); }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) { setLocation(""); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({coords: position}) => {
        setCoords({lat:position.latitude,lon:position.longitude}); setPlacesOpen(false);
        try { const response=await fetch(`https://photon.komoot.io/reverse?lat=${position.latitude}&lon=${position.longitude}&lang=en`); const data=await response.json(); const display=formatPlace(data.features?.[0]?.properties); setLocation([display.label,display.detail].filter(Boolean).join(", ")); }
        catch { setLocation("Current location"); }
        setLocating(false);
      },
      () => { setLocation(""); setLocating(false); },
      { enableHighAccuracy:false, timeout:8000, maximumAge:300000 }
    );
  }
  return (
    <div className="header-stack">
      <div className="utility-bar"><div className="utility-promise"><span>Secure checkout</span><span>Mobile-ready tickets</span><span>Official face-value resale</span></div><nav aria-label="Utility navigation"><a href="/events">What’s on</a><a href="/my-tickets">My tickets</a><a href="/help">Help centre</a><a className="utility-sell" href="/organisers">List your event <b>↗</b></a></nav></div>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Crowdloop home"><img src="/crowdloop-logo.png" alt="Crowdloop" /></a>
        <form className="market-search" action="/events" role="search">
          <label><span aria-hidden="true" className="market-search-icon"/><small>Search</small><input name="q" type="search" placeholder="Artist, event or venue" aria-label="Search by artist, event or venue" /></label>
          <div className="location-field">
            <span>
              <small>Location</small>
              <input
                value={location}
                onChange={(event) => { setLocation(event.target.value); setCoords(null); }}
                onFocus={() => places.length > 0 && setPlacesOpen(true)}
                onKeyDown={onLocationKeyDown}
                name="location"
                placeholder="Venue, postcode or place"
                autoComplete="off"
                role="combobox"
                aria-expanded={placesOpen}
                aria-controls="place-results"
                aria-autocomplete="list"
                aria-activedescendant={activeOption >= 0 ? `place-option-${activeOption}` : undefined}
                aria-label="Search for a venue, postcode or place"
              />
            </span>
            <button type="button" onClick={useCurrentLocation} disabled={locating} aria-label="Use my current location">{locating ? "…" : "⌖"}</button>
            {coords && <><input type="hidden" name="lat" value={coords.lat} /><input type="hidden" name="lon" value={coords.lon} /></>}
            {(placesOpen || placesLoading) && (
              <div className="place-results" id="place-results" role="listbox">
                {placesLoading && <p>Finding places…</p>}
                {!placesLoading && places.length === 0 && <p>No places found. Try a different search.</p>}
                {!placesLoading && places.map((place, index) => (
                  <button type="button" role="option" id={`place-option-${index}`} aria-selected={activeOption === index} key={`${place.lat}-${place.lon}`} className={activeOption === index ? "active" : ""} onClick={() => selectPlace(place)}>
                    <strong>{place.label}</strong><span>{place.detail}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button type="submit">Find events</button>
        </form>
        <div className="header-actions">
          <a className="header-saved" href="/saved" aria-label={`Saved events${saved.length ? ` (${saved.length})` : ""}`}>♡{saved.length > 0 && <span className="saved-count">{saved.length}</span>}</a>
          <a className="header-ticket-link" href="/my-tickets"><small>Your orders</small><strong>My tickets</strong></a>
          <a className="account-link" href="/account" aria-label="Account"><span aria-hidden="true">C</span><strong>Account</strong></a>
        </div>
        <button className="mobile-nav-trigger" aria-controls="mobile-nav" aria-expanded={open} onClick={() => setOpen(!open)}><span/><span/><span/></button>
      </header>
      <nav id="mobile-nav" className={open ? "category-nav open" : "category-nav"} aria-label="Event categories">
        <a href="/events" onClick={() => setOpen(false)}>All events</a><a href="/events?q=Music" onClick={() => setOpen(false)}>Music</a><a href="/events?q=Sport" onClick={() => setOpen(false)}>Sport</a><a href="/events?q=Theatre" onClick={() => setOpen(false)}>Theatre & comedy</a><a href="/events?q=Family" onClick={() => setOpen(false)}>Family</a><a href="/events?q=Festival" onClick={() => setOpen(false)}>Festivals</a><a href="/venues" onClick={() => setOpen(false)}>Cities & venues</a><a className="organiser-nav-link" href="/organisers" onClick={() => setOpen(false)}>For organisers ↗</a>
      </nav>
    </div>
  );
}

const footerGroups = [
  { title: "Discover", links: [["All events", "/events"], ["Saved events", "/saved"], ["Venues", "/venues"], ["My tickets", "/my-tickets"], ["Gift an experience", "/saved"]] },
  { title: "Organisers", links: [["Sell tickets", "/organisers"], ["Platform features", "/organisers#features"], ["Pricing", "/organisers#pricing"], ["Event operations", "/organisers#operations"], ["Get started", "/contact"]] },
  { title: "Crowdloop", links: [["About us", "/about"], ["Your account", "/account"], ["Our values", "/about#values"], ["Careers", "/about#careers"], ["Contact", "/contact"], ["Help centre", "/help"]] },
  { title: "Legal & trust", links: [["Terms", "/terms"], ["Privacy", "/privacy"], ["Refund policy", "/refunds"], ["Accessibility", "/accessibility"], ["Cookie settings", "/privacy#cookies"]] },
];

export function SiteFooter() {
  const [newsletterState, setNewsletterState] = useState<"idle" | "success" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  function submitNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterState("error");
      setNewsletterMessage("Enter a valid email address.");
      return;
    }
    setNewsletterState("success");
    setNewsletterMessage("You’re subscribed. Watch your inbox for event recommendations.");
    event.currentTarget.reset();
  }

  return (
    <footer className="platform-footer">
      <section className="footer-cta">
        <div><p>For event organisers</p><h2>Put everything behind<br />your event in one place.</h2></div>
        <div><p>Ticketing, planning and live operations—connected from first announcement to final report.</p><a href="/organisers">Explore the platform <span>↗</span></a></div>
      </section>
      <div className="footer-main">
        <div className="footer-brand">
          <img src="/crowdloop-logo.png" alt="Crowdloop" />
          <p>Good events start here. Discover what’s on, secure your place and keep every ticket close.</p>
          <form className="footer-newsletter" onSubmit={submitNewsletter}>
            <strong>Get the good stuff first.</strong>
            <label><input type="email" name="email" placeholder="Email address" aria-label="Email address" required /><button type="submit" aria-label="Subscribe">Join <span>→</span></button></label>
            {newsletterState !== "idle" && <p className={newsletterState === "success" ? "newsletter-message success" : "newsletter-message"} role="status">{newsletterMessage}</p>}
            <small>Occasional event recommendations. No noise.</small>
          </form>
        </div>
        <div className="footer-links">{footerGroups.map((group) => <div key={group.title}><h3>{group.title}</h3>{group.links.map(([label, href]) => <a href={href} key={label}>{label}</a>)}</div>)}</div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Crowdloop Technologies Ltd</span>
        <div><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/accessibility">Accessibility</a></div>
        <p className="socials-note">Official social profiles coming soon</p>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
