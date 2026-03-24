import { Schema, Types } from "mongoose";

export const supplierSchema = new Schema(
    {
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
        pin_code: { type: String, required: true },
        bank_details: { type: String },
        company_address: { type: String, required: true },
        company_name: { type: String, required: true },
        email: { type: String, required: true }
    },
    { _id: true, timestamps: true },
);

export const customerSchema = new Schema(
    {
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
        pin_code: { type: String, required: true },
        company_address: { type: String, required: true },
        bank_details: { type: String },
        company_name: { type: String, required: true },
        email: { type: String, required: true },
        gst_no: { type: String, required: true },
        pan_no: { type: String, required: true }
    },
    { timestamps: true }
);
const docsSchema = new Schema(
    {
        doc_name: { type: String },
        doc_type: { type: String },
        doc_url: { type: String },
        issued_by: { type: String },
    },
    { _id: false }
);

const moneySchema = new Schema(
    {
        amount: { type: Number, required: true },
        currency: {
            type: String,
            enum: ["USD", "INR"],
            required: true,
        },
    },
    { _id: false }
);

const materialSchema = new Schema(
    {
        material_description: { type: String },
        purchase_price_per_unit: moneySchema,
        selling_price_per_unit: moneySchema,
        sales_bill_price: moneySchema,
        net_weight: { type: String },
        gross_weight: { type: String },
        igst: moneySchema,
        total_duty: moneySchema,
        hsn_code: { type: String },
        bill_of_entry_number: { type: String },
        bill_of_entry_doc_url: { type: String },
        clearing_price: moneySchema,
        images: [
            {
                url: { type: String }
            }
        ],
        docs: [docsSchema]
    },
    { _id: true }
);

export const orderSchema = new Schema(
    {
        bill_of_lading_number: { type: String },
        shipping_line: { type: String },
        freight_cost: moneySchema,
        customer_id: {
            type: Schema.Types.ObjectId,
            ref: "operations_tool_customers_table",
            required: true,
        },
        supplier_id: {
            type: Schema.Types.ObjectId,
            ref: "operations_tool_suppliers_table",
            required: true,
        },
        expected_to_arrive: { type: Date },
        loading_date: { type: Date },
        shipped_on_date: { type: Date },
        shipping_line_cost: { type: Number },
        mill_payment_status: { type: String, enum: ["PENDING", "ADVANCE PAID", "BALANCE PAID PARTLY", "COMPLETED"] },
        mill_payment_amount: moneySchema,
        mill_amount_paid: moneySchema,
        discharge_port: { type: String },
        port_of_destination: { type: String },
        port_of_loading: { type: String },
        country_of_origin_of_goods: { type: String },
        materials: [materialSchema],
    },
    { timestamps: true }
).index({ customer_id: 1, supplier_id: 1, createdAt: -1 });

