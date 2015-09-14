/***************************************************
 * Section with slides
 * Methods inherited by sections with slides
 **************************************************/

(function($) {
	Tribal.FuelYourSenses.SectionWithSlides = function() {
	   var sectionWithSlides = {
	      /** 
	       * init
	       * Initiates the section slides
	       */
	      init: function() {
	         this.debugUtil = new Tribal.FuelYourSenses.utils.debugUtil(1);
	         this.viewModeUtil = new Tribal.FuelYourSenses.utils.viewModeUtil();

	         this.debugUtil.log(this.type, "init");

	         this.hammer;
	         this.type;
	         this.$sectionElement;
	         this.currentSlideIndex = 0;
	      },

	      /** 
	       * animateToSlideByIndex
	       * Animates to a slide by a given slide index
	       */
	      animateToSlideByIndex: function(index) {
      		var self = this;
	         this.debugUtil.log(this.type, "animateToSlideByIndex", index);
	         var $targetSlide = this.$sectionElement.find(".slide[data-slide-index='"+index+"']");
	         if ($targetSlide.length != 0) {
	            var targetLeftPercent = -(index * 100);
	            this.$sectionElement.find(".slides").stop().animate({
	               left: targetLeftPercent + "%"
	            }, 500);
	            this.currentSlideIndex = index;
	            this.$sectionElement.attr("data-current-slide-index", index);
	            return true;
	         }
	         return false;
	      },

	      /** 
	       * getHammer
	       * Return the Hammer.js instance
	       */
	      getHammer: function() {
	         if (!this.hammer)
	            this.hammer = new Hammer(this.$sectionElement[0], {});
	         return this.hammer;
	      },

	      /** 
	       * enableHammerPanHandling
	       * Enables Hammer.js pan handling
	       */
	      enableHammerPanHandling: function() {
	         var self = this;

	         this.getHammer().on('panleft', function(evt) {
	            self.handleHammerPanLeft(evt);
	            return true;
	         });

	         this.getHammer().on('panright', function(evt) {
	            self.handleHammerPanRight(evt);
	            return true;
	         });

	         this.getHammer().on('panend', function(evt) {
	            self.handleHammerPanEnd(evt);
	            return true;
	         });
	      },

	      /** 
	       * handleHammerSwipeLeft
	       * Handles the hammer swipe left gesture
	       */
	      handleHammerSwipeLeft: function(evt) {
	         if(this.currentSlideIndex < this.$sectionElement.find(".slide").length - 1) {
	            this.animateToSlideByIndex(this.currentSlideIndex+1);
	         }
	      },

	      /** 
	       * handleHammerSwipeRight
	       * Handles the hammer swipe right gesture
	       */
	      handleHammerSwipeRight: function(evt) {
	         if(this.currentSlideIndex > 0) {
	            this.animateToSlideByIndex(this.currentSlideIndex-1);
	         }
	      },

	      /** 
	       * handleHammerPanLeftOrRight
	       * Handles the hammer pan left or right gesture
	       */
	      handleHammerPanLeftOrRight: function(evt, callback) {
	         var deltaXAsPercentage = (100 / $(window).width()) * evt.deltaX;
	         var currentSlideLeftPercent = -(this.currentSlideIndex * 100);
	         this.$sectionElement.find(".slides").css("left", (currentSlideLeftPercent + deltaXAsPercentage) + "%");
	      },

	      /** 
	       * handleHammerPanLeft
	       * Handles the hammer pan left gesture
	       */
	      handleHammerPanLeft: function(evt) {
	         var self = this;
	         this.handleHammerPanLeftOrRight(evt);
	      },

	      /** 
	       * handleHammerPanRight
	       * Handles the hammer pan right gesture
	       */
	      handleHammerPanRight: function(evt) {
	         var self = this;
	         this.handleHammerPanLeftOrRight(evt);
	      },

	      /** 
	       * handleHammerPanEnd
	       * Handles the hammer pan left or right gesture end
	       */
	      handleHammerPanEnd: function(evt) {
	         var animatedToSlide;
	         var panThreshold = 75;
	         if (evt.deltaX > 0 + panThreshold) {
	            animatedToSlide = this.animateToSlideByIndex(this.currentSlideIndex-1);
	         }
	         if (evt.deltaX < 0 - panThreshold) {
	            animatedToSlide = this.animateToSlideByIndex(this.currentSlideIndex+1);
	         }
	         if (!animatedToSlide) 
	            this.animateToSlideByIndex(this.currentSlideIndex);
	      }
	   };
	   return sectionWithSlides;
	};
})(jQuery);