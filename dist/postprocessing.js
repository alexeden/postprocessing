(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("three"));
	else if(typeof define === 'function' && define.amd)
		define(["three"], factory);
	else if(typeof exports === 'object')
		exports["postprocessing"] = factory(require("three"));
	else
		root["postprocessing"] = factory(root["three"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_three__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./postprocessing.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./core/EffectComposer.ts":
/*!********************************!*\
  !*** ./core/EffectComposer.ts ***!
  \********************************/
/*! exports provided: EffectComposer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EffectComposer", function() { return EffectComposer; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _passes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../passes */ "./passes/index.ts");
/* harmony import */ var _materials__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../materials */ "./materials/index.ts");
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var EffectComposer = function () {
  function EffectComposer() {
    var renderer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var partialOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, EffectComposer);

    this.renderer = renderer;
    this.inputBuffer = null;
    this.outputBuffer = null;
    this.copyPass = new _passes__WEBPACK_IMPORTED_MODULE_1__["ShaderPass"](new _materials__WEBPACK_IMPORTED_MODULE_2__["CopyMaterial"]());
    this.passes = [];

    var options = _objectSpread({
      depthBuffer: true,
      stencilBuffer: false
    }, partialOptions);

    if (this.renderer !== null) {
      this.renderer.autoClear = false;
      this.inputBuffer = this.createBuffer(options.depthBuffer, options.stencilBuffer);
      this.outputBuffer = this.inputBuffer.clone();
    }
  }

  _createClass(EffectComposer, [{
    key: "replaceRenderer",
    value: function replaceRenderer(renderer) {
      var oldRenderer = this.renderer;
      var parent;
      var oldSize;
      var newSize;

      if (oldRenderer !== null && oldRenderer !== renderer) {
        this.renderer = renderer;
        this.renderer.autoClear = false;
        parent = oldRenderer.domElement.parentNode;
        oldSize = oldRenderer.getSize();
        newSize = renderer.getSize();

        if (parent !== null) {
          parent.removeChild(oldRenderer.domElement);
          parent.appendChild(renderer.domElement);
        }

        if (oldSize.width !== newSize.width || oldSize.height !== newSize.height) {
          this.setSize();
        }
      }

      return oldRenderer;
    }
  }, {
    key: "getDepthTexture",
    value: function getDepthTexture(index) {
      var passes = this.passes;
      var depthTexture = null;
      var inputBuffer = true;
      var i;
      var pass;

      for (i = 0; i < index; ++i) {
        pass = passes[i];

        if (pass.needsSwap) {
          inputBuffer = !inputBuffer;
        } else if (pass instanceof _passes__WEBPACK_IMPORTED_MODULE_1__["RenderPass"]) {
          depthTexture = (inputBuffer ? this.inputBuffer : this.outputBuffer).depthTexture;
        }
      }

      return depthTexture;
    }
  }, {
    key: "createDepthTexture",
    value: function createDepthTexture(width, height) {
      var depthTexture = new three__WEBPACK_IMPORTED_MODULE_0__["DepthTexture"](width, height);

      if (this.inputBuffer.stencilBuffer) {
        depthTexture.format = three__WEBPACK_IMPORTED_MODULE_0__["DepthStencilFormat"];
        depthTexture.type = three__WEBPACK_IMPORTED_MODULE_0__["UnsignedInt248Type"];
      }

      this.inputBuffer.depthTexture = depthTexture;
      this.outputBuffer.depthTexture = depthTexture.clone();
    }
  }, {
    key: "createBuffer",
    value: function createBuffer(depthBuffer, stencilBuffer) {
      var drawingBufferSize = this.renderer.getDrawingBufferSize();
      var alpha = this.renderer.context.getContextAttributes().alpha;
      var renderTarget = new three__WEBPACK_IMPORTED_MODULE_0__["WebGLRenderTarget"](drawingBufferSize.width, drawingBufferSize.height, {
        minFilter: three__WEBPACK_IMPORTED_MODULE_0__["LinearFilter"],
        magFilter: three__WEBPACK_IMPORTED_MODULE_0__["LinearFilter"],
        format: alpha ? three__WEBPACK_IMPORTED_MODULE_0__["RGBAFormat"] : three__WEBPACK_IMPORTED_MODULE_0__["RGBFormat"],
        depthBuffer: depthBuffer,
        stencilBuffer: stencilBuffer
      });
      renderTarget.texture.name = 'EffectComposer.Buffer';
      renderTarget.texture.generateMipmaps = false;
      return renderTarget;
    }
  }, {
    key: "addPass",
    value: function addPass(pass, index) {
      var drawingBufferSize = this.renderer.getDrawingBufferSize();
      pass.setSize(drawingBufferSize.width, drawingBufferSize.height);
      pass.initialize(this.renderer, this.renderer.context.getContextAttributes().alpha);

      if (index !== undefined) {
        this.passes.splice(index, 0, pass);
      } else {
        index = this.passes.push(pass) - 1;
      }

      if (pass.needsDepthTexture) {
        if (this.inputBuffer.depthTexture === null) {
          this.createDepthTexture(drawingBufferSize.width, drawingBufferSize.height);
        }

        pass.setDepthTexture(this.getDepthTexture(index));
      }
    }
  }, {
    key: "removePass",
    value: function removePass(pass) {
      this.passes.splice(this.passes.indexOf(pass), 1);
    }
  }, {
    key: "render",
    value: function render(delta) {
      var inputBuffer = this.inputBuffer;
      var outputBuffer = this.outputBuffer;
      var stencilTest = false;
      var context;
      var state;
      var buffer;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.passes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var pass = _step.value;

          if (pass.enabled) {
            pass.render(this.renderer, inputBuffer, outputBuffer, delta, stencilTest);

            if (pass.needsSwap) {
              if (stencilTest) {
                this.copyPass.renderToScreen = pass.renderToScreen;
                context = this.renderer.context;
                state = this.renderer.state;
                state.buffers.stencil.setFunc(context.NOTEQUAL, 1, 0xffffffff);
                this.copyPass.render(this.renderer, inputBuffer, outputBuffer);
                state.buffers.stencil.setFunc(context.EQUAL, 1, 0xffffffff);
              }

              buffer = inputBuffer;
              inputBuffer = outputBuffer;
              outputBuffer = buffer;
            }

            if (pass instanceof _passes__WEBPACK_IMPORTED_MODULE_1__["MaskPass"]) {
              stencilTest = true;
            } else if (pass instanceof _passes__WEBPACK_IMPORTED_MODULE_1__["ClearMaskPass"]) {
              stencilTest = false;
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "setSize",
    value: function setSize(width, height) {
      var size;

      if (width === undefined || height === undefined) {
        size = this.renderer.getSize();
        width = size.width;
        height = size.height;
      }

      this.renderer.setSize(width, height);
      var drawingBufferSize = this.renderer.getDrawingBufferSize();
      this.inputBuffer.setSize(drawingBufferSize.width, drawingBufferSize.height);
      this.outputBuffer.setSize(drawingBufferSize.width, drawingBufferSize.height);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.passes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var pass = _step2.value;
          pass.setSize(drawingBufferSize.width, drawingBufferSize.height);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      var renderTarget = this.createBuffer(this.inputBuffer.depthBuffer, this.inputBuffer.stencilBuffer);
      this.dispose();
      this.inputBuffer = renderTarget;
      this.outputBuffer = renderTarget.clone();
      this.copyPass = new _passes__WEBPACK_IMPORTED_MODULE_1__["ShaderPass"](new _materials__WEBPACK_IMPORTED_MODULE_2__["CopyMaterial"]());
    }
  }, {
    key: "dispose",
    value: function dispose() {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.passes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var pass = _step3.value;
          pass.dispose();
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      this.passes = [];

      if (this.inputBuffer !== null) {
        this.inputBuffer.dispose();
        this.inputBuffer = null;
      }

      if (this.outputBuffer !== null) {
        this.outputBuffer.dispose();
        this.outputBuffer = null;
      }

      this.copyPass.dispose();
    }
  }]);

  return EffectComposer;
}();

/***/ }),

