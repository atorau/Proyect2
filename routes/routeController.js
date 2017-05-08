const express = require("express");
const routeController = express.Router();
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

  Route.create(newRoute,(err, route)=>{
    if(err){
      next(err);
    }
    req.user.routes.push(route);
    req.user.save((err, user)=>{
      if(err){
        next(err);
      }
      res.redirect('/routes/'+ route._id+ '/show');
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
    // if(route.comments !== 0){
      // route.findOne(route).populate(comments)

      // }
  // Route.findById({_id: req.params.route_id},(err,route)=>{
  //   if (err){
  //     next (err);
  //   }
  //   if(route.albumn!==undefined)
  //   {
  //     Albumn
  //   }
  //   else{
  //
  //   }

    console.log("route",route);
    res.render("intranet/routes/show",{route}); // var populateQuery = [{path:'books', select:'title pages'}, {path:'movie', select:'director'}];
    // //    Person.find({})
    //     .populate(populateQuery)
    //     .execPopulate()
  });
});







module.exports= routeController;
