var compiled_tpl = _.template($('#release_tpl').html());

$.ajax({
  url: "/api/releases",
  success: function(releases) {
    console.log(releases);
    _.each(releases, function(release) {
      var generatedHTML = compiled_tpl(release);
      $("#release_timeline").append(generatedHTML);
    });
  },
  error: function(error) {
    console.log(error + "c'edst la merde noire");
  }
});

$(document).foundation();
