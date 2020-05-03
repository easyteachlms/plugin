var lmsPlayer = {
    videos: [],
    active: false,
	autoNext: true,
    init: {
        single: function(ID) {
            lmsPlayer.videos.push(ID);
            lmsPlayer.videos[ID] = {
                duration: '',
				player: jQuery('#'+ID).mediaelementplayer({
					classPrefix: 'mejs-',
					success: function(mediaElement, originalNode, instance) {
						mediaElement.addEventListener('loadedmetadata', function( e ) {
							lmsHelpers.resizePlayer();
                            lmsPlayer.videos[ID].duration = e.detail.target.getDuration();
                        }, false);
                        mediaElement.addEventListener( 'playing', function( e ) {
                            console.info('Video Playing');
							console.info('Duration:' + lmsPlayer.videos[ID].duration );

                            lmsPlayer.active = true;
							userData.recordWatched();

							// Load next video when video reaches last 30 seconds of play time:
                            var t = setInterval(function(){
                                var timecode = e.detail.target.getCurrentTime();
                                var target = ( e.detail.target.getDuration() - 30 );
                                if ( timecode >= target && lmsPlayer.active == true && lmsPlayer.autoNext == true ) {
                                    lmsPlayer.active = false;
                                    jQuery('.ui.right.button').addClass('loading');
                                    console.log('Marking Video As Complete!');
                                    userData.recordComplete();
                                    // Init the next player in an object and add it to the videos array.
                                    // lmsPlayer.videos[newVideoID] = new MediaElementPlayer etc...
                                    clearInterval(t);
                                }
                            }, 1000);
                        }, false);
                        mediaElement.addEventListener( 'pause', function( e ) {
                            console.info( 'Video Paused' );
                            lmsPlayer.active = false;
                        }, false);
                        mediaElement.addEventListener( 'canplay', function( e ) {
                            console.info( 'Video Loaded' );
                            e.detail.target.play();
                        }, false);
                        mediaElement.addEventListener( 'ended', function( e ) {
                            console.info( 'Video Ended' );
                            clearInterval(lmsPlayer.active);

                            // Check user status one last time so we can do a module completion check.
                            userData.getProgress();
                            userData.getCourseProgress( courseOBJ.current.course_id, courseOBJ );

							if ( ( courseOBJ.current.next_item !== false && courseOBJ.current.next_item !== null ) && lmsPlayer.autoNext == true ) {
								jQuery('.ui.right.button').removeClass('loading');
	                            jQuery('.ui.right.button').addClass('positive');
	                            window.location = courseOBJ.current.next_item;
							}
                        }, false);
					}
				}),
            }
        },
        all: function() {
            jQuery('.load-video-init').each(function(){
                var id = jQuery(this).attr('id');
                lmsPlayer.init.single(id);
            });
        }
    },
    remove: function(ID) {
        var index = lmsPlayer.videos.indexOf(ID);
        if (index > -1) {
            lmsPlayer.videos[ID].player.remove();
            lmsPlayer.videos.splice(index, 1);
        }
    }
}

jQuery(document).ready(function() {
    lmsPlayer.init.all();
});
