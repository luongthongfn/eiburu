"use strict";
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    bulkSass = require('gulp-sass-bulk-import'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    pug = require('gulp-pug'),
    browserSync = require('browser-sync').create(),
    gutil = require('gulp-util'),
    babel = require('gulp-babel'),
    browserify = require('gulp-browserify'),
    path = {
        scss: {
            src: './src/scss/**/*.scss',
            dest: './dist/css',
            dist: './dist/css/**/*/.css'
        },
        js: {
            src: './src/js/custom.js',
            dest: './dist/js',
            dist: './dist/js/*.js'
        },
        pug: {
            src: './src/pug/pages/**/*.pug',
            dest: './dist/',
            dist: './dist/*.{html,htm}'
        },
        img: {
            src: './src/img',
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
    return gulp.src(path.pug.src)
        .pipe(pug({
            pretty: true
        })).on('error', gutil.log)
        .pipe(gulp.dest(path.pug.dest))
        .pipe(browserSync.stream());
})

//js

gulp.task('babel', function () {
    gulp.src(path.js.src)
        .pipe(browserify({
            global: true
        })).on('error', gutil.log)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env'],
            // minified: true,
            // comments: false
        })).on('error', gutil.log)
        // .pipe(rename("custom.js"))
        .pipe(sourcemaps.write('../../maps'))
        .pipe(gulp.dest(path.js.dest))
        .pipe(browserSync.stream())
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
gulp.task('watch', ['BSync', 'sass', 'babel', 'pug'], function () {
    gulp.watch(path.scss.src, ['sass']);
    gulp.watch(path.js.src, ['babel']);
    gulp.watch(path.pug.src, ['pug']);
    // gulp.watch(path.scss.dist).on('change', browserSync.reload);
    gulp.watch(path.scss.dist, browserSync.reload);
    gulp.watch(path.img.dist, browserSync.reload);
    gulp.watch(path.pug.dist, browserSync.reload);
    gulp.watch(path.js.dist, browserSync.reload);
});

gulp.task('build', ['sass', 'babel', 'pug']);
gulp.task('default', ['watch']);