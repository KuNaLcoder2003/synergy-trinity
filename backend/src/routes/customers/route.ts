import express from "express"
import type { Customers } from "../../types.js";
import { Customer } from "../../mongoose.js";
const customerRouter = express.Router()

customerRouter.post('/', async (req: express.Request, res: express.Response) => {
    try {
        const customerDetails: Customers = req.body;
        if (!customerDetails) {
            res.status(403).json({
                message: "Incomplete Supplier details",
                valid: false
            })
            return
        }

        const existing = await Customer.find({
            $or: [
                {
                    mobile: customerDetails.mobile
                }, {
                    company_name: customerDetails.company_name.toLowerCase()
                }
            ]
        })

        if (!existing) {
            res.status(403).json({
                message: "Customer already exists",
                valid: false
            })
            return
        }

        const new_cutomer = new Customer(customerDetails)

        if (!new_cutomer) {
            res.status(400).json({
                message: "Bad request",
                valid: false
            })
            return
        }
        await new_cutomer.save()
        res.status(200).json({
            message: "Successfully added new customer",
            valid: true,
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