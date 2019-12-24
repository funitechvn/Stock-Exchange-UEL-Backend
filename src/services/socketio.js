var socketIo = require("socket.io");
var io = socketIo();

var socketApi = { io };

io.on("connection", function(socket) {
  console.log("A user connected");
});

//write functions then exports them

module.exports = {
  socketApi,
  updateDataStock: (data) => {
    io.emit('updateDataStock', data)
  },
  updateWaitingTrading: (userId, data) => {
    io.emit(`updateWaitingTrading-${userId}`, data)
  },
  updateUserInfo: (userId, data) => {
    io.emit(`updateUserInfo-${userId}`, data)
  }
};
