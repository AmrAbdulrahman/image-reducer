let argv = require('argv'),
    fs = require('fs'),
    _ = require('lodash'),
    mkdirRecursive = require('mkdir-recursive'),
    HandledError = require('../handled-error');

class Args {
  static process() {
    let argsDef = require('./args-def');

    // args config
    _.each(argsDef, (arg) => {
      argv.option(arg);
    })

    let args = argv.run().options;

    // set default values
    _.each(argsDef, (arg, argName) => {
      if (_.isUndefined(args[argName]) === true) {
        args[argName] = arg.default;
      }
    });

    return args;
  }

  static validate() {
    try {
      let {img, dir, out} = this.process();

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
