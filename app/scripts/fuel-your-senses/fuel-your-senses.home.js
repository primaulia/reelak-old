/***************************************************
 * Home section
 **************************************************/

(function($) {
	Tribal.FuelYourSenses.Home = function() {
	   var home = {
	      /**
	       * init
	       * Initiates the main animation section
	       */
	      init: function() {
	         var self = this;

	         this.$mainAnimation = $(".main-animation");
	         this.$mainAnimationImages = $(".main-animation img");

	         this.MAIN_ANIMATION_TOTAL_DURATION = 6000;

	         // Start the animation once all the images have loaded
	         var mainAnimationImagesToLoad = this.$mainAnimationImages.length;
	         var mainAnimationImagesLoaded = 0;

	         function onImageLoaded() {
	            mainAnimationImagesLoaded++;
	            if (mainAnimationImagesLoaded == mainAnimationImagesToLoad) {
	               setTimeout(function() {
	                  $(".main-animation").addClass("animate");
	                  setTimeout(function() {
	                     self.initMainAnimationParallaxBehaviour();
	                  }, self.MAIN_ANIMATION_TOTAL_DURATION);
	               }, 1000);
	            }
	         };

	         $.each(this.$mainAnimationImages, function(index, item) {
	            $(item).attr("src", $(item).attr("src"));
	            $(item)[0].complete
	               ? onImageLoaded()
	               : $(item)[0].onload = onImageLoaded;
	         });
	      },

	      /**
	       * initMainAnimationParallaxBehaviour
	       * Initiates the main animation parallax behavior
	       */
	      initMainAnimationParallaxBehaviour: function() {
	         var self = this;
	         var resetParallaxBehaviourTimer;
	         var mainAnimationObjects;

	         function resetParallaxBehaviour() {
	            mainAnimationObjects = [{
	               element: $(".main-animation").find(".background"),
	               xPos: $(".main-animation").find(".background").position().left,
	               yPos: $(".main-animation").find(".background").position().top,
	               factor: -0.0075
	            }, {
	               element: $(".main-animation").find(".end-frame .jb"),
	               xPos: $(".main-animation").find(".end-frame .jb").position().left,
	               yPos: $(".main-animation").find(".end-frame .jb").position().top,
	               factor: 0.005
	            },
							// {
	            //    element: $(".main-animation").find(".end-frame .f1-car"),
	            //    xPos: $(".main-animation").find(".end-frame .f1-car").position().left,
	            //    yPos: $(".main-animation").find(".end-frame .f1-car").position().top,
	            //    factor: 0.0075
	            // },
							{
	               element: $(".main-animation").find(".end-frame .middleground"),
	               xPos: $(".main-animation").find(".end-frame .middleground").position().left,
	               yPos: $(".main-animation").find(".end-frame .middleground").position().top,
	               factor: -0.0100
	            }
						];
	            $(".main-animation").on("mousemove", onMouseMove);
	         }

	         function onMouseMove(evt) {
	            var xPos = Math.abs($(this).offset().left - evt.clientX);
	            var yPos = Math.abs($(this).offset().top - evt.clientY);

							//console.log('xpos', xPos);

	            for (var i=0; i<mainAnimationObjects.length; i++) {
	               var objectsTotal = mainAnimationObjects.length;
	               var object = mainAnimationObjects[i];
	               var objectXPos = object.factor * (0.5 * $(".main-animation").width() - xPos) + object.xPos;
	               var objectYPos = object.factor * (0.5 * $(".main-animation").height() - yPos) + object.yPos;
	               $(object.element).css("left", objectXPos + "px");
	            }

	            // Adjust opacity of F1 car
	            var maxDistToCenter = Math.floor(Math.sqrt(Math.pow((self.$mainAnimation.width()/2), 2) + Math.pow((self.$mainAnimation.height()/2), 2)));
	            var distFromCenter = Math.floor(
																		Math.sqrt(
																			Math.pow(xPos - (self.$mainAnimation.width()/2), 2) +
																			Math.pow(yPos - (self.$mainAnimation.height()/2), 2)
																		)
																	);
	            var distFromCenterPercentage = 100 - (100 / maxDistToCenter * distFromCenter);

							//console.log(xPos, xPos - (self.$mainAnimation.width()/2));
							//console.log('distance from center', distFromCenter);
							//console.log('distance from center percentage', distFromCenterPercentage);

							var leftOrRight = xPos - (self.$mainAnimation.width()/2);

							if (leftOrRight < 0) {
		            $(".main-animation")
									.find(".end-frame .jb-shadow-left")
									.css("opacity", (100-distFromCenterPercentage)/100);
							} else {
								$(".main-animation")
									.find(".end-frame .jb-shadow-right")
									.css("opacity", (100-distFromCenterPercentage)/100);
							}
	         }

	         $(window).resize(function() {
	            for (var i=0; i<mainAnimationObjects.length; i++) {
	               var object = mainAnimationObjects[i];
	               $(object.element).css("left", "");
	            }
	            $(".main-animation").off("mousemove", onMouseMove);
	            clearTimeout(resetParallaxBehaviourTimer);
	            resetParallaxBehaviourTimer = setTimeout(function() {
	               resetParallaxBehaviour();
	            }, 500);
	         });

	         resetParallaxBehaviour();
	      }
	   };
	   return home;
	};
})(jQuery);
