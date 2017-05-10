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
const Albumn = require("../models/albumn");
const Track = require("../models/track");

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

profileController.post('/profile/:user_id/pictures/upload', upload.single('photo'), (req, res, next)=>{

  let newPicture ={
    name: req.body.name,
    pictureType: 'PROFILE',
    albumn_id: undefined,
    owner_id: req.params.user_id,
    pic_path: `/uploads/${req.file.filename}`,
    pic_name: req.file.originalname
  };

  User.findById({_id: req.params.user_id }).populate("picture").exec((err,userPicture)=>{
    if(err){
      next(err);
    }
    fs.unlink(path.join(destDir, userPicture.picture.pic_path), (err)=>{
      if(err){
        next(err);
      }
      else {
        Picture.findByIdAndUpdate(userPicture.picture._id, newPicture ,{new:true}, (err,picture)=>{
          userPicture.picture = picture._id;
          userPicture.save((err, userUpdated)=>{
            if(err){
              next(err);
            }
              Picture.populate(userUpdated,{path: 'picture'},(err,userPicture)=>{
              res.render('intranet/users/edit',{user: userUpdated , message: "Picture changed"});
            });
          });
        });
      }
    });
  });
});

profileController.get('/profile/:user_id/show', auth.ensureLoggedIn('/login'), (req, res, next) => {

  User.findById({
    _id: req.params.user_id
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

profileController.post('/profile/:user_id/walls/:wall_id/messages/new', auth.ensureLoggedIn('/login'), (req, res, next) => {

  let newMessage = {
    message: req.body.wallText,
    owner_username: req.user.username,
    owner_id: req.user.id,
    dest_id: req.params.user_id,
    wall_id: req.params.wall_id,
    messageType: "WALL"
  };

  User.findById({_id: req.params.user_id}).populate('wall').exec((err, userwall) => {
    if(err){
      next(err);
    }
    else{
      Message.create(newMessage, (err, message) => {
        if (err) {
          next(err);
        }else{
          userwall.wall.messages.push(message);
          userwall.wall.save((err, updatedWall) => {
            if (err) {
              next (err);
            }else{
              return res.redirect('/profile/'+ userwall._id+'/show');
            }
          });
        }
      });
    }
  });
});

profileController.get('/profile/:user_id/edit' , auth.ensureLoggedIn('/login'), (req,res,next)=>{
  User.findById({_id: req.params.user_id }).populate("picture").exec ((err, user)=>{
    if(err){
      next(err);
    }
    res.render('intranet/users/edit',{user});
  });
});

profileController.post('/profile/:user_id/edit',auth.ensureLoggedIn('/login'),(req,res,next)=>{
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
    if(err){
      next(err);
    }
    User.findById({_id:req.params.user_id},(err,userEdited)=>{
      if(err){
        next(err);
      }
      if (users.length){
        users.forEach((user)=>{
          if(user._id != userEdited._id && (userEdited.username === user.username|| userEdited.email === user.email)){
            res.render("intranet/users/edit", {
              message: "The username or email already exists"
            });
            return;
          }
        });
      }
    });
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

    User.findByIdAndUpdate({_id:req.params.user_id},editedUser,{new:true}, (err, user)=>{
      if(err){
        next(err);
      }
      Picture.populate(user,{path: 'picture'},(err,userPicture)=>{
        res.render('intranet/users/edit',{user: userPicture , message: "User Edited"});
      });
    });
  });
});
//not good with async
profileController.post('/profile/:user_id/delete',auth.ensureLoggedIn('/login'),(req,res,next)=>{
  User.findByIdAndRemove({_id:req.params.user_id},(err,user)=>{
    if(err){
      next(err);
    }
    Route.find({owner_id:user._id},(err,routes)=>{
      if(err){
        next(err);
      }
      if(routes!==null){
        routes.forEach((route)=>{
          Message.deleteMany({route_id: route._id},(err)=>{
            if(err){
              next(err);
            }
          });
        });
      }
      Route.deleteMany({owner_id:user._id},(err)=>{
        if(err){
          next(err);
        }
        Albumn.deleteMany({owner_id:user._id},(err)=>{
          if(err){
            next(err);
          }
          Wall.findOne({owner_id:user._id},(err,wall)=>{
            if(err){
              next(err);
            }
            Message.deleteMany({wall_id: wall._id },(err)=>{
              if(err){
                next(err);
              }
              wall.remove((err, pictureRemoved)=>{
                if(err){
                  next(err);
                }
                Picture.find({owner_id: user._id},(err,pictures)=>{
                  if(err){
                    next(err);
                  }
                  if(pictures!==null){
                    pictures.forEach((picture)=>{
                      fs.unlink(path.join(destDir, picture.pic_path), (err)=>{
                        if(err){
                          next(err);
                        }else{
                          picture.remove((err, pictureRemoved)=>{
                            if(err){
                              next(err);
                            }
                          });
                        }
                      });
                    });
                  }
                  Track.find({owner_id: user._id},(err,tracks)=>{
                    if(err){
                      next(err);
                    }
                    if(tracks!==null){
                      tracks.forEach((track)=>{
                        fs.unlink(path.join(destDir, track.file_path), (err)=>{
                          if(err){
                            next(err);
                          }else{
                            track.remove((err)=>{
                              if(err){
                                next(err);
                              }
                            });
                          }
                        });
                      });
                    }
                    res.redirect(`/main`);
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

module.exports = profileController;
