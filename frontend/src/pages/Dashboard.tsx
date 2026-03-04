import React, { useEffect, useRef, useState } from "react";
import { } from "lucide-react";
import CustomerList from "../components/Customers";
import SupplierList from "../components/Suppliers";
import Orders from "../components/Orders";

/* =======================
   TYPES
======================= */

type TabName = "Home" | "Orders" | "Suppliers" | "Customers" | "Payments";

interface TabItem {
    id: string;
    tab_name: TabName;
}

interface CardItem {
    label: string;
    value: string;
    change: string;
    up: boolean;
}

interface ContentData {
    title: string;
    subtitle: string;
    cards: CardItem[];
    extra: string[];
}

/* =======================
   ICONS
======================= */



const ChevronLeft = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const TrendUp = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);

const TrendDown = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
        <polyline points="17 18 23 18 23 12" />
    </svg>
);

const icons: Record<TabName, React.ReactNode> = {
    Home: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    ),
    Orders: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    ),
    Suppliers: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <rect x="1" y="3" width="15" height="13" rx="2" />
            <path d="M16 8h4l3 3v5h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
    ),
    Customers: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    Payments: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
    ),
};

/* =======================
   MOCK DATA
======================= */

const mockContent: Record<TabName, ContentData> = {
    Home: {
        title: "Dashboard Overview",
        subtitle: "Welcome back, here's what's happening today.",
        cards: [
            { label: "Total Revenue", value: "₹4,28,500", change: "+12.4%", up: true },
            { label: "Active Orders", value: "1,284", change: "+3.1%", up: true },
            { label: "New Customers", value: "324", change: "-1.2%", up: false },
            { label: "Pending Payments", value: "₹72,300", change: "+8.7%", up: true },
        ],
        extra: [
            "Top performing category: Electronics (+22%)",
            "3 new suppliers onboarded this week",
            "Monthly target 84% achieved",
        ],
    },

    Orders: {
        title: "Orders Management",
        subtitle: "Track, manage, and fulfill all your orders in one place.",
        cards: [
            { label: "Total Orders", value: "8,492", change: "+5.2%", up: true },
            { label: "Shipped", value: "6,210", change: "+9.0%", up: true },
            { label: "Pending", value: "1,802", change: "+2.3%", up: true },
            { label: "Cancelled", value: "480", change: "-4.1%", up: false },
        ],
        extra: [
            "Average fulfillment time: 1.8 days",
            "Express delivery orders: 412 this week",
            "Return rate: 2.3% (industry avg 4.1%)",
        ],
    },

    Suppliers: {
        title: "Supplier Network",
        subtitle: "Manage your vendor relationships and supply chain.",
        cards: [
            { label: "Active Suppliers", value: "142", change: "+3", up: true },
            { label: "On-time Delivery", value: "96.2%", change: "+1.1%", up: true },
            { label: "Pending Invoices", value: "38", change: "-6", up: false },
            { label: "Avg Lead Time", value: "4.2 days", change: "-0.3d", up: false },
        ],
        extra: [
            "Top supplier: GreenTech Pvt Ltd",
            "Contract renewals due: 7 in next 30 days",
            "Quality score average: 4.7 / 5",
        ],
    },

    Customers: {
        title: "Customer Intelligence",
        subtitle: "Understand and grow your customer base.",
        cards: [
            { label: "Total Customers", value: "28,410", change: "+8.6%", up: true },
            { label: "Active (30d)", value: "11,230", change: "+4.2%", up: true },
            { label: "Churn Rate", value: "1.8%", change: "-0.4%", up: false },
            { label: "Avg Order Value", value: "₹3,240", change: "+11%", up: true },
        ],
        extra: [
            "NPS Score: 72 (Excellent)",
            "Loyalty program members: 8,420",
            "Top region: Mumbai & Pune corridor",
        ],
    },

    Payments: {
        title: "Payments & Finances",
        subtitle: "Monitor cash flow, transactions, and payment health.",
        cards: [
            { label: "Total Collected", value: "₹12.4M", change: "+14.3%", up: true },
            { label: "Outstanding", value: "₹1.8M", change: "-3.2%", up: false },
            { label: "Refunds Issued", value: "₹84,200", change: "+1.1%", up: true },
            { label: "Payment Success", value: "98.7%", change: "+0.4%", up: true },
        ],
        extra: [
            "UPI transactions up 34% this month",
            "3 failed payment retries pending review",
            "Next payout cycle: March 1, 2026",
        ],
    },
};

/* =======================
   COMPONENT
======================= */

