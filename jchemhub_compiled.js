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
};goog.object = {};
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
      var m = k[1].length == 0 ? 0 : parseInt(k[1], 10);
      d = goog.string.compareElements_(d, m) || goog.string.compareElements_(l[2].length == 0, k[2].length == 0) || goog.string.compareElements_(l[2], k[2])
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
  var e = b.top, f = b.height, g = b.left + b.width, h = b.top + b.height, i = c.left + c.width, j = c.top + c.height;
  if(c.top > b.top) {
    d.push(new goog.math.Rect(b.left, b.top, b.width, c.top - b.top));
    e = c.top;
    f -= c.top - b.top
  }if(j < h) {
    d.push(new goog.math.Rect(b.left, j, b.width, h - j));
    f = j - e
  }c.left > b.left && d.push(new goog.math.Rect(b.left, e, c.left - b.left, f));
  i < g && d.push(new goog.math.Rect(i, e, g - i, f));
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
  d = d || function(k, m) {
    return k == m
  };
  e = e || function(k) {
    return b[k]
  };
  for(var f = b.length, g = c.length, h = [], i = 0;i < f + 1;i++) {
    h[i] = [];
    h[i][0] = 0
  }for(var j = 0;j < g + 1;j++) {
    h[0][j] = 0
  }for(i = 1;i <= f;i++) {
    for(j = 1;j <= f;j++) {
      h[i][j] = d(b[i - 1], c[j - 1]) ? h[i - 1][j - 1] + 1 : Math.max(h[i - 1][j], h[i][j - 1])
    }
  }var l = [];
  i = f;
  for(j = g;i > 0 && j > 0;) {
    if(d(b[i - 1], c[j - 1])) {
      l.unshift(e(i - 1, j - 1));
      i--;
      j--
    }else {
      if(h[i - 1][j] > h[i][j - 1]) {
        i--
      }else {
        j--
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
  for(var i = 0;i < e;i++) {
    var j = Math.cos(d), l = Math.sin(d), k = 4 / 3 * Math.sin(h / 2) / (1 + Math.cos(h / 2)), m = f + (j - k * l) * b, n = g + (l + k * j) * c;
    d += h;
    j = Math.cos(d);
    l = Math.sin(d);
    this.curveTo(m, n, f + (j + k * l) * b, g + (l - k * j) * c, f + j * b, g + l * c)
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
      var h = goog.style.getPageOffset(b), i = goog.style.getClientLeftTop(b);
      h.x += i.x;
      h.y += i.y;
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
};goog.debug = {};
goog.debug.errorHandlerWeakDep = {protectEntryPoint:function(b) {
  return b
}};goog.Disposable = function() {
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
};goog.events = {};
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
    var n = function(o) {
      return h.call(n.src, n.key, o)
    };
    return n
  }
  function e() {
    return new goog.events.Listener
  }
  function f() {
    return new goog.events.BrowserEvent
  }
  var g = goog.userAgent.jscript.HAS_JSCRIPT && !goog.userAgent.jscript.isVersion("5.7"), h;
  goog.events.pools.setProxyCallbackFunction = function(n) {
    h = n
  };
  if(g) {
    goog.events.pools.getObject = function() {
      return i.getObject()
    };
    goog.events.pools.releaseObject = function(n) {
      i.releaseObject(n)
    };
    goog.events.pools.getArray = function() {
      return j.getObject()
    };
    goog.events.pools.releaseArray = function(n) {
      j.releaseObject(n)
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
    goog.events.pools.releaseListener = function(n) {
      k.releaseObject(n)
    };
    goog.events.pools.getEvent = function() {
      return m.getObject()
    };
    goog.events.pools.releaseEvent = function(n) {
      m.releaseObject(n)
    };
    var i = new goog.structs.SimplePool(0, 600);
    i.setCreateObjectFn(b);
    var j = new goog.structs.SimplePool(0, 600);
    j.setCreateObjectFn(c);
    var l = new goog.structs.SimplePool(0, 600);
    l.setCreateObjectFn(d);
    var k = new goog.structs.SimplePool(0, 600);
    k.setCreateObjectFn(e);
    var m = new goog.structs.SimplePool(0, 600);
    m.setCreateObjectFn(f)
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
})();goog.events.listeners_ = {};
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
a.drawText = function(b, c, d, e, f, g, h, i, j, l, k) {
  var m = i.size / 2;
  d = h == "bottom" ? d + f - m : h == "center" ? d + f / 2 : d + m;
  return this.drawTextOnLine(b, c, d, c + e, d, g, i, j, l, k)
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
goog.graphics.CanvasEllipseElement = function(b, c, d, e, f, g, h, i) {
  goog.graphics.EllipseElement.call(this, b, c, h, i);
  this.cx_ = d;
  this.cy_ = e;
  this.rx_ = f;
  this.ry_ = g;
  this.path_ = new goog.graphics.Path;
  this.setUpPath_();
  this.pathElement_ = new goog.graphics.CanvasPathElement(null, c, this.path_, h, i)
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
goog.graphics.CanvasRectElement = function(b, c, d, e, f, g, h, i) {
  goog.graphics.RectElement.call(this, b, c, h, i);
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
goog.graphics.CanvasTextElement = function(b, c, d, e, f, g, h, i, j, l) {
  goog.graphics.TextElement.call(this, null, b, j, l);
  this.text_ = c;
  this.x1_ = d;
  this.y1_ = e;
  this.x2_ = f;
  this.y2_ = g;
  this.align_ = h || "left";
  this.font_ = i;
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
  var b = this.x1_, c = this.x2_, d = this.y1_, e = this.y2_, f = this.align_, g = this.font_, h = this.element_.style, i = this.getGraphics().getPixelScaleX(), j = this.getGraphics().getPixelScaleY();
  if(b == c) {
    h.lineHeight = "90%";
    this.innerElement_.style.verticalAlign = f == "center" ? "middle" : f == "left" ? d < e ? "top" : "bottom" : d < e ? "bottom" : "top";
    h.textAlign = "center";
    c = g.size * i;
    h.top = Math.round(Math.min(d, e) * j) + "px";
    h.left = Math.round((b - c / 2) * i) + "px";
    h.width = Math.round(c) + "px";
    h.height = Math.abs(d - e) * j + "px";
    h.fontSize = g.size * 0.6 * j + "pt"
  }else {
    h.lineHeight = "100%";
    this.innerElement_.style.verticalAlign = "top";
    h.textAlign = f;
    h.top = Math.round(((d + e) / 2 - g.size * 2 / 3) * j) + "px";
    h.left = Math.round(b * i) + "px";
    h.width = Math.round(Math.abs(c - b) * i) + "px";
    h.height = "auto";
    h.fontSize = g.size * j + "pt"
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
a.drawTextOnLine = function(b, c, d, e, f, g, h, i, j, l) {
  b = new goog.graphics.CanvasTextElement(this, b, c, d, e, f, g, h, i, j);
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
a.drawTextOnLine = function(b, c, d, e, f, g, h, i, j, l) {
  var k = Math.round(goog.math.angle(c, d, e, f));
  e = e - c;
  f = f - d;
  f = Math.round(Math.sqrt(e * e + f * f));
  var m = h.size;
  e = {"font-family":h.family, "font-size":m};
  var n = Math.round(m * 0.85);
  m = Math.round(d - m / 2 + n);
  n = c;
  if(g == "center") {
    n += Math.round(f / 2);
    e["text-anchor"] = "middle"
  }else {
    if(g == "right") {
      n += f;
      e["text-anchor"] = "end"
    }
  }e.x = n;
  e.y = m;
  if(h.bold) {
    e["font-weight"] = "bold"
  }if(h.italic) {
    e["font-style"] = "italic"
  }if(k != 0) {
    e.transform = "rotate(" + k + " " + c + " " + d + ")"
  }c = this.createSvgElement_("text", e);
  c.appendChild(this.dom_.getDocument().createTextNode(b));
  if(i == null && goog.userAgent.GECKO && goog.userAgent.MAC) {
    b = "black";
    if(j instanceof goog.graphics.SolidFill) {
      b = j.getColor()
    }i = new goog.graphics.Stroke(1, b)
  }j = new goog.graphics.SvgTextElement(c, this, i, j);
  this.append_(j, l);
  return j
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
goog.graphics.VmlEllipseElement = function(b, c, d, e, f, g, h, i) {
  this.id_ = b.id;
  goog.graphics.EllipseElement.call(this, b, c, h, i);
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
  var i = this.createVmlElement("oval");
  goog.graphics.VmlGraphics.setPositionAndSize(i, b - d, c - e, d * 2, e * 2);
  b = new goog.graphics.VmlEllipseElement(i, this, b, c, d, e, f, g);
  this.append_(b, h);
  return b
};
a.drawRect = function(b, c, d, e, f, g, h) {
  var i = this.createVmlElement("rect");
  goog.graphics.VmlGraphics.setPositionAndSize(i, b, c, d, e);
  b = new goog.graphics.VmlRectElement(i, this, f, g);
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
a.drawTextOnLine = function(b, c, d, e, f, g, h, i, j, l) {
  var k = this.createFullSizeElement_("shape"), m = this.createVmlElement("path");
  c = "M" + goog.graphics.VmlGraphics.toPosCoord(c) + "," + goog.graphics.VmlGraphics.toPosCoord(d) + "L" + goog.graphics.VmlGraphics.toPosCoord(e) + "," + goog.graphics.VmlGraphics.toPosCoord(f) + "E";
  goog.graphics.VmlGraphics.setAttribute(m, "v", c);
  goog.graphics.VmlGraphics.setAttribute(m, "textpathok", "true");
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
  k.appendChild(m);
  k.appendChild(c);
  b = new goog.graphics.VmlTextElement(k, this, i, j);
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
        var g = goog.graphics.VmlGraphics.toSizeCoord(e[0]), h = goog.graphics.VmlGraphics.toSizeCoord(e[1]), i = Math.round(e[2] * -65536);
        e = Math.round(e[3] * -65536);
        c.push("ae", d, f, g, h, i, e);
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
};var jchemhub = {};
jchemhub.config = {};
jchemhub.config.RenderParams = function() {
};
jchemhub.config.RenderParams.get = function() {
  return jchemhub.config.RenderParams.defaultValue
};
jchemhub.config.RenderParams.defaultValue = {zoomFactor:0.8, margin:0.05, bondDistance:3, showExplicitHydrogens:true, showImplicitHydrogens:true, drawEndCarbon:true, backgroundFill:new goog.graphics.SolidFill("#F0FFF0"), bondStroke:new goog.graphics.Stroke(2, "black"), upBondStroke:new goog.graphics.Stroke(1, "black"), upBondFill:new goog.graphics.SolidFill("black"), downBondStroke:new goog.graphics.Stroke(1, "black"), downBondFill:null, upOrDownBondStroke:new goog.graphics.Stroke(1, "black"), upOrDownBondFill:null, 
bondHighlightStroke:new goog.graphics.Stroke(2, "blue"), atomFont:new goog.graphics.Font(0, "Times"), atomSubFont:new goog.graphics.Font(0, "Times"), atomLabelStroke:null, atomLabelFill:{C:new goog.graphics.SolidFill("black"), N:new goog.graphics.SolidFill("blue"), O:new goog.graphics.SolidFill("red")}, atomTransparentCircleSize:9, atomHighlightStroke:new goog.graphics.Stroke(2, "blue"), transparentFill:new goog.graphics.SolidFill("blue", 1.0E-5)};
