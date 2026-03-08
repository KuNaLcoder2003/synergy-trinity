import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import CreateOrderForm from "./CreateOrderForm";
import EditDocModal from "./EditDocs";

const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`

interface Material {
    container_number: string;
    gross_weight: number;
    net_weight: number;
    material_description: string;
    sales_bill_price: number;
    selling_price: number;
    gst_amount_sales_bill: number;
    purchase_price: number;
}

interface Doc {
    clearing_price: string;
    created_at: string;
    doc_name: string;
    doc_type: string;
    doc_url: string;
    gross_weight: number;
    net_weight: number;
    issued_by: string;
    total_value: string;
    _id: string;
}

interface PopulatedRef {
    _id: string;
    name: string;
}

interface Order {
    _id: string;
    bill_of_lading_number: string;
    cha: string;
    container_number: string;
    dilevery: string;
    customer_id: PopulatedRef;
    supplier_id: PopulatedRef;
    expected_to_arrive: string;
    loading_date: string;
    shipped_on_date: string;
    mill_payment_status: string;
    mill_payment: number;
    port_of_destination: string;
    port_of_loading: string;
    purchase_price: string;
    selling_price: string;
    shipping_line: string;
    country_of_origin_of_goods: string;
    materials: Material[];
    docs: Doc[];
    createdAt: string;
}


const XIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const ChevronDown: React.FC<{ open: boolean }> = ({ open }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        className="w-4 h-4 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const DocIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
);

const BoxIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

export const ExternalLinkIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
);



export const fmtDate = (d?: string): string => {
    if (!d) return "—";
    const dt = new Date(d);
    return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

type PaymentStatus = "Paid" | "Pending" | "Overdue";

const paymentBadge = (status?: string): React.ReactNode => {
    const colorMap: Record<PaymentStatus, string> = {
        Paid: "bg-emerald-50 text-emerald-700",
        Pending: "bg-amber-50 text-amber-700",
        Overdue: "bg-rose-50 text-rose-600",
    };
    const dotMap: Record<PaymentStatus, string> = {
        Paid: "bg-emerald-500",
        Pending: "bg-amber-400",
        Overdue: "bg-rose-400",
    };
    const s = status as PaymentStatus;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${colorMap[s] ?? "bg-gray-100 text-gray-500"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotMap[s] ?? "bg-gray-400"}`} />
            {status ?? "—"}
        </span>
    );
};



interface AccordionProps {
    icon: React.ReactNode;
    label: string;
    count: number;
    children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ icon, label, count, children }) => {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <div className="rounded-xl border border-gray-100 overflow-hidden">
            <button
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-emerald-50 transition-colors"
            >
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <span className="text-emerald-500">{icon}</span>
                    {label}
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">{count}</span>
                </div>
                <ChevronDown open={open} />
            </button>
            {open && <div className="divide-y divide-gray-50">{children}</div>}
        </div>
    );
};



const DocRow: React.FC<{ doc: Doc }> = ({ doc }) => (
    <div key={doc._id} className="px-4 py-4 bg-white">
        <div className="flex items-start justify-between gap-4 mb-3">
            <div>
                <p className="text-sm font-semibold text-gray-800">{doc.doc_name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Issued by: {doc.issued_by} · {fmtDate(doc.created_at)}</p>
            </div>
            <a
                href={doc.doc_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
            >
                <ExternalLinkIcon /> View Doc
            </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(
                [
                    ["Type", doc.doc_type],
                    ["Gross Wt.", doc.gross_weight ? `${doc.gross_weight} kg` : "—"],
                    ["Net Wt.", doc.net_weight ? `${doc.net_weight} kg` : "—"],
                    ["Total Value", doc.total_value ?? "—"],
                    ["Clearing Price", doc.clearing_price ?? "—"],
                ] as [string, string][]
            ).map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-400 mb-0.5">{k}</p>
                    <p className="text-xs font-semibold text-gray-700">{v}</p>
                </div>
            ))}
        </div>
    </div>
);



