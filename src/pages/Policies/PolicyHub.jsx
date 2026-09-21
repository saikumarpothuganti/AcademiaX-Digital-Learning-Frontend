import React, { useState } from "react";
import { useParams, Link } from "react-router";

const POLICIES = [
  {
    id: "terms",
    title: "1. Terms & Conditions",
    icon: "📜",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Terms & Conditions</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Welcome to AcademiaX Digital Learning. By accessing or using this educational portal, you agree to comply with and be bound by these Terms and Conditions.
        </p>
        <div className="rounded-xl bg-amber-50 p-4 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-300">
          <strong>Academic & Sandbox Disclaimer:</strong> AcademiaX Digital Learning is an academic microservices demonstration platform. The payment gateway integrated herein is an internal <strong>Provider-Independent Sandbox Gateway</strong> designed exclusively for local testing, educational demonstrations, and evaluation. No real currency or monetary transactions occur on this platform.
        </div>
        <ul className="list-disc pl-5 text-sm space-y-2 text-gray-600 dark:text-gray-300">
          <li>Accounts and enrollments are created strictly for academic course evaluation.</li>
          <li>Users must not enter real credit card numbers, CVVs, net banking passwords, or UPI PINs into any payment fields.</li>
          <li>We reserve the right to reset sandbox test data during maintenance cycles.</li>
        </ul>
      </div>
    )
  },
  {
    id: "privacy",
    title: "2. Privacy Policy",
    icon: "🔒",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Privacy Policy</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          This Privacy Policy outlines how user account and enrollment information is collected, stored, and processed within AcademiaX Digital Learning.
        </p>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <h4 className="font-semibold text-gray-800 dark:text-white">Data Collected:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>User account credentials (username, email, role, BCrypt-hashed password).</li>
            <li>Course enrollment records (course ID, enrollment date, status).</li>
            <li>Sandbox payment logs (simulated transaction references, amounts, and sandbox order IDs).</li>
          </ul>
          <h4 className="font-semibold text-gray-800 dark:text-white mt-3">Data Usage & Protection:</h4>
          <p>
            Your data is stored securely in dedicated PostgreSQL microservice databases with role-based access control. We do not sell, share, or monetize user data with third-party advertising networks.
          </p>
        </div>
      </div>
    )
  },
  {
    id: "payment-billing",
    title: "3. Payment & Billing Policy",
    icon: "💳",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Payment & Billing Policy</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          AcademiaX Digital Learning uses an internal <strong>Sandbox Payment Gateway</strong> (`PAYMENT_GATEWAY=sandbox`) to simulate course tuition payments.
        </p>
        <div className="rounded-xl bg-blue-50 p-4 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/40 text-xs text-blue-900 dark:text-blue-300 space-y-2">
          <p><strong>Sandbox Billing Specifications:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>All tuition fees shown (e.g. $499.99, $750.00) are authoritatively validated server-side by the Course & Payment Microservices.</li>
            <li>Sandbox orders generate unique identifiers (e.g. <code>order_ACAD_SANDBOX_...</code>) for verification.</li>
            <li>No real bank account, card issuer, or payment aggregator is charged.</li>
            <li>Production payment processing is disabled unless an approved real-world provider is configured.</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: "refund-cancellation",
    title: "4. Refund & Cancellation Policy",
    icon: "↩️",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Refund & Cancellation Policy</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          This policy defines the rules governing course tuition refunds and enrollment cancellations.
        </p>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <h4 className="font-semibold text-gray-800 dark:text-white">Refund Eligibility & Rules:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Only authorized Administrators (<code>ROLE_ADMIN</code>) can initiate payment refunds.</li>
            <li>Refunds can only be executed on payments with status <strong>SUCCESS</strong>.</li>
            <li>Once refunded, the payment transitions to status <strong>REFUNDED</strong> and cannot be refunded a second time (Idempotent enforcement).</li>
            <li>In the sandbox environment, refund requests update server audit logs and adjust system captured revenue without real financial movement.</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: "enrollment",
    title: "5. Course Enrollment Policy",
    icon: "📚",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Course Enrollment Policy</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Course enrollments are managed by the Enrollment Microservice with strict seat reservation rules.
        </p>
        <ul className="list-disc pl-5 text-sm space-y-2 text-gray-600 dark:text-gray-300">
          <li><strong>Capacity Constraints:</strong> Students cannot enroll in courses that have reached 0 available seats.</li>
          <li><strong>Duplicate Protection:</strong> Multiple active successful enrollments for the same student in the same course are prevented.</li>
          <li><strong>Seat Allocation:</strong> Seat reservation is synchronized with payment verification to prevent booking collisions.</li>
        </ul>
      </div>
    )
  },
  {
    id: "account",
    title: "6. User Account Policy",
    icon: "👤",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">User Account Policy</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          AcademiaX supports three distinct user roles: <code>STUDENT</code>, <code>INSTRUCTOR</code>, and <code>ADMIN</code>.
        </p>
        <ul className="list-disc pl-5 text-sm space-y-2 text-gray-600 dark:text-gray-300">
          <li><strong>Role Isolation:</strong> Students can access their own catalog, enrollments, and payments. Instructors manage their assigned courses. Admins oversee global catalog, enrollments, and payment ledgers.</li>
          <li><strong>Account Integrity:</strong> Users must provide valid credentials. Impersonation of another user or role escalation is strictly forbidden.</li>
        </ul>
      </div>
    )
  },
  {
    id: "security",
    title: "7. Security Policy",
    icon: "🛡️",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Security Policy</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          AcademiaX implements multi-layered security controls across API Gateway and microservices.
        </p>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50 space-y-2 text-xs text-gray-700 dark:text-gray-300">
          <p><strong>High-Level Security Architecture:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Authentication:</strong> Stateless JWT authentication issued by Auth Service.</li>
            <li><strong>Authorization:</strong> Role-Based Access Control (RBAC) enforced at Spring Security level.</li>
            <li><strong>Password Storage:</strong> BCrypt salted password hashing.</li>
            <li><strong>Sandbox Verification:</strong> Server-side HMAC-SHA256 signature calculation using <code>SANDBOX_PAYMENT_SECRET</code>.</li>
            <li><strong>Input Validation:</strong> Server-side DTO validation ensuring payment amounts and ownership cannot be tampered with by clients.</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: "grievance",
    title: "8. Grievance Redressal Policy",
    icon: "⚖️",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Grievance Redressal Policy</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Users experiencing technical issues with course access, enrollment status, or sandbox payment simulation may file an academic support request.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Grievances are processed by the System Administrator within 2 business days during academic project evaluation sessions.
        </p>
      </div>
    )
  },
  {
    id: "contact",
    title: "9. Contact / Support Policy",
    icon: "📞",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Contact & Academic Support</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          For questions regarding AcademiaX Digital Learning project design, SOA architecture, or sandbox testing:
        </p>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-800 dark:bg-gray-800/50 space-y-1 text-gray-700 dark:text-gray-300">
          <p><strong>Department:</strong> SOA Programming and Microservices Project</p>
          <p><strong>Project Name:</strong> AcademiaX Digital Learning (PS035)</p>
          <p><strong>Email Support:</strong> support@academiax.edu (Academic Sandbox Helpdesk)</p>
        </div>
      </div>
    )
  },
  {
    id: "academic-access",
    title: "10. Academic / Course Access Policy",
    icon: "🎓",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Academic / Course Access Policy</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Course access is granted immediately upon successful sandbox payment verification (status <code>SUCCESS</code>).
        </p>
        <ul className="list-disc pl-5 text-sm space-y-2 text-gray-600 dark:text-gray-300">
          <li>Enrolled students retain access to registered course materials throughout the active semester.</li>
          <li>If a refund is processed by an Administrator, course enrollment status is audited accordingly.</li>
        </ul>
      </div>
    )
  },
  {
    id: "payment-failure",
    title: "11. Payment Failure Policy",
    icon: "⚠️",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Payment Failure Policy</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          If a sandbox payment verification fails (e.g. invalid HMAC signature or simulated failure request):
        </p>
        <ul className="list-disc pl-5 text-sm space-y-2 text-gray-600 dark:text-gray-300">
          <li>The payment record is assigned status <strong>FAILED</strong> with a recorded failure reason.</li>
          <li>No course enrollment is confirmed for failed transactions.</li>
          <li>Students may re-attempt order creation and checkout from the Course Catalog.</li>
        </ul>
      </div>
    )
  },
  {
    id: "dispute",
    title: "12. Dispute / Chargeback Policy",
    icon: "📢",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Dispute & Chargeback Policy</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Because AcademiaX Digital Learning uses a simulated sandbox gateway and does not process real banking transactions or credit card charges, financial chargebacks do not apply.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Any discrepancies in simulated ledger records can be resolved directly by contacting the System Administrator.
        </p>
      </div>
    )
  },
  {
    id: "data-retention",
    title: "13. Data Retention & Deletion Policy",
    icon: "🗑️",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Data Retention & Deletion Policy</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Academic audit logs, user profiles, course records, and sandbox transaction histories are retained in PostgreSQL microservice databases for project evaluation purposes.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Test data can be purged or reset by running authorized microservice migration scripts.
        </p>
      </div>
    )
  }
];

