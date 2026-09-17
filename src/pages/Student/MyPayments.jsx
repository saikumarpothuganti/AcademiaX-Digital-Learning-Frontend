import React, { useState, useEffect } from "react";
import { paymentApi } from "@/services/api";

export default function MyPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await paymentApi.getMyPayments();
        setPayments(res.data || []);
      } catch (err) {
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const totalPaid = payments
    .filter((p) => p.status === "PAID" || p.paymentStatus === "PAID")
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Tuition Payment History 💳
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Personal transaction ledger and receipt records for course enrollments.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-right shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <span className="text-xs text-gray-500">Cumulative Tuition Paid</span>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            ${totalPaid.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No payment transactions found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3">Transaction Ref</th>
                  <th className="px-4 py-3">Enrollment ID</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-mono font-medium text-gray-900 dark:text-white">
                      {p.txRef || p.transactionRef || `TX-ACAD-${p.id}`}
                    </td>
                    <td className="px-4 py-3 font-medium">#{p.enrollmentId}</td>
                    <td className="px-4 py-3">{p.studentUsername || "Me"}</td>
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                      ${Number(p.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      {p.paymentDate ? new Date(p.paymentDate).toLocaleString() : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {p.status || p.paymentStatus || "PAID"}
                      </span>
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
