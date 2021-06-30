const mongoose = require('mongoose');
const faker = require('faker');
const Contact = require('./models/contact');

async function seedContacts() {
    const connection = await mongoose.connect('mongodb://localhost/40-contacts-ex',
        {useNewUrlParser: true, useUnifiedTopology: true});

    const numberOfContacts = 4;// process.argv[2] || 4;

    const contactsDataArr = (new Array(numberOfContacts).fill(null))
        .map( (u,i) => ({
            name: faker.name.findName(),
            emails: [
                faker.internet.email('avi','rom','gmail.com'), // Kassandra.Haley@erich.biz
                faker.internet.email(),
            ],
            phones: [
                faker.phone.phoneNumber(),
                faker.phone.phoneNumber(),
            ],
            address: faker.address.streetAddress(true),
        })
    );

    // console.log(contactsArr);
    const result = await Contact.insertMany(contactsDataArr);
    // console.log(result);
    await mongoose.disconnect();
}

seedContacts().then();