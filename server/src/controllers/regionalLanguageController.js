import { model } from "../config/geminiConfig.js";
import { RegionalLanguage } from "../models/regionalLanguageModel.js";
import APIError from "../utils/apiError.js";
import APIResponse from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import { generateTitle, getResponse } from "./geminiController.js";

const convertToRegionalLanguage = asyncHandler(async (req, res) => {
    const { originalText, language } = req.body;
    const title = await generateTitle(originalText);
    const translatedText = await getResponse(originalText, language);
    if(!translatedText){
        throw new APIError("Failed to translate text", 400);
    }
    const regionalLanguage = await RegionalLanguage.create({
        originalText,
        translatedText,
        language,
        title,
        owner: req.user._id
    });
    return res.status(201).json( new APIResponse(201, { data: regionalLanguage }, "Text translated successfully"));
});

const getUserTranslations = asyncHandler(async (req, res) => {
    const user = req.user;
    const translations = await RegionalLanguage.find({ owner: user._id });
    return res.status(200).json(new APIResponse(200, { data: translations }, "User translations fetched successfully"));
})

const deleteRegionalLanguage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if(!id){
        throw new APIError(400, "Id is required");
    }
    const regionalLanguage = await RegionalLanguage.findByIdAndDelete(id);
    return res.status(200).json(new APIResponse(200, { data: regionalLanguage }, "Regional language deleted successfully"));
})
export { convertToRegionalLanguage, getUserTranslations,deleteRegionalLanguage };