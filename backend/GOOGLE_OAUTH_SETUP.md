# Google OAuth Setup Guide for Production

## 🔍 Common Production Issues

### Error: "Google Sign-In isn't working in production"

This typically occurs due to:
1. **Missing environment variables** in production
2. **Incorrect CORS configuration** 
3. **Google OAuth app not configured** for production domain
4. **Wrong redirect URIs** in Google Console

## 🛠️ Required Environment Variables

### ✅ Backend Environment Variables
```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL for CORS
FRONTEND_URL=https://your-frontend-domain.com

# Node Environment
NODE_ENV=production
```

### ✅ Frontend Environment Variables
```env
# Google OAuth (for frontend)
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Backend API URL
VITE_API_URL=https://your-backend-domain.com/api
```

## 🔧 Google Console Setup

### ✅ 1. Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Select your project
3. Go to: APIs & Services → Credentials

### ✅ 2. Configure OAuth 2.0 Client IDs
For **Production**, you need:
- **Web Application** OAuth 2.0 Client ID
- **Authorized JavaScript origins**: `https://your-frontend-domain.com`
- **Authorized redirect URIs**: `https://your-frontend-domain.com`

### ✅ 3. Add Production Domains
```
Authorized JavaScript origins:
✅ https://your-frontend-domain.com

Authorized redirect URIs:
✅ https://your-frontend-domain.com
```

**Important**: Use your actual production domain from environment variables!

## 🚀 Deployment Configuration

### ✅ Vercel Environment Variables
In your Vercel project dashboard:

**Backend Environment Variables:**
```
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

**Frontend Environment Variables:**
```
VITE_GOOGLE_CLIENT_ID=your-actual-google-client-id
VITE_API_URL=https://your-backend-domain.com/api
```

## 🔍 Troubleshooting Steps

### ✅ 1. Check Environment Variables
```bash
# In your backend
echo $GOOGLE_CLIENT_ID
echo $GOOGLE_CLIENT_SECRET

# Should not be empty
```

### ✅ 2. Verify Google Console Setup
- Client ID matches environment variable
- Production domain is in authorized origins
- Redirect URIs include your domain

### ✅ 3. Test Google OAuth Flow
```javascript
// Frontend Google Sign-In Test
const { google } = require('googleapis');

const client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://jeera-virid.vercel.app'
);
```

### ✅ 4. Check CORS Configuration
```javascript
// Backend CORS should include:
const allowedOrigins = [
  "https://jeera-virid.vercel.app",
  "http://localhost:5173"
];
```

## 📋 Quick Fix Checklist

### ✅ Google Console
- [ ] Production domain added to authorized origins
- [ ] Production domain added to redirect URIs  
- [ ] Client ID and Secret copied correctly

### ✅ Backend Environment
- [ ] `GOOGLE_CLIENT_ID` set
- [ ] `GOOGLE_CLIENT_SECRET` set
- [ ] `FRONTEND_URL` set to production domain
- [ ] `NODE_ENV=production`

### ✅ Frontend Environment
- [ ] `VITE_GOOGLE_CLIENT_ID` set
- [ ] `VITE_API_URL` set to backend URL

### ✅ CORS Configuration
- [ ] Production domain in allowed origins
- [ ] Credentials enabled

## 🚨 Common Error Messages

### ❌ "Invalid Google token"
- **Cause**: Wrong `GOOGLE_CLIENT_ID` or token verification failed
- **Fix**: Verify environment variables match Google Console

### ❌ "CORS policy error"
- **Cause**: Frontend domain not in CORS allowed origins
- **Fix**: Add domain to backend CORS configuration

### ❌ "redirect_uri_mismatch"
- **Cause**: Redirect URI not configured in Google Console
- **Fix**: Add production domain to authorized redirect URIs

## 🎯 Testing in Production

### ✅ 1. Check Google OAuth Endpoint
```bash
curl -X POST https://your-backend.com/api/user/auth/google \
  -H "Content-Type: application/json" \
  -d '{"token":"test-token"}'
```

### ✅ 2. Verify Frontend Google Client
```javascript
// In browser console
console.log(window.google);
// Should show Google OAuth object
```

---

**Note**: Google OAuth requires exact domain matching. Make sure your production domain is exactly configured in Google Console!
