import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { courseApi, enrollmentApi, paymentApi } from "@/services/api";

export default function CourseDetails() {
  const { courseId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState("");

  // Checkout & Modal state
  const [showModal, setShowModal] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [order, setOrder] = useState(null);
  const [step, setStep] = useState("CONFIRM"); // CONFIRM -> CHECKOUT -> VERIFYING -> SUCCESS -> FAILED
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [modalError, setModalError] = useState("");
  const [simulatedPaymentId, setSimulatedPaymentId] = useState("");

  useEffect(() => {
    const fetchCourseAndEnrollments = async () => {
      try {
        setLoading(true);
        setFetchError("");
        const res = await courseApi.getCourseById(courseId);
        setCourse(res.data);

        // Check if student is logged in and already enrolled
        if (isAuthenticated && user?.role === "ROLE_STUDENT") {
          try {
            const enrollRes = await enrollmentApi.getMyEnrollments();
            const myEnrollments = enrollRes.data || [];
            const existing = myEnrollments.find(e => Number(e.courseId) === Number(courseId) || Number(e.course?.id) === Number(courseId));
            if (existing) {
              setAlreadyEnrolled(true);
              setEnrollmentStatus(existing.status);
            }
          } catch (err) {
            console.error("Error fetching enrollments", err);
          }
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setFetchError(err.response?.data?.message || "Failed to load course details. It may not exist.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndEnrollments();
  }, [courseId, isAuthenticated, user]);

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }
    if (user?.role !== "ROLE_STUDENT") {
      alert("Only students can enroll in courses.");
      return;
    }
    setEnrollment(null);
    setOrder(null);
    setStep("CONFIRM");
    setReceipt(null);
    setModalError("");
    setSimulatedPaymentId(`pay_ACAD_SANDBOX_${Math.random().toString(36).substring(2, 12)}`);
    setShowModal(true);
  };

  const handleInitiateOrder = async () => {
    if (!course) return;
    setProcessing(true);
    setModalError("");

    try {
      const enrollRes = await enrollmentApi.createEnrollment(course.id, user.username);
      const enrollData = enrollRes.data;
      setEnrollment(enrollData);

      const orderRes = await paymentApi.createOrder(
        enrollData.id,
        course.id,
        user.username,
        course.tuitionFee || 500.0,
        "INR"
      );
      const orderData = orderRes.data;
      setOrder(orderData);
      setStep("CHECKOUT");
    } catch (err) {
      console.error("Order initiation error:", err);
      setModalError(
        err.response?.data?.message || err.message || "Failed to initiate course enrollment order."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleCompleteSandboxPayment = async (simulatedSuccess = true) => {
    if (!order || !enrollment) return;
    setStep("VERIFYING");
    setProcessing(true);
    setModalError("");

    try {
      const paymentId = simulatedPaymentId || `pay_ACAD_SANDBOX_${Math.random().toString(36).substring(2, 12)}`;
      const signature = simulatedSuccess ? "simulated_valid_signature" : "invalid_signature_bad_hmac";

      const verifyRes = await paymentApi.verifyPayment(
        enrollment.id,
        order.orderId,
        paymentId,
        signature
      );

      const verifyData = verifyRes.data;

      if (verifyData.valid && verifyData.status === "SUCCESS") {
        setReceipt({
          enrollmentId: enrollment.id,
          courseTitle: course.title,
          tuitionFee: course.tuitionFee,
          status: "SUCCESS",
          transactionReference: verifyData.transactionReference || order.transactionReference,
          gatewayOrderId: order.orderId,
          gatewayPaymentId: paymentId,
        });
        setStep("SUCCESS");
        setAlreadyEnrolled(true);
        setEnrollmentStatus("ACTIVE");
      } else {
        setModalError(verifyData.message || "Server-side payment verification failed.");
        setStep("FAILED");
      }
    } catch (err) {
      console.error("Payment verification error:", err);
      setModalError(
        err.response?.data?.message || err.message || "Payment verification failed server-side."
      );
      setStep("FAILED");
    } finally {
      setProcessing(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEnrollment(null);
    setOrder(null);
    setStep("CONFIRM");
    setReceipt(null);
    setModalError("");
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
        <p className="text-gray-500">Loading course details...</p>
      </div>
    );
  }

  if (fetchError || !course) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-900/30">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">Course Not Found</h1>
        <p className="mb-6 text-gray-500 dark:text-gray-400">{fetchError || "The course you are looking for does not exist."}</p>
        <Link to="/student/courses" className="rounded-lg bg-brand-500 px-6 py-2.5 font-medium text-white shadow hover:bg-brand-600">
          Back to Courses
        </Link>
      </div>
    );
  }

  const seatsAvailable = course.availableSeats ?? course.capacity ?? 0;
  const isFull = seatsAvailable <= 0;
  const isActive = course.status !== "INACTIVE";
  const canEnroll = isActive && !isFull;

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-10">
      {/* Header section */}
      <div>
        <Link to="/student/courses" className="mb-4 inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Courses
        </Link>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                {course.courseCode || `ID: #${course.id}`}
              </span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}`}>
                {course.status || "ACTIVE"}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Instructor: <span className="font-semibold text-gray-800 dark:text-white">{course.instructor || course.instructorUsername || "Unassigned"}</span>
            </p>
          </div>
          
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:w-64">
            <p className="text-sm text-gray-500 dark:text-gray-400">Tuition Fee</p>
            <p className="my-2 text-3xl font-bold text-gray-900 dark:text-white">
              ${course.tuitionFee != null ? Number(course.tuitionFee).toFixed(2) : "0.00"}
            </p>
            
            {alreadyEnrolled ? (
              <div className="mt-4 rounded-lg bg-gray-100 py-2.5 px-4 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                Enrolled ({enrollmentStatus})
              </div>
            ) : !isActive ? (
              <div className="mt-4 rounded-lg bg-gray-100 py-2.5 px-4 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                Course Inactive
              </div>
            ) : isFull ? (
              <div className="mt-4 rounded-lg bg-red-100 py-2.5 px-4 text-sm font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                Course Full
              </div>
            ) : (
              <button
                onClick={handleEnrollClick}
                className="mt-4 w-full rounded-lg bg-brand-500 py-2.5 text-sm font-medium text-white shadow hover:bg-brand-600 transition"
              >
                Enroll Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">About this course</h2>
            <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300">
              <p className="whitespace-pre-wrap">{course.description || "No description provided."}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-white">Course Details</h3>
            <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-800">
                <span>Capacity</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{course.capacity || 0}</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-800">
                <span>Available Seats</span>
                <span className={`font-semibold ${isFull ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                  {seatsAvailable}
                </span>
              </li>
              {course.enrollmentDeadline && (
                <li className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-800">
                  <span>Enrollment Deadline</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {new Date(course.enrollmentDeadline).toLocaleDateString()}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal: AcademiaX Sandbox Gateway Checkout Flow */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
            {step === "CONFIRM" && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Course Enrollment Request
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Review tuition details before creating Gateway Order.
                </p>

                <div className="my-5 rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2 dark:border-gray-800 dark:bg-gray-800/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Course:</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{course.title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Student:</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{user?.username}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Authoritative Fee:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ${Number(course.tuitionFee || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {modalError && (
                  <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {modalError}
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    disabled={processing}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInitiateOrder}
                    disabled={processing}
                    className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-brand-600 disabled:opacity-50"
                  >
                    {processing ? "Initiating Order..." : "Proceed to Sandbox Order"}
                  </button>
                </div>
              </div>
            )}

            {step === "CHECKOUT" && (
              <div>
                <div className="mb-4 border-b border-gray-200 pb-4 dark:border-gray-800 text-center">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    ACADEMIAX SANDBOX
                  </h2>
                  <p className="text-xs font-semibold text-red-500 tracking-wider">
                    — NO REAL MONEY —
                  </p>
                </div>

                <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-800 dark:bg-gray-800/50 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order ID:</span>
                    <span className="font-mono font-medium">{order.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {order.currency} {order.amount / 100}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transaction Reference:</span>
                    <span className="font-mono">{order.transactionReference}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Generated Sandbox Payment ID:
                  </label>
                  <input
                    type="text"
                    value={simulatedPaymentId}
                    onChange={(e) => setSimulatedPaymentId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-mono text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleCompleteSandboxPayment(true)}
                    className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700"
                  >
                    Simulate Successful Sandbox Payment (SANDBOX_SUCCESS)
                  </button>
                  <button
                    onClick={() => handleCompleteSandboxPayment(false)}
                    className="w-full rounded-lg bg-red-100 py-2 text-xs font-semibold text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300"
                  >
                    Simulate Payment Failure / Bad Signature (SANDBOX_FAILURE)
                  </button>
                  <button
                    onClick={closeModal}
                    className="w-full rounded-lg border border-gray-300 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Cancel Checkout
                  </button>
                </div>
              </div>
            )}

            {step === "VERIFYING" && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  Verifying Payment Server-Side...
                </h3>
              </div>
            )}

            {step === "SUCCESS" && receipt && (
              <div>
                <div className="mb-4 text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Payment Verified & Captured!
                  </h2>
                </div>

                <div className="my-4 space-y-2 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-sm dark:border-emerald-800/40 dark:bg-emerald-950/20">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Enrollment ID:</span>
                    <span className="font-bold text-gray-900 dark:text-white">#{receipt.enrollmentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Course:</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{receipt.courseTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Payment Status:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">SUCCESS</span>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-medium text-white shadow hover:bg-brand-600"
                >
                  Close Receipt
                </button>
              </div>
            )}

            {step === "FAILED" && (
              <div>
                <div className="mb-4 text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Payment Verification Failed
                  </h2>
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {modalError || "Signature mismatch or checkout cancelled."}
                  </p>
                </div>

                <button
                  onClick={closeModal}
                  className="w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
