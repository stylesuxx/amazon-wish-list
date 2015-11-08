var test = require('tape');
var AmazonWishList = require('../');

var testData = {
  listID: '',
  cid: '',
  email: ''
}

test('Find wish list by email', function (t) {
  t.plan(1);

  var awl = new AmazonWishList('de');
  awl.getListById().then( function(result) {
    t.ok(result, 'Lists');
  });
});