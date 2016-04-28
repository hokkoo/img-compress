var readFiles = require('./readFiles');
var args = require('./args');
var tinify = require("tinify");
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var fileExtension = require('file-extension');
var Imagemin = require('imagemin-hokkoo');
var name = require('gulp-rename');
var execFile = require('child_process').execFile;
var jpegtran = require('jpegtran-bin');
var pngcrunsh = require('node-pngcrush');
var PngCrush = require('pngcrush');

var flags =args.flags;
var imagemin = new Imagemin();
var myPngCrusher = new PngCrush(['-res', 300, '-rle']);


tinify.key = "LFE8JtwU0wEy_LkIAuvYKdXuIWGW5x82";

module.exports = function () {
  var force = flags.force;
  console.log(flags);
  var type = flags.type;
  var files = readFiles(force);
  if(type === "imagemin"){
    compressImagesWithImagemin(files);
  }else if(type === "normal"){
    compressImagesNormal(files);
  }else{
    compressImagesWithTinypng(files);
  }
}

function copyFile(file){
  var destFile = file.replace('\\src\\', '\\dest\\');
  fs.createReadStream(file).pipe(fs.createWriteStream(destFile));
}

function compressImagesNormal(files){
  _.each(files, function(file){
    if(isFile(file)){
      var extension = fileExtensionFixed(fileExtension(file));
      if(extension == "jpeg"){
        compressImageWithJPegTran(file);
      }else if(extension == "png"){
        compressImageWithPngcrush(file);
      }else{
        copyFile(file);
      }
    }
  });
}

function compressImageWithJPegTran(file){
  var destFile = file.replace('\\src\\', '\\dest\\');
  console.log(jpegtran)
  execFile('jpegtran', ['-outfile', destFile, file], function(err){
    if(err){jpegtran
      console.log('jpegtran faile : ' + JSON.stringify(err));
    }else{
      console.log('jpegtran success : ' + file);
    }
  });
}

function compressImageWithPngcrushAndOption(file, option){
  var destFile = file.replace('\\src\\', '\\dest\\');
  var rstream = fs.createReadStream(file);
  var wstream = fs.createWriteStream(destFile);
  rstream.pipe(myPngCrusher).pipe(wstream);
}

function compressImageWithPngcrush(file){
  pngcrunsh.option('-gAMA  -iCCP -sRGB ');
  fs.readFile(file, function(err, data){
    if(err){
      console.log('pngcrush faile : ' + JSON.stringify(err));
    }else{
      var destFile = file.replace('\\src\\', '\\dest\\');
      var buffer = pngcrunsh.compress(data);
      fs.writeFile(destFile, buffer, {
        flags : 'wb'
      }, function(err){
        if(err){
          console.log('pngcrush faile : ' + JSON.stringify(err));
        }else{
          console.log('pngcrush success : ' + file);
        }
      });
    }
  });
}


function isFile(file){
  if(!file) return false;
  var stat = fs.statSync(file);
  return stat && stat.isFile();
}

function compressImagesWithTinypng(files){
  var file = files.pop();
  if(isFile(file)){
    compressWithTinipng(file, function(){
      compressImagesWithTinypng(files);
    });
  }
}

function compressWithTinipng(file, cb){
  var destFile = file.replace('\\src\\', '\\dest\\');
  console.log(destFile);
  tinify.fromFile(file).toFile(destFile, function(){
    console.log('tinypng success : ' + file);
    console.log(JSON.stringify(arguments));
    cb && cb()
  });
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

function compressImagesWithImagemin(files){
  var file;
  file = files.pop();
  if(isFile(file)){
    compressWithImagemin(file, function(){
      compressImagesWithImagemin(files);
    })
  }
}
function compressWithImagemin(file, cb){
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
        console.log('success : ' + JSON.stringify(file));
      }
      cb && cb();
    });
    imagemin.unset();
  }
}