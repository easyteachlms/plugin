var lmsHelpers = {
	isResizing : false,
	moduleListingAccordion: function() {
		if ( jQuery('#js-module-listing-accordion').length ) {
			jQuery('#js-module-listing-accordion').accordion();
		}
	},
	moduleListingProgress: function() {
		if ( jQuery('#js-module-listing-progress').length ) {
			jQuery('#js-module-listing-progress').progress();
		}
	},
	getCourseObject: function( courseID ) {
		var courseID = parseInt(courseID);
		return new Promise(function(resolve, reject) {
			if ( courseID ) {
				jQuery.ajax({
					url: wpUserID.siteURL+'/wp-json/easylms/v3/course/get?course_id='+courseID,
					type: 'GET',
					beforeSend: function ( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
					},
					success: function(data) {
						console.log('Success');
					},
					error: function(e) {
						console.log(e);
					}
				}).done(function(data){
					setTimeout( function(){ resolve(data); }, 1000);
				});
			} else {
				console.log("Failed to getCourseObject");
			}
		}); // End Promise
	},
	resizePlayer: function() {
		if ( jQuery('.mejs-container').length ) {
			var ratio = (1080 / 1920);
	        var currentWidth = jQuery('.video-wrap').width();
	        var height = ( ratio * currentWidth );
	        jQuery('.mejs-container, .mejs-overlay-play').css('height', height);
			lmsHelpers.isResizing = false;
		}
    },
	oembedPlayerInit: function() {
		if ( jQuery('.easylms-oembed-player').length ) {
			jQuery('.easylms-oembed-player').each(function(){
				var id = jQuery(this).find('video').attr('id');
				new MediaElementPlayer( id, {
                    success: function (mediaElement, originalNode, instance) {
						mediaElement.addEventListener('loadedmetadata', function( e ) {
							lmsHelpers.resizePlayer();
						}, false);
					},
				});
			});
		}
	},
}

jQuery(document).ready(function() {
	lmsHelpers.moduleListingAccordion();
	lmsHelpers.moduleListingProgress();
	lmsHelpers.oembedPlayerInit();
});

jQuery(window).resize(function() {
	setTimeout(function(){
		lmsHelpers.resizePlayer();
		console.log('Resize');
	}, 350);
});
