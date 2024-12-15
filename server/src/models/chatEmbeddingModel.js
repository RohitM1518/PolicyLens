import mongoose from "mongoose";

const chatEmbeddingsSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    chat:{
        type: mongoose.Schema.ObjectId,
        ref:"Chat"
    },
    message:{
        type: mongoose.Schema.ObjectId,
        ref:"Message"
    },
    attachedFile:{
        type:String,
    },
    document:{
        type: Object,
    },
    embedding:{
        type: Array,
    }
},{ timestamps: true });

export const ChatEmbedding = mongoose.model("ChatEmbedding", chatEmbeddingsSchema);