;
/* ========================================================================
 * Bootstrap: modal.js v3.3.1
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+ function($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function(element, options) {
    this.options = options
    this.$body = $(document.body)
    this.$element = $(element)
    this.$backdrop =
      this.isShown = null
    this.scrollbarWidth = 0

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function() {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION = '3.3.1'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function(_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function(_relatedTarget) {
    var that = this
    var e = $.Event('show.bs.modal', {
      relatedTarget: _relatedTarget
    })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function() {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (that.options.backdrop) that.adjustBackdrop()
      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', {
        relatedTarget: _relatedTarget
      })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
        .one('bsTransitionEnd', function() {
          that.$element.trigger('focus').trigger(e)
        })
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function(e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
      .one('bsTransitionEnd', $.proxy(this.hideModal, this))
      .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function() {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function(e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function() {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function(e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function() {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function() {
    var that = this
    this.$element.hide()
    this.backdrop(function() {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function() {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function(callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .prependTo(this.$element)
        .on('click.dismiss.bs.modal', $.proxy(function(e) {
          if (e.target !== e.currentTarget) return
          this.options.backdrop == 'static' ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this)
        }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
        .one('bsTransitionEnd', callback)
        .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function() {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
        .one('bsTransitionEnd', callbackRemove)
        .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function() {
    if (this.options.backdrop) this.adjustBackdrop()
    this.adjustDialog()
  }

  Modal.prototype.adjustBackdrop = function() {
    this.$backdrop
      .css('height', 0)
      .css('height', this.$element[0].scrollHeight)
  }

  Modal.prototype.adjustDialog = function() {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function() {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function() {
    this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function() {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function() {
    this.$body.css('padding-right', '')
  }

  Modal.prototype.measureScrollbar = function() { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function() {
      var $this = $(this)
      var data = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function() {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function(e) {
    var $this = $(this)
    var href = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option = $target.data('bs.modal') ? 'toggle' : $.extend({
      remote: !/#/.test(href) && href
    }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function(showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function() {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

;
var Tribal = window.Tribal || {};

/**
 * [Utils description]
 * @class Utils
 */
