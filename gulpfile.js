var babel    = require('gulp-babel'),
    del      = require('del'),
    git      = require('git-rev'),
    gulp     = require('gulp'),
    server   = require('gulp-webserver'),
    template = require('gulp-template'),
    version  = require('./package.json').version,
    watch    = require('gulp-watch');

var devFlag = false;

gulp.task('default', ['build-app']);

gulp.task('develop', ['server', 'watch']);

gulp.task('build-app', ['compile-html'], function () {
    return del(['build']);
});

gulp.task('compile-html', ['compile-css'], function () {
   git.short(commit => {
      gulp.src('src/**/*.html')
          .pipe(template({ commit : valOrRandomHash(commit), version }))
          .pipe(gulp.dest('dist'));
   });
});

gulp.task('compile-css', ['compile-js'], function () {
  return gulp.src('src/**/*.css')
             .pipe(gulp.dest('dist'));
});

gulp.task('compile-js', ['clean-all'], function () {
   gulp.src([
          'bower_components/aws-sdk/dist/aws-sdk.js',
          'bower_components/document-register-element/build/document-register-element.js',
          'bower_components/system.js/dist/system.js'
        ])
        .pipe(gulp.dest('dist/bower_components'));



   git.short(commit => {
      gulp.src('service-worker.js')
          .pipe(template({ commit : valOrRandomHash(commit), version }))
          .pipe(gulp.dest('dist'));
   });

   return gulp.src('src/**/*.js')
              .pipe(babel())
              .pipe(gulp.dest('dist'));
});

gulp.task('clean-all', function () {
    return del([
        'dist/**/*.css',
        'dist',
        'build'
    ]);
});

gulp.task('server', ['build-app'], function () {
    return gulp.src('dist')
               .pipe(server({ open : true }));
});

gulp.task('watch', function () {
    watch(['src/service-worker.js', 'src/**/*.js', 'src/**/*.html', 'src/**/*.css'], function () {
        gulp.start('build-app');
    });
});

// valOrRandomHash :: a -> a || String
function valOrRandomHash(val) {
   return devFlag ? Math.random().toString(16).substr(3) : val;
}
