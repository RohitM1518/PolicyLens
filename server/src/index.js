import {app} from './app.js'
import { configCloudinary } from './config/cloudinaryConfig.js';
import { configGemini } from './config/geminiConfig.js';
import connectDB from './database/connectDatabase.js'

const PORT = process.env.PORT || 3000;
configGemini()
configCloudinary()
connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);
    })
})
.catch((error)=>{
    console.log(`Error: ${error.message}`);
})