// import { useState, useEffect } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import LoginModal from "./Components/LoginModal";

// function Root() {
//   const [showLogin, setShowLogin] = useState(false);

//   useEffect(() => {
//     console.log("ROOT MOUNTED");

//     const timer = setTimeout(() => {
//       console.log("TIMER FIRED");

//       fetch("/auth/me", { credentials: "include" })
//   .then((res) => res.json())
//   .then((data) => {
//     if (!data.loggedIn) {
//       setShowLogin(true);
//     }
//   })
//   .catch(() => setShowLogin(true));

        
//     }, 10000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       <LoginModal show={showLogin} onClose={() => setShowLogin(false)} />
//       <App />
//     </>
//   );
// }

const root = createRoot(document.getElementById("root"));
root.render(<App />);
