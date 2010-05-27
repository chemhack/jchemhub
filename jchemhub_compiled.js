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
  for(var e = b.length, f = [], g = 0, h = goog.isString(b) ? b.split("") : b, i = 0;i < e;i++) {
    if(i in h) {
      var j = h[i];
      if(c.call(d, j, i, b)) {
        f[g++] = j
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
    var h = d[g], i = e[g];
    if(h != i) {
      b = parseInt(h, 10);
      if(!isNaN(b)) {
        c = parseInt(i, 10);
        if(!isNaN(c) && b - c) {
          return b - c
        }
      }return h < i ? -1 : 1
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
    var g = b[f] || "", h = c[f] || "", i = new RegExp("(\\d*)(\\D*)", "g"), j = new RegExp("(\\d*)(\\D*)", "g");
    do {
      var l = i.exec(g) || ["", "", ""], k = j.exec(h) || ["", "", ""];
      if(l[0].length == 0 && k[0].length == 0) {
        break
      }d = l[1].length == 0 ? 0 : parseInt(l[1], 10);
      var n = k[1].length == 0 ? 0 : parseInt(k[1], 10);
      d = goog.string.compareElements_(d, n) || goog.string.compareElements_(l[2].length == 0, k[2].length == 0) || goog.string.compareElements_(l[2], k[2])
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
    var m = function(o) {
      return h.call(m.src, m.key, o)
    };
    return m
  }
  function e() {
    return new goog.events.Listener
  }
  function f() {
    return new goog.events.BrowserEvent
  }
  var g = goog.userAgent.jscript.HAS_JSCRIPT && !goog.userAgent.jscript.isVersion("5.7"), h;
  goog.events.pools.setProxyCallbackFunction = function(m) {
    h = m
  };
  if(g) {
    goog.events.pools.getObject = function() {
      return i.getObject()
    };
    goog.events.pools.releaseObject = function(m) {
      i.releaseObject(m)
    };
    goog.events.pools.getArray = function() {
      return j.getObject()
    };
    goog.events.pools.releaseArray = function(m) {
      j.releaseObject(m)
    };
    goog.events.pools.getProxy = function() {
      return l.getObject()
    };
    goog.events.pools.releaseProxy = function() {
      l.releaseObject(d())
    };
    goog.events.pools.getListener = function() {
      return k.getObject()
    };
    goog.events.pools.releaseListener = function(m) {
      k.releaseObject(m)
    };
    goog.events.pools.getEvent = function() {
      return n.getObject()
    };
    goog.events.pools.releaseEvent = function(m) {
      n.releaseObject(m)
    };
    var i = new goog.structs.SimplePool(0, 600);
    i.setCreateObjectFn(b);
    var j = new goog.structs.SimplePool(0, 600);
    j.setCreateObjectFn(c);
    var l = new goog.structs.SimplePool(0, 600);
    l.setCreateObjectFn(d);
    var k = new goog.structs.SimplePool(0, 600);
    k.setCreateObjectFn(e);
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
      var i = goog.getUid(b), j;
      h.remaining_++;
      if(h[i]) {
        j = h[i];
        for(g = 0;g < j.length;g++) {
          h = j[g];
          if(h.listener == d && h.handler == f) {
            if(h.removed) {
              break
            }return j[g].key
          }
        }
      }else {
        j = h[i] = goog.events.pools.getArray();
        h.count_++
      }g = goog.events.pools.getProxy();
      g.src = b;
      h = goog.events.pools.getListener();
      h.init(d, g, b, c, e, f);
      d = h.key;
      g.key = d;
      j.push(h);
      goog.events.listeners_[d] = h;
      goog.events.sources_[i] || (goog.events.sources_[i] = goog.events.pools.getArray());
      goog.events.sources_[i].push(h);
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
    goog.object.forEach(goog.events.sources_, function(j) {
      for(var l = j.length - 1;l >= 0;l--) {
        var k = j[l];
        if((g || c == k.type) && (h || d == k.capture)) {
          goog.events.unlistenByKey(k.key);
          e++
        }
      }
    })
  }else {
    b = goog.getUid(b);
    if(goog.events.sources_[b]) {
      b = goog.events.sources_[b];
      for(f = b.length - 1;f >= 0;f--) {
        var i = b[f];
        if((g || c == i.type) && (h || d == i.capture)) {
          goog.events.unlistenByKey(i.key);
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
      for(var h = b.length, i = 0;i < h;i++) {
        var j = b[i];
        if(j && !j.removed) {
          g &= goog.events.fireListener(j, f) !== false
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
    for(var i = e.length - 1;!c.propagationStopped_ && i >= 0 && h.remaining_;i--) {
      c.currentTarget = e[i];
      d &= goog.events.fireListeners_(h, e[i], c.type, true, c) && c.returnValue_ != false
    }
  }if(false in g) {
    h = g[false];
    h.remaining_ = h.count_;
    if(f) {
      for(i = 0;!c.propagationStopped_ && i < e.length && h.remaining_;i++) {
        c.currentTarget = e[i];
        d &= goog.events.fireListeners_(h, e[i], c.type, false, c) && c.returnValue_ != false
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
    }var i = goog.events.pools.getEvent();
    i.init(f, this);
    f = true;
    try {
      if(c) {
        for(var j = goog.events.pools.getArray(), l = i.currentTarget;l;l = l.parentNode) {
          j.push(l)
        }g = e[true];
        g.remaining_ = g.count_;
        for(var k = j.length - 1;!i.propagationStopped_ && k >= 0 && g.remaining_;k--) {
          i.currentTarget = j[k];
          f &= goog.events.fireListeners_(g, j[k], d, true, i)
        }if(h) {
          g = e[false];
          g.remaining_ = g.count_;
          for(k = 0;!i.propagationStopped_ && k < j.length && g.remaining_;k++) {
            i.currentTarget = j[k];
            f &= goog.events.fireListeners_(g, j[k], d, false, i)
          }
        }
      }else {
        f = goog.events.fireListener(b, i)
      }
    }finally {
      if(j) {
        j.length = 0;
        goog.events.pools.releaseArray(j)
      }i.dispose();
      goog.events.pools.releaseEvent(i)
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
jchemhub.controller = {};
jchemhub.controller.AtomController = function(b) {
  goog.events.EventTarget.call(this);
  this.setParentEventTarget(b)
};
goog.inherits(jchemhub.controller.AtomController, goog.events.EventTarget);
jchemhub.controller.AtomController.prototype.handleMouseOver = function() {
  this.dispatchEvent(jchemhub.controller.AtomController.EventType.MOUSEOVER)
};
jchemhub.controller.AtomController.prototype.handleMouseOut = function() {
  this.dispatchEvent(jchemhub.controller.AtomController.EventType.MOUSEOUT)
};
jchemhub.controller.AtomController.EventType = {MOUSEOVER:"atom_mouseover", MOUSEOUT:"atom_mouseout"};
