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

function getProducts(success, error) {};

function getReleaseTypes(success, error) {};

function getReleaseImpacts(success, error) {};

function getAudiences(success, error) {};

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
  getProducts();
  getAudiences();
  getReleaseTypes();
  getReleaseImpacts();
  getReleases({}, displayReleases, defaultErrorCallback);
})
