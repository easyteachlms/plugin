var userData = {
    nonce           : wpApiSettings.nonce,
    userID          : wpUserID.uid,
    currentProgress : null,
	/**
	 * After is a hook system, you can give it a function name as a string and it will run that function.
	 * @param  {[string]} after [description]
	 * @return {[object]}       [description]
	 */
    getProgress : function( after, uid = false ) {
        userData.currentProgress = null;
		if ( after !== null ) {
			var fn = window.userData[after];
		} else {
			var fn = false;
		}
		if ( false === uid ) {
			uid = userData.userID;
		}
		return new Promise(function(resolve, reject) {
			jQuery.ajax({
	            url: wpUserID.siteURL+'/wp-json/easylms/v3/user-progress/get?uid='+parseInt(uid),
	            type: 'GET',
	            beforeSend: function ( xhr ) {
	                xhr.setRequestHeader( 'X-WP-Nonce', userData.nonce );
	            },
	        	success: function(data) {
	                console.log(data);
	            }
	        }).done(function(data){
	            userData.currentProgress = data;
				if(typeof fn === 'function' && false !== fn) {
				    fn();
				}
				setTimeout( function(){ resolve(data); }, 1000);
	        });
		}); // End Promise
    },
	courseSidebar : function(){
		if ( jQuery('#js-module-listing-progress').length ) {
			var id = courseOBJ.current.course_id;
			userData.getProgress().then(function(data){
				var percentage = userData.getCourseProgress(id, courseOBJ);
				jQuery('.ui.progress').progress({
					percent: percentage
				});
			});
		}
	},
	/**
	 * By default this function sets the progress bar wherever its found on page with the progress. If you set to true it will just return the percentage as an integer.
	 * @param  {Boolean} [returnNumber=false] [description]
	 * @return {[type]}                       [description]
	 */
	getCourseProgress : function( courseID = false, obj = false ) {
		if ( ! userData.currentProgress ) {
			return false;
		}

		if ( false != obj ) {
			var courseOBJ = obj;
		}

		var totalCount = courseOBJ.total_items;
		var currentlyCompleted = 0;
		for (var moduleSlug in courseOBJ.modules) {
			if ( userData.currentProgress[courseID] ) {
				for (var itemSlug in userData.currentProgress[courseID][moduleSlug]) {
					if ( 'complete' === userData.currentProgress[courseID][moduleSlug][itemSlug] ) {
						currentlyCompleted++;
					}
				}
			} else {
				return;
			}
		}

		console.log(totalCount);
		console.log(currentlyCompleted);

		var percentage = currentlyCompleted / totalCount;
		percentage = percentage * 100;

		if ( courseOBJ.current && 100 == percentage ) {
			userData.recordModuleComplete();
		}
		return percentage;
	},
	cardsProgress: {
		data: {},
		init: function() {
			if ( jQuery('.easylms-my-courses-list').length ) {

				jQuery('.easylms-my-courses-list .card').each(function(index){
					jQuery('<div class="ui active dimmer"><div class="ui loader"></div></div>').prependTo(this);
				});

				userData.getProgress().then(function(){

					jQuery('.easylms-my-courses-list .card, .easylms-my-courses-list .item').each(function(index){
						index++;
						var id = jQuery(this).attr('data-course-id');
						lmsHelpers.getCourseObject(id).then(function(data){
							userData.cardsProgress.data[index] = data;
							var percentage = userData.getCourseProgress(id, data);
							console.log(percentage);
							jQuery('[data-course-id="'+id+'"] .ui.progress').progress({
								percent: percentage
							});
							jQuery('[data-course-id="'+id+'"] .ui.active.dimmer').remove();
						});
					});

				});
			}
		},
	},
	/**
	 * [description]
	 * @param  {[type]} courseSlug [description]
	 * @param  {[type]} itemSlug   [description]
	 * @param  {[type]} status     [description]
	 * @return {[type]}            [description]
	 */
    recordProgress : function(status) {
        jQuery.ajax({
            url: wpUserID.siteURL+'/wp-json/easylms/v3/user-progress/update?uid='+userData.userID+'&course_id='+courseOBJ.current.course_id+'&module_slug='+courseOBJ.current.module_slug+'&item_slug='+courseOBJ.current.item_slug+'&status='+status,
            type: 'POST',
            beforeSend: function ( xhr ) {
                xhr.setRequestHeader( 'X-WP-Nonce', userData.nonce );
            },
        	success: function(data) {
				console.log(status);
        		console.log(data);
            }
        });
    },
    recordWatched : function() {
		console.log('Recording Watched - ' + courseOBJ.current.item_slug);
        userData.recordProgress('watched');
	},
	recordModuleComplete : function() {
		console.log("Recording module complete");
		userData.recordProgress('module-req-complete');
		jQuery('#js-module-listing-accordion [data-module="'+courseOBJ.current.next_module_slug+'"] .ui.negative.message').transition('scale');
	},
    recordComplete : function() {
		console.log('Recording Completion - ' + courseOBJ.current.item_slug);
		console.log(courseOBJ.current.course_id);
        console.log(courseOBJ.current.module_slug);
        console.log(courseOBJ.current.item_slug);
        console.log(userData.userID);
        console.log(userData.nonce);
        userData.recordProgress('complete');
    },
	/////////
	enrollInCourse : function(courseID) {
		jQuery.ajax({
            url: wpUserID.siteURL+'/wp-json/easylms/v3/course/enroll?uid='+userData.userID+'&course_id='+courseID,
            type: 'POST',
            beforeSend: function ( xhr ) {
                xhr.setRequestHeader( 'X-WP-Nonce', userData.nonce );
            },
        	success: function(data) {
        		console.log(data);
            }
        });
	},
	unEnrollInCourse : function(courseID) {
		jQuery.ajax({
            url: wpUserID.siteURL+'/wp-json/easylms/v3/course/unenroll?uid='+userData.userID+'&course_id='+courseID,
            type: 'POST',
            beforeSend: function ( xhr ) {
                xhr.setRequestHeader( 'X-WP-Nonce', userData.nonce );
            },
        	success: function(data) {
        		console.log(data);
            }
        });
	},
	enrollLinkHandler : function() {
		// Enroll in a course.
		jQuery('[data-enroll-in-course]').click( function(e) {
			e.preventDefault();
			var id = jQuery(this).attr('data-enroll-in-course');
			userData.enrollInCourse(id);
			jQuery('#course-' + id).addClass('user-is-enrolled');
			jQuery(this).find('.icon').removeClass('plus').addClass('check green');
			jQuery(this).find('span').text('Enrolled');
			jQuery(this).removeAttr('data-enroll-in-course');
			jQuery(this).attr('data-enrolled-in-course', id);
			setTimeout(function(){location.reload(); }, 500);
			return false;
		} );

		// Hover for remove (un-enroll) state.
		jQuery( '[data-enrolled-in-course]' ).hover(function() {
			var id = jQuery(this).attr('data-enrolled-in-course');
			jQuery('[data-enrolled-in-course="'+id+'"] .icon').removeClass('check green').addClass('minus red');
		},function() {
			var id = jQuery(this).attr('data-enrolled-in-course');
			jQuery('[data-enrolled-in-course="'+id+'"] .icon').removeClass('minus red').addClass('check green');
		});

		// Un-enroll in a course
		jQuery('[data-enrolled-in-course]').click( function(e) {
			e.preventDefault();
			var id = jQuery(this).attr('data-enrolled-in-course');
			userData.unEnrollInCourse(id);
			jQuery('#course-' + id).removeClass('user-is-enrolled');
			jQuery('[data-enrolled-in-course="'+id+'"] .icon').removeClass('minus red').addClass('plus');
			jQuery(this).find('span').text(' Enroll');
			jQuery(this).removeAttr('data-enrolled-in-course');
			jQuery(this).attr('data-enroll-in-course', id);
			setTimeout(function(){location.reload(); }, 500);
			return false;
		} );
	},
	noteStatusLog: function() {
		if ( jQuery('#js-item-note').length ) {
			userData.recordComplete();
		}
	}
}

jQuery(document).ready(function() {
	userData.enrollLinkHandler();
	userData.cardsProgress.init();
	userData.courseSidebar();
	userData.noteStatusLog();
});
