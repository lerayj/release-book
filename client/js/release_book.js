var products = [];
var release_types = [];
var release_impacts = [];
var audiences = [];

var filters = {
  product: undefined,
  type: undefined,
  impact: undefined,
  audience: undefined,
  offset: undefined
}

//// FUNCTIONS UTILS
function defaultErrorCallback(err) {
  console.log('ERROR : ', err)
};

function displayProducts() {
  $.ajax({
    url: "/api/products",
    success: function(api_products) {
      products = api_products;
      var compiled_menu_item_tpl = _.template($('#menu_item_tpl').html());
      var generatedHTML = compiled_menu_item_tpl({
        items: products
      });
      $("#list_products").append(generatedHTML);
    },
    error: defaultErrorCallback
  });
};

function displayReleaseTypes() {
  $.ajax({
    url: "/api/releases/types",
    success: function(api_types) {
      release_types = api_types;
      var compiled_menu_item_tpl = _.template($('#menu_item_tpl').html());
      var generatedHTML = compiled_menu_item_tpl({
        items: release_types
      });
      $("#list_release_types").append(generatedHTML);
    },
    error: defaultErrorCallback
  });
};

function displayReleaseImpacts(callback) {
  $.ajax({
    url: "/api/releases/impacts",
    success: function(api_impacts) {
      release_impacts = api_impacts;
      var compiled_menu_item_tpl = _.template($('#menu_item_tpl').html());
      var generatedHTML = compiled_menu_item_tpl({
        items: release_impacts
      });
      $("#list_release_impacts").append(generatedHTML);
      if (callback) {
        callback();
      }
    },
    error: defaultErrorCallback
  });
};

function displayAudiences() {
  $.ajax({
    url: "/api/audiences",
    success: function(api_audiences) {
      audiences = api_audiences;
      var compiled_menu_item_tpl = _.template($('#menu_item_tpl').html());
      var generatedHTML = compiled_menu_item_tpl({
        items: audiences
      });
      $("#list_audiences").append(generatedHTML);
    },
    error: defaultErrorCallback
  });
};

//////// Functions api
function getReleases(params, success, error) {
  var url = "/api/releases?";
  if (params && params.search) {
    url += "search=" + params.search;
  }
  if (params && params.product) {

  }
  if (params && params.type) {

  }
  if (params && params.impact) {

  }
  if (params && params.audience) {

  }
  if (params && params.offset) {

  }
  $.ajax({
    url: url,
    success: success,
    error: error
  });
};

function displayReleases(response) {
  var releases = response.releases;
  releases = _.sortBy(releases, function(release) {
    return -new Date(release.release_date);
  });

  _.each(releases, function(release) {
    release.release_date_formatted = new moment(release.release_date).fromNow();
    release.product = _.find(products, function(product) {
      return product.id === release.product;
    })
    release.release_type = _.find(release_types, function(type) {
      return type.id === release.release_type[0];
    })
    release.audience = _.find(audiences, function(audience) {
      return audience.id === release.audience[0];
    })
    release.release_impact = _.find(release_impacts, function(impact) {
      return impact.id === release.release_impact[0];
    })
  });

  var compiled_timeline_tpl = _.template($('#release_timeline_tpl').html());
  var compiled_release_tpl = _.template($('#release_tpl').html());

  var generatedHTML = compiled_timeline_tpl({
    releases: releases
  });
  $("#release_timeline").html("");
  $("#release_timeline").append(generatedHTML);

  var generatedDetails = compiled_release_tpl(releases[0]);
  $("#detail_panel").html(generatedDetails);

  $(".timeline_item").hover(function(event) {
    var index = event.target.id;
    var detailshtml = compiled_release_tpl(releases[index]);
    $("#detail_panel").html(detailshtml);
  });
};

//// Loading management
var $loading = $('#spinner').hide();
$(document)
  .ajaxStart(function() {
    $loading.show();
  })
  .ajaxStop(function() {
    $loading.hide();
  });

// Begin main program
$(document).ready(function() {
  $(document).foundation();
  displayProducts();
  displayAudiences();
  displayReleaseTypes();
  displayReleaseImpacts(function() {
    getReleases({}, displayReleases, defaultErrorCallback);
  });
})
