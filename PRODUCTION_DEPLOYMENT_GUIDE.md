# Production Deployment Guide

## 🚨 CORS Issue Fixed

### ✅ Problem
```
CORS: Origin not allowed: https://jeera-virid.vercel.app
```

### ✅ Solution
Updated backend CORS configuration to allow `https://jeera-virid.vercel.app` as a fallback domain.

## 🌐 Production Environment Setup

### ✅ Backend Environment Variables

**For Production Deployment (Vercel/Heroku/etc):**

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Server
PORT=5000
NODE_ENV=production

# CORS - IMPORTANT!
FRONTEND_URL=https://jeera-virid.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=882333680294-rvvdradfp0crhk9jgt3ls5l42om9p9af.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=7d
```

### ✅ Frontend Environment Variables

**For Production Deployment (Vercel):**

```env
# Backend API URL
VITE_API_URL=https://your-backend-domain.com

# Google OAuth
VITE_GOOGLE_CLIENT_ID=882333680294-rvvdradfp0crhk9jgt3ls5l42om9p9af.apps.googleusercontent.com

# Environment
VITE_NODE_ENV=production
```

## 🔧 CORS Configuration

### ✅ Updated CORS Logic
```javascript
const allowedOrigins = (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "developement") 
  ? ["http://localhost:5173", "http://127.0.0.1:5173"] 
  : process.env.FRONTEND_URL 
    ? [process.env.FRONTEND_URL] 
    : ["https://jeera-virid.vercel.app"]; // Fallback to production domain
```

### ✅ How It Works
1. **Development**: Allows `localhost:5173` and `127.0.0.1:5173`
2. **Production**: Uses `FRONTEND_URL` if set
3. **Fallback**: Uses `https://jeera-virid.vercel.app` if `FRONTEND_URL` not set

## 🚀 Deployment Steps

### ✅ Step 1: Backend Deployment
1. **Set environment variables** in your hosting platform
2. **Make sure** `FRONTEND_URL=https://jeera-virid.vercel.app`
3. **Set** `NODE_ENV=production`
4. **Deploy** your backend

### ✅ Step 2: Frontend Deployment
1. **Set environment variables** in Vercel
2. **Set** `VITE_API_URL=https://your-backend-domain.com`
3. **Set** `VITE_GOOGLE_CLIENT_ID=882333680294-rvvdradfp0crhk9jgt3ls5l42om9p9af.apps.googleusercontent.com`
4. **Deploy** your frontend

### ✅ Step 3: Google OAuth Setup
1. **Go to**: https://console.cloud.google.com/
2. **Add to Authorized JavaScript origins**:
   - `https://jeera-virid.vercel.app`
3. **Add to Authorized redirect URIs**:
   - `https://jeera-virid.vercel.app`

## 🧪 Production Testing

### ✅ Test CORS
```bash
# Test from browser
fetch('https://your-backend-domain.com/api/health/islive')
  .then(res => res.json())
  .then(data => console.log(data))
```

### ✅ Test Google OAuth
1. **Visit**: `https://jeera-virid.vercel.app/login`
2. **Click**: "Sign in with Google"
3. **Should work** without CORS errors

### ✅ Test Protected Routes
1. **Visit**: `https://jeera-virid.vercel.app/profile`
2. **Should redirect** to login if not authenticated
3. **After login**: Should work normally

## 📋 Environment Variable Checklist

### ✅ Backend Checklist
- [ ] `MONGO_URI` - MongoDB connection string
- [ ] `NODE_ENV=production`
- [ ] `FRONTEND_URL=https://jeera-virid.vercel.app`
- [ ] `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Your Google OAuth secret
- [ ] `JWT_SECRET` - Your JWT secret key

### ✅ Frontend Checklist
- [ ] `VITE_API_URL=https://your-backend-domain.com`
- [ ] `VITE_GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- [ ] `VITE_NODE_ENV=production`

## 🎯 Expected Production Behavior

### ✅ CORS Should Work
```
Request Origin: https://jeera-virid.vercel.app
Allowed Origins: ["https://jeera-virid.vercel.app"]
Result: ✅ CORS Allowed
```

### ✅ API Calls Should Work
```
Frontend: https://jeera-virid.vercel.app
Backend:  https://your-backend-domain.com
API Call: POST https://your-backend-domain.com/api/user/auth/google
Result: ✅ Success
```

### ✅ Google OAuth Should Work
```
Origin: https://jeera-virid.vercel.app
Google Client: 882333680294-rvvdradfp0crhk9jgt3ls5l42om9p9af.apps.googleusercontent.com
Result: ✅ Sign-in works
```

## 🚨 Troubleshooting

### ❌ CORS Still Fails
1. **Check** backend environment variables
2. **Make sure** `FRONTEND_URL` is set correctly
3. **Restart** backend server
4. **Check** browser console for exact error

### ❌ Google OAuth Fails
1. **Check** Google Console configuration
2. **Make sure** `https://jeera-virid.vercel.app` is in allowed origins
3. **Clear browser cache**
4. **Check** client ID matches

### ❌ API Calls Fail
1. **Check** `VITE_API_URL` in frontend
2. **Make sure** backend is deployed and accessible
3. **Check** network tab in browser dev tools

## 🎉 Success Indicators

### ✅ Console Should Show
```
🌐 Production CORS Configuration:
NODE_ENV: production
FRONTEND_URL: https://jeera-virid.vercel.app
Allowed Origins: ["https://jeera-virid.vercel.app"]
```

### ✅ Network Tab Should Show
```
✅ 200 OK for API calls
✅ No CORS errors
✅ Google OAuth redirects work
```

**Your CORS issue is now fixed!** 🚀

The backend will now allow requests from `https://jeera-virid.vercel.app` in production.
