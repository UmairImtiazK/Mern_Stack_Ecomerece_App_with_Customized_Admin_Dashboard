import { Router } from "express";
import { 
    addItemToCart,
    removeItemFromCart,
    clearCart,
    checkoutCart,
    getCart,
    getAllCart 
} from "../controllers/shoppingCart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const cartRouter = Router();

// Route to create a new cart for the user
// cartRouter.route('/create').post(createCart);

// Route to get the user's cart by user ID
 cartRouter.route('/user/:userId').get(getCart);
 cartRouter.route('/all').get(verifyJWT, getAllCart);

// Route to add an item to the cart
cartRouter.route('/add-item').post(verifyJWT,addItemToCart);

// Route to remove an item from the cart
cartRouter.route('/remove-item').delete(verifyJWT,removeItemFromCart);

// Route to clear the entire cart
cartRouter.route('/clear').delete(clearCart);

// Route to checkout the cart (mark it as checked-out)
cartRouter.route('/checkout').post(checkoutCart);

// Route to apply a discount to the cart
// cartRouter.route('/apply-discount').post(applyDiscountToCart);

// Route to mark the cart as abandoned
// cartRouter.route('/abandon').post(markCartAsAbandoned);

export default cartRouter;
