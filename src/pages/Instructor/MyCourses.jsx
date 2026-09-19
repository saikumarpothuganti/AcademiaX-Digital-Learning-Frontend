import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { courseApi } from "@/services/api";

export default function MyCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");

  // Edit Modal State
  const [editingCourse, setEditingCourse] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    capacity: 30,
    tuitionFee: 499.99,
    enrollmentDeadline: "",
    status: "ACTIVE",
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await courseApi.getCoursesByInstructor(user.username);
      setCourses(res.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchCourses();
    }
  }, [user]);

  const formatDateForInput = (deadlineStr) => {
    if (!deadlineStr) return "";
    try {
      const d = new Date(deadlineStr);
      if (isNaN(d.getTime())) return deadlineStr.slice(0, 16);
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return deadlineStr.slice(0, 16);
    }
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setEditForm({
      title: course.title || "",
      description: course.description || "",
      capacity: course.capacity || 30,
      tuitionFee: course.tuitionFee || 499.99,
      enrollmentDeadline: formatDateForInput(course.enrollmentDeadline),
      status: course.status || "ACTIVE",
    });
    setEditError("");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingCourse) return;

    setEditError("");
    setSavingEdit(true);

    try {
      const formattedDeadline =
        editForm.enrollmentDeadline.length === 16
          ? `${editForm.enrollmentDeadline}:00`
          : editForm.enrollmentDeadline;

      const payload = {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        capacity: Number(editForm.capacity),
        tuitionFee: Number(editForm.tuitionFee),
        enrollmentDeadline: formattedDeadline,
        status: editForm.status,
      };

      await courseApi.updateCourse(editingCourse.id, payload);
      setMessage(`Course #${editingCourse.id} updated successfully.`);
      setEditingCourse(null);
      fetchCourses();
    } catch (err) {
      console.error("Error updating course:", err);
      setEditError(
        err.response?.data?.message || err.message || "Failed to update course."
      );
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    setDeletingId(id);
    setMessage("");

    try {
      await courseApi.deleteCourse(id);
      setMessage(`Course #${id} deleted successfully.`);
      fetchCourses();
    } catch (err) {
      console.error("Error deleting course:", err);
      setMessage(err.response?.data?.message || err.message || "Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Course Management 📝
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View, inspect, and update courses authored by {user?.username}.
          </p>
        </div>
        <Link
          to="/instructor/courses/create"
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-brand-600"
        >
          + Create New Course
        </Link>
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
              No courses found under your instructor profile.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Available</th>
                  <th className="px-4 py-3">Tuition Fee</th>
                  <th className="px-4 py-3 text-right">Actions</th>
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
                    <td className="px-4 py-3 line-clamp-1 max-w-xs">{c.description}</td>
                    <td className="px-4 py-3">{c.capacity}</td>
                    <td className="px-4 py-3 text-emerald-600 font-semibold dark:text-emerald-400">
                      {c.availableSeats ?? c.capacity}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                      ${Number(c.tuitionFee || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="rounded bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          disabled={deletingId === c.id}
                          className="rounded bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                        >
                          {deletingId === c.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Edit Course #{editingCourse.id}
              </h2>
              <button
                onClick={() => setEditingCourse(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={editingCourse.courseCode || ""}
                    disabled
                    className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Instructor Username
                  </label>
                  <input
                    type="text"
                    value={user?.username || editingCourse.instructorUsername || ""}
                    disabled
                    className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Seat Capacity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.capacity}
                    onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tuition Fee ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.tuitionFee}
                    onChange={(e) => setEditForm({ ...editForm, tuitionFee: e.target.value })}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enrollment Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={editForm.enrollmentDeadline}
                    onChange={(e) =>
                      setEditForm({ ...editForm, enrollmentDeadline: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white shadow hover:bg-brand-600 disabled:opacity-50"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
