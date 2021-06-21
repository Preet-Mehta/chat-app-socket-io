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
          placeholder="Enter 5-9 characters."
          required
          onChange={handleChange}
          autoComplete="off"
          maxLength="9"
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
          placeholder="Enter 6-12 characters."
          onChange={handleChange}
          autoComplete="off"
          maxLength="12"
        />
      </div>
      <button
        disabled={!(room && name)}
        className="join-room-button"
        onClick={() => {
          if (
            name.length >= 5 &&
            name.length <= 9 &&
            room.length >= 6 &&
            room.length <= 12
          )
            history.push(`/chat?name=${name}&room=${room}`);
          else {
            alert("Please follow the instructions mentioned in placeholder.");
            setData({
              name: "",
              room: "",
            });
          }
        }}
      >
        Join
      </button>
    </div>
  );
};

export default JoinPage;
