/***************************************************
 * Tracking
 * Click handlers for page event tracking
 **************************************************/

(function($) {
	Tribal.FuelYourSenses.Tracking = function() {
		var tracking = {
			/**
			 * init
			 * Initiates tracking
			 */
			init: function() {
				var self = this;
				this.type = "_tracking";

				this.debugUtil = new Tribal.FuelYourSenses.utils.debugUtil(1);
				this.debugUtil.log(this.type, "init");

				this.initGoogleAnalytics();
				this.initFloodlight();
			},

			/**
			 * initFloodlight
			 * Initiates the Floodlight tracking
			 */
			initFloodlight: function() {
				var self = this;

				// Tracking method
				function trackFloodlight(type, cat) {
					var axel = Math.random()+"";
					var a = axel * 10000000000000000;
					var flDiv = document.body.appendChild(document.createElement("div"));
					flDiv.setAttribute("id","DCLK_FLDiv1");
					flDiv.style.position = "absolute";
					flDiv.style.top = "0";
					flDiv.style.left = "0";
					flDiv.style.width = "1px";
					flDiv.style.height = "1px";
					flDiv.style.display = "none";
					flDiv.innerHTML = '<iframe id="DCLK_FLIframe1" src="https://3776718.fls.doubleclick.net/activityi;src=3776718;type=' + type + ';cat=' + cat + ';ord=' + a + '?" width="1" height="1" frameborder="0"><\/iframe>';
				}

				// Your senses
			   $("section.your-senses").find("a.sight-button").click(function(evt) {
			   	self.debugUtil.log(self.type, "FLTrack:UK_FuelYourSenses_Sight");
			   	trackFloodlight("fys", "fys_sght");
			   });

			   $("section.your-senses").find("a.play-sight-video-button").click(function(evt) {
			   	self.debugUtil.log(self.type, "FLTrack:UK_FuelYourSenses_Sight-Video-Play");
			   	trackFloodlight("fys", "fys_srtv");
			   });

			   $("section.your-senses").find("a.sound-button").click(function(evt) {
			   	self.debugUtil.log(self.type, "FLTrack:UK_FuelYourSenses_Sound");
			   	trackFloodlight("fys", "fys_soun");
			   });

			   $("section.your-senses").find("a.play-sound-video-button").click(function(evt) {
			   	self.debugUtil.log(self.type, "FLTrack:UK_FuelYourSenses_Sound-Video-Play");
			   	trackFloodlight("fys", "fys_sndv");
			   });

				// Murray
			   $("section.murray").find("a.social-button.facebook").click(function(evt) {
			    	self.debugUtil.log(self.type, "FLTrack:UK_FuelYourSenses_Esso-Facebook");
			    	trackFloodlight("fys", "fys_esfb");
			   });

			   $("section.murray").find("a.social-button.twitter").click(function(evt) {
			   	self.debugUtil.log(self.type, "FLTrack:UK_FuelYourSenses_Esso-Twitter");
			   	trackFloodlight("fys", "fys_estw");
			   });

			   // Quiz
			  //  $("section.quiz").find("a.start-quiz-button").click(function(evt) {
			  //     self.debugUtil.log(self.type, "FLTrack:UK_FuelYourSenses_Quiz-Start");
			  //  	trackFloodlight("fys", "fys_qzst");
			  //  });

			  //  $("body").bind(Tribal.FuelYourSenses.QuizEvent.ON_QUIZ_RESULT, function(evt, data) {
	      //       self.debugUtil.log(self.type, "FLTrack:UK_FuelYourSenses_Quiz-End");
	      //       trackFloodlight("fys", "fys_qzen");
	      //    });

			   // McLaren-Honda and Esso
				$("section.maclaren-honda-and-esso").find("a.social-button.facebook").click(function(evt) {
			    	self.debugUtil.log(self.type, "FLTrack:UK_FuelYourSenses_McLaren-Facebook");
			    	trackFloodlight("fys", "fys_mlfb");
			   });

			   $("section.maclaren-honda-and-esso").find("a.social-button.twitter").click(function(evt) {
			   	self.debugUtil.log(self.type, "FLTrack:UK_FuelYourSenses_McLaren-Twitter");
			   	trackFloodlight("fys", "fys_mltw");
			   });

			   // Landing page
			   trackFloodlight("fys", "fys_lp");
			},

			/**
			 * initGoogleAnalytics
			 * Initiates the Google Analytics tracking
			 */
			initGoogleAnalytics: function() {
				var self = this;

				// Application
				$("body").bind(Tribal.FuelYourSenses.ApplicationEvent.ON_ANIMATE_TO_SECTION, function(evt, data) {
					self.debugUtil.log(self.type, data.sectionIndex, "GATrack:GoTo");
					switch (data.sectionIndex) {
	            	case 1:
	            		self.debugUtil.log(self.type, "GATrack:Scroll_360_Experience");
	            		ga("send", "event", "GoTo", "Scroll", "Scroll_360_Experience");
	            		break;
	            	case 2:
	            		self.debugUtil.log(self.type, "GATrack:Scroll_Your_Senses");
	            		ga("send", "event", "GoTo", "Scroll", "Scroll_Your_Senses");
	            		break;
	            	case 3:
	            		self.debugUtil.log(self.type, "GATrack:Scroll_Murray_your_tweet");
	            		ga("send", "event", "GoTo", "Scroll", "Scroll_Murray_your_tweet");
	            		break;
	            	case 4:
	            		self.debugUtil.log(self.type, "GATrack:Scroll_Which_member_of_the_team?");
	            		ga("send", "event", "GoTo", "Scroll", "Scroll_Which_member_of_the_team?");
	            		break;
	            	case 5:
	            		self.debugUtil.log(self.type, "GATrack:Scroll_McLaren-Honda");
	            		ga("send", "event", "GoTo", "Scroll", "Scroll_McLaren-Honda");
	            		break;
	            	}
				});

				// Your senses
			   $("section.your-senses").find("a.sight-button").click(function(evt) {
			   	self.debugUtil.log(self.type, "GATrack:Your_Senses_Sight");
			   	ga("send", "event", "Interact", "Click", "Your_Senses_Sight");
			   });

			   $("section.your-senses").find("a.sound-button").click(function(evt) {
			   	self.debugUtil.log(self.type, "GATrack:Your_Senses_Sound");
			   	ga("send", "event", "Interact", "Click", "Your_Senses_Sound");
			   });

			   // Murray
			   $("section.murray").find("a.social-button.facebook").click(function(evt) {
			    	self.debugUtil.log(self.type, "GATrack:Murray_your_tweet_Facebook");
			   	ga("send", "event", "Interact", "Click", "Murray_your_tweet_Facebook");
			   });

			   $("section.murray").find("a.social-button.twitter").click(function(evt) {
			   	self.debugUtil.log(self.type, "GATrack:Murray_your_tweet_Twitter");
			   	ga("send", "event", "Interact", "Click", "Murray_your_tweet_Twitter");
			   });


			   // 360 exp
			   $("section.experience360").find("#all360-play").click(function(evt) {
		    	self.debugUtil.log(self.type, "GATrack:360_Experience");
			   	ga("send", "event", "Interact", "YouTube_clicks", "Youtube_exits");
			   });

			   // Quiz
			   $("section.quiz").find("a.start-quiz-button").click(function(evt) {
			      self.debugUtil.log(self.type, "GATrack:Start_Quiz_McLaren-Honda");
			   	ga("send", "event", "Interact", "Click", "Start_Quiz_McLaren-Honda");
			   });

			  //  $("body").bind(Tribal.FuelYourSenses.QuizEvent.ON_QUIZ_RESULT, function(evt, data) {
	      //       self.debugUtil.log(self.type, data.mostCommonScoreType, "GATrack:Quiz_Result");
	      //       switch (data.mostCommonScoreType) {
	      //       	case 1:
	      //       		self.debugUtil.log(self.type, "GATrack:The_Driver");
	      //       		ga("send", "event", "Interact", "Quiz_Result", "The_Driver");
	      //       		break;
	      //       	case 2:
	      //       		self.debugUtil.log(self.type, "GATrack:The_Mechanic");
	      //       		ga("send", "event", "Interact", "Quiz_Result", "The_Mechanic");
	      //       		break;
	      //       	case 3:
	      //       		self.debugUtil.log(self.type, "GATrack:The_Team_Boss");
	      //       		ga("send", "event", "Interact", "Quiz_Result", "The_Team_Boss");
	      //       		break;
	      //       	case 4:
	      //       		self.debugUtil.log(self.type, "GATrack:Race_Engineer");
	      //       		ga("send", "event", "Interact", "Quiz_Result", "Race_Engineer");
	      //       		break;
	      //       }
	      //    });

				// McLaren-Honda and Esso
				$("section.maclaren-honda-and-esso").find("a.social-button.facebook").click(function(evt) {
			    	self.debugUtil.log(self.type, "GATrack:McLaren-Honda_Facebook");
			   	ga("send", "event", "Interact", "Click", "McLaren-Honda_Facebook");
			   });

			   $("section.maclaren-honda-and-esso").find("a.social-button.twitter").click(function(evt) {
			   	self.debugUtil.log(self.type, "GATrack:McLaren-Honda_Twitter");
			   	ga("send", "event", "Interact", "Click", "McLaren-Honda_Twitter");
			   });
			}
		};
		return tracking;
	};
})(jQuery);
