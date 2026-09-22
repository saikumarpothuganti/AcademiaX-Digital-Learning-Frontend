import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, ssoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(username, email, password, role);
      setSuccess("Account registered successfully! Redirecting to Sign In...");
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } catch (err) {
      console.error("Registration failed:", err);
      setError(
        err.response?.data?.message || err.message || "Registration failed. Username or email may already be in use."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSsoSignUp = async (provider) => {
    setError("");
    setLoading(true);
    try {
      await ssoLogin(provider);
      // Keycloak handles redirect/popup flow. AuthContext useEffect will catch the user on success.
    } catch (err) {
      setError(err.response?.data?.message || err.message || `Failed to sign up with ${provider}.`);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-md pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5 rtl:rotate-180" />
          Back to home
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-6">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
              Create your AcademiaX Account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Join AcademiaX as a Student, Instructor, or Administrator.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-400">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 mb-6">
            <button
              type="button"
              onClick={() => handleSsoSignUp("google")}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4"/>
                <path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853"/>
                <path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05"/>
                <path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335"/>
              </svg>
              Google SSO
            </button>
            <button
              type="button"
              onClick={() => handleSsoSignUp("microsoft")}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
            >
              <svg width="18" height="18" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h11v11H0z" fill="#f25022"/>
                <path d="M12 0h11v11H12z" fill="#7fba00"/>
                <path d="M0 12h11v11H0z" fill="#00a4ef"/>
                <path d="M12 12h11v11H12z" fill="#ffb900"/>
              </svg>
              Microsoft SSO
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 dark:bg-gray-900">Or email & password</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <Label>
                  Username <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. john_doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
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
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                <Label>
                  Account Role <span className="text-error-500">*</span>
                </Label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                >
                  <option value="STUDENT">Student (Enroll & Pay Tuition)</option>
                  <option value="INSTRUCTOR">Instructor (Manage & Create Courses)</option>
                  <option value="ADMIN">Administrator (Platform Audit & Ledger)</option>
                </select>
              </div>

              <div>
                <Button className="w-full" size="sm" disabled={loading}>
                  {loading ? "Creating Account..." : "Sign Up"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
