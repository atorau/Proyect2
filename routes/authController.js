/*jshint esversion: 6*/
// routes/auth-routes.js
const express = require("express");
const authController = express.Router();
const multer = require('multer');
var upload = multer({dest:"./public/upload"});
const Picture = require("../models/picture");

// User model
const User = require("../models/user");
const Wall = require("../models/wall");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const passport = require("passport");

const auth = require('../helpers/auth-helpers');

/////////////////////////////FS FILES////////////////////////
const fs = require('fs');
const path = require('path');
let filename = 'default.png';
let src = path.join(__dirname, '../public/pictures/profile/'+filename);
let destDir = path.join(__dirname, '../public/uploads/');

function copyFile(src, dest) {

  let readStream = fs.createReadStream(src);

  readStream.once('error', (err) => {
    console.log(err);
  });

  readStream.once('end', () => {
    console.log('done copying');
  });

  readStream.pipe(fs.createWriteStream(dest));
}
//////////////////////////////////////////////////////////////

authController.get("/login", auth.ifAlreadyLoggedIn('/main'), (req, res, next) => {
  res.render("intranet/auth/login", {
    "message": req.flash("error")
  });
});

authController.post("/login", passport.authenticate("local",{
  successRedirect: "/main",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

authController.get('/signup', auth.ifAlreadyLoggedIn('/main'), (req, res) => {
  res.render("intranet/auth/signup");
});

authController.post('/signup', (req, res) => {

  const username  = req.body.username;
  const name      = req.body.name;
  const lastName  = req.body.lastName;
  const email     = req.body.email;
  const role      = "USER";
  const password  = req.body.password;
  const ubication = req.body.ubication;
  const address   = req.body.address;
  let picture;
  let wall;
  let routes = [];
  let albumns = [];
  let tracks = [];
  let messages = [];
  let conversations = [];

  if (username === "" || email === "" || password === "") {
    res.render("intranet/auth/sigmup", {
      message: "Indicate username, email, password and role"
    });
    return;
  }

  User.findOne({$or:[{username:username},{email:email}]}, "username email", (err, user) => {
    if (user !== null) {
      res.render("intranet/auth/signup", {
        message: "The username or email already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username: username,
      name: name,
      lastName: lastName,
      email: email,
      password: hashPass,
      ubication: ubication,
      address: address,
      role: role,
      picture: picture,
      wall: wall,
      routes: routes,
      albumns: albumns,
      tracks: tracks,
      messages: messages,
      conversations: conversations,
    });

    newUser.save((err,user) => {
      if (err) {
        res.render("intranet/auth/signup", {
          message: "Something went wrong"
        });
      } else {

        const userWall = new Wall({
          owner_id: user._id,
          wallType: 'USER',
          message: []
        });

        Wall.create(userWall, (err, wall) => {
          if (err) {
            next(err);
          }
          user.wall=userWall._id;
          user.save((err,updatedUser)=>{
            if(err){
              next(err);
            }else{
              /////////////////////////////////////////////

              fs.access(destDir, (err) => {
                if(err){
                  console.log("err");
                }
                copyFile(src, path.join(destDir, user.username+filename));
              });

              const userPicture = new Picture({
                name: filename,
                pic_name: filename,
                pic_path: "/uploads/"+user.username+filename,
                pictureType: 'PROFILE',
                albumn_id: undefined,
                owner_id: user._id,
              });

              Picture.create(userPicture, (err, picture) => {
                if (err) {
                  next(err);
                }
                user.picture=picture._id;
                user.save((err,updatedUser)=>{
                  if(err){
                    next(err);
                  }else{
                    res.render("intranet/auth/login", {
                      message: "User Created"
                    });
                  }
                });
              });
            }
          });
        });
      }
    });
  });
});

module.exports = authController;
