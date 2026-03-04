import { useState, useMemo, useEffect } from "react";
import AddCustomer from "./AddCustomer";
import { Loader } from "lucide-react";
const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`
type Customer = {
    id: string;
    company_name: string;
    name: string;
    mobile: string;
    // email?: string;
    bank_details: string;
    state: string;
    country: string;
    pincode: string;
};

type CustomerForm = Omit<Customer, "id">;
// const SEED_CUSTOMERS: Customer[] = [
//     { id: "CUS-0001", company_name: "Apex Traders Pvt Ltd", name: "Rohan Mehta", mobile: "+91 98201 34567", bank_details: "HDFC Bank · A/C 00112233445 · HDFC0001234", state: "Maharashtra", country: "India", pincode: "400001" },
//     { id: "CUS-0002", company_name: "Greenleaf Solutions", name: "Priya Sharma", mobile: "+91 70451 22310", bank_details: "ICICI Bank · A/C 55667788990 · ICIC0005566", state: "Karnataka", country: "India", pincode: "560001" },
//     { id: "CUS-0003", company_name: "BlueSky Enterprises", name: "Amit Verma", mobile: "+91 88001 56789", bank_details: "SBI · A/C 33445566778 · SBIN0003344", state: "Delhi", country: "India", pincode: "110001" },
//     { id: "CUS-0004", company_name: "Sunrise Retail Co.", name: "Neha Joshi", mobile: "+91 91234 87654", bank_details: "Axis Bank · A/C 99887766554 · UTIB0009988", state: "Rajasthan", country: "India", pincode: "302001" },
//     { id: "CUS-0005", company_name: "Horizon Imports", name: "Karan Patel", mobile: "+91 63001 44321", bank_details: "Kotak Bank · A/C 11223344556 · KKBK0001122", state: "Gujarat", country: "India", pincode: "380001" },
//     { id: "CUS-0006", company_name: "NovaTech Systems", name: "Sanya Kapoor", mobile: "+91 77889 11234", bank_details: "Yes Bank · A/C 66778899001 · YESB0006677", state: "Telangana", country: "India", pincode: "500001" },
//     { id: "CUS-0007", company_name: "PureEarth Organics", name: "Dev Nair", mobile: "+91 94500 32100", bank_details: "Federal Bank · A/C 44556677889 · FDRL0004455", state: "Kerala", country: "India", pincode: "682001" },
//     { id: "CUS-0008", company_name: "Zenith Distributors", name: "Ananya Roy", mobile: "+91 82340 98765", bank_details: "PNB · A/C 22334455667 · PUNB0002233", state: "West Bengal", country: "India", pincode: "700001" },
// ];
const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const EyeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);
const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);
const ChevronUpDown = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <polyline points="18 15 12 9 6 15" /><polyline points="6 21 12 27 18 21" />
    </svg>
);

// ── Avatar Initials ───────────────────────────────────────────────────────────
const AVATAR_COLORS = [
    ["#d1fae5", "#065f46"], ["#e0f2fe", "#0c4a6e"], ["#fce7f3", "#831843"],
    ["#fef3c7", "#78350f"], ["#ede9fe", "#4c1d95"], ["#fee2e2", "#7f1d1d"],
    ["#f0fdf4", "#14532d"], ["#fff7ed", "#7c2d12"],
];
function Avatar({ name, index }: { name: string; index: number }) {
    const [bg, fg] = AVATAR_COLORS[index % AVATAR_COLORS.length];
    const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    return (
        <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: bg, color: fg }}
        >
            {initials}
        </div>
    );
}

// ── Detail Row ────────────────────────────────────────────────────────────────
function DetailRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
            <span className="mt-0.5 text-emerald-400 flex-shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-gray-800 break-all">{value}</p>
            </div>
        </div>
    );
}

// ── Detail Drawer ─────────────────────────────────────────────────────────────
function CustomerDetailDrawer({ customer, index, onClose }: { customer: Customer; index: number; onClose: () => void }) {
    return (
        <>
            <style>{`
        @keyframes drawerIn {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .detail-drawer { animation: drawerIn 0.3s cubic-bezier(0.32, 0.72, 0, 1) both; }
        .drawer-overlay { animation: overlayFadeIn 0.2s ease both; }
      `}</style>
            <div
                className="drawer-overlay fixed inset-0 z-40"
                style={{ backgroundColor: "rgba(0,0,0,0.2)", backdropFilter: "blur(4px)" }}
                onClick={onClose}
            />
            <aside
                className="detail-drawer fixed right-0 top-0 h-full z-50 bg-white flex flex-col"
                style={{ width: 380, boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" }}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <Avatar name={customer.name} index={index} />
                        <div>
                            <p className="font-bold text-gray-900 text-sm leading-tight">{customer.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{customer.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Company badge */}
                <div className="mx-6 mt-4 mb-2 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <p className="text-sm font-bold text-emerald-800">{customer.company_name}</p>
                </div>

                {/* Scrollable details */}
                <div className="flex-1 overflow-y-auto px-6 py-2">
                    <DetailRow label="Mobile" value={customer.mobile} icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 5a2 2 0 0 1 1.53-2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                    } />
                    <DetailRow label="Bank Details" value={customer.bank_details} icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <line x1="2" y1="10" x2="22" y2="10" /><line x1="12" y1="2" x2="22" y2="10" /><line x1="2" y1="10" x2="12" y2="2" />
                            <rect x="2" y="10" width="20" height="11" rx="1" /><line x1="6" y1="14" x2="6" y2="17" /><line x1="12" y1="14" x2="12" y2="17" /><line x1="18" y1="14" x2="18" y2="17" />
                        </svg>
                    } />
                    <DetailRow label="State" value={customer.state} icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                    } />
                    <DetailRow label="Country" value={customer.country} icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                    } />
                    <DetailRow label="Pincode" value={customer.pincode} icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
                        </svg>
                    } />
                </div>

                {/* Footer actions */}
                <div className="px-6 py-5 border-t border-gray-100 flex gap-3">
                    <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                        Edit
                    </button>
                    <button className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                        style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 4px 14px rgba(16,185,129,0.3)" }}>
                        New Order
                    </button>
                </div>
            </aside>
        </>
    );
}

// ── Table Column Header ───────────────────────────────────────────────────────
function ColHeader({ label, sortable = false }: { label: string; sortable?: boolean }) {
    return (
        <th className="px-5 py-3.5 text-left">
            <div className="flex items-center gap-1.5 group cursor-pointer select-none">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-gray-600 transition-colors">{label}</span>
                {sortable && <span className="text-gray-300 group-hover:text-gray-400 transition-colors"><ChevronUpDown /></span>}
            </div>
        </th>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CustomerList() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<{ customer: Customer; index: number } | null>(null);
    const [newlyAdded, setNewlyAdded] = useState<string | null>(null);
    const [stateFilter, setStateFilter] = useState("All");
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        try {
            fetch(`${BACKEND_URL}/customer/customers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(async (res: Response) => {
                const data = await res.json()
                if (!data.valid) {
                    setCustomers([])
                    setLoading(false)
                } else {
                    setCustomers(data.customers)
                    setLoading(false)
                }
            })
        } catch (error) {
            setLoading(false)
            setCustomers([])
        }
    }, [])

    const states = useMemo(() => {
        const all = ["All", ...Array.from(new Set(customers.map((c) => c.state))).sort()];
        return all;
    }, [customers]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return customers.filter((c) => {
            const matchSearch =
                !q ||
                c.name.toLowerCase().includes(q) ||
                c.company_name.toLowerCase().includes(q) ||
                c.mobile.includes(q) ||
                c.state.toLowerCase().includes(q) ||
                c.pincode.includes(q);
            const matchState = stateFilter === "All" || c.state === stateFilter;
            return matchSearch && matchState;
        });
    }, [customers, search, stateFilter]);

    const handleAddCustomer = (data: CustomerForm) => {
        const id = `CUS-${String(customers.length + 1).padStart(4, "0")}`;
        const newCustomer: Customer = { id, ...data };
        setCustomers((prev) => [newCustomer, ...prev]);
        setNewlyAdded(id);
        setTimeout(() => setNewlyAdded(null), 3000);
    };

    return (
        <>
            {
                loading ? <div className="w-full h-full flex items-center justify-center">
                    <Loader />
                </div> : <>
                    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        @keyframes rowSlideIn {
          from { opacity: 0; transform: translateY(-8px); background: #d1fae5; }
          to   { opacity: 1; transform: translateY(0);    background: transparent; }
        }
        .row-new { animation: rowSlideIn 0.5s ease both; }
        .row-hover:hover { background: #f9fafb; }
        .view-btn { transition: all 0.18s ease; }
        .view-btn:hover { background: #10b981; color: white; border-color: #10b981; transform: scale(1.04); box-shadow: 0 4px 12px rgba(16,185,129,0.3); }
        .filter-pill { transition: all 0.18s ease; }
        .search-wrap:focus-within { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1fae5; border-radius: 99px; }
      `}</style>

                    <div style={{ fontFamily: "'Inter', sans-serif" }} className="flex flex-col h-full bg-gray-50">

                        {/* ── Top bar ──────────────────────────────────────────────────────── */}
                        <div className="bg-white border-b border-gray-100 px-6 py-4 flex-shrink-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                {/* Title */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-gray-900 leading-tight">Customers</h2>
                                            <p className="text-xs text-gray-400">{customers.length} total · {filtered.length} shown</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Search */}
                                <div
                                    className="search-wrap flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 transition-all"
                                    style={{ minWidth: 240 }}
                                >
                                    <span className="text-gray-400"><SearchIcon /></span>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search name, company, state…"
                                        className="bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400 w-full font-medium"
                                        style={{ caretColor: "#10b981" }}
                                    />
                                    {search && (
                                        <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500 transition-colors">
                                            <CloseIcon />
                                        </button>
                                    )}
                                </div>

                                {/* Add button */}
                                <button
                                    onClick={() => setShowAdd(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white flex-shrink-0 transition-all hover:opacity-90 active:scale-95"
                                    style={{
                                        background: "linear-gradient(135deg, #10b981, #059669)",
                                        boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
                                    }}
                                >
                                    <PlusIcon />
                                    Add Customer
                                </button>
                            </div>

                            {/* State filter pills */}
                            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-0.5">
                                <span className="text-xs font-semibold text-gray-400 flex-shrink-0">Filter:</span>
                                {states.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setStateFilter(s)}
                                        className="filter-pill flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all"
                                        style={
                                            stateFilter === s
                                                ? { background: "#10b981", color: "#fff", borderColor: "#10b981", boxShadow: "0 2px 8px rgba(16,185,129,0.3)" }
                                                : { background: "#fff", color: "#6b7280", borderColor: "#e5e7eb" }
                                        }
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── Table ────────────────────────────────────────────────────────── */}
                        <div className="flex-1 overflow-auto">
                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 gap-3">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="23" y1="11" x2="17" y2="11" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-400">No customers match your search</p>
                                    <button onClick={() => { setSearch(""); setStateFilter("All"); }} className="text-xs text-emerald-500 font-semibold hover:underline">
                                        Clear filters
                                    </button>
                                </div>
                            ) : (
                                <table className="w-full border-collapse" style={{ minWidth: 760 }}>
                                    <thead className="sticky top-0 bg-white border-b border-gray-100 z-10">
                                        <tr>
                                            <ColHeader label="Customer" />
                                            <ColHeader label="Mobile" sortable />
                                            <ColHeader label="State" sortable />
                                            <ColHeader label="Company" sortable />
                                            <ColHeader label="Pincode" />
                                            <th className="px-5 py-3.5 text-left w-28">
                                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Details</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((customer, i) => {
                                            const isNew = customer.id === newlyAdded;
                                            return (
                                                <tr
                                                    key={customer.id}
                                                    className={`row-hover border-b border-gray-50 transition-colors cursor-default ${isNew ? "row-new" : ""}`}
                                                    style={{ animationDelay: `${i * 30}ms` }}
                                                >
                                                    {/* Name + ID */}
                                                    <td className="px-5 py-3.5">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar name={customer.name} index={i} />
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-800 leading-tight">{customer.name}</p>
                                                                <p className="text-xs text-gray-400 font-medium mt-0.5 font-mono">{customer.id}</p>
                                                            </div>
                                                            {isNew && (
                                                                <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">New</span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Mobile */}
                                                    <td className="px-5 py-3.5">
                                                        <p className="text-sm text-gray-700 font-medium tabular-nums">{customer.mobile}</p>
                                                    </td>

                                                    {/* State */}
                                                    <td className="px-5 py-3.5">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-600">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                                            {customer.state}
                                                        </span>
                                                    </td>

                                                    {/* Company */}
                                                    <td className="px-5 py-3.5">
                                                        <p className="text-sm text-gray-700 font-semibold max-w-[180px] truncate" title={customer.company_name}>
                                                            {customer.company_name}
                                                        </p>
                                                    </td>

                                                    {/* Pincode */}
                                                    <td className="px-5 py-3.5">
                                                        <p className="text-sm text-gray-500 font-mono font-medium">{customer.pincode}</p>
                                                    </td>

                                                    {/* View button */}
                                                    <td className="px-5 py-3.5">
                                                        <button
                                                            onClick={() => setSelectedCustomer({ customer, index: i })}
                                                            className="view-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-500"
                                                        >
                                                            <EyeIcon />
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* ── Footer ───────────────────────────────────────────────────────── */}
                        <div className="bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
                            <p className="text-xs text-gray-400">
                                Showing <span className="font-bold text-gray-600">{filtered.length}</span> of <span className="font-bold text-gray-600">{customers.length}</span> customers
                            </p>
                            <div className="flex items-center gap-1">
                                {[...Array(Math.ceil(filtered.length / 10))].map((_, i) => (
                                    <button
                                        key={i}
                                        className="w-7 h-7 rounded-lg text-xs font-bold transition-all"
                                        style={i === 0
                                            ? { background: "#10b981", color: "#fff", boxShadow: "0 2px 8px rgba(16,185,129,0.3)" }
                                            : { color: "#6b7280" }}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Add Customer Modal ────────────────────────────────────────────── */}
                    {showAdd && (
                        <AddCustomer
                            onClose={() => setShowAdd(false)}
                            onSubmit={(data: any) => {
                                handleAddCustomer(data);
                                setShowAdd(false);
                            }}
                        />
                    )}

                    {/* ── Detail Drawer ────────────────────────────────────────────────── */}
                    {selectedCustomer && (
                        <CustomerDetailDrawer
                            customer={selectedCustomer.customer}
                            index={selectedCustomer.index}
                            onClose={() => setSelectedCustomer(null)}
                        />
                    )}
                </>
            }
        </>
    );
}