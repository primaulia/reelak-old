var Tribal=window.Tribal||{};Tribal.FuelYourSenses=function(a){var b=function(b){function c(b){if(!h)return!0;b=b.originalEvent?b.originalEvent:b;var c=b.wheelDelta?b.wheelDelta/40:b.detail?-b.detail/3:0;return 0>c?(a(e).trigger(e.SCROLL_DOWN,{}),b.preventDefault()&&!1):c>0?(a(e).trigger(e.SCROLL_UP,{}),b.preventDefault()&&!1):void 0}function d(b){return h?void(40===b.keyCode?a(e).trigger(e.SCROLL_DOWN,{}):38===b.keyCode&&a(e).trigger(e.SCROLL_UP,{})):!0}var e=this,f=a(b),g=a(window),h=!1;return e.SCROLL_DOWN="scrollHijack.onScrollDown",e.SCROLL_UP="scrollHijack.onScrollUp",e.init=function(){g.on("DOMMouseScroll mousewheel",c),g.on("keyup",d),Hammer(f[0]).on("swipeup",function(){h&&setTimeout(function(){a(e).trigger(e.SCROLL_DOWN,{})},0)}),Hammer(f[0]).on("swipedown",function(){h&&setTimeout(function(){a(e).trigger(e.SCROLL_UP,{})},0)})},e.enable=function(){h=!0},e.disable=function(){h=!1},e},c={init:function(){function b(){clearTimeout(k),k=setTimeout(function(){var b=a("section.content section[data-scroll-snap='true']:last");if(!(0===a(window).scrollTop()||a(window).scrollTop()==a(document).height()-l.windowUtil.getWindowHeight()||a(window).scrollTop()>a("footer").offset().top||a(window).scrollTop()>b.offset().top)){var c=l.getClosestSectionToWindowScrollCenter();if(0!==c.length&&"true"==c.attr("data-scroll-snap")){var d=1,e=a(window).scrollTop()-d,f=a(window).scrollTop()+d,g=c.offset().top>e&&c.offset().top<f;g||l.animateSnapToSectionPosition(c.offset().top,null)}}},1e3)}function c(){var b=a("section.content .section-navigation"),c=l.getClosestSectionToWindowScrollCenter();if(0!==c.length){var d=b.find("a[data-section-index="+c.attr("data-section-index")+"]");0!==d.length&&(b.find("a").removeClass("selected"),d.addClass("selected"))}}function d(){var b=a(".section-navigation-placeholder").offset().top;a(window).scrollTop()>b?a(".section-navigation").addClass("fixed"):a(".section-navigation").removeClass("fixed")}function e(){var b=a("section.content section"),c=50,d=a(b[0]).height(),e=a(b[0]).offset().top;l.sectionStackedPositions=[],l.sectionStackHeight=d/100*c,a.each(b,function(a){var b=a*d+a*e;l.sectionStackedPositions.push(0!==a?b-a*l.sectionStackHeight:0)})}function f(){if(l.sectionStackingEnabled){var b,c=a("section.content section");a.each(c,function(c,d){var e=a(window).scrollTop()+l.windowUtil.getWindowHeight();if(b){var f=b.offset().top+b.outerHeight();if(e>f){var g=Math.min(Math.abs(f-e),l.sectionStackHeight),h=g;a(d).css("margin-top",-h)}else a(d).css("margin-top",0)}b=a(d)})}}function g(){var b=a("section.content section");b.css("height",l.windowUtil.getWindowHeight()+"px");var c=a("section.content section:eq(0)");c.css("height",l.windowUtil.getWindowHeight()-a("header").outerHeight()+"px")}function h(){a("section.content section").removeClass("animate-in").addClass("animate-out")}function i(){var b=a("section.content section");a.each(b,function(b,c){var d=a(c).offset().top<a(window).scrollTop()+l.windowUtil.getWindowHeight()-l.windowUtil.getWindowHeight()/2,e=a(c).offset().top+a(c).outerHeight()>a(window).scrollTop();e&&d?a(c).removeClass("animate-out").addClass("animate-in"):a(c).removeClass("animate-in").addClass("animate-out")})}function j(){l.enableOrDisableSectionSnapping(),l.enableOrDisableSectionStacking(),d(),g(),e(),f(),b(),i()}var k,l=this;l.isSnappingToSection=!1,l.sectionSnappingEnabled=!0,l.sectionStackingEnabled=!0,l.sectionSnappingReInitTimer=null,l.cookiesMessageResizeTimer=null,l.debugUtil=new Tribal.FuelYourSenses.utils.debugUtil(1),l.viewModeUtil=new Tribal.FuelYourSenses.utils.viewModeUtil,l.osUtil=new Tribal.FuelYourSenses.utils.osUtil,l.windowUtil=new Tribal.FuelYourSenses.utils.windowUtil;var m=new Tribal.FuelYourSenses.YourSenses;m.init();var n=new Tribal.FuelYourSenses.Tracking;n.init(),a(".detect-os-hide").hide(),l.osUtil.isAndroid()?a(".detect-os-hide.android").show():l.osUtil.isiOS()?a(".detect-os-hide.ios").show():a(".detect-os-hide.desktop").show(),a(window).scroll(function(){c(),d(),f(),b(),i()}),a(window).resize(function(){j()}),l.enableOrDisableSectionSnapping(),l.enableOrDisableSectionStacking(),g(),c(),d(),e(),f(),b(),h(),i(),a("a.next-section-button").click(function(a){return l.snapToNextSection(),a.preventDefault(),!1}),a("a.section-navigation-button").click(function(b){return l.snapToSectionByIndex(parseInt(a(this).attr("data-section-index"))),b.preventDefault(),!1}),a(".module-wrapper.cookies span").click(function(){clearInterval(l.cookiesMessageResizeTimer);var b=0;l.cookiesMessageResizeTimer=setInterval(function(){j(),("none"==a(".module-wrapper.cookies").css("display")||b>100)&&clearInterval(l.cookiesMessageResizeTimer),b++},10)});var o=[];return a.each(a("section.content section"),function(b,c){o.push(a(c))}),a("body").on("keydown",function(b){if(9==b.keyCode){var c=l.getClosestSectionToWindowScrollCenter(),d=parseInt(c.attr("data-section-index"))>=a("section.content section").length-1?0:parseInt(c.attr("data-section-index"))+1;l.snapToSectionByIndex(d),b.preventDefault()}}),a(".video-modal").modal(),a(document).on("dragstart",function(a){return"IMG"==a.target.nodeName.toUpperCase()||"A"==a.target.nodeName.toUpperCase()?!1:void 0}),this},getClosestSectionToWindowScrollCenter:function(){var b=this,c=a("section.content section"),d=null,e=0;return a.each(c,function(){if(!a(this).is(":hidden")){var c=a(this).offset().top+a(this).outerHeight()/2,f=a(window).scrollTop()+b.windowUtil.getWindowHeight()/2,g=Math.abs(c-f);(null===d||e>g)&&(d=a(this),e=g)}}),d},enableOrDisableSectionStacking:function(){var b=this,c=0!==a(".support-section-stacking:visible").length&&!b.osUtil.isMobile();c?b.sectionStackingEnabled=!0:(a("section.content section").css("margin-top",""),b.sectionStackingEnabled=!1)},enableOrDisableSectionSnapping:function(){var c=this,d=0!==a(".support-scroll-snap:visible").length;d?(c.scrollHijack||(c.scrollHijack=new b("body"),c.scrollHijack.init(),a(c.scrollHijack).on(c.scrollHijack.SCROLL_DOWN,function(){c.isSnappingToSection||c.snapToNextSection()}),a(c.scrollHijack).on(c.scrollHijack.SCROLL_UP,function(){c.isSnappingToSection||c.snapToPreviousSection()})),c.scrollHijack.enable(),c.sectionSnappingEnabled=!0):(c.scrollHijack&&c.scrollHijack.disable(),c.sectionSnappingEnabled=!1)},animateSnapToSectionPosition:function(b,c){var d=this;if(d.sectionSnappingEnabled){d.isSnappingToSection=!0,clearTimeout(d.sectionSnappingReInitTimer);var e=c&&c.hasClass("your-senses")?2e3:1e3;a("html, body").stop().animate({scrollTop:b},e,function(){clearTimeout(d.sectionSnappingReInitTimer),d.sectionSnappingReInitTimer=setTimeout(function(){d.isSnappingToSection=!1},100)}),c&&0!==c.length&&a("body").trigger(Tribal.FuelYourSenses.ApplicationEvent.ON_ANIMATE_TO_SECTION,{sectionIndex:parseInt(c.attr("data-section-index"))})}},snapToSectionByIndex:function(b){this.debugUtil.log("_application","snapToSectionByIndex",b);var c,d=this;b=parseInt(b);var e=a("section.content section[data-section-index='"+b+"']");d.sectionStackingEnabled&&d.sectionStackedPositions&&d.sectionStackedPositions[b]?(c=parseInt(d.sectionStackedPositions[b]),d.animateSnapToSectionPosition(c,e)):0!==e.length&&(c=0===parseInt(e.attr("data-section-index"))?0:e.offset().top,d.animateSnapToSectionPosition(c,e))},snapToNextSection:function(){var b=this,c=(a("section.content section"),this.getClosestSectionToWindowScrollCenter()),d=parseInt(c.attr("data-section-index")),e=d+1,f=a("section.content section[data-section-index='"+e+"']");if(0===f.length){var g=c.offset().top+c.outerHeight();b.animateSnapToSectionPosition(g,null)}else this.snapToSectionByIndex(e,f)},snapToPreviousSection:function(){var b=this,c=(a("section.content section"),this.getClosestSectionToWindowScrollCenter()),d=parseInt(c.attr("data-section-index")),e=d-1;a(window).scrollTop()>=a(document).height()-b.windowUtil.getWindowHeight()&&(e=parseInt(a("section.content section").length)-1),isNaN(e)||this.snapToSectionByIndex(e)}},d=function(){c.init()};return{init:d}}(jQuery),Tribal.FuelYourSenses.ApplicationEvent={ON_ANIMATE_TO_SECTION:"application.onAnimateToSection"},jQuery(document).ready(function(){Tribal.FuelYourSenses.init()}),Tribal.FuelYourSenses.utils={},function(a){Tribal.FuelYourSenses.utils.debugUtil=function(a){var b={log:function(){a>0&&window.console&&"function"==typeof window.console.log&&console.log.apply(console,arguments)}};return b},Tribal.FuelYourSenses.utils.viewModeUtil=function(){var b={getCurrentViewMode:function(){return a(".view-mode:visible").attr("data-view-mode")}};return b},Tribal.FuelYourSenses.utils.osUtil=function(){var a={isAndroid:function(){return/Android/i.test(navigator.userAgent)},isBlackBerry:function(){return/BlackBerry/i.test(navigator.userAgent)},isiOS:function(){return/iPhone|iPad|iPod/i.test(navigator.userAgent)},isWindows:function(){return/IEMobile/i.test(navigator.userAgent)},isMobile:function(){return this.isAndroid()||this.isBlackBerry()||this.isiOS()||this.isWindows()}};return a},Tribal.FuelYourSenses.utils.windowUtil=function(){var b={getWindowHeight:function(){var b=new Tribal.FuelYourSenses.utils.osUtil;return b.isiOS()?window.innerHeight:a(window).height()}};return b}}(jQuery),function(a){Tribal.FuelYourSenses.SectionWithSlides=function(){var b={init:function(){this.debugUtil=new Tribal.FuelYourSenses.utils.debugUtil(1),this.viewModeUtil=new Tribal.FuelYourSenses.utils.viewModeUtil,this.debugUtil.log(this.type,"init"),this.hammer,this.type,this.$sectionElement,this.currentSlideIndex=0},animateToSlideByIndex:function(a){this.debugUtil.log(this.type,"animateToSlideByIndex",a);var b=this.$sectionElement.find(".slide[data-slide-index='"+a+"']");if(0!=b.length){var c=-(100*a);return this.$sectionElement.find(".slides").stop().animate({left:c+"%"},500),this.currentSlideIndex=a,this.$sectionElement.attr("data-current-slide-index",a),!0}return!1},getHammer:function(){return this.hammer||(this.hammer=new Hammer(this.$sectionElement[0],{})),this.hammer},enableHammerPanHandling:function(){var a=this;this.getHammer().on("panleft",function(b){return a.handleHammerPanLeft(b),!0}),this.getHammer().on("panright",function(b){return a.handleHammerPanRight(b),!0}),this.getHammer().on("panend",function(b){return a.handleHammerPanEnd(b),!0})},handleHammerSwipeLeft:function(){this.currentSlideIndex<this.$sectionElement.find(".slide").length-1&&this.animateToSlideByIndex(this.currentSlideIndex+1)},handleHammerSwipeRight:function(){this.currentSlideIndex>0&&this.animateToSlideByIndex(this.currentSlideIndex-1)},handleHammerPanLeftOrRight:function(b){var c=100/a(window).width()*b.deltaX,d=-(100*this.currentSlideIndex);this.$sectionElement.find(".slides").css("left",d+c+"%")},handleHammerPanLeft:function(a){this.handleHammerPanLeftOrRight(a)},handleHammerPanRight:function(a){this.handleHammerPanLeftOrRight(a)},handleHammerPanEnd:function(a){var b,c=75;a.deltaX>0+c&&(b=this.animateToSlideByIndex(this.currentSlideIndex-1)),a.deltaX<0-c&&(b=this.animateToSlideByIndex(this.currentSlideIndex+1)),b||this.animateToSlideByIndex(this.currentSlideIndex)}};return b}}(jQuery),function(a){Tribal.FuelYourSenses.YourSenses=function(){},Tribal.FuelYourSenses.YourSenses.prototype=new Tribal.FuelYourSenses.SectionWithSlides,Tribal.FuelYourSenses.YourSenses.prototype.constructor=Tribal.FuelYourSenses.YourSenses,Tribal.FuelYourSenses.YourSenses.prototype.parent=Tribal.FuelYourSenses.SectionWithSlides.prototype,Tribal.FuelYourSenses.YourSenses.prototype.type="_yourSenses",Tribal.FuelYourSenses.YourSenses.prototype.$sectionElement=a("section.your-senses"),Tribal.FuelYourSenses.YourSenses.prototype.currentSlideIndex=0,Tribal.FuelYourSenses.YourSenses.prototype.init=function(){function b(){var b=a("section.your-senses").outerHeight()/2,c=a("section.your-senses").offset().top+b,d=50,e=a(window).scrollTop()+a(window).height()/2,f=Math.max(0,Math.min(c-e,b)-d),g=100-100/b*f,h=.5*g,i="-"+(50-h)+"%";a("section.your-senses").find(".choose-button-container.sight").css("left",i);var j=100-h+"%";a("section.your-senses").find(".choose-button-container.sound").css("left",j),h>=50?a("section.your-senses").find(".choose-button-container").removeClass("animating"):a("section.your-senses").find(".choose-button-container").addClass("animating")}this.debugUtil=new Tribal.FuelYourSenses.utils.debugUtil(1),this.viewModeUtil=new Tribal.FuelYourSenses.utils.viewModeUtil,this.osUtil=new Tribal.FuelYourSenses.utils.osUtil,this.debugUtil.log(this.type,"init");var c=this;this.currentVideoModal=null,this.enableHammerPanHandling(),a("section.your-senses").find("a.sight-button").click(function(a){return console.log("sight"),c.animateToSlideByIndex(c.currentSlideIndex-1),a.preventDefault(),!1}),a("section.your-senses").find("a.sound-button").click(function(a){return console.log("sound"),c.animateToSlideByIndex(c.currentSlideIndex+1),a.preventDefault(),!1}),a("section.your-senses").find("a.back-to-choose-button").click(function(b){return c.animateToSlideByIndex(parseInt(a("section.your-senses").find(".your-senses-slide[data-slide-id='choose']").attr("data-slide-index"))),b.preventDefault(),!1}),a("section.slick").find("a.play-video-button").click(function(b){console.log("click");var d=a("#"+a(this).attr("data-video-modal-id"));return c.debugUtil.log("_yourSenses","playVideoButton.click();",d),0!==d.length&&(d.find("iframe.video-player")[0].src+="&autoplay=1",console.log("show modal"),d.modal("show"),c.currentVideoModal=d),b.preventDefault(),!1}),a("section.your-senses").find("a.play-video-button").click(function(b){var d=a("#"+a(this).attr("data-video-modal-id"));return c.debugUtil.log("_yourSenses","playVideoButton.click();",d),0!==d.length&&(d.find("iframe.video-player")[0].src+="&autoplay=1",console.log("show modal"),d.modal("show"),c.currentVideoModal=d),b.preventDefault(),!1}),0===a("html.no-touch").find("#all360-play").length&&a("html.no-touch ").find("#all360-play").removeClass("play").addClass("chevron-right"),a("section.your-senses").find("a.the-making-of-sound-video-button").click(function(b){var d=a("#"+a(this).attr("data-video-modal-id"));return c.debugUtil.log("_yourSenses","playTheMakingOfSoundVideoButton.click();",d),0!==d.length&&(d.find("iframe.video-player")[0].src+="&autoplay=1",d.modal("show"),c.currentVideoModal=d),b.preventDefault(),!1}),a("#your-senses-sight-video-modal, #your-senses-sound-video-modal, #your-senses-360-experience, #your-senses-the-making-of-sound-video-modal").on("hidden.bs.modal",function(){var b=a(this).find("iframe.video-player")[0].contentWindow;b.postMessage('{"event":"command","func":"pauseVideo","args":""}',"*")}),a(".detect-os-hide").hide(),this.osUtil.isAndroid()?a(".detect-os-hide.android").show():this.osUtil.isiOS()?a(".detect-os-hide.ios").show():a(".detect-os-hide.desktop").show(),this.animateToSlideByIndex(1),a(window).scroll(function(){b()}),a(window).resize(function(){b()}),b()}}(jQuery),function(a){Tribal.FuelYourSenses.Tracking=function(){var b={init:function(){this.type="_tracking",this.debugUtil=new Tribal.FuelYourSenses.utils.debugUtil(1),this.debugUtil.log(this.type,"init"),this.initGoogleAnalytics(),this.initFloodlight()},initFloodlight:function(){function b(a,b){var c=Math.random()+"",d=1e16*c,e=document.body.appendChild(document.createElement("div"));e.setAttribute("id","DCLK_FLDiv1"),e.style.position="absolute",e.style.top="0",e.style.left="0",e.style.width="1px",e.style.height="1px",e.style.display="none",e.innerHTML='<iframe id="DCLK_FLIframe1" src="https://3776718.fls.doubleclick.net/activityi;src=3776718;type='+a+";cat="+b+";ord="+d+'?" width="1" height="1" frameborder="0"></iframe>'}var c=this;a("section.your-senses").find("a.sight-button").click(function(){c.debugUtil.log(c.type,"FLTrack:UK_FuelYourSenses_Sight"),b("fys","fys_sght")}),a("section.your-senses").find("a.play-sight-video-button").click(function(){c.debugUtil.log(c.type,"FLTrack:UK_FuelYourSenses_Sight-Video-Play"),b("fys","fys_srtv")}),a("section.your-senses").find("a.sound-button").click(function(){c.debugUtil.log(c.type,"FLTrack:UK_FuelYourSenses_Sound"),b("fys","fys_soun")}),a("section.your-senses").find("a.play-sound-video-button").click(function(){c.debugUtil.log(c.type,"FLTrack:UK_FuelYourSenses_Sound-Video-Play"),b("fys","fys_sndv")}),a("section.murray").find("a.social-button.facebook").click(function(){c.debugUtil.log(c.type,"FLTrack:UK_FuelYourSenses_Esso-Facebook"),b("fys","fys_esfb")}),a("section.murray").find("a.social-button.twitter").click(function(){c.debugUtil.log(c.type,"FLTrack:UK_FuelYourSenses_Esso-Twitter"),b("fys","fys_estw")}),a("section.maclaren-honda-and-esso").find("a.social-button.facebook").click(function(){c.debugUtil.log(c.type,"FLTrack:UK_FuelYourSenses_McLaren-Facebook"),b("fys","fys_mlfb")}),a("section.maclaren-honda-and-esso").find("a.social-button.twitter").click(function(){c.debugUtil.log(c.type,"FLTrack:UK_FuelYourSenses_McLaren-Twitter"),b("fys","fys_mltw")}),b("fys","fys_lp")},initGoogleAnalytics:function(){var b=this;a("body").bind(Tribal.FuelYourSenses.ApplicationEvent.ON_ANIMATE_TO_SECTION,function(a,c){switch(b.debugUtil.log(b.type,c.sectionIndex,"GATrack:GoTo"),c.sectionIndex){case 1:b.debugUtil.log(b.type,"GATrack:Scroll_360_Experience"),ga("send","event","GoTo","Scroll","Scroll_360_Experience");break;case 2:b.debugUtil.log(b.type,"GATrack:Scroll_Your_Senses"),ga("send","event","GoTo","Scroll","Scroll_Your_Senses");break;case 3:b.debugUtil.log(b.type,"GATrack:Scroll_Murray_your_tweet"),ga("send","event","GoTo","Scroll","Scroll_Murray_your_tweet");break;case 4:b.debugUtil.log(b.type,"GATrack:Scroll_Which_member_of_the_team?"),ga("send","event","GoTo","Scroll","Scroll_Which_member_of_the_team?");break;case 5:b.debugUtil.log(b.type,"GATrack:Scroll_McLaren-Honda"),ga("send","event","GoTo","Scroll","Scroll_McLaren-Honda")}}),a("section.your-senses").find("a.sight-button").click(function(){b.debugUtil.log(b.type,"GATrack:Your_Senses_Sight"),ga("send","event","Interact","Click","Your_Senses_Sight")}),a("section.your-senses").find("a.sound-button").click(function(){b.debugUtil.log(b.type,"GATrack:Your_Senses_Sound"),ga("send","event","Interact","Click","Your_Senses_Sound")}),a("section.murray").find("a.social-button.facebook").click(function(){b.debugUtil.log(b.type,"GATrack:Murray_your_tweet_Facebook"),ga("send","event","Interact","Click","Murray_your_tweet_Facebook")}),a("section.murray").find("a.social-button.twitter").click(function(){b.debugUtil.log(b.type,"GATrack:Murray_your_tweet_Twitter"),ga("send","event","Interact","Click","Murray_your_tweet_Twitter")}),a("section.experience360").find("#all360-play").click(function(){b.debugUtil.log(b.type,"GATrack:360_Experience"),ga("send","event","Interact","YouTube_clicks","Youtube_exits")}),a("section.quiz").find("a.start-quiz-button").click(function(){b.debugUtil.log(b.type,"GATrack:Start_Quiz_McLaren-Honda"),ga("send","event","Interact","Click","Start_Quiz_McLaren-Honda")}),a("section.maclaren-honda-and-esso").find("a.social-button.facebook").click(function(){b.debugUtil.log(b.type,"GATrack:McLaren-Honda_Facebook"),ga("send","event","Interact","Click","McLaren-Honda_Facebook")}),a("section.maclaren-honda-and-esso").find("a.social-button.twitter").click(function(){b.debugUtil.log(b.type,"GATrack:McLaren-Honda_Twitter"),ga("send","event","Interact","Click","McLaren-Honda_Twitter")})}};return b}}(jQuery);