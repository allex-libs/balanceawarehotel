function createServiceMixin (execlib) {
  'use strict';

  var lib = execlib.lib,
    qlib = lib.qlib,
    execSuite = execlib.execSuite,
    taskRegistry = execSuite.taskRegistry;

  function ServiceMixin (prophash) {
    if (prophash && 'userbankname' in prophash) {
      this.findRemote(this.clusterDependentRemotePath(prophash.userbankname, null, 'UserBank'));
      this.state.data.listenFor('UserBank', this.onUserBank.bind(this), true);
    }
  }

  ServiceMixin.prototype.destroy = function () {
  };

  ServiceMixin.prototype.onUserBank = function (sink) {
    taskRegistry.run('queryLevelDB',{
      sink: sink,
      scanInitially: true,
      filter: {},
      onPut: (change) => { this.tellApartment(change[0], 'updateBalance', change[1]) },
      onDel: lib.dummyFunc
    });
  };

  function amountgetter (balanceresult) {
    return balanceresult ? balanceresult.amount || 0 : 0;
  }

  ServiceMixin.prototype.getUserBalance = execSuite.dependentServiceMethod([], ['UserBank'], function (banksink, username, defer) {
    qlib.promise2defer(
      //qlib.promise2decision(banksink.call('readAccount', username), amountgetter),
      banksink.call('readAccount', username),
      defer
    );
  });

  ServiceMixin.addMethods = function (klass) {
    lib.inheritMethods(
      klass,
      ServiceMixin,
      'onUserBank',
      'getUserBalance'
    );
  };

  return ServiceMixin;
}

module.exports = createServiceMixin;
