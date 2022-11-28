const express = require("express");
const app = express();
const http = require("http");
// this is getting from socket io
const { Server } = require("socket.io");

const cors = require("cors");
const { Socket } = require("dgram");
const { response } = require("express");

//cover connections issue
app.use(cors());

//this is created server for my app
const server = http.createServer(app);

// this is taken server and object inside that object its taken origin that is where u want to get meessage or socket event and another is methods genrally we do in soket get and post method
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected : ${socket.id}`);
  //leaving tab or chat something like this

  socket.on("join_room", (data) => {
    // join is function inside socket.io
    socket.join(data);

    console.log(`user with is ${socket.id} joined room : ${data}`);
  });

  // we are create event for sending message object
  socket.on("send_message", (data) => {
    console.log(data, "get message form frontend");
    socket.to(data.room).emit("recieve_message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

app.use("/", (res) => {
  res.send("Home page");
});

//pass port number which anything u want
server.listen(3001, () => {
  console.log("server running");
});
