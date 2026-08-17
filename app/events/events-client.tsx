"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { EventRecord } from "../events-data";
import { useSavedEvents } from "../use-saved-events";

const categories = ["All events", "Music", "Festivals", "Theatre", "Comedy", "Family", "Sport", "Food & drink"];
const cityCoordinates: Record<string, [number, number]> = { Ayr: [55.4586, -4.6292], Glasgow: [55.8642, -4.2518], Edinburgh: [55.9533, -3.1883], Dundee: [56.462, -2.9707], Stirling: [56.1165, -3.9369], Aberdeen: [57.1497, -2.0943] };
const priceBands = ["Under £20", "£20–£35"] as const;

export function EventsPageClient({ events }: { events: EventRecord[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All events");
  const [city, setCity] = useState("All locations");
  const [locationLabel, setLocationLabel] = useState("");
  const [month, setMonth] = useState("Any date");
  const [priceFilter, setPriceFilter] = useState<string[]>([]);
  const [sort, setSort] = useState("Recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { isSaved, toggle } = useSavedEvents();
  const filtersRef = useRef<HTMLElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const closeFiltersRef = useRef<HTMLButtonElement>(null);

  function closeFilters() {
    setFiltersOpen(false);
    filterTriggerRef.current?.focus();
  }

  useEffect(() => {
    if (!filtersOpen) return;
    closeFiltersRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { closeFilters(); return; }
      if (event.key !== "Tab" || !filtersRef.current) return;
      const focusable = filtersRef.current.querySelectorAll<HTMLElement>("button, [href], input, select, textarea");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [filtersOpen]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const incoming = params.get("q") || ""; const location = params.get("location") || "";
    const lat = Number(params.get("lat")); const lon = Number(params.get("lon"));
    setQuery(incoming); setLocationLabel(location);
    if (location && events.some((event) => event.city === location)) setCity(location);
    else if (Number.isFinite(lat) && Number.isFinite(lon) && params.has("lat") && params.has("lon")) {
      const nearest = Object.entries(cityCoordinates).sort(([, a], [, b]) => (a[0] - lat) ** 2 + (a[1] - lon) ** 2 - ((b[0] - lat) ** 2 + (b[1] - lon) ** 2))[0]?.[0];
      if (nearest) setCity(nearest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount to seed state from the initial URL
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (city !== "All locations") params.set("location", city);
    const next = params.toString();
    const url = next ? `/events?${next}` : "/events";
    window.history.replaceState(null, "", url);
  }, [query, city]);

  function inPriceBand(price: number, band: string) {
    if (band === "Under £20") return price < 20;
    if (band === "£20–£35") return price >= 20 && price <= 35;
    return true;
  }

  const filtered = useMemo(() => events.filter((event) =>
    (category === "All events" || event.category === category) &&
    (city === "All locations" || event.city === city) &&
    (month === "Any date" || event.month === month) &&
    (priceFilter.length === 0 || priceFilter.some((band) => inPriceBand(event.price, band))) &&
    (`${event.title} ${event.category} ${event.city} ${event.venue}`.toLowerCase().includes(query.toLowerCase()))
  ).sort((a, b) => sort === "Price: low to high" ? a.price - b.price : sort === "Soonest" ? Number(a.dateNum) - Number(b.dateNum) : 0), [events, query, category, city, month, priceFilter, sort]);

  const clearFilters = () => { setCategory("All events"); setCity("All locations"); setLocationLabel(""); setMonth("Any date"); setQuery(""); setPriceFilter([]); };
  const togglePriceBand = (band: string) => setPriceFilter((current) => current.includes(band) ? current.filter((item) => item !== band) : [...current, band]);
  const activeCount = [category !== "All events", city !== "All locations", month !== "Any date", Boolean(query), priceFilter.length > 0].filter(Boolean).length;

  return <main className="find-events-page" id="top">
    <section className="find-intro">
      <div><p className="eyebrow">Discover something brilliant</p><h1>Find events</h1><p>Browse live music, festivals, theatre, family days out and more—all in one place.</p></div>
      <form className="find-page-search" onSubmit={(event) => event.preventDefault()}><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events, artists or venues" aria-label="Search events, artists or venues" /><button type="button" onClick={() => setQuery("")} className={query ? "visible" : ""}>Clear</button></form>
      {locationLabel && <div className="location-context"><span>◎</span><div><small>Showing events nearest</small><strong>{locationLabel}</strong></div><button onClick={() => { setCity("All locations"); setLocationLabel(""); }}>Remove</button></div>}
    </section>

    <nav className="event-category-rail" aria-label="Event types">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</nav>

    <section className="events-workspace">
      <aside className={filtersOpen ? "event-filters open" : "event-filters"} ref={filtersRef} role={filtersOpen ? "dialog" : undefined} aria-modal={filtersOpen ? true : undefined} aria-label={filtersOpen ? "Filters" : undefined}>
        <div className="filter-heading"><div><small>REFINE RESULTS</small><h2>Filters</h2></div><button ref={closeFiltersRef} onClick={closeFilters} aria-label="Close filters">×</button></div>
        <fieldset><legend>When</legend>{["Any date", "SEP", "OCT"].map((item) => <label key={item}><input type="radio" name="date" checked={month === item} onChange={() => setMonth(item)} /><span>{item === "SEP" ? "September" : item === "OCT" ? "October" : item}</span></label>)}</fieldset>
        <fieldset><legend>Where</legend><select value={city} onChange={(event) => { setCity(event.target.value); setLocationLabel(""); }} aria-label="Filter by location"><option>All locations</option>{Object.keys(cityCoordinates).map((item) => <option key={item}>{item}</option>)}</select><p>For venues, postcodes or places, use the location search in the header.</p></fieldset>
        <fieldset><legend>Price</legend>{priceBands.map((band) => <label key={band}><input type="checkbox" checked={priceFilter.includes(band)} onChange={() => togglePriceBand(band)} /><span>{band}</span></label>)}</fieldset>
        {activeCount > 0 && <button className="clear-filters" onClick={clearFilters}>Clear all filters</button>}
      </aside>

      <div className="event-results">
        <div className="results-toolbar"><div><p>{filtered.length} {filtered.length === 1 ? "event" : "events"}</p><span>{city === "All locations" ? "Across Scotland" : `Near ${city}`}</span></div><div><button ref={filterTriggerRef} className="mobile-filter-button" onClick={() => setFiltersOpen(true)} aria-haspopup="dialog">Filters {activeCount > 0 && <b>{activeCount}</b>}</button><label>Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option>Recommended</option><option>Soonest</option><option>Price: low to high</option></select></label></div></div>
        <div className="event-list">{filtered.map((event) => <article className="result-card" key={event.slug}>
          <a className="result-image" href={`/events/${event.slug}`}><img src={event.image} alt="" /><span className={event.status === "Last few" || event.status === "Selling fast" ? "urgent" : ""}>{event.status}</span></a>
          <div className="result-date"><small>{event.month}</small><strong>{event.dateNum}</strong><span>{event.day}</span></div>
          <div className="result-copy"><p>{event.category}</p><h2><a href={`/events/${event.slug}`}>{event.title}</a></h2><span>{event.venue} · {event.city}</span><div><strong>From £{event.price}</strong><a href={`/events/${event.slug}`}>Tickets <span>→</span></a></div></div>
          <button className={isSaved(event.slug) ? "result-save saved" : "result-save"} onClick={() => toggle(event.slug)} aria-pressed={isSaved(event.slug)} aria-label={`${isSaved(event.slug) ? "Remove" : "Save"} ${event.title} ${isSaved(event.slug) ? "from" : "to"} saved events`}>{isSaved(event.slug) ? "♥" : "♡"}</button>
        </article>)}</div>
        {!filtered.length && <div className="no-results"><span>⌕</span><h2>No events found</h2><p>Try widening your location or clearing a filter.</p><button onClick={clearFilters}>Show all events</button></div>}
      </div>
    </section>
    {filtersOpen && <button className="filter-scrim" onClick={closeFilters} aria-label="Close filters" />}
  </main>;
}
