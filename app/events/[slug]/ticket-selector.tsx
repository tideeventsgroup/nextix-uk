"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Props = { slug: string; title: string; date: string; venue: string; image: string; price: number; organiser: string; availability: string };

export function TicketSelector({ slug, title, date, venue, image, price, organiser, availability }: Props) {
  const router = useRouter();
  const [tier, setTier] = useState<"General admission" | "Priority entry">("General admission");
  const [quantity, setQuantity] = useState(1);
  const unitPrice = tier === "Priority entry" ? price + 14 : price;
  const total = useMemo(() => unitPrice * quantity, [unitPrice, quantity]);

  function continueToCheckout() {
    localStorage.setItem("crowdloop-basket", JSON.stringify({ slug, title, date, venue, image, tier, quantity, unitPrice }));
    router.push("/checkout");
  }

  return <>
    <aside className="buy-card" id="buy-card">
      <p className="eyebrow">Tickets on sale</p><h2>Choose tickets</h2>
      <button className={tier === "General admission" ? "ticket-tier selected" : "ticket-tier"} onClick={() => setTier("General admission")}><span><strong>General admission</strong><small>Mobile ticket · {availability}</small></span><b>£{price}</b></button>
      <button className={tier === "Priority entry" ? "ticket-tier selected" : "ticket-tier"} onClick={() => setTier("Priority entry")}><span><strong>Priority entry</strong><small>Early entrance lane · mobile ticket</small></span><b>£{price + 14}</b></button>
      <label>Quantity<select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}><option>1</option><option>2</option><option>3</option><option>4</option></select></label>
      <button className="buy-button" onClick={continueToCheckout}>Add to basket · £{total}.00 <span>↗</span></button><small>Booking fees shown before payment</small>
      <div className="organiser-mini"><span>{organiser.charAt(0)}</span><p><small>Organised by</small><strong>{organiser}</strong></p></div>
    </aside>
    <div className="mobile-buy-bar"><div><small>From</small><strong>£{price}</strong></div><button onClick={() => document.getElementById("buy-card")?.scrollIntoView({ behavior: "smooth", block: "start" })}>Choose tickets</button></div>
  </>;
}
