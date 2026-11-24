import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import Home from "./Components/Home";
import Restaurent from "./Components/Restaurent";
import RestaurentMenu from "./Components/RestaurentMenu";
import SearchFood from "./Components/SearchFood";
// import Header from "./Components/Header";
import LoginModal from "./Components/LoginModal"
import Profile from "./Components/Profile"
import SecondHeader from "./Components/SecondHeader";
import CartPopup from "./Components/CartPopup"
import Checkout from "./Components/Checkout"
import PaymentPage from "./Components/PaymentPage";

import OrderSuccess from "./Components/OrderSuccess";
import { API_URL } from './../Utils/api';

// "Continue as guest" lets visitors browse this long before the login
// pop-up comes back. Stored in the browser so a page refresh keeps it.
const GUEST_MINUTES = 15;
const GUEST_KEY = "guestUntil";

function readGuestUntil() {
  try {
    return Number(localStorage.getItem(GUEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

async function fetchCurrentUser() {
  try {
    const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}




function App() {

  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  console.log(cartItems)


  const [guestExpired, setGuestExpired] = useState(false);
  const guestTimer = useRef(null);

  // When the guest time runs out, ask to log in again (unless they did)
  function scheduleGuestEnd(ms) {
    clearTimeout(guestTimer.current);
    guestTimer.current = setTimeout(async () => {
      const current = await fetchCurrentUser();
      if (current) {
        setUser(current);
        return;
      }
      setGuestExpired(true);
      setShowLogin(true);
    }, ms);
  }

  function startGuest() {
    const ms = GUEST_MINUTES * 60 * 1000;
    try {
      localStorage.setItem(GUEST_KEY, String(Date.now() + ms));
    } catch {
      // storage blocked (private mode): guest time just won't survive a refresh
    }
    setGuestExpired(false);
    setShowLogin(false);
    scheduleGuestEnd(ms);
  }

  async function handleLoggedIn() {
    setUser(await fetchCurrentUser());
    setShowLogin(false);
    setGuestExpired(false);
    clearTimeout(guestTimer.current);
    try {
      localStorage.removeItem(GUEST_KEY);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    const timer = setTimeout(async () => {
      const current = await fetchCurrentUser();
      if (current) {
        setUser(current);
        return;
      }
      setUser(null);
      const guestLeft = readGuestUntil() - Date.now();
      if (guestLeft > 0) {
        scheduleGuestEnd(guestLeft); // still inside the guest window
      } else {
        setShowLogin(true);
      }
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearTimeout(guestTimer.current);
    };
  }, []);



  return (

    <>

    
    <BrowserRouter>

   
      {/* <Header
        user={user}
        setUser={setUser}
        setShowLogin={setShowLogin}
      /> */}

     
      <LoginModal
        show={showLogin}
        onLoggedIn={handleLoggedIn}
        onGuest={startGuest}
        guestMinutes={GUEST_MINUTES}
        guestExpired={guestExpired}
      />

      <Routes>
        <Route path="/" element={<Home user={user}
        setUser={setUser}
        setShowLogin={setShowLogin}/>} />

        <Route element={<SecondHeader cartCount = {cartCount}/>}>
        <Route path="/restaurent" element={<Restaurent/>} />
       
        <Route path="/city/chennai/:id" element={<RestaurentMenu setCartCount={setCartCount} cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/city/chennai/:id/search" element={<SearchFood />} />

        </Route>


         <Route path="/profile" element={<Profile user={user}
        setUser={setUser}
        setShowLogin={setShowLogin}/>}/>


        <Route path="/checkout" element={<Checkout cartItems={cartItems} />} />

        <Route path="/payment" element={<PaymentPage />} />

       <Route path="/order-success" element={<OrderSuccess />} />
        
      </Routes>
      {/* {cartItems.length > 0 && ( */}
      
  <CartPopup cartItems={cartItems} />

  
  

{/* )} */}
    </BrowserRouter>


    



    </>

    
    
  );
  
}


export default App;
