import React, { useState, useRef, useEffect } from "react";
import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, MoreVert, SearchOutlined } from "@material-ui/icons";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import "./Chat.css";
import { useParams } from "react-router-dom";
import db from "./firebase";
import { storage } from "./firebase";
import firebase from "firebase";

import { useStateValue } from "./StateProvider";

import Picker from "emoji-picker-react";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";

function Chat() {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const [roomName, setroomName] = useState("");
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [emojiVisible, setEmojiVisible] = useState("");
  const [photo, setPhoto] = useState(null);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");
  const [imgPreview, setimgPreview] = useState("");
  const [{ user }, dispatch] = useStateValue([]);
  const [replyPost, setReplyPost] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [replyPhoto, setReplyPhoto] = useState("");
  const [test, setTest] = useState([]);
  const [chosenEmoji, setChosenEmoji] = useState(null);

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setInput(input + chosenEmoji?.emoji);
  };

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 500));
  }, [roomId]);
  useEffect(() => {
    setInput("");
  }, [roomId]);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
      let src = URL.createObjectURL(e.target.files[0]);
      setimgPreview(src);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (photo) {
      const uploadTask = firebase
        .storage()
        .ref(`images/${photo.name}`)
        .put(photo);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(photo.name)
            .getDownloadURL()
            .then((url) => {
              setUrl(url);

              db.collection("rooms")
                .doc(roomId)
                .collection("messages")
                .add({
                  message: input,
                  name: user.displayName,
                  photoURL: url,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  reply: replyPost || replyPhoto ? true : false,
                  replySubject: replySubject,
                  replyPhoto: replyPhoto ? replyPhoto : "",
                });
            });
        }
      );
    } else if (input) {
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .add({
          message: input,
          name: user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          reply: replyPost || replyPhoto ? true : false,
          replySubject: replySubject,
          replyPhoto: replyPhoto ? replyPhoto : "",
        });
    }
    setPhoto(null);
    setUrl("");
    setInput("");
    setimgPreview("");
    setReplyPost("");
  };

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setroomName(snapshot.data()?.name));

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    }
  }, [roomId]);

  const handleDelete = (id) => {
    db.collection("rooms").doc(roomId).collection("messages").doc(id).delete();
  };

  let objDiv = document.getElementsByClassName("chat_body");
  objDiv.scrollBottom = objDiv.scrollToBottom;

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current &&
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const emojiClick = () => {
    if (emojiVisible === "") {
      setEmojiVisible("visible");
    } else {
      setEmojiVisible("");
    }
  };
  const reply = (id) => {
    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .onSnapshot((snapshot) => {
        setTest(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

    // ({
    //   id: doc.id,
    //   data: doc.data(),
    //  })
    // .doc(id)
    // .onSnapshot(snapshot => (
    //  console.log(snapshot)
    // ))

    const findPost = test.filter((message) => message.id === id);

    const replyPhoto = findPost[0]?.data.photoURL;
    const post = findPost[0]?.data.message;
    setReplySubject(findPost[0]?.data.name);
    setInput(`reply: ${post}:`);
    setReplyPhoto(replyPhoto);
    setReplyPost(post);
    // console.log(replyPost)

    //   db.collection('rooms').onSnapshot(snapshot =>(
    //     setRooms(snapshot.docs.map(doc =>({
    //         id: doc.id,
    //         data: doc.data(),
    //        })))
    // ))
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat_headerInfo">
          <h3>{roomName}</h3>
          <p>
            Last seen at{" "}
            {new Date(
              messages[messages.length - 1]?.data?.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>
        <div className="chat_headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {messages.map((message) => (
          <div key={message.id} ref={messagesEndRef} className="test">
            <p
              className={`chat_message ${
                message.data.name === user.displayName && "chat_reciever"
              }`}
            >
              <span className="chat_name">{message.data.name}</span>

              {message.data.name === user.displayName && (
                <button
                  className="dlt-btn"
                  onClick={() => handleDelete(message.id)}
                >
                  delete message
                </button>
              )}
              {/* {message.data.reply ? <p> asdasd </p> : ""} */}
              {/* {message.data.reply ? <p>{message.data.message.match(/:(.*):/)[1]}</p> : " "} */}
              {message.data.reply ? (
                <div className="reply">
                  <img className="message-img" src={message.data.replyPhoto} />
                  <span>
                    {message.data.replySubject}:
                    {message.data.message.split(":")[1]}
                  </span>
                  {message.data.message.split(":")[2]}
                </div>
              ) : (
                message.data.message
              )}

              {message.data.name !== user.displayName && (
                <button className="reply-btn" onClick={() => reply(message.id)}>
                  Reply
                </button>
              )}
              <img className="message-img" src={message.data.photoURL} />
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
        <form>
          <input
            type="text"
            required
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
          />
          <input
            id="img"
            className="img-input"
            accept="image/*"
            type="file"
            onChange={handleChange}
          />
          <img width="50" id="file-ip-1-preview" src={imgPreview} />
          <label for="img">
            <PhotoCameraIcon />
          </label>
          <button type="submit" onClick={handleUpload}>
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
