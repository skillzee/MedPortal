const app = require("./app.js").app
const dbConnect = require("./Database/database.js").dbConnect


const port = process.env.PORT || 3000



dbConnect()
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})