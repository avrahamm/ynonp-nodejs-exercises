const mongoose = require('mongoose');
const topicSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    weight: { type: Number, default: 1 },
});

 topicSchema.statics.compareTopics = (a,b) => {
     if ( a.weight < b.weight) return -1;
     else if ( a.weight === b.weight) return 0;
     else if ( a.weight > b.weight) return 1;
 };

/**
 * Rewrote getTopicsIds without
 * await in map callback can hurt performance.
 * @param topicsStr
 * @returns {Promise<*[]>}
 */
topicSchema.statics.getTopicsIds = async function(topicsStr)
{
    if( !Boolean(topicsStr)) {
        return [];
    }
    const topicNamesArray = topicsStr.split(',')
        .map(name => name.trim());
    const existingTopics = await this.find({
        name : { $in : topicNamesArray}
    });
    const existingTopicNames = [];
    const existingTopicIds = existingTopics.map( topic => {
        existingTopicNames.push(topic.name);
        return topic._id;
    })
    const notExistingTopicNames = topicNamesArray
        .filter( topicName => !existingTopicNames.includes(topicName));
    const notExistingTopicPromises = notExistingTopicNames
        .map( async (topicName) => this.create({name:topicName}))
    const createdTopics = await Promise.all(notExistingTopicPromises);
    const createdTopicsIds = createdTopics.map( topic => topic.id);
    return [...existingTopicIds, ...createdTopicsIds];
}

module.exports = new mongoose.model('Topic', topicSchema);
