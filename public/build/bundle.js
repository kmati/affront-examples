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
  !*** ./app/index.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _affront = __webpack_require__(/*! affront */ 1);
	
	var _lib = __webpack_require__(/*! ../lib */ 45);
	
	// add the components of the app
	/*
	 * The main entry point for the client-side app
	 */
	_affront.Affront.Router.addComponent(new _lib.DumbComponent('/molecule'));
	
	_affront.Affront.Router.addComponent(new _lib.AtomComponent('/atom'));
	_affront.Affront.Router.addComponent(new _lib.AtomComponent('/atom/:elementSymbol'));
	
	_affront.Affront.Router.addComponent(new _lib.MyViewComponent('/atom', document.getElementById('divMyView')));
	_affront.Affront.Router.addComponent(new _lib.MyTemplateViewComponent('/', document.getElementById('divMyTemplateView')));
	_affront.Affront.Router.addComponent(new _lib.ComplexTemplateViewComponent('/', document.getElementById('divComplexTemplateView')));
	
	// now start the app!
	_affront.Affront.start();
	
	// set the person state (which will trigger the rendering of the ComplexTemplateViewComponent)
	_affront.Affront.Store.setItem('person', {
		name: 'Horace Sibbs',
		street1: '18 Fig Leaf Road',
		street2: 'Apt. 3',
		city: 'Boston',
		state: 'Massachusetts',
		zip: '02115',
		country: 'USA'
	});

/***/ },
/* 1 */
/*!****************************!*\
  !*** ./~/affront/index.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Affront = undefined;
	
	var _lib = __webpack_require__(/*! ./lib */ 2);
	
	exports.Affront = _lib.Affront;

/***/ },
/* 2 */
/*!********************************!*\
  !*** ./~/affront/lib/index.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Affront = undefined;
	
	var _Router = __webpack_require__(/*! ./Router */ 3);
	
	var _Component = __webpack_require__(/*! ./Component */ 19);
	
	var _Control = __webpack_require__(/*! ./Control */ 21);
	
	var _Store = __webpack_require__(/*! ./Store */ 7);
	
	var _Http = __webpack_require__(/*! ./Http */ 44);
	
	var Affront = exports.Affront = {
		Router: new _Router.Router(),
		ViewComponent: _Component.Component.ViewComponent,
		TemplateViewComponent: _Component.Component.TemplateViewComponent,
		NonVisualComponent: _Component.Component.NonVisualComponent,
		Control: _Control.Control,
		Store: _Store.Store,
		Http: _Http.Http,
	
		// This method should be called when the app has finished loading components and wants to actually start!
		start: function start() {
			this.Router.init();
		}
	};
	
	if (!window) window = {};
	window.Affront = Affront;

