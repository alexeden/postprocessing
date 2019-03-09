(function (three) {
	'use strict';

	/**
	 * A demo base class.
	 */

	class Demo {

		/**
		 * Constructs a new demo.
		 *
		 * @param {String} [id="demo"] - A unique identifier.
		 */

		constructor(id = "demo") {

			/**
			 * The id of this demo.
			 *
			 * @type {String}
			 */

			this.id = id;

			/**
			 * A renderer.
			 *
			 * @type {WebGLRenderer}
			 * @protected
			 */

			this.renderer = null;

			/**
			 * A loading manager.
			 *
			 * @type {LoadingManager}
			 * @protected
			 */

			this.loadingManager = new three.LoadingManager();

			/**
			 * A collection of loaded assets.
			 *
			 * @type {Map}
			 * @protected
			 */

			this.assets = new Map();

			/**
			 * The scene.
			 *
			 * @type {Scene}
			 * @protected
			 */

			this.scene = new three.Scene();

			/**
			 * The camera.
			 *
			 * @type {Camera}
			 * @protected
			 */

			this.camera = null;

			/**
			 * Camera controls.
			 *
			 * @type {Disposable}
			 * @protected
			 */

			this.controls = null;

			/**
			 * Indicates whether this demo is ready for rendering.
			 *
			 * The {@link DemoManager} updates this flag automatically.
			 *
			 * @type {Boolean}
			 */

			this.ready = false;

		}

		/**
		 * Sets the renderer.
		 *
		 * @param {WebGLRenderer} renderer - A renderer.
		 * @return {Demo} This demo.
		 */

		setRenderer(renderer) {

			this.renderer = renderer;

			return this;

		}

		/**
		 * Loads this demo.
		 *
		 * Override this method to load assets.
		 *
		 * @return {Promise} A promise that will be fulfilled as soon as all assets have been loaded.
		 */

		load() {

			return Promise.resolve();

		}

		/**
		 * Initialises this demo.
		 *
		 * This method will be called after reset.
		 */

		initialize() {}

		/**
		 * Renders this demo.
		 *
		 * Override this method to update and render the demo manually.
		 *
		 * @param {Number} delta - The time since the last frame in seconds.
		 */

		render(delta) {

			this.renderer.render(this.scene, this.camera);

		}

		/**
		 * Registers configuration options.
		 *
		 * This method will be called once after initialize and then every time a new
		 * demo is added.
		 *
		 * @param {GUI} menu - A menu.
		 */

		registerOptions(menu) {}

		/**
		 * Resets this demo.
		 *
		 * @return {Demo} This demo.
		 */

		reset() {

			const fog = this.scene.fog;

			this.scene = new three.Scene();
			this.scene.fog = fog;
			this.camera = null;

			if(this.controls !== null) {

				this.controls.dispose();
				this.controls = null;

			}

			this.ready = false;

			return this;

		}

	}

	/**
	 * A basic event.
	 */

	class Event {

		/**
		 * Creates a new event.
		 *
		 * @param {String} type - The name of the event.
		 */

		constructor(type) {

			/**
			 * The name of the event.
			 *
			 * @type {String}
			 */

			this.type = type;

			/**
			 * A reference to the target to which the event was originally dispatched.
			 *
			 * @type {Object}
			 */

			this.target = null;

		}

	}

	/**
	 * A base class for objects that can receive events and may have listeners for
	 * them.
	 */

	class EventTarget {

		/**
		 * Constructs a new EventTarget.
		 */

		constructor() {

			/**
			 * A map of event listener functions.
			 *
			 * @type {Map}
			 */

			this.listenerFunctions = new Map();

			/**
			 * A map of event listener objects.
			 *
			 * @type {Map}
			 */

			this.listenerObjects = new Map();

		}

		/**
		 * Registers an event handler of a specific event type on the event target.
		 *
		 * @param {String} type - The event type to listen for.
		 * @param {Object} listener - The object that receives a notification when an event of the specified type occurs.
		 */

		addEventListener(type, listener) {

			const m = (typeof listener === "function") ? this.listenerFunctions : this.listenerObjects;

			if(m.has(type)) {

				m.get(type).add(listener);

			} else {

				m.set(type, new Set([listener]));

			}

		}

		/**
		 * Removes an event handler of a specific event type from the event target.
		 *
		 * @param {String} type - The event type to remove.
		 * @param {Object} listener - The event listener to remove from the event target.
		 */

		removeEventListener(type, listener) {

			const m = (typeof listener === "function") ? this.listenerFunctions : this.listenerObjects;

			let listeners;

			if(m.has(type)) {

				listeners = m.get(type);
				listeners.delete(listener);

				if(listeners.size === 0) {

					m.delete(type);

				}

			}

		}

		/**
		 * Dispatches an event at the specified event target, invoking the affected
		 * event listeners in the appropriate order.
		 *
		 * @param {Event} event - The event to dispatch.
		 * @param {EventTarget} [target] - An event target.
		 */

		dispatchEvent(event, target = this) {

			const listenerFunctions = target.listenerFunctions;
			const listenerObjects = target.listenerObjects;

			let listeners;
			let listener;

			event.target = target;

			if(listenerFunctions.has(event.type)) {

				listeners = listenerFunctions.get(event.type);

				for(listener of listeners) {

					listener.call(target, event);

				}

			}

			if(listenerObjects.has(event.type)) {

				listeners = listenerObjects.get(event.type);

				for(listener of listeners) {

					listener.handleEvent(event);

				}

			}

		}

	}

	/**
	 * A collection of event classes.
	 *
	 * @module synthetic-event
	 */

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */

	function ___$insertStyle(css) {
	  if (!css) {
	    return;
	  }
	  if (typeof window === 'undefined') {
	    return;
	  }

	  var style = document.createElement('style');

	  style.setAttribute('type', 'text/css');
	  style.innerHTML = css;
	  document.head.appendChild(style);

	  return css;
	}

	function colorToString (color, forceCSSHex) {
	  var colorFormat = color.__state.conversionName.toString();
	  var r = Math.round(color.r);
	  var g = Math.round(color.g);
	  var b = Math.round(color.b);
	  var a = color.a;
	  var h = Math.round(color.h);
	  var s = color.s.toFixed(1);
	  var v = color.v.toFixed(1);
	  if (forceCSSHex || colorFormat === 'THREE_CHAR_HEX' || colorFormat === 'SIX_CHAR_HEX') {
	    var str = color.hex.toString(16);
	    while (str.length < 6) {
	      str = '0' + str;
	    }
	    return '#' + str;
	  } else if (colorFormat === 'CSS_RGB') {
	    return 'rgb(' + r + ',' + g + ',' + b + ')';
	  } else if (colorFormat === 'CSS_RGBA') {
	    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
	  } else if (colorFormat === 'HEX') {
	    return '0x' + color.hex.toString(16);
	  } else if (colorFormat === 'RGB_ARRAY') {
	    return '[' + r + ',' + g + ',' + b + ']';
	  } else if (colorFormat === 'RGBA_ARRAY') {
	    return '[' + r + ',' + g + ',' + b + ',' + a + ']';
	  } else if (colorFormat === 'RGB_OBJ') {
	    return '{r:' + r + ',g:' + g + ',b:' + b + '}';
	  } else if (colorFormat === 'RGBA_OBJ') {
	    return '{r:' + r + ',g:' + g + ',b:' + b + ',a:' + a + '}';
	  } else if (colorFormat === 'HSV_OBJ') {
	    return '{h:' + h + ',s:' + s + ',v:' + v + '}';
	  } else if (colorFormat === 'HSVA_OBJ') {
	    return '{h:' + h + ',s:' + s + ',v:' + v + ',a:' + a + '}';
	  }
	  return 'unknown format';
	}

	var ARR_EACH = Array.prototype.forEach;
	var ARR_SLICE = Array.prototype.slice;
	var Common = {
	  BREAK: {},
	  extend: function extend(target) {
	    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
	      var keys = this.isObject(obj) ? Object.keys(obj) : [];
	      keys.forEach(function (key) {
	        if (!this.isUndefined(obj[key])) {
	          target[key] = obj[key];
	        }
	      }.bind(this));
	    }, this);
	    return target;
	  },
	  defaults: function defaults(target) {
	    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
	      var keys = this.isObject(obj) ? Object.keys(obj) : [];
	      keys.forEach(function (key) {
	        if (this.isUndefined(target[key])) {
	          target[key] = obj[key];
	        }
	      }.bind(this));
	    }, this);
	    return target;
	  },
	  compose: function compose() {
	    var toCall = ARR_SLICE.call(arguments);
	    return function () {
	      var args = ARR_SLICE.call(arguments);
	      for (var i = toCall.length - 1; i >= 0; i--) {
	        args = [toCall[i].apply(this, args)];
	      }
	      return args[0];
	    };
	  },
	  each: function each(obj, itr, scope) {
	    if (!obj) {
	      return;
	    }
	    if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {
	      obj.forEach(itr, scope);
	    } else if (obj.length === obj.length + 0) {
	      var key = void 0;
	      var l = void 0;
	      for (key = 0, l = obj.length; key < l; key++) {
	        if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
	          return;
	        }
	      }
	    } else {
	      for (var _key in obj) {
	        if (itr.call(scope, obj[_key], _key) === this.BREAK) {
	          return;
	        }
	      }
	    }
	  },
	  defer: function defer(fnc) {
	    setTimeout(fnc, 0);
	  },
	  debounce: function debounce(func, threshold, callImmediately) {
	    var timeout = void 0;
	    return function () {
	      var obj = this;
	      var args = arguments;
	      function delayed() {
	        timeout = null;
	        if (!callImmediately) func.apply(obj, args);
	      }
	      var callNow = callImmediately || !timeout;
	      clearTimeout(timeout);
	      timeout = setTimeout(delayed, threshold);
	      if (callNow) {
	        func.apply(obj, args);
	      }
	    };
	  },
	  toArray: function toArray(obj) {
	    if (obj.toArray) return obj.toArray();
	    return ARR_SLICE.call(obj);
	  },
	  isUndefined: function isUndefined(obj) {
	    return obj === undefined;
	  },
	  isNull: function isNull(obj) {
	    return obj === null;
	  },
	  isNaN: function (_isNaN) {
	    function isNaN(_x) {
	      return _isNaN.apply(this, arguments);
	    }
	    isNaN.toString = function () {
	      return _isNaN.toString();
	    };
	    return isNaN;
	  }(function (obj) {
	    return isNaN(obj);
	  }),
	  isArray: Array.isArray || function (obj) {
	    return obj.constructor === Array;
	  },
	  isObject: function isObject(obj) {
	    return obj === Object(obj);
	  },
	  isNumber: function isNumber(obj) {
	    return obj === obj + 0;
	  },
	  isString: function isString(obj) {
	    return obj === obj + '';
	  },
	  isBoolean: function isBoolean(obj) {
	    return obj === false || obj === true;
	  },
	  isFunction: function isFunction(obj) {
	    return Object.prototype.toString.call(obj) === '[object Function]';
	  }
	};

	var INTERPRETATIONS = [
	{
	  litmus: Common.isString,
	  conversions: {
	    THREE_CHAR_HEX: {
	      read: function read(original) {
	        var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
	        if (test === null) {
	          return false;
	        }
	        return {
	          space: 'HEX',
	          hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
	        };
	      },
	      write: colorToString
	    },
	    SIX_CHAR_HEX: {
	      read: function read(original) {
	        var test = original.match(/^#([A-F0-9]{6})$/i);
	        if (test === null) {
	          return false;
	        }
	        return {
	          space: 'HEX',
	          hex: parseInt('0x' + test[1].toString(), 0)
	        };
	      },
	      write: colorToString
	    },
	    CSS_RGB: {
	      read: function read(original) {
	        var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
	        if (test === null) {
	          return false;
	        }
	        return {
	          space: 'RGB',
	          r: parseFloat(test[1]),
	          g: parseFloat(test[2]),
	          b: parseFloat(test[3])
	        };
	      },
	      write: colorToString
	    },
	    CSS_RGBA: {
	      read: function read(original) {
	        var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
	        if (test === null) {
	          return false;
	        }
	        return {
	          space: 'RGB',
	          r: parseFloat(test[1]),
	          g: parseFloat(test[2]),
	          b: parseFloat(test[3]),
	          a: parseFloat(test[4])
	        };
	      },
	      write: colorToString
	    }
	  }
	},
	{
	  litmus: Common.isNumber,
	  conversions: {
	    HEX: {
	      read: function read(original) {
	        return {
	          space: 'HEX',
	          hex: original,
	          conversionName: 'HEX'
	        };
	      },
	      write: function write(color) {
	        return color.hex;
	      }
	    }
	  }
	},
	{
	  litmus: Common.isArray,
	  conversions: {
	    RGB_ARRAY: {
	      read: function read(original) {
	        if (original.length !== 3) {
	          return false;
	        }
	        return {
	          space: 'RGB',
	          r: original[0],
	          g: original[1],
	          b: original[2]
	        };
	      },
	      write: function write(color) {
	        return [color.r, color.g, color.b];
	      }
	    },
	    RGBA_ARRAY: {
	      read: function read(original) {
	        if (original.length !== 4) return false;
	        return {
	          space: 'RGB',
	          r: original[0],
	          g: original[1],
	          b: original[2],
	          a: original[3]
	        };
	      },
	      write: function write(color) {
	        return [color.r, color.g, color.b, color.a];
	      }
	    }
	  }
	},
	{
	  litmus: Common.isObject,
	  conversions: {
	    RGBA_OBJ: {
	      read: function read(original) {
	        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b) && Common.isNumber(original.a)) {
	          return {
	            space: 'RGB',
	            r: original.r,
	            g: original.g,
	            b: original.b,
	            a: original.a
	          };
	        }
	        return false;
	      },
	      write: function write(color) {
	        return {
	          r: color.r,
	          g: color.g,
	          b: color.b,
	          a: color.a
	        };
	      }
	    },
	    RGB_OBJ: {
	      read: function read(original) {
	        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b)) {
	          return {
	            space: 'RGB',
	            r: original.r,
	            g: original.g,
	            b: original.b
	          };
	        }
	        return false;
	      },
	      write: function write(color) {
	        return {
	          r: color.r,
	          g: color.g,
	          b: color.b
	        };
	      }
	    },
	    HSVA_OBJ: {
	      read: function read(original) {
	        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v) && Common.isNumber(original.a)) {
	          return {
	            space: 'HSV',
	            h: original.h,
	            s: original.s,
	            v: original.v,
	            a: original.a
	          };
	        }
	        return false;
	      },
	      write: function write(color) {
	        return {
	          h: color.h,
	          s: color.s,
	          v: color.v,
	          a: color.a
	        };
	      }
	    },
	    HSV_OBJ: {
	      read: function read(original) {
	        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v)) {
	          return {
	            space: 'HSV',
	            h: original.h,
	            s: original.s,
	            v: original.v
	          };
	        }
	        return false;
	      },
	      write: function write(color) {
	        return {
	          h: color.h,
	          s: color.s,
	          v: color.v
	        };
	      }
	    }
	  }
	}];
	var result = void 0;
	var toReturn = void 0;
	var interpret = function interpret() {
	  toReturn = false;
	  var original = arguments.length > 1 ? Common.toArray(arguments) : arguments[0];
	  Common.each(INTERPRETATIONS, function (family) {
	    if (family.litmus(original)) {
	      Common.each(family.conversions, function (conversion, conversionName) {
	        result = conversion.read(original);
	        if (toReturn === false && result !== false) {
	          toReturn = result;
	          result.conversionName = conversionName;
	          result.conversion = conversion;
	          return Common.BREAK;
	        }
	      });
	      return Common.BREAK;
	    }
	  });
	  return toReturn;
	};

	var tmpComponent = void 0;
	var ColorMath = {
	  hsv_to_rgb: function hsv_to_rgb(h, s, v) {
	    var hi = Math.floor(h / 60) % 6;
	    var f = h / 60 - Math.floor(h / 60);
	    var p = v * (1.0 - s);
	    var q = v * (1.0 - f * s);
	    var t = v * (1.0 - (1.0 - f) * s);
	    var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
	    return {
	      r: c[0] * 255,
	      g: c[1] * 255,
	      b: c[2] * 255
	    };
	  },
	  rgb_to_hsv: function rgb_to_hsv(r, g, b) {
	    var min = Math.min(r, g, b);
	    var max = Math.max(r, g, b);
	    var delta = max - min;
	    var h = void 0;
	    var s = void 0;
	    if (max !== 0) {
	      s = delta / max;
	    } else {
	      return {
	        h: NaN,
	        s: 0,
	        v: 0
	      };
	    }
	    if (r === max) {
	      h = (g - b) / delta;
	    } else if (g === max) {
	      h = 2 + (b - r) / delta;
	    } else {
	      h = 4 + (r - g) / delta;
	    }
	    h /= 6;
	    if (h < 0) {
	      h += 1;
	    }
	    return {
	      h: h * 360,
	      s: s,
	      v: max / 255
	    };
	  },
	  rgb_to_hex: function rgb_to_hex(r, g, b) {
	    var hex = this.hex_with_component(0, 2, r);
	    hex = this.hex_with_component(hex, 1, g);
	    hex = this.hex_with_component(hex, 0, b);
	    return hex;
	  },
	  component_from_hex: function component_from_hex(hex, componentIndex) {
	    return hex >> componentIndex * 8 & 0xFF;
	  },
	  hex_with_component: function hex_with_component(hex, componentIndex, value) {
	    return value << (tmpComponent = componentIndex * 8) | hex & ~(0xFF << tmpComponent);
	  }
	};

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};











	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	var createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();







	var get = function get(object, property, receiver) {
	  if (object === null) object = Function.prototype;
	  var desc = Object.getOwnPropertyDescriptor(object, property);

	  if (desc === undefined) {
	    var parent = Object.getPrototypeOf(object);

	    if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc) {
	    return desc.value;
	  } else {
	    var getter = desc.get;

	    if (getter === undefined) {
	      return undefined;
	    }

	    return getter.call(receiver);
	  }
	};

	var inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};











	var possibleConstructorReturn = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && (typeof call === "object" || typeof call === "function") ? call : self;
	};

	var Color = function () {
	  function Color() {
	    classCallCheck(this, Color);
	    this.__state = interpret.apply(this, arguments);
	    if (this.__state === false) {
	      throw new Error('Failed to interpret color arguments');
	    }
	    this.__state.a = this.__state.a || 1;
	  }
	  createClass(Color, [{
	    key: 'toString',
	    value: function toString() {
	      return colorToString(this);
	    }
	  }, {
	    key: 'toHexString',
	    value: function toHexString() {
	      return colorToString(this, true);
	    }
	  }, {
	    key: 'toOriginal',
	    value: function toOriginal() {
	      return this.__state.conversion.write(this);
	    }
	  }]);
	  return Color;
	}();
	function defineRGBComponent(target, component, componentHexIndex) {
	  Object.defineProperty(target, component, {
	    get: function get$$1() {
	      if (this.__state.space === 'RGB') {
	        return this.__state[component];
	      }
	      Color.recalculateRGB(this, component, componentHexIndex);
	      return this.__state[component];
	    },
	    set: function set$$1(v) {
	      if (this.__state.space !== 'RGB') {
	        Color.recalculateRGB(this, component, componentHexIndex);
	        this.__state.space = 'RGB';
	      }
	      this.__state[component] = v;
	    }
	  });
	}
	function defineHSVComponent(target, component) {
	  Object.defineProperty(target, component, {
	    get: function get$$1() {
	      if (this.__state.space === 'HSV') {
	        return this.__state[component];
	      }
	      Color.recalculateHSV(this);
	      return this.__state[component];
	    },
	    set: function set$$1(v) {
	      if (this.__state.space !== 'HSV') {
	        Color.recalculateHSV(this);
	        this.__state.space = 'HSV';
	      }
	      this.__state[component] = v;
	    }
	  });
	}
	Color.recalculateRGB = function (color, component, componentHexIndex) {
	  if (color.__state.space === 'HEX') {
	    color.__state[component] = ColorMath.component_from_hex(color.__state.hex, componentHexIndex);
	  } else if (color.__state.space === 'HSV') {
	    Common.extend(color.__state, ColorMath.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
	  } else {
	    throw new Error('Corrupted color state');
	  }
	};
	Color.recalculateHSV = function (color) {
	  var result = ColorMath.rgb_to_hsv(color.r, color.g, color.b);
	  Common.extend(color.__state, {
	    s: result.s,
	    v: result.v
	  });
	  if (!Common.isNaN(result.h)) {
	    color.__state.h = result.h;
	  } else if (Common.isUndefined(color.__state.h)) {
	    color.__state.h = 0;
	  }
	};
	Color.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
	defineRGBComponent(Color.prototype, 'r', 2);
	defineRGBComponent(Color.prototype, 'g', 1);
	defineRGBComponent(Color.prototype, 'b', 0);
	defineHSVComponent(Color.prototype, 'h');
	defineHSVComponent(Color.prototype, 's');
	defineHSVComponent(Color.prototype, 'v');
	Object.defineProperty(Color.prototype, 'a', {
	  get: function get$$1() {
	    return this.__state.a;
	  },
	  set: function set$$1(v) {
	    this.__state.a = v;
	  }
	});
	Object.defineProperty(Color.prototype, 'hex', {
	  get: function get$$1() {
	    if (!this.__state.space !== 'HEX') {
	      this.__state.hex = ColorMath.rgb_to_hex(this.r, this.g, this.b);
	    }
	    return this.__state.hex;
	  },
	  set: function set$$1(v) {
	    this.__state.space = 'HEX';
	    this.__state.hex = v;
	  }
	});

	var Controller = function () {
	  function Controller(object, property) {
	    classCallCheck(this, Controller);
	    this.initialValue = object[property];
	    this.domElement = document.createElement('div');
	    this.object = object;
	    this.property = property;
	    this.__onChange = undefined;
	    this.__onFinishChange = undefined;
	  }
	  createClass(Controller, [{
	    key: 'onChange',
	    value: function onChange(fnc) {
	      this.__onChange = fnc;
	      return this;
	    }
	  }, {
	    key: 'onFinishChange',
	    value: function onFinishChange(fnc) {
	      this.__onFinishChange = fnc;
	      return this;
	    }
	  }, {
	    key: 'setValue',
	    value: function setValue(newValue) {
	      this.object[this.property] = newValue;
	      if (this.__onChange) {
	        this.__onChange.call(this, newValue);
	      }
	      this.updateDisplay();
	      return this;
	    }
	  }, {
	    key: 'getValue',
	    value: function getValue() {
	      return this.object[this.property];
	    }
	  }, {
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      return this;
	    }
	  }, {
	    key: 'isModified',
	    value: function isModified() {
	      return this.initialValue !== this.getValue();
	    }
	  }]);
	  return Controller;
	}();

	var EVENT_MAP = {
	  HTMLEvents: ['change'],
	  MouseEvents: ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
	  KeyboardEvents: ['keydown']
	};
	var EVENT_MAP_INV = {};
	Common.each(EVENT_MAP, function (v, k) {
	  Common.each(v, function (e) {
	    EVENT_MAP_INV[e] = k;
	  });
	});
	var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;
	function cssValueToPixels(val) {
	  if (val === '0' || Common.isUndefined(val)) {
	    return 0;
	  }
	  var match = val.match(CSS_VALUE_PIXELS);
	  if (!Common.isNull(match)) {
	    return parseFloat(match[1]);
	  }
	  return 0;
	}
	var dom = {
	  makeSelectable: function makeSelectable(elem, selectable) {
	    if (elem === undefined || elem.style === undefined) return;
	    elem.onselectstart = selectable ? function () {
	      return false;
	    } : function () {};
	    elem.style.MozUserSelect = selectable ? 'auto' : 'none';
	    elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
	    elem.unselectable = selectable ? 'on' : 'off';
	  },
	  makeFullscreen: function makeFullscreen(elem, hor, vert) {
	    var vertical = vert;
	    var horizontal = hor;
	    if (Common.isUndefined(horizontal)) {
	      horizontal = true;
	    }
	    if (Common.isUndefined(vertical)) {
	      vertical = true;
	    }
	    elem.style.position = 'absolute';
	    if (horizontal) {
	      elem.style.left = 0;
	      elem.style.right = 0;
	    }
	    if (vertical) {
	      elem.style.top = 0;
	      elem.style.bottom = 0;
	    }
	  },
	  fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
	    var params = pars || {};
	    var className = EVENT_MAP_INV[eventType];
	    if (!className) {
	      throw new Error('Event type ' + eventType + ' not supported.');
	    }
	    var evt = document.createEvent(className);
	    switch (className) {
	      case 'MouseEvents':
	        {
	          var clientX = params.x || params.clientX || 0;
	          var clientY = params.y || params.clientY || 0;
	          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0,
	          0,
	          clientX,
	          clientY,
	          false, false, false, false, 0, null);
	          break;
	        }
	      case 'KeyboardEvents':
	        {
	          var init = evt.initKeyboardEvent || evt.initKeyEvent;
	          Common.defaults(params, {
	            cancelable: true,
	            ctrlKey: false,
	            altKey: false,
	            shiftKey: false,
	            metaKey: false,
	            keyCode: undefined,
	            charCode: undefined
	          });
	          init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
	          break;
	        }
	      default:
	        {
	          evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
	          break;
	        }
	    }
	    Common.defaults(evt, aux);
	    elem.dispatchEvent(evt);
	  },
	  bind: function bind(elem, event, func, newBool) {
	    var bool = newBool || false;
	    if (elem.addEventListener) {
	      elem.addEventListener(event, func, bool);
	    } else if (elem.attachEvent) {
	      elem.attachEvent('on' + event, func);
	    }
	    return dom;
	  },
	  unbind: function unbind(elem, event, func, newBool) {
	    var bool = newBool || false;
	    if (elem.removeEventListener) {
	      elem.removeEventListener(event, func, bool);
	    } else if (elem.detachEvent) {
	      elem.detachEvent('on' + event, func);
	    }
	    return dom;
	  },
	  addClass: function addClass(elem, className) {
	    if (elem.className === undefined) {
	      elem.className = className;
	    } else if (elem.className !== className) {
	      var classes = elem.className.split(/ +/);
	      if (classes.indexOf(className) === -1) {
	        classes.push(className);
	        elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
	      }
	    }
	    return dom;
	  },
	  removeClass: function removeClass(elem, className) {
	    if (className) {
	      if (elem.className === className) {
	        elem.removeAttribute('class');
	      } else {
	        var classes = elem.className.split(/ +/);
	        var index = classes.indexOf(className);
	        if (index !== -1) {
	          classes.splice(index, 1);
	          elem.className = classes.join(' ');
	        }
	      }
	    } else {
	      elem.className = undefined;
	    }
	    return dom;
	  },
	  hasClass: function hasClass(elem, className) {
	    return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
	  },
	  getWidth: function getWidth(elem) {
	    var style = getComputedStyle(elem);
	    return cssValueToPixels(style['border-left-width']) + cssValueToPixels(style['border-right-width']) + cssValueToPixels(style['padding-left']) + cssValueToPixels(style['padding-right']) + cssValueToPixels(style.width);
	  },
	  getHeight: function getHeight(elem) {
	    var style = getComputedStyle(elem);
	    return cssValueToPixels(style['border-top-width']) + cssValueToPixels(style['border-bottom-width']) + cssValueToPixels(style['padding-top']) + cssValueToPixels(style['padding-bottom']) + cssValueToPixels(style.height);
	  },
	  getOffset: function getOffset(el) {
	    var elem = el;
	    var offset = { left: 0, top: 0 };
	    if (elem.offsetParent) {
	      do {
	        offset.left += elem.offsetLeft;
	        offset.top += elem.offsetTop;
	        elem = elem.offsetParent;
	      } while (elem);
	    }
	    return offset;
	  },
	  isActive: function isActive(elem) {
	    return elem === document.activeElement && (elem.type || elem.href);
	  }
	};

	var BooleanController = function (_Controller) {
	  inherits(BooleanController, _Controller);
	  function BooleanController(object, property) {
	    classCallCheck(this, BooleanController);
	    var _this2 = possibleConstructorReturn(this, (BooleanController.__proto__ || Object.getPrototypeOf(BooleanController)).call(this, object, property));
	    var _this = _this2;
	    _this2.__prev = _this2.getValue();
	    _this2.__checkbox = document.createElement('input');
	    _this2.__checkbox.setAttribute('type', 'checkbox');
	    function onChange() {
	      _this.setValue(!_this.__prev);
	    }
	    dom.bind(_this2.__checkbox, 'change', onChange, false);
	    _this2.domElement.appendChild(_this2.__checkbox);
	    _this2.updateDisplay();
	    return _this2;
	  }
	  createClass(BooleanController, [{
	    key: 'setValue',
	    value: function setValue(v) {
	      var toReturn = get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);
	      if (this.__onFinishChange) {
	        this.__onFinishChange.call(this, this.getValue());
	      }
	      this.__prev = this.getValue();
	      return toReturn;
	    }
	  }, {
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      if (this.getValue() === true) {
	        this.__checkbox.setAttribute('checked', 'checked');
	        this.__checkbox.checked = true;
	        this.__prev = true;
	      } else {
	        this.__checkbox.checked = false;
	        this.__prev = false;
	      }
	      return get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
	    }
	  }]);
	  return BooleanController;
	}(Controller);

	var OptionController = function (_Controller) {
	  inherits(OptionController, _Controller);
	  function OptionController(object, property, opts) {
	    classCallCheck(this, OptionController);
	    var _this2 = possibleConstructorReturn(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));
	    var options = opts;
	    var _this = _this2;
	    _this2.__select = document.createElement('select');
	    if (Common.isArray(options)) {
	      var map = {};
	      Common.each(options, function (element) {
	        map[element] = element;
	      });
	      options = map;
	    }
	    Common.each(options, function (value, key) {
	      var opt = document.createElement('option');
	      opt.innerHTML = key;
	      opt.setAttribute('value', value);
	      _this.__select.appendChild(opt);
	    });
	    _this2.updateDisplay();
	    dom.bind(_this2.__select, 'change', function () {
	      var desiredValue = this.options[this.selectedIndex].value;
	      _this.setValue(desiredValue);
	    });
	    _this2.domElement.appendChild(_this2.__select);
	    return _this2;
	  }
	  createClass(OptionController, [{
	    key: 'setValue',
	    value: function setValue(v) {
	      var toReturn = get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);
	      if (this.__onFinishChange) {
	        this.__onFinishChange.call(this, this.getValue());
	      }
	      return toReturn;
	    }
	  }, {
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      if (dom.isActive(this.__select)) return this;
	      this.__select.value = this.getValue();
	      return get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
	    }
	  }]);
	  return OptionController;
	}(Controller);

	var StringController = function (_Controller) {
	  inherits(StringController, _Controller);
	  function StringController(object, property) {
	    classCallCheck(this, StringController);
	    var _this2 = possibleConstructorReturn(this, (StringController.__proto__ || Object.getPrototypeOf(StringController)).call(this, object, property));
	    var _this = _this2;
	    function onChange() {
	      _this.setValue(_this.__input.value);
	    }
	    function onBlur() {
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }
	    _this2.__input = document.createElement('input');
	    _this2.__input.setAttribute('type', 'text');
	    dom.bind(_this2.__input, 'keyup', onChange);
	    dom.bind(_this2.__input, 'change', onChange);
	    dom.bind(_this2.__input, 'blur', onBlur);
	    dom.bind(_this2.__input, 'keydown', function (e) {
	      if (e.keyCode === 13) {
	        this.blur();
	      }
	    });
	    _this2.updateDisplay();
	    _this2.domElement.appendChild(_this2.__input);
	    return _this2;
	  }
	  createClass(StringController, [{
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      if (!dom.isActive(this.__input)) {
	        this.__input.value = this.getValue();
	      }
	      return get(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
	    }
	  }]);
	  return StringController;
	}(Controller);

	function numDecimals(x) {
	  var _x = x.toString();
	  if (_x.indexOf('.') > -1) {
	    return _x.length - _x.indexOf('.') - 1;
	  }
	  return 0;
	}
	var NumberController = function (_Controller) {
	  inherits(NumberController, _Controller);
	  function NumberController(object, property, params) {
	    classCallCheck(this, NumberController);
	    var _this = possibleConstructorReturn(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));
	    var _params = params || {};
	    _this.__min = _params.min;
	    _this.__max = _params.max;
	    _this.__step = _params.step;
	    if (Common.isUndefined(_this.__step)) {
	      if (_this.initialValue === 0) {
	        _this.__impliedStep = 1;
	      } else {
	        _this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(_this.initialValue)) / Math.LN10)) / 10;
	      }
	    } else {
	      _this.__impliedStep = _this.__step;
	    }
	    _this.__precision = numDecimals(_this.__impliedStep);
	    return _this;
	  }
	  createClass(NumberController, [{
	    key: 'setValue',
	    value: function setValue(v) {
	      var _v = v;
	      if (this.__min !== undefined && _v < this.__min) {
	        _v = this.__min;
	      } else if (this.__max !== undefined && _v > this.__max) {
	        _v = this.__max;
	      }
	      if (this.__step !== undefined && _v % this.__step !== 0) {
	        _v = Math.round(_v / this.__step) * this.__step;
	      }
	      return get(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
	    }
	  }, {
	    key: 'min',
	    value: function min(minValue) {
	      this.__min = minValue;
	      return this;
	    }
	  }, {
	    key: 'max',
	    value: function max(maxValue) {
	      this.__max = maxValue;
	      return this;
	    }
	  }, {
	    key: 'step',
	    value: function step(stepValue) {
	      this.__step = stepValue;
	      this.__impliedStep = stepValue;
	      this.__precision = numDecimals(stepValue);
	      return this;
	    }
	  }]);
	  return NumberController;
	}(Controller);

	function roundToDecimal(value, decimals) {
	  var tenTo = Math.pow(10, decimals);
	  return Math.round(value * tenTo) / tenTo;
	}
	var NumberControllerBox = function (_NumberController) {
	  inherits(NumberControllerBox, _NumberController);
	  function NumberControllerBox(object, property, params) {
	    classCallCheck(this, NumberControllerBox);
	    var _this2 = possibleConstructorReturn(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));
	    _this2.__truncationSuspended = false;
	    var _this = _this2;
	    var prevY = void 0;
	    function onChange() {
	      var attempted = parseFloat(_this.__input.value);
	      if (!Common.isNaN(attempted)) {
	        _this.setValue(attempted);
	      }
	    }
	    function onFinish() {
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }
	    function onBlur() {
	      onFinish();
	    }
	    function onMouseDrag(e) {
	      var diff = prevY - e.clientY;
	      _this.setValue(_this.getValue() + diff * _this.__impliedStep);
	      prevY = e.clientY;
	    }
	    function onMouseUp() {
	      dom.unbind(window, 'mousemove', onMouseDrag);
	      dom.unbind(window, 'mouseup', onMouseUp);
	      onFinish();
	    }
	    function onMouseDown(e) {
	      dom.bind(window, 'mousemove', onMouseDrag);
	      dom.bind(window, 'mouseup', onMouseUp);
	      prevY = e.clientY;
	    }
	    _this2.__input = document.createElement('input');
	    _this2.__input.setAttribute('type', 'text');
	    dom.bind(_this2.__input, 'change', onChange);
	    dom.bind(_this2.__input, 'blur', onBlur);
	    dom.bind(_this2.__input, 'mousedown', onMouseDown);
	    dom.bind(_this2.__input, 'keydown', function (e) {
	      if (e.keyCode === 13) {
	        _this.__truncationSuspended = true;
	        this.blur();
	        _this.__truncationSuspended = false;
	        onFinish();
	      }
	    });
	    _this2.updateDisplay();
	    _this2.domElement.appendChild(_this2.__input);
	    return _this2;
	  }
	  createClass(NumberControllerBox, [{
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
	      return get(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
	    }
	  }]);
	  return NumberControllerBox;
	}(NumberController);

	function map(v, i1, i2, o1, o2) {
	  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
	}
	var NumberControllerSlider = function (_NumberController) {
	  inherits(NumberControllerSlider, _NumberController);
	  function NumberControllerSlider(object, property, min, max, step) {
	    classCallCheck(this, NumberControllerSlider);
	    var _this2 = possibleConstructorReturn(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, { min: min, max: max, step: step }));
	    var _this = _this2;
	    _this2.__background = document.createElement('div');
	    _this2.__foreground = document.createElement('div');
	    dom.bind(_this2.__background, 'mousedown', onMouseDown);
	    dom.bind(_this2.__background, 'touchstart', onTouchStart);
	    dom.addClass(_this2.__background, 'slider');
	    dom.addClass(_this2.__foreground, 'slider-fg');
	    function onMouseDown(e) {
	      document.activeElement.blur();
	      dom.bind(window, 'mousemove', onMouseDrag);
	      dom.bind(window, 'mouseup', onMouseUp);
	      onMouseDrag(e);
	    }
	    function onMouseDrag(e) {
	      e.preventDefault();
	      var bgRect = _this.__background.getBoundingClientRect();
	      _this.setValue(map(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
	      return false;
	    }
	    function onMouseUp() {
	      dom.unbind(window, 'mousemove', onMouseDrag);
	      dom.unbind(window, 'mouseup', onMouseUp);
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }
	    function onTouchStart(e) {
	      if (e.touches.length !== 1) {
	        return;
	      }
	      dom.bind(window, 'touchmove', onTouchMove);
	      dom.bind(window, 'touchend', onTouchEnd);
	      onTouchMove(e);
	    }
	    function onTouchMove(e) {
	      var clientX = e.touches[0].clientX;
	      var bgRect = _this.__background.getBoundingClientRect();
	      _this.setValue(map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
	    }
	    function onTouchEnd() {
	      dom.unbind(window, 'touchmove', onTouchMove);
	      dom.unbind(window, 'touchend', onTouchEnd);
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }
	    _this2.updateDisplay();
	    _this2.__background.appendChild(_this2.__foreground);
	    _this2.domElement.appendChild(_this2.__background);
	    return _this2;
	  }
	  createClass(NumberControllerSlider, [{
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);
	      this.__foreground.style.width = pct * 100 + '%';
	      return get(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
	    }
	  }]);
	  return NumberControllerSlider;
	}(NumberController);

	var FunctionController = function (_Controller) {
	  inherits(FunctionController, _Controller);
	  function FunctionController(object, property, text) {
	    classCallCheck(this, FunctionController);
	    var _this2 = possibleConstructorReturn(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));
	    var _this = _this2;
	    _this2.__button = document.createElement('div');
	    _this2.__button.innerHTML = text === undefined ? 'Fire' : text;
	    dom.bind(_this2.__button, 'click', function (e) {
	      e.preventDefault();
	      _this.fire();
	      return false;
	    });
	    dom.addClass(_this2.__button, 'button');
	    _this2.domElement.appendChild(_this2.__button);
	    return _this2;
	  }
	  createClass(FunctionController, [{
	    key: 'fire',
	    value: function fire() {
	      if (this.__onChange) {
	        this.__onChange.call(this);
	      }
	      this.getValue().call(this.object);
	      if (this.__onFinishChange) {
	        this.__onFinishChange.call(this, this.getValue());
	      }
	    }
	  }]);
	  return FunctionController;
	}(Controller);

	var ColorController = function (_Controller) {
	  inherits(ColorController, _Controller);
	  function ColorController(object, property) {
	    classCallCheck(this, ColorController);
	    var _this2 = possibleConstructorReturn(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));
	    _this2.__color = new Color(_this2.getValue());
	    _this2.__temp = new Color(0);
	    var _this = _this2;
	    _this2.domElement = document.createElement('div');
	    dom.makeSelectable(_this2.domElement, false);
	    _this2.__selector = document.createElement('div');
	    _this2.__selector.className = 'selector';
	    _this2.__saturation_field = document.createElement('div');
	    _this2.__saturation_field.className = 'saturation-field';
	    _this2.__field_knob = document.createElement('div');
	    _this2.__field_knob.className = 'field-knob';
	    _this2.__field_knob_border = '2px solid ';
	    _this2.__hue_knob = document.createElement('div');
	    _this2.__hue_knob.className = 'hue-knob';
	    _this2.__hue_field = document.createElement('div');
	    _this2.__hue_field.className = 'hue-field';
	    _this2.__input = document.createElement('input');
	    _this2.__input.type = 'text';
	    _this2.__input_textShadow = '0 1px 1px ';
	    dom.bind(_this2.__input, 'keydown', function (e) {
	      if (e.keyCode === 13) {
	        onBlur.call(this);
	      }
	    });
	    dom.bind(_this2.__input, 'blur', onBlur);
	    dom.bind(_this2.__selector, 'mousedown', function ()        {
	      dom.addClass(this, 'drag').bind(window, 'mouseup', function ()        {
	        dom.removeClass(_this.__selector, 'drag');
	      });
	    });
	    dom.bind(_this2.__selector, 'touchstart', function ()        {
	      dom.addClass(this, 'drag').bind(window, 'touchend', function ()        {
	        dom.removeClass(_this.__selector, 'drag');
	      });
	    });
	    var valueField = document.createElement('div');
	    Common.extend(_this2.__selector.style, {
	      width: '122px',
	      height: '102px',
	      padding: '3px',
	      backgroundColor: '#222',
	      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
	    });
	    Common.extend(_this2.__field_knob.style, {
	      position: 'absolute',
	      width: '12px',
	      height: '12px',
	      border: _this2.__field_knob_border + (_this2.__color.v < 0.5 ? '#fff' : '#000'),
	      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
	      borderRadius: '12px',
	      zIndex: 1
	    });
	    Common.extend(_this2.__hue_knob.style, {
	      position: 'absolute',
	      width: '15px',
	      height: '2px',
	      borderRight: '4px solid #fff',
	      zIndex: 1
	    });
	    Common.extend(_this2.__saturation_field.style, {
	      width: '100px',
	      height: '100px',
	      border: '1px solid #555',
	      marginRight: '3px',
	      display: 'inline-block',
	      cursor: 'pointer'
	    });
	    Common.extend(valueField.style, {
	      width: '100%',
	      height: '100%',
	      background: 'none'
	    });
	    linearGradient(valueField, 'top', 'rgba(0,0,0,0)', '#000');
	    Common.extend(_this2.__hue_field.style, {
	      width: '15px',
	      height: '100px',
	      border: '1px solid #555',
	      cursor: 'ns-resize',
	      position: 'absolute',
	      top: '3px',
	      right: '3px'
	    });
	    hueGradient(_this2.__hue_field);
	    Common.extend(_this2.__input.style, {
	      outline: 'none',
	      textAlign: 'center',
	      color: '#fff',
	      border: 0,
	      fontWeight: 'bold',
	      textShadow: _this2.__input_textShadow + 'rgba(0,0,0,0.7)'
	    });
	    dom.bind(_this2.__saturation_field, 'mousedown', fieldDown);
	    dom.bind(_this2.__saturation_field, 'touchstart', fieldDown);
	    dom.bind(_this2.__field_knob, 'mousedown', fieldDown);
	    dom.bind(_this2.__field_knob, 'touchstart', fieldDown);
	    dom.bind(_this2.__hue_field, 'mousedown', fieldDownH);
	    dom.bind(_this2.__hue_field, 'touchstart', fieldDownH);
	    function fieldDown(e) {
	      setSV(e);
	      dom.bind(window, 'mousemove', setSV);
	      dom.bind(window, 'touchmove', setSV);
	      dom.bind(window, 'mouseup', fieldUpSV);
	      dom.bind(window, 'touchend', fieldUpSV);
	    }
	    function fieldDownH(e) {
	      setH(e);
	      dom.bind(window, 'mousemove', setH);
	      dom.bind(window, 'touchmove', setH);
	      dom.bind(window, 'mouseup', fieldUpH);
	      dom.bind(window, 'touchend', fieldUpH);
	    }
	    function fieldUpSV() {
	      dom.unbind(window, 'mousemove', setSV);
	      dom.unbind(window, 'touchmove', setSV);
	      dom.unbind(window, 'mouseup', fieldUpSV);
	      dom.unbind(window, 'touchend', fieldUpSV);
	      onFinish();
	    }
	    function fieldUpH() {
	      dom.unbind(window, 'mousemove', setH);
	      dom.unbind(window, 'touchmove', setH);
	      dom.unbind(window, 'mouseup', fieldUpH);
	      dom.unbind(window, 'touchend', fieldUpH);
	      onFinish();
	    }
	    function onBlur() {
	      var i = interpret(this.value);
	      if (i !== false) {
	        _this.__color.__state = i;
	        _this.setValue(_this.__color.toOriginal());
	      } else {
	        this.value = _this.__color.toString();
	      }
	    }
	    function onFinish() {
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.__color.toOriginal());
	      }
	    }
	    _this2.__saturation_field.appendChild(valueField);
	    _this2.__selector.appendChild(_this2.__field_knob);
	    _this2.__selector.appendChild(_this2.__saturation_field);
	    _this2.__selector.appendChild(_this2.__hue_field);
	    _this2.__hue_field.appendChild(_this2.__hue_knob);
	    _this2.domElement.appendChild(_this2.__input);
	    _this2.domElement.appendChild(_this2.__selector);
	    _this2.updateDisplay();
	    function setSV(e) {
	      if (e.type.indexOf('touch') === -1) {
	        e.preventDefault();
	      }
	      var fieldRect = _this.__saturation_field.getBoundingClientRect();
	      var _ref = e.touches && e.touches[0] || e,
	          clientX = _ref.clientX,
	          clientY = _ref.clientY;
	      var s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
	      var v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
	      if (v > 1) {
	        v = 1;
	      } else if (v < 0) {
	        v = 0;
	      }
	      if (s > 1) {
	        s = 1;
	      } else if (s < 0) {
	        s = 0;
	      }
	      _this.__color.v = v;
	      _this.__color.s = s;
	      _this.setValue(_this.__color.toOriginal());
	      return false;
	    }
	    function setH(e) {
	      if (e.type.indexOf('touch') === -1) {
	        e.preventDefault();
	      }
	      var fieldRect = _this.__hue_field.getBoundingClientRect();
	      var _ref2 = e.touches && e.touches[0] || e,
	          clientY = _ref2.clientY;
	      var h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
	      if (h > 1) {
	        h = 1;
	      } else if (h < 0) {
	        h = 0;
	      }
	      _this.__color.h = h * 360;
	      _this.setValue(_this.__color.toOriginal());
	      return false;
	    }
	    return _this2;
	  }
	  createClass(ColorController, [{
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      var i = interpret(this.getValue());
	      if (i !== false) {
	        var mismatch = false;
	        Common.each(Color.COMPONENTS, function (component) {
	          if (!Common.isUndefined(i[component]) && !Common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
	            mismatch = true;
	            return {};
	          }
	        }, this);
	        if (mismatch) {
	          Common.extend(this.__color.__state, i);
	        }
	      }
	      Common.extend(this.__temp.__state, this.__color.__state);
	      this.__temp.a = 1;
	      var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;
	      var _flip = 255 - flip;
	      Common.extend(this.__field_knob.style, {
	        marginLeft: 100 * this.__color.s - 7 + 'px',
	        marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
	        backgroundColor: this.__temp.toHexString(),
	        border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
	      });
	      this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
	      this.__temp.s = 1;
	      this.__temp.v = 1;
	      linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toHexString());
	      this.__input.value = this.__color.toString();
	      Common.extend(this.__input.style, {
	        backgroundColor: this.__color.toHexString(),
	        color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
	        textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
	      });
	    }
	  }]);
	  return ColorController;
	}(Controller);
	var vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];
	function linearGradient(elem, x, a, b) {
	  elem.style.background = '';
	  Common.each(vendors, function (vendor) {
	    elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
	  });
	}
	function hueGradient(elem) {
	  elem.style.background = '';
	  elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
	  elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	  elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	  elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	  elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	}

	var css = {
	  load: function load(url, indoc) {
	    var doc = indoc || document;
	    var link = doc.createElement('link');
	    link.type = 'text/css';
	    link.rel = 'stylesheet';
	    link.href = url;
	    doc.getElementsByTagName('head')[0].appendChild(link);
	  },
	  inject: function inject(cssContent, indoc) {
	    var doc = indoc || document;
	    var injected = document.createElement('style');
	    injected.type = 'text/css';
	    injected.innerHTML = cssContent;
	    var head = doc.getElementsByTagName('head')[0];
	    try {
	      head.appendChild(injected);
	    } catch (e) {
	    }
	  }
	};

	var saveDialogContents = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";

	var ControllerFactory = function ControllerFactory(object, property) {
	  var initialValue = object[property];
	  if (Common.isArray(arguments[2]) || Common.isObject(arguments[2])) {
	    return new OptionController(object, property, arguments[2]);
	  }
	  if (Common.isNumber(initialValue)) {
	    if (Common.isNumber(arguments[2]) && Common.isNumber(arguments[3])) {
	      if (Common.isNumber(arguments[4])) {
	        return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4]);
	      }
	      return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
	    }
	    if (Common.isNumber(arguments[4])) {
	      return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3], step: arguments[4] });
	    }
	    return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });
	  }
	  if (Common.isString(initialValue)) {
	    return new StringController(object, property);
	  }
	  if (Common.isFunction(initialValue)) {
	    return new FunctionController(object, property, '');
	  }
	  if (Common.isBoolean(initialValue)) {
	    return new BooleanController(object, property);
	  }
	  return null;
	};

	function requestAnimationFrame$1(callback) {
	  setTimeout(callback, 1000 / 60);
	}
	var requestAnimationFrame$1$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame$1;

	var CenteredDiv = function () {
	  function CenteredDiv() {
	    classCallCheck(this, CenteredDiv);
	    this.backgroundElement = document.createElement('div');
	    Common.extend(this.backgroundElement.style, {
	      backgroundColor: 'rgba(0,0,0,0.8)',
	      top: 0,
	      left: 0,
	      display: 'none',
	      zIndex: '1000',
	      opacity: 0,
	      WebkitTransition: 'opacity 0.2s linear',
	      transition: 'opacity 0.2s linear'
	    });
	    dom.makeFullscreen(this.backgroundElement);
	    this.backgroundElement.style.position = 'fixed';
	    this.domElement = document.createElement('div');
	    Common.extend(this.domElement.style, {
	      position: 'fixed',
	      display: 'none',
	      zIndex: '1001',
	      opacity: 0,
	      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
	      transition: 'transform 0.2s ease-out, opacity 0.2s linear'
	    });
	    document.body.appendChild(this.backgroundElement);
	    document.body.appendChild(this.domElement);
	    var _this = this;
	    dom.bind(this.backgroundElement, 'click', function () {
	      _this.hide();
	    });
	  }
	  createClass(CenteredDiv, [{
	    key: 'show',
	    value: function show() {
	      var _this = this;
	      this.backgroundElement.style.display = 'block';
	      this.domElement.style.display = 'block';
	      this.domElement.style.opacity = 0;
	      this.domElement.style.webkitTransform = 'scale(1.1)';
	      this.layout();
	      Common.defer(function () {
	        _this.backgroundElement.style.opacity = 1;
	        _this.domElement.style.opacity = 1;
	        _this.domElement.style.webkitTransform = 'scale(1)';
	      });
	    }
	  }, {
	    key: 'hide',
	    value: function hide() {
	      var _this = this;
	      var hide = function hide() {
	        _this.domElement.style.display = 'none';
	        _this.backgroundElement.style.display = 'none';
	        dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
	        dom.unbind(_this.domElement, 'transitionend', hide);
	        dom.unbind(_this.domElement, 'oTransitionEnd', hide);
	      };
	      dom.bind(this.domElement, 'webkitTransitionEnd', hide);
	      dom.bind(this.domElement, 'transitionend', hide);
	      dom.bind(this.domElement, 'oTransitionEnd', hide);
	      this.backgroundElement.style.opacity = 0;
	      this.domElement.style.opacity = 0;
	      this.domElement.style.webkitTransform = 'scale(1.1)';
	    }
	  }, {
	    key: 'layout',
	    value: function layout() {
	      this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + 'px';
	      this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + 'px';
	    }
	  }]);
	  return CenteredDiv;
	}();

	var styleSheet = ___$insertStyle(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");

	css.inject(styleSheet);
	var CSS_NAMESPACE = 'dg';
	var HIDE_KEY_CODE = 72;
	var CLOSE_BUTTON_HEIGHT = 20;
	var DEFAULT_DEFAULT_PRESET_NAME = 'Default';
	var SUPPORTS_LOCAL_STORAGE = function () {
	  try {
	    return !!window.localStorage;
	  } catch (e) {
	    return false;
	  }
	}();
	var SAVE_DIALOGUE = void 0;
	var autoPlaceVirgin = true;
	var autoPlaceContainer = void 0;
	var hide = false;
	var hideableGuis = [];
	var GUI = function GUI(pars) {
	  var _this = this;
	  var params = pars || {};
	  this.domElement = document.createElement('div');
	  this.__ul = document.createElement('ul');
	  this.domElement.appendChild(this.__ul);
	  dom.addClass(this.domElement, CSS_NAMESPACE);
	  this.__folders = {};
	  this.__controllers = [];
	  this.__rememberedObjects = [];
	  this.__rememberedObjectIndecesToControllers = [];
	  this.__listening = [];
	  params = Common.defaults(params, {
	    closeOnTop: false,
	    autoPlace: true,
	    width: GUI.DEFAULT_WIDTH
	  });
	  params = Common.defaults(params, {
	    resizable: params.autoPlace,
	    hideable: params.autoPlace
	  });
	  if (!Common.isUndefined(params.load)) {
	    if (params.preset) {
	      params.load.preset = params.preset;
	    }
	  } else {
	    params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };
	  }
	  if (Common.isUndefined(params.parent) && params.hideable) {
	    hideableGuis.push(this);
	  }
	  params.resizable = Common.isUndefined(params.parent) && params.resizable;
	  if (params.autoPlace && Common.isUndefined(params.scrollable)) {
	    params.scrollable = true;
	  }
	  var useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
	  var saveToLocalStorage = void 0;
	  var titleRow = void 0;
	  Object.defineProperties(this,
	  {
	    parent: {
	      get: function get$$1() {
	        return params.parent;
	      }
	    },
	    scrollable: {
	      get: function get$$1() {
	        return params.scrollable;
	      }
	    },
	    autoPlace: {
	      get: function get$$1() {
	        return params.autoPlace;
	      }
	    },
	    closeOnTop: {
	      get: function get$$1() {
	        return params.closeOnTop;
	      }
	    },
	    preset: {
	      get: function get$$1() {
	        if (_this.parent) {
	          return _this.getRoot().preset;
	        }
	        return params.load.preset;
	      },
	      set: function set$$1(v) {
	        if (_this.parent) {
	          _this.getRoot().preset = v;
	        } else {
	          params.load.preset = v;
	        }
	        setPresetSelectIndex(this);
	        _this.revert();
	      }
	    },
	    width: {
	      get: function get$$1() {
	        return params.width;
	      },
	      set: function set$$1(v) {
	        params.width = v;
	        setWidth(_this, v);
	      }
	    },
	    name: {
	      get: function get$$1() {
	        return params.name;
	      },
	      set: function set$$1(v) {
	        params.name = v;
	        if (titleRow) {
	          titleRow.innerHTML = params.name;
	        }
	      }
	    },
	    closed: {
	      get: function get$$1() {
	        return params.closed;
	      },
	      set: function set$$1(v) {
	        params.closed = v;
	        if (params.closed) {
	          dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
	        } else {
	          dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
	        }
	        this.onResize();
	        if (_this.__closeButton) {
	          _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
	        }
	      }
	    },
	    load: {
	      get: function get$$1() {
	        return params.load;
	      }
	    },
	    useLocalStorage: {
	      get: function get$$1() {
	        return useLocalStorage;
	      },
	      set: function set$$1(bool) {
	        if (SUPPORTS_LOCAL_STORAGE) {
	          useLocalStorage = bool;
	          if (bool) {
	            dom.bind(window, 'unload', saveToLocalStorage);
	          } else {
	            dom.unbind(window, 'unload', saveToLocalStorage);
	          }
	          localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
	        }
	      }
	    }
	  });
	  if (Common.isUndefined(params.parent)) {
	    this.closed = params.closed || false;
	    dom.addClass(this.domElement, GUI.CLASS_MAIN);
	    dom.makeSelectable(this.domElement, false);
	    if (SUPPORTS_LOCAL_STORAGE) {
	      if (useLocalStorage) {
	        _this.useLocalStorage = true;
	        var savedGui = localStorage.getItem(getLocalStorageHash(this, 'gui'));
	        if (savedGui) {
	          params.load = JSON.parse(savedGui);
	        }
	      }
	    }
	    this.__closeButton = document.createElement('div');
	    this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
	    dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
	    if (params.closeOnTop) {
	      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
	      this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
	    } else {
	      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
	      this.domElement.appendChild(this.__closeButton);
	    }
	    dom.bind(this.__closeButton, 'click', function () {
	      _this.closed = !_this.closed;
	    });
	  } else {
	    if (params.closed === undefined) {
	      params.closed = true;
	    }
	    var titleRowName = document.createTextNode(params.name);
	    dom.addClass(titleRowName, 'controller-name');
	    titleRow = addRow(_this, titleRowName);
	    var onClickTitle = function onClickTitle(e) {
	      e.preventDefault();
	      _this.closed = !_this.closed;
	      return false;
	    };
	    dom.addClass(this.__ul, GUI.CLASS_CLOSED);
	    dom.addClass(titleRow, 'title');
	    dom.bind(titleRow, 'click', onClickTitle);
	    if (!params.closed) {
	      this.closed = false;
	    }
	  }
	  if (params.autoPlace) {
	    if (Common.isUndefined(params.parent)) {
	      if (autoPlaceVirgin) {
	        autoPlaceContainer = document.createElement('div');
	        dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
	        dom.addClass(autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER);
	        document.body.appendChild(autoPlaceContainer);
	        autoPlaceVirgin = false;
	      }
	      autoPlaceContainer.appendChild(this.domElement);
	      dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
	    }
	    if (!this.parent) {
	      setWidth(_this, params.width);
	    }
	  }
	  this.__resizeHandler = function () {
	    _this.onResizeDebounced();
	  };
	  dom.bind(window, 'resize', this.__resizeHandler);
	  dom.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
	  dom.bind(this.__ul, 'transitionend', this.__resizeHandler);
	  dom.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
	  this.onResize();
	  if (params.resizable) {
	    addResizeHandle(this);
	  }
	  saveToLocalStorage = function saveToLocalStorage() {
	    if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, 'isLocal')) === 'true') {
	      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
	    }
	  };
	  this.saveToLocalStorageIfPossible = saveToLocalStorage;
	  function resetWidth() {
	    var root = _this.getRoot();
	    root.width += 1;
	    Common.defer(function () {
	      root.width -= 1;
	    });
	  }
	  if (!params.parent) {
	    resetWidth();
	  }
	};
	GUI.toggleHide = function () {
	  hide = !hide;
	  Common.each(hideableGuis, function (gui) {
	    gui.domElement.style.display = hide ? 'none' : '';
	  });
	};
	GUI.CLASS_AUTO_PLACE = 'a';
	GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
	GUI.CLASS_MAIN = 'main';
	GUI.CLASS_CONTROLLER_ROW = 'cr';
	GUI.CLASS_TOO_TALL = 'taller-than-window';
	GUI.CLASS_CLOSED = 'closed';
	GUI.CLASS_CLOSE_BUTTON = 'close-button';
	GUI.CLASS_CLOSE_TOP = 'close-top';
	GUI.CLASS_CLOSE_BOTTOM = 'close-bottom';
	GUI.CLASS_DRAG = 'drag';
	GUI.DEFAULT_WIDTH = 245;
	GUI.TEXT_CLOSED = 'Close Controls';
	GUI.TEXT_OPEN = 'Open Controls';
	GUI._keydownHandler = function (e) {
	  if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
	    GUI.toggleHide();
	  }
	};
	dom.bind(window, 'keydown', GUI._keydownHandler, false);
	Common.extend(GUI.prototype,
	{
	  add: function add(object, property) {
	    return _add(this, object, property, {
	      factoryArgs: Array.prototype.slice.call(arguments, 2)
	    });
	  },
	  addColor: function addColor(object, property) {
	    return _add(this, object, property, {
	      color: true
	    });
	  },
	  remove: function remove(controller) {
	    this.__ul.removeChild(controller.__li);
	    this.__controllers.splice(this.__controllers.indexOf(controller), 1);
	    var _this = this;
	    Common.defer(function () {
	      _this.onResize();
	    });
	  },
	  destroy: function destroy() {
	    if (this.parent) {
	      throw new Error('Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.');
	    }
	    if (this.autoPlace) {
	      autoPlaceContainer.removeChild(this.domElement);
	    }
	    var _this = this;
	    Common.each(this.__folders, function (subfolder) {
	      _this.removeFolder(subfolder);
	    });
	    dom.unbind(window, 'keydown', GUI._keydownHandler, false);
	    removeListeners(this);
	  },
	  addFolder: function addFolder(name) {
	    if (this.__folders[name] !== undefined) {
	      throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
	    }
	    var newGuiParams = { name: name, parent: this };
	    newGuiParams.autoPlace = this.autoPlace;
	    if (this.load &&
	    this.load.folders &&
	    this.load.folders[name]) {
	      newGuiParams.closed = this.load.folders[name].closed;
	      newGuiParams.load = this.load.folders[name];
	    }
	    var gui = new GUI(newGuiParams);
	    this.__folders[name] = gui;
	    var li = addRow(this, gui.domElement);
	    dom.addClass(li, 'folder');
	    return gui;
	  },
	  removeFolder: function removeFolder(folder) {
	    this.__ul.removeChild(folder.domElement.parentElement);
	    delete this.__folders[folder.name];
	    if (this.load &&
	    this.load.folders &&
	    this.load.folders[folder.name]) {
	      delete this.load.folders[folder.name];
	    }
	    removeListeners(folder);
	    var _this = this;
	    Common.each(folder.__folders, function (subfolder) {
	      folder.removeFolder(subfolder);
	    });
	    Common.defer(function () {
	      _this.onResize();
	    });
	  },
	  open: function open() {
	    this.closed = false;
	  },
	  close: function close() {
	    this.closed = true;
	  },
	  onResize: function onResize() {
	    var root = this.getRoot();
	    if (root.scrollable) {
	      var top = dom.getOffset(root.__ul).top;
	      var h = 0;
	      Common.each(root.__ul.childNodes, function (node) {
	        if (!(root.autoPlace && node === root.__save_row)) {
	          h += dom.getHeight(node);
	        }
	      });
	      if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
	        dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
	        root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
	      } else {
	        dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
	        root.__ul.style.height = 'auto';
	      }
	    }
	    if (root.__resize_handle) {
	      Common.defer(function () {
	        root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
	      });
	    }
	    if (root.__closeButton) {
	      root.__closeButton.style.width = root.width + 'px';
	    }
	  },
	  onResizeDebounced: Common.debounce(function () {
	    this.onResize();
	  }, 50),
	  remember: function remember() {
	    if (Common.isUndefined(SAVE_DIALOGUE)) {
	      SAVE_DIALOGUE = new CenteredDiv();
	      SAVE_DIALOGUE.domElement.innerHTML = saveDialogContents;
	    }
	    if (this.parent) {
	      throw new Error('You can only call remember on a top level GUI.');
	    }
	    var _this = this;
	    Common.each(Array.prototype.slice.call(arguments), function (object) {
	      if (_this.__rememberedObjects.length === 0) {
	        addSaveMenu(_this);
	      }
	      if (_this.__rememberedObjects.indexOf(object) === -1) {
	        _this.__rememberedObjects.push(object);
	      }
	    });
	    if (this.autoPlace) {
	      setWidth(this, this.width);
	    }
	  },
	  getRoot: function getRoot() {
	    var gui = this;
	    while (gui.parent) {
	      gui = gui.parent;
	    }
	    return gui;
	  },
	  getSaveObject: function getSaveObject() {
	    var toReturn = this.load;
	    toReturn.closed = this.closed;
	    if (this.__rememberedObjects.length > 0) {
	      toReturn.preset = this.preset;
	      if (!toReturn.remembered) {
	        toReturn.remembered = {};
	      }
	      toReturn.remembered[this.preset] = getCurrentPreset(this);
	    }
	    toReturn.folders = {};
	    Common.each(this.__folders, function (element, key) {
	      toReturn.folders[key] = element.getSaveObject();
	    });
	    return toReturn;
	  },
	  save: function save() {
	    if (!this.load.remembered) {
	      this.load.remembered = {};
	    }
	    this.load.remembered[this.preset] = getCurrentPreset(this);
	    markPresetModified(this, false);
	    this.saveToLocalStorageIfPossible();
	  },
	  saveAs: function saveAs(presetName) {
	    if (!this.load.remembered) {
	      this.load.remembered = {};
	      this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
	    }
	    this.load.remembered[presetName] = getCurrentPreset(this);
	    this.preset = presetName;
	    addPresetOption(this, presetName, true);
	    this.saveToLocalStorageIfPossible();
	  },
	  revert: function revert(gui) {
	    Common.each(this.__controllers, function (controller) {
	      if (!this.getRoot().load.remembered) {
	        controller.setValue(controller.initialValue);
	      } else {
	        recallSavedValue(gui || this.getRoot(), controller);
	      }
	      if (controller.__onFinishChange) {
	        controller.__onFinishChange.call(controller, controller.getValue());
	      }
	    }, this);
	    Common.each(this.__folders, function (folder) {
	      folder.revert(folder);
	    });
	    if (!gui) {
	      markPresetModified(this.getRoot(), false);
	    }
	  },
	  listen: function listen(controller) {
	    var init = this.__listening.length === 0;
	    this.__listening.push(controller);
	    if (init) {
	      updateDisplays(this.__listening);
	    }
	  },
	  updateDisplay: function updateDisplay() {
	    Common.each(this.__controllers, function (controller) {
	      controller.updateDisplay();
	    });
	    Common.each(this.__folders, function (folder) {
	      folder.updateDisplay();
	    });
	  }
	});
	function addRow(gui, newDom, liBefore) {
	  var li = document.createElement('li');
	  if (newDom) {
	    li.appendChild(newDom);
	  }
	  if (liBefore) {
	    gui.__ul.insertBefore(li, liBefore);
	  } else {
	    gui.__ul.appendChild(li);
	  }
	  gui.onResize();
	  return li;
	}
	function removeListeners(gui) {
	  dom.unbind(window, 'resize', gui.__resizeHandler);
	  if (gui.saveToLocalStorageIfPossible) {
	    dom.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
	  }
	}
	function markPresetModified(gui, modified) {
	  var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
	  if (modified) {
	    opt.innerHTML = opt.value + '*';
	  } else {
	    opt.innerHTML = opt.value;
	  }
	}
	function augmentController(gui, li, controller) {
	  controller.__li = li;
	  controller.__gui = gui;
	  Common.extend(controller,                                   {
	    options: function options(_options) {
	      if (arguments.length > 1) {
	        var nextSibling = controller.__li.nextElementSibling;
	        controller.remove();
	        return _add(gui, controller.object, controller.property, {
	          before: nextSibling,
	          factoryArgs: [Common.toArray(arguments)]
	        });
	      }
	      if (Common.isArray(_options) || Common.isObject(_options)) {
	        var _nextSibling = controller.__li.nextElementSibling;
	        controller.remove();
	        return _add(gui, controller.object, controller.property, {
	          before: _nextSibling,
	          factoryArgs: [_options]
	        });
	      }
	    },
	    name: function name(_name) {
	      controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
	      return controller;
	    },
	    listen: function listen() {
	      controller.__gui.listen(controller);
	      return controller;
	    },
	    remove: function remove() {
	      controller.__gui.remove(controller);
	      return controller;
	    }
	  });
	  if (controller instanceof NumberControllerSlider) {
	    var box = new NumberControllerBox(controller.object, controller.property, { min: controller.__min, max: controller.__max, step: controller.__step });
	    Common.each(['updateDisplay', 'onChange', 'onFinishChange', 'step', 'min', 'max'], function (method) {
	      var pc = controller[method];
	      var pb = box[method];
	      controller[method] = box[method] = function () {
	        var args = Array.prototype.slice.call(arguments);
	        pb.apply(box, args);
	        return pc.apply(controller, args);
	      };
	    });
	    dom.addClass(li, 'has-slider');
	    controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
	  } else if (controller instanceof NumberControllerBox) {
	    var r = function r(returned) {
	      if (Common.isNumber(controller.__min) && Common.isNumber(controller.__max)) {
	        var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
	        var wasListening = controller.__gui.__listening.indexOf(controller) > -1;
	        controller.remove();
	        var newController = _add(gui, controller.object, controller.property, {
	          before: controller.__li.nextElementSibling,
	          factoryArgs: [controller.__min, controller.__max, controller.__step]
	        });
	        newController.name(oldName);
	        if (wasListening) newController.listen();
	        return newController;
	      }
	      return returned;
	    };
	    controller.min = Common.compose(r, controller.min);
	    controller.max = Common.compose(r, controller.max);
	  } else if (controller instanceof BooleanController) {
	    dom.bind(li, 'click', function () {
	      dom.fakeEvent(controller.__checkbox, 'click');
	    });
	    dom.bind(controller.__checkbox, 'click', function (e) {
	      e.stopPropagation();
	    });
	  } else if (controller instanceof FunctionController) {
	    dom.bind(li, 'click', function () {
	      dom.fakeEvent(controller.__button, 'click');
	    });
	    dom.bind(li, 'mouseover', function () {
	      dom.addClass(controller.__button, 'hover');
	    });
	    dom.bind(li, 'mouseout', function () {
	      dom.removeClass(controller.__button, 'hover');
	    });
	  } else if (controller instanceof ColorController) {
	    dom.addClass(li, 'color');
	    controller.updateDisplay = Common.compose(function (val) {
	      li.style.borderLeftColor = controller.__color.toString();
	      return val;
	    }, controller.updateDisplay);
	    controller.updateDisplay();
	  }
	  controller.setValue = Common.compose(function (val) {
	    if (gui.getRoot().__preset_select && controller.isModified()) {
	      markPresetModified(gui.getRoot(), true);
	    }
	    return val;
	  }, controller.setValue);
	}
	function recallSavedValue(gui, controller) {
	  var root = gui.getRoot();
	  var matchedIndex = root.__rememberedObjects.indexOf(controller.object);
	  if (matchedIndex !== -1) {
	    var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];
	    if (controllerMap === undefined) {
	      controllerMap = {};
	      root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
	    }
	    controllerMap[controller.property] = controller;
	    if (root.load && root.load.remembered) {
	      var presetMap = root.load.remembered;
	      var preset = void 0;
	      if (presetMap[gui.preset]) {
	        preset = presetMap[gui.preset];
	      } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
	        preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
	      } else {
	        return;
	      }
	      if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
	        var value = preset[matchedIndex][controller.property];
	        controller.initialValue = value;
	        controller.setValue(value);
	      }
	    }
	  }
	}
	function _add(gui, object, property, params) {
	  if (object[property] === undefined) {
	    throw new Error('Object "' + object + '" has no property "' + property + '"');
	  }
	  var controller = void 0;
	  if (params.color) {
	    controller = new ColorController(object, property);
	  } else {
	    var factoryArgs = [object, property].concat(params.factoryArgs);
	    controller = ControllerFactory.apply(gui, factoryArgs);
	  }
	  if (params.before instanceof Controller) {
	    params.before = params.before.__li;
	  }
	  recallSavedValue(gui, controller);
	  dom.addClass(controller.domElement, 'c');
	  var name = document.createElement('span');
	  dom.addClass(name, 'property-name');
	  name.innerHTML = controller.property;
	  var container = document.createElement('div');
	  container.appendChild(name);
	  container.appendChild(controller.domElement);
	  var li = addRow(gui, container, params.before);
	  dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
	  if (controller instanceof ColorController) {
	    dom.addClass(li, 'color');
	  } else {
	    dom.addClass(li, _typeof(controller.getValue()));
	  }
	  augmentController(gui, li, controller);
	  gui.__controllers.push(controller);
	  return controller;
	}
	function getLocalStorageHash(gui, key) {
	  return document.location.href + '.' + key;
	}
	function addPresetOption(gui, name, setSelected) {
	  var opt = document.createElement('option');
	  opt.innerHTML = name;
	  opt.value = name;
	  gui.__preset_select.appendChild(opt);
	  if (setSelected) {
	    gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
	  }
	}
	function showHideExplain(gui, explain) {
	  explain.style.display = gui.useLocalStorage ? 'block' : 'none';
	}
	function addSaveMenu(gui) {
	  var div = gui.__save_row = document.createElement('li');
	  dom.addClass(gui.domElement, 'has-save');
	  gui.__ul.insertBefore(div, gui.__ul.firstChild);
	  dom.addClass(div, 'save-row');
	  var gears = document.createElement('span');
	  gears.innerHTML = '&nbsp;';
	  dom.addClass(gears, 'button gears');
	  var button = document.createElement('span');
	  button.innerHTML = 'Save';
	  dom.addClass(button, 'button');
	  dom.addClass(button, 'save');
	  var button2 = document.createElement('span');
	  button2.innerHTML = 'New';
	  dom.addClass(button2, 'button');
	  dom.addClass(button2, 'save-as');
	  var button3 = document.createElement('span');
	  button3.innerHTML = 'Revert';
	  dom.addClass(button3, 'button');
	  dom.addClass(button3, 'revert');
	  var select = gui.__preset_select = document.createElement('select');
	  if (gui.load && gui.load.remembered) {
	    Common.each(gui.load.remembered, function (value, key) {
	      addPresetOption(gui, key, key === gui.preset);
	    });
	  } else {
	    addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
	  }
	  dom.bind(select, 'change', function () {
	    for (var index = 0; index < gui.__preset_select.length; index++) {
	      gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
	    }
	    gui.preset = this.value;
	  });
	  div.appendChild(select);
	  div.appendChild(gears);
	  div.appendChild(button);
	  div.appendChild(button2);
	  div.appendChild(button3);
	  if (SUPPORTS_LOCAL_STORAGE) {
	    var explain = document.getElementById('dg-local-explain');
	    var localStorageCheckBox = document.getElementById('dg-local-storage');
	    var saveLocally = document.getElementById('dg-save-locally');
	    saveLocally.style.display = 'block';
	    if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
	      localStorageCheckBox.setAttribute('checked', 'checked');
	    }
	    showHideExplain(gui, explain);
	    dom.bind(localStorageCheckBox, 'change', function () {
	      gui.useLocalStorage = !gui.useLocalStorage;
	      showHideExplain(gui, explain);
	    });
	  }
	  var newConstructorTextArea = document.getElementById('dg-new-constructor');
	  dom.bind(newConstructorTextArea, 'keydown', function (e) {
	    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
	      SAVE_DIALOGUE.hide();
	    }
	  });
	  dom.bind(gears, 'click', function () {
	    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
	    SAVE_DIALOGUE.show();
	    newConstructorTextArea.focus();
	    newConstructorTextArea.select();
	  });
	  dom.bind(button, 'click', function () {
	    gui.save();
	  });
	  dom.bind(button2, 'click', function () {
	    var presetName = prompt('Enter a new preset name.');
	    if (presetName) {
	      gui.saveAs(presetName);
	    }
	  });
	  dom.bind(button3, 'click', function () {
	    gui.revert();
	  });
	}
	function addResizeHandle(gui) {
	  var pmouseX = void 0;
	  gui.__resize_handle = document.createElement('div');
	  Common.extend(gui.__resize_handle.style, {
	    width: '6px',
	    marginLeft: '-3px',
	    height: '200px',
	    cursor: 'ew-resize',
	    position: 'absolute'
	  });
	  function drag(e) {
	    e.preventDefault();
	    gui.width += pmouseX - e.clientX;
	    gui.onResize();
	    pmouseX = e.clientX;
	    return false;
	  }
	  function dragStop() {
	    dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
	    dom.unbind(window, 'mousemove', drag);
	    dom.unbind(window, 'mouseup', dragStop);
	  }
	  function dragStart(e) {
	    e.preventDefault();
	    pmouseX = e.clientX;
	    dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
	    dom.bind(window, 'mousemove', drag);
	    dom.bind(window, 'mouseup', dragStop);
	    return false;
	  }
	  dom.bind(gui.__resize_handle, 'mousedown', dragStart);
	  dom.bind(gui.__closeButton, 'mousedown', dragStart);
	  gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
	}
	function setWidth(gui, w) {
	  gui.domElement.style.width = w + 'px';
	  if (gui.__save_row && gui.autoPlace) {
	    gui.__save_row.style.width = w + 'px';
	  }
	  if (gui.__closeButton) {
	    gui.__closeButton.style.width = w + 'px';
	  }
	}
	function getCurrentPreset(gui, useInitialValues) {
	  var toReturn = {};
	  Common.each(gui.__rememberedObjects, function (val, index) {
	    var savedValues = {};
	    var controllerMap = gui.__rememberedObjectIndecesToControllers[index];
	    Common.each(controllerMap, function (controller, property) {
	      savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
	    });
	    toReturn[index] = savedValues;
	  });
	  return toReturn;
	}
	function setPresetSelectIndex(gui) {
	  for (var index = 0; index < gui.__preset_select.length; index++) {
	    if (gui.__preset_select[index].value === gui.preset) {
	      gui.__preset_select.selectedIndex = index;
	    }
	  }
	}
	function updateDisplays(controllerArray) {
	  if (controllerArray.length !== 0) {
	    requestAnimationFrame$1$1.call(window, function () {
	      updateDisplays(controllerArray);
	    });
	  }
	  Common.each(controllerArray, function (c) {
	    c.updateDisplay();
	  });
	}
	var GUI$1 = GUI;

	/**
	 * A demo manager event.
	 */

	class DemoManagerEvent extends Event {

		/**
		 * Constructs a new demo manager event.
		 *
		 * @param {String} type - The name of the event.
		 */

		constructor(type) {

			super(type);

			/**
			 * The previous demo, if available.
			 *
			 * @type {Demo}
			 */

			this.previousDemo = null;

			/**
			 * The current demo.
			 *
			 * @type {Demo}
			 */

			this.demo = null;

		}

	}

	/**
	 * A demo manager change event.
	 *
	 * This event is dispatched by {@link DemoManager} when the user switches to
	 * another demo.
	 *
	 * @type {DemoManagerEvent}
	 * @example demoManager.addEventListener("change", myListener);
	 */

	const change = new DemoManagerEvent("change");

	/**
	 * A demo manager load event.
	 *
	 * This event is dispatched by {@link DemoManager} when a demo has finished
	 * loading and is about to start rendering.
	 *
	 * @type {DemoManagerEvent}
	 * @example demoManager.addEventListener("load", myListener);
	 */

	const load = new DemoManagerEvent("load");

	/**
	 * A demo manager.
	 */

	class DemoManager extends EventTarget {

		/**
		 * Constructs a new demo manager.
		 *
		 * @param {HTMLElement} viewport - The primary DOM container.
		 * @param {Object} [options] - Additional options.
		 * @param {HTMLElement} [options.aside] - A secondary DOM container.
		 * @param {WebGLRenderer} [options.renderer] - A custom renderer.
		 */

		constructor(viewport, options = {}) {

			const aside = (options.aside !== undefined) ? options.aside : viewport;

			super();

			/**
			 * The main renderer.
			 *
			 * @type {WebGLRenderer}
			 * @private
			 */

			this.renderer = (options.renderer !== undefined) ? options.renderer : (() => {

				const renderer = new three.WebGLRenderer();
				renderer.setSize(viewport.clientWidth, viewport.clientHeight);
				renderer.setPixelRatio(window.devicePixelRatio);

				return renderer;

			})();

			viewport.appendChild(this.renderer.domElement);

			/**
			 * A clock.
			 *
			 * @type {Clock}
			 * @private
			 */

			this.clock = new three.Clock();

			/**
			 * A menu for custom demo options.
			 *
			 * @type {GUI}
			 * @private
			 */

			this.menu = new GUI$1({ autoPlace: false });

			aside.appendChild(this.menu.domElement);

			/**
			 * A collection of demos.
			 *
			 * @type {Map}
			 * @private
			 */

			this.demos = new Map();

			/**
			 * The id of the current demo.
			 *
			 * @type {String}
			 * @private
			 */

			this.demo = null;

			/**
			 * The current demo.
			 *
			 * @type {Demo}
			 * @private
			 */

			this.currentDemo = null;

		}

		/**
		 * Updates the demo options menu.
		 *
		 * @private
		 * @return {GUI} A clean menu.
		 */

		resetMenu() {

			const node = this.menu.domElement.parentNode;
			const menu = new GUI$1({ autoPlace: false });

			// Don't create a demo selection if there's only one demo.
			if(this.demos.size > 1) {

				const selection = menu.add(this, "demo", Array.from(this.demos.keys()));
				selection.onChange(() => this.loadDemo());

			}

			node.removeChild(this.menu.domElement);
			node.appendChild(menu.domElement);

			this.menu.destroy();
			this.menu = menu;

			return menu;

		}

		/**
		 * Activates the given demo if it's still selected.
		 *
		 * While the demo was loading, another demo may have been selected.
		 *
		 * @private
		 * @param {Demo} demo - A demo.
		 */

		startDemo(demo) {

			if(demo.id === this.demo) {

				demo.initialize();
				demo.registerOptions(this.resetMenu());
				demo.ready = true;

				load.demo = demo;
				this.dispatchEvent(load);

			}

		}

		/**
		 * Loads the currently selected demo.
		 *
		 * @private
		 */

		loadDemo() {

			const nextDemo = this.demos.get(this.demo);
			const currentDemo = this.currentDemo;
			const renderer = this.renderer;

			// Update the URL.
			window.location.hash = nextDemo.id;

			if(currentDemo !== null) {

				currentDemo.reset();

			}

			// Hide the menu.
			this.menu.domElement.style.display = "none";

			// Update and dispatch the event.
			change.previousDemo = currentDemo;
			change.demo = nextDemo;
			this.currentDemo = nextDemo;
			this.dispatchEvent(change);

			// Clear the screen.
			renderer.clear();

			nextDemo.load().then(() => this.startDemo(nextDemo)).catch(console.error);

		}

		/**
		 * Adds a demo.
		 *
		 * @param {Demo} demo - The demo.
		 * @return {DemoManager} This manager.
		 */

		addDemo(demo) {

			const hash = window.location.hash.slice(1);
			const currentDemo = this.currentDemo;

			this.demos.set(demo.id, demo.setRenderer(this.renderer));

			// If there is a hash value, wait for the corresponding demo to be added.
			if((this.demo === null && hash.length === 0) || demo.id === hash) {

				this.demo = demo.id;
				this.loadDemo();

			}

			// Update the demo selection.
			this.resetMenu();

			if(currentDemo !== null && currentDemo.ready) {

				// Add the demo options again.
				currentDemo.registerOptions(this.menu);

			}

			return this;

		}

		/**
		 * Removes a demo.
		 *
		 * @param {String} id - The id of the demo.
		 * @return {DemoManager} This manager.
		 */

		removeDemo(id) {

			const demos = this.demos;

			let firstEntry;

			if(demos.has(id)) {

				demos.delete(id);

				if(this.demo === id && demos.size > 0) {

					// Load the first of the remaining demos.
					firstEntry = demos.entries().next().value;
					this.demo = firstEntry[0];
					this.currentDemo = firstEntry[1];
					this.loadDemo();

				} else {

					this.demo = null;
					this.currentDemo = null;
					this.renderer.clear();

				}

			}

			return this;

		}

		/**
		 * Sets the render size.
		 *
		 * @param {Number} width - The width.
		 * @param {Number} height - The height.
		 */

		setSize(width, height) {

			const demo = this.currentDemo;

			this.renderer.setSize(width, height);

			if(demo !== null && demo.camera !== null) {

				const camera = demo.camera;

				if(camera instanceof three.OrthographicCamera) {

					camera.left = width / -2.0;
					camera.right = width / 2.0;
					camera.top = height / 2.0;
					camera.bottom = height / -2.0;
					camera.updateProjectionMatrix();

				} else if(!(camera instanceof three.CubeCamera)) {

					// Perspective, Array or Stereo camera.
					camera.aspect = width / height;
					camera.updateProjectionMatrix();

				}

			}

		}

		/**
		 * The main render loop.
		 *
		 * @param {DOMHighResTimeStamp} now - The current time.
		 */

		render(now) {

			const demo = this.currentDemo;
			const delta = this.clock.getDelta();

			if(demo !== null && demo.ready) {

				demo.render(delta);

			}

		}

	}

	/**
	 * Core components.
	 *
	 * @module three-demo
	 */

	var PassName;
	(function (PassName) {
	    PassName["Clear"] = "clear";
	    PassName["ClearMask"] = "clearMask";
	    PassName["Effect"] = "effect";
	    PassName["Mask"] = "mask";
	    PassName["Render"] = "render";
	    PassName["Save"] = "save";
	    PassName["Shader"] = "shader";
	})(PassName || (PassName = {}));

	/**
	 * An abstract pass.
	 *
	 * Passes that do not rely on the depth buffer should explicitly disable the
	 * depth test and depth write in their respective shader materials.
	 */
	class Pass {
	    /**
	     * Constructs a new pass.
	     *
	     * @param - The name of this pass. Does not have to be unique.
	     * @param - The scene to render. The default scene contains a single mesh that fills the screen.
	     * @param - The camera. The default camera perfectly captures the screen mesh.
	     */
	    constructor(name, scene = new three.Scene(), camera = new three.OrthographicCamera(-1, 1, 1, -1, 0, 1)) {
	        this.name = name;
	        this.scene = scene;
	        this.camera = camera;
	        // [k: string]: any;
	        this.uniform = null;
	        /**
	         * A quad mesh that fills the screen.
	         */
	        this.quad = null;
	        /**
	         * Indicates whether the {@link EffectComposer} should swap the frame
	         * buffers after this pass has finished rendering.
	         *
	         * Set this to `false` if this pass doesn't render to the output buffer or
	         * the screen. Otherwise, the contents of the input buffer will be lost.
	         *
	         * This flag must not be changed at runtime.
	         */
	        this.needsSwap = true;
	        /**
	         * Indicates whether the {@link EffectComposer} should prepare a depth
	         * texture for this pass.
	         *
	         * Set this to `true` if this pass relies on depth information from a
	         * preceding {@link RenderPass}.
	         */
	        this.needsDepthTexture = false;
	        /**
	         * Indicates whether this pass should render to screen.
	         */
	        this.renderToScreen = false;
	        /**
	         * Indicates whether this pass should be executed.
	         */
	        this.enabled = true;
	    }
	    /**
	     * Returns the current fullscreen material.
	     *
	     * @return The current fullscreen material(s), or null if there is none.
	     */
	    getFullscreenMaterial() {
	        return (this.quad !== null) ? this.quad.material : null;
	    }
	    /**
	     * Returns the current fullscreen material.
	     *
	     * @return The current fullscreen materials.
	     */
	    getFullscreenMaterials() {
	        return this.quad === null
	            ? []
	            : Array.isArray(this.quad.material)
	                ? this.quad.material
	                : [this.quad.material];
	    }
	    /**
	     * Returns the current fullscreen material.
	     *
	     * @return The current fullscreen materials.
	     */
	    getFullscreenMaterialsOfType(type) {
	        return this.getFullscreenMaterials()
	            .filter((mat) => mat instanceof type);
	    }
	    /**
	     * Sets the fullscreen material.
	     *
	     * The material will be assigned to the quad mesh that fills the screen. The
	     * screen quad will be created once a material is assigned via this method.
	     *
	     * @param - A fullscreen material.
	     */
	    setFullscreenMaterial(material) {
	        if (this.quad !== null) {
	            this.quad.material = material;
	        }
	        else {
	            const quad = new three.Mesh(new three.PlaneBufferGeometry(2, 2), material);
	            quad.frustumCulled = false;
	            if (this.scene !== null) {
	                this.scene.add(quad);
	                this.quad = quad;
	            }
	        }
	    }
	    /**
	     * Returns the current depth texture.
	     *
	     * @return The current depth texture, or null if there is none.
	     */
	    getDepthTexture() {
	        return null;
	    }
	    /**
	     * Sets the depth texture.
	     *
	     * You may override this method if your pass relies on the depth information
	     * of a preceding {@link RenderPass}.
	     *
	     * @param depthTexture - A depth texture.
	     * @param depthPacking - The depth packing. Default to `0`.
	     */
	    setDepthTexture(depthTexture, depthPacking = 0) { }
	    /**
	     * Updates this pass with the renderer's size.
	     *
	     * You may override this method in case you want to be informed about the size
	     * of the main frame buffer.
	     *
	     * The {@link EffectComposer} calls this method before this pass is
	     * initialized and every time its own size is updated.
	     *
	     * @param width - The renderer's width.
	     * @param height - The renderer's height.
	     * @example this.myRenderTarget.setSize(width, height);
	     */
	    setSize(width, height) { }
	    /**
	     * Performs initialization tasks.
	     *
	     * By overriding this method you gain access to the renderer. You'll also be
	     * able to configure your custom render targets to use the appropriate format
	     * (RGB or RGBA).
	     *
	     * The provided renderer can be used to warm up special off-screen render
	     * targets by performing a preliminary render operation.
	     *
	     * The {@link EffectComposer} calls this method when this pass is added to its
	     * queue, but not before its size has been set.
	     *
	     * @param renderer - The renderer.
	     * @param alpha - Whether the renderer uses the alpha channel or not.
	     * @example if(!alpha) { this.myRenderTarget.texture.format = RGBFormat; }
	     */
	    initialize(renderer, alpha) { }
	    /**
	     * Performs a shallow search for disposable properties and deletes them. The
	     * pass will be inoperative after this method was called!
	     *
	     * Disposable objects:
	     *  - WebGLRenderTarget
	     *  - Material
	     *  - Texture
	     *
	     * The {@link EffectComposer} calls this method when it is being destroyed.
	     * You may, however, use it independently to free memory when you are certain
	     * that you don't need this pass anymore.
	     */
	    dispose() {
	        this.getFullscreenMaterials().forEach(material => material.dispose());
	        /**
	         * @todo: Find a less sketchy (see: type safer) way of doing this
	         */
	        Object.keys(this)
	            .map(prop => this[prop])
	            .filter((value) => value !== null
	            && typeof value === 'object'
	            && typeof value.dispose === 'function')
	            .forEach(value => value.dispose());
	    }
	}

	/**
	 * A pass that disables the stencil test.
	 */
	class ClearMaskPass extends Pass {
	    constructor() {
	        super(PassName.ClearMask);
	        this.needsSwap = false;
	    }
	    /**
	     * Disables the global stencil test.
	     */
	    render(renderer) {
	        renderer.state.buffers.stencil.setTest(false);
	    }
	}

	/**
	 * A pass that clears the input buffer or the screen.
	 *
	 * You can prevent specific bits from being cleared by setting either the
	 * `autoClearColor`, `autoClearStencil` or `autoClearDepth` properties of the renderer
	 * to `false`.
	 */
	class ClearPass extends Pass {
	    /**
	     * Constructs a new clear pass.
	     *
	     * @param color - Determines whether the color buffer should be cleared.
	     * @param depth - Determines whether the depth buffer should be cleared.
	     * @param stencil - Determines whether the stencil buffer should be cleared.
	     */
	    constructor(color = true, depth = true, stencil = false) {
	        super(PassName.Clear);
	        this.color = color;
	        this.depth = depth;
	        this.stencil = stencil;
	        /**
	         * An override clear color.
	         */
	        this.overrideClearColor = null;
	        /**
	         * An override clear alpha.
	         */
	        this.overrideClearAlpha = 0.0;
	        this.needsSwap = false;
	    }
	    /**
	     * Clears the input buffer or the screen.
	     *
	     * @param renderer - The renderer.
	     * @param inputBuffer - A frame buffer that contains the result of the previous pass.
	     */
	    render(renderer, inputBuffer) {
	        const overrideClearColor = this.overrideClearColor;
	        let clearAlpha;
	        if (overrideClearColor !== null) {
	            ClearPass.color.copy(renderer.getClearColor());
	            clearAlpha = renderer.getClearAlpha();
	            renderer.setClearColor(overrideClearColor, this.overrideClearAlpha);
	        }
	        renderer.setRenderTarget(this.renderToScreen ? null : inputBuffer);
	        renderer.clear(this.color, this.depth, this.stencil);
	        if (overrideClearColor !== null) {
	            renderer.setClearColor(ClearPass.color, clearAlpha);
	        }
	    }
	}
	/** Used to save the original clear color of the renderer. */
	ClearPass.color = new three.Color();

	/**
	 * A blend function enumeration.
	 */
	var BlendFunction;
	(function (BlendFunction) {
	    /** No blending. The effect will not be included in the final shader. */
	    BlendFunction[BlendFunction["SKIP"] = 0] = "SKIP";
	    /** Additive blending. Fast, but may produce washed out results. */
	    BlendFunction[BlendFunction["ADD"] = 1] = "ADD";
	    /** Alpha blending. Blends based on the alpha value of the new color. Opacity will be ignored. */
	    BlendFunction[BlendFunction["ALPHA"] = 2] = "ALPHA";
	    /** Average blending. */
	    BlendFunction[BlendFunction["AVERAGE"] = 3] = "AVERAGE";
	    /** Color dodge. */
	    BlendFunction[BlendFunction["COLOR_BURN"] = 4] = "COLOR_BURN";
	    /** Color burn. */
	    BlendFunction[BlendFunction["COLOR_DODGE"] = 5] = "COLOR_DODGE";
	    /** Prioritize darker colors. */
	    BlendFunction[BlendFunction["DARKEN"] = 6] = "DARKEN";
	    /** Color difference. */
	    BlendFunction[BlendFunction["DIFFERENCE"] = 7] = "DIFFERENCE";
	    /** Color exclusion. */
	    BlendFunction[BlendFunction["EXCLUSION"] = 8] = "EXCLUSION";
	    /** Prioritize lighter colors. */
	    BlendFunction[BlendFunction["LIGHTEN"] = 9] = "LIGHTEN";
	    /** Color multiplication. */
	    BlendFunction[BlendFunction["MULTIPLY"] = 10] = "MULTIPLY";
	    /** Color division. */
	    BlendFunction[BlendFunction["DIVIDE"] = 11] = "DIVIDE";
	    /** Color negation. */
	    BlendFunction[BlendFunction["NEGATION"] = 12] = "NEGATION";
	    /** Normal blending. The new color overwrites the old one. */
	    BlendFunction[BlendFunction["NORMAL"] = 13] = "NORMAL";
	    /** Color overlay. */
	    BlendFunction[BlendFunction["OVERLAY"] = 14] = "OVERLAY";
	    /** Color reflection. */
	    BlendFunction[BlendFunction["REFLECT"] = 15] = "REFLECT";
	    /** Screen blending. The two colors are effectively projected on a white screen simultaneously. */
	    BlendFunction[BlendFunction["SCREEN"] = 16] = "SCREEN";
	    /** Soft light blending. */
	    BlendFunction[BlendFunction["SOFT_LIGHT"] = 17] = "SOFT_LIGHT";
	    /** Color subtraction. */
	    BlendFunction[BlendFunction["SUBTRACT"] = 18] = "SUBTRACT";
	})(BlendFunction || (BlendFunction = {}));

	var addBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn min(x + y, 1.0) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";

	var alphaBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn y * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, y.a), x.a);\n\n}\n";

	var averageBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn (x + y) * 0.5 * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";

	var colorBurnBlendFunction = "float blend(const in float x, const in float y) {\n\n\treturn (y == 0.0) ? y : max(1.0 - (1.0 - x) / y, 0.0);\n\n}\n\nvec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\tvec3 z = vec3(blend(x.r, y.r), blend(x.g, y.g), blend(x.b, y.b));\n\n\treturn z * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";

	var colorDodgeBlendFunction = "float blend(const in float x, const in float y) {\n\n\treturn (y == 1.0) ? y : min(x / (1.0 - y), 1.0);\n\n}\n\nvec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\tvec3 z = vec3(blend(x.r, y.r), blend(x.g, y.g), blend(x.b, y.b));\n\n\treturn z * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";

	var darkenBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn min(x, y) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";

	var differenceBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn abs(x - y) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";

	var exclusionBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn (x + y - 2.0 * x * y) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";

	var lightenBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn max(x, y) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";

	var multiplyBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn x * y * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";

	var divideBlendFunction = "float blend(const in float x, const in float y) {\n\n\treturn (y > 0.0) ? min(x / y, 1.0) : 1.0;\n\n}\n\nvec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\tvec3 z = vec3(blend(x.r, y.r), blend(x.g, y.g), blend(x.b, y.b));\n\n\treturn z * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";

	var negationBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn (1.0 - abs(1.0 - x - y)) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";

	var normalBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn y * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";

	var overlayBlendFunction = "float blend(const in float x, const in float y) {\n\n\treturn (x < 0.5) ? (2.0 * x * y) : (1.0 - 2.0 * (1.0 - x) * (1.0 - y));\n\n}\n\nvec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\tvec3 z = vec3(blend(x.r, y.r), blend(x.g, y.g), blend(x.b, y.b));\n\n\treturn z * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";

	var reflectBlendFunction = "float blend(const in float x, const in float y) {\n\n\treturn (y == 1.0) ? y : min(x * x / (1.0 - y), 1.0);\n\n}\n\nvec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\tvec3 z = vec3(blend(x.r, y.r), blend(x.g, y.g), blend(x.b, y.b));\n\n\treturn z * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";

	var screenBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn (1.0 - (1.0 - x) * (1.0 - y)) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";

	var softLightBlendFunction = "float blend(const in float x, const in float y) {\n\n\treturn (y < 0.5) ?\n\t\t(2.0 * x * y + x * x * (1.0 - 2.0 * y)) :\n\t\t(sqrt(x) * (2.0 * y - 1.0) + 2.0 * x * (1.0 - y));\n\n}\n\nvec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\tvec3 z = vec3(blend(x.r, y.r), blend(x.g, y.g), blend(x.b, y.b));\n\n\treturn z * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";

	var subtractBlendFunction = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn max(x + y - 1.0, 0.0) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n";

	/** A blend mode. */
	class BlendMode {
	    /**
	     * Constructs a new blend mode.
	     *
	     * @param blendFunction - The blend function to use.
	     * @param opacity - The opacity of the color that will be blended with the base color.
	     */
	    constructor(blendFunction, opacity = 1.0) {
	        this.blendFunction = blendFunction;
	        this.opacity = new three.Uniform(opacity);
	    }
	    /** Returns the blend function shader code, or null for `SKIP` blend function. */
	    getShaderCode() {
	        switch (this.blendFunction) {
	            case BlendFunction.SKIP: return null;
	            case BlendFunction.ADD: return addBlendFunction;
	            case BlendFunction.ALPHA: return alphaBlendFunction;
	            case BlendFunction.AVERAGE: return averageBlendFunction;
	            case BlendFunction.COLOR_BURN: return colorBurnBlendFunction;
	            case BlendFunction.COLOR_DODGE: return colorDodgeBlendFunction;
	            case BlendFunction.DARKEN: return darkenBlendFunction;
	            case BlendFunction.DIFFERENCE: return differenceBlendFunction;
	            case BlendFunction.EXCLUSION: return exclusionBlendFunction;
	            case BlendFunction.LIGHTEN: return lightenBlendFunction;
	            case BlendFunction.MULTIPLY: return multiplyBlendFunction;
	            case BlendFunction.DIVIDE: return divideBlendFunction;
	            case BlendFunction.NEGATION: return negationBlendFunction;
	            case BlendFunction.NORMAL: return normalBlendFunction;
	            case BlendFunction.OVERLAY: return overlayBlendFunction;
	            case BlendFunction.REFLECT: return reflectBlendFunction;
	            case BlendFunction.SCREEN: return screenBlendFunction;
	            case BlendFunction.SOFT_LIGHT: return softLightBlendFunction;
	            case BlendFunction.SUBTRACT: return subtractBlendFunction;
	        }
	    }
	}

	var EffectName;
	(function (EffectName) {
	    EffectName["Bokeh"] = "BokehEffect";
	    EffectName["ChromaticAberration"] = "ChromaticAberrationEffect";
	    EffectName["ColorAverage"] = "ColorAverageEffect";
	    EffectName["Glitch"] = "GlitchEffect";
	    EffectName["Noise"] = "NoiseEffect";
	    EffectName["Scanline"] = "ScanlineEffect";
	    EffectName["Sepia"] = "SepiaEffect";
	    EffectName["ShockWave"] = "ShockWaveEffect";
	    EffectName["SMAA"] = "SMAAEffect";
	})(EffectName || (EffectName = {}));
	/**
	 * An enumeration of effect attributes.
	 * Attributes can be concatenated using the bitwise OR operator.
	 *
	 * @example
	 * const attributes = EffectAttribute.CONVOLUTION | EffectAttribute.DEPTH;
	 */
	var EffectAttribute;
	(function (EffectAttribute) {
	    /* No attributes. Most effects don't need to specify any attributes. */
	    EffectAttribute[EffectAttribute["NONE"] = 0] = "NONE";
	    /** Describes effects that require a depth texture. */
	    EffectAttribute[EffectAttribute["DEPTH"] = 1] = "DEPTH";
	    /**
	     * Describes effects that fetch additional samples from the input buffer.
	     * There cannot be more than one effect with this attribute per {@link EffectPass}.
	     */
	    EffectAttribute[EffectAttribute["CONVOLUTION"] = 2] = "CONVOLUTION";
	})(EffectAttribute || (EffectAttribute = {}));
	/** An enumeration of WebGL extensions. */
	var WebGLExtension;
	(function (WebGLExtension) {
	    /** Enables derivatives by adding the functions dFdx, dFdy and fwidth. */
	    WebGLExtension["DERIVATIVES"] = "derivatives";
	    /** Enables gl_FragDepthEXT to set a depth value of a fragment from within the fragment shader. */
	    WebGLExtension["FRAG_DEPTH"] = "fragDepth";
	    /** Enables multiple render targets (MRT) support. */
	    WebGLExtension["DRAW_BUFFERS"] = "drawBuffers";
	    /** Enables explicit control of texture LOD. */
	    WebGLExtension["SHADER_TEXTURE_LOD"] = "shaderTextureLOD";
	})(WebGLExtension || (WebGLExtension = {}));

	/**
	 * An abstract effect.
	 * Effects can be combined using the {@link EffectPass}.
	 */
	class Effect {
	    constructor(name, fragmentShader, partialOptions = {}) {
	        this.name = name;
	        this.fragmentShader = fragmentShader;
	        this.vertexShader = null;
	        const settings = {
	            attributes: EffectAttribute.NONE,
	            blendFunction: BlendFunction.SCREEN,
	            defines: new Map(),
	            uniforms: new Map(),
	            extensions: new Set(),
	            vertexShader: null,
	            ...partialOptions,
	        };
	        this.attributes = settings.attributes;
	        this.vertexShader = settings.vertexShader;
	        this.defines = settings.defines;
	        this.uniforms = settings.uniforms;
	        this.extensions = settings.extensions;
	        this.blendMode = new BlendMode(settings.blendFunction);
	    }
	    /**
	     * @virtual Sets the depth texture.
	     *
	     * You may override this method if your effect requires direct access to the
	     * depth texture that is bound to the associated {@link EffectPass}.
	     */
	    setDepthTexture(depthTexture, depthPacking = 0) { }
	    /**
	     * @virtual Updates the effect by performing supporting operations.
	     *
	     * This method is called by the {@link EffectPass} right before the main
	     * fullscreen render operation, even if the blend function is set to `SKIP`.
	     *
	     * You may override this method if you need to render additional off-screen
	     * textures or update custom uniforms.
	     *
	     * @param renderer - The renderer.
	     * @param inputBuffer - A frame buffer that contains the result of the previous pass.
	     * @param delta - The time between the last frame and the current one in seconds.
	     */
	    update(renderer, inputBuffer, delta = 0) { }
	    /**
	     * @virtual Updates the size of this effect.
	     *
	     * You may override this method in case you want to be informed about the main
	     * render size.
	     *
	     * The {@link EffectPass} calls this method before this effect is initialized
	     * and every time its own size is updated.
	     */
	    setSize(width, height) { }
	    /**
	     * @virtual Performs initialization tasks.
	     *
	     * By overriding this method you gain access to the renderer. You'll also be
	     * able to configure your custom render targets to use the appropriate format
	     * (RGB or RGBA).
	     *
	     * The provided renderer can be used to warm up special off-screen render
	     * targets by performing a preliminary render operation.
	     *
	     * The {@link EffectPass} calls this method during its own initialization
	     * which happens after the size has been set.
	     *
	     * @param renderer - The renderer.
	     * @param alpha - Whether the renderer uses the alpha channel or not.
	     * @example if(!alpha) this.myRenderTarget.texture.format = RGBFormat;
	     */
	    initialize(renderer, alpha) { }
	    /**
	     * Performs a shallow search for properties that define a dispose method and
	     * deletes them. The effect will be inoperative after this method was called!
	     *
	     * Disposable objects:
	     *  - render targets
	     *  - materials
	     *  - textures
	     *
	     * The {@link EffectPass} calls this method when it is being destroyed. Do not
	     * call this method directly.
	     */
	    dispose() {
	        for (const key of Object.keys(this)) {
	            if (this[key] !== null && typeof this[key].dispose === 'function') {
	                this[key].dispose();
	                this[key] = null;
	            }
	        }
	    }
	}

	var fragment$1 = "varying vec2 vUvR;\nvarying vec2 vUvB;\n\nvoid mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {\n\n\tvec4 color = inputColor;\n\n\tcolor.r = texture2D(inputBuffer, vUvR).r;\n\tcolor.b = texture2D(inputBuffer, vUvB).b;\n\n\toutputColor = color;\n\n}\n";

	var vertex = "uniform vec2 offset;\n\nvarying vec2 vUvR;\nvarying vec2 vUvB;\n\nvoid mainSupport() {\n\n\tvUvR = uv + offset;\n\tvUvB = uv - offset;\n\n}\n";

	/**
	 * A chromatic aberration effect.
	 */
	class ChromaticAberrationEffect extends Effect {
	    constructor(partialOptions = {}) {
	        const options = {
	            blendFunction: BlendFunction.NORMAL,
	            offset: new three.Vector2(0.001, 0.0005),
	            ...partialOptions,
	        };
	        super(EffectName.ChromaticAberration, fragment$1, {
	            attributes: EffectAttribute.CONVOLUTION,
	            blendFunction: options.blendFunction,
	            uniforms: new Map([
	                ['offset', new three.Uniform(options.offset)],
	            ]),
	            vertexShader: vertex,
	        });
	    }
	    /**
	     * The color offset.
	     */
	    get offset() {
	        return this.uniforms.get('offset').value;
	    }
	    set offset(value) {
	        this.uniforms.get('offset').value = value;
	    }
	}

	var fragment$2 = "uniform sampler2D perturbationMap;\n\nuniform bool active;\nuniform float columns;\nuniform float random;\nuniform vec2 seed;\nuniform vec2 distortion;\n\nvoid mainUv(inout vec2 uv) {\n\n\tif(active) {\n\n\t\tvec4 normal = texture2D(perturbationMap, uv * random * random);\n\n\t\tif(uv.y < distortion.x + columns && uv.y > distortion.x - columns * random) {\n\n\t\t\tfloat sx = clamp(ceil(seed.x), 0.0, 1.0);\n\t\t\tuv.y = sx * (1.0 - (uv.y + distortion.y)) + (1.0 - sx) * distortion.y;\n\n\t\t}\n\n\t\tif(uv.x < distortion.y + columns && uv.x > distortion.y - columns * random) {\n\n\t\t\tfloat sy = clamp(ceil(seed.y), 0.0, 1.0);\n\t\t\tuv.x = sy * distortion.x + (1.0 - sy) * (1.0 - (uv.x + distortion.x));\n\n\t\t}\n\n\t\tuv.x += normal.x * seed.x * (random * 0.2);\n\t\tuv.y += normal.y * seed.y * (random * 0.2);\n\n\t}\n\n}\n";

	/**
	 * Finds and collects substrings that match the given regular expression.
	 *
	 * @param regExp - A regular expression.
	 * @param string - A string.
	 * @return The matching substrings.
	 */
	const findSubstrings = (regExp, str) => {
	    const substrings = [];
	    let result;
	    // tslint:disable-next-line:no-conditional-assignment
	    while ((result = regExp.exec(str)) !== null) {
	        substrings.push(result[1]);
	    }
	    return substrings;
	};

	/**
	 * An enumeration of shader code placeholders.
	 */
	var Section;
	(function (Section) {
	    /**  A placeholder for function and variable declarations inside the fragment shader. */
	    Section["FRAGMENT_HEAD"] = "FRAGMENT_HEAD";
	    /**  A placeholder for UV transformations inside the fragment shader. */
	    Section["FRAGMENT_MAIN_UV"] = "FRAGMENT_MAIN_UV";
	    /**  A placeholder for color calculations inside the fragment shader. */
	    Section["FRAGMENT_MAIN_IMAGE"] = "FRAGMENT_MAIN_IMAGE";
	    /**  A placeholder for function and variable declarations inside the vertex shader. */
	    Section["VERTEX_HEAD"] = "VERTEX_HEAD";
	    /**  A placeholder for supporting calculations inside the vertex shader. */
	    Section["VERTEX_MAIN_SUPPORT"] = "VERTEX_MAIN_SUPPORT";
	})(Section || (Section = {}));

	var fragment$3 = "uniform sampler2D inputBuffer;\n\nvarying vec2 vUv;\n\nvarying vec2 vUv0;\nvarying vec2 vUv1;\nvarying vec2 vUv2;\nvarying vec2 vUv3;\nvarying vec2 vUv4;\nvarying vec2 vUv5;\n\nvoid main() {\n\n\tconst vec2 threshold = vec2(EDGE_THRESHOLD);\n\n\t// Calculate color deltas.\n\tvec4 delta;\n\tvec3 c = texture2D(inputBuffer, vUv).rgb;\n\n\tvec3 cLeft = texture2D(inputBuffer, vUv0).rgb;\n\tvec3 t = abs(c - cLeft);\n\tdelta.x = max(max(t.r, t.g), t.b);\n\n\tvec3 cTop = texture2D(inputBuffer, vUv1).rgb;\n\tt = abs(c - cTop);\n\tdelta.y = max(max(t.r, t.g), t.b);\n\n\t// Use a threshold to detect significant color edges.\n\tvec2 edges = step(threshold, delta.xy);\n\n\t// Discard if there is no edge.\n\tif(dot(edges, vec2(1.0)) == 0.0) {\n\n\t\tdiscard;\n\n\t}\n\n\t// Calculate right and bottom deltas.\n\tvec3 cRight = texture2D(inputBuffer, vUv2).rgb;\n\tt = abs(c - cRight);\n\tdelta.z = max(max(t.r, t.g), t.b);\n\n\tvec3 cBottom = texture2D(inputBuffer, vUv3).rgb;\n\tt = abs(c - cBottom);\n\tdelta.w = max(max(t.r, t.g), t.b);\n\n\t// Calculate the maximum delta in the direct neighborhood.\n\tfloat maxDelta = max(max(max(delta.x, delta.y), delta.z), delta.w);\n\n\t// Calculate left-left and top-top deltas.\n\tvec3 cLeftLeft = texture2D(inputBuffer, vUv4).rgb;\n\tt = abs(c - cLeftLeft);\n\tdelta.z = max(max(t.r, t.g), t.b);\n\n\tvec3 cTopTop = texture2D(inputBuffer, vUv5).rgb;\n\tt = abs(c - cTopTop);\n\tdelta.w = max(max(t.r, t.g), t.b);\n\n\t// Calculate the final maximum delta.\n\tmaxDelta = max(max(maxDelta, delta.z), delta.w);\n\n\t// Local contrast adaptation.\n\tedges *= step(0.5 * maxDelta, delta.xy);\n\n\tgl_FragColor = vec4(edges, 0.0, 0.0);\n\n}\n";

	var vertex$1 = "uniform vec2 texelSize;\n\nvarying vec2 vUv;\n\nvarying vec2 vUv0;\nvarying vec2 vUv1;\nvarying vec2 vUv2;\nvarying vec2 vUv3;\nvarying vec2 vUv4;\nvarying vec2 vUv5;\n\nvoid main() {\n\n\tvUv = uv;\n\n\t// Left and top texel coordinates.\n\tvUv0 = uv + texelSize * vec2(-1.0, 0.0);\n\tvUv1 = uv + texelSize * vec2(0.0, 1.0);\n\n\t// Right and bottom texel coordinates.\n\tvUv2 = uv + texelSize * vec2(1.0, 0.0);\n\tvUv3 = uv + texelSize * vec2(0.0, -1.0);\n\n\t// Left-left and top-top texel coordinates.\n\tvUv4 = uv + texelSize * vec2(-2.0, 0.0);\n\tvUv5 = uv + texelSize * vec2(0.0, 2.0);\n\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\n}\n";

	/**
	 * A material that detects edges in a color texture.
	 * Mainly used for Subpixel Morphological Antialiasing.
	 */
	class ColorEdgesMaterial extends three.ShaderMaterial {
	    /**
	     * Constructs a new color edges material.
	     * @param texelSize - The absolute screen texel size.
	     */
	    constructor(texelSize = new three.Vector2()) {
	        super({
	            defines: {
	                EDGE_THRESHOLD: '0.1',
	            },
	            uniforms: {
	                inputBuffer: new three.Uniform(null),
	                texelSize: new three.Uniform(texelSize),
	            },
	            fragmentShader: fragment$3,
	            vertexShader: vertex$1,
	            depthWrite: false,
	            depthTest: false,
	        });
	    }
	    /**
	     * Sets the edge detection sensitivity.
	     *
	     * A lower value results in more edges being detected at the expense of
	     * performance.
	     *
	     * 0.1 is a reasonable value, and allows to catch most visible edges.
	     * 0.05 is a rather overkill value, that allows to catch 'em all.
	     *
	     * If temporal supersampling is used, 0.2 could be a reasonable value,
	     * as low contrast edges are properly filtered by just 2x.
	     *
	     * @param threshold - The edge detection sensitivity. Range: [0.05, 0.5].
	     */
	    setEdgeDetectionThreshold(threshold) {
	        this.defines.EDGE_THRESHOLD = threshold.toFixed(2);
	        this.needsUpdate = true;
	    }
	}

	var fragment$4 = "uniform sampler2D inputBuffer;\nuniform float opacity;\n\nvarying vec2 vUv;\n\nvoid main() {\n\n\tvec4 texel = texture2D(inputBuffer, vUv);\n\tgl_FragColor = opacity * texel;\n\n}\n";

	var vertex$2 = "varying vec2 vUv;\n\nvoid main() {\n\n\tvUv = uv;\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\n}\n";

	/**
	 * A simple copy shader material.
	 */
	class CopyMaterial extends three.ShaderMaterial {
	    constructor() {
	        super({
	            uniforms: {
	                inputBuffer: new three.Uniform(null),
	                opacity: new three.Uniform(1.0),
	            },
	            fragmentShader: fragment$4,
	            vertexShader: vertex$2,
	            depthWrite: false,
	            depthTest: false,
	        });
	    }
	}

	var fragmentTemplate = "#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n\nuniform sampler2D inputBuffer;\nuniform sampler2D depthBuffer;\n\nuniform vec2 resolution;\nuniform vec2 texelSize;\n\nuniform float cameraNear;\nuniform float cameraFar;\nuniform float aspect;\nuniform float time;\n\nvarying vec2 vUv;\n\nfloat readDepth(const in vec2 uv) {\n\n\t#if DEPTH_PACKING == 3201\n\n\t\treturn unpackRGBAToDepth(texture2D(depthBuffer, uv));\n\n\t#else\n\n\t\treturn texture2D(depthBuffer, uv).r;\n\n\t#endif\n\n}\n\nFRAGMENT_HEAD\n\nvoid main() {\n\n\tFRAGMENT_MAIN_UV\n\n\tvec4 color0 = texture2D(inputBuffer, UV);\n\tvec4 color1 = vec4(0.0);\n\n\tFRAGMENT_MAIN_IMAGE\n\n\tgl_FragColor = color0;\n\n\t#include <dithering_fragment>\n\n}\n";

	var vertexTemplate = "uniform vec2 resolution;\nuniform vec2 texelSize;\n\nuniform float cameraNear;\nuniform float cameraFar;\nuniform float aspect;\nuniform float time;\n\nvarying vec2 vUv;\n\nVERTEX_HEAD\n\nvoid main() {\n\n\tvUv = uv;\n\n\tVERTEX_MAIN_SUPPORT\n\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\n}\n";

	/**
	 * An effect material for compound shaders.
	 *
	 * This material supports dithering.
	 */
	class EffectMaterial extends three.ShaderMaterial {
	    /**
	     * Constructs a new effect material.
	     *
	     * @param shaderParts - A collection of shader snippets.
	     * @param defines - A collection of preprocessor macro definitions.
	     * @param uniforms - A collection of uniforms.
	     * @param camera - A camera.
	     * @param dithering - Whether dithering should be enabled.
	     */
	    constructor(shaderParts, defines, uniforms, camera = null, dithering = false) {
	        super({
	            defines: {
	                DEPTH_PACKING: '0',
	            },
	            uniforms: {
	                inputBuffer: new three.Uniform(null),
	                depthBuffer: new three.Uniform(null),
	                resolution: new three.Uniform(new three.Vector2()),
	                texelSize: new three.Uniform(new three.Vector2()),
	                cameraNear: new three.Uniform(0.3),
	                cameraFar: new three.Uniform(1000.0),
	                aspect: new three.Uniform(1.0),
	                time: new three.Uniform(0.0),
	            },
	            fragmentShader: fragmentTemplate
	                .replace(Section.FRAGMENT_HEAD, shaderParts.get(Section.FRAGMENT_HEAD))
	                .replace(Section.FRAGMENT_MAIN_UV, shaderParts.get(Section.FRAGMENT_MAIN_UV))
	                .replace(Section.FRAGMENT_MAIN_IMAGE, shaderParts.get(Section.FRAGMENT_MAIN_IMAGE)),
	            vertexShader: vertexTemplate
	                .replace(Section.VERTEX_HEAD, shaderParts.get(Section.VERTEX_HEAD))
	                .replace(Section.VERTEX_MAIN_SUPPORT, shaderParts.get(Section.VERTEX_MAIN_SUPPORT)),
	            dithering,
	            depthWrite: false,
	            depthTest: false,
	        });
	        if (defines !== null) {
	            for (const entry of defines.entries()) {
	                this.defines[entry[0]] = entry[1];
	            }
	        }
	        if (uniforms !== null) {
	            for (const entry of uniforms.entries()) {
	                this.uniforms[entry[0]] = entry[1];
	            }
	        }
	        this.adoptCameraSettings(camera);
	    }
	    /**
	     * The current depth packing.
	     */
	    get depthPacking() {
	        return Number.parseInt(this.defines.DEPTH_PACKING, 10);
	    }
	    /**
	     * Sets the depth packing.
	     *
	     * Use `BasicDepthPacking` or `RGBADepthPacking` if your depth texture
	     * contains packed depth.
	     *
	     * You'll need to call {@link EffectPass#recompile} after changing this value.
	     */
	    set depthPacking(value) {
	        this.defines.DEPTH_PACKING = value.toFixed(0);
	    }
	    /**
	     * Sets the resolution.
	     */
	    setSize(unboundWidth, unboundHeight) {
	        const width = Math.max(unboundWidth, 1.0);
	        const height = Math.max(unboundHeight, 1.0);
	        this.uniforms.resolution.value.set(width, height);
	        this.uniforms.texelSize.value.set(1.0 / width, 1.0 / height);
	        this.uniforms.aspect.value = width / height;
	    }
	    /**
	     * Adopts the settings of the given camera.
	     */
	    adoptCameraSettings(camera = null) {
	        if (camera !== null) {
	            if (camera instanceof three.PerspectiveCamera) {
	                this.uniforms.cameraNear.value = camera.near;
	                this.uniforms.cameraFar.value = camera.far;
	                this.defines.PERSPECTIVE_CAMERA = '1';
	            }
	            else {
	                delete this.defines.PERSPECTIVE_CAMERA;
	            }
	        }
	    }
	}

	var fragment$5 = "#define sampleLevelZeroOffset(t, coord, offset) texture2D(t, coord + float(offset) * texelSize, 0.0)\n\nuniform sampler2D inputBuffer;\nuniform sampler2D areaTexture;\nuniform sampler2D searchTexture;\n\nuniform vec2 texelSize;\n\nvarying vec2 vUv;\nvarying vec4 vOffset[3];\nvarying vec2 vPixCoord;\n\nvec2 round(vec2 x) {\n\n\treturn sign(x) * floor(abs(x) + 0.5);\n\n}\n\nfloat searchLength(vec2 e, float bias, float scale) {\n\n\t// Not required if searchTexture accesses are set to point.\n\t// const vec2 SEARCH_TEX_PIXEL_SIZE = 1.0 / vec2(66.0, 33.0);\n\t// e = vec2(bias, 0.0) + 0.5 * SEARCH_TEX_PIXEL_SIZE + e * vec2(scale, 1.0) * vec2(64.0, 32.0) * SEARCH_TEX_PIXEL_SIZE;\n\n\te.r = bias + e.r * scale;\n\n\treturn 255.0 * texture2D(searchTexture, e, 0.0).r;\n\n}\n\nfloat searchXLeft(vec2 texCoord, float end) {\n\n\t/* @PSEUDO_GATHER4\n\tThis texCoord has been offset by (-0.25, -0.125) in the vertex shader to\n\tsample between edge, thus fetching four edges in a row.\n\tSampling with different offsets in each direction allows to disambiguate\n\twhich edges are active from the four fetched ones. */\n\n\tvec2 e = vec2(0.0, 1.0);\n\n\tfor(int i = 0; i < MAX_SEARCH_STEPS_INT; ++i) {\n\n\t\te = texture2D(inputBuffer, texCoord, 0.0).rg;\n\t\ttexCoord -= vec2(2.0, 0.0) * texelSize;\n\n\t\tif(!(texCoord.x > end && e.g > 0.8281 && e.r == 0.0)) { break; }\n\n\t}\n\n\t// Correct the previously applied offset (-0.25, -0.125).\n\ttexCoord.x += 0.25 * texelSize.x;\n\n\t// The searches are biased by 1, so adjust the coords accordingly.\n\ttexCoord.x += texelSize.x;\n\n\t// Disambiguate the length added by the last step.\n\ttexCoord.x += 2.0 * texelSize.x; // Undo last step.\n\ttexCoord.x -= texelSize.x * searchLength(e, 0.0, 0.5);\n\n\treturn texCoord.x;\n\n}\n\nfloat searchXRight(vec2 texCoord, float end) {\n\n\tvec2 e = vec2(0.0, 1.0);\n\n\tfor(int i = 0; i < MAX_SEARCH_STEPS_INT; ++i) {\n\n\t\te = texture2D(inputBuffer, texCoord, 0.0).rg;\n\t\ttexCoord += vec2(2.0, 0.0) * texelSize;\n\n\t\tif(!(texCoord.x < end && e.g > 0.8281 && e.r == 0.0)) { break; }\n\n\t}\n\n\ttexCoord.x -= 0.25 * texelSize.x;\n\ttexCoord.x -= texelSize.x;\n\ttexCoord.x -= 2.0 * texelSize.x;\n\ttexCoord.x += texelSize.x * searchLength(e, 0.5, 0.5);\n\n\treturn texCoord.x;\n\n}\n\nfloat searchYUp(vec2 texCoord, float end) {\n\n\tvec2 e = vec2(1.0, 0.0);\n\n\tfor(int i = 0; i < MAX_SEARCH_STEPS_INT; ++i) {\n\n\t\te = texture2D(inputBuffer, texCoord, 0.0).rg;\n\t\ttexCoord += vec2(0.0, 2.0) * texelSize; // Changed sign.\n\n\t\tif(!(texCoord.y > end && e.r > 0.8281 && e.g == 0.0)) { break; }\n\n\t}\n\n\ttexCoord.y -= 0.25 * texelSize.y; // Changed sign.\n\ttexCoord.y -= texelSize.y; // Changed sign.\n\ttexCoord.y -= 2.0 * texelSize.y; // Changed sign.\n\ttexCoord.y += texelSize.y * searchLength(e.gr, 0.0, 0.5); // Changed sign.\n\n\treturn texCoord.y;\n\n}\n\nfloat searchYDown(vec2 texCoord, float end) {\n\n\tvec2 e = vec2(1.0, 0.0);\n\n\tfor(int i = 0; i < MAX_SEARCH_STEPS_INT; ++i ) {\n\n\t\te = texture2D(inputBuffer, texCoord, 0.0).rg;\n\t\ttexCoord -= vec2(0.0, 2.0) * texelSize; // Changed sign.\n\n\t\tif(!(texCoord.y < end && e.r > 0.8281 && e.g == 0.0)) { break; }\n\n\t}\n\n\ttexCoord.y += 0.25 * texelSize.y; // Changed sign.\n\ttexCoord.y += texelSize.y; // Changed sign.\n\ttexCoord.y += 2.0 * texelSize.y; // Changed sign.\n\ttexCoord.y -= texelSize.y * searchLength(e.gr, 0.5, 0.5); // Changed sign.\n\n\treturn texCoord.y;\n\n}\n\nvec2 area(vec2 dist, float e1, float e2, float offset) {\n\n\t// Rounding prevents precision errors of bilinear filtering.\n\tvec2 texCoord = AREATEX_MAX_DISTANCE * round(4.0 * vec2(e1, e2)) + dist;\n\n\t// Scale and bias for texel space translation.\n\ttexCoord = AREATEX_PIXEL_SIZE * texCoord + (0.5 * AREATEX_PIXEL_SIZE);\n\n\t// Move to proper place, according to the subpixel offset.\n\ttexCoord.y += AREATEX_SUBTEX_SIZE * offset;\n\n\treturn texture2D(areaTexture, texCoord, 0.0).rg;\n\n}\n\nvoid main() {\n\n\tvec4 weights = vec4(0.0);\n\tvec4 subsampleIndices = vec4(0.0);\n\tvec2 e = texture2D(inputBuffer, vUv).rg;\n\n\tif(e.g > 0.0) {\n\n\t\t// Edge at north.\n\t\tvec2 d;\n\n\t\t// Find the distance to the left.\n\t\tvec2 coords;\n\t\tcoords.x = searchXLeft(vOffset[0].xy, vOffset[2].x);\n\t\tcoords.y = vOffset[1].y; // vOffset[1].y = vUv.y - 0.25 * texelSize.y (@CROSSING_OFFSET)\n\t\td.x = coords.x;\n\n\t\t/* Now fetch the left crossing edges, two at a time using bilinear\n\t\tfiltering. Sampling at -0.25 (see @CROSSING_OFFSET) enables to discern what\n\t\tvalue each edge has. */\n\t\tfloat e1 = texture2D(inputBuffer, coords, 0.0).r;\n\n\t\t// Find the distance to the right.\n\t\tcoords.x = searchXRight(vOffset[0].zw, vOffset[2].y);\n\t\td.y = coords.x;\n\n\t\t/* Translate distances to pixel units for better interleave arithmetic and\n\t\tmemory accesses. */\n\t\td = d / texelSize.x - vPixCoord.x;\n\n\t\t// The area texture is compressed quadratically.\n\t\tvec2 sqrtD = sqrt(abs(d));\n\n\t\t// Fetch the right crossing edges.\n\t\tcoords.y -= texelSize.y; // WebGL port note: Added.\n\t\tfloat e2 = sampleLevelZeroOffset(inputBuffer, coords, ivec2(1, 0)).r;\n\n\t\t// Pattern recognised, now get the actual area.\n\t\tweights.rg = area(sqrtD, e1, e2, subsampleIndices.y);\n\n\t}\n\n\tif(e.r > 0.0) {\n\n\t\t// Edge at west.\n\t\tvec2 d;\n\n\t\t// Find the distance to the top.\n\t\tvec2 coords;\n\t\tcoords.y = searchYUp(vOffset[1].xy, vOffset[2].z);\n\t\tcoords.x = vOffset[0].x; // vOffset[1].x = vUv.x - 0.25 * texelSize.x;\n\t\td.x = coords.y;\n\n\t\t// Fetch the top crossing edges.\n\t\tfloat e1 = texture2D(inputBuffer, coords, 0.0).g;\n\n\t\t// Find the distance to the bottom.\n\t\tcoords.y = searchYDown(vOffset[1].zw, vOffset[2].w);\n\t\td.y = coords.y;\n\n\t\t// Distances in pixel units.\n\t\td = d / texelSize.y - vPixCoord.y;\n\n\t\t// The area texture is compressed quadratically.\n\t\tvec2 sqrtD = sqrt(abs(d));\n\n\t\t// Fetch the bottom crossing edges.\n\t\tcoords.y -= texelSize.y; // WebGL port note: Added.\n\t\tfloat e2 = sampleLevelZeroOffset(inputBuffer, coords, ivec2(0, 1)).g;\n\n\t\t// Get the area for this direction.\n\t\tweights.ba = area(sqrtD, e1, e2, subsampleIndices.x);\n\n\t}\n\n\tgl_FragColor = weights;\n\n}\n";

	var vertex$3 = "uniform vec2 texelSize;\n\nvarying vec2 vUv;\nvarying vec4 vOffset[3];\nvarying vec2 vPixCoord;\n\nvoid main() {\n\n\tvUv = uv;\n\n\tvPixCoord = uv / texelSize;\n\n\t// Offsets for the searches (see @PSEUDO_GATHER4).\n\tvOffset[0] = uv.xyxy + texelSize.xyxy * vec4(-0.25, 0.125, 1.25, 0.125); // Changed sign in Y and W components.\n\tvOffset[1] = uv.xyxy + texelSize.xyxy * vec4(-0.125, 0.25, -0.125, -1.25); //Changed sign in Y and W components.\n\n\t// This indicates the ends of the loops.\n\tvOffset[2] = vec4(vOffset[0].xz, vOffset[1].yw) + vec4(-2.0, 2.0, -2.0, 2.0) * texelSize.xxyy * MAX_SEARCH_STEPS_FLOAT;\n\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\n}\n";

	/**
	 * Subpixel Morphological Antialiasing.
	 * This material computes weights for detected edges.
	 */
	class SMAAWeightsMaterial extends three.ShaderMaterial {
	    /**
	     * Constructs a new SMAA weights material.
	     * @param [texelSize] - The absolute screen texel size.
	     */
	    constructor(texelSize = new three.Vector2()) {
	        super({
	            defines: {
	                // Configurable settings:
	                MAX_SEARCH_STEPS_INT: '8',
	                MAX_SEARCH_STEPS_FLOAT: '8.0',
	                // Non-configurable settings:
	                AREATEX_MAX_DISTANCE: '16.0',
	                AREATEX_PIXEL_SIZE: '(1.0 / vec2(160.0, 560.0))',
	                AREATEX_SUBTEX_SIZE: '(1.0 / 7.0)',
	                SEARCHTEX_SIZE: 'vec2(66.0, 33.0)',
	                SEARCHTEX_PACKED_SIZE: 'vec2(64.0, 16.0)',
	            },
	            uniforms: {
	                inputBuffer: new three.Uniform(null),
	                areaTexture: new three.Uniform(null),
	                searchTexture: new three.Uniform(null),
	                texelSize: new three.Uniform(texelSize),
	            },
	            fragmentShader: fragment$5,
	            vertexShader: vertex$3,
	            depthWrite: false,
	            depthTest: false,
	        });
	    }
	    /**
	     * Sets the maximum amount of steps performed in the horizontal/vertical
	     * pattern searches, at each side of the pixel.
	     *
	     * In number of pixels, it's actually the double. So the maximum line length
	     * perfectly handled by, for example 16, is 64 (perfectly means that longer
	     * lines won't look as good, but are still antialiased).
	     *
	     * @param steps - The search steps. Range: [0, 112].
	     */
	    setOrthogonalSearchSteps(steps) {
	        this.defines.MAX_SEARCH_STEPS_INT = steps.toFixed(0);
	        this.defines.MAX_SEARCH_STEPS_FLOAT = steps.toFixed(1);
	        this.needsUpdate = true;
	    }
	}

	/**
	 * Prefixes substrings within the given strings.
	 *
	 * @param prefix - A prefix.
	 * @param substrings - The substrings.
	 * @param strings - A collection of named strings.
	 */
	const prefixSubstrings = (prefix, substrings, strings) => {
	    let prefixed;
	    let regExp;
	    for (const substring of substrings) {
	        // tslint:disable-next-line:prefer-template
	        prefixed = '$1' + prefix + substring.charAt(0).toUpperCase() + substring.slice(1);
	        // tslint:disable-next-line:prefer-template
	        regExp = new RegExp('([^\\.])(\\b' + substring + '\\b)', 'g');
	        for (const entry of strings.entries()) {
	            if (entry[1] !== null) {
	                strings.set(entry[0], entry[1].replace(regExp, prefixed));
	            }
	        }
	    }
	};

	/**
	 * Integrates the given effect.
	 *
	 * @param prefix - A prefix.
	 * @param effect - An effect.
	 * @param shaderParts - The shader parts.
	 * @param blendModes - The blend modes.
	 * @param defines - The macro definitions.
	 * @param uniforms - The uniforms.
	 * @param attributes - The global, collective attributes.
	 * @return The results.
	 */
	const integrateEffect = (prefix, effect, shaderParts, blendModes, defines, uniforms, attributes) => {
	    const functionRegExp = /(?:\w+\s+(\w+)\([\w\s,]*\)\s*{[^}]+})/g;
	    const varyingRegExp = /(?:varying\s+\w+\s+(\w*))/g;
	    const blendMode = effect.blendMode;
	    const shaders = new Map([
	        ['fragment', effect.fragmentShader],
	        ['vertex', effect.vertexShader],
	    ]);
	    const mainImageExists = effect.fragmentShader.includes('mainImage');
	    const mainUvExists = effect.fragmentShader.includes('mainUv');
	    let varyings = [];
	    let names = [];
	    let transformedUv = false;
	    let readDepth = false;
	    if (shaders.get('fragment') === undefined) {
	        console.error('Missing fragment shader', effect);
	    }
	    else if (mainUvExists && (attributes & EffectAttribute.CONVOLUTION) !== 0) {
	        console.error('Effects that transform UV coordinates are incompatible with convolution effects', effect);
	    }
	    else if (!mainImageExists && !mainUvExists) {
	        console.error('The fragment shader contains neither a mainImage nor a mainUv function', effect);
	    }
	    else {
	        if (mainUvExists) {
	            shaderParts.set(Section.FRAGMENT_MAIN_UV, shaderParts.get(Section.FRAGMENT_MAIN_UV) + '\t' + prefix + 'MainUv(UV);\n');
	            transformedUv = true;
	        }
	        if (shaders.get('vertex') !== null && shaders.get('vertex').indexOf('mainSupport') >= 0) {
	            shaderParts.set(Section.VERTEX_MAIN_SUPPORT, shaderParts.get(Section.VERTEX_MAIN_SUPPORT) + '\t' + prefix + 'MainSupport();\n');
	            varyings = varyings.concat(findSubstrings(varyingRegExp, shaders.get('vertex')));
	            names = names.concat(varyings).concat(findSubstrings(functionRegExp, shaders.get('vertex')));
	        }
	        names = names
	            .concat(findSubstrings(functionRegExp, shaders.get('fragment')))
	            .concat(Array.from(effect.uniforms.keys()))
	            .concat(Array.from(effect.defines.keys()));
	        // Store prefixed uniforms and macros.
	        effect.uniforms.forEach((value, key) => uniforms.set(prefix + key.charAt(0).toUpperCase() + key.slice(1), value));
	        effect.defines.forEach((value, key) => defines.set(prefix + key.charAt(0).toUpperCase() + key.slice(1), value));
	        // Prefix varyings, functions, uniforms and macros.
	        prefixSubstrings(prefix, names, defines);
	        prefixSubstrings(prefix, names, shaders);
	        // Collect unique blend modes.
	        blendModes.set(blendMode.blendFunction, blendMode);
	        if (mainImageExists) {
	            let str = prefix + 'MainImage(color0, UV, ';
	            // The effect may sample depth in a different shader.
	            if ((attributes & EffectAttribute.DEPTH) !== 0 && shaders.get('fragment').indexOf('depth') >= 0) {
	                str += 'depth, ';
	                readDepth = true;
	            }
	            str += 'color1);\n\t';
	            // Include the blend opacity uniform of this effect.
	            const blendOpacity = prefix + 'BlendOpacity';
	            uniforms.set(blendOpacity, blendMode.opacity);
	            // Blend the result of this effect with the input color.
	            str += 'color0 = blend' + blendMode.blendFunction + '(color0, color1, ' + blendOpacity + ');\n\n\t';
	            shaderParts.set(Section.FRAGMENT_MAIN_IMAGE, shaderParts.get(Section.FRAGMENT_MAIN_IMAGE) + str);
	            shaderParts.set(Section.FRAGMENT_HEAD, shaderParts.get(Section.FRAGMENT_HEAD) + 'uniform float ' + blendOpacity + ';\n\n');
	        }
	        // Include the modified code in the final shader.
	        shaderParts.set(Section.FRAGMENT_HEAD, shaderParts.get(Section.FRAGMENT_HEAD) + shaders.get('fragment') + '\n');
	        if (shaders.get('vertex') !== null) {
	            shaderParts.set(Section.VERTEX_HEAD, shaderParts.get(Section.VERTEX_HEAD) + shaders.get('vertex') + '\n');
	        }
	    }
	    return { varyings, transformedUv, readDepth };
	};

	/**
	 * Returns a random float in the specified range.
	 */
	const randomFloat = (low, high) => {
	    return low + Math.random() * (high - low);
	};

	var GlitchMode;
	(function (GlitchMode) {
	    /** No glitches. */
	    GlitchMode[GlitchMode["DISABLED"] = 0] = "DISABLED";
	    /** Sporadic glitches. */
	    GlitchMode[GlitchMode["SPORADIC"] = 1] = "SPORADIC";
	    /** Constant mild glitches. */
	    GlitchMode[GlitchMode["CONSTANT_MILD"] = 2] = "CONSTANT_MILD";
	    /** Constant wild glitches. */
	    GlitchMode[GlitchMode["CONSTANT_WILD"] = 3] = "CONSTANT_WILD";
	})(GlitchMode || (GlitchMode = {}));
	/**
	 * A glitch effect. Can be used to influence the {@link ChromaticAberrationEffect}. *
	 * Reference: https://github.com/staffantan/unityglitch
	 * Warning: This effect cannot be merged with convolution effects.
	 */
	class GlitchEffect extends Effect {
	    constructor({ blendFunction = BlendFunction.NORMAL, chromaticAberrationOffset = null, delay = new three.Vector2(1.5, 3.5), duration = new three.Vector2(0.6, 1.0), strength = new three.Vector2(0.3, 1.0), columns = 0.05, ratio = 0.85, perturbationMap = null, dtSize = 64, } = {}) {
	        super(EffectName.Glitch, fragment$2, {
	            blendFunction,
	            uniforms: new Map([
	                ['perturbationMap', new three.Uniform(null)],
	                ['columns', new three.Uniform(columns)],
	                ['active', new three.Uniform(false)],
	                ['random', new three.Uniform(0.02)],
	                ['seed', new three.Uniform(new three.Vector2())],
	                ['distortion', new three.Uniform(new three.Vector2())],
	            ]),
	        });
	        this.chromaticAberrationOffset = chromaticAberrationOffset;
	        this.delay = delay;
	        this.duration = duration;
	        this.mode = GlitchMode.SPORADIC;
	        this.ratio = ratio;
	        this.strength = strength;
	        this.time = 0;
	        this.distortion = this.uniforms.get('distortion').value;
	        this.seed = this.uniforms.get('seed').value;
	        this.breakPoint = new three.Vector2(randomFloat(this.delay.x, this.delay.y), randomFloat(this.duration.x, this.duration.y));
	        this.perturbationMap = perturbationMap === null
	            ? this.generatePerturbationMap(dtSize)
	            : perturbationMap;
	        this.setPerturbationMap(this.perturbationMap);
	        this.perturbationMap.generateMipmaps = false;
	    }
	    /**
	     * Indicates whether the glitch effect is currently active.
	     */
	    get active() {
	        return this.uniforms.get('active').value;
	    }
	    /**
	     * Returns the current perturbation map.
	     */
	    getPerturbationMap() {
	        return this.perturbationMap;
	    }
	    /**
	     * Replaces the current perturbation map with the given one.
	     * The current map will be disposed if it was generated by this effect.
	     */
	    setPerturbationMap(perturbationMap) {
	        if (this.perturbationMap !== null && this.perturbationMap.name === GlitchEffect.generatedTexture) {
	            this.perturbationMap.dispose();
	        }
	        perturbationMap.wrapS = perturbationMap.wrapT = three.RepeatWrapping;
	        perturbationMap.magFilter = perturbationMap.minFilter = three.NearestFilter;
	        this.perturbationMap = perturbationMap;
	        this.uniforms.get('perturbationMap').value = perturbationMap;
	    }
	    generatePerturbationMap(size = 64) {
	        const pixels = size * size;
	        const data = new Float32Array(pixels * 3);
	        let i;
	        let x;
	        for (i = 0; i < pixels; ++i) {
	            x = Math.random();
	            data[i * 3] = x;
	            data[i * 3 + 1] = x;
	            data[i * 3 + 2] = x;
	        }
	        const map = new three.DataTexture(data, size, size, three.RGBFormat, three.FloatType);
	        map.name = GlitchEffect.generatedTexture;
	        map.needsUpdate = true;
	        return map;
	    }
	    update(renderer, inputBuffer, delta) {
	        const mode = this.mode;
	        const breakPoint = this.breakPoint;
	        const offset = this.chromaticAberrationOffset;
	        const s = this.strength;
	        let time = this.time;
	        let active = false;
	        let r = 0.0;
	        let a = 0.0;
	        let trigger;
	        if (mode !== GlitchMode.DISABLED) {
	            if (mode === GlitchMode.SPORADIC) {
	                time += delta;
	                trigger = (time > breakPoint.x);
	                if (time >= (breakPoint.x + breakPoint.y)) {
	                    breakPoint.set(randomFloat(this.delay.x, this.delay.y), randomFloat(this.duration.x, this.duration.y));
	                    time = 0;
	                }
	            }
	            r = Math.random();
	            this.uniforms.get('random').value = r;
	            if ((trigger && r > this.ratio) || mode === GlitchMode.CONSTANT_WILD) {
	                active = true;
	                r *= s.y * 0.03;
	                a = randomFloat(-Math.PI, Math.PI);
	                this.seed.set(randomFloat(-s.y, s.y), randomFloat(-s.y, s.y));
	                this.distortion.set(randomFloat(0.0, 1.0), randomFloat(0.0, 1.0));
	            }
	            else if (trigger || mode === GlitchMode.CONSTANT_MILD) {
	                active = true;
	                r *= s.x * 0.03;
	                a = randomFloat(-Math.PI, Math.PI);
	                this.seed.set(randomFloat(-s.x, s.x), randomFloat(-s.x, s.x));
	                this.distortion.set(randomFloat(0.0, 1.0), randomFloat(0.0, 1.0));
	            }
	            this.time = time;
	        }
	        if (offset !== null) {
	            if (active) {
	                offset.set(Math.cos(a), Math.sin(a)).multiplyScalar(r);
	            }
	            else {
	                offset.set(0.0, 0.0);
	            }
	        }
	        this.uniforms.get('active').value = active;
	    }
	}
	/**
	 * A label for generated data textures.
	 */
	GlitchEffect.generatedTexture = 'Glitch.Generated';

	var fragment$6 = "void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {\n\n\tvec3 noise = vec3(rand(uv * time));\n\n\t#ifdef PREMULTIPLY\n\n\t\toutputColor = vec4(inputColor.rgb * noise, inputColor.a);\n\n\t#else\n\n\t\toutputColor = vec4(noise, inputColor.a);\n\n\t#endif\n\n}\n";

	class NoiseEffect extends Effect {
	    constructor({ blendFunction = BlendFunction.SCREEN, premultiply = false, } = {}) {
	        super(EffectName.Noise, fragment$6, { blendFunction });
	        this.premultiply = premultiply;
	    }
	    /**
	     * Indicates whether the noise should be multiplied with the input color.
	     */
	    get premultiply() {
	        return this.defines.has('PREMULTIPLY');
	    }
	    /**
	     * Enables or disables noise premultiplication.
	     * You'll need to call {@link EffectPass#recompile} after changing this value.
	     */
	    set premultiply(value) {
	        value ? this.defines.set('PREMULTIPLY', '1') : this.defines.delete('PREMULTIPLY');
	    }
	}

	var fragment$8 = "uniform bool active;\nuniform vec2 center;\nuniform float waveSize;\nuniform float radius;\nuniform float maxRadius;\nuniform float amplitude;\n\nvarying float vSize;\n\nvoid mainUv(inout vec2 uv) {\n\n\tif(active) {\n\n\t\tvec2 aspectCorrection = vec2(aspect, 1.0);\n\t\tvec2 difference = uv * aspectCorrection - center * aspectCorrection;\n\t\tfloat distance = sqrt(dot(difference, difference)) * vSize;\n\n\t\tif(distance > radius) {\n\n\t\t\tif(distance < radius + waveSize) {\n\n\t\t\t\tfloat angle = (distance - radius) * PI2 / waveSize;\n\t\t\t\tfloat cosSin = (1.0 - cos(angle)) * 0.5;\n\n\t\t\t\tfloat extent = maxRadius + waveSize;\n\t\t\t\tfloat decay = max(extent - distance * distance, 0.0) / extent;\n\n\t\t\t\tuv -= ((cosSin * amplitude * difference) / distance) * decay;\n\n\t\t\t}\n\n\t\t}\n\n\t}\n\n}\n";

	var vertex$4 = "uniform float size;\nuniform float cameraDistance;\n\nvarying float vSize;\n\nvoid mainSupport() {\n\n\tvSize = (0.1 * cameraDistance) / size;\n\n}\n";

	const HALF_PI = Math.PI * 0.5;
	const v = new three.Vector3();
	const ab = new three.Vector3();
	/**
	 * A shock wave effect.
	 *
	 * Warning! This effect cannot be merged with convolution effects.
	 *
	 * Based on a Gist by Jean-Philippe Sarda: https://gist.github.com/jpsarda/33cea67a9f2ecb0a0eda
	 */
	class ShockWaveEffect extends Effect {
	    /**
	     * Constructs a new shock wave effect.
	     *
	     * @param camera - The main camera.
	     * @param epicenter - The world position of the shock wave epicenter.
	     * @param options - The options.
	     */
	    constructor(camera, epicenter = new three.Vector3(), { speed = 2.0, maxRadius = 1.0, waveSize = 0.2, amplitude = 0.05, } = {}) {
	        super(EffectName.ShockWave, fragment$8, {
	            uniforms: new Map([
	                ['active', new three.Uniform(false)],
	                ['center', new three.Uniform(new three.Vector2(0.5, 0.5))],
	                ['cameraDistance', new three.Uniform(1.0)],
	                ['size', new three.Uniform(1.0)],
	                ['radius', new three.Uniform(-waveSize)],
	                ['maxRadius', new three.Uniform(maxRadius)],
	                ['waveSize', new three.Uniform(waveSize)],
	                ['amplitude', new three.Uniform(amplitude)],
	            ]),
	            vertexShader: vertex$4,
	        });
	        this.camera = camera;
	        this.epicenter = epicenter;
	        /**
	         * Time accumulator.
	         */
	        this.time = 0;
	        /**
	         * Indicates whether the shock wave animation is active.
	         */
	        this.active = false;
	        this.screenPosition = this.uniforms.get('center').value;
	        this.speed = speed;
	    }
	    /**
	     * Emits the shock wave.
	     */
	    explode() {
	        this.time = 0.0;
	        this.active = true;
	        this.uniforms.get('active').value = true;
	    }
	    update(renderer, inputBuffer, delta) {
	        if (this.active) {
	            const waveSize = this.uniforms.get('waveSize').value;
	            // Calculate direction vectors.
	            this.camera.getWorldDirection(v);
	            ab.copy(this.camera.position).sub(this.epicenter);
	            // Don't render the effect if the object is behind the camera.
	            if (v.angleTo(ab) > HALF_PI) {
	                // Scale the effect based on distance to the object.
	                this.uniforms.get('cameraDistance').value = this.camera.position.distanceTo(this.epicenter);
	                // Calculate the screen position of the epicenter.
	                v.copy(this.epicenter).project(this.camera);
	                this.screenPosition.set((v.x + 1.0) * 0.5, (v.y + 1.0) * 0.5);
	            }
	            // Update the shock wave radius based on time.
	            this.time += delta * this.speed;
	            const radius = this.time - waveSize;
	            this.uniforms.get('radius').value = radius;
	            if (radius >= (this.uniforms.get('maxRadius').value + waveSize) * 2.0) {
	                this.active = false;
	                this.uniforms.get('active').value = false;
	            }
	        }
	    }
	}

	/* tslint:disable */
	// Generated with SMAASearchImageData.generate().toCanvas().toDataURL(), not cropped, low dynamic range.
	var searchImageDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAhCAAAAABIXyLAAAAAOElEQVRIx2NgGAWjYBSMglEwEICREYRgFBZBqDCSLA2MGPUIVQETE9iNUAqLR5gIeoQKRgwXjwAAGn4AtaFeYLEAAAAASUVORK5CYII";

	/* tslint:disable */
	// Generated with SMAAAreaImageData.generate().toCanvas().toDataURL().
	var areaImageDataURL = "data:image/png;base64,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";

	var fragment$a = "uniform sampler2D weightMap;\n\nvarying vec2 vOffset0;\nvarying vec2 vOffset1;\n\nvoid mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {\n\n\t// Fetch the blending weights for the current pixel.\n\tvec4 a;\n\ta.rb = texture2D(weightMap, uv).rb;\n\ta.g = texture2D(weightMap, vOffset1).g;\n\ta.a = texture2D(weightMap, vOffset0).a;\n\n\tvec4 color = inputColor;\n\n\t// Ignore tiny blending weights.\n\tif(dot(a, vec4(1.0)) >= 1e-5) {\n\n\t\t/* Up to four lines can be crossing a pixel (one through each edge).\n\t\tThe line with the maximum weight for each direction is favoured. */\n\n\t\tvec2 offset = vec2(\n\t\t\ta.a > a.b ? a.a : -a.b,\t// Left vs. right.\n\t\t\ta.g > a.r ? -a.g : a.r\t// Top vs. bottom (changed signs).\n\t\t);\n\n\t\t// Go in the direction with the maximum weight (horizontal vs. vertical).\n\t\tif(abs(offset.x) > abs(offset.y)) {\n\n\t\t\toffset.y = 0.0;\n\n\t\t} else {\n\n\t\t\toffset.x = 0.0;\n\n\t\t}\n\n\t\t// Fetch the opposite color and lerp by hand.\n\t\tvec4 oppositeColor = texture2D(inputBuffer, uv + sign(offset) * texelSize);\n\t\tfloat s = abs(offset.x) > abs(offset.y) ? abs(offset.x) : abs(offset.y);\n\n\t\t// Gamma correction.\n\t\tcolor.rgb = pow(abs(color.rgb), vec3(2.2));\n\t\toppositeColor.rgb = pow(abs(oppositeColor.rgb), vec3(2.2));\n\t\tcolor = mix(color, oppositeColor, s);\n\t\tcolor.rgb = pow(abs(color.rgb), vec3(1.0 / 2.2));\n\n\t}\n\n\toutputColor = color;\n\n}\n";

	var vertex$5 = "varying vec2 vOffset0;\nvarying vec2 vOffset1;\n\nvoid mainSupport() {\n\n\tvOffset0 = uv + texelSize * vec2(1.0, 0.0);\n\tvOffset1 = uv + texelSize * vec2(0.0, -1.0); // Changed sign in Y component.\n\n}\n";

	/**
	 * Subpixel Morphological Antialiasing (SMAA) v2.8.
	 *
	 * Preset: SMAA 1x Medium (with color edge detection).
	 * https://github.com/iryoku/smaa/releases/tag/v2.8
	 */
	class SMAAEffect extends Effect {
	    /**
	     * Constructs a new SMAA effect.
	     *
	     * @param searchImage - The SMAA search image. Preload this image using the {@link searchImageDataURL}.
	     * @param areaImage - The SMAA area image. Preload this image using the {@link areaImageDataURL}.
	     */
	    constructor(searchImage, areaImage) {
	        super(EffectName.SMAA, fragment$a, {
	            attributes: EffectAttribute.CONVOLUTION,
	            blendFunction: BlendFunction.NORMAL,
	            uniforms: new Map([
	                ['weightMap', new three.Uniform(null)],
	            ]),
	            vertexShader: vertex$5,
	        });
	        this.renderTargetColorEdges = new three.WebGLRenderTarget(1, 1, {
	            minFilter: three.LinearFilter,
	            format: three.RGBFormat,
	            stencilBuffer: false,
	            depthBuffer: false,
	        });
	        this.renderTargetColorEdges.texture.name = 'SMAA.ColorEdges';
	        this.renderTargetWeights = this.renderTargetColorEdges.clone();
	        this.renderTargetWeights.texture.name = 'SMAA.Weights';
	        this.renderTargetWeights.texture.format = three.RGBAFormat;
	        this.uniforms.get('weightMap').value = this.renderTargetWeights.texture;
	        this.clearPass = new ClearPass(true, false, false);
	        this.clearPass.overrideClearColor = new three.Color(0x000000);
	        this.clearPass.overrideClearAlpha = 1.0;
	        this.colorEdgesPass = new ShaderPass(new ColorEdgesMaterial());
	        this.weightsPass = new ShaderPass(new SMAAWeightsMaterial());
	        this.weightsPass.getFullscreenMaterials().forEach(mat => {
	            mat.uniforms.searchTexture.value = (() => {
	                const searchTexture = new three.Texture(searchImage);
	                searchTexture.name = 'SMAA.Search';
	                searchTexture.magFilter = three.NearestFilter;
	                searchTexture.minFilter = three.NearestFilter;
	                searchTexture.format = three.RGBAFormat;
	                searchTexture.generateMipmaps = false;
	                searchTexture.needsUpdate = true;
	                searchTexture.flipY = false;
	                return searchTexture;
	            })();
	            mat.uniforms.areaTexture.value = (() => {
	                const areaTexture = new three.Texture(areaImage);
	                areaTexture.name = 'SMAA.Area';
	                areaTexture.minFilter = three.LinearFilter;
	                areaTexture.format = three.RGBAFormat;
	                areaTexture.generateMipmaps = false;
	                areaTexture.needsUpdate = true;
	                areaTexture.flipY = false;
	                return areaTexture;
	            })();
	        });
	    }
	    /**
	     * Sets the edge detection sensitivity.
	     * See {@link ColorEdgesMaterial#setEdgeDetectionThreshold} for more details.
	     *
	     * @param threshold - The edge detection sensitivity. Range: [0.05, 0.5].
	     */
	    setEdgeDetectionThreshold(threshold) {
	        this.colorEdgesPass.getFullscreenMaterialsOfType(ColorEdgesMaterial).forEach(mat => {
	            mat.setEdgeDetectionThreshold(threshold);
	        });
	    }
	    /**
	     * Sets the maximum amount of horizontal/vertical search steps.
	     * See {@link SMAAWeightsMaterial#setOrthogonalSearchSteps} for more details.
	     *
	     * @param steps - The search steps. Range: [0, 112].
	     */
	    setOrthogonalSearchSteps(steps) {
	        this.weightsPass.getFullscreenMaterialsOfType(SMAAWeightsMaterial).forEach(mat => {
	            mat.setOrthogonalSearchSteps(steps);
	        });
	    }
	    update(renderer, inputBuffer) {
	        this.clearPass.render(renderer, this.renderTargetColorEdges);
	        this.colorEdgesPass.render(renderer, inputBuffer, this.renderTargetColorEdges);
	        this.weightsPass.render(renderer, this.renderTargetColorEdges, this.renderTargetWeights);
	    }
	    setSize(width, height) {
	        this.renderTargetColorEdges.setSize(width, height);
	        this.renderTargetWeights.setSize(width, height);
	        this.colorEdgesPass.getFullscreenMaterialsOfType(ColorEdgesMaterial).forEach(mat => {
	            mat.uniforms.texelSize.value.copy(
	            /**
	             * TODO: Figure out what this is actually doing
	             */
	            this.weightsPass.getFullscreenMaterial().uniforms.texelSize.value.set(1.0 / width, 1.0 / height));
	        });
	    }
	    /**
	     * The SMAA search image, encoded as a base64 data URL.
	     *
	     * Use this image data to create an Image instance and use it together with
	     * the area image to create an {@link SMAAEffect}.
	     *
	     * @example
	     * const searchImage = new Image();
	     * searchImage.addEventListener("load", progress);
	     * searchImage.src = SMAAEffect.searchImageDataURL;
	     */
	    static get searchImageDataURL() {
	        return searchImageDataURL;
	    }
	    /**
	     * The SMAA area image, encoded as a base64 data URL.
	     *
	     * Use this image data to create an Image instance and use it together with
	     * the search image to create an {@link SMAAEffect}.
	     *
	     * @example
	     * const areaImage = new Image();
	     * areaImage.addEventListener("load", progress);
	     * areaImage.src = SMAAEffect.areaImageDataURL;
	     */
	    static get areaImageDataURL() {
	        return areaImageDataURL;
	    }
	}

	// export { SSAOEffect } from './SSAOEffect';
	// export { TextureEffect } from './TextureEffect';
	// export { ToneMappingEffect } from './ToneMappingEffect';
	// export { VignetteEffect } from './VignetteEffect';

	/**
	 * An effect pass.
	 *
	 * Use this pass to combine {@link Effect} instances.
	 */
	class EffectPass extends Pass {
	    /**
	     * Constructs a new effect pass.
	     * The provided effects will be organized and merged for optimal performance.
	     *
	     * @param camera - The main camera. The camera's type and settings will be available to all effects.
	     * @param effects - The effects that will be rendered by this pass.
	     */
	    constructor(mainCamera, ...effects) {
	        super(PassName.Effect);
	        this.mainCamera = mainCamera;
	        /**
	         * Indicates whether this pass should skip rendering.
	         * Effects will still be updated, even if this flag is true.
	         */
	        this.skipRendering = false;
	        /** Indicates whether dithering is enabled. */
	        this.quantize = false;
	        /** The amount of shader uniforms that this pass uses. */
	        this.uniforms = 0;
	        /** The amount of shader varyings that this pass uses. */
	        this.varyings = 0;
	        /** A time offset. Elapsed time will start at this value. */
	        this.minTime = 1.0;
	        /** The maximum time. If the elapsed time exceeds this value, it will be reset. */
	        this.maxTime = 1e3;
	        this.effects = effects.sort((a, b) => (b.attributes - a.attributes));
	        this.setFullscreenMaterial(this.createMaterial());
	    }
	    /**
	     * Indicates whether dithering is enabled.
	     * Color quantization reduces banding artifacts but degrades performance.
	     */
	    get dithering() {
	        return this.quantize;
	    }
	    /**
	     * Enables or disables dithering.
	     * Note that some effects have their own dithering setting.
	     */
	    set dithering(value) {
	        if (this.quantize !== value) {
	            this.getFullscreenMaterials().forEach(material => {
	                material.dithering = value;
	                material.needsUpdate = true;
	            });
	            this.quantize = value;
	        }
	    }
	    /**
	     * Creates a compound shader material.
	     *
	     * @return The new material.
	     */
	    createMaterial() {
	        const blendRegExp = /\bblend\b/g;
	        const shaderParts = new Map([
	            [Section.FRAGMENT_HEAD, ''],
	            [Section.FRAGMENT_MAIN_UV, ''],
	            [Section.FRAGMENT_MAIN_IMAGE, ''],
	            [Section.VERTEX_HEAD, ''],
	            [Section.VERTEX_MAIN_SUPPORT, ''],
	        ]);
	        const blendModes = new Map();
	        const defines = new Map();
	        const uniforms = new Map();
	        const extensions = new Set();
	        let id = 0;
	        let varyings = 0;
	        let attributes = 0;
	        let transformedUv = false;
	        let readDepth = false;
	        let result;
	        for (const effect of this.effects) {
	            if (effect.blendMode.blendFunction === BlendFunction.SKIP) {
	                continue;
	            }
	            else if ((attributes & EffectAttribute.CONVOLUTION) !== 0 && (effect.attributes & EffectAttribute.CONVOLUTION) !== 0) {
	                console.error('Convolution effects cannot be merged', effect);
	            }
	            else {
	                attributes |= effect.attributes;
	                result = integrateEffect(('e' + id++), effect, shaderParts, blendModes, defines, uniforms, attributes);
	                varyings += result.varyings.length;
	                transformedUv = transformedUv || result.transformedUv;
	                readDepth = readDepth || result.readDepth;
	                if (effect.extensions !== null) {
	                    // Collect the WebGL extensions that are required by this effect.
	                    for (const extension of effect.extensions) {
	                        extensions.add(extension);
	                    }
	                }
	            }
	        }
	        // Integrate the relevant blend functions.
	        for (const blendMode of blendModes.values()) {
	            shaderParts.set(Section.FRAGMENT_HEAD, `${shaderParts.get(Section.FRAGMENT_HEAD)}${blendMode.getShaderCode().replace(blendRegExp, 'blend' + blendMode.blendFunction)}\n`);
	        }
	        // Check if any effect relies on depth.
	        if ((attributes & EffectAttribute.DEPTH) !== 0) {
	            // Only read depth if any effect actually uses this information.
	            if (readDepth) {
	                shaderParts.set(Section.FRAGMENT_MAIN_IMAGE, `float depth = readDepth(UV);\n\n\t${shaderParts.get(Section.FRAGMENT_MAIN_IMAGE)}`);
	            }
	            this.needsDepthTexture = true;
	        }
	        // Check if any effect transforms UVs in the fragment shader.
	        if (transformedUv) {
	            shaderParts.set(Section.FRAGMENT_MAIN_UV, `vec2 transformedUv = vUv;\n${shaderParts.get(Section.FRAGMENT_MAIN_UV)}`);
	            defines.set('UV', 'transformedUv');
	        }
	        else {
	            defines.set('UV', 'vUv');
	        }
	        shaderParts.forEach((value, key, map) => map.set(key, value.trim()));
	        this.uniforms = uniforms.size;
	        this.varyings = varyings;
	        this.skipRendering = (id === 0);
	        this.needsSwap = !this.skipRendering;
	        const material = new EffectMaterial(shaderParts, defines, uniforms, this.mainCamera, this.dithering);
	        if (extensions.size > 0) {
	            // Enable required WebGL extensions.
	            for (const extension of extensions) {
	                // tslint:disable-next-line:no-any
	                material.extensions[extension] = true;
	            }
	        }
	        return material;
	    }
	    /**
	     * Destroys the current fullscreen shader material and builds a new one.
	     *
	     * Warning: This method performs a relatively expensive shader recompilation.
	     */
	    recompile() {
	        let width = 0;
	        let height = 0;
	        let depthTexture = null;
	        let depthPacking = 0;
	        this.getFullscreenMaterials()
	            .filter((mat) => mat instanceof EffectMaterial)
	            .forEach(material => {
	            const resolution = material.uniforms.resolution.value;
	            width = resolution.x;
	            height = resolution.y;
	            depthTexture = material.uniforms.depthBuffer.value;
	            depthPacking = material.depthPacking;
	            material.dispose();
	            this.uniforms = 0;
	            this.varyings = 0;
	        });
	        const newMaterial = this.createMaterial();
	        newMaterial.setSize(width, height);
	        this.setFullscreenMaterial(newMaterial);
	        this.setDepthTexture(depthTexture, depthPacking);
	    }
	    /**
	     * Returns the current depth texture.
	     *
	     * @return The current depth texture, or null if there is none.
	     */
	    getDepthTexture() {
	        const materials = this.getFullscreenMaterials();
	        return materials.length > 0 ? materials[0].uniforms.depthBuffer.value : null;
	    }
	    /**
	     * Sets the depth texture.
	     *
	     * @param depthTexture - A depth texture.
	     * @param depthPacking - The depth packing.
	     */
	    setDepthTexture(depthTexture, depthPacking = 0) {
	        this.getFullscreenMaterialsOfType(EffectMaterial).forEach(material => {
	            material.uniforms.depthBuffer.value = depthTexture;
	            material.depthPacking = depthPacking;
	            material.needsUpdate = true;
	        });
	        for (const effect of this.effects) {
	            effect.setDepthTexture(depthTexture, depthPacking);
	        }
	    }
	    /**
	     * Renders the effect.
	     *
	     * @param renderer - The renderer.
	     * @param inputBuffer - A frame buffer that contains the result of the previous pass.
	     * @param outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	     * @param delta - The time between the last frame and the current one in seconds.
	     */
	    render(renderer, inputBuffer, outputBuffer, delta = 1) {
	        for (const effect of this.effects) {
	            effect.update(renderer, inputBuffer, delta);
	        }
	        if (!this.skipRendering || this.renderToScreen) {
	            this.getFullscreenMaterials().forEach(material => {
	                const time = material.uniforms.time.value + delta;
	                material.uniforms.inputBuffer.value = inputBuffer.texture;
	                material.uniforms.time.value = (time <= this.maxTime) ? time : this.minTime;
	                renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
	                renderer.render(this.scene, this.camera);
	            });
	        }
	    }
	    /**
	     * Updates the size of this pass.
	     *
	     * @param width - The width.
	     * @param height - The height.
	     */
	    setSize(width, height) {
	        this.getFullscreenMaterials().forEach(material => {
	            if ('setSize' in material)
	                material.setSize(width, height);
	        });
	        for (const effect of this.effects) {
	            effect.setSize(width, height);
	        }
	    }
	    /**
	     * Performs initialization tasks.
	     *
	     * @param renderer - The renderer.
	     * @param alpha - Whether the renderer uses the alpha channel or not.
	     */
	    initialize(renderer, alpha) {
	        const capabilities = renderer.capabilities;
	        let max = Math.min(capabilities.maxFragmentUniforms, capabilities.maxVertexUniforms);
	        if (this.uniforms > max) {
	            console.warn(`The current rendering context doesn't support more than ${max} uniforms, but ${this.uniforms} were defined`);
	        }
	        max = capabilities.maxVaryings;
	        if (this.varyings > max) {
	            console.warn(`The current rendering context doesn't support more than ${max} varyings, but ${this.varyings} were defined`);
	        }
	        for (const effect of this.effects) {
	            effect.initialize(renderer, alpha);
	        }
	    }
	    /**
	     * Deletes disposable objects.
	     *
	     * This pass will be inoperative after this method was called!
	     */
	    dispose() {
	        super.dispose();
	        for (const effect of this.effects) {
	            effect.dispose();
	        }
	    }
	}

	/**
	 * A mask pass.
	 *
	 * This pass requires that the input and output buffers have a stencil buffer.
	 * You can enable the stencil buffer via the {@link EffectComposer} constructor.
	 */
	class MaskPass extends Pass {
	    /**
	     * Constructs a new mask pass.
	     *
	     * @param scene - The scene to render.
	     * @param camera - The camera to use.
	     */
	    constructor(scene, camera) {
	        super(PassName.Mask, scene, camera);
	        /** Inverse flag */
	        this.inverse = false;
	        this.needsSwap = false;
	        this.clearPass = new ClearPass(false, false, true);
	    }
	    /**
	     * Indicates whether this pass should clear the stencil buffer.
	     */
	    get clear() {
	        return this.clearPass.enabled;
	    }
	    /**
	     * Enables or disables auto clear.
	     */
	    set clear(value) {
	        this.clearPass.enabled = value;
	    }
	    /**
	     * Renders the effect.
	     *
	     * @param renderer - The renderer.
	     * @param inputBuffer - A frame buffer that contains the result of the previous pass.
	     * @param outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	     */
	    render(renderer, inputBuffer, outputBuffer) {
	        const context = renderer.context;
	        const state = renderer.state;
	        const scene = this.scene;
	        const camera = this.camera;
	        const clearPass = this.clearPass;
	        const writeValue = this.inverse ? 0 : 1;
	        const clearValue = 1 - writeValue;
	        // Don't update color or depth.
	        state.buffers.color.setMask(0);
	        state.buffers.depth.setMask(0);
	        // Lock the buffers.
	        state.buffers.color.setLocked(true);
	        state.buffers.depth.setLocked(true);
	        // Configure the stencil.
	        state.buffers.stencil.setTest(true);
	        state.buffers.stencil.setOp(context.REPLACE, context.REPLACE, context.REPLACE);
	        state.buffers.stencil.setFunc(context.ALWAYS, writeValue, 0xffffffff);
	        state.buffers.stencil.setClear(clearValue);
	        // Clear the stencil.
	        if (this.clear) {
	            if (this.renderToScreen) {
	                clearPass.render(renderer, null);
	            }
	            else {
	                clearPass.render(renderer, inputBuffer);
	                clearPass.render(renderer, outputBuffer);
	            }
	        }
	        // Draw the mask.
	        if (this.renderToScreen) {
	            renderer.setRenderTarget(null);
	            renderer.render(scene, camera);
	        }
	        else {
	            renderer.setRenderTarget(inputBuffer);
	            renderer.render(scene, camera);
	            renderer.setRenderTarget(outputBuffer);
	            renderer.render(scene, camera);
	        }
	        // Unlock the buffers.
	        state.buffers.color.setLocked(false);
	        state.buffers.depth.setLocked(false);
	        // Only render where the stencil is set to 1.
	        state.buffers.stencil.setFunc(context.EQUAL, 1, 0xffffffff);
	        state.buffers.stencil.setOp(context.KEEP, context.KEEP, context.KEEP);
	    }
	}

	/**
	 * A pass that renders a given scene into the input buffer or to screen.
	 * This pass uses a {@link ClearPass} to clear the target buffer.
	 */
	class RenderPass extends Pass {
	    /**
	     * Constructs a new render pass.
	     *
	     * @param scene The scene to render.
	     * @param camera The camera to use to render the scene.
	     * @param options Additional options.
	     */
	    constructor(scene, camera, overrideMaterial = null) {
	        super(PassName.Render, scene, camera);
	        this.scene = scene;
	        this.camera = camera;
	        this.overrideMaterial = overrideMaterial;
	        this.needsSwap = false;
	        this.clearPass = new ClearPass();
	        this.depthTexture = null;
	    }
	    /**
	     * Indicates whether the target buffer should be cleared before rendering.
	     */
	    get clear() {
	        return this.clearPass.enabled;
	    }
	    /**
	     * Enables or disables auto clear.
	     */
	    set clear(value) {
	        this.clearPass.enabled = value;
	    }
	    /**
	     * Returns the clear pass.
	     */
	    getClearPass() {
	        return this.clearPass;
	    }
	    /**
	     * Returns the current depth texture.
	     */
	    getDepthTexture() {
	        return this.depthTexture;
	    }
	    /**
	     * Sets the depth texture.
	     *
	     * The provided texture will be attached to the input buffer unless this pass
	     * renders to screen.
	     */
	    setDepthTexture(depthTexture, depthPacking = 0) {
	        this.depthTexture = depthTexture;
	    }
	    /**
	     * Renders the scene.
	     *
	     * @param renderer The renderer.
	     * @param inputBuffer A frame buffer that contains the result of the previous pass.
	     * @param outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	     */
	    render(renderer, inputBuffer, outputBuffer) {
	        const scene = this.scene;
	        const overrideMaterial = scene.overrideMaterial;
	        if (this.depthTexture !== null && !this.renderToScreen) {
	            inputBuffer.depthTexture = this.depthTexture;
	            outputBuffer.depthTexture = null;
	        }
	        if (this.clear) {
	            this.clearPass.renderToScreen = this.renderToScreen;
	            this.clearPass.render(renderer, inputBuffer);
	        }
	        scene.overrideMaterial = this.overrideMaterial;
	        renderer.setRenderTarget(this.renderToScreen ? null : inputBuffer);
	        renderer.render(scene, this.camera);
	        scene.overrideMaterial = overrideMaterial;
	    }
	}

	/**
	 * A shader pass. Renders any shader material as a fullscreen effect.
	 *
	 * This pass should not be used to create multiple chained effects. For a more
	 * efficient solution, please refer to the {@link EffectPass}.
	 */
	class ShaderPass extends Pass {
	    /**
	     * Constructs a new shader pass.
	     *
	     * @param material - A shader material.
	     * @param input - The name of the input buffer uniform.
	     */
	    constructor(material, input = 'inputBuffer') {
	        super(PassName.Shader);
	        this.setFullscreenMaterial(material);
	        /**
	         * The input buffer uniform.
	         */
	        this.uniform = null;
	        this.setInput(input);
	    }
	    /**
	     * Sets the name of the input buffer uniform.
	     *
	     * Most fullscreen materials modify texels from an input texture. This pass
	     * automatically assigns the main input buffer to the uniform identified by
	     * the given name.
	     *
	     * @param input - The name of the input buffer uniform.
	     */
	    setInput(input) {
	        const materials = this.getFullscreenMaterials();
	        this.uniform = null;
	        materials.forEach(material => {
	            const uniforms = material.uniforms;
	            if (uniforms !== undefined && uniforms[input] !== undefined) {
	                this.uniform = uniforms[input];
	            }
	        });
	    }
	    /**
	     * Renders the effect.
	     *
	     * @param renderer - The renderer.
	     * @param inputBuffer - A frame buffer that contains the result of the previous pass.
	     * @param outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	     */
	    render(renderer, inputBuffer, outputBuffer) {
	        if (this.uniform !== null) {
	            this.uniform.value = inputBuffer.texture;
	        }
	        renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
	        renderer.render(this.scene, this.camera);
	    }
	}

	// export { BlurPass } from './BlurPass';

	/**
	 * The EffectComposer may be used in place of a normal WebGLRenderer.
	 *
	 * The auto clear behaviour of the provided renderer will be disabled to prevent
	 * unnecessary clear operations.
	 *
	 * It is common practice to use a {@link RenderPass} as the first pass to
	 * automatically clear the buffers and render a scene for further processing.
	 */
	class EffectComposer {
	    /**
	     * Constructs a new effect composer.
	     * @param renderer- The renderer that should be used.
	     * @param options - The options.
	     */
	    constructor(renderer, partialOptions = {}) {
	        this.renderer = renderer;
	        /**
	         * The input buffer.
	         *
	         * Reading from and writing to the same render target should be avoided.
	         * Therefore, two seperate yet identical buffers are used.
	         */
	        this.inputBuffer = null;
	        /**
	         * The output buffer.
	         */
	        this.outputBuffer = null;
	        /**
	         * A copy pass used for copying masked scenes.
	         */
	        this.copyPass = new ShaderPass(new CopyMaterial());
	        this.depthTexture = null;
	        /**
	         * The passes.
	         */
	        this.passes = [];
	        console.log(`I'm the new save pass!`);
	        const options = {
	            depthBuffer: true,
	            stencilBuffer: false,
	            ...partialOptions,
	        };
	        if (this.renderer !== null) {
	            this.renderer.autoClear = false;
	            this.inputBuffer = this.createBuffer(options.depthBuffer, options.stencilBuffer);
	            this.outputBuffer = this.inputBuffer.clone();
	        }
	    }
	    /**
	     * Returns the WebGL renderer.
	     */
	    getRenderer() {
	        return this.renderer;
	    }
	    /**
	     * Replaces the current renderer with the given one. The DOM element of the
	     * current renderer will automatically be removed from its parent node and the
	     * DOM element of the new renderer will take its place.
	     *
	     * The auto clear mechanism of the provided renderer will be disabled.
	     *
	     * @param renderer New renderer.
	     * @return The old renderer.
	     */
	    replaceRenderer(renderer) {
	        const oldRenderer = this.renderer;
	        if (oldRenderer !== null && oldRenderer !== renderer) {
	            const parent = oldRenderer.domElement.parentNode;
	            const oldSize = oldRenderer.getSize(new three.Vector2());
	            const newSize = renderer.getSize(new three.Vector2());
	            this.renderer = renderer;
	            this.renderer.autoClear = false;
	            if (!oldSize.equals(newSize)) {
	                this.setSize();
	            }
	            if (parent !== null) {
	                parent.removeChild(oldRenderer.domElement);
	                parent.appendChild(renderer.domElement);
	            }
	        }
	        return oldRenderer;
	    }
	    /**
	     * Creates a depth texture attachment that will be provided to all passes.
	     *
	     * Note: When a shader reads from a depth texture and writes to a render
	     * target that uses the same depth texture attachment, the depth information
	     * will be lost. This happens even if `depthWrite` is disabled.
	     *
	     * @return The depth texture.
	     */
	    createDepthTexture() {
	        const { width, height } = this.renderer.getDrawingBufferSize(new three.Vector2());
	        const depthTexture = this.depthTexture = new three.DepthTexture(width, height);
	        if (this.inputBuffer.stencilBuffer) {
	            depthTexture.format = three.DepthStencilFormat;
	            depthTexture.type = three.UnsignedInt248Type;
	        }
	        return depthTexture;
	    }
	    /**
	     * Creates a new render target by replicating the renderer's canvas.
	     *
	     * The created render target uses a linear filter for texel minification and
	     * magnification. Its render texture format depends on whether the renderer
	     * uses the alpha channel. Mipmaps are disabled.
	     *
	     * @param depthBuffer - Whether the render target should have a depth buffer.
	     * @param stencilBuffer - Whether the render target should have a stencil buffer.
	     * @return A new render target that equals the renderer's canvas.
	     */
	    createBuffer(depthBuffer, stencilBuffer) {
	        const drawingBufferSize = this.renderer.getDrawingBufferSize(new three.Vector2());
	        const alpha = this.renderer.context.getContextAttributes().alpha;
	        const renderTarget = new three.WebGLRenderTarget(drawingBufferSize.width, drawingBufferSize.height, {
	            minFilter: three.LinearFilter,
	            magFilter: three.LinearFilter,
	            format: alpha ? three.RGBAFormat : three.RGBFormat,
	            depthBuffer,
	            stencilBuffer,
	        });
	        renderTarget.texture.name = 'EffectComposer.Buffer';
	        renderTarget.texture.generateMipmaps = false;
	        return renderTarget;
	    }
	    /**
	     * Adds a pass, optionally at a specific index.
	     *
	     * @param pass - A new pass.
	     * @param index - An index at which the pass should be inserted.
	     */
	    addPass(pass, index) {
	        const passes = this.passes;
	        const renderer = this.renderer;
	        const drawingBufferSize = renderer.getDrawingBufferSize(new three.Vector2());
	        pass.setSize(drawingBufferSize.width, drawingBufferSize.height);
	        pass.initialize(renderer, renderer.context.getContextAttributes().alpha);
	        if (index !== undefined) {
	            passes.splice(index, 0, pass);
	        }
	        else {
	            passes.push(pass);
	        }
	        if (pass.needsDepthTexture || this.depthTexture !== null) {
	            if (this.depthTexture === null) {
	                const depthTexture = this.createDepthTexture();
	                for (const p of passes) {
	                    p.setDepthTexture(depthTexture);
	                }
	            }
	            else {
	                pass.setDepthTexture(this.depthTexture);
	            }
	        }
	    }
	    /**
	     * Removes a pass.
	     */
	    removePass(pass) {
	        const passes = this.passes;
	        const removed = passes.splice(passes.indexOf(pass), 1).length > 0;
	        if (removed && this.depthTexture !== null) {
	            const depthTextureRequired = passes.reduce((a, b) => a || b.needsDepthTexture, false);
	            if (!depthTextureRequired) {
	                this.depthTexture.dispose();
	                this.depthTexture = null;
	                this.inputBuffer.depthTexture = null;
	                this.outputBuffer.depthTexture = null;
	                for (const p of passes) {
	                    p.setDepthTexture(null);
	                }
	            }
	        }
	    }
	    /**
	     * Renders all enabled passes in the order in which they were added.
	     * @param delta - The time between the last frame and the current one in seconds.
	     */
	    render(delta) {
	        let inputBuffer = this.inputBuffer;
	        let outputBuffer = this.outputBuffer;
	        let stencilTest = false;
	        let context;
	        let state;
	        let buffer;
	        for (const pass of this.passes) {
	            if (pass.enabled) {
	                pass.render(this.renderer, inputBuffer, outputBuffer, delta, stencilTest);
	                if (pass.needsSwap) {
	                    if (stencilTest) {
	                        this.copyPass.renderToScreen = pass.renderToScreen;
	                        context = this.renderer.context;
	                        state = this.renderer.state;
	                        // Preserve the unaffected pixels.
	                        state.buffers.stencil.setFunc(context.NOTEQUAL, 1, 0xffffffff);
	                        this.copyPass.render(this.renderer, inputBuffer, outputBuffer);
	                        state.buffers.stencil.setFunc(context.EQUAL, 1, 0xffffffff);
	                    }
	                    buffer = inputBuffer;
	                    inputBuffer = outputBuffer;
	                    outputBuffer = buffer;
	                }
	                if (pass instanceof MaskPass) {
	                    stencilTest = true;
	                }
	                else if (pass instanceof ClearMaskPass) {
	                    stencilTest = false;
	                }
	            }
	        }
	    }
	    /**
	     * Sets the size of the buffers and the renderer's output canvas.
	     *
	     * Every pass will be informed of the new size. It's up to each pass how that
	     * information is used.
	     *
	     * If no width or height is specified, the render targets and passes will be
	     * updated with the current size of the renderer.
	     */
	    setSize(width, height) {
	        if (width === undefined || height === undefined) {
	            const size = this.renderer.getSize(new three.Vector2());
	            // tslint:disable-next-line:no-parameter-reassignment
	            width = size.width;
	            // tslint:disable-next-line:no-parameter-reassignment
	            height = size.height;
	        }
	        // Update the logical render size.
	        this.renderer.setSize(width, height);
	        // The drawing buffer size takes the device pixel ratio into account.
	        const drawingBufferSize = this.renderer.getDrawingBufferSize(new three.Vector2());
	        this.inputBuffer.setSize(drawingBufferSize.width, drawingBufferSize.height);
	        this.outputBuffer.setSize(drawingBufferSize.width, drawingBufferSize.height);
	        for (const pass of this.passes) {
	            pass.setSize(drawingBufferSize.width, drawingBufferSize.height);
	        }
	    }
	    /**
	     * Resets this composer by deleting all passes and creating new buffers.
	     */
	    reset() {
	        const renderTarget = this.createBuffer(this.inputBuffer.depthBuffer, this.inputBuffer.stencilBuffer);
	        this.dispose();
	        // Reanimate.
	        this.inputBuffer = renderTarget;
	        this.outputBuffer = renderTarget.clone();
	        this.depthTexture = null;
	        this.copyPass = new ShaderPass(new CopyMaterial());
	    }
	    /**
	     * Destroys this composer and all passes.
	     *
	     * This method deallocates all disposable objects created by the passes. It
	     * also deletes the main frame buffers of this composer.
	     */
	    dispose() {
	        for (const pass of this.passes)
	            pass.dispose();
	        this.passes = [];
	        if (this.inputBuffer !== null) {
	            this.inputBuffer.dispose();
	            this.inputBuffer = null;
	        }
	        if (this.outputBuffer !== null) {
	            this.outputBuffer.dispose();
	            this.outputBuffer = null;
	        }
	        if (this.depthTexture !== null) {
	            this.depthTexture.dispose();
	        }
	        this.copyPass.dispose();
	    }
	}

	const createCanvas = (width, height, data, channels) => {
	    const canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
	    const context = canvas.getContext('2d');
	    const imageData = context.createImageData(width, height);
	    const target = imageData.data;
	    let x;
	    let y;
	    let i;
	    let j;
	    for (y = 0; y < height; ++y) {
	        for (x = 0; x < width; ++x) {
	            i = (y * width + x) * 4;
	            j = (y * width + x) * channels;
	            target[i] = (channels > 0) ? data[j] : 0;
	            target[i + 1] = (channels > 1) ? data[j + 1] : 0;
	            target[i + 2] = (channels > 2) ? data[j + 2] : 0;
	            target[i + 3] = (channels > 3) ? data[j + 3] : 255;
	        }
	    }
	    canvas.width = width;
	    canvas.height = height;
	    context.putImageData(imageData, 0, 0);
	    return canvas;
	};
	/**
	 * A container for raw image data.
	 */
	class RawImageData {
	    constructor(width = 0, height = 0, data, 
	    /** The amount of color channels used per pixel. Range [1, 4]. */
	    channels = 4) {
	        this.width = width;
	        this.height = height;
	        this.data = data;
	        this.channels = channels;
	    }
	    /**
	     * Creates a canvas from this image data.
	     * @return The canvas or null if it couldn't be created.
	     */
	    toCanvas() {
	        return (typeof document === 'undefined') ? null : createCanvas(this.width, this.height, this.data, this.channels);
	    }
	}

	/**
	 * The orthogonal texture size.
	 */
	/**
	 * The number of samples for calculating areas in the diagonal textures.
	 * Diagonal areas are calculated using brute force sampling.
	 */
	const DIAGONAL_SAMPLES = 30;
	/**
	 * The maximum distance for smoothing U-shapes.
	 */
	const SMOOTH_MAX_DISTANCE = 32;
	/**
	 * Diagonal pattern positioning coordinates.
	 * Used for placing each pattern subtexture into a specific spot.
	 */
	const DIAGONAL_EDGES = [
	    new Uint8Array([0, 0]),
	    new Uint8Array([1, 0]),
	    new Uint8Array([0, 2]),
	    new Uint8Array([1, 2]),
	    new Uint8Array([2, 0]),
	    new Uint8Array([3, 0]),
	    new Uint8Array([2, 2]),
	    new Uint8Array([3, 2]),
	    new Uint8Array([0, 1]),
	    new Uint8Array([1, 1]),
	    new Uint8Array([0, 3]),
	    new Uint8Array([1, 3]),
	    new Uint8Array([2, 1]),
	    new Uint8Array([3, 1]),
	    new Uint8Array([2, 3]),
	    new Uint8Array([3, 3]),
	];

	// tslint:disable cyclomatic-complexity
	class SMAAUtils {
	}
	/**
	 * A box.
	 */
	SMAAUtils.b0 = new three.Box2();
	/**
	 * A box.
	 */
	SMAAUtils.b1 = new three.Box2();
	/**
	 * Calculates the bilinear fetch for a certain edge combination.
	 *
	 *     e[0]       e[1]
	 *
	 *              x <-------- Sample Position: (-0.25, -0.125)
	 *     e[2]       e[3] <--- Current Pixel [3]: (0.0, 0.0)
	 *
	 * @param e - The edge combination.
	 * @return The interpolated value.
	 */
	SMAAUtils.bilinear = (e) => {
	    const a = SMAAUtils.lerp(e[0], e[1], 1.0 - 0.25);
	    const b = SMAAUtils.lerp(e[2], e[3], 1.0 - 0.25);
	    return SMAAUtils.lerp(a, b, 1.0 - 0.125);
	};
	/**
	 * Computes the delta distance to add in the last step of searches to the left.
	 * @param left - The left edge combination.
	 * @param top - The top edge combination.
	 * @return The left delta distance.
	 */
	SMAAUtils.deltaLeft = (left, top) => {
	    let d = 0;
	    // If there is an edge, continue.
	    if (top[3] === 1) {
	        d += 1;
	    }
	    /* If an edge was previously found, there is another edge and there are no
	    crossing edges, continue. */
	    if (d === 1 && top[2] === 1 && left[1] !== 1 && left[3] !== 1) {
	        d += 1;
	    }
	    return d;
	};
	/**
	 * Computes the delta distance to add in the last step of searches to the right.
	 * @param left - The left edge combination.
	 * @param top - The top edge combination.
	 * @return The right delta distance.
	 */
	SMAAUtils.deltaRight = (left, top) => {
	    let d = 0;
	    // If there is an edge, and no crossing edges, continue.
	    if (top[3] === 1 && left[1] !== 1 && left[3] !== 1) {
	        d += 1;
	    }
	    /* If an edge was previously found, there is another edge and there are no
	    crossing edges, continue. */
	    if (d === 1 && top[2] === 1 && left[0] !== 1 && left[2] !== 1) {
	        d += 1;
	    }
	    return d;
	};
	/**
	 * Linearly interpolates between two values.
	 * @param a - The initial value.
	 * @param b - The target value.
	 * @param p - The interpolation value.
	 * @return The interpolated value.
	 */
	SMAAUtils.lerp = (a, b, p) => {
	    return a + (b - a) * p;
	};
	/**
	 * Clamps a value to the range [0, 1].
	 * @param a - The value.
	 * @return The saturated value.
	 */
	SMAAUtils.saturate = (a) => {
	    return Math.min(Math.max(a, 0.0), 1.0);
	};
	/**
	 * A smoothing static readonly for =  small U-patterns=> .
	 *
	 * @param d - A smoothing factor.
	 * @param b - The area that should be smoothed.
	 * @return The smoothed area.
	 */
	SMAAUtils.smoothArea = (d, b) => {
	    const a1 = b.min;
	    const a2 = b.max;
	    const b1X = Math.sqrt(a1.x * 2.0) * 0.5;
	    const b1Y = Math.sqrt(a1.y * 2.0) * 0.5;
	    const b2X = Math.sqrt(a2.x * 2.0) * 0.5;
	    const b2Y = Math.sqrt(a2.y * 2.0) * 0.5;
	    const p = SMAAUtils.saturate(d / SMOOTH_MAX_DISTANCE);
	    a1.set(SMAAUtils.lerp(b1X, a1.x, p), SMAAUtils.lerp(b1Y, a1.y, p));
	    a2.set(SMAAUtils.lerp(b2X, a2.x, p), SMAAUtils.lerp(b2Y, a2.y, p));
	    return b;
	};
	/**
	 * Calculates the area under the line p1 -> p2, for the pixels (x, x + 1).
	 *
	 * @param p1 - The starting point of the line.
	 * @param p2 - The ending point of the line.
	 * @param x - The pixel index.
	 * @param result - A target vector to store the area in.
	 * @return The area.
	 */
	SMAAUtils.calculateOrthogonalArea = (p1, p2, x, result) => {
	    const dX = p2.x - p1.x;
	    const dY = p2.y - p1.y;
	    const x1 = x;
	    const x2 = x + 1.0;
	    const y1 = p1.y + dY * (x1 - p1.x) / dX;
	    const y2 = p1.y + dY * (x2 - p1.x) / dX;
	    let a;
	    let a1;
	    let a2;
	    let t;
	    // Check if x is inside the area.
	    if ((x1 >= p1.x && x1 < p2.x) || (x2 > p1.x && x2 <= p2.x)) {
	        // Check if this is a trapezoid.
	        if (Math.sign(y1) === Math.sign(y2) || Math.abs(y1) < 1e-4 || Math.abs(y2) < 1e-4) {
	            a = (y1 + y2) / 2.0;
	            if (a < 0.0) {
	                result.set(Math.abs(a), 0.0);
	            }
	            else {
	                result.set(0.0, Math.abs(a));
	            }
	        }
	        else {
	            // Two triangles.
	            t = -p1.y * dX / dY + p1.x;
	            a1 = (t > p1.x) ? y1 * (t - Math.trunc(t)) / 2.0 : 0.0;
	            a2 = (t < p2.x) ? y2 * (1.0 - (t - Math.trunc(t))) / 2.0 : 0.0;
	            a = (Math.abs(a1) > Math.abs(a2)) ? a1 : -a2;
	            if (a < 0.0) {
	                result.set(Math.abs(a1), Math.abs(a2));
	            }
	            else {
	                result.set(Math.abs(a2), Math.abs(a1));
	            }
	        }
	    }
	    else {
	        result.set(0, 0);
	    }
	    return result;
	};
	/**
	 * Calculates the area for a given pattern and distances to the left and to the
	 * right, biased by an offset.
	 *
	 * @param pattern - A pattern index.
	 * @param left - The left distance.
	 * @param right - The right distance.
	 * @param offset - An offset.
	 * @param result - A target vector to store the area in.
	 * @return The orthogonal area.
	 */
	SMAAUtils.calculateOrthogonalAreaForPattern = (pattern, left, right, offset, result) => {
	    const p1 = SMAAUtils.b0.min;
	    const p2 = SMAAUtils.b0.max;
	    const a1 = SMAAUtils.b1.min;
	    const a2 = SMAAUtils.b1.max;
	    const a = SMAAUtils.b1;
	    /* o1           |
	     *      .-------´
	     * o2   |
	     *
	     *      <---d--->
	     */
	    const o1 = 0.5 + offset;
	    const o2 = 0.5 + offset - 1.0;
	    const d = left + right + 1;
	    switch (pattern) {
	        case 0: {
	            //    ------
	            result.set(0, 0);
	            break;
	        }
	        case 1: {
	            /*   .------
	             *   |
	             *
	             * The offset is only applied to L patterns in the crossing edge side to
	             * make it converge with the unfiltered pattern 0.
	             * The pattern 0 must not be filtered to avoid artifacts.
	             */
	            if (left <= right) {
	                SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d / 2.0, 0.0), left, result);
	            }
	            else {
	                result.set(0, 0);
	            }
	            break;
	        }
	        case 2: {
	            /*    ------.
	             *          |
	             */
	            if (left >= right) {
	                SMAAUtils.calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o2), left, result);
	            }
	            else {
	                result.set(0, 0);
	            }
	            break;
	        }
	        case 3: {
	            /*   .------.
	             *   |      |
	             */
	            SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d / 2.0, 0.0), left, a1);
	            SMAAUtils.calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o2), left, a2);
	            SMAAUtils.smoothArea(d, a);
	            result.addVectors(a1, a2);
	            break;
	        }
	        case 4: {
	            /*   |
	             *   `------
	             */
	            if (left <= right) {
	                SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d / 2.0, 0.0), left, result);
	            }
	            else {
	                result.set(0, 0);
	            }
	            break;
	        }
	        case 5: {
	            /*   |
	             *   +------
	             *   |
	             */
	            result.set(0, 0);
	            break;
	        }
	        case 6: {
	            /*   |
	             *   `------.
	             *          |
	             *
	             * A problem of not offseting L patterns (see above) is that for certain
	             * max search distances, the pixels in the center of a Z pattern will
	             * detect the full Z pattern, while the pixels in the sides will detect an
	             * L pattern. To avoid discontinuities, the full offsetted Z
	             * revectorization is blended with partially offsetted L patterns.
	             */
	            if (Math.abs(offset) > 0.0) {
	                SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d, o2), left, a1);
	                SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d / 2.0, 0.0), left, a2);
	                a2.add(SMAAUtils.calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o2), left, result));
	                result.addVectors(a1, a2).divideScalar(2.0);
	            }
	            else {
	                SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d, o2), left, result);
	            }
	            break;
	        }
	        case 7: {
	            /*   |
	             *   +------.
	             *   |      |
	             */
	            SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d, o2), left, result);
	            break;
	        }
	        case 8: {
	            /*          |
	             *    ------´
	             */
	            if (left >= right) {
	                SMAAUtils.calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o1), left, result);
	            }
	            else {
	                result.set(0, 0);
	            }
	            break;
	        }
	        case 9: {
	            /*          |
	             *   .------´
	             *   |
	             */
	            if (Math.abs(offset) > 0.0) {
	                SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d, o1), left, a1);
	                SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d / 2.0, 0.0), left, a2);
	                a2.add(SMAAUtils.calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o1), left, result));
	                result.addVectors(a1, a2).divideScalar(2.0);
	            }
	            else {
	                SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d, o1), left, result);
	            }
	            break;
	        }
	        case 10: {
	            /*          |
	             *    ------+
	             *          |
	             */
	            result.set(0, 0);
	            break;
	        }
	        case 11: {
	            /*          |
	             *   .------+
	             *   |      |
	             */
	            SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d, o1), left, result);
	            break;
	        }
	        case 12: {
	            /*   |      |
	             *   `------´
	             */
	            SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d / 2.0, 0.0), left, a1);
	            SMAAUtils.calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o1), left, a2);
	            SMAAUtils.smoothArea(d, a);
	            result.addVectors(a1, a2);
	            break;
	        }
	        case 13: {
	            /*   |      |
	             *   +------´
	             *   |
	             */
	            SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d, o1), left, result);
	            break;
	        }
	        case 14: {
	            /*   |      |
	             *   `------+
	             *          |
	             */
	            SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d, o2), left, result);
	            break;
	        }
	        case 15: {
	            /*   |      |
	             *   +------+
	             *   |      |
	             */
	            result.set(0, 0);
	            break;
	        }
	    }
	    return result;
	};
	/**
	 * Determines whether the given pixel is inside the specified area.
	 *
	 * @param p1 - The lower bounds of the area.
	 * @param p2 - The upper bounds of the area.
	 * @param x - The X-coordinates.
	 * @param y - The Y-coordinates.
	 * @return Whether the pixel lies inside the area.
	 */
	SMAAUtils.isInsideArea = (p1, p2, x, y) => {
	    let result = p1.equals(p2);
	    let xm;
	    let ym;
	    let a;
	    let b;
	    let c;
	    if (!result) {
	        xm = (p1.x + p2.x) / 2.0;
	        ym = (p1.y + p2.y) / 2.0;
	        a = p2.y - p1.y;
	        b = p1.x - p2.x;
	        c = a * (x - xm) + b * (y - ym);
	        result = (c > 0.0);
	    }
	    return result;
	};
	/**
	 * Calculates the area under the line p1 -> p2 for the pixel p using brute force
	 * sampling.
	 *
	 * @param p1 - The lower bounds of the area.
	 * @param p2 - The upper bounds of the area.
	 * @param pX - The X-coordinates.
	 * @param pY - The Y-coordinates.
	 * @return The amount of pixels inside the area relative to the total amount of sampled pixels.
	 */
	SMAAUtils.calculateDiagonalAreaForPixel = (p1, p2, pX, pY) => {
	    let a;
	    let x;
	    let y;
	    let offsetX;
	    let offsetY;
	    // tslint:disable-next-line:ban-comma-operator
	    for (a = 0, y = 0; y < DIAGONAL_SAMPLES; ++y) {
	        for (x = 0; x < DIAGONAL_SAMPLES; ++x) {
	            offsetX = x / (DIAGONAL_SAMPLES - 1.0);
	            offsetY = y / (DIAGONAL_SAMPLES - 1.0);
	            if (SMAAUtils.isInsideArea(p1, p2, pX + offsetX, pY + offsetY)) {
	                ++a;
	            }
	        }
	    }
	    return a / (DIAGONAL_SAMPLES * DIAGONAL_SAMPLES);
	};
	/**
	 * Calculates the area under the line p1 -> p2. This includes the pixel and its
	 * opposite.
	 *
	 * @param pattern - A pattern index.
	 * @param p1 - The lower bounds of the area.
	 * @param p2 - The upper bounds of the area.
	 * @param left - The left distance.
	 * @param offset - An offset.
	 * @param result - A target vector to store the area in.
	 * @return The area.
	 */
	SMAAUtils.calculateDiagonalArea = (pattern, p1, p2, left, offset, result) => {
	    const e = DIAGONAL_EDGES[pattern];
	    const e1 = e[0];
	    const e2 = e[1];
	    if (e1 > 0) {
	        p1.x += offset[0];
	        p1.y += offset[1];
	    }
	    if (e2 > 0) {
	        p2.x += offset[0];
	        p2.y += offset[1];
	    }
	    return result.set(1.0 - SMAAUtils.calculateDiagonalAreaForPixel(p1, p2, 1.0 + left, 0.0 + left), SMAAUtils.calculateDiagonalAreaForPixel(p1, p2, 1.0 + left, 1.0 + left));
	};
	/**
	 * Calculates the area for a given pattern and distances to the left and to the
	 * right, biased by an offset.
	 *
	 * @param pattern - A pattern index.
	 * @param left - The left distance.
	 * @param right - The right distance.
	 * @param offset - An offset.
	 * @param result - A target vector to store the area in.
	 * @return The orthogonal area.
	 */
	SMAAUtils.calculateDiagonalAreaForPattern = (pattern, left, right, offset, result) => {
	    const p1 = SMAAUtils.b0.min;
	    const p2 = SMAAUtils.b0.max;
	    const a1 = SMAAUtils.b1.min;
	    const a2 = SMAAUtils.b1.max;
	    const d = left + right + 1;
	    /* There is some Black Magic involved in the diagonal area calculations.
	     *
	     * Unlike orthogonal patterns, the "null" pattern (one without crossing edges)
	     * must be filtered, and the ends of both the "null" and L patterns are not
	     * known: L and U patterns have different endings, and the adjacent pattern is
	     * unknown. Therefore, a blend of both possibilites is computed.
	    */
	    switch (pattern) {
	        case 0: {
	            /*         .-´
	             *       .-´
	             *     .-´
	             *   .-´
	             *   ´
	             */
	            // First possibility.
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
	            // Second possibility.
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
	            // Blend both possibilities together
	            result.addVectors(a1, a2).divideScalar(2.0);
	            break;
	        }
	        case 1: {
	            /*         .-´
	             *       .-´
	             *     .-´
	             *   .-´
	             *   |
	             *   |
	             */
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(0.0 + d, 0.0 + d), left, offset, a1);
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
	            result.addVectors(a1, a2).divideScalar(2.0);
	            break;
	        }
	        case 2: {
	            /*         .----
	             *       .-´
	             *     .-´
	             *   .-´
	             *   ´
	             */
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(0.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a1);
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
	            result.addVectors(a1, a2).divideScalar(2.0);
	            break;
	        }
	        case 3: {
	            /*
	             *         .----
	             *       .-´
	             *     .-´
	             *   .-´
	             *   |
	             *   |
	             */
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, result);
	            break;
	        }
	        case 4: {
	            /*         .-´
	             *       .-´
	             *     .-´
	             * ----´
	             */
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(0.0 + d, 0.0 + d), left, offset, a1);
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
	            result.addVectors(a1, a2).divideScalar(2.0);
	            break;
	        }
	        case 5: {
	            /*         .-´
	             *       .-´
	             *     .-´
	             * --.-´
	             *   |
	             *   |
	             */
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(0.0 + d, 0.0 + d), left, offset, a1);
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
	            result.addVectors(a1, a2).divideScalar(2.0);
	            break;
	        }
	        case 6: {
	            /*         .----
	             *       .-´
	             *     .-´
	             * ----´
	             */
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 0.0 + d), left, offset, result);
	            break;
	        }
	        case 7: {
	            /*         .----
	             *       .-´
	             *     .-´
	             * --.-´
	             *   |
	             *   |
	             */
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 0.0 + d), left, offset, a1);
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
	            result.addVectors(a1, a2).divideScalar(2.0);
	            break;
	        }
	        case 8: {
	            /*         |
	             *         |
	             *       .-´
	             *     .-´
	             *   .-´
	             *   ´
	             */
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(0.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a2);
	            result.addVectors(a1, a2).divideScalar(2.0);
	            break;
	        }
	        case 9: {
	            /*         |
	             *         |
	             *       .-´
	             *     .-´
	             *   .-´
	             *   |
	             *   |
	             */
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, result);
	            break;
	        }
	        case 10: {
	            /*         |
	             *         .----
	             *       .-´
	             *     .-´
	             *   .-´
	             *   ´
	             */
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(0.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
	            result.addVectors(a1, a2).divideScalar(2.0);
	            break;
	        }
	        case 11: {
	            /*         |
	             *         .----
	             *       .-´
	             *     .-´
	             *   .-´
	             *   |
	             *   |
	             */
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
	            result.addVectors(a1, a2).divideScalar(2.0);
	            break;
	        }
	        case 12: {
	            /*         |
	             *         |
	             *       .-´
	             *     .-´
	             * ----´
	             */
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, result);
	            break;
	        }
	        case 13: {
	            /*         |
	             *         |
	             *       .-´
	             *     .-´
	             * --.-´
	             *   |
	             *   |
	             */
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a2);
	            result.addVectors(a1, a2).divideScalar(2.0);
	            break;
	        }
	        case 14: {
	            /*         |
	             *         .----
	             *       .-´
	             *     .-´
	             * ----´
	             */
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
	            result.addVectors(a1, a2).divideScalar(2.0);
	            break;
	        }
	        case 15: {
	            /*         |
	             *         .----
	             *       .-´
	             *     .-´
	             * --.-´
	             *   |
	             *   |
	             */
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
	            SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
	            result.addVectors(a1, a2).divideScalar(2.0);
	            break;
	        }
	    }
	    return result;
	};
	/**
	 * Calculates orthogonal or diagonal patterns for a given offset.
	 *
	 * @param patterns - The patterns to assemble.
	 * @param offset - A pattern offset. Diagonal offsets are pairs.
	 * @param orthogonal - Whether the patterns are orthogonal or diagonal.
	 */
	SMAAUtils.generatePatterns = (patterns, offset, orthogonal) => {
	    const result = new three.Vector2();
	    let i;
	    let l;
	    let x;
	    let y;
	    let c;
	    let pattern;
	    let data;
	    let size;
	    // tslint:disable-next-line:ban-comma-operator
	    for (i = 0, l = patterns.length; i < l; ++i) {
	        pattern = patterns[i];
	        data = pattern.data;
	        size = pattern.width;
	        for (y = 0; y < size; ++y) {
	            for (x = 0; x < size; ++x) {
	                if (orthogonal && typeof offset === 'number') {
	                    SMAAUtils.calculateOrthogonalAreaForPattern(i, x, y, offset, result);
	                }
	                else {
	                    SMAAUtils.calculateDiagonalAreaForPattern(i, x, y, offset, result);
	                }
	                c = (y * size + x) * 2;
	                data[c] = result.x * 255;
	                data[c + 1] = result.y * 255;
	            }
	        }
	    }
	};

	// tslint:disable cyclomatic-complexity

	/**
	 * SMAA search image data.
	 *
	 * This image stores information about how many pixels the line search
	 * algorithm must advance in the last step.
	 *
	 * Based on the official python scripts:
	 * https://github.com/iryoku/smaa/tree/master/Scripts
	 */
	class SMAASearchImageData {
	    /**
	     * Creates a new search image.
	     * @return The generated image data.
	     */
	    static generate() {
	        const width = 66;
	        const height = 33;
	        const croppedWidth = 64;
	        const croppedHeight = 16;
	        const data = new Uint8ClampedArray(width * height);
	        const croppedData = new Uint8ClampedArray(croppedWidth * croppedHeight);
	        let x;
	        let y;
	        let s;
	        let t;
	        let i;
	        let e1;
	        let e2;
	        // Calculate delta distances.
	        for (y = 0; y < height; ++y) {
	            for (x = 0; x < width; ++x) {
	                s = 0.03125 * x;
	                t = 0.03125 * y;
	                if (SMAASearchImageData.edges.has(s) && SMAASearchImageData.edges.has(t)) {
	                    e1 = SMAASearchImageData.edges.get(s);
	                    e2 = SMAASearchImageData.edges.get(t);
	                    // Maximize the dynamic range to help the compression.
	                    data[y * width + x] = (127 * SMAAUtils.deltaLeft(e1, e2));
	                    data[y * width + x + (width / 2)] = (127 * SMAAUtils.deltaRight(e1, e2));
	                }
	            }
	        }
	        // Crop the result to powers-of-two to make it BC4-friendly.
	        // tslint:disable-next-line:ban-comma-operator
	        for (i = 0, y = height - croppedHeight; y < height; ++y) {
	            for (x = 0; x < croppedWidth; ++x, ++i) {
	                croppedData[i] = data[y * width + x];
	            }
	        }
	        return new RawImageData(croppedWidth, croppedHeight, croppedData, 1);
	    }
	}
	/**
	 * This dictionary returns which edges are active for a certain bilinear fetch:
	 * it's the reverse lookup of the bilinear function.
	 */
	SMAASearchImageData.edges = new Map([
	    [SMAAUtils.bilinear([0, 0, 0, 0]), [0, 0, 0, 0]],
	    [SMAAUtils.bilinear([0, 0, 0, 1]), [0, 0, 0, 1]],
	    [SMAAUtils.bilinear([0, 0, 1, 0]), [0, 0, 1, 0]],
	    [SMAAUtils.bilinear([0, 0, 1, 1]), [0, 0, 1, 1]],
	    [SMAAUtils.bilinear([0, 1, 0, 0]), [0, 1, 0, 0]],
	    [SMAAUtils.bilinear([0, 1, 0, 1]), [0, 1, 0, 1]],
	    [SMAAUtils.bilinear([0, 1, 1, 0]), [0, 1, 1, 0]],
	    [SMAAUtils.bilinear([0, 1, 1, 1]), [0, 1, 1, 1]],
	    [SMAAUtils.bilinear([1, 0, 0, 0]), [1, 0, 0, 0]],
	    [SMAAUtils.bilinear([1, 0, 0, 1]), [1, 0, 0, 1]],
	    [SMAAUtils.bilinear([1, 0, 1, 0]), [1, 0, 1, 0]],
	    [SMAAUtils.bilinear([1, 0, 1, 1]), [1, 0, 1, 1]],
	    [SMAAUtils.bilinear([1, 1, 0, 0]), [1, 1, 0, 0]],
	    [SMAAUtils.bilinear([1, 1, 0, 1]), [1, 1, 0, 1]],
	    [SMAAUtils.bilinear([1, 1, 1, 0]), [1, 1, 1, 0]],
	    [SMAAUtils.bilinear([1, 1, 1, 1]), [1, 1, 1, 1]],
	]);

	/**
	 * An enumeration of control actions.
	 *
	 * This enum can be used to bind keys to specific control actions.
	 *
	 * @type {Object}
	 * @property {Number} MOVE_FORWARD - Move forward.
	 * @property {Number} MOVE_LEFT - Move left.
	 * @property {Number} MOVE_BACKWARD - Move backward.
	 * @property {Number} MOVE_RIGHT - Move right.
	 * @property {Number} MOVE_DOWN - Move down.
	 * @property {Number} MOVE_UP - Move up.
	 * @property {Number} ZOOM_OUT - Zoom out.
	 * @property {Number} ZOOM_IN - Zoom in.
	 */

	const Action = {

		MOVE_FORWARD: 0,
		MOVE_LEFT: 1,
		MOVE_BACKWARD: 2,
		MOVE_RIGHT: 3,
		MOVE_DOWN: 4,
		MOVE_UP: 5,
		ZOOM_OUT: 6,
		ZOOM_IN: 7

	};

	/**
	 * A vector with three components.
	 */

	class Vector3 {

		/**
		 * Constructs a new vector.
		 *
		 * @param {Number} [x=0] - The X component.
		 * @param {Number} [y=0] - The Y component.
		 * @param {Number} [z=0] - The Z component.
		 */

		constructor(x = 0, y = 0, z = 0) {

			/**
			 * The X component.
			 *
			 * @type {Number}
			 */

			this.x = x;

			/**
			 * The Y component.
			 *
			 * @type {Number}
			 */

			this.y = y;

			/**
			 * The Z component.
			 *
			 * @type {Number}
			 */

			this.z = z;

		}

		/**
		 * Sets the values of this vector
		 *
		 * @param {Number} x - The X component.
		 * @param {Number} y - The Y component.
		 * @param {Number} z - The Z component.
		 * @return {Vector3} This vector.
		 */

		set(x, y, z) {

			this.x = x;
			this.y = y;
			this.z = z;

			return this;

		}

		/**
		 * Copies the values of another vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		copy(v) {

			this.x = v.x;
			this.y = v.y;
			this.z = v.z;

			return this;

		}

		/**
		 * Clones this vector.
		 *
		 * @return {Vector3} A clone of this vector.
		 */

		clone() {

			return new this.constructor(this.x, this.y, this.z);

		}

		/**
		 * Copies values from an array.
		 *
		 * @param {Number[]} array - An array.
		 * @param {Number} offset - An offset.
		 * @return {Vector3} This vector.
		 */

		fromArray(array, offset = 0) {

			this.x = array[offset];
			this.y = array[offset + 1];
			this.z = array[offset + 2];

			return this;

		}

		/**
		 * Stores this vector in an array.
		 *
		 * @param {Array} [array] - A target array.
		 * @param {Number} offset - An offset.
		 * @return {Number[]} The array.
		 */

		toArray(array = [], offset = 0) {

			array[offset] = this.x;
			array[offset + 1] = this.y;
			array[offset + 2] = this.z;

			return array;

		}

		/**
		 * Sets the values of this vector based on a spherical description.
		 *
		 * @param {Spherical} s - A spherical description.
		 * @return {Vector3} This vector.
		 */

		setFromSpherical(s) {

			this.setFromSphericalCoords(s.radius, s.phi, s.theta);

		}

		/**
		 * Sets the values of this vector based on spherical coordinates.
		 *
		 * @param {Number} radius - The radius.
		 * @param {Number} phi - The polar angle.
		 * @param {Number} theta - The angle around the equator of the sphere.
		 * @return {Vector3} This vector.
		 */

		setFromSphericalCoords(radius, phi, theta) {

			const sinPhiRadius = Math.sin(phi) * radius;

			this.x = sinPhiRadius * Math.sin(theta);
			this.y = Math.cos(phi) * radius;
			this.z = sinPhiRadius * Math.cos(theta);

			return this;

		}

		/**
		 * Sets the values of this vector based on a cylindrical description.
		 *
		 * @param {Cylindrical} c - A cylindrical description.
		 * @return {Vector3} This vector.
		 */

		setFromCylindrical(c) {

			this.setFromCylindricalCoords(c.radius, c.theta, c.y);

		}

		/**
		 * Sets the values of this vector based on cylindrical coordinates.
		 *
		 * @param {Number} radius - The radius.
		 * @param {Number} theta - Theta.
		 * @param {Number} y - The height.
		 * @return {Vector3} This vector.
		 */

		setFromCylindricalCoords(radius, theta, y) {

			this.x = radius * Math.sin(theta);
			this.y = y;
			this.z = radius * Math.cos(theta);

			return this;

		}

		/**
		 * Copies the values of a matrix column.
		 *
		 * @param {Matrix4} m - A 4x4 matrix.
		 * @param {Number} index - A column index of the range [0, 2].
		 * @return {Vector3} This vector.
		 */

		setFromMatrixColumn(m, index) {

			return this.fromArray(m.elements, index * 4);

		}

		/**
		 * Extracts the position from a matrix.
		 *
		 * @param {Matrix4} m - A 4x4 matrix.
		 * @return {Vector3} This vector.
		 */

		setFromMatrixPosition(m) {

			const me = m.elements;

			this.x = me[12];
			this.y = me[13];
			this.z = me[14];

			return this;

		}

		/**
		 * Extracts the scale from a matrix.
		 *
		 * @param {Matrix4} m - A 4x4 matrix.
		 * @return {Vector3} This vector.
		 */

		setFromMatrixScale(m) {

			const sx = this.setFromMatrixColumn(m, 0).length();
			const sy = this.setFromMatrixColumn(m, 1).length();
			const sz = this.setFromMatrixColumn(m, 2).length();

			this.x = sx;
			this.y = sy;
			this.z = sz;

			return this;

		}

		/**
		 * Adds a vector to this one.
		 *
		 * @param {Vector3} v - The vector to add.
		 * @return {Vector3} This vector.
		 */

		add(v) {

			this.x += v.x;
			this.y += v.y;
			this.z += v.z;

			return this;

		}

		/**
		 * Adds a scalar to this vector.
		 *
		 * @param {Number} s - The scalar to add.
		 * @return {Vector3} This vector.
		 */

		addScalar(s) {

			this.x += s;
			this.y += s;
			this.z += s;

			return this;

		}

		/**
		 * Sets this vector to the sum of two given vectors.
		 *
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - Another vector.
		 * @return {Vector3} This vector.
		 */

		addVectors(a, b) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;
			this.z = a.z + b.z;

			return this;

		}

		/**
		 * Adds a scaled vector to this one.
		 *
		 * @param {Vector3} v - The vector to scale and add.
		 * @param {Number} s - A scalar.
		 * @return {Vector3} This vector.
		 */

		addScaledVector(v, s) {

			this.x += v.x * s;
			this.y += v.y * s;
			this.z += v.z * s;

			return this;

		}

		/**
		 * Subtracts a vector from this vector.
		 *
		 * @param {Vector3} v - The vector to subtract.
		 * @return {Vector3} This vector.
		 */

		sub(v) {

			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;

			return this;

		}

		/**
		 * Subtracts a scalar from this vector.
		 *
		 * @param {Number} s - The scalar to subtract.
		 * @return {Vector3} This vector.
		 */

		subScalar(s) {

			this.x -= s;
			this.y -= s;
			this.z -= s;

			return this;

		}

		/**
		 * Sets this vector to the difference between two given vectors.
		 *
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - A second vector.
		 * @return {Vector3} This vector.
		 */

		subVectors(a, b) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;

			return this;

		}

		/**
		 * Multiplies this vector with another vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		multiply(v) {

			this.x *= v.x;
			this.y *= v.y;
			this.z *= v.z;

			return this;

		}

		/**
		 * Multiplies this vector with a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Vector3} This vector.
		 */

		multiplyScalar(s) {

			this.x *= s;
			this.y *= s;
			this.z *= s;

			return this;

		}

		/**
		 * Sets this vector to the product of two given vectors.
		 *
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - Another vector.
		 * @return {Vector3} This vector.
		 */

		multiplyVectors(a, b) {

			this.x = a.x * b.x;
			this.y = a.y * b.y;
			this.z = a.z * b.z;

			return this;

		}

		/**
		 * Divides this vector by another vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		divide(v) {

			this.x /= v.x;
			this.y /= v.y;
			this.z /= v.z;

			return this;

		}

		/**
		 * Divides this vector by a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Vector3} This vector.
		 */

		divideScalar(s) {

			this.x /= s;
			this.y /= s;
			this.z /= s;

			return this;

		}

		/**
		 * Sets this vector to the cross product of the given vectors.
		 *
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - Another vector.
		 * @return {Vector3} This vector.
		 */

		crossVectors(a, b) {

			const ax = a.x, ay = a.y, az = a.z;
			const bx = b.x, by = b.y, bz = b.z;

			this.x = ay * bz - az * by;
			this.y = az * bx - ax * bz;
			this.z = ax * by - ay * bx;

			return this;

		}

		/**
		 * Calculates the cross product of this vector and the given one.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		cross(v) {

			return this.crossVectors(this, v);

		}

		/**
		 * Applies a matrix to this direction vector.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Vector3} This vector.
		 */

		transformDirection(m) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[0] * x + e[4] * y + e[8] * z;
			this.y = e[1] * x + e[5] * y + e[9] * z;
			this.z = e[2] * x + e[6] * y + e[10] * z;

			return this.normalize();

		}

		/**
		 * Applies a matrix to this vector.
		 *
		 * @param {Matrix3} m - A matrix.
		 * @return {Vector3} This vector.
		 */

		applyMatrix3(m) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[0] * x + e[3] * y + e[6] * z;
			this.y = e[1] * x + e[4] * y + e[7] * z;
			this.z = e[2] * x + e[5] * y + e[8] * z;

			return this;

		}

		/**
		 * Applies a matrix to this vector.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Vector3} This vector.
		 */

		applyMatrix4(m) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
			this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
			this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

			return this;

		}

		/**
		 * Applies a quaternion to this vector.
		 *
		 * @param {Quaternion} q - A quaternion.
		 * @return {Vector3} This vector.
		 */

		applyQuaternion(q) {

			const x = this.x, y = this.y, z = this.z;
			const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

			// Calculate: quaternion * vector.
			const ix = qw * x + qy * z - qz * y;
			const iy = qw * y + qz * x - qx * z;
			const iz = qw * z + qx * y - qy * x;
			const iw = -qx * x - qy * y - qz * z;

			// Calculate: result * inverse quaternion.
			this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
			this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
			this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

			return this;

		}

		/**
		 * Negates this vector.
		 *
		 * @return {Vector3} This vector.
		 */

		negate() {

			this.x = -this.x;
			this.y = -this.y;
			this.z = -this.z;

			return this;

		}

		/**
		 * Calculates the dot product with another vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Number} The dot product.
		 */

		dot(v) {

			return this.x * v.x + this.y * v.y + this.z * v.z;

		}

		/**
		 * Reflects this vector. The given plane normal is assumed to be normalized.
		 *
		 * @param {Vector3} n - A normal.
		 * @return {Vector3} This vector.
		 */

		reflect(n) {

			const nx = n.x;
			const ny = n.y;
			const nz = n.z;

			this.sub(n.multiplyScalar(2 * this.dot(n)));

			// Restore the normal.
			n.set(nx, ny, nz);

			return this;

		}

		/**
		 * Computes the angle to the given vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Number} The angle in radians.
		 */

		angleTo(v) {

			const theta = this.dot(v) / (Math.sqrt(this.lengthSquared() * v.lengthSquared()));

			// Clamp to avoid numerical problems.
			return Math.acos(Math.min(Math.max(theta, -1), 1));

		}

		/**
		 * Calculates the Manhattan length of this vector.
		 *
		 * @return {Number} The length.
		 */

		manhattanLength() {

			return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);

		}

		/**
		 * Calculates the squared length of this vector.
		 *
		 * @return {Number} The squared length.
		 */

		lengthSquared() {

			return this.x * this.x + this.y * this.y + this.z * this.z;

		}

		/**
		 * Calculates the length of this vector.
		 *
		 * @return {Number} The length.
		 */

		length() {

			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

		}

		/**
		 * Calculates the Manhattan distance to a given vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Number} The distance.
		 */

		manhattanDistanceTo(v) {

			return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);

		}

		/**
		 * Calculates the squared distance to a given vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Number} The squared distance.
		 */

		distanceToSquared(v) {

			const dx = this.x - v.x;
			const dy = this.y - v.y;
			const dz = this.z - v.z;

			return dx * dx + dy * dy + dz * dz;

		}

		/**
		 * Calculates the distance to a given vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Number} The distance.
		 */

		distanceTo(v) {

			return Math.sqrt(this.distanceToSquared(v));

		}

		/**
		 * Normalizes this vector.
		 *
		 * @return {Vector3} This vector.
		 */

		normalize() {

			return this.divideScalar(this.length());

		}

		/**
		 * Sets the length of this vector.
		 *
		 * @param {Number} length - The new length.
		 * @return {Vector3} This vector.
		 */

		setLength(length) {

			return this.normalize().multiplyScalar(length);

		}

		/**
		 * Adopts the min value for each component of this vector and the given one.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		min(v) {

			this.x = Math.min(this.x, v.x);
			this.y = Math.min(this.y, v.y);
			this.z = Math.min(this.z, v.z);

			return this;

		}

		/**
		 * Adopts the max value for each component of this vector and the given one.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		max(v) {

			this.x = Math.max(this.x, v.x);
			this.y = Math.max(this.y, v.y);
			this.z = Math.max(this.z, v.z);

			return this;

		}

		/**
		 * Clamps this vector.
		 *
		 * @param {Vector3} min - The lower bounds. Assumed to be smaller than max.
		 * @param {Vector3} max - The upper bounds. Assumed to be greater than min.
		 * @return {Vector3} This vector.
		 */

		clamp(min, max) {

			this.x = Math.max(min.x, Math.min(max.x, this.x));
			this.y = Math.max(min.y, Math.min(max.y, this.y));
			this.z = Math.max(min.z, Math.min(max.z, this.z));

			return this;

		}

		/**
		 * Floors this vector.
		 *
		 * @return {Vector3} This vector.
		 */

		floor() {

			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);
			this.z = Math.floor(this.z);

			return this;

		}

		/**
		 * Ceils this vector.
		 *
		 * @return {Vector3} This vector.
		 */

		ceil() {

			this.x = Math.ceil(this.x);
			this.y = Math.ceil(this.y);
			this.z = Math.ceil(this.z);

			return this;

		}

		/**
		 * Rounds this vector.
		 *
		 * @return {Vector3} This vector.
		 */

		round() {

			this.x = Math.round(this.x);
			this.y = Math.round(this.y);
			this.z = Math.round(this.z);

			return this;

		}

		/**
		 * Lerps towards the given vector.
		 *
		 * @param {Vector3} v - The target vector.
		 * @param {Number} alpha - The lerp factor.
		 * @return {Vector3} This vector.
		 */

		lerp(v, alpha) {

			this.x += (v.x - this.x) * alpha;
			this.y += (v.y - this.y) * alpha;
			this.z += (v.z - this.z) * alpha;

			return this;

		}

		/**
		 * Sets this vector to the lerp result of the given vectors.
		 *
		 * @param {Vector3} v1 - A base vector.
		 * @param {Vector3} v2 - The target vector.
		 * @param {Number} alpha - The lerp factor.
		 * @return {Vector3} This vector.
		 */

		lerpVectors(v1, v2, alpha) {

			return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

		}

		/**
		 * Checks if this vector equals the given one.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Boolean} Whether this vector equals the given one.
		 */

		equals(v) {

			return (v.x === this.x && v.y === this.y && v.z === this.z);

		}

	}

	/**
	 * A vector with two components.
	 */

	class Vector2 {

		/**
		 * Constructs a new vector.
		 *
		 * @param {Number} [x=0] - The X component.
		 * @param {Number} [y=0] - The Y component.
		 */

		constructor(x = 0, y = 0) {

			/**
			 * The X component.
			 *
			 * @type {Number}
			 */

			this.x = x;

			/**
			 * The Y component.
			 *
			 * @type {Number}
			 */

			this.y = y;

		}

		/**
		 * The width. This is an alias for X.
		 *
		 * @type {Number}
		 */

		get width() {

			return this.x;

		}

		/**
		 * Sets the width.
		 *
		 * @type {Number}
		 */

		set width(value) {

			return this.x = value;

		}

		/**
		 * The height. This is an alias for Y.
		 *
		 * @type {Number}
		 */

		get height() {

			return this.y;

		}

		/**
		 * Sets the height.
		 *
		 * @type {Number}
		 */

		set height(value) {

			return this.y = value;

		}

		/**
		 * Sets the values of this vector
		 *
		 * @param {Number} x - The X component.
		 * @param {Number} y - The Y component.
		 * @return {Vector2} This vector.
		 */

		set(x, y) {

			this.x = x;
			this.y = y;

			return this;

		}

		/**
		 * Copies the values of another vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Vector2} This vector.
		 */

		copy(v) {

			this.x = v.x;
			this.y = v.y;

			return this;

		}

		/**
		 * Clones this vector.
		 *
		 * @return {Vector2} A clone of this vector.
		 */

		clone() {

			return new this.constructor(this.x, this.y);

		}

		/**
		 * Copies values from an array.
		 *
		 * @param {Number[]} array - An array.
		 * @param {Number} offset - An offset.
		 * @return {Vector2} This vector.
		 */

		fromArray(array, offset = 0) {

			this.x = array[offset];
			this.y = array[offset + 1];

			return this;

		}

		/**
		 * Stores this vector in an array.
		 *
		 * @param {Array} [array] - A target array.
		 * @param {Number} offset - An offset.
		 * @return {Number[]} The array.
		 */

		toArray(array = [], offset = 0) {

			array[offset] = this.x;
			array[offset + 1] = this.y;

			return array;

		}

		/**
		 * Adds a vector to this one.
		 *
		 * @param {Vector2} v - The vector to add.
		 * @return {Vector2} This vector.
		 */

		add(v) {

			this.x += v.x;
			this.y += v.y;

			return this;

		}

		/**
		 * Adds a scalar to this vector.
		 *
		 * @param {Number} s - The scalar to add.
		 * @return {Vector2} This vector.
		 */

		addScalar(s) {

			this.x += s;
			this.y += s;

			return this;

		}

		/**
		 * Sets this vector to the sum of two given vectors.
		 *
		 * @param {Vector2} a - A vector.
		 * @param {Vector2} b - Another vector.
		 * @return {Vector2} This vector.
		 */

		addVectors(a, b) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;

			return this;

		}

		/**
		 * Adds a scaled vector to this one.
		 *
		 * @param {Vector2} v - The vector to scale and add.
		 * @param {Number} s - A scalar.
		 * @return {Vector2} This vector.
		 */

		addScaledVector(v, s) {

			this.x += v.x * s;
			this.y += v.y * s;

			return this;

		}

		/**
		 * Subtracts a vector from this vector.
		 *
		 * @param {Vector2} v - The vector to subtract.
		 * @return {Vector2} This vector.
		 */

		sub(v) {

			this.x -= v.x;
			this.y -= v.y;

			return this;

		}

		/**
		 * Subtracts a scalar from this vector.
		 *
		 * @param {Number} s - The scalar to subtract.
		 * @return {Vector2} This vector.
		 */

		subScalar(s) {

			this.x -= s;
			this.y -= s;

			return this;

		}

		/**
		 * Sets this vector to the difference between two given vectors.
		 *
		 * @param {Vector2} a - A vector.
		 * @param {Vector2} b - A second vector.
		 * @return {Vector2} This vector.
		 */

		subVectors(a, b) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;

			return this;

		}

		/**
		 * Multiplies this vector with another vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Vector2} This vector.
		 */

		multiply(v) {

			this.x *= v.x;
			this.y *= v.y;

			return this;

		}

		/**
		 * Multiplies this vector with a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Vector2} This vector.
		 */

		multiplyScalar(s) {

			this.x *= s;
			this.y *= s;

			return this;

		}

		/**
		 * Divides this vector by another vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Vector2} This vector.
		 */

		divide(v) {

			this.x /= v.x;
			this.y /= v.y;

			return this;

		}

		/**
		 * Divides this vector by a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Vector2} This vector.
		 */

		divideScalar(s) {

			this.x /= s;
			this.y /= s;

			return this;

		}

		/**
		 * Applies the given matrix to this vector.
		 *
		 * @param {Matrix3} m - A matrix.
		 * @return {Vector2} This vector.
		 */

		applyMatrix3(m) {

			const x = this.x, y = this.y;
			const e = m.elements;

			this.x = e[0] * x + e[3] * y + e[6];
			this.y = e[1] * x + e[4] * y + e[7];

			return this;

		}

		/**
		 * Calculates the dot product with another vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Number} The dot product.
		 */

		dot(v) {

			return this.x * v.x + this.y * v.y;

		}

		/**
		 * Calculates the cross product with another vector.
		 *
		 * This method calculates a scalar that would result from a regular 3D cross
		 * product of the input vectors, while taking their Z values implicitly as 0.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Number} The cross product.
		 */

		cross(v) {

			return this.x * v.y - this.y * v.x;

		}

		/**
		 * Calculates the Manhattan length of this vector.
		 *
		 * @return {Number} The length.
		 */

		manhattanLength() {

			return Math.abs(this.x) + Math.abs(this.y);

		}

		/**
		 * Calculates the squared length of this vector.
		 *
		 * @return {Number} The squared length.
		 */

		lengthSquared() {

			return this.x * this.x + this.y * this.y;

		}

		/**
		 * Calculates the length of this vector.
		 *
		 * @return {Number} The length.
		 */

		length() {

			return Math.sqrt(this.x * this.x + this.y * this.y);

		}

		/**
		 * Calculates the Manhattan distance to a given vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Number} The squared distance.
		 */

		manhattanDistanceTo(v) {

			return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);

		}

		/**
		 * Calculates the squared distance to a given vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Number} The squared distance.
		 */

		distanceToSquared(v) {

			const dx = this.x - v.x;
			const dy = this.y - v.y;

			return dx * dx + dy * dy;

		}

		/**
		 * Calculates the distance to a given vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Number} The distance.
		 */

		distanceTo(v) {

			return Math.sqrt(this.distanceToSquared(v));

		}

		/**
		 * Normalizes this vector.
		 *
		 * @return {Vector2} This vector.
		 */

		normalize() {

			return this.divideScalar(this.length());

		}

		/**
		 * Sets the length of this vector.
		 *
		 * @param {Number} length - The new length.
		 * @return {Vector2} This vector.
		 */

		setLength(length) {

			return this.normalize().multiplyScalar(length);

		}

		/**
		 * Adopts the min value for each component of this vector and the given one.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Vector2} This vector.
		 */

		min(v) {

			this.x = Math.min(this.x, v.x);
			this.y = Math.min(this.y, v.y);

			return this;

		}

		/**
		 * adopts the max value for each component of this vector and the given one.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Vector2} This vector.
		 */

		max(v) {

			this.x = Math.max(this.x, v.x);
			this.y = Math.max(this.y, v.y);

			return this;

		}

		/**
		 * Clamps this vector.
		 *
		 * @param {Vector2} min - A vector, assumed to be smaller than max.
		 * @param {Vector2} max - A vector, assumed to be greater than min.
		 * @return {Vector2} This vector.
		 */

		clamp(min, max) {

			this.x = Math.max(min.x, Math.min(max.x, this.x));
			this.y = Math.max(min.y, Math.min(max.y, this.y));

			return this;

		}

		/**
		 * Floors this vector.
		 *
		 * @return {Vector2} This vector.
		 */

		floor() {

			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);

			return this;

		}

		/**
		 * Ceils this vector.
		 *
		 * @return {Vector2} This vector.
		 */

		ceil() {

			this.x = Math.ceil(this.x);
			this.y = Math.ceil(this.y);

			return this;

		}

		/**
		 * Rounds this vector.
		 *
		 * @return {Vector2} This vector.
		 */

		round() {

			this.x = Math.round(this.x);
			this.y = Math.round(this.y);

			return this;

		}

		/**
		 * Negates this vector.
		 *
		 * @return {Vector2} This vector.
		 */

		negate() {

			this.x = -this.x;
			this.y = -this.y;

			return this;

		}

		/**
		 * Computes the angle in radians with respect to the positive X-axis.
		 *
		 * @return {Number} The angle.
		 */

		angle() {

			let angle = Math.atan2(this.y, this.x);

			if(angle < 0) {

				angle += 2 * Math.PI;

			}

			return angle;

		}

		/**
		 * Lerps towards the given vector.
		 *
		 * @param {Vector2} v - The target vector.
		 * @param {Number} alpha - The lerp factor.
		 * @return {Vector2} This vector.
		 */

		lerp(v, alpha) {

			this.x += (v.x - this.x) * alpha;
			this.y += (v.y - this.y) * alpha;

			return this;

		}

		/**
		 * Sets this vector to the lerp result of the given vectors.
		 *
		 * @param {Vector2} v1 - A base vector.
		 * @param {Vector2} v2 - The target vector.
		 * @param {Number} alpha - The lerp factor.
		 * @return {Vector2} This vector.
		 */

		lerpVectors(v1, v2, alpha) {

			return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

		}

		/**
		 * Rotates this vector around a given center.
		 *
		 * @param {Vector2} center - The center.
		 * @param {Number} angle - The rotation in radians.
		 * @return {Vector2} This vector.
		 */

		rotateAround(center, angle) {

			const c = Math.cos(angle), s = Math.sin(angle);

			const x = this.x - center.x;
			const y = this.y - center.y;

			this.x = x * c - y * s + center.x;
			this.y = x * s + y * c + center.y;

			return this;

		}

		/**
		 * Checks if this vector equals the given one.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Boolean} Whether this vector equals the given one.
		 */

		equals(v) {

			return (v.x === this.x && v.y === this.y);

		}

	}

	/**
	 * A cylindrical coordinate system.
	 *
	 * For details see: https://en.wikipedia.org/wiki/Cylindrical_coordinate_system
	 */

	/**
	 * A 3x3 matrix.
	 */

	/**
	 * An enumeration of Euler rotation orders.
	 *
	 * @type {Object}
	 * @property {String} XYZ - X -> Y -> Z.
	 * @property {String} YZX - Y -> Z -> X.
	 * @property {String} ZXY - Z -> X -> Y.
	 * @property {String} XZY - X -> Z -> Y.
	 * @property {String} YXZ - Y -> X -> Z.
	 * @property {String} ZYX - Z -> Y -> X.
	 */

	const RotationOrder = {

		XYZ: "XYZ",
		YZX: "YZX",
		ZXY: "ZXY",
		XZY: "XZY",
		YXZ: "YXZ",
		ZYX: "ZYX"

	};

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const a$2 = new Vector3();

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const b$2 = new Vector3();

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const c = new Vector3();

	/**
	 * A 4x4 matrix.
	 */

	class Matrix4 {

		/**
		 * Constructs a new matrix.
		 */

		constructor() {

			/**
			 * The matrix elements.
			 *
			 * @type {Float32Array}
			 */

			this.elements = new Float32Array([

				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			]);

		}

		/**
		 * Sets the values of this matrix.
		 *
		 * @param {Number} n00 - The value of the first row, first column.
		 * @param {Number} n01 - The value of the first row, second column.
		 * @param {Number} n02 - The value of the first row, third column.
		 * @param {Number} n03 - The value of the first row, fourth column.
		 * @param {Number} n10 - The value of the second row, first column.
		 * @param {Number} n11 - The value of the second row, second column.
		 * @param {Number} n12 - The value of the second row, third column.
		 * @param {Number} n13 - The value of the second row, fourth column.
		 * @param {Number} n20 - The value of the third row, first column.
		 * @param {Number} n21 - The value of the third row, second column.
		 * @param {Number} n22 - The value of the third row, third column.
		 * @param {Number} n23 - The value of the third row, fourth column.
		 * @param {Number} n30 - The value of the fourth row, first column.
		 * @param {Number} n31 - The value of the fourth row, second column.
		 * @param {Number} n32 - The value of the fourth row, third column.
		 * @param {Number} n33 - The value of the fourth row, fourth column.
		 * @return {Matrix4} This matrix.
		 */

		set(n00, n01, n02, n03, n10, n11, n12, n13, n20, n21, n22, n23, n30, n31, n32, n33) {

			const te = this.elements;

			te[0] = n00; te[4] = n01; te[8] = n02; te[12] = n03;
			te[1] = n10; te[5] = n11; te[9] = n12; te[13] = n13;
			te[2] = n20; te[6] = n21; te[10] = n22; te[14] = n23;
			te[3] = n30; te[7] = n31; te[11] = n32; te[15] = n33;

			return this;

		}

		/**
		 * Sets this matrix to the identity matrix.
		 *
		 * @return {Matrix4} This matrix.
		 */

		identity() {

			this.set(

				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Copies the values of a given matrix.
		 *
		 * @param {Matrix4} matrix - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		copy(matrix) {

			const me = matrix.elements;
			const te = this.elements;

			te[0] = me[0]; te[1] = me[1]; te[2] = me[2]; te[3] = me[3];
			te[4] = me[4]; te[5] = me[5]; te[6] = me[6]; te[7] = me[7];
			te[8] = me[8]; te[9] = me[9]; te[10] = me[10]; te[11] = me[11];
			te[12] = me[12]; te[13] = me[13]; te[14] = me[14]; te[15] = me[15];

			return this;

		}

		/**
		 * Clones this matrix.
		 *
		 * @return {Matrix4} A clone of this matrix.
		 */

		clone() {

			return new this.constructor().fromArray(this.elements);

		}

		/**
		 * Copies the values of a given array.
		 *
		 * @param {Number[]} array - An array.
		 * @param {Number} [offset=0] - An offset into the array.
		 * @return {Matrix4} This matrix.
		 */

		fromArray(array, offset = 0) {

			const te = this.elements;

			let i;

			for(i = 0; i < 16; ++i) {

				te[i] = array[i + offset];

			}

			return this;

		}

		/**
		 * Stores this matrix in an array.
		 *
		 * @param {Number[]} [array] - A target array.
		 * @param {Number} [offset=0] - An offset into the array.
		 * @return {Number[]} The array.
		 */

		toArray(array = [], offset = 0) {

			const te = this.elements;

			let i;

			for(i = 0; i < 16; ++i) {

				array[i + offset] = te[i];

			}

			return array;

		}

		/**
		 * Returns the largest scale.
		 *
		 * @return {Number} The largest scale of the three axes.
		 */

		getMaxScaleOnAxis() {

			const te = this.elements;

			const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
			const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
			const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];

			return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));

		}

		/**
		 * Copies the position values of a given matrix.
		 *
		 * @param {Matrix4} matrix - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		copyPosition(matrix) {

			const te = this.elements;
			const me = matrix.elements;

			te[12] = me[12];
			te[13] = me[13];
			te[14] = me[14];

			return this;

		}

		/**
		 * Sets the position values of this matrix.
		 *
		 * @param {Vector3} p - A position.
		 * @return {Matrix4} This matrix.
		 */

		setPosition(p) {

			const te = this.elements;

			te[12] = p.x;
			te[13] = p.y;
			te[14] = p.z;

			return this;

		}

		/**
		 * Extracts the basis from this matrix.
		 *
		 * @param {Vector3} xAxis - A vector to store the X-axis column in.
		 * @param {Vector3} yAxis - A vector to store the Y-axis column in.
		 * @param {Vector3} zAxis - A vector to store the Z-axis column in.
		 * @return {Matrix4} This matrix.
		 */

		extractBasis(xAxis, yAxis, zAxis) {

			xAxis.setFromMatrixColumn(this, 0);
			yAxis.setFromMatrixColumn(this, 1);
			zAxis.setFromMatrixColumn(this, 2);

			return this;

		}

		/**
		 * Sets the basis of this matrix.
		 *
		 * @param {Vector3} xAxis - The X-axis.
		 * @param {Vector3} yAxis - The Y-axis.
		 * @param {Vector3} zAxis - The Z-axis.
		 * @return {Matrix4} This matrix.
		 */

		makeBasis(xAxis, yAxis, zAxis) {

			this.set(

				xAxis.x, yAxis.x, zAxis.x, 0,
				xAxis.y, yAxis.y, zAxis.y, 0,
				xAxis.z, yAxis.z, zAxis.z, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Extracts the rotation from a given matrix.
		 *
		 * This method does not support reflection matrices.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		extractRotation(m) {

			const te = this.elements;
			const me = m.elements;

			const scaleX = 1.0 / a$2.setFromMatrixColumn(m, 0).length();
			const scaleY = 1.0 / a$2.setFromMatrixColumn(m, 1).length();
			const scaleZ = 1.0 / a$2.setFromMatrixColumn(m, 2).length();

			te[0] = me[0] * scaleX;
			te[1] = me[1] * scaleX;
			te[2] = me[2] * scaleX;
			te[3] = 0;

			te[4] = me[4] * scaleY;
			te[5] = me[5] * scaleY;
			te[6] = me[6] * scaleY;
			te[7] = 0;

			te[8] = me[8] * scaleZ;
			te[9] = me[9] * scaleZ;
			te[10] = me[10] * scaleZ;
			te[11] = 0;

			te[12] = 0;
			te[13] = 0;
			te[14] = 0;
			te[15] = 1;

			return this;

		}

		/**
		 * Sets the matrix rotation based on the given Euler angles.
		 *
		 * @param {Euler} euler - The euler angles.
		 * @return {Matrix4} This matrix.
		 */

		makeRotationFromEuler(euler) {

			const te = this.elements;

			const x = euler.x;
			const y = euler.y;
			const z = euler.z;

			const a = Math.cos(x), b = Math.sin(x);
			const c = Math.cos(y), d = Math.sin(y);
			const e = Math.cos(z), f = Math.sin(z);

			let ae, af, be, bf;
			let ce, cf, de, df;
			let ac, ad, bc, bd;

			switch(euler.order) {

				case RotationOrder.XYZ: {

					ae = a * e, af = a * f, be = b * e, bf = b * f;

					te[0] = c * e;
					te[4] = -c * f;
					te[8] = d;

					te[1] = af + be * d;
					te[5] = ae - bf * d;
					te[9] = -b * c;

					te[2] = bf - ae * d;
					te[6] = be + af * d;
					te[10] = a * c;

					break;

				}

				case RotationOrder.YXZ: {

					ce = c * e, cf = c * f, de = d * e, df = d * f;

					te[0] = ce + df * b;
					te[4] = de * b - cf;
					te[8] = a * d;

					te[1] = a * f;
					te[5] = a * e;
					te[9] = -b;

					te[2] = cf * b - de;
					te[6] = df + ce * b;
					te[10] = a * c;

					break;

				}

				case RotationOrder.ZXY: {

					ce = c * e, cf = c * f, de = d * e, df = d * f;

					te[0] = ce - df * b;
					te[4] = -a * f;
					te[8] = de + cf * b;

					te[1] = cf + de * b;
					te[5] = a * e;
					te[9] = df - ce * b;

					te[2] = -a * d;
					te[6] = b;
					te[10] = a * c;

					break;

				}

				case RotationOrder.ZYX: {

					ae = a * e, af = a * f, be = b * e, bf = b * f;

					te[0] = c * e;
					te[4] = be * d - af;
					te[8] = ae * d + bf;

					te[1] = c * f;
					te[5] = bf * d + ae;
					te[9] = af * d - be;

					te[2] = -d;
					te[6] = b * c;
					te[10] = a * c;

					break;

				}

				case RotationOrder.YZX: {

					ac = a * c, ad = a * d, bc = b * c, bd = b * d;

					te[0] = c * e;
					te[4] = bd - ac * f;
					te[8] = bc * f + ad;

					te[1] = f;
					te[5] = a * e;
					te[9] = -b * e;

					te[2] = -d * e;
					te[6] = ad * f + bc;
					te[10] = ac - bd * f;

					break;

				}

				case RotationOrder.XZY: {

					ac = a * c, ad = a * d, bc = b * c, bd = b * d;

					te[0] = c * e;
					te[4] = -f;
					te[8] = d * e;

					te[1] = ac * f + bd;
					te[5] = a * e;
					te[9] = ad * f - bc;

					te[2] = bc * f - ad;
					te[6] = b * e;
					te[10] = bd * f + ac;

					break;

				}

			}

			// Bottom row.
			te[3] = 0;
			te[7] = 0;
			te[11] = 0;

			// Last column.
			te[12] = 0;
			te[13] = 0;
			te[14] = 0;
			te[15] = 1;

			return this;

		}

		/**
		 * Sets the matrix rotation based on the given quaternion.
		 *
		 * @param {Quaternion} q - The quaternion.
		 * @return {Matrix4} This matrix.
		 */

		makeRotationFromQuaternion(q) {

			return this.compose(a$2.set(0, 0, 0), q, b$2.set(1, 1, 1));

		}

		/**
		 * Creates a rotation that looks at the given target.
		 *
		 * @param {Vector3} eye - The position of the eye.
		 * @param {Vector3} target - The target to look at.
		 * @param {Vector3} up - The up vector.
		 * @return {Matrix4} This matrix.
		 */

		lookAt(eye, target, up) {

			const te = this.elements;
			const x = a$2, y = b$2, z = c;

			z.subVectors(eye, target);

			if(z.lengthSquared() === 0) {

				// Eye and target are at the same position.
				z.z = 1;

			}

			z.normalize();
			x.crossVectors(up, z);

			if(x.lengthSquared() === 0) {

				// Up and z are parallel.
				if(Math.abs(up.z) === 1) {

					z.x += 1e-4;

				} else {

					z.z += 1e-4;

				}

				z.normalize();
				x.crossVectors(up, z);

			}

			x.normalize();
			y.crossVectors(z, x);

			te[0] = x.x; te[4] = y.x; te[8] = z.x;
			te[1] = x.y; te[5] = y.y; te[9] = z.y;
			te[2] = x.z; te[6] = y.z; te[10] = z.z;

			return this;

		}

		/**
		 * Sets this matrix to the product of the given matrices.
		 *
		 * @param {Matrix4} a - A matrix.
		 * @param {Matrix4} b - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		multiplyMatrices(a, b) {

			const te = this.elements;
			const ae = a.elements;
			const be = b.elements;

			const a00 = ae[0], a01 = ae[4], a02 = ae[8], a03 = ae[12];
			const a10 = ae[1], a11 = ae[5], a12 = ae[9], a13 = ae[13];
			const a20 = ae[2], a21 = ae[6], a22 = ae[10], a23 = ae[14];
			const a30 = ae[3], a31 = ae[7], a32 = ae[11], a33 = ae[15];

			const b00 = be[0], b01 = be[4], b02 = be[8], b03 = be[12];
			const b10 = be[1], b11 = be[5], b12 = be[9], b13 = be[13];
			const b20 = be[2], b21 = be[6], b22 = be[10], b23 = be[14];
			const b30 = be[3], b31 = be[7], b32 = be[11], b33 = be[15];

			te[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
			te[4] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
			te[8] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
			te[12] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;

			te[1] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
			te[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
			te[9] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
			te[13] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;

			te[2] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
			te[6] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
			te[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
			te[14] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;

			te[3] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
			te[7] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
			te[11] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
			te[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;

			return this;

		}

		/**
		 * Multiplies this matrix with the given one.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		multiply(m) {

			return this.multiplyMatrices(this, m);

		}

		/**
		 * Multiplies a given matrix with this one.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		premultiply(m) {

			return this.multiplyMatrices(m, this);

		}

		/**
		 * Multiplies this matrix with a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Matrix4} This matrix.
		 */

		multiplyScalar(s) {

			const te = this.elements;

			te[0] *= s; te[4] *= s; te[8] *= s; te[12] *= s;
			te[1] *= s; te[5] *= s; te[9] *= s; te[13] *= s;
			te[2] *= s; te[6] *= s; te[10] *= s; te[14] *= s;
			te[3] *= s; te[7] *= s; te[11] *= s; te[15] *= s;

			return this;

		}

		/**
		 * Calculates the determinant of this matrix.
		 *
		 * For more details see:
		 *  http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		 *
		 * @return {Number} The determinant.
		 */

		determinant() {

			const te = this.elements;

			const n00 = te[0], n01 = te[4], n02 = te[8], n03 = te[12];
			const n10 = te[1], n11 = te[5], n12 = te[9], n13 = te[13];
			const n20 = te[2], n21 = te[6], n22 = te[10], n23 = te[14];
			const n30 = te[3], n31 = te[7], n32 = te[11], n33 = te[15];

			const n00n11 = n00 * n11, n00n12 = n00 * n12, n00n13 = n00 * n13;
			const n01n10 = n01 * n10, n01n12 = n01 * n12, n01n13 = n01 * n13;
			const n02n10 = n02 * n10, n02n11 = n02 * n11, n02n13 = n02 * n13;
			const n03n10 = n03 * n10, n03n11 = n03 * n11, n03n12 = n03 * n12;

			return (

				n30 * (
					n03n12 * n21 -
					n02n13 * n21 -
					n03n11 * n22 +
					n01n13 * n22 +
					n02n11 * n23 -
					n01n12 * n23
				) +

				n31 * (
					n00n12 * n23 -
					n00n13 * n22 +
					n03n10 * n22 -
					n02n10 * n23 +
					n02n13 * n20 -
					n03n12 * n20
				) +

				n32 * (
					n00n13 * n21 -
					n00n11 * n23 -
					n03n10 * n21 +
					n01n10 * n23 +
					n03n11 * n20 -
					n01n13 * n20
				) +

				n33 * (
					-n02n11 * n20 -
					n00n12 * n21 +
					n00n11 * n22 +
					n02n10 * n21 -
					n01n10 * n22 +
					n01n12 * n20
				)

			);

		}

		/**
		 * Inverts the given matrix and stores the result in this matrix.
		 *
		 * For details see:
		 *  http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		 *
		 * @param {Matrix4} matrix - The matrix that should be inverted.
		 * @return {Matrix4} This matrix.
		 */

		getInverse(matrix) {

			const te = this.elements;
			const me = matrix.elements;

			const n00 = me[0], n10 = me[1], n20 = me[2], n30 = me[3];
			const n01 = me[4], n11 = me[5], n21 = me[6], n31 = me[7];
			const n02 = me[8], n12 = me[9], n22 = me[10], n32 = me[11];
			const n03 = me[12], n13 = me[13], n23 = me[14], n33 = me[15];

			const t00 = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;
			const t01 = n03 * n22 * n31 - n02 * n23 * n31 - n03 * n21 * n32 + n01 * n23 * n32 + n02 * n21 * n33 - n01 * n22 * n33;
			const t02 = n02 * n13 * n31 - n03 * n12 * n31 + n03 * n11 * n32 - n01 * n13 * n32 - n02 * n11 * n33 + n01 * n12 * n33;
			const t03 = n03 * n12 * n21 - n02 * n13 * n21 - n03 * n11 * n22 + n01 * n13 * n22 + n02 * n11 * n23 - n01 * n12 * n23;

			const det = n00 * t00 + n10 * t01 + n20 * t02 + n30 * t03;

			let invDet;

			if(det !== 0) {

				invDet = 1.0 / det;

				te[0] = t00 * invDet;
				te[1] = (n13 * n22 * n30 - n12 * n23 * n30 - n13 * n20 * n32 + n10 * n23 * n32 + n12 * n20 * n33 - n10 * n22 * n33) * invDet;
				te[2] = (n11 * n23 * n30 - n13 * n21 * n30 + n13 * n20 * n31 - n10 * n23 * n31 - n11 * n20 * n33 + n10 * n21 * n33) * invDet;
				te[3] = (n12 * n21 * n30 - n11 * n22 * n30 - n12 * n20 * n31 + n10 * n22 * n31 + n11 * n20 * n32 - n10 * n21 * n32) * invDet;

				te[4] = t01 * invDet;
				te[5] = (n02 * n23 * n30 - n03 * n22 * n30 + n03 * n20 * n32 - n00 * n23 * n32 - n02 * n20 * n33 + n00 * n22 * n33) * invDet;
				te[6] = (n03 * n21 * n30 - n01 * n23 * n30 - n03 * n20 * n31 + n00 * n23 * n31 + n01 * n20 * n33 - n00 * n21 * n33) * invDet;
				te[7] = (n01 * n22 * n30 - n02 * n21 * n30 + n02 * n20 * n31 - n00 * n22 * n31 - n01 * n20 * n32 + n00 * n21 * n32) * invDet;

				te[8] = t02 * invDet;
				te[9] = (n03 * n12 * n30 - n02 * n13 * n30 - n03 * n10 * n32 + n00 * n13 * n32 + n02 * n10 * n33 - n00 * n12 * n33) * invDet;
				te[10] = (n01 * n13 * n30 - n03 * n11 * n30 + n03 * n10 * n31 - n00 * n13 * n31 - n01 * n10 * n33 + n00 * n11 * n33) * invDet;
				te[11] = (n02 * n11 * n30 - n01 * n12 * n30 - n02 * n10 * n31 + n00 * n12 * n31 + n01 * n10 * n32 - n00 * n11 * n32) * invDet;

				te[12] = t03 * invDet;
				te[13] = (n02 * n13 * n20 - n03 * n12 * n20 + n03 * n10 * n22 - n00 * n13 * n22 - n02 * n10 * n23 + n00 * n12 * n23) * invDet;
				te[14] = (n03 * n11 * n20 - n01 * n13 * n20 - n03 * n10 * n21 + n00 * n13 * n21 + n01 * n10 * n23 - n00 * n11 * n23) * invDet;
				te[15] = (n01 * n12 * n20 - n02 * n11 * n20 + n02 * n10 * n21 - n00 * n12 * n21 - n01 * n10 * n22 + n00 * n11 * n22) * invDet;

			} else {

				console.error("Can't invert matrix, determinant is zero", matrix);

				this.identity();

			}

			return this;

		}

		/**
		 * Transposes this matrix.
		 *
		 * @return {Matrix4} This matrix.
		 */

		transpose() {

			const te = this.elements;

			let t;

			t = te[1]; te[1] = te[4]; te[4] = t;
			t = te[2]; te[2] = te[8]; te[8] = t;
			t = te[6]; te[6] = te[9]; te[9] = t;

			t = te[3]; te[3] = te[12]; te[12] = t;
			t = te[7]; te[7] = te[13]; te[13] = t;
			t = te[11]; te[11] = te[14]; te[14] = t;

			return this;

		}

		/**
		 * Scales this matrix.
		 *
		 * @param {Number} sx - The X scale.
		 * @param {Number} sy - The Y scale.
		 * @param {Number} sz - The Z scale.
		 * @return {Matrix4} This matrix.
		 */

		scale(sx, sy, sz) {

			const te = this.elements;

			te[0] *= sx; te[4] *= sy; te[8] *= sz;
			te[1] *= sx; te[5] *= sy; te[9] *= sz;
			te[2] *= sx; te[6] *= sy; te[10] *= sz;
			te[3] *= sx; te[7] *= sy; te[11] *= sz;

			return this;

		}

		/**
		 * Makes this matrix a scale matrix.
		 *
		 * @param {Number} x - The X scale.
		 * @param {Number} y - The Y scale.
		 * @param {Number} z - The Z scale.
		 * @return {Matrix4} This matrix.
		 */

		makeScale(x, y, z) {

			this.set(

				x, 0, 0, 0,
				0, y, 0, 0,
				0, 0, z, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Makes this matrix a translation matrix.
		 *
		 * @param {Number} x - The X offset.
		 * @param {Number} y - The Y offset.
		 * @param {Number} z - The Z offset.
		 * @return {Matrix4} This matrix.
		 */

		makeTranslation(x, y, z) {

			this.set(

				1, 0, 0, x,
				0, 1, 0, y,
				0, 0, 1, z,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Makes this matrix a rotation matrix.
		 *
		 * @param {Number} theta - The angle in radians.
		 * @return {Matrix4} This matrix.
		 */

		makeRotationX(theta) {

			const c = Math.cos(theta), s = Math.sin(theta);

			this.set(

				1, 0, 0, 0,
				0, c, -s, 0,
				0, s, c, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Makes this matrix a rotation matrix with respect to the Y-axis.
		 *
		 * @param {Number} theta - The angle in radians.
		 * @return {Matrix4} This matrix.
		 */

		makeRotationY(theta) {

			const c = Math.cos(theta), s = Math.sin(theta);

			this.set(

				c, 0, s, 0,
				0, 1, 0, 0,
				-s, 0, c, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Makes this matrix a rotation matrix with respect to the Z-axis.
		 *
		 * @param {Number} theta - The angle in radians.
		 * @return {Matrix4} This matrix.
		 */

		makeRotationZ(theta) {

			const c = Math.cos(theta), s = Math.sin(theta);

			this.set(

				c, -s, 0, 0,
				s, c, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Makes this matrix a translation matrix with respect to a specific axis.
		 *
		 * For mor einformation see:
		 *  http://www.gamedev.net/reference/articles/article1199.asp
		 *
		 * @param {Vector3} axis - The axis. Assumed to be normalized.
		 * @param {Number} angle - The angle in radians.
		 * @return {Matrix4} This matrix.
		 */

		makeRotationAxis(axis, angle) {

			const c = Math.cos(angle);
			const s = Math.sin(angle);

			const t = 1.0 - c;

			const x = axis.x, y = axis.y, z = axis.z;
			const tx = t * x, ty = t * y;

			this.set(

				tx * x + c, tx * y - s * z, tx * z + s * y, 0,
				tx * y + s * z, ty * y + c, ty * z - s * x, 0,
				tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Makes this matrix a shear matrix.
		 *
		 * @param {Number} x - The X shear value.
		 * @param {Number} y - The Y shear value.
		 * @param {Number} z - The Z shear value.
		 * @return {Matrix4} This matrix.
		 */

		makeShear(x, y, z) {

			this.set(

				1, y, z, 0,
				x, 1, z, 0,
				x, y, 1, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Sets this matrix based on the given position, rotation and scale.
		 *
		 * @param {Vector3} position - The position.
		 * @param {Quaternion} quaternion - The rotation.
		 * @param {Vector3} scale - The scale.
		 * @return {Matrix4} This matrix.
		 */

		compose(position, quaternion, scale) {

			const te = this.elements;

			const x = quaternion.x, y = quaternion.y, z = quaternion.z, w = quaternion.w;
			const x2 = x + x,	y2 = y + y, z2 = z + z;
			const xx = x * x2, xy = x * y2, xz = x * z2;
			const yy = y * y2, yz = y * z2, zz = z * z2;
			const wx = w * x2, wy = w * y2, wz = w * z2;

			const sx = scale.x, sy = scale.y, sz = scale.z;

			te[0] = (1 - (yy + zz)) * sx;
			te[1] = (xy + wz) * sx;
			te[2] = (xz - wy) * sx;
			te[3] = 0;

			te[4] = (xy - wz) * sy;
			te[5] = (1 - (xx + zz)) * sy;
			te[6] = (yz + wx) * sy;
			te[7] = 0;

			te[8] = (xz + wy) * sz;
			te[9] = (yz - wx) * sz;
			te[10] = (1 - (xx + yy)) * sz;
			te[11] = 0;

			te[12] = position.x;
			te[13] = position.y;
			te[14] = position.z;
			te[15] = 1;

			return this;

		}

		/**
		 * Decomposes this matrix into a position, rotation and scale vector.
		 *
		 * @param {Vector3} position - The target position.
		 * @param {Quaternion} quaternion - The target rotation.
		 * @param {Vector3} scale - The target scale.
		 * @return {Matrix4} This matrix.
		 */

		decompose(position, quaternion, scale) {

			const te = this.elements;

			const n00 = te[0], n10 = te[1], n20 = te[2];
			const n01 = te[4], n11 = te[5], n21 = te[6];
			const n02 = te[8], n12 = te[9], n22 = te[10];

			const det = this.determinant();

			// If the determinant is negative, one scale must be inverted.
			const sx = a$2.set(n00, n10, n20).length() * ((det < 0) ? -1 : 1);
			const sy = a$2.set(n01, n11, n21).length();
			const sz = a$2.set(n02, n12, n22).length();

			const invSX = 1.0 / sx;
			const invSY = 1.0 / sy;
			const invSZ = 1.0 / sz;

			// Export the position.
			position.x = te[12];
			position.y = te[13];
			position.z = te[14];

			// Scale the rotation part.
			te[0] *= invSX; te[1] *= invSX; te[2] *= invSX;
			te[4] *= invSY; te[5] *= invSY; te[6] *= invSY;
			te[8] *= invSZ; te[9] *= invSZ; te[10] *= invSZ;

			// Export the rotation.
			quaternion.setFromRotationMatrix(this);

			// Restore the original values.
			te[0] = n00; te[1] = n10; te[2] = n20;
			te[4] = n01; te[5] = n11; te[6] = n21;
			te[8] = n02; te[9] = n12; te[10] = n22;

			// Export the scale.
			scale.x = sx;
			scale.y = sy;
			scale.z = sz;

			return this;

		}

		/**
		 * Creates a perspective matrix.
		 *
		 * @param {Number} left - The distance to the left plane.
		 * @param {Number} right - The distance to the right plane.
		 * @param {Number} top - The distance to the top plane.
		 * @param {Number} bottom - The distance to the bottom plane.
		 * @param {Number} near - The distance to the near plane.
		 * @param {Number} far - The distance to the far plane.
		 * @return {Matrix4} This matrix.
		 */

		makePerspective(left, right, top, bottom, near, far) {

			const te = this.elements;
			const x = 2 * near / (right - left);
			const y = 2 * near / (top - bottom);

			const a = (right + left) / (right - left);
			const b = (top + bottom) / (top - bottom);
			const c = -(far + near) / (far - near);
			const d = -2 * far * near / (far - near);

			te[0] = x; te[4] = 0; te[8] = a; te[12] = 0;
			te[1] = 0; te[5] = y; te[9] = b; te[13] = 0;
			te[2] = 0; te[6] = 0; te[10] = c; te[14] = d;
			te[3] = 0; te[7] = 0; te[11] = -1; te[15] = 0;

			return this;

		}

		/**
		 * Creates an orthographic matrix.
		 *
		 * @param {Number} left - The distance to the left plane.
		 * @param {Number} right - The distance to the right plane.
		 * @param {Number} top - The distance to the top plane.
		 * @param {Number} bottom - The distance to the bottom plane.
		 * @param {Number} near - The distance to the near plane.
		 * @param {Number} far - The distance to the far plane.
		 * @return {Matrix4} This matrix.
		 */

		makeOrthographic(left, right, top, bottom, near, far) {

			const te = this.elements;
			const w = 1.0 / (right - left);
			const h = 1.0 / (top - bottom);
			const p = 1.0 / (far - near);

			const x = (right + left) * w;
			const y = (top + bottom) * h;
			const z = (far + near) * p;

			te[0] = 2 * w; te[4] = 0; te[8] = 0; te[12] = -x;
			te[1] = 0; te[5] = 2 * h; te[9] = 0; te[13] = -y;
			te[2] = 0; te[6] = 0; te[10] = -2 * p; te[14] = -z;
			te[3] = 0; te[7] = 0; te[11] = 0; te[15] = 1;

			return this;

		}

		/**
		 * Checks if this matrix equals the given one.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Boolean} Whether the matrix are equal.
		 */

		equals(m) {

			const te = this.elements;
			const me = m.elements;

			let result = true;
			let i;

			for(i = 0; result && i < 16; ++i) {

				if(te[i] !== me[i]) {

					result = false;

				}

			}

			return result;

		}

	}

	/**
	 * A spherical coordinate system.
	 *
	 * For details see: https://en.wikipedia.org/wiki/Spherical_coordinate_system
	 *
	 * The poles (phi) are at the positive and negative Y-axis. The equator starts
	 * at positive Z.
	 */

	class Spherical {

		/**
		 * Constructs a new spherical system.
		 *
		 * @param {Number} [radius=1] - The radius of the sphere.
		 * @param {Number} [phi=0] - The polar angle phi.
		 * @param {Number} [theta=0] - The equator angle theta.
		 */

		constructor(radius = 1, phi = 0, theta = 0) {

			/**
			 * The radius of the sphere.
			 *
			 * @type {Number}
			 */

			this.radius = radius;

			/**
			 * The polar angle, up and down towards the top and bottom pole.
			 *
			 * @type {Number}
			 */

			this.phi = phi;

			/**
			 * The angle around the equator of the sphere.
			 *
			 * @type {Number}
			 */

			this.theta = theta;

		}

		/**
		 * Sets the values of this spherical system.
		 *
		 * @param {Number} radius - The radius.
		 * @param {Number} phi - Phi.
		 * @param {Number} theta - Theta.
		 * @return {Spherical} This spherical system.
		 */

		set(radius, phi, theta) {

			this.radius = radius;
			this.phi = phi;
			this.theta = theta;

			return this;

		}

		/**
		 * Copies the values of the given spherical system.
		 *
		 * @param {Spherical} s - A spherical system.
		 * @return {Spherical} This spherical system.
		 */

		copy(s) {

			this.radius = s.radius;
			this.phi = s.phi;
			this.theta = s.theta;

			return this;

		}

		/**
		 * Clones this spherical system.
		 *
		 * @return {Spherical} The cloned spherical system.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Restricts phi to `[1e-6, PI - 1e-6]`.
		 *
		 * @return {Spherical} This spherical system.
		 */

		makeSafe() {

			this.phi = Math.max(1e-6, Math.min(Math.PI - 1e-6, this.phi));

			return this;

		}

		/**
		 * Sets the values of this spherical system based on a vector.
		 *
		 * The radius is set to the vector's length while phi and theta are set from
		 * its direction.
		 *
		 * @param {Vector3} v - The vector.
		 * @return {Spherical} This spherical system.
		 */

		setFromVector3(v) {

			return this.setFromCartesianCoords(v.x, v.y, v.z);

		}

		/**
		 * Sets the values of this spherical system based on cartesian coordinates.
		 *
		 * @param {Number} x - The X coordinate.
		 * @param {Number} y - The Y coordinate.
		 * @param {Number} z - The Z coordinate.
		 * @return {Spherical} This spherical system.
		 */

		setFromCartesianCoords(x, y, z) {

			this.radius = Math.sqrt(x * x + y * y + z * z);

			if(this.radius === 0) {

				this.theta = 0;
				this.phi = 0;

			} else {

				// Calculate the equator angle around the positive Y-axis.
				this.theta = Math.atan2(x, z);

				// Calculate the polar angle.
				this.phi = Math.acos(Math.min(Math.max(y / this.radius, -1), 1));

			}

			return this;

		}

	}

	/**
	 * A symmetric 3x3 matrix.
	 */

	/**
	 * A vector with four components.
	 */

	/**
	 * Mathematical data structures.
	 *
	 * @module math-ds
	 */

	/**
	 * An enumeration of pointer buttons.
	 *
	 * @type {Object}
	 * @property {Number} MAIN - The main mouse button, usually the left one.
	 * @property {Number} AUXILIARY - The auxiliary mouse button, usually the middle one.
	 * @property {Number} SECONDARY - The secondary mouse button, usually the right one.
	 */

	const PointerButton = {

		MAIN: 0,
		AUXILIARY: 1,
		SECONDARY: 2

	};

	/**
	 * Two PI.
	 *
	 * @type {Number}
	 * @private
	 */

	const TWO_PI = Math.PI * 2;

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const v$7 = new Vector3();

	/**
	 * A matrix.
	 *
	 * @type {Matrix4}
	 * @private
	 */

	const m$1 = new Matrix4();

	/**
	 * A rotation manager.
	 */

	class RotationManager {

		/**
		 * Constructs a new rotation manager.
		 *
		 * @param {Vector3} position - A position.
		 * @param {Quaternion} quaternion - A quaternion.
		 * @param {Vector3} target - A target.
		 * @param {Settings} settings - The settings.
		 */

		constructor(position, quaternion, target, settings) {

			/**
			 * The position that will be modified.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.position = position;

			/**
			 * The quaternion that will be modified.
			 *
			 * @type {Quaternion}
			 * @private
			 */

			this.quaternion = quaternion;

			/**
			 * A target.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.target = target;

			/**
			 * The settings.
			 *
			 * @type {Settings}
			 * @private
			 */

			this.settings = settings;

			/**
			 * A spherical coordinate system.
			 *
			 * @type {Spherical}
			 */

			this.spherical = new Spherical();

		}

		/**
		 * Sets the position.
		 *
		 * @param {Vector3} position - A position.
		 * @return {RotationManager} This manager.
		 */

		setPosition(position) {

			this.position = position;

			return this;

		}

		/**
		 * Sets the quaternion.
		 *
		 * @param {Quaternion} quaternion - A quaternion.
		 * @return {RotationManager} This manager.
		 */

		setQuaternion(quaternion) {

			this.quaternion = quaternion;

			return this;

		}

		/**
		 * Sets the target.
		 *
		 * @param {Vector3} target - A target.
		 * @return {RotationManager} This manager.
		 */

		setTarget(target) {

			this.target = target;

			return this;

		}

		/**
		 * Updates the quaternion.
		 *
		 * @return {RotationManager} This manager.
		 */

		updateQuaternion() {

			const settings = this.settings;
			const rotation = settings.rotation;

			if(settings.general.orbit) {

				m$1.lookAt(v$7.subVectors(this.position, this.target), rotation.pivotOffset, rotation.up);

			} else {

				m$1.lookAt(v$7.set(0, 0, 0), this.target.setFromSpherical(this.spherical), rotation.up);

			}

			this.quaternion.setFromRotationMatrix(m$1);

			return this;

		}

		/**
		 * Adjusts the spherical system.
		 *
		 * @param {Number} theta - The angle to add to theta in radians.
		 * @param {Number} phi - The angle to add to phi in radians.
		 * @return {RotationManager} This manager.
		 */

		adjustSpherical(theta, phi) {

			const settings = this.settings;
			const orbit = settings.general.orbit;
			const rotation = settings.rotation;
			const s = this.spherical;

			s.theta = !rotation.invertX ? s.theta - theta : s.theta + theta;
			s.phi = ((orbit || rotation.invertY) && !(orbit && rotation.invertY)) ? s.phi - phi : s.phi + phi;

			// Restrict theta and phi.
			s.theta = Math.min(Math.max(s.theta, rotation.minAzimuthalAngle), rotation.maxAzimuthalAngle);
			s.phi = Math.min(Math.max(s.phi, rotation.minPolarAngle), rotation.maxPolarAngle);
			s.theta %= TWO_PI;
			s.makeSafe();

			if(orbit) {

				// Keep the position up-to-date.
				this.position.setFromSpherical(s).add(this.target);

			}

			return this;

		}

		/**
		 * Zooms in or out.
		 *
		 * @param {Number} sign - The zoom sign. Possible values are [-1, 0, 1].
		 * @return {RotationManager} This manager.
		 */

		zoom(sign) {

			const settings = this.settings;
			const general = settings.general;
			const sensitivity = settings.sensitivity;
			const zoom = settings.zoom;
			const s = this.spherical;

			let amount, min, max;

			if(general.orbit && zoom.enabled) {

				amount = sign * sensitivity.zoom;

				if(zoom.invert) {

					amount = -amount;

				}

				min = Math.max(zoom.minDistance, 1e-6);
				max = Math.min(zoom.maxDistance, Infinity);

				s.radius = Math.min(Math.max(s.radius + amount, min), max);
				this.position.setFromSpherical(s).add(this.target);

			}

			return this;

		}

		/**
		 * Updates rotation calculations based on time.
		 *
		 * @param {Number} delta - The time since the last update in seconds.
		 */

		update(delta) {

		}

		/**
		 * Looks at the given point.
		 *
		 * @param {Vector3} point - The target point.
		 * @return {RotationManager} This manager.
		 */

		lookAt(point) {

			const spherical = this.spherical;
			const position = this.position;
			const target = this.target;

			target.copy(point);

			if(this.settings.general.orbit) {

				v$7.subVectors(position, target);

			} else {

				v$7.subVectors(target, position).normalize();

			}

			spherical.setFromVector3(v$7);
			spherical.radius = Math.max(spherical.radius, 1e-6);
			this.updateQuaternion();

			return this;

		}

		/**
		 * Returns the current view direction.
		 *
		 * @param {Vector3} [view] - A vector to store the direction in. If none is provided, a new vector will be created.
		 * @return {Vector3} The normalized view direction.
		 */

		getViewDirection(view = new Vector3()) {

			view.setFromSpherical(this.spherical).normalize();

			if(this.settings.general.orbit) {

				view.negate();

			}

			return view;

		}

	}

	/**
	 * An collection of movement flags.
	 */

	class MovementState {

		/**
		 * Constructs a new movement state.
		 */

		constructor() {

			/**
			 * Movement to the left.
			 *
			 * @type {Boolean}
			 */

			this.left = false;

			/**
			 * Movement to the right.
			 *
			 * @type {Boolean}
			 */

			this.right = false;

			/**
			 * Forward motion.
			 *
			 * @type {Boolean}
			 */

			this.forward = false;

			/**
			 * Backward motion.
			 *
			 * @type {Boolean}
			 */

			this.backward = false;

			/**
			 * Ascension.
			 *
			 * @type {Boolean}
			 */

			this.up = false;

			/**
			 * Descent.
			 *
			 * @type {Boolean}
			 */

			this.down = false;

		}

		/**
		 * Resets this state.
		 *
		 * @return {MovementState} This state.
		 */

		reset() {

			this.left = false;
			this.right = false;
			this.forward = false;
			this.backward = false;
			this.up = false;
			this.down = false;

			return this;

		}

	}

	/**
	 * The X-axis.
	 *
	 * @type {Vector3}
	 * @ignore
	 */

	const x = new Vector3(1, 0, 0);

	/**
	 * The Y-axis.
	 *
	 * @type {Vector3}
	 * @ignore
	 */

	const y = new Vector3(0, 1, 0);

	/**
	 * The Z-axis.
	 *
	 * @type {Vector3}
	 * @ignore
	 */

	const z = new Vector3(0, 0, 1);

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const v$8 = new Vector3();

	/**
	 * A translation manager.
	 */

	class TranslationManager {

		/**
		 * Constructs a new translation manager.
		 *
		 * @param {Vector3} position - A position.
		 * @param {Quaternion} quaternion - A quaternion.
		 * @param {Vector3} target - A target.
		 * @param {Settings} settings - The settings.
		 */

		constructor(position, quaternion, target, settings) {

			/**
			 * The position that will be modified.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.position = position;

			/**
			 * The quaternion that will be modified.
			 *
			 * @type {Quaternion}
			 * @private
			 */

			this.quaternion = quaternion;

			/**
			 * A target.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.target = target;

			/**
			 * The settings.
			 *
			 * @type {Settings}
			 * @private
			 */

			this.settings = settings;

			/**
			 * The current movement state.
			 *
			 * @type {MovementState}
			 */

			this.movementState = new MovementState();

		}

		/**
		 * Sets the position.
		 *
		 * @param {Vector3} position - A position.
		 * @return {RotationManager} This manager.
		 */

		setPosition(position) {

			this.position = position;

			return this;

		}

		/**
		 * Sets the quaternion.
		 *
		 * @param {Quaternion} quaternion - A quaternion.
		 * @return {RotationManager} This manager.
		 */

		setQuaternion(quaternion) {

			this.quaternion = quaternion;

			return this;

		}

		/**
		 * Sets the target.
		 *
		 * @param {Vector3} target - A target.
		 * @return {RotationManager} This manager.
		 */

		setTarget(target) {

			this.target = target;

			return this;

		}

		/**
		 * Translates a position by a specific distance along a given axis.
		 *
		 * @private
		 * @param {Vector3} axis - The axis.
		 * @param {Vector3} distance - The distance.
		 */

		translateOnAxis(axis, distance) {

			v$8.copy(axis).applyQuaternion(this.quaternion).multiplyScalar(distance);

			this.position.add(v$8);

			if(this.settings.general.orbit) {

				this.target.add(v$8);

			}

		}

		/**
		 * Modifies the position based on the current movement state and elapsed time.
		 *
		 * @private
		 * @param {Number} delta - The time since the last update in seconds.
		 */

		translate(delta) {

			const sensitivity = this.settings.sensitivity;
			const state = this.movementState;

			const step = delta * sensitivity.translation;

			if(state.backward) {

				this.translateOnAxis(z, step);

			} else if(state.forward) {

				this.translateOnAxis(z, -step);

			}

			if(state.right) {

				this.translateOnAxis(x, step);

			} else if(state.left) {

				this.translateOnAxis(x, -step);

			}

			if(state.up) {

				this.translateOnAxis(y, step);

			} else if(state.down) {

				this.translateOnAxis(y, -step);

			}

		}

		/**
		 * Updates movement calculations based on time.
		 *
		 * @param {Number} delta - The time since the last update in seconds.
		 */

		update(delta) {

			if(this.settings.translation.enabled) {

				this.translate(delta);

			}

		}

		/**
		 * Moves to the given position.
		 *
		 * @param {Vector3} position - The position.
		 * @return {DeltaControls} This instance.
		 */

		moveTo(position) {

			if(this.settings.general.orbit) {

				this.target.copy(position);

			} else {

				this.position.copy(position);

			}

			return this;

		}

	}

	/**
	 * A handler for the KeyCode Proxy.
	 *
	 * @type {Object}
	 * @private
	 */

	const KeyCodeHandler = {

		/**
		 * Handles key code lookups.
		 *
		 * @param {Object} target - The KeyCode enumeration.
		 * @param {String} name - A potential key code identifier.
		 * @return {Number} A key code.
		 */

		get(target, name) {

			return (name in target) ?
				target[name] : (name.length === 1) ?
					name.toUpperCase().charCodeAt(0) : undefined;

		}

	};

	/**
	 * An enumeration of key codes.
	 *
	 * Special keys are listed explicitly. Simple character keys [A-Z] are computed
	 * on demand. For instance, `KeyCode.A` will return the key code for the A key.
	 *
	 * @type {Object}
	 * @property {Number} BACKSPACE - Backspace key.
	 * @property {Number} TAB - Tab key.
	 * @property {Number} ENTER - Enter key.
	 * @property {Number} SHIFT - Shift key.
	 * @property {Number} CTRL - Control key.
	 * @property {Number} ALT - Alt key.
	 * @property {Number} PAUSE - Pause key.
	 * @property {Number} CAPS_LOCK - Caps lock key.
	 * @property {Number} ESCAPE - Escape key.
	 * @property {Number} SPACE - Space bar.
	 * @property {Number} PAGE_UP - Page up key.
	 * @property {Number} PAGE_DOWN - Page down key.
	 * @property {Number} END - End key.
	 * @property {Number} HOME - Home key.
	 * @property {Number} LEFT - Left arrow key.
	 * @property {Number} UP - Up arrow key.
	 * @property {Number} RIGHT - Right arrow key.
	 * @property {Number} DOWN - Down arrow key.
	 * @property {Number} INSERT - Insert key.
	 * @property {Number} DELETE - Delete key.
	 * @property {Number} META_LEFT - Left OS key.
	 * @property {Number} META_RIGHT - Right OS key.
	 * @property {Number} SELECT - Select key.
	 * @property {Number} NUMPAD_0 - Numpad 0 key.
	 * @property {Number} NUMPAD_1 - Numpad 1 key.
	 * @property {Number} NUMPAD_2 - Numpad 2 key.
	 * @property {Number} NUMPAD_3 - Numpad 3 key.
	 * @property {Number} NUMPAD_4 - Numpad 4 key.
	 * @property {Number} NUMPAD_5 - Numpad 5 key.
	 * @property {Number} NUMPAD_6 - Numpad 6 key.
	 * @property {Number} NUMPAD_7 - Numpad 7 key.
	 * @property {Number} NUMPAD_8 - Numpad 8 key.
	 * @property {Number} NUMPAD_9 - Numpad 9 key.
	 * @property {Number} MULTIPLY - Multiply key.
	 * @property {Number} ADD - Add key.
	 * @property {Number} SUBTRACT - Subtract key.
	 * @property {Number} DECIMAL_POINT - Decimal point key.
	 * @property {Number} DIVIDE - Divide key.
	 * @property {Number} F1 - F1 key.
	 * @property {Number} F2 - F2 key.
	 * @property {Number} F3 - F3 key.
	 * @property {Number} F4 - F4 key.
	 * @property {Number} F5 - F5 key.
	 * @property {Number} F6 - F6 key.
	 * @property {Number} F7 - F7 key.
	 * @property {Number} F8 - F8 key.
	 * @property {Number} F9 - F9 key.
	 * @property {Number} F10 - F10 key.
	 * @property {Number} F11 - F11 key.
	 * @property {Number} F12 - F12 key.
	 * @property {Number} NUM_LOCK - Num lock key.
	 * @property {Number} SCROLL_LOCK - Scroll lock key.
	 * @property {Number} SEMICOLON - Semicolon key.
	 * @property {Number} EQUAL_SIGN - Equal sign key.
	 * @property {Number} COMMA - Comma key.
	 * @property {Number} DASH - Dash key.
	 * @property {Number} PERIOD - Period key.
	 * @property {Number} FORWARD_SLASH - Forward slash key.
	 * @property {Number} GRAVE_ACCENT - Grave accent key.
	 * @property {Number} OPEN_BRACKET - Open bracket key.
	 * @property {Number} BACK_SLASH - Back slash key.
	 * @property {Number} CLOSE_BRACKET - Close bracket key.
	 * @property {Number} SINGLE_QUOTE - Single quote key.
	 */

	const KeyCode = new Proxy({

		BACKSPACE: 8,
		TAB: 9,
		ENTER: 13,

		SHIFT: 16,
		CTRL: 17,
		ALT: 18,

		PAUSE: 19,
		CAPS_LOCK: 20,
		ESCAPE: 27,

		SPACE: 32,
		PAGE_UP: 33,
		PAGE_DOWN: 34,
		END: 35,
		HOME: 36,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,

		INSERT: 45,
		DELETE: 46,

		META_LEFT: 91,
		META_RIGHT: 92,
		SELECT: 93,

		NUMPAD_0: 96,
		NUMPAD_1: 97,
		NUMPAD_2: 98,
		NUMPAD_3: 99,
		NUMPAD_4: 100,
		NUMPAD_5: 101,
		NUMPAD_6: 102,
		NUMPAD_7: 103,
		NUMPAD_8: 104,
		NUMPAD_9: 105,
		MULTIPLY: 106,
		ADD: 107,
		SUBTRACT: 109,
		DECIMAL_POINT: 110,
		DIVIDE: 111,

		F1: 112,
		F2: 113,
		F3: 114,
		F4: 115,
		F5: 116,
		F6: 117,
		F7: 118,
		F8: 119,
		F9: 120,
		F10: 121,
		F11: 122,
		F12: 123,

		NUM_LOCK: 144,
		SCROLL_LOCK: 145,

		SEMICOLON: 186,
		EQUAL_SIGN: 187,
		COMMA: 188,
		DASH: 189,
		PERIOD: 190,
		FORWARD_SLASH: 191,
		GRAVE_ACCENT: 192,

		OPEN_BRACKET: 219,
		BACK_SLASH: 220,
		CLOSE_BRACKET: 221,
		SINGLE_QUOTE: 222

	}, KeyCodeHandler);

	/**
	 * General settings.
	 */

	class GeneralSettings {

		/**
		 * Constructs new general settings.
		 */

		constructor() {

			/**
			 * Indicates whether third person perspective is active.
			 *
			 * Should not be modified directly. See {@link DeltaControls#setOrbit}.
			 *
			 * @type {Boolean}
			 */

			this.orbit = true;

		}

		/**
		 * Copies the given general settings.
		 *
		 * @param {GeneralSettings} settings - General settings.
		 * @return {GeneralSettings} This instance.
		 */

		copy(settings) {

			this.orbit = settings.orbit;

			return this;

		}

		/**
		 * Clones this general settings instance.
		 *
		 * @return {GeneralSettings} The cloned general settings.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

	}

	/**
	 * Key bindings.
	 */

	class KeyBindings {

		/**
		 * Constructs new key bindings.
		 */

		constructor() {

			/**
			 * The default key bindings.
			 *
			 * @type {Map}
			 */

			this.defaultActions = new Map();

			/**
			 * The current key bindings.
			 *
			 * @type {Map}
			 */

			this.actions = new Map();

		}

		/**
		 * Resets the current bindings to match the default bindings.
		 *
		 * @return {KeyBindings} This key bindings instance.
		 */

		reset() {

			this.actions = new Map(this.defaultActions);

			return this;

		}

		/**
		 * Establishes default key bindings and resets the current bindings.
		 *
		 * @param {Map} actions - A map of actions. Each key must be a key code and each value must be a number.
		 * @return {KeyBindings} This key bindings instance.
		 */

		setDefault(actions) {

			this.defaultActions = actions;

			return this.reset();

		}

		/**
		 * Copies the given key bindings, including the default bindings.
		 *
		 * @param {KeyBindings} keyBindings - Key bindings.
		 * @return {KeyBindings} This key bindings instance.
		 */

		copy(keyBindings) {

			this.defaultActions = new Map(keyBindings.defaultActions);
			this.actions = new Map(keyBindings.actions);

			return this;

		}

		/**
		 * Clears the default key bindings.
		 *
		 * @return {KeyBindings} This key bindings instance.
		 */

		clearDefault() {

			this.defaultActions.clear();

			return this;

		}

		/**
		 * Clears the current key bindings.
		 *
		 * @return {KeyBindings} This key bindings instance.
		 */

		clear() {

			this.actions.clear();

			return this;

		}

		/**
		 * Clones these key bindings.
		 *
		 * @return {KeyBindings} The cloned key bindings.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Checks if the given key is bound to an action.
		 *
		 * @param {KeyCode} keyCode - A key code.
		 * @return {Boolean} Whether the given key is bound to an action.
		 */

		has(keyCode) {

			return this.actions.has(keyCode);

		}

		/**
		 * Returns the action that is bound to the given key.
		 *
		 * @param {KeyCode} keyCode - A key code.
		 * @return {Number} The action, or undefined if the key is not bound to any action.
		 */

		get(keyCode) {

			return this.actions.get(keyCode);

		}

		/**
		 * Binds a key to an action.
		 *
		 * @param {KeyCode} keyCode - A key code.
		 * @param {Number} action - An action.
		 * @return {KeyBindings} This instance.
		 */

		set(keyCode, action) {

			this.actions.set(keyCode, action);

			return this;

		}

		/**
		 * Unbinds a key.
		 *
		 * @param {KeyCode} keyCode - A key code.
		 * @return {Boolean} Whether the key bindings existed or not.
		 */

		delete(keyCode) {

			return this.actions.delete(keyCode);

		}

		/**
		 * Creates a plain representation of this instance.
		 *
		 * @return {String} The plain representation.
		 */

		toJSON() {

			return {
				defaultActions: [...this.defaultActions],
				actions: [...this.actions]
			};

		}

	}

	/**
	 * Pointer settings.
	 */

	class PointerSettings {

		/**
		 * Constructs new pointer settings.
		 */

		constructor() {

			/**
			 * Whether the pointer buttons must be held down to have an effect.
			 *
			 * This setting only applies when the pointer is locked.
			 *
			 * @type {Boolean}
			 */

			this.hold = false;

			/**
			 * Whether the pointer should be locked on click events.
			 *
			 * @type {Boolean}
			 */

			this.lock = true;

		}

		/**
		 * Copies the given pointer settings.
		 *
		 * @param {PointerSettings} settings - Pointer settings.
		 * @return {PointerSettings} This instance.
		 */

		copy(settings) {

			this.hold = settings.hold;
			this.lock = settings.lock;

			return this;

		}

		/**
		 * Clones this pointer settings instance.
		 *
		 * @return {PointerSettings} The cloned pointer settings.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

	}

	/**
	 * Rotation settings.
	 */

	class RotationSettings {

		/**
		 * Constructs new rotation settings.
		 */

		constructor() {

			/**
			 * The up vector. Must be normalized.
			 *
			 * @type {Vector3}
			 */

			this.up = new Vector3();
			this.up.copy(y);

			/**
			 * A pivot offset. Only affects third person orbiting.
			 *
			 * @type {Vector3}
			 */

			this.pivotOffset = new Vector3();

			/**
			 * The minimum azimuthal angle in radians. Range: [-Math.PI, Math.PI].
			 *
			 * @type {Number}
			 */

			this.minAzimuthalAngle = -Infinity;

			/**
			 * The maximum azimuthal angle in radians. Range: [-Math.PI, Math.PI].
			 *
			 * @type {Number}
			 */

			this.maxAzimuthalAngle = Infinity;

			/**
			 * The minimum polar angle in radians. Range: [0, Math.PI].
			 *
			 * @type {Number}
			 */

			this.minPolarAngle = 0.0;

			/**
			 * The maximum polar angle in radians. Range: [0, Math.PI].
			 *
			 * @type {Number}
			 */

			this.maxPolarAngle = Math.PI;

			/**
			 * Indicates whether the horizontal rotation should be inverted.
			 *
			 * @type {Boolean}
			 */

			this.invertX = false;

			/**
			 * Indicates whether the vertical rotation should be inverted.
			 *
			 * @type {Boolean}
			 */

			this.invertY = false;

		}

		/**
		 * Copies the given rotation settings.
		 *
		 * @param {RotationSettings} settings - Rotation settings.
		 * @return {RotationSettings} This instance.
		 */

		copy(settings) {

			this.up.copy(settings.up);
			this.pivotOffset.copy(settings.pivotOffset);

			this.minAzimuthalAngle = (settings.minAzimuthalAngle !== null) ? settings.minAzimuthalAngle : -Infinity;
			this.maxAzimuthalAngle = (settings.maxAzimuthalAngle !== null) ? settings.maxAzimuthalAngle : Infinity;

			this.minPolarAngle = settings.minPolarAngle;
			this.maxPolarAngle = settings.maxPolarAngle;

			this.invertX = settings.invertX;
			this.invertY = settings.invertY;

			return this;

		}

		/**
		 * Clones this rotation settings instance.
		 *
		 * @return {RotationSettings} The cloned rotation settings.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

	}

	/**
	 * Sensitivity settings.
	 */

	class SensitivitySettings {

		/**
		 * Constructs new sensitivity settings.
		 */

		constructor() {

			/**
			 * The rotation sensitivity.
			 *
			 * @type {Number}
			 */

			this.rotation = 0.0025;

			/**
			 * The translation sensitivity.
			 *
			 * @type {Number}
			 */

			this.translation = 1.0;

			/**
			 * The zoom sensitivity.
			 *
			 * @type {Number}
			 */

			this.zoom = 0.1;

		}

		/**
		 * Copies the given sensitivity settings.
		 *
		 * @param {SensitivitySettings} settings - Sensitivity settings.
		 * @return {SensitivitySettings} This instance.
		 */

		copy(settings) {

			this.rotation = settings.rotation;
			this.translation = settings.translation;
			this.zoom = settings.zoom;

			return this;

		}

		/**
		 * Clones these sensitivity settings.
		 *
		 * @return {SensitivitySettings} The cloned sensitivity settings.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

	}

	/**
	 * Translation settings.
	 */

	class TranslationSettings {

		/**
		 * Constructs new translation settings.
		 */

		constructor() {

			/**
			 * Whether positional translation is enabled.
			 *
			 * @type {Boolean}
			 */

			this.enabled = true;

		}

		/**
		 * Copies the given translation settings.
		 *
		 * @param {TranslationSettings} settings - Translation settings.
		 * @return {TranslationSettings} This instance.
		 */

		copy(settings) {

			this.enabled = settings.enabled;

			return this;

		}

		/**
		 * Clones this translation settings instance.
		 *
		 * @return {RotationSettings} The cloned translation settings.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

	}

	/**
	 * Zoom settings.
	 */

	class ZoomSettings {

		/**
		 * Constructs new zoom settings.
		 */

		constructor() {

			/**
			 * Whether zooming is enabled.
			 *
			 * @type {Boolean}
			 */

			this.enabled = true;

			/**
			 * Indicates whether the zoom controls should be inverted.
			 *
			 * @type {Boolean}
			 */

			this.invert = false;

			/**
			 * The minimum zoom distance.
			 *
			 * @type {Number}
			 */

			this.minDistance = 1e-6;

			/**
			 * The maximum zoom distance.
			 *
			 * @type {Number}
			 */

			this.maxDistance = Infinity;

		}

		/**
		 * Copies the given zoom settings.
		 *
		 * @param {ZoomSettings} settings - Zoom settings.
		 * @return {ZoomSettings} This instance.
		 */

		copy(settings) {

			this.enabled = settings.enabled;
			this.invert = settings.invert;
			this.minDistance = settings.minDistance;
			this.maxDistance = settings.maxDistance;

			return this;

		}

		/**
		 * Clones this zoom settings instance.
		 *
		 * @return {ZoomSettings} The cloned zoom settings.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

	}

	/**
	 * Control settings.
	 */

	class Settings {

		/**
		 * Constructs new settings.
		 */

		constructor() {

			/**
			 * General settings.
			 *
			 * @type {GeneralSettings}
			 */

			this.general = new GeneralSettings();

			/**
			 * Key bindings.
			 *
			 * @type {KeyBindings}
			 */

			this.keyBindings = new KeyBindings();
			this.keyBindings.setDefault(new Map([

				[KeyCode.W, Action.MOVE_FORWARD],
				[KeyCode.UP, Action.MOVE_FORWARD],

				[KeyCode.A, Action.MOVE_LEFT],
				[KeyCode.LEFT, Action.MOVE_LEFT],

				[KeyCode.S, Action.MOVE_BACKWARD],
				[KeyCode.DOWN, Action.MOVE_BACKWARD],

				[KeyCode.D, Action.MOVE_RIGHT],
				[KeyCode.RIGHT, Action.MOVE_RIGHT],

				[KeyCode.X, Action.MOVE_DOWN],
				[KeyCode.SPACE, Action.MOVE_UP],

				[KeyCode.PAGE_DOWN, Action.ZOOM_OUT],
				[KeyCode.PAGE_UP, Action.ZOOM_IN]

			]));

			/**
			 * Pointer settings.
			 *
			 * @type {PointerSettings}
			 */

			this.pointer = new PointerSettings();

			/**
			 * Rotation settings.
			 *
			 * @type {RotationSettings}
			 */

			this.rotation = new RotationSettings();

			/**
			 * Sensitivity settings.
			 *
			 * @type {SensitivitySettings}
			 */

			this.sensitivity = new SensitivitySettings();

			/**
			 * Translation settings.
			 *
			 * @type {TranslationSettings}
			 */

			this.translation = new TranslationSettings();

			/**
			 * Zoom settings.
			 *
			 * @type {ZoomSettings}
			 */

			this.zoom = new ZoomSettings();

		}

		/**
		 * Copies the given settings.
		 *
		 * @param {Settings} settings - Settings.
		 * @return {Settings} This instance.
		 */

		copy(settings) {

			this.general.copy(settings.general);
			this.keyBindings.copy(settings.keyBindings);
			this.pointer.copy(settings.pointer);
			this.rotation.copy(settings.rotation);
			this.sensitivity.copy(settings.sensitivity);
			this.translation.copy(settings.translation);
			this.zoom.copy(settings.zoom);

			return this;

		}

		/**
		 * Clones these settings.
		 *
		 * @return {Settings} The cloned settings.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Saves the current settings in the form of a JSON blob.
		 *
		 * @return {DOMString} A URL to the exported settings.
		 */

		toDataURL() {

			return URL.createObjectURL(new Blob([JSON.stringify(this)], { type: "text/json" }));

		}

	}

	/**
	 * The Strategy interface.
	 */

	class Strategy {

		/**
		 * Executes this strategy.
		 *
		 * @throws {Error} An error is thrown if the method is not overridden.
		 * @param {Boolean} flag - A flag.
		 */

		execute(flag) {

			throw new Error("Strategy#execute method not implemented!");

		}

	}

	/**
	 * A movement strategy.
	 */

	class MovementStrategy extends Strategy {

		/**
		 * Constructs a new movement strategy.
		 *
		 * @param {MovementState} movementState - A movement state.
		 * @param {Direction} direction - A direction.
		 */

		constructor(movementState, direction) {

			super();

			/**
			 * A movement state.
			 *
			 * @type {MovementState}
			 * @private
			 */

			this.movementState = movementState;

			/**
			 * A direction.
			 *
			 * @type {Direction}
			 * @private
			 */

			this.direction = direction;

		}

		/**
		 * Executes this strategy.
		 *
		 * @param {Boolean} flag - A flag.
		 */

		execute(flag) {

			const state = this.movementState;

			switch(this.direction) {

				case Direction.FORWARD:
					state.forward = flag;
					break;

				case Direction.LEFT:
					state.left = flag;
					break;

				case Direction.BACKWARD:
					state.backward = flag;
					break;

				case Direction.RIGHT:
					state.right = flag;
					break;

				case Direction.DOWN:
					state.down = flag;
					break;

				case Direction.UP:
					state.up = flag;
					break;

			}

		}

	}
	/**
	 * An enumeration of movement directions.
	 *
	 * @type {Object}
	 * @property {Number} FORWARD - Move forward.
	 * @property {Number} LEFT - Move left.
	 * @property {Number} BACKWARD - Move backward.
	 * @property {Number} RIGHT - Move right.
	 * @property {Number} DOWN - Move down.
	 * @property {Number} UP - Move up.
	 */

	const Direction = {

		FORWARD: 0,
		LEFT: 1,
		BACKWARD: 2,
		RIGHT: 3,
		DOWN: 4,
		UP: 5

	};

	/**
	 * A zoom strategy.
	 */

	class ZoomStrategy extends Strategy {

		/**
		 * Constructs a new zoom strategy.
		 *
		 * @param {RotationManager} rotationManager - A rotation manager.
		 * @param {Boolean} zoomIn - Whether this strategy should zoom in.
		 */

		constructor(rotationManager, zoomIn) {

			super();

			/**
			 * A rotation manager.
			 *
			 * @type {RotationManager}
			 * @private
			 */

			this.rotationManager = rotationManager;

			/**
			 * Whether this strategy should zoom in.
			 *
			 * @type {Boolean}
			 * @private
			 */

			this.zoomIn = zoomIn;

		}

		/**
		 * Executes this strategy.
		 *
		 * @param {Boolean} flag - A flag.
		 */

		execute(flag) {

			// Only act on key down events.
			if(flag) {

				this.rotationManager.zoom(this.zoomIn ? -1 : 1);

			}

		}

	}

	/**
	 * Movement controls driven by user input.
	 *
	 * @implements {Disposable}
	 * @implements {EventListener}
	 */

	class DeltaControls {

		/**
		 * Constructs new controls.
		 *
		 * @param {Vector3} position - A position.
		 * @param {Quaternion} quaternion - A quaternion.
		 * @param {HTMLElement} [dom=document.body] - A DOM element. Acts as the primary event target.
		 */

		constructor(position = null, quaternion = null, dom = document.body) {

			/**
			 * A DOM element. Acts as the primary event target.
			 *
			 * @type {HTMLElement}
			 * @private
			 */

			this.dom = dom;

			/**
			 * The position that will be modified.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.position = position;

			/**
			 * The quaternion that will be modified.
			 *
			 * @type {Quaternion}
			 * @private
			 */

			this.quaternion = quaternion;

			/**
			 * The target.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.target = new Vector3();

			/**
			 * The control settings.
			 *
			 * @type {Settings}
			 */

			this.settings = new Settings();

			/**
			 * A rotation manager.
			 *
			 * @type {RotationManager}
			 * @private
			 */

			this.rotationManager = new RotationManager(position, quaternion, this.target, this.settings);

			/**
			 * A translation manager.
			 *
			 * @type {TranslationManager}
			 * @private
			 */

			this.translationManager = new TranslationManager(position, quaternion, this.target, this.settings);

			/**
			 * A map that links actions to specific strategies.
			 *
			 * @type {Map}
			 * @private
			 */

			this.strategies = ((rotationManager, translationManager) => {

				const state = translationManager.movementState;

				return new Map([

					[Action.MOVE_FORWARD, new MovementStrategy(state, Direction.FORWARD)],
					[Action.MOVE_LEFT, new MovementStrategy(state, Direction.LEFT)],
					[Action.MOVE_BACKWARD, new MovementStrategy(state, Direction.BACKWARD)],
					[Action.MOVE_RIGHT, new MovementStrategy(state, Direction.RIGHT)],
					[Action.MOVE_DOWN, new MovementStrategy(state, Direction.DOWN)],
					[Action.MOVE_UP, new MovementStrategy(state, Direction.UP)],
					[Action.ZOOM_OUT, new ZoomStrategy(rotationManager, false)],
					[Action.ZOOM_IN, new ZoomStrategy(rotationManager, true)]

				]);

			})(this.rotationManager, this.translationManager);

			/**
			 * A screen position.
			 *
			 * @type {Vector2}
			 * @private
			 */

			this.lastScreenPosition = new Vector2();

			/**
			 * Indicates whether the user is currently holding the pointer button down.
			 *
			 * @type {Boolean}
			 * @private
			 */

			this.dragging = false;

			/**
			 * The internal enabled state.
			 *
			 * @type {Boolean}
			 * @private
			 */

			this.enabled = false;

			if(position !== null && quaternion !== null) {

				this.lookAt(this.target);

				if(dom !== null) {

					this.setEnabled();

				}

			}

		}

		/**
		 * Returns the DOM element.
		 *
		 * @return {HTMLElement} The DOM element.
		 */

		getDom() {

			return this.dom;

		}

		/**
		 * Returns the position.
		 *
		 * @return {Vector3} The position.
		 */

		getPosition() {

			return this.position;

		}

		/**
		 * Returns the quaternion.
		 *
		 * @return {Quaternion} The quaternion.
		 */

		getQuaternion() {

			return this.quaternion;

		}

		/**
		 * Returns the current target.
		 *
		 * @param {Vector3} [target] - A vector to store the target in. If none is provided, a new one will be created.
		 * @return {Vector3} The current target.
		 */

		getTarget(target = new Vector3()) {

			target.copy(this.target);

			if(!this.settings.general.orbit) {

				// The target is relative to the position.
				target.add(this.position);

			}

			return target;

		}

		/**
		 * Returns the current view direction.
		 *
		 * @param {Vector3} [view] - A vector to store the direction in. If none is provided, a new one will be created.
		 * @return {Vector3} The normalized view direction.
		 */

		getViewDirection(view = new Vector3()) {

			return this.rotationManager.getViewDirection(view);

		}

		/**
		 * Sets the DOM element.
		 *
		 * @param {HTMLElement} dom - The new DOM element.
		 * @return {DeltaControls} This instance.
		 */

		setDom(dom) {

			const enabled = this.enabled;

			if(dom !== null) {

				if(enabled) {

					this.setEnabled(false);

				}

				this.dom = dom;
				this.setEnabled(enabled);

			}

			return this;

		}

		/**
		 * Sets the position vector.
		 *
		 * @param {Vector3} position - The new position vector.
		 * @return {DeltaControls} This instance.
		 */

		setPosition(position) {

			this.position = position;
			this.rotationManager.setPosition(position);
			this.translationManager.setPosition(position);

			return this.lookAt(this.target);

		}

		/**
		 * Sets the quaternion.
		 *
		 * @param {Quaternion} quaternion - The new quaternion.
		 * @return {DeltaControls} This instance.
		 */

		setQuaternion(quaternion) {

			this.quaternion = quaternion;
			this.rotationManager.setQuaternion(quaternion);
			this.translationManager.setQuaternion(quaternion);

			return this.lookAt(this.target);

		}

		/**
		 * Sets the target.
		 *
		 * @param {Vector3} target - The new target.
		 * @return {DeltaControls} This instance.
		 */

		setTarget(target) {

			this.target = target;
			this.rotationManager.setTarget(target);
			this.translationManager.setTarget(target);

			return this.lookAt(this.target);

		}

		/**
		 * Changes the control mode to first or third person perspective.
		 *
		 * @param {Boolean} orbit - Whether the third person perspective should be enabled.
		 * @return {DeltaControls} This instance.
		 */

		setOrbitEnabled(orbit) {

			const general = this.settings.general;

			if(general.orbit !== orbit) {

				this.getTarget(this.target);
				general.orbit = orbit;
				this.lookAt(this.target);

			}

			return this;

		}

		/**
		 * Copies the given controls.
		 *
		 * @param {DeltaControls} controls - A controls instance.
		 * @return {DeltaControls} This instance.
		 */

		copy(controls) {

			this.dom = controls.getDom();
			this.position = controls.getPosition();
			this.quaternion = controls.getQuaternion();
			this.target = controls.getTarget();

			this.settings.copy(controls.settings);

			this.rotationManager.setPosition(this.position).setQuaternion(this.quaternion).setTarget(this.target);
			this.translationManager.setPosition(this.position).setQuaternion(this.quaternion).setTarget(this.target);

			return this.lookAt(this.target);

		}

		/**
		 * Clones this instance.
		 *
		 * @return {DeltaControls} the cloned controls.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Handles pointer move events.
		 *
		 * @private
		 * @param {MouseEvent} event - A pointer event.
		 */

		handlePointerMoveEvent(event) {

			const settings = this.settings;
			const pointer = settings.pointer;
			const sensitivity = settings.sensitivity;
			const rotationManager = this.rotationManager;
			const lastScreenPosition = this.lastScreenPosition;

			let movementX, movementY;

			if(document.pointerLockElement === this.dom) {

				if(!pointer.hold || this.dragging) {

					rotationManager.adjustSpherical(
						event.movementX * sensitivity.rotation,
						event.movementY * sensitivity.rotation
					).updateQuaternion();

				}

			} else {

				// Compensate for inconsistent web APIs.
				movementX = event.screenX - lastScreenPosition.x;
				movementY = event.screenY - lastScreenPosition.y;

				lastScreenPosition.set(event.screenX, event.screenY);

				rotationManager.adjustSpherical(
					movementX * sensitivity.rotation,
					movementY * sensitivity.rotation
				).updateQuaternion();

			}

		}

		/**
		 * Handles touch move events.
		 *
		 * @private
		 * @param {TouchEvent} event - A touch event.
		 */

		handleTouchMoveEvent(event) {

			const sensitivity = this.settings.sensitivity;
			const rotationManager = this.rotationManager;
			const lastScreenPosition = this.lastScreenPosition;
			const touch = event.touches[0];

			// Compensate for inconsistent web APIs.
			const movementX = touch.screenX - lastScreenPosition.x;
			const movementY = touch.screenY - lastScreenPosition.y;

			lastScreenPosition.set(touch.screenX, touch.screenY);

			// Don't produce a mouse move event.
			event.preventDefault();

			rotationManager.adjustSpherical(
				movementX * sensitivity.rotation,
				movementY * sensitivity.rotation
			).updateQuaternion();

		}

		/**
		 * Handles main pointer button events.
		 *
		 * @private
		 * @param {MouseEvent} event - A pointer event.
		 * @param {Boolean} pressed - Whether the pointer button has been pressed down.
		 */

		handleMainPointerButton(event, pressed) {

			this.dragging = pressed;

			if(this.settings.pointer.lock) {

				this.setPointerLocked();

			} else {

				if(pressed) {

					this.lastScreenPosition.set(event.screenX, event.screenY);
					this.dom.addEventListener("mousemove", this);

				} else {

					this.dom.removeEventListener("mousemove", this);

				}

			}

		}

		/**
		 * Handles auxiliary pointer button events.
		 *
		 * @private
		 * @param {MouseEvent} event - A pointer event.
		 * @param {Boolean} pressed - Whether the pointer button has been pressed down.
		 */

		handleAuxiliaryPointerButton(event, pressed) {

		}

		/**
		 * Handles secondary pointer button events.
		 *
		 * @private
		 * @param {MouseEvent} event - A pointer event.
		 * @param {Boolean} pressed - Whether the pointer button has been pressed down.
		 */

		handleSecondaryPointerButton(event, pressed) {

		}

		/**
		 * Handles pointer events.
		 *
		 * @private
		 * @param {MouseEvent} event - A pointer event.
		 * @param {Boolean} pressed - Whether the pointer button has been pressed down.
		 */

		handlePointerButtonEvent(event, pressed) {

			event.preventDefault();

			switch(event.button) {

				case PointerButton.MAIN:
					this.handleMainPointerButton(event, pressed);
					break;

				case PointerButton.AUXILIARY:
					this.handleAuxiliaryPointerButton(event, pressed);
					break;

				case PointerButton.SECONDARY:
					this.handleSecondaryPointerButton(event, pressed);
					break;

			}

		}

		/**
		 * Handles touch start and end events.
		 *
		 * @private
		 * @param {TouchEvent} event - A touch event.
		 * @param {Boolean} start - Whether the event is a touch start event.
		 */

		handleTouchEvent(event, start) {

			const touch = event.touches[0];

			// Don't produce mouse events.
			event.preventDefault();

			if(start) {

				this.lastScreenPosition.set(touch.screenX, touch.screenY);
				this.dom.addEventListener("touchmove", this);

			} else {

				this.dom.removeEventListener("touchmove", this);

			}

		}

		/**
		 * Handles keyboard events.
		 *
		 * @private
		 * @param {KeyboardEvent} event - A keyboard event.
		 * @param {Boolean} pressed - Whether the key has been pressed down.
		 */

		handleKeyboardEvent(event, pressed) {

			const keyBindings = this.settings.keyBindings;

			if(keyBindings.has(event.keyCode)) {

				event.preventDefault();

				this.strategies.get(keyBindings.get(event.keyCode)).execute(pressed);

			}

		}

		/**
		 * Handles wheel events.
		 *
		 * @private
		 * @param {WheelEvent} event - A wheel event.
		 */

		handleWheelEvent(event) {

			this.rotationManager.zoom(Math.sign(event.deltaY));

		}

		/**
		 * Enables or disables controls based on the pointer lock state.
		 *
		 * @private
		 */

		handlePointerLockEvent() {

			if(document.pointerLockElement === this.dom) {

				this.dom.addEventListener("mousemove", this);

			} else {

				this.dom.removeEventListener("mousemove", this);

			}

		}

		/**
		 * Handles events.
		 *
		 * @param {Event} event - An event.
		 */

		handleEvent(event) {

			switch(event.type) {

				case "mousemove":
					this.handlePointerMoveEvent(event);
					break;

				case "touchmove":
					this.handleTouchMoveEvent(event);
					break;

				case "mousedown":
					this.handlePointerButtonEvent(event, true);
					break;

				case "mouseup":
					this.handlePointerButtonEvent(event, false);
					break;

				case "touchstart":
					this.handleTouchEvent(event, true);
					break;

				case "touchend":
					this.handleTouchEvent(event, false);
					break;

				case "keydown":
					this.handleKeyboardEvent(event, true);
					break;

				case "keyup":
					this.handleKeyboardEvent(event, false);
					break;

				case "wheel":
					this.handleWheelEvent(event);
					break;

				case "pointerlockchange":
					this.handlePointerLockEvent();
					break;

			}

		}

		/**
		 * Updates movement and rotation calculations based on time.
		 *
		 * This method should be called before a new frame is rendered.
		 *
		 * @param {Number} delta - The time since the last update in seconds.
		 */

		update(delta) {

			this.rotationManager.update(delta);
			this.translationManager.update(delta);

		}

		/**
		 * Moves to the given position.
		 *
		 * @param {Vector3} position - The position.
		 * @return {DeltaControls} This instance.
		 */

		moveTo(position) {

			this.rotationManager.moveTo(position);

			return this;

		}

		/**
		 * Looks at the given point.
		 *
		 * @param {Vector3} point - The target point.
		 * @return {DeltaControls} This instance.
		 */

		lookAt(point) {

			this.rotationManager.lookAt(point);

			return this;

		}

		/**
		 * Locks or unlocks the pointer.
		 *
		 * @private
		 * @param {Boolean} [locked=true] - Whether the pointer should be locked.
		 */

		setPointerLocked(locked = true) {

			if(locked) {

				if(document.pointerLockElement !== this.dom && this.dom.requestPointerLock !== undefined) {

					this.dom.requestPointerLock();

				}

			} else if(document.exitPointerLock !== undefined) {

				document.exitPointerLock();

			}

		}

		/**
		 * Enables or disables the controls.
		 *
		 * @param {Boolean} [enabled=true] - Whether the controls should be enabled or disabled.
		 * @return {DeltaControls} This instance.
		 */

		setEnabled(enabled = true) {

			const dom = this.dom;

			this.translationManager.movementState.reset();

			if(enabled && !this.enabled) {

				document.addEventListener("pointerlockchange", this);
				document.body.addEventListener("keyup", this);
				document.body.addEventListener("keydown", this);
				dom.addEventListener("mousedown", this);
				dom.addEventListener("mouseup", this);
				dom.addEventListener("touchstart", this);
				dom.addEventListener("touchend", this);
				dom.addEventListener("wheel", this);

			} else if(!enabled && this.enabled) {

				document.removeEventListener("pointerlockchange", this);
				document.body.removeEventListener("keyup", this);
				document.body.removeEventListener("keydown", this);
				dom.removeEventListener("mousedown", this);
				dom.removeEventListener("mouseup", this);
				dom.removeEventListener("touchstart", this);
				dom.removeEventListener("touchend", this);
				dom.removeEventListener("wheel", this);
				dom.removeEventListener("mousemove", this);
				dom.removeEventListener("touchmove", this);

			}

			this.setPointerLocked(false);
			this.enabled = enabled;

			return this;

		}

		/**
		 * Removes all event listeners and unlocks the pointer.
		 */

		dispose() {

			this.setEnabled(false);

		}

	}

	/**
	 * A collection of core components.
	 *
	 * @module delta-controls/core
	 */

	/**
	 * A collection of classes related to input values.
	 *
	 * @module delta-controls/input
	 */

	/**
	 * A collection of managers.
	 *
	 * @module delta-controls/managers
	 */

	/**
	 * A collection of specialised settings.
	 *
	 * @module delta-controls/settings
	 */

	/**
	 * A collection of control strategies.
	 *
	 * @module delta-controls/strategies
	 */

	/**
	 * Exposure of the library components.
	 *
	 * @module delta-controls
	 */

	/* eslint-disable */

	/**
	 * A post processing demo base class.
	 */

	class PostProcessingDemo extends Demo {
		/**
		 * Constructs a new post processing demo.
		 *
		 * @param {String} id - A unique identifier.
		 * @param {EffectComposer} composer - An effect composer.
		 */
		constructor(id, composer) {
			super(id);

			/**
			 * An effect composer.
			 *
			 * @type {EffectComposer}
			 * @protected
			 */
			this.composer = composer;

			/**
			 * A render pass that renders to screen.
			 *
			 * @type {RenderPass}
			 */
			this.renderPass = new RenderPass(this.scene, null);
			this.renderPass.renderToScreen = true;
		}

		/**
		 * Loads the SMAA images.
		 *
		 * @protected
		 */
		loadSMAAImages() {
			const assets = this.assets;
			const loadingManager = this.loadingManager;

			const searchImage = new Image();
			const areaImage = new Image();

			searchImage.addEventListener("load", function() {
				assets.set("smaa-search", this);
				loadingManager.itemEnd("smaa-search");
			});

			areaImage.addEventListener("load", function() {
				assets.set("smaa-area", this);
				loadingManager.itemEnd("smaa-area");
			});

			// Register the new image assets.
			loadingManager.itemStart("smaa-search");
			loadingManager.itemStart("smaa-area");

			// Load the images asynchronously.
			searchImage.src = SMAAEffect.searchImageDataURL;
			areaImage.src = SMAAEffect.areaImageDataURL;
		}

		render(delta) {
			// Let the effect composer take care of rendering.
			this.composer.render(delta);
		}

		/**
		 * Resets this demo.
		 *
		 * @return {Demo} This demo.
		 */
		reset() {
			super.reset();

			const renderPass = new RenderPass(this.scene, null);
			renderPass.enabled = this.renderPass.enabled;
			renderPass.renderToScreen = true;
			this.renderPass = renderPass;

			return this;
		}
	}

	/* eslint-disable */

	/**
	 * A glitch demo setup.
	 */

	class GlitchDemo extends PostProcessingDemo {

		/**
		 * Constructs a new glitch demo.
		 *
		 * @param {EffectComposer} composer - An effect composer.
		 */
		constructor(composer) {
			super("glitch", composer);
			console.log(`I AM GLITCH DEMO`);
			this.effect = null;
			this.pass = null;
			this.object = null;
		}

		/**
		 * Loads scene assets.
		 *
		 * @return {Promise} A promise that will be fulfilled as soon as all assets have been loaded.
		 */
		load() {
			const assets = this.assets;
			const loadingManager = this.loadingManager;
			const textureLoader = new three.TextureLoader(loadingManager);
			const cubeTextureLoader = new three.CubeTextureLoader(loadingManager);

			const path = "textures/skies/space4/";
			const format = ".jpg";
			const urls = [
				path + "px" + format, path + "nx" + format,
				path + "py" + format, path + "ny" + format,
				path + "pz" + format, path + "nz" + format
			];

			return new Promise((resolve, reject) => {
				if(assets.size === 0) {
					loadingManager.onError = reject;
					loadingManager.onProgress = (item, loaded, total) => {
						if(loaded === total) {
							resolve();
						}
					};

					cubeTextureLoader.load(urls, function(textureCube) {
						assets.set("sky", textureCube);
					});

					textureLoader.load("textures/perturb.jpg", function(texture) {
						assets.set("perturbation-map", texture);
					});

					this.loadSMAAImages();
				} else {
					resolve();
				}
			});
		}

		/**
		 * Creates the scene.
		 */
		initialize() {
			const scene = this.scene;
			const assets = this.assets;
			const composer = this.composer;
			const renderer = composer.renderer;

			// Camera.
			const camera = new three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
			camera.position.set(6, 1, 6);
			camera.lookAt(scene.position);
			this.camera = camera;

			// Controls.
			const controls = new DeltaControls(camera.position, camera.quaternion, renderer.domElement);
			controls.settings.pointer.lock = false;
			controls.settings.translation.enabled = false;
			controls.settings.sensitivity.zoom = 1.0;
			controls.lookAt(scene.position);
			this.controls = controls;

			// Fog.
			scene.fog = new three.FogExp2(0x000000, 0.0025);
			renderer.setClearColor(scene.fog.color);

			// Sky.
			scene.background = assets.get("sky");

			// Lights.
			const ambientLight = new three.AmbientLight(0x666666);
			const directionalLight = new three.DirectionalLight(0xffbbaa);

			directionalLight.position.set(-1, 1, 1);
			directionalLight.target.position.copy(scene.position);

			scene.add(directionalLight);
			scene.add(ambientLight);

			// Random objects.
			const object = new three.Object3D();
			const geometry = new three.SphereBufferGeometry(1, 4, 4);

			let material, mesh;
			let i;

			for(i = 0; i < 100; ++i) {
				material = new three.MeshPhongMaterial({
					color: 0xffffff * Math.random(),
					flatShading: true
				});

				mesh = new three.Mesh(geometry, material);
				mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
				mesh.position.multiplyScalar(Math.random() * 10);
				mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
				mesh.scale.multiplyScalar(Math.random());
				object.add(mesh);
			}

			this.object = object;
			scene.add(object);

			// Passes.
			const smaaEffect = new SMAAEffect(assets.get("smaa-search"), assets.get("smaa-area"));
			smaaEffect.setEdgeDetectionThreshold(0.08);

			const chromaticAberrationEffect = new ChromaticAberrationEffect();

			const glitchEffect = new GlitchEffect({
				perturbationMap: assets.get("perturbation-map"),
				chromaticAberrationOffset: chromaticAberrationEffect.offset
			});

			const noiseEffect = new NoiseEffect({
				blendFunction: BlendFunction.COLOR_DODGE
			});

			noiseEffect.blendMode.opacity.value = 0.15;

			const smaaPass = new EffectPass(camera, smaaEffect);
			const glitchPass = new EffectPass(camera, glitchEffect, noiseEffect);
			const chromaticAberrationPass = new EffectPass(camera, chromaticAberrationEffect);

			this.renderPass.renderToScreen = false;
			chromaticAberrationPass.renderToScreen = true;

			this.effect = glitchEffect;

			composer.addPass(smaaPass);
			composer.addPass(glitchPass);
			composer.addPass(chromaticAberrationPass);
		}

		/**
		 * Renders this demo.
		 *
		 * @param {Number} delta - The time since the last frame in seconds.
		 */
		render(delta) {
			const object = this.object;
			const twoPI = 2.0 * Math.PI;

			object.rotation.x += 0.001;
			object.rotation.y += 0.005;

			if(object.rotation.x >= twoPI) {
				object.rotation.x -= twoPI;
			}

			if(object.rotation.y >= twoPI) {
				object.rotation.y -= twoPI;
			}

			super.render(delta);
		}

		/**
		 * Registers configuration options.
		 *
		 * @param {GUI} menu - A menu.
		 */
		registerOptions(menu) {
			const effect = this.effect;
			const perturbationMap = effect.getPerturbationMap();
			const uniforms = effect.uniforms;
			const delay = effect.delay;
			const duration = effect.duration;
			const strength = effect.strength;

			const params = {
				"glitch mode": effect.mode,
				"custom pattern": true,
				"min delay": delay.x,
				"max delay": delay.y,
				"min duration": duration.x,
				"max duration": duration.y,
				"weak glitches": strength.x,
				"strong glitches": strength.y,
				"glitch ratio": effect.ratio,
				"columns": uniforms.get("columns").value
			};

			menu.add(params, "glitch mode", GlitchMode).onChange(() => {
				effect.mode = Number.parseInt(params["glitch mode"]);
			});

			menu.add(params, "custom pattern").onChange(() => {
				if(params["custom pattern"]) {
					effect.setPerturbationMap(perturbationMap);
				} else {
					effect.setPerturbationMap(effect.generatePerturbationMap(64));
				}
			});

			menu.add(params, "min delay").min(0.0).max(2.0).step(0.001).onChange(() => {
				delay.x = params["min delay"];
			});

			menu.add(params, "max delay").min(2.0).max(4.0).step(0.001).onChange(() => {
				delay.y = params["max delay"];
			});

			menu.add(params, "min duration").min(0.0).max(0.6).step(0.001).onChange(() => {
				duration.x = params["min duration"];
			});

			menu.add(params, "max duration").min(0.6).max(1.8).step(0.001).onChange(() => {
				duration.y = params["max duration"];
			});

			menu.add(params, "weak glitches").min(0.0).max(1.0).step(0.001).onChange(() => {
				strength.x = params["weak glitches"];
			});

			menu.add(params, "strong glitches").min(0.0).max(1.0).step(0.001).onChange(() => {
				strength.y = params["strong glitches"];
			});

			menu.add(params, "glitch ratio").min(0.0).max(1.0).step(0.001).onChange(() => {
				effect.ratio = Number.parseFloat(params["glitch ratio"]);
			});

			menu.add(params, "columns").min(0.0).max(0.5).step(0.001).onChange(() => {
				uniforms.get("columns").value = params.columns;
			});
		}
	}

	/**
	 * A shock wave demo setup.
	 */

	class ShockWaveDemo extends PostProcessingDemo {

		/**
		 * Constructs a new shock wave demo.
		 *
		 * @param {EffectComposer} composer - An effect composer.
		 */

		constructor(composer) {

			super("shock-wave", composer);
			window.shockwave = this;
			/**
			 * An effect.
			 *
			 * @type {Effect}
			 * @private
			 */

			this.effect = null;

		}

		/**
		 * Loads scene assets.
		 *
		 * @return {Promise} A promise that will be fulfilled as soon as all assets have been loaded.
		 */

		load() {

			const assets = this.assets;
			const loadingManager = this.loadingManager;
			const cubeTextureLoader = new three.CubeTextureLoader(loadingManager);

			const path = "textures/skies/space3/";
			const format = ".jpg";
			const urls = [
				path + "px" + format, path + "nx" + format,
				path + "py" + format, path + "ny" + format,
				path + "pz" + format, path + "nz" + format
			];

			return new Promise((resolve, reject) => {

				if(assets.size === 0) {

					loadingManager.onError = reject;
					loadingManager.onProgress = (item, loaded, total) => {

						if(loaded === total) {

							resolve();

						}

					};

					cubeTextureLoader.load(urls, function(textureCube) {

						assets.set("sky", textureCube);

					});

					this.loadSMAAImages();

				} else {

					resolve();

				}

			});

		}

		/**
		 * Creates the scene.
		 */

		initialize() {

			const scene = this.scene;
			const assets = this.assets;
			const composer = this.composer;
			const renderer = composer.renderer;

			// Camera.

			const camera = new three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
			camera.position.set(5, 1, 5);
			camera.lookAt(scene.position);
			this.camera = camera;

			// Controls.

			const controls = new DeltaControls(camera.position, camera.quaternion, renderer.domElement);
			controls.settings.pointer.lock = false;
			controls.settings.translation.enabled = false;
			controls.settings.sensitivity.zoom = 1.0;
			controls.lookAt(scene.position);
			this.controls = controls;

			// Fog.

			scene.fog = new three.FogExp2(0x000000, 0.0025);
			renderer.setClearColor(scene.fog.color);

			// Sky.

			scene.background = assets.get("sky");

			// Lights.

			const ambientLight = new three.AmbientLight(0x666666);
			const directionalLight = new three.DirectionalLight(0xffbbaa);

			directionalLight.position.set(-1, 1, 1);
			directionalLight.target.position.copy(scene.position);

			scene.add(directionalLight);
			scene.add(ambientLight);

			// Objects.

			const geometry = new three.SphereBufferGeometry(1, 64, 64);
			const material = new three.MeshBasicMaterial({
				color: 0xffff00,
				envMap: assets.get("sky")
			});

			const mesh = new three.Mesh(geometry, material);
			scene.add(mesh);

			// Passes.

			// const smaaEffect = new SMAAEffect(assets.get("smaa-search"), assets.get("smaa-area"));

			const shockWaveEffect = new ShockWaveEffect(camera, mesh.position, {
				speed: 1.25,
				maxRadius: 0.5,
				waveSize: 0.2,
				amplitude: 0.05
			});
			window.shockWaveEffect = shockWaveEffect;
			const effectPass = new EffectPass(camera, shockWaveEffect);
			// const smaaPass = new EffectPass(camera, smaaEffect);
			effectPass.renderToScreen = true;

			this.renderPass.renderToScreen = false;
			// smaaPass.renderToScreen = true;

			this.effect = shockWaveEffect;

			composer.addPass(effectPass);
			// composer.addPass(smaaPass);

		}

		/**
		 * Registers configuration options.
		 *
		 * @param {GUI} menu - A menu.
		 */

		registerOptions(menu) {

			const effect = this.effect;
			const uniforms = effect.uniforms;

			const params = {
				"size": uniforms.get("size").value,
				"extent": uniforms.get("maxRadius").value,
				"waveSize": uniforms.get("waveSize").value,
				"amplitude": uniforms.get("amplitude").value
			};

			menu.add(effect, "speed").min(0.0).max(10.0).step(0.001);

			menu.add(params, "size").min(0.01).max(2.0).step(0.001).onChange(() => {

				uniforms.get("size").value = params.size;

			});

			menu.add(params, "extent").min(0.0).max(10.0).step(0.001).onChange(() => {

				uniforms.get("maxRadius").value = params.extent;

			});

			menu.add(params, "waveSize").min(0.0).max(2.0).step(0.001).onChange(() => {

				uniforms.get("waveSize").value = params.waveSize;

			});

			menu.add(params, "amplitude").min(0.0).max(0.25).step(0.001).onChange(() => {

				uniforms.get("amplitude").value = params.amplitude;

			});

			menu.add(effect, "explode");

		}

	}

	// import { SMAADemo } from "./demos/SMAADemo.js";
	// import { SSAODemo } from "./demos/SSAODemo.js";
	// import { TextureDemo } from "./demos/TextureDemo.js";
	// import { ToneMappingDemo } from "./demos/ToneMappingDemo.js";
	// import { VignetteDemo } from "./demos/VignetteDemo.js";

	/**
	 * A renderer.
	 *
	 * @type {WebGLRenderer}
	 * @private
	 */

	let renderer;

	/**
	 * An effect composer.
	 *
	 * @type {EffectComposer}
	 * @private
	 */

	let composer;

	/**
	 * A demo manager.
	 *
	 * @type {DemoManager}
	 * @private
	 */

	let manager;

	/**
	 * The main render loop.
	 *
	 * @private
	 * @param {DOMHighResTimeStamp} now - The current time.
	 */

	function render(now) {

		requestAnimationFrame(render);
		manager.render(now);

	}

	/**
	 * Handles demo change events.
	 *
	 * @private
	 * @param {Event} event - An event.
	 */

	function onChange(event) {

		const demo = event.demo;

		// Make sure that the main renderer is being used and update it just in case.
		const size = composer.getRenderer().getSize(new three.Vector2());
		renderer.setSize(size.width, size.height);
		composer.replaceRenderer(renderer);
		composer.reset();
		composer.addPass(demo.renderPass);

		document.getElementById("viewport").children[0].style.display = "initial";

	}

	/**
	 * Handles demo load events.
	 *
	 * @private
	 * @param {Event} event - An event.
	 */

	function onLoad(event) {

		// Prepare the render pass.
		event.demo.renderPass.camera = event.demo.camera;

		document.getElementById("viewport").children[0].style.display = "none";

	}

	/**
	 * Starts the program.
	 *
	 * @private
	 * @param {Event} event - An event.
	 */

	window.addEventListener("load", function main(event) {

		// Clean up.
		this.removeEventListener("load", main);

		const viewport = document.getElementById("viewport");

		// Create a custom renderer.
		renderer = new three.WebGLRenderer({
			logarithmicDepthBuffer: true,
			antialias: false
		});

		renderer.setSize(viewport.clientWidth, viewport.clientHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setClearColor(0x000000);

		// Create an effect composer.
		composer = new EffectComposer(renderer, {
			stencilBuffer: true
		});

		// Initialise the demo manager.
		manager = new DemoManager(viewport, {
			aside: document.getElementById("aside"),
			renderer: renderer
		});

		// Setup demo switch and load event handlers.
		manager.addEventListener("change", onChange);
		manager.addEventListener("load", onLoad);

		const demos = [
			// new BloomDemo(composer),
			// new BlurDemo(composer),
			// new BokehDemo(composer),
			// new RealisticBokehDemo(composer),
			// new ColorCorrectionDemo(composer),
			// new DotScreenDemo(composer),
			new GlitchDemo(composer),
			// new GodRaysDemo(composer),
			// new GridDemo(composer),
			// new OutlineDemo(composer),
			// new PixelationDemo(composer),
			// new ScanlineDemo(composer),
			// new SepiaDemo(composer),
			new ShockWaveDemo(composer)
			// new SMAADemo(composer)
			// new SSAODemo(composer),
			// new TextureDemo(composer),
			// new ToneMappingDemo(composer),
			// new VignetteDemo(composer)
		];

		if(demos.map((demo) => demo.id).indexOf(window.location.hash.slice(1)) === -1) {
			// Invalid URL hash: demo doesn't exist.
			window.location.hash = "";
		}

		// Register demos.
		for(const demo of demos) {

			manager.addDemo(demo);

		}

		// Start rendering.
		render();

	});

	/**
	 * Handles browser resizing.
	 *
	 * @private
	 * @param {Event} event - An event.
	 */

	window.addEventListener("resize", (function() {
		let timeoutId = 0;

		function handleResize(event) {
			const width = event.target.innerWidth;
			const height = event.target.innerHeight;

			manager.setSize(width, height);
			composer.setSize(width, height);
			timeoutId = 0;
		}

		return function onResize(event) {
			if(timeoutId === 0) {
				timeoutId = setTimeout(handleResize, 66, event);
			}
		};
	}()));

	/**
	 * Toggles the visibility of the interface on Alt key press.
	 *
	 * @private
	 * @param {Event} event - An event.
	 */
	document.addEventListener("keydown", function onKeyDown(event) {
		const aside = this.getElementById("aside");
		if(event.altKey && aside !== null) {
			event.preventDefault();
			aside.style.visibility = (aside.style.visibility === "hidden") ? "visible" : "hidden";
		}
	});

}(THREE));
