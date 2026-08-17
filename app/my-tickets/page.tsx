import { headers } from "next/headers";
import { auth } from "../../lib/auth";
import { getTicketsForUser } from "../../lib/data";
import { MyTicketsClient } from "./my-tickets-client";

export const dynamic = "force-dynamic";

export default async function MyTickets() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return <main className="inner-page ticket-wallet" id="top">
      <section className="wallet-heading">
        <div><p className="eyebrow">Your Crowdloop wallet</p><h1>My tickets</h1><p>Everything you need for event day, available in one secure place.</p></div>
      </section>
      <section className="saved-empty"><h2>Sign in to see your tickets.</h2><p>Your orders and tickets are tied to your Crowdloop account.</p><a href="/account">Sign in →</a></section>
    </main>;
  }

  const tickets = await getTicketsForUser(session.user.id);
  const upcoming = tickets.filter((t) => t.isUpcoming);
  const past = tickets.filter((t) => !t.isUpcoming);

  return <MyTicketsClient upcoming={upcoming} past={past} />;
}
