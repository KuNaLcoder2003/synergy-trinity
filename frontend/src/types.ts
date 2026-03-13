export type Supplier = {
    _id: string;
    name: string;
    mobile: string;
    country: string;
    state: string;
    pincode: string;
    bank_details: string;
    company_address: string;
    company_name: string;
};

export type Customer = {
    _id: string;
    name: string;
    mobile: string;
    country: string;
    state: string;
    pincode: string;
    bank_details: string;
    company_address: string;
    company_name: string;
};

export type Image = {
    url: string;
};

export type Material = {
    _id: string;
    container_number: string;
    gross_weight: number;
    net_weight: number;
    material_description: string;
    sales_bill_price: number;
    selling_price_with_gst: number;
    gst_amount_sales_bill: number;
    total_duty: number;
    purchase_price_per_unit: number;
    bill_of_entry: string;
    images: Image[];
};

export type Doc = {
    _id: string;
    clearing_price: string;
    created_at: string;
    doc_name: string;
    doc_type: string;
    doc_url: string;
    gross_weight: number;
    net_weight: number;
    issued_by: string;
    total_value: string;
};

export type Order = {
    _id: string;
    docs: Doc[];
    materials: Material[];
    bill_of_lading_number: string;
    cha: string;
    customer_id: string;
    dilevery: string;
    supplier_id: string;
    expected_to_arrive: string;
    loading_date: string;
    mill_payment_status: string;
    mill_payment: number;
    port_of_destination: string;
    port_of_loading: string;
    purchase_price: string;
    selling_price: string;
    shipped_on_date: string;
    shipping_line: string;
    country_of_origin_of_goods: string;
    freight_cost?: number;
    shipping_line_cost?: number;
    createdAt?: string;
};

export type ActiveView =
    | "dashboard"
    | "customers"
    | "suppliers"
    | "orders";