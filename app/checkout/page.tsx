"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Basket = { slug:string; title:string; date:string; venue:string; image:string; tier:string; quantity:number; unitPrice:number };
const fallback: Basket = { slug:"north-coast-sessions", title:"North Coast Sessions", date:"Saturday 12 September 2026", venue:"The Harbour Grounds, Ayr", image:"https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=85", tier:"General admission", quantity:1, unitPrice:32 };

export default function Checkout(){
  const [basket,setBasket]=useState<Basket>(fallback);
  const [promoOpen,setPromoOpen]=useState(false);
  const [promo,setPromo]=useState("");
  const [discount,setDiscount]=useState(0);
  const [promoMessage,setPromoMessage]=useState("");
  const [complete,setComplete]=useState(false);
  const [error,setError]=useState("");

  useEffect(()=>{try{const saved=localStorage.getItem("crowdloop-basket");if(saved)setBasket(JSON.parse(saved));}catch{}},[]);
  const subtotal=basket.quantity*basket.unitPrice;
  const fee=basket.quantity*2;
  const total=useMemo(()=>Math.max(0,subtotal+fee-discount),[subtotal,fee,discount]);

  function updateQuantity(quantity:number){const next={...basket,quantity};setBasket(next);localStorage.setItem("crowdloop-basket",JSON.stringify(next));}
  function applyPromo(){if(promo.trim().toUpperCase()==="NEXT10"){setDiscount(Math.round(subtotal*.1));setPromoMessage("NEXT10 applied — 10% off tickets.");}else{setDiscount(0);setPromoMessage("That code isn’t valid. Try NEXT10 for this demo.");}}
  function submitOrder(event:FormEvent<HTMLFormElement>){event.preventDefault();const data=new FormData(event.currentTarget);const card=String(data.get("card")||"").replace(/\s/g,"");if(card.length<16){setError("Check the card number and try again.");return;}setError("");localStorage.removeItem("crowdloop-basket");setComplete(true);window.scrollTo({top:0,behavior:"smooth"});}

  return <main className="checkout-page" id="top"><div className="checkout-top"><a href={`/events/${basket.slug}`}>← Back to event</a><span>Secure checkout</span><small>Basket reserved for 05:00</small></div>{complete?<section className="order-success"><span>✓</span><p className="eyebrow">Order confirmed · NXT-{Date.now().toString().slice(-6)}</p><h1>You’re going.</h1><p>Your {basket.title} {basket.quantity===1?"ticket is":"tickets are"} ready in My tickets. A confirmation has been sent to your email.</p><a href="/my-tickets">Open my tickets →</a></section>:<form className="checkout-layout" onSubmit={submitOrder}><div className="checkout-form"><p className="eyebrow">{basket.title}</p><h1>Complete your order</h1><div className="checkout-step"><span>1</span><div><h2>Your tickets</h2><div className="checkout-ticket"><p><strong>{basket.tier}</strong><small>{basket.date} · Mobile ticket</small></p><select value={basket.quantity} onChange={e=>updateQuantity(Number(e.target.value))} aria-label="Quantity"><option>1</option><option>2</option><option>3</option><option>4</option></select></div><button type="button" className="promo-toggle" onClick={()=>setPromoOpen(!promoOpen)}>Have a promo code? +</button>{promoOpen&&<><label className="promo-entry"><input value={promo} onChange={e=>setPromo(e.target.value)} placeholder="Enter code"/><button type="button" onClick={applyPromo}>Apply</button></label>{promoMessage&&<p className={discount?"promo-message success":"promo-message"}>{promoMessage}</p>}</>}</div></div><div className="checkout-step"><span>2</span><div><h2>Your details</h2><div className="field-row"><label>First name<input name="firstName" required autoComplete="given-name" placeholder="Alex"/></label><label>Last name<input name="lastName" required autoComplete="family-name" placeholder="Taylor"/></label></div><label>Email address<input name="email" required type="email" autoComplete="email" placeholder="alex@example.com"/></label><label className="check"><input type="checkbox"/> Send event updates and practical information</label></div></div><div className="checkout-step"><span>3</span><div><h2>Payment</h2><label>Card number<input name="card" required inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" maxLength={19}/></label><div className="field-row"><label>Expiry<input name="expiry" required autoComplete="cc-exp" placeholder="MM / YY"/></label><label>Security code<input name="cvc" required inputMode="numeric" autoComplete="cc-csc" placeholder="CVC" maxLength={4}/></label></div><label className="check"><input type="checkbox"/> Save payment method securely for next time</label>{error&&<p className="checkout-error" role="alert">{error}</p>}</div></div></div><aside className="order-summary"><img src={basket.image} alt=""/><h2>{basket.title}</h2><p>{basket.date}<br/>{basket.venue}</p><div><span>{basket.quantity} × {basket.tier}</span><b>£{subtotal}.00</b><span>Booking fee</span><b>£{fee}.00</b>{discount>0&&<><span>Promo discount</span><b>−£{discount}.00</b></>}<strong>Total</strong><strong>£{total}.00</strong></div><button type="submit">Pay securely · £{total}.00</button><small>Encrypted payment · Clear pricing · Buyer protection</small></aside></form>}</main>;
}