/***/ },
/* 3 */
/*!*********************************!*\
  !*** ./~/affront/lib/Router.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Router = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _ComponentBase = __webpack_require__(/*! ./Component/ComponentBase */ 4);
	
	var _InvalidArgumentError = __webpack_require__(/*! ./errors/InvalidArgumentError */ 9);
	
	var _Store = __webpack_require__(/*! ./Store */ 7);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Router = exports.Router = function () {
		function Router() {
			_classCallCheck(this, Router);
	
			_Store.Store.router = this;
			this.components = [];
	
			var self = this;
			// Revert to a previously saved state
			window.addEventListener('popstate', function (event) {
				event.state.isPopState = true;
				self.onStateChanged(event.state);
			});
		}
	
		_createClass(Router, [{
			key: 'init',
			value: function init() {
				// Store the initial content so we can revisit it later
				var state = {
					title: document.title,
					url: document.location.href,
					origin: 'init'
				}; // TODO: Figure out what to do with the state
				history.replaceState(state, document.title, document.location.href);
				this.onStateChanged(state);
			}
	
			// Used to bind <a> elements
	
		}, {
			key: 'bindLinkElement',
			value: function bindLinkElement(ele) {
				var self = this;
				function clickHandler(event) {
					var title = void 0;
					var url = void 0;
					if (event.currentTarget) {
						title = event.currentTarget.textContent;
						url = event.currentTarget.href;
					} else {
						title = event.target.textContent;
						url = event.target.href;
					}
	
					var state = {
						title: title,
						url: url,
						origin: 'clicked'
					}; // TODO: Figure out what to do with the state
					self.onStateChanged(state);
	
					// Add an item to the history log
					history.pushState(state, title, url);
	
					return event.preventDefault();
				}
	
				if (!ele.hasClickHandler) {
					// ele's click handler is NOT yet bound, so bind it now
					ele.addEventListener('click', clickHandler, true);
					ele.hasClickHandler = true;
				}
			}
		}, {
			key: 'onStateChanged',
			value: function onStateChanged(newState) {
				// find the components that are bound to the current url in document.location.href
				// and call the render method on each
				this.components.forEach(function (component) {
					return component.onUrlChanged(newState.url);
				});
	
				if (newState.isPopState) {
					// going backward/forward to a previous url
					var versionNumber = _Store.Store.findLatestMatchingVersionNumber('Router', function (storeItem) {
						return storeItem.value.url === newState.url;
					});
					if (versionNumber > -1) {
						var forwardVerArr = _Store.Store.rewindToVersion(versionNumber);
						if (!this.forwardVersions) {
							this.forwardVersions = forwardVerArr;
						} else {
							this.forwardVersions = forwardVerArr.concat(this.forwardVersions);
						}
					} else {
						var maxFVIndex = this.findForwardVersionIndexWithRoute(newState.url);
						if (maxFVIndex > -1) {
							// we found the forward version which means we're going forward to it
							for (var c = 0; c <= maxFVIndex; c++) {
								_Store.Store.appendVersion(this.forwardVersions[c]);
							}
							this.forwardVersions.splice(0, maxFVIndex + 1);
						} else {
							// no forward version found which means that this is a new route so set the new route!
							_Store.Store.setItemAtNextVersion('Router', newState);
						}
						_Store.Store.sendNotificationsForCurrentVersion();
					}
				} else {
					// going to a new url
					_Store.Store.setItemAtNextVersion('Router', newState);
					_Store.Store.sendNotificationsForCurrentVersion();
				}
			}
		}, {
			key: 'findForwardVersionIndexWithRoute',
			value: function findForwardVersionIndexWithRoute(routeUrl) {
				if (this.forwardVersions) {
					for (var c = 0; c < this.forwardVersions.length; c++) {
						var fv = this.forwardVersions[c];
						if (fv.data.get('Router').value.url === routeUrl) {
							return c;
						}
					}
				}
				return -1;
			}
		}, {
			key: 'onSetItem',
			value: function onSetItem(storeItem) {
				if (storeItem.key !== 'Router') {
					delete this.forwardVersions;
				}
			}
	
			// Adds a routable component
			// component: An instance of Component
	
		}, {
			key: 'addComponent',
			value: function addComponent(component) {
				if (!(component instanceof _ComponentBase.ComponentBase)) {
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
/* 4 */
/*!**************************************************!*\
  !*** ./~/affront/lib/Component/ComponentBase.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.ComponentBase = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _UrlContext = __webpack_require__(/*! ../UrlContext */ 5);
	
	var _NotImplementedError = __webpack_require__(/*! ../errors/NotImplementedError */ 6);
	
	var _Store = __webpack_require__(/*! ../Store */ 7);
	
	var _Events = __webpack_require__(/*! ../Events */ 15);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Mode = {
		Rendered: 'rendered',
		Hidden: 'hidden'
	};
	
	var ComponentBase = exports.ComponentBase = function () {
		function ComponentBase(routeUrl) {
			_classCallCheck(this, ComponentBase);
	
			this.routeUrl = routeUrl;
			this.routeParts = ComponentBase.parseRoute(routeUrl);
			this.mode = Mode.Hidden;
			this.lastEvent = null;
		}
	
		_createClass(ComponentBase, [{
			key: 'subscribe',
			value: function subscribe(key) {
				var self = this;
				return _Store.Store.subscribe(key, function (storeItem) {
					if (self.mode === Mode.Rendered) {
						self.lastEvent = new _Events.Events.NotificationEvent(storeItem);
						self.notificationRender(storeItem);
					}
				});
			}
		}, {
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
						if (this.mode === Mode.Hidden) {
							this.lastEvent = new _Events.Events.RouteChangedEvent(ctxt);
							this.urlChangedRender(ctxt);
							this.mode = Mode.Rendered;
						}
					} catch (e) {
						console.error(e);
					}
				} else if (this.mode === Mode.Rendered) {
					this.hide();
					this.mode = Mode.Hidden;
				}
			}
	
			// This method is invoked so the component can set itself up to render content;
			// i.e. boiler plate content (static content) must be displayed
			// ctxt: an UrlContext instance
	
		}, {
			key: 'urlChangedRender',
			value: function urlChangedRender(ctxt) {
				throw new _NotImplementedError.NotImplementedError('urlChangedRender method not yet implemented');
			}
	
			// This method is invoked so the component can render the actual data (storeItem)
			// ctxt: a StoreItem instance
	
		}, {
			key: 'notificationRender',
			value: function notificationRender(storeItem) {
				throw new _NotImplementedError.NotImplementedError('notificationRender method not yet implemented');
			}
		}, {
			key: 'hide',
			value: function hide() {
				throw new _NotImplementedError.NotImplementedError('hide method not yet implemented');
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
	
		return ComponentBase;
	}();
	
	;

/***/ },
/* 5 */
/*!*************************************!*\
  !*** ./~/affront/lib/UrlContext.js ***!
  \*************************************/
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
/* 6 */
/*!*****************************************************!*\
  !*** ./~/affront/lib/errors/NotImplementedError.js ***!
  \*****************************************************/
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
/* 7 */
/*!**************************************!*\
  !*** ./~/affront/lib/Store/index.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Store = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * The store for state data
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */
	
	
	var _immutable = __webpack_require__(/*! immutable */ 8);
	
	var _InvalidArgumentError = __webpack_require__(/*! ../errors/InvalidArgumentError */ 9);
	
	var _Subscriptions = __webpack_require__(/*! ./Subscriptions */ 10);
	
	var _StoreItem = __webpack_require__(/*! ./StoreItem */ 14);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Storage = function () {
		function Storage() {
			_classCallCheck(this, Storage);
	
			this.versions = new _immutable.List();
			this._preserveHistory = false;
			this.subscriptionManager = new _Subscriptions.Subscriptions.SubscriptionManager();
		}
	
		_createClass(Storage, [{
			key: 'getItems',
	
	
			// Gets all store items in the store at a given version
			value: function getItems(version) {
				if (version !== undefined) {
					if (typeof version !== 'number') {
						throw new _InvalidArgumentError.InvalidArgumentError('Store.getItem::version argument must be a number');
					}
					if (version < 0) {
						throw new _InvalidArgumentError.InvalidArgumentError('Store.getItem::version argument must be a positive number');
					}
				}
				if (this.versions.isEmpty()) {
					return null;
				}
				var currentVersion = void 0;
				if (version !== undefined && version < this.versions.size) {
					currentVersion = this.versions.get(version);
				} else {
					currentVersion = this.versions.last();
				}
				return currentVersion.data.toJS();
			}
	
			// Gets a store item in the store at a given version (or at the latest version if version is null or undefined)
			// Call syntax:
			// - store.getItem(key, version) => StoreItem
			// - store.getItem(key) => StoreItem
			// key: The key for the store item to get
			// version: The version number at which to get the store item
			// Returns: The store item if found, else null
	
		}, {
			key: 'getItem',
			value: function getItem(key, version) {
				if (version !== undefined && version !== null) {
					if (typeof version !== 'number') {
						throw new _InvalidArgumentError.InvalidArgumentError('Store.getItem::version argument must be a number');
					}
					if (version < 0) {
						throw new _InvalidArgumentError.InvalidArgumentError('Store.getItem::version argument must be a positive number');
					}
				}
				if (this.versions.isEmpty()) {
					return null;
				}
				var currentVersion = void 0;
				if (version !== undefined && version !== null && version < this.versions.size) {
					currentVersion = this.versions.get(version);
				} else {
					currentVersion = this.versions.last();
				}
				if (!currentVersion.data.has(key)) {
					return null;
				}
				return currentVersion.data.get(key);
			}
	
			// key: The key to find in the matching version
			// fn: The predicate to match on for a storeItem whose call signature is: function (StoreItem) => boolean
			// Returns: The latest matching version number if found, else -1
	
		}, {
			key: 'findLatestMatchingVersionNumber',
			value: function findLatestMatchingVersionNumber(key, fn) {
				for (var verNum = this.versions.size - 1; verNum >= 0; verNum--) {
					var version = this.versions.get(verNum);
					if (version.data.has(key)) {
						var storeItem = version.data.get(key);
						if (fn(storeItem)) {
							return verNum;
						}
					}
				}
				return -1;
			}
	
			// Removes the versions that are AFTER the specified version number
			// and then sends out the notifications of the version
			// version: the version number of the version to rewind to
			// Returns: An array of the exluded versions (e.g. [ver-6-obj, ver-7-obj, ..., ver-N-obj])
	
		}, {
			key: 'rewindToVersion',
			value: function rewindToVersion(version) {
				if (version === undefined || version === null || typeof version !== 'number') {
					throw new _InvalidArgumentError.InvalidArgumentError('Store.rewindToVersion::version argument must be a number');
				}
				if (version < 0) {
					throw new _InvalidArgumentError.InvalidArgumentError('Store.rewindToVersion::version argument must be a positive number');
				}
				if (version >= this.versions.size) {
					throw new _InvalidArgumentError.InvalidArgumentError('Store.rewindToVersion::version argument must be less than the size of the versions list');
				}
				if (this.versions.isEmpty()) {
					return;
				}
	
				var excludedVersions = [];
				for (var c = version + 1; c < this.versions.size; c++) {
					excludedVersions.push(this.versions.get(c));
				}
	
				// truncate the versions that are higher/after the specified version number
				this.versions = this.versions.setSize(version + 1);
	
				// get the actual version instance
				var currentVersion = this.versions.get(version);
	
				// now send the notifications for all the store items in the version
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;
	
				try {
					for (var _iterator = currentVersion.data.valueSeq()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var storeItem = _step.value;
	
						this.subscriptionManager.notify(storeItem);
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
	
				return excludedVersions;
			}
	
			// Sends out the notifications for all the store items for the current (i.e. latest) version
	
		}, {
			key: 'sendNotificationsForCurrentVersion',
			value: function sendNotificationsForCurrentVersion() {
				var currentVersion = this.versions.last();
	
				// now send the notifications for all the store items in the version
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;
	
				try {
					for (var _iterator2 = currentVersion.data.valueSeq()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var storeItem = _step2.value;
	
						this.subscriptionManager.notify(storeItem);
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			}
	
			// Note: The first version will be version 0!
	
		}, {
			key: 'setItem',
			value: function setItem(key, value) {
				var currentVersion = void 0;
				if (this.versions.isEmpty()) {
					this.versions = this.versions.push({
						version: 0, // first version is version 0
						data: new _immutable.Map()
					});
				} else if (this._preserveHistory) {
					var lastVersionData = this.versions.last().data;
					var lastVersion = this.versions.last().version;
					this.versions = this.versions.push({
						version: lastVersion + 1,
						data: lastVersionData
					});
				}
				currentVersion = this.versions.last();
	
				var item = new _StoreItem.StoreItem(key, value);
				currentVersion.data = currentVersion.data.set(key, item);
				this.subscriptionManager.notify(item);
	
				this.router.onSetItem(item);
				return item;
			}
	
			// Note: The first version will be version 0!
			// Note: This method will forcibly create a new version since it IGNORES this._preserveHistory!!!
	
		}, {
			key: 'setItemAtNextVersion',
			value: function setItemAtNextVersion(key, value) {
				var currentVersion = void 0;
				if (this.versions.isEmpty()) {
					this.versions = this.versions.push({
						version: 0, // first version is version 0
						data: new _immutable.Map()
					});
				} else {
					var lastVersionData = this.versions.last().data;
					var lastVersion = this.versions.last().version;
					this.versions = this.versions.push({
						version: lastVersion + 1,
						data: lastVersionData
					});
				}
				currentVersion = this.versions.last();
	
				var item = new _StoreItem.StoreItem(key, value);
				currentVersion.data = currentVersion.data.set(key, item);
				this.subscriptionManager.notify(item);
	
				this.router.onSetItem(item);
				return item;
			}
		}, {
			key: 'appendVersion',
			value: function appendVersion(version) {
				this.versions = this.versions.push(version);
			}
	
			// Subscribes to get called whenever the state changes at a given key in the store
			// key: The key to listen for state changes on
			// context: The object that owns the function to invoke
			// fn: The function to invoke whose signature is: void function (StoreItem)
			// Returns: A subscriber instance
			// Remarks:
			// 1. This method can be called in the following 2 ways:
			// - subscribe(key, context, fn)
			// - subscribe(key, fn)
			// 2. To unsubscribe, call: subscriberInstance.unsubscribe()
	
		}, {
			key: 'subscribe',
			value: function subscribe(key, context, fn) {
				if (typeof context === 'function') {
					fn = context;
					context = null;
				}
	
				var subscription = this.subscriptionManager.getSubscription(key);
				return subscription.addSubscriber(new _Subscriptions.Subscriptions.Subscriber(context, fn));
			}
		}, {
			key: 'preserveHistory',
			get: function get() {
				return this._preserveHistory;
			}
	
			// If store.preserveHistory is set to true then version history of the store will be preserved;
			//	i.e. each state change in the store will create a new version
			,
			set: function set(value) {
				this._preserveHistory = value;
			}
		}]);
	
		return Storage;
	}();
	
	var Store = exports.Store = new Storage();

/***/ },
/* 8 */
/*!***************************************!*\
  !*** ./~/immutable/dist/immutable.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;}; /**
	 *  Copyright (c) 2014-2015, Facebook, Inc.
	 *  All rights reserved.
	 *
	 *  This source code is licensed under the BSD-style license found in the
	 *  LICENSE file in the root directory of this source tree. An additional grant
	 *  of patent rights can be found in the PATENTS file in the same directory.
	 */(function(global,factory){( false?'undefined':_typeof(exports))==='object'&&typeof module!=='undefined'?module.exports=factory(): true?!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):global.Immutable=factory();})(undefined,function(){'use strict';var SLICE$0=Array.prototype.slice;function createClass(ctor,superClass){if(superClass){ctor.prototype=Object.create(superClass.prototype);}ctor.prototype.constructor=ctor;}function Iterable(value){return isIterable(value)?value:Seq(value);}createClass(KeyedIterable,Iterable);function KeyedIterable(value){return isKeyed(value)?value:KeyedSeq(value);}createClass(IndexedIterable,Iterable);function IndexedIterable(value){return isIndexed(value)?value:IndexedSeq(value);}createClass(SetIterable,Iterable);function SetIterable(value){return isIterable(value)&&!isAssociative(value)?value:SetSeq(value);}function isIterable(maybeIterable){return !!(maybeIterable&&maybeIterable[IS_ITERABLE_SENTINEL]);}function isKeyed(maybeKeyed){return !!(maybeKeyed&&maybeKeyed[IS_KEYED_SENTINEL]);}function isIndexed(maybeIndexed){return !!(maybeIndexed&&maybeIndexed[IS_INDEXED_SENTINEL]);}function isAssociative(maybeAssociative){return isKeyed(maybeAssociative)||isIndexed(maybeAssociative);}function isOrdered(maybeOrdered){return !!(maybeOrdered&&maybeOrdered[IS_ORDERED_SENTINEL]);}Iterable.isIterable=isIterable;Iterable.isKeyed=isKeyed;Iterable.isIndexed=isIndexed;Iterable.isAssociative=isAssociative;Iterable.isOrdered=isOrdered;Iterable.Keyed=KeyedIterable;Iterable.Indexed=IndexedIterable;Iterable.Set=SetIterable;var IS_ITERABLE_SENTINEL='@@__IMMUTABLE_ITERABLE__@@';var IS_KEYED_SENTINEL='@@__IMMUTABLE_KEYED__@@';var IS_INDEXED_SENTINEL='@@__IMMUTABLE_INDEXED__@@';var IS_ORDERED_SENTINEL='@@__IMMUTABLE_ORDERED__@@'; // Used for setting prototype methods that IE8 chokes on.
	var DELETE='delete'; // Constants describing the size of trie nodes.
	var SHIFT=5; // Resulted in best performance after ______?
	var SIZE=1<<SHIFT;var MASK=SIZE-1; // A consistent shared value representing "not set" which equals nothing other
	// than itself, and nothing that could be provided externally.
	var NOT_SET={}; // Boolean references, Rough equivalent of `bool &`.
	var CHANGE_LENGTH={value:false};var DID_ALTER={value:false};function MakeRef(ref){ref.value=false;return ref;}function SetRef(ref){ref&&(ref.value=true);} // A function which returns a value representing an "owner" for transient writes
	// to tries. The return value will only ever equal itself, and will not equal
	// the return of any subsequent call of this function.
	function OwnerID(){} // http://jsperf.com/copy-array-inline
	function arrCopy(arr,offset){offset=offset||0;var len=Math.max(0,arr.length-offset);var newArr=new Array(len);for(var ii=0;ii<len;ii++){newArr[ii]=arr[ii+offset];}return newArr;}function ensureSize(iter){if(iter.size===undefined){iter.size=iter.__iterate(returnTrue);}return iter.size;}function wrapIndex(iter,index){ // This implements "is array index" which the ECMAString spec defines as:
	//
	//     A String property name P is an array index if and only if
	//     ToString(ToUint32(P)) is equal to P and ToUint32(P) is not equal
	//     to 2^32−1.
	//
	// http://www.ecma-international.org/ecma-262/6.0/#sec-array-exotic-objects
	if(typeof index!=='number'){var uint32Index=index>>>0; // N >>> 0 is shorthand for ToUint32
	if(''+uint32Index!==index||uint32Index===4294967295){return NaN;}index=uint32Index;}return index<0?ensureSize(iter)+index:index;}function returnTrue(){return true;}function wholeSlice(begin,end,size){return (begin===0||size!==undefined&&begin<=-size)&&(end===undefined||size!==undefined&&end>=size);}function resolveBegin(begin,size){return resolveIndex(begin,size,0);}function resolveEnd(end,size){return resolveIndex(end,size,size);}function resolveIndex(index,size,defaultIndex){return index===undefined?defaultIndex:index<0?Math.max(0,size+index):size===undefined?index:Math.min(size,index);} /* global Symbol */var ITERATE_KEYS=0;var ITERATE_VALUES=1;var ITERATE_ENTRIES=2;var REAL_ITERATOR_SYMBOL=typeof Symbol==='function'&&Symbol.iterator;var FAUX_ITERATOR_SYMBOL='@@iterator';var ITERATOR_SYMBOL=REAL_ITERATOR_SYMBOL||FAUX_ITERATOR_SYMBOL;function Iterator(next){this.next=next;}Iterator.prototype.toString=function(){return '[Iterator]';};Iterator.KEYS=ITERATE_KEYS;Iterator.VALUES=ITERATE_VALUES;Iterator.ENTRIES=ITERATE_ENTRIES;Iterator.prototype.inspect=Iterator.prototype.toSource=function(){return this.toString();};Iterator.prototype[ITERATOR_SYMBOL]=function(){return this;};function iteratorValue(type,k,v,iteratorResult){var value=type===0?k:type===1?v:[k,v];iteratorResult?iteratorResult.value=value:iteratorResult={value:value,done:false};return iteratorResult;}function iteratorDone(){return {value:undefined,done:true};}function hasIterator(maybeIterable){return !!getIteratorFn(maybeIterable);}function isIterator(maybeIterator){return maybeIterator&&typeof maybeIterator.next==='function';}function getIterator(iterable){var iteratorFn=getIteratorFn(iterable);return iteratorFn&&iteratorFn.call(iterable);}function getIteratorFn(iterable){var iteratorFn=iterable&&(REAL_ITERATOR_SYMBOL&&iterable[REAL_ITERATOR_SYMBOL]||iterable[FAUX_ITERATOR_SYMBOL]);if(typeof iteratorFn==='function'){return iteratorFn;}}function isArrayLike(value){return value&&typeof value.length==='number';}createClass(Seq,Iterable);function Seq(value){return value===null||value===undefined?emptySequence():isIterable(value)?value.toSeq():seqFromValue(value);}Seq.of=function() /*...values*/{return Seq(arguments);};Seq.prototype.toSeq=function(){return this;};Seq.prototype.toString=function(){return this.__toString('Seq {','}');};Seq.prototype.cacheResult=function(){if(!this._cache&&this.__iterateUncached){this._cache=this.entrySeq().toArray();this.size=this._cache.length;}return this;}; // abstract __iterateUncached(fn, reverse)
	Seq.prototype.__iterate=function(fn,reverse){return seqIterate(this,fn,reverse,true);}; // abstract __iteratorUncached(type, reverse)
	Seq.prototype.__iterator=function(type,reverse){return seqIterator(this,type,reverse,true);};createClass(KeyedSeq,Seq);function KeyedSeq(value){return value===null||value===undefined?emptySequence().toKeyedSeq():isIterable(value)?isKeyed(value)?value.toSeq():value.fromEntrySeq():keyedSeqFromValue(value);}KeyedSeq.prototype.toKeyedSeq=function(){return this;};createClass(IndexedSeq,Seq);function IndexedSeq(value){return value===null||value===undefined?emptySequence():!isIterable(value)?indexedSeqFromValue(value):isKeyed(value)?value.entrySeq():value.toIndexedSeq();}IndexedSeq.of=function() /*...values*/{return IndexedSeq(arguments);};IndexedSeq.prototype.toIndexedSeq=function(){return this;};IndexedSeq.prototype.toString=function(){return this.__toString('Seq [',']');};IndexedSeq.prototype.__iterate=function(fn,reverse){return seqIterate(this,fn,reverse,false);};IndexedSeq.prototype.__iterator=function(type,reverse){return seqIterator(this,type,reverse,false);};createClass(SetSeq,Seq);function SetSeq(value){return (value===null||value===undefined?emptySequence():!isIterable(value)?indexedSeqFromValue(value):isKeyed(value)?value.entrySeq():value).toSetSeq();}SetSeq.of=function() /*...values*/{return SetSeq(arguments);};SetSeq.prototype.toSetSeq=function(){return this;};Seq.isSeq=isSeq;Seq.Keyed=KeyedSeq;Seq.Set=SetSeq;Seq.Indexed=IndexedSeq;var IS_SEQ_SENTINEL='@@__IMMUTABLE_SEQ__@@';Seq.prototype[IS_SEQ_SENTINEL]=true;createClass(ArraySeq,IndexedSeq);function ArraySeq(array){this._array=array;this.size=array.length;}ArraySeq.prototype.get=function(index,notSetValue){return this.has(index)?this._array[wrapIndex(this,index)]:notSetValue;};ArraySeq.prototype.__iterate=function(fn,reverse){var array=this._array;var maxIndex=array.length-1;for(var ii=0;ii<=maxIndex;ii++){if(fn(array[reverse?maxIndex-ii:ii],ii,this)===false){return ii+1;}}return ii;};ArraySeq.prototype.__iterator=function(type,reverse){var array=this._array;var maxIndex=array.length-1;var ii=0;return new Iterator(function(){return ii>maxIndex?iteratorDone():iteratorValue(type,ii,array[reverse?maxIndex-ii++:ii++]);});};createClass(ObjectSeq,KeyedSeq);function ObjectSeq(object){var keys=Object.keys(object);this._object=object;this._keys=keys;this.size=keys.length;}ObjectSeq.prototype.get=function(key,notSetValue){if(notSetValue!==undefined&&!this.has(key)){return notSetValue;}return this._object[key];};ObjectSeq.prototype.has=function(key){return this._object.hasOwnProperty(key);};ObjectSeq.prototype.__iterate=function(fn,reverse){var object=this._object;var keys=this._keys;var maxIndex=keys.length-1;for(var ii=0;ii<=maxIndex;ii++){var key=keys[reverse?maxIndex-ii:ii];if(fn(object[key],key,this)===false){return ii+1;}}return ii;};ObjectSeq.prototype.__iterator=function(type,reverse){var object=this._object;var keys=this._keys;var maxIndex=keys.length-1;var ii=0;return new Iterator(function(){var key=keys[reverse?maxIndex-ii:ii];return ii++>maxIndex?iteratorDone():iteratorValue(type,key,object[key]);});};ObjectSeq.prototype[IS_ORDERED_SENTINEL]=true;createClass(IterableSeq,IndexedSeq);function IterableSeq(iterable){this._iterable=iterable;this.size=iterable.length||iterable.size;}IterableSeq.prototype.__iterateUncached=function(fn,reverse){if(reverse){return this.cacheResult().__iterate(fn,reverse);}var iterable=this._iterable;var iterator=getIterator(iterable);var iterations=0;if(isIterator(iterator)){var step;while(!(step=iterator.next()).done){if(fn(step.value,iterations++,this)===false){break;}}}return iterations;};IterableSeq.prototype.__iteratorUncached=function(type,reverse){if(reverse){return this.cacheResult().__iterator(type,reverse);}var iterable=this._iterable;var iterator=getIterator(iterable);if(!isIterator(iterator)){return new Iterator(iteratorDone);}var iterations=0;return new Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type,iterations++,step.value);});};createClass(IteratorSeq,IndexedSeq);function IteratorSeq(iterator){this._iterator=iterator;this._iteratorCache=[];}IteratorSeq.prototype.__iterateUncached=function(fn,reverse){if(reverse){return this.cacheResult().__iterate(fn,reverse);}var iterator=this._iterator;var cache=this._iteratorCache;var iterations=0;while(iterations<cache.length){if(fn(cache[iterations],iterations++,this)===false){return iterations;}}var step;while(!(step=iterator.next()).done){var val=step.value;cache[iterations]=val;if(fn(val,iterations++,this)===false){break;}}return iterations;};IteratorSeq.prototype.__iteratorUncached=function(type,reverse){if(reverse){return this.cacheResult().__iterator(type,reverse);}var iterator=this._iterator;var cache=this._iteratorCache;var iterations=0;return new Iterator(function(){if(iterations>=cache.length){var step=iterator.next();if(step.done){return step;}cache[iterations]=step.value;}return iteratorValue(type,iterations,cache[iterations++]);});}; // # pragma Helper functions
	function isSeq(maybeSeq){return !!(maybeSeq&&maybeSeq[IS_SEQ_SENTINEL]);}var EMPTY_SEQ;function emptySequence(){return EMPTY_SEQ||(EMPTY_SEQ=new ArraySeq([]));}function keyedSeqFromValue(value){var seq=Array.isArray(value)?new ArraySeq(value).fromEntrySeq():isIterator(value)?new IteratorSeq(value).fromEntrySeq():hasIterator(value)?new IterableSeq(value).fromEntrySeq():(typeof value==='undefined'?'undefined':_typeof(value))==='object'?new ObjectSeq(value):undefined;if(!seq){throw new TypeError('Expected Array or iterable object of [k, v] entries, '+'or keyed object: '+value);}return seq;}function indexedSeqFromValue(value){var seq=maybeIndexedSeqFromValue(value);if(!seq){throw new TypeError('Expected Array or iterable object of values: '+value);}return seq;}function seqFromValue(value){var seq=maybeIndexedSeqFromValue(value)||(typeof value==='undefined'?'undefined':_typeof(value))==='object'&&new ObjectSeq(value);if(!seq){throw new TypeError('Expected Array or iterable object of values, or keyed object: '+value);}return seq;}function maybeIndexedSeqFromValue(value){return isArrayLike(value)?new ArraySeq(value):isIterator(value)?new IteratorSeq(value):hasIterator(value)?new IterableSeq(value):undefined;}function seqIterate(seq,fn,reverse,useKeys){var cache=seq._cache;if(cache){var maxIndex=cache.length-1;for(var ii=0;ii<=maxIndex;ii++){var entry=cache[reverse?maxIndex-ii:ii];if(fn(entry[1],useKeys?entry[0]:ii,seq)===false){return ii+1;}}return ii;}return seq.__iterateUncached(fn,reverse);}function seqIterator(seq,type,reverse,useKeys){var cache=seq._cache;if(cache){var maxIndex=cache.length-1;var ii=0;return new Iterator(function(){var entry=cache[reverse?maxIndex-ii:ii];return ii++>maxIndex?iteratorDone():iteratorValue(type,useKeys?entry[0]:ii-1,entry[1]);});}return seq.__iteratorUncached(type,reverse);}function fromJS(json,converter){return converter?fromJSWith(converter,json,'',{'':json}):fromJSDefault(json);}function fromJSWith(converter,json,key,parentJSON){if(Array.isArray(json)){return converter.call(parentJSON,key,IndexedSeq(json).map(function(v,k){return fromJSWith(converter,v,k,json);}));}if(isPlainObj(json)){return converter.call(parentJSON,key,KeyedSeq(json).map(function(v,k){return fromJSWith(converter,v,k,json);}));}return json;}function fromJSDefault(json){if(Array.isArray(json)){return IndexedSeq(json).map(fromJSDefault).toList();}if(isPlainObj(json)){return KeyedSeq(json).map(fromJSDefault).toMap();}return json;}function isPlainObj(value){return value&&(value.constructor===Object||value.constructor===undefined);} /**
	   * An extension of the "same-value" algorithm as [described for use by ES6 Map
	   * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
	   *
	   * NaN is considered the same as NaN, however -0 and 0 are considered the same
	   * value, which is different from the algorithm described by
	   * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
	   *
	   * This is extended further to allow Objects to describe the values they
	   * represent, by way of `valueOf` or `equals` (and `hashCode`).
	   *
	   * Note: because of this extension, the key equality of Immutable.Map and the
	   * value equality of Immutable.Set will differ from ES6 Map and Set.
	   *
	   * ### Defining custom values
	   *
	   * The easiest way to describe the value an object represents is by implementing
	   * `valueOf`. For example, `Date` represents a value by returning a unix
	   * timestamp for `valueOf`:
	   *
	   *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
	   *     var date2 = new Date(1234567890000);
	   *     date1.valueOf(); // 1234567890000
	   *     assert( date1 !== date2 );
	   *     assert( Immutable.is( date1, date2 ) );
	   *
	   * Note: overriding `valueOf` may have other implications if you use this object
	   * where JavaScript expects a primitive, such as implicit string coercion.
	   *
	   * For more complex types, especially collections, implementing `valueOf` may
	   * not be performant. An alternative is to implement `equals` and `hashCode`.
	   *
	   * `equals` takes another object, presumably of similar type, and returns true
	   * if the it is equal. Equality is symmetrical, so the same result should be
	   * returned if this and the argument are flipped.
	   *
	   *     assert( a.equals(b) === b.equals(a) );
	   *
	   * `hashCode` returns a 32bit integer number representing the object which will
	   * be used to determine how to store the value object in a Map or Set. You must
	   * provide both or neither methods, one must not exist without the other.
	   *
	   * Also, an important relationship between these methods must be upheld: if two
	   * values are equal, they *must* return the same hashCode. If the values are not
	   * equal, they might have the same hashCode; this is called a hash collision,
	   * and while undesirable for performance reasons, it is acceptable.
	   *
	   *     if (a.equals(b)) {
	   *       assert( a.hashCode() === b.hashCode() );
	   *     }
	   *
	   * All Immutable collections implement `equals` and `hashCode`.
	   *
	   */function is(valueA,valueB){if(valueA===valueB||valueA!==valueA&&valueB!==valueB){return true;}if(!valueA||!valueB){return false;}if(typeof valueA.valueOf==='function'&&typeof valueB.valueOf==='function'){valueA=valueA.valueOf();valueB=valueB.valueOf();if(valueA===valueB||valueA!==valueA&&valueB!==valueB){return true;}if(!valueA||!valueB){return false;}}if(typeof valueA.equals==='function'&&typeof valueB.equals==='function'&&valueA.equals(valueB)){return true;}return false;}function deepEqual(a,b){if(a===b){return true;}if(!isIterable(b)||a.size!==undefined&&b.size!==undefined&&a.size!==b.size||a.__hash!==undefined&&b.__hash!==undefined&&a.__hash!==b.__hash||isKeyed(a)!==isKeyed(b)||isIndexed(a)!==isIndexed(b)||isOrdered(a)!==isOrdered(b)){return false;}if(a.size===0&&b.size===0){return true;}var notAssociative=!isAssociative(a);if(isOrdered(a)){var entries=a.entries();return b.every(function(v,k){var entry=entries.next().value;return entry&&is(entry[1],v)&&(notAssociative||is(entry[0],k));})&&entries.next().done;}var flipped=false;if(a.size===undefined){if(b.size===undefined){if(typeof a.cacheResult==='function'){a.cacheResult();}}else {flipped=true;var _=a;a=b;b=_;}}var allEqual=true;var bSize=b.__iterate(function(v,k){if(notAssociative?!a.has(v):flipped?!is(v,a.get(k,NOT_SET)):!is(a.get(k,NOT_SET),v)){allEqual=false;return false;}});return allEqual&&a.size===bSize;}createClass(Repeat,IndexedSeq);function Repeat(value,times){if(!(this instanceof Repeat)){return new Repeat(value,times);}this._value=value;this.size=times===undefined?Infinity:Math.max(0,times);if(this.size===0){if(EMPTY_REPEAT){return EMPTY_REPEAT;}EMPTY_REPEAT=this;}}Repeat.prototype.toString=function(){if(this.size===0){return 'Repeat []';}return 'Repeat [ '+this._value+' '+this.size+' times ]';};Repeat.prototype.get=function(index,notSetValue){return this.has(index)?this._value:notSetValue;};Repeat.prototype.includes=function(searchValue){return is(this._value,searchValue);};Repeat.prototype.slice=function(begin,end){var size=this.size;return wholeSlice(begin,end,size)?this:new Repeat(this._value,resolveEnd(end,size)-resolveBegin(begin,size));};Repeat.prototype.reverse=function(){return this;};Repeat.prototype.indexOf=function(searchValue){if(is(this._value,searchValue)){return 0;}return -1;};Repeat.prototype.lastIndexOf=function(searchValue){if(is(this._value,searchValue)){return this.size;}return -1;};Repeat.prototype.__iterate=function(fn,reverse){for(var ii=0;ii<this.size;ii++){if(fn(this._value,ii,this)===false){return ii+1;}}return ii;};Repeat.prototype.__iterator=function(type,reverse){var this$0=this;var ii=0;return new Iterator(function(){return ii<this$0.size?iteratorValue(type,ii++,this$0._value):iteratorDone();});};Repeat.prototype.equals=function(other){return other instanceof Repeat?is(this._value,other._value):deepEqual(other);};var EMPTY_REPEAT;function invariant(condition,error){if(!condition)throw new Error(error);}createClass(Range,IndexedSeq);function Range(start,end,step){if(!(this instanceof Range)){return new Range(start,end,step);}invariant(step!==0,'Cannot step a Range by 0');start=start||0;if(end===undefined){end=Infinity;}step=step===undefined?1:Math.abs(step);if(end<start){step=-step;}this._start=start;this._end=end;this._step=step;this.size=Math.max(0,Math.ceil((end-start)/step-1)+1);if(this.size===0){if(EMPTY_RANGE){return EMPTY_RANGE;}EMPTY_RANGE=this;}}Range.prototype.toString=function(){if(this.size===0){return 'Range []';}return 'Range [ '+this._start+'...'+this._end+(this._step!==1?' by '+this._step:'')+' ]';};Range.prototype.get=function(index,notSetValue){return this.has(index)?this._start+wrapIndex(this,index)*this._step:notSetValue;};Range.prototype.includes=function(searchValue){var possibleIndex=(searchValue-this._start)/this._step;return possibleIndex>=0&&possibleIndex<this.size&&possibleIndex===Math.floor(possibleIndex);};Range.prototype.slice=function(begin,end){if(wholeSlice(begin,end,this.size)){return this;}begin=resolveBegin(begin,this.size);end=resolveEnd(end,this.size);if(end<=begin){return new Range(0,0);}return new Range(this.get(begin,this._end),this.get(end,this._end),this._step);};Range.prototype.indexOf=function(searchValue){var offsetValue=searchValue-this._start;if(offsetValue%this._step===0){var index=offsetValue/this._step;if(index>=0&&index<this.size){return index;}}return -1;};Range.prototype.lastIndexOf=function(searchValue){return this.indexOf(searchValue);};Range.prototype.__iterate=function(fn,reverse){var maxIndex=this.size-1;var step=this._step;var value=reverse?this._start+maxIndex*step:this._start;for(var ii=0;ii<=maxIndex;ii++){if(fn(value,ii,this)===false){return ii+1;}value+=reverse?-step:step;}return ii;};Range.prototype.__iterator=function(type,reverse){var maxIndex=this.size-1;var step=this._step;var value=reverse?this._start+maxIndex*step:this._start;var ii=0;return new Iterator(function(){var v=value;value+=reverse?-step:step;return ii>maxIndex?iteratorDone():iteratorValue(type,ii++,v);});};Range.prototype.equals=function(other){return other instanceof Range?this._start===other._start&&this._end===other._end&&this._step===other._step:deepEqual(this,other);};var EMPTY_RANGE;createClass(Collection,Iterable);function Collection(){throw TypeError('Abstract');}createClass(KeyedCollection,Collection);function KeyedCollection(){}createClass(IndexedCollection,Collection);function IndexedCollection(){}createClass(SetCollection,Collection);function SetCollection(){}Collection.Keyed=KeyedCollection;Collection.Indexed=IndexedCollection;Collection.Set=SetCollection;var imul=typeof Math.imul==='function'&&Math.imul(0xffffffff,2)===-2?Math.imul:function imul(a,b){a=a|0; // int
	b=b|0; // int
	var c=a&0xffff;var d=b&0xffff; // Shift by 0 fixes the sign on the high part.
	return c*d+((a>>>16)*d+c*(b>>>16)<<16>>>0)|0; // int
	}; // v8 has an optimization for storing 31-bit signed numbers.
	// Values which have either 00 or 11 as the high order bits qualify.
	// This function drops the highest order bit in a signed number, maintaining
	// the sign bit.
	function smi(i32){return i32>>>1&0x40000000|i32&0xBFFFFFFF;}function hash(o){if(o===false||o===null||o===undefined){return 0;}if(typeof o.valueOf==='function'){o=o.valueOf();if(o===false||o===null||o===undefined){return 0;}}if(o===true){return 1;}var type=typeof o==='undefined'?'undefined':_typeof(o);if(type==='number'){if(o!==o||o===Infinity){return 0;}var h=o|0;if(h!==o){h^=o*0xFFFFFFFF;}while(o>0xFFFFFFFF){o/=0xFFFFFFFF;h^=o;}return smi(h);}if(type==='string'){return o.length>STRING_HASH_CACHE_MIN_STRLEN?cachedHashString(o):hashString(o);}if(typeof o.hashCode==='function'){return o.hashCode();}if(type==='object'){return hashJSObj(o);}if(typeof o.toString==='function'){return hashString(o.toString());}throw new Error('Value type '+type+' cannot be hashed.');}function cachedHashString(string){var hash=stringHashCache[string];if(hash===undefined){hash=hashString(string);if(STRING_HASH_CACHE_SIZE===STRING_HASH_CACHE_MAX_SIZE){STRING_HASH_CACHE_SIZE=0;stringHashCache={};}STRING_HASH_CACHE_SIZE++;stringHashCache[string]=hash;}return hash;} // http://jsperf.com/hashing-strings
	function hashString(string){ // This is the hash from JVM
	// The hash code for a string is computed as
	// s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
	// where s[i] is the ith character of the string and n is the length of
	// the string. We "mod" the result to make it between 0 (inclusive) and 2^31
	// (exclusive) by dropping high bits.
	var hash=0;for(var ii=0;ii<string.length;ii++){hash=31*hash+string.charCodeAt(ii)|0;}return smi(hash);}function hashJSObj(obj){var hash;if(usingWeakMap){hash=weakMap.get(obj);if(hash!==undefined){return hash;}}hash=obj[UID_HASH_KEY];if(hash!==undefined){return hash;}if(!canDefineProperty){hash=obj.propertyIsEnumerable&&obj.propertyIsEnumerable[UID_HASH_KEY];if(hash!==undefined){return hash;}hash=getIENodeHash(obj);if(hash!==undefined){return hash;}}hash=++objHashUID;if(objHashUID&0x40000000){objHashUID=0;}if(usingWeakMap){weakMap.set(obj,hash);}else if(isExtensible!==undefined&&isExtensible(obj)===false){throw new Error('Non-extensible objects are not allowed as keys.');}else if(canDefineProperty){Object.defineProperty(obj,UID_HASH_KEY,{'enumerable':false,'configurable':false,'writable':false,'value':hash});}else if(obj.propertyIsEnumerable!==undefined&&obj.propertyIsEnumerable===obj.constructor.prototype.propertyIsEnumerable){ // Since we can't define a non-enumerable property on the object
	// we'll hijack one of the less-used non-enumerable properties to
	// save our hash on it. Since this is a function it will not show up in
	// `JSON.stringify` which is what we want.
	obj.propertyIsEnumerable=function(){return this.constructor.prototype.propertyIsEnumerable.apply(this,arguments);};obj.propertyIsEnumerable[UID_HASH_KEY]=hash;}else if(obj.nodeType!==undefined){ // At this point we couldn't get the IE `uniqueID` to use as a hash
	// and we couldn't use a non-enumerable property to exploit the
	// dontEnum bug so we simply add the `UID_HASH_KEY` on the node
	// itself.
	obj[UID_HASH_KEY]=hash;}else {throw new Error('Unable to set a non-enumerable property on object.');}return hash;} // Get references to ES5 object methods.
	var isExtensible=Object.isExtensible; // True if Object.defineProperty works as expected. IE8 fails this test.
	var canDefineProperty=function(){try{Object.defineProperty({},'@',{});return true;}catch(e){return false;}}(); // IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
	// and avoid memory leaks from the IE cloneNode bug.
	function getIENodeHash(node){if(node&&node.nodeType>0){switch(node.nodeType){case 1: // Element
	return node.uniqueID;case 9: // Document
	return node.documentElement&&node.documentElement.uniqueID;}}} // If possible, use a WeakMap.
	var usingWeakMap=typeof WeakMap==='function';var weakMap;if(usingWeakMap){weakMap=new WeakMap();}var objHashUID=0;var UID_HASH_KEY='__immutablehash__';if(typeof Symbol==='function'){UID_HASH_KEY=Symbol(UID_HASH_KEY);}var STRING_HASH_CACHE_MIN_STRLEN=16;var STRING_HASH_CACHE_MAX_SIZE=255;var STRING_HASH_CACHE_SIZE=0;var stringHashCache={};function assertNotInfinite(size){invariant(size!==Infinity,'Cannot perform this action with an infinite size.');}createClass(Map,KeyedCollection); // @pragma Construction
	function Map(value){return value===null||value===undefined?emptyMap():isMap(value)&&!isOrdered(value)?value:emptyMap().withMutations(function(map){var iter=KeyedIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v,k){return map.set(k,v);});});}Map.of=function(){var keyValues=SLICE$0.call(arguments,0);return emptyMap().withMutations(function(map){for(var i=0;i<keyValues.length;i+=2){if(i+1>=keyValues.length){throw new Error('Missing value for key: '+keyValues[i]);}map.set(keyValues[i],keyValues[i+1]);}});};Map.prototype.toString=function(){return this.__toString('Map {','}');}; // @pragma Access
	Map.prototype.get=function(k,notSetValue){return this._root?this._root.get(0,undefined,k,notSetValue):notSetValue;}; // @pragma Modification
	Map.prototype.set=function(k,v){return updateMap(this,k,v);};Map.prototype.setIn=function(keyPath,v){return this.updateIn(keyPath,NOT_SET,function(){return v;});};Map.prototype.remove=function(k){return updateMap(this,k,NOT_SET);};Map.prototype.deleteIn=function(keyPath){return this.updateIn(keyPath,function(){return NOT_SET;});};Map.prototype.update=function(k,notSetValue,updater){return arguments.length===1?k(this):this.updateIn([k],notSetValue,updater);};Map.prototype.updateIn=function(keyPath,notSetValue,updater){if(!updater){updater=notSetValue;notSetValue=undefined;}var updatedValue=updateInDeepMap(this,forceIterator(keyPath),notSetValue,updater);return updatedValue===NOT_SET?undefined:updatedValue;};Map.prototype.clear=function(){if(this.size===0){return this;}if(this.__ownerID){this.size=0;this._root=null;this.__hash=undefined;this.__altered=true;return this;}return emptyMap();}; // @pragma Composition
	Map.prototype.merge=function() /*...iters*/{return mergeIntoMapWith(this,undefined,arguments);};Map.prototype.mergeWith=function(merger){var iters=SLICE$0.call(arguments,1);return mergeIntoMapWith(this,merger,iters);};Map.prototype.mergeIn=function(keyPath){var iters=SLICE$0.call(arguments,1);return this.updateIn(keyPath,emptyMap(),function(m){return typeof m.merge==='function'?m.merge.apply(m,iters):iters[iters.length-1];});};Map.prototype.mergeDeep=function() /*...iters*/{return mergeIntoMapWith(this,deepMerger,arguments);};Map.prototype.mergeDeepWith=function(merger){var iters=SLICE$0.call(arguments,1);return mergeIntoMapWith(this,deepMergerWith(merger),iters);};Map.prototype.mergeDeepIn=function(keyPath){var iters=SLICE$0.call(arguments,1);return this.updateIn(keyPath,emptyMap(),function(m){return typeof m.mergeDeep==='function'?m.mergeDeep.apply(m,iters):iters[iters.length-1];});};Map.prototype.sort=function(comparator){ // Late binding
	return OrderedMap(sortFactory(this,comparator));};Map.prototype.sortBy=function(mapper,comparator){ // Late binding
	return OrderedMap(sortFactory(this,comparator,mapper));}; // @pragma Mutability
	Map.prototype.withMutations=function(fn){var mutable=this.asMutable();fn(mutable);return mutable.wasAltered()?mutable.__ensureOwner(this.__ownerID):this;};Map.prototype.asMutable=function(){return this.__ownerID?this:this.__ensureOwner(new OwnerID());};Map.prototype.asImmutable=function(){return this.__ensureOwner();};Map.prototype.wasAltered=function(){return this.__altered;};Map.prototype.__iterator=function(type,reverse){return new MapIterator(this,type,reverse);};Map.prototype.__iterate=function(fn,reverse){var this$0=this;var iterations=0;this._root&&this._root.iterate(function(entry){iterations++;return fn(entry[1],entry[0],this$0);},reverse);return iterations;};Map.prototype.__ensureOwner=function(ownerID){if(ownerID===this.__ownerID){return this;}if(!ownerID){this.__ownerID=ownerID;this.__altered=false;return this;}return makeMap(this.size,this._root,ownerID,this.__hash);};function isMap(maybeMap){return !!(maybeMap&&maybeMap[IS_MAP_SENTINEL]);}Map.isMap=isMap;var IS_MAP_SENTINEL='@@__IMMUTABLE_MAP__@@';var MapPrototype=Map.prototype;MapPrototype[IS_MAP_SENTINEL]=true;MapPrototype[DELETE]=MapPrototype.remove;MapPrototype.removeIn=MapPrototype.deleteIn; // #pragma Trie Nodes
	function ArrayMapNode(ownerID,entries){this.ownerID=ownerID;this.entries=entries;}ArrayMapNode.prototype.get=function(shift,keyHash,key,notSetValue){var entries=this.entries;for(var ii=0,len=entries.length;ii<len;ii++){if(is(key,entries[ii][0])){return entries[ii][1];}}return notSetValue;};ArrayMapNode.prototype.update=function(ownerID,shift,keyHash,key,value,didChangeSize,didAlter){var removed=value===NOT_SET;var entries=this.entries;var idx=0;for(var len=entries.length;idx<len;idx++){if(is(key,entries[idx][0])){break;}}var exists=idx<len;if(exists?entries[idx][1]===value:removed){return this;}SetRef(didAlter);(removed||!exists)&&SetRef(didChangeSize);if(removed&&entries.length===1){return; // undefined
	}if(!exists&&!removed&&entries.length>=MAX_ARRAY_MAP_SIZE){return createNodes(ownerID,entries,key,value);}var isEditable=ownerID&&ownerID===this.ownerID;var newEntries=isEditable?entries:arrCopy(entries);if(exists){if(removed){idx===len-1?newEntries.pop():newEntries[idx]=newEntries.pop();}else {newEntries[idx]=[key,value];}}else {newEntries.push([key,value]);}if(isEditable){this.entries=newEntries;return this;}return new ArrayMapNode(ownerID,newEntries);};function BitmapIndexedNode(ownerID,bitmap,nodes){this.ownerID=ownerID;this.bitmap=bitmap;this.nodes=nodes;}BitmapIndexedNode.prototype.get=function(shift,keyHash,key,notSetValue){if(keyHash===undefined){keyHash=hash(key);}var bit=1<<((shift===0?keyHash:keyHash>>>shift)&MASK);var bitmap=this.bitmap;return (bitmap&bit)===0?notSetValue:this.nodes[popCount(bitmap&bit-1)].get(shift+SHIFT,keyHash,key,notSetValue);};BitmapIndexedNode.prototype.update=function(ownerID,shift,keyHash,key,value,didChangeSize,didAlter){if(keyHash===undefined){keyHash=hash(key);}var keyHashFrag=(shift===0?keyHash:keyHash>>>shift)&MASK;var bit=1<<keyHashFrag;var bitmap=this.bitmap;var exists=(bitmap&bit)!==0;if(!exists&&value===NOT_SET){return this;}var idx=popCount(bitmap&bit-1);var nodes=this.nodes;var node=exists?nodes[idx]:undefined;var newNode=updateNode(node,ownerID,shift+SHIFT,keyHash,key,value,didChangeSize,didAlter);if(newNode===node){return this;}if(!exists&&newNode&&nodes.length>=MAX_BITMAP_INDEXED_SIZE){return expandNodes(ownerID,nodes,bitmap,keyHashFrag,newNode);}if(exists&&!newNode&&nodes.length===2&&isLeafNode(nodes[idx^1])){return nodes[idx^1];}if(exists&&newNode&&nodes.length===1&&isLeafNode(newNode)){return newNode;}var isEditable=ownerID&&ownerID===this.ownerID;var newBitmap=exists?newNode?bitmap:bitmap^bit:bitmap|bit;var newNodes=exists?newNode?setIn(nodes,idx,newNode,isEditable):spliceOut(nodes,idx,isEditable):spliceIn(nodes,idx,newNode,isEditable);if(isEditable){this.bitmap=newBitmap;this.nodes=newNodes;return this;}return new BitmapIndexedNode(ownerID,newBitmap,newNodes);};function HashArrayMapNode(ownerID,count,nodes){this.ownerID=ownerID;this.count=count;this.nodes=nodes;}HashArrayMapNode.prototype.get=function(shift,keyHash,key,notSetValue){if(keyHash===undefined){keyHash=hash(key);}var idx=(shift===0?keyHash:keyHash>>>shift)&MASK;var node=this.nodes[idx];return node?node.get(shift+SHIFT,keyHash,key,notSetValue):notSetValue;};HashArrayMapNode.prototype.update=function(ownerID,shift,keyHash,key,value,didChangeSize,didAlter){if(keyHash===undefined){keyHash=hash(key);}var idx=(shift===0?keyHash:keyHash>>>shift)&MASK;var removed=value===NOT_SET;var nodes=this.nodes;var node=nodes[idx];if(removed&&!node){return this;}var newNode=updateNode(node,ownerID,shift+SHIFT,keyHash,key,value,didChangeSize,didAlter);if(newNode===node){return this;}var newCount=this.count;if(!node){newCount++;}else if(!newNode){newCount--;if(newCount<MIN_HASH_ARRAY_MAP_SIZE){return packNodes(ownerID,nodes,newCount,idx);}}var isEditable=ownerID&&ownerID===this.ownerID;var newNodes=setIn(nodes,idx,newNode,isEditable);if(isEditable){this.count=newCount;this.nodes=newNodes;return this;}return new HashArrayMapNode(ownerID,newCount,newNodes);};function HashCollisionNode(ownerID,keyHash,entries){this.ownerID=ownerID;this.keyHash=keyHash;this.entries=entries;}HashCollisionNode.prototype.get=function(shift,keyHash,key,notSetValue){var entries=this.entries;for(var ii=0,len=entries.length;ii<len;ii++){if(is(key,entries[ii][0])){return entries[ii][1];}}return notSetValue;};HashCollisionNode.prototype.update=function(ownerID,shift,keyHash,key,value,didChangeSize,didAlter){if(keyHash===undefined){keyHash=hash(key);}var removed=value===NOT_SET;if(keyHash!==this.keyHash){if(removed){return this;}SetRef(didAlter);SetRef(didChangeSize);return mergeIntoNode(this,ownerID,shift,keyHash,[key,value]);}var entries=this.entries;var idx=0;for(var len=entries.length;idx<len;idx++){if(is(key,entries[idx][0])){break;}}var exists=idx<len;if(exists?entries[idx][1]===value:removed){return this;}SetRef(didAlter);(removed||!exists)&&SetRef(didChangeSize);if(removed&&len===2){return new ValueNode(ownerID,this.keyHash,entries[idx^1]);}var isEditable=ownerID&&ownerID===this.ownerID;var newEntries=isEditable?entries:arrCopy(entries);if(exists){if(removed){idx===len-1?newEntries.pop():newEntries[idx]=newEntries.pop();}else {newEntries[idx]=[key,value];}}else {newEntries.push([key,value]);}if(isEditable){this.entries=newEntries;return this;}return new HashCollisionNode(ownerID,this.keyHash,newEntries);};function ValueNode(ownerID,keyHash,entry){this.ownerID=ownerID;this.keyHash=keyHash;this.entry=entry;}ValueNode.prototype.get=function(shift,keyHash,key,notSetValue){return is(key,this.entry[0])?this.entry[1]:notSetValue;};ValueNode.prototype.update=function(ownerID,shift,keyHash,key,value,didChangeSize,didAlter){var removed=value===NOT_SET;var keyMatch=is(key,this.entry[0]);if(keyMatch?value===this.entry[1]:removed){return this;}SetRef(didAlter);if(removed){SetRef(didChangeSize);return; // undefined
	}if(keyMatch){if(ownerID&&ownerID===this.ownerID){this.entry[1]=value;return this;}return new ValueNode(ownerID,this.keyHash,[key,value]);}SetRef(didChangeSize);return mergeIntoNode(this,ownerID,shift,hash(key),[key,value]);}; // #pragma Iterators
	ArrayMapNode.prototype.iterate=HashCollisionNode.prototype.iterate=function(fn,reverse){var entries=this.entries;for(var ii=0,maxIndex=entries.length-1;ii<=maxIndex;ii++){if(fn(entries[reverse?maxIndex-ii:ii])===false){return false;}}};BitmapIndexedNode.prototype.iterate=HashArrayMapNode.prototype.iterate=function(fn,reverse){var nodes=this.nodes;for(var ii=0,maxIndex=nodes.length-1;ii<=maxIndex;ii++){var node=nodes[reverse?maxIndex-ii:ii];if(node&&node.iterate(fn,reverse)===false){return false;}}};ValueNode.prototype.iterate=function(fn,reverse){return fn(this.entry);};createClass(MapIterator,Iterator);function MapIterator(map,type,reverse){this._type=type;this._reverse=reverse;this._stack=map._root&&mapIteratorFrame(map._root);}MapIterator.prototype.next=function(){var type=this._type;var stack=this._stack;while(stack){var node=stack.node;var index=stack.index++;var maxIndex;if(node.entry){if(index===0){return mapIteratorValue(type,node.entry);}}else if(node.entries){maxIndex=node.entries.length-1;if(index<=maxIndex){return mapIteratorValue(type,node.entries[this._reverse?maxIndex-index:index]);}}else {maxIndex=node.nodes.length-1;if(index<=maxIndex){var subNode=node.nodes[this._reverse?maxIndex-index:index];if(subNode){if(subNode.entry){return mapIteratorValue(type,subNode.entry);}stack=this._stack=mapIteratorFrame(subNode,stack);}continue;}}stack=this._stack=this._stack.__prev;}return iteratorDone();};function mapIteratorValue(type,entry){return iteratorValue(type,entry[0],entry[1]);}function mapIteratorFrame(node,prev){return {node:node,index:0,__prev:prev};}function makeMap(size,root,ownerID,hash){var map=Object.create(MapPrototype);map.size=size;map._root=root;map.__ownerID=ownerID;map.__hash=hash;map.__altered=false;return map;}var EMPTY_MAP;function emptyMap(){return EMPTY_MAP||(EMPTY_MAP=makeMap(0));}function updateMap(map,k,v){var newRoot;var newSize;if(!map._root){if(v===NOT_SET){return map;}newSize=1;newRoot=new ArrayMapNode(map.__ownerID,[[k,v]]);}else {var didChangeSize=MakeRef(CHANGE_LENGTH);var didAlter=MakeRef(DID_ALTER);newRoot=updateNode(map._root,map.__ownerID,0,undefined,k,v,didChangeSize,didAlter);if(!didAlter.value){return map;}newSize=map.size+(didChangeSize.value?v===NOT_SET?-1:1:0);}if(map.__ownerID){map.size=newSize;map._root=newRoot;map.__hash=undefined;map.__altered=true;return map;}return newRoot?makeMap(newSize,newRoot):emptyMap();}function updateNode(node,ownerID,shift,keyHash,key,value,didChangeSize,didAlter){if(!node){if(value===NOT_SET){return node;}SetRef(didAlter);SetRef(didChangeSize);return new ValueNode(ownerID,keyHash,[key,value]);}return node.update(ownerID,shift,keyHash,key,value,didChangeSize,didAlter);}function isLeafNode(node){return node.constructor===ValueNode||node.constructor===HashCollisionNode;}function mergeIntoNode(node,ownerID,shift,keyHash,entry){if(node.keyHash===keyHash){return new HashCollisionNode(ownerID,keyHash,[node.entry,entry]);}var idx1=(shift===0?node.keyHash:node.keyHash>>>shift)&MASK;var idx2=(shift===0?keyHash:keyHash>>>shift)&MASK;var newNode;var nodes=idx1===idx2?[mergeIntoNode(node,ownerID,shift+SHIFT,keyHash,entry)]:(newNode=new ValueNode(ownerID,keyHash,entry),idx1<idx2?[node,newNode]:[newNode,node]);return new BitmapIndexedNode(ownerID,1<<idx1|1<<idx2,nodes);}function createNodes(ownerID,entries,key,value){if(!ownerID){ownerID=new OwnerID();}var node=new ValueNode(ownerID,hash(key),[key,value]);for(var ii=0;ii<entries.length;ii++){var entry=entries[ii];node=node.update(ownerID,0,undefined,entry[0],entry[1]);}return node;}function packNodes(ownerID,nodes,count,excluding){var bitmap=0;var packedII=0;var packedNodes=new Array(count);for(var ii=0,bit=1,len=nodes.length;ii<len;ii++,bit<<=1){var node=nodes[ii];if(node!==undefined&&ii!==excluding){bitmap|=bit;packedNodes[packedII++]=node;}}return new BitmapIndexedNode(ownerID,bitmap,packedNodes);}function expandNodes(ownerID,nodes,bitmap,including,node){var count=0;var expandedNodes=new Array(SIZE);for(var ii=0;bitmap!==0;ii++,bitmap>>>=1){expandedNodes[ii]=bitmap&1?nodes[count++]:undefined;}expandedNodes[including]=node;return new HashArrayMapNode(ownerID,count+1,expandedNodes);}function mergeIntoMapWith(map,merger,iterables){var iters=[];for(var ii=0;ii<iterables.length;ii++){var value=iterables[ii];var iter=KeyedIterable(value);if(!isIterable(value)){iter=iter.map(function(v){return fromJS(v);});}iters.push(iter);}return mergeIntoCollectionWith(map,merger,iters);}function deepMerger(existing,value,key){return existing&&existing.mergeDeep&&isIterable(value)?existing.mergeDeep(value):is(existing,value)?existing:value;}function deepMergerWith(merger){return function(existing,value,key){if(existing&&existing.mergeDeepWith&&isIterable(value)){return existing.mergeDeepWith(merger,value);}var nextValue=merger(existing,value,key);return is(existing,nextValue)?existing:nextValue;};}function mergeIntoCollectionWith(collection,merger,iters){iters=iters.filter(function(x){return x.size!==0;});if(iters.length===0){return collection;}if(collection.size===0&&!collection.__ownerID&&iters.length===1){return collection.constructor(iters[0]);}return collection.withMutations(function(collection){var mergeIntoMap=merger?function(value,key){collection.update(key,NOT_SET,function(existing){return existing===NOT_SET?value:merger(existing,value,key);});}:function(value,key){collection.set(key,value);};for(var ii=0;ii<iters.length;ii++){iters[ii].forEach(mergeIntoMap);}});}function updateInDeepMap(existing,keyPathIter,notSetValue,updater){var isNotSet=existing===NOT_SET;var step=keyPathIter.next();if(step.done){var existingValue=isNotSet?notSetValue:existing;var newValue=updater(existingValue);return newValue===existingValue?existing:newValue;}invariant(isNotSet||existing&&existing.set,'invalid keyPath');var key=step.value;var nextExisting=isNotSet?NOT_SET:existing.get(key,NOT_SET);var nextUpdated=updateInDeepMap(nextExisting,keyPathIter,notSetValue,updater);return nextUpdated===nextExisting?existing:nextUpdated===NOT_SET?existing.remove(key):(isNotSet?emptyMap():existing).set(key,nextUpdated);}function popCount(x){x=x-(x>>1&0x55555555);x=(x&0x33333333)+(x>>2&0x33333333);x=x+(x>>4)&0x0f0f0f0f;x=x+(x>>8);x=x+(x>>16);return x&0x7f;}function setIn(array,idx,val,canEdit){var newArray=canEdit?array:arrCopy(array);newArray[idx]=val;return newArray;}function spliceIn(array,idx,val,canEdit){var newLen=array.length+1;if(canEdit&&idx+1===newLen){array[idx]=val;return array;}var newArray=new Array(newLen);var after=0;for(var ii=0;ii<newLen;ii++){if(ii===idx){newArray[ii]=val;after=-1;}else {newArray[ii]=array[ii+after];}}return newArray;}function spliceOut(array,idx,canEdit){var newLen=array.length-1;if(canEdit&&idx===newLen){array.pop();return array;}var newArray=new Array(newLen);var after=0;for(var ii=0;ii<newLen;ii++){if(ii===idx){after=1;}newArray[ii]=array[ii+after];}return newArray;}var MAX_ARRAY_MAP_SIZE=SIZE/4;var MAX_BITMAP_INDEXED_SIZE=SIZE/2;var MIN_HASH_ARRAY_MAP_SIZE=SIZE/4;createClass(List,IndexedCollection); // @pragma Construction
	function List(value){var empty=emptyList();if(value===null||value===undefined){return empty;}if(isList(value)){return value;}var iter=IndexedIterable(value);var size=iter.size;if(size===0){return empty;}assertNotInfinite(size);if(size>0&&size<SIZE){return makeList(0,size,SHIFT,null,new VNode(iter.toArray()));}return empty.withMutations(function(list){list.setSize(size);iter.forEach(function(v,i){return list.set(i,v);});});}List.of=function() /*...values*/{return this(arguments);};List.prototype.toString=function(){return this.__toString('List [',']');}; // @pragma Access
	List.prototype.get=function(index,notSetValue){index=wrapIndex(this,index);if(index>=0&&index<this.size){index+=this._origin;var node=listNodeFor(this,index);return node&&node.array[index&MASK];}return notSetValue;}; // @pragma Modification
	List.prototype.set=function(index,value){return updateList(this,index,value);};List.prototype.remove=function(index){return !this.has(index)?this:index===0?this.shift():index===this.size-1?this.pop():this.splice(index,1);};List.prototype.insert=function(index,value){return this.splice(index,0,value);};List.prototype.clear=function(){if(this.size===0){return this;}if(this.__ownerID){this.size=this._origin=this._capacity=0;this._level=SHIFT;this._root=this._tail=null;this.__hash=undefined;this.__altered=true;return this;}return emptyList();};List.prototype.push=function() /*...values*/{var values=arguments;var oldSize=this.size;return this.withMutations(function(list){setListBounds(list,0,oldSize+values.length);for(var ii=0;ii<values.length;ii++){list.set(oldSize+ii,values[ii]);}});};List.prototype.pop=function(){return setListBounds(this,0,-1);};List.prototype.unshift=function() /*...values*/{var values=arguments;return this.withMutations(function(list){setListBounds(list,-values.length);for(var ii=0;ii<values.length;ii++){list.set(ii,values[ii]);}});};List.prototype.shift=function(){return setListBounds(this,1);}; // @pragma Composition
	List.prototype.merge=function() /*...iters*/{return mergeIntoListWith(this,undefined,arguments);};List.prototype.mergeWith=function(merger){var iters=SLICE$0.call(arguments,1);return mergeIntoListWith(this,merger,iters);};List.prototype.mergeDeep=function() /*...iters*/{return mergeIntoListWith(this,deepMerger,arguments);};List.prototype.mergeDeepWith=function(merger){var iters=SLICE$0.call(arguments,1);return mergeIntoListWith(this,deepMergerWith(merger),iters);};List.prototype.setSize=function(size){return setListBounds(this,0,size);}; // @pragma Iteration
	List.prototype.slice=function(begin,end){var size=this.size;if(wholeSlice(begin,end,size)){return this;}return setListBounds(this,resolveBegin(begin,size),resolveEnd(end,size));};List.prototype.__iterator=function(type,reverse){var index=0;var values=iterateList(this,reverse);return new Iterator(function(){var value=values();return value===DONE?iteratorDone():iteratorValue(type,index++,value);});};List.prototype.__iterate=function(fn,reverse){var index=0;var values=iterateList(this,reverse);var value;while((value=values())!==DONE){if(fn(value,index++,this)===false){break;}}return index;};List.prototype.__ensureOwner=function(ownerID){if(ownerID===this.__ownerID){return this;}if(!ownerID){this.__ownerID=ownerID;return this;}return makeList(this._origin,this._capacity,this._level,this._root,this._tail,ownerID,this.__hash);};function isList(maybeList){return !!(maybeList&&maybeList[IS_LIST_SENTINEL]);}List.isList=isList;var IS_LIST_SENTINEL='@@__IMMUTABLE_LIST__@@';var ListPrototype=List.prototype;ListPrototype[IS_LIST_SENTINEL]=true;ListPrototype[DELETE]=ListPrototype.remove;ListPrototype.setIn=MapPrototype.setIn;ListPrototype.deleteIn=ListPrototype.removeIn=MapPrototype.removeIn;ListPrototype.update=MapPrototype.update;ListPrototype.updateIn=MapPrototype.updateIn;ListPrototype.mergeIn=MapPrototype.mergeIn;ListPrototype.mergeDeepIn=MapPrototype.mergeDeepIn;ListPrototype.withMutations=MapPrototype.withMutations;ListPrototype.asMutable=MapPrototype.asMutable;ListPrototype.asImmutable=MapPrototype.asImmutable;ListPrototype.wasAltered=MapPrototype.wasAltered;function VNode(array,ownerID){this.array=array;this.ownerID=ownerID;} // TODO: seems like these methods are very similar
	VNode.prototype.removeBefore=function(ownerID,level,index){if(index===level?1<<level:0||this.array.length===0){return this;}var originIndex=index>>>level&MASK;if(originIndex>=this.array.length){return new VNode([],ownerID);}var removingFirst=originIndex===0;var newChild;if(level>0){var oldChild=this.array[originIndex];newChild=oldChild&&oldChild.removeBefore(ownerID,level-SHIFT,index);if(newChild===oldChild&&removingFirst){return this;}}if(removingFirst&&!newChild){return this;}var editable=editableVNode(this,ownerID);if(!removingFirst){for(var ii=0;ii<originIndex;ii++){editable.array[ii]=undefined;}}if(newChild){editable.array[originIndex]=newChild;}return editable;};VNode.prototype.removeAfter=function(ownerID,level,index){if(index===(level?1<<level:0)||this.array.length===0){return this;}var sizeIndex=index-1>>>level&MASK;if(sizeIndex>=this.array.length){return this;}var newChild;if(level>0){var oldChild=this.array[sizeIndex];newChild=oldChild&&oldChild.removeAfter(ownerID,level-SHIFT,index);if(newChild===oldChild&&sizeIndex===this.array.length-1){return this;}}var editable=editableVNode(this,ownerID);editable.array.splice(sizeIndex+1);if(newChild){editable.array[sizeIndex]=newChild;}return editable;};var DONE={};function iterateList(list,reverse){var left=list._origin;var right=list._capacity;var tailPos=getTailOffset(right);var tail=list._tail;return iterateNodeOrLeaf(list._root,list._level,0);function iterateNodeOrLeaf(node,level,offset){return level===0?iterateLeaf(node,offset):iterateNode(node,level,offset);}function iterateLeaf(node,offset){var array=offset===tailPos?tail&&tail.array:node&&node.array;var from=offset>left?0:left-offset;var to=right-offset;if(to>SIZE){to=SIZE;}return function(){if(from===to){return DONE;}var idx=reverse?--to:from++;return array&&array[idx];};}function iterateNode(node,level,offset){var values;var array=node&&node.array;var from=offset>left?0:left-offset>>level;var to=(right-offset>>level)+1;if(to>SIZE){to=SIZE;}return function(){do {if(values){var value=values();if(value!==DONE){return value;}values=null;}if(from===to){return DONE;}var idx=reverse?--to:from++;values=iterateNodeOrLeaf(array&&array[idx],level-SHIFT,offset+(idx<<level));}while(true);};}}function makeList(origin,capacity,level,root,tail,ownerID,hash){var list=Object.create(ListPrototype);list.size=capacity-origin;list._origin=origin;list._capacity=capacity;list._level=level;list._root=root;list._tail=tail;list.__ownerID=ownerID;list.__hash=hash;list.__altered=false;return list;}var EMPTY_LIST;function emptyList(){return EMPTY_LIST||(EMPTY_LIST=makeList(0,0,SHIFT));}function updateList(list,index,value){index=wrapIndex(list,index);if(index!==index){return list;}if(index>=list.size||index<0){return list.withMutations(function(list){index<0?setListBounds(list,index).set(0,value):setListBounds(list,0,index+1).set(index,value);});}index+=list._origin;var newTail=list._tail;var newRoot=list._root;var didAlter=MakeRef(DID_ALTER);if(index>=getTailOffset(list._capacity)){newTail=updateVNode(newTail,list.__ownerID,0,index,value,didAlter);}else {newRoot=updateVNode(newRoot,list.__ownerID,list._level,index,value,didAlter);}if(!didAlter.value){return list;}if(list.__ownerID){list._root=newRoot;list._tail=newTail;list.__hash=undefined;list.__altered=true;return list;}return makeList(list._origin,list._capacity,list._level,newRoot,newTail);}function updateVNode(node,ownerID,level,index,value,didAlter){var idx=index>>>level&MASK;var nodeHas=node&&idx<node.array.length;if(!nodeHas&&value===undefined){return node;}var newNode;if(level>0){var lowerNode=node&&node.array[idx];var newLowerNode=updateVNode(lowerNode,ownerID,level-SHIFT,index,value,didAlter);if(newLowerNode===lowerNode){return node;}newNode=editableVNode(node,ownerID);newNode.array[idx]=newLowerNode;return newNode;}if(nodeHas&&node.array[idx]===value){return node;}SetRef(didAlter);newNode=editableVNode(node,ownerID);if(value===undefined&&idx===newNode.array.length-1){newNode.array.pop();}else {newNode.array[idx]=value;}return newNode;}function editableVNode(node,ownerID){if(ownerID&&node&&ownerID===node.ownerID){return node;}return new VNode(node?node.array.slice():[],ownerID);}function listNodeFor(list,rawIndex){if(rawIndex>=getTailOffset(list._capacity)){return list._tail;}if(rawIndex<1<<list._level+SHIFT){var node=list._root;var level=list._level;while(node&&level>0){node=node.array[rawIndex>>>level&MASK];level-=SHIFT;}return node;}}function setListBounds(list,begin,end){ // Sanitize begin & end using this shorthand for ToInt32(argument)
	// http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
	if(begin!==undefined){begin=begin|0;}if(end!==undefined){end=end|0;}var owner=list.__ownerID||new OwnerID();var oldOrigin=list._origin;var oldCapacity=list._capacity;var newOrigin=oldOrigin+begin;var newCapacity=end===undefined?oldCapacity:end<0?oldCapacity+end:oldOrigin+end;if(newOrigin===oldOrigin&&newCapacity===oldCapacity){return list;} // If it's going to end after it starts, it's empty.
	if(newOrigin>=newCapacity){return list.clear();}var newLevel=list._level;var newRoot=list._root; // New origin might need creating a higher root.
	var offsetShift=0;while(newOrigin+offsetShift<0){newRoot=new VNode(newRoot&&newRoot.array.length?[undefined,newRoot]:[],owner);newLevel+=SHIFT;offsetShift+=1<<newLevel;}if(offsetShift){newOrigin+=offsetShift;oldOrigin+=offsetShift;newCapacity+=offsetShift;oldCapacity+=offsetShift;}var oldTailOffset=getTailOffset(oldCapacity);var newTailOffset=getTailOffset(newCapacity); // New size might need creating a higher root.
	while(newTailOffset>=1<<newLevel+SHIFT){newRoot=new VNode(newRoot&&newRoot.array.length?[newRoot]:[],owner);newLevel+=SHIFT;} // Locate or create the new tail.
	var oldTail=list._tail;var newTail=newTailOffset<oldTailOffset?listNodeFor(list,newCapacity-1):newTailOffset>oldTailOffset?new VNode([],owner):oldTail; // Merge Tail into tree.
	if(oldTail&&newTailOffset>oldTailOffset&&newOrigin<oldCapacity&&oldTail.array.length){newRoot=editableVNode(newRoot,owner);var node=newRoot;for(var level=newLevel;level>SHIFT;level-=SHIFT){var idx=oldTailOffset>>>level&MASK;node=node.array[idx]=editableVNode(node.array[idx],owner);}node.array[oldTailOffset>>>SHIFT&MASK]=oldTail;} // If the size has been reduced, there's a chance the tail needs to be trimmed.
	if(newCapacity<oldCapacity){newTail=newTail&&newTail.removeAfter(owner,0,newCapacity);} // If the new origin is within the tail, then we do not need a root.
	if(newOrigin>=newTailOffset){newOrigin-=newTailOffset;newCapacity-=newTailOffset;newLevel=SHIFT;newRoot=null;newTail=newTail&&newTail.removeBefore(owner,0,newOrigin); // Otherwise, if the root has been trimmed, garbage collect.
	}else if(newOrigin>oldOrigin||newTailOffset<oldTailOffset){offsetShift=0; // Identify the new top root node of the subtree of the old root.
	while(newRoot){var beginIndex=newOrigin>>>newLevel&MASK;if(beginIndex!==newTailOffset>>>newLevel&MASK){break;}if(beginIndex){offsetShift+=(1<<newLevel)*beginIndex;}newLevel-=SHIFT;newRoot=newRoot.array[beginIndex];} // Trim the new sides of the new root.
	if(newRoot&&newOrigin>oldOrigin){newRoot=newRoot.removeBefore(owner,newLevel,newOrigin-offsetShift);}if(newRoot&&newTailOffset<oldTailOffset){newRoot=newRoot.removeAfter(owner,newLevel,newTailOffset-offsetShift);}if(offsetShift){newOrigin-=offsetShift;newCapacity-=offsetShift;}}if(list.__ownerID){list.size=newCapacity-newOrigin;list._origin=newOrigin;list._capacity=newCapacity;list._level=newLevel;list._root=newRoot;list._tail=newTail;list.__hash=undefined;list.__altered=true;return list;}return makeList(newOrigin,newCapacity,newLevel,newRoot,newTail);}function mergeIntoListWith(list,merger,iterables){var iters=[];var maxSize=0;for(var ii=0;ii<iterables.length;ii++){var value=iterables[ii];var iter=IndexedIterable(value);if(iter.size>maxSize){maxSize=iter.size;}if(!isIterable(value)){iter=iter.map(function(v){return fromJS(v);});}iters.push(iter);}if(maxSize>list.size){list=list.setSize(maxSize);}return mergeIntoCollectionWith(list,merger,iters);}function getTailOffset(size){return size<SIZE?0:size-1>>>SHIFT<<SHIFT;}createClass(OrderedMap,Map); // @pragma Construction
	function OrderedMap(value){return value===null||value===undefined?emptyOrderedMap():isOrderedMap(value)?value:emptyOrderedMap().withMutations(function(map){var iter=KeyedIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v,k){return map.set(k,v);});});}OrderedMap.of=function() /*...values*/{return this(arguments);};OrderedMap.prototype.toString=function(){return this.__toString('OrderedMap {','}');}; // @pragma Access
	OrderedMap.prototype.get=function(k,notSetValue){var index=this._map.get(k);return index!==undefined?this._list.get(index)[1]:notSetValue;}; // @pragma Modification
	OrderedMap.prototype.clear=function(){if(this.size===0){return this;}if(this.__ownerID){this.size=0;this._map.clear();this._list.clear();return this;}return emptyOrderedMap();};OrderedMap.prototype.set=function(k,v){return updateOrderedMap(this,k,v);};OrderedMap.prototype.remove=function(k){return updateOrderedMap(this,k,NOT_SET);};OrderedMap.prototype.wasAltered=function(){return this._map.wasAltered()||this._list.wasAltered();};OrderedMap.prototype.__iterate=function(fn,reverse){var this$0=this;return this._list.__iterate(function(entry){return entry&&fn(entry[1],entry[0],this$0);},reverse);};OrderedMap.prototype.__iterator=function(type,reverse){return this._list.fromEntrySeq().__iterator(type,reverse);};OrderedMap.prototype.__ensureOwner=function(ownerID){if(ownerID===this.__ownerID){return this;}var newMap=this._map.__ensureOwner(ownerID);var newList=this._list.__ensureOwner(ownerID);if(!ownerID){this.__ownerID=ownerID;this._map=newMap;this._list=newList;return this;}return makeOrderedMap(newMap,newList,ownerID,this.__hash);};function isOrderedMap(maybeOrderedMap){return isMap(maybeOrderedMap)&&isOrdered(maybeOrderedMap);}OrderedMap.isOrderedMap=isOrderedMap;OrderedMap.prototype[IS_ORDERED_SENTINEL]=true;OrderedMap.prototype[DELETE]=OrderedMap.prototype.remove;function makeOrderedMap(map,list,ownerID,hash){var omap=Object.create(OrderedMap.prototype);omap.size=map?map.size:0;omap._map=map;omap._list=list;omap.__ownerID=ownerID;omap.__hash=hash;return omap;}var EMPTY_ORDERED_MAP;function emptyOrderedMap(){return EMPTY_ORDERED_MAP||(EMPTY_ORDERED_MAP=makeOrderedMap(emptyMap(),emptyList()));}function updateOrderedMap(omap,k,v){var map=omap._map;var list=omap._list;var i=map.get(k);var has=i!==undefined;var newMap;var newList;if(v===NOT_SET){ // removed
	if(!has){return omap;}if(list.size>=SIZE&&list.size>=map.size*2){newList=list.filter(function(entry,idx){return entry!==undefined&&i!==idx;});newMap=newList.toKeyedSeq().map(function(entry){return entry[0];}).flip().toMap();if(omap.__ownerID){newMap.__ownerID=newList.__ownerID=omap.__ownerID;}}else {newMap=map.remove(k);newList=i===list.size-1?list.pop():list.set(i,undefined);}}else {if(has){if(v===list.get(i)[1]){return omap;}newMap=map;newList=list.set(i,[k,v]);}else {newMap=map.set(k,list.size);newList=list.set(list.size,[k,v]);}}if(omap.__ownerID){omap.size=newMap.size;omap._map=newMap;omap._list=newList;omap.__hash=undefined;return omap;}return makeOrderedMap(newMap,newList);}createClass(ToKeyedSequence,KeyedSeq);function ToKeyedSequence(indexed,useKeys){this._iter=indexed;this._useKeys=useKeys;this.size=indexed.size;}ToKeyedSequence.prototype.get=function(key,notSetValue){return this._iter.get(key,notSetValue);};ToKeyedSequence.prototype.has=function(key){return this._iter.has(key);};ToKeyedSequence.prototype.valueSeq=function(){return this._iter.valueSeq();};ToKeyedSequence.prototype.reverse=function(){var this$0=this;var reversedSequence=reverseFactory(this,true);if(!this._useKeys){reversedSequence.valueSeq=function(){return this$0._iter.toSeq().reverse();};}return reversedSequence;};ToKeyedSequence.prototype.map=function(mapper,context){var this$0=this;var mappedSequence=mapFactory(this,mapper,context);if(!this._useKeys){mappedSequence.valueSeq=function(){return this$0._iter.toSeq().map(mapper,context);};}return mappedSequence;};ToKeyedSequence.prototype.__iterate=function(fn,reverse){var this$0=this;var ii;return this._iter.__iterate(this._useKeys?function(v,k){return fn(v,k,this$0);}:(ii=reverse?resolveSize(this):0,function(v){return fn(v,reverse?--ii:ii++,this$0);}),reverse);};ToKeyedSequence.prototype.__iterator=function(type,reverse){if(this._useKeys){return this._iter.__iterator(type,reverse);}var iterator=this._iter.__iterator(ITERATE_VALUES,reverse);var ii=reverse?resolveSize(this):0;return new Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type,reverse?--ii:ii++,step.value,step);});};ToKeyedSequence.prototype[IS_ORDERED_SENTINEL]=true;createClass(ToIndexedSequence,IndexedSeq);function ToIndexedSequence(iter){this._iter=iter;this.size=iter.size;}ToIndexedSequence.prototype.includes=function(value){return this._iter.includes(value);};ToIndexedSequence.prototype.__iterate=function(fn,reverse){var this$0=this;var iterations=0;return this._iter.__iterate(function(v){return fn(v,iterations++,this$0);},reverse);};ToIndexedSequence.prototype.__iterator=function(type,reverse){var iterator=this._iter.__iterator(ITERATE_VALUES,reverse);var iterations=0;return new Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type,iterations++,step.value,step);});};createClass(ToSetSequence,SetSeq);function ToSetSequence(iter){this._iter=iter;this.size=iter.size;}ToSetSequence.prototype.has=function(key){return this._iter.includes(key);};ToSetSequence.prototype.__iterate=function(fn,reverse){var this$0=this;return this._iter.__iterate(function(v){return fn(v,v,this$0);},reverse);};ToSetSequence.prototype.__iterator=function(type,reverse){var iterator=this._iter.__iterator(ITERATE_VALUES,reverse);return new Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type,step.value,step.value,step);});};createClass(FromEntriesSequence,KeyedSeq);function FromEntriesSequence(entries){this._iter=entries;this.size=entries.size;}FromEntriesSequence.prototype.entrySeq=function(){return this._iter.toSeq();};FromEntriesSequence.prototype.__iterate=function(fn,reverse){var this$0=this;return this._iter.__iterate(function(entry){ // Check if entry exists first so array access doesn't throw for holes
	// in the parent iteration.
	if(entry){validateEntry(entry);var indexedIterable=isIterable(entry);return fn(indexedIterable?entry.get(1):entry[1],indexedIterable?entry.get(0):entry[0],this$0);}},reverse);};FromEntriesSequence.prototype.__iterator=function(type,reverse){var iterator=this._iter.__iterator(ITERATE_VALUES,reverse);return new Iterator(function(){while(true){var step=iterator.next();if(step.done){return step;}var entry=step.value; // Check if entry exists first so array access doesn't throw for holes
	// in the parent iteration.
	if(entry){validateEntry(entry);var indexedIterable=isIterable(entry);return iteratorValue(type,indexedIterable?entry.get(0):entry[0],indexedIterable?entry.get(1):entry[1],step);}}});};ToIndexedSequence.prototype.cacheResult=ToKeyedSequence.prototype.cacheResult=ToSetSequence.prototype.cacheResult=FromEntriesSequence.prototype.cacheResult=cacheResultThrough;function flipFactory(iterable){var flipSequence=makeSequence(iterable);flipSequence._iter=iterable;flipSequence.size=iterable.size;flipSequence.flip=function(){return iterable;};flipSequence.reverse=function(){var reversedSequence=iterable.reverse.apply(this); // super.reverse()
	reversedSequence.flip=function(){return iterable.reverse();};return reversedSequence;};flipSequence.has=function(key){return iterable.includes(key);};flipSequence.includes=function(key){return iterable.has(key);};flipSequence.cacheResult=cacheResultThrough;flipSequence.__iterateUncached=function(fn,reverse){var this$0=this;return iterable.__iterate(function(v,k){return fn(k,v,this$0)!==false;},reverse);};flipSequence.__iteratorUncached=function(type,reverse){if(type===ITERATE_ENTRIES){var iterator=iterable.__iterator(type,reverse);return new Iterator(function(){var step=iterator.next();if(!step.done){var k=step.value[0];step.value[0]=step.value[1];step.value[1]=k;}return step;});}return iterable.__iterator(type===ITERATE_VALUES?ITERATE_KEYS:ITERATE_VALUES,reverse);};return flipSequence;}function mapFactory(iterable,mapper,context){var mappedSequence=makeSequence(iterable);mappedSequence.size=iterable.size;mappedSequence.has=function(key){return iterable.has(key);};mappedSequence.get=function(key,notSetValue){var v=iterable.get(key,NOT_SET);return v===NOT_SET?notSetValue:mapper.call(context,v,key,iterable);};mappedSequence.__iterateUncached=function(fn,reverse){var this$0=this;return iterable.__iterate(function(v,k,c){return fn(mapper.call(context,v,k,c),k,this$0)!==false;},reverse);};mappedSequence.__iteratorUncached=function(type,reverse){var iterator=iterable.__iterator(ITERATE_ENTRIES,reverse);return new Iterator(function(){var step=iterator.next();if(step.done){return step;}var entry=step.value;var key=entry[0];return iteratorValue(type,key,mapper.call(context,entry[1],key,iterable),step);});};return mappedSequence;}function reverseFactory(iterable,useKeys){var reversedSequence=makeSequence(iterable);reversedSequence._iter=iterable;reversedSequence.size=iterable.size;reversedSequence.reverse=function(){return iterable;};if(iterable.flip){reversedSequence.flip=function(){var flipSequence=flipFactory(iterable);flipSequence.reverse=function(){return iterable.flip();};return flipSequence;};}reversedSequence.get=function(key,notSetValue){return iterable.get(useKeys?key:-1-key,notSetValue);};reversedSequence.has=function(key){return iterable.has(useKeys?key:-1-key);};reversedSequence.includes=function(value){return iterable.includes(value);};reversedSequence.cacheResult=cacheResultThrough;reversedSequence.__iterate=function(fn,reverse){var this$0=this;return iterable.__iterate(function(v,k){return fn(v,k,this$0);},!reverse);};reversedSequence.__iterator=function(type,reverse){return iterable.__iterator(type,!reverse);};return reversedSequence;}function filterFactory(iterable,predicate,context,useKeys){var filterSequence=makeSequence(iterable);if(useKeys){filterSequence.has=function(key){var v=iterable.get(key,NOT_SET);return v!==NOT_SET&&!!predicate.call(context,v,key,iterable);};filterSequence.get=function(key,notSetValue){var v=iterable.get(key,NOT_SET);return v!==NOT_SET&&predicate.call(context,v,key,iterable)?v:notSetValue;};}filterSequence.__iterateUncached=function(fn,reverse){var this$0=this;var iterations=0;iterable.__iterate(function(v,k,c){if(predicate.call(context,v,k,c)){iterations++;return fn(v,useKeys?k:iterations-1,this$0);}},reverse);return iterations;};filterSequence.__iteratorUncached=function(type,reverse){var iterator=iterable.__iterator(ITERATE_ENTRIES,reverse);var iterations=0;return new Iterator(function(){while(true){var step=iterator.next();if(step.done){return step;}var entry=step.value;var key=entry[0];var value=entry[1];if(predicate.call(context,value,key,iterable)){return iteratorValue(type,useKeys?key:iterations++,value,step);}}});};return filterSequence;}function countByFactory(iterable,grouper,context){var groups=Map().asMutable();iterable.__iterate(function(v,k){groups.update(grouper.call(context,v,k,iterable),0,function(a){return a+1;});});return groups.asImmutable();}function groupByFactory(iterable,grouper,context){var isKeyedIter=isKeyed(iterable);var groups=(isOrdered(iterable)?OrderedMap():Map()).asMutable();iterable.__iterate(function(v,k){groups.update(grouper.call(context,v,k,iterable),function(a){return a=a||[],a.push(isKeyedIter?[k,v]:v),a;});});var coerce=iterableClass(iterable);return groups.map(function(arr){return reify(iterable,coerce(arr));});}function sliceFactory(iterable,begin,end,useKeys){var originalSize=iterable.size; // Sanitize begin & end using this shorthand for ToInt32(argument)
	// http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
	if(begin!==undefined){begin=begin|0;}if(end!==undefined){if(end===Infinity){end=originalSize;}else {end=end|0;}}if(wholeSlice(begin,end,originalSize)){return iterable;}var resolvedBegin=resolveBegin(begin,originalSize);var resolvedEnd=resolveEnd(end,originalSize); // begin or end will be NaN if they were provided as negative numbers and
	// this iterable's size is unknown. In that case, cache first so there is
	// a known size and these do not resolve to NaN.
	if(resolvedBegin!==resolvedBegin||resolvedEnd!==resolvedEnd){return sliceFactory(iterable.toSeq().cacheResult(),begin,end,useKeys);} // Note: resolvedEnd is undefined when the original sequence's length is
	// unknown and this slice did not supply an end and should contain all
	// elements after resolvedBegin.
	// In that case, resolvedSize will be NaN and sliceSize will remain undefined.
	var resolvedSize=resolvedEnd-resolvedBegin;var sliceSize;if(resolvedSize===resolvedSize){sliceSize=resolvedSize<0?0:resolvedSize;}var sliceSeq=makeSequence(iterable); // If iterable.size is undefined, the size of the realized sliceSeq is
	// unknown at this point unless the number of items to slice is 0
	sliceSeq.size=sliceSize===0?sliceSize:iterable.size&&sliceSize||undefined;if(!useKeys&&isSeq(iterable)&&sliceSize>=0){sliceSeq.get=function(index,notSetValue){index=wrapIndex(this,index);return index>=0&&index<sliceSize?iterable.get(index+resolvedBegin,notSetValue):notSetValue;};}sliceSeq.__iterateUncached=function(fn,reverse){var this$0=this;if(sliceSize===0){return 0;}if(reverse){return this.cacheResult().__iterate(fn,reverse);}var skipped=0;var isSkipping=true;var iterations=0;iterable.__iterate(function(v,k){if(!(isSkipping&&(isSkipping=skipped++<resolvedBegin))){iterations++;return fn(v,useKeys?k:iterations-1,this$0)!==false&&iterations!==sliceSize;}});return iterations;};sliceSeq.__iteratorUncached=function(type,reverse){if(sliceSize!==0&&reverse){return this.cacheResult().__iterator(type,reverse);} // Don't bother instantiating parent iterator if taking 0.
	var iterator=sliceSize!==0&&iterable.__iterator(type,reverse);var skipped=0;var iterations=0;return new Iterator(function(){while(skipped++<resolvedBegin){iterator.next();}if(++iterations>sliceSize){return iteratorDone();}var step=iterator.next();if(useKeys||type===ITERATE_VALUES){return step;}else if(type===ITERATE_KEYS){return iteratorValue(type,iterations-1,undefined,step);}else {return iteratorValue(type,iterations-1,step.value[1],step);}});};return sliceSeq;}function takeWhileFactory(iterable,predicate,context){var takeSequence=makeSequence(iterable);takeSequence.__iterateUncached=function(fn,reverse){var this$0=this;if(reverse){return this.cacheResult().__iterate(fn,reverse);}var iterations=0;iterable.__iterate(function(v,k,c){return predicate.call(context,v,k,c)&&++iterations&&fn(v,k,this$0);});return iterations;};takeSequence.__iteratorUncached=function(type,reverse){var this$0=this;if(reverse){return this.cacheResult().__iterator(type,reverse);}var iterator=iterable.__iterator(ITERATE_ENTRIES,reverse);var iterating=true;return new Iterator(function(){if(!iterating){return iteratorDone();}var step=iterator.next();if(step.done){return step;}var entry=step.value;var k=entry[0];var v=entry[1];if(!predicate.call(context,v,k,this$0)){iterating=false;return iteratorDone();}return type===ITERATE_ENTRIES?step:iteratorValue(type,k,v,step);});};return takeSequence;}function skipWhileFactory(iterable,predicate,context,useKeys){var skipSequence=makeSequence(iterable);skipSequence.__iterateUncached=function(fn,reverse){var this$0=this;if(reverse){return this.cacheResult().__iterate(fn,reverse);}var isSkipping=true;var iterations=0;iterable.__iterate(function(v,k,c){if(!(isSkipping&&(isSkipping=predicate.call(context,v,k,c)))){iterations++;return fn(v,useKeys?k:iterations-1,this$0);}});return iterations;};skipSequence.__iteratorUncached=function(type,reverse){var this$0=this;if(reverse){return this.cacheResult().__iterator(type,reverse);}var iterator=iterable.__iterator(ITERATE_ENTRIES,reverse);var skipping=true;var iterations=0;return new Iterator(function(){var step,k,v;do {step=iterator.next();if(step.done){if(useKeys||type===ITERATE_VALUES){return step;}else if(type===ITERATE_KEYS){return iteratorValue(type,iterations++,undefined,step);}else {return iteratorValue(type,iterations++,step.value[1],step);}}var entry=step.value;k=entry[0];v=entry[1];skipping&&(skipping=predicate.call(context,v,k,this$0));}while(skipping);return type===ITERATE_ENTRIES?step:iteratorValue(type,k,v,step);});};return skipSequence;}function concatFactory(iterable,values){var isKeyedIterable=isKeyed(iterable);var iters=[iterable].concat(values).map(function(v){if(!isIterable(v)){v=isKeyedIterable?keyedSeqFromValue(v):indexedSeqFromValue(Array.isArray(v)?v:[v]);}else if(isKeyedIterable){v=KeyedIterable(v);}return v;}).filter(function(v){return v.size!==0;});if(iters.length===0){return iterable;}if(iters.length===1){var singleton=iters[0];if(singleton===iterable||isKeyedIterable&&isKeyed(singleton)||isIndexed(iterable)&&isIndexed(singleton)){return singleton;}}var concatSeq=new ArraySeq(iters);if(isKeyedIterable){concatSeq=concatSeq.toKeyedSeq();}else if(!isIndexed(iterable)){concatSeq=concatSeq.toSetSeq();}concatSeq=concatSeq.flatten(true);concatSeq.size=iters.reduce(function(sum,seq){if(sum!==undefined){var size=seq.size;if(size!==undefined){return sum+size;}}},0);return concatSeq;}function flattenFactory(iterable,depth,useKeys){var flatSequence=makeSequence(iterable);flatSequence.__iterateUncached=function(fn,reverse){var iterations=0;var stopped=false;function flatDeep(iter,currentDepth){var this$0=this;iter.__iterate(function(v,k){if((!depth||currentDepth<depth)&&isIterable(v)){flatDeep(v,currentDepth+1);}else if(fn(v,useKeys?k:iterations++,this$0)===false){stopped=true;}return !stopped;},reverse);}flatDeep(iterable,0);return iterations;};flatSequence.__iteratorUncached=function(type,reverse){var iterator=iterable.__iterator(type,reverse);var stack=[];var iterations=0;return new Iterator(function(){while(iterator){var step=iterator.next();if(step.done!==false){iterator=stack.pop();continue;}var v=step.value;if(type===ITERATE_ENTRIES){v=v[1];}if((!depth||stack.length<depth)&&isIterable(v)){stack.push(iterator);iterator=v.__iterator(type,reverse);}else {return useKeys?step:iteratorValue(type,iterations++,v,step);}}return iteratorDone();});};return flatSequence;}function flatMapFactory(iterable,mapper,context){var coerce=iterableClass(iterable);return iterable.toSeq().map(function(v,k){return coerce(mapper.call(context,v,k,iterable));}).flatten(true);}function interposeFactory(iterable,separator){var interposedSequence=makeSequence(iterable);interposedSequence.size=iterable.size&&iterable.size*2-1;interposedSequence.__iterateUncached=function(fn,reverse){var this$0=this;var iterations=0;iterable.__iterate(function(v,k){return (!iterations||fn(separator,iterations++,this$0)!==false)&&fn(v,iterations++,this$0)!==false;},reverse);return iterations;};interposedSequence.__iteratorUncached=function(type,reverse){var iterator=iterable.__iterator(ITERATE_VALUES,reverse);var iterations=0;var step;return new Iterator(function(){if(!step||iterations%2){step=iterator.next();if(step.done){return step;}}return iterations%2?iteratorValue(type,iterations++,separator):iteratorValue(type,iterations++,step.value,step);});};return interposedSequence;}function sortFactory(iterable,comparator,mapper){if(!comparator){comparator=defaultComparator;}var isKeyedIterable=isKeyed(iterable);var index=0;var entries=iterable.toSeq().map(function(v,k){return [k,v,index++,mapper?mapper(v,k,iterable):v];}).toArray();entries.sort(function(a,b){return comparator(a[3],b[3])||a[2]-b[2];}).forEach(isKeyedIterable?function(v,i){entries[i].length=2;}:function(v,i){entries[i]=v[1];});return isKeyedIterable?KeyedSeq(entries):isIndexed(iterable)?IndexedSeq(entries):SetSeq(entries);}function maxFactory(iterable,comparator,mapper){if(!comparator){comparator=defaultComparator;}if(mapper){var entry=iterable.toSeq().map(function(v,k){return [v,mapper(v,k,iterable)];}).reduce(function(a,b){return maxCompare(comparator,a[1],b[1])?b:a;});return entry&&entry[0];}else {return iterable.reduce(function(a,b){return maxCompare(comparator,a,b)?b:a;});}}function maxCompare(comparator,a,b){var comp=comparator(b,a); // b is considered the new max if the comparator declares them equal, but
	// they are not equal and b is in fact a nullish value.
	return comp===0&&b!==a&&(b===undefined||b===null||b!==b)||comp>0;}function zipWithFactory(keyIter,zipper,iters){var zipSequence=makeSequence(keyIter);zipSequence.size=new ArraySeq(iters).map(function(i){return i.size;}).min(); // Note: this a generic base implementation of __iterate in terms of
	// __iterator which may be more generically useful in the future.
	zipSequence.__iterate=function(fn,reverse){ /* generic:
	      var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
	      var step;
	      var iterations = 0;
	      while (!(step = iterator.next()).done) {
	        iterations++;
	        if (fn(step.value[1], step.value[0], this) === false) {
	          break;
	        }
	      }
	      return iterations;
	      */ // indexed:
	var iterator=this.__iterator(ITERATE_VALUES,reverse);var step;var iterations=0;while(!(step=iterator.next()).done){if(fn(step.value,iterations++,this)===false){break;}}return iterations;};zipSequence.__iteratorUncached=function(type,reverse){var iterators=iters.map(function(i){return i=Iterable(i),getIterator(reverse?i.reverse():i);});var iterations=0;var isDone=false;return new Iterator(function(){var steps;if(!isDone){steps=iterators.map(function(i){return i.next();});isDone=steps.some(function(s){return s.done;});}if(isDone){return iteratorDone();}return iteratorValue(type,iterations++,zipper.apply(null,steps.map(function(s){return s.value;})));});};return zipSequence;} // #pragma Helper Functions
	function reify(iter,seq){return isSeq(iter)?seq:iter.constructor(seq);}function validateEntry(entry){if(entry!==Object(entry)){throw new TypeError('Expected [K, V] tuple: '+entry);}}function resolveSize(iter){assertNotInfinite(iter.size);return ensureSize(iter);}function iterableClass(iterable){return isKeyed(iterable)?KeyedIterable:isIndexed(iterable)?IndexedIterable:SetIterable;}function makeSequence(iterable){return Object.create((isKeyed(iterable)?KeyedSeq:isIndexed(iterable)?IndexedSeq:SetSeq).prototype);}function cacheResultThrough(){if(this._iter.cacheResult){this._iter.cacheResult();this.size=this._iter.size;return this;}else {return Seq.prototype.cacheResult.call(this);}}function defaultComparator(a,b){return a>b?1:a<b?-1:0;}function forceIterator(keyPath){var iter=getIterator(keyPath);if(!iter){ // Array might not be iterable in this environment, so we need a fallback
	// to our wrapped type.
	if(!isArrayLike(keyPath)){throw new TypeError('Expected iterable or array-like: '+keyPath);}iter=getIterator(Iterable(keyPath));}return iter;}createClass(Record,KeyedCollection);function Record(defaultValues,name){var hasInitialized;var RecordType=function Record(values){if(values instanceof RecordType){return values;}if(!(this instanceof RecordType)){return new RecordType(values);}if(!hasInitialized){hasInitialized=true;var keys=Object.keys(defaultValues);setProps(RecordTypePrototype,keys);RecordTypePrototype.size=keys.length;RecordTypePrototype._name=name;RecordTypePrototype._keys=keys;RecordTypePrototype._defaultValues=defaultValues;}this._map=Map(values);};var RecordTypePrototype=RecordType.prototype=Object.create(RecordPrototype);RecordTypePrototype.constructor=RecordType;return RecordType;}Record.prototype.toString=function(){return this.__toString(recordName(this)+' {','}');}; // @pragma Access
	Record.prototype.has=function(k){return this._defaultValues.hasOwnProperty(k);};Record.prototype.get=function(k,notSetValue){if(!this.has(k)){return notSetValue;}var defaultVal=this._defaultValues[k];return this._map?this._map.get(k,defaultVal):defaultVal;}; // @pragma Modification
	Record.prototype.clear=function(){if(this.__ownerID){this._map&&this._map.clear();return this;}var RecordType=this.constructor;return RecordType._empty||(RecordType._empty=makeRecord(this,emptyMap()));};Record.prototype.set=function(k,v){if(!this.has(k)){throw new Error('Cannot set unknown key "'+k+'" on '+recordName(this));}if(this._map&&!this._map.has(k)){var defaultVal=this._defaultValues[k];if(v===defaultVal){return this;}}var newMap=this._map&&this._map.set(k,v);if(this.__ownerID||newMap===this._map){return this;}return makeRecord(this,newMap);};Record.prototype.remove=function(k){if(!this.has(k)){return this;}var newMap=this._map&&this._map.remove(k);if(this.__ownerID||newMap===this._map){return this;}return makeRecord(this,newMap);};Record.prototype.wasAltered=function(){return this._map.wasAltered();};Record.prototype.__iterator=function(type,reverse){var this$0=this;return KeyedIterable(this._defaultValues).map(function(_,k){return this$0.get(k);}).__iterator(type,reverse);};Record.prototype.__iterate=function(fn,reverse){var this$0=this;return KeyedIterable(this._defaultValues).map(function(_,k){return this$0.get(k);}).__iterate(fn,reverse);};Record.prototype.__ensureOwner=function(ownerID){if(ownerID===this.__ownerID){return this;}var newMap=this._map&&this._map.__ensureOwner(ownerID);if(!ownerID){this.__ownerID=ownerID;this._map=newMap;return this;}return makeRecord(this,newMap,ownerID);};var RecordPrototype=Record.prototype;RecordPrototype[DELETE]=RecordPrototype.remove;RecordPrototype.deleteIn=RecordPrototype.removeIn=MapPrototype.removeIn;RecordPrototype.merge=MapPrototype.merge;RecordPrototype.mergeWith=MapPrototype.mergeWith;RecordPrototype.mergeIn=MapPrototype.mergeIn;RecordPrototype.mergeDeep=MapPrototype.mergeDeep;RecordPrototype.mergeDeepWith=MapPrototype.mergeDeepWith;RecordPrototype.mergeDeepIn=MapPrototype.mergeDeepIn;RecordPrototype.setIn=MapPrototype.setIn;RecordPrototype.update=MapPrototype.update;RecordPrototype.updateIn=MapPrototype.updateIn;RecordPrototype.withMutations=MapPrototype.withMutations;RecordPrototype.asMutable=MapPrototype.asMutable;RecordPrototype.asImmutable=MapPrototype.asImmutable;function makeRecord(likeRecord,map,ownerID){var record=Object.create(Object.getPrototypeOf(likeRecord));record._map=map;record.__ownerID=ownerID;return record;}function recordName(record){return record._name||record.constructor.name||'Record';}function setProps(prototype,names){try{names.forEach(setProp.bind(undefined,prototype));}catch(error){ // Object.defineProperty failed. Probably IE8.
	}}function setProp(prototype,name){Object.defineProperty(prototype,name,{get:function get(){return this.get(name);},set:function set(value){invariant(this.__ownerID,'Cannot set on an immutable record.');this.set(name,value);}});}createClass(Set,SetCollection); // @pragma Construction
	function Set(value){return value===null||value===undefined?emptySet():isSet(value)&&!isOrdered(value)?value:emptySet().withMutations(function(set){var iter=SetIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v){return set.add(v);});});}Set.of=function() /*...values*/{return this(arguments);};Set.fromKeys=function(value){return this(KeyedIterable(value).keySeq());};Set.prototype.toString=function(){return this.__toString('Set {','}');}; // @pragma Access
	Set.prototype.has=function(value){return this._map.has(value);}; // @pragma Modification
	Set.prototype.add=function(value){return updateSet(this,this._map.set(value,true));};Set.prototype.remove=function(value){return updateSet(this,this._map.remove(value));};Set.prototype.clear=function(){return updateSet(this,this._map.clear());}; // @pragma Composition
	Set.prototype.union=function(){var iters=SLICE$0.call(arguments,0);iters=iters.filter(function(x){return x.size!==0;});if(iters.length===0){return this;}if(this.size===0&&!this.__ownerID&&iters.length===1){return this.constructor(iters[0]);}return this.withMutations(function(set){for(var ii=0;ii<iters.length;ii++){SetIterable(iters[ii]).forEach(function(value){return set.add(value);});}});};Set.prototype.intersect=function(){var iters=SLICE$0.call(arguments,0);if(iters.length===0){return this;}iters=iters.map(function(iter){return SetIterable(iter);});var originalSet=this;return this.withMutations(function(set){originalSet.forEach(function(value){if(!iters.every(function(iter){return iter.includes(value);})){set.remove(value);}});});};Set.prototype.subtract=function(){var iters=SLICE$0.call(arguments,0);if(iters.length===0){return this;}iters=iters.map(function(iter){return SetIterable(iter);});var originalSet=this;return this.withMutations(function(set){originalSet.forEach(function(value){if(iters.some(function(iter){return iter.includes(value);})){set.remove(value);}});});};Set.prototype.merge=function(){return this.union.apply(this,arguments);};Set.prototype.mergeWith=function(merger){var iters=SLICE$0.call(arguments,1);return this.union.apply(this,iters);};Set.prototype.sort=function(comparator){ // Late binding
	return OrderedSet(sortFactory(this,comparator));};Set.prototype.sortBy=function(mapper,comparator){ // Late binding
	return OrderedSet(sortFactory(this,comparator,mapper));};Set.prototype.wasAltered=function(){return this._map.wasAltered();};Set.prototype.__iterate=function(fn,reverse){var this$0=this;return this._map.__iterate(function(_,k){return fn(k,k,this$0);},reverse);};Set.prototype.__iterator=function(type,reverse){return this._map.map(function(_,k){return k;}).__iterator(type,reverse);};Set.prototype.__ensureOwner=function(ownerID){if(ownerID===this.__ownerID){return this;}var newMap=this._map.__ensureOwner(ownerID);if(!ownerID){this.__ownerID=ownerID;this._map=newMap;return this;}return this.__make(newMap,ownerID);};function isSet(maybeSet){return !!(maybeSet&&maybeSet[IS_SET_SENTINEL]);}Set.isSet=isSet;var IS_SET_SENTINEL='@@__IMMUTABLE_SET__@@';var SetPrototype=Set.prototype;SetPrototype[IS_SET_SENTINEL]=true;SetPrototype[DELETE]=SetPrototype.remove;SetPrototype.mergeDeep=SetPrototype.merge;SetPrototype.mergeDeepWith=SetPrototype.mergeWith;SetPrototype.withMutations=MapPrototype.withMutations;SetPrototype.asMutable=MapPrototype.asMutable;SetPrototype.asImmutable=MapPrototype.asImmutable;SetPrototype.__empty=emptySet;SetPrototype.__make=makeSet;function updateSet(set,newMap){if(set.__ownerID){set.size=newMap.size;set._map=newMap;return set;}return newMap===set._map?set:newMap.size===0?set.__empty():set.__make(newMap);}function makeSet(map,ownerID){var set=Object.create(SetPrototype);set.size=map?map.size:0;set._map=map;set.__ownerID=ownerID;return set;}var EMPTY_SET;function emptySet(){return EMPTY_SET||(EMPTY_SET=makeSet(emptyMap()));}createClass(OrderedSet,Set); // @pragma Construction
	function OrderedSet(value){return value===null||value===undefined?emptyOrderedSet():isOrderedSet(value)?value:emptyOrderedSet().withMutations(function(set){var iter=SetIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v){return set.add(v);});});}OrderedSet.of=function() /*...values*/{return this(arguments);};OrderedSet.fromKeys=function(value){return this(KeyedIterable(value).keySeq());};OrderedSet.prototype.toString=function(){return this.__toString('OrderedSet {','}');};function isOrderedSet(maybeOrderedSet){return isSet(maybeOrderedSet)&&isOrdered(maybeOrderedSet);}OrderedSet.isOrderedSet=isOrderedSet;var OrderedSetPrototype=OrderedSet.prototype;OrderedSetPrototype[IS_ORDERED_SENTINEL]=true;OrderedSetPrototype.__empty=emptyOrderedSet;OrderedSetPrototype.__make=makeOrderedSet;function makeOrderedSet(map,ownerID){var set=Object.create(OrderedSetPrototype);set.size=map?map.size:0;set._map=map;set.__ownerID=ownerID;return set;}var EMPTY_ORDERED_SET;function emptyOrderedSet(){return EMPTY_ORDERED_SET||(EMPTY_ORDERED_SET=makeOrderedSet(emptyOrderedMap()));}createClass(Stack,IndexedCollection); // @pragma Construction
	function Stack(value){return value===null||value===undefined?emptyStack():isStack(value)?value:emptyStack().unshiftAll(value);}Stack.of=function() /*...values*/{return this(arguments);};Stack.prototype.toString=function(){return this.__toString('Stack [',']');}; // @pragma Access
	Stack.prototype.get=function(index,notSetValue){var head=this._head;index=wrapIndex(this,index);while(head&&index--){head=head.next;}return head?head.value:notSetValue;};Stack.prototype.peek=function(){return this._head&&this._head.value;}; // @pragma Modification
	Stack.prototype.push=function() /*...values*/{if(arguments.length===0){return this;}var newSize=this.size+arguments.length;var head=this._head;for(var ii=arguments.length-1;ii>=0;ii--){head={value:arguments[ii],next:head};}if(this.__ownerID){this.size=newSize;this._head=head;this.__hash=undefined;this.__altered=true;return this;}return makeStack(newSize,head);};Stack.prototype.pushAll=function(iter){iter=IndexedIterable(iter);if(iter.size===0){return this;}assertNotInfinite(iter.size);var newSize=this.size;var head=this._head;iter.reverse().forEach(function(value){newSize++;head={value:value,next:head};});if(this.__ownerID){this.size=newSize;this._head=head;this.__hash=undefined;this.__altered=true;return this;}return makeStack(newSize,head);};Stack.prototype.pop=function(){return this.slice(1);};Stack.prototype.unshift=function() /*...values*/{return this.push.apply(this,arguments);};Stack.prototype.unshiftAll=function(iter){return this.pushAll(iter);};Stack.prototype.shift=function(){return this.pop.apply(this,arguments);};Stack.prototype.clear=function(){if(this.size===0){return this;}if(this.__ownerID){this.size=0;this._head=undefined;this.__hash=undefined;this.__altered=true;return this;}return emptyStack();};Stack.prototype.slice=function(begin,end){if(wholeSlice(begin,end,this.size)){return this;}var resolvedBegin=resolveBegin(begin,this.size);var resolvedEnd=resolveEnd(end,this.size);if(resolvedEnd!==this.size){ // super.slice(begin, end);
	return IndexedCollection.prototype.slice.call(this,begin,end);}var newSize=this.size-resolvedBegin;var head=this._head;while(resolvedBegin--){head=head.next;}if(this.__ownerID){this.size=newSize;this._head=head;this.__hash=undefined;this.__altered=true;return this;}return makeStack(newSize,head);}; // @pragma Mutability
	Stack.prototype.__ensureOwner=function(ownerID){if(ownerID===this.__ownerID){return this;}if(!ownerID){this.__ownerID=ownerID;this.__altered=false;return this;}return makeStack(this.size,this._head,ownerID,this.__hash);}; // @pragma Iteration
	Stack.prototype.__iterate=function(fn,reverse){if(reverse){return this.reverse().__iterate(fn);}var iterations=0;var node=this._head;while(node){if(fn(node.value,iterations++,this)===false){break;}node=node.next;}return iterations;};Stack.prototype.__iterator=function(type,reverse){if(reverse){return this.reverse().__iterator(type);}var iterations=0;var node=this._head;return new Iterator(function(){if(node){var value=node.value;node=node.next;return iteratorValue(type,iterations++,value);}return iteratorDone();});};function isStack(maybeStack){return !!(maybeStack&&maybeStack[IS_STACK_SENTINEL]);}Stack.isStack=isStack;var IS_STACK_SENTINEL='@@__IMMUTABLE_STACK__@@';var StackPrototype=Stack.prototype;StackPrototype[IS_STACK_SENTINEL]=true;StackPrototype.withMutations=MapPrototype.withMutations;StackPrototype.asMutable=MapPrototype.asMutable;StackPrototype.asImmutable=MapPrototype.asImmutable;StackPrototype.wasAltered=MapPrototype.wasAltered;function makeStack(size,head,ownerID,hash){var map=Object.create(StackPrototype);map.size=size;map._head=head;map.__ownerID=ownerID;map.__hash=hash;map.__altered=false;return map;}var EMPTY_STACK;function emptyStack(){return EMPTY_STACK||(EMPTY_STACK=makeStack(0));} /**
	   * Contributes additional methods to a constructor
	   */function mixin(ctor,methods){var keyCopier=function keyCopier(key){ctor.prototype[key]=methods[key];};Object.keys(methods).forEach(keyCopier);Object.getOwnPropertySymbols&&Object.getOwnPropertySymbols(methods).forEach(keyCopier);return ctor;}Iterable.Iterator=Iterator;mixin(Iterable,{ // ### Conversion to other types
	toArray:function toArray(){assertNotInfinite(this.size);var array=new Array(this.size||0);this.valueSeq().__iterate(function(v,i){array[i]=v;});return array;},toIndexedSeq:function toIndexedSeq(){return new ToIndexedSequence(this);},toJS:function toJS(){return this.toSeq().map(function(value){return value&&typeof value.toJS==='function'?value.toJS():value;}).__toJS();},toJSON:function toJSON(){return this.toSeq().map(function(value){return value&&typeof value.toJSON==='function'?value.toJSON():value;}).__toJS();},toKeyedSeq:function toKeyedSeq(){return new ToKeyedSequence(this,true);},toMap:function toMap(){ // Use Late Binding here to solve the circular dependency.
	return Map(this.toKeyedSeq());},toObject:function toObject(){assertNotInfinite(this.size);var object={};this.__iterate(function(v,k){object[k]=v;});return object;},toOrderedMap:function toOrderedMap(){ // Use Late Binding here to solve the circular dependency.
	return OrderedMap(this.toKeyedSeq());},toOrderedSet:function toOrderedSet(){ // Use Late Binding here to solve the circular dependency.
	return OrderedSet(isKeyed(this)?this.valueSeq():this);},toSet:function toSet(){ // Use Late Binding here to solve the circular dependency.
	return Set(isKeyed(this)?this.valueSeq():this);},toSetSeq:function toSetSeq(){return new ToSetSequence(this);},toSeq:function toSeq(){return isIndexed(this)?this.toIndexedSeq():isKeyed(this)?this.toKeyedSeq():this.toSetSeq();},toStack:function toStack(){ // Use Late Binding here to solve the circular dependency.
	return Stack(isKeyed(this)?this.valueSeq():this);},toList:function toList(){ // Use Late Binding here to solve the circular dependency.
	return List(isKeyed(this)?this.valueSeq():this);}, // ### Common JavaScript methods and properties
	toString:function toString(){return '[Iterable]';},__toString:function __toString(head,tail){if(this.size===0){return head+tail;}return head+' '+this.toSeq().map(this.__toStringMapper).join(', ')+' '+tail;}, // ### ES6 Collection methods (ES6 Array and Map)
	concat:function concat(){var values=SLICE$0.call(arguments,0);return reify(this,concatFactory(this,values));},includes:function includes(searchValue){return this.some(function(value){return is(value,searchValue);});},entries:function entries(){return this.__iterator(ITERATE_ENTRIES);},every:function every(predicate,context){assertNotInfinite(this.size);var returnValue=true;this.__iterate(function(v,k,c){if(!predicate.call(context,v,k,c)){returnValue=false;return false;}});return returnValue;},filter:function filter(predicate,context){return reify(this,filterFactory(this,predicate,context,true));},find:function find(predicate,context,notSetValue){var entry=this.findEntry(predicate,context);return entry?entry[1]:notSetValue;},forEach:function forEach(sideEffect,context){assertNotInfinite(this.size);return this.__iterate(context?sideEffect.bind(context):sideEffect);},join:function join(separator){assertNotInfinite(this.size);separator=separator!==undefined?''+separator:',';var joined='';var isFirst=true;this.__iterate(function(v){isFirst?isFirst=false:joined+=separator;joined+=v!==null&&v!==undefined?v.toString():'';});return joined;},keys:function keys(){return this.__iterator(ITERATE_KEYS);},map:function map(mapper,context){return reify(this,mapFactory(this,mapper,context));},reduce:function reduce(reducer,initialReduction,context){assertNotInfinite(this.size);var reduction;var useFirst;if(arguments.length<2){useFirst=true;}else {reduction=initialReduction;}this.__iterate(function(v,k,c){if(useFirst){useFirst=false;reduction=v;}else {reduction=reducer.call(context,reduction,v,k,c);}});return reduction;},reduceRight:function reduceRight(reducer,initialReduction,context){var reversed=this.toKeyedSeq().reverse();return reversed.reduce.apply(reversed,arguments);},reverse:function reverse(){return reify(this,reverseFactory(this,true));},slice:function slice(begin,end){return reify(this,sliceFactory(this,begin,end,true));},some:function some(predicate,context){return !this.every(not(predicate),context);},sort:function sort(comparator){return reify(this,sortFactory(this,comparator));},values:function values(){return this.__iterator(ITERATE_VALUES);}, // ### More sequential methods
	butLast:function butLast(){return this.slice(0,-1);},isEmpty:function isEmpty(){return this.size!==undefined?this.size===0:!this.some(function(){return true;});},count:function count(predicate,context){return ensureSize(predicate?this.toSeq().filter(predicate,context):this);},countBy:function countBy(grouper,context){return countByFactory(this,grouper,context);},equals:function equals(other){return deepEqual(this,other);},entrySeq:function entrySeq(){var iterable=this;if(iterable._cache){ // We cache as an entries array, so we can just return the cache!
	return new ArraySeq(iterable._cache);}var entriesSequence=iterable.toSeq().map(entryMapper).toIndexedSeq();entriesSequence.fromEntrySeq=function(){return iterable.toSeq();};return entriesSequence;},filterNot:function filterNot(predicate,context){return this.filter(not(predicate),context);},findEntry:function findEntry(predicate,context,notSetValue){var found=notSetValue;this.__iterate(function(v,k,c){if(predicate.call(context,v,k,c)){found=[k,v];return false;}});return found;},findKey:function findKey(predicate,context){var entry=this.findEntry(predicate,context);return entry&&entry[0];},findLast:function findLast(predicate,context,notSetValue){return this.toKeyedSeq().reverse().find(predicate,context,notSetValue);},findLastEntry:function findLastEntry(predicate,context,notSetValue){return this.toKeyedSeq().reverse().findEntry(predicate,context,notSetValue);},findLastKey:function findLastKey(predicate,context){return this.toKeyedSeq().reverse().findKey(predicate,context);},first:function first(){return this.find(returnTrue);},flatMap:function flatMap(mapper,context){return reify(this,flatMapFactory(this,mapper,context));},flatten:function flatten(depth){return reify(this,flattenFactory(this,depth,true));},fromEntrySeq:function fromEntrySeq(){return new FromEntriesSequence(this);},get:function get(searchKey,notSetValue){return this.find(function(_,key){return is(key,searchKey);},undefined,notSetValue);},getIn:function getIn(searchKeyPath,notSetValue){var nested=this; // Note: in an ES6 environment, we would prefer:
	// for (var key of searchKeyPath) {
	var iter=forceIterator(searchKeyPath);var step;while(!(step=iter.next()).done){var key=step.value;nested=nested&&nested.get?nested.get(key,NOT_SET):NOT_SET;if(nested===NOT_SET){return notSetValue;}}return nested;},groupBy:function groupBy(grouper,context){return groupByFactory(this,grouper,context);},has:function has(searchKey){return this.get(searchKey,NOT_SET)!==NOT_SET;},hasIn:function hasIn(searchKeyPath){return this.getIn(searchKeyPath,NOT_SET)!==NOT_SET;},isSubset:function isSubset(iter){iter=typeof iter.includes==='function'?iter:Iterable(iter);return this.every(function(value){return iter.includes(value);});},isSuperset:function isSuperset(iter){iter=typeof iter.isSubset==='function'?iter:Iterable(iter);return iter.isSubset(this);},keyOf:function keyOf(searchValue){return this.findKey(function(value){return is(value,searchValue);});},keySeq:function keySeq(){return this.toSeq().map(keyMapper).toIndexedSeq();},last:function last(){return this.toSeq().reverse().first();},lastKeyOf:function lastKeyOf(searchValue){return this.toKeyedSeq().reverse().keyOf(searchValue);},max:function max(comparator){return maxFactory(this,comparator);},maxBy:function maxBy(mapper,comparator){return maxFactory(this,comparator,mapper);},min:function min(comparator){return maxFactory(this,comparator?neg(comparator):defaultNegComparator);},minBy:function minBy(mapper,comparator){return maxFactory(this,comparator?neg(comparator):defaultNegComparator,mapper);},rest:function rest(){return this.slice(1);},skip:function skip(amount){return this.slice(Math.max(0,amount));},skipLast:function skipLast(amount){return reify(this,this.toSeq().reverse().skip(amount).reverse());},skipWhile:function skipWhile(predicate,context){return reify(this,skipWhileFactory(this,predicate,context,true));},skipUntil:function skipUntil(predicate,context){return this.skipWhile(not(predicate),context);},sortBy:function sortBy(mapper,comparator){return reify(this,sortFactory(this,comparator,mapper));},take:function take(amount){return this.slice(0,Math.max(0,amount));},takeLast:function takeLast(amount){return reify(this,this.toSeq().reverse().take(amount).reverse());},takeWhile:function takeWhile(predicate,context){return reify(this,takeWhileFactory(this,predicate,context));},takeUntil:function takeUntil(predicate,context){return this.takeWhile(not(predicate),context);},valueSeq:function valueSeq(){return this.toIndexedSeq();}, // ### Hashable Object
	hashCode:function hashCode(){return this.__hash||(this.__hash=hashIterable(this));} // ### Internal
	// abstract __iterate(fn, reverse)
	// abstract __iterator(type, reverse)
	}); // var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
	// var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
	// var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
	// var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';
	var IterablePrototype=Iterable.prototype;IterablePrototype[IS_ITERABLE_SENTINEL]=true;IterablePrototype[ITERATOR_SYMBOL]=IterablePrototype.values;IterablePrototype.__toJS=IterablePrototype.toArray;IterablePrototype.__toStringMapper=quoteString;IterablePrototype.inspect=IterablePrototype.toSource=function(){return this.toString();};IterablePrototype.chain=IterablePrototype.flatMap;IterablePrototype.contains=IterablePrototype.includes;mixin(KeyedIterable,{ // ### More sequential methods
	flip:function flip(){return reify(this,flipFactory(this));},mapEntries:function mapEntries(mapper,context){var this$0=this;var iterations=0;return reify(this,this.toSeq().map(function(v,k){return mapper.call(context,[k,v],iterations++,this$0);}).fromEntrySeq());},mapKeys:function mapKeys(mapper,context){var this$0=this;return reify(this,this.toSeq().flip().map(function(k,v){return mapper.call(context,k,v,this$0);}).flip());}});var KeyedIterablePrototype=KeyedIterable.prototype;KeyedIterablePrototype[IS_KEYED_SENTINEL]=true;KeyedIterablePrototype[ITERATOR_SYMBOL]=IterablePrototype.entries;KeyedIterablePrototype.__toJS=IterablePrototype.toObject;KeyedIterablePrototype.__toStringMapper=function(v,k){return JSON.stringify(k)+': '+quoteString(v);};mixin(IndexedIterable,{ // ### Conversion to other types
	toKeyedSeq:function toKeyedSeq(){return new ToKeyedSequence(this,false);}, // ### ES6 Collection methods (ES6 Array and Map)
	filter:function filter(predicate,context){return reify(this,filterFactory(this,predicate,context,false));},findIndex:function findIndex(predicate,context){var entry=this.findEntry(predicate,context);return entry?entry[0]:-1;},indexOf:function indexOf(searchValue){var key=this.keyOf(searchValue);return key===undefined?-1:key;},lastIndexOf:function lastIndexOf(searchValue){var key=this.lastKeyOf(searchValue);return key===undefined?-1:key;},reverse:function reverse(){return reify(this,reverseFactory(this,false));},slice:function slice(begin,end){return reify(this,sliceFactory(this,begin,end,false));},splice:function splice(index,removeNum /*, ...values*/){var numArgs=arguments.length;removeNum=Math.max(removeNum|0,0);if(numArgs===0||numArgs===2&&!removeNum){return this;} // If index is negative, it should resolve relative to the size of the
	// collection. However size may be expensive to compute if not cached, so
	// only call count() if the number is in fact negative.
	index=resolveBegin(index,index<0?this.count():this.size);var spliced=this.slice(0,index);return reify(this,numArgs===1?spliced:spliced.concat(arrCopy(arguments,2),this.slice(index+removeNum)));}, // ### More collection methods
	findLastIndex:function findLastIndex(predicate,context){var entry=this.findLastEntry(predicate,context);return entry?entry[0]:-1;},first:function first(){return this.get(0);},flatten:function flatten(depth){return reify(this,flattenFactory(this,depth,false));},get:function get(index,notSetValue){index=wrapIndex(this,index);return index<0||this.size===Infinity||this.size!==undefined&&index>this.size?notSetValue:this.find(function(_,key){return key===index;},undefined,notSetValue);},has:function has(index){index=wrapIndex(this,index);return index>=0&&(this.size!==undefined?this.size===Infinity||index<this.size:this.indexOf(index)!==-1);},interpose:function interpose(separator){return reify(this,interposeFactory(this,separator));},interleave:function interleave() /*...iterables*/{var iterables=[this].concat(arrCopy(arguments));var zipped=zipWithFactory(this.toSeq(),IndexedSeq.of,iterables);var interleaved=zipped.flatten(true);if(zipped.size){interleaved.size=zipped.size*iterables.length;}return reify(this,interleaved);},keySeq:function keySeq(){return Range(0,this.size);},last:function last(){return this.get(-1);},skipWhile:function skipWhile(predicate,context){return reify(this,skipWhileFactory(this,predicate,context,false));},zip:function zip() /*, ...iterables */{var iterables=[this].concat(arrCopy(arguments));return reify(this,zipWithFactory(this,defaultZipper,iterables));},zipWith:function zipWith(zipper /*, ...iterables */){var iterables=arrCopy(arguments);iterables[0]=this;return reify(this,zipWithFactory(this,zipper,iterables));}});IndexedIterable.prototype[IS_INDEXED_SENTINEL]=true;IndexedIterable.prototype[IS_ORDERED_SENTINEL]=true;mixin(SetIterable,{ // ### ES6 Collection methods (ES6 Array and Map)
	get:function get(value,notSetValue){return this.has(value)?value:notSetValue;},includes:function includes(value){return this.has(value);}, // ### More sequential methods
	keySeq:function keySeq(){return this.valueSeq();}});SetIterable.prototype.has=IterablePrototype.includes;SetIterable.prototype.contains=SetIterable.prototype.includes; // Mixin subclasses
	mixin(KeyedSeq,KeyedIterable.prototype);mixin(IndexedSeq,IndexedIterable.prototype);mixin(SetSeq,SetIterable.prototype);mixin(KeyedCollection,KeyedIterable.prototype);mixin(IndexedCollection,IndexedIterable.prototype);mixin(SetCollection,SetIterable.prototype); // #pragma Helper functions
	function keyMapper(v,k){return k;}function entryMapper(v,k){return [k,v];}function not(predicate){return function(){return !predicate.apply(this,arguments);};}function neg(predicate){return function(){return -predicate.apply(this,arguments);};}function quoteString(value){return typeof value==='string'?JSON.stringify(value):String(value);}function defaultZipper(){return arrCopy(arguments);}function defaultNegComparator(a,b){return a<b?1:a>b?-1:0;}function hashIterable(iterable){if(iterable.size===Infinity){return 0;}var ordered=isOrdered(iterable);var keyed=isKeyed(iterable);var h=ordered?1:0;var size=iterable.__iterate(keyed?ordered?function(v,k){h=31*h+hashMerge(hash(v),hash(k))|0;}:function(v,k){h=h+hashMerge(hash(v),hash(k))|0;}:ordered?function(v){h=31*h+hash(v)|0;}:function(v){h=h+hash(v)|0;});return murmurHashOfSize(size,h);}function murmurHashOfSize(size,h){h=imul(h,0xCC9E2D51);h=imul(h<<15|h>>>-15,0x1B873593);h=imul(h<<13|h>>>-13,5);h=(h+0xE6546B64|0)^size;h=imul(h^h>>>16,0x85EBCA6B);h=imul(h^h>>>13,0xC2B2AE35);h=smi(h^h>>>16);return h;}function hashMerge(a,b){return a^b+0x9E3779B9+(a<<6)+(a>>2)|0; // int
	}var Immutable={Iterable:Iterable,Seq:Seq,Collection:Collection,Map:Map,OrderedMap:OrderedMap,List:List,Stack:Stack,Set:Set,OrderedSet:OrderedSet,Record:Record,Range:Range,Repeat:Repeat,is:is,fromJS:fromJS};return Immutable;});

