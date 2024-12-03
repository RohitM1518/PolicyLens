import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role:{
        type: String,
        enum: ['user', 'model'],
        required: true
    },
    message:{
        type: String,
        required: true
    },
    chat:{
        type: mongoose.Schema.ObjectId,
        ref:"Chat"
    }
},{ timestamps: true });

export const Message = mongoose.model("Message", messageSchema);