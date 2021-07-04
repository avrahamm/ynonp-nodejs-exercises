const fs = require('fs-extra');
const path = require("path");
const newsRepository = path.resolve(__dirname, "../lib/news-data.json") ;
const NewsItem = require('../lib/news-item');

let nextId = 1;
// const newsItems = [
//   {
//     id:1,
//     title: "7canal",
//     link: "https://www.inn.co.il",
//     score: 10,
//   },
//   {
//     id:2,
//     title: "israel",
//     link: "https://www.inn.co.il",
//     score: 5,
//   }
// ];
const newsItems = [];
const item = new NewsItem({
    id:nextId++,
    title: "first",
    link: "https://www.inn.co.il",
    score:0,
});
newsItems.push(item);

try {
    fs.writeJsonSync(newsRepository , {
        nextId,
        newsItems
    });
    console.log("seed succeeded");
}
catch (err) {
    console.error(err);
    process.exit(1);
}
