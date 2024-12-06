import { model } from "../config/geminiConfig.js";
import { Chat } from "../models/chatModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import APIResponse from "../utils/apiResponse.js";
import APIError from "../utils/apiError.js";
import mongoose from "mongoose";
import { Message } from "../models/messageModel.js";
import { generateTitle } from "./geminiController.js";

const deleteCascadeChatMessage = async (chatId) => {

    //This is for deleting the attachments from the local storage

    // const messages = await Message.find({
    //     chat: new mongoose.Types.ObjectId(chatId)
    // })
    // let attachments = []

    // attachments = attachments.concat(
    //     ...messages.map((message) => {
    //         return message.attachments
    //     })
    // )

    // attachments.forEach((attachment) => {
    //     removeLocalFile(attachment.localPath)
    // })

    await Message.deleteMany({
        chat: new mongoose.Types.ObjectId(chatId)
    })

}

const createNewChat =async (prompt,userid) => {

    const title = await generateTitle(prompt);
    const chat = await Chat.create(
        {
            title: title,
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
    deleteCascadeChatMessage(id);
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
    // console.log("HI "+req.user._id)
    const chats = await Chat.find({owner: new mongoose.Types.ObjectId(req.user._id)}).sort({createdAt: -1});
    return res.status(200).json(new APIResponse(200, { chats }, "Chats retrieved successfully"));
})


export{
    createNewChat,
    deleteChat,
    getChat,
    getUserChats
}