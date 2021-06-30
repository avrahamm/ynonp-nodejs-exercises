const fs = require('fs-extra');
const faker = require('faker');

function seedContactJson() {

    const contactData = {
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
    };

    fs.writeJsonSync('./contact.json', contactData);
}

seedContactJson();