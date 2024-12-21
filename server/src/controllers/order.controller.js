import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Order } from '../models/order.model.js';
import Stripe from 'stripe';
import {Product} from '../models/product.model.js'; // Import the Product model

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a new order

const createOrder = asyncHandler(async (req, res) => {
    const { items, address } = req.body
    // Validate request body
    if (!items || items.length === 0) {
        throw new ApiError(400, "Order must contain at least one item.");
    }

    if (!address?.trim()) {
        throw new ApiError(400, "Delivery address is required.");
    }

    // Populate prices for the items
    const populatedItems = await Promise.all(
        items.map(async (item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new ApiError(404, `Product with ID ${item.product} not found.`);
            }

            return {
                product: product._id,
                quantity: item.quantity,
                price: product.price, // Assuming `new_price` is the correct field
            };
        })
    );

    // Create the order
    const order = await Order.create({
        user: req.user._id,
        items: populatedItems,
        address,
    });

    if (!order) {
        throw new ApiError(500, "Failed to create the order.");
    }

    return res.status(201).json(
        new ApiResponse(201, order, "Order created successfully.")
    );
});

// Get orders for a specific user
const getUserOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    console.log("in user order function");
    const orders = await Order.find({ user: userId })
        .populate('items.product', 'name price') // Populate product details
        .sort({ createdAt: -1 });

    if (!orders) {
        throw new ApiError(404, "No orders found for this user.");
    }

    return res.status(200).json(
        new ApiResponse(200, orders, "User orders fetched successfully.")
    );
});

// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["pending", "completed", "canceled"].includes(status)) {
        throw new ApiError(400, "Invalid status value.");
    }

    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found.");
    }

    order.status = status;
    await order.save();

    return res.status(200).json(
        new ApiResponse(200, order, "Order status updated successfully.")
    );
});

// Process payment for an order
const createPaymentIntent = asyncHandler(async (req, res) => {
    const { orderId, currency = 'usd' } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found.");
    }

    if (order.paymentStatus !== 'unpaid') {
        throw new ApiError(400, "Payment has already been processed for this order.");
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.totalAmount * 100), // Convert to smallest currency unit
        currency,
        metadata: { orderId: order._id.toString() },
    });

    order.paymentIntentId = paymentIntent.id;
    await order.save();

    return res.status(200).json(
        new ApiResponse(200, { clientSecret: paymentIntent.client_secret }, "Payment intent created successfully.")
    );
});

// Confirm payment
const confirmPayment = asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found.");
    }

    if (!order.paymentIntentId) {
        throw new ApiError(400, "No payment intent associated with this order.");
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);

    if (paymentIntent.status === "succeeded") {
        order.paymentStatus = "paid";
        order.status = "completed";
        await order.save();

        return res.status(200).json(
            new ApiResponse(200, order, "Payment confirmed and order completed.")
        );
    }

    throw new ApiError(400, "Payment not successful.");
});

const getOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    // Fetch the order by ID
    const order = await Order.findById(orderId);
    // Check if the order exists
    if (!order) {
        throw new ApiError(404, "Order not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, order, "Order data retrieved successfully.")
    );
});


const getAllOrders = asyncHandler(async (req, res) => {
    // Fetch all orders
    const orders = await Order.find()
        .populate('user', 'username email avatar') // Populate user details (adjust fields as per your user model)
        .populate('items.product', 'name price') // Populate product details
        .sort({ createdAt: -1 }); // Sort by most recent orders

    // Check if there are any orders
    if (!orders || orders.length === 0) {
        throw new ApiError(404, "No orders found.");
    }

    return res.status(200).json(
        new ApiResponse(200, orders, "All orders fetched successfully.")
    );
});


// Export the controller functions
export {
    createOrder,
    getUserOrders,
    updateOrderStatus,
    createPaymentIntent,
    confirmPayment,
    getOrder,
    getAllOrders
};
