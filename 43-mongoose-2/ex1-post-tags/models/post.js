const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    author: { type: String, required: true },
    color: { type: String, default: '#333' },
    image: Buffer,
    text: String,
    topics: {type: [String], default: []},
});

postSchema.statics.countTopics = function(posts) {
    const topicsListReducer = (accumulator, post) => accumulator.concat(post.topics);
    const topicsList = posts.reduce(topicsListReducer,[]);
    const countTopicsReducer = (accumulator, topic) => {
        if( !accumulator.hasOwnProperty(topic)) {
            accumulator[topic] = 1;
        }
        else {
            accumulator[topic] += 1;
        }
        return accumulator;
    };
    const topicsCounted = topicsList.reduce(countTopicsReducer, {});
    console.log('topicsCounted = ', topicsCounted);
    return topicsCounted;
};

module.exports = new mongoose.model('Post', postSchema);

