"use client";

import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <div className="header-stack">
      <div className="utility-bar"><span>UK events</span><nav aria-label="Utility navigation"><a href="/help">Help</a><a href="/saved">Gift an experience</a><a href="/organisers">Sell tickets</a></nav></div>
      <header className="site-header">
        <a className="brand" href="/" aria-label="NexTix home"><img src="/nextix-logo.png" alt="NexTix" /></a>
        <form className="market-search" action="/events" role="search">
          <label><span aria-hidden="true" className="market-search-icon"/><small>Search</small><input name="q" type="search" placeholder="Artist, event or venue" aria-label="Search by artist, event or venue" /></label>
          <label className="location-field"><small>Location</small><select name="location" aria-label="Location"><option value="">All locations</option><option>Ayr</option><option>Glasgow</option><option>Edinburgh</option><option>Dundee</option><option>Stirling</option><option>Aberdeen</option></select></label>
          <button type="submit">Find events</button>
        </form>
        <div className="header-actions"><a className="header-saved" href="/saved" aria-label="Saved events">♡</a><a className="header-ticket-link" href="/my-tickets"><small>Your orders</small><strong>My tickets</strong></a><a className="account-link" href="/account" aria-label="Account"><span aria-hidden="true">N</span><strong>Account</strong></a></div>
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
  { title: "NexTix", links: [["About us", "/about"], ["Your account", "/account"], ["Our values", "/about#values"], ["Careers", "/about#careers"], ["Contact", "/contact"], ["Help centre", "/help"]] },
  { title: "Legal & trust", links: [["Terms", "/terms"], ["Privacy", "/privacy"], ["Refund policy", "/refunds"], ["Accessibility", "/accessibility"], ["Cookie settings", "/privacy#cookies"]] },
];

export function SiteFooter() {
  return (
    <footer className="platform-footer">
      <section className="footer-cta">
        <div><p>For event organisers</p><h2>Put everything behind<br />your event in one place.</h2></div>
        <div><p>Ticketing, planning and live operations—connected from first announcement to final report.</p><a href="/organisers">Explore the platform <span>↗</span></a></div>
      </section>
      <div className="footer-main">
        <div className="footer-brand"><img src="/nextix-logo.png" alt="NexTix" /><p>Good events start here. Discover what’s on, secure your place and keep every ticket close.</p><form className="footer-newsletter"><strong>Get the good stuff first.</strong><label><input type="email" placeholder="Email address" aria-label="Email address"/><button type="submit" aria-label="Subscribe">Join <span>→</span></button></label><small>Occasional event recommendations. No noise.</small></form></div>
        <div className="footer-links">{footerGroups.map((group) => <div key={group.title}><h3>{group.title}</h3>{group.links.map(([label, href]) => <a href={href} key={label}>{label}</a>)}</div>)}</div>
      </div>
      <div className="footer-bottom"><span>© 2026 NexTix Technologies Ltd</span><div><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/accessibility">Accessibility</a></div><div className="socials"><a href="/contact" aria-label="Instagram">ig</a><a href="/contact" aria-label="LinkedIn">in</a><a href="/contact" aria-label="TikTok">tk</a></div><a href="#top">Back to top ↑</a></div>
    </footer>
  );
}
