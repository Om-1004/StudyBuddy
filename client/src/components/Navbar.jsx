import React, { useEffect, useState } from "react";
import {
  GraduationCap,
  House,
  UsersRound,
  CircleUser,
  Menu,
  X,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isAuthed, setIsAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/me", {
          credentials: "include",
        });
        setIsAuthed(res.ok);
      } catch {
        setIsAuthed(false);
      }
    })();
  }, [location.key]);

  const baseClass = "flex items-center gap-2 rounded-md px-4 py-1 cursor-pointer";
  const activeClass = "bg-[#8776E9] text-white";
  const inactiveClass = "text-black hover:bg-[#FFDBE9]";
  const navButtonClass = (path) =>
    `${baseClass} ${location.pathname === path ? activeClass : inactiveClass}`;
  const actionButtonClass = `${baseClass} ${inactiveClass}`; // never 'active'

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setIsAuthed(false);
        setIsOpen(false);
        navigate("/");
      } else {
        console.error("Sign-out failed");
      }
    } catch (err) {
      console.error("Error signing out:", err);
    }
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
          <NavLink to="/" className={navButtonClass("/")}>
            <House className="w-4 h-4" />
            Home
          </NavLink>

          <NavLink to="/listings" className={navButtonClass("/listings")}>
            <UsersRound className="w-4 h-4" />
            Browse
          </NavLink>

          <NavLink to="/chat" className={navButtonClass("/chat")}>
            <MessageCircle className="w-4 h-4" />
            Message
          </NavLink>

          {!isAuthed && (
            <NavLink to="/signin" className={navButtonClass("/signin")}>
              <CircleUser className="w-4 h-4" />
              Create Profile
            </NavLink>
          )}

          {isAuthed && (
            <button type="button" onClick={handleSignOut} className={actionButtonClass}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button aria-label="Toggle menu" onClick={() => setIsOpen((s) => !s)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-2 mt-4 md:hidden">
          <NavLink to="/" className={navButtonClass("/")} onClick={() => setIsOpen(false)}>
            <House className="w-4 h-4" />
            Home
          </NavLink>

          <NavLink
            to="/listings"
            className={navButtonClass("/listings")}
            onClick={() => setIsOpen(false)}
          >
            <UsersRound className="w-4 h-4" />
            Browse
          </NavLink>

          <NavLink
            to="/chat"
            className={navButtonClass("/chat")}
            onClick={() => setIsOpen(false)}
          >
            <MessageCircle className="w-4 h-4" />
            Message
          </NavLink>

          {!isAuthed && (
            <NavLink
              to="/signin"
              className={navButtonClass("/signin")}
              onClick={() => setIsOpen(false)}
            >
              <CircleUser className="w-4 h-4" />
              Create Profile
            </NavLink>
          )}

          {isAuthed && (
            <button
              type="button"
              onClick={handleSignOut}
              className={actionButtonClass}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}