import { asyncHandler } from "../utils/asyncHandler.js";
import { Chat } from "../models/chatModel.js";
import { chatBot } from "./geminiController.js";
import { Message } from "../models/messageModel.js";
import mongoose from "mongoose";
import APIError from "../utils/apiError.js";
import APIResponse from "../utils/apiResponse.js";
import { createNewChat } from "./chatController.js";

const createMessage = asyncHandler(async (req, res) => {
    const { message } = req.body;
    let { chatid } = req.params;
    console.log(message);
    if (!message) {
        throw new APIError(400, "Message is required");
    }
    if(!chatid){
        chatid = await createNewChat(message)
    }
    const chat = await Chat.findById(chatid,req.user._id);
    if(!chat){
        throw new APIError(404, "Chat not found");
    }
    const newMessage = await Message.create({
        role: "user",
        message:message,
        chat: new mongoose.Types.ObjectId(chatid)
    });
    if(!newMessage){
        throw new APIError(500, "Message could not be created");
    }
    const responseMessage = await chatBot(message);
    console.log(responseMessage);
    const newBotMessage = await Message.create({
        role: "model",
        message: responseMessage,
        chat: new mongoose.Types.ObjectId(chatid)
    });
    if(!newBotMessage){
        throw new APIError(500, "Message could not be created");
    }
    return res.status(200).json(new APIResponse(200, { newMessage, newBotMessage }, "Message created successfully"));
})

export{
    createMessage
}