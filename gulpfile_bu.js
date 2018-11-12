var gulp = require('gulp'),
    sass = require('gulp-sass'),
    bulkSass = require('gulp-sass-bulk-import'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    includeTag = require('gulp-include-tag'),
    browserSync = require('browser-sync').create(),
    htmlbeautify = require('gulp-html-beautify'),
    gutil = require('gulp-util'),

    babel = require('gulp-babel'),
    rename = require("gulp-rename"),

    rootProjectPath = '', /*path from root*/
    currentPath = '.',
    sassPath,
    cssPath,
    cssDestPath,
    imgPath,
    htmlPath,
    jsPath;
    var browserify = require('gulp-browserify');


/*======================================================================= TASK ====*/

//get path frome agrument when call task ___ eg:  $ gulp -p t5/adone
gulp.task('setPath', function () {
    // console.log("~~",process.argv,'~~');
    rootProjectPath = rootProjectPath + process.argv[3];
    sassPath        = (currentPath || rootProjectPath) + '/src/scss/**/*.scss';
    // includePath  = (currentPath || rootProjectPath) + '/src/layouts/**/*.html';
    pugPath        = (currentPath || rootProjectPath) + '/src/pug/**/*.pug';
    jsPathSrc       = (currentPath || rootProjectPath) + '/src/js/src/*.js';
    cssPath         = (currentPath || rootProjectPath) + '/dist/css/**/*/.css';
    cssDestPath     = (currentPath || rootProjectPath) + '/dist/css';
    imgPath         = (currentPath || rootProjectPath) + '/dist/img';
    htmlPath        = (currentPath || rootProjectPath) + '/dist/*.{html,htm}';
    jsPath          = (currentPath || rootProjectPath) + '/dist/js/*.js';
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src(sassPath)
        .pipe(bulkSass())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 version', '> 5%']
        }))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(cssDestPath))
        .pipe(browserSync.stream());
});


gulp.task('include', function () {
    return gulp.src('./layouts/page/*.html')
        .pipe(includeTag()).on('error', gutil.log)
        .pipe(htmlbeautify({
            indentSize: 4
        }))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
});

gulp.task('pug', function () {
    return gulp.src(pugPath)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
})

//js
function handleError (error) {
    console.log(error.toString());
    this.emit('end');
}
gulp.task('babel', () =>
    gulp.src('./js/src/*.js')
        .pipe(browserify({
            global : true
        })).on('error', gutil.log)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env'],
            minified: true,
            comments: false
        })).on('error', gutil.log)
        // .pipe(rename("custom.js"))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('./js'))
        .pipe(browserSync.stream())
);

// watch
gulp.task('watch', ['setPath', 'sass', 'babel',  'include'], function () {
    // Static Server + watching scss/html/js files
    browserSync.init({
        server: currentPath || rootProjectPath + '/dist',
        reloadDelay: 500
    });

    gulp.watch(sassPath, ['sass']);
    gulp.watch(jsPathSrc, ['babel']);
    gulp.watch(includePath, ['include']);
    // gulp.watch(cssPath).on('change', browserSync.reload);
    gulp.watch(sassPath).on('change', browserSync.reload);
    gulp.watch(imgPath).on('change', browserSync.reload);
    // gulp.watch(htmlPath).on('change', browserSync.reload);
    gulp.watch(jsPathSrc).on('change', browserSync.reload);

});

gulp.task('build', ['setPath', 'sass', 'babel', 'include']);
gulp.task('default', ['watch']);