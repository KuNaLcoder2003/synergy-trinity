import React from "react";
import type { ActiveView } from "../types";

interface LayoutProps {
    activeView: ActiveView;
    onNavigate: (view: ActiveView) => void;
    children: React.ReactNode;
    stats: { orders: number; customers: number; suppliers: number };
}

const navItems: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
        ),
    },
    {
        id: "orders",
        label: "Orders",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.8" />
                <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        id: "customers",
        label: "Customers",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M19 8v6M22 11h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        id: "suppliers",
        label: "Suppliers",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-6 9 6v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
];

const Layout: React.FC<LayoutProps> = ({
    activeView,
    onNavigate,
    children,
    stats,
}) => {
    return (
        <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#f5fbf7", fontFamily: "'DM Sans', sans-serif" }}>
            {/* Sidebar */}
            <aside
                className="w-60 flex flex-col h-full flex-shrink-0"
                style={{
                    background: "linear-gradient(175deg, #0f2d1e 0%, #1a4a2e 60%, #1e5435 100%)",
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                {/* Logo */}
                <div className="px-6 py-6 flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #4ade80, #16a34a)" }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm leading-tight">OpsFlow</p>
                        <p className="text-xs" style={{ color: "#6bcf8a" }}>Operations Console</p>
                    </div>
                </div>

                {/* Divider */}
                <div className="mx-5 mb-4" style={{ height: "1px", background: "rgba(255,255,255,0.08)" }} />

                {/* Nav */}
                <nav className="px-3 flex flex-col gap-1 flex-1">
                    {navItems.map(({ id, label, icon }) => {
                        const isActive = activeView === id;
                        return (
                            <button
                                key={id}
                                onClick={() => onNavigate(id)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-all"
                                style={{
                                    backgroundColor: isActive ? "rgba(74,222,128,0.15)" : "transparent",
                                    color: isActive ? "#4ade80" : "rgba(255,255,255,0.55)",
                                    borderLeft: isActive ? "2px solid #4ade80" : "2px solid transparent",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)";
                                        (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                                        (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
                                    }
                                }}
                            >
                                {icon}
                                <span className="text-sm font-medium">{label}</span>
                                {id !== "dashboard" && (
                                    <span
                                        className="ml-auto text-xs px-1.5 py-0.5 rounded-md font-semibold"
                                        style={{
                                            backgroundColor: isActive ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.08)",
                                            color: isActive ? "#4ade80" : "rgba(255,255,255,0.4)",
                                        }}
                                    >
                                        {id === "orders" ? stats.orders : id === "customers" ? stats.customers : stats.suppliers}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="px-5 py-4">
                    <div
                        className="rounded-xl p-3"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        <p className="text-xs font-semibold" style={{ color: "#4ade80" }}>System Status</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>All systems operational</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header
                    className="flex items-center justify-between px-8 py-4 flex-shrink-0"
                    style={{
                        backgroundColor: "white",
                        borderBottom: "1px solid #e8f5ed",
                    }}
                >
                    <div>
                        <h1 className="text-xl font-bold capitalize" style={{ color: "#1a3d2b" }}>
                            {activeView === "dashboard" ? "Overview" : activeView}
                        </h1>
                        <p className="text-xs mt-0.5" style={{ color: "#6b9e80" }}>
                            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
                            style={{ backgroundColor: "#f0faf4", color: "#4a7a5c" }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span className="font-medium">Search</span>
                        </div>
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
                            style={{ background: "linear-gradient(135deg, #4ade80, #16a34a)", color: "white" }}
                        >
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto px-8 py-6">{children}</div>
            </main>
        </div>
    );
};

export default Layout;