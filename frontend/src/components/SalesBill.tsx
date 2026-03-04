import { useState, useRef, useEffect, type CSSProperties, type JSX } from "react";

// ─── CDN imports handled via script tags at runtime ───
// html2canvas + jsPDF loaded dynamically below

// ── Type Declarations for dynamically loaded CDN libs ──
declare global {
    interface Window {
        html2canvas: (
            element: HTMLElement,
            options?: { scale?: number; useCORS?: boolean; backgroundColor?: string }
        ) => Promise<HTMLCanvasElement>;
        jspdf: {
            jsPDF: new (options?: {
                orientation?: "portrait" | "landscape";
                unit?: "mm" | "pt" | "cm" | "in";
                format?: string | number[];
            }) => JsPDFInstance;
        };
    }
}

interface JsPDFInstance {
    internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
    addImage: (
        imageData: string,
        format: string,
        x: number,
        y: number,
        width: number,
        height: number
    ) => void;
    addPage: () => void;
    save: (filename: string) => void;
}

// ── Domain Types ──
interface LineItem {
    description: string;
    hsn: string;
    qty: number;
    rate: number;
}

interface Order {
    id: string;
    invoiceNo: string;
    date: string;
    partyName: string;
    partyAddress: string;
    partyGST: string;
    items: LineItem[];
    igstRate: number;
}

type BillStringField = "invoiceNo" | "date" | "partyName" | "partyAddress" | "partyGST";
type ItemStringField = "description" | "hsn";
type ItemNumberField = "qty" | "rate";
type ItemField = ItemStringField | ItemNumberField;

// ── Sample Data ──
const SAMPLE_ORDERS: Order[] = [
    {
        id: "ORD-2026-001",
        invoiceNo: "TI/26-27/001",
        date: "11.02.2026",
        partyName: "Raj Electronics Pvt. Ltd.",
        partyAddress: "45, Industrial Area, Phase-2, Delhi – 110020",
        partyGST: "07AABCR1234F1Z5",
        items: [
            { description: "HP Laptop 15s-eq2143AU (Ryzen 5, 8GB, 512GB SSD)", hsn: "84713010", qty: 5, rate: 52000 },
            { description: 'Dell Monitor 24" FHD IPS (P2422H)', hsn: "85285200", qty: 3, rate: 18500 },
        ],
        igstRate: 18,
    },
    {
        id: "ORD-2026-002",
        invoiceNo: "TI/26-27/002",
        date: "15.02.2026",
        partyName: "Mumbai Tech Supplies Co.",
        partyAddress: "12, Andheri East, MIDC, Mumbai – 400093",
        partyGST: "27AABCM5678G1Z2",
        items: [
            { description: "Zebronics ZEB-K35 Mechanical Keyboard (USB)", hsn: "84716060", qty: 20, rate: 2200 },
            { description: "Logitech MX Master 3 Wireless Mouse", hsn: "84716050", qty: 20, rate: 7800 },
            { description: "TP-Link TL-SG108 8-Port Gigabit Switch", hsn: "85176990", qty: 10, rate: 2600 },
        ],
        igstRate: 18,
    },
    {
        id: "ORD-2026-003",
        invoiceNo: "TI/26-27/003",
        date: "20.02.2026",
        partyName: "Bengaluru IT Solutions LLP",
        partyAddress: "77, Whitefield Main Road, Bengaluru – 560066",
        partyGST: "29AABCB9012H1Z8",
        items: [
            { description: "Epson EcoTank L3250 Multifunction Printer", hsn: "84433110", qty: 8, rate: 14500 },
            { description: 'Samsung 1TB SSD 870 EVO SATA 2.5"', hsn: "84717020", qty: 15, rate: 8999 },
        ],
        igstRate: 18,
    },
];

// ── Amount to Words (Indian format) ──
function toWords(amount: number): string {
    const ones: string[] = [
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
        "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
        "Seventeen", "Eighteen", "Nineteen",
    ];
    const tens: string[] = [
        "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
    ];

    function convert(n: number): string {
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
        if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
        if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
        if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
        return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
    }

    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);
    let result = convert(rupees) + " Rupees";
    if (paise > 0) result += " and " + convert(paise) + " Paise";
    return result.trim() + " Only";
}

// ── Shared Styles ──
const inputStyle: CSSProperties = {
    width: "100%",
    padding: "7px 10px",
    borderRadius: 6,
    border: "1.5px solid #cccccc",
    fontSize: 13,
    color: "#111111",
    outline: "none",
    background: "#f5f5f5",
    boxSizing: "border-box",
    fontFamily: "inherit",
    resize: "vertical",
};

function tdStyle(align: CSSProperties["textAlign"]): CSSProperties {
    return {
        padding: "8px 10px",
        border: "1px solid #bbbbbb",
        textAlign: align,
        fontSize: 12,
        verticalAlign: "top",
    };
}

// ─────────────────────────────────────────────────────────────────────────────
export default function SalesBill(): JSX.Element {
    const [selectedOrderId, setSelectedOrderId] = useState<string>("");
    const [bill, setBill] = useState<Order | null>(null);
    const [downloading, setDownloading] = useState<boolean>(false);
    const billRef = useRef<HTMLDivElement>(null);

    function loadOrder(orderId: string): void {
        const order = SAMPLE_ORDERS.find((o) => o.id === orderId);
        if (!order) { setBill(null); return; }
        setBill(JSON.parse(JSON.stringify(order)) as Order);
    }

    useEffect(() => { loadOrder(selectedOrderId); }, [selectedOrderId]);

    const subTotal: number = bill ? bill.items.reduce((sum, it) => sum + it.qty * it.rate, 0) : 0;
    const igstAmt: number = bill ? (subTotal * bill.igstRate) / 100 : 0;
    const grandTotal: number = subTotal + igstAmt;

    function updateField(field: BillStringField, value: string): void {
        setBill((prev) => prev ? { ...prev, [field]: value } : prev);
    }

    function updateIgstRate(value: number): void {
        setBill((prev) => prev ? { ...prev, igstRate: value } : prev);
    }

    function updateItem(idx: number, field: ItemField, value: string): void {
        setBill((prev) => {
            if (!prev) return prev;
            const items = [...prev.items];
            const isNumeric = field === "qty" || field === "rate";
            items[idx] = { ...items[idx], [field]: isNumeric ? parseFloat(value) || 0 : value };
            return { ...prev, items };
        });
    }

    function addItem(): void {
        setBill((prev) =>
            prev ? { ...prev, items: [...prev.items, { description: "", hsn: "", qty: 0, rate: 0 }] } : prev
        );
    }

    function removeItem(idx: number): void {
        setBill((prev) =>
            prev ? { ...prev, items: prev.items.filter((_, i) => i !== idx) } : prev
        );
    }

    async function downloadPDF(): Promise<void> {
        if (!billRef.current || !bill) return;
        setDownloading(true);
        try {
            if (!window.html2canvas) {
                await new Promise<void>((res, rej) => {
                    const s = document.createElement("script");
                    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
                    s.onload = () => res();
                    s.onerror = () => rej(new Error("Failed to load html2canvas"));
                    document.head.appendChild(s);
                });
            }
            if (!window.jspdf) {
                await new Promise<void>((res, rej) => {
                    const s = document.createElement("script");
                    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
                    s.onload = () => res();
                    s.onerror = () => rej(new Error("Failed to load jsPDF"));
                    document.head.appendChild(s);
                });
            }

            const canvas = await window.html2canvas(billRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
            });

            const imgData = canvas.toDataURL("image/png");
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = pdf.internal.pageSize.getHeight();
            const ratio = canvas.height / canvas.width;
            const imgH = pageW * ratio;
            let pos = 0;

            if (imgH <= pageH) {
                pdf.addImage(imgData, "PNG", 0, 0, pageW, imgH);
            } else {
                let remaining = imgH;
                while (remaining > 0) {
                    pdf.addImage(imgData, "PNG", 0, pos, pageW, imgH);
                    remaining -= pageH;
                    pos -= pageH;
                    if (remaining > 0) pdf.addPage();
                }
            }

            pdf.save(`Invoice_${bill.invoiceNo.replace(/\//g, "-")}.pdf`);
        } catch (e) {
            alert("Download failed: " + (e instanceof Error ? e.message : String(e)));
        }
        setDownloading(false);
    }

    const stringFields: { label: string; key: BillStringField }[] = [
        { label: "Invoice No.", key: "invoiceNo" },
        { label: "Date", key: "date" },
        { label: "Party Name", key: "partyName" },
        { label: "Party Address", key: "partyAddress" },
        { label: "Party GSTIN", key: "partyGST" },
    ];

    const tableHeaders = [
        { label: "#", center: true },
        { label: "Particulars (Description & Specifications)", center: false },
        { label: "HSN Code", center: true },
        { label: "Qty – Kgs", center: true },
        { label: "Rate / Kg (₹)", center: true },
        { label: "Amount (₹)", center: true },
    ];

    return (
        <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#eeeeee" }}>

            {/* ── Top Bar ── */}
            <div style={{
                background: "#111111",
                padding: "20px 40px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                borderBottom: "3px solid #333333",
            }}>
                <div>
                    <div style={{
                        color: "#888888", fontSize: 11, fontWeight: 700,
                        letterSpacing: 4, textTransform: "uppercase",
                    }}>
                        Trinity International
                    </div>
                    <div style={{ color: "#ffffff", fontSize: 22, fontWeight: 800, marginTop: 2 }}>
                        Invoice Generator
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <select
                        value={selectedOrderId}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedOrderId(e.target.value)}
                        style={{
                            padding: "10px 18px", borderRadius: 8,
                            border: "1.5px solid #444444",
                            background: "#222222", color: "#eeeeee",
                            fontSize: 14, cursor: "pointer", outline: "none", minWidth: 220,
                        }}
                    >
                        <option value="">— Select an Order —</option>
                        {SAMPLE_ORDERS.map((o) => (
                            <option key={o.id} value={o.id}>{o.id} · {o.partyName}</option>
                        ))}
                    </select>
                    {bill && (
                        <button
                            onClick={downloadPDF}
                            disabled={downloading}
                            style={{
                                padding: "10px 24px", borderRadius: 8, border: "2px solid #ffffff",
                                background: downloading ? "#444444" : "#ffffff",
                                color: downloading ? "#aaaaaa" : "#111111",
                                fontWeight: 700, fontSize: 14,
                                cursor: downloading ? "not-allowed" : "pointer",
                                boxShadow: "0 4px 14px rgba(255,255,255,0.1)",
                                transition: "all 0.2s",
                                display: "flex", alignItems: "center", gap: 8,
                            }}
                        >
                            {downloading ? "⏳ Generating..." : "⬇ Download PDF"}
                        </button>
                    )}
                </div>
            </div>

            {/* ── Empty State ── */}
            {!bill ? (
                <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", height: "70vh", color: "#888888",
                }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🧾</div>
                    <div style={{ fontSize: 20, fontWeight: 600, color: "#333333" }}>
                        Select an order to generate a bill
                    </div>
                    <div style={{ fontSize: 14, marginTop: 6 }}>
                        Choose from the dropdown above to get started
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", gap: 24, padding: "28px 40px", alignItems: "flex-start" }}>

                    {/* ── LEFT: Edit Panel ── */}
                    <div style={{
                        width: 300, flexShrink: 0, background: "#ffffff", borderRadius: 14,
                        boxShadow: "0 2px 16px rgba(0,0,0,0.10)", padding: 24,
                        position: "sticky", top: 24,
                        border: "1px solid #dddddd",
                    }}>
                        <div style={{
                            fontSize: 13, fontWeight: 800, letterSpacing: 2,
                            color: "#111111", textTransform: "uppercase", marginBottom: 18,
                            borderBottom: "2px solid #111111", paddingBottom: 10,
                        }}>
                            ✏ Edit Fields
                        </div>

                        {stringFields.map(({ label, key }) => (
                            <div key={key} style={{ marginBottom: 14 }}>
                                <label style={{
                                    fontSize: 11, fontWeight: 600, color: "#555555",
                                    display: "block", marginBottom: 4,
                                    textTransform: "uppercase", letterSpacing: 0.5,
                                }}>
                                    {label}
                                </label>
                                {key === "partyAddress" ? (
                                    <textarea
                                        value={bill[key]}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField(key, e.target.value)}
                                        rows={2}
                                        style={inputStyle}
                                    />
                                ) : (
                                    <input
                                        value={bill[key]}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField(key, e.target.value)}
                                        style={inputStyle}
                                    />
                                )}
                            </div>
                        ))}

                        <div style={{ marginBottom: 14 }}>
                            <label style={{
                                fontSize: 11, fontWeight: 600, color: "#555555",
                                display: "block", marginBottom: 4,
                                textTransform: "uppercase", letterSpacing: 0.5,
                            }}>
                                IGST Rate (%)
                            </label>
                            <input
                                type="number"
                                value={bill.igstRate}
                                min={0}
                                max={100}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    updateIgstRate(parseFloat(e.target.value) || 0)
                                }
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ borderTop: "1px solid #dddddd", paddingTop: 16, marginTop: 8 }}>
                            <div style={{
                                fontSize: 11, fontWeight: 800, color: "#333333",
                                textTransform: "uppercase", letterSpacing: 1, marginBottom: 12,
                            }}>
                                Line Items
                            </div>

                            {bill.items.map((item: LineItem, idx: number) => (
                                <div key={idx} style={{
                                    background: "#f5f5f5", borderRadius: 8, padding: "10px 12px",
                                    marginBottom: 10, border: "1px solid #dddddd",
                                }}>
                                    <div style={{
                                        display: "flex", justifyContent: "space-between",
                                        alignItems: "center", marginBottom: 6,
                                    }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: "#333333" }}>Item {idx + 1}</span>
                                        <button
                                            onClick={() => removeItem(idx)}
                                            style={{
                                                background: "none", border: "none", color: "#111111",
                                                cursor: "pointer", fontSize: 18, lineHeight: 1, fontWeight: 700,
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <textarea
                                        placeholder="Description"
                                        value={item.description}
                                        rows={2}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                            updateItem(idx, "description", e.target.value)
                                        }
                                        style={{ ...inputStyle, marginBottom: 6, fontSize: 12 }}
                                    />
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                                        <input
                                            placeholder="HSN"
                                            value={item.hsn}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                updateItem(idx, "hsn", e.target.value)
                                            }
                                            style={{ ...inputStyle, fontSize: 12 }}
                                        />
                                        <input
                                            placeholder="Qty"
                                            type="number"
                                            value={item.qty}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                updateItem(idx, "qty", e.target.value)
                                            }
                                            style={{ ...inputStyle, fontSize: 12 }}
                                        />
                                        <input
                                            placeholder="Rate"
                                            type="number"
                                            value={item.rate}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                updateItem(idx, "rate", e.target.value)
                                            }
                                            style={{ ...inputStyle, fontSize: 12 }}
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={addItem}
                                style={{
                                    width: "100%", padding: "8px", borderRadius: 8,
                                    border: "1.5px dashed #aaaaaa", background: "none",
                                    color: "#555555", cursor: "pointer", fontSize: 13, fontWeight: 600,
                                }}
                            >
                                + Add Item
                            </button>
                        </div>
                    </div>

                    {/* ── RIGHT: Bill Preview ── */}
                    <div style={{ flex: 1, overflow: "auto" }}>
                        <div
                            ref={billRef}
                            style={{
                                background: "#ffffff",
                                width: "100%",
                                maxWidth: 820,
                                margin: "0 auto",
                                boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
                                borderRadius: 4,
                                fontFamily: "Arial, sans-serif",
                                fontSize: 13,
                                color: "#111111",
                                border: "1px solid #cccccc",
                            }}
                        >
                            {/* ── Bill Header ── */}
                            <div style={{
                                background: "#111111",
                                color: "#ffffff",
                                padding: "18px 28px",
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                            }}>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 1, color: "#ffffff" }}>
                                        TRINITY INTERNATIONAL
                                    </div>
                                    <div style={{ fontSize: 11, marginTop: 4, color: "#aaaaaa" }}>
                                        GSTIN: 27AAACT1234B1ZV &nbsp;|&nbsp; info@trinityintl.com &nbsp;|&nbsp; +91 98765 43210
                                    </div>
                                    <div style={{ fontSize: 11, color: "#aaaaaa" }}>
                                        Office No. 5, Commerce Centre, Fort, Mumbai – 400001
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{
                                        fontSize: 16, fontWeight: 800, color: "#ffffff",
                                        letterSpacing: 3, border: "2px solid #ffffff",
                                        padding: "4px 12px", display: "inline-block",
                                    }}>
                                        TAX INVOICE
                                    </div>
                                    <div style={{ marginTop: 8, fontSize: 12 }}>
                                        <span style={{ color: "#aaaaaa" }}>Invoice No: </span>
                                        <span style={{ fontWeight: 700, color: "#ffffff" }}>{bill.invoiceNo}</span>
                                    </div>
                                    <div style={{ fontSize: 12 }}>
                                        <span style={{ color: "#aaaaaa" }}>Date: </span>
                                        <span style={{ fontWeight: 700, color: "#ffffff" }}>{bill.date}</span>
                                    </div>
                                </div>
                            </div>

                            {/* ── Party Details ── */}
                            <div style={{
                                background: "#f0f0f0",
                                padding: "14px 28px",
                                borderBottom: "2px solid #111111",
                            }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                    <div>
                                        <div style={{
                                            fontSize: 10, fontWeight: 700, color: "#555555",
                                            textTransform: "uppercase", letterSpacing: 1,
                                        }}>
                                            Bill To
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: 14, marginTop: 2, color: "#111111" }}>
                                            {bill.partyName}
                                        </div>
                                        <div style={{ fontSize: 12, color: "#444444", marginTop: 2 }}>
                                            {bill.partyAddress}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{
                                            fontSize: 10, fontWeight: 700, color: "#555555",
                                            textTransform: "uppercase", letterSpacing: 1,
                                        }}>
                                            GSTIN
                                        </div>
                                        <div style={{
                                            fontWeight: 600, fontSize: 13, marginTop: 2,
                                            fontFamily: "monospace", letterSpacing: 1, color: "#111111",
                                        }}>
                                            {bill.partyGST}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Items Table ── */}
                            <div style={{ padding: "0 28px 20px" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
                                    <thead>
                                        <tr style={{ background: "#222222", color: "#ffffff" }}>
                                            {tableHeaders.map(({ label, center }) => (
                                                <th key={label} style={{
                                                    padding: "10px 10px",
                                                    textAlign: center ? "center" : "left",
                                                    fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                                                    border: "1px solid #444444",
                                                }}>
                                                    {label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bill.items.map((item: LineItem, idx: number) => (
                                            <tr key={idx} style={{ background: idx % 2 === 0 ? "#f5f5f5" : "#ffffff" }}>
                                                <td style={tdStyle("center")}>{idx + 1}</td>
                                                <td style={tdStyle("left")}>{item.description}</td>
                                                <td style={tdStyle("center")}>{item.hsn}</td>
                                                <td style={tdStyle("center")}>{item.qty}</td>
                                                <td style={tdStyle("right")}>
                                                    ₹ {Number(item.rate).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                </td>
                                                <td style={tdStyle("right")}>
                                                    ₹ {(item.qty * item.rate).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        ))}
                                        {/* Empty filler rows */}
                                        {Array.from({ length: Math.max(0, 7 - bill.items.length) }).map((_, i: number) => (
                                            <tr
                                                key={`empty-${i}`}
                                                style={{ background: (bill.items.length + i) % 2 === 0 ? "#f5f5f5" : "#ffffff" }}
                                            >
                                                {Array.from({ length: 6 }).map((_c, j: number) => (
                                                    <td key={j} style={{ ...tdStyle("center"), height: 28 }}>&nbsp;</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* ── Totals + Terms ── */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 0, marginTop: 0 }}>

                                    {/* Terms */}
                                    <div style={{
                                        border: "1px solid #bbbbbb", borderTop: "none", padding: "14px 16px",
                                        fontSize: 11, color: "#333333", background: "#fafafa",
                                    }}>
                                        <div style={{
                                            fontWeight: 700, fontSize: 12, marginBottom: 8,
                                            color: "#111111", textTransform: "uppercase", letterSpacing: 0.5,
                                        }}>
                                            Warranty & Terms
                                        </div>
                                        {[
                                            "An Invoice must accompany products returned for warranty.",
                                            "Goods damaged during transit voids warranty.",
                                            "90 days limited warranty unless otherwise stated.",
                                            "30 days limited warranty on OEM processor (internal parts) — exchange same items only.",
                                            "All items carry MFG Warranty only. No return or exchange.",
                                        ].map((t: string, i: number) => (
                                            <div key={i} style={{ marginBottom: 5, display: "flex", gap: 6 }}>
                                                <span style={{ color: "#111111", fontWeight: 700 }}>{i + 1}.</span>
                                                <span>{t}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Summary */}
                                    <div style={{ border: "1px solid #bbbbbb", borderTop: "none", borderLeft: "none" }}>
                                        {[
                                            { label: "Sub Total", value: subTotal },
                                            { label: `Add: IGST @ ${bill.igstRate}%`, value: igstAmt },
                                        ].map(({ label, value }: { label: string; value: number }) => (
                                            <div key={label} style={{
                                                display: "flex", justifyContent: "space-between",
                                                padding: "8px 14px", borderBottom: "1px solid #dddddd",
                                                fontSize: 13, color: "#333333",
                                            }}>
                                                <span>{label}</span>
                                                <span>₹ {value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        ))}
                                        <div style={{
                                            display: "flex", justifyContent: "space-between", padding: "10px 14px",
                                            background: "#111111", color: "#ffffff", fontWeight: 800, fontSize: 14,
                                        }}>
                                            <span>Grand Total</span>
                                            <span>₹ {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Amount in Words */}
                                <div style={{
                                    border: "1px solid #bbbbbb", borderTop: "none", padding: "10px 16px",
                                    background: "#f0f0f0", fontSize: 12, color: "#111111",
                                }}>
                                    <span style={{ fontWeight: 700 }}>Total Amount (INR – In Words): </span>
                                    <span style={{ fontStyle: "italic", textTransform: "uppercase" }}>
                                        {toWords(grandTotal)}
                                    </span>
                                </div>

                                {/* Signatory */}
                                <div style={{ display: "flex", justifyContent: "flex-end", padding: "28px 16px 12px" }}>
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: "#111111" }}>
                                            For TRINITY INTERNATIONAL
                                        </div>
                                        <div style={{
                                            height: 48, borderBottom: "1.5px solid #111111",
                                            marginTop: 8, width: 180,
                                        }} />
                                        <div style={{ fontSize: 11, marginTop: 6, color: "#555555" }}>
                                            Authorised Signatory
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}