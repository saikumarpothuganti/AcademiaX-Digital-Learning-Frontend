import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { courseApi, enrollmentApi, paymentApi } from "@/services/api";

export default function CourseCatalog() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Checkout & Modal state
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [order, setOrder] = useState(null);
  const [step, setStep] = useState("CONFIRM"); // CONFIRM -> CHECKOUT -> VERIFYING -> SUCCESS -> FAILED
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");

  // Sandbox mock payment inputs
  const [simulatedPaymentId, setSimulatedPaymentId] = useState("");

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
  }, []);

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setEnrollment(null);
    setOrder(null);
    setStep("CONFIRM");
    setReceipt(null);
    setError("");
    setSimulatedPaymentId(`pay_ACAD_${Math.random().toString(36).substring(2, 12)}`);
  };

  const handleInitiateOrder = async () => {
    if (!selectedCourse) return;
    setProcessing(true);
    setError("");

    try {
      // Step 1: Create Enrollment & Reserve Seat
      const enrollRes = await enrollmentApi.createEnrollment(selectedCourse.id, user.username);
      const enrollData = enrollRes.data;
      setEnrollment(enrollData);

      // Step 2: Create Gateway Order at backend with authoritative tuition fee
      const orderRes = await paymentApi.createOrder(
        enrollData.id,
        selectedCourse.id,
        user.username,
        selectedCourse.tuitionFee || 500.0,
        "INR"
      );
      const orderData = orderRes.data;
      setOrder(orderData);
      setStep("CHECKOUT");
    } catch (err) {
      console.error("Order initiation error:", err);
      setError(
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
    setError("");

    try {
      const paymentId = simulatedPaymentId || `pay_ACAD_${Math.random().toString(36).substring(2, 12)}`;
      // Signature for verification (using test mode signature string accepted by backend test double)
      const signature = simulatedSuccess ? "simulated_valid_signature" : "invalid_signature_bad_hmac";

      // Step 3: Server-side Verification
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
          courseTitle: selectedCourse.title,
          tuitionFee: selectedCourse.tuitionFee,
          status: "SUCCESS",
          transactionReference: verifyData.transactionReference || order.transactionReference,
          gatewayOrderId: order.orderId,
          gatewayPaymentId: paymentId,
        });
        setStep("SUCCESS");
        fetchCourses();
      } else {
        setError(verifyData.message || "Server-side payment verification failed.");
        setStep("FAILED");
      }
    } catch (err) {
      console.error("Payment verification error:", err);
      setError(
        err.response?.data?.message || err.message || "Payment verification failed server-side."
      );
      setStep("FAILED");
    } finally {
      setProcessing(false);
    }
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setEnrollment(null);
    setOrder(null);
    setStep("CONFIRM");
    setReceipt(null);
    setError("");
  };

  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Higher Education Course Catalog 📚
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Explore courses, inspect tuition fees, and complete enrollment via Razorpay Sandbox Payment Gateway.
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

            return (
              <div
                key={course.id}
                className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                      ID: #{course.id}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isFull
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      }`}
                    >
                      {isFull ? "FULL" : `${seatsAvailable} seats available`}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {course.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    Instructor: <span className="text-gray-700 dark:text-gray-300">{course.instructor || "Unassigned"}</span>
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

                  <button
                    onClick={() => handleEnrollClick(course)}
                    disabled={isFull}
                    className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                      isFull
                        ? "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                        : "bg-brand-500 text-white shadow hover:bg-brand-600"
                    }`}
                  >
                    {isFull ? "Course Full" : "Enroll & Pay Tuition"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Razorpay Gateway Sandbox Checkout Flow */}
      {selectedCourse && (
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
                    <span className="font-semibold text-gray-800 dark:text-white">{selectedCourse.title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Student:</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{user?.username}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Authoritative Fee:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ${Number(selectedCourse.tuitionFee || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {error}
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
                    {processing ? "Initiating Order..." : "Proceed to Gateway Order"}
                  </button>
                </div>
              </div>
            )}

            {step === "CHECKOUT" && order && (
              <div>
                <div className="mb-4 rounded-xl bg-blue-50 p-3 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  <span className="font-bold">Razorpay Sandbox / Test Mode Active</span> — No real money charged.
                </div>

                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  Razorpay Sandbox Checkout
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Order ID: <span className="font-mono text-gray-700 dark:text-gray-300">{order.orderId}</span>
                </p>

                <div className="my-4 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs dark:border-gray-800 dark:bg-gray-800/50">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gateway Key ID:</span>
                    <span className="font-mono">{order.keyId || "rzp_test_mock"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount in Subunits:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {order.amountInSubunits} paise
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transaction Reference:</span>
                    <span className="font-mono">{order.transactionReference}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Simulated Payment ID:
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
                    Simulate Successful Gateway Payment
                  </button>
                  <button
                    onClick={() => handleCompleteSandboxPayment(false)}
                    className="w-full rounded-lg bg-red-100 py-2 text-xs font-semibold text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300"
                  >
                    Simulate Payment Failure / Bad Signature
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
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Computing HMAC-SHA256 signature check & validating tuition amount.
                </p>
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Cryptographic HMAC-SHA256 signature verified server-side.
                  </p>
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
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Tuition Paid:</span>
                    <span className="font-bold text-gray-900 dark:text-white">${Number(receipt.tuitionFee || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-2 border-t border-emerald-200 dark:border-emerald-800/40">
                    <span className="text-gray-500">Transaction Ref:</span>
                    <span className="font-mono text-gray-700 dark:text-gray-300">{receipt.transactionReference}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Gateway Order ID:</span>
                    <span className="font-mono text-gray-700 dark:text-gray-300">{receipt.gatewayOrderId}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Gateway Payment ID:</span>
                    <span className="font-mono text-gray-700 dark:text-gray-300">{receipt.gatewayPaymentId}</span>
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
                    {error || "Signature mismatch or checkout cancelled."}
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={closeModal}
                    className="w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
