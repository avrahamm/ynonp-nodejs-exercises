const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Topic = require('./topic');
const User = require('./user');

const postSchema = new mongoose.Schema({
    author: {type: Schema.Types.ObjectId,
        ref: User,
    },
    color: { type: String, default: '#333' },
    image: Buffer,
    text: { type: String, required: true},
    topics: {
        type: [
            {type: Schema.Types.ObjectId,
            // ref: Topic
            }
        ],
        default:[]
    },
    isGuarded: { type: Boolean, default: false },
    permittedUsers: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        default:[]
    }
});

postSchema.statics.countTopics = function(posts) {
    const {topicsCounted} = prepareTopics(posts);
    return topicsCounted;
};

postSchema.query.prepareTopics = async function() {
    const posts = await this;
    const {topicsCounted, uniqueTopicsList} = prepareTopics(posts);
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
