const createError = require('http-errors');
const router = require('express').Router();
// @link:https://www.sitepoint.com/local-authentication-using-passport-node-js/
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const Post = require('../models/post');
const Topic = require('../models/topic');
const User = require('../models/user');

const multer = require('multer');
const postPhotoUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: function (req, file, cb) {
        const fname = file.originalname;
        const valid = [
            '.jpg',
            '.png',
            '.jpeg',
            '.jpg',
        ].find(ext => fname.endsWith(ext));
        cb(null, valid);
    }
}).single('postpic');

const {
    getPaginationData,
    ensurePostOwner,
    getPermittedUsersFilterObj,
    getAuthorFilterObj,
} = require('../lib/utils');

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

router.get('/:id', async function(req, res, next) {
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
        res.render('posts/item', { post: post, user: req.user });
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

router.get('/:id/img', async function(req, res, next) {
    const post = await Post.findById(req.params.id);
    res.end(post.image);
});

/**
 * POST /posts
 *
 * First finds or creates topics ids
 * to add to created post document.
 */
router.post('/', postPhotoUpload, async function(req, res, next) {
    const {text, color, topics: topicsStr, isGuarded,
        permittedUsers: permittedUsersStr} = req.body;
    let image = null;
    if (req.file) {
        console.log('router.post/posts/, req.file.originalname = ',req.file.originalname);
        image = req.file.buffer;
    }
    const post = new Post({author: req.user._id, text, color, image});
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

router.put('/:id', postPhotoUpload, async function(req, res, next) {
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
        if (req.file) {
            console.log('router.put/posts/:id, req.file = ',req.file);
            post.image = req.file.buffer;
        }
        await post.save();
        res.redirect('/posts');
    } catch (err) {
        res.render(`posts/edit`, { post: post, user: req.user });
    }
});

module.exports = router;