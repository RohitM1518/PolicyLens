import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleAIFileManager } from "@google/generative-ai/server";

let model;
let fileManager;
let genAI;
let chatbotModel;

//Model for chatbot
const configChatbotModel = () => {
    chatbotModel = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: "You are PolicyLens and You answer only related to insurance and its policies",
    });
    return chatbotModel;
}

//Model for regular purpose
const configGemini = () => {
    fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: "You are PolicyLens and You answer only related to insurance and its policies",
    });
    chatbotModel = configChatbotModel();
}

export { model, configGemini, fileManager, chatbotModel };