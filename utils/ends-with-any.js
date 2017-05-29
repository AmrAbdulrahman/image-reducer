String.prototype.endsWithAny = function(terms) {
  return terms.reduce((result, term) => {
    let endsWithTerm = this.endsWith(term);
    return result || endsWithTerm;
  }, false);
};
