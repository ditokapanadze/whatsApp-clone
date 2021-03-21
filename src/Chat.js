import React, { useState, useRef, useEffect } from 'react'
import {Avatar, IconButton} from  "@material-ui/core"
import {AttachFile, MoreVert, SearchOutlined} from "@material-ui/icons"
import InsertEmoticonIcon  from "@material-ui/icons/InsertEmoticon"
import MicIcon from "@material-ui/icons/Mic"
import './Chat.css'
import {useParams} from "react-router-dom"
import db from './firebase'
import {storage} from './firebase'
import firebase from"firebase"
import userEvent from '@testing-library/user-event'
import { useStateValue } from './StateProvider'
import ReactDOM from 'react-dom';
import Picker from 'emoji-picker-react';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';

function Chat() {
    const [seed, setSeed] = useState("")
    const [input, setInput] = useState ("")
    const [roomName, setroomName] = useState ("")
    const {roomId}= useParams()
    const [messages, setMessages] = useState ([])
    const [emojiVisible, setEmojiVisible] = useState("")
    const [photo, setPhoto] = useState(null)
    const [progress, setProgress] = useState(0);
    const [url, setUrl] = useState("");
    const [imgPreview, setimgPreview] = useState ("")
    const [{user}, dispatch] = useStateValue([]) 

    const [chosenEmoji, setChosenEmoji] = useState(null);

    const onEmojiClick = (event, emojiObject) => {
      setChosenEmoji(emojiObject);
      setInput(input + chosenEmoji?.emoji)
    };
  

    useEffect(() =>{
        setSeed(Math.floor(Math.random()*500))
     }, [roomId])
       
     const handleChange = (e) =>{
        if (e.target.files[0]) {
            setPhoto(e.target.files[0]);
            let src = URL.createObjectURL(e.target.files[0]);
            setimgPreview(src) 
            
          }
     }

     const handleUpload = () => {
        const uploadTask = firebase.storage().ref(`images/${photo.name}`).put(photo);
        uploadTask.on(
          "state_changed",
          snapshot => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          error => {
            console.log(error);
          },
          () => {
            storage
              .ref("images")
              .child(photo.name)
              .getDownloadURL()
              .then(url => {
                  setUrl(url);
                  
              });
          }
        );
        
      };


     function  sendMessage (e) {
      e.preventDefault()
      photo && handleUpload()
       db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .add({
            message: input,
            name: user.displayName, 
            photoURL: url,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setPhoto(null)
        setUrl("")
        setInput("")
        setimgPreview('')
      }

    useEffect(() => {
        if(roomId){
            db.collection('rooms').
            doc(roomId)
            .onSnapshot(snapshot =>(
                setroomName(snapshot.data()?.name)
            ))

            db.collection('rooms').doc(roomId)
            .collection('messages')
            .orderBy('timestamp', "asc")
            .onSnapshot(snapshot =>{
                setMessages(snapshot.docs.map(doc =>({
                    id: doc.id,
                    data: doc.data(),
                  })))
            })
        }
      
    }, [roomId])
    console.log(messages)
      
     const handleDelete =(id) =>{
            console.log(id)
            db.collection('rooms').doc(roomId)
            .collection('messages').doc(id).delete()

     }

     let objDiv = document.getElementsByClassName("chat_body");
 objDiv.scrollBottom = objDiv.scrollToBottom
 
     const messagesEndRef = useRef(null)
     const scrollToBottom = () => {
        messagesEndRef.current &&   messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      }
    
      useEffect(scrollToBottom, [messages]);

      const emojiClick = () =>{
          
       if(emojiVisible === ""){
        setEmojiVisible('visible')
        console.log(emojiVisible)
          
       } else {
        
        setEmojiVisible('')
        console.log(emojiVisible)
       }
    }

  

    return (
        <div  className="chat">
            <div className="chat_header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="chat_headerInfo">
                    <h3>{roomName}</h3>
                    <p>Last seen at {" "}
                    {new Date(messages[messages.length -1]?.data?.timestamp?.toDate()).toUTCString() }
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
            <div   className="chat_body">
                {messages.map(message =>(   
                    <div ref={messagesEndRef} className="test">
                    <p key={message.id}
                     className={`chat_message ${message.data.name === user.displayName && "chat_reciever"}`}>
                    <span className="chat_name">
                            {message.data.name}
                        </span>
                        {message.data.name === user.displayName && <button className="dlt-btn" onClick={() => handleDelete(message.id)}>delete message</button>}
                       
                       {message.data.message}
                       <img  className="message-img" src={message.data.photoURL}/>
                        <span className="chat_timestamp">
                            {new Date(message.data.timestamp?.toDate()).toUTCString()}
                        </span>
                    </p>
                    </div>
                ))}
                </div>
            <div className="chat_footer">
                <InsertEmoticonIcon onClick={emojiClick} />
                <div className={`emoji-container ${emojiVisible}`}>
      {chosenEmoji ? (
        <span>You chose: {chosenEmoji.emoji}</span>
      ) : (
        <span>No emoji Chosen</span>
      )}
      <Picker onEmojiClick={onEmojiClick} />
    </div>
                 <form >
                     <input type="text" 
                            required
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message" />
                          <input
                                id="img"
                                className="img-input" 
                                accept="image/*"
                                type="file"
                                onChange={handleChange}
                                 /> 
                                  <img width="50" id="file-ip-1-preview" src={imgPreview}/>    
                                <label for="img"><PhotoCameraIcon /></label>
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
