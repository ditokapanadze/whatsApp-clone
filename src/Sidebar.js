import React, { useEffect, useState,} from 'react'
import './Sidebar.css'
import {Avatar, IconButton} from "@material-ui/core"
import DonutLargeIcon from "@material-ui/icons/DonutLarge"
import ChatIcon from "@material-ui/icons/Chat"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import {SearchOutlined} from "@material-ui/icons"
import SidebarChat from "./SidebarChat"
import db from './firebase'
import { useStateValue } from './StateProvider'
import firebase from 'firebase'
import { useHistory } from "react-router-dom";
import { actionTypes } from './reducer'

function Sidebar() {
    let history = useHistory()
    const [rooms, setRooms] = useState([])
    const [{user}, dispatch] = useStateValue()
    
    useEffect(()=>{

        const unsubscribe = db.collection('rooms').onSnapshot(snapshot =>(
             setRooms(snapshot.docs.map(doc =>({
                 id: doc.id,
                 data: doc.data(),
                 
             })))
         ))
         return () =>{
            unsubscribe()
         }
    }, [])

    const logOut = () =>{
        firebase.auth().signOut().then(() => {
            dispatch({
                type: actionTypes.LOG_OUT,
                user: null
            })
            history.push('/')
          }).catch((error) => {
            console.log(error)
          });
    }

   console.log(rooms)
    return (
        <div className="sidebar">
           <div className="sidebar_header">
               <Avatar src={user?.photoURL} />
               <div className="sidebar_headerRight">
                   <IconButton>
                        <button onClick={logOut}>Log Out</button>
                   </IconButton>
                   <IconButton>
                        <DonutLargeIcon/>
                   </IconButton>
                   <IconButton>
                        <ChatIcon/>
                   </IconButton>
                   <IconButton>
                         <MoreVertIcon/>
                   </IconButton>
                   </div>
           </div>
           <div className="sidebar_search">
                    <div className="sidebar_searchContainer">

               
                        <SearchOutlined />
                    <input placeholder="Search or start a new chat" type="text"/>
                </div>
           </div>
           <div className="sidebar_chats">
               <SidebarChat addNewChat/>
              
             {rooms.map(room =>
                 <SidebarChat key={room.id} author={room.data.authorId} id={room.id} name={room.data.name} />
             )}
            
               
           </div>
        </div>
    )
}

export default Sidebar
