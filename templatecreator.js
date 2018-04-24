function createTemplate (execlib) {
  'use strict';

  var lib = execlib.lib,
    qlib = lib.qlib,
    execSuite = execlib.execSuite,
    taskRegistry = execSuite.taskRegistry;

  function updateBalanceMethodName (cname) {
    if (cname === 'User') {
      return 'updateBalance';
    }
    return 'update'+cname+'Balance';
  }

  function getbalancefunc (banksink, username, defer) {
    qlib.promise2defer(
      banksink.call('readAccount', username),
      defer
    );
  }

  function createConstructor (name) {
    var lcname = name.toLowerCase(),
      cname = name.substring(0,1).toUpperCase()+lcname.substring(1),
      phname = lcname+'bankname',
      rsinkname = cname+'Bank',
      onmethod = 'on'+cname+'Bank',
      updatebmname = updateBalanceMethodName(cname),
      getbalancemethodname = 'get'+cname+'Balance';

    var ret = function ServiceMixin (prophash) {
      if (prophash && phname in prophash) {
        this.findRemote(this.clusterDependentRemotePath(prophash[phname]), null, rsinkname);
        this.state.data.listenFor(rsinkname, this[onmethod].bind(this), true);
      }
    };
    ret.prototype.destroy = lib.dummyFunc;
    ret.prototype[onmethod] = function (sink) {
      taskRegistry.run('queryLevelDB',{
        sink: sink,
        scanInitially: true,
        filter: {},
        onPut: (change) => { this.tellApartment(change[0], updatebmname, change[1]) },
        onDel: lib.dummyFunc
      });
    };
    ret.prototype[getbalancemethodname] = execSuite.dependentServiceMethod([], [rsinkname], getbalancefunc);
    ret.addMethods = function (klass) {
      lib.inheritMethods(
        klass,
        ret,
        onmethod,
        getbalancemethodname
      );
    };
    return ret;
  }


  return createConstructor;
}

module.exports = createTemplate;
