import { Router } from "express";
import {
    createOrder,
    createPaymentIntent,
    getAllOrders,
    getOrder,
    getUserOrders,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const orderRouter = Router();

// Create an order
orderRouter.route("/create").post(verifyJWT, createOrder);


// Get all orders for a logged-in user
orderRouter.route("/user-orders").get(verifyJWT, getUserOrders);
orderRouter.route("/payment/:orderId").get(verifyJWT, getOrder);
orderRouter.route("/payment").post(verifyJWT, createPaymentIntent);
orderRouter.route("/all-order").get(getAllOrders);



export default orderRouter;