/***/ "./core/index.ts":
/*!***********************!*\
  !*** ./core/index.ts ***!
  \***********************/
/*! exports provided: EffectComposer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EffectComposer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EffectComposer */ "./core/EffectComposer.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EffectComposer", function() { return _EffectComposer__WEBPACK_IMPORTED_MODULE_0__["EffectComposer"]; });



/***/ }),

/***/ "./effects/Effect.ts":
/*!***************************!*\
  !*** ./effects/Effect.ts ***!
  \***************************/
/*! exports provided: Effect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Effect", function() { return Effect; });
/* harmony import */ var _blending__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./blending */ "./effects/blending/index.ts");
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib */ "./effects/lib/index.ts");
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Effect = function () {
  function Effect(name, fragmentShader) {
    var partialOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, Effect);

    this.name = name;
    this.fragmentShader = fragmentShader;
    this.vertexShader = null;

    var settings = _objectSpread({
      attributes: _lib__WEBPACK_IMPORTED_MODULE_1__["EffectAttribute"].NONE,
      blendFunction: _blending__WEBPACK_IMPORTED_MODULE_0__["BlendFunction"].SCREEN,
      defines: new Map(),
      uniforms: new Map(),
      extensions: new Set(),
      vertexShader: null
    }, partialOptions);

    this.attributes = settings.attributes;
    this.vertexShader = settings.vertexShader;
    this.defines = settings.defines;
    this.uniforms = settings.uniforms;
    this.extensions = settings.extensions;
    this.blendMode = new _blending__WEBPACK_IMPORTED_MODULE_0__["BlendMode"](settings.blendFunction);
  }

  _createClass(Effect, [{
    key: "setDepthTexture",
    value: function setDepthTexture(depthTexture) {
      var depthPacking = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    }
  }, {
    key: "update",
    value: function update(renderer, inputBuffer) {
      var delta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    }
  }, {
    key: "setSize",
    value: function setSize(width, height) {}
  }, {
    key: "initialize",
    value: function initialize(renderer, alpha) {}
  }, {
    key: "dispose",
    value: function dispose() {
      var _arr = Object.keys(this);

      for (var _i = 0; _i < _arr.length; _i++) {
        var key = _arr[_i];

        if (this[key] !== null && typeof this[key].dispose === 'function') {
          this[key].dispose();
          this[key] = null;
        }
      }
    }
  }]);

  return Effect;
}();

/***/ }),

/***/ "./effects/blending/BlendFunction.ts":
/*!*******************************************!*\
  !*** ./effects/blending/BlendFunction.ts ***!
  \*******************************************/
/*! exports provided: BlendFunction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BlendFunction", function() { return BlendFunction; });
var BlendFunction;

(function (BlendFunction) {
  BlendFunction[BlendFunction["SKIP"] = 0] = "SKIP";
  BlendFunction[BlendFunction["ADD"] = 1] = "ADD";
  BlendFunction[BlendFunction["ALPHA"] = 2] = "ALPHA";
  BlendFunction[BlendFunction["AVERAGE"] = 3] = "AVERAGE";
  BlendFunction[BlendFunction["COLOR_BURN"] = 4] = "COLOR_BURN";
  BlendFunction[BlendFunction["COLOR_DODGE"] = 5] = "COLOR_DODGE";
  BlendFunction[BlendFunction["DARKEN"] = 6] = "DARKEN";
  BlendFunction[BlendFunction["DIFFERENCE"] = 7] = "DIFFERENCE";
  BlendFunction[BlendFunction["EXCLUSION"] = 8] = "EXCLUSION";
  BlendFunction[BlendFunction["LIGHTEN"] = 9] = "LIGHTEN";
  BlendFunction[BlendFunction["MULTIPLY"] = 10] = "MULTIPLY";
  BlendFunction[BlendFunction["DIVIDE"] = 11] = "DIVIDE";
  BlendFunction[BlendFunction["NEGATION"] = 12] = "NEGATION";
  BlendFunction[BlendFunction["NORMAL"] = 13] = "NORMAL";
  BlendFunction[BlendFunction["OVERLAY"] = 14] = "OVERLAY";
  BlendFunction[BlendFunction["REFLECT"] = 15] = "REFLECT";
  BlendFunction[BlendFunction["SCREEN"] = 16] = "SCREEN";
  BlendFunction[BlendFunction["SOFT_LIGHT"] = 17] = "SOFT_LIGHT";
  BlendFunction[BlendFunction["SUBTRACT"] = 18] = "SUBTRACT";
})(BlendFunction || (BlendFunction = {}));

/***/ }),

