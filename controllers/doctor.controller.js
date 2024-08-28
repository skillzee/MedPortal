const {Doctor} = require("../Models/doctor.model.js")

const { ApiError } = require("../utils/apiError.js");
const bcrypt = require("bcrypt");


const registerDoctor = async (req, res) => {
    try {
        const { name, email, password, username, gender } = req.body;

        if ([name, username, email, password].some((field) => !field || field.trim() === "")) {
            throw new ApiError(400, "Name, username, email, and password are required fields");
        }

        const isEmailExists = await Doctor.findOne({ email });
        if (isEmailExists) {
            throw new ApiError(400, "Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const doctor = await Doctor.create({
            name,
            username,
            email,
            password: hashedPassword,
            gender,
            specialization,
        });

        return res.status(201).json({
            message: "Doctor registered successfully",
            doctor,
        });
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Something went wrong while registering the doctor");
    }
};