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
    const [searchRoom, setSearchRoom] = useState(" ")
    const [{user}, dispatch] = useStateValue()
    
    
    useEffect(()=>{
       
        db.collection('rooms').onSnapshot(snapshot =>(
             setRooms(snapshot.docs.map(doc =>({
                 id: doc.id,
                 data: doc.data(),
                })))
         ))
        }, [searchRoom])
   
         const ssss =() =>{
        setRooms(rooms.filter(room => room.data.name == searchRoom))
            
         }
//    useEffect(()=>{
//     setRooms(rooms.filter(room => room.data.name == searchRoom))
//     console.log(rooms)
//    }, [searchRoom])

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

   const test = (e)=>{
       e.preventDefault()
       console.log(searchRoom)
       setRooms(rooms.filter(room => room.data.name == searchRoom))
    if (e.charCode === 13){
       
        setRooms(rooms.filter(room => room.data.name == searchRoom))
    }
   }
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
                        <form type="submit">
                        <input type="submit"
                           onChange={(e) => (setSearchRoom(e.target.value), console.log(searchRoom))}
                            placeholder="Search or start a new chat" type="text"/>
                            <button style={{display: "none"}} onClick={test}></button>
                        </form>
                   
                </div>
           </div>
           <div className="sidebar_chats">
               <SidebarChat addNewChat searchRoom={searchRoom}/>
             {rooms.length <1 && <div><p>No Rooms Found</p></div>} 
             {rooms.map(room =>
                 <SidebarChat rooms={rooms} searchRoom={searchRoom} key={room.id} author={room.data.authorId} id={room.id} name={room.data.name} />
             )}
            
               
           </div>
        </div>
    )
}

export default Sidebar
