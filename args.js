let fs = require('fs'),
    _ = require('lodash'),
    mkdirRecursive = require('mkdir-recursive'),
    HandledError = require('./handled-error');

let args = require('yargs')
  .option('dir', {
    alias: 'd',
    describe: 'The input images directory, current directory by default',
    default: process.env.PWD,
    type: 'string'
  })
  .option('out', {
    alias: 'o',
    describe: 'The output images directory, current directory by default',
    default: process.env.PWD,
    type: 'string'
  })
  .option('img', {
    alias: 'i',
    describe: 'The input image path',
    type: 'string'
  })
  .option('quality', {
    alias: 'q',
    describe: 'The output images quality',
    type: 'number',
    default: 80
  })
  .option('scale', {
    alias: 's',
    describe: 'The output images scaled by ratio, 0...1',
    type: 'number',
    default: 0.5
  })
  .option('blur', {
    alias: 'b',
    describe: 'The output images blur value',
    type: 'number',
    default: 10
  })
  .option('brightness', {
    alias: 'br',
    describe: 'The output images brightness ratio, 0...1',
    type: 'number',
    default: 0.5
  })
  .help('h')
  .argv;

class Args {
  static get() {
    this.validate();
    return args;
  }

  static validate() {
    try {
      let {img, dir, out} = args;

      if (img && !fs.existsSync(img)) {
        throw new HandledError(`Image (${img}) doesn't exist`);
      }

      if (dir && !fs.existsSync(dir)) {
        throw new HandledError(`Directory (${dir}) doesn't exist`);
      }

      // create output dir if doesn't exist
      mkdirRecursive.mkdirSync(out);

      return true;
    } catch (err) {
      if (err instanceof HandledError) {
        console.log(`${err}`);
      } else {
        throw err;
      }
    }
  }
};

module.exports = Args;
