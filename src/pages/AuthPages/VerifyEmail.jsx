import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/button/Button";
import PageMeta from "@/components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { verifyEmail } = useAuth();

  useEffect(() => {
    if (!token) {
      setError("No verification token provided.");
      setLoading(false);
      return;
    }

    verifyEmail(token)
      .then((res) => {
        setMessage(res.message || "Email verified successfully!");
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || "Email verification failed.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  return (
    <>
      <PageMeta title="Email Verification | AcademiaX" description="Verify your AcademiaX account email" />
      <AuthLayout>
        <div className="flex flex-1 flex-col justify-center items-center py-12">
          <div className="mx-auto w-full max-w-md text-center">
            <h1 className="mb-4 text-title-md font-semibold text-gray-800 dark:text-white/90">
              Email Verification
            </h1>

            {loading && (
              <p className="text-gray-500 dark:text-gray-400">Verifying your email token...</p>
            )}

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-400">
                {message}
              </div>
            )}

            {!loading && (
              <Link to="/signin">
                <Button size="sm">Go to Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
