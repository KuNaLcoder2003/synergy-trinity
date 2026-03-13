import React from "react";
import type { Order, Customer, Supplier } from "../types";
import { paymentStatusBadge } from "./index";

interface DashboardProps {
    orders: Order[];
    customers: Customer[];
    suppliers: Supplier[];
    onNavigate: (view: "orders" | "customers" | "suppliers") => void;
}

const StatCard: React.FC<{
    label: string;
    value: string | number;
    sub?: string;
    color: string;
    icon: React.ReactNode;
    onClick?: () => void;
}> = ({ label, value, sub, color, icon, onClick }) => (
    <div
        className="bg-white rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md"
        style={{ border: "1px solid #e8f5ed" }}
        onClick={onClick}
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b9e80" }}>
                    {label}
                </p>
                <p className="text-3xl font-bold mt-1" style={{ color: "#1a3d2b" }}>
                    {value}
                </p>
                {sub && <p className="text-xs mt-1" style={{ color: "#6b9e80" }}>{sub}</p>}
            </div>
            <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: color + "18" }}
            >
                <span style={{ color }}>{icon}</span>
            </div>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({
    orders,
    customers,
    suppliers,
    onNavigate,
}) => {
    const totalRevenue = orders.reduce((acc, o) => {
        const val = parseFloat(o.selling_price.replace(/[^0-9.]/g, "")) || 0;
        return acc + val;
    }, 0);

    const paidOrders = orders.filter((o) => o.mill_payment_status === "Paid").length;
    const pendingOrders = orders.filter((o) => o.mill_payment_status === "Pending").length;

    const recentOrders = [...orders]
        .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
        .slice(0, 5);

    const getCustomerName = (id: string) =>
        customers.find((c) => c._id === id)?.company_name || "—";


    const countryFlags: Record<string, string> = {
        China: "🇨🇳", UAE: "🇦🇪", Japan: "🇯🇵", "South Korea": "🇰🇷", India: "🇮🇳",
    };

    const originCounts: Record<string, number> = {};
    orders.forEach((o) => {
        originCounts[o.country_of_origin_of_goods] =
            (originCounts[o.country_of_origin_of_goods] || 0) + 1;
    });

    return (
        <div className="flex flex-col gap-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard
                    label="Total Orders"
                    value={orders.length}
                    sub={`${paidOrders} paid · ${pendingOrders} pending`}
                    color="#16a34a"
                    onClick={() => onNavigate("orders")}
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
                            <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    }
                />
                <StatCard
                    label="Customers"
                    value={customers.length}
                    sub="Active accounts"
                    color="#0ea5e9"
                    onClick={() => onNavigate("customers")}
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                            <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M19 8v6M22 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    }
                />
                <StatCard
                    label="Suppliers"
                    value={suppliers.length}
                    sub="Active vendors"
                    color="#f59e0b"
                    onClick={() => onNavigate("suppliers")}
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M3 9l9-6 9 6v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    }
                />
                <StatCard
                    label="Total Revenue"
                    value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
                    sub="From all orders"
                    color="#8b5cf6"
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    }
                />
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-3 gap-4">
                {/* Recent Orders */}
                <div
                    className="col-span-2 bg-white rounded-2xl p-5"
                    style={{ border: "1px solid #e8f5ed" }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-sm" style={{ color: "#1a3d2b" }}>
                            Recent Orders
                        </h3>
                        <button
                            className="text-xs font-medium px-3 py-1.5 rounded-lg transition"
                            style={{ color: "#16a34a", backgroundColor: "#f0faf4" }}
                            onClick={() => onNavigate("orders")}
                        >
                            View all →
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {recentOrders.map((order) => (
                            <div
                                key={order._id}
                                className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                                style={{ backgroundColor: "#fafffe", border: "1px solid #e8f5ed" }}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                                        style={{ backgroundColor: "#dcfce7", color: "#15803d" }}
                                    >
                                        {order.bill_of_lading_number.slice(-3)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: "#1a3d2b" }}>
                                            {order.bill_of_lading_number}
                                        </p>
                                        <p className="text-xs" style={{ color: "#6b9e80" }}>
                                            {getCustomerName(order.customer_id)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm font-semibold" style={{ color: "#1a3d2b" }}>
                                            {order.selling_price}
                                        </p>
                                        <p className="text-xs" style={{ color: "#6b9e80" }}>
                                            {order.port_of_destination.split(" - ")[1] || order.port_of_destination}
                                        </p>
                                    </div>
                                    {paymentStatusBadge(order.mill_payment_status)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Origin Breakdown */}
                <div
                    className="bg-white rounded-2xl p-5"
                    style={{ border: "1px solid #e8f5ed" }}
                >
                    <h3 className="font-semibold text-sm mb-4" style={{ color: "#1a3d2b" }}>
                        Origins
                    </h3>
                    <div className="flex flex-col gap-3">
                        {Object.entries(originCounts).map(([country, count]) => (
                            <div key={country} className="flex items-center gap-3">
                                <span className="text-xl">{countryFlags[country] || "🌐"}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-medium" style={{ color: "#1a3d2b" }}>
                                            {country}
                                        </span>
                                        <span className="text-xs" style={{ color: "#6b9e80" }}>
                                            {count} order{count !== 1 ? "s" : ""}
                                        </span>
                                    </div>
                                    <div
                                        className="h-1.5 rounded-full"
                                        style={{ backgroundColor: "#e8f5ed" }}
                                    >
                                        <div
                                            className="h-1.5 rounded-full"
                                            style={{
                                                width: `${(count / orders.length) * 100}%`,
                                                background: "linear-gradient(90deg, #4ade80, #16a34a)",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Shipping Lines */}
                    <h3 className="font-semibold text-sm mt-6 mb-3" style={{ color: "#1a3d2b" }}>
                        Shipping Lines
                    </h3>
                    <div className="flex flex-col gap-2">
                        {Array.from(new Set(orders.map((o) => o.shipping_line))).map((line) => (
                            <div
                                key={line}
                                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg"
                                style={{ backgroundColor: "#f0faf4" }}
                            >
                                <span className="text-xs" style={{ color: "#1a3d2b" }}>{line}</span>
                                <span
                                    className="text-xs font-semibold px-1.5 rounded"
                                    style={{ color: "#16a34a" }}
                                >
                                    {orders.filter((o) => o.shipping_line === line).length}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;