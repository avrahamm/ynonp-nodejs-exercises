const Post = require('../models/post');

async function main() {
    const mongoose = require('mongoose');
    const {connectionOptions} = require('../lib/mongo-utils');
    await mongoose.connect('mongodb://localhost/mymessages',connectionOptions );

    await Post.create({ author: 'ynon', text: 'Hello World',
        topics: ['topic1','topic2'] });
    await Post.create({ author: 'ynon', text: 'Nice to meet you', color: 'red',
        topics: ['topic4','topic2'] });
    
    await mongoose.disconnect();
}

main();