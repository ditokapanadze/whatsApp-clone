import React, { useEffect, useState, useContext } from 'react'
import './SidebarChat.css'
import {Avatar} from "@material-ui/core"
import db, { auth } from './firebase'
import { Link } from 'react-router-dom'
import {useStateValue} from './StateProvider'


function SidebarChat({id, name, author, addNewChat}) {
    const [seed, setSeed] = useState('')
    const [messages, setMessages] = useState([])
    const [{user}, dispatch] = useStateValue()
    
    useEffect(() =>{
       setSeed(Math.floor(Math.random()*500))
    }, [])
   
    
     const createChat = () =>{
         const roomName = prompt("please enter name for chat room")
         if(roomName){
           db.collection('rooms').add({
               name: roomName,
               authorId: user.uid
           })
         }
     }

     useEffect(()=>{
         if(id){
            db.collection('rooms')
            .doc(id)
            .collection('messages')
            .orderBy('timestamp','desc')
            .onSnapshot(snapshot => {
                setMessages(snapshot.docs.map((doc) => doc.data()))
            })
        }
     }, [id])

     
    const deleteRoom = (id) =>{
        let answer = window.confirm("are you sure? All the messages in this room will be permanently deleted");
           if(answer){
                console.log(id)
            db.collection('rooms')
            .doc(id).delete()
        } else {
            return 
        }
          
    }

     console.log(messages[0]?.message)
    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className="sidebarChat">
            <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
            <div className="sidebarChat_info">
                <h2>{name}</h2>
                {author === user.uid &&( <div> 
                                        <p>Created by you</p>
                                        <button className="room-dtl-btn" onClick={()=>deleteRoom(id)}>Delete this room</button>
                                            </div>)}
                <p>
                    {messages[0]?.message}
                </p>
            </div>
        </div>
        </Link>
      
    ) :(
        <div onClick={createChat} className="sidebarChat">
         <h2>Add new Chat</h2>
        </div>
    )
}

export default SidebarChat
