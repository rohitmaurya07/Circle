import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import "dotenv/config"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"
const app = express()
const PORT = process.env.PORT || 4000 

// Middlewares
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.json())
app.use(cookieParser)


// Routers
app.use('/api/v1/user',userRouter)
app.use('/api/v1/post',postRouter)


app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.listen(PORT,()=>{
    console.log("App is Listening on", PORT);
    
})