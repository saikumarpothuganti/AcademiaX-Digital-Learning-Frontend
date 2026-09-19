import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import AppLayout from "@/layout/AppLayout";

// Auth Pages
import SignIn from "@/pages/AuthPages/SignIn";
import SignUp from "@/pages/AuthPages/SignUp";
import ForgotPassword from "@/pages/AuthPages/ForgotPassword";
import ResetPassword from "@/pages/AuthPages/ResetPassword";
import VerifyEmail from "@/pages/AuthPages/VerifyEmail";
import NotFound from "@/pages/OtherPage/NotFound";

// Student Pages
import StudentDashboard from "@/pages/Student/StudentDashboard";
import CourseCatalog from "@/pages/Student/CourseCatalog";
import MyEnrollments from "@/pages/Student/MyEnrollments";
import MyPayments from "@/pages/Student/MyPayments";

// Instructor Pages
import InstructorDashboard from "@/pages/Instructor/InstructorDashboard";
import MyCourses from "@/pages/Instructor/MyCourses";
import CreateCourse from "@/pages/Instructor/CreateCourse";

// Admin Pages
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminCourses from "@/pages/Admin/AdminCourses";
import AdminPayments from "@/pages/Admin/AdminPayments";

// Smart Root Redirect based on User Role
function RootRedirect() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/signin" replace />;

  const role = user?.role ? user.role.replace("ROLE_", "") : "STUDENT";
  if (role === "INSTRUCTOR") return <Navigate to="/instructor/dashboard" replace />;
  if (role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Main App Layout */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<RootRedirect />} />

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/enrollments" element={<MyEnrollments />} />
              <Route path="/student/payments" element={<MyPayments />} />
            </Route>

            {/* Course Catalog accessible by Student or Guest */}
            <Route path="/student/courses" element={<CourseCatalog />} />

            {/* Instructor Routes */}
            <Route element={<ProtectedRoute allowedRoles={["INSTRUCTOR"]} />}>
              <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
              <Route path="/instructor/courses" element={<MyCourses />} />
              <Route path="/instructor/courses/create" element={<CreateCourse />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/courses" element={<AdminCourses />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
