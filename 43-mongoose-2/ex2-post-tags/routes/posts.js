const router = require('express').Router();
const Post = require('../models/post');
const Topic = require('../models/topic');

// GET /posts/new
router.get('/new', function(req, res, next) {
    const post = new Post();
    res.render('posts/new', { post: post });
});

// GET /posts
router.get('/', async function(req, res, next) {

    const totalRecords = await Post.estimatedDocumentCount();

    const itemsPerPage = Number(req.query.limit) || 3;
    const page = Number(req.query.page) || 1;

    const totalPages = totalRecords / itemsPerPage;
    const offset = itemsPerPage * (page - 1);
    const posts = await Post.find({})
        .sort({ _id: -1 })
        .skip(offset).limit(itemsPerPage)
        // .populate('topics')
        .populate({
            path: "topics",
            select:"_id name weight",
            model: Topic,
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

// POST /posts
router.post('/', async function(req, res, next) {
    const {author, text, color, topics: topicsStr} = req.body;
    const topics = topicsStr.split(',');
    try {
        await Post.create({author, text, color, topics});
        res.redirect('/posts');
    } catch {
        console.log(post.errors);
        res.render('posts/new', { post: post });
    }
});

module.exports = router;