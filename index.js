function createLib (execlib) {
  'use strict';

  var template = require('./templatecreator')(execlib);

  return {
    template: template,
    servicemixin: require('./servicemixincreator')(execlib, template)
  };
}

module.exports = createLib;
