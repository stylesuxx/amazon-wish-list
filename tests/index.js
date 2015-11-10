var test = require('tape');
var AmazonWishList = require('../');

var testData = {
  listID: 'NDDVVVWMJ6AN',
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
    t.equal(result.items.length, 1, 'Amount matches');
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
    t.equal(result.items.length, allItems, 'Amount matches');

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

test('Get all by list id and sort by price', function (t) {
  t.plan(9);

  var awl = new AmazonWishList('de');
  awl.getById(testData.listID, 'all', 'price').then( function(result) {
    t.equal(result.title, 'testing', 'List title available');
    t.equal(result.items.length, allItems, 'Amount matches');

    var item = result.items[0];
    t.equal(item.title, 'Die Simpsons - Schrille Nacht mit den Simpsons', 'Item title available');
    t.equal(item.id, 'B0002W3H3S', 'Item ID available');
    t.equal(item.priority, 0, 'Item priority available');
    t.equal(item.comment, '', 'Item comment available');
    t.equal(item.currency, 'EUR', 'Item currency available');
    t.equal(item.price, 6.97, 'Item price available');
    t.equal(item.link, 'https://amazon.de/dp/B0002W3H3S', 'Item link available');
  });
});

test('Get all by list id and sort by price-desc', function (t) {
  t.plan(9);

  var awl = new AmazonWishList('de');
  awl.getById(testData.listID, 'all', 'price-desc').then( function(result) {
    t.equal(result.title, 'testing', 'List title available');
    t.equal(result.items.length, allItems, 'Amount matches');

    var item = result.items[0];
    t.equal(item.title, 'Simpsons Monsterbox (Season 1-9)', 'Item title available');
    t.equal(item.id, 'B000UDR1W2', 'Item ID available');
    t.equal(item.priority, 0, 'Item priority available');
    t.equal(item.comment, '', 'Item comment available');
    t.equal(item.currency, 'EUR', 'Item currency available');
    t.equal(item.price, 129.00, 'Item price available');
    t.equal(item.link, 'https://amazon.de/dp/B000UDR1W2', 'Item link available');
  });
});

test('Get all by list id and sort by title', function (t) {
  t.plan(9);

  var awl = new AmazonWishList('de');
  awl.getById(testData.listID, 'all', 'title').then( function(result) {
    t.equal(result.title, 'testing', 'List title available');
    t.equal(result.items.length, allItems, 'Amount matches');

    var item = result.items[0];
    t.equal(item.title, 'Die Simpsons  - Die komplette Season 9 (Collector\'s Edition, 4 DVDs)', 'Item title available');
    t.equal(item.id, 'B000MM0HT0', 'Item ID available');
    t.equal(item.priority, 0, 'Item priority available');
    t.equal(item.comment, '', 'Item comment available');
    t.equal(item.currency, 'EUR', 'Item currency available');
    t.equal(item.price, 13.99, 'Item price available');
    t.equal(item.link, 'https://amazon.de/dp/B000MM0HT0', 'Item link available');
  });
});

test('Get all by list id and sort by priority', function (t) {
  t.plan(9);

  var awl = new AmazonWishList('de');
  awl.getById(testData.listID, 'all', 'priority').then( function(result) {
    t.equal(result.title, 'testing', 'List title available');
    t.equal(result.items.length, allItems, 'Amount matches');

    var item = result.items[0];
    t.equal(item.title, 'Die Simpsons - Die komplette Season 1 (Collector\'s Edition, 3 DVDs)', 'Item title available');
    t.equal(item.id, 'B00005MFO7', 'Item ID available');
    t.equal(item.priority, 2, 'Item priority available');
    t.equal(item.comment, 'Just a test comment.', 'Item comment available');
    t.equal(item.currency, 'EUR', 'Item currency available');
    t.equal(item.price, 13.99, 'Item price available');
    t.equal(item.link, 'https://amazon.de/dp/B00005MFO7', 'Item link available');
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

    t.equals(available.length, lists.length, 'List titles match');
  });
});

test('Get by cid with "all" filter', function (t) {
  t.plan(11);
  var lists = ['testing', 'Books', 'Boardgames'];
  var available = [];
  var testingList = {};

  var awl = new AmazonWishList('de');
  awl.getByCid(testData.cid, 'all').then( function(results) {
    t.ok(results.length > 1, 'Contains multiple lists');

    for(var i in results) {
      var current = results[i];
      if(lists.indexOf(current.title) > -1) {
        available.push(true);
        if(current.title === 'testing') {
          testingList = current;
        }
      }
    }

    t.equal(available.length, 3, 'List titles match');

    t.equal(testingList.title, 'testing', 'List title available');
    t.equal(testingList.items.length, allItems, 'Amount matches');

    var last = testingList.items[testingList.items.length - 1];
    t.equal(last.title, 'Die Simpsons - Die komplette Season 1 (Collector\'s Edition, 3 DVDs)', 'Item title available');
    t.equal(last.id, 'B00005MFO7', 'Item ID available');
    t.equal(last.priority, 2, 'Item priority available');
    t.equal(last.comment, 'Just a test comment.', 'Item comment available');
    t.equal(last.currency, 'EUR', 'Item currency available');
    t.equal(last.price, 13.99, 'Item price available');
    t.equal(last.link, 'https://amazon.de/dp/B00005MFO7', 'Item link available');
  });
});

test('Get by cid with "all" filter and sort by priority', function (t) {
  t.plan(11);
  var lists = ['testing', 'Books', 'Boardgames'];
  var available = [];
  var testingList = {};

  var awl = new AmazonWishList('de');
  awl.getByCid(testData.cid, 'all', 'priority').then( function(results) {
    t.ok(results.length > 1, 'Contains multiple lists');

    for(var i in results) {
      var current = results[i];
      if(lists.indexOf(current.title) > -1) {
        available.push(true);
        if(current.title === 'testing') {
          testingList = current;
        }
      }
    }

    t.equal(available.length, 3, 'List titles match');

    t.equal(testingList.title, 'testing', 'List title available');
    t.equal(testingList.items.length, allItems, 'Amount matches');

    var item = testingList.items[0];
    t.equal(item.title, 'Die Simpsons - Die komplette Season 1 (Collector\'s Edition, 3 DVDs)', 'Item title available');
    t.equal(item.id, 'B00005MFO7', 'Item ID available');
    t.equal(item.priority, 2, 'Item priority available');
    t.equal(item.comment, 'Just a test comment.', 'Item comment available');
    t.equal(item.currency, 'EUR', 'Item currency available');
    t.equal(item.price, 13.99, 'Item price available');
    t.equal(item.link, 'https://amazon.de/dp/B00005MFO7', 'Item link available');
  });
});

test('Get list by invalid id', function (t) {
  t.plan(1);

  var awl = new AmazonWishList('de');
  awl.getById('id-fail').then( function(result) {
  }, function(err) {
    t.equal(err.statusCode, 404, 'Rejected with 404');
  });
});
