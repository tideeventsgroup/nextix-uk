"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { EventRecord } from "./events-data";
import { useSavedEvents } from "./use-saved-events";

const categories = ["All events", "Music", "Food & drink", "Theatre", "Family", "Sport"];

export function HomeClient({ events }: { events: EventRecord[] }) {
  const [category, setCategory] = useState("All events");
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const { isSaved, toggle } = useSavedEvents();

  const featured = useMemo(() => events.slice(0, 3), [events]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduceMotion) return;
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % featured.length), 6500);
    return () => window.clearInterval(timer);
  }, [featured.length, paused]);

  const goTo = useCallback((index: number) => setActiveSlide(((index % featured.length) + featured.length) % featured.length), [featured.length]);

  function onSliderKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowRight") { event.preventDefault(); goTo(activeSlide + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); goTo(activeSlide - 1); }
  }

  function onTouchStart(event: React.TouchEvent) { touchStartX.current = event.touches[0].clientX; }
  function onTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) goTo(activeSlide + (delta < 0 ? 1 : -1));
    touchStartX.current = null;
  }

  const visibleEvents = useMemo(() => {
    return events.filter((event) => category === "All events" || event.category === category);
  }, [category, events]);

  return (
    <main>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- carousel container delegates hover/focus/swipe/arrow-key handling for its focusable dot and arrow buttons */}
      <section
        className="slider-hero"
        id="top"
        aria-roledescription="carousel"
        aria-label="Featured events"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onKeyDown={onSliderKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {featured.map((event, index) => (
          <article className={activeSlide === index ? "hero-slide active" : "hero-slide"} key={event.slug} aria-hidden={activeSlide !== index}>
            <img src={event.image} alt="" />
            <div className="slide-shade" />
            <div className="slide-content">
              <p className="slide-kicker"><span>{String(index + 1).padStart(2, "0")}</span> Featured experience</p>
              <h1>{event.title}</h1>
              <div className="slide-meta">
                <p><small>Date</small>{event.dateLabel}</p>
                <p><small>Location</small>{event.venue}, {event.city}</p>
                <p><small>Tickets</small>From £{event.price}</p>
              </div>
              <div className="slide-actions">
                <a className="hero-ticket-button" href={`/events/${event.slug}`}>Get tickets <span>↗</span></a>
                <a className="details-button" href={`/events/${event.slug}`}>Explore event</a>
              </div>
            </div>
          </article>
        ))}
        <div className="slider-controls">
          <div className="slide-dots">
            {featured.map((event, index) => <button key={event.slug} className={activeSlide === index ? "active" : ""} onClick={() => goTo(index)} aria-label={`Show ${event.title}`} aria-current={activeSlide === index} />)}
          </div>
          <div className="slide-arrows">
            <button onClick={() => goTo(activeSlide - 1)} aria-label="Previous featured event">←</button>
            <button onClick={() => goTo(activeSlide + 1)} aria-label="Next featured event">→</button>
          </div>
        </div>
      </section>

      <section className="intro-marquee" aria-label="Crowdloop promise">
        <p>Discover more.</p><span>✦</span><p>Go somewhere.</p><span>✦</span><p>Feel everything.</p>
      </section>

      <section className="events-section" id="events">
        <div className="section-heading">
          <div><p className="eyebrow">Made for your calendar</p><h2>What’s on</h2></div>
          <a href="/events">View all events <span>↗</span></a>
        </div>
        <div className="category-row" role="group" aria-label="Filter events by category">
          {categories.map((item) => (
            <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>
          ))}
        </div>
        {visibleEvents.length ? (
          <div className="event-grid">
            {visibleEvents.map((event) => (
              <article className="event-card" key={event.slug}>
                <a className="event-image" href={`/events/${event.slug}`} aria-label={`View ${event.title}`}>
                  <img src={event.image} alt="" />
                  <span className="badge">{event.status}</span>
                </a>
                <button type="button" className={isSaved(event.slug) ? "save saved" : "save"} onClick={() => toggle(event.slug)} aria-pressed={isSaved(event.slug)} aria-label={`${isSaved(event.slug) ? "Remove" : "Save"} ${event.title} ${isSaved(event.slug) ? "from" : "to"} saved events`}>{isSaved(event.slug) ? "♥" : "♡"}</button>
                <div className="event-info">
                  <p className="event-date">{event.day.toUpperCase()} {event.dateNum} {event.month} · {event.time}</p>
                  <h3>{event.title}</h3>
                  <p className="location">{event.venue}, {event.city}</p>
                  <div><strong>From £{event.price}</strong><a className="event-details" href={`/events/${event.slug}`}>View event</a><a className="card-ticket-link" href={`/events/${event.slug}`}>Tickets</a></div>
                </div>
              </article>
            ))}
          </div>
        ) : <div className="empty-state"><h3>No events found</h3><p>Try another search or category.</p></div>}
      </section>

      <section className="organiser-strip" id="organisers">
        <div><p className="eyebrow">Built for brilliant events</p><h2>Your event.<br />Beautifully handled.</h2></div>
        <div className="organiser-copy"><p>Sell tickets, know your audience and run your event with confidence—all from one thoughtful platform.</p><a className="light-button" href="/organisers">Explore Crowdloop for organisers <span>→</span></a></div>
        <div className="metric"><strong>2.4m</strong><span>tickets delivered</span></div>
      </section>

    </main>
  );
}
