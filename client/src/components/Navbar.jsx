import React, { useEffect, useState } from "react";
import { GraduationCap, House, UsersRound, CircleUser, Menu, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function hasTokenNow() {
  if (typeof window === "undefined") return false;
  const raw =
    (localStorage.getItem("accessToken") || getCookie("accessToken") || "").trim();
  // defend against string "undefined"/"null"
  return raw !== "" && raw !== "undefined" && raw !== "null";
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [hasAccessToken, setHasAccessToken] = useState(hasTokenNow());

  // refresh token presence on route changes
  useEffect(() => {
    setHasAccessToken(hasTokenNow());
  }, [location.key]);

  // refresh when token changes in another tab/window
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "accessToken") setHasAccessToken(hasTokenNow());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

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
          {!hasAccessToken && (
            <NavLink to="/create-profile" className={getButtonClass("/create-profile")}>
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
          {!hasAccessToken && (
            <NavLink
              to="/create-profile" // fixed path (was /signup before)
              className={getButtonClass("/create-profile")}
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
