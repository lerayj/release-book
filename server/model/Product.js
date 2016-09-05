var _ = require('underscore');

var formatCategories = function(stringCategs) {
  var jsonCategs = JSON.parse(stringCategs);

  var rootNode = {
    id: "total",
    value: 0,
    children: []
  };

  // Compute depth of each node
  var nodesByDepth = [];
  var keys = _.keys(jsonCategs);
  _.each(keys, (key) => {
    var count = key.split('|').length;
    if (!_.isArray(nodesByDepth[count])) {
      nodesByDepth[count] = [];
    }
    nodesByDepth[count].push(key);
  });

  // Create tree
  _.each(nodesByDepth, (nodesDepth, index) => {
    if (index > 0) {
      _.each(nodesDepth, (key) => {
        if (index == 1) {
          rootNode.value = rootNode.value + jsonCategs[key];
          rootNode.children.push({
            value: jsonCategs[key],
            id: key,
            children: []
          });
        } else {
          var parents = key.split('|');
          var parentNode = rootNode;
          for (var i = 0; i < parents.length - 1; i++) {
            var indexChild = _.findIndex(parentNode.children, {
              id: parents[i]
            });
            parentNode = parentNode.children[indexChild];
          }
          parentNode.children.push({
            id: parents[parents.length - 1],
            value: jsonCategs[key],
            children: []
          });
        }
      });
    }
  });

  return rootNode;
};

function CategoryView(apiResult) {
  this.id = apiResult.Ve_cookie._;
  if (apiResult.Email) {
    this.email = apiResult.Email._;
  }
  if (apiResult.UserAgent) {
    this.userAgent = apiResult.UserAgent._;
  }
  if (apiResult.Categories) {
    this.categories = formatCategories(apiResult.Categories._);
  }
  this.geoloc = {};
  if (apiResult.City) {
    this.geoloc.city = apiResult.City._;
  }
  if (apiResult.Continent) {
    this.geoloc.continent = apiResult.Continent._;
  }
  if (apiResult.Country) {
    this.geoloc.country = apiResult.Country._;
  }
  if (apiResult.CountryCode) {
    this.geoloc.countryCode = apiResult.CountryCode._;
  }
  if (apiResult.Latitude) {
    this.geoloc.latitude = apiResult.Latitude._;
  }
  if (apiResult.Longitude) {
    this.geoloc.longitude = apiResult.Longitude._;
  }
  if (apiResult.TotalPage) {
    this.totalPage = apiResult.TotalPage._;
  }
  if (apiResult.ViewedAt) {
    this.viewedAt = apiResult.ViewedAt._;
  }
}

module.exports = CategoryView;
