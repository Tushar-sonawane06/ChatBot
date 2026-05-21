import "./Chat.css";
import {useContext, useState, useEffect} from "react";
import {MyContext} from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import remarkGfm from "remark-gfm";

function Chat(){
    const {newChat, prevChats, reply} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState("");

    useEffect(()=>{
        if(reply == null){
            setLatestReply(null);
            return;
        }

        if(!prevChats?.length) return;

        const content = reply.split(" ");  //individual words

        let idx = 0;
        const interval = setInterval(()=>{
            setLatestReply(content.slice(0,idx+1).join(" ")); //join the words to form the reply
        
            idx++;
            if(idx>= content.length) clearInterval(interval);
        },40);

        return()=> clearInterval(interval);
    },[prevChats, reply])

    return(
        <>
            {newChat && <h1 id="start">Start a New Chat</h1>}
            <div className="chats">
                {
                    prevChats?.slice(0,-1).map((chat,idx)=>
                        <div className={chat.role === "user"?"userDiv":"groqDiv"} key={idx}>
                            {
                                chat.role === "user" ? 
                                <p className="userMessage">{chat.content}</p> : 
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                            }
                        </div>
                    )
                }

                {
                    prevChats.length > 0 && (
                        <>
                            {
                                latestReply == null ?(
                                    <div className="groqDiv" key={"non-typing"}>
                                        <div className="gptMessage">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                                        </div>                                    
                                    </div>
                                ) : (
                                    <div className="groqDiv" key={"typing"}>
                                         <div className="gptMessage">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                        </div>
                                    </div>
                                )

                            }
                        </>
                    )
                }
            </div>
        </>
    )
}

export default Chat;