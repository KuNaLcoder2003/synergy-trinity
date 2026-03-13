import React, { useState, useEffect } from "react";
import type { Doc, Order } from "../types";
import { Modal, FormField, inputClass, inputStyle } from "./index";

interface DocsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onSave: (orderId: string, docs: Doc[]) => void;
}

const emptyDoc = (): Omit<Doc, "_id"> => ({
    clearing_price: "",
    created_at: new Date().toISOString().split("T")[0],
    doc_name: "",
    doc_type: "",
    doc_url: "",
    gross_weight: 0,
    net_weight: 0,
    issued_by: "",
    total_value: "",
});

const docTypes = ["Shipping", "Financial", "Customs", "Legal", "Insurance", "Other"];

const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose, order, onSave }) => {
    const [docs, setDocs] = useState<Doc[]>([]);
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
    const [focused, setFocused] = useState<string | null>(null);

    useEffect(() => {
        if (order) setDocs(order.docs ? [...order.docs] : []);
    }, [order, isOpen]);

    const addDoc = () => {
        const newDoc: Doc = { _id: `doc_${Date.now()}`, ...emptyDoc() };
        setDocs((prev) => [...prev, newDoc]);
        setExpandedIdx(docs.length);
    };

    const removeDoc = (idx: number) => {
        setDocs((prev) => prev.filter((_, i) => i !== idx));
        setExpandedIdx(null);
    };

    const updateDoc = <K extends keyof Doc>(idx: number, key: K, value: Doc[K]) => {
        setDocs((prev) => prev.map((d, i) => (i === idx ? { ...d, [key]: value } : d)));
    };

    const handleSave = () => {
        if (order) onSave(order._id, docs);
        onClose();
    };

    const inputStyle2 = (field: string) => ({
        ...inputStyle,
        ...(focused === field
            ? { borderColor: "#4ade80", boxShadow: "0 0 0 3px rgba(74,222,128,0.12)" }
            : {}),
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Edit Documents — ${order?.bill_of_lading_number || ""}`}
            size="xl"
        >
            <div className="flex flex-col gap-3">
                {docs.length === 0 && (
                    <div
                        className="flex flex-col items-center justify-center py-10 rounded-xl"
                        style={{ backgroundColor: "#f0faf4", border: "1.5px dashed #a8d5b5" }}
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ color: "#4a7a5c" }}>
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" />
                            <path d="M14 2v6h6M12 11v6M9 14h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <p className="text-sm mt-2" style={{ color: "#4a7a5c" }}>No documents yet</p>
                    </div>
                )}

                {docs.map((doc, idx) => (
                    <div
                        key={doc._id}
                        className="rounded-xl overflow-hidden"
                        style={{ border: "1px solid #e8f5ed" }}
                    >
                        {/* Doc header row */}
                        <div
                            className="flex items-center justify-between px-4 py-3 cursor-pointer"
                            style={{
                                backgroundColor: expandedIdx === idx ? "#f0faf4" : "white",
                            }}
                            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: "#dcfce7" }}
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#15803d" strokeWidth="2" />
                                        <path d="M14 2v6h6" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium" style={{ color: "#1a3d2b" }}>
                                        {doc.doc_name || "Untitled Document"}
                                    </p>
                                    <p className="text-xs" style={{ color: "#6b9e80" }}>
                                        {doc.doc_type || "No type"} · {doc.issued_by || "Unknown issuer"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeDoc(idx); }}
                                    className="p-1.5 rounded-lg"
                                    style={{ color: "#dc2626", backgroundColor: "#fef2f2" }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                                <svg
                                    width="14" height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    style={{
                                        color: "#4a7a5c",
                                        transform: expandedIdx === idx ? "rotate(180deg)" : "none",
                                        transition: "transform 0.2s",
                                    }}
                                >
                                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>

                        {/* Expanded form */}
                        {expandedIdx === idx && (
                            <div
                                className="px-4 pb-4 pt-2"
                                style={{ backgroundColor: "#fafffe", borderTop: "1px solid #e8f5ed" }}
                            >
                                <div className="grid grid-cols-3 gap-3">
                                    <FormField label="Document Name" required>
                                        <input
                                            className={inputClass}
                                            style={inputStyle2(`${idx}_doc_name`)}
                                            value={doc.doc_name}
                                            onChange={(e) => updateDoc(idx, "doc_name", e.target.value)}
                                            onFocus={() => setFocused(`${idx}_doc_name`)}
                                            onBlur={() => setFocused(null)}
                                            placeholder="e.g. Bill of Lading"
                                        />
                                    </FormField>
                                    <FormField label="Document Type" required>
                                        <select
                                            className={inputClass}
                                            style={inputStyle2(`${idx}_doc_type`)}
                                            value={doc.doc_type}
                                            onChange={(e) => updateDoc(idx, "doc_type", e.target.value)}
                                            onFocus={() => setFocused(`${idx}_doc_type`)}
                                            onBlur={() => setFocused(null)}
                                        >
                                            <option value="">Select type…</option>
                                            {docTypes.map((t) => <option key={t}>{t}</option>)}
                                        </select>
                                    </FormField>
                                    <FormField label="Issued By">
                                        <input
                                            className={inputClass}
                                            style={inputStyle2(`${idx}_issued_by`)}
                                            value={doc.issued_by}
                                            onChange={(e) => updateDoc(idx, "issued_by", e.target.value)}
                                            onFocus={() => setFocused(`${idx}_issued_by`)}
                                            onBlur={() => setFocused(null)}
                                            placeholder="Issuing authority"
                                        />
                                    </FormField>
                                    <FormField label="Created At">
                                        <input
                                            type="date"
                                            className={inputClass}
                                            style={inputStyle2(`${idx}_created_at`)}
                                            value={doc.created_at}
                                            onChange={(e) => updateDoc(idx, "created_at", e.target.value)}
                                            onFocus={() => setFocused(`${idx}_created_at`)}
                                            onBlur={() => setFocused(null)}
                                        />
                                    </FormField>
                                    <FormField label="Total Value">
                                        <input
                                            className={inputClass}
                                            style={inputStyle2(`${idx}_total_value`)}
                                            value={doc.total_value}
                                            onChange={(e) => updateDoc(idx, "total_value", e.target.value)}
                                            onFocus={() => setFocused(`${idx}_total_value`)}
                                            onBlur={() => setFocused(null)}
                                            placeholder="e.g. ₹42,50,000"
                                        />
                                    </FormField>
                                    <FormField label="Clearing Price">
                                        <input
                                            className={inputClass}
                                            style={inputStyle2(`${idx}_clearing_price`)}
                                            value={doc.clearing_price}
                                            onChange={(e) => updateDoc(idx, "clearing_price", e.target.value)}
                                            onFocus={() => setFocused(`${idx}_clearing_price`)}
                                            onBlur={() => setFocused(null)}
                                            placeholder="e.g. ₹15,000"
                                        />
                                    </FormField>
                                    <FormField label="Gross Weight (kg)">
                                        <input
                                            type="number"
                                            className={inputClass}
                                            style={inputStyle2(`${idx}_gross_weight`)}
                                            value={doc.gross_weight || ""}
                                            onChange={(e) => updateDoc(idx, "gross_weight", parseFloat(e.target.value) || 0)}
                                            onFocus={() => setFocused(`${idx}_gross_weight`)}
                                            onBlur={() => setFocused(null)}
                                        />
                                    </FormField>
                                    <FormField label="Net Weight (kg)">
                                        <input
                                            type="number"
                                            className={inputClass}
                                            style={inputStyle2(`${idx}_net_weight`)}
                                            value={doc.net_weight || ""}
                                            onChange={(e) => updateDoc(idx, "net_weight", parseFloat(e.target.value) || 0)}
                                            onFocus={() => setFocused(`${idx}_net_weight`)}
                                            onBlur={() => setFocused(null)}
                                        />
                                    </FormField>
                                    <FormField label="Document URL">
                                        <input
                                            className={inputClass}
                                            style={inputStyle2(`${idx}_doc_url`)}
                                            value={doc.doc_url}
                                            onChange={(e) => updateDoc(idx, "doc_url", e.target.value)}
                                            onFocus={() => setFocused(`${idx}_doc_url`)}
                                            onBlur={() => setFocused(null)}
                                            placeholder="https://..."
                                        />
                                    </FormField>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-5">
                <button
                    onClick={addDoc}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                    style={{ color: "#16a34a", backgroundColor: "#f0faf4", border: "1px dashed #a8d5b5" }}
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    Add Document
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-sm font-medium"
                        style={{ color: "#4a7a5c", backgroundColor: "#f0faf4" }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
                        style={{ background: "linear-gradient(135deg, #4ade80, #16a34a)" }}
                    >
                        Save Documents
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DocsModal;