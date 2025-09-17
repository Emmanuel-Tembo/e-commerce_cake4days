import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { identifyUser } from './middleware/guestAuthMiddleware.js';


config()
const app = express()
const PORT = process.env.PORT || 9090
 
const allowedOrigins = ['http://localhost:8082', 'http://localhost:8080'];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
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


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
  