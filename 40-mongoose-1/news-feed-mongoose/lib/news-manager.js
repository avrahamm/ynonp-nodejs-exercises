const NewsItem = require('../models/news-item');

async function getItems()
{
    try {
        const newsItems = await NewsItem.find({});
        console.log('function getItems()');
        console.log(newsItems);
        return newsItems;
    }
    catch(err) {
        console.log(err);
        throw err;
    }

}

function addItem(itemData)
{
    try {
        const {title,link,description, topics: topicsString} = itemData;
        const topicsArray = topicsString.split(',');
        return NewsItem.create({
            title,link,description,
            topicsBelongsTo: topicsArray,
        });
    }
    catch(err) {
        console.log(err);
        throw(err);
    }
}

async function updateItem(req)
{
    try {
        let {userName} = req.body;
        console.log('userName = ', userName );
        let updatedItem = await NewsItem.findById(req.params.id).exec();
        console.log('updatedItem = ', updatedItem );
        updatedItem.peopleClickedLike.push(userName);
        updatedItem.save();
        return updatedItem;
    }
    catch(err) {
        console.log(err);
        throw(err);
    }
}

module.exports = {
    getItems,
    addItem,
    updateItem,
}