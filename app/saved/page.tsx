"use client";

import { events } from "../events-data";
import { useSavedEvents } from "../use-saved-events";

export default function Saved() {
  const { saved, remove } = useSavedEvents();
  const savedEvents = events.filter((event) => saved.includes(event.slug));
  const recommendations = events.filter((event) => !saved.includes(event.slug)).slice(0, 3);

  return <main className="inner-page saved-page" id="top">
    <section className="saved-heading"><p className="eyebrow">Your shortlist</p><h1>Saved events</h1><p>{savedEvents.length ? `${savedEvents.length} event${savedEvents.length === 1 ? "" : "s"} saved. Keep the good ones close while you make your mind up.` : "Keep the good ones close while you make your mind up."}</p></section>
    {savedEvents.length > 0 && <section className="saved-grid">{savedEvents.map((item) => <article key={item.slug}>
      <a href={`/events/${item.slug}`}><img src={item.image} alt="" /></a>
      <button onClick={() => remove(item.slug)} aria-label={`Remove ${item.title} from saved events`}>♥</button>
      <p>{item.day.toUpperCase()} {item.dateNum} {item.month} · {item.city}</p>
      <h2><a href={`/events/${item.slug}`}>{item.title}</a></h2>
      <strong>From £{item.price}</strong>
      <a href={`/events/${item.slug}`}>View event ↗</a>
    </article>)}</section>}
    {!savedEvents.length && <section className="saved-empty"><h2>Your shortlist is empty.</h2><p>Save events you like and they’ll appear here.</p><a href="/events">Discover events →</a></section>}
    {!savedEvents.length && recommendations.length > 0 && <section className="events-section" aria-label="Recommended events">
      <div className="section-heading"><div><p className="eyebrow">While you’re here</p><h2>You might like</h2></div><a href="/events">View all events <span>↗</span></a></div>
      <div className="event-grid">{recommendations.map((event) => <article className="event-card" key={event.slug}>
        <a className="event-image" href={`/events/${event.slug}`} aria-label={`View ${event.title}`}><img src={event.image} alt="" /><span className="badge">{event.status}</span></a>
        <div className="event-info"><p className="event-date">{event.day.toUpperCase()} {event.dateNum} {event.month} · {event.time}</p><h3>{event.title}</h3><p className="location">{event.venue}, {event.city}</p><div><strong>From £{event.price}</strong><a className="event-details" href={`/events/${event.slug}`}>View event</a><a className="card-ticket-link" href={`/events/${event.slug}`}>Tickets</a></div></div>
      </article>)}</div>
    </section>}
    <section className="alerts-banner"><div><p className="eyebrow">Never miss the moment</p><h2>On-sale alerts, your way.</h2></div><div><p>Follow your favourite places and categories to hear about new events before everyone else.</p><a href="/account">Set my preferences ↗</a></div></section>
  </main>;
}
