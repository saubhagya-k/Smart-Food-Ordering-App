const path = require('path');
const dotenv = require('dotenv');
// Load KYC/.env no matter which folder the server is started from
// (plain dotenv.config() reads .env from the current folder instead).
dotenv.config({ path: path.join(__dirname, '.env') });

const missingEnv = ['MONGO_URI', 'JWT_SECRET'].filter((key) => !process.env[key]);
if (missingEnv.length) {
  console.error(`Missing ${missingEnv.join(', ')} in ${path.join(__dirname, '.env')}`);
  process.exit(1);
}

const express = require('express');

const cors = require("cors");
// CLIENT_URL = the frontend address(es) allowed to call this server,
// comma-separated, e.g. https://smart-food-ordering-app-lake.vercel.app
// It must be a real address, not "*": the browser refuses "*" for requests
// that send the login cookie. Without it, allow the local dev ports.
const allowedOrigin = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter((url) => url && url !== "*");
if (allowedOrigin.length === 0) {
  allowedOrigin.push("http://localhost:3001", "http://localhost:1234");
}



const app = express();
const morgan = require("morgan");
app.use(morgan('dev'));


app.use(
  cors({
    origin: allowedOrigin,
   
   
    credentials: true,
  })
);

const cookieParser = require('cookie-parser')


// app.set("view engine",'ejs');

app.use(cookieParser());


const connecttoDb = require("./config/db")

connecttoDb();

//proxi
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use(
  createProxyMiddleware({
    pathFilter: '/api/swiggy',         // intercepts URLs that start with /api/swiggy
    target: 'https://www.swiggy.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api/swiggy': '',             // removes the /api/swiggy prefix before forwarding
    },
    logger: console,                  // optional, helps debugging
  })
);




const confirmRoutes = require("./routes/confirm-routes");
const indexRoutes = require("./routes/index-routes");
const reviewRoutes = require('./routes/reviews-routes');






app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.use("/", confirmRoutes);
app.use("/", indexRoutes);
app.use('/api', reviewRoutes);











const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});