import rp from 'request-promise';
import cheerio from 'cheerio';

class AmazonWishList {
  constructor(tld = 'de') {
    this.baseUrl = 'https://amazon.' + tld;

    this.getPage = function(url) {
      var options = {
        uri: this.baseUrl + url,
        transform: function (body) {
          return cheerio.load(body);
        }
      };

      return rp(options).then(($) => {
        return this.getItems($);
      });
    }

    this.getItems = function($) {
      return new Promise((resolve, reject) => {
        var items = [];
        var $items = $('.g-items-section>div');

        $items.each((index, element) => {
          var title = $('h5', element).text().trim();
          var id = $('h5 a', element).attr('href').split('/')[2];
          var link = this.baseUrl + '/dp/' + id;
          var priority = parseInt($('.g-item-comment-row span span.a-hidden', element).text().trim()) | 0;
          var comment = $('.g-item-comment-row .g-comment-quote.a-text-quote', element).text().trim();
          var price = $('.price-section .a-color-price', element).text();
          var currency = 'N/A';
          if(price) {
            price = price.replace(',', '.').trim().split(' ');
            currency = price[0];
            price = parseFloat(parseFloat(price[1]).toFixed(2));
          }
          else {
            price = 'N/A';
          }

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

  getByCid(cid, filter = 'unpurchased', sort = 'date') {
    var url = '/gp/registry/wishlist/?cid=' + cid;
    var options = {
      uri: this.baseUrl + url,
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    return rp(options).then(($) => {
      var promises = [];
      var lists = [];

      var $lists = $('.wishlist-left-nav .g-left-nav-row a');
      $lists.each((index, item) => {
        var url = $(item).attr('href');
        var id = url.split('/')[4];
        promises.push(this.getById(id, filter, sort));
      });

      return Promise.all(promises).then(function(responses) {
        for(var i in responses) {
          var current = responses[i];
          lists.push(current);
        }

        return new Promise(function(resolve, reject) {
          resolve(lists);
        });
      });
    });
  }

  getById(id, filter = 'unpurchased', sort = 'date') {
    var url = '/gp/registry/wishlist/' + id;
    var options = {
      uri: this.baseUrl + url,
      qs: {
        reveal: filter,
        sort: (sort != 'priority') ? 'universal-' + sort : sort
      },
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    return rp(options).then(($) => {
      var promises = [];
      var list = {
        title: $('.profile-layout-aid-top .clip-text span').text().trim(),
        items: []
      };

      /* Initial Page */
      promises.push(this.getItems($));

      /* Following pages */
      var $pages = $('.a-pagination li:not(.a-selected, .a-last) a');
      $pages.each((index, element) => {
        var url = $(element).attr('href');
        promises.push(this.getPage(url));
      });

      return Promise.all(promises).then(function(responses) {
        for(var i in responses) {
          var current = responses[i];
          list.items = list.items.concat(current);
        }

        return new Promise(function(resolve, reject) {
          resolve(list);
        });
      });
    });
  }
}

export default AmazonWishList;
