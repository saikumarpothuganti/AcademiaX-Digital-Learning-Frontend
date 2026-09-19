import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import PageMeta from "@/components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Missing or invalid reset token. Please request a new password reset link.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await resetPassword(token, newPassword);
      setMessage(res.message || "Password reset successfully! Redirecting to sign in...");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Password reset failed. Token may be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Reset Password | AcademiaX" description="Set a new password for your account" />
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
                  Reset Password
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter your new password below.
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
                      New Password <span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password (min 6 chars)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-e-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                        )}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Button className="w-full" size="sm" disabled={loading}>
                      {loading ? "Resetting password..." : "Reset Password"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
