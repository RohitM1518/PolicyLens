import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleAIFileManager } from "@google/generative-ai/server";

let model;
let fileManager;
const configGemini =()=>{
fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
}

export {model,configGemini,fileManager}