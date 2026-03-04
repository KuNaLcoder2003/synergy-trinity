import { useState, useMemo, useEffect } from "react";
import AddSupplier from "./AddSupplier";
import { Loader } from "lucide-react";

const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`
type Supplier = {
    id: string;
    company_name: string;
    name: string;
    mobile: string;
    // email: string;
    bank_details: string;
    country: string;
    pincode: string;
};

type SupplierForm = Omit<Supplier, "id">;

// ── Mock Seed Data ────────────────────────────────────────────────────────────
// const SEED_SUPPLIERS: Supplier[] = [
//     { id: "SUP-0001", company_name: "GreenTech Pvt Ltd", name: "Vikram Singh", mobile: "+91 98101 23456", email: "vikram@greentech.in", bank_details: "HDFC Bank · A/C 10293847560 · HDFC0004321", country: "India", pincode: "110001" },
//     { id: "SUP-0002", company_name: "Apex Raw Materials", name: "Sunita Rao", mobile: "+91 70012 33445", email: "sunita@apexraw.co", bank_details: "ICICI Bank · A/C 56473829100 · ICIC0007788", country: "India", pincode: "560029" },
//     { id: "SUP-0003", company_name: "PrimePack Industries", name: "Ramesh Gupta", mobile: "+91 88900 11223", email: "ramesh@primepack.biz", bank_details: "SBI · A/C 39201847560 · SBIN0009876", country: "India", pincode: "400072" },
//     { id: "SUP-0004", company_name: "EuroGoods GmbH", name: "Klaus Weber", mobile: "+49 160 9123456", email: "k.weber@eurogoods.de", bank_details: "Deutsche Bank · A/C DE8937040044053201300 · DEUTDEDB", country: "Germany", pincode: "10115" },
//     { id: "SUP-0005", company_name: "FastLogix Carriers", name: "Anil Bose", mobile: "+91 63001 99887", email: "anil@fastlogix.in", bank_details: "Axis Bank · A/C 77665544330 · UTIB0001234", country: "India", pincode: "700001" },
//     { id: "SUP-0006", company_name: "Pacific Trade Co.", name: "Li Wei", mobile: "+86 138 0013 8000", email: "liwei@pacifictrade.cn", bank_details: "Bank of China · A/C 6222001234567890 · BKCHCNBJ", country: "China", pincode: "100001" },
//     { id: "SUP-0007", company_name: "NatureFarm Organics", name: "Deepa Menon", mobile: "+91 94500 77821", email: "deepa@naturefarm.org", bank_details: "Federal Bank · A/C 12345678901 · FDRL0001122", country: "India", pincode: "682001" },
//     { id: "SUP-0008", company_name: "Sterling Alloys Ltd", name: "James Thornton", mobile: "+44 7911 123456", email: "j.thornton@sterling.uk", bank_details: "Barclays · A/C 12345678 · Sort 20-00-00", country: "UK", pincode: "EC1A 1BB" },
//     { id: "SUP-0009", company_name: "Horizon Chemical Corp", name: "Siddharth Jha", mobile: "+91 82200 43211", email: "sid@horizonchem.com", bank_details: "Kotak Bank · A/C 98877665544 · KKBK0005566", country: "India", pincode: "380015" },
//     { id: "SUP-0010", company_name: "BrightStar Electronics", name: "Min-jun Lee", mobile: "+82 10-9876-5432", email: "lee@brightstar.kr", bank_details: "KB Kookmin · A/C 123-45-6789012 · CZNBKRSE", country: "South Korea", pincode: "03187" },
// ];

// ── Icons ─────────────────────────────────────────────────────────────────────
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
        <polyline points="18 15 12 9 6 15" />
    </svg>
);
const TruckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);

// ── Avatar ────────────────────────────────────────────────────────────────────
const AVATAR_PALETTES = [
    ["#d1fae5", "#065f46"], ["#dbeafe", "#1e3a8a"], ["#fce7f3", "#831843"],
    ["#fef3c7", "#78350f"], ["#ede9fe", "#4c1d95"], ["#fee2e2", "#7f1d1d"],
    ["#ecfdf5", "#14532d"], ["#fff7ed", "#7c2d12"], ["#f0f9ff", "#075985"],
    ["#fdf2f8", "#701a75"],
];
function Avatar({ name, index }: { name: string; index: number }) {
    const [bg, fg] = AVATAR_PALETTES[index % AVATAR_PALETTES.length];
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

// ── Country Flag (simple text fallback) ───────────────────────────────────────
const COUNTRY_FLAGS: Record<string, string> = {
    India: "🇮🇳", Germany: "🇩🇪", China: "🇨🇳", UK: "🇬🇧", "South Korea": "🇰🇷",
};

// ── Detail Row ────────────────────────────────────────────────────────────────
function DetailRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 py-3.5 border-b border-gray-50 last:border-0">
            <span className="mt-0.5 text-emerald-400 flex-shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-gray-800 break-all">{value}</p>
            </div>
        </div>
    );
}

// ── Detail Drawer ─────────────────────────────────────────────────────────────
function SupplierDetailDrawer({
    supplier, index, onClose,
}: {
    supplier: Supplier; index: number; onClose: () => void;
}) {
    return (
        <>
            <style>{`
        @keyframes drawerSlide {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .sup-drawer  { animation: drawerSlide 0.3s cubic-bezier(0.32,0.72,0,1) both; }
        .sup-overlay { animation: overlayFadeIn 0.2s ease both; }
      `}</style>

            <div
                className="sup-overlay fixed inset-0 z-40"
                style={{ backgroundColor: "rgba(0,0,0,0.2)", backdropFilter: "blur(4px)" }}
                onClick={onClose}
            />

            <aside
                className="sup-drawer fixed right-0 top-0 h-full z-50 bg-white flex flex-col"
                style={{ width: 380, boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <Avatar name={supplier.name} index={index} />
                        <div>
                            <p className="font-bold text-gray-900 text-sm leading-tight">{supplier.name}</p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">{supplier.id}</p>
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
                <div className="mx-6 mt-4 mb-1 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <TruckIcon />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-emerald-900 leading-tight">{supplier.company_name}</p>
                        <p className="text-xs text-emerald-500 font-medium mt-0.5">
                            {COUNTRY_FLAGS[supplier.country] ?? "🌐"} {supplier.country}
                        </p>
                    </div>
                </div>

                {/* Details */}
                <div className="flex-1 overflow-y-auto px-6 py-2">
                    <DetailRow label="Mobile" value={supplier.mobile} icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 5a2 2 0 0 1 1.53-2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                    } />
                    <DetailRow label="Bank Details" value={supplier.bank_details} icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <line x1="2" y1="10" x2="22" y2="10" /><line x1="12" y1="2" x2="22" y2="10" /><line x1="2" y1="10" x2="12" y2="2" />
                            <rect x="2" y="10" width="20" height="11" rx="1" /><line x1="6" y1="14" x2="6" y2="17" /><line x1="12" y1="14" x2="12" y2="17" /><line x1="18" y1="14" x2="18" y2="17" />
                        </svg>
                    } />
                    <DetailRow label="Country" value={`${COUNTRY_FLAGS[supplier.country] ?? "🌐"} ${supplier.country}`} icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                    } />
                    <DetailRow label="Pincode" value={supplier.pincode} icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
                        </svg>
                    } />
                </div>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-gray-100 flex gap-3">
                    <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                        Edit
                    </button>
                    <button
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 4px 14px rgba(16,185,129,0.3)" }}
                    >
                        New PO
                    </button>
                </div>
            </aside>
        </>
    );
}

// ── Column Header ─────────────────────────────────────────────────────────────
function ColHeader({ label, sortable = false }: { label: string; sortable?: boolean }) {
    return (
        <th className="px-5 py-3.5 text-left">
            <div className="flex items-center gap-1 group cursor-pointer select-none">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-gray-600 transition-colors">{label}</span>
                {sortable && <span className="text-gray-300 group-hover:text-gray-400 transition-colors"><ChevronUpDown /></span>}
            </div>
        </th>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SupplierList() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [search, setSearch] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [selected, setSelected] = useState<{ supplier: Supplier; index: number } | null>(null);
    const [newlyAdded, setNewlyAdded] = useState<string | null>(null);
    const [countryFilter, setCountryFilter] = useState("All");
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        try {
            fetch(`${BACKEND_URL}/supplier/suppliers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(async (res: Response) => {
                const data = await res.json()
                if (!data.valid) {
                    setSuppliers([])
                    setLoading(false)
                } else {
                    setSuppliers(data.suppliers)
                    setLoading(false)
                }
            })
        } catch (error) {
            setLoading(false)
            setSuppliers([])
        }
    }, [])

    const countries = useMemo(() => {
        return ["All", ...Array.from(new Set(suppliers.map((s) => s.country))).sort()];
    }, [suppliers]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return suppliers.filter((s) => {
            const matchSearch =
                !q ||
                s.name.toLowerCase().includes(q) ||
                s.company_name.toLowerCase().includes(q) ||
                s.mobile.includes(q) ||
                s.country.toLowerCase().includes(q) ||
                s.pincode.includes(q);
            const matchCountry = countryFilter === "All" || s.country === countryFilter;
            return matchSearch && matchCountry;
        });
    }, [suppliers, search, countryFilter]);

    const handleAddSupplier = (data: SupplierForm) => {
        const id = `SUP-${String(suppliers.length + 1).padStart(4, "0")}`;
        const newSupplier: Supplier = { id, ...data };
        setSuppliers((prev) => [newSupplier, ...prev]);
        setNewlyAdded(id);
        setTimeout(() => setNewlyAdded(null), 3000);
    };

    return (
        <>
            {
                loading && suppliers.length == 0 ? <div className="w-full h-full flex justify-center items-center">
                    <Loader />
                </div> : <>
                    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        @keyframes rowSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .row-new   { animation: rowSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        .row-base  { transition: background 0.15s ease; }
        .row-base:hover { background: #f9fafb; }
        .view-btn  { transition: all 0.18s ease; }
        .view-btn:hover {
          background: #10b981; color: white; border-color: #10b981;
          transform: scale(1.04); box-shadow: 0 4px 12px rgba(16,185,129,0.3);
        }
        .pill-filter { transition: all 0.18s ease; }
        .search-box:focus-within {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
        }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1fae5; border-radius: 99px; }
      `}</style>

                    <div style={{ fontFamily: "'Inter', sans-serif" }} className="flex flex-col h-full bg-gray-50">

                        {/* ── Top bar ───────────────────────────────────────────────────── */}
                        <div className="bg-white border-b border-gray-100 px-6 py-4 flex-shrink-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                                {/* Title */}
                                <div className="flex-1 flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <TruckIcon />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-gray-900 leading-tight">Suppliers</h2>
                                        <p className="text-xs text-gray-400">{suppliers.length} total · {filtered.length} shown</p>
                                    </div>
                                </div>

                                {/* Search */}
                                <div
                                    className="search-box flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 transition-all"
                                    style={{ minWidth: 240 }}
                                >
                                    <span className="text-gray-400"><SearchIcon /></span>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search name, company, country…"
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
                                    Add Supplier
                                </button>
                            </div>

                            {/* Country filter pills */}
                            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-0.5">
                                <span className="text-xs font-semibold text-gray-400 flex-shrink-0">Country:</span>
                                {countries.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setCountryFilter(c)}
                                        className="pill-filter flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border"
                                        style={
                                            countryFilter === c
                                                ? { background: "#10b981", color: "#fff", borderColor: "#10b981", boxShadow: "0 2px 8px rgba(16,185,129,0.3)" }
                                                : { background: "#fff", color: "#6b7280", borderColor: "#e5e7eb" }
                                        }
                                    >
                                        {c !== "All" && (COUNTRY_FLAGS[c] ?? "🌐")} {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── Table ─────────────────────────────────────────────────────── */}
                        <div className="flex-1 overflow-auto">
                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 gap-3">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                                            <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" />
                                            <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-400">No suppliers match your search</p>
                                    <button
                                        onClick={() => { setSearch(""); setCountryFilter("All"); }}
                                        className="text-xs text-emerald-500 font-semibold hover:underline"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            ) : (
                                <table className="w-full border-collapse" style={{ minWidth: 740 }}>
                                    <thead className="sticky top-0 bg-white border-b border-gray-100 z-10">
                                        <tr>
                                            <ColHeader label="Supplier" />
                                            <ColHeader label="Mobile" sortable />
                                            <ColHeader label="Company" sortable />
                                            <ColHeader label="Country" sortable />
                                            <ColHeader label="Pincode" />
                                            <th className="px-5 py-3.5 text-left w-28">
                                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Details</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((supplier, i) => {
                                            const isNew = supplier.id === newlyAdded;
                                            return (
                                                <tr
                                                    key={supplier.id}
                                                    className={`row-base border-b border-gray-50 ${isNew ? "row-new" : ""}`}
                                                >
                                                    {/* Name + ID */}
                                                    <td className="px-5 py-3.5">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar name={supplier.name} index={i} />
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-sm font-bold text-gray-800 leading-tight">{supplier.name}</p>
                                                                    {isNew && (
                                                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">New</span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-gray-400 font-mono mt-0.5">{supplier.id}</p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Mobile */}
                                                    <td className="px-5 py-3.5">
                                                        <p className="text-sm text-gray-700 font-medium tabular-nums">{supplier.mobile}</p>
                                                    </td>

                                                    {/* Company */}
                                                    <td className="px-5 py-3.5">
                                                        <p className="text-sm text-gray-700 font-semibold max-w-[180px] truncate" title={supplier.company_name}>
                                                            {supplier.company_name}
                                                        </p>
                                                    </td>

                                                    {/* Country */}
                                                    <td className="px-5 py-3.5">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-600 whitespace-nowrap">
                                                            {COUNTRY_FLAGS[supplier.country] ?? "🌐"} {supplier.country}
                                                        </span>
                                                    </td>

                                                    {/* Pincode */}
                                                    <td className="px-5 py-3.5">
                                                        <p className="text-sm text-gray-500 font-mono font-medium">{supplier.pincode}</p>
                                                    </td>

                                                    {/* View */}
                                                    <td className="px-5 py-3.5">
                                                        <button
                                                            onClick={() => setSelected({ supplier, index: i })}
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

                        {/* ── Footer ────────────────────────────────────────────────────── */}
                        <div className="bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
                            <p className="text-xs text-gray-400">
                                Showing <span className="font-bold text-gray-600">{filtered.length}</span> of{" "}
                                <span className="font-bold text-gray-600">{suppliers.length}</span> suppliers
                            </p>
                            <div className="flex items-center gap-1">
                                {[...Array(Math.max(1, Math.ceil(filtered.length / 10)))].map((_, i) => (
                                    <button
                                        key={i}
                                        className="w-7 h-7 rounded-lg text-xs font-bold transition-all"
                                        style={
                                            i === 0
                                                ? { background: "#10b981", color: "#fff", boxShadow: "0 2px 8px rgba(16,185,129,0.3)" }
                                                : { color: "#6b7280" }
                                        }
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Add Supplier Modal ─────────────────────────────────────────── */}
                    {showAdd && (
                        <AddSupplier
                            onClose={() => setShowAdd(false)}
                            onSubmit={(data) => {
                                handleAddSupplier(data);
                                setShowAdd(false);
                            }}
                        />
                    )}

                    {/* ── Detail Drawer ──────────────────────────────────────────────── */}
                    {selected && (
                        <SupplierDetailDrawer
                            supplier={selected.supplier}
                            index={selected.index}
                            onClose={() => setSelected(null)}
                        />
                    )}
                </>
            }
        </>
    );
}