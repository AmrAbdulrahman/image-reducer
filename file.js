let fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

module.exports = class File {
  static size(path) {
    return fs.statSync(path).size;
  }

  static readDir(dir) {
    return _.map(fs.readdirSync(dir), (file) => path.join(dir, file));
  }

  static getFileName(filePath) {
    return _.last(filePath.split(path.sep));
  }
}
