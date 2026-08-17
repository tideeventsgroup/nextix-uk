import { getEvents } from "../lib/data";
import { HomeClient } from "./home-client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const events = await getEvents();
  return <HomeClient events={events} />;
}
