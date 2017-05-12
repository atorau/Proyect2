/*jshint esversion: 6*/
// routes/auth-routes.js
const express = require("express");
const profileController = express.Router();

const multer = require('multer')({
  dest: "./public/uploads",
  fileFilter: (req, file, cb) => {
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    req.fileValidationError = 'goes wrong on the mimetype';
    cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
  }
});

var pictureUpload = multer.single('photo');


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
const googleHelper = require('../helpers/google-api');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/////////////////////////////FS FILES////////////////////////
const fs = require('fs');
const path = require('path');
let destDir = path.join(__dirname, '../public');
//////////////////////////////////////////////////////////////

// profileController.post('/profile/:user_id/pictures/upload', auth.ensureLoggedIn('/login'), upload.single('photo'), (req, res, next)=>{

profileController.post('/profile/:user_id/pictures/upload', auth.ensureLoggedIn('/login'), (req, res, next)=>{

  if(req.user.id!=req.params.user_id){
    return res.redirect('/main');
  }

  User.findById({_id: req.params.user_id }).populate("picture").exec((err,userPicture)=>{
    if(err){
      return next(err);
    }

    pictureUpload(req, res, (err)=>{
      if (err)
      {
        return res.render('intranet/users/edit',{user: userPicture , message: "Not accepted format"});
      }
      if(req.file!== undefined){
        let newPicture ={
          name: req.body.name,
          pictureType: 'PROFILE',
          albumn_id: undefined,
          owner_id: req.params.user_id,
          pic_path: `/uploads/${req.file.filename}`,
          pic_name: req.file.originalname
        };

        fs.unlink(path.join(destDir, userPicture.picture.pic_path), (err)=>{
          if(err){
            return next(err);
          }
          else {
            Picture.findByIdAndUpdate(userPicture.picture._id, newPicture ,{new:true}, (err,picture)=>{
              userPicture.picture = picture._id;
              userPicture.save((err, userUpdated)=>{
                if(err){
                  return next(err);
                }
                  Picture.populate(userUpdated,{path: 'picture'},(err,userPicture)=>{
                  res.render('intranet/users/edit',{user: userUpdated , message: "Picture changed"});
                });
              });
            });
          }
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
      return next(err);
    }

    if (user.routes.length === 0) {
      Wall.findOne({
        _id: user.wall
      }).populate('messages').exec((err, wall) => {
        if (err) {
          return next(err);
        }
        return res.render('intranet/users/profile', {
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
            return next(err);
          }
          return res.render('intranet/users/profile', {
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
      return next(err);
    }
    else{
      Message.create(newMessage, (err, message) => {
        if (err) {
          return next(err);
        }else{
          userwall.wall.messages.push(message);
          userwall.wall.save((err, updatedWall) => {
            if (err) {
              return next (err);
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

  if(req.user.id!=req.params.user_id){
    return res.redirect('/main');
  }

  User.findById({_id: req.params.user_id }).populate("picture").exec ((err, user)=>{
    if(err){
      return next(err);
    }
    return res.render('intranet/users/edit',{user:user});
  });
});

// profileController.post('/profile/:user_id/edit',auth.ensureLoggedIn('/login'),(req,res,next)=>{
//
//   if(req.user.id!=req.params.user_id){
//     return res.redirect('/main');
//   }
//
//   const username = req.body.username;
//   const name = req.body.name;
//   const lastName = req.body.lastName;
//   const email = req.body.email;
//   const password = req.body.password;
//   // const role = ((req.user.role === 'ADMIN')? 'ADMIN':'USER');
//   const ubication = req.body.ubication;
//   const address = req.body.address;
//   if (username === "" || name === ""|| lastName === ""|| email === ""|| ubication === ""|| address === "" || password === "" ) {
//     User.findById({_id: req.params.user_id }).populate("picture").exec ((err, user)=>{
//       if(err){
//         return next(err);
//       }
//       return res.render("intranet/users/edit",{user:user,
//         message: "Indicate username, email, password and role"
//       });
//     });
//   }
//   User.find({$or:[{username:username},{email:email}]}, "username email", (err, users) => {
//     if(err){
//       next(err);
//     }
//     User.findById({_id:req.params.user_id}).populate("picture").exec((err,userEdited)=>{
//       if(err){
//         next(err);
//       }
//       if (users.length){
//         users.forEach((user)=>{
//           if(user._id != userEdited._id && (userEdited.username === user.username|| userEdited.email === user.email)){
//             console.log("HI2");
//             res.render("intranet/users/edit", {user: userEdited,
//               message: "The username or email already exists"
//             });
//             return;
//           }
//         });
//       }
//     });
//     const salt = bcrypt.genSaltSync(bcryptSalt);
//     const hashPass = bcrypt.hashSync(password, salt);
//
//     const editedUser = {
//       username: username,
//       name: name,
//       lastName: lastName,
//       email: email,
//       password: hashPass,
//       ubication: ubication,
//       address: address
//     };
//
//     User.findByIdAndUpdate({_id:req.params.user_id},editedUser,{new:true}, (err, user)=>{
//       if(err){
//         next(err);
//       }
//       Picture.populate(user,{path: 'picture'},(err,userPicture)=>{
//         console.log("HI2");
//         res.render('intranet/users/edit',{user: userPicture , message: "User Edited"});
//       });
//     });
//   });
// });
//not good with async
profileController.post('/profile/:user_id/edit',auth.ensureLoggedIn('/login'),(req,res,next)=>{

  if(req.user.id!=req.params.user_id){
    return res.redirect('/main');
  }

  const username = req.body.username;
  const name = req.body.name;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  // const role = ((req.user.role === 'ADMIN')? 'ADMIN':'USER');
  const ubication = req.body.ubication;
  const address = req.body.address;
  if (username === "" || name === ""|| lastName === ""|| email === ""|| ubication === ""|| address === "" || password === "" ) {
    User.findById({_id: req.params.user_id }).populate("picture").exec ((err, user)=>{
      if(err){
        return next(err);
      }
      return res.render("intranet/users/edit",{user:user,
        message: "Indicate username, email, password and role"
      });
    });
  }


  User.count({$or:[{username:username},{email:email}]},(err,count)=>{
    if(err)
    {
      return next(err);
    }
    if(count>1){
      return res.render("intranet/users/edit", {user: userEdited,
        message: "The username or email already exists"
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
      address: address,
    };

    User.findByIdAndUpdate({_id:req.params.user_id},editedUser,{new:true}, (err, user)=>{
      if(err){
        next(err);
      }
      //req.user = user;
      Picture.populate(user,{path: 'picture'},(err,userPicture)=>{
        console.log("HI2");
        console.log("req.user",req.user);
        console.log("user",user);
        console.log("userPicture",userPicture);
        return res.render('intranet/users/edit',{user: userPicture , message: "User Edited"});
      });
    });
  });
});









profileController.get('/profile/:user_id/delete',auth.ensureLoggedIn('/login'),(req,res,next)=>{
  if(req.user.id!=req.params.user_id){
    return res.redirect('/main');
  }
  console.log("entra aqui1");
  User.findByIdAndRemove({_id:req.params.user_id},(err,user)=>{
    if(err){
      console.log("entra aqui2");
      return next(err);
    }
    console.log("entra aqui3");
    Route.find({owner_id:user._id},(err,routes)=>{
      if(err){
        console.log("entra aqui4");
        return next(err);
      }
      console.log("entra aqui5");
      if(routes!==null){
        console.log("entra aqui6");
        routes.forEach((route)=>{
          console.log("entra aqui7");
          let data = {
            eventId: route.eventId,
            calendarId: process.env.CALENDAR_ID,
          };
          console.log("entra aqui8");
          googleHelper.deleteEventHelper(data,(err,event)=>{
            if(err){
              console.log("entra aqui9");
              return next(err);
            }
            console.log("entra aqui10");
            Message.findOneAndRemove({routeOwner_id:route._id },(err,message)=>{
              if(err){
                console.log("entra aqui11");
                return next(err);
              }
              console.log("entra aqui12");
              Wall.findByIdAndUpdate({_id:message.wall_id},  {'$pull': {'messages': message._id }},{new:true},(err,wall)=>{
                if(err){
                  console.log("entra aqui13");
                  return next(err);
                }
                console.log("entra aqui14");
                Message.deleteMany({route_id: route._id},(err)=>{
                  if(err){
                    console.log("entra aqui15");
                    return next(err);
                  }
                });
              });
            });
          });
        });
      }
      console.log("entra aqui16");
      Route.deleteMany({owner_id:user._id},(err)=>{
        if(err){
          console.log("entra aqui17");
          return next(err);
        }
        console.log("entra aqui18");
        Albumn.deleteMany({owner_id:user._id},(err)=>{
          if(err){
            console.log("entra aqui19");
            return next(err);
          }
          console.log("entra aqui20");
          Wall.findOne({owner_id:user._id},(err,wall)=>{
            if(err){
              console.log("entra aqui21");
              return next(err);
            }
            console.log("entra aqui22");
            Message.deleteMany({wall_id: wall._id },(err)=>{
              if(err){
                console.log("entra aqui23");
                return next(err);
              }
              console.log("entra aqui24");
              wall.remove((err, pictureRemoved)=>{
                if(err){
                  console.log("entra aqui25");
                  return next(err);
                }
                console.log("entra aqui26");
                Picture.find({owner_id: user._id},(err,pictures)=>{
                  if(err){
                    console.log("entra aqui27");
                    return next(err);
                  }
                  console.log("entra aqui28");
                  if(pictures!==null){
                    console.log("entra aqui29");
                    pictures.forEach((picture)=>{
                      console.log("entra aqui30");
                      fs.unlink(path.join(destDir, picture.pic_path), (err)=>{
                        if(err){
                          console.log("entra aqui31");
                          return next(err);
                        }else{
                          console.log("entra aqui32");
                          picture.remove((err, pictureRemoved)=>{
                            if(err){
                              console.log("entra aqui33");
                              return next(err);
                            }
                          });
                        }
                      });
                    });
                  }
                  console.log("entra aqui34");
                  Track.find({owner_id: user._id},(err,tracks)=>{
                    if(err){
                      console.log("entra aqui35");
                      return next(err);
                    }
                    console.log("entra aqui36");
                    if(tracks!==null){
                      console.log("entra aqui37");
                      tracks.forEach((track)=>{
                        console.log("entra aqui38");
                        fs.unlink(path.join(destDir, track.file_path), (err)=>{
                          if(err){
                            console.log("entra aqui39");
                            return next(err);
                          }else{
                            console.log("entra aqui40");
                            track.remove((err)=>{
                              if(err){
                                console.log("entra aqui41");
                                return next(err);
                              }
                            });
                          }
                        });
                      });
                    }
                    console.log("entra aqui42");
                    return res.redirect(`/main`);
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
