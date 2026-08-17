import { notFound } from "next/navigation";
import { calendarLink, mapLink } from "../../events-data";
import { getEvent, getRelatedEvents, getTicketTiers } from "../../../lib/data";
import { TicketSelector } from "./ticket-selector";
import { SaveEventButton } from "./save-event-button";
import { ShareButton } from "./share-button";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();
  const [related, tiers] = await Promise.all([
    getRelatedEvents(event.slug, event.category),
    getTicketTiers(event.slug),
  ]);

  return <main className="event-detail" id="top">
    <section className="event-detail-hero">
      <img src={event.image} alt="" /><div className="event-detail-shade" />
      <nav className="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/events">Events</a></li><li><a href={`/events?q=${encodeURIComponent(event.category)}`}>{event.category}</a></li><li aria-current="page">{event.title}</li></ol></nav>
      <div className="event-detail-heading"><p>{event.detailCategory}</p><h1>{event.title}</h1><div><span>{event.dateLabel}</span><span>{event.venue} · {event.city}</span></div></div>
    </section>
    <section className="event-body">
      <div className="event-main">
        <div className="event-actions-row">
          <SaveEventButton slug={event.slug} title={event.title} />
          <a href={calendarLink(event)} target="_blank" rel="noreferrer" className="event-action-link">Add to calendar ↗</a>
          <ShareButton title={event.title} />
        </div>
        <p className="eyebrow">The experience</p><h2>One for the calendar.</h2><p className="event-lead">{event.intro}</p>
        <div className="event-facts">
          <article><small>Date & time</small><strong>{event.dateLabel}</strong><span>{event.time}</span></article>
          <article><small>Location</small><strong>{event.venue}</strong><span>{event.city}</span></article>
          <article><small>Age guidance</small><strong>{event.ageGuidance[0]}</strong><span>{event.ageGuidance[1]}</span></article>
          <article><small>Running time</small><strong>{event.runningTime}</strong></article>
          <article><small>Address</small><strong>{event.address}</strong><a href={mapLink(event)} target="_blank" rel="noreferrer">View on map ↗</a></article>
          <article><small>Organiser</small><strong>{event.organiser}</strong><span>Ticketed via Crowdloop</span></article>
        </div>
        <div className="event-schedule"><p className="eyebrow">Event schedule</p>{event.schedule.map(([time, item]) => <div key={time}><time>{time}</time><strong>{item}</strong></div>)}</div>
        <section className="event-info-block">
          <h3>Before you arrive</h3><p>Your mobile ticket will be available immediately after checkout. Please have it ready when you reach the entrance. Small bags are permitted and may be searched.</p>
          <h3>Accessibility</h3><p>Step-free entry, accessible toilets and companion tickets are available. Contact the organiser through your order if you need specific arrangements.</p>
          <h3>Getting there</h3><p>Public transport is recommended. Full travel guidance and any final event updates will be emailed to ticket holders before the event.</p>
          <h3>Refunds and cancellations</h3><p>If this event is cancelled or rescheduled, the organiser will contact you directly. See our <a href="/refunds">refund policy</a> for full details.</p>
        </section>
        {related.length > 0 && <section className="related-events"><p className="eyebrow">You might also like</p><h3>More {event.category.toLowerCase()} nearby</h3><div className="related-grid">{related.map((item) => <a className="related-card" href={`/events/${item.slug}`} key={item.slug}><img src={item.image} alt="" /><div><p>{item.day.toUpperCase()} {item.dateNum} {item.month} · {item.city}</p><strong>{item.title}</strong><span>From £{item.price}</span></div></a>)}</div></section>}
      </div>
      <TicketSelector slug={event.slug} title={event.title} date={event.dateLabel} venue={`${event.venue}, ${event.city}`} image={event.image} tiers={tiers} organiser={event.organiser} />
    </section>
  </main>;
}
