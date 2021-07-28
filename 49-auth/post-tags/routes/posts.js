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

// GET /posts
router.get('/', async function(req, res, next) {
    const authorFilterObj = await getAuthorFilterObj(req);

    const filteredPosts = await Post.find(authorFilterObj);
    const totalRecords = filteredPosts.length;
    const {
        itemsPerPage,
        totalPages,
        offset,
    } = getPaginationData(req,totalRecords);

    const posts = await Post.find(authorFilterObj)
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
            username: req.query.username ?? "",
            url: function(page) {
                console.log(this);
                return `/posts?page=${page}&username=${this.username}`
            },
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