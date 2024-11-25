// src/controllers/insuranceController.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { Insurance } from "../models/insuranceModel.js";
import APIError from "../utils/apiError.js";
import APIResponse from "../utils/apiResponse.js";

// Create a new insurance
const createInsurance = asyncHandler(async (req, res) => {
    const { type, premium, frequency, renewalDate, sumInsured, reminder } = req.body;

    if (!type || !premium || !frequency || !renewalDate || !sumInsured) {
        throw new APIError(400, "All fields are required");
    }

    const insurance = await Insurance.create({
        userId: req.user._id,
        type,
        premium,
        frequency,
        renewalDate,
        sumInsured,
        reminder: reminder || false
    });

    return res.status(201).json(
        new APIResponse(201, insurance, "Insurance created successfully")
    );
});

// Get all insurances for a user
const getAllInsurances = asyncHandler(async (req, res) => {
    const insurances = await Insurance.find({ userId: req.user._id });
    return res.status(200).json(
        new APIResponse(200, insurances, "Insurances retrieved successfully")
    );
});

// Get insurance by ID
const getInsuranceById = asyncHandler(async (req, res) => {
    const insurance = await Insurance.findOne({
        _id: req.params.id,
        userId: req.user._id
    });

    if (!insurance) {
        throw new APIError(404, "Insurance not found");
    }

    return res.status(200).json(
        new APIResponse(200, insurance, "Insurance retrieved successfully")
    );
});

// Update insurance
const updateInsurance = asyncHandler(async (req, res) => {
    const { type, premium, frequency, renewalDate, sumInsured, reminder } = req.body;

    const insurance = await Insurance.findOneAndUpdate(
        {
            _id: req.params.id,
            userId: req.user._id
        },
        {
            $set: {
                type,
                premium,
                frequency,
                renewalDate,
                sumInsured,
                reminder
            }
        },
        { new: true }
    );

    if (!insurance) {
        throw new APIError(404, "Insurance not found");
    }

    return res.status(200).json(
        new APIResponse(200, insurance, "Insurance updated successfully")
    );
});

// Delete insurance
const deleteInsurance = asyncHandler(async (req, res) => {
    const insurance = await Insurance.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id
    });

    if (!insurance) {
        throw new APIError(404, "Insurance not found");
    }

    return res.status(200).json(
        new APIResponse(200, null, "Insurance deleted successfully")
    );
});

export {
    createInsurance,
    getAllInsurances,
    getInsuranceById,
    updateInsurance,
    deleteInsurance
};
