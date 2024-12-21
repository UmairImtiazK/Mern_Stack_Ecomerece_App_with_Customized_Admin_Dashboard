import { ApiError } from '../utils/ApiError.js'
import  { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/Cloudinary.js'
import { Product } from '../models/product.model.js'
import { Types } from 'mongoose';

const createProduct = asyncHandler(async(req,res)=>{
    // 1. Get product details from frontend (req.body)
    // 2. Validation - Ensure no required fields are empty
    // 3. Check if product already exists (e.g., based on name or category)
    // 4. Check for valid images (ensure at least one image is provided)
    // 5. Create the product object
    // 6. Save the product object to the database
    // 7. Remove any sensitive data (not applicable in this case but good practice for user data)
    // Since there are no sensitive fields, this step is omitted.
    // 8. Check if the product was created successfully


    const { name, description, price, category, stockQuantity } = req.body;

    if (!name || !description || !price || !category || !stockQuantity) {
        return new ApiError(400,"All fields are required");
      }

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
        throw new ApiError(400, "User with this Name and Email already exists.");
      }

      const imgLocalPath = req.files?.image[0]?.path;
      if(!imgLocalPath)
          return new ApiError(400,"Product img is required.")
  
      
      const image = await uploadOnCloudinary(imgLocalPath);
      if(!image){
          throw new ApiError(400,"Product img is required.")
      }

      const newProduct = new Product({
        name,
        description,
        price,
        category,
        stockQuantity,
        image: image.url, 
      });
      await newProduct.save();

      const createdProduct = await Product.findById(newProduct._id);
      if (!createdProduct) {
        return new ApiError(400,"Failed to create product")
      }
    
      return res.status(200).json(
        new ApiResponse(200,createdProduct,"Product Created sucessfully.")
    )

})

const getAllProducts = asyncHandler(async(req,res)=>{
    try {
        const products = await Product.find({ isActive: true });
        return res.status(200).json(new ApiResponse(200, products, "Successfully get Products."));
      } catch (error) {
        return res.status(500).json(new ApiError(400,"cannot the products."));
      }
})

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID.");
  }
  // Check if product exists
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  // Soft delete the product by marking it as inactive or you can permanently delete it using .remove() if necessary
  product.isActive = false;
  await product.save();

  return res.status(200).json(
    new ApiResponse(200, null, "Product deleted successfully.")
  );
});


const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, stockQuantity } = req.body;

  // Find the product by id
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  // Validate fields
  if (!name || !description || !price || !category || !stockQuantity) {
    throw new ApiError(400, "All fields are required.");
  }

  // Check if a new image is uploaded
  let imageUrl = product.image;
  if (req.files?.image) {
    const imgLocalPath = req.files.image[0]?.path;
    if (!imgLocalPath) {
      throw new ApiError(400, "Product image is required.");
    }

    const image = await uploadOnCloudinary(imgLocalPath);
    if (!image) {
      throw new ApiError(400, "Product image upload failed.");
    }
    imageUrl = image.url; // Update the image URL if a new one is provided
  }

  // Update the product details
  product.name = name;
  product.description = description;
  product.price = price;
  product.category = category;
  product.stockQuantity = stockQuantity;
  product.image = imageUrl;

  // Save the updated product
  await product.save();

  return res.status(200).json(
    new ApiResponse(200, product, "Product updated successfully.")
  );
});


const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the product by id
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return res.status(200).json(
    new ApiResponse(200, product, "Product retrieved successfully.")
  );
});




export {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getProduct,
};
