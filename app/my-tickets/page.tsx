"use client";
import { useState } from "react";

const upcomingTickets = [
  { slug: "north-coast-sessions", title: "North Coast Sessions", date: "12 SEP 2026", place: "The Harbour Grounds, Ayr", type: "General admission", price: 32, ref: "CL-48291", status: "Confirmed", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=85" },
  { slug: "afterlight-orchestra", title: "Afterlight Orchestra", date: "23 OCT 2026", place: "Assembly Rooms, Aberdeen", type: "Priority entry", price: 42, ref: "CL-51047", status: "Confirmed", image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=900&q=85" },
];
const pastTickets = [
  { slug: "field-and-flame-festival", title: "Field & Flame Festival", date: "21 SEP 2025", place: "Kelvingrove Park, Glasgow", type: "General admission", price: 18, ref: "CL-39102", status: "Attended", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=85" },
];

export default function MyTickets() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [active, setActive] = useState(0);
  const [action, setAction] = useState("");
  const list = tab === "upcoming" ? upcomingTickets : pastTickets;
  const ticket = list[Math.min(active, list.length - 1)];

  function selectTab(next: "upcoming" | "past") {
    setTab(next);
    setActive(0);
    setAction("");
  }

  return (
    <main className="inner-page ticket-wallet" id="top">
      <section className="wallet-heading">
        <div><p className="eyebrow">Your Crowdloop wallet</p><h1>My tickets</h1><p>Everything you need for event day, available in one secure place.</p></div>
        <nav>
          <button className={tab === "upcoming" ? "active" : ""} onClick={() => selectTab("upcoming")} aria-pressed={tab === "upcoming"}>Upcoming <span>{upcomingTickets.length}</span></button>
          <button className={tab === "past" ? "active" : ""} onClick={() => selectTab("past")} aria-pressed={tab === "past"}>Past <span>{pastTickets.length}</span></button>
        </nav>
      </section>

      {list.length === 0 ? (
        <section className="saved-empty"><h2>No {tab} tickets yet.</h2><p>{tab === "upcoming" ? "Your booked events will appear here." : "Events you’ve attended will appear here."}</p><a href="/events">Discover events →</a></section>
      ) : (
        <section className="wallet-layout">
          <aside>
            {list.map((t, i) => (
              <button className={active === i ? "active" : ""} onClick={() => { setActive(i); setAction(""); }} key={t.ref}>
                <img src={t.image} alt="" />
                <span><small>{t.date}</small><strong>{t.title}</strong><em>{t.place}</em></span>
              </button>
            ))}
          </aside>
          <article className="digital-ticket">
            <div className="ticket-photo"><img src={ticket.image} alt="" /><span>CROWDLOOP {tab === "upcoming" ? "TICKET" : "ATTENDED"}</span></div>
            <div className="ticket-content">
              <p>{ticket.date}</p>
              <h2>{ticket.title}</h2>
              <span>{ticket.place}</span>
              <div className="ticket-spec"><p><small>Ticket</small>{ticket.type}</p><p><small>Order</small>{ticket.ref}</p></div>
              <div className="barcode" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
              <small>Demonstration barcode — not a scannable code. {tab === "upcoming" ? "Activates 24 hours before the event." : "This event has passed."}</small>
            </div>
          </article>
          {tab === "upcoming" ? (
            <div className="ticket-tools">
              <h2>Manage tickets</h2>
              <button onClick={() => setAction("wallet")}>▣ <span><strong>Add to phone wallet</strong><small>Keep it ready offline</small></span>→</button>
              <button onClick={() => setAction("transfer")}>↗ <span><strong>Transfer ticket</strong><small>Send securely to a friend</small></span>→</button>
              <button onClick={() => setAction("resale")}>↻ <span><strong>Sell at face value</strong><small>Official Crowdloop resale</small></span>→</button>
              <a href="/help">? <span><strong>Get order help</strong><small>Support for {ticket.ref}</small></span>→</a>
              {action && (
                <div className="action-card">
                  {action === "transfer" ? (
                    <><strong>Transfer this ticket</strong><p>This is a prototype flow — no email is actually sent.</p><input placeholder="Recipient email address" aria-label="Recipient email address" /><button onClick={() => setAction("sent")}>Send securely</button></>
                  ) : action === "resale" ? (
                    <><strong>Official face-value resale</strong><p>We’ll list this ticket for £{ticket.price}.00, the price you paid. It remains yours until another fan buys it. This is a prototype — no listing is created.</p><button onClick={() => setAction("listed")}>List ticket</button></>
                  ) : action === "wallet" ? (
                    <><strong>Ready for your wallet</strong><p>This is a prototype — no pass is actually added to your device wallet.</p><button onClick={() => setAction("added")}>Add pass</button></>
                  ) : (
                    <><strong>All done</strong><p>{action === "sent" ? "Transfer invitation sent (demo)." : action === "listed" ? "Your ticket is now listed (demo)." : "Ticket added to your wallet (demo)."}</p></>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="ticket-tools">
              <h2>Past order</h2>
              <a href="/help">? <span><strong>Get order help</strong><small>Support for {ticket.ref}</small></span>→</a>
              <a href={`/events/${ticket.slug}`}>↻ <span><strong>Book again</strong><small>Find this event next time it’s on</small></span>→</a>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
