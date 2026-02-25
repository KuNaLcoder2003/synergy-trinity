import express from "express"
import prisma from "../../prisma.js";
type customer = {
    company_name: string;
    name: string;
    mobile: string;
    email: string;
    bank_details: string;
    upi_id: string;
    state: string;
    country: string;
    pincode: string;

}
const customerRouter = express.Router()

customerRouter.post('/', async (req: express.Request, res: express.Response) => {
    try {
        const customerDetails: customer = req.body;
        if (!customerDetails) {
            res.status(403).json({
                message: "Incomplete Supplier details",
                valid: false
            })
            return
        }
        const response = await prisma.$transaction(async (tx) => {
            const new_customer = await tx.customers.create({
                data: customerDetails
            })
            return { new_customer }
        })
        if (!response || !response.new_customer) {
            res.status(403).json({
                message: "Unable to add new customer",
                valid: false
            })
            return
        }
        res.status(200).json({
            message: "Successfully Added New Customer",
            valid: true
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


export default customerRouter;