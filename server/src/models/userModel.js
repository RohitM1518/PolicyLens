import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
        // required: true,
        min: 0
    },
    maritalStatus: {
        type: String,
        enum: ['Single', 'Married', 'Divorced', 'Widowed'],
        // required: true
    },
    occupation: {
        type: String,
        // required: true,
        trim: true
    },
    location: {
        type: String,
        // required: true,
        trim: true
    },
    monthlySalary: {
        type: Number,
        // required: true,
        min: 0
    },
    annualIncome: {
        type: Number,
        // required: true,
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
    lifestyleHabits: {
        type: [String],
        enum: ['Smoking', 'Alcohol', 'None'],
        default: []
    },
    healthStatus: {
        type: String,
        enum: ['Excellent', 'Good', 'Fair', 'Poor'],
        // required: true
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
        // required: true,
        trim: true
    },
    coverageAmountPreference: {
        type: Number,
        // required: true,
        min: 0
    },
    willingnessToPayPremiums: {
        type: String,
        enum: ['Monthly', 'Quarterly', 'Annually'],
        // required: true
    },
});

// Hash password before saving
// bcrypt
userSchema.pre('save',async function (next) {
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// Method used to compare hashed password and plain text password
userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password, this.password);
}

// Method used to generate refresh token using user data and key
userSchema.methods.generateRefreshToken=async function () {
    const refreshToken = jwt.sign({_id: this._id}, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY});
    return refreshToken;
}

// Method used to generate access token using user data and key
userSchema.methods.generateAccessToken=async function () {
    const accessToken = jwt.sign({_id: this._id,name: this.name,email:this.email}, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY});
    return accessToken;
}

export const User = mongoose.model('User', userSchema);