/***/ "./effects/blending/BlendMode.ts":
/*!***************************************!*\
  !*** ./effects/blending/BlendMode.ts ***!
  \***************************************/
/*! exports provided: BlendMode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BlendMode", function() { return BlendMode; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _BlendFunction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BlendFunction */ "./effects/blending/BlendFunction.ts");
/* harmony import */ var _glsl_add_shader_frag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./glsl/add/shader.frag */ "./effects/blending/glsl/add/shader.frag");
/* harmony import */ var _glsl_add_shader_frag__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_glsl_add_shader_frag__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _glsl_alpha_shader_frag__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./glsl/alpha/shader.frag */ "./effects/blending/glsl/alpha/shader.frag");
/* harmony import */ var _glsl_alpha_shader_frag__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_glsl_alpha_shader_frag__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _glsl_average_shader_frag__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./glsl/average/shader.frag */ "./effects/blending/glsl/average/shader.frag");
/* harmony import */ var _glsl_average_shader_frag__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_glsl_average_shader_frag__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _glsl_color_burn_shader_frag__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./glsl/color-burn/shader.frag */ "./effects/blending/glsl/color-burn/shader.frag");
/* harmony import */ var _glsl_color_burn_shader_frag__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_glsl_color_burn_shader_frag__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _glsl_color_dodge_shader_frag__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./glsl/color-dodge/shader.frag */ "./effects/blending/glsl/color-dodge/shader.frag");
/* harmony import */ var _glsl_color_dodge_shader_frag__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_glsl_color_dodge_shader_frag__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _glsl_darken_shader_frag__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./glsl/darken/shader.frag */ "./effects/blending/glsl/darken/shader.frag");
/* harmony import */ var _glsl_darken_shader_frag__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_glsl_darken_shader_frag__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _glsl_difference_shader_frag__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./glsl/difference/shader.frag */ "./effects/blending/glsl/difference/shader.frag");
/* harmony import */ var _glsl_difference_shader_frag__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_glsl_difference_shader_frag__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _glsl_exclusion_shader_frag__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./glsl/exclusion/shader.frag */ "./effects/blending/glsl/exclusion/shader.frag");
/* harmony import */ var _glsl_exclusion_shader_frag__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_glsl_exclusion_shader_frag__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _glsl_lighten_shader_frag__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./glsl/lighten/shader.frag */ "./effects/blending/glsl/lighten/shader.frag");
/* harmony import */ var _glsl_lighten_shader_frag__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_glsl_lighten_shader_frag__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _glsl_multiply_shader_frag__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./glsl/multiply/shader.frag */ "./effects/blending/glsl/multiply/shader.frag");
/* harmony import */ var _glsl_multiply_shader_frag__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_glsl_multiply_shader_frag__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _glsl_divide_shader_frag__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./glsl/divide/shader.frag */ "./effects/blending/glsl/divide/shader.frag");
/* harmony import */ var _glsl_divide_shader_frag__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_glsl_divide_shader_frag__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _glsl_negation_shader_frag__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./glsl/negation/shader.frag */ "./effects/blending/glsl/negation/shader.frag");
/* harmony import */ var _glsl_negation_shader_frag__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_glsl_negation_shader_frag__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _glsl_normal_shader_frag__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./glsl/normal/shader.frag */ "./effects/blending/glsl/normal/shader.frag");
/* harmony import */ var _glsl_normal_shader_frag__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_glsl_normal_shader_frag__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _glsl_overlay_shader_frag__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./glsl/overlay/shader.frag */ "./effects/blending/glsl/overlay/shader.frag");
/* harmony import */ var _glsl_overlay_shader_frag__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(_glsl_overlay_shader_frag__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _glsl_reflect_shader_frag__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./glsl/reflect/shader.frag */ "./effects/blending/glsl/reflect/shader.frag");
/* harmony import */ var _glsl_reflect_shader_frag__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_glsl_reflect_shader_frag__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _glsl_screen_shader_frag__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./glsl/screen/shader.frag */ "./effects/blending/glsl/screen/shader.frag");
/* harmony import */ var _glsl_screen_shader_frag__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_glsl_screen_shader_frag__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var _glsl_soft_light_shader_frag__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./glsl/soft-light/shader.frag */ "./effects/blending/glsl/soft-light/shader.frag");
/* harmony import */ var _glsl_soft_light_shader_frag__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(_glsl_soft_light_shader_frag__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var _glsl_subtract_shader_frag__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./glsl/subtract/shader.frag */ "./effects/blending/glsl/subtract/shader.frag");
/* harmony import */ var _glsl_subtract_shader_frag__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(_glsl_subtract_shader_frag__WEBPACK_IMPORTED_MODULE_19__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





















var BlendMode = function () {
  function BlendMode(blendFunction) {
    var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;

    _classCallCheck(this, BlendMode);

    this.blendFunction = blendFunction;
    this.opacity = new three__WEBPACK_IMPORTED_MODULE_0__["Uniform"](opacity);
  }

  _createClass(BlendMode, [{
    key: "getShaderCode",
    value: function getShaderCode() {
      switch (this.blendFunction) {
        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].SKIP:
          return null;

        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].ADD:
          return _glsl_add_shader_frag__WEBPACK_IMPORTED_MODULE_2___default.a;

        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].ALPHA:
          return _glsl_alpha_shader_frag__WEBPACK_IMPORTED_MODULE_3___default.a;

        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].AVERAGE:
          return _glsl_average_shader_frag__WEBPACK_IMPORTED_MODULE_4___default.a;

        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].COLOR_BURN:
          return _glsl_color_burn_shader_frag__WEBPACK_IMPORTED_MODULE_5___default.a;

        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].COLOR_DODGE:
          return _glsl_color_dodge_shader_frag__WEBPACK_IMPORTED_MODULE_6___default.a;

        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].DARKEN:
          return _glsl_darken_shader_frag__WEBPACK_IMPORTED_MODULE_7___default.a;

        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].DIFFERENCE:
          return _glsl_difference_shader_frag__WEBPACK_IMPORTED_MODULE_8___default.a;

        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].EXCLUSION:
          return _glsl_exclusion_shader_frag__WEBPACK_IMPORTED_MODULE_9___default.a;

        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].LIGHTEN:
          return _glsl_lighten_shader_frag__WEBPACK_IMPORTED_MODULE_10___default.a;

        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].MULTIPLY:
          return _glsl_multiply_shader_frag__WEBPACK_IMPORTED_MODULE_11___default.a;

        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].DIVIDE:
          return _glsl_divide_shader_frag__WEBPACK_IMPORTED_MODULE_12___default.a;

        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].NEGATION:
          return _glsl_negation_shader_frag__WEBPACK_IMPORTED_MODULE_13___default.a;

        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].NORMAL:
          return _glsl_normal_shader_frag__WEBPACK_IMPORTED_MODULE_14___default.a;

        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].OVERLAY:
          return _glsl_overlay_shader_frag__WEBPACK_IMPORTED_MODULE_15___default.a;

        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].REFLECT:
          return _glsl_reflect_shader_frag__WEBPACK_IMPORTED_MODULE_16___default.a;

        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].SCREEN:
          return _glsl_screen_shader_frag__WEBPACK_IMPORTED_MODULE_17___default.a;

        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].SOFT_LIGHT:
          return _glsl_soft_light_shader_frag__WEBPACK_IMPORTED_MODULE_18___default.a;

        case _BlendFunction__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"].SUBTRACT:
          return _glsl_subtract_shader_frag__WEBPACK_IMPORTED_MODULE_19___default.a;
      }
    }
  }]);

  return BlendMode;
}();

