import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
      role: {
        type: String,
        enum: ['user', 'model'],
        required: true
      },
      message: {
        type: String,
        required: true
      },
      attachedFile: {
        type: String
      },
      attachedFileName: {
        type: String
      },
      chat: {
        type: mongoose.Schema.ObjectId,
        ref: "Chat",
        required: true
      },
      // Conditionally add userId when role is 'user'
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: function() {
          return this.role === 'user';  // This ensures the user field is only required if the role is 'user'
        },
        validate: {
          validator: function(value) {
            // If the role is 'user', ensure that the value is a valid User ObjectId
            if (this.role === 'user' && !value) {
              throw new Error('User ID is required when role is "user"');
            }
            return true;
          },
          message: 'Invalid user ID'
        }
      }
    },
    { timestamps: true }
  );
  

export const Message = mongoose.model("Message", messageSchema);