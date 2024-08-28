const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    uId: {
        type: Number,
        required: true,
        unique: true,
    },
    avatar: {
        type: String, // This will be a URL from Cloudinary
        // required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email uniqueness
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    otp: {
        type: Number,
        default: null,
    },
    otpExpiry: {
        type: Date,
        default: null,
    }
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);

module.exports = { Patient };
