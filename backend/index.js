import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';


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
import wishlistRoutes from './routes/wishlistRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import salesReportRoutes from './routes/salesReportRoutes.js';
import profileRoutes from './routes/profileRoutes.js';



app.use('/auth',authRoutes);
app.use('/products',Products);
app.use('/', customOrderRoutes);
app.use('/', cartRoutes);
app.use('/', wishlistRoutes);
app.use('/', reviewRoutes);
app.use('/', salesReportRoutes);
app.use('/user', profileRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
  