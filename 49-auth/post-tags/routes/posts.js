const router = require('express').Router();
// @link:https://www.sitepoint.com/local-authentication-using-passport-node-js/
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const Post = require('../models/post');
const Topic = require('../models/topic');
const User = require('../models/user');

const {getPaginationData} = require('../lib/utils');

router.get(['/new'],
    ensureLoggedIn('/sessions/new'),
);

router.post(['/'],
    ensureLoggedIn('/sessions/new'),
);

// GET /posts/new
router.get('/new',
    async function(req, res, next) {
        const post = new Post();
        res.render('posts/new', { post: post, user: req.user });
    }
);

// GET /posts
router.get('/', async function(req, res, next) {

    const totalRecords = await Post.estimatedDocumentCount();
    const {
        itemsPerPage,
        totalPages,
        offset,
    } = getPaginationData(req,totalRecords);

    const posts = await Post.find({})
        .sort({ _id: -1 })
        .skip(offset)
        .limit(itemsPerPage)
        // .populate('topics')
        .populate({
            path: "topics",
            select:"_id name weight",
            model: Topic,
        })
        .populate({
            path: "author",
            select:"_id name email",
            model: User,
        })
        .prepareTopics();

    res.render('posts/index', {
        posts,
        pagination: {
            totalPages,
            url: (page) => `/posts?page=${page}`,
        }
    });
});


/**
 * POST /posts
 *
 * First finds or creates topics ids
 * to add to created post document.
 */
router.post('/', async function(req, res, next) {
    const {text, color, topics: topicsStr} = req.body;
    const post = new Post({author: req.user._id, text, color});
    try {
        post.topics = await Topic.getTopicsIds(topicsStr);
        await post.save();
        res.redirect('/posts');
    } catch {
        console.log(post.errors);
        res.render('posts/new', { post: post });
    }
});

module.exports = router;