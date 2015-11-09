# Amazon Wish List
A JavaScript scraper for amazon wish lists that returns promises.

Calls to the classes methods return promises.

## Installation
    npm install amazon-wish-list --save

## Usage
``` JavaScript
var AmazonWishList = require('amazon-wish-list');
var awl = new AmazonWishList();

awl.getByID('NDDVVVWMJ6AN').then(function(list) {
  console.log(list);
});
```

## Available methods
The *AmazonWishList* class provides the following methods:

* getById(listID)

## Tested and working amazon TLD's
* de

If you use a TLD not mentioned here, please post your findings to the issue section.

## Testing
Since this is a scraper and relys on the amazon page not changing, an extensive test suite is provided and may be invoked by running:
    npm run test
