

const express = require('express');
const cors = require('cors');
let router = require('./router');
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express()

app.use(cors({}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use(express.json()) //Pour parser du json

app.use("/api", router)



app.get("/", (req, res, next) =>
    res.json({ message: "Firesave function service is working" })
);

// Manage bad route
app.use(function (req, res, next) {
  res.status(404).json({
      "error": "path not found" +
          `${req.protocol}://${req.get('host')}${req.originalUrl}`
  });
});

///////////////////////////////////////
// Handle socket connection 
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: '*'
  }
});
const alertHandler = require("./sockets/socketHandler");

const onConnection = (socket) => {
  alertHandler(io, socket);
}

io.on("connection", onConnection);
/////////////////////////////////////

// Launch app to listen to specified port
const port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('Running on ' + process.env.SERVER + port);
});