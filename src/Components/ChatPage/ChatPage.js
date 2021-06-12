import { Picker } from "emoji-mart";
import io from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import "emoji-mart/css/emoji-mart.css";
import Particle from "../utils/Particle";
import "./ChatPage.css";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";

const END_POINT = "http://localhost:5000";

const ChatPage = (props) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");

  const [room, setRoom] = useState("");

  const [showemo, setShowemo] = useState(false);

  const socket = useRef(null);
  const messagesEndRef = useRef(null);
  const history = useHistory();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      scrollTo: "end",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    message && socket.current.emit("client_message", message);
    setMessage("");
  };

  useEffect(() => {
    const { name, room } = queryString.parse(props.location.search);
    setRoom(room);
    setUser(name.trim().toLowerCase().split(" ").join("_"));
    socket.current = io(END_POINT);
    socket.current.emit(
      "join",
      { name, room: room.trim().toLowerCase() },
      (error) => {
        if (error) alert(error);
      }
    );

    return () => {
      socket.current.disconnect();
      socket.current.off();
    };
  }, [props.location.search, END_POINT]);

  useEffect(() => {
    socket.current.on("message", (msgs) => {
      setMessages(msgs.msgs);
    });
    scrollToBottom();
  }, [messages.length]);

  useEffect(() => {
    socket.current.on("users", ({ users }) => {
      setUsers(users);
    });
  }, [users.length]);

  const handleEmojis = (e) => setMessage(message + e.native);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="chat-room-container"
    >
      <div className="chat-room-left">
        <motion.img
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => history.push("/")}
          src="https://png.pngtree.com/png-vector/20190417/ourlarge/pngtree-vector-back-icon-png-image_947168.jpg"
          alt="image"
        />
        <Particle />
        <div className="chat-room-left-chats">
          <img src="./bg.svg" alt="" />
          <div className="room-name">{room}</div>
          <ul>
            {messages.map((message, i) => {
              if (message.user === "admin") {
                return (
                  <li key={i} style={{ justifyContent: "center" }}>
                    <div>
                      <p
                        style={{
                          fontSize: ".7rem",
                          letterSpacing: "1px",
                          backgroundColor: "black",
                          color: "rgb(182, 182, 182)",
                        }}
                        className="admin"
                      >
                        <strong>{message.msg}</strong>
                      </p>
                    </div>
                  </li>
                );
              } else if (message.user !== user) {
                return (
                  <li key={i} style={{ justifyContent: "flex-start" }}>
                    <div>
                      <span>{message.user}</span>
                      <p className="non-user">{message.msg}</p>
                    </div>
                  </li>
                );
              } else {
                return (
                  <li key={i} style={{ justifyContent: "flex-end" }}>
                    <div>
                      <span style={{ textAlign: "right" }}>You</span>
                      <p className="user">{message.msg}</p>
                    </div>
                  </li>
                );
              }
            })}
          </ul>
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-room-left-input">
          <Picker
            style={
              showemo
                ? { backgroundColor: "black", display: "block" }
                : { backgroundColor: "black", display: "none" }
            }
            set="apple"
            theme="dark"
            title="Emojis"
            onClick={handleEmojis}
          />
          <form onSubmit={handleSubmit}>
            <motion.img
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowemo(!showemo)}
              src="https://img.icons8.com/color/32/000000/lol--v4.png"
            />
            <input
              placeholder="Enter a message . . ."
              type="text"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
            >
              Submit
            </motion.button>
          </form>
        </div>
      </div>
      <div className="chat-room-right">
        <p>Users currently online</p>
        <ul>
          {users.map((user, i) => (
            <li key={i}>
              <span className="green-circle"></span> {user.name}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default ChatPage;
