import mongoose from "mongoose";

// Define schema for the shopping cart
const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to Product model
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Shopping cart schema
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    items: [cartItemSchema], // Array of cart items
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "checked-out", "abandoned"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate total price before saving the cart
cartSchema.pre("save", async function (next) {
  if (this.isModified("items")) {
    await this.calculateTotalPrice();
  }
  next();
});

// Pre-save hook to ensure that only one active cart exists per user
cartSchema.pre("save", async function (next) {
  if (this.status === "active") {
    const existingCart = await Cart.findOne({
      user: this.user,
      status: "active",
    });

    if (existingCart && existingCart._id.toString() !== this._id.toString()) {
      throw new Error("User already has an active cart");
    }
  }
  next();
});

// Method to get the total number of items in the cart
cartSchema.methods.getTotalItemCount = function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
};
// Method to mark the cart as abandoned
cartSchema.methods.markAsAbandoned = async function () {
  this.status = "abandoned";
  await this.save();
};
// Method to mark the cart as checked-out
cartSchema.methods.checkout = async function () {
  // Logic to process the checkout (e.g., deducting stock, creating order)
  // This is a simplified example, in a real-world scenario, you'd want more robust error handling and operations.

  this.status = "checked-out";
  await this.save();
};
// Method to check if the cart is empty
cartSchema.methods.isEmpty = function () {
  return this.items.length === 0;
};
// Method to apply a discount to the cart
cartSchema.methods.applyDiscount = async function (discountPercentage) {
  if (discountPercentage < 0 || discountPercentage > 100) {
    throw new Error("Discount percentage must be between 0 and 100.");
  }

  const discountAmount = (this.totalPrice * discountPercentage) / 100;
  this.totalPrice -= discountAmount;

  await this.save();
};
// Method to check if the product is available before adding to the cart
cartSchema.methods.checkStockAvailability = async function (
  productId,
  quantity
) {
  const product = await mongoose.model("Product").findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    throw new Error(`Not enough stock for ${product.name}.`);
  }

  return true;
};

// Calculate total price for the cart whenever it gets updated
cartSchema.methods.calculateTotalPrice = async function () {
  let total = 0;
  for (const item of this.items) {
    total += item.price * item.quantity;
  }
  this.totalPrice = total;
  // Remove the save here
  // await this.save();  
};

cartSchema.methods.addItem = async function (itemId, quantity) {
  const existingItem = this.items.find(
    (item) => item.product.toString() === itemId.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity; // Update quantity
  } else {
    const product = await mongoose.model("Product").findById(itemId);
    if (!product) {
      throw new Error("Product not found");
    }
    const price = product.price; // Get product price
    this.items.push({
      product: itemId,
      quantity,
      price,
    });
  }

  // Calculate the total price without calling save here
  await this.calculateTotalPrice();
  
  // Now save the document only once
  await this.save();
};

// Remove item from cart
cartSchema.methods.removeItem = async function (productId) {
  this.items = this.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );
  await this.calculateTotalPrice();
  await this.save();
};

// Clear all items from the cart
cartSchema.methods.clearCart = async function () {
  this.items = [];
  this.totalPrice = 0;
  await this.save();
};

export const Cart = mongoose.model("Cart", cartSchema);
