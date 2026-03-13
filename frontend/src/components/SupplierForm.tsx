import React, { useState, useEffect } from "react";
import type { Supplier } from "../types";
import { Modal, FormField, inputClass, inputStyle } from "./index";

interface SupplierFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (supplier: Supplier) => void;
    existing?: Supplier | null;
}

const empty: Omit<Supplier, "_id"> = {
    name: "",
    mobile: "",
    country: "",
    state: "",
    pincode: "",
    bank_details: "",
    company_address: "",
    company_name: "",
};

const SupplierForm: React.FC<SupplierFormProps> = ({
    isOpen,
    onClose,
    onSave,
    existing,
}) => {
    const [form, setForm] = useState<Omit<Supplier, "_id">>(empty);
    const [focused, setFocused] = useState<string | null>(null);

    useEffect(() => {
        if (existing) {
            const { _id, ...rest } = existing;
            setForm(rest);
        } else {
            setForm(empty);
        }
    }, [existing, isOpen]);

    const handleChange = (field: keyof typeof empty, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const supplier: Supplier = {
            _id: existing?._id || `supp_${Date.now()}`,
            ...form,
        };
        onSave(supplier);
        onClose();
    };

    const fields: { key: keyof typeof empty; label: string; required?: boolean; placeholder?: string }[] = [
        { key: "company_name", label: "Company Name", required: true, placeholder: "e.g. Guangzhou Metal Works Co." },
        { key: "name", label: "Contact Person", required: true, placeholder: "Full name" },
        { key: "mobile", label: "Mobile Number", required: true, placeholder: "+XX-XXXXXXXXXX" },
        { key: "company_address", label: "Company Address", required: true, placeholder: "Full address" },
        { key: "country", label: "Country", required: true, placeholder: "e.g. China" },
        { key: "state", label: "State / Province", required: true, placeholder: "e.g. Guangdong" },
        { key: "pincode", label: "Postal Code", required: true, placeholder: "Postal/PIN code" },
        { key: "bank_details", label: "Bank Details", placeholder: "Bank | A/C | SWIFT" },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={existing ? "Edit Supplier" : "Add New Supplier"}
            size="lg"
        >
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    {fields.map(({ key, label, required, placeholder }) => (
                        <FormField key={key} label={label} required={required}>
                            <input
                                className={inputClass}
                                style={{
                                    ...inputStyle,
                                    ...(focused === key
                                        ? { borderColor: "#4ade80", boxShadow: "0 0 0 3px rgba(74,222,128,0.12)" }
                                        : {}),
                                }}
                                value={form[key]}
                                onChange={(e) => handleChange(key, e.target.value)}
                                onFocus={() => setFocused(key)}
                                onBlur={() => setFocused(null)}
                                placeholder={placeholder}
                                required={required}
                            />
                        </FormField>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-sm font-medium"
                        style={{ color: "#4a7a5c", backgroundColor: "#f0faf4" }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
                        style={{ background: "linear-gradient(135deg, #4ade80, #16a34a)" }}
                    >
                        {existing ? "Save Changes" : "Add Supplier"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default SupplierForm;