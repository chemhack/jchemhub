var a, COMPILED = true, goog = goog || {};
goog.global = this;
goog.DEBUG = true;
goog.LOCALE = "en";
goog.evalWorksForGlobals_ = null;
goog.provide = function(b) {
  if(!COMPILED) {
    if(goog.getObjectByName(b) && !goog.implicitNamespaces_[b]) {
      throw Error('Namespace "' + b + '" already declared.');
    }for(var c = b;c = c.substring(0, c.lastIndexOf("."));) {
      goog.implicitNamespaces_[c] = true
    }
  }goog.exportPath_(b)
};
if(!COMPILED) {
  goog.implicitNamespaces_ = {}
}goog.exportPath_ = function(b, c, d) {
  b = b.split(".");
  d = d || goog.global;
  !(b[0] in d) && d.execScript && d.execScript("var " + b[0]);
  for(var e;b.length && (e = b.shift());) {
    if(!b.length && goog.isDef(c)) {
      d[e] = c
    }else {
      d = d[e] ? d[e] : (d[e] = {})
    }
  }
};
goog.getObjectByName = function(b, c) {
  b = b.split(".");
  c = c || goog.global;
  for(var d;d = b.shift();) {
    if(c[d]) {
      c = c[d]
    }else {
      return null
    }
  }return c
};
goog.globalize = function(b, c) {
  c = c || goog.global;
  for(var d in b) {
    c[d] = b[d]
  }
};
goog.addDependency = function(b, c, d) {
  if(!COMPILED) {
    var e;
    b = b.replace(/\\/g, "/");
    for(var f = goog.dependencies_, g = 0;e = c[g];g++) {
      f.nameToPath[e] = b;
      b in f.pathToNames || (f.pathToNames[b] = {});
      f.pathToNames[b][e] = true
    }for(e = 0;c = d[e];e++) {
      b in f.requires || (f.requires[b] = {});
      f.requires[b][c] = true
    }
  }
};
goog.require = function(b) {
  if(!COMPILED) {
    if(!goog.getObjectByName(b)) {
      var c = goog.getPathFromDeps_(b);
      if(c) {
        goog.included_[c] = true;
        goog.writeScripts_()
      }else {
        b = "goog.require could not find: " + b;
        goog.global.console && goog.global.console.error(b);
        throw Error(b);
      }
    }
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(b) {
  return b
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(b) {
  b.getInstance = function() {
    return b.instance_ || (b.instance_ = new b)
  }
};
if(!COMPILED) {
  goog.included_ = {};
  goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}};
  goog.inHtmlDocument_ = function() {
    var b = goog.global.document;
    return typeof b != "undefined" && "write" in b
  };
  goog.findBasePath_ = function() {
    if(goog.inHtmlDocument_()) {
      var b = goog.global.document;
      if(goog.global.CLOSURE_BASE_PATH) {
        goog.basePath = goog.global.CLOSURE_BASE_PATH
      }else {
        b = b.getElementsByTagName("script");
        for(var c = b.length - 1;c >= 0;--c) {
          var d = b[c].src, e = d.length;
          if(d.substr(e - 7) == "base.js") {
            goog.basePath = d.substr(0, e - 7);
            return
          }
        }
      }
    }
  };
  goog.writeScriptTag_ = function(b) {
    if(goog.inHtmlDocument_() && !goog.dependencies_.written[b]) {
      goog.dependencies_.written[b] = true;
      goog.global.document.write('<script type="text/javascript" src="' + b + '"><\/script>')
    }
  };
  goog.writeScripts_ = function() {
    function b(g) {
      if(!(g in e.written)) {
        if(!(g in e.visited)) {
          e.visited[g] = true;
          if(g in e.requires) {
            for(var h in e.requires[g]) {
              if(h in e.nameToPath) {
                b(e.nameToPath[h])
              }else {
                if(!goog.getObjectByName(h)) {
                  throw Error("Undefined nameToPath for " + h);
                }
              }
            }
          }
        }if(!(g in d)) {
          d[g] = true;
          c.push(g)
        }
      }
    }
    var c = [], d = {}, e = goog.dependencies_;
    for(var f in goog.included_) {
      e.written[f] || b(f)
    }for(f = 0;f < c.length;f++) {
      if(c[f]) {
        goog.writeScriptTag_(goog.basePath + c[f])
      }else {
        throw Error("Undefined script input");
      }
    }
  };
  goog.getPathFromDeps_ = function(b) {
    return b in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[b] : null
  };
  goog.findBasePath_();
  goog.global.CLOSURE_NO_DEPS || goog.writeScriptTag_(goog.basePath + "deps.js")
}goog.typeOf = function(b) {
  var c = typeof b;
  if(c == "object") {
    if(b) {
      if(b instanceof Array || !(b instanceof Object) && Object.prototype.toString.call(b) == "[object Array]" || typeof b.length == "number" && typeof b.splice != "undefined" && typeof b.propertyIsEnumerable != "undefined" && !b.propertyIsEnumerable("splice")) {
        return"array"
      }if(!(b instanceof Object) && (Object.prototype.toString.call(b) == "[object Function]" || typeof b.call != "undefined" && typeof b.propertyIsEnumerable != "undefined" && !b.propertyIsEnumerable("call"))) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if(c == "function" && typeof b.call == "undefined") {
      return"object"
    }
  }return c
};
goog.propertyIsEnumerableCustom_ = function(b, c) {
  if(c in b) {
    for(var d in b) {
      if(d == c && Object.prototype.hasOwnProperty.call(b, c)) {
        return true
      }
    }
  }return false
};
goog.propertyIsEnumerable_ = function(b, c) {
  return b instanceof Object ? Object.prototype.propertyIsEnumerable.call(b, c) : goog.propertyIsEnumerableCustom_(b, c)
};
goog.isDef = function(b) {
  return b !== undefined
};
goog.isNull = function(b) {
  return b === null
};
goog.isDefAndNotNull = function(b) {
  return b != null
};
goog.isArray = function(b) {
  return goog.typeOf(b) == "array"
};
goog.isArrayLike = function(b) {
  var c = goog.typeOf(b);
  return c == "array" || c == "object" && typeof b.length == "number"
};
goog.isDateLike = function(b) {
  return goog.isObject(b) && typeof b.getFullYear == "function"
};
goog.isString = function(b) {
  return typeof b == "string"
};
goog.isBoolean = function(b) {
  return typeof b == "boolean"
};
goog.isNumber = function(b) {
  return typeof b == "number"
};
goog.isFunction = function(b) {
  return goog.typeOf(b) == "function"
};
goog.isObject = function(b) {
  b = goog.typeOf(b);
  return b == "object" || b == "array" || b == "function"
};
goog.getUid = function(b) {
  if(b.hasOwnProperty && b.hasOwnProperty(goog.UID_PROPERTY_)) {
    return b[goog.UID_PROPERTY_]
  }b[goog.UID_PROPERTY_] || (b[goog.UID_PROPERTY_] = ++goog.uidCounter_);
  return b[goog.UID_PROPERTY_]
};
goog.removeUid = function(b) {
  "removeAttribute" in b && b.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete b[goog.UID_PROPERTY_]
  }catch(c) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(Math.random() * 2147483648).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(b) {
  var c = goog.typeOf(b);
  if(c == "object" || c == "array") {
    if(b.clone) {
      return b.clone.call(b)
    }c = c == "array" ? [] : {};
    for(var d in b) {
      c[d] = goog.cloneObject(b[d])
    }return c
  }return b
};
goog.bind = function(b, c) {
  var d = c || goog.global;
  if(arguments.length > 2) {
    var e = Array.prototype.slice.call(arguments, 2);
    return function() {
      var f = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(f, e);
      return b.apply(d, f)
    }
  }else {
    return function() {
      return b.apply(d, arguments)
    }
  }
};
goog.partial = function(b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var d = Array.prototype.slice.call(arguments);
    d.unshift.apply(d, c);
    return b.apply(this, d)
  }
};
goog.mixin = function(b, c) {
  for(var d in c) {
    b[d] = c[d]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function(b) {
  if(goog.global.execScript) {
    goog.global.execScript(b, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;");
        if(typeof goog.global._et_ != "undefined") {
          delete goog.global._et_;
          goog.evalWorksForGlobals_ = true
        }else {
          goog.evalWorksForGlobals_ = false
        }
      }if(goog.evalWorksForGlobals_) {
        goog.global.eval(b)
      }else {
        var c = goog.global.document, d = c.createElement("script");
        d.type = "text/javascript";
        d.defer = false;
        d.appendChild(c.createTextNode(b));
        c.body.appendChild(d);
        c.body.removeChild(d)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.typedef = true;
goog.getCssName = function(b, c) {
  b = b + (c ? "-" + c : "");
  return goog.cssNameMapping_ && b in goog.cssNameMapping_ ? goog.cssNameMapping_[b] : b
};
goog.setCssNameMapping = function(b) {
  goog.cssNameMapping_ = b
};
goog.getMsg = function(b, c) {
  c = c || {};
  for(var d in c) {
    b = b.replace(new RegExp("\\{\\$" + d + "\\}", "gi"), c[d])
  }return b
};
goog.exportSymbol = function(b, c, d) {
  goog.exportPath_(b, c, d)
};
goog.exportProperty = function(b, c, d) {
  b[c] = d
};
goog.inherits = function(b, c) {
  function d() {
  }
  d.prototype = c.prototype;
  b.superClass_ = c.prototype;
  b.prototype = new d;
  b.prototype.constructor = b
};
goog.base = function(b, c) {
  var d = arguments.callee.caller;
  if(d.superClass_) {
    return d.superClass_.constructor.apply(b, Array.prototype.slice.call(arguments, 1))
  }for(var e = Array.prototype.slice.call(arguments, 2), f = false, g = b.constructor;g;g = g.superClass_ && g.superClass_.constructor) {
    if(g.prototype[c] === d) {
      f = true
    }else {
      if(f) {
        return g.prototype[c].apply(b, e)
      }
    }
  }if(b[c] === d) {
    return b.constructor.prototype[c].apply(b, e)
  }else {
    throw Error("goog.base called from a method of one name to a method of a different name");
  }
};goog.Disposable = function() {
};
a = goog.Disposable.prototype;
a.disposed_ = false;
a.isDisposed = function() {
  return this.disposed_
};
a.getDisposed = goog.Disposable.prototype.isDisposed;
a.dispose = function() {
  if(!this.disposed_) {
    this.disposed_ = true;
    this.disposeInternal()
  }
};
a.disposeInternal = function() {
};
goog.dispose = function(b) {
  b && typeof b.dispose == "function" && b.dispose()
};goog.array = {};
goog.array.ArrayLike = goog.typedef;
goog.array.peek = function(b) {
  return b[b.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.array.ARRAY_PROTOTYPE_.indexOf ? function(b, c, d) {
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(b, c, d)
} : function(b, c, d) {
  d = d == null ? 0 : d < 0 ? Math.max(0, b.length + d) : d;
  if(goog.isString(b)) {
    if(!goog.isString(c) || c.length != 1) {
      return-1
    }return b.indexOf(c, d)
  }for(d = d;d < b.length;d++) {
    if(d in b && b[d] === c) {
      return d
    }
  }return-1
};
goog.array.lastIndexOf = goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(b, c, d) {
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(b, c, d == null ? b.length - 1 : d)
} : function(b, c, d) {
  d = d == null ? b.length - 1 : d;
  if(d < 0) {
    d = Math.max(0, b.length + d)
  }if(goog.isString(b)) {
    if(!goog.isString(c) || c.length != 1) {
      return-1
    }return b.lastIndexOf(c, d)
  }for(d = d;d >= 0;d--) {
    if(d in b && b[d] === c) {
      return d
    }
  }return-1
};
goog.array.forEach = goog.array.ARRAY_PROTOTYPE_.forEach ? function(b, c, d) {
  goog.array.ARRAY_PROTOTYPE_.forEach.call(b, c, d)
} : function(b, c, d) {
  for(var e = b.length, f = goog.isString(b) ? b.split("") : b, g = 0;g < e;g++) {
    g in f && c.call(d, f[g], g, b)
  }
};
goog.array.forEachRight = function(b, c, d) {
  var e = b.length, f = goog.isString(b) ? b.split("") : b;
  for(e = e - 1;e >= 0;--e) {
    e in f && c.call(d, f[e], e, b)
  }
};
goog.array.filter = goog.array.ARRAY_PROTOTYPE_.filter ? function(b, c, d) {
  return goog.array.ARRAY_PROTOTYPE_.filter.call(b, c, d)
} : function(b, c, d) {
  for(var e = b.length, f = [], g = 0, h = goog.isString(b) ? b.split("") : b, j = 0;j < e;j++) {
    if(j in h) {
      var k = h[j];
      if(c.call(d, k, j, b)) {
        f[g++] = k
      }
    }
  }return f
};
goog.array.map = goog.array.ARRAY_PROTOTYPE_.map ? function(b, c, d) {
  return goog.array.ARRAY_PROTOTYPE_.map.call(b, c, d)
} : function(b, c, d) {
  for(var e = b.length, f = new Array(e), g = goog.isString(b) ? b.split("") : b, h = 0;h < e;h++) {
    if(h in g) {
      f[h] = c.call(d, g[h], h, b)
    }
  }return f
};
goog.array.reduce = function(b, c, d, e) {
  if(b.reduce) {
    return e ? b.reduce(goog.bind(c, e), d) : b.reduce(c, d)
  }var f = d;
  goog.array.forEach(b, function(g, h) {
    f = c.call(e, f, g, h, b)
  });
  return f
};
goog.array.reduceRight = function(b, c, d, e) {
  if(b.reduceRight) {
    return e ? b.reduceRight(goog.bind(c, e), d) : b.reduceRight(c, d)
  }var f = d;
  goog.array.forEachRight(b, function(g, h) {
    f = c.call(e, f, g, h, b)
  });
  return f
};
goog.array.some = goog.array.ARRAY_PROTOTYPE_.some ? function(b, c, d) {
  return goog.array.ARRAY_PROTOTYPE_.some.call(b, c, d)
} : function(b, c, d) {
  for(var e = b.length, f = goog.isString(b) ? b.split("") : b, g = 0;g < e;g++) {
    if(g in f && c.call(d, f[g], g, b)) {
      return true
    }
  }return false
};
goog.array.every = goog.array.ARRAY_PROTOTYPE_.every ? function(b, c, d) {
  return goog.array.ARRAY_PROTOTYPE_.every.call(b, c, d)
} : function(b, c, d) {
  for(var e = b.length, f = goog.isString(b) ? b.split("") : b, g = 0;g < e;g++) {
    if(g in f && !c.call(d, f[g], g, b)) {
      return false
    }
  }return true
};
goog.array.find = function(b, c, d) {
  c = goog.array.findIndex(b, c, d);
  return c < 0 ? null : goog.isString(b) ? b.charAt(c) : b[c]
};
goog.array.findIndex = function(b, c, d) {
  for(var e = b.length, f = goog.isString(b) ? b.split("") : b, g = 0;g < e;g++) {
    if(g in f && c.call(d, f[g], g, b)) {
      return g
    }
  }return-1
};
goog.array.findRight = function(b, c, d) {
  c = goog.array.findIndexRight(b, c, d);
  return c < 0 ? null : goog.isString(b) ? b.charAt(c) : b[c]
};
goog.array.findIndexRight = function(b, c, d) {
  var e = b.length, f = goog.isString(b) ? b.split("") : b;
  for(e = e - 1;e >= 0;e--) {
    if(e in f && c.call(d, f[e], e, b)) {
      return e
    }
  }return-1
};
goog.array.contains = function(b, c) {
  return goog.array.indexOf(b, c) >= 0
};
goog.array.isEmpty = function(b) {
  return b.length == 0
};
goog.array.clear = function(b) {
  if(!goog.isArray(b)) {
    for(var c = b.length - 1;c >= 0;c--) {
      delete b[c]
    }
  }b.length = 0
};
goog.array.insert = function(b, c) {
  goog.array.contains(b, c) || b.push(c)
};
goog.array.insertAt = function(b, c, d) {
  goog.array.splice(b, d, 0, c)
};
goog.array.insertArrayAt = function(b, c, d) {
  goog.partial(goog.array.splice, b, d, 0).apply(null, c)
};
goog.array.insertBefore = function(b, c, d) {
  var e;
  arguments.length == 2 || (e = goog.array.indexOf(b, d)) < 0 ? b.push(c) : goog.array.insertAt(b, c, e)
};
goog.array.remove = function(b, c) {
  c = goog.array.indexOf(b, c);
  var d;
  if(d = c >= 0) {
    goog.array.removeAt(b, c)
  }return d
};
goog.array.removeAt = function(b, c) {
  return goog.array.ARRAY_PROTOTYPE_.splice.call(b, c, 1).length == 1
};
goog.array.removeIf = function(b, c, d) {
  c = goog.array.findIndex(b, c, d);
  if(c >= 0) {
    goog.array.removeAt(b, c);
    return true
  }return false
};
goog.array.concat = function() {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.clone = function(b) {
  if(goog.isArray(b)) {
    return goog.array.concat(b)
  }else {
    for(var c = [], d = 0, e = b.length;d < e;d++) {
      c[d] = b[d]
    }return c
  }
};
goog.array.toArray = function(b) {
  if(goog.isArray(b)) {
    return goog.array.concat(b)
  }return goog.array.clone(b)
};
goog.array.extend = function(b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if(goog.isArray(d) || (e = goog.isArrayLike(d)) && d.hasOwnProperty("callee")) {
      b.push.apply(b, d)
    }else {
      if(e) {
        for(var f = b.length, g = d.length, h = 0;h < g;h++) {
          b[f + h] = d[h]
        }
      }else {
        b.push(d)
      }
    }
  }
};
goog.array.splice = function(b) {
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(b, goog.array.slice(arguments, 1))
};
goog.array.slice = function(b, c, d) {
  return arguments.length <= 2 ? goog.array.ARRAY_PROTOTYPE_.slice.call(b, c) : goog.array.ARRAY_PROTOTYPE_.slice.call(b, c, d)
};
goog.array.removeDuplicates = function(b, c) {
  c = c || b;
  for(var d = {}, e = 0, f = 0;f < b.length;) {
    var g = b[f++], h = goog.isObject(g) ? goog.getUid(g) : g;
    if(!Object.prototype.hasOwnProperty.call(d, h)) {
      d[h] = true;
      c[e++] = g
    }
  }c.length = e
};
goog.array.binarySearch = function(b, c, d) {
  return goog.array.binarySelect(b, goog.partial(d || goog.array.defaultCompare, c))
};
goog.array.binarySelect = function(b, c, d) {
  for(var e = 0, f = b.length - 1;e <= f;) {
    var g = e + f >> 1, h = c.call(d, b[g], g, b);
    if(h > 0) {
      e = g + 1
    }else {
      if(h < 0) {
        f = g - 1
      }else {
        return g
      }
    }
  }return-(e + 1)
};
goog.array.sort = function(b, c) {
  goog.array.ARRAY_PROTOTYPE_.sort.call(b, c || goog.array.defaultCompare)
};
goog.array.stableSort = function(b, c) {
  function d(g, h) {
    return f(g.value, h.value) || g.index - h.index
  }
  for(var e = 0;e < b.length;e++) {
    b[e] = {index:e, value:b[e]}
  }var f = c || goog.array.defaultCompare;
  goog.array.sort(b, d);
  for(e = 0;e < b.length;e++) {
    b[e] = b[e].value
  }
};
goog.array.sortObjectsByKey = function(b, c, d) {
  var e = d || goog.array.defaultCompare;
  goog.array.sort(b, function(f, g) {
    return e(f[c], g[c])
  })
};
goog.array.equals = function(b, c, d) {
  if(!goog.isArrayLike(b) || !goog.isArrayLike(c) || b.length != c.length) {
    return false
  }var e = b.length;
  d = d || goog.array.defaultCompareEquality;
  for(var f = 0;f < e;f++) {
    if(!d(b[f], c[f])) {
      return false
    }
  }return true
};
goog.array.compare = function(b, c, d) {
  return goog.array.equals(b, c, d)
};
goog.array.defaultCompare = function(b, c) {
  return b > c ? 1 : b < c ? -1 : 0
};
goog.array.defaultCompareEquality = function(b, c) {
  return b === c
};
goog.array.binaryInsert = function(b, c, d) {
  d = goog.array.binarySearch(b, c, d);
  if(d < 0) {
    goog.array.insertAt(b, c, -(d + 1));
    return true
  }return false
};
goog.array.binaryRemove = function(b, c, d) {
  c = goog.array.binarySearch(b, c, d);
  return c >= 0 ? goog.array.removeAt(b, c) : false
};
goog.array.bucket = function(b, c) {
  for(var d = {}, e = 0;e < b.length;e++) {
    var f = b[e], g = c(f, e, b);
    if(goog.isDef(g)) {
      (d[g] || (d[g] = [])).push(f)
    }
  }return d
};
goog.array.repeat = function(b, c) {
  for(var d = [], e = 0;e < c;e++) {
    d[e] = b
  }return d
};
goog.array.flatten = function() {
  for(var b = [], c = 0;c < arguments.length;c++) {
    var d = arguments[c];
    goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d)
  }return b
};
goog.array.rotate = function(b, c) {
  if(b.length) {
    c %= b.length;
    if(c > 0) {
      goog.array.ARRAY_PROTOTYPE_.unshift.apply(b, b.splice(-c, c))
    }else {
      c < 0 && goog.array.ARRAY_PROTOTYPE_.push.apply(b, b.splice(0, -c))
    }
  }return b
};goog.debug = {};
goog.debug.errorHandlerWeakDep = {protectEntryPoint:function(b) {
  return b
}};goog.events = {};
goog.events.Event = function(b, c) {
  goog.Disposable.call(this);
  this.type = b;
  this.currentTarget = this.target = c
};
goog.inherits(goog.events.Event, goog.Disposable);
a = goog.events.Event.prototype;
a.disposeInternal = function() {
  delete this.type;
  delete this.target;
  delete this.currentTarget
};
a.propagationStopped_ = false;
a.returnValue_ = true;
a.stopPropagation = function() {
  this.propagationStopped_ = true
};
a.preventDefault = function() {
  this.returnValue_ = false
};
goog.events.Event.stopPropagation = function(b) {
  b.stopPropagation()
};
goog.events.Event.preventDefault = function(b) {
  b.preventDefault()
};goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(b, c) {
  return b.lastIndexOf(c, 0) == 0
};
goog.string.endsWith = function(b, c) {
  var d = b.length - c.length;
  return d >= 0 && b.indexOf(c, d) == d
};
goog.string.caseInsensitiveStartsWith = function(b, c) {
  return goog.string.caseInsensitiveCompare(c, b.substr(0, c.length)) == 0
};
goog.string.caseInsensitiveEndsWith = function(b, c) {
  return goog.string.caseInsensitiveCompare(c, b.substr(b.length - c.length, c.length)) == 0
};
goog.string.subs = function(b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = String(arguments[c]).replace(/\$/g, "$$$$");
    b = b.replace(/\%s/, d)
  }return b
};
goog.string.collapseWhitespace = function(b) {
  return b.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(b) {
  return/^[\s\xa0]*$/.test(b)
};
goog.string.isEmptySafe = function(b) {
  return goog.string.isEmpty(goog.string.makeSafe(b))
};
goog.string.isBreakingWhitespace = function(b) {
  return!/[^\t\n\r ]/.test(b)
};
goog.string.isAlpha = function(b) {
  return!/[^a-zA-Z]/.test(b)
};
goog.string.isNumeric = function(b) {
  return!/[^0-9]/.test(b)
};
goog.string.isAlphaNumeric = function(b) {
  return!/[^a-zA-Z0-9]/.test(b)
};
goog.string.isSpace = function(b) {
  return b == " "
};
goog.string.isUnicodeChar = function(b) {
  return b.length == 1 && b >= " " && b <= "~" || b >= "\u0080" && b <= "\ufffd"
};
goog.string.stripNewlines = function(b) {
  return b.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(b) {
  return b.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(b) {
  return b.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(b) {
  return b.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.trim = function(b) {
  return b.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(b) {
  return b.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(b) {
  return b.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(b, c) {
  b = String(b).toLowerCase();
  c = String(c).toLowerCase();
  return b < c ? -1 : b == c ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(b, c) {
  if(b == c) {
    return 0
  }if(!b) {
    return-1
  }if(!c) {
    return 1
  }for(var d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = c.toLowerCase().match(goog.string.numerateCompareRegExp_), f = Math.min(d.length, e.length), g = 0;g < f;g++) {
    var h = d[g], j = e[g];
    if(h != j) {
      b = parseInt(h, 10);
      if(!isNaN(b)) {
        c = parseInt(j, 10);
        if(!isNaN(c) && b - c) {
          return b - c
        }
      }return h < j ? -1 : 1
    }
  }if(d.length != e.length) {
    return d.length - e.length
  }return b < c ? -1 : 1
};
goog.string.encodeUriRegExp_ = /^[a-zA-Z0-9\-_.!~*'()]*$/;
goog.string.urlEncode = function(b) {
  b = String(b);
  if(!goog.string.encodeUriRegExp_.test(b)) {
    return encodeURIComponent(b)
  }return b
};
goog.string.urlDecode = function(b) {
  return decodeURIComponent(b.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(b, c) {
  return b.replace(/(\r\n|\r|\n)/g, c ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(b, c) {
  if(c) {
    return b.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;")
  }else {
    if(!goog.string.allRe_.test(b)) {
      return b
    }if(b.indexOf("&") != -1) {
      b = b.replace(goog.string.amperRe_, "&amp;")
    }if(b.indexOf("<") != -1) {
      b = b.replace(goog.string.ltRe_, "&lt;")
    }if(b.indexOf(">") != -1) {
      b = b.replace(goog.string.gtRe_, "&gt;")
    }if(b.indexOf('"') != -1) {
      b = b.replace(goog.string.quotRe_, "&quot;")
    }return b
  }
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(b) {
  if(goog.string.contains(b, "&")) {
    return"document" in goog.global && !goog.string.contains(b, "<") ? goog.string.unescapeEntitiesUsingDom_(b) : goog.string.unescapePureXmlEntities_(b)
  }return b
};
goog.string.unescapeEntitiesUsingDom_ = function(b) {
  var c = goog.global.document.createElement("a");
  c.innerHTML = b;
  c[goog.string.NORMALIZE_FN_] && c[goog.string.NORMALIZE_FN_]();
  b = c.firstChild.nodeValue;
  c.innerHTML = "";
  return b
};
goog.string.unescapePureXmlEntities_ = function(b) {
  return b.replace(/&([^;]+);/g, function(c, d) {
    switch(d) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if(d.charAt(0) == "#") {
          d = Number("0" + d.substr(1));
          if(!isNaN(d)) {
            return String.fromCharCode(d)
          }
        }return c
    }
  })
};
goog.string.NORMALIZE_FN_ = "normalize";
goog.string.whitespaceEscape = function(b, c) {
  return goog.string.newLineToBr(b.replace(/  /g, " &#160;"), c)
};
goog.string.stripQuotes = function(b, c) {
  for(var d = c.length, e = 0;e < d;e++) {
    var f = d == 1 ? c : c.charAt(e);
    if(b.charAt(0) == f && b.charAt(b.length - 1) == f) {
      return b.substring(1, b.length - 1)
    }
  }return b
};
goog.string.truncate = function(b, c, d) {
  if(d) {
    b = goog.string.unescapeEntities(b)
  }if(b.length > c) {
    b = b.substring(0, c - 3) + "..."
  }if(d) {
    b = goog.string.htmlEscape(b)
  }return b
};
goog.string.truncateMiddle = function(b, c, d) {
  if(d) {
    b = goog.string.unescapeEntities(b)
  }if(b.length > c) {
    var e = Math.floor(c / 2), f = b.length - e;
    e += c % 2;
    b = b.substring(0, e) + "..." + b.substring(f)
  }if(d) {
    b = goog.string.htmlEscape(b)
  }return b
};
goog.string.jsEscapeCache_ = {"\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\x0B", '"':'\\"', "'":"\\'", "\\":"\\\\"};
goog.string.quote = function(b) {
  b = String(b);
  if(b.quote) {
    return b.quote()
  }else {
    for(var c = ['"'], d = 0;d < b.length;d++) {
      c[d + 1] = goog.string.escapeChar(b.charAt(d))
    }c.push('"');
    return c.join("")
  }
};
goog.string.escapeChar = function(b) {
  if(b in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[b]
  }var c = b, d = b.charCodeAt(0);
  if(d > 31 && d < 127) {
    c = b
  }else {
    if(d < 256) {
      c = "\\x";
      if(d < 16 || d > 256) {
        c += "0"
      }
    }else {
      c = "\\u";
      if(d < 4096) {
        c += "0"
      }
    }c += d.toString(16).toUpperCase()
  }return goog.string.jsEscapeCache_[b] = c
};
goog.string.toMap = function(b) {
  for(var c = {}, d = 0;d < b.length;d++) {
    c[b.charAt(d)] = true
  }return c
};
goog.string.contains = function(b, c) {
  return b.indexOf(c) != -1
};
goog.string.removeAt = function(b, c, d) {
  var e = b;
  if(c >= 0 && c < b.length && d > 0) {
    e = b.substr(0, c) + b.substr(c + d, b.length - c - d)
  }return e
};
goog.string.remove = function(b, c) {
  c = new RegExp(goog.string.regExpEscape(c), "");
  return b.replace(c, "")
};
goog.string.removeAll = function(b, c) {
  c = new RegExp(goog.string.regExpEscape(c), "g");
  return b.replace(c, "")
};
goog.string.regExpEscape = function(b) {
  return String(b).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(b, c) {
  return(new Array(c + 1)).join(b)
};
goog.string.padNumber = function(b, c, d) {
  b = goog.isDef(d) ? b.toFixed(d) : String(b);
  d = b.indexOf(".");
  if(d == -1) {
    d = b.length
  }return goog.string.repeat("0", Math.max(0, c - d)) + b
};
goog.string.makeSafe = function(b) {
  return b == null ? "" : String(b)
};
goog.string.buildString = function() {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  return Math.floor(Math.random() * 2147483648).toString(36) + (Math.floor(Math.random() * 2147483648) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(b, c) {
  var d = 0;
  b = goog.string.trim(String(b)).split(".");
  c = goog.string.trim(String(c)).split(".");
  for(var e = Math.max(b.length, c.length), f = 0;d == 0 && f < e;f++) {
    var g = b[f] || "", h = c[f] || "", j = new RegExp("(\\d*)(\\D*)", "g"), k = new RegExp("(\\d*)(\\D*)", "g");
    do {
      var l = j.exec(g) || ["", "", ""], m = k.exec(h) || ["", "", ""];
      if(l[0].length == 0 && m[0].length == 0) {
        break
      }d = l[1].length == 0 ? 0 : parseInt(l[1], 10);
      var n = m[1].length == 0 ? 0 : parseInt(m[1], 10);
      d = goog.string.compareElements_(d, n) || goog.string.compareElements_(l[2].length == 0, m[2].length == 0) || goog.string.compareElements_(l[2], m[2])
    }while(d == 0)
  }return d
};
goog.string.compareElements_ = function(b, c) {
  if(b < c) {
    return-1
  }else {
    if(b > c) {
      return 1
    }
  }return 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(b) {
  for(var c = 0, d = 0;d < b.length;++d) {
    c = 31 * c + b.charCodeAt(d);
    c %= goog.string.HASHCODE_MAX_
  }return c
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(b) {
  var c = Number(b);
  if(c == 0 && goog.string.isEmpty(b)) {
    return NaN
  }return c
};goog.userAgent = {};
goog.userAgent.ASSUME_IE = false;
goog.userAgent.ASSUME_GECKO = false;
goog.userAgent.ASSUME_WEBKIT = false;
goog.userAgent.ASSUME_MOBILE_WEBKIT = false;
goog.userAgent.ASSUME_OPERA = false;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.global.navigator ? goog.global.navigator.userAgent : null
};
goog.userAgent.getNavigator = function() {
  return goog.global.navigator
};
goog.userAgent.init_ = function() {
  goog.userAgent.detectedOpera_ = false;
  goog.userAgent.detectedIe_ = false;
  goog.userAgent.detectedWebkit_ = false;
  goog.userAgent.detectedMobile_ = false;
  goog.userAgent.detectedGecko_ = false;
  var b;
  if(!goog.userAgent.BROWSER_KNOWN_ && (b = goog.userAgent.getUserAgentString())) {
    var c = goog.userAgent.getNavigator();
    goog.userAgent.detectedOpera_ = b.indexOf("Opera") == 0;
    goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && b.indexOf("MSIE") != -1;
    goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ && b.indexOf("WebKit") != -1;
    goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && b.indexOf("Mobile") != -1;
    goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && c.product == "Gecko"
  }
};
goog.userAgent.BROWSER_KNOWN_ || goog.userAgent.init_();
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.detectedMobile_;
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var b = goog.userAgent.getNavigator();
  return b && b.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = false;
goog.userAgent.ASSUME_WINDOWS = false;
goog.userAgent.ASSUME_LINUX = false;
goog.userAgent.ASSUME_X11 = false;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11;
goog.userAgent.initPlatform_ = function() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11")
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.determineVersion_ = function() {
  var b = "", c;
  if(goog.userAgent.OPERA && goog.global.opera) {
    b = goog.global.opera.version;
    b = typeof b == "function" ? b() : b
  }else {
    if(goog.userAgent.GECKO) {
      c = /rv\:([^\);]+)(\)|;)/
    }else {
      if(goog.userAgent.IE) {
        c = /MSIE\s+([^\);]+)(\)|;)/
      }else {
        if(goog.userAgent.WEBKIT) {
          c = /WebKit\/(\S+)/
        }
      }
    }if(c) {
      b = (b = c.exec(goog.userAgent.getUserAgentString())) ? b[1] : ""
    }
  }return b
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(b, c) {
  return goog.string.compareVersions(b, c)
};
goog.userAgent.isVersionCache_ = {};
goog.userAgent.isVersion = function(b) {
  return goog.userAgent.isVersionCache_[b] || (goog.userAgent.isVersionCache_[b] = goog.string.compareVersions(goog.userAgent.VERSION, b) >= 0)
};goog.events.BrowserEvent = function(b, c) {
  b && this.init(b, c)
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap_ = [1, 4, 2];
a = goog.events.BrowserEvent.prototype;
a.target = null;
a.relatedTarget = null;
a.offsetX = 0;
a.offsetY = 0;
a.clientX = 0;
a.clientY = 0;
a.screenX = 0;
a.screenY = 0;
a.button = 0;
a.keyCode = 0;
a.charCode = 0;
a.ctrlKey = false;
a.altKey = false;
a.shiftKey = false;
a.metaKey = false;
a.platformModifierKey = false;
a.event_ = null;
a.init = function(b, c) {
  var d = this.type = b.type;
  this.target = b.target || b.srcElement;
  this.currentTarget = c;
  if(c = b.relatedTarget) {
    if(goog.userAgent.GECKO) {
      try {
        c = c.nodeName && c
      }catch(e) {
        c = null
      }
    }
  }else {
    if(d == "mouseover") {
      c = b.fromElement
    }else {
      if(d == "mouseout") {
        c = b.toElement
      }
    }
  }this.relatedTarget = c;
  this.offsetX = b.offsetX !== undefined ? b.offsetX : b.layerX;
  this.offsetY = b.offsetY !== undefined ? b.offsetY : b.layerY;
  this.clientX = b.clientX !== undefined ? b.clientX : b.pageX;
  this.clientY = b.clientY !== undefined ? b.clientY : b.pageY;
  this.screenX = b.screenX || 0;
  this.screenY = b.screenY || 0;
  this.button = b.button;
  this.keyCode = b.keyCode || 0;
  this.charCode = b.charCode || (d == "keypress" ? b.keyCode : 0);
  this.ctrlKey = b.ctrlKey;
  this.altKey = b.altKey;
  this.shiftKey = b.shiftKey;
  this.metaKey = b.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? b.metaKey : b.ctrlKey;
  this.event_ = b;
  delete this.returnValue_;
  delete this.propagationStopped_
};
a.isButton = function(b) {
  return goog.userAgent.IE ? this.type == "click" ? b == goog.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & goog.events.BrowserEvent.IEButtonMap_[b]) : this.event_.button == b
};
a.stopPropagation = function() {
  this.propagationStopped_ = true;
  if(this.event_.stopPropagation) {
    this.event_.stopPropagation()
  }else {
    this.event_.cancelBubble = true
  }
};
goog.events.BrowserEvent.IE7_SET_KEY_CODE_TO_PREVENT_DEFAULT_ = goog.userAgent.IE && !goog.userAgent.isVersion("8");
goog.events.BrowserEvent.prototype.preventDefault = function() {
  this.returnValue_ = false;
  var b = this.event_;
  if(b.preventDefault) {
    b.preventDefault()
  }else {
    b.returnValue = false;
    if(goog.events.BrowserEvent.IE7_SET_KEY_CODE_TO_PREVENT_DEFAULT_) {
      try {
        if(b.ctrlKey || b.keyCode >= 112 && b.keyCode <= 123) {
          b.keyCode = -1
        }
      }catch(c) {
      }
    }
  }
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
  return this.event_
};
goog.events.BrowserEvent.prototype.disposeInternal = function() {
  goog.events.BrowserEvent.superClass_.disposeInternal.call(this);
  this.relatedTarget = this.currentTarget = this.target = this.event_ = null
};goog.events.EventWrapper = function() {
};
goog.events.EventWrapper.prototype.listen = function() {
};
goog.events.EventWrapper.prototype.unlisten = function() {
};goog.events.Listener = function() {
};
goog.events.Listener.counter_ = 0;
a = goog.events.Listener.prototype;
a.key = 0;
a.removed = false;
a.callOnce = false;
a.init = function(b, c, d, e, f, g) {
  if(goog.isFunction(b)) {
    this.isFunctionListener_ = true
  }else {
    if(b && b.handleEvent && goog.isFunction(b.handleEvent)) {
      this.isFunctionListener_ = false
    }else {
      throw Error("Invalid listener argument");
    }
  }this.listener = b;
  this.proxy = c;
  this.src = d;
  this.type = e;
  this.capture = !!f;
  this.handler = g;
  this.callOnce = false;
  this.key = ++goog.events.Listener.counter_;
  this.removed = false
};
a.handleEvent = function(b) {
  if(this.isFunctionListener_) {
    return this.listener.call(this.handler || this.src, b)
  }return this.listener.handleEvent.call(this.listener, b)
};goog.structs = {};
goog.structs.SimplePool = function(b, c) {
  goog.Disposable.call(this);
  this.maxCount_ = c;
  this.freeQueue_ = [];
  this.createInitial_(b)
};
goog.inherits(goog.structs.SimplePool, goog.Disposable);
a = goog.structs.SimplePool.prototype;
a.createObjectFn_ = null;
a.disposeObjectFn_ = null;
a.setCreateObjectFn = function(b) {
  this.createObjectFn_ = b
};
a.setDisposeObjectFn = function(b) {
  this.disposeObjectFn_ = b
};
a.getObject = function() {
  if(this.freeQueue_.length) {
    return this.freeQueue_.pop()
  }return this.createObject()
};
a.releaseObject = function(b) {
  this.freeQueue_.length < this.maxCount_ ? this.freeQueue_.push(b) : this.disposeObject(b)
};
a.createInitial_ = function(b) {
  if(b > this.maxCount_) {
    throw Error("[goog.structs.SimplePool] Initial cannot be greater than max");
  }for(var c = 0;c < b;c++) {
    this.freeQueue_.push(this.createObject())
  }
};
a.createObject = function() {
  return this.createObjectFn_ ? this.createObjectFn_() : {}
};
a.disposeObject = function(b) {
  if(this.disposeObjectFn_) {
    this.disposeObjectFn_(b)
  }else {
    if(goog.isFunction(b.dispose)) {
      b.dispose()
    }else {
      for(var c in b) {
        delete b[c]
      }
    }
  }
};
a.disposeInternal = function() {
  goog.structs.SimplePool.superClass_.disposeInternal.call(this);
  for(var b = this.freeQueue_;b.length;) {
    this.disposeObject(b.pop())
  }delete this.freeQueue_
};goog.userAgent.jscript = {};
goog.userAgent.jscript.ASSUME_NO_JSCRIPT = false;
goog.userAgent.jscript.init_ = function() {
  goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ = "ScriptEngine" in goog.global && goog.global.ScriptEngine() == "JScript";
  goog.userAgent.jscript.DETECTED_VERSION_ = goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ ? goog.global.ScriptEngineMajorVersion() + "." + goog.global.ScriptEngineMinorVersion() + "." + goog.global.ScriptEngineBuildVersion() : "0"
};
goog.userAgent.jscript.ASSUME_NO_JSCRIPT || goog.userAgent.jscript.init_();
goog.userAgent.jscript.HAS_JSCRIPT = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? false : goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_;
goog.userAgent.jscript.VERSION = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? "0" : goog.userAgent.jscript.DETECTED_VERSION_;
goog.userAgent.jscript.isVersion = function(b) {
  return goog.string.compareVersions(goog.userAgent.jscript.VERSION, b) >= 0
};goog.events.pools = {};
(function() {
  function b() {
    return{count_:0, remaining_:0}
  }
  function c() {
    return[]
  }
  function d() {
    var o = function(p) {
      return h.call(o.src, o.key, p)
    };
    return o
  }
  function e() {
    return new goog.events.Listener
  }
  function f() {
    return new goog.events.BrowserEvent
  }
  var g = goog.userAgent.jscript.HAS_JSCRIPT && !goog.userAgent.jscript.isVersion("5.7"), h;
  goog.events.pools.setProxyCallbackFunction = function(o) {
    h = o
  };
  if(g) {
    goog.events.pools.getObject = function() {
      return j.getObject()
    };
    goog.events.pools.releaseObject = function(o) {
      j.releaseObject(o)
    };
    goog.events.pools.getArray = function() {
      return k.getObject()
    };
    goog.events.pools.releaseArray = function(o) {
      k.releaseObject(o)
    };
    goog.events.pools.getProxy = function() {
      return l.getObject()
    };
    goog.events.pools.releaseProxy = function() {
      l.releaseObject(d())
    };
    goog.events.pools.getListener = function() {
      return m.getObject()
    };
    goog.events.pools.releaseListener = function(o) {
      m.releaseObject(o)
    };
    goog.events.pools.getEvent = function() {
      return n.getObject()
    };
    goog.events.pools.releaseEvent = function(o) {
      n.releaseObject(o)
    };
    var j = new goog.structs.SimplePool(0, 600);
    j.setCreateObjectFn(b);
    var k = new goog.structs.SimplePool(0, 600);
    k.setCreateObjectFn(c);
    var l = new goog.structs.SimplePool(0, 600);
    l.setCreateObjectFn(d);
    var m = new goog.structs.SimplePool(0, 600);
    m.setCreateObjectFn(e);
    var n = new goog.structs.SimplePool(0, 600);
    n.setCreateObjectFn(f)
  }else {
    goog.events.pools.getObject = b;
    goog.events.pools.releaseObject = goog.nullFunction;
    goog.events.pools.getArray = c;
    goog.events.pools.releaseArray = goog.nullFunction;
    goog.events.pools.getProxy = d;
    goog.events.pools.releaseProxy = goog.nullFunction;
    goog.events.pools.getListener = e;
    goog.events.pools.releaseListener = goog.nullFunction;
    goog.events.pools.getEvent = f;
    goog.events.pools.releaseEvent = goog.nullFunction
  }
})();goog.object = {};
goog.object.forEach = function(b, c, d) {
  for(var e in b) {
    c.call(d, b[e], e, b)
  }
};
goog.object.filter = function(b, c, d) {
  var e = {};
  for(var f in b) {
    if(c.call(d, b[f], f, b)) {
      e[f] = b[f]
    }
  }return e
};
goog.object.map = function(b, c, d) {
  var e = {};
  for(var f in b) {
    e[f] = c.call(d, b[f], f, b)
  }return e
};
goog.object.some = function(b, c, d) {
  for(var e in b) {
    if(c.call(d, b[e], e, b)) {
      return true
    }
  }return false
};
goog.object.every = function(b, c, d) {
  for(var e in b) {
    if(!c.call(d, b[e], e, b)) {
      return false
    }
  }return true
};
goog.object.getCount = function(b) {
  var c = 0;
  for(var d in b) {
    c++
  }return c
};
goog.object.getAnyKey = function(b) {
  for(var c in b) {
    return c
  }
};
goog.object.getAnyValue = function(b) {
  for(var c in b) {
    return b[c]
  }
};
goog.object.contains = function(b, c) {
  return goog.object.containsValue(b, c)
};
goog.object.getValues = function(b) {
  var c = [], d = 0;
  for(var e in b) {
    c[d++] = b[e]
  }return c
};
goog.object.getKeys = function(b) {
  var c = [], d = 0;
  for(var e in b) {
    c[d++] = e
  }return c
};
goog.object.containsKey = function(b, c) {
  return c in b
};
goog.object.containsValue = function(b, c) {
  for(var d in b) {
    if(b[d] == c) {
      return true
    }
  }return false
};
goog.object.findKey = function(b, c, d) {
  for(var e in b) {
    if(c.call(d, b[e], e, b)) {
      return e
    }
  }
};
goog.object.findValue = function(b, c, d) {
  return(c = goog.object.findKey(b, c, d)) && b[c]
};
goog.object.isEmpty = function(b) {
  for(var c in b) {
    return false
  }return true
};
goog.object.clear = function(b) {
  for(var c = goog.object.getKeys(b), d = c.length - 1;d >= 0;d--) {
    goog.object.remove(b, c[d])
  }
};
goog.object.remove = function(b, c) {
  var d;
  if(d = c in b) {
    delete b[c]
  }return d
};
goog.object.add = function(b, c, d) {
  if(c in b) {
    throw Error('The object already contains the key "' + c + '"');
  }goog.object.set(b, c, d)
};
goog.object.get = function(b, c, d) {
  if(c in b) {
    return b[c]
  }return d
};
goog.object.set = function(b, c, d) {
  b[c] = d
};
goog.object.setIfUndefined = function(b, c, d) {
  return c in b ? b[c] : (b[c] = d)
};
goog.object.clone = function(b) {
  var c = {};
  for(var d in b) {
    c[d] = b[d]
  }return c
};
goog.object.transpose = function(b) {
  var c = {};
  for(var d in b) {
    c[b[d]] = d
  }return c
};
goog.object.PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.object.extend = function(b) {
  for(var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for(c in d) {
      b[c] = d[c]
    }for(var f = 0;f < goog.object.PROTOTYPE_FIELDS_.length;f++) {
      c = goog.object.PROTOTYPE_FIELDS_[f];
      if(Object.prototype.hasOwnProperty.call(d, c)) {
        b[c] = d[c]
      }
    }
  }
};
goog.object.create = function() {
  var b = arguments.length;
  if(b == 1 && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }if(b % 2) {
    throw Error("Uneven number of arguments");
  }for(var c = {}, d = 0;d < b;d += 2) {
    c[arguments[d]] = arguments[d + 1]
  }return c
};
goog.object.createSet = function() {
  var b = arguments.length;
  if(b == 1 && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }for(var c = {}, d = 0;d < b;d++) {
    c[arguments[d]] = true
  }return c
};goog.events.listeners_ = {};
goog.events.listenerTree_ = {};
goog.events.sources_ = {};
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.keySeparator_ = "_";
goog.events.listen = function(b, c, d, e, f) {
  if(c) {
    if(goog.isArray(c)) {
      for(var g = 0;g < c.length;g++) {
        goog.events.listen(b, c[g], d, e, f)
      }return null
    }else {
      e = !!e;
      var h = goog.events.listenerTree_;
      c in h || (h[c] = goog.events.pools.getObject());
      h = h[c];
      if(!(e in h)) {
        h[e] = goog.events.pools.getObject();
        h.count_++
      }h = h[e];
      var j = goog.getUid(b), k;
      h.remaining_++;
      if(h[j]) {
        k = h[j];
        for(g = 0;g < k.length;g++) {
          h = k[g];
          if(h.listener == d && h.handler == f) {
            if(h.removed) {
              break
            }return k[g].key
          }
        }
      }else {
        k = h[j] = goog.events.pools.getArray();
        h.count_++
      }g = goog.events.pools.getProxy();
      g.src = b;
      h = goog.events.pools.getListener();
      h.init(d, g, b, c, e, f);
      d = h.key;
      g.key = d;
      k.push(h);
      goog.events.listeners_[d] = h;
      goog.events.sources_[j] || (goog.events.sources_[j] = goog.events.pools.getArray());
      goog.events.sources_[j].push(h);
      if(b.addEventListener) {
        if(b == goog.global || !b.customEvent_) {
          b.addEventListener(c, g, e)
        }
      }else {
        b.attachEvent(goog.events.getOnString_(c), g)
      }return d
    }
  }else {
    throw Error("Invalid event type");
  }
};
goog.events.listenOnce = function(b, c, d, e, f) {
  if(goog.isArray(c)) {
    for(var g = 0;g < c.length;g++) {
      goog.events.listenOnce(b, c[g], d, e, f)
    }return null
  }b = goog.events.listen(b, c, d, e, f);
  goog.events.listeners_[b].callOnce = true;
  return b
};
goog.events.listenWithWrapper = function(b, c, d, e, f) {
  c.listen(b, d, e, f)
};
goog.events.unlisten = function(b, c, d, e, f) {
  if(goog.isArray(c)) {
    for(var g = 0;g < c.length;g++) {
      goog.events.unlisten(b, c[g], d, e, f)
    }return null
  }e = !!e;
  b = goog.events.getListeners_(b, c, e);
  if(!b) {
    return false
  }for(g = 0;g < b.length;g++) {
    if(b[g].listener == d && b[g].capture == e && b[g].handler == f) {
      return goog.events.unlistenByKey(b[g].key)
    }
  }return false
};
goog.events.unlistenByKey = function(b) {
  if(!goog.events.listeners_[b]) {
    return false
  }var c = goog.events.listeners_[b];
  if(c.removed) {
    return false
  }var d = c.src, e = c.type, f = c.proxy, g = c.capture;
  if(d.removeEventListener) {
    if(d == goog.global || !d.customEvent_) {
      d.removeEventListener(e, f, g)
    }
  }else {
    d.detachEvent && d.detachEvent(goog.events.getOnString_(e), f)
  }d = goog.getUid(d);
  f = goog.events.listenerTree_[e][g][d];
  if(goog.events.sources_[d]) {
    var h = goog.events.sources_[d];
    goog.array.remove(h, c);
    h.length == 0 && delete goog.events.sources_[d]
  }c.removed = true;
  f.needsCleanup_ = true;
  goog.events.cleanUp_(e, g, d, f);
  delete goog.events.listeners_[b];
  return true
};
goog.events.unlistenWithWrapper = function(b, c, d, e, f) {
  c.unlisten(b, d, e, f)
};
goog.events.cleanUp_ = function(b, c, d, e) {
  if(!e.locked_) {
    if(e.needsCleanup_) {
      for(var f = 0, g = 0;f < e.length;f++) {
        if(e[f].removed) {
          var h = e[f].proxy;
          h.src = null;
          goog.events.pools.releaseProxy(h);
          goog.events.pools.releaseListener(e[f])
        }else {
          if(f != g) {
            e[g] = e[f]
          }g++
        }
      }e.length = g;
      e.needsCleanup_ = false;
      if(g == 0) {
        goog.events.pools.releaseArray(e);
        delete goog.events.listenerTree_[b][c][d];
        goog.events.listenerTree_[b][c].count_--;
        if(goog.events.listenerTree_[b][c].count_ == 0) {
          goog.events.pools.releaseObject(goog.events.listenerTree_[b][c]);
          delete goog.events.listenerTree_[b][c];
          goog.events.listenerTree_[b].count_--
        }if(goog.events.listenerTree_[b].count_ == 0) {
          goog.events.pools.releaseObject(goog.events.listenerTree_[b]);
          delete goog.events.listenerTree_[b]
        }
      }
    }
  }
};
goog.events.removeAll = function(b, c, d) {
  var e = 0, f = b == null, g = c == null, h = d == null;
  d = !!d;
  if(f) {
    goog.object.forEach(goog.events.sources_, function(k) {
      for(var l = k.length - 1;l >= 0;l--) {
        var m = k[l];
        if((g || c == m.type) && (h || d == m.capture)) {
          goog.events.unlistenByKey(m.key);
          e++
        }
      }
    })
  }else {
    b = goog.getUid(b);
    if(goog.events.sources_[b]) {
      b = goog.events.sources_[b];
      for(f = b.length - 1;f >= 0;f--) {
        var j = b[f];
        if((g || c == j.type) && (h || d == j.capture)) {
          goog.events.unlistenByKey(j.key);
          e++
        }
      }
    }
  }return e
};
goog.events.getListeners = function(b, c, d) {
  return goog.events.getListeners_(b, c, d) || []
};
goog.events.getListeners_ = function(b, c, d) {
  var e = goog.events.listenerTree_;
  if(c in e) {
    e = e[c];
    if(d in e) {
      e = e[d];
      b = goog.getUid(b);
      if(e[b]) {
        return e[b]
      }
    }
  }return null
};
goog.events.getListener = function(b, c, d, e, f) {
  e = !!e;
  if(b = goog.events.getListeners_(b, c, e)) {
    for(c = 0;c < b.length;c++) {
      if(b[c].listener == d && b[c].capture == e && b[c].handler == f) {
        return b[c]
      }
    }
  }return null
};
goog.events.hasListener = function(b, c, d) {
  b = goog.getUid(b);
  var e = goog.events.sources_[b];
  if(e) {
    var f = goog.isDef(c), g = goog.isDef(d);
    if(f && g) {
      e = goog.events.listenerTree_[c];
      return!!e && !!e[d] && b in e[d]
    }else {
      return f || g ? goog.array.some(e, function(h) {
        return f && h.type == c || g && h.capture == d
      }) : true
    }
  }return false
};
goog.events.expose = function(b) {
  var c = [];
  for(var d in b) {
    b[d] && b[d].id ? c.push(d + " = " + b[d] + " (" + b[d].id + ")") : c.push(d + " = " + b[d])
  }return c.join("\n")
};
goog.events.EventType = {CLICK:"click", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", SELECTSTART:"selectstart", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ? "focusout" : "DOMFocusOut", CHANGE:"change", SELECT:"select", SUBMIT:"submit", CONTEXTMENU:"contextmenu", DRAGSTART:"dragstart", 
ERROR:"error", HASHCHANGE:"hashchange", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload"};
goog.events.getOnString_ = function(b) {
  if(b in goog.events.onStringMap_) {
    return goog.events.onStringMap_[b]
  }return goog.events.onStringMap_[b] = goog.events.onString_ + b
};
goog.events.fireListeners = function(b, c, d, e) {
  var f = goog.events.listenerTree_;
  if(c in f) {
    f = f[c];
    if(d in f) {
      return goog.events.fireListeners_(f[d], b, c, d, e)
    }
  }return true
};
goog.events.fireListeners_ = function(b, c, d, e, f) {
  var g = 1;
  c = goog.getUid(c);
  if(b[c]) {
    b.remaining_--;
    b = b[c];
    if(b.locked_) {
      b.locked_++
    }else {
      b.locked_ = 1
    }try {
      for(var h = b.length, j = 0;j < h;j++) {
        var k = b[j];
        if(k && !k.removed) {
          g &= goog.events.fireListener(k, f) !== false
        }
      }
    }finally {
      b.locked_--;
      goog.events.cleanUp_(d, e, c, b)
    }
  }return Boolean(g)
};
goog.events.fireListener = function(b, c) {
  c = b.handleEvent(c);
  b.callOnce && goog.events.unlistenByKey(b.key);
  return c
};
goog.events.getTotalListenerCount = function() {
  return goog.object.getCount(goog.events.listeners_)
};
goog.events.dispatchEvent = function(b, c) {
  if(goog.isString(c)) {
    c = new goog.events.Event(c, b)
  }else {
    if(c instanceof goog.events.Event) {
      c.target = c.target || b
    }else {
      var d = c;
      c = new goog.events.Event(c.type, b);
      goog.object.extend(c, d)
    }
  }d = 1;
  var e, f = c.type, g = goog.events.listenerTree_;
  if(!(f in g)) {
    return true
  }g = g[f];
  f = true in g;
  var h;
  if(f) {
    e = [];
    for(h = b;h;h = h.getParentEventTarget()) {
      e.push(h)
    }h = g[true];
    h.remaining_ = h.count_;
    for(var j = e.length - 1;!c.propagationStopped_ && j >= 0 && h.remaining_;j--) {
      c.currentTarget = e[j];
      d &= goog.events.fireListeners_(h, e[j], c.type, true, c) && c.returnValue_ != false
    }
  }if(false in g) {
    h = g[false];
    h.remaining_ = h.count_;
    if(f) {
      for(j = 0;!c.propagationStopped_ && j < e.length && h.remaining_;j++) {
        c.currentTarget = e[j];
        d &= goog.events.fireListeners_(h, e[j], c.type, false, c) && c.returnValue_ != false
      }
    }else {
      for(b = b;!c.propagationStopped_ && b && h.remaining_;b = b.getParentEventTarget()) {
        c.currentTarget = b;
        d &= goog.events.fireListeners_(h, b, c.type, false, c) && c.returnValue_ != false
      }
    }
  }return Boolean(d)
};
goog.events.protectBrowserEventEntryPoint = function(b, c) {
  goog.events.handleBrowserEvent_ = b.protectEntryPoint(goog.events.handleBrowserEvent_, c);
  goog.events.pools.setProxyCallbackFunction(goog.events.handleBrowserEvent_)
};
goog.events.handleBrowserEvent_ = function(b, c) {
  if(!goog.events.listeners_[b]) {
    return true
  }b = goog.events.listeners_[b];
  var d = b.type, e = goog.events.listenerTree_;
  if(!(d in e)) {
    return true
  }e = e[d];
  var f, g;
  if(goog.userAgent.IE) {
    f = c || goog.getObjectByName("window.event");
    c = true in e;
    var h = false in e;
    if(c) {
      if(goog.events.isMarkedIeEvent_(f)) {
        return true
      }goog.events.markIeEvent_(f)
    }var j = goog.events.pools.getEvent();
    j.init(f, this);
    f = true;
    try {
      if(c) {
        for(var k = goog.events.pools.getArray(), l = j.currentTarget;l;l = l.parentNode) {
          k.push(l)
        }g = e[true];
        g.remaining_ = g.count_;
        for(var m = k.length - 1;!j.propagationStopped_ && m >= 0 && g.remaining_;m--) {
          j.currentTarget = k[m];
          f &= goog.events.fireListeners_(g, k[m], d, true, j)
        }if(h) {
          g = e[false];
          g.remaining_ = g.count_;
          for(m = 0;!j.propagationStopped_ && m < k.length && g.remaining_;m++) {
            j.currentTarget = k[m];
            f &= goog.events.fireListeners_(g, k[m], d, false, j)
          }
        }
      }else {
        f = goog.events.fireListener(b, j)
      }
    }finally {
      if(k) {
        k.length = 0;
        goog.events.pools.releaseArray(k)
      }j.dispose();
      goog.events.pools.releaseEvent(j)
    }return f
  }g = new goog.events.BrowserEvent(c, this);
  try {
    f = goog.events.fireListener(b, g)
  }finally {
    g.dispose()
  }return f
};
goog.events.pools.setProxyCallbackFunction(goog.events.handleBrowserEvent_);
goog.events.markIeEvent_ = function(b) {
  var c = false;
  if(b.keyCode == 0) {
    try {
      b.keyCode = -1;
      return
    }catch(d) {
      c = true
    }
  }if(c || b.returnValue == undefined) {
    b.returnValue = true
  }
};
goog.events.isMarkedIeEvent_ = function(b) {
  return b.keyCode < 0 || b.returnValue != undefined
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(b) {
  return b + "_" + goog.events.uniqueIdCounter_++
};goog.events.EventTarget = function() {
  goog.Disposable.call(this)
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
a = goog.events.EventTarget.prototype;
a.customEvent_ = true;
a.parentEventTarget_ = null;
a.getParentEventTarget = function() {
  return this.parentEventTarget_
};
a.setParentEventTarget = function(b) {
  this.parentEventTarget_ = b
};
a.addEventListener = function(b, c, d, e) {
  goog.events.listen(this, b, c, d, e)
};
a.removeEventListener = function(b, c, d, e) {
  goog.events.unlisten(this, b, c, d, e)
};
a.dispatchEvent = function(b) {
  return goog.events.dispatchEvent(this, b)
};
a.disposeInternal = function() {
  goog.events.EventTarget.superClass_.disposeInternal.call(this);
  goog.events.removeAll(this);
  this.parentEventTarget_ = null
};var jchemhub = {};
jchemhub.view = {};
jchemhub.view.Drawing = function() {
  goog.events.EventTarget.call(this);
  this._parent = null;
  this._children = [];
  this._transform = this._config = this._group = null;
  this._elements = [];
  this.handler = new goog.events.EventHandler(this)
};
goog.inherits(jchemhub.view.Drawing, goog.events.EventTarget);
a = jchemhub.view.Drawing.prototype;
a.renderChildren = function() {
  goog.array.forEach(this.getChildren(), function(b) {
    b.render()
  }, this)
};
a.layout = function(b) {
  var c = this.getRect(), d = c.getSize().scaleToFit(b.getSize()).width / c.width;
  this.setTransform(new goog.graphics.AffineTransform(d, 0, 0, d, b.left - c.left * d, b.top - c.top * d));
  this.layoutChildren(b)
};
a.getCoords = function() {
  var b = [];
  goog.array.forEach(this.getChildren(), function(c) {
    b.push.apply(b, c.getCoords())
  });
  return b
};
a.getBoundingBox = function() {
  return goog.math.Box.boundingBox.apply(null, this.getCoords())
};
a.getRect = function() {
  var b = this.getBoundingBox();
  return goog.math.Rect.createFromBox(b)
};
a.getSize = function() {
  return this.getRect().getSize()
};
a.getTotalChildrenWidth = function() {
  return goog.array.reduce(this.getChildren(), function(b, c) {
    return b + c.getSize().width
  }, 0)
};
a.getMaxChildrenHeight = function() {
  return goog.array.reduce(this.getChildren(), function(b, c) {
    return Math.max(b, c.getSize().height)
  }, 0)
};
a.layoutChildren = function(b) {
  goog.array.forEach(this.getChildren(), function(c) {
    c.layout(b)
  })
};
a.getChildren = function() {
  return this._children
};
a.add = function(b) {
  b.setParent(this);
  this._children.push(b)
};
a.removeChild = function(b) {
  if(b.getParent() != this) {
    throw Error("Can only remove children");
  }goog.array.remove(this._children, b);
  b.setParent(null);
  return b
};
a.getGraphics = function() {
  if(!this._graphics) {
    this._graphics = this.getParent().getGraphics()
  }return this._graphics
};
a.getParent = function() {
  return this._parent
};
a.setParent = function(b) {
  if(this == b) {
    throw Error(jchemhub.view.Drawing.PARENT_UNABLE_TO_BE_SET);
  }this._parent && this._parent != b && this._parent.removeChild(this);
  this._parent = b;
  this.setParentEventTarget(b)
};
a.getGroup = function() {
  if(!this._group) {
    var b = this.getGraphics().createGroup();
    this._group = b;
    this._group.drawing = this;
    this._group.setParentEventTarget(this);
    this.handler.listen(b, [goog.events.EventType.MOUSEOVER, b, goog.events.EventType.MOUSEOUT, goog.events.EventType.CLICK, goog.events.EventType.MOUSEDOWN], this._bubble)
  }return this._group
};
a._bubble = function(b) {
  this.dispatchEvent(b)
};
a.getConfig = function() {
  if(!this._config) {
    this._config = this.getParent().getConfig()
  }return this._config
};
a.getTransform = function() {
  return this._transform
};
a.setTransform = function(b) {
  this._transform = b;
  goog.array.forEach(this.getChildren(), function(c) {
    c.setTransform(b)
  }, this)
};
a.transformDrawing = function(b) {
  goog.array.forEach(this.getChildren(), function(c) {
    c.transformDrawing(b)
  }, this)
};
a.clear = function() {
  this.getGroup().clear();
  goog.array.forEach(this.getChildren(), function(b) {
    b.clear()
  }, this)
};
a.transformCoords = function(b, c) {
  c = goog.array.map(c, function(e) {
    return[e.x, e.y]
  });
  var d = goog.array.flatten(c);
  c = [];
  b.transform(d, 0, c, 0, d.length / 2);
  b = [];
  for(d = 0;d < c.length;d += 2) {
    b.push(new goog.math.Coordinate(c[d], c[d + 1]))
  }return b
};
a.toggleHighlight = function() {
  var b = this.getConfig(), c = b.get("bond").stroke.width * 3;
  b = b.get("highlight").color;
  var d = new goog.graphics.Stroke(c, b);
  goog.array.forEach(this._elements, function(e) {
    if(e.isHighlight) {
      e.isHighlight = false;
      e.setStroke(e.oldStroke)
    }else {
      e.isHighlight = true;
      e.oldStroke = e.getStroke();
      e.setStroke(d)
    }
  }, this)
};
jchemhub.view.Drawing.Error = {PARENT_UNABLE_TO_BE_SET:"Unable to set parent component"};
jchemhub.view.Drawing.prototype.disposeInternal = function() {
  jchemhub.view.Drawing.superClass_.disposeInternal.call(this);
  this.handler.dispose()
};goog.dom = {};
goog.dom.TagName = {A:"A", ABBR:"ABBR", ACRONYM:"ACRONYM", ADDRESS:"ADDRESS", APPLET:"APPLET", AREA:"AREA", B:"B", BASE:"BASE", BASEFONT:"BASEFONT", BDO:"BDO", BIG:"BIG", BLOCKQUOTE:"BLOCKQUOTE", BODY:"BODY", BR:"BR", BUTTON:"BUTTON", CAPTION:"CAPTION", CENTER:"CENTER", CITE:"CITE", CODE:"CODE", COL:"COL", COLGROUP:"COLGROUP", DD:"DD", DEL:"DEL", DFN:"DFN", DIR:"DIR", DIV:"DIV", DL:"DL", DT:"DT", EM:"EM", FIELDSET:"FIELDSET", FONT:"FONT", FORM:"FORM", FRAME:"FRAME", FRAMESET:"FRAMESET", H1:"H1", 
H2:"H2", H3:"H3", H4:"H4", H5:"H5", H6:"H6", HEAD:"HEAD", HR:"HR", HTML:"HTML", I:"I", IFRAME:"IFRAME", IMG:"IMG", INPUT:"INPUT", INS:"INS", ISINDEX:"ISINDEX", KBD:"KBD", LABEL:"LABEL", LEGEND:"LEGEND", LI:"LI", LINK:"LINK", MAP:"MAP", MENU:"MENU", META:"META", NOFRAMES:"NOFRAMES", NOSCRIPT:"NOSCRIPT", OBJECT:"OBJECT", OL:"OL", OPTGROUP:"OPTGROUP", OPTION:"OPTION", P:"P", PARAM:"PARAM", PRE:"PRE", Q:"Q", S:"S", SAMP:"SAMP", SCRIPT:"SCRIPT", SELECT:"SELECT", SMALL:"SMALL", SPAN:"SPAN", STRIKE:"STRIKE", 
STRONG:"STRONG", STYLE:"STYLE", SUB:"SUB", SUP:"SUP", TABLE:"TABLE", TBODY:"TBODY", TD:"TD", TEXTAREA:"TEXTAREA", TFOOT:"TFOOT", TH:"TH", THEAD:"THEAD", TITLE:"TITLE", TR:"TR", TT:"TT", U:"U", UL:"UL", VAR:"VAR"};goog.dom.classes = {};
goog.dom.classes.set = function(b, c) {
  b.className = c
};
goog.dom.classes.get = function(b) {
  return(b = b.className) && typeof b.split == "function" ? b.split(/\s+/) : []
};
goog.dom.classes.add = function(b) {
  var c = goog.dom.classes.get(b), d = goog.array.slice(arguments, 1);
  d = goog.dom.classes.add_(c, d);
  b.className = c.join(" ");
  return d
};
goog.dom.classes.remove = function(b) {
  var c = goog.dom.classes.get(b), d = goog.array.slice(arguments, 1);
  d = goog.dom.classes.remove_(c, d);
  b.className = c.join(" ");
  return d
};
goog.dom.classes.add_ = function(b, c) {
  for(var d = 0, e = 0;e < c.length;e++) {
    if(!goog.array.contains(b, c[e])) {
      b.push(c[e]);
      d++
    }
  }return d == c.length
};
goog.dom.classes.remove_ = function(b, c) {
  for(var d = 0, e = 0;e < b.length;e++) {
    if(goog.array.contains(c, b[e])) {
      goog.array.splice(b, e--, 1);
      d++
    }
  }return d == c.length
};
goog.dom.classes.swap = function(b, c, d) {
  for(var e = goog.dom.classes.get(b), f = false, g = 0;g < e.length;g++) {
    if(e[g] == c) {
      goog.array.splice(e, g--, 1);
      f = true
    }
  }if(f) {
    e.push(d);
    b.className = e.join(" ")
  }return f
};
goog.dom.classes.addRemove = function(b, c, d) {
  var e = goog.dom.classes.get(b);
  if(goog.isString(c)) {
    goog.array.remove(e, c)
  }else {
    goog.isArray(c) && goog.dom.classes.remove_(e, c)
  }if(goog.isString(d) && !goog.array.contains(e, d)) {
    e.push(d)
  }else {
    goog.isArray(d) && goog.dom.classes.add_(e, d)
  }b.className = e.join(" ")
};
goog.dom.classes.has = function(b, c) {
  return goog.array.contains(goog.dom.classes.get(b), c)
};
goog.dom.classes.enable = function(b, c, d) {
  d ? goog.dom.classes.add(b, c) : goog.dom.classes.remove(b, c)
};
goog.dom.classes.toggle = function(b, c) {
  var d = !goog.dom.classes.has(b, c);
  goog.dom.classes.enable(b, c, d);
  return d
};goog.math = {};
goog.math.Coordinate = function(b, c) {
  this.x = goog.isDef(b) ? b : 0;
  this.y = goog.isDef(c) ? c : 0
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y)
};
if(goog.DEBUG) {
  goog.math.Coordinate.prototype.toString = function() {
    return"(" + this.x + ", " + this.y + ")"
  }
}goog.math.Coordinate.equals = function(b, c) {
  if(b == c) {
    return true
  }if(!b || !c) {
    return false
  }return b.x == c.x && b.y == c.y
};
goog.math.Coordinate.distance = function(b, c) {
  var d = b.x - c.x;
  b = b.y - c.y;
  return Math.sqrt(d * d + b * b)
};
goog.math.Coordinate.squaredDistance = function(b, c) {
  var d = b.x - c.x;
  b = b.y - c.y;
  return d * d + b * b
};
goog.math.Coordinate.difference = function(b, c) {
  return new goog.math.Coordinate(b.x - c.x, b.y - c.y)
};
goog.math.Coordinate.sum = function(b, c) {
  return new goog.math.Coordinate(b.x + c.x, b.y + c.y)
};goog.math.Size = function(b, c) {
  this.width = b;
  this.height = c
};
goog.math.Size.equals = function(b, c) {
  if(b == c) {
    return true
  }if(!b || !c) {
    return false
  }return b.width == c.width && b.height == c.height
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height)
};
if(goog.DEBUG) {
  goog.math.Size.prototype.toString = function() {
    return"(" + this.width + " x " + this.height + ")"
  }
}a = goog.math.Size.prototype;
a.getLongest = function() {
  return Math.max(this.width, this.height)
};
a.getShortest = function() {
  return Math.min(this.width, this.height)
};
a.area = function() {
  return this.width * this.height
};
a.aspectRatio = function() {
  return this.width / this.height
};
a.isEmpty = function() {
  return!this.area()
};
a.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this
};
a.fitsInside = function(b) {
  return this.width <= b.width && this.height <= b.height
};
a.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
a.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
a.scale = function(b) {
  this.width *= b;
  this.height *= b;
  return this
};
a.scaleToFit = function(b) {
  return this.scale(this.aspectRatio() > b.aspectRatio() ? b.width / this.width : b.height / this.height)
};goog.dom.ASSUME_QUIRKS_MODE = false;
goog.dom.ASSUME_STANDARDS_MODE = false;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.dom.getDomHelper = function(b) {
  return b ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(b)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
};
goog.dom.getDocument = function() {
  return document
};
goog.dom.getElement = function(b) {
  return goog.isString(b) ? document.getElementById(b) : b
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(b, c, d) {
  return goog.dom.getElementsByTagNameAndClass_(document, b, c, d)
};
goog.dom.getElementsByTagNameAndClass_ = function(b, c, d, e) {
  e = e || b;
  c = c && c != "*" ? c.toUpperCase() : "";
  if(e.querySelectorAll && (c || d) && (!goog.userAgent.WEBKIT || goog.dom.isCss1CompatMode_(b) || goog.userAgent.isVersion("528"))) {
    return e.querySelectorAll(c + (d ? "." + d : ""))
  }if(d && e.getElementsByClassName) {
    b = e.getElementsByClassName(d);
    if(c) {
      e = {};
      for(var f = 0, g = 0, h;h = b[g];g++) {
        if(c == h.nodeName) {
          e[f++] = h
        }
      }e.length = f;
      return e
    }else {
      return b
    }
  }b = e.getElementsByTagName(c || "*");
  if(d) {
    e = {};
    for(g = f = 0;h = b[g];g++) {
      c = h.className;
      if(typeof c.split == "function" && goog.array.contains(c.split(/\s+/), d)) {
        e[f++] = h
      }
    }e.length = f;
    return e
  }else {
    return b
  }
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(b, c) {
  goog.object.forEach(c, function(d, e) {
    if(e == "style") {
      b.style.cssText = d
    }else {
      if(e == "class") {
        b.className = d
      }else {
        if(e == "for") {
          b.htmlFor = d
        }else {
          if(e in goog.dom.DIRECT_ATTRIBUTE_MAP_) {
            b.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[e], d)
          }else {
            b[e] = d
          }
        }
      }
    }
  })
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", rowspan:"rowSpan", valign:"vAlign", height:"height", width:"width", usemap:"useMap", frameborder:"frameBorder", type:"type"};
goog.dom.getViewportSize = function(b) {
  return goog.dom.getViewportSize_(b || window)
};
goog.dom.getViewportSize_ = function(b) {
  var c = b.document;
  if(goog.userAgent.WEBKIT && !goog.userAgent.isVersion("500") && !goog.userAgent.MOBILE) {
    if(typeof b.innerHeight == "undefined") {
      b = window
    }c = b.innerHeight;
    var d = b.document.documentElement.scrollHeight;
    if(b == b.top) {
      if(d < c) {
        c -= 15
      }
    }return new goog.math.Size(b.innerWidth, c)
  }b = goog.dom.isCss1CompatMode_(c) && (!goog.userAgent.OPERA || goog.userAgent.OPERA && goog.userAgent.isVersion("9.50")) ? c.documentElement : c.body;
  return new goog.math.Size(b.clientWidth, b.clientHeight)
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window)
};
goog.dom.getDocumentHeight_ = function(b) {
  var c = b.document, d = 0;
  if(c) {
    b = goog.dom.getViewportSize_(b).height;
    d = c.body;
    var e = c.documentElement;
    if(goog.dom.isCss1CompatMode_(c) && e.scrollHeight) {
      d = e.scrollHeight != b ? e.scrollHeight : e.offsetHeight
    }else {
      c = e.scrollHeight;
      var f = e.offsetHeight;
      if(e.clientHeight != f) {
        c = d.scrollHeight;
        f = d.offsetHeight
      }d = c > b ? c > f ? c : f : c < f ? c : f
    }
  }return d
};
goog.dom.getPageScroll = function(b) {
  return goog.dom.getDomHelper((b || goog.global || window).document).getDocumentScroll()
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document)
};
goog.dom.getDocumentScroll_ = function(b) {
  b = goog.dom.getDocumentScrollElement_(b);
  return new goog.math.Coordinate(b.scrollLeft, b.scrollTop)
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document)
};
goog.dom.getDocumentScrollElement_ = function(b) {
  return!goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(b) ? b.documentElement : b.body
};
goog.dom.getWindow = function(b) {
  return b ? goog.dom.getWindow_(b) : window
};
goog.dom.getWindow_ = function(b) {
  return b.parentWindow || b.defaultView
};
goog.dom.createDom = function() {
  return goog.dom.createDom_(document, arguments)
};
goog.dom.createDom_ = function(b, c) {
  var d = c[0], e = c[1];
  if(goog.userAgent.IE && e && (e.name || e.type)) {
    d = ["<", d];
    e.name && d.push(' name="', goog.string.htmlEscape(e.name), '"');
    if(e.type) {
      d.push(' type="', goog.string.htmlEscape(e.type), '"');
      e = goog.cloneObject(e);
      delete e.type
    }d.push(">");
    d = d.join("")
  }var f = b.createElement(d);
  if(e) {
    if(goog.isString(e)) {
      f.className = e
    }else {
      goog.dom.setProperties(f, e)
    }
  }if(c.length > 2) {
    e = function(h) {
      if(h) {
        f.appendChild(goog.isString(h) ? b.createTextNode(h) : h)
      }
    };
    for(d = 2;d < c.length;d++) {
      var g = c[d];
      goog.isArrayLike(g) && !goog.dom.isNodeLike(g) ? goog.array.forEach(goog.dom.isNodeList(g) ? goog.array.clone(g) : g, e) : e(g)
    }
  }return f
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(b) {
  return document.createElement(b)
};
goog.dom.createTextNode = function(b) {
  return document.createTextNode(b)
};
goog.dom.createTable = function(b, c, d) {
  return goog.dom.createTable_(document, b, c, !!d)
};
goog.dom.createTable_ = function(b, c, d, e) {
  for(var f = ["<tr>"], g = 0;g < d;g++) {
    f.push(e ? "<td>&nbsp;</td>" : "<td></td>")
  }f.push("</tr>");
  f = f.join("");
  d = ["<table>"];
  for(g = 0;g < c;g++) {
    d.push(f)
  }d.push("</table>");
  b = b.createElement(goog.dom.TagName.DIV);
  b.innerHTML = d.join("");
  return b.removeChild(b.firstChild)
};
goog.dom.htmlToDocumentFragment = function(b) {
  return goog.dom.htmlToDocumentFragment_(document, b)
};
goog.dom.htmlToDocumentFragment_ = function(b, c) {
  var d = b.createElement("div");
  d.innerHTML = c;
  if(d.childNodes.length == 1) {
    return d.removeChild(d.firstChild)
  }else {
    for(b = b.createDocumentFragment();d.firstChild;) {
      b.appendChild(d.firstChild)
    }return b
  }
};
goog.dom.getCompatMode = function() {
  return goog.dom.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document)
};
goog.dom.isCss1CompatMode_ = function(b) {
  if(goog.dom.COMPAT_MODE_KNOWN_) {
    return goog.dom.ASSUME_STANDARDS_MODE
  }return b.compatMode == "CSS1Compat"
};
goog.dom.canHaveChildren = function(b) {
  if(b.nodeType != goog.dom.NodeType.ELEMENT) {
    return false
  }if("canHaveChildren" in b) {
    return b.canHaveChildren
  }switch(b.tagName) {
    case goog.dom.TagName.APPLET:
    ;
    case goog.dom.TagName.AREA:
    ;
    case goog.dom.TagName.BASE:
    ;
    case goog.dom.TagName.BR:
    ;
    case goog.dom.TagName.COL:
    ;
    case goog.dom.TagName.FRAME:
    ;
    case goog.dom.TagName.HR:
    ;
    case goog.dom.TagName.IMG:
    ;
    case goog.dom.TagName.INPUT:
    ;
    case goog.dom.TagName.IFRAME:
    ;
    case goog.dom.TagName.ISINDEX:
    ;
    case goog.dom.TagName.LINK:
    ;
    case goog.dom.TagName.NOFRAMES:
    ;
    case goog.dom.TagName.NOSCRIPT:
    ;
    case goog.dom.TagName.META:
    ;
    case goog.dom.TagName.OBJECT:
    ;
    case goog.dom.TagName.PARAM:
    ;
    case goog.dom.TagName.SCRIPT:
    ;
    case goog.dom.TagName.STYLE:
      return false
  }
  return true
};
goog.dom.appendChild = function(b, c) {
  b.appendChild(c)
};
goog.dom.removeChildren = function(b) {
  for(var c;c = b.firstChild;) {
    b.removeChild(c)
  }
};
goog.dom.insertSiblingBefore = function(b, c) {
  c.parentNode && c.parentNode.insertBefore(b, c)
};
goog.dom.insertSiblingAfter = function(b, c) {
  c.parentNode && c.parentNode.insertBefore(b, c.nextSibling)
};
goog.dom.removeNode = function(b) {
  return b && b.parentNode ? b.parentNode.removeChild(b) : null
};
goog.dom.replaceNode = function(b, c) {
  var d = c.parentNode;
  d && d.replaceChild(b, c)
};
goog.dom.flattenElement = function(b) {
  var c, d = b.parentNode;
  if(d && d.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if(b.removeNode) {
      return b.removeNode(false)
    }else {
      for(;c = b.firstChild;) {
        d.insertBefore(c, b)
      }return goog.dom.removeNode(b)
    }
  }
};
goog.dom.getFirstElementChild = function(b) {
  return goog.dom.getNextElementNode_(b.firstChild, true)
};
goog.dom.getLastElementChild = function(b) {
  return goog.dom.getNextElementNode_(b.lastChild, false)
};
goog.dom.getNextElementSibling = function(b) {
  return goog.dom.getNextElementNode_(b.nextSibling, true)
};
goog.dom.getPreviousElementSibling = function(b) {
  return goog.dom.getNextElementNode_(b.previousSibling, false)
};
goog.dom.getNextElementNode_ = function(b, c) {
  for(;b && b.nodeType != goog.dom.NodeType.ELEMENT;) {
    b = c ? b.nextSibling : b.previousSibling
  }return b
};
goog.dom.getNextNode = function(b) {
  if(!b) {
    return null
  }if(b.firstChild) {
    return b.firstChild
  }for(;b && !b.nextSibling;) {
    b = b.parentNode
  }return b ? b.nextSibling : null
};
goog.dom.getPreviousNode = function(b) {
  if(!b) {
    return null
  }if(!b.previousSibling) {
    return b.parentNode
  }for(b = b.previousSibling;b && b.lastChild;) {
    b = b.lastChild
  }return b
};
goog.dom.isNodeLike = function(b) {
  return goog.isObject(b) && b.nodeType > 0
};
goog.dom.contains = function(b, c) {
  if(b.contains && c.nodeType == goog.dom.NodeType.ELEMENT) {
    return b == c || b.contains(c)
  }if(typeof b.compareDocumentPosition != "undefined") {
    return b == c || Boolean(b.compareDocumentPosition(c) & 16)
  }for(;c && b != c;) {
    c = c.parentNode
  }return c == b
};
goog.dom.compareNodeOrder = function(b, c) {
  if(b == c) {
    return 0
  }if(b.compareDocumentPosition) {
    return b.compareDocumentPosition(c) & 2 ? 1 : -1
  }if("sourceIndex" in b || b.parentNode && "sourceIndex" in b.parentNode) {
    var d = b.nodeType == goog.dom.NodeType.ELEMENT, e = c.nodeType == goog.dom.NodeType.ELEMENT;
    if(d && e) {
      return b.sourceIndex - c.sourceIndex
    }else {
      var f = b.parentNode, g = c.parentNode;
      if(f == g) {
        return goog.dom.compareSiblingOrder_(b, c)
      }if(!d && goog.dom.contains(f, c)) {
        return-1 * goog.dom.compareParentsDescendantNodeIe_(b, c)
      }if(!e && goog.dom.contains(g, b)) {
        return goog.dom.compareParentsDescendantNodeIe_(c, b)
      }return(d ? b.sourceIndex : f.sourceIndex) - (e ? c.sourceIndex : g.sourceIndex)
    }
  }e = goog.dom.getOwnerDocument(b);
  d = e.createRange();
  d.selectNode(b);
  d.collapse(true);
  b = e.createRange();
  b.selectNode(c);
  b.collapse(true);
  return d.compareBoundaryPoints(goog.global.Range.START_TO_END, b)
};
goog.dom.compareParentsDescendantNodeIe_ = function(b, c) {
  var d = b.parentNode;
  if(d == c) {
    return-1
  }for(c = c;c.parentNode != d;) {
    c = c.parentNode
  }return goog.dom.compareSiblingOrder_(c, b)
};
goog.dom.compareSiblingOrder_ = function(b, c) {
  for(c = c;c = c.previousSibling;) {
    if(c == b) {
      return-1
    }
  }return 1
};
goog.dom.findCommonAncestor = function() {
  var b, c = arguments.length;
  if(c) {
    if(c == 1) {
      return arguments[0]
    }
  }else {
    return null
  }var d = [], e = Infinity;
  for(b = 0;b < c;b++) {
    for(var f = [], g = arguments[b];g;) {
      f.unshift(g);
      g = g.parentNode
    }d.push(f);
    e = Math.min(e, f.length)
  }f = null;
  for(b = 0;b < e;b++) {
    g = d[0][b];
    for(var h = 1;h < c;h++) {
      if(g != d[h][b]) {
        return f
      }
    }f = g
  }return f
};
goog.dom.getOwnerDocument = function(b) {
  return b.nodeType == goog.dom.NodeType.DOCUMENT ? b : b.ownerDocument || b.document
};
goog.dom.getFrameContentDocument = function(b) {
  return goog.userAgent.WEBKIT ? b.document || b.contentWindow.document : b.contentDocument || b.contentWindow.document
};
goog.dom.getFrameContentWindow = function(b) {
  return b.contentWindow || goog.dom.getWindow_(goog.dom.getFrameContentDocument(b))
};
goog.dom.setTextContent = function(b, c) {
  if("textContent" in b) {
    b.textContent = c
  }else {
    if(b.firstChild && b.firstChild.nodeType == goog.dom.NodeType.TEXT) {
      for(;b.lastChild != b.firstChild;) {
        b.removeChild(b.lastChild)
      }b.firstChild.data = c
    }else {
      goog.dom.removeChildren(b);
      var d = goog.dom.getOwnerDocument(b);
      b.appendChild(d.createTextNode(c))
    }
  }
};
goog.dom.getOuterHtml = function(b) {
  if("outerHTML" in b) {
    return b.outerHTML
  }else {
    var c = goog.dom.getOwnerDocument(b).createElement("div");
    c.appendChild(b.cloneNode(true));
    return c.innerHTML
  }
};
goog.dom.findNode = function(b, c) {
  var d = [];
  return goog.dom.findNodes_(b, c, d, true) ? d[0] : undefined
};
goog.dom.findNodes = function(b, c) {
  var d = [];
  goog.dom.findNodes_(b, c, d, false);
  return d
};
goog.dom.findNodes_ = function(b, c, d, e) {
  if(b != null) {
    for(var f = 0, g;g = b.childNodes[f];f++) {
      if(c(g)) {
        d.push(g);
        if(e) {
          return true
        }
      }if(goog.dom.findNodes_(g, c, d, e)) {
        return true
      }
    }
  }return false
};
goog.dom.TAGS_TO_IGNORE_ = {SCRIPT:1, STYLE:1, HEAD:1, IFRAME:1, OBJECT:1};
goog.dom.PREDEFINED_TAG_VALUES_ = {IMG:" ", BR:"\n"};
goog.dom.isFocusableTabIndex = function(b) {
  var c = b.getAttributeNode("tabindex");
  if(c && c.specified) {
    b = b.tabIndex;
    return goog.isNumber(b) && b >= 0
  }return false
};
goog.dom.setFocusableTabIndex = function(b, c) {
  if(c) {
    b.tabIndex = 0
  }else {
    b.removeAttribute("tabIndex")
  }
};
goog.dom.getTextContent = function(b) {
  if(goog.userAgent.IE && "innerText" in b) {
    b = goog.string.canonicalizeNewlines(b.innerText)
  }else {
    var c = [];
    goog.dom.getTextContent_(b, c, true);
    b = c.join("")
  }b = b.replace(/\xAD/g, "");
  b = b.replace(/ +/g, " ");
  if(b != " ") {
    b = b.replace(/^\s*/, "")
  }return b
};
goog.dom.getRawTextContent = function(b) {
  var c = [];
  goog.dom.getTextContent_(b, c, false);
  return c.join("")
};
goog.dom.getTextContent_ = function(b, c, d) {
  if(!(b.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
    if(b.nodeType == goog.dom.NodeType.TEXT) {
      d ? c.push(String(b.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : c.push(b.nodeValue)
    }else {
      if(b.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        c.push(goog.dom.PREDEFINED_TAG_VALUES_[b.nodeName])
      }else {
        for(b = b.firstChild;b;) {
          goog.dom.getTextContent_(b, c, d);
          b = b.nextSibling
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(b) {
  return goog.dom.getTextContent(b).length
};
goog.dom.getNodeTextOffset = function(b, c) {
  c = c || goog.dom.getOwnerDocument(b).body;
  for(var d = [];b && b != c;) {
    for(var e = b;e = e.previousSibling;) {
      d.unshift(goog.dom.getTextContent(e))
    }b = b.parentNode
  }return goog.string.trimLeft(d.join("")).replace(/ +/g, " ").length
};
goog.dom.getNodeAtOffset = function(b, c, d) {
  b = [b];
  for(var e = 0, f;b.length > 0 && e < c;) {
    f = b.pop();
    if(!(f.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
      if(f.nodeType == goog.dom.NodeType.TEXT) {
        var g = f.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " ");
        e += g.length
      }else {
        if(f.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          e += goog.dom.PREDEFINED_TAG_VALUES_[f.nodeName].length
        }else {
          for(g = f.childNodes.length - 1;g >= 0;g--) {
            b.push(f.childNodes[g])
          }
        }
      }
    }
  }if(goog.isObject(d)) {
    d.remainder = f ? f.nodeValue.length + c - e - 1 : 0;
    d.node = f
  }return f
};
goog.dom.isNodeList = function(b) {
  if(b && typeof b.length == "number") {
    if(goog.isObject(b)) {
      return typeof b.item == "function" || typeof b.item == "string"
    }else {
      if(goog.isFunction(b)) {
        return typeof b.item == "function"
      }
    }
  }return false
};
goog.dom.getAncestorByTagNameAndClass = function(b, c, d) {
  var e = c ? c.toUpperCase() : null;
  return goog.dom.getAncestor(b, function(f) {
    return(!e || f.nodeName == e) && (!d || goog.dom.classes.has(f, d))
  }, true)
};
goog.dom.getAncestor = function(b, c, d, e) {
  if(!d) {
    b = b.parentNode
  }d = e == null;
  for(var f = 0;b && (d || f <= e);) {
    if(c(b)) {
      return b
    }b = b.parentNode;
    f++
  }return null
};
goog.dom.DomHelper = function(b) {
  this.document_ = b || goog.global.document || document
};
a = goog.dom.DomHelper.prototype;
a.getDomHelper = goog.dom.getDomHelper;
a.setDocument = function(b) {
  this.document_ = b
};
a.getDocument = function() {
  return this.document_
};
a.getElement = function(b) {
  return goog.isString(b) ? this.document_.getElementById(b) : b
};
a.$ = goog.dom.DomHelper.prototype.getElement;
a.getElementsByTagNameAndClass = function(b, c, d) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, b, c, d)
};
a.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
a.setProperties = goog.dom.setProperties;
a.getViewportSize = function(b) {
  return goog.dom.getViewportSize(b || this.getWindow())
};
a.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow())
};
a.createDom = function() {
  return goog.dom.createDom_(this.document_, arguments)
};
a.$dom = goog.dom.DomHelper.prototype.createDom;
a.createElement = function(b) {
  return this.document_.createElement(b)
};
a.createTextNode = function(b) {
  return this.document_.createTextNode(b)
};
a.createTable = function(b, c, d) {
  return goog.dom.createTable_(this.document_, b, c, !!d)
};
a.htmlToDocumentFragment = function(b) {
  return goog.dom.htmlToDocumentFragment_(this.document_, b)
};
a.getCompatMode = function() {
  return this.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
a.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_)
};
a.getWindow = function() {
  return goog.dom.getWindow_(this.document_)
};
a.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_)
};
a.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_)
};
a.appendChild = goog.dom.appendChild;
a.removeChildren = goog.dom.removeChildren;
a.insertSiblingBefore = goog.dom.insertSiblingBefore;
a.insertSiblingAfter = goog.dom.insertSiblingAfter;
a.removeNode = goog.dom.removeNode;
a.replaceNode = goog.dom.replaceNode;
a.flattenElement = goog.dom.flattenElement;
a.getFirstElementChild = goog.dom.getFirstElementChild;
a.getLastElementChild = goog.dom.getLastElementChild;
a.getNextElementSibling = goog.dom.getNextElementSibling;
a.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
a.getNextNode = goog.dom.getNextNode;
a.getPreviousNode = goog.dom.getPreviousNode;
a.isNodeLike = goog.dom.isNodeLike;
a.contains = goog.dom.contains;
a.getOwnerDocument = goog.dom.getOwnerDocument;
a.getFrameContentDocument = goog.dom.getFrameContentDocument;
a.getFrameContentWindow = goog.dom.getFrameContentWindow;
a.setTextContent = goog.dom.setTextContent;
a.findNode = goog.dom.findNode;
a.findNodes = goog.dom.findNodes;
a.getTextContent = goog.dom.getTextContent;
a.getNodeTextLength = goog.dom.getNodeTextLength;
a.getNodeTextOffset = goog.dom.getNodeTextOffset;
a.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
a.getAncestor = goog.dom.getAncestor;goog.math.Box = function(b, c, d, e) {
  this.top = b;
  this.right = c;
  this.bottom = d;
  this.left = e
};
goog.math.Box.boundingBox = function() {
  for(var b = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x), c = 1;c < arguments.length;c++) {
    var d = arguments[c];
    b.top = Math.min(b.top, d.y);
    b.right = Math.max(b.right, d.x);
    b.bottom = Math.max(b.bottom, d.y);
    b.left = Math.min(b.left, d.x)
  }return b
};
goog.math.Box.prototype.clone = function() {
  return new goog.math.Box(this.top, this.right, this.bottom, this.left)
};
if(goog.DEBUG) {
  goog.math.Box.prototype.toString = function() {
    return"(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)"
  }
}goog.math.Box.prototype.contains = function(b) {
  return goog.math.Box.contains(this, b)
};
goog.math.Box.prototype.expand = function(b, c, d, e) {
  if(goog.isObject(b)) {
    this.top -= b.top;
    this.right += b.right;
    this.bottom += b.bottom;
    this.left -= b.left
  }else {
    this.top -= b;
    this.right += c;
    this.bottom += d;
    this.left -= e
  }return this
};
goog.math.Box.prototype.expandToInclude = function(b) {
  this.left = Math.min(this.left, b.left);
  this.top = Math.min(this.top, b.top);
  this.right = Math.max(this.right, b.right);
  this.bottom = Math.max(this.bottom, b.bottom)
};
goog.math.Box.equals = function(b, c) {
  if(b == c) {
    return true
  }if(!b || !c) {
    return false
  }return b.top == c.top && b.right == c.right && b.bottom == c.bottom && b.left == c.left
};
goog.math.Box.contains = function(b, c) {
  if(!b || !c) {
    return false
  }if(c instanceof goog.math.Box) {
    return c.left >= b.left && c.right <= b.right && c.top >= b.top && c.bottom <= b.bottom
  }return c.x >= b.left && c.x <= b.right && c.y >= b.top && c.y <= b.bottom
};
goog.math.Box.distance = function(b, c) {
  if(c.x >= b.left && c.x <= b.right) {
    if(c.y >= b.top && c.y <= b.bottom) {
      return 0
    }return c.y < b.top ? b.top - c.y : c.y - b.bottom
  }if(c.y >= b.top && c.y <= b.bottom) {
    return c.x < b.left ? b.left - c.x : c.x - b.right
  }return goog.math.Coordinate.distance(c, new goog.math.Coordinate(c.x < b.left ? b.left : b.right, c.y < b.top ? b.top : b.bottom))
};
goog.math.Box.intersects = function(b, c) {
  return b.left <= c.right && c.left <= b.right && b.top <= c.bottom && c.top <= b.bottom
};goog.math.Range = function(b, c) {
  b = Number(b);
  c = Number(c);
  this.start = b < c ? b : c;
  this.end = b < c ? c : b
};
goog.math.Range.prototype.clone = function() {
  return new goog.math.Range(this.start, this.end)
};
if(goog.DEBUG) {
  goog.math.Range.prototype.toString = function() {
    return"[" + this.start + ", " + this.end + "]"
  }
}goog.math.Range.equals = function(b, c) {
  if(b == c) {
    return true
  }if(!b || !c) {
    return false
  }return b.start == c.start && b.end == c.end
};
goog.math.Range.intersection = function(b, c) {
  var d = Math.max(b.start, c.start);
  b = Math.min(b.end, c.end);
  return d <= b ? new goog.math.Range(d, b) : null
};
goog.math.Range.hasIntersection = function(b, c) {
  return Math.max(b.start, c.start) <= Math.min(b.end, c.end)
};
goog.math.Range.boundingRange = function(b, c) {
  return new goog.math.Range(Math.min(b.start, c.start), Math.max(b.end, c.end))
};
goog.math.Range.contains = function(b, c) {
  return b.start <= c.start && b.end >= c.end
};
goog.math.Range.containsPoint = function(b, c) {
  return b.start <= c && b.end >= c
};goog.math.Rect = function(b, c, d, e) {
  this.left = b;
  this.top = c;
  this.width = d;
  this.height = e
};
goog.math.Rect.prototype.clone = function() {
  return new goog.math.Rect(this.left, this.top, this.width, this.height)
};
goog.math.Rect.prototype.toBox = function() {
  return new goog.math.Box(this.top, this.left + this.width, this.top + this.height, this.left)
};
goog.math.Rect.createFromBox = function(b) {
  return new goog.math.Rect(b.left, b.top, b.right - b.left, b.bottom - b.top)
};
if(goog.DEBUG) {
  goog.math.Rect.prototype.toString = function() {
    return"(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)"
  }
}goog.math.Rect.equals = function(b, c) {
  if(b == c) {
    return true
  }if(!b || !c) {
    return false
  }return b.left == c.left && b.width == c.width && b.top == c.top && b.height == c.height
};
goog.math.Rect.prototype.intersection = function(b) {
  var c = Math.max(this.left, b.left), d = Math.min(this.left + this.width, b.left + b.width);
  if(c <= d) {
    var e = Math.max(this.top, b.top);
    b = Math.min(this.top + this.height, b.top + b.height);
    if(e <= b) {
      this.left = c;
      this.top = e;
      this.width = d - c;
      this.height = b - e;
      return true
    }
  }return false
};
goog.math.Rect.intersection = function(b, c) {
  var d = Math.max(b.left, c.left), e = Math.min(b.left + b.width, c.left + c.width);
  if(d <= e) {
    var f = Math.max(b.top, c.top);
    b = Math.min(b.top + b.height, c.top + c.height);
    if(f <= b) {
      return new goog.math.Rect(d, f, e - d, b - f)
    }
  }return null
};
goog.math.Rect.intersects = function(b, c) {
  return b.left <= c.left + c.width && c.left <= b.left + b.width && b.top <= c.top + c.height && c.top <= b.top + b.height
};
goog.math.Rect.prototype.intersects = function(b) {
  return goog.math.Rect.intersects(this, b)
};
goog.math.Rect.difference = function(b, c) {
  var d = goog.math.Rect.intersection(b, c);
  if(!d || !d.height || !d.width) {
    return[b.clone()]
  }d = [];
  var e = b.top, f = b.height, g = b.left + b.width, h = b.top + b.height, j = c.left + c.width, k = c.top + c.height;
  if(c.top > b.top) {
    d.push(new goog.math.Rect(b.left, b.top, b.width, c.top - b.top));
    e = c.top;
    f -= c.top - b.top
  }if(k < h) {
    d.push(new goog.math.Rect(b.left, k, b.width, h - k));
    f = k - e
  }c.left > b.left && d.push(new goog.math.Rect(b.left, e, c.left - b.left, f));
  j < g && d.push(new goog.math.Rect(j, e, g - j, f));
  return d
};
goog.math.Rect.prototype.difference = function(b) {
  return goog.math.Rect.difference(this, b)
};
goog.math.Rect.prototype.boundingRect = function(b) {
  var c = Math.max(this.left + this.width, b.left + b.width), d = Math.max(this.top + this.height, b.top + b.height);
  this.left = Math.min(this.left, b.left);
  this.top = Math.min(this.top, b.top);
  this.width = c - this.left;
  this.height = d - this.top
};
goog.math.Rect.boundingRect = function(b, c) {
  if(!b || !c) {
    return null
  }b = b.clone();
  b.boundingRect(c);
  return b
};
goog.math.Rect.prototype.contains = function(b) {
  return b instanceof goog.math.Rect ? this.left <= b.left && this.left + this.width >= b.left + b.width && this.top <= b.top && this.top + this.height >= b.top + b.height : b.x >= this.left && b.x <= this.left + this.width && b.y >= this.top && b.y <= this.top + this.height
};
goog.math.Rect.prototype.getSize = function() {
  return new goog.math.Size(this.width, this.height)
};goog.math.randomInt = function(b) {
  return Math.floor(Math.random() * b)
};
goog.math.uniformRandom = function(b, c) {
  return b + Math.random() * (c - b)
};
goog.math.clamp = function(b, c, d) {
  return Math.min(Math.max(b, c), d)
};
goog.math.modulo = function(b, c) {
  b = b % c;
  return b * c < 0 ? b + c : b
};
goog.math.lerp = function(b, c, d) {
  return b + d * (c - b)
};
goog.math.nearlyEquals = function(b, c, d) {
  return Math.abs(b - c) <= (d || 1.0E-6)
};
goog.math.standardAngle = function(b) {
  return goog.math.modulo(b, 360)
};
goog.math.toRadians = function(b) {
  return b * Math.PI / 180
};
goog.math.toDegrees = function(b) {
  return b * 180 / Math.PI
};
goog.math.angleDx = function(b, c) {
  return c * Math.cos(goog.math.toRadians(b))
};
goog.math.angleDy = function(b, c) {
  return c * Math.sin(goog.math.toRadians(b))
};
goog.math.angle = function(b, c, d, e) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(e - c, d - b)))
};
goog.math.angleDifference = function(b, c) {
  b = goog.math.standardAngle(c) - goog.math.standardAngle(b);
  if(b > 180) {
    b -= 360
  }else {
    if(b <= -180) {
      b = 360 + b
    }
  }return b
};
goog.math.sign = function(b) {
  return b == 0 ? 0 : b < 0 ? -1 : 1
};
goog.math.longestCommonSubsequence = function(b, c, d, e) {
  d = d || function(m, n) {
    return m == n
  };
  e = e || function(m) {
    return b[m]
  };
  for(var f = b.length, g = c.length, h = [], j = 0;j < f + 1;j++) {
    h[j] = [];
    h[j][0] = 0
  }for(var k = 0;k < g + 1;k++) {
    h[0][k] = 0
  }for(j = 1;j <= f;j++) {
    for(k = 1;k <= f;k++) {
      h[j][k] = d(b[j - 1], c[k - 1]) ? h[j - 1][k - 1] + 1 : Math.max(h[j - 1][k], h[j][k - 1])
    }
  }var l = [];
  j = f;
  for(k = g;j > 0 && k > 0;) {
    if(d(b[j - 1], c[k - 1])) {
      l.unshift(e(j - 1, k - 1));
      j--;
      k--
    }else {
      if(h[j - 1][k] > h[j][k - 1]) {
        j--
      }else {
        k--
      }
    }
  }return l
};
goog.math.sum = function() {
  return goog.array.reduce(arguments, function(b, c) {
    return b + c
  }, 0)
};
goog.math.average = function() {
  return goog.math.sum.apply(null, arguments) / arguments.length
};
goog.math.standardDeviation = function() {
  var b = arguments.length;
  if(b < 2) {
    return 0
  }var c = goog.math.average.apply(null, arguments);
  b = goog.math.sum.apply(null, goog.array.map(arguments, function(d) {
    return Math.pow(d - c, 2)
  })) / (b - 1);
  return Math.sqrt(b)
};
goog.math.isInt = function(b) {
  return isFinite(b) && b % 1 == 0
};
goog.math.isFiniteNumber = function(b) {
  return isFinite(b) && !isNaN(b)
};goog.graphics = {};
goog.graphics.Path = function() {
  this.segments_ = [];
  this.count_ = [];
  this.arguments_ = []
};
goog.graphics.Path.prototype.closePoint_ = null;
goog.graphics.Path.prototype.currentPoint_ = null;
goog.graphics.Path.prototype.simple_ = true;
goog.graphics.Path.Segment = {MOVETO:0, LINETO:1, CURVETO:2, ARCTO:3, CLOSE:4};
goog.graphics.Path.segmentArgCounts_ = function() {
  var b = [];
  b[goog.graphics.Path.Segment.MOVETO] = 2;
  b[goog.graphics.Path.Segment.LINETO] = 2;
  b[goog.graphics.Path.Segment.CURVETO] = 6;
  b[goog.graphics.Path.Segment.ARCTO] = 6;
  b[goog.graphics.Path.Segment.CLOSE] = 0;
  return b
}();
goog.graphics.Path.getSegmentCount = function(b) {
  return goog.graphics.Path.segmentArgCounts_[b]
};
a = goog.graphics.Path.prototype;
a.appendPath = function(b) {
  if(b.currentPoint_) {
    Array.prototype.push.apply(this.segments_, b.segments_);
    Array.prototype.push.apply(this.count_, b.count_);
    Array.prototype.push.apply(this.arguments_, b.arguments_);
    this.currentPoint_ = b.currentPoint_.concat();
    this.closePoint_ = b.closePoint_.concat();
    this.simple_ = this.simple_ && b.simple_
  }return this
};
a.clear = function() {
  this.segments_.length = 0;
  this.count_.length = 0;
  this.arguments_.length = 0;
  delete this.closePoint_;
  delete this.currentPoint_;
  delete this.simple_;
  return this
};
a.moveTo = function(b, c) {
  if(goog.array.peek(this.segments_) == goog.graphics.Path.Segment.MOVETO) {
    this.arguments_.length -= 2
  }else {
    this.segments_.push(goog.graphics.Path.Segment.MOVETO);
    this.count_.push(1)
  }this.arguments_.push(b, c);
  this.currentPoint_ = this.closePoint_ = [b, c];
  return this
};
a.lineTo = function() {
  var b = goog.array.peek(this.segments_);
  if(b == null) {
    throw Error("Path cannot start with lineTo");
  }if(b != goog.graphics.Path.Segment.LINETO) {
    this.segments_.push(goog.graphics.Path.Segment.LINETO);
    this.count_.push(0)
  }for(b = 0;b < arguments.length;b += 2) {
    var c = arguments[b], d = arguments[b + 1];
    this.arguments_.push(c, d)
  }this.count_[this.count_.length - 1] += b / 2;
  this.currentPoint_ = [c, d];
  return this
};
a.curveTo = function() {
  var b = goog.array.peek(this.segments_);
  if(b == null) {
    throw Error("Path cannot start with curve");
  }if(b != goog.graphics.Path.Segment.CURVETO) {
    this.segments_.push(goog.graphics.Path.Segment.CURVETO);
    this.count_.push(0)
  }for(b = 0;b < arguments.length;b += 6) {
    var c = arguments[b + 4], d = arguments[b + 5];
    this.arguments_.push(arguments[b], arguments[b + 1], arguments[b + 2], arguments[b + 3], c, d)
  }this.count_[this.count_.length - 1] += b / 6;
  this.currentPoint_ = [c, d];
  return this
};
a.close = function() {
  var b = goog.array.peek(this.segments_);
  if(b == null) {
    throw Error("Path cannot start with close");
  }if(b != goog.graphics.Path.Segment.CLOSE) {
    this.segments_.push(goog.graphics.Path.Segment.CLOSE);
    this.count_.push(1);
    this.currentPoint_ = this.closePoint_
  }return this
};
a.arc = function(b, c, d, e, f, g, h) {
  b = b + goog.math.angleDx(f, d);
  c = c + goog.math.angleDy(f, e);
  if(h) {
    if(!this.currentPoint_ || b != this.currentPoint_[0] || c != this.currentPoint_[1]) {
      this.lineTo(b, c)
    }
  }else {
    this.moveTo(b, c)
  }return this.arcTo(d, e, f, g)
};
a.arcTo = function(b, c, d, e) {
  var f = this.currentPoint_[0] - goog.math.angleDx(d, b), g = this.currentPoint_[1] - goog.math.angleDy(d, c);
  f = f + goog.math.angleDx(d + e, b);
  g = g + goog.math.angleDy(d + e, c);
  this.segments_.push(goog.graphics.Path.Segment.ARCTO);
  this.count_.push(1);
  this.arguments_.push(b, c, d, e, f, g);
  this.simple_ = false;
  this.currentPoint_ = [f, g];
  return this
};
a.arcToAsCurves = function(b, c, d, e) {
  var f = this.currentPoint_[0] - goog.math.angleDx(d, b), g = this.currentPoint_[1] - goog.math.angleDy(d, c), h = goog.math.toRadians(e);
  e = Math.ceil(Math.abs(h) / Math.PI * 2);
  h = h / e;
  d = goog.math.toRadians(d);
  for(var j = 0;j < e;j++) {
    var k = Math.cos(d), l = Math.sin(d), m = 4 / 3 * Math.sin(h / 2) / (1 + Math.cos(h / 2)), n = f + (k - m * l) * b, o = g + (l + m * k) * c;
    d += h;
    k = Math.cos(d);
    l = Math.sin(d);
    this.curveTo(n, o, f + (k + m * l) * b, g + (l - m * k) * c, f + k * b, g + l * c)
  }return this
};
a.forEachSegment = function(b) {
  for(var c = this.arguments_, d = 0, e = 0, f = this.segments_.length;e < f;e++) {
    var g = this.segments_[e], h = goog.graphics.Path.segmentArgCounts_[g] * this.count_[e];
    b(g, c.slice(d, d + h));
    d += h
  }
};
a.getCurrentPoint = function() {
  return this.currentPoint_ && this.currentPoint_.concat()
};
a.clone = function() {
  var b = new this.constructor;
  b.segments_ = this.segments_.concat();
  b.count_ = this.count_.concat();
  b.arguments_ = this.arguments_.concat();
  b.closePoint_ = this.closePoint_ && this.closePoint_.concat();
  b.currentPoint_ = this.currentPoint_ && this.currentPoint_.concat();
  b.simple_ = this.simple_;
  return b
};
a.isSimple = function() {
  return this.simple_
};
goog.graphics.Path.simplifySegmentMap_ = function() {
  var b = {};
  b[goog.graphics.Path.Segment.MOVETO] = goog.graphics.Path.prototype.moveTo;
  b[goog.graphics.Path.Segment.LINETO] = goog.graphics.Path.prototype.lineTo;
  b[goog.graphics.Path.Segment.CLOSE] = goog.graphics.Path.prototype.close;
  b[goog.graphics.Path.Segment.CURVETO] = goog.graphics.Path.prototype.curveTo;
  b[goog.graphics.Path.Segment.ARCTO] = goog.graphics.Path.prototype.arcToAsCurves;
  return b
}();
goog.graphics.Path.createSimplifiedPath = function(b) {
  if(b.isSimple()) {
    return b.clone()
  }var c = new goog.graphics.Path;
  b.forEachSegment(function(d, e) {
    goog.graphics.Path.simplifySegmentMap_[d].apply(c, e)
  });
  return c
};
goog.graphics.Path.prototype.createTransformedPath = function(b) {
  var c = goog.graphics.Path.createSimplifiedPath(this);
  c.transform(b);
  return c
};
goog.graphics.Path.prototype.transform = function(b) {
  if(!this.isSimple()) {
    throw Error("Non-simple path");
  }b.transform(this.arguments_, 0, this.arguments_, 0, this.arguments_.length / 2);
  this.closePoint_ && b.transform(this.closePoint_, 0, this.closePoint_, 0, 1);
  this.currentPoint_ && this.closePoint_ != this.currentPoint_ && b.transform(this.currentPoint_, 0, this.currentPoint_, 0, 1);
  return this
};
goog.graphics.Path.prototype.isEmpty = function() {
  return this.segments_.length == 0
};goog.style = {};
goog.style.setStyle = function(b, c, d) {
  goog.isString(c) ? goog.style.setStyle_(b, d, c) : goog.object.forEach(c, goog.partial(goog.style.setStyle_, b))
};
goog.style.setStyle_ = function(b, c, d) {
  b.style[goog.style.toCamelCase(d)] = c
};
goog.style.getStyle = function(b, c) {
  return b.style[goog.style.toCamelCase(c)]
};
goog.style.getComputedStyle = function(b, c) {
  var d = goog.dom.getOwnerDocument(b);
  if(d.defaultView && d.defaultView.getComputedStyle) {
    if(b = d.defaultView.getComputedStyle(b, "")) {
      return b[c]
    }
  }return null
};
goog.style.getCascadedStyle = function(b, c) {
  return b.currentStyle ? b.currentStyle[c] : null
};
goog.style.getStyle_ = function(b, c) {
  return goog.style.getComputedStyle(b, c) || goog.style.getCascadedStyle(b, c) || b.style[c]
};
goog.style.getComputedPosition = function(b) {
  return goog.style.getStyle_(b, "position")
};
goog.style.getBackgroundColor = function(b) {
  return goog.style.getStyle_(b, "backgroundColor")
};
goog.style.getComputedOverflowX = function(b) {
  return goog.style.getStyle_(b, "overflowX")
};
goog.style.getComputedOverflowY = function(b) {
  return goog.style.getStyle_(b, "overflowY")
};
goog.style.getComputedZIndex = function(b) {
  return goog.style.getStyle_(b, "zIndex")
};
goog.style.getComputedTextAlign = function(b) {
  return goog.style.getStyle_(b, "textAlign")
};
goog.style.getComputedCursor = function(b) {
  return goog.style.getStyle_(b, "cursor")
};
goog.style.setPosition = function(b, c, d) {
  var e, f = goog.userAgent.GECKO && (goog.userAgent.MAC || goog.userAgent.X11) && goog.userAgent.isVersion("1.9");
  if(c instanceof goog.math.Coordinate) {
    e = c.x;
    c = c.y
  }else {
    e = c;
    c = d
  }b.style.left = typeof e == "number" ? (f ? Math.round(e) : e) + "px" : e;
  b.style.top = typeof c == "number" ? (f ? Math.round(c) : c) + "px" : c
};
goog.style.getPosition = function(b) {
  return new goog.math.Coordinate(b.offsetLeft, b.offsetTop)
};
goog.style.getClientViewportElement = function(b) {
  b = b ? b.nodeType == goog.dom.NodeType.DOCUMENT ? b : goog.dom.getOwnerDocument(b) : goog.dom.getDocument();
  if(goog.userAgent.IE && !goog.dom.getDomHelper(b).isCss1CompatMode()) {
    return b.body
  }return b.documentElement
};
goog.style.getBoundingClientRect_ = function(b) {
  var c = b.getBoundingClientRect();
  if(goog.userAgent.IE) {
    b = b.ownerDocument;
    c.left -= b.documentElement.clientLeft + b.body.clientLeft;
    c.top -= b.documentElement.clientTop + b.body.clientTop
  }return c
};
goog.style.getOffsetParent = function(b) {
  if(goog.userAgent.IE) {
    return b.offsetParent
  }var c = goog.dom.getOwnerDocument(b), d = goog.style.getStyle_(b, "position"), e = d == "fixed" || d == "absolute";
  for(b = b.parentNode;b && b != c;b = b.parentNode) {
    d = goog.style.getStyle_(b, "position");
    e = e && d == "static" && b != c.documentElement && b != c.body;
    if(!e && (b.scrollWidth > b.clientWidth || b.scrollHeight > b.clientHeight || d == "fixed" || d == "absolute")) {
      return b
    }
  }return null
};
goog.style.getVisibleRectForElement = function(b) {
  var c = new goog.math.Box(0, Infinity, Infinity, 0), d = goog.dom.getDomHelper(b), e = d.getDocument().body, f = d.getDocumentScrollElement(), g;
  for(b = b;b = goog.style.getOffsetParent(b);) {
    if((!goog.userAgent.IE || b.clientWidth != 0) && (!goog.userAgent.WEBKIT || b.clientHeight != 0 || b != e) && (b.scrollWidth != b.clientWidth || b.scrollHeight != b.clientHeight) && goog.style.getStyle_(b, "overflow") != "visible") {
      var h = goog.style.getPageOffset(b), j = goog.style.getClientLeftTop(b);
      h.x += j.x;
      h.y += j.y;
      c.top = Math.max(c.top, h.y);
      c.right = Math.min(c.right, h.x + b.clientWidth);
      c.bottom = Math.min(c.bottom, h.y + b.clientHeight);
      c.left = Math.max(c.left, h.x);
      g = g || b != f
    }
  }e = f.scrollLeft;
  f = f.scrollTop;
  if(goog.userAgent.WEBKIT) {
    c.left += e;
    c.top += f
  }else {
    c.left = Math.max(c.left, e);
    c.top = Math.max(c.top, f)
  }if(!g || goog.userAgent.WEBKIT) {
    c.right += e;
    c.bottom += f
  }d = d.getViewportSize();
  c.right = Math.min(c.right, e + d.width);
  c.bottom = Math.min(c.bottom, f + d.height);
  return c.top >= 0 && c.left >= 0 && c.bottom > c.top && c.right > c.left ? c : null
};
goog.style.scrollIntoContainerView = function(b, c, d) {
  var e = goog.style.getPageOffset(b), f = goog.style.getPageOffset(c), g = goog.style.getBorderBox(c), h = e.x - f.x - g.left;
  e = e.y - f.y - g.top;
  f = c.clientWidth - b.offsetWidth;
  b = c.clientHeight - b.offsetHeight;
  if(d) {
    c.scrollLeft += h - f / 2;
    c.scrollTop += e - b / 2
  }else {
    c.scrollLeft += Math.min(h, Math.max(h - f, 0));
    c.scrollTop += Math.min(e, Math.max(e - b, 0))
  }
};
goog.style.getClientLeftTop = function(b) {
  if(goog.userAgent.GECKO && !goog.userAgent.isVersion("1.9")) {
    var c = parseFloat(goog.style.getComputedStyle(b, "borderLeftWidth"));
    if(goog.style.isRightToLeft(b)) {
      var d = b.offsetWidth - b.clientWidth - c - parseFloat(goog.style.getComputedStyle(b, "borderRightWidth"));
      c += d
    }return new goog.math.Coordinate(c, parseFloat(goog.style.getComputedStyle(b, "borderTopWidth")))
  }return new goog.math.Coordinate(b.clientLeft, b.clientTop)
};
goog.style.getPageOffset = function(b) {
  var c, d = goog.dom.getOwnerDocument(b), e = goog.style.getStyle_(b, "position"), f = goog.userAgent.GECKO && d.getBoxObjectFor && !b.getBoundingClientRect && e == "absolute" && (c = d.getBoxObjectFor(b)) && (c.screenX < 0 || c.screenY < 0), g = new goog.math.Coordinate(0, 0), h = goog.style.getClientViewportElement(d);
  if(b == h) {
    return g
  }if(b.getBoundingClientRect) {
    c = goog.style.getBoundingClientRect_(b);
    b = goog.dom.getDomHelper(d).getDocumentScroll();
    g.x = c.left + b.x;
    g.y = c.top + b.y
  }else {
    if(d.getBoxObjectFor && !f) {
      c = d.getBoxObjectFor(b);
      b = d.getBoxObjectFor(h);
      g.x = c.screenX - b.screenX;
      g.y = c.screenY - b.screenY
    }else {
      c = b;
      do {
        g.x += c.offsetLeft;
        g.y += c.offsetTop;
        if(c != b) {
          g.x += c.clientLeft || 0;
          g.y += c.clientTop || 0
        }if(goog.userAgent.WEBKIT && goog.style.getComputedPosition(c) == "fixed") {
          g.x += d.body.scrollLeft;
          g.y += d.body.scrollTop;
          break
        }c = c.offsetParent
      }while(c && c != b);
      if(goog.userAgent.OPERA || goog.userAgent.WEBKIT && e == "absolute") {
        g.y -= d.body.offsetTop
      }for(c = b;(c = goog.style.getOffsetParent(c)) && c != d.body && c != h;) {
        g.x -= c.scrollLeft;
        if(!goog.userAgent.OPERA || c.tagName != "TR") {
          g.y -= c.scrollTop
        }
      }
    }
  }return g
};
goog.style.getPageOffsetLeft = function(b) {
  return goog.style.getPageOffset(b).x
};
goog.style.getPageOffsetTop = function(b) {
  return goog.style.getPageOffset(b).y
};
goog.style.getFramedPageOffset = function(b, c) {
  var d = new goog.math.Coordinate(0, 0), e = goog.dom.getWindow(goog.dom.getOwnerDocument(b));
  b = b;
  do {
    var f = e == c ? goog.style.getPageOffset(b) : goog.style.getClientPosition(b);
    d.x += f.x;
    d.y += f.y
  }while(e && e != c && (b = e.frameElement) && (e = e.parent));
  return d
};
goog.style.translateRectForAnotherFrame = function(b, c, d) {
  if(c.getDocument() != d.getDocument()) {
    var e = c.getDocument().body;
    d = goog.style.getFramedPageOffset(e, d.getWindow());
    d = goog.math.Coordinate.difference(d, goog.style.getPageOffset(e));
    if(goog.userAgent.IE && !c.isCss1CompatMode()) {
      d = goog.math.Coordinate.difference(d, c.getDocumentScroll())
    }b.left += d.x;
    b.top += d.y
  }
};
goog.style.getRelativePosition = function(b, c) {
  b = goog.style.getClientPosition(b);
  c = goog.style.getClientPosition(c);
  return new goog.math.Coordinate(b.x - c.x, b.y - c.y)
};
goog.style.getClientPosition = function(b) {
  var c = new goog.math.Coordinate;
  if(b.nodeType == goog.dom.NodeType.ELEMENT) {
    if(b.getBoundingClientRect) {
      var d = goog.style.getBoundingClientRect_(b);
      c.x = d.left;
      c.y = d.top
    }else {
      d = goog.dom.getDomHelper(b).getDocumentScroll();
      b = goog.style.getPageOffset(b);
      c.x = b.x - d.x;
      c.y = b.y - d.y
    }
  }else {
    c.x = b.clientX;
    c.y = b.clientY
  }return c
};
goog.style.setPageOffset = function(b, c, d) {
  var e = goog.style.getPageOffset(b);
  if(c instanceof goog.math.Coordinate) {
    d = c.y;
    c = c.x
  }goog.style.setPosition(b, b.offsetLeft + (c - e.x), b.offsetTop + (d - e.y))
};
goog.style.setSize = function(b, c, d) {
  if(c instanceof goog.math.Size) {
    d = c.height;
    c = c.width
  }else {
    if(d == undefined) {
      throw Error("missing height argument");
    }d = d
  }b.style.width = typeof c == "number" ? Math.round(c) + "px" : c;
  b.style.height = typeof d == "number" ? Math.round(d) + "px" : d
};
goog.style.getSize = function(b) {
  var c = goog.userAgent.OPERA && !goog.userAgent.isVersion("10");
  if(goog.style.getStyle_(b, "display") != "none") {
    return c ? new goog.math.Size(b.offsetWidth || b.clientWidth, b.offsetHeight || b.clientHeight) : new goog.math.Size(b.offsetWidth, b.offsetHeight)
  }var d = b.style, e = d.display, f = d.visibility, g = d.position;
  d.visibility = "hidden";
  d.position = "absolute";
  d.display = "inline";
  if(c) {
    c = b.offsetWidth || b.clientWidth;
    b = b.offsetHeight || b.clientHeight
  }else {
    c = b.offsetWidth;
    b = b.offsetHeight
  }d.display = e;
  d.position = g;
  d.visibility = f;
  return new goog.math.Size(c, b)
};
goog.style.getBounds = function(b) {
  var c = goog.style.getPageOffset(b);
  b = goog.style.getSize(b);
  return new goog.math.Rect(c.x, c.y, b.width, b.height)
};
goog.style.toCamelCaseCache_ = {};
goog.style.toCamelCase = function(b) {
  return goog.style.toCamelCaseCache_[b] || (goog.style.toCamelCaseCache_[b] = String(b).replace(/\-([a-z])/g, function(c, d) {
    return d.toUpperCase()
  }))
};
goog.style.toSelectorCaseCache_ = {};
goog.style.toSelectorCase = function(b) {
  return goog.style.toSelectorCaseCache_[b] || (goog.style.toSelectorCaseCache_[b] = b.replace(/([A-Z])/g, "-$1").toLowerCase())
};
goog.style.getOpacity = function(b) {
  var c = b.style;
  b = "";
  if("opacity" in c) {
    b = c.opacity
  }else {
    if("MozOpacity" in c) {
      b = c.MozOpacity
    }else {
      if("filter" in c) {
        if(c = c.filter.match(/alpha\(opacity=([\d.]+)\)/)) {
          b = String(c[1] / 100)
        }
      }
    }
  }return b == "" ? b : Number(b)
};
goog.style.setOpacity = function(b, c) {
  b = b.style;
  if("opacity" in b) {
    b.opacity = c
  }else {
    if("MozOpacity" in b) {
      b.MozOpacity = c
    }else {
      if("filter" in b) {
        b.filter = c === "" ? "" : "alpha(opacity=" + c * 100 + ")"
      }
    }
  }
};
goog.style.setTransparentBackgroundImage = function(b, c) {
  b = b.style;
  if(goog.userAgent.IE && !goog.userAgent.isVersion("8")) {
    b.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + c + '", sizingMethod="crop")'
  }else {
    b.backgroundImage = "url(" + c + ")";
    b.backgroundPosition = "top left";
    b.backgroundRepeat = "no-repeat"
  }
};
goog.style.clearTransparentBackgroundImage = function(b) {
  b = b.style;
  if("filter" in b) {
    b.filter = ""
  }else {
    b.backgroundImage = "none"
  }
};
goog.style.showElement = function(b, c) {
  b.style.display = c ? "" : "none"
};
goog.style.isElementShown = function(b) {
  return b.style.display != "none"
};
goog.style.installStyles = function(b, c) {
  c = goog.dom.getDomHelper(c);
  var d = null;
  if(goog.userAgent.IE) {
    d = c.getDocument().createStyleSheet();
    goog.style.setStyles(d, b)
  }else {
    var e = c.getElementsByTagNameAndClass("head")[0];
    if(!e) {
      d = c.getElementsByTagNameAndClass("body")[0];
      e = c.createDom("head");
      d.parentNode.insertBefore(e, d)
    }d = c.createDom("style");
    goog.style.setStyles(d, b);
    c.appendChild(e, d)
  }return d
};
goog.style.uninstallStyles = function(b) {
  goog.dom.removeNode(b.ownerNode || b.owningElement || b)
};
goog.style.setStyles = function(b, c) {
  if(goog.userAgent.IE) {
    b.cssText = c
  }else {
    b[goog.userAgent.WEBKIT ? "innerText" : "innerHTML"] = c
  }
};
goog.style.setPreWrap = function(b) {
  b = b.style;
  if(goog.userAgent.IE && !goog.userAgent.isVersion("8")) {
    b.whiteSpace = "pre";
    b.wordWrap = "break-word"
  }else {
    b.whiteSpace = goog.userAgent.GECKO ? "-moz-pre-wrap" : goog.userAgent.OPERA ? "-o-pre-wrap" : "pre-wrap"
  }
};
goog.style.setInlineBlock = function(b) {
  b = b.style;
  b.position = "relative";
  if(goog.userAgent.IE && !goog.userAgent.isVersion("8")) {
    b.zoom = "1";
    b.display = "inline"
  }else {
    b.display = goog.userAgent.GECKO ? goog.userAgent.isVersion("1.9a") ? "inline-block" : "-moz-inline-box" : "inline-block"
  }
};
goog.style.isRightToLeft = function(b) {
  return"rtl" == goog.style.getStyle_(b, "direction")
};
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT ? "WebkitUserSelect" : null;
goog.style.isUnselectable = function(b) {
  if(goog.style.unselectableStyle_) {
    return b.style[goog.style.unselectableStyle_].toLowerCase() == "none"
  }else {
    if(goog.userAgent.IE || goog.userAgent.OPERA) {
      return b.getAttribute("unselectable") == "on"
    }
  }return false
};
goog.style.setUnselectable = function(b, c, d) {
  d = !d ? b.getElementsByTagName("*") : null;
  var e = goog.style.unselectableStyle_;
  if(e) {
    c = c ? "none" : "";
    b.style[e] = c;
    if(d) {
      b = 0;
      for(var f;f = d[b];b++) {
        f.style[e] = c
      }
    }
  }else {
    if(goog.userAgent.IE || goog.userAgent.OPERA) {
      c = c ? "on" : "";
      b.setAttribute("unselectable", c);
      if(d) {
        for(b = 0;f = d[b];b++) {
          f.setAttribute("unselectable", c)
        }
      }
    }
  }
};
goog.style.getBorderBoxSize = function(b) {
  return new goog.math.Size(b.offsetWidth, b.offsetHeight)
};
goog.style.setBorderBoxSize = function(b, c) {
  var d = goog.dom.getOwnerDocument(b), e = goog.dom.getDomHelper(d).isCss1CompatMode();
  if(goog.userAgent.IE && (!e || !goog.userAgent.isVersion("8"))) {
    d = b.style;
    if(e) {
      e = goog.style.getPaddingBox(b);
      b = goog.style.getBorderBox(b);
      d.pixelWidth = c.width - b.left - e.left - e.right - b.right;
      d.pixelHeight = c.height - b.top - e.top - e.bottom - b.bottom
    }else {
      d.pixelWidth = c.width;
      d.pixelHeight = c.height
    }
  }else {
    goog.style.setBoxSizingSize_(b, c, "border-box")
  }
};
goog.style.getContentBoxSize = function(b) {
  var c = goog.dom.getOwnerDocument(b), d = goog.userAgent.IE && b.currentStyle;
  if(d && goog.dom.getDomHelper(c).isCss1CompatMode() && d.width != "auto" && d.height != "auto" && !d.boxSizing) {
    c = goog.style.getIePixelValue_(b, d.width, "width", "pixelWidth");
    b = goog.style.getIePixelValue_(b, d.height, "height", "pixelHeight");
    return new goog.math.Size(c, b)
  }else {
    d = goog.style.getBorderBoxSize(b);
    c = goog.style.getPaddingBox(b);
    b = goog.style.getBorderBox(b);
    return new goog.math.Size(d.width - b.left - c.left - c.right - b.right, d.height - b.top - c.top - c.bottom - b.bottom)
  }
};
goog.style.setContentBoxSize = function(b, c) {
  var d = goog.dom.getOwnerDocument(b), e = goog.dom.getDomHelper(d).isCss1CompatMode();
  if(goog.userAgent.IE && (!e || !goog.userAgent.isVersion("8"))) {
    d = b.style;
    if(e) {
      d.pixelWidth = c.width;
      d.pixelHeight = c.height
    }else {
      e = goog.style.getPaddingBox(b);
      b = goog.style.getBorderBox(b);
      d.pixelWidth = c.width + b.left + e.left + e.right + b.right;
      d.pixelHeight = c.height + b.top + e.top + e.bottom + b.bottom
    }
  }else {
    goog.style.setBoxSizingSize_(b, c, "content-box")
  }
};
goog.style.setBoxSizingSize_ = function(b, c, d) {
  b = b.style;
  if(goog.userAgent.GECKO) {
    b.MozBoxSizing = d
  }else {
    if(goog.userAgent.WEBKIT) {
      b.WebkitBoxSizing = d
    }else {
      if(goog.userAgent.OPERA && !goog.userAgent.isVersion("9.50")) {
        d ? b.setProperty("box-sizing", d) : b.removeProperty("box-sizing")
      }else {
        b.boxSizing = d
      }
    }
  }b.width = c.width + "px";
  b.height = c.height + "px"
};
goog.style.getIePixelValue_ = function(b, c, d, e) {
  if(/^\d+px?$/.test(c)) {
    return parseInt(c, 10)
  }else {
    var f = b.style[d], g = b.runtimeStyle[d];
    b.runtimeStyle[d] = b.currentStyle[d];
    b.style[d] = c;
    c = b.style[e];
    b.style[d] = f;
    b.runtimeStyle[d] = g;
    return c
  }
};
goog.style.getIePixelDistance_ = function(b, c) {
  return goog.style.getIePixelValue_(b, goog.style.getCascadedStyle(b, c), "left", "pixelLeft")
};
goog.style.getBox_ = function(b, c) {
  if(goog.userAgent.IE) {
    var d = goog.style.getIePixelDistance_(b, c + "Left"), e = goog.style.getIePixelDistance_(b, c + "Right"), f = goog.style.getIePixelDistance_(b, c + "Top");
    b = goog.style.getIePixelDistance_(b, c + "Bottom");
    return new goog.math.Box(f, e, b, d)
  }else {
    d = goog.style.getComputedStyle(b, c + "Left");
    e = goog.style.getComputedStyle(b, c + "Right");
    f = goog.style.getComputedStyle(b, c + "Top");
    b = goog.style.getComputedStyle(b, c + "Bottom");
    return new goog.math.Box(parseFloat(f), parseFloat(e), parseFloat(b), parseFloat(d))
  }
};
goog.style.getPaddingBox = function(b) {
  return goog.style.getBox_(b, "padding")
};
goog.style.getMarginBox = function(b) {
  return goog.style.getBox_(b, "margin")
};
goog.style.ieBorderWidthKeywords_ = {thin:2, medium:4, thick:6};
goog.style.getIePixelBorder_ = function(b, c) {
  if(goog.style.getCascadedStyle(b, c + "Style") == "none") {
    return 0
  }c = goog.style.getCascadedStyle(b, c + "Width");
  if(c in goog.style.ieBorderWidthKeywords_) {
    return goog.style.ieBorderWidthKeywords_[c]
  }return goog.style.getIePixelValue_(b, c, "left", "pixelLeft")
};
goog.style.getBorderBox = function(b) {
  if(goog.userAgent.IE) {
    var c = goog.style.getIePixelBorder_(b, "borderLeft"), d = goog.style.getIePixelBorder_(b, "borderRight"), e = goog.style.getIePixelBorder_(b, "borderTop");
    b = goog.style.getIePixelBorder_(b, "borderBottom");
    return new goog.math.Box(e, d, b, c)
  }else {
    c = goog.style.getComputedStyle(b, "borderLeftWidth");
    d = goog.style.getComputedStyle(b, "borderRightWidth");
    e = goog.style.getComputedStyle(b, "borderTopWidth");
    b = goog.style.getComputedStyle(b, "borderBottomWidth");
    return new goog.math.Box(parseFloat(e), parseFloat(d), parseFloat(b), parseFloat(c))
  }
};
goog.style.getFontFamily = function(b) {
  var c = goog.dom.getOwnerDocument(b), d = "";
  if(c.createTextRange) {
    d = c.body.createTextRange();
    d.moveToElementText(b);
    d = d.queryCommandValue("FontName")
  }if(!d) {
    d = goog.style.getStyle_(b, "fontFamily");
    if(goog.userAgent.OPERA && goog.userAgent.LINUX) {
      d = d.replace(/ \[[^\]]*\]/, "")
    }
  }b = d.split(",");
  if(b.length > 1) {
    d = b[0]
  }return goog.string.stripQuotes(d, "\"'")
};
goog.style.lengthUnitRegex_ = /[^\d]+$/;
goog.style.getLengthUnits = function(b) {
  return(b = b.match(goog.style.lengthUnitRegex_)) && b[0] || null
};
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {cm:1, "in":1, mm:1, pc:1, pt:1};
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {em:1, ex:1};
goog.style.getFontSize = function(b) {
  var c = goog.style.getStyle_(b, "fontSize"), d = goog.style.getLengthUnits(c);
  if(c && "px" == d) {
    return parseInt(c, 10)
  }if(goog.userAgent.IE) {
    if(d in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) {
      return goog.style.getIePixelValue_(b, c, "left", "pixelLeft")
    }else {
      if(b.parentNode && b.parentNode.nodeType == goog.dom.NodeType.ELEMENT && d in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) {
        b = b.parentNode;
        d = goog.style.getStyle_(b, "fontSize");
        return goog.style.getIePixelValue_(b, c == d ? "1em" : c, "left", "pixelLeft")
      }
    }
  }d = goog.dom.createDom("span", {style:"visibility:hidden;position:absolute;line-height:0;padding:0;margin:0;border:0;height:1em;"});
  goog.dom.appendChild(b, d);
  c = d.offsetHeight;
  goog.dom.removeNode(d);
  return c
};
goog.style.parseStyleAttribute = function(b) {
  var c = {};
  goog.array.forEach(b.split(/\s*;\s*/), function(d) {
    d = d.split(/\s*:\s*/);
    if(d.length == 2) {
      c[goog.style.toCamelCase(d[0].toLowerCase())] = d[1]
    }
  });
  return c
};
goog.style.toStyleAttribute = function(b) {
  var c = [];
  goog.object.forEach(b, function(d, e) {
    c.push(goog.style.toSelectorCase(e), ":", d, ";")
  });
  return c.join("")
};
goog.style.setFloat = function(b, c) {
  b.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = c
};
goog.style.getFloat = function(b) {
  return b.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || ""
};
goog.style.getScrollbarWidth = function() {
  var b = goog.dom.createElement("div");
  b.style.cssText = "visibility:hidden;overflow:scroll;position:absolute;top:0;width:100px;height:100px";
  goog.dom.appendChild(goog.dom.getDocument().body, b);
  var c = b.offsetWidth - b.clientWidth;
  goog.dom.removeNode(b);
  return c
};goog.events.EventHandler = function(b) {
  this.handler_ = b
};
goog.inherits(goog.events.EventHandler, goog.Disposable);
goog.events.EventHandler.KEY_POOL_INITIAL_COUNT = 0;
goog.events.EventHandler.KEY_POOL_MAX_COUNT = 100;
goog.events.EventHandler.keyPool_ = new goog.structs.SimplePool(goog.events.EventHandler.KEY_POOL_INITIAL_COUNT, goog.events.EventHandler.KEY_POOL_MAX_COUNT);
goog.events.EventHandler.keys_ = null;
goog.events.EventHandler.key_ = null;
a = goog.events.EventHandler.prototype;
a.listen = function(b, c, d, e, f) {
  if(goog.isArray(c)) {
    for(var g = 0;g < c.length;g++) {
      this.listen(b, c[g], d, e, f)
    }
  }else {
    this.recordListenerKey_(goog.events.listen(b, c, d || this, e || false, f || this.handler_ || this))
  }return this
};
a.listenOnce = function(b, c, d, e, f) {
  if(goog.isArray(c)) {
    for(var g = 0;g < c.length;g++) {
      this.listenOnce(b, c[g], d, e, f)
    }
  }else {
    this.recordListenerKey_(goog.events.listenOnce(b, c, d || this, e || false, f || this.handler_ || this))
  }return this
};
a.listenWithWrapper = function(b, c, d, e, f) {
  c.listen(b, d, e, f || this.handler_, this);
  return this
};
a.recordListenerKey_ = function(b) {
  if(this.keys_) {
    this.keys_[b] = true
  }else {
    if(this.key_) {
      this.keys_ = goog.events.EventHandler.keyPool_.getObject();
      this.keys_[this.key_] = true;
      this.key_ = null;
      this.keys_[b] = true
    }else {
      this.key_ = b
    }
  }
};
a.unlisten = function(b, c, d, e, f) {
  if(this.key_ || this.keys_) {
    if(goog.isArray(c)) {
      for(var g = 0;g < c.length;g++) {
        this.unlisten(b, c[g], d, e, f)
      }
    }else {
      if(b = goog.events.getListener(b, c, d || this, e || false, f || this.handler_ || this)) {
        b = b.key;
        goog.events.unlistenByKey(b);
        if(this.keys_) {
          goog.object.remove(this.keys_, b)
        }else {
          if(this.key_ == b) {
            this.key_ = null
          }
        }
      }
    }
  }return this
};
a.unlistenWithWrapper = function(b, c, d, e, f) {
  c.unlisten(b, d, e, f || this.handler_, this);
  return this
};
a.removeAll = function() {
  if(this.keys_) {
    for(var b in this.keys_) {
      goog.events.unlistenByKey(b);
      delete this.keys_[b]
    }goog.events.EventHandler.keyPool_.releaseObject(this.keys_);
    this.keys_ = null
  }else {
    this.key_ && goog.events.unlistenByKey(this.key_)
  }
};
a.disposeInternal = function() {
  goog.events.EventHandler.superClass_.disposeInternal.call(this);
  this.removeAll()
};
a.handleEvent = function() {
  throw Error("EventHandler.handleEvent not implemented");
};goog.ui = {};
goog.ui.IdGenerator = function() {
};
goog.addSingletonGetter(goog.ui.IdGenerator);
goog.ui.IdGenerator.prototype.nextId_ = 0;
goog.ui.IdGenerator.prototype.getNextUniqueId = function() {
  return":" + (this.nextId_++).toString(36)
};
goog.ui.IdGenerator.instance = goog.ui.IdGenerator.getInstance();goog.ui.Component = function(b) {
  goog.events.EventTarget.call(this);
  this.dom_ = b || goog.dom.getDomHelper();
  this.rightToLeft_ = goog.ui.Component.defaultRightToLeft_
};
goog.inherits(goog.ui.Component, goog.events.EventTarget);
goog.ui.Component.prototype.idGenerator_ = goog.ui.IdGenerator.getInstance();
goog.ui.Component.defaultRightToLeft_ = null;
goog.ui.Component.EventType = {BEFORE_SHOW:"beforeshow", SHOW:"show", HIDE:"hide", DISABLE:"disable", ENABLE:"enable", HIGHLIGHT:"highlight", UNHIGHLIGHT:"unhighlight", ACTIVATE:"activate", DEACTIVATE:"deactivate", SELECT:"select", UNSELECT:"unselect", CHECK:"check", UNCHECK:"uncheck", FOCUS:"focus", BLUR:"blur", OPEN:"open", CLOSE:"close", ENTER:"enter", LEAVE:"leave", ACTION:"action", CHANGE:"change"};
goog.ui.Component.Error = {NOT_SUPPORTED:"Method not supported", DECORATE_INVALID:"Invalid element to decorate", ALREADY_RENDERED:"Component already rendered", PARENT_UNABLE_TO_BE_SET:"Unable to set parent component", CHILD_INDEX_OUT_OF_BOUNDS:"Child component index out of bounds", NOT_OUR_CHILD:"Child is not in parent component", NOT_IN_DOCUMENT:"Operation not supported while component is not in document", STATE_INVALID:"Invalid component state"};
goog.ui.Component.State = {ALL:255, DISABLED:1, HOVER:2, ACTIVE:4, SELECTED:8, CHECKED:16, FOCUSED:32, OPENED:64};
goog.ui.Component.getStateTransitionEvent = function(b, c) {
  switch(b) {
    case goog.ui.Component.State.DISABLED:
      return c ? goog.ui.Component.EventType.DISABLE : goog.ui.Component.EventType.ENABLE;
    case goog.ui.Component.State.HOVER:
      return c ? goog.ui.Component.EventType.HIGHLIGHT : goog.ui.Component.EventType.UNHIGHLIGHT;
    case goog.ui.Component.State.ACTIVE:
      return c ? goog.ui.Component.EventType.ACTIVATE : goog.ui.Component.EventType.DEACTIVATE;
    case goog.ui.Component.State.SELECTED:
      return c ? goog.ui.Component.EventType.SELECT : goog.ui.Component.EventType.UNSELECT;
    case goog.ui.Component.State.CHECKED:
      return c ? goog.ui.Component.EventType.CHECK : goog.ui.Component.EventType.UNCHECK;
    case goog.ui.Component.State.FOCUSED:
      return c ? goog.ui.Component.EventType.FOCUS : goog.ui.Component.EventType.BLUR;
    case goog.ui.Component.State.OPENED:
      return c ? goog.ui.Component.EventType.OPEN : goog.ui.Component.EventType.CLOSE;
    default:
  }
  throw Error(goog.ui.Component.Error.STATE_INVALID);
};
goog.ui.Component.setDefaultRightToLeft = function(b) {
  goog.ui.Component.defaultRightToLeft_ = b
};
a = goog.ui.Component.prototype;
a.id_ = null;
a.dom_ = null;
a.inDocument_ = false;
a.element_ = null;
a.rightToLeft_ = null;
a.model_ = null;
a.parent_ = null;
a.children_ = null;
a.childIndex_ = null;
a.wasDecorated_ = false;
a.getId = function() {
  return this.id_ || (this.id_ = this.idGenerator_.getNextUniqueId())
};
a.setId = function(b) {
  if(this.parent_ && this.parent_.childIndex_) {
    goog.object.remove(this.parent_.childIndex_, this.id_);
    goog.object.add(this.parent_.childIndex_, b, this)
  }this.id_ = b
};
a.getElement = function() {
  return this.element_
};
a.setElementInternal = function(b) {
  this.element_ = b
};
a.getHandler = function() {
  return this.googUiComponentHandler_ || (this.googUiComponentHandler_ = new goog.events.EventHandler(this))
};
a.setParent = function(b) {
  if(this == b) {
    throw Error(goog.ui.Component.Error.PARENT_UNABLE_TO_BE_SET);
  }if(b && this.parent_ && this.id_ && this.parent_.getChild(this.id_) && this.parent_ != b) {
    throw Error(goog.ui.Component.Error.PARENT_UNABLE_TO_BE_SET);
  }this.parent_ = b;
  goog.ui.Component.superClass_.setParentEventTarget.call(this, b)
};
a.getParent = function() {
  return this.parent_
};
a.setParentEventTarget = function(b) {
  if(this.parent_ && this.parent_ != b) {
    throw Error(goog.ui.Component.Error.NOT_SUPPORTED);
  }goog.ui.Component.superClass_.setParentEventTarget.call(this, b)
};
a.getDomHelper = function() {
  return this.dom_
};
a.isInDocument = function() {
  return this.inDocument_
};
a.createDom = function() {
  this.element_ = this.dom_.createElement("div")
};
a.render = function(b) {
  this.render_(b)
};
a.renderBefore = function(b) {
  this.render_(b.parentNode, b)
};
a.render_ = function(b, c) {
  if(this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }this.element_ || this.createDom();
  b ? b.insertBefore(this.element_, c || null) : this.dom_.getDocument().body.appendChild(this.element_);
  if(!this.parent_ || this.parent_.isInDocument()) {
    this.enterDocument()
  }
};
a.decorate = function(b) {
  if(this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }else {
    if(b && this.canDecorate(b)) {
      this.wasDecorated_ = true;
      if(!this.dom_ || this.dom_.getDocument() != goog.dom.getOwnerDocument(b)) {
        this.dom_ = goog.dom.getDomHelper(b)
      }this.decorateInternal(b);
      this.enterDocument()
    }else {
      throw Error(goog.ui.Component.Error.DECORATE_INVALID);
    }
  }
};
a.canDecorate = function() {
  return true
};
a.wasDecorated = function() {
  return this.wasDecorated_
};
a.decorateInternal = function(b) {
  this.element_ = b
};
a.enterDocument = function() {
  this.inDocument_ = true;
  this.forEachChild(function(b) {
    !b.isInDocument() && b.getElement() && b.enterDocument()
  })
};
a.exitDocument = function() {
  this.forEachChild(function(b) {
    b.isInDocument() && b.exitDocument()
  });
  this.googUiComponentHandler_ && this.googUiComponentHandler_.removeAll();
  this.inDocument_ = false
};
a.disposeInternal = function() {
  goog.ui.Component.superClass_.disposeInternal.call(this);
  this.inDocument_ && this.exitDocument();
  if(this.googUiComponentHandler_) {
    this.googUiComponentHandler_.dispose();
    delete this.googUiComponentHandler_
  }this.forEachChild(function(b) {
    b.dispose()
  });
  !this.wasDecorated_ && this.element_ && goog.dom.removeNode(this.element_);
  this.parent_ = this.model_ = this.element_ = this.childIndex_ = this.children_ = null
};
a.makeId = function(b) {
  return this.getId() + "." + b
};
a.getModel = function() {
  return this.model_
};
a.setModel = function(b) {
  this.model_ = b
};
a.getFragmentFromId = function(b) {
  return b.substring(this.getId().length + 1)
};
a.getElementByFragment = function(b) {
  if(!this.inDocument_) {
    throw Error(goog.ui.Component.Error.NOT_IN_DOCUMENT);
  }return this.dom_.getElement(this.makeId(b))
};
a.addChild = function(b, c) {
  this.addChildAt(b, this.getChildCount(), c)
};
a.addChildAt = function(b, c, d) {
  if(b.inDocument_ && (d || !this.inDocument_)) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }if(c < 0 || c > this.getChildCount()) {
    throw Error(goog.ui.Component.Error.CHILD_INDEX_OUT_OF_BOUNDS);
  }if(!this.childIndex_ || !this.children_) {
    this.childIndex_ = {};
    this.children_ = []
  }if(b.getParent() == this) {
    goog.object.set(this.childIndex_, b.getId(), b);
    goog.array.remove(this.children_, b)
  }else {
    goog.object.add(this.childIndex_, b.getId(), b)
  }b.setParent(this);
  goog.array.insertAt(this.children_, b, c);
  if(b.inDocument_ && this.inDocument_ && b.getParent() == this) {
    d = this.getContentElement();
    d.insertBefore(b.getElement(), d.childNodes[c] || null)
  }else {
    if(d) {
      this.element_ || this.createDom();
      c = this.getChildAt(c + 1);
      b.render_(this.getContentElement(), c ? c.element_ : null)
    }else {
      this.inDocument_ && !b.inDocument_ && b.element_ && b.enterDocument()
    }
  }
};
a.getContentElement = function() {
  return this.element_
};
a.isRightToLeft = function() {
  if(this.rightToLeft_ == null) {
    this.rightToLeft_ = goog.style.isRightToLeft(this.inDocument_ ? this.element_ : this.dom_.getDocument().body)
  }return this.rightToLeft_
};
a.setRightToLeft = function(b) {
  if(this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }this.rightToLeft_ = b
};
a.hasChildren = function() {
  return!!this.children_ && this.children_.length != 0
};
a.getChildCount = function() {
  return this.children_ ? this.children_.length : 0
};
a.getChildIds = function() {
  var b = [];
  this.forEachChild(function(c) {
    b.push(c.getId())
  });
  return b
};
a.getChild = function(b) {
  return this.childIndex_ && b ? goog.object.get(this.childIndex_, b) || null : null
};
a.getChildAt = function(b) {
  return this.children_ ? this.children_[b] || null : null
};
a.forEachChild = function(b, c) {
  this.children_ && goog.array.forEach(this.children_, b, c)
};
a.indexOfChild = function(b) {
  return this.children_ && b ? goog.array.indexOf(this.children_, b) : -1
};
a.removeChild = function(b, c) {
  if(b) {
    var d = goog.isString(b) ? b : b.getId();
    b = this.getChild(d);
    if(d && b) {
      goog.object.remove(this.childIndex_, d);
      goog.array.remove(this.children_, b);
      if(c) {
        b.exitDocument();
        b.element_ && goog.dom.removeNode(b.element_)
      }b.setParent(null)
    }
  }if(!b) {
    throw Error(goog.ui.Component.Error.NOT_OUR_CHILD);
  }return b
};
a.removeChildAt = function(b, c) {
  return this.removeChild(this.getChildAt(b), c)
};
a.removeChildren = function(b) {
  for(;this.hasChildren();) {
    this.removeChildAt(0, b)
  }
};goog.graphics.AbstractGraphics = function(b, c, d, e, f) {
  goog.ui.Component.call(this, f);
  this.width = b;
  this.height = c;
  this.coordWidth = d || null;
  this.coordHeight = e || null
};
goog.inherits(goog.graphics.AbstractGraphics, goog.ui.Component);
a = goog.graphics.AbstractGraphics.prototype;
a.canvasElement = null;
a.coordLeft = 0;
a.coordTop = 0;
a.getCanvasElement = function() {
  return this.canvasElement
};
a.setCoordSize = function(b, c) {
  this.coordWidth = b;
  this.coordHeight = c
};
a.getCoordSize = function() {
  return this.coordWidth ? new goog.math.Size(this.coordWidth, this.coordHeight) : this.getPixelSize()
};
a.getCoordOrigin = function() {
  return new goog.math.Coordinate(this.coordLeft, this.coordTop)
};
a.getSize = function() {
  return this.getPixelSize()
};
a.getPixelSize = function() {
  if(this.isInDocument()) {
    return goog.style.getSize(this.getElement())
  }if(goog.isNumber(this.width) && goog.isNumber(this.height)) {
    return new goog.math.Size(this.width, this.height)
  }return null
};
a.getPixelScaleX = function() {
  var b = this.getPixelSize();
  return b ? b.width / this.getCoordSize().width : 0
};
a.getPixelScaleY = function() {
  var b = this.getPixelSize();
  return b ? b.height / this.getCoordSize().height : 0
};
a.removeElement = function(b) {
  goog.dom.removeNode(b.getElement())
};
a.drawCircle = function(b, c, d, e, f, g) {
  return this.drawEllipse(b, c, d, d, e, f, g)
};
a.drawText = function(b, c, d, e, f, g, h, j, k, l, m) {
  var n = j.size / 2;
  d = h == "bottom" ? d + f - n : h == "center" ? d + f / 2 : d + n;
  return this.drawTextOnLine(b, c, d, c + e, d, g, j, k, l, m)
};
a.createPath = function() {
  return new goog.graphics.Path
};
a.isDomClonable = function() {
  return false
};
a.suspend = function() {
};
a.resume = function() {
};goog.graphics.AffineTransform = function(b, c, d, e, f, g) {
  if(arguments.length == 6) {
    this.setTransform(b, c, d, e, f, g)
  }else {
    if(arguments.length != 0) {
      throw Error("Insufficient matrix parameters");
    }else {
      this.m00_ = this.m11_ = 1;
      this.m10_ = this.m01_ = this.m02_ = this.m12_ = 0
    }
  }
};
a = goog.graphics.AffineTransform.prototype;
a.isIdentity = function() {
  return this.m00_ == 1 && this.m10_ == 0 && this.m01_ == 0 && this.m11_ == 1 && this.m02_ == 0 && this.m12_ == 0
};
a.clone = function() {
  return new goog.graphics.AffineTransform(this.m00_, this.m10_, this.m01_, this.m11_, this.m02_, this.m12_)
};
a.setTransform = function(b, c, d, e, f, g) {
  if(!goog.isNumber(b) || !goog.isNumber(c) || !goog.isNumber(d) || !goog.isNumber(e) || !goog.isNumber(f) || !goog.isNumber(g)) {
    throw Error("Invalid transform parameters");
  }this.m00_ = b;
  this.m10_ = c;
  this.m01_ = d;
  this.m11_ = e;
  this.m02_ = f;
  this.m12_ = g;
  return this
};
a.copyFrom = function(b) {
  this.m00_ = b.m00_;
  this.m10_ = b.m10_;
  this.m01_ = b.m01_;
  this.m11_ = b.m11_;
  this.m02_ = b.m02_;
  this.m12_ = b.m12_;
  return this
};
a.scale = function(b, c) {
  this.m00_ *= b;
  this.m10_ *= b;
  this.m01_ *= c;
  this.m11_ *= c;
  return this
};
a.translate = function(b, c) {
  this.m02_ += b * this.m00_ + c * this.m01_;
  this.m12_ += b * this.m10_ + c * this.m11_;
  return this
};
a.rotate = function(b, c, d) {
  return this.concatenate(goog.graphics.AffineTransform.getRotateInstance(b, c, d))
};
a.shear = function(b, c) {
  var d = this.m00_, e = this.m10_;
  this.m00_ += c * this.m01_;
  this.m10_ += c * this.m11_;
  this.m01_ += b * d;
  this.m11_ += b * e;
  return this
};
a.toString = function() {
  return"matrix(" + [this.m00_, this.m10_, this.m01_, this.m11_, this.m02_, this.m12_].join(",") + ")"
};
a.getScaleX = function() {
  return this.m00_
};
a.getScaleY = function() {
  return this.m11_
};
a.getTranslateX = function() {
  return this.m02_
};
a.getTranslateY = function() {
  return this.m12_
};
a.getShearX = function() {
  return this.m01_
};
a.getShearY = function() {
  return this.m10_
};
a.concatenate = function(b) {
  var c = this.m00_, d = this.m01_;
  this.m00_ = b.m00_ * c + b.m10_ * d;
  this.m01_ = b.m01_ * c + b.m11_ * d;
  this.m02_ += b.m02_ * c + b.m12_ * d;
  c = this.m10_;
  d = this.m11_;
  this.m10_ = b.m00_ * c + b.m10_ * d;
  this.m11_ = b.m01_ * c + b.m11_ * d;
  this.m12_ += b.m02_ * c + b.m12_ * d;
  return this
};
a.preConcatenate = function(b) {
  var c = this.m00_, d = this.m10_;
  this.m00_ = b.m00_ * c + b.m01_ * d;
  this.m10_ = b.m10_ * c + b.m11_ * d;
  c = this.m01_;
  d = this.m11_;
  this.m01_ = b.m00_ * c + b.m01_ * d;
  this.m11_ = b.m10_ * c + b.m11_ * d;
  c = this.m02_;
  d = this.m12_;
  this.m02_ = b.m00_ * c + b.m01_ * d + b.m02_;
  this.m12_ = b.m10_ * c + b.m11_ * d + b.m12_;
  return this
};
a.transform = function(b, c, d, e, f) {
  var g = c;
  e = e;
  for(c = c + 2 * f;g < c;) {
    f = b[g++];
    var h = b[g++];
    d[e++] = f * this.m00_ + h * this.m01_ + this.m02_;
    d[e++] = f * this.m10_ + h * this.m11_ + this.m12_
  }
};
a.getDeterminant = function() {
  return this.m00_ * this.m11_ - this.m01_ * this.m10_
};
a.isInvertible = function() {
  var b = this.getDeterminant();
  return goog.math.isFiniteNumber(b) && goog.math.isFiniteNumber(this.m02_) && goog.math.isFiniteNumber(this.m12_) && b != 0
};
a.createInverse = function() {
  var b = this.getDeterminant();
  return new goog.graphics.AffineTransform(this.m11_ / b, -this.m10_ / b, -this.m01_ / b, this.m00_ / b, (this.m01_ * this.m12_ - this.m11_ * this.m02_) / b, (this.m10_ * this.m02_ - this.m00_ * this.m12_) / b)
};
goog.graphics.AffineTransform.getScaleInstance = function(b, c) {
  return(new goog.graphics.AffineTransform).setToScale(b, c)
};
goog.graphics.AffineTransform.getTranslateInstance = function(b, c) {
  return(new goog.graphics.AffineTransform).setToTranslation(b, c)
};
goog.graphics.AffineTransform.getShearInstance = function(b, c) {
  return(new goog.graphics.AffineTransform).setToShear(b, c)
};
goog.graphics.AffineTransform.getRotateInstance = function(b, c, d) {
  return(new goog.graphics.AffineTransform).setToRotation(b, c, d)
};
a = goog.graphics.AffineTransform.prototype;
a.setToScale = function(b, c) {
  return this.setTransform(b, 0, 0, c, 0, 0)
};
a.setToTranslation = function(b, c) {
  return this.setTransform(1, 0, 0, 1, b, c)
};
a.setToShear = function(b, c) {
  return this.setTransform(1, c, b, 1, 0, 0)
};
a.setToRotation = function(b, c, d) {
  var e = Math.cos(b);
  b = Math.sin(b);
  return this.setTransform(e, b, -b, e, c - c * e + d * b, d - c * b - d * e)
};
a.equals = function(b) {
  if(this == b) {
    return true
  }if(!b) {
    return false
  }return this.m00_ == b.m00_ && this.m01_ == b.m01_ && this.m02_ == b.m02_ && this.m10_ == b.m10_ && this.m11_ == b.m11_ && this.m12_ == b.m12_
};goog.graphics.Element = function(b, c) {
  goog.events.EventTarget.call(this);
  this.element_ = b;
  this.graphics_ = c;
  this.customEvent_ = false
};
goog.inherits(goog.graphics.Element, goog.events.EventTarget);
a = goog.graphics.Element.prototype;
a.graphics_ = null;
a.element_ = null;
a.transform_ = null;
a.getElement = function() {
  return this.element_
};
a.getGraphics = function() {
  return this.graphics_
};
a.setTransformation = function(b, c, d, e, f) {
  this.transform_ = goog.graphics.AffineTransform.getRotateInstance(goog.math.toRadians(d), e, f).translate(b, c);
  this.getGraphics().setElementTransform(this, b, c, d, e, f)
};
a.getTransform = function() {
  return this.transform_ ? this.transform_.clone() : new goog.graphics.AffineTransform
};
a.addEventListener = function(b, c, d, e) {
  goog.events.listen(this.element_, b, c, d, e)
};
a.removeEventListener = function(b, c, d, e) {
  goog.events.unlisten(this.element_, b, c, d, e)
};
a.disposeInternal = function() {
  goog.graphics.Element.superClass_.disposeInternal.call(this);
  goog.events.removeAll(this.element_)
};goog.graphics.StrokeAndFillElement = function(b, c, d, e) {
  goog.graphics.Element.call(this, b, c);
  this.setStroke(d);
  this.setFill(e)
};
goog.inherits(goog.graphics.StrokeAndFillElement, goog.graphics.Element);
a = goog.graphics.StrokeAndFillElement.prototype;
a.fill_ = null;
a.stroke_ = null;
a.setFill = function(b) {
  this.fill_ = b;
  this.getGraphics().setElementFill(this, b)
};
a.getFill = function() {
  return this.fill_
};
a.setStroke = function(b) {
  this.stroke_ = b;
  this.getGraphics().setElementStroke(this, b)
};
a.getStroke = function() {
  return this.stroke_
};
a.reapplyStroke = function() {
  this.stroke_ && this.setStroke(this.stroke_)
};goog.graphics.EllipseElement = function(b, c, d, e) {
  goog.graphics.StrokeAndFillElement.call(this, b, c, d, e)
};
goog.inherits(goog.graphics.EllipseElement, goog.graphics.StrokeAndFillElement);goog.graphics.GroupElement = function(b, c) {
  goog.graphics.Element.call(this, b, c)
};
goog.inherits(goog.graphics.GroupElement, goog.graphics.Element);goog.graphics.ImageElement = function(b, c) {
  goog.graphics.Element.call(this, b, c)
};
goog.inherits(goog.graphics.ImageElement, goog.graphics.Element);goog.graphics.PathElement = function(b, c, d, e) {
  goog.graphics.StrokeAndFillElement.call(this, b, c, d, e)
};
goog.inherits(goog.graphics.PathElement, goog.graphics.StrokeAndFillElement);goog.graphics.RectElement = function(b, c, d, e) {
  goog.graphics.StrokeAndFillElement.call(this, b, c, d, e)
};
goog.inherits(goog.graphics.RectElement, goog.graphics.StrokeAndFillElement);goog.graphics.TextElement = function(b, c, d, e) {
  goog.graphics.StrokeAndFillElement.call(this, b, c, d, e)
};
goog.inherits(goog.graphics.TextElement, goog.graphics.StrokeAndFillElement);goog.graphics.CanvasGroupElement = function(b) {
  goog.graphics.GroupElement.call(this, null, b);
  this.children_ = []
};
goog.inherits(goog.graphics.CanvasGroupElement, goog.graphics.GroupElement);
goog.graphics.CanvasGroupElement.prototype.clear = function() {
  if(this.children_.length) {
    this.children_.length = 0;
    this.getGraphics().redraw()
  }
};
goog.graphics.CanvasGroupElement.prototype.setSize = function() {
};
goog.graphics.CanvasGroupElement.prototype.appendChild = function(b) {
  this.children_.push(b)
};
goog.graphics.CanvasGroupElement.prototype.draw = function() {
  for(var b = 0, c = this.children_.length;b < c;b++) {
    this.getGraphics().drawElement(this.children_[b])
  }
};
goog.graphics.CanvasEllipseElement = function(b, c, d, e, f, g, h, j) {
  goog.graphics.EllipseElement.call(this, b, c, h, j);
  this.cx_ = d;
  this.cy_ = e;
  this.rx_ = f;
  this.ry_ = g;
  this.path_ = new goog.graphics.Path;
  this.setUpPath_();
  this.pathElement_ = new goog.graphics.CanvasPathElement(null, c, this.path_, h, j)
};
goog.inherits(goog.graphics.CanvasEllipseElement, goog.graphics.EllipseElement);
goog.graphics.CanvasEllipseElement.prototype.setUpPath_ = function() {
  this.path_.clear();
  this.path_.arc(this.cx_, this.cy_, this.rx_, this.ry_, 0, 360, false);
  this.path_.close()
};
goog.graphics.CanvasEllipseElement.prototype.setCenter = function(b, c) {
  this.cx_ = b;
  this.cy_ = c;
  this.setUpPath_();
  this.pathElement_.setPath(this.path_)
};
goog.graphics.CanvasEllipseElement.prototype.setRadius = function(b, c) {
  this.rx_ = b;
  this.ry_ = c;
  this.setUpPath_();
  this.pathElement_.setPath(this.path_)
};
goog.graphics.CanvasEllipseElement.prototype.draw = function(b) {
  this.pathElement_.draw(b)
};
goog.graphics.CanvasRectElement = function(b, c, d, e, f, g, h, j) {
  goog.graphics.RectElement.call(this, b, c, h, j);
  this.x_ = d;
  this.y_ = e;
  this.w_ = f;
  this.h_ = g
};
goog.inherits(goog.graphics.CanvasRectElement, goog.graphics.RectElement);
goog.graphics.CanvasRectElement.prototype.setPosition = function(b, c) {
  this.x_ = b;
  this.y_ = c;
  this.drawn_ && this.getGraphics().redraw()
};
goog.graphics.CanvasRectElement.prototype.drawn_ = false;
goog.graphics.CanvasRectElement.prototype.setSize = function(b, c) {
  this.w_ = b;
  this.h_ = c;
  this.drawn_ && this.getGraphics().redraw()
};
goog.graphics.CanvasRectElement.prototype.draw = function(b) {
  this.drawn_ = true;
  b.beginPath();
  b.moveTo(this.x_, this.y_);
  b.lineTo(this.x_, this.y_ + this.h_);
  b.lineTo(this.x_ + this.w_, this.y_ + this.h_);
  b.lineTo(this.x_ + this.w_, this.y_);
  b.closePath()
};
goog.graphics.CanvasPathElement = function(b, c, d, e, f) {
  goog.graphics.PathElement.call(this, b, c, e, f);
  this.setPath(d)
};
goog.inherits(goog.graphics.CanvasPathElement, goog.graphics.PathElement);
goog.graphics.CanvasPathElement.prototype.drawn_ = false;
goog.graphics.CanvasPathElement.prototype.setPath = function(b) {
  this.path_ = b.isSimple() ? b : goog.graphics.Path.createSimplifiedPath(b);
  this.drawn_ && this.getGraphics().redraw()
};
goog.graphics.CanvasPathElement.prototype.draw = function(b) {
  this.drawn_ = true;
  b.beginPath();
  this.path_.forEachSegment(function(c, d) {
    switch(c) {
      case goog.graphics.Path.Segment.MOVETO:
        b.moveTo(d[0], d[1]);
        break;
      case goog.graphics.Path.Segment.LINETO:
        for(c = 0;c < d.length;c += 2) {
          b.lineTo(d[c], d[c + 1])
        }break;
      case goog.graphics.Path.Segment.CURVETO:
        for(c = 0;c < d.length;c += 6) {
          b.bezierCurveTo(d[c], d[c + 1], d[c + 2], d[c + 3], d[c + 4], d[c + 5])
        }break;
      case goog.graphics.Path.Segment.ARCTO:
        throw Error("Canvas paths cannot contain arcs");;
      case goog.graphics.Path.Segment.CLOSE:
        b.closePath();
        break
    }
  })
};
goog.graphics.CanvasTextElement = function(b, c, d, e, f, g, h, j, k, l) {
  goog.graphics.TextElement.call(this, null, b, k, l);
  this.text_ = c;
  this.x1_ = d;
  this.y1_ = e;
  this.x2_ = f;
  this.y2_ = g;
  this.align_ = h || "left";
  this.font_ = j;
  this.element_ = goog.dom.createDom("DIV", {style:"display:table;position:absolute;padding:0;margin:0;border:0"});
  this.innerElement_ = goog.dom.createDom("DIV", {style:"display:table-cell;padding: 0;margin: 0;border: 0"});
  this.updateStyle_();
  this.updateText_();
  b.getElement().appendChild(this.element_);
  this.element_.appendChild(this.innerElement_)
};
goog.inherits(goog.graphics.CanvasTextElement, goog.graphics.TextElement);
a = goog.graphics.CanvasTextElement.prototype;
a.setText = function(b) {
  this.text_ = b;
  this.updateText_()
};
a.setFill = function(b) {
  this.fill_ = b;
  if(this.element_) {
    this.element_.style.color = b.getColor() || b.getColor1()
  }
};
a.setStroke = function() {
};
a.draw = function() {
};
a.updateStyle_ = function() {
  var b = this.x1_, c = this.x2_, d = this.y1_, e = this.y2_, f = this.align_, g = this.font_, h = this.element_.style, j = this.getGraphics().getPixelScaleX(), k = this.getGraphics().getPixelScaleY();
  if(b == c) {
    h.lineHeight = "90%";
    this.innerElement_.style.verticalAlign = f == "center" ? "middle" : f == "left" ? d < e ? "top" : "bottom" : d < e ? "bottom" : "top";
    h.textAlign = "center";
    c = g.size * j;
    h.top = Math.round(Math.min(d, e) * k) + "px";
    h.left = Math.round((b - c / 2) * j) + "px";
    h.width = Math.round(c) + "px";
    h.height = Math.abs(d - e) * k + "px";
    h.fontSize = g.size * 0.6 * k + "pt"
  }else {
    h.lineHeight = "100%";
    this.innerElement_.style.verticalAlign = "top";
    h.textAlign = f;
    h.top = Math.round(((d + e) / 2 - g.size * 2 / 3) * k) + "px";
    h.left = Math.round(b * j) + "px";
    h.width = Math.round(Math.abs(c - b) * j) + "px";
    h.height = "auto";
    h.fontSize = g.size * k + "pt"
  }h.fontWeight = g.bold ? "bold" : "normal";
  h.fontStyle = g.italic ? "italic" : "normal";
  h.fontFamily = g.family;
  b = this.getFill();
  h.color = b.getColor() || b.getColor1()
};
a.updateText_ = function() {
  this.innerElement_.innerHTML = this.x1_ == this.x2_ ? goog.array.map(this.text_.split(""), goog.string.htmlEscape).join("<br>") : goog.string.htmlEscape(this.text_)
};
goog.graphics.CanvasImageElement = function(b, c, d, e, f, g, h) {
  goog.graphics.ImageElement.call(this, b, c);
  this.x_ = d;
  this.y_ = e;
  this.w_ = f;
  this.h_ = g;
  this.src_ = h
};
goog.inherits(goog.graphics.CanvasImageElement, goog.graphics.ImageElement);
a = goog.graphics.CanvasImageElement.prototype;
a.drawn_ = false;
a.setPosition = function(b, c) {
  this.x_ = b;
  this.y_ = c;
  this.drawn_ && this.getGraphics().redraw()
};
a.setSize = function(b, c) {
  this.w_ = b;
  this.h_ = c;
  this.drawn_ && this.getGraphics().redraw()
};
a.setSource = function(b) {
  this.src_ = b;
  this.drawn_ && this.getGraphics().redraw()
};
a.draw = function(b) {
  if(this.img_) {
    this.w_ && this.h_ && b.drawImage(this.img_, this.x_, this.y_, this.w_, this.h_);
    this.drawn_ = true
  }else {
    b = new Image;
    b.onload = goog.bind(this.handleImageLoad_, this, b);
    b.src = this.src_
  }
};
a.handleImageLoad_ = function(b) {
  this.img_ = b;
  this.getGraphics().redraw()
};goog.graphics.Font = function(b, c) {
  this.size = b;
  this.family = c
};
goog.graphics.Font.prototype.bold = false;
goog.graphics.Font.prototype.italic = false;goog.graphics.Fill = function() {
};goog.graphics.LinearGradient = function(b, c, d, e, f, g) {
  this.x1_ = b;
  this.y1_ = c;
  this.x2_ = d;
  this.y2_ = e;
  this.color1_ = f;
  this.color2_ = g
};
goog.inherits(goog.graphics.LinearGradient, goog.graphics.Fill);
a = goog.graphics.LinearGradient.prototype;
a.getX1 = function() {
  return this.x1_
};
a.getY1 = function() {
  return this.y1_
};
a.getX2 = function() {
  return this.x2_
};
a.getY2 = function() {
  return this.y2_
};
a.getColor1 = function() {
  return this.color1_
};
a.getColor2 = function() {
  return this.color2_
};goog.graphics.SolidFill = function(b, c) {
  this.color_ = b;
  this.opacity_ = c || 1
};
goog.inherits(goog.graphics.SolidFill, goog.graphics.Fill);
goog.graphics.SolidFill.prototype.getColor = function() {
  return this.color_
};
goog.graphics.SolidFill.prototype.getOpacity = function() {
  return this.opacity_
};goog.graphics.Stroke = function(b, c) {
  this.width_ = b;
  this.color_ = c
};
goog.graphics.Stroke.prototype.getWidth = function() {
  return this.width_
};
goog.graphics.Stroke.prototype.getColor = function() {
  return this.color_
};goog.graphics.CanvasGraphics = function(b, c, d, e, f) {
  goog.graphics.AbstractGraphics.call(this, b, c, d, e, f)
};
goog.inherits(goog.graphics.CanvasGraphics, goog.graphics.AbstractGraphics);
a = goog.graphics.CanvasGraphics.prototype;
a.setElementFill = function() {
  this.redraw()
};
a.setElementStroke = function() {
  this.redraw()
};
a.setElementTransform = function() {
  this.redraw()
};
a.pushElementTransform = function(b) {
  var c = this.getContext();
  c.save();
  b = b.getTransform();
  var d = b.getTranslateX(), e = b.getTranslateY();
  if(d || e) {
    c.translate(d, e)
  }(b = b.getShearY()) && c.rotate(Math.asin(b))
};
a.popElementTransform = function() {
  this.getContext().restore()
};
a.createDom = function() {
  var b = this.dom_.createDom("div", {style:"position:relative;overflow:hidden"});
  this.setElementInternal(b);
  this.canvas_ = this.dom_.createDom("canvas");
  b.appendChild(this.canvas_);
  this.lastGroup_ = this.canvasElement = new goog.graphics.CanvasGroupElement(this);
  this.redrawTimeout_ = 0;
  this.updateSize()
};
a.clearContext_ = function() {
  this.context_ = null
};
a.getContext = function() {
  this.getElement() || this.createDom();
  if(!this.context_) {
    this.context_ = this.canvas_.getContext("2d");
    this.context_.save()
  }return this.context_
};
a.setCoordOrigin = function(b, c) {
  this.coordLeft = b;
  this.coordTop = c;
  this.redraw()
};
a.setCoordSize = function() {
  goog.graphics.CanvasGraphics.superClass_.setCoordSize.apply(this, arguments);
  this.redraw()
};
a.setSize = function(b, c) {
  this.width = b;
  this.height = c;
  this.updateSize();
  this.redraw()
};
a.getPixelSize = function() {
  var b = this.width, c = this.height, d = goog.isString(b) && b.indexOf("%") != -1, e = goog.isString(c) && c.indexOf("%") != -1;
  if(!this.isInDocument() && (d || e)) {
    return null
  }var f, g;
  if(d) {
    f = this.getElement().parentNode;
    g = goog.style.getSize(f);
    b = parseFloat(b) * g.width / 100
  }if(e) {
    f = f || this.getElement().parentNode;
    g = g || goog.style.getSize(f);
    c = parseFloat(c) * g.height / 100
  }return new goog.math.Size(b, c)
};
a.updateSize = function() {
  goog.style.setSize(this.getElement(), this.width, this.height);
  var b = this.getPixelSize();
  if(b) {
    goog.style.setSize(this.canvas_, b.width, b.height);
    this.canvas_.width = b.width;
    this.canvas_.height = b.height;
    this.clearContext_()
  }
};
a.reset = function() {
  var b = this.getContext();
  b.restore();
  var c = this.getPixelSize();
  c.width && c.height && b.clearRect(0, 0, c.width, c.height);
  b.save()
};
a.clear = function() {
  this.reset();
  this.canvasElement.clear();
  for(var b = this.getElement();b.childNodes.length > 1;) {
    b.removeChild(b.lastChild)
  }
};
a.redraw = function() {
  if(this.preventRedraw_) {
    this.needsRedraw_ = true
  }else {
    if(this.isInDocument()) {
      this.reset();
      if(this.coordWidth) {
        var b = this.getPixelSize();
        this.getContext().scale(b.width / this.coordWidth, b.height / this.coordHeight)
      }if(this.coordLeft || this.coordTop) {
        this.getContext().translate(-this.coordLeft, -this.coordTop)
      }this.pushElementTransform(this.canvasElement);
      this.canvasElement.draw(this.context_);
      this.popElementTransform()
    }
  }
};
a.drawElement = function(b) {
  if(!(b instanceof goog.graphics.CanvasTextElement)) {
    var c = this.getContext();
    this.pushElementTransform(b);
    if(!b.getFill || !b.getStroke) {
      b.draw(c)
    }else {
      var d = b.getFill();
      if(d) {
        if(d instanceof goog.graphics.SolidFill) {
          if(d.getOpacity() != 0) {
            c.globalAlpha = d.getOpacity();
            c.fillStyle = d.getColor();
            b.draw(c);
            c.fill();
            c.globalAlpha = 1
          }
        }else {
          var e = c.createLinearGradient(d.getX1(), d.getY1(), d.getX2(), d.getY2());
          e.addColorStop(0, d.getColor1());
          e.addColorStop(1, d.getColor2());
          c.fillStyle = e;
          b.draw(c);
          c.fill()
        }
      }if(d = b.getStroke()) {
        b.draw(c);
        c.strokeStyle = d.getColor();
        b = d.getWidth();
        if(goog.isString(b) && b.indexOf("px") != -1) {
          b = parseFloat(b) / this.getPixelScaleX()
        }c.lineWidth = b;
        c.stroke()
      }
    }this.popElementTransform()
  }
};
a.append_ = function(b, c) {
  c = c || this.canvasElement;
  c.appendChild(b);
  this.isDrawable(c) && this.drawElement(b)
};
a.drawEllipse = function(b, c, d, e, f, g, h) {
  b = new goog.graphics.CanvasEllipseElement(null, this, b, c, d, e, f, g);
  this.append_(b, h);
  return b
};
a.drawRect = function(b, c, d, e, f, g, h) {
  b = new goog.graphics.CanvasRectElement(null, this, b, c, d, e, f, g);
  this.append_(b, h);
  return b
};
a.drawImage = function(b, c, d, e, f, g) {
  b = new goog.graphics.CanvasImageElement(null, this, b, c, d, e, f);
  this.append_(b, g);
  return b
};
a.drawTextOnLine = function(b, c, d, e, f, g, h, j, k, l) {
  b = new goog.graphics.CanvasTextElement(this, b, c, d, e, f, g, h, j, k);
  this.append_(b, l);
  return b
};
a.drawPath = function(b, c, d, e) {
  b = new goog.graphics.CanvasPathElement(null, this, b, c, d);
  this.append_(b, e);
  return b
};
a.isDrawable = function(b) {
  return this.isInDocument() && !this.redrawTimeout_ && !this.isRedrawRequired(b)
};
a.isRedrawRequired = function(b) {
  return b != this.canvasElement && b != this.lastGroup_
};
a.createGroup = function(b) {
  var c = new goog.graphics.CanvasGroupElement(this);
  b = b || this.canvasElement;
  if(b == this.canvasElement || b == this.lastGroup_) {
    this.lastGroup_ = c
  }this.append_(c, b);
  return c
};
a.disposeInternal = function() {
  this.context_ = null;
  goog.graphics.CanvasGraphics.superClass_.disposeInternal.call(this)
};
a.enterDocument = function() {
  var b = this.getPixelSize();
  goog.graphics.CanvasGraphics.superClass_.enterDocument.call(this);
  if(!b) {
    this.updateSize();
    this.dispatchEvent(goog.events.EventType.RESIZE)
  }this.redraw()
};
a.suspend = function() {
  this.preventRedraw_ = true
};
a.resume = function() {
  this.preventRedraw_ = false;
  if(this.needsRedraw_) {
    this.redraw();
    this.needsRedraw_ = false
  }
};goog.Timer = function(b, c) {
  goog.events.EventTarget.call(this);
  this.interval_ = b || 1;
  this.timerObject_ = c || goog.Timer.defaultTimerObject;
  this.boundTick_ = goog.bind(this.tick_, this);
  this.last_ = goog.now()
};
goog.inherits(goog.Timer, goog.events.EventTarget);
goog.Timer.MAX_TIMEOUT_ = 2147483647;
goog.Timer.prototype.enabled = false;
goog.Timer.defaultTimerObject = goog.global.window;
goog.Timer.intervalScale = 0.8;
a = goog.Timer.prototype;
a.timer_ = null;
a.getInterval = function() {
  return this.interval_
};
a.setInterval = function(b) {
  this.interval_ = b;
  if(this.timer_ && this.enabled) {
    this.stop();
    this.start()
  }else {
    this.timer_ && this.stop()
  }
};
a.tick_ = function() {
  if(this.enabled) {
    var b = goog.now() - this.last_;
    if(b > 0 && b < this.interval_ * goog.Timer.intervalScale) {
      this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - b)
    }else {
      this.dispatchTick();
      if(this.enabled) {
        this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_);
        this.last_ = goog.now()
      }
    }
  }
};
a.dispatchTick = function() {
  this.dispatchEvent(goog.Timer.TICK)
};
a.start = function() {
  this.enabled = true;
  if(!this.timer_) {
    this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_);
    this.last_ = goog.now()
  }
};
a.stop = function() {
  this.enabled = false;
  if(this.timer_) {
    this.timerObject_.clearTimeout(this.timer_);
    this.timer_ = null
  }
};
a.disposeInternal = function() {
  goog.Timer.superClass_.disposeInternal.call(this);
  this.stop();
  delete this.timerObject_
};
goog.Timer.TICK = "tick";
goog.Timer.callOnce = function(b, c, d) {
  if(goog.isFunction(b)) {
    if(d) {
      b = goog.bind(b, d)
    }
  }else {
    if(b && typeof b.handleEvent == "function") {
      b = goog.bind(b.handleEvent, b)
    }else {
      throw Error("Invalid listener argument");
    }
  }return c > goog.Timer.MAX_TIMEOUT_ ? -1 : goog.Timer.defaultTimerObject.setTimeout(b, c || 0)
};
goog.Timer.clear = function(b) {
  goog.Timer.defaultTimerObject.clearTimeout(b)
};goog.graphics.SvgGroupElement = function(b, c) {
  goog.graphics.GroupElement.call(this, b, c)
};
goog.inherits(goog.graphics.SvgGroupElement, goog.graphics.GroupElement);
goog.graphics.SvgGroupElement.prototype.clear = function() {
  goog.dom.removeChildren(this.getElement())
};
goog.graphics.SvgGroupElement.prototype.setSize = function(b, c) {
  this.getGraphics().setElementAttributes(this.getElement(), {width:b, height:c})
};
goog.graphics.SvgEllipseElement = function(b, c, d, e) {
  goog.graphics.EllipseElement.call(this, b, c, d, e)
};
goog.inherits(goog.graphics.SvgEllipseElement, goog.graphics.EllipseElement);
goog.graphics.SvgEllipseElement.prototype.setCenter = function(b, c) {
  this.getGraphics().setElementAttributes(this.getElement(), {cx:b, cy:c})
};
goog.graphics.SvgEllipseElement.prototype.setRadius = function(b, c) {
  this.getGraphics().setElementAttributes(this.getElement(), {rx:b, ry:c})
};
goog.graphics.SvgRectElement = function(b, c, d, e) {
  goog.graphics.RectElement.call(this, b, c, d, e)
};
goog.inherits(goog.graphics.SvgRectElement, goog.graphics.RectElement);
goog.graphics.SvgRectElement.prototype.setPosition = function(b, c) {
  this.getGraphics().setElementAttributes(this.getElement(), {x:b, y:c})
};
goog.graphics.SvgRectElement.prototype.setSize = function(b, c) {
  this.getGraphics().setElementAttributes(this.getElement(), {width:b, height:c})
};
goog.graphics.SvgPathElement = function(b, c, d, e) {
  goog.graphics.PathElement.call(this, b, c, d, e)
};
goog.inherits(goog.graphics.SvgPathElement, goog.graphics.PathElement);
goog.graphics.SvgPathElement.prototype.setPath = function(b) {
  this.getGraphics().setElementAttributes(this.getElement(), {d:goog.graphics.SvgGraphics.getSvgPath(b)})
};
goog.graphics.SvgTextElement = function(b, c, d, e) {
  goog.graphics.TextElement.call(this, b, c, d, e)
};
goog.inherits(goog.graphics.SvgTextElement, goog.graphics.TextElement);
goog.graphics.SvgTextElement.prototype.setText = function(b) {
  this.getElement().firstChild.data = b
};
goog.graphics.SvgImageElement = function(b, c) {
  goog.graphics.ImageElement.call(this, b, c)
};
goog.inherits(goog.graphics.SvgImageElement, goog.graphics.ImageElement);
goog.graphics.SvgImageElement.prototype.setPosition = function(b, c) {
  this.getGraphics().setElementAttributes(this.getElement(), {x:b, y:c})
};
goog.graphics.SvgImageElement.prototype.setSize = function(b, c) {
  this.getGraphics().setElementAttributes(this.getElement(), {width:b, height:c})
};
goog.graphics.SvgImageElement.prototype.setSource = function(b) {
  this.getGraphics().setElementAttributes(this.getElement(), {"xlink:href":b})
};goog.graphics.SvgGraphics = function(b, c, d, e, f) {
  goog.graphics.AbstractGraphics.call(this, b, c, d, e, f);
  this.defs_ = {};
  this.useManualViewbox_ = goog.userAgent.WEBKIT && !goog.userAgent.isVersion(526);
  this.handler_ = new goog.events.EventHandler(this)
};
goog.inherits(goog.graphics.SvgGraphics, goog.graphics.AbstractGraphics);
goog.graphics.SvgGraphics.SVG_NS_ = "http://www.w3.org/2000/svg";
goog.graphics.SvgGraphics.DEF_ID_PREFIX_ = "_svgdef_";
goog.graphics.SvgGraphics.nextDefId_ = 0;
a = goog.graphics.SvgGraphics.prototype;
a.createSvgElement_ = function(b, c) {
  b = this.dom_.getDocument().createElementNS(goog.graphics.SvgGraphics.SVG_NS_, b);
  c && this.setElementAttributes(b, c);
  return b
};
a.setElementAttributes = function(b, c) {
  for(var d in c) {
    b.setAttribute(d, c[d])
  }
};
a.append_ = function(b, c) {
  (c || this.canvasElement).getElement().appendChild(b.getElement())
};
a.setElementFill = function(b, c) {
  b = b.getElement();
  if(c instanceof goog.graphics.SolidFill) {
    b.setAttribute("fill", c.getColor());
    b.setAttribute("fill-opacity", c.getOpacity())
  }else {
    if(c instanceof goog.graphics.LinearGradient) {
      var d = "lg-" + c.getX1() + "-" + c.getY1() + "-" + c.getX2() + "-" + c.getY2() + "-" + c.getColor1() + "-" + c.getColor2(), e = this.getDef_(d);
      if(!e) {
        e = this.createSvgElement_("linearGradient", {x1:c.getX1(), y1:c.getY1(), x2:c.getX2(), y2:c.getY2(), gradientUnits:"userSpaceOnUse"});
        var f = this.createSvgElement_("stop", {offset:"0%", style:"stop-color:" + c.getColor1()});
        e.appendChild(f);
        c = this.createSvgElement_("stop", {offset:"100%", style:"stop-color:" + c.getColor2()});
        e.appendChild(c);
        e = this.addDef_(d, e)
      }b.setAttribute("fill", "url(#" + e + ")")
    }else {
      b.setAttribute("fill", "none")
    }
  }
};
a.setElementStroke = function(b, c) {
  b = b.getElement();
  if(c) {
    b.setAttribute("stroke", c.getColor());
    c = c.getWidth();
    goog.isString(c) && c.indexOf("px") != -1 ? b.setAttribute("stroke-width", parseFloat(c) / this.getPixelScaleX()) : b.setAttribute("stroke-width", c)
  }else {
    b.setAttribute("stroke", "none")
  }
};
a.setElementTransform = function(b, c, d, e, f, g) {
  b.getElement().setAttribute("transform", "translate(" + c + "," + d + ") rotate(" + e + " " + f + " " + g + ")")
};
a.createDom = function() {
  var b = this.createSvgElement_("svg", {width:this.width, height:this.height, overflow:"hidden"}), c = this.createSvgElement_("g");
  this.defsElement_ = this.createSvgElement_("defs");
  this.canvasElement = new goog.graphics.SvgGroupElement(c, this);
  b.appendChild(this.defsElement_);
  b.appendChild(c);
  this.setElementInternal(b);
  this.setViewBox_()
};
a.setCoordOrigin = function(b, c) {
  this.coordLeft = b;
  this.coordTop = c;
  this.setViewBox_()
};
a.setCoordSize = function() {
  goog.graphics.SvgGraphics.superClass_.setCoordSize.apply(this, arguments);
  this.setViewBox_()
};
a.getViewBox_ = function() {
  return this.coordLeft + " " + this.coordTop + " " + (this.coordWidth ? this.coordWidth + " " + this.coordHeight : "")
};
a.setViewBox_ = function() {
  if(this.coordWidth || this.coordLeft || this.coordTop) {
    this.getElement().setAttribute("preserveAspectRatio", "none");
    this.useManualViewbox_ ? this.updateManualViewBox_() : this.getElement().setAttribute("viewBox", this.getViewBox_())
  }
};
a.updateManualViewBox_ = function() {
  if(this.isInDocument() && (this.coordWidth || this.coordLeft || !this.coordTop)) {
    var b = this.getPixelSize();
    if(b.width == 0) {
      this.getElement().style.visibility = "hidden"
    }else {
      this.getElement().style.visibility = "";
      var c = -this.coordLeft, d = -this.coordTop, e = b.width / this.coordWidth;
      b = b.height / this.coordHeight;
      this.canvasElement.getElement().setAttribute("transform", "scale(" + e + " " + b + ") translate(" + c + " " + d + ")")
    }
  }
};
a.setSize = function() {
};
a.getPixelSize = function() {
  if(!goog.userAgent.GECKO) {
    return goog.style.getSize(this.getElement())
  }var b = this.width, c = this.height, d = goog.isString(b) && b.indexOf("%") != -1, e = goog.isString(c) && c.indexOf("%") != -1;
  if(!this.isInDocument() && (d || e)) {
    return null
  }var f, g;
  if(d) {
    f = this.getElement().parentNode;
    g = goog.style.getSize(f);
    b = parseFloat(b) * g.width / 100
  }if(e) {
    f = f || this.getElement().parentNode;
    g = g || goog.style.getSize(f);
    c = parseFloat(c) * g.height / 100
  }return new goog.math.Size(b, c)
};
a.clear = function() {
  this.canvasElement.clear();
  goog.dom.removeChildren(this.defsElement_);
  this.defs_ = {}
};
a.drawEllipse = function(b, c, d, e, f, g, h) {
  b = this.createSvgElement_("ellipse", {cx:b, cy:c, rx:d, ry:e});
  f = new goog.graphics.SvgEllipseElement(b, this, f, g);
  this.append_(f, h);
  return f
};
a.drawRect = function(b, c, d, e, f, g, h) {
  b = this.createSvgElement_("rect", {x:b, y:c, width:d, height:e});
  f = new goog.graphics.SvgRectElement(b, this, f, g);
  this.append_(f, h);
  return f
};
a.drawImage = function(b, c, d, e, f, g) {
  b = this.createSvgElement_("image", {x:b, y:c, width:d, height:e, "image-rendering":"optimizeQuality", preserveAspectRatio:"none"});
  b.setAttributeNS("http://www.w3.org/1999/xlink", "href", f);
  f = new goog.graphics.SvgImageElement(b, this);
  this.append_(f, g);
  return f
};
a.drawTextOnLine = function(b, c, d, e, f, g, h, j, k, l) {
  var m = Math.round(goog.math.angle(c, d, e, f));
  e = e - c;
  f = f - d;
  f = Math.round(Math.sqrt(e * e + f * f));
  var n = h.size;
  e = {"font-family":h.family, "font-size":n};
  var o = Math.round(n * 0.85);
  n = Math.round(d - n / 2 + o);
  o = c;
  if(g == "center") {
    o += Math.round(f / 2);
    e["text-anchor"] = "middle"
  }else {
    if(g == "right") {
      o += f;
      e["text-anchor"] = "end"
    }
  }e.x = o;
  e.y = n;
  if(h.bold) {
    e["font-weight"] = "bold"
  }if(h.italic) {
    e["font-style"] = "italic"
  }if(m != 0) {
    e.transform = "rotate(" + m + " " + c + " " + d + ")"
  }c = this.createSvgElement_("text", e);
  c.appendChild(this.dom_.getDocument().createTextNode(b));
  if(j == null && goog.userAgent.GECKO && goog.userAgent.MAC) {
    b = "black";
    if(k instanceof goog.graphics.SolidFill) {
      b = k.getColor()
    }j = new goog.graphics.Stroke(1, b)
  }k = new goog.graphics.SvgTextElement(c, this, j, k);
  this.append_(k, l);
  return k
};
a.drawPath = function(b, c, d, e) {
  b = this.createSvgElement_("path", {d:goog.graphics.SvgGraphics.getSvgPath(b)});
  c = new goog.graphics.SvgPathElement(b, this, c, d);
  this.append_(c, e);
  return c
};
goog.graphics.SvgGraphics.getSvgPath = function(b) {
  var c = [];
  b.forEachSegment(function(d, e) {
    switch(d) {
      case goog.graphics.Path.Segment.MOVETO:
        c.push("M");
        Array.prototype.push.apply(c, e);
        break;
      case goog.graphics.Path.Segment.LINETO:
        c.push("L");
        Array.prototype.push.apply(c, e);
        break;
      case goog.graphics.Path.Segment.CURVETO:
        c.push("C");
        Array.prototype.push.apply(c, e);
        break;
      case goog.graphics.Path.Segment.ARCTO:
        d = e[3];
        c.push("A", e[0], e[1], 0, Math.abs(d) > 180 ? 1 : 0, d > 0 ? 1 : 0, e[4], e[5]);
        break;
      case goog.graphics.Path.Segment.CLOSE:
        c.push("Z");
        break
    }
  });
  return c.join(" ")
};
a = goog.graphics.SvgGraphics.prototype;
a.createGroup = function(b) {
  var c = this.createSvgElement_("g");
  (b || this.canvasElement).getElement().appendChild(c);
  return new goog.graphics.SvgGroupElement(c, this)
};
a.getTextWidth = function() {
};
a.addDef_ = function(b, c) {
  if(b in this.defs_) {
    return this.defs_[b]
  }var d = goog.graphics.SvgGraphics.DEF_ID_PREFIX_ + goog.graphics.SvgGraphics.nextDefId_++;
  c.setAttribute("id", d);
  this.defs_[b] = d;
  this.defsElement_.appendChild(c);
  return d
};
a.getDef_ = function(b) {
  return b in this.defs_ ? this.defs_[b] : null
};
a.enterDocument = function() {
  var b = this.getPixelSize();
  goog.graphics.SvgGraphics.superClass_.enterDocument.call(this);
  b || this.dispatchEvent(goog.events.EventType.RESIZE);
  if(this.useManualViewbox_) {
    b = this.width;
    var c = this.height;
    typeof b == "string" && b.indexOf("%") != -1 && typeof c == "string" && c.indexOf("%") != -1 && this.handler_.listen(goog.graphics.SvgGraphics.getResizeCheckTimer_(), goog.Timer.TICK, this.updateManualViewBox_);
    this.updateManualViewBox_()
  }
};
a.exitDocument = function() {
  goog.graphics.SvgGraphics.superClass_.exitDocument.call(this);
  this.useManualViewbox_ && this.handler_.unlisten(goog.graphics.SvgGraphics.getResizeCheckTimer_(), goog.Timer.TICK, this.updateManualViewBox_)
};
a.disposeInternal = function() {
  delete this.defs_;
  delete this.defsElement_;
  delete this.canvasElement;
  goog.graphics.SvgGraphics.superClass_.disposeInternal.call(this)
};
goog.graphics.SvgGraphics.getResizeCheckTimer_ = function() {
  if(!goog.graphics.SvgGraphics.resizeCheckTimer_) {
    goog.graphics.SvgGraphics.resizeCheckTimer_ = new goog.Timer(400);
    goog.graphics.SvgGraphics.resizeCheckTimer_.start()
  }return goog.graphics.SvgGraphics.resizeCheckTimer_
};
goog.graphics.SvgGraphics.prototype.isDomClonable = function() {
  return true
};goog.graphics.vmlGetElement_ = function() {
  return this.element_ = this.getGraphics().getVmlElement(this.id_) || this.element_
};
goog.graphics.VmlGroupElement = function(b, c) {
  this.id_ = b.id;
  goog.graphics.GroupElement.call(this, b, c)
};
goog.inherits(goog.graphics.VmlGroupElement, goog.graphics.GroupElement);
goog.graphics.VmlGroupElement.prototype.getElement = goog.graphics.vmlGetElement_;
goog.graphics.VmlGroupElement.prototype.clear = function() {
  goog.dom.removeChildren(this.getElement())
};
goog.graphics.VmlGroupElement.prototype.isRootElement_ = function() {
  return this.getGraphics().getCanvasElement() == this
};
goog.graphics.VmlGroupElement.prototype.setSize = function(b, c) {
  var d = this.getElement(), e = d.style;
  e.width = goog.graphics.VmlGraphics.toSizePx(b);
  e.height = goog.graphics.VmlGraphics.toSizePx(c);
  d.coordsize = goog.graphics.VmlGraphics.toSizeCoord(b) + " " + goog.graphics.VmlGraphics.toSizeCoord(c);
  if(!this.isRootElement_()) {
    d.coordorigin = "0 0"
  }
};
goog.graphics.VmlEllipseElement = function(b, c, d, e, f, g, h, j) {
  this.id_ = b.id;
  goog.graphics.EllipseElement.call(this, b, c, h, j);
  this.cx = d;
  this.cy = e;
  this.rx = f;
  this.ry = g
};
goog.inherits(goog.graphics.VmlEllipseElement, goog.graphics.EllipseElement);
goog.graphics.VmlEllipseElement.prototype.getElement = goog.graphics.vmlGetElement_;
goog.graphics.VmlEllipseElement.prototype.setCenter = function(b, c) {
  this.cx = b;
  this.cy = c;
  goog.graphics.VmlGraphics.setPositionAndSize(this.getElement(), b - this.rx, c - this.ry, this.rx * 2, this.ry * 2)
};
goog.graphics.VmlEllipseElement.prototype.setRadius = function(b, c) {
  this.rx = b;
  this.ry = c;
  goog.graphics.VmlGraphics.setPositionAndSize(this.getElement(), this.cx - b, this.cy - c, b * 2, c * 2)
};
goog.graphics.VmlRectElement = function(b, c, d, e) {
  this.id_ = b.id;
  goog.graphics.RectElement.call(this, b, c, d, e)
};
goog.inherits(goog.graphics.VmlRectElement, goog.graphics.RectElement);
goog.graphics.VmlRectElement.prototype.getElement = goog.graphics.vmlGetElement_;
goog.graphics.VmlRectElement.prototype.setPosition = function(b, c) {
  var d = this.getElement().style;
  d.left = goog.graphics.VmlGraphics.toPosPx(b);
  d.top = goog.graphics.VmlGraphics.toPosPx(c)
};
goog.graphics.VmlRectElement.prototype.setSize = function(b, c) {
  var d = this.getElement().style;
  d.width = goog.graphics.VmlGraphics.toSizePx(b);
  d.height = goog.graphics.VmlGraphics.toSizePx(c)
};
goog.graphics.VmlPathElement = function(b, c, d, e) {
  this.id_ = b.id;
  goog.graphics.PathElement.call(this, b, c, d, e)
};
goog.inherits(goog.graphics.VmlPathElement, goog.graphics.PathElement);
goog.graphics.VmlPathElement.prototype.getElement = goog.graphics.vmlGetElement_;
goog.graphics.VmlPathElement.prototype.setPath = function(b) {
  goog.graphics.VmlGraphics.setAttribute(this.getElement(), "path", goog.graphics.VmlGraphics.getVmlPath(b))
};
goog.graphics.VmlTextElement = function(b, c, d, e) {
  this.id_ = b.id;
  goog.graphics.TextElement.call(this, b, c, d, e)
};
goog.inherits(goog.graphics.VmlTextElement, goog.graphics.TextElement);
goog.graphics.VmlTextElement.prototype.getElement = goog.graphics.vmlGetElement_;
goog.graphics.VmlTextElement.prototype.setText = function(b) {
  goog.graphics.VmlGraphics.setAttribute(this.getElement().childNodes[1], "string", b)
};
goog.graphics.VmlImageElement = function(b, c) {
  this.id_ = b.id;
  goog.graphics.ImageElement.call(this, b, c)
};
goog.inherits(goog.graphics.VmlImageElement, goog.graphics.ImageElement);
goog.graphics.VmlImageElement.prototype.getElement = goog.graphics.vmlGetElement_;
goog.graphics.VmlImageElement.prototype.setPosition = function(b, c) {
  var d = this.getElement().style;
  d.left = goog.graphics.VmlGraphics.toPosPx(b);
  d.top = goog.graphics.VmlGraphics.toPosPx(c)
};
goog.graphics.VmlImageElement.prototype.setSize = function(b, c) {
  var d = this.getElement().style;
  d.width = goog.graphics.VmlGraphics.toPosPx(b);
  d.height = goog.graphics.VmlGraphics.toPosPx(c)
};
goog.graphics.VmlImageElement.prototype.setSource = function(b) {
  goog.graphics.VmlGraphics.setAttribute(this.getElement(), "src", b)
};goog.graphics.VmlGraphics = function(b, c, d, e, f) {
  goog.graphics.AbstractGraphics.call(this, b, c, d, e, f);
  this.handler_ = new goog.events.EventHandler(this)
};
goog.inherits(goog.graphics.VmlGraphics, goog.graphics.AbstractGraphics);
goog.graphics.VmlGraphics.VML_PREFIX_ = "g_vml_";
goog.graphics.VmlGraphics.VML_NS_ = "urn:schemas-microsoft-com:vml";
goog.graphics.VmlGraphics.VML_IMPORT_ = "#default#VML";
goog.graphics.VmlGraphics.IE8_MODE_ = document.documentMode && document.documentMode >= 8;
goog.graphics.VmlGraphics.COORD_MULTIPLIER = 100;
goog.graphics.VmlGraphics.toCssSize = function(b) {
  return goog.isString(b) && goog.string.endsWith(b, "%") ? b : parseFloat(b.toString()) + "px"
};
goog.graphics.VmlGraphics.toPosCoord = function(b) {
  return Math.round((parseFloat(b.toString()) - 0.5) * goog.graphics.VmlGraphics.COORD_MULTIPLIER)
};
goog.graphics.VmlGraphics.toPosPx = function(b) {
  return goog.graphics.VmlGraphics.toPosCoord(b) + "px"
};
goog.graphics.VmlGraphics.toSizeCoord = function(b) {
  return Math.round(parseFloat(b.toString()) * goog.graphics.VmlGraphics.COORD_MULTIPLIER)
};
goog.graphics.VmlGraphics.toSizePx = function(b) {
  return goog.graphics.VmlGraphics.toSizeCoord(b) + "px"
};
goog.graphics.VmlGraphics.setAttribute = function(b, c, d) {
  if(goog.graphics.VmlGraphics.IE8_MODE_) {
    b[c] = d
  }else {
    b.setAttribute(c, d)
  }
};
a = goog.graphics.VmlGraphics.prototype;
a.createVmlElement = function(b) {
  b = this.dom_.createElement(goog.graphics.VmlGraphics.VML_PREFIX_ + ":" + b);
  b.id = goog.string.createUniqueString();
  return b
};
a.getVmlElement = function(b) {
  return this.dom_.getElement(b)
};
a.updateGraphics_ = function() {
  if(goog.graphics.VmlGraphics.IE8_MODE_ && this.isInDocument()) {
    this.getElement().innerHTML = this.getElement().innerHTML
  }
};
a.append_ = function(b, c) {
  (c || this.canvasElement).getElement().appendChild(b.getElement());
  this.updateGraphics_()
};
a.setElementFill = function(b, c) {
  b = b.getElement();
  this.removeFill(b);
  if(c instanceof goog.graphics.SolidFill) {
    if(c.getColor() == "transparent") {
      b.filled = false
    }else {
      if(c.getOpacity() != 1) {
        b.filled = true;
        var d = this.createVmlElement("fill");
        d.opacity = Math.round(c.getOpacity() * 100) + "%";
        d.color = c.getColor();
        b.appendChild(d)
      }else {
        b.filled = true;
        b.fillcolor = c.getColor()
      }
    }
  }else {
    if(c instanceof goog.graphics.LinearGradient) {
      b.filled = true;
      d = this.createVmlElement("fill");
      d.color = c.getColor1();
      d.color2 = c.getColor2();
      c = goog.math.angle(c.getX1(), c.getY1(), c.getX2(), c.getY2());
      c = Math.round(goog.math.standardAngle(270 - c));
      d.angle = c;
      d.type = "gradient";
      b.appendChild(d)
    }else {
      b.filled = false
    }
  }this.updateGraphics_()
};
a.setElementStroke = function(b, c) {
  b = b.getElement();
  if(c) {
    b.stroked = true;
    var d = c.getWidth();
    if(goog.isString(d) && d.indexOf("px") == -1) {
      d = parseFloat(d)
    }else {
      d *= this.getPixelScaleX()
    }var e = b.getElementsByTagName("stroke")[0];
    if(d < 1) {
      e = e || this.createVmlElement("stroke");
      e.opacity = d;
      e.weight = "1px";
      e.color = c.getColor();
      b.appendChild(e)
    }else {
      e && b.removeChild(e);
      b.strokecolor = c.getColor();
      b.strokeweight = d + "px"
    }
  }else {
    b.stroked = false
  }this.updateGraphics_()
};
a.setElementTransform = function(b, c, d, e, f, g) {
  b = b.getElement();
  b.style.left = goog.graphics.VmlGraphics.toPosPx(c);
  b.style.top = goog.graphics.VmlGraphics.toPosPx(d);
  if(e || b.rotation) {
    b.rotation = e;
    b.coordsize = goog.graphics.VmlGraphics.toSizeCoord(f * 2) + " " + goog.graphics.VmlGraphics.toSizeCoord(g * 2)
  }
};
a.removeFill = function(b) {
  b.fillcolor = "";
  for(var c = 0;c < b.childNodes.length;c++) {
    var d = b.childNodes[c];
    d.tagName == "fill" && b.removeChild(d)
  }
};
goog.graphics.VmlGraphics.setPositionAndSize = function(b, c, d, e, f) {
  var g = b.style;
  g.position = "absolute";
  g.left = goog.graphics.VmlGraphics.toPosPx(c);
  g.top = goog.graphics.VmlGraphics.toPosPx(d);
  g.width = goog.graphics.VmlGraphics.toSizePx(e);
  g.height = goog.graphics.VmlGraphics.toSizePx(f);
  if(b.tagName == "shape") {
    b.coordsize = goog.graphics.VmlGraphics.toSizeCoord(e) + " " + goog.graphics.VmlGraphics.toSizeCoord(f)
  }
};
goog.graphics.VmlGraphics.prototype.createFullSizeElement_ = function(b) {
  b = this.createVmlElement(b);
  var c = this.getCoordSize();
  goog.graphics.VmlGraphics.setPositionAndSize(b, 0, 0, c.width, c.height);
  return b
};
try {
  eval("document.namespaces")
}catch(ex$$4) {
}a = goog.graphics.VmlGraphics.prototype;
a.createDom = function() {
  var b = this.dom_.getDocument();
  if(!b.namespaces[goog.graphics.VmlGraphics.VML_PREFIX_]) {
    goog.graphics.VmlGraphics.IE8_MODE_ ? b.namespaces.add(goog.graphics.VmlGraphics.VML_PREFIX_, goog.graphics.VmlGraphics.VML_NS_, goog.graphics.VmlGraphics.VML_IMPORT_) : b.namespaces.add(goog.graphics.VmlGraphics.VML_PREFIX_, goog.graphics.VmlGraphics.VML_NS_);
    b.createStyleSheet().cssText = goog.graphics.VmlGraphics.VML_PREFIX_ + "\\:*{behavior:url(#default#VML)}"
  }b = this.width;
  var c = this.height, d = this.dom_.createDom("div", {style:"overflow:hidden;position:relative;width:" + goog.graphics.VmlGraphics.toCssSize(b) + ";height:" + goog.graphics.VmlGraphics.toCssSize(c)});
  this.setElementInternal(d);
  var e = this.createVmlElement("group"), f = e.style;
  f.position = "absolute";
  f.left = f.top = 0;
  f.width = this.width;
  f.height = this.height;
  e.coordsize = this.coordWidth ? goog.graphics.VmlGraphics.toSizeCoord(this.coordWidth) + " " + goog.graphics.VmlGraphics.toSizeCoord(this.coordHeight) : goog.graphics.VmlGraphics.toSizeCoord(b) + " " + goog.graphics.VmlGraphics.toSizeCoord(c);
  e.coordorigin = goog.isDef(this.coordLeft) ? goog.graphics.VmlGraphics.toSizeCoord(this.coordLeft) + " " + goog.graphics.VmlGraphics.toSizeCoord(this.coordTop) : "0 0";
  d.appendChild(e);
  this.canvasElement = new goog.graphics.VmlGroupElement(e, this);
  goog.events.listen(d, goog.events.EventType.RESIZE, goog.bind(this.handleContainerResize_, this))
};
a.handleContainerResize_ = function() {
  var b = goog.style.getSize(this.getElement()), c = this.canvasElement.getElement().style;
  if(b.width) {
    c.width = b.width + "px";
    c.height = b.height + "px"
  }else {
    for(b = this.getElement();b && b.currentStyle && b.currentStyle.display != "none";) {
      b = b.parentNode
    }b && b.currentStyle && this.handler_.listen(b, "propertychange", this.handleContainerResize_)
  }this.dispatchEvent(goog.events.EventType.RESIZE)
};
a.handlePropertyChange_ = function(b) {
  var c = b.getBrowserEvent().propertyName;
  if(c == "display" || c == "className") {
    this.handler_.unlisten(b.target, "propertychange", this.handlePropertyChange_);
    this.handleContainerResize_()
  }
};
a.setCoordOrigin = function(b, c) {
  this.coordLeft = b;
  this.coordTop = c;
  this.canvasElement.getElement().coordorigin = goog.graphics.VmlGraphics.toSizeCoord(this.coordLeft) + " " + goog.graphics.VmlGraphics.toSizeCoord(this.coordTop)
};
a.setCoordSize = function(b, c) {
  goog.graphics.VmlGraphics.superClass_.setCoordSize.apply(this, arguments);
  this.canvasElement.getElement().coordsize = goog.graphics.VmlGraphics.toSizeCoord(b) + " " + goog.graphics.VmlGraphics.toSizeCoord(c)
};
a.setSize = function() {
};
a.getPixelSize = function() {
  var b = this.getElement();
  return new goog.math.Size(b.style.pixelWidth || b.offsetWidth || 1, b.style.pixelHeight || b.offsetHeight || 1)
};
a.clear = function() {
  this.canvasElement.clear()
};
a.drawEllipse = function(b, c, d, e, f, g, h) {
  var j = this.createVmlElement("oval");
  goog.graphics.VmlGraphics.setPositionAndSize(j, b - d, c - e, d * 2, e * 2);
  b = new goog.graphics.VmlEllipseElement(j, this, b, c, d, e, f, g);
  this.append_(b, h);
  return b
};
a.drawRect = function(b, c, d, e, f, g, h) {
  var j = this.createVmlElement("rect");
  goog.graphics.VmlGraphics.setPositionAndSize(j, b, c, d, e);
  b = new goog.graphics.VmlRectElement(j, this, f, g);
  this.append_(b, h);
  return b
};
a.drawImage = function(b, c, d, e, f, g) {
  var h = this.createVmlElement("image");
  goog.graphics.VmlGraphics.setPositionAndSize(h, b, c, d, e);
  goog.graphics.VmlGraphics.setAttribute(h, "src", f);
  b = new goog.graphics.VmlImageElement(h, this);
  this.append_(b, g);
  return b
};
a.drawTextOnLine = function(b, c, d, e, f, g, h, j, k, l) {
  var m = this.createFullSizeElement_("shape"), n = this.createVmlElement("path");
  c = "M" + goog.graphics.VmlGraphics.toPosCoord(c) + "," + goog.graphics.VmlGraphics.toPosCoord(d) + "L" + goog.graphics.VmlGraphics.toPosCoord(e) + "," + goog.graphics.VmlGraphics.toPosCoord(f) + "E";
  goog.graphics.VmlGraphics.setAttribute(n, "v", c);
  goog.graphics.VmlGraphics.setAttribute(n, "textpathok", "true");
  c = this.createVmlElement("textpath");
  c.setAttribute("on", "true");
  d = c.style;
  d.fontSize = h.size * this.getPixelScaleX();
  d.fontFamily = h.family;
  if(g != null) {
    d["v-text-align"] = g
  }if(h.bold) {
    d.fontWeight = "bold"
  }if(h.italic) {
    d.fontStyle = "italic"
  }goog.graphics.VmlGraphics.setAttribute(c, "string", b);
  m.appendChild(n);
  m.appendChild(c);
  b = new goog.graphics.VmlTextElement(m, this, j, k);
  this.append_(b, l);
  return b
};
a.drawPath = function(b, c, d, e) {
  var f = this.createFullSizeElement_("shape");
  goog.graphics.VmlGraphics.setAttribute(f, "path", goog.graphics.VmlGraphics.getVmlPath(b));
  b = new goog.graphics.VmlPathElement(f, this, c, d);
  this.append_(b, e);
  return b
};
goog.graphics.VmlGraphics.getVmlPath = function(b) {
  var c = [];
  b.forEachSegment(function(d, e) {
    switch(d) {
      case goog.graphics.Path.Segment.MOVETO:
        c.push("m");
        Array.prototype.push.apply(c, goog.array.map(e, goog.graphics.VmlGraphics.toSizeCoord));
        break;
      case goog.graphics.Path.Segment.LINETO:
        c.push("l");
        Array.prototype.push.apply(c, goog.array.map(e, goog.graphics.VmlGraphics.toSizeCoord));
        break;
      case goog.graphics.Path.Segment.CURVETO:
        c.push("c");
        Array.prototype.push.apply(c, goog.array.map(e, goog.graphics.VmlGraphics.toSizeCoord));
        break;
      case goog.graphics.Path.Segment.CLOSE:
        c.push("x");
        break;
      case goog.graphics.Path.Segment.ARCTO:
        var f = e[2] + e[3];
        d = goog.graphics.VmlGraphics.toSizeCoord(e[4] - goog.math.angleDx(f, e[0]));
        f = goog.graphics.VmlGraphics.toSizeCoord(e[5] - goog.math.angleDy(f, e[1]));
        var g = goog.graphics.VmlGraphics.toSizeCoord(e[0]), h = goog.graphics.VmlGraphics.toSizeCoord(e[1]), j = Math.round(e[2] * -65536);
        e = Math.round(e[3] * -65536);
        c.push("ae", d, f, g, h, j, e);
        break
    }
  });
  return c.join(" ")
};
goog.graphics.VmlGraphics.prototype.createGroup = function(b) {
  var c = this.createFullSizeElement_("group");
  (b || this.canvasElement).getElement().appendChild(c);
  return new goog.graphics.VmlGroupElement(c, this)
};
goog.graphics.VmlGraphics.prototype.getTextWidth = function() {
  return 0
};
goog.graphics.VmlGraphics.prototype.enterDocument = function() {
  goog.graphics.VmlGraphics.superClass_.enterDocument.call(this);
  this.handleContainerResize_();
  this.updateGraphics_()
};
goog.graphics.VmlGraphics.prototype.disposeInternal = function() {
  this.canvasElement = null;
  goog.graphics.VmlGraphics.superClass_.disposeInternal.call(this)
};goog.graphics.createGraphics = function(b, c, d, e, f) {
  b = goog.userAgent.IE ? new goog.graphics.VmlGraphics(b, c, d, e, f) : goog.userAgent.WEBKIT && (!goog.userAgent.isVersion("420") || goog.userAgent.MOBILE) ? new goog.graphics.CanvasGraphics(b, c, d, e, f) : new goog.graphics.SvgGraphics(b, c, d, e, f);
  b.createDom();
  return b
};
goog.graphics.createSimpleGraphics = function(b, c, d, e, f) {
  if(goog.userAgent.MAC && goog.userAgent.GECKO && !goog.userAgent.isVersion("1.9a")) {
    b = new goog.graphics.CanvasGraphics(b, c, d, e, f);
    b.createDom();
    return b
  }return goog.graphics.createGraphics(b, c, d, e, f)
};
goog.graphics.isBrowserSupported = function() {
  if(goog.userAgent.IE) {
    return goog.userAgent.isVersion("5.5")
  }if(goog.userAgent.GECKO) {
    return goog.userAgent.isVersion("1.8")
  }if(goog.userAgent.OPERA) {
    return goog.userAgent.isVersion("9.0")
  }if(goog.userAgent.WEBKIT) {
    return goog.userAgent.isVersion("412")
  }return false
};goog.fx = {};
goog.fx.Dragger = function(b, c, d) {
  this.target = b;
  this.handle = c || b;
  this.limits = d || new goog.math.Rect(NaN, NaN, NaN, NaN);
  this.document_ = goog.dom.getOwnerDocument(b);
  this.eventHandler_ = new goog.events.EventHandler(this);
  goog.events.listen(this.handle, goog.events.EventType.MOUSEDOWN, this.startDrag, false, this)
};
goog.inherits(goog.fx.Dragger, goog.events.EventTarget);
goog.fx.Dragger.HAS_SET_CAPTURE_ = goog.userAgent.IE || goog.userAgent.GECKO && goog.userAgent.isVersion("1.9.3");
goog.fx.Dragger.EventType = {START:"start", BEFOREDRAG:"beforedrag", DRAG:"drag", END:"end"};
a = goog.fx.Dragger.prototype;
a.screenX = 0;
a.screenY = 0;
a.startX = 0;
a.startY = 0;
a.deltaX = 0;
a.deltaY = 0;
a.enabled_ = true;
a.dragging_ = false;
a.hysteresisDistanceSquared_ = 0;
a.mouseDownTime_ = 0;
a.ieDragStartCancellingOn_ = false;
a.getHandler = function() {
  return this.eventHandler_
};
a.setLimits = function(b) {
  this.limits = b || new goog.math.Rect(NaN, NaN, NaN, NaN)
};
a.setHysteresis = function(b) {
  this.hysteresisDistanceSquared_ = Math.pow(b, 2)
};
a.getHysteresis = function() {
  return Math.sqrt(this.hysteresisDistanceSquared_)
};
a.setScrollTarget = function(b) {
  this.scrollTarget_ = b
};
a.setCancelIeDragStart = function(b) {
  this.ieDragStartCancellingOn_ = b
};
a.getEnabled = function() {
  return this.enabled_
};
a.setEnabled = function(b) {
  this.enabled_ = b
};
a.disposeInternal = function() {
  goog.fx.Dragger.superClass_.disposeInternal.call(this);
  goog.events.unlisten(this.handle, goog.events.EventType.MOUSEDOWN, this.startDrag, false, this);
  this.eventHandler_.dispose();
  delete this.target;
  delete this.handle;
  delete this.eventHandler_
};
a.startDrag = function(b) {
  if(this.enabled_ && !this.dragging_ && (b.type != goog.events.EventType.MOUSEDOWN || b.isButton(goog.events.BrowserEvent.MouseButton.LEFT))) {
    if(this.hysteresisDistanceSquared_ == 0) {
      this.initializeDrag_(b);
      if(this.dragging_) {
        b.preventDefault()
      }else {
        return
      }
    }else {
      b.preventDefault()
    }this.setupDragHandlers();
    this.screenX = this.startX = b.screenX;
    this.screenY = this.startY = b.screenY;
    this.deltaX = this.target.offsetLeft;
    this.deltaY = this.target.offsetTop;
    this.pageScroll = goog.dom.getDomHelper(this.document_).getDocumentScroll();
    this.mouseDownTime_ = goog.now()
  }
};
a.setupDragHandlers = function() {
  var b = this.document_, c = b.documentElement, d = !goog.fx.Dragger.HAS_SET_CAPTURE_;
  this.eventHandler_.listen(b, goog.events.EventType.MOUSEMOVE, this.mouseMoved_, d);
  this.eventHandler_.listen(b, goog.events.EventType.MOUSEUP, this.endDrag, d);
  if(goog.fx.Dragger.HAS_SET_CAPTURE_) {
    c.setCapture(false);
    this.eventHandler_.listen(c, goog.events.EventType.LOSECAPTURE, this.endDrag)
  }else {
    this.eventHandler_.listen(goog.dom.getWindow(b), goog.events.EventType.BLUR, this.endDrag)
  }goog.userAgent.IE && this.ieDragStartCancellingOn_ && this.eventHandler_.listen(b, goog.events.EventType.DRAGSTART, goog.events.Event.preventDefault);
  this.scrollTarget_ && this.eventHandler_.listen(this.scrollTarget_, goog.events.EventType.SCROLL, this.onScroll_, d)
};
a.initializeDrag_ = function(b) {
  if(this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.START, this, b.clientX, b.clientY, b)) !== false) {
    this.dragging_ = true
  }
};
a.endDrag = function(b, c) {
  this.eventHandler_.removeAll();
  goog.fx.Dragger.HAS_SET_CAPTURE_ && this.document_.releaseCapture();
  if(this.dragging_) {
    this.dragging_ = false;
    var d = this.limitX(this.deltaX), e = this.limitY(this.deltaY);
    this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.END, this, b.clientX, b.clientY, b, d, e, c))
  }
};
a.endDragCancel = function(b) {
  this.endDrag(b, true)
};
a.mouseMoved_ = function(b) {
  if(this.enabled_) {
    var c = b.screenX - this.screenX, d = b.screenY - this.screenY;
    this.screenX = b.screenX;
    this.screenY = b.screenY;
    if(!this.dragging_) {
      var e = this.startX - this.screenX, f = this.startY - this.screenY;
      if(e * e + f * f > this.hysteresisDistanceSquared_) {
        this.initializeDrag_(b);
        if(!this.dragging_) {
          this.endDrag(b);
          return
        }
      }
    }d = this.calculatePosition_(c, d);
    c = d.x;
    d = d.y;
    if(this.dragging_) {
      if(this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.BEFOREDRAG, this, b.clientX, b.clientY, b, c, d)) !== false) {
        this.doDrag(b, c, d, false);
        b.preventDefault()
      }
    }
  }
};
a.calculatePosition_ = function(b, c) {
  var d = goog.dom.getDomHelper(this.document_).getDocumentScroll();
  b += d.x - this.pageScroll.x;
  c += d.y - this.pageScroll.y;
  this.pageScroll = d;
  this.deltaX += b;
  this.deltaY += c;
  b = this.limitX(this.deltaX);
  c = this.limitY(this.deltaY);
  return new goog.math.Coordinate(b, c)
};
a.onScroll_ = function(b) {
  var c = this.calculatePosition_(0, 0);
  b.clientX = this.pageScroll.x - this.screenX;
  b.clientY = this.pageScroll.x - this.screenY;
  this.doDrag(b, c.x, c.y, true)
};
a.doDrag = function(b, c, d) {
  this.defaultAction(c, d);
  this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.DRAG, this, b.clientX, b.clientY, b, c, d))
};
a.limitX = function(b) {
  var c = this.limits, d = !isNaN(c.left) ? c.left : null;
  c = !isNaN(c.width) ? c.width : 0;
  return Math.min(d != null ? d + c : Infinity, Math.max(d != null ? d : -Infinity, b))
};
a.limitY = function(b) {
  var c = this.limits, d = !isNaN(c.top) ? c.top : null;
  c = !isNaN(c.height) ? c.height : 0;
  return Math.min(d != null ? d + c : Infinity, Math.max(d != null ? d : -Infinity, b))
};
a.defaultAction = function(b, c) {
  this.target.style.left = b + "px";
  this.target.style.top = c + "px"
};
goog.fx.DragEvent = function(b, c, d, e, f, g, h, j) {
  goog.events.Event.call(this, b);
  this.clientX = d;
  this.clientY = e;
  this.browserEvent = f;
  this.left = goog.isDef(g) ? g : c.deltaX;
  this.top = goog.isDef(h) ? h : c.deltaY;
  this.dragger = c;
  this.dragCanceled = !!j
};
goog.inherits(goog.fx.DragEvent, goog.events.Event);jchemhub.view.ReactionEditor = function(b, c) {
  jchemhub.view.Drawing.call(this);
  this._element = b;
  this._config = new goog.structs.Map(jchemhub.view.ReactionEditor.defaultConfig);
  c && this._config.addAll(c);
  this._graphics = goog.graphics.createGraphics(b.clientWidth, b.clientHeight);
  this._graphics.render(this._element)
};
goog.inherits(jchemhub.view.ReactionEditor, jchemhub.view.Drawing);
a = jchemhub.view.ReactionEditor.prototype;
a.clear = function() {
  this._graphics.clear();
  this._graphics.drawRect(0, 0, this._element.clientWidth, this._element.clientHeight, null, new goog.graphics.SolidFill(this.getConfig().get("background").color))
};
a.setModel = function(b) {
  this.clear();
  b instanceof jchemhub.model.Reaction && this.add(new jchemhub.view.ReactionDrawing(b));
  b instanceof jchemhub.model.Molecule && this.add(new jchemhub.view.MoleculeDrawing(b))
};
a.layoutAndRender = function() {
  var b = this.getConfig().get("margin");
  this.layout(new goog.math.Rect(b, b, this.getSize().width - b * 2, this.getSize().height - b * 2));
  this.render()
};
a.getRect = function() {
  return new goog.math.Rect(0, 0, this._graphics.getSize().width, this._graphics.getSize().height)
};
a.getTransform = function() {
  return this._transform
};
a.render = function() {
  this.renderChildren()
};
a.getModel = function() {
  this.getChildren();
  return this.getChildren()[0]
};
jchemhub.view.ReactionEditor.defaultConfig = {arrow:{stroke:{width:2, color:"black"}}, atom:{diameter:0.05, stroke:{width:1, color:"#FF9999"}, fill:{color:"#FF9999"}, fontName:"Arial"}, N:{stroke:{width:1, color:"blue"}, fill:{color:"blue"}}, O:{stroke:{width:1, color:"red"}, fill:{color:"red"}}, S:{stroke:{width:1, color:"yellow"}, fill:{color:"yellow"}}, P:{stroke:{width:1, color:"orange"}, fill:{color:"orange"}}, Cl:{stroke:{width:1, color:"green"}, fill:{color:"green"}}, F:{stroke:{width:1, color:"green"}, 
fill:{color:"green"}}, Br:{stroke:{width:1, color:"dark red"}, fill:{color:"dark red"}}, I:{stroke:{width:1, color:"purple"}, fill:{color:"purple"}}, C:{stroke:{width:1, color:"black"}, fill:{color:"black"}}, H:{stroke:{width:1, color:"black"}, fill:{color:"white"}}, background:{color:"#F0FFF0"}, margin:20, subscriptSize:5, bond:{stroke:{width:2, color:"black"}, fill:{color:"black"}}, highlight:{radius:0.1, color:"blue"}, plus:{stroke:{width:2, color:"black"}}};jchemhub.view.AtomDrawing = function(b) {
  jchemhub.view.Drawing.call(this);
  this.atom = b
};
goog.inherits(jchemhub.view.AtomDrawing, jchemhub.view.Drawing);
a = jchemhub.view.AtomDrawing.prototype;
a.render = function() {
  var b = this.getConfig(), c = b.get(this.atom.symbol) ? b.get(this.atom.symbol) : b.get("atom"), d = this.getTransform().getScaleX();
  d = new goog.graphics.Font(d / 1.8, c.fontName);
  var e = new goog.graphics.Stroke(c.stroke.width, c.stroke.color);
  c = new goog.graphics.SolidFill(c.fill.color);
  var f = this.transformCoords(this.getTransform(), [this.atom.coord])[0], g = this.compoundSymbol(), h = this.getGraphics(), j = this.getGroup(), k = g.text.length * 0.55 * d.size, l = d.size;
  if(g.text) {
    j.atomLabelBackground = h.drawEllipse(f.x, f.y, l * 0.7, l * 0.7, new goog.graphics.Stroke(1, b.get("background").color), new goog.graphics.SolidFill(b.get("background").color), j);
    h.drawText(g.text, f.x - k / 2, f.y - l / 2, k, l, g.justification, null, d, e, c, j);
    if(g.justification == "left") {
      if(g.subscript || g.superscript) {
        b = b.get("subscriptSize");
        g.subscript && h.drawText(g.subscript, f.x + k * 0.9, f.y, b, b, "center", null, d, e, c, j);
        g.superscript && h.drawText(g.superscript, f.x + k, f.y - l * 0.8, b, b, "center", null, d, e, c, j)
      }
    }else {
      if(g.justification == "right") {
        if(g.subscript || g.superscript) {
          b = b.get("subscriptSize");
          if(g.subscript) {
            h.drawText("H", f.x - k * 3, f.y - l / 2, k, l, "center", null, d, e, c, j);
            h.drawText(g.subscript, f.x - k * 1.8, f.y, b, b, "center", null, d, e, c, j)
          }g.superscript && h.drawText(g.superscript, f.x + k, f.y - l * 0.8, b, b, "center", null, d, e, c, j)
        }
      }
    }
  }
};
a.getCoords = function() {
  return[this.atom.coord]
};
a.getBoundingBox = function() {
  var b = this.getConfig().get("atom").diameter / 2;
  return goog.math.Box.boundingBox.apply(null, [new goog.math.Coordinate(this.atom.coord.x - b, this.atom.coord.y - b), new goog.math.Coordinate(this.atom.coord.x + b, this.atom.coord.y + b)])
};
a.updateTransformedCoords = function() {
  this._trans_coord = this.transformCoords(this.getTransform(), [this.getCoordinates()])[0]
};
a.transformDrawing = function(b) {
  var c = this.transformCoords(this.getTransform(), [this.atom.coord]);
  c = this.transformCoords(b, c);
  c = this.transformCoords(this.getTransform().createInverse(), c);
  console.log([this.atom.coord, c[0]]);
  this.atom.coord = c[0];
  jchemhub.view.AtomDrawing.superClass_.transformDrawing(b)
};
a.compoundSymbol = function() {
  var b = {text:"", justification:"center", superscript:"", subscript:""};
  if(this.atom.symbol != "C" || this.atom.countBonds() == 1) {
    var c = this.atom.hydrogenCount();
    if(c == 0) {
      b.text = this.atom.symbol
    }else {
      bond_direction = this.bondDirection();
      var d = "center";
      if(bond_direction == "SW" || bond_direction == "W" || bond_direction == "NW") {
        d = "right";
        if(c == 1) {
          b.text = "H"
        }b.text += this.atom.symbol
      }else {
        d = "left";
        b.text = this.atom.symbol + "H"
      }if(c > 1) {
        b.subscript = String(c)
      }
    }if(this.atom.charge) {
      if(this.atom.charge > 1) {
        b.superscript += "+" + this.atom.charge
      }else {
        if(this.atom.charge < -1) {
          b.superscript += this.atom.charge
        }else {
          if(this.atom.charge == -1) {
            b.superscript = "-"
          }else {
            if(this.atom.charge == 1) {
              b.superscript = "+"
            }
          }
        }
      }
    }
  }else {
    b.text = ""
  }b.justification = d;
  return b
};
a.bondOrientation = function(b) {
  b = this.atom.bonds.getValues()[b];
  var c = b.target.coord, d = b.source.coord, e = c.y - d.y;
  c = c.x - d.x;
  if(this.atom == b.source) {
    c = -c;
    e = -e
  }b = Math.atan2(e, c) * 180 / Math.PI;
  if(b < 0) {
    b = 360 + b
  }return b
};
a.bondDirection = function() {
  var b = this.atom.bonds.getCount(), c = this.bondOrientation(0);
  if(b > 1) {
    for(var d = 1;d < b;++d) {
      c += this.bondOrientation(d)
    }c = c / b % 360
  }return c > 350 || c <= 10 ? "E" : c > 10 && c <= 80 ? "SE" : c > 80 && c <= 100 ? "S" : c > 100 && c <= 170 ? "SW" : c > 170 && c <= 190 ? "W" : c > 190 && c <= 260 ? "NW" : c > 260 && c <= 280 ? "N" : "NE"
};goog.math.Line = function(b, c, d, e) {
  this.x0 = b;
  this.y0 = c;
  this.x1 = d;
  this.y1 = e
};
a = goog.math.Line.prototype;
a.clone = function() {
  return new goog.math.Line(this.x0, this.y0, this.x1, this.y1)
};
a.equals = function(b) {
  return this.x0 == b.x0 && this.y0 == b.y0 && this.x1 == b.x1 && this.y1 == b.y1
};
a.getSegmentLengthSquared = function() {
  var b = this.x1 - this.x0, c = this.y1 - this.y0;
  return b * b + c * c
};
a.getSegmentLength = function() {
  return Math.sqrt(this.getSegmentLengthSquared())
};
a.getClosestLinearInterpolation_ = function(b, c) {
  if(b instanceof goog.math.Coordinate) {
    c = b.y;
    b = b.x
  }else {
    c = c
  }var d = this.x0, e = this.y0;
  return((b - d) * (this.x1 - d) + (c - e) * (this.y1 - e)) / this.getSegmentLengthSquared()
};
a.getInterpolatedPoint = function(b) {
  return new goog.math.Coordinate(goog.math.lerp(this.x0, this.x1, b), goog.math.lerp(this.y0, this.y1, b))
};
a.getClosestPoint = function(b, c) {
  return this.getInterpolatedPoint(this.getClosestLinearInterpolation_(b, c))
};
a.getClosestSegmentPoint = function(b, c) {
  return this.getInterpolatedPoint(goog.math.clamp(this.getClosestLinearInterpolation_(b, c), 0, 1))
};jchemhub.math = {};
jchemhub.math.Line = function(b, c) {
  goog.math.Line.call(this, b.x, b.y, c.x, c.y)
};
goog.inherits(jchemhub.math.Line, goog.math.Line);
jchemhub.math.Line.prototype.getTheta = function() {
  return Math.atan2(this.y1 - this.y0, this.x1 - this.x0)
};
jchemhub.math.Line.prototype.getStart = function() {
  return new goog.math.Coordinate(this.x0, this.y0)
};
jchemhub.math.Line.prototype.getEnd = function() {
  return new goog.math.Coordinate(this.x1, this.y1)
};jchemhub.view.BondDrawing = function(b) {
  jchemhub.view.Drawing.call(this);
  this.bond = b
};
goog.inherits(jchemhub.view.BondDrawing, jchemhub.view.Drawing);
a = jchemhub.view.BondDrawing.prototype;
a.getCoords = function() {
  return[this.bond.source.coord, this.bond.target.coord]
};
a.getBoundingBox = function() {
  var b = this.getConfig().get("bond").stroke.width / 2;
  return goog.math.Box.boundingBox.apply(null, [new goog.math.Coordinate(this.bond.source.coord.x - b, this.bond.source.coord.y - b), new goog.math.Coordinate(this.bond.target.coord.x + b, this.bond.target.coord.y + b)])
};
a.getTheta = function() {
  return(new jchemhub.math.Line(this.bond.source.coord, this.bond.target.coord)).getTheta()
};
a.render = function() {
  var b = new goog.graphics.SolidFill("red", 0.0010), c = this.getConfig().get("highlight").radius * 3, d = this.getTheta(), e = d + Math.PI / 2;
  d = d - Math.PI / 2;
  e = goog.graphics.AffineTransform.getTranslateInstance(Math.cos(e) * c, Math.sin(e) * c, 0, 0, 0);
  c = goog.graphics.AffineTransform.getTranslateInstance(Math.cos(d) * c, Math.sin(d) * c, 0, 0, 0);
  e = this.transformCoords(e, this.getCoords());
  c = this.transformCoords(c, this.getCoords());
  c = this.transformCoords(this.getTransform(), [e[0], e[1], c[0], c[1]]);
  bondBoxPath = new goog.graphics.Path;
  bondBoxPath.moveTo(c[0].x, c[0].y);
  bondBoxPath.lineTo(c[2].x, c[2].y);
  bondBoxPath.lineTo(c[3].x, c[3].y);
  bondBoxPath.lineTo(c[1].x, c[1].y);
  bondBoxPath.close();
  this.getGraphics().drawPath(bondBoxPath, null, b, this.getGroup());
  this.getGroup().getElement()._parentGroup = this.getGroup()
};
a._highlightOn = function(b) {
  b = b.currentTarget;
  var c = b.getConfig(), d = c.get("bond").stroke.width;
  d = new goog.graphics.Stroke(d, c.get("highlight").color);
  c = c.get("highlight").radius * b.getTransform().getScaleX();
  var e = this.getTheta(), f = e - Math.PI / 2;
  e = e <= 0 ? b.bond.source.coord.y <= b.bond.target.coord.y ? -180 : 180 : b.bond.source.coord.y > b.bond.target.coord.y ? 180 : -180;
  var g = b.transformCoords(b.getTransform(), b.getCoords()), h = new goog.graphics.Path;
  h.arc(g[0].x, g[0].y, c, c, f, e);
  h.arc(g[1].x, g[1].y, c, c, f, -e);
  if(!b.bondHighlightGroup) {
    b.bondHighlightGroup = b.getGraphics().createGroup()
  }b.getGraphics().drawPath(h, d, null, b.bondHighlightGroup)
};
a._highlightOff = function(b) {
  b.currentTarget.bondHighlightGroup && b.currentTarget.bondHighlightGroup.clear()
};
a.drag = function(b) {
  var c = b.currentTarget, d = new goog.fx.Dragger(c.getGroup().getElement());
  d.prevX = b.clientX;
  d.prevY = b.clientY;
  d.bond = c;
  d.addEventListener(goog.fx.Dragger.EventType.DRAG, function(e) {
    var f = d.bond.getGroup().getTransform(), g = e.clientX - d.prevX + f.getTranslateX();
    f = e.clientY - d.prevY + f.getTranslateY();
    c.getGroup().setTransformation(g, f, 0, 0, 0);
    d.prevX = e.clientX;
    d.prevY = e.clientY
  });
  d.addEventListener(goog.fx.Dragger.EventType.END, function() {
    console.log("finish");
    d.dispose()
  });
  d.startDrag(b)
};jchemhub.view.SingleBondDownDrawing = function(b) {
  jchemhub.view.BondDrawing.call(this, b)
};
goog.inherits(jchemhub.view.SingleBondDownDrawing, jchemhub.view.BondDrawing);
jchemhub.view.SingleBondDownDrawing.prototype.render = function() {
  var b = new goog.graphics.Path, c = this.getConfig().get("bond").stroke.width / 10, d = this.getTheta(), e = d + Math.PI / 2;
  d = d - Math.PI / 2;
  e = goog.graphics.AffineTransform.getTranslateInstance(Math.cos(e) * c, Math.sin(e) * c, 0, 0, 0);
  c = goog.graphics.AffineTransform.getTranslateInstance(Math.cos(d) * c, Math.sin(d) * c, 0, 0, 0);
  e = this.transformCoords(e, this.getCoords());
  c = this.transformCoords(c, this.getCoords());
  c = this.transformCoords(this.getTransform(), [e[0], e[1], c[0], c[1]]);
  e = new goog.graphics.Stroke(this.getConfig().get("bond").stroke.width, this.getConfig().get("bond").stroke.color);
  for(d = 1;d < 6;d++) {
    b.moveTo(c[0].x + (c[1].x - c[0].x) * d / 6, c[0].y + (c[1].y - c[0].y) * d / 6);
    b.lineTo(c[2].x + (c[3].x - c[2].x) * d / 6, c[2].y + (c[3].y - c[2].y) * d / 6)
  }this._elements.push(this.getGraphics().drawPath(b, e, null, this.getGroup()));
  jchemhub.view.SingleBondDownDrawing.superClass_.render.call(this)
};jchemhub.view.SingleBondDrawing = function(b) {
  jchemhub.view.BondDrawing.call(this, b)
};
goog.inherits(jchemhub.view.SingleBondDrawing, jchemhub.view.BondDrawing);
jchemhub.view.SingleBondDrawing.prototype.render = function() {
  var b = new goog.graphics.Path, c = new goog.graphics.Stroke(this.getConfig().get("bond").stroke.width, this.getConfig().get("bond").stroke.color), d = this.transformCoords(this.getTransform(), this.getCoords());
  b.moveTo(d[0].x, d[0].y);
  b.lineTo(d[1].x, d[1].y);
  this._elements.push(this.getGraphics().drawPath(b, c, null, this.getGroup()));
  jchemhub.view.SingleBondDrawing.superClass_.render.call(this)
};jchemhub.view.SingleBondUpDrawing = function(b) {
  jchemhub.view.BondDrawing.call(this, b)
};
goog.inherits(jchemhub.view.SingleBondUpDrawing, jchemhub.view.BondDrawing);
jchemhub.view.SingleBondUpDrawing.prototype.render = function() {
  var b = new goog.graphics.Path, c = this.getConfig().get("bond").stroke.width / 10, d = new goog.graphics.Stroke(c, this.getConfig().get("bond").stroke.color), e = new goog.graphics.SolidFill(this.getConfig().get("bond").fill.color), f = this.getTheta(), g = f + Math.PI / 2;
  f = f - Math.PI / 2;
  g = this.transformCoords(goog.graphics.AffineTransform.getTranslateInstance(Math.cos(g) * c, Math.sin(g) * c, 0, 0, 0), [this.bond.target.coord])[0];
  c = this.transformCoords(goog.graphics.AffineTransform.getTranslateInstance(Math.cos(f) * c, Math.sin(f) * c, 0, 0, 0), [this.bond.target.coord])[0];
  c = this.transformCoords(this.getTransform(), [this.bond.source.coord, g, c]);
  b.moveTo(c[0].x, c[0].y);
  b.lineTo(c[1].x, c[1].y);
  b.lineTo(c[2].x, c[2].y);
  this._elements.push(this.getGraphics().drawPath(b, d, e, this.getGroup()));
  jchemhub.view.SingleBondUpDrawing.superClass_.render.call(this)
};jchemhub.view.SingleBondEitherDrawing = function(b) {
  jchemhub.view.BondDrawing.call(this, b)
};
goog.inherits(jchemhub.view.SingleBondEitherDrawing, jchemhub.view.BondDrawing);
jchemhub.view.SingleBondEitherDrawing.prototype.render = function() {
  var b = new goog.graphics.Path, c = this.getConfig().get("bond").stroke.width / 10, d = this.getTheta(), e = d + Math.PI / 2;
  d = d - Math.PI / 2;
  e = goog.graphics.AffineTransform.getTranslateInstance(Math.cos(e) * c, Math.sin(e) * c, 0, 0, 0);
  c = goog.graphics.AffineTransform.getTranslateInstance(Math.cos(d) * c, Math.sin(d) * c, 0, 0, 0);
  e = this.transformCoords(e, this.getCoords());
  c = this.transformCoords(c, this.getCoords());
  c = this.transformCoords(this.getTransform(), [e[0], e[1], c[0], c[1]]);
  e = new goog.graphics.Stroke(this.getConfig().get("bond").stroke.width, this.getConfig().get("bond").stroke.color);
  b.moveTo(c[0].x, c[0].y);
  for(d = 1;d < 10;d++) {
    d % 2 ? b.lineTo(c[0].x + (c[1].x - c[0].x) * d / 10, c[0].y + (c[1].y - c[0].y) * d / 10) : b.lineTo(c[2].x + (c[3].x - c[2].x) * d / 10, c[2].y + (c[3].y - c[2].y) * d / 10)
  }this._elements.push(this.getGraphics().drawPath(b, e, null, this.getGroup()));
  jchemhub.view.SingleBondDownDrawing.superClass_.render.call(this)
};jchemhub.view.DoubleBondDrawing = function(b) {
  jchemhub.view.BondDrawing.call(this, b)
};
goog.inherits(jchemhub.view.DoubleBondDrawing, jchemhub.view.BondDrawing);
jchemhub.view.DoubleBondDrawing.prototype.getFirstRing = function() {
  return goog.array.find(this.getParent().molecule.getRings(), function(b) {
    return goog.array.contains(b.bonds, this.bond)
  }, this)
};
jchemhub.view.DoubleBondDrawing.prototype.render = function() {
  var b = this.getConfig().get("bond").stroke.width;
  b = new goog.graphics.Stroke(b, this.getConfig().get("bond").stroke.color);
  var c = this.getFirstRing();
  if(c) {
    var d = c.ringCenter;
    c = goog.math.Coordinate.difference(d, this.bond.source.coord);
    c = goog.math.Coordinate.sum(new goog.math.Coordinate(c.x / 5, c.y / 5), this.bond.source.coord);
    d = goog.math.Coordinate.difference(d, this.bond.target.coord);
    d = goog.math.Coordinate.sum(new goog.math.Coordinate(d.x / 5, d.y / 5), this.bond.target.coord);
    c = this.transformCoords(this.getTransform(), [this.bond.source.coord, this.bond.target.coord, c, d]);
    d = new goog.graphics.Path
  }else {
    d = this.getTheta();
    c = d + Math.PI / 2;
    d = d - Math.PI / 2;
    var e = goog.math.Coordinate.distance(this.bond.source.coord, this.bond.target.coord) / 12;
    c = goog.graphics.AffineTransform.getTranslateInstance(Math.cos(c) * e, Math.sin(c) * e, 0, 0, 0);
    d = goog.graphics.AffineTransform.getTranslateInstance(Math.cos(d) * e, Math.sin(d) * e, 0, 0, 0);
    c = this.transformCoords(c, this.getCoords());
    d = this.transformCoords(d, this.getCoords());
    c = this.transformCoords(this.getTransform(), [c[0], c[1], d[0], d[1]]);
    d = new goog.graphics.Path
  }d.moveTo(c[0].x, c[0].y);
  d.lineTo(c[1].x, c[1].y);
  d.moveTo(c[2].x, c[2].y);
  d.lineTo(c[3].x, c[3].y);
  this._elements.push(this.getGraphics().drawPath(d, b, null, this.getGroup()));
  jchemhub.view.DoubleBondDrawing.superClass_.render.call(this)
};jchemhub.view.TripleBondDrawing = function(b) {
  jchemhub.view.BondDrawing.call(this, b)
};
goog.inherits(jchemhub.view.TripleBondDrawing, jchemhub.view.BondDrawing);
jchemhub.view.TripleBondDrawing.prototype.render = function() {
  var b = this.getConfig().get("bond").stroke.width;
  b = new goog.graphics.Stroke(b, this.getConfig().get("bond").stroke.color);
  var c = this.getTheta(), d = c + Math.PI / 2;
  c = c - Math.PI / 2;
  var e = goog.math.Coordinate.distance(this.bond.source.coord, this.bond.target.coord) / 6;
  d = goog.graphics.AffineTransform.getTranslateInstance(Math.cos(d) * e, Math.sin(d) * e, 0, 0, 0);
  c = goog.graphics.AffineTransform.getTranslateInstance(Math.cos(c) * e, Math.sin(c) * e, 0, 0, 0);
  d = this.transformCoords(d, this.getCoords());
  c = this.transformCoords(c, this.getCoords());
  d = this.transformCoords(this.getTransform(), [this.bond.source.coord, this.bond.target.coord, d[0], d[1], c[0], c[1]]);
  c = new goog.graphics.Path;
  c.moveTo(d[0].x, d[0].y);
  c.lineTo(d[1].x, d[1].y);
  c.moveTo(d[2].x, d[2].y);
  c.lineTo(d[3].x, d[3].y);
  c.moveTo(d[4].x, d[4].y);
  c.lineTo(d[5].x, d[5].y);
  this._elements.push(this.getGraphics().drawPath(c, b, null, this.getGroup()));
  jchemhub.view.TripleBondDrawing.superClass_.render.call(this)
};jchemhub.view.MoleculeDrawing = function(b) {
  jchemhub.view.Drawing.call(this);
  this.molecule = b;
  goog.array.forEach(b.bonds, function(c) {
    this.add(jchemhub.controller.Controller.createBondDrawing(c))
  }, this);
  goog.array.forEach(b.atoms, function(c) {
    this.add(new jchemhub.view.AtomDrawing(c))
  }, this);
  this.addEventListener(goog.events.EventType.MOUSEDOWN, this.drag)
};
goog.inherits(jchemhub.view.MoleculeDrawing, jchemhub.view.Drawing);
jchemhub.view.MoleculeDrawing.prototype.layoutChildren = function() {
  goog.array.forEach(this.getChildren(), function(b) {
    b.setTransform(this.getTransform())
  }, this)
};
jchemhub.view.MoleculeDrawing.prototype.render = function() {
  console.log(this.molecule);
  this.renderChildren()
};
jchemhub.view.MoleculeDrawing.prototype.toggleHighlight = function() {
  this.isSelected = this.isSelected ? false : true;
  goog.array.forEach(this.getChildren(), function(b) {
    b.toggleHighlight()
  })
};
jchemhub.view.MoleculeDrawing.prototype.drag = function(b) {
  var c = b.currentTarget, d = new goog.fx.Dragger(c.getGroup().getElement());
  d._prevX = b.clientX;
  d._prevY = b.clientY;
  d._startX = b.clientX;
  d._startY = b.clientY;
  d.molecule = c;
  d.addEventListener(goog.fx.Dragger.EventType.DRAG, function(e) {
    goog.array.forEach(d.molecule.getChildren(), function(f) {
      var g = f.getGroup().getTransform(), h = e.clientX - d._prevX + g.getTranslateX();
      g = e.clientY - d._prevY + g.getTranslateY();
      f.getGroup().setTransformation(h, g, 0, 0, 0)
    });
    d._prevX = e.clientX;
    d._prevY = e.clientY
  });
  d.addEventListener(goog.fx.Dragger.EventType.END, function(e) {
    e = new goog.graphics.AffineTransform.getTranslateInstance(e.clientX - d._startX, e.clientY - d._startY);
    console.log(["trans", e]);
    d.molecule.transformDrawing(e);
    d.molecule.clear();
    d.molecule.render();
    d.dispose()
  });
  d.startDrag(b)
};jchemhub.view.ReactionDrawing = function(b) {
  jchemhub.view.Drawing.call(this);
  this.reaction = b;
  var c = true;
  goog.array.forEach(b.reactants, function(d) {
    if(c) {
      c = false
    }else {
      this.add(new jchemhub.view.PlusDrawing)
    }this.add(jchemhub.controller.Controller.buildMoleculeDrawing(d))
  }, this);
  this.add(new jchemhub.view.ArrowDrawing);
  c = true;
  goog.array.forEach(b.products, function(d) {
    if(c) {
      c = false
    }else {
      this.add(new jchemhub.view.PlusDrawing)
    }this.add(jchemhub.controller.Controller.buildMoleculeDrawing(d))
  }, this)
};
goog.inherits(jchemhub.view.ReactionDrawing, jchemhub.view.Drawing);
jchemhub.view.ReactionDrawing.prototype.layoutChildren = function(b) {
  var c = this.getSize(), d = this.getChildren(), e = d.length, f = 0;
  goog.array.forEach(d, function(g) {
    var h = g.getSize(), j = (b.width - this.getConfig().get("margin") * (e - 1)) * h.width / c.width, k = b.height * h.height / c.height, l = b.left + f;
    h = (c.height - h.height) / c.height * 0.5 * b.height + this.getConfig().get("margin");
    k = new goog.math.Rect(l, h, j, k);
    g.layout(k);
    f += j + +this.getConfig().get("margin")
  }, this)
};
jchemhub.view.ReactionDrawing.prototype.getBoundingBox = function() {
  var b = new goog.math.Box(0, 0, 0, 0);
  goog.array.forEach(this.getChildren(), function(c) {
    b.right += c.getSize().width;
    b.bottom = Math.max(b.bottom, c.getSize().height)
  }, this);
  return b
};
jchemhub.view.ReactionDrawing.prototype.render = function() {
  this.renderChildren()
};
jchemhub.view.Drawing.prototype.updateTransformedCoords = function() {
};jchemhub.view.ArrowDrawing = function() {
  jchemhub.view.Drawing.call(this);
  this._nock = new goog.math.Coordinate(0, 0);
  this._tip = new goog.math.Coordinate(1, 0);
  this._head1 = new goog.math.Coordinate(0.75, 0.125);
  this._head2 = new goog.math.Coordinate(0.75, -0.125)
};
goog.inherits(jchemhub.view.ArrowDrawing, jchemhub.view.Drawing);
jchemhub.view.ArrowDrawing.prototype.render = function() {
  var b = new goog.graphics.Path, c = new goog.graphics.Stroke(this.getConfig().get("arrow").stroke.width, this.getConfig().get("arrow").stroke.color), d = this.transformCoords(this.getTransform(), [this._nock, this._tip, this._head1, this._head2]);
  b.moveTo(d[0].x, d[0].y);
  b.lineTo(d[1].x, d[1].y);
  b.lineTo(d[2].x, d[2].y);
  b.moveTo(d[1].x, d[1].y);
  b.lineTo(d[3].x, d[3].y);
  this.getGraphics().drawPath(b, c, null, this.getGroup())
};
jchemhub.view.ArrowDrawing.prototype.getCoords = function() {
  return[this._nock, this._tip, this._head1, this._head2]
};
jchemhub.view.Drawing.prototype.updateTransformedCoords = function() {
};jchemhub.view.PlusDrawing = function() {
  jchemhub.view.Drawing.call(this);
  this._h0 = new goog.math.Coordinate(0, 0);
  this._h1 = new goog.math.Coordinate(0.25, 0);
  this._v0 = new goog.math.Coordinate(0.125, 0.125);
  this._v1 = new goog.math.Coordinate(0.125, -0.125)
};
goog.inherits(jchemhub.view.PlusDrawing, jchemhub.view.Drawing);
jchemhub.view.PlusDrawing.prototype.render = function() {
  var b = new goog.graphics.Path, c = new goog.graphics.Stroke(this.getConfig().get("plus").stroke.width, this.getConfig().get("plus").stroke.color), d = this.transformCoords(this.getTransform(), [this._h0, this._h1, this._v0, this._v1]);
  b.moveTo(d[0].x, d[0].y);
  b.lineTo(d[1].x, d[1].y);
  b.moveTo(d[2].x, d[2].y);
  b.lineTo(d[3].x, d[3].y);
  this.getGraphics().drawPath(b, c, null, this.getGroup())
};
jchemhub.view.PlusDrawing.prototype.getCoords = function() {
  return[this._h0, this._h1, this._v0, this._v1]
};
jchemhub.view.Drawing.prototype.updateTransformedCoords = function() {
};jchemhub.resource = {};
jchemhub.resource.Covalence = {C:4, Si:4, N:3, P:3, O:2, S:2, H:1};goog.structs.getCount = function(b) {
  if(typeof b.getCount == "function") {
    return b.getCount()
  }if(goog.isArrayLike(b) || goog.isString(b)) {
    return b.length
  }return goog.object.getCount(b)
};
goog.structs.getValues = function(b) {
  if(typeof b.getValues == "function") {
    return b.getValues()
  }if(goog.isString(b)) {
    return b.split("")
  }if(goog.isArrayLike(b)) {
    for(var c = [], d = b.length, e = 0;e < d;e++) {
      c.push(b[e])
    }return c
  }return goog.object.getValues(b)
};
goog.structs.getKeys = function(b) {
  if(typeof b.getKeys == "function") {
    return b.getKeys()
  }if(typeof b.getValues != "function") {
    if(goog.isArrayLike(b) || goog.isString(b)) {
      var c = [];
      b = b.length;
      for(var d = 0;d < b;d++) {
        c.push(d)
      }return c
    }return goog.object.getKeys(b)
  }
};
goog.structs.contains = function(b, c) {
  if(typeof b.contains == "function") {
    return b.contains(c)
  }if(typeof b.containsValue == "function") {
    return b.containsValue(c)
  }if(goog.isArrayLike(b) || goog.isString(b)) {
    return goog.array.contains(b, c)
  }return goog.object.containsValue(b, c)
};
goog.structs.isEmpty = function(b) {
  if(typeof b.isEmpty == "function") {
    return b.isEmpty()
  }if(goog.isArrayLike(b) || goog.isString(b)) {
    return goog.array.isEmpty(b)
  }return goog.object.isEmpty(b)
};
goog.structs.clear = function(b) {
  if(typeof b.clear == "function") {
    b.clear()
  }else {
    goog.isArrayLike(b) ? goog.array.clear(b) : goog.object.clear(b)
  }
};
goog.structs.forEach = function(b, c, d) {
  if(typeof b.forEach == "function") {
    b.forEach(c, d)
  }else {
    if(goog.isArrayLike(b) || goog.isString(b)) {
      goog.array.forEach(b, c, d)
    }else {
      for(var e = goog.structs.getKeys(b), f = goog.structs.getValues(b), g = f.length, h = 0;h < g;h++) {
        c.call(d, f[h], e && e[h], b)
      }
    }
  }
};
goog.structs.filter = function(b, c, d) {
  if(typeof b.filter == "function") {
    return b.filter(c, d)
  }if(goog.isArrayLike(b) || goog.isString(b)) {
    return goog.array.filter(b, c, d)
  }var e, f = goog.structs.getKeys(b), g = goog.structs.getValues(b), h = g.length;
  if(f) {
    e = {};
    for(var j = 0;j < h;j++) {
      if(c.call(d, g[j], f[j], b)) {
        e[f[j]] = g[j]
      }
    }
  }else {
    e = [];
    for(j = 0;j < h;j++) {
      c.call(d, g[j], undefined, b) && e.push(g[j])
    }
  }return e
};
goog.structs.map = function(b, c, d) {
  if(typeof b.map == "function") {
    return b.map(c, d)
  }if(goog.isArrayLike(b) || goog.isString(b)) {
    return goog.array.map(b, c, d)
  }var e, f = goog.structs.getKeys(b), g = goog.structs.getValues(b), h = g.length;
  if(f) {
    e = {};
    for(var j = 0;j < h;j++) {
      e[f[j]] = c.call(d, g[j], f[j], b)
    }
  }else {
    e = [];
    for(j = 0;j < h;j++) {
      e[j] = c.call(d, g[j], undefined, b)
    }
  }return e
};
goog.structs.some = function(b, c, d) {
  if(typeof b.some == "function") {
    return b.some(c, d)
  }if(goog.isArrayLike(b) || goog.isString(b)) {
    return goog.array.some(b, c, d)
  }for(var e = goog.structs.getKeys(b), f = goog.structs.getValues(b), g = f.length, h = 0;h < g;h++) {
    if(c.call(d, f[h], e && e[h], b)) {
      return true
    }
  }return false
};
goog.structs.every = function(b, c, d) {
  if(typeof b.every == "function") {
    return b.every(c, d)
  }if(goog.isArrayLike(b) || goog.isString(b)) {
    return goog.array.every(b, c, d)
  }for(var e = goog.structs.getKeys(b), f = goog.structs.getValues(b), g = f.length, h = 0;h < g;h++) {
    if(!c.call(d, f[h], e && e[h], b)) {
      return false
    }
  }return true
};goog.iter = {};
goog.iter.Iterable = goog.typedef;
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global.StopIteration : Error("StopIteration");
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function() {
  return this
};
goog.iter.toIterator = function(b) {
  if(b instanceof goog.iter.Iterator) {
    return b
  }if(typeof b.__iterator__ == "function") {
    return b.__iterator__(false)
  }if(goog.isArrayLike(b)) {
    var c = 0, d = new goog.iter.Iterator;
    d.next = function() {
      for(;;) {
        if(c >= b.length) {
          throw goog.iter.StopIteration;
        }if(c in b) {
          return b[c++]
        }else {
          c++
        }
      }
    };
    return d
  }throw Error("Not implemented");
};
goog.iter.forEach = function(b, c, d) {
  if(goog.isArrayLike(b)) {
    try {
      goog.array.forEach(b, c, d)
    }catch(e) {
      if(e !== goog.iter.StopIteration) {
        throw e;
      }
    }
  }else {
    b = goog.iter.toIterator(b);
    try {
      for(;;) {
        c.call(d, b.next(), undefined, b)
      }
    }catch(f) {
      if(f !== goog.iter.StopIteration) {
        throw f;
      }
    }
  }
};
goog.iter.filter = function(b, c, d) {
  b = goog.iter.toIterator(b);
  var e = new goog.iter.Iterator;
  e.next = function() {
    for(;;) {
      var f = b.next();
      if(c.call(d, f, undefined, b)) {
        return f
      }
    }
  };
  return e
};
goog.iter.range = function(b, c, d) {
  var e = 0, f = b, g = d || 1;
  if(arguments.length > 1) {
    e = b;
    f = c
  }if(g == 0) {
    throw Error("Range step argument must not be zero");
  }var h = new goog.iter.Iterator;
  h.next = function() {
    if(g > 0 && e >= f || g < 0 && e <= f) {
      throw goog.iter.StopIteration;
    }var j = e;
    e += g;
    return j
  };
  return h
};
goog.iter.join = function(b, c) {
  return goog.iter.toArray(b).join(c)
};
goog.iter.map = function(b, c, d) {
  b = goog.iter.toIterator(b);
  var e = new goog.iter.Iterator;
  e.next = function() {
    for(;;) {
      var f = b.next();
      return c.call(d, f, undefined, b)
    }
  };
  return e
};
goog.iter.reduce = function(b, c, d, e) {
  var f = d;
  goog.iter.forEach(b, function(g) {
    f = c.call(e, f, g)
  });
  return f
};
goog.iter.some = function(b, c, d) {
  b = goog.iter.toIterator(b);
  try {
    for(;;) {
      if(c.call(d, b.next(), undefined, b)) {
        return true
      }
    }
  }catch(e) {
    if(e !== goog.iter.StopIteration) {
      throw e;
    }
  }return false
};
goog.iter.every = function(b, c, d) {
  b = goog.iter.toIterator(b);
  try {
    for(;;) {
      if(!c.call(d, b.next(), undefined, b)) {
        return false
      }
    }
  }catch(e) {
    if(e !== goog.iter.StopIteration) {
      throw e;
    }
  }return true
};
goog.iter.chain = function() {
  var b = arguments, c = b.length, d = 0, e = new goog.iter.Iterator;
  e.next = function() {
    try {
      if(d >= c) {
        throw goog.iter.StopIteration;
      }return goog.iter.toIterator(b[d]).next()
    }catch(f) {
      if(f !== goog.iter.StopIteration || d >= c) {
        throw f;
      }else {
        d++;
        return this.next()
      }
    }
  };
  return e
};
goog.iter.dropWhile = function(b, c, d) {
  b = goog.iter.toIterator(b);
  var e = new goog.iter.Iterator, f = true;
  e.next = function() {
    for(;;) {
      var g = b.next();
      if(!(f && c.call(d, g, undefined, b))) {
        f = false;
        return g
      }
    }
  };
  return e
};
goog.iter.takeWhile = function(b, c, d) {
  b = goog.iter.toIterator(b);
  var e = new goog.iter.Iterator, f = true;
  e.next = function() {
    for(;;) {
      if(f) {
        var g = b.next();
        if(c.call(d, g, undefined, b)) {
          return g
        }else {
          f = false
        }
      }else {
        throw goog.iter.StopIteration;
      }
    }
  };
  return e
};
goog.iter.toArray = function(b) {
  if(goog.isArrayLike(b)) {
    return goog.array.toArray(b)
  }b = goog.iter.toIterator(b);
  var c = [];
  goog.iter.forEach(b, function(d) {
    c.push(d)
  });
  return c
};
goog.iter.equals = function(b, c) {
  b = goog.iter.toIterator(b);
  c = goog.iter.toIterator(c);
  var d, e;
  try {
    for(;;) {
      d = e = false;
      var f = b.next();
      d = true;
      var g = c.next();
      e = true;
      if(f != g) {
        return false
      }
    }
  }catch(h) {
    if(h !== goog.iter.StopIteration) {
      throw h;
    }else {
      if(d && !e) {
        return false
      }if(!e) {
        try {
          c.next();
          return false
        }catch(j) {
          if(j !== goog.iter.StopIteration) {
            throw j;
          }return true
        }
      }
    }
  }return false
};
goog.iter.nextOrValue = function(b, c) {
  try {
    return goog.iter.toIterator(b).next()
  }catch(d) {
    if(d != goog.iter.StopIteration) {
      throw d;
    }return c
  }
};goog.structs.Map = function(b) {
  this.map_ = {};
  this.keys_ = [];
  var c = arguments.length;
  if(c > 1) {
    if(c % 2) {
      throw Error("Uneven number of arguments");
    }for(var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1])
    }
  }else {
    b && this.addAll(b)
  }
};
a = goog.structs.Map.prototype;
a.count_ = 0;
a.version_ = 0;
a.getCount = function() {
  return this.count_
};
a.getValues = function() {
  this.cleanupKeysArray_();
  for(var b = [], c = 0;c < this.keys_.length;c++) {
    b.push(this.map_[this.keys_[c]])
  }return b
};
a.getKeys = function() {
  this.cleanupKeysArray_();
  return this.keys_.concat()
};
a.containsKey = function(b) {
  return goog.structs.Map.hasKey_(this.map_, b)
};
a.containsValue = function(b) {
  for(var c = 0;c < this.keys_.length;c++) {
    var d = this.keys_[c];
    if(goog.structs.Map.hasKey_(this.map_, d) && this.map_[d] == b) {
      return true
    }
  }return false
};
a.equals = function(b, c) {
  if(this === b) {
    return true
  }if(this.count_ != b.getCount()) {
    return false
  }c = c || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for(var d, e = 0;d = this.keys_[e];e++) {
    if(!c(this.get(d), b.get(d))) {
      return false
    }
  }return true
};
goog.structs.Map.defaultEquals = function(b, c) {
  return b === c
};
a = goog.structs.Map.prototype;
a.isEmpty = function() {
  return this.count_ == 0
};
a.clear = function() {
  this.map_ = {};
  this.version_ = this.count_ = this.keys_.length = 0
};
a.remove = function(b) {
  if(goog.structs.Map.hasKey_(this.map_, b)) {
    delete this.map_[b];
    this.count_--;
    this.version_++;
    this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_();
    return true
  }return false
};
a.cleanupKeysArray_ = function() {
  if(this.count_ != this.keys_.length) {
    for(var b = 0, c = 0;b < this.keys_.length;) {
      var d = this.keys_[b];
      if(goog.structs.Map.hasKey_(this.map_, d)) {
        this.keys_[c++] = d
      }b++
    }this.keys_.length = c
  }if(this.count_ != this.keys_.length) {
    var e = {};
    for(c = b = 0;b < this.keys_.length;) {
      d = this.keys_[b];
      if(!goog.structs.Map.hasKey_(e, d)) {
        this.keys_[c++] = d;
        e[d] = 1
      }b++
    }this.keys_.length = c
  }
};
a.get = function(b, c) {
  if(goog.structs.Map.hasKey_(this.map_, b)) {
    return this.map_[b]
  }return c
};
a.set = function(b, c) {
  if(!goog.structs.Map.hasKey_(this.map_, b)) {
    this.count_++;
    this.keys_.push(b);
    this.version_++
  }this.map_[b] = c
};
a.addAll = function(b) {
  var c;
  if(b instanceof goog.structs.Map) {
    c = b.getKeys();
    b = b.getValues()
  }else {
    c = goog.object.getKeys(b);
    b = goog.object.getValues(b)
  }for(var d = 0;d < c.length;d++) {
    this.set(c[d], b[d])
  }
};
a.clone = function() {
  return new goog.structs.Map(this)
};
a.transpose = function() {
  for(var b = new goog.structs.Map, c = 0;c < this.keys_.length;c++) {
    var d = this.keys_[c];
    b.set(this.map_[d], d)
  }return b
};
a.getKeyIterator = function() {
  return this.__iterator__(true)
};
a.getValueIterator = function() {
  return this.__iterator__(false)
};
a.__iterator__ = function(b) {
  this.cleanupKeysArray_();
  var c = 0, d = this.keys_, e = this.map_, f = this.version_, g = this, h = new goog.iter.Iterator;
  h.next = function() {
    for(;;) {
      if(f != g.version_) {
        throw Error("The map has changed since the iterator was created");
      }if(c >= d.length) {
        throw goog.iter.StopIteration;
      }var j = d[c++];
      return b ? j : e[j]
    }
  };
  return h
};
goog.structs.Map.hasKey_ = function(b, c) {
  return Object.prototype.hasOwnProperty.call(b, c)
};goog.structs.Set = function(b) {
  this.map_ = new goog.structs.Map;
  b && this.addAll(b)
};
goog.structs.Set.getKey_ = function(b) {
  var c = typeof b;
  return c == "object" && b || c == "function" ? "o" + goog.getUid(b) : c.substr(0, 1) + b
};
a = goog.structs.Set.prototype;
a.getCount = function() {
  return this.map_.getCount()
};
a.add = function(b) {
  this.map_.set(goog.structs.Set.getKey_(b), b)
};
a.addAll = function(b) {
  b = goog.structs.getValues(b);
  for(var c = b.length, d = 0;d < c;d++) {
    this.add(b[d])
  }
};
a.removeAll = function(b) {
  b = goog.structs.getValues(b);
  for(var c = b.length, d = 0;d < c;d++) {
    this.remove(b[d])
  }
};
a.remove = function(b) {
  return this.map_.remove(goog.structs.Set.getKey_(b))
};
a.clear = function() {
  this.map_.clear()
};
a.isEmpty = function() {
  return this.map_.isEmpty()
};
a.contains = function(b) {
  return this.map_.containsKey(goog.structs.Set.getKey_(b))
};
a.containsAll = function(b) {
  return goog.structs.every(b, this.contains, this)
};
a.intersection = function(b) {
  var c = new goog.structs.Set;
  b = goog.structs.getValues(b);
  for(var d = 0;d < b.length;d++) {
    var e = b[d];
    this.contains(e) && c.add(e)
  }return c
};
a.getValues = function() {
  return this.map_.getValues()
};
a.clone = function() {
  return new goog.structs.Set(this)
};
a.equals = function(b) {
  return this.getCount() == goog.structs.getCount(b) && this.isSubsetOf(b)
};
a.isSubsetOf = function(b) {
  var c = goog.structs.getCount(b);
  if(this.getCount() > c) {
    return false
  }if(!(b instanceof goog.structs.Set) && c > 5) {
    b = new goog.structs.Set(b)
  }return goog.structs.every(this, function(d) {
    return goog.structs.contains(b, d)
  })
};
a.__iterator__ = function() {
  return this.map_.__iterator__(false)
};jchemhub.model = {};
jchemhub.model.Atom = function(b, c, d, e, f, g) {
  this.symbol = b;
  this.coord = new goog.math.Coordinate(c, d);
  this.bonds = new goog.structs.Set;
  this.charge = goog.isDef(e) ? e : 0;
  this.isotope = goog.isDef(g) ? g : 0;
  this.aromatic = goog.isDef(f) ? f : false;
  this.hybridization = null
};
jchemhub.model.Atom.prototype.countBonds = function() {
  return this.bonds.getCount()
};
jchemhub.model.Atom.prototype.hydrogenCount = function() {
  var b = jchemhub.resource.Covalence[this.symbol], c = goog.array.reduce(this.bonds.getValues(), function(e, f) {
    return e + f.constructor.ORDER
  }, 0), d = 0;
  if(b) {
    d = b - c + this.charge
  }return d
};
jchemhub.model.Atom.Hybridizations = {S:0, SP1:1, SP2:2, SP3:3, PLANAR3:4, SP3D1:5, SP3D2:6, SP3D3:7, SP3D4:8, SP3D5:9};jchemhub.model.Bond = function(b, c) {
  this.source = b;
  this.target = c
};jchemhub.model.SingleBond = function(b, c) {
  jchemhub.model.Bond.call(this, b, c)
};
goog.inherits(jchemhub.model.SingleBond, jchemhub.model.Bond);
jchemhub.model.SingleBond.ORDER = 1;jchemhub.model.SingleBondUp = function(b, c) {
  jchemhub.model.SingleBond.call(this, b, c)
};
goog.inherits(jchemhub.model.SingleBondUp, jchemhub.model.SingleBond);
jchemhub.model.SingleBondUp.ORDER = 1;jchemhub.model.SingleBondDown = function(b, c) {
  jchemhub.model.SingleBond.call(this, b, c)
};
goog.inherits(jchemhub.model.SingleBondDown, jchemhub.model.SingleBond);
jchemhub.model.SingleBondDown.ORDER = 1;jchemhub.model.SingleBondUpOrDown = function(b, c) {
  jchemhub.model.SingleBond.call(this, b, c)
};
goog.inherits(jchemhub.model.SingleBondUpOrDown, jchemhub.model.SingleBond);
jchemhub.model.SingleBondUpOrDown.ORDER = 1;jchemhub.model.DoubleBond = function(b, c) {
  jchemhub.model.Bond.call(this, b, c)
};
goog.inherits(jchemhub.model.DoubleBond, jchemhub.model.Bond);
jchemhub.model.DoubleBond.ORDER = 2;jchemhub.model.TripleBond = function(b, c) {
  jchemhub.model.Bond.call(this, b, c)
};
goog.inherits(jchemhub.model.TripleBond, jchemhub.model.Bond);
jchemhub.model.TripleBond.ORDER = 3;jchemhub.model.QuadrupleBond = function(b, c) {
  jchemhub.model.Bond.call(this, b, c)
};
goog.inherits(jchemhub.model.QuadrupleBond, jchemhub.model.Bond);
jchemhub.model.QuadrupleBond.ORDER = 4;jchemhub.model.Reaction = function() {
  this.header = "";
  this.reactants = [];
  this.products = []
};
jchemhub.model.Reaction.prototype.addReactant = function(b) {
  this.reactants.push(b)
};
jchemhub.model.Reaction.prototype.addProduct = function(b) {
  this.products.push(b)
};jchemhub.ring = {};
jchemhub.ring.Ring = function(b, c) {
  this.atoms = b;
  this.bonds = c;
  for(var d = c = 0, e = 0, f = b.length;e < f;e++) {
    c += b[e].coord.x;
    d += b[e].coord.y
  }this.ringCenter = new goog.math.Coordinate(c / b.length, d / b.length)
};jchemhub.ring.RingFinder = function() {
};
jchemhub.ring.RingFinder.findRings = function(b) {
  var c = [];
  graph = new jchemhub.ring.PathGraph(b);
  for(var d = 0, e = b.countAtoms();d < e;d++) {
    for(var f = graph.remove(b.getAtom(d)), g = 0;g < f.length;g++) {
      edge = f[g];
      atom_ring = edge.atoms;
      c.push(atom_ring)
    }
  }goog.array.sort(c);
  f = [];
  d = 0;
  for(e = c.length;d < e;d++) {
    f.push(this.createRing(c[d], b))
  }return f
};
jchemhub.ring.RingFinder.createRing = function(b, c) {
  for(var d = [], e = 0, f = b.length - 1;e < f;e++) {
    bond = c.findBond(b[e], b[e + 1]);
    bond != null && d.push(bond)
  }goog.array.removeAt(b, b.length - 1);
  return new jchemhub.ring.Ring(b, d)
};
jchemhub.ring.PathGraph = function(b) {
  this.edges = [];
  this.atoms = [];
  for(var c = 0, d = b.countBonds();c < d;c++) {
    bond = b.getBond(c);
    this.edges.push(new jchemhub.ring.PathEdge([bond.source, bond.target]))
  }c = 0;
  for(d = b.countAtoms();c < d;c++) {
    this.atoms.push(b.getAtom(c))
  }
};
jchemhub.ring.PathGraph.prototype.remove = function(b) {
  var c = this.getEdges(b);
  result = [];
  for(var d = 0, e = c.length;d < e;d++) {
    c[d].isCycle() && result.push(c[d])
  }d = 0;
  for(e = result.length;d < e;d++) {
    goog.array.contains(c, result[d]) && goog.array.remove(c, result[d]);
    goog.array.contains(this.edges, result[d]) && goog.array.remove(this.edges, result[d])
  }newEdges = this.spliceEdges(c);
  d = 0;
  for(e = c.length;d < e;d++) {
    goog.array.contains(this.edges, c[d]) && goog.array.remove(this.edges, c[d])
  }d = 0;
  for(e = newEdges.length;d < e;d++) {
    goog.array.contains(this.edges, newEdges[d]) || this.edges.push(newEdges[d])
  }goog.array.remove(this.atoms, b);
  return result
};
jchemhub.ring.PathGraph.prototype.getEdges = function(b) {
  for(var c = [], d = 0, e = this.edges.length;d < e;d++) {
    edge = this.edges[d];
    if(edge.isCycle()) {
      goog.array.contains(edge.atoms, b) && c.push(edge)
    }else {
      var f = edge.atoms.length - 1;
      if(edge.atoms[0] == b || edge.atoms[f] == b) {
        c.push(edge)
      }
    }
  }return c
};
jchemhub.ring.PathGraph.prototype.spliceEdges = function(b) {
  for(var c = [], d = 0, e = b.length;d < e;d++) {
    for(var f = d + 1;f < e;f++) {
      spliced = b[f].splice(b[d]);
      spliced != null && c.push(spliced)
    }
  }return c
};
jchemhub.ring.PathEdge = function(b) {
  this.atoms = b
};
jchemhub.ring.PathEdge.prototype.isCycle = function() {
  var b = this.atoms.length - 1;
  return this.atoms.length > 2 && this.atoms[0] == this.atoms[b]
};
jchemhub.ring.PathEdge.prototype.splice = function(b) {
  intersection = this.getIntersection(b.atoms);
  newAtoms = [];
  for(var c = 0, d = this.atoms.length;c < d;c++) {
    newAtoms.push(this.atoms[c])
  }this.atoms[0] == intersection && newAtoms.reverse();
  if(b.atoms[0] == intersection) {
    c = 1;
    for(d = b.atoms.length;c < d;c++) {
      newAtoms.push(b.atoms[c])
    }
  }else {
    for(c = b.atoms.length - 2;c >= 0;c--) {
      newAtoms.push(b.atoms[c])
    }
  }if(!this.isRealPath(newAtoms)) {
    return null
  }return new jchemhub.ring.PathEdge(newAtoms)
};
jchemhub.ring.PathEdge.prototype.isRealPath = function(b) {
  for(var c = 1, d = b.length - 1;c < d;c++) {
    for(var e = 1;e < d;e++) {
      if(c != e) {
        if(b[c] == b[e]) {
          return false
        }
      }
    }
  }return true
};
jchemhub.ring.PathEdge.prototype.getIntersection = function(b) {
  var c = this.atoms.length - 1, d = b.length - 1;
  if(this.atoms[c] == b[0] || this.atoms[c] == b[d]) {
    return this.atoms[c]
  }if(this.atoms[0] == b[0] || this.atoms[0] == b[d]) {
    return this.atoms[0]
  }throw"Couldn't splice - no intersection";
};jchemhub.model.Molecule = function(b) {
  this.bonds = [];
  this.atoms = [];
  this.name = b ? b : ""
};
a = jchemhub.model.Molecule.prototype;
a.addBond = function(b) {
  this.bonds.push(b);
  b.source.bonds.add(b);
  b.target.bonds.add(b)
};
a.getAtom = function(b) {
  return this.atoms[b]
};
a.getBond = function(b) {
  return this.bonds[b]
};
a.findBond = function(b, c) {
  for(var d = 0, e = this.bonds.length;d < e;d++) {
    var f = this.bonds[d];
    if(b == f.source && c == f.target || c == f.source && b == f.target) {
      return f
    }
  }return null
};
a.indexOfAtom = function(b) {
  return goog.array.indexOf(this.atoms, b)
};
a.indexOfBond = function(b) {
  return goog.array.indexOf(this.bonds, b)
};
a.removeAtom = function(b) {
  var c;
  if(b.constructor == Number) {
    c = this.atoms[b]
  }else {
    if(b.constructor == jchemhub.model.Atom) {
      c = b
    }
  }b = c.bonds.getValues();
  var d = this.bonds;
  goog.array.forEach(b, function(e) {
    goog.array.remove(d, e)
  });
  c.bonds.clear();
  goog.array.remove(this.atoms, c)
};
a.removeBond = function(b) {
  var c;
  if(b.constructor == Number) {
    c = this.bonds[b]
  }else {
    if(b.constructor == jchemhub.model.Bond) {
      c = b
    }
  }c.source.bonds.remove(c);
  c.target.bonds.remove(c);
  goog.array.remove(this.bonds, c)
};
a.countAtoms = function() {
  return this.atoms.length
};
a.countBonds = function() {
  return this.bonds.length
};
a.addAtom = function(b) {
  this.atoms.push(b)
};
a.getRings = function() {
  return jchemhub.ring.RingFinder.findRings(this)
};jchemhub.model.AromaticBond = function(b, c) {
  jchemhub.model.Bond.call(this, b, c)
};
goog.inherits(jchemhub.model.AromaticBond, jchemhub.model.Bond);
jchemhub.model.AromaticBond.ORDER = 1.5;goog.json = {};
goog.json.isValid_ = function(b) {
  if(/^\s*$/.test(b)) {
    return false
  }return/^[\],:{}\s\u2028\u2029]*$/.test(b.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))
};
goog.json.parse = function(b) {
  b = String(b);
  if(goog.json.isValid_(b)) {
    try {
      return eval("(" + b + ")")
    }catch(c) {
    }
  }throw Error("Invalid JSON string: " + b);
};
goog.json.unsafeParse = function(b) {
  return eval("(" + b + ")")
};
goog.json.serialize = function(b) {
  return(new goog.json.Serializer).serialize(b)
};
goog.json.Serializer = function() {
};
goog.json.Serializer.prototype.serialize = function(b) {
  var c = [];
  this.serialize_(b, c);
  return c.join("")
};
goog.json.Serializer.prototype.serialize_ = function(b, c) {
  switch(typeof b) {
    case "string":
      this.serializeString_(b, c);
      break;
    case "number":
      this.serializeNumber_(b, c);
      break;
    case "boolean":
      c.push(b);
      break;
    case "undefined":
      c.push("null");
      break;
    case "object":
      if(b == null) {
        c.push("null");
        break
      }if(goog.isArray(b)) {
        this.serializeArray_(b, c);
        break
      }this.serializeObject_(b, c);
      break;
    case "function":
      break;
    default:
      throw Error("Unknown type: " + typeof b);
  }
};
goog.json.Serializer.charToJsonCharCache_ = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\u000b"};
goog.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
goog.json.Serializer.prototype.serializeString_ = function(b, c) {
  c.push('"', b.replace(goog.json.Serializer.charsToReplace_, function(d) {
    if(d in goog.json.Serializer.charToJsonCharCache_) {
      return goog.json.Serializer.charToJsonCharCache_[d]
    }var e = d.charCodeAt(0), f = "\\u";
    if(e < 16) {
      f += "000"
    }else {
      if(e < 256) {
        f += "00"
      }else {
        if(e < 4096) {
          f += "0"
        }
      }
    }return goog.json.Serializer.charToJsonCharCache_[d] = f + e.toString(16)
  }), '"')
};
goog.json.Serializer.prototype.serializeNumber_ = function(b, c) {
  c.push(isFinite(b) && !isNaN(b) ? b : "null")
};
goog.json.Serializer.prototype.serializeArray_ = function(b, c) {
  var d = b.length;
  c.push("[");
  for(var e = "", f = 0;f < d;f++) {
    c.push(e);
    this.serialize_(b[f], c);
    e = ","
  }c.push("]")
};
goog.json.Serializer.prototype.serializeObject_ = function(b, c) {
  c.push("{");
  var d = "";
  for(var e in b) {
    if(b.hasOwnProperty(e)) {
      var f = b[e];
      if(typeof f != "function") {
        c.push(d);
        this.serializeString_(e, c);
        c.push(":");
        this.serialize_(f, c);
        d = ","
      }
    }
  }c.push("}")
};jchemhub.io = {};
jchemhub.io.json = {};
jchemhub.io.json.BondType = {SINGLE_BOND:"SINGLE_BOND", DOUBLE_BOND:"DOUBLE_BOND", TRIPLE_BOND:"TRIPLE_BOND", QUADRUPLE_BOND:"QUADRUPLE_BOND", AROMATIC:"AROMATIC", SINGLE_OR_DOUBLE:"SINGLE_OR_DOUBLE", SINGLE_OR_AROMATIC:"SINGLE_OR_AROMATIC", DOUBLE_OR_AROMATIC:"DOUBLE_OR_AROMATIC", ANY:"ANY"};
jchemhub.io.json.StereoType = {NOT_STEREO:"NOT_STEREO", SINGLE_BOND_UP:"SINGLE_BOND_UP", SINGLE_BOND_UP_OR_DOWN:"SINGLE_BOND_UP_OR_DOWN", SINGLE_BOND_DOWN:"SINGLE_BOND_DOWN"};
jchemhub.io.json.getTypeCode = function(b) {
  if(b instanceof jchemhub.model.SingleBond) {
    return jchemhub.io.json.BondType.SINGLE_BOND
  }if(b instanceof jchemhub.model.DoubleBond) {
    return jchemhub.io.json.BondType.DOUBLE_BOND
  }if(b instanceof jchemhub.model.TripleBond) {
    return jchemhub.io.json.BondType.TRIPLE_BOND
  }throw new Error("Invalid bond type [" + b + "]");
};
jchemhub.io.json.getStereoCode = function(b) {
  if(b instanceof jchemhub.model.SingleBondUp) {
    return jchemhub.io.json.StereoType.SINGLE_BOND_UP
  }if(b instanceof jchemhub.model.SingleBondDown) {
    return jchemhub.io.json.StereoType.SINGLE_BOND_DOWN
  }if(b instanceof jchemhub.model.SingleBondUpOrDown) {
    return jchemhub.io.json.StereoType.SINGLE_BOND_UP_OR_DOWN
  }return jchemhub.io.json.StereoType.NOT_STEREO
};
jchemhub.io.json.createBond = function(b, c, d, e) {
  switch(b) {
    case jchemhub.io.json.BondType.SINGLE_BOND:
      switch(c) {
        case jchemhub.io.json.StereoType.NOT_STEREO:
          return new jchemhub.model.SingleBond(d, e);
        case jchemhub.io.json.StereoType.SINGLE_BOND_UP:
          return new jchemhub.model.SingleBondUp(d, e);
        case jchemhub.io.json.StereoType.SINGLE_BOND_UP_OR_DOWN:
          return new jchemhub.model.SingleBondUpOrDown(d, e);
        case jchemhub.io.json.StereoType.SINGLE_BOND_DOWN:
          return new jchemhub.model.SingleBondDown(d, e);
        default:
          throw new Error("invalid bond type/stereo [" + b + "]/[" + c + "]");
      }
    ;
    case jchemhub.io.json.BondType.DOUBLE_BOND:
      return new jchemhub.model.DoubleBond(d, e);
    case jchemhub.io.json.BondType.TRIPLE_BOND:
      return new jchemhub.model.TripleBond(d, e);
    case jchemhub.io.json.BondType.AROMATIC:
      return new jchemhub.model.AromaticBond(d, e);
    case jchemhub.io.json.BondType.SINGLE_OR_DOUBLE:
    ;
    case jchemhub.io.json.BondType.SINGLE_OR_AROMATIC:
    ;
    case jchemhub.io.json.BondType.DOUBLE_OR_AROMATIC:
    ;
    case jchemhub.io.json.BondType.ANY:
    ;
    default:
      throw new Error("invalid bond type/stereo [" + b + "]/[" + c + "]");
  }
};
jchemhub.io.json.readMolecule = function(b) {
  b = b.constructor == String ? goog.json.parse(b) : b;
  var c = new jchemhub.model.Molecule;
  c.name = b.name;
  goog.array.forEach(b.atoms, function(d) {
    c.addAtom(new jchemhub.model.Atom(d.symbol, d.coord.x, d.coord.y, d.charge))
  });
  goog.array.forEach(b.bondindex, function(d) {
    c.addBond(jchemhub.io.json.createBond(d.type, d.stereo, c.getAtom(d.source), c.getAtom(d.target)))
  });
  return c
};
jchemhub.io.json.writeMolecule = function(b) {
  return(new goog.json.Serializer).serialize(jchemhub.io.json.moleculeToJson(b))
};
jchemhub.io.json.moleculeToJson = function(b) {
  var c = goog.array.map(b.atoms, function(e) {
    return{symbol:e.symbol, coord:{x:e.coord.x, y:e.coord.y}, charge:e.charge}
  }), d = goog.array.map(b.bonds, function(e) {
    var f = jchemhub.io.json.getTypeCode(e), g = jchemhub.io.json.getStereoCode(e);
    return{source:b.indexOfAtom(e.source), target:b.indexOfAtom(e.target), type:f, stereo:g}
  });
  return{name:b.name, atoms:c, bondindex:d}
};
jchemhub.io.json.readReaction = function(b) {
  b = b.constructor == String ? goog.json.parse(b) : b;
  var c = new jchemhub.model.Reaction;
  c.header = b.header;
  c.reactants = goog.array.map(b.reactants, jchemhub.io.json.readMolecule);
  c.products = goog.array.map(b.products, jchemhub.io.json.readMolecule);
  return c
};
jchemhub.io.json.reactionToJson = function(b) {
  var c = b.header, d = goog.array.map(b.reactants, jchemhub.io.json.moleculeToJson);
  b = goog.array.map(b.products, jchemhub.io.json.moleculeToJson);
  return{header:c, reactants:d, products:b}
};
jchemhub.io.json.writeReaction = function(b) {
  return(new goog.json.Serializer).serialize(jchemhub.io.json.reactionToJson(b))
};goog.debug.Error = function(b) {
  this.stack = (new Error).stack || "";
  if(b) {
    this.message = String(b)
  }
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(b, c) {
  c.unshift(b);
  goog.debug.Error.call(this, goog.string.subs.apply(null, c));
  c.shift();
  this.messagePattern = b
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(b, c, d, e) {
  var f = "Assertion failed";
  if(d) {
    f += ": " + d;
    var g = e
  }else {
    if(b) {
      f += ": " + b;
      g = c
    }
  }throw new goog.asserts.AssertionError("" + f, g || []);
};
goog.asserts.assert = function(b, c) {
  goog.asserts.ENABLE_ASSERTS && !b && goog.asserts.doAssertFailure_("", null, c, Array.prototype.slice.call(arguments, 2))
};
goog.asserts.fail = function(b) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (b ? ": " + b : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(b) && goog.asserts.doAssertFailure_("Expected number but got %s.", [b], c, Array.prototype.slice.call(arguments, 2));
  return b
};
goog.asserts.assertString = function(b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(b) && goog.asserts.doAssertFailure_("Expected string but got %s.", [b], c, Array.prototype.slice.call(arguments, 2));
  return b
};
goog.asserts.assertFunction = function(b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(b) && goog.asserts.doAssertFailure_("Expected function but got %s.", [b], c, Array.prototype.slice.call(arguments, 2));
  return b
};
goog.asserts.assertObject = function(b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(b) && goog.asserts.doAssertFailure_("Expected object but got %s.", [b], c, Array.prototype.slice.call(arguments, 2));
  return b
};
goog.asserts.assertArray = function(b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(b) && goog.asserts.doAssertFailure_("Expected array but got %s.", [b], c, Array.prototype.slice.call(arguments, 2));
  return b
};
goog.asserts.assertInstanceof = function(b, c, d) {
  goog.asserts.ENABLE_ASSERTS && !(b instanceof c) && goog.asserts.doAssertFailure_("instanceof check failed.", null, d, Array.prototype.slice.call(arguments, 3))
};goog.i18n = {};
goog.i18n.DateTimeSymbols_en_ISO = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], STANDALONEMONTHS:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", 
"November", "December"], SHORTMONTHS:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], STANDALONESHORTMONTHS:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], WEEKDAYS:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], STANDALONEWEEKDAYS:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], SHORTWEEKDAYS:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], STANDALONESHORTWEEKDAYS:["Sun", 
"Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], NARROWWEEKDAYS:["S", "M", "T", "W", "T", "F", "S"], STANDALONENARROWWEEKDAYS:["S", "M", "T", "W", "T", "F", "S"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, y MMMM dd", "y MMMM d", "y MMM d", "yyyy-MM-dd"], TIMEFORMATS:["HH:mm:ss v", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"M/d", MMMMd:"MMMM d", MMMd:"MMM d"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 
6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_ar = {ERAS:["\u0642.\u0645", "\u0645"], ERANAMES:["\u0642\u0628\u0644 \u0627\u0644\u0645\u064a\u0644\u0627\u062f", "\u0645\u064a\u0644\u0627\u062f\u064a"], NARROWMONTHS:["\u064a", "\u0641", "\u0645", "\u0623", "\u0648", "\u0646", "\u0644", "\u063a", "\u0633", "\u0643", "\u0628", "\u062f"], STANDALONENARROWMONTHS:["\u064a", "\u0641", "\u0645", "\u0623", "\u0648", "\u0646", "\u0644", "\u063a", "\u0633", "\u0643", "\u0628", "\u062f"], MONTHS:["\u064a\u0646\u0627\u064a\u0631", 
"\u0641\u0628\u0631\u0627\u064a\u0631", "\u0645\u0627\u0631\u0633", "\u0623\u0628\u0631\u064a\u0644", "\u0645\u0627\u064a\u0648", "\u064a\u0648\u0646\u064a\u0648", "\u064a\u0648\u0644\u064a\u0648", "\u0623\u063a\u0633\u0637\u0633", "\u0633\u0628\u062a\u0645\u0628\u0631", "\u0623\u0643\u062a\u0648\u0628\u0631", "\u0646\u0648\u0641\u0645\u0628\u0631", "\u062f\u064a\u0633\u0645\u0628\u0631"], STANDALONEMONTHS:["\u064a\u0646\u0627\u064a\u0631", "\u0641\u0628\u0631\u0627\u064a\u0631", "\u0645\u0627\u0631\u0633", 
"\u0623\u0628\u0631\u064a\u0644", "\u0645\u0627\u064a\u0648", "\u064a\u0648\u0646\u064a\u0648", "\u064a\u0648\u0644\u064a\u0648", "\u0623\u063a\u0633\u0637\u0633", "\u0633\u0628\u062a\u0645\u0628\u0631", "\u0623\u0643\u062a\u0648\u0628\u0631", "\u0646\u0648\u0641\u0645\u0628\u0631", "\u062f\u064a\u0633\u0645\u0628\u0631"], SHORTMONTHS:["\u064a\u0646\u0627\u064a\u0631", "\u0641\u0628\u0631\u0627\u064a\u0631", "\u0645\u0627\u0631\u0633", "\u0623\u0628\u0631\u064a\u0644", "\u0645\u0627\u064a\u0648", 
"\u064a\u0648\u0646\u064a\u0648", "\u064a\u0648\u0644\u064a\u0648", "\u0623\u063a\u0633\u0637\u0633", "\u0633\u0628\u062a\u0645\u0628\u0631", "\u0623\u0643\u062a\u0648\u0628\u0631", "\u0646\u0648\u0641\u0645\u0628\u0631", "\u062f\u064a\u0633\u0645\u0628\u0631"], STANDALONESHORTMONTHS:["\u064a\u0646\u0627\u064a\u0631", "\u0641\u0628\u0631\u0627\u064a\u0631", "\u0645\u0627\u0631\u0633", "\u0623\u0628\u0631\u064a\u0644", "\u0645\u0627\u064a\u0648", "\u064a\u0648\u0646\u064a\u0648", "\u064a\u0648\u0644\u064a\u0648", 
"\u0623\u063a\u0633\u0637\u0633", "\u0633\u0628\u062a\u0645\u0628\u0631", "\u0623\u0643\u062a\u0648\u0628\u0631", "\u0646\u0648\u0641\u0645\u0628\u0631", "\u062f\u064a\u0633\u0645\u0628\u0631"], WEEKDAYS:["\u0627\u0644\u0623\u062d\u062f", "\u0627\u0644\u0625\u062b\u0646\u064a\u0646", "\u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621", "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621", "\u0627\u0644\u062e\u0645\u064a\u0633", "\u0627\u0644\u062c\u0645\u0639\u0629", "\u0627\u0644\u0633\u0628\u062a"], 
STANDALONEWEEKDAYS:["\u0627\u0644\u0623\u062d\u062f", "\u0627\u0644\u0625\u062b\u0646\u064a\u0646", "\u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621", "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621", "\u0627\u0644\u062e\u0645\u064a\u0633", "\u0627\u0644\u062c\u0645\u0639\u0629", "\u0627\u0644\u0633\u0628\u062a"], SHORTWEEKDAYS:["\u0623\u062d\u062f", "\u0625\u062b\u0646\u064a\u0646", "\u062b\u0644\u0627\u062b\u0627\u0621", "\u0623\u0631\u0628\u0639\u0627\u0621", "\u062e\u0645\u064a\u0633", "\u062c\u0645\u0639\u0629", 
"\u0633\u0628\u062a"], STANDALONESHORTWEEKDAYS:["\u0623\u062d\u062f", "\u0625\u062b\u0646\u064a\u0646", "\u062b\u0644\u0627\u062b\u0627\u0621", "\u0623\u0631\u0628\u0639\u0627\u0621", "\u062e\u0645\u064a\u0633", "\u062c\u0645\u0639\u0629", "\u0633\u0628\u062a"], NARROWWEEKDAYS:["\u062d", "\u0646", "\u062b", "\u0631", "\u062e", "\u062c", "\u0633"], STANDALONENARROWWEEKDAYS:["\u062d", "\u0646", "\u062b", "\u0631", "\u062e", "\u062c", "\u0633"], SHORTQUARTERS:["\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u0623\u0648\u0644", 
"\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u062b\u0627\u0646\u064a", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u062b\u0627\u0644\u062b", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u0631\u0627\u0628\u0639"], QUARTERS:["\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u0623\u0648\u0644", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u062b\u0627\u0646\u064a", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u062b\u0627\u0644\u062b", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u0631\u0627\u0628\u0639"], 
AMPMS:["\u0635", "\u0645"], DATEFORMATS:["EEEE\u060c d MMMM\u060c y", "d MMMM\u060c y", "dd/MM/yyyy", "d/M/yyyy"], TIMEFORMATS:["zzzz h:mm:ss a", "z h:mm:ss a", "h:mm:ss a", "h:mm a"], AVAILABLEFORMATS:{Md:"d/M", MMMMd:"d MMMM", MMMd:"d MMM"}, FIRSTDAYOFWEEK:5, WEEKENDRANGE:[4, 5], FIRSTWEEKCUTOFFDAY:1};
goog.i18n.DateTimeSymbols_bg = {ERAS:["\u043f\u0440. \u043d. \u0435.", "\u043e\u0442 \u043d. \u0435."], ERANAMES:["\u043f\u0440.\u0425\u0440.", "\u0441\u043b.\u0425\u0440."], NARROWMONTHS:["\u044f", "\u0444", "\u043c", "\u0430", "\u043c", "\u044e", "\u044e", "\u0430", "\u0441", "\u043e", "\u043d", "\u0434"], STANDALONENARROWMONTHS:["\u044f", "\u0444", "\u043c", "\u0430", "\u043c", "\u044e", "\u044e", "\u0430", "\u0441", "\u043e", "\u043d", "\u0434"], MONTHS:["\u044f\u043d\u0443\u0430\u0440\u0438", 
"\u0444\u0435\u0432\u0440\u0443\u0430\u0440\u0438", "\u043c\u0430\u0440\u0442", "\u0430\u043f\u0440\u0438\u043b", "\u043c\u0430\u0439", "\u044e\u043d\u0438", "\u044e\u043b\u0438", "\u0430\u0432\u0433\u0443\u0441\u0442", "\u0441\u0435\u043f\u0442\u0435\u043c\u0432\u0440\u0438", "\u043e\u043a\u0442\u043e\u043c\u0432\u0440\u0438", "\u043d\u043e\u0435\u043c\u0432\u0440\u0438", "\u0434\u0435\u043a\u0435\u043c\u0432\u0440\u0438"], STANDALONEMONTHS:["\u044f\u043d\u0443\u0430\u0440\u0438", "\u0444\u0435\u0432\u0440\u0443\u0430\u0440\u0438", 
"\u043c\u0430\u0440\u0442", "\u0430\u043f\u0440\u0438\u043b", "\u043c\u0430\u0439", "\u044e\u043d\u0438", "\u044e\u043b\u0438", "\u0430\u0432\u0433\u0443\u0441\u0442", "\u0441\u0435\u043f\u0442\u0435\u043c\u0432\u0440\u0438", "\u043e\u043a\u0442\u043e\u043c\u0432\u0440\u0438", "\u043d\u043e\u0435\u043c\u0432\u0440\u0438", "\u0434\u0435\u043a\u0435\u043c\u0432\u0440\u0438"], SHORTMONTHS:["\u044f\u043d.", "\u0444\u0435\u0432\u0440.", "\u043c\u0430\u0440\u0442", "\u0430\u043f\u0440.", "\u043c\u0430\u0439", 
"\u044e\u043d\u0438", "\u044e\u043b\u0438", "\u0430\u0432\u0433.", "\u0441\u0435\u043f\u0442.", "\u043e\u043a\u0442.", "\u043d\u043e\u0435\u043c.", "\u0434\u0435\u043a."], STANDALONESHORTMONTHS:["\u044f\u043d.", "\u0444\u0435\u0432\u0440.", "\u043c\u0430\u0440\u0442", "\u0430\u043f\u0440.", "\u043c\u0430\u0439", "\u044e\u043d\u0438", "\u044e\u043b\u0438", "\u0430\u0432\u0433.", "\u0441\u0435\u043f\u0442.", "\u043e\u043a\u0442.", "\u043d\u043e\u0435\u043c.", "\u0434\u0435\u043a."], WEEKDAYS:["\u043d\u0435\u0434\u0435\u043b\u044f", 
"\u043f\u043e\u043d\u0435\u0434\u0435\u043b\u043d\u0438\u043a", "\u0432\u0442\u043e\u0440\u043d\u0438\u043a", "\u0441\u0440\u044f\u0434\u0430", "\u0447\u0435\u0442\u0432\u044a\u0440\u0442\u044a\u043a", "\u043f\u0435\u0442\u044a\u043a", "\u0441\u044a\u0431\u043e\u0442\u0430"], STANDALONEWEEKDAYS:["\u043d\u0435\u0434\u0435\u043b\u044f", "\u043f\u043e\u043d\u0435\u0434\u0435\u043b\u043d\u0438\u043a", "\u0432\u0442\u043e\u0440\u043d\u0438\u043a", "\u0441\u0440\u044f\u0434\u0430", "\u0447\u0435\u0442\u0432\u044a\u0440\u0442\u044a\u043a", 
"\u043f\u0435\u0442\u044a\u043a", "\u0441\u044a\u0431\u043e\u0442\u0430"], SHORTWEEKDAYS:["\u043d\u0434", "\u043f\u043d", "\u0432\u0442", "\u0441\u0440", "\u0447\u0442", "\u043f\u0442", "\u0441\u0431"], STANDALONESHORTWEEKDAYS:["\u043d\u0434", "\u043f\u043d", "\u0432\u0442", "\u0441\u0440", "\u0447\u0442", "\u043f\u0442", "\u0441\u0431"], NARROWWEEKDAYS:["\u043d", "\u043f", "\u0432", "\u0441", "\u0447", "\u043f", "\u0441"], STANDALONENARROWWEEKDAYS:["\u043d", "\u043f", "\u0432", "\u0441", "\u0447", 
"\u043f", "\u0441"], SHORTQUARTERS:["I \u0442\u0440\u0438\u043c.", "II \u0442\u0440\u0438\u043c.", "III \u0442\u0440\u0438\u043c.", "IV \u0442\u0440\u0438\u043c."], QUARTERS:["1-\u0432\u043e \u0442\u0440\u0438\u043c\u0435\u0441\u0435\u0447\u0438\u0435", "2-\u0440\u043e \u0442\u0440\u0438\u043c\u0435\u0441\u0435\u0447\u0438\u0435", "3-\u0442\u043e \u0442\u0440\u0438\u043c\u0435\u0441\u0435\u0447\u0438\u0435", "4-\u0442\u043e \u0442\u0440\u0438\u043c\u0435\u0441\u0435\u0447\u0438\u0435"], AMPMS:["\u043f\u0440. \u043e\u0431.", 
"\u0441\u043b. \u043e\u0431."], DATEFORMATS:["dd MMMM y, EEEE", "dd MMMM y", "dd.MM.yyyy", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"d MMMM", MMMd:"MMM d"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_bn = {ERAS:["\u0996\u09c3\u09b7\u09cd\u099f\u09aa\u09c2\u09b0\u09cd\u09ac", "\u0996\u09c3\u09b7\u09cd\u099f\u09be\u09ac\u09cd\u09a6"], ERANAMES:["\u0996\u09c3\u09b7\u09cd\u099f\u09aa\u09c2\u09b0\u09cd\u09ac", "\u0996\u09c3\u09b7\u09cd\u099f\u09be\u09ac\u09cd\u09a6"], NARROWMONTHS:["\u099c\u09be", "\u09ab\u09c7", "\u09ae\u09be", "\u098f", "\u09ae\u09c7", "\u099c\u09c1\u09a8", "\u099c\u09c1", "\u0986", "\u09b8\u09c7", "\u0985", "\u09a8", "\u09a1\u09bf"], STANDALONENARROWMONTHS:["\u099c\u09be", 
"\u09ab\u09c7", "\u09ae\u09be", "\u098f", "\u09ae\u09c7", "\u099c\u09c1\u09a8", "\u099c\u09c1", "\u0986", "\u09b8\u09c7", "\u0985", "\u09a8", "\u09a1\u09bf"], MONTHS:["\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09c0", "\u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09c0", "\u09ae\u09be\u09b0\u09cd\u099a", "\u098f\u09aa\u09cd\u09b0\u09bf\u09b2", "\u09ae\u09c7", "\u099c\u09c1\u09a8", "\u099c\u09c1\u09b2\u09be\u0987", "\u0986\u0997\u09b8\u09cd\u099f", "\u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0", 
"\u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0", "\u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0", "\u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0"], STANDALONEMONTHS:["\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09c0", "\u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09c0", "\u09ae\u09be\u09b0\u09cd\u099a", "\u098f\u09aa\u09cd\u09b0\u09bf\u09b2", "\u09ae\u09c7", "\u099c\u09c1\u09a8", "\u099c\u09c1\u09b2\u09be\u0987", "\u0986\u0997\u09b8\u09cd\u099f", "\u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0", 
"\u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0", "\u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0", "\u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0"], SHORTMONTHS:["\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09c0", "\u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09c0", "\u09ae\u09be\u09b0\u09cd\u099a", "\u098f\u09aa\u09cd\u09b0\u09bf\u09b2", "\u09ae\u09c7", "\u099c\u09c1\u09a8", "\u099c\u09c1\u09b2\u09be\u0987", "\u0986\u0997\u09b8\u09cd\u099f", "\u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0", 
"\u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0", "\u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0", "\u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0"], STANDALONESHORTMONTHS:["\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09c0", "\u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09c0", "\u09ae\u09be\u09b0\u09cd\u099a", "\u098f\u09aa\u09cd\u09b0\u09bf\u09b2", "\u09ae\u09c7", "\u099c\u09c1\u09a8", "\u099c\u09c1\u09b2\u09be\u0987", "\u0986\u0997\u09b8\u09cd\u099f", "\u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0", 
"\u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0", "\u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0", "\u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0"], WEEKDAYS:["\u09b0\u09ac\u09bf\u09ac\u09be\u09b0", "\u09b8\u09cb\u09ae\u09ac\u09be\u09b0", "\u09ae\u0999\u09cd\u0997\u09b2\u09ac\u09be\u09b0", "\u09ac\u09c1\u09a7\u09ac\u09be\u09b0", "\u09ac\u09c3\u09b9\u09b7\u09cd\u09aa\u09a4\u09bf\u09ac\u09be\u09b0", "\u09b6\u09c1\u0995\u09cd\u09b0\u09ac\u09be\u09b0", "\u09b6\u09a8\u09bf\u09ac\u09be\u09b0"], STANDALONEWEEKDAYS:["\u09b0\u09ac\u09bf\u09ac\u09be\u09b0", 
"\u09b8\u09cb\u09ae\u09ac\u09be\u09b0", "\u09ae\u0999\u09cd\u0997\u09b2\u09ac\u09be\u09b0", "\u09ac\u09c1\u09a7\u09ac\u09be\u09b0", "\u09ac\u09c3\u09b9\u09b7\u09cd\u09aa\u09a4\u09bf\u09ac\u09be\u09b0", "\u09b6\u09c1\u0995\u09cd\u09b0\u09ac\u09be\u09b0", "\u09b6\u09a8\u09bf\u09ac\u09be\u09b0"], SHORTWEEKDAYS:["\u09b0\u09ac\u09bf", "\u09b8\u09cb\u09ae", "\u09ae\u0999\u09cd\u0997\u09b2", "\u09ac\u09c1\u09a7", "\u09ac\u09c3\u09b9\u09b8\u09cd\u09aa\u09a4\u09bf", "\u09b6\u09c1\u0995\u09cd\u09b0", "\u09b6\u09a8\u09bf"], 
STANDALONESHORTWEEKDAYS:["\u09b0\u09ac\u09bf", "\u09b8\u09cb\u09ae", "\u09ae\u0999\u09cd\u0997\u09b2", "\u09ac\u09c1\u09a7", "\u09ac\u09c3\u09b9\u09b8\u09cd\u09aa\u09a4\u09bf", "\u09b6\u09c1\u0995\u09cd\u09b0", "\u09b6\u09a8\u09bf"], NARROWWEEKDAYS:["\u09b0", "\u09b8\u09cb", "\u09ae", "\u09ac\u09c1", "\u09ac\u09c3", "\u09b6\u09c1", "\u09b6"], STANDALONENARROWWEEKDAYS:["\u09b0", "\u09b8\u09cb", "\u09ae", "\u09ac\u09c1", "\u09ac\u09c3", "\u09b6\u09c1", "\u09b6"], SHORTQUARTERS:["\u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6 \u09e7", 
"\u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6 \u09e8", "\u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6 \u09e9", "\u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6 \u09ea"], QUARTERS:["\u09aa\u09cd\u09b0\u09a5\u09ae \u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6", "\u09a6\u09cd\u09ac\u09bf\u09a4\u09c0\u09af\u09bc \u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6", "\u09a4\u09c3\u09a4\u09c0\u09af\u09bc \u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6", "\u099a\u09a4\u09c1\u09b0\u09cd\u09a5 \u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6"], 
AMPMS:["am", "pm"], DATEFORMATS:["EEEE, d MMMM, y", "d MMMM, y", "d MMM, y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], AVAILABLEFORMATS:{Md:"d/M", MMMMd:"d MMMM", MMMd:"d MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_ca = {ERAS:["aC", "dC"], ERANAMES:["aC", "dC"], NARROWMONTHS:["g", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"], STANDALONENARROWMONTHS:["g", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"], MONTHS:["de gener", "de febrer", "de mar\u00e7", "d\u2019abril", "de maig", "de juny", "de juliol", "d\u2019agost", "de setembre", "d\u2019octubre", "de novembre", "de desembre"], STANDALONEMONTHS:["gener", "febrer", "mar\u00e7", "abril", "maig", "juny", "juliol", "agost", 
"setembre", "octubre", "novembre", "desembre"], SHORTMONTHS:["gen.", "febr.", "mar\u00e7", "abr.", "maig", "juny", "jul.", "ag.", "set.", "oct.", "nov.", "des."], STANDALONESHORTMONTHS:["gen.", "febr.", "mar\u00e7", "abr.", "maig", "juny", "jul.", "ag.", "set.", "oct.", "nov.", "des."], WEEKDAYS:["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"], STANDALONEWEEKDAYS:["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"], SHORTWEEKDAYS:["dg.", 
"dl.", "dt.", "dc.", "dj.", "dv.", "ds."], STANDALONESHORTWEEKDAYS:["dg", "dl", "dt", "dc", "dj", "dv", "ds"], NARROWWEEKDAYS:["g", "l", "t", "c", "j", "v", "s"], STANDALONENARROWWEEKDAYS:["g", "l", "t", "c", "j", "v", "s"], SHORTQUARTERS:["1T", "2T", "3T", "4T"], QUARTERS:["1r trimestre", "2n trimestre", "3r trimestre", "4t trimestre"], AMPMS:["a.m.", "p.m."], DATEFORMATS:["EEEE d MMMM 'de' y", "d MMMM 'de' y", "dd/MM/yyyy", "dd/MM/yy"], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], 
AVAILABLEFORMATS:{Md:"d/M", MMMMd:"d MMMM", MMMd:"d MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_cs = {ERAS:["p\u0159.Kr.", "po Kr."], ERANAMES:["p\u0159.Kr.", "po Kr."], NARROWMONTHS:["l", "\u00fa", "b", "d", "k", "\u010d", "\u010d", "s", "z", "\u0159", "l", "p"], STANDALONENARROWMONTHS:["l", "\u00fa", "b", "d", "k", "\u010d", "\u010d", "s", "z", "\u0159", "l", "p"], MONTHS:["ledna", "\u00fanora", "b\u0159ezna", "dubna", "kv\u011btna", "\u010dervna", "\u010dervence", "srpna", "z\u00e1\u0159\u00ed", "\u0159\u00edjna", "listopadu", "prosince"], STANDALONEMONTHS:["leden", 
"\u00fanor", "b\u0159ezen", "duben", "kv\u011bten", "\u010derven", "\u010dervenec", "srpen", "z\u00e1\u0159\u00ed", "\u0159\u00edjen", "listopad", "prosinec"], SHORTMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], STANDALONESHORTMONTHS:["1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10.", "11.", "12."], WEEKDAYS:["ned\u011ble", "pond\u011bl\u00ed", "\u00fater\u00fd", "st\u0159eda", "\u010dtvrtek", "p\u00e1tek", "sobota"], STANDALONEWEEKDAYS:["ned\u011ble", "pond\u011bl\u00ed", 
"\u00fater\u00fd", "st\u0159eda", "\u010dtvrtek", "p\u00e1tek", "sobota"], SHORTWEEKDAYS:["ne", "po", "\u00fat", "st", "\u010dt", "p\u00e1", "so"], STANDALONESHORTWEEKDAYS:["ne", "po", "\u00fat", "st", "\u010dt", "p\u00e1", "so"], NARROWWEEKDAYS:["N", "P", "\u00da", "S", "\u010c", "P", "S"], STANDALONENARROWWEEKDAYS:["N", "P", "\u00da", "S", "\u010c", "P", "S"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1. \u010dtvrtlet\u00ed", "2. \u010dtvrtlet\u00ed", "3. \u010dtvrtlet\u00ed", "4. \u010dtvrtlet\u00ed"], 
AMPMS:["dop.", "odp."], DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "d.M.yyyy", "d.M.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "H:mm:ss", "H:mm"], AVAILABLEFORMATS:{Md:"d.M", MMMMd:"d. MMMM", MMMd:"MMM d"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_da = {ERAS:["f.Kr.", "e.Kr."], ERANAMES:["f.Kr.", "e.Kr."], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"], STANDALONEMONTHS:["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", 
"december"], SHORTMONTHS:["jan.", "feb.", "mar.", "apr.", "maj", "jun.", "jul.", "aug.", "sep.", "okt.", "nov.", "dec."], STANDALONESHORTMONTHS:["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"], WEEKDAYS:["s\u00f8ndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "l\u00f8rdag"], STANDALONEWEEKDAYS:["s\u00f8ndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "l\u00f8rdag"], SHORTWEEKDAYS:["s\u00f8n", "man", "tir", "ons", "tor", "fre", "l\u00f8r"], 
STANDALONESHORTWEEKDAYS:["s\u00f8n", "man", "tir", "ons", "tor", "fre", "l\u00f8r"], NARROWWEEKDAYS:["S", "M", "T", "O", "T", "F", "L"], STANDALONENARROWWEEKDAYS:["S", "M", "T", "O", "T", "F", "L"], SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"], AMPMS:["f.m.", "e.m."], DATEFORMATS:["EEEE 'den' d. MMMM y", "d. MMM y", "dd/MM/yyyy", "dd/MM/yy"], TIMEFORMATS:["HH.mm.ss zzzz", "HH:mm:ss z", "HH.mm.ss", "HH.mm"], AVAILABLEFORMATS:{Md:"d/M", MMMMd:"d. MMMM", 
MMMd:"d. MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_de = {ERAS:["v. Chr.", "n. Chr."], ERANAMES:["v. Chr.", "n. Chr."], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["Januar", "Februar", "M\u00e4rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"], STANDALONEMONTHS:["Januar", "Februar", "M\u00e4rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", 
"November", "Dezember"], SHORTMONTHS:["Jan", "Feb", "M\u00e4r", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], STANDALONESHORTMONTHS:["Jan", "Feb", "M\u00e4r", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], WEEKDAYS:["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"], STANDALONEWEEKDAYS:["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"], SHORTWEEKDAYS:["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."], STANDALONESHORTWEEKDAYS:["So.", 
"Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."], NARROWWEEKDAYS:["S", "M", "D", "M", "D", "F", "S"], STANDALONENARROWWEEKDAYS:["S", "M", "D", "M", "D", "F", "S"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1. Quartal", "2. Quartal", "3. Quartal", "4. Quartal"], AMPMS:["vorm.", "nachm."], DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "dd.MM.yyyy", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d.M.", MMMMd:"d. MMMM", MMMd:"d. MMM"}, FIRSTDAYOFWEEK:0, 
WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_de_AT = {ERAS:["v. Chr.", "n. Chr."], ERANAMES:["v. Chr.", "n. Chr."], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["J\u00e4nner", "Februar", "M\u00e4rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"], STANDALONEMONTHS:["J\u00e4nner", "Februar", "M\u00e4rz", "April", "Mai", "Juni", "Juli", "August", "September", 
"Oktober", "November", "Dezember"], SHORTMONTHS:["J\u00e4n", "Feb", "M\u00e4r", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], STANDALONESHORTMONTHS:["J\u00e4n", "Feb", "M\u00e4r", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], WEEKDAYS:["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"], STANDALONEWEEKDAYS:["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"], SHORTWEEKDAYS:["So.", "Mo.", "Di.", "Mi.", "Do.", 
"Fr.", "Sa."], STANDALONESHORTWEEKDAYS:["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."], NARROWWEEKDAYS:["S", "M", "D", "M", "D", "F", "S"], STANDALONENARROWWEEKDAYS:["S", "M", "D", "M", "D", "F", "S"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1. Quartal", "2. Quartal", "3. Quartal", "4. Quartal"], AMPMS:["vorm.", "nachm."], DATEFORMATS:["EEEE, dd. MMMM y", "dd. MMMM y", "dd.MM.yyyy", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d.M.", 
MMMMd:"d. MMMM", MMMd:"d. MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_de_CH = goog.i18n.DateTimeSymbols_de;
goog.i18n.DateTimeSymbols_el = {ERAS:["\u03c0.\u03a7.", "\u03bc.\u03a7."], ERANAMES:["\u03c0.\u03a7.", "\u03bc.\u03a7."], NARROWMONTHS:["\u0399", "\u03a6", "\u039c", "\u0391", "\u039c", "\u0399", "\u0399", "\u0391", "\u03a3", "\u039f", "\u039d", "\u0394"], STANDALONENARROWMONTHS:["\u0399", "\u03a6", "\u039c", "\u0391", "\u039c", "\u0399", "\u0399", "\u0391", "\u03a3", "\u039f", "\u039d", "\u0394"], MONTHS:["\u0399\u03b1\u03bd\u03bf\u03c5\u03b1\u03c1\u03af\u03bf\u03c5", "\u03a6\u03b5\u03b2\u03c1\u03bf\u03c5\u03b1\u03c1\u03af\u03bf\u03c5", 
"\u039c\u03b1\u03c1\u03c4\u03af\u03bf\u03c5", "\u0391\u03c0\u03c1\u03b9\u03bb\u03af\u03bf\u03c5", "\u039c\u03b1\u0390\u03bf\u03c5", "\u0399\u03bf\u03c5\u03bd\u03af\u03bf\u03c5", "\u0399\u03bf\u03c5\u03bb\u03af\u03bf\u03c5", "\u0391\u03c5\u03b3\u03bf\u03cd\u03c3\u03c4\u03bf\u03c5", "\u03a3\u03b5\u03c0\u03c4\u03b5\u03bc\u03b2\u03c1\u03af\u03bf\u03c5", "\u039f\u03ba\u03c4\u03c9\u03b2\u03c1\u03af\u03bf\u03c5", "\u039d\u03bf\u03b5\u03bc\u03b2\u03c1\u03af\u03bf\u03c5", "\u0394\u03b5\u03ba\u03b5\u03bc\u03b2\u03c1\u03af\u03bf\u03c5"], 
STANDALONEMONTHS:["\u0399\u03b1\u03bd\u03bf\u03c5\u03ac\u03c1\u03b9\u03bf\u03c2", "\u03a6\u03b5\u03b2\u03c1\u03bf\u03c5\u03ac\u03c1\u03b9\u03bf\u03c2", "\u039c\u03ac\u03c1\u03c4\u03b9\u03bf\u03c2", "\u0391\u03c0\u03c1\u03af\u03bb\u03b9\u03bf\u03c2", "\u039c\u03ac\u03b9\u03bf\u03c2", "\u0399\u03bf\u03cd\u03bd\u03b9\u03bf\u03c2", "\u0399\u03bf\u03cd\u03bb\u03b9\u03bf\u03c2", "\u0391\u03cd\u03b3\u03bf\u03c5\u03c3\u03c4\u03bf\u03c2", "\u03a3\u03b5\u03c0\u03c4\u03ad\u03bc\u03b2\u03c1\u03b9\u03bf\u03c2", 
"\u039f\u03ba\u03c4\u03ce\u03b2\u03c1\u03b9\u03bf\u03c2", "\u039d\u03bf\u03ad\u03bc\u03b2\u03c1\u03b9\u03bf\u03c2", "\u0394\u03b5\u03ba\u03ad\u03bc\u03b2\u03c1\u03b9\u03bf\u03c2"], SHORTMONTHS:["\u0399\u03b1\u03bd", "\u03a6\u03b5\u03b2", "\u039c\u03b1\u03c1", "\u0391\u03c0\u03c1", "\u039c\u03b1\u03ca", "\u0399\u03bf\u03c5\u03bd", "\u0399\u03bf\u03c5\u03bb", "\u0391\u03c5\u03b3", "\u03a3\u03b5\u03c0", "\u039f\u03ba\u03c4", "\u039d\u03bf\u03b5", "\u0394\u03b5\u03ba"], STANDALONESHORTMONTHS:["\u0399\u03b1\u03bd", 
"\u03a6\u03b5\u03b2", "\u039c\u03b1\u03c1", "\u0391\u03c0\u03c1", "\u039c\u03b1\u03ca", "\u0399\u03bf\u03c5\u03bd", "\u0399\u03bf\u03c5\u03bb", "\u0391\u03c5\u03b3", "\u03a3\u03b5\u03c0", "\u039f\u03ba\u03c4", "\u039d\u03bf\u03b5", "\u0394\u03b5\u03ba"], WEEKDAYS:["\u039a\u03c5\u03c1\u03b9\u03b1\u03ba\u03ae", "\u0394\u03b5\u03c5\u03c4\u03ad\u03c1\u03b1", "\u03a4\u03c1\u03af\u03c4\u03b7", "\u03a4\u03b5\u03c4\u03ac\u03c1\u03c4\u03b7", "\u03a0\u03ad\u03bc\u03c0\u03c4\u03b7", "\u03a0\u03b1\u03c1\u03b1\u03c3\u03ba\u03b5\u03c5\u03ae", 
"\u03a3\u03ac\u03b2\u03b2\u03b1\u03c4\u03bf"], STANDALONEWEEKDAYS:["\u039a\u03c5\u03c1\u03b9\u03b1\u03ba\u03ae", "\u0394\u03b5\u03c5\u03c4\u03ad\u03c1\u03b1", "\u03a4\u03c1\u03af\u03c4\u03b7", "\u03a4\u03b5\u03c4\u03ac\u03c1\u03c4\u03b7", "\u03a0\u03ad\u03bc\u03c0\u03c4\u03b7", "\u03a0\u03b1\u03c1\u03b1\u03c3\u03ba\u03b5\u03c5\u03ae", "\u03a3\u03ac\u03b2\u03b2\u03b1\u03c4\u03bf"], SHORTWEEKDAYS:["\u039a\u03c5\u03c1", "\u0394\u03b5\u03c5", "\u03a4\u03c1\u03b9", "\u03a4\u03b5\u03c4", "\u03a0\u03b5\u03bc", 
"\u03a0\u03b1\u03c1", "\u03a3\u03b1\u03b2"], STANDALONESHORTWEEKDAYS:["\u039a\u03c5\u03c1", "\u0394\u03b5\u03c5", "\u03a4\u03c1\u03b9", "\u03a4\u03b5\u03c4", "\u03a0\u03b5\u03bc", "\u03a0\u03b1\u03c1", "\u03a3\u03b1\u03b2"], NARROWWEEKDAYS:["\u039a", "\u0394", "\u03a4", "\u03a4", "\u03a0", "\u03a0", "\u03a3"], STANDALONENARROWWEEKDAYS:["\u039a", "\u0394", "\u03a4", "\u03a4", "\u03a0", "\u03a0", "\u03a3"], SHORTQUARTERS:["\u03a41", "\u03a42", "\u03a43", "\u03a44"], QUARTERS:["1\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf", 
"2\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf", "3\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf", "4\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf"], AMPMS:["\u03c0.\u03bc.", "\u03bc.\u03bc."], DATEFORMATS:["EEEE, dd MMMM y", "dd MMMM y", "dd MMM y", "dd/MM/yyyy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], AVAILABLEFORMATS:{Md:"d/M", MMMMd:"d MMMM", MMMd:"d MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_en = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], STANDALONEMONTHS:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", 
"November", "December"], SHORTMONTHS:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], STANDALONESHORTMONTHS:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], WEEKDAYS:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], STANDALONEWEEKDAYS:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], SHORTWEEKDAYS:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], STANDALONESHORTWEEKDAYS:["Sun", 
"Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], NARROWWEEKDAYS:["S", "M", "T", "W", "T", "F", "S"], STANDALONENARROWWEEKDAYS:["S", "M", "T", "W", "T", "F", "S"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, MMMM d, y", "MMMM d, y", "MMM d, y", "M/d/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], AVAILABLEFORMATS:{Md:"M/d", MMMMd:"MMMM d", MMMd:"MMM d"}, FIRSTDAYOFWEEK:6, 
WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_en_AU = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], STANDALONEMONTHS:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", 
"November", "December"], SHORTMONTHS:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], STANDALONESHORTMONTHS:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], WEEKDAYS:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], STANDALONEWEEKDAYS:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], SHORTWEEKDAYS:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], STANDALONESHORTWEEKDAYS:["Sun", 
"Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], NARROWWEEKDAYS:["S", "M", "T", "W", "T", "F", "S"], STANDALONENARROWWEEKDAYS:["S", "M", "T", "W", "T", "F", "S"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "dd/MM/yyyy", "d/MM/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], AVAILABLEFORMATS:{Md:"M/d", MMMMd:"d MMMM", MMMd:"MMM d"}, FIRSTDAYOFWEEK:0, 
WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_en_GB = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], STANDALONEMONTHS:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", 
"November", "December"], SHORTMONTHS:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], STANDALONESHORTMONTHS:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], WEEKDAYS:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], STANDALONEWEEKDAYS:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], SHORTWEEKDAYS:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], STANDALONESHORTWEEKDAYS:["Sun", 
"Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], NARROWWEEKDAYS:["S", "M", "T", "W", "T", "F", "S"], STANDALONENARROWWEEKDAYS:["S", "M", "T", "W", "T", "F", "S"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "dd/MM/yyyy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d/M", MMMMd:"d MMMM", MMMd:"MMM d"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 
6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_en_IE = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], STANDALONEMONTHS:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", 
"November", "December"], SHORTMONTHS:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], STANDALONESHORTMONTHS:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], WEEKDAYS:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], STANDALONEWEEKDAYS:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], SHORTWEEKDAYS:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], STANDALONESHORTWEEKDAYS:["Sun", 
"Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], NARROWWEEKDAYS:["S", "M", "T", "W", "T", "F", "S"], STANDALONENARROWWEEKDAYS:["S", "M", "T", "W", "T", "F", "S"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["a.m.", "p.m."], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "dd/MM/yyyy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d/M", MMMMd:"d MMMM", MMMd:"MMM d"}, FIRSTDAYOFWEEK:6, 
WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_en_IN = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], STANDALONEMONTHS:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", 
"November", "December"], SHORTMONTHS:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], STANDALONESHORTMONTHS:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], WEEKDAYS:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], STANDALONEWEEKDAYS:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], SHORTWEEKDAYS:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], STANDALONESHORTWEEKDAYS:["Sun", 
"Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], NARROWWEEKDAYS:["S", "M", "T", "W", "T", "F", "S"], STANDALONENARROWWEEKDAYS:["S", "M", "T", "W", "T", "F", "S"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "dd-MMM-y", "dd/MM/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], AVAILABLEFORMATS:{Md:"M/d", MMMMd:"d MMMM", MMMd:"MMM d"}, FIRSTDAYOFWEEK:6, 
WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_en_SG = goog.i18n.DateTimeSymbols_en;
goog.i18n.DateTimeSymbols_en_US = goog.i18n.DateTimeSymbols_en;
goog.i18n.DateTimeSymbols_en_ZA = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], STANDALONEMONTHS:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", 
"November", "December"], SHORTMONTHS:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], STANDALONESHORTMONTHS:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], WEEKDAYS:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], STANDALONEWEEKDAYS:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], SHORTWEEKDAYS:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], STANDALONESHORTWEEKDAYS:["Sun", 
"Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], NARROWWEEKDAYS:["S", "M", "T", "W", "T", "F", "S"], STANDALONENARROWWEEKDAYS:["S", "M", "T", "W", "T", "F", "S"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE dd MMMM y", "dd MMMM y", "dd MMM y", "yyyy/MM/dd"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], AVAILABLEFORMATS:{Md:"M/d", MMMMd:"MMMM d", MMMd:"MMM d"}, FIRSTDAYOFWEEK:0, 
WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_es = {ERAS:["a.C.", "d.C."], ERANAMES:["antes de Cristo", "anno D\u00f3mini"], NARROWMONTHS:["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"], STANDALONEMONTHS:["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", 
"octubre", "noviembre", "diciembre"], SHORTMONTHS:["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], STANDALONESHORTMONTHS:["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], WEEKDAYS:["domingo", "lunes", "martes", "mi\u00e9rcoles", "jueves", "viernes", "s\u00e1bado"], STANDALONEWEEKDAYS:["domingo", "lunes", "martes", "mi\u00e9rcoles", "jueves", "viernes", "s\u00e1bado"], SHORTWEEKDAYS:["dom", "lun", "mar", "mi\u00e9", "jue", "vie", 
"s\u00e1b"], STANDALONESHORTWEEKDAYS:["dom", "lun", "mar", "mi\u00e9", "jue", "vie", "s\u00e1b"], NARROWWEEKDAYS:["D", "L", "M", "M", "J", "V", "S"], STANDALONENARROWWEEKDAYS:["D", "L", "M", "M", "J", "V", "S"], SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1er trimestre", "2\u00ba trimestre", "3er trimestre", "4\u00ba trimestre"], AMPMS:["a.m.", "p.m."], DATEFORMATS:["EEEE d 'de' MMMM 'de' y", "d 'de' MMMM 'de' y", "dd/MM/yyyy", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", 
"HH:mm"], AVAILABLEFORMATS:{Md:"d/M", MMMMd:"d 'de' MMMM", MMMd:"d MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_et = {ERAS:["e.m.a.", "m.a.j."], ERANAMES:["enne meie aega", "meie aja j\u00e4rgi"], NARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], STANDALONENARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], MONTHS:["jaanuar", "veebruar", "m\u00e4rts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"], STANDALONEMONTHS:["jaanuar", "veebruar", "m\u00e4rts", "aprill", "mai", "juuni", "juuli", 
"august", "september", "oktoober", "november", "detsember"], SHORTMONTHS:["jaan", "veebr", "m\u00e4rts", "apr", "mai", "juuni", "juuli", "aug", "sept", "okt", "nov", "dets"], STANDALONESHORTMONTHS:["jaan", "veebr", "m\u00e4rts", "apr", "mai", "juuni", "juuli", "aug", "sept", "okt", "nov", "dets"], WEEKDAYS:["p\u00fchap\u00e4ev", "esmasp\u00e4ev", "teisip\u00e4ev", "kolmap\u00e4ev", "neljap\u00e4ev", "reede", "laup\u00e4ev"], STANDALONEWEEKDAYS:["p\u00fchap\u00e4ev", "esmasp\u00e4ev", "teisip\u00e4ev", 
"kolmap\u00e4ev", "neljap\u00e4ev", "reede", "laup\u00e4ev"], SHORTWEEKDAYS:["P", "E", "T", "K", "N", "R", "L"], STANDALONESHORTWEEKDAYS:["P", "E", "T", "K", "N", "R", "L"], NARROWWEEKDAYS:["1", "2", "3", "4", "5", "6", "7"], STANDALONENARROWWEEKDAYS:["1", "2", "3", "4", "5", "6", "7"], SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d, MMMM y", "d MMMM y", "dd.MM.yyyy", "dd.MM.yy"], TIMEFORMATS:["H:mm:ss zzzz", 
"H:mm:ss z", "H:mm:ss", "H:mm"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"d MMMM", MMMd:"MMM d"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_eu = {ERAS:["BCE", "CE"], ERANAMES:["BCE", "CE"], NARROWMONTHS:["U", "O", "M", "A", "M", "E", "U", "A", "I", "U", "A", "A"], STANDALONENARROWMONTHS:["U", "O", "M", "A", "M", "E", "U", "A", "I", "U", "A", "A"], MONTHS:["urtarrila", "otsaila", "martxoa", "apirila", "maiatza", "ekaina", "uztaila", "abuztua", "iraila", "urria", "azaroa", "abendua"], STANDALONEMONTHS:["urtarrila", "otsaila", "martxoa", "apirila", "maiatza", "ekaina", "uztaila", "abuztua", "iraila", "urria", "azaroa", 
"abendua"], SHORTMONTHS:["urt", "ots", "mar", "api", "mai", "eka", "uzt", "abu", "ira", "urr", "aza", "abe"], STANDALONESHORTMONTHS:["urt", "ots", "mar", "api", "mai", "eka", "uzt", "abu", "ira", "urr", "aza", "abe"], WEEKDAYS:["igandea", "astelehena", "asteartea", "asteazkena", "osteguna", "ostirala", "larunbata"], STANDALONEWEEKDAYS:["igandea", "astelehena", "asteartea", "asteazkena", "osteguna", "ostirala", "larunbata"], SHORTWEEKDAYS:["ig", "al", "as", "az", "og", "or", "lr"], STANDALONESHORTWEEKDAYS:["ig", 
"al", "as", "az", "og", "or", "lr"], NARROWWEEKDAYS:["1", "2", "3", "4", "5", "6", "7"], STANDALONENARROWWEEKDAYS:["1", "2", "3", "4", "5", "6", "7"], SHORTQUARTERS:["1Hh", "2Hh", "3Hh", "4Hh"], QUARTERS:["1. hiruhilekoa", "2. hiruhilekoa", "3. hiruhilekoa", "4. hiruhilekoa"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, y'eko' MMMM'ren' dd'a'", "y'eko' MMM'ren' dd'a'", "y MMM d", "yyyy-MM-dd"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"MMMM d", 
MMMd:"MMM d"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_fa = {ERAS:["\u0642.\u0645.", "\u0645."], ERANAMES:["\u0642\u0628\u0644 \u0627\u0632 \u0645\u06cc\u0644\u0627\u062f", "\u0645\u06cc\u0644\u0627\u062f\u06cc"], NARROWMONTHS:["\u0698", "\u0641", "\u0645", "\u0622", "\u0645", "\u0698", "\u0698", "\u0627", "\u0633", "\u0627", "\u0646", "\u062f"], STANDALONENARROWMONTHS:["\u0698", "\u0641", "\u0645", "\u0622", "\u0645", "\u0698", "\u0698", "\u0627", "\u0633", "\u0627", "\u0646", "\u062f"], MONTHS:["\u0698\u0627\u0646\u0648\u06cc\u0647\u0654", 
"\u0641\u0648\u0631\u06cc\u0647\u0654", "\u0645\u0627\u0631\u0633", "\u0622\u0648\u0631\u06cc\u0644", "\u0645\u0647\u0654", "\u0698\u0648\u0626\u0646", "\u0698\u0648\u0626\u06cc\u0647\u0654", "\u0627\u0648\u062a", "\u0633\u067e\u062a\u0627\u0645\u0628\u0631", "\u0627\u06a9\u062a\u0628\u0631", "\u0646\u0648\u0627\u0645\u0628\u0631", "\u062f\u0633\u0627\u0645\u0628\u0631"], STANDALONEMONTHS:["\u0698\u0627\u0646\u0648\u06cc\u0647", "\u0641\u0648\u0631\u06cc\u0647", "\u0645\u0627\u0631\u0633", "\u0622\u0648\u0631\u06cc\u0644", 
"\u0645\u0647", "\u0698\u0648\u0626\u0646", "\u0698\u0648\u0626\u06cc\u0647", "\u0627\u0648\u062a", "\u0633\u067e\u062a\u0627\u0645\u0628\u0631", "\u0627\u06a9\u062a\u0628\u0631", "\u0646\u0648\u0627\u0645\u0628\u0631", "\u062f\u0633\u0627\u0645\u0628\u0631"], SHORTMONTHS:["\u0698\u0627\u0646\u0648\u06cc\u0647\u0654", "\u0641\u0648\u0631\u06cc\u0647\u0654", "\u0645\u0627\u0631\u0633", "\u0622\u0648\u0631\u06cc\u0644", "\u0645\u0647\u0654", "\u0698\u0648\u0626\u0646", "\u0698\u0648\u0626\u06cc\u0647\u0654", 
"\u0627\u0648\u062a", "\u0633\u067e\u062a\u0627\u0645\u0628\u0631", "\u0627\u06a9\u062a\u0628\u0631", "\u0646\u0648\u0627\u0645\u0628\u0631", "\u062f\u0633\u0627\u0645\u0628\u0631"], STANDALONESHORTMONTHS:["\u0698\u0627\u0646\u0648\u06cc\u0647", "\u0641\u0648\u0631\u06cc\u0647", "\u0645\u0627\u0631\u0633", "\u0622\u0648\u0631\u06cc\u0644", "\u0645\u0647", "\u0698\u0648\u0626\u0646", "\u0698\u0648\u0626\u06cc\u0647", "\u0627\u0648\u062a", "\u0633\u067e\u062a\u0627\u0645\u0628\u0631", "\u0627\u06a9\u062a\u0628\u0631", 
"\u0646\u0648\u0627\u0645\u0628\u0631", "\u062f\u0633\u0627\u0645\u0628\u0631"], WEEKDAYS:["\u06cc\u06a9\u0634\u0646\u0628\u0647", "\u062f\u0648\u0634\u0646\u0628\u0647", "\u0633\u0647\u0634\u0646\u0628\u0647", "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647", "\u067e\u0646\u062c\u0634\u0646\u0628\u0647", "\u062c\u0645\u0639\u0647", "\u0634\u0646\u0628\u0647"], STANDALONEWEEKDAYS:["\u06cc\u06a9\u0634\u0646\u0628\u0647", "\u062f\u0648\u0634\u0646\u0628\u0647", "\u0633\u0647\u0634\u0646\u0628\u0647", 
"\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647", "\u067e\u0646\u062c\u0634\u0646\u0628\u0647", "\u062c\u0645\u0639\u0647", "\u0634\u0646\u0628\u0647"], SHORTWEEKDAYS:["\u06cc\u06a9\u0634\u0646\u0628\u0647", "\u062f\u0648\u0634\u0646\u0628\u0647", "\u0633\u0647\u0634\u0646\u0628\u0647", "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647", "\u067e\u0646\u062c\u0634\u0646\u0628\u0647", "\u062c\u0645\u0639\u0647", "\u0634\u0646\u0628\u0647"], STANDALONESHORTWEEKDAYS:["\u06cc\u06a9\u0634\u0646\u0628\u0647", 
"\u062f\u0648\u0634\u0646\u0628\u0647", "\u0633\u0647\u0634\u0646\u0628\u0647", "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647", "\u067e\u0646\u062c\u0634\u0646\u0628\u0647", "\u062c\u0645\u0639\u0647", "\u0634\u0646\u0628\u0647"], NARROWWEEKDAYS:["\u06cc", "\u062f", "\u0633", "\u0686", "\u067e", "\u062c", "\u0634"], STANDALONENARROWWEEKDAYS:["\u06cc", "\u062f", "\u0633", "\u0686", "\u067e", "\u062c", "\u0634"], SHORTQUARTERS:["\u0633\u0645\u06f1", "\u0633\u0645\u06f2", "\u0633\u0645\u06f3", "\u0633\u0645\u06f4"], 
QUARTERS:["\u0633\u0647\u0645\u0627\u0647\u0647\u0654 \u0627\u0648\u0644", "\u0633\u0647\u0645\u0627\u0647\u0647\u0654 \u062f\u0648\u0645", "\u0633\u0647\u0645\u0627\u0647\u0647\u0654 \u0633\u0648\u0645", "\u0633\u0647\u0645\u0627\u0647\u0647\u0654 \u0686\u0647\u0627\u0631\u0645"], AMPMS:["\u0642\u0628\u0644 \u0627\u0632 \u0638\u0647\u0631", "\u0628\u0639\u062f \u0627\u0632 \u0638\u0647\u0631"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "yyyy/M/d", "yy/M/d"], TIMEFORMATS:["H:mm:ss (zzzz)", "H:mm:ss (z)", 
"H:mm:ss", "H:mm"], AVAILABLEFORMATS:{Md:"M/d", MMMMd:"d LLLL", MMMd:"d LLL"}, FIRSTDAYOFWEEK:5, WEEKENDRANGE:[3, 4], FIRSTWEEKCUTOFFDAY:1};
goog.i18n.DateTimeSymbols_fi = {ERAS:["eKr.", "jKr."], ERANAMES:["ennen Kristuksen syntym\u00e4\u00e4", "j\u00e4lkeen Kristuksen syntym\u00e4n"], NARROWMONTHS:["T", "H", "M", "H", "T", "K", "H", "E", "S", "L", "M", "J"], STANDALONENARROWMONTHS:["T", "H", "M", "H", "T", "K", "H", "E", "S", "L", "M", "J"], MONTHS:["tammikuuta", "helmikuuta", "maaliskuuta", "huhtikuuta", "toukokuuta", "kes\u00e4kuuta", "hein\u00e4kuuta", "elokuuta", "syyskuuta", "lokakuuta", "marraskuuta", "joulukuuta"], STANDALONEMONTHS:["tammikuu", 
"helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kes\u00e4kuu", "hein\u00e4kuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"], SHORTMONTHS:["tammikuuta", "helmikuuta", "maaliskuuta", "huhtikuuta", "toukokuuta", "kes\u00e4kuuta", "hein\u00e4kuuta", "elokuuta", "syyskuuta", "lokakuuta", "marraskuuta", "joulukuuta"], STANDALONESHORTMONTHS:["tammi", "helmi", "maalis", "huhti", "touko", "kes\u00e4", "hein\u00e4", "elo", "syys", "loka", "marras", "joulu"], WEEKDAYS:["sunnuntaina", "maanantaina", 
"tiistaina", "keskiviikkona", "torstaina", "perjantaina", "lauantaina"], STANDALONEWEEKDAYS:["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai"], SHORTWEEKDAYS:["su", "ma", "ti", "ke", "to", "pe", "la"], STANDALONESHORTWEEKDAYS:["su", "ma", "ti", "ke", "to", "pe", "la"], NARROWWEEKDAYS:["S", "M", "T", "K", "T", "P", "L"], STANDALONENARROWWEEKDAYS:["S", "M", "T", "K", "T", "P", "L"], SHORTQUARTERS:["1. nelj.", "2. nelj.", "3. nelj.", "4. nelj."], QUARTERS:["1. nelj\u00e4nnes", 
"2. nelj\u00e4nnes", "3. nelj\u00e4nnes", "4. nelj\u00e4nnes"], AMPMS:["ap.", "ip."], DATEFORMATS:["EEEE d. MMMM y", "d. MMMM y", "d.M.yyyy", "d.M.yyyy"], TIMEFORMATS:["H.mm.ss zzzz", "H.mm.ss z", "H.mm.ss", "H.mm"], AVAILABLEFORMATS:{Md:"d.M.", MMMMd:"d. MMMM", MMMd:"d. MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_fil = {ERAS:["BCE", "CE"], ERANAMES:["BCE", "CE"], NARROWMONTHS:["E", "P", "M", "A", "M", "H", "H", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["E", "P", "M", "A", "M", "H", "H", "A", "S", "O", "N", "D"], MONTHS:["Enero", "Pebrero", "Marso", "Abril", "Mayo", "Hunyo", "Hulyo", "Agosto", "Setyembre", "Oktubre", "Nobyembre", "Disyembre"], STANDALONEMONTHS:["Enero", "Pebrero", "Marso", "Abril", "Mayo", "Hunyo", "Hulyo", "Agosto", "Setyembre", "Oktubre", "Nobyembre", "Disyembre"], 
SHORTMONTHS:["Ene", "Peb", "Mar", "Abr", "May", "Hun", "Hul", "Ago", "Set", "Okt", "Nob", "Dis"], STANDALONESHORTMONTHS:["Ene", "Peb", "Mar", "Abr", "May", "Hun", "Hul", "Ago", "Set", "Okt", "Nob", "Dis"], WEEKDAYS:["Linggo", "Lunes", "Martes", "Miyerkules", "Huwebes", "Biyernes", "Sabado"], STANDALONEWEEKDAYS:["Linggo", "Lunes", "Martes", "Miyerkules", "Huwebes", "Biyernes", "Sabado"], SHORTWEEKDAYS:["Lin", "Lun", "Mar", "Mye", "Huw", "Bye", "Sab"], STANDALONESHORTWEEKDAYS:["Lin", "Lun", "Mar", 
"Miy", "Huw", "Biy", "Sab"], NARROWWEEKDAYS:["L", "L", "M", "M", "H", "B", "S"], STANDALONENARROWWEEKDAYS:["L", "L", "M", "M", "H", "B", "S"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Q1", "Q2", "Q3", "Q4"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, MMMM dd y", "MMMM d, y", "MMM d, y", "M/d/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"MMMM d", MMMd:"MMM d"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_fr = {ERAS:["av. J.-C.", "ap. J.-C."], ERANAMES:["avant J\u00e9sus-Christ", "apr\u00e8s J\u00e9sus-Christ"], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["janvier", "f\u00e9vrier", "mars", "avril", "mai", "juin", "juillet", "ao\u00fbt", "septembre", "octobre", "novembre", "d\u00e9cembre"], STANDALONEMONTHS:["janvier", "f\u00e9vrier", "mars", "avril", 
"mai", "juin", "juillet", "ao\u00fbt", "septembre", "octobre", "novembre", "d\u00e9cembre"], SHORTMONTHS:["janv.", "f\u00e9vr.", "mars", "avr.", "mai", "juin", "juil.", "ao\u00fbt", "sept.", "oct.", "nov.", "d\u00e9c."], STANDALONESHORTMONTHS:["janv.", "f\u00e9vr.", "mars", "avr.", "mai", "juin", "juil.", "ao\u00fbt", "sept.", "oct.", "nov.", "d\u00e9c."], WEEKDAYS:["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], STANDALONEWEEKDAYS:["dimanche", "lundi", "mardi", "mercredi", 
"jeudi", "vendredi", "samedi"], SHORTWEEKDAYS:["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], STANDALONESHORTWEEKDAYS:["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], NARROWWEEKDAYS:["D", "L", "M", "M", "J", "V", "S"], STANDALONENARROWWEEKDAYS:["D", "L", "M", "M", "J", "V", "S"], SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1er trimestre", "2e trimestre", "3e trimestre", "4e trimestre"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "dd/MM/yy"], 
TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d/M", MMMMd:"d MMMM", MMMd:"d MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_fr_CA = {ERAS:["av. J.-C.", "ap. J.-C."], ERANAMES:["avant J\u00e9sus-Christ", "apr\u00e8s J\u00e9sus-Christ"], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["janvier", "f\u00e9vrier", "mars", "avril", "mai", "juin", "juillet", "ao\u00fbt", "septembre", "octobre", "novembre", "d\u00e9cembre"], STANDALONEMONTHS:["janvier", "f\u00e9vrier", "mars", "avril", 
"mai", "juin", "juillet", "ao\u00fbt", "septembre", "octobre", "novembre", "d\u00e9cembre"], SHORTMONTHS:["janv.", "f\u00e9vr.", "mars", "avr.", "mai", "juin", "juil.", "ao\u00fbt", "sept.", "oct.", "nov.", "d\u00e9c."], STANDALONESHORTMONTHS:["janv.", "f\u00e9vr.", "mars", "avr.", "mai", "juin", "juil.", "ao\u00fbt", "sept.", "oct.", "nov.", "d\u00e9c."], WEEKDAYS:["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], STANDALONEWEEKDAYS:["dimanche", "lundi", "mardi", "mercredi", 
"jeudi", "vendredi", "samedi"], SHORTWEEKDAYS:["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], STANDALONESHORTWEEKDAYS:["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], NARROWWEEKDAYS:["D", "L", "M", "M", "J", "V", "S"], STANDALONENARROWWEEKDAYS:["D", "L", "M", "M", "J", "V", "S"], SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1er trimestre", "2e trimestre", "3e trimestre", "4e trimestre"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "yyyy-MM-dd", "yy-MM-dd"], 
TIMEFORMATS:["HH 'h' mm 'min' ss 's' zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"d MMMM", MMMd:"d MMM"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_gl = {ERAS:["a.C.", "d.C."], ERANAMES:["antes de Cristo", "despois de Cristo"], NARROWMONTHS:["X", "F", "M", "A", "M", "X", "X", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["X", "F", "M", "A", "M", "X", "X", "A", "S", "O", "N", "D"], MONTHS:["Xaneiro", "Febreiro", "Marzo", "Abril", "Maio", "Xu\u00f1o", "Xullo", "Agosto", "Setembro", "Outubro", "Novembro", "Decembro"], STANDALONEMONTHS:["Xaneiro", "Febreiro", "Marzo", "Abril", "Maio", "Xu\u00f1o", "Xullo", "Agosto", 
"Setembro", "Outubro", "Novembro", "Decembro"], SHORTMONTHS:["Xan", "Feb", "Mar", "Abr", "Mai", "Xu\u00f1", "Xul", "Ago", "Set", "Out", "Nov", "Dec"], STANDALONESHORTMONTHS:["Xan", "Feb", "Mar", "Abr", "Mai", "Xu\u00f1", "Xul", "Ago", "Set", "Out", "Nov", "Dec"], WEEKDAYS:["Domingo", "Luns", "Martes", "M\u00e9rcores", "Xoves", "Venres", "S\u00e1bado"], STANDALONEWEEKDAYS:["Domingo", "Luns", "Martes", "M\u00e9rcores", "Xoves", "Venres", "S\u00e1bado"], SHORTWEEKDAYS:["Dom", "Lun", "Mar", "M\u00e9r", 
"Xov", "Ven", "S\u00e1b"], STANDALONESHORTWEEKDAYS:["Dom", "Lun", "Mar", "M\u00e9r", "Xov", "Ven", "S\u00e1b"], NARROWWEEKDAYS:["D", "L", "M", "M", "X", "V", "S"], STANDALONENARROWWEEKDAYS:["D", "L", "M", "M", "X", "V", "S"], SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1o trimestre", "2o trimestre", "3o trimestre", "4o trimestre"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE dd MMMM y", "dd MMMM y", "d MMM, y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d-M", 
MMMMd:"d MMMM", MMMd:"d MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_gsw = {ERAS:["v. Chr.", "n. Chr."], ERANAMES:["v. Chr.", "n. Chr."], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["Januar", "Februar", "M\u00e4rz", "April", "Mai", "Juni", "Juli", "Auguscht", "Sept\u00e4mber", "Oktoober", "Nov\u00e4mber", "Dez\u00e4mber"], STANDALONEMONTHS:["Januar", "Februar", "M\u00e4rz", "April", "Mai", "Juni", "Juli", "Auguscht", 
"Sept\u00e4mber", "Oktoober", "Nov\u00e4mber", "Dez\u00e4mber"], SHORTMONTHS:["Jan", "Feb", "M\u00e4r", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], STANDALONESHORTMONTHS:["Jan", "Feb", "M\u00e4r", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], WEEKDAYS:["Sunntig", "M\u00e4\u00e4ntig", "Ziischtig", "Mittwuch", "Dunschtig", "Friitig", "Samschtig"], STANDALONEWEEKDAYS:["Sunntig", "M\u00e4\u00e4ntig", "Ziischtig", "Mittwuch", "Dunschtig", "Friitig", "Samschtig"], 
SHORTWEEKDAYS:["Su.", "M\u00e4.", "Zi.", "Mi.", "Du.", "Fr.", "Sa."], STANDALONESHORTWEEKDAYS:["Su.", "M\u00e4.", "Zi.", "Mi.", "Du.", "Fr.", "Sa."], NARROWWEEKDAYS:["S", "M", "D", "M", "D", "F", "S"], STANDALONENARROWWEEKDAYS:["S", "M", "D", "M", "D", "F", "S"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1. Quartal", "2. Quartal", "3. Quartal", "4. Quartal"], AMPMS:["vorm.", "nam."], DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "dd.MM.yyyy", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", 
"HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d.M.", MMMMd:"d. MMMM", MMMd:"d. MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_gu = {ERAS:["BCE", "CE"], ERANAMES:["\u0a88\u0ab8\u0ab5\u0ac0\u0ab8\u0aa8 \u0aaa\u0ac2\u0ab0\u0acd\u0ab5\u0ac7", "\u0a87\u0ab8\u0ab5\u0ac0\u0ab8\u0aa8"], NARROWMONTHS:["\u0a9c\u0abe", "\u0aab\u0ac7", "\u0aae\u0abe", "\u0a8f", "\u0aae\u0ac7", "\u0a9c\u0ac2", "\u0a9c\u0ac1", "\u0a91", "\u0ab8", "\u0a91", "\u0aa8", "\u0aa1\u0abf"], STANDALONENARROWMONTHS:["\u0a9c\u0abe", "\u0aab\u0ac7", "\u0aae\u0abe", "\u0a8f", "\u0aae\u0ac7", "\u0a9c\u0ac2", "\u0a9c\u0ac1", "\u0a91", "\u0ab8", 
"\u0a91", "\u0aa8", "\u0aa1\u0abf"], MONTHS:["\u0a9c\u0abe\u0aa8\u0acd\u0aaf\u0ac1\u0a86\u0ab0\u0ac0", "\u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1\u0a86\u0ab0\u0ac0", "\u0aae\u0abe\u0ab0\u0acd\u0a9a", "\u0a8f\u0aaa\u0acd\u0ab0\u0abf\u0ab2", "\u0aae\u0ac7", "\u0a9c\u0ac2\u0aa8", "\u0a9c\u0ac1\u0ab2\u0abe\u0a88", "\u0a91\u0a97\u0ab8\u0acd\u0a9f", "\u0ab8\u0aaa\u0acd\u0a9f\u0ac7\u0aae\u0acd\u0aac\u0ab0", "\u0a91\u0a95\u0acd\u0a9f\u0acd\u0aac\u0ab0", "\u0aa8\u0ab5\u0ac7\u0aae\u0acd\u0aac\u0ab0", "\u0aa1\u0abf\u0ab8\u0ac7\u0aae\u0acd\u0aac\u0ab0"], 
STANDALONEMONTHS:["\u0a9c\u0abe\u0aa8\u0acd\u0aaf\u0ac1\u0a86\u0ab0\u0ac0", "\u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1\u0a86\u0ab0\u0ac0", "\u0aae\u0abe\u0ab0\u0acd\u0a9a", "\u0a8f\u0aaa\u0acd\u0ab0\u0abf\u0ab2", "\u0aae\u0ac7", "\u0a9c\u0ac2\u0aa8", "\u0a9c\u0ac1\u0ab2\u0abe\u0a88", "\u0a91\u0a97\u0ab8\u0acd\u0a9f", "\u0ab8\u0aaa\u0acd\u0a9f\u0ac7\u0aae\u0acd\u0aac\u0ab0", "\u0a91\u0a95\u0acd\u0a9f\u0acd\u0aac\u0ab0", "\u0aa8\u0ab5\u0ac7\u0aae\u0acd\u0aac\u0ab0", "\u0aa1\u0abf\u0ab8\u0ac7\u0aae\u0acd\u0aac\u0ab0"], 
SHORTMONTHS:["\u0a9c\u0abe\u0aa8\u0acd\u0aaf\u0ac1", "\u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1", "\u0aae\u0abe\u0ab0\u0acd\u0a9a", "\u0a8f\u0aaa\u0acd\u0ab0\u0abf\u0ab2", "\u0aae\u0ac7", "\u0a9c\u0ac2\u0aa8", "\u0a9c\u0ac1\u0ab2\u0abe\u0a88", "\u0a91\u0a97\u0ab8\u0acd\u0a9f", "\u0ab8\u0aaa\u0acd\u0a9f\u0ac7", "\u0a91\u0a95\u0acd\u0a9f\u0acb", "\u0aa8\u0ab5\u0ac7", "\u0aa1\u0abf\u0ab8\u0ac7"], STANDALONESHORTMONTHS:["\u0a9c\u0abe\u0aa8\u0acd\u0aaf\u0ac1", "\u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1", "\u0aae\u0abe\u0ab0\u0acd\u0a9a", 
"\u0a8f\u0aaa\u0acd\u0ab0\u0abf\u0ab2", "\u0aae\u0ac7", "\u0a9c\u0ac2\u0aa8", "\u0a9c\u0ac1\u0ab2\u0abe\u0a88", "\u0a91\u0a97\u0ab8\u0acd\u0a9f", "\u0ab8\u0aaa\u0acd\u0a9f\u0ac7", "\u0a91\u0a95\u0acd\u0a9f\u0acb", "\u0aa8\u0ab5\u0ac7", "\u0aa1\u0abf\u0ab8\u0ac7"], WEEKDAYS:["\u0ab0\u0ab5\u0abf\u0ab5\u0abe\u0ab0", "\u0ab8\u0acb\u0aae\u0ab5\u0abe\u0ab0", "\u0aae\u0a82\u0a97\u0ab3\u0ab5\u0abe\u0ab0", "\u0aac\u0ac1\u0aa7\u0ab5\u0abe\u0ab0", "\u0a97\u0ac1\u0ab0\u0ac1\u0ab5\u0abe\u0ab0", "\u0ab6\u0ac1\u0a95\u0acd\u0ab0\u0ab5\u0abe\u0ab0", 
"\u0ab6\u0aa8\u0abf\u0ab5\u0abe\u0ab0"], STANDALONEWEEKDAYS:["\u0ab0\u0ab5\u0abf\u0ab5\u0abe\u0ab0", "\u0ab8\u0acb\u0aae\u0ab5\u0abe\u0ab0", "\u0aae\u0a82\u0a97\u0ab3\u0ab5\u0abe\u0ab0", "\u0aac\u0ac1\u0aa7\u0ab5\u0abe\u0ab0", "\u0a97\u0ac1\u0ab0\u0ac1\u0ab5\u0abe\u0ab0", "\u0ab6\u0ac1\u0a95\u0acd\u0ab0\u0ab5\u0abe\u0ab0", "\u0ab6\u0aa8\u0abf\u0ab5\u0abe\u0ab0"], SHORTWEEKDAYS:["\u0ab0\u0ab5\u0abf", "\u0ab8\u0acb\u0aae", "\u0aae\u0a82\u0a97\u0ab3", "\u0aac\u0ac1\u0aa7", "\u0a97\u0ac1\u0ab0\u0ac1", 
"\u0ab6\u0ac1\u0a95\u0acd\u0ab0", "\u0ab6\u0aa8\u0abf"], STANDALONESHORTWEEKDAYS:["\u0ab0\u0ab5\u0abf", "\u0ab8\u0acb\u0aae", "\u0aae\u0a82\u0a97\u0ab3", "\u0aac\u0ac1\u0aa7", "\u0a97\u0ac1\u0ab0\u0ac1", "\u0ab6\u0ac1\u0a95\u0acd\u0ab0", "\u0ab6\u0aa8\u0abf"], NARROWWEEKDAYS:["\u0ab0", "\u0ab8\u0acb", "\u0aae\u0a82", "\u0aac\u0ac1", "\u0a97\u0ac1", "\u0ab6\u0ac1", "\u0ab6"], STANDALONENARROWWEEKDAYS:["\u0ab0", "\u0ab8\u0acb", "\u0aae\u0a82", "\u0aac\u0ac1", "\u0a97\u0ac1", "\u0ab6\u0ac1", "\u0ab6"], 
SHORTQUARTERS:["\u0aa4\u0acd\u0ab0\u0abf\u0aae\u0abe\u0ab8\u0abf\u0a95 \u0ae7", "\u0aa4\u0acd\u0ab0\u0abf\u0aae\u0abe\u0ab8\u0abf\u0a95 \u0ae8", "\u0aa4\u0acd\u0ab0\u0abf\u0aae\u0abe\u0ab8\u0abf\u0a95 \u0ae9", "\u0aa4\u0acd\u0ab0\u0abf\u0aae\u0abe\u0ab8\u0abf\u0a95 \u0aea"], QUARTERS:["\u0aaa\u0ab9\u0ab2\u0ac0 \u0aa4\u0acd\u0ab0\u0abf\u0aae\u0abe\u0ab8\u0abf\u0a95", "\u0aac\u0ac0\u0a9c\u0ac0 \u0aa4\u0acd\u0ab0\u0abf\u0aae\u0abe\u0ab8\u0abf\u0a95", "\u0aa4\u0acd\u0ab0\u0ac0\u0a9c\u0ac0 \u0aa4\u0acd\u0ab0\u0abf\u0aae\u0abe\u0ab8\u0abf\u0a95", 
"\u0a9a\u0acc\u0aa5\u0ac0 \u0aa4\u0acd\u0ab0\u0abf\u0aae\u0abe\u0ab8\u0abf\u0a95"], AMPMS:["am", "pm"], DATEFORMATS:["EEEE, d MMMM, y", "d MMMM, y", "d MMM, y", "d-MM-yy"], TIMEFORMATS:["hh:mm:ss a zzzz", "hh:mm:ss a z", "hh:mm:ss a", "hh:mm a"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"d MMMM", MMMd:"MMM d"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_he = {ERAS:["\u05dc\u05e4\u05e0\u05d4\u05f4\u05e1", "\u05dc\u05e1\u05d4\u05f4\u05e0"], ERANAMES:["\u05dc\u05e4\u05e0\u05d9 \u05d4\u05e1\u05e4\u05d9\u05e8\u05d4", "\u05dc\u05e1\u05e4\u05d9\u05e8\u05d4"], NARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], STANDALONENARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], MONTHS:["\u05d9\u05e0\u05d5\u05d0\u05e8", "\u05e4\u05d1\u05e8\u05d5\u05d0\u05e8", "\u05de\u05e8\u05e1", "\u05d0\u05e4\u05e8\u05d9\u05dc", 
"\u05de\u05d0\u05d9", "\u05d9\u05d5\u05e0\u05d9", "\u05d9\u05d5\u05dc\u05d9", "\u05d0\u05d5\u05d2\u05d5\u05e1\u05d8", "\u05e1\u05e4\u05d8\u05de\u05d1\u05e8", "\u05d0\u05d5\u05e7\u05d8\u05d5\u05d1\u05e8", "\u05e0\u05d5\u05d1\u05de\u05d1\u05e8", "\u05d3\u05e6\u05de\u05d1\u05e8"], STANDALONEMONTHS:["\u05d9\u05e0\u05d5\u05d0\u05e8", "\u05e4\u05d1\u05e8\u05d5\u05d0\u05e8", "\u05de\u05e8\u05e1", "\u05d0\u05e4\u05e8\u05d9\u05dc", "\u05de\u05d0\u05d9", "\u05d9\u05d5\u05e0\u05d9", "\u05d9\u05d5\u05dc\u05d9", 
"\u05d0\u05d5\u05d2\u05d5\u05e1\u05d8", "\u05e1\u05e4\u05d8\u05de\u05d1\u05e8", "\u05d0\u05d5\u05e7\u05d8\u05d5\u05d1\u05e8", "\u05e0\u05d5\u05d1\u05de\u05d1\u05e8", "\u05d3\u05e6\u05de\u05d1\u05e8"], SHORTMONTHS:["\u05d9\u05e0\u05d5", "\u05e4\u05d1\u05e8", "\u05de\u05e8\u05e1", "\u05d0\u05e4\u05e8", "\u05de\u05d0\u05d9", "\u05d9\u05d5\u05e0", "\u05d9\u05d5\u05dc", "\u05d0\u05d5\u05d2", "\u05e1\u05e4\u05d8", "\u05d0\u05d5\u05e7", "\u05e0\u05d5\u05d1", "\u05d3\u05e6\u05de"], STANDALONESHORTMONTHS:["\u05d9\u05e0\u05d5", 
"\u05e4\u05d1\u05e8", "\u05de\u05e8\u05e1", "\u05d0\u05e4\u05e8", "\u05de\u05d0\u05d9", "\u05d9\u05d5\u05e0", "\u05d9\u05d5\u05dc", "\u05d0\u05d5\u05d2", "\u05e1\u05e4\u05d8", "\u05d0\u05d5\u05e7", "\u05e0\u05d5\u05d1", "\u05d3\u05e6\u05de"], WEEKDAYS:["\u05d9\u05d5\u05dd \u05e8\u05d0\u05e9\u05d5\u05df", "\u05d9\u05d5\u05dd \u05e9\u05e0\u05d9", "\u05d9\u05d5\u05dd \u05e9\u05dc\u05d9\u05e9\u05d9", "\u05d9\u05d5\u05dd \u05e8\u05d1\u05d9\u05e2\u05d9", "\u05d9\u05d5\u05dd \u05d7\u05de\u05d9\u05e9\u05d9", 
"\u05d9\u05d5\u05dd \u05e9\u05d9\u05e9\u05d9", "\u05d9\u05d5\u05dd \u05e9\u05d1\u05ea"], STANDALONEWEEKDAYS:["\u05d9\u05d5\u05dd \u05e8\u05d0\u05e9\u05d5\u05df", "\u05d9\u05d5\u05dd \u05e9\u05e0\u05d9", "\u05d9\u05d5\u05dd \u05e9\u05dc\u05d9\u05e9\u05d9", "\u05d9\u05d5\u05dd \u05e8\u05d1\u05d9\u05e2\u05d9", "\u05d9\u05d5\u05dd \u05d7\u05de\u05d9\u05e9\u05d9", "\u05d9\u05d5\u05dd \u05e9\u05d9\u05e9\u05d9", "\u05d9\u05d5\u05dd \u05e9\u05d1\u05ea"], SHORTWEEKDAYS:["\u05d9\u05d5\u05dd \u05d0'", "\u05d9\u05d5\u05dd \u05d1'", 
"\u05d9\u05d5\u05dd \u05d2'", "\u05d9\u05d5\u05dd \u05d3'", "\u05d9\u05d5\u05dd \u05d4'", "\u05d9\u05d5\u05dd \u05d5'", "\u05e9\u05d1\u05ea"], STANDALONESHORTWEEKDAYS:["\u05d9\u05d5\u05dd \u05d0'", "\u05d9\u05d5\u05dd \u05d1'", "\u05d9\u05d5\u05dd \u05d2'", "\u05d9\u05d5\u05dd \u05d3'", "\u05d9\u05d5\u05dd \u05d4'", "\u05d9\u05d5\u05dd \u05d5'", "\u05e9\u05d1\u05ea"], NARROWWEEKDAYS:["\u05d0", "\u05d1", "\u05d2", "\u05d3", "\u05d4", "\u05d5", "\u05e9"], STANDALONENARROWWEEKDAYS:["\u05d0", "\u05d1", 
"\u05d2", "\u05d3", "\u05d4", "\u05d5", "\u05e9"], SHORTQUARTERS:["\u05e8\u05d1\u05e2\u05d5\u05df 1", "\u05e8\u05d1\u05e2\u05d5\u05df 2", "\u05e8\u05d1\u05e2\u05d5\u05df 3", "\u05e8\u05d1\u05e2\u05d5\u05df 4"], QUARTERS:["\u05e8\u05d1\u05e2\u05d5\u05df 1", "\u05e8\u05d1\u05e2\u05d5\u05df 2", "\u05e8\u05d1\u05e2\u05d5\u05df 3", "\u05e8\u05d1\u05e2\u05d5\u05df 4"], AMPMS:['\u05dc\u05e4\u05e0\u05d4"\u05e6', '\u05d0\u05d7\u05d4"\u05e6'], DATEFORMATS:["EEEE, d \u05d1MMMM y", "d \u05d1MMMM y", "dd/MM/yyyy", 
"dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d/M", MMMMd:"d \u05d1MMMM", MMMd:"MMM d"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[4, 5], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_hi = {ERAS:["\u0908\u0938\u093e\u092a\u0942\u0930\u094d\u0935", "\u0938\u0928"], ERANAMES:["\u0908\u0938\u093e\u092a\u0942\u0930\u094d\u0935", "\u0938\u0928"], NARROWMONTHS:["\u091c", "\u092b\u093c", "\u092e\u093e", "\u0905", "\u092e", "\u091c\u0942", "\u091c\u0941", "\u0905", "\u0938\u093f", "\u0905", "\u0928", "\u0926\u093f"], STANDALONENARROWMONTHS:["\u091c", "\u092b\u093c", "\u092e\u093e", "\u0905", "\u092e", "\u091c\u0942", "\u091c\u0941", "\u0905", "\u0938\u093f", 
"\u0905", "\u0928", "\u0926\u093f"], MONTHS:["\u091c\u0928\u0935\u0930\u0940", "\u092b\u0930\u0935\u0930\u0940", "\u092e\u093e\u0930\u094d\u091a", "\u0905\u092a\u094d\u0930\u0948\u0932", "\u092e\u0908", "\u091c\u0942\u0928", "\u091c\u0941\u0932\u093e\u0908", "\u0905\u0917\u0938\u094d\u0924", "\u0938\u093f\u0924\u092e\u094d\u092c\u0930", "\u0905\u0915\u094d\u0924\u0942\u092c\u0930", "\u0928\u0935\u092e\u094d\u092c\u0930", "\u0926\u093f\u0938\u092e\u094d\u092c\u0930"], STANDALONEMONTHS:["\u091c\u0928\u0935\u0930\u0940", 
"\u092b\u0930\u0935\u0930\u0940", "\u092e\u093e\u0930\u094d\u091a", "\u0905\u092a\u094d\u0930\u0948\u0932", "\u092e\u0908", "\u091c\u0942\u0928", "\u091c\u0941\u0932\u093e\u0908", "\u0905\u0917\u0938\u094d\u0924", "\u0938\u093f\u0924\u092e\u094d\u092c\u0930", "\u0905\u0915\u094d\u0924\u0942\u092c\u0930", "\u0928\u0935\u092e\u094d\u092c\u0930", "\u0926\u093f\u0938\u092e\u094d\u092c\u0930"], SHORTMONTHS:["\u091c\u0928\u0935\u0930\u0940", "\u092b\u0930\u0935\u0930\u0940", "\u092e\u093e\u0930\u094d\u091a", 
"\u0905\u092a\u094d\u0930\u0948\u0932", "\u092e\u0908", "\u091c\u0942\u0928", "\u091c\u0941\u0932\u093e\u0908", "\u0905\u0917\u0938\u094d\u0924", "\u0938\u093f\u0924\u092e\u094d\u092c\u0930", "\u0905\u0915\u094d\u0924\u0942\u092c\u0930", "\u0928\u0935\u092e\u094d\u092c\u0930", "\u0926\u093f\u0938\u092e\u094d\u092c\u0930"], STANDALONESHORTMONTHS:["\u091c\u0928\u0935\u0930\u0940", "\u092b\u0930\u0935\u0930\u0940", "\u092e\u093e\u0930\u094d\u091a", "\u0905\u092a\u094d\u0930\u0948\u0932", "\u092e\u0908", 
"\u091c\u0942\u0928", "\u091c\u0941\u0932\u093e\u0908", "\u0905\u0917\u0938\u094d\u0924", "\u0938\u093f\u0924\u092e\u094d\u092c\u0930", "\u0905\u0915\u094d\u0924\u0942\u092c\u0930", "\u0928\u0935\u092e\u094d\u092c\u0930", "\u0926\u093f\u0938\u092e\u094d\u092c\u0930"], WEEKDAYS:["\u0930\u0935\u093f\u0935\u093e\u0930", "\u0938\u094b\u092e\u0935\u093e\u0930", "\u092e\u0902\u0917\u0932\u0935\u093e\u0930", "\u092c\u0941\u0927\u0935\u093e\u0930", "\u0917\u0941\u0930\u0941\u0935\u093e\u0930", "\u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930", 
"\u0936\u0928\u093f\u0935\u093e\u0930"], STANDALONEWEEKDAYS:["\u0930\u0935\u093f\u0935\u093e\u0930", "\u0938\u094b\u092e\u0935\u093e\u0930", "\u092e\u0902\u0917\u0932\u0935\u093e\u0930", "\u092c\u0941\u0927\u0935\u093e\u0930", "\u0917\u0941\u0930\u0941\u0935\u093e\u0930", "\u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930", "\u0936\u0928\u093f\u0935\u093e\u0930"], SHORTWEEKDAYS:["\u0930\u0935\u093f", "\u0938\u094b\u092e", "\u092e\u0902\u0917\u0932", "\u092c\u0941\u0927", "\u0917\u0941\u0930\u0941", 
"\u0936\u0941\u0915\u094d\u0930", "\u0936\u0928\u093f"], STANDALONESHORTWEEKDAYS:["\u0930\u0935\u093f", "\u0938\u094b\u092e", "\u092e\u0902\u0917\u0932", "\u092c\u0941\u0927", "\u0917\u0941\u0930\u0941", "\u0936\u0941\u0915\u094d\u0930", "\u0936\u0928\u093f"], NARROWWEEKDAYS:["\u0930", "\u0938\u094b", "\u092e\u0902", "\u092c\u0941", "\u0917\u0941", "\u0936\u0941", "\u0936"], STANDALONENARROWWEEKDAYS:["\u0930", "\u0938\u094b", "\u092e\u0902", "\u092c\u0941", "\u0917\u0941", "\u0936\u0941", "\u0936"], 
SHORTQUARTERS:["\u092a\u094d\u0930\u0925\u092e \u091a\u094c\u0925\u093e\u0908", "\u0926\u094d\u0935\u093f\u0924\u0940\u092f \u091a\u094c\u0925\u093e\u0908", "\u0924\u0943\u0924\u0940\u092f \u091a\u094c\u0925\u093e\u0908", "\u091a\u0924\u0941\u0930\u094d\u0925 \u091a\u094c\u0925\u093e\u0908"], QUARTERS:["\u092a\u094d\u0930\u0925\u092e \u091a\u094c\u0925\u093e\u0908", "\u0926\u094d\u0935\u093f\u0924\u0940\u092f \u091a\u094c\u0925\u093e\u0908", "\u0924\u0943\u0924\u0940\u092f \u091a\u094c\u0925\u093e\u0908", 
"\u091a\u0924\u0941\u0930\u094d\u0925 \u091a\u094c\u0925\u093e\u0908"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "dd-MM-yyyy", "d-M-yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], AVAILABLEFORMATS:{Md:"d/M", MMMMd:"d MMMM", MMMd:"d MMM"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_hr = {ERAS:["pr.n.e.", "AD"], ERANAMES:["Prije Krista", "Poslije Krista"], NARROWMONTHS:["1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10.", "11.", "12."], STANDALONENARROWMONTHS:["1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10.", "11.", "12."], MONTHS:["sije\u010dnja", "velja\u010de", "o\u017eujka", "travnja", "svibnja", "lipnja", "srpnja", "kolovoza", "rujna", "listopada", "studenoga", "prosinca"], STANDALONEMONTHS:["sije\u010danj", "velja\u010da", "o\u017eujak", 
"travanj", "svibanj", "lipanj", "srpanj", "kolovoz", "rujan", "listopad", "studeni", "prosinac"], SHORTMONTHS:["01.", "02.", "03.", "04.", "05.", "06.", "07.", "08.", "09.", "10.", "11.", "12."], STANDALONESHORTMONTHS:["01.", "02.", "03.", "04.", "05.", "06.", "07.", "08.", "09.", "10.", "11.", "12."], WEEKDAYS:["nedjelja", "ponedjeljak", "utorak", "srijeda", "\u010detvrtak", "petak", "subota"], STANDALONEWEEKDAYS:["nedjelja", "ponedjeljak", "utorak", "srijeda", "\u010detvrtak", "petak", "subota"], 
SHORTWEEKDAYS:["ned", "pon", "uto", "sri", "\u010det", "pet", "sub"], STANDALONESHORTWEEKDAYS:["ned", "pon", "uto", "sri", "\u010det", "pet", "sub"], NARROWWEEKDAYS:["n", "p", "u", "s", "\u010d", "p", "s"], STANDALONENARROWWEEKDAYS:["n", "p", "u", "s", "\u010d", "p", "s"], SHORTQUARTERS:["1kv", "2kv", "3kv", "4kv"], QUARTERS:["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d. MMMM y.", "d. MMMM y.", "d.M.yyyy.", "dd.MM.yyyy."], TIMEFORMATS:["HH:mm:ss zzzz", 
"HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d.M.", MMMMd:"d. MMMM", MMMd:"d.MMM."}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_hu = {ERAS:["i. e.", "i. sz."], ERANAMES:["id\u0151sz\u00e1m\u00edt\u00e1sunk el\u0151tt", "id\u0151sz\u00e1m\u00edt\u00e1sunk szerint"], NARROWMONTHS:["J", "F", "M", "\u00c1", "M", "J", "J", "A", "Sz", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "\u00c1", "M", "J", "J", "A", "Sz", "O", "N", "D"], MONTHS:["janu\u00e1r", "febru\u00e1r", "m\u00e1rcius", "\u00e1prilis", "m\u00e1jus", "j\u00fanius", "j\u00falius", "augusztus", "szeptember", "okt\u00f3ber", "november", 
"december"], STANDALONEMONTHS:["janu\u00e1r", "febru\u00e1r", "m\u00e1rcius", "\u00e1prilis", "m\u00e1jus", "j\u00fanius", "j\u00falius", "augusztus", "szeptember", "okt\u00f3ber", "november", "december"], SHORTMONTHS:["jan.", "febr.", "m\u00e1rc.", "\u00e1pr.", "m\u00e1j.", "j\u00fan.", "j\u00fal.", "aug.", "szept.", "okt.", "nov.", "dec."], STANDALONESHORTMONTHS:["jan.", "febr.", "m\u00e1rc.", "\u00e1pr.", "m\u00e1j.", "j\u00fan.", "j\u00fal.", "aug.", "szept.", "okt.", "nov.", "dec."], WEEKDAYS:["vas\u00e1rnap", 
"h\u00e9tf\u0151", "kedd", "szerda", "cs\u00fct\u00f6rt\u00f6k", "p\u00e9ntek", "szombat"], STANDALONEWEEKDAYS:["vas\u00e1rnap", "h\u00e9tf\u0151", "kedd", "szerda", "cs\u00fct\u00f6rt\u00f6k", "p\u00e9ntek", "szombat"], SHORTWEEKDAYS:["V", "H", "K", "Sze", "Cs", "P", "Szo"], STANDALONESHORTWEEKDAYS:["V", "H", "K", "Sze", "Cs", "P", "Szo"], NARROWWEEKDAYS:["V", "H", "K", "Sz", "Cs", "P", "Sz"], STANDALONENARROWWEEKDAYS:["V", "H", "K", "Sz", "Cs", "P", "Sz"], SHORTQUARTERS:["N1", "N2", "N3", "N4"], 
QUARTERS:["I. negyed\u00e9v", "II. negyed\u00e9v", "III. negyed\u00e9v", "IV. negyed\u00e9v"], AMPMS:["de.", "du."], DATEFORMATS:["y. MMMM d., EEEE", "y. MMMM d.", "yyyy.MM.dd.", "yyyy.MM.dd."], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], AVAILABLEFORMATS:{Md:"M. d.", MMMMd:"MMMM d.", MMMd:"MMM d."}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_id = {ERAS:["BCE", "CE"], ERANAMES:["BCE", "CE"], NARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], STANDALONENARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], MONTHS:["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"], STANDALONEMONTHS:["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", 
"Desember"], SHORTMONTHS:["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"], STANDALONESHORTMONTHS:["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"], WEEKDAYS:["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"], STANDALONEWEEKDAYS:["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"], SHORTWEEKDAYS:["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"], STANDALONESHORTWEEKDAYS:["Min", "Sen", "Sel", "Rab", "Kam", 
"Jum", "Sab"], NARROWWEEKDAYS:["1", "2", "3", "4", "5", "6", "7"], STANDALONENARROWWEEKDAYS:["1", "2", "3", "4", "5", "6", "7"], SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["kuartal pertama", "kuartal kedua", "kuartal ketiga", "kuartal keempat"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, dd MMMM yyyy", "d MMMM yyyy", "d MMM yyyy", "dd/MM/yy"], TIMEFORMATS:["H:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"MMMM d", MMMd:"MMM d"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 
6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_in = {ERAS:["BCE", "CE"], ERANAMES:["BCE", "CE"], NARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], STANDALONENARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], MONTHS:["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"], STANDALONEMONTHS:["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", 
"Desember"], SHORTMONTHS:["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"], STANDALONESHORTMONTHS:["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"], WEEKDAYS:["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"], STANDALONEWEEKDAYS:["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"], SHORTWEEKDAYS:["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"], STANDALONESHORTWEEKDAYS:["Min", "Sen", "Sel", "Rab", "Kam", 
"Jum", "Sab"], NARROWWEEKDAYS:["1", "2", "3", "4", "5", "6", "7"], STANDALONENARROWWEEKDAYS:["1", "2", "3", "4", "5", "6", "7"], SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["kuartal pertama", "kuartal kedua", "kuartal ketiga", "kuartal keempat"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, dd MMMM yyyy", "d MMMM yyyy", "d MMM yyyy", "dd/MM/yy"], TIMEFORMATS:["H:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"MMMM d", MMMd:"MMM d"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 
6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_is = {ERAS:["fyrir Krist", "eftir Krist"], ERANAMES:["fyrir Krist", "eftir Krist"], NARROWMONTHS:["j", "f", "m", "a", "m", "j", "j", "\u00e1", "s", "o", "n", "d"], STANDALONENARROWMONTHS:["j", "f", "m", "a", "m", "j", "j", "\u00e1", "s", "o", "n", "d"], MONTHS:["jan\u00faar", "febr\u00faar", "mars", "apr\u00edl", "ma\u00ed", "j\u00fan\u00ed", "j\u00fal\u00ed", "\u00e1g\u00fast", "september", "okt\u00f3ber", "n\u00f3vember", "desember"], STANDALONEMONTHS:["jan\u00faar", "febr\u00faar", 
"mars", "apr\u00edl", "ma\u00ed", "j\u00fan\u00ed", "j\u00fal\u00ed", "\u00e1g\u00fast", "september", "okt\u00f3ber", "n\u00f3vember", "desember"], SHORTMONTHS:["jan", "feb", "mar", "apr", "ma\u00ed", "j\u00fan", "j\u00fal", "\u00e1g\u00fa", "sep", "okt", "n\u00f3v", "des"], STANDALONESHORTMONTHS:["jan", "feb", "mar", "apr", "ma\u00ed", "j\u00fan", "j\u00fal", "\u00e1g\u00fa", "sep", "okt", "n\u00f3v", "des"], WEEKDAYS:["sunnudagur", "m\u00e1nudagur", "\u00feri\u00f0judagur", "mi\u00f0vikudagur", 
"fimmtudagur", "f\u00f6studagur", "laugardagur"], STANDALONEWEEKDAYS:["sunnudagur", "m\u00e1nudagur", "\u00feri\u00f0judagur", "mi\u00f0vikudagur", "fimmtudagur", "f\u00f6studagur", "laugardagur"], SHORTWEEKDAYS:["sun", "m\u00e1n", "\u00feri", "mi\u00f0", "fim", "f\u00f6s", "lau"], STANDALONESHORTWEEKDAYS:["sun", "m\u00e1n", "\u00feri", "mi\u00f0", "fim", "f\u00f6s", "lau"], NARROWWEEKDAYS:["s", "m", "\u00fe", "m", "f", "f", "l"], STANDALONENARROWWEEKDAYS:["s", "m", "\u00fe", "m", "f", "f", "l"], 
SHORTQUARTERS:["F1", "F2", "F3", "F4"], QUARTERS:["1st fj\u00f3r\u00f0ungur", "2nd fj\u00f3r\u00f0ungur", "3rd fj\u00f3r\u00f0ungur", "4th fj\u00f3r\u00f0ungur"], AMPMS:["f.h.", "e.h."], DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "d.M.yyyy", "d.M.yyyy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d.M", MMMMd:"d. MMMM", MMMd:"d. MMM"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_it = {ERAS:["aC", "dC"], ERANAMES:["a.C.", "d.C"], NARROWMONTHS:["G", "F", "M", "A", "M", "G", "L", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["G", "F", "M", "A", "M", "G", "L", "A", "S", "O", "N", "D"], MONTHS:["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"], STANDALONEMONTHS:["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", 
"Dicembre"], SHORTMONTHS:["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"], STANDALONESHORTMONTHS:["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"], WEEKDAYS:["domenica", "luned\u00ec", "marted\u00ec", "mercoled\u00ec", "gioved\u00ec", "venerd\u00ec", "sabato"], STANDALONEWEEKDAYS:["Domenica", "Luned\u00ec", "Marted\u00ec", "Mercoled\u00ec", "Gioved\u00ec", "Venerd\u00ec", "Sabato"], SHORTWEEKDAYS:["dom", "lun", "mar", "mer", "gio", 
"ven", "sab"], STANDALONESHORTWEEKDAYS:["dom", "lun", "mar", "mer", "gio", "ven", "sab"], NARROWWEEKDAYS:["D", "L", "M", "M", "G", "V", "S"], STANDALONENARROWWEEKDAYS:["D", "L", "M", "M", "G", "V", "S"], SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1o trimestre", "2o trimestre", "3o trimestre", "4o trimestre"], AMPMS:["m.", "p."], DATEFORMATS:["EEEE d MMMM y", "dd MMMM y", "dd/MMM/y", "dd/MM/yy"], TIMEFORMATS:["HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], AVAILABLEFORMATS:{Md:"d/M", 
MMMMd:"d MMMM", MMMd:"d MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_iw = {ERAS:["\u05dc\u05e4\u05e0\u05d4\u05f4\u05e1", "\u05dc\u05e1\u05d4\u05f4\u05e0"], ERANAMES:["\u05dc\u05e4\u05e0\u05d9 \u05d4\u05e1\u05e4\u05d9\u05e8\u05d4", "\u05dc\u05e1\u05e4\u05d9\u05e8\u05d4"], NARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], STANDALONENARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], MONTHS:["\u05d9\u05e0\u05d5\u05d0\u05e8", "\u05e4\u05d1\u05e8\u05d5\u05d0\u05e8", "\u05de\u05e8\u05e1", "\u05d0\u05e4\u05e8\u05d9\u05dc", 
"\u05de\u05d0\u05d9", "\u05d9\u05d5\u05e0\u05d9", "\u05d9\u05d5\u05dc\u05d9", "\u05d0\u05d5\u05d2\u05d5\u05e1\u05d8", "\u05e1\u05e4\u05d8\u05de\u05d1\u05e8", "\u05d0\u05d5\u05e7\u05d8\u05d5\u05d1\u05e8", "\u05e0\u05d5\u05d1\u05de\u05d1\u05e8", "\u05d3\u05e6\u05de\u05d1\u05e8"], STANDALONEMONTHS:["\u05d9\u05e0\u05d5\u05d0\u05e8", "\u05e4\u05d1\u05e8\u05d5\u05d0\u05e8", "\u05de\u05e8\u05e1", "\u05d0\u05e4\u05e8\u05d9\u05dc", "\u05de\u05d0\u05d9", "\u05d9\u05d5\u05e0\u05d9", "\u05d9\u05d5\u05dc\u05d9", 
"\u05d0\u05d5\u05d2\u05d5\u05e1\u05d8", "\u05e1\u05e4\u05d8\u05de\u05d1\u05e8", "\u05d0\u05d5\u05e7\u05d8\u05d5\u05d1\u05e8", "\u05e0\u05d5\u05d1\u05de\u05d1\u05e8", "\u05d3\u05e6\u05de\u05d1\u05e8"], SHORTMONTHS:["\u05d9\u05e0\u05d5", "\u05e4\u05d1\u05e8", "\u05de\u05e8\u05e1", "\u05d0\u05e4\u05e8", "\u05de\u05d0\u05d9", "\u05d9\u05d5\u05e0", "\u05d9\u05d5\u05dc", "\u05d0\u05d5\u05d2", "\u05e1\u05e4\u05d8", "\u05d0\u05d5\u05e7", "\u05e0\u05d5\u05d1", "\u05d3\u05e6\u05de"], STANDALONESHORTMONTHS:["\u05d9\u05e0\u05d5", 
"\u05e4\u05d1\u05e8", "\u05de\u05e8\u05e1", "\u05d0\u05e4\u05e8", "\u05de\u05d0\u05d9", "\u05d9\u05d5\u05e0", "\u05d9\u05d5\u05dc", "\u05d0\u05d5\u05d2", "\u05e1\u05e4\u05d8", "\u05d0\u05d5\u05e7", "\u05e0\u05d5\u05d1", "\u05d3\u05e6\u05de"], WEEKDAYS:["\u05d9\u05d5\u05dd \u05e8\u05d0\u05e9\u05d5\u05df", "\u05d9\u05d5\u05dd \u05e9\u05e0\u05d9", "\u05d9\u05d5\u05dd \u05e9\u05dc\u05d9\u05e9\u05d9", "\u05d9\u05d5\u05dd \u05e8\u05d1\u05d9\u05e2\u05d9", "\u05d9\u05d5\u05dd \u05d7\u05de\u05d9\u05e9\u05d9", 
"\u05d9\u05d5\u05dd \u05e9\u05d9\u05e9\u05d9", "\u05d9\u05d5\u05dd \u05e9\u05d1\u05ea"], STANDALONEWEEKDAYS:["\u05d9\u05d5\u05dd \u05e8\u05d0\u05e9\u05d5\u05df", "\u05d9\u05d5\u05dd \u05e9\u05e0\u05d9", "\u05d9\u05d5\u05dd \u05e9\u05dc\u05d9\u05e9\u05d9", "\u05d9\u05d5\u05dd \u05e8\u05d1\u05d9\u05e2\u05d9", "\u05d9\u05d5\u05dd \u05d7\u05de\u05d9\u05e9\u05d9", "\u05d9\u05d5\u05dd \u05e9\u05d9\u05e9\u05d9", "\u05d9\u05d5\u05dd \u05e9\u05d1\u05ea"], SHORTWEEKDAYS:["\u05d9\u05d5\u05dd \u05d0'", "\u05d9\u05d5\u05dd \u05d1'", 
"\u05d9\u05d5\u05dd \u05d2'", "\u05d9\u05d5\u05dd \u05d3'", "\u05d9\u05d5\u05dd \u05d4'", "\u05d9\u05d5\u05dd \u05d5'", "\u05e9\u05d1\u05ea"], STANDALONESHORTWEEKDAYS:["\u05d9\u05d5\u05dd \u05d0'", "\u05d9\u05d5\u05dd \u05d1'", "\u05d9\u05d5\u05dd \u05d2'", "\u05d9\u05d5\u05dd \u05d3'", "\u05d9\u05d5\u05dd \u05d4'", "\u05d9\u05d5\u05dd \u05d5'", "\u05e9\u05d1\u05ea"], NARROWWEEKDAYS:["\u05d0", "\u05d1", "\u05d2", "\u05d3", "\u05d4", "\u05d5", "\u05e9"], STANDALONENARROWWEEKDAYS:["\u05d0", "\u05d1", 
"\u05d2", "\u05d3", "\u05d4", "\u05d5", "\u05e9"], SHORTQUARTERS:["\u05e8\u05d1\u05e2\u05d5\u05df 1", "\u05e8\u05d1\u05e2\u05d5\u05df 2", "\u05e8\u05d1\u05e2\u05d5\u05df 3", "\u05e8\u05d1\u05e2\u05d5\u05df 4"], QUARTERS:["\u05e8\u05d1\u05e2\u05d5\u05df 1", "\u05e8\u05d1\u05e2\u05d5\u05df 2", "\u05e8\u05d1\u05e2\u05d5\u05df 3", "\u05e8\u05d1\u05e2\u05d5\u05df 4"], AMPMS:['\u05dc\u05e4\u05e0\u05d4"\u05e6', '\u05d0\u05d7\u05d4"\u05e6'], DATEFORMATS:["EEEE, d \u05d1MMMM y", "d \u05d1MMMM y", "dd/MM/yyyy", 
"dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d/M", MMMMd:"d \u05d1MMMM", MMMd:"MMM d"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_ja = {ERAS:["\u7d00\u5143\u524d", "\u897f\u66a6"], ERANAMES:["\u7d00\u5143\u524d", "\u897f\u66a6"], NARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], STANDALONENARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], MONTHS:["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"], STANDALONEMONTHS:["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", 
"6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"], SHORTMONTHS:["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"], STANDALONESHORTMONTHS:["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"], WEEKDAYS:["\u65e5\u66dc\u65e5", "\u6708\u66dc\u65e5", "\u706b\u66dc\u65e5", "\u6c34\u66dc\u65e5", "\u6728\u66dc\u65e5", 
"\u91d1\u66dc\u65e5", "\u571f\u66dc\u65e5"], STANDALONEWEEKDAYS:["\u65e5\u66dc\u65e5", "\u6708\u66dc\u65e5", "\u706b\u66dc\u65e5", "\u6c34\u66dc\u65e5", "\u6728\u66dc\u65e5", "\u91d1\u66dc\u65e5", "\u571f\u66dc\u65e5"], SHORTWEEKDAYS:["\u65e5", "\u6708", "\u706b", "\u6c34", "\u6728", "\u91d1", "\u571f"], STANDALONESHORTWEEKDAYS:["\u65e5", "\u6708", "\u706b", "\u6c34", "\u6728", "\u91d1", "\u571f"], NARROWWEEKDAYS:["\u65e5", "\u6708", "\u706b", "\u6c34", "\u6728", "\u91d1", "\u571f"], STANDALONENARROWWEEKDAYS:["\u65e5", 
"\u6708", "\u706b", "\u6c34", "\u6728", "\u91d1", "\u571f"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["\u7b2c1\u56db\u534a\u671f", "\u7b2c2\u56db\u534a\u671f", "\u7b2c3\u56db\u534a\u671f", "\u7b2c4\u56db\u534a\u671f"], AMPMS:["\u5348\u524d", "\u5348\u5f8c"], DATEFORMATS:["y\u5e74M\u6708d\u65e5EEEE", "y\u5e74M\u6708d\u65e5", "yyyy/MM/dd", "yy/MM/dd"], TIMEFORMATS:["H\u6642mm\u5206ss\u79d2 zzzz", "HH:mm:ss z", "H:mm:ss", "H:mm"], AVAILABLEFORMATS:{Md:"M/d", MMMMd:"M\u6708d\u65e5", MMMd:"M\u6708d\u65e5"}, 
FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_kn = {ERAS:["BCE", "CE"], ERANAMES:["\u0c88\u0cb8\u0caa\u0cc2\u0cb5\u0cef.", "\u0c95\u0ccd\u0cb0\u0cbf\u0cb8\u0ccd\u0ca4 \u0cb6\u0c95"], NARROWMONTHS:["\u0c9c", "\u0cab\u0cc6", "\u0cae\u0cbe", "\u0c8e", "\u0cae\u0cc7", "\u0c9c\u0cc2", "\u0c9c\u0cc1", "\u0c86", "\u0cb8\u0cc6", "\u0c85", "\u0ca8", "\u0ca1\u0cbf"], STANDALONENARROWMONTHS:["\u0c9c", "\u0cab\u0cc6", "\u0cae\u0cbe", "\u0c8e", "\u0cae\u0cc7", "\u0c9c\u0cc2", "\u0c9c\u0cc1", "\u0c86", "\u0cb8\u0cc6", "\u0c85", "\u0ca8", 
"\u0ca1\u0cbf"], MONTHS:["\u0c9c\u0ca8\u0cb5\u0cb0\u0cc0", "\u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cb5\u0cb0\u0cc0", "\u0cae\u0cbe\u0cb0\u0ccd\u0c9a\u0ccd", "\u0c8e\u0caa\u0ccd\u0cb0\u0cbf\u0cb2\u0ccd", "\u0cae\u0cc6", "\u0c9c\u0cc2\u0ca8\u0ccd", "\u0c9c\u0cc1\u0cb2\u0cc8", "\u0c86\u0c97\u0cb8\u0ccd\u0c9f\u0ccd", "\u0cb8\u0caa\u0ccd\u0c9f\u0cc6\u0c82\u0cac\u0cb0\u0ccd", "\u0c85\u0c95\u0ccd\u0c9f\u0ccb\u0cac\u0cb0\u0ccd", "\u0ca8\u0cb5\u0cc6\u0c82\u0cac\u0cb0\u0ccd", "\u0ca1\u0cbf\u0cb8\u0cc6\u0c82\u0cac\u0cb0\u0ccd"], 
STANDALONEMONTHS:["\u0c9c\u0ca8\u0cb5\u0cb0\u0cc0", "\u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cb5\u0cb0\u0cc0", "\u0cae\u0cbe\u0cb0\u0ccd\u0c9a\u0ccd", "\u0c8e\u0caa\u0ccd\u0cb0\u0cbf\u0cb2\u0ccd", "\u0cae\u0cc6", "\u0c9c\u0cc2\u0ca8\u0ccd", "\u0c9c\u0cc1\u0cb2\u0cc8", "\u0c86\u0c97\u0cb8\u0ccd\u0c9f\u0ccd", "\u0cb8\u0caa\u0ccd\u0c9f\u0cc6\u0c82\u0cac\u0cb0\u0ccd", "\u0c85\u0c95\u0ccd\u0c9f\u0ccb\u0cac\u0cb0\u0ccd", "\u0ca8\u0cb5\u0cc6\u0c82\u0cac\u0cb0\u0ccd", "\u0ca1\u0cbf\u0cb8\u0cc6\u0c82\u0cac\u0cb0\u0ccd"], 
SHORTMONTHS:["\u0c9c\u0ca8\u0cb5\u0cb0\u0cc0", "\u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cb5\u0cb0\u0cc0", "\u0cae\u0cbe\u0cb0\u0ccd\u0c9a\u0ccd", "\u0c8e\u0caa\u0ccd\u0cb0\u0cbf\u0cb2\u0ccd", "\u0cae\u0cc6", "\u0c9c\u0cc2\u0ca8\u0ccd", "\u0c9c\u0cc1\u0cb2\u0cc8", "\u0c86\u0c97\u0cb8\u0ccd\u0c9f\u0ccd", "\u0cb8\u0caa\u0ccd\u0c9f\u0cc6\u0c82\u0cac\u0cb0\u0ccd", "\u0c85\u0c95\u0ccd\u0c9f\u0ccb\u0cac\u0cb0\u0ccd", "\u0ca8\u0cb5\u0cc6\u0c82\u0cac\u0cb0\u0ccd", "\u0ca1\u0cbf\u0cb8\u0cc6\u0c82\u0cac\u0cb0\u0ccd"], 
STANDALONESHORTMONTHS:["\u0c9c\u0ca8\u0cb5\u0cb0\u0cc0", "\u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cb5\u0cb0\u0cc0", "\u0cae\u0cbe\u0cb0\u0ccd\u0c9a\u0ccd", "\u0c8e\u0caa\u0ccd\u0cb0\u0cbf\u0cb2\u0ccd", "\u0cae\u0cc6", "\u0c9c\u0cc2\u0ca8\u0ccd", "\u0c9c\u0cc1\u0cb2\u0cc8", "\u0c86\u0c97\u0cb8\u0ccd\u0c9f\u0ccd", "\u0cb8\u0caa\u0ccd\u0c9f\u0cc6\u0c82\u0cac\u0cb0\u0ccd", "\u0c85\u0c95\u0ccd\u0c9f\u0ccb\u0cac\u0cb0\u0ccd", "\u0ca8\u0cb5\u0cc6\u0c82\u0cac\u0cb0\u0ccd", "\u0ca1\u0cbf\u0cb8\u0cc6\u0c82\u0cac\u0cb0\u0ccd"], 
WEEKDAYS:["\u0cb0\u0cb5\u0cbf\u0cb5\u0cbe\u0cb0", "\u0cb8\u0ccb\u0cae\u0cb5\u0cbe\u0cb0", "\u0cae\u0c82\u0c97\u0cb3\u0cb5\u0cbe\u0cb0", "\u0cac\u0cc1\u0ca7\u0cb5\u0cbe\u0cb0", "\u0c97\u0cc1\u0cb0\u0cc1\u0cb5\u0cbe\u0cb0", "\u0cb6\u0cc1\u0c95\u0ccd\u0cb0\u0cb5\u0cbe\u0cb0", "\u0cb6\u0ca8\u0cbf\u0cb5\u0cbe\u0cb0"], STANDALONEWEEKDAYS:["\u0cb0\u0cb5\u0cbf\u0cb5\u0cbe\u0cb0", "\u0cb8\u0ccb\u0cae\u0cb5\u0cbe\u0cb0", "\u0cae\u0c82\u0c97\u0cb3\u0cb5\u0cbe\u0cb0", "\u0cac\u0cc1\u0ca7\u0cb5\u0cbe\u0cb0", 
"\u0c97\u0cc1\u0cb0\u0cc1\u0cb5\u0cbe\u0cb0", "\u0cb6\u0cc1\u0c95\u0ccd\u0cb0\u0cb5\u0cbe\u0cb0", "\u0cb6\u0ca8\u0cbf\u0cb5\u0cbe\u0cb0"], SHORTWEEKDAYS:["\u0cb0.", "\u0cb8\u0ccb.", "\u0cae\u0c82.", "\u0cac\u0cc1.", "\u0c97\u0cc1.", "\u0cb6\u0cc1.", "\u0cb6\u0ca8\u0cbf."], STANDALONESHORTWEEKDAYS:["\u0cb0.", "\u0cb8\u0ccb.", "\u0cae\u0c82.", "\u0cac\u0cc1.", "\u0c97\u0cc1.", "\u0cb6\u0cc1.", "\u0cb6\u0ca8\u0cbf."], NARROWWEEKDAYS:["\u0cb0", "\u0cb8\u0ccb", "\u0cae\u0c82", "\u0cac\u0cc1", "\u0c97\u0cc1", 
"\u0cb6\u0cc1", "\u0cb6"], STANDALONENARROWWEEKDAYS:["\u0cb0", "\u0cb8\u0ccb", "\u0cae\u0c82", "\u0cac\u0cc1", "\u0c97\u0cc1", "\u0cb6\u0cc1", "\u0cb6"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["\u0c92\u0c82\u0ca6\u0cc1 1", "\u0c8e\u0cb0\u0ca1\u0cc1 2", "\u0cae\u0cc2\u0cb0\u0cc1 3", "\u0ca8\u0cbe\u0cb2\u0cc3\u0c95 4"], AMPMS:["am", "pm"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "d-M-yy"], TIMEFORMATS:["hh:mm:ss a zzzz", "hh:mm:ss a z", "hh:mm:ss a", "hh:mm a"], AVAILABLEFORMATS:{Md:"M-d", 
MMMMd:"d MMMM", MMMd:"MMM d"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_ko = {ERAS:["\uae30\uc6d0\uc804", "\uc11c\uae30"], ERANAMES:["\uc11c\ub825\uae30\uc6d0\uc804", "\uc11c\ub825\uae30\uc6d0"], NARROWMONTHS:["1\uc6d4", "2\uc6d4", "3\uc6d4", "4\uc6d4", "5\uc6d4", "6\uc6d4", "7\uc6d4", "8\uc6d4", "9\uc6d4", "10\uc6d4", "11\uc6d4", "12\uc6d4"], STANDALONENARROWMONTHS:["1\uc6d4", "2\uc6d4", "3\uc6d4", "4\uc6d4", "5\uc6d4", "6\uc6d4", "7\uc6d4", "8\uc6d4", "9\uc6d4", "10\uc6d4", "11\uc6d4", "12\uc6d4"], MONTHS:["1\uc6d4", "2\uc6d4", "3\uc6d4", 
"4\uc6d4", "5\uc6d4", "6\uc6d4", "7\uc6d4", "8\uc6d4", "9\uc6d4", "10\uc6d4", "11\uc6d4", "12\uc6d4"], STANDALONEMONTHS:["1\uc6d4", "2\uc6d4", "3\uc6d4", "4\uc6d4", "5\uc6d4", "6\uc6d4", "7\uc6d4", "8\uc6d4", "9\uc6d4", "10\uc6d4", "11\uc6d4", "12\uc6d4"], SHORTMONTHS:["1\uc6d4", "2\uc6d4", "3\uc6d4", "4\uc6d4", "5\uc6d4", "6\uc6d4", "7\uc6d4", "8\uc6d4", "9\uc6d4", "10\uc6d4", "11\uc6d4", "12\uc6d4"], STANDALONESHORTMONTHS:["1\uc6d4", "2\uc6d4", "3\uc6d4", "4\uc6d4", "5\uc6d4", "6\uc6d4", "7\uc6d4", 
"8\uc6d4", "9\uc6d4", "10\uc6d4", "11\uc6d4", "12\uc6d4"], WEEKDAYS:["\uc77c\uc694\uc77c", "\uc6d4\uc694\uc77c", "\ud654\uc694\uc77c", "\uc218\uc694\uc77c", "\ubaa9\uc694\uc77c", "\uae08\uc694\uc77c", "\ud1a0\uc694\uc77c"], STANDALONEWEEKDAYS:["\uc77c\uc694\uc77c", "\uc6d4\uc694\uc77c", "\ud654\uc694\uc77c", "\uc218\uc694\uc77c", "\ubaa9\uc694\uc77c", "\uae08\uc694\uc77c", "\ud1a0\uc694\uc77c"], SHORTWEEKDAYS:["\uc77c", "\uc6d4", "\ud654", "\uc218", "\ubaa9", "\uae08", "\ud1a0"], STANDALONESHORTWEEKDAYS:["\uc77c", 
"\uc6d4", "\ud654", "\uc218", "\ubaa9", "\uae08", "\ud1a0"], NARROWWEEKDAYS:["\uc77c", "\uc6d4", "\ud654", "\uc218", "\ubaa9", "\uae08", "\ud1a0"], STANDALONENARROWWEEKDAYS:["\uc77c", "\uc6d4", "\ud654", "\uc218", "\ubaa9", "\uae08", "\ud1a0"], SHORTQUARTERS:["1\ubd84\uae30", "2\ubd84\uae30", "3\ubd84\uae30", "4\ubd84\uae30"], QUARTERS:["\uc81c 1/4\ubd84\uae30", "\uc81c 2/4\ubd84\uae30", "\uc81c 3/4\ubd84\uae30", "\uc81c 4/4\ubd84\uae30"], AMPMS:["\uc624\uc804", "\uc624\ud6c4"], DATEFORMATS:["y\ub144 M\uc6d4 d\uc77c EEEE", 
"y\ub144 M\uc6d4 d\uc77c", "yyyy. M. d.", "yy. M. d."], TIMEFORMATS:["a hh\uc2dc mm\ubd84 ss\ucd08 zzzz", "a hh\uc2dc mm\ubd84 ss\ucd08 z", "a h:mm:ss", "a h:mm"], AVAILABLEFORMATS:{Md:"M. d.", MMMMd:"MMMM d\uc77c", MMMd:"MMM d\uc77c"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_ln = {ERAS:["libos\u00f3 ya Y.-K.", "nsima ya Y.-K."], ERANAMES:["libos\u00f3 ya Y.-K.", "nsima ya Y.-K."], NARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], STANDALONENARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], MONTHS:["s\u00e1nz\u00e1 ya yambo", "s\u00e1nz\u00e1 ya m\u00edbal\u00e9", "s\u00e1nz\u00e1 ya m\u00eds\u00e1to", "s\u00e1nz\u00e1 ya m\u00ednei", "s\u00e1nz\u00e1 ya m\u00edt\u00e1no", "s\u00e1nz\u00e1 ya mot\u00f3b\u00e1", 
"s\u00e1nz\u00e1 ya nsambo", "s\u00e1nz\u00e1 ya mwambe", "s\u00e1nz\u00e1 ya libwa", "s\u00e1nz\u00e1 ya z\u00f3mi", "s\u00e1nz\u00e1 ya z\u00f3mi na m\u0254\u030ck\u0254\u0301", "s\u00e1nz\u00e1 ya z\u00f3mi na m\u00edbal\u00e9"], STANDALONEMONTHS:["s\u00e1nz\u00e1 ya yambo", "s\u00e1nz\u00e1 ya m\u00edbal\u00e9", "s\u00e1nz\u00e1 ya m\u00eds\u00e1to", "s\u00e1nz\u00e1 ya m\u00ednei", "s\u00e1nz\u00e1 ya m\u00edt\u00e1no", "s\u00e1nz\u00e1 ya mot\u00f3b\u00e1", "s\u00e1nz\u00e1 ya nsambo", "s\u00e1nz\u00e1 ya mwambe", 
"s\u00e1nz\u00e1 ya libwa", "s\u00e1nz\u00e1 ya z\u00f3mi", "s\u00e1nz\u00e1 ya z\u00f3mi na m\u0254\u030ck\u0254\u0301", "s\u00e1nz\u00e1 ya z\u00f3mi na m\u00edbal\u00e9"], SHORTMONTHS:["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12"], STANDALONESHORTMONTHS:["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12"], WEEKDAYS:["eyenga", "mok\u0254l\u0254 ya libos\u00f3", "mok\u0254l\u0254 ya m\u00edbal\u00e9", "mok\u0254l\u0254 ya m\u00eds\u00e1to", "mok\u0254l\u0254 ya m\u00edn\u00e9i", 
"mok\u0254l\u0254 ya m\u00edt\u00e1no", "mp\u0254\u0301s\u0254"], STANDALONEWEEKDAYS:["eyenga", "mok\u0254l\u0254 ya libos\u00f3", "mok\u0254l\u0254 ya m\u00edbal\u00e9", "mok\u0254l\u0254 ya m\u00eds\u00e1to", "mok\u0254l\u0254 ya m\u00edn\u00e9i", "mok\u0254l\u0254 ya m\u00edt\u00e1no", "mp\u0254\u0301s\u0254"], SHORTWEEKDAYS:["eye", "m1", "m2", "m3", "m4", "m5", "mps"], STANDALONESHORTWEEKDAYS:["eye", "m1", "m2", "m3", "m4", "m5", "mps"], NARROWWEEKDAYS:["1", "2", "3", "4", "5", "6", "7"], STANDALONENARROWWEEKDAYS:["1", 
"2", "3", "4", "5", "6", "7"], SHORTQUARTERS:["SM1", "SM2", "SM3", "SM4"], QUARTERS:["s\u00e1nz\u00e1 m\u00eds\u00e1to ya yambo", "s\u00e1nz\u00e1 m\u00eds\u00e1to ya m\u00edbal\u00e9", "s\u00e1nz\u00e1 m\u00eds\u00e1to ya m\u00eds\u00e1to", "s\u00e1nz\u00e1 m\u00eds\u00e1to ya m\u00ednei"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, y MMMM dd", "y MMMM d", "y MMM d", "yy/MM/dd"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"MMMM d", MMMd:"MMM d"}, 
FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_lt = {ERAS:["pr. Kr.", "po Kr."], ERANAMES:["prie\u0161 Krist\u0173", "po Kristaus"], NARROWMONTHS:["S", "V", "K", "B", "G", "B", "L", "R", "R", "S", "L", "G"], STANDALONENARROWMONTHS:["S", "V", "K", "B", "G", "B", "L", "R", "R", "S", "L", "G"], MONTHS:["sausio", "vasario", "kovo", "baland\u017eio", "gegu\u017e\u0117s", "bir\u017eelio", "liepos", "rugpj\u016b\u010dio", "rugs\u0117jo", "spalio", "lapkri\u010dio", "gruod\u017eio"], STANDALONEMONTHS:["Sausis", "Vasaris", "Kovas", 
"Balandis", "Gegu\u017e\u0117", "Bir\u017eelis", "Liepa", "Rugpj\u016btis", "Rugs\u0117jis", "Spalis", "Lapkritis", "Gruodis"], SHORTMONTHS:["Sau", "Vas", "Kov", "Bal", "Geg", "Bir", "Lie", "Rgp", "Rgs", "Spl", "Lap", "Grd"], STANDALONESHORTMONTHS:["Sau", "Vas", "Kov", "Bal", "Geg", "Bir", "Lie", "Rgp", "Rgs", "Spl", "Lap", "Grd"], WEEKDAYS:["sekmadienis", "pirmadienis", "antradienis", "tre\u010diadienis", "ketvirtadienis", "penktadienis", "\u0161e\u0161tadienis"], STANDALONEWEEKDAYS:["sekmadienis", 
"pirmadienis", "antradienis", "tre\u010diadienis", "ketvirtadienis", "penktadienis", "\u0161e\u0161tadienis"], SHORTWEEKDAYS:["Sk", "Pr", "An", "Tr", "Kt", "Pn", "\u0160t"], STANDALONESHORTWEEKDAYS:["Sk", "Pr", "An", "Tr", "Kt", "Pn", "\u0160t"], NARROWWEEKDAYS:["S", "P", "A", "T", "K", "P", "\u0160"], STANDALONENARROWWEEKDAYS:["S", "P", "A", "T", "K", "P", "\u0160"], SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["pirmas ketvirtis", "antras ketvirtis", "tre\u010dias ketvirtis", "ketvirtas ketvirtis"], 
AMPMS:["prie\u0161piet", "popiet"], DATEFORMATS:["y 'm'. MMMM d 'd'.,EEEE", "y 'm'. MMMM d 'd'.", "yyyy.MM.dd", "yyyy-MM-dd"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"MMMM d", MMMd:"MMM d"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_lv = {ERAS:["p.m.\u0113.", "m.\u0113."], ERANAMES:["pirms m\u016bsu \u0113ras", "m\u016bsu \u0113r\u0101"], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["janv\u0101ris", "febru\u0101ris", "marts", "apr\u012blis", "maijs", "j\u016bnijs", "j\u016blijs", "augusts", "septembris", "oktobris", "novembris", "decembris"], STANDALONEMONTHS:["janv\u0101ris", "febru\u0101ris", 
"marts", "apr\u012blis", "maijs", "j\u016bnijs", "j\u016blijs", "augusts", "septembris", "oktobris", "novembris", "decembris"], SHORTMONTHS:["janv.", "febr.", "marts", "apr.", "maijs", "j\u016bn.", "j\u016bl.", "aug.", "sept.", "okt.", "nov.", "dec."], STANDALONESHORTMONTHS:["janv.", "febr.", "marts", "apr.", "maijs", "j\u016bn.", "j\u016bl.", "aug.", "sept.", "okt.", "nov.", "dec."], WEEKDAYS:["sv\u0113tdiena", "pirmdiena", "otrdiena", "tre\u0161diena", "ceturtdiena", "piektdiena", "sestdiena"], 
STANDALONEWEEKDAYS:["sv\u0113tdiena", "pirmdiena", "otrdiena", "tre\u0161diena", "ceturtdiena", "piektdiena", "sestdiena"], SHORTWEEKDAYS:["Sv", "Pr", "Ot", "Tr", "Ce", "Pk", "Se"], STANDALONESHORTWEEKDAYS:["Sv", "Pr", "Ot", "Tr", "Ce", "Pk", "Se"], NARROWWEEKDAYS:["S", "P", "O", "T", "C", "P", "S"], STANDALONENARROWWEEKDAYS:["S", "P", "O", "T", "C", "P", "S"], SHORTQUARTERS:["C1", "C2", "C3", "C4"], QUARTERS:["1. ceturksnis", "2. ceturksnis", "3. ceturksnis", "4. ceturksnis"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE, y. 'gada' d. MMMM", "y. 'gada' d. MMMM", "y. 'gada' d. MMM", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"dd.mm.", MMMMd:"d. MMMM", MMMd:"d. MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_ml = {ERAS:["\u0d15\u0d4d\u0d30\u0d3f.\u0d2e\u0d41.", "\u0d15\u0d4d\u0d30\u0d3f.\u0d2a\u0d3f."], ERANAMES:["\u0d15\u0d4d\u0d30\u0d3f\u0d38\u0d4d\u0d24\u0d41\u0d35\u0d3f\u0d28\u0d41\u0d4d \u0d2e\u0d41\u0d2e\u0d4d\u0d2a\u0d4d", "\u0d15\u0d4d\u0d30\u0d3f\u0d38\u0d4d\u0d24\u0d41\u0d35\u0d3f\u0d28\u0d4d \u0d2a\u0d3f\u0d28\u0d4d\u0d2a\u0d4d"], NARROWMONTHS:["\u0d1c", "\u0d2b\u0d46", "\u0d2e\u0d3e", "\u0d0f", "\u0d2e\u0d47", "\u0d1c\u0d42", "\u0d1c\u0d42", "\u0d13", "\u0d38\u0d46", 
"\u0d12", "\u0d28", "\u0d21\u0d3f"], STANDALONENARROWMONTHS:["\u0d1c", "\u0d2b\u0d46", "\u0d2e\u0d3e", "\u0d0f", "\u0d2e\u0d47", "\u0d1c\u0d42", "\u0d1c\u0d42", "\u0d13", "\u0d38\u0d46", "\u0d12", "\u0d28", "\u0d21\u0d3f"], MONTHS:["\u0d1c\u0d28\u0d41\u0d35\u0d30\u0d3f", "\u0d2b\u0d46\u0d2c\u0d4d\u0d30\u0d41\u0d35\u0d30\u0d3f", "\u0d2e\u0d3e\u0d30\u0d4d\u0d1a\u0d4d\u0d1a\u0d4d", "\u0d0f\u0d2a\u0d4d\u0d30\u0d3f\u0d32\u0d4d", "\u0d2e\u0d47\u0d2f\u0d4d", "\u0d1c\u0d42\u0d23\u0d4d", "\u0d1c\u0d42\u0d32\u0d48", 
"\u0d13\u0d17\u0d38\u0d4d\u0d31\u0d4d\u0d31\u0d4d", "\u0d38\u0d46\u0d2a\u0d4d\u0d31\u0d4d\u0d31\u0d02\u0d2c\u0d30\u0d4d", "\u0d12\u0d15\u0d4d\u0d1f\u0d4b\u0d2c\u0d30\u0d4d", "\u0d28\u0d35\u0d02\u0d2c\u0d30\u0d4d", "\u0d21\u0d3f\u0d38\u0d02\u0d2c\u0d30\u0d4d"], STANDALONEMONTHS:["\u0d1c\u0d28\u0d41\u0d35\u0d30\u0d3f", "\u0d2b\u0d46\u0d2c\u0d4d\u0d30\u0d41\u0d35\u0d30\u0d3f", "\u0d2e\u0d3e\u0d30\u0d4d\u0d1a\u0d4d\u0d1a\u0d4d", "\u0d0f\u0d2a\u0d4d\u0d30\u0d3f\u0d32\u0d4d", "\u0d2e\u0d47\u0d2f\u0d4d", 
"\u0d1c\u0d42\u0d23\u0d4d", "\u0d1c\u0d42\u0d32\u0d48", "\u0d13\u0d17\u0d38\u0d4d\u0d31\u0d4d\u0d31\u0d4d", "\u0d38\u0d46\u0d2a\u0d4d\u0d31\u0d4d\u0d31\u0d02\u0d2c\u0d30\u0d4d", "\u0d12\u0d15\u0d4d\u0d1f\u0d4b\u0d2c\u0d30\u0d4d", "\u0d28\u0d35\u0d02\u0d2c\u0d30\u0d4d", "\u0d21\u0d3f\u0d38\u0d02\u0d2c\u0d30\u0d4d"], SHORTMONTHS:["\u0d1c\u0d28\u0d41", "\u0d2b\u0d46\u0d2c\u0d4d\u0d30\u0d41", "\u0d2e\u0d3e\u0d30\u0d4d", "\u0d0f\u0d2a\u0d4d\u0d30\u0d3f", "\u0d2e\u0d47\u0d2f\u0d4d", "\u0d1c\u0d42\u0d23\u0d4d", 
"\u0d1c\u0d42\u0d32\u0d48", "\u0d13\u0d17", "\u0d38\u0d46\u0d2a\u0d4d\u0d31\u0d4d\u0d31\u0d02", "\u0d12\u0d15\u0d4d\u0d1f\u0d4b", "\u0d28\u0d35\u0d02", "\u0d21\u0d3f\u0d38\u0d02"], STANDALONESHORTMONTHS:["\u0d1c\u0d28\u0d41", "\u0d2b\u0d46\u0d2c\u0d4d\u0d30\u0d41", "\u0d2e\u0d3e\u0d30\u0d4d", "\u0d0f\u0d2a\u0d4d\u0d30\u0d3f", "\u0d2e\u0d47\u0d2f\u0d4d", "\u0d1c\u0d42\u0d23\u0d4d", "\u0d1c\u0d42\u0d32\u0d48", "\u0d13\u0d17", "\u0d38\u0d46\u0d2a\u0d4d\u0d31\u0d4d\u0d31\u0d02", "\u0d12\u0d15\u0d4d\u0d1f\u0d4b", 
"\u0d28\u0d35\u0d02", "\u0d21\u0d3f\u0d38\u0d02"], WEEKDAYS:["\u0d1e\u0d3e\u0d2f\u0d31\u0d3e\u0d34\u0d4d\u0d1a", "\u0d24\u0d3f\u0d19\u0d4d\u0d15\u0d33\u0d3e\u0d34\u0d4d\u0d1a", "\u0d1a\u0d4a\u0d35\u0d4d\u0d35\u0d3e\u0d34\u0d4d\u0d1a", "\u0d2c\u0d41\u0d27\u0d28\u0d3e\u0d34\u0d4d\u0d1a", "\u0d35\u0d4d\u0d2f\u0d3e\u0d34\u0d3e\u0d34\u0d4d\u0d1a", "\u0d35\u0d46\u0d33\u0d4d\u0d33\u0d3f\u0d2f\u0d3e\u0d34\u0d4d\u0d1a", "\u0d36\u0d28\u0d3f\u0d2f\u0d3e\u0d34\u0d4d\u0d1a"], STANDALONEWEEKDAYS:["\u0d1e\u0d3e\u0d2f\u0d31\u0d3e\u0d34\u0d4d\u0d1a", 
"\u0d24\u0d3f\u0d19\u0d4d\u0d15\u0d33\u0d3e\u0d34\u0d4d\u0d1a", "\u0d1a\u0d4a\u0d35\u0d4d\u0d35\u0d3e\u0d34\u0d4d\u0d1a", "\u0d2c\u0d41\u0d27\u0d28\u0d3e\u0d34\u0d4d\u0d1a", "\u0d35\u0d4d\u0d2f\u0d3e\u0d34\u0d3e\u0d34\u0d4d\u0d1a", "\u0d35\u0d46\u0d33\u0d4d\u0d33\u0d3f\u0d2f\u0d3e\u0d34\u0d4d\u0d1a", "\u0d36\u0d28\u0d3f\u0d2f\u0d3e\u0d34\u0d4d\u0d1a"], SHORTWEEKDAYS:["\u0d1e\u0d3e\u0d2f\u0d30\u0d4d", "\u0d24\u0d3f\u0d19\u0d4d\u0d15\u0d33\u0d4d", "\u0d1a\u0d4a\u0d35\u0d4d\u0d35", "\u0d2c\u0d41\u0d27\u0d28\u0d4d", 
"\u0d35\u0d4d\u0d2f\u0d3e\u0d34\u0d02", "\u0d35\u0d46\u0d33\u0d4d\u0d33\u0d3f", "\u0d36\u0d28\u0d3f"], STANDALONESHORTWEEKDAYS:["\u0d1e\u0d3e\u0d2f\u0d30\u0d4d", "\u0d24\u0d3f\u0d19\u0d4d\u0d15\u0d33\u0d4d", "\u0d1a\u0d4a\u0d35\u0d4d\u0d35", "\u0d2c\u0d41\u0d27\u0d28\u0d4d", "\u0d35\u0d4d\u0d2f\u0d3e\u0d34\u0d02", "\u0d35\u0d46\u0d33\u0d4d\u0d33\u0d3f", "\u0d36\u0d28\u0d3f"], NARROWWEEKDAYS:["\u0d1e\u0d3e", "\u0d24\u0d3f", "\u0d1a\u0d4a", "\u0d2c\u0d41", "\u0d35\u0d4d\u0d2f\u0d3e", "\u0d35\u0d46", 
"\u0d36"], STANDALONENARROWWEEKDAYS:["\u0d1e\u0d3e", "\u0d24\u0d3f", "\u0d1a\u0d4a", "\u0d2c\u0d41", "\u0d35\u0d4d\u0d2f\u0d3e", "\u0d35\u0d46", "\u0d36"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["\u0d12\u0d28\u0d4d\u0d28\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02", "\u0d30\u0d23\u0d4d\u0d1f\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02", "\u0d2e\u0d42\u0d28\u0d4d\u0d28\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02", "\u0d28\u0d3e\u0d32\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02"], AMPMS:["am", "pm"], DATEFORMATS:["y, MMMM d, EEEE", 
"y, MMMM d", "y, MMM d", "dd/MM/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], AVAILABLEFORMATS:{Md:"d/M", MMMMd:"MMMM d", MMMd:"MMM d"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_mo = {ERAS:["\u00ee.Hr.", "d.Hr."], ERANAMES:["\u00eenainte de Hristos", "dup\u0103 Hristos"], NARROWMONTHS:["I", "F", "M", "A", "M", "I", "I", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["I", "F", "M", "A", "M", "I", "I", "A", "S", "O", "N", "D"], MONTHS:["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"], STANDALONEMONTHS:["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", 
"iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"], SHORTMONTHS:["ian.", "feb.", "mar.", "apr.", "mai", "iun.", "iul.", "aug.", "sept.", "oct.", "nov.", "dec."], STANDALONESHORTMONTHS:["ian.", "feb.", "mar.", "apr.", "mai", "iun.", "iul.", "aug.", "sept.", "oct.", "nov.", "dec."], WEEKDAYS:["duminic\u0103", "luni", "mar\u021bi", "miercuri", "joi", "vineri", "s\u00e2mb\u0103t\u0103"], STANDALONEWEEKDAYS:["duminic\u0103", "luni", "mar\u021bi", "miercuri", "joi", "vineri", "s\u00e2mb\u0103t\u0103"], 
SHORTWEEKDAYS:["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "S\u00e2"], STANDALONESHORTWEEKDAYS:["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "S\u00e2"], NARROWWEEKDAYS:["D", "L", "M", "M", "J", "V", "S"], STANDALONENARROWWEEKDAYS:["D", "L", "M", "M", "J", "V", "S"], SHORTQUARTERS:["trim. I", "trim. II", "trim. III", "trim. IV"], QUARTERS:["trimestrul I", "trimestrul al II-lea", "trimestrul al III-lea", "trimestrul al IV-lea"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "dd.MM.yyyy", "dd.MM.yyyy"], 
TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d.M", MMMMd:"d MMMM", MMMd:"d MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_mr = {ERAS:["\u0908.\u0938.\u092a\u0942.", "\u0908.\u0938."], ERANAMES:["\u0908\u0938\u0935\u0940\u0938\u0928\u092a\u0942\u0930\u094d\u0935", "\u0908\u0938\u0935\u0940\u0938\u0928"], NARROWMONTHS:["\u091c\u093e", "\u092b\u0947", "\u092e\u093e", "\u090f", "\u092e\u0947", "\u091c\u0942", "\u091c\u0941", "\u0911", "\u0938", "\u0911", "\u0928\u094b", "\u0921\u093f"], STANDALONENARROWMONTHS:["\u091c\u093e", "\u092b\u0947", "\u092e\u093e", "\u090f", "\u092e\u0947", "\u091c\u0942", 
"\u091c\u0941", "\u0911", "\u0938", "\u0911", "\u0928\u094b", "\u0921\u093f"], MONTHS:["\u091c\u093e\u0928\u0947\u0935\u093e\u0930\u0940", "\u092b\u0947\u092c\u094d\u0930\u0941\u0935\u093e\u0930\u0940", "\u092e\u093e\u0930\u094d\u091a", "\u090f\u092a\u094d\u0930\u093f\u0932", "\u092e\u0947", "\u091c\u0942\u0928", "\u091c\u0941\u0932\u0948", "\u0911\u0917\u0938\u094d\u091f", "\u0938\u092a\u094d\u091f\u0947\u0902\u092c\u0930", "\u0911\u0915\u094d\u091f\u094b\u092c\u0930", "\u0928\u094b\u0935\u094d\u0939\u0947\u0902\u092c\u0930", 
"\u0921\u093f\u0938\u0947\u0902\u092c\u0930"], STANDALONEMONTHS:["\u091c\u093e\u0928\u0947\u0935\u093e\u0930\u0940", "\u092b\u0947\u092c\u094d\u0930\u0941\u0935\u093e\u0930\u0940", "\u092e\u093e\u0930\u094d\u091a", "\u090f\u092a\u094d\u0930\u093f\u0932", "\u092e\u0947", "\u091c\u0942\u0928", "\u091c\u0941\u0932\u0948", "\u0911\u0917\u0938\u094d\u091f", "\u0938\u092a\u094d\u091f\u0947\u0902\u092c\u0930", "\u0911\u0915\u094d\u091f\u094b\u092c\u0930", "\u0928\u094b\u0935\u094d\u0939\u0947\u0902\u092c\u0930", 
"\u0921\u093f\u0938\u0947\u0902\u092c\u0930"], SHORTMONTHS:["\u091c\u093e\u0928\u0947\u0935\u093e\u0930\u0940", "\u092b\u0947\u092c\u094d\u0930\u0941\u0935\u093e\u0930\u0940", "\u092e\u093e\u0930\u094d\u091a", "\u090f\u092a\u094d\u0930\u093f\u0932", "\u092e\u0947", "\u091c\u0942\u0928", "\u091c\u0941\u0932\u0948", "\u0911\u0917\u0938\u094d\u091f", "\u0938\u092a\u094d\u091f\u0947\u0902\u092c\u0930", "\u0911\u0915\u094d\u091f\u094b\u092c\u0930", "\u0928\u094b\u0935\u094d\u0939\u0947\u0902\u092c\u0930", 
"\u0921\u093f\u0938\u0947\u0902\u092c\u0930"], STANDALONESHORTMONTHS:["\u091c\u093e\u0928\u0947\u0935\u093e\u0930\u0940", "\u092b\u0947\u092c\u094d\u0930\u0941\u0935\u093e\u0930\u0940", "\u092e\u093e\u0930\u094d\u091a", "\u090f\u092a\u094d\u0930\u093f\u0932", "\u092e\u0947", "\u091c\u0942\u0928", "\u091c\u0941\u0932\u0948", "\u0911\u0917\u0938\u094d\u091f", "\u0938\u092a\u094d\u091f\u0947\u0902\u092c\u0930", "\u0911\u0915\u094d\u091f\u094b\u092c\u0930", "\u0928\u094b\u0935\u094d\u0939\u0947\u0902\u092c\u0930", 
"\u0921\u093f\u0938\u0947\u0902\u092c\u0930"], WEEKDAYS:["\u0930\u0935\u093f\u0935\u093e\u0930", "\u0938\u094b\u092e\u0935\u093e\u0930", "\u092e\u0902\u0917\u0933\u0935\u093e\u0930", "\u092c\u0941\u0927\u0935\u093e\u0930", "\u0917\u0941\u0930\u0941\u0935\u093e\u0930", "\u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930", "\u0936\u0928\u093f\u0935\u093e\u0930"], STANDALONEWEEKDAYS:["\u0930\u0935\u093f\u0935\u093e\u0930", "\u0938\u094b\u092e\u0935\u093e\u0930", "\u092e\u0902\u0917\u0933\u0935\u093e\u0930", 
"\u092c\u0941\u0927\u0935\u093e\u0930", "\u0917\u0941\u0930\u0941\u0935\u093e\u0930", "\u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930", "\u0936\u0928\u093f\u0935\u093e\u0930"], SHORTWEEKDAYS:["\u0930\u0935\u093f", "\u0938\u094b\u092e", "\u092e\u0902\u0917\u0933", "\u092c\u0941\u0927", "\u0917\u0941\u0930\u0941", "\u0936\u0941\u0915\u094d\u0930", "\u0936\u0928\u093f"], STANDALONESHORTWEEKDAYS:["\u0930\u0935\u093f", "\u0938\u094b\u092e", "\u092e\u0902\u0917\u0933", "\u092c\u0941\u0927", "\u0917\u0941\u0930\u0941", 
"\u0936\u0941\u0915\u094d\u0930", "\u0936\u0928\u093f"], NARROWWEEKDAYS:["\u0930", "\u0938\u094b", "\u092e\u0902", "\u092c\u0941", "\u0917\u0941", "\u0936\u0941", "\u0936"], STANDALONENARROWWEEKDAYS:["\u0930", "\u0938\u094b", "\u092e\u0902", "\u092c\u0941", "\u0917\u0941", "\u0936\u0941", "\u0936"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["\u092a\u094d\u0930\u0925\u092e \u0924\u093f\u092e\u093e\u0939\u0940", "\u0926\u094d\u0935\u093f\u0924\u0940\u092f \u0924\u093f\u092e\u093e\u0939\u0940", 
"\u0924\u0943\u0924\u0940\u092f \u0924\u093f\u092e\u093e\u0939\u0940", "\u091a\u0924\u0941\u0930\u094d\u0925 \u0924\u093f\u092e\u093e\u0939\u0940"], AMPMS:["am", "pm"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "d-M-yy"], TIMEFORMATS:["h-mm-ss a zzzz", "h-mm-ss a z", "h-mm-ss a", "h-mm a"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"d MMMM", MMMd:"MMM d"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_ms = {ERAS:["S.M.", "T.M."], ERANAMES:["S.M.", "T.M."], NARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], STANDALONENARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], MONTHS:["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"], STANDALONEMONTHS:["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"], 
SHORTMONTHS:["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogos", "Sep", "Okt", "Nov", "Dis"], STANDALONESHORTMONTHS:["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogos", "Sep", "Okt", "Nov", "Dis"], WEEKDAYS:["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"], STANDALONEWEEKDAYS:["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"], SHORTWEEKDAYS:["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"], STANDALONESHORTWEEKDAYS:["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"], 
NARROWWEEKDAYS:["1", "2", "3", "4", "5", "6", "7"], STANDALONENARROWWEEKDAYS:["1", "2", "3", "4", "5", "6", "7"], SHORTQUARTERS:["S1", "S2", "S3", "S4"], QUARTERS:["suku pertama", "suku kedua", "suku ketiga", "suku keempat"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE dd MMM y", "dd MMMM y", "dd MMM y", "dd/MM/yyyy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"MMMM d", MMMd:"MMM d"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_mt = {ERAS:["QK", "WK"], ERANAMES:["Qabel Kristu", "Wara Kristu"], NARROWMONTHS:["J", "F", "M", "A", "M", "\u0120", "L", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "\u0120", "L", "A", "S", "O", "N", "D"], MONTHS:["Jannar", "Frar", "Marzu", "April", "Mejju", "\u0120unju", "Lulju", "Awwissu", "Settembru", "Ottubru", "Novembru", "Di\u010bembru"], STANDALONEMONTHS:["Jannar", "Frar", "Marzu", "April", "Mejju", "\u0120unju", "Lulju", "Awwissu", 
"Settembru", "Ottubru", "Novembru", "Di\u010bembru"], SHORTMONTHS:["Jan", "Fra", "Mar", "Apr", "Mej", "\u0120un", "Lul", "Aww", "Set", "Ott", "Nov", "Di\u010b"], STANDALONESHORTMONTHS:["Jan", "Fra", "Mar", "Apr", "Mej", "\u0120un", "Lul", "Aww", "Set", "Ott", "Nov", "Di\u010b"], WEEKDAYS:["Il-\u0126add", "It-Tnejn", "It-Tlieta", "L-Erbg\u0127a", "Il-\u0126amis", "Il-\u0120img\u0127a", "Is-Sibt"], STANDALONEWEEKDAYS:["Il-\u0126add", "It-Tnejn", "It-Tlieta", "L-Erbg\u0127a", "Il-\u0126amis", "Il-\u0120img\u0127a", 
"Is-Sibt"], SHORTWEEKDAYS:["\u0126ad", "Tne", "Tli", "Erb", "\u0126am", "\u0120im", "Sib"], STANDALONESHORTWEEKDAYS:["\u0126ad", "Tne", "Tli", "Erb", "\u0126am", "\u0120im", "Sib"], NARROWWEEKDAYS:["\u0126", "T", "T", "E", "\u0126", "\u0120", "S"], STANDALONENARROWWEEKDAYS:["\u0126", "T", "T", "E", "\u0126", "\u0120", "S"], SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["K1", "K2", "K3", "K4"], AMPMS:["QN", "WN"], DATEFORMATS:["EEEE, d 'ta'\u2019 MMMM y", "d 'ta'\u2019 MMMM y", "dd MMM y", "dd/MM/yyyy"], 
TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"d 'ta'\u2019 MMMM", MMMd:"MMM d"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_nl = {ERAS:["v. Chr.", "n. Chr."], ERANAMES:["Voor Christus", "Anno Domini"], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"], STANDALONEMONTHS:["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", 
"oktober", "november", "december"], SHORTMONTHS:["jan.", "feb.", "mrt.", "apr.", "mei", "jun.", "jul.", "aug.", "sep.", "okt.", "nov.", "dec."], STANDALONESHORTMONTHS:["jan.", "feb.", "mrt.", "apr.", "mei", "jun.", "jul.", "aug.", "sep.", "okt.", "nov.", "dec."], WEEKDAYS:["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"], STANDALONEWEEKDAYS:["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"], SHORTWEEKDAYS:["zo", "ma", "di", "wo", "do", 
"vr", "za"], STANDALONESHORTWEEKDAYS:["zo", "ma", "di", "wo", "do", "vr", "za"], NARROWWEEKDAYS:["Z", "M", "D", "W", "D", "V", "Z"], STANDALONENARROWWEEKDAYS:["Z", "M", "D", "W", "D", "V", "Z"], SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1e kwartaal", "2e kwartaal", "3e kwartaal", "4e kwartaal"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "dd-MM-yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d-M", MMMMd:"d MMMM", 
MMMd:"d-MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_no = {ERAS:["f.Kr.", "e.Kr."], ERANAMES:["f.Kr.", "e.Kr."], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"], STANDALONEMONTHS:["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"], 
SHORTMONTHS:["jan.", "feb.", "mars", "apr.", "mai", "juni", "juli", "aug.", "sep.", "okt.", "nov.", "des."], STANDALONESHORTMONTHS:["jan.", "feb.", "mars", "apr.", "mai", "juni", "juli", "aug.", "sep.", "okt.", "nov.", "des."], WEEKDAYS:["s\u00f8ndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "l\u00f8rdag"], STANDALONEWEEKDAYS:["s\u00f8ndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "l\u00f8rdag"], SHORTWEEKDAYS:["s\u00f8n.", "man.", "tir.", "ons.", "tor.", "fre.", "l\u00f8r."], 
STANDALONESHORTWEEKDAYS:["s\u00f8n.", "man.", "tir.", "ons.", "tor.", "fre.", "l\u00f8r."], NARROWWEEKDAYS:["S", "M", "T", "O", "T", "F", "L"], STANDALONENARROWWEEKDAYS:["S", "M", "T", "O", "T", "F", "L"], SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d. MMMM y", "d. MMMM y", "d. MMM y", "dd.MM.yy"], TIMEFORMATS:["'kl'. HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], AVAILABLEFORMATS:{Md:"d.M.", 
MMMMd:"d. MMMM", MMMd:"d. MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_or = {ERAS:["BCE", "CE"], ERANAMES:["BCE", "CE"], NARROWMONTHS:["\u0b1c\u0b3e", "\u0b2b\u0b47", "\u0b2e\u0b3e", "\u0b05", "\u0b2e\u0b47", "\u0b1c\u0b41", "\u0b1c\u0b41", "\u0b05", "\u0b38\u0b47", "\u0b05", "\u0b28", "\u0b21\u0b3f"], STANDALONENARROWMONTHS:["\u0b1c\u0b3e", "\u0b2b\u0b47", "\u0b2e\u0b3e", "\u0b05", "\u0b2e\u0b47", "\u0b1c\u0b41", "\u0b1c\u0b41", "\u0b05", "\u0b38\u0b47", "\u0b05", "\u0b28", "\u0b21\u0b3f"], MONTHS:["\u0b1c\u0b3e\u0b28\u0b41\u0b06\u0b30\u0b40", 
"\u0b2b\u0b47\u0b2c\u0b4d\u0b30\u0b41\u0b5f\u0b3e\u0b30\u0b40", "\u0b2e\u0b3e\u0b30\u0b4d\u0b1a\u0b4d\u0b1a", "\u0b05\u0b2a\u0b4d\u0b30\u0b47\u0b32", "\u0b2e\u0b47", "\u0b1c\u0b41\u0b28", "\u0b1c\u0b41\u0b32\u0b3e\u0b07", "\u0b05\u0b17\u0b37\u0b4d\u0b1f", "\u0b38\u0b47\u0b2a\u0b4d\u0b1f\u0b47\u0b2e\u0b4d\u0b2c\u0b30", "\u0b05\u0b15\u0b4d\u0b1f\u0b4b\u0b2c\u0b30", "\u0b28\u0b2d\u0b47\u0b2e\u0b4d\u0b2c\u0b30", "\u0b21\u0b3f\u0b38\u0b47\u0b2e\u0b4d\u0b2c\u0b30"], STANDALONEMONTHS:["\u0b1c\u0b3e\u0b28\u0b41\u0b06\u0b30\u0b40", 
"\u0b2b\u0b47\u0b2c\u0b4d\u0b30\u0b41\u0b5f\u0b3e\u0b30\u0b40", "\u0b2e\u0b3e\u0b30\u0b4d\u0b1a\u0b4d\u0b1a", "\u0b05\u0b2a\u0b4d\u0b30\u0b47\u0b32", "\u0b2e\u0b47", "\u0b1c\u0b41\u0b28", "\u0b1c\u0b41\u0b32\u0b3e\u0b07", "\u0b05\u0b17\u0b37\u0b4d\u0b1f", "\u0b38\u0b47\u0b2a\u0b4d\u0b1f\u0b47\u0b2e\u0b4d\u0b2c\u0b30", "\u0b05\u0b15\u0b4d\u0b1f\u0b4b\u0b2c\u0b30", "\u0b28\u0b2d\u0b47\u0b2e\u0b4d\u0b2c\u0b30", "\u0b21\u0b3f\u0b38\u0b47\u0b2e\u0b4d\u0b2c\u0b30"], SHORTMONTHS:["\u0b1c\u0b3e\u0b28\u0b41\u0b06\u0b30\u0b40", 
"\u0b2b\u0b47\u0b2c\u0b4d\u0b30\u0b41\u0b5f\u0b3e\u0b30\u0b40", "\u0b2e\u0b3e\u0b30\u0b4d\u0b1a\u0b4d\u0b1a", "\u0b05\u0b2a\u0b4d\u0b30\u0b47\u0b32", "\u0b2e\u0b47", "\u0b1c\u0b41\u0b28", "\u0b1c\u0b41\u0b32\u0b3e\u0b07", "\u0b05\u0b17\u0b37\u0b4d\u0b1f", "\u0b38\u0b47\u0b2a\u0b4d\u0b1f\u0b47\u0b2e\u0b4d\u0b2c\u0b30", "\u0b05\u0b15\u0b4d\u0b1f\u0b4b\u0b2c\u0b30", "\u0b28\u0b2d\u0b47\u0b2e\u0b4d\u0b2c\u0b30", "\u0b21\u0b3f\u0b38\u0b47\u0b2e\u0b4d\u0b2c\u0b30"], STANDALONESHORTMONTHS:["\u0b1c\u0b3e\u0b28\u0b41\u0b06\u0b30\u0b40", 
"\u0b2b\u0b47\u0b2c\u0b4d\u0b30\u0b41\u0b5f\u0b3e\u0b30\u0b40", "\u0b2e\u0b3e\u0b30\u0b4d\u0b1a\u0b4d\u0b1a", "\u0b05\u0b2a\u0b4d\u0b30\u0b47\u0b32", "\u0b2e\u0b47", "\u0b1c\u0b41\u0b28", "\u0b1c\u0b41\u0b32\u0b3e\u0b07", "\u0b05\u0b17\u0b37\u0b4d\u0b1f", "\u0b38\u0b47\u0b2a\u0b4d\u0b1f\u0b47\u0b2e\u0b4d\u0b2c\u0b30", "\u0b05\u0b15\u0b4d\u0b1f\u0b4b\u0b2c\u0b30", "\u0b28\u0b2d\u0b47\u0b2e\u0b4d\u0b2c\u0b30", "\u0b21\u0b3f\u0b38\u0b47\u0b2e\u0b4d\u0b2c\u0b30"], WEEKDAYS:["\u0b30\u0b2c\u0b3f\u0b2c\u0b3e\u0b30", 
"\u0b38\u0b4b\u0b2e\u0b2c\u0b3e\u0b30", "\u0b2e\u0b19\u0b4d\u0b17\u0b33\u0b2c\u0b3e\u0b30", "\u0b2c\u0b41\u0b27\u0b2c\u0b3e\u0b30", "\u0b17\u0b41\u0b30\u0b41\u0b2c\u0b3e\u0b30", "\u0b36\u0b41\u0b15\u0b4d\u0b30\u0b2c\u0b3e\u0b30", "\u0b36\u0b28\u0b3f\u0b2c\u0b3e\u0b30"], STANDALONEWEEKDAYS:["\u0b30\u0b2c\u0b3f\u0b2c\u0b3e\u0b30", "\u0b38\u0b4b\u0b2e\u0b2c\u0b3e\u0b30", "\u0b2e\u0b19\u0b4d\u0b17\u0b33\u0b2c\u0b3e\u0b30", "\u0b2c\u0b41\u0b27\u0b2c\u0b3e\u0b30", "\u0b17\u0b41\u0b30\u0b41\u0b2c\u0b3e\u0b30", 
"\u0b36\u0b41\u0b15\u0b4d\u0b30\u0b2c\u0b3e\u0b30", "\u0b36\u0b28\u0b3f\u0b2c\u0b3e\u0b30"], SHORTWEEKDAYS:["\u0b30\u0b2c\u0b3f", "\u0b38\u0b4b\u0b2e", "\u0b2e\u0b19\u0b4d\u0b17\u0b33", "\u0b2c\u0b41\u0b27", "\u0b17\u0b41\u0b30\u0b41", "\u0b36\u0b41\u0b15\u0b4d\u0b30", "\u0b36\u0b28\u0b3f"], STANDALONESHORTWEEKDAYS:["\u0b30\u0b2c\u0b3f", "\u0b38\u0b4b\u0b2e", "\u0b2e\u0b19\u0b4d\u0b17\u0b33", "\u0b2c\u0b41\u0b27", "\u0b17\u0b41\u0b30\u0b41", "\u0b36\u0b41\u0b15\u0b4d\u0b30", "\u0b36\u0b28\u0b3f"], 
NARROWWEEKDAYS:["\u0b30", "\u0b38\u0b4b", "\u0b2e", "\u0b2c\u0b41", "\u0b17\u0b41", "\u0b36\u0b41", "\u0b36"], STANDALONENARROWWEEKDAYS:["\u0b30", "\u0b38\u0b4b", "\u0b2e", "\u0b2c\u0b41", "\u0b17\u0b41", "\u0b36\u0b41", "\u0b36"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Q1", "Q2", "Q3", "Q4"], AMPMS:["am", "pm"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "d-M-yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"MMMM d", 
MMMd:"MMM d"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_pl = {ERAS:["p.n.e.", "n.e."], ERANAMES:["p.n.e.", "n.e."], NARROWMONTHS:["s", "l", "m", "k", "m", "c", "l", "s", "w", "p", "l", "g"], STANDALONENARROWMONTHS:["s", "l", "m", "k", "m", "c", "l", "s", "w", "p", "l", "g"], MONTHS:["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "wrze\u015bnia", "pa\u017adziernika", "listopada", "grudnia"], STANDALONEMONTHS:["stycze\u0144", "luty", "marzec", "kwiecie\u0144", "maj", "czerwiec", "lipiec", "sierpie\u0144", 
"wrzesie\u0144", "pa\u017adziernik", "listopad", "grudzie\u0144"], SHORTMONTHS:["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "pa\u017a", "lis", "gru"], STANDALONESHORTMONTHS:["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "pa\u017a", "lis", "gru"], WEEKDAYS:["niedziela", "poniedzia\u0142ek", "wtorek", "\u015broda", "czwartek", "pi\u0105tek", "sobota"], STANDALONEWEEKDAYS:["niedziela", "poniedzia\u0142ek", "wtorek", "\u015broda", "czwartek", "pi\u0105tek", "sobota"], 
SHORTWEEKDAYS:["niedz.", "pon.", "wt.", "\u015br.", "czw.", "pt.", "sob."], STANDALONESHORTWEEKDAYS:["niedz.", "pon.", "wt.", "\u015br.", "czw.", "pt.", "sob."], NARROWWEEKDAYS:["N", "P", "W", "\u015a", "C", "P", "S"], STANDALONENARROWWEEKDAYS:["N", "P", "W", "\u015a", "C", "P", "S"], SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["I kwarta\u0142", "II kwarta\u0142", "III kwarta\u0142", "IV kwarta\u0142"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "dd-MM-yyyy", "dd-MM-yy"], 
TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d.M", MMMMd:"d MMMM", MMMd:"MMM d"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_pt = {ERAS:["a.C.", "d.C."], ERANAMES:["Antes de Cristo", "Ano do Senhor"], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["janeiro", "fevereiro", "mar\u00e7o", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"], STANDALONEMONTHS:["janeiro", "fevereiro", "mar\u00e7o", "abril", "maio", "junho", "julho", "agosto", 
"setembro", "outubro", "novembro", "dezembro"], SHORTMONTHS:["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"], STANDALONESHORTMONTHS:["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"], WEEKDAYS:["domingo", "segunda-feira", "ter\u00e7a-feira", "quarta-feira", "quinta-feira", "sexta-feira", "s\u00e1bado"], STANDALONEWEEKDAYS:["domingo", "segunda-feira", "ter\u00e7a-feira", "quarta-feira", "quinta-feira", "sexta-feira", "s\u00e1bado"], 
SHORTWEEKDAYS:["dom", "seg", "ter", "qua", "qui", "sex", "s\u00e1b"], STANDALONESHORTWEEKDAYS:["dom", "seg", "ter", "qua", "qui", "sex", "s\u00e1b"], NARROWWEEKDAYS:["D", "S", "T", "Q", "Q", "S", "S"], STANDALONENARROWWEEKDAYS:["D", "S", "T", "Q", "Q", "S", "S"], SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1\u00ba trimestre", "2\u00ba trimestre", "3\u00ba trimestre", "4\u00ba trimestre"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d 'de' MMMM 'de' y", "d 'de' MMMM 'de' y", "dd/MM/yyyy", "dd/MM/yy"], 
TIMEFORMATS:["HH'h'mm'min'ss's' zzzz", "HH'h'mm'min'ss's' z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d/M", MMMMd:"d 'de' MMMM", MMMd:"d 'de' MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_pt_BR = goog.i18n.DateTimeSymbols_pt;
goog.i18n.DateTimeSymbols_pt_PT = {ERAS:["a.C.", "d.C."], ERANAMES:["Antes de Cristo", "Ano do Senhor"], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["Janeiro", "Fevereiro", "Mar\u00e7o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], STANDALONEMONTHS:["Janeiro", "Fevereiro", "Mar\u00e7o", "Abril", "Maio", "Junho", "Julho", "Agosto", 
"Setembro", "Outubro", "Novembro", "Dezembro"], SHORTMONTHS:["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"], STANDALONESHORTMONTHS:["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"], WEEKDAYS:["domingo", "segunda-feira", "ter\u00e7a-feira", "quarta-feira", "quinta-feira", "sexta-feira", "s\u00e1bado"], STANDALONEWEEKDAYS:["domingo", "segunda-feira", "ter\u00e7a-feira", "quarta-feira", "quinta-feira", "sexta-feira", "s\u00e1bado"], 
SHORTWEEKDAYS:["dom", "seg", "ter", "qua", "qui", "sex", "s\u00e1b"], STANDALONESHORTWEEKDAYS:["dom", "seg", "ter", "qua", "qui", "sex", "s\u00e1b"], NARROWWEEKDAYS:["D", "S", "T", "Q", "Q", "S", "S"], STANDALONENARROWWEEKDAYS:["D", "S", "T", "Q", "Q", "S", "S"], SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1.\u00ba trimestre", "2.\u00ba trimestre", "3.\u00ba trimestre", "4.\u00ba trimestre"], AMPMS:["Antes do meio-dia", "Depois do meio-dia"], DATEFORMATS:["EEEE, d 'de' MMMM 'de' y", "d 'de' MMMM 'de' y", 
"d 'de' MMM 'de' yyyy", "dd/MM/yy"], TIMEFORMATS:["HH'h'mm'min'ss's' zzzz", "HH'h'mm'min'ss's' z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d/M", MMMMd:"d 'de' MMMM", MMMd:"d 'de' MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_ro = {ERAS:["\u00ee.Hr.", "d.Hr."], ERANAMES:["\u00eenainte de Hristos", "dup\u0103 Hristos"], NARROWMONTHS:["I", "F", "M", "A", "M", "I", "I", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["I", "F", "M", "A", "M", "I", "I", "A", "S", "O", "N", "D"], MONTHS:["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"], STANDALONEMONTHS:["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", 
"iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"], SHORTMONTHS:["ian.", "feb.", "mar.", "apr.", "mai", "iun.", "iul.", "aug.", "sept.", "oct.", "nov.", "dec."], STANDALONESHORTMONTHS:["ian.", "feb.", "mar.", "apr.", "mai", "iun.", "iul.", "aug.", "sept.", "oct.", "nov.", "dec."], WEEKDAYS:["duminic\u0103", "luni", "mar\u021bi", "miercuri", "joi", "vineri", "s\u00e2mb\u0103t\u0103"], STANDALONEWEEKDAYS:["duminic\u0103", "luni", "mar\u021bi", "miercuri", "joi", "vineri", "s\u00e2mb\u0103t\u0103"], 
SHORTWEEKDAYS:["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "S\u00e2"], STANDALONESHORTWEEKDAYS:["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "S\u00e2"], NARROWWEEKDAYS:["D", "L", "M", "M", "J", "V", "S"], STANDALONENARROWWEEKDAYS:["D", "L", "M", "M", "J", "V", "S"], SHORTQUARTERS:["trim. I", "trim. II", "trim. III", "trim. IV"], QUARTERS:["trimestrul I", "trimestrul al II-lea", "trimestrul al III-lea", "trimestrul al IV-lea"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "dd.MM.yyyy", "dd.MM.yyyy"], 
TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d.M", MMMMd:"d MMMM", MMMd:"d MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_ru = {ERAS:["\u0434\u043e \u043d.\u044d.", "\u043d.\u044d."], ERANAMES:["\u0434\u043e \u043d.\u044d.", "\u043d.\u044d."], NARROWMONTHS:["\u042f", "\u0424", "\u041c", "\u0410", "\u041c", "\u0418", "\u0418", "\u0410", "\u0421", "\u041e", "\u041d", "\u0414"], STANDALONENARROWMONTHS:["\u042f", "\u0424", "\u041c", "\u0410", "\u041c", "\u0418", "\u0418", "\u0410", "\u0421", "\u041e", "\u041d", "\u0414"], MONTHS:["\u044f\u043d\u0432\u0430\u0440\u044f", "\u0444\u0435\u0432\u0440\u0430\u043b\u044f", 
"\u043c\u0430\u0440\u0442\u0430", "\u0430\u043f\u0440\u0435\u043b\u044f", "\u043c\u0430\u044f", "\u0438\u044e\u043d\u044f", "\u0438\u044e\u043b\u044f", "\u0430\u0432\u0433\u0443\u0441\u0442\u0430", "\u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044f", "\u043e\u043a\u0442\u044f\u0431\u0440\u044f", "\u043d\u043e\u044f\u0431\u0440\u044f", "\u0434\u0435\u043a\u0430\u0431\u0440\u044f"], STANDALONEMONTHS:["\u042f\u043d\u0432\u0430\u0440\u044c", "\u0424\u0435\u0432\u0440\u0430\u043b\u044c", "\u041c\u0430\u0440\u0442", 
"\u0410\u043f\u0440\u0435\u043b\u044c", "\u041c\u0430\u0439", "\u0418\u044e\u043d\u044c", "\u0418\u044e\u043b\u044c", "\u0410\u0432\u0433\u0443\u0441\u0442", "\u0421\u0435\u043d\u0442\u044f\u0431\u0440\u044c", "\u041e\u043a\u0442\u044f\u0431\u0440\u044c", "\u041d\u043e\u044f\u0431\u0440\u044c", "\u0414\u0435\u043a\u0430\u0431\u0440\u044c"], SHORTMONTHS:["\u044f\u043d\u0432.", "\u0444\u0435\u0432\u0440.", "\u043c\u0430\u0440\u0442\u0430", "\u0430\u043f\u0440.", "\u043c\u0430\u044f", "\u0438\u044e\u043d\u044f", 
"\u0438\u044e\u043b\u044f", "\u0430\u0432\u0433.", "\u0441\u0435\u043d\u0442.", "\u043e\u043a\u0442.", "\u043d\u043e\u044f\u0431.", "\u0434\u0435\u043a."], STANDALONESHORTMONTHS:["\u044f\u043d\u0432.", "\u0444\u0435\u0432\u0440.", "\u043c\u0430\u0440\u0442", "\u0430\u043f\u0440.", "\u043c\u0430\u0439", "\u0438\u044e\u043d\u044c", "\u0438\u044e\u043b\u044c", "\u0430\u0432\u0433.", "\u0441\u0435\u043d\u0442.", "\u043e\u043a\u0442.", "\u043d\u043e\u044f\u0431.", "\u0434\u0435\u043a."], WEEKDAYS:["\u0432\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435", 
"\u043f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a", "\u0432\u0442\u043e\u0440\u043d\u0438\u043a", "\u0441\u0440\u0435\u0434\u0430", "\u0447\u0435\u0442\u0432\u0435\u0440\u0433", "\u043f\u044f\u0442\u043d\u0438\u0446\u0430", "\u0441\u0443\u0431\u0431\u043e\u0442\u0430"], STANDALONEWEEKDAYS:["\u0412\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435", "\u041f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a", "\u0412\u0442\u043e\u0440\u043d\u0438\u043a", "\u0421\u0440\u0435\u0434\u0430", 
"\u0427\u0435\u0442\u0432\u0435\u0440\u0433", "\u041f\u044f\u0442\u043d\u0438\u0446\u0430", "\u0421\u0443\u0431\u0431\u043e\u0442\u0430"], SHORTWEEKDAYS:["\u0412\u0441", "\u041f\u043d", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041f\u0442", "\u0421\u0431"], STANDALONESHORTWEEKDAYS:["\u0412\u0441", "\u041f\u043d", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041f\u0442", "\u0421\u0431"], NARROWWEEKDAYS:["\u0412", "\u041f", "\u0412", "\u0421", "\u0427", "\u041f", "\u0421"], STANDALONENARROWWEEKDAYS:["\u0412", 
"\u041f", "\u0412", "\u0421", "\u0427", "\u041f", "\u0421"], SHORTQUARTERS:["1-\u0439 \u043a\u0432.", "2-\u0439 \u043a\u0432.", "3-\u0439 \u043a\u0432.", "4-\u0439 \u043a\u0432."], QUARTERS:["1-\u0439 \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "2-\u0439 \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "3-\u0439 \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "4-\u0439 \u043a\u0432\u0430\u0440\u0442\u0430\u043b"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y '\u0433'.", "d MMMM y '\u0433'.", "dd.MM.yyyy", 
"dd.MM.yy"], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], AVAILABLEFORMATS:{Md:"d.M", MMMMd:"d MMMM", MMMd:"d MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_sk = {ERAS:["pred n.l.", "n.l."], ERANAMES:["pred n.l.", "n.l."], NARROWMONTHS:["j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"], STANDALONENARROWMONTHS:["j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"], MONTHS:["janu\u00e1ra", "febru\u00e1ra", "marca", "apr\u00edla", "m\u00e1ja", "j\u00fana", "j\u00fala", "augusta", "septembra", "okt\u00f3bra", "novembra", "decembra"], STANDALONEMONTHS:["janu\u00e1r", "febru\u00e1r", "marec", "apr\u00edl", "m\u00e1j", 
"j\u00fan", "j\u00fal", "august", "september", "okt\u00f3ber", "november", "december"], SHORTMONTHS:["jan", "feb", "mar", "apr", "m\u00e1j", "j\u00fan", "j\u00fal", "aug", "sep", "okt", "nov", "dec"], STANDALONESHORTMONTHS:["jan", "feb", "mar", "apr", "m\u00e1j", "j\u00fan", "j\u00fal", "aug", "sep", "okt", "nov", "dec"], WEEKDAYS:["nede\u013ea", "pondelok", "utorok", "streda", "\u0161tvrtok", "piatok", "sobota"], STANDALONEWEEKDAYS:["nede\u013ea", "pondelok", "utorok", "streda", "\u0161tvrtok", 
"piatok", "sobota"], SHORTWEEKDAYS:["ne", "po", "ut", "st", "\u0161t", "pi", "so"], STANDALONESHORTWEEKDAYS:["ne", "po", "ut", "st", "\u0161t", "pi", "so"], NARROWWEEKDAYS:["N", "P", "U", "S", "\u0160", "P", "S"], STANDALONENARROWWEEKDAYS:["N", "P", "U", "S", "\u0160", "P", "S"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1. \u0161tvr\u0165rok", "2. \u0161tvr\u0165rok", "3. \u0161tvr\u0165rok", "4. \u0161tvr\u0165rok"], AMPMS:["dopoludnia", "popoludn\u00ed"], DATEFORMATS:["EEEE, d. MMMM y", 
"d. MMMM y", "d.M.yyyy", "d.M.yyyy"], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], AVAILABLEFORMATS:{Md:"d.M.", MMMMd:"d. MMMM", MMMd:"d. MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_sl = {ERAS:["pr. n. \u0161t.", "po Kr."], ERANAMES:["pred na\u0161im \u0161tetjem", "na\u0161e \u0161tetje"], NARROWMONTHS:["j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"], STANDALONENARROWMONTHS:["j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"], MONTHS:["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december"], STANDALONEMONTHS:["januar", "februar", "marec", "april", "maj", "junij", "julij", 
"avgust", "september", "oktober", "november", "december"], SHORTMONTHS:["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec"], STANDALONESHORTMONTHS:["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec"], WEEKDAYS:["nedelja", "ponedeljek", "torek", "sreda", "\u010detrtek", "petek", "sobota"], STANDALONEWEEKDAYS:["nedelja", "ponedeljek", "torek", "sreda", "\u010detrtek", "petek", "sobota"], SHORTWEEKDAYS:["ned", "pon", "tor", "sre", "\u010det", 
"pet", "sob"], STANDALONESHORTWEEKDAYS:["ned", "pon", "tor", "sre", "\u010det", "pet", "sob"], NARROWWEEKDAYS:["n", "p", "t", "s", "\u010d", "p", "s"], STANDALONENARROWWEEKDAYS:["n", "p", "t", "s", "\u010d", "p", "s"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1. \u010detrtletje", "2. \u010detrtletje", "3. \u010detrtletje", "4. \u010detrtletje"], AMPMS:["dop.", "pop."], DATEFORMATS:["EEEE, dd. MMMM y", "dd. MMMM y", "d. MMM. yyyy", "d. MM. yy"], TIMEFORMATS:["H:mm:ss zzzz", "HH:mm:ss z", 
"HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d. M.", MMMMd:"d. MMMM", MMMd:"MMM d"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_sq = {ERAS:["p.e.r.", "n.e.r."], ERANAMES:["p.e.r.", "n.e.r."], NARROWMONTHS:["J", "S", "M", "P", "M", "Q", "K", "G", "S", "T", "N", "D"], STANDALONENARROWMONTHS:["J", "S", "M", "P", "M", "Q", "K", "G", "S", "T", "N", "D"], MONTHS:["janar", "shkurt", "mars", "prill", "maj", "qershor", "korrik", "gusht", "shtator", "tetor", "n\u00ebntor", "dhjetor"], STANDALONEMONTHS:["janar", "shkurt", "mars", "prill", "maj", "qershor", "korrik", "gusht", "shtator", "tetor", "n\u00ebntor", 
"dhjetor"], SHORTMONTHS:["Jan", "Shk", "Mar", "Pri", "Maj", "Qer", "Kor", "Gsh", "Sht", "Tet", "N\u00ebn", "Dhj"], STANDALONESHORTMONTHS:["Jan", "Shk", "Mar", "Pri", "Maj", "Qer", "Kor", "Gsh", "Sht", "Tet", "N\u00ebn", "Dhj"], WEEKDAYS:["e diel", "e h\u00ebn\u00eb", "e mart\u00eb", "e m\u00ebrkur\u00eb", "e enjte", "e premte", "e shtun\u00eb"], STANDALONEWEEKDAYS:["e diel", "e h\u00ebn\u00eb", "e mart\u00eb", "e m\u00ebrkur\u00eb", "e enjte", "e premte", "e shtun\u00eb"], SHORTWEEKDAYS:["Die", "H\u00ebn", 
"Mar", "M\u00ebr", "Enj", "Pre", "Sht"], STANDALONESHORTWEEKDAYS:["Die", "H\u00ebn", "Mar", "M\u00ebr", "Enj", "Pre", "Sht"], NARROWWEEKDAYS:["D", "H", "M", "M", "E", "P", "S"], STANDALONENARROWWEEKDAYS:["D", "H", "M", "M", "E", "P", "S"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Q1", "Q2", "Q3", "Q4"], AMPMS:["PD", "MD"], DATEFORMATS:["EEEE, dd MMMM y", "dd MMMM y", "yyyy-MM-dd", "yy-MM-dd"], TIMEFORMATS:["h.mm.ss.a zzzz", "h.mm.ss.a z", "h.mm.ss.a", "h.mm.a"], AVAILABLEFORMATS:{Md:"M-d", 
MMMMd:"d MMMM", MMMd:"d MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_sr = {ERAS:["\u043f. \u043d. \u0435.", "\u043d. \u0435"], ERANAMES:["\u041f\u0440\u0435 \u043d\u043e\u0432\u0435 \u0435\u0440\u0435", "\u041d\u043e\u0432\u0435 \u0435\u0440\u0435"], NARROWMONTHS:["\u0458", "\u0444", "\u043c", "\u0430", "\u043c", "\u0458", "\u0458", "\u0430", "\u0441", "\u043e", "\u043d", "\u0434"], STANDALONENARROWMONTHS:["\u0458", "\u0444", "\u043c", "\u0430", "\u043c", "\u0458", "\u0458", "\u0430", "\u0441", "\u043e", "\u043d", "\u0434"], MONTHS:["\u0458\u0430\u043d\u0443\u0430\u0440", 
"\u0444\u0435\u0431\u0440\u0443\u0430\u0440", "\u043c\u0430\u0440\u0442", "\u0430\u043f\u0440\u0438\u043b", "\u043c\u0430\u0458", "\u0458\u0443\u043d", "\u0458\u0443\u043b", "\u0430\u0432\u0433\u0443\u0441\u0442", "\u0441\u0435\u043f\u0442\u0435\u043c\u0431\u0430\u0440", "\u043e\u043a\u0442\u043e\u0431\u0430\u0440", "\u043d\u043e\u0432\u0435\u043c\u0431\u0430\u0440", "\u0434\u0435\u0446\u0435\u043c\u0431\u0430\u0440"], STANDALONEMONTHS:["\u0458\u0430\u043d\u0443\u0430\u0440", "\u0444\u0435\u0431\u0440\u0443\u0430\u0440", 
"\u043c\u0430\u0440\u0442", "\u0430\u043f\u0440\u0438\u043b", "\u043c\u0430\u0458", "\u0458\u0443\u043d", "\u0458\u0443\u043b", "\u0430\u0432\u0433\u0443\u0441\u0442", "\u0441\u0435\u043f\u0442\u0435\u043c\u0431\u0430\u0440", "\u043e\u043a\u0442\u043e\u0431\u0430\u0440", "\u043d\u043e\u0432\u0435\u043c\u0431\u0430\u0440", "\u0434\u0435\u0446\u0435\u043c\u0431\u0430\u0440"], SHORTMONTHS:["\u0458\u0430\u043d", "\u0444\u0435\u0431", "\u043c\u0430\u0440", "\u0430\u043f\u0440", "\u043c\u0430\u0458", "\u0458\u0443\u043d", 
"\u0458\u0443\u043b", "\u0430\u0432\u0433", "\u0441\u0435\u043f", "\u043e\u043a\u0442", "\u043d\u043e\u0432", "\u0434\u0435\u0446"], STANDALONESHORTMONTHS:["\u0458\u0430\u043d", "\u0444\u0435\u0431", "\u043c\u0430\u0440", "\u0430\u043f\u0440", "\u043c\u0430\u0458", "\u0458\u0443\u043d", "\u0458\u0443\u043b", "\u0430\u0432\u0433", "\u0441\u0435\u043f", "\u043e\u043a\u0442", "\u043d\u043e\u0432", "\u0434\u0435\u0446"], WEEKDAYS:["\u043d\u0435\u0434\u0435\u0459\u0430", "\u043f\u043e\u043d\u0435\u0434\u0435\u0459\u0430\u043a", 
"\u0443\u0442\u043e\u0440\u0430\u043a", "\u0441\u0440\u0435\u0434\u0430", "\u0447\u0435\u0442\u0432\u0440\u0442\u0430\u043a", "\u043f\u0435\u0442\u0430\u043a", "\u0441\u0443\u0431\u043e\u0442\u0430"], STANDALONEWEEKDAYS:["\u043d\u0435\u0434\u0435\u0459\u0430", "\u043f\u043e\u043d\u0435\u0434\u0435\u0459\u0430\u043a", "\u0443\u0442\u043e\u0440\u0430\u043a", "\u0441\u0440\u0435\u0434\u0430", "\u0447\u0435\u0442\u0432\u0440\u0442\u0430\u043a", "\u043f\u0435\u0442\u0430\u043a", "\u0441\u0443\u0431\u043e\u0442\u0430"], 
SHORTWEEKDAYS:["\u043d\u0435\u0434", "\u043f\u043e\u043d", "\u0443\u0442\u043e", "\u0441\u0440\u0435", "\u0447\u0435\u0442", "\u043f\u0435\u0442", "\u0441\u0443\u0431"], STANDALONESHORTWEEKDAYS:["\u043d\u0435\u0434", "\u043f\u043e\u043d", "\u0443\u0442\u043e", "\u0441\u0440\u0435", "\u0447\u0435\u0442", "\u043f\u0435\u0442", "\u0441\u0443\u0431"], NARROWWEEKDAYS:["\u043d", "\u043f", "\u0443", "\u0441", "\u0447", "\u043f", "\u0441"], STANDALONENARROWWEEKDAYS:["\u043d", "\u043f", "\u0443", "\u0441", 
"\u0447", "\u043f", "\u0441"], SHORTQUARTERS:["\u041a1", "\u041a2", "\u041a3", "\u041a4"], QUARTERS:["\u041f\u0440\u0432\u043e \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435", "\u0414\u0440\u0443\u0433\u043e \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435", "\u0422\u0440\u0435\u045b\u0435 \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435", "\u0427\u0435\u0442\u0432\u0440\u0442\u043e \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435"], AMPMS:["\u043f\u0440\u0435 \u043f\u043e\u0434\u043d\u0435", 
"\u043f\u043e\u043f\u043e\u0434\u043d\u0435"], DATEFORMATS:["EEEE, dd. MMMM y.", "dd. MMMM y.", "dd.MM.y.", "d.M.yy."], TIMEFORMATS:["HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], AVAILABLEFORMATS:{Md:"d/M", MMMMd:"MMMM d.", MMMd:"MMM d."}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_sv = {ERAS:["f.Kr.", "e.Kr."], ERANAMES:["f\u00f6re Kristus", "efter Kristus"], NARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], MONTHS:["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"], STANDALONEMONTHS:["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", 
"oktober", "november", "december"], SHORTMONTHS:["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"], STANDALONESHORTMONTHS:["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"], WEEKDAYS:["s\u00f6ndag", "m\u00e5ndag", "tisdag", "onsdag", "torsdag", "fredag", "l\u00f6rdag"], STANDALONEWEEKDAYS:["s\u00f6ndag", "m\u00e5ndag", "tisdag", "onsdag", "torsdag", "fredag", "l\u00f6rdag"], SHORTWEEKDAYS:["s\u00f6n", "m\u00e5n", "tis", "ons", "tors", 
"fre", "l\u00f6r"], STANDALONESHORTWEEKDAYS:["s\u00f6n", "m\u00e5n", "tis", "ons", "tors", "fre", "l\u00f6r"], NARROWWEEKDAYS:["S", "M", "T", "O", "T", "F", "L"], STANDALONENARROWWEEKDAYS:["S", "M", "T", "O", "T", "F", "L"], SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1:a kvartalet", "2:a kvartalet", "3:e kvartalet", "4:e kvartalet"], AMPMS:["fm", "em"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "yyyy-MM-dd"], TIMEFORMATS:["'kl'. HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], 
AVAILABLEFORMATS:{Md:"d/M", MMMMd:"d MMMM", MMMd:"d MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_ta = {ERAS:["\u0b95\u0bbf\u0bae\u0bc1", "\u0b95\u0bbf\u0baa\u0bbf"], ERANAMES:["\u0b95\u0bbf\u0bb1\u0bbf\u0bb8\u0bcd\u0ba4\u0bc1\u0bb5\u0bc1\u0b95\u0bcd\u0b95\u0bc1 \u0bae\u0bc1\u0ba9\u0bcd", "\u0b85\u0ba9\u0bcb \u0b9f\u0bcb\u0bae\u0bbf\u0ba9\u0bbf"], NARROWMONTHS:["\u0b9c", "\u0baa\u0bbf", "\u0bae\u0bbe", "\u0b8f", "\u0bae\u0bc7", "\u0b9c\u0bc2", "\u0b9c\u0bc2", "\u0b86", "\u0b9a\u0bc6", "\u0b85", "\u0ba8", "\u0b9f\u0bbf"], STANDALONENARROWMONTHS:["\u0b9c", "\u0baa\u0bbf", 
"\u0bae\u0bbe", "\u0b8f", "\u0bae\u0bc7", "\u0b9c\u0bc2", "\u0b9c\u0bc2", "\u0b86", "\u0b9a\u0bc6", "\u0b85", "\u0ba8", "\u0b9f\u0bbf"], MONTHS:["\u0b9c\u0ba9\u0bb5\u0bb0\u0bbf", "\u0baa\u0bbf\u0baa\u0bcd\u0bb0\u0bb5\u0bb0\u0bbf", "\u0bae\u0bbe\u0bb0\u0bcd\u0b9a\u0bcd", "\u0b8f\u0baa\u0bcd\u0bb0\u0bb2\u0bcd", "\u0bae\u0bc7", "\u0b9c\u0bc2\u0ba9\u0bcd", "\u0b9c\u0bc2\u0bb2\u0bc8", "\u0b86\u0b95\u0bb8\u0bcd\u0b9f\u0bcd", "\u0b9a\u0bc6\u0baa\u0bcd\u0b9f\u0bae\u0bcd\u0baa\u0bb0\u0bcd", "\u0b85\u0b95\u0bcd\u0b9f\u0bcb\u0baa\u0bb0\u0bcd", 
"\u0ba8\u0bb5\u0bae\u0bcd\u0baa\u0bb0\u0bcd", "\u0b9f\u0bbf\u0b9a\u0bae\u0bcd\u0baa\u0bb0\u0bcd"], STANDALONEMONTHS:["\u0b9c\u0ba9\u0bb5\u0bb0\u0bbf", "\u0baa\u0bbf\u0baa\u0bcd\u0bb0\u0bb5\u0bb0\u0bbf", "\u0bae\u0bbe\u0bb0\u0bcd\u0b9a\u0bcd", "\u0b8f\u0baa\u0bcd\u0bb0\u0bb2\u0bcd", "\u0bae\u0bc7", "\u0b9c\u0bc2\u0ba9\u0bcd", "\u0b9c\u0bc2\u0bb2\u0bc8", "\u0b86\u0b95\u0bb8\u0bcd\u0b9f\u0bcd", "\u0b9a\u0bc6\u0baa\u0bcd\u0b9f\u0bae\u0bcd\u0baa\u0bb0\u0bcd", "\u0b85\u0b95\u0bcd\u0b9f\u0bcb\u0baa\u0bb0\u0bcd", 
"\u0ba8\u0bb5\u0bae\u0bcd\u0baa\u0bb0\u0bcd", "\u0b9f\u0bbf\u0b9a\u0bae\u0bcd\u0baa\u0bb0\u0bcd"], SHORTMONTHS:["\u0b9c\u0ba9.", "\u0baa\u0bbf\u0baa\u0bcd.", "\u0bae\u0bbe\u0bb0\u0bcd.", "\u0b8f\u0baa\u0bcd.", "\u0bae\u0bc7", "\u0b9c\u0bc2\u0ba9\u0bcd", "\u0b9c\u0bc2\u0bb2\u0bc8", "\u0b86\u0b95.", "\u0b9a\u0bc6\u0baa\u0bcd.", "\u0b85\u0b95\u0bcd.", "\u0ba8\u0bb5.", "\u0b9f\u0bbf\u0b9a."], STANDALONESHORTMONTHS:["\u0b9c\u0ba9.", "\u0baa\u0bbf\u0baa\u0bcd.", "\u0bae\u0bbe\u0bb0\u0bcd.", "\u0b8f\u0baa\u0bcd.", 
"\u0bae\u0bc7", "\u0b9c\u0bc2\u0ba9\u0bcd", "\u0b9c\u0bc2\u0bb2\u0bc8", "\u0b86\u0b95.", "\u0b9a\u0bc6\u0baa\u0bcd.", "\u0b85\u0b95\u0bcd.", "\u0ba8\u0bb5.", "\u0b9f\u0bbf\u0b9a."], WEEKDAYS:["\u0b9e\u0bbe\u0baf\u0bbf\u0bb1\u0bc1", "\u0ba4\u0bbf\u0b99\u0bcd\u0b95\u0bb3\u0bcd", "\u0b9a\u0bc6\u0bb5\u0bcd\u0bb5\u0bbe\u0baf\u0bcd", "\u0baa\u0bc1\u0ba4\u0ba9\u0bcd", "\u0bb5\u0bbf\u0baf\u0bbe\u0bb4\u0ba9\u0bcd", "\u0bb5\u0bc6\u0bb3\u0bcd\u0bb3\u0bbf", "\u0b9a\u0ba9\u0bbf"], STANDALONEWEEKDAYS:["\u0b9e\u0bbe\u0baf\u0bbf\u0bb1\u0bc1", 
"\u0ba4\u0bbf\u0b99\u0bcd\u0b95\u0bb3\u0bcd", "\u0b9a\u0bc6\u0bb5\u0bcd\u0bb5\u0bbe\u0baf\u0bcd", "\u0baa\u0bc1\u0ba4\u0ba9\u0bcd", "\u0bb5\u0bbf\u0baf\u0bbe\u0bb4\u0ba9\u0bcd", "\u0bb5\u0bc6\u0bb3\u0bcd\u0bb3\u0bbf", "\u0b9a\u0ba9\u0bbf"], SHORTWEEKDAYS:["\u0b9e\u0bbe", "\u0ba4\u0bbf", "\u0b9a\u0bc6", "\u0baa\u0bc1", "\u0bb5\u0bbf", "\u0bb5\u0bc6", "\u0b9a"], STANDALONESHORTWEEKDAYS:["\u0b9e\u0bbe", "\u0ba4\u0bbf", "\u0b9a\u0bc6", "\u0baa\u0bc1", "\u0bb5\u0bbf", "\u0bb5\u0bc6", "\u0b9a"], NARROWWEEKDAYS:["\u0b9e\u0bbe", 
"\u0ba4\u0bbf", "\u0b9a\u0bc6", "\u0baa\u0bc1", "\u0bb5\u0bbf", "\u0bb5\u0bc6", "\u0b9a"], STANDALONENARROWWEEKDAYS:["\u0b9e\u0bbe", "\u0ba4\u0bbf", "\u0b9a\u0bc6", "\u0baa\u0bc1", "\u0bb5\u0bbf", "\u0bb5\u0bc6", "\u0b9a"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1\u0b86\u0bae\u0bcd \u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc1", "2\u0b86\u0bae\u0bcd \u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc1", "3\u0b86\u0bae\u0bcd \u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc1", "4\u0b86\u0bae\u0bcd \u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc1"], 
AMPMS:["am", "pm"], DATEFORMATS:["EEEE, d MMMM, y", "d MMMM, y", "d MMM, y", "d-M-yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"d MMMM", MMMd:"MMM d"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_te = {ERAS:["BCE", "CE"], ERANAMES:["\u0c08\u0c38\u0c3e\u0c2a\u0c42\u0c30\u0c4d\u0c35.", "\u0c38\u0c28\u0c4d."], NARROWMONTHS:["\u0c1c", "\u0c2b\u0c3f", "\u0c2e", "\u0c0e", "\u0c2e\u0c46", "\u0c1c\u0c41", "\u0c1c\u0c41", "\u0c06", "\u0c38\u0c46", "\u0c05", "\u0c28", "\u0c21\u0c3f"], STANDALONENARROWMONTHS:["\u0c1c", "\u0c2b\u0c3f", "\u0c2e", "\u0c0e", "\u0c2e\u0c46", "\u0c1c\u0c41", "\u0c1c\u0c41", "\u0c06", "\u0c38\u0c46", "\u0c05", "\u0c28", "\u0c21\u0c3f"], MONTHS:["\u0c1c\u0c28\u0c35\u0c30\u0c3f", 
"\u0c2b\u0c3f\u0c2c\u0c4d\u0c30\u0c35\u0c30\u0c3f", "\u0c2e\u0c3e\u0c30\u0c4d\u0c1a\u0c3f", "\u0c0f\u0c2a\u0c4d\u0c30\u0c3f\u0c32\u0c4d", "\u0c2e\u0c47", "\u0c1c\u0c42\u0c28\u0c4d", "\u0c1c\u0c42\u0c32\u0c48", "\u0c06\u0c17\u0c38\u0c4d\u0c1f\u0c41", "\u0c38\u0c46\u0c2a\u0c4d\u0c1f\u0c46\u0c02\u0c2c\u0c30\u0c4d", "\u0c05\u0c15\u0c4d\u0c1f\u0c4b\u0c2c\u0c30\u0c4d", "\u0c28\u0c35\u0c02\u0c2c\u0c30\u0c4d", "\u0c21\u0c3f\u0c38\u0c46\u0c02\u0c2c\u0c30\u0c4d"], STANDALONEMONTHS:["\u0c1c\u0c28\u0c35\u0c30\u0c3f", 
"\u0c2b\u0c3f\u0c2c\u0c4d\u0c30\u0c35\u0c30\u0c3f", "\u0c2e\u0c3e\u0c30\u0c4d\u0c1a\u0c3f", "\u0c0f\u0c2a\u0c4d\u0c30\u0c3f\u0c32\u0c4d", "\u0c2e\u0c47", "\u0c1c\u0c42\u0c28\u0c4d", "\u0c1c\u0c42\u0c32\u0c48", "\u0c06\u0c17\u0c38\u0c4d\u0c1f\u0c41", "\u0c38\u0c46\u0c2a\u0c4d\u0c1f\u0c46\u0c02\u0c2c\u0c30\u0c4d", "\u0c05\u0c15\u0c4d\u0c1f\u0c4b\u0c2c\u0c30\u0c4d", "\u0c28\u0c35\u0c02\u0c2c\u0c30\u0c4d", "\u0c21\u0c3f\u0c38\u0c46\u0c02\u0c2c\u0c30\u0c4d"], SHORTMONTHS:["\u0c1c\u0c28\u0c35\u0c30\u0c3f", 
"\u0c2b\u0c3f\u0c2c\u0c4d\u0c30\u0c35\u0c30\u0c3f", "\u0c2e\u0c3e\u0c30\u0c4d\u0c1a\u0c3f", "\u0c0f\u0c2a\u0c4d\u0c30\u0c3f\u0c32\u0c4d", "\u0c2e\u0c47", "\u0c1c\u0c42\u0c28\u0c4d", "\u0c1c\u0c42\u0c32\u0c48", "\u0c06\u0c17\u0c38\u0c4d\u0c1f\u0c41", "\u0c38\u0c46\u0c2a\u0c4d\u0c1f\u0c46\u0c02\u0c2c\u0c30\u0c4d", "\u0c05\u0c15\u0c4d\u0c1f\u0c4b\u0c2c\u0c30\u0c4d", "\u0c28\u0c35\u0c02\u0c2c\u0c30\u0c4d", "\u0c21\u0c3f\u0c38\u0c46\u0c02\u0c2c\u0c30\u0c4d"], STANDALONESHORTMONTHS:["\u0c1c\u0c28\u0c35\u0c30\u0c3f", 
"\u0c2b\u0c3f\u0c2c\u0c4d\u0c30\u0c35\u0c30\u0c3f", "\u0c2e\u0c3e\u0c30\u0c4d\u0c1a\u0c3f", "\u0c0f\u0c2a\u0c4d\u0c30\u0c3f\u0c32\u0c4d", "\u0c2e\u0c47", "\u0c1c\u0c42\u0c28\u0c4d", "\u0c1c\u0c42\u0c32\u0c48", "\u0c06\u0c17\u0c38\u0c4d\u0c1f\u0c41", "\u0c38\u0c46\u0c2a\u0c4d\u0c1f\u0c46\u0c02\u0c2c\u0c30\u0c4d", "\u0c05\u0c15\u0c4d\u0c1f\u0c4b\u0c2c\u0c30\u0c4d", "\u0c28\u0c35\u0c02\u0c2c\u0c30\u0c4d", "\u0c21\u0c3f\u0c38\u0c46\u0c02\u0c2c\u0c30\u0c4d"], WEEKDAYS:["\u0c06\u0c26\u0c3f\u0c35\u0c3e\u0c30\u0c02", 
"\u0c38\u0c4b\u0c2e\u0c35\u0c3e\u0c30\u0c02", "\u0c2e\u0c02\u0c17\u0c33\u0c35\u0c3e\u0c30\u0c02", "\u0c2c\u0c41\u0c27\u0c35\u0c3e\u0c30\u0c02", "\u0c17\u0c41\u0c30\u0c41\u0c35\u0c3e\u0c30\u0c02", "\u0c36\u0c41\u0c15\u0c4d\u0c30\u0c35\u0c3e\u0c30\u0c02", "\u0c36\u0c28\u0c3f\u0c35\u0c3e\u0c30\u0c02"], STANDALONEWEEKDAYS:["\u0c06\u0c26\u0c3f\u0c35\u0c3e\u0c30\u0c02", "\u0c38\u0c4b\u0c2e\u0c35\u0c3e\u0c30\u0c02", "\u0c2e\u0c02\u0c17\u0c33\u0c35\u0c3e\u0c30\u0c02", "\u0c2c\u0c41\u0c27\u0c35\u0c3e\u0c30\u0c02", 
"\u0c17\u0c41\u0c30\u0c41\u0c35\u0c3e\u0c30\u0c02", "\u0c36\u0c41\u0c15\u0c4d\u0c30\u0c35\u0c3e\u0c30\u0c02", "\u0c36\u0c28\u0c3f\u0c35\u0c3e\u0c30\u0c02"], SHORTWEEKDAYS:["\u0c06\u0c26\u0c3f", "\u0c38\u0c4b\u0c2e", "\u0c2e\u0c02\u0c17\u0c33", "\u0c2c\u0c41\u0c27", "\u0c17\u0c41\u0c30\u0c41", "\u0c36\u0c41\u0c15\u0c4d\u0c30", "\u0c36\u0c28\u0c3f"], STANDALONESHORTWEEKDAYS:["\u0c06\u0c26\u0c3f", "\u0c38\u0c4b\u0c2e", "\u0c2e\u0c02\u0c17\u0c33", "\u0c2c\u0c41\u0c27", "\u0c17\u0c41\u0c30\u0c41", "\u0c36\u0c41\u0c15\u0c4d\u0c30", 
"\u0c36\u0c28\u0c3f"], NARROWWEEKDAYS:["\u0c06", "\u0c38\u0c4b", "\u0c2e", "\u0c2d\u0c41", "\u0c17\u0c41", "\u0c36\u0c41", "\u0c36"], STANDALONENARROWWEEKDAYS:["\u0c06", "\u0c38\u0c4b", "\u0c2e", "\u0c2d\u0c41", "\u0c17\u0c41", "\u0c36\u0c41", "\u0c36"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["\u0c12\u0c15\u0c1f\u0c3f 1", "\u0c30\u0c46\u0c02\u0c21\u0c41 2", "\u0c2e\u0c42\u0c21\u0c41 3", "\u0c28\u0c3e\u0c32\u0c41\u0c17\u0c41 4"], AMPMS:["am", "pm"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", 
"d MMM y", "dd-MM-yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"d MMMM", MMMd:"MMM d"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_th = {ERAS:["\u0e1b\u0e35\u0e01\u0e48\u0e2d\u0e19 \u0e04.\u0e28.", "\u0e04.\u0e28."], ERANAMES:["\u0e1b\u0e35\u0e01\u0e48\u0e2d\u0e19\u0e04\u0e23\u0e34\u0e2a\u0e15\u0e4c\u0e28\u0e31\u0e01\u0e23\u0e32\u0e0a", "\u0e04\u0e23\u0e34\u0e2a\u0e15\u0e4c\u0e28\u0e31\u0e01\u0e23\u0e32\u0e0a"], NARROWMONTHS:["\u0e21.\u0e04.", "\u0e01.\u0e1e.", "\u0e21\u0e35.\u0e04.", "\u0e40\u0e21.\u0e22.", "\u0e1e.\u0e04.", "\u0e21\u0e34.\u0e22.", "\u0e01.\u0e04.", "\u0e2a.\u0e04.", "\u0e01.\u0e22.", 
"\u0e15.\u0e04.", "\u0e1e.\u0e22.", "\u0e18.\u0e04."], STANDALONENARROWMONTHS:["\u0e21.\u0e04.", "\u0e01.\u0e1e.", "\u0e21\u0e35.\u0e04.", "\u0e40\u0e21.\u0e22.", "\u0e1e.\u0e04.", "\u0e21\u0e34.\u0e22.", "\u0e01.\u0e04.", "\u0e2a.\u0e04.", "\u0e01.\u0e22.", "\u0e15.\u0e04.", "\u0e1e.\u0e22.", "\u0e18.\u0e04."], MONTHS:["\u0e21\u0e01\u0e23\u0e32\u0e04\u0e21", "\u0e01\u0e38\u0e21\u0e20\u0e32\u0e1e\u0e31\u0e19\u0e18\u0e4c", "\u0e21\u0e35\u0e19\u0e32\u0e04\u0e21", "\u0e40\u0e21\u0e29\u0e32\u0e22\u0e19", 
"\u0e1e\u0e24\u0e29\u0e20\u0e32\u0e04\u0e21", "\u0e21\u0e34\u0e16\u0e38\u0e19\u0e32\u0e22\u0e19", "\u0e01\u0e23\u0e01\u0e0e\u0e32\u0e04\u0e21", "\u0e2a\u0e34\u0e07\u0e2b\u0e32\u0e04\u0e21", "\u0e01\u0e31\u0e19\u0e22\u0e32\u0e22\u0e19", "\u0e15\u0e38\u0e25\u0e32\u0e04\u0e21", "\u0e1e\u0e24\u0e28\u0e08\u0e34\u0e01\u0e32\u0e22\u0e19", "\u0e18\u0e31\u0e19\u0e27\u0e32\u0e04\u0e21"], STANDALONEMONTHS:["\u0e21\u0e01\u0e23\u0e32\u0e04\u0e21", "\u0e01\u0e38\u0e21\u0e20\u0e32\u0e1e\u0e31\u0e19\u0e18\u0e4c", 
"\u0e21\u0e35\u0e19\u0e32\u0e04\u0e21", "\u0e40\u0e21\u0e29\u0e32\u0e22\u0e19", "\u0e1e\u0e24\u0e29\u0e20\u0e32\u0e04\u0e21", "\u0e21\u0e34\u0e16\u0e38\u0e19\u0e32\u0e22\u0e19", "\u0e01\u0e23\u0e01\u0e0e\u0e32\u0e04\u0e21", "\u0e2a\u0e34\u0e07\u0e2b\u0e32\u0e04\u0e21", "\u0e01\u0e31\u0e19\u0e22\u0e32\u0e22\u0e19", "\u0e15\u0e38\u0e25\u0e32\u0e04\u0e21", "\u0e1e\u0e24\u0e28\u0e08\u0e34\u0e01\u0e32\u0e22\u0e19", "\u0e18\u0e31\u0e19\u0e27\u0e32\u0e04\u0e21"], SHORTMONTHS:["\u0e21.\u0e04.", "\u0e01.\u0e1e.", 
"\u0e21\u0e35.\u0e04.", "\u0e40\u0e21.\u0e22.", "\u0e1e.\u0e04.", "\u0e21\u0e34.\u0e22.", "\u0e01.\u0e04.", "\u0e2a.\u0e04.", "\u0e01.\u0e22.", "\u0e15.\u0e04.", "\u0e1e.\u0e22.", "\u0e18.\u0e04."], STANDALONESHORTMONTHS:["\u0e21.\u0e04.", "\u0e01.\u0e1e.", "\u0e21\u0e35.\u0e04.", "\u0e40\u0e21.\u0e22.", "\u0e1e.\u0e04.", "\u0e21\u0e34.\u0e22.", "\u0e01.\u0e04.", "\u0e2a.\u0e04.", "\u0e01.\u0e22.", "\u0e15.\u0e04.", "\u0e1e.\u0e22.", "\u0e18.\u0e04."], WEEKDAYS:["\u0e27\u0e31\u0e19\u0e2d\u0e32\u0e17\u0e34\u0e15\u0e22\u0e4c", 
"\u0e27\u0e31\u0e19\u0e08\u0e31\u0e19\u0e17\u0e23\u0e4c", "\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23", "\u0e27\u0e31\u0e19\u0e1e\u0e38\u0e18", "\u0e27\u0e31\u0e19\u0e1e\u0e24\u0e2b\u0e31\u0e2a\u0e1a\u0e14\u0e35", "\u0e27\u0e31\u0e19\u0e28\u0e38\u0e01\u0e23\u0e4c", "\u0e27\u0e31\u0e19\u0e40\u0e2a\u0e32\u0e23\u0e4c"], STANDALONEWEEKDAYS:["\u0e27\u0e31\u0e19\u0e2d\u0e32\u0e17\u0e34\u0e15\u0e22\u0e4c", "\u0e27\u0e31\u0e19\u0e08\u0e31\u0e19\u0e17\u0e23\u0e4c", "\u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23", 
"\u0e27\u0e31\u0e19\u0e1e\u0e38\u0e18", "\u0e27\u0e31\u0e19\u0e1e\u0e24\u0e2b\u0e31\u0e2a\u0e1a\u0e14\u0e35", "\u0e27\u0e31\u0e19\u0e28\u0e38\u0e01\u0e23\u0e4c", "\u0e27\u0e31\u0e19\u0e40\u0e2a\u0e32\u0e23\u0e4c"], SHORTWEEKDAYS:["\u0e2d\u0e32.", "\u0e08.", "\u0e2d.", "\u0e1e.", "\u0e1e\u0e24.", "\u0e28.", "\u0e2a."], STANDALONESHORTWEEKDAYS:["\u0e2d\u0e32.", "\u0e08.", "\u0e2d.", "\u0e1e.", "\u0e1e\u0e24.", "\u0e28.", "\u0e2a."], NARROWWEEKDAYS:["\u0e2d", "\u0e08", "\u0e2d", "\u0e1e", "\u0e1e", 
"\u0e28", "\u0e2a"], STANDALONENARROWWEEKDAYS:["\u0e2d", "\u0e08", "\u0e2d", "\u0e1e", "\u0e1e", "\u0e28", "\u0e2a"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 1", "\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 2", "\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 3", "\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 4"], AMPMS:["\u0e01\u0e48\u0e2d\u0e19\u0e40\u0e17\u0e35\u0e48\u0e22\u0e07", "\u0e2b\u0e25\u0e31\u0e07\u0e40\u0e17\u0e35\u0e48\u0e22\u0e07"], DATEFORMATS:["EEEE\u0e17\u0e35\u0e48 d MMMM G y", 
"d MMMM y", "d MMM y", "d/M/yyyy"], TIMEFORMATS:["H \u0e19\u0e32\u0e2c\u0e34\u0e01\u0e32 m \u0e19\u0e32\u0e17\u0e35 ss \u0e27\u0e34\u0e19\u0e32\u0e17\u0e35 zzzz", "H \u0e19\u0e32\u0e2c\u0e34\u0e01\u0e32 m \u0e19\u0e32\u0e17\u0e35 ss \u0e27\u0e34\u0e19\u0e32\u0e17\u0e35 z", "H:mm:ss", "H:mm"], AVAILABLEFORMATS:{Md:"d/M", MMMMd:"d MMMM", MMMd:"d MMM"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_tl = {ERAS:["BCE", "CE"], ERANAMES:["BCE", "CE"], NARROWMONTHS:["E", "P", "M", "A", "M", "H", "H", "A", "S", "O", "N", "D"], STANDALONENARROWMONTHS:["E", "P", "M", "A", "M", "H", "H", "A", "S", "O", "N", "D"], MONTHS:["Enero", "Pebrero", "Marso", "Abril", "Mayo", "Hunyo", "Hulyo", "Agosto", "Setyembre", "Oktubre", "Nobyembre", "Disyembre"], STANDALONEMONTHS:["Enero", "Pebrero", "Marso", "Abril", "Mayo", "Hunyo", "Hulyo", "Agosto", "Setyembre", "Oktubre", "Nobyembre", "Disyembre"], 
SHORTMONTHS:["Ene", "Peb", "Mar", "Abr", "May", "Hun", "Hul", "Ago", "Set", "Okt", "Nob", "Dis"], STANDALONESHORTMONTHS:["Ene", "Peb", "Mar", "Abr", "May", "Hun", "Hul", "Ago", "Set", "Okt", "Nob", "Dis"], WEEKDAYS:["Linggo", "Lunes", "Martes", "Miyerkules", "Huwebes", "Biyernes", "Sabado"], STANDALONEWEEKDAYS:["Linggo", "Lunes", "Martes", "Miyerkules", "Huwebes", "Biyernes", "Sabado"], SHORTWEEKDAYS:["Lin", "Lun", "Mar", "Mye", "Huw", "Bye", "Sab"], STANDALONESHORTWEEKDAYS:["Lin", "Lun", "Mar", 
"Miy", "Huw", "Biy", "Sab"], NARROWWEEKDAYS:["L", "L", "M", "M", "H", "B", "S"], STANDALONENARROWWEEKDAYS:["L", "L", "M", "M", "H", "B", "S"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Q1", "Q2", "Q3", "Q4"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, MMMM dd y", "MMMM d, y", "MMM d, y", "M/d/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"MMMM d", MMMd:"MMM d"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_tr = {ERAS:["M\u00d6", "MS"], ERANAMES:["Milattan \u00d6nce", "Milattan Sonra"], NARROWMONTHS:["O", "\u015e", "M", "N", "M", "H", "T", "A", "E", "E", "K", "A"], STANDALONENARROWMONTHS:["O", "\u015e", "M", "N", "M", "H", "T", "A", "E", "E", "K", "A"], MONTHS:["Ocak", "\u015eubat", "Mart", "Nisan", "May\u0131s", "Haziran", "Temmuz", "A\u011fustos", "Eyl\u00fcl", "Ekim", "Kas\u0131m", "Aral\u0131k"], STANDALONEMONTHS:["Ocak", "\u015eubat", "Mart", "Nisan", "May\u0131s", "Haziran", 
"Temmuz", "A\u011fustos", "Eyl\u00fcl", "Ekim", "Kas\u0131m", "Aral\u0131k"], SHORTMONTHS:["Oca", "\u015eub", "Mar", "Nis", "May", "Haz", "Tem", "A\u011fu", "Eyl", "Eki", "Kas", "Ara"], STANDALONESHORTMONTHS:["Oca", "\u015eub", "Mar", "Nis", "May", "Haz", "Tem", "A\u011fu", "Eyl", "Eki", "Kas", "Ara"], WEEKDAYS:["Pazar", "Pazartesi", "Sal\u0131", "\u00c7ar\u015famba", "Per\u015fembe", "Cuma", "Cumartesi"], STANDALONEWEEKDAYS:["Pazar", "Pazartesi", "Sal\u0131", "\u00c7ar\u015famba", "Per\u015fembe", 
"Cuma", "Cumartesi"], SHORTWEEKDAYS:["Paz", "Pzt", "Sal", "\u00c7ar", "Per", "Cum", "Cmt"], STANDALONESHORTWEEKDAYS:["Paz", "Pzt", "Sal", "\u00c7ar", "Per", "Cum", "Cmt"], NARROWWEEKDAYS:["P", "P", "S", "\u00c7", "P", "C", "C"], STANDALONENARROWWEEKDAYS:["P", "P", "S", "\u00c7", "P", "C", "C"], SHORTQUARTERS:["\u00c71", "\u00c72", "\u00c73", "\u00c74"], QUARTERS:["1. \u00e7eyrek", "2. \u00e7eyrek", "3. \u00e7eyrek", "4. \u00e7eyrek"], AMPMS:["AM", "PM"], DATEFORMATS:["dd MMMM y EEEE", "dd MMMM y", 
"dd MMM y", "dd MM yyyy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"dd/MM", MMMMd:"dd MMMM", MMMd:"dd MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_uk = {ERAS:["\u0434\u043e \u043d.\u0435.", "\u043d.\u0435."], ERANAMES:["\u0434\u043e \u043d\u0430\u0448\u043e\u0457 \u0435\u0440\u0438", "\u043d\u0430\u0448\u043e\u0457 \u0435\u0440\u0438"], NARROWMONTHS:["\u0421", "\u041b", "\u0411", "\u041a", "\u0422", "\u0427", "\u041b", "\u0421", "\u0412", "\u0416", "\u041b", "\u0413"], STANDALONENARROWMONTHS:["\u0421", "\u041b", "\u0411", "\u041a", "\u0422", "\u0427", "\u041b", "\u0421", "\u0412", "\u0416", "\u041b", "\u0413"], MONTHS:["\u0441\u0456\u0447\u043d\u044f", 
"\u043b\u044e\u0442\u043e\u0433\u043e", "\u0431\u0435\u0440\u0435\u0437\u043d\u044f", "\u043a\u0432\u0456\u0442\u043d\u044f", "\u0442\u0440\u0430\u0432\u043d\u044f", "\u0447\u0435\u0440\u0432\u043d\u044f", "\u043b\u0438\u043f\u043d\u044f", "\u0441\u0435\u0440\u043f\u043d\u044f", "\u0432\u0435\u0440\u0435\u0441\u043d\u044f", "\u0436\u043e\u0432\u0442\u043d\u044f", "\u043b\u0438\u0441\u0442\u043e\u043f\u0430\u0434\u0430", "\u0433\u0440\u0443\u0434\u043d\u044f"], STANDALONEMONTHS:["\u0421\u0456\u0447\u0435\u043d\u044c", 
"\u041b\u044e\u0442\u0438\u0439", "\u0411\u0435\u0440\u0435\u0437\u0435\u043d\u044c", "\u041a\u0432\u0456\u0442\u0435\u043d\u044c", "\u0422\u0440\u0430\u0432\u0435\u043d\u044c", "\u0427\u0435\u0440\u0432\u0435\u043d\u044c", "\u041b\u0438\u043f\u0435\u043d\u044c", "\u0421\u0435\u0440\u043f\u0435\u043d\u044c", "\u0412\u0435\u0440\u0435\u0441\u0435\u043d\u044c", "\u0416\u043e\u0432\u0442\u0435\u043d\u044c", "\u041b\u0438\u0441\u0442\u043e\u043f\u0430\u0434", "\u0413\u0440\u0443\u0434\u0435\u043d\u044c"], 
SHORTMONTHS:["\u0441\u0456\u0447.", "\u043b\u044e\u0442.", "\u0431\u0435\u0440.", "\u043a\u0432\u0456\u0442.", "\u0442\u0440\u0430\u0432.", "\u0447\u0435\u0440\u0432.", "\u043b\u0438\u043f.", "\u0441\u0435\u0440\u043f.", "\u0432\u0435\u0440.", "\u0436\u043e\u0432\u0442.", "\u043b\u0438\u0441\u0442.", "\u0433\u0440\u0443\u0434."], STANDALONESHORTMONTHS:["\u0421\u0456\u0447", "\u041b\u044e\u0442", "\u0411\u0435\u0440", "\u041a\u0432\u0456", "\u0422\u0440\u0430", "\u0427\u0435\u0440", "\u041b\u0438\u043f", 
"\u0421\u0435\u0440", "\u0412\u0435\u0440", "\u0416\u043e\u0432", "\u041b\u0438\u0441", "\u0413\u0440\u0443"], WEEKDAYS:["\u041d\u0435\u0434\u0456\u043b\u044f", "\u041f\u043e\u043d\u0435\u0434\u0456\u043b\u043e\u043a", "\u0412\u0456\u0432\u0442\u043e\u0440\u043e\u043a", "\u0421\u0435\u0440\u0435\u0434\u0430", "\u0427\u0435\u0442\u0432\u0435\u0440", "\u041f\u02bc\u044f\u0442\u043d\u0438\u0446\u044f", "\u0421\u0443\u0431\u043e\u0442\u0430"], STANDALONEWEEKDAYS:["\u041d\u0435\u0434\u0456\u043b\u044f", 
"\u041f\u043e\u043d\u0435\u0434\u0456\u043b\u043e\u043a", "\u0412\u0456\u0432\u0442\u043e\u0440\u043e\u043a", "\u0421\u0435\u0440\u0435\u0434\u0430", "\u0427\u0435\u0442\u0432\u0435\u0440", "\u041f\u02bc\u044f\u0442\u043d\u0438\u0446\u044f", "\u0421\u0443\u0431\u043e\u0442\u0430"], SHORTWEEKDAYS:["\u041d\u0434", "\u041f\u043d", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041f\u0442", "\u0421\u0431"], STANDALONESHORTWEEKDAYS:["\u041d\u0434", "\u041f\u043d", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", 
"\u041f\u0442", "\u0421\u0431"], NARROWWEEKDAYS:["\u041d", "\u041f", "\u0412", "\u0421", "\u0427", "\u041f", "\u0421"], STANDALONENARROWWEEKDAYS:["\u041d", "\u041f", "\u0412", "\u0421", "\u0427", "\u041f", "\u0421"], SHORTQUARTERS:["I \u043a\u0432.", "II \u043a\u0432.", "III \u043a\u0432.", "IV \u043a\u0432."], QUARTERS:["I \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "II \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "III \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "IV \u043a\u0432\u0430\u0440\u0442\u0430\u043b"], 
AMPMS:["\u0434\u043f", "\u043f\u043f"], DATEFORMATS:["EEEE, d MMMM y '\u0440'.", "d MMMM y '\u0440'.", "d MMM y", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"d MMMM", MMMd:"d MMM"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_ur = {ERAS:["\u0642 \u0645", "\u0639\u064a\u0633\u0648\u06cc \u0633\u0646"], ERANAMES:["\u0642\u0628\u0644 \u0645\u0633\u064a\u062d", "\u0639\u064a\u0633\u0648\u06cc \u0633\u0646"], NARROWMONTHS:["\u062c", "\u0641", "\u0645", "\u0627", "\u0645", "\u062c", "\u062c", "\u0627", "\u0633", "\u0627", "\u0646", "\u062f"], STANDALONENARROWMONTHS:["\u062c", "\u0641", "\u0645", "\u0627", "\u0645", "\u062c", "\u062c", "\u0627", "\u0633", "\u0627", "\u0646", "\u062f"], MONTHS:["\u062c\u0646\u0648\u0631\u06cc", 
"\u0641\u0631\u0648\u0631\u06cc", "\u0645\u0627\u0631 \u0686", "\u0627\u067e\u0631\u064a\u0644", "\u0645\u0626", "\u062c\u0648\u0646", "\u062c\u0648\u0644\u0627\u0626", "\u0627\u06af\u0633\u062a", "\u0633\u062a\u0645\u0628\u0631", "\u0627\u06a9\u062a\u0648\u0628\u0631", "\u0646\u0648\u0645\u0628\u0631", "\u062f\u0633\u0645\u0628\u0631"], STANDALONEMONTHS:["\u062c\u0646\u0648\u0631\u06cc", "\u0641\u0631\u0648\u0631\u06cc", "\u0645\u0627\u0631 \u0686", "\u0627\u067e\u0631\u064a\u0644", "\u0645\u0626", 
"\u062c\u0648\u0646", "\u062c\u0648\u0644\u0627\u0626", "\u0627\u06af\u0633\u062a", "\u0633\u062a\u0645\u0628\u0631", "\u0627\u06a9\u062a\u0648\u0628\u0631", "\u0646\u0648\u0645\u0628\u0631", "\u062f\u0633\u0645\u0628\u0631"], SHORTMONTHS:["\u062c\u0646\u0648\u0631\u06cc", "\u0641\u0631\u0648\u0631\u06cc", "\u0645\u0627\u0631 \u0686", "\u0627\u067e\u0631\u064a\u0644", "\u0645\u0626", "\u062c\u0648\u0646", "\u062c\u0648\u0644\u0627\u0626", "\u0627\u06af\u0633\u062a", "\u0633\u062a\u0645\u0628\u0631", 
"\u0627\u06a9\u062a\u0648\u0628\u0631", "\u0646\u0648\u0645\u0628\u0631", "\u062f\u0633\u0645\u0628\u0631"], STANDALONESHORTMONTHS:["\u062c\u0646\u0648\u0631\u06cc", "\u0641\u0631\u0648\u0631\u06cc", "\u0645\u0627\u0631 \u0686", "\u0627\u067e\u0631\u064a\u0644", "\u0645\u0626", "\u062c\u0648\u0646", "\u062c\u0648\u0644\u0627\u0626", "\u0627\u06af\u0633\u062a", "\u0633\u062a\u0645\u0628\u0631", "\u0627\u06a9\u062a\u0648\u0628\u0631", "\u0646\u0648\u0645\u0628\u0631", "\u062f\u0633\u0645\u0628\u0631"], 
WEEKDAYS:["\u0627\u062a\u0648\u0627\u0631", "\u067e\u064a\u0631", "\u0645\u0646\u06af\u0644", "\u0628\u062f\u0647", "\u062c\u0645\u0639\u0631\u0627\u062a", "\u062c\u0645\u0639\u06c1", "\u06c1\u0641\u062a\u06c1"], STANDALONEWEEKDAYS:["\u0627\u062a\u0648\u0627\u0631", "\u067e\u064a\u0631", "\u0645\u0646\u06af\u0644", "\u0628\u062f\u0647", "\u062c\u0645\u0639\u0631\u0627\u062a", "\u062c\u0645\u0639\u06c1", "\u06c1\u0641\u062a\u06c1"], SHORTWEEKDAYS:["\u0627\u062a\u0648\u0627\u0631", "\u067e\u064a\u0631", 
"\u0645\u0646\u06af\u0644", "\u0628\u062f\u0647", "\u062c\u0645\u0639\u0631\u0627\u062a", "\u062c\u0645\u0639\u06c1", "\u06c1\u0641\u062a\u06c1"], STANDALONESHORTWEEKDAYS:["\u0627\u062a\u0648\u0627\u0631", "\u067e\u064a\u0631", "\u0645\u0646\u06af\u0644", "\u0628\u062f\u0647", "\u062c\u0645\u0639\u0631\u0627\u062a", "\u062c\u0645\u0639\u06c1", "\u06c1\u0641\u062a\u06c1"], NARROWWEEKDAYS:["\u0627", "\u067e", "\u0645", "\u0628", "\u062c", "\u062c", "\u06c1"], STANDALONENARROWWEEKDAYS:["1", "2", "3", 
"4", "5", "6", "7"], SHORTQUARTERS:["1\u0633\u06c1 \u0645\u0627\u06c1\u06cc", "2\u0633\u06c1 \u0645\u0627\u06c1\u06cc", "3\u0633\u06c1 \u0645\u0627\u06c1\u06cc", "4\u0633\u06c1 \u0645\u0627\u06c1\u06cc"], QUARTERS:["\u067e\u06c1\u0644\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", "\u062f\u0648\u0633\u0631\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", "\u062a\u064a\u0633\u0631\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", "\u0686\u0648\u062a\u0647\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc"], AMPMS:["\u0642\u0628\u0644 \u062f\u0648\u067e\u06c1\u0631", 
"\u0628\u0639\u062f \u062f\u0648\u067e\u06c1\u0631"], DATEFORMATS:["EEEE, d, MMMM y", "d, MMMM y", "d, MMM y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"MMMM d", MMMd:"MMM d"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_vi = {ERAS:["tr. CN", "sau CN"], ERANAMES:["tr. CN", "sau CN"], NARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], STANDALONENARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], MONTHS:["th\u00e1ng m\u1ed9t", "th\u00e1ng hai", "th\u00e1ng ba", "th\u00e1ng t\u01b0", "th\u00e1ng n\u0103m", "th\u00e1ng s\u00e1u", "th\u00e1ng b\u1ea3y", "th\u00e1ng t\u00e1m", "th\u00e1ng ch\u00edn", "th\u00e1ng m\u01b0\u1eddi", "th\u00e1ng m\u01b0\u1eddi m\u1ed9t", 
"th\u00e1ng m\u01b0\u1eddi hai"], STANDALONEMONTHS:["th\u00e1ng m\u1ed9t", "th\u00e1ng hai", "th\u00e1ng ba", "th\u00e1ng t\u01b0", "th\u00e1ng n\u0103m", "th\u00e1ng s\u00e1u", "th\u00e1ng b\u1ea3y", "th\u00e1ng t\u00e1m", "th\u00e1ng ch\u00edn", "th\u00e1ng m\u01b0\u1eddi", "th\u00e1ng m\u01b0\u1eddi m\u1ed9t", "th\u00e1ng m\u01b0\u1eddi hai"], SHORTMONTHS:["thg 1", "thg 2", "thg 3", "thg 4", "thg 5", "thg 6", "thg 7", "thg 8", "thg 9", "thg 10", "thg 11", "thg 12"], STANDALONESHORTMONTHS:["thg 1", 
"thg 2", "thg 3", "thg 4", "thg 5", "thg 6", "thg 7", "thg 8", "thg 9", "thg 10", "thg 11", "thg 12"], WEEKDAYS:["Ch\u1ee7 nh\u1eadt", "Th\u1ee9 hai", "Th\u1ee9 ba", "Th\u1ee9 t\u01b0", "Th\u1ee9 n\u0103m", "Th\u1ee9 s\u00e1u", "Th\u1ee9 b\u1ea3y"], STANDALONEWEEKDAYS:["Ch\u1ee7 nh\u1eadt", "Th\u1ee9 hai", "Th\u1ee9 ba", "Th\u1ee9 t\u01b0", "Th\u1ee9 n\u0103m", "Th\u1ee9 s\u00e1u", "Th\u1ee9 b\u1ea3y"], SHORTWEEKDAYS:["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"], STANDALONESHORTWEEKDAYS:["CN", 
"Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"], NARROWWEEKDAYS:["1", "2", "3", "4", "5", "6", "7"], STANDALONENARROWWEEKDAYS:["1", "2", "3", "4", "5", "6", "7"], SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Q1", "Q2", "Q3", "Q4"], AMPMS:["SA", "CH"], DATEFORMATS:["EEEE, 'ng\u00e0y' dd MMMM 'n\u0103m' y", "'Ng\u00e0y' dd 'th\u00e1ng' M 'n\u0103m' y", "dd-MM-yyyy", "dd/MM/yyyy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], AVAILABLEFORMATS:{Md:"d-M", MMMMd:"d MMMM", MMMd:"d MMM"}, 
FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_zh = {ERAS:["\u516c\u5143\u524d", "\u516c\u5143"], ERANAMES:["\u516c\u5143\u524d", "\u516c\u5143"], NARROWMONTHS:["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"], STANDALONENARROWMONTHS:["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"], MONTHS:["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", 
"7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"], STANDALONEMONTHS:["\u4e00\u6708", "\u4e8c\u6708", "\u4e09\u6708", "\u56db\u6708", "\u4e94\u6708", "\u516d\u6708", "\u4e03\u6708", "\u516b\u6708", "\u4e5d\u6708", "\u5341\u6708", "\u5341\u4e00\u6708", "\u5341\u4e8c\u6708"], SHORTMONTHS:["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"], STANDALONESHORTMONTHS:["\u4e00\u6708", "\u4e8c\u6708", "\u4e09\u6708", 
"\u56db\u6708", "\u4e94\u6708", "\u516d\u6708", "\u4e03\u6708", "\u516b\u6708", "\u4e5d\u6708", "\u5341\u6708", "\u5341\u4e00\u6708", "\u5341\u4e8c\u6708"], WEEKDAYS:["\u661f\u671f\u65e5", "\u661f\u671f\u4e00", "\u661f\u671f\u4e8c", "\u661f\u671f\u4e09", "\u661f\u671f\u56db", "\u661f\u671f\u4e94", "\u661f\u671f\u516d"], STANDALONEWEEKDAYS:["\u661f\u671f\u65e5", "\u661f\u671f\u4e00", "\u661f\u671f\u4e8c", "\u661f\u671f\u4e09", "\u661f\u671f\u56db", "\u661f\u671f\u4e94", "\u661f\u671f\u516d"], SHORTWEEKDAYS:["\u5468\u65e5", 
"\u5468\u4e00", "\u5468\u4e8c", "\u5468\u4e09", "\u5468\u56db", "\u5468\u4e94", "\u5468\u516d"], STANDALONESHORTWEEKDAYS:["\u5468\u65e5", "\u5468\u4e00", "\u5468\u4e8c", "\u5468\u4e09", "\u5468\u56db", "\u5468\u4e94", "\u5468\u516d"], NARROWWEEKDAYS:["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d"], STANDALONENARROWWEEKDAYS:["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d"], SHORTQUARTERS:["1\u5b63", "2\u5b63", "3\u5b63", "4\u5b63"], QUARTERS:["\u7b2c1\u5b63\u5ea6", 
"\u7b2c2\u5b63\u5ea6", "\u7b2c3\u5b63\u5ea6", "\u7b2c4\u5b63\u5ea6"], AMPMS:["\u4e0a\u5348", "\u4e0b\u5348"], DATEFORMATS:["y\u5e74M\u6708d\u65e5EEEE", "y\u5e74M\u6708d\u65e5", "yyyy-M-d", "yy-M-d"], TIMEFORMATS:["zzzzah\u65f6mm\u5206ss\u79d2", "zah\u65f6mm\u5206ss\u79d2", "ahh:mm:ss", "ah:mm"], AVAILABLEFORMATS:{Md:"M-d", MMMMd:"MMMMd\u65e5", MMMd:"MMMd\u65e5"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_zh_CN = goog.i18n.DateTimeSymbols_zh;
goog.i18n.DateTimeSymbols_zh_HK = {ERAS:["\u516c\u5143\u524d", "\u516c\u5143"], ERANAMES:["\u897f\u5143\u524d", "\u897f\u5143"], NARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], STANDALONENARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], MONTHS:["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"], STANDALONEMONTHS:["\u4e00\u6708", "\u4e8c\u6708", "\u4e09\u6708", 
"\u56db\u6708", "\u4e94\u6708", "\u516d\u6708", "\u4e03\u6708", "\u516b\u6708", "\u4e5d\u6708", "\u5341\u6708", "\u5341\u4e00\u6708", "\u5341\u4e8c\u6708"], SHORTMONTHS:["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"], STANDALONESHORTMONTHS:["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"], WEEKDAYS:["\u661f\u671f\u65e5", "\u661f\u671f\u4e00", 
"\u661f\u671f\u4e8c", "\u661f\u671f\u4e09", "\u661f\u671f\u56db", "\u661f\u671f\u4e94", "\u661f\u671f\u516d"], STANDALONEWEEKDAYS:["\u661f\u671f\u65e5", "\u661f\u671f\u4e00", "\u661f\u671f\u4e8c", "\u661f\u671f\u4e09", "\u661f\u671f\u56db", "\u661f\u671f\u4e94", "\u661f\u671f\u516d"], SHORTWEEKDAYS:["\u9031\u65e5", "\u9031\u4e00", "\u9031\u4e8c", "\u9031\u4e09", "\u9031\u56db", "\u9031\u4e94", "\u9031\u516d"], STANDALONESHORTWEEKDAYS:["\u9031\u65e5", "\u9031\u4e00", "\u9031\u4e8c", "\u9031\u4e09", 
"\u9031\u56db", "\u9031\u4e94", "\u9031\u516d"], NARROWWEEKDAYS:["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d"], STANDALONENARROWWEEKDAYS:["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d"], SHORTQUARTERS:["1\u5b63", "2\u5b63", "3\u5b63", "4\u5b63"], QUARTERS:["\u7b2c1\u5b63", "\u7b2c2\u5b63", "\u7b2c3\u5b63", "\u7b2c4\u5b63"], AMPMS:["\u4e0a\u5348", "\u4e0b\u5348"], DATEFORMATS:["y\u5e74M\u6708d\u65e5EEEE", "y\u5e74M\u6708d\u65e5", "y\u5e74M\u6708d\u65e5", 
"yy\u5e74M\u6708d\u65e5"], TIMEFORMATS:["zzzzah\u6642mm\u5206ss\u79d2", "zah\u6642mm\u5206ss\u79d2", "ahh:mm:ss", "ah:mm"], AVAILABLEFORMATS:{Md:"M/d", MMMMd:"MMMMd\u65e5", MMMd:"MMMd\u65e5"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_zh_TW = {ERAS:["\u516c\u5143\u524d", "\u516c\u5143"], ERANAMES:["\u897f\u5143\u524d", "\u897f\u5143"], NARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], STANDALONENARROWMONTHS:["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], MONTHS:["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"], STANDALONEMONTHS:["\u4e00\u6708", "\u4e8c\u6708", "\u4e09\u6708", 
"\u56db\u6708", "\u4e94\u6708", "\u516d\u6708", "\u4e03\u6708", "\u516b\u6708", "\u4e5d\u6708", "\u5341\u6708", "\u5341\u4e00\u6708", "\u5341\u4e8c\u6708"], SHORTMONTHS:["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"], STANDALONESHORTMONTHS:["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"], WEEKDAYS:["\u661f\u671f\u65e5", "\u661f\u671f\u4e00", 
"\u661f\u671f\u4e8c", "\u661f\u671f\u4e09", "\u661f\u671f\u56db", "\u661f\u671f\u4e94", "\u661f\u671f\u516d"], STANDALONEWEEKDAYS:["\u661f\u671f\u65e5", "\u661f\u671f\u4e00", "\u661f\u671f\u4e8c", "\u661f\u671f\u4e09", "\u661f\u671f\u56db", "\u661f\u671f\u4e94", "\u661f\u671f\u516d"], SHORTWEEKDAYS:["\u9031\u65e5", "\u9031\u4e00", "\u9031\u4e8c", "\u9031\u4e09", "\u9031\u56db", "\u9031\u4e94", "\u9031\u516d"], STANDALONESHORTWEEKDAYS:["\u9031\u65e5", "\u9031\u4e00", "\u9031\u4e8c", "\u9031\u4e09", 
"\u9031\u56db", "\u9031\u4e94", "\u9031\u516d"], NARROWWEEKDAYS:["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d"], STANDALONENARROWWEEKDAYS:["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d"], SHORTQUARTERS:["1\u5b63", "2\u5b63", "3\u5b63", "4\u5b63"], QUARTERS:["\u7b2c1\u5b63", "\u7b2c2\u5b63", "\u7b2c3\u5b63", "\u7b2c4\u5b63"], AMPMS:["\u4e0a\u5348", "\u4e0b\u5348"], DATEFORMATS:["y\u5e74M\u6708d\u65e5EEEE", "y\u5e74M\u6708d\u65e5", "yyyy/M/d", "yy/M/d"], 
TIMEFORMATS:["zzzzah\u6642mm\u5206ss\u79d2", "zah\u6642mm\u5206ss\u79d2", "ah:mm:ss", "ah:mm"], AVAILABLEFORMATS:{Md:"M/d", MMMMd:"MMMMd\u65e5", MMMd:"MMMd\u65e5"}, FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols = goog.LOCALE == "ar" ? goog.i18n.DateTimeSymbols_ar : goog.LOCALE == "bg" ? goog.i18n.DateTimeSymbols_bg : goog.LOCALE == "bn" ? goog.i18n.DateTimeSymbols_bn : goog.LOCALE == "ca" ? goog.i18n.DateTimeSymbols_ca : goog.LOCALE == "cs" ? goog.i18n.DateTimeSymbols_cs : goog.LOCALE == "da" ? goog.i18n.DateTimeSymbols_da : goog.LOCALE == "de" ? goog.i18n.DateTimeSymbols_de : goog.LOCALE == "de_AT" || goog.LOCALE == "de-AT" ? goog.i18n.DateTimeSymbols_de_AT : goog.LOCALE == "de_CH" || 
goog.LOCALE == "de-CH" ? goog.i18n.DateTimeSymbols_de : goog.LOCALE == "el" ? goog.i18n.DateTimeSymbols_el : goog.LOCALE == "en" ? goog.i18n.DateTimeSymbols_en : goog.LOCALE == "en_AU" || goog.LOCALE == "en-AU" ? goog.i18n.DateTimeSymbols_en_AU : goog.LOCALE == "en_GB" || goog.LOCALE == "en-GB" ? goog.i18n.DateTimeSymbols_en_GB : goog.LOCALE == "en_IE" || goog.LOCALE == "en-IE" ? goog.i18n.DateTimeSymbols_en_IE : goog.LOCALE == "en_IN" || goog.LOCALE == "en-IN" ? goog.i18n.DateTimeSymbols_en_IN : 
goog.LOCALE == "en_SG" || goog.LOCALE == "en-SG" ? goog.i18n.DateTimeSymbols_en : goog.LOCALE == "en_US" || goog.LOCALE == "en-US" ? goog.i18n.DateTimeSymbols_en : goog.LOCALE == "en_ZA" || goog.LOCALE == "en-ZA" ? goog.i18n.DateTimeSymbols_en_ZA : goog.LOCALE == "es" ? goog.i18n.DateTimeSymbols_es : goog.LOCALE == "et" ? goog.i18n.DateTimeSymbols_et : goog.LOCALE == "eu" ? goog.i18n.DateTimeSymbols_eu : goog.LOCALE == "fa" ? goog.i18n.DateTimeSymbols_fa : goog.LOCALE == "fi" ? goog.i18n.DateTimeSymbols_fi : 
goog.LOCALE == "fil" ? goog.i18n.DateTimeSymbols_fil : goog.LOCALE == "fr" ? goog.i18n.DateTimeSymbols_fr : goog.LOCALE == "fr_CA" || goog.LOCALE == "fr-CA" ? goog.i18n.DateTimeSymbols_fr_CA : goog.LOCALE == "gl" ? goog.i18n.DateTimeSymbols_gl : goog.LOCALE == "gsw" ? goog.i18n.DateTimeSymbols_gsw : goog.LOCALE == "gu" ? goog.i18n.DateTimeSymbols_gu : goog.LOCALE == "he" ? goog.i18n.DateTimeSymbols_he : goog.LOCALE == "hi" ? goog.i18n.DateTimeSymbols_hi : goog.LOCALE == "hr" ? goog.i18n.DateTimeSymbols_hr : 
goog.LOCALE == "hu" ? goog.i18n.DateTimeSymbols_hu : goog.LOCALE == "id" ? goog.i18n.DateTimeSymbols_id : goog.LOCALE == "in" ? goog.i18n.DateTimeSymbols_in : goog.LOCALE == "is" ? goog.i18n.DateTimeSymbols_is : goog.LOCALE == "it" ? goog.i18n.DateTimeSymbols_it : goog.LOCALE == "iw" ? goog.i18n.DateTimeSymbols_iw : goog.LOCALE == "ja" ? goog.i18n.DateTimeSymbols_ja : goog.LOCALE == "kn" ? goog.i18n.DateTimeSymbols_kn : goog.LOCALE == "ko" ? goog.i18n.DateTimeSymbols_ko : goog.LOCALE == "ln" ? goog.i18n.DateTimeSymbols_ln : 
goog.LOCALE == "lt" ? goog.i18n.DateTimeSymbols_lt : goog.LOCALE == "lv" ? goog.i18n.DateTimeSymbols_lv : goog.LOCALE == "ml" ? goog.i18n.DateTimeSymbols_ml : goog.LOCALE == "mo" ? goog.i18n.DateTimeSymbols_mo : goog.LOCALE == "mr" ? goog.i18n.DateTimeSymbols_mr : goog.LOCALE == "ms" ? goog.i18n.DateTimeSymbols_ms : goog.LOCALE == "mt" ? goog.i18n.DateTimeSymbols_mt : goog.LOCALE == "nl" ? goog.i18n.DateTimeSymbols_nl : goog.LOCALE == "no" ? goog.i18n.DateTimeSymbols_no : goog.LOCALE == "or" ? goog.i18n.DateTimeSymbols_or : 
goog.LOCALE == "pl" ? goog.i18n.DateTimeSymbols_pl : goog.LOCALE == "pt" ? goog.i18n.DateTimeSymbols_pt : goog.LOCALE == "pt_BR" || goog.LOCALE == "pt-BR" ? goog.i18n.DateTimeSymbols_pt : goog.LOCALE == "pt_PT" || goog.LOCALE == "pt-PT" ? goog.i18n.DateTimeSymbols_pt_PT : goog.LOCALE == "ro" ? goog.i18n.DateTimeSymbols_ro : goog.LOCALE == "ru" ? goog.i18n.DateTimeSymbols_ru : goog.LOCALE == "sk" ? goog.i18n.DateTimeSymbols_sk : goog.LOCALE == "sl" ? goog.i18n.DateTimeSymbols_sl : goog.LOCALE == "sq" ? 
goog.i18n.DateTimeSymbols_sq : goog.LOCALE == "sr" ? goog.i18n.DateTimeSymbols_sr : goog.LOCALE == "sv" ? goog.i18n.DateTimeSymbols_sv : goog.LOCALE == "ta" ? goog.i18n.DateTimeSymbols_ta : goog.LOCALE == "te" ? goog.i18n.DateTimeSymbols_te : goog.LOCALE == "th" ? goog.i18n.DateTimeSymbols_th : goog.LOCALE == "tl" ? goog.i18n.DateTimeSymbols_tl : goog.LOCALE == "tr" ? goog.i18n.DateTimeSymbols_tr : goog.LOCALE == "uk" ? goog.i18n.DateTimeSymbols_uk : goog.LOCALE == "ur" ? goog.i18n.DateTimeSymbols_ur : 
goog.LOCALE == "vi" ? goog.i18n.DateTimeSymbols_vi : goog.LOCALE == "zh" ? goog.i18n.DateTimeSymbols_zh : goog.LOCALE == "zh_CN" || goog.LOCALE == "zh-CN" ? goog.i18n.DateTimeSymbols_zh : goog.LOCALE == "zh_HK" || goog.LOCALE == "zh-HK" ? goog.i18n.DateTimeSymbols_zh_HK : goog.LOCALE == "zh_TW" || goog.LOCALE == "zh-TW" ? goog.i18n.DateTimeSymbols_zh_TW : goog.i18n.DateTimeSymbols_en;goog.i18n.TimeZone = function() {
};
goog.i18n.TimeZone.MILLISECONDS_PER_HOUR_ = 36E5;
goog.i18n.TimeZone.NameType = {STD_SHORT_NAME:0, STD_LONG_NAME:1, DLT_SHORT_NAME:2, DLT_LONG_NAME:3};
goog.i18n.TimeZone.createTimeZone = function(b) {
  if(typeof b == "number") {
    return goog.i18n.TimeZone.createSimpleTimeZone_(b)
  }var c = new goog.i18n.TimeZone;
  c.timeZoneId_ = b.id;
  c.standardOffset_ = -b.std_offset;
  c.tzNames_ = b.names;
  c.transitions_ = b.transitions;
  return c
};
goog.i18n.TimeZone.createSimpleTimeZone_ = function(b) {
  var c = new goog.i18n.TimeZone;
  c.standardOffset_ = b;
  c.timeZoneId_ = goog.i18n.TimeZone.composePosixTimeZoneID_(b);
  b = goog.i18n.TimeZone.composeUTCString_(b);
  c.tzNames_ = [b, b];
  c.transitions_ = [];
  return c
};
goog.i18n.TimeZone.composeGMTString_ = function(b) {
  var c = ["GMT"];
  c.push(b <= 0 ? "+" : "-");
  b = Math.abs(b);
  c.push(goog.string.padNumber(Math.floor(b / 60) % 100, 2), ":", goog.string.padNumber(b % 60, 2));
  return c.join("")
};
goog.i18n.TimeZone.composePosixTimeZoneID_ = function(b) {
  if(b == 0) {
    return"Etc/GMT"
  }var c = ["Etc/GMT", b < 0 ? "-" : "+"];
  b = Math.abs(b);
  c.push(Math.floor(b / 60) % 100);
  b %= 60;
  b != 0 && c.push(":", goog.string.padNumber(b, 2));
  return c.join("")
};
goog.i18n.TimeZone.composeUTCString_ = function(b) {
  if(b == 0) {
    return"UTC"
  }var c = ["UTC", b < 0 ? "+" : "-"];
  b = Math.abs(b);
  c.push(Math.floor(b / 60) % 100);
  b %= 60;
  b != 0 && c.push(":", b);
  return c.join("")
};
a = goog.i18n.TimeZone.prototype;
a.getTimeZoneData = function() {
  return{id:this.timeZoneId_, std_offset:-this.standardOffset_, names:goog.array.clone(this.tzNames_), transitions:goog.array.clone(this.transitions_)}
};
a.getDaylightAdjustment = function(b) {
  b = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate(), b.getUTCHours(), b.getUTCMinutes()) / goog.i18n.TimeZone.MILLISECONDS_PER_HOUR_;
  for(var c = 0;c < this.transitions_.length && b >= this.transitions_[c];) {
    c += 2
  }return c == 0 ? 0 : this.transitions_[c - 1]
};
a.getGMTString = function(b) {
  return goog.i18n.TimeZone.composeGMTString_(this.getOffset(b))
};
a.getLongName = function(b) {
  return this.tzNames_[this.isDaylightTime(b) ? goog.i18n.TimeZone.NameType.DLT_LONG_NAME : goog.i18n.TimeZone.NameType.STD_LONG_NAME]
};
a.getOffset = function(b) {
  return this.standardOffset_ - this.getDaylightAdjustment(b)
};
a.getRFCTimeZoneString = function(b) {
  b = -this.getOffset(b);
  var c = [b < 0 ? "-" : "+"];
  b = Math.abs(b);
  c.push(goog.string.padNumber(Math.floor(b / 60) % 100, 2), goog.string.padNumber(b % 60, 2));
  return c.join("")
};
a.getShortName = function(b) {
  return this.tzNames_[this.isDaylightTime(b) ? goog.i18n.TimeZone.NameType.DLT_SHORT_NAME : goog.i18n.TimeZone.NameType.STD_SHORT_NAME]
};
a.getTimeZoneId = function() {
  return this.timeZoneId_
};
a.isDaylightTime = function(b) {
  return this.getDaylightAdjustment(b) > 0
};goog.i18n.DateTimeFormat = function(b) {
  goog.asserts.assert(goog.isDef(b), "Pattern must be defined");
  this.patternParts_ = [];
  typeof b == "number" ? this.applyStandardPattern_(b) : this.applyPattern_(b)
};
goog.i18n.DateTimeFormat.Format = {FULL_DATE:0, LONG_DATE:1, MEDIUM_DATE:2, SHORT_DATE:3, FULL_TIME:4, LONG_TIME:5, MEDIUM_TIME:6, SHORT_TIME:7, FULL_DATETIME:8, LONG_DATETIME:9, MEDIUM_DATETIME:10, SHORT_DATETIME:11};
goog.i18n.DateTimeFormat.TOKENS_ = [/^\'(?:[^\']|\'\')*\'/, /^(?:G+|y+|M+|k+|S+|E+|a+|h+|K+|H+|c+|L+|Q+|d+|m+|s+|v+|z+|Z+)/, /^[^\'GyMkSEahKHcLQdmsvzZ]+/];
goog.i18n.DateTimeFormat.PartTypes_ = {QUOTED_STRING:0, FIELD:1, LITERAL:2};
a = goog.i18n.DateTimeFormat.prototype;
a.applyPattern_ = function(b) {
  for(;b;) {
    for(var c = 0;c < goog.i18n.DateTimeFormat.TOKENS_.length;++c) {
      var d = b.match(goog.i18n.DateTimeFormat.TOKENS_[c]);
      if(d) {
        d = d[0];
        b = b.substring(d.length);
        if(c == goog.i18n.DateTimeFormat.PartTypes_.QUOTED_STRING) {
          if(d == "''") {
            d = "'"
          }else {
            d = d.substring(1, d.length - 1);
            d = d.replace(/\'\'/, "'")
          }
        }this.patternParts_.push({text:d, type:c});
        break
      }
    }
  }
};
a.format = function(b, c) {
  var d = c ? (b.getTimezoneOffset() - c.getOffset(b)) * 6E4 : 0, e = d ? new Date(b.getTime() + d) : b, f = e;
  if(c && e.getTimezoneOffset() != b.getTimezoneOffset()) {
    d += d > 0 ? -86400000 : 864E5;
    f = new Date(b.getTime() + d)
  }d = [];
  for(var g = 0;g < this.patternParts_.length;++g) {
    var h = this.patternParts_[g].text;
    goog.i18n.DateTimeFormat.PartTypes_.FIELD == this.patternParts_[g].type ? d.push(this.formatField_(h, b, e, f, c)) : d.push(h)
  }return d.join("")
};
a.applyStandardPattern_ = function(b) {
  if(b < 4) {
    b = goog.i18n.DateTimeSymbols.DATEFORMATS[b]
  }else {
    if(b < 8) {
      b = goog.i18n.DateTimeSymbols.TIMEFORMATS[b - 4]
    }else {
      if(b < 12) {
        b = goog.i18n.DateTimeSymbols.DATEFORMATS[b - 8] + " " + goog.i18n.DateTimeSymbols.TIMEFORMATS[b - 8]
      }else {
        this.applyStandardPattern_(goog.i18n.DateTimeFormat.Format.MEDIUM_DATETIME);
        return
      }
    }
  }this.applyPattern_(b)
};
a.formatEra_ = function(b, c) {
  c = c.getFullYear() > 0 ? 1 : 0;
  return b >= 4 ? goog.i18n.DateTimeSymbols.ERANAMES[c] : goog.i18n.DateTimeSymbols.ERAS[c]
};
a.formatYear_ = function(b, c) {
  c = c.getFullYear();
  if(c < 0) {
    c = -c
  }return b == 2 ? goog.string.padNumber(c % 100, 2) : String(c)
};
a.formatMonth_ = function(b, c) {
  c = c.getMonth();
  switch(b) {
    case 5:
      return goog.i18n.DateTimeSymbols.NARROWMONTHS[c];
    case 4:
      return goog.i18n.DateTimeSymbols.MONTHS[c];
    case 3:
      return goog.i18n.DateTimeSymbols.SHORTMONTHS[c];
    default:
      return goog.string.padNumber(c + 1, b)
  }
};
a.format24Hours_ = function(b, c) {
  return goog.string.padNumber(c.getHours() || 24, b)
};
a.formatFractionalSeconds_ = function(b, c) {
  return(c.getTime() % 1E3 / 1E3).toFixed(Math.min(3, b)).substr(2) + (b > 3 ? goog.string.padNumber(0, b - 3) : "")
};
a.formatDayOfWeek_ = function(b, c) {
  c = c.getDay();
  return b >= 4 ? goog.i18n.DateTimeSymbols.WEEKDAYS[c] : goog.i18n.DateTimeSymbols.SHORTWEEKDAYS[c]
};
a.formatAmPm_ = function(b, c) {
  b = c.getHours();
  return goog.i18n.DateTimeSymbols.AMPMS[b >= 12 && b < 24 ? 1 : 0]
};
a.format1To12Hours_ = function(b, c) {
  return goog.string.padNumber(c.getHours() % 12 || 12, b)
};
a.format0To11Hours_ = function(b, c) {
  return goog.string.padNumber(c.getHours() % 12, b)
};
a.format0To23Hours_ = function(b, c) {
  return goog.string.padNumber(c.getHours(), b)
};
a.formatStandaloneDay_ = function(b, c) {
  c = c.getDay();
  switch(b) {
    case 5:
      return goog.i18n.DateTimeSymbols.STANDALONENARROWWEEKDAYS[c];
    case 4:
      return goog.i18n.DateTimeSymbols.STANDALONEWEEKDAYS[c];
    case 3:
      return goog.i18n.DateTimeSymbols.STANDALONESHORTWEEKDAYS[c];
    default:
      return goog.string.padNumber(c, 1)
  }
};
a.formatStandaloneMonth_ = function(b, c) {
  c = c.getMonth();
  switch(b) {
    case 5:
      return goog.i18n.DateTimeSymbols.STANDALONENARROWMONTHS[c];
    case 4:
      return goog.i18n.DateTimeSymbols.STANDALONEMONTHS[c];
    case 3:
      return goog.i18n.DateTimeSymbols.STANDALONESHORTMONTHS[c];
    default:
      return goog.string.padNumber(c + 1, b)
  }
};
a.formatQuarter_ = function(b, c) {
  c = Math.floor(c.getMonth() / 3);
  return b < 4 ? goog.i18n.DateTimeSymbols.SHORTQUARTERS[c] : goog.i18n.DateTimeSymbols.QUARTERS[c]
};
a.formatDate_ = function(b, c) {
  return goog.string.padNumber(c.getDate(), b)
};
a.formatMinutes_ = function(b, c) {
  return goog.string.padNumber(c.getMinutes(), b)
};
a.formatSeconds_ = function(b, c) {
  return goog.string.padNumber(c.getSeconds(), b)
};
a.formatTimeZoneRFC_ = function(b, c, d) {
  d = d || goog.i18n.TimeZone.createTimeZone(c.getTimezoneOffset());
  return b < 4 ? d.getRFCTimeZoneString(c) : d.getGMTString(c)
};
a.formatTimeZone_ = function(b, c, d) {
  d = d || goog.i18n.TimeZone.createTimeZone(c.getTimezoneOffset());
  return b < 4 ? d.getShortName(c) : d.getLongName(c)
};
a.formatTimeZoneId_ = function(b, c) {
  c = c || goog.i18n.TimeZone.createTimeZone(b.getTimezoneOffset());
  return c.getTimeZoneId()
};
a.formatField_ = function(b, c, d, e, f) {
  var g = b.length;
  switch(b.charAt(0)) {
    case "G":
      return this.formatEra_(g, d);
    case "y":
      return this.formatYear_(g, d);
    case "M":
      return this.formatMonth_(g, d);
    case "k":
      return this.format24Hours_(g, e);
    case "S":
      return this.formatFractionalSeconds_(g, e);
    case "E":
      return this.formatDayOfWeek_(g, d);
    case "a":
      return this.formatAmPm_(g, e);
    case "h":
      return this.format1To12Hours_(g, e);
    case "K":
      return this.format0To11Hours_(g, e);
    case "H":
      return this.format0To23Hours_(g, e);
    case "c":
      return this.formatStandaloneDay_(g, d);
    case "L":
      return this.formatStandaloneMonth_(g, d);
    case "Q":
      return this.formatQuarter_(g, d);
    case "d":
      return this.formatDate_(g, d);
    case "m":
      return this.formatMinutes_(g, e);
    case "s":
      return this.formatSeconds_(g, e);
    case "v":
      return this.formatTimeZoneId_(c, f);
    case "z":
      return this.formatTimeZone_(g, c, f);
    case "Z":
      return this.formatTimeZoneRFC_(g, c, f);
    default:
      return""
  }
};jchemhub.io.mdl = {};
jchemhub.io.mdl.SINGLE_BOND = 1;
jchemhub.io.mdl.DOUBLE_BOND = 2;
jchemhub.io.mdl.TRIPLE_BOND = 3;
jchemhub.io.mdl.AROMATIC_BOND = 4;
jchemhub.io.mdl.SINGLE_OR_DOUBLE = 5;
jchemhub.io.mdl.SINGLE_OR_AROMATIC = 6;
jchemhub.io.mdl.DOUBLE_OR_AROMATIC = 7;
jchemhub.io.mdl.ANY = 8;
jchemhub.io.mdl.TRIPLE_BOND = 3;
jchemhub.io.mdl.NOT_STEREO = 0;
jchemhub.io.mdl.SINGLE_BOND_UP = 1;
jchemhub.io.mdl.SINGLE_BOND_UP_OR_DOWN = 4;
jchemhub.io.mdl.SINGLE_BOND_DOWN = 6;
jchemhub.io.mdl.getTypeCode = function(b) {
  if(b instanceof jchemhub.model.SingleBond) {
    return jchemhub.io.mdl.SINGLE_BOND
  }if(b instanceof jchemhub.model.DoubleBond) {
    return jchemhub.io.mdl.DOUBLE_BOND
  }if(b instanceof jchemhub.model.TripleBond) {
    return jchemhub.io.mdl.TRIPLE_BOND
  }if(b instanceof jchemhub.model.AromaticBond) {
    return jchemhub.io.mdl.AROMATIC_BOND
  }throw new Error("Invalid bond type [" + b + "]");
};
jchemhub.io.mdl.getStereoCode = function(b) {
  if(b instanceof jchemhub.model.SingleBondUp) {
    return jchemhub.io.mdl.SINGLE_BOND_UP
  }if(b instanceof jchemhub.model.SingleBondDown) {
    return jchemhub.io.mdl.SINGLE_BOND_DOWN
  }if(b instanceof jchemhub.model.SingleBondUpOrDown) {
    return jchemhub.io.mdl.SINGLE_BOND_UP_OR_DOWN
  }return jchemhub.io.mdl.NOT_STEREO
};
jchemhub.io.mdl.createBond = function(b, c, d, e) {
  switch(b) {
    case jchemhub.io.mdl.SINGLE_BOND:
      switch(c) {
        case jchemhub.io.mdl.NOT_STEREO:
          return new jchemhub.model.SingleBond(d, e);
        case jchemhub.io.mdl.SINGLE_BOND_UP:
          return new jchemhub.model.SingleBondUp(d, e);
        case jchemhub.io.mdl.SINGLE_BOND_UP_OR_DOWN:
          return new jchemhub.model.SingleBondUpOrDown(d, e);
        case jchemhub.io.mdl.SINGLE_BOND_DOWN:
          return new jchemhub.model.SingleBondDown(d, e);
        default:
          throw new Error("invalid bond type/stereo [" + b + "]/[" + c + "]");
      }
    ;
    case jchemhub.io.mdl.DOUBLE_BOND:
      return new jchemhub.model.DoubleBond(d, e);
    case jchemhub.io.mdl.TRIPLE_BOND:
      return new jchemhub.model.TripleBond(d, e);
    case jchemhub.io.mdl.AROMATIC_BOND:
      return new jchemhub.model.AromaticBond(d, e);
    case jchemhub.io.mdl.SINGLE_OR_DOUBLE:
      throw new Error("type not implemented [" + b + "]");;
    case jchemhub.io.mdl.SINGLE_OR_AROMATIC:
      throw new Error("type not implemented [" + b + "]");;
    case jchemhub.io.mdl.DOUBLE_OR_AROMATIC:
      throw new Error("type not implemented [" + b + "]");;
    case jchemhub.io.mdl.ANY:
      throw new Error("type not implemented [" + b + "]");;
    default:
      throw new Error("invalid bond type/stereo [" + b + "]/[" + c + "]");
  }
};
jchemhub.io.mdl.readMolfile = function(b) {
  var c = b.indexOf("\r\n") > 0 ? "\r\n" : "\n";
  b = b.split(c);
  c = new jchemhub.model.Molecule(b[0]);
  for(var d = parseInt(b[3].substr(0, 3)), e = parseInt(b[3].substr(3, 3)), f = 1;f <= d;f++) {
    var g = b[f + 3], h = g.substr(30, 4).replace(/(^\s*)|(\s*$)/g, ""), j = parseFloat(g.substr(0, 10)), k = parseFloat(g.substr(10, 10));
    parseInt(g.substr(34, 2));
    g = parseInt(g.substr(36, 3));
    var l = 0;
    if(g != 0) {
      if(g == 1) {
        l = 3
      }else {
        if(g == 2) {
          l = 2
        }else {
          if(g == 3) {
            l = 1
          }else {
            if(g != 4) {
              if(g == 5) {
                l = -1
              }else {
                if(g == 6) {
                  l = -2
                }else {
                  if(g == 7) {
                    l = -3
                  }
                }
              }
            }
          }
        }
      }
    }g = new jchemhub.model.Atom(h, j, k, l);
    c.addAtom(g)
  }for(f = 1;f <= e;f++) {
    g = b[f + 3 + d];
    l = c.getAtom(parseInt(g.substr(0, 3)) - 1);
    h = c.getAtom(parseInt(g.substr(3, 3)) - 1);
    j = parseInt(g.substr(6, 3));
    g = parseInt(g.substr(9, 3));
    g = jchemhub.io.mdl.createBond(j, g, l, h);
    c.addBond(g)
  }f = 4 + d + e;
  d = b.length;
  for(e = false;;) {
    g = b[f++];
    if(f == d || g.indexOf("M  END") >= 0) {
      break
    }if(g.indexOf("M  CHG") >= 0) {
      if(!e) {
        e = 0;
        for(l = c.countAtoms();e < l;e++) {
          c.getAtom(e).charge = 0
        }e = true
      }h = parseInt(g.substr(6, 3));
      for(j = 0;j < h;j++) {
        k = parseInt(g.substr(10 + 8 * j, 3));
        l = parseInt(g.substr(14 + 8 * j, 3));
        c.getAtom(k - 1).charge = l
      }
    }
  }return c
};
jchemhub.io.mdl.writeMolfile = function(b) {
  var c = new String, d = new String, e = new String;
  c = new String;
  var f = new String;
  e = new Date;
  d = b.name + "\n";
  e = " JChemHub" + (new goog.i18n.DateTimeFormat("mmddyyHHMM")).format(e) + "\n";
  d = d + e + "\n";
  e = (goog.string.repeat(" ", 3) + b.countAtoms()).slice(-3);
  var g = (goog.string.repeat(" ", 3) + b.countBonds()).slice(-3);
  e = e + g + "  0  0  0  0            999 V2000\n";
  for(i = 0;i < b.countAtoms();i++) {
    var h = b.getAtom(i);
    g = (goog.string.repeat(" ", 10) + h.coord.x.toFixed(4)).slice(-10);
    var j = (goog.string.repeat(" ", 10) + h.coord.y.toFixed(4)).slice(-10), k = (goog.string.repeat(" ", 10) + (0).toFixed(4)).slice(-10);
    h = (goog.string.repeat(" ", 3) + h.symbol).slice(-3);
    c += g + j + k + h + "\n"
  }for(i = 0;i < b.countBonds();i++) {
    g = b.getBond(i);
    j = b.indexOfAtom(g.source) + 1;
    j = (goog.string.repeat(" ", 3) + j).slice(-3);
    k = b.indexOfAtom(g.target) + 1;
    k = (goog.string.repeat(" ", 3) + k).slice(-3);
    h = (goog.string.repeat(" ", 3) + jchemhub.io.mdl.getTypeCode(g)).slice(-3);
    g = (goog.string.repeat(" ", 3) + jchemhub.io.mdl.getStereoCode(g)).slice(-3);
    f += j + k + h + g + "\n"
  }return c = d + e + c + f
};
jchemhub.io.mdl.readRxnfile = function(b) {
  var c = b.indexOf("\r\n") > 0 ? "\r\n" : "\n", d = b.split(c, 5);
  if(d[0].indexOf("$RXN") < 0) {
    throw"not a RXN file";
  }var e = new jchemhub.model.Reaction;
  e.header = d[2] + c + d[3];
  var f = parseInt(d[4].substr(0, 3));
  d = parseInt(d[4].substr(3, 3));
  b = b.split("$MOL" + c);
  c = 1;
  for(var g = f;c <= g;c++) {
    var h = jchemhub.io.mdl.readMolfile(b[c]);
    e.addReactant(h)
  }c = 1;
  for(g = d;c <= g;c++) {
    h = jchemhub.io.mdl.readMolfile(b[c + f]);
    e.addProduct(h)
  }return e
};jchemhub.controller = {};
jchemhub.controller.Controller = function(b, c) {
  this._view = new jchemhub.view.ReactionEditor(b, c)
};
jchemhub.controller.Controller.prototype.getModel = function() {
  return this._model
};
jchemhub.controller.Controller.prototype.clear = function() {
  this._model = null;
  this._view.clear()
};
jchemhub.controller.Controller.prototype.setModel = function(b) {
  this._model = b;
  this._view.setModel(b);
  this._view.layoutAndRender()
};
jchemhub.controller.Controller.buildReactionDrawing = function(b) {
  return new jchemhub.view.ReactionDrawing(b)
};
jchemhub.controller.Controller.buildMoleculeDrawing = function(b) {
  return new jchemhub.view.MoleculeDrawing(b)
};
jchemhub.controller.Controller.createBondDrawing = function(b) {
  if(b instanceof jchemhub.model.SingleBondUp) {
    return new jchemhub.view.SingleBondUpDrawing(b)
  }if(b instanceof jchemhub.model.SingleBondDown) {
    return new jchemhub.view.SingleBondDownDrawing(b)
  }if(b instanceof jchemhub.model.SingleBondUpOrDown) {
    return new jchemhub.view.SingleBondEitherDrawing(b)
  }if(b instanceof jchemhub.model.SingleBond) {
    return new jchemhub.view.SingleBondDrawing(b)
  }if(b instanceof jchemhub.model.DoubleBond) {
    return new jchemhub.view.DoubleBondDrawing(b)
  }if(b instanceof jchemhub.model.TripleBond) {
    return new jchemhub.view.TripleBondDrawing(b)
  }
};
