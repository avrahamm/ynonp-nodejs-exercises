class NewsItem
{
   constructor(itemData)
   {
       return {
           id:itemData.id,
           title: itemData.title,
           link: itemData.link,
           score: itemData.score,
       }
   }
}

module.exports = NewsItem;