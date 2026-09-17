import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import DangerZone from "@/components/UserProfile/DangerZone";
import Security from "@/components/UserProfile/Security";
import UserAddressCard from "@/components/UserProfile/UserAddressCard";
import UserMetaCard from "@/components/UserProfile/UserMetaCard";
export default function UserProfiles() {
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "React.js Profile Dashboard | TailAdmin - React.js Admin Dashboard Template", description: "This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template" }), _jsx(PageBreadcrumb, { pageTitle: "Profile" }), _jsxs("div", { className: "rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3", children: [_jsx("h3", { className: "mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90", children: "Profile" }), _jsxs("div", { className: "space-y-6", children: [_jsx(UserMetaCard, {}), _jsx(UserAddressCard, {}), _jsx(Security, {}), _jsx(DangerZone, {})] })] })] }));
}
