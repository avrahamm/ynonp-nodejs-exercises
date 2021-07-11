const mongoose = require('mongoose');
const topicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    weight: { type: Number, default: 1 },
});

module.exports = new mongoose.model('Topic', topicSchema);
