import { GoogleGenerativeAI } from '@google/generative-ai'

let model;
const configGemini =()=>{
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
}

export {model,configGemini}