const createError = require('http-errors');
const User = require('../models/user');
const Post = require('../models/post');

function getPaginationData(req, totalRecords)
{
    const itemsPerPage = Number(req.query.limit) || 3;
    const page = Number(req.query.page) || 1;
    const totalPages = Math.ceil(totalRecords / itemsPerPage);
    const offset = itemsPerPage * (page - 1);
    return {
        itemsPerPage,
        page,
        totalPages,
        offset,
    }
}

function ensurePostOwner(options = {failedRedirect: '/posts'})
{
    return async function (req, res, next)
    {
        try {
            const post = await Post.findById(req.params.id);
            if (post.author.toString() === req.user._id.toString()) {
                return next();
            }
            else {
                res.redirect(options.failedRedirect)
            }
        }
        catch (e) {
            console.log(e);
            return next(createError(err));
        }
    }
}

/**
 * @link:https://stackoverflow.com/questions/36666726/get-results-from-two-or-queries-with-and-in-mongoose
 * @param req
 * @returns {{$or: [{isGuarded: boolean}, {author}, {permittedUsers}]}}
 */
function getPermittedUsersFilterObj(req)
{
    if (!Boolean(req.user)) {
        return { isGuarded: Boolean(false) };
    }
    return { $or:
            [
                { isGuarded: Boolean(false) },
                { author: req.user._id },
                { permittedUsers: req.user._id }
            ] };
}

/**
 * TODO-IDEA! To optimize with Redis
 * @link:https://epsagon.com/development/using-redis-to-optimize-mongodb-queries/
 * @param req
 * @returns {Promise<{}>}
 */
async function getAuthorFilterObj(req)
{
    const authorFilterObj = {};
    let filteredUser = null;
    const usernameFilter = req.query.username;
    if ( Boolean(usernameFilter)) {
        filteredUser = await User.findOne({ name: usernameFilter });
        if ( Boolean(filteredUser) ) {
            authorFilterObj.author = filteredUser;
        }
    }

    return authorFilterObj;
}

module.exports = {
    getPaginationData,
    ensurePostOwner,
    getPermittedUsersFilterObj,
    getAuthorFilterObj,
}
