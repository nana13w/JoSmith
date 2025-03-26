const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const newer = require('gulp-newer');

// Image optimization task
function optimizeImages() {
    return gulp.src('images/**/*')
        .pipe(newer('dist/images')) // Only process newer files
        .pipe(imagemin([
            imagemin.mozjpeg({
                quality: 80,
                progressive: true,
                fastCrush: true
            }),
            imagemin.optipng({
                optimizationLevel: 3,
                bitDepthReduction: true,
                colorTypeReduction: true
            }),
            imagemin.gifsicle({
                interlaced: true,
                optimizationLevel: 2
            }),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ], {
            verbose: true
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe(newer('dist/images')) // Only create WebP for newer files
        .pipe(webp({
            quality: 80,
            method: 4
        }))
        .pipe(gulp.dest('dist/images'));
}

// CSS optimization task
function optimizeCSS() {
    return gulp.src('css/**/*.css')
        .pipe(newer('dist/css'))
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css'));
}

// JavaScript optimization task
function optimizeJS() {
    return gulp.src('js/**/*.js')
        .pipe(newer('dist/js'))
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/js'));
}

// Watch task
function watchFiles() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('images/**/*', optimizeImages);
    gulp.watch('css/**/*.css', optimizeCSS);
    gulp.watch('js/**/*.js', optimizeJS);
    gulp.watch('*.html').on('change', browserSync.reload);
}

// Build task
const build = gulp.series(optimizeImages, optimizeCSS, optimizeJS);

// Export tasks
exports.optimizeImages = optimizeImages;
exports.optimizeCSS = optimizeCSS;
exports.optimizeJS = optimizeJS;
exports.watch = watchFiles;
exports.build = build;
exports.default = build; 