const express = require('express');
const cors = require('cors');
const { connection } = require("./db");
const {userRouter} =require("./routes/user.routes")
const {Managerrouter}= require("./routes/manager.routes")
const {Submissionrouter} =require("./routes/expenseSubmission.routes")
const { authenticateUser } = require("./middlewares/authMiddleware");

const app=express()
app.use(express.json())
app.use(cors());


app.use("/users",userRouter)
app.use("/submission",authenticateUser, Submissionrouter)
app.use("/manager",authenticateUser, Managerrouter)



app.listen(8080, async()=>{
    try {
        await connection
        console.log("server is running on port 8080")
        console.log("server is connected to DB")
    } catch (error) {
        console.log("error")
    }
})