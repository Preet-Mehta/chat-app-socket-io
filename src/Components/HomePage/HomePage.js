import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import "./HomePage.css";
import JoinPage from "../JoinPage/JoinPage";

const HomePage = (props) => {
  const rectVariants = {
    hidden: { opacity: 0, x: "-40%", y: "40%" },
    show: { opacity: 1, x: 0, y: 0 },
  };

  const rightVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  const [val, setVal] = useState("inset 0 0 20px rgba(2, 255, 255, 0.5)");
  const [frame, setFrame] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      var redColor = Math.floor(Math.random() * 200);
      var greenColor = Math.floor(Math.random() * 200);
      var blueColor = Math.floor(Math.random() * 200);
      setVal(
        `inset 0 0 20px rgba(${redColor}, ${greenColor}, ${blueColor}, 0.5)`
      );
    }, 1200);
    return () => clearInterval(interval);
  }, [frame]);

  return (
    <div className="home-container">
      <motion.div
        variants={rectVariants}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4 }}
        className="rect rect-1"
        style={{ boxShadow: val }}
      />
      <motion.div
        variants={rectVariants}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.6 }}
        className="rect rect-2"
        style={{ boxShadow: val }}
      />
      <motion.div
        variants={rectVariants}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.8 }}
        style={{ boxShadow: val }}
        className="rect rect-3"
      />
      <div className="home-left">
        <motion.h1
          initial={{ opacity: 0, y: "20%" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Let's Chat.
        </motion.h1>
        <motion.h3
          initial={{ opacity: 0, y: "-20%" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Presenting a very Simple Chat App created for friends to join a room
          and start chatting. Leave the room, end the chat, nothing is saved.
          <br /> No strings attached 😉!
        </motion.h3>
        {!frame && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            onClick={() => setFrame(true)}
          >
            Get Started
          </motion.button>
        )}
      </div>
      <div className="home-right">
        {!frame && (
          <motion.div
            variants={rightVariants}
            initial="hidden"
            animate="show"
            transition={{ duration: 1 }}
            className="home-right-1"
          >
            <h2>Techologies Used:</h2>
            <a href="https://socket.io/" target="_blank" rel="noreferrer">
              Socket.io
            </a>
            <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
              React JS
            </a>
            <a href="https://expressjs.com/" target="_blank" rel="noreferrer">
              Express JS
            </a>
          </motion.div>
        )}
        {frame && (
          <motion.div
            variants={rightVariants}
            initial="hidden"
            animate="show"
            transition={{ duration: 1 }}
            className="home-right-2"
          >
            <motion.img
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setFrame(false)}
              src="https://png.pngtree.com/png-vector/20190417/ourlarge/pngtree-vector-back-icon-png-image_947168.jpg"
              alt=""
            />
            <JoinPage />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
