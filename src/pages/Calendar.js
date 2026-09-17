import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Calendar from "@/components/calendar/Calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/classic/palette.css";
import "@fullcalendar/react/themes/classic/theme.css";
export default function CalendarPage() {
    return (_jsxs("div", { children: [_jsx(PageMeta, { title: "React.js Calendar Dashboard | TailAdmin - React.js Admin Dashboard Template", description: "This is React.js Calendar Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template" }), _jsx(PageBreadcrumb, { pageTitle: "Calendar" }), _jsx(Calendar, {})] }));
}
