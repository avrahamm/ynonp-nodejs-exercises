const createError = require('http-errors');
var express = require('express');
var router = express.Router();
const passport = require('passport');

const Post = require('../models/post');
const Topic = require('../models/topic');
const User = require('../models/user');

const {
    getPermittedUsersFilterObj,
    getAuthorFilterObj,
} = require('../lib/utils');
router.use(passport.authenticate('jwt', { session: false }));

/**
 * curl -H "Authorization: Bearer <jwt-token>" localhost:3000/api/v1.0/whoami
 */
router.get('/whoami', function(req, res, next) {
    res.send(`Hello! ${req.user.email}`);
});

/**
 * curl -H "Authorization: Bearer <jwt-token>" localhost:3000/api/v1.0/posts
 */
router.get('/posts', async function(req, res, next) {
    try {
        const permittedPostsFilterObj = getPermittedUsersFilterObj(req);
        const authorFilterObj = await getAuthorFilterObj(req);
        const postsComposedFilter = {
            $and: [
                permittedPostsFilterObj,
                authorFilterObj,
            ],
        };

        const posts = await Post.find(postsComposedFilter)
            .sort({_id: -1})
            // .populate('topics')
            .populate({
                path: "topics",
                select: "_id name weight",
                model: Topic,
            })
            .populate({
                path: "author",
                select: "_id name email",
                model: User,
            })
            .populate({
                path: "permittedUsers",
                select: "_id name",
                model: User,
            })
            .prepareTopics();
        res.send(posts);
    }
    catch (e) {
        console.log(e);
        next(createError(e));
    }
});

module.exports = router;
