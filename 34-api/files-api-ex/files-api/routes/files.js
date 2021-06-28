const express = require('express');
const router = express.Router();

const filesHelper = require('../lib/utils/files');
const isValidTarget = require('../lib/middlewares/is-valid-target');
const canCreateFile = require('../lib/middlewares/can-create-file');

router.post('/', canCreateFile);
router.use('/:name', isValidTarget);

/**
 * curl localhost:3000/api/v1.0/files
 */
router.get('/', function(req, res, next) {
    try {
        res.send(filesHelper.getFilesContent());
    } catch(err) {
        next(err);
    }
});

/**
 * curl localhost:3000/api/v1.0/files/f33333.txt
 */
router.get('/:name', function(req, res, next) {
    try {
        res.send(filesHelper.getFileContent(res.locals.curTargetRealPath));
    } catch(err) {
        next(err);
    }
});

/**
 * C:\Users\papaa>curl -d name=f22.txt
 * --data-urlencode "content=Hello a@a.com Boolean World!" localhost:3000/api/v1.0/files
 *
 * curl -d name=f33.txt -d "content=Hello Boolean World!" localhost:3000/api/v1.0/files
 */
router.post('/', function(req, res, next) {
    try {
        filesHelper.createFile(res.locals.curTargetRealPath,req);
        res.sendStatus(204);
    } catch(err) {
        next(err);
    }
});

/**
 * C:\Users\papaa>curl -X POST localhost:3000/api/v1.0/files/f3.txt
 */
router.post('/:name', function(req, res, next) {
    try {
        res.send(filesHelper.duplicateFile(res.locals.curTargetRealPath))
    } catch(err) {
        next(err);
    }
});

/**
 * C:\Users\papaa>curl -X DELETE localhost:3000/api/v1.0/files/f3.txt
 */
router.delete('/:name', function(req, res, next) {
    try {
        filesHelper.deleteFile(res.locals.curTargetRealPath);
        res.sendStatus(204);
    } catch(err) {
        next(err);
    }
});

module.exports = router;