export default function PolicyHub() {
  const { policyType } = useParams();
  const activePolicyId = policyType || "terms";

  const currentPolicy = POLICIES.find(p => p.id === activePolicyId) || POLICIES[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          AcademiaX Institutional & Payment Policies 📋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Governance, Security, Sandbox Payment Terms, and Institutional Guidelines.
        </p>
      </div>

      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 dark:bg-emerald-900/20 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-300">
        <strong>Academic Sandbox Disclaimer:</strong> AcademiaX Digital Learning is an academic microservices application. Payments are simulated using an internal Sandbox Payment Gateway. No real currency is moved, and no financial merchant or regulatory certification (RBI, PCI-DSS) is claimed or required for sandbox operation.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-1 rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p className="px-3 py-2 text-xs font-semibold uppercase text-gray-400">Policy Categories</p>
          {POLICIES.map((p) => {
            const isActive = p.id === activePolicyId;
            return (
              <Link
                key={p.id}
                to={`/policies/${p.id}`}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  isActive
                    ? "bg-brand-500 text-white shadow-xs"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <span>{p.icon}</span>
                <span className="truncate">{p.title}</span>
              </Link>
            );
          })}
        </div>

        {/* Policy Content View */}
        <div className="md:col-span-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          {currentPolicy.content}
        </div>
      </div>
    </div>
  );
}
