import rp from 'request-promise';

class AmazonWishList {
  constructor(tld = 'de') {
    this.baseUrl = 'https://amazon.' + tld;
  }
}

export default AmazonWishList;