/***/ },
/* 9 */
/*!******************************************************!*\
  !*** ./~/affront/lib/errors/InvalidArgumentError.js ***!
  \******************************************************/
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

/***/ },
/* 10 */
/*!****************************************************!*\
  !*** ./~/affront/lib/Store/Subscriptions/index.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Subscriptions = undefined;
	
	var _Subscriber = __webpack_require__(/*! ./Subscriber */ 11);
	
	var _Subscription = __webpack_require__(/*! ./Subscription */ 12);
	
	var _SubscriptionManager = __webpack_require__(/*! ./SubscriptionManager */ 13);
	
	var Subscriptions = exports.Subscriptions = {
		Subscriber: _Subscriber.Subscriber,
		Subscription: _Subscription.Subscription,
		SubscriptionManager: _SubscriptionManager.SubscriptionManager
	};

/***/ },
/* 11 */
/*!*********************************************************!*\
  !*** ./~/affront/lib/Store/Subscriptions/Subscriber.js ***!
  \*********************************************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// The Subscriber encapsulates a method or function that subscribes for notifications
	
	var Subscriber = exports.Subscriber = function () {
		// context: The object that owns the method
		// fn: The method or function to be invoked for the notifications
	
		function Subscriber(context, fn) {
			_classCallCheck(this, Subscriber);
	
			this.context = context;
			this.fn = fn;
			this.subscription = null;
		}
	
		// Unsubscribes from receiving notifications
	
	
		_createClass(Subscriber, [{
			key: "unsubscribe",
			value: function unsubscribe() {
				this.subscription.removeSubscriber(this);
			}
	
			// Calls the method or function with the store item
	
		}, {
			key: "notify",
			value: function notify(storeItem) {
				if (this.context) {
					this.fn.call(this.context, storeItem);
				} else {
					this.fn(storeItem);
				}
			}
		}]);
	
		return Subscriber;
	}();
	
	;

/***/ },
/* 12 */
/*!***********************************************************!*\
  !*** ./~/affront/lib/Store/Subscriptions/Subscription.js ***!
  \***********************************************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// The subscription binds a key to multiple subscribers that wish to be notified
	// whenever the store item matching the key changes in the store
	
	var Subscription = exports.Subscription = function () {
		function Subscription(key) {
			_classCallCheck(this, Subscription);
	
			this.key = key;
			this.subscribers = [];
		}
	
		_createClass(Subscription, [{
			key: "addSubscriber",
			value: function addSubscriber(subscriber) {
				this.subscribers.push(subscriber);
				subscriber.subscription = this;
				return subscriber;
			}
		}, {
			key: "removeSubscriber",
			value: function removeSubscriber(subscriber) {
				var index = this.subscribers.findIndex(function (f) {
					return f === subscriber;
				});
				this.subscribers.splice(index, 1);
				subscriber.subscription = null;
				return subscriber;
			}
		}, {
			key: "notify",
			value: function notify(storeItem) {
				this.subscribers.forEach(function (s) {
					return s.notify(storeItem);
				});
			}
		}]);
	
		return Subscription;
	}();
	
	;

/***/ },
/* 13 */
/*!******************************************************************!*\
  !*** ./~/affront/lib/Store/Subscriptions/SubscriptionManager.js ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.SubscriptionManager = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Subscription = __webpack_require__(/*! ./Subscription */ 12);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// The central manager for all subscriptions and subscribers
	// Handles: subscribing and notification
	
	var SubscriptionManager = exports.SubscriptionManager = function () {
		function SubscriptionManager() {
			_classCallCheck(this, SubscriptionManager);
	
			this.subscriptions = {};
		}
	
		_createClass(SubscriptionManager, [{
			key: 'getSubscription',
			value: function getSubscription(key) {
				var subscription = this.subscriptions[key];
				if (!subscription) {
					this.subscriptions[key] = new _Subscription.Subscription(key);
					return this.subscriptions[key];
				}
				return subscription;
			}
		}, {
			key: 'notify',
			value: function notify(storeItem) {
				var subscription = this.subscriptions[storeItem.key];
				if (subscription) {
					subscription.notify(storeItem);
				}
			}
		}]);
	
		return SubscriptionManager;
	}();
	
	;

