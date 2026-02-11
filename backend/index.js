import express from "express"
import cors from "cors"
import "dotenv/config"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"
import reelRouter from "./routes/reel.routes.js"
import storyRouter from "./routes/story.routes.js"
import connectDB from "./db/connectDB.js"
const app = express()
const PORT = process.env.PORT || 4000 

const corsInstance = {
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET","POST","PUT"]
}

// Middlewares
app.use(cors(corsInstance))
app.use(bodyParser.urlencoded({extended: false}))
// app.use(bodyParser.json())
app.use(express.json())
app.use(cookieParser())


// Routers
app.use('/api/user',userRouter)
app.use('/api/post',postRouter)
app.use('/api/reel',reelRouter)
app.use('/api/story',storyRouter)


app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.listen(PORT,()=>{
    connectDB()
    console.log("App is Listening on", PORT);
    
})