////   FUNCTIONS  UTILS
function defaultErrorCallback(err) {
  console.log('ERROR : ', err)
};

var tab = [];

function getPositions() {
  tab.length = 0; // clear the table
  $('.topMarqueur').each(function() {
    tab.push($(this).offset().top);
  });
};

function scrollTo(ytop) {
  // Make a margin to take the sticky header into account
  // var realYTop = ytop - $("header").height();
  $('html,body').animate({
    scrollTop: ytop
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
};

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

//When changing date
$('#dp1').on('changeDate',function(){
  var params = {
    datefilter:$('#dp1').text()
  }
  getReleases(params,displayReleases,defaultErrorCallback);
});

//adding impact filter
$('#type a').click(function(){
  var params = {
    filter = this.text()
  }
getReleases(params,displayReleases,defaultErrorCallback);
});


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
$('.scrollPrevious.button').click(scrollPrevious);
$(document).keydown(function(e) {
  // Down arrow
  if (e.keyCode == 40) {
    scrollNext();
  }
  // Up arrow
  if (e.keyCode == 38) {
    scrollPrevious()
  }
});

//datepicker
$(function(){
  var date = new Date();
  $('#dp1').fdatepicker({
    initialDate: '01-'+date.getMonth()+1+'-'+date.getFullYear(),
		format: 'dd-mm-yyyy',
		disableDblClickSelection: true
  })
})

//////// Functions api
function getReleases(params, success, error) {
  var url = "/api/releases?";
  if (params && params.search) {
    url += "search=" + params.search;
  }
  if (params && params.appfilter) {

  }
  if (params && params.typefilter) {

  }
  if (params && params.datefilter) {
    url+="date="+params.datefilter;
  }
  if (params && params.filter) {
    url+="filter="+params.filter;
  }
  $.ajax({
    url: url,
    success: success,
    error: error
  });
}

function displayReleases(releases) {
  $("#release_timeline").fadeOut(100);
  $("#release_timeline").html("");
  var compiled_tpl = _.template($('#release_tpl').html());
  _.each(releases, function(release) {
    var formatesDate = new Date(release.release_date).toISOString().substring(0, 10);
    release.release_date_formatted = formatesDate;
    var generatedHTML = compiled_tpl(release);
    $("#release_timeline").append(generatedHTML);
  });
  $("#release_timeline").fadeIn(100);
  $(document).foundation();
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
$(document).foundation();
$('.title-bar').on('sticky.zf.stuckto:top', function(){
  $(this).addClass('shrink');
}).on('sticky.zf.unstuckfrom:top', function(){
  $(this).removeClass('shrink');
})
console.log(Foundation.version);

$(window).resize(function() {
  getPositions();
});
getReleases({}, displayReleases, defaultErrorCallback);
