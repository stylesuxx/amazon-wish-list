var test = require('tape');
var AmazonWishList = require('../');

var testData = {
  listID: 'NDDVVVWMJ6AN',
  email: 'stylesuxx@gmail.com',
  cid: 'A3ETU88UAET9K3'
}

var allItems = 0;

test('Get unpurchased by wish list id', function (t) {
  t.plan(9);

  var awl = new AmazonWishList('de');
  awl.getById(testData.listID).then( function(result) {
    t.equal(result.title, 'testing', 'List title available');
    t.ok(result.items.length >= 26, 'Pagination is working');
    allItems += result.items.length;

    var last = result.items[result.items.length - 1];
    t.equal(last.title, 'Die Simpsons - Die komplette Season 1 (Collector\'s Edition, 3 DVDs)', 'Item title available');
    t.equal(last.id, 'B00005MFO7', 'Item ID available');
    t.equal(last.priority, 2, 'Item priority available');
    t.equal(last.comment, 'Just a test comment.', 'Item comment available');
    t.equal(last.currency, 'EUR', 'Item currency available');
    t.equal(last.price, 13.99, 'Item price available');
    t.equal(last.link, 'https://amazon.de/dp/B00005MFO7', 'Item link available');
  });
});

test('Get purchased by wish list id', function (t) {
  t.plan(9);

  var awl = new AmazonWishList('de');
  awl.getById(testData.listID, 'purchased').then( function(result) {
    t.equal(result.title, 'testing', 'List title available');
    t.ok(result.items.length == 1, 'Amount matches');
    allItems += result.items.length;

    var last = result.items[result.items.length - 1];
    t.equal(last.title, 'United Labels 0804201 - Simpsons Sprechender Flaschenöffner', 'Item title available');
    t.equal(last.id, 'B0015GCBJG', 'Item ID available');
    t.equal(last.priority, 0, 'Item priority available');
    t.equal(last.comment, '', 'Item comment is empty');
    t.equal(last.currency, 'EUR', 'Item currency available');
    t.equal(last.price, 8.99, 'Item price available');
    t.equal(last.link, 'https://amazon.de/dp/B0015GCBJG', 'Item link available');
  });
});

test('Get all by wish list id', function (t) {
  t.plan(9);

  var awl = new AmazonWishList('de');
  awl.getById(testData.listID, 'all').then( function(result) {
    t.equal(result.title, 'testing', 'List title available');
    t.ok(result.items.length == allItems, 'Amount matches');

    var last = result.items[result.items.length - 1];
    t.equal(last.title, 'Die Simpsons - Die komplette Season 1 (Collector\'s Edition, 3 DVDs)', 'Item title available');
    t.equal(last.id, 'B00005MFO7', 'Item ID available');
    t.equal(last.priority, 2, 'Item priority available');
    t.equal(last.comment, 'Just a test comment.', 'Item comment available');
    t.equal(last.currency, 'EUR', 'Item currency available');
    t.equal(last.price, 13.99, 'Item price available');
    t.equal(last.link, 'https://amazon.de/dp/B00005MFO7', 'Item link available');
  });
});

test('Get by CID', function (t) {
  t.plan(2);
  var lists = ['testing', 'Books', 'Boardgames'];
  var available = [];

  var awl = new AmazonWishList('de');
  awl.getByCid(testData.cid).then( function(results) {
    t.ok(results.length > 1, 'Contains multiple lists');

    for(var i in results) {
      var current = results[i];
      if(lists.indexOf(current.title) > -1) {
        available.push(true);
      }
    }

    t.ok(available.length === 3, 'List titles match');
  });
});
