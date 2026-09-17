import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import React from "react";
import { Link } from "react-router";
export default function AuthLayout({ children, }) {
    return (_jsx("div", { className: "relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900", children: _jsxs("div", { className: "relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900", children: [children, _jsx("div", { className: "hidden h-full w-full items-center bg-brand-950 lg:grid lg:w-1/2 dark:bg-white/5", children: _jsxs("div", { className: "relative z-1 flex items-center justify-center", children: [_jsx(GridShape, {}), _jsxs("div", { className: "flex max-w-xs flex-col items-center", children: [_jsx(Link, { to: "/", className: "mb-4 block", children: _jsx("img", { width: 231, height: 48, src: "/images/logo/auth-logo.svg", alt: "Logo" }) }), _jsx("p", { className: "text-center text-gray-400 dark:text-white/60", children: "Free and Open-Source Tailwind CSS Admin Dashboard Template" })] })] }) }), _jsx("div", { className: "fixed inset-e-6 bottom-6 z-50 hidden sm:block", children: _jsx(ThemeTogglerTwo, {}) })] }) }));
}
