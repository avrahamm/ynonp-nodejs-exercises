var express = require('express');
var router = express.Router();
const fs = require('fs-extra');

const {getCopiedTargetRealPath} = require('../lib/utils/files');

router.get('/', function(req, res, next) {
    try {
      const data = fs.readFileSync(res.locals.curFileRealPath, 'utf8');
      res.send(data);
    } catch(err) {
      console.log(err);
    }
});

router.post('/', function(req, res, next) {
    try {
        const copiedTargetFileRealPath = getCopiedTargetRealPath(res.locals.curFileRealPath);
        fs.copySync(res.locals.curFileRealPath, copiedTargetFileRealPath);
        res.redirect(res.locals.parentDirUrl);
    } catch(err) {
        console.log(err);
    }
});

router.delete('/', function(req, res, next) {
    try {
        fs.unlinkSync(res.locals.curFileRealPath);
        res.redirect(res.locals.parentDirUrl);
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;
