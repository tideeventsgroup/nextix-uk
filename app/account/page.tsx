"use client";

import { useState } from "react";

export default function Account(){
  const [showPassword,setShowPassword]=useState(false);
  const [submitted,setSubmitted]=useState(false);
  return <main className="account-page" id="top">
    <a className="auth-brand" href="/" aria-label="Crowdloop home"><img src="/crowdloop-logo.png" alt="Crowdloop"/></a>
    <a className="auth-close" href="/" aria-label="Close and return home">×</a>
    <section className="auth-stage" aria-hidden="true">
      <div className="auth-glow glow-one"/><div className="auth-glow glow-two"/>
      <div className="ticket-orbit orbit-one"><article><small>FRI · 12 SEP</small><strong>North Coast<br/>Sessions</strong><span>LOW GREEN · AYR</span><b>NXT · 01824</b></article></div>
      <div className="ticket-orbit orbit-two"><article><small>SAT · 20 SEP</small><strong>Field & Flame<br/>Festival</strong><span>SWG3 · GLASGOW</span><b>NXT · 04291</b></article></div>
      <div className="auth-message"><span>YOUR NEXT NIGHT OUT</span><h1>Everything<br/>you’re going to.</h1><p>Tickets, saved events and the best things happening near you—all together.</p></div>
      <div className="auth-marquee"><div>LIVE MUSIC · FESTIVALS · THEATRE · COMEDY · FAMILY · SPORT · LIVE MUSIC · FESTIVALS · THEATRE · COMEDY · FAMILY · SPORT ·</div></div>
    </section>
    <section className="auth-panel">
      <div className="auth-panel-inner">
        <p className="eyebrow">Welcome back</p>
        <h2>Sign in to Crowdloop</h2>
        <p className="auth-intro">Your tickets, plans and saved events are waiting.</p>
        {submitted?<div className="auth-success"><span>✓</span><h3>Welcome back</h3><p>This preview is ready for secure account authentication to be connected.</p><a href="/my-tickets">View my tickets →</a><button onClick={()=>setSubmitted(false)}>Back to sign in</button></div>:<>
          <div className="social-signin"><button type="button"><b>G</b> Continue with Google</button><button type="button"><b>●</b> Continue with Apple</button></div>
          <div className="auth-divider"><span>or continue with email</span></div>
          <form onSubmit={event=>{event.preventDefault();setSubmitted(true)}}>
            <label>Email address<input type="email" placeholder="you@example.com" autoComplete="email" required/></label>
            <label>Password <a href="/help">Forgot password?</a><span className="password-field"><input type={showPassword?"text":"password"} placeholder="Enter your password" autoComplete="current-password" required/><button type="button" onClick={()=>setShowPassword(value=>!value)}>{showPassword?"Hide":"Show"}</button></span></label>
            <label className="remember-me"><input type="checkbox"/> Keep me signed in</label>
            <button className="auth-submit" type="submit"><span>Sign in</span><b>→</b></button>
          </form>
          <p className="auth-create">New to Crowdloop? <a href="/contact">Create an account</a></p>
        </>}
      </div>
      <footer><span>© 2026 Crowdloop</span><a href="/privacy">Privacy</a><a href="/help">Need help?</a></footer>
    </section>
  </main>
}
