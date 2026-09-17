import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { enrollmentApi, paymentApi } from "@/services/api";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollRes, payRes] = await Promise.allSettled([
          enrollmentApi.getMyEnrollments(),
          paymentApi.getMyPayments(),
        ]);

        if (enrollRes.status === "fulfilled") {
          setEnrollments(enrollRes.value.data || []);
        }
        if (payRes.status === "fulfilled") {
          setPayments(payRes.value.data || []);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalTuitionPaid = payments
    .filter((p) => p.status === "PAID" || p.paymentStatus === "PAID")
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Welcome back, {user?.username}! 🎓
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Student Academic Portal & Tuition Fee Overview
          </p>
        </div>
        <Link
          to="/student/courses"
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-brand-600"
        >
          Browse Courses & Enroll
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Enrolled Courses
          </p>
          <h3 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
            {loading ? "..." : enrollments.length}
          </h3>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Payments
          </p>
          <h3 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
            {loading ? "..." : payments.length}
          </h3>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Tuition Paid
          </p>
          <h3 className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            ${loading ? "..." : totalTuitionPaid.toFixed(2)}
          </h3>
        </div>
      </div>

      {/* Recent Enrollments */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Recent Course Enrollments
          </h2>
          <Link
            to="/student/enrollments"
            className="text-sm text-brand-500 hover:underline dark:text-brand-400"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading enrollments...</p>
        ) : enrollments.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You have not enrolled in any courses yet.
            </p>
            <Link
              to="/student/courses"
              className="mt-3 inline-block text-sm font-medium text-brand-500 hover:underline"
            >
              Explore Course Catalog
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3">Enrollment ID</th>
                  <th className="px-4 py-3">Course ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {enrollments.slice(0, 5).map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      #{e.id}
                    </td>
                    <td className="px-4 py-3">Course #{e.courseId}</td>
                    <td className="px-4 py-3">
                      {e.enrollmentDate ? new Date(e.enrollmentDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {e.status || "CONFIRMED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
