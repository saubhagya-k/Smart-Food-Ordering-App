import React from 'react'
import SecondAll from './SecondAll'
import { Outlet } from 'react-router-dom'

const SecondHeader = ({cartCount}) => {
  return (
    <div>

        <SecondAll cartCount={cartCount}/>
        <Outlet/>




      
    </div>
  )
}

export default SecondHeader
