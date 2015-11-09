var test = require('tape');
var AmazonWishList = require('../');

var testData = {
  listID: 'NDDVVVWMJ6AN',
  email: '',
  cid: ''
}

test('Get by wish list id', function (t) {
  t.plan(9);

  var awl = new AmazonWishList('de');
  awl.getById(testData.listID).then( function(result) {
    t.equal(result.title, 'testing', 'List title available');
    t.ok(result.items.length >= 26, 'Pagination is working');

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