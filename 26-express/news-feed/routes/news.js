var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const newsItems = [
    {
      id:1,
      title: "7canal",
      link: "https://www.inn.co.il",
      score: 10,
    },
    {
      id:2,
      title: "israel",
      link: "https://www.inn.co.il",
      score: 5,
    }
  ];
  res.render('news/index', { newsItems });
});

router.post('/', function(req,res,next) {
  res.send("POST route");
})

router.put('/:id', function(req,res,next) {
  res.send("PUT route");
})

router.delete('/:id', function(req,res,next) {
  res.send("DELETE route");
})

module.exports = router;
