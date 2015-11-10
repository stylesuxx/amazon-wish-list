# Amazon Wish List
[![Build pass](https://travis-ci.org/stylesuxx/amazon-wish-list.svg?branch=master)](https://travis-ci.org/stylesuxx/amazon-wish-list?branch=master)  [![Dependencies](https://david-dm.org/stylesuxx/amazon-wish-list.svg)](https://david-dm.org/stylesuxx/amazon-wish-list)

> A JavaScript scraper for amazon wish lists that returns promises.

## Installation
    npm install amazon-wish-list --save

## Usage
``` JavaScript
var AmazonWishList = require('amazon-wish-list');
var awl = new AmazonWishList();

awl.getById('NDDVVVWMJ6AN').then(function(list) {
  console.log(list);
});
```

## Available methods
The *AmazonWishList* class provides the following methods:

* getById(listId, filter = 'unpurchased', sort = 'date')
* getByCid(cid, filter = 'unpurchased', sort = 'date')

Valid *filter* values are:
* unpurchased
* purchased
* all

Valid *sort* values are:
* date
* price
* price-desc
* title
* priority

## Tested and working amazon TLD's
* de

If you use a TLD not mentioned here, please post your findings to the issue section.

## Testing
Since this is a scraper and relys on the amazon page not changing, an extensive test suite is provided and may be invoked by running:

    npm run test
