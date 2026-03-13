import React, { useState, useEffect } from "react";
import type { Order, Customer, Supplier } from "../types";
import { Modal, FormField, inputClass, inputStyle } from "./index";

interface OrderFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (order: Order) => void;
    existing?: Order | null;
    customers: Customer[];
    suppliers: Supplier[];
}

type OrderFields = Omit<Order, "_id" | "docs" | "materials">;

const emptyOrder = (): OrderFields => ({
    bill_of_lading_number: "",
    cha: "",
    customer_id: "",
    supplier_id: "",
    dilevery: "",
    expected_to_arrive: "",
    loading_date: "",
    mill_payment_status: "Pending",
    mill_payment: 0,
    port_of_destination: "",
    port_of_loading: "",
    purchase_price: "",
    selling_price: "",
    shipped_on_date: "",
    shipping_line: "",
    country_of_origin_of_goods: "",
    freight_cost: 0,
    shipping_line_cost: 0,
    createdAt: new Date().toISOString().split("T")[0],
});

const paymentStatuses = ["Paid", "Pending", "Partial"];
const deliveryTerms = ["CIF", "FOB", "CFR", "EXW", "DDP", "DAP"];

const OrderForm: React.FC<OrderFormProps> = ({
    isOpen,
    onClose,
    onSave,
    existing,
    customers,
    suppliers,
}) => {
    const [form, setForm] = useState<OrderFields>(emptyOrder());
    const [focused, setFocused] = useState<string | null>(null);

    useEffect(() => {
        if (existing) {
            const { _id, docs, materials, ...rest } = existing;
            setForm({ ...emptyOrder(), ...rest });
        } else {
            setForm(emptyOrder());
        }
    }, [existing, isOpen]);

    const set = <K extends keyof OrderFields>(key: K, value: OrderFields[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const inputSty = (field: string) => ({
        ...inputStyle,
        ...(focused === field
            ? { borderColor: "#4ade80", boxShadow: "0 0 0 3px rgba(74,222,128,0.12)" }
            : {}),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const order: Order = {
            _id: existing?._id || `ord_${Date.now()}`,
            docs: existing?.docs || [],
            materials: existing?.materials || [],
            ...form,
        };
        onSave(order);
        onClose();
    };

    const selectClass = `${inputClass} cursor-pointer`;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={existing ? "Edit Order" : "Create New Order"}
            size="xl"
        >
            <form onSubmit={handleSubmit}>
                {/* Parties */}
                <div
                    className="rounded-xl p-4 mb-4"
                    style={{ backgroundColor: "#fafffe", border: "1px solid #e8f5ed" }}
                >
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#4a7a5c" }}>
                        — Parties
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Customer" required>
                            <select
                                className={selectClass}
                                style={inputSty("customer_id")}
                                value={form.customer_id}
                                onChange={(e) => set("customer_id", e.target.value)}
                                onFocus={() => setFocused("customer_id")}
                                onBlur={() => setFocused(null)}
                                required
                            >
                                <option value="">Select customer…</option>
                                {customers.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.company_name}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                        <FormField label="Supplier" required>
                            <select
                                className={selectClass}
                                style={inputSty("supplier_id")}
                                value={form.supplier_id}
                                onChange={(e) => set("supplier_id", e.target.value)}
                                onFocus={() => setFocused("supplier_id")}
                                onBlur={() => setFocused(null)}
                                required
                            >
                                <option value="">Select supplier…</option>
                                {suppliers.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.company_name}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                    </div>
                </div>

                {/* Shipment */}
                <div
                    className="rounded-xl p-4 mb-4"
                    style={{ backgroundColor: "#fafffe", border: "1px solid #e8f5ed" }}
                >
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#4a7a5c" }}>
                        — Shipment Info
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        <FormField label="Bill of Lading No." required>
                            <input
                                className={inputClass}
                                style={inputSty("bol")}
                                value={form.bill_of_lading_number}
                                onChange={(e) => set("bill_of_lading_number", e.target.value)}
                                onFocus={() => setFocused("bol")}
                                onBlur={() => setFocused(null)}
                                placeholder="e.g. MBOL2024001"
                                required
                            />
                        </FormField>
                        <FormField label="Shipping Line">
                            <input
                                className={inputClass}
                                style={inputSty("shipping_line")}
                                value={form.shipping_line}
                                onChange={(e) => set("shipping_line", e.target.value)}
                                onFocus={() => setFocused("shipping_line")}
                                onBlur={() => setFocused(null)}
                                placeholder="e.g. COSCO Shipping"
                            />
                        </FormField>
                        <FormField label="CHA">
                            <input
                                className={inputClass}
                                style={inputSty("cha")}
                                value={form.cha}
                                onChange={(e) => set("cha", e.target.value)}
                                onFocus={() => setFocused("cha")}
                                onBlur={() => setFocused(null)}
                                placeholder="Customs House Agent"
                            />
                        </FormField>
                        <FormField label="Port of Loading">
                            <input
                                className={inputClass}
                                style={inputSty("pol")}
                                value={form.port_of_loading}
                                onChange={(e) => set("port_of_loading", e.target.value)}
                                onFocus={() => setFocused("pol")}
                                onBlur={() => setFocused(null)}
                                placeholder="e.g. CNNGB - Ningbo"
                            />
                        </FormField>
                        <FormField label="Port of Destination">
                            <input
                                className={inputClass}
                                style={inputSty("pod")}
                                value={form.port_of_destination}
                                onChange={(e) => set("port_of_destination", e.target.value)}
                                onFocus={() => setFocused("pod")}
                                onBlur={() => setFocused(null)}
                                placeholder="e.g. INNSA1 - Nhava Sheva"
                            />
                        </FormField>
                        <FormField label="Country of Origin">
                            <input
                                className={inputClass}
                                style={inputSty("coo")}
                                value={form.country_of_origin_of_goods}
                                onChange={(e) => set("country_of_origin_of_goods", e.target.value)}
                                onFocus={() => setFocused("coo")}
                                onBlur={() => setFocused(null)}
                                placeholder="e.g. China"
                            />
                        </FormField>
                        <FormField label="Delivery Terms">
                            <select
                                className={selectClass}
                                style={inputSty("delivery")}
                                value={form.dilevery.split(" ")[0] || ""}
                                onChange={(e) => set("dilevery", e.target.value)}
                                onFocus={() => setFocused("delivery")}
                                onBlur={() => setFocused(null)}
                            >
                                <option value="">Select terms…</option>
                                {deliveryTerms.map((t) => <option key={t}>{t}</option>)}
                            </select>
                        </FormField>
                    </div>
                </div>

                {/* Dates */}
                <div
                    className="rounded-xl p-4 mb-4"
                    style={{ backgroundColor: "#fafffe", border: "1px solid #e8f5ed" }}
                >
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#4a7a5c" }}>
                        — Timeline
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        <FormField label="Loading Date">
                            <input type="date" className={inputClass} style={inputSty("loading_date")}
                                value={form.loading_date}
                                onChange={(e) => set("loading_date", e.target.value)}
                                onFocus={() => setFocused("loading_date")} onBlur={() => setFocused(null)} />
                        </FormField>
                        <FormField label="Shipped On Date">
                            <input type="date" className={inputClass} style={inputSty("shipped_on_date")}
                                value={form.shipped_on_date}
                                onChange={(e) => set("shipped_on_date", e.target.value)}
                                onFocus={() => setFocused("shipped_on_date")} onBlur={() => setFocused(null)} />
                        </FormField>
                        <FormField label="Expected Arrival">
                            <input type="date" className={inputClass} style={inputSty("expected_to_arrive")}
                                value={form.expected_to_arrive}
                                onChange={(e) => set("expected_to_arrive", e.target.value)}
                                onFocus={() => setFocused("expected_to_arrive")} onBlur={() => setFocused(null)} />
                        </FormField>
                    </div>
                </div>

                {/* Financials */}
                <div
                    className="rounded-xl p-4 mb-4"
                    style={{ backgroundColor: "#fafffe", border: "1px solid #e8f5ed" }}
                >
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#4a7a5c" }}>
                        — Financials
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        <FormField label="Purchase Price">
                            <input className={inputClass} style={inputSty("pp")}
                                value={form.purchase_price} placeholder="₹0"
                                onChange={(e) => set("purchase_price", e.target.value)}
                                onFocus={() => setFocused("pp")} onBlur={() => setFocused(null)} />
                        </FormField>
                        <FormField label="Selling Price">
                            <input className={inputClass} style={inputSty("sp")}
                                value={form.selling_price} placeholder="₹0"
                                onChange={(e) => set("selling_price", e.target.value)}
                                onFocus={() => setFocused("sp")} onBlur={() => setFocused(null)} />
                        </FormField>
                        <FormField label="Mill Payment">
                            <input type="number" className={inputClass} style={inputSty("mp")}
                                value={form.mill_payment || ""}
                                onChange={(e) => set("mill_payment", parseFloat(e.target.value) || 0)}
                                onFocus={() => setFocused("mp")} onBlur={() => setFocused(null)} />
                        </FormField>
                        <FormField label="Payment Status">
                            <select className={selectClass} style={inputSty("mps")}
                                value={form.mill_payment_status}
                                onChange={(e) => set("mill_payment_status", e.target.value)}
                                onFocus={() => setFocused("mps")} onBlur={() => setFocused(null)}>
                                {paymentStatuses.map((s) => <option key={s}>{s}</option>)}
                            </select>
                        </FormField>
                        <FormField label="Freight Cost">
                            <input type="number" className={inputClass} style={inputSty("fc")}
                                value={form.freight_cost || ""}
                                onChange={(e) => set("freight_cost", parseFloat(e.target.value) || 0)}
                                onFocus={() => setFocused("fc")} onBlur={() => setFocused(null)} />
                        </FormField>
                        <FormField label="Shipping Line Cost">
                            <input type="number" className={inputClass} style={inputSty("slc")}
                                value={form.shipping_line_cost || ""}
                                onChange={(e) => set("shipping_line_cost", parseFloat(e.target.value) || 0)}
                                onFocus={() => setFocused("slc")} onBlur={() => setFocused(null)} />
                        </FormField>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button type="button" onClick={onClose}
                        className="px-4 py-2 rounded-xl text-sm font-medium"
                        style={{ color: "#4a7a5c", backgroundColor: "#f0faf4" }}>
                        Cancel
                    </button>
                    <button type="submit"
                        className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
                        style={{ background: "linear-gradient(135deg, #4ade80, #16a34a)" }}>
                        {existing ? "Save Changes" : "Create Order"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default OrderForm;