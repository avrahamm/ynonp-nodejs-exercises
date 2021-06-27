const createError = require('http-errors');

const {
    getCurTargetRealPath,
    getTargetPathParentDir,
    getResourceFromUrl,
    doesResourceExist,
    isResourceTypeConsistent,
} = require('../utils/files');

module.exports = function(req, res, next) {
    let curTargetRealPath = getCurTargetRealPath(req);
    // either /file/ or /directory/
    let resourceType = getResourceFromUrl(req);
    console.log('is-valid-target, req.query = ',req.query);

    if (doesResourceExist(curTargetRealPath) &&
        isResourceTypeConsistent(resourceType, curTargetRealPath) ) {
        res.locals.curTargetRealPath = curTargetRealPath;
        const pathParentDir = getTargetPathParentDir(req);
        res.locals.parentDirUrl = `/directory/?path=${pathParentDir}`;
        return next();
    }

    // it is not valid target.
    return next(createError(501,`${resourceType}?path=${req.query.path} is not valid target`));
}