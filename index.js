const express = require("express")
const { connection } = require("./config/db.js")
const { authenticate } = require("./middleware/authentication.middleware.js")
const { postRouter } = require("./routes/Post.routes.js")
const { userRouter } = require("./routes/User.routes.js")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(cors())
app.use("/users", userRouter)
app.use(authenticate)
app.use("/posts", postRouter)
app.listen(8080, async () => {
    try {
        await connection
        console.log("Connected to DB");
    } catch (error) {
        console.log(" Cannot connected to DB");
        console.log(error);
    }
    console.log("Running the server at port 8080");
})