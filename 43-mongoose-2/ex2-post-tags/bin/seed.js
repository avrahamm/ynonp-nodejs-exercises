const Topic = require('../models/topic');
const Post = require('../models/post');

async function main() {
    const mongoose = require('mongoose');
    const {connectionDB, connectionOptions} = require('../lib/mongo-utils');
    await mongoose.connect(connectionDB,connectionOptions);

    const [t1,t2,t3] = await Topic.insertMany([
        {
            name:'topic1',
            weight: 3,
        },
        {
            name:'topic2',
            weight: 13,
        },
        {
            name:'topic3',
            weight: 23,
        },
    ])

    await Post.insertMany([
        { author: 'ynon', text: 'Hello World',
            topics: [t1._id, t2._id] },
        { author: 'yoni', text: 'Hello',
            topics: [t1._id,  t3._id] },
        { author: 'yossi', text: 'Nice to meet you', color: 'red',
            topics: [t1._id, t2._id, t3._id] }
    ]);
    
    await mongoose.disconnect();
}

main();