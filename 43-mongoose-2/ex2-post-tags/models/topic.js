const mongoose = require('mongoose');
const topicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    weight: { type: Number, default: 1 },
});

 topicSchema.statics.compareTopics = (a,b) => {
     if ( a.weight < b.weight) return -1;
     else if ( a.weight === b.weight) return 0;
     else if ( a.weight > b.weight) return 1;
 };

topicSchema.statics.getTopicsIds = async function(topicsStr)
{
    await Promise.all(
        topicsStr.split(',')
            .map(name => name.trim())
            .map( async (name) => {
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

module.exports = new mongoose.model('Topic', topicSchema);
