//var test = require('tape');
import test from 'tape';
import AmazonWishList from '../lib/';

function compareItem(t, item, reference) {
  t.equal(item.title, reference.title, 'Item title available');
  t.equal(item.id, reference.id, 'Item ID available');
  t.equal(item.priority, reference.priority, 'Item priority available');
  t.equal(item.comment, reference.comment, 'Item comment available');
  t.equal(item.currency, reference.currency, 'Item currency available');
  t.ok((!isNaN(item.price) || item.currency === 'N/A'), 'Item price available');
  t.equal(item.link, reference.link, 'Item link available');
}

function tests(tld) {
  return new Promise(function(resolve, reject) {
    var testData = require('./tld/' + tld + '.js');
    var allItems = 0;

    test(tld + ': List ID: unpurchased', function(t) {
      t.plan(10);

      var awl = new AmazonWishList(tld);
      awl.getById(testData.listID).then(function(result) {
        t.equal(result.title, testData.title, 'List title available');
        t.equal(result.id, testData.listID, 'List id available');
        t.ok(result.items.length >= testData.itemCount, 'Pagination is working');
        allItems += result.items.length;

        var last = result.items[result.items.length - 1];
        compareItem(t, last, testData.unpurchased);
      });
    });

    test(tld + ': List ID: purchased', function (t) {
      t.plan(10);

      var awl = new AmazonWishList(tld);
      awl.getById(testData.listID, 'purchased').then( function(result) {
        t.equal(result.title, testData.title, 'List title available');
        t.equal(result.id, testData.listID, 'List id available');
        t.equal(result.items.length, 1, 'Amount matches');
        allItems += result.items.length;

        var last = result.items[result.items.length - 1];
        compareItem(t, last, testData.purchased);
      });
    });

    test(tld + ': List ID: all', function (t) {
      t.plan(10);

      var awl = new AmazonWishList(tld);
      awl.getById(testData.listID, 'all').then( function(result) {
        t.equal(result.title, testData.title, 'List title available');
        t.equal(result.id, testData.listID, 'List id available');
        t.equal(result.items.length, allItems, 'Amount matches');

        var last = result.items[result.items.length - 1];
        compareItem(t, last, testData.unpurchased);
      });
    });

    test(tld + ': List ID: all, sort: price', function (t) {
      t.plan(10);

      var awl = new AmazonWishList(tld);
      awl.getById(testData.listID, 'all', 'price').then( function(result) {
        t.equal(result.title, testData.title, 'List title available');
        t.equal(result.id, testData.listID, 'List id available');
        t.equal(result.items.length, allItems, 'Amount matches');

        var item = result.items[0];
        compareItem(t, item, testData.byPrice);
      });
    });

    test(tld + ': List ID: all, sort: price-desc', function (t) {
      t.plan(10);

      var awl = new AmazonWishList(tld);
      awl.getById(testData.listID, 'all', 'price-desc').then( function(result) {
        t.equal(result.title, testData.title, 'List title available');
        t.equal(result.id, testData.listID, 'List id available');
        t.equal(result.items.length, allItems, 'Amount matches');

        var item = result.items[0];
        compareItem(t, item, testData.byPriceDesc);
      });
    });

    test(tld + ': List ID: all, sort: title', function (t) {
      t.plan(10);

      var awl = new AmazonWishList(tld);
      awl.getById(testData.listID, 'all', 'title').then( function(result) {
        t.equal(result.title, testData.title, 'List title available');
        t.equal(result.id, testData.listID, 'List id available');
        t.equal(result.items.length, allItems, 'Amount matches');

        var item = result.items[0];
        compareItem(t, item, testData.byTitle);
      });
    });

    test(tld + ': List ID: all, sort: priority', function (t) {
      t.plan(10);

      var awl = new AmazonWishList(tld);
      awl.getById(testData.listID, 'all', 'priority').then( function(result) {
        t.equal(result.title, testData.title, 'List title available');
        t.equal(result.id, testData.listID, 'List id available');
        t.equal(result.items.length, allItems, 'Amount matches');

        var item = result.items[0];
        compareItem(t, item, testData.byPriority);
      });
    });

    test(tld + ': List ID: invalid ID', function (t) {
      t.plan(1);

      var awl = new AmazonWishList(tld);
      awl.getById('id-fail').then( function(result) {
      }, function(err) {
        t.equal(err.statusCode, 404, 'Rejected with 404');
      });
    });

    test(tld + ': Customer ID: unpurchased', function (t) {
      t.plan(2);
      var lists = testData.lists;
      var available = [];

      var awl = new AmazonWishList(tld);
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

    test(tld + ': Customer ID: all', function (t) {
      t.plan(12);
      var lists = testData.lists;
      var available = [];
      var testingList = {};

      var awl = new AmazonWishList(tld);
      awl.getByCid(testData.cid, 'all').then( function(results) {
        t.ok(results.length > 1, 'Contains multiple lists');

        for(var i in results) {
          var current = results[i];
          if(lists.indexOf(current.title) > -1) {
            available.push(true);
            if(current.title === testData.title) {
              testingList = current;
            }
          }
        }

        t.equal(available.length, 3, 'List titles match');

        t.equal(testingList.title, testData.title, 'List title available');
        t.equal(testingList.id, testData.listID, 'List id available');
        t.equal(testingList.items.length, allItems, 'Amount matches');

        var last = testingList.items[testingList.items.length - 1];
        compareItem(t, last, testData.unpurchased);
      });
    });

    test(tld + ': Customer ID: unpurchased, sort: priority', function (t) {
      t.plan(12);
      var lists = testData.lists;
      var available = [];
      var testingList = {};

      var awl = new AmazonWishList(tld);
      awl.getByCid(testData.cid, 'all', 'priority').then( function(results) {
        t.ok(results.length > 1, 'Contains multiple lists');

        for(var i in results) {
          var current = results[i];
          if(lists.indexOf(current.title) > -1) {
            available.push(true);
            if(current.title === testData.title) {
              testingList = current;
            }
          }
        }

        t.equal(available.length, 3, 'List titles match');

        t.equal(testingList.title, testData.title, 'List title available');
        t.equal(testingList.id, testData.listID, 'List id available');
        t.equal(testingList.items.length, allItems, 'Amount matches');

        var item = testingList.items[0];
        compareItem(t, item, testData.byPriority);
      });
    });

    test(tld + ': Customer ID: invalid ID', function (t) {
      t.plan(1);

      var awl = new AmazonWishList(tld);
      awl.getByCid('id-fail').then( function(result) {
      }, function(err) {
        t.equal(err.statusCode, 404, 'Rejected with 404');
        resolve();
      });
    });
  });
}

var promises = [];
promises.push(tests('de'));
promises.push(tests('co.uk'));
promises.push(tests('com'));

Promise.all(promises);
