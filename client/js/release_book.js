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





//////////// SEARCH
$("#search_button").click(function() {
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
      console.log(error + "c'edst la merde noire");
    }
  });
});



//// Navigation on releases
$(document).keydown(function(e) {
  // Down arrow
  if (e.keyCode == 40) {
    console.log('DOWN');
  }
  // Up arrow
  if (e.keyCode == 38) {
    console.log('UP');
  }
});

$("#scrollTop").click(function(){
  $('html, body').animate({scrollTop: '0px'}, 300);
});


$(document).foundation();
