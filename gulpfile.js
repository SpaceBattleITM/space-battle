'use strict';

var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	notify = require('gulp-notify'),
    watch = require('gulp-watch'),
	sass = require('gulp-sass'),
	rigger = require('gulp-rigger'),
	cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
	rimraf = require('rimraf'),
	browserSync = require("browser-sync"),
	reload = browserSync.reload;

var onError = function (err) {
	notify.onError({
		title: "Gulp",
		subtitle: "Failure!",
		message: "Error: <%= error.message %>",
		sound: "Beep"
	})(err);
};

var path = {
	build: {
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/'
	},
	src: {
		html: 'src/*.html',
		js: 'src/js/main.js',
		style: 'src/style/main.scss',
		img: 'src/img/**/*.*',
		spriteImg: 'src/sprite/**/*.*',
		spriteStyle: 'src/style/partials/',
		fonts: 'src/fonts/**/*.*'
	},
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
	clean: './build'
};


var config = {
	server: {
		baseDir: "./build"
	},
	//tunnel: true,
	host: 'localhost',
	port: 9000,
	logPrefix: "Frontend"
};


gulp.task('html:build', function () {
	gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('js:build', function () {
	gulp.src(path.src.js)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(rigger())
		.pipe(uglify())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({
			stream: true
		}));
});


gulp.task('style:build', function () {
	gulp.src(path.src.style)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(sass())
		.pipe(cssmin())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({
			stream: true
		}));

});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build'
]);

gulp.task('watch', function () {
    watch([path.watch.html], function (event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function (event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
});

gulp.task('webserver', function () {
	browserSync(config);
});

gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);
