/*!
 * vue-simple-markdown v1.1.4
 * (c) 2021 Milan Bačkonja
 * Released under the MIT License.
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("highlightjs"), require("node-emoji"));
	else if(typeof define === 'function' && define.amd)
		define(["highlightjs", "node-emoji"], factory);
	else if(typeof exports === 'object')
		exports["VueSimpleMarkdown"] = factory(require("highlightjs"), require("node-emoji"));
	else
		root["VueSimpleMarkdown"] = factory(root["highlightjs"], root["node-emoji"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_23__, __WEBPACK_EXTERNAL_MODULE_24__) {
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Utils = undefined;

var _utils = __webpack_require__(18);

exports.Utils = _utils.Utils;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(20)
}
var Component = __webpack_require__(21)(
  /* script */
  __webpack_require__(2),
  /* template */
  __webpack_require__(22),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-687a0492",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "C:\\laragon\\www\\packages\\vue-simple-markdown-master\\src\\vue-simple-markdown.component.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] vue-simple-markdown.component.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-687a0492", Component.options)
  } else {
    hotAPI.reload("data-v-687a0492", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueSimpleMarkdownParser = __webpack_require__(19);

exports.default = {
  name: 'vue-simple-markdown',
  props: {
    source: {
      type: [String, Number],
      default: ''
    },
    prerender: {
      type: Function,
      default: function _default(source) {
        return source;
      }
    },
    postrender: {
      type: Function,
      default: function _default(html) {
        return html;
      }
    },
    emoji: {
      type: Boolean,
      default: true
    },
    heading: {
      type: Boolean,
      default: true
    },
    highlight: {
      type: Boolean,
      default: true
    },
    horizontalLine: {
      type: Boolean,
      default: true
    },
    image: {
      type: Boolean,
      default: true
    },
    inlineCode: {
      type: Boolean,
      default: true
    },
    italic: {
      type: Boolean,
      default: true
    },
    link: {
      type: Boolean,
      default: true
    },
    linkify: {
      type: Boolean,
      default: true
    },
    lists: {
      type: Boolean,
      default: true
    },
    strong: {
      type: Boolean,
      default: true
    },
    blockquote: {
      type: Boolean,
      default: true
    },
    table: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    parsed: function parsed() {
      var source = this.prerender(this.source.toString());

      source = _vueSimpleMarkdownParser.VueSimpleMarkdownParser.parse(source, {
        emoji: this.emoji,
        heading: this.heading,
        highlight: this.highlight,
        horizontalLine: this.horizontalLine,
        image: this.image,
        inlineCode: this.inlineCode,
        italic: this.italic,
        link: this.link,
        linkify: this.linkify,
        lists: this.lists,
        strong: this.strong,
        blockquote: this.blockquote,
        table: this.table
      });

      return this.postrender(source);
    }
  }
}; //
//
//
//

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.version = exports.VueSimpleMarkdown = undefined;

var _vueSimpleMarkdownComponent = __webpack_require__(1);

var _vueSimpleMarkdownComponent2 = _interopRequireDefault(_vueSimpleMarkdownComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function plugin(Vue) {
  Vue.component('vue-simple-markdown', _vueSimpleMarkdownComponent2.default);
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

exports.default = plugin;

var version = '__VERSION__';
// Export all components too
exports.VueSimpleMarkdown = _vueSimpleMarkdownComponent2.default;
exports.version = version;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Emoji = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeEmoji = __webpack_require__(24);

var _nodeEmoji2 = _interopRequireDefault(_nodeEmoji);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SHORTCUTS = {
  angry: ['>:(', '>:-('],
  blush: [':")', ':-")'],
  broken_heart: ['</3', '<\\3'],
  confused: [':/', ':-/', ':\\', ':-\\'],
  cry: [":'(", ":'-(", ':,(', ':,-('],
  frowning: [':(', ':-('],
  heart: ['<3'],
  imp: [']:(', ']:-('],
  innocent: ['o:)', 'O:)', 'o:-)', 'O:-)', '0:)', '0:-)'],
  joy: [":')", ":'-)", ':,)', ':,-)', ":'D", ":'-D", ':,D', ':,-D'],
  kissing: [':*', ':-*'],
  laughing: ['x-)', 'X-)'],
  neutral_face: [':|', ':-|'],
  open_mouth: [':o', ':-o', ':O', ':-O'],
  rage: [':@', ':-@'],
  smile: [':D', ':-D'],
  smiley: [':)', ':-)'],
  smiling_imp: [']:)', ']:-)'],
  sob: [":,'(", ":,'-(", ';(', ';-('],
  stuck_out_tongue: [':P', ':-P'],
  sunglasses: ['8-)', 'B-)'],
  sweat: [',:(', ',:-('],
  sweat_smile: [',:)', ',:-)'],
  unamused: [':s', ':-S', ':z', ':-Z', ':$', ':-$'],
  wink: [';)', ';-)']
};

var Emoji = exports.Emoji = function () {
  function Emoji() {
    _classCallCheck(this, Emoji);
  }

  _createClass(Emoji, null, [{
    key: 'parse',
    value: function parse(source) {
      var _loop = function _loop(emoji) {
        SHORTCUTS[emoji].forEach(function (shortcut) {
          shortcut = shortcut.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
          var regex = '(^|\\s)' + shortcut + '(?![\\w\\/])';
          regex = new RegExp(regex, 'g');

          source = source.replace(regex, function (all, before) {
            return before + ':' + emoji + ':';
          });
        });
      };

      for (var emoji in SHORTCUTS) {
        _loop(emoji);
      }

      return _nodeEmoji2.default.emojify(source);
    }
  }, {
    key: 'RULE_NAME',
    get: function get() {
      return 'emoji';
    }
  }]);

  return Emoji;
}();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HEADINGS_REGEX = /^(#{1,6}) (.+)$/;

var Heading = exports.Heading = function () {
  function Heading() {
    _classCallCheck(this, Heading);
  }

  _createClass(Heading, null, [{
    key: 'parse',
    value: function parse(source) {
      var lines = source.split('\n');
      lines.forEach(function (line, index, lines) {
        if (HEADINGS_REGEX.test(line)) {
          var match = HEADINGS_REGEX.exec(line);
          lines[index] = line.replace(HEADINGS_REGEX, '<h' + match[1].length + '>$2</h' + match[1].length + '>');
        }
      });

      return lines.join('\n');
    }
  }, {
    key: 'RULE_NAME',
    get: function get() {
      return 'heading';
    }
  }]);

  return Heading;
}();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Highlight = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(0);

var _highlightjs = __webpack_require__(23);

var _highlightjs2 = _interopRequireDefault(_highlightjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CODE_BLOCK_REGEX = /([^```]*)``` ?(\w*)([\s\S]+?)```([^```]*)/g;

var Highlight = exports.Highlight = function () {
  function Highlight() {
    _classCallCheck(this, Highlight);
  }

  _createClass(Highlight, null, [{
    key: 'parse',
    value: function parse(source) {
      if (!source.match(CODE_BLOCK_REGEX)) {
        return _utils.Utils.escapeTagStart(source);
      }

      return source.replace(CODE_BLOCK_REGEX, function (all, sourceBeforeCode, language, source, sourceAfterCode) {
        source = source.replace(/^\n+|\n+$/g, '');

        if (language && _highlightjs2.default.getLanguage(language)) {
          return _utils.Utils.escapeTagStart(sourceBeforeCode) + '<pre><code class="hljs ' + language + '">' + _utils.Utils.escapeContent(_highlightjs2.default.highlight(language, source).value) + '</code></pre>' + _utils.Utils.escapeTagStart(sourceAfterCode);
        }

        return _utils.Utils.escapeTagStart(sourceBeforeCode) + '<pre><code class="hljs">' + _utils.Utils.escapeContent(_highlightjs2.default.highlightAuto(source).value) + '</code></pre>' + _utils.Utils.escapeTagStart(sourceAfterCode);
      });
    }
  }, {
    key: 'RULE_NAME',
    get: function get() {
      return 'highlight';
    }
  }]);

  return Highlight;
}();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HORIZONTAL_LINE_REGEX = /^(\*{3}|_{3}|-{3})$/;

var HorizontalLine = exports.HorizontalLine = function () {
  function HorizontalLine() {
    _classCallCheck(this, HorizontalLine);
  }

  _createClass(HorizontalLine, null, [{
    key: 'parse',
    value: function parse(source) {
      var lines = source.split('\n');
      lines.forEach(function (line, index, lines) {
        lines[index] = line.replace(HORIZONTAL_LINE_REGEX, '<hr />');
      });

      return lines.join('\n');
    }
  }, {
    key: 'RULE_NAME',
    get: function get() {
      return 'horizontalLine';
    }
  }]);

  return HorizontalLine;
}();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Img = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IMG_REGEX = /!\[(.*)\]\(((?:(http[s]?|ftp)?:?\/{0,2})[\w\/\-+?#&%=.:]+)\)/g;

var Img = exports.Img = function () {
  function Img() {
    _classCallCheck(this, Img);
  }

  _createClass(Img, null, [{
    key: 'parse',
    value: function parse(source) {
      return source.replace(IMG_REGEX, function (match, alt, src) {
        return '<img alt="' + _utils.Utils.escapeQuote(alt) + '" src="' + src + '">';
      });
    }
  }, {
    key: 'RULE_NAME',
    get: function get() {
      return 'images';
    }
  }]);

  return Img;
}();

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Table = exports.Emoji = exports.Heading = exports.Linkify = exports.Link = exports.Img = exports.Italic = exports.Strong = exports.Quote = exports.Lists = exports.HorizontalLine = exports.InlineCode = exports.Highlight = exports.RULES = undefined;

var _strong = __webpack_require__(16);

var _italic = __webpack_require__(11);

var _img = __webpack_require__(8);

var _link = __webpack_require__(12);

var _heading = __webpack_require__(5);

var _horizontalLine = __webpack_require__(7);

var _lists = __webpack_require__(14);

var _emoji = __webpack_require__(4);

var _inlineCode = __webpack_require__(10);

var _highlight = __webpack_require__(6);

var _linkify = __webpack_require__(13);

var _quote = __webpack_require__(15);

var _table = __webpack_require__(17);

var RULES = [_highlight.Highlight, _inlineCode.InlineCode, _horizontalLine.HorizontalLine, _lists.Lists, _quote.Quote, _strong.Strong, _italic.Italic, _img.Img, _link.Link, _linkify.Linkify, _heading.Heading, _emoji.Emoji, _inlineCode.InlineCode, _table.Table];

exports.RULES = RULES;
exports.Highlight = _highlight.Highlight;
exports.InlineCode = _inlineCode.InlineCode;
exports.HorizontalLine = _horizontalLine.HorizontalLine;
exports.Lists = _lists.Lists;
exports.Quote = _quote.Quote;
exports.Strong = _strong.Strong;
exports.Italic = _italic.Italic;
exports.Img = _img.Img;
exports.Link = _link.Link;
exports.Linkify = _linkify.Linkify;
exports.Heading = _heading.Heading;
exports.Emoji = _emoji.Emoji;
exports.Table = _table.Table;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InlineCode = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var INLINE_CODE_REGEX = /`(.+?)`/g;

var InlineCode = exports.InlineCode = function () {
  function InlineCode() {
    _classCallCheck(this, InlineCode);
  }

  _createClass(InlineCode, null, [{
    key: 'parse',
    value: function parse(source) {
      return source.replace(INLINE_CODE_REGEX, function (all, content) {
        return '<code class="vue-simple-markdown__inline-code">' + _utils.Utils.escapeContent(content) + '</code>';
      });
    }
  }, {
    key: 'RULE_NAME',
    get: function get() {
      return 'inlineCode';
    }
  }]);

  return InlineCode;
}();

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ITALIC_REGEX_1 = /(^|\s|"|')(?:_)(.+?)(?:_)/g;
var ITALIC_REGEX_2 = /(^|\s|"|')(?:\*)(.+?)(?:\*)/g;

var Italic = exports.Italic = function () {
  function Italic() {
    _classCallCheck(this, Italic);
  }

  _createClass(Italic, null, [{
    key: 'parse',
    value: function parse(source) {
      source = source.replace(ITALIC_REGEX_1, '$1<i>$2</i>');
      return source.replace(ITALIC_REGEX_2, '$1<i>$2</i>');
    }
  }, {
    key: 'RULE_NAME',
    get: function get() {
      return 'italic';
    }
  }]);

  return Italic;
}();

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LINK_REGEX = /\[(.+?)\]\(((?:(?:http[s]?|ftp):\/{2})?)([\w\/\-+?#=.:;!%&]+)\)/g;

var Link = exports.Link = function () {
  function Link() {
    _classCallCheck(this, Link);
  }

  _createClass(Link, null, [{
    key: 'parse',
    value: function parse(source) {
      return source.replace(LINK_REGEX, function (match, linkName, urlProtocolDomain, urlPath) {
        var url = urlProtocolDomain.trim() + urlPath.trim().replace(/:/g, '%3A');

        return '<a href="' + url + '" target="_blank">' + linkName + '</a>';
      });
    }
  }, {
    key: 'RULE_NAME',
    get: function get() {
      return 'link';
    }
  }]);

  return Link;
}();

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LINK_REGEX = /(^|\s|>)((?:http(?:s)?:\/\/.)(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6})\b([-a-zA-Z0-9@:;%_\+.~#?!&//=]*)/g;

var Linkify = exports.Linkify = function () {
  function Linkify() {
    _classCallCheck(this, Linkify);
  }

  _createClass(Linkify, null, [{
    key: 'parse',
    value: function parse(source) {
      return source.replace(LINK_REGEX, function (all, before, urlProtocolDomain, urlPath) {
        var url = urlProtocolDomain.trim() + urlPath.trim().replace(/:/g, '%3A');
        var href = url.substr(0, 4) !== 'http' ? 'http://' + url : url;

        return before + '<a href="' + href + '" target="_blank">' + url + '</a>';
      });
    }
  }, {
    key: 'RULE_NAME',
    get: function get() {
      return 'linkify';
    }
  }]);

  return Linkify;
}();

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UNORDERED_LIST_REGEX = /^( *)[\*\+\-] +(.*)/;
var ORDERED_LIST_REGEX = /^( *)\d+\. (.+)/;

var Lists = exports.Lists = function () {
  function Lists() {
    _classCallCheck(this, Lists);
  }

  _createClass(Lists, null, [{
    key: 'parse',
    value: function parse(source) {
      source = this.parseList(source, UNORDERED_LIST_REGEX, 'ul');
      source = this.parseList(source, ORDERED_LIST_REGEX, 'ol');
      return source;
    }
  }, {
    key: 'parseList',
    value: function parseList(source, regex, tag) {
      var _this = this;

      var lines = source.split('\n');
      var inList = false;
      var listNestingLevel = 0;

      lines.forEach(function (line, index) {
        if (regex.test(line)) {
          var match = regex.exec(line);
          var currentLineNestingLevel = match[1].length;

          if (!inList) {
            if (currentLineNestingLevel > 0) {
              return;
            }

            inList = true;
            lines[index] = line.replace(regex, '<' + tag + '><li>$2');
          } else {
            if (currentLineNestingLevel > listNestingLevel) {
              var lineStart = '';
              var nestingLevelDifference = currentLineNestingLevel - listNestingLevel;

              for (var i = 0; i < nestingLevelDifference; i++) {
                lineStart += '<' + tag + '>';
              }

              listNestingLevel = currentLineNestingLevel;
              lines[index] = line.replace(regex, lineStart + '<li>$2');
            } else if (currentLineNestingLevel < listNestingLevel) {
              var _lineStart = _this.closeList(listNestingLevel - currentLineNestingLevel - 1, tag);
              listNestingLevel = currentLineNestingLevel;
              lines[index] = line.replace(regex, _lineStart + '<li>$2');
            } else {
              lines[index] = line.replace(regex, '</li><li>$2');
            }
          }
        } else {
          if (inList) {
            inList = false;
            lines[index - 1] += _this.closeList(listNestingLevel, tag);
            listNestingLevel = 0;
          }
        }
      });

      if (inList) {
        lines[lines.length - 1] += this.closeList(listNestingLevel, tag);
        listNestingLevel = 0;
      }

      inList = false;
      return lines.join('\n');
    }
  }, {
    key: 'closeList',
    value: function closeList(listNestingLevel, tag) {
      var closeLine = '</li></' + tag + '>';

      for (listNestingLevel; listNestingLevel !== 0; listNestingLevel--) {
        closeLine += '</' + tag + '>';
      }
      return closeLine;
    }
  }, {
    key: 'RULE_NAME',
    get: function get() {
      return 'lists';
    }
  }]);

  return Lists;
}();

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QUOTE_REGEX = /^(>+)(.*)/;

var Quote = exports.Quote = function () {
  function Quote() {
    _classCallCheck(this, Quote);
  }

  _createClass(Quote, null, [{
    key: 'parse',
    value: function parse(source) {
      var _this = this;

      var lines = source.split('\n');
      var inQuote = false;
      var qouteNestingLevel = 0;

      lines.forEach(function (line, index) {
        if (QUOTE_REGEX.test(line)) {
          var match = QUOTE_REGEX.exec(line);
          var currentQuoteNestingLevel = match[1].length;

          if (!inQuote) {
            if (currentQuoteNestingLevel > 1) {
              return;
            }

            lines[index] = '<blockquote>' + match[2];
            inQuote = true;
            qouteNestingLevel = currentQuoteNestingLevel;
          } else {
            if (currentQuoteNestingLevel > qouteNestingLevel) {
              var lineStart = '';
              var nestingLevelDifference = currentQuoteNestingLevel - qouteNestingLevel;
              for (var i = 0; i < nestingLevelDifference; i++) {
                lineStart += '<blockquote>';
              }

              qouteNestingLevel = currentQuoteNestingLevel;
              lines[index] = '' + lineStart + match[2];
            } else if (currentQuoteNestingLevel < qouteNestingLevel) {
              var _lineStart = _this.closeQuote(qouteNestingLevel - currentQuoteNestingLevel);
              qouteNestingLevel = currentQuoteNestingLevel;
              lines[index] = '' + _lineStart + match[2];
            } else {
              lines[index] = match[2];
            }
          }
        } else {
          if (inQuote) {
            inQuote = false;
            lines[index - 1] += _this.closeQuote(qouteNestingLevel);
          }
        }
      });

      if (inQuote) {
        lines[lines.length - 1] += this.closeQuote(qouteNestingLevel);
      }

      inQuote = false;
      return lines.join('\n');
    }
  }, {
    key: 'closeQuote',
    value: function closeQuote(qouteNestingLevel) {
      var closeLine = '';

      for (qouteNestingLevel; qouteNestingLevel !== 0; qouteNestingLevel--) {
        closeLine += '</blockquote>';
      }

      return closeLine;
    }
  }, {
    key: 'RULE_NAME',
    get: function get() {
      return 'blockquote';
    }
  }]);

  return Quote;
}();

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STRONG_REGEX_1 = /(^|\s|"|')(?:__)(.+?)(?:__)/g;
var STRONG_REGEX_2 = /(^|\s|"|')(?:\*\*)(.+?)(?:\*\*)/g;

var Strong = exports.Strong = function () {
  function Strong() {
    _classCallCheck(this, Strong);
  }

  _createClass(Strong, null, [{
    key: 'parse',
    value: function parse(source) {
      source = source.replace(STRONG_REGEX_1, '$1<strong>$2</strong>');
      return source.replace(STRONG_REGEX_2, '$1<strong>$2</strong>');
    }
  }, {
    key: 'RULE_NAME',
    get: function get() {
      return 'strong';
    }
  }]);

  return Strong;
}();

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TABLE_REGEX = /(\|[^\r\n]*\|)\r?\n(\|(?::?[-]+:?\|)+)\r?\n((?:\|[^\r\n]*\|\r?\n)*)/g;

var Table = exports.Table = function () {
  function Table() {
    _classCallCheck(this, Table);
  }

  _createClass(Table, null, [{
    key: 'parse',
    value: function parse(source) {
      return source.replace(TABLE_REGEX, function (table, headers, columnAlignments, dataRows) {
        headers = headers.slice(1, -1).split('|');

        columnAlignments = columnAlignments.slice(1, -1).split('|').map(function (col) {
          var alignment = '';
          if (col.startsWith(':')) {
            alignment = 'left';
          }
          if (col.endsWith(':')) {
            alignment = 'right';
          }
          if (col.startsWith(':') && col.endsWith(':')) {
            alignment = 'center';
          }

          return alignment ? ' align="' + alignment + '"' : '';
        });

        if (columnAlignments.length !== headers.length) {
          return table;
        }

        dataRows = dataRows ? dataRows.trim().split('\n') : [];
        dataRows = dataRows.map(function (row) {
          return row.trim().slice(1, -1).split('|');
        });

        var tableHeaderHtml = headers.map(function (header, columnIndex) {
          return '<th' + columnAlignments[columnIndex] + '> ' + header.trim() + ' </th>';
        }).join('');

        var tableRowsHtml = dataRows.map(function (dataRow) {
          var cells = [];
          for (var column = 0; column < headers.length; column++) {
            cells.push('<td' + columnAlignments[column] + '> ' + (dataRow[column] ? dataRow[column].trim() : '') + ' </td>');
          }
          return '<tr> ' + cells.join('\n') + ' </tr>';
        });
        return '<table><thead><tr> ' + tableHeaderHtml + ' </tr></thead><tbody> ' + tableRowsHtml.join('\n') + ' </tbody></table>';
      });
    }
  }, {
    key: 'RULE_NAME',
    get: function get() {
      return 'table';
    }
  }]);

  return Table;
}();

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = exports.Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: 'escapeContent',
    value: function escapeContent(source) {
      return source.replace(/\*|_|-|#|`/gm, function (s) {
        return '&#' + s.charCodeAt(0) + ';';
      });
    }
  }, {
    key: 'escapeTagStart',
    value: function escapeTagStart(source) {
      return source.replace(/\</g, '&lt;');
    }
  }, {
    key: 'escapeQuote',
    value: function escapeQuote(source) {
      return source.replace(/"/g, '&quot;');
    }
  }]);

  return Utils;
}();

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VueSimpleMarkdownParser = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rules = __webpack_require__(9);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VueSimpleMarkdownParser = function () {
  function VueSimpleMarkdownParser() {
    _classCallCheck(this, VueSimpleMarkdownParser);
  }

  _createClass(VueSimpleMarkdownParser, [{
    key: 'parse',
    value: function parse(source, options) {
      _rules.RULES.forEach(function (parser) {
        if (options[parser.RULE_NAME] !== undefined && !options[parser.RULE_NAME]) {
          return;
        }

        source = parser.parse(source);
      });

      return source;
    }
  }]);

  return VueSimpleMarkdownParser;
}();

var vueSimpleMarkdownParser = new VueSimpleMarkdownParser();
exports.VueSimpleMarkdownParser = vueSimpleMarkdownParser;

/***/ }),
/* 20 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 21 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "vue-simple-markdown markdown-body",
    domProps: {
      "innerHTML": _vm._s(_vm.parsed)
    }
  })
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-687a0492", module.exports)
  }
}

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_23__;

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_24__;

/***/ })
/******/ ]);
});