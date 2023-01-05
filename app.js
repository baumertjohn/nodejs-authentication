const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://192.168.0.200:27017/userDB");

// User Schema
const userSchema = { email: String, password: String };
const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

app.post("/register", function (req, res) {
  User.create(
    { email: req.body.username, password: req.body.password },
    function (err) {
      if (!err) {
        // console.log("New User Added");
        res.render("secrets");
      }
    }
  );
});
