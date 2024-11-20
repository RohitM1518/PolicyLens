
import { User } from "../models/userModel";
export const verifyUser = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization").replace("Bearer ", "");
        if(!token){
            throw new APIError(401, "Unauthorized request");
        }
        const decodedData = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedData?._id).select("-password -refreshToken");
        if(!user){
            throw new APIError(401, "Invalid access token");
        }
        req.user = user;
        next()
    } catch (error) {
        throw new APIError(401, error?.message || "Unauthorized request");
    }
});