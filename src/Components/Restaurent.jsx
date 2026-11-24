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
  const [RestData, setRestData] = useState([]);        // live restaurants from Swiggy
  const [RestDataTop, setRestDataTop] = useState([]);  // "What's on your mind?" row
  const [liveStatus, setLiveStatus] = useState("loading"); // "loading" | "done" | "failed"
  const [pagesLoaded, setPagesLoaded] = useState(1);   // how many saved pages are shown
  const loaderRef = useRef(null);

  const hasMore = pagesLoaded < PAGES.length;

  // Live list from Swiggy (through our backend). If Swiggy refuses, we still
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
      <h1 className="h-full text-2xl md:text-5xl flex justify-center items-center mt-32 md:mt-60 px-4 text-center">
        Data is Loading....
      </h1>
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

  // Use the saved food categories if Swiggy didn't send any
  const topCards = RestDataTop.length ? RestDataTop : imageGridCards;

  return (
    <>
      {/* Top Banner Row */}
      <h1 className="max-w-7xl mx-auto px-4 font-bold text-xl md:text-2xl mt-5">
        What's on your mind?
      </h1>

      <div className="flex overflow-x-auto gap-4 md:gap-6 max-w-7xl mx-auto px-4 scrollbar-hide">
        {topCards.map((restInfoTop) => (
          <div key={restInfoTop.id} className="shrink-0">
            <RestCardTop restInfoTop={restInfoTop} />
          </div>
        ))}
      </div>

      {/* Restaurant Grid */}
      <h1 className="max-w-7xl mx-auto px-4 font-bold text-xl md:text-2xl mt-10 md:mt-20">
        Restaurants with online food delivery in Patna
      </h1>

      {/* 1 column on phones, more as the screen widens */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
          {allRestaurants.map(restInfo => (
            <RestCard key={restInfo.info.id} restInfo={restInfo} />
          ))}
        </div>
      </div>

      {/* Infinite Scroll Anchor Trigger */}
      <div ref={loaderRef} className="h-20 flex justify-center items-center mt-10 text-gray-500">
        {hasMore ? "Loading more restaurants..." : `That's all ${allRestaurants.length} restaurants`}
      </div>
    </>
  );
}
