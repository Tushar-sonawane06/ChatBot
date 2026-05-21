import express from 'express';
import "dotenv/config";
import cors from 'cors';
import mongoose from 'mongoose';
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import chatRoutes from "./routes/chat.js";
import "./config/passport.js";
import authRoutes from "./routes/auth.js";

const app = express();
const port= 8000;

app.set("trust proxy", 1);

app.use(express.json());
app.use(cors({
    origin: "https://jeniai.tushar-sonawane.xyz",
    credentials: true
}));

app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: "none"
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", chatRoutes);
app.use("/auth", authRoutes);

app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
    connectDb();
})

const connectDb = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");
    }catch(err){
        console.log("Failed to connect DB", err);
    }
}

// app.post("/test",async (req,res)=>{
//     const options = {
//         method : "POST",
//         headers:{
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "openai/gpt-oss-120b",
//             messages:[{
//                 role: "user",
//                 content: req.body.message
//             }]
//         })
//     }
//     try{
//         const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
//         const data = await response.json();
//         // console.log(data.choices[0].message.content);
//         res.send(data.choices[0].message.content);
//     }catch(err){
//         console.log(err);
//     }
// });