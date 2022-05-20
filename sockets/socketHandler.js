module.exports = (io, socket) => {
    const alertUsers = (payload) => {
      console.log("alert")
      socket.emit('alert') // to all connected clients. https://socket.io/fr/docs/v3/emit-cheatsheet/
    }
  
    socket.on("alert", alertUsers);
  }