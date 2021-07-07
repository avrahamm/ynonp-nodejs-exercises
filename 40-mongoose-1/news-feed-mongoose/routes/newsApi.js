/**
 * This commit is for links api from
 * @link:https://www.tocode.co.il/bundles/nodejs/lessons/34-api-lab?tab=video
 */

const createError = require('http-errors');
var express = require('express');
var router = express.Router();

const newsManager = require('../lib/news-manager');

/**
 * curl localhost:3000/api/v1.0/news
 */
router.get('/', function(req, res, next) {
  try {
    const {newsItems} = newsManager.getItems();
    res.send(newsItems.sort(newsManager.sortDescByScore));
  }
  catch (e) {
    return next(createError(e));
  }

});

/**
 * curl -d title="api test" -d link="www.tocode.il" localhost:3000/api/v1.0/news
 */
router.post('/', function(req,res,next) {
  try {
    newsManager.addItem(req.body)
    res.sendStatus(204);
  }
  catch (e) {
    return next(createError(e));
  }

})

/**
 * curl -X PUT -d update_score="-1" localhost:3000/api/v1.0/news/8
 */
router.put('/:id', function(req,res,next) {
  try {
    newsManager.updateItem(req);
    res.sendStatus(204);
  }
  catch (e) {
    return next(createError(e));
  }
})

module.exports = router;
