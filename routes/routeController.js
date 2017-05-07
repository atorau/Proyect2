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
      res.render('/routes/'+ route._id+ '/show');
    });
  });

});

routeController.get('/routes/:route_id/show',auth.ensureLoggedIn('/login'), (req,res,next)=>{

  console.log('por aqui pasa');
  let routeQuery=[{comments},{albumn},{track}];

  Route.findById({_id: route_id}).populate(routeQuery).exec((err,route)=>{
    if (err){
      next (err);
    }

    console.log("route",route);
    res.render("intranet/routes/show"); // var populateQuery = [{path:'books', select:'title pages'}, {path:'movie', select:'director'}];
    // //    Person.find({})
    //     .populate(populateQuery)
    //     .execPopulate()
  });
});







module.exports= routeController;
