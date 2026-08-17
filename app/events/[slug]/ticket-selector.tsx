"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Tier = { id: string; name: string; price: number; description: string };
type Props = { slug: string; title: string; date: string; venue: string; image: string; tiers: Tier[]; organiser: string };

export function TicketSelector({ slug, title, date, venue, image, tiers, organiser }: Props) {
  const router = useRouter();
  const [tierIndex, setTierIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const tier = tiers[tierIndex];
  const total = useMemo(() => (tier ? tier.price * quantity : 0), [tier, quantity]);

  function continueToCheckout() {
    if (!tier) return;
    localStorage.setItem("crowdloop-basket", JSON.stringify({ slug, title, date, venue, image, tier: tier.name, quantity, unitPrice: tier.price }));
    router.push("/checkout");
  }

  if (!tier) return null;

  return <>
    <aside className="buy-card" id="buy-card">
      <p className="eyebrow">Tickets on sale</p><h2>Choose tickets</h2>
      {tiers.map((item, index) => (
        <button key={item.id} className={index === tierIndex ? "ticket-tier selected" : "ticket-tier"} onClick={() => setTierIndex(index)}>
          <span><strong>{item.name}</strong><small>{item.description}</small></span><b>£{item.price}</b>
        </button>
      ))}
      <label>Quantity<select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}><option>1</option><option>2</option><option>3</option><option>4</option></select></label>
      <button className="buy-button" onClick={continueToCheckout}>Add to basket · £{total}.00 <span>↗</span></button><small>Booking fees shown before payment</small>
      <div className="organiser-mini"><span>{organiser.charAt(0)}</span><p><small>Organised by</small><strong>{organiser}</strong></p></div>
    </aside>
    <div className="mobile-buy-bar"><div><small>From</small><strong>£{tiers[0].price}</strong></div><button onClick={() => document.getElementById("buy-card")?.scrollIntoView({ behavior: "smooth", block: "start" })}>Choose tickets</button></div>
  </>;
}
