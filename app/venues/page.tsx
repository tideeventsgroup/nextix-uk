import { getVenues } from "../../lib/data";
import { VenuesClient } from "./venues-client";

export const dynamic = "force-dynamic";

export default async function Venues() {
  const venues = await getVenues();
  return <VenuesClient venues={venues} />;
}
