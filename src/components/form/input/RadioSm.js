import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/utils";
const RadioSm = ({ id, name, value, checked, label, onChange, className = "", }) => {
    return (_jsxs("label", { htmlFor: id, className: cn("flex cursor-pointer items-center text-sm text-gray-500 select-none dark:text-gray-400", className), children: [_jsxs("span", { className: "relative", children: [_jsx("input", { type: "radio", id: id, name: name, value: value, checked: checked, onChange: () => onChange(value), className: "sr-only" }), _jsx("span", { className: cn("me-2 flex h-4 w-4 items-center justify-center rounded-full border", checked
                            ? "border-brand-500 bg-brand-500"
                            : "border-gray-300 bg-transparent dark:border-gray-700"), children: _jsx("span", { className: cn("h-1.5 w-1.5 rounded-full", checked ? "bg-white" : "bg-white dark:bg-[#1e2636]") }) })] }), label] }));
};
export default RadioSm;
