import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("academiax_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authApi = {
  login: (username, password) =>
    api.post("/api/auth/login", { username, password }),
  register: (username, email, password, role) =>
    api.post("/api/auth/register", { username, email, password, role }),
  forgotPassword: (email) =>
    api.post("/api/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    api.post("/api/auth/reset-password", { token, newPassword }),
  verifyEmail: (token) =>
    api.get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`),
  googleLogin: (idToken, role) =>
    api.post("/api/auth/oauth2/google", { idToken, role }),
  microsoftLogin: (idToken, role) =>
    api.post("/api/auth/oauth2/microsoft", { idToken, role }),
};

// Course APIs
export const courseApi = {
  getAllCourses: () => api.get("/api/courses"),
  getCourseById: (id) => api.get(`/api/courses/${id}`),
  getCoursesByInstructor: (username) => api.get(`/api/courses/instructor/${username}`),
  createCourse: (courseData) => api.post("/api/courses", courseData),
  updateCourse: (id, courseData) => api.put(`/api/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/api/courses/${id}`),
};

// Enrollment APIs
export const enrollmentApi = {
  createEnrollment: (courseId, studentUsername) =>
    api.post("/api/enrollments", { courseId, studentUsername }),
  getMyEnrollments: () => api.get("/api/enrollments/me"),
  getEnrollmentById: (id) => api.get(`/api/enrollments/${id}`),
  cancelEnrollment: (id) => api.delete(`/api/enrollments/${id}`),
  getAllEnrollments: () => api.get("/api/enrollments"),
};

// Payment APIs
export const paymentApi = {
  createOrder: (enrollmentId, courseId, studentUsername, amount, currency) =>
    api.post("/api/payments/orders", { enrollmentId, courseId, studentUsername, amount, currency }),
  verifyPayment: (enrollmentId, gatewayOrderId, gatewayPaymentId, gatewaySignature) =>
    api.post("/api/payments/verify", { enrollmentId, gatewayOrderId, gatewayPaymentId, gatewaySignature }),
  refundPayment: (id, reason) =>
    api.post(`/api/payments/${id}/refund?reason=${encodeURIComponent(reason || "Admin Refund")}`),
  getMyPayments: () => api.get("/api/payments/me"),
  getPaymentById: (id) => api.get(`/api/payments/${id}`),
  getPaymentByEnrollment: (enrollmentId) => api.get(`/api/payments/enrollment/${enrollmentId}`),
  getAllPayments: () => api.get("/api/payments"),
};

export default api;
