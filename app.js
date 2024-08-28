const express = require("express");
const config = require("dotenv").config;
const patientRouter = require("./Routes/patient.route.js");



const app = express();

module.exports = {app};


config({
    path: "Database/config.env"
})


app.use(express.json())

app.use("/api/auth/patient", patientRouter)

app.get("/", (req,res)=>{
    res.send("Server Working Properly")
})
