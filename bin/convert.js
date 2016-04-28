var readFiles = require('./readFiles');
var args = require('./args');
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
var imagemagick = require('imagemagick');

var flags =args.flags;
var imagemin = new Imagemin();
var myPngCrusher = new PngCrush(['-res', 300, '-rle']);

module.exports = function () {
  var force = flags.force;
  var files = readFiles(force);
  console.log(files);
  // resize
  if(flags.type == "resize"){
    resizeImages(files);
  }
}
function isFile(file){
  if(!file) return false;
  var stat = fs.statSync(file);
  return stat && stat.isFile();
}

function resizeImages(files){
  var file = files.pop();
  if(isFile(file)){
    resizeImageWithAllSize(file, function(err){
      resizeImages(files);
    });
  }
}

function resizeImageWithAllSize(file, cb){
  resizeImageTo64(file, function(err){
    resizeImageTo128(file, function(err){
      resizeImageTo256(file, cb);
    });
  });
}

function resizeImageTo128(file, cb){
  var destFile = file.replace('\\src\\', '\\128\\');
  imagemagick.resize({
    srcPath : file,
    dstPath : destFile,
    width : 128,
    heigth :128
  }, function(err, sdout, sderr){
    console.log(!err ? 'success' : 'fail' + ' 128 : ' + err || file);
    cb && cb(err, sdout);
  });
}

function resizeImageTo64(file, cb){
  var destFile = file.replace('\\src\\', '\\64\\');
  imagemagick.resize({
    srcPath : file,
    dstPath : destFile,
    width : 64,
    heigth :64
  }, function(err, sdout, sderr){
    console.log(!err ? 'success' : 'fail' + ' 64 : ' + err || file);
    cb && cb(err, sdout);
  });
}


function resizeImageTo256(file, cb){
  var destFile = file.replace('\\src\\', '\\256\\');
  imagemagick.resize({
    srcPath : file,
    dstPath : destFile,
    width : 256,
    heigth :256
  }, function(err, sdout, sderr){
    console.log(!err ? 'success' : 'fail' + ' 256 : ' + err || file);
    cb && cb(err, sdout);
  });
}