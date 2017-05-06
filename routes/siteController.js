const express = require("express");
const siteController = express.Router();
const auth = require('../helpers/auth-helpers');

// User model
const User = require("../models/user");

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
  User.find({},(err,users)=>{
    console.log("users",users);
    res.render('intranet/main',{users: users});
  });
});

module.exports = siteController;
