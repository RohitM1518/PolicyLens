import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userModel.js";
import APIError from "../utils/apiError.js";
import APIResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

//Generate access token and refresh token and stores the refresh token in the database
const generateTokens=async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false}); //validateBeforeSave is set to false because we are not validating the password while saving the refresh token
        return {accessToken, refreshToken};
    } catch (error) {
        throw new APIError(500, "Internal Server Error");
    }
}

const cookiesOptions={
    httpOnly: true,
    secure: false
}

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const {name, email,password,age,maritalStatus,occupation,location,monthlySalary,annualIncome,existingDebts,familySize,healthConditionsInFamily,lifestyleHabits,existingInsurancePolicies,healthStatus,vehicleOwnership,travelHabits,primaryGoalForInsurance,coverageAmountPreference,willingnessToPayPremiums,pastClaimsHistory}=req.body;
    console.log(req.body);
    if(!name || !email || !password){
        throw new APIError(400, "Please provide all the required fields");
    }
    const existingUser = await User.findOne({email:email})
    if(existingUser){
        throw new APIError(400, "User already exists with this email");
    }
    const user = await User.create({
        name,
        email,
        password,
        age,
        maritalStatus,
        occupation,
        location,
        monthlySalary,
        annualIncome,
        existingDebts,
        familySize,
        healthConditionsInFamily,
        lifestyleHabits,
        existingInsurancePolicies,
        healthStatus,
        vehicleOwnership,
        travelHabits,
        primaryGoalForInsurance,
        coverageAmountPreference,
        willingnessToPayPremiums,
        pastClaimsHistory
    });
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser){
        throw new APIError(500, "Something went wronng while registering user");
    }
    
    const {accessToken, refreshToken} = await generateTokens(user._id);
    return res.status(201).cookie("refreshToken", refreshToken, cookiesOptions).json(new APIResponse(201, {user: createdUser, accessToken,refreshToken},"User registered successfully"));
});

// Login a user
const loginUser = asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        throw new APIError(400, "Please provide email and password");
    }
    const user = await User.findOne({email});
    if(!user){
        throw new APIError(401, "Invalid credentials");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new APIError(401, "Invalid credentials");
    }
    const {accessToken, refreshToken} = await generateTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    return res.status(200).cookie("refreshToken", refreshToken, cookiesOptions).cookie("accessToken",accessToken,cookiesOptions).json(new APIResponse(200, {user: loggedInUser, accessToken,refreshToken},"User logged in successfully"));
})

// Logout a user
const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id, {refreshToken: ''});
    res.clearCookie("refreshToken", cookiesOptions).clearCookie("accessToken", cookiesOptions).json(new APIResponse(200, null, "User logged out successfully"));
})

// Refresh the access token
const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken || incomingRefreshToken === "null") {
        throw new ApiError(401, "Unauthorized request")
    }
    try {
        const decodedData = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
        const user = await User.findById(decodedData._id);
        if(!user){
            throw new APIError(401, "Invalid refresh token");
        }
        if(incomingRefreshToken !== user.refreshToken){
            throw new APIError(401, "Invalid refresh token");
        }
        const {accessToken, refreshToken} = await generateTokens(user._id);
        return res.status(200).cookie("refreshToken", refreshToken, cookiesOptions).cookie("accessToken",accessToken,cookiesOptions).json(new APIResponse(200, {accessToken,refreshToken},"Access token refreshed successfully"));
    } catch (error) {
        throw new APIError(401, error?.message || "Invalid Refresh Token");
    }
});

// Change the password of the user
const changePassword = asyncHandler(async(req,res)=>{
    const {currentPassword, newPassword} = req.body;
    if(!currentPassword || !newPassword){
        throw new APIError(400, "Please provide current and new password");
    }
    const user = await User.findById(req.user._id);
    const isPasswordValid = await user.isPasswordCorrect(currentPassword);
    if(!isPasswordValid){
        throw new APIError(400, "Invalid current password");
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json(new APIResponse(200, null, "Password changed successfully"));
})

// Get the user profile
const getUserProfile = asyncHandler(async(req,res)=>{
    const user= await User.findById(req.user._id).select("-password -refreshToken");
    return res.status(200).json(new APIResponse(200, {user},"User profile retrieved successfully"));
})

// Update the user profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const updateData = {};

    // Destructure the fields from the request body
    const {
        name, age, maritalStatus, occupation, location, monthlySalary, annualIncome,
        existingDebts, familySize, healthConditionsInFamily, lifestyleHabits, existingInsurancePolicies,
        healthStatus, vehicleOwnership, travelHabits, primaryGoalForInsurance, coverageAmountPreference,
        willingnessToPayPremiums, pastClaimsHistory
    } = req.body;

    // Add fields to updateData only if they are provided in the request
    if (name) updateData.name = name;
    if (age) updateData.age = age;
    if (maritalStatus) updateData.maritalStatus = maritalStatus;
    if (occupation) updateData.occupation = occupation;
    if (location) updateData.location = location;
    if (monthlySalary) updateData.monthlySalary = monthlySalary;
    if (annualIncome) updateData.annualIncome = annualIncome;
    if (existingDebts) updateData.existingDebts = existingDebts;
    if (familySize) updateData.familySize = familySize;
    if (healthConditionsInFamily) updateData.healthConditionsInFamily = healthConditionsInFamily;
    if (lifestyleHabits) updateData.lifestyleHabits = lifestyleHabits;
    if (existingInsurancePolicies) updateData.existingInsurancePolicies = existingInsurancePolicies;
    if (healthStatus) updateData.healthStatus = healthStatus;
    if (vehicleOwnership) updateData.vehicleOwnership = vehicleOwnership;
    if (travelHabits) updateData.travelHabits = travelHabits;
    if (primaryGoalForInsurance) updateData.primaryGoalForInsurance = primaryGoalForInsurance;
    if (coverageAmountPreference) updateData.coverageAmountPreference = coverageAmountPreference;
    if (willingnessToPayPremiums) updateData.willingnessToPayPremiums = willingnessToPayPremiums;
    if (pastClaimsHistory) updateData.pastClaimsHistory = pastClaimsHistory;

    // Check if updateData is not empty
    if (Object.keys(updateData).length === 0) {
        throw new APIError(400, "Please provide at least one field to update");
    }

    // Find the user by ID and update the provided fields
    const userId = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true, context: 'query' }
    ).select("-password -refreshToken");

    if (!updatedUser) {
        throw new APIError(404, "User not found");
    }

    return res.status(200).json(new APIResponse(200, { user: updatedUser }, "User updated successfully"));
});

export{
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getUserProfile,
    updateUserProfile,
    changePassword
}