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

export const events: EventRecord[] = [
  {
    slug: "north-coast-sessions",
    title: "North Coast Sessions",
    category: "Music",
    detailCategory: "Music festival",
    day: "Sat",
    dateNum: "12",
    month: "SEP",
    dateLabel: "Saturday 12 September 2026",
    time: "12:00–23:00",
    isoStart: "2026-09-12T12:00:00+01:00",
    isoEnd: "2026-09-12T23:00:00+01:00",
    venue: "The Harbour Grounds",
    city: "Ayr",
    address: "The Harbour Grounds, Harbour Street, Ayr, KA7 1JA",
    price: 32,
    status: "Selling fast",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1800&q=90",
    intro: "A full day of exceptional live music beside the coast, bringing breakthrough artists and established favourites together across three stages.",
    schedule: [["12:00", "Gates open"], ["14:15", "Harbour Stage begins"], ["18:30", "Evening programme"], ["22:45", "Last performance"]],
    organiser: "Coastal Sessions Collective",
    runningTime: "Approx. 11 hours across three stages, come and go as you please",
    ageGuidance: ["16+ unless accompanied", "Under 16s must be accompanied by an adult"],
    generalAvailability: "Selling fast · mobile ticket",
  },
  {
    slug: "field-and-flame-festival",
    title: "Field & Flame Festival",
    category: "Food & drink",
    detailCategory: "Food & drink",
    day: "Sun",
    dateNum: "20",
    month: "SEP",
    dateLabel: "Sunday 20 September 2026",
    time: "11:00–20:00",
    isoStart: "2026-09-20T11:00:00+01:00",
    isoEnd: "2026-09-20T20:00:00+01:00",
    venue: "Kelvingrove Park",
    city: "Glasgow",
    address: "Kelvingrove Park, Sauchiehall Street entrance, Glasgow, G3 7RZ",
    price: 18,
    status: "Good availability",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1800&q=90",
    intro: "A generous celebration of Scotland’s independent kitchens, growers and makers—with open-fire cooking, tastings and live demonstrations.",
    schedule: [["11:00", "Festival opens"], ["12:30", "Chef’s table"], ["15:00", "Field kitchen demo"], ["19:30", "Last service"]],
    organiser: "Field & Flame Events",
    runningTime: "Approx. 9 hours, drop in for any part of the day",
    ageGuidance: ["All ages welcome", "Licensed bar areas are 18+ only"],
    generalAvailability: "Good availability · mobile ticket",
  },
  {
    slug: "a-midsummer-nights-dream",
    title: "A Midsummer Night’s Dream",
    category: "Theatre",
    detailCategory: "Theatre",
    day: "Thu",
    dateNum: "24",
    month: "SEP",
    dateLabel: "24–27 September 2026",
    time: "19:30",
    isoStart: "2026-09-24T19:30:00+01:00",
    isoEnd: "2026-09-24T22:05:00+01:00",
    venue: "Civic Theatre",
    city: "Edinburgh",
    address: "Civic Theatre, 13 Lothian Road, Edinburgh, EH1 2EP",
    price: 24,
    status: "Last few",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1800&q=90",
    intro: "A vivid, contemporary staging of Shakespeare’s most playful comedy—full of live music, restless magic and glorious confusion.",
    schedule: [["18:45", "Doors open"], ["19:30", "Act one"], ["20:35", "Interval"], ["22:05", "Performance ends"]],
    organiser: "Civic Theatre Productions",
    runningTime: "2 hours 20 minutes, including a 20-minute interval",
    ageGuidance: ["Recommended 8+", "Younger children may find the running time challenging"],
    generalAvailability: "Last few remaining · mobile ticket",
  },
  {
    slug: "little-explorers-live",
    title: "Little Explorers Live",
    category: "Family",
    detailCategory: "Family",
    day: "Sat",
    dateNum: "03",
    month: "OCT",
    dateLabel: "Saturday 3 October 2026",
    time: "10:30–16:00",
    isoStart: "2026-10-03T10:30:00+01:00",
    isoEnd: "2026-10-03T16:00:00+01:00",
    venue: "Discovery Centre",
    city: "Dundee",
    address: "Discovery Centre, Discovery Quay, Dundee, DD1 4XA",
    price: 12,
    status: "Good availability",
    image: "https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&w=1800&q=90",
    intro: "A hands-on day of science, creativity and discovery for curious young minds and their grown-ups.",
    schedule: [["10:30", "Doors open"], ["11:15", "Big science show"], ["13:30", "Maker workshop"], ["16:00", "Event closes"]],
    organiser: "Discovery Centre Learning Team",
    runningTime: "Approx. 5.5 hours, drop in for any part of the day",
    ageGuidance: ["All ages welcome", "Designed for ages 3–10, adults go free with a paying child"],
    generalAvailability: "Good availability · mobile ticket",
  },
  {
    slug: "city-10k-and-festival",
    title: "City 10K & Festival",
    category: "Sport",
    detailCategory: "Sport",
    day: "Sun",
    dateNum: "11",
    month: "OCT",
    dateLabel: "Sunday 11 October 2026",
    time: "08:30",
    isoStart: "2026-10-11T08:30:00+01:00",
    isoEnd: "2026-10-11T14:00:00+01:00",
    venue: "Riverside Park",
    city: "Stirling",
    address: "Riverside Park, Kings Park Road, Stirling, FK8 2QJ",
    price: 20,
    status: "Entries open",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1800&q=90",
    intro: "A fast, friendly city run followed by food, music and family activity beside the river. All abilities are welcome.",
    schedule: [["07:15", "Event village opens"], ["08:30", "10K start"], ["10:15", "Awards"], ["14:00", "Festival closes"]],
    organiser: "Stirling Road Runners",
    runningTime: "Run typically takes 45–90 minutes, festival continues afterwards",
    ageGuidance: ["All ages welcome", "Under 16s must run with a registered adult"],
    generalAvailability: "Entries open · mobile ticket",
  },
  {
    slug: "afterlight-orchestra",
    title: "Afterlight Orchestra",
    category: "Music",
    detailCategory: "Live music",
    day: "Fri",
    dateNum: "23",
    month: "OCT",
    dateLabel: "Friday 23 October 2026",
    time: "19:00",
    isoStart: "2026-10-23T19:00:00+01:00",
    isoEnd: "2026-10-23T22:30:00+01:00",
    venue: "The Assembly Rooms",
    city: "Aberdeen",
    address: "The Assembly Rooms, 34 Union Street, Aberdeen, AB11 5BN",
    price: 28,
    status: "Just announced",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1800&q=90",
    intro: "An immersive evening where a twelve-piece orchestra reshapes familiar music through strings, brass and cinematic light.",
    schedule: [["19:00", "Doors open"], ["20:00", "Performance begins"], ["21:00", "Interval"], ["22:30", "Performance ends"]],
    organiser: "The Assembly Sinfonia",
    runningTime: "Approx. 2.5 hours, including a 20-minute interval",
    ageGuidance: ["14+ recommended", "Under 14s admitted with an accompanying adult"],
    generalAvailability: "Just announced · mobile ticket",
  },
];

export function getEvent(slug: string) {
  return events.find((event) => event.slug === slug);
}

export function relatedEvents(slug: string, category: string, limit = 3) {
  return events.filter((event) => event.slug !== slug && event.category === category).slice(0, limit);
}

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
