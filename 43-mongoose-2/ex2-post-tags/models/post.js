const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Topic = require('./topic');

const postSchema = new mongoose.Schema({
    author: { type: String, required: true },
    color: { type: String, default: '#333' },
    image: Buffer,
    text: String,
    topics: {type: [{type: Schema.Types.ObjectId,
            // ref: TopicModel
    }], default:[]} ,
});

postSchema.statics.countTopics = function(posts) {
    const {topicsCounted} = prepareTopics(posts);
    console.log('statics topicsCounted = ', topicsCounted);
    return topicsCounted;
};

postSchema.query.prepareTopics = async function() {
    const posts = await this;
    const {topicsCounted, uniqueTopicsList} = prepareTopics(posts);
    console.log('query topicsCounted = ', topicsCounted);
    console.log('query uniqueTopicsList = ', uniqueTopicsList);
    posts.topicsCounted = topicsCounted;
    posts.sortedTopicsList = uniqueTopicsList.sort( Topic.compareTopics );
    return posts;
};

/**
 * Returns counted topics dictionary, and uniqueTopicsList.
 *
 * @param posts
 * @returns {*}
 */
function prepareTopics(posts)
{
    const topicsListReducer = (accumulator, post) => accumulator.concat(post.topics);
    const topicsList = posts.reduce(topicsListReducer,[]);
    const prepareTopicsReducer = (accumulator, topic) => {
        if( !accumulator.topicsCounted.hasOwnProperty(topic.name)) {
            accumulator.topicsCounted[topic.name] = 1;
            accumulator.uniqueTopicsList.push(topic);
        }
        else {
            accumulator.topicsCounted[topic.name] += 1;
        }
        return accumulator;
    };

    return topicsList.reduce(prepareTopicsReducer, {
        topicsCounted:{},
        uniqueTopicsList:[]
    });
}

module.exports = new mongoose.model('Post', postSchema);
