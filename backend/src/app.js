//___requiring essential packages____
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

// _______OTHERS_______
const { limiter } = require("./config/limiters");

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
// requiring Routes
const userRoutes = require("./routes/main/user.routes");
const taskRoutes = require("./routes/task/task.routes");
const commentRoutes = require("./routes/main/comment.routes");
const projectRoutes = require("./routes/main/project.routes");
const postRoutes=require("./routes/main/post.routes")
// requiring Middlewares
const { UserIsLoggedIn } = require("./middlewares/UserAuth.middleware");

//_______Middlewares_______

app.use(cookieParser());
app.use(limiter);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://accounts.google.com"],
      frameSrc: ["https://accounts.google.com"],
    },
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// routes using multipart form
app.use("/api/post",UserIsLoggedIn,postRoutes) 
//_______routes_______
app.use("/api/user", userRoutes);
app.use("/api/project", UserIsLoggedIn, projectRoutes);
app.use("/api/task", UserIsLoggedIn, taskRoutes);
app.use("/api/comment", UserIsLoggedIn, commentRoutes);
module.exports = app;
