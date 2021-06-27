var express = require('express');
var router = express.Router();
const fs = require('fs-extra');

const {getCopiedTargetRealPath} = require('../lib/utils/files');

const isValidTarget = require('../lib/middlewares/is-valid-target');
router.use('/', isValidTarget);

router.get('/', function(req, res, next) {
    try {
      const data = fs.readFileSync(res.locals.curTargetRealPath, 'utf8');
      res.send(data);
    } catch(err) {
      console.log(err);
    }
});

router.post('/', function(req, res, next) {
    try {
        const copiedTargetFileRealPath = getCopiedTargetRealPath(res.locals.curTargetRealPath);
        fs.copySync(res.locals.curTargetRealPath, copiedTargetFileRealPath);
        res.redirect(res.locals.parentDirUrl);
    } catch(err) {
        console.log(err);
    }
});

router.delete('/', function(req, res, next) {
    try {
        fs.unlinkSync(res.locals.curTargetRealPath);
        res.redirect(res.locals.parentDirUrl);
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;
