//___requiring essential packages____
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

// _______OTHERS_______
const { limiter } = require("./config/limiters");

const allowedOrigins = (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "developement") 
  ? ["http://localhost:5173", "http://127.0.0.1:5173"] 
  : process.env.FRONTEND_URL 
    ? [process.env.FRONTEND_URL] 
    : [];


// requiring Routes
const userRoutes = require("./routes/main/user.routes");
const taskRoutes = require("./routes/task/task.routes");
const commentRoutes = require("./routes/main/comment.routes");
const projectRoutes = require("./routes/main/project.routes");
const postRoutes = require("./routes/main/post.routes")
const analyticsRoutes = require("./routes/analytics.routes")
const profileUploadRoutes = require("./routes/user/profileUpload.routes")
const notificationRoutes = require("./routes/notification.routes")
const projectInviteRoutes = require("./routes/projectInvite.routes")
const healthRoutes = require("./routes/health.routes")
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
    crossOriginOpenerPolicy: false, // disable strict COOP
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }

    console.log(origin,allowedOrigins)

      // Check if origin is allowed
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // In development, be more permissive
        if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "developement") {
          console.warn("⚠️ CORS: Allowing origin in development:", origin);
          callback(null, true);
        } else {
          console.error("❌ CORS: Origin not allowed:", origin);
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// routes using multipart form
app.use("/api/post", UserIsLoggedIn, postRoutes)
app.use("/api/analytics", UserIsLoggedIn, analyticsRoutes)
app.use("/api/user/profile", UserIsLoggedIn, profileUploadRoutes)
app.use("/api/notifications", UserIsLoggedIn, notificationRoutes)
app.use("/api/project-invite", UserIsLoggedIn, projectInviteRoutes)
//_______routes_______
// Health check route (no authentication required)
app.use("/api/health", healthRoutes);
app.use("/api/user", userRoutes);
app.use("/api/project", UserIsLoggedIn, projectRoutes);
app.use("/api/task", UserIsLoggedIn, taskRoutes);
app.use("/api/comment", UserIsLoggedIn, commentRoutes);
module.exports = app;
