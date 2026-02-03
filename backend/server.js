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







// app.get("/api/menu/:id", async (req, res) => {
//   const { id } = req.params;

//   const url = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=13.08950&lng=80.27390&restaurantId=${id}&catalog_qa=undefined&submitAction=ENTER`;

//   try {
//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         "accept": "*/*",
//   "accept-encoding": "gzip, deflate, br, zstd",
//   "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7,ta;q=0.6",
//   "content-type": "application/json",
//   "cookie": "__SW=jxaOWaZicfkVVl5JiHLpblJdasvCgDx-; _device_id=af00a960-5e0e-f206-8c3a-63d5531fd2c7; _swuid=af00a960-5e0e-f206-8c3a-63d5531fd2c7; _ga_X3K3CELKLV=GS1.1.1740072876.2.0.1740072876.0.0.0; userLocation={%22lat%22:%2213.08950%22%2C%22lng%22:%2280.27390%22%2C%22address%22:%22%22%2C%22area%22:%22%22%2C%22showUserDefaultAddressHint%22:false}; _guest_tid=57664585-44a2-490a-96d4-6f65951fdb07; _sid=md0b8772-6827-4d5f-879c-a412e6ca1cdf; fontsLoaded=1; _gcl_au=1.1.875504210.1755501698; _gid=GA1.2.2093200174.1755501699; _ga=GA1.2.539365726.1740068607; _gat_0=1; _ga_YE38MFJRBZ=GS2.1.s1755501698$o1$g1$t1755504316$j60$l0$h0; _ga_34JYJ0BCRN=GS2.1.s1755501698$o4$g1$t1755504316$j60$l0$h0",
//   "platform": "dweb",
//   "referer": "https://www.swiggy.com/city/chennai/pizza-hut-anna-salai-triplicane-rest806891",
//   "sec-ch-ua": `"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"`,
//   "sec-ch-ua-mobile": "?0",
//   "sec-ch-ua-platform": `"macOS"`,
//   "sec-fetch-dest": "empty",
//   "sec-fetch-mode": "cors",
//   "sec-fetch-site": "same-origin",
//   "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
       
//       },
//     });

//     const data = await response.json();

//     console.log(data);
//     res.json(data);

    
//   } catch (err) {
//     console.error("Error fetching Swiggy API:", err);
//     res.status(500).json({ error: "Failed to fetch data" });
//   }
// });