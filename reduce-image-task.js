// This task is to be run separately using child_process.execFile
let Jimp = require('jimp'),
    path = require('path'),
    argv = require('argv'),
    _ = require('lodash'),
    File = require('./file');

argv.option({
  name: 'image',
  type: 'path'
});

argv.option({
  name: 'out',
  type: 'path'
});

let args = argv.run().options;
let imagePath = args.image;

Jimp.read(imagePath, (err, img) => {
  if (err) {
    process.stderr.write(err.toString());
    process.exit(1);
  };

  let fileName = _.last(imagePath.split('/'));
  let outputPath = path.join(args.out, fileName);

  img
    .resize(500, Jimp.AUTO)
    .quality(50)
    //.greyscale()
    .blur(7)
    //.opacity(0.5)
    .brightness(0.5)
    //.opaque()
    .write(outputPath, () => {
      let originalSize = File.size(imagePath) / 1000; // KB
      let outputSize = File.size(outputPath) / 1000;

      process.stdout.write(JSON.stringify({
        fileName,
        originalSize,
        outputSize,
      }));
      process.exit();
    });
});
