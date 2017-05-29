let _ = require('lodash');
let args = [{
  name: 'dir',
  default: process.env.PWD,
  description: 'The input images directory, current directory by default'
}, {
  name: 'img',
  description: 'The input image path'
}, {
  name: 'out',
  default: process.env.PWD,
  description: 'The output images directory, current directory by default'
}, {
  name: 'quality',
  type: 'int',
  default: 80,
  description: 'The output images quality, default ${default}'
}, {
  name: 'blur',
  type: 'int',
  default: 10,
  description: 'The output images blur value, default ${default}'
}, {
  name: 'scale',
  type: 'float',
  default: 0.5,
  description: 'The output images scaled by ratio, default ${default}'
}, {
  name: 'brightness',
  type: 'float',
  default: 0.5,
  description: 'The output images brightness ratio, default ${default}'
}];

module.exports = _.reduce(args, (argsObject, arg) => {
  arg = _.defaults(arg, {
    short: _.first(arg.name),
    type: 'path'
  });

  if (arg.description && arg.default) {
    arg.description = arg.description.replace('${default}', arg.default);
  }

  return _.set(argsObject, arg.name, arg);
}, {});
