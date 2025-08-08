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
import customOrderRoutes from './routes/customOrderRoutes.js'; 
import cartRoutes from './routes/cartRoutes.js';


app.use('/auth',authRoutes);
app.use('/products',Products);
app.use('/', customOrderRoutes);
app.use('/', cartRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
  