import "./ChatWindow.css";
import Chat from "./Chat";
import {MyContext} from "./MyContext.jsx";
import {useContext,useState,useEffect} from "react";
import {ScaleLoader} from "react-spinners";
import { useAuth } from "./context/AuthContext";

function ChatWindow(){
    const {prompt, setPrompt, setNewChat ,reply, setReply, currThreadId, preChats,setPrevChats} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen,setIsOpen]= useState(false);

    const { user } = useAuth();

    const handleLogout = async() => {
        try {
            await fetch(
                `${process.env.BACKEND_URL}auth/logout`,
                {
                    credentials: "include"
                }
            );
            window.location.reload();
        } catch(err) {
            console.log(err);
        }
    };

    const getReply = async ()=>{
        setLoading(true);
        setNewChat(false);
        console.log("Prompt:", prompt, "threadId", currThreadId);
        const options = {
            method :"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                message:prompt,
                threadId: currThreadId
            })
        };

        try{
            const response = await fetch(
                `${process.env.BACKEND_URL}api/chat`,
                {
                    method: "POST",
            
                    headers: {
                        "Content-Type": "application/json"
                    },
            
                    credentials: "include",
            
                    body: JSON.stringify({
                        message:prompt,
                        threadId: currThreadId
                    })
                }
            );
            const res = await response.json();
            console.log(res);
            setReply(res.reply);

        }catch(err){
            console.log(err);
        }
        setLoading(true);
    }

    //append new chat to prechats
    useEffect(()=>{
        if(prompt && reply){
            setPrevChats(prevChats =>(
                [...prevChats,{
                    role:"user",
                    content:prompt
                },{
                    role:"assistant",
                    content:reply
                }]
            ))
        }
        setPrompt("");
    },[reply]);

    const handleProfileClick = ()=>{
        setIsOpen(!isOpen);
    }


    return(
        <div className="chatWindow">
            <div className="navbar">
                <span id="chatbot-name">Jeni</span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem"><i class="fa-solid fa-gear"></i>Settings</div>
                    <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan</div>  
                    <div className="dropDownItem" onClick={handleLogout}><i class="fa-solid fa-arrow-right-from-bracket"></i>Logout  </div>
                </div>
            }

            <Chat></Chat>
            <ScaleLoader color="#fff" loading={loading}>

            </ScaleLoader>
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask Anything" 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e)=> e.key === 'Enter' ? getReply():''}>
                    </input>
                    <div id="submit" onClick={getReply}>
                    <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    Jarvis can make mistakes
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;  