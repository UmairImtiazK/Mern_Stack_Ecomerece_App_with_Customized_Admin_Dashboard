import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Cart } from '../models/shoppingCart.model.js';
import { Product } from '../models/product.model.js';
import { Types } from 'mongoose';

// Add item to cart
const addItemToCart = asyncHandler(async (req, res) => {
  const { itemId, quantity } = req.body;
  const userId = req.user._id; // Correctly access the userId from req.user


  if (!itemId || !quantity) {
    throw new ApiError(400, 'Product ID and quantity are required.');
  }

  // Check if the product exists and is in stock
  const product = await Product.findById(itemId);
  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  if (product.stockQuantity < quantity) {
    throw new ApiError(400, `Insufficient stock for ${product.name}.`);
  }

 
  // Check if the cart already exists for the user
  let cart = await Cart.findOne({ user: userId, status: 'active' });

  if (!cart) {
    cart = new Cart({ user: userId, items: [], status: 'active' });
  }

  await cart.addItem(itemId, quantity);

  res.status(200).json(new ApiResponse(200, cart, 'Item added to cart successfully.'));
});


// Remove item from cart
const removeItemFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.body;
  const userId  = req.user._id;

  if (!Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, 'Invalid product ID.');
  }

  // Find the cart for the user
  const cart = await Cart.findOne({ user: userId, status: 'active' });
  if (!cart) {
    throw new ApiError(404, 'Active cart not found.');
  }

  // Remove item from the cart
  await cart.removeItem(itemId);

  return res.status(200).json(
    new ApiResponse(200, cart, 'Item removed from cart successfully.')
  );
});

// Clear all items from the cart
const clearCart = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  // Find the cart for the user
  const cart = await Cart.findOne({ user: userId, status: 'active' });
  if (!cart) {
    throw new ApiError(404, 'Active cart not found.');
  }

  // Clear the cart
  await cart.clearCart();

  return res.status(200).json(
    new ApiResponse(200, null, 'Cart cleared successfully.')
  );
});

// Checkout the cart
const checkoutCart = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  // Find the cart for the user
  const cart = await Cart.findOne({ user: userId, status: 'active' });
  if (!cart) {
    throw new ApiError(404, 'Active cart not found.');
  }

  // Perform checkout (you can add logic for creating orders, deducting stock, etc.)
  await cart.checkout();

  return res.status(200).json(
    new ApiResponse(200, cart, 'Cart checked out successfully.')
  );
});

// Get cart details
const getCart = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  // Find the cart for the user
  const cart = await Cart.findOne({ user: userId, status: 'active' }).populate('items.product');
  if (!cart) {
    throw new ApiError(404, 'Active cart not found.');
  }

  return res.status(200).json(
    new ApiResponse(200, cart, 'Cart retrieved successfully.')
  );
});

// Get all carts for a specific user
const getAllCart = asyncHandler(async (req, res) => {
  const  userId  = req.user._id;
  
  // Find all carts for the user
  const carts = await Cart.find({ user: userId }).populate('items.product'); // Populate product details

  if (!carts || carts.length === 0) {
    throw new ApiError(404, 'No carts found for this user.');
  }
  
  return res.status(200).json(
    new ApiResponse(200, carts, 'All carts retrieved successfully.')
  );
});

export {
  addItemToCart,
  removeItemFromCart,
  clearCart,
  checkoutCart,
  getCart,
  getAllCart
};
