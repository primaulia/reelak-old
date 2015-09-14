Tribal.FuelYourSenses.utils = {};

(function($) {
	/***************************************************
	 * debugUtil
	 * Debug utility
	 **************************************************/

	Tribal.FuelYourSenses.utils.debugUtil = function(debugLevel) {
		var debugUtil = {
			log: function() {
				if (debugLevel > 0 && window['console'] && typeof window['console'].log == "function") {
					console.log.apply(console, arguments);
				}
			}
		};
		return debugUtil;
	};

	/***************************************************
	 * viewModeUtil
	 * View mode utility
	 **************************************************/

	Tribal.FuelYourSenses.utils.viewModeUtil = function() {
		var viewModeUtil = {
			getCurrentViewMode: function() {
				return $(".view-mode:visible").attr("data-view-mode");
			}
		};
		return viewModeUtil;
	};

	/***************************************************
	 * osUtil
	 * Operatng system utility
	 **************************************************/

	Tribal.FuelYourSenses.utils.osUtil = function() {
		var osUtil = {
			isAndroid: function() {
	        	return /Android/i.test(navigator.userAgent);
		    },

		    isBlackBerry: function() {
		        return /BlackBerry/i.test(navigator.userAgent);
		    },

		    isiOS: function() {
		        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
		    },

		    isWindows: function() {
		        return /IEMobile/i.test(navigator.userAgent);
		    },

		    isMobile: function() {
		        return (this.isAndroid() || this.isBlackBerry() || this.isiOS() || this.isWindows());
		    }
		};
		return osUtil;
	};

	/***************************************************
	 * windowUtil
	 * Window utility
	 **************************************************/

	Tribal.FuelYourSenses.utils.windowUtil = function() {
		var windowUtil = {
			getWindowHeight: function() {
				var osUtil = new Tribal.FuelYourSenses.utils.osUtil();
				return osUtil.isiOS() ? window.innerHeight : $(window).height();
		    }
		};
		return windowUtil;
	};
})(jQuery);
