import express, { Router } from "express"
import customerRouter from "./customers/route.js"
import clientRouter from "./clients/route.js"
import comapanyRouter from "./company/route.js"
import ordersRouter from "./orders/route.js"
const router = express.Router()

router.use('/customer', customerRouter)
router.use('/supplier', clientRouter)
router.use('/comapany', comapanyRouter)
router.use('/order', ordersRouter)
export default router