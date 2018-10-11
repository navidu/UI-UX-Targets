/**
 * Created by navidu on 10/11/18.
 */
var gulp = require('gulp');
var sass = require('gulp-sass'); //requires the gulp-sass plugin
var runSequence = require('run-sequence');

gulp.task('hello', function(){
    console.log('Hello Navidu');
});

//for css
gulp.task('scss', function(){
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'))
        //.pipe(browserSync.reload({
        //    stream:true
        //}))
});

//watch function for the changes
gulp.task('watch', function(){
    gulp.watch('src/scss/**/*.scss', ['scss']);
});

//gulp
//gulp.task('default', function (callback) {
//    runSequence(['watch'],
//        callback
//    );
//});