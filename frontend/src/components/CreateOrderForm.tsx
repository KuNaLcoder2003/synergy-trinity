import React, { useState, useRef, useEffect } from "react";
import { type Material, type Docs, type Orders, type Suppliers, type Customers } from "../types"; // adjust path

const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`;

/* ══════════════════════════════════════════
   LOCAL FORM TYPES
══════════════════════════════════════════ */

type OrderFormData = Omit<Orders, "id" | "docs" | "materials"> & {
    materials: Material[];
};

type DocEntry = Omit<Docs, "doc_url"> & {
    file: File | null;
};



const defaultMaterial = (): Material => ({
    container_number: "",
    gross_weight: 0,
    net_weight: 0,
    material_description: "",
    sales_bill_price: 0,
    selling_price: 0,
    gst_amount_sales_bill: 0,
    purchase_price: 0,
});

const defaultDoc = (): DocEntry => ({
    doc_name: "",
    doc_type: "",
    file: null,
    issued_by: "",
    gross_weight: 0,
    net_weight: 0,
    total_value: "",
    clearing_price: "",
    created_at: "",
});

const defaultOrder = (): OrderFormData => ({
    bill_of_lading_number: "",
    cha: "",
    container_number: "",
    customer_id: "",
    dilevery: "",
    supplier_id: "",
    expected_to_arrive: "",
    loading_date: "",
    mill_payment_status: "",
    mill_payment: 0,
    port_of_destination: "",
    port_of_loading: "",
    purchase_price: "",
    selling_price: "",
    shipped_on_date: "",
    shipping_line: "",
    country_of_origin_of_goods: "",
    materials: [defaultMaterial()],
});

/* ══════════════════════════════════════════
   ICONS
══════════════════════════════════════════ */

const XIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const PlusIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const TrashIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
);

const UploadIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const CheckCircle: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const DocIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);

/* ══════════════════════════════════════════
   REUSABLE FIELD COMPONENTS
══════════════════════════════════════════ */

interface LabeledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    required?: boolean;
}

const LabeledInput: React.FC<LabeledInputProps> = ({ label, required, className, ...rest }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
        </label>
        <input
            {...rest}
            className={`w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all ${className ?? ""}`}
        />
    </div>
);

interface LabeledSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    required?: boolean;
    options: { label: string; value: string }[];
}

const LabeledSelect: React.FC<LabeledSelectProps> = ({ label, required, options, className, ...rest }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
        </label>
        <select
            {...rest}
            className={`w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all appearance-none ${className ?? ""}`}
        >
            <option value="">Select…</option>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    </div>
);

/* ══════════════════════════════════════════
   SECTION HEADER
══════════════════════════════════════════ */

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
    <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-emerald-500 rounded-full flex-shrink-0" />
        <div>
            <h3 className="text-sm font-bold text-gray-800">{title}</h3>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
    </div>
);

/* ══════════════════════════════════════════
   MATERIAL CARD
══════════════════════════════════════════ */

interface MaterialCardProps {
    index: number;
    mat: Material;
    onChange: (index: number, field: keyof Material, value: string | number) => void;
    onRemove: (index: number) => void;
    canRemove: boolean;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ index, mat, onChange, onRemove, canRemove }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                Material #{index + 1}
            </span>
            {canRemove && (
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-colors"
                >
                    <TrashIcon /> Remove
                </button>
            )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <LabeledInput label="Material Description" required placeholder="e.g. Cold Rolled Steel Coils"
                value={mat.material_description} onChange={e => onChange(index, "material_description", e.target.value)} />
            <LabeledInput label="Container Number" placeholder="e.g. MSCU7823401-A"
                value={mat.container_number} onChange={e => onChange(index, "container_number", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <LabeledInput label="Gross Weight (kg)" type="number" min={0} placeholder="0"
                value={mat.gross_weight || ""} onChange={e => onChange(index, "gross_weight", parseFloat(e.target.value) || 0)} />
            <LabeledInput label="Net Weight (kg)" type="number" min={0} placeholder="0"
                value={mat.net_weight || ""} onChange={e => onChange(index, "net_weight", parseFloat(e.target.value) || 0)} />
            <LabeledInput label="Purchase Price (₹)" type="number" min={0} placeholder="0"
                value={mat.purchase_price || ""} onChange={e => onChange(index, "purchase_price", parseFloat(e.target.value) || 0)} />
            <LabeledInput label="Selling Price (₹)" type="number" min={0} placeholder="0"
                value={mat.selling_price || ""} onChange={e => onChange(index, "selling_price", parseFloat(e.target.value) || 0)} />
            <LabeledInput label="Sales Bill Price (₹)" type="number" min={0} placeholder="0"
                value={mat.sales_bill_price || ""} onChange={e => onChange(index, "sales_bill_price", parseFloat(e.target.value) || 0)} />
            <LabeledInput label="GST Amount (₹)" type="number" min={0} placeholder="0"
                value={mat.gst_amount_sales_bill || ""} onChange={e => onChange(index, "gst_amount_sales_bill", parseFloat(e.target.value) || 0)} />
        </div>
    </div>
);

/* ══════════════════════════════════════════
   DOC CARD
══════════════════════════════════════════ */

interface DocCardProps {
    index: number;
    doc: DocEntry;
    onChange: (index: number, field: keyof DocEntry, value: string | number | File | null) => void;
    onRemove: (index: number) => void;
    canRemove: boolean;
}

const DocCard: React.FC<DocCardProps> = ({ index, doc, onChange, onRemove, canRemove }) => {
    const fileRef = useRef<HTMLInputElement>(null);
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-600 bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <DocIcon /> Document #{index + 1}
                </span>
                {canRemove && (
                    <button type="button" onClick={() => onRemove(index)}
                        className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-colors">
                        <TrashIcon /> Remove
                    </button>
                )}
            </div>

            {/* File Upload Zone */}
            <div
                onClick={() => fileRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-4 cursor-pointer transition-all ${doc.file ? "border-emerald-300 bg-emerald-50" : "border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/40"
                    }`}
            >
                <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={e => onChange(index, "file", e.target.files?.[0] ?? null)} />
                {doc.file ? (
                    <div className="text-center">
                        <p className="text-xs font-bold text-emerald-700">{doc.file.name}</p>
                        <p className="text-xs text-emerald-500 mt-0.5">{(doc.file.size / 1024).toFixed(1)} KB · Click to replace</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                        <UploadIcon />
                        <div>
                            <p className="text-xs font-semibold text-gray-600">Click to upload</p>
                            <p className="text-xs text-gray-400">PDF, JPG, PNG supported</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <LabeledInput label="Document Name" required placeholder="e.g. Bill of Lading"
                    value={doc.doc_name} onChange={e => onChange(index, "doc_name", e.target.value)} />
                <LabeledSelect label="Document Type" required value={doc.doc_type}
                    onChange={e => onChange(index, "doc_type", e.target.value)}
                    options={[
                        { label: "PDF", value: "PDF" }, { label: "Image", value: "Image" },
                        { label: "Excel", value: "Excel" }, { label: "Word", value: "Word" }, { label: "Other", value: "Other" },
                    ]} />
                <LabeledInput label="Issued By" placeholder="e.g. MSC Shipping"
                    value={doc.issued_by} onChange={e => onChange(index, "issued_by", e.target.value)} />
                <LabeledInput label="Issued Date" type="date"
                    value={doc.created_at} onChange={e => onChange(index, "created_at", e.target.value)} />
                <LabeledInput label="Gross Weight (kg)" type="number" min={0} placeholder="0"
                    value={doc.gross_weight || ""} onChange={e => onChange(index, "gross_weight", parseFloat(e.target.value) || 0)} />
                <LabeledInput label="Net Weight (kg)" type="number" min={0} placeholder="0"
                    value={doc.net_weight || ""} onChange={e => onChange(index, "net_weight", parseFloat(e.target.value) || 0)} />
                <LabeledInput label="Total Value" placeholder="e.g. ₹84,200"
                    value={doc.total_value} onChange={e => onChange(index, "total_value", e.target.value)} />
                <LabeledInput label="Clearing Price" placeholder="e.g. ₹4,200"
                    value={doc.clearing_price} onChange={e => onChange(index, "clearing_price", e.target.value)} />
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════
   STEP INDICATOR
══════════════════════════════════════════ */

const StepIndicator: React.FC<{ step: 1 | 2; orderId: string | null }> = ({ step, orderId }) => (
    <div className="flex items-center gap-3">
        {/* Step 1 */}
        <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${step === 1 ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-700"
            }`}>
            {orderId ? <CheckCircle /> : <span>1</span>}
            Order Details
        </div>
        {/* Connector */}
        <div className={`h-px w-6 rounded-full transition-colors ${orderId ? "bg-emerald-400" : "bg-gray-200"}`} />
        {/* Step 2 */}
        <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${step === 2 ? "bg-sky-500 text-white" : orderId ? "bg-sky-100 text-sky-600" : "bg-gray-100 text-gray-400"
            }`}>
            <span>2</span>
            Upload Docs
        </div>
    </div>
);

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */

interface CreateOrderFormProps {
    onClose: () => void;
}

const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ onClose }) => {
    const [form, setForm] = useState<OrderFormData>(defaultOrder());
    const [docs, setDocs] = useState<DocEntry[]>([defaultDoc()]);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [activeStep, setActiveStep] = useState<1 | 2>(1);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [supplierId, setSupplierId] = useState<string>("")
    const [customerId, setCustomerId] = useState<string>("")
    const [suppliers, setSuppliers] = useState<Suppliers[]>([])
    const [customers, setCutomers] = useState<Customers[]>([])
    const [uploadingDocs, setUploadingDocs] = useState<boolean>(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [docsError, setDocsError] = useState<string | null>(null);
    const [docsSuccess, setDocsSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)

    async function init() {
        setLoading(true)
        const suppliersResponse = fetch(`${BACKEND_URL}/supplier/suppliers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const customersResponse = fetch(`${BACKEND_URL}/customer/customers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const resolved = await Promise.allSettled([customersResponse, suppliersResponse])
        resolved.map(async (obj) => {
            if (obj.status == "fulfilled") {
                const data = await obj.value.json()
                if (data.suppliers) {
                    setSuppliers(data.suppliers)
                }
                if (data.customers) {
                    setCutomers(data.customers)
                }
            }
        })
        setLoading(false)
    }
    useEffect(() => {
        // fetch all clients and all the customers and add them to dropdowns
        try {
            init().then(() => {
                console.log("Finished")
            })

        } catch (error) {

        }
    }, [])

    /* ── FIELD HANDLERS ── */

    const setField = <K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) =>
        setForm(prev => ({ ...prev, [key]: value }));

    const setMaterialField = (index: number, field: keyof Material, value: string | number) =>
        setForm(prev => {
            const updated = [...prev.materials];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, materials: updated };
        });

    const addMaterial = () => setForm(prev => ({ ...prev, materials: [...prev.materials, defaultMaterial()] }));
    const removeMaterial = (i: number) => setForm(prev => ({ ...prev, materials: prev.materials.filter((_, idx) => idx !== i) }));

    const setDocField = (index: number, field: keyof DocEntry, value: string | number | File | null) =>
        setDocs(prev => { const u = [...prev]; u[index] = { ...u[index], [field]: value }; return u; });

    const addDoc = () => setDocs(prev => [...prev, defaultDoc()]);
    const removeDoc = (i: number) => setDocs(prev => prev.filter((_, idx) => idx !== i));



    /* ── SUBMIT ORDER ── */

    const handleOrderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setOrderError(null);
        setSubmitting(true);
        if (!customerId || customerId.length < 5) {
            return
        }
        if (!supplierId || supplierId.length < 5) {
            return
        }
        form.customer_id = customerId
        form.supplier_id = supplierId
        console.log('Submitting : ', form)
        try {
            const res = await fetch(`${BACKEND_URL}/order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data: { orderId: string, message: string } = await res.json();
            setOrderId(data.orderId);
            setActiveStep(2);
        } catch (err) {
            //@ts-ignore
            setOrderError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    /* ── SUBMIT DOCS ── */

    const handleDocsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId) return;
        console.log(orderId)
        setDocsError(null);
        setDocsSuccess(false);
        setUploadingDocs(true);
        try {
            const formData = new FormData();
            const docMeta: Omit<DocEntry, "file">[] = [];
            docs.forEach(({ file, ...meta }) => {
                if (file) formData.append("doc", file);
                docMeta.push(meta);
            });
            formData.append("orderId", orderId)
            formData.append("docs_details", JSON.stringify(docMeta));
            const res = await fetch(`${BACKEND_URL}/order/addDocs`, {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json()
            console.log(data)
            setDocsSuccess(true);
            setDocs([defaultDoc()]);
        } catch (err) {
            setDocsError(err instanceof Error ? err.message : "Failed to upload documents.");
        } finally {
            setUploadingDocs(false);
        }
    };

    /* ══════════════════════════════════════════
       RENDER
    ══════════════════════════════════════════ */

    return (
        <>
            {
                loading ? <div className="w-full h-full flex items-center justify-center">
                    <Spinner />
                </div> : <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-100"
                        style={{ animation: "modal-in 0.2s cubic-bezier(0.4,0,0.2,1)" }}
                    >

                        {/* ── MODAL HEADER ── */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                            <div>
                                <h2 className="text-base font-bold text-gray-900">Create New Order</h2>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {orderId ? `Order created · ID: ${orderId}` : "Fill in the shipment and material details"}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <StepIndicator step={activeStep} orderId={orderId} />
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center text-gray-500 transition-colors flex-shrink-0"
                                >
                                    <XIcon />
                                </button>
                            </div>
                        </div>

                        {/* ── SCROLLABLE BODY ── */}
                        <div className="overflow-y-auto flex-1 px-6 py-5">

                            {/* ════ STEP 1 — ORDER DETAILS ════ */}
                            {activeStep === 1 && (
                                <form id="order-form" onSubmit={handleOrderSubmit} className="space-y-5">

                                    {/* Shipment Info */}
                                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                                        <SectionHeader title="Shipment Information" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <LabeledInput label="Bill of Lading Number" required placeholder="BL-IN-20260201-001"
                                                value={form.bill_of_lading_number} onChange={e => setField("bill_of_lading_number", e.target.value)} />
                                            <LabeledInput label="Container Number" placeholder="MSCU7823401"
                                                value={form.container_number} onChange={e => setField("container_number", e.target.value)} />
                                            <LabeledInput label="Shipping Line" required placeholder="e.g. MSC Shipping"
                                                value={form.shipping_line} onChange={e => setField("shipping_line", e.target.value)} />
                                            <LabeledInput label="CHA" placeholder="e.g. Clearance Hub Pvt Ltd"
                                                value={form.cha} onChange={e => setField("cha", e.target.value)} />
                                            <LabeledInput label="Country of Origin" required placeholder="e.g. China"
                                                value={form.country_of_origin_of_goods} onChange={e => setField("country_of_origin_of_goods", e.target.value)} />
                                            <LabeledSelect label="Delivery Type" required value={form.dilevery}
                                                onChange={e => setField("dilevery", e.target.value)}
                                                options={[
                                                    { label: "Door Delivery", value: "Door Delivery" },
                                                    { label: "Port Pickup", value: "Port Pickup" },
                                                    { label: "Warehouse Delivery", value: "Warehouse Delivery" },
                                                ]} />
                                        </div>
                                    </div>

                                    {/* Parties */}
                                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                                        <SectionHeader title="Parties" />
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Supplier Select */}
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                                    Supplier
                                                </label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 16 16">
                                                            <path d="M2 13V6l6-4 6 4v7H2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                                                            <rect x="6" y="9" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
                                                        </svg>
                                                    </div>
                                                    <select
                                                        value={supplierId}
                                                        onChange={(e) => setSupplierId(e.target.value)}
                                                        className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm font-medium text-gray-700 shadow-sm transition-all duration-150 hover:border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                                                    >
                                                        <option value="">Select Supplier</option>
                                                        {suppliers.map(supplier => (
                                                            <option key={supplier._id} value={supplier._id}>
                                                                {supplier.name} — {supplier.company_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 16 16">
                                                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Customer Select */}
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                                    Customer
                                                </label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 16 16">
                                                            <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
                                                            <path d="M3 13c0-2.761 2.239-4 5-4s5 1.239 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                                        </svg>
                                                    </div>
                                                    <select
                                                        value={customerId}
                                                        onChange={(e) => setCustomerId(e.target.value)}
                                                        className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm font-medium text-gray-700 shadow-sm transition-all duration-150 hover:border-emerald-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                                                    >
                                                        <option value="">Select Customer</option>
                                                        {customers.map(customer => (
                                                            <option key={customer._id} value={customer._id}>
                                                                {customer.name} — {customer.company_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 16 16">
                                                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ports & Dates */}
                                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                                        <SectionHeader title="Ports & Dates" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <LabeledInput label="Port of Loading" placeholder="e.g. Shanghai (CNSHA)"
                                                value={form.port_of_loading} onChange={e => setField("port_of_loading", e.target.value)} />
                                            <LabeledInput label="Port of Destination" placeholder="e.g. Mumbai (INNSA)"
                                                value={form.port_of_destination} onChange={e => setField("port_of_destination", e.target.value)} />
                                            <LabeledInput label="Loading Date" type="date"
                                                value={form.loading_date} onChange={e => setField("loading_date", e.target.value)} />
                                            <LabeledInput label="Shipped On Date" type="date"
                                                value={form.shipped_on_date} onChange={e => setField("shipped_on_date", e.target.value)} />
                                            <LabeledInput label="Expected to Arrive" type="date" className="col-span-2"
                                                value={form.expected_to_arrive} onChange={e => setField("expected_to_arrive", e.target.value)} />
                                        </div>
                                    </div>

                                    {/* Financials */}
                                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                                        <SectionHeader title="Financials" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <LabeledInput label="Purchase Price" placeholder="e.g. ₹72,000"
                                                value={form.purchase_price} onChange={e => setField("purchase_price", e.target.value)} />
                                            <LabeledInput label="Selling Price" placeholder="e.g. ₹84,200"
                                                value={form.selling_price} onChange={e => setField("selling_price", e.target.value)} />
                                            <LabeledInput label="Mill Payment (₹)" type="number" min={0} placeholder="0"
                                                value={form.mill_payment || ""} onChange={e => setField("mill_payment", parseFloat(e.target.value) || 0)} />
                                            <LabeledSelect label="Mill Payment Status" value={form.mill_payment_status}
                                                onChange={e => setField("mill_payment_status", e.target.value)}
                                                options={[
                                                    { label: "Paid", value: "Paid" },
                                                    { label: "Pending", value: "Pending" },
                                                    { label: "Overdue", value: "Overdue" },
                                                ]} />
                                        </div>
                                    </div>

                                    {/* Materials */}
                                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                                        <SectionHeader title="Materials" subtitle="All materials in this order" />
                                        <div className="space-y-3">
                                            {form.materials.map((mat, i) => (
                                                <MaterialCard key={i} index={i} mat={mat} onChange={setMaterialField}
                                                    onRemove={removeMaterial} canRemove={form.materials.length > 1} />
                                            ))}
                                        </div>
                                        <button type="button" onClick={addMaterial}
                                            className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold transition-colors w-full justify-center">
                                            <PlusIcon /> Add Another Material
                                        </button>
                                    </div>

                                    {orderError && (
                                        <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-600 font-medium">
                                            {orderError}
                                        </div>
                                    )}
                                </form>
                            )}

                            {/* ════ STEP 2 — DOCS UPLOAD ════ */}
                            {activeStep === 2 && (
                                <form id="docs-form" onSubmit={handleDocsSubmit} className="space-y-4">

                                    {/* Success banner */}
                                    {docsSuccess && (
                                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 font-semibold">
                                            <CheckCircle /> Documents uploaded successfully!
                                        </div>
                                    )}

                                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                                        <SectionHeader title="Upload Documents" subtitle={`Attaching docs to Order ${orderId}`} />
                                        <div className="space-y-4">
                                            {docs.map((doc, i) => (
                                                <DocCard key={i} index={i} doc={doc} onChange={setDocField}
                                                    onRemove={removeDoc} canRemove={docs.length > 1} />
                                            ))}
                                        </div>
                                        <button type="button" onClick={addDoc}
                                            className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-sky-300 text-sky-600 hover:bg-sky-50 text-xs font-semibold transition-colors w-full justify-center">
                                            <PlusIcon /> Add Another Document
                                        </button>
                                    </div>

                                    {docsError && (
                                        <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-600 font-medium">
                                            {docsError}
                                        </div>
                                    )}
                                </form>
                            )}
                        </div>

                        {/* ── MODAL FOOTER ── */}
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0 bg-gray-50/50">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-600 transition-colors"
                            >
                                {docsSuccess ? "Done" : "Cancel"}
                            </button>

                            <div className="flex items-center gap-3">
                                {/* Back to step 1 (only on step 2, and only if you want to review) */}
                                {activeStep === 2 && !docsSuccess && (
                                    <button
                                        type="button"
                                        onClick={() => setActiveStep(1)}
                                        className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-600 transition-colors"
                                    >
                                        ← Back
                                    </button>
                                )}

                                {/* Primary CTA */}
                                {activeStep === 1 && (
                                    <button
                                        type="submit"
                                        form="order-form"
                                        disabled={submitting}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold text-sm shadow-md shadow-emerald-200 transition-all active:scale-[0.99]"
                                    >
                                        {submitting ? (
                                            <><Spinner /> Creating Order…</>
                                        ) : "Create Order →"}
                                    </button>
                                )}

                                {activeStep === 2 && !docsSuccess && (
                                    <button
                                        type="submit"
                                        form="docs-form"
                                        disabled={uploadingDocs}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:bg-sky-200 text-white font-bold text-sm shadow-md shadow-sky-200 transition-all active:scale-[0.99]"
                                    >
                                        {uploadingDocs ? (
                                            <><Spinner /> Uploading…</>
                                        ) : <><UploadIcon /> Upload Documents</>}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

const Spinner: React.FC = () => (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
);

export default CreateOrderForm;