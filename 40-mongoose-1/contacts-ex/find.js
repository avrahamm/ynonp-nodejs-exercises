const mongoose = require('mongoose');
const Contact = require('./models/contact');
const {connectionOptions} = require('./mongo-utils');

async function findContact() {
    const connection = await mongoose.connect(
        'mongodb://localhost/40-contacts-ex',
        connectionOptions
    );

    const searchName = process.argv[2] || '';
    // @link: https://docs.mongodb.com/manual/reference/operator/query/regex/#std-label-syntax-restrictions
    const searchRegex = {$regex: `${searchName}`, $options: 'i'};
    // passing options
    const c1 = await Contact.findOne(
        // { name: {$regex: `${searchName}`, $options: 'i'} }
        { name: searchRegex }
    ).exec();
    console.log(c1);

    await mongoose.disconnect();
}

try {
    findContact().then();
}
catch(err) {
    console.log(err);
    process.exit(1);
}