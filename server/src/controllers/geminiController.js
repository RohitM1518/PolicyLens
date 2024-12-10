import { asyncHandler } from "../utils/asyncHandler.js";
import APIError from "../utils/apiError.js";
import APIResponse from "../utils/apiResponse.js";
import { model, fileManager } from "../config/geminiConfig.js";
import fs from 'fs' //This is the file system from the node js
import axios from 'axios';


const getResponse = async (prompt,language) => {
    // console.log(prompt);
    const newPrompt = `${prompt}+\nConvert above into ${language} and do not give any extra information`;
    try {
        const result = await model.generateContent(newPrompt);
        console.log(result.response.text());
        return result.response.text();
    } catch (error) {
        console.log(error);
    }
}

const generateTitle = async(prompt)=>{
    try {
        const newPrompt = prompt + " Generate a exact one title for this chat without any extra information and maximum of 5 words";
        const title = await model.generateContent(newPrompt);
        return title.response.text();
    } catch (error) {
        console.log(error)
    }
}

const generateSummary = async (fileName) => {
    console.log(fileName)
    const uploadResponse = await fileManager.uploadFile(`./public/temp/${fileName}`, {
        mimeType: "application/pdf",
        displayName: "Gemini 1.5 PDF",
    });

    // View the response.
    console.log(
        `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`,
    );
    //TODO: Check instead of cloudinary can we use this

    // Generate content using text and the URI reference for the uploaded file.
    const result = await model.generateContent([
        {
            fileData: {
                mimeType: uploadResponse.file.mimeType,
                fileUri: uploadResponse.file.uri,
            },
        },
        { text: "Can you summarize this document as a bulleted list?" },
    ]);

    // Output the generated text to the console
    console.log(result.response.text());
    fs.unlinkSync(`./public/temp/${fileName}`);
    return result.response.text();
}

const chatBot = async (prompt,chatId,accessToken) => {
    // const { prompt } = req.body;
    const messages = await axios.get(`${process.env.BACKEND_URL}/chat/message/get/${chatId}`,{
        withCredentials:true,
        headers:{
            'Authorization':`Bearer ${accessToken}`
        }
    });
    // console.log(messages.data.data);
    const history = messages.data.data.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.message.trim() }]
    }));

    const chat = model.startChat({
        history: history
    });
    let result = await chat.sendMessage(prompt);
    return result.response.text();
    // return res.status(200).json(new APIResponse(200, { data: result.response.text() }, "Response generated successfully"));
}
export {
    getResponse,
    generateSummary,
    chatBot,
    generateTitle
}