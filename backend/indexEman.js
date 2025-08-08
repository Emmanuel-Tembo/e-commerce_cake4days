// Import modules
import express from 'express';
import {config} from 'dotenv';
import cors from 'cors';
config();

// Initialize the Express app.
const app = express();
const PORT = process.env.PORT || 3000;

// Apply middleware.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
import authRoutes from './routes/authRoutes.js'

app.use('/auth',authRoutes)
// Start the server.
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Database connection pool created.');
});