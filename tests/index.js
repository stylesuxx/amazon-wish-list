var test = require('tape');
var AmazonWishList = require('../');

var testData = {
  listID: 'NDDVVVWMJ6AN',
  cid: '',
  email: ''
}

test('Get by wish list id', function (t) {
  t.plan(2);

  var awl = new AmazonWishList('de');
  awl.getListById(testData.listID).then( function(result) {
    t.equal(result.title, 'testing', 'List title matches');
    t.ok(result.items.length >= 26, 'Pagination is working');
  });
});