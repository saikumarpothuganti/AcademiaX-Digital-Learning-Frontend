import React, { useState, useEffect } from "react";
import { paymentApi } from "@/services/api";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [refundingId, setRefundingId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchAllPayments = async () => {
    try {
      setLoading(true);
      const res = await paymentApi.getAllPayments();
      setPayments(res.data || []);
    } catch (err) {
      console.error("Error fetching admin payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPayments();
  }, []);

  const handleRefund = async (paymentId) => {
    const reason = window.prompt("Enter refund reason for administrative record:", "Student requested refund");
    if (reason === null) return;

    setRefundingId(paymentId);
    setMessage("");

    try {
      await paymentApi.refundPayment(paymentId, reason);
      setMessage(`Payment #${paymentId} refunded successfully.`);
      fetchAllPayments();
    } catch (err) {
      console.error("Refund error:", err);
      setMessage(err.response?.data?.message || err.message || "Failed to process refund.");
    } finally {
      setRefundingId(null);
    }
  };

  const totalSystemRevenue = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const filteredPayments = payments.filter((p) => {
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    const matchesSearch =
      (p.studentUsername && p.studentUsername.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.transactionReference && p.transactionReference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.gatewayOrderId && p.gatewayOrderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.gatewayPaymentId && p.gatewayPaymentId.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Global Tuition Payments Audit Ledger 💰
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            System-wide tuition audit, gateway order IDs, and administrator refund management.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-right shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <span className="text-xs text-gray-500">Captured System Tuition Revenue</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            ${totalSystemRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {message && (
        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          {message}
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search by student, TxRef, gateway Order ID, or Payment ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-800 shadow-theme-xs outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>
      </div>

      {/* Payment Ledger Table */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No matching financial records found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Enrollment</th>
                  <th className="px-4 py-3">Transaction Ref</th>
                  <th className="px-4 py-3">Gateway Order ID</th>
                  <th className="px-4 py-3">Gateway Payment ID</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredPayments.map((p) => {
                  let statusBadgeClass = "bg-gray-100 text-gray-800";
                  if (p.status === "SUCCESS") statusBadgeClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
                  else if (p.status === "PENDING") statusBadgeClass = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
                  else if (p.status === "FAILED") statusBadgeClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
                  else if (p.status === "REFUNDED") statusBadgeClass = "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";

                  return (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        #{p.id}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800 dark:text-white">
                        {p.studentUsername || "Student"}
                      </td>
                      <td className="px-4 py-3">#{p.enrollmentId}</td>
                      <td className="px-4 py-3 font-mono text-xs">{p.transactionReference}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                        {p.gatewayOrderId || "N/A"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                        {p.gatewayPaymentId || "N/A"}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                        ${Number(p.amount || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {p.status === "SUCCESS" ? (
                          <button
                            onClick={() => handleRefund(p.id)}
                            disabled={refundingId === p.id}
                            className="rounded bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300"
                          >
                            {refundingId === p.id ? "Refunding..." : "Refund"}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
