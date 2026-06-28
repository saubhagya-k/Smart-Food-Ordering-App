import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

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




function App() {

  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  console.log(cartItems)


  useEffect(() => {
  const timer = setTimeout(async () => {
    try {
      const res = await fetch("http://localhost:8080/auth/me", {
        credentials: "include",
      });

      if (!res.ok) {
        setShowLogin(true);
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data.user);       
      setShowLogin(false);
    } catch {
      setShowLogin(true);
      setUser(null);
    }
  }, 10000);

  return () => clearTimeout(timer);
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
        onClose={() => setShowLogin(false)}
        setUser={setUser}
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
