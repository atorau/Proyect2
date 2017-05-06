const express = require("express");
const siteController = express.Router();
const auth = require('../helpers/auth-helpers');

// User model
const User = require("../models/user");
// Wall model
const Wall = require("../models/wall");

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


siteController.get('/intranet', auth.ensureLoggedIn('/login'), (req, res, next) => {


});

siteController.get('/main', auth.ensureLoggedIn('/login'), (req, res, next) => {
  Wall.find({wallType: 'GLOBAL'},(err,wall)=>{
    if (err) {
      next(err);
    }
    else {
      User.find({},(err,users)=>{
        console.log("users",users);
        res.render('intranet/main',{users:users, wall:wall});
      });
    }
  });
});

module.exports = siteController;
