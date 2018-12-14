"use strict";
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    bulkSass = require('gulp-sass-bulk-import'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    pug = require('gulp-pug'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create(),
    log = require('gulplog'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify'),
    globalShim = require('browserify-global-shim').configure({
        'jquery': '$',
    }),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    globby = require('globby'),
    through = require('through2'),
    
    distFolder = "dist",
    mapsFolder = '../maps',
    path = {
        scss: {
            src: `./src/scss/**/*.scss`,
            dest: `./${distFolder}/css`,
            dist: `./dist/css/**/*/.css`
        },
        js: {
            src: `./src/js/**/*.js`,
            dest: `./${distFolder}/js`,
            dist: `./${distFolder}/js/*.js`
        },
        pug: {
            src: `./src/pug/pages/*.pug`,
            dest: `./${distFolder}/`,
            dist: `./${distFolder}/*.{html,htm}`
        },
        img: {
            src: `./src/img/*.{png,jpg,gif}`,
            dest: `./${distFolder}/img`,
            dist: `./${distFolder}/img/*.{png|jpg}`
        }
    };


/*======================================================================= TASK ====*/

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src([path.scss.src, '!src/scss/vendor/**'])
        .pipe(bulkSass())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 version', '> 5%']
        }))
        .pipe(sourcemaps.write(mapsFolder))
        .pipe(gulp.dest(path.scss.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('pug', function () {
    return gulp.src([path.pug.src, '!./src/pug/**/_*.pug'])
        .pipe(pug({
            pretty: true
        })).on('error', log.error)
        .pipe(gulp.dest(path.pug.dest))
        // .pipe(browserSync.stream());
        .pipe(browserSync.reload({
            stream: true
        }));
})

//js

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
        .pipe(uglify()).on('error', log.error)
        .pipe(sourcemaps.write(mapsFolder))
        .pipe(gulp.dest(path.js.dest))
        .pipe(browserSync.reload({
            stream: true
        }));

    // "globby" replaces the normal "gulp.src" as Browserify
    // creates it's own readable stream.
    globby([path.js.src ,'!./src/js/helper/**' ]).then(function (entries) {
        // create the Browserify instance.
        var b = browserify({
            entries: entries,
            debug: true,
        })
        .transform(
            "babelify",
            {
                presets: ['@babel/env'],
                minified: true,
                comments: false
            }
        )
        .transform({
            global: true,
        }, globalShim);

        // pipe the Browserify stream into the stream we created earlier
        // this starts our gulp pipeline.
        b.bundle()
            .pipe(bundledStream)
    }).catch(function (err) {
        // ensure any errors from globby are handled
        bundledStream.emit('error', err);
    });

    // finally, we return the stream, so gulp knows when this task is done.
    // console.log(bundledStream)
    return bundledStream;
});

gulp.task('img', () => {

    gulp.src(path.img.src)
        .pipe(imagemin())
        .pipe(gulp.dest(path.img.dest))
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
    gulp.watch(path.img.dist, browserSync.reload);
});

gulp.task('build', ['sass', 'script', 'pug']);
gulp.task('default', ['watch']);