/***/ },
/* 14 */
/*!******************************************!*\
  !*** ./~/affront/lib/Store/StoreItem.js ***!
  \******************************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var StoreItem = exports.StoreItem = function StoreItem(key, value) {
		_classCallCheck(this, StoreItem);
	
		this.key = key;
		this.value = value;
	};
	
	;

/***/ },
/* 15 */
/*!***************************************!*\
  !*** ./~/affront/lib/Events/index.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Events = undefined;
	
	var _NotificationEvent = __webpack_require__(/*! ./NotificationEvent */ 16);
	
	var _RouteChangedEvent = __webpack_require__(/*! ./RouteChangedEvent */ 18);
	
	var Events = exports.Events = {
		NotificationEvent: _NotificationEvent.NotificationEvent,
		RouteChangedEvent: _RouteChangedEvent.RouteChangedEvent
	};

/***/ },
/* 16 */
/*!***************************************************!*\
  !*** ./~/affront/lib/Events/NotificationEvent.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.NotificationEvent = undefined;
	
	var _EventBase2 = __webpack_require__(/*! ./EventBase */ 17);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var NotificationEvent = exports.NotificationEvent = function (_EventBase) {
		_inherits(NotificationEvent, _EventBase);
	
		function NotificationEvent(storeItem) {
			_classCallCheck(this, NotificationEvent);
	
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NotificationEvent).call(this));
	
			_this.value = storeItem;
			return _this;
		}
	
		return NotificationEvent;
	}(_EventBase2.EventBase);
	
	;

/***/ },
/* 17 */
/*!*******************************************!*\
  !*** ./~/affront/lib/Events/EventBase.js ***!
  \*******************************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var EventBase = exports.EventBase = function EventBase() {
		_classCallCheck(this, EventBase);
	
		this.createdAt = new Date();
	};
	
	;

/***/ },
/* 18 */
/*!***************************************************!*\
  !*** ./~/affront/lib/Events/RouteChangedEvent.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.RouteChangedEvent = undefined;
	
	var _EventBase2 = __webpack_require__(/*! ./EventBase */ 17);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var RouteChangedEvent = exports.RouteChangedEvent = function (_EventBase) {
		_inherits(RouteChangedEvent, _EventBase);
	
		function RouteChangedEvent(ctxt) {
			_classCallCheck(this, RouteChangedEvent);
	
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RouteChangedEvent).call(this));
	
			_this.value = ctxt;
			return _this;
		}
	
		return RouteChangedEvent;
	}(_EventBase2.EventBase);
	
	;

/***/ },
/* 19 */
/*!******************************************!*\
  !*** ./~/affront/lib/Component/index.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Component = undefined;
	
	var _ViewComponent = __webpack_require__(/*! ./ViewComponent */ 20);
	
	var _TemplateViewComponent = __webpack_require__(/*! ./TemplateViewComponent */ 42);
	
	var _NonVisualComponent = __webpack_require__(/*! ./NonVisualComponent */ 43);
	
	var Component = exports.Component = {
		ViewComponent: _ViewComponent.ViewComponent,
		TemplateViewComponent: _TemplateViewComponent.TemplateViewComponent,
		NonVisualComponent: _NonVisualComponent.NonVisualComponent
	};

