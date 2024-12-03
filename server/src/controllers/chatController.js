import { model } from "../config/geminiConfig.js";
import { Chat } from "../models/chatModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import APIResponse from "../utils/apiResponse.js";
import APIError from "../utils/apiError.js";

const createNewChat = asyncHandler(async (req, res) => {
    const { prompt } = req.body;
    const newPrompt = prompt + " Generate a title for this chat";
    const title = await model.generateContent(newPrompt);
    const chat = await Chat.create(
        {
            title: title.response.text(),
            owner: req.user._id
        });
    if(!chat){
        throw new APIError(500, "Chat could not be created");
    }
    return res.status(200).json(new APIResponse(200, { chat }, "Chat created successfully"));
})

const deleteChat = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if(!id){
        throw new APIError(400, "Chat id is required");
    }
    await Chat.findByIdAndDelete(
        {
            _id: id
        });
    
    return res.status(200).json(new APIResponse(200, {}, "Chat deleted successfully"));
})

export{
    createNewChat,
    deleteChat
}