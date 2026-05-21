import "./sideBar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function SideBar() {

    const {
        allThreads,
        setAllThreads,
        setPrevChats,
        setCurrThreadId,
        currThreadId,
        setPrompt,
        setNewChat,
        setReply
    } = useContext(MyContext);

    const [openSidebar, setOpenSidebar] = useState(false);

    const getAllThreads = async () => {

        try {

            const response = await fetch(
                "https://jeniai-backend.tushar-sonawane.xyz/api/thread",
                {
                    credentials: "include"
                }
            );

            const res = await response.json();

            const filteredData = res.map(thread => ({
                threadId: thread.threadId,
                title: thread.title
            }));

            setAllThreads(filteredData);

        } catch (err) {
            console.log(err);
        }

    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {

        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);

        setOpenSidebar(false);

    };

    const changeThread = async (newthreadId) => {

        setCurrThreadId(newthreadId);

        try {

            const response = await fetch(
                `https://jeniai-backend.tushar-sonawane.xyz/api/thread/${newthreadId}`,
                {
                    credentials: "include"
                }
            );

            const res = await response.json();

            setPrevChats(res);
            setNewChat(false);
            setReply(null);

            setOpenSidebar(false);

        } catch (err) {
            console.log(err);
        }

    };

    const deleteThread = async (threadId) => {

        try {

            await fetch(
                `https://jeniai-backend.tushar-sonawane.xyz/api/thread/${threadId}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            setAllThreads(prev =>
                prev.filter(thread => thread.threadId !== threadId)
            );

            if (threadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {
            console.log(err);
        }

    };

    return (

        <>

            {/* MOBILE MENU BUTTON */}
            <div
                className="mobile-menu-btn"
                onClick={() => setOpenSidebar(true)}
            >
                <i className="fa-solid fa-bars"></i>
            </div>

            {/* OVERLAY */}
            <div
                className={`sidebar-overlay ${openSidebar ? "show-overlay" : ""}`}
                onClick={() => setOpenSidebar(false)}
            ></div>

            <section
                className={`sideBar ${openSidebar ? "show-sidebar" : ""}`}
            >

                {/* TOP SECTION */}
                <div className="sidebar-top">

                    <div className="sidebar-header">

                        <div className="logo-section">

                            <div className="logo-text">
                                <h2>Jeni</h2>
                                <p>AI Assistant</p>
                            </div>

                        </div>

                        <i
                            className="fa-solid fa-xmark close-btn"
                            onClick={() => setOpenSidebar(false)}
                        ></i>

                    </div>

                    {/* NEW CHAT BUTTON */}
                    <button
                        className="new-chat-btn"
                        onClick={() => createNewChat()}
                    >

                        <div className="new-chat-left">
                            <i className="fa-solid fa-plus"></i>
                            <span>New Chat</span>
                        </div>

                        <i className="fa-solid fa-pen-to-square"></i>

                    </button>

                    {/* HISTORY */}
                    <div className="history-container">

                        <p className="history-title">
                            Recent Chats
                        </p>

                        <ul className="history">

                            {
                                allThreads?.map((thread, idx) => (

                                    <li
                                        key={idx}
                                        onClick={() =>
                                            changeThread(thread.threadId)
                                        }
                                        className={
                                            thread.threadId === currThreadId
                                                ? "highlighted"
                                                : ""
                                        }
                                    >

                                        <div className="thread-content">

                                            <i className="fa-regular fa-message"></i>

                                            <span>
                                                {thread.title}
                                            </span>

                                        </div>

                                        <i
                                            className="fa-solid fa-trash delete-icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteThread(thread.threadId);
                                            }}
                                        ></i>

                                    </li>

                                ))
                            }

                        </ul>

                    </div>

                </div>

            </section>

        </>

    );

}

export default SideBar;