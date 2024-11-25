// src/models/insuranceModel.js
import mongoose from 'mongoose';

const insuranceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Life Insurance', 'Health Insurance', 'Motor Insurance', 'Home Insurance', 'Travel Insurance']
    },
    premium: {
        type: Number,
        required: true,
        min: 0
    },
    frequency: {
        type: String,
        required: true,
        enum: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly']
    },
    renewalDate: {
        type: Date,
        required: true
    },
    sumInsured: {
        type: Number,
        required: true,
        min: 0
    },
    reminder: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const Insurance = mongoose.model('Insurance', insuranceSchema);
