//import Promise from 'bluebird';
import rp from 'request-promise';
import cheerio from 'cheerio';

class AmazonWishList {
  constructor(tld = 'de') {
    var that = this;
    this.baseUrl = 'https://amazon.' + tld;

    this.getPage = function(url) {
      var options = {
        uri: that.baseUrl + url,
        transform: function (body) {
          return cheerio.load(body);
        }
      };

      return rp(options).then(function($) {
        return that.getItems($);
      });
    }

    this.getItems = function($) {
      return new Promise(function(resolve, reject) {
        var items = [];
        var $items = $('.g-items-section>div');

        $items.each(function() {
          var title = $('h5', this).text().trim();
          var id = $('h5 a', this).attr('href').split('/')[2];
          var link = that.baseUrl + '/dp/' + id;
          var priority = $('.g-item-comment-row span span.a-hidden', this).text().trim();
          var comment = $('.g-item-comment-row .g-comment-quote.a-text-quote', this).text().trim();
          var price = $('.price-section .a-color-price', this).text().trim().split(' ');
          var currency = price[0];
          price = price[1];

          items.push({
            id: id,
            title: title,
            link: link,
            priority: priority,
            comment: comment,
            currency: currency,
            price: price
          });
        });

        resolve(items);
      });
    }
  }

  getListById(id) {
    var that = this;
    var url = '/gp/registry/wishlist/' + id;
    var options = {
      uri: this.baseUrl + url,
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    return rp(options).then(function($) {
      var promises = [];
      var list = {
        title: $('.profile-layout-aid-top .clip-text span').text().trim(),
        items: []
      };

      /* Initial Page */
      promises.push(that.getItems($));

      /* Following pages */
      var $pages = $('.a-pagination li:not(.a-selected, .a-last) a');
      $pages.each(function() {
        var url = $(this).attr('href');
        promises.push(that.getPage(url));
      });

      return Promise.all(promises).then(function(responses) {
        for(var i in responses) {
          var current = responses[i];
          list.items = list.items.concat(current);
        }

        return list;
      });
    });
  }
}

export default AmazonWishList;
