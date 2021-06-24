var express = require('express');
var router = express.Router();
const fs = require('fs-extra');

const {
  treeRecSync, getCopiedTargetRealPath
} = require('../lib/utils/files');

/* GET home page. */
router.get('/', function(req, res, next) {
  const queryPath = req.query.path || "";
  let filesTree = treeRecSync(queryPath);
  res.render('files/index', {
    title: 'Files Tree',
    filesTree: filesTree
  });
});

router.post('/', function(req, res, next) {
  try {
    const copiedTargetRealPath = getCopiedTargetRealPath(res.locals.curDirRealPath);
    fs.copySync(res.locals.curDirRealPath, copiedTargetRealPath);
    res.redirect(res.locals.parentDirUrl);
  } catch(err) {
    console.log(err);
  }
});

router.delete('/', function(req, res, next) {
  try {
    fs.removeSync(res.locals.curDirRealPath);
    res.redirect(res.locals.parentDirUrl);
  } catch(err) {
    console.log(err);
  }
});

module.exports = router;
