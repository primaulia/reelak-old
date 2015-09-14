             /***************************************************
              * Your senses section
              **************************************************/

             (function($) {
               /**
                * @constructor Slick
                */
               Tribal.FuelYourSenses.Slick = function() {};

               // Extend the your senses section with slides functionality
               // Tribal.FuelYourSenses.Slick.prototype = new Tribal.FuelYourSenses.SectionWithSlides();
               Tribal.FuelYourSenses.Slick.prototype.constructor = Tribal.FuelYourSenses.Slick;
               // Tribal.FuelYourSenses.Slick.prototype.parent = Tribal.FuelYourSenses.SectionWithSlides.prototype;
               Tribal.FuelYourSenses.Slick.prototype.type = "_slick";
               // Tribal.FuelYourSenses.slick.prototype.$sectionElement = $("section.slick");
               // Tribal.FuelYourSenses.slick.prototype.currentSlideIndex = 0;

               /**
                * init
                * Initiates the your senses section
                */

               console.log('slick init');
               Tribal.FuelYourSenses.Slick.prototype.init = function() {
                 this.debugUtil = new Tribal.FuelYourSenses.utils.debugUtil(1);
                 this.viewModeUtil = new Tribal.FuelYourSenses.utils.viewModeUtil();
                 this.osUtil = new Tribal.FuelYourSenses.utils.osUtil();


                 this.debugUtil.log(this.type, "init");

                 var self = this;
                 this.currentVideoModal = null;

                 // Setup Hammer
                 //  this.enableHammerPanHandling();

                 //Setup play video button
                 $("section.slick").find("a.video-trigger").on('mousedown', function(evt) {
										this.mousePosition = {
											x: evt.clientX
										};
									}).on('mouseup', function(evt) {
										var is_not_drag = ( this.mousePosition.x === evt.clientX ) ? true : false;

										if(is_not_drag) {
											console.log('test');
											var videoModal = $("#" + $(this).attr("data-video-modal-id"));
											self.debugUtil.log(this.type, "playVideoButton.click();", videoModal);
											if (videoModal.length !== 0) {
												videoModal.find("iframe.video-player")[0].src += "&autoplay=1";
												videoModal.modal("show");
												self.currentVideoModal = videoModal;
											}
										}

										evt.preventDefault();
										return false;
                 });

                 $("#your-senses-sight-video-modal, #your-senses-sound-video-modal, #your-senses-360-experience, #your-senses-the-making-of-sound-video-modal").on("hidden.bs.modal", function() {
                   var $ytPlayerIframe = $(this).find("iframe.video-player")[0].contentWindow;
                   $ytPlayerIframe.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                 });


                 $('.variable-width').slick({
                   // dots: true,
                   arrows: false,
                   infinite: true,
                   speed: 300,
                   slidesToShow: 1,
                   centerMode: true,
                   variableWidth: true,
                   responsive: [{
                     breakpoint: 768,
                     settings: {
                       variableWidth: false,
                       centerMode: false
                     }
                   }, ]
                 });
               };
             })(jQuery);
