/* Dependencies */
var bower = require('gulp-bower');
var gulp = require('gulp');
var fs = require('fs');
var php = require('gulp-connect-php');
var browserSync = require('browser-sync').create();
var reload  = browserSync.reload;
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

/* Folders */
var bowerDir = './bower_components/';
var appDir = 'app/';
var sourceDir = appDir + 'src/';
var tempDir = appDir + 'tmp/';
var distDir = appDir + 'dist/';

/* Setup Tasks */
gulp.task('bower', function () {
	return bower()
		.pipe(gulp.dest(bowerDir));
});

/* Development Tasks */
gulp.task('default', ['bower', 'styles', 'copy-html', 'copy-images', 'scripts', 'browser-sync'], function() {
	gulp.watch(sourceDir + 'sass/**/*.scss', ['styles']).on('change', reload);
	gulp.watch(sourceDir + '**/*.{php,html}', ['copy-html']);
	gulp.watch(tempDir + '**/*.{php,html}').on('change', reload);
	gulp.watch(sourceDir + 'img/**/*.', ['copy-images']).on('change', reload);
	gulp.watch(sourceDir + 'js/*.js', ['scripts']).on('change', reload);
});

gulp.task('php', function() {
	php.server({ base: './app/tmp/', port: 8010, keepalive: true});
});

gulp.task('browser-sync',['php'], function() {
	browserSync.init({
		proxy: '127.0.0.1:8010',
		port: 8080,
		open: true,
		notify: false
	});
});

gulp.task('copy-html', function () {
	gulp.src(sourceDir + '**/*.{php,html}')
		.pipe(gulp.dest(tempDir));
});

gulp.task('copy-images', function () {
	gulp.src(sourceDir + 'img/**/*.{png,jpg,gif,svg}')
		.pipe(gulp.dest(tempDir + 'img'));
});

gulp.task('styles', function() {
	gulp.src(sourceDir + 'sass/**/style.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
    .pipe(gulp.dest(tempDir + 'css'))
		.pipe(browserSync.stream());
});

gulp.task('scripts', function () {
	gulp.src([sourceDir + 'js/lib/angular/*.js', sourceDir + 'js/app.js'])
		.pipe(concat('main.js'))
		.pipe(gulp.dest(tempDir + 'js'));
});

/* Dist Tasks */
gulp.task('dist', ['copy-html-dist', 'img-compression', 'styles-dist', 'scripts-dist']);

gulp.task('copy-html-dist', function () {
	gulp.src(tempDir + '**/*.{php,html}')
		.pipe(gulp.dest(distDir));
});

gulp.task('img-compression', function () {
	return gulp.src(tempDir + 'img/*.{png,jpg,gif}')
		.pipe(imagemin({
			progressive: true,
			use: [pngquant()]
		}))
		.pipe(gulp.dest(distDir + 'img'));
});

gulp.task('styles-dist', function() {
	gulp.src(tempDir + 'css/**/*.css')
		.pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(distDir + 'css'));
});

gulp.task('scripts-dist', function () {
	gulp.src(tempDir + 'js/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest(distDir + 'js'));
});
