
// Grok
import { FolderEdit, Mail, Search, UserCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import clsx from "clsx"; // optional but recommended

const navItems = [
  { to: "/profile", label: "Profile", icon: UserCircle },
  { to: "/projects", label: "Projects", icon: FolderEdit },
  { to: "/posts", label: "Explore", icon: Search },
  { to: "/invites", label: "Invites", icon: Mail },
];

const mainBrand = { to: "/", label: "JEERA" };

export default function Navbar() {
  return (
    <>
      {/* Top Navbar - Desktop + Mobile */}
      <nav className="
        fixed top-0 left-0 right-0 z-50
        h-16 sm:h-18
        bg-linear-to-r from-slate-950/80 via-indigo-950/70 to-slate-950/80
        backdrop-blur-xl border-b border-white/5
        shadow-[0_4px_30px_rgba(0,0,0,0.4)]
        transition-all duration-300
      ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Brand */}
            <NavLink
              to={mainBrand.to}
              className={({ isActive }) =>
                clsx(
                  "text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight",
                  "bg-linear-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent",
                  "transition-all duration-300 hover:scale-105 active:scale-100",
                  isActive && "scale-105"
                )
              }
            >
              {mainBrand.label}
            </NavLink>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-2 lg:gap-5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      "group relative px-4 py-2 rounded-full text-lg lg:text-xl font-medium",
                      "text-gray-300 transition-all duration-300",
                      "hover:text-white hover:bg-white/10",
                      isActive &&
                        "text-white bg-linear-to-r from-yellow-500/20 to-amber-500/20 shadow-inner shadow-yellow-500/10"
                    )
                  }
                >
                  {item.label}
                  <span className="
                    absolute inset-x-4 -bottom-1 h-0.5 
                    bg-linear-to-r from-yellow-400 to-amber-400 
                    scale-x-0 group-hover:scale-x-100 
                    transition-transform duration-300 origin-center
                  "/>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <div className="
        fixed bottom-0 left-0 right-0 z-50
        md:hidden h-16 sm:h-18
        bg-linear-to-t from-slate-950/90 to-slate-950/70
        backdrop-blur-lg border-t border-white/5
        shadow-[0_-4px_30px_rgba(0,0,0,0.45)]
      ">
        <div className="flex items-center justify-around h-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    "flex flex-col items-center justify-center gap-1 p-3 rounded-xl",
                    "transition-all duration-300",
                    isActive
                      ? "text-yellow-400 scale-110 bg-white/8 shadow-inner shadow-yellow-600/20"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5 active:scale-95"
                  )
                }
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.1} />
                {/* Optional: tiny label under icon */}
                {/* <span className="text-[10px] font-medium">{item.label}</span> */}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Spacer for fixed navbars */}
      <div className=" bg-slate-900 block shrink-0 w-full h-16" ></div>
    </>
  );
}