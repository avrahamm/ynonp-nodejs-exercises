const mongoose = require('mongoose');
const newsItemSchema = new mongoose.Schema({
    link: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: ''},
    peopleClickedLike: { type: [String], default:[] } ,
    topicsBelongsTo: { type: [String], default:[] } ,
});

module.exports = new mongoose.model('NewsItem', newsItemSchema);
