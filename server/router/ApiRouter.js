const ApiRouter = require('express')();
const _ = require('underscore');
const faker = require('faker');
const Product = require('../model/Product');
const Release = require('../model/Release');
const unirest = require('unirest');

var sizeBatch = 10;
var release_types = [{
  id: "launch",
  icon: "fa-rocket",
  label: "Product launch"
}, {
  id: "major",
  icon: "fa-angle-double-up",
  label: "Major release"
}, {
  id: "minor",
  icon: "fa-angle-up",
  label: "Minor release"
}, {
  id: "debug",
  icon: "fa-bug",
  label: "Debug"
}];

var release_impacts = [{
  id: "high",
  icon: "fa-battery-full",
  label: "High"
}, {
  id: "medium",
  icon: "fa-battery-2",
  label: "Medium"
}, {
  id: "low",
  icon: "fa-battery-quarter",
  label: "Low"
}];

var audiences = [{
  id: "sales",
  icon: "fa-transgender-alt",
  label: "Sales"
}, {
  id: "traders",
  icon: "fa-intersex",
  label: "Traders"
}, {
  id: "designers",
  icon: "fa-venus",
  label: "Designers"
}, {
  id: "techs",
  icon: "fa-mars-stroke",
  label: "Techs"
}];

var products = [{
  id: "dmp",
  icon: "fa-facebook-official",
  label: "DMP"
}, {
  id: "erp",
  icon: "fa-google",
  label: "ERP"
}, {
  id: "panel",
  icon: "fa-twitter",
  label: "Panel"
}];


ApiRouter.get('/releases/types', (req, res) => {
  res.send(release_types);
});

ApiRouter.get('/releases/impacts', (req, res) => {
  res.send(release_impacts);
});

ApiRouter.get('/audiences', (req, res) => {
  res.send(audiences);
});

ApiRouter.get('/products', (req, res) => {
  res.send(products);
  // unirest.get('http://10.161.69.37:8000/wp-json/wp/v2/products?per_page=200')
  //   .headers({
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json'
  //   })
  //   .end(function(response) {
  //     res.send(response.body);
  //   });
});

ApiRouter.get('/releases', (req, res) => {
  var fake_filter = _.clone(releases);

  // Filtres
  if (req.query) {
    if (req.query.product) {
      fake_filter = _.filter(fake_filter, function(release) {
        return release.product === req.query.product;
      });
    }
    if (req.query.type) {
      fake_filter = _.filter(fake_filter, function(release) {
        return release.release_type[0] === req.query.type;
      });
    }
    if (req.query.impact) {
      fake_filter = _.filter(fake_filter, function(release) {
        return release.release_impact[0] === req.query.impact;
      });
    }
    if (req.query.audience) {
      fake_filter = _.filter(fake_filter, function(release) {
        return release.audience[0] === req.query.audience;
      });
    }
  }

  var numberBeforePagination = fake_filter.length;
  console.log(fake_filter.length);

  // Pagination
  if (req.query && req.query.offset) {
    fake_filter = _.first(_.last(fake_filter, req.query.offset), sizeBatch);
  } else {
    fake_filter = _.first(fake_filter, sizeBatch);
  }
  res.send({
    number: numberBeforePagination,
    releases: fake_filter
  });

  // var search = req.query.search || "";
  // unirest.get('http://10.161.69.37:8000/wp-json/wp/v2/releases?search=' + search)
  //   .headers({
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json'
  //   })
  //   .end(function(response) {
  //     res.send(response.body);
  //   });
});

var generateReleases = function(number) {
  var releases = [];
  _.each(_.range(number), function() {
    releases.push(generateRelease());
  });
  releases = _.sortBy(releases, function(release) {
    return -new Date(release.release_date);
  });
  return releases;
};

var generateRelease = function() {
  var release = {
    "id": faker.lorem.sentence(),
    "type": "release_note",
    "release_type": [
      _.sample(release_types).id
    ],
    "title": {
      "rendered": faker.lorem.sentence()
    },
    "content": {
      "rendered": faker.lorem.paragraphs()
    },
    "audience": [
      _.sample(audiences).id
    ],
    "release_impact": [
      _.sample(release_impacts).id
    ],
    "product": _.sample(products).id,
    "release_date": faker.date.recent(),
    "key_features": "<ul>\r\n \t<li>merchant can auto provision an account</li>\r\n \t<li>merchant has instructions on how to install and configure his website</li>\r\n \t<li>merchant can launch a panel campaign</li>\r\n</ul>",
    "key_benefits": "<ul>\r\n \t<li>no AM involved</li>\r\n \t<li>saas business model</li>\r\n</ul>",
    "known_limitations": "<ul>\r\n \t<li>retail only</li>\r\n \t<li>US only at launch time</li>\r\n</ul>"
  }
  return release;
}

var releases = generateReleases(300);

module.exports = ApiRouter;
