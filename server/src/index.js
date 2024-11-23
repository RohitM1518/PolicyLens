import {app} from './app.js'
import { configGemini } from './config/geminiConfig.js';
import connectDB from './database/connectDatabase.js'
import dotenv from 'dotenv'

dotenv.config({
    path:'./.env'
});

const PORT = process.env.PORT || 3000;
configGemini()
connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);
    })
})
.catch((error)=>{
    console.log(`Error: ${error.message}`);
})