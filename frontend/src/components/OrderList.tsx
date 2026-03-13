import React, { useState, useRef, useEffect } from "react";
import type { Order, Customer, Supplier } from "../types";
import { paymentStatusBadge, EmptyState } from "./index";
import OrderView from "./OrderView";
import OrderForm from "./OrderForm";
import DocsModal from "./DocsModal";

interface OrderListProps {
    orders: Order[];
    customers: Customer[];
    suppliers: Supplier[];
    onAdd: (o: Order) => void;
    onEdit: (o: Order) => void;
    onDelete: (id: string) => void;
    onUpdateDocs: (orderId: string, docs: Order["docs"]) => void;
}

type FilterStatus = "All" | "Paid" | "Pending" | "Partial";

const ActionMenu: React.FC<{
    order: Order;
    onView: () => void;
    onEdit: () => void;
    onDocs: () => void;
    onDelete: () => void;
}> = ({ onView, onEdit, onDocs, onDelete }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const items = [
        { label: "View Order", icon: "👁", action: onView },
        { label: "Edit Order", icon: "✏️", action: onEdit },
        { label: "Edit Docs", icon: "📄", action: onDocs },
        { label: "Delete", icon: "🗑", action: onDelete, danger: true },
    ];

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((p) => !p)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                style={{
                    color: open ? "#16a34a" : "#4a7a5c",
                    backgroundColor: open ? "#dcfce7" : "#f0faf4",
                }}
            >
                Actions
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>

            {open && (
                <div
                    className="absolute right-0 top-full mt-1 z-20 py-1 rounded-xl overflow-hidden min-w-40"
                    style={{
                        backgroundColor: "white",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                        border: "1px solid #e8f5ed",
                    }}
                >
                    {items.map(({ label, icon, action, danger }) => (
                        <button
                            key={label}
                            onClick={() => { action(); setOpen(false); }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left transition"
                            style={{ color: danger ? "#dc2626" : "#1a3d2b" }}
                            onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLElement).style.backgroundColor =
                                danger ? "#fef2f2" : "#f0faf4")
                            }
                            onMouseLeave={(e) =>
                                ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
                            }
                        >
                            <span>{icon}</span>
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const OrderList: React.FC<OrderListProps> = ({
    orders,
    customers,
    suppliers,
    onAdd,
    onEdit,
    onDelete,
    onUpdateDocs,
}) => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
    const [searchFocused, setSearchFocused] = useState(false);

    const [viewOrder, setViewOrder] = useState<Order | null>(null);
    const [editOrder, setEditOrder] = useState<Order | null>(null);
    const [docsOrder, setDocsOrder] = useState<Order | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [docsOpen, setDocsOpen] = useState(false);

    const getCustomerName = (id: string) =>
        customers.find((c) => c._id === id)?.company_name || "Unknown";
    const getSupplierName = (id: string) =>
        suppliers.find((s) => s._id === id)?.company_name || "Unknown";

    const filtered = orders.filter((o) => {
        const q = search.toLowerCase();
        const matchSearch =
            !q ||
            o.bill_of_lading_number.toLowerCase().includes(q) ||
            getCustomerName(o.customer_id).toLowerCase().includes(q) ||
            getSupplierName(o.supplier_id).toLowerCase().includes(q) ||
            o.shipping_line.toLowerCase().includes(q) ||
            o.country_of_origin_of_goods.toLowerCase().includes(q);
        const matchStatus =
            statusFilter === "All" || o.mill_payment_status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleSaveOrder = (o: Order) => {
        if (editOrder) onEdit(o);
        else onAdd(o);
        setEditOrder(null);
    };

    const filterBtns: FilterStatus[] = ["All", "Paid", "Pending", "Partial"];

    const statusColor: Record<FilterStatus, string> = {
        All: "#1a3d2b",
        Paid: "#15803d",
        Pending: "#a16207",
        Partial: "#1d4ed8",
    };

    return (
        <div>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                    <input
                        className="px-3 py-2 rounded-xl text-sm border outline-none w-64"
                        style={{
                            borderColor: searchFocused ? "#4ade80" : "#d1e9da",
                            boxShadow: searchFocused ? "0 0 0 3px rgba(74,222,128,0.12)" : "none",
                            backgroundColor: "white",
                            color: "#1a3d2b",
                        }}
                        placeholder="Search by BOL, customer, supplier…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                    <div
                        className="flex items-center rounded-xl overflow-hidden"
                        style={{ border: "1px solid #e8f5ed", backgroundColor: "white" }}
                    >
                        {filterBtns.map((btn) => (
                            <button
                                key={btn}
                                onClick={() => setStatusFilter(btn)}
                                className="px-3 py-2 text-xs font-medium transition"
                                style={{
                                    backgroundColor: statusFilter === btn ? "#f0faf4" : "transparent",
                                    color: statusFilter === btn ? statusColor[btn] : "#6b9e80",
                                    borderRight: btn !== "Partial" ? "1px solid #e8f5ed" : "none",
                                    fontWeight: statusFilter === btn ? 600 : 400,
                                }}
                            >
                                {btn}
                            </button>
                        ))}
                    </div>
                    <span className="text-sm" style={{ color: "#6b9e80" }}>
                        {filtered.length} order{filtered.length !== 1 ? "s" : ""}
                    </span>
                </div>
                <button
                    onClick={() => { setEditOrder(null); setFormOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #4ade80, #16a34a)" }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    New Order
                </button>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <EmptyState
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="#6b9e80" strokeWidth="2" strokeLinecap="round" />
                            <rect x="9" y="3" width="6" height="4" rx="1" stroke="#6b9e80" strokeWidth="2" />
                        </svg>
                    }
                    message="No orders found"
                />
            ) : (
                <div
                    className="bg-white rounded-2xl overflow-hidden"
                    style={{ border: "1px solid #e8f5ed" }}
                >
                    <table className="w-full">
                        <thead>
                            <tr style={{ backgroundColor: "#f7fdf9", borderBottom: "1px solid #e8f5ed" }}>
                                {[
                                    "Order",
                                    "Customer",
                                    "Supplier",
                                    "Route",
                                    "Dates",
                                    "Financials",
                                    "Status",
                                    "Docs",
                                    "Actions",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                                        style={{ color: "#4a7a5c" }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((order, i) => (
                                <tr
                                    key={order._id}
                                    style={{
                                        borderBottom: i < filtered.length - 1 ? "1px solid #f0faf4" : "none",
                                        cursor: "default",
                                    }}
                                    onMouseEnter={(e) =>
                                        ((e.currentTarget as HTMLElement).style.backgroundColor = "#fafffe")
                                    }
                                    onMouseLeave={(e) =>
                                        ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
                                    }
                                >
                                    {/* Order */}
                                    <td className="px-4 py-3.5">
                                        <div>
                                            <p className="text-sm font-bold" style={{ color: "#1a3d2b" }}>
                                                {order.bill_of_lading_number}
                                            </p>
                                            <p className="text-xs" style={{ color: "#6b9e80" }}>
                                                {order.shipping_line}
                                            </p>
                                        </div>
                                    </td>
                                    {/* Customer */}
                                    <td className="px-4 py-3.5">
                                        <p className="text-sm" style={{ color: "#1a3d2b" }}>
                                            {getCustomerName(order.customer_id)}
                                        </p>
                                    </td>
                                    {/* Supplier */}
                                    <td className="px-4 py-3.5">
                                        <p className="text-sm" style={{ color: "#1a3d2b" }}>
                                            {getSupplierName(order.supplier_id)}
                                        </p>
                                        <p className="text-xs" style={{ color: "#6b9e80" }}>
                                            {order.country_of_origin_of_goods}
                                        </p>
                                    </td>
                                    {/* Route */}
                                    <td className="px-4 py-3.5">
                                        <p className="text-xs" style={{ color: "#1a3d2b" }}>
                                            {order.port_of_loading}
                                        </p>
                                        <div className="flex items-center gap-1 my-0.5">
                                            <div className="flex-1 h-px" style={{ backgroundColor: "#4ade80" }} />
                                            <svg width="8" height="8" viewBox="0 0 24 24" fill="#4ade80">
                                                <path d="M5 12h14M12 5l7 7-7 7" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                        <p className="text-xs" style={{ color: "#1a3d2b" }}>
                                            {order.port_of_destination}
                                        </p>
                                    </td>
                                    {/* Dates */}
                                    <td className="px-4 py-3.5">
                                        <p className="text-xs" style={{ color: "#1a3d2b" }}>
                                            Load: {order.loading_date || "—"}
                                        </p>
                                        <p className="text-xs" style={{ color: "#6b9e80" }}>
                                            ETA: {order.expected_to_arrive || "—"}
                                        </p>
                                    </td>
                                    {/* Financials */}
                                    <td className="px-4 py-3.5">
                                        <p className="text-sm font-semibold" style={{ color: "#1a3d2b" }}>
                                            {order.selling_price}
                                        </p>
                                        <p className="text-xs" style={{ color: "#6b9e80" }}>
                                            Buy: {order.purchase_price}
                                        </p>
                                    </td>
                                    {/* Status */}
                                    <td className="px-4 py-3.5">
                                        {paymentStatusBadge(order.mill_payment_status)}
                                    </td>
                                    {/* Docs */}
                                    <td className="px-4 py-3.5">
                                        <span
                                            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg"
                                            style={{ backgroundColor: "#f0faf4", color: "#4a7a5c" }}
                                        >
                                            📄 {order.docs.length}
                                        </span>
                                    </td>
                                    {/* Actions */}
                                    <td className="px-4 py-3.5">
                                        <ActionMenu
                                            order={order}
                                            onView={() => { setViewOrder(order); setViewOpen(true); }}
                                            onEdit={() => { setEditOrder(order); setFormOpen(true); }}
                                            onDocs={() => { setDocsOrder(order); setDocsOpen(true); }}
                                            onDelete={() => {
                                                if (window.confirm(`Delete order ${order.bill_of_lading_number}?`))
                                                    onDelete(order._id);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modals */}
            <OrderView
                isOpen={viewOpen}
                onClose={() => setViewOpen(false)}
                order={viewOrder}
                customers={customers}
                suppliers={suppliers}
            />
            <OrderForm
                isOpen={formOpen}
                onClose={() => { setFormOpen(false); setEditOrder(null); }}
                onSave={handleSaveOrder}
                existing={editOrder}
                customers={customers}
                suppliers={suppliers}
            />
            <DocsModal
                isOpen={docsOpen}
                onClose={() => setDocsOpen(false)}
                order={docsOrder}
                onSave={(id, docs) => {
                    onUpdateDocs(id, docs);
                    setDocsOrder((prev) => prev ? { ...prev, docs } : null);
                }}
            />
        </div>
    );
};

export default OrderList;