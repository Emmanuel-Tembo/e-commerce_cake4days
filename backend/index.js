import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import ProductsRoute from './routes/Products.js'

config()
const app = express()
const PORT = process.env.PORT || 9090
 
app.use(cors())
app.use(express.json())

app.use("/products",ProductsRoute)   

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
  