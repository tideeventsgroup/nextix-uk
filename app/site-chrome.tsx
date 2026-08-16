"use client";

import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" aria-label="NexTix home"><img src="/nextix-logo.png" alt="NexTix" /></a>
        <form className="header-search" action="/events" role="search">
          <span aria-hidden="true" />
          <input name="q" type="search" placeholder="Search events, artists or places" aria-label="Search events, artists or places" />
          <button type="submit" aria-label="Submit search">→</button>
        </form>
        <button className="mega-trigger" aria-controls="mega-menu" aria-expanded={open} onClick={() => setOpen(!open)}><span>{open ? "Close" : "Menu"}</span><i aria-hidden="true">{open ? "×" : "＋"}</i></button>
        <div className="header-actions"><a className="header-saved" href="/saved" aria-label="Saved events">♡</a><a className="text-button" href="/my-tickets">My tickets</a><a className="primary-button" href="/organisers">List your event</a></div>
      </header>
      <nav id="mega-menu" className={open ? "mega-menu open" : "mega-menu"} aria-label="Main menu">
        <div className="mega-feature"><p>Featured this week</p><h2>North Coast<br/>Sessions</h2><span>12 September · Ayr</span><a href="/events/north-coast-sessions" onClick={() => setOpen(false)}>Explore event ↗</a></div>
        <div className="mega-group"><p>Discover</p><a href="/events" onClick={() => setOpen(false)}>All events</a><a href="/events?q=Music" onClick={() => setOpen(false)}>Music</a><a href="/events?q=Family" onClick={() => setOpen(false)}>Family days</a><a href="/venues" onClick={() => setOpen(false)}>Venues</a></div>
        <div className="mega-group"><p>Your tickets</p><a href="/my-tickets" onClick={() => setOpen(false)}>My tickets</a><a href="/saved" onClick={() => setOpen(false)}>Saved events</a><a href="/account" onClick={() => setOpen(false)}>Your account</a><a href="/help" onClick={() => setOpen(false)}>Get help</a></div>
        <div className="mega-group"><p>For organisers</p><a href="/organisers" onClick={() => setOpen(false)}>Sell tickets</a><a href="/organisers#features" onClick={() => setOpen(false)}>Platform features</a><a href="/organisers#pricing" onClick={() => setOpen(false)}>Pricing</a><a href="/contact" onClick={() => setOpen(false)}>Talk to our team</a></div>
        <div className="mega-foot"><span>Good events start here.</span><div><a href="/about" onClick={() => setOpen(false)}>About NexTix</a><a href="/contact" onClick={() => setOpen(false)}>Contact</a></div></div>
      </nav>
    </>
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
