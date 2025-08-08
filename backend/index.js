import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import ProductsRoute from './routes/Products.js'

config()
const app = express()
const PORT = process.env.PORT || 9090
 
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
import authRoutes from './routes/authRoutes.js'

app.use('/auth',authRoutes);
app.get("/products",ProductsCon)   

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
  