import React, { useState, useEffect } from "react";
import { enrollmentApi } from "@/services/api";

export default function MyEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await enrollmentApi.getMyEnrollments();
      setEnrollments(res.data || []);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this enrollment? Seat capacity will be compensated.")) {
      return;
    }

    setCancellingId(id);
    setMessage("");

    try {
      await enrollmentApi.cancelEnrollment(id);
      setMessage(`Enrollment #${id} cancelled successfully. Seat restored.`);
      fetchEnrollments();
    } catch (err) {
      console.error("Error cancelling enrollment:", err);
      setMessage(err.response?.data?.message || err.message || "Failed to cancel enrollment.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          My Enrolled Courses 🎓
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your active course enrollments and seat reservations.
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
        ) : enrollments.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              You are not enrolled in any active courses.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3">Enrollment ID</th>
                  <th className="px-4 py-3">Course ID</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {enrollments.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      #{e.id}
                    </td>
                    <td className="px-4 py-3">Course #{e.courseId}</td>
                    <td className="px-4 py-3">{e.studentUsername}</td>
                    <td className="px-4 py-3">
                      {e.enrollmentDate ? new Date(e.enrollmentDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {e.status || "CONFIRMED"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleCancel(e.id)}
                        disabled={cancellingId === e.id}
                        className="rounded bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                      >
                        {cancellingId === e.id ? "Cancelling..." : "Cancel Enrollment"}
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
