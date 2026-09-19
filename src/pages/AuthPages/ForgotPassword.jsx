import React, { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/context/AuthContext";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import PageMeta from "@/components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      setMessage(res.message || "Password reset instructions have been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Forgot Password | AcademiaX" description="Reset your AcademiaX account password" />
      <AuthLayout>
        <div className="flex flex-1 flex-col">
          <div className="mx-auto w-full max-w-md pt-10">
            <Link
              to="/signin"
              className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ChevronLeftIcon className="size-5 rtl:rotate-180" />
              Back to Sign In
            </Link>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-6">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
                  Forgot Your Password?
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter your account email address to receive password reset instructions.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400">
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div>
                    <Label>
                      Email Address <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      placeholder="e.g. john@academiax.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Button className="w-full" size="sm" disabled={loading}>
                      {loading ? "Sending link..." : "Send Reset Link"}
                    </Button>
                  </div>
                </div>
              </form>

              <div className="mt-5">
                <p className="text-center text-sm text-gray-700 dark:text-gray-400">
                  Remembered your password?{" "}
                  <Link to="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
