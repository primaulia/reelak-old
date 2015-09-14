/***************************************************
 * Quiz section
 **************************************************/

(function($) {
	/**
	 * @constructor Quiz
	 * @extends {SectionWithSlides}
	 */
	Tribal.FuelYourSenses.Quiz = function() {}

	// Extend the quiz section with slides functionality
	Tribal.FuelYourSenses.Quiz.prototype = new Tribal.FuelYourSenses.SectionWithSlides();
	Tribal.FuelYourSenses.Quiz.prototype.constructor = Tribal.FuelYourSenses.Quiz;
	Tribal.FuelYourSenses.Quiz.prototype.parent = Tribal.FuelYourSenses.SectionWithSlides.prototype;
	Tribal.FuelYourSenses.Quiz.prototype.type = "_quiz";
	Tribal.FuelYourSenses.Quiz.prototype.$sectionElement = $("section.quiz");
	Tribal.FuelYourSenses.Quiz.prototype.currentSlideIndex = 0;

	// Events
	Tribal.FuelYourSenses.QuizEvent = {
		ON_QUIZ_RESULT: "quiz.onQuizResult"
	};

	/** 
	 * init
	 * Initiates the quiz section
	 */
	Tribal.FuelYourSenses.Quiz.prototype.init = function() {
		this.debugUtil = new Tribal.FuelYourSenses.utils.debugUtil(1);
	   this.viewModeUtil = new Tribal.FuelYourSenses.utils.viewModeUtil();
	   
	   this.debugUtil.log(this.type, "init");

	   var self = this;
	   this.quizAnswers = [];

	   // Setup start quiz button
	   $("section.quiz").find("a.start-quiz-button").click(function(evt) {
	      $("section.quiz").find("a.next-section-button").addClass("dark-blue");
	      self.animateToSlideByIndex(self.currentSlideIndex+1);
	      evt.preventDefault();
	      return false;
	   });

	   // Setup restart quiz button
	   $("section.quiz").find("a.restart-quiz-button").click(function(evt) {
	      self.resetQuiz();
	      self.animateToSlideByIndex(1);
	      evt.preventDefault();
	      return false;
	   });

	   // Setup answer buttons
	   $("section.quiz").find("a.answer-button").click(function(evt) {
	      var answered = self.addAnswerAtIndex(
	         parseInt($(this).attr("data-question-index")), 
	         parseInt($(this).attr("data-answer-value")));
	      if (answered) {
	         var questionIndex = $(this).attr("data-question-index");
	         $("section.quiz").find("a.answer-button[data-question-index='"+questionIndex+"']").removeClass("selected");
	         $(this).addClass("selected");
	         self.animateToSlideByIndex(self.currentSlideIndex+1);
	         self.applyAnswerTypeToEndSlide();
	      }
	      evt.preventDefault();
	      return false;
	   });
	   /*
	   $('#all360-play').click(function(evt) {
	   		$('#pano').show();
			if(!document.domain && window.chrome && location.search.toLowerCase().indexOf("html5=only") > 0) {
           		document.getElementById("pano").innerHTML = '<table style="width:100%;height:100%;"><tr style="vertical-align:middle;text-align:center;"><td>Loading local/offline xml files is not allowed in HTML5 due Chrome security restrictions!<br>Use a localhost server (like the <a href="http://krpano.com/tools/ktestingserver/#top">krpano Testing Server</a>) for local/offline testing.</td></tr></table>';
            } else {
            	function selecthtml5usage(){
					// check for Android:
					if( navigator.userAgent.indexOf("Android") >= 0 )
					return "prefer"

					// check for IE10 with multi-touch display:
					if( (navigator.msMaxTouchPoints|0) > 1 )
					return "prefer"

					// for all other cases use html5=auto:
					return "auto";
				}
           		embedpano({swf:"/all360media/player.swf", xml:"/all360media/player.xml", target:"pano", id: 'pano1', html5:selecthtml5usage(), passQueryParameters:true});
            }
	   		evt.preventDefault();
	   		return false;	
	   });

	   $('.video-modal-360').click(function(evt) {
	   		if( $(evt.target).closest('#pano').length === 0 ){
	   			removepano('pano1');
	   			$('#pano').hide();
	   		}
	   });
	   */
	   
	   // Toggle next section button colour on last answer button rollover
	   $("section.quiz").find("a.answer-button").mouseover(function() {
	      var questionIndex = $(this).attr("data-question-index");
	      var lastAnswerButton = $("section.quiz").find("a.answer-button[data-question-index='"+questionIndex+"']:last");
	      if (parseInt(lastAnswerButton.attr("data-answer-value")) == parseInt($(this).attr("data-answer-value"))) {
	         $("section.quiz").find("a.next-section-button").removeClass("dark-blue");
	      }
	   });

	   // Toggle next section button colour on last answer button rollout
	   $("section.quiz").find("a.answer-button").mouseout(function() {
	      var questionIndex = $(this).attr("data-question-index");
	      var lastAnswerButton = $("section.quiz").find("a.answer-button[data-question-index='"+questionIndex+"']:last");
	      if (parseInt(lastAnswerButton.attr("data-answer-value")) == parseInt($(this).attr("data-answer-value"))) {
	         $("section.quiz").find("a.next-section-button").addClass("dark-blue");
	      }
	   });

	   // Default to white next section button
	   $("section.quiz").find("a.next-section-button").removeClass("dark-blue");
	};

	/** 
	 * addAnswerAtIndex
	 * Adds an answer value to a given index
	 */
	Tribal.FuelYourSenses.Quiz.prototype.addAnswerAtIndex = function(index, value) {
	   if (this.quizAnswers.length < index)
	      return false;
	   this.quizAnswers.splice(index, 1, value);
	   this.debugUtil.log(this.type, "addAnswerAtIndex", index, value, this.quizAnswers);
	   return true;
	};

	/** 
	 * applyAnswerTypeToEndSlide
	 * Applies the answer type to the end slide
	 */
	Tribal.FuelYourSenses.Quiz.prototype.applyAnswerTypeToEndSlide = function() {
	   this.debugUtil.log(this.type, "applyAnswerTypeToEndSlide", this.quizAnswers);
	   var totalScore = 0;
	   var quizQuestionsTotal = $("section.quiz").find(".slide[data-slide-type='question']").length;
	   var quizScoresObj = {};
	   for (var i=0; i<quizQuestionsTotal; i++) {
	      quizScoresObj["answerValue"+(i+1)] = 0;
	   }
	   for (var i=0; i<this.quizAnswers.length; i++) {
	      $("section.quiz").find(".slide[data-slide-id='end']").removeClass("answer-type-"+(i+1));
	      quizScoresObj["answerValue"+this.quizAnswers[i]] += 1;
	   }
	   var mostCommonScoreKey;
	   for (var key in quizScoresObj) {
	      if (!mostCommonScoreKey)
	         mostCommonScoreKey = key;
	      if (quizScoresObj[key] > quizScoresObj[mostCommonScoreKey])
	         mostCommonScoreKey = key;
	   }
	   var mostCommonScoreType = parseInt(mostCommonScoreKey.toString().replace("answerValue", ""));
	   if (this.quizAnswers.length >= quizQuestionsTotal) {
	   	$("body").trigger(Tribal.FuelYourSenses.QuizEvent.ON_QUIZ_RESULT, {
		   	quizScoresObj: quizScoresObj,
		   	mostCommonScoreKey: mostCommonScoreKey,
		   	mostCommonScoreType: mostCommonScoreType
		   });
	   }
	   $("section.quiz")
	      .find(".slide[data-slide-id='end']")
	      .addClass("answer-type-"+mostCommonScoreType);
	};

	/** 
	 * resetQuiz
	 * Resets the quiz
	 */
	Tribal.FuelYourSenses.Quiz.prototype.resetQuiz = function() {
	   this.quizAnswers = [];
	   $("section.quiz").find("a.answer-button").removeClass("selected");
	};
})(jQuery);