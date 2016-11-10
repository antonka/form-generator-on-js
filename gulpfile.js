const gulp = require('gulp');
const concat = require('gulp-concat');
const watch = require('gulp-watch');
const babel = require('gulp-babel');


gulp.task('js', function() {
    return gulp.src('./dev/js/*/*.js')
        .pipe(babel({presets: ['es2015']}))
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('es2015', function() {
    return gulp.src('./dev/js/*/*.js')
        .pipe(concat('all_es2015.js'))
        .pipe(gulp.dest('./public/'));
});

gulp.task('watch', function() {
    gulp.watch('./dev/js/*/*.js', ['es2015', 'js']);
});