/***/ }),

/***/ "./effects/blending/glsl/add/shader.frag":
/*!***********************************************!*\
  !*** ./effects/blending/glsl/add/shader.frag ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn min(x + y, 1.0) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n"

/***/ }),

/***/ "./effects/blending/glsl/alpha/shader.frag":
/*!*************************************************!*\
  !*** ./effects/blending/glsl/alpha/shader.frag ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn y * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, y.a), x.a);\n\n}\n"

/***/ }),

/***/ "./effects/blending/glsl/average/shader.frag":
/*!***************************************************!*\
  !*** ./effects/blending/glsl/average/shader.frag ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn (x + y) * 0.5 * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n"

/***/ }),

/***/ "./effects/blending/glsl/color-burn/shader.frag":
/*!******************************************************!*\
  !*** ./effects/blending/glsl/color-burn/shader.frag ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "float blend(const in float x, const in float y) {\n\n\treturn (y == 0.0) ? y : max(1.0 - (1.0 - x) / y, 0.0);\n\n}\n\nvec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\tvec3 z = vec3(blend(x.r, y.r), blend(x.g, y.g), blend(x.b, y.b));\n\n\treturn z * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n"

/***/ }),

/***/ "./effects/blending/glsl/color-dodge/shader.frag":
/*!*******************************************************!*\
  !*** ./effects/blending/glsl/color-dodge/shader.frag ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "float blend(const in float x, const in float y) {\n\n\treturn (y == 1.0) ? y : min(x / (1.0 - y), 1.0);\n\n}\n\nvec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\tvec3 z = vec3(blend(x.r, y.r), blend(x.g, y.g), blend(x.b, y.b));\n\n\treturn z * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n"

/***/ }),

/***/ "./effects/blending/glsl/darken/shader.frag":
/*!**************************************************!*\
  !*** ./effects/blending/glsl/darken/shader.frag ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn min(x, y) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n"

/***/ }),

/***/ "./effects/blending/glsl/difference/shader.frag":
/*!******************************************************!*\
  !*** ./effects/blending/glsl/difference/shader.frag ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn abs(x - y) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n"

/***/ }),

/***/ "./effects/blending/glsl/divide/shader.frag":
/*!**************************************************!*\
  !*** ./effects/blending/glsl/divide/shader.frag ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "float blend(const in float x, const in float y) {\n\n\treturn (y > 0.0) ? min(x / y, 1.0) : 1.0;\n\n}\n\nvec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\tvec3 z = vec3(blend(x.r, y.r), blend(x.g, y.g), blend(x.b, y.b));\n\n\treturn z * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n"

/***/ }),

/***/ "./effects/blending/glsl/exclusion/shader.frag":
/*!*****************************************************!*\
  !*** ./effects/blending/glsl/exclusion/shader.frag ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn (x + y - 2.0 * x * y) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n"

/***/ }),

/***/ "./effects/blending/glsl/lighten/shader.frag":
/*!***************************************************!*\
  !*** ./effects/blending/glsl/lighten/shader.frag ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn max(x, y) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n"

/***/ }),

/***/ "./effects/blending/glsl/multiply/shader.frag":
/*!****************************************************!*\
  !*** ./effects/blending/glsl/multiply/shader.frag ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn x * y * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n"

/***/ }),

/***/ "./effects/blending/glsl/negation/shader.frag":
/*!****************************************************!*\
  !*** ./effects/blending/glsl/negation/shader.frag ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn (1.0 - abs(1.0 - x - y)) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n"

/***/ }),

/***/ "./effects/blending/glsl/normal/shader.frag":
/*!**************************************************!*\
  !*** ./effects/blending/glsl/normal/shader.frag ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn y * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n"

/***/ }),

/***/ "./effects/blending/glsl/overlay/shader.frag":
/*!***************************************************!*\
  !*** ./effects/blending/glsl/overlay/shader.frag ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "float blend(const in float x, const in float y) {\n\n\treturn (x < 0.5) ? (2.0 * x * y) : (1.0 - 2.0 * (1.0 - x) * (1.0 - y));\n\n}\n\nvec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\tvec3 z = vec3(blend(x.r, y.r), blend(x.g, y.g), blend(x.b, y.b));\n\n\treturn z * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n"

/***/ }),

