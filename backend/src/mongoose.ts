import mongoose from "mongoose"
import { customerSchema, orderSchema, supplierSchema } from "./models.js"

mongoose.connect('mongodb+srv://kunal:kunal@cluster0.acncl.mongodb.net/')

export const Customer = mongoose.model('operations_tool_customers_table', customerSchema)
export const Supplier = mongoose.model('operations_tool_suppliers_table', supplierSchema)
export const Order = mongoose.model('operations_tool_orders_table', orderSchema)



