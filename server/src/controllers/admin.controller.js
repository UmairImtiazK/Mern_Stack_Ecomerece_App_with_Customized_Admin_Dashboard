import  { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { Admin } from '../models/admin.controller.js'
import { uploadOnCloudinary } from '../utils/Cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await Admin.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerAdmin = asyncHandler(async(req,res)=>{
     // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    const {username,email,password} = req.body
    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    

    const existingUser = await Admin.findOne({
        $or: [{ username }, { email }]
    });
    
    if (existingUser) {
        throw new ApiError(400, "User with this Name and Email already exists.");
    }
    

    const avatarLocalPath = req.files?.avatar[0]?.path;
    if(!avatarLocalPath)
        return new ApiError(400,"Avtar file is required.")

    
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar){
        throw new ApiError(400,"Avtar file is required.")
    }
    
    const user = await Admin.create({
        username,
        email,
        avatar: avatar.url || "",
        password
    })

    const createdUser = await Admin.findById(user._id).select("-password -refreshToken");


    if(!createdUser)
        return new ApiError(400,"Something went wrong while registering the user.")

    return res.status(200).json(
        new ApiResponse(200,createdUser,"User registered sucessfully.")
    )
})


const loginAdmin = asyncHandler(async(req,res)=>{
    // req body -> data
    // username
    //find the user
    //password check
    //access and referesh token
    //send cookie
    
    console.log("user naem password:");
    const {username,password} = req.body;
    if (!username && !password)
        return new ApiError(400,"User is required.")
    const admin = await Admin.findOne({
        $or: [{ username }]
    });
    console.log("user:",admin);
    if (!admin)
        return new ApiError(400,"User with this name not exists.")

    const isPassword = await admin.isPasswordCorrect(password);
    if(!isPassword)
        return new ApiError(400,"Invalid Password is entered.")

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(admin._id)
    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInAdmin, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})

const logoutAdmin = asyncHandler(async(req,res)=>{
    //check user existence
    //then clear the cookie
    // and logout the user

    await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

export {
    registerAdmin,
    loginAdmin,
    logoutAdmin
}