import { Router } from "express";
import { registerUser, loginUser, logoutUser, getUsersWithAvatar, getUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewaare.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

// register user route
router.route("/register").post(
    upload.fields([{ name: "avatar", maxCount: 1 }]),  
    registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/get-user").get(getUsersWithAvatar);
router.route("/get-user/:userId").get(verifyJWT, getUser);


export default router;