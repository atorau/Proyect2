var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/shop', (req, res, next) => {
  res.render('shop')
});

router.get('/calendar', (req, res, next) => {
  res.render('calendar')
});

router.get('/history', (req, res, next) => {
  res.render('history')
});

module.exports = router;
