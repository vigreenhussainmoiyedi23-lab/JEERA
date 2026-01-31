# Backend-Frontend Communication Checklist

## 🔍 Fixed Communication Issues

### ✅ 1. API URL Construction
**Problem**: Double `/api` in URLs
```javascript
// Before: VITE_API_URL + "/api" = https://domain.com/api/api
// After: Smart URL construction
```

**Solution**: 
- Checks if URL already contains `/api`
- Appends `/api` only if needed
- Handles trailing slashes properly

### ✅ 2. Socket Connection URL
**Problem**: Wrong URL format for socket.io
```javascript
// Before: Using API URL directly for socket
// After: Remove /api from URL for socket connection
```

**Solution**:
- Converts `https://domain.com/api` → `https://domain.com`
- Proper socket.io URL format
- Fallback to localhost in development

### ✅ 3. Environment Variable Handling
**Problem**: Inconsistent environment variable usage
```javascript
// Before: Hardcoded fallbacks
// After: Environment-first approach
```

**Solution**:
- Development: Uses localhost
- Production: Uses environment variables
- Graceful fallbacks

## 📋 Communication Flow

### ✅ Frontend → Backend (HTTP Requests)
```javascript
// Axios Configuration
const baseURL = getBaseURL();
// Development: http://localhost:5000/api
// Production: https://your-domain.com/api

// Example Request
await axiosInstance.get('/user/profile');
// Results in: http://localhost:5000/api/user/profile
```

### ✅ Frontend → Backend (WebSocket)
```javascript
// Socket Configuration
const socketURL = getSocketURL();
// Development: http://localhost:5000
// Production: https://your-domain.com

// Socket Connection
socket = io(socketURL);
// Results in: ws://localhost:5000 or wss://your-domain.com
```

### ✅ Backend → Frontend (CORS)
```javascript
// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL 
  ? [process.env.FRONTEND_URL] 
  : [];
// Allows requests from configured frontend domain
```

## 🧪 Testing Communication

### ✅ 1. API Communication Test
```javascript
// In browser console
fetch('/api/health/islive')
  .then(res => res.json())
  .then(data => console.log(data));
```

### ✅ 2. Socket Connection Test
```javascript
// In browser console
console.log('Socket URL:', socketURL);
console.log('Socket connected:', socket?.connected);
```

### ✅ 3. Environment Variables Test
```javascript
// In browser console
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Base URL:', baseURL);
```

## 🔧 Environment Variable Setup

### ✅ Backend (.env)
```env
# Frontend URL for CORS
FRONTEND_URL=https://your-frontend-domain.com

# Other required variables
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGO_URI=your-mongodb-uri
```

### ✅ Frontend (.env)
```env
# Backend API URL
VITE_API_URL=https://your-backend-domain.com/api

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## 🚨 Common Communication Errors & Fixes

### ❌ "ERR_NAME_NOT_RESOLVED"
**Cause**: Wrong domain in environment variables
**Fix**: Set correct `VITE_API_URL` and `FRONTEND_URL`

### ❌ "CORS policy error"
**Cause**: Frontend domain not in CORS allowed origins
**Fix**: Set `FRONTEND_URL` in backend environment

### ❌ "Double /api in URL"
**Cause**: URL construction issue
**Fix**: Use the updated `getBaseURL()` function

### ❌ "Socket connection failed"
**Cause**: Wrong socket URL format
**Fix**: Use the updated `getSocketURL()` function

## ✅ Verification Checklist

### ✅ Development Environment
- [ ] Backend running on `localhost:5000`
- [ ] Frontend running on `localhost:5173`
- [ ] API requests work: `http://localhost:5000/api/*`
- [ ] Socket connects: `ws://localhost:5000`

### ✅ Production Environment
- [ ] `VITE_API_URL` set correctly
- [ ] `FRONTEND_URL` set in backend
- [ ] API requests work: `https://domain.com/api/*`
- [ ] Socket connects: `wss://domain.com`
- [ ] CORS allows frontend domain

### ✅ Environment Variables
- [ ] No hardcoded URLs in source code
- [ ] All domains from environment variables
- [ ] Proper URL construction
- [ ] Error handling for missing variables

## 🎯 Final Communication Flow

```
Frontend (VITE_API_URL)
    ↓ HTTP Request
Backend (CORS + API Routes)
    ↓ Response
Frontend (Axios Instance)

Frontend (getSocketURL())
    ↓ WebSocket
Backend (Socket.IO Server)
    ↓ Events
Frontend (Socket Client)
```

**All communication now uses environment variables and proper URL construction!** 🚀
