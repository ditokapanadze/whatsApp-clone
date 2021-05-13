import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import db from "./firebase";
import { Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";

function SidebarChat({ id, name, rooms, author, addNewChat, searchRoom }) {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 500));
  }, []);

  const createChat = () => {
    let roomName = prompt("please enter name for chat room");
    while (roomName.length < 5) {
      // roomName.length >= 5 ? roomName = prompt("Room name must be at leat 5 characters long") :  prompt("Room name must be at leat 5 characters long")

      roomName = prompt("Room name must be at least 5 characters long");
    }
    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
        authorId: user.uid,
      });
    }
  };

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [id]);

  const deleteRoom = (id) => {
    let answer = window.confirm(
      "are you sure? All the messages in this room will be permanently deleted"
    );
    if (answer) {
      console.log(id);
      db.collection("rooms").doc(id).delete();
    } else {
      return;
    }
  };

  const clearInput = () => {
    console.log("es");
  };
  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div onClick={clearInput} className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarChat_info">
          <h2>{name}</h2>
          {author === user?.uid && (
            <div>
              <p>Created by you</p>
              <button className="room-dtl-btn" onClick={() => deleteRoom(id)}>
                Delete this room
              </button>
            </div>
          )}
          <p>{messages[0]?.message?.slice(0, 30)}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add new Chat</h2>
    </div>
  );
}

export default SidebarChat;
