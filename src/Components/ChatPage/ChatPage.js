import { Picker } from "emoji-mart";
import io from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import "emoji-mart/css/emoji-mart.css";
import Particle from "../utils/Particle";
import "./ChatPage.css";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";

const ChatPage = (props) => {
  const END_POINT = "https://mini-project-socket-io.herokuapp.com/";
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
    setRoom(room.trim().toLowerCase());
    setUser(name.trim().toLowerCase().split(" ").join("_"));
    socket.current = io(END_POINT);
    socket.current.emit(
      "join",
      { name, room: room.trim().toLowerCase() },
      (error) => {
        if (error) {
          alert(error);
          history.push("/");
        }
      }
    );

    return () => {
      socket.current.disconnect();
    };
  }, [props.location.search, END_POINT, history]);

  useEffect(() => {
    const { name, room } = queryString.parse(props.location.search);
    socket.current.on("message", (users) => {
      setMessages(
        users.filter(
          (f_user) =>
            (f_user.name === name.trim().toLowerCase().split(" ").join("_") &&
              f_user.room === room.trim().toLowerCase()) ||
            (f_user.name === "admin" &&
              f_user.room === room.trim().toLowerCase())
        )[0]?.user_msgs
      );
    });
    scrollToBottom();
  }, [messages?.length]);

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
          <div className="room-name">{room}</div>
          <img src="./bg.svg" alt="" />
          <ul>
            {messages?.map((message, i) => {
              if (message.name === "admin") {
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
                      <span style={{ fontSize: ".9rem" }}>{message.user}</span>
                      <p className="non-user">{message.msg}</p>
                    </div>
                  </li>
                );
              } else {
                return (
                  <li key={i} style={{ justifyContent: "flex-end" }}>
                    <div>
                      <span style={{ textAlign: "right", fontSize: ".9rem" }}>
                        You
                      </span>
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
          {users.map((c_user, i) => (
            <li key={i}>
              <span className="green-circle"></span>
              {c_user.name === user ? (
                <strong>{c_user.name}</strong>
              ) : (
                <>{c_user.name}</>
              )}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default ChatPage;
