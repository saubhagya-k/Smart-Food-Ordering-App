// import React from 'react'



// import {useEffect, useState} from "react";
// import RestCard from './RestCard'     


// export default function Restaurent() {
//   const [RestData, setRestData] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       const response = await fetch("/api/restaurants");
//       const data = await response.json();

//       const restaurantCard = data.data.cards.find(
//         (card) =>
//           card.card &&
//           card.card.card &&
//           card.card.card.gridElements &&
//           card.card.card.gridElements.infoWithStyle &&
//           card.card.card.gridElements.infoWithStyle.restaurants
//       );

//       setRestData(restaurantCard?.card?.card?.gridElements?.infoWithStyle?.restaurants || []);
//     }

//     fetchData();
//   }, []);

//   if (!RestData || RestData.length === 0) {
//     return (
//       <h1 className="h-full text-5xl flex justify-center items-center">
//         Data is Loading....
//       </h1>
//     );
//   }

//   return (
//     <>
//       <h1 className="mx-auto max-w-[80%] font-bold text-2xl mt-50 mr-28">
//         Restaurants with online food delivery in Chennai
//       </h1>

//       <div className="w-[80%] container mx-auto">
//         <div className="flex flex-wrap gap-10 justify-center">
//           {RestData.map((restInfo) => (
//             <RestCard key={restInfo.info.id} restInfo={restInfo} />
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }




import React from 'react'



import {useEffect, useState} from "react";
import RestCard from './RestCard'  
import RestCardTop from './RestCardTop';   

import { useRef } from "react";

import {mockPagination} from '../../Utils/mockPagination';

export default function Restaurent() {
  const [RestData, setRestData] = useState([]);
  const [restaurants, setRestaurants] = useState([]);             // list shown on UI
  const [page, setPage] = useState(0);                           // which batch 

  const [RestDataTop, setRestDataTop ] = useState([]);



  

  const loaderRef = useRef(null);


  useEffect(() => {
  if (mockPagination.length > 0) {
    setRestaurants(mockPagination[0].restaurants);
    setPage(1); // next page will be loaded by observer
  }
}, []);

  

 useEffect(() => {
  if (page === 0) return;
 

  const pageData = mockPagination[page];
  if (!pageData?.restaurants) return;

  setRestaurants(prev => [...prev, ...pageData.restaurants]);
}, [page]);




useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prev =>
            prev < mockPagination.length - 1 ? prev + 1 : prev
          );
        }
      },
      { rootMargin: "200px" }
    );

    const node = loaderRef.current;
    if (node) observer.observe(node);

    return () => observer.disconnect();
  }, []);








  useEffect(() => {
  async function fetchData() {
    const proxyServer =
      "https://cors-anywhere.herokuapp.com/";
    const swiggyAPI =
      "https://www.swiggy.com/dapi/restaurants/list/v5?lat=25.5943&lng=85.1352&is-seo-homepage-enabled=true&";

    try {
      const response = await fetch(proxyServer + swiggyAPI);
      const data = await response.json();

      setRestData(
        data.data.cards[1].card.card.gridElements.infoWithStyle.restaurants
      );

      setRestDataTop(
         data.data.cards[0].card.card.imageGridCards.info
      );




    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }

  fetchData();
}, []);


  if (!RestData || RestData.length === 0  || !RestDataTop  || RestData.length ===0) {
    return (
      <h1 className="h-full text-5xl flex justify-center items-center mt-60">
        Data is Loading....
      </h1>
    );
  }

const allRestaurants = Array.from(
  new Map(
    [...RestData, ...restaurants]
      .filter(r => r?.info?.id)
      .map(r => [r.info.id, r])
  ).values()
);


  return (
    <>

      <h1 className="mx-auto max-w-[80%] font-bold text-2xl mt-5 mr-28">
        What's on your mind?
      </h1>
      

      <div className = "flex overflow-x-auto gap-6 max-w-[80%] mx-auto scrollbar-hide ">
     
        {RestDataTop.map((restInfoTop)=>(
             <div key={restInfoTop.id} className="shrink-0">
                          <RestCardTop restInfoTop={restInfoTop} />
          </div>
        ))}
      </div>
      



      <h1 className="mx-auto max-w-[80%] font-bold text-2xl mt-50 mr-28">
        Restaurants with online food delivery in Chennai
      </h1>

      <div className="w-[80%] container mx-auto">
  <div className="flex flex-wrap gap-10 justify-center">
  {allRestaurants.map(restInfo => (
  <RestCard
    key={restInfo.info.id}
    restInfo={restInfo}
  />
))}

  </div>
</div>





      <div ref={loaderRef} className="h-20 flex justify-center items-center">
  {page < mockPagination.length 
    ? "Loading more restaurants..."
    : "No more restaurants"}
</div>


  

    </>
    


    
  );
}