Tribal.Utils = function($) {

  /**
   * [extend description]
   * @public
   * @param  {Object} options - options that do things
   * @param  {[type]} config  [description]
   * @return {[type]}         [description]
   */
  var extend = function(options, config) {
    if (typeof options !== "undefined") {
      for (var prop in options) {
        if (options.hasOwnProperty(prop)) {
          config[prop] = options[prop];
        }
      }
    }
    return config;
  };

  var hex2rgb = function(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  return {
    extend: extend,
    hex2rgb: hex2rgb
  };
}(jQuery.noConflict());;
var Tribal = window.Tribal || {};

Tribal.SearchBox = function($) {
  var config = {
    searchOpen: '.js-search-box-top',
    pageId: "",
    fadeSpeed: 250
  };
  // Public..................................................................
  var init = function(page, options) {

    config.page = page;

    config = Tribal.Utils.extend(options, config);

    config.searchOpen = $(config.searchOpen);

    listeners.searchClickOpen();

    listeners.searchClickClose();

  };
  // Private.................................................................

  var listeners = {

    searchClickOpen: function() {

      config.searchOpen.on('click', function(e) {
        e.preventDefault();

        $(this).fadeOut(config.fadeSpeed, function() {
          $(config.searchBox).fadeIn(config.fadeSpeed);
        });
      });

    },

    searchClickClose: function() {}
  }

  // Interface...............................................................
  return {
    init: init
  };

}(jQuery.noConflict());;
var Tribal = window.Tribal || {};

Tribal.SideNav = function($) {
  var config = {
    targetEl: '#site-wrapper',
    triggerEls: '#hamburger, #mobile-nav-back-btn',
    showClass: 'show-side-nav',
    outClass: 'out',
    transEndEventNames: {
      'WebkitTransition': 'webkitTransitionEnd', // Saf 6, Android Browser
      'MozTransition': 'transitionend', // only for FF < 15
      'transition': 'transitionend' // IE10, Opera, Chrome, FF 15+, Saf 7+
    },
    _openState: false,
    _animationEndEvents: [Modernizr.prefixed('transition')]
  };
  // Public..................................................................
  var init = function(options) {

    config = Tribal.Utils.extend(options, config);

    config.targetEl = $(config.targetEl);

    config.triggerEls = $(config.triggerEls);

    config._openState = false;

    // if (config.targetEl.length !== 1) return console.error('SideNav targetEl expected to be a length of 1 in init');
    //
    // if (config.triggerEls.length < 1) return console.error('SideNav triggerEls expected to be a length of at least 1 in init');

    listeners.navAnimateEnd();

    listeners.navClick();

  };

  var toggleNav = function() {

    if (!config._opened) {

      openNav();

    } else {

      closeNav();

    }

  };

  var openNav = function() {

    if (config._openState) return closeNav();

    config._openState = true;

    config.targetEl.addClass(config.showClass);

    $(".dropdown-overlay").removeClass('activated');

    /* Seems delay is required for CSS to respond to showClass positioning above
    in order to animate */
    setTimeout(function() {

      config.targetEl.addClass(config.outClass);

    }, 10);

  };

  var closeNav = function() {

    if (!config._openState) return openNav();

    config._openState = false;

    config.targetEl.removeClass(config.outClass);

  };

  // Private.................................................................
  var closeNavComplete = function() {
    if (config.targetEl.hasClass(config.showClass)) {
      config.targetEl.removeClass(config.showClass);
    }
  };

  var listeners = {

    navClick: function() {

      config.triggerEls.on('click', function(e) {

        e.preventDefault();

        toggleNav();

      });

    },

    navAnimateEnd: function() {

      //Modernizr will return us the correct transition to use for this browser
      var eventStr = config.transEndEventNames[Modernizr.prefixed('transition')];

      //If Modernizr gave us an event str
      if (eventStr) {

        //Lets attach a listener to the target element to find out when the transition is over
        config.targetEl.on(eventStr, function(e) {

          //ROCKY TODO: THIS MIGHT BE FIRING TWICE...FIND OUT WHY
          if (!config._openState) closeNavComplete();

        });

      } else {

        //If there is no transitionend event support then go ahead and fire immediately
        closeNavComplete();

      }
    }

  };

  //mobile navigation handler.

  $(".navslide__trigger").click(function() {

    if (config.targetEl.hasClass('show-side-nav')) {
      var slider_name = $(this).data("slide");

      if (slider_name === 'closeme') {
        var parent_id = $(this).closest("ul").attr("id");
        $("#" + parent_id).css('right', -320);
      } else {
        $("#" + slider_name).css('right', 0);
      }
    }
  });

  //change the down arrow into a right arrow for nav items with no dropdown
  $("li.right-chevron i.fa.fa-chevron-down").addClass('rotateChevron');

  //disable overlay if clicked outside of the navigation
  $(".local-nav").click(function(e) {
    if ($(e.target).hasClass('col-md-10')) {
      $(".dropdown-overlay").removeClass('activated');
    }
  });

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  //adds / removes an overlay when you click on a menu item
  $('li.dropdown').click(function() {

    var $this = $(this),
      $parent = getParent($this),
      isActive = $this.hasClass('open') || $this.hasClass('right-chevron'), //items with this class don't have a dropdown
      aria = $(this).find('a.tw-table').attr('aria-expanded');
    if (aria !== true) {
      $(".dropdown-overlay").removeClass('activated');
    }

    if (!isActive && !$("#site-wrapper").hasClass('show-side-nav')) {
      $(".dropdown-overlay").addClass('activated');
      $('.dropdown-overlay.activated, .global-nav').on('click', function() {
        $(".dropdown-overlay").removeClass('activated');
      });
    }
  });


  // Interface...............................................................
  return {

    init: init,
    openNav: open,
    closeNav: close,
    toggleNav: toggleNav

  };

}(jQuery.noConflict());;
var Tribal = window.Tribal || {};

Tribal.Toggle = function($) {
  var config = {
    triggersAttr: 'data-tw-toggle',
    toggleClassAttr: 'data-tw-toggle-class',
    toggleClass: 'open',
    _$triggers: null,
    _cacheElRef: 'triggerel',
    _cacheClassRef: 'toggleclass',
    _lastOpened: null
  };
  // Public..................................................................
  var init = function(options) {

    config = Tribal.Utils.extend(options, config);

    config._$triggers = $('[' + config.triggersAttr + ']');

    if (config._$triggers.length > 0) {

      cacheData();

      listeners.triggerClick();

    }


  };
  // Private.................................................................

  var listeners = {

    triggerClick: function() {

      config._$triggers.on('click', function(e) {

        e.preventDefault();

        var $this = $(this);

        var $target = $this.data(config._cacheElRef);

        var toggleClass = $this.data(config._cacheClassRef) || config.toggleClass;

        if ($target.hasClass(toggleClass)) $target.removeClass(toggleClass);

        else $target.addClass(toggleClass);

      });

    }

  }

  var cacheData = function() {

    $.each(config._$triggers, function() {

      var $this = $(this);

      var target = $this.attr(config.triggersAttr);

      if (!target) return;

      var targets = $this.parents(target);

      var $target = $(targets[0]);

      var toggleClass = $this.attr(config.toggleClassAttr) || null;

      //Grab the first matching parent target and cache it on the trigger el
      $this.data(config._cacheElRef, $target);

      if (toggleClass)
        $this.data(config._cacheClassRef, toggleClass)

    });

  }

  // Interface...............................................................
  return {
    init: init
  };

}(jQuery.noConflict());;
var Tribal = window.Tribal || {};
// tracking
Tribal.Tracking = function() {

  var $;

  var init = function($jQuery) {
    $ = $jQuery;

    var code = getGATrackingIdForCurrentISO();
    ga('create', code.id, code.url);
    ga('require', 'linkid', 'linkid.js', 'displayfeatures');
    ga('send', 'pageview');
    //console.log("init Tracking", code, "GA object:", ga);
  }

  var trackEvent = function() {
    /*
        ga('send', {
          'hitType': 'event',          // Required.
          'eventCategory': 'button',   // Required.
          'eventAction': 'click',      // Required.
          'eventLabel': 'nav buttons',
          'eventValue': 4 // value is a number


        Value 	    Type 	    Required 	Description
        Category 	String 	    Yes 	    Typically the object that was interacted with (e.g. button)
        Action 	    String 	    Yes 	    The type of interaction (e.g. click)
        Label 	    String 	    No 	        Useful for categorizing events (e.g. nav buttons)
        Value 	    Number 	    No 	        Values must be non-negative. Useful to pass counts (e.g. 4 times)


        });
    */
  }

  var getGATrackingIdForCurrentISO = function() {

    var iso = Tribal.Main.getISO();
    var code = {};
    switch (iso) {
      case "HK":
        code = {
          url: "esso.com.hk"
        }
        break;
      case "SG":
        code = {
          url: "esso.com.sg"
        }
        break;
      case "NZ":
        code = {
          url: "fuels.mobil.co.nz"
        }
        break;
      default:
        code = {
          url: "esso.com.hk"
        }
    }

    code.id = $("body").data("ga-key");
    return code;

  };


  // Interface...
  return {
    init: init,
    trackEvent: trackEvent
  };
}();;
var Tribal = window.Tribal || {};

Tribal.VideoPlayer = function($) {

  return function(options) {
    var videoPlayer = this;
    var config = Tribal.Utils.extend(options || {}, {
      elID: '#video-player',
      playerVars: {
        origin: window.location.origin,
        rel: 0,
        modestbranding: 1,
        showinfo: 0,
        ccloadpolicy: 0
      },
      _$el: null,
      _$playerEl: null,
      _seekLinks: [],
      _seekToAttr: 'data-seek-to',
      _seekTargetAttr: 'data-target-video-id',
      _playerData: {
        id: '',
        videoId: ''
      },
      _playerReady: false

    })

    //Private
    var init = function() {

      config._$el = $(config.elID);
      if (config._$el.length !== 1) return console.error('config._$el invalid in VideoPlayer');
      extractPlayerData();
      config._seekLinks = $('[' + config._seekTargetAttr + '=' + config._playerData.videoId + ']');
      listeners.onYouTubeIframeAPIReady();
      listeners.onPlayerReady();
      listeners.onPlayerStateChange();
      if (config._seekLinks.length > 0) {
        listeners.onSeekLinkClick();
      }
      loadAPI();
    };

    var extractPlayerData = function() {
      config._playerData.id = config._$el.attr('id');
      config._playerData.videoId = config._$el.attr('data-video-id');
    };

    var getSeekLinks = function() {
      var matched = [];
      $.each($('[' + config._seekLinksAttr + ']'), function() {
        if ($(this).attr(config._seekTargetAttr) === config.playerData.videoId) {
          matched.push($(this));
        }
      });

      return matched;
    };

    var listeners = {

      onYouTubeIframeAPIReady: function() {
        $(window).on('onYouTubeIframeAPIReady', function(e, data) {
          config.player = new YT.Player(config._playerData.id, {
            width: 560,
            height: 315,
            videoId: config._playerData.videoId,
            playerVars: {
              showinfo: config.playerVars.showinfo,
              origin: config.playerVars.origin,
              modestbranding: config.playerVars.modestbranding,
              rel: config.playerVars.rel,
              cc_load_policy: config.playerVars.ccloadpolicy
            },
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
            }
          });

          config._$playerEl = $(config.elID);

        });

      },

      onPlayerReady: function() {
        $(window).on('onPlayerReady', function(e, data) {
          config._playerReady = true;
        });
      },

      onPlayerStateChange: function() {
        $(window).on('onPlayerStateChange', function(e, data) {});
      },

      onSeekLinkClick: function() {
        var _this = this;
        if (config._seekLinks.length > 0) {
          config._seekLinks.each(function() {
            var $this = $(this);
            $this.on('click', function(e) {
              e.preventDefault();
              if (config._playerReady) {
                var seekToTime = $this.attr(config._seekToAttr);
                if (typeof seekToTime === 'string') {
                  seekToTime = parseInt(seekToTime);
                  $('html, body').animate({
                    scrollTop: config._$playerEl.offset().top - 10
                  });
                  videoPlayer.seekTo(seekToTime);
                }
              }
            })
          });
        }
      }
    };

    var loadAPI = function() {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    };
    //Public

    this.seekTo = function(seekTime) {
      if (!config._playerReady) return false;
      if (typeof seekTime !== 'number') return console.error('seekTime provided to seekTo method in videoPlayer.js is invalid');
      config.player.seekTo(seekTime);
    };

    //Go
    init();

  }

}(jQuery.noConflict());


