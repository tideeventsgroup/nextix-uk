import { getEvents } from "../../lib/data";
import { EventsPageClient } from "./events-client";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsPageClient events={events} />;
}
