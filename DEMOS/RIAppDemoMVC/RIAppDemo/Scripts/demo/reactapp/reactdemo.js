var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("abstractions/tabs", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("testobject", ["require", "exports", "jriapp"], function (require, exports, RIAPP) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestObject = void 0;
    var demoRows = [{ num: 1, someVal: "someVal1" }, { num: 2, someVal: "someVal2" }, { num: 3, someVal: "someVal3" }, { num: 4, someVal: "someVal4" }, { num: 5, someVal: "someVal5" }];
    var demoTabs = [{
            name: "tab1", heading: {
                templateId: "tabHeadingTemplate",
                dataContext: { text: "heading tab1" }
            },
            content: {
                templateId: "tabContentTemplate1",
                dataContext: { text: "content tab1", info: "displayed in inside of template", description: "This is a new style <strong>templated</strong> React component incapsulated into an Element View" }
            }
        },
        {
            name: "tab2", heading: {
                templateId: "tabHeadingTemplate",
                dataContext: { text: "heading tab2" }
            },
            content: {
                templateId: "tabContentTemplate2",
                dataContext: {
                    text: "content tab2", otherData: {
                        subj: "Cloud Computing / Networking & Server",
                        title: "Pro PowerShell for Amazon Web Services, 2nd Edition"
                    }, description: "you can also use objects derived from a BaseObject or a CollectionItem instead of plain objects: <em>in this case properties will be editable through databinding</em>"
                }
            }
        },
        {
            name: "tab3", heading: {
                templateId: "tabHeadingTemplate",
                dataContext: { text: "heading tab3" }
            },
            content: {
                templateId: "tabContentTemplate3",
                dataContext: {
                    text: "content tab3", details: {
                        cover: "Paperback", pages: 616
                    }, description: "<em>and again - this is displayed in template</em>"
                }
            }
        }];
    var TestObject = (function (_super) {
        __extends(TestObject, _super);
        function TestObject(app) {
            var _this = _super.call(this, app) || this;
            _this._testValue = "";
            _this._page = 1;
            _this._rows = demoRows;
            _this._reverseCommand = new RIAPP.Command(function () {
                _this.rows = __spreadArray([], _this._rows).reverse();
            });
            _this._selectedRow = null;
            _this._tabs = demoTabs;
            return _this;
        }
        TestObject.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(TestObject.prototype, "testValue", {
            get: function () {
                return this._testValue;
            },
            set: function (v) {
                if (this._testValue !== v) {
                    this._testValue = v;
                    this.objEvents.raiseProp("testValue");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TestObject.prototype, "rows", {
            get: function () {
                return this._rows;
            },
            set: function (v) {
                if (this._rows !== v) {
                    this._rows = v;
                    this.objEvents.raiseProp("rows");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TestObject.prototype, "page", {
            get: function () {
                return this._page;
            },
            set: function (v) {
                if (this._page !== v) {
                    this._page = v;
                    this.objEvents.raiseProp("page");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TestObject.prototype, "reverseCommand", {
            get: function () { return this._reverseCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TestObject.prototype, "selectedRow", {
            get: function () {
                return this._selectedRow;
            },
            set: function (v) {
                if (this._selectedRow !== v) {
                    this._selectedRow = v;
                    this.objEvents.raiseProp("selectedRow");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TestObject.prototype, "tabs", {
            get: function () {
                return this._tabs;
            },
            enumerable: false,
            configurable: true
        });
        return TestObject;
    }(RIAPP.ViewModel));
    exports.TestObject = TestObject;
});
define("app", ["require", "exports", "jriapp", "testobject"], function (require, exports, RIAPP, testobject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DemoApplication = void 0;
    var tabs = ["Description", "Reviews"];
    var tabs2 = ["tab1", "tab2", "tab3"];
    var DemoApplication = (function (_super) {
        __extends(DemoApplication, _super);
        function DemoApplication(options) {
            var _this = _super.call(this, options) || this;
            _this._testObj = null;
            _this._interval = null;
            _this._activeTabName = undefined;
            _this._activeTabName2 = undefined;
            return _this;
        }
        DemoApplication.prototype.onStartUp = function () {
            var self = this;
            this._testObj = new testobject_1.TestObject(this);
            this.objEvents.addOnError(function (_s, args) {
                debugger;
                args.isHandled = true;
                alert(args.error.message);
            });
            this._interval = setInterval(function () {
                if (self.activeTabName === tabs[0])
                    self.activeTabName = tabs[1];
                else
                    self.activeTabName = tabs[0];
            }, 10000);
            _super.prototype.onStartUp.call(this);
        };
        DemoApplication.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            if (!!this._interval) {
                clearInterval(this._interval);
                this._interval = null;
            }
            this.setDisposing();
        };
        Object.defineProperty(DemoApplication.prototype, "activeTabName", {
            get: function () {
                return this._activeTabName;
            },
            set: function (v) {
                if (this._activeTabName !== v) {
                    this._activeTabName = v;
                    this.objEvents.raiseProp("activeTabName");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DemoApplication.prototype, "activeTabName2", {
            get: function () {
                return this._activeTabName2;
            },
            set: function (v) {
                if (this._activeTabName2 !== v) {
                    this._activeTabName2 = v;
                    this.objEvents.raiseProp("activeTabName2");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DemoApplication.prototype, "testObj", {
            get: function () {
                return this._testObj;
            },
            enumerable: false,
            configurable: true
        });
        return DemoApplication;
    }(RIAPP.Application));
    exports.DemoApplication = DemoApplication;
});
define("views/react", ["require", "exports", "jriapp", "jriapp_ui", "react-dom", "redux"], function (require, exports, RIAPP, uiMOD, react_dom_1, Redux) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReactElView = exports.mergeOptions = void 0;
    function mergeOptions(options, defaults) {
        var ret = {};
        Object.keys(defaults).forEach(function (key) {
            if (!RIAPP.Utils.check.isNt(options[key]))
                ret[key] = options[key];
            else
                ret[key] = defaults[key];
        });
        return ret;
    }
    exports.mergeOptions = mergeOptions;
    var ReactElView = (function (_super) {
        __extends(ReactElView, _super);
        function ReactElView(el, options, reducer) {
            var _this = _super.call(this, el, options) || this;
            _this._isRendering = false;
            _this._isDirty = false;
            _this._isMounted = false;
            _this._store = Redux.createStore(reducer);
            _this._state = _this._store.getState();
            _this._unsubscribe = _this._store.subscribe(function () {
                if (_this.getIsStateDirty())
                    return;
                var previous = _this._state;
                var current = _this._store.getState();
                _this._state = current;
                if (_this.storeChanged(current, previous)) {
                    _this._renderView();
                }
            });
            return _this;
        }
        ReactElView.prototype._render = function () {
            var _this = this;
            if (this.getIsStateDirty()) {
                return;
            }
            if (this._isRendering) {
                this._isDirty = true;
                return;
            }
            this._isRendering = true;
            this._isDirty = false;
            react_dom_1.render(this.getMarkup(), this.el, function () {
                _this._isRendering = false;
                if (_this._isDirty) {
                    _this._render();
                }
            });
        };
        ReactElView.prototype._renderView = function () {
            this._isDirty = true;
            if (this._isMounted) {
                this._render();
            }
        };
        ReactElView.prototype.viewMounted = function () {
            this._isMounted = true;
            this._renderView();
        };
        ReactElView.prototype.dispatch = function (action) {
            this._store.dispatch(action);
        };
        ReactElView.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            this._isRendering = false;
            this._isDirty = false;
            this._isMounted = false;
            this._unsubscribe();
            react_dom_1.unmountComponentAtNode(this.el);
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(ReactElView.prototype, "store", {
            get: function () {
                return this._store;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ReactElView.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: false,
            configurable: true
        });
        ReactElView.prototype.toString = function () {
            return "ReactElView";
        };
        return ReactElView;
    }(uiMOD.BaseElView));
    exports.ReactElView = ReactElView;
});
define("actions/common", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.propertyChanged = void 0;
    function propertyChanged(name, value) {
        return { type: "CHANGE_PROP", name: name, value: value };
    }
    exports.propertyChanged = propertyChanged;
});
define("views/simple", ["require", "exports", "react", "views/react", "actions/common"], function (require, exports, React, react_1, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initModule = exports.SimpleElView = void 0;
    var spacerStyle = {
        marginLeft: '15px',
        marginRight: '5px',
        display: 'inline-block'
    };
    var spanStyle = {
        color: 'blue'
    };
    var _reducer = function (initialState, state, action) {
        var _a;
        switch (action.type) {
            case "CHANGE_PROP":
                return __assign(__assign({}, state), (_a = {}, _a[action.name] = action.value, _a));
            default:
                return state || initialState;
        }
    };
    var reducer = function (initialState) { return function (state, action) { return _reducer(initialState, state, action); }; };
    var defaults = { value: "", title: "" };
    var SimpleElView = (function (_super) {
        __extends(SimpleElView, _super);
        function SimpleElView(el, options) {
            var _this = this;
            var initialState = react_1.mergeOptions(options, defaults);
            _this = _super.call(this, el, options, reducer(initialState)) || this;
            return _this;
        }
        SimpleElView.prototype.storeChanged = function (current, previous) {
            var shouldRerender = false;
            if (current.title !== previous.title) {
                this.objEvents.raiseProp("title");
                shouldRerender = true;
            }
            if (current.value !== previous.value) {
                this.objEvents.raiseProp("value");
                shouldRerender = true;
            }
            return shouldRerender;
        };
        SimpleElView.prototype.getMarkup = function () {
            var _this = this;
            var _a = this.state, title = _a.title, value = _a.value;
            return (React.createElement(React.Fragment, null,
                React.createElement("label", { style: { display: 'block' } }, title ? title : 'This is a React component'),
                React.createElement("input", { style: { width: '150px', display: 'inline-block' }, value: value, onChange: function (e) { _this.value = e.target.value; } }),
                React.createElement("div", { style: spacerStyle },
                    React.createElement("span", { style: { marginRight: '5px' } }, "You entered: "),
                    React.createElement("span", { className: "text-success", style: spanStyle }, value))));
        };
        Object.defineProperty(SimpleElView.prototype, "value", {
            get: function () {
                return this.state.value;
            },
            set: function (v) {
                this.dispatch(common_1.propertyChanged("value", v));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SimpleElView.prototype, "title", {
            get: function () {
                return this.state.title;
            },
            set: function (v) {
                this.dispatch(common_1.propertyChanged("title", v));
            },
            enumerable: false,
            configurable: true
        });
        SimpleElView.prototype.toString = function () {
            return "SimpleElView";
        };
        return SimpleElView;
    }(react_1.ReactElView));
    exports.SimpleElView = SimpleElView;
    function initModule(app) {
        app.registerElView("simpleview", SimpleElView);
    }
    exports.initModule = initModule;
});
define("abstractions/pager", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/pager", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BASE_SHIFT = 0;
    var TITLE_SHIFT = 1;
    var TITLES = {
        first: 'First',
        prev: '\u00AB',
        prevSet: '...',
        nextSet: '...',
        next: '\u00BB',
        last: 'Last'
    };
    var Pager = (function (_super) {
        __extends(Pager, _super);
        function Pager(props) {
            var _this = _super.call(this, props) || this;
            _this.handleFirstPage = _this.handleFirstPage.bind(_this);
            _this.handlePreviousPage = _this.handlePreviousPage.bind(_this);
            _this.handleNextPage = _this.handleNextPage.bind(_this);
            _this.handleLastPage = _this.handleLastPage.bind(_this);
            _this.handleMorePrevPages = _this.handleMorePrevPages.bind(_this);
            _this.handleMoreNextPages = _this.handleMoreNextPages.bind(_this);
            _this.handlePageChanged = _this.handlePageChanged.bind(_this);
            return _this;
        }
        Pager.prototype.getTitles = function (key) {
            return this.props.titles[key] || TITLES[key];
        };
        Pager.prototype.calcBlocks = function () {
            var props = this.props;
            var total = props.total;
            var blockSize = props.visiblePages;
            var current = props.current + TITLE_SHIFT;
            var blocks = Math.ceil(total / blockSize);
            var currBlock = Math.ceil(current / blockSize) - TITLE_SHIFT;
            return {
                total: blocks,
                current: currBlock,
                size: blockSize,
            };
        };
        Pager.prototype.isPrevDisabled = function () {
            return this.props.current <= BASE_SHIFT;
        };
        Pager.prototype.isNextDisabled = function () {
            return this.props.current >= (this.props.total - TITLE_SHIFT);
        };
        Pager.prototype.isPrevMoreHidden = function () {
            var blocks = this.calcBlocks();
            return (blocks.total === TITLE_SHIFT) || (blocks.current === BASE_SHIFT);
        };
        Pager.prototype.isNextMoreHidden = function () {
            var blocks = this.calcBlocks();
            return (blocks.total === TITLE_SHIFT) || (blocks.current === (blocks.total - TITLE_SHIFT));
        };
        Pager.prototype.visibleRange = function () {
            var blocks = this.calcBlocks();
            var start = blocks.current * blocks.size;
            var delta = this.props.total - start;
            var end = start + ((delta > blocks.size) ? blocks.size : delta);
            return [start + TITLE_SHIFT, end + TITLE_SHIFT];
        };
        Pager.prototype.handleFirstPage = function () {
            if (!this.isPrevDisabled()) {
                this.handlePageChanged(BASE_SHIFT);
            }
        };
        Pager.prototype.handlePreviousPage = function () {
            if (!this.isPrevDisabled()) {
                this.handlePageChanged(this.props.current - TITLE_SHIFT);
            }
        };
        Pager.prototype.handleNextPage = function () {
            if (!this.isNextDisabled()) {
                this.handlePageChanged(this.props.current + TITLE_SHIFT);
            }
        };
        Pager.prototype.handleLastPage = function () {
            if (!this.isNextDisabled()) {
                this.handlePageChanged(this.props.total - TITLE_SHIFT);
            }
        };
        Pager.prototype.handleMorePrevPages = function () {
            var blocks = this.calcBlocks();
            this.handlePageChanged((blocks.current * blocks.size) - TITLE_SHIFT);
        };
        Pager.prototype.handleMoreNextPages = function () {
            var blocks = this.calcBlocks();
            this.handlePageChanged((blocks.current + TITLE_SHIFT) * blocks.size);
        };
        Pager.prototype.handlePageChanged = function (num) {
            var handler = this.props.onPageChanged;
            if (!!handler)
                handler(num);
        };
        Pager.prototype.renderPages = function (pair) {
            var _this = this;
            return range(pair[0], pair[1]).map(function (num, idx) {
                var current = num - TITLE_SHIFT;
                var onClick = _this.handlePageChanged.bind(_this, current);
                var isActive = (_this.props.current === current);
                return (React.createElement(Page, { key: idx, index: idx, isActive: isActive, className: "btn-numbered-page", onClick: onClick }, num));
            });
        };
        Pager.prototype.render = function () {
            var titles = this.getTitles.bind(this);
            var className = "pagination";
            if (this.props.className) {
                className += " " + this.props.className;
            }
            return (React.createElement("nav", null,
                React.createElement("ul", { className: className },
                    React.createElement(Page, { className: "btn-first-page", key: "btn-first-page", isDisabled: this.isPrevDisabled(), onClick: this.handleFirstPage }, titles('first')),
                    React.createElement(Page, { className: "btn-prev-page", key: "btn-prev-page", isDisabled: this.isPrevDisabled(), onClick: this.handlePreviousPage }, titles('prev')),
                    React.createElement(Page, { className: "btn-prev-more", key: "btn-prev-more", isHidden: this.isPrevMoreHidden(), onClick: this.handleMorePrevPages }, titles('prevSet')),
                    this.renderPages(this.visibleRange()),
                    React.createElement(Page, { className: "btn-next-more", key: "btn-next-more", isHidden: this.isNextMoreHidden(), onClick: this.handleMoreNextPages }, titles('nextSet')),
                    React.createElement(Page, { className: "btn-next-page", key: "btn-next-page", isDisabled: this.isNextDisabled(), onClick: this.handleNextPage }, titles('next')),
                    React.createElement(Page, { className: "btn-last-page", key: "btn-last-page", isDisabled: this.isNextDisabled(), onClick: this.handleLastPage }, titles('last')))));
        };
        return Pager;
    }(React.Component));
    var Page = function (props) {
        if (props.isHidden)
            return null;
        var baseCss = props.className ? props.className + " " : '';
        var fullCss = "" + baseCss + (props.isActive ? ' active' : '') + (props.isDisabled ? ' disabled' : '');
        return (React.createElement("li", { key: props.index, className: fullCss },
            React.createElement("a", { onClick: props.onClick }, props.children)));
    };
    function range(start, end) {
        var res = [];
        for (var i = start; i < end; i++) {
            res.push(i);
        }
        return res;
    }
    exports.default = Pager;
});
define("components/connected-pager", ["require", "exports", "react-redux", "actions/common", "components/pager"], function (require, exports, react_redux_1, common_2, pager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mapStateToProps = function (storeData) {
        return storeData;
    };
    var mapDispatchToProps = function (dispatch) {
        return {
            onPageChanged: function (newPage) {
                dispatch(common_2.propertyChanged("current", newPage));
            }
        };
    };
    exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(pager_1.default);
});
define("views/pager", ["require", "exports", "react", "react-redux", "views/react", "actions/common", "components/connected-pager"], function (require, exports, React, react_redux_2, react_2, common_3, connected_pager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initModule = exports.PagerElView = void 0;
    var _reducer = function (initialState, state, action) {
        var _a;
        switch (action.type) {
            case "CHANGE_PROP":
                return __assign(__assign({}, state), (_a = {}, _a[action.name] = action.value, _a));
            default:
                return state || initialState;
        }
    };
    var reducer = function (initialState) { return function (state, action) { return _reducer(initialState, state, action); }; };
    var defaults = { total: 20, current: 6, visiblePages: 7 };
    var PagerElView = (function (_super) {
        __extends(PagerElView, _super);
        function PagerElView(el, options) {
            var _this = this;
            var initialState = react_2.mergeOptions(options, defaults);
            _this = _super.call(this, el, options, reducer(initialState)) || this;
            return _this;
        }
        PagerElView.prototype.storeChanged = function (current, previous) {
            var shouldRerender = false;
            if (current.total !== previous.total) {
                this.objEvents.raiseProp("total");
            }
            if (current.current !== previous.current) {
                this.objEvents.raiseProp("current");
            }
            if (current.visiblePages !== previous.visiblePages) {
                this.objEvents.raiseProp("visiblePages");
            }
            return shouldRerender;
        };
        PagerElView.prototype.getMarkup = function () {
            return (React.createElement(react_redux_2.Provider, { store: this.store },
                React.createElement(connected_pager_1.default, { titles: { first: '<|', last: '|>' } })));
        };
        Object.defineProperty(PagerElView.prototype, "total", {
            get: function () {
                return this.state.total;
            },
            set: function (v) {
                this.dispatch(common_3.propertyChanged("total", v));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PagerElView.prototype, "current", {
            get: function () {
                return this.state.current;
            },
            set: function (v) {
                this.dispatch(common_3.propertyChanged("current", v));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PagerElView.prototype, "visiblePages", {
            get: function () {
                return this.state.visiblePages;
            },
            set: function (v) {
                this.dispatch(common_3.propertyChanged("visiblePages", v));
            },
            enumerable: false,
            configurable: true
        });
        PagerElView.prototype.toString = function () {
            return "PagerElView";
        };
        return PagerElView;
    }(react_2.ReactElView));
    exports.PagerElView = PagerElView;
    function initModule(app) {
        app.registerElView("pagerview", PagerElView);
    }
    exports.initModule = initModule;
});
define("abstractions/templated", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/template", ["require", "exports", "react", "jriapp/template", "jriapp_shared/utils/weakmap"], function (require, exports, React, template_1, weakmap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var weakmap = weakmap_1.createWeakMap();
    function _updateTemplate(el, props) {
        if (!!el) {
            var template = _getTemplate(el);
            if (!!template) {
                template.templateID = props.templateId;
                template.dataContext = props.dataContext;
            }
        }
    }
    function _disposeTemplate(el) {
        if (!!el) {
            var template = weakmap.get(el);
            if (!!template) {
                template.dispose();
                weakmap.delete(el);
            }
        }
    }
    function _getTemplate(el) {
        if (!!el) {
            var template = weakmap.get(el);
            if (!template) {
                template = template_1.createTemplate({ parentEl: el });
                weakmap.set(el, template);
            }
            return template;
        }
        else {
            return null;
        }
    }
    var Template = (function (_super) {
        __extends(Template, _super);
        function Template(props) {
            var _this = _super.call(this, props) || this;
            _this._handleClick = function (e) {
                if (!!_this.props.onClick) {
                    _this.props.onClick(_this.props.dataContext);
                }
            };
            _this._setRef = function (element) {
                if (_this._elRef !== element) {
                    _disposeTemplate(_this._elRef);
                    _this._elRef = element;
                }
            };
            _this._elRef = null;
            return _this;
        }
        Template.prototype.componentDidMount = function () {
            _updateTemplate(this._elRef, this.props);
        };
        Template.prototype.componentDidUpdate = function () {
            _updateTemplate(this._elRef, this.props);
        };
        Template.prototype.shouldComponentUpdate = function (nextProps) {
            var templateChanged = this.props.dataContext !== nextProps.dataContext || this.props.templateId !== nextProps.templateId;
            var res = this.props.className !== nextProps.className || this.props.style !== nextProps.style || this.props.onClick !== nextProps.onClick;
            if (templateChanged && !res) {
                if (!!this._elRef) {
                    _updateTemplate(this._elRef, nextProps);
                }
                else {
                    res = true;
                }
            }
            return res;
        };
        Template.prototype.render = function () {
            var style = this.props.style ? this.props.style : {};
            var css = this.props.className ? this.props.className : "";
            return React.createElement("div", { onClick: this._handleClick, className: css, style: style, ref: this._setRef });
        };
        return Template;
    }(React.Component));
    exports.default = Template;
});
define("views/templated", ["require", "exports", "react", "views/react", "actions/common", "components/template"], function (require, exports, React, react_3, common_4, template_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initModule = exports.TemplatedElView = void 0;
    var rowStyle = {
        display: 'inline-block',
    };
    var _reducer = function (initialState, state, action) {
        var _a;
        switch (action.type) {
            case "CHANGE_PROP":
                return __assign(__assign({}, state), (_a = {}, _a[action.name] = action.value, _a));
            default:
                return state || initialState;
        }
    };
    var reducer = function (initialState) { return function (state, action) { return _reducer(initialState, state, action); }; };
    var defaults = { templateId: "", keyName: "", selectedRow: null };
    var TemplatedElView = (function (_super) {
        __extends(TemplatedElView, _super);
        function TemplatedElView(el, options) {
            var _this = this;
            var initialState = react_3.mergeOptions(options, defaults);
            _this = _super.call(this, el, options, reducer(initialState)) || this;
            _this._handleClick = _this._handleClick.bind(_this);
            return _this;
        }
        TemplatedElView.prototype._handleClick = function (row) {
            this.selectedRow = row;
        };
        TemplatedElView.prototype.storeChanged = function (current, previous) {
            var shouldRerender = false;
            if (current.templateId !== previous.templateId) {
                this.objEvents.raiseProp("templateId");
                shouldRerender = true;
            }
            if (current.rows !== previous.rows) {
                this.objEvents.raiseProp("rows");
                shouldRerender = true;
            }
            if (current.selectedRow !== previous.selectedRow) {
                this.objEvents.raiseProp("selectedRow");
                shouldRerender = true;
            }
            return shouldRerender;
        };
        TemplatedElView.prototype.getMarkup = function () {
            var _this = this;
            var _a = this.state, keyName = _a.keyName, templateId = _a.templateId, rows = _a.rows, selectedRow = _a.selectedRow;
            return (React.createElement(React.Fragment, null, rows.map(function (row) {
                return (React.createElement(template_2.default, { key: "" + row[keyName], onClick: _this._handleClick, className: (!!selectedRow && selectedRow[keyName] === row[keyName]) ? 'demo-row selected' : 'demo-row', style: rowStyle, templateId: templateId, dataContext: row }));
            })));
        };
        Object.defineProperty(TemplatedElView.prototype, "templateId", {
            get: function () {
                return this.state.templateId;
            },
            set: function (v) {
                this.dispatch(common_4.propertyChanged("templateId", v));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TemplatedElView.prototype, "rows", {
            get: function () {
                return this.state.rows;
            },
            set: function (v) {
                this.dispatch(common_4.propertyChanged("rows", v));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TemplatedElView.prototype, "keyName", {
            get: function () {
                return this.state.keyName;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TemplatedElView.prototype, "selectedRow", {
            get: function () {
                return this.state.selectedRow;
            },
            set: function (v) {
                this.dispatch(common_4.propertyChanged("selectedRow", v));
            },
            enumerable: false,
            configurable: true
        });
        TemplatedElView.prototype.toString = function () {
            return "TemplatedElView";
        };
        return TemplatedElView;
    }(react_3.ReactElView));
    exports.TemplatedElView = TemplatedElView;
    function initModule(app) {
        app.registerElView("templatedview", TemplatedElView);
    }
    exports.initModule = initModule;
});
define("components/tabs", ["require", "exports", "react", "components/template"], function (require, exports, React, template_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Tab = function (props) {
        return (React.createElement(template_3.default, { onClick: function () {
                if (props.onClick) {
                    props.onClick(props.name);
                }
            }, className: props.isActive ? "demo-tab active" : "demo-tab", templateId: props.heading.templateId, dataContext: props.heading.dataContext }));
    };
    var Tabs = (function (_super) {
        __extends(Tabs, _super);
        function Tabs() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._handleTabClick = function (name) {
                if (!!_this.props.onClick)
                    _this.props.onClick(name);
            };
            return _this;
        }
        Tabs.prototype.render = function () {
            var _this = this;
            var activeTab = null;
            var _a = this.props, tabs = _a.tabs, activeName = _a.activeName;
            if (!!activeName) {
                var temp = tabs.filter(function (t) { return t.name === activeName; });
                if (temp.length > 0)
                    activeTab = temp[0];
            }
            if (!activeTab && tabs.length > 0) {
                activeTab = tabs[0];
            }
            return (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "demo-tabs" }, tabs.map(function (tab) {
                    return (React.createElement(Tab, { key: tab.name, onClick: _this._handleTabClick, name: tab.name, heading: tab.heading, isActive: activeTab === tab }));
                })),
                !!activeTab && (React.createElement(template_3.default, { className: "demo-tabs-content", templateId: activeTab.content.templateId, dataContext: activeTab.content.dataContext })),
                !activeTab && (React.createElement("div", { className: "demo-tabs-content" }))));
        };
        return Tabs;
    }(React.Component));
    exports.default = Tabs;
});
define("views/tabs", ["require", "exports", "react", "views/react", "actions/common", "components/tabs"], function (require, exports, React, react_4, common_5, tabs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initModule = exports.TabsElView = void 0;
    var _reducer = function (initialState, state, action) {
        var _a;
        switch (action.type) {
            case "CHANGE_PROP":
                return __assign(__assign({}, state), (_a = {}, _a[action.name] = action.value, _a));
            default:
                return state || initialState;
        }
    };
    var reducer = function (initialState) { return function (state, action) { return _reducer(initialState, state, action); }; };
    var defaults = { activeTabName: "", tabs: [] };
    var TabsElView = (function (_super) {
        __extends(TabsElView, _super);
        function TabsElView(el, options) {
            var _this = this;
            var initialState = react_4.mergeOptions(options, defaults);
            _this = _super.call(this, el, options, reducer(initialState)) || this;
            return _this;
        }
        TabsElView.prototype.storeChanged = function (current, previous) {
            var shouldRerender = false;
            if (current.activeTabName !== previous.activeTabName) {
                this.objEvents.raiseProp("activeTabName");
                shouldRerender = true;
            }
            if (current.tabs !== previous.tabs) {
                this.objEvents.raiseProp("tabs");
                shouldRerender = true;
            }
            return shouldRerender;
        };
        TabsElView.prototype.getMarkup = function () {
            var _this = this;
            return (React.createElement(tabs_1.default, { onClick: function (name) { _this.activeTabName = name; }, activeName: this.activeTabName, tabs: this.tabs }));
        };
        Object.defineProperty(TabsElView.prototype, "activeTabName", {
            get: function () {
                return this.state.activeTabName;
            },
            set: function (v) {
                this.dispatch(common_5.propertyChanged("activeTabName", v));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TabsElView.prototype, "tabs", {
            get: function () {
                return this.state.tabs;
            },
            set: function (v) {
                this.dispatch(common_5.propertyChanged("tabs", v));
            },
            enumerable: false,
            configurable: true
        });
        TabsElView.prototype.toString = function () {
            return "TabsElView";
        };
        return TabsElView;
    }(react_4.ReactElView));
    exports.TabsElView = TabsElView;
    function initModule(app) {
        app.registerElView("tabsview", TabsElView);
    }
    exports.initModule = initModule;
});
define("components/tabs-old2", ["require", "exports", "react", "react"], function (require, exports, React, react_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TabsContext = react_5.createContext({ activeContent: null, activeName: null, setActiveContent: null });
    var Tab = function (props) {
        var propsRef = react_5.useRef(null);
        var context = react_5.useContext(TabsContext);
        var activeName = context.activeName;
        var name = props.name, children = props.children, heading = props.heading;
        react_5.useEffect(function () {
            propsRef.current = props;
            if (!context.activeContent && name === context.activeName) {
                context.setActiveContent(name, children);
            }
        });
        var handleTabClick = react_5.useCallback(function (e) {
            var _a = propsRef.current, name = _a.name, children = _a.children;
            context.setActiveContent(name, children);
            if (!!context.handleTabClick) {
                context.handleTabClick(name);
            }
        }, [context]);
        return (React.createElement("div", { onClick: handleTabClick, className: name === activeName ? "demo-tab active" : "demo-tab" }, heading()));
    };
    var Tabs = (function (_super) {
        __extends(Tabs, _super);
        function Tabs(props) {
            var _this = _super.call(this, props) || this;
            _this._setActiveContent = function (activeName, content) {
                _this.setState({ activeContent: content, activeName: activeName });
            };
            _this._handleTabClick = function (name) {
                if (!!_this.props.onClick) {
                    _this.props.onClick(name);
                }
            };
            _this.state = {
                activeName: null,
                activeContent: null
            };
            return _this;
        }
        Tabs.getDerivedStateFromProps = function (props, state) {
            if (props.activeName !== state.activeName) {
                return { activeContent: null };
            }
            else {
                return null;
            }
        };
        Tabs.prototype.render = function () {
            return (React.createElement(TabsContext.Provider, { value: {
                    activeContent: this.state.activeContent,
                    activeName: this.props.activeName,
                    handleTabClick: this._handleTabClick,
                    setActiveContent: this._setActiveContent
                } },
                React.createElement("div", { className: "demo-tabs" }, this.props.children),
                React.createElement("div", { className: "demo-tabs-content" }, this.state && this.state.activeContent)));
        };
        Tabs.Tab = Tab;
        return Tabs;
    }(React.Component));
    exports.default = Tabs;
});
define("views/tabs-old", ["require", "exports", "react", "views/react", "actions/common", "components/tabs-old2"], function (require, exports, React, react_6, common_6, tabs_old2_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initModule = exports.TabsElView = void 0;
    var _reducer = function (initialState, state, action) {
        var _a;
        switch (action.type) {
            case "CHANGE_PROP":
                return __assign(__assign({}, state), (_a = {}, _a[action.name] = action.value, _a));
            default:
                return state || initialState;
        }
    };
    var reducer = function (initialState) { return function (state, action) { return _reducer(initialState, state, action); }; };
    var defaults = { activeTabName: "" };
    var TabsElView = (function (_super) {
        __extends(TabsElView, _super);
        function TabsElView(el, options) {
            var _this = this;
            var initialState = react_6.mergeOptions(options, defaults);
            _this = _super.call(this, el, options, reducer(initialState)) || this;
            return _this;
        }
        TabsElView.prototype.storeChanged = function (current, previous) {
            var shouldRerender = false;
            if (current.activeTabName !== previous.activeTabName) {
                this.objEvents.raiseProp("activeTabName");
                shouldRerender = true;
            }
            return shouldRerender;
        };
        TabsElView.prototype.getMarkup = function () {
            var _this = this;
            return (React.createElement(tabs_old2_1.default, { onClick: function (name) { _this.activeTabName = name; }, activeName: this.activeTabName },
                React.createElement(tabs_old2_1.default.Tab, { name: "Description", heading: function () { return "Description"; } },
                    React.createElement("p", null,
                        "This is a ",
                        React.createElement("b", null, "traditional"),
                        " React component without JRIApp templates."),
                    React.createElement("p", null,
                        "It is incapsulated into an ",
                        React.createElement("b", null, "Element View"),
                        " to expose properties for databinding.")),
                React.createElement(tabs_old2_1.default.Tab, { name: "Reviews", heading: function () { return "Reviews"; } },
                    React.createElement("p", null,
                        "Look at its code - it's very complex in comparison with ",
                        React.createElement("b", null, "the new templated"),
                        " one and it has difficult to follow logic inside react component implementation"))));
        };
        Object.defineProperty(TabsElView.prototype, "activeTabName", {
            get: function () {
                return this.state.activeTabName;
            },
            set: function (v) {
                this.dispatch(common_6.propertyChanged("activeTabName", v));
            },
            enumerable: false,
            configurable: true
        });
        TabsElView.prototype.toString = function () {
            return "TabsElView";
        };
        return TabsElView;
    }(react_6.ReactElView));
    exports.TabsElView = TabsElView;
    function initModule(app) {
        app.registerElView("tabs2view", TabsElView);
    }
    exports.initModule = initModule;
});
define("main", ["require", "exports", "jriapp", "app", "views/simple", "views/pager", "views/templated", "views/tabs", "views/tabs-old"], function (require, exports, RIAPP, app_1, simple_1, pager_2, templated_1, tabs_2, tabs_old_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.start = void 0;
    var bootstrapper = RIAPP.bootstrapper, utils = RIAPP.Utils;
    bootstrapper.objEvents.addOnError(function (_s, args) {
        debugger;
        alert(args.error.message);
        args.isHandled = true;
    });
    function start(options) {
        options.modulesInits = utils.core.extend(options.modulesInits || {}, {
            "simpleview": simple_1.initModule,
            "templatedview": templated_1.initModule,
            "pagerview": pager_2.initModule,
            "tabsview": tabs_2.initModule,
            "tabs2view": tabs_old_1.initModule,
        });
        return bootstrapper.startApp(function () {
            return new app_1.DemoApplication(options);
        });
    }
    exports.start = start;
});
define("components/tabs-old1", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TabsContext = React.createContext({ activeContent: null, activeName: null, setActiveContent: null });
    var Tab = (function (_super) {
        __extends(Tab, _super);
        function Tab(props) {
            return _super.call(this, props) || this;
        }
        Tab.prototype._updateTabsContent = function () {
            if (!this.props.tabsContext) {
                throw new Error("tabsContext is unavailable");
            }
            var context = this.props.tabsContext;
            if (!context.activeContent && this.props.name === context.activeName) {
                context.setActiveContent(this.props.name, this.props.children);
            }
        };
        Tab.prototype.componentDidMount = function () {
            this._updateTabsContent();
        };
        Tab.prototype.componentDidUpdate = function () {
            this._updateTabsContent();
        };
        Tab.prototype.render = function () {
            var _this = this;
            var context = this.props.tabsContext;
            var activeName = context.activeName;
            var handleTabClick = function (e) {
                context.setActiveContent(_this.props.name, _this.props.children);
                if (!!context.handleTabClick) {
                    context.handleTabClick(_this.props.name);
                }
            };
            return (React.createElement("div", { onClick: handleTabClick, className: this.props.name === activeName ? "demo-tab active" : "demo-tab" }, this.props.heading()));
        };
        return Tab;
    }(React.Component));
    var withTabsContext = function (TabElement) {
        var Res = function (props) { return (React.createElement(TabsContext.Consumer, null, function (context) { return React.createElement(TabElement, __assign({ tabsContext: context }, props)); })); };
        return Res;
    };
    var Tabs = (function (_super) {
        __extends(Tabs, _super);
        function Tabs(props) {
            var _this = _super.call(this, props) || this;
            _this._setActiveContent = function (activeName, content) {
                _this.setState({ activeContent: content, activeName: activeName });
            };
            _this._handleTabClick = function (name) {
                if (!!_this.props.onClick) {
                    _this.props.onClick(name);
                }
            };
            _this.state = {
                activeName: null,
                activeContent: null
            };
            return _this;
        }
        Tabs.getDerivedStateFromProps = function (props, state) {
            if (props.activeName !== state.activeName) {
                return { activeContent: null };
            }
            else {
                return null;
            }
        };
        Tabs.prototype.render = function () {
            return (React.createElement(TabsContext.Provider, { value: {
                    activeContent: this.state.activeContent,
                    activeName: this.props.activeName,
                    handleTabClick: this._handleTabClick,
                    setActiveContent: this._setActiveContent
                } },
                React.createElement("div", { className: "demo-tabs" }, this.props.children),
                React.createElement("div", { className: "demo-tabs-content" }, this.state && this.state.activeContent)));
        };
        Tabs.Tab = withTabsContext(Tab);
        return Tabs;
    }(React.Component));
    exports.default = Tabs;
});
