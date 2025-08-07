import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import { ProductsCon } from './controller/ProductsCon.js'

config()
const app = express()
const PORT = process.env.PORT || 9090
 
app.use(cors())
app.use(express.json())

app.get("/products",ProductsCon)   

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
  