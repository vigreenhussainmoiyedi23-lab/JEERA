// utils/socketUtils.js
function getUserSockets(socketIdMap, userId) {
  const key = userId.toString();
  const sockets = socketIdMap.get(key);
  return sockets ? Array.from(sockets) : [];
}

function emitToUser(io, socketIdMap, userId, event, data) {
  const socketIds = getUserSockets(socketIdMap, userId);
  socketIds.forEach((sid) => io.to(sid).emit(event, data));
}

module.exports = { getUserSockets, emitToUser };
