const express = require("express");
const {registerPatient, sendOtp, verifyOtp} = require("../controllers/patient.controller.js")


const router = express.Router();

router.route("/signup").post(registerPatient);
router.route("/sendOtp").post(sendOtp);
router.route("/verifyOtp").post(verifyOtp);

module.exports = router;