var readFiles = require('./readFiles');
var args = require('./args');
var tinify = require("tinify");
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var fileExtension = require('file-extension');
var Imagemin = require('imagemin-hokkoo');
var name = require('gulp-rename');

var flags =args.flags;
var imagemin = new Imagemin();

tinify.key = "LFE8JtwU0wEy_LkIAuvYKdXuIWGW5x82";

module.exports = function () {
  var force = flags.force;
  console.log(flags);
  var type = flags.type;
  var files = readFiles(force);
  _.each(files, function(file){
    var stat = fs.statSync(file);
    if(stat && stat.isFile()){
      if(type === "imagemin"){
        compressWithImagemin(file);
      }else{
        compressWithTinipng(file);
      }
    }
  })
  console.log(files);
}

function compressWithTinipng(file){
  var destFile = file.replace('\\src\\', '\\dest\\');
  console.log(destFile);
  tinify.fromFile(file).toFile(destFile);
}

function fileExtensionFixed(ext){
  // TODO ，文件类型的匹配
  if(ext == "jpg"){
    ext = "jpeg";
  }
  return ext;
}
var imageminExtensionPluginMap = {
  'gif' : function(){
    imagemin.use(Imagemin.gifsicle({
      interlaced : true
    }));
  },
  'jpeg' : function(){
    imagemin.use(Imagemin.jpegtran({
      progressive : true
    }));
  },
  'png' : function(){
    imagemin.use(Imagemin.optipng({
      optimizationLevel : 3
    }));
  },
  'svg' : function(){
    imagemin.use(Imagemin.svgo());
  }
}
function compressWithImagemin(file){
  var extension = fileExtensionFixed(fileExtension(file));
  var extensionOperation = imageminExtensionPluginMap[extension];
  console.log(extension);
  if(extensionOperation){
    extensionOperation();
    var destFileDir = path.dirname(file.replace('\\src\\', '\\dest\\'));
    imagemin.src(file).dest(destFileDir).run(function(err, files){
      if(err){
        console.log(err);
      }else{
        console.log('success : ' + file);
      }
    });
    // imagemin.unset();
  }
}