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
  // resize
  if(flags.type == "resize"){

  }
}
function isFile(file){
  if(!file) return false;
  var stat = fs.statSync(file);
  return stat && stat.isFile();
}

function resizeImages(files){

}

function resizeImageToSmall(file){
  var destFile = file.replace('\\src\\', '\\small\\');
  imagemagick.resize({
    srcPath : file,
    dstPath : destFile,
    width : ''
  })
}