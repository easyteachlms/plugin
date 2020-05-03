var themeCompat = {
	init: function() {
		themeCompat.wpCharming.init();
	},
	wpCharming: {
		mobilePX: 789,
		mobile: false,
		init: function() {
			var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
			console.log(w);
			if ( w <= themeCompat.wpCharming.mobilePX ) {
				themeCompat.wpCharming.mobile = true;
			}
			themeCompat.wpCharming.moveCourseWidget();
			jQuery( window ).resize(function() {
				var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
				if ( w <= themeCompat.wpCharming.mobilePX ) {
					themeCompat.wpCharming.mobile = true;
				} else {
					themeCompat.wpCharming.mobile = false;
				}
				themeCompat.wpCharming.moveCourseWidget();
			});
		},
		moveCourseWidget: function() {
			if ( jQuery('body.theme-construction').length && jQuery('body.single-course').length && jQuery('#secondary > .widget_coursenavigation_widget').length && true == themeCompat.wpCharming.mobile ) {
				jQuery('#secondary > .widget_coursenavigation_widget').insertBefore('table.ui.celled.striped.unstackable.table');
			}
			if ( jQuery('body.theme-construction').length && jQuery('body.single-course').length && jQuery('#primary  .widget_coursenavigation_widget').length && false == themeCompat.wpCharming.mobile ) {
				jQuery('#primary .widget_coursenavigation_widget').appendTo('#secondary');
			}
		}
	}
}

jQuery(document).ready(function(){
	themeCompat.init();
});
