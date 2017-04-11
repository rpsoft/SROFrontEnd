var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var strip = require('gulp-strip-comments');
var babel = require('gulp-babel');

gulp.task('deploy', function () {
    gulp.src(['src/**/*.js','src/**/*.jsx'])
        .pipe(babel(
          {
            presets: [
              'react',
              'es2015',
              'stage-0'
            ],
            plugins: [
              // http://babeljs.io/docs/plugins/transform-object-rest-spread/
              "transform-object-rest-spread",

              // export from ES6 to use ./src/components/core/index.js
              "transform-export-extensions",

              // async function foo() { await bar(); }
              "transform-async-to-generator",
              "transform-regenerator",
              "transform-runtime"
            ],
            ignore: [
                // "src/components/core/upload/upload-shared-web-worker.js"
            ]
          }
        ))
        .pipe(strip())
        //.pipe(uglify())
        .pipe(gulp.dest('./build/'));
});
