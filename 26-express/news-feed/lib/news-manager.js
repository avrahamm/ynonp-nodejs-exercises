const fs = require('fs-extra');
const path = require("path");
const newsRepository = path.resolve(__dirname, "./news-data.json") ;
const NewsItem = require('./news-item');

function getItems()
{
    try {
        const newsData = fs.readJsonSync(newsRepository);
        console.log(newsData);
        return newsData;
    }
    catch(err) {
        console.log(err);
        throw err;
    }

}

function addItem(itemData)
{
    try {
        let {nextId, newsItems } = getItems();
        const {title,link} = itemData;
        const item = new NewsItem({id:nextId++, title,link,score:0})
        newsItems.push(item);
        fs.writeJsonSync(newsRepository, {
            nextId,
            newsItems
        });
        return item;
    }
    catch(err) {
        console.log(err);
        throw(err);
    }
}

module.exports = {
    getItems,
    addItem,
}