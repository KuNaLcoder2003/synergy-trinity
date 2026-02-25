import express from "express"
import cors from "cors"
import router from "./routes/index.js"
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/v1', router)
app.listen(4000, () => {
    console.log('App started')
})