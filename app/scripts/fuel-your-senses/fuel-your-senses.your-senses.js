/***************************************************
 * Your senses section
 **************************************************/

(function($) {
	/**
	 * @constructor YourSenses
	 * @extends {SectionWithSlides}
	 */
	Tribal.FuelYourSenses.YourSenses = function() {};

	// Extend the your senses section with slides functionality
	Tribal.FuelYourSenses.YourSenses.prototype = new Tribal.FuelYourSenses.SectionWithSlides();
	Tribal.FuelYourSenses.YourSenses.prototype.constructor = Tribal.FuelYourSenses.YourSenses;
	Tribal.FuelYourSenses.YourSenses.prototype.parent = Tribal.FuelYourSenses.SectionWithSlides.prototype;
	Tribal.FuelYourSenses.YourSenses.prototype.type = "_yourSenses";
	Tribal.FuelYourSenses.YourSenses.prototype.$sectionElement = $("section.your-senses");
	Tribal.FuelYourSenses.YourSenses.prototype.currentSlideIndex = 0;

	/**
	 * init
	 * Initiates the your senses section
	 */
	Tribal.FuelYourSenses.YourSenses.prototype.init = function() {
	   this.debugUtil = new Tribal.FuelYourSenses.utils.debugUtil(1);
	   this.viewModeUtil = new Tribal.FuelYourSenses.utils.viewModeUtil();
	   this.osUtil = new Tribal.FuelYourSenses.utils.osUtil();


	   this.debugUtil.log(this.type, "init");

	   var self = this;
	   this.currentVideoModal = null;

	   // Setup Hammer
	   this.enableHammerPanHandling();

	   // Setup sight button
	   $("section.your-senses").find("a.sight-button").click(function(evt) {
			 	console.log('sight');
	      self.animateToSlideByIndex(self.currentSlideIndex-1);
	      evt.preventDefault();
	      return false;
	   });

	   // Setup sound button
	   $("section.your-senses").find("a.sound-button").click(function(evt) {
				console.log('sound');
	      self.animateToSlideByIndex(self.currentSlideIndex+1);
	      evt.preventDefault();
	      return false;
	   });

	   // Setup back to choose button
	   $("section.your-senses").find("a.back-to-choose-button").click(function(evt) {
	      self.animateToSlideByIndex(parseInt($("section.your-senses").find(".your-senses-slide[data-slide-id='choose']").attr("data-slide-index")));
	      evt.preventDefault();
	      return false;
	   });

	   // Setup play video button
		 $("section.slick").find("a.play-video-button").click(function(evt) {
			 console.log('click');
	      var videoModal = $("#"+$(this).attr("data-video-modal-id"));
	      self.debugUtil.log("_yourSenses", "playVideoButton.click();", videoModal);
	      if (videoModal.length !== 0) {
	         videoModal.find("iframe.video-player")[0].src += "&autoplay=1";
					 console.log('show modal');
	         videoModal.modal("show");
	         self.currentVideoModal = videoModal;
	      }
	      evt.preventDefault();
	      return false;
	   });

	   $("section.your-senses").find("a.play-video-button").click(function(evt) {
	      var videoModal = $("#"+$(this).attr("data-video-modal-id"));
	      self.debugUtil.log("_yourSenses", "playVideoButton.click();", videoModal);
	      if (videoModal.length !== 0) {
	         videoModal.find("iframe.video-player")[0].src += "&autoplay=1";
					 console.log('show modal');
	         videoModal.modal("show");
	         self.currentVideoModal = videoModal;
	      }
	      evt.preventDefault();
	      return false;
	   });

	   if($("html.no-touch").find('#all360-play').length === 0) {
	   		$("html.no-touch ").find('#all360-play').removeClass('play').addClass('chevron-right');
	   }

	   // Setup the making of sound video button
	   $("section.your-senses").find("a.the-making-of-sound-video-button").click(function(evt) {
	      var videoModal = $("#"+$(this).attr("data-video-modal-id"));
	      self.debugUtil.log("_yourSenses", "playTheMakingOfSoundVideoButton.click();", videoModal);
	      if (videoModal.length !== 0) {
	         videoModal.find("iframe.video-player")[0].src += "&autoplay=1";
	         videoModal.modal("show");
	         self.currentVideoModal = videoModal;
	      }
	      evt.preventDefault();
	      return false;
	   });

	   // Pause the videos when the modals are closed
	   $("#your-senses-sight-video-modal, #your-senses-sound-video-modal, #your-senses-360-experience, #your-senses-the-making-of-sound-video-modal").on("hidden.bs.modal", function () {
	      var $ytPlayerIframe = $(this).find("iframe.video-player")[0].contentWindow;
	      $ytPlayerIframe.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
	   });


	   //showing different copy for different devices
   	   $('.detect-os-hide').hide();
	   if( this.osUtil.isAndroid() ) {
	   		$('.detect-os-hide.android').show();
	   } else if( this.osUtil.isiOS() ) {
	   		$('.detect-os-hide.ios').show();
	   } else {
	   		$('.detect-os-hide.desktop').show();
	   }


	   // Animate to default slide
	   this.animateToSlideByIndex(1);

	   // Add the animate in/out state based on section relevance
	   function setSectionAnimateInOrOutState() {
	      var sectionHalfHeight = ($("section.your-senses").outerHeight()/2);
	      var sectionOffsetCenter = $("section.your-senses").offset().top + sectionHalfHeight;
	      var sectionOffsetCenterLeeway = 50;
	      var windowScrollCenter = $(window).scrollTop() + ($(window).height()/2);
	      var sectionDistFromWindowScrollCenter = Math.max(0, Math.min(sectionOffsetCenter - windowScrollCenter, sectionHalfHeight)-sectionOffsetCenterLeeway);

	      var invertedSectionDistFromWindowScrollCenterPercent = 100 - (100 / sectionHalfHeight * sectionDistFromWindowScrollCenter);
	      var sectionHalfWidthAnimationPercent = 50 / 100 * invertedSectionDistFromWindowScrollCenterPercent;

	      var sightSlideLeftPercent = "-"+(50-sectionHalfWidthAnimationPercent)+"%";
	      $("section.your-senses").find(".choose-button-container.sight").css("left", sightSlideLeftPercent);

	      var soundSlideLeftPercent = (100-sectionHalfWidthAnimationPercent)+"%";
	      $("section.your-senses").find(".choose-button-container.sound").css("left", soundSlideLeftPercent);

	      if(sectionHalfWidthAnimationPercent >= 50) {
					$("section.your-senses").find(".choose-button-container").removeClass("animating");
				} else {
					$("section.your-senses").find(".choose-button-container").addClass("animating");
				}
	   }

	   $(window).scroll(function(evt) {
	      setSectionAnimateInOrOutState();
	   });

	   $(window).resize(function(evt) {
	      setSectionAnimateInOrOutState();
	   });

	   setSectionAnimateInOrOutState();
	};
})(jQuery);
