import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
export default function SidebarWidget() {
    const { t } = useTranslation();
    return (_jsx("div", { className: "pb-20", children: _jsxs("div", { className: "mx-auto w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/3", children: [_jsx("h3", { className: "mb-2 font-semibold text-gray-900 dark:text-white", children: t("sidebar.widget.title") }), _jsx("p", { className: "mb-4 text-theme-sm text-gray-500 dark:text-gray-400", children: t("sidebar.widget.description") }), _jsx("a", { href: "https://tailadmin.com/pricing", target: "_blank", rel: "nofollow", className: "flex items-center justify-center rounded-lg bg-brand-500 p-3 text-theme-sm font-medium text-white hover:bg-brand-600", children: t("sidebar.widget.purchasePlan") })] }) }));
}
