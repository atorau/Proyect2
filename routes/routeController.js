var dotenv = require('dotenv');
dotenv.load();

const express = require("express");
const routeController = express.Router();
const multer = require('multer');
var uploadPhoto = multer({
  dest: "./public/uploads/albumns"
});
var uploadTrack = multer({
  dest: "./public/uploads/tracks"
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

routeController.get('/routes/new', auth.ensureLoggedIn('/login'), (req, res, next) => {
  console.log('hola guapo!!!');
  res.render('intranet/routes/new');

});

routeController.post('/routes/new',auth.ensureLoggedIn('/login'),(req, res, next)=>{
  let newRoute= {
    name:req.body.name,
    ubication: req.body.ubication,
    date:req.body.date,
    description:req.body.description,
    owner_id: req.user.id,
    comments:[],
    albumn: undefined,
    track:undefined
  };
///////////////////////////////////////////////////////////////
  Route.create(newRoute,(err, route)=>{
    if(err){
      next(err);
    }
    let newAlbumn={
      title: route.name,
      pictures:[],
      route_id: route._id,
      owner_id: route.owner_id,
    };
    Albumn.create(newAlbumn, (err, albumn)=>{
      if(err){
        next(err);
      }
      route.albumn = albumn._id;
      route.save((err, routeUpdated)=>{
        if(err){
          next(err);
        }
        req.user.routes.push(route);
        req.user.albumns.push(albumn);
        req.user.save((err,userUpdated)=>{
          if(err){
            next(err);
          }
          res.redirect('/routes/'+ route._id+ '/show');
        });
      });
    });
  });
});

routeController.get('/routes/:route_id/show',auth.ensureLoggedIn('/login'), (req,res,next)=>{

  console.log('por aqui pasa');
  let routeQuery=[{path: "comments"},{path: "albumn"},{path: "track"}];

  Route.findById({_id: req.params.route_id}).populate(routeQuery).exec((err,route)=>{
    if (err){
      next (err);
    }
    console.log("route",route);
    console.log("++++++++++++++++++++++++++++++++++++++");
    console.log("key", process.env.GOOGLE_KEY);
    res.render("intranet/routes/show",{route: route, key: process.env.GOOGLE_KEY});
  });
});


routeController.post('/routes/:route_id/comment',auth.ensureLoggedIn('/login'), (req,res,next)=>{
  Route.findById({_id: req.params.route_id}, (err,route)=>{
    if(err){
      next(err);
    }
    let newComment ={
      message:req.body.comment,
      owner_id: req.user.id,
      dest_id: route.owner_id,
      messageType: "ROUTE"
    };
    Message.create(newComment, (err, comment) => {
      if (err) {
        next(err);
      }else{
        route.comments.push(comment);
        route.save((err, updatedRoute) => {
          if (err) {
            next (err);
          }else{
            req.user.messages.push(comment);
            req.user.save((err, updatedUser) => {
              if (err) {
                next (err);
              }else{
                return res.redirect('/routes/'+ updatedRoute._id +'/show');
              }
            });
          }
        });
      }
    });
  });
});


routeController.get('/routes/:albumn_id/albumn',auth.ensureLoggedIn('/login'),(req,res, next)=>{
  Albumn.findById({_id: req.params.albumn_id}).populate("pictures").exec((err,albumn)=>{
    if(err){
      next(err);
    }
    else{
      res.render('intranet/albumns/show',{albumn});
    }
  });
});

routeController.post('/routes/:albumn_id/uploadalbumnimage', uploadPhoto.single('photo'), (req, res, next)=>{
  Albumn.findById({_id: req.params.albumn_id}, (err,albumn)=>{
    if(err){
      next(err);
    }
    let newPicture = new Picture({
      name: req.body.name,
      pictureType: 'ALBUMN',
      albumn_id: albumn._id,
      route_id: albumn.route_id,
      owner_id: albumn.owner_id,
      pic_path: `/uploads/albumns/${req.file.filename}`,
      pic_name: req.file.originalname
    });
    newPicture.save((err,picture) => {
        albumn.pictures.push(picture);
        albumn.save((err, albumnUpdated)=>{
          if(err){
            next(err);
          }
          res.redirect('/routes/'+ albumn._id +'/albumn');
      });
    });
  });
});


routeController.post('/routes/:route_id/uploadtrack', uploadTrack.single("track"),(req,res,next)=>{
  Route.findById({_id: req.params.route_id}, (err,route)=>{
    if(err){
      next(err);
    }
    let newTrack = new Track({
      name: route.name,
      file_path: `/uploads/tracks/${req.file.filename}`,
      file_name: req.file.originalname,
      route_id : route._id,
      owner_id : route.owner_id
    });
    newTrack.save((err,track)=>{
      if(err){
        next(err);
      }
      route.track = track._id;
      route.save((err,updatedRoute)=>{
        if(err){
          next(err);
        }
        req.user.tracks.push(track);
        req.user.save((err,updatedUser)=>{
          if(err){
            next(err);
          }
          res.redirect('/routes/'+ route._id +'/show');
        });
      });
    });
  });
});

routeController.get('/routes/index',auth.ensureLoggedIn('/login'),(req, res, next)=>{
  Route.find({}, (err,routes)=>{
    if(err){
      next(err);
    }
    res.render('intranet/routes/index',{routes:routes});
  });
});



module.exports= routeController;
