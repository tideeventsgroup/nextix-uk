"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSession } from "../../lib/auth-client";

type Basket = { slug:string; title:string; date:string; venue:string; image:string; tier:string; quantity:number; unitPrice:number };

export default function Checkout(){
  const { data: session, isPending: sessionPending } = useSession();
  const [basket,setBasket]=useState<Basket|null>(null);
  const [loaded,setLoaded]=useState(false);
  const [promoOpen,setPromoOpen]=useState(false);
  const [promo,setPromo]=useState("");
  const [discount,setDiscount]=useState(0);
  const [promoMessage,setPromoMessage]=useState("");
  const [complete,setComplete]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [error,setError]=useState("");
  const [orderRef,setOrderRef]=useState("");

  useEffect(()=>{try{const saved=localStorage.getItem("crowdloop-basket");if(saved)setBasket(JSON.parse(saved));}catch{ /* ignore malformed basket in storage */ }setLoaded(true);},[]);
  const subtotal=basket?basket.quantity*basket.unitPrice:0;
  const fee=basket?basket.quantity*2:0;
  const total=useMemo(()=>Math.max(0,subtotal+fee-discount),[subtotal,fee,discount]);

  function updateQuantity(quantity:number){if(!basket)return;const next={...basket,quantity};setBasket(next);localStorage.setItem("crowdloop-basket",JSON.stringify(next));}
  function applyPromo(){if(promo.trim().toUpperCase()==="CROWD10"){setDiscount(Math.round(subtotal*.1));setPromoMessage("CROWD10 applied — 10% off tickets.");}else{setDiscount(0);setPromoMessage("That code isn’t valid. Try CROWD10 for this demo.");}}

  async function submitOrder(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(submitting||!basket)return;
    const data=new FormData(event.currentTarget);
    const card=String(data.get("card")||"").replace(/\s/g,"");
    if(card.length<16){setError("Check the card number and try again.");return;}
    setError("");
    setSubmitting(true);
    try{
      const response=await fetch("/api/orders",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          eventSlug:basket.slug,
          tierName:basket.tier,
          unitPrice:basket.unitPrice,
          quantity:basket.quantity,
          fee,
          discount,
          firstName:String(data.get("firstName")||""),
          lastName:String(data.get("lastName")||""),
          email:String(data.get("email")||""),
        }),
      });
      const result=await response.json();
      if(!response.ok){setError(result.error||"We couldn’t complete that order. Try again.");setSubmitting(false);return;}
      setOrderRef(result.reference);
      localStorage.removeItem("crowdloop-basket");
      setSubmitting(false);
      setComplete(true);
      window.scrollTo({top:0,behavior:"smooth"});
    }catch{
      setError("We couldn’t reach Crowdloop. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  if(!loaded||sessionPending) return <main className="checkout-page" id="top" aria-busy="true"><p className="checkout-loading">Loading your basket…</p></main>;

  if(!basket&&!complete) return <main className="checkout-page" id="top"><div className="checkout-top"><a href="/events">← Back to events</a><span>Secure checkout</span></div><section className="basket-empty"><h1>Your basket is empty</h1><p>Choose tickets from an event page and they’ll appear here ready for checkout.</p><a href="/events">Find events →</a></section></main>;

  if(!session&&basket&&!complete) return <main className="checkout-page" id="top"><div className="checkout-top"><a href={`/events/${basket.slug}`}>← Back to event</a><span>Secure checkout</span></div><section className="basket-empty"><h1>Sign in to complete checkout</h1><p>Your {basket.quantity} × {basket.tier} {basket.quantity===1?"ticket is":"tickets are"} still waiting — sign in or create a Crowdloop account to finish your order and keep it in My Tickets.</p><a href="/account">Sign in to continue →</a></section></main>;

  return <main className="checkout-page" id="top">
    <div className="checkout-top">{basket&&<a href={`/events/${basket.slug}`}>← Back to event</a>}<span>Secure checkout</span>{!complete&&<small>Basket reserved for 05:00</small>}</div>
    {complete?<section className="order-success"><span>✓</span><p className="eyebrow">Order confirmed · {orderRef}</p><h1>You’re going.</h1><p>Your {basket?.title} {basket&&basket.quantity===1?"ticket is":"tickets are"} ready in My tickets. A confirmation has been sent to your email.</p><p className="demo-disclaimer">This is a demonstration checkout. No real payment has been taken and no email has actually been sent — but your order and tickets are saved to your account for real.</p><a href="/my-tickets">Open my tickets →</a></section>:basket&&<form className="checkout-layout" onSubmit={submitOrder}>
      <div className="checkout-form">
        <p className="eyebrow">{basket.title}</p><h1>Complete your order</h1>
        <div className="checkout-step"><span>1</span><div><h2>Your tickets</h2><div className="checkout-ticket"><p><strong>{basket.tier}</strong><small>{basket.date} · Mobile ticket</small></p><select value={basket.quantity} onChange={e=>updateQuantity(Number(e.target.value))} aria-label="Quantity"><option>1</option><option>2</option><option>3</option><option>4</option></select></div><button type="button" className="promo-toggle" onClick={()=>setPromoOpen(!promoOpen)} aria-expanded={promoOpen}>Have a promo code? +</button>{promoOpen&&<><label className="promo-entry"><input value={promo} onChange={e=>setPromo(e.target.value)} placeholder="Enter code" aria-label="Promo code"/><button type="button" onClick={applyPromo}>Apply</button></label>{promoMessage&&<p className={discount?"promo-message success":"promo-message"} role="status">{promoMessage}</p>}</>}</div></div>
        <div className="checkout-step"><span>2</span><div><h2>Your details</h2><div className="field-row"><label>First name<input name="firstName" required autoComplete="given-name" placeholder="Alex" defaultValue={session?.user.name?.split(" ")[0]||""}/></label><label>Last name<input name="lastName" required autoComplete="family-name" placeholder="Taylor" defaultValue={session?.user.name?.split(" ").slice(1).join(" ")||""}/></label></div><label>Email address<input name="email" required type="email" autoComplete="email" placeholder="alex@example.com" defaultValue={session?.user.email||""}/></label><label className="check"><input type="checkbox"/> Send event updates and practical information</label></div></div>
        <div className="checkout-step"><span>3</span><div><h2>Payment</h2><p className="demo-disclaimer">Demonstration checkout — enter any 16-digit number, no real card is charged.</p><label>Card number<input name="card" required inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" maxLength={19}/></label><div className="field-row"><label>Expiry<input name="expiry" required autoComplete="cc-exp" placeholder="MM / YY"/></label><label>Security code<input name="cvc" required inputMode="numeric" autoComplete="cc-csc" placeholder="CVC" maxLength={4}/></label></div><label className="check"><input type="checkbox"/> Save payment method securely for next time</label>{error&&<p className="checkout-error" role="alert">{error}</p>}</div></div>
      </div>
      <aside className="order-summary"><img src={basket.image} alt=""/><h2>{basket.title}</h2><p>{basket.date}<br/>{basket.venue}</p><div><span>{basket.quantity} × {basket.tier}</span><b>£{subtotal}.00</b><span>Booking fee</span><b>£{fee}.00</b>{discount>0&&<><span>Promo discount</span><b>−£{discount}.00</b></>}<strong>Total</strong><strong>£{total}.00</strong></div><button type="submit" disabled={submitting} aria-busy={submitting}>{submitting?"Processing…":`Pay securely · £${total}.00`}</button><small>Demonstration payment · Clear pricing · Buyer protection</small></aside>
    </form>}
  </main>;
}
