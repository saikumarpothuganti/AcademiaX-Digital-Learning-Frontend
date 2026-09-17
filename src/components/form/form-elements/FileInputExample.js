import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ComponentCard from "@/components/common/ComponentCard";
import FileInput from "@/components/form/input/FileInput";
import Label from "@/components/form/Label";
import { cn } from "@/utils";
import React from "react";
export default function FileInputExample() {
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Selected file:", file.name);
        }
    };
    return (_jsx(ComponentCard, { title: "File Input", children: _jsxs("div", { children: [_jsx(Label, { children: "Upload file" }), _jsx(FileInput, { onChange: handleFileChange, className: cn("custom-class") })] }) }));
}
