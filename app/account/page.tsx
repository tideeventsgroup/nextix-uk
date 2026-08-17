"use client";

import { FormEvent, useState } from "react";
import { requestPasswordReset, signIn, signOut, signUp, useSession } from "../../lib/auth-client";

type Mode = "signin" | "create" | "reset";

export default function Account(){
  const { data: session, isPending } = useSession();
  const [mode,setMode]=useState<Mode>("signin");
  const [showPassword,setShowPassword]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [error,setError]=useState("");
  const [submitted,setSubmitted]=useState<Mode|null>(null);

  async function submitSignIn(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(submitting)return;
    const data=new FormData(event.currentTarget);
    setSubmitting(true);setError("");
    const { error: signInError } = await signIn.email({
      email:String(data.get("email")||""),
      password:String(data.get("password")||""),
      rememberMe:data.get("remember")==="on",
    });
    setSubmitting(false);
    if(signInError){setError(signInError.message||"Check your email and password and try again.");return;}
    setSubmitted("signin");
  }

  async function submitCreate(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(submitting)return;
    const data=new FormData(event.currentTarget);
    setSubmitting(true);setError("");
    const { error: signUpError } = await signUp.email({
      name:String(data.get("name")||""),
      email:String(data.get("email")||""),
      password:String(data.get("password")||""),
    });
    setSubmitting(false);
    if(signUpError){setError(signUpError.message||"We couldn’t create your account. Try a different email address.");return;}
    setSubmitted("create");
  }

  async function submitReset(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(submitting)return;
    const data=new FormData(event.currentTarget);
    setSubmitting(true);setError("");
    const { error: resetError } = await requestPasswordReset({
      email:String(data.get("email")||""),
      redirectTo:"/account",
    });
    setSubmitting(false);
    if(resetError){setError(resetError.message||"We couldn’t start a password reset for that address.");return;}
    setSubmitted("reset");
  }

  function backToSignIn(){
    setSubmitted(null);
    setError("");
    setMode("signin");
  }

  async function handleSignOut(){
    await signOut();
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
        {isPending?<p className="auth-intro">Checking your session…</p>:session?<div className="auth-success">
          <span>✓</span>
          <h3>Signed in</h3>
          <p>You’re signed in as {session.user.name || session.user.email}.</p>
          <a href="/my-tickets">View my tickets →</a>
          <button onClick={handleSignOut}>Sign out</button>
        </div>:submitted?<div className="auth-success">
          <span>✓</span>
          {submitted==="signin"&&<><h3>Welcome back</h3><p>You’re signed in.</p><a href="/my-tickets">View my tickets →</a></>}
          {submitted==="create"&&<><h3>Account created</h3><p>Your Crowdloop account is ready.</p><a href="/my-tickets">Explore my tickets →</a></>}
          {submitted==="reset"&&<><h3>Check your email</h3><p>If an account exists for that address, a reset link is on its way. Note: this environment doesn’t yet have an email provider connected, so reset emails won’t actually be delivered until one is.</p></>}
          <button onClick={backToSignIn}>Back to sign in</button>
        </div>:<>
          {mode==="signin"&&<>
            <p className="eyebrow">Welcome back</p>
            <h2>Sign in to Crowdloop</h2>
            <p className="auth-intro">Your tickets, plans and saved events are waiting.</p>
            <form onSubmit={submitSignIn}>
              <label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required/></label>
              <label>Password <button type="button" className="link-button" onClick={()=>setMode("reset")}>Forgot password?</button><span className="password-field"><input name="password" type={showPassword?"text":"password"} placeholder="Enter your password" autoComplete="current-password" required/><button type="button" onClick={()=>setShowPassword(value=>!value)}>{showPassword?"Hide":"Show"}</button></span></label>
              <label className="remember-me"><input name="remember" type="checkbox" defaultChecked/> Keep me signed in</label>
              {error&&<p className="checkout-error" role="alert">{error}</p>}
              <button className="auth-submit" type="submit" disabled={submitting} aria-busy={submitting}><span>{submitting?"Signing in…":"Sign in"}</span><b>→</b></button>
            </form>
            <p className="auth-create">New to Crowdloop? <button type="button" className="link-button" onClick={()=>{setMode("create");setError("")}}>Create an account</button></p>
          </>}
          {mode==="create"&&<>
            <p className="eyebrow">Join Crowdloop</p>
            <h2>Create your account</h2>
            <p className="auth-intro">Save events, manage orders and check out faster next time.</p>
            <form onSubmit={submitCreate}>
              <label>Full name<input name="name" type="text" placeholder="Alex Taylor" autoComplete="name" required/></label>
              <label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required/></label>
              <label>Password<span className="password-field"><input name="password" type={showPassword?"text":"password"} placeholder="Create a password" autoComplete="new-password" minLength={8} required/><button type="button" onClick={()=>setShowPassword(value=>!value)}>{showPassword?"Hide":"Show"}</button></span></label>
              <label className="remember-me"><input type="checkbox" required/> I agree to the <a href="/terms">Terms</a> and <a href="/privacy">Privacy policy</a></label>
              {error&&<p className="checkout-error" role="alert">{error}</p>}
              <button className="auth-submit" type="submit" disabled={submitting} aria-busy={submitting}><span>{submitting?"Creating account…":"Create account"}</span><b>→</b></button>
            </form>
            <p className="auth-create">Already have an account? <button type="button" className="link-button" onClick={()=>{setMode("signin");setError("")}}>Sign in</button></p>
          </>}
          {mode==="reset"&&<>
            <p className="eyebrow">Reset password</p>
            <h2>Forgotten your password?</h2>
            <p className="auth-intro">Enter your email address and we’ll send you a link to reset it.</p>
            <form onSubmit={submitReset}>
              <label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required/></label>
              {error&&<p className="checkout-error" role="alert">{error}</p>}
              <button className="auth-submit" type="submit" disabled={submitting} aria-busy={submitting}><span>{submitting?"Sending…":"Send reset link"}</span><b>→</b></button>
            </form>
            <p className="auth-create"><button type="button" className="link-button" onClick={()=>{setMode("signin");setError("")}}>Back to sign in</button></p>
          </>}
        </>}
      </div>
      <footer><span>© 2026 Crowdloop</span><a href="/privacy">Privacy</a><a href="/help">Need help?</a></footer>
    </section>
  </main>
}
