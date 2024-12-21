import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: ["electronics", "fashion", "home", "toys", "beauty", "sports","popular","new","men","women","kids"], // Customize categories as per your requirements
    },
    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock quantity cannot be negative"],
    },
    image: 
      {
        type: String, // Cloudinary URL or S3 URL for images
        required: true,
      },
    
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review", // Reference to the Review model
      },
    ],
    isActive: {
      type: Boolean,
      default: true, // Determines if the product is active or inactive
    },
  },
  { timestamps: true }
);

// checking the product have stock and price
productSchema.pre("save", function (next) {
  if (this.stockQuantity < 0) {
    return next(new Error("Stock quantity cannot be negative"));
  }
  if (this.price < 0) {
    return next(new Error("Price cannot be negative"));
  }

  next();
});

//checking the product quantity
productSchema.methods.updateStockQuantity = async function (orderQuantity) {
  if (this.stockQuantity < orderQuantity) {
    throw new Error("Not enough stock available");
  }
  this.stockQuantity -= orderQuantity;
  await this.save();
};

export const Product = mongoose.model("Product", productSchema);
