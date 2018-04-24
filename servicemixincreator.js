function createServiceMixin (execlib, template) {
  'use strict';

  var lib = execlib.lib,
    qlib = lib.qlib,
    execSuite = execlib.execSuite,
    taskRegistry = execSuite.taskRegistry;

  return template('user');
}

module.exports = createServiceMixin;
