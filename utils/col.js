let _ = require('lodash');

function col(data, width) {
  width = width || 20;
  width = Math.max(width, data.length);

  return data + _.repeat(' ', width - data.length);
}

String.prototype.col = function(width) {
  return col(this, width);
};

Number.prototype.col = function(width) {
  return col(this + '', width);
};