function onYouTubeIframeAPIReady() {
  jQuery(window).trigger('onYouTubeIframeAPIReady');
};

function onPlayerReady(event) {
  jQuery(window).trigger('onPlayerReady', {
    e: event
  });
};

function onPlayerStateChange(event) {
  jQuery(window).trigger('onPlayerStateChange', {
    e: event
  });
};




;
var Tribal = window.Tribal || {};

Tribal.Detect = function($) {

  var config = {
    agent: ""
  };

  var init = function() {
    config.agent = navigator.userAgent.toLowerCase();
  };

  var ios = function() {
    return Tribal.Detect.ipad() || Tribal.Detect.ipod() || Tribal.Detect.iphone();
  };

  var ipad = function() {
    return config.agent.match(/iPad/i) != null;
  };

  var ipod = function() {
    return config.agent.match(/iPod/i) != null;
  };

  var iphone = function() {
    return config.agent.match(/iPhone/i) != null;
  };

  var android = function() {
    return config.agent.match(/android/i) != null;
  };

  return {
    init: init,
    ios: ios,
    ipod: ipod,
    ipad: ipad,
    iphone: iphone,
    android: android
  };

}(jQuery.noConflict());;
var Tribal = window.Tribal || {};

Tribal.Main = function($) {
  var config = {
    pageId: "",
    noToggleItems: '.no-toggle, .dropdown-menu', //Elements that will not trigger bootstrap dropdown toggle when clicked
    jsFormSubmitEls: '.js-submit',
    videoEls: '.video-player',
    videoRootId: 'video-player'
  };
  // Public..................................................................
  var init = function(page, options) {

    config.page = page;

    config = Tribal.Utils.extend(options, config);

    setOrigin();

    normalizeEls();

    setListeners();

    Tribal.SideNav.init();

    Tribal.mobileSearchToggle = new Tribal.Toggle.init({
      target: '#mobile-nav-container',
      triggers: '#mobile-search-toggle'
    });

    // console.log("init stationloc")


    Tribal.videoPlayers = [];

    //Instantiate video players - go through each video and apply an id and create a video player object
    $.each($(config.videoEls), function(i) {

      var $this = $(this);

      //Set the id of the video player with a unique id (youtube needs this)
      var id = config.videoRootId + '-' + i;

      $this.attr('id', id);

      //Instantiate player
      Tribal.videoPlayers.push(new Tribal.VideoPlayer({
        elID: '#' + id
      }))

    });

    extendBootstrapCollapse();

    /* Cookie notice */
    var $cookieNotice = $("aside.cookies");
    // should this site display cookie notice?
    // case 1. no_cookies
    // dont' display the aside and start tracking now
    var showNotice = false;
    var startTracking = true;
    if ($cookieNotice.hasClass("dismiss_cookies")) {
      // case 2. dismiss_cookies
      // display the asside and start tracking now
      showNotice = true;
      console.log("Show cookie notice, has cookie been set previousely?", document.cookie.match(/cookie=/));
    } else if ($cookieNotice.hasClass("confirm_cookies")) {
      // case 3. confirm_cookies
      // display the asside, dont track until checked
      showNotice = true;
      startTracking = false;
      console.log("Show cookie notice with checkbox, has cookie been set previousely?", document.cookie.match(/cookie=/));
    }

    if (showNotice) {

      if (!document.cookie.match(/cookie=/)) { // show notice
        $cookieNotice.removeClass("hide");
        if (!startTracking) {
          $("label", $cookieNotice).removeClass("hide");
        }
        $(".in", $cookieNotice).click(function() {
          if (startTracking) {
            document.cookie = "cookie=1;path=/;expires=" + (new Date((+new Date) + (86400 * 365 * 1000))).toGMTString();
            $cookieNotice.slideUp();
          } else {
            var $checkbox = $("input", $cookieNotice);
            if ($checkbox.length == 0 || $checkbox[0].checked) {
              document.cookie = "cookie=1;path=/;expires=" + (new Date((+new Date) + (86400 * 365 * 1000))).toGMTString();
              $cookieNotice.slideUp();
              if (!config.startedTracking) {
                initTracking();
              }
            } else if ($checkbox.length == 1) {
              $("p.error", $cookieNotice).removeClass("hide");
            }
          }
        });
      } else {
        initTracking();
      }
    }

    if (startTracking) {
      initTracking();
    }




  };

  // Private.................................................................

  var extendBootstrapCollapse = function() {
    var oriShow = $.fn.collapse.Constructor.prototype.show;
    $.fn.collapse.Constructor.prototype.show = function() {
      oriShow.call(this);
      this.$element.parent().addClass('in');
    }
    var oriHide = $.fn.collapse.Constructor.prototype.hide;
    $.fn.collapse.Constructor.prototype.hide = function() {
      oriHide.call(this);
      this.$element.parent().removeClass('in');
    }
  }

  var initTracking = function() {
    if (!config.startedTracking) {
      Tribal.Tracking.init($);
    }
    config.startedTracking = true;
  }

  var setOrigin = function() {

    if (!window.location.origin) {
      window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }

  }

  var normalizeEls = function() {

    config.noToggleItems = $(config.noToggleItems);

    config.jsFormSubmitEls = $(config.jsFormSubmitEls);

  };

  var setListeners = function() {

    listeners.noToggle();

    listeners.formSubmit();

  };

  var listeners = {

    noToggle: function() {

      config.noToggleItems.on('click', function(e) {

        e.stopPropagation();

      });

    },

    formSubmit: function() {

      config.jsFormSubmitEls.on('click', function(e) {

        e.preventDefault();

        var $form = $(this).parents('form');

        if ($form.length > 0) {

          $form = $($form[0]);

          $form.submit();

        }

      });

    }

  };

  var getContentContainer = function() {
    return $("html .content");
  }

  var getISO = function() {
    //ROCKY TODO: ACTUALLY GRAB THIS DATA
    var isostr = $('html').attr('lang');
    isostr = isostr.split('-')[1];
    return isostr.toUpperCase();

  };



  // Interface...............................................................
  return {
    init: init,
    contentContainer: getContentContainer,
    getISO: getISO

  };

}(jQuery.noConflict());;
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {

  var pluses = /\+/g;

  function encode(s) {
    return config.raw ? s : encodeURIComponent(s);
  }

  function decode(s) {
    return config.raw ? s : decodeURIComponent(s);
  }

  function stringifyCookieValue(value) {
    return encode(config.json ? JSON.stringify(value) : String(value));
  }

  function parseCookieValue(s) {
    if (s.indexOf('"') === 0) {
      // This is a quoted cookie as according to RFC2068, unescape...
      s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }

    try {
      // Replace server-side written pluses with spaces.
      // If we can't decode the cookie, ignore it, it's unusable.
      // If we can't parse the cookie, ignore it, it's unusable.
      s = decodeURIComponent(s.replace(pluses, ' '));
      return config.json ? JSON.parse(s) : s;
    } catch (e) {}
  }

  function read(s, converter) {
    var value = config.raw ? s : parseCookieValue(s);
    return $.isFunction(converter) ? converter(value) : value;
  }

  var config = $.cookie = function(key, value, options) {

    // Write

    if (value !== undefined && !$.isFunction(value)) {
      options = $.extend({}, config.defaults, options);

      if (typeof options.expires === 'number') {
        var days = options.expires,
          t = options.expires = new Date();
        t.setTime(+t + days * 864e+5);
      }

      return (document.cookie = [
        encode(key), '=', stringifyCookieValue(value),
        options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
        options.path ? '; path=' + options.path : '',
        options.domain ? '; domain=' + options.domain : '',
        options.secure ? '; secure' : ''
      ].join(''));
    }

    // Read

    var result = key ? undefined : {};

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all. Also prevents odd result when
    // calling $.cookie().
    var cookies = document.cookie ? document.cookie.split('; ') : [];

    for (var i = 0, l = cookies.length; i < l; i++) {
      var parts = cookies[i].split('=');
      var name = decode(parts.shift());
      var cookie = parts.join('=');

      if (key && key === name) {
        // If second argument (value) is a function it's a converter...
        result = read(cookie, value);
        break;
      }

      // Prevent storing a cookie that we couldn't decode.
      if (!key && (cookie = read(cookie)) !== undefined) {
        result[name] = cookie;
      }
    }

    return result;
  };

  config.defaults = {};

  $.removeCookie = function(key, options) {
    if ($.cookie(key) === undefined) {
      return false;
    }

    // Must not alter options, thus extending a fresh object...
    $.cookie(key, '', $.extend({}, options, {
      expires: -1
    }));
    return !$.cookie(key);
  };

}));;
var Tribal = window.Tribal || {};

