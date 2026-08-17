import { getEvents } from "../../lib/data";
import { SavedClient } from "./saved-client";

export const dynamic = "force-dynamic";

export default async function Saved() {
  const events = await getEvents();
  return <SavedClient events={events} />;
}
