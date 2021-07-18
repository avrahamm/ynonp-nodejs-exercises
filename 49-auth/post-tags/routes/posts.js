const router = require('express').Router();
const Post = require('../models/post');
const Topic = require('../models/topic');
const User = require('../models/user');
const passport = require('passport');

const {getPaginationData} = require('../lib/utils');

const passportAuthenticate = passport.authenticate(
    'local',
    {
        successRedirect: '/',
        failureRedirect: '/sessions/new',
        failureFlash: true,
    }
);

router.get(['/new'],
    function(req,res,next) {
        console.log('req.user');
        console.log(req.user);
        console.log('req.session.passport.user');
        console.log(req.session.passport.user);
        return next();
    },
    passportAuthenticate
);
router.post(['/'],passportAuthenticate);

// GET /posts/new
router.get('/new',
    function(req, res, next) {
        const post = new Post();
        res.render('posts/new', { post: post });
});

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
    const {author, text, color, topics: topicsStr} = req.body;
    const post = new Post({author, text, color});
    try {
        let topics = await Topic.getTopicsIds(topicsStr);
        post.topics = topics;
        await post.save();
        res.redirect('/posts');
    } catch {
        console.log(post.errors);
        res.render('posts/new', { post: post });
    }
});

module.exports = router;