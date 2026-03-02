import express from "express"
import type { Suppliers } from "../../types.js"
import { Order, Supplier } from "../../mongoose.js"
import mongoose from "mongoose"
const clientRouter = express.Router()

clientRouter.post('/', async (req: express.Request, res: express.Response) => {
    const supplierDetails: Suppliers = req.body
    if (!supplierDetails) {
        res.status(403).json({
            message: "Incomplete Supplier details",
            valid: false
        })
        return
    }
    try {

        const exists = await Supplier.find({
            $or: [
                {
                    mobile: supplierDetails.mobile,
                }, {
                    company_name: supplierDetails.company_name
                }
            ]
        })

        if (exists) {
            res.status(403).json({
                message: 'Supplier already exixts',
                valid: false
            })
            return
        }
        const newSupplier = new Supplier(supplierDetails)
        if (!newSupplier) {
            res.status(400).json({
                message: 'Bad Request',
                valid: false
            })
            return
        }
        await newSupplier.save()
        res.status(200).json({
            message: "Successfully added new supplier",
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

clientRouter.get('/suppliers', async (req: express.Request, res: express.Response) => {
    try {
        const suppliers = await Supplier.find({})
        if (!suppliers) {
            res.status(400).json({
                message: "Unable to fetch suppliers at the moment",
                valid: false
            })
            return
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong",
            error: error,
            valid: false
        })
    }
})

clientRouter.get('/details/:supplierId', async (req: express.Request, res: express.Response) => {
    try {
        const { supplierId } = req.params;

        if (!supplierId) {
            res.status(400).json({
                message: "Something went wrong"
            })
            return
        }

        if (!mongoose.Types.ObjectId.isValid(supplierId)) {
            return res.status(400).json({
                message: "Invalid supplier ID",
                valid: false,
            });
        }
        const supplier = await Supplier.findById(supplierId)
        if (!supplier) {
            res.status(404).json({
                message: "Unable to find supplier",
                valid: false
            })
            return
        }
        const orders = await Order.find({ supplier_id: supplierId })
        res.status(200).json({
            supplier,
            orders,
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