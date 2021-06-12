const current_users = [];

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

  current_users.push({ id, name, room });
  return { user: { id, name, room } };
};

const deleteUser = (id) => {
  const index = current_users.findIndex((user) => user.id === id);
  if (index !== -1) return current_users.splice(index, 1)[0];
};

const getUser = (id) => current_users.find((user) => user.id === id);

const getAllUsers = (room) =>
  current_users.filter((user) => user.room === room);

module.exports = { addUser, deleteUser, getUser, getAllUsers };
