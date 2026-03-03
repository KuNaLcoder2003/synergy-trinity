import express from "express"
import type { Customers } from "../../types.js";
import { Customer, Order } from "../../mongoose.js";
import mongoose from "mongoose";
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

        const existing = await Customer.findOne({
            $or: [
                {
                    mobile: customerDetails.mobile
                }, {
                    company_name: customerDetails.company_name.toLowerCase()
                }
            ]
        })


        if (existing) {
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

customerRouter.get('/customers', async (req: express.Request, res: express.Response) => {
    try {
        const customers = await Customer.find()
        if (!customers) {
            res.status(403).json({
                message: "Unable to get cutomers",
                valid: false
            })
            return
        }
        res.status(200).json({
            customers,
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

customerRouter.get('/details/:customerId', async (req: express.Request, res: express.Response) => {
    try {
        const customerId = req.params.customerId
        if (!customerId) {
            res.status(400).json({
                message: "Bad request",
                valid: false,
            })
            return
        }
        if (!mongoose.Types.ObjectId.isValid(customerId)) {
            res.status(400).json({
                message: "Invalid supplier ID",
                valid: false,
            })
            return
        }

        const customer = await Customer.findById(customerId)
        if (!customer) {
            res.status(404).json({
                message: "Unable to find customer",
                valid: false
            })
            return
        }
        const orders = await Order.find({ customer_id: customerId }).populate("cutomer_id").populate("supplier_id")
        res.status(200).json({
            customer,
            orders,
            valid: false
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