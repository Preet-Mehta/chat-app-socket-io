const express = require("express");
const { addUser, getUser, deleteUser, getAllUsers } = require("./users_api");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let msgs = [];
const port = 5000 || process.env.PORT;

io.on("connection", (socket) => {
  msgs = [];
  socket.on("join", ({ name, room }, callback) => {
    const { err, user } = addUser({ id: socket.id, name, room });
    if (err) return callback(err);
    if (user) {
      msgs.push({
        user: "admin",
        msg: `${user.name} has entered the room ${user.room}.`,
      });
      console.log(msgs);
      io.to(user.room).emit("message", {
        msgs: msgs.filter((msg) => msg.user == "admin"),
      });
      io.to(user.room).emit("message", {
        msgs: msgs.filter((msg) => user.name === msg.user),
      });
      socket.join(user.room);
      io.to(user.room).emit("users", {
        room: user.room,
        users: getAllUsers(user.room),
      });

      callback();
    }
  });

  socket.on("client_message", (msg) => {
    const user = getUser(socket.id);
    if (user) {
      msgs.push({ user: user.name, msg });
      console.log(msgs);
      io.to(user.room).emit("message", { msgs });
    }
  });

  socket.on("disconnect", () => {
    const user = deleteUser(socket.id);
    if (user) {
      msgs.push({
        user: "admin",
        msg: `${user.name} has left the room.`,
      });
      // msgs = msgs.filter(
      //   (msg) => msg.user !== user.name && msg.user !== "admin"
      // );
      io.to(user.room).emit("message", {
        msgs,
      });
      io.to(user.room).emit("users", {
        room: user.room,
        users: getAllUsers(user.room),
      });
    }
  });
});

server.listen(port, () => console.log(`Server started at port ${port}.`));
