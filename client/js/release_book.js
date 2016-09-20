// Déclaration des variables qui vont contenir la data
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
      $("#list_products a").click(function(event) {
        var product_id = event.target.id;
        filters.product = product_id;
        getReleases(filters, displayReleases, defaultErrorCallback);
      })
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
      $("#list_release_types a").click(function(event) {
        var type_id = event.target.id;
        filters.type = type_id;
        getReleases(filters, displayReleases, defaultErrorCallback);
      })
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
      $("#list_release_impacts a").click(function(event) {
        var impact_id = event.target.id;
        filters.impact = impact_id;
        getReleases(filters, displayReleases, defaultErrorCallback);
      })
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
      $("#list_audiences a").click(function(event) {
        var audience_id = event.target.id;
        filters.audience = audience_id;
        getReleases(filters, displayReleases, defaultErrorCallback);
      })
    },
    error: defaultErrorCallback
  });
};

function initResetFilters() {
  $('#remove_filter').click(function(event) {
    event.preventDefault();
    filters = {
      product: undefined,
      type: undefined,
      impact: undefined,
      audience: undefined,
      offset: undefined
    };
    getReleases(filters, displayReleases, defaultErrorCallback);
  });
}
//////// Functions api
function getReleases(params, success, error) {
  var url = "/api/releases?";

  var args = [];
  if (params && params.product) {
    args.push("product=" + params.product);
  }
  if (params && params.type) {
    args.push("type=" + params.type);
  }
  if (params && params.impact) {
    args.push("impact=" + params.impact);
  }
  if (params && params.audience) {
    args.push("audience=" + params.audience);
  }
  if (params && params.offset) {
    args.push("offset=" + params.offset);
  }

  var query = args.join("&");
  console.log("query:", query);
  url = url + query;

  $.ajax({
    url: url,
    success: function(response) {
      // Réordonnancement
      var releases = response.releases;
      releases = _.sortBy(releases, function(release) {
        return -new Date(release.release_date);
      });
      // Binding des icones...
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
      success(releases);
    },
    error: error
  });
};

function displayReleases(releases) {
  var compiled_timeline_tpl = _.template($('#release_timeline_tpl').html());
  var compiled_release_tpl = _.template($('#release_tpl').html());

  var generatedHTML = compiled_timeline_tpl({
    releases: releases
  });
  $("#release_timeline").html("");
  $("#release_timeline").append(generatedHTML);

  var generatedDetails = compiled_release_tpl(releases[0]);
  $("#detail_panel").html(generatedDetails);

  // Changement du paneau de droite sur le hover d'un item de la timeline
  $(".timeline_item").hover(function(event) {
    var index = event.target.id;
    var detailshtml = compiled_release_tpl(releases[index]);
    $("article").animate({
      scrollTop: 0
    }, "fast");
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
  initResetFilters();
  displayProducts();
  displayAudiences();
  displayReleaseTypes();
  displayReleaseImpacts(function() {
    getReleases({}, displayReleases, defaultErrorCallback);
  });
})
