import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import stripePackage from 'stripe'; // Import Stripe SDK

import router from './routes/user.router.js';
import productRouter from './routes/product.router.js';
import cartRouter from './routes/shoppingCart.router.js';
import adminRouter from './routes/admin.router.js';
import orderRouter from './routes/order.router.js';

const app = express();

// Load environment variables
dotenv.config({
    path: '../.env',
});

// Initialize Stripe
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY); // Pass the secret key

app.use(cors({
    origin: process.env.CORS,
    Credential: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/user', router);
app.get('/test', (req, res) => {
    res.send('Server is working!');
});

app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/admin', adminRouter);
app.use('/order', orderRouter);

export default app;
