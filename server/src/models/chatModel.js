import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    lastMessage:{
        type:String,
        default:""
    }
},{ timestamps:true})

export const Chat = mongoose.model("Chat",chatSchema)