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
import FollowersPage from "./pages/profile/FollowersPage";
import FollowingPage from "./pages/profile/FollowingPage";
import ConnectionsPage from "./pages/profile/ConnectionsPage";
import FeaturesPage from "./components/home/FeaturesPage";
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
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/profile/:userId/followers" element={<FollowersPage />} />
          <Route path="/profile/:userId/following" element={<FollowingPage />} />
          <Route path="/profile/:userId/connections" element={<ConnectionsPage />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/invites" element={<Invites />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/about" element={<About />} />
          <Route path="/createProject" element={<CreateProject />} />
          <Route path="/project/:projectid" element={<ProjectDetails />} />
          <Route path="/analytics/post/:postId" element={<PostAnalytics />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
