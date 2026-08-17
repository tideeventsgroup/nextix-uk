"use client";
import { useMemo, useState } from "react";

const topics = [
  ["Tickets & orders", "Find tickets, update details and get help with an order."],
  ["Event information", "Questions about timings, entry, accessibility or venues."],
  ["Refunds & transfers", "Understand refund rules and how ticket transfers work."],
  ["Organiser support", "Guides for building, selling and operating your event."],
  ["Account & security", "Manage sign-in details and keep your account secure."],
  ["Contact support", "Can’t find the answer? Speak to the Crowdloop team."],
];

const faqs = [
  { q: "Where can I find my tickets?", a: "Sign in and open My tickets from the account menu. Every order you’ve made appears there with its mobile ticket, order reference and event details." },
  { q: "Can I transfer a ticket to someone else?", a: "Yes. Open the ticket in My tickets and choose Transfer ticket. Enter the recipient’s email address and they’ll receive instructions to claim it. The ticket moves to their wallet once accepted." },
  { q: "What happens if an event is cancelled?", a: "The organiser will email every ticket holder with next steps. Eligible refunds are returned automatically to your original payment method — see our refund policy for timings." },
  { q: "How do I contact an event organiser?", a: "Open your order in My tickets and choose Get order help. This routes your message to the organiser for event-specific questions like accessibility arrangements or lost property." },
  { q: "Can I get a refund if I change my mind?", a: "Ticket sales are generally final once booked, as tickets aren’t normally covered by a cooling-off period. Some organisers offer voluntary refunds — check the event page or your order for their policy." },
  { q: "How does official face-value resale work?", a: "If you can no longer attend, list an eligible ticket from My tickets for exactly the price you paid. It stays valid and yours until another fan buys it, then transfers to them automatically." },
];

export default function HelpPage(){
  const [search,setSearch]=useState("");
  const query=search.trim().toLowerCase();
  const filteredTopics=useMemo(()=>query?topics.filter(([title,copy])=>`${title} ${copy}`.toLowerCase().includes(query)):topics,[query]);
  const filteredFaqs=useMemo(()=>query?faqs.filter(({q,a})=>`${q} ${a}`.toLowerCase().includes(query)):faqs,[query]);

  return <main className="inner-page" id="top">
    <section className="page-hero help-hero">
      <p className="eyebrow">Crowdloop help centre</p><h1>How can we help?</h1>
      <form className="directory-search" onSubmit={event=>event.preventDefault()}>
        <input value={search} onChange={event=>setSearch(event.target.value)} placeholder="Search help articles" aria-label="Search help"/>
        <button type="submit">Search</button>
      </form>
    </section>
    {filteredTopics.length>0&&<section className="help-grid">{filteredTopics.map(([title,copy])=><a href={title==="Contact support"?"/contact":"#answers"} key={title}><span>0{topics.findIndex(t=>t[0]===title)+1}</span><h2>{title}</h2><p>{copy}</p><b>View help →</b></a>)}</section>}
    <section className="faq" id="answers">
      <p className="eyebrow">Popular questions</p><h2>Quick answers</h2>
      {filteredFaqs.length>0?filteredFaqs.map(({q,a})=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>):<p className="no-faq-results">No help articles match “{search}”. Try a different search or <a href="/contact">contact support</a>.</p>}
    </section>
  </main>
}
