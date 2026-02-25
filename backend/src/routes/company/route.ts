import express from "express"
import prisma from "../../prisma.js";

const comapanyRouter = express.Router()
comapanyRouter.get('/', async (req: express.Request, res: express.Response) => {
    try {
        const response = await prisma.$transaction(async (tx) => {
            const orders = await tx.orders.findMany({
                select: {
                    material_description: true,
                    id: true,
                    customer: true,
                    supplier: true,
                    customer_id: true,
                    supplier_id: true,
                    port_of_loading: true,
                    port_of_deloading: true,
                    destination: true,
                    status: true
                },
                take: 10
            })
            const inwardPayments = await tx.inwardPayment.findMany({})
            const outwardPayments = await tx.outwardPayment.findMany({})
            return { orders, inwardPayments, outwardPayments }
        })
        if (!response || !response.inwardPayments || !response.outwardPayments || !response.orders) {
            res.status(403).json({
                message: "Unable to get details",
                valid: false
            })
            return
        }
        res.status(200).json({
            valid: true,
            orders: response.orders,
            inward_amount: response.inwardPayments.reduce((a, b) => a + b.balance_amount, 0),
            outward_amount: response.outwardPayments.reduce((a, b) => a + b.balance_amount, 0),
            total_inward_payments: response.inwardPayments.length,
            total_outward_payments: response.outwardPayments.length,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong",
            error: error,
            valid: false
        })
    }
})
export default comapanyRouter;