import io from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import "./ChatPage.css";

const END_POINT = "http://localhost:5000";

const ChatPage = (props) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const socket = useRef(null);

  const handleSubmit = () => {
    socket.current.emit("client_message", message);
    setMessage("");
  };

  useEffect(() => {
    const { name, room } = queryString.parse(props.location.search);
    socket.current = io(END_POINT);
    socket.current.emit("join", { name, room }, (error) => {
      if (error) alert(error);
    });

    return () => {
      socket.current.disconnect();
      socket.current.off();
    };
  }, [props.location.search, END_POINT]);

  useEffect(() => {
    socket.current.on("message", (msgs) => {
      console.log(msgs);
      setMessages(msgs.msgs);
    });
  }, [messages.length]);

  useEffect(() => {
    console.log(users);
    socket.current.on("users", ({ users }) => {
      setUsers(users);
    });
  }, [users.length]);

  return (
    <div className="chat-room-container">
      <div className="chat-room-left">
        <ul>
          {messages.map((message, i) => (
            <li key={i}>
              {message.user}
              {message.msg}
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      <div className="chat-room-right">
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatPage;
