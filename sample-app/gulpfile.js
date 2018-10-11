/**
 * Created by navidu on 10/11/18.
 */
var gulp = require('gulp');
var sass = require('gulp-sass'); //requires the gulp-sass plugin
var runSequence = require('run-sequence');

//sample task
gulp.task('hello', function(){
    console.log('Hello Navidu');
});

//for css
gulp.task('scss', function(){
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'));
        //.pipe(browserSync.reload({
        //    stream:true
        //}))
});

//html
gulp.task('html', function(){
    return gulp.src('src/html/*.html')
        .pipe(gulp.dest('dist'));
        //.pipe(browserSync.reload({
        //    stream: true
        //}));
});

//watch function for the changes
gulp.task('watch', function(){
    gulp.watch('src/scss/**/*.scss', ['scss']);
    gulp.watch('src/html/*.html', ['html']);
});

//for run default gulp
//gulp.task('default', function (callback) {
//    runSequence(['watch'],
//        callback
//    );
//});