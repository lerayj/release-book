function defaultErrorCallback(err) {
  console.log('ERROR : ', err)
}

////   FUNCTIONS  UTILS
var tab = [];

function getPositions() {
  tab.length = 0; // clear the table
  $('.topMarqueur').each(function() {
    tab.push($(this).offset().top);
  });
};

function scrollTo(index) {
  $('html,body').animate({
    scrollTop: index
  }, 1000, 'swing');
};

function scrollPrevious() {
  if ($('body').is(':animated')) return;
  var index = -1;
  if (window.scrollY > tab[0] && window.scrollY < tab[1]) {
    index = 0;
  }
  if (tab[0] < window.scrollY) {
    for (var i = tab.length; i > -1; i--) {
      if (tab[i] < window.scrollY - 1) {
        index = i;
        break;
      }
    }
  }
  if (index >= 0) {
    scrollTo(tab[index]);
  }
}

function scrollNext() {
  if ($('body').is(':animated')) return;
  var index = 0;

  for (var i = 0; i < tab.length; i++) {
    if (tab[i] > window.scrollY + 1) {
      index = i;
      break;
    }
    index = tab.length - 1;
  }
  if (i == 0) {
    scrollTo(tab[1]);
  }
  if (i > 0 && i < tab.length) {
    scrollTo(tab[index]);
  }
}

/// Scroll to top
$("#scrollTop").click(function(e) {
  e.preventDefault();
  $('html, body').animate({
    scrollTop: '0px'
  }, 1000);
});
//scroll to last
$('.scrollLast.button').click(function() {
  scrollTo($('time:last').offset().top);
});
//Scroll to next
$('.scrollNext.button').click(scrollNext);

$('.scrollPrevious.button').click(scrollPrevious)


//////// Functions api
function getReleases(params, success, error) {
  var url = "/api/releases?";
  if (params && params.search) {
    url += "search=" + params.search;
  }
  if(params && params.appfilter){

  }
  if(params && params.typefilter){

  }
  $.ajax({
    url: url,
    success: success,
    error: error
  });
}

function displayReleases(releases) {
  var compiled_tpl = _.template($('#release_tpl').html());
  _.each(releases, function(release) {
    var generatedHTML = compiled_tpl(release);
    $("#release_timeline").append(generatedHTML);
  });
  getPositions();
}

//////////// SEARCH
$("#search_button").click(function(e) {
  e.preventDefault();
  var keywords = $("#searchinput").val();
  var params = {
    search: keywords
  };
  getReleases(params, displayReleases, defaultErrorCallback);
});



//// Navigation on releases
$(document).keydown(function(e) {
  e.preventDefault();
  // Down arrow
  if (e.keyCode == 40) {
    scrollNext();
  }
  // Up arrow
  if (e.keyCode == 38) {
    scrollPrevious()
  }
});




// Begin main program
$(document).foundation();
getReleases({}, displayReleases, defaultErrorCallback);
