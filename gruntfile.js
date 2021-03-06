module.exports = function (grunt) {
  grunt.initConfig({
    image: {
      static: {
        options: {
          pngquant: true,
          optipng: false,
          zopflipng: true,
          advpng: true,
          jpegRecompress: false,
          jpegoptim: true,
          mozjpeg: true,
          gifsicle: true,
          svgo: true
        },
        files: [{
          dest : 'images/dest/IMG_0010.JPG', src : ['images/src/IMG_0010.JPG']
        }]
      },
      dynamic: {
        options: {
          pngquant: true,
          optipng: true,
          zopflipng: true,
          advpng: true,
          jpegRecompress: true,
          jpegoptim: true,
          mozjpeg: true,
          gifsicle: true,
          svgo: true
        },
        files: [{
          expand : true,
          src: ['images/src/**/*.*'],
          dest: 'images/dest/'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-image');
  // TODO 扩展 此插件，以提高更高的压缩效率，以及更方便的使用方式
};