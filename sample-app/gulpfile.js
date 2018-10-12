/**
 * Created by navidu on 10/11/18.
 */
var gulp = require('gulp');
var sass = require('gulp-sass'); //requires the gulp-sass plugin
var runSequence = require('run-sequence'); // need to run all sequence
var del = require('del');//delete dist folder
var browserSync = require('browser-sync').create(); //for the browser sync
var merge = require('merge-stream'); // merge two tasks and return

//sample task
gulp.task('hello', function(){
    console.log('Hello Navidu');
});

////for css
//gulp.task('scss', function(){
//    return gulp.src('src/scss/**/*.scss')
//        .pipe(sass())
//        .pipe(gulp.dest('dist/css'))
//        .pipe(browserSync.reload({
//            stream:true
//        }))
//});
//
////for bootstrap
//gulp.task('getbootstrap', function(){
//    return gulp.src('node_modules/bootstrap/scss/bootstrap.scss')
//        .pipe(sass())
//        .pipe(gulp.dest('dist/css'));
//});

//foe all css
gulp.task('scss', function(){
    //take vendor css
    var vendorStreamCss = gulp.src(['node_modules/bootstrap/scss/bootstrap.scss'])
        .pipe(sass())
        .pipe(gulp.dest('dist/css'));

    //take app css
    var appStreamCss =  gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream:true
        }));

    return merge(vendorStreamCss, appStreamCss);
});

//foe all js
gulp.task('js', function(){
    // Concatenate vendor scripts
    var vendorStreamJs = gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/popper.js/dist/umd/popper.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js'
    ])
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest('dist/js'));

    // Concatenate AND minify app sources
    var appStreamJs = gulp.src(['src/js/*.js'])
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream:true
        }));

    return merge(vendorStreamJs, appStreamJs);
});

//for html
gulp.task('html', function(){
    return gulp.src('src/html/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//watch function for the changes
gulp.task('watch', function(){
    gulp.watch('src/scss/**/*.scss', ['scss']);
    gulp.watch('src/html/*.html', ['html']);
});

//clear the old dist folder
gulp.task('clean:dist', function () {
    return del.sync('dist');
});

//gulp build
gulp.task('build', function(callback){
    runSequence('clean:dist', ['scss', 'html']
    );
});

//for browser sync
gulp.task('browserSync', function(){
    browserSync.init({
        server:{
            baseDir: 'dist'
        }
    })
});

//for run default gulp
gulp.task('default', function (callback) {
    runSequence(['browserSync', 'watch'],
        callback
    );
});