# JEERA - Professional Collaboration Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Node.js-18.17.0-green?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-7.0.0-green?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/TailwindCSS-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
</div>

## 🚀 Overview

JEERA is a modern professional collaboration platform that brings together social networking, project management, and real-time communication. Built with cutting-edge technologies, JEERA provides a seamless experience for professionals to connect, collaborate, and grow their careers.

## ✨ Key Features

### 🌐 Social Networking
- **Professional Profiles** with customizable headlines and skills
- **Connection System** with request/accept functionality
- **Real-time Notifications** for all social interactions
- **Email Notifications** with professional templates
- **Profile Views Tracking** and analytics

### 📝 Content Creation & Interaction
- **Rich Post Creation** with text, media, and hashtags
- **Advanced Commenting System** with nested replies
- **Real-time Likes** and engagement tracking
- **Poll System** for interactive content
- **Link Previews** for shared URLs

### 🎯 Project Management
- **Task Management** with status tracking
- **Project Collaboration** with team invitations
- **Real-time Updates** on task changes
- **Task Assignment** and completion tracking
- **Project Analytics** and insights

### 💬 Real-time Communication
- **Instant Messaging** with emoji support
- **File Sharing** and media uploads
- **Notification System** with email integration
- **Real-time Updates** using Socket.io

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern UI framework
- **React Query** - Server state management and caching
- **TailwindCSS 4.1.18** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js 18.17.0** - Server runtime
- **Express.js** - Web framework
- **MongoDB 7.0.0** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Nodemailer** - Email service
- **ImageKit** - Media management
- **Google OAuth 2.0** - Authentication

### Development Tools
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **Git** - Version control

## 🏗️ Architecture

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── post/           # Post-related components
│   │   ├── profile/        # User profile components
│   │   ├── project/        # Project management
│   │   ├── notifications/  # Notification system
│   │   └── auth/           # Authentication components
│   ├── pages/              # Route pages
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── styles/             # Global styles
```

### Backend Structure
```
backend/
├── src/
│   ├── controllers/        # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Backend utilities
│   ├── config/             # Configuration files
│   └── socket/             # Socket.io handlers
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB 7.0+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/JEERA.git
cd JEERA
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Setup**

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jeera
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start the application**
```bash
# Start backend server (terminal 1)
cd backend
npm start

# Start frontend dev server (terminal 2)
cd frontend
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## 📱 Live Demo

- **Live Application**: [https://your-domain.com](https://your-domain.com)
- **API Documentation**: [https://api.your-domain.com/docs](https://api.your-domain.com/docs)

## 🎯 Core Features Deep Dive

### 🔐 Authentication System
- **Email-based OTP verification** with professional templates
- **Google OAuth 2.0** integration
- **JWT token-based** authentication
- **Secure password hashing** with bcrypt
- **Session management** with httpOnly cookies

### 📧 Email Notifications
- **Professional HTML templates** with JEERA branding
- **Real-time email alerts** for:
  - Connection requests/acceptances
  - Task assignments and updates
  - Project invitations
  - Comment notifications
- **Responsive email design** for all devices

### 💬 Advanced Comment System
- **Nested replies** with unlimited depth
- **Real-time updates** using React Query
- **Optimistic updates** for instant UI feedback
- **Edit/Delete** functionality with permissions
- **Like system** with real-time count updates
- **Rich text support** with emoji integration

### 🎨 Modern UI/UX
- **Glassmorphism design** with backdrop blur effects
- **Responsive layout** for all screen sizes
- **Dark theme** with professional color scheme
- **Smooth animations** and transitions
- **Mobile-first** responsive design
- **Accessibility** features

### 📊 Analytics & Insights
- **Profile view tracking**
- **Post engagement metrics**
- **Connection statistics**
- **Project progress tracking**
- **Task completion analytics**

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/google` - Google OAuth

### Users & Profiles
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/connections` - Connection requests
- `GET /api/users/notifications` - Get notifications

### Posts & Content
- `GET /api/posts` - Get all posts
- `POST /api/posts/create` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post

### Comments
- `GET /api/comment/all/:postId` - Get post comments
- `POST /api/comment/create/:postId` - Create comment
- `PATCH /api/comment/edit/:id` - Edit comment
- `DELETE /api/comment/:postId/:id` - Delete comment
- `POST /api/comment/reply/:id` - Reply to comment

### Projects
- `GET /api/projects` - Get user projects
- `POST /api/projects/create` - Create project
- `PUT /api/projects/:id` - Update project
- `POST /api/projects/:id/invite` - Invite to project
- `GET /api/projects/:id/tasks` - Get project tasks

## 🎨 Component Library

### Reusable Components
- **PostCard** - Display posts with engagement
- **CommentSection** - Full commenting system
- **UserProfile** - User profile display
- **NotificationDropdown** - Notification center
- **ShareButton** - Social sharing functionality
- **ImageSwiper** - Media carousel
- **LoadingSkeleton** - Loading states

### Custom Hooks
- `useAuth` - Authentication state
- `useNotifications` - Notification management
- `useSocket` - Socket.io integration
- `useDebounce` - Debounced inputs
- `useLocalStorage` - Local storage management

## 🔧 Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint          # Run ESLint
```

### Backend
```bash
npm start             # Start server in development
npm run test           # Run tests
npm run lint           # Run ESLint
```

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **TailwindCSS** for the utility-first CSS framework
- **MongoDB** for the flexible database
- **Lucide** for the beautiful icon set
- **ImageKit** for media management services

## 📞 Contact

- **Developer**: Vigreen Hussain Moiyedi
- **Email**: vigreenhussainmoiyedi23@gmail.com
- **LinkedIn**: [Your LinkedIn Profile]
- **GitHub**: [Your GitHub Profile]

---

<div align="center">
  <p>Made with ❤️ by <strong>Hussain Moiyedi</strong></p>
  <p>Created by <strong>Hussain Moiyedi</strong> | © 2024 JEERA. All rights reserved.</p>
</div>
