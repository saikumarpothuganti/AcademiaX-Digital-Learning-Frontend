import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/utils";
import React, { useEffect, useState } from "react";
import { CALENDAR_EVENT_LEVELS, } from "./types";
const CalendarEventModal = ({ isOpen, onClose, selectedEvent, initialStartDate = "", initialEndDate = "", onSave, }) => {
    const [eventTitle, setEventTitle] = useState("");
    const [eventStartDate, setEventStartDate] = useState("");
    const [eventEndDate, setEventEndDate] = useState("");
    const [eventLevel, setEventLevel] = useState("Primary");
    useEffect(() => {
        if (selectedEvent) {
            setEventTitle(selectedEvent.title || "");
            const startStr = typeof selectedEvent.start === "string"
                ? selectedEvent.start.split("T")[0]
                : selectedEvent.start instanceof Date
                    ? selectedEvent.start.toISOString().split("T")[0]
                    : "";
            const endStr = typeof selectedEvent.end === "string"
                ? selectedEvent.end.split("T")[0]
                : selectedEvent.end instanceof Date
                    ? selectedEvent.end.toISOString().split("T")[0]
                    : "";
            setEventStartDate(startStr);
            setEventEndDate(endStr || startStr);
            setEventLevel(selectedEvent.extendedProps?.calendar || "Primary");
        }
        else {
            setEventTitle("");
            setEventStartDate(initialStartDate);
            setEventEndDate(initialEndDate || initialStartDate);
            setEventLevel("Primary");
        }
    }, [selectedEvent, initialStartDate, initialEndDate, isOpen]);
    const handleSubmit = (e) => {
        e.preventDefault();
        const titleVal = eventTitle.trim() || (selectedEvent ? "Event" : "New Event");
        const startDateVal = eventStartDate;
        const endDateVal = eventEndDate || startDateVal;
        const levelVal = eventLevel || "Primary";
        onSave({
            title: titleVal,
            start: startDateVal,
            end: endDateVal,
            level: levelVal,
        });
    };
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, className: "max-w-175 p-4 sm:p-6 lg:p-10", children: _jsxs("form", { onSubmit: handleSubmit, className: "flex custom-scrollbar flex-col overflow-y-auto px-1 sm:px-2", children: [_jsxs("div", { children: [_jsx("h5", { className: "modal-title mb-2 text-theme-xl font-semibold text-gray-800 lg:text-2xl dark:text-white/90", children: selectedEvent ? "Edit Event" : "Add Event" }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Plan your next big moment: schedule or edit an event to stay on track" })] }), _jsxs("div", { className: "mt-8 space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "event-title", className: "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400", children: "Event Title" }), _jsx("input", { id: "event-title", type: "text", value: eventTitle, onChange: (e) => setEventTitle(e.target.value), className: "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-4 block text-sm font-medium text-gray-700 dark:text-gray-400", children: "Event Color" }), _jsx("div", { className: "flex flex-wrap items-center gap-3 sm:gap-4", children: Object.entries(CALENDAR_EVENT_LEVELS).map(([key, value]) => (_jsx("div", { className: "n-chk", children: _jsx("div", { className: `form-check form-check-${value} form-check-inline`, children: _jsxs("label", { className: "form-check-label flex items-center text-sm text-gray-700 dark:text-gray-400", htmlFor: `modal${key}`, children: [_jsxs("span", { className: "relative", children: [_jsx("input", { className: "form-check-input sr-only", type: "radio", name: "event-level", value: key, id: `modal${key}`, checked: eventLevel === key, onChange: () => setEventLevel(key) }), _jsx("span", { className: "box me-2 flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 dark:border-gray-700", children: _jsx("span", { className: cn("h-2 w-2 rounded-full bg-white", eventLevel === key ? "block" : "hidden") }) })] }), key] }) }) }, key))) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "event-start-date", className: "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400", children: "Enter Start Date" }), _jsx("div", { className: "relative", children: _jsx("input", { id: "event-start-date", type: "date", value: eventStartDate, onChange: (e) => setEventStartDate(e.target.value), className: "h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none py-2.5 ps-4 pe-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" }) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "event-end-date", className: "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400", children: "Enter End Date" }), _jsx("div", { className: "relative", children: _jsx("input", { id: "event-end-date", type: "date", value: eventEndDate, onChange: (e) => setEventEndDate(e.target.value), className: "h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none py-2.5 ps-4 pe-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" }) })] })] }), _jsxs("div", { className: "modal-footer mt-6 flex items-center gap-3 sm:justify-end", children: [_jsx("button", { onClick: onClose, type: "button", className: "modal-close-btn flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3", children: "Close" }), _jsx("button", { type: "submit", className: cn("flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto", selectedEvent ? "btn-update-event" : "btn-add-event"), children: selectedEvent ? "Update Changes" : "Add Event" })] })] }) }));
};
export default CalendarEventModal;
