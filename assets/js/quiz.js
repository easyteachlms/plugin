var lmsQuiz = {
	type: 'course',
	current: null,
	answers: {},
	running: false,
	passState: false,
	init : function() {
		if ( jQuery('#js-quiz-form').length ) {
			jQuery('#js-quiz-form .ui.radio.checkbox').checkbox();
			if ( 'true' == jQuery('#js-quiz-form').attr('is-module-quiz') ) {
				lmsQuiz.type = 'module';
			}
			lmsQuiz.handler();
		}
	},
	compileAnswers : function() {
		lmsQuiz.answers = {};
		jQuery('#js-quiz-form .ui.radio.checkbox.checked').each(function(index){
			var answer = jQuery(this).find('input').val();
			lmsQuiz.answers[index] = answer;
		});
		return lmsQuiz.answers
	},
	handler : function() {
		jQuery('#js-quiz-form .ui.button').click(function(){
			if ( lmsQuiz.running === false ) {
				lmsQuiz.running = true;
				jQuery(this).addClass('loading');
				if ( 'module' === lmsQuiz.type ) {
					lmsQuiz.grade.module();
				} else {
					lmsQuiz.grade.course();
				}
			}
		});
	},
	grade : {
		module : function() {
			// TODO: We should probably make this a js promise that waits for all the answers to be compiled before calling to grade it.
			lmsQuiz.compileAnswers();
			jQuery.ajax({
				url: wpUserID.siteURL+'/wp-json/easylms/v3/quiz/grade?' + jQuery.param({
					'course_id': courseOBJ.current.course_id,
					'module_id': courseOBJ.current.module_slug,
					'answers': lmsQuiz.answers,
					'quiz_raw': courseOBJ[courseOBJ.current.module_slug].quiz_raw,
				}),
				type: 'POST',
				beforeSend: function ( xhr ) {
					xhr.setRequestHeader( 'X-WP-Nonce', userData.nonce );
				},
				success: function( data ) {
					console.log('Success');
				}
			})
			.done(function( data, textStatus, jqXHR ) {
				if ( data === true ) {
					console.log('You passed');
					lmsQuiz.passState = 'green';
					jQuery.ajax({
			            url: wpUserID.siteURL+'/wp-json/easylms/v3/user-progress/update?uid='+userData.userID+'&course_id='+courseOBJ.current.course_id+'&module_slug='+courseOBJ.current.module_slug+'&item_slug='+courseOBJ.current.item_slug+'&status=complete',
			            type: 'POST',
			            beforeSend: function ( xhr ) {
			                xhr.setRequestHeader( 'X-WP-Nonce', userData.nonce );
			            },
			        	success: function(data) {
							jQuery.ajax({
					            url: wpUserID.siteURL+'/wp-json/easylms/v3/user-progress/update?uid='+userData.userID+'&course_id='+courseOBJ.current.course_id+'&module_slug='+courseOBJ.current.module_slug+'&item_slug='+courseOBJ.current.item_slug+'&status=module-req-complete',
					            type: 'POST',
					            beforeSend: function ( xhr ) {
					                xhr.setRequestHeader( 'X-WP-Nonce', userData.nonce );
					            },
					        	success: function(data) {
									lmsQuiz.stateChange.passed();
									userData.courseSidebar();
					            }
					        });
			            }
			        });
				} else {
					lmsQuiz.passState = 'red';
					lmsQuiz.stateChange.failed();
				}
				console.log(data);
				lmsQuiz.running = false;
			})
			.fail(function( jqXHR, textStatus, errorThrown ) {
				console.info(textStatus);
				console.error(jqXHR, errorThrown, 'We can not process your quiz at this time, please wait and try again.');
			})
			.always(function( data ) {
				jQuery('#js-quiz-form .ui.button').removeClass('primary loading');
			});
		},
		course : function() {
			lmsQuiz.compileAnswers();
			jQuery.ajax({
				url: wpUserID.siteURL+'/wp-json/easylms/v3/quiz/grade?' + jQuery.param({
					'course_id': courseOBJ.current.course_id,
					'answers': lmsQuiz.answers,
				}),
				type: 'POST',
				beforeSend: function ( xhr ) {
					xhr.setRequestHeader( 'X-WP-Nonce', userData.nonce );
				},
				success: function( data ) {
					console.log('Success');
				}
			})
			.done(function( data, textStatus, jqXHR ) {
				if ( data === true ) {
					console.log('You passed');
					lmsQuiz.passState = 'green';
					lmsQuiz.stateChange.passed();
				} else {
					lmsQuiz.passState = 'red';
					lmsQuiz.stateChange.failed();
				}
				console.log(data);
				lmsQuiz.running = false;
			})
			.fail(function( jqXHR, textStatus, errorThrown ) {
				console.error(jqXHR, errorThrown, 'We can not process your quiz at this time, please wait and try again.');
			})
			.always(function( data ) {
				jQuery('#js-quiz-form .ui.button').removeClass('primary loading');
			});
		},
	},
	stateChange : {
		message : function(state, header, message) {
			if ( state === 'positive' ) {
				var icon = 'check';
			} else {
				var icon = 'exclamation';
			}
			var markup = '<div id="js-quiz-state-message" class="ui icon '+state+' message"><i class="'+icon+' icon"></i><div class="content"><div class="header">'+header+'</div><p>'+message+'</p></div></div>';
			if ( jQuery('#js-quiz-state-message').length ) {
				jQuery('#js-quiz-state-message').remove();
			}
			jQuery(markup).insertAfter('#js-quiz-form');
		},
		passed : function() {
			jQuery('#js-quiz-form .ui.button.red').removeClass('red');
			jQuery('#js-quiz-form .ui.button').addClass('green');
			if ( 'module' === lmsQuiz.type ) {
				lmsQuiz.stateChange.message('positive', 'You passed!', 'Congratulations, you passed the module!');
				jQuery('#js-module-listing-accordion [data-module="'+courseOBJ.current.next_module_slug+'"] .ui.negative.message').remove();
			} else {
				lmsQuiz.stateChange.message('positive', 'You passed!', 'Congratulations, you passed the course!<br><br><a href="#" class="ui button small green">Download your certificate now</a>');
			}
		},
		failed : function() {
			jQuery('#js-quiz-form .ui.button').addClass('red');
			if ( 'module' === lmsQuiz.type ) {
				lmsQuiz.stateChange.message('error', 'You did not pass the module.', 'Unfortunately, you did not pass the module. Try the quiz again and/or rewatch the videos.');
			} else {
				lmsQuiz.stateChange.message('error', 'You did not pass the quiz.', 'Unfortunately, you did not pass the course. Try the quiz again or rewatch the videos.');
			}
		},
	}
}

jQuery(document).ready(function(){
	lmsQuiz.init();
});
