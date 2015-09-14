(function($) {
  $('.social-media-twitter').on('click', function() {
    ga('send', 'event', 'twitter', 'tweet');
    window.open($(this).data('social'), '_blank');
  });
  $('.social-media-facebook').on('click', function() {
    ga('send', 'event', 'facebook', 'share');
    window.open($(this).data('social'), '_blank');
  });

  $('.single-item').slick({
    dots: true,
    arrows: false,
    infinite: true,
    speed: 300,
    customPaging: function(slider, i) {
      var year = $(slider.$slides[i]).find('.media-heading').text();
      return '<a>' + year + '</a>';
    },
    // adaptiveHeight: true,
    // centerMode: true,
    // slideToShow: 3
    slidesToShow: 1,
    centerMode: true,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          variableWidth: false,
          centerMode: false
        }
      },
    ]
  });
})(jQuery);
