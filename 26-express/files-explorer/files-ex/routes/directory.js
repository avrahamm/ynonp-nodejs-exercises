var express = require('express');
var router = express.Router();
const fs = require('fs-extra');

const {
  treeRecSync, getCopiedTargetRealPath
} = require('../lib/utils/files');

const isValidTarget = require('../lib/middlewares/is-valid-target');
router.use('/', isValidTarget);

/* GET home page. */
router.get('/', function(req, res, next) {
  try {
    const queryPath = req.query.path || "";
    let filesTree = treeRecSync(queryPath);
    res.render('files/index', {
      title: 'Files Tree',
      filesTree: filesTree
    });
  }
  catch (err) {
    next(err);
  }

});

router.post('/', function(req, res, next) {
  try {
    const copiedTargetRealPath = getCopiedTargetRealPath(res.locals.curTargetRealPath);
    fs.copySync(res.locals.curTargetRealPath, copiedTargetRealPath);
    res.redirect(res.locals.parentDirUrl);
  } catch(err) {
    console.log(err);
    next(err);
  }
});

router.delete('/', function(req, res, next) {
  try {
    fs.removeSync(res.locals.curTargetRealPath);
    res.redirect(res.locals.parentDirUrl);
  } catch(err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
