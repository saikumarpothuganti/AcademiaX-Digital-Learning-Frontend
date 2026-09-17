import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useSidebar } from "@/context/SidebarContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { BoxCubeIcon, CalenderIcon, ChevronDownIcon, GridIcon, HorizontaLDots, ListIcon, PageIcon, PieChartIcon, PlugInIcon, TableIcon, UserCircleIcon, } from "../icons";
import { cn } from "../utils";
import SidebarWidget from "./SidebarWidget";
const navItems = [
    {
        icon: _jsx(GridIcon, { fontSize: 24 }),
        name: "Dashboard",
        key: "dashboard",
        subItems: [{ name: "Ecommerce", key: "ecommerceHome", path: "/" }],
    },
    {
        icon: _jsx(CalenderIcon, { fontSize: 24 }),
        name: "Calendar",
        key: "calendar",
        path: "/calendar",
    },
    {
        icon: _jsx(UserCircleIcon, { fontSize: 24 }),
        name: "User Profile",
        key: "userProfile",
        path: "/profile",
    },
    {
        name: "Forms",
        key: "forms",
        icon: _jsx(ListIcon, { fontSize: 24 }),
        subItems: [
            {
                name: "Form Elements",
                key: "formElements",
                path: "/form-elements",
                pro: false,
            },
        ],
    },
    {
        name: "Tables",
        key: "tables",
        icon: _jsx(TableIcon, { fontSize: 24 }),
        subItems: [
            {
                name: "Basic Tables",
                key: "basicTables",
                path: "/basic-tables",
                pro: false,
            },
        ],
    },
    {
        name: "Pages",
        key: "pages",
        icon: _jsx(PageIcon, { fontSize: 24 }),
        subItems: [{ name: "Blank Page", key: "blankPage", path: "/blank" }],
    },
];
const othersItems = [
    {
        icon: _jsx(PieChartIcon, { fontSize: 24 }),
        name: "Charts",
        key: "charts",
        subItems: [
            { name: "Line Chart", key: "lineChart", path: "/line-chart" },
            { name: "Bar Chart", key: "barChart", path: "/bar-chart" },
        ],
    },
    {
        icon: _jsx(BoxCubeIcon, { fontSize: 24 }),
        name: "UI Elements",
        key: "uiElements",
        subItems: [
            { name: "Alerts", key: "alerts", path: "/alerts", pro: false },
            { name: "Avatar", key: "avatar", path: "/avatars", pro: false },
            { name: "Badge", key: "badge", path: "/badge", pro: false },
            { name: "Buttons", key: "buttons", path: "/buttons", pro: false },
            { name: "Images", key: "images", path: "/images", pro: false },
            { name: "Videos", key: "videos", path: "/videos", pro: false },
        ],
    },
    {
        icon: _jsx(PlugInIcon, { fontSize: 24 }),
        name: "Authentication",
        key: "authentication",
        subItems: [
            { name: "Sign In", key: "signIn", path: "/signin", pro: false },
            { name: "Sign Up", key: "signUp", path: "/signup", pro: false },
        ],
    },
];
const AppSidebar = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered, setIsMobileOpen } = useSidebar();
    const { t } = useTranslation();
    const location = useLocation();
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [subMenuHeight, setSubMenuHeight] = useState({});
    const subMenuRefs = useRef({});
    // Auto-close sidebar on mobile after route change
    useEffect(() => {
        if (isMobileOpen) {
            setIsMobileOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);
    // const isActive = (path: string) => location.pathname === path;
    const isActive = useCallback((path) => location.pathname === path, [location.pathname]);
    useEffect(() => {
        let submenuMatched = false;
        ["main", "others"].forEach((menuType) => {
            const items = menuType === "main" ? navItems : othersItems;
            items.forEach((nav, index) => {
                if (nav.subItems) {
                    nav.subItems.forEach((subItem) => {
                        if (isActive(subItem.path)) {
                            setOpenSubmenu({
                                type: menuType,
                                index,
                            });
                            submenuMatched = true;
                        }
                    });
                }
            });
        });
        if (!submenuMatched) {
            setOpenSubmenu(null);
        }
    }, [location, isActive]);
    useEffect(() => {
        if (openSubmenu !== null) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prevHeights) => ({
                    ...prevHeights,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);
    const handleSubmenuToggle = (index, menuType) => {
        setOpenSubmenu((prevOpenSubmenu) => {
            if (prevOpenSubmenu &&
                prevOpenSubmenu.type === menuType &&
                prevOpenSubmenu.index === index) {
                return null;
            }
            return { type: menuType, index };
        });
    };
    const renderMenuItems = (items, menuType) => (_jsx("ul", { className: "flex flex-col gap-1", children: items.map((nav, index) => (_jsxs("li", { children: [nav.subItems ? (_jsxs("button", { onClick: () => handleSubmenuToggle(index, menuType), className: `group menu-item ${openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? "menu-item-active"
                        : "menu-item-inactive"} cursor-pointer ${!isExpanded && !isHovered
                        ? "xl:justify-center"
                        : "xl:justify-start"}`, children: [_jsx("span", { className: `menu-item-icon-size ${openSubmenu?.type === menuType && openSubmenu?.index === index
                                ? "menu-item-icon-active"
                                : "menu-item-icon-inactive"}`, children: nav.icon }), (isExpanded || isHovered || isMobileOpen) && (_jsx("span", { className: "menu-item-text", children: nav.key ? t(`sidebar.items.${nav.key}`) : nav.name })), nav.new && (isExpanded || isHovered || isMobileOpen) && (_jsx("span", { className: `absolute inset-e-10 ms-auto ${openSubmenu?.type === menuType &&
                                openSubmenu?.index === index
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"} menu-dropdown-badge`, children: t("sidebar.badges.new") })), (isExpanded || isHovered || isMobileOpen) && (_jsx(ChevronDownIcon, { className: `ms-auto h-5 w-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                                openSubmenu?.index === index
                                ? "rotate-180 text-brand-500"
                                : ""}` }))] })) : (nav.path && (_jsxs(Link, { to: nav.path, target: nav.target, className: `group menu-item ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`, children: [_jsx("span", { className: `menu-item-icon-size ${isActive(nav.path)
                                ? "menu-item-icon-active"
                                : "menu-item-icon-inactive"}`, children: nav.icon }), (isExpanded || isHovered || isMobileOpen) && (_jsx("span", { className: "menu-item-text", children: nav.key ? t(`sidebar.items.${nav.key}`) : nav.name }))] }))), nav.subItems && (isExpanded || isHovered || isMobileOpen) && (_jsx("div", { ref: (el) => {
                        subMenuRefs.current[`${menuType}-${index}`] = el;
                    }, className: "overflow-hidden transition-all duration-300", style: {
                        height: openSubmenu?.type === menuType && openSubmenu?.index === index
                            ? `${subMenuHeight[`${menuType}-${index}`]}px`
                            : "0px",
                    }, children: _jsx("ul", { className: "ms-9 mt-2 space-y-1", children: nav.subItems.map((subItem) => (_jsx("li", { children: _jsxs(Link, { to: subItem.path, target: subItem.target, className: `menu-dropdown-item ${isActive(subItem.path)
                                    ? "menu-dropdown-item-active"
                                    : "menu-dropdown-item-inactive"}`, children: [subItem.key
                                        ? t(`sidebar.items.${subItem.key}`)
                                        : subItem.name, _jsxs("span", { className: "ms-auto flex items-center gap-1", children: [subItem.new && (_jsx("span", { className: `ms-auto ${isActive(subItem.path)
                                                    ? "menu-dropdown-badge-active"
                                                    : "menu-dropdown-badge-inactive"} menu-dropdown-badge`, children: t("sidebar.badges.new") })), subItem.pro && (_jsx("span", { className: `ms-auto ${isActive(subItem.path)
                                                    ? "menu-dropdown-badge-pro-active"
                                                    : "menu-dropdown-badge-pro-inactive"} menu-dropdown-badge-pro`, children: t("sidebar.badges.pro") }))] })] }) }, subItem.name))) }) }))] }, nav.name))) }));
    return (_jsxs("aside", { className: cn("fixed inset-s-0 top-0 z-50 flex h-screen flex-col border-e border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out xl:translate-x-0 xl:rtl:translate-x-0 dark:border-gray-800 dark:bg-gray-900", isExpanded || isMobileOpen ? "w-72.5" : isHovered ? "w-72.5" : "w-22.5", isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full rtl:translate-x-full"), onMouseEnter: () => !isExpanded && setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [_jsx("div", { className: cn("flex py-8", !isExpanded && !isHovered ? "xl:justify-center" : "justify-start"), children: _jsx(Link, { to: "/", children: isExpanded || isHovered || isMobileOpen ? (_jsxs(_Fragment, { children: [_jsx("img", { className: "dark:hidden", src: "/images/logo/logo.svg", alt: "Logo", width: 150, height: 40 }), _jsx("img", { className: "hidden dark:block", src: "/images/logo/logo-dark.svg", alt: "Logo", width: 150, height: 40 })] })) : (_jsx("img", { src: "/images/logo/logo-icon.svg", alt: "Logo", width: 32, height: 32 })) }) }), _jsxs("div", { className: "no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear", children: [_jsx("nav", { className: "mb-6", children: _jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: `mb-4 flex text-xs leading-5 text-gray-400 uppercase ${!isExpanded && !isHovered
                                                ? "xl:justify-center"
                                                : "justify-start"}`, children: isExpanded || isHovered || isMobileOpen ? (t("sidebar.groups.menu")) : (_jsx(HorizontaLDots, { className: "size-6" })) }), renderMenuItems(navItems, "main")] }), _jsxs("div", { children: [_jsx("h2", { className: `mb-4 flex text-xs leading-5 text-gray-400 uppercase ${!isExpanded && !isHovered
                                                ? "xl:justify-center"
                                                : "justify-start"}`, children: isExpanded || isHovered || isMobileOpen ? (t("sidebar.groups.others")) : (_jsx(HorizontaLDots, { className: "size-6" })) }), renderMenuItems(othersItems, "others")] })] }) }), isExpanded || isHovered || isMobileOpen ? _jsx(SidebarWidget, {}) : null] })] }));
};
export default AppSidebar;
