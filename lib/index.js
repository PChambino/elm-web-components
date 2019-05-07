"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

// adapted from https://github.com/PixelsCommander/ReactiveElements
var camelize = function camelize(str) {
  // adapted from https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case#2970667
  return str.toLowerCase().replace(/[-_]+/g, ' ').replace(/[^\w\s]/g, '').replace(/ (.)/g, function (firstChar) {
    return firstChar.toUpperCase();
  }).replace(/ /g, '');
};

var getProps = function getProps(el) {
  var props = {};

  for (var i = 0; i < el.attributes.length; i++) {
    var attribute = el.attributes[i];
    var name = camelize(attribute.name);
    props[name] = attribute.value;
  }

  return props;
};

var hasWarnedAboutMissingElmVersion = false;
var elmWebComponents = {
  __elmVersion: null,
  configure: function configure(elmVersion) {
    if (elmVersion !== '0.18' && elmVersion !== '0.19') {
      console.error('elm-web-components: elmVersion passed was not correct.');
      console.error('elm-web-components: it must be one of "0.18" or "0.19".');
    }

    this.__elmVersion = elmVersion;
  },
  register: function register(name, ElmComponent) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$setupPorts = _ref.setupPorts,
        setupPorts = _ref$setupPorts === void 0 ? function () {} : _ref$setupPorts,
        _ref$staticFlags = _ref.staticFlags,
        staticFlags = _ref$staticFlags === void 0 ? {} : _ref$staticFlags,
        _ref$onDetached = _ref.onDetached,
        onDetached = _ref$onDetached === void 0 ? function () {} : _ref$onDetached,
        _ref$mapFlags = _ref.mapFlags,
        mapFlags = _ref$mapFlags === void 0 ? function (flags) {
      return flags;
    } : _ref$mapFlags,
        _ref$onSetupError = _ref.onSetupError,
        onSetupError = _ref$onSetupError === void 0 ? function () {} : _ref$onSetupError;

    if (!this.__elmVersion) {
      if (!hasWarnedAboutMissingElmVersion) {
        console.error('elm-web-components: you need to configure the Elm version you need.');
        console.error('elm-web-components: call `elmWebComponents.configure()`, passing either "0.18" or "0.19".');
      }

      hasWarnedAboutMissingElmVersion = true;
      return;
    }

    var elmVersion = this.__elmVersion;

    var ElmElement =
    /*#__PURE__*/
    function (_HTMLElement) {
      _inherits(ElmElement, _HTMLElement);

      function ElmElement() {
        _classCallCheck(this, ElmElement);

        return _possibleConstructorReturn(this, _getPrototypeOf(ElmElement).apply(this, arguments));
      }

      _createClass(ElmElement, [{
        key: "connectedCallback",
        value: function connectedCallback() {
          var context = {};

          try {
            var props = Object.assign({}, getProps(this), staticFlags);
            if (Object.keys(props).length === 0) props = undefined;
            var flags = mapFlags(props);
            context.flags = flags;

            if (elmVersion === '0.19') {
              /* a change in Elm 0.19 means that ElmComponent.init now replaces the node you give it
               * whereas in 0.18 it rendered into it. To avoid Elm therefore destroying our custom element
               * we create a div that we let Elm render into, and manually clear any pre-rendered contents.
               */
              var elmDiv = document.createElement('div');
              this.innerHTML = '';
              this.appendChild(elmDiv);
              var elmElement = ElmComponent.init({
                flags: flags,
                node: elmDiv
              });
              setupPorts(elmElement.ports);
            } else if (elmVersion === '0.18') {
              var _elmElement = ElmComponent.embed(this, flags);

              setupPorts(_elmElement.ports);
            }
          } catch (error) {
            console.error(error);
            onSetupError(error, context);
          }
        }
      }, {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          onDetached();
        }
      }]);

      return ElmElement;
    }(_wrapNativeSuper(HTMLElement));

    customElements.define(name, ElmElement);
  }
};
module.exports = elmWebComponents;