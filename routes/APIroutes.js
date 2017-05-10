const express = require("express");
const APIroutes = express.Router();
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

 //auth.ensureLoggedIn('/login'),
APIroutes.get('/:route_id/trackname', (req, res, next) => {
  Route.findById({_id:req.params.route_id},(err, route) => {
    if (err) {
      res.status(500).json({message: err});
    } else {
      if(route.track!==undefined)
      {
        Track.populate(route,{path:"track"},(err,routeTrack)=>{
          console.log("hi",route.track.file_path);
          res.status(200).json(route.track.file_path);
        });  
      }
    }
  });

});

module.exports= APIroutes;
