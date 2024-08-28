const { Patient } = require("../Models/patient.model.js");
const { ApiError } = require("../utils/apiError.js");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const otpExpiryTime = () => {
    return Date.now() + 10 * 60 * 1000; 
};

const registerPatient = async (req, res) => {
    try {
        const { name, email, password, username, gender } = req.body;

        if ([name, username, email, password].some((field) => !field || field.trim() === "")) {
            throw new ApiError(400, "Name, username, email, and password are required fields");
        }

        const existedPatient = await Patient.findOne({ $or: [{ username }, { email }] });
        if (existedPatient) {
            throw new ApiError(409, "User already exists");
        }

        const uId = Math.floor(100000 + Math.random() * 900000);
        const hashedPassword = await bcrypt.hash(password, 10);
        const patient = await Patient.create({
            name, username, email, password: hashedPassword, uId, gender
        });

        await sendMail(email);

        return res.status(201).json({ message: "Patient registered successfully", patient });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const sendMail = async (email) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD,
            },
        
        });

        const mailOptions = {
            from: {
                name: "Healthcare App",
                address: process.env.EMAIL_ID
            },
            to: email,
            subject: "Welcome to the Healthcare App!",
            text: "Thank you for registering. We are excited to have you with us!"
        };

        await transporter.sendMail(mailOptions);
        console.log("Welcome email sent successfully");

    } catch (error) {
        console.error("Error sending email:", error);
        throw new ApiError(500, "Error sending email");
    }
};

const sendOtp = async (req, res) => {
    try {
        const { uId } = req.body;
        if (!uId) {
            throw new ApiError(400, "UId is required");
        }

        const patient = await Patient.findOne({ uId });
        if (!patient) {
            throw new ApiError(404, "Patient not found");
        }

        const otp = generateOtp();
        const expiryTime = otpExpiryTime();


        patient.otp = otp;
        patient.otpExpiry = expiryTime;
        await patient.save();

        await sendOtpMail(patient.email, otp);

        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const sendOtpMail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: {
                name: "Healthcare App",
                address: process.env.EMAIL_ID
            },
            to: email,
            subject: "One-Time Password (OTP) for Healthcare App",
            text: `Your OTP is: ${otp}. It will expire in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);
        console.log("OTP email sent successfully");

    } catch (error) {
        console.error("Error sending OTP email:", error);
        throw new ApiError(500, "Error sending OTP email");
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            throw new ApiError(400, "Email and OTP are required");
        }

        const patient = await Patient.findOne({ email });
        if (!patient) {
            throw new ApiError(404, "Patient not found");
        }

        const currentTime = Date.now();
        if (patient.otp !== parseInt(otp) || patient.otpExpiry < currentTime) {
            throw new ApiError(401, "Invalid or expired OTP");
        }

        // Clear OTP and expiry after successful verification
        patient.otp = null;
        patient.otpExpiry = null;
        await patient.save();

        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { registerPatient, sendOtp, verifyOtp };
