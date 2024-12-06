import mongoose from "mongoose";

const regionalLanguageSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        // required:true  TODO: Think on this weather only logged in user can create regional language or not
    },
    originalText:{
        type:String,
        required:true,
    },
    translatedText:{
        type:String,
        required:true,
    },
    language:{
        type:String,
        required:true
    }
},{timestamps:true})

export const RegionalLanguage = mongoose.model("RegionalLanguage",regionalLanguageSchema)