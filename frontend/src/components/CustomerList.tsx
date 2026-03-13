import React, { useState } from "react";
import type { Customer } from "../types";
import { EmptyState } from "./index";
import CustomerForm from "./CustomerForm";

interface CustomerListProps {
    customers: Customer[];
    onAdd: (c: Customer) => void;
    onEdit: (c: Customer) => void;
    onDelete: (id: string) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({
    customers,
    onAdd,
    onEdit,
    onDelete,
}) => {
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<Customer | null>(null);
    const [search, setSearch] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);

    const filtered = customers.filter(
        (c) =>
            c.company_name.toLowerCase().includes(search.toLowerCase()) ||
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.country.toLowerCase().includes(search.toLowerCase())
    );

    const openEdit = (c: Customer) => {
        setEditing(c);
        setFormOpen(true);
    };

    const handleSave = (c: Customer) => {
        if (editing) onEdit(c);
        else onAdd(c);
        setEditing(null);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <input
                        className="px-3 py-2 rounded-xl text-sm border outline-none w-60 transition"
                        style={{
                            borderColor: searchFocused ? "#4ade80" : "#d1e9da",
                            boxShadow: searchFocused ? "0 0 0 3px rgba(74,222,128,0.12)" : "none",
                            color: "#1a3d2b",
                            backgroundColor: "white",
                        }}
                        placeholder="Search customers…"
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
                    Add Customer
                </button>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <EmptyState
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="9" cy="7" r="4" stroke="#6b9e80" strokeWidth="2" />
                            <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="#6b9e80" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    }
                    message="No customers found"
                    action={
                        <button
                            onClick={() => { setEditing(null); setFormOpen(true); }}
                            className="text-sm font-medium px-4 py-2 rounded-xl"
                            style={{ color: "#16a34a", backgroundColor: "#f0faf4" }}
                        >
                            Add your first customer
                        </button>
                    }
                />
            ) : (
                <div
                    className="bg-white rounded-2xl overflow-hidden"
                    style={{ border: "1px solid #e8f5ed" }}
                >
                    <table className="w-full">
                        <thead>
                            <tr style={{ backgroundColor: "#f7fdf9", borderBottom: "1px solid #e8f5ed" }}>
                                {["Company", "Contact", "Location", "Mobile", "Bank Info", "Actions"].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                                        style={{ color: "#4a7a5c" }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((customer, i) => (
                                <tr
                                    key={customer._id}
                                    style={{
                                        borderBottom: i < filtered.length - 1 ? "1px solid #f0faf4" : "none",
                                    }}
                                    onMouseEnter={(e) =>
                                        ((e.currentTarget as HTMLElement).style.backgroundColor = "#fafffe")
                                    }
                                    onMouseLeave={(e) =>
                                        ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
                                    }
                                >
                                    <td className="px-5 py-3.5">
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: "#1a3d2b" }}>
                                                {customer.company_name}
                                            </p>
                                            <p className="text-xs mt-0.5" style={{ color: "#6b9e80" }}>
                                                ID: {customer._id}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                                style={{ backgroundColor: "#dcfce7", color: "#15803d" }}
                                            >
                                                {customer.name.charAt(0)}
                                            </div>
                                            <span className="text-sm" style={{ color: "#1a3d2b" }}>
                                                {customer.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <p className="text-sm" style={{ color: "#1a3d2b" }}>
                                            {customer.state}
                                        </p>
                                        <p className="text-xs" style={{ color: "#6b9e80" }}>
                                            {customer.country} · {customer.pincode}
                                        </p>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm" style={{ color: "#1a3d2b" }}>
                                        {customer.mobile}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <p
                                            className="text-xs max-w-xs truncate"
                                            style={{ color: "#6b9e80" }}
                                            title={customer.bank_details}
                                        >
                                            {customer.bank_details || "—"}
                                        </p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEdit(customer)}
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
                                                style={{ color: "#16a34a", backgroundColor: "#f0faf4" }}
                                                onMouseEnter={(e) =>
                                                    ((e.currentTarget as HTMLElement).style.backgroundColor = "#dcfce7")
                                                }
                                                onMouseLeave={(e) =>
                                                    ((e.currentTarget as HTMLElement).style.backgroundColor = "#f0faf4")
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Delete ${customer.company_name}?`))
                                                        onDelete(customer._id);
                                                }}
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
                                                style={{ color: "#dc2626", backgroundColor: "#fef2f2" }}
                                                onMouseEnter={(e) =>
                                                    ((e.currentTarget as HTMLElement).style.backgroundColor = "#fee2e2")
                                                }
                                                onMouseLeave={(e) =>
                                                    ((e.currentTarget as HTMLElement).style.backgroundColor = "#fef2f2")
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <CustomerForm
                isOpen={formOpen}
                onClose={() => { setFormOpen(false); setEditing(null); }}
                onSave={handleSave}
                existing={editing}
            />
        </div>
    );
};

export default CustomerList;