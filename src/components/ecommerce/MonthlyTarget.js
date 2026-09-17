import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowDownIcon, ArrowUpIcon, MoreDotIcon } from "@/icons";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
const useTranslations = (prefix) => {
    const { t } = useTranslation("common", { keyPrefix: prefix });
    return t;
};
export default function MonthlyTarget() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations("ecommerce.monthlyTarget");
    const tCommon = useTranslations("common");
    const series = [75.55];
    const options = {
        colors: ["#465FFF"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "radialBar",
            height: 330,
            sparkline: {
                enabled: true,
            },
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                hollow: {
                    size: "80%",
                },
                track: {
                    background: "#E4E7EC",
                    strokeWidth: "100%",
                    margin: 5, // margin is in pixels
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        fontSize: "36px",
                        fontWeight: "600",
                        offsetY: -35,
                        color: "#1D2939",
                        formatter: function (val) {
                            return val + "%";
                        },
                    },
                },
            },
        },
        fill: {
            type: "solid",
            colors: ["#465FFF"],
        },
        stroke: {
            lineCap: "round",
        },
        labels: ["Progress"],
    };
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const closeDropdown = () => {
        setIsOpen(false);
    };
    return (_jsxs("div", { className: "rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/3", children: [_jsxs("div", { className: "shadow-default rounded-2xl bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 sm:pb-11 dark:bg-gray-900", children: [_jsxs("div", { className: "flex justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 dark:text-white/90", children: t("title") }), _jsx("p", { className: "mt-1 text-theme-sm font-normal text-gray-500 dark:text-gray-400", children: t("subtitle") })] }), _jsxs("div", { className: "relative h-fit", children: [_jsx("button", { onClick: toggleDropdown, className: "dropdown-toggle", children: _jsx(MoreDotIcon, { className: "text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" }) }), _jsxs(Dropdown, { isOpen: isOpen, onClose: closeDropdown, className: "w-40 p-2", children: [_jsx(DropdownItem, { onItemClick: closeDropdown, className: "flex w-full rounded-lg text-start font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300", children: tCommon("viewMore") }), _jsx(DropdownItem, { onItemClick: closeDropdown, className: "flex w-full rounded-lg text-start font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300", children: tCommon("delete") })] })] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "max-h-45 overflow-hidden", id: "chartDarkStyle", children: _jsx(ReactApexChart, { options: options, series: series, type: "radialBar", height: 330 }) }), _jsx("span", { className: "absolute bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500", children: "+10%" })] }), _jsx("p", { className: "mx-auto mt-4.5 w-full max-w-95 text-center text-sm text-gray-500 sm:text-base dark:text-gray-400", children: t("earned", { amount: "$3287" }) })] }), _jsxs("div", { className: "flex items-center justify-center gap-5 px-6 py-3 sm:gap-8 sm:py-5", children: [_jsxs("div", { children: [_jsx("p", { className: "mb-1 text-center text-theme-xs text-gray-500 sm:text-sm dark:text-gray-400", children: t("target") }), _jsxs("p", { className: "flex items-center justify-center gap-1 text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90", children: ["$20K", _jsx(ArrowDownIcon, { className: "text-error-600" })] })] }), _jsx("div", { className: "h-7 w-px bg-gray-200 dark:bg-gray-800" }), _jsxs("div", { children: [_jsx("p", { className: "mb-1 text-center text-theme-xs text-gray-500 sm:text-sm dark:text-gray-400", children: t("revenue") }), _jsxs("p", { className: "flex items-center justify-center gap-1 text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90", children: ["$20K", _jsx(ArrowUpIcon, { className: "text-success-600" })] })] }), _jsx("div", { className: "h-7 w-px bg-gray-200 dark:bg-gray-800" }), _jsxs("div", { children: [_jsx("p", { className: "mb-1 text-center text-theme-xs text-gray-500 sm:text-sm dark:text-gray-400", children: t("today") }), _jsxs("p", { className: "flex items-center justify-center gap-1 text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90", children: ["$20K", _jsx(ArrowUpIcon, { className: "text-success-600" })] })] })] })] }));
}
