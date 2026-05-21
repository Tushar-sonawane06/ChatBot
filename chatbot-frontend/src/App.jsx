import './App.css'
import SideBar from './sideBar.jsx';
import ChatWindow from './ChatWindow.jsx';
import {MyContext} from './MyContext.jsx';
import {useState} from 'react';
import {v1 as uuidv1} from 'uuid';
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";

function App() {
  const [prompt,setPrompt] = useState("");
  const [reply,setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats]= useState([]); //store recent chats
  const [newChat,setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const { user, loading } = useAuth();

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat,setNewChat,
    prevChats,setPrevChats,
    allThreads, setAllThreads
  };

  if(loading) {
    return <h1>Loading...</h1>;
  }

  return (
    
    user ? (

      <div className="app">

          <MyContext.Provider value={providerValues}>

              <SideBar />
              <ChatWindow />

          </MyContext.Provider>

      </div>

  ) : (

      <Login />

    )
  )
}

export default App
