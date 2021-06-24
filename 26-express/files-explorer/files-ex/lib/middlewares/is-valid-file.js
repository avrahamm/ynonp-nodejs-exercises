const fs = require('fs-extra');

const {getCurTargetRealPath, getTargetPathParentDir} = require('../utils/files');

module.exports = function(req, res, next) {
    console.log('is_valid-directory, req.query = ',req.query);
    let curFileRealPath = getCurTargetRealPath(req);

    if (fs.existsSync(curFileRealPath) && fs.lstatSync(curFileRealPath).isFile() ) {
        res.locals.curFileRealPath = curFileRealPath;
        const pathParentDir = getTargetPathParentDir(req);
        res.locals.parentDirUrl = `/directory/?path=${pathParentDir}`;
        return next();
    }

    // it is not valid directory
    return next(`path = ${req.query.path} is not valid file`);
}