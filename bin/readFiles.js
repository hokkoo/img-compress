var dirTree = require('directory-tree');
var path = require('path');
var fs = require('fs');
var util = require('util');
var _ = require('lodash');


function readFilePath (file, filepath) {
  file = file || '';
  filepath = filepath || '';
  filepath = path.resolve(filepath, file);
  var stat = fs.statSync(filepath);
  if(stat){
    return filepath;
  }
}

function flatternPath(tree, filepath, filepaths){
  filepath = filepath || '';
  filepaths = filepaths || [];
  filepath = readFilePath(tree.path, filepath);
  if(filepath){
    filepaths.push(path.normalize(filepath));
    if(tree.children && tree.children.length){
      filepath = tree.path;
      _.each(tree.children, function (v) {
        flatternPath(v, filepath, filepaths);
      });
    }
  }
  return filepaths;
}

// force = false，只处理未处理的文件；force = true，直接覆盖，不判断是否已处理
function readFiles(force){
  var srcFilePath = path.resolve('./images/src');
  var destFilePath = path.resolve('./images/dest');
  debugger;
  var srcTree = dirTree(srcFilePath) || {};
  var destTree = dirTree(destFilePath) || {};
  var srcPaths = flatternPath(srcTree);
  if(force){
    return srcPaths;
  }else{
    var destPaths = flatternPath(destTree);
    return _.filter(srcPaths, function(v){
      return destPaths.indexOf(v) === -1;
    });
  }
}

module.exports = readFiles;