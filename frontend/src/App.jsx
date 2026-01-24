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
import Posts from "./pages/posts/Posts";
import Tasks from "./pages/tasks/Tasks";
import Invites from "./pages/invites/Invites";
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
          <Route path="/projects" element={<Projects />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/invites" element={<Invites />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/createProject" element={<CreateProject />} />
          <Route path="/project/:projectid" element={<ProjectDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
