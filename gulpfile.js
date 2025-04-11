const gulp = require('gulp');
const sharp = require('sharp');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const newer = require('gulp-newer');
const sass = require('gulp-sass')(require('node-sass'));
const fs = require('fs').promises;
const path = require('path');

// Image optimization task using sharp
async function optimizeImages() {
    const inputDir = 'images';
    const outputDir = 'dist/images';
    let processedCount = 0;
    let totalImages = 0;

    // Count total images first
    async function countImages(dir) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory()) {
                await countImages(path.join(dir, entry.name));
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase();
                if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                    totalImages++;
                }
            }
        }
    }

    // Process a single image
    async function processImage(inputPath, outputPath) {
        try {
            const ext = path.extname(inputPath).toLowerCase();
            
            // Create output directory if it doesn't exist
            await fs.mkdir(path.dirname(outputPath), { recursive: true });

            let sharpInstance = sharp(inputPath);

            // Apply different optimizations based on file type
            if (ext === '.jpg' || ext === '.jpeg') {
                await sharpInstance
                    .jpeg({ quality: 80, mozjpeg: true })
                    .toFile(outputPath);
            } else if (ext === '.png') {
                await sharpInstance
                    .png({ quality: 80, compressionLevel: 9 })
                    .toFile(outputPath);
            } else if (ext === '.webp') {
                await sharpInstance
                    .webp({ quality: 80 })
                    .toFile(outputPath);
            }

            processedCount++;
            console.log(`Progress: ${processedCount}/${totalImages} - Optimized: ${path.basename(inputPath)}`);
        } catch (error) {
            console.error(`Error processing ${inputPath}:`, error);
        }
    }

    // Process all images in a directory
    async function processDirectory(dir) {
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            const optimizationPromises = [];

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                const relativePath = path.relative(inputDir, fullPath);
                const outputPath = path.join(outputDir, relativePath);

                if (entry.isDirectory()) {
                    optimizationPromises.push(processDirectory(fullPath));
                } else if (entry.isFile()) {
                    const ext = path.extname(entry.name).toLowerCase();
                    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                        optimizationPromises.push(processImage(fullPath, outputPath));
                    }
                }
            }

            await Promise.all(optimizationPromises);
        } catch (error) {
            console.error(`Error processing directory ${dir}:`, error);
        }
    }

    // Start the optimization process
    console.log('Counting total images...');
    await countImages(inputDir);
    console.log(`Found ${totalImages} images to optimize`);
    
    console.log('Starting optimization...');
    await processDirectory(inputDir);
    console.log('Image optimization complete!');
}

// SCSS compilation task
function compileSCSS() {
    return gulp.src('scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
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
    gulp.watch('scss/**/*.scss', compileSCSS);
    gulp.watch('css/**/*.css', optimizeCSS);
    gulp.watch('js/**/*.js', optimizeJS);
    gulp.watch('*.html').on('change', browserSync.reload);
}

// Build task
const build = gulp.series(optimizeImages, compileSCSS, optimizeCSS, optimizeJS);

// Export tasks
exports.optimizeImages = optimizeImages;
exports.compileSCSS = compileSCSS;
exports.optimizeCSS = optimizeCSS;
exports.optimizeJS = optimizeJS;
exports.watch = watchFiles;
exports.build = build;
exports.default = build; 