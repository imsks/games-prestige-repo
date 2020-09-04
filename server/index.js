const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const routes = require("./config/routes");
const PORT = 5050;
const ytCOntroller = require("./controller/youtubeDownload");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/", routes);

const server = app.listen(PORT);
const io = require("./socket").init(server);

app.set("socketio", io);

io.on("connection", (socket) => {
  socket.on("connect_failed", (err) => {
    console.log("here");
  });

  // socket.on("error", (err) => {
  //   console.log("here", err, "hereeeeeeeepipieee");
  // });

  // socket.on("connect_error", function (err) {
  //   console.log(err);
  // });

  // getApiAndEmit(socket);

  socket.on("disconnect", function (socket) {
    console.log("here disconnet");
  });
});

// const getApiAndEmit = async (socket) => {
//   const response = "workind";
//   const temp = ytCOntroller.downloads;
//   console.log(temp)
//   // Emitting a new message. Will be consumed by the client
//   // socket.emit("FromAPI", response);
// };