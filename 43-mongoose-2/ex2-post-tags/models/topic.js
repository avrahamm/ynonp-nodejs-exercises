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

module.exports = new mongoose.model('Topic', topicSchema);