const MaterialRow: React.FC<{ mat: Material }> = ({ mat }) => (
    <div className="px-4 py-4 bg-white">
        <p className="text-sm font-semibold text-gray-800 mb-3">{mat.material_description}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(
                [
                    ["Container No.", mat.container_number],
                    ["Gross Wt.", `${mat.gross_weight} kg`],
                    ["Net Wt.", `${mat.net_weight} kg`],
                    ["Purchase Price", `₹${mat.purchase_price?.toLocaleString("en-IN")}`],
                    ["Sales Bill Price", `₹${mat.sales_bill_price?.toLocaleString("en-IN")}`],
                    ["Selling Price", `₹${mat.selling_price?.toLocaleString("en-IN")}`],
                    ["GST (Sales Bill)", `₹${mat.gst_amount_sales_bill?.toLocaleString("en-IN")}`],
                ] as [string, string][]
            ).map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-400 mb-0.5">{k}</p>
                    <p className="text-xs font-semibold text-gray-700">{v}</p>
                </div>
            ))}
        </div>
    </div>
);



interface FieldProps { label: string; value?: string | number | null; }

const Field: React.FC<FieldProps> = ({ label, value }) => (
    <div>
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value ?? "—"}</p>
    </div>
);



interface OrderModalProps {
    order: Order;
    onClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ order, onClose }) => (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
    >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">

            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">{order._id}</span>
                        {paymentBadge(order.mill_payment_status)}
                    </div>
                    <h2 className="text-base font-bold text-gray-900">{order.supplier_id?.name} → {order.customer_id?.name}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{order.shipping_line} · {order.port_of_loading} → {order.port_of_destination}</p>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center text-gray-500 transition-colors flex-shrink-0 ml-4"
                >
                    <XIcon />
                </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

                {/* Shipment Details */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Shipment Details</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 bg-gray-50 rounded-xl p-4">
                        <Field label="Bill of Lading" value={order.bill_of_lading_number} />
                        <Field label="Container No." value={order.container_number} />
                        <Field label="CHA" value={order.cha} />
                        <Field label="Shipping Line" value={order.shipping_line} />
                        <Field label="Country of Origin" value={order.country_of_origin_of_goods} />
                        <Field label="Delivery Type" value={order.dilevery} />
                        <Field label="Port of Loading" value={order.port_of_loading} />
                        <Field label="Port of Dest." value={order.port_of_destination} />
                        <Field label="Loading Date" value={fmtDate(order.loading_date)} />
                        <Field label="Shipped On" value={fmtDate(order.shipped_on_date)} />
                        <Field label="Expected Arrival" value={fmtDate(order.expected_to_arrive)} />
                        <Field label="Order Created" value={fmtDate(order.createdAt)} />
                    </div>
                </div>

                {/* Financials */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Financials</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {(
                            [
                                ["Purchase Price", order.purchase_price],
                                ["Selling Price", order.selling_price],
                                ["Mill Payment", `₹${order.mill_payment?.toLocaleString("en-IN")}`],
                                ["Payment Status", order.mill_payment_status],
                            ] as [string, string][]
                        ).map(([k, v]) => (
                            <div key={k} className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                                <p className="text-xs text-emerald-600 font-medium mb-1">{k}</p>
                                <p className="text-sm font-bold text-emerald-900">{v ?? "—"}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Materials */}
                <Accordion icon={<BoxIcon />} label="Materials" count={order.materials?.length ?? 0}>
                    {order.materials?.map((m, i) => <MaterialRow key={i} mat={m} />)}
                </Accordion>

                {/* Documents */}
                <Accordion icon={<DocIcon />} label="Documents" count={order.docs?.length ?? 0}>
                    {order.docs?.map((d, i) => <DocRow key={i} doc={d} />)}
                </Accordion>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end flex-shrink-0">
                <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-600 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
);


const Orders: React.FC = () => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [search, setSearch] = useState<string>("");
    const [showAdd, setShowAdd] = useState<boolean>(false);
    const [orders, setOrders] = useState<Order[]>([])
    const [filtered, setFiltered] = useState<Order[]>([])
    const [editDocs, setEditDocs] = useState<boolean>(false)

    useEffect(() => {
        try {
            fetch(`${BACKEND_URL}/order/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(async (res: Response) => {
                const data = await res.json()
                if (!data.valid) {
                    setOrders([])
                    setFiltered([])
                } else {
                    setOrders(data.orders)
                    setFiltered(data.orders)
                }
            })
        } catch (error) {
            setFiltered([])
            setOrders([])
        }

    }, [])

    const TABLE_HEADERS = ["Order ID", "Supplier", "Customer", "Materials", "Created On", "Shipping Line", "CHA", "Arrival Date", ""];

    return (
        <>
            <style>{`
        .orders-table th, .orders-table td { white-space: nowrap; }
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
        .modal-animate { animation: modal-in 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>

            <div className="space-y-5">

                {/* Toolbar */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">All Orders</h2>
                        <p className="text-xs text-gray-400 mt-0.5">{filtered.length} orders found</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowAdd(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white flex-shrink-0 transition-all hover:opacity-90 active:scale-95"
                            style={{
                                background: "linear-gradient(135deg, #10b981, #059669)",
                                boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
                            }}
                        >
                            <PlusIcon />
                            New Order
                        </button>
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2 w-56 shadow-sm">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 flex-shrink-0">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                className="bg-transparent text-sm text-gray-600 outline-none placeholder-gray-400 w-full"
                                placeholder="Search orders..."
                                value={search}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setSearch(e.target.value);
                                    setFiltered(orders.filter(o =>
                                        !search ||
                                        o._id.toLowerCase().includes(e.target.value.toLowerCase()) ||
                                        o.customer_id?.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                                        o.supplier_id?.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                                        o.shipping_line?.toLowerCase().includes(e.target.value.toLowerCase())
                                    ));
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm orders-table">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/70">
                                    {TABLE_HEADERS.map((h) => (
                                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-12 text-center text-sm text-gray-400">No orders match your search.</td>
                                    </tr>
                                ) : filtered.map((order) => (
                                    <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                                        <td className="px-5 py-4">
                                            <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md font-medium">{order._id}</span>
                                        </td>
                                        <td className="px-5 py-4 font-medium text-gray-800 max-w-[140px] truncate">{order.supplier_id?.name}</td>
                                        <td className="px-5 py-4 text-gray-600 max-w-[140px] truncate">{order.customer_id?.name}</td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-100">
                                                {order.materials?.length ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500 text-xs">{fmtDate(order.createdAt)}</td>
                                        <td className="px-5 py-4 text-gray-700">{order.shipping_line}</td>
                                        <td className="px-5 py-4 text-gray-500 text-xs max-w-[130px] truncate">{order.cha}</td>
                                        <td className="px-5 py-4 text-gray-500 text-xs">{fmtDate(order.expected_to_arrive)}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm shadow-emerald-200 transition-all hover:shadow-md hover:shadow-emerald-200 active:scale-95"
                                                >
                                                    View
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order)
                                                        setEditDocs(true)
                                                    }}
                                                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm shadow-emerald-200 transition-all hover:shadow-md hover:shadow-emerald-200 active:scale-95"
                                                >
                                                    Edit Docs
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {
                showAdd && (
                    <div className="absolute inset-0 top-0 bottom-0 left-0 right-0 bg-black/20">
                        <CreateOrderForm onClose={() => setShowAdd(false)} />
                    </div>
                )
            }

            {
                editDocs && selectedOrder && <div className="absolute inset-0 top-0 bottom-0 left-0 right-0 bg-black/20">
                    <EditDocModal docs={selectedOrder.docs} orderId={selectedOrder._id} onClose={() => {
                        setEditDocs(false)
                        setSelectedOrder(null)
                    }} />
                </div>
            }

            {/* Modal */}
            {selectedOrder && !editDocs && (
                <div className="modal-animate">
                    <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
                </div>
            )}
        </>
    );
};

export default Orders;