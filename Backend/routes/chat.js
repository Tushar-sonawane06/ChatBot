import express from 'express';
import Thread from '../models/thread.js';
import getGroqAPIResponse from '../utils/groq.js';
import isAuthenticated from "../middleware/authMiddleware.js";

const router = express.Router();

//test
router.post("/test",async(req,res)=>{
    try{
        const thread = new Thread({
            threadId:"xyz",
            title:"Test Thread",
        });
        
        const response = await thread.save();
        res.send(response);
    }catch(err){
        console.log(err);
        res.send(500).json({error:"Failed to create thread"});
    }
})

//get all threads
router.get("/thread", isAuthenticated, async(req,res)=>{

    try{

        const threads = await Thread.find({
            userId: req.user._id
        }).sort({updatedAt: -1});

        res.json(threads);

    }catch(err){

        console.log(err);

        res.status(500).json({
            error: "Failed to fetch threads"
        });

    }

});

//get info of thread
router.get("/thread/:threadId", isAuthenticated,async(req,res)=>{
    const {threadId} = req.params;
    
    try{
        const thread = await Thread.findOne({threadId, userId: req.user._id});
        if(!thread){
            return res.status(404).json({error:"Thread not found"});
        }
        res.json(thread.messages);
    }catch(err){
        console.log(err);
        res.send(500).json({error:"Failed to fetch thread"});
    }
})

//delete the therad
router.delete("/thread/:threadId", isAuthenticated, async(req,res)=>{
    const {threadId} = req.params;

    try{
        const deletedThread = await Thread.findOneAndDelete({threadId, userId: req.user._id});
    
        if(!deletedThread){
            res.status(404).json({error:"Thread not found"});
        }

        res.status(200).json({message:"Thread deleted successfully"});
    }catch(err){
        console.log(err);
        res.send(500).json({error:"Failed to delete thread"});
    }
})

//post of chat
//we need threadId, message and sender
router.post("/chat", isAuthenticated,async(req,res)=>{
    const {threadId,message} = req.body;
    
    if(!threadId || !message){
        return res.status(400).json({
            error: "threadId and message are required"
        });
    }

    try{
        let thread = await Thread.findOne({threadId, userId: req.user._id});

        if(!thread){
            //create new thread
            thread = new Thread({
                userId: req.user._id,
                threadId,
                title:message,
                messages:[{role:"user", content:message}]
            });
        }else{
            thread.messages.push({role:"user", content:message})
        }

        const assistentReply = await getGroqAPIResponse(message);
        
        thread.messages.push({role:"assistant", content:assistentReply})
        thread.updatedAt = new Date();
        await thread.save();
        res.json({reply:assistentReply});

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to process chat"});
    }
})

export default router;