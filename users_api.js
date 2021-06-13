let current_users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase().split(" ").join("_");
  room = room.trim().toLowerCase();

  const exist_user = current_users.find(
    (user) => name === user.name && room === user.room
  );

  if (exist_user)
    return {
      err: "User with this name already exists.",
    };

  const new_user = {
    id,
    name,
    room,
    user_msgs: [{ name: "admin", room, msg: `You have entered the room.` }],
  };

  current_users.push(new_user);

  current_users.map((user) => {
    if (user.room === new_user.room && user.id !== new_user.id)
      user.user_msgs.push({
        name: "admin",
        room,
        msg: `${name} has entered the room.`,
      });
  });
  return { new_user, users: current_users };
};

const deleteUser = (id) => {
  const index = current_users.findIndex((user) => user.id === id);
  if (index !== -1) {
    const deleted_user = current_users.splice(index, 1)[0];
    if (current_users.length >= 0) {
      // console.log("eqdq");
      current_users.map((user) => {
        if (user.room === deleted_user.room)
          user.user_msgs.push({
            name: "admin",
            room: deleted_user.room,
            msg: `${deleted_user.name} has left the room.`,
          });
      });
      return { deleted_user, current_users };
    }
  }
  return { err: "Room deleted.", current_users: [] };
};

const getUser = (id) => current_users.find((user) => user.id === id);

const getAllUsers = (room) =>
  current_users.filter((user) => user.room === room);

const debugUsers = () => current_users;

module.exports = { addUser, deleteUser, getAllUsers, debugUsers, getUser };
