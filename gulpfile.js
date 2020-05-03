var gulp    = require('gulp'),
    less    = require('gulp-less'),
    lessMap = require('gulp-less-sourcemap'),
    path    = require('path'),
    rename  = require('gulp-rename'),
    sync    = require('browser-sync').create(),
    cssmin  = require('gulp-cssmin');

/* Task to compile less */
gulp.task('compile-less', function () {
    gulp.src('./assets/css/less/easylms.less')
        .pipe(less({
            sourceMap: {
                sourceMapRootpath: './assets/css/less'
            }
        }))
        .pipe(gulp.dest('./'));
});

/* Task to watch less changes */
gulp.task('watch-less', function() {
    gulp.watch('./assets/css/less/**/*.less' , ['compile-less']);
});

gulp.task('minify-css', function() {
    gulp.src('easylms.css')
        .pipe( cssmin() )
        .pipe( rename({suffix: '.min'} ))
        .pipe( gulp.dest('assets/css/') );
});

/* https://browsersync.io/docs/gulp */
gulp.task('browser-sync', function() {
    sync.init({
        proxy: "easylms.local"
    });
});

/* Task when running `gulp` from terminal */
gulp.task('default', ['compile-less', 'watch-less']);
gulp.task('build', ['compile-less', 'minify-css']);
gulp.task('serve', ['compile-less', 'browser-sync', 'watch-less']);
