import React, { useState, useEffect } from "react";
import { courseApi } from "@/services/api";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await courseApi.getAllCourses();
      setCourses(res.data || []);
    } catch (err) {
      console.error("Error fetching admin courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(`ADMIN ACTION: Are you sure you want to delete course #${id}?`)) return;

    setDeletingId(id);
    setMessage("");

    try {
      await courseApi.deleteCourse(id);
      setMessage(`Course #${id} deleted successfully by Administrator.`);
      fetchCourses();
    } catch (err) {
      console.error("Admin delete error:", err);
      setMessage(err.response?.data?.message || err.message || "Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Global Course Catalog Ledger (Admin) 📋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          System-wide directory of all active course offerings across instructors.
        </p>
      </div>

      {message && (
        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          {message}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No courses exist in the system catalog.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Course Title</th>
                  <th className="px-4 py-3">Instructor</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Available Seats</th>
                  <th className="px-4 py-3">Tuition Fee</th>
                  <th className="px-4 py-3 text-right">Admin Actions</th>
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
                    <td className="px-4 py-3">{c.instructorUsername || c.instructor || "Unassigned"}</td>
                    <td className="px-4 py-3">{c.capacity}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">
                      {c.availableSeats ?? c.capacity}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                      ${Number(c.tuitionFee || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={deletingId === c.id}
                        className="rounded bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                      >
                        {deletingId === c.id ? "Deleting..." : "Remove Course"}
                      </button>
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
