const gulp = require("gulp");
const typescript = require('gulp-typescript');

gulp.task('ts', function() {
    const options = {
        out: 'main.js'
    };
    gulp.src([
            './**/*.ts',
            '!./node_modules/**'
        ])
        .pipe(typescript(options))
        .pipe(gulp.dest('./js'));
});

gulp.task('watch', function() {
    gulp.watch('./ts/*.ts', ['ts']);
});