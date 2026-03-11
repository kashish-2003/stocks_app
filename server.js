require("dotenv").config()

const express=require("express")

const bodyParser=require("body-parser")

const authRoutes=require("./routes/authRoutes")

const app=express()

app.use(bodyParser.json())

app.use("/api",authRoutes)

app.listen(5000,()=>{

console.log("Server running on port 5000")

})