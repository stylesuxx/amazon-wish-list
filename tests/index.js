var test = require('tape');
var AmazonWishList = require('../');

var testData = {
  listID: 'NDDVVVWMJ6AN',
  cid: '',
  email: ''
}

test('Get by wish list id', function (t) {
  t.plan(3);

  var awl = new AmazonWishList('de');
  awl.getListById(testData.listID).then( function(result) {
    t.equal(result.title, 'testing', 'List title matches');
    t.ok(result.items.length >= 26, 'Pagination is working');

    var first = result.items[0];
    t.equal(first.title, 'Die Simpsons - Die komplette Season 1 (Collector\'s Edition, 3 DVDs)', 'Item title matches');
  });
});