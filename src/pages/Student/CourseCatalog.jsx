import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { courseApi } from "@/services/api";

export default function CourseCatalog() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await courseApi.getAllCourses();
      setCourses(res.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const filteredCourses = courses.filter((c) =>
    c.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.instructorUsername?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Higher Education Course Catalog 🎓
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Explore courses, inspect tuition fees, and complete enrollment via AcademiaX Sandbox Payment Gateway.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search by course title, instructor, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Course List Grid */}
      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <p className="text-gray-500 dark:text-gray-400">
            No courses found. Check back later or adjust your search filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const seatsAvailable = course.availableSeats ?? course.capacity ?? 0;
            const isFull = seatsAvailable <= 0;
            const isActive = course.status !== "INACTIVE";

            return (
              <div
                key={course.id}
                className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                      {course.courseCode || `ID: #${course.id}`}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        !isActive
                          ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                          : isFull
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      }`}
                    >
                      {!isActive ? "INACTIVE" : isFull ? "FULL" : `${seatsAvailable} seats available`}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {course.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    Instructor: <span className="text-gray-700 dark:text-gray-300">{course.instructor || course.instructorUsername || "Unassigned"}</span>
                  </p>
                  <p className="mt-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                    {course.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-800">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Tuition Fee</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        ${course.tuitionFee != null ? Number(course.tuitionFee).toFixed(2) : "0.00"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Total Capacity</p>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {course.capacity || 0} Students
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/student/courses/${course.id}`}
                    className="flex w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-brand-600 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
