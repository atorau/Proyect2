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

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const passport = require("passport");

const auth = require('../helpers/auth-helpers');


profileRoutes.get('/:username/profile', (req, res, next) => {

  let username = req.params.username;

  User.findOne({
    username: username
  }).populate('routes').exec((err, user) => {
    if (err) {
      next(err);
    }
    if (user.wall !== undefined) {
      const userWall = new Wall({
        owner_id: user._id,
        wallType: 'USER',
        message: []
      });

      Wall.create(userWall, (err, wall) => {
        if (err) {
          next(err);
        }
        res.render('intranet/users/profile', {
          user,
          wall
        });
      });

    } else {
      Wall.findOne({
        _id: user.wall
      }, (err, wall) => {
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
});





module.exports = profileRoutes;
