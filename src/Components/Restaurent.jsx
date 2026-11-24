import React, { useEffect, useState, useRef } from 'react';
import RestCard from './RestCard';
import RestCardTop from './RestCardTop';
import { mockPagination } from '../../Utils/mockPagination';
import { imageGridCards } from '../../Utils/foodata';
import { API_URL } from './../../Utils/api';

// Saved restaurant pages for infinite scroll. filter(Boolean) skips any empty
// slot, e.g. from a stray comma in the array ("},\n,\n{" leaves a hole).
const PAGES = mockPagination.filter((p) => p?.restaurants?.length);

export default function Restaurent() {
  const [RestData, setRestData] = useState([]);        // live restaurants from the API
  const [RestDataTop, setRestDataTop] = useState([]);  // "What's on your mind?" row
  const [liveStatus, setLiveStatus] = useState("loading"); // "loading" | "done" | "failed"
  const [pagesLoaded, setPagesLoaded] = useState(1);   // how many saved pages are shown
  const loaderRef = useRef(null);

  const hasMore = pagesLoaded < PAGES.length;

  // Live list (through our backend). If the source refuses, we still
  // show the saved pages instead of "loading" forever.
  useEffect(() => {
    async function fetchData() {
      const localProxyAPI = `${API_URL}/api/swiggy/dapi/restaurants/list/v5?lat=25.5943&lng=85.1352&is-seo-homepage-enabled=true`;

      try {
        const response = await fetch(localProxyAPI);
        const data = await response.json();

        const targetCard = data?.data?.cards?.find(
          (c) => c?.card?.card?.gridElements?.infoWithStyle?.restaurants
        );
        const topBannerCard = data?.data?.cards?.find(
          (c) => c?.card?.card?.imageGridCards?.info
        );

        setRestData(targetCard?.card?.card?.gridElements?.infoWithStyle?.restaurants || []);
        setRestDataTop(topBannerCard?.card?.card?.imageGridCards?.info || []);
        setLiveStatus("done");
      } catch (err) {
        console.warn("Error fetching data:", err);
        setLiveStatus("failed");
      }
    }

    fetchData();
  }, []);

  // Infinite scroll: when the "loading more" box at the bottom comes near the
  // screen, show the next saved page.
  //
  // This effect re-runs when the box first appears (liveStatus changes) and
  // after every page (pagesLoaded changes). That matters because:
  //  - on the first render the box isn't on the page yet (we show the loading
  //    message instead), so loaderRef.current is null and nothing is observed;
  //  - an IntersectionObserver only fires when visibility CHANGES. If the box
  //    is still on screen after a page is added, it never fires again.
  //    A fresh observer always reports once, so the next page loads.
  useEffect(() => {
    const node = loaderRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPagesLoaded((n) => Math.min(n + 1, PAGES.length));
        }
      },
      { rootMargin: "200px" } // start loading 200px before the bottom
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [liveStatus, pagesLoaded, hasMore]);

  if (liveStatus === "loading") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="mx-auto w-10 h-10 rounded-full border-4 border-paprika-100 border-t-paprika-600 animate-spin" />
        <p className="mt-4 text-stone-warm">Finding restaurants near you…</p>
      </div>
    );
  }

  // Live restaurants first, then the saved pages, without duplicates
  const savedRestaurants = PAGES.slice(0, pagesLoaded).flatMap((p) => p.restaurants);
  const allRestaurants = Array.from(
    new Map(
      [...RestData, ...savedRestaurants]
        .filter(r => r?.info?.id)
        .map(r => [r.info.id, r])
    ).values()
  );

  // Use the saved food categories if the API didn't send any
  const topCards = RestDataTop.length ? RestDataTop : imageGridCards;

  return (
    <>
      {/* Top Banner Row */}
      <section className="grain bg-cream border-b border-line">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-2">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-paprika-700">Browse by dish</p>
        <h1 className="mt-1 font-display text-3xl md:text-4xl text-ink">What's on your mind?</h1>
      </div>

      <div className="flex overflow-x-auto gap-4 md:gap-6 max-w-7xl mx-auto px-4 pb-6 scrollbar-hide">
        {topCards.map((restInfoTop) => (
          <div key={restInfoTop.id} className="shrink-0">
            <RestCardTop restInfoTop={restInfoTop} />
          </div>
        ))}
      </div>
      </section>

      {/* Restaurant Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-10 md:mt-12 mb-6">
        <h2 className="font-display text-3xl md:text-4xl text-ink">Restaurants in Patna</h2>
        <p className="mt-1 text-stone-warm">Delivery from kitchens near you</p>
      </div>

      {/* 1 column on phones, more as the screen widens */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
          {allRestaurants.map(restInfo => (
            <RestCard key={restInfo.info.id} restInfo={restInfo} />
          ))}
        </div>
      </div>

      {/* Infinite Scroll Anchor Trigger */}
      <div ref={loaderRef} className="h-20 flex justify-center items-center mt-10 text-stone-warm">
        {hasMore ? "Loading more restaurants..." : `That's all ${allRestaurants.length} restaurants`}
      </div>
    </>
  );
}
