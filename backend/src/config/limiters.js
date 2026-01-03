const rateLimit = require("express-rate-limit");
// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per  minute
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers

});
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res, next, options) => {
    const retryAfter = Math.ceil(options.windowMs / 1000); // seconds
    console.warn(
      `⚠️ Rate limit exceeded for IP: ${req.ip}. Try again after ${retryAfter}s`
    );

    res.status(429).json({
      message: `Too many attempts. Please wait ${retryAfter} seconds and try again.`,
    });
  },

});

module.exports = { limiter, authLimiter };
