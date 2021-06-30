const mongoose = require('mongoose');
const Contact = require('./models/contact');

async function findContact() {
    const connection = await mongoose.connect('mongodb://localhost/40-contacts-ex',
        {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

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

findContact().then();