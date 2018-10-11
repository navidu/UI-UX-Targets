/**
 * Created by navidu on 10/9/18.
 */

//The require statement tells Node to look into the node_modules folder for a package named gulp. Once the package is found, we assign its contents to the variable gulp.
//
//    We can now begin to write a gulp task with this gulp variable. The basic syntax of a gulp task is:

//var gulp = require('gulp');


//gulp.task('task-name', function(){
//    //stuff here
//});
//

//gulp.task('task-name', function () {
//    return gulp.src('source-files') // Get source files with gulp.src
//        .pipe(aGulpPlugin()) // Sends it through a gulp plugin
//        .pipe(gulp.dest('destination')) // Outputs the file in the destination folder
//})

var gulp = require('gulp');
var sass = require('gulp-sass'); //requires the gulp-sass plugin
var browserSync = require('browser-sync').create(); //for the browser sync
var uglify = require('gulp-uglify');//for js
var concat = require('gulp-concat');//for css
var merge = require('merge-stream');
var runSequence = require('run-sequence');
var del = require('del');//delete dist folder
var cache = require('gulp-cache');//clear the cache
var imagemin = require('gulp-imagemin');//for images


//test task
gulp.task('hello', function(){
    console.log('Hello Navidu');
});

////sass task
//gulp.task('scss', function(){
//    return gulp.src('src/scss/**/*.scss')
//        .pipe(sass())
//        .pipe(gulp.dest('dist/css'))
//        .pipe(browserSync.reload({
//            stream:true
//        }))
//
//});
//
////bootstrap
//gulp.task('getbootstrap', function(){
//    return gulp.src('node_modules/bootstrap/scss/bootstrap.scss')
//        .pipe(sass())
//        .pipe(gulp.dest('dist/css'));
//});

//css
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

//js
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

//html
gulp.task('html', function(){
    return gulp.src('src/html/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//fonts
gulp.task('fonts', function(){
    return gulp.src('src/fonts/*.{ttf,otf}')
        .pipe(gulp.dest('dist/fonts'));
});

//images
gulp.task('images', function () {
    return gulp.src('src/img/**/*.+(png|jpg|gif|svg|ico|xml|webmanifest)')
        .pipe(cache(imagemin({
            // Setting interlaced to true
            interlaced: true
        })))
        .pipe(gulp.dest('dist/img'));
});

//for browser sync
gulp.task('browserSync', function(){
    browserSync.init({
        server:{
            baseDir: 'dist'
        }
    })
});

//watch function for the changes
//browserSync and scss must be completed before run the watch task
gulp.task('watch', function(){
    gulp.watch('src/scss/**/*.scss', ['scss']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/html/*.html', ['html']);
});

//clear the old dist folder
gulp.task('clean:dist', function () {
    return del.sync('dist');
});

//clear the cache
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback);
});

//clear the old dist, calling 'clean:dist' function and build the new dist folder
//gulp build
gulp.task('build', function(callback){
    runSequence('clean:dist',
        ['scss', 'js', 'html', 'fonts', 'images']
    );
});

//default running tasks
//gulp
gulp.task('default', function (callback) {
    runSequence(['browserSync', 'watch'],
        callback
    );
});
