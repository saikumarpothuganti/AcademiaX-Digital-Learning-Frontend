import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { cn } from "@/utils";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import Backdrop from "./Backdrop";
const LayoutContent = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
    return (_jsxs("div", { className: "min-h-screen xl:flex", children: [_jsx(AppSidebar, {}), _jsx(Backdrop, {}), _jsxs("div", { className: cn("flex-1 transition-[margin] duration-300 ease-in-out", isExpanded || isHovered ? "xl:ms-72.5" : "xl:ms-22.5", isMobileOpen ? "ms-0" : ""), children: [_jsx(AppHeader, {}), _jsx("main", { className: "mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6", children: _jsx(Outlet, {}) })] })] }));
};
const AppLayout = () => {
    return (_jsx(SidebarProvider, { children: _jsx(LayoutContent, {}) }));
};
export default AppLayout;
