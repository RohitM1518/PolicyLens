import { asyncHandler } from "../utils/asyncHandler.js";
import APIError from "../utils/apiError.js";
import APIResponse from "../utils/apiResponse.js";
import { model } from "../config/geminiConfig.js";

const getResponse = asyncHandler (async(req,res) => {
    const {prompt}= req.body;
    // console.log(prompt);
    const newPrompt=prompt+"\nConvert above into Kannada and do not give any extra information";
    try {
        const result = await model.generateContent(newPrompt);
        const text=result?.data?.response?.candidates[0]?.content?.parts[0]?.text;
        return res.status(200).json(new APIResponse(200,{text},"Response generated successfully"));
    } catch (error) {
        throw new APIError(500, error.message);
    }
});

export{
    getResponse
}