/***/ },
/* 20 */
/*!**************************************************!*\
  !*** ./~/affront/lib/Component/ViewComponent.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.ViewComponent = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _ComponentBase2 = __webpack_require__(/*! ./ComponentBase */ 4);
	
	var _Control = __webpack_require__(/*! ../Control */ 21);
	
	var _InvalidArgumentError = __webpack_require__(/*! ../errors/InvalidArgumentError */ 9);
	
	__webpack_require__(/*! friedjuju/src/json-to-markup/j2m.js */ 23);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var ViewComponent = exports.ViewComponent = function (_ComponentBase) {
		_inherits(ViewComponent, _ComponentBase);
	
		// routeUrl: The route url to which the component is bound
		// domContainerElement: The element that will be rendered into
	
		function ViewComponent(routeUrl, domContainerElement) {
			_classCallCheck(this, ViewComponent);
	
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ViewComponent).call(this, routeUrl));
	
			_this.domContainerElement = domContainerElement;
	
			_this.controls = {};
			return _this;
		}
	
		_createClass(ViewComponent, [{
			key: 'addControl',
			value: function addControl(control) {
				if (!(control instanceof _Control.Control)) {
					throw new _InvalidArgumentError.InvalidArgumentError('Cannot add control because it is invalid');
				}
				this.controls[control.id] = control;
			}
	
			// val: Either controlId or control instance
	
		}, {
			key: 'removeControl',
			value: function removeControl(val) {
				if (val instanceof _Control.Control) {
					delete this.controls[val.id];
				} else {
					delete this.controls[val];
				}
			}
		}, {
			key: 'updateDOM',
			value: function updateDOM(markupStr) {
				j2m.updateDOMFromMarkupString(markupStr, this.domContainerElement);
	
				if (this.controls) {
					for (var controlId in this.controls) {
						var control = this.controls[controlId];
						control.onDOMUpdated(this.domContainerElement, this.lastEvent);
					}
				}
			}
	
			// This method is invoked so the component can set itself up to render content;
			// i.e. boiler plate content (static content) must be displayed
			// ctxt: an UrlContext instance
	
		}, {
			key: 'urlChangedRender',
			value: function urlChangedRender(ctxt) {
				console.log('[ViewComponent.urlChangedRender] invoked | ctxt = ', ctxt);
			}
	
			// This method is invoked so the component can render the actual data (storeItem)
			// ctxt: a StoreItem instance
	
		}, {
			key: 'notificationRender',
			value: function notificationRender(storeItem) {
				console.log('[ViewComponent.notificationRender] invoked | storeItem = ', storeItem);
			}
		}, {
			key: 'hide',
			value: function hide() {
				console.log('[ViewComponent.hide] invoked');
			}
		}]);
	
		return ViewComponent;
	}(_ComponentBase2.ComponentBase);
	
	;

/***/ },
/* 21 */
/*!****************************************!*\
  !*** ./~/affront/lib/Control/index.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Control = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _InvalidArgumentError = __webpack_require__(/*! ../errors/InvalidArgumentError */ 9);
	
	var _NotImplementedError = __webpack_require__(/*! ../errors/NotImplementedError */ 6);
	
	var _mustache = __webpack_require__(/*! mustache */ 22);
	
	var _mustache2 = _interopRequireDefault(_mustache);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Control = exports.Control = function () {
		function Control(id, template, localCSS) {
			_classCallCheck(this, Control);
	
			if (typeof id !== 'string' || !isNaN(id)) {
				throw new _InvalidArgumentError.InvalidArgumentError('Cannot create the control because the id is not a string');
			}
			if (id.length < 1) {
				throw new _InvalidArgumentError.InvalidArgumentError('Cannot create the control because the id is not a non-empty string');
			}
			if (null === template || undefined === template) {
				throw new _InvalidArgumentError.InvalidArgumentError('Cannot create the control because the template cannot be null or undefined');
			}
			if (typeof template !== 'string') {
				throw new _InvalidArgumentError.InvalidArgumentError('Cannot create the control because the template is not a string');
			}
	
			this.id = id;
			this.template = template;
	
			if (template && localCSS) {
				// localize the CSS class names in the templates
				for (var oCN in localCSS) {
					var nCN = localCSS[oCN];
					this.template = this.template.replace(new RegExp('class="' + oCN + '"', 'gi'), 'class="' + nCN + '"').replace(new RegExp('class=\'' + oCN + '\'', 'gi'), 'class=\'' + nCN + '\'');
				}
			}
	
			this.controls = {};
		}
	
		_createClass(Control, [{
			key: 'addControl',
			value: function addControl(control) {
				if (!(control instanceof Control)) {
					throw new _InvalidArgumentError.InvalidArgumentError('Cannot add sub-control because it is invalid');
				}
				this.controls[control.id] = control;
			}
	
			// val: Either controlId or control instance
	
		}, {
			key: 'removeControl',
			value: function removeControl(val) {
				if (val instanceof Control) {
					delete this.controls[val.id];
				} else {
					delete this.controls[val];
				}
			}
		}, {
			key: 'render',
			value: function render(data, eventObj) {
				if (this.controls) {
					var controlData = {};
					for (var controlId in this.controls) {
						var control = this.controls[controlId];
						controlData[control.constructor.name] = {};
						controlData[control.constructor.name][control.id] = control.render(data, eventObj);
					}
	
					for (var key in controlData) {
						data[key] = controlData[key];
					}
				}
	
				return _mustache2.default.render(this.template, data);
			}
	
			// This method is invoked so the control can bind events after the DOM has been updated
			// domContainerElement: The DOM container element into which the control was rendered
	
		}, {
			key: 'onDOMUpdated',
			value: function onDOMUpdated(domContainerElement, eventObj) {
				if (this.onDOMUpdatedNotification) {
					this.onDOMUpdatedNotification(domContainerElement, eventObj);
				}
	
				if (this.controls) {
					for (var controlId in this.controls) {
						var control = this.controls[controlId];
						control.onDOMUpdated(this.domContainerElement, eventObj);
					}
				}
			}
	
			// The Control classes that extend this type can add custom logic here to be executed after the domContainerElement
			// has been updated
	
		}, {
			key: 'onDOMUpdatedNotification',
			value: function onDOMUpdatedNotification(domContainerElement, eventObj) {}
		}]);
	
		return Control;
	}();
	
	;

/***/ },
/* 22 */
/*!********************************!*\
  !*** ./~/mustache/mustache.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	/*!
	 * mustache.js - Logic-less {{mustache}} templates with JavaScript
	 * http://github.com/janl/mustache.js
	 */
	
	/*global define: false Mustache: true*/
	
	(function defineMustache(global, factory) {
	  if (( false ? 'undefined' : _typeof(exports)) === 'object' && exports && typeof exports.nodeName !== 'string') {
	    factory(exports); // CommonJS
	  } else if (true) {
	      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	    } else {
	        global.Mustache = {};
	        factory(global.Mustache); // script, wsh, asp
	      }
	})(undefined, function mustacheFactory(mustache) {
	
	  var objectToString = Object.prototype.toString;
	  var isArray = Array.isArray || function isArrayPolyfill(object) {
	    return objectToString.call(object) === '[object Array]';
	  };
	
	  function isFunction(object) {
	    return typeof object === 'function';
	  }
	
	  /**
	   * More correct typeof string handling array
	   * which normally returns typeof 'object'
	   */
	  function typeStr(obj) {
	    return isArray(obj) ? 'array' : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
	  }
	
	  function escapeRegExp(string) {
	    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
	  }
	
	  /**
	   * Null safe way of checking whether or not an object,
	   * including its prototype, has a given property
	   */
	  function hasProperty(obj, propName) {
	    return obj != null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && propName in obj;
	  }
	
	  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
	  // See https://github.com/janl/mustache.js/issues/189
	  var regExpTest = RegExp.prototype.test;
	  function testRegExp(re, string) {
	    return regExpTest.call(re, string);
	  }
	
	  var nonSpaceRe = /\S/;
	  function isWhitespace(string) {
	    return !testRegExp(nonSpaceRe, string);
	  }
	
	  var entityMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#39;',
	    '/': '&#x2F;',
	    '`': '&#x60;',
	    '=': '&#x3D;'
	  };
	
	  function escapeHtml(string) {
	    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
	      return entityMap[s];
	    });
	  }
	
	  var whiteRe = /\s*/;
	  var spaceRe = /\s+/;
	  var equalsRe = /\s*=/;
	  var curlyRe = /\s*\}/;
	  var tagRe = /#|\^|\/|>|\{|&|=|!/;
	
	  /**
	   * Breaks up the given `template` string into a tree of tokens. If the `tags`
	   * argument is given here it must be an array with two string values: the
	   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
	   * course, the default is to use mustaches (i.e. mustache.tags).
	   *
	   * A token is an array with at least 4 elements. The first element is the
	   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
	   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
	   * all text that appears outside a symbol this element is "text".
	   *
	   * The second element of a token is its "value". For mustache tags this is
	   * whatever else was inside the tag besides the opening symbol. For text tokens
	   * this is the text itself.
	   *
	   * The third and fourth elements of the token are the start and end indices,
	   * respectively, of the token in the original template.
	   *
	   * Tokens that are the root node of a subtree contain two more elements: 1) an
	   * array of tokens in the subtree and 2) the index in the original template at
	   * which the closing tag for that section begins.
	   */
	  function parseTemplate(template, tags) {
	    if (!template) return [];
	
	    var sections = []; // Stack to hold section tokens
	    var tokens = []; // Buffer to hold the tokens
	    var spaces = []; // Indices of whitespace tokens on the current line
	    var hasTag = false; // Is there a {{tag}} on the current line?
	    var nonSpace = false; // Is there a non-space char on the current line?
	
	    // Strips all whitespace tokens array for the current line
	    // if there was a {{#tag}} on it and otherwise only space.
	    function stripSpace() {
	      if (hasTag && !nonSpace) {
	        while (spaces.length) {
	          delete tokens[spaces.pop()];
	        }
	      } else {
	        spaces = [];
	      }
	
	      hasTag = false;
	      nonSpace = false;
	    }
	
	    var openingTagRe, closingTagRe, closingCurlyRe;
	    function compileTags(tagsToCompile) {
	      if (typeof tagsToCompile === 'string') tagsToCompile = tagsToCompile.split(spaceRe, 2);
	
	      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2) throw new Error('Invalid tags: ' + tagsToCompile);
	
	      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
	      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
	      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
	    }
	
	    compileTags(tags || mustache.tags);
	
	    var scanner = new Scanner(template);
	
	    var start, type, value, chr, token, openSection;
	    while (!scanner.eos()) {
	      start = scanner.pos;
	
	      // Match any text between tags.
	      value = scanner.scanUntil(openingTagRe);
	
	      if (value) {
	        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
	          chr = value.charAt(i);
	
	          if (isWhitespace(chr)) {
	            spaces.push(tokens.length);
	          } else {
	            nonSpace = true;
	          }
	
	          tokens.push(['text', chr, start, start + 1]);
	          start += 1;
	
	          // Check for whitespace on the current line.
	          if (chr === '\n') stripSpace();
	        }
	      }
	
	      // Match the opening tag.
	      if (!scanner.scan(openingTagRe)) break;
	
	      hasTag = true;
	
	      // Get the tag type.
	      type = scanner.scan(tagRe) || 'name';
	      scanner.scan(whiteRe);
	
	      // Get the tag value.
	      if (type === '=') {
	        value = scanner.scanUntil(equalsRe);
	        scanner.scan(equalsRe);
	        scanner.scanUntil(closingTagRe);
	      } else if (type === '{') {
	        value = scanner.scanUntil(closingCurlyRe);
	        scanner.scan(curlyRe);
	        scanner.scanUntil(closingTagRe);
	        type = '&';
	      } else {
	        value = scanner.scanUntil(closingTagRe);
	      }
	
	      // Match the closing tag.
	      if (!scanner.scan(closingTagRe)) throw new Error('Unclosed tag at ' + scanner.pos);
	
	      token = [type, value, start, scanner.pos];
	      tokens.push(token);
	
	      if (type === '#' || type === '^') {
	        sections.push(token);
	      } else if (type === '/') {
	        // Check section nesting.
	        openSection = sections.pop();
	
	        if (!openSection) throw new Error('Unopened section "' + value + '" at ' + start);
	
	        if (openSection[1] !== value) throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
	      } else if (type === 'name' || type === '{' || type === '&') {
	        nonSpace = true;
	      } else if (type === '=') {
	        // Set the tags for the next time around.
	        compileTags(value);
	      }
	    }
	
	    // Make sure there are no open sections when we're done.
	    openSection = sections.pop();
	
	    if (openSection) throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);
	
	    return nestTokens(squashTokens(tokens));
	  }
	
	  /**
	   * Combines the values of consecutive text tokens in the given `tokens` array
	   * to a single token.
	   */
	  function squashTokens(tokens) {
	    var squashedTokens = [];
	
	    var token, lastToken;
	    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
	      token = tokens[i];
	
	      if (token) {
	        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
	          lastToken[1] += token[1];
	          lastToken[3] = token[3];
	        } else {
	          squashedTokens.push(token);
	          lastToken = token;
	        }
	      }
	    }
	
	    return squashedTokens;
	  }
	
	  /**
	   * Forms the given array of `tokens` into a nested tree structure where
	   * tokens that represent a section have two additional items: 1) an array of
	   * all tokens that appear in that section and 2) the index in the original
	   * template that represents the end of that section.
	   */
	  function nestTokens(tokens) {
	    var nestedTokens = [];
	    var collector = nestedTokens;
	    var sections = [];
	
	    var token, section;
	    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
	      token = tokens[i];
	
	      switch (token[0]) {
	        case '#':
	        case '^':
	          collector.push(token);
	          sections.push(token);
	          collector = token[4] = [];
	          break;
	        case '/':
	          section = sections.pop();
	          section[5] = token[2];
	          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
	          break;
	        default:
	          collector.push(token);
	      }
	    }
	
	    return nestedTokens;
	  }
	
	  /**
	   * A simple string scanner that is used by the template parser to find
	   * tokens in template strings.
	   */
	  function Scanner(string) {
	    this.string = string;
	    this.tail = string;
	    this.pos = 0;
	  }
	
	  /**
	   * Returns `true` if the tail is empty (end of string).
	   */
	  Scanner.prototype.eos = function eos() {
	    return this.tail === '';
	  };
	
	  /**
	   * Tries to match the given regular expression at the current position.
	   * Returns the matched text if it can match, the empty string otherwise.
	   */
	  Scanner.prototype.scan = function scan(re) {
	    var match = this.tail.match(re);
	
	    if (!match || match.index !== 0) return '';
	
	    var string = match[0];
	
	    this.tail = this.tail.substring(string.length);
	    this.pos += string.length;
	
	    return string;
	  };
	
	  /**
	   * Skips all text until the given regular expression can be matched. Returns
	   * the skipped string, which is the entire tail if no match can be made.
	   */
	  Scanner.prototype.scanUntil = function scanUntil(re) {
	    var index = this.tail.search(re),
	        match;
	
	    switch (index) {
	      case -1:
	        match = this.tail;
	        this.tail = '';
	        break;
	      case 0:
	        match = '';
	        break;
	      default:
	        match = this.tail.substring(0, index);
	        this.tail = this.tail.substring(index);
	    }
	
	    this.pos += match.length;
	
	    return match;
	  };
	
	  /**
	   * Represents a rendering context by wrapping a view object and
	   * maintaining a reference to the parent context.
	   */
	  function Context(view, parentContext) {
	    this.view = view;
	    this.cache = { '.': this.view };
	    this.parent = parentContext;
	  }
	
	  /**
	   * Creates a new context using the given view with this context
	   * as the parent.
	   */
	  Context.prototype.push = function push(view) {
	    return new Context(view, this);
	  };
	
	  /**
	   * Returns the value of the given name in this context, traversing
	   * up the context hierarchy if the value is absent in this context's view.
	   */
	  Context.prototype.lookup = function lookup(name) {
	    var cache = this.cache;
	
	    var value;
	    if (cache.hasOwnProperty(name)) {
	      value = cache[name];
	    } else {
	      var context = this,
	          names,
	          index,
	          lookupHit = false;
	
	      while (context) {
	        if (name.indexOf('.') > 0) {
	          value = context.view;
	          names = name.split('.');
	          index = 0;
	
	          /**
	           * Using the dot notion path in `name`, we descend through the
	           * nested objects.
	           *
	           * To be certain that the lookup has been successful, we have to
	           * check if the last object in the path actually has the property
	           * we are looking for. We store the result in `lookupHit`.
	           *
	           * This is specially necessary for when the value has been set to
	           * `undefined` and we want to avoid looking up parent contexts.
	           **/
	          while (value != null && index < names.length) {
	            if (index === names.length - 1) lookupHit = hasProperty(value, names[index]);
	
	            value = value[names[index++]];
	          }
	        } else {
	          value = context.view[name];
	          lookupHit = hasProperty(context.view, name);
	        }
	
	        if (lookupHit) break;
	
	        context = context.parent;
	      }
	
	      cache[name] = value;
	    }
	
	    if (isFunction(value)) value = value.call(this.view);
	
	    return value;
	  };
	
	  /**
	   * A Writer knows how to take a stream of tokens and render them to a
	   * string, given a context. It also maintains a cache of templates to
	   * avoid the need to parse the same template twice.
	   */
	  function Writer() {
	    this.cache = {};
	  }
	
	  /**
	   * Clears all cached templates in this writer.
	   */
	  Writer.prototype.clearCache = function clearCache() {
	    this.cache = {};
	  };
	
	  /**
	   * Parses and caches the given `template` and returns the array of tokens
	   * that is generated from the parse.
	   */
	  Writer.prototype.parse = function parse(template, tags) {
	    var cache = this.cache;
	    var tokens = cache[template];
	
	    if (tokens == null) tokens = cache[template] = parseTemplate(template, tags);
	
	    return tokens;
	  };
	
	  /**
	   * High-level method that is used to render the given `template` with
	   * the given `view`.
	   *
	   * The optional `partials` argument may be an object that contains the
	   * names and templates of partials that are used in the template. It may
	   * also be a function that is used to load partial templates on the fly
	   * that takes a single argument: the name of the partial.
	   */
	  Writer.prototype.render = function render(template, view, partials) {
	    var tokens = this.parse(template);
	    var context = view instanceof Context ? view : new Context(view);
	    return this.renderTokens(tokens, context, partials, template);
	  };
	
	  /**
	   * Low-level method that renders the given array of `tokens` using
	   * the given `context` and `partials`.
	   *
	   * Note: The `originalTemplate` is only ever used to extract the portion
	   * of the original template that was contained in a higher-order section.
	   * If the template doesn't use higher-order sections, this argument may
	   * be omitted.
	   */
	  Writer.prototype.renderTokens = function renderTokens(tokens, context, partials, originalTemplate) {
	    var buffer = '';
	
	    var token, symbol, value;
	    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
	      value = undefined;
	      token = tokens[i];
	      symbol = token[0];
	
	      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);else if (symbol === '&') value = this.unescapedValue(token, context);else if (symbol === 'name') value = this.escapedValue(token, context);else if (symbol === 'text') value = this.rawValue(token);
	
	      if (value !== undefined) buffer += value;
	    }
	
	    return buffer;
	  };
	
	  Writer.prototype.renderSection = function renderSection(token, context, partials, originalTemplate) {
	    var self = this;
	    var buffer = '';
	    var value = context.lookup(token[1]);
	
	    // This function is used to render an arbitrary template
	    // in the current context by higher-order sections.
	    function subRender(template) {
	      return self.render(template, context, partials);
	    }
	
	    if (!value) return;
	
	    if (isArray(value)) {
	      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
	        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
	      }
	    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' || typeof value === 'string' || typeof value === 'number') {
	      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
	    } else if (isFunction(value)) {
	      if (typeof originalTemplate !== 'string') throw new Error('Cannot use higher-order sections without the original template');
	
	      // Extract the portion of the original template that the section contains.
	      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);
	
	      if (value != null) buffer += value;
	    } else {
	      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
	    }
	    return buffer;
	  };
	
	  Writer.prototype.renderInverted = function renderInverted(token, context, partials, originalTemplate) {
	    var value = context.lookup(token[1]);
	
	    // Use JavaScript's definition of falsy. Include empty arrays.
	    // See https://github.com/janl/mustache.js/issues/186
	    if (!value || isArray(value) && value.length === 0) return this.renderTokens(token[4], context, partials, originalTemplate);
	  };
	
	  Writer.prototype.renderPartial = function renderPartial(token, context, partials) {
	    if (!partials) return;
	
	    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
	    if (value != null) return this.renderTokens(this.parse(value), context, partials, value);
	  };
	
	  Writer.prototype.unescapedValue = function unescapedValue(token, context) {
	    var value = context.lookup(token[1]);
	    if (value != null) return value;
	  };
	
	  Writer.prototype.escapedValue = function escapedValue(token, context) {
	    var value = context.lookup(token[1]);
	    if (value != null) return mustache.escape(value);
	  };
	
	  Writer.prototype.rawValue = function rawValue(token) {
	    return token[1];
	  };
	
	  mustache.name = 'mustache.js';
	  mustache.version = '2.2.1';
	  mustache.tags = ['{{', '}}'];
	
	  // All high-level mustache.* functions use this writer.
	  var defaultWriter = new Writer();
	
	  /**
	   * Clears all cached templates in the default writer.
	   */
	  mustache.clearCache = function clearCache() {
	    return defaultWriter.clearCache();
	  };
	
	  /**
	   * Parses and caches the given template in the default writer and returns the
	   * array of tokens it contains. Doing this ahead of time avoids the need to
	   * parse templates on the fly as they are rendered.
	   */
	  mustache.parse = function parse(template, tags) {
	    return defaultWriter.parse(template, tags);
	  };
	
	  /**
	   * Renders the `template` with the given `view` and `partials` using the
	   * default writer.
	   */
	  mustache.render = function render(template, view, partials) {
	    if (typeof template !== 'string') {
	      throw new TypeError('Invalid template! Template should be a "string" ' + 'but "' + typeStr(template) + '" was given as the first ' + 'argument for mustache#render(template, view, partials)');
	    }
	
	    return defaultWriter.render(template, view, partials);
	  };
	
	  // This is here for backwards compatibility with 0.4.x.,
	  /*eslint-disable */ // eslint wants camel cased function name
	  mustache.to_html = function to_html(template, view, partials, send) {
	    /*eslint-enable*/
	
	    var result = mustache.render(template, view, partials);
	
	    if (isFunction(send)) {
	      send(result);
	    } else {
	      return result;
	    }
	  };
	
	  // Export the escaping function so that the user may override it.
	  // See https://github.com/janl/mustache.js/issues/244
	  mustache.escape = escapeHtml;
	
	  // Export these mainly for testing, but also for advanced usage.
	  mustache.Scanner = Scanner;
	  mustache.Context = Context;
	  mustache.Writer = Writer;
	});

/***/ },
/* 23 */
/*!***********************************************!*\
  !*** ./~/friedjuju/src/json-to-markup/j2m.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/*
	 * This module transforms JSON into markup.
	 *
	 * The following rules specify how the JSON is transformed into markup:
	 * 
	 * 1. A JSON object will be transformed into markup
	 * 2. @ is a prefix for a markup attribute, e.g. @class, @id, @style, etc.
	 * 3. $number is a prefix that specifies the instance number of an element, e.g. $0tr, $1td, etc.
	 * 4. $str is a property whose value is plain text
	 * 5. Arrays are used to replicate elements with a single tagName specified by the property that owns the array, e.g. tr: [ ... ] will create multiple <tr> elements
	 * 6. You can use dot expressions in the property names as a shorthand notation. The elements will be recursively created.
	 *
	 */
	var j2mTransformer = __webpack_require__(/*! ./j2mTransformer.js */ 24),
	    markupPrinter = __webpack_require__(/*! ./markupPrinter.js */ 37),
	    domElementConverter = __webpack_require__(/*! ../vdom/domElementConverter.js */ 35),
	    vdom = __webpack_require__(/*! ../vdom */ 38);
	
	// We need window for the browser-side so that j2m is declared globally on the browser;
	// however, since node.js has no window object, we merely create one here so that the
	// var j2m = window.j2m = { ... } declaration works.
	if (typeof window === 'undefined') {
		window = {};
	}
	
	/* *******************
	 * j2m
	 */
	var j2m = window.j2m = {
		domElementConverter: domElementConverter,
	
		// true = pretty print (indentation and newlines); false = print in terse format (no indentation or new lines)
		prettyPrint: true,
	
		// Execute the transformation of an object into markup
		// obj: The object to transform
		// Returns: The markup string
		execute: function execute(obj) {
			var rootEle = j2mTransformer.transform(obj);
			var fnPrint = this.prettyPrint ? markupPrinter.prettyPrint : markupPrinter.print;
	
			var str = '';
			rootEle.children.forEach(function (ele) {
				str += fnPrint.call(markupPrinter, ele);
			});
			return str;
		},
	
		// Transforms an object into markup and sets the markup into a DOM element
		// obj: The object to transform
		updateDOM: function updateDOM(obj, domElement) {
			vdom.updateDOM(obj, domElement);
		},
	
		// Sets markup (in a string) into a DOM element
		// obj: The object to transform
		updateDOMFromMarkupString: function updateDOMFromMarkupString(markupString, domElement) {
			vdom.updateDOMFromMarkupString(markupString, domElement);
		},
	
		// Generates a markup element from an object
		// obj: The object to transform
		// Returns: The markup element
		generateElement: function generateElement(obj) {
			return j2mTransformer.transform(obj);
		},
	
		// Generates the string markup from an element (that was returned from the j2mTransformer.transform method)
		// Returns: The string that contains the markup
		getMarkupFromElement: function getMarkupFromElement(ele) {
			var fnPrint = this.prettyPrint ? markupPrinter.prettyPrint : markupPrinter.print;
	
			var str = '';
			if (ele.tagName === '__ROOT__') {
				ele.children.forEach(function (eleChild) {
					str += fnPrint.call(markupPrinter, eleChild);
				});
			} else {
				str += fnPrint.call(markupPrinter, ele);
			}
			return str;
		}
	};
	
	if (true) {
		// node.js export (if we're using node.js)
		module.exports = j2m;
	}

/***/ },
/* 24 */
/*!**********************************************************!*\
  !*** ./~/friedjuju/src/json-to-markup/j2mTransformer.js ***!
  \**********************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	__webpack_require__(/*! ./String-Extensions.js */ 25);
	var Attr = __webpack_require__(/*! ./Attr.js */ 26),
	    Element = __webpack_require__(/*! ./Element.js */ 27),
	    objectGraphCreator = __webpack_require__(/*! ./objectGraphCreator */ 28),
	    domElementConverter = __webpack_require__(/*! ../vdom/domElementConverter.js */ 35),
	    strippedDownMarkupParser = __webpack_require__(/*! ../vdom/strippedDownMarkupParser.js */ 36);
	
	/* *******************
	 * j2mTransformer: Used to perform the JSON to markup transformations.
	 * This is the actual worker that is invoked by the j2m.js module.
	 */
	var j2mTransformer = {
		// Transforms an object into markup
		// obj: The object to transform into markup
		// targetEle: [OPTIONAL] The target element to render into
		//				targetEle is modified by this method.
		// Returns: The target element into which the content has been created
		// External Calling Syntax: j2mTransformer.transform(obj)
		// Internal Recursive Calling Syntax: j2mTransformer.transform(obj, targetEle)
		transform: function transform(obj, targetEle) {
			if (!targetEle) {
				targetEle = new Element('__ROOT__');
			}
	
			if (typeof obj === 'string') {
				try {
					// if the string is JSON then parse it
					obj = JSON.parse(obj);
				} catch (e) {
					// since the string is not JSON then transform it as a string
					var ret = j2mTransformer.getStringAsMarkup(obj);
					targetEle.addChild(ret);
					return targetEle;
				}
			} else if (typeof obj === 'number' || obj instanceof Date || typeof obj === 'boolean') {
				var ret = j2mTransformer.getStringAsMarkup(obj.toString());
				targetEle.addChild(ret);
				return targetEle;
			}
	
			j2mTransformer.transformObjectToMarkup(obj, targetEle);
			return targetEle;
		},
	
		// Normalizes a DOM element into an Element instance and wraps it in a __ROOT__ element
		// domElement: The DOM element
		// Returns: The Element instance
		envelopeDOMElement: function envelopeDOMElement(domElement) {
			var rootEle = new Element('__ROOT__');
			if (domElement.innerHTML) {
				var theEle = strippedDownMarkupParser.parse('<nop>' + domElementConverter.convertDOMElementChildrenToXml(domElement) + '</nop>');
	
				theEle.children.forEach(function (child) {
					rootEle.addChild(child);
				});
			}
			return rootEle;
		},
	
		// Performs an identity transformation into markup, i.e. it simply returns the string
		getStringAsMarkup: function getStringAsMarkup(str) {
			return str;
		},
	
		transformObjectToMarkup: function transformObjectToMarkup(obj, targetEle) {
			if (obj instanceof Array) {
				// loop to transform the array elements
				obj.forEach(function (item) {
					j2mTransformer.transform(item, targetEle);
				});
			}
	
			// expand the dot expressions so that we are processing a hierarchical set of objects
			// instead of the dot notated ones
			var newObj = objectGraphCreator.expand(obj);
	
			for (var key in newObj) {
				var val = newObj[key];
				if (key.indexOf('.') > -1) {
					// a dotted expression
					// e.g. 'table.$1tr.td.@colspan': 2,
					// We should never find a key which is a dot expression since they should all have been
					// expanded into a hierarchy in the newObj = objectGraphCreator.expand(obj) statement above.
					throw new Error('Found a dotted expression that was not expanded: ' + key);
				} else if (key[0] === '@') {
					// newObj is an attribute declaration
					// e.g. @colspan': 2
					var attr = j2mTransformer.processAttr(key, val);
					targetEle.addAttr(attr);
				} else if (key === '$str') {
					// val is plain text
					// e.g. '$str': '?age years old'
					targetEle.addChild(val);
				} else if (key[0] === '$') {
					// this is a $number
					// e.g. $2tr
					var numberedElementInfo = j2mTransformer.processNumberedElement(key, val);
					targetEle.addChild(numberedElementInfo.ele, numberedElementInfo.index);
				} else {
					var ele = j2mTransformer.processElement(key, val);
					targetEle.addChild(ele);
				}
			}
		},
	
		processAttr: function processAttr(key, val) {
			return new Attr(key.substr(1), val.toString());
		},
	
		processElementWithPlainTextValue: function processElementWithPlainTextValue(key, val) {
			return new Element(key, val);
		},
	
		// Processes a numbered element
		processNumberedElement: function processNumberedElement(key, val) {
			var tagName = '';
			var index = -1;
			for (var d = 1; d < key.length; d++) {
				if (isNaN(key[d])) {
					tagName = key.substr(d);
					index = parseInt(key.substr(1, d - 1));
					break;
				}
			}
	
			if (tagName === '') {
				throw new Error('Cannot resolve $ in property name: ' + key);
			}
	
			return {
				index: index,
				ele: this.processElement(tagName, val)
			};
		},
	
		// Processes an element
		// key: The tagName of the element to be created
		// val: The definition of the element to be created
		// Returns: An array if val is an array
		// 			An element if val is an object
		//			An element with a single child and no attributes if val is a non-object
		processElement: function processElement(key, val) {
			if (val instanceof Array) {
				// key is the element which is to be replicated across the val elements
				var arr = [];
				val.forEach(function (item) {
					var ele = new Element(key);
	
					j2mTransformer.transform(item, ele);
					// for (var childkey in item) {
					// 	var child = val[childkey];
					// 	j2mTransformer.transform(child, ele);
					// }
	
					arr.push(ele);
				});
				return arr;
			} else if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
				// key is the element whose contents are found within val
				// key = new tagName
				// value = attrs + children
				var ele = new Element(key);
				j2mTransformer.transform(val, ele);
				// for (var childkey in val) {
				// 	var child = val[childkey];
				// 	j2mTransformer.transform(child, ele);
				// }
				return ele;
			} else {
				// key is the element whose plain text value is val.toString()
				return j2mTransformer.processElementWithPlainTextValue(key, val);
			}
		}
	};
	
	if (true) {
		// node.js export (if we're using node.js)
		module.exports = j2mTransformer;
	}

/***/ },
/* 25 */
/*!*************************************************************!*\
  !*** ./~/friedjuju/src/json-to-markup/String-Extensions.js ***!
  \*************************************************************/
/***/ function(module, exports) {

	'use strict';
	
	/* *******************
	 * String extension: repeat(count) -> String
	 * This method will repeat this string for a specified count and return the result, leaving this string unchanged.
	 */
	String.prototype.repeat = function (count) {
		if (count < 1) return '';
		var str = '';
		while (count > 0) {
			str += this;
			count--;
		}
		return str;
	};

/***/ },
/* 26 */
/*!************************************************!*\
  !*** ./~/friedjuju/src/json-to-markup/Attr.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* *******************
	 * Attr
	 */
	function Attr(name, value) {
		this.name = name;
		this.value = value;
	}
	
	Attr.prototype.toString = function () {
		return ' ' + this.name + '="' + this.value + '"';
	};
	
	if (true) {
		// node.js export (if we're using node.js)
		module.exports = Attr;
	}

/***/ },
/* 27 */
/*!***************************************************!*\
  !*** ./~/friedjuju/src/json-to-markup/Element.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Attr = __webpack_require__(/*! ./Attr.js */ 26);
	
	/* *******************
	 * Element
	 */
	// Syntax: ele = new Element(tagName) => creates an element with only the tagName specified
	//		   ele = new Element(tagName, child) => creates an element with a tagName and a child
	function Element(tagName, child) {
		this.tagName = tagName;
		this.attributes = [];
		this.children = [];
	
		if (typeof child !== 'undefined' && child !== null) {
			if (child instanceof Element) {
				this.addChild(child);
			} else {
				this.addChild(child.toString());
			}
		}
	}
	
	Element.prototype.addAttr = function (attr) {
		if (!(attr instanceof Attr)) {
			throw new Error('Element.addAttr must be passed an instance of type: Attr');
		}
	
		this.attributes.push(attr);
	};
	
	Element.prototype.getNumberedChildElementIndex = function (childElementTagName, index) {
		var foundIndex = -1;
		for (var c = 0; c < this.children.length; c++) {
			var child = this.children[c];
			if (child.tagName === childElementTagName) {
				foundIndex++;
				if (foundIndex === index) {
					return c;
				}
			}
		}
		return -1;
	};
	
	// Adds a child element (or plain text)
	// Syntax: this.addChild(childElement) => appends the child element
	//		   this.addChild(childElement, index) => inserts the child element at a specific index
	Element.prototype.addChild = function (childElement, index) {
		if (!(childElement instanceof Element) && !(childElement instanceof Array) && typeof childElement !== 'string') {
			throw new Error('Element.addChild must be passed an Element instance, Array or a string');
		}
	
		if (typeof index === 'undefined') {
			if (childElement instanceof Array) {
				for (var v = 0; v < childElement.length; v++) {
					childElement[v].indexPos = index;
					this.children.push(childElement[v]);
				}
			} else {
				this.children.push(childElement);
			}
		} else {
			if (childElement instanceof Array) {
				// this array does a reverse read because of the resorting to be done later on
				// with elements with index
				for (var v = childElement.length - 1; v >= 0; v--) {
					childElement[v].indexPos = index;
					var childIndex = this.getNumberedChildElementIndex(childElement[v].tagName, index);
					if (childIndex > -1) {
						var oldKids = this.children[childIndex].children,
						    oldAttrs = this.children[childIndex].attributes;
	
						oldKids.forEach(function (item) {
							childElement[v].children.push(item);
						});
						oldAttrs.forEach(function (item) {
							childElement[v].attributes.push(item);
						});
	
						this.children[childIndex] = childElement[v];
					} else {
						this.children.push(childElement[v]);
					}
				}
			} else {
				childElement.indexPos = index;
				var childIndex = this.getNumberedChildElementIndex(childElement.tagName, index);
				if (childIndex > -1) {
					var oldKids = this.children[childIndex].children,
					    oldAttrs = this.children[childIndex].attributes;
	
					oldKids.forEach(function (item) {
						childElement.children.push(item);
					});
					oldAttrs.forEach(function (item) {
						childElement.attributes.push(item);
					});
	
					this.children[childIndex] = childElement;
				} else {
					this.children.push(childElement);
				}
			}
		}
	
		this.sortChildren();
	};
	
	Element.prototype.sortChildren = function () {
		var numberedSets = {};
		for (var c = this.children.length - 1; c >= 0; c--) {
			var child = this.children[c];
			if (typeof child.indexPos === 'number') {
				var arr = numberedSets[child.tagName];
				if (!arr) {
					numberedSets[child.tagName] = arr = [];
				}
	
				arr.push({
					actualIndex: c,
					ele: child
				});
	
				// temporarily blank out the element in the children array
				// so that the elements that match the tagName and have the indexPos
				// can be reordered
				this.children[c] = null;
			}
		}
	
		for (var tagName in numberedSets) {
			var arr = numberedSets[tagName];
			arr.sort(function (a, b) {
				return a.ele.indexPos - b.ele.indexPos;
			});
	
			var indexes = [];
			arr.forEach(function (item) {
				indexes.push(item.actualIndex);
			});
	
			indexes.sort();
	
			for (var i = 0; i < indexes.length; i++) {
				var child = arr[i].ele;
				var actualIndex = indexes[i];
				this.children[actualIndex] = child;
			}
		}
	};
	
	Element.prototype.toString = function (indent) {
		var isIndentable = typeof indent === 'number';
		var nextIndent = undefined;
		var indentStr = '';
		if (isIndentable) {
			indentStr = '  '.repeat(indent);
			nextIndent = indent + 1;
		}
	
		var str = indentStr + '<' + this.tagName;
	
		this.attributes.forEach(function (attr) {
			str += attr.toString();
		});
	
		str += '>';
	
		if (isIndentable && this.children.length > 0 && this.children[0] instanceof Element) {
			// first child is an element so break to newline
			str += '\n';
		}
	
		this.children.forEach(function (child) {
			str += child.toString(nextIndent);
		});
	
		if (isIndentable && this.children.length > 0 && this.children[0] instanceof Element) {
			// first child is an element so indent before the end tag
			str += indentStr;
		}
	
		str += '</' + this.tagName + '>';
	
		if (isIndentable) {
			str += '\n';
		}
	
		return str;
	};
	
	if (true) {
		// node.js export (if we're using node.js)
		module.exports = Element;
	}

/***/ },
/* 28 */
/*!**************************************************************!*\
  !*** ./~/friedjuju/src/json-to-markup/objectGraphCreator.js ***!
  \**************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/*
	 * This module performs object creation based on a dot expression (Usage 1)
	 */
	var ep = __webpack_require__(/*! ../expression-parser/ep.js */ 29);
	var astEmitter = __webpack_require__(/*! ../expression-parser/astEmitter.js */ 34);
	
	var objectGraphCreatorImpl = {
		// Creates contained objects within an object based on an expression (that conforms to the Usage 1 grammar)
		// expr: The expression
		// obj: The object in which to create the contained objects. This object may be modified by this method.
		// value: The value to set for the object
		// Returns: The keys of the objects which are created based on the expression (which taken together, evaluate to the original expression), else undefined
		create: function create(expr, obj, value) {
			var tokenRootExpr = ep.parseExtended(expr);
	
			var context = undefined;
			var key = undefined,
			    lastContext = undefined;
			var keyIndex = undefined;
			var arrKeys = [];
			astEmitter.subscribe(['ExpressionPiece'], function (token) {
				if (!context) {
					context = obj;
				}
				var firstChild = token.children[0];
	
				if (firstChild.id === 'NumberPrefixedElement') {
					key = firstChild.value;
				} else if (firstChild.id === 'Attribute') {
					key = firstChild.value;
				} else if (firstChild.id === 'Element') {
					if (firstChild.children.length > 1) {
						// has ElementTail
						key = firstChild.children[0].value;
						var elementTail = firstChild.children[1];
						var ai = elementTail.children[0];
						if (ai.id === 'ArrayIndex') {
							keyIndex = Number(ai.children[1].value);
						} else {
							throw new Error('You can only index arrays (ArrayIndex) and cannot use bounded element or attribute expressions for object graph creation | ai.id = ' + ai.id);
						}
					} else {
						// no ElementTail
						key = firstChild.value;
						keyIndex = undefined;
					}
				} else if (firstChild.id === 'StringElement') {
					context.$str = value;
					return;
				} else {
					throw new Error('Invalid ExpressionPiece for object graph creation | token.id = ' + token.id);
				}
	
				var childObj = {};
				arrKeys.push(key);
	
				if (!context[key]) {
					// create the object since it does not exist
					if (typeof keyIndex !== 'undefined') {
						// indexed element
						context[key] = [];
						context[key][keyIndex] = childObj;
					} else {
						// no index
						context[key] = childObj;
					}
				} else {
					// get the object since it exists
					if (typeof keyIndex !== 'undefined') {
						// indexed element
						var theObj = context[key];
						if (!(theObj instanceof Array)) {
							theObj = [theObj];
						}
						childObj = theObj[keyIndex];
						if (!childObj) {
							childObj = theObj[keyIndex] = {};
						}
					} else {
						// no index
						childObj = context[key];
					}
				}
	
				// remember this context as the last one
				lastContext = context;
	
				// set the context to the current object in the creation operation!
				context = childObj;
			});
			astEmitter.traverse(tokenRootExpr.token);
	
			// if we have a last context and a key then set the value!
			if (lastContext && key) {
				if (typeof keyIndex === 'undefined') {
					lastContext[key] = value;
				} else {
					lastContext[key][keyIndex] = value;
				}
				return arrKeys;
			}
	
			return undefined;
		},
	
		getPair: function getPair(pairs, keyToDelete) {
			for (var c = 0; c < pairs.length; c++) {
				var pair = pairs[c];
				if (pair.keyToDelete === keyToDelete) {
					return pair;
				}
			}
			return undefined;
		}
	};
	
	var objectGraphCreator = {
		// Expands an object based on dotted expressions (Usage 1).
		// This method is NOT recursive so only the immediate properties of the object are processed!
		// The object itself is left unchanged and the modified version is returned.
		// obj: The object
		// Returns: The modified object
		expand: function expand(obj) {
			var cachedObjProperties = {};
			var pairs = [];
			for (var key in obj) {
				// cache the property
				cachedObjProperties[key] = obj[key];
	
				if (key.indexOf('.') > -1) {
					var val = obj[key];
	
					// create the contained objects as declared in the key
					var arrKeys = objectGraphCreatorImpl.create(key, obj, val);
					if (arrKeys) {
						pairs.push({
							keyToDelete: key,
							keyToAdd: arrKeys[0]
						});
					}
				}
			}
	
			var newObj = {};
	
			for (var key in obj) {
				var pair = objectGraphCreatorImpl.getPair(pairs, key);
				if (!pair) {
					// no matching pair found so copy over the property as is
					newObj[key] = obj[key];
				} else if (typeof newObj[pair.keyToAdd] === 'undefined') {
					// key === keyToDelete, so replace key with keyToAdd and set the placeholder!
					// Keep in mind that the property will be written again where there is no pair.
					newObj[pair.keyToAdd] = "__placeholder__";
				}
			}
	
			pairs.forEach(function (pair) {
				// delete the newly added key from the original object!
				delete obj[pair.keyToAdd];
			});
	
			// restore properties of obj that were cached
			for (var key in cachedObjProperties) {
				obj[key] = cachedObjProperties[key];
			}
	
			return newObj;
		}
	};
	
	if (true) {
		// node.js export (if we're using node.js)
		module.exports = objectGraphCreator;
	}

/***/ },
/* 29 */
/*!*************************************************!*\
  !*** ./~/friedjuju/src/expression-parser/ep.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/*
	 * This module is the parser for the dot expressions used in the j2m system.
	 */
	var Token = __webpack_require__(/*! ./Token.js */ 30),
	    parserUtilsRestricted = __webpack_require__(/*! ./parserUtilsRestricted.js */ 31),
	    parserUtilsExtended = __webpack_require__(/*! ./parserUtilsExtended.js */ 33);
	
	// this is here to add the declarations of static token enums:
	// e.g. Token.Dot
	for (var key in parserUtilsExtended) {
		Token[key] = key;
	}
	
	var parser = {
		// Parses a string according to the extended grammar (Usages 2 and 3)
		// str: The string to parse
		// Returns: The tokens
		/*
	  * Grammar for Usages 2 and 3:
	 		Expression := ( ExpressionPiece ( Dot ExpressionPiece )* )
	 	Dot := '.'
	 	ExpressionPiece := Wildcard | NumberPrefixedElement | Attribute | Element | StringElement
	 	Attribute := ( '@' Char+ )
	 	BoundedAttributeExpression := '[' Attribute '=' Char+ ']'
	 	BoundedAttributeDeclaration := '[' Attribute ']'
	 	BoundedElementExpression := '[' ElementName '=' Char+ ']'
	 	BoundedElementDeclaration := '[' ElementName ']'
	 	ArrayIndex := '[' ( Digit+ | '*' ) ']'
	 	Element := ElementName ElementTail?
	 	ElementName := (Char & !Digit) Char*
	 	ElementTail := ( BoundedAttributeExpression | BoundedAttributeDeclaration | BoundedElementExpression | BoundedElementDeclaration | ArrayIndex )+
	 	NumberPrefixedElement := ( '$' Digit+ Element )
	 	StringElement := '$str'
	 	Digit := ( '0' - '9' )
	 	Char := ( !Dot & !'=' & !'@' & !'[' & !']' & !Wildcard)
	 	Wildcard := '*' ElementTail?
	 	SingleObjectPlaceholder := '?' ElementTail?
	  */
		parseExtended: function parseExtended(str) {
			var index = 0;
			var tokenExpression = parserUtilsExtended.Expression(str, index);
			if (tokenExpression.newIndex < str.length) {
				throw new Error('Unparsed characters exist at the end of the expression: ' + str.substr(tokenExpression.newIndex));
			}
			return tokenExpression;
		},
	
		// Parses a string according to the restricted grammar (Usage 1 only)
		// str: The string to parse
		// Returns: The tokens
		/*
	  * Grammar for Usage 1:
	 		Expression := ( ExpressionPiece ( Dot ExpressionPiece )* )
	 	Dot := '.'
	 	ExpressionPiece := NumberPrefixedElement | Attribute | Element | StringElement
	 	Attribute := ( '@' Usage1Char+ )
	 	Element := Usage1Char+
	 	NumberPrefixedElement := ( '$' Digit+ Element )
	 	StringElement := '$str'
	 	Digit := ( '0' - '9' )
	 	Usage1Char := ( !Dot & !Wildcard & !SingleObjectPlaceholder & !'=' & !'@' & !'[' & !']')
	 	Wildcard := '*'
	 	SingleObjectPlaceholder := '?'	
	  */
		parseRestricted: function parseRestricted(str) {
			var index = 0;
			var tokenExpression = parserUtilsRestricted.Expression(str, index);
			if (tokenExpression.newIndex < str.length) {
				throw new Error('Unparsed characters exist at the end of the expression: ' + str.substr(tokenExpression.newIndex));
			}
			return tokenExpression;
		}
	};
	
	if (true) {
		// node.js export (if we're using node.js)
		module.exports = parser;
	}

/***/ },
/* 30 */
/*!****************************************************!*\
  !*** ./~/friedjuju/src/expression-parser/Token.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* *******************
	 * Token: A token
	 */
	
	// The constructor of a Token
	// id: The token id
	// value: The value of the token (a string)
	// index: The index at which the token is found in the source string
	// children: [OPTIONAL] A child or multiple children tokens to be added to this token
	function Token(id, value, index, children) {
		this.id = id;
		this.value = value;
		this.index = index;
		this.children = [];
	
		if (children) {
			if (children instanceof Array) {
				for (var c = 0; c < children.length; c++) {
					this.children.push(children[c]);
				}
			} else if (children instanceof Token) {
				this.children.push(children);
			} else {
				throw new Error('Invalid children passed into Token constructor. Token #' + this.id);
			}
		}
	}
	
	// Adds a child token to this token
	// childToken: The child token
	Token.prototype.addChild = function (childToken) {
		if (!(childToken instanceof Token)) {
			throw new Error('Invalid Token being added to Token #' + this.id + '\n-> childToken = ' + childToken.toString());
		}
		this.children.push(childToken);
	};
	
	// The static definition of Literal
	Token.Literal = 'Literal';
	
	if (true) {
		// node.js export (if we're using node.js)
		module.exports = Token;
	}

/***/ },
/* 31 */
/*!********************************************************************!*\
  !*** ./~/friedjuju/src/expression-parser/parserUtilsRestricted.js ***!
  \********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Token = __webpack_require__(/*! ./Token.js */ 30),
	    parserCommonFunctions = __webpack_require__(/*! ./parserCommonFunctions.js */ 32);
	
	/* *******************
	 * parserUtilsRestricted: The production implementations for the restricted grammar for Usage 1
	 */
	var parserUtilsRestricted = {
		// Expression := ( ExpressionPiece ( Dot ExpressionPiece )* )
		Expression: function Expression(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(Token.Expression, '', index);
	
			// ExpressionPiece
			var retExpressionPiece = this.ExpressionPiece(str, index);
			if (!retExpressionPiece) {
				return undefined;
			}
	
			index = retExpressionPiece.newIndex;
			token.addChild(retExpressionPiece.token);
	
			while (index < str.length) {
				// ( Dot ExpressionPiece )*
				var preDotExprIndex = index;
				var dotExprTokens = [];
	
				// Dot
				var retDot = this.Dot(str, index);
				if (retDot) {
					index = retDot.newIndex;
					dotExprTokens.push(retDot.token);
	
					// ExpressionPiece
					retExpressionPiece = this.ExpressionPiece(str, index);
					if (retExpressionPiece) {
						index = retExpressionPiece.newIndex;
						dotExprTokens.push(retExpressionPiece.token);
					}
				} else {
					break;
				}
	
				if (dotExprTokens) {
					for (var c = 0; c < dotExprTokens.length; c++) {
						token.addChild(dotExprTokens[c]);
					}
				} else {
					index = preDotExprIndex;
					break;
				}
			}
	
			if (token.children.length > 0) {
				token.value = str.substring(originalIndex, index);
				return {
					newIndex: index,
					token: token
				};
			}
			return undefined;
		},
	
		// Dot := '.'
		Dot: function Dot(str, index) {
			return parserCommonFunctions.exactlyText(str, index, '.', 'Dot');
		},
	
		// ExpressionPiece := NumberPrefixedElement | Attribute | Element | StringElement
		ExpressionPiece: function ExpressionPiece(str, index) {
			return parserCommonFunctions.or(str, index, ['NumberPrefixedElement', 'Attribute', 'Element', 'StringElement'], this, 'ExpressionPiece');
		},
	
		// Attribute := ( '@' Usage1Char+ )
		Attribute: function Attribute(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var matchAttrPrefix = parserCommonFunctions.checkMatch(str, '@', index);
			if (matchAttrPrefix) {
				index = matchAttrPrefix.newIndex;
				var retUsage1Chars = parserCommonFunctions.repeat1Plus(str, index, 'Usage1Char', this);
				if (retUsage1Chars) {
					index = retUsage1Chars.newIndex;
					return {
						newIndex: retUsage1Chars.newIndex,
						token: new Token(Token.Attribute, str.substring(originalIndex, index), originalIndex, [matchAttrPrefix.token, retUsage1Chars.token])
					};
				}
			}
	
			return undefined;
		},
	
		// Element := Usage1Char+
		Element: function Element(str, index) {
			return parserCommonFunctions.onlyRepeat1Plus(str, index, 'Usage1Char', this, 'Element');
		},
	
		// NumberPrefixedElement := ( '$' Digit+ Element )
		NumberPrefixedElement: function NumberPrefixedElement(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(Token.NumberPrefixedElement, '', index);
	
			// '$'
			var matchDollarPrefix = parserCommonFunctions.checkMatch(str, '$', index);
			if (matchDollarPrefix) {
				token.addChild(matchDollarPrefix.token);
				index = matchDollarPrefix.newIndex;
	
				// Digit+
				var retDigits = parserCommonFunctions.repeat1Plus(str, index, 'Digit', this);
				if (retDigits) {
					token.addChild(retDigits.token);
					index = retDigits.newIndex;
	
					// Element
					var retElement = this.Element(str, index);
					if (retElement) {
						token.addChild(retElement.token);
						index = retElement.newIndex;
	
						token.value = str.substring(originalIndex, index);
						return {
							newIndex: index,
							token: token
						};
					}
				}
			}
	
			return undefined;
		},
	
		// StringElement := '$str'
		StringElement: function StringElement(str, index) {
			return parserCommonFunctions.exactlyText(str, index, '$str', 'StringElement');
		},
	
		// Digit := ( '0' - '9' )
		Digit: function Digit(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			for (var num = 0; num <= 9; num++) {
				var match = parserCommonFunctions.checkMatch(str, num.toString(), index);
				if (match) {
					return {
						newIndex: match.newIndex,
						token: new Token(Token.Digit, str.substr(index, 1), index)
					};
				}
			}
			return undefined;
		},
	
		// Usage1Char := ( !Dot & !Wildcard & !SingleObjectPlaceholder & !'=' & !'@' & !'[' & !']')
		Usage1Char: function Usage1Char(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var ret = this.Dot(str, index);
			if (ret) {
				return undefined;
			}
			ret = this.Wildcard(str, index);
			if (ret) {
				return undefined;
			}
			ret = this.SingleObjectPlaceholder(str, index);
			if (ret) {
				return undefined;
			}
	
			var succeeded = true;
			['=', '@', '[', ']'].forEach(function (ch) {
				ret = parserCommonFunctions.checkMatch(str, ch, index);
				if (ret) {
					succeeded = false;
				}
			});
	
			if (!succeeded) {
				return undefined;
			}
	
			return {
				newIndex: index + 1,
				token: new Token(Token.Usage1Char, str.substr(index, 1), index)
			};
		},
	
		// Wildcard := '*'
		Wildcard: function Wildcard(str, index) {
			return parserCommonFunctions.exactlyText(str, index, '*', 'Wildcard');
		},
	
		// SingleObjectPlaceholder := '?'
		SingleObjectPlaceholder: function SingleObjectPlaceholder(str, index) {
			return parserCommonFunctions.exactlyText(str, index, '?', 'SingleObjectPlaceholder');
		}
	};
	
	if (true) {
		// node.js export (if we're using node.js)
		module.exports = parserUtilsRestricted;
	}

/***/ },
/* 32 */
/*!********************************************************************!*\
  !*** ./~/friedjuju/src/expression-parser/parserCommonFunctions.js ***!
  \********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Token = __webpack_require__(/*! ./Token.js */ 30);
	
	/* *******************
	 * parserCommonFunctions: The common functions used by all parsers
	 */
	var parserCommonFunctions = {
		// Performs a text match between the substring in str at index against match
		// str: The string in which to test for a match
		// match: The text to match against
		// index: The index at which to find the substring to match with in str
		// Returns: The { newIndex: number, token: Token } result if there is a match OR undefined
		checkMatch: function checkMatch(str, match, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			if (str.substr(index, match.length) === match) {
				return {
					newIndex: index + match.length,
					token: new Token(Token.Literal, match, index)
				};
			}
	
			return undefined;
		},
	
		// Checks to make sure that literal text is matched against and returns a token
		// str: The string to process
		// index: The index at which to start the test
		// text: The text to match against
		// tokenToBeReturned: The name of the token by which the resulting token will be labeled
		// Returns: The { newIndex: number, token: Token } result if there is a match OR undefined
		exactlyText: function exactlyText(str, index, text, tokenToBeReturned) {
			if (index >= str.length) {
				return undefined;
			}
	
			var ret = this.checkMatch(str, text, index);
			if (!ret) {
				return undefined;
			}
	
			return {
				newIndex: index + text.length,
				token: new Token(tokenToBeReturned, str.substr(index, text.length), index)
			};
		},
	
		// Repeats a production in a ()* fashion, i.e. repeat 0 or more times
		// str: The string to process
		// index: The index at which to start the repetitiom
		// productionName: The name of the production
		// ctxt: The object that contains the production functions
		// Returns: The { newIndex: number, token: Token } result if there is a match OR undefined
		repeat0Plus: function repeat0Plus(str, index, productionName, ctxt) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(Token[productionName], '', index);
	
			while (index < str.length) {
				var ret = ctxt[productionName](str, index);
				if (ret) {
					token.addChild(ret.token);
					index = ret.newIndex;
				} else {
					break;
				}
			}
	
			token.value = str.substring(originalIndex, index);
			return {
				newIndex: index,
				token: token
			};
		},
	
		// Repeats a production in a ()+ fashion, i.e. repeat 1 or more times
		// str: The string to process
		// index: The index at which to start the repetitiom
		// productionName: The name of the production
		// ctxt: The object that contains the production functions
		// Returns: The { newIndex: number, token: Token } result if there is a match OR undefined
		repeat1Plus: function repeat1Plus(str, index, productionName, ctxt) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(Token[productionName], '', index);
			var ret = ctxt[productionName](str, index);
			if (!ret) {
				return undefined;
			}
	
			token.addChild(ret.token);
			index = ret.newIndex;
	
			while (index < str.length) {
				ret = ctxt[productionName](str, index);
				if (ret) {
					token.addChild(ret.token);
					index = ret.newIndex;
				} else {
					break;
				}
			}
	
			token.value = str.substring(originalIndex, index);
			return {
				newIndex: index,
				token: token
			};
		},
	
		// Repeats a production in a ()+ fashion, i.e. repeat 1 or more times.
		// This must be used only when the production is of the form:
		//	A := B+
		//		i.e. where the only factor of A is B which can repeat 1 or more times.
		//
		// str: The string to process
		// index: The index at which to start the repetitiom
		// productionName: The name of the production (i.e. B in the example above)
		// ctxt: The object that contains the production functions
		// tokenToBeReturned: The name of the token by which the resulting token will be labeled (i.e. A in the example above)
		// Returns: The { newIndex: number, token: Token } result if there is a match OR undefined
		onlyRepeat1Plus: function onlyRepeat1Plus(str, index, productionName, ctxt, tokenToBeReturned) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(tokenToBeReturned, '', index);
			var ret = this.repeat1Plus(str, index, productionName, ctxt);
			if (ret) {
				index = ret.newIndex;
				token.addChild(ret.token);
			}
	
			if (token.children.length > 0) {
				token.value = str.substring(originalIndex, index);
				return {
					newIndex: index,
					token: token
				};
			}
	
			return undefined;
		},
	
		// Repeats a production in a ()* fashion, i.e. repeat 1 or more times.
		// This must be used only when the production is of the form:
		//	A := B*
		//		i.e. where the only factor of A is B which can repeat 0 or more times.
		//
		// str: The string to process
		// index: The index at which to start the repetitiom
		// productionName: The name of the production (i.e. B in the example above)
		// ctxt: The object that contains the production functions
		// tokenToBeReturned: The name of the token by which the resulting token will be labeled (i.e. A in the example above)
		// Returns: The { newIndex: number, token: Token } result if there is a match OR undefined
		onlyRepeat0Plus: function onlyRepeat0Plus(str, index, productionName, ctxt, tokenToBeReturned) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(tokenToBeReturned, '', index);
			var ret = this.repeat0Plus(str, index, productionName, ctxt);
			if (ret) {
				index = ret.newIndex;
				token.addChild(ret.token);
			}
	
			if (token.children.length > 0) {
				token.value = str.substring(originalIndex, index);
				return {
					newIndex: index,
					token: token
				};
			}
	
			return undefined;
		},
	
		// Tests multiple productions to find the one that fits the substring at a specified index
		// str: The string to process
		// index: The index at which to start the test
		// productionNameArray: An array of production names
		// ctxt: The object that contains the production functions
		// tokenToBeReturned: The name of the token by which the resulting token will be labeled
		// Returns: The { newIndex: number, token: Token } result if there is a match OR undefined
		or: function or(str, index, productionNameArray, ctxt, tokenToBeReturned) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var tempToken = undefined,
			    tempNewIndex = -1;
			for (var c = 0; c < productionNameArray.length; c++) {
				var productionName = productionNameArray[c];
	
				var ret = ctxt[productionName](str, index);
				if (ret) {
					if (tempNewIndex < ret.newIndex) {
						tempToken = ret.token;
						tempNewIndex = ret.newIndex;
					}
				}
			}
	
			if (tempToken) {
				index = tempNewIndex;
	
				var token = new Token(tokenToBeReturned, str.substring(originalIndex, index), index, tempToken);
				return {
					newIndex: index,
					token: token
				};
			} else {
				return undefined;
			}
		},
	
		// Executes a single production
		// str: The string to process
		// index: The index at which to start the test
		// productionName: The name of the production
		// ctxt: The object that contains the production functions
		// tokenToBeReturned: The name of the token by which the resulting token will be labeled
		// Returns: The { newIndex: number, token: Token } result if there is a match OR undefined
		exactlyOne: function exactlyOne(str, index, productionName, ctxt, tokenToBeReturned) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(tokenToBeReturned, '', index);
	
			var ret = ctxt[productionName](str, index);
			if (ret) {
				index = ret.newIndex;
				token.addChild(ret.token);
	
				token.value = str.substring(originalIndex, index);
				return {
					newIndex: index,
					token: token
				};
			}
	
			return undefined;
		},
	
		// Executes a sequence of productions
		// str: The string to process
		// index: The index at which to start the test
		// productionNameArray: An array of production names
		// ctxt: The object that contains the production functions
		// tokenToBeReturned: The name of the token by which the resulting token will be labeled
		// Returns: The { newIndex: number, token: Token } result if there is a match OR undefined
		seq: function seq(str, index, productionNameArray, ctxt, tokenToBeReturned) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(tokenToBeReturned, '', index);
	
			for (var c = 0; c < productionNameArray.length; c++) {
				var productionName = productionNameArray[c];
				var ret = ctxt[productionName](str, index);
				if (!ret) {
					return undefined;
				}
	
				index = ret.newIndex;
				token.addChild(ret.token);
			}
	
			if (token.children.length > 0) {
				token.value = str.substring(originalIndex, index);
				return {
					newIndex: index,
					token: token
				};
			}
	
			return undefined;
		}
	};
	
	if (true) {
		// node.js export (if we're using node.js)
		module.exports = parserCommonFunctions;
	}

/***/ },
/* 33 */
/*!******************************************************************!*\
  !*** ./~/friedjuju/src/expression-parser/parserUtilsExtended.js ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Token = __webpack_require__(/*! ./Token.js */ 30),
	    parserCommonFunctions = __webpack_require__(/*! ./parserCommonFunctions.js */ 32),
	    parserUtilsRestricted = __webpack_require__(/*! ./parserUtilsRestricted.js */ 31);
	
	/* *******************
	 * parserUtilsExtended: The production implementations for the extended grammar for Usages 2 and 3
	 * Please note that parserUtilsExtended will contain the following new and overridden methods from parserUtilsRestricted.
	 */
	var parserUtilsExtended = {
		// ExpressionPiece := Wildcard | SingleObjectPlaceholder | NumberPrefixedElement | Attribute | Element | StringElement
		ExpressionPiece: function ExpressionPiece(str, index) {
			return parserCommonFunctions.or(str, index, ['Wildcard', 'SingleObjectPlaceholder', 'NumberPrefixedElement', 'Attribute', 'Element', 'StringElement'], this, 'ExpressionPiece');
		},
	
		// Override
		// Attribute := ( '@' Char+ )
		Attribute: function Attribute(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var matchAttrPrefix = parserCommonFunctions.checkMatch(str, '@', index);
			if (matchAttrPrefix) {
				index = matchAttrPrefix.newIndex;
				var retChars = parserCommonFunctions.repeat1Plus(str, index, 'Char', this);
				if (retChars) {
					index = retChars.newIndex;
					return {
						newIndex: retChars.newIndex,
						token: new Token(Token.Attribute, str.substring(originalIndex, index), originalIndex, [matchAttrPrefix.token, retChars.token])
					};
				}
			}
	
			return undefined;
		},
	
		// BoundedAttributeExpression := '[' Attribute '=' Char+ ']'
		BoundedAttributeExpression: function BoundedAttributeExpression(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(Token.BoundedAttributeExpression, '', index);
	
			var matchBracketOpen = parserCommonFunctions.checkMatch(str, '[', index);
			if (matchBracketOpen) {
				index = matchBracketOpen.newIndex;
				token.addChild(matchBracketOpen.token);
	
				var retAttribute = this.Attribute(str, index);
				if (retAttribute) {
					index = retAttribute.newIndex;
					token.addChild(retAttribute.token);
	
					var matchEq = parserCommonFunctions.checkMatch(str, '=', index);
					if (matchEq) {
						index = matchEq.newIndex;
						token.addChild(matchEq.token);
	
						var retChars = parserCommonFunctions.repeat1Plus(str, index, 'Char', this);
						if (retChars) {
							index = retChars.newIndex;
							token.addChild(retChars.token);
	
							var matchBracketClose = parserCommonFunctions.checkMatch(str, ']', index);
							if (matchBracketClose) {
								index = matchBracketClose.newIndex;
								token.addChild(matchBracketClose.token);
	
								token.value = str.substring(originalIndex, index);
								return {
									newIndex: index,
									token: token
								};
							}
						}
					}
				}
			}
	
			return undefined;
		},
	
		// BoundedAttributeDeclaration := '[' Attribute ']'
		BoundedAttributeDeclaration: function BoundedAttributeDeclaration(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(Token.BoundedAttributeDeclaration, '', index);
	
			var matchBracketOpen = parserCommonFunctions.checkMatch(str, '[', index);
			if (matchBracketOpen) {
				index = matchBracketOpen.newIndex;
				token.addChild(matchBracketOpen.token);
	
				var retAttribute = this.Attribute(str, index);
				if (retAttribute) {
					index = retAttribute.newIndex;
					token.addChild(retAttribute.token);
	
					var matchBracketClose = parserCommonFunctions.checkMatch(str, ']', index);
					if (matchBracketClose) {
						index = matchBracketClose.newIndex;
						token.addChild(matchBracketClose.token);
	
						token.value = str.substring(originalIndex, index);
						return {
							newIndex: index,
							token: token
						};
					}
				}
			}
	
			return undefined;
		},
	
		// BoundedElementExpression := '[' ElementName '=' Char+ ']'
		BoundedElementExpression: function BoundedElementExpression(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(Token.BoundedElementExpression, '', index);
	
			var matchBracketOpen = parserCommonFunctions.checkMatch(str, '[', index);
			if (matchBracketOpen) {
				index = matchBracketOpen.newIndex;
				token.addChild(matchBracketOpen.token);
	
				var retAttribute = this.ElementName(str, index);
				if (retAttribute) {
					index = retAttribute.newIndex;
					token.addChild(retAttribute.token);
	
					var matchEq = parserCommonFunctions.checkMatch(str, '=', index);
					if (matchEq) {
						index = matchEq.newIndex;
						token.addChild(matchEq.token);
	
						var retChars = parserCommonFunctions.repeat1Plus(str, index, 'Char', this);
						if (retChars) {
							index = retChars.newIndex;
							token.addChild(retChars.token);
	
							var matchBracketClose = parserCommonFunctions.checkMatch(str, ']', index);
							if (matchBracketClose) {
								index = matchBracketClose.newIndex;
								token.addChild(matchBracketClose.token);
	
								token.value = str.substring(originalIndex, index);
								return {
									newIndex: index,
									token: token
								};
							}
						}
					}
				}
			}
	
			return undefined;
		},
	
		// BoundedElementDeclaration := '[' ElementName ']'
		BoundedElementDeclaration: function BoundedElementDeclaration(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(Token.BoundedElementDeclaration, '', index);
	
			var matchBracketOpen = parserCommonFunctions.checkMatch(str, '[', index);
			if (matchBracketOpen) {
				index = matchBracketOpen.newIndex;
				token.addChild(matchBracketOpen.token);
	
				var retAttribute = this.ElementName(str, index);
				if (retAttribute) {
					index = retAttribute.newIndex;
					token.addChild(retAttribute.token);
	
					var matchBracketClose = parserCommonFunctions.checkMatch(str, ']', index);
					if (matchBracketClose) {
						index = matchBracketClose.newIndex;
						token.addChild(matchBracketClose.token);
	
						token.value = str.substring(originalIndex, index);
						return {
							newIndex: index,
							token: token
						};
					}
				}
			}
	
			return undefined;
		},
	
		// ArrayIndex := '[' ( Digit+ | '*' ) ']'
		ArrayIndex: function ArrayIndex(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(Token.ArrayIndex, '', index);
	
			var matchBracketOpen = parserCommonFunctions.checkMatch(str, '[', index);
			if (matchBracketOpen) {
				index = matchBracketOpen.newIndex;
				token.addChild(matchBracketOpen.token);
	
				var matchStar = parserCommonFunctions.checkMatch(str, '*', index);
				if (matchStar) {
					index = matchStar.newIndex;
					token.addChild(matchStar.token);
	
					var matchBracketClose = parserCommonFunctions.checkMatch(str, ']', index);
					if (matchBracketClose) {
						index = matchBracketClose.newIndex;
						token.addChild(matchBracketClose.token);
	
						token.value = str.substring(originalIndex, index);
						return {
							newIndex: index,
							token: token
						};
					}
	
					return undefined;
				}
	
				var retDigits = parserCommonFunctions.repeat1Plus(str, index, 'Digit', this);
				if (retDigits) {
					index = retDigits.newIndex;
					token.addChild(retDigits.token);
	
					var matchBracketClose = parserCommonFunctions.checkMatch(str, ']', index);
					if (matchBracketClose) {
						index = matchBracketClose.newIndex;
						token.addChild(matchBracketClose.token);
	
						token.value = str.substring(originalIndex, index);
						return {
							newIndex: index,
							token: token
						};
					}
				}
			}
	
			return undefined;
		},
	
		// Override
		// Element := ElementName ElementTail?
		Element: function Element(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(Token.Element, '', index);
	
			// ElementName
			var retElementName = this.ElementName(str, index);
			if (retElementName) {
				index = retElementName.newIndex;
				token.addChild(retElementName.token);
	
				// ElementTail?
				var retElementTail = this.ElementTail(str, index);
				if (retElementTail) {
					index = retElementTail.newIndex;
					token.addChild(retElementTail.token);
				}
			} else {
				return undefined;
			}
	
			token.value = str.substring(originalIndex, index);
			return {
				newIndex: index,
				token: token
			};
		},
	
		// ElementName := (Char & !Digit) Char*
		ElementName: function ElementName(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(Token.ElementName, '', index);
	
			var ret1stChar = this.Char(str, index);
			var ret1stDigit = this.Digit(str, index);
			if (ret1stDigit || !ret1stChar) {
				return undefined;
			}
	
			var retChars = parserCommonFunctions.repeat1Plus(str, index, 'Char', this);
			if (retChars) {
				index = retChars.newIndex;
				token.addChild(retChars.token);
			} else {
				return undefined;
			}
	
			token.value = str.substring(originalIndex, index);
			return {
				newIndex: index,
				token: token
			};
		},
	
		// ElementTail := ( BoundedAttributeExpression | BoundedAttributeDeclaration | BoundedElementExpression | BoundedElementDeclaration | ArrayIndex )+
		ElementTail: function ElementTail(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(Token.ElementTail, '', index);
	
			while (index < str.length) {
				var tempToken = undefined,
				    tempNewIndex = -1;
				var retBoundedAttributeExpression = this.BoundedAttributeExpression(str, index);
				if (retBoundedAttributeExpression) {
					tempToken = retBoundedAttributeExpression.token;
					tempNewIndex = retBoundedAttributeExpression.newIndex;
				}
	
				var retBoundedAttributeDeclaration = this.BoundedAttributeDeclaration(str, index);
				if (retBoundedAttributeDeclaration) {
					if (tempNewIndex < retBoundedAttributeDeclaration.newIndex) {
						tempToken = retBoundedAttributeDeclaration.token;
						tempNewIndex = retBoundedAttributeDeclaration.newIndex;
					}
				}
	
				var retBoundedElementExpression = this.BoundedElementExpression(str, index);
				if (retBoundedElementExpression) {
					if (tempNewIndex < retBoundedElementExpression.newIndex) {
						tempToken = retBoundedElementExpression.token;
						tempNewIndex = retBoundedElementExpression.newIndex;
					}
				}
	
				var retBoundedElementDeclaration = this.BoundedElementDeclaration(str, index);
				if (retBoundedElementDeclaration) {
					if (tempNewIndex < retBoundedElementDeclaration.newIndex) {
						tempToken = retBoundedElementDeclaration.token;
						tempNewIndex = retBoundedElementDeclaration.newIndex;
					}
				}
	
				var retArrayIndex = this.ArrayIndex(str, index);
				if (retArrayIndex) {
					if (tempNewIndex < retArrayIndex.newIndex) {
						tempToken = retArrayIndex.token;
						tempNewIndex = retArrayIndex.newIndex;
					}
				}
	
				if (tempToken) {
					index = tempNewIndex;
					token.addChild(tempToken);
				} else {
					break;
				}
			}
	
			if (token.children.length < 1) {
				return undefined;
			}
	
			token.value = str.substring(originalIndex, index);
			return {
				newIndex: index,
				token: token
			};
		},
	
		// Override
		// Char := ( !Dot & !'=' & !'@' & !'[' & !']' & !Wildcard & !SingleObjectPlaceholder)
		Char: function Char(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var ret = this.Dot(str, index);
			if (ret) {
				return undefined;
			}
			ret = this.Wildcard(str, index);
			if (ret) {
				return undefined;
			}
			ret = this.SingleObjectPlaceholder(str, index);
			if (ret) {
				return undefined;
			}
	
			var succeeded = true;
			['=', '@', '[', ']'].forEach(function (ch) {
				ret = parserCommonFunctions.checkMatch(str, ch, index);
				if (ret) {
					succeeded = false;
				}
			});
	
			if (!succeeded) {
				return undefined;
			}
	
			return {
				newIndex: index + 1,
				token: new Token(Token.Char, str.substr(index, 1), index)
			};
		},
	
		// Wildcard := '*' ElementTail?
		Wildcard: function Wildcard(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(Token.Wildcard, '', index);
	
			// *
			var match = parserCommonFunctions.checkMatch(str, '*', index);
			if (match) {
				index = match.newIndex;
				token.addChild(match.token);
	
				// ElementTail?
				var retElementTail = this.ElementTail(str, index);
				if (retElementTail) {
					index = retElementTail.newIndex;
					token.addChild(retElementTail.token);
				}
			} else {
				return undefined;
			}
	
			token.value = str.substring(originalIndex, index);
			return {
				newIndex: index,
				token: token
			};
		},
	
		// SingleObjectPlaceholder := '?' ElementTail?
		SingleObjectPlaceholder: function SingleObjectPlaceholder(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(Token.SingleObjectPlaceholder, '', index);
	
			// ?
			var match = parserCommonFunctions.checkMatch(str, '?', index);
			if (match) {
				index = match.newIndex;
				token.addChild(match.token);
	
				// ElementTail?
				var retElementTail = this.ElementTail(str, index);
				if (retElementTail) {
					index = retElementTail.newIndex;
					token.addChild(retElementTail.token);
				}
			} else {
				return undefined;
			}
	
			token.value = str.substring(originalIndex, index);
			return {
				newIndex: index,
				token: token
			};
		}
	};
	
	// now copy over the common methods that are not overridden from parserUtilsRestricted to parserUtilsExtended
	for (var key in parserUtilsRestricted) {
		if (key !== 'ExpressionPiece' && key !== 'Attribute' && key !== 'Element' && key !== 'Wildcard' && key !== 'SingleObjectPlaceholder' && key !== 'Usage1Char') {
			// this is a non-overridden method, so copy it over
			// we also exclude Usage1Char because it is not needed in parserUtilsExtended
			parserUtilsExtended[key] = parserUtilsRestricted[key];
		}
	}
	
	if (true) {
		// node.js export (if we're using node.js)
		module.exports = parserUtilsExtended;
	}

