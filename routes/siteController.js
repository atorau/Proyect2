const express = require("express");
const siteController = express.Router();

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const passport = require("passport");

/* GET home page. */
siteController.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Express'
  });
});

siteController.get('/shop', (req, res, next) => {
  res.render('shop')
});

siteController.get('/calendar', (req, res, next) => {
  res.render('calendar')
});

siteController.get('/history', (req, res, next) => {
  res.render('history')
});


siteController.get('/intranet', (req, res, next) => {
  res.render('intranet')
});

module.exports = siteController;
