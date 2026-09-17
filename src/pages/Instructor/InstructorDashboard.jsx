import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { courseApi } from "@/services/api";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        setLoading(true);
        const res = await courseApi.getCoursesByInstructor(user.username);
        setCourses(res.data || []);
      } catch (err) {
        console.error("Instructor courses fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.username) {
      fetchInstructorCourses();
    }
  }, [user]);

  const totalSeatsAllocated = courses.reduce((sum, c) => sum + (c.capacity || 0), 0);
  const totalEnrolledStudents = courses.reduce(
    (sum, c) => sum + ((c.capacity || 0) - (c.availableSeats ?? c.capacity ?? 0)),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Instructor Portal — {user?.username} 👨‍🏫
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Course Management & Capacity Analytics
          </p>
        </div>
        <Link
          to="/instructor/courses/create"
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-brand-600"
        >
          + Create New Course
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Managed Courses
          </p>
          <h3 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
            {loading ? "..." : courses.length}
          </h3>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Enrolled Students
          </p>
          <h3 className="mt-2 text-3xl font-bold text-brand-600 dark:text-brand-400">
            {loading ? "..." : totalEnrolledStudents}
          </h3>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Seat Capacity
          </p>
          <h3 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
            {loading ? "..." : totalSeatsAllocated}
          </h3>
        </div>
      </div>

      {/* Managed Courses Table */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            My Courses
          </h2>
          <Link
            to="/instructor/courses"
            className="text-sm text-brand-500 hover:underline dark:text-brand-400"
          >
            Manage Courses
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading courses...</p>
        ) : courses.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You have not created any courses yet.
            </p>
            <Link
              to="/instructor/courses/create"
              className="mt-3 inline-block text-sm font-medium text-brand-500 hover:underline"
            >
              Create your first course
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3">Course ID</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Available Seats</th>
                  <th className="px-4 py-3">Tuition Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      #{c.id}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800 dark:text-white">
                      {c.title}
                    </td>
                    <td className="px-4 py-3">{c.capacity}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {c.availableSeats ?? c.capacity}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                      ${Number(c.tuitionFee || 0).toFixed(2)}
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