/***/ },
/* 34 */
/*!*********************************************************!*\
  !*** ./~/friedjuju/src/expression-parser/astEmitter.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/*
	 * This module traverses a lexical tree of tokens and emits specific ones that are subscribed to.
	 */
	
	/* *******************
	 * AstEmitSubscription: Encapsulates a subscription for tokens
	 */
	// tokenIds: The names of the tokens to emit
	// fnHandler: The handler that is called when a token that matches a token id is found in the object being traversed
	//	The signature is: void function (token)
	function AstEmitSubscription(tokenIds, fnHandler) {
		if (!(tokenIds instanceof Array)) {
			tokenIds = [tokenIds];
		}
		this.tokenIds = tokenIds;
		this.fnHandler = fnHandler;
	}
	
	/* *******************
	 * astEmitterImpl: Private logic for the astEmitter.
	 */
	var astEmitterImpl = {
		subscriptions: [],
	
		getSubscriptionsForToken: function getSubscriptionsForToken(token) {
			var arr = [];
	
			this.subscriptions.forEach(function (subscription) {
				if (subscription.tokenIds.indexOf(token.id) > -1) {
					arr.push(subscription);
				}
			});
	
			return arr;
		},
	
		emit: function emit(subscriptions, token) {
			this.getSubscriptionsForToken(token).forEach(function (subscription) {
				subscription.fnHandler(token);
			});
		}
	};
	
	/* *******************
	 * astEmitter: Used to traverse tokens and emit them to subscribers.
	 */
	var astEmitter = {
		// Traverses a root token recursively and emits tokens that match subscriptions
		// token: The root token to traverse
		traverse: function traverse(token) {
			var matchingSubscriptions = astEmitterImpl.getSubscriptionsForToken(token);
			if (matchingSubscriptions.length > 0) {
				astEmitterImpl.emit(matchingSubscriptions, token);
			}
	
			for (var c = 0; c < token.children.length; c++) {
				var child = token.children[c];
				this.traverse(child);
			}
		},
	
		// Subscribes a handler to receive calls every time a tokens with specific names are found
		// tokenIds: The names of the tokens to emit
		// fnHandler: The handler that is called when a token that matches a token id is found in the object being traversed
		//	The signature is: void function (token)
		subscribe: function subscribe(tokenIds, fnHandler) {
			var subscription = new AstEmitSubscription(tokenIds, fnHandler);
			astEmitterImpl.subscriptions.push(subscription);
		}
	};
	
	if (true) {
		// node.js export (if we're using node.js)
		module.exports = astEmitter;
	}

/***/ },
/* 35 */
/*!*****************************************************!*\
  !*** ./~/friedjuju/src/vdom/domElementConverter.js ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/*
	 * This module converts a DOM element into Xml or JSON strings.
	 */
	var domElementConverter = {
		convertDOMElementToXml: function convertDOMElementToXml(domElement) {
			var str = '<' + domElement.tagName;
	
			for (var c = 0; c < domElement.attributes.length; c++) {
				var attr = domElement.attributes[c];
				str += ' ' + attr.name + '="' + attr.value + '"';
			}
	
			str += '>';
	
			for (var c = 0; c < domElement.childNodes.length; c++) {
				var domChild = domElement.childNodes[c];
				if (domChild.nodeType === 1) {
					var childEleStr = this.convertDOMElementToXml(domChild);
					str += childEleStr;
				} else if (domChild.nodeType === 3) {
					str += domChild.textContent;
				}
			}
	
			str += '</' + domElement.tagName + '>';
	
			return str;
		},
	
		convertDOMElementChildrenToXml: function convertDOMElementChildrenToXml(domElement) {
			var str = '';
	
			for (var c = 0; c < domElement.childNodes.length; c++) {
				var domChild = domElement.childNodes[c];
				str += this.convertDOMElementToXml(domChild);
			}
	
			return str;
		},
	
		// ---
	
		convertDOMElementToJSON: function convertDOMElementToJSON(domElement) {
			var obj = {},
			    objEle;
			objEle = obj[domElement.tagName] = {};
	
			for (var c = 0; c < domElement.attributes.length; c++) {
				var attr = domElement.attributes[c];
				objEle['@' + attr.name] = attr.value;
			}
	
			for (var c = 0; c < domElement.childNodes.length; c++) {
				var domChild = domElement.childNodes[c];
				if (domChild.nodeType === 1) {
					var childEleObj = this.convertDOMElementToJSON(domChild)[domChild.tagName];
					var oProp = objEle[domChild.tagName];
					if (oProp) {
						if (!(oProp instanceof Array)) {
							objEle[domChild.tagName] = [oProp];
						}
						objEle[domChild.tagName].push(childEleObj);
					} else {
						objEle[domChild.tagName] = childEleObj;
					}
				} else if (domChild.nodeType === 3) {
					objEle.$str = domChild.textContent;
				}
			}
	
			return obj;
		},
	
		convertDOMElementChildrenToJSON: function convertDOMElementChildrenToJSON(domElement) {
			var arr = [];
	
			for (var c = 0; c < domElement.childNodes.length; c++) {
				var domChild = domElement.childNodes[c];
				var childEleObj = this.convertDOMElementToJSON(domChild);
				arr.push(childEleObj);
			}
	
			return arr;
		}
	};
	
	if (true) {
		// node.js export (if we're using node.js)
		module.exports = domElementConverter;
	}

/***/ },
/* 36 */
/*!**********************************************************!*\
  !*** ./~/friedjuju/src/vdom/strippedDownMarkupParser.js ***!
  \**********************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/*
	 * Simple stripped-down markup parser which uses the "Simple stripped-down markup grammar"
	 */
	var astEmitter = __webpack_require__(/*! ../expression-parser/astEmitter.js */ 34),
	    Token = __webpack_require__(/*! ../expression-parser/Token.js */ 30),
	    parserCommonFunctions = __webpack_require__(/*! ../expression-parser/parserCommonFunctions.js */ 32),
	    Attr = __webpack_require__(/*! ../json-to-markup/Attr.js */ 26),
	    Element = __webpack_require__(/*! ../json-to-markup/Element.js */ 27);
	
	var strippedDownMarkupParserImpl = {
		// Element := Whitespaces? OpenTagStart AttributeDeclarations? ( (OpenTagStop Children? CloseTag) | ShortCloseTag ) Whitespaces?
		Element: function Element(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(Token.Element, '', index);
	
			// Whitespaces?
			var retWhitespaces = this.Whitespaces(str, index);
			if (retWhitespaces) {
				index = retWhitespaces.newIndex;
				token.addChild(retWhitespaces.token);
			}
	
			// OpenTagStart
			var retOpenTagStart = this.OpenTagStart(str, index);
			if (!retOpenTagStart) {
				return undefined;
			}
	
			index = retOpenTagStart.newIndex;
			token.addChild(retOpenTagStart.token);
	
			// AttributeDeclarations?
			var retAttributeDeclarations = this.AttributeDeclarations(str, index);
			if (retAttributeDeclarations) {
				index = retAttributeDeclarations.newIndex;
				token.addChild(retAttributeDeclarations.token);
			}
	
			// ShortCloseTag
			var retShortCloseTag = this.ShortCloseTag(str, index);
			if (retShortCloseTag) {
				index = retShortCloseTag.newIndex;
				token.addChild(retShortCloseTag.token);
	
				// Whitespaces?
				retWhitespaces = this.Whitespaces(str, index);
				if (retWhitespaces) {
					index = retWhitespaces.newIndex;
					token.addChild(retWhitespaces.token);
				}
	
				token.value = str.substring(originalIndex, index);
				return {
					newIndex: index,
					token: token
				};
			}
	
			// OpenTagStop
			var retOpenTagStop = this.OpenTagStop(str, index);
			if (retOpenTagStop) {
				index = retOpenTagStop.newIndex;
				token.addChild(retOpenTagStop.token);
	
				// Children
				var retChildren = this.Children(str, index);
				if (retChildren) {
					index = retChildren.newIndex;
					token.addChild(retChildren.token);
				}
	
				// CloseTag
				var retCloseTag = this.CloseTag(str, index);
				if (retCloseTag) {
					index = retCloseTag.newIndex;
					token.addChild(retCloseTag.token);
	
					// Whitespaces?
					retWhitespaces = this.Whitespaces(str, index);
					if (retWhitespaces) {
						index = retWhitespaces.newIndex;
						token.addChild(retWhitespaces.token);
					}
	
					token.value = str.substring(originalIndex, index);
					return {
						newIndex: index,
						token: token
					};
				}
			}
	
			return undefined;
		},
	
		// 	Children := ElementChildNode+
		Children: function Children(str, index) {
			return parserCommonFunctions.onlyRepeat1Plus(str, index, 'ElementChildNode', this, 'Children');
		},
	
		// ElementChildNode := Element | ElementTextValue
		ElementChildNode: function ElementChildNode(str, index) {
			return parserCommonFunctions.or(str, index, ['Element', 'ElementTextValue'], this, 'ElementChildNode');
		},
	
		// ElementTextValue := ElementTextValueChar+
		ElementTextValue: function ElementTextValue(str, index) {
			return parserCommonFunctions.onlyRepeat1Plus(str, index, 'ElementTextValueChar', this, 'ElementTextValue');
		},
	
		// ElementTextValueChar := !'<' & !'>'
		ElementTextValueChar: function ElementTextValueChar(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var succeeded = true;
			['<', '>'].forEach(function (ch) {
				var ret = parserCommonFunctions.checkMatch(str, ch, index);
				if (ret) {
					succeeded = false;
					return;
				}
			});
			if (succeeded) {
				return {
					newIndex: index + 1,
					token: new Token(Token.ElementTextValueChar, str.substr(index, 1), index)
				};
			} else {
				return undefined;
			}
		},
	
		// OpenTagStart := '<' TagName
		OpenTagStart: function OpenTagStart(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(Token.OpenTagStart, '', index);
	
			// <
			var matchOpenAngleBracket = parserCommonFunctions.checkMatch(str, '<', index);
			if (matchOpenAngleBracket) {
				index = matchOpenAngleBracket.newIndex;
				token.addChild(matchOpenAngleBracket.token);
	
				// TagName
				var retTagName = this.TagName(str, index);
				if (retTagName) {
					index = retTagName.newIndex;
					token.addChild(retTagName.token);
	
					token.value = str.substring(originalIndex, index);
					return {
						newIndex: index,
						token: token
					};
				}
			}
	
			return undefined;
		},
	
		// OpenTagStop := '>'
		OpenTagStop: function OpenTagStop(str, index) {
			return parserCommonFunctions.exactlyText(str, index, '>', 'OpenTagStop');
		},
	
		// CloseTag := '</' TagName '>'
		CloseTag: function CloseTag(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(Token.CloseTag, '', index);
	
			// </
			var matchOpenAngleBracket = parserCommonFunctions.checkMatch(str, '</', index);
			if (matchOpenAngleBracket) {
				index = matchOpenAngleBracket.newIndex;
				token.addChild(matchOpenAngleBracket.token);
	
				// TagName
				var retTagName = this.TagName(str, index);
				if (retTagName) {
					index = retTagName.newIndex;
					token.addChild(retTagName.token);
	
					// >
					var matchCloseAngleBracket = parserCommonFunctions.checkMatch(str, '>', index);
					if (matchCloseAngleBracket) {
						index = matchCloseAngleBracket.newIndex;
						token.addChild(matchCloseAngleBracket.token);
	
						token.value = str.substring(originalIndex, index);
						return {
							newIndex: index,
							token: token
						};
					}
				}
			}
	
			return undefined;
		},
	
		// ShortCloseTag := '/>'
		ShortCloseTag: function ShortCloseTag(str, index) {
			return parserCommonFunctions.exactlyText(str, index, '/>', 'ShortCloseTag');
		},
	
		// TagName := Chars
		TagName: function TagName(str, index) {
			return parserCommonFunctions.exactlyOne(str, index, 'Chars', this, 'TagName');
		},
	
		// AttributeDeclarations := ( Whitespaces AttributeDeclaration )+
		AttributeDeclarations: function AttributeDeclarations(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var originalIndex = index;
			var token = new Token(Token.AttributeDeclarations, '', index);
	
			var self = this;
			function nucleus() {
				// Whitespaces
				var retWhitespaces = self.Whitespaces(str, index);
				if (retWhitespaces) {
					index = retWhitespaces.newIndex;
					token.addChild(retWhitespaces.token);
	
					// AttributeDeclaration
					var retAttributeDeclaration = self.AttributeDeclaration(str, index);
					if (retAttributeDeclaration) {
						index = retAttributeDeclaration.newIndex;
						token.addChild(retAttributeDeclaration.token);
	
						return true;
					}
				}
	
				return false;
			}
	
			if (!nucleus()) {
				return undefined;
			}
	
			while (index < str.length && nucleus()) {}
	
			if (token.children.length > 0) {
				token.value = str.substring(originalIndex, index);
				return {
					newIndex: index,
					token: token
				};
			}
	
			return undefined;
		},
	
		// AttributeDeclaration := AttributeName Eq AttributeValue
		AttributeDeclaration: function AttributeDeclaration(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			return parserCommonFunctions.seq(str, index, ['AttributeName', 'Eq', 'AttributeValue'], this, 'AttributeDeclaration');
		},
	
		// AttributeName := Chars
		AttributeName: function AttributeName(str, index) {
			return parserCommonFunctions.exactlyOne(str, index, 'Chars', this, 'AttributeName');
		},
	
		// Eq := '='
		Eq: function Eq(str, index) {
			return parserCommonFunctions.exactlyText(str, index, '=', 'Eq');
		},
	
		// Quote := '"'
		Quote: function Quote(str, index) {
			return parserCommonFunctions.exactlyText(str, index, '"', 'Quote');
		},
	
		// SingleQuote := '\''
		SingleQuote: function SingleQuote(str, index) {
			return parserCommonFunctions.exactlyText(str, index, '\'', 'SingleQuote');
		},
	
		// NotSingleQuote := !'\''
		NotSingleQuote: function NotSingleQuote(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var succeeded = true;
			var ret = parserCommonFunctions.checkMatch(str, '\'', index);
			if (ret) {
				succeeded = false;
				return;
			}
			if (succeeded) {
				return {
					newIndex: index + 1,
					token: new Token(Token.NotSingleQuote, str.substr(index, 1), index)
				};
			} else {
				return undefined;
			}
		},
	
		// NotDoubleQuote := !'"'
		NotDoubleQuote: function NotDoubleQuote(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var succeeded = true;
			var ret = parserCommonFunctions.checkMatch(str, '"', index);
			if (ret) {
				succeeded = false;
				return;
			}
			if (succeeded) {
				return {
					newIndex: index + 1,
					token: new Token(Token.NotDoubleQuote, str.substr(index, 1), index)
				};
			} else {
				return undefined;
			}
		},
	
		// AttributeValue := AttributeValueSingleQuoteBounded | AttributeValueDoubleQuoteBounded
		AttributeValue: function AttributeValue(str, index) {
			return parserCommonFunctions.or(str, index, ['AttributeValueDoubleQuoteBounded', 'AttributeValueSingleQuoteBounded'], this, 'AttributeValue');
		},
	
		// AttributeValueSingleQuoteBounded := SingleQuote AttributeValueStringNoSingleQuote SingleQuote
		AttributeValueSingleQuoteBounded: function AttributeValueSingleQuoteBounded(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			return parserCommonFunctions.seq(str, index, ['SingleQuote', 'AttributeValueStringNoSingleQuote', 'SingleQuote'], this, 'AttributeValueSingleQuoteBounded');
		},
	
		// AttributeValueDoubleQuoteBounded := Quote AttributeValueStringNoDoubleQuote Quote
		AttributeValueDoubleQuoteBounded: function AttributeValueDoubleQuoteBounded(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			return parserCommonFunctions.seq(str, index, ['Quote', 'AttributeValueStringNoDoubleQuote', 'Quote'], this, 'AttributeValueDoubleQuoteBounded');
		},
	
		// AttributeValueStringNoSingleQuote := NotSingleQuote*
		AttributeValueStringNoSingleQuote: function AttributeValueStringNoSingleQuote(str, index) {
			return parserCommonFunctions.onlyRepeat0Plus(str, index, 'NotSingleQuote', this, 'AttributeValueStringNoSingleQuote');
		},
	
		// AttributeValueStringNoDoubleQuote := NotDoubleQuote*
		AttributeValueStringNoDoubleQuote: function AttributeValueStringNoDoubleQuote(str, index) {
			return parserCommonFunctions.onlyRepeat0Plus(str, index, 'NotDoubleQuote', this, 'AttributeValueStringNoDoubleQuote');
		},
	
		// Whitespaces := Whitespace+
		Whitespaces: function Whitespaces(str, index) {
			return parserCommonFunctions.onlyRepeat1Plus(str, index, 'Whitespace', this, 'Whitespaces');
		},
	
		// Whitespace := ' ' | '\r' | '\n' | '\t'
		Whitespace: function Whitespace(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var succeeded = false;
			[' ', '\r', '\n', '\t'].forEach(function (ch) {
				var ret = parserCommonFunctions.checkMatch(str, ch, index);
				if (ret) {
					succeeded = true;
					return;
				}
			});
			if (succeeded) {
				return {
					newIndex: index + 1,
					token: new Token(Token.Whitespace, str.substr(index, 1), index)
				};
			} else {
				return undefined;
			}
		},
	
		// Chars := Char+
		Chars: function Chars(str, index) {
			return parserCommonFunctions.onlyRepeat1Plus(str, index, 'Char', this, 'Chars');
		},
	
		// Char := !Whitespace & !Eq & !'|' SpaceyChar
		Char: function Char(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var ret = this.Whitespace(str, index);
			if (ret) {
				return undefined;
			}
			ret = this.SpaceyChar(str, index);
			if (!ret) {
				return undefined;
			}
			var succeeded = true;
			['|', '='].forEach(function (ch) {
				var ret = parserCommonFunctions.checkMatch(str, ch, index);
				if (ret) {
					succeeded = false;
					return;
				}
			});
			if (succeeded) {
				return {
					newIndex: index + 1,
					token: new Token(Token.Char, str.substr(index, 1), index)
				};
			} else {
				return undefined;
			}
		},
	
		// SpaceyChars := SpaceyChar+
		SpaceyChars: function SpaceyChars(str, index) {
			return parserCommonFunctions.onlyRepeat1Plus(str, index, 'SpaceyChar', this, 'SpaceyChars');
		},
	
		// SpaceyChar := !Quote & !'\'' & !'[' & !']' & !'(' & !')' & !'<' & !'>' & !'/'
		SpaceyChar: function SpaceyChar(str, index) {
			if (index >= str.length) {
				return undefined;
			}
	
			var ret = this.Quote(str, index);
			if (ret) {
				return undefined;
			}
	
			var succeeded = true;
			['\'', '[', ']', '(', ')', '<', '>', '/'].forEach(function (ch) {
				var ret = parserCommonFunctions.checkMatch(str, ch, index);
				if (ret) {
					succeeded = false;
					return;
				}
			});
			if (succeeded) {
				return {
					newIndex: index + 1,
					token: new Token(Token.SpaceyChar, str.substr(index, 1), index)
				};
			} else {
				return undefined;
			}
		}
	};
	
	// this is here to add the declarations of static token enums:
	// e.g. Token.Element
	for (var key in strippedDownMarkupParserImpl) {
		Token[key] = key;
	}
	
	var markupRenderer = {
		// Transforms a token tree of an element and transforms it into an Element instance
		// tokenElement: The AST token for the element tree
		// Returns: The Element instance
		render: function render(tokenElement) {
			var rootEle;
			var elements = [];
	
			astEmitter.subscribe(['OpenTagStart'], function (token) {
				var tagName = token.children[1].value;
				var ele = new Element(tagName);
				if (!rootEle) {
					rootEle = ele;
				}
	
				var parentEle;
				if (elements.length > 0) {
					parentEle = elements[elements.length - 1];
					parentEle.addChild(ele);
				}
				elements.push(ele);
			});
	
			astEmitter.subscribe(['AttributeDeclaration'], function (token) {
				var attrName = token.children[0].value,
				    attrValue = token.children[2].children[0].children[1].value;
	
				var ele = elements[elements.length - 1];
				ele.addAttr(new Attr(attrName, attrValue));
			});
	
			astEmitter.subscribe(['ElementTextValue'], function (token) {
				var textVal = token.value;
				var ele = elements[elements.length - 1];
				ele.addChild(textVal);
			});
	
			astEmitter.subscribe(['ShortCloseTag', 'CloseTag'], function (token) {
				// pop off the current element so that the last item in elements is the parent!
				elements.pop();
			});
			astEmitter.traverse(tokenElement.token);
	
			return rootEle;
		}
	};
	
	// The parser for markup content
	var strippedDownMarkupParser = {
		// Parses a markup string
		// str: A markup string
		// Returns: The root Element instance
		parse: function parse(str) {
			var index = 0;
			var tokenElement = strippedDownMarkupParserImpl.Element(str, index);
			if (tokenElement.newIndex < str.length) {
				throw new Error('Unparsed characters exist at the end of the markup string: ' + str.substr(tokenElement.newIndex));
			}
	
			var rootEle = markupRenderer.render(tokenElement);
			return rootEle;
		}
	};
	
	if (true) {
		// node.js export (if we're using node.js)
		module.exports = strippedDownMarkupParser;
	}

/***/ },
/* 37 */
/*!*********************************************************!*\
  !*** ./~/friedjuju/src/json-to-markup/markupPrinter.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* *******************
	 * markupPrinter
	 */
	var markupPrinter = {
		print: function print(ele) {
			return ele.toString();
		},
	
		prettyPrint: function prettyPrint(ele) {
			return ele.toString(0);
		}
	};
	
	if (true) {
		// node.js export (if we're using node.js)
		module.exports = markupPrinter;
	}

/***/ },
/* 38 */
/*!***************************************!*\
  !*** ./~/friedjuju/src/vdom/index.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/*
	 * This is the virtual DOM module
	 */
	var treeDiff = __webpack_require__(/*! ./treeDiff.js */ 39),
	    domWriter = __webpack_require__(/*! ./domWriter.js */ 40),
	    j2mTransformer = __webpack_require__(/*! ../json-to-markup/j2mTransformer.js */ 24),
	    strippedDownMarkupParser = __webpack_require__(/*! ./strippedDownMarkupParser.js */ 36);
	
	function updateDOMImpl(oldRootEle, newRootEle, domElement) {
		var diffs = treeDiff.diff(oldRootEle, newRootEle);
		domWriter.writeDiffsToDOMElement(diffs, domElement);
	}
	
	var vdom = {
		// Transforms an object into markup and sets the markup into a DOM element
		// obj: The object to transform
		updateDOM: function updateDOM(obj, domElement) {
			var oldRootEle = j2mTransformer.envelopeDOMElement(domElement);
			var newRootEle = j2mTransformer.transform(obj);
			updateDOMImpl(oldRootEle, newRootEle, domElement);
		},
	
		updateDOMFromMarkupString: function updateDOMFromMarkupString(markupString, domElement) {
			var oldRootEle = j2mTransformer.envelopeDOMElement(domElement);
			var newRootEle = strippedDownMarkupParser.parse('<__ROOT__>' + markupString + '</__ROOT__>');
			updateDOMImpl(oldRootEle, newRootEle, domElement);
		}
	};
	
	if (true) {
		// node.js export (if we're using node.js)
		module.exports = vdom;
	}

/***/ },
/* 39 */
/*!******************************************!*\
  !*** ./~/friedjuju/src/vdom/treeDiff.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/*
	 * This module performs a tree diff of Element (and Attr) objects in 2 trees.
	 * This is a work in progress on the way to implementing virtual dom functionality.
	 */
	
	var Element = __webpack_require__(/*! ../json-to-markup/Element */ 27);
	
	/* *******************
	 * DiffItem
	 */
	// A diff item which represents a specific change between and old and new version of a tree
	// examples of diffItem instances =>
	// 	1. Change a value in an element
	//		rootEle/persons[0]/age, delete, 23 +---> rootEle/persons[0]/age, set, 32
	//		rootEle/persons[0]/age, add, 32	   |
	//
	//		OR
	//	   Change an attribute
	//		rootEle/persons[0].@class, delete, 'myclass' +---> rootEle/persons[0].@class, set, 'yourclass'
	//		rootEle/persons[0].@class, add, 'yourclass'  |
	//
	//	2. Remove an element
	//		rootEle/persons[0], delete, <no need to add what the element was in the old tree>
	//
	//		OR
	//	   Remove an attribute
	//		rootEle/persons[0].@class, delete, <no need to add what the attribute was in the old tree>
	//
	//	3. Add an element
	//		rootEle/persons[7], add, {actual element definition}
	//
	//		OR
	//	   Change an attribute
	//		rootEle/persons[0].@class, add, 'yourclass'
	function DiffItem() {}
	
	/* *******************
	 * ElementDiffItem
	 */
	function ElementDiffItem(pathToEle, changeType, ele) {
		this.pathToEle = pathToEle;
		this.changeType = changeType;
		this.ele = ele;
	}
	
	ElementDiffItem.prototype = new DiffItem();
	
	/* *******************
	 * ElementTagNameDiffItem
	 */
	function ElementTagNameDiffItem(pathToEle, changeType, tagName) {
		this.pathToEle = pathToEle;
		this.changeType = changeType;
		this.tagName = tagName;
	}
	
	ElementTagNameDiffItem.prototype = new DiffItem();
	
	/* *******************
	 * AttrDiffItem
	 */
	function AttrDiffItem(pathToAttr, changeType, attr) {
		this.pathToAttr = pathToAttr;
		this.changeType = changeType;
		this.attr = attr;
	}
	
	AttrDiffItem.prototype = new DiffItem();
	
	/* *******************
	 * treeDiffImpl
	 */
	var treeDiffImpl = {
		// Gets an attribute of an Element instance by name
		// ele: The Element instance
		// attrName: The name of the attribute
		// Returns: The attribute if found, else undefined
		getAttributeByName: function getAttributeByName(ele, attrName) {
			for (var c = 0; c < ele.attributes.length; c++) {
				var attr = ele.attributes[c];
				if (attr.name.toLowerCase() === attrName.toLowerCase()) {
					return attr;
				}
			}
			return undefined;
		},
	
		// Compares 2 Element instances
		// oldElePath: The path to the original Element instance
		// oldEle: The original Element instance
		// newElePath: The path to the new version of the Element instance
		// newEle: The new version of the Element instance
		// Returns: An array of diffs
		compareElement: function compareElement(oldElePath, oldEle, newElePath, newEle) {
			if (oldEle === newEle) {
				// the elements are the same instance so there are no diffs!
				return [];
			}
			var diffs = [];
	
			// compare tagName
			if (oldEle.tagName.toLowerCase() !== newEle.tagName.toLowerCase()) {
				// tagName changed
				//var diffItem = new ElementTagNameDiffItem(oldElePath, 'set', newEle.tagName);
				var diffItem1 = new ElementDiffItem(oldElePath, 'delete', null);
				var diffItem2 = new ElementDiffItem(oldElePath, 'add', newEle);
				diffs.push(diffItem1);
				diffs.push(diffItem2);
				return diffs;
			}
	
			// compare attributes
			var handledAttrs = [];
			oldEle.attributes.forEach(function (oldAttr) {
				var newAttr = treeDiffImpl.getAttributeByName(newEle, oldAttr.name);
				if (!newAttr) {
					// attr is deleted
					var diffItem = new AttrDiffItem(oldElePath + '.@' + oldAttr.name, 'delete', null);
					diffs.push(diffItem);
				} else if (oldAttr.value !== newAttr.value) {
					// attr edited
					var diffItem = new AttrDiffItem(oldElePath + '.@' + oldAttr.name, 'set', newAttr.value);
					diffs.push(diffItem);
				}
				handledAttrs.push(newAttr);
			});
	
			newEle.attributes.forEach(function (newAttr) {
				if (handledAttrs.indexOf(newAttr) === -1) {
					// we have not handled this attr before so it must be new!
					var diffItem = new AttrDiffItem(oldElePath + '.@' + newAttr.name, 'add', newAttr.value);
					diffs.push(diffItem);
				}
			});
	
			// compare children
			var oldIndex = 0,
			    newIndex = 0;
			while (oldIndex < oldEle.children.length && newIndex < newEle.children.length) {
				var oldChild = oldEle.children[oldIndex],
				    newChild = newEle.children[newIndex];
	
				var areChildrenSame = true;
				if (typeof oldChild === 'string' && typeof newChild === 'string') {
					if (oldChild !== newChild) {
						// $str values are different
						var diffItem = new ElementDiffItem(oldElePath + '.$str', 'set', newChild);
						diffs.push(diffItem);
						areChildrenSame = false;
					}
				} else if (typeof oldChild === 'string' && newChild instanceof Element) {
					// $str is replaced by a real child
					diffs.push(new ElementDiffItem(oldElePath + '.$str', 'delete', null));
					diffs.push(new ElementDiffItem(oldElePath + '[' + oldIndex + ']', 'add', newChild));
					areChildrenSame = false;
				} else if (oldChild instanceof Element && typeof newChild === 'string') {
					// child is replaced by $str value
					diffs.push(new ElementDiffItem(oldElePath + '[' + oldIndex + ']', 'delete', null));
					diffs.push(new ElementDiffItem(oldElePath + '.$str', 'add', newChild));
					areChildrenSame = false;
				} else {
					// oldChild & newChild are elements
	
				}
	
				if (areChildrenSame) {
					var childDiffs = this.compareElement(oldElePath + '[' + oldIndex + ']', oldChild, newElePath + '[' + newIndex + ']', newChild);
					childDiffs.forEach(function (childDiff) {
						diffs.push(childDiff);
					});
				}
	
				oldIndex++;
				newIndex++;
			}
	
			if (oldIndex >= oldEle.children.length) {
				// add in the extra new children
				while (newIndex < newEle.children.length) {
					diffs.push(new ElementDiffItem(oldElePath + '[' + newIndex + ']', 'add', newEle.children[newIndex]));
					newIndex++;
				}
			} else {
				// delete the extra old children
				while (oldIndex < oldEle.children.length) {
					diffs.push(new ElementDiffItem(oldElePath + '[' + oldIndex + ']', 'delete', null));
					oldIndex++;
				}
			}
	
			return diffs;
		}
	};
	
	/* *******************
	 * treeDiff
	 */
	var treeDiff = {
		// Gets the diffs between two Element instances
		// oldRootEle: The original Element instance
		// newRootEle: The new version of the Element instance
		// Returns: An array of diffs
		diff: function diff(oldRootEle, newRootEle) {
			var diffs = treeDiffImpl.compareElement(oldRootEle.tagName, oldRootEle, newRootEle.tagName, newRootEle);
			return diffs;
		}
	};
	
	if (true) {
		// node.js export (if we're using node.js)
		module.exports = treeDiff;
	}

