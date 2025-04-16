const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const removeEmptyLines = require('gulp-remove-empty-lines');

// Clean dist directory
gulp.task('clean', () => {
    return del(['dist']);
});

// Image optimization task using sharp
async function optimizeImages() {
    const inputDir = 'images';
    const outputDir = 'dist/images';
    let processedCount = 0;
    let totalImages = 0;
}

// Optimize HTML
gulp.task('html', () => {
    return gulp.src(['*.html'])
        .pipe(removeEmptyLines())
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        }))
        .pipe(gulp.dest('dist'));
});

// Optimize CSS
gulp.task('css', () => {
    return gulp.src('css/**/*.css')
        .pipe(cleanCSS({
            compatibility: 'ie8',
            level: {
                1: {
                    specialComments: 0,
                    removeEmpty: true,
                    removeWhitespace: true
                },
                2: {
                    mergeMedia: true,
                    removeUnusedAtRules: true,
                    restructureRules: true
                }
            }
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'));
});

// Optimize JavaScript
gulp.task('js', () => {
    return gulp.src('js/**/*.js')
        .pipe(uglify({
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'));
});

// Optimize Images
gulp.task('images', () => {
    return gulp.src('images/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ 
                quality: 75, 
                progressive: true,
                fastCrush: true
            }),
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: false },
                    { cleanupIDs: false }
                ]
            })
        ], {
            verbose: true
        }))
        .pipe(gulp.dest('dist/images'));
});

// Update HTML references to minified files
gulp.task('update-refs', () => {
    return gulp.src('dist/*.html')
        .pipe(replace(/css\/style\.css/g, 'css/style.min.css'))
        .pipe(replace(/js\/script\.js/g, 'js/script.min.js'))
        .pipe(gulp.dest('dist'));
});

// Build task - run tasks in parallel where possible
gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('html', 'css', 'js', 'images'),
    'update-refs'
));

// Watch task
gulp.task('watch', () => {
    gulp.watch('*.html', gulp.series('html', 'update-refs'));
    gulp.watch('css/**/*.css', gulp.series('css', 'update-refs'));
    gulp.watch('js/**/*.js', gulp.series('js', 'update-refs'));
    gulp.watch('images/**/*', gulp.series('images'));
}); 