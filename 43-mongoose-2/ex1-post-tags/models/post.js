const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    author: { type: String, required: true },
    color: { type: String, default: '#333' },
    image: Buffer,
    text: String,
    topics: {type: [String], default: []},
});

module.exports = new mongoose.model('Post', postSchema);

