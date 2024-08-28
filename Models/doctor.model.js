const mongoose = require("mongoose")

const doctorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    avatar:{
        type: String, //This will be a url from cloudinary
        // required: true,
    },
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String, 
        required: true,
        select: false
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
}, {timestamps: true})


const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports={Doctor}