/***/ "./effects/blending/glsl/reflect/shader.frag":
/*!***************************************************!*\
  !*** ./effects/blending/glsl/reflect/shader.frag ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "float blend(const in float x, const in float y) {\n\n\treturn (y == 1.0) ? y : min(x * x / (1.0 - y), 1.0);\n\n}\n\nvec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\tvec3 z = vec3(blend(x.r, y.r), blend(x.g, y.g), blend(x.b, y.b));\n\n\treturn z * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n"

/***/ }),

/***/ "./effects/blending/glsl/screen/shader.frag":
/*!**************************************************!*\
  !*** ./effects/blending/glsl/screen/shader.frag ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn (1.0 - (1.0 - x) * (1.0 - y)) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n"

/***/ }),

/***/ "./effects/blending/glsl/soft-light/shader.frag":
/*!******************************************************!*\
  !*** ./effects/blending/glsl/soft-light/shader.frag ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "float blend(const in float x, const in float y) {\n\n\treturn (y < 0.5) ?\n\t\t(2.0 * x * y + x * x * (1.0 - 2.0 * y)) :\n\t\t(sqrt(x) * (2.0 * y - 1.0) + 2.0 * x * (1.0 - y));\n\n}\n\nvec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\tvec3 z = vec3(blend(x.r, y.r), blend(x.g, y.g), blend(x.b, y.b));\n\n\treturn z * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n"

/***/ }),

/***/ "./effects/blending/glsl/subtract/shader.frag":
/*!****************************************************!*\
  !*** ./effects/blending/glsl/subtract/shader.frag ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {\n\n\treturn max(x + y - 1.0, 0.0) * opacity + x * (1.0 - opacity);\n\n}\n\nvec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {\n\n\treturn vec4(blend(x.rgb, y.rgb, opacity), y.a);\n\n}\n"

/***/ }),

/***/ "./effects/blending/index.ts":
/*!***********************************!*\
  !*** ./effects/blending/index.ts ***!
  \***********************************/
/*! exports provided: BlendFunction, BlendMode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _BlendFunction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BlendFunction */ "./effects/blending/BlendFunction.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BlendFunction", function() { return _BlendFunction__WEBPACK_IMPORTED_MODULE_0__["BlendFunction"]; });

/* harmony import */ var _BlendMode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BlendMode */ "./effects/blending/BlendMode.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BlendMode", function() { return _BlendMode__WEBPACK_IMPORTED_MODULE_1__["BlendMode"]; });




/***/ }),

/***/ "./effects/index.ts":
/*!**************************!*\
  !*** ./effects/index.ts ***!
  \**************************/
/*! exports provided: Effect, BlendFunction, BlendMode, EffectName, EffectAttribute, WebGLExtension */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _blending__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./blending */ "./effects/blending/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BlendFunction", function() { return _blending__WEBPACK_IMPORTED_MODULE_0__["BlendFunction"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BlendMode", function() { return _blending__WEBPACK_IMPORTED_MODULE_0__["BlendMode"]; });

/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib */ "./effects/lib/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EffectName", function() { return _lib__WEBPACK_IMPORTED_MODULE_1__["EffectName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EffectAttribute", function() { return _lib__WEBPACK_IMPORTED_MODULE_1__["EffectAttribute"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebGLExtension", function() { return _lib__WEBPACK_IMPORTED_MODULE_1__["WebGLExtension"]; });

/* harmony import */ var _Effect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Effect */ "./effects/Effect.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Effect", function() { return _Effect__WEBPACK_IMPORTED_MODULE_2__["Effect"]; });





/***/ }),

/***/ "./effects/lib/effects.types.ts":
/*!**************************************!*\
  !*** ./effects/lib/effects.types.ts ***!
  \**************************************/
/*! exports provided: EffectName, EffectAttribute, WebGLExtension */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EffectName", function() { return EffectName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EffectAttribute", function() { return EffectAttribute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebGLExtension", function() { return WebGLExtension; });
var EffectName;

(function (EffectName) {
  EffectName["Glitch"] = "GlitchEffect";
})(EffectName || (EffectName = {}));

var EffectAttribute;

(function (EffectAttribute) {
  EffectAttribute[EffectAttribute["NONE"] = 0] = "NONE";
  EffectAttribute[EffectAttribute["DEPTH"] = 1] = "DEPTH";
  EffectAttribute[EffectAttribute["CONVOLUTION"] = 2] = "CONVOLUTION";
})(EffectAttribute || (EffectAttribute = {}));

var WebGLExtension;

(function (WebGLExtension) {
  WebGLExtension["DERIVATIVES"] = "derivatives";
  WebGLExtension["FRAG_DEPTH"] = "fragDepth";
  WebGLExtension["DRAW_BUFFERS"] = "drawBuffers";
  WebGLExtension["SHADER_TEXTURE_LOD"] = "shaderTextureLOD";
})(WebGLExtension || (WebGLExtension = {}));

/***/ }),

/***/ "./effects/lib/index.ts":
/*!******************************!*\
  !*** ./effects/lib/index.ts ***!
  \******************************/
/*! exports provided: EffectName, EffectAttribute, WebGLExtension */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _effects_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./effects.types */ "./effects/lib/effects.types.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EffectName", function() { return _effects_types__WEBPACK_IMPORTED_MODULE_0__["EffectName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EffectAttribute", function() { return _effects_types__WEBPACK_IMPORTED_MODULE_0__["EffectAttribute"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebGLExtension", function() { return _effects_types__WEBPACK_IMPORTED_MODULE_0__["WebGLExtension"]; });



/***/ }),

/***/ "./materials/CopyMaterial.ts":
/*!***********************************!*\
  !*** ./materials/CopyMaterial.ts ***!
  \***********************************/
/*! exports provided: CopyMaterial */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CopyMaterial", function() { return CopyMaterial; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _glsl_copy_shader_frag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./glsl/copy/shader.frag */ "./materials/glsl/copy/shader.frag");
/* harmony import */ var _glsl_copy_shader_frag__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_glsl_copy_shader_frag__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _glsl_copy_shader_vert__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./glsl/copy/shader.vert */ "./materials/glsl/copy/shader.vert");
/* harmony import */ var _glsl_copy_shader_vert__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_glsl_copy_shader_vert__WEBPACK_IMPORTED_MODULE_2__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var CopyMaterial = function (_ShaderMaterial) {
  _inherits(CopyMaterial, _ShaderMaterial);

  function CopyMaterial() {
    _classCallCheck(this, CopyMaterial);

    return _possibleConstructorReturn(this, _getPrototypeOf(CopyMaterial).call(this, {
      uniforms: {
        inputBuffer: new three__WEBPACK_IMPORTED_MODULE_0__["Uniform"](null),
        opacity: new three__WEBPACK_IMPORTED_MODULE_0__["Uniform"](1.0)
      },
      fragmentShader: _glsl_copy_shader_frag__WEBPACK_IMPORTED_MODULE_1___default.a,
      vertexShader: _glsl_copy_shader_vert__WEBPACK_IMPORTED_MODULE_2___default.a,
      depthWrite: false,
      depthTest: false
    }));
  }

  return CopyMaterial;
}(three__WEBPACK_IMPORTED_MODULE_0__["ShaderMaterial"]);

/***/ }),

/***/ "./materials/glsl/copy/shader.frag":
/*!*****************************************!*\
  !*** ./materials/glsl/copy/shader.frag ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D inputBuffer;\nuniform float opacity;\n\nvarying vec2 vUv;\n\nvoid main() {\n\n\tvec4 texel = texture2D(inputBuffer, vUv);\n\tgl_FragColor = opacity * texel;\n\n}\n"

/***/ }),

