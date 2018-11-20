"use strict";
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    bulkSass = require('gulp-sass-bulk-import'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    pug = require('gulp-pug'),
    browserSync = require('browser-sync').create(),
    log = require('gulplog'),
    babel = require('gulp-babel'),
    Gbrowserify = require('gulp-browserify'),
    browserify = require('browserify'),
    vinyltransform = require('vinyl-transform'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    babelify = require('babelify'),
    concat = require('gulp-concat'),
    globby = require('globby'),
    through = require('through2'),
    streamify = require('gulp-streamify'),



    path = {
        scss: {
            src: './src/scss/**/*.scss',
            dest: './dist/css',
            dist: './dist/css/**/*/.css'
        },
        js: {
            src: './src/js/**/*.js',
            dest: './dist/js',
            dist: './dist/js/*.js'
        },
        pug: {
            src: './src/pug/pages/*.{pug,html}',
            dest: './dist/',
            dist: './dist/*.{html,htm}'
        },
        img: {
            src: './src/img/*.{png,jpg,gif}',
            src: './dist/img',
            dest: './dist/img/*.{png|jpg}'
        }
    };


/*======================================================================= TASK ====*/
function handleError(error) {
    console.log(error.toString());
    this.emit('end');
}

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src(path.scss.src)
        .pipe(bulkSass())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 version', '> 5%']
        }))
        .pipe(sourcemaps.write('../../maps'))
        .pipe(gulp.dest(path.scss.dest))
        .pipe(browserSync.stream());
});

gulp.task('pug', function () {
    return gulp.src([path.pug.src, '!./src/pug/**/_*.pug'])
        .pipe(pug({
            pretty: true
        })).on('error', log.error)
        .pipe(gulp.dest(path.pug.dest))
        .pipe(browserSync.stream());
})

//js

gulp.task('concat', function () {
    return gulp.src([
            './src/js/**/*.js',
            '!./src/js/custom.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('custom.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./src/js'));
})

gulp.task('script', () => {
    // gulp expects tasks to return a stream, so we create one here.
    var bundledStream = through();

    bundledStream
        // turns the output bundle stream into a stream containing
        // the normal attributes gulp plugins expect.
        .pipe(source('custom.js'))
        // the rest of the gulp task, as you would normally write it.
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        // Add gulp plugins to the pipeline here.
        .pipe(sourcemaps.write('../../maps'))
        .pipe(gulp.dest('./dist/js/'));

    // "globby" replaces the normal "gulp.src" as Browserify
    // creates it's own readable stream.
    globby(['./src/js/**/*.js' /* ,'!./src/js/vendor' */ ]).then(function (entries) {
        // create the Browserify instance.
        var b = browserify({
            entries: entries,
            debug: true,
        }).transform(babelify, {
            presets: ["@babel/preset-env"],
            minified: true,
            comments: false
        });

        // pipe the Browserify stream into the stream we created earlier
        // this starts our gulp pipeline.
        b.bundle()
            .pipe(source('custom.js'))
            .pipe(
                streamify(
                    babel({
                        presets: ['@babel/env'],
                        minified: true,
                        comments: false
                    })
                )
            ).on('error', log.error)
            .pipe(bundledStream)
    }).catch(function (err) {
        // ensure any errors from globby are handled
        bundledStream.emit('error', err);
    });

    // finally, we return the stream, so gulp knows when this task is done.
    // console.log(bundledStream)
    return bundledStream;
});

gulp.task("BSync", function () {
    // Static Server + watching scss/html/js files
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

// watch
gulp.task('watch', ['BSync', 'sass', 'script', 'pug'], function () {
    gulp.watch(path.scss.src, ['sass']);
    gulp.watch([path.js.src, '!./src/js/custom.js'], ['script']);
    gulp.watch('./src/pug/**/*.pug', ['pug']);
    // gulp.watch(path.scss.dist).on('change', browserSync.reload);
    gulp.watch(path.scss.dist, browserSync.reload);
    gulp.watch(path.img.dist, browserSync.reload);
    gulp.watch(path.pug.dist, browserSync.reload);
    gulp.watch(path.js.dist, browserSync.reload);
});

gulp.task('build', ['sass', 'script', 'pug']);
gulp.task('default', ['watch']);