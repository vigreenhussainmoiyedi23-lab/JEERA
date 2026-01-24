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
import { ReactLenis, useLenis } from "lenis/react";
const App = () => {
  const lenis = useLenis((lenis) => {
  
  });
  return (
    <>
      <ReactLenis
        root
        options={{
          prevent: (node) => {
            if (!node) return false;
            const el = node instanceof HTMLElement ? node : null;
            return !!el?.closest?.(
              "[data-lenis-prevent],[data-lenis-prevent-wheel],[data-lenis-prevent-touch]",
            );
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/createProject" element={<CreateProject />} />
        <Route path="/project/:projectid" element={<ProjectDetails />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <div className="w-full h-[10vh] md:hidden bg-slate-900"></div>
    </>
  );
};

export default App;
