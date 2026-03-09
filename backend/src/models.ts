import mongoose, { Schema, Types } from "mongoose";
import { type Customers } from "./types.js";



export const supplierSchema = new Schema(
    {
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        bank_details: { type: String },
        company_address: { type: String, required: true },
        company_name: { type: String, required: true },
    },
    { _id: true, timestamps: true },

);


export const customerSchema = new Schema(
    {
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        company_address: { type: String, required: true },
        bank_details: { type: String },
        company_name: { type: String, required: true },
    },
    { timestamps: true }
);


const materialSchema = new Schema(
    {
        container_number: { type: String },
        gross_weight: { type: Number },
        net_weight: { type: Number },
        material_description: { type: String },
        sales_bill_price: { type: Number },
        selling_price: { type: Number },
        gst_amount_sales_bill: { type: Number },
        purchase_price: { type: Number },
    },
    { _id: false }
);


const docsSchema = new Schema(
    {
        clearing_price: { type: String },
        created_at: { type: String },
        doc_name: { type: String },
        doc_type: { type: String },
        doc_url: { type: String },
        gross_weight: { type: Number },
        net_weight: { type: Number },
        issued_by: { type: String },
        total_value: { type: String },
    },
    { _id: true }
);


export const orderSchema = new Schema(
    {
        bill_of_lading_number: { type: String },
        cha: { type: String },
        container_number: { type: String },
        dilevery: { type: String },

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

        expected_to_arrive: { type: String },
        loading_date: { type: String },
        shipped_on_date: { type: String },

        mill_payment_status: { type: String },
        mill_payment: { type: Number },

        port_of_destination: { type: String },
        port_of_loading: { type: String },

        purchase_price: { type: String },
        selling_price: { type: String },

        shipping_line: { type: String },
        country_of_origin_of_goods: { type: String },

        materials: [materialSchema],
        docs: [docsSchema],
    },
    { timestamps: true }
);