"use client";

import { FormEvent, useState } from "react";

type Mode = "signin" | "create" | "reset";

export default function Account(){
  const [mode,setMode]=useState<Mode>("signin");
  const [showPassword,setShowPassword]=useState(false);
  const [submitted,setSubmitted]=useState<Mode|null>(null);

  function submit(event:FormEvent<HTMLFormElement>, from:Mode){
    event.preventDefault();
    setSubmitted(from);
  }

  function backToSignIn(){
    setSubmitted(null);
    setMode("signin");
  }

  return <main className="account-page" id="top">
    <a className="auth-brand" href="/" aria-label="Crowdloop home"><img src="/crowdloop-logo.png" alt="Crowdloop"/></a>
    <a className="auth-close" href="/" aria-label="Close and return home">×</a>
    <section className="auth-stage" aria-hidden="true">
      <div className="auth-glow glow-one"/><div className="auth-glow glow-two"/>
      <div className="ticket-orbit orbit-one"><article><small>FRI · 12 SEP</small><strong>North Coast<br/>Sessions</strong><span>LOW GREEN · AYR</span><b>CL · 01824</b></article></div>
      <div className="ticket-orbit orbit-two"><article><small>SAT · 20 SEP</small><strong>Field & Flame<br/>Festival</strong><span>SWG3 · GLASGOW</span><b>CL · 04291</b></article></div>
      <div className="auth-message"><span>YOUR NEXT NIGHT OUT</span><h1>Everything<br/>you’re going to.</h1><p>Tickets, saved events and the best things happening near you—all together.</p></div>
      <div className="auth-marquee"><div>LIVE MUSIC · FESTIVALS · THEATRE · COMEDY · FAMILY · SPORT · LIVE MUSIC · FESTIVALS · THEATRE · COMEDY · FAMILY · SPORT ·</div></div>
    </section>
    <section className="auth-panel">
      <div className="auth-panel-inner">
        {submitted?<div className="auth-success">
          <span>✓</span>
          {submitted==="signin"&&<><h3>Welcome back</h3><p>This preview is ready for secure account authentication to be connected.</p><a href="/my-tickets">View my tickets →</a></>}
          {submitted==="create"&&<><h3>Account created</h3><p>This is a prototype — no real account has been created and no email has been sent. In production this would send a verification email.</p><a href="/my-tickets">Explore my tickets →</a></>}
          {submitted==="reset"&&<><h3>Check your email</h3><p>This is a prototype — no reset email has actually been sent. In production a reset link would arrive shortly.</p></>}
          <button onClick={backToSignIn}>Back to sign in</button>
        </div>:<>
          {mode==="signin"&&<>
            <p className="eyebrow">Welcome back</p>
            <h2>Sign in to Crowdloop</h2>
            <p className="auth-intro">Your tickets, plans and saved events are waiting.</p>
            <div className="social-signin"><button type="button"><b>G</b> Continue with Google</button><button type="button"><b>●</b> Continue with Apple</button></div>
            <div className="auth-divider"><span>or continue with email</span></div>
            <form onSubmit={event=>submit(event,"signin")}>
              <label>Email address<input type="email" placeholder="you@example.com" autoComplete="email" required/></label>
              <label>Password <button type="button" className="link-button" onClick={()=>setMode("reset")}>Forgot password?</button><span className="password-field"><input type={showPassword?"text":"password"} placeholder="Enter your password" autoComplete="current-password" required/><button type="button" onClick={()=>setShowPassword(value=>!value)}>{showPassword?"Hide":"Show"}</button></span></label>
              <label className="remember-me"><input type="checkbox"/> Keep me signed in</label>
              <button className="auth-submit" type="submit"><span>Sign in</span><b>→</b></button>
            </form>
            <p className="auth-create">New to Crowdloop? <button type="button" className="link-button" onClick={()=>setMode("create")}>Create an account</button></p>
          </>}
          {mode==="create"&&<>
            <p className="eyebrow">Join Crowdloop</p>
            <h2>Create your account</h2>
            <p className="auth-intro">Save events, manage orders and check out faster next time.</p>
            <div className="social-signin"><button type="button"><b>G</b> Continue with Google</button><button type="button"><b>●</b> Continue with Apple</button></div>
            <div className="auth-divider"><span>or continue with email</span></div>
            <form onSubmit={event=>submit(event,"create")}>
              <label>Full name<input type="text" placeholder="Alex Taylor" autoComplete="name" required/></label>
              <label>Email address<input type="email" placeholder="you@example.com" autoComplete="email" required/></label>
              <label>Password<span className="password-field"><input type={showPassword?"text":"password"} placeholder="Create a password" autoComplete="new-password" minLength={8} required/><button type="button" onClick={()=>setShowPassword(value=>!value)}>{showPassword?"Hide":"Show"}</button></span></label>
              <label className="remember-me"><input type="checkbox" required/> I agree to the <a href="/terms">Terms</a> and <a href="/privacy">Privacy policy</a></label>
              <button className="auth-submit" type="submit"><span>Create account</span><b>→</b></button>
            </form>
            <p className="auth-create">Already have an account? <button type="button" className="link-button" onClick={()=>setMode("signin")}>Sign in</button></p>
          </>}
          {mode==="reset"&&<>
            <p className="eyebrow">Reset password</p>
            <h2>Forgotten your password?</h2>
            <p className="auth-intro">Enter your email address and we’ll send you a link to reset it.</p>
            <form onSubmit={event=>submit(event,"reset")}>
              <label>Email address<input type="email" placeholder="you@example.com" autoComplete="email" required/></label>
              <button className="auth-submit" type="submit"><span>Send reset link</span><b>→</b></button>
            </form>
            <p className="auth-create"><button type="button" className="link-button" onClick={()=>setMode("signin")}>Back to sign in</button></p>
          </>}
        </>}
      </div>
      <footer><span>© 2026 Crowdloop</span><a href="/privacy">Privacy</a><a href="/help">Need help?</a></footer>
    </section>
  </main>
}
