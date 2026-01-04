//___requiring essential packages____
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

// _______OTHERS_______
const { limiter } = require("./config/limiters");
const Url =
  process.env.NODE_ENV === "devlopement" ? "http://localhost:5173" : "";

// requiring Routes
const userRoutes = require("./routes/main/user.routes");
const projectRoutes = require("./routes/main/project.routes");

// requiring Middlewares
const { UserIsLoggedIn } = require("./middlewares/UserAuth.middleware");

//_______Middlewares_______
app.use(express.json());
app.use(cookieParser());
app.use(limiter);
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin == Url) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

//_______routes_______
app.use("/api/user", userRoutes);
app.use("/api/project", UserIsLoggedIn, projectRoutes);

module.exports = app;
