/*

  npm i -D gulp-stylus nib gulp-webserver gulp-cssnano gulp-jade gulp-debug gulp-image-optimization gulp-util gulp-group-css-media-queries

*/


/*
* Dependencias
*/
var gulp    = require('gulp'),
  webserver = require('gulp-webserver'),  
  stylus    = require('gulp-stylus'),
  nib       = require('nib'),
  nano      = require('gulp-cssnano'),
  jade      = require('gulp-jade'),
  imageop   = require('gulp-image-optimization'),
  gutil     = require('gulp-util'),
  groupQuerys= require('gulp-group-css-media-queries'); 
 

var os = require('os');  

/*
* Rutas de los archivos 
*/ 

var paths = {
  css:{
    main  : 'dev/stylus/estilos.styl',
    watch : 'dev/**/*.styl',
    dest  : 'public/css/'
  },
  html:{
    main  : 'dev/index.jade',
    watch : 'dev/**/*.jade',
    dest  : 'public/html/',
    inline: 'public/index.html',
    html  : 'dev/html/*.jade'
  },
  js:{
    main  : 'dev/app.js',
    watch : 'dev/**/*.js',
    dest  : 'public/js/',
    other : 'dev/js/*.js'
  },
  images:{
    watch : ['dev/assets/**/*.png','dev/assets/**/*.jpg','dev/assets/**/*.gif','dev/assets/**/*.jpeg'],
    dest  : 'public/' //se guardan en public/img/
  },
  fonts:{
    watch : ['dev/assets/**/*.eot','dev/assets/**/*.svg','dev/assets/**/*.ttf','dev/assets/**/*.woff'],
    dest  : 'public/'//se guardan en public/fonts/
  },
  server:{
    folder : './public/'
  }

};

/*
* Run server
*/
gulp.task('server', function(){ 
  var ip = getIpAddress();
  console.log(gutil.colors.bgGreen("Server running on:"+ip+":8081")); 
  return gulp.src(paths.server.folder)
  .pipe(webserver({
    host:'0.0.0.0',
    port: '8081',
    livereload: true
  }))

  
});

/*
* Tarea build-css
*/

gulp.task('build-css', function(){
	return gulp.src(paths.css.main)
  .pipe(stylus({
    use: nib(),
    'include css': true
  }))
  .on('error', gutil.log)
  .pipe(groupQuerys())
  .on('error', gutil.log)
  // .pipe(nano())
  // .on('error', gutil.log)
  .pipe(gulp.dest(paths.css.dest))
});

/*
* Tarea build-html
*/
gulp.task('build-html', function() {
  return gulp.src(paths.html.html)
  .pipe(jade({
      pretty: true
  }))
  .on('error', gutil.log)
  .pipe(gulp.dest(paths.html.dest))
});

/*Copiar JS*/
gulp.task('copy-js', function(){
  return gulp.src(paths.js.other)
    .pipe(gulp.dest(paths.js.dest));
});

/*Build-js*/
gulp.task('build-js', ['copy-js']);

/*
* Tarea Minificar y Optimizar imagenes
*/

gulp.task('image-min', function(){
  return gulp.src(paths.images.watch)
  .pipe(imageop({
    optimizationLevel: 7,
    progressive: true,
    interlaced: true
  }))
  .pipe(gulp.dest(paths.images.dest))
});

/*
* Tarea Copiar fuentes
*/

gulp.task('copy-fonts', function(){
  return gulp.src(paths.fonts.watch)
    .pipe(gulp.dest(paths.fonts.dest));
});

/*
* Tarea watch
*/

gulp.task('watch', function(){
  gulp.watch(paths.css.watch, ['build-css']);
  gulp.watch(paths.html.watch, ['build-html']);
  gulp.watch(paths.js.watch, ['build-js']);
  gulp.watch(paths.images.watch, ['image-min']);
});

/*
* build all
*/

gulp.task('build', ['build-css','build-html','build-js']);

/*
* Preparar assets (imagenes, fonts)
*/
gulp.task('assets',['image-min','copy-fonts']);

/*
* Tarea por defecto
*/

gulp.task('default', ['server','watch','build']);


/*
* Para saber la ip
*/

// Local ip address that we're trying to calculate
var address;

// Provides a few basic operating-system related utility functions (built-in)

var ifaces = os.networkInterfaces();

function getIpAddress(){  
  for (var dev in ifaces) {

    var iface = ifaces[dev].filter(function(details) {
      return details.family === 'IPv4' && details.internal === false;
    });

    if(iface.length > 0) address = iface[0].address;
  }  
  return address;
}