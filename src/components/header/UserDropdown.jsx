import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";


export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  const handleSignOut = () => {
    closeDropdown();
    logout();
    navigate("/signin");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/signin"
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-brand-600"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  const userRole = user?.role ? user.role.replace("ROLE_", "") : "GUEST";

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-3 text-gray-700 focus:outline-none dark:text-gray-400"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-bold text-white shadow-sm">
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="hidden text-left sm:block">
          <span className="block text-sm font-semibold text-gray-800 dark:text-white">
            {user?.username}
          </span>
          <span className="block text-[11px] font-medium text-brand-600 dark:text-brand-400">
            {userRole}
          </span>
        </div>
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-56 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-800 dark:bg-gray-900"
          onMouseLeave={closeDropdown}
        >
          <div className="border-b border-gray-100 pb-3 dark:border-gray-800">
            <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Role: {userRole}</p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
