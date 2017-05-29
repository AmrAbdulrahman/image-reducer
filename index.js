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

    this.args = Args.process();

    // single image
    if (this.args.img) {
      promises = [
        this.reduceImage(this.args.img)
      ];

    // dir
    } else if (this.args.dir) {
      let images = File
        .readDir(this.args.dir)
        .filter((file) => file.endsWithAny(['.png', '.jpg', '.jpeg']));

      images.length && console.log(`\nReducing ${images.length} images...`);
      promises = _.map(images, (image) => this.reduceImage(image));
    }

    let timeStart = Date.now();

    if (!promises.length) {
      console.log(`No images found in ${this.args.dir}`.yellow);
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
    let fileName = _.last(imagePath.split('/'));

    Jimp.read(imagePath, (err, img) => {
      if (err) {
        defer.reject(err);
      };

      let outputPath = path.join(this.args.out, fileName);

      img
        .scale(this.args.scale)
        .quality(this.args.quality)
        .blur(this.args.blur)
        .brightness(this.args.brightness)
        .write(outputPath, () => {
          let originalSize = File.size(imagePath) / 1000; // KB
          let outputSize = File.size(outputPath) / 1000;

          defer.resolve({
            fileName,
            originalSize,
            outputSize,
          });
        });
    });

    return defer.promise;
  }

  reduceImageParallel(imagePath) {
    let defer = q.defer();

    execFile('node', ['./reduce-image-task', `--image=${imagePath}`, `--out=${this.args.out}`], (error, stdout, stderr) => {
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

    // header
    header(
      'File'.col(50),
      'From (KB)'.col(10),
      'To (KB)'.col(10),
      'Loss %'.col(10)
    );

    _.each(processedImages, (image) => {
      let {fileName, originalSize, outputSize} = image;
      let sizeReduction = (100 - (outputSize / originalSize * 100)).toFixed(2);

      row(
        fileName.col(50).bold,
        originalSize.toFixed(2).col(10).blue,
        outputSize.toFixed(2).col(10).green,
        (sizeReduction + ' %').col(10).bold
      );
    });
  }
}

new ImageReducer();
