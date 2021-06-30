const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {type: String, required: true},
    emails: [{type:String, unique: true}],
    phones: [{type:String, unique: true}],
    address: String,
});

module.exports = mongoose.model('Contact',contactSchema);