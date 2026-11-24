import React from 'react'
import NavBar from './NavBar'
import Header from './Header'
import FoodOption from './FoodOption'
import Dinein from './Dinein'
import ReviewCarousel from './ReviewCarousel'
import Footer from './Footer'

export default function Home({ user, setUser, setShowLogin, cartCount }){
    return(
        <>
          <NavBar user={user} setUser={setUser} setShowLogin={setShowLogin} cartCount={cartCount} />
          <Header />
          <FoodOption />
          <Dinein />
          <ReviewCarousel />
          <Footer />
        </>
    )
}
