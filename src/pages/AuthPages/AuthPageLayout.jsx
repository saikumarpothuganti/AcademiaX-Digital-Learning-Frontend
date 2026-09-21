import React from "react";
import { Link } from "react-router";
import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

export default function AuthLayout({ children }) {
  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
      <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900">
        {children}
        <div className="hidden h-full w-full items-center bg-brand-950 lg:grid lg:w-1/2 dark:bg-white/5">
          <div className="relative z-1 flex items-center justify-center">
            <GridShape />
            <div className="flex max-w-xs flex-col items-center">
              <Link to="/" className="mb-4 block">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 font-bold text-white shadow-md text-2xl">
                  AX
                </div>
              </Link>
              <p className="text-center text-gray-400 dark:text-white/60">
                AcademiaX Digital Learning Platform
              </p>
            </div>
          </div>
        </div>
        <div className="fixed inset-e-6 bottom-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
