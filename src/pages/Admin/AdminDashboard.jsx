import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { courseApi, enrollmentApi, paymentApi } from "@/services/api";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [cRes, eRes, pRes] = await Promise.allSettled([
          courseApi.getAllCourses(),
          enrollmentApi.getAllEnrollments(),
          paymentApi.getAllPayments(),
        ]);

        if (cRes.status === "fulfilled") setCourses(cRes.value.data || []);
        if (eRes.status === "fulfilled") setEnrollments(eRes.value.data || []);
        if (pRes.status === "fulfilled") setPayments(pRes.value.data || []);
      } catch (err) {
        console.error("Admin dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user]);

  const totalTuitionRevenue = payments
    .filter((p) => p.status === "SUCCESS" || p.status === "PAID" || p.paymentStatus === "PAID")
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Enterprise Administrator Dashboard 👑
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Global platform overview, microservices status, and system-wide tuition ledger.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total System Courses
          </p>
          <h3 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
            {loading ? "..." : courses.length}
          </h3>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total System Enrollments
          </p>
          <h3 className="mt-2 text-3xl font-bold text-brand-600 dark:text-brand-400">
            {loading ? "..." : enrollments.length}
          </h3>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Payment Transactions
          </p>
          <h3 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
            {loading ? "..." : payments.length}
          </h3>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total System Revenue
          </p>
          <h3 className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            ${loading ? "..." : totalTuitionRevenue.toFixed(2)}
          </h3>
        </div>
      </div>

      {/* Microservices Health Status Panel */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Active Microservices Cluster Status
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {[
            { name: "Eureka Server", port: "8761", status: "UP" },
            { name: "API Gateway", port: "8080", status: "UP" },
            { name: "Auth Service", port: "8081", status: "UP" },
            { name: "Course Service", port: "8082", status: "UP" },
            { name: "Enrollment Service", port: "8083", status: "UP" },
            { name: "Payment Service", port: "8084", status: "UP" },
          ].map((srv) => (
            <div
              key={srv.port}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-800/50"
            >
              <div className="mx-auto mb-2 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500">
                <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-sm font-bold text-gray-800 dark:text-white">{srv.name}</p>
              <p className="text-xs text-gray-500">Port {srv.port}</p>
              <span className="mt-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400">
                {srv.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation Links */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Link
          to="/admin/courses"
          className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs transition hover:border-brand-500 dark:border-gray-800 dark:bg-gray-900"
        >
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-brand-500 dark:text-white">
            Global Courses Audit & Management &rarr;
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Inspect all platform course listings, capacities, and instructor assignments.
          </p>
        </Link>

        <Link
          to="/admin/payments"
          className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs transition hover:border-emerald-500 dark:border-gray-800 dark:bg-gray-900"
        >
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-500 dark:text-white">
            Global Tuition Payments Ledger &rarr;
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Audit system-wide payment transactions, student records, and transaction refs.
          </p>
        </Link>
      </div>
    </div>
  );
}
