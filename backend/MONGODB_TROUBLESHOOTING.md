# MongoDB Connection Troubleshooting Guide

## 🔍 Common SSL Connection Issues

### Error: `SSL routines:ssl3_read_bytes:tlsv1 alert internal error`

This error typically occurs due to:

1. **IP Not Whitelisted** in MongoDB Atlas
2. **Incorrect Connection String** format
3. **Network/Firewall Issues**
4. **MongoDB Atlas Cluster Issues**

## 🛠️ Quick Fixes

### 1. Check MongoDB Atlas Settings
- Go to your MongoDB Atlas dashboard
- Navigate to **Network Access** → **IP Access List**
- Add your current IP address: `0.0.0.0/0` (for testing) or your specific IP
- Ensure cluster is **active** (not paused)

### 2. Verify Connection String
Your MONGO_URI should look like:
```
mongodb+srv://<username>:<password>@cluster-name.mongodb.net/<database-name>?retryWrites=true&w=majority
```

### 3. Check Environment Variables
Make sure your `.env` file contains:
```env
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?retryWrites=true&w=majority
```

### 4. Test Connection Manually
```bash
# Test with mongosh (MongoDB Shell)
mongosh "mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database"
```

## 🔄 Connection Options in This Project

### Option 1: Secure Connection (Recommended)
- Uses proper SSL validation
- Best for production
- Located in: `src/config/db.js`

### Option 2: Fallback Connection
- Relaxed SSL settings
- Good for development/testing
- Located in: `src/config/db-fallback.js`

### Option 3: No SSL (Last Resort)
- Disables SSL entirely
- Not recommended for production
- Only for local development

## 🚀 How to Switch Connection Methods

### Method 1: Update server.js
```javascript
// Use secure connection (default)
const connectDB = require("./config/db");

// Use fallback connection
const connectDB = require("./config/db-fallback");
```

### Method 2: Update Environment
```bash
# For development
NODE_ENV=development

# For production
NODE_ENV=production
```

## 📊 Health Check Endpoints

### Check Backend Status
```bash
# Health check with database status
curl http://localhost:5000/api/health/islive

# Simple ping
curl http://localhost:5000/api/health/ping
```

### Expected Response (Healthy)
```json
{
  "status": "healthy",
  "message": "Backend is live and database connected",
  "timestamp": "2026-01-31T14:00:00.000Z",
  "uptime": 123.45,
  "database": "connected",
  "readyState": 1
}
```

### Expected Response (Unhealthy)
```json
{
  "status": "unhealthy",
  "message": "Backend is running but database is not connected",
  "timestamp": "2026-01-31T14:00:00.000Z",
  "database": "disconnected",
  "readyState": 0
}
```

## 🔧 Advanced Troubleshooting

### Check Node.js Version
```bash
node --version  # Should be 18.x or higher
```

### Check MongoDB Driver Version
```bash
npm list mongoose
```

### Clear MongoDB Connection Cache
```bash
# Stop your server
# Clear node_modules
rm -rf node_modules package-lock.json
# Reinstall
npm install
```

### Network Diagnostics
```bash
# Test DNS resolution
nslookup your-cluster.mongodb.net

# Test connectivity
telnet your-cluster.mongodb.net 27017
```

## 📱 MongoDB Atlas Checklist

- [ ] Cluster is **active** (not paused)
- [ ] **IP Address** is whitelisted
- [ ] **Database User** has correct permissions
- [ ] **Connection String** is correct
- [ ] **Password** is correct and URL-encoded
- [ ] **Network** allows outbound connections on port 27017

## 🆘 Still Having Issues?

1. **Check MongoDB Atlas Status**: https://status.mongodb.com/
2. **Review Cluster Logs** in MongoDB Atlas dashboard
3. **Try different network** (different WiFi/mobile)
4. **Contact MongoDB Support** if Atlas issue
5. **Use local MongoDB** for development

## 🎯 Quick Test Commands

```bash
# Start backend with debug info
DEBUG=mongodb* npm start

# Test health endpoint
curl http://localhost:5000/api/health/islive

# Check logs
tail -f logs/app.log
```

---

**Note**: The backend will now start even if MongoDB connection fails, but some features may not work properly.
