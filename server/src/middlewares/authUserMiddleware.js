
import { User } from "../models/userModel.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import APIError from "../utils/apiError.js";
import jwt from "jsonwebtoken";

export const authUserMiddleware = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        // console.log("Token", token);
        if(!token){
            throw new APIError(401, "Unauthorized request");
        }
        const decodedData = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

        const user = await User.findById(decodedData?._id).select("-password -refreshToken");
        if(!user){
            throw new APIError(401, "Invalid access token");
        }
        req.user = user;
        req.accessToken = token;
        next()
    } catch (error) {
        throw new APIError(401, error?.message || "Unauthorized request");
    }
});