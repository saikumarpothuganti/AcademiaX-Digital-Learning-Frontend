import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import { SliderHorizontalIcon } from "../../icons";
import Badge from "../ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../ui/table";
// Define the table data using the interface
const tableData = [
    {
        id: 1,
        name: "MacBook Pro 13”",
        variantsCount: 2,
        categoryKey: "laptop",
        price: "$2399.00",
        statusKey: "delivered",
        image: "/images/product/product-01.jpg",
    },
    {
        id: 2,
        name: "Apple Watch Ultra",
        variantsCount: 1,
        categoryKey: "watch",
        price: "$879.00",
        statusKey: "pending",
        image: "/images/product/product-02.jpg",
    },
    {
        id: 3,
        name: "iPhone 15 Pro Max",
        variantsCount: 2,
        categoryKey: "smartphone",
        price: "$1869.00",
        statusKey: "delivered",
        image: "/images/product/product-03.jpg",
    },
    {
        id: 4,
        name: "iPad Pro 3rd Gen",
        variantsCount: 2,
        categoryKey: "electronics",
        price: "$1699.00",
        statusKey: "canceled",
        image: "/images/product/product-04.jpg",
    },
    {
        id: 5,
        name: "AirPods Pro 2nd Gen",
        variantsCount: 1,
        categoryKey: "accessories",
        price: "$240.00",
        statusKey: "delivered",
        image: "/images/product/product-05.jpg",
    },
];
function formatVariants(template, count) {
    const pluralMatch = template.match(/\{count,\s*plural,\s*(.+)\}/);
    if (!pluralMatch)
        return template.replace(/\{count\}/g, String(count));
    const rules = pluralMatch[1];
    const map = {};
    const regex = /(\w+)\s*\{([^}]*)\}/g;
    let m;
    while ((m = regex.exec(rules)) !== null) {
        map[m[1]] = m[2];
    }
    let result = map.other || "";
    if (count === 1 && map.one) {
        result = map.one;
    }
    else if (count === 2 && map.two) {
        result = map.two;
    }
    else if (count >= 3 && count <= 10 && map.few) {
        result = map.few;
    }
    else if (map.many && count > 10) {
        result = map.many;
    }
    return result
        .replace(/#/g, String(count))
        .replace(/\{count\}/g, String(count));
}
export default function RecentOrders() {
    const { t } = useTranslation();
    const getBadgeColor = (status) => {
        switch (status) {
            case "delivered":
                return "success";
            case "pending":
                return "warning";
            case "canceled":
                return "error";
            default:
                return "primary";
        }
    };
    return (_jsxs("div", { className: "overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/3", children: [_jsxs("div", { className: "mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", children: [_jsx("div", { children: _jsx("h3", { className: "text-lg font-semibold text-gray-800 dark:text-white/90", children: t("ecommerce.recentOrders.title") }) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("button", { className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200", children: [_jsx(SliderHorizontalIcon, { className: "size-5" }), t("common.filter")] }), _jsx("button", { className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200", children: t("common.seeAll") })] })] }), _jsx("div", { className: "max-w-full overflow-x-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { className: "border-y border-gray-100 dark:border-gray-800", children: _jsxs(TableRow, { children: [_jsx(TableCell, { isHeader: true, className: "py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400", children: t("ecommerce.recentOrders.products") }), _jsx(TableCell, { isHeader: true, className: "py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400", children: t("ecommerce.recentOrders.category") }), _jsx(TableCell, { isHeader: true, className: "py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400", children: t("ecommerce.recentOrders.price") }), _jsx(TableCell, { isHeader: true, className: "py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400", children: t("ecommerce.recentOrders.status") })] }) }), _jsx(TableBody, { className: "divide-y divide-gray-100 dark:divide-gray-800", children: tableData.map((product) => (_jsxs(TableRow, { className: "", children: [_jsx(TableCell, { className: "py-3", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-12.5 w-12.5 overflow-hidden rounded-md", children: _jsx("img", { src: product.image, className: "h-12.5 w-12.5", alt: product.name }) }), _jsxs("div", { children: [_jsx("p", { className: "text-theme-sm font-medium text-gray-800 dark:text-white/90", children: product.name }), _jsx("span", { className: "text-theme-xs text-gray-500 dark:text-gray-400", children: formatVariants(t("ecommerce.recentOrders.variants"), product.variantsCount) })] })] }) }), _jsx(TableCell, { className: "py-3 text-theme-sm text-gray-500 dark:text-gray-400", children: t(`ecommerce.recentOrders.categories.${product.categoryKey}`) }), _jsx(TableCell, { className: "py-3 text-theme-sm text-gray-500 dark:text-gray-400", children: product.price }), _jsx(TableCell, { className: "py-3 text-theme-sm text-gray-500 dark:text-gray-400", children: _jsx(Badge, { size: "sm", color: getBadgeColor(product.statusKey), children: t(`ecommerce.recentOrders.statuses.${product.statusKey}`) }) })] }, product.id))) })] }) })] }));
}
