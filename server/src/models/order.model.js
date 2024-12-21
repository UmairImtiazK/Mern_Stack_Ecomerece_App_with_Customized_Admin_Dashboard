import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    items: [
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
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      default: "pending", // Default order status
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid", // Payment status
    },
    paymentIntentId: {
      type: String,
      required: false, // Will be set during payment processing
    },
    address: {
      type: String,
      required: [true, "Delivery address is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate the total order amount
orderSchema.pre("save", async function (next) {
  if (this.isModified("items")) {
    let total = 0;
    for (const item of this.items) {
      total += item.price * item.quantity;
    }
    this.totalAmount = total;
  }
  next();
});

// Method: Mark order as completed
orderSchema.methods.markAsCompleted = async function () {
  this.status = "completed";
  await this.save();
};

// Method: Cancel an order
orderSchema.methods.cancelOrder = async function () {
  this.status = "canceled";
  await this.save();
};

// Method: Update payment status
orderSchema.methods.updatePaymentStatus = async function (status) {
  if (!["unpaid", "paid", "refunded"].includes(status)) {
    throw new Error("Invalid payment status");
  }
  this.paymentStatus = status;
  await this.save();
};

// Method: Create a Payment Intent (Stripe)
orderSchema.methods.createPaymentIntent = async function (stripe, currency = "usd") {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(this.totalAmount * 100), // Convert to smallest currency unit
    currency: currency,
    metadata: { orderId: this._id.toString() },
  });

  this.paymentIntentId = paymentIntent.id;
  await this.save();

  return paymentIntent.client_secret; // Return client secret to complete payment on the client side
};

// Method: Confirm Payment (Stripe)
orderSchema.methods.confirmPayment = async function (stripe) {
  if (!this.paymentIntentId) {
    throw new Error("Payment intent not found");
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(this.paymentIntentId);

  if (paymentIntent.status === "succeeded") {
    this.paymentStatus = "paid";
    await this.save();
    return true;
  }

  throw new Error("Payment not successful");
};

// Method: Handle Refund (Stripe)
orderSchema.methods.refundPayment = async function (stripe) {
  if (this.paymentStatus !== "paid") {
    throw new Error("Cannot refund an unpaid or already refunded order");
  }

  const refund = await stripe.refunds.create({
    payment_intent: this.paymentIntentId,
  });

  if (refund.status === "succeeded") {
    this.paymentStatus = "refunded";
    await this.save();
    return true;
  }

  throw new Error("Refund failed");
};

// Export the Order model
export const Order = mongoose.model("Order", orderSchema);
