var gulp = require('gulp');
var sass = require('gulp-sass');
var please = require('gulp-pleeease');
var rename = require("gulp-rename");
var jshint = require("gulp-jshint");
var uglify = require("gulp-uglify");
var stylish = require('jshint-stylish');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload();

var SassOptions = {
	errLogToConsole: true
};

var uglifySrc = [
	/** Modernizr */
	"src/assets/components/modernizr/modernizr.js",
	/** jQuery */
	"src/assets/components/jquery/dist/jquery.js",
	/** FastClick */
	"src/assets/components/fastclick/lib/fastclick.js",
	/** jQuery Cookie */
	"src/assets/components/jquery.cookie/jquery.cookie.js",
	/** Responsive Slider */
	"src/assets/components/ResponsiveSlides.js/responsiveslides.js",
	/** Foundation */
	"src/assets/components/foundation/js/foundation/foundation.js",
	/** Page scripts */
	"src/assets/js/app.js"
];

var PleeeaseOptions = {
	sourcemaps: false,
	filters: true,
	rem: ['14px'],
	pseudoElements: true,
	opacity: true,
	minifier: true,
	mqpacker: true,
	autoprefixer: {
		browsers: ['> 5%', 'last 10 versions', 'ie 8', 'ie 9']
	}
};

gulp.task('sass', function () {
	return gulp.src('src/assets/sass/*.scss')
		.pipe( sass( SassOptions ))
		.on( "error", function( e ) {
			console.error( e );
		})
		.pipe(gulp.dest('src/assets/css'));
});

gulp.task('css', ['sass'], function () {
	return gulp.src('src/assets/css/style.css')
		.pipe(please(PleeeaseOptions))
		.pipe(rename({
			extname: '.css'
		}))
		.pipe(gulp.dest('src/css'));
});

/** JSHint */
gulp.task( 'jshint', function () {
	/** Test all `js` files exclude those in the `lib` folder */
	return gulp.src( "src/assets/js/{!(lib)/*.js,*.js}" )
		.pipe( jshint() )
		.pipe( jshint.reporter( "jshint-stylish" ) )
		.pipe( jshint.reporter( "fail" ) );
});

/** Uglify */
gulp.task( 'uglify', ['jshint'], function() {
	return gulp.src( uglifySrc )
		.pipe( concat( "script.js" ) )
		.pipe( uglify() )
		.pipe( gulp.dest( "src/js" ) );
});

gulp.task('watch', ['css', 'uglify'],function() {
	browserSync.init({
		server: "./src"
	});

	gulp.watch([ "src/assets/sass/**/*.scss" ], ['css']);
	gulp.watch([ "src/assets/js/**/*.js" ], ['uglify']);

	gulp.watch([
		"*.html",
		"src/js/*.js",
		"src/css/*.css"
	]).on( "change", function( file ) {
		console.log( file.path );
		browserSync.reload();
	});
});
