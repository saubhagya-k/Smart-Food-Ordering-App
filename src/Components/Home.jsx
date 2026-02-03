import React from 'react'
import Header from './Header'
import FoodOption from './FoodOption'
import Dinein from './Dinein'



export default function Home({user,setUser,setShowLogin}){

    return(
        <>
        <Header user={user}
        setUser={setUser}
        setShowLogin={setShowLogin}/>
       
          <FoodOption></FoodOption>
          <Dinein></Dinein>
        </>
    )

}