import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'


config()
const app = express()
const PORT = process.env.PORT || 9090
 
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
import authRoutes from './routes/authRoutes.js'
import Products from './routes/Products.js'
app.use('/auth',authRoutes);
app.use('/products',Products)    

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
  