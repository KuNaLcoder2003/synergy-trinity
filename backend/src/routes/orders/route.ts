import express from "express"
import prisma from "../../prisma.js";
type Order = {
    supplier_id: string;
    customer_id: string;
    purchaseAmount: number;
    sellingAmount: number;
    clearing_rate: number;
    cha_name: string;
    transporter: string;
    status: string;
    shippingLine: string;
    material_description: string;
    net_weight: string;
    gross_weight: string;
    currency: string;
    vat_rate: number;
    order_type: string;
    shipped_on_date: string;
    loaded_on_date: string;
    gate_in_date: string;
    arrival_date: string;
    port_of_loading: string;
    port_of_deloading: string;
    destination: string;
}
const ordersRouter = express.Router()

ordersRouter.post("/", async (req: express.Request, res: express.Response) => {
    try {
        const orderDetails: Order = await req.body;
        if (!orderDetails) {
            res.status(400).json({
                message: "Incomplete Details",
                valid: false
            })
            return
        }

        const response = await prisma.$transaction(async (tx) => {
            const new_order = await tx.orders.create({
                data: orderDetails
            })
            return { new_order }
        })
        if (!response || !response.new_order) {
            res.status(403).json({
                message: "Unable to create new Order",
                valid: false
            })
            return
        }
        res.status(200).json({
            message: 'Order created',
            valid: true
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

export default ordersRouter;