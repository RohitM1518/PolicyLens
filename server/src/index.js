import {app} from './app.js'
import connectDB from './db/connectDB.js'
import dotenv from 'dotenv'

dotenv.config({
    path:'./.env'
});

const PORT = process.env.PORT || 3000;
connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);
    })
})
.catch((error)=>{
    console.log(`Error: ${error.message}`);
})