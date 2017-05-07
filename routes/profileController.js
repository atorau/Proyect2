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


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

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
    } else {
      // user.populate('routes').exec((err, user) => {
      Route.populate(user, {
        path: 'routes'
      }).exec((err, user) => {

        console.log('//////////////////////////////////');
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

    }




    // console.log('+++++++++++++++++++++++++++++++++++');
    // if (user.wall === undefined) {
    //   const userWall = new Wall({
    //     owner_id: user._id,
    //     wallType: 'USER',
    //     message: []
    //   });
    //
    //   Wall.create(userWall, (err, wall) => {
    //     if (err) {
    //       next(err);
    //     }
    //     res.render('intranet/users/profile', {
    //       user,
    //       wall
    //     });
    //   });
    //
    // } else {
    //   Wall.findOne({
    //     _id: user.wall
    //   }, (err, wall) => {
    //     if (err) {
    //       next(err);
    //     }
    //     res.render('intranet/users/profile', {
    //       user,
    //       wall
    //     });
    //   });
    // }
  });
});





module.exports = profileRoutes;
