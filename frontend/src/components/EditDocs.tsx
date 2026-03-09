import type React from "react"
import { ExternalLinkIcon, fmtDate } from "./Orders";
import { Edit2Icon, FileTextIcon, UploadCloudIcon, XIcon, CheckIcon, RotateCcwIcon, SaveIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

interface Doc {
    clearing_price: string;
    created_at: string;
    doc_name: string;
    doc_type: string;
    doc_url: string;
    gross_weight: number;
    net_weight: number;
    issued_by: string;
    total_value: string;
    _id: string;
}

const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`

// ─── Doc Type Badge ───────────────────────────────────────────────────────────
const DocTypeBadge: React.FC<{ type: string }> = ({ type }) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
        {type}
    </span>
);

// ─── Doc List Item ────────────────────────────────────────────────────────────
const DocListItem: React.FC<{
    doc: Doc;
    isSelected: boolean;
    isEdited: boolean;
    onClick: () => void;
}> = ({ doc, isSelected, isEdited, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-150 group ${isSelected
            ? "bg-emerald-50 border-emerald-200 shadow-sm shadow-emerald-100"
            : "bg-white border-gray-100 hover:border-emerald-100 hover:bg-gray-50/60"
            }`}
    >
        <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
                <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${isSelected ? "bg-emerald-100" : "bg-gray-100 group-hover:bg-emerald-50"
                    }`}>
                    <FileTextIcon className={`w-4 h-4 ${isSelected ? "text-emerald-600" : "text-gray-400"}`} />
                </div>
                <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${isSelected ? "text-emerald-900" : "text-gray-800"}`}>
                        {doc.doc_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {doc.issued_by} · {fmtDate(doc.created_at)}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                {isEdited && (
                    <span className="w-2 h-2 rounded-full bg-amber-400" title="Unsaved changes" />
                )}
                <DocTypeBadge type={doc.doc_type} />
                <ChevronRightIcon className={`w-4 h-4 transition-transform ${isSelected ? "text-emerald-500 translate-x-0.5" : "text-gray-300"}`} />
            </div>
        </div>
    </button>
);

// ─── Field Component ──────────────────────────────────────────────────────────
const FormField: React.FC<{
    label: string;
    value: string | number;
    onChange?: (v: string) => void;
    type?: string;
    readOnly?: boolean;
    colSpan?: "full" | "half";
}> = ({ label, value, onChange, type = "text", readOnly = false, colSpan = "half" }) => (
    <div className={colSpan === "full" ? "col-span-2" : "col-span-1"}>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            {label}
        </label>
        <input
            type={type}
            value={value}
            readOnly={readOnly}
            onChange={e => onChange?.(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all duration-150 ${readOnly
                ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border-gray-200 text-gray-800 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50 hover:border-gray-300"
                }`}
        />
    </div>
);

// ─── File Upload ──────────────────────────────────────────────────────────────
const FileUpload: React.FC<{
    file: File | null;
    onChange: (f: File | null) => void;
}> = ({ file, onChange }) => (
    <div className="col-span-2">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Replace File
        </label>
        <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-150 group ${file
            ? "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300"
            : "border-gray-200 bg-gray-50/50 hover:border-emerald-200 hover:bg-emerald-50/30"
            }`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${file ? "bg-emerald-100" : "bg-white border border-gray-200"
                }`}>
                {file
                    ? <CheckIcon className="w-4 h-4 text-emerald-600" />
                    : <UploadCloudIcon className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                }
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${file ? "text-emerald-700" : "text-gray-500"}`}>
                    {file ? file.name : "Click to upload replacement file"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : "PDF, DOCX, PNG — replaces current document"}
                </p>
            </div>
            {file && (
                <button
                    type="button"
                    onClick={e => { e.preventDefault(); onChange(null); }}
                    className="flex-shrink-0 w-6 h-6 rounded-lg bg-white border border-gray-200 hover:bg-rose-50 hover:border-rose-200 flex items-center justify-center transition-colors"
                >
                    <XIcon className="w-3 h-3 text-gray-400 hover:text-rose-500" />
                </button>
            )}
            <input type="file" className="hidden" onChange={e => onChange(e.target.files?.[0] ?? null)} />
        </label>
    </div>
);

// ─── Edit Form Panel ──────────────────────────────────────────────────────────
const EditDocForm: React.FC<{
    doc: Doc;
    onSave: (doc: Doc, file: File | null) => void;
}> = ({ doc, onSave }) => {
    const [fields, setFields] = useState<Doc>(doc);
    const [file, setFile] = useState<File | null>(null);

    const set = (key: keyof Doc, value: string) =>
        setFields(prev => ({
            ...prev,
            [key]: key === "gross_weight" || key === "net_weight" ? Number(value) : value,
        }));

    const hasChanges = JSON.stringify(fields) !== JSON.stringify(doc) || file !== null;

    return (
        <div className="flex flex-col h-full">
            {/* Form header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                        <Edit2Icon className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Edit Document</h3>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{doc._id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <DocTypeBadge type={fields.doc_type} />
                    {hasChanges && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Unsaved
                        </span>
                    )}
                </div>
            </div>

            {/* View link */}
            <div className="px-6 py-3 bg-gray-50/70 border-b border-gray-100 flex-shrink-0">
                <a
                    href={doc.doc_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                    <ExternalLinkIcon />
                    View current document
                </a>
            </div>

            {/* Fields */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                    <FormField label="Document Name" value={fields.doc_name} onChange={v => set("doc_name", v)} colSpan="full" />
                    <FormField label="Document URL" value={fields.doc_url} onChange={v => set("doc_url", v)} colSpan="full" />
                    <FormField label="Document Type" value={fields.doc_type} onChange={v => set("doc_type", v)} />
                    <FormField label="Issued By" value={fields.issued_by} onChange={v => set("issued_by", v)} />
                    <FormField label="Clearing Price" value={fields.clearing_price} onChange={v => set("clearing_price", v)} />
                    <FormField label="Total Value" value={fields.total_value} onChange={v => set("total_value", v)} />
                    <FormField label="Gross Weight (kg)" value={fields.gross_weight} onChange={v => set("gross_weight", v)} type="number" />
                    <FormField label="Net Weight (kg)" value={fields.net_weight} onChange={v => set("net_weight", v)} type="number" />
                    <FormField label="Created At" value={fmtDate(fields.created_at)} readOnly colSpan="full" />
                    <FileUpload file={file} onChange={setFile} />
                </div>
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0 bg-gray-50/50">
                <button
                    onClick={() => { setFields(doc); setFile(null); }}
                    disabled={!hasChanges}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    <RotateCcwIcon className="w-3.5 h-3.5" />
                    Reset
                </button>
                <button
                    onClick={() => onSave(fields, file)}
                    disabled={!hasChanges}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:opacity-90 active:scale-95"
                    style={{
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        boxShadow: hasChanges ? "0 4px 14px rgba(16,185,129,0.35)" : "none",
                    }}
                >
                    <SaveIcon className="w-3.5 h-3.5" />
                    Save Changes
                </button>
            </div>
        </div>
    );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
            <FileTextIcon className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-sm font-semibold text-gray-500">Select a document to edit</p>
        <p className="text-xs text-gray-400 mt-1">Choose from the list on the left to begin editing</p>
    </div>
);

// ─── Main Modal ───────────────────────────────────────────────────────────────
const EditDocModal: React.FC<{ orderId: string; docs: Doc[]; onClose?: () => void }> = ({
    orderId,
    docs,
    onClose,
}) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [editedDocs, setEditedDocs] = useState<Doc[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(docs.find(d => d._id === selectedId) ?? null)

    const handleSave = (updated: Doc, file: File | null) => {
        setEditedDocs(prev => {
            const exists = prev.find(d => d._id === updated._id);
            return exists
                ? prev.map(d => d._id === updated._id ? updated : d)
                : [...prev, updated];
        });
        if (file) {
            setFiles(prev => [...prev, file]);
        }
    };

    const isEdited = (id: string) => editedDocs.some(d => d._id === id);

    const handleSubmit = async () => {
        if (editedDocs.length === 0) return;
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("orderId", orderId);
            formData.append("docs_data", JSON.stringify(editedDocs));
            console.log(files)
            files.forEach(file => formData.append("doc", file));
            const response = await fetch(`${BACKEND_URL}/order/editDocs`, {
                method: "PUT",
                body: formData,
            });
            const data = await response.json();
            if (data.valid) setSubmitted(true);
        } finally {
            setSubmitting(false);
        }
    };

    const editedCount = editedDocs.length;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full flex flex-col overflow-hidden"
                style={{ maxWidth: "900px", height: "min(90vh, 680px)" }}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Edit Documents</h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {docs.length} document{docs.length !== 1 ? "s" : ""} · {editedCount} modified
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Submit button */}
                        {submitted ? (
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <CheckIcon className="w-3.5 h-3.5" /> Submitted
                            </span>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={editedCount === 0 || submitting}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:opacity-90 active:scale-95"
                                style={{
                                    background: "linear-gradient(135deg, #10b981, #059669)",
                                    boxShadow: editedCount > 0 ? "0 4px 14px rgba(16,185,129,0.35)" : "none",
                                }}
                            >
                                {submitting ? (
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <CheckIcon className="w-3.5 h-3.5" />
                                )}
                                Submit {editedCount > 0 && `(${editedCount})`}
                            </button>
                        )}
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center text-gray-500 transition-colors"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Split Layout */}
                <div className="flex flex-1 overflow-hidden">

                    {/* Left: Doc List */}
                    <div className="w-72 flex-shrink-0 border-r border-gray-100 flex flex-col overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Documents</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {docs.map(doc => (
                                <DocListItem
                                    key={doc._id}
                                    doc={doc}
                                    isSelected={selectedId === doc._id}
                                    isEdited={isEdited(doc._id)}
                                    onClick={() => {
                                        setSelectedId(doc._id)
                                        setSelectedDoc(doc)
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right: Edit Form */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        {selectedDoc
                            ? <EditDocForm key={selectedId} doc={selectedDoc} onSave={handleSave} />
                            : <EmptyState />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditDocModal;