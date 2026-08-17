export type EventRecord = {
  slug: string;
  title: string;
  category: string;
  detailCategory: string;
  day: string;
  dateNum: string;
  month: string;
  dateLabel: string;
  time: string;
  isoStart: string;
  isoEnd: string;
  venue: string;
  city: string;
  address: string;
  price: number;
  status: string;
  image: string;
  intro: string;
  schedule: [string, string][];
  organiser: string;
  runningTime: string;
  ageGuidance: [string, string];
  generalAvailability: string;
};

export function mapLink(event: Pick<EventRecord, "address">) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`;
}

export function calendarLink(event: Pick<EventRecord, "title" | "isoStart" | "isoEnd" | "venue" | "city" | "intro">) {
  const start = new Date(event.isoStart).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = new Date(event.isoEnd).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    location: `${event.venue}, ${event.city}`,
    details: `${event.intro} Booked via Crowdloop.`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