/***/ "./materials/glsl/copy/shader.vert":
/*!*****************************************!*\
  !*** ./materials/glsl/copy/shader.vert ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "varying vec2 vUv;\n\nvoid main() {\n\n\tvUv = uv;\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\n}\n"

/***/ }),

/***/ "./materials/index.ts":
/*!****************************!*\
  !*** ./materials/index.ts ***!
  \****************************/
/*! exports provided: CopyMaterial */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CopyMaterial__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CopyMaterial */ "./materials/CopyMaterial.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CopyMaterial", function() { return _CopyMaterial__WEBPACK_IMPORTED_MODULE_0__["CopyMaterial"]; });



/***/ }),

/***/ "./passes/ClearMaskPass.ts":
/*!*********************************!*\
  !*** ./passes/ClearMaskPass.ts ***!
  \*********************************/
/*! exports provided: ClearMaskPass */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClearMaskPass", function() { return ClearMaskPass; });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib */ "./passes/lib/index.ts");
/* harmony import */ var _Pass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Pass */ "./passes/Pass.ts");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var ClearMaskPass = function (_Pass) {
  _inherits(ClearMaskPass, _Pass);

  function ClearMaskPass() {
    var _this;

    _classCallCheck(this, ClearMaskPass);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ClearMaskPass).call(this, _lib__WEBPACK_IMPORTED_MODULE_0__["PassName"].ClearMask));
    _this.needsSwap = false;
    return _this;
  }

  _createClass(ClearMaskPass, [{
    key: "render",
    value: function render(renderer) {
      renderer.state.buffers.stencil.setTest(false);
    }
  }]);

  return ClearMaskPass;
}(_Pass__WEBPACK_IMPORTED_MODULE_1__["Pass"]);

/***/ }),

/***/ "./passes/ClearPass.ts":
/*!*****************************!*\
  !*** ./passes/ClearPass.ts ***!
  \*****************************/
/*! exports provided: ClearPass */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClearPass", function() { return ClearPass; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Pass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Pass */ "./passes/Pass.ts");
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib */ "./passes/lib/index.ts");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var ClearPass = function (_Pass) {
  _inherits(ClearPass, _Pass);

  function ClearPass() {
    var _this;

    var partialOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ClearPass);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ClearPass).call(this, _lib__WEBPACK_IMPORTED_MODULE_2__["PassName"].Clear));

    var options = _objectSpread({
      clearAlpha: 0,
      clearColor: null
    }, partialOptions);

    _this.needsSwap = false;
    _this.clearColor = options.clearColor;
    _this.clearAlpha = options.clearAlpha;
    return _this;
  }

  _createClass(ClearPass, [{
    key: "render",
    value: function render(renderer, inputBuffer) {
      var clearColor = this.clearColor;
      var clearAlpha;

      if (clearColor !== null) {
        ClearPass.color.copy(renderer.getClearColor());
        clearAlpha = renderer.getClearAlpha();
        renderer.setClearColor(clearColor, this.clearAlpha);
      }

      renderer.setRenderTarget(this.renderToScreen ? undefined : inputBuffer);
      renderer.clear();

      if (clearColor !== null) {
        renderer.setClearColor(ClearPass.color, clearAlpha);
      }
    }
  }]);

  return ClearPass;
}(_Pass__WEBPACK_IMPORTED_MODULE_1__["Pass"]);
ClearPass.color = new three__WEBPACK_IMPORTED_MODULE_0__["Color"]();

/***/ }),

/***/ "./passes/MaskPass.ts":
/*!****************************!*\
  !*** ./passes/MaskPass.ts ***!
  \****************************/
