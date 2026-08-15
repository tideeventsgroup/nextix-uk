"use client";

import { useMemo, useState } from "react";

const categories = ["All events", "Music", "Food & drink", "Theatre", "Family", "Sport"];

const events = [
  {
    id: 1,
    title: "North Coast Sessions",
    category: "Music",
    date: "SAT 12 SEP",
    time: "12:00–23:00",
    place: "The Harbour Grounds, Ayr",
    price: "From £32",
    badge: "Selling fast",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=88",
  },
  {
    id: 2,
    title: "Field & Flame Festival",
    category: "Food & drink",
    date: "SUN 20 SEP",
    time: "11:00–20:00",
    place: "Kelvingrove Park, Glasgow",
    price: "From £18",
    badge: "New",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=88",
  },
  {
    id: 3,
    title: "A Midsummer Night’s Dream",
    category: "Theatre",
    date: "24–27 SEP",
    time: "19:30",
    place: "Civic Theatre, Edinburgh",
    price: "From £24",
    badge: "Limited seats",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=88",
  },
  {
    id: 4,
    title: "Little Explorers Live",
    category: "Family",
    date: "SAT 3 OCT",
    time: "10:30–16:00",
    place: "Discovery Centre, Dundee",
    price: "From £12",
    badge: "Family favourite",
    image: "https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&w=1200&q=88",
  },
  {
    id: 5,
    title: "City 10K & Festival",
    category: "Sport",
    date: "SUN 11 OCT",
    time: "08:30",
    place: "Riverside Park, Stirling",
    price: "From £20",
    badge: "Entries open",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=88",
  },
  {
    id: 6,
    title: "Afterlight Orchestra",
    category: "Music",
    date: "FRI 23 OCT",
    time: "19:00",
    place: "The Assembly Rooms, Aberdeen",
    price: "From £28",
    badge: "Just announced",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=88",
  },
];

function SearchIcon() {
  return <span aria-hidden="true" className="search-icon" />;
}

export default function Home() {
  const [category, setCategory] = useState("All events");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(typeof events)[number] | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleEvents = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return events.filter((event) => {
      const matchesCategory = category === "All events" || event.category === category;
      const matchesQuery = !needle || `${event.title} ${event.place} ${event.category}`.toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Alyvra home">
          <img src="/alyvra-logo.png" alt="Alyvra" />
        </a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Primary navigation">
          <a href="#events" onClick={() => setMenuOpen(false)}>Find events</a>
          <a href="#organisers" onClick={() => setMenuOpen(false)}>For organisers</a>
          <a href="#help" onClick={() => setMenuOpen(false)}>Help</a>
        </nav>
        <div className="header-actions">
          <button className="text-button">Sign in</button>
          <button className="primary-button">List your event</button>
        </div>
        <button className="menu-button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span />
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Events worth showing up for</p>
          <h1>Find your next<br /><em>great day out.</em></h1>
          <p className="hero-intro">Discover live music, local festivals, theatre and unforgettable experiences near you.</p>
          <label className="hero-search">
            <SearchIcon />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events, artists or places" aria-label="Search events" />
            <button onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}>Search</button>
          </label>
          <div className="trust-row">
            <div className="faces" aria-hidden="true"><span>JM</span><span>AR</span><span>SK</span></div>
            <p><strong>4.9 out of 5</strong><br />from verified ticket buyers</p>
          </div>
        </div>
        <div className="hero-visual" aria-label="Featured event: North Coast Sessions">
          <img src={events[0].image} alt="Crowd enjoying a live outdoor concert" />
          <div className="feature-card">
            <p>Featured this week</p>
            <h2>North Coast<br />Sessions</h2>
            <div><span>12 SEP · AYR</span><strong>From £32</strong></div>
          </div>
          <div className="ticket-stamp">ALYVRA<br /><small>LIVE</small></div>
        </div>
      </section>

      <section className="events-section" id="events">
        <div className="section-heading">
          <div><p className="eyebrow">Made for your calendar</p><h2>What’s on</h2></div>
          <a href="#events">View all events <span>↗</span></a>
        </div>
        <div className="category-row" role="group" aria-label="Filter events by category">
          {categories.map((item) => (
            <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
        {visibleEvents.length ? (
          <div className="event-grid">
            {visibleEvents.map((event) => (
              <article className="event-card" key={event.id}>
                <button className="event-image" onClick={() => setSelected(event)} aria-label={`View tickets for ${event.title}`}>
                  <img src={event.image} alt="" />
                  <span className="badge">{event.badge}</span>
                  <span className="save" aria-hidden="true">♡</span>
                </button>
                <div className="event-info">
                  <p className="event-date">{event.date} · {event.time}</p>
                  <h3>{event.title}</h3>
                  <p className="location">{event.place}</p>
                  <div><strong>{event.price}</strong><button onClick={() => setSelected(event)}>Get tickets</button></div>
                </div>
              </article>
            ))}
          </div>
        ) : <div className="empty-state"><h3>No events found</h3><p>Try another search or category.</p></div>}
      </section>

      <section className="organiser-strip" id="organisers">
        <div><p className="eyebrow">Built for brilliant events</p><h2>Your event.<br />Beautifully handled.</h2></div>
        <div className="organiser-copy"><p>Sell tickets, know your audience and run your event with confidence—all from one thoughtful platform.</p><button className="light-button">Explore Alyvra for organisers <span>→</span></button></div>
        <div className="metric"><strong>2.4m</strong><span>tickets delivered</span></div>
      </section>

      <footer id="help">
        <img src="/alyvra-logo.png" alt="Alyvra" />
        <p>Good events start here.</p>
        <div><a href="#events">Discover</a><a href="#organisers">Organisers</a><a href="#help">Support</a><a href="#help">Privacy</a></div>
        <small>© 2026 Alyvra Technologies Ltd</small>
      </footer>

      {selected && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}>
          <section className="ticket-panel" role="dialog" aria-modal="true" aria-labelledby="ticket-title" onMouseDown={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setSelected(null)} aria-label="Close">×</button>
            <p className="eyebrow">Choose your tickets</p>
            <h2 id="ticket-title">{selected.title}</h2>
            <p>{selected.date} · {selected.time}<br />{selected.place}</p>
            <div className="ticket-option"><div><strong>General admission</strong><span>Mobile ticket · Instant delivery</span></div><b>{selected.price.replace("From ", "")}</b></div>
            <label>Quantity<select defaultValue="1" aria-label="Ticket quantity"><option>1</option><option>2</option><option>3</option><option>4</option></select></label>
            <button className="checkout-button">Continue to checkout <span>→</span></button>
            <small>Secure checkout · Clear pricing · Easy ticket access</small>
          </section>
        </div>
      )}
    </main>
  );
}
