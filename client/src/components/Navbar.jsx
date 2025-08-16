
import React, { useEffect, useState } from "react";
import { GraduationCap, House, UsersRound, CircleUser, Menu, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isAuthed, setIsAuthed] = useState(false);

  // probe auth on mount and whenever route changes
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/me", {
          credentials: "include",
        });
        if (res.ok) {
          setIsAuthed(true);
        } else {
          setIsAuthed(false);
        }
      } catch {
        setIsAuthed(false);
      }
    })();
  }, [location.key]);

  const getButtonClass = (path) => {
    const baseClass = "flex items-center gap-2 rounded-md px-4 py-1 cursor-pointer";
    const activeClass = "bg-[#FFDBE9] text-black";
    const inactiveClass = "text-black hover:bg-[#FFDBE9]";
    return `${baseClass} ${location.pathname === path ? activeClass : inactiveClass}`;
  };

  return (
    <nav className="bg-[#FAFAFF] sticky top-0 z-50 shadow-md px-4 md:px-20 py-4">
      <div className="flex justify-between items-center">
        {/* Brand */}
        <div className="flex gap-3 items-center">
          <div className="p-2 rounded-md bg-[#8776E9] flex items-center justify-center">
            <GraduationCap className="text-black w-6 h-6" />
          </div>
          <p className="text-xl md:text-2xl font-bold">Study Buddy</p>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-5 items-center">

          <NavLink to="/homepage" className={getButtonClass("/homepage")}>
            <House className="w-4 h-4" />
            Home
          </NavLink>
          <NavLink to="/listings" className={getButtonClass("/listings")}>
            <UsersRound className="w-4 h-4" />
            Browse
          </NavLink>
          {!isAuthed && (
            <NavLink to="/signin" className={getButtonClass("/signin")}>
              <CircleUser className="w-4 h-4" />
              Create Profile
            </NavLink>
          )}

        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center">
          <button aria-label="Toggle menu" onClick={() => setIsOpen((s) => !s)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="flex flex-col gap-2 mt-4 md:hidden">
          <NavLink to="/homepage" className={getButtonClass("/homepage")} onClick={() => setIsOpen(false)}>
            <House className="w-4 h-4" />
            Home
          </NavLink>
          <NavLink to="/listings" className={getButtonClass("/listings")} onClick={() => setIsOpen(false)}>
            <UsersRound className="w-4 h-4" />
            Browse

          </NavLink>
          {!isAuthed && (
            <NavLink
              to="/signin"
              className={getButtonClass("/signin")}
              onClick={() => setIsOpen(false)}
            >
              <CircleUser className="w-4 h-4" />
              Create Profile
            </NavLink>
          )}

        </div>
      )}
    </nav>
  );
}
