const express = require("express");
const siteController = express.Router();
const auth = require('../helpers/auth-helpers');

// User model
const User = require("../models/user");
// Wall model
const Wall = require("../models/wall");
// Message model
const Message = require("../models/message");

/* GET home page. */
siteController.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Express'
  });
});

siteController.get('/shop', (req, res, next) => {
  res.render('shop');
});

siteController.get('/calendar', (req, res, next) => {
  res.render('calendar');
});

siteController.get('/history', (req, res, next) => {
  res.render('history');
});

siteController.get('/main', auth.ensureLoggedIn('/login'), (req, res, next) => {

  Wall.findOne({
    wallType: 'GLOBAL'
  }).populate('messages').exec((err, wall) => {
    if (err) {
      next(err);
    } else {
      // console.log("********************************");
      // console.log("wall",wall);
      User.find({}, (err, users) => {
        // console.log("users",users);
        res.render('intranet/main', {
          users,
          wall
        });
      });
    }
  });

});

siteController.post('/:wall_id/messages/new', auth.ensureLoggedIn('/login'), (req, res, next) => {

  Wall.findById({
    _id: req.params.wall_id
  }, (err, wall) => {
    if (err){
      next(err);
    }
    let newMessage = {
      message: req.body.wallText,
      owner_name: req.user.username,
      owner_id: req.user.id,
      dest_id: undefined,
      wall_id: req.params.wall_id,
      messageType: "GLOBAL"
    };

    Message.create(newMessage, (err, message) => {
      if (err) {
        next(err);
      }
      wall.messages.push(message);
      wall.save((err, updatedWall) => {
        if (err) {
          throw err;
        }
        res.redirect('/main');
      });
    });
  });
});

module.exports = siteController;
