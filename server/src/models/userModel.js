import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        trim: true,
        index:true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase:true,
    },
    password:{
        type: String,
        required: true,
    },
    refreshToken:{
        type: String,
        default: ''
    },
    age: {
        type: Number,
        required: true,
        min: 0
    },
    maritalStatus: {
        type: String,
        enum: ['Single', 'Married', 'Divorced', 'Widowed'],
        required: true
    },
    occupation: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    monthlySalary: {
        type: Number,
        required: true,
        min: 0
    },
    annualIncome: {
        type: Number,
        required: true,
        min: 0
    },
    existingDebts: {
        type: Number,
        min: 0
    },
    familySize: {
        type: Number,
        min: 1
    },
    healthConditionsInFamily: {
        type: [String],
        default: []
    },
    lifestyleHabits: {
        type: [String],
        enum: ['Smoking', 'Alcohol', 'None'],
        default: []
    },
    existingInsurancePolicies: {
        type: [String],
        default: []
    },
    healthStatus: {
        type: String,
        enum: ['Excellent', 'Good', 'Fair', 'Poor'],
        required: true
    },
    vehicleOwnership: {
        type: Boolean,
        default: false
    },
    travelHabits: {
        type: String,
        enum: ['Domestic', 'International', 'None'],
        default: 'None'
    },
    primaryGoalForInsurance: {
        type: String,
        required: true,
        trim: true
    },
    coverageAmountPreference: {
        type: Number,
        required: true,
        min: 0
    },
    willingnessToPayPremiums: {
        type: String,
        enum: ['Monthly', 'Quarterly', 'Annually'],
        required: true
    },
    pastClaimsHistory: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save',async function (next) {
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateRefreshToken=async function () {
    const refreshToken = jwt.sign({_id: this._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY});
    return refreshToken;
}

userSchema.methods.generateAccessToken=async function () {
    const accessToken = jwt.sign({_id: this._id,name: this.name,email:this.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY});
    return accessToken;
}

export const User = mongoose.model('User', userSchema);
