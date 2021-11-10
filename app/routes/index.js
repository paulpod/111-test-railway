var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
  req.session.destroy();
  res.render('index.html');
});

router.get('/index-gpoc', function (req, res) {
  req.session.destroy();
  res.render('index-gpoc.html');
});

module.exports = router