/*! exports provided: MaskPass */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaskPass", function() { return MaskPass; });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib */ "./passes/lib/index.ts");
/* harmony import */ var _Pass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Pass */ "./passes/Pass.ts");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var MaskPass = function (_Pass) {
  _inherits(MaskPass, _Pass);

  function MaskPass(scene, camera) {
    var _this;

    _classCallCheck(this, MaskPass);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MaskPass).call(this, _lib__WEBPACK_IMPORTED_MODULE_0__["PassName"].Mask, scene, camera));
    _this.inverse = false;
    _this.clearStencil = true;
    _this.needsSwap = false;
    return _this;
  }

  _createClass(MaskPass, [{
    key: "render",
    value: function render(renderer, inputBuffer, outputBuffer) {
      var context = renderer.context;
      var state = renderer.state;
      var scene = this.scene;
      var camera = this.camera;
      var writeValue = this.inverse ? 0 : 1;
      var clearValue = 1 - writeValue;
      state.buffers.color.setMask(0);
      state.buffers.depth.setMask(0);
      state.buffers.color.setLocked(true);
      state.buffers.depth.setLocked(true);
      state.buffers.stencil.setTest(true);
      state.buffers.stencil.setOp(context.REPLACE, context.REPLACE, context.REPLACE);
      state.buffers.stencil.setFunc(context.ALWAYS, writeValue, 0xffffffff);
      state.buffers.stencil.setClear(clearValue);

      if (this.clearStencil) {
        if (this.renderToScreen) {
          renderer.setRenderTarget();
          renderer.clearStencil();
        } else {
          renderer.setRenderTarget(inputBuffer);
          renderer.clearStencil();
          renderer.setRenderTarget(outputBuffer);
          renderer.clearStencil();
        }
      }

      if (this.renderToScreen) {
        renderer.render(scene, camera);
      } else {
        renderer.render(scene, camera, inputBuffer);
        renderer.render(scene, camera, outputBuffer);
      }

      state.buffers.color.setLocked(false);
      state.buffers.depth.setLocked(false);
      state.buffers.stencil.setFunc(context.EQUAL, 1, 0xffffffff);
      state.buffers.stencil.setOp(context.KEEP, context.KEEP, context.KEEP);
    }
  }]);

  return MaskPass;
}(_Pass__WEBPACK_IMPORTED_MODULE_1__["Pass"]);

/***/ }),

/***/ "./passes/Pass.ts":
/*!************************!*\
  !*** ./passes/Pass.ts ***!
  \************************/
/*! exports provided: Pass */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Pass", function() { return Pass; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var Pass = function () {
  function Pass(name) {
    var scene = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new three__WEBPACK_IMPORTED_MODULE_0__["Scene"]();
    var camera = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new three__WEBPACK_IMPORTED_MODULE_0__["OrthographicCamera"](-1, 1, 1, -1, 0, 1);

    _classCallCheck(this, Pass);

    this.name = name;
    this.scene = scene;
    this.camera = camera;
    this.uniform = null;
    this.quad = null;
    this.needsSwap = true;
    this.needsDepthTexture = false;
    this.renderToScreen = false;
    this.enabled = true;
  }

  _createClass(Pass, [{
    key: "getFullscreenMaterial",
    value: function getFullscreenMaterial() {
      return this.quad !== null ? this.quad.material : null;
    }
  }, {
    key: "getFullscreenMaterials",
    value: function getFullscreenMaterials() {
      return this.quad === null ? [] : Array.isArray(this.quad.material) ? this.quad.material : [this.quad.material];
    }
  }, {
    key: "setFullscreenMaterial",
    value: function setFullscreenMaterial(material) {
      if (this.quad !== null) {
        this.quad.material = material;
      } else {
        var quad = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](new three__WEBPACK_IMPORTED_MODULE_0__["PlaneBufferGeometry"](2, 2), material);
        quad.frustumCulled = false;

        if (this.scene !== null) {
          this.scene.add(quad);
          this.quad = quad;
        }
      }
    }
  }, {
    key: "getDepthTexture",
    value: function getDepthTexture() {
      return null;
    }
  }, {
    key: "setDepthTexture",
    value: function setDepthTexture(depthTexture) {
      var depthPacking = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    }
  }, {
    key: "setSize",
    value: function setSize(width, height) {}
  }, {
    key: "initialize",
    value: function initialize(renderer, alpha) {}
  }, {
    key: "dispose",
    value: function dispose() {
      var _this = this;

      this.getFullscreenMaterials().forEach(function (material) {
        return material.dispose();
      });
      Object.keys(this).map(function (prop) {
        return _this[prop];
      }).filter(function (value) {
        return value !== null && _typeof(value) === 'object' && typeof value.dispose === 'function';
      }).forEach(function (value) {
        return value.dispose();
      });
    }
  }]);

  return Pass;
}();

/***/ }),

/***/ "./passes/RenderPass.ts":
/*!******************************!*\
  !*** ./passes/RenderPass.ts ***!
  \******************************/
/*! exports provided: RenderPass */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderPass", function() { return RenderPass; });
/* harmony import */ var _ClearPass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ClearPass */ "./passes/ClearPass.ts");
/* harmony import */ var _Pass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Pass */ "./passes/Pass.ts");
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib */ "./passes/lib/index.ts");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var RenderPass = function (_Pass) {
  _inherits(RenderPass, _Pass);

  function RenderPass(scene, camera) {
    var _this;

    var partialOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, RenderPass);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RenderPass).call(this, _lib__WEBPACK_IMPORTED_MODULE_2__["PassName"].Render, scene, camera));
    _this.scene = scene;
    _this.camera = camera;
    _this.overrideMaterial = null;

    var options = _objectSpread({
      overrideMaterial: null,
      clearAlpha: 1,
      clearDepth: false,
      clear: true
    }, partialOptions);

    _this.needsSwap = false;
    _this.clearPass = new _ClearPass__WEBPACK_IMPORTED_MODULE_0__["ClearPass"](options);
    _this.overrideMaterial = options.overrideMaterial;
    _this.clearDepth = options.clearDepth;
    _this.clear = options.clear;
    return _this;
  }

  _createClass(RenderPass, [{
    key: "render",
    value: function render(renderer, inputBuffer) {
      var scene = this.scene;
      var renderTarget = this.renderToScreen ? undefined : inputBuffer;
      var overrideMaterial = scene.overrideMaterial;

      if (this.clear) {
        this.clearPass.renderToScreen = this.renderToScreen;
        this.clearPass.render(renderer, inputBuffer);
      } else if (this.clearDepth) {
        renderer.setRenderTarget(renderTarget);
        renderer.clearDepth();
      }

      scene.overrideMaterial = this.overrideMaterial;
      renderer.render(scene, this.camera, renderTarget);
      scene.overrideMaterial = overrideMaterial;
    }
  }]);

  return RenderPass;
}(_Pass__WEBPACK_IMPORTED_MODULE_1__["Pass"]);

/***/ }),

/***/ "./passes/ShaderPass.ts":
/*!******************************!*\
  !*** ./passes/ShaderPass.ts ***!
  \******************************/
/*! exports provided: ShaderPass */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShaderPass", function() { return ShaderPass; });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib */ "./passes/lib/index.ts");
/* harmony import */ var _Pass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Pass */ "./passes/Pass.ts");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var ShaderPass = function (_Pass) {
  _inherits(ShaderPass, _Pass);

  function ShaderPass(material) {
    var _this;

    var input = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'inputBuffer';

    _classCallCheck(this, ShaderPass);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ShaderPass).call(this, _lib__WEBPACK_IMPORTED_MODULE_0__["PassName"].Shader));

    _this.setFullscreenMaterial(material);

    _this.uniform = null;

    _this.setInput(input);

    return _this;
  }

  _createClass(ShaderPass, [{
    key: "setInput",
    value: function setInput(input) {
      var _this2 = this;

      var materials = this.getFullscreenMaterials();
      this.uniform = null;
      materials.forEach(function (material) {
        var uniforms = material.uniforms;

        if (uniforms[input] !== undefined) {
          _this2.uniform = uniforms[input];
        }
      });
    }
  }, {
    key: "render",
    value: function render(renderer, inputBuffer, outputBuffer) {
      if (this.uniform !== null) {
        this.uniform.value = inputBuffer.texture;
      }

      renderer.render(this.scene, this.camera, this.renderToScreen ? undefined : outputBuffer);
    }
  }]);

  return ShaderPass;
}(_Pass__WEBPACK_IMPORTED_MODULE_1__["Pass"]);

/***/ }),

/***/ "./passes/index.ts":
/*!*************************!*\
  !*** ./passes/index.ts ***!
  \*************************/
/*! exports provided: ClearMaskPass, ClearPass, MaskPass, Pass, RenderPass, ShaderPass */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ClearMaskPass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ClearMaskPass */ "./passes/ClearMaskPass.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ClearMaskPass", function() { return _ClearMaskPass__WEBPACK_IMPORTED_MODULE_0__["ClearMaskPass"]; });

/* harmony import */ var _ClearPass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ClearPass */ "./passes/ClearPass.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ClearPass", function() { return _ClearPass__WEBPACK_IMPORTED_MODULE_1__["ClearPass"]; });

/* harmony import */ var _MaskPass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MaskPass */ "./passes/MaskPass.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MaskPass", function() { return _MaskPass__WEBPACK_IMPORTED_MODULE_2__["MaskPass"]; });

/* harmony import */ var _Pass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Pass */ "./passes/Pass.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Pass", function() { return _Pass__WEBPACK_IMPORTED_MODULE_3__["Pass"]; });

/* harmony import */ var _RenderPass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./RenderPass */ "./passes/RenderPass.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RenderPass", function() { return _RenderPass__WEBPACK_IMPORTED_MODULE_4__["RenderPass"]; });

/* harmony import */ var _ShaderPass__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ShaderPass */ "./passes/ShaderPass.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ShaderPass", function() { return _ShaderPass__WEBPACK_IMPORTED_MODULE_5__["ShaderPass"]; });








/***/ }),

/***/ "./passes/lib/index.ts":
/*!*****************************!*\
  !*** ./passes/lib/index.ts ***!
  \*****************************/
/*! exports provided: PassName */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _passes_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./passes.types */ "./passes/lib/passes.types.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PassName", function() { return _passes_types__WEBPACK_IMPORTED_MODULE_0__["PassName"]; });



/***/ }),

/***/ "./passes/lib/passes.types.ts":
/*!************************************!*\
  !*** ./passes/lib/passes.types.ts ***!
  \************************************/
/*! exports provided: PassName */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PassName", function() { return PassName; });
var PassName;

(function (PassName) {
  PassName["Clear"] = "clear";
  PassName["Render"] = "render";
  PassName["Shader"] = "shader";
  PassName["Mask"] = "mask";
  PassName["ClearMask"] = "clearMask";
})(PassName || (PassName = {}));

/***/ }),

/***/ "./postprocessing.ts":
/*!***************************!*\
  !*** ./postprocessing.ts ***!
  \***************************/
/*! exports provided: EffectComposer, Effect, CopyMaterial, ClearMaskPass, ClearPass, MaskPass, Pass, RenderPass, ShaderPass, BlendFunction, BlendMode, EffectName, EffectAttribute, WebGLExtension */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core */ "./core/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EffectComposer", function() { return _core__WEBPACK_IMPORTED_MODULE_0__["EffectComposer"]; });

/* harmony import */ var _effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./effects */ "./effects/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Effect", function() { return _effects__WEBPACK_IMPORTED_MODULE_1__["Effect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BlendFunction", function() { return _effects__WEBPACK_IMPORTED_MODULE_1__["BlendFunction"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BlendMode", function() { return _effects__WEBPACK_IMPORTED_MODULE_1__["BlendMode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EffectName", function() { return _effects__WEBPACK_IMPORTED_MODULE_1__["EffectName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EffectAttribute", function() { return _effects__WEBPACK_IMPORTED_MODULE_1__["EffectAttribute"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebGLExtension", function() { return _effects__WEBPACK_IMPORTED_MODULE_1__["WebGLExtension"]; });

/* harmony import */ var _materials__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./materials */ "./materials/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CopyMaterial", function() { return _materials__WEBPACK_IMPORTED_MODULE_2__["CopyMaterial"]; });

/* harmony import */ var _passes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./passes */ "./passes/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ClearMaskPass", function() { return _passes__WEBPACK_IMPORTED_MODULE_3__["ClearMaskPass"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ClearPass", function() { return _passes__WEBPACK_IMPORTED_MODULE_3__["ClearPass"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MaskPass", function() { return _passes__WEBPACK_IMPORTED_MODULE_3__["MaskPass"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Pass", function() { return _passes__WEBPACK_IMPORTED_MODULE_3__["Pass"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RenderPass", function() { return _passes__WEBPACK_IMPORTED_MODULE_3__["RenderPass"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ShaderPass", function() { return _passes__WEBPACK_IMPORTED_MODULE_3__["ShaderPass"]; });






/***/ }),

/***/ "three":
/*!************************!*\
  !*** external "three" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_three__;

/***/ })

/******/ });
});
//# sourceMappingURL=postprocessing.js.map