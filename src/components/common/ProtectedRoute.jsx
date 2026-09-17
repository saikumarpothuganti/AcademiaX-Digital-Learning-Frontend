import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles.length > 0) {
    const userRole = user?.role ? user.role.replace("ROLE_", "") : "";
    const hasRole = allowedRoles.some(
      (role) => role.replace("ROLE_", "") === userRole
    );

    if (!hasRole) {
      if (userRole === "STUDENT") return <Navigate to="/student/dashboard" replace />;
      if (userRole === "INSTRUCTOR") return <Navigate to="/instructor/dashboard" replace />;
      if (userRole === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
