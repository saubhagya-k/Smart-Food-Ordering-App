// server.js
const express = require("express");


const app = express();

const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000" }));




app.get("/api/restaurants",async (req,res)=>{
  const  url = "https://www.swiggy.com/dapi/restaurants/list/v5?lat=13.08950&lng=80.27390&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"

 
  try{
     const response = await fetch(url,{
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "application/json,text/html",
      },
      })

       if (!response.ok) {
      throw new Error(`Swiggy API failed: ${response.status}`);
    }
      const data = await response.json()
      res.json(data)

  }
  catch(err){
    console.error("Error fetching Swiggy API:", err);
    res.status(500).json({ error: "Failed to fetch data" });


  }
})

app.listen(8080, () =>
  console.log("✅ Server running at http://localhost:8080")
);
