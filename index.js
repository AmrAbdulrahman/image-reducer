#! /usr/bin/env node

let Jimp = require('jimp'),
    path = require('path'),
    _ = require('lodash'),
    color = require('colors'),
    q = require('q'),
    execFile = require('child_process').execFile,
    Args = require('./args'),
    File = require('./file');

require('./utils/col');
require('./utils/ends-with-any');

class ImageReducer {
  constructor() {
    if (!Args.validate()) {
      process.exit();
    }

    this.run();
  }

  run() {
    let promises = null;
    let args = Args.get();

    // single image
    if (args.img) {
      promises = [
        this.reduceImage(args.img)
      ];

    // dir
    } else if (args.dir) {
      let images = File
        .readDir(args.dir)
        .filter((file) => file.endsWithAny(['.png', '.jpg', '.jpeg']));

      images.length && console.log(`\nReducing ${images.length} images...`);
      promises = _.map(images, (image) => this.reduceImage(image));
    }

    let timeStart = Date.now();

    if (!promises.length) {
      console.log(`No images found in ${args.dir}`.yellow);
    }

    q
      .all(promises)
      .spread((...processedImages) => this.printResults(processedImages))
      .then(() => {
        console.log('\nTime:', Date.now() - timeStart, 'ms');
      });
  }

  reduceImage(imagePath) {
    let defer = q.defer();
    let args = Args.get();
    let imageName = File.getFileName(imagePath);

    Jimp.read(imagePath, (err, img) => {
      if (err) {
        defer.reject(err);
      };

      let outputPath = path.join(args.out, imageName);

      img
        .scale(args.scale)
        .quality(args.quality)
        .blur(args.blur)
        .brightness(args.brightness)
        .write(outputPath, () => {
          let originalSize = File.size(imagePath) / 1000; // KB
          let outputSize = File.size(outputPath) / 1000;

          defer.resolve({
            imageName,
            originalSize,
            outputSize,
          });
        });
    });

    return defer.promise;
  }

  reduceImageParallel(imagePath) {
    let defer = q.defer();
    let args = Args.get();

    execFile('node', ['./reduce-image-task', `--image=${imagePath}`, `--out=${args.out}`], (error, stdout, stderr) => {
      if (error) {
        return defer.reject(error);
      }

      defer.resolve(JSON.parse(stdout));
    });

    return defer.promise;
  }

  printResults(processedImages) {
    function row(...cols) {
      console.log('| ' + _.join(_.flatten(cols), ' | ') + ' |');
    }

    if (!processedImages.length) {
      return;
    }

    function header(...cols) {
      return row(_.map(cols, (col) => {
        return col
          .toUpperCase()
          .bold
          .bgWhite;
      }));
    }

    console.log(`\n${processedImages.length} image(s) processed\n`.green);

    const nameColSize = _.reduce(processedImages, (max, img) => Math.max(max, img.imageName.length), 0);
    const fromColSize = 8;
    const toColSize = 6;
    const lossColSize = 8;


    // header
    header(
      'File'.col(nameColSize),
      'Frm KB'.col(fromColSize),
      'To KB'.col(toColSize),
      'Loss'.col(lossColSize)
    );

    _.each(processedImages, (image) => {
      let {imageName, originalSize, outputSize} = image;
      let sizeReduction = (100 - (outputSize / originalSize * 100)).toFixed(2);

      row(
        imageName.col(nameColSize).bold,
        originalSize.toFixed(2).col(fromColSize).blue,
        outputSize.toFixed(2).col(toColSize).green,
        (sizeReduction + ' %').col(lossColSize).bold
      );
    });
  }
}

new ImageReducer();
