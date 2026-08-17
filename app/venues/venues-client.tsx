"use client";
import { useMemo, useState } from "react";
import type { VenueRecord } from "../../lib/data";
import { useLocalList } from "../use-local-list";

export function VenuesClient({ venues }: { venues: VenueRecord[] }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All locations");
  const { toggle, has } = useLocalList("crowdloop-followed-venues");
  const cities = useMemo(() => ["All locations", ...Array.from(new Set(venues.map((v) => v.city))).sort()], [venues]);

  const filtered = venues.filter((venue) =>
    (city === "All locations" || venue.city === city) &&
    `${venue.name} ${venue.city}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="inner-page venues-page" id="top">
      <section className="page-hero venue-hero">
        <p className="eyebrow">Places worth knowing</p>
        <h1>Great events<br />need great rooms.</h1>
        <p>Search venues by name or city, and follow the ones you love to hear what’s coming next.</p>
        <div className="venue-controls">
          <form className="directory-search" onSubmit={(event) => event.preventDefault()}>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search venues by name or city" aria-label="Search venues" />
            <button type="submit">Search</button>
          </form>
          <select value={city} onChange={(event) => setCity(event.target.value)} aria-label="Filter venues by city">
            {cities.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </section>
      {filtered.length > 0 ? (
        <section className="venue-grid">
          {filtered.map((v) => {
            const followed = has(v.slug);
            return (
              <article key={v.slug}>
                <img src={v.image} alt="" />
                <div>
                  <p>{v.city}</p>
                  <h2>{v.name}</h2>
                  <span>{v.upcomingCount > 0 ? `${v.upcomingCount} upcoming event${v.upcomingCount === 1 ? "" : "s"}` : "No events currently listed"}</span>
                  <dl className="venue-facts">
                    <div><dt>Address</dt><dd>{v.address}</dd></div>
                    <div><dt>Accessibility</dt><dd>{v.accessibility}</dd></div>
                    <div><dt>Getting there</dt><dd>{v.travel}</dd></div>
                  </dl>
                  <div className="venue-card-actions">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.address)}`} target="_blank" rel="noreferrer">View on map ↗</a>
                    <button className={followed ? "following" : ""} onClick={() => toggle(v.slug)} aria-pressed={followed}>{followed ? "Following ✓" : "Follow venue +"}</button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <div className="empty-state venues-empty">
          <h3>No venues found</h3>
          <p>Try a different search or clear the city filter.</p>
        </div>
      )}
    </main>
  );
}
