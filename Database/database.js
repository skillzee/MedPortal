const mongoose = require("mongoose")

const dbConnect = () =>{
    mongoose.connect(process.env.MONGO_URI,{
    dbName: process.env.DB_NAME,
}).then((c)=>{
    console.log(`Database connected on ${c.connection.host}`);
}).catch((e)=>{
    console.log(e);
})
}


module.exports = {dbConnect}