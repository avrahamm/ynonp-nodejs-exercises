/**
 * Assures new created target doesn't exist yet,
 * and adds res.locals.curTargetRealPath.
 */
const createError = require('http-errors');

const {
    getCreatedTargetRealPath,
    doesResourceExist,
} = require('../utils/files');

module.exports = function(req, res, next) {
    let curTargetRealPath = getCreatedTargetRealPath(req);
    console.log('can-create-file, req.body = ', req.body);

    if (!doesResourceExist(curTargetRealPath)) {
        res.locals.curTargetRealPath = curTargetRealPath;
        return next();
    }

    // it is not valid target.
    return next(createError(501,`Failed, as /${req.body.name} already exists!`));
}