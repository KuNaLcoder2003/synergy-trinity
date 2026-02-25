import { useState, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type SupplierForm = {
    company_name: string;
    name: string;
    mobile: string;
    email: string;
    bank_details: string;
    country: string;
    pincode: string;
};

type FieldMeta = {
    key: keyof SupplierForm;
    label: string;
    placeholder: string;
    type?: string;
    icon: React.ReactNode;
    hint?: string;
    colSpan?: "full" | "half";
};

type AddSupplierProps = {
    onClose: () => void;
    onSubmit: (data: SupplierForm) => void;
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const BuildingIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="2" y="7" width="20" height="15" rx="1" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="12.01" /><line x1="12" y1="16" x2="12" y2="16.01" />
    </svg>
);
const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);
const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 5a2 2 0 0 1 1.53-2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);
const MailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
);
const BankIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <line x1="2" y1="10" x2="22" y2="10" /><line x1="12" y1="2" x2="22" y2="10" /><line x1="2" y1="10" x2="12" y2="2" />
        <rect x="2" y="10" width="20" height="11" rx="1" /><line x1="6" y1="14" x2="6" y2="17" /><line x1="12" y1="14" x2="12" y2="17" /><line x1="18" y1="14" x2="18" y2="17" />
    </svg>
);
const GlobeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);
const HashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
    </svg>
);
const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);
const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const TruckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);

// ── Field Config ──────────────────────────────────────────────────────────────
const FIELDS: FieldMeta[] = [
    { key: "company_name", label: "Company Name", placeholder: "e.g. GreenTech Pvt Ltd", icon: <BuildingIcon />, colSpan: "full" },
    { key: "name", label: "Contact Name", placeholder: "e.g. Vikram Singh", icon: <UserIcon />, colSpan: "half" },
    { key: "mobile", label: "Mobile Number", placeholder: "+91 98201 XXXXX", icon: <PhoneIcon />, type: "tel", colSpan: "half" },
    { key: "email", label: "Email Address", placeholder: "vendor@company.com", icon: <MailIcon />, type: "email", colSpan: "full" },
    { key: "bank_details", label: "Bank Details", placeholder: "Bank Name · A/C Number · IFSC", icon: <BankIcon />, hint: "Format: Bank · Account · IFSC", colSpan: "full" },
    { key: "country", label: "Country", placeholder: "e.g. India", icon: <GlobeIcon />, colSpan: "half" },
    { key: "pincode", label: "Pincode", placeholder: "e.g. 110001", icon: <HashIcon />, colSpan: "half" },
];

const EMPTY_FORM: SupplierForm = {
    company_name: "", name: "", mobile: "", email: "",
    bank_details: "", country: "India", pincode: "",
};

// ── Validation ────────────────────────────────────────────────────────────────
function validate(form: SupplierForm): Partial<Record<keyof SupplierForm, string>> {
    const e: Partial<Record<keyof SupplierForm, string>> = {};
    if (!form.company_name.trim()) e.company_name = "Company name is required";
    if (!form.name.trim()) e.name = "Contact name is required";
    if (!/^\+?[\d\s\-]{8,15}$/.test(form.mobile)) e.mobile = "Enter a valid mobile number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.bank_details.trim()) e.bank_details = "Bank details are required";
    if (!form.country.trim()) e.country = "Country is required";
    if (!/^\d{4,10}$/.test(form.pincode)) e.pincode = "Enter a valid pincode";
    return e;
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ filled }: { filled: number }) {
    return (
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                    width: `${filled}%`,
                    background: filled === 100
                        ? "linear-gradient(90deg, #10b981, #34d399)"
                        : "linear-gradient(90deg, #6ee7b7, #10b981)",
                }}
            />
        </div>
    );
}

// ── Floating Label Input ──────────────────────────────────────────────────────
function FloatingField({
    meta, value, onChange, error, touched,
}: {
    meta: FieldMeta;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    touched?: boolean;
}) {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);
    const inputRef = useRef<HTMLInputElement>(null);

    const isActive = focused || hasValue;
    const isValid = touched && !error && value.length > 0;
    const isError = touched && !!error;

    const borderColor = isError ? "#f87171" : isValid ? "#10b981" : focused ? "#10b981" : "#e5e7eb";
    const shadowStyle = isError
        ? "0 0 0 3px rgba(248,113,113,0.12)"
        : focused
            ? "0 0 0 3px rgba(16,185,129,0.12)"
            : "none";

    return (
        <div className="relative w-full">
            <div
                className="relative rounded-xl transition-all duration-200"
                style={{ border: `1.5px solid ${borderColor}`, boxShadow: shadowStyle, background: "#fff" }}
            >
                {/* Floating label */}
                <label
                    onClick={() => inputRef.current?.focus()}
                    className="absolute left-10 cursor-text select-none pointer-events-auto transition-all duration-200 font-medium"
                    style={{
                        top: isActive ? "6px" : "50%",
                        transform: isActive ? "translateY(0)" : "translateY(-50%)",
                        fontSize: isActive ? "10px" : "14px",
                        color: isError ? "#f87171" : isActive ? "#10b981" : "#9ca3af",
                        letterSpacing: isActive ? "0.05em" : "0",
                        textTransform: isActive ? "uppercase" : "none",
                        zIndex: 2,
                    }}
                >
                    {meta.label}
                </label>

                {/* Icon */}
                <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    style={{ color: focused || isValid ? "#10b981" : "#9ca3af" }}
                >
                    {meta.icon}
                </span>

                {/* Input */}
                <input
                    ref={inputRef}
                    type={meta.type || "text"}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setHasValue(e.target.value.length > 0);
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={isActive ? meta.placeholder : ""}
                    className="w-full bg-transparent outline-none text-sm text-gray-800 font-medium transition-all duration-200"
                    style={{ padding: "24px 40px 8px 36px", caretColor: "#10b981" }}
                />

                {/* Status icon */}
                <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-300"
                    style={{
                        opacity: isValid || isError ? 1 : 0,
                        transform: `translateY(-50%) scale(${isValid || isError ? 1 : 0.6})`,
                    }}
                >
                    {isValid && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white">
                            <CheckIcon />
                        </span>
                    )}
                    {isError && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-400 text-white text-xs font-bold">!</span>
                    )}
                </span>
            </div>

            {/* Hint / error */}
            <div className="h-4 mt-1 px-1">
                {isError && <p className="text-xs text-red-400 font-medium">{error}</p>}
                {!isError && meta.hint && focused && <p className="text-xs text-gray-400">{meta.hint}</p>}
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AddSupplier({ onClose, onSubmit }: AddSupplierProps) {
    const [form, setForm] = useState<SupplierForm>(EMPTY_FORM);
    const [touched, setTouched] = useState<Partial<Record<keyof SupplierForm, boolean>>>({});
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const errors = validate(form);
    const filledCount = Object.values(form).filter((v) => String(v).trim().length > 0).length;
    const totalFields = Object.keys(EMPTY_FORM).length;
    const progress = Math.round((filledCount / totalFields) * 100);

    const handleChange = (key: keyof SupplierForm, val: string) => {
        setForm((p) => ({ ...p, [key]: val }));
        setTouched((p) => ({ ...p, [key]: true }));
    };

    const handleSubmit = async () => {
        const allTouched = Object.keys(EMPTY_FORM).reduce((a, k) => ({ ...a, [k]: true }), {});
        setTouched(allTouched);
        setSubmitted(true);
        if (Object.keys(errors).length > 0) return;

        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 1200));
        setSubmitting(false);
        setSuccess(true);
        setTimeout(() => { onSubmit(form); onClose(); }, 1400);
    };

    return (
        <>
            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes successBounce {
          0%  { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.15); }
          100%{ transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .supplier-modal  { animation: slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
        .supplier-overlay{ animation: overlayIn 0.2s ease both; }
        .success-bounce  { animation: successBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .btn-shimmer {
          background: linear-gradient(90deg, #10b981 0%, #34d399 50%, #10b981 100%);
          background-size: 200% auto;
          animation: shimmer 1.5s linear infinite;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1fae5; border-radius: 99px; }
      `}</style>

            {/* Overlay */}
            <div
                className="supplier-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backgroundColor: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)" }}
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                {/* Card */}
                <div
                    className="supplier-modal relative bg-white rounded-3xl shadow-2xl w-full max-w-xl flex flex-col"
                    style={{ maxHeight: "92vh", boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)" }}
                >
                    {/* Success overlay */}
                    {success && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl bg-white">
                            <div className="success-bounce flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 mb-4">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <p className="text-xl font-bold text-gray-900 mb-1">Supplier Added!</p>
                            <p className="text-sm text-gray-400">{form.company_name} has been onboarded.</p>
                        </div>
                    )}

                    {/* Header */}
                    <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <TruckIcon />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-gray-900 leading-tight">New Supplier</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Fill in the details to onboard a vendor</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Progress */}
                    <div className="px-7 pt-4 pb-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Form Progress</span>
                            <span className="text-xs font-bold" style={{ color: progress === 100 ? "#10b981" : "#6b7280" }}>
                                {filledCount}/{totalFields} fields
                            </span>
                        </div>
                        <ProgressBar filled={progress} />
                    </div>

                    {/* Fields */}
                    <div className="overflow-y-auto px-7 py-4 flex-1">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-0">
                            {FIELDS.map((meta) => (
                                <div key={meta.key} className={meta.colSpan === "full" ? "col-span-2" : "col-span-1"}>
                                    <FloatingField
                                        meta={meta}
                                        value={form[meta.key]}
                                        onChange={(v) => handleChange(meta.key, v)}
                                        error={errors[meta.key]}
                                        touched={touched[meta.key] || submitted}
                                    />
                                </div>
                            ))}
                        </div>

                        {submitted && Object.keys(errors).length > 0 && (
                            <div className="mt-2 mb-1 px-4 py-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2">
                                <span className="text-red-400 text-sm">⚠</span>
                                <p className="text-xs text-red-500 font-medium">
                                    Please fix {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? "s" : ""} before submitting.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-3 px-7 py-5 border-t border-gray-100">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all"
                        >
                            Cancel
                        </button>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => { setForm(EMPTY_FORM); setTouched({}); setSubmitted(false); }}
                                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-600 border border-gray-200 hover:border-gray-300 transition-all"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="relative overflow-hidden flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                                style={{
                                    background: submitting ? undefined : "linear-gradient(135deg, #10b981, #059669)",
                                    boxShadow: submitting ? "none" : "0 4px 16px rgba(16,185,129,0.35)",
                                    minWidth: 144,
                                    justifyContent: "center",
                                }}
                            >
                                {submitting && <span className="btn-shimmer absolute inset-0 rounded-xl" />}
                                <span className="relative flex items-center gap-2">
                                    {submitting ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                                                <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                            </svg>
                                            Saving…
                                        </>
                                    ) : (
                                        <>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                            Add Supplier
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}