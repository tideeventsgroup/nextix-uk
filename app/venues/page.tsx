"use client";
import { useMemo, useState } from "react";
import { events } from "../events-data";
import { useLocalList } from "../use-local-list";

const venues = [
  { name: "The Harbour Grounds", city: "Ayr", address: "Harbour Street, Ayr, KA7 1JA", accessibility: "Step-free access, accessible toilets, companion tickets available.", travel: "10-minute walk from Ayr railway station. Limited on-site parking.", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1000&q=85" },
  { name: "Kelvingrove Park", city: "Glasgow", address: "Sauchiehall Street entrance, Glasgow, G3 7RZ", accessibility: "Level paths throughout, accessible toilets near the main entrance.", travel: "Kelvinbridge subway station is a 5-minute walk. Several bus routes stop nearby.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=85" },
  { name: "Civic Theatre", city: "Edinburgh", address: "13 Lothian Road, Edinburgh, EH1 2EP", accessibility: "Step-free entry, wheelchair spaces in the stalls, hearing loop fitted.", travel: "5-minute walk from Edinburgh Waverley. Multiple bus routes stop outside.", image: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1000&q=85" },
  { name: "Discovery Centre", city: "Dundee", address: "Discovery Quay, Dundee, DD1 4XA", accessibility: "Fully step-free, accessible toilets and quiet room available on request.", travel: "10-minute walk from Dundee railway station, on-site parking available.", image: "https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&w=1000&q=85" },
  { name: "Riverside Park", city: "Stirling", address: "Kings Park Road, Stirling, FK8 2QJ", accessibility: "Mostly level paths, accessible toilets in the event village.", travel: "20-minute walk from Stirling railway station. Park and ride available on event days.", image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1000&q=85" },
  { name: "The Assembly Rooms", city: "Aberdeen", address: "34 Union Street, Aberdeen, AB11 5BN", accessibility: "Step-free entry, accessible toilets, companion tickets available.", travel: "Short walk from Aberdeen bus and railway stations. Nearby multi-storey parking.", image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1000&q=85" },
];

export default function Venues() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All locations");
  const { toggle, has } = useLocalList("crowdloop-followed-venues");
  const cities = useMemo(() => ["All locations", ...Array.from(new Set(venues.map((v) => v.city))).sort()], []);

  const upcomingCountByVenue = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const event of events) counts[event.venue] = (counts[event.venue] || 0) + 1;
    return counts;
  }, []);

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
            const count = upcomingCountByVenue[v.name] || 0;
            const followed = has(v.name);
            return (
              <article key={v.name}>
                <img src={v.image} alt="" />
                <div>
                  <p>{v.city}</p>
                  <h2>{v.name}</h2>
                  <span>{count > 0 ? `${count} upcoming event${count === 1 ? "" : "s"}` : "No events currently listed"}</span>
                  <dl className="venue-facts">
                    <div><dt>Address</dt><dd>{v.address}</dd></div>
                    <div><dt>Accessibility</dt><dd>{v.accessibility}</dd></div>
                    <div><dt>Getting there</dt><dd>{v.travel}</dd></div>
                  </dl>
                  <div className="venue-card-actions">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.address)}`} target="_blank" rel="noreferrer">View on map ↗</a>
                    <button className={followed ? "following" : ""} onClick={() => toggle(v.name)} aria-pressed={followed}>{followed ? "Following ✓" : "Follow venue +"}</button>
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
