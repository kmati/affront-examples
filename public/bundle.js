/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Affront = undefined;
	
	var _Router = __webpack_require__(/*! ./Router */ 1);
	
	var _Component = __webpack_require__(/*! ./Component */ 2);
	
	var Affront = exports.Affront = {
		Router: new _Router.Router(),
		Component: _Component.Component
	};
	
	if (!window) window = {};
	window.Affront = Affront;

/***/ },
/* 1 */
/*!***********************!*\
  !*** ./lib/Router.js ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Router = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Component = __webpack_require__(/*! ./Component */ 2);
	
	var _InvalidArgumentError = __webpack_require__(/*! ./errors/InvalidArgumentError */ 5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Router = exports.Router = function () {
		function Router() {
			_classCallCheck(this, Router);
	
			this.init();
			this.components = [];
		}
	
		_createClass(Router, [{
			key: 'init',
			value: function init() {
				var self = this;
				// Revert to a previously saved state
				window.addEventListener('popstate', function (event) {
					console.log('popstate fired!');
					self.onStateChanged(event.state);
				});
	
				// Store the initial content so we can revisit it later
				var state = {
					title: document.title,
					url: document.location.href,
					origin: 'init'
				}; // TODO: Figure out what to do with the state
				history.replaceState(state, document.title, document.location.href);
			}
	
			// Used to bind <a> elements
	
		}, {
			key: 'bindLinkElement',
			value: function bindLinkElement(ele) {
				var self = this;
				function clickHandler(event) {
					var state = {
						title: event.target.textContent,
						url: event.target.href,
						origin: 'clicked'
					}; // TODO: Figure out what to do with the state
					self.onStateChanged(state);
	
					// Add an item to the history log
					history.pushState(state, event.target.textContent, event.target.href);
	
					return event.preventDefault();
				}
				ele.addEventListener('click', clickHandler, true);
			}
		}, {
			key: 'onStateChanged',
			value: function onStateChanged(newState) {
				console.log('[Router.onStateChanged] newState = ', newState);
	
				// TODO: Find the components that are bound to the current url in document.location.href
				// 	then call the render method on each
				this.components.forEach(function (component) {
					return component.onUrlChanged(newState.url);
				});
			}
	
			// Adds a routable component
			// component: An instance of Component
	
		}, {
			key: 'addComponent',
			value: function addComponent(component) {
				if (!(component instanceof _Component.Component)) {
					throw new _InvalidArgumentError.InvalidArgumentError('Cannot add component because it is invalid', component);
				}
	
				if (this.components.findIndex(function (c) {
					return c === component;
				}) === -1) {
					this.components.push(component);
				}
			}
		}]);
	
		return Router;
	}();
	
	;

/***/ },
/* 2 */
/*!**************************!*\
  !*** ./lib/Component.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Component = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _UrlContext = __webpack_require__(/*! ./UrlContext */ 3);
	
	var _NotImplementedError = __webpack_require__(/*! ./errors/NotImplementedError */ 4);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Component = exports.Component = function () {
		function Component(routeUrl) {
			_classCallCheck(this, Component);
	
			this.routeParts = Component.parseRoute(routeUrl);
		}
	
		_createClass(Component, [{
			key: 'onUrlChanged',
			value: function onUrlChanged(url) {
				if (url.substr(0, 5) === 'http:' || url.substr(0, 6) === 'https:') {
	
					var loc = url.indexOf('/', 8);
					url = url.substr(loc);
				}
				var urlParams = this.routeParts.matchUrlAndGetParams(url);
				if (urlParams) {
					var ctxt = new _UrlContext.UrlContext(url, urlParams);
					try {
						this.render(ctxt);
					} catch (e) {
						console.error(e);
					}
				}
			}
	
			// ctxt: instance of UrlContext
	
		}, {
			key: 'render',
			value: function render(ctxt) {
				throw new _NotImplementedError.NotImplementedError('render method not yet implemented');
			}
	
			// Helper method that extracts the route parts from a route url
			// Example routeUrl:
			//	/person
			//	/person/:id
			//	/person/:id/address
	
		}], [{
			key: 'parseRoute',
			value: function parseRoute(routeUrl) {
				var piecesArr = [];
				routeUrl.split('/').forEach(function (piece) {
					piece = piece.trim();
					if (piece[0] === ':') {
						piecesArr.push({ type: 'parameter', name: piece.substr(1) });
					} else if (piece.length > 0) {
						piecesArr.push({ type: 'text', value: piece });
					}
				});
				return {
					pieces: piecesArr,
					matchUrlAndGetParams: function matchUrlAndGetParams(url) {
						var urlSegments = url.split('/').filter(function (f) {
							return f.trim().length > 0;
						});
						if (urlSegments.length !== this.pieces.length) {
							// # of segments is different so NOT MATCHED!
							return null;
						}
	
						var urlParameters = {};
	
						for (var c = 0; c < urlSegments.length; c++) {
							var urlSegment = urlSegments[c],
							    componentPiece = this.pieces[c];
							if (componentPiece.type === 'text' && componentPiece.value !== urlSegment) {
								// the url segment does NOT match!
								return null;
							} else if (componentPiece.type === 'parameter') {
								urlParameters[componentPiece.name] = urlSegment;
							}
						}
	
						return urlParameters;
					}
				};
			}
		}]);
	
		return Component;
	}();
	
	;

/***/ },
/* 3 */
/*!***************************!*\
  !*** ./lib/UrlContext.js ***!
  \***************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var UrlContext = exports.UrlContext = function UrlContext(url, params) {
		_classCallCheck(this, UrlContext);
	
		this.url = url;
		this.params = params;
	};
	
	;

/***/ },
/* 4 */
/*!*******************************************!*\
  !*** ./lib/errors/NotImplementedError.js ***!
  \*******************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var NotImplementedError = exports.NotImplementedError = function (_Error) {
		_inherits(NotImplementedError, _Error);
	
		function NotImplementedError(message) {
			_classCallCheck(this, NotImplementedError);
	
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NotImplementedError).call(this, message));
	
			_this.message = message;
			_this.name = 'NotImplementedError';
			return _this;
		}
	
		return NotImplementedError;
	}(Error);
	
	;

/***/ },
/* 5 */
/*!********************************************!*\
  !*** ./lib/errors/InvalidArgumentError.js ***!
  \********************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var InvalidArgumentError = exports.InvalidArgumentError = function (_Error) {
		_inherits(InvalidArgumentError, _Error);
	
		function InvalidArgumentError(message, argument) {
			_classCallCheck(this, InvalidArgumentError);
	
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InvalidArgumentError).call(this, message));
	
			_this.message = message;
			_this.argument = argument;
			_this.name = 'InvalidArgumentError';
			return _this;
		}
	
		return InvalidArgumentError;
	}(Error);
	
	;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map