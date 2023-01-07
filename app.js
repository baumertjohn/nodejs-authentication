require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://192.168.0.200:27017/userDB");

// User Schema with encryption.
const userSchema = new mongoose.Schema({ email: String, password: String });

// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"],
// });

const User = new mongoose.model("User", userSchema);

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
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    if (!err) {
      User.create({ email: req.body.username, password: hash }, function (err) {
        if (!err) {
          // console.log("New User Added");
          res.render("secrets");
        }
      });
    }
  });
});

app.post("/login", function (req, res) {
  User.findOne({ email: req.body.username }, function (err, userResult) {
    if (!err) {
      bcrypt.compare(
        req.body.password,
        userResult.password,
        function (err, result) {
          if (result) {
            res.render("secrets");
          }
        }
      );
    }
  });
});
