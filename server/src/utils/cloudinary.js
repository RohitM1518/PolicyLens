import fs from 'fs' //This is the file system from the node js
import { cloudinary } from '../config/cloudinaryConfig.js';
//We get localFilePath from multer middleware
const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null;
        //upload the file on cloudinary
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto" //detects on its own whether it is pdf,image etc
        })
       // console.log("File is uploaded on cloudinary",response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) 
        console.log("Error in uploading file on cloudinary",error);
        return null;
    }
}


export {uploadOnCloudinary}