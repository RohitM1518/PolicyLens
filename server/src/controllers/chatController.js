import { model } from "../config/geminiConfig.js";
import { Chat } from "../models/chatModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import APIResponse from "../utils/apiResponse.js";
import APIError from "../utils/apiError.js";
import mongoose from "mongoose";
const createNewChat =async (prompt,userid) => {
    const newPrompt = prompt + " Generate a exact one title for this chat without any extra information";
    const title = await model.generateContent(newPrompt);
    const chat = await Chat.create(
        {
            title: title.response.text(),
            owner: userid
        });
    if(!chat){
        throw new APIError(500, "Chat could not be created");
    }
    return chat._id;
}

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

const getChat = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if(!id){
        throw new APIError(400, "Chat id is required");
    }
    const chat = await Chat.findById(id);
    if(!chat){
        throw new APIError(404, "Chat not found");
    }
    return res.status(200).json(new APIResponse(200, { chat }, "Chat retrieved successfully"));
})

const getUserChats = asyncHandler(async (req, res) => {
    console.log("HI "+req.user._id)
    const chats = await Chat.find({owner: new mongoose.Types.ObjectId(req.user._id)});
    return res.status(200).json(new APIResponse(200, { chats }, "Chats retrieved successfully"));
})


export{
    createNewChat,
    deleteChat,
    getChat,
    getUserChats
}