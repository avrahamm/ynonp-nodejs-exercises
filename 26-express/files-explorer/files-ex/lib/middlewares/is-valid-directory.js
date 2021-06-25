const fs = require('fs-extra');
const createError = require('http-errors');

const {getCurTargetRealPath, getTargetPathParentDir} = require('../utils/files');

module.exports = function(req, res, next) {
    console.log('is_valid-directory, req.query = ',req.query);
    let curDirRealPath = getCurTargetRealPath(req);

    if (fs.existsSync(curDirRealPath) && fs.lstatSync(curDirRealPath).isDirectory() ) {
        res.locals.curDirRealPath = curDirRealPath;
        const pathParentDir = getTargetPathParentDir(req);
        res.locals.parentDirUrl = `/directory/?path=${pathParentDir}`;
        return next();
    }

    // it is not valid directory
    return next(createError(501,`/directory/?path=${req.query.path} is not valid directory`));
}