import React from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/utils";
import { GridIcon, TableIcon, ListIcon, PageIcon, PlugInIcon, UserCircleIcon } from "@/icons";

export default function AppSidebar() {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, setIsMobileOpen } = useSidebar();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const userRole = user?.role ? user.role.replace("ROLE_", "") : "GUEST";

  // Build role-specific menu items
  let menuItems = [];

  if (userRole === "STUDENT") {
    menuItems = [
      { name: "Dashboard", path: "/student/dashboard", icon: <GridIcon className="size-5" /> },
      { name: "Course Catalog", path: "/student/courses", icon: <ListIcon className="size-5" /> },
      { name: "My Enrollments", path: "/student/enrollments", icon: <TableIcon className="size-5" /> },
      { name: "Tuition Payments", path: "/student/payments", icon: <PageIcon className="size-5" /> },
    ];
  } else if (userRole === "INSTRUCTOR") {
    menuItems = [
      { name: "Instructor Dashboard", path: "/instructor/dashboard", icon: <GridIcon className="size-5" /> },
      { name: "Manage Courses", path: "/instructor/courses", icon: <ListIcon className="size-5" /> },
      { name: "Create Course", path: "/instructor/courses/create", icon: <PageIcon className="size-5" /> },
    ];
  } else if (userRole === "ADMIN") {
    menuItems = [
      { name: "Admin Dashboard", path: "/admin/dashboard", icon: <GridIcon className="size-5" /> },
      { name: "Global Courses", path: "/admin/courses", icon: <ListIcon className="size-5" /> },
      { name: "Global Payments", path: "/admin/payments", icon: <PageIcon className="size-5" /> },
    ];
  } else {
    menuItems = [
      { name: "Sign In", path: "/signin", icon: <PlugInIcon className="size-5" /> },
      { name: "Sign Up", path: "/signup", icon: <UserCircleIcon className="size-5" /> },
      { name: "Browse Courses", path: "/student/courses", icon: <ListIcon className="size-5" /> },
    ];
  }

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={cn(
        "fixed inset-s-0 top-0 z-50 flex h-screen flex-col border-e border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out xl:translate-x-0 dark:border-gray-800 dark:bg-gray-900",
        isExpanded || isMobileOpen ? "w-72.5" : isHovered ? "w-72.5" : "w-22.5",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Brand Header */}
      <div
        className={cn(
          "flex py-6 items-center",
          !isExpanded && !isHovered ? "xl:justify-center" : "justify-start"
        )}
      >
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 font-bold text-white shadow-md">
            AX
          </div>
          {(isExpanded || isHovered || isMobileOpen) && (
            <div>
              <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Academia<span className="text-brand-500">X</span>
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Digital Learning
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Role Badge Indicator */}
      {(isExpanded || isHovered || isMobileOpen) && isAuthenticated && (
        <div className="mb-4 rounded-xl border border-brand-100 bg-brand-50/50 p-3 dark:border-brand-900/40 dark:bg-brand-950/20">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Logged in as:</span>
          <div className="flex items-center justify-between mt-0.5">
            <span className="font-bold text-gray-800 dark:text-white">{user?.username}</span>
            <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {userRole}
            </span>
          </div>
        </div>
      )}

      {/* Nav Menu Items */}
      <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto">
        <nav className="mb-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {(isExpanded || isHovered || isMobileOpen) ? "Navigation" : "•••"}
          </h2>
          <ul className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => isMobileOpen && setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-brand-500 text-white shadow-theme-xs"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
                      !isExpanded && !isHovered ? "xl:justify-center" : "xl:justify-start"
                    )}
                  >
                    <span>{item.icon}</span>
                    {(isExpanded || isHovered || isMobileOpen) && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
