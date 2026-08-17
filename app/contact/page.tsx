"use client";
import { FormEvent, useState } from "react";

export default function ContactPage(){
  const [submitted,setSubmitted]=useState(false);
  const [error,setError]=useState("");

  function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const data=new FormData(event.currentTarget);
    const email=String(data.get("email")||"");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setError("Enter a valid email address so we can reply to you.");return;}
    if(!String(data.get("message")||"").trim()){setError("Tell us a little about what you need.");return;}
    setError("");
    setSubmitted(true);
  }

  return <main className="inner-page" id="top"><section className="contact-layout">
    <div>
      <p className="eyebrow">Contact Crowdloop</p><h1>Let’s make something happen.</h1>
      <p>Buying tickets, planning an event, or exploring the platform? Tell us what you need and we’ll point you in the right direction.</p>
      <div className="contact-details">
        <p><small>Ticket support</small>support@crowdloop.example</p>
        <p><small>Organiser enquiries</small>hello@crowdloop.example</p>
        <p><small>Hours</small>Monday–Friday, 09:00–17:30</p>
      </div>
    </div>
    {submitted?<div className="contact-success"><span>✓</span><h2>Message sent</h2><p>Thanks for getting in touch. This is a prototype form, so no message has actually been sent — in production we’d reply within one working day.</p><button type="button" onClick={()=>setSubmitted(false)}>Send another message</button></div>:
    <form onSubmit={submit} noValidate>
      <label>Name<input name="name" required placeholder="Your name"/></label>
      <label>Email<input name="email" required type="email" placeholder="you@example.com"/></label>
      <label>What can we help with?<select name="topic"><option>Ticket or order</option><option>Organising an event</option><option>Partnership</option><option>Something else</option></select></label>
      <label>Message<textarea name="message" required rows={6} placeholder="Tell us a little more"/></label>
      {error&&<p className="checkout-error" role="alert">{error}</p>}
      <button type="submit">Send message ↗</button>
    </form>}
  </section></main>
}