/***/ },
/* 40 */
/*!*******************************************!*\
  !*** ./~/friedjuju/src/vdom/domWriter.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/*
	 * This module is used to write diffs to a DOM element
	 */
	
	//#DONT_BUILD_BEGIN
	__webpack_require__(/*! ./document-shim.js */ 41);
	//#DONT_BUILD_END
	
	// Populates a DOM element hierarchy with the contents in an element tree
	// domElement: The DOM element to populate
	// eleInstance: The root element of the tree
	function populateDOMElementFromElementInstance(domElement, eleInstance) {
		var o = document.createElement(eleInstance.tagName);
		eleInstance.attributes.forEach(function (attr) {
			o.setAttribute(attr.name, attr.value);
		});
	
		eleInstance.children.forEach(function (child) {
			if (typeof child === 'string') {
				o.appendChild(document.createTextNode(child));
			} else {
				populateDOMElementFromElementInstance(o, child);
			}
		});
	
		domElement.appendChild(o);
	}
	
	var domWriterImpl = {
		// Sets the innerHTML of a DOM element
		// ele: The DOM element
		// child: The string content or Element instance to be written to the innerHTML property of the DOM element
		setElementInnerHTML: function setElementInnerHTML(ele, child) {
			if (typeof child === 'string') {
				ele.innerHTML = child;
			} else {
				populateDOMElementFromElementInstance(ele, child);
				//ele.innerHTML = child.toString();
			}
		},
	
		// Writes a value to a path within an element
		// pathArr: The path to the element or attribute to set in the DOM element
		// ele: The DOM element
		// valToSet: The value to set
		writePathsToElementOrAttr: function writePathsToElementOrAttr(pathArr, ele, valToSet, tagName) {
			pathArr.forEach(function (pathPiece, pathIndex) {
				var parentEle = ele;
				if (pathPiece[0] === '@') {
					ele.setAttribute(pathPiece.substr(1), valToSet);
				} else if (pathPiece === '$str') {
					ele.innerHTML = valToSet;
				} else {
					var index = Number(pathPiece);
					if (index < ele.childNodes.length) {
						ele = ele.childNodes[Number(pathPiece)];
					} else {
						// the only course of action is to append the valToSet to ele!
						var stub = document.createElement('nop');
						if (valToSet) {
							domWriterImpl.setElementInnerHTML(stub, valToSet);
						} else if (tagName) {
							var newEle = document.createElement(tagName);
							stub.appendChild(newEle);
						}
	
						var lastCh = stub.childNodes[0];
						ele.appendChild(lastCh);
	
						ele = lastCh;
					}
	
					if (ele && tagName && pathIndex === pathArr.length - 1) {
						var replacementEle = document.createElement(tagName);
						parentEle.insertBefore(replacementEle, ele);
						parentEle.removeChild(ele);
					}
				}
			});
		},
	
		// Removes an element or attribute within an element
		// pathArr: The path to the element or attribute to remove from the DOM element
		// ele: The DOM element
		unwritePathsToElementOrAttr: function unwritePathsToElementOrAttr(pathArr, ele) {
			var lastEle, lastParent;
			pathArr.forEach(function (pathPiece) {
				if (pathPiece[0] === '@') {
					ele.removeAttribute(pathPiece.substr(1));
					lastParent = null;
				} else if (pathPiece === '$str') {
					ele.innerHTML = '';
				} else {
					lastParent = ele;
					var index = Number(pathPiece);
					if (index < ele.childNodes.length) {
						ele = ele.childNodes[index];
					} else {
						ele = ele.childNodes[ele.childNodes.length - 1];
						//throw new Error('Cannot delete DOM element or attribute. No child found at index: ' + index);
					}
					lastEle = ele;
				}
			});
	
			if (lastParent) {
				lastParent.removeChild(lastEle);
			}
		}
	};
	
	var diffCommander = {
		// Takes a path expression from a diff and converts it to its constituent pieces
		// pathExpr: A path to an element or attribute (that is part of the info in a diff)
		// Returns: An array whose elements are pieces in the path
		// Examples:
		// 	__ROOT__[0] => [0] (which means get the 1st child)
		// 	__ROOT__[0][1] => [0, 1] (which means get the 2nd child of the 1st child)
		// 	__ROOT__[0][0] => [0, 0] (which means get the 1st child of the 1st child)
		// 	__ROOT__[0][1].@class => [0, 1, '@class'] (which means get the class attribute of the 2nd child of the 1st child)
		dottifyPathExpression: function dottifyPathExpression(pathExpr) {
			var normalizedPathExpr = pathExpr.replace('__ROOT__', '').replace(/\[/g, '\.').replace(/\]/g, '');
			var arr = normalizedPathExpr.split('.');
			if (arr.length > 0 && arr[0] === '') {
				return arr.slice(1);
			}
			return arr;
		},
	
		// Adds content to a DOM element based on a diff
		// diff: The diff to be used to add the content to the DOM element
		// domElement: The DOM element
		add: function add(diff, domElement) {
			this.set(diff, domElement);
		},
	
		// Deletes content from a DOM element based on a diff
		// diff: The diff to be used to delete the content from the DOM element
		// domElement: The DOM element
		delete: function _delete(diff, domElement) {
			if (diff.pathToAttr) {
				// normalize the path to the attribute in an element
				var pathArr = this.dottifyPathExpression(diff.pathToAttr);
				// delete the attribute
				domWriterImpl.unwritePathsToElementOrAttr(pathArr, domElement);
			} else if (diff.pathToEle) {
				// normalize the path to the element
				var pathArr = this.dottifyPathExpression(diff.pathToEle);
				// delete the element
				domWriterImpl.unwritePathsToElementOrAttr(pathArr, domElement);
			}
		},
	
		// Modifies a DOM element by setting a value from a diff
		// diff: The diff to be used to modify the DOM element
		// domElement: The DOM element
		set: function set(diff, domElement) {
			if (diff.pathToAttr) {
				// normalize the path to the attribute in an element
				var pathArr = this.dottifyPathExpression(diff.pathToAttr);
				// set the attribute
				domWriterImpl.writePathsToElementOrAttr(pathArr, domElement, diff.attr);
			} else if (diff.pathToEle) {
				// normalize the path to the element
				var pathArr = this.dottifyPathExpression(diff.pathToEle);
				// set the element
				domWriterImpl.writePathsToElementOrAttr(pathArr, domElement, diff.ele, diff.tagName);
			}
		}
	};
	
	/* *******************
	 * domWriter:
	 */
	var domWriter = {
		// Writes diffs to a DOM element
		// The idea is to use the diffs to only change the affected parts of a DOM element rather than the whole DOM element.
		// diffs: The diffs
		// domElement: The DOM element
		writeDiffsToDOMElement: function writeDiffsToDOMElement(diffs, domElement) {
			diffs.forEach(function (diff) {
				if (diff.changeType === 'add' || diff.changeType === 'delete' || diff.changeType === 'set') {
					diffCommander[diff.changeType](diff, domElement);
				} else {
					throw new Error('Found an invalid changeType: ' + diff.changeType + ' | diff = ' + JSON.stringify(diff, undefined, 2));
				}
			});
		}
	};
	
	if (true) {
		// node.js export (if we're using node.js)
		module.exports = domWriter;
	}

/***/ },
/* 41 */
/*!***********************************************!*\
  !*** ./~/friedjuju/src/vdom/document-shim.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	/*
	 * The document shim is required by node.js but NOT needed for the web browser.
	 * It is used to simulate the document and ELEMENT APIs. However, only the methods that are required for j2m
	 * and vdom are actually implemented here!
	 */
	
	// #DONT_BUILD_BEGIN
	// We need window for the browser-side so that j2m is declared globally on the browser;
	// however, since node.js has no window object, we merely create one here so that the
	// var j2m = window.j2m = { ... } declaration works.
	if (typeof document === 'undefined') {
		var strippedDownMarkupParser;
	
		(function () {
	
			// Populates a DOM element hierarchy with the contents in an element tree
			// domElement: The DOM element to populate
			// eleInstance: The root element of the tree
	
			var populateDOMElementFromElementInstance = function populateDOMElementFromElementInstance(domElement, eleInstance) {
				var o = document.createElement(eleInstance.tagName);
				eleInstance.attributes.forEach(function (attr) {
					o.setAttribute(attr.name, attr.value);
				});
	
				eleInstance.children.forEach(function (child) {
					if (typeof child === 'string') {
						o.appendChild(document.createTextNode(child));
					} else {
						populateDOMElementFromElementInstance(o, child);
					}
				});
	
				domElement.appendChild(o);
			};
	
			// removes an element from an array at a specific index
			// arr: The array
			// index: The index for the element that you want to remove
	
	
			var removeElementAt = function removeElementAt(arr, index) {
				if (index >= 0 && index < arr.length) {
					for (var c = index; c < arr.length - 1; c++) {
						arr[c] = arr[c + 1];
					}
					arr.length--;
				}
			};
	
			// Convention for the properties of the DOM element instance:
			// 1) The properties prefixed by an underscore are NOT part of the ELEMENT API;
			//    they are needed for the node.js implementation.
	
	
			strippedDownMarkupParser = __webpack_require__(/*! ./strippedDownMarkupParser.js */ 36);
			global.document = {
				// Implementation of the document.createElement API
				// Creates a DOM element
				// tagName: A string
				// Returns: The DOM element
				createElement: function createElement(tagName) {
					var ele = {
						// The node type property that signifies that this is an ELEMENT
						nodeType: 1,
	
						// The tagName of the element
						tagName: tagName,
	
						// The child nodes of the element
						childNodes: [],
	
						// The attributes for the element
						attributes: [],
	
						// Sets an attribute of the element
						setAttribute: function setAttribute(attrName, attrVal) {
							var foundAttr = this._getAttributeInstance(attrName);
							if (foundAttr) {
								foundAttr.value = attrVal;
							} else {
								this.attributes.push({ name: attrName, value: attrVal });
							}
						},
	
						_getAttributeInstance: function _getAttributeInstance(attrName) {
							for (var c = 0; c < this.attributes.length; c++) {
								if (this.attributes[c].name === attrName) {
									return this.attributes[c];
								}
							}
							return null;
						},
	
						// Removes an attribute from the element
						removeAttribute: function removeAttribute(attrName) {
							for (var c = this.attributes.length - 1; c >= 0; c--) {
								var attr = this.attributes[c];
								if (attr.name === attrName) {
									removeElementAt(this.attributes, c);
								}
							}
						},
	
						// Removes a child node from the element
						removeChild: function removeChild(child) {
							for (var c = this.childNodes.length - 1; c >= 0; c--) {
								var chInst = this.childNodes[c];
								if (chInst === child) {
									removeElementAt(this.childNodes, c);
								}
							}
						},
	
						// Appends a child node to the element
						appendChild: function appendChild(child) {
							this.childNodes.push(child);
						},
	
						// The toString implementation: Equivalent to outerHTML.
						toString: function toString() {
							var str = '<' + this.tagName;
							this.attributes.forEach(function (attr) {
								str += ' ' + attr.name + '="' + attr.value + '"';
							});
	
							str += '>';
	
							this.childNodes.forEach(function (child) {
								if (child.textContent) {
									str += child.textContent;
								} else {
									str += child.toString();
								}
							});
	
							str += '</' + this.tagName + '>';
							return str;
						}
					};
	
					// This section creates the innerHTML property of the element
					Object.defineProperty(ele, 'innerHTML', {
						get: function get() {
							var str = '';
							ele.childNodes.forEach(function (child) {
								if (child.textContent) {
									str += child.textContent;
								} else {
									str += child.toString();
								}
							});
							return str;
						},
						set: function set(newValue) {
							ele.childNodes.length = 0;
							try {
								var kidEle = strippedDownMarkupParser.parse(newValue);
								populateDOMElementFromElementInstance(ele, kidEle);
							} catch (e) {
								ele.appendChild(document.createTextNode(newValue));
							}
						}
					});
	
					return ele;
				},
	
				// Implementation of the document.createElement API
				// Creates a text node
				// strVal: The text content to be applied in the text node
				// Returns: The text node
				createTextNode: function createTextNode(strVal) {
					var textNode = {
						// The node type property that signifies that this is a text node
						nodeType: 3,
	
						// The text content
						textContent: strVal,
	
						// Gets the text content
						valueOf: function valueOf() {
							return this.strVal;
						}
					};
					return textNode;
				}
			};
	
			// create the html, head and body elements in a hierarchy
			document.html = document.createElement('html');
			document.head = document.createElement('head');
			document.body = document.createElement('body');
			document.html.appendChild(document.head);
			document.html.appendChild(document.body);
		})();
	}
	// #DONT_BUILD_END
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 42 */
/*!**********************************************************!*\
  !*** ./~/affront/lib/Component/TemplateViewComponent.js ***!
  \**********************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.TemplateViewComponent = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _ViewComponent2 = __webpack_require__(/*! ./ViewComponent */ 20);
	
	var _InvalidArgumentError = __webpack_require__(/*! ../errors/InvalidArgumentError */ 9);
	
	var _mustache = __webpack_require__(/*! mustache */ 22);
	
	var _mustache2 = _interopRequireDefault(_mustache);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var TemplateViewComponent = exports.TemplateViewComponent = function (_ViewComponent) {
		_inherits(TemplateViewComponent, _ViewComponent);
	
		// routeUrl: The route url to which the component is bound
		// domContainerElement: The element that will be rendered into
		// templates: An object whose properties are template names and whose values are the content of the templates
		// localCSS: An object whose properties are CSS class names and whose values are the localized CSS class names
		//		The component will change the matching CSS class names in the templates.
	
		function TemplateViewComponent(routeUrl, domContainerElement, templates, localCSS) {
			_classCallCheck(this, TemplateViewComponent);
	
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TemplateViewComponent).call(this, routeUrl, domContainerElement));
	
			_this.templates = templates || {};
	
			if (templates && localCSS) {
				// localize the CSS class names in the templates
				for (var name in _this.templates) {
					var content = _this.templates[name];
					for (var oCN in localCSS) {
						var nCN = localCSS[oCN];
						content = content.replace(new RegExp('class="' + oCN + '"', 'gi'), 'class="' + nCN + '"').replace(new RegExp('class=\'' + oCN + '\'', 'gi'), 'class=\'' + nCN + '\'');
					}
					_this.templates[name] = content;
				}
			}
			return _this;
		}
	
		_createClass(TemplateViewComponent, [{
			key: 'addTemplate',
			value: function addTemplate(name, content) {
				this.templates[name] = content;
			}
		}, {
			key: 'removeTemplate',
			value: function removeTemplate(name) {
				delete this.templates[name];
			}
	
			// Renders a named template
			// A template is a string that will be replaced using mustache.
			// For controls within the template, you should use: {{ControlClassName.ControlId}},
			//	e.g. {{MyControl.123}} => where the class is MyControl and the id is 123.
	
		}, {
			key: 'renderTemplate',
			value: function renderTemplate(name, data) {
				var templateStr = this.templates[name];
				if (!templateStr) {
					throw new _InvalidArgumentError.InvalidArgumentError('No template was found with the name: "' + name + '"');
				}
	
				// we clone the data to prevent pollution of the store item!!!
				var clonedData = {};
				for (var key in data) {
					clonedData[key] = data[key];
				}
	
				if (this.controls) {
					var controlData = {};
					for (var controlId in this.controls) {
						var control = this.controls[controlId];
						controlData[control.constructor.name] = {};
						controlData[control.constructor.name][control.id] = control.render(clonedData, this.lastEvent);
					}
	
					for (var _key in controlData) {
						clonedData[_key] = controlData[_key];
					}
				}
	
				return _mustache2.default.render(templateStr, clonedData);
			}
		}]);
	
		return TemplateViewComponent;
	}(_ViewComponent2.ViewComponent);
	
	;

/***/ },
/* 43 */
/*!*******************************************************!*\
  !*** ./~/affront/lib/Component/NonVisualComponent.js ***!
  \*******************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.NonVisualComponent = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _ComponentBase2 = __webpack_require__(/*! ./ComponentBase */ 4);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var NonVisualComponent = exports.NonVisualComponent = function (_ComponentBase) {
		_inherits(NonVisualComponent, _ComponentBase);
	
		// routeUrl: The route url to which the component is bound
	
		function NonVisualComponent(routeUrl) {
			_classCallCheck(this, NonVisualComponent);
	
			return _possibleConstructorReturn(this, Object.getPrototypeOf(NonVisualComponent).call(this, routeUrl));
		}
	
		// This method is invoked so the component can set itself up to render content;
		// i.e. boiler plate content (static content) must be displayed
		// ctxt: an UrlContext instance
	
	
		_createClass(NonVisualComponent, [{
			key: 'urlChangedRender',
			value: function urlChangedRender(ctxt) {
				console.log('[NonVisualComponent.urlChangedRender] invoked | ctxt = ', ctxt);
			}
	
			// This method is invoked so the component can render the actual data (storeItem)
			// ctxt: a StoreItem instance
	
		}, {
			key: 'notificationRender',
			value: function notificationRender(storeItem) {
				console.log('[NonVisualComponent.notificationRender] invoked | storeItem = ', storeItem);
			}
		}, {
			key: 'hide',
			value: function hide() {
				console.log('[NonVisualComponent.hide] invoked');
			}
		}]);
	
		return NonVisualComponent;
	}(_ComponentBase2.ComponentBase);
	
	;

/***/ },
/* 44 */
/*!*************************************!*\
  !*** ./~/affront/lib/Http/index.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Http = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /*
	                                                                                                                                                                                                                                                   * The Http requester
	                                                                                                                                                                                                                                                   */
	
	
	var _Store = __webpack_require__(/*! ../Store */ 7);
	
	// callback: function (err, response)
	//	where response is an object if JSON.parseable or is the responseText
	function request(method, url, data, callback) {
		if (data === null || data === undefined) {
			data = undefined;
		} else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
			data = JSON.stringify(data);
		}
		var request = new XMLHttpRequest();
		request.open(method.toUpperCase(), url, true);
		request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	
		request.onload = function () {
			if (request.status >= 200 && request.status < 400) {
				var retVal = void 0;
				try {
					retVal = JSON.parse(request.responseText);
				} catch (e) {
					retVal = request.responseText;
				}
				callback(null, retVal);
			} else {
				callback(request.responseText);
			}
		};
	
		request.onerror = function () {
			callback('Failed to contact remote server');
		};
	
		if (data) {
			request.send(data);
		} else {
			request.send();
		}
	}
	
	var Http = exports.Http = {
		// key: The key of the store item to set with the response data
		// 	If key is set then the matching store item will be set
		// url: The url
		// callback: void function (err, responseData)
	
		get: function get(key, url, callback) {
			request('GET', url, null, function (err, value) {
				if (err) {
					callback(err);
					return;
				}
				if (key) {
					_Store.Store.setItem(key, value);
				}
				callback(null, value);
			});
		},
	
	
		// key: The key of the store item to set with the response data
		// 	If key is set then the matching store item will be set
		// url: The url
		// data: The data to post
		// callback: void function (err, responseData)
		post: function post(key, url, data, callback) {
			request('POST', url, data, function (err, value) {
				if (err) {
					callback(err);
					return;
				}
				if (key) {
					_Store.Store.setItem(key, value);
				}
				callback(null, value);
			});
		},
	
	
		// key: The key of the store item to set with the response data
		// 	If key is set then the matching store item will be set
		// url: The url
		// data: The data to put
		// callback: void function (err, responseData)
		put: function put(key, url, data, callback) {
			request('PUT', url, data, function (err, value) {
				if (err) {
					callback(err);
					return;
				}
				if (key) {
					_Store.Store.setItem(key, value);
				}
				callback(null, value);
			});
		},
	
	
		// key: The key of the store item to set with the response data
		// 	If key is set then the matching store item will be set
		// url: The url
		// callback: void function (err, responseData)
		delete: function _delete(key, url, callback) {
			request('DELETE', url, null, function (err, value) {
				if (err) {
					callback(err);
					return;
				}
				if (key) {
					_Store.Store.setItem(key, value);
				}
				callback(null, value);
			});
		},
	
	
		// key: The key of the store item to set with the response data
		// 	If key is set then the matching store item will be set
		// url: The url
		// data: The data to patch
		// callback: void function (err, responseData)
		patch: function patch(key, url, data, callback) {
			request('PATCH', url, data, function (err, value) {
				if (err) {
					callback(err);
					return;
				}
				if (key) {
					_Store.Store.setItem(key, value);
				}
				callback(null, value);
			});
		}
	};

/***/ },
/* 45 */
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ComplexTemplateViewComponent = exports.MyTemplateViewComponent = exports.MyViewComponent = exports.DumbComponent = exports.AtomComponent = undefined;
	
	var _AtomComponent = __webpack_require__(/*! ./components/AtomComponent */ 46);
	
	var _DumbComponent = __webpack_require__(/*! ./components/DumbComponent */ 47);
	
	var _MyViewComponent = __webpack_require__(/*! ./components/MyViewComponent */ 48);
	
	var _MyTemplateViewComponent = __webpack_require__(/*! ./components/MyTemplateViewComponent */ 53);
	
	var _ComplexTemplateViewComponent = __webpack_require__(/*! ./components/ComplexTemplateViewComponent */ 58);
	
	exports.AtomComponent = _AtomComponent.AtomComponent;
	exports.DumbComponent = _DumbComponent.DumbComponent;
	exports.MyViewComponent = _MyViewComponent.MyViewComponent;
	exports.MyTemplateViewComponent = _MyTemplateViewComponent.MyTemplateViewComponent;
	exports.ComplexTemplateViewComponent = _ComplexTemplateViewComponent.ComplexTemplateViewComponent;

/***/ },
/* 46 */
/*!***********************************************!*\
  !*** ./lib/components/AtomComponent/index.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.AtomComponent = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _affront = __webpack_require__(/*! affront */ 1);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// create the components that go with the different routes
	
	var AtomComponent = exports.AtomComponent = function (_Affront$NonVisualCom) {
		_inherits(AtomComponent, _Affront$NonVisualCom);
	
		function AtomComponent(routeUrl) {
			_classCallCheck(this, AtomComponent);
	
			return _possibleConstructorReturn(this, Object.getPrototypeOf(AtomComponent).call(this, routeUrl));
		}
	
		// This method is invoked so the component can set itself up to render content;
		// i.e. boiler plate content (static content) must be displayed
		// ctxt: an UrlContext instance
	
	
		_createClass(AtomComponent, [{
			key: 'urlChangedRender',
			value: function urlChangedRender(ctxt) {
				console.log('[AtomComponent.urlChangedRender] invoked | ctxt = ', ctxt, ' | routeUrl = ', this.routeUrl);
			}
	
			// This method is invoked so the component can render the actual data (storeItem)
			// ctxt: a StoreItem instance
	
		}, {
			key: 'notificationRender',
			value: function notificationRender(storeItem) {
				console.log('[AtomComponent.notificationRender] invoked | storeItem = ', storeItem, ' | routeUrl = ', this.routeUrl);
			}
		}, {
			key: 'hide',
			value: function hide() {
				console.log('[AtomComponent.hide] invoked | routeUrl = ', this.routeUrl);
			}
		}]);
	
		return AtomComponent;
	}(_affront.Affront.NonVisualComponent);
	
	;

/***/ },
/* 47 */
/*!***********************************************!*\
  !*** ./lib/components/DumbComponent/index.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.DumbComponent = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _affront = __webpack_require__(/*! affront */ 1);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var DumbComponent = exports.DumbComponent = function (_Affront$NonVisualCom) {
		_inherits(DumbComponent, _Affront$NonVisualCom);
	
		function DumbComponent(routeUrl) {
			_classCallCheck(this, DumbComponent);
	
			return _possibleConstructorReturn(this, Object.getPrototypeOf(DumbComponent).call(this, routeUrl));
		}
	
		// This method is invoked so the component can set itself up to render content;
		// i.e. boiler plate content (static content) must be displayed
		// ctxt: an UrlContext instance
	
	
		_createClass(DumbComponent, [{
			key: 'urlChangedRender',
			value: function urlChangedRender(ctxt) {
				console.log('[DumbComponent.urlChangedRender] invoked | ctxt = ', ctxt, ' | routeUrl = ', this.routeUrl);
			}
	
			// This method is invoked so the component can render the actual data (storeItem)
			// ctxt: a StoreItem instance
	
		}, {
			key: 'notificationRender',
			value: function notificationRender(storeItem) {
				console.log('[DumbComponent.notificationRender] invoked | storeItem = ', storeItem, ' | routeUrl = ', this.routeUrl);
			}
		}, {
			key: 'hide',
			value: function hide() {
				console.log('[DumbComponent.hide] invoked | routeUrl = ', this.routeUrl);
			}
		}]);
	
		return DumbComponent;
	}(_affront.Affront.NonVisualComponent);
	
	;

/***/ },
/* 48 */
/*!*************************************************!*\
  !*** ./lib/components/MyViewComponent/index.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.MyViewComponent = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _affront = __webpack_require__(/*! affront */ 1);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	__webpack_require__(/*! ./styles.css */ 49);
	
	// A visual component
	
	var MyViewComponent = exports.MyViewComponent = function (_Affront$ViewComponen) {
		_inherits(MyViewComponent, _Affront$ViewComponen);
	
		function MyViewComponent(routeUrl, domElement) {
			_classCallCheck(this, MyViewComponent);
	
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MyViewComponent).call(this, routeUrl, domElement));
	
			_this.subscribe('name');
			return _this;
		}
	
		_createClass(MyViewComponent, [{
			key: 'templateStr',
			value: function templateStr(data) {
				return '<div class="segment">This is my stuff | name = ' + data.name + '</div>';
			}
	
			// This method is invoked so the component can set itself up to render content;
			// i.e. boiler plate content (static content) must be displayed
			// ctxt: an UrlContext instance
	
		}, {
			key: 'urlChangedRender',
			value: function urlChangedRender(ctxt) {
				this.updateDOM(this.templateStr({}));
			}
	
			// This method is invoked so the component can render the actual data (storeItem)
			// ctxt: a StoreItem instance
	
		}, {
			key: 'notificationRender',
			value: function notificationRender(storeItem) {
				if (storeItem.key === 'name') {
					this.updateDOM(this.templateStr({ name: storeItem.value }));
				}
				console.log('[MyViewComponent.notificationRender] invoked | storeItem = ', storeItem, ' | routeUrl = ', this.routeUrl);
			}
		}, {
			key: 'hide',
			value: function hide() {
				this.updateDOM('', this.domElement);
			}
		}]);
	
		return MyViewComponent;
	}(_affront.Affront.ViewComponent);
	
	;

/***/ },
/* 49 */
/*!***************************************************!*\
  !*** ./lib/components/MyViewComponent/styles.css ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(/*! !./../../../~/css-loader!./styles.css */ 50);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(/*! ./../../../~/style-loader/addStyles.js */ 52)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./styles.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./styles.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 50 */
/*!******************************************************************!*\
  !*** ./~/css-loader!./lib/components/MyViewComponent/styles.css ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(/*! ./../../../~/css-loader/lib/css-base.js */ 51)();
	// imports
	
	
	// module
	exports.push([module.id, ".segment{\n\tcolor: red;\n}", ""]);
	
	// exports


/***/ },
/* 51 */
/*!**************************************!*\
  !*** ./~/css-loader/lib/css-base.js ***!
  \**************************************/
/***/ function(module, exports) {

	"use strict";
	
	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },
/* 52 */
/*!*************************************!*\
  !*** ./~/style-loader/addStyles.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(true) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 53 */
/*!*********************************************************!*\
  !*** ./lib/components/MyTemplateViewComponent/index.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.MyTemplateViewComponent = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _affront = __webpack_require__(/*! affront */ 1);
	
	var _styles = __webpack_require__(/*! ./styles.css */ 54);
	
	var _styles2 = _interopRequireDefault(_styles);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// A template view component
	
	var MyTemplateViewComponent = exports.MyTemplateViewComponent = function (_Affront$TemplateView) {
		_inherits(MyTemplateViewComponent, _Affront$TemplateView);
	
		function MyTemplateViewComponent(routeUrl, domElement) {
			_classCallCheck(this, MyTemplateViewComponent);
	
			var templates = {
				'placeholder': __webpack_require__(/*! raw!./placeholder-template.html */ 56),
				'view': __webpack_require__(/*! raw!./view-template.html */ 57)
			};
	
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MyTemplateViewComponent).call(this, routeUrl, domElement, templates, _styles2.default));
	
			_this.subscribe('name');
			return _this;
		}
	
		// This method is invoked so the component can set itself up to render content;
		// i.e. boiler plate content (static content) must be displayed
		// ctxt: an UrlContext instance
	
	
		_createClass(MyTemplateViewComponent, [{
			key: 'urlChangedRender',
			value: function urlChangedRender(ctxt) {
				this.updateDOM(this.renderTemplate('placeholder', {}));
			}
	
			// This method is invoked so the component can render the actual data (storeItem)
			// ctxt: a StoreItem instance
	
		}, {
			key: 'notificationRender',
			value: function notificationRender(storeItem) {
				if (storeItem.key === 'name') {
					this.updateDOM(this.renderTemplate('view', { name: storeItem.value }));
				}
				console.log('[MyTemplateViewComponent.notificationRender] invoked | storeItem = ', storeItem, ' | routeUrl = ', this.routeUrl);
			}
		}, {
			key: 'hide',
			value: function hide() {
				this.updateDOM('', this.domElement);
			}
		}]);
	
		return MyTemplateViewComponent;
	}(_affront.Affront.TemplateViewComponent);
	
	;

/***/ },
/* 54 */
/*!***********************************************************!*\
  !*** ./lib/components/MyTemplateViewComponent/styles.css ***!
  \***********************************************************/
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(/*! !./../../../~/css-loader!./styles.css */ 55);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(/*! ./../../../~/style-loader/addStyles.js */ 52)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./styles.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./styles.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 55 */
/*!**************************************************************************!*\
  !*** ./~/css-loader!./lib/components/MyTemplateViewComponent/styles.css ***!
  \**************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(/*! ./../../../~/css-loader/lib/css-base.js */ 51)();
	// imports
	
	
	// module
	exports.push([module.id, "._2CPvTYUBfcUIrCvy9_qDDa{\n\tcolor: green;\n}", ""]);
	
	// exports
	exports.locals = {
		"segment": "_2CPvTYUBfcUIrCvy9_qDDa"
	};

/***/ },
/* 56 */
/*!*****************************************************************************************!*\
  !*** ./~/raw-loader!./lib/components/MyTemplateViewComponent/placeholder-template.html ***!
  \*****************************************************************************************/
/***/ function(module, exports) {

	module.exports = "<div class=\"segment\">Loading...</div>"

/***/ },
/* 57 */
/*!**********************************************************************************!*\
  !*** ./~/raw-loader!./lib/components/MyTemplateViewComponent/view-template.html ***!
  \**********************************************************************************/
/***/ function(module, exports) {

	module.exports = "<div class=\"segment\">This is my real info | name = {{name}}</div>"

/***/ },
/* 58 */
/*!**************************************************************!*\
  !*** ./lib/components/ComplexTemplateViewComponent/index.js ***!
  \**************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.ComplexTemplateViewComponent = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _affront = __webpack_require__(/*! affront */ 1);
	
	var _styles = __webpack_require__(/*! ./styles.css */ 59);
	
	var _styles2 = _interopRequireDefault(_styles);
	
	var _AddressControl = __webpack_require__(/*! ./controls/AddressControl */ 61);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// A template view component
	
	var ComplexTemplateViewComponent = exports.ComplexTemplateViewComponent = function (_Affront$TemplateView) {
		_inherits(ComplexTemplateViewComponent, _Affront$TemplateView);
	
		function ComplexTemplateViewComponent(routeUrl, domElement) {
			_classCallCheck(this, ComplexTemplateViewComponent);
	
			var templates = {
				'placeholder': __webpack_require__(/*! raw!./placeholder-template.html */ 65),
				'view': __webpack_require__(/*! raw!./view-template.html */ 66)
			};
	
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ComplexTemplateViewComponent).call(this, routeUrl, domElement, templates, _styles2.default));
	
			_this.subscribe('person');
	
			// add the AddressControl instance to this component
			_this.addControl(new _AddressControl.AddressControl('c1'));
			return _this;
		}
	
		// This method is invoked so the component can set itself up to render content;
		// i.e. boiler plate content (static content) must be displayed
		// ctxt: an UrlContext instance
	
	
		_createClass(ComplexTemplateViewComponent, [{
			key: 'urlChangedRender',
			value: function urlChangedRender(ctxt) {
				this.updateDOM(this.renderTemplate('placeholder', {}));
			}
	
			// This method is invoked so the component can render the actual data (storeItem)
			// ctxt: a StoreItem instance
	
		}, {
			key: 'notificationRender',
			value: function notificationRender(storeItem) {
				if (storeItem.key === 'person') {
					this.updateDOM(this.renderTemplate('view', storeItem.value));
				}
				console.log('[ComplexTemplateViewComponent.notificationRender] invoked | storeItem = ', storeItem, ' | routeUrl = ', this.routeUrl);
			}
		}, {
			key: 'hide',
			value: function hide() {
				this.updateDOM('', this.domElement);
			}
		}]);
	
		return ComplexTemplateViewComponent;
	}(_affront.Affront.TemplateViewComponent);
	
	;

/***/ },
/* 59 */
/*!****************************************************************!*\
  !*** ./lib/components/ComplexTemplateViewComponent/styles.css ***!
  \****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(/*! !./../../../~/css-loader!./styles.css */ 60);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(/*! ./../../../~/style-loader/addStyles.js */ 52)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./styles.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./styles.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 60 */
/*!*******************************************************************************!*\
  !*** ./~/css-loader!./lib/components/ComplexTemplateViewComponent/styles.css ***!
  \*******************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(/*! ./../../../~/css-loader/lib/css-base.js */ 51)();
	// imports
	
	
	// module
	exports.push([module.id, "._38Se5ayuNHQKGpAzj8WNCo{\n\tcolor: green;\n}", ""]);
	
	// exports
	exports.locals = {
		"segment": "_38Se5ayuNHQKGpAzj8WNCo"
	};

/***/ },
/* 61 */
/*!**************************************************************************************!*\
  !*** ./lib/components/ComplexTemplateViewComponent/controls/AddressControl/index.js ***!
  \**************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.AddressControl = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _affront = __webpack_require__(/*! affront */ 1);
	
	var _styles = __webpack_require__(/*! ./styles.css */ 62);
	
	var _styles2 = _interopRequireDefault(_styles);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var AddressControl = exports.AddressControl = function (_Affront$Control) {
		_inherits(AddressControl, _Affront$Control);
	
		function AddressControl(id) {
			_classCallCheck(this, AddressControl);
	
			var template = __webpack_require__(/*! raw!./view-template.html */ 64);
			return _possibleConstructorReturn(this, Object.getPrototypeOf(AddressControl).call(this, id, template, _styles2.default));
		}
	
		_createClass(AddressControl, [{
			key: 'onDOMUpdatedNotification',
			value: function onDOMUpdatedNotification(domContainerElement, eventObj) {
				console.log('[AddressControl] The DOM has been updated | domContainerElement.innerHTML = ', domContainerElement.innerHTML);
				console.log('[AddressControl] eventObj = ', eventObj);
			}
		}]);
	
		return AddressControl;
	}(_affront.Affront.Control);
	
	;

/***/ },
/* 62 */
/*!****************************************************************************************!*\
  !*** ./lib/components/ComplexTemplateViewComponent/controls/AddressControl/styles.css ***!
  \****************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(/*! !./../../../../../~/css-loader!./styles.css */ 63);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(/*! ./../../../../../~/style-loader/addStyles.js */ 52)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./styles.css", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./styles.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 63 */
/*!*******************************************************************************************************!*\
  !*** ./~/css-loader!./lib/components/ComplexTemplateViewComponent/controls/AddressControl/styles.css ***!
  \*******************************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(/*! ./../../../../../~/css-loader/lib/css-base.js */ 51)();
	// imports
	
	
	// module
	exports.push([module.id, "._19dQvnMkma9z7op9TQURYv{\n\tcolor: green;\n}", ""]);
	
	// exports
	exports.locals = {
		"segment": "_19dQvnMkma9z7op9TQURYv"
	};

/***/ },
/* 64 */
/*!***************************************************************************************************************!*\
  !*** ./~/raw-loader!./lib/components/ComplexTemplateViewComponent/controls/AddressControl/view-template.html ***!
  \***************************************************************************************************************/
/***/ function(module, exports) {

	module.exports = "<div class=\"segment\">\n\t<table>\n\t\t<tr>\n\t\t\t<td>Street:</td>\n\t\t\t<td>{{street1}}</td>\n\t\t\t<td>Apt:</td>\n\t\t\t<td>{{street2}}</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>City:</td>\n\t\t\t<td>{{city}}</td>\n\t\t\t<td>State:</td>\n\t\t\t<td>{{state}}</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>Zip:</td>\n\t\t\t<td>{{zip}}</td>\n\t\t\t<td>Country:</td>\n\t\t\t<td>{{country}}</td>\n\t\t</tr>\n\t</table>\n</div>"

/***/ },
/* 65 */
/*!**********************************************************************************************!*\
  !*** ./~/raw-loader!./lib/components/ComplexTemplateViewComponent/placeholder-template.html ***!
  \**********************************************************************************************/
/***/ function(module, exports) {

	module.exports = "<div class=\"segment\">Loading...</div>"

/***/ },
/* 66 */
/*!***************************************************************************************!*\
  !*** ./~/raw-loader!./lib/components/ComplexTemplateViewComponent/view-template.html ***!
  \***************************************************************************************/
/***/ function(module, exports) {

	module.exports = "<div class=\"segment\">\n\tThis is my real info<br/>\n\tname = {{name}}<br/>\n\t<hr/>\n\tThe address is:<br/>\n\t{{{AddressControl.c1}}}\n</div>"

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map