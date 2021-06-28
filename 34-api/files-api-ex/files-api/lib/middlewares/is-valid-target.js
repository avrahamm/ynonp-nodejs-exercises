/**
 * Assures target existence
 * and adds res.locals.curTargetRealPath.
 */
const createError = require('http-errors');

const {
    getCurTargetRealPath,
    doesResourceExist,
} = require('../utils/files');

module.exports = function(req, res, next) {
    let curTargetRealPath = getCurTargetRealPath(req);
    console.log('is-valid-target, req.params = ', req.params);
    console.log('curTargetRealPath = ', curTargetRealPath);

    if (doesResourceExist(curTargetRealPath)) {
        res.locals.curTargetRealPath = curTargetRealPath;
        return next();
    }

    // it is not valid target.
    return next(createError(501,`/${req.params.name} is not valid target`));
}