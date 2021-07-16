const Topic = require('../models/topic');
const Post = require('../models/post');
const User = require('../models/user');

async function main() {
    const mongoose = require('mongoose');
    const {connectionDB, connectionOptions} = require('../lib/mongo-utils');
    await mongoose.connect(connectionDB,connectionOptions);

    //@link:https://stackoverflow.com/a/68361651/9346694
    // to turn on indexes before inserting,
    // especially Topic.name unique constrain.
    await Topic.syncIndexes();

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
    ]);

    const [user1, user2, user3] = await Promise.all([1,2,3]
        .map(i => User.create({
                name: `u${i}`,
                email: `u${i}@u${i}.com`,
                password: `u${i}`,
            })
        )
    );

    await Post.insertMany([
        { author: user1._id, text: 'Hello World',
            topics: [t1._id, t2._id] },
        { author: user2._id, text: 'Hello',
            topics: [t1._id,  t3._id] },
        { author: user3._id, text: 'Nice to meet you',
            color: 'red',
            topics: [t1._id, t2._id, t3._id] }
    ]);
    
    await mongoose.disconnect();
}

main();