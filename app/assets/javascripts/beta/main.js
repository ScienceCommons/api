/******/ (function(modules) { // webpackBootstrap
/******/ 	
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/ 		
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/ 		
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 		
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 		
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/ 	
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ 	
/******/ 	
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(74);

	var UserModel = __webpack_require__(17);
	var GoogleAnalytics = __webpack_require__(73);

	var App = {};

	App.pages = {
	  NotFound: __webpack_require__(69),
	  About: __webpack_require__(63),  
	  Article: __webpack_require__(64),
	  Author: __webpack_require__(65),
	  Home: __webpack_require__(66),
	  Login: __webpack_require__(67),
	  Logout: __webpack_require__(68),
	  Profile: __webpack_require__(70),
	  Search: __webpack_require__(71),
	  Signup: __webpack_require__(72)
	};

	App.showPage = function(pageName) {
	  var Page = {};

	  Page.controller = function() {
	    if (!CS.user && App.user) {
	      delete App.user;
	    } else if (CS.user && !App.user) {
	      App.user = new UserModel(CS.user);
	    }

	    if (!App.user && pageName !== "Login") {
	      this.currentPage = App.pages["Login"];
	      this.pageController = new this.currentPage.controller({user: App.user});
	      m.route("/login");
	    } else {
	      this.currentPage = App.pages[pageName];
	      this.pageController = new this.currentPage.controller({user: App.user});
	      GoogleAnalytics.TrackNavigation();
	    }
	  };

	  Page.view = function(ctrl) {
	    return new ctrl.currentPage.view(ctrl.pageController);
	  };

	  return Page;
	};

	m.route.mode = "pathname";
	m.route(document.getElementById("page"), "/not_found", {
	  "/": App.showPage("Home"),
	  "/query": App.showPage("Search"),
	  "/query/": App.showPage("Search"),
	  "/query/:query": App.showPage("Search"),
	  "/profile": App.showPage("Profile"),
	  "/articles/:articleId": App.showPage("Article"),
	  "/authors/:authorId": App.showPage("Author"),
	  "/login": App.showPage("Login"),
	  "/about": App.showPage("About"),  
	  "/logout": App.showPage("Logout"),
	  "/signup": App.showPage("Signup"),
	  "/not_found": App.showPage("NotFound")
	});

	module.exports = App;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function addStyle(cssCode) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = cssCode;
		} else {
			styleElement.appendChild(document.createTextNode(cssCode));
		}
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(styleElement);
		return function() {
			head.removeChild(styleElement);
		};
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.6.0
	//     http://underscorejs.org
	//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.

	(function() {

	  // Baseline setup
	  // --------------

	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;

	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;

	  // Establish the object that gets returned to break out of a loop iteration.
	  var breaker = {};

	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    concat           = ArrayProto.concat,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;

	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeForEach      = ArrayProto.forEach,
	    nativeMap          = ArrayProto.map,
	    nativeReduce       = ArrayProto.reduce,
	    nativeReduceRight  = ArrayProto.reduceRight,
	    nativeFilter       = ArrayProto.filter,
	    nativeEvery        = ArrayProto.every,
	    nativeSome         = ArrayProto.some,
	    nativeIndexOf      = ArrayProto.indexOf,
	    nativeLastIndexOf  = ArrayProto.lastIndexOf,
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind;

	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };

	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object via a string identifier,
	  // for Closure Compiler "advanced" mode.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }

	  // Current version.
	  _.VERSION = '1.6.0';

	  // Collection Functions
	  // --------------------

	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles objects with the built-in `forEach`, arrays, and raw objects.
	  // Delegates to **ECMAScript 5**'s native `forEach` if available.
	  var each = _.each = _.forEach = function(obj, iterator, context) {
	    if (obj == null) return obj;
	    if (nativeForEach && obj.forEach === nativeForEach) {
	      obj.forEach(iterator, context);
	    } else if (obj.length === +obj.length) {
	      for (var i = 0, length = obj.length; i < length; i++) {
	        if (iterator.call(context, obj[i], i, obj) === breaker) return;
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (var i = 0, length = keys.length; i < length; i++) {
	        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
	      }
	    }
	    return obj;
	  };

	  // Return the results of applying the iterator to each element.
	  // Delegates to **ECMAScript 5**'s native `map` if available.
	  _.map = _.collect = function(obj, iterator, context) {
	    var results = [];
	    if (obj == null) return results;
	    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
	    each(obj, function(value, index, list) {
	      results.push(iterator.call(context, value, index, list));
	    });
	    return results;
	  };

	  var reduceError = 'Reduce of empty array with no initial value';

	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
	  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
	    var initial = arguments.length > 2;
	    if (obj == null) obj = [];
	    if (nativeReduce && obj.reduce === nativeReduce) {
	      if (context) iterator = _.bind(iterator, context);
	      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
	    }
	    each(obj, function(value, index, list) {
	      if (!initial) {
	        memo = value;
	        initial = true;
	      } else {
	        memo = iterator.call(context, memo, value, index, list);
	      }
	    });
	    if (!initial) throw new TypeError(reduceError);
	    return memo;
	  };

	  // The right-associative version of reduce, also known as `foldr`.
	  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
	  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
	    var initial = arguments.length > 2;
	    if (obj == null) obj = [];
	    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
	      if (context) iterator = _.bind(iterator, context);
	      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
	    }
	    var length = obj.length;
	    if (length !== +length) {
	      var keys = _.keys(obj);
	      length = keys.length;
	    }
	    each(obj, function(value, index, list) {
	      index = keys ? keys[--length] : --length;
	      if (!initial) {
	        memo = obj[index];
	        initial = true;
	      } else {
	        memo = iterator.call(context, memo, obj[index], index, list);
	      }
	    });
	    if (!initial) throw new TypeError(reduceError);
	    return memo;
	  };

	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var result;
	    any(obj, function(value, index, list) {
	      if (predicate.call(context, value, index, list)) {
	        result = value;
	        return true;
	      }
	    });
	    return result;
	  };

	  // Return all the elements that pass a truth test.
	  // Delegates to **ECMAScript 5**'s native `filter` if available.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    if (obj == null) return results;
	    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
	    each(obj, function(value, index, list) {
	      if (predicate.call(context, value, index, list)) results.push(value);
	    });
	    return results;
	  };

	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, function(value, index, list) {
	      return !predicate.call(context, value, index, list);
	    }, context);
	  };

	  // Determine whether all of the elements match a truth test.
	  // Delegates to **ECMAScript 5**'s native `every` if available.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    predicate || (predicate = _.identity);
	    var result = true;
	    if (obj == null) return result;
	    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
	    each(obj, function(value, index, list) {
	      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
	    });
	    return !!result;
	  };

	  // Determine if at least one element in the object matches a truth test.
	  // Delegates to **ECMAScript 5**'s native `some` if available.
	  // Aliased as `any`.
	  var any = _.some = _.any = function(obj, predicate, context) {
	    predicate || (predicate = _.identity);
	    var result = false;
	    if (obj == null) return result;
	    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
	    each(obj, function(value, index, list) {
	      if (result || (result = predicate.call(context, value, index, list))) return breaker;
	    });
	    return !!result;
	  };

	  // Determine if the array or object contains a given value (using `===`).
	  // Aliased as `include`.
	  _.contains = _.include = function(obj, target) {
	    if (obj == null) return false;
	    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
	    return any(obj, function(value) {
	      return value === target;
	    });
	  };

	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      return (isFunc ? method : value[method]).apply(value, args);
	    });
	  };

	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };

	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matches(attrs));
	  };

	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matches(attrs));
	  };

	  // Return the maximum element or (element-based computation).
	  // Can't optimize arrays of integers longer than 65,535 elements.
	  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
	  _.max = function(obj, iterator, context) {
	    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
	      return Math.max.apply(Math, obj);
	    }
	    var result = -Infinity, lastComputed = -Infinity;
	    each(obj, function(value, index, list) {
	      var computed = iterator ? iterator.call(context, value, index, list) : value;
	      if (computed > lastComputed) {
	        result = value;
	        lastComputed = computed;
	      }
	    });
	    return result;
	  };

	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iterator, context) {
	    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
	      return Math.min.apply(Math, obj);
	    }
	    var result = Infinity, lastComputed = Infinity;
	    each(obj, function(value, index, list) {
	      var computed = iterator ? iterator.call(context, value, index, list) : value;
	      if (computed < lastComputed) {
	        result = value;
	        lastComputed = computed;
	      }
	    });
	    return result;
	  };

	  // Shuffle an array, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var rand;
	    var index = 0;
	    var shuffled = [];
	    each(obj, function(value) {
	      rand = _.random(index++);
	      shuffled[index - 1] = shuffled[rand];
	      shuffled[rand] = value;
	    });
	    return shuffled;
	  };

	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (obj.length !== +obj.length) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };

	  // An internal function to generate lookup iterators.
	  var lookupIterator = function(value) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return value;
	    return _.property(value);
	  };

	  // Sort the object's values by a criterion produced by an iterator.
	  _.sortBy = function(obj, iterator, context) {
	    iterator = lookupIterator(iterator);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iterator.call(context, value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };

	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iterator, context) {
	      var result = {};
	      iterator = lookupIterator(iterator);
	      each(obj, function(value, index) {
	        var key = iterator.call(context, value, index, obj);
	        behavior(result, key, value);
	      });
	      return result;
	    };
	  };

	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, key, value) {
	    _.has(result, key) ? result[key].push(value) : result[key] = [value];
	  });

	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, key, value) {
	    result[key] = value;
	  });

	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, key) {
	    _.has(result, key) ? result[key]++ : result[key] = 1;
	  });

	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iterator, context) {
	    iterator = lookupIterator(iterator);
	    var value = iterator.call(context, obj);
	    var low = 0, high = array.length;
	    while (low < high) {
	      var mid = (low + high) >>> 1;
	      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
	    }
	    return low;
	  };

	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (obj.length === +obj.length) return _.map(obj, _.identity);
	    return _.values(obj);
	  };

	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
	  };

	  // Array Functions
	  // ---------------

	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if ((n == null) || guard) return array[0];
	    if (n < 0) return [];
	    return slice.call(array, 0, n);
	  };

	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N. The **guard** check allows it to work with
	  // `_.map`.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
	  };

	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array. The **guard** check allows it to work with `_.map`.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if ((n == null) || guard) return array[array.length - 1];
	    return slice.call(array, Math.max(array.length - n, 0));
	  };

	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array. The **guard**
	  // check allows it to work with `_.map`.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, (n == null) || guard ? 1 : n);
	  };

	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };

	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, output) {
	    if (shallow && _.every(input, _.isArray)) {
	      return concat.apply(output, input);
	    }
	    each(input, function(value) {
	      if (_.isArray(value) || _.isArguments(value)) {
	        shallow ? push.apply(output, value) : flatten(value, shallow, output);
	      } else {
	        output.push(value);
	      }
	    });
	    return output;
	  };

	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, []);
	  };

	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };

	  // Split an array into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(array, predicate) {
	    var pass = [], fail = [];
	    each(array, function(elem) {
	      (predicate(elem) ? pass : fail).push(elem);
	    });
	    return [pass, fail];
	  };

	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iterator, context) {
	    if (_.isFunction(isSorted)) {
	      context = iterator;
	      iterator = isSorted;
	      isSorted = false;
	    }
	    var initial = iterator ? _.map(array, iterator, context) : array;
	    var results = [];
	    var seen = [];
	    each(initial, function(value, index) {
	      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
	        seen.push(value);
	        results.push(array[index]);
	      }
	    });
	    return results;
	  };

	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(_.flatten(arguments, true));
	  };

	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var rest = slice.call(arguments, 1);
	    return _.filter(_.uniq(array), function(item) {
	      return _.every(rest, function(other) {
	        return _.contains(other, item);
	      });
	    });
	  };

	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
	    return _.filter(array, function(value){ return !_.contains(rest, value); });
	  };

	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    var length = _.max(_.pluck(arguments, 'length').concat(0));
	    var results = new Array(length);
	    for (var i = 0; i < length; i++) {
	      results[i] = _.pluck(arguments, '' + i);
	    }
	    return results;
	  };

	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    if (list == null) return {};
	    var result = {};
	    for (var i = 0, length = list.length; i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };

	  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
	  // we need this function. Return the position of the first occurrence of an
	  // item in an array, or -1 if the item is not included in the array.
	  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = function(array, item, isSorted) {
	    if (array == null) return -1;
	    var i = 0, length = array.length;
	    if (isSorted) {
	      if (typeof isSorted == 'number') {
	        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
	      } else {
	        i = _.sortedIndex(array, item);
	        return array[i] === item ? i : -1;
	      }
	    }
	    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
	    for (; i < length; i++) if (array[i] === item) return i;
	    return -1;
	  };

	  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
	  _.lastIndexOf = function(array, item, from) {
	    if (array == null) return -1;
	    var hasIndex = from != null;
	    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
	      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
	    }
	    var i = (hasIndex ? from : array.length);
	    while (i--) if (array[i] === item) return i;
	    return -1;
	  };

	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (arguments.length <= 1) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = arguments[2] || 1;

	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var idx = 0;
	    var range = new Array(length);

	    while(idx < length) {
	      range[idx++] = start;
	      start += step;
	    }

	    return range;
	  };

	  // Function (ahem) Functions
	  // ------------------

	  // Reusable constructor function for prototype setting.
	  var ctor = function(){};

	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    var args, bound;
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError;
	    args = slice.call(arguments, 2);
	    return bound = function() {
	      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
	      ctor.prototype = func.prototype;
	      var self = new ctor;
	      ctor.prototype = null;
	      var result = func.apply(self, args.concat(slice.call(arguments)));
	      if (Object(result) === result) return result;
	      return self;
	    };
	  };

	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    return function() {
	      var position = 0;
	      var args = boundArgs.slice();
	      for (var i = 0, length = args.length; i < length; i++) {
	        if (args[i] === _) args[i] = arguments[position++];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return func.apply(this, args);
	    };
	  };

	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var funcs = slice.call(arguments, 1);
	    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
	    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
	    return obj;
	  };

	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memo = {};
	    hasher || (hasher = _.identity);
	    return function() {
	      var key = hasher.apply(this, arguments);
	      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
	    };
	  };

	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){ return func.apply(null, args); }, wait);
	  };

	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = function(func) {
	    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
	  };

	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    options || (options = {});
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0) {
	        clearTimeout(timeout);
	        timeout = null;
	        previous = now;
	        result = func.apply(context, args);
	        context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };

	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;

	    var later = function() {
	      var last = _.now() - timestamp;
	      if (last < wait) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          context = args = null;
	        }
	      }
	    };

	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) {
	        timeout = setTimeout(later, wait);
	      }
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }

	      return result;
	    };
	  };

	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = function(func) {
	    var ran = false, memo;
	    return function() {
	      if (ran) return memo;
	      ran = true;
	      memo = func.apply(this, arguments);
	      func = null;
	      return memo;
	    };
	  };

	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };

	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var funcs = arguments;
	    return function() {
	      var args = arguments;
	      for (var i = funcs.length - 1; i >= 0; i--) {
	        args = [funcs[i].apply(this, args)];
	      }
	      return args[0];
	    };
	  };

	  // Returns a function that will only be executed after being called N times.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };

	  // Object Functions
	  // ----------------

	  // Retrieve the names of an object's properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    return keys;
	  };

	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = new Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };

	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = new Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };

	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };

	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };

	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = function(obj) {
	    each(slice.call(arguments, 1), function(source) {
	      if (source) {
	        for (var prop in source) {
	          obj[prop] = source[prop];
	        }
	      }
	    });
	    return obj;
	  };

	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(obj) {
	    var copy = {};
	    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
	    each(keys, function(key) {
	      if (key in obj) copy[key] = obj[key];
	    });
	    return copy;
	  };

	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj) {
	    var copy = {};
	    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
	    for (var key in obj) {
	      if (!_.contains(keys, key)) copy[key] = obj[key];
	    }
	    return copy;
	  };

	  // Fill in a given object with default properties.
	  _.defaults = function(obj) {
	    each(slice.call(arguments, 1), function(source) {
	      if (source) {
	        for (var prop in source) {
	          if (obj[prop] === void 0) obj[prop] = source[prop];
	        }
	      }
	    });
	    return obj;
	  };

	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };

	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };

	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a == 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className != toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, dates, and booleans are compared by value.
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return a == String(b);
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
	        // other numeric values.
	        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a == +b;
	      // RegExps are compared by their source patterns and flags.
	      case '[object RegExp]':
	        return a.source == b.source &&
	               a.global == b.global &&
	               a.multiline == b.multiline &&
	               a.ignoreCase == b.ignoreCase;
	    }
	    if (typeof a != 'object' || typeof b != 'object') return false;
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] == a) return bStack[length] == b;
	    }
	    // Objects with different constructors are not equivalent, but `Object`s
	    // from different frames are.
	    var aCtor = a.constructor, bCtor = b.constructor;
	    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
	                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
	                        && ('constructor' in a && 'constructor' in b)) {
	      return false;
	    }
	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);
	    var size = 0, result = true;
	    // Recursively compare objects and arrays.
	    if (className == '[object Array]') {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      size = a.length;
	      result = size == b.length;
	      if (result) {
	        // Deep compare the contents, ignoring non-numeric properties.
	        while (size--) {
	          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
	        }
	      }
	    } else {
	      // Deep compare objects.
	      for (var key in a) {
	        if (_.has(a, key)) {
	          // Count the expected number of properties.
	          size++;
	          // Deep compare each member.
	          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
	        }
	      }
	      // Ensure that both objects contain the same number of properties.
	      if (result) {
	        for (key in b) {
	          if (_.has(b, key) && !(size--)) break;
	        }
	        result = !size;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return result;
	  };

	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b, [], []);
	  };

	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
	    for (var key in obj) if (_.has(obj, key)) return false;
	    return true;
	  };

	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };

	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) == '[object Array]';
	  };

	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    return obj === Object(obj);
	  };

	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
	  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) == '[object ' + name + ']';
	    };
	  });

	  // Define a fallback version of the method in browsers (ahem, IE), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return !!(obj && _.has(obj, 'callee'));
	    };
	  }

	  // Optimize `isFunction` if appropriate.
	  if (true) {
	    _.isFunction = function(obj) {
	      return typeof obj === 'function';
	    };
	  }

	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };

	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj != +obj;
	  };

	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
	  };

	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };

	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };

	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return hasOwnProperty.call(obj, key);
	  };

	  // Utility Functions
	  // -----------------

	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };

	  // Keep the identity function around for default iterators.
	  _.identity = function(value) {
	    return value;
	  };

	  _.constant = function(value) {
	    return function () {
	      return value;
	    };
	  };

	  _.property = function(key) {
	    return function(obj) {
	      return obj[key];
	    };
	  };

	  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
	  _.matches = function(attrs) {
	    return function(obj) {
	      if (obj === attrs) return true; //avoid comparing an object to itself.
	      for (var key in attrs) {
	        if (attrs[key] !== obj[key])
	          return false;
	      }
	      return true;
	    }
	  };

	  // Run a function **n** times.
	  _.times = function(n, iterator, context) {
	    var accum = Array(Math.max(0, n));
	    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
	    return accum;
	  };

	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };

	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() { return new Date().getTime(); };

	  // List of HTML entities for escaping.
	  var entityMap = {
	    escape: {
	      '&': '&amp;',
	      '<': '&lt;',
	      '>': '&gt;',
	      '"': '&quot;',
	      "'": '&#x27;'
	    }
	  };
	  entityMap.unescape = _.invert(entityMap.escape);

	  // Regexes containing the keys and values listed immediately above.
	  var entityRegexes = {
	    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
	    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
	  };

	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  _.each(['escape', 'unescape'], function(method) {
	    _[method] = function(string) {
	      if (string == null) return '';
	      return ('' + string).replace(entityRegexes[method], function(match) {
	        return entityMap[method][match];
	      });
	    };
	  });

	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property) {
	    if (object == null) return void 0;
	    var value = object[property];
	    return _.isFunction(value) ? value.call(object) : value;
	  };

	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result.call(this, func.apply(_, args));
	      };
	    });
	  };

	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };

	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };

	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;

	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\t':     't',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  _.template = function(text, data, settings) {
	    var render;
	    settings = _.defaults({}, settings, _.templateSettings);

	    // Combine delimiters into one regular expression via alternation.
	    var matcher = new RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');

	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset)
	        .replace(escaper, function(match) { return '\\' + escapes[match]; });

	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      }
	      if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      }
	      if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }
	      index = offset + match.length;
	      return match;
	    });
	    source += "';\n";

	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + "return __p;\n";

	    try {
	      render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }

	    if (data) return render(data, _);
	    var template = function(data) {
	      return render.call(this, data, _);
	    };

	    // Provide the compiled function source as a convenience for precompilation.
	    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

	    return template;
	  };

	  // Add a "chain" function, which will delegate to the wrapper.
	  _.chain = function(obj) {
	    return _(obj).chain();
	  };

	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.

	  // Helper function to continue chaining intermediate results.
	  var result = function(obj) {
	    return this._chain ? _(obj).chain() : obj;
	  };

	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);

	  // Add all mutator Array functions to the wrapper.
	  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
	      return result.call(this, obj);
	    };
	  });

	  // Add all accessor Array functions to the wrapper.
	  each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result.call(this, method.apply(this._wrapped, arguments));
	    };
	  });

	  _.extend(_.prototype, {

	    // Start chaining a wrapped Underscore object.
	    chain: function() {
	      this._chain = true;
	      return this;
	    },

	    // Extracts the result from a wrapped and chained object.
	    value: function() {
	      return this._wrapped;
	    }

	  });

	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
	      return _;
	    }.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}).call(this);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = m;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(88);

	var m = __webpack_require__(3);

	var UserBar = __webpack_require__(16);
	var Logo = __webpack_require__(14);

	var FullLayout = {};

	FullLayout.controller = function(options) {
	  options = options || {};
	  this.id = options.id;
	  this.header = options.header;
	  this.userBarController = new UserBar.controller({user: options.user})
	};

	FullLayout.view = function(ctrl, content) {
	  return (
	    m("div", {id:ctrl.id, className:"page FullLayout"}, [
	      m("header", [
	        new UserBar.view(ctrl.userBarController),
	        ctrl.header,
	        m("a", {href:"/", config:m.route, className:"logo"}, [new Logo.view()])
	      ]),

	      m("div", {className:"text_center"}, [
	        content
	      ])
	    ])
	  );
	};

	module.exports = FullLayout;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */
	// taken from: http://codepen.io/georgehastings/pen/skznp

	"use strict";
	__webpack_require__(84);

	var Spinner = {};

	Spinner.view = function() {
	  return (
	    m("ul", {className:"Spinner"}, [
	      m("li"),
	      m("li"),
	      m("li")
	    ])
	  );
	};

	module.exports = Spinner;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(87);

	var m = __webpack_require__(3);

	var Search = __webpack_require__(15);
	var UserBar = __webpack_require__(16);
	var Logo = __webpack_require__(14);

	var DefaultLayout = {};

	DefaultLayout.controller = function(options) {
	  options = options || {};
	  this.id = options.id;
	  this.userBarController = new UserBar.controller({user: options.user});
	  this.searchController = new Search.controller({query: m.route.param("query")});
	};

	DefaultLayout.view = function(ctrl, content) {
	  return (
	    m("div", {id:ctrl.id, className:"page DefaultLayout"}, [
	      m("header", [
	        m("div", {className:"banner"}, [
	          new UserBar.view(ctrl.userBarController),
	          m("a", {href:"/", config:m.route, className:"logoLink"}, [new Logo.view()])
	        ]),
	        new Search.view(ctrl.searchController)
	      ]),

	      m("div", {className:"content"}, [content])
	    ])
	  );
	};

	module.exports = DefaultLayout;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ = __webpack_require__(2);

	var ClassSet = function(classes) {
	  return _.reduce(classes, function(str, val, key) {
	    if (val) {
	      str = str + " " + key;
	    }
	    return str;
	  }, "");
	};

	module.exports = ClassSet;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(75);

	var cx = __webpack_require__(7);

	var Badge = {};

	Badge.icons = {
	  data: __webpack_require__(57),
	  disclosure: __webpack_require__(58),
	  methods: __webpack_require__(59),
	  registration: __webpack_require__(60),
	  reproducible: __webpack_require__(61)
	};

	Badge.view = function(ctrl) {
	  var classes = cx({
	    Badge: true,
	    active: ctrl.active
	  });

	  return (
	    m("svg", {x:"0px", y:"0px", viewBox:"0 0 32 32", className:classes}, [
	      m("path", {d:"M16,32C5.532813,32,0,26.467188,0,16S5.532813,0,16,0s16,5.532813,16,16S26.467188,32,16,32z"}),
	      new Badge.icons[ctrl.badge].view(ctrl)
	    ])
	  );
	};

	module.exports = Badge;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ = __webpack_require__(2);
	var BaseModel = __webpack_require__(10);

	var ArticleModel = BaseModel.extend({
	  relations: {
	    "comments": {type: "many", model: __webpack_require__(62)},
	  },
	  defaults: {
	    "title": "",
	    "abstract": "",
	    "tags": ["Moral purity", "Physical cleansing", "Cleansing products"],
	    "doi": "",
	    "publication_date": "",
	    "authors_denormalized": [],
	    "journal": "Science",
	    "comments": [
	      {
	        "author": "Anonymous",
	        "gravatar": null,
	        "date": "4-1-2014",
	        "body": "Blah",
	        "replies": [
	          {
	            "author": "Stephen Demjanenko",
	            "date": "4-1-2014",
	            "body": "Try to leave useful comments.  Thanks!"
	          }
	        ]
	      },
	      {
	        "author": "Stephen Demjanenko",
	        "date": "4-1-2014",
	        "body": "Im gonna see if I can replicate it"
	      }
	    ],
	    "action_editor": "Cathleen Moore",
	    "reviewers": ["Bob Bland", "Crystal Cali"],
	    "community_summary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eros tellus, venenatis molestie ligula in, lobortis lobortis est. Nunc adipiscing erat sed libero volutpat dapibus ultrices feugiat elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent ac nisi luctus arcu tempus malesuada. Fusce lectus augue, ultrices id purus ac, viverra convallis ipsum. Mauris convallis urna ut magna laoreet, quis dapibus dolor aliquet. Nunc tristique pulvinar imperdiet. Fusce et lectus ac nunc porta eleifend imperdiet sed diam. Curabitur sollicitudin id enim a lacinia. Suspendisse ultricies laoreet turpis a tempor. Cras dapibus, dolor quis ultrices convallis, sapien lectus blandit turpis, in mollis purus elit ac magna.",
	    "community_summary_date": "June 21, 2014"
	  },
	  urlRoot: "https://api.curatescience.org/articles",
	  computeds: {
	    authorsEtAl: function() {
	      var authors = this.get("authors_denormalized");
	      if (!_.isEmpty(authors)) {
	        var lastName = _.first(authors).last_name;
	        return lastName + (authors.length > 1 ? " et al.": "");
	      }
	    },
	    authorLastNames: function() {
	      var authors = this.get("authors_denormalized");
	      var lastNames = _.pluck(authors, "last_name");
	      if (lastNames.length > 1) {
	        return _.first(lastNames, lastNames.length-1).join(", ") + " & " + _.last(lastNames);
	      } else if (lastNames.length == 1) {
	        return _.first(lastNames);
	      }
	    },
	    year: function() {
	      var date = this.get("publication_date");
	      if (date) {
	        return (new Date(date)).getFullYear();
	      }
	    }
	  }
	});

	module.exports = ArticleModel;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ = __webpack_require__(2);
	var m = __webpack_require__(3);

	var BaseModel = function(data, options) {
	  this.options = options || {};
	  resetAssociations(this);
	  resetAttributes(this);

	  this.set(data);
	  if (this.constructor._cache && this.id) {
	    this.constructor._cache[this.id] = this;
	  }
	  this.errors = {};
	};

	BaseModel.extend = function(proto_opts) {
	  var child = function(data, opts) {
	    BaseModel.apply(this, [data, opts]);

	    if (_.isFunction(this.initialize)) {
	      this.initialize.apply(this, [data, opts]);
	    }
	  };

	  _.extend(child.prototype, BaseModel.prototype, proto_opts);
	  child.prototype.constructor = child;
	  child._cache = {};
	  child.findOrCreate = function(data, opts) {
	    if (!child._cache[data.id]) {
	      child._cache[data.id] = new child(data, opts);
	    }
	    return child._cache[data.id];
	  };
	  return child;
	};

	BaseModel.prototype.defaults = {};

	BaseModel.prototype.get = function(attr) {
	  var res = this.attributes[attr];
	  if (!_.isUndefined(res)) {
	    return res;
	  }

	  if (this.computeds) {
	    res = this.computeds[attr];
	    if (!_.isUndefined(res)) {
	      return res.call(this);
	    }
	  }

	  if (this.associations) {
	    res = this.associations[attr];
	    if (!_.isUndefined(res)) {
	      return res;
	    }
	  }
	};

	BaseModel.prototype.set = function(attr, val, options) {
	  options = options || {};

	  if (_.isString(attr)) {
	    if (!_.isUndefined(this.associations[attr])) {
	      var relation = this.relations[attr];
	      if (relation.type === "many") {
	        this.associations[attr] = _.map(val, function(modelData) { return new relation.model(modelData); });
	      } else {
	        this.associations[attr] = new relation.model(val);
	      }
	    } else {
	      this.attributes[attr] = val;
	      if (attr === "id") {
	        this.id = val;
	      }
	    }
	  } else { // its an object
	    var _this = this;
	    _.each(attr, function(obj_val, key) {
	      _this.set(key, obj_val, {silent: true}); // let the outside set trigger the endComputation
	    });
	    options = val || {};
	  }

	  if (!options.silent) {
	    this.redraw();
	  }
	};

	BaseModel.prototype.redraw = _.throttle(m.redraw, 16, {leading: false});

	BaseModel.prototype.setter = function(attr) {
	  var _this = this;
	  return function(val) {
	    if (_.isString(attr)) {
	      _this.set(attr, val);
	    } else {
	      _this.set(val);
	    }
	  };
	};

	BaseModel.prototype.error = function() {
	  console.log("model error", arguments);
	};

	BaseModel.prototype.fetch = function(association, options) {
	  options = _.isString(association) ? (options || {}) : (association || {});

	  var t0 = _.now();
	  if (association) {
	    var options = this.relations[association];
	    return m.request({method: "GET", url: this.url(options.url), type: (options.model || BaseModel), background: true, data: options.data}).then(this.setter(association));
	  } else {
	    return m.request({method: "GET", url: this.url(), background: true, data: options.data}).then(this.setter(), this.error);
	  }
	  //ga('send', 'timing', 'Model', 'Fetch', t1-t0, this.get("id"));
	};

	BaseModel.prototype.create = function() {
	  return m.request({method: "POST", url: this.url(), data: this.attributes, background: true}).then(this.setter, this.error);
	};

	BaseModel.prototype.update = function() {
	  return m.request({method: "PUT", url: this.url(), data: this.attributes, background: true}).then(this.setter, this.error);
	};

	BaseModel.prototype.destroy = function() {
	  return m.request({method: "DELETE", url: this.url(), background: true}).then(null, this.error);
	};

	BaseModel.prototype.url = function(suffix) {
	  var base = this.urlRoot+"/"+this.get("id");
	  if (suffix) {
	    return base + "/" + suffix;
	  } else {
	    return base;
	  }
	};

	BaseModel.prototype.toJSON = function() {
	  return this.attributes;
	};

	// Private methods

	function resetAttributes(model) {
	  model.attributes = {};
	  model.set(model.defaults || {});
	}

	function resetAssociations(model) {
	  model.associations = {};
	  _.each(model.relations, function(options, key) {
	    model.associations[key] = options.type === "many" ? [] : {};
	  });
	}

	module.exports = BaseModel;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAYAAAAxrNxjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB9JREFUeNpi/P//PwMxgHEoKJw5cyZRKpkYiAQAAQYAvLURxMpVMpAAAAAASUVORK5CYII="

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "/assets/a146e041662bd9ab1583a9e7fbb81e18.eot"

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(77);

	var m = __webpack_require__(3);
	var cx = __webpack_require__(7);

	var Dropdown = {};

	Dropdown.controller = function(options) {
	  options = options || {};

	  this.open = m.prop(false);
	  this.className = options.className || "";
	  this.label = options.label;

	  var _this = this;
	  this.toggle = function() {
	    _this.open(!_this.open());
	  };

	  this.outsideClick = function(e) {
	    if (_this.open()) {
	      //var button = this.refs.button.getDOMNode();
	      //if (e.target != button && e.target.parentNode != button) {
	        _this.open(false);
	      //}
	    }
	  }

	  //document.addEventListener("click", this.outsideClick);
	  //document.removeEventListener("click", this.outsideClick); on unload
	};

	Dropdown.view = function(ctrl, content) {
	  if (ctrl.open()) {
	    var dropdownContent = m("div", {className:"content"}, [content]);
	  }

	  return (
	    m("div", {className:"Dropdown " + ctrl.className}, [
	      m("button", {type:"button", className:"btn btn_subtle no_outline", onclick:ctrl.toggle}, [
	        ctrl.label
	      ]),
	      dropdownContent
	    ])
	  );
	};

	module.exports = Dropdown;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(78);

	var Logo = {};

	Logo.view = function() {
	  return (
	    m("svg", {className:"Logo", x:"0px", y:"0px", viewBox:"0 0 200 100"}, [
	      m("g", [
	        m("text", {transform:"matrix(1 0 0 1 43.172913 47.784058)"}, ["Curate"]),
	        m("text", {transform:"matrix(1 0 0 1 44.21344 68.784058)"}, ["Science"]),
	        m("path", {style:{"fill": "#85D3F5"}, d:"M140,25c-6.296143,0-13.563904,1.90332-14.797791,10h18.509521"+' '+
	            "c0.386719-0.881531,1.26532-1.5,2.288269-1.5c1.378906,0,2.5,1.121094,2.5,2.5s-1.121094,2.5-2.5,2.5"+' '+
	            "c-1.022949,0-1.90155-0.618469-2.288269-1.5h-10.645325c0.071289,1.735107,0.486755,3.400757,4.750916,3.805725"+' '+
	            "C138.242676,40.031738,139.055908,39.5,140,39.5c1.378906,0,2.5,1.121094,2.5,2.5s-1.121094,2.5-2.5,2.5"+' '+
	            "c-1.026672,0-1.908691-0.622437-2.293213-1.509094c-5.858521-0.550781-6.720032-3.27533-6.798096-5.990906h-5.883362"+' '+
	            "C125.02063,37.17041,125,37.324951,125,37.5c0,10.236755,8.096375,12.5,15,12.5v5c0,0,15-2.263245,15-17.5"+' '+
	            "C155,27.263,146.903625,25,140,25z"})
	      ])
	    ])
	  );
	};

	module.exports = Logo;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(81);

	var m = __webpack_require__(3);

	var Search = {};

	Search.controller = function(options) {
	  options = options || {};

	  this.query = m.prop(options.query || "");
	  this.size = options.size || 30;
	  this.className = options.className || "";

	  var _this = this;
	  this.updateSearch = function(e) {
	    e.preventDefault();
	    m.route("/query/"+_this.query());
	  };
	};

	Search.view = function(ctrl) {
	  return (
	    m("form", {onsubmit:ctrl.updateSearch, className:"Search " + ctrl.className}, [
	      m("input", {type:"text", placeholder:"Search for articles", size:ctrl.size, value:ctrl.query(), oninput:m.withAttr("value", ctrl.query)} )
	    ])
	  );
	};

	module.exports = Search;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(86);

	var Notifications = __webpack_require__(52);
	var Dropdown = __webpack_require__(13);

	var UserBar = {};

	UserBar.controller = function(options) {
	  this.user = options.user;

	  if (this.user) {
	    this.dropdownController = new Dropdown.controller({
	      className: "user",
	      label: m("img", {src:this.user.get("gravatarUrl")} )
	    });

	    this.notificationsController = new Notifications.controller({
	      notifications: this.user.get("notifications")
	    });

	    var _this = this;
	    this.handleBookmarkClick = function() {
	      console.log("bookmarking");
	    };
	  }
	};

	UserBar.view = function(ctrl) {
	  var user = ctrl.user;
	  if (!user) {
	    return m("ul", {className:"UserBar"});
	  }

	  var dropdownContent = (
	    m("ul", [
	      m("li", [m("a", {href:"/profile", config:m.route}, ["Profile"])]),
	      m("li", [m("a", {href:"/saved", config:m.route}, ["Saved searches"])]),
	      m("li", [m("a", {href:"/logout", config:m.route}, ["Log out"])])
	    ])
	  );

	  return (
	    m("ul", {className:"UserBar"}, [
	      m("li", [new Notifications.view(ctrl.notificationsController)]),
	      m("li", [m("span", {className:"icon icon_bookmark", onclick:ctrl.handleBookmarkClick})]),
	      m("li", [m("a", {href:"/history", className:"history", config:m.route}, [m("span", {className:"icon icon_history"})])]),
	      m("li", [new Dropdown.view(ctrl.dropdownController, dropdownContent)])
	    ])
	  );
	};

	module.exports = UserBar;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var BaseModel = __webpack_require__(10);

	var UserModel = BaseModel.extend({
	  defaults: {
	    "email": "stephen@curatescience.org",
	    "first_name": "Stephen",
	    "middle_name": "",
	    "last_name": "Demjanenko",
	    "facebook": "sdemjanenko",
	    "twitter": "sdemjanenko",
	    "articles": [],
	    "comments": [],
	    "gravatar": "8c51e26145bc08bb6f43bead1b5ad07f.png", // me
	    "notifications": [
	      {title: "foo", body: "foo body", read: false},
	      {title: "bar", body: "bar body", read: true}
	    ],
	    "areas_of_study": ["Astrophysics", "Cosmology"],
	    "about": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec venenatis nulla in turpis luctus rutrum. Quisque adipiscing leo fringilla enim luctus ultricies. Fusce iaculis augue tincidunt eleifend condimentum. Vestibulum commodo massa ut vulputate aliquam. Etiam eu ante id est varius auctor. Sed fermentum at purus ac pellentesque. Duis nibh est, ornare ac tellus a, fermentum porta velit. In in risus et orci rhoncus egestas.\n\nNulla facilisi. Proin iaculis, nisl dictum consequat tincidunt, lectus arcu tincidunt magna, a placerat purus dui vitae dui. Maecenas fermentum luctus sodales. Cras vestibulum, erat in gravida tristique, augue ante scelerisque diam, non porta sem metus."
	  },
	  logout: function() {},
	  computeds: {
	    facebookUrl: function() {
	      return "https://www.facebook.com/" + this.get("facebook");
	    },
	    fullName: function() {
	      return [this.get("first_name"), this.get("middle_name"), this.get("last_name")].join(" ");
	    },
	    gravatarUrl: function() {
	      return "//www.gravatar.com/avatar/" + this.get("gravatar");
	    },
	    twitterUrl: function() {
	      return "https://www.twitter.com/" + this.get("twitter");
	    }
	  }
	});

	module.exports = UserModel;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "/assets/9fdc0677c1bfc71ad0ba4ab2edf708f2.woff"

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "/assets/8e4f31e964b631630b0dceddcb74b407.woff"

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "/assets/93a3a60e428492a3872d93263763916b.woff"

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "/assets/ab871a16d076776e0da30ce02fffe54f.woff"

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		"/* Generated by grunt-webfont */\n\n@font-face {\n\tfont-family:\"icons\";\n\tsrc:url("+__webpack_require__(12)+");\n\tsrc:url("+__webpack_require__(12)+"?#iefix) format(\"embedded-opentype\"),\n\t\turl("+__webpack_require__(99)+") format(\"woff\"),\n\t\turl("+__webpack_require__(50)+") format(\"truetype\"),\n\t\turl("+__webpack_require__(49)+"?#icons) format(\"svg\");\n\tfont-weight:normal;\n\tfont-style:normal;\n}\n\n.icon {\n\tfont-family:\"icons\";\n\tdisplay:inline-block;\n\tvertical-align:middle;\n\tline-height:1;\n\tfont-weight:normal;\n\tfont-style:normal;\n\tspeak:none;\n\ttext-decoration:inherit;\n\ttext-transform:none;\n\ttext-rendering:optimizeLegibility;\n\t-webkit-font-smoothing:antialiased;\n\t-moz-osx-font-smoothing:grayscale;\n}\n\n\n/* Icons */\n\n\n.icon_add:before {\n\tcontent:\"\\e001\";\n}\n\n\n.icon_added:before {\n\tcontent:\"\\e002\";\n}\n\n\n.icon_alert:before {\n\tcontent:\"\\e003\";\n}\n\n\n.icon_bkgr_header_large:before {\n\tcontent:\"\\e004\";\n}\n\n\n.icon_bkgr_header_small:before {\n\tcontent:\"\\e005\";\n}\n\n\n.icon_bkgr_notification_1digit:before {\n\tcontent:\"\\e006\";\n}\n\n\n.icon_bkgr_notification_2digits:before {\n\tcontent:\"\\e007\";\n}\n\n\n.icon_bkgr_squircle:before {\n\tcontent:\"\\e008\";\n}\n\n\n.icon_bookmark:before {\n\tcontent:\"\\e009\";\n}\n\n\n.icon_check_mark:before {\n\tcontent:\"\\e00a\";\n}\n\n\n.icon_close:before {\n\tcontent:\"\\e00b\";\n}\n\n\n.icon_comment:before {\n\tcontent:\"\\e00c\";\n}\n\n\n.icon_delete:before {\n\tcontent:\"\\e00d\";\n}\n\n\n.icon_down_caret:before {\n\tcontent:\"\\e00e\";\n}\n\n\n.icon_download:before {\n\tcontent:\"\\e00f\";\n}\n\n\n.icon_edit:before {\n\tcontent:\"\\e010\";\n}\n\n\n.icon_eye:before {\n\tcontent:\"\\e011\";\n}\n\n\n.icon_facebook:before {\n\tcontent:\"\\e012\";\n}\n\n\n.icon_history:before {\n\tcontent:\"\\e013\";\n}\n\n\n.icon_left_arrow:before {\n\tcontent:\"\\e014\";\n}\n\n\n.icon_lrg_data:before {\n\tcontent:\"\\e015\";\n}\n\n\n.icon_lrg_disclosure:before {\n\tcontent:\"\\e016\";\n}\n\n\n.icon_lrg_methods:before {\n\tcontent:\"\\e017\";\n}\n\n\n.icon_lrg_registration:before {\n\tcontent:\"\\e018\";\n}\n\n\n.icon_mail:before {\n\tcontent:\"\\e019\";\n}\n\n\n.icon_notification:before {\n\tcontent:\"\\e01a\";\n}\n\n\n.icon_open:before {\n\tcontent:\"\\e01b\";\n}\n\n\n.icon_person:before {\n\tcontent:\"\\e01c\";\n}\n\n\n.icon_proceed:before {\n\tcontent:\"\\e01d\";\n}\n\n\n.icon_removed:before {\n\tcontent:\"\\e01e\";\n}\n\n\n.icon_replication:before {\n\tcontent:\"\\e01f\";\n}\n\n\n.icon_reply:before {\n\tcontent:\"\\e020\";\n}\n\n\n.icon_right_arrow:before {\n\tcontent:\"\\e021\";\n}\n\n\n.icon_search:before {\n\tcontent:\"\\e022\";\n}\n\n\n.icon_share:before {\n\tcontent:\"\\e023\";\n}\n\n\n.icon_sml_data:before {\n\tcontent:\"\\e024\";\n}\n\n\n.icon_sml_disclosure:before {\n\tcontent:\"\\e025\";\n}\n\n\n.icon_sml_methods:before {\n\tcontent:\"\\e026\";\n}\n\n\n.icon_sml_registration:before {\n\tcontent:\"\\e027\";\n}\n\n\n.icon_sml_reproducible:before {\n\tcontent:\"\\e028\";\n}\n\n\n.icon_twitter:before {\n\tcontent:\"\\e029\";\n}\n\n\n.icon_up_caret:before {\n\tcontent:\"\\e02a\";\n}\n";

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		__webpack_require__(22) +
		"html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;}body{margin:0;}article,aside,details,figcaption,figure,footer,header,hgroup,main,nav,section,summary{display:block;}audio,canvas,progress,video{display:inline-block;vertical-align:baseline;}audio:not([controls]){display:none;height:0;}[hidden],template{display:none;}a{background:transparent;}a:active,a:hover{outline:0;}abbr[title]{border-bottom:1px dotted;}b,strong{font-weight:bold;}dfn{font-style:italic;}h1{font-size:2em;margin:0.67em 0;}mark{background:#ff0;color:#000;}small{font-size:80%;}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline;}sup{top:-0.5em;}sub{bottom:-0.25em;}img{border:0;}svg:not(:root){overflow:hidden;}figure{margin:1em 40px;}hr{-moz-box-sizing:content-box;box-sizing:content-box;height:0;}pre{overflow:auto;}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em;}button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0;}button{overflow:visible;}button,select{text-transform:none;}button,html input[type=\"button\"],input[type=\"reset\"],input[type=\"submit\"]{-webkit-appearance:button;cursor:pointer;}button[disabled],html input[disabled]{cursor:default;}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0;}input{line-height:normal;}input[type=\"checkbox\"],input[type=\"radio\"]{box-sizing:border-box;padding:0;}input[type=\"number\"]::-webkit-inner-spin-button,input[type=\"number\"]::-webkit-outer-spin-button{height:auto;}input[type=\"search\"]{-webkit-appearance:textfield;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box;}input[type=\"search\"]::-webkit-search-cancel-button,input[type=\"search\"]::-webkit-search-decoration{-webkit-appearance:none;}fieldset{border:1px solid #c0c0c0;margin:0 2px;padding:0.35em 0.625em 0.75em;}legend{border:0;padding:0;}textarea{overflow:auto;}optgroup{font-weight:bold;}table{border-collapse:collapse;border-spacing:0;}td,th{padding:0;}@font-face{font-family:\"Gibson\";src:url("+__webpack_require__(21)+") format(\"woff\"),url("+__webpack_require__(48)+") format(\"truetype\"),url("+__webpack_require__(21)+") format(\"svg\");font-weight:normal;font-style:normal;}@font-face{font-family:\"Gibson-italic\";src:url("+__webpack_require__(18)+") format(\"woff\"),url("+__webpack_require__(45)+") format(\"truetype\"),url("+__webpack_require__(18)+") format(\"svg\");font-weight:normal;font-style:normal;}@font-face{font-family:\"Gibson-semibold\";src:url("+__webpack_require__(20)+") format(\"woff\"),url("+__webpack_require__(47)+") format(\"truetype\"),url("+__webpack_require__(20)+") format(\"svg\");font-weight:normal;font-style:normal;}@font-face{font-family:\"Gibson-semibold-italic\";src:url("+__webpack_require__(19)+") format(\"woff\"),url("+__webpack_require__(46)+") format(\"truetype\"),url("+__webpack_require__(19)+") format(\"svg\");font-weight:normal;font-style:normal;}.section{clear:both;padding:0px;margin:0px;}.group:before,.group:after{content:\"\";display:table;}.group:after{clear:both;}.group{zoom:1;}.col{display:block;float:left;margin:1% 0 1% 1.6%;}.col:first-child{margin-left:0;}@media only screen and (max-width: 480px){.col{margin:1% 0 1% 0%;}}.span_2_of_2{width:100%;}.span_1_of_2{width:49.2%;}@media only screen and (max-width: 480px){.span_2_of_2{width:100%;}.span_1_of_2{width:100%;}}.span_4_of_4{width:100%;}.span_3_of_4{width:74.6%;}.span_2_of_4{width:49.2%;}.span_1_of_4{width:23.8%;}@media only screen and (max-width: 480px){.span_4_of_4{width:100%;}.span_3_of_4{width:100%;}.span_2_of_4{width:100%;}.span_1_of_4{width:100%;}}.span_6_of_6{width:100%;}.span_5_of_6{width:83.06%;}.span_4_of_6{width:66.13%;}.span_3_of_6{width:49.2%;}.span_2_of_6{width:32.26%;}.span_1_of_6{width:15.33%;}@media only screen and (max-width: 480px){.span_6_of_6{width:100%;}.span_5_of_6{width:100%;}.span_4_of_6{width:100%;}.span_3_of_6{width:100%;}.span_2_of_6{width:100%;}.span_1_of_6{width:100%;}}body{font-family:\"Gibson\",sans-serif;}h1,.h1,h2,.h2,h3,.h3,h4,.h4,h5,.h5,h6,.h6{font-family:\"Gibson-semibold\",sans-serif;font-weight:500;line-height:1.1;color:inherit;}h1,.h1,h2,.h2,h3,.h3{margin-top:20px;margin-bottom:10px;}h4,.h4,h5,.h5,h6,.h6{margin-top:10px;margin-bottom:10px;}h1,.h1{font-size:36px;}h2,.h2{font-size:30px;}h3,.h3{font-size:24px;}h4,.h4{font-size:18px;}h5,.h5{font-size:14px;}h6,.h6{font-size:12px;}.text_center{text-align:center;}.text_right{text-align:right;}.dim{opacity:0.5;}.pull_right{float:right !important;}.inline_block{display:inline-block !important;}.link{text-decoration:underline !important;}.hide{display:none !important;}.dropdown{position:relative;}.dropdown_menu{position:absolute;min-width:90%;background-color:#FFFFFF;border:1px solid #000000;}.dropdown_menu li:hover{background-color:#EEEEEE;}.btn_subtle{border:none;background:none;padding:5px;border:1px solid transparent;border-radius:4px;}.no_outline{outline:none;}.page .content{padding-left:10px;padding-right:10px;}.btn{border:1px solid #7F7F7F;background:#F9F9F9;border-radius:4px;min-width:30px;padding:5px;}.btn_group>.btn{display:inline-block;margin:0;}.btn_group>.btn:not(:first-child){border-top-left-radius:0;border-bottom-left-radius:0;border-left:0;}.btn_group>.btn:not(:last-child){border-top-right-radius:0;border-bottom-right-radius:0;}";

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".Badge{stroke:#7F7F7F;stroke-width:2px;fill:none;}.Badge .svg_icon{-webkit-transform:matrix(0.8, 0, 0, 0.8, 3.2, 3.2);transform:matrix(0.8, 0, 0, 0.8, 3.2, 3.2);fill:#7F7F7F;stroke:#7F7F7F;stroke-width:0.1px;}.Badge.active{fill:#23A5DF;stroke:#23A5DF;}.Badge.active .svg_icon{stroke:white;fill:white;}.Badge:not(.active){stroke-dasharray:5,5;}";

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".CommentBox .Comment .commentContent{overflow:hidden;}.CommentBox .Comment .commentImage{height:30px;width:30px;float:left;font-size:30px;margin-right:15px;}.CommentBox .CommentList{margin-top:20px;}.CommentBox .CommentForm{border-radius:8px;border:1px solid #7F7F7F;background:#F9F9F9;padding:15px;}.CommentBox .CommentForm .commentWrapper{background:white;border:1px solid #7F7F7F;border-radius:4px;padding-right:20px;padding:5px;overflow:hidden;}.CommentBox .CommentForm div.textareaWrapper{overflow:hidden;}.CommentBox .CommentForm textarea{height:23px;width:100%;border:0;resize:vertical;}.CommentBox .CommentForm textarea:focus{outline:none;}.CommentBox .CommentForm .btn{float:right;padding:12px 20px;margin-left:10px;}.CommentBox .CommentForm .userImage{float:left;height:30px;width:30px;margin-right:10px;}";

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".Dropdown{display:inline-block;position:relative;}.Dropdown .content{position:absolute;z-index:100;background:white;border-radius:4px;border:1px solid #AAA;padding:10px;}";

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".Logo{font-family:\"Gibson-semibold\";font-size:24px;}";

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".Notifications .notifications_icon path.background{fill:red;}.Notifications .notifications_icon path.icon{fill:white;}.Notifications .notifications_icon text{fill:white;text-anchor:start;}.Notifications ul.notifications .unread{background-color:red;}";

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		"table.Replications{border-collapse:collapse;border:1px solid #7F7F7F;}table.Replications td{border:1px solid #7F7F7F;padding:10px;}table.Replications th{padding:10px;}table.Replications th:first-child{border:1px solid #7F7F7F;}table.Replications td:first-child,table.Replications thead,table.Replications tfoot{background-color:#F9F9F9;}table.Replications td:first-child{text-align:right;}table.Replications td:not(:first-child){text-align:center;width:256px;}table.Replications tfoot td{text-align:center !important;}table.Replications td.replication{background-color:#F5F9FD;}table.Replications .badges .Badge{display:inline-block;width:40px;height:40px;margin-left:10px;margin-right:10px;}.ReplicationPath{white-space:nowrap;padding-top:20px;overflow:auto;}.ReplicationPath .study{float:left;height:54px;position:relative;width:256px;z-index:0;background-image:url("+__webpack_require__(98)+"),url("+__webpack_require__(11)+");background-repeat:no-repeat;background-position:50% 20px,right 0 top 20px;background-size:auto auto,100% 7px;}.ReplicationPath .study .add_replication{position:absolute;right:40px;top:20px;}.ReplicationPath .replication{background-repeat:no-repeat,repeat-x;background-position:50% 20px,0 20px;float:left;height:54px;position:relative;}.ReplicationPath .replication .count{background:#23A6E0;color:#FFF;display:block;line-height:24px;margin-top:-10px;text-align:center;width:30px;border-radius:4px;}.ReplicationPath .replication.closed{background-image:url("+__webpack_require__(96)+"),url("+__webpack_require__(11)+");background-position:-2px 20px;width:30px;}.ReplicationPath .replication.open{background-image:url("+__webpack_require__(97)+"),url("+__webpack_require__(11)+");width:256px;}.ReplicationPath .replication.open .count{display:none;}.ReplicationPath .study:first-of-type{background-size:auto auto,50% 7px;}.ReplicationPath .study:last-child{background-position:50% 20px,left 0 top 20px;background-size:auto auto,75% 7px;}";

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".Search{line-height:28px;}.Search input{border-radius:4px;padding:5px 10px 5px 10px;font-size:16px;}";

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".SearchFilter{width:200px;}.SearchFilter label{display:block;}.SearchFilter button.active{background-color:#23A5DF;}";

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".SearchResults{padding:10px;}.SearchResults ul{list-style:none;}.SearchResults .sort{float:right;margin-right:10px;}.SearchResults .more{text-align:center;}.SearchResults .searchResult{color:#000;padding:10px;margin-top:15px;}.SearchResults .searchResult:not(:last-child){border-bottom:2px solid #F9F9F9;}.SearchResults .searchResult .badges{text-align:right;}.SearchResults .searchResult .Badge{display:inline-block;height:30px;width:30px;padding:0 10px;}.SearchResults li.search_nav .btn{padding:5px;}.SearchResults li.search_nav .btn .icon{font-size:30px;font-weight:bold;line-height:25px;}.SearchResults li.search_nav .btn:hover{background-color:#EEE;}.SearchResults li.search_nav .btn:focus{outline:none;}";

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		"ul.Spinner{position:fixed;z-index:3;margin:0 auto;left:0;right:0;top:50%;margin-top:-30px;width:60px;height:60px;list-style:none;}ul.Spinner li{background-color:#FFFFFF;width:10px;height:10px;float:right;margin-right:5px;border:1px solid black;box-shadow:0px 30px 20px rgba(0, 0, 0, 0.2);}ul.Spinner li:first-child{-webkit-animation:loadbars 0.6s cubic-bezier(0.645, 0.045, 0.355, 1) infinite 0s;}ul.Spinner li:nth-child(2){-webkit-animation:loadbars 0.6s ease-in-out infinite -0.2s;}ul.Spinner li:nth-child(3){-webkit-animation:loadbars 0.6s ease-in-out infinite -0.4s;}@-webkit-keyframes 'loadbars'{0%{height:10px;margin-top:25px;}50%{height:50px;margin-top:0px;}100%{height:10px;margin-top:25px;}}";

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".Pill{display:inline-block;white-space:nowrap;border-radius:4px;background-color:#23A5DF;color:white;padding:4px;font-size:12px;line-height:20px;margin:2px;}";

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".UserBar{float:right;list-style:none;height:40px;margin-top:10px;margin-right:30px;}.UserBar a{text-decoration:none;color:black;}.UserBar>li{display:inline-block;}.UserBar>li:not(:first-child){margin-left:40px;}.UserBar .icon_bookmark,.UserBar .history{font-size:30px;color:white;}.UserBar .Dropdown>button{background:none;border:none;margin:0;padding:0;}.UserBar .Dropdown .content{right:0;}.UserBar .Dropdown .content ul{list-style:none;padding:0;margin:0;min-width:150px;}.UserBar .Dropdown.user img{height:32px;width:32px;border-radius:50%;border:2px solid white;vertical-align:middle;}.UserBar .Dropdown.user ul li:hover{background:blue;color:white;}";

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".DefaultLayout{position:absolute;width:100%;}.DefaultLayout header{margin-bottom:20px;}.DefaultLayout header .banner{background-color:#0B3040;padding:10px 20px 10px 10px;position:relative;line-height:28px;}.DefaultLayout header .Search{position:relative;background-color:#F9F9F9;border-bottom:1px solid #7F7F7F;padding:10px 3%;}.DefaultLayout header .Search input{height:35px;font-size:24px;width:100%;}.DefaultLayout header .logoLink{text-decoration:none;}.DefaultLayout header .Logo{width:200px;height:100px;display:inline-block;}.DefaultLayout header .Logo text{fill:white;}.DefaultLayout header .Notifications{height:32px;width:32px;display:inline-block;}";

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".FullLayout{position:absolute;min-height:100%;width:100%;}.FullLayout header{background-color:#0B3040;}.FullLayout a.logo{text-decoration:none;}.FullLayout .Logo{height:256px;}.FullLayout .Logo text{fill:white;}";

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		"#ArticlePage .authors{color:#7F7F7F;}#ArticlePage .journal h5,#ArticlePage .doi h5,#ArticlePage .keywords h5,#ArticlePage .peerReview h5{color:#7F7F7F;margin-top:15px;margin-bottom:5px;}#ArticlePage .journal p,#ArticlePage .doi p,#ArticlePage .keywords p,#ArticlePage .peerReview p{margin:0;}#ArticlePage .bookmark_article{color:#23A5DF;}";

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		"#HomePage .aboutLink{position:absolute;top:10px;left:20px;color:white;}#HomePage .Search{padding:10px 5%;background-color:#0B3040;}#HomePage .Search input{text-align:center;height:35px;font-size:24px;width:100%;}#HomePage .articleView{margin:0 40px;padding:20px 0;}#HomePage .articleView .Badge{display:inline-block;height:30px;width:30px;padding:5px 10px;}#HomePage .articleView:not(:last-child){border-bottom:2px solid #F9F9F9;}";

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		"#LoginPage input{height:32px;border-radius:4px;margin-right:10px;}#LoginPage input:focus{outline:none;}";

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		"";

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		"#ProfilePage .details{background:#F9F9F9;}#ProfilePage .details .editOrFollow{float:right;margin-top:10px;margin-right:10px;}#ProfilePage .details .contacts .section:not(:first-child){margin-top:10px;}#ProfilePage .details .contacts .icon{color:white;height:30px;line-height:30px;width:30px;border-radius:10px;font-size:25px;text-align:center;margin-right:10px;}#ProfilePage .details .contacts .icon_twitter{background:#82D1F3;}#ProfilePage .details .contacts .icon_facebook{background:#23A5DF;}#ProfilePage .details .contacts .icon_mail{background:#2FCBBB;}#ProfilePage .details .contacts .icon_comment{background:#B16EDF;}";

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		"#SearchPage{height:100%;min-width:600px;}";

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		"#SignupPage input,#SignupPage button{height:32px;border-radius:4px;}#SignupPage input{margin-right:10px;}";

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "/assets/8ca8e72cb17efc3a18023c84fd4fc98c.ttf"

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "/assets/206ba05ce0986dee78688c1a2f6f2f89.ttf"

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "/assets/3584b6477f4cc93f41aa1251b61dea07.ttf"

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "/assets/928ec947759d6a740a3c5f12e178dee0.ttf"

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "/assets/2e8dfa34008154c20100070e631b6577.svg"

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "/assets/596d003cb2bc7eb07fa25d7de7e8c33a.ttf"

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(76);

	var m = __webpack_require__(3);
	var _ = __webpack_require__(2);

	var Comment = {};

	Comment.view = function(ctrl) {
	  var comment = ctrl.comment;
	  if (!_.isEmpty(comment.get("replies"))) {
	    var replies = new CommentList.view({comments: comment.get("replies")});
	  }

	  return (
	    m("div", {className:"Comment"}, [
	      comment.get("image"),
	      m("div", {className:"commentContent"}, [
	        m("h5", [comment.get("author"), " - 2 days ago"]),
	        m("p", [comment.get("body")]),
	        m("label", {onclick:ctrl.reply}, [m("span", {className:"icon icon_reply"}), " Reply"]),

	        replies
	      ])
	    ])
	  );
	};

	var CommentList = {};

	CommentList.view = function(ctrl) {
	  var comments = _.map(ctrl.comments, function(comment) {
	    return new Comment.view({comment: comment, reply: function() { alert("reply clicked"); }});
	  });

	  return (
	    m("div", {className:"CommentList"}, [
	      comments
	    ])
	  );
	};

	var CommentForm = {};

	CommentForm.controller = function(options) {
	  this.body = m.prop("");
	  this.anonymous = m.prop(false);
	  this.user = options.user;

	  var _this = this;
	  this.handleSubmit = function(e) {
	    e.preventDefault();
	    alert("comment added: " + _this.body());
	  };
	};

	CommentForm.view = function(ctrl) {
	  return (
	    m("form", {className:"CommentForm", onsubmit:ctrl.handleSubmit}, [
	      m("button", {type:"submit", className:"btn"}, ["Post"]),

	      m("div", {className:"commentWrapper"}, [
	        m("img", {src:ctrl.user.get("gravatarUrl"), className:"userImage"} ),
	        m("div", {className:"textareaWrapper"}, [
	          m("textarea", {value:ctrl.body(), oninput:m.withAttr("value", ctrl.body), placeholder:"Add a comment"})
	        ])
	      ])
	    ])
	  );
	};

	var CommentBox = {};

	CommentBox.controller = function(options) {
	  this.comments = options.comments;
	  this.commentFormController = new CommentForm.controller({user: options.user});
	};

	CommentBox.view = function(ctrl) {
	  return (
	    m("div", {className:"CommentBox"}, [
	      new CommentForm.view(ctrl.commentFormController),
	      new CommentList.view({comments: ctrl.comments})
	    ])
	  );
	};

	module.exports = CommentBox;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(79);

	var _ = __webpack_require__(2);
	var cx = __webpack_require__(7);
	var Dropdown = __webpack_require__(13);

	// number of digits
	var Paths = {
	  "1": "M24.643799,0.025247c-3.595337-0.281372-6.734497,1.817383-8.019653,4.886169c-0.325195,0.776611-1.138611,1.217407-1.978027,1.151733c0,0-0.000549,0-0.000793,0c-0.509766-0.038208-1.035156-0.059265-1.577881-0.060852c-0.020447-0.000061-0.038879-0.002319-0.059387-0.002319l0.000305,0.000305c-0.002869,0-0.005493-0.000305-0.008362-0.000305c-8.504578,0-13,4.495422-13,12.999999s4.495422,13,13,13s13-4.495422,13-13c0-0.002869-0.000305-0.005493-0.000305-0.008362L26,18.99192c0-0.020508-0.002258-0.03894-0.002319-0.059387c-0.001587-0.542725-0.022644-1.068115-0.060852-1.577881c0-0.000244,0-0.000549,0-0.000549c-0.065674-0.839661,0.375122-1.653075,1.151733-1.978271c3.068787-1.285156,5.167542-4.424316,4.886169-8.019653C31.673157,3.501687,28.498291,0.326821,24.643799,0.025247z",
	  "2": "M39.982727,7.467468C39.707458,3.215454,35.986938,0,31.725952,0H24c-3.323608,0-6.169739,2.028503-7.376953,4.914001c-0.324524,0.775818-1.138855,1.214722-1.977234,1.149109c-0.000366,0-0.000793-0.000061-0.000793-0.000061c-0.520569-0.039001-1.055969-0.061035-1.610474-0.06189C13.024048,6.00116,13.014526,6,13.004028,6l0.000122,0.000122C13.002747,6.000122,13.001404,6,13,6C4.495422,6,0,10.495422,0,19s4.495422,13,13,13s13-4.495422,13-13v-0.000427l0,0c0-0.324158-0.006531-0.642517-0.019592-0.955078C25.933594,16.922791,26.855103,16,27.977844,16H32C36.594482,16,40.284424,12.126831,39.982727,7.467468z"
	};

	var Notifications = {};

	Notifications.controller = function(options) {
	  options = options || {};
	  this.notifications = options.notifications || [];
	  this.unreadCount = 2;

	  var label = (
	    m("svg", {viewBox:"0 0 40 32", className:"notifications_icon"}, [
	      m("path", {className:"background", d:this.unreadCount >= 10 ? Paths[2] : Paths[1]} ),
	      m("g", {transform:"scale(0.65 0.65) translate(4,12)"}, [
	        m("path", {className:"icon", d:"M30,22.666565l-3.818237-2.222168l-1.272705-10c0-2.454712-2.521606-4.444458-4.363647-4.444458H19v-4h-6v4h-1.54541c-1.842041,0-4.363647,1.989746-4.363647,4.444458l-1.272705,10L2,22.666565v3.333374h10v1c0,2.209106,1.790894,4,4,4s4-1.790894,4-4v-1h10V22.666565z"})
	      ]),
	      m("text", {x:"20", y:"13"}, [this.unreadCount])
	    ])
	  );

	  this.dropdownController = new Dropdown.controller({
	    className: "Notifications",
	    label: label
	  });
	};

	Notifications.view = function(ctrl) {
	  var notifications = _.map(ctrl.notifications, function(notification) {
	    var classes = cx({unread: !notification.read});

	    return (
	      m("li", {className:classes}, [
	        m("h2", [notification.title]),
	        m("p", [notification.body])
	      ])
	    );
	  });

	  var dropdownContent = m("ul", {className:"notifications"}, [notifications]);
	  return new Dropdown.view(ctrl.dropdownController, dropdownContent);
	};

	module.exports = Notifications;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(80);

	var Badge = __webpack_require__(8);

	var ReplicationsTable = {};

	ReplicationsTable.view = function() {
	  return (
	    m("table", {className:"Replications"}, [
	      m("thead", [
	        m("tr", [
	          m("th", ["Replication path"]),
	          m("th", {colSpan:"3", className:"ReplicationPath"}, [
	            m("div", {className:"study"}),
	            m("div", {className:"replication open"}),
	            m("div", {className:"study"})
	          ])
	        ])
	      ]),
	      m("tbody", [
	        m("tr", [
	          m("td", ["Authors & Study"]),
	          m("td", ["Zhong et al."]),
	          m("td", {className:"replication"}, ["Zhong et al."]),
	          m("td", ["Zhong et al."])
	        ]),
	        m("tr", [
	          m("td"),
	          m("td", {className:"badges"}, [
	            new Badge.view({badge: "data", active: true}),
	            new Badge.view({badge: "methods", active: true}),
	            new Badge.view({badge: "registration"}),
	            new Badge.view({badge: "disclosure"})
	          ]),
	          m("td", {className:"badges replication"}, [
	            new Badge.view({badge: "data", active: true}),
	            new Badge.view({badge: "methods", active: true}),
	            new Badge.view({badge: "registration", active: true}),
	            new Badge.view({badge: "disclosure", active: true})
	          ]),
	          m("td", {className:"badges"}, [
	            new Badge.view({badge: "data"}),
	            new Badge.view({badge: "methods"}),
	            new Badge.view({badge: "registration"}),
	            new Badge.view({badge: "disclosure"})
	          ])
	        ]),
	        m("tr", [
	          m("td", ["Independent variables"]),
	          m("td", [
	            "Transcribe unethical vs ethical deed"
	          ]),
	          m("td", {className:"replication"}, [
	            "Transcribe unethical vs ethical deed"
	          ]),
	          m("td", [
	            "Transcribe unethical vs ethical deed"
	          ])
	        ]),
	        m("tr", [
	          m("td", ["Dependent variables"]),
	          m("td", [
	            "Desirability of cleaning-related products"
	          ]),
	          m("td", {className:"replication"}, [
	            "Desirability of cleaning-related products"
	          ]),
	          m("td", [
	            "Desirability of cleaning-related products"
	          ])
	        ]),
	        m("tr", [
	          m("td", ["N ", m("span", {className:"icon icon_person"})]),
	          m("td", ["27"]),
	          m("td", {className:"replication"}, ["27"]),
	          m("td", ["27"])
	        ]),
	        m("tr", [
	          m("td", ["Power"]),
	          m("td", ["86%"]),
	          m("td", {className:"replication"}, ["86%"]),
	          m("td", ["27"])
	        ]),
	        m("tr", [
	          m("td", ["Effect size"]),
	          m("td", ["d=1.08"]),
	          m("td", {className:"replication"}, ["d=1.08"]),
	          m("td", ["d=1.08"])
	        ])
	      ]),
	      m("tfoot", [
	        m("tr", [
	          m("td", {colSpan:"4"}, [
	            m("button", {className:"btn"}, ["View Graph"])
	          ])
	        ])
	      ])
	    ])
	  );
	};

	module.exports = ReplicationsTable;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(82);

	var SearchFilter = {};

	SearchFilter.view = function(ctrl) {
	  return (
	    m("div", {className:"SearchFilter"}, [
	      m("div", {className:"section"}, [
	        m("div", {className:"col span_1_of_2"}, ["Filter Results"]),
	        m("div", {className:"col span_1_of_2"}, ["Clear all"])
	      ]),

	      m("div", {className:"section"}, [
	        m("div", ["Show"]),
	        m("button", {type:"button", className:"active"}, ["All"]),
	        m("button", {type:"button"}, [m("span", {className:"icon icon_bookmark"})]),
	        m("button", {type:"button"}, [m("span", {className:"icon icon_eye"})])
	      ]),

	      m("div", {className:"section"}, [
	        m("div", ["Articles with"]),
	        m("label", [m("input", {type:"checkbox"} ),"Replications"]),
	        m("label", [m("input", {type:"checkbox"} ),"Data/Syntax"]),
	        m("label", [m("input", {type:"checkbox"} ),"Reproducibility"]),
	        m("label", [m("input", {type:"checkbox"} ),"Materials"]),
	        m("label", [m("input", {type:"checkbox"} ),"Registrations"]),
	        m("label", [m("input", {type:"checkbox"} ),"Disclosures"])
	      ]),

	      m("div", {className:"section"}, [
	        m("div", ["Publication Date"])
	      ]),

	      m("div", {className:"section"}, [
	        m("div", ["Journal"])
	      ]),

	      m("div", {className:"section"}, [
	        m("div", ["Participants (N)"])
	      ]),

	      m("div", {className:"section"}, [
	        m("div", ["Authors"])
	      ]),

	      m("div", {className:"section"}, [
	        m("div", ["Related keywords"])
	      ])
	    ])
	  );
	};

	module.exports = SearchFilter;


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(83);

	var _ = __webpack_require__(2);
	var m = __webpack_require__(3);

	var ArticleModel = __webpack_require__(9);
	var Spinner = __webpack_require__(5);
	var SearchFilter = __webpack_require__(54);
	var Badge = __webpack_require__(8);

	var SearchResults = {};

	SearchResults.controller = function() {
	  this.results = m.prop([]);
	  this.total = m.prop(0);
	  this.from = m.prop(0);
	  this.resultsPerPage = m.prop(20);
	  this.loading = m.prop(true);

	  var _this = this;
	  this.previousPage = function() {
	    _this.from(Math.max(_this.from()-_this.resultsPerPage(), 0));
	    _this.fetchResults();
	  };

	  this.nextPage = function() {
	    _this.from(_this.from() + _this.resultsPerPage());
	    _this.fetchResults();
	  };

	  this.fetchResults = function() {
	    _this.loading(true);

	    var query = m.route.param("query");
	    var t0 = _.now();
	    m.request({method: "GET", url: "https://api.curatescience.org/articles?q="+query+"&from="+_this.from(), background: true}).then(function(res) {
	      var t1 = _.now();

	      _this.results(_.map(res.documents, function(doc) { return new ArticleModel(doc); }));
	      _this.loading(false);
	      _this.total(res.total);
	      _this.from(res.from);
	      m.redraw();

	      // log timing
	      ga('send', 'timing', 'SearchResults', 'Fetch', t1-t0, "/articles?q="+query+"&from="+res.from);
	    });
	  };

	  this.fetchResults();
	};

	SearchResults.itemView = function(article) {
	  return (
	    m("li", {className:"searchResult section"}, [
	      m("div", {className:"col span_3_of_4"}, [
	        m("a", {href:"/articles/"+article.get("id"), config:m.route}, [article.get("title")]),
	        m("div", {className:"authors"}, ["(",article.get("year"),") ", article.get("authorsEtAl")])
	      ]),
	      m("div", {className:"col span_1_of_4 badges"}, [
	        new Badge.view({badge: "data", active: true}),
	        new Badge.view({badge: "methods", active: true}),
	        new Badge.view({badge: "registration"}),
	        new Badge.view({badge: "disclosure"})
	      ])
	    ])
	  );
	};

	SearchResults.view = function(ctrl) {
	  var content;

	  if (ctrl.loading()) {
	    content = new Spinner.view();
	  } else if (ctrl.total() > 0) {
	    content = m("ul", [_.map(ctrl.results(), function(article) { return new SearchResults.itemView(article); })]);
	  } else {
	    content = m("h3", ["Sorry, no results were found"]);
	  }

	  if (ctrl.total() > 0) {
	    var nav = (
	      m("div", {className:"search_nav"}, [
	        m("div", {className:"sort"}, [
	          "Sort by",
	          m("span", ["Relavance"]),
	          m("span", ["Date"])
	        ]),
	        ctrl.total(), " Results"
	      ])
	    );

	    if (ctrl.from() + ctrl.resultsPerPage() < ctrl.total()) {
	      var more = (
	        m("div", {className:"section more"}, [
	          m("button", {type:"button", onclick:ctrl.nextPage}, ["More results"])
	        ])
	      );
	    }
	  }

	  return (
	    m("div", {className:"section SearchResults"}, [
	      
	      m("div", {className:"col span_1_of_6"}, [new SearchFilter.view()]),
	      m("div", {className:"col span_5_of_6"}, [
	        nav,
	        content,
	        more
	      ])
	    ])
	  );
	};

	module.exports = SearchResults;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(85);

	var _ = __webpack_require__(2);
	var m = __webpack_require__(3);
	var cx = __webpack_require__(7);

	var TagEditor = {};

	TagEditor.controller = function(options) {
	  this.tags = options.tags;

	  var _this = this;
	  this.addPill = function() {
	    var pills = _this.pills();
	    var newPill = {
	      text: "",
	      controller: new TagEditor.pillController()
	    };
	    pills.push(newPill);
	    _this.pills(pills);
	  };
	};

	TagEditor.pillController = function(options) {
	  options = options || {};

	  this.editable = options.editable || false;
	  this.editing = m.prop(options.editing || false);
	  this.text = m.prop(options.text || "");

	  var _this = this;
	  this.handleEditClick = function() {
	    _this.editing(true);
	  };

	  this.handleCheckMarkClick = function(e) {
	    e.preventDefault();
	    _this.editing(false);
	  };

	  this.handleRemoveClick = function() {
	    _this.text("");
	  };
	};

	TagEditor.pillView = function(pillCtrl) {
	  var content = pillCtrl.text();

	  if (pillCtrl.editable) {
	    if (pillCtrl.editing()) {
	      content = (
	        m("form", {onSubmit:pillCtrl.handleCheckMarkClick} , [
	          m("input", {type:"text", value:pillCtrl.text(), oninput:m.withAttr("value", pillCtrl.text)} ),
	          m("button", {type:"submit"}, [m("span", {className:"icon icon_check_mark"})]),
	          m("button", {type:"button", onClick:pillCtrl.handleRemoveClick}, [m("span", {className:"icon icon_close"})])
	        ])
	      );
	    } else {
	      var controls = m("span", {className:"icon icon_edit", onClick:pillCtrl.handleEditClick});
	    }
	  }

	  return m("div", {className:"Pill"}, [content, " ", controls]);
	};

	TagEditor.view = function(ctrl) {
	  var pills = ctrl.tags.map(function(tag) {
	    return new TagEditor.pillView(tag, ctrl.editable);
	  });

	  if (ctrl.editable) {
	    var add = m("span", {className:"icon icon_add", onClick:ctrl.addPill});
	  }
	  
	  return (
	    m("div", {className:"TagEditor"}, [
	      pills,
	      add
	    ])
	  );
	};

	module.exports = TagEditor;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";

	var DataIcon = {};

	DataIcon.view = function(ctrl) {
	  if (ctrl.size === "small") {
	    return (
	      m("g", {className:"svg_icon"}, [
	        m("path", {d:"M23.999968,3.999993H7.999989c-2.209104,0-3.999995,1.790769-3.999995,3.999995v15.999979"+' '+
	          "c0,2.209103,1.790891,3.999994,3.999995,3.999994h15.999979c2.209105,0,3.999994-1.790892,3.999994-3.999994V7.999988"+' '+
	          "C27.999962,5.790762,26.209072,3.999993,23.999968,3.999993z M23.999968,7.999988v3.999995h-3.999994V7.999988H23.999968z"+' '+
	           "M19.999973,13.99998h3.999994v3.999995h-3.999994V13.99998z M17.999975,17.999975h-3.999994V13.99998h3.999994V17.999975z"+' '+
	           "M17.999975,7.999988v3.999995h-3.999994V7.999988H17.999975z M7.999989,7.999988h3.999995v3.999995H7.999989V7.999988z"+' '+
	           "M7.999989,13.99998h3.999995v3.999995H7.999989V13.99998z M7.999989,23.999968v-3.999996h3.999995v3.999996H7.999989z"+' '+
	           "M13.999981,23.999968v-3.999996h3.999994v3.999996H13.999981z M19.999973,23.999968v-3.999996h3.999994v3.999996H19.999973z"}),
	        m("rect", {x:"8.999985", y:"7.999965", width:"0.499999", height:"15.999979"}),
	        m("rect", {x:"10.499985", y:"7.999965", width:"0.499999", height:"15.999979"}),
	        m("rect", {x:"13.999976", y:"9.000016", width:"9.999987", height:"0.499999"}),
	        m("rect", {x:"13.999976", y:"10.499955", width:"9.999987", height:"0.499999"})
	      ])
	    );
	  } else {
	    return (
	      m("g", {className:"svg_icon"}, [
	        m("path", {d:"M16,21.333334v-2.666668h1.333334v-1.333332H16v-2.666667h1.333334v-1.333334H16v-2.666666h4v2.666666h1.333334v-2.666666"+' '+
	          "h4v2.666666H28v-8C28,4.597005,27.403076,4,26.666666,4H4C3.263591,4,2.666667,4.597005,2.666667,5.333333v21.333332"+' '+
	          "C2.666667,27.402994,3.263591,28,4,28h13.333334v-2.666666h-6.666667v-2.666668h4L16,21.333334z M21.333334,7.333333h4V8h-4"+' '+
	          "V7.333333z M21.333334,8.666667h4v0.666666h-4V8.666667z M16,7.333333h4V8h-4V7.333333z M16,8.666667h4v0.666666h-4V8.666667z"+' '+
	           "M10.666667,7.333333h4V8h-4V7.333333z M10.666667,8.666667h4v0.666666h-4V8.666667z M10.666667,10.666667h4v2.666666h-4V10.666667"+' '+
	          "z M10.666667,14.666667h4v2.666667h-4V14.666667z M10.666667,18.666666h4v2.666668h-4V18.666666z M6.666667,25.333334H6v-2.666668"+' '+
	          "h0.666667V25.333334z M6.666667,21.333334H6v-2.666668h0.666667V21.333334z M6.666667,17.333334H6v-2.666667h0.666667V17.333334z"+' '+
	           "M6.666667,13.333333H6v-2.666666h0.666667V13.333333z M6.666667,9.333333H6V6.666667h0.666667V9.333333z M8,25.333334H7.333333"+' '+
	          "v-2.666668H8V25.333334z M8,21.333334H7.333333v-2.666668H8V21.333334z M8,17.333334H7.333333v-2.666667H8V17.333334z M8,13.333333"+' '+
	          "H7.333333v-2.666666H8V13.333333z M8,9.333333H7.333333V6.666667H8V9.333333z M9.333333,25.333334H8.666667v-2.666668h0.666666"+' '+
	          "V25.333334z M9.333333,21.333334H8.666667v-2.666668h0.666666V21.333334z M9.333333,17.333334H8.666667v-2.666667h0.666666"+' '+
	          "V17.333334z M9.333333,13.333333H8.666667v-2.666666h0.666666V13.333333z M9.333333,9.333333H8.666667V6.666667h0.666666V9.333333z"
	          }),
	        m("path", {d:"M21.333334,17.333334h5.333332v1.333332H24l4,4l4-4h-2.666666v-1.333332c0-1.470053-1.196615-2.666667-2.666668-2.666667"+' '+
	          "h-5.333332c-1.470053,0-2.666668,1.196614-2.666668,2.666667v1.333332h2.666668V17.333334z"}),
	        m("path", {d:"M26.666666,25.333334h-5.333332V24H24l-4-4l-4,4h2.666666v1.333334C18.666666,26.803385,19.863281,28,21.333334,28"+' '+
	          "h5.333332c1.470053,0,2.666668-1.196615,2.666668-2.666666V24h-2.666668V25.333334z"})
	      ])
	    );
	  }
	};

	module.exports = DataIcon;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";

	var DisclosureIcon = {};

	DisclosureIcon.view = function(ctrl) {
	  if (ctrl.size === "small") {
	    return (
	      m("g", {className:"svg_icon"}, [
	        m("path", {d:"M26.637049,11.999739l1.298094-4.010127c0.20105-0.621215-0.078613-1.296507-0.660032-1.593626l-3.753414-1.917478"+' '+
	          "l-1.917843-3.753535c-0.296997-0.581542-0.97229-0.861205-1.593504-0.660277l-4.010126,1.298338l-4.010005-1.298338"+' '+
	          "c-0.621216-0.200927-1.296508,0.078735-1.593626,0.660155L8.478869,4.478508L4.725579,6.395986"+' '+
	          "C4.143915,6.693105,3.864252,7.368397,4.065423,7.989612l1.297972,4.010127l-1.298704,4.012323"+' '+
	          "c-0.200927,0.62085,0.079102,1.295652,0.660644,1.591307c0,0,4.876581,3.867304,4.903802,3.831903l-1.129149,10.56464"+' '+
	          "l7.499868-6.50544l7.500112,6.503487L22.369598,21.43576l4.903559-3.831293c0.582762-0.296509,0.863279-0.972532,0.661985-1.594481"+' '+
	          "L26.637049,11.999739z M15.999978,20.452852c-4.418329,0-7.99999-3.581659-7.99999-7.99999"+' '+
	          "c0-4.418207,3.58166-7.999867,7.99999-7.999867s7.99999,3.58166,7.99999,7.999867"+' '+
	          "C23.999968,16.871193,20.418308,20.452852,15.999978,20.452852z"}),
	        m("path", {d:"M19.697727,8.593493c-0.109619-0.116942-0.293213-0.122802-0.410156-0.013305l-4.510125,4.227655l-2.183957-1.911497"+' '+
	          "c-0.120605-0.105469-0.303833-0.093262-0.409302,0.027344l-1.146605,1.310058"+' '+
	          "c-0.105469,0.120605-0.093262,0.303832,0.027344,0.409423l3.569209,3.122555c0.112183,0.098267,0.28064,0.095337,0.389403-0.006714"+' '+
	          "l5.850578-5.485955c0.116943-0.109497,0.122803-0.29309,0.013306-0.409911L19.697727,8.593493z"})
	      ])
	    );
	  } else {
	    return (
	      m("g", {className:"svg_icon"}, [
	        m("polygon", {points:"24,30.666666 23.996744,30.664469 23.99707,30.667643    "    }),
	        m("path", {d:"M26.666178,12.152507l1.301758-4.021484c0.20166-0.622966-0.078857-1.30013-0.661945-1.598063l-3.763998-1.922933"+' '+
	          "l-1.923096-3.764079c-0.297934-0.583089-0.975098-0.863607-1.598063-0.661947L15.999512,1.48584l-4.021403-1.301839"+' '+
	          "c-0.622884-0.20166-1.300049,0.078776-1.597981,0.661865l-1.923096,3.76416L4.693034,6.532959"+' '+
	          "C4.109945,6.830892,3.829427,7.508057,4.031087,8.131022l1.301758,4.021484l-1.30249,4.023601"+' '+
	          "c-0.201498,0.622477,0.079427,1.299072,0.662598,1.595783l3.565267,1.813721c0.490315,0.249432,0.7771,0.774334,0.722086,1.321697"+' '+
	          "L8,30.666666l7.999023-5.333332l7.997721,5.331135l-0.97998-9.756184c-0.055012-0.547363,0.231771-1.072266,0.722088-1.321697"+' '+
	          "l3.565266-1.813721c0.584311-0.297363,0.865723-0.97526,0.663818-1.598957L26.666178,12.152507z M16,20"+' '+
	          "c-4.418294,0-8-3.581705-8-8s3.581706-8,8-8s8,3.581706,8,8S20.418295,20,16,20z"}),
	        m("path", {d:"M14.635417,12.744141l-2.509571-2.196466c-0.138535-0.121251-0.349136-0.107233-0.470379,0.031311l-1.31743,1.505425"+' '+
	          "c-0.121247,0.13855-0.107208,0.34916,0.031358,0.47039l4.101284,3.588187c0.128971,0.112835,0.322484,0.109499,0.447489-0.007713"+' '+
	          "l6.722864-6.303828c0.134264-0.125895,0.141081-0.336782,0.015228-0.471085L20.289158,7.90147"+' '+
	          "c-0.125893-0.134346-0.336864-0.141183-0.471191-0.015269L14.635417,12.744141z"})
	      ])
	    );
	  }
	};

	module.exports = DisclosureIcon;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";

	var MethodsIcon = {};

	MethodsIcon.view = function(ctrl) {
	  if (ctrl.size === "small") {
	    return (
	      m("g", {className:"svg_icon"}, [
	        m("path", {d:"M17.999977,10.999984V5.99999h3.999992V3.999993H9.999986V5.99999h3.999997v4.999993L5.772957,24.985926"+' '+
	          "c-0.784274,1.333265,0.177036,3.014036,1.723866,3.014036h17.006311c1.546829,0,2.508141-1.680771,1.723867-3.014036"+' '+
	          "L17.999977,10.999984z M18.417336,19.999971h-4.837397c-0.769652,0-1.250731-0.833006-0.86621-1.499632l2.419675-4.195184"+' '+
	          "c0.384887-0.667357,1.348021-0.667113,1.732664,0.000366l2.417721,4.195062"+' '+
	          "C19.667944,19.167332,19.186743,19.999971,18.417336,19.999971z"})
	      ])
	    );
	  } else {
	    return (
	      m("g", {className:"svg_icon"}, [
	        m("path", {d:"M26.428455,22.904947L18.666655,9.333333v-4h2.666666V2.666667H10.666655v2.666667h2.666666v4L5.581938,22.882486"+' '+
	          "c-0.815593,1.766928,0.475098,3.78418,2.421224,3.78418h15.993815C25.932362,26.666666,27.223133,24.66976,26.428455,22.904947z"+' '+
	           "M19.783245,18.666666h-7.567824c-0.51202,0-0.832914-0.553257-0.578673-0.997696l3.205688-5.603866"+' '+
	          "c0.512034-0.895089,1.802837-0.895012,2.314764,0.000138l3.204758,5.603796"+' '+
	          "C20.616129,18.113478,20.295229,18.666666,19.783245,18.666666z"})
	      ])
	    );
	  }
	};

	module.exports = MethodsIcon;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";

	var RegistrationIcon = {};

	RegistrationIcon.view = function(ctrl) {
	  if (ctrl.size === "small") {
	    return (
	      m("g", {className:"svg_icon"}, [
	        m("rect", {x:"5.999983", y:"20.999958", width:"19.999973", height:"4.999993"}),
	        m("rect", {x:"5.999983", y:"16.999956", width:"19.999973", height:"2.999996"}),
	        m("path", {d:"M22.040009,11.999983h-0.040039V8.338244c0-3.249141-2.433712-6.160637-5.678337-6.329826"+' '+
	          "C12.861188,1.827877,9.999986,4.57885,9.999986,7.997913v4.00207H9.959947c-2.187008,0-3.959955,1.772946-3.959955,3.959955"+' '+
	          "v0.040039h19.999973v-0.040039C25.999966,13.772929,24.227018,11.999983,22.040009,11.999983z M19.499973,11.999983h-6.99999"+' '+
	          "V7.998035c0-1.928709,1.570311-3.498043,3.499995-3.498043s3.499995,1.569334,3.499995,3.498043V11.999983z"})
	      ])
	    );
	  } else {
	    return (
	      m("g", {className:"svg_icon"}, [
	        m("path", {d:"M25.306641,17.333334V16c0-1.458008-1.181967-2.639974-2.639975-2.639974V9.619792"+' '+
	          "c0-3.481771-2.545572-6.591309-6.011799-6.921875C12.67863,2.318685,9.333333,5.435221,9.333333,9.333333v4.026693"+' '+
	          "c-1.458007,0-2.639974,1.181966-2.639974,2.639974v1.333334H25.306641z M12,9.333333c0-2.205566,1.794434-4,4-4"+' '+
	          "c2.205648,0,4,1.794434,4,4v4.026693h-8V9.333333z"}),
	        m("path", {d:"M6.693359,22v4c0,0.368164,0.298502,0.666666,0.666667,0.666666h17.279949"+' '+
	          "c0.368164,0,0.666666-0.298502,0.666666-0.666666v-4H6.693359z"}),
	        m("rect", {x:"6.693359", y:"18.000021", width:"18.613281", height:"3.333333"})
	      ])
	    );
	  }
	};

	module.exports = RegistrationIcon;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";

	var ReproducibleIcon = {};

	ReproducibleIcon.view = function(ctrl) {
	  return (
	    m("g", {className:"svg_icon"}, [
	      m("path", {d:"M9.999986,7.999988h11.999984v3.999995h-3.999994l5.999992,7.999989l5.999992-7.999989h-3.999994V7.999988"+' '+
	      "c0-2.206052-1.793943-3.999995-3.999996-3.999995H9.999986c-2.206051,0-3.999994,1.793943-3.999994,3.999995v1.999998h3.999994"+' '+
	      "V7.999988z"}),
	      m("path", {d:"M21.999969,23.999968H9.999986v-3.999996h3.999995l-5.999992-7.999989l-5.999992,7.999989h3.999995v3.999996"+' '+
	        "c0,2.206051,1.793943,3.999994,3.999994,3.999994h11.999984c2.206053,0,3.999996-1.793943,3.999996-3.999994v-1.999998h-3.999996"+' '+
	        "V23.999968z"})
	    ])
	  );
	};

	module.exports = ReproducibleIcon;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";

	var BaseModel = __webpack_require__(10);

	var CommentModel = BaseModel.extend({
	  relations: {
	    replies: {type: "many"} // model is defined below
	  },
	  defaults: {
	    "author": "",
	    "userId": "",
	    "body": "",
	    "gravatar": "8c51e26145bc08bb6f43bead1b5ad07f.png" // me
	  },
	  computeds: {
	    image: function() {
	      var gravatar = this.get("gravatar");

	      if (gravatar) {
	        return m("img", {src:"//www.gravatar.com/avatar/" + gravatar, className:"commentImage"});
	      } else {
	        return m("span", {className:"icon icon_person commentImage"});
	      }
	    }
	  }
	});

	CommentModel.prototype.relations.replies.model = CommentModel; // had to do this because of self reference

	module.exports = CommentModel;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";

	var _ = __webpack_require__(2);
	var Layout = __webpack_require__(4);

	var AboutPage = {};

	AboutPage.controller = function(options) {
	  options = _.extend({id: "AboutPage"}, options);
	  this.layoutController = new Layout.controller(options);
	};

	AboutPage.view = function(ctrl) {
	  var content = (
	    m("div", [
	      m("h1", ["About"])
	    ])
	  );

	  return new Layout.view(ctrl.layoutController, content);
	};

	module.exports = AboutPage;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(89);

	var _ = __webpack_require__(2);

	var Layout = __webpack_require__(6);
	var Spinner = __webpack_require__(5);
	var ReplicationsTable = __webpack_require__(53);
	var TagEditor = __webpack_require__(56);
	//var ContentEditable = require("../components/ContentEditable.js");
	//new TagEditor.view(ctrl.tagEditorController)
	var CommentBox = __webpack_require__(51);

	var ArticleModel = __webpack_require__(9);

	var ArticlePage = {};

	ArticlePage.controller = function(options) {
	  this.article = new ArticleModel({id: m.route.param("articleId")});
	  this.article.fetch();

	  options = _.extend({id: "ArticlePage"}, options);
	  this.layoutController = new Layout.controller(options);
	  this.tagEditorController = new TagEditor.controller({tags: this.article.get("tags")});
	  this.commentBoxController = new CommentBox.controller({comments: this.article.get("comments"), user: options.user});
	};

	ArticlePage.view = function(ctrl) {
	  var article = ctrl.article;
	  var content;

	  if (article) {
	    var peerReviewers = _.map(article.get("reviewers"), function(reviewer, i) {
	      return (
	        m("div", {className:"reviewer"}, [
	          m("h5", ["Reviewer ", i+1]),
	          m("p", [reviewer])
	        ])
	      );
	    });

	    content = (
	      m("div", [
	        m("div", {className:"section articleHeader"}, [
	          m("div", {className:"col span_3_of_4 titleAndAbstract"}, [
	            m("h2", [article.get("title")]),
	            m("p", {className:"authors"}, [_.compact([article.get("authorLastNames"), article.get("year")]).join(", ")]),

	            m("h3", ["Abstract"]),
	            m("p", {className:"abstract"}, [article.get("abstract")])
	          ]),

	          m("div", {className:"col span_1_of_4 text_right"}, [
	            m("div", {className:"btn_group"}, [
	              m("button", {className:"btn bookmark_article"}, [m("span", {className:"icon icon_bookmark"})]),
	              m("button", {className:"btn"}, [m("span", {className:"icon icon_share"})])
	            ]),

	            m("div", {className:"journal"}, [
	              m("h5", ["Journal"]),
	              m("p", [article.get("journal")])
	            ]),

	            m("div", {className:"doi"}, [
	              m("h5", ["DOI"]),
	              m("p", [article.get("doi")])
	            ]),

	            m("div", {className:"keywords"}, [
	              m("h5", ["Keywords"]),
	              m("p", ["TagEditor here"])
	            ])
	          ])
	        ]),

	        m("div", {className:"section"}, [
	          new ReplicationsTable.view()
	        ]),

	        m("div", {className:"section"}, [
	          m("div", {className:"col span_3_of_4"}, [
	            m("div", [
	              m("h3", ["Community Summary"]),
	              m("p", {className:"dim"}, [article.get("community_summary_date")]),
	              m("p", [article.get("community_summary")])
	            ]),

	            m("div", [
	              m("h3", ["Comments"]),
	              new CommentBox.view(ctrl.commentBoxController)
	            ])
	          ]),
	          m("div", {className:"col span_1_of_4"}, [
	            m("div", {className:"peerReview"}, [
	              m("h3", ["Peer Review"]),
	              m("div", {className:"actionEditor"}, [
	                m("h5", ["Action Editor"]),
	                m("p", [article.get("action_editor")])
	              ]),
	              peerReviewers
	            ]),
	            m("div", [
	              m("h3", ["External Resources"])
	            ])
	          ])
	        ])
	      ])
	    );
	  } else {
	    content = m("h1", ["Article not found"]);
	  }

	  return new Layout.view(ctrl.layoutController, content);
	};

	module.exports = ArticlePage;


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";

	var _ = __webpack_require__(2);
	var m = __webpack_require__(3);

	var Layout = __webpack_require__(6);
	var Spinner = __webpack_require__(5);
	var UserModel = __webpack_require__(17);

	var AuthorPage = {};

	AuthorPage.controller = function(options) {
	  options = _.extend({id: "AuthorPage"}, options);
	  this.layoutController = new Layout.controller(options);
	  this.loading = m.prop(true);
	  this.author = new UserModel({id: options.authorId}, {callback: m.redraw, loading: true})
	};

	AuthorPage.view = function(ctrl) {
	  var loading = ctrl.author.loading;
	  var author = ctrl.author.cortex;
	  var content;

	  if (loading) {
	    content = new Spinner.view();
	  } else if (author) {
	    content = (
	      m("div", [
	        m("h1", {className:"h1"}, [author.name.val()])
	      ])
	    );
	  } else {
	    content = m("h1", ["Author not found"])
	  }

	  return new Layout.view(ctrl.layoutController, content);
	};

	module.exports = AuthorPage;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(90);

	var _ = __webpack_require__(2);
	var m = __webpack_require__(3);
	var Layout = __webpack_require__(4)
	var Search = __webpack_require__(15);
	var ArticleModel = __webpack_require__(9);
	var Badge = __webpack_require__(8);

	var HomePage = {};

	HomePage.controller = function(options) {
	  this.layoutController = new Layout.controller(_.extend({
	    id: "HomePage",
	    header: m("a", {href:"/about", className:"aboutLink", config:m.route}, ["What is Curate Science?"])
	  }, options));
	  this.searchController = new Search.controller({});

	  this.mostCuratedArticles = [
	    new ArticleModel({
	      title: "Feeling the future: Experimental evidence for anomalous retroactive influences on congnition and affect",
	      authors_denormalized: [{lastName: "Bern"}],
	      publication_date: "2011-6-1"
	    }),
	    new ArticleModel({
	      title: "Automaticity of social behavior: Direct effects of trait construct and stereotype activiation on action",
	      authors_denormalized: [{lastName: "Bargh"}, {lastName: "Chen"}, {lastName: "Burrows"}],
	      publication_date: "1996-6-1"
	    }),
	    new ArticleModel({
	      title: "Coherent arbitrariness: Stable demand curves without stable preference",
	      authors_denormalized: [{lastName: "Airely"}],
	      publication_date: "2003-6-1"
	    })
	  ];
	  this.recentlyCuratedArticles = [
	    new ArticleModel({
	      title: "Two birds with one stone: A preregistered adversarial collaboration on horizontal eye movements in free recall",
	      authors_denormalized: [{lastName: "Matzke"}, {lastName: "van Rijn"}, {lastName: "Slagter"}],
	      publication_date: "2013-6-1"
	    }),
	    new ArticleModel({
	      title: "On the association between loneliness and bathing habits: Nine replications of Bargh & Shalev (2012) Study 1",
	      authors_denormalized: [{lastName: "Donnellan"}, {lastName: "Lucas"}, {lastName: "Cesario"}],
	      publication_date: "2006-6-1"
	    }),
	    new ArticleModel({
	      title: "Washing away your sins: Threatened morality and physical cleansing",
	      authors_denormalized: [{lastName: "Zhong"}, {lastName: "Liljenquist"}],
	      publication_date: "2006-6-1"
	    })
	  ];
	};

	HomePage.articleView = function(article) {
	  return (
	    m("div", {className:"articleView"}, [
	      m("div", {className:"title"}, [article.get("title")]),
	      m("div", {className:"authors"}, ["(",article.get("year"),") ", article.get("authorsEtAl")]),
	      m("div", {className:"badges"}, [
	        new Badge.view({badge: "data", active: true}),
	        new Badge.view({badge: "methods", active: true}),
	        new Badge.view({badge: "registration"}),
	        new Badge.view({badge: "disclosure"})
	      ])
	    ])
	  );
	};

	HomePage.view = function(ctrl) {
	  var mostCuratedArticlesContent = _.map(ctrl.mostCuratedArticles, HomePage.articleView);
	  var recentlyUpdatedArticlesContent = _.map(ctrl.recentlyCuratedArticles, HomePage.articleView);

	  var content = (
	    m("div", [
	      m("div", [
	        new Search.view(ctrl.searchController)
	      ]),

	      m("div", {className:"section"}, [
	        m("div", {className:"col span_1_of_2 articles"}, [
	          m("h2", ["Most Curated Articles"]),
	          mostCuratedArticlesContent
	        ]),
	        m("div", {className:"col span_1_of_2 articles"}, [
	          m("h2", ["Recently Updated Articles"]),
	          recentlyUpdatedArticlesContent
	        ])
	      ])
	    ])
	  );

	  return new Layout.view(ctrl.layoutController, content);
	};

	module.exports = HomePage;


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(91);

	var _ = __webpack_require__(2);

	var Layout = __webpack_require__(4);

	var LoginPage = {};

	LoginPage.controller = function(options) {
	  this.layoutController = new Layout.controller(_.extend({id: "LoginPage"}, options));

	  this.email = m.prop("");
	  this.password = m.prop("");

	  var _this = this;
	  this.login = function(e) {
	    e.preventDefault();
	    if (_this.email() === "sdemjanenko@curatescience.org" && _this.password() === "rabbitears") {
	      CS.user = {};
	      m.route("/");
	    }
	  };
	};

	LoginPage.view = function(ctrl) {
	  var content = (
	    m("div", [
	      m("form", {onsubmit:ctrl.login}, [
	        m("input", {type:"text", size:"30", placeholder:"Email", value:ctrl.email(), oninput:m.withAttr("value", ctrl.email)} ),
	        m("input", {type:"password", size:"30", placeholder:"Password", value:ctrl.password(), oninput:m.withAttr("value", ctrl.password)} ),
	        m("input", {className:"btn", type:"submit", value:"Log in"} )
	      ])
	    ])
	  );

	  return new Layout.view(ctrl.layoutController, content);
	};

	module.exports = LoginPage;


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";

	var _ = __webpack_require__(2);

	var Layout = __webpack_require__(4);
	var Spinner = __webpack_require__(5);

	var LogoutPage = {};

	LogoutPage.controller = function(options) {
	  this.layoutController = new Layout.controller(_.extend({id: "LogoutPage"}, options));

	  setTimeout(function() {
	    delete CS.user;
	    m.route("/login");
	  }, 2000);
	};

	LogoutPage.view = function(ctrl) {
	  var content = (
	    m("div", [
	      m("h3", ["Logging out"]),
	      new Spinner.view()
	    ])
	  );

	  return new Layout.view(ctrl.layoutController, content);
	};

	module.exports = LogoutPage;


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(92);

	var _ = __webpack_require__(2);
	var Layout = __webpack_require__(4)

	var NotFoundPage = {};

	NotFoundPage.controller = function(options) {
	  options = _.extend({id: "NotFoundPage"}, options);
	  this.layoutController = new Layout.controller(options);
	};

	NotFoundPage.view = function(ctrl) {
	  var content = (
	    m("div", [
	      m("h1", ["Sorry, we could not find the page you were looking for"]),
	      m("p", ["Our team has been notified of this error."])
	    ])
	  );

	  return new Layout.view(ctrl.layoutController, content);
	};

	module.exports = NotFoundPage;



/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(93);

	var Layout = __webpack_require__(6);

	var _ = __webpack_require__(2);

	var ProfilePage = {};

	ProfilePage.controller = function(options) {
	  options = _.extend({id: "ProfilePage"}, options);
	  this.layoutController = new Layout.controller(options);
	  this.user = options.user;
	};

	ProfilePage.detailsView = function(user) {
	  var areasOfStudy = _.map(user.get("areas_of_study"), function(area) {
	    return m("div", {className:"section"}, [area]);
	  });

	  return (
	    m("div", {className:"details"}, [
	      m("button", {type:"button", className:"editOrFollow"}, [user.get("id") === CS.user.id ? "Settings": "Follow"]),
	      m("h1", {className:"h1 section"}, [user.get("fullName")]),
	      m("div", {className:"section"}, [
	        m("div", {className:"col span_1_of_2"}, [
	          m("h3", ["About"]),
	          user.get("about")
	        ]),
	        m("div", {className:"col span_1_of_2"}, [
	          m("div", {className:"areasOfStudy"}, [
	            m("h3", ["Areas of Study"]),
	            areasOfStudy
	          ]),

	          m("div", {className:"contacts"}, [
	            m("h3", ["Contact"]),

	            m("div", {className:"section"}, [
	              m("span", {className:"icon icon_twitter"}),
	              m("a", {href:user.get("twitterUrl")}, [user.get("twitter")])
	            ]),

	            m("div", {className:"section"}, [
	              m("span", {className:"icon icon_facebook"}),
	              m("a", {href:user.get("facebookUrl")}, [user.get("facebook")])
	            ]),

	            m("div", {className:"section"}, [
	              m("span", {className:"icon icon_mail"}),
	              m("a", {href:"mailto:" + user.get("email")}, [user.get("email")])
	            ]),

	            m("div", {className:"section"}, [
	              m("span", {className:"icon icon_comment"}),
	              "Send a message"
	            ])
	          ])
	        ])
	      ])
	    ])
	  );
	};

	ProfilePage.articlesView = function(user) {
	  var content;
	  if (user.get("articles").length === 0) {
	    content = (
	      m("p", [
	        "Articles you have authored and linked to your user account will soon appear here."
	      ])
	    );
	  } else {
	    var list = _.map(user.get("articles"), function(article) {
	      return m("li", [article.title])
	    });
	    content = m("ul", [list]);
	  }

	  return (
	    m("div", {className:"articles"}, [
	      m("h3", ["Articles"]),
	      content
	    ])
	  );
	};

	ProfilePage.recentContributionsView = function(user) {
	  var content;
	  if (user.get("comments").length === 0) {
	    content = (
	      m("p", [
	        "You have no comments."
	      ])
	    );
	  } else {
	    var list = _.map(user.get("comments"), function(comment) {
	      return m("li", [comment.body])
	    });
	    content = m("ul", [list]);
	  }

	  return (
	    m("div", {className:"recentContributions"}, [
	      m("h3", ["Recent Contributions"]),
	      content
	    ])
	  );
	};

	ProfilePage.view = function(ctrl) {
	  var user = ctrl.user;

	  var content = (
	    m("div", {className:"section"}, [
	      m("div", {className:"col span_1_of_2"}, [
	        ProfilePage.detailsView(ctrl.user),
	        ProfilePage.articlesView(ctrl.user)
	      ]),
	      m("div", {className:"col span_1_of_2"}, [
	        ProfilePage.recentContributionsView(ctrl.user)
	      ])
	    ])
	  );

	  return new Layout.view(ctrl.layoutController, content);
	};

	module.exports = ProfilePage;


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(94);

	var _ = __webpack_require__(2);

	var Layout = __webpack_require__(6);
	var SearchResults = __webpack_require__(55);

	var SearchPage = {};

	SearchPage.controller = function(options) {
	  options = _.extend({id: "SearchPage"}, options);
	  this.layoutController = new Layout.controller(options);
	  this.searchResultsController = new SearchResults.controller();
	};

	SearchPage.view = function(ctrl) {
	  var content = (
	    m("div", [
	      new SearchResults.view(ctrl.searchResultsController)
	    ])
	  );

	  return new Layout.view(ctrl.layoutController, content);
	};

	module.exports = SearchPage;


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx m */

	"use strict";
	__webpack_require__(95);

	var Layout = __webpack_require__(4);

	var SignupPage = {};

	SignupPage.controller = function(options) {
	  options = _.extend({id: "SignupPage"}, options);
	  this.layoutController = new Layout.controller(options);
	};

	SignupPage.view = function(ctrl) {
	  var content = (
	    m("div", [
	      m("h3", ["Register for an invite"]),
	      m("form", {action:"http://christianbattista.us7.list-manage.com/subscribe/post?u=d140eca9cfe4a96473dac6ea5&id=fba08af7dd", method:"post", target:"_blank"}, [
	        m("input", {type:"email", value:"", ref:"email", name:"EMAIL", placeholder:"Enter email address", size:"30", required:true} ),
	        m("div", {style:{"position": "absolute", "left": "-5000px"}}, [
	          m("input", {type:"text", name:"b_d140eca9cfe4a96473dac6ea5_fba08af7dd", value:""} )
	        ]),
	        m("button", {type:"submit"}, ["Request invite"])
	      ])
	    ])
	  );

	  return new Layout.view(ctrl.layoutController, content);
	};

	module.exports = SignupPage;


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var GoogleAnalytics = {};

	GoogleAnalytics.TrackNavigation = function() {
	  ga("send", "pageview");
	};

	module.exports = GoogleAnalytics;

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(23))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(24))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(25))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(26))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(27))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(28))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(29))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(30))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(31))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(32))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(33))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(34))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(35))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(36))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(37))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(38))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(39))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(40))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(41))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(42))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(43))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(1)
		// The css code:
		(__webpack_require__(44))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAmCAYAAAAxxTAbAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAX9JREFUeNrslrFugzAQhk1TkDoRMbEEWMvSMmXNytTkJZjzCH2ErmHqG5QBibUVGxszDGViQ2WKBAO9QyZCiEYE01SVOOkXNjb+fGf7DFdVFfltuyFXsKtAbsuybMcrAb2DHJ7nnakgXFEUPy0KAp8B9soMORwONUQQBCLLMlEUhaiqWtepfYC2APtihrQNAbquE8MwmlchaDMWdApXlmUkTVMSx3FdRpMkiZim2Xg1GtS7JlEUkSAICLRNAkLIEp6PIA1jD3pqPPN9v36ygrjuiYctvcEtDBLRE8/zmEFcX1oB0JKel4cpQL0nnn6IHoU4IA6MAAQhEME4AZwIndC4tDIl6GzuGggatyZD10gUxaOmaffr9TphhvSBXNc95nl+B/VP0AK0auW8vWVZzsWpvhO6ED2gAK0FQFNBb7Ztb0fdJy3QhoZocab7y+k+uTQPdc7F6kxX9V9dv8mQNlbIfkgbE4Ru013HIyzv2luYm/+7ZsgMmSEz5A8h3wIMANmI11PMw74HAAAAAElFTkSuQmCC"

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAmCAYAAAAxxTAbAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdNJREFUeNrslrFuwjAQhs+VwoREhTqjLkwM9ZYpNBITG4/AxNxHyGvARN+AjQEhsSKWdIANiSKQWECNxARDemfFkUtJCU5KO+SkX458cT7b5zuH+b4Pv213cAO7DeR4PPqKFqguyk4Twg6HQ1RQ3lFNwzBGiSHtdltA8vk8FItFKJVKUC6X1XdeUS8I+0gMUS2XywHnHCqViux6Q9m6oHC7NpsNbLdbmM1msN/vhZNWZVmWgCYBnY3JdDoF13UBfWIL6/V6IhBBHrGVaqKeybHb7aDf76cCYqcZj8e3gU0XVUgLxM6VFQRxbEZpgc5mPA506QMoT/2wCkR7oonghO61y8o1IK3tirt11WoVJpPJfL1eP5A/GOKheiin1WotYkF+AjFGw30WMYxgNoJcFvc+UUGr1QoGg0GYsKZpirJERok8Ho9huVxKEI9d6tUYYVWYS0CtVgsBsgZSH/mCLXSuuk8CEA9iIFYQZYqvcfWlhaCFDLK6glNTfIV/ff16MshRpvg8XQjlgThFUab4eroQh2ZIx3Q4HH5ZET1Tn3KEHab739XpdMK8uZSM2oGnwXScg38A7+Tj1MeDd4Blf5DfyjljNunPVpLFJItJFpPL9inAAOviKtc/fkzqAAAAAElFTkSuQmCC"

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAmCAYAAADwQnq3AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAOZJREFUeNrsU0EKhDAMTHsW/IHsE7z1KvgBX9F3+A297Q/8gLBXbz5h6Q8E726mtktW8CAseOlAMCSTpJNatW0bAX3fP/jTsjVsOe1Y2AbErbVvBBQKmFyy/xLEI1BYcdGsuq5D5xnkoijIGENZlnnWuq40TRM552JRqcMxPLmu6y8ZgI8YcmF6q8OZfecziFyj47ll5yNELtd0ETqI8QLPIHKLDnv22ziDyA1xSwtWN47jzyT4iIm1tpcvzouGg0the0ZNgohYGTj7r3F1SzcUKKUq2F8m3CQ6aUgabntAqeCAjwADAK3kZ7dfBqCAAAAAAElFTkSuQmCC"

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "data:application/font-woff;base64,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"

/***/ }
/******/ ])
