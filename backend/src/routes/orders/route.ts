import express from "express"
import type { Orders } from "../../types.js";
import { Order } from "../../mongoose.js";
import multer from "multer"
import uploadToCloud, { uploadMultipleFiles } from "../../functions/cloud.js";
import mongoose from "mongoose";
import Exceljs from "exceljs"
type OrderDocs = {
    gross_weight: number | null;
    net_weight: number | null;
    clearing_price: string | null;
    created_at: string | null;
    doc_name: string | null;
    doc_type: string | null;
    issued_by: string | null;
    total_value: string | null;
}

type OrderDocsObj = {
    gross_weight: number | null;
    net_weight: number | null;
    doc_url: string | null;
    clearing_price: string | null;
    created_at: string | null;
    doc_name: string | null;
    doc_type: string | null;
    issued_by: string | null;
    total_value: string | null;
}
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const ordersRouter = express.Router()


ordersRouter.post("/", async (req: express.Request, res: express.Response) => {
    try {
        const orderDetails: Orders = await req.body;
        if (!orderDetails) {
            res.status(400).json({
                message: "Incomplete Details",
                valid: false
            })
            return
        }
        // before creating new order check if there's any doc sent
        const new_order = new Order(orderDetails)
        if (!new_order) {
            res.status(403).json({
                message: "Unable to create new order",
                valid: false
            })
            return
        }
        await new_order.save()
        res.status(200).json({
            message: "Sucesfully created new order"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong",
            valid: false,
            error: error
        })
    }
})


ordersRouter.post('/addDocs', upload.array("doc"), async (req: express.Request, res: express.Response) => {
    try {
        const docs_details: OrderDocs[] = JSON.parse(req.body.docs_details);

        const orderId = req.body.orderId;
        if (!orderId) {
            res.status(400).json({
                message: "Bad request",
                valid: false
            })
            return
        }
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            res.status(400).json({
                message: "Invalid Id type",
                return: false
            })
            return
        }
        const order = await Order.findById(orderId)
        if (!order) {
            res.status(404).json({
                message: "Order doest not exists",
                valid: false
            })
            return
        }
        const docs = req.files as Express.Multer.File[]
        if (!docs || docs.length == 0 || !docs_details) {
            res.status(400).json({
                message: "Bad request",
                valid: false
            })
            return
        }
        const buffer: Buffer[] = docs.map(file => {
            return Buffer.from(file.buffer)
        })
        const { passed, failed } = await uploadMultipleFiles(buffer)
        console.log(passed);
        if (failed.length > 0) {
            res.status(403).json({
                message: "Some of the assests were not uploaded",
                valid: false
            })
        }
        const merged_arr: OrderDocsObj[] = docs_details.map((doc: any) => {
            let obj: OrderDocsObj = { ...doc, doc_url: "" };
            passed.map(cloudResponse => {
                obj.doc_url = cloudResponse.url as string
            })
            return obj;
        })
        const updated_order = await Order.findByIdAndUpdate(orderId, {
            $push: {
                docs: {
                    $each: merged_arr
                }
            }
        },
            { new: true }
        )
        if (!updated_order) {
            res.status(403).json({
                message: "Unable to update order",
                valid: false
            })
            return
        }
        await updated_order.save()
        res.status(200).json({
            message: "Successfully uploaded docs",
            valid: true
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong',
            valid: false,
            error: error
        })
    }
})

ordersRouter.get('/summary', async (req: express.Request, res: express.Response) => {
    const workBook = new Exceljs.Workbook()
    try {
        const sheet = workBook.addWorksheet("Summary")
        const orders = await Order.find().populate("customer_id").populate("supplier_id")
        if (!orders || orders.length == 0) {
            res.status(404).json({
                message: "No orders",
                valid: false
            })
            return
        }
        const order_ids = orders.map(order => order._id)
        const customers = orders.map(order => {
            //@ts-ignore
            return order.customer_id.name
        })
        const suppliers = orders.map(order => {
            //@ts-ignore
            return order.supplier_id.name
        })
        const dates = orders.map(order => {
            return order.createdAt
        })
        const shippinglines = orders.map(order => order.shipping_line)
        const amounts = orders.map(order => order.materials.reduce((a, b) => a + b.selling_price! * b.net_weight!, 0))
        sheet.columns = [
            { header: "Order Id", key: "orderId", width: 25 },
            { header: "Customer", key: "customer", width: 20 },
            { header: "Supplier", key: "supplier", width: 20 },
            { header: "Date", key: "date", width: 18 },
            { header: "Shipping Line", key: "shippingLine", width: 20 },
            { header: "Total Value", key: "totalValue", width: 15 },
        ]
        orders.forEach((_, index) => {
            sheet.addRow({
                orderId: order_ids[index],
                customer: customers[index],
                supplier: suppliers[index],
                date: dates[index],
                shippingLine: shippinglines[index],
                totalValue: amounts[index]
            })
        })
        sheet.getRow(1).font = { bold: true }
        sheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                }
            })
        })
        const buffer = await sheet.workbook.xlsx.writeBuffer()
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=report.xlsx"
        )
        res.send(buffer)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong",
            valid: false
        })
    }
})



export default ordersRouter;