import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { identifyUser } from './middleware/guestAuthMiddleware.js';


config()
const app = express()
const PORT = process.env.PORT || 9090
 
// Configure CORS to allow your frontend's origin and credentials
// This is the fix for your CORS error.
const corsOptions = {
    origin: 'http://localhost:8080',
    credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
import authRoutes from './routes/authRoutes.js'
import Products from './routes/Products.js'
import customOrderRoutes from './routes/customOrderRoutes.js'; 
import cartRoutes from './routes/cartRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';


app.use('/api', identifyUser, orderRoutes);
app.use('/auth',authRoutes);
app.use('/products',Products);
app.use('/', customOrderRoutes);
app.use('/', cartRoutes);
app.use('/', reviewRoutes);
app.use('/user', profileRoutes);
app.use('/api', paymentRoutes);
// app.use('/api', orderRoutes)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
  