import React, { useState, useEffect } from 'react'
import {Avatar, IconButton} from  "@material-ui/core"
import {AttachFile, MoreVert, SearchOutlined} from "@material-ui/icons"
import InsertEmoticonIcon  from "@material-ui/icons/InsertEmoticon"
import MicIcon from "@material-ui/icons/Mic"
import './Chat.css'
import {useParams} from "react-router-dom"
import db from './firebase'
import firebase from"firebase"
import userEvent from '@testing-library/user-event'
import { useStateValue } from './StateProvider'


function Chat() {
    const [seed, setSeed] = useState("")
    const [input, setInput] = useState ("")
    const [roomName, setroomName] = useState ("")
    const {roomId}= useParams()
    const [messages, setMessages] = useState ([])
    const [{user}, dispatch] = useStateValue([]) 

    useEffect(() =>{
        setSeed(Math.floor(Math.random()*500))
     }, [roomId])
   
    const sendMessage =(e) =>{
        e.preventDefault()
        console.log(input)
        
          

        db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .add({
            message: input,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setInput("")
    }

    useEffect(() => {
        if(roomId){
            db.collection('rooms').
            doc(roomId)
            .onSnapshot(snapshot =>(
                setroomName(snapshot.data().name)
            ))

            db.collection('rooms').doc(roomId)
            .collection('messages')
            .orderBy('timestamp', "asc")
            .onSnapshot(snapshot =>{
                setMessages(snapshot.docs.map(doc => doc.data()))
            })
        }
      
    }, [roomId])

    return (
        <div className="chat">
            <div className="chat_header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="chat_headerInfo">
                    <h3>{roomName}</h3>
                    <p>Last seen at {" "}
                    {new Date(messages[messages.length -1]?.timestamp?.toDate()).toUTCString() }
                    console
                        </p>
                </div>
                <div className="chat_headerRight">
                <IconButton>
                        <SearchOutlined/>
                   </IconButton>
                   <IconButton>
                        <AttachFile/>
                   </IconButton>
                   <IconButton>
                         <MoreVert/>
                   </IconButton>
                </div>
            </div>
            <div className="chat_body">
                {messages.map(message =>(   
                    <p className={`chat_message ${message.name === user.displayName && "chat_reciever"}`}>
                    <span className="chat_name">
                            {message.name}
                        </span>
                       {message.message}
                        <span className="chat_timestamp">
                            {new Date(message.timestamp?.toDate()).toUTCString()}
                        </span>
                    </p>
                ))}
                
                
            </div>
            <div className="chat_footer">
                <InsertEmoticonIcon />
                 <form >
                     <input type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message" />
                     <button 
                            type="submit" 
                            onClick={sendMessage}
                            
                            >Send a message</button>
                 </form>
                <MicIcon/>
            </div>
        </div>
    )
}

export default Chat
