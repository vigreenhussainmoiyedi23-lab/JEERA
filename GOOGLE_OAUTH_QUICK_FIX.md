# Google OAuth Quick Fix Guide

## 🚨 Current Issues

### 1. Google OAuth Origin Error
```
The given origin is not allowed for the given client ID
```

### 2. Double /api in URLs
```
GET http://localhost:5000/api/api/user/profile 404 (Not Found)
```

## 🛠️ Quick Fixes

### ✅ Fix 1: Update Frontend .env File

**Step 1:** Update your `frontend/.env` file:
```env
# Backend API URL (without /api suffix)
VITE_API_URL=http://localhost:5000

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=882333680294-rvvdradfp0crhk9jgt3ls5l42om9p9af.apps.googleusercontent.com

# Environment
VITE_NODE_ENV=development
```

**Step 2:** Restart your frontend development server:
```bash
npm run dev
```

### ✅ Fix 2: Configure Google OAuth Client

**Step 1:** Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Select your project
- Go to: APIs & Services → Credentials

**Step 2:** Find your OAuth 2.0 Client ID
- Look for: `882333680294-rvvdradfp0crhk9jgt3ls5l42om9p9af.apps.googleusercontent.com`

**Step 3:** Add Authorized JavaScript Origins
- Click on your OAuth 2.0 Client ID
- Go to "Authorized JavaScript origins"
- Add: `http://localhost:5173`
- Add: `http://127.0.0.1:5173` (if needed)

**Step 4:** Add Authorized Redirect URIs
- Go to "Authorized redirect URIs"
- Add: `http://localhost:5173`
- Add: `http://127.0.0.1:5173` (if needed)

### ✅ Fix 3: Update Backend Environment

**Step 1:** Update your `backend/.env` file:
```env
# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# Google OAuth Configuration
GOOGLE_CLIENT_ID=882333680294-rvvdradfp0crhk9jgt3ls5l42om9p9af.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Node Environment
NODE_ENV=development
```

**Step 2:** Restart your backend server:
```bash
npm start
```

## 🧪 Test the Fixes

### ✅ Test 1: Check API URLs
```javascript
// In browser console
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Base URL:', window.location.origin);
```

### ✅ Test 2: Test Google OAuth
1. Go to your login page
2. Click "Sign in with Google"
3. Should work without origin errors

### ✅ Test 3: Test Protected Routes
1. Try to access `/profile`
2. Should redirect to `/login` if not authenticated
3. After login, should work normally

## 📋 Expected Results

### ✅ After Fixes:
- **No more double /api**: URLs will be `http://localhost:5000/api/user/profile`
- **Google OAuth works**: No origin errors
- **Protected routes work**: Redirect to login when not authenticated
- **CORS works**: No CORS errors

### ✅ Console Should Show:
```
✅ Socket connected successfully
🔧 CORS Configuration:
NODE_ENV: development
FRONTEND_URL: http://localhost:5173
Allowed Origins: ["http://localhost:5173", "http://127.0.0.1:5173"]
```

## 🚨 If Still Having Issues

### ❌ Google OAuth Still Fails:
1. **Double-check** the client ID in Google Console
2. **Make sure** origins are exactly `http://localhost:5173`
3. **Clear browser cache** and cookies
4. **Try incognito mode**

### ❌ Double /api Still Happens:
1. **Check** your `frontend/.env` file
2. **Make sure** `VITE_API_URL` doesn't end with `/api`
3. **Restart** frontend development server

### ❌ CORS Still Fails:
1. **Check** your `backend/.env` file
2. **Make sure** `FRONTEND_URL` is set correctly
3. **Restart** backend server

## 🎯 Quick Commands

```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm start

# Test CORS
curl http://localhost:5000/api/health/islive
```

**Follow these steps and your Google OAuth and API issues should be resolved!** 🚀
