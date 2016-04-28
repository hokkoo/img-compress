var compress = require('./bin/index');
var convert = require('./bin/convert');
var args = require('./bin/args');


var flags =args.flags;
function run () {
  if(flags.scene == "convert"){
    convert();
  }else{
    compress();
  }
}

run();