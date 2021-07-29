const express = require("express");
require("dotenv").config();
const {
  debugUsers,
  addUser,
  getUser,
  deleteUser,
  getAllUsers,
} = require("./users_api");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://chat-app-socketio.netlify.app/",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server up and running.");
});

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { err, new_user, users } = addUser({ id: socket.id, name, room });
    if (err) callback(err);

    if (users?.length > 0) {
      socket.join(new_user.room);
      io.to(new_user.room).emit("message", users);
    }

    io.to(users && users[users.length - 1].room).emit("users", {
      room: users && users[users.length - 1].room,
      users: getAllUsers(users && users[users.length - 1].room),
    });
  });

  socket.on("client_message", (msg) => {
    const c_user = getUser(socket.id);
    const all_users = debugUsers();
    if (c_user) {
      all_users.map((user) => {
        if (user.room === c_user.room)
          user.user_msgs.push({ user: c_user.name, room: c_user.room, msg });
      });
      io.to(c_user.room).emit("message", all_users);
    }
  });

  socket.on("disconnect", () => {
    const { err, deleted_user, current_users } = deleteUser(socket.id);
    if (current_users?.length > 0) {
      io.to(deleted_user.room).emit("message", current_users);
      io.to(deleted_user.room).emit("users", {
        room: deleted_user.room,
        users: getAllUsers(deleted_user.room),
      });
    } else return { err };
  });
});

server.listen(port, () => console.log(`Server started at port ${port}.`));
