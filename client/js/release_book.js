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
    console.log(error + "c'est la merde noire");
  }
});

//////////// SEARCH
$("#search_button").click(function(e) {
  e.preventDefault();
  var keywords = $("#searchinput").val();
  $.ajax({
    method: "GET",
    url: "/api/releases?search=" + keywords,
    success: function(releases) {
      console.log(releases);
      $("#release_timeline").html("");
      _.each(releases, function(release) {
        var generatedHTML = compiled_tpl(release);
        $("#release_timeline").append(generatedHTML);
      });
    },
    error: function(error) {
      console.log(error + "c'est la merde noire");
    }
  });
});



//// Navigation on releases
$(document).keydown(function(e) {
  e.preventDefault();
  // Down arrow
  if (e.keyCode == 40) {
    console.log('DOWN');
  }
  // Up arrow
  if (e.keyCode == 38) {
    console.log('UP');
  }
});


/// Scroll to top
$("#scrollTop").click(function(e) {
  e.preventDefault();
  $('html, body').animate({
    scrollTop: '0px'
  }, 1000);
});


// Begin foundation
$(document).foundation();
