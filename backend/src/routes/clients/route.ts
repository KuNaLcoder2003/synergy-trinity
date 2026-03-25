import express from "express"
import type { Suppliers } from "../../types.js"
import { Order, Supplier } from "../../mongoose.js"
import mongoose from "mongoose"
const clientRouter = express.Router()

clientRouter.post('/newSupplier', async (req: express.Request, res: express.Response) => {
    try {
        const supplier_details: Suppliers = req.body
        if (!supplier_details) {
            res.status(400).json({
                message: "Bad request",
                valid: false
            })
            return
        }
        const supplier = await Supplier.findOne({
            $or: [
                {
                    mobile: supplier_details.mobile
                },
                {
                    email: supplier_details.email
                }
            ]
        })
        if (supplier) {
            res.status(400).json({
                message: "Cutomer already exists",
                valid: false
            })
            return
        }
        const new_cutomer = new Supplier(supplier_details)
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

clientRouter.get("/all", async (req: express.Request, res: express.Response) => {
    try {
        const suppliers = await Supplier.find({})
        if (!suppliers || suppliers == null) {
            res.status(403).json({
                message: "Unable to fetch customers",
                valid: false
            })
            return
        }
        res.status(200).json({
            suppliers,
            valid: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            valid: true
        })
    }
})



export default clientRouter;