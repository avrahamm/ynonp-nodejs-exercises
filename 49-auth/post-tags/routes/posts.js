const createError = require('http-errors');
const router = require('express').Router();
// @link:https://www.sitepoint.com/local-authentication-using-passport-node-js/
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const Post = require('../models/post');
const Topic = require('../models/topic');
const User = require('../models/user');

const {getPaginationData, ensurePostOwner} = require('../lib/utils');

router.get(['/new'],
    ensureLoggedIn('/sessions/new'),
);

router.get(['/:id/edit'],
    ensureLoggedIn('/sessions/new'),
    ensurePostOwner({failedRedirect: '/posts'}),
);

router.post(['/'],
    ensureLoggedIn('/sessions/new'),
);

router.put(['/:id'],
    ensureLoggedIn('/sessions/new'),
    ensurePostOwner({failedRedirect: '/posts'}),
);

// GET /posts/new
router.get('/new',
    async function(req, res, next) {
        const post = new Post();
        res.render('posts/new', { post: post, user: req.user });
    }
);

// GET /posts
router.get('/', async function (req, res, next) {
    try {
        const permittedPostsFilterObj = getPermittedUsersFilterObj(req);
        const authorFilterObj = await getAuthorFilterObj(req);
        const postsComposedFilter = {
            $and: [
                permittedPostsFilterObj,
                authorFilterObj,
            ],
        };

        const filteredPosts = await Post.find(postsComposedFilter);
        const totalRecords = filteredPosts.length;
        const {
            itemsPerPage,
            totalPages,
            offset,
        } = getPaginationData(req, totalRecords);

        const posts = await Post.find(postsComposedFilter)
            .sort({_id: -1})
            .skip(offset)
            .limit(itemsPerPage)
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
            .prepareTopics();

        res.render('posts/index', {
            posts,
            user: req.user ?? null,
            pagination: {
                totalPages,
                username: req.query.username ?? "",
                url: function (page) {
                    return `/posts?page=${page}&username=${this.username}`
                },
            }
        });
    } catch (err) {
        console.log(err);
        return next(createError(err));
    }
});


// GET: edit post
router.get('/:id/edit', async function(req, res, next) {
    try {
        const post = await Post.findById(req.params.id)
            .populate({
                path: "topics",
                select: "_id name weight",
                model: Topic,
            })
            .populate({
                path: "permittedUsers",
                select: "_id name",
                model: User,
            });
        res.render('posts/edit', { post: post, user: req.user });
    } catch (err) {
        console.log(err);
        return next(createError(err));
    }
});

/**
 * POST /posts
 *
 * First finds or creates topics ids
 * to add to created post document.
 */
router.post('/', async function(req, res, next) {
    const {text, color, topics: topicsStr, isGuarded, permittedUsers: permittedUsersStr} = req.body;
    const post = new Post({author: req.user._id, text, color});
    try {
        post.topics = Boolean(topicsStr) ? await Topic.getTopicsIds(topicsStr) : [];
        post.isGuarded = Boolean(isGuarded);
        post.permittedUsers = Boolean(isGuarded) ? await User.getPermittedUsersIds(permittedUsersStr) : [];
        await post.save();
        res.redirect('/posts');
    } catch (err) {
        res.render('posts/new', { post: post, user: req.user });
    }
});

router.put('/:id', async function(req, res, next) {
    const {text, color, topics: topicsStr, isGuarded, permittedUsers: permittedUsersStr} = req.body;
    let post = null;
    try {
        post = await Post.findById(req.params.id)
            .populate({
                path: "topics",
                select: "_id name weight",
                model: Topic,
            })
            .populate({
                path: "permittedUsers",
                select: "_id name",
                model: User,
            });
        post.text = text;
        post.color = color;
        const curTopicsStr = post.topics.map(topic => topic.name).join(',');
        if ( curTopicsStr !== topicsStr ) {
            post.topics = await Topic.getTopicsIds(topicsStr);
        }
        if ( !(Boolean(isGuarded)) ) {
            post.isGuarded = false;
            post.permittedUsers = [];
        }
        else {
            post.isGuarded = true;
            const curPermittedUsersStr = post.permittedUsers.map(user => user.name).join(',');
            if ( curPermittedUsersStr !== permittedUsersStr ) {
                post.permittedUsers = await User.getPermittedUsersIds(permittedUsersStr);
            }
        }
        await post.save();
        res.redirect('/posts');
    } catch (err) {
        res.render(`posts/${req.params.id}/edit`, { post: post, user: req.user });
    }
});

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

module.exports = router;