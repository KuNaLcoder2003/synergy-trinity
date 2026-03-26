import type React from "react"
import type { Customers, Suppliers } from "../types"
import { X } from "lucide-react"

type Props =
    | {
        type: "Customer"
        details: Customers
        onClose: React.Dispatch<React.SetStateAction<boolean>>
    }
    | {
        type: "Supplier"
        details: Suppliers
        onClose: React.Dispatch<React.SetStateAction<boolean>>
    }

const ExtendedDetails: React.FC<Props> = ({ type, details, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => onClose(false)}
            />

            {/* Drawer */}
            <div className="ml-auto h-full w-[420px] bg-white shadow-xl p-6 relative flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between border-b pb-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {type} Details
                    </h2>

                    <button
                        onClick={() => onClose(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        <X size={18} className="text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="mt-4 space-y-6 overflow-y-auto">

                    {/* Name Highlight */}
                    <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-lg font-semibold text-gray-800">
                            {details.name}
                        </p>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">

                        <DetailItem label="Mobile" value={details.mobile} />
                        <DetailItem label="Email" value={details.email} />
                        <DetailItem label="Country" value={details.country} />
                        <DetailItem label="State" value={details.state} />
                        <DetailItem label="Pin Code" value={details.pin_code} />
                        <DetailItem label="Company" value={details.company_name} />

                    </div>

                    {/* Address */}
                    <div>
                        <p className="text-sm text-gray-500">Company Address</p>
                        <p className="text-sm text-gray-800">
                            {details.company_address}
                        </p>
                    </div>

                    {/* Bank */}
                    <div>
                        <p className="text-sm text-gray-500">Bank Details</p>
                        <p className="text-sm text-gray-800">
                            {details.bank_details}
                        </p>
                    </div>


                    {type === "Customer" && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <DetailItem label="GST No" value={details.gst_no} />
                            <DetailItem label="PAN No" value={details.pan_no} />
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default ExtendedDetails


// 🔹 Reusable Field Component
const DetailItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => {
    return (
        <div>
            <p className="text-gray-500">{label}</p>
            <p className="text-gray-800 font-medium">{value || "-"}</p>
        </div>
    )
}