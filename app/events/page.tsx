"use client";

import { useEffect, useMemo, useState } from "react";

const events = [
  {title:"North Coast Sessions",category:"Music",date:"12",day:"Fri",month:"SEP",city:"Ayr",venue:"Low Green",price:32,status:"Selling fast",image:"https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=85",slug:"north-coast-sessions"},
  {title:"Field & Flame Festival",category:"Food & drink",date:"20",day:"Sat",month:"SEP",city:"Glasgow",venue:"SWG3 Yard",price:18,status:"Good availability",image:"https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85",slug:"field-and-flame-festival"},
  {title:"A Midsummer Night’s Dream",category:"Theatre",date:"24",day:"Wed",month:"SEP",city:"Edinburgh",venue:"Assembly Rooms",price:24,status:"Last few",image:"https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=85",slug:"a-midsummer-nights-dream"},
  {title:"Little Explorers Live",category:"Family",date:"03",day:"Fri",month:"OCT",city:"Dundee",venue:"Discovery Point",price:12,status:"Good availability",image:"https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&w=1200&q=85",slug:"little-explorers-live"},
  {title:"City 10K & Festival",category:"Sport",date:"11",day:"Sat",month:"OCT",city:"Stirling",venue:"Kings Park",price:20,status:"Entries open",image:"https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=85",slug:"city-10k-and-festival"},
  {title:"Afterlight Orchestra",category:"Music",date:"23",day:"Thu",month:"OCT",city:"Aberdeen",venue:"Music Hall",price:28,status:"Just announced",image:"https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=85",slug:"afterlight-orchestra"},
];
const categories=["All events","Music","Festivals","Theatre","Comedy","Family","Sport","Food & drink"];
const cityCoordinates:Record<string,[number,number]>={Ayr:[55.4586,-4.6292],Glasgow:[55.8642,-4.2518],Edinburgh:[55.9533,-3.1883],Dundee:[56.462,-2.9707],Stirling:[56.1165,-3.9369],Aberdeen:[57.1497,-2.0943]};

export default function EventsPage(){
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState("All events");
  const [city,setCity]=useState("All locations");
  const [locationLabel,setLocationLabel]=useState("");
  const [date,setDate]=useState("Any date");
  const [sort,setSort]=useState("Recommended");
  const [saved,setSaved]=useState<string[]>([]);
  const [filtersOpen,setFiltersOpen]=useState(false);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const incoming=params.get("q")||""; const location=params.get("location")||"";
    const lat=Number(params.get("lat")); const lon=Number(params.get("lon"));
    setQuery(incoming); setLocationLabel(location);
    if(location&&events.some(event=>event.city===location)) setCity(location);
    else if(Number.isFinite(lat)&&Number.isFinite(lon)&&params.has("lat")&&params.has("lon")){
      const nearest=Object.entries(cityCoordinates).sort(([,a],[,b])=>(a[0]-lat)**2+(a[1]-lon)**2-((b[0]-lat)**2+(b[1]-lon)**2))[0]?.[0];
      if(nearest)setCity(nearest);
    }
  },[]);

  const filtered=useMemo(()=>events.filter(event=>
    (category==="All events"||event.category===category)&&
    (city==="All locations"||event.city===city)&&
    (date==="Any date"||event.month===date)&&
    (`${event.title} ${event.category} ${event.city} ${event.venue}`.toLowerCase().includes(query.toLowerCase()))
  ).sort((a,b)=>sort==="Price: low to high"?a.price-b.price:sort==="Soonest"?Number(a.date)-Number(b.date):0),[query,category,city,date,sort]);

  const clearFilters=()=>{setCategory("All events");setCity("All locations");setLocationLabel("");setDate("Any date");setQuery("");};
  const activeCount=[category!=="All events",city!=="All locations",date!=="Any date",Boolean(query)].filter(Boolean).length;

  return <main className="find-events-page" id="top">
    <section className="find-intro">
      <div><p className="eyebrow">Discover something brilliant</p><h1>Find events</h1><p>Browse live music, festivals, theatre, family days out and more—all in one place.</p></div>
      <form className="find-page-search" onSubmit={event=>event.preventDefault()}><span aria-hidden="true">⌕</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search events, artists or venues" aria-label="Search events, artists or venues"/><button type="button" onClick={()=>setQuery("")} className={query?"visible":""}>Clear</button></form>
      {locationLabel&&<div className="location-context"><span>◎</span><div><small>Showing events nearest</small><strong>{locationLabel}</strong></div><button onClick={()=>{setCity("All locations");setLocationLabel("")}}>Remove</button></div>}
    </section>

    <nav className="event-category-rail" aria-label="Event types">{categories.map(item=><button key={item} className={category===item?"active":""} onClick={()=>setCategory(item)}>{item}</button>)}</nav>

    <section className="events-workspace">
      <aside className={filtersOpen?"event-filters open":"event-filters"}>
        <div className="filter-heading"><div><small>REFINE RESULTS</small><h2>Filters</h2></div><button onClick={()=>setFiltersOpen(false)}>×</button></div>
        <fieldset><legend>When</legend>{["Any date","SEP","OCT"].map(item=><label key={item}><input type="radio" name="date" checked={date===item} onChange={()=>setDate(item)}/><span>{item==="SEP"?"September":item==="OCT"?"October":item}</span></label>)}</fieldset>
        <fieldset><legend>Where</legend><select value={city} onChange={event=>{setCity(event.target.value);setLocationLabel("")}} aria-label="Filter by location"><option>All locations</option>{Object.keys(cityCoordinates).map(item=><option key={item}>{item}</option>)}</select><p>For venues, postcodes or places, use the location search in the header.</p></fieldset>
        <fieldset><legend>Price</legend><label><input type="checkbox"/><span>Under £20</span></label><label><input type="checkbox"/><span>£20–£35</span></label></fieldset>
        {activeCount>0&&<button className="clear-filters" onClick={clearFilters}>Clear all filters</button>}
      </aside>

      <div className="event-results">
        <div className="results-toolbar"><div><p>{filtered.length} {filtered.length===1?"event":"events"}</p><span>{city==="All locations"?"Across Scotland":`Near ${city}`}</span></div><div><button className="mobile-filter-button" onClick={()=>setFiltersOpen(true)}>Filters {activeCount>0&&<b>{activeCount}</b>}</button><label>Sort by <select value={sort} onChange={event=>setSort(event.target.value)}><option>Recommended</option><option>Soonest</option><option>Price: low to high</option></select></label></div></div>
        <div className="event-list">{filtered.map(event=><article className="result-card" key={event.slug}>
          <a className="result-image" href={`/events/${event.slug}`}><img src={event.image} alt=""/><span className={event.status==="Last few"||event.status==="Selling fast"?"urgent":""}>{event.status}</span></a>
          <div className="result-date"><small>{event.month}</small><strong>{event.date}</strong><span>{event.day}</span></div>
          <div className="result-copy"><p>{event.category}</p><h2><a href={`/events/${event.slug}`}>{event.title}</a></h2><span>{event.venue} · {event.city}</span><div><strong>From £{event.price}</strong><a href={`/events/${event.slug}`}>Tickets <span>→</span></a></div></div>
          <button className={saved.includes(event.slug)?"result-save saved":"result-save"} onClick={()=>setSaved(items=>items.includes(event.slug)?items.filter(item=>item!==event.slug):[...items,event.slug])} aria-label={`Save ${event.title}`}>{saved.includes(event.slug)?"♥":"♡"}</button>
        </article>)}</div>
        {!filtered.length&&<div className="no-results"><span>⌕</span><h2>No events found</h2><p>Try widening your location or clearing a filter.</p><button onClick={clearFilters}>Show all events</button></div>}
      </div>
    </section>
    {filtersOpen&&<button className="filter-scrim" onClick={()=>setFiltersOpen(false)} aria-label="Close filters"/>}
  </main>
}
