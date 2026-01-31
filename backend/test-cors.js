require("dotenv").config();
console.log("🔍 CORS Configuration Test");
console.log("================================");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

const isDevelopment = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "developement";
const allowedOrigins = isDevelopment 
  ? ["http://localhost:5173", "http://127.0.0.1:5173"] 
  : process.env.FRONTEND_URL 
    ? [process.env.FRONTEND_URL] 
    : [];

console.log("Is Development:", isDevelopment);
console.log("Allowed Origins:", allowedOrigins);
console.log("================================");

// Test common origins
const testOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "https://your-domain.com"
];

testOrigins.forEach(origin => {
  const isAllowed = !origin || allowedOrigins.includes(origin);
  const devAllowed = isDevelopment ? true : isAllowed;
  console.log(`Origin: ${origin}`);
  console.log(`  Allowed: ${devAllowed ? "✅" : "❌"}`);
  console.log("");
});

console.log("💡 If you're seeing CORS errors, check:");
console.log("1. NODE_ENV is set to 'development'");
console.log("2. Frontend is running on http://localhost:5173");
console.log("3. Or set FRONTEND_URL environment variable");
