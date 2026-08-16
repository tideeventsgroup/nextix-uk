"use client";

import { useEffect, useMemo, useState } from "react";

const categories = ["All events", "Music", "Food & drink", "Theatre", "Family", "Sport"];
const eventSlug = (title: string) => title.toLowerCase().replace(/[’']/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

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

export default function Home() {
  const [category, setCategory] = useState("All events");
  const [activeSlide, setActiveSlide] = useState(0);

  const featured = events.slice(0, 3);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % featured.length), 6500);
    return () => window.clearInterval(timer);
  }, [featured.length]);

  const visibleEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory = category === "All events" || event.category === category;
      return matchesCategory;
    });
  }, [category]);

  return (
    <main>
      <section className="slider-hero" id="top" aria-roledescription="carousel" aria-label="Featured events">
        {featured.map((event, index) => (
          <article className={activeSlide === index ? "hero-slide active" : "hero-slide"} key={event.id} aria-hidden={activeSlide !== index}>
            <img src={event.image} alt="" />
            <div className="slide-shade" />
            <div className="slide-content">
              <p className="slide-kicker"><span>{String(index + 1).padStart(2, "0")}</span> Featured experience</p>
              <h1>{event.title}</h1>
              <div className="slide-meta">
                <p><small>Date</small>{event.date}</p>
                <p><small>Location</small>{event.place}</p>
                <p><small>Tickets</small>{event.price}</p>
              </div>
              <div className="slide-actions">
                <a className="hero-ticket-button" href={`/events/${eventSlug(event.title)}`}>Get tickets <span>↗</span></a>
                <a className="details-button" href={`/events/${eventSlug(event.title)}`}>Explore event</a>
              </div>
            </div>
          </article>
        ))}
        <div className="slider-controls">
          <div className="slide-dots">
            {featured.map((event, index) => <button key={event.id} className={activeSlide === index ? "active" : ""} onClick={() => setActiveSlide(index)} aria-label={`Show ${event.title}`} />)}
          </div>
          <div className="slide-arrows">
            <button onClick={() => setActiveSlide((activeSlide - 1 + featured.length) % featured.length)} aria-label="Previous featured event">←</button>
            <button onClick={() => setActiveSlide((activeSlide + 1) % featured.length)} aria-label="Next featured event">→</button>
          </div>
        </div>
      </section>

      <section className="intro-marquee" aria-label="NexTix promise">
        <p>Discover more.</p><span>✦</span><p>Go somewhere.</p><span>✦</span><p>Feel everything.</p>
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
                <a className="event-image" href={`/events/${eventSlug(event.title)}`} aria-label={`View ${event.title}`}>
                  <img src={event.image} alt="" />
                  <span className="badge">{event.badge}</span>
                  <span className="save" aria-hidden="true">♡</span>
                </a>
                <div className="event-info">
                  <p className="event-date">{event.date} · {event.time}</p>
                  <h3>{event.title}</h3>
                  <p className="location">{event.place}</p>
                  <div><strong>{event.price}</strong><a className="event-details" href={`/events/${eventSlug(event.title)}`}>View event</a><a className="card-ticket-link" href={`/events/${eventSlug(event.title)}`}>Tickets</a></div>
                </div>
              </article>
            ))}
          </div>
        ) : <div className="empty-state"><h3>No events found</h3><p>Try another search or category.</p></div>}
      </section>

      <section className="organiser-strip" id="organisers">
        <div><p className="eyebrow">Built for brilliant events</p><h2>Your event.<br />Beautifully handled.</h2></div>
        <div className="organiser-copy"><p>Sell tickets, know your audience and run your event with confidence—all from one thoughtful platform.</p><button className="light-button">Explore NexTix for organisers <span>→</span></button></div>
        <div className="metric"><strong>2.4m</strong><span>tickets delivered</span></div>
      </section>

    </main>
  );
}