const DashBoard: React.FC = () => {
    const tabs: TabItem[] = [
        { id: "Tab-1", tab_name: "Home" },
        { id: "Tab-2", tab_name: "Orders" },
        { id: "Tab-3", tab_name: "Suppliers" },
        { id: "Tab-4", tab_name: "Customers" },
        { id: "Tab-5", tab_name: "Payments" },
    ];

    const [activeTab, setActiveTab] = useState<string>("Tab-1");
    const [minimized, setMinimized] = useState<boolean>(false);
    const [contentVisible, setContentVisible] = useState<boolean>(true);

    const mainRef = useRef<HTMLElement | null>(null);

    const activeTabName =
        tabs.find((t) => t.id === activeTab)?.tab_name ?? "Home";

    const activeData = mockContent[activeTabName];

    const handleTabChange = (id: string) => {
        if (id === activeTab) return;

        setContentVisible(false);

        setTimeout(() => {
            setActiveTab(id);
            setContentVisible(true);
        }, 180);
    };

    useEffect(() => {
        mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, [activeTab]);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden w-screen">
            <div
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="flex h-screen bg-gray-50 overflow-hidden w-screen"
            >
                <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1fae5; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #6ee7b7; }

        .sidebar-transition { transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
        .label-transition { transition: opacity 0.2s ease, transform 0.2s ease, max-width 0.3s ease; }
        .content-fade { transition: opacity 0.18s ease, transform 0.18s ease; }
        .content-visible { opacity: 1; transform: translateY(0px); }
        .content-hidden { opacity: 0; transform: translateY(8px); }
        .tab-item { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .tab-item:hover { background: rgba(16, 185, 129, 0.08); }
        .minimize-btn { transition: all 0.2s ease; }
        .minimize-btn:hover { background: #f0fdf4; transform: scale(1.05); }
        .card-hover { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(16, 185, 129, 0.12); }
        .pulse-dot { animation: pulse-green 2s infinite; }
        @keyframes pulse-green {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .logo-ring { animation: spin-slow 12s linear infinite; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

                {/* ── SIDEBAR ── */}
                <aside
                    className={`sidebar-transition relative flex flex-col bg-white border-r border-gray-100 shadow-sm z-20 ${minimized ? "w-20" : "w-64"
                        }`}
                    style={{ minHeight: "100vh" }}
                >
                    {/* Logo area */}
                    <div className={`flex items-center gap-3 px-5 py-5 border-b border-gray-100 ${minimized ? "justify-center px-0" : ""}`}>
                        <div className="relative flex-shrink-0 w-9 h-9">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="pulse-dot absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full"></span>
                        </div>
                        <div className={`label-transition overflow-hidden ${minimized ? "opacity-0 max-w-0" : "opacity-100 max-w-xs"}`}>
                            <p className="font-bold text-gray-900 text-base leading-tight tracking-tight whitespace-nowrap">Synergy-Trinity</p>
                            <p className="text-xs text-emerald-500 font-medium whitespace-nowrap">v2.4 · Live</p>
                        </div>
                    </div>

                    {/* Nav label */}
                    <div className={`label-transition px-5 pt-5 pb-2 ${minimized ? "opacity-0 max-w-0 px-0" : "opacity-100"}`}>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">Navigation</p>
                    </div>

                    {/* Tabs */}
                    <nav className="flex flex-col gap-1 px-3 flex-1 overflow-y-auto pt-2">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`
                  tab-item relative flex items-center gap-3.5 rounded-xl px-3 py-3 w-full text-left
                  ${minimized ? "justify-center" : ""}
                  ${isActive
                                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                                            : "text-gray-500 hover:text-gray-800"
                                        }
                `}
                                >
                                    {/* Active indicator glow */}
                                    {isActive && (
                                        <span className="absolute inset-0 rounded-xl bg-emerald-400 opacity-20 blur-sm -z-10"></span>
                                    )}

                                    <span className={`flex-shrink-0 ${isActive ? "text-white" : "text-gray-400"}`}>
                                        {icons[tab.tab_name]}
                                    </span>

                                    <span
                                        className={`label-transition text-sm font-semibold whitespace-nowrap overflow-hidden ${minimized ? "opacity-0 max-w-0" : "opacity-100 max-w-xs"
                                            }`}
                                    >
                                        {tab.tab_name}
                                    </span>

                                    {/* Active pip when minimized */}
                                    {isActive && minimized && (
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* User avatar area */}
                    <div className={`border-t border-gray-100 p-4 flex items-center gap-3 ${minimized ? "justify-center" : ""}`}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md shadow-emerald-100">
                            RS
                        </div>
                        <div className={`label-transition overflow-hidden ${minimized ? "opacity-0 max-w-0" : "opacity-100 max-w-xs"}`}>
                            <p className="text-sm font-semibold text-gray-800 whitespace-nowrap leading-tight">Ravinder Singh</p>
                            <p className="text-xs text-gray-400 whitespace-nowrap">Admin · Jaipur</p>
                        </div>
                    </div>

                    {/* Minimize button */}
                    <button
                        onClick={() => setMinimized((v) => !v)}
                        className="minimize-btn absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 shadow-md z-30"
                        title={minimized ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <span style={{ transform: minimized ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", display: "flex" }}>
                            <ChevronLeft />
                        </span>
                    </button>
                </aside>

                {/* ── MAIN ── */}
                <div className="flex flex-col flex-1 overflow-hidden">

                    {/* Top bar */}
                    <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between flex-shrink-0 z-10">
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 leading-tight">
                                {activeData?.title}
                            </h1>
                            <p className="text-sm text-gray-400 mt-0.5">{activeData?.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 w-52">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input className="bg-transparent text-sm text-gray-600 outline-none placeholder-gray-400 w-full" placeholder="Search..." />
                            </div>
                            {/* Bell */}
                            <button className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5 w-5 h-5">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
                            </button>
                        </div>
                    </header>

                    {/* Scrollable content */}
                    <main
                        ref={mainRef}
                        className="flex-1 overflow-y-auto p-8"
                        style={{ scrollBehavior: "smooth" }}
                    >
                        {
                            activeTab == "Tab-4" ? <CustomerList /> : activeTab == 'Tab-3' ? <SupplierList /> : activeTab == 'Tab-2' ? <Orders /> : <div className={`content-fade ${contentVisible ? "content-visible" : "content-hidden"}`}>

                                {/* Stat Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                                    {activeData?.cards.map((card, i) => (
                                        <div
                                            key={i}
                                            className="card-hover bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
                                        >
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{card.label}</p>
                                            <p className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">{card.value}</p>
                                            <div className={`flex items-center gap-1.5 text-xs font-semibold ${card.up ? "text-emerald-600" : "text-rose-500"}`}>
                                                {card.up ? <TrendUp /> : <TrendDown />}
                                                <span>{card.change}</span>
                                                <span className="text-gray-400 font-normal ml-1">vs last month</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Highlights + Chart placeholder */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

                                    {/* Key Highlights */}
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                        <div className="flex items-center gap-2 mb-5">
                                            <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
                                            <h3 className="text-sm font-bold text-gray-800">Key Highlights</h3>
                                        </div>
                                        <ul className="flex flex-col gap-3">
                                            {activeData?.extra.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                                                    <span className="text-sm text-gray-600 leading-snug">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Trend visualization */}
                                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
                                                <h3 className="text-sm font-bold text-gray-800">Monthly Trend</h3>
                                            </div>
                                            <div className="flex gap-2">
                                                {["7D", "1M", "3M", "1Y"].map((p, i) => (
                                                    <button key={p} className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${i === 1 ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200" : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"}`}>{p}</button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Decorative bar chart */}
                                        <div className="flex items-end gap-2 h-36">
                                            {[40, 65, 52, 80, 60, 90, 74, 88, 55, 70, 85, 95].map((h, i) => (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                    <div
                                                        className="w-full rounded-lg transition-all duration-500"
                                                        style={{
                                                            height: `${h}%`,
                                                            background: i === 11
                                                                ? "linear-gradient(180deg, #10b981, #6ee7b7)"
                                                                : i >= 9
                                                                    ? "rgba(16, 185, 129, 0.4)"
                                                                    : "rgba(16, 185, 129, 0.15)",
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                                                <span key={m} className="text-xs text-gray-300 font-medium">{m}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Activity Table */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
                                            <h3 className="text-sm font-bold text-gray-800">Recent Activity</h3>
                                        </div>
                                        <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-all">View all →</button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-50">
                                                    {["ID", "Description", "Date", "Amount", "Status"].map((h) => (
                                                        <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[
                                                    { id: "#0041", desc: "Invoice cleared – GreenTech", date: "Feb 24, 2026", amt: "₹84,200", status: "Completed" },
                                                    { id: "#0040", desc: "New order received – Mumbai", date: "Feb 23, 2026", amt: "₹12,400", status: "Processing" },
                                                    { id: "#0039", desc: "Refund issued – Order #0031", date: "Feb 22, 2026", amt: "₹3,200", status: "Refunded" },
                                                    { id: "#0038", desc: "Supplier payment – Apex Ltd", date: "Feb 21, 2026", amt: "₹56,000", status: "Completed" },
                                                    { id: "#0037", desc: "Customer onboarded – Retail Co", date: "Feb 20, 2026", amt: "—", status: "Active" },
                                                ].map((row, i) => (
                                                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                                                        <td className="px-6 py-4 font-mono text-xs text-gray-400 font-medium">{row.id}</td>
                                                        <td className="px-6 py-4 text-gray-700 font-medium">{row.desc}</td>
                                                        <td className="px-6 py-4 text-gray-400">{row.date}</td>
                                                        <td className="px-6 py-4 text-gray-800 font-semibold">{row.amt}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${row.status === "Completed" ? "bg-emerald-50 text-emerald-700" :
                                                                row.status === "Processing" ? "bg-amber-50 text-amber-700" :
                                                                    row.status === "Refunded" ? "bg-rose-50 text-rose-600" :
                                                                        "bg-sky-50 text-sky-600"
                                                                }`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${row.status === "Completed" ? "bg-emerald-500" :
                                                                    row.status === "Processing" ? "bg-amber-400" :
                                                                        row.status === "Refunded" ? "bg-rose-400" :
                                                                            "bg-sky-400"
                                                                    }`}></span>
                                                                {row.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Bottom spacer */}
                                <div className="h-8" />
                            </div>
                        }
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;