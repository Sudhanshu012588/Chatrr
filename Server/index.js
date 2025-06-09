import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import connectDB from "./DB/DBconfig.js"
import userRouter from "./Routes/UserRoutes.js"

const app = express();
dotenv.config({
    path:'./.env'
})
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));
app.use(express.json());
app.use(express.static('public'))	
app.use(express.urlencoded({ extended: true }))	
app.use(express.static('public'))	
app.use(cookieParser())	
const PORT = process.env.PORT || 8000
connectDB()

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST"]
    }
});

app.use('/user',userRouter)
httpServer.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})