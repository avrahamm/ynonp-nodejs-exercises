const mongoose = require('mongoose');
const fs = require('fs-extra');
const Contact = require('./models/contact');

async function seedContacts() {
    try {
        const connection = await mongoose.connect('mongodb://localhost/40-contacts-ex',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            });

        const sourceFile = process.argv[2]; // "./contact.json";//

        const contactData = fs.readJsonSync(sourceFile);
        const createdContact = await Contact.findOneAndUpdate(
            {name: contactData.name}, contactData, {upsert: true}
        );
        // console.log(createdContact);
        await mongoose.disconnect();
    }
    catch(err) {
        console.log(err);
        process.exit(1);
    }
}

seedContacts().then();