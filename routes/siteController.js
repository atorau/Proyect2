const express = require("express");
const siteController = express.Router();
const auth = require('../helpers/auth-helpers');

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
  res.render('intranet/main');
});

siteController.get('/main', auth.ensureLoggedIn('/login'), (req, res, next) => {
  res.render('intranet/main');
});

module.exports = siteController;
