const createError = require('http-errors');
var express = require('express');
var router = express.Router();

const newsManager = require('../lib/news-manager');

/* GET home page. */
router.get('/', function(req, res, next) {
  try {
    const {newsItems} = newsManager.getItems();
    res.render('news/index', { newsItems });
  }
  catch (e) {
    return next(createError(e));
  }

});

router.post('/', function(req,res,next) {
  try {
    newsManager.addItem(req.body)
    res.redirect('/news');
  }
  catch (e) {
    return next(createError(e));
  }

})

router.put('/:id', function(req,res,next) {
  res.send("PUT route");
})

router.delete('/:id', function(req,res,next) {
  res.send("DELETE route");
})

module.exports = router;
