const fs = require('fs-extra');
const path = require("path");
const newsRepository = path.resolve(__dirname, "./news-data.json") ;
const NewsItem = require('./news-item');

function sortDescByScore(a, b) {
    return b.score - a.score;
}

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

function updateItem(req)
{
    try {
        let {nextId, newsItems } = getItems();
        let {update_score: updateScore} = req.body;
        const updatedItems = newsItems.map( (item) => {
            if (parseInt(item.id) !== parseInt(req.params.id)) {
                return item;
            }
            item.score = parseInt(item.score) + parseInt(updateScore);
            return item;
        });
        return fs.writeJsonSync(newsRepository, {
            nextId,
            newsItems: updatedItems,
        });
    }
    catch(err) {
        console.log(err);
        throw(err);
    }
}

module.exports = {
    sortDescByScore,
    getItems,
    addItem,
    updateItem,
}