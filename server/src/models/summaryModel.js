import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        // required:true  TODO: Think on this weather only logged in user can create summary or not
    },
    PolicyPdf:{
        type:String,
        required:true
    },
    summarizedText:{
        type:String,
        required:true
    },
    translatedText:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegionalLanguage"
    },
},{timestamps:true})

export const Summary = mongoose.model("Summary",summarySchema)