import express from "express"
import prisma from "../../prisma.js";
type supplier = {
    company_name: string;
    name: string;
    mobile: string;
    email: string;
    bank_details: string;
    country: string;
    pincode: string;
}
const clientRouter = express.Router()

clientRouter.post('/', async (req: express.Request, res: express.Response) => {
    const supplierDetails: supplier = req.body
    if (!supplierDetails) {
        res.status(403).json({
            message: "Incomplete Supplier details",
            valid: false
        })
        return
    }
    try {
        const response = await prisma.$transaction(async (tx) => {
            const new_supplier = await tx.suppliers.create({
                data: supplierDetails
            })
            return { new_supplier }
        })
        if (!response || !response.new_supplier) {
            res.status(403).json({
                message: "Unable to add new supplier",
                valid: false
            })
            return
        }
        res.status(200).json({
            message: "Successfully added New Supplier",
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



export default clientRouter;