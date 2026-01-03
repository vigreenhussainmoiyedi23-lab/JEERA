//___requiring essential packages____
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
require("dotenv").config()

// requiring Routes
const userRoutes=require("./routes/user.routes");
const { limiter } = require("./config/limiters");


// requiring Middlewares
const devlopementUrls=["http://localhost:5173","http://localhost:5174/"]

//_______Middlewares_______
app.use(express.json());
app.use(cookieParser());
app.use(limiter);
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || [ ...devlopementUrls].includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

//_______routes_______
app.use("/api/user",userRoutes)
module.exports = app;
