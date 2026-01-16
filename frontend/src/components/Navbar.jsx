import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const links = [
    { to: "/", name: "JEERA" },
    { to: "/profile", name: "Profile" },
    { to: "/projects", name: "Projects" },
    { to: "/posts", name: "Explore" },
    { to: "/invites", name: "Invites" },
  ];
  return (
    <>
      <nav className="bg-cyan-600/10 fixed top-0 backdrop-blur-md  w-full z-50 shadow-md h-[10vh]  flex items-center justify-between">
        <NavLink
          key={0}
          to={links[0].to}
          className={({ isActive }) =>
            `first:text-yellow-300 text-white transition-transform duration-200 hover:scale-105 hover:text-yellow-400 ${
              isActive ? "scale-110 underline decoration-yellow-300" : ""
            }`
          }
        >
          {links[0].name}
        </NavLink>
        <div
          className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between
        text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl h-full"
        >
          {links.splice(1).map((l, idx) => {
            return (
              <NavLink
                key={idx}
                to={l.to}
                className={({ isActive }) =>
                  `first:text-yellow-300 text-white transition-transform duration-200 hover:scale-105 hover:text-yellow-400 ${
                    isActive ? "scale-110 underline decoration-yellow-300" : ""
                  }`
                }
              >
                {l.name}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
