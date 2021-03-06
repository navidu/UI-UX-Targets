/**
 * Created by navidu on 10/11/18.
 */
var gulp = require('gulp');
var sass = require('gulp-sass'); //requires the gulp-sass plugin
var runSequence = require('run-sequence'); // need to run all sequence
var del = require('del');//delete dist folder
var browserSync = require('browser-sync').create(); //for the browser sync
var merge = require('merge-stream'); // merge two tasks and return
var concat = require('gulp-concat');//for css and js
var uglify = require('gulp-uglify');//for css and js
var cache = require('gulp-cache');//clear the cache
var imagemin = require('gulp-imagemin');//for images
var gls = require('gulp-live-server');

//for all css
gulp.task('scss', function(){
    //take vendor css
    var vendorStreamCss = gulp.src([
        'node_modules/@fortawesome/fontawesome-free/scss/v4-shims.scss',
        'node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss',
        'node_modules/@fortawesome/fontawesome-free/scss/brands.scss',
        'node_modules/@fortawesome/fontawesome-free/scss/regular.scss',
        'node_modules/@fortawesome/fontawesome-free/scss/solid.scss',
        'node_modules/bootstrap/scss/bootstrap.scss',
        'node_modules/@claviska/jquery-minicolors/jquery.minicolors.css',
        'node_modules/grapick/dist/grapick.min.css'
    ]).pipe(sass())
        .pipe(concat('vendor.css'))
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

//for all js
gulp.task('js', function(){
    // Concatenate vendor scripts
    var vendorStreamJs = gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/jqueryui/jquery-ui.min.js',
        'node_modules/popper.js/dist/umd/popper.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/@claviska/jquery-minicolors/jquery.minicolors.js',
        'node_modules/grapick/dist/grapick.min.js'
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

//for images
gulp.task('images', function () {
    var vendorStreamImg = gulp.src([
        'node_modules/@claviska/jquery-minicolors/jquery.minicolors.png'])
        .pipe(cache(imagemin({
            // Setting interlaced to true
            interlaced: true
        })))
        .pipe(gulp.dest('dist/img/lib/stream-imgs'));

    //take app css
    var appStreamImg =  gulp.src('src/img/**/*.+(png|jpg|gif|svg|ico|xml|webmanifest)')
        .pipe(cache(imagemin({
            // Setting interlaced to true
            interlaced: true
        })))
        .pipe(gulp.dest('dist/img'));

    return merge(vendorStreamImg, appStreamImg);
});

//for fonts
gulp.task('fonts', function(){
    return gulp.src('src/fonts/*.{ttf,otf}')
        .pipe(gulp.dest('dist/fonts'));
});

//fontawesome
gulp.task('icons', function() {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest('dist/fonts/webfonts/'));
});

//watch function for the changes
gulp.task('watch', function(){
    gulp.watch('src/scss/**/*.scss', ['scss']);
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch('src/html/*.html', ['html']);
});

//clear the old dist folder
gulp.task('clean:dist', function () {
    return del.sync('dist');
});

//gulp build
gulp.task('build', function(){
    runSequence('clean:dist', ['scss', 'html', 'js', 'images', 'fonts', 'icons']
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

// start our server and listen for changes
gulp.task('server', function() {
    var server = gls.new('server.js');
    server.start();

});