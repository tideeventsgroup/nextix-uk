"use client";

import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Alyvra home"><img src="/alyvra-logo.png" alt="Alyvra" /></a>
      <nav className={open ? "nav open" : "nav"} aria-label="Primary navigation">
        <a href="/events" onClick={() => setOpen(false)}>Find events</a>
        <a href="/organisers" onClick={() => setOpen(false)}>For organisers</a>
        <a href="/about" onClick={() => setOpen(false)}>About</a>
        <a href="/help" onClick={() => setOpen(false)}>Help</a>
      </nav>
      <div className="header-actions"><a className="text-button" href="/help">Sign in</a><a className="primary-button" href="/organisers">List your event</a></div>
      <button className="menu-button" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>
    </header>
  );
}

const footerGroups = [
  { title: "Discover", links: [["All events", "/events"], ["Music", "/events?category=music"], ["Food & drink", "/events?category=food"], ["Theatre", "/events?category=theatre"], ["Family", "/events?category=family"]] },
  { title: "Organisers", links: [["Sell tickets", "/organisers"], ["Platform features", "/organisers#features"], ["Pricing", "/organisers#pricing"], ["Event operations", "/organisers#operations"], ["Get started", "/contact"]] },
  { title: "Alyvra", links: [["About us", "/about"], ["Our values", "/about#values"], ["Careers", "/about#careers"], ["Contact", "/contact"], ["Help centre", "/help"]] },
  { title: "Legal & trust", links: [["Terms", "/terms"], ["Privacy", "/privacy"], ["Refund policy", "/refunds"], ["Accessibility", "/accessibility"], ["Cookie settings", "/privacy#cookies"]] },
];

export function SiteFooter() {
  return (
    <footer className="platform-footer">
      <div className="footer-lead"><img src="/alyvra-logo.png" alt="Alyvra" /><h2>Good events<br />start here.</h2><p>One thoughtful platform for finding, selling and running unforgettable events.</p><div className="socials"><a href="/contact" aria-label="Instagram">ig</a><a href="/contact" aria-label="LinkedIn">in</a><a href="/contact" aria-label="TikTok">tk</a></div></div>
      <div className="footer-links">{footerGroups.map((group) => <div key={group.title}><h3>{group.title}</h3>{group.links.map(([label, href]) => <a href={href} key={label}>{label}</a>)}</div>)}</div>
      <div className="footer-bottom"><span>© 2026 Alyvra Technologies Ltd</span><span>Designed for better events.</span><a href="#top">Back to top ↑</a></div>
    </footer>
  );
}
