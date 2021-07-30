const createError = require('http-errors');
const Post = require('../models/post');

module.exports.getPaginationData = function(req, totalRecords)
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

module.exports.ensurePostOwner = function(options = {failedRedirect: '/posts'})
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
