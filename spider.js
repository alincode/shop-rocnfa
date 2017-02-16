var ROOT_URL = 'http://shop.rocnfa.org.tw/prg10/prg1010_Product.aspx';

var Crawler = require('simplecrawler');
var crawler = new Crawler(ROOT_URL);
var cheerio = require('cheerio');
var htmlToText = require('html-to-text');

crawler.interval = 3 * 1000;
crawler.maxConcurrency = 1;

function getData(htmlString) {
  const data = htmlToText.fromString(htmlString, {
    wordwrap: 130
  });
  return data;
}

crawler.on('crawlstart', function() {
  console.log('Crawl starting ', ROOT_URL);
});

crawler.addFetchCondition(function(queueItem, referrerQueueItem) {
  return queueItem.path.indexOf('prg10') > -1
});

var cnt = 0;

crawler.on('fetchcomplete', function(queueItem, responseBuffer, response) {
  console.log('=== fetchcomplete === url:', queueItem.url);
  if (ROOT_URL == queueItem.url) return;
  var url = queueItem.url;
  if(url.indexOf('PId') == -1) return;
  var $ = cheerio.load(responseBuffer.toString());
  var title = getData($('#ContentPlaceHolder1_lbPName').html());
  var price = getData($('.money').html());
  cnt++;
  console.log(cnt + '. ' + title + ':' + price);
});

crawler.on('complete', function() {
  console.log('Finished!', ROOT_URL);
  crawler.stop();
});

crawler.start();
