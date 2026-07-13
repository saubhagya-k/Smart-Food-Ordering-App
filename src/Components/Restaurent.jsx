import React, { useEffect, useState, useRef } from 'react';
import RestCard from './RestCard';  
import RestCardTop from './RestCardTop';   
import { mockPagination } from '../../Utils/mockPagination';

export default function Restaurent() {
  const [RestData, setRestData] = useState([]);
  const [restaurants, setRestaurants] = useState([]);             // List shown on UI
  const [page, setPage] = useState(0);                            // Start exactly at index 0 

  const [RestDataTop, setRestDataTop] = useState([]);
  const loaderRef = useRef(null);

  // 1. CRUCIAL FIX: Initialize with index 0 data immediately when component mounts
  useEffect(() => {
    if (mockPagination && mockPagination.length > 0) {
      setRestaurants(mockPagination[0].restaurants || []);
    }
  }, []);

  // 2. CRUCIAL FIX: Append data when scrolling changes the page index
  useEffect(() => {
    // Skip if it's the very first page because we already loaded it above
    if (page === 0) return; 

    const pageData = mockPagination[page];
    if (!pageData?.restaurants) return;

    // Append new batch cleanly to existing list
    setRestaurants(prev => [...prev, ...pageData.restaurants]);
  }, [page]);

  // 3. Infinite scrolling intersection observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          // Move to the next index in our mock list
          setPage(prev =>
            prev < mockPagination.length - 1 ? prev + 1 : prev
          );
        }
      },
      { rootMargin: "200px" } // Triggers 200px before reaching the bottom
    );

    const node = loaderRef.current;
    if (node) observer.observe(node);

    return () => observer.disconnect();
  }, []);

  // ... rest of your fetchData useEffect remains exactly the same


  // 🛠️ FIX: Wrapped fetchData inside a proper useEffect hook so it actually fires!
  useEffect(() => {
    async function fetchData() {
      const localProxyAPI =
        "http://localhost:8080/api/swiggy/dapi/restaurants/list/v5?lat=25.5943&lng=85.1352&is-seo-homepage-enabled=true";

      try {
        const response = await fetch(localProxyAPI);  
        const data = await response.json();

        // Safely map the Swiggy API payload cards
        const targetCard = data?.data?.cards?.find(
          (c) => c?.card?.card?.gridElements?.infoWithStyle?.restaurants
        );
        const topBannerCard = data?.data?.cards?.find(
          (c) => c?.card?.card?.imageGridCards?.info
        );

        setRestData(targetCard?.card?.card?.gridElements?.infoWithStyle?.restaurants || []);
        setRestDataTop(topBannerCard?.card?.card?.imageGridCards?.info || []);

      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    fetchData();
  }, []); // Fires exactly once when the component mounts

  // 4. Loading State Check
  if (!RestData || RestData.length === 0 || !RestDataTop || RestDataTop.length === 0) {
    return (
      <h1 className="h-full text-5xl flex justify-center items-center mt-60">
        Data is Loading....
      </h1>
    );
  }

  // 5. Combine and remove duplicates by restaurant ID
  const allRestaurants = Array.from(
    new Map(
      [...RestData, ...restaurants]
        .filter(r => r?.info?.id)
        .map(r => [r.info.id, r])
    ).values()
  );

  return (
    <>
      {/* Top Banner Row */}
      <h1 className="mx-auto max-w-[80%] font-bold text-2xl mt-5 mr-28">
        What's on your mind?
      </h1>
      
      <div className="flex overflow-x-auto gap-6 max-w-[80%] mx-auto scrollbar-hide">
        {RestDataTop.map((restInfoTop) => (
          <div key={restInfoTop.id} className="shrink-0">
            <RestCardTop restInfoTop={restInfoTop} />
          </div>
        ))}
      </div>
      
      {/* Restaurant Grid */}
      <h1 className="mx-auto max-w-[80%] font-bold text-2xl mt-20 mr-28">
        Restaurants with online food delivery in Chennai
      </h1>

      <div className="w-[80%] container mx-auto">
        <div className="flex flex-wrap gap-10 justify-center">
          {allRestaurants.map(restInfo => (
            <RestCard key={restInfo.info.id} restInfo={restInfo} />
          ))}
        </div>
      </div>

      {/* Infinite Scroll Anchor Trigger */}
      <div ref={loaderRef} className="h-20 flex justify-center items-center mt-10">
        {page < mockPagination.length - 1 
          ? "Loading more restaurants..."
          : "No more restaurants"}
      </div>
    </>
  );
}