Tribal.OldBrowserWarning = function($) {
  var config = {
    oldBrowserClass: 'lt-ie9'
  };

  // Public..................................................................
  var init = function(options) {
    config = Tribal.Utils.extend(options, config);

    checkCookie();
  };

  var deleteCookie = function() {
    $.removeCookie(config.cookieName);
  };

  var foo = function() {};
  // Private.................................................................

  var checkCookie = function() {
    if ($('html').hasClass(config.oldBrowserClass)) {
      if (typeof $.cookie(config.cookieName) == 'undefined') {
        $.cookie(config.cookieName, '1');
        $(config.modal).modal('show');
      }
    }
  };

  var listeners = {};

  // Interface...............................................................
  return {
    init: init,
    deleteCookie: deleteCookie
  };

}(jQuery.noConflict());;
(function($) {
  $(function() {

    Tribal.OldBrowserWarning.init({
      cookieName: 'essoVisit',
      modal: '#ie8Warning'
    });

    Tribal.Main.init();

    Tribal.Detect.init();

    if (Tribal.Detect.ios()) {
      $('.js-btn-android').remove();
      console.log(Tribal.Detect.ios());
    } else if (Tribal.Detect.android()) {
      $('.js-btn-ios').remove();
    }
  });
})(jQuery.noConflict());
