/*jshint esversion: 6*/
// routes/auth-routes.js
const express = require("express");
const profileController = express.Router();
const multer = require('multer');
var upload = multer({
  dest: "./public/uploads"
});
const Picture = require("../models/picture");

// User model
const User = require("../models/user");
const Wall = require("../models/wall");
const Route = require("../models/route");
const Message = require("../models/message");

const passport = require("passport");

const auth = require('../helpers/auth-helpers');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


/////////////////////////////FS FILES////////////////////////
const fs = require('fs');
const path = require('path');
let destDir = path.join(__dirname, '../public');
//////////////////////////////////////////////////////////////




profileController.post('/uploadprofile', upload.single('photo'), (req, res, next)=>{

  let newPicture ={
    name: req.body.name,
    pictureType: 'PROFILE',
    albumn_id: undefined,
    owner_id: req.user.id,
    pic_path: `/uploads/${req.file.filename}`,
    pic_name: req.file.originalname
  };

  Picture.populate(req.user,{
    path: 'picture'
  }, (err, userPicture) =>{
    if(err){
      next(err);
    }

    fs.unlink(path.join(destDir, userPicture.picture.pic_path), (err)=>{
      if(err){
        next(err);
      }
      else {
        Picture.findByIdAndUpdate(userPicture.picture._id, newPicture ,{new:true}, (err,picture)=>{
          req.user.picture = picture._id;
          req.user.save((err, userUpdated)=>{
            if(err){
              next(err);
            }
              Picture.populate(userUpdated,{path: 'picture'},(err,userPicture)=>{
              res.render('intranet/users/edit',{user: userUpdated , message: "Picture changed"});
              // res.redirect('/'+req.user.username+'/profile');
            });
          });
        });
      }
    });
  });
});

profileController.get('/:username/profile', auth.ensureLoggedIn('/login'), (req, res, next) => {

  let username = req.params.username;

  User.findOne({
    username: req.params.username
  }).populate('picture').exec((err, user) => {
    if (err) {
      next(err);
    }
    if (user.routes.length === 0) {
      Wall.findOne({
        _id: user.wall
      }).populate('messages').exec((err, wall) => {
        if (err) {
          next(err);
        }
        res.render('intranet/users/profile', {
          user,
          wall
        });
      });
    } else {
      Route.populate(user, {
        path: 'routes'
      }, (err, userPopulated) => {
        Wall.findOne({
          _id: user.wall
        }).populate('messages').exec((err, wall) => {
          if (err) {
            next(err);
          }
          res.render('intranet/users/profile', {
            user,
            wall
          });
        });
      });
    }
  });
});

profileController.post('/:user_id/profile/wallmessage', auth.ensureLoggedIn('/login'), (req, res, next) => {
  console.log('ENTRADA 1');
  let newMessage = {
    message: req.body.wallText,
    owner_id: req.user.id,
    dest_id: req.params.user_id,
    messageType: "WALL"
  };
  console.log('newMessage', newMessage);
  User.findById({
    _id: req.params.user_id
  }).populate('wall').exec((err, userwall) => {
    if(err){
      next(err);
    }
    else{

      console.log('ENTRADA 2');
      console.log('newMessage', newMessage);

      Message.create(newMessage, (err, message) => {
        if (err) {
          console.log('no tengo ni puta idea de por que rompe aqui');
          console.log('newMessage', newMessage);
          next(err);
        }else{
        console.log('ENTRADA 3');
        console.log('userwall', userwall);
        console.log('userwall.wall', userwall.wall);

          userwall.wall.messages.push(message);
          userwall.wall.save((err, updatedWall) => {
            if (err) {
              next (err);
            }else{
              console.log('updatedWall', updatedWall);
              req.user.messages.push(message);
              req.user.save((err, updatedUser) => {
                if (err) {
                  next (err);
                }else{
                  console.log('updatedUser', updatedUser);
                  return res.redirect('/'+ userwall.username +'/profile');
                }
              });
            }
          });
        }
      });
    }
  });
});
////////////////////////////////NEW ROUTE///////////////////////////

profileController.get('/:username/edit' , auth.ensureLoggedIn('/login'), (req,res,next)=>{
  User.findOne({username: req.params.username }).populate("picture").exec ((err, user)=>{
    if(err){
      next(err);
    }
    console.log("///////////////////////////+++++++++++++++++");
    console.log("user", user);
    res.render('intranet/users/edit',{user});
  });

});

profileController.post('/:username/edit',auth.ensureLoggedIn('/login'),(req,res)=>{
  const username = req.body.username;
  const name = req.body.name;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  // const role = ((req.user.role === 'ADMIN')? 'ADMIN':'USER');
  const ubication = req.body.ubication;
  const address = req.body.address;
  if (username === "" || name === ""|| lastName === ""|| email === ""|| ubication === ""|| address === "" || password === "" ) {
    res.render("intranet/users/edit",{user}, {
      message: "Indicate username, email, password and role"
    });
    return;
  }
  User.find({$or:[{username:username},{email:email}]}, "username email", (err, users) => {
    if (users.length){
      users.forEach((user)=>{
        if(user._id != req.user.id && (req.user.username === user.username|| req.user.email === user.email)){
          res.render("intranet/users/edit", {
            message: "The username or email already exists"
          });
          return;
        }
      });
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const editedUser = {
      username: username,
      name: name,
      lastName: lastName,
      email: email,
      password: hashPass,
      ubication: ubication,
      address: address
    };
    console.log("la estamos liando aqui?");
    User.findOneAndUpdate({username:req.params.username},editedUser,{new:true}, (err, user)=>{
      if(err){
        next(err);
      }
      req.user = user;
      Picture.populate(user,{path: 'picture'},(err,userPicture)=>{
        res.render('intranet/users/edit',{user: userPicture , message: "User Edited"});
        // res.redirect('/'+req.user.username+'/profile');
      });
    });
  });
});




module.exports = profileController;
