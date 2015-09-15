var Tribal = window.Tribal || {};

/***************************************************
 * Application functionality
 ***************************************************
 * Logic deemed to be in the scope of the application
 * • Section mechanic
 * • Navigation
 * • Shared elements
 **************************************************/

Tribal.FuelYourSenses = function($) {
  /**
   * ScrollHijack
   * Scroll Hijack component
   * This component serves only to hijack the users scroll, it should not effect the DOM in any way
   * TO change the DOM upon SCROLL_UP or SCROLL_DOWN listen to these events and respond accordingly
   * @requires Hammer.js
   * @todo: Convert this into a reusable jQuery component
   */
  var ScrollHijack = function(context) {
    var self = this,
      $element = $(context),
      $window = $(window),
      enabled = false;

    self.SCROLL_DOWN = "scrollHijack.onScrollDown";
    self.SCROLL_UP = "scrollHijack.onScrollUp";

    // Private

    function onMouseWheel(evt) {
      if (!enabled)
        return true;
      evt = evt.originalEvent ? evt.originalEvent : evt;
      var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail / 3 : 0;
      if (delta < 0) {
        $(self).trigger(self.SCROLL_DOWN, {});
        return evt.preventDefault() && false;
      } else if (delta > 0) {
        $(self).trigger(self.SCROLL_UP, {});
        return evt.preventDefault() && false;
      }
    }

    function onKeyUp(evt) {
      if (!enabled)
        return true;
      if (evt.keyCode === 40) {
        $(self).trigger(self.SCROLL_DOWN, {});
      } else if (evt.keyCode === 38) {
        $(self).trigger(self.SCROLL_UP, {});
      }
    }

    // Public

    self.init = function() {
      $window.on("DOMMouseScroll mousewheel", onMouseWheel);
      $window.on("keyup", onKeyUp);

      Hammer($element[0]).on("swipeup", function() {
        if (!enabled)
          return;
        setTimeout(function() {
          $(self).trigger(self.SCROLL_DOWN, {});
        }, 0);
      });

      Hammer($element[0]).on("swipedown", function() {
        if (!enabled)
          return;
        setTimeout(function() {
          $(self).trigger(self.SCROLL_UP, {});
        }, 0);
      });
    };

    self.enable = function() {
      enabled = true;
    };

    self.disable = function() {
      enabled = false;
    };

    // Interface
    return self;
  };

  /**
   * fuelYourSensesApplication
   * Fuel you senses base application object
   */
  var fuelYourSensesApplication = {
    /**
     * init
     * Initiates the section snapping
     */
    init: function() {
      var self = this;
      var snapToSectionTimer;

      var config = {
        pageId: "",
        noToggleItems: '.no-toggle, .dropdown-menu', //Elements that will not trigger bootstrap dropdown toggle when clicked
        jsFormSubmitEls: '.js-submit',
        videoEls: '.video-player',
        videoRootId: 'video-player'
      };

      self.isSnappingToSection = false;
      self.sectionSnappingEnabled = true;
      self.sectionStackingEnabled = true;
      self.sectionSnappingReInitTimer = null;
      self.cookiesMessageResizeTimer = null;

      // Utils
      self.debugUtil = new Tribal.FuelYourSenses.utils.debugUtil(1);
      self.viewModeUtil = new Tribal.FuelYourSenses.utils.viewModeUtil();
      self.osUtil = new Tribal.FuelYourSenses.utils.osUtil();
      self.windowUtil = new Tribal.FuelYourSenses.utils.windowUtil();

      // var home = new Tribal.FuelYourSenses.Home();
      // home.init();
      var yourSenses = new Tribal.FuelYourSenses.YourSenses();
      yourSenses.init();
      // var slick = new Tribal.FuelYourSenses.Slick();
      // slick.init();
      // var quiz = new Tribal.FuelYourSenses.Quiz();
      // quiz.init();
      var tracking = new Tribal.FuelYourSenses.Tracking();
      tracking.init();

      $('.detect-os-hide').hide();
      if( self.osUtil.isAndroid() ) {
         $('.detect-os-hide.android').show();
      } else if( self.osUtil.isiOS() ) {
         $('.detect-os-hide.ios').show();
      } else {
         $('.detect-os-hide.desktop').show();
      }

      // Snap to closest section
      function snapToClosestSection() {
        clearTimeout(snapToSectionTimer);
        snapToSectionTimer = setTimeout(function() {
          // Bounce if scroll is at top or bottom
          var $lastSnapToSection = $("section.content section[data-scroll-snap='true']:last");
          if ($(window).scrollTop() === 0 ||
            $(window).scrollTop() == $(document).height() - self.windowUtil.getWindowHeight() ||
            $(window).scrollTop() > $("footer").offset().top ||
            $(window).scrollTop() > $lastSnapToSection.offset().top)
            return;
          var $closestSection = self.getClosestSectionToWindowScrollCenter();
          if ($closestSection.length !== 0 && $closestSection.attr("data-scroll-snap") == "true") {
            var scrollLeeway = 1;
            var scrollRangeBottom = $(window).scrollTop() - scrollLeeway;
            var scrollRangeTop = $(window).scrollTop() + scrollLeeway;
            var isAlreadyOnSection = $closestSection.offset().top > scrollRangeBottom && $closestSection.offset().top < scrollRangeTop;
            if (!isAlreadyOnSection)
              self.animateSnapToSectionPosition($closestSection.offset().top, null);
          }
        }, 1000);
      }

      // Select the correct section navigation button
      function selectSectionNavigationButtonByClosestSection() {
        var $sectionNavigation = $("section.content .section-navigation");
        var $closestSection = self.getClosestSectionToWindowScrollCenter();
        if ($closestSection.length !== 0) {
          var $targetSectionNavigationButton = $sectionNavigation.find("a[data-section-index=" + $closestSection.attr("data-section-index") + "]");
          if ($targetSectionNavigationButton.length !== 0) {
            $sectionNavigation.find("a").removeClass("selected");
            $targetSectionNavigationButton.addClass("selected");
          }
        }
      }

      // Select the correct position for the navigation
      function setFixedOrAbsoluteNavigation() {
        var sectionNavigationPlaceholderTop = $(".section-navigation-placeholder").offset().top;
        ($(window).scrollTop() > sectionNavigationPlaceholderTop) ? $(".section-navigation").addClass("fixed"): $(".section-navigation").removeClass("fixed");
      }

      // Initiate the section scroll stacking
      // We have avoided using scroll hi-jacking plugins as they are not very user friendly
      // Instead we apply some organic flavour with the following
      function initSectionScrollStacking() {
        var $sections = $("section.content section"),
          sectionStackPercent = 50,
          sectionHeight = $($sections[0]).height(),
          firstSectionTop = $($sections[0]).offset().top; // @note: Will always be the top of the sections
        self.sectionStackedPositions = [];
        self.sectionStackHeight = (sectionHeight / 100) * sectionStackPercent;
        $.each($sections, function(index, item) {
          // Calculate section offset top. @note: Don't use $section.offset().top as this will not be reliable anywhere but scrollTop == 0
          var sectionTop = (index * sectionHeight) + (index * firstSectionTop);
          (index !== 0) ? self.sectionStackedPositions.push(sectionTop - (index * self.sectionStackHeight)) : self.sectionStackedPositions.push(0);
        });
      }

      // Handle the section scroll stacking
      // As we scroll down this logic will bring the next section over the top of the previous
      function handleSectionScrollStacking() {
        if (!self.sectionStackingEnabled)
          return;
        var $sections = $("section.content section"),
          $previousSection;
        $.each($sections, function(index, item) {
          var windowBottom = $(window).scrollTop() + self.windowUtil.getWindowHeight();
          if ($previousSection) {
            var previousSectionBottom = $previousSection.offset().top + $previousSection.outerHeight();
            if (previousSectionBottom < windowBottom) {
              var sectionTop = previousSectionBottom + 1; // @note: + 1 pixel to get the top
              var distanceAboveWindowBottom = Math.min(Math.abs(previousSectionBottom - windowBottom), self.sectionStackHeight);
              var distanceToMove = distanceAboveWindowBottom;
              $(item).css("margin-top", -distanceToMove);
            } else {
              $(item).css("margin-top", 0);
            }
          }
          $previousSection = $(item);
        });
      }

      // Fit sections to window
      function fitSectionsToWindow() {
        var $sections = $("section.content section");
        $sections.css("height", self.windowUtil.getWindowHeight() + "px");
        var $firstSection = $("section.content section:eq(0)");
        $firstSection.css("height", (self.windowUtil.getWindowHeight() - $("header").outerHeight()) + "px");
      }

      // Initiate the sections animation state
      function initSectionsAnimationState() {
        $("section.content section").removeClass("animate-in").addClass("animate-out");
      }

      // Set the animation state by toggling an animate-in/out class on each section when they enter/leave viewport
      function setSectionsAnimationState() {
        var $sections = $("section.content section");
        $.each($sections, function(index, item) {
          var sectionIsInViewBottom = $(item).offset().top < $(window).scrollTop() + self.windowUtil.getWindowHeight() - (self.windowUtil.getWindowHeight() / 2);
          var sectionIsInViewTop = $(item).offset().top + $(item).outerHeight() > $(window).scrollTop();
          if (sectionIsInViewTop && sectionIsInViewBottom) {
            $(item).removeClass("animate-out").addClass("animate-in");
          } else {
            $(item).removeClass("animate-in").addClass("animate-out");
          }
        });
      }

      // Event handlers

      $(window).scroll(function(evt) {
        selectSectionNavigationButtonByClosestSection();
        setFixedOrAbsoluteNavigation();
        handleSectionScrollStacking();
        snapToClosestSection();
        setSectionsAnimationState();
      });

      function handleWindowResize() {
        // Re-enable or disable as view mode may have changed
        self.enableOrDisableSectionSnapping();
        self.enableOrDisableSectionStacking();

        setFixedOrAbsoluteNavigation();
        fitSectionsToWindow();
        initSectionScrollStacking();
        handleSectionScrollStacking();
        snapToClosestSection();
        setSectionsAnimationState();
      }

      $(window).resize(function(evt) {
        handleWindowResize();
      });

      // Enable or disable snapping and stacking based on current view
      self.enableOrDisableSectionSnapping();
      self.enableOrDisableSectionStacking();

      // Initiate
      fitSectionsToWindow();
      selectSectionNavigationButtonByClosestSection();
      setFixedOrAbsoluteNavigation();
      initSectionScrollStacking();
      handleSectionScrollStacking();
      snapToClosestSection();
      initSectionsAnimationState();
      setSectionsAnimationState();

      // Setup shared buttons
      $("a.next-section-button").click(function(evt) {
        self.snapToNextSection();
        evt.preventDefault();
        return false;
      });

      // Setup section navigation
      $("a.section-navigation-button").click(function(evt) {
        self.snapToSectionByIndex(parseInt($(this).attr("data-section-index")));
        evt.preventDefault();
        return false;
      });

      // Fix issues with cookie message messing with window height
      $(".module-wrapper.cookies span").click(function(evt) {
        clearInterval(self.cookiesMessageResizeTimer);
        var cookiesMessageResizeCount = 0;
        self.cookiesMessageResizeTimer = setInterval(function() {
          handleWindowResize();
          if ($(".module-wrapper.cookies").css("display") == "none" || cookiesMessageResizeCount > 100)
            clearInterval(self.cookiesMessageResizeTimer);
          cookiesMessageResizeCount++;
        }, 10);
      });

      // Setup tab order
      var sectionTabOrder = [];
      $.each($("section.content section"), function(index, item) {
        sectionTabOrder.push($(item));
      });
      $('body').on('keydown', function(evt) {
        if (evt.keyCode == 9) {
          var $closestSection = self.getClosestSectionToWindowScrollCenter();
          var tabToSectionIndex = parseInt($closestSection.attr("data-section-index")) >= $("section.content section").length - 1 ? 0 : parseInt($closestSection.attr("data-section-index")) + 1;
          self.snapToSectionByIndex(tabToSectionIndex);
          evt.preventDefault();
        }
      });

      // Setup shared video modals
      $(".video-modal").modal();

      // Stop Firefox image dragging
      $(document).on("dragstart", function(evt) {
        if (evt.target.nodeName.toUpperCase() == "IMG" || evt.target.nodeName.toUpperCase() == "A")
          return false;
      });

      return this;
    },

    /**
     * getClosestSectionToWindowScrollCenter
     * Returns the closest section to the window scroll center
     */
    getClosestSectionToWindowScrollCenter: function() {
      var self = this;
      var sections = $("section.content section");
      var $closestSectionToWindowScrollCenter = null;
      var closestSectionToWindowScrollTopDist = 0;
      $.each(sections, function() {
        if ($(this).is(":hidden"))
          return;
        var sectionOffsetCenter = $(this).offset().top + ($(this).outerHeight() / 2);
        var windowScrollCenter = $(window).scrollTop() + (self.windowUtil.getWindowHeight() / 2);
        var sectionDistFromWindowScrollCenter = Math.abs(sectionOffsetCenter - windowScrollCenter);
        if ($closestSectionToWindowScrollCenter === null || sectionDistFromWindowScrollCenter < closestSectionToWindowScrollTopDist) {
          $closestSectionToWindowScrollCenter = $(this);
          closestSectionToWindowScrollTopDist = sectionDistFromWindowScrollCenter;
        }
      });
      return $closestSectionToWindowScrollCenter;
    },

    /**
     * enableOrDisableSectionStacking
     * Enables or disables the section stacking
     */
    enableOrDisableSectionStacking: function() {
      var self = this;
      // @note: shouldEnableSectionStacking is defined by a DOM element which is shown hidden by CSS
      // this allows full control of whether to support section stacking from your stylesheets media queries (see SASS mixin support-section-stacking)
      var shouldEnableSectionStacking = $(".support-section-stacking:visible").length !== 0 && !self.osUtil.isMobile();
      if (shouldEnableSectionStacking) {
        self.sectionStackingEnabled = true;
      } else {
        $("section.content section").css("margin-top", ""); // Reset the stack
        self.sectionStackingEnabled = false;
      }
    },

    /**
     * enableOrDisableSectionSnapping
     * Enables or disables the section snapping
     */
    enableOrDisableSectionSnapping: function() {
      var self = this;
      // @note: shouldEnableSectionSnapping is defined by a DOM element which is shown hidden by CSS
      // this allows full control of whether to support scroll snapping from your stylesheets media queries (see SASS mixin support-scroll-snap)
      var shouldEnableSectionSnapping = $(".support-scroll-snap:visible").length !== 0;
      if (shouldEnableSectionSnapping) {
        if (!self.scrollHijack) {
          self.scrollHijack = new ScrollHijack("body");
          self.scrollHijack.init();
          $(self.scrollHijack).on(self.scrollHijack.SCROLL_DOWN, function() {
            if (self.isSnappingToSection)
              return;
            self.snapToNextSection();
          });
          $(self.scrollHijack).on(self.scrollHijack.SCROLL_UP, function() {
            if (self.isSnappingToSection)
              return;
            self.snapToPreviousSection();
          });
        }
        self.scrollHijack.enable();
        self.sectionSnappingEnabled = true;
      } else {
        if (self.scrollHijack)
          self.scrollHijack.disable();
        self.sectionSnappingEnabled = false;
      }
    },

    /**
     * animateSnapToSectionPosition
     * Animates the snap to a given section
     * This opens a sinlge point of entry for animating to a section
     * thus making it super easy to cancel snapping from this one location if !sectionSnappingEnabled
     */
    animateSnapToSectionPosition: function(scrollTop, $section) {
      var self = this;
      if (!self.sectionSnappingEnabled)
        return;
      self.isSnappingToSection = true;
      clearTimeout(self.sectionSnappingReInitTimer);
      var duration = $section && $section.hasClass("your-senses") ? 2000 : 1000;
      $("html, body").stop().animate({
        scrollTop: scrollTop
      }, duration, function() {
        clearTimeout(self.sectionSnappingReInitTimer);
        self.sectionSnappingReInitTimer = setTimeout(function() {
          self.isSnappingToSection = false; // @note: Set isSnappingToSection to false so as not to block section snapping
        }, 100);
      });
      if ($section && $section.length !== 0) {
        $("body").trigger(Tribal.FuelYourSenses.ApplicationEvent.ON_ANIMATE_TO_SECTION, {
          sectionIndex: parseInt($section.attr("data-section-index"))
        });
      }
    },

    /**
     * snapToSectionByIndex
     * Snaps to a section by a given index
     */
    snapToSectionByIndex: function(index) {
      this.debugUtil.log("_application", "snapToSectionByIndex", index);
      var scrollTop,
        self = this;
      index = parseInt(index);
      var $targetSection = $("section.content section[data-section-index='" + index + "']");
      // Use stacked section positions if stacking has been enabled
      // Otherwise use section positions
      if (self.sectionStackingEnabled && self.sectionStackedPositions && self.sectionStackedPositions[index]) {
        //self.isSnappingToSection = true;
        scrollTop = parseInt(self.sectionStackedPositions[index]);
        self.animateSnapToSectionPosition(scrollTop, $targetSection);
      } else {
        if ($targetSection.length !== 0) {
          //self.isSnappingToSection = true;
          scrollTop = parseInt($targetSection.attr("data-section-index")) === 0 ? 0 : $targetSection.offset().top;
          self.animateSnapToSectionPosition(scrollTop, $targetSection);
        }
      }
    },

    /**
     * snapToNextSection
     * Snaps to the next section
     */
    snapToNextSection: function() {
      var self = this,
        sections = $("section.content section"),
        $closestSection = this.getClosestSectionToWindowScrollCenter(),
        closestSectionIndex = parseInt($closestSection.attr("data-section-index")),
        nextSectionIndex = closestSectionIndex + 1,
        $targetSection = $("section.content section[data-section-index='" + nextSectionIndex + "']");
      // If the section does not exist the user is trying to scroll past the last section
      // So we scroll them to the bottom of the last section
      // @todo: There is a potential issue here where the content under the last section (i.e; the footer) is higher than the $(window).height()
      // At time of writing this is not an issue as only the footer is below the last section and it fits within the lowest supported browser height
      if ($targetSection.length === 0) {
        //self.isSnappingToSection = true;
        var scrollTop = $closestSection.offset().top + $closestSection.outerHeight();
        self.animateSnapToSectionPosition(scrollTop, null);
      }
      // Otherwise, scroll to next section
      else {
        this.snapToSectionByIndex(nextSectionIndex, $targetSection);
      }
    },

    /**
     * snapToPreviousSection
     * Snaps to the previous section
     */
    snapToPreviousSection: function() {
      var self = this;
      var sections = $("section.content section"),
        $closestSection = this.getClosestSectionToWindowScrollCenter(),
        closestSectionIndex = parseInt($closestSection.attr("data-section-index"));
      var previousSectionIndex = closestSectionIndex - 1;
      // Handle the case when the user has scrolled past the last section and is at the bottom of the page
      // @todo: See above, potential issue as applies here also
      if ($(window).scrollTop() >= $(document).height() - self.windowUtil.getWindowHeight()) {
        previousSectionIndex = parseInt($("section.content section").length) - 1;
      }
      if (isNaN(previousSectionIndex))
        return;
      this.snapToSectionByIndex(previousSectionIndex);
    }
  };

  /**
   * init
   * Initiates the fuel your senses application
   */
  var init = function() {
    fuelYourSensesApplication.init();
  };

  // Interface
  return {
    init: init
  };
}(jQuery);

// Events
Tribal.FuelYourSenses.ApplicationEvent = {
  ON_ANIMATE_TO_SECTION: "application.onAnimateToSection"
};

jQuery(document).ready(function() {
  Tribal.FuelYourSenses.init();
});
