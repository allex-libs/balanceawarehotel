function createLib (execlib) {
  'use strict';

  return {
    servicemixin: require('./servicemixincreator')(execlib)
  };
}

module.exports = createLib;
