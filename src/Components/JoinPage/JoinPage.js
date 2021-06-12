import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./JoinPage.css";

const JoinPage = (props) => {
  const [data, setData] = useState({
    name: "",
    room: "",
  });
  const { name, room } = data;

  const history = useHistory();

  const handleChange = (e) =>
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

  return (
    <div className="join-room-container">
      <h1>Join Room</h1>
      <div className="join-room-input">
        <label htmlFor="name">
          Display Name <sup style={{ color: "yellow" }}>*</sup>
        </label>
        <input
          type="text"
          name="name"
          value={name}
          placeholder="Eg. Bhai"
          required
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="join-room-input">
        <label htmlFor="room">
          Room Name <sup style={{ color: "yellow" }}>*</sup>
        </label>
        <input
          type="text"
          name="room"
          value={room}
          placeholder="Eg. Apna Adda"
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <button
        disabled={!(room && name)}
        className="join-room-button"
        onClick={() => history.push(`/chat/?name=${name}&room=${room}`)}
      >
        Join
      </button>
    </div>
  );
};

export default JoinPage;
