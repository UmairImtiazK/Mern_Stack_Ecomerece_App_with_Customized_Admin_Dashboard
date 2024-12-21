import { Router } from "express";
import { registerAdmin, loginAdmin, logoutAdmin } from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multer.middlewaare.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const adminRouter = Router();

// register Admin route
adminRouter.route("/register").post(
    upload.fields([{ name: "avatar", maxCount: 1 }]),  
    registerAdmin
);

adminRouter.route("/login").post(loginAdmin);
adminRouter.route("/logout").post(verifyJWT,logoutAdmin);


export default adminRouter;