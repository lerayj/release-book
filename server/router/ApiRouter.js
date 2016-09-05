const ApiRouter = require('express')();
const _ = require('underscore');
const faker = require('faker');
const Product = require('../model/Product');
const Release = require('../model/Release');

// TODO
ApiRouter.get('/products', (req, res) => {
  res.send('Products!!')
});

ApiRouter.get('/releases', (req, res) => {
  res.send(generateReleases(100));
});

var generateReleases = function(number) {
  var releases = [];
  _.each(_.range(number), function() {
    releases.push(generateRelease());
  });
  return releases;
};

var generateRelease = function() {
  var release = {
    "id": faker.lorem.sentence(),
    "type": "release_note",
    "release_type": [
      "product_launch"
    ],
    "title": {
      "rendered": faker.lorem.sentence()
    },
    "content": {
      "rendered": faker.lorem.paragraphs()
    },
    "audience": [],
    "release_impact": [
      "high"
    ],
    "release_date": faker.date.recent(),
    "key_features": "<ul>\r\n \t<li>merchant can auto provision an account</li>\r\n \t<li>merchant has instructions on how to install and configure his website</li>\r\n \t<li>merchant can launch a panel campaign</li>\r\n</ul>",
    "key_benefits": "<ul>\r\n \t<li>no AM involved</li>\r\n \t<li>saas business model</li>\r\n</ul>",
    "known_limitations": "<ul>\r\n \t<li>retail only</li>\r\n \t<li>US only at launch time</li>\r\n</ul>"
  }
  return release;
}

module.exports = ApiRouter;