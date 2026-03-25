import express from "express"
import type { Customers } from "../../types.js";
import { Customer, Order } from "../../mongoose.js";
import mongoose from "mongoose";
const customerRouter = express.Router()


customerRouter.post('/newCustomer', async (req: express.Request, res: express.Response) => {
    try {
        const customer_details: Customers = req.body
        if (!customer_details) {
            res.status(400).json({
                message: "Bad request",
                valid: false
            })
            return
        }
        const customer = await Customer.findOne({
            $or: [
                {
                    mobile: customer_details.mobile
                },
                {
                    email: customer_details.email
                }
            ]
        })
        if (customer) {
            res.status(400).json({
                message: "Cutomer already exists",
                valid: false
            })
            return
        }
        const new_cutomer = new Customer(customer_details)
        if (!new_cutomer) {
            res.status(403).json({
                message: "Unable to add customer",
                valid: false
            })
            return
        }
        await new_cutomer.save()
        res.status(200).json({
            message: "Customer added successfully",
            valid: true,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong",
            valid: false
        })
    }
})

customerRouter.get("/all", async (req: express.Request, res: express.Response) => {
    try {
        const customers = await Customer.find({})
        if (!customers || customers == null) {
            res.status(403).json({
                message: "Unable to fetch customers",
                valid: false
            })
            return
        }
        res.status(200).json({
            customers,
            valid: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            valid: true
        })
    }
})



export default customerRouter;