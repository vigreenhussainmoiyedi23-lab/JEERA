import { FolderEdit, Mail, Search, User, UserCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const mainNavbar = [{ to: "/", name: "JEERA" }];
  const links = [
    { to: "/profile", name: "Profile", logo: <UserCircle /> },
    { to: "/projects", name: "Projects", logo: <FolderEdit /> },
    { to: "/posts", name: "Explore", logo: <Search /> },
    { to: "/invites", name: "Invites", logo: <Mail /> },
  ];
  return (
    <>
      <nav className=" fixed top-0 px-3 py-2 rounded-b-2xl mx-[5%] bg-linear-to-br from-[#040A1A] to-[#07033d]  w-[90%] z-50 shadow-md h-[10vh]  flex items-center justify-between">
        <div className="md:w-1/3 max-w-sm xl:text-4xl sm:text-2xl text-xl md:text-3xl px-5 py-2 w-full flex items-center justify-between">
          <NavLink
            to={mainNavbar[0].to}
            className={({ isActive }) =>
              `first:text-yellow-300 text-white transition-transform duration-200 hover:scale-105 hover:text-yellow-400 ${
                isActive ? "scale-110 underline decoration-yellow-300" : ""
              }`
            }
          >
            {mainNavbar[0].name}
          </NavLink>
        </div>
        <div
          className="md:flex hidden items-center justify-end gap-5
        text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl h-[10vh] w-2/3 max-w-lg "
        >
          {links.map((l, idx) => {
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
      <div className="fixed md:hidden px-5 flex items-center justify-between w-screen bottom-0 h-[10vh] bg-linear-to-br from-[#1e032e] to-[#16012730] text-2xl text-white">
        {links.map((l, idx) => {
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
              {l.logo}
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

export default Navbar;
