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


/////////////////////////////FS FILES////////////////////////
const fs = require('fs');
const path = require('path');
//////////////////////////////////////////////////////////////


profileController.post('/uploadprofile', upload.single('photo'), function(req, res){

  let newPicture = new Picture({
    name: req.body.name,
    pictureType: 'PROFILE',
    albumn_id: undefined,
    owner_id: req.user.id,
    pic_path: `/uploads/${req.file.filename}`,
    pic_name: req.file.originalname
  });

  Picture.populate(req.user,{
    path: 'picture'
  }, (err, userPicture) =>{
    if(err){
      next(err);
    }

    fs.unlink(user.picture.pic_path);
    
    newPicture.save((err,picture) => {
        req.user.picture = picture._id;
        req.user.save((err, userUpdated)=>{
          if(err){
            next(err);
          }
          console.log("req.user",req.user);
          console.log("picture._id",picture._id);
          res.redirect('/'+req.user.username+'/profile');
        });
    });
  });
});

profileController.get('/:username/profile', auth.ensureLoggedIn('/login'), (req, res, next) => {

  let username = req.params.username;

  User.findOne({
    username: username
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



module.exports = profileController;
