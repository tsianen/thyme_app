var gulp = require('gulp'),
    env = require('gulp-env'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    del = require('del'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    transform = require('vinyl-transform'),
    source = require("vinyl-source-stream"),
    runSequence = require('run-sequence'),
    uglify = require('gulp-uglify');


var srcDir = 'frontend_src/',
    destDir = 'frontend_dist/';

gulp.task('set-env', function () {
  if (process.env.APP_NAME) return; //cancel if env is set
  env({
    heroku : {
      src : ".env"
    }
  });
});

gulp.task('clean', function() {
  return del.sync(destDir);
})

function executeBrowserify(generateSourceMaps) {

  return browserify("./frontend_src/javascript/index.js", { 
      bundleExternal: true,
      debug: false, //Enable here
      detectGlobals: true
  })
  .transform(babelify, {presets: ['es2015', 'react']})
  .bundle()
    .on('error', function (error) {
      console.log(error.stack);
      this.emit('end');
    })
    .pipe(source('index.js'))
    .pipe(rename('compiled.js'))
    .pipe(gulp.dest('frontend_dist/javascript/'));
}

function browserifyBuildDevelopment() {
  return executeBrowserify(true);
}

function browserifyBuildProduction() {
  return executeBrowserify(false);
}

gulp.task('browserify_development', browserifyBuildDevelopment);
gulp.task('browserify_production', browserifyBuildProduction);

gulp.task('minifyJS', function() {
  return gulp.src('frontend_dist/javascript/compiled.js')
        .pipe(uglify())
        .pipe(rename('compiled.min.js'))
        .pipe(gulp.dest('frontend_dist/javascript/'));
});

gulp.task('sass', function() {
  return gulp.src(srcDir+'sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(destDir+'css'));
})

gulp.task('watch', ['set-env', 'clean'], function(done){
  return runSequence('browserify_development', 'sass', function() {
    //link in all the commands here I guess
    gulp.watch(srcDir+'**/*.scss', ['sass']); 
    gulp.watch(srcDir+'javascript/**/*', ['browserify_development']);
  })
})

gulp.task('heroku',['clean'], function(done) {
  console.log('Running heroku task...')
  return runSequence('browserify_production', ['sass', 'minifyJS'], done);
});