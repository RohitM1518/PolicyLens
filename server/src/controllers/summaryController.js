import { Summary } from "../models/summaryModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import APIResponse from "../utils/apiResponse.js";
import APIError from "../utils/apiError.js";
import { generateSummary, generateTitle, getResponse } from "./geminiController.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from 'fs';
import { console } from "inspector";
import { RegionalLanguage } from "../models/regionalLanguageModel.js";

const createSummary = asyncHandler(async (req, res) => {
    const PolicyPdf= req.files?.PolicyPdf;
    let PolicyPdfLocalpath = null;
    console.log(PolicyPdfLocalpath);
    if(PolicyPdf){
        PolicyPdfLocalpath = req.files?.PolicyPdf[0]?.path
    }
    if(!PolicyPdfLocalpath){
        throw new APIError(400, "Policy Pdf is required");
    }
    const PolicyPdfURL = await uploadOnCloudinary(PolicyPdfLocalpath);
    if(!PolicyPdfURL){
        throw new APIError(500, "Failed to upload Policy Pdf");
    }

    //This will be set from multer middleware
    const fileName = req.body.fileName;

    const summarizedText = await generateSummary(fileName);
    const title = await generateTitle(summarizedText);

    const summary = await Summary.create({
        title,
        PolicyPdf: PolicyPdfURL.url,
        summarizedText,
        owner: req.user._id
    });
    console.log(summary);
    if(!summary){
        throw new APIError(500, "Summary could not be created");
    }
    // fs.unlinkSync(PolicyPdfLocalpath);
    return res.status(201).json(new APIResponse(201, {summary}, "Summary created successfully"));

});

const getAllSummaries = asyncHandler(async(req,res)=>{
    const summaries = await Summary.find({owner:req.user._id}).populate('translatedText');
    return res.status(200).json(new APIResponse(200, {summaries}, "All summaries fetched successfully"));
})

const translateSummary = asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const {language}=req.body;  
    const summary = await Summary.findById(id);
    if(!summary){
        throw new APIError(404, "Summary not found");
    }
    if(summary.translatedText){
        await RegionalLanguage.findByIdAndDelete(summary.translatedText._id);
    }
    const translatedText = await getResponse(summary.summarizedText, language);
    if(!translatedText){
        throw new APIError("Failed to translate text", 400);
    }
    const regionalLanguageTitle = await generateTitle(summary.summarizedText);
    const regionalLanguage = await RegionalLanguage.create({
        originalText:summary.summarizedText,
        translatedText,
        language,
        title:regionalLanguageTitle,
        owner: req.user._id
    });
    if(!regionalLanguage){
        throw new APIError(500, "Failed to create regional language");
    }
    summary.translatedText = regionalLanguage._id;
    await summary.save();

    //TODO: Optimise this later
    const resSummary = await Summary.findById(id).populate('translatedText');
    
    return res.status(200).json(new APIResponse(200, {summary:resSummary}, "Summary translated successfully"));
})


const deleteSummary = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if(!id){
        throw new APIError(400, "Id is required");
    }
    const summary = await Summary.findByIdAndDelete(id);
    if(summary.translatedText){
        await RegionalLanguage.findById(summary.translatedText._id).deleteOne();
    }
    return res.status(200).json(new APIResponse(200, { data: summary }, "Summary deleted successfully"));
})

export{
    createSummary,
    getAllSummaries,
    translateSummary,
    deleteSummary
}