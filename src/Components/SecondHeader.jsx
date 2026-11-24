import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

// Layout for every page except home: shared top bar + the page
const SecondHeader = ({ cartCount, user, setUser, setShowLogin }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar user={user} setUser={setUser} setShowLogin={setShowLogin} cartCount={cartCount} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default SecondHeader
