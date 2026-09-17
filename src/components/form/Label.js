import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/utils";
const Label = ({ htmlFor, children, className }) => {
    return (_jsx("label", { htmlFor: htmlFor, className: cn("mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400", className), children: children }));
};
export default Label;
