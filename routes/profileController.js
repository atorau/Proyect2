/*jshint esversion: 6*/
// routes/auth-routes.js
const express = require("express");
const profileRoutes = express.Router();
const multer = require('multer');
var upload = multer({
  dest: "./public/upload"
});
const Picture = require("../models/picture");

// User model
const User = require("../models/user");
const Wall = require("../models/wall");
const Route = require("../models/route");
const Message = require("../models/message");

const passport = require("passport");

const auth = require('../helpers/auth-helpers');


profileRoutes.get('/:username/profile', auth.ensureLoggedIn('/login'), (req, res, next) => {

  let username = req.params.username;
  console.log('username', username);

  User.findOne({
    username: username
  }, (err, user) => {
    if (err) {
      next(err);
    }
    console.log('user.routes', user.routes);
    if (user.routes.length === 0) {
      console.log('+++++++++++++++++++++++++++++++++++');
      if (user.wall === undefined) {
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
              console.log('ENTRADA 6');
              return res.render('intranet/users/profile', {
                user,
                wall
              });
            }
          });
        });

      } else {
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
      }
    } else {
      // user.populate('routes').exec((err, user) => {
      Route.populate(user, {
        path: 'routes'
      }).exec((err, user) => {

        console.log('------------------------------');
        if (user.wall === undefined) {
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
                console.log('ENTRADA 6');
                return res.render('intranet/users/profile', {
                  user,
                  wall
                });
              }
            });
          });

        } else {
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
        }

      });

    }
  });
});

profileRoutes.post('/:user_id/profile/wallmessage', auth.ensureLoggedIn('/login'), (req, res, next) => {
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
      // let newMessage = {
      //   message: req.body.wallText,
      //   owner_id: req.user,
      //   dest_id: req.params.user_id,
      //   messageType: "WALL"
      // };

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




module.exports = profileRoutes;
