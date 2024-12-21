import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middlewaare.js";

const productRouter = Router();

// Route to create a product
productRouter.route('/create').post(
    upload.fields([{ name: "image", maxCount: 1 }]),  // Middleware to handle file upload
    createProduct
);

// Route to get all products
productRouter.route('/all').get(
    getAllProducts
);

// Route to delete a product by ID
// Change this to DELETE method and pass the product ID as a route parameter
productRouter.route('/delete/:id').delete(
    deleteProduct
);

// Route to update a product by ID
// Change this to PUT method and pass the product ID as a route parameter
productRouter.route('/update/:id').put(
    upload.fields([{ name: "image", maxCount: 1 }]),  // Middleware to handle file upload (if needed)
    updateProduct
);

productRouter.route('/get/:id').get(
    getProduct
);
export default productRouter;
