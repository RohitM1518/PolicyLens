import { asyncHandler } from "../utils/asyncHandler.js";
import { Chat } from "../models/chatModel.js";
import { chatBot, generateSuggestedMessages } from "./geminiController.js";
import { Message } from "../models/messageModel.js";
import mongoose from "mongoose";
import APIError from "../utils/apiError.js";
import APIResponse from "../utils/apiResponse.js";
import { createNewChat } from "./chatController.js";
import ingestData from '../rag/ingestData.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { model } from "../config/geminiConfig.js";
const chatMessageCommonAggregation = () => {
    return [
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "owner",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            email: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                owner: { $first: "$owner" },
            },
        },
    ];
};

const getLastFewMessages = async (userid) => {
    const messages = await Message.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userid)
            }
        },
        {
            $sort: {
                createdAt: -1 // Sort in descending order (most recent first)
            }
        },
        ...chatMessageCommonAggregation(),
        {
            $limit: 10 // Limit the result to the last 10 messages
        },
        {
            $sort: {
                createdAt: 1 // Sort back in ascending order (oldest to newest) for correct order of messages
            }
        }
    ])

    return messages;
}

const createMessage = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const attachedFile = req.files?.attachedFile;
    let attachedFileLocalpath = null;
    let attachedFileURL;
    // console.log(attachedFile);
    const user = req.user;
    if (attachedFile) {
        attachedFileLocalpath = req.files?.attachedFile[0]?.path
        if (!attachedFileLocalpath) {
            throw new APIError(400, "Attached File is required");
        }
        attachedFileURL = await uploadOnCloudinary(attachedFileLocalpath);
        console.log("File uploaded successfully")
        if (!attachedFileURL) {
            throw new APIError(500, "Failed to upload Attached File");
        }
    }
    const accessToken = req?.accessToken;
    console.log(accessToken);
    let { chatid } = req.params;
    // console.log(message);
    if (!message) {
        throw new APIError(400, "Message is required");
    }
    if (!chatid) {
        chatid = await createNewChat(message, req.user._id);
    }
    const chat = await Chat.findById(chatid);
    if (!chat) {
        throw new APIError(404, "Chat not found");
    }
    const newMessage = await Message.create({
        role: "user",
        message: message,
        chat: new mongoose.Types.ObjectId(chatid),
        attachedFile: attachedFileURL?.url,
        attachedFileName: req?.body?.fileName,
        user: new mongoose.Types.ObjectId(req.user._id)
    });
    console.log("New message is created")

    if (!newMessage) {
        throw new APIError(500, "Message could not be created");
    }
    //TODO: Injest the data using the url
    if (attachedFileURL) {
        await ingestData(attachedFileURL.url, chatid, newMessage._id, req.user._id);
    }
    console.log("File is injested successfully")
    chat.lastMessage = newMessage.message;
    await chat.save();

    const responseMessage = await chatBot(message, newMessage._id, chatid, accessToken, user);
    // console.log(responseMessage);
    const newBotMessage = await Message.create({
        role: "model",
        message: responseMessage,
        chat: new mongoose.Types.ObjectId(chatid)
    });
    if (!newBotMessage) {
        throw new APIError(500, "Message could not be created");
    }
    return res.status(200).json(new APIResponse(200, { chat, newMessage, newBotMessage }, "Message created successfully"));
})

const getAllMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId)
    if (!chat) {
        throw new APIError(400, "No Such Chat found")
    }
    if (chat?.participants?.indexOf(req.user._id) === -1) {
        throw new APIError(401, "User is not part of the group")
    }
    const messages = await Message.aggregate([
        {
            $match: {
                chat: new mongoose.Types.ObjectId(chatId)
            }
        },
        {
            $sort: {
                createdAt: 1
            }
        },
        ...chatMessageCommonAggregation()
    ])


    return res
        .status(200)
        .json(new APIResponse(200, messages, "Messages found successfully"))
})

const getSuggestedMessages = asyncHandler(async (req, res) => {
    console.log(req.user._id);
    const messages = await getLastFewMessages(req.user._id);
    const result = await generateSuggestedMessages(messages, req.user);
    return res
        .status(200)
        .json(new APIResponse(200, result, "Messages found successfully"))
})


export {
    createMessage,
    getAllMessages,
    getLastFewMessages,
    getSuggestedMessages
}