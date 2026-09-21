import React from "react";
import { Link } from "react-router";
import PageMeta from "@/components/common/PageMeta";
import GridShape from "@/components/common/GridShape";

export default function NotFound({ className }) {
  return (
    <>
      <PageMeta title="404 Not Found | AcademiaX Digital Learning" description="Page not found on AcademiaX" />
      <div className={`relative z-1 flex min-h-screen flex-col items-center justify-center overflow-hidden p-6 ${className || ""}`}>
        <GridShape />
        <div className="mx-auto w-full max-w-60 text-center sm:max-w-118">
          <h1 className="mb-8 text-title-md font-bold text-gray-800 xl:text-title-2xl dark:text-white/90">ERROR 404</h1>
          <p className="mt-10 mb-6 text-base text-gray-700 sm:text-lg dark:text-gray-400">
            We can't seem to find the page you are looking for!
          </p>
          <Link to="/" className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200">
            Back to Home Page
          </Link>
        </div>
        <p className="absolute inset-x-0 bottom-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} - AcademiaX Digital Learning
        </p>
      </div>
    </>
  );
}
