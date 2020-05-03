var reports = {
	userData : {},
	charts : {},
	init : function() {
		jQuery('.js-reveal-module').click(function(){
			jQuery(this).next().slideToggle();
		});
	},
	/**
	 * After is a hook system, you can give it a function name as a string and it will run that function.
	 * @param  {[string]} after [description]
	 * @return {[object]}       [description]
	 */
    getProgress : function( uid = false ) {
		if ( false === uid ) {
			return;
		}
		return new Promise(function(resolve, reject) {
			jQuery.ajax({
	            url: wpUserID.siteURL+'/wp-json/easylms/v3/user-progress/get?uid='+parseInt(uid),
	            type: 'GET',
	            beforeSend: function ( xhr ) {
	                xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
	            },
	        	success: function(data) {
	                console.log(data);
	            }
	        }).done(function(data){
	            reports.userData[uid] = data;
				if(typeof fn === 'function' && false !== fn) {
				    fn();
				}
				setTimeout( function(){ resolve(data); }, 1000);
	        });
		}); // End Promise
    },
	/**
	 * By default this function sets the progress bar wherever its found on page with the progress. If you set to true it will just return the percentage as an integer.
	 * @param  {Boolean} [returnNumber=false] [description]
	 * @return {[type]}                       [description]
	 */
	getCourseProgress : function( courseID = false, obj = false, uid = false ) {
		if ( false === uid ) {
			return false;
		}

		if ( false != obj ) {
			var courseOBJ = obj;
		}

		var totalCount = courseOBJ.total_items;
		var currentlyCompleted = 0;
		for (var moduleSlug in courseOBJ.modules) {
			if ( reports.userData[uid][courseID] ) {
				for (var itemSlug in reports.userData[uid][courseID][moduleSlug]) {
					if ( 'complete' === reports.userData[uid][courseID][moduleSlug][itemSlug] ) {
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
		return percentage;
	},
	pieChart : function() {
		if ( ! jQuery('.chart-passed').length ){
			return;
		}
		jQuery('.chart-passed').each(function(){
			var type = "pie";
			var id = jQuery(this).attr('id');
			var courseID = jQuery(this).attr('data-chart-id');
			var not = jQuery(this).attr('data-not-passed-students');
			var passed = jQuery(this).attr('data-passed-students');
			var ctx = document.getElementById(id).getContext('2d');
			var data = {
				datasets: [{
					data: [not, passed],
					backgroundColor: [
						'#EAEAEA',
						'#21BA45'
					],
				}],
				labels: [
					'Incomplete',
					'Complete'
				]
			}
			reports.charts[courseID+'_completions'] = new Chart(ctx,{
				type: type,
				data: data,
				options: {
					responsive: true
				}
			});
		});
	},
	studentProgress : function() {
		jQuery('div[data-course-id]').each(function() {
			var id = jQuery(this).attr('data-course-id');
			var courseOBJ = '';
			lmsHelpers.getCourseObject(id).then(function(data){
				courseOBJ = data;
			}).then(function(data){
				jQuery('div[data-course-id="'+id+'"] tr[data-student-id]').each(function(){
					var uid = jQuery(this).attr('data-student-id');
					console.log(uid);
					reports.getProgress(uid).then(function(data){
						var percentage = reports.getCourseProgress(id, courseOBJ, uid);
						jQuery('.chart-progress').attr('data-total-progress', percentage);
						jQuery('div[data-course-id="'+id+'"] tr[data-student-id="'+uid+'"] .ui.progress').progress({
							percent: percentage
						});
						//////
						reports.moduleProgress(courseOBJ, reports.userData[uid][id], id, uid);
						/////
					});
				});
			});
		});
	},
	moduleProgress : function(courseOBJ, data, courseID, uid) {
		console.log(courseOBJ);
		for (var moduleKey in data) {
			var markup = '<div data-module="'+moduleKey+'">';
				markup += '<strong>'+courseOBJ.modules[moduleKey]+'</strong>';
				markup += '<ul>';
			if (data.hasOwnProperty(moduleKey)) {
				var moduleData = reports.userData[uid][courseID][moduleKey];
				for (var itemKey in moduleData) {
					if (moduleData.hasOwnProperty(itemKey)) {
						markup += '<li>'+itemKey+' - '+moduleData[itemKey]+'</li>';
					}
				}
			}
				markup += '</ul>';
				markup += '</div>';
			var target = jQuery('div[data-course-id="'+courseID+'"] tr[data-student-id="'+uid+'"]').next().find('.module-progress');
			jQuery(markup).appendTo(target);
		}
	}
}

jQuery(document).ready(function() {
	reports.pieChart();
	reports.studentProgress();
	reports.init();
});
