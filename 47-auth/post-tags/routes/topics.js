const router = require('express').Router();
const Post = require('../models/post');
const Topic = require('../models/topic');
const {getPaginationData} = require('../lib/utils');

/**
 * posts of topic
 */
router.get('/:id/posts', async function(req, res, next) {
    const topicId = req.params.id;
    const topic = await Topic.findById(topicId);
    let topicPostsQuery = Post.find({topics: topic});
    let topicPosts = await topicPostsQuery;

    const totalRecords = topicPosts.length;
    const {
        itemsPerPage,
        totalPages,
        offset,
    } = getPaginationData(req,totalRecords);

    let sortedTopicPosts = await topicPostsQuery
        .sort({ _id: -1 })
        .skip(offset)
        .limit(itemsPerPage);

    res.render('topics/posts', {
        topic,
        sortedTopicPosts,
        pagination: {
            totalPages,
            url: (page) => `/topics/${req.params.id}/posts?page=${page}`,
        }
    });
});

module.exports = router;
