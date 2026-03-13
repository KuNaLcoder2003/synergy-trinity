import React from "react";

/* ─── Modal ─────────────────────────────────────────────── */
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
}) => {
    if (!isOpen) return null;

    const sizeMap = {
        sm: "max-w-md",
        md: "max-w-xl",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className={`relative w-full ${sizeMap[size]} bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col`}
                style={{ border: "1px solid #e2f0e8" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4 border-b"
                    style={{ borderColor: "#e2f0e8" }}
                >
                    <h2 className="text-lg font-semibold" style={{ color: "#1a3d2b" }}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                        style={{ color: "#6b9e80" }}
                        onMouseEnter={(e) =>
                            ((e.target as HTMLElement).style.backgroundColor = "#f0faf4")
                        }
                        onMouseLeave={(e) =>
                            ((e.target as HTMLElement).style.backgroundColor = "transparent")
                        }
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                                d="M12 4L4 12M4 4l8 8"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>
                {/* Body */}
                <div className="overflow-y-auto flex-1 px-6 py-4">{children}</div>
            </div>
        </div>
    );
};

/* ─── Badge ─────────────────────────────────────────────── */
interface BadgeProps {
    label: string;
    color?: "green" | "yellow" | "red" | "blue" | "gray";
}

export const Badge: React.FC<BadgeProps> = ({ label, color = "green" }) => {
    const colorMap = {
        green: { bg: "#dcfce7", text: "#15803d", dot: "#16a34a" },
        yellow: { bg: "#fef9c3", text: "#a16207", dot: "#ca8a04" },
        red: { bg: "#fee2e2", text: "#b91c1c", dot: "#dc2626" },
        blue: { bg: "#dbeafe", text: "#1d4ed8", dot: "#2563eb" },
        gray: { bg: "#f3f4f6", text: "#4b5563", dot: "#6b7280" },
    };
    const c = colorMap[color];
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: c.bg, color: c.text }}
        >
            <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: c.dot }}
            />
            {label}
        </span>
    );
};

export const paymentStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "paid") return <Badge label="Paid" color="green" />;
    if (s === "pending") return <Badge label="Pending" color="yellow" />;
    if (s === "partial") return <Badge label="Partial" color="blue" />;
    return <Badge label={status || "—"} color="gray" />;
};

/* ─── Empty State ────────────────────────────────────────── */
interface EmptyStateProps {
    icon: React.ReactNode;
    message: string;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    message,
    action,
}) => (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "#f0faf4" }}
        >
            {icon}
        </div>
        <p className="text-sm" style={{ color: "#6b9e80" }}>
            {message}
        </p>
        {action}
    </div>
);

/* ─── FormField ──────────────────────────────────────────── */
interface FormFieldProps {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    required,
    children,
}) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#4a7a5c" }}>
            {label}
            {required && <span style={{ color: "#16a34a" }}> *</span>}
        </label>
        {children}
    </div>
);

export const inputClass =
    "w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all";
export const inputStyle = {
    borderColor: "#d1e9da",
    color: "#1a3d2b",
    backgroundColor: "#fafffe",
};
export const inputFocusStyle = {
    borderColor: "#4ade80",
    boxShadow: "0 0 0 3px rgba(74,222,128,0.12)",
};