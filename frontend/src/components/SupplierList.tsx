import React, { useState } from "react";
import type { Supplier } from "../types";
import { EmptyState } from "./index";
import SupplierForm from "./SupplierForm";

interface SupplierListProps {
    suppliers: Supplier[];
    onAdd: (s: Supplier) => void;
    onEdit: (s: Supplier) => void;
    onDelete: (id: string) => void;
}

const countryFlags: Record<string, string> = {
    China: "🇨🇳", UAE: "🇦🇪", Japan: "🇯🇵", "South Korea": "🇰🇷", India: "🇮🇳",
    USA: "🇺🇸", Germany: "🇩🇪", UK: "🇬🇧",
};

const SupplierList: React.FC<SupplierListProps> = ({
    suppliers,
    onAdd,
    onEdit,
    onDelete,
}) => {
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<Supplier | null>(null);
    const [search, setSearch] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);

    const filtered = suppliers.filter(
        (s) =>
            s.company_name.toLowerCase().includes(search.toLowerCase()) ||
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.country.toLowerCase().includes(search.toLowerCase())
    );

    const openEdit = (s: Supplier) => {
        setEditing(s);
        setFormOpen(true);
    };

    const handleSave = (s: Supplier) => {
        if (editing) onEdit(s);
        else onAdd(s);
        setEditing(null);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <input
                        className="px-3 py-2 rounded-xl text-sm border outline-none w-60"
                        style={{
                            borderColor: searchFocused ? "#4ade80" : "#d1e9da",
                            boxShadow: searchFocused ? "0 0 0 3px rgba(74,222,128,0.12)" : "none",
                            color: "#1a3d2b",
                            backgroundColor: "white",
                        }}
                        placeholder="Search suppliers…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                    <span className="text-sm" style={{ color: "#6b9e80" }}>
                        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                    </span>
                </div>
                <button
                    onClick={() => { setEditing(null); setFormOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #4ade80, #16a34a)" }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    Add Supplier
                </button>
            </div>

            {/* Cards grid */}
            {filtered.length === 0 ? (
                <EmptyState
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M3 9l9-6 9 6v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" stroke="#6b9e80" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M9 22V12h6v10" stroke="#6b9e80" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    }
                    message="No suppliers found"
                    action={
                        <button
                            onClick={() => { setEditing(null); setFormOpen(true); }}
                            className="text-sm font-medium px-4 py-2 rounded-xl"
                            style={{ color: "#16a34a", backgroundColor: "#f0faf4" }}
                        >
                            Add your first supplier
                        </button>
                    }
                />
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {filtered.map((supplier) => (
                        <div
                            key={supplier._id}
                            className="bg-white rounded-2xl p-5 transition-all hover:shadow-md"
                            style={{ border: "1px solid #e8f5ed" }}
                        >
                            {/* Card Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                        style={{ backgroundColor: "#f0faf4" }}
                                    >
                                        {countryFlags[supplier.country] || "🏭"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold" style={{ color: "#1a3d2b" }}>
                                            {supplier.company_name}
                                        </p>
                                        <p className="text-xs" style={{ color: "#6b9e80" }}>
                                            {supplier.country} · {supplier.state}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => openEdit(supplier)}
                                        className="p-1.5 rounded-lg transition"
                                        style={{ color: "#16a34a", backgroundColor: "#f0faf4" }}
                                        title="Edit"
                                        onMouseEnter={(e) =>
                                            ((e.currentTarget as HTMLElement).style.backgroundColor = "#dcfce7")
                                        }
                                        onMouseLeave={(e) =>
                                            ((e.currentTarget as HTMLElement).style.backgroundColor = "#f0faf4")
                                        }
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm(`Delete ${supplier.company_name}?`))
                                                onDelete(supplier._id);
                                        }}
                                        className="p-1.5 rounded-lg transition"
                                        style={{ color: "#dc2626", backgroundColor: "#fef2f2" }}
                                        title="Delete"
                                        onMouseEnter={(e) =>
                                            ((e.currentTarget as HTMLElement).style.backgroundColor = "#fee2e2")
                                        }
                                        onMouseLeave={(e) =>
                                            ((e.currentTarget as HTMLElement).style.backgroundColor = "#fef2f2")
                                        }
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Divider */}
                            <div style={{ height: "1px", backgroundColor: "#f0faf4" }} className="mb-3" />

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "#4a7a5c" }}>
                                        Contact
                                    </p>
                                    <p className="text-xs" style={{ color: "#1a3d2b" }}>{supplier.name}</p>
                                    <p className="text-xs" style={{ color: "#6b9e80" }}>{supplier.mobile}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "#4a7a5c" }}>
                                        Address
                                    </p>
                                    <p className="text-xs truncate" style={{ color: "#1a3d2b" }} title={supplier.company_address}>
                                        {supplier.company_address}
                                    </p>
                                    <p className="text-xs" style={{ color: "#6b9e80" }}>PIN: {supplier.pincode}</p>
                                </div>
                            </div>

                            {supplier.bank_details && (
                                <div
                                    className="mt-3 px-3 py-2 rounded-lg"
                                    style={{ backgroundColor: "#f0faf4" }}
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "#4a7a5c" }}>
                                        Bank
                                    </p>
                                    <p className="text-xs truncate" style={{ color: "#1a3d2b" }} title={supplier.bank_details}>
                                        {supplier.bank_details}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <SupplierForm
                isOpen={formOpen}
                onClose={() => { setFormOpen(false); setEditing(null); }}
                onSave={handleSave}
                existing={editing}
            />
        </div>
    );
};

export default SupplierList;