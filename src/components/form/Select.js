import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const Select = ({ options, placeholder = "Select an option", onChange, className = "", defaultValue = "", }) => {
    // Manage the selected value
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const handleChange = (e) => {
        const value = e.target.value;
        setSelectedValue(value);
        onChange(value); // Trigger parent handler
    };
    return (_jsxs("div", { className: "relative", children: [_jsxs("select", { className: `h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pe-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${selectedValue
                    ? "text-gray-800 dark:text-white/90"
                    : "text-gray-400 dark:text-gray-400"} ${className}`, value: selectedValue, onChange: handleChange, children: [_jsx("option", { value: "", disabled: true, className: "text-gray-700 dark:bg-gray-900 dark:text-gray-400", children: placeholder }), options.map((option) => (_jsx("option", { value: option.value, className: "text-gray-700 dark:bg-gray-900 dark:text-gray-400", children: option.label }, option.value)))] }), _jsx("svg", { className: "pointer-events-none absolute inset-e-3 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-400", width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M4.79175 8.02075L10.0001 13.2291L15.2084 8.02075", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) })] }));
};
export default Select;
