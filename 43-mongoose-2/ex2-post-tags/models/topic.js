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

topicSchema.statics.getTopicsIds = async function(topicsStr)
{
    return Promise.all(
        topicsStr.split(',')
            .map(name => name.trim())
            .map( async (name) => {
                // WARNING! According to Ynon remark using await in each iteration
                // can slow down the performance
                const existingTopic = await this.findOne({name});
                console.log('existingTopic = ', existingTopic);
                if (Boolean(existingTopic)) {
                    return existingTopic._id;
                }
                const createdTopic = await this.create({name});
                return createdTopic._id;
            })
    )
}

/**
 * Rewrote getTopicsIds without
 * await in map callback can hurt performance.
 * @param topicsStr
 * @returns {Promise<*[]>}
 */
topicSchema.statics.getTopicsIdsV2 = async function(topicsStr)
{
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
