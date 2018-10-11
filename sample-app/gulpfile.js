/**
 * Created by navidu on 10/11/18.
 */
var gulp = require('gulp');
var sass = require('gulp-sass'); //requires the gulp-sass plugin

gulp.task('hello', function(){
    console.log('Hello Navidu');
});

gulp.task('scss', function(){
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'))
        //.pipe(browserSync.reload({
        //    stream:true
        //}))
});