const gulp = require('gulp'),
	connect = require('gulp-connect'),
	sass = require('gulp-sass'),
	clean = require('gulp-clean'),
	cleanCSS = require('gulp-clean-css'),
	imageMin = require('gulp-imagemin'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify');

const paths = {
	js: ['js/*', 'js/*/*'],
	css: ['css/**/*.scss'],
	img: ['img/*', 'img/*/*'],
	html: ['index.html']
}

gulp.task('css', function() {
  return gulp.src('css/styles.scss')
    .pipe(sass().on('error', sass.logError))
		.pipe(cleanCSS({debug: true}))
    .pipe(gulp.dest('build'))
		.pipe(connect.reload());
});

gulp.task('js', function () {
  return gulp.src(['./js/jquery-3.2.1.min.js', './js/main.js'])
	.pipe(concat('bundle.js'))
	// .pipe(uglify({mangle:true}))
	.pipe(gulp.dest('build'))
	.pipe(connect.reload());
});

gulp.task('clean', function() {
 	return gulp.src('build')
 	.pipe(clean());
});

gulp.task('watch', function() {
  	gulp.watch(paths.js, ['js']);
  	gulp.watch(paths.css, ['css']);
  	gulp.watch(paths.html, ['html']);
  	gulp.watch(paths.img, ['images']);
});

gulp.task('html', function(){
	gulp.src('index.html')
		.pipe(gulp.dest('build'))
    .pipe(connect.reload());
});

gulp.task('images', function(){
	gulp.src(paths.img)
	.pipe(imageMin([
      imageMin.gifsicle({interlaced: true}),
      imageMin.jpegtran({progressive: true}),
      imageMin.optipng({optimizationLevel: 5}),
      imageMin.svgo({plugins: [{removeViewBox: true}]})
    ]))
		.pipe(gulp.dest('build/img'))
		.pipe(connect.reload());
});

gulp.task('serve', function(){
	connect.server({
		root:'build',
		port:'3030',
		livereload:true,
		fallback:'build/index.html'
	})
});

gulp.task('start', ['serve','watch', 'html', 'css', 'js', 'images']);
