import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/dashboard/Home";
import Projects from "./pages/projects/Projects";
import ProjectDetails from "./pages/projects/ProjectDetails";
import NotFound from "./pages/NotFound";
import CreateProject from "./pages/projects/CreateProject";
import Profile from "./pages/Profile/Profile";
import PostAnalytics from "./pages/analytics/PostAnalytics";
import Posts from "./pages/posts/Posts";
import SearchResults from "./pages/SearchResults";
import Tasks from "./pages/tasks/Tasks";
import Invites from "./pages/invites/Invites";
import VerifyOtp from "./pages/auth/VerifyOtp";
import About from "./pages/About";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import FollowersPage from "./pages/Profile/FollowersPage";
import FollowingPage from "./pages/Profile/FollowingPage";
import ConnectionsPage from "./pages/Profile/ConnectionsPage";
import FeaturesPage from "./components/home/FeaturesPage";
import BackendLoader from "./components/ui/BackendLoader";
import VideoLoader from "./components/ui/VideoLoader";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ReactLenis, useLenis } from "lenis/react";
const App = () => {
  const lenis = useLenis((lenis) => {
    // Optional: Handle lenis events
  });
  
  return (
    <>
      <ReactLenis
        root
        options={{
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
          prevent: (node) => {
            if (!node) return false;
            const el = node instanceof HTMLElement ? node : null;
            return !!el?.closest?.(
              "[data-lenis-prevent],[data-lenis-prevent-wheel],[data-lenis-prevent-touch]"
            );
          },
        }}
      />
      {/* Choose one of the loaders: BackendLoader (with video background) or VideoLoader (full video background) */}
      <BackendLoader />
      {/* <VideoLoader /> */}
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<FeaturesPage />} />
          
          {/* Protected Routes - require authentication */}
          <Route path="/projects" element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/profile/:userId" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/profile/:userId/followers" element={
            <ProtectedRoute>
              <FollowersPage />
            </ProtectedRoute>
          } />
          <Route path="/profile/:userId/following" element={
            <ProtectedRoute>
              <FollowingPage />
            </ProtectedRoute>
          } />
          <Route path="/profile/:userId/connections" element={
            <ProtectedRoute>
              <ConnectionsPage />
            </ProtectedRoute>
          } />
          <Route path="/posts" element={
            <ProtectedRoute>
              <Posts />
            </ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute>
              <SearchResults />
            </ProtectedRoute>
          } />
          <Route path="/invites" element={
            <ProtectedRoute>
              <Invites />
            </ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          } />
          <Route path="/createProject" element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          } />
          <Route path="/project/:projectid" element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          } />
          <Route path="/analytics/post/:postId" element={
            <ProtectedRoute>
              <PostAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/payment" element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } />
          <Route path="/payment-success" element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
