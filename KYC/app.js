const express = require('express');

const cors = require("cors");
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:3001";



const app = express();
const morgan = require("morgan");
app.use(morgan('dev'));


app.use(
  cors({
    origin: allowedOrigin,
   
   
    credentials: true,
  })
);

const dotenv = require('dotenv');

const cookieParser = require('cookie-parser')


// app.set("view engine",'ejs');

app.use(cookieParser());


dotenv.config()

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