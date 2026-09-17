import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { EyeIcon, TrashBinIcon, UploadIcon } from "@/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import ComponentCard from "../../common/ComponentCard";
export default function DropzoneComponent() {
    const [files, setFiles] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const { isOpen, openModal, closeModal } = useModal();
    // Keep a ref always pointing at the latest files so the unmount cleanup
    // can revoke all object URLs without needing `files` as a dependency.
    const filesRef = useRef(files);
    useEffect(() => {
        filesRef.current = files;
    }, [files]);
    const onDrop = useCallback((acceptedFiles) => {
        setFiles((prevFiles) => [
            ...prevFiles,
            ...acceptedFiles.map((file) => Object.assign(file, {
                preview: file.type.startsWith("image/")
                    ? URL.createObjectURL(file)
                    : undefined,
            })),
        ]);
    }, []);
    const removeFile = (fileName) => {
        setFiles((prevFiles) => {
            const target = prevFiles.find((f) => f.name === fileName);
            if (target?.preview) {
                URL.revokeObjectURL(target.preview);
            }
            return prevFiles.filter((f) => f.name !== fileName);
        });
    };
    const handleOpenPreview = (file) => {
        setPreviewImage(file);
        openModal();
    };
    const handleClosePreview = () => {
        closeModal();
        setPreviewImage(null);
    };
    // Revoke all object URLs only when the component unmounts to prevent memory leaks.
    // Using an empty dependency array ensures cleanup does NOT run after every drop,
    // which would revoke URLs immediately and break the preview images.
    useEffect(() => {
        return () => {
            filesRef.current.forEach((file) => {
                if (file.preview)
                    URL.revokeObjectURL(file.preview);
            });
        };
    }, []);
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, isFocused, } = useDropzone({
        onDrop,
        accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpg", ".jpeg"],
            "image/webp": [".webp"],
            "image/svg+xml": [".svg"],
        },
        maxSize: 5 * 1024 * 1024,
    });
    const getBorderColor = () => {
        if (isDragReject)
            return "border-error-500 bg-error-50/60 dark:bg-error-950/20";
        if (isDragAccept)
            return "border-brand-500 bg-brand-50/60 dark:bg-brand-950/20";
        if (isFocused)
            return "border-brand-500 ring-2 ring-brand-500/20 bg-gray-50 dark:bg-gray-900";
        return "border-gray-300 bg-gray-50 hover:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-500";
    };
    const formatFileSize = (bytes) => {
        if (bytes < 1024)
            return `${bytes} B`;
        if (bytes < 1024 * 1024)
            return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };
    return (_jsx(ComponentCard, { title: "Dropzone", children: _jsxs("div", { children: [_jsxs("div", { ...getRootProps(), className: `relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-7 text-center outline-hidden transition-all duration-200 lg:p-10 ${getBorderColor()}`, children: [_jsx("input", { ...getInputProps() }), _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: "mb-4 flex size-15 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300", children: _jsx(UploadIcon, { className: "size-6 text-current" }) }), _jsx("h4", { className: "mb-2 text-theme-xl font-semibold text-gray-800 dark:text-white/90", children: isDragReject
                                        ? "File type not supported"
                                        : isDragAccept
                                            ? "Drop images here"
                                            : isDragActive
                                                ? "Drop files here"
                                                : "Drag & Drop Files Here" }), _jsx("p", { className: "mb-4 max-w-72.5 text-sm text-gray-600 dark:text-gray-400", children: isDragReject
                                        ? "Only PNG, JPG, WebP, and SVG images up to 5MB are allowed"
                                        : "Drag and drop your PNG, JPG, WebP, SVG images here or browse" }), _jsx("span", { className: "text-theme-sm font-medium text-brand-500 underline hover:text-brand-600", children: "Browse File" })] })] }), files.length > 0 && (_jsxs("div", { className: "mt-6 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h5", { className: "text-theme-sm font-medium text-gray-700 dark:text-gray-300", children: ["Uploaded Images (", files.length, ")"] }), _jsx("button", { type: "button", onClick: () => {
                                        files.forEach((f) => {
                                            if (f.preview)
                                                URL.revokeObjectURL(f.preview);
                                        });
                                        setFiles([]);
                                    }, className: "text-theme-xs font-medium text-error-500 hover:text-error-600 dark:text-error-400", children: "Clear all" })] }), _jsx("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-3", children: files.map((file) => (_jsxs("div", { className: "group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs transition hover:shadow-theme-sm dark:border-gray-800 dark:bg-gray-900", children: [_jsxs("div", { className: "relative aspect-4/3 w-full overflow-hidden bg-gray-100 dark:bg-gray-800", children: [file.preview ? (_jsx("img", { src: file.preview, alt: file.name, className: "object-cover transition-transform duration-300 group-hover:scale-105" })) : (_jsx("div", { className: "flex h-full w-full items-center justify-center text-gray-400", children: _jsx(UploadIcon, { className: "size-8" }) })), _jsxs("div", { className: "absolute inset-0 flex items-center justify-center gap-2 bg-gray-900/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100", children: [file.preview && (_jsx("button", { type: "button", onClick: () => handleOpenPreview(file), className: "flex size-8 items-center justify-center rounded-full bg-white/90 text-gray-800 backdrop-blur-xs transition hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800", title: "Preview image", "aria-label": `Preview ${file.name}`, children: _jsx(EyeIcon, { className: "size-4" }) })), _jsx("button", { type: "button", onClick: () => removeFile(file.name), className: "flex size-8 items-center justify-center rounded-full bg-white/90 text-error-500 backdrop-blur-xs transition hover:bg-white dark:bg-gray-800/90 dark:text-error-400 dark:hover:bg-gray-800", title: "Remove image", "aria-label": `Remove ${file.name}`, children: _jsx(TrashBinIcon, { className: "size-4" }) })] })] }), _jsxs("div", { className: "p-3", children: [_jsx("p", { className: "truncate text-theme-xs font-medium text-gray-800 dark:text-white/90", title: file.name, children: file.name }), _jsx("p", { className: "mt-0.5 text-[11px] text-gray-500 dark:text-gray-400", children: formatFileSize(file.size) })] })] }, `${file.name}-${file.lastModified}`))) })] })), _jsx(Modal, { isOpen: isOpen, onClose: handleClosePreview, className: "max-w-2xl p-6 sm:p-8", children: previewImage && (_jsxs("div", { children: [_jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "text-theme-lg font-semibold text-gray-800 dark:text-white/90", children: "Image Preview" }), _jsxs("p", { className: "text-theme-xs text-gray-500 dark:text-gray-400", children: [previewImage.name, " \u2022 ", formatFileSize(previewImage.size)] })] }), _jsx("div", { className: "relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800", children: previewImage.preview && (_jsx("img", { src: previewImage.preview, alt: previewImage.name, className: "object-contain" })) })] })) })] }) }));
}
