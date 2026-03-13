import React, { useState, useEffect } from "react";
import type { Customer } from "../types";
import { Modal, FormField, inputClass, inputStyle } from "./index";

interface CustomerFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (customer: Customer) => void;
    existing?: Customer | null;
}

const empty: Omit<Customer, "_id"> = {
    name: "",
    mobile: "",
    country: "",
    state: "",
    pincode: "",
    bank_details: "",
    company_address: "",
    company_name: "",
};

const CustomerForm: React.FC<CustomerFormProps> = ({
    isOpen,
    onClose,
    onSave,
    existing,
}) => {
    const [form, setForm] = useState<Omit<Customer, "_id">>(empty);
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
        const customer: Customer = {
            _id: existing?._id || `cust_${Date.now()}`,
            ...form,
        };
        onSave(customer);
        onClose();
    };

    const fields: { key: keyof typeof empty; label: string; required?: boolean; placeholder?: string }[] = [
        { key: "company_name", label: "Company Name", required: true, placeholder: "e.g. Mehta Steels Pvt. Ltd." },
        { key: "name", label: "Contact Person", required: true, placeholder: "Full name" },
        { key: "mobile", label: "Mobile Number", required: true, placeholder: "+91-XXXXXXXXXX" },
        { key: "company_address", label: "Company Address", required: true, placeholder: "Full address" },
        { key: "country", label: "Country", required: true, placeholder: "e.g. India" },
        { key: "state", label: "State", required: true, placeholder: "e.g. Maharashtra" },
        { key: "pincode", label: "Pincode", required: true, placeholder: "6-digit code" },
        { key: "bank_details", label: "Bank Details", placeholder: "Bank name | A/C | IFSC" },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={existing ? "Edit Customer" : "Add New Customer"}
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
                        className="px-4 py-2 rounded-xl text-sm font-medium transition"
                        style={{ color: "#4a7a5c", backgroundColor: "#f0faf4" }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition"
                        style={{ background: "linear-gradient(135deg, #4ade80, #16a34a)" }}
                    >
                        {existing ? "Save Changes" : "Add Customer"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CustomerForm;