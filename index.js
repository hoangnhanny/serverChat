var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
var app = express();
server = app.listen(4000, function () {
  console.log("server is running on port 4000");
});
var cors = require("cors");
const User = require("../server/models/user.js");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";
mongoose.connect("mongodb://localhost:27017/AppChat", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.set("useCreateIndex", true);
app.use(cors());
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "./views");
var socket = require("socket.io");
io = socket(server);
let userOnline = [];
io.on("connection", function (socket) {
  // console.log(socket.id);
  socket.on("newMessage", function (data) {
    // console.log(data);

    io.sockets.emit("serverSendMessage", {
      data: data.data,
      user: data.user,
    });
  });
  socket.on("loginSuccess", function (data) {
    console.log("1" + " " + data);
    let b = userOnline.indexOf(data, 0);
    console.log(b);

    userOnline.push(
      data,
      // name: data,
    );

    console.log(userOnline);
    io.sockets.emit("serverSendUseronline", userOnline);
  });
  socket.on("logout", function (data) {
    // console.log(data);
    console.log(data);
    let a = userOnline.indexOf(data, 0);
    console.log(a);
    userOnline.splice(a, 1);
    // console.log(userOnline);
    socket.broadcast.emit("serverSendUseronline", userOnline);
  });
});

app.post("/signup", function (req, res) {
  const Users = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    address: req.body.address,
  });
  User.findOne({ username: Users.username }, (err, docs) => {
    if (docs) {
      return res.send({ status: 400, message: "Sai" });
    } else {
      Users.save(function (err, userObj) {
        if (err) {
          return res.send({ status: 400, message: "Sai" });
        } else {
          // res.json(userObj);
          console.log("saved successfully:", userObj);
          return res.send({ status: 200, message: "Insert thanh cong", userObj });
        }
      });
    }
  });
});
app.post("/login", function (req, res) {
  const Users = {
    username: req.body.username,
    password: req.body.password,
  };

  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("AppChat");
    let a = dbo
      .collection("users")
      .find({ username: Users.username, password: Users.password })
      .toArray((err, result) => {
        console.log(result.length === 0);
        if (result.length === 0) {
          return res.send({ status: 400, message: "Sai" });
        }
        return res.send({ status: 200, message: "Dung roi", result });

        db.close();
      });

    // console.log(a);
  });
});
app.get("/", (req, res) => {
  res.send("Server dang chay");
});
