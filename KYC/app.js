const express = require('express');

const cors = require("cors");



const app = express();
const morgan = require("morgan");
app.use(morgan('dev'));


app.use(
  cors({
    origin: "http://localhost:1234",
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




const confirmRoutes = require("./routes/confirm-routes");
const indexRoutes = require("./routes/index-routes");






app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.use("/", confirmRoutes);
app.use("/", indexRoutes);











app.listen(8080, () => {
  console.log("Server running on port 8080");
});