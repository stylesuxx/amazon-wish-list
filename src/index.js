import rp from 'request-promise';
import cheerio from 'cheerio';

class AmazonWishList {
  constructor(tld = 'de') {
    this.baseUrl = ['https://amazon.', tld].join('');
    this.config = {
      profile: {
        url: [this.baseUrl, 'gp/profile/'].join('/')
      },
      lists: {
        url: [this.baseUrl, 'gp/registry/wishlist/?cid='].join('/'),
        selectors: {
          listLinks: '.wishlist-left-nav .g-left-nav-row a'
        }
      },
      list: {
        url: [this.baseUrl, 'gp/registry/wishlist/'].join('/'),
        selectors: {
          title: '#wl-list-info h1',
          pageLinks: '.a-pagination li:not(.a-selected, .a-last) a',
          items: '#item-page-wrapper .g-items-section>div.a-fixed-left-grid',
          itemTitle: 'h5',
          itemId: 'h5 a',
          itemPriority: '.g-item-comment-row span span.a-hidden',
          itemComment: '.g-item-comment-row .g-comment-quote.a-text-quote',
          itemPriceText: '.price-section .a-color-price'
        }
      }
    };

    this.getProfileUrl = function(cid) {
      return [this.config.profile.url, cid].join('');
    };

    this.getListsUrl = function(cid) {
      return [this.config.lists.url, cid].join('');
    };

    this.getListUrl = function(id) {
      return [this.config.list.url, id].join('');
    };

    this.getItemUrl = function(id) {
      return [this.baseUrl, 'dp', id].join('/');
    };

    this.getPage = function(url) {
      var options = {
        uri: [this.baseUrl, url].join(''),
        transform: (body) => cheerio.load(body)
      };

      return rp(options).then(($) => this.getItems($));
    }

    this.getItems = function($) {
      return new Promise((resolve, reject) => {
        const selectors = this.config.list.selectors;
        const $items = $(selectors.items);
        var items = [];

        $items.each((index, element) => {
          const title = $(selectors.itemTitle, element).text().trim();
          const id = $(selectors.itemId, element).attr('href').split('/')[2];
          const link = this.getItemUrl(id);
          const priority = parseInt($(selectors.itemPriority, element).text().trim()) | 0;
          const comment = $(selectors.itemComment, element).text().trim();
          let priceText = $(selectors.itemPriceText, element).text().trim();
          let currency = 'N/A';
          let price = 'N/A';
          if(priceText) {
            priceText = priceText.replace(',', '.').trim();
            const re = /(\D*)(.*)/;
            const result = re.exec(priceText);

            if(result.length < 3) {
              reject('Could not parse item price.')
            }

            currency = result[1].trim();
            price = parseFloat(parseFloat(result[2]).toFixed(2));
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
    const options = { uri: this.getProfileUrl(cid) };

    return rp(options).then(() => {
      const options = {
        uri: this.getListsUrl(cid),
        transform: (body) => cheerio.load(body)
      };

      return rp(options);
    }).then(($) => {
      var promises = [];
      var lists = [];

      const $lists = $(this.config.lists.selectors.listLinks);
      $lists.each((index, item) => {
        const url = $(item).attr('href');
        const id = url.split('/')[4];

        promises.push(this.getById(id, filter, sort));
      });

      return Promise.all(promises).then(function(responses) {
        for(let response of responses) {
          lists.push(response);
        }

        return new Promise((resolve, reject) => resolve(lists));
      });
    });
  }

  getById(id, filter = 'unpurchased', sort = 'date') {
    const selectors = this.config.list.selectors;
    const options = {
      uri: this.getListUrl(id),
      qs: {
        reveal: filter,
        sort: (sort !== 'priority') ? 'universal-' + sort : sort
      },
      transform: (body) => cheerio.load(body)
    };

    return rp(options).then(($) => {
      var promises = [];
      var list = {
        title: $(selectors.title).text().trim(),
        items: []
      };

      /* Initial Page */
      promises.push(this.getItems($));

      /* Following pages */
      const $pages = $(selectors.pageLinks);
      $pages.each((index, element) => {
        const url = $(element).attr('href');

        promises.push(this.getPage(url));
      });

      return Promise.all(promises).then(function(responses) {
        for(let response of responses) {
          list.items = list.items.concat(response);
        }

        return new Promise((resolve, reject) => resolve(list));
      });
    });
  }
}

export default AmazonWishList;
