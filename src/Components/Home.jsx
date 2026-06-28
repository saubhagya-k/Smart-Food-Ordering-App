import React from 'react'
import Header from './Header'
import FoodOption from './FoodOption'
import Dinein from './Dinein'

import ReviewCarousel from './ReviewCarousel'
// import RestaurantReviews from './RestaurantReviews';



export default function Home({user,setUser,setShowLogin}){

    return(
        <>
        <Header user={user}
        setUser={setUser}
        setShowLogin={setShowLogin}/>

         {/* <RestaurantReviews restaurantId="YOUR_RESTAURANT_ID" /> */}
       
          <FoodOption></FoodOption>
          <Dinein></Dinein>


          <ReviewCarousel/>


        </>
    )

}