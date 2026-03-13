import React from "react";
import type { Order, Customer, Supplier } from "../types";
import { Modal, paymentStatusBadge } from "./index";

interface OrderViewProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    customers: Customer[];
    suppliers: Supplier[];
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h4
        className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2"
        style={{ color: "#4a7a5c" }}
    >
        <span className="w-5 h-px" style={{ backgroundColor: "#4a7a5c", display: "inline-block" }} />
        {children}
    </h4>
);

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-xs" style={{ color: "#6b9e80" }}>{label}</p>
        <p className="text-sm font-medium mt-0.5" style={{ color: "#1a3d2b" }}>{value || "—"}</p>
    </div>
);

const OrderView: React.FC<OrderViewProps> = ({
    isOpen,
    onClose,
    order,
    customers,
    suppliers,
}) => {
    if (!order) return null;

    const customer = customers.find((c) => c._id === order.customer_id);
    const supplier = suppliers.find((s) => s._id === order.supplier_id);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Order Details" size="xl">
            {/* Top strip */}
            <div
                className="flex items-center justify-between px-4 py-3 rounded-xl mb-5"
                style={{ background: "linear-gradient(135deg, #0f2d1e, #1a4a2e)", color: "white" }}
            >
                <div>
                    <p className="text-xs" style={{ color: "#6bcf8a" }}>Bill of Lading</p>
                    <p className="text-base font-bold">{order.bill_of_lading_number}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs" style={{ color: "#6bcf8a" }}>Shipping Line</p>
                    <p className="text-sm font-semibold">{order.shipping_line}</p>
                </div>
                <div className="text-right">
                    {paymentStatusBadge(order.mill_payment_status)}
                    <p className="text-xs mt-1" style={{ color: "#6bcf8a" }}>Payment Status</p>
                </div>
            </div>

            {/* Route banner */}
            <div
                className="flex items-center justify-between px-4 py-3 rounded-xl mb-5"
                style={{ backgroundColor: "#f0faf4", border: "1px solid #e2f0e8" }}
            >
                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#4a7a5c" }}>Origin</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: "#1a3d2b" }}>{order.port_of_loading}</p>
                    <p className="text-xs" style={{ color: "#6b9e80" }}>{order.country_of_origin_of_goods}</p>
                </div>
                <div className="flex items-center gap-1 flex-1 px-6">
                    <div className="flex-1 h-px" style={{ background: "repeating-linear-gradient(90deg,#4ade80 0,#4ade80 6px,transparent 6px,transparent 12px)" }} />
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "#16a34a" }}>
                        <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(90deg)", transformOrigin: "center" }} />
                    </svg>
                    <div className="flex-1 h-px" style={{ background: "repeating-linear-gradient(90deg,#4ade80 0,#4ade80 6px,transparent 6px,transparent 12px)" }} />
                </div>
                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#4a7a5c" }}>Destination</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: "#1a3d2b" }}>{order.port_of_destination}</p>
                    <p className="text-xs" style={{ color: "#6b9e80" }}>{order.dilevery}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-5">
                {/* Parties */}
                <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: "#fafffe", border: "1px solid #e8f5ed" }}
                >
                    <SectionTitle>Customer</SectionTitle>
                    <div className="flex flex-col gap-2">
                        <Field label="Company" value={customer?.company_name} />
                        <Field label="Contact" value={customer?.name} />
                        <Field label="Mobile" value={customer?.mobile} />
                    </div>
                </div>
                <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: "#fafffe", border: "1px solid #e8f5ed" }}
                >
                    <SectionTitle>Supplier</SectionTitle>
                    <div className="flex flex-col gap-2">
                        <Field label="Company" value={supplier?.company_name} />
                        <Field label="Contact" value={supplier?.name} />
                        <Field label="Country" value={supplier?.country} />
                    </div>
                </div>
            </div>

            {/* Financials */}
            <div
                className="rounded-xl p-4 mb-5"
                style={{ backgroundColor: "#fafffe", border: "1px solid #e8f5ed" }}
            >
                <SectionTitle>Financials</SectionTitle>
                <div className="grid grid-cols-4 gap-4">
                    <Field label="Purchase Price" value={order.purchase_price} />
                    <Field label="Selling Price" value={order.selling_price} />
                    <Field label="Mill Payment" value={`₹${order.mill_payment?.toLocaleString()}`} />
                    <Field label="Freight Cost" value={order.freight_cost ? `₹${order.freight_cost.toLocaleString()}` : "—"} />
                </div>
            </div>

            {/* Dates */}
            <div
                className="rounded-xl p-4 mb-5"
                style={{ backgroundColor: "#fafffe", border: "1px solid #e8f5ed" }}
            >
                <SectionTitle>Timeline</SectionTitle>
                <div className="grid grid-cols-3 gap-4">
                    <Field label="Loading Date" value={order.loading_date} />
                    <Field label="Shipped On" value={order.shipped_on_date || "Not yet shipped"} />
                    <Field label="Expected Arrival" value={order.expected_to_arrive} />
                </div>
            </div>

            {/* Materials */}
            {order.materials.length > 0 && (
                <div
                    className="rounded-xl p-4 mb-5"
                    style={{ backgroundColor: "#fafffe", border: "1px solid #e8f5ed" }}
                >
                    <SectionTitle>Materials ({order.materials.length})</SectionTitle>
                    <div className="flex flex-col gap-3">
                        {order.materials.map((mat, i) => (
                            <div
                                key={mat._id || i}
                                className="rounded-lg p-3"
                                style={{ backgroundColor: "white", border: "1px solid #e8f5ed" }}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-semibold" style={{ color: "#1a3d2b" }}>
                                            {mat.material_description}
                                        </p>
                                        <p className="text-xs" style={{ color: "#6b9e80" }}>
                                            Container: {mat.container_number}
                                        </p>
                                    </div>
                                    <span
                                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                                        style={{ backgroundColor: "#dcfce7", color: "#15803d" }}
                                    >
                                        BOE: {mat.bill_of_entry}
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    <Field label="Gross Wt" value={`${mat.gross_weight?.toLocaleString()} kg`} />
                                    <Field label="Net Wt" value={`${mat.net_weight?.toLocaleString()} kg`} />
                                    <Field label="Sales Bill Price" value={`₹${mat.sales_bill_price?.toLocaleString()}`} />
                                    <Field label="GST Amount" value={`₹${mat.gst_amount_sales_bill?.toLocaleString()}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Docs */}
            {order.docs.length > 0 && (
                <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: "#fafffe", border: "1px solid #e8f5ed" }}
                >
                    <SectionTitle>Documents ({order.docs.length})</SectionTitle>
                    <div className="grid grid-cols-2 gap-3">
                        {order.docs.map((doc, i) => (
                            <div
                                key={doc._id || i}
                                className="flex items-start gap-3 rounded-lg p-3"
                                style={{ backgroundColor: "white", border: "1px solid #e8f5ed" }}
                            >
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: "#dcfce7" }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium" style={{ color: "#1a3d2b" }}>{doc.doc_name}</p>
                                    <p className="text-xs" style={{ color: "#6b9e80" }}>{doc.doc_type} · {doc.issued_by}</p>
                                    <p className="text-xs mt-0.5" style={{ color: "#6b9e80" }}>Value: {doc.total_value}</p>
                                </div>
                                {doc.doc_url && (
                                    <a
                                        href={doc.doc_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs px-2 py-1 rounded-lg flex-shrink-0"
                                        style={{ color: "#16a34a", backgroundColor: "#f0faf4" }}
                                    >
                                        View
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default OrderView;