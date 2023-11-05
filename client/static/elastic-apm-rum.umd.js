(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["elastic-apm-rum"] = factory();
	else
		root["elastic-apm-rum"] = factory();
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../rum-core/dist/es/bootstrap.js":
/*!****************************************!*\
  !*** ../rum-core/dist/es/bootstrap.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bootstrap: function() { return /* binding */ bootstrap; }
/* harmony export */ });
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_patching__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common/patching */ "../rum-core/dist/es/common/patching/index.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./state */ "../rum-core/dist/es/state.js");



var enabled = false;
function bootstrap() {
  if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.isPlatformSupported)()) {
    (0,_common_patching__WEBPACK_IMPORTED_MODULE_1__.patchAll)();
    _state__WEBPACK_IMPORTED_MODULE_2__.state.bootstrapTime = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.now)();
    enabled = true;
  } else if (_common_utils__WEBPACK_IMPORTED_MODULE_0__.isBrowser) {
    console.log('[Elastic APM] platform is not supported!');
  }

  return enabled;
}

/***/ }),

/***/ "../rum-core/dist/es/common/after-frame.js":
/*!*************************************************!*\
  !*** ../rum-core/dist/es/common/after-frame.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ afterFrame; }
/* harmony export */ });
var RAF_TIMEOUT = 100;
function afterFrame(callback) {
  var handler = function handler() {
    clearTimeout(timeout);
    cancelAnimationFrame(raf);
    setTimeout(callback);
  };

  var timeout = setTimeout(handler, RAF_TIMEOUT);
  var raf = requestAnimationFrame(handler);
}

/***/ }),

/***/ "../rum-core/dist/es/common/apm-server.js":
/*!************************************************!*\
  !*** ../rum-core/dist/es/common/apm-server.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _queue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./queue */ "../rum-core/dist/es/common/queue.js");
/* harmony import */ var _throttle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./throttle */ "../rum-core/dist/es/common/throttle.js");
/* harmony import */ var _ndjson__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ndjson */ "../rum-core/dist/es/common/ndjson.js");
/* harmony import */ var _truncate__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./truncate */ "../rum-core/dist/es/common/truncate.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./polyfills */ "../rum-core/dist/es/common/polyfills.js");
/* harmony import */ var _compress__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./compress */ "../rum-core/dist/es/common/compress.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");
/* harmony import */ var _http_fetch__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./http/fetch */ "../rum-core/dist/es/common/http/fetch.js");
/* harmony import */ var _http_xhr__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./http/xhr */ "../rum-core/dist/es/common/http/xhr.js");











var THROTTLE_INTERVAL = 60000;

var ApmServer = function () {
  function ApmServer(configService, loggingService) {
    this._configService = configService;
    this._loggingService = loggingService;
    this.queue = undefined;
    this.throttleEvents = _utils__WEBPACK_IMPORTED_MODULE_0__.noop;
  }

  var _proto = ApmServer.prototype;

  _proto.init = function init() {
    var _this = this;

    var queueLimit = this._configService.get('queueLimit');

    var flushInterval = this._configService.get('flushInterval');

    var limit = this._configService.get('eventsLimit');

    var onFlush = function onFlush(events) {
      var promise = _this.sendEvents(events);

      if (promise) {
        promise.catch(function (reason) {
          _this._loggingService.warn('Failed sending events!', _this._constructError(reason));
        });
      }
    };

    this.queue = new _queue__WEBPACK_IMPORTED_MODULE_1__["default"](onFlush, {
      queueLimit: queueLimit,
      flushInterval: flushInterval
    });
    this.throttleEvents = (0,_throttle__WEBPACK_IMPORTED_MODULE_2__["default"])(this.queue.add.bind(this.queue), function () {
      return _this._loggingService.warn('Dropped events due to throttling!');
    }, {
      limit: limit,
      interval: THROTTLE_INTERVAL
    });

    this._configService.observeEvent(_constants__WEBPACK_IMPORTED_MODULE_3__.QUEUE_FLUSH, function () {
      _this.queue.flush();
    });
  };

  _proto._postJson = function _postJson(endPoint, payload) {
    var _this2 = this;

    var headers = {
      'Content-Type': 'application/x-ndjson'
    };

    var apmRequest = this._configService.get('apmRequest');

    var params = {
      payload: payload,
      headers: headers,
      beforeSend: apmRequest
    };
    return (0,_compress__WEBPACK_IMPORTED_MODULE_4__.compressPayload)(params).catch(function (error) {
      if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
        _this2._loggingService.debug('Compressing the payload using CompressionStream API failed', error.message);
      }

      return params;
    }).then(function (result) {
      return _this2._makeHttpRequest('POST', endPoint, result);
    }).then(function (_ref) {
      var responseText = _ref.responseText;
      return responseText;
    });
  };

  _proto._constructError = function _constructError(reason) {
    var url = reason.url,
        status = reason.status,
        responseText = reason.responseText;

    if (typeof status == 'undefined') {
      return reason;
    }

    var message = url + ' HTTP status: ' + status;

    if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__ && responseText) {
      try {
        var serverErrors = [];
        var response = JSON.parse(responseText);

        if (response.errors && response.errors.length > 0) {
          response.errors.forEach(function (err) {
            return serverErrors.push(err.message);
          });
          message += ' ' + serverErrors.join(',');
        }
      } catch (e) {
        this._loggingService.debug('Error parsing response from APM server', e);
      }
    }

    return new Error(message);
  };

  _proto._makeHttpRequest = function _makeHttpRequest(method, url, _temp) {
    var _ref2 = _temp === void 0 ? {} : _temp,
        _ref2$timeout = _ref2.timeout,
        timeout = _ref2$timeout === void 0 ? _constants__WEBPACK_IMPORTED_MODULE_3__.HTTP_REQUEST_TIMEOUT : _ref2$timeout,
        payload = _ref2.payload,
        headers = _ref2.headers,
        beforeSend = _ref2.beforeSend;

    var sendCredentials = this._configService.get('sendCredentials');

    if (!beforeSend && (0,_http_fetch__WEBPACK_IMPORTED_MODULE_6__.shouldUseFetchWithKeepAlive)(method, payload)) {
      return (0,_http_fetch__WEBPACK_IMPORTED_MODULE_6__.sendFetchRequest)(method, url, {
        keepalive: true,
        timeout: timeout,
        payload: payload,
        headers: headers,
        sendCredentials: sendCredentials
      }).catch(function (reason) {
        if (reason instanceof TypeError) {
          return (0,_http_xhr__WEBPACK_IMPORTED_MODULE_7__.sendXHR)(method, url, {
            timeout: timeout,
            payload: payload,
            headers: headers,
            beforeSend: beforeSend,
            sendCredentials: sendCredentials
          });
        }

        throw reason;
      });
    }

    return (0,_http_xhr__WEBPACK_IMPORTED_MODULE_7__.sendXHR)(method, url, {
      timeout: timeout,
      payload: payload,
      headers: headers,
      beforeSend: beforeSend,
      sendCredentials: sendCredentials
    });
  };

  _proto.fetchConfig = function fetchConfig(serviceName, environment) {
    var _this3 = this;

    var _this$getEndpoints = this.getEndpoints(),
        configEndpoint = _this$getEndpoints.configEndpoint;

    if (!serviceName) {
      return _polyfills__WEBPACK_IMPORTED_MODULE_8__.Promise.reject('serviceName is required for fetching central config.');
    }

    configEndpoint += "?service.name=" + serviceName;

    if (environment) {
      configEndpoint += "&service.environment=" + environment;
    }

    var localConfig = this._configService.getLocalConfig();

    if (localConfig) {
      configEndpoint += "&ifnonematch=" + localConfig.etag;
    }

    var apmRequest = this._configService.get('apmRequest');

    return this._makeHttpRequest('GET', configEndpoint, {
      timeout: 5000,
      beforeSend: apmRequest
    }).then(function (xhr) {
      var status = xhr.status,
          responseText = xhr.responseText;

      if (status === 304) {
        return localConfig;
      } else {
        var remoteConfig = JSON.parse(responseText);
        var etag = xhr.getResponseHeader('etag');

        if (etag) {
          remoteConfig.etag = etag.replace(/["]/g, '');

          _this3._configService.setLocalConfig(remoteConfig, true);
        }

        return remoteConfig;
      }
    }).catch(function (reason) {
      var error = _this3._constructError(reason);

      return _polyfills__WEBPACK_IMPORTED_MODULE_8__.Promise.reject(error);
    });
  };

  _proto.createMetaData = function createMetaData() {
    var cfg = this._configService;
    var metadata = {
      service: {
        name: cfg.get('serviceName'),
        version: cfg.get('serviceVersion'),
        agent: {
          name: 'rum-js',
          version: cfg.version
        },
        language: {
          name: 'javascript'
        },
        environment: cfg.get('environment')
      },
      labels: cfg.get('context.tags')
    };
    return (0,_truncate__WEBPACK_IMPORTED_MODULE_9__.truncateModel)(_truncate__WEBPACK_IMPORTED_MODULE_9__.METADATA_MODEL, metadata);
  };

  _proto.addError = function addError(error) {
    var _this$throttleEvents;

    this.throttleEvents((_this$throttleEvents = {}, _this$throttleEvents[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS] = error, _this$throttleEvents));
  };

  _proto.addTransaction = function addTransaction(transaction) {
    var _this$throttleEvents2;

    this.throttleEvents((_this$throttleEvents2 = {}, _this$throttleEvents2[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS] = transaction, _this$throttleEvents2));
  };

  _proto.ndjsonErrors = function ndjsonErrors(errors, compress) {
    var key = compress ? 'e' : 'error';
    return errors.map(function (error) {
      var _NDJSON$stringify;

      return _ndjson__WEBPACK_IMPORTED_MODULE_10__["default"].stringify((_NDJSON$stringify = {}, _NDJSON$stringify[key] = compress ? (0,_compress__WEBPACK_IMPORTED_MODULE_4__.compressError)(error) : error, _NDJSON$stringify));
    });
  };

  _proto.ndjsonMetricsets = function ndjsonMetricsets(metricsets) {
    return metricsets.map(function (metricset) {
      return _ndjson__WEBPACK_IMPORTED_MODULE_10__["default"].stringify({
        metricset: metricset
      });
    }).join('');
  };

  _proto.ndjsonTransactions = function ndjsonTransactions(transactions, compress) {
    var _this4 = this;

    var key = compress ? 'x' : 'transaction';
    return transactions.map(function (tr) {
      var _NDJSON$stringify2;

      var spans = '',
          breakdowns = '';

      if (!compress) {
        if (tr.spans) {
          spans = tr.spans.map(function (span) {
            return _ndjson__WEBPACK_IMPORTED_MODULE_10__["default"].stringify({
              span: span
            });
          }).join('');
          delete tr.spans;
        }

        if (tr.breakdown) {
          breakdowns = _this4.ndjsonMetricsets(tr.breakdown);
          delete tr.breakdown;
        }
      }

      return _ndjson__WEBPACK_IMPORTED_MODULE_10__["default"].stringify((_NDJSON$stringify2 = {}, _NDJSON$stringify2[key] = compress ? (0,_compress__WEBPACK_IMPORTED_MODULE_4__.compressTransaction)(tr) : tr, _NDJSON$stringify2)) + spans + breakdowns;
    });
  };

  _proto.sendEvents = function sendEvents(events) {
    var _payload, _NDJSON$stringify3;

    if (events.length === 0) {
      return;
    }

    var transactions = [];
    var errors = [];

    for (var i = 0; i < events.length; i++) {
      var event = events[i];

      if (event[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS]) {
        transactions.push(event[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS]);
      }

      if (event[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS]) {
        errors.push(event[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS]);
      }
    }

    if (transactions.length === 0 && errors.length === 0) {
      return;
    }

    var cfg = this._configService;
    var payload = (_payload = {}, _payload[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS] = transactions, _payload[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS] = errors, _payload);
    var filteredPayload = cfg.applyFilters(payload);

    if (!filteredPayload) {
      this._loggingService.warn('Dropped payload due to filtering!');

      return;
    }

    var apiVersion = cfg.get('apiVersion');
    var compress = apiVersion > 2;
    var ndjson = [];
    var metadata = this.createMetaData();
    var metadataKey = compress ? 'm' : 'metadata';
    ndjson.push(_ndjson__WEBPACK_IMPORTED_MODULE_10__["default"].stringify((_NDJSON$stringify3 = {}, _NDJSON$stringify3[metadataKey] = compress ? (0,_compress__WEBPACK_IMPORTED_MODULE_4__.compressMetadata)(metadata) : metadata, _NDJSON$stringify3)));
    ndjson = ndjson.concat(this.ndjsonErrors(filteredPayload[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS], compress), this.ndjsonTransactions(filteredPayload[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS], compress));
    var ndjsonPayload = ndjson.join('');

    var _this$getEndpoints2 = this.getEndpoints(),
        intakeEndpoint = _this$getEndpoints2.intakeEndpoint;

    return this._postJson(intakeEndpoint, ndjsonPayload);
  };

  _proto.getEndpoints = function getEndpoints() {
    var serverUrl = this._configService.get('serverUrl');

    var apiVersion = this._configService.get('apiVersion');

    var serverUrlPrefix = this._configService.get('serverUrlPrefix') || "/intake/v" + apiVersion + "/rum/events";
    var intakeEndpoint = serverUrl + serverUrlPrefix;
    var configEndpoint = serverUrl + "/config/v1/rum/agents";
    return {
      intakeEndpoint: intakeEndpoint,
      configEndpoint: configEndpoint
    };
  };

  return ApmServer;
}();

/* harmony default export */ __webpack_exports__["default"] = (ApmServer);

/***/ }),

/***/ "../rum-core/dist/es/common/compress.js":
/*!**********************************************!*\
  !*** ../rum-core/dist/es/common/compress.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   compressError: function() { return /* binding */ compressError; },
/* harmony export */   compressMetadata: function() { return /* binding */ compressMetadata; },
/* harmony export */   compressMetricsets: function() { return /* binding */ compressMetricsets; },
/* harmony export */   compressPayload: function() { return /* binding */ compressPayload; },
/* harmony export */   compressTransaction: function() { return /* binding */ compressTransaction; }
/* harmony export */ });
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./polyfills */ "../rum-core/dist/es/common/polyfills.js");
/* harmony import */ var _performance_monitoring_navigation_marks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../performance-monitoring/navigation/marks */ "../rum-core/dist/es/performance-monitoring/navigation/marks.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");




function compressStackFrames(frames) {
  return frames.map(function (frame) {
    return {
      ap: frame.abs_path,
      f: frame.filename,
      fn: frame.function,
      li: frame.lineno,
      co: frame.colno
    };
  });
}

function compressResponse(response) {
  return {
    ts: response.transfer_size,
    ebs: response.encoded_body_size,
    dbs: response.decoded_body_size
  };
}

function compressHTTP(http) {
  var compressed = {};
  var method = http.method,
      status_code = http.status_code,
      url = http.url,
      response = http.response;
  compressed.url = url;

  if (method) {
    compressed.mt = method;
  }

  if (status_code) {
    compressed.sc = status_code;
  }

  if (response) {
    compressed.r = compressResponse(response);
  }

  return compressed;
}

function compressContext(context) {
  if (!context) {
    return null;
  }

  var compressed = {};
  var page = context.page,
      http = context.http,
      response = context.response,
      destination = context.destination,
      user = context.user,
      custom = context.custom;

  if (page) {
    compressed.p = {
      rf: page.referer,
      url: page.url
    };
  }

  if (http) {
    compressed.h = compressHTTP(http);
  }

  if (response) {
    compressed.r = compressResponse(response);
  }

  if (destination) {
    var service = destination.service;
    compressed.dt = {
      se: {
        n: service.name,
        t: service.type,
        rc: service.resource
      },
      ad: destination.address,
      po: destination.port
    };
  }

  if (user) {
    compressed.u = {
      id: user.id,
      un: user.username,
      em: user.email
    };
  }

  if (custom) {
    compressed.cu = custom;
  }

  return compressed;
}

function compressMarks(marks) {
  if (!marks) {
    return null;
  }

  var compressedNtMarks = compressNavigationTimingMarks(marks.navigationTiming);
  var compressed = {
    nt: compressedNtMarks,
    a: compressAgentMarks(compressedNtMarks, marks.agent)
  };
  return compressed;
}

function compressNavigationTimingMarks(ntMarks) {
  if (!ntMarks) {
    return null;
  }

  var compressed = {};
  _performance_monitoring_navigation_marks__WEBPACK_IMPORTED_MODULE_0__.COMPRESSED_NAV_TIMING_MARKS.forEach(function (mark, index) {
    var mapping = _performance_monitoring_navigation_marks__WEBPACK_IMPORTED_MODULE_0__.NAVIGATION_TIMING_MARKS[index];
    compressed[mark] = ntMarks[mapping];
  });
  return compressed;
}

function compressAgentMarks(compressedNtMarks, agentMarks) {
  var compressed = {};

  if (compressedNtMarks) {
    compressed = {
      fb: compressedNtMarks.rs,
      di: compressedNtMarks.di,
      dc: compressedNtMarks.dc
    };
  }

  if (agentMarks) {
    var fp = agentMarks.firstContentfulPaint;
    var lp = agentMarks.largestContentfulPaint;

    if (fp) {
      compressed.fp = fp;
    }

    if (lp) {
      compressed.lp = lp;
    }
  }

  if (Object.keys(compressed).length === 0) {
    return null;
  }

  return compressed;
}

function compressMetadata(metadata) {
  var service = metadata.service,
      labels = metadata.labels;
  var agent = service.agent,
      language = service.language;
  return {
    se: {
      n: service.name,
      ve: service.version,
      a: {
        n: agent.name,
        ve: agent.version
      },
      la: {
        n: language.name
      },
      en: service.environment
    },
    l: labels
  };
}
function compressTransaction(transaction) {
  var spans = transaction.spans.map(function (span) {
    var spanData = {
      id: span.id,
      n: span.name,
      t: span.type,
      s: span.start,
      d: span.duration,
      c: compressContext(span.context),
      o: span.outcome,
      sr: span.sample_rate
    };

    if (span.parent_id !== transaction.id) {
      spanData.pid = span.parent_id;
    }

    if (span.sync === true) {
      spanData.sy = true;
    }

    if (span.subtype) {
      spanData.su = span.subtype;
    }

    if (span.action) {
      spanData.ac = span.action;
    }

    return spanData;
  });
  var tr = {
    id: transaction.id,
    tid: transaction.trace_id,
    n: transaction.name,
    t: transaction.type,
    d: transaction.duration,
    c: compressContext(transaction.context),
    k: compressMarks(transaction.marks),
    me: compressMetricsets(transaction.breakdown),
    y: spans,
    yc: {
      sd: spans.length
    },
    sm: transaction.sampled,
    sr: transaction.sample_rate,
    o: transaction.outcome
  };

  if (transaction.experience) {
    var _transaction$experien = transaction.experience,
        cls = _transaction$experien.cls,
        fid = _transaction$experien.fid,
        tbt = _transaction$experien.tbt,
        longtask = _transaction$experien.longtask;
    tr.exp = {
      cls: cls,
      fid: fid,
      tbt: tbt,
      lt: longtask
    };
  }

  if (transaction.session) {
    var _transaction$session = transaction.session,
        id = _transaction$session.id,
        sequence = _transaction$session.sequence;
    tr.ses = {
      id: id,
      seq: sequence
    };
  }

  return tr;
}
function compressError(error) {
  var exception = error.exception;
  var compressed = {
    id: error.id,
    cl: error.culprit,
    ex: {
      mg: exception.message,
      st: compressStackFrames(exception.stacktrace),
      t: error.type
    },
    c: compressContext(error.context)
  };
  var transaction = error.transaction;

  if (transaction) {
    compressed.tid = error.trace_id;
    compressed.pid = error.parent_id;
    compressed.xid = error.transaction_id;
    compressed.x = {
      t: transaction.type,
      sm: transaction.sampled
    };
  }

  return compressed;
}
function compressMetricsets(breakdowns) {
  return breakdowns.map(function (_ref) {
    var span = _ref.span,
        samples = _ref.samples;
    return {
      y: {
        t: span.type
      },
      sa: {
        ysc: {
          v: samples['span.self_time.count'].value
        },
        yss: {
          v: samples['span.self_time.sum.us'].value
        }
      }
    };
  });
}
function compressPayload(params, type) {
  if (type === void 0) {
    type = 'gzip';
  }

  var isCompressionStreamSupported = typeof CompressionStream === 'function';
  return new _polyfills__WEBPACK_IMPORTED_MODULE_1__.Promise(function (resolve) {
    if (!isCompressionStreamSupported) {
      return resolve(params);
    }

    if ((0,_utils__WEBPACK_IMPORTED_MODULE_2__.isBeaconInspectionEnabled)()) {
      return resolve(params);
    }

    var payload = params.payload,
        headers = params.headers,
        beforeSend = params.beforeSend;
    var payloadStream = new Blob([payload]).stream();
    var compressedStream = payloadStream.pipeThrough(new CompressionStream(type));
    return new Response(compressedStream).blob().then(function (payload) {
      headers['Content-Encoding'] = type;
      return resolve({
        payload: payload,
        headers: headers,
        beforeSend: beforeSend
      });
    });
  });
}

/***/ }),

/***/ "../rum-core/dist/es/common/config-service.js":
/*!****************************************************!*\
  !*** ../rum-core/dist/es/common/config-service.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _event_handler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-handler */ "../rum-core/dist/es/common/event-handler.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}





function getConfigFromScript() {
  var script = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getCurrentScript)();
  var config = getDataAttributesFromNode(script);
  return config;
}

function getDataAttributesFromNode(node) {
  if (!node) {
    return {};
  }

  var dataAttrs = {};
  var dataRegex = /^data-([\w-]+)$/;
  var attrs = node.attributes;

  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];

    if (dataRegex.test(attr.nodeName)) {
      var key = attr.nodeName.match(dataRegex)[1];
      var camelCasedkey = key.split('-').map(function (value, index) {
        return index > 0 ? value.charAt(0).toUpperCase() + value.substring(1) : value;
      }).join('');
      dataAttrs[camelCasedkey] = attr.value || attr.nodeValue;
    }
  }

  return dataAttrs;
}

var Config = function () {
  function Config() {
    this.config = {
      serviceName: '',
      serviceVersion: '',
      environment: '',
      serverUrl: 'http://localhost:8200',
      serverUrlPrefix: '',
      active: true,
      instrument: true,
      disableInstrumentations: [],
      logLevel: 'warn',
      breakdownMetrics: false,
      ignoreTransactions: [],
      eventsLimit: 80,
      queueLimit: -1,
      flushInterval: 500,
      distributedTracing: true,
      distributedTracingOrigins: [],
      distributedTracingHeaderName: 'traceparent',
      pageLoadTraceId: '',
      pageLoadSpanId: '',
      pageLoadSampled: false,
      pageLoadTransactionName: '',
      propagateTracestate: false,
      transactionSampleRate: 1.0,
      centralConfig: false,
      monitorLongtasks: true,
      apiVersion: 2,
      context: {},
      session: false,
      apmRequest: null,
      sendCredentials: false
    };
    this.events = new _event_handler__WEBPACK_IMPORTED_MODULE_1__["default"]();
    this.filters = [];
    this.version = '';
  }

  var _proto = Config.prototype;

  _proto.init = function init() {
    var scriptData = getConfigFromScript();
    this.setConfig(scriptData);
  };

  _proto.setVersion = function setVersion(version) {
    this.version = version;
  };

  _proto.addFilter = function addFilter(cb) {
    if (typeof cb !== 'function') {
      throw new Error('Argument to must be function');
    }

    this.filters.push(cb);
  };

  _proto.applyFilters = function applyFilters(data) {
    for (var i = 0; i < this.filters.length; i++) {
      data = this.filters[i](data);

      if (!data) {
        return;
      }
    }

    return data;
  };

  _proto.get = function get(key) {
    return key.split('.').reduce(function (obj, objKey) {
      return obj && obj[objKey];
    }, this.config);
  };

  _proto.setUserContext = function setUserContext(userContext) {
    if (userContext === void 0) {
      userContext = {};
    }

    var context = {};
    var _userContext = userContext,
        id = _userContext.id,
        username = _userContext.username,
        email = _userContext.email;

    if (typeof id === 'number' || typeof id === 'string') {
      context.id = id;
    }

    if (typeof username === 'string') {
      context.username = username;
    }

    if (typeof email === 'string') {
      context.email = email;
    }

    this.config.context.user = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.extend)(this.config.context.user || {}, context);
  };

  _proto.setCustomContext = function setCustomContext(customContext) {
    if (customContext === void 0) {
      customContext = {};
    }

    this.config.context.custom = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.extend)(this.config.context.custom || {}, customContext);
  };

  _proto.addLabels = function addLabels(tags) {
    var _this = this;

    if (!this.config.context.tags) {
      this.config.context.tags = {};
    }

    var keys = Object.keys(tags);
    keys.forEach(function (k) {
      return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.setLabel)(k, tags[k], _this.config.context.tags);
    });
  };

  _proto.setConfig = function setConfig(properties) {
    if (properties === void 0) {
      properties = {};
    }

    var _properties = properties,
        transactionSampleRate = _properties.transactionSampleRate,
        serverUrl = _properties.serverUrl;

    if (serverUrl) {
      properties.serverUrl = serverUrl.replace(/\/+$/, '');
    }

    if (!(0,_utils__WEBPACK_IMPORTED_MODULE_0__.isUndefined)(transactionSampleRate)) {
      if (transactionSampleRate < 0.0001 && transactionSampleRate > 0) {
        transactionSampleRate = 0.0001;
      }

      properties.transactionSampleRate = Math.round(transactionSampleRate * 10000) / 10000;
    }

    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.merge)(this.config, properties);
    this.events.send(_constants__WEBPACK_IMPORTED_MODULE_2__.CONFIG_CHANGE, [this.config]);
  };

  _proto.validate = function validate(properties) {
    if (properties === void 0) {
      properties = {};
    }

    var requiredKeys = ['serviceName', 'serverUrl'];
    var allKeys = Object.keys(this.config);
    var errors = {
      missing: [],
      invalid: [],
      unknown: []
    };
    Object.keys(properties).forEach(function (key) {
      if (requiredKeys.indexOf(key) !== -1 && !properties[key]) {
        errors.missing.push(key);
      }

      if (allKeys.indexOf(key) === -1) {
        errors.unknown.push(key);
      }
    });

    if (properties.serviceName && !/^[a-zA-Z0-9 _-]+$/.test(properties.serviceName)) {
      errors.invalid.push({
        key: 'serviceName',
        value: properties.serviceName,
        allowed: 'a-z, A-Z, 0-9, _, -, <space>'
      });
    }

    var sampleRate = properties.transactionSampleRate;

    if (typeof sampleRate !== 'undefined' && (typeof sampleRate !== 'number' || isNaN(sampleRate) || sampleRate < 0 || sampleRate > 1)) {
      errors.invalid.push({
        key: 'transactionSampleRate',
        value: sampleRate,
        allowed: 'Number between 0 and 1'
      });
    }

    return errors;
  };

  _proto.getLocalConfig = function getLocalConfig() {
    var storage = sessionStorage;

    if (this.config.session) {
      storage = localStorage;
    }

    var config = storage.getItem(_constants__WEBPACK_IMPORTED_MODULE_2__.LOCAL_CONFIG_KEY);

    if (config) {
      return JSON.parse(config);
    }
  };

  _proto.setLocalConfig = function setLocalConfig(config, merge) {
    if (config) {
      if (merge) {
        var prevConfig = this.getLocalConfig();
        config = _extends({}, prevConfig, config);
      }

      var storage = sessionStorage;

      if (this.config.session) {
        storage = localStorage;
      }

      storage.setItem(_constants__WEBPACK_IMPORTED_MODULE_2__.LOCAL_CONFIG_KEY, JSON.stringify(config));
    }
  };

  _proto.dispatchEvent = function dispatchEvent(name, args) {
    this.events.send(name, args);
  };

  _proto.observeEvent = function observeEvent(name, fn) {
    return this.events.observe(name, fn);
  };

  return Config;
}();

/* harmony default export */ __webpack_exports__["default"] = (Config);

/***/ }),

/***/ "../rum-core/dist/es/common/constants.js":
/*!***********************************************!*\
  !*** ../rum-core/dist/es/common/constants.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ADD_EVENT_LISTENER_STR: function() { return /* binding */ ADD_EVENT_LISTENER_STR; },
/* harmony export */   AFTER_EVENT: function() { return /* binding */ AFTER_EVENT; },
/* harmony export */   APM_SERVER: function() { return /* binding */ APM_SERVER; },
/* harmony export */   BEFORE_EVENT: function() { return /* binding */ BEFORE_EVENT; },
/* harmony export */   CLICK: function() { return /* binding */ CLICK; },
/* harmony export */   CONFIG_CHANGE: function() { return /* binding */ CONFIG_CHANGE; },
/* harmony export */   CONFIG_SERVICE: function() { return /* binding */ CONFIG_SERVICE; },
/* harmony export */   ERROR: function() { return /* binding */ ERROR; },
/* harmony export */   ERRORS: function() { return /* binding */ ERRORS; },
/* harmony export */   ERROR_LOGGING: function() { return /* binding */ ERROR_LOGGING; },
/* harmony export */   EVENT_TARGET: function() { return /* binding */ EVENT_TARGET; },
/* harmony export */   FETCH: function() { return /* binding */ FETCH; },
/* harmony export */   FIRST_CONTENTFUL_PAINT: function() { return /* binding */ FIRST_CONTENTFUL_PAINT; },
/* harmony export */   FIRST_INPUT: function() { return /* binding */ FIRST_INPUT; },
/* harmony export */   HISTORY: function() { return /* binding */ HISTORY; },
/* harmony export */   HTTP_REQUEST_TIMEOUT: function() { return /* binding */ HTTP_REQUEST_TIMEOUT; },
/* harmony export */   HTTP_REQUEST_TYPE: function() { return /* binding */ HTTP_REQUEST_TYPE; },
/* harmony export */   INVOKE: function() { return /* binding */ INVOKE; },
/* harmony export */   KEYWORD_LIMIT: function() { return /* binding */ KEYWORD_LIMIT; },
/* harmony export */   LARGEST_CONTENTFUL_PAINT: function() { return /* binding */ LARGEST_CONTENTFUL_PAINT; },
/* harmony export */   LAYOUT_SHIFT: function() { return /* binding */ LAYOUT_SHIFT; },
/* harmony export */   LOCAL_CONFIG_KEY: function() { return /* binding */ LOCAL_CONFIG_KEY; },
/* harmony export */   LOGGING_SERVICE: function() { return /* binding */ LOGGING_SERVICE; },
/* harmony export */   LONG_TASK: function() { return /* binding */ LONG_TASK; },
/* harmony export */   MAX_SPAN_DURATION: function() { return /* binding */ MAX_SPAN_DURATION; },
/* harmony export */   MEASURE: function() { return /* binding */ MEASURE; },
/* harmony export */   NAME_UNKNOWN: function() { return /* binding */ NAME_UNKNOWN; },
/* harmony export */   NAVIGATION: function() { return /* binding */ NAVIGATION; },
/* harmony export */   OUTCOME_FAILURE: function() { return /* binding */ OUTCOME_FAILURE; },
/* harmony export */   OUTCOME_SUCCESS: function() { return /* binding */ OUTCOME_SUCCESS; },
/* harmony export */   OUTCOME_UNKNOWN: function() { return /* binding */ OUTCOME_UNKNOWN; },
/* harmony export */   PAGE_LOAD: function() { return /* binding */ PAGE_LOAD; },
/* harmony export */   PAGE_LOAD_DELAY: function() { return /* binding */ PAGE_LOAD_DELAY; },
/* harmony export */   PAINT: function() { return /* binding */ PAINT; },
/* harmony export */   PERFORMANCE_MONITORING: function() { return /* binding */ PERFORMANCE_MONITORING; },
/* harmony export */   QUEUE_ADD_TRANSACTION: function() { return /* binding */ QUEUE_ADD_TRANSACTION; },
/* harmony export */   QUEUE_FLUSH: function() { return /* binding */ QUEUE_FLUSH; },
/* harmony export */   REMOVE_EVENT_LISTENER_STR: function() { return /* binding */ REMOVE_EVENT_LISTENER_STR; },
/* harmony export */   RESOURCE: function() { return /* binding */ RESOURCE; },
/* harmony export */   RESOURCE_INITIATOR_TYPES: function() { return /* binding */ RESOURCE_INITIATOR_TYPES; },
/* harmony export */   REUSABILITY_THRESHOLD: function() { return /* binding */ REUSABILITY_THRESHOLD; },
/* harmony export */   ROUTE_CHANGE: function() { return /* binding */ ROUTE_CHANGE; },
/* harmony export */   SCHEDULE: function() { return /* binding */ SCHEDULE; },
/* harmony export */   SESSION_TIMEOUT: function() { return /* binding */ SESSION_TIMEOUT; },
/* harmony export */   TEMPORARY_TYPE: function() { return /* binding */ TEMPORARY_TYPE; },
/* harmony export */   TRANSACTIONS: function() { return /* binding */ TRANSACTIONS; },
/* harmony export */   TRANSACTION_END: function() { return /* binding */ TRANSACTION_END; },
/* harmony export */   TRANSACTION_SERVICE: function() { return /* binding */ TRANSACTION_SERVICE; },
/* harmony export */   TRANSACTION_START: function() { return /* binding */ TRANSACTION_START; },
/* harmony export */   TRANSACTION_TYPE_ORDER: function() { return /* binding */ TRANSACTION_TYPE_ORDER; },
/* harmony export */   TRUNCATED_TYPE: function() { return /* binding */ TRUNCATED_TYPE; },
/* harmony export */   TYPE_CUSTOM: function() { return /* binding */ TYPE_CUSTOM; },
/* harmony export */   USER_INTERACTION: function() { return /* binding */ USER_INTERACTION; },
/* harmony export */   USER_TIMING_THRESHOLD: function() { return /* binding */ USER_TIMING_THRESHOLD; },
/* harmony export */   XMLHTTPREQUEST: function() { return /* binding */ XMLHTTPREQUEST; }
/* harmony export */ });
var SCHEDULE = 'schedule';
var INVOKE = 'invoke';
var ADD_EVENT_LISTENER_STR = 'addEventListener';
var REMOVE_EVENT_LISTENER_STR = 'removeEventListener';
var RESOURCE_INITIATOR_TYPES = ['link', 'css', 'script', 'img', 'xmlhttprequest', 'fetch', 'beacon', 'iframe'];
var REUSABILITY_THRESHOLD = 5000;
var MAX_SPAN_DURATION = 5 * 60 * 1000;
var PAGE_LOAD_DELAY = 1000;
var PAGE_LOAD = 'page-load';
var ROUTE_CHANGE = 'route-change';
var TYPE_CUSTOM = 'custom';
var USER_INTERACTION = 'user-interaction';
var HTTP_REQUEST_TYPE = 'http-request';
var TEMPORARY_TYPE = 'temporary';
var NAME_UNKNOWN = 'Unknown';
var TRANSACTION_TYPE_ORDER = [PAGE_LOAD, ROUTE_CHANGE, USER_INTERACTION, HTTP_REQUEST_TYPE, TYPE_CUSTOM, TEMPORARY_TYPE];
var OUTCOME_SUCCESS = 'success';
var OUTCOME_FAILURE = 'failure';
var OUTCOME_UNKNOWN = 'unknown';
var USER_TIMING_THRESHOLD = 60;
var TRANSACTION_START = 'transaction:start';
var TRANSACTION_END = 'transaction:end';
var CONFIG_CHANGE = 'config:change';
var QUEUE_FLUSH = 'queue:flush';
var QUEUE_ADD_TRANSACTION = 'queue:add_transaction';
var XMLHTTPREQUEST = 'xmlhttprequest';
var FETCH = 'fetch';
var HISTORY = 'history';
var EVENT_TARGET = 'eventtarget';
var CLICK = 'click';
var ERROR = 'error';
var BEFORE_EVENT = ':before';
var AFTER_EVENT = ':after';
var LOCAL_CONFIG_KEY = 'elastic_apm_config';
var LONG_TASK = 'longtask';
var PAINT = 'paint';
var MEASURE = 'measure';
var NAVIGATION = 'navigation';
var RESOURCE = 'resource';
var FIRST_CONTENTFUL_PAINT = 'first-contentful-paint';
var LARGEST_CONTENTFUL_PAINT = 'largest-contentful-paint';
var FIRST_INPUT = 'first-input';
var LAYOUT_SHIFT = 'layout-shift';
var ERRORS = 'errors';
var TRANSACTIONS = 'transactions';
var CONFIG_SERVICE = 'ConfigService';
var LOGGING_SERVICE = 'LoggingService';
var TRANSACTION_SERVICE = 'TransactionService';
var APM_SERVER = 'ApmServer';
var PERFORMANCE_MONITORING = 'PerformanceMonitoring';
var ERROR_LOGGING = 'ErrorLogging';
var TRUNCATED_TYPE = '.truncated';
var KEYWORD_LIMIT = 1024;
var SESSION_TIMEOUT = 30 * 60000;
var HTTP_REQUEST_TIMEOUT = 10000;


/***/ }),

/***/ "../rum-core/dist/es/common/context.js":
/*!*********************************************!*\
  !*** ../rum-core/dist/es/common/context.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addSpanContext: function() { return /* binding */ addSpanContext; },
/* harmony export */   addTransactionContext: function() { return /* binding */ addTransactionContext; },
/* harmony export */   getPageContext: function() { return /* binding */ getPageContext; }
/* harmony export */ });
/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./url */ "../rum-core/dist/es/common/url.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");
var _excluded = ["tags"];

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}




var LEFT_SQUARE_BRACKET = 91;
var RIGHT_SQUARE_BRACKET = 93;
var EXTERNAL = 'external';
var RESOURCE = 'resource';
var HARD_NAVIGATION = 'hard-navigation';

function getPortNumber(port, protocol) {
  if (port === '') {
    port = protocol === 'http:' ? '80' : protocol === 'https:' ? '443' : '';
  }

  return port;
}

function getResponseContext(perfTimingEntry) {
  var transferSize = perfTimingEntry.transferSize,
      encodedBodySize = perfTimingEntry.encodedBodySize,
      decodedBodySize = perfTimingEntry.decodedBodySize,
      serverTiming = perfTimingEntry.serverTiming;
  var respContext = {
    transfer_size: transferSize,
    encoded_body_size: encodedBodySize,
    decoded_body_size: decodedBodySize
  };
  var serverTimingStr = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getServerTimingInfo)(serverTiming);

  if (serverTimingStr) {
    respContext.headers = {
      'server-timing': serverTimingStr
    };
  }

  return respContext;
}

function getDestination(parsedUrl) {
  var port = parsedUrl.port,
      protocol = parsedUrl.protocol,
      hostname = parsedUrl.hostname;
  var portNumber = getPortNumber(port, protocol);
  var ipv6Hostname = hostname.charCodeAt(0) === LEFT_SQUARE_BRACKET && hostname.charCodeAt(hostname.length - 1) === RIGHT_SQUARE_BRACKET;
  var address = hostname;

  if (ipv6Hostname) {
    address = hostname.slice(1, -1);
  }

  return {
    service: {
      resource: hostname + ':' + portNumber,
      name: '',
      type: ''
    },
    address: address,
    port: Number(portNumber)
  };
}

function getResourceContext(data) {
  var entry = data.entry,
      url = data.url;
  var parsedUrl = new _url__WEBPACK_IMPORTED_MODULE_1__.Url(url);
  var destination = getDestination(parsedUrl);
  return {
    http: {
      url: url,
      response: getResponseContext(entry)
    },
    destination: destination
  };
}

function getExternalContext(data) {
  var url = data.url,
      method = data.method,
      target = data.target,
      response = data.response;
  var parsedUrl = new _url__WEBPACK_IMPORTED_MODULE_1__.Url(url);
  var destination = getDestination(parsedUrl);
  var context = {
    http: {
      method: method,
      url: parsedUrl.href
    },
    destination: destination
  };
  var statusCode;

  if (target && typeof target.status !== 'undefined') {
    statusCode = target.status;
  } else if (response) {
    statusCode = response.status;
  }

  context.http.status_code = statusCode;
  return context;
}

function getNavigationContext(data) {
  var url = data.url;
  var parsedUrl = new _url__WEBPACK_IMPORTED_MODULE_1__.Url(url);
  var destination = getDestination(parsedUrl);
  return {
    destination: destination
  };
}

function getPageContext() {
  return {
    page: {
      referer: document.referrer,
      url: location.href
    }
  };
}
function addSpanContext(span, data) {
  if (!data) {
    return;
  }

  var type = span.type;
  var context;

  switch (type) {
    case EXTERNAL:
      context = getExternalContext(data);
      break;

    case RESOURCE:
      context = getResourceContext(data);
      break;

    case HARD_NAVIGATION:
      context = getNavigationContext(data);
      break;
  }

  span.addContext(context);
}
function addTransactionContext(transaction, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      tags = _ref.tags,
      configContext = _objectWithoutPropertiesLoose(_ref, _excluded);

  var pageContext = getPageContext();
  var responseContext = {};

  if (transaction.type === _constants__WEBPACK_IMPORTED_MODULE_2__.PAGE_LOAD && (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isPerfTimelineSupported)()) {
    var entries = _utils__WEBPACK_IMPORTED_MODULE_0__.PERF.getEntriesByType(_constants__WEBPACK_IMPORTED_MODULE_2__.NAVIGATION);

    if (entries && entries.length > 0) {
      responseContext = {
        response: getResponseContext(entries[0])
      };
    }
  }

  transaction.addContext(pageContext, responseContext, configContext);
}

/***/ }),

/***/ "../rum-core/dist/es/common/event-handler.js":
/*!***************************************************!*\
  !*** ../rum-core/dist/es/common/event-handler.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");


var EventHandler = function () {
  function EventHandler() {
    this.observers = {};
  }

  var _proto = EventHandler.prototype;

  _proto.observe = function observe(name, fn) {
    var _this = this;

    if (typeof fn === 'function') {
      if (!this.observers[name]) {
        this.observers[name] = [];
      }

      this.observers[name].push(fn);
      return function () {
        var index = _this.observers[name].indexOf(fn);

        if (index > -1) {
          _this.observers[name].splice(index, 1);
        }
      };
    }
  };

  _proto.sendOnly = function sendOnly(name, args) {
    var obs = this.observers[name];

    if (obs) {
      obs.forEach(function (fn) {
        try {
          fn.apply(undefined, args);
        } catch (error) {
          console.log(error, error.stack);
        }
      });
    }
  };

  _proto.send = function send(name, args) {
    this.sendOnly(name + _constants__WEBPACK_IMPORTED_MODULE_0__.BEFORE_EVENT, args);
    this.sendOnly(name, args);
    this.sendOnly(name + _constants__WEBPACK_IMPORTED_MODULE_0__.AFTER_EVENT, args);
  };

  return EventHandler;
}();

/* harmony default export */ __webpack_exports__["default"] = (EventHandler);

/***/ }),

/***/ "../rum-core/dist/es/common/http/fetch.js":
/*!************************************************!*\
  !*** ../rum-core/dist/es/common/http/fetch.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BYTE_LIMIT: function() { return /* binding */ BYTE_LIMIT; },
/* harmony export */   isFetchSupported: function() { return /* binding */ isFetchSupported; },
/* harmony export */   sendFetchRequest: function() { return /* binding */ sendFetchRequest; },
/* harmony export */   shouldUseFetchWithKeepAlive: function() { return /* binding */ shouldUseFetchWithKeepAlive; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _response_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./response-status */ "../rum-core/dist/es/common/http/response-status.js");
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}



var BYTE_LIMIT = 60 * 1000;
function shouldUseFetchWithKeepAlive(method, payload) {
  if (!isFetchSupported()) {
    return false;
  }

  var isKeepAliveSupported = ('keepalive' in new Request(''));

  if (!isKeepAliveSupported) {
    return false;
  }

  var size = calculateSize(payload);
  return method === 'POST' && size < BYTE_LIMIT;
}
function sendFetchRequest(method, url, _ref) {
  var _ref$keepalive = _ref.keepalive,
      keepalive = _ref$keepalive === void 0 ? false : _ref$keepalive,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? _constants__WEBPACK_IMPORTED_MODULE_0__.HTTP_REQUEST_TIMEOUT : _ref$timeout,
      payload = _ref.payload,
      headers = _ref.headers,
      sendCredentials = _ref.sendCredentials;
  var timeoutConfig = {};

  if (typeof AbortController === 'function') {
    var controller = new AbortController();
    timeoutConfig.signal = controller.signal;
    setTimeout(function () {
      return controller.abort();
    }, timeout);
  }

  var fetchResponse;
  return window.fetch(url, _extends({
    body: payload,
    headers: headers,
    method: method,
    keepalive: keepalive,
    credentials: sendCredentials ? 'include' : 'omit'
  }, timeoutConfig)).then(function (response) {
    fetchResponse = response;
    return fetchResponse.text();
  }).then(function (responseText) {
    var bodyResponse = {
      url: url,
      status: fetchResponse.status,
      responseText: responseText
    };

    if (!(0,_response_status__WEBPACK_IMPORTED_MODULE_1__.isResponseSuccessful)(fetchResponse.status)) {
      throw bodyResponse;
    }

    return bodyResponse;
  });
}
function isFetchSupported() {
  return typeof window.fetch === 'function' && typeof window.Request === 'function';
}

function calculateSize(payload) {
  if (!payload) {
    return 0;
  }

  if (payload instanceof Blob) {
    return payload.size;
  }

  return new Blob([payload]).size;
}

/***/ }),

/***/ "../rum-core/dist/es/common/http/response-status.js":
/*!**********************************************************!*\
  !*** ../rum-core/dist/es/common/http/response-status.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isResponseSuccessful: function() { return /* binding */ isResponseSuccessful; }
/* harmony export */ });
function isResponseSuccessful(status) {
  if (status === 0 || status > 399 && status < 600) {
    return false;
  }

  return true;
}

/***/ }),

/***/ "../rum-core/dist/es/common/http/xhr.js":
/*!**********************************************!*\
  !*** ../rum-core/dist/es/common/http/xhr.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sendXHR: function() { return /* binding */ sendXHR; }
/* harmony export */ });
/* harmony import */ var _patching_patch_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../patching/patch-utils */ "../rum-core/dist/es/common/patching/patch-utils.js");
/* harmony import */ var _response_status__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./response-status */ "../rum-core/dist/es/common/http/response-status.js");
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../polyfills */ "../rum-core/dist/es/common/polyfills.js");



function sendXHR(method, url, _ref) {
  var _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? HTTP_REQUEST_TIMEOUT : _ref$timeout,
      payload = _ref.payload,
      headers = _ref.headers,
      beforeSend = _ref.beforeSend,
      sendCredentials = _ref.sendCredentials;
  return new _polyfills__WEBPACK_IMPORTED_MODULE_0__.Promise(function (resolve, reject) {
    var xhr = new window.XMLHttpRequest();
    xhr[_patching_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_IGNORE] = true;
    xhr.open(method, url, true);
    xhr.timeout = timeout;
    xhr.withCredentials = sendCredentials;

    if (headers) {
      for (var header in headers) {
        if (headers.hasOwnProperty(header)) {
          xhr.setRequestHeader(header, headers[header]);
        }
      }
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var status = xhr.status,
            responseText = xhr.responseText;

        if ((0,_response_status__WEBPACK_IMPORTED_MODULE_2__.isResponseSuccessful)(status)) {
          resolve(xhr);
        } else {
          reject({
            url: url,
            status: status,
            responseText: responseText
          });
        }
      }
    };

    xhr.onerror = function () {
      var status = xhr.status,
          responseText = xhr.responseText;
      reject({
        url: url,
        status: status,
        responseText: responseText
      });
    };

    var canSend = true;

    if (typeof beforeSend === 'function') {
      canSend = beforeSend({
        url: url,
        method: method,
        headers: headers,
        payload: payload,
        xhr: xhr
      });
    }

    if (canSend) {
      xhr.send(payload);
    } else {
      reject({
        url: url,
        status: 0,
        responseText: 'Request rejected by user configuration.'
      });
    }
  });
}

/***/ }),

/***/ "../rum-core/dist/es/common/instrument.js":
/*!************************************************!*\
  !*** ../rum-core/dist/es/common/instrument.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getInstrumentationFlags: function() { return /* binding */ getInstrumentationFlags; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");

function getInstrumentationFlags(instrument, disabledInstrumentations) {
  var _flags;

  var flags = (_flags = {}, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.FETCH] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.ERROR] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.EVENT_TARGET] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.CLICK] = false, _flags);

  if (!instrument) {
    return flags;
  }

  Object.keys(flags).forEach(function (key) {
    if (disabledInstrumentations.indexOf(key) === -1) {
      flags[key] = true;
    }
  });
  return flags;
}

/***/ }),

/***/ "../rum-core/dist/es/common/logging-service.js":
/*!*****************************************************!*\
  !*** ../rum-core/dist/es/common/logging-service.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");


var LoggingService = function () {
  function LoggingService(spec) {
    if (spec === void 0) {
      spec = {};
    }

    this.levels = ['trace', 'debug', 'info', 'warn', 'error'];
    this.level = spec.level || 'warn';
    this.prefix = spec.prefix || '';
    this.resetLogMethods();
  }

  var _proto = LoggingService.prototype;

  _proto.shouldLog = function shouldLog(level) {
    return this.levels.indexOf(level) >= this.levels.indexOf(this.level);
  };

  _proto.setLevel = function setLevel(level) {
    if (level === this.level) {
      return;
    }

    this.level = level;
    this.resetLogMethods();
  };

  _proto.resetLogMethods = function resetLogMethods() {
    var _this = this;

    this.levels.forEach(function (level) {
      _this[level] = _this.shouldLog(level) ? log : _utils__WEBPACK_IMPORTED_MODULE_0__.noop;

      function log() {
        var normalizedLevel = level;

        if (level === 'trace' || level === 'debug') {
          normalizedLevel = 'info';
        }

        var args = arguments;
        args[0] = this.prefix + args[0];

        if (console) {
          var realMethod = console[normalizedLevel] || console.log;

          if (typeof realMethod === 'function') {
            realMethod.apply(console, args);
          }
        }
      }
    });
  };

  return LoggingService;
}();

/* harmony default export */ __webpack_exports__["default"] = (LoggingService);

/***/ }),

/***/ "../rum-core/dist/es/common/ndjson.js":
/*!********************************************!*\
  !*** ../rum-core/dist/es/common/ndjson.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var NDJSON = function () {
  function NDJSON() {}

  NDJSON.stringify = function stringify(object) {
    return JSON.stringify(object) + '\n';
  };

  return NDJSON;
}();

/* harmony default export */ __webpack_exports__["default"] = (NDJSON);

/***/ }),

/***/ "../rum-core/dist/es/common/observers/page-clicks.js":
/*!***********************************************************!*\
  !*** ../rum-core/dist/es/common/observers/page-clicks.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   observePageClicks: function() { return /* binding */ observePageClicks; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");

var INTERACTIVE_SELECTOR = 'a[data-transaction-name], button[data-transaction-name]';
function observePageClicks(transactionService) {
  var clickHandler = function clickHandler(event) {
    if (event.target instanceof Element) {
      createUserInteractionTransaction(transactionService, event.target);
    }
  };

  var eventName = 'click';
  var useCapture = true;
  window.addEventListener(eventName, clickHandler, useCapture);
  return function () {
    window.removeEventListener(eventName, clickHandler, useCapture);
  };
}

function createUserInteractionTransaction(transactionService, target) {
  var _getTransactionMetada = getTransactionMetadata(target),
      transactionName = _getTransactionMetada.transactionName,
      context = _getTransactionMetada.context;

  var tr = transactionService.startTransaction("Click - " + transactionName, _constants__WEBPACK_IMPORTED_MODULE_0__.USER_INTERACTION, {
    managed: true,
    canReuse: true,
    reuseThreshold: 300
  });

  if (tr && context) {
    tr.addContext(context);
  }
}

function getTransactionMetadata(target) {
  var metadata = {
    transactionName: null,
    context: null
  };
  metadata.transactionName = buildTransactionName(target);
  var classes = target.getAttribute('class');

  if (classes) {
    metadata.context = {
      custom: {
        classes: classes
      }
    };
  }

  return metadata;
}

function buildTransactionName(target) {
  var dtName = findCustomTransactionName(target);

  if (dtName) {
    return dtName;
  }

  var tagName = target.tagName.toLowerCase();
  var name = target.getAttribute('name');

  if (!!name) {
    return tagName + "[\"" + name + "\"]";
  }

  return tagName;
}

function findCustomTransactionName(target) {
  if (target.closest) {
    var element = target.closest(INTERACTIVE_SELECTOR);
    return element ? element.dataset.transactionName : null;
  }

  return target.dataset.transactionName;
}

/***/ }),

/***/ "../rum-core/dist/es/common/observers/page-visibility.js":
/*!***************************************************************!*\
  !*** ../rum-core/dist/es/common/observers/page-visibility.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   observePageVisibility: function() { return /* binding */ observePageVisibility; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../state */ "../rum-core/dist/es/state.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "../rum-core/dist/es/common/utils.js");



function observePageVisibility(configService, transactionService) {
  if (document.visibilityState === 'hidden') {
    _state__WEBPACK_IMPORTED_MODULE_0__.state.lastHiddenStart = 0;
  }

  var visibilityChangeHandler = function visibilityChangeHandler() {
    if (document.visibilityState === 'hidden') {
      onPageHidden(configService, transactionService);
    }
  };

  var pageHideHandler = function pageHideHandler() {
    return onPageHidden(configService, transactionService);
  };

  var useCapture = true;
  window.addEventListener('visibilitychange', visibilityChangeHandler, useCapture);
  window.addEventListener('pagehide', pageHideHandler, useCapture);
  return function () {
    window.removeEventListener('visibilitychange', visibilityChangeHandler, useCapture);
    window.removeEventListener('pagehide', pageHideHandler, useCapture);
  };
}

function onPageHidden(configService, transactionService) {
  var tr = transactionService.getCurrentTransaction();

  if (tr) {
    var unobserve = configService.observeEvent(_constants__WEBPACK_IMPORTED_MODULE_1__.QUEUE_ADD_TRANSACTION, function () {
      configService.dispatchEvent(_constants__WEBPACK_IMPORTED_MODULE_1__.QUEUE_FLUSH);
      _state__WEBPACK_IMPORTED_MODULE_0__.state.lastHiddenStart = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.now)();
      unobserve();
    });
    tr.end();
  } else {
    configService.dispatchEvent(_constants__WEBPACK_IMPORTED_MODULE_1__.QUEUE_FLUSH);
    _state__WEBPACK_IMPORTED_MODULE_0__.state.lastHiddenStart = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.now)();
  }
}

/***/ }),

/***/ "../rum-core/dist/es/common/patching/fetch-patch.js":
/*!**********************************************************!*\
  !*** ../rum-core/dist/es/common/patching/fetch-patch.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   patchFetch: function() { return /* binding */ patchFetch; }
/* harmony export */ });
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../polyfills */ "../rum-core/dist/es/common/polyfills.js");
/* harmony import */ var _patch_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./patch-utils */ "../rum-core/dist/es/common/patching/patch-utils.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _http_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../http/fetch */ "../rum-core/dist/es/common/http/fetch.js");





function patchFetch(callback) {
  if (!(0,_http_fetch__WEBPACK_IMPORTED_MODULE_0__.isFetchSupported)()) {
    return;
  }

  function scheduleTask(task) {
    task.state = _constants__WEBPACK_IMPORTED_MODULE_1__.SCHEDULE;
    callback(_constants__WEBPACK_IMPORTED_MODULE_1__.SCHEDULE, task);
  }

  function invokeTask(task) {
    task.state = _constants__WEBPACK_IMPORTED_MODULE_1__.INVOKE;
    callback(_constants__WEBPACK_IMPORTED_MODULE_1__.INVOKE, task);
  }

  function handleResponseError(task, error) {
    task.data.aborted = isAbortError(error);
    task.data.error = error;
    invokeTask(task);
  }

  function readStream(stream, task) {
    var reader = stream.getReader();

    var read = function read() {
      reader.read().then(function (_ref) {
        var done = _ref.done;

        if (done) {
          invokeTask(task);
        } else {
          read();
        }
      }, function (error) {
        handleResponseError(task, error);
      });
    };

    read();
  }

  var nativeFetch = window.fetch;

  window.fetch = function (input, init) {
    var fetchSelf = this;
    var args = arguments;
    var request, url;
    var isURL = input instanceof URL;

    if (typeof input === 'string' || isURL) {
      request = new Request(input, init);

      if (isURL) {
        url = request.url;
      } else {
        url = input;
      }
    } else if (input) {
      request = input;
      url = request.url;
    } else {
      return nativeFetch.apply(fetchSelf, args);
    }

    var task = {
      source: _constants__WEBPACK_IMPORTED_MODULE_1__.FETCH,
      state: '',
      type: 'macroTask',
      data: {
        target: request,
        method: request.method,
        url: url,
        aborted: false
      }
    };
    return new _polyfills__WEBPACK_IMPORTED_MODULE_2__.Promise(function (resolve, reject) {
      _patch_utils__WEBPACK_IMPORTED_MODULE_3__.globalState.fetchInProgress = true;
      scheduleTask(task);
      var promise;

      try {
        promise = nativeFetch.apply(fetchSelf, [request]);
      } catch (error) {
        reject(error);
        task.data.error = error;
        invokeTask(task);
        _patch_utils__WEBPACK_IMPORTED_MODULE_3__.globalState.fetchInProgress = false;
        return;
      }

      promise.then(function (response) {
        var clonedResponse = response.clone ? response.clone() : {};
        resolve(response);
        (0,_utils__WEBPACK_IMPORTED_MODULE_4__.scheduleMicroTask)(function () {
          task.data.response = response;
          var body = clonedResponse.body;

          if (body) {
            readStream(body, task);
          } else {
            invokeTask(task);
          }
        });
      }, function (error) {
        reject(error);
        (0,_utils__WEBPACK_IMPORTED_MODULE_4__.scheduleMicroTask)(function () {
          handleResponseError(task, error);
        });
      });
      _patch_utils__WEBPACK_IMPORTED_MODULE_3__.globalState.fetchInProgress = false;
    });
  };
}

function isAbortError(error) {
  return error && error.name === 'AbortError';
}

/***/ }),

/***/ "../rum-core/dist/es/common/patching/history-patch.js":
/*!************************************************************!*\
  !*** ../rum-core/dist/es/common/patching/history-patch.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   patchHistory: function() { return /* binding */ patchHistory; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");

function patchHistory(callback) {
  if (!window.history) {
    return;
  }

  var nativePushState = history.pushState;

  if (typeof nativePushState === 'function') {
    history.pushState = function (state, title, url) {
      var task = {
        source: _constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY,
        data: {
          state: state,
          title: title,
          url: url
        }
      };
      callback(_constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE, task);
      nativePushState.apply(this, arguments);
    };
  }
}

/***/ }),

/***/ "../rum-core/dist/es/common/patching/index.js":
/*!****************************************************!*\
  !*** ../rum-core/dist/es/common/patching/index.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   patchAll: function() { return /* binding */ patchAll; },
/* harmony export */   patchEventHandler: function() { return /* binding */ patchEventHandler; }
/* harmony export */ });
/* harmony import */ var _xhr_patch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xhr-patch */ "../rum-core/dist/es/common/patching/xhr-patch.js");
/* harmony import */ var _fetch_patch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fetch-patch */ "../rum-core/dist/es/common/patching/fetch-patch.js");
/* harmony import */ var _history_patch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./history-patch */ "../rum-core/dist/es/common/patching/history-patch.js");
/* harmony import */ var _event_handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../event-handler */ "../rum-core/dist/es/common/event-handler.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");





var patchEventHandler = new _event_handler__WEBPACK_IMPORTED_MODULE_0__["default"]();
var alreadyPatched = false;

function patchAll() {
  if (!alreadyPatched) {
    alreadyPatched = true;
    (0,_xhr_patch__WEBPACK_IMPORTED_MODULE_1__.patchXMLHttpRequest)(function (event, task) {
      patchEventHandler.send(_constants__WEBPACK_IMPORTED_MODULE_2__.XMLHTTPREQUEST, [event, task]);
    });
    (0,_fetch_patch__WEBPACK_IMPORTED_MODULE_3__.patchFetch)(function (event, task) {
      patchEventHandler.send(_constants__WEBPACK_IMPORTED_MODULE_2__.FETCH, [event, task]);
    });
    (0,_history_patch__WEBPACK_IMPORTED_MODULE_4__.patchHistory)(function (event, task) {
      patchEventHandler.send(_constants__WEBPACK_IMPORTED_MODULE_2__.HISTORY, [event, task]);
    });
  }

  return patchEventHandler;
}



/***/ }),

/***/ "../rum-core/dist/es/common/patching/patch-utils.js":
/*!**********************************************************!*\
  !*** ../rum-core/dist/es/common/patching/patch-utils.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XHR_IGNORE: function() { return /* binding */ XHR_IGNORE; },
/* harmony export */   XHR_METHOD: function() { return /* binding */ XHR_METHOD; },
/* harmony export */   XHR_SYNC: function() { return /* binding */ XHR_SYNC; },
/* harmony export */   XHR_URL: function() { return /* binding */ XHR_URL; },
/* harmony export */   apmSymbol: function() { return /* binding */ apmSymbol; },
/* harmony export */   globalState: function() { return /* binding */ globalState; },
/* harmony export */   patchMethod: function() { return /* binding */ patchMethod; }
/* harmony export */ });
var globalState = {
  fetchInProgress: false
};
function apmSymbol(name) {
  return '__apm_symbol__' + name;
}

function isPropertyWritable(propertyDesc) {
  if (!propertyDesc) {
    return true;
  }

  if (propertyDesc.writable === false) {
    return false;
  }

  return !(typeof propertyDesc.get === 'function' && typeof propertyDesc.set === 'undefined');
}

function attachOriginToPatched(patched, original) {
  patched[apmSymbol('OriginalDelegate')] = original;
}

function patchMethod(target, name, patchFn) {
  var proto = target;

  while (proto && !proto.hasOwnProperty(name)) {
    proto = Object.getPrototypeOf(proto);
  }

  if (!proto && target[name]) {
    proto = target;
  }

  var delegateName = apmSymbol(name);
  var delegate;

  if (proto && !(delegate = proto[delegateName])) {
    delegate = proto[delegateName] = proto[name];
    var desc = proto && Object.getOwnPropertyDescriptor(proto, name);

    if (isPropertyWritable(desc)) {
      var patchDelegate = patchFn(delegate, delegateName, name);

      proto[name] = function () {
        return patchDelegate(this, arguments);
      };

      attachOriginToPatched(proto[name], delegate);
    }
  }

  return delegate;
}
var XHR_IGNORE = apmSymbol('xhrIgnore');
var XHR_SYNC = apmSymbol('xhrSync');
var XHR_URL = apmSymbol('xhrURL');
var XHR_METHOD = apmSymbol('xhrMethod');

/***/ }),

/***/ "../rum-core/dist/es/common/patching/xhr-patch.js":
/*!********************************************************!*\
  !*** ../rum-core/dist/es/common/patching/xhr-patch.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   patchXMLHttpRequest: function() { return /* binding */ patchXMLHttpRequest; }
/* harmony export */ });
/* harmony import */ var _patch_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./patch-utils */ "../rum-core/dist/es/common/patching/patch-utils.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");


function patchXMLHttpRequest(callback) {
  var XMLHttpRequestPrototype = XMLHttpRequest.prototype;

  if (!XMLHttpRequestPrototype || !XMLHttpRequestPrototype[_constants__WEBPACK_IMPORTED_MODULE_0__.ADD_EVENT_LISTENER_STR]) {
    return;
  }

  var READY_STATE_CHANGE = 'readystatechange';
  var LOAD = 'load';
  var ERROR = 'error';
  var TIMEOUT = 'timeout';
  var ABORT = 'abort';

  function invokeTask(task, status) {
    if (task.state !== _constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE) {
      task.state = _constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE;
      task.data.status = status;
      callback(_constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE, task);
    }
  }

  function scheduleTask(task) {
    if (task.state === _constants__WEBPACK_IMPORTED_MODULE_0__.SCHEDULE) {
      return;
    }

    task.state = _constants__WEBPACK_IMPORTED_MODULE_0__.SCHEDULE;
    callback(_constants__WEBPACK_IMPORTED_MODULE_0__.SCHEDULE, task);
    var target = task.data.target;

    function addListener(name) {
      target[_constants__WEBPACK_IMPORTED_MODULE_0__.ADD_EVENT_LISTENER_STR](name, function (_ref) {
        var type = _ref.type;

        if (type === READY_STATE_CHANGE) {
          if (target.readyState === 4 && target.status !== 0) {
            invokeTask(task, 'success');
          }
        } else {
          var status = type === LOAD ? 'success' : type;
          invokeTask(task, status);
        }
      });
    }

    addListener(READY_STATE_CHANGE);
    addListener(LOAD);
    addListener(TIMEOUT);
    addListener(ERROR);
    addListener(ABORT);
  }

  var openNative = (0,_patch_utils__WEBPACK_IMPORTED_MODULE_1__.patchMethod)(XMLHttpRequestPrototype, 'open', function () {
    return function (self, args) {
      if (!self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_IGNORE]) {
        self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_METHOD] = args[0];
        self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_URL] = args[1];
        self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_SYNC] = args[2] === false;
      }

      return openNative.apply(self, args);
    };
  });
  var sendNative = (0,_patch_utils__WEBPACK_IMPORTED_MODULE_1__.patchMethod)(XMLHttpRequestPrototype, 'send', function () {
    return function (self, args) {
      if (self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_IGNORE]) {
        return sendNative.apply(self, args);
      }

      var task = {
        source: _constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST,
        state: '',
        type: 'macroTask',
        data: {
          target: self,
          method: self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_METHOD],
          sync: self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_SYNC],
          url: self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_URL],
          status: ''
        }
      };

      try {
        scheduleTask(task);
        return sendNative.apply(self, args);
      } catch (e) {
        invokeTask(task, ERROR);
        throw e;
      }
    };
  });
}

/***/ }),

/***/ "../rum-core/dist/es/common/polyfills.js":
/*!***********************************************!*\
  !*** ../rum-core/dist/es/common/polyfills.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Promise: function() { return /* binding */ Promise; }
/* harmony export */ });
/* harmony import */ var promise_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! promise-polyfill */ "../../node_modules/promise-polyfill/src/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");


var local = {};

if (_utils__WEBPACK_IMPORTED_MODULE_1__.isBrowser) {
  local = window;
} else if (typeof self !== 'undefined') {
  local = self;
}

var Promise = 'Promise' in local ? local.Promise : promise_polyfill__WEBPACK_IMPORTED_MODULE_0__["default"];


/***/ }),

/***/ "../rum-core/dist/es/common/queue.js":
/*!*******************************************!*\
  !*** ../rum-core/dist/es/common/queue.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Queue = function () {
  function Queue(onFlush, opts) {
    if (opts === void 0) {
      opts = {};
    }

    this.onFlush = onFlush;
    this.items = [];
    this.queueLimit = opts.queueLimit || -1;
    this.flushInterval = opts.flushInterval || 0;
    this.timeoutId = undefined;
  }

  var _proto = Queue.prototype;

  _proto._setTimer = function _setTimer() {
    var _this = this;

    this.timeoutId = setTimeout(function () {
      return _this.flush();
    }, this.flushInterval);
  };

  _proto._clear = function _clear() {
    if (typeof this.timeoutId !== 'undefined') {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    this.items = [];
  };

  _proto.flush = function flush() {
    this.onFlush(this.items);

    this._clear();
  };

  _proto.add = function add(item) {
    this.items.push(item);

    if (this.queueLimit !== -1 && this.items.length >= this.queueLimit) {
      this.flush();
    } else {
      if (typeof this.timeoutId === 'undefined') {
        this._setTimer();
      }
    }
  };

  return Queue;
}();

/* harmony default export */ __webpack_exports__["default"] = (Queue);

/***/ }),

/***/ "../rum-core/dist/es/common/service-factory.js":
/*!*****************************************************!*\
  !*** ../rum-core/dist/es/common/service-factory.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ServiceFactory: function() { return /* binding */ ServiceFactory; },
/* harmony export */   serviceCreators: function() { return /* binding */ serviceCreators; }
/* harmony export */ });
/* harmony import */ var _apm_server__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./apm-server */ "../rum-core/dist/es/common/apm-server.js");
/* harmony import */ var _config_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config-service */ "../rum-core/dist/es/common/config-service.js");
/* harmony import */ var _logging_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./logging-service */ "../rum-core/dist/es/common/logging-service.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");
var _serviceCreators;






var serviceCreators = (_serviceCreators = {}, _serviceCreators[_constants__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE] = function () {
  return new _config_service__WEBPACK_IMPORTED_MODULE_1__["default"]();
}, _serviceCreators[_constants__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE] = function () {
  return new _logging_service__WEBPACK_IMPORTED_MODULE_2__["default"]({
    prefix: '[Elastic APM] '
  });
}, _serviceCreators[_constants__WEBPACK_IMPORTED_MODULE_0__.APM_SERVER] = function (factory) {
  var _factory$getService = factory.getService([_constants__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE, _constants__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE]),
      configService = _factory$getService[0],
      loggingService = _factory$getService[1];

  return new _apm_server__WEBPACK_IMPORTED_MODULE_3__["default"](configService, loggingService);
}, _serviceCreators);

var ServiceFactory = function () {
  function ServiceFactory() {
    this.instances = {};
    this.initialized = false;
  }

  var _proto = ServiceFactory.prototype;

  _proto.init = function init() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    var configService = this.getService(_constants__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.init();

    var _this$getService = this.getService([_constants__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE, _constants__WEBPACK_IMPORTED_MODULE_0__.APM_SERVER]),
        loggingService = _this$getService[0],
        apmServer = _this$getService[1];

    configService.events.observe(_constants__WEBPACK_IMPORTED_MODULE_0__.CONFIG_CHANGE, function () {
      var logLevel = configService.get('logLevel');
      loggingService.setLevel(logLevel);
    });
    apmServer.init();
  };

  _proto.getService = function getService(name) {
    var _this = this;

    if (typeof name === 'string') {
      if (!this.instances[name]) {
        if (typeof serviceCreators[name] === 'function') {
          this.instances[name] = serviceCreators[name](this);
        } else if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
          console.log('Cannot get service, No creator for: ' + name);
        }
      }

      return this.instances[name];
    } else if (Array.isArray(name)) {
      return name.map(function (n) {
        return _this.getService(n);
      });
    }
  };

  return ServiceFactory;
}();



/***/ }),

/***/ "../rum-core/dist/es/common/throttle.js":
/*!**********************************************!*\
  !*** ../rum-core/dist/es/common/throttle.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ throttle; }
/* harmony export */ });
function throttle(fn, onThrottle, opts) {
  var context = this;
  var limit = opts.limit;
  var interval = opts.interval;
  var counter = 0;
  var timeoutId;
  return function () {
    counter++;

    if (typeof timeoutId === 'undefined') {
      timeoutId = setTimeout(function () {
        counter = 0;
        timeoutId = undefined;
      }, interval);
    }

    if (counter > limit && typeof onThrottle === 'function') {
      return onThrottle.apply(context, arguments);
    } else {
      return fn.apply(context, arguments);
    }
  };
}

/***/ }),

/***/ "../rum-core/dist/es/common/truncate.js":
/*!**********************************************!*\
  !*** ../rum-core/dist/es/common/truncate.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ERROR_MODEL: function() { return /* binding */ ERROR_MODEL; },
/* harmony export */   METADATA_MODEL: function() { return /* binding */ METADATA_MODEL; },
/* harmony export */   RESPONSE_MODEL: function() { return /* binding */ RESPONSE_MODEL; },
/* harmony export */   SPAN_MODEL: function() { return /* binding */ SPAN_MODEL; },
/* harmony export */   TRANSACTION_MODEL: function() { return /* binding */ TRANSACTION_MODEL; },
/* harmony export */   truncate: function() { return /* binding */ truncate; },
/* harmony export */   truncateModel: function() { return /* binding */ truncateModel; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");

var METADATA_MODEL = {
  service: {
    name: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
    version: true,
    agent: {
      version: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true]
    },
    environment: true
  },
  labels: {
    '*': true
  }
};
var RESPONSE_MODEL = {
  '*': true,
  headers: {
    '*': true
  }
};
var DESTINATION_MODEL = {
  address: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT],
  service: {
    '*': [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true]
  }
};
var CONTEXT_MODEL = {
  user: {
    id: true,
    email: true,
    username: true
  },
  tags: {
    '*': true
  },
  http: {
    response: RESPONSE_MODEL
  },
  destination: DESTINATION_MODEL,
  response: RESPONSE_MODEL
};
var SPAN_MODEL = {
  name: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  type: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  trace_id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  parent_id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  transaction_id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  subtype: true,
  action: true,
  context: CONTEXT_MODEL
};
var TRANSACTION_MODEL = {
  name: true,
  parent_id: true,
  type: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  trace_id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  span_count: {
    started: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true]
  },
  context: CONTEXT_MODEL
};
var ERROR_MODEL = {
  id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  trace_id: true,
  transaction_id: true,
  parent_id: true,
  culprit: true,
  exception: {
    type: true
  },
  transaction: {
    type: true
  },
  context: CONTEXT_MODEL
};

function truncate(value, limit, required, placeholder) {
  if (limit === void 0) {
    limit = _constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT;
  }

  if (required === void 0) {
    required = false;
  }

  if (placeholder === void 0) {
    placeholder = 'N/A';
  }

  if (required && isEmpty(value)) {
    value = placeholder;
  }

  if (typeof value === 'string') {
    return value.substring(0, limit);
  }

  return value;
}

function isEmpty(value) {
  return value == null || value === '' || typeof value === 'undefined';
}

function replaceValue(target, key, currModel) {
  var value = truncate(target[key], currModel[0], currModel[1]);

  if (isEmpty(value)) {
    delete target[key];
    return;
  }

  target[key] = value;
}

function truncateModel(model, target, childTarget) {
  if (model === void 0) {
    model = {};
  }

  if (childTarget === void 0) {
    childTarget = target;
  }

  var keys = Object.keys(model);
  var emptyArr = [];

  var _loop = function _loop(i) {
    var currKey = keys[i];
    var currModel = model[currKey] === true ? emptyArr : model[currKey];

    if (!Array.isArray(currModel)) {
      truncateModel(currModel, target, childTarget[currKey]);
    } else {
      if (currKey === '*') {
        Object.keys(childTarget).forEach(function (key) {
          return replaceValue(childTarget, key, currModel);
        });
      } else {
        replaceValue(childTarget, currKey, currModel);
      }
    }
  };

  for (var i = 0; i < keys.length; i++) {
    _loop(i);
  }

  return target;
}



/***/ }),

/***/ "../rum-core/dist/es/common/url.js":
/*!*****************************************!*\
  !*** ../rum-core/dist/es/common/url.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Url: function() { return /* binding */ Url; },
/* harmony export */   slugifyUrl: function() { return /* binding */ slugifyUrl; }
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");


function isDefaultPort(port, protocol) {
  switch (protocol) {
    case 'http:':
      return port === '80';

    case 'https:':
      return port === '443';
  }

  return true;
}

var RULES = [['#', 'hash'], ['?', 'query'], ['/', 'path'], ['@', 'auth', 1], [NaN, 'host', undefined, 1]];
var PROTOCOL_REGEX = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i;
var Url = function () {
  function Url(url) {
    var _this$extractProtocol = this.extractProtocol(url || ''),
        protocol = _this$extractProtocol.protocol,
        address = _this$extractProtocol.address,
        slashes = _this$extractProtocol.slashes;

    var relative = !protocol && !slashes;
    var location = this.getLocation();
    var instructions = RULES.slice();
    address = address.replace('\\', '/');

    if (!slashes) {
      instructions[2] = [NaN, 'path'];
    }

    var index;

    for (var i = 0; i < instructions.length; i++) {
      var instruction = instructions[i];
      var parse = instruction[0];
      var key = instruction[1];

      if (typeof parse === 'string') {
        index = address.indexOf(parse);

        if (~index) {
          var instLength = instruction[2];

          if (instLength) {
            var newIndex = address.lastIndexOf(parse);
            index = Math.max(index, newIndex);
            this[key] = address.slice(0, index);
            address = address.slice(index + instLength);
          } else {
            this[key] = address.slice(index);
            address = address.slice(0, index);
          }
        }
      } else {
        this[key] = address;
        address = '';
      }

      this[key] = this[key] || (relative && instruction[3] ? location[key] || '' : '');
      if (instruction[3]) this[key] = this[key].toLowerCase();
    }

    if (relative && this.path.charAt(0) !== '/') {
      this.path = '/' + this.path;
    }

    this.relative = relative;
    this.protocol = protocol || location.protocol;
    this.hostname = this.host;
    this.port = '';

    if (/:\d+$/.test(this.host)) {
      var value = this.host.split(':');
      var port = value.pop();
      var hostname = value.join(':');

      if (isDefaultPort(port, this.protocol)) {
        this.host = hostname;
      } else {
        this.port = port;
      }

      this.hostname = hostname;
    }

    this.origin = this.protocol && this.host && this.protocol !== 'file:' ? this.protocol + '//' + this.host : 'null';
    this.href = this.toString();
  }

  var _proto = Url.prototype;

  _proto.toString = function toString() {
    var result = this.protocol;
    result += '//';

    if (this.auth) {
      var REDACTED = '[REDACTED]';
      var userpass = this.auth.split(':');
      var username = userpass[0] ? REDACTED : '';
      var password = userpass[1] ? ':' + REDACTED : '';
      result += username + password + '@';
    }

    result += this.host;
    result += this.path;
    result += this.query;
    result += this.hash;
    return result;
  };

  _proto.getLocation = function getLocation() {
    var globalVar = {};

    if (_utils__WEBPACK_IMPORTED_MODULE_0__.isBrowser) {
      globalVar = window;
    }

    return globalVar.location;
  };

  _proto.extractProtocol = function extractProtocol(url) {
    var match = PROTOCOL_REGEX.exec(url);
    return {
      protocol: match[1] ? match[1].toLowerCase() : '',
      slashes: !!match[2],
      address: match[3]
    };
  };

  return Url;
}();
function slugifyUrl(urlStr, depth) {
  if (depth === void 0) {
    depth = 2;
  }

  var parsedUrl = new Url(urlStr);
  var query = parsedUrl.query,
      path = parsedUrl.path;
  var pathParts = path.substring(1).split('/');
  var redactString = ':id';
  var wildcard = '*';
  var specialCharsRegex = /\W|_/g;
  var digitsRegex = /[0-9]/g;
  var lowerCaseRegex = /[a-z]/g;
  var upperCaseRegex = /[A-Z]/g;
  var redactedParts = [];
  var redactedBefore = false;

  for (var index = 0; index < pathParts.length; index++) {
    var part = pathParts[index];

    if (redactedBefore || index > depth - 1) {
      if (part) {
        redactedParts.push(wildcard);
      }

      break;
    }

    var numberOfSpecialChars = (part.match(specialCharsRegex) || []).length;

    if (numberOfSpecialChars >= 2) {
      redactedParts.push(redactString);
      redactedBefore = true;
      continue;
    }

    var numberOfDigits = (part.match(digitsRegex) || []).length;

    if (numberOfDigits > 3 || part.length > 3 && numberOfDigits / part.length >= 0.3) {
      redactedParts.push(redactString);
      redactedBefore = true;
      continue;
    }

    var numberofUpperCase = (part.match(upperCaseRegex) || []).length;
    var numberofLowerCase = (part.match(lowerCaseRegex) || []).length;
    var lowerCaseRate = numberofLowerCase / part.length;
    var upperCaseRate = numberofUpperCase / part.length;

    if (part.length > 5 && (upperCaseRate > 0.3 && upperCaseRate < 0.6 || lowerCaseRate > 0.3 && lowerCaseRate < 0.6)) {
      redactedParts.push(redactString);
      redactedBefore = true;
      continue;
    }

    part && redactedParts.push(part);
  }

  var redacted = '/' + (redactedParts.length >= 2 ? redactedParts.join('/') : redactedParts.join('')) + (query ? '?{query}' : '');
  return redacted;
}

/***/ }),

/***/ "../rum-core/dist/es/common/utils.js":
/*!*******************************************!*\
  !*** ../rum-core/dist/es/common/utils.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PERF: function() { return /* binding */ PERF; },
/* harmony export */   baseExtend: function() { return /* binding */ baseExtend; },
/* harmony export */   bytesToHex: function() { return /* binding */ bytesToHex; },
/* harmony export */   checkSameOrigin: function() { return /* binding */ checkSameOrigin; },
/* harmony export */   extend: function() { return /* binding */ extend; },
/* harmony export */   find: function() { return /* binding */ find; },
/* harmony export */   generateRandomId: function() { return /* binding */ generateRandomId; },
/* harmony export */   getCurrentScript: function() { return /* binding */ getCurrentScript; },
/* harmony export */   getDtHeaderValue: function() { return /* binding */ getDtHeaderValue; },
/* harmony export */   getDuration: function() { return /* binding */ getDuration; },
/* harmony export */   getEarliestSpan: function() { return /* binding */ getEarliestSpan; },
/* harmony export */   getElasticScript: function() { return /* binding */ getElasticScript; },
/* harmony export */   getLatestNonXHRSpan: function() { return /* binding */ getLatestNonXHRSpan; },
/* harmony export */   getLatestXHRSpan: function() { return /* binding */ getLatestXHRSpan; },
/* harmony export */   getServerTimingInfo: function() { return /* binding */ getServerTimingInfo; },
/* harmony export */   getTSHeaderValue: function() { return /* binding */ getTSHeaderValue; },
/* harmony export */   getTime: function() { return /* binding */ getTime; },
/* harmony export */   getTimeOrigin: function() { return /* binding */ getTimeOrigin; },
/* harmony export */   isBeaconInspectionEnabled: function() { return /* binding */ isBeaconInspectionEnabled; },
/* harmony export */   isBrowser: function() { return /* binding */ isBrowser; },
/* harmony export */   isCORSSupported: function() { return /* binding */ isCORSSupported; },
/* harmony export */   isDtHeaderValid: function() { return /* binding */ isDtHeaderValid; },
/* harmony export */   isFunction: function() { return /* binding */ isFunction; },
/* harmony export */   isObject: function() { return /* binding */ isObject; },
/* harmony export */   isPerfTimelineSupported: function() { return /* binding */ isPerfTimelineSupported; },
/* harmony export */   isPerfTypeSupported: function() { return /* binding */ isPerfTypeSupported; },
/* harmony export */   isPlatformSupported: function() { return /* binding */ isPlatformSupported; },
/* harmony export */   isRedirectInfoAvailable: function() { return /* binding */ isRedirectInfoAvailable; },
/* harmony export */   isUndefined: function() { return /* binding */ isUndefined; },
/* harmony export */   merge: function() { return /* binding */ merge; },
/* harmony export */   noop: function() { return /* binding */ noop; },
/* harmony export */   now: function() { return /* binding */ now; },
/* harmony export */   parseDtHeaderValue: function() { return /* binding */ parseDtHeaderValue; },
/* harmony export */   removeInvalidChars: function() { return /* binding */ removeInvalidChars; },
/* harmony export */   rng: function() { return /* binding */ rng; },
/* harmony export */   scheduleMacroTask: function() { return /* binding */ scheduleMacroTask; },
/* harmony export */   scheduleMicroTask: function() { return /* binding */ scheduleMicroTask; },
/* harmony export */   setLabel: function() { return /* binding */ setLabel; },
/* harmony export */   setRequestHeader: function() { return /* binding */ setRequestHeader; },
/* harmony export */   stripQueryStringFromUrl: function() { return /* binding */ stripQueryStringFromUrl; }
/* harmony export */ });
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./polyfills */ "../rum-core/dist/es/common/polyfills.js");

var slice = [].slice;
var isBrowser = typeof window !== 'undefined';
var PERF = isBrowser && typeof performance !== 'undefined' ? performance : {};

function isCORSSupported() {
  var xhr = new window.XMLHttpRequest();
  return 'withCredentials' in xhr;
}

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToHex(buffer) {
  var hexOctets = [];

  for (var _i = 0; _i < buffer.length; _i++) {
    hexOctets.push(byteToHex[buffer[_i]]);
  }

  return hexOctets.join('');
}

var destination = new Uint8Array(16);

function rng() {
  if (typeof crypto != 'undefined' && typeof crypto.getRandomValues == 'function') {
    return crypto.getRandomValues(destination);
  } else if (typeof msCrypto != 'undefined' && typeof msCrypto.getRandomValues == 'function') {
    return msCrypto.getRandomValues(destination);
  }

  return destination;
}

function generateRandomId(length) {
  var id = bytesToHex(rng());
  return id.substr(0, length);
}

function getDtHeaderValue(span) {
  var dtVersion = '00';
  var dtUnSampledFlags = '00';
  var dtSampledFlags = '01';

  if (span && span.traceId && span.id && span.parentId) {
    var flags = span.sampled ? dtSampledFlags : dtUnSampledFlags;
    var id = span.sampled ? span.id : span.parentId;
    return dtVersion + '-' + span.traceId + '-' + id + '-' + flags;
  }
}

function parseDtHeaderValue(value) {
  var parsed = /^([\da-f]{2})-([\da-f]{32})-([\da-f]{16})-([\da-f]{2})$/.exec(value);

  if (parsed) {
    var flags = parsed[4];
    var sampled = flags !== '00';
    return {
      traceId: parsed[2],
      id: parsed[3],
      sampled: sampled
    };
  }
}

function isDtHeaderValid(header) {
  return /^[\da-f]{2}-[\da-f]{32}-[\da-f]{16}-[\da-f]{2}$/.test(header) && header.slice(3, 35) !== '00000000000000000000000000000000' && header.slice(36, 52) !== '0000000000000000';
}

function getTSHeaderValue(_ref) {
  var sampleRate = _ref.sampleRate;

  if (typeof sampleRate !== 'number' || String(sampleRate).length > 256) {
    return;
  }

  var NAMESPACE = 'es';
  var SEPARATOR = '=';
  return "" + NAMESPACE + SEPARATOR + "s:" + sampleRate;
}

function setRequestHeader(target, name, value) {
  if (typeof target.setRequestHeader === 'function') {
    target.setRequestHeader(name, value);
  } else if (target.headers && typeof target.headers.append === 'function') {
    target.headers.append(name, value);
  } else {
    target[name] = value;
  }
}

function checkSameOrigin(source, target) {
  var isSame = false;

  if (typeof target === 'string') {
    isSame = source === target;
  } else if (target && typeof target.test === 'function') {
    isSame = target.test(source);
  } else if (Array.isArray(target)) {
    target.forEach(function (t) {
      if (!isSame) {
        isSame = checkSameOrigin(source, t);
      }
    });
  }

  return isSame;
}

function isPlatformSupported() {
  return isBrowser && typeof Set === 'function' && typeof JSON.stringify === 'function' && PERF && typeof PERF.now === 'function' && isCORSSupported();
}

function setLabel(key, value, obj) {
  if (!obj || !key) return;
  var skey = removeInvalidChars(key);
  var valueType = typeof value;

  if (value != undefined && valueType !== 'boolean' && valueType !== 'number') {
    value = String(value);
  }

  obj[skey] = value;
  return obj;
}

function getServerTimingInfo(serverTimingEntries) {
  if (serverTimingEntries === void 0) {
    serverTimingEntries = [];
  }

  var serverTimingInfo = [];
  var entrySeparator = ', ';
  var valueSeparator = ';';

  for (var _i2 = 0; _i2 < serverTimingEntries.length; _i2++) {
    var _serverTimingEntries$ = serverTimingEntries[_i2],
        name = _serverTimingEntries$.name,
        duration = _serverTimingEntries$.duration,
        description = _serverTimingEntries$.description;
    var timingValue = name;

    if (description) {
      timingValue += valueSeparator + 'desc=' + description;
    }

    if (duration) {
      timingValue += valueSeparator + 'dur=' + duration;
    }

    serverTimingInfo.push(timingValue);
  }

  return serverTimingInfo.join(entrySeparator);
}

function getTimeOrigin() {
  return PERF.timing.fetchStart;
}

function stripQueryStringFromUrl(url) {
  return url && url.split('?')[0];
}

function isObject(value) {
  return value !== null && typeof value === 'object';
}

function isFunction(value) {
  return typeof value === 'function';
}

function baseExtend(dst, objs, deep) {
  for (var i = 0, ii = objs.length; i < ii; ++i) {
    var obj = objs[i];
    if (!isObject(obj) && !isFunction(obj)) continue;
    var keys = Object.keys(obj);

    for (var j = 0, jj = keys.length; j < jj; j++) {
      var key = keys[j];
      var src = obj[key];

      if (deep && isObject(src)) {
        if (!isObject(dst[key])) dst[key] = Array.isArray(src) ? [] : {};
        baseExtend(dst[key], [src], false);
      } else {
        dst[key] = src;
      }
    }
  }

  return dst;
}

function getElasticScript() {
  if (typeof document !== 'undefined') {
    var scripts = document.getElementsByTagName('script');

    for (var i = 0, l = scripts.length; i < l; i++) {
      var sc = scripts[i];

      if (sc.src.indexOf('elastic') > 0) {
        return sc;
      }
    }
  }
}

function getCurrentScript() {
  if (typeof document !== 'undefined') {
    var currentScript = document.currentScript;

    if (!currentScript) {
      return getElasticScript();
    }

    return currentScript;
  }
}

function extend(dst) {
  return baseExtend(dst, slice.call(arguments, 1), false);
}

function merge(dst) {
  return baseExtend(dst, slice.call(arguments, 1), true);
}

function isUndefined(obj) {
  return typeof obj === 'undefined';
}

function noop() {}

function find(array, predicate, thisArg) {
  if (array == null) {
    throw new TypeError('array is null or not defined');
  }

  var o = Object(array);
  var len = o.length >>> 0;

  if (typeof predicate !== 'function') {
    throw new TypeError('predicate must be a function');
  }

  var k = 0;

  while (k < len) {
    var kValue = o[k];

    if (predicate.call(thisArg, kValue, k, o)) {
      return kValue;
    }

    k++;
  }

  return undefined;
}

function removeInvalidChars(key) {
  return key.replace(/[.*"]/g, '_');
}

function getLatestSpan(spans, typeFilter) {
  var latestSpan = null;

  for (var _i3 = 0; _i3 < spans.length; _i3++) {
    var span = spans[_i3];

    if (typeFilter && typeFilter(span.type) && (!latestSpan || latestSpan._end < span._end)) {
      latestSpan = span;
    }
  }

  return latestSpan;
}

function getLatestNonXHRSpan(spans) {
  return getLatestSpan(spans, function (type) {
    return String(type).indexOf('external') === -1;
  });
}

function getLatestXHRSpan(spans) {
  return getLatestSpan(spans, function (type) {
    return String(type).indexOf('external') !== -1;
  });
}

function getEarliestSpan(spans) {
  var earliestSpan = spans[0];

  for (var _i4 = 1; _i4 < spans.length; _i4++) {
    var span = spans[_i4];

    if (earliestSpan._start > span._start) {
      earliestSpan = span;
    }
  }

  return earliestSpan;
}

function now() {
  return PERF.now();
}

function getTime(time) {
  return typeof time === 'number' && time >= 0 ? time : now();
}

function getDuration(start, end) {
  if (isUndefined(end) || isUndefined(start)) {
    return null;
  }

  return parseInt(end - start);
}

function scheduleMacroTask(callback) {
  setTimeout(callback, 0);
}

function scheduleMicroTask(callback) {
  _polyfills__WEBPACK_IMPORTED_MODULE_0__.Promise.resolve().then(callback);
}

function isPerfTimelineSupported() {
  return typeof PERF.getEntriesByType === 'function';
}

function isPerfTypeSupported(type) {
  return typeof PerformanceObserver !== 'undefined' && PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.indexOf(type) >= 0;
}

function isBeaconInspectionEnabled() {
  var flagName = '_elastic_inspect_beacon_';

  if (sessionStorage.getItem(flagName) != null) {
    return true;
  }

  if (!window.URL || !window.URLSearchParams) {
    return false;
  }

  try {
    var parsedUrl = new URL(window.location.href);
    var isFlagSet = parsedUrl.searchParams.has(flagName);

    if (isFlagSet) {
      sessionStorage.setItem(flagName, true);
    }

    return isFlagSet;
  } catch (e) {}

  return false;
}

function isRedirectInfoAvailable(timing) {
  return timing.redirectStart > 0;
}



/***/ }),

/***/ "../rum-core/dist/es/error-logging/error-logging.js":
/*!**********************************************************!*\
  !*** ../rum-core/dist/es/error-logging/error-logging.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _stack_trace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stack-trace */ "../rum-core/dist/es/error-logging/stack-trace.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/context */ "../rum-core/dist/es/common/context.js");
/* harmony import */ var _common_truncate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/truncate */ "../rum-core/dist/es/common/truncate.js");
/* harmony import */ var error_stack_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! error-stack-parser */ "../../node_modules/error-stack-parser/error-stack-parser.js");
/* harmony import */ var error_stack_parser__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(error_stack_parser__WEBPACK_IMPORTED_MODULE_0__);
var _excluded = ["tags"];

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}






var IGNORE_KEYS = ['stack', 'message'];
var PROMISE_REJECTION_PREFIX = 'Unhandled promise rejection: ';

function getErrorProperties(error) {
  var propertyFound = false;
  var properties = {};
  Object.keys(error).forEach(function (key) {
    if (IGNORE_KEYS.indexOf(key) >= 0) {
      return;
    }

    var val = error[key];

    if (val == null || typeof val === 'function') {
      return;
    }

    if (typeof val === 'object') {
      if (typeof val.toISOString !== 'function') return;
      val = val.toISOString();
    }

    properties[key] = val;
    propertyFound = true;
  });

  if (propertyFound) {
    return properties;
  }
}

var ErrorLogging = function () {
  function ErrorLogging(apmServer, configService, transactionService) {
    this._apmServer = apmServer;
    this._configService = configService;
    this._transactionService = transactionService;
  }

  var _proto = ErrorLogging.prototype;

  _proto.createErrorDataModel = function createErrorDataModel(errorEvent) {
    var frames = (0,_stack_trace__WEBPACK_IMPORTED_MODULE_1__.createStackTraces)((error_stack_parser__WEBPACK_IMPORTED_MODULE_0___default()), errorEvent);
    var filteredFrames = (0,_stack_trace__WEBPACK_IMPORTED_MODULE_1__.filterInvalidFrames)(frames);
    var culprit = '(inline script)';
    var lastFrame = filteredFrames[filteredFrames.length - 1];

    if (lastFrame && lastFrame.filename) {
      culprit = lastFrame.filename;
    }

    var message = errorEvent.message,
        error = errorEvent.error;
    var errorMessage = message;
    var errorType = '';
    var errorContext = {};

    if (error && typeof error === 'object') {
      errorMessage = errorMessage || error.message;
      errorType = error.name;
      var customProperties = getErrorProperties(error);

      if (customProperties) {
        errorContext.custom = customProperties;
      }
    }

    if (!errorType) {
      if (errorMessage && errorMessage.indexOf(':') > -1) {
        errorType = errorMessage.split(':')[0];
      }
    }

    var currentTransaction = this._transactionService.getCurrentTransaction();

    var transactionContext = currentTransaction ? currentTransaction.context : {};

    var _this$_configService$ = this._configService.get('context'),
        tags = _this$_configService$.tags,
        configContext = _objectWithoutPropertiesLoose(_this$_configService$, _excluded);

    var pageContext = (0,_common_context__WEBPACK_IMPORTED_MODULE_2__.getPageContext)();
    var context = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.merge)({}, pageContext, transactionContext, configContext, errorContext);
    var errorObject = {
      id: (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.generateRandomId)(),
      culprit: culprit,
      exception: {
        message: errorMessage,
        stacktrace: filteredFrames,
        type: errorType
      },
      context: context
    };

    if (currentTransaction) {
      errorObject = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.extend)(errorObject, {
        trace_id: currentTransaction.traceId,
        parent_id: currentTransaction.id,
        transaction_id: currentTransaction.id,
        transaction: {
          type: currentTransaction.type,
          sampled: currentTransaction.sampled
        }
      });
    }

    return (0,_common_truncate__WEBPACK_IMPORTED_MODULE_4__.truncateModel)(_common_truncate__WEBPACK_IMPORTED_MODULE_4__.ERROR_MODEL, errorObject);
  };

  _proto.logErrorEvent = function logErrorEvent(errorEvent) {
    if (typeof errorEvent === 'undefined') {
      return;
    }

    var errorObject = this.createErrorDataModel(errorEvent);

    if (typeof errorObject.exception.message === 'undefined') {
      return;
    }

    this._apmServer.addError(errorObject);
  };

  _proto.registerListeners = function registerListeners() {
    var _this = this;

    window.addEventListener('error', function (errorEvent) {
      return _this.logErrorEvent(errorEvent);
    });
    window.addEventListener('unhandledrejection', function (promiseRejectionEvent) {
      return _this.logPromiseEvent(promiseRejectionEvent);
    });
  };

  _proto.logPromiseEvent = function logPromiseEvent(promiseRejectionEvent) {
    var reason = promiseRejectionEvent.reason;

    if (reason == null) {
      reason = '<no reason specified>';
    }

    var errorEvent;

    if (typeof reason.message === 'string') {
      var name = reason.name ? reason.name + ': ' : '';
      errorEvent = {
        error: reason,
        message: PROMISE_REJECTION_PREFIX + name + reason.message
      };
    } else {
      errorEvent = this._parseRejectReason(reason);
    }

    this.logErrorEvent(errorEvent);
  };

  _proto.logError = function logError(messageOrError) {
    var errorEvent = {};

    if (typeof messageOrError === 'string') {
      errorEvent.message = messageOrError;
    } else {
      errorEvent.error = messageOrError;
    }

    return this.logErrorEvent(errorEvent);
  };

  _proto._parseRejectReason = function _parseRejectReason(reason) {
    var errorEvent = {
      message: PROMISE_REJECTION_PREFIX
    };

    if (Array.isArray(reason)) {
      errorEvent.message += '<object>';
    } else if (typeof reason === 'object') {
      try {
        errorEvent.message += JSON.stringify(reason);
        errorEvent.error = reason;
      } catch (error) {
        errorEvent.message += '<object>';
      }
    } else if (typeof reason === 'function') {
      errorEvent.message += '<function>';
    } else {
      errorEvent.message += reason;
    }

    return errorEvent;
  };

  return ErrorLogging;
}();

/* harmony default export */ __webpack_exports__["default"] = (ErrorLogging);

/***/ }),

/***/ "../rum-core/dist/es/error-logging/index.js":
/*!**************************************************!*\
  !*** ../rum-core/dist/es/error-logging/index.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registerServices: function() { return /* binding */ registerServices; }
/* harmony export */ });
/* harmony import */ var _error_logging__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./error-logging */ "../rum-core/dist/es/error-logging/error-logging.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_service_factory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/service-factory */ "../rum-core/dist/es/common/service-factory.js");




function registerServices() {
  _common_service_factory__WEBPACK_IMPORTED_MODULE_0__.serviceCreators[_common_constants__WEBPACK_IMPORTED_MODULE_1__.ERROR_LOGGING] = function (serviceFactory) {
    var _serviceFactory$getSe = serviceFactory.getService([_common_constants__WEBPACK_IMPORTED_MODULE_1__.APM_SERVER, _common_constants__WEBPACK_IMPORTED_MODULE_1__.CONFIG_SERVICE, _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_SERVICE]),
        apmServer = _serviceFactory$getSe[0],
        configService = _serviceFactory$getSe[1],
        transactionService = _serviceFactory$getSe[2];

    return new _error_logging__WEBPACK_IMPORTED_MODULE_2__["default"](apmServer, configService, transactionService);
  };
}



/***/ }),

/***/ "../rum-core/dist/es/error-logging/stack-trace.js":
/*!********************************************************!*\
  !*** ../rum-core/dist/es/error-logging/stack-trace.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createStackTraces: function() { return /* binding */ createStackTraces; },
/* harmony export */   filterInvalidFrames: function() { return /* binding */ filterInvalidFrames; }
/* harmony export */ });
function filePathToFileName(fileUrl) {
  var origin = window.location.origin || window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

  if (fileUrl.indexOf(origin) > -1) {
    fileUrl = fileUrl.replace(origin + '/', '');
  }

  return fileUrl;
}

function cleanFilePath(filePath) {
  if (filePath === void 0) {
    filePath = '';
  }

  if (filePath === '<anonymous>') {
    filePath = '';
  }

  return filePath;
}

function isFileInline(fileUrl) {
  if (fileUrl) {
    return window.location.href.indexOf(fileUrl) === 0;
  }

  return false;
}

function normalizeStackFrames(stackFrames) {
  return stackFrames.map(function (frame) {
    if (frame.functionName) {
      frame.functionName = normalizeFunctionName(frame.functionName);
    }

    return frame;
  });
}

function normalizeFunctionName(fnName) {
  var parts = fnName.split('/');

  if (parts.length > 1) {
    fnName = ['Object', parts[parts.length - 1]].join('.');
  } else {
    fnName = parts[0];
  }

  fnName = fnName.replace(/.<$/gi, '.<anonymous>');
  fnName = fnName.replace(/^Anonymous function$/, '<anonymous>');
  parts = fnName.split('.');

  if (parts.length > 1) {
    fnName = parts[parts.length - 1];
  } else {
    fnName = parts[0];
  }

  return fnName;
}

function isValidStackTrace(stackTraces) {
  if (stackTraces.length === 0) {
    return false;
  }

  if (stackTraces.length === 1) {
    var stackTrace = stackTraces[0];
    return 'lineNumber' in stackTrace;
  }

  return true;
}

function createStackTraces(stackParser, errorEvent) {
  var error = errorEvent.error,
      filename = errorEvent.filename,
      lineno = errorEvent.lineno,
      colno = errorEvent.colno;
  var stackTraces = [];

  if (error) {
    try {
      stackTraces = stackParser.parse(error);
    } catch (e) {}
  }

  if (!isValidStackTrace(stackTraces)) {
    stackTraces = [{
      fileName: filename,
      lineNumber: lineno,
      columnNumber: colno
    }];
  }

  var normalizedStackTraces = normalizeStackFrames(stackTraces);
  return normalizedStackTraces.map(function (stack) {
    var fileName = stack.fileName,
        lineNumber = stack.lineNumber,
        columnNumber = stack.columnNumber,
        _stack$functionName = stack.functionName,
        functionName = _stack$functionName === void 0 ? '<anonymous>' : _stack$functionName;

    if (!fileName && !lineNumber) {
      return {};
    }

    if (!columnNumber && !lineNumber) {
      return {};
    }

    var filePath = cleanFilePath(fileName);
    var cleanedFileName = filePathToFileName(filePath);

    if (isFileInline(filePath)) {
      cleanedFileName = '(inline script)';
    }

    return {
      abs_path: fileName,
      filename: cleanedFileName,
      function: functionName,
      lineno: lineNumber,
      colno: columnNumber
    };
  });
}
function filterInvalidFrames(frames) {
  return frames.filter(function (_ref) {
    var filename = _ref.filename,
        lineno = _ref.lineno;
    return typeof filename !== 'undefined' && typeof lineno !== 'undefined';
  });
}

/***/ }),

/***/ "../rum-core/dist/es/index.js":
/*!************************************!*\
  !*** ../rum-core/dist/es/index.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   APM_SERVER: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.APM_SERVER; },
/* harmony export */   CLICK: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.CLICK; },
/* harmony export */   CONFIG_SERVICE: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.CONFIG_SERVICE; },
/* harmony export */   ERROR: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.ERROR; },
/* harmony export */   ERROR_LOGGING: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.ERROR_LOGGING; },
/* harmony export */   EVENT_TARGET: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.EVENT_TARGET; },
/* harmony export */   LOGGING_SERVICE: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.LOGGING_SERVICE; },
/* harmony export */   PAGE_LOAD: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.PAGE_LOAD; },
/* harmony export */   PAGE_LOAD_DELAY: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.PAGE_LOAD_DELAY; },
/* harmony export */   PERFORMANCE_MONITORING: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.PERFORMANCE_MONITORING; },
/* harmony export */   ServiceFactory: function() { return /* reexport safe */ _common_service_factory__WEBPACK_IMPORTED_MODULE_2__.ServiceFactory; },
/* harmony export */   TRANSACTION_SERVICE: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.TRANSACTION_SERVICE; },
/* harmony export */   afterFrame: function() { return /* reexport safe */ _common_after_frame__WEBPACK_IMPORTED_MODULE_7__["default"]; },
/* harmony export */   bootstrap: function() { return /* reexport safe */ _bootstrap__WEBPACK_IMPORTED_MODULE_9__.bootstrap; },
/* harmony export */   createServiceFactory: function() { return /* binding */ createServiceFactory; },
/* harmony export */   createTracer: function() { return /* reexport safe */ _opentracing__WEBPACK_IMPORTED_MODULE_6__.createTracer; },
/* harmony export */   getInstrumentationFlags: function() { return /* reexport safe */ _common_instrument__WEBPACK_IMPORTED_MODULE_5__.getInstrumentationFlags; },
/* harmony export */   isBrowser: function() { return /* reexport safe */ _common_utils__WEBPACK_IMPORTED_MODULE_4__.isBrowser; },
/* harmony export */   isPlatformSupported: function() { return /* reexport safe */ _common_utils__WEBPACK_IMPORTED_MODULE_4__.isPlatformSupported; },
/* harmony export */   observePageClicks: function() { return /* reexport safe */ _common_observers__WEBPACK_IMPORTED_MODULE_11__.observePageClicks; },
/* harmony export */   observePageVisibility: function() { return /* reexport safe */ _common_observers__WEBPACK_IMPORTED_MODULE_10__.observePageVisibility; },
/* harmony export */   patchAll: function() { return /* reexport safe */ _common_patching__WEBPACK_IMPORTED_MODULE_3__.patchAll; },
/* harmony export */   patchEventHandler: function() { return /* reexport safe */ _common_patching__WEBPACK_IMPORTED_MODULE_3__.patchEventHandler; },
/* harmony export */   scheduleMacroTask: function() { return /* reexport safe */ _common_utils__WEBPACK_IMPORTED_MODULE_4__.scheduleMacroTask; },
/* harmony export */   scheduleMicroTask: function() { return /* reexport safe */ _common_utils__WEBPACK_IMPORTED_MODULE_4__.scheduleMicroTask; }
/* harmony export */ });
/* harmony import */ var _error_logging__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./error-logging */ "../rum-core/dist/es/error-logging/index.js");
/* harmony import */ var _performance_monitoring__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./performance-monitoring */ "../rum-core/dist/es/performance-monitoring/index.js");
/* harmony import */ var _common_service_factory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/service-factory */ "../rum-core/dist/es/common/service-factory.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_patching__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common/patching */ "../rum-core/dist/es/common/patching/index.js");
/* harmony import */ var _common_observers__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./common/observers */ "../rum-core/dist/es/common/observers/page-visibility.js");
/* harmony import */ var _common_observers__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./common/observers */ "../rum-core/dist/es/common/observers/page-clicks.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_instrument__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common/instrument */ "../rum-core/dist/es/common/instrument.js");
/* harmony import */ var _common_after_frame__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./common/after-frame */ "../rum-core/dist/es/common/after-frame.js");
/* harmony import */ var _bootstrap__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./bootstrap */ "../rum-core/dist/es/bootstrap.js");
/* harmony import */ var _opentracing__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./opentracing */ "../rum-core/dist/es/opentracing/index.js");












function createServiceFactory() {
  (0,_performance_monitoring__WEBPACK_IMPORTED_MODULE_0__.registerServices)();
  (0,_error_logging__WEBPACK_IMPORTED_MODULE_1__.registerServices)();
  var serviceFactory = new _common_service_factory__WEBPACK_IMPORTED_MODULE_2__.ServiceFactory();
  return serviceFactory;
}



/***/ }),

/***/ "../rum-core/dist/es/opentracing/index.js":
/*!************************************************!*\
  !*** ../rum-core/dist/es/opentracing/index.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Span: function() { return /* reexport safe */ _span__WEBPACK_IMPORTED_MODULE_2__["default"]; },
/* harmony export */   Tracer: function() { return /* reexport safe */ _tracer__WEBPACK_IMPORTED_MODULE_1__["default"]; },
/* harmony export */   createTracer: function() { return /* binding */ createTracer; }
/* harmony export */ });
/* harmony import */ var _tracer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tracer */ "../rum-core/dist/es/opentracing/tracer.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./span */ "../rum-core/dist/es/opentracing/span.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");




function createTracer(serviceFactory) {
  var performanceMonitoring = serviceFactory.getService(_common_constants__WEBPACK_IMPORTED_MODULE_0__.PERFORMANCE_MONITORING);
  var transactionService = serviceFactory.getService(_common_constants__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE);
  var errorLogging = serviceFactory.getService(_common_constants__WEBPACK_IMPORTED_MODULE_0__.ERROR_LOGGING);
  var loggingService = serviceFactory.getService(_common_constants__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE);
  return new _tracer__WEBPACK_IMPORTED_MODULE_1__["default"](performanceMonitoring, transactionService, loggingService, errorLogging);
}



/***/ }),

/***/ "../rum-core/dist/es/opentracing/span.js":
/*!***********************************************!*\
  !*** ../rum-core/dist/es/opentracing/span.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var opentracing_lib_span__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! opentracing/lib/span */ "../../node_modules/opentracing/lib/span.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _performance_monitoring_transaction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../performance-monitoring/transaction */ "../rum-core/dist/es/performance-monitoring/transaction.js");
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}





var Span = function (_otSpan) {
  _inheritsLoose(Span, _otSpan);

  function Span(tracer, span) {
    var _this;

    _this = _otSpan.call(this) || this;
    _this.__tracer = tracer;
    _this.span = span;
    _this.isTransaction = span instanceof _performance_monitoring_transaction__WEBPACK_IMPORTED_MODULE_1__["default"];
    _this.spanContext = {
      id: span.id,
      traceId: span.traceId,
      sampled: span.sampled
    };
    return _this;
  }

  var _proto = Span.prototype;

  _proto._context = function _context() {
    return this.spanContext;
  };

  _proto._tracer = function _tracer() {
    return this.__tracer;
  };

  _proto._setOperationName = function _setOperationName(name) {
    this.span.name = name;
  };

  _proto._addTags = function _addTags(keyValuePairs) {
    var tags = (0,_common_utils__WEBPACK_IMPORTED_MODULE_2__.extend)({}, keyValuePairs);

    if (tags.type) {
      this.span.type = tags.type;
      delete tags.type;
    }

    if (this.isTransaction) {
      var userId = tags['user.id'];
      var username = tags['user.username'];
      var email = tags['user.email'];

      if (userId || username || email) {
        this.span.addContext({
          user: {
            id: userId,
            username: username,
            email: email
          }
        });
        delete tags['user.id'];
        delete tags['user.username'];
        delete tags['user.email'];
      }
    }

    this.span.addLabels(tags);
  };

  _proto._log = function _log(log, timestamp) {
    if (log.event === 'error') {
      if (log['error.object']) {
        this.__tracer.errorLogging.logError(log['error.object']);
      } else if (log.message) {
        this.__tracer.errorLogging.logError(log.message);
      }
    }
  };

  _proto._finish = function _finish(finishTime) {
    this.span.end();

    if (finishTime) {
      this.span._end = finishTime - (0,_common_utils__WEBPACK_IMPORTED_MODULE_2__.getTimeOrigin)();
    }
  };

  return Span;
}(opentracing_lib_span__WEBPACK_IMPORTED_MODULE_0__.Span);

/* harmony default export */ __webpack_exports__["default"] = (Span);

/***/ }),

/***/ "../rum-core/dist/es/opentracing/tracer.js":
/*!*************************************************!*\
  !*** ../rum-core/dist/es/opentracing/tracer.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var opentracing_lib_tracer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! opentracing/lib/tracer */ "../../node_modules/opentracing/lib/tracer.js");
/* harmony import */ var opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! opentracing/lib/constants */ "../../node_modules/opentracing/lib/constants.js");
/* harmony import */ var opentracing_lib_span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! opentracing/lib/span */ "../../node_modules/opentracing/lib/span.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./span */ "../rum-core/dist/es/opentracing/span.js");
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}








var Tracer = function (_otTracer) {
  _inheritsLoose(Tracer, _otTracer);

  function Tracer(performanceMonitoring, transactionService, loggingService, errorLogging) {
    var _this;

    _this = _otTracer.call(this) || this;
    _this.performanceMonitoring = performanceMonitoring;
    _this.transactionService = transactionService;
    _this.loggingService = loggingService;
    _this.errorLogging = errorLogging;
    return _this;
  }

  var _proto = Tracer.prototype;

  _proto._startSpan = function _startSpan(name, options) {
    var spanOptions = {
      managed: true
    };

    if (options) {
      spanOptions.timestamp = options.startTime;

      if (options.childOf) {
        spanOptions.parentId = options.childOf.id;
      } else if (options.references && options.references.length > 0) {
        if (options.references.length > 1) {
          if (_state__WEBPACK_IMPORTED_MODULE_3__.__DEV__) {
            this.loggingService.debug('Elastic APM OpenTracing: Unsupported number of references, only the first childOf reference will be recorded.');
          }
        }

        var childRef = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.find)(options.references, function (ref) {
          return ref.type() === opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.REFERENCE_CHILD_OF;
        });

        if (childRef) {
          spanOptions.parentId = childRef.referencedContext().id;
        }
      }
    }

    var span;
    var currentTransaction = this.transactionService.getCurrentTransaction();

    if (currentTransaction) {
      span = this.transactionService.startSpan(name, undefined, spanOptions);
    } else {
      span = this.transactionService.startTransaction(name, undefined, spanOptions);
    }

    if (!span) {
      return new opentracing_lib_span__WEBPACK_IMPORTED_MODULE_2__.Span();
    }

    if (spanOptions.timestamp) {
      span._start = spanOptions.timestamp - (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.getTimeOrigin)();
    }

    var otSpan = new _span__WEBPACK_IMPORTED_MODULE_5__["default"](this, span);

    if (options && options.tags) {
      otSpan.addTags(options.tags);
    }

    return otSpan;
  };

  _proto._inject = function _inject(spanContext, format, carrier) {
    switch (format) {
      case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_TEXT_MAP:
      case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_HTTP_HEADERS:
        this.performanceMonitoring.injectDtHeader(spanContext, carrier);
        break;

      case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_BINARY:
        if (_state__WEBPACK_IMPORTED_MODULE_3__.__DEV__) {
          this.loggingService.debug('Elastic APM OpenTracing: binary carrier format is not supported.');
        }

        break;
    }
  };

  _proto._extract = function _extract(format, carrier) {
    var ctx;

    switch (format) {
      case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_TEXT_MAP:
      case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_HTTP_HEADERS:
        ctx = this.performanceMonitoring.extractDtHeader(carrier);
        break;

      case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_BINARY:
        if (_state__WEBPACK_IMPORTED_MODULE_3__.__DEV__) {
          this.loggingService.debug('Elastic APM OpenTracing: binary carrier format is not supported.');
        }

        break;
    }

    if (!ctx) {
      ctx = null;
    }

    return ctx;
  };

  return Tracer;
}(opentracing_lib_tracer__WEBPACK_IMPORTED_MODULE_0__.Tracer);

/* harmony default export */ __webpack_exports__["default"] = (Tracer);

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/breakdown.js":
/*!***************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/breakdown.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   captureBreakdown: function() { return /* binding */ captureBreakdown; }
/* harmony export */ });
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");


var pageLoadBreakdowns = [['domainLookupStart', 'domainLookupEnd', 'DNS'], ['connectStart', 'connectEnd', 'TCP'], ['requestStart', 'responseStart', 'Request'], ['responseStart', 'responseEnd', 'Response'], ['domLoading', 'domComplete', 'Processing'], ['loadEventStart', 'loadEventEnd', 'Load']];

function getValue(value) {
  return {
    value: value
  };
}

function calculateSelfTime(transaction) {
  var spans = transaction.spans,
      _start = transaction._start,
      _end = transaction._end;

  if (spans.length === 0) {
    return transaction.duration();
  }

  spans.sort(function (span1, span2) {
    return span1._start - span2._start;
  });
  var span = spans[0];
  var spanEnd = span._end;
  var spanStart = span._start;
  var lastContinuousEnd = spanEnd;
  var selfTime = spanStart - _start;

  for (var i = 1; i < spans.length; i++) {
    span = spans[i];
    spanStart = span._start;
    spanEnd = span._end;

    if (spanStart > lastContinuousEnd) {
      selfTime += spanStart - lastContinuousEnd;
      lastContinuousEnd = spanEnd;
    } else if (spanEnd > lastContinuousEnd) {
      lastContinuousEnd = spanEnd;
    }
  }

  if (lastContinuousEnd < _end) {
    selfTime += _end - lastContinuousEnd;
  }

  return selfTime;
}

function groupSpans(transaction) {
  var spanMap = {};
  var transactionSelfTime = calculateSelfTime(transaction);
  spanMap['app'] = {
    count: 1,
    duration: transactionSelfTime
  };
  var spans = transaction.spans;

  for (var i = 0; i < spans.length; i++) {
    var span = spans[i];
    var duration = span.duration();

    if (duration === 0 || duration == null) {
      continue;
    }

    var type = span.type,
        subtype = span.subtype;
    var key = type.replace(_common_constants__WEBPACK_IMPORTED_MODULE_0__.TRUNCATED_TYPE, '');

    if (subtype) {
      key += '.' + subtype;
    }

    if (!spanMap[key]) {
      spanMap[key] = {
        duration: 0,
        count: 0
      };
    }

    spanMap[key].count++;
    spanMap[key].duration += duration;
  }

  return spanMap;
}

function getSpanBreakdown(transactionDetails, _ref) {
  var details = _ref.details,
      _ref$count = _ref.count,
      count = _ref$count === void 0 ? 1 : _ref$count,
      duration = _ref.duration;
  return {
    transaction: transactionDetails,
    span: details,
    samples: {
      'span.self_time.count': getValue(count),
      'span.self_time.sum.us': getValue(duration * 1000)
    }
  };
}

function captureBreakdown(transaction, timings) {
  if (timings === void 0) {
    timings = _common_utils__WEBPACK_IMPORTED_MODULE_1__.PERF.timing;
  }

  var breakdowns = [];
  var name = transaction.name,
      type = transaction.type,
      sampled = transaction.sampled;
  var transactionDetails = {
    name: name,
    type: type
  };

  if (!sampled) {
    return breakdowns;
  }

  if (type === _common_constants__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD && timings) {
    for (var i = 0; i < pageLoadBreakdowns.length; i++) {
      var current = pageLoadBreakdowns[i];
      var start = timings[current[0]];
      var end = timings[current[1]];
      var duration = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.getDuration)(start, end);

      if (duration === 0 || duration == null) {
        continue;
      }

      breakdowns.push(getSpanBreakdown(transactionDetails, {
        details: {
          type: current[2]
        },
        duration: duration
      }));
    }
  } else {
    var spanMap = groupSpans(transaction);
    Object.keys(spanMap).forEach(function (key) {
      var _key$split = key.split('.'),
          type = _key$split[0],
          subtype = _key$split[1];

      var _spanMap$key = spanMap[key],
          duration = _spanMap$key.duration,
          count = _spanMap$key.count;
      breakdowns.push(getSpanBreakdown(transactionDetails, {
        details: {
          type: type,
          subtype: subtype
        },
        duration: duration,
        count: count
      }));
    });
  }

  return breakdowns;
}

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/index.js":
/*!***********************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/index.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registerServices: function() { return /* binding */ registerServices; }
/* harmony export */ });
/* harmony import */ var _performance_monitoring__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./performance-monitoring */ "../rum-core/dist/es/performance-monitoring/performance-monitoring.js");
/* harmony import */ var _transaction_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transaction-service */ "../rum-core/dist/es/performance-monitoring/transaction-service.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_service_factory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/service-factory */ "../rum-core/dist/es/common/service-factory.js");





function registerServices() {
  _common_service_factory__WEBPACK_IMPORTED_MODULE_0__.serviceCreators[_common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_SERVICE] = function (serviceFactory) {
    var _serviceFactory$getSe = serviceFactory.getService([_common_constants__WEBPACK_IMPORTED_MODULE_1__.LOGGING_SERVICE, _common_constants__WEBPACK_IMPORTED_MODULE_1__.CONFIG_SERVICE]),
        loggingService = _serviceFactory$getSe[0],
        configService = _serviceFactory$getSe[1];

    return new _transaction_service__WEBPACK_IMPORTED_MODULE_2__["default"](loggingService, configService);
  };

  _common_service_factory__WEBPACK_IMPORTED_MODULE_0__.serviceCreators[_common_constants__WEBPACK_IMPORTED_MODULE_1__.PERFORMANCE_MONITORING] = function (serviceFactory) {
    var _serviceFactory$getSe2 = serviceFactory.getService([_common_constants__WEBPACK_IMPORTED_MODULE_1__.APM_SERVER, _common_constants__WEBPACK_IMPORTED_MODULE_1__.CONFIG_SERVICE, _common_constants__WEBPACK_IMPORTED_MODULE_1__.LOGGING_SERVICE, _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_SERVICE]),
        apmServer = _serviceFactory$getSe2[0],
        configService = _serviceFactory$getSe2[1],
        loggingService = _serviceFactory$getSe2[2],
        transactionService = _serviceFactory$getSe2[3];

    return new _performance_monitoring__WEBPACK_IMPORTED_MODULE_3__["default"](apmServer, configService, loggingService, transactionService);
  };
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/metrics.js":
/*!*************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/metrics.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PerfEntryRecorder: function() { return /* binding */ PerfEntryRecorder; },
/* harmony export */   calculateCumulativeLayoutShift: function() { return /* binding */ calculateCumulativeLayoutShift; },
/* harmony export */   calculateTotalBlockingTime: function() { return /* binding */ calculateTotalBlockingTime; },
/* harmony export */   captureObserverEntries: function() { return /* binding */ captureObserverEntries; },
/* harmony export */   createFirstInputDelaySpan: function() { return /* binding */ createFirstInputDelaySpan; },
/* harmony export */   createLongTaskSpans: function() { return /* binding */ createLongTaskSpans; },
/* harmony export */   createTotalBlockingTimeSpan: function() { return /* binding */ createTotalBlockingTimeSpan; },
/* harmony export */   metrics: function() { return /* binding */ metrics; }
/* harmony export */ });
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./span */ "../rum-core/dist/es/performance-monitoring/span.js");



var metrics = {
  fid: 0,
  fcp: 0,
  tbt: {
    start: Infinity,
    duration: 0
  },
  cls: {
    score: 0,
    firstEntryTime: Number.NEGATIVE_INFINITY,
    prevEntryTime: Number.NEGATIVE_INFINITY,
    currentSessionScore: 0
  },
  longtask: {
    count: 0,
    duration: 0,
    max: 0
  }
};
var LONG_TASK_THRESHOLD = 50;
function createLongTaskSpans(longtasks, agg) {
  var spans = [];

  for (var i = 0; i < longtasks.length; i++) {
    var _longtasks$i = longtasks[i],
        name = _longtasks$i.name,
        startTime = _longtasks$i.startTime,
        duration = _longtasks$i.duration,
        attribution = _longtasks$i.attribution;
    var end = startTime + duration;
    var span = new _span__WEBPACK_IMPORTED_MODULE_0__["default"]("Longtask(" + name + ")", _common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK, {
      startTime: startTime
    });
    agg.count++;
    agg.duration += duration;
    agg.max = Math.max(duration, agg.max);

    if (attribution.length > 0) {
      var _attribution$ = attribution[0],
          _name = _attribution$.name,
          containerType = _attribution$.containerType,
          containerName = _attribution$.containerName,
          containerId = _attribution$.containerId;
      var customContext = {
        attribution: _name,
        type: containerType
      };

      if (containerName) {
        customContext.name = containerName;
      }

      if (containerId) {
        customContext.id = containerId;
      }

      span.addContext({
        custom: customContext
      });
    }

    span.end(end);
    spans.push(span);
  }

  return spans;
}
function createFirstInputDelaySpan(fidEntries) {
  var firstInput = fidEntries[0];

  if (firstInput) {
    var startTime = firstInput.startTime,
        processingStart = firstInput.processingStart;
    var span = new _span__WEBPACK_IMPORTED_MODULE_0__["default"]('First Input Delay', _common_constants__WEBPACK_IMPORTED_MODULE_1__.FIRST_INPUT, {
      startTime: startTime
    });
    span.end(processingStart);
    return span;
  }
}
function createTotalBlockingTimeSpan(tbtObject) {
  var start = tbtObject.start,
      duration = tbtObject.duration;
  var tbtSpan = new _span__WEBPACK_IMPORTED_MODULE_0__["default"]('Total Blocking Time', _common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK, {
    startTime: start
  });
  tbtSpan.end(start + duration);
  return tbtSpan;
}
function calculateTotalBlockingTime(longtaskEntries) {
  longtaskEntries.forEach(function (entry) {
    var name = entry.name,
        startTime = entry.startTime,
        duration = entry.duration;

    if (startTime < metrics.fcp) {
      return;
    }

    if (name !== 'self' && name.indexOf('same-origin') === -1) {
      return;
    }

    metrics.tbt.start = Math.min(metrics.tbt.start, startTime);
    var blockingTime = duration - LONG_TASK_THRESHOLD;

    if (blockingTime > 0) {
      metrics.tbt.duration += blockingTime;
    }
  });
}
function calculateCumulativeLayoutShift(clsEntries) {
  clsEntries.forEach(function (entry) {
    if (!entry.hadRecentInput && entry.value) {
      var shouldCreateNewSession = entry.startTime - metrics.cls.firstEntryTime > 5000 || entry.startTime - metrics.cls.prevEntryTime > 1000;

      if (shouldCreateNewSession) {
        metrics.cls.firstEntryTime = entry.startTime;
        metrics.cls.currentSessionScore = 0;
      }

      metrics.cls.prevEntryTime = entry.startTime;
      metrics.cls.currentSessionScore += entry.value;
      metrics.cls.score = Math.max(metrics.cls.score, metrics.cls.currentSessionScore);
    }
  });
}
function captureObserverEntries(list, _ref) {
  var isHardNavigation = _ref.isHardNavigation,
      trStart = _ref.trStart;
  var longtaskEntries = list.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK).filter(function (entry) {
    return entry.startTime >= trStart;
  });
  var longTaskSpans = createLongTaskSpans(longtaskEntries, metrics.longtask);
  var result = {
    spans: longTaskSpans,
    marks: {}
  };

  if (!isHardNavigation) {
    return result;
  }

  var lcpEntries = list.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LARGEST_CONTENTFUL_PAINT);
  var lastLcpEntry = lcpEntries[lcpEntries.length - 1];

  if (lastLcpEntry) {
    var lcp = parseInt(lastLcpEntry.startTime);
    metrics.lcp = lcp;
    result.marks.largestContentfulPaint = lcp;
  }

  var timing = _common_utils__WEBPACK_IMPORTED_MODULE_2__.PERF.timing;
  var unloadDiff = timing.fetchStart - timing.navigationStart;

  if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_2__.isRedirectInfoAvailable)(timing)) {
    unloadDiff = 0;
  }

  var fcpEntry = list.getEntriesByName(_common_constants__WEBPACK_IMPORTED_MODULE_1__.FIRST_CONTENTFUL_PAINT)[0];

  if (fcpEntry) {
    var fcp = parseInt(unloadDiff >= 0 ? fcpEntry.startTime - unloadDiff : fcpEntry.startTime);
    metrics.fcp = fcp;
    result.marks.firstContentfulPaint = fcp;
  }

  var fidEntries = list.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_1__.FIRST_INPUT);
  var fidSpan = createFirstInputDelaySpan(fidEntries);

  if (fidSpan) {
    metrics.fid = fidSpan.duration();
    result.spans.push(fidSpan);
  }

  calculateTotalBlockingTime(longtaskEntries);
  var clsEntries = list.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LAYOUT_SHIFT);
  calculateCumulativeLayoutShift(clsEntries);
  return result;
}
var PerfEntryRecorder = function () {
  function PerfEntryRecorder(callback) {
    this.po = {
      observe: _common_utils__WEBPACK_IMPORTED_MODULE_2__.noop,
      disconnect: _common_utils__WEBPACK_IMPORTED_MODULE_2__.noop
    };

    if (window.PerformanceObserver) {
      this.po = new PerformanceObserver(callback);
    }
  }

  var _proto = PerfEntryRecorder.prototype;

  _proto.start = function start(type) {
    try {
      if (!(0,_common_utils__WEBPACK_IMPORTED_MODULE_2__.isPerfTypeSupported)(type)) {
        return;
      }

      this.po.observe({
        type: type,
        buffered: true
      });
    } catch (_) {}
  };

  _proto.stop = function stop() {
    this.po.disconnect();
  };

  return PerfEntryRecorder;
}();

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/navigation/capture-navigation.js":
/*!***********************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/capture-navigation.js ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   captureNavigation: function() { return /* binding */ captureNavigation; },
/* harmony export */   createNavigationTimingSpans: function() { return /* reexport safe */ _navigation_timing__WEBPACK_IMPORTED_MODULE_2__.createNavigationTimingSpans; },
/* harmony export */   createResourceTimingSpans: function() { return /* reexport safe */ _resource_timing__WEBPACK_IMPORTED_MODULE_4__.createResourceTimingSpans; },
/* harmony export */   createUserTimingSpans: function() { return /* reexport safe */ _user_timing__WEBPACK_IMPORTED_MODULE_6__.createUserTimingSpans; },
/* harmony export */   getPageLoadMarks: function() { return /* reexport safe */ _marks__WEBPACK_IMPORTED_MODULE_3__.getPageLoadMarks; }
/* harmony export */ });
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../state */ "../rum-core/dist/es/state.js");
/* harmony import */ var _navigation_timing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./navigation-timing */ "../rum-core/dist/es/performance-monitoring/navigation/navigation-timing.js");
/* harmony import */ var _user_timing__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./user-timing */ "../rum-core/dist/es/performance-monitoring/navigation/user-timing.js");
/* harmony import */ var _resource_timing__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./resource-timing */ "../rum-core/dist/es/performance-monitoring/navigation/resource-timing.js");
/* harmony import */ var _marks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./marks */ "../rum-core/dist/es/performance-monitoring/navigation/marks.js");








function captureNavigation(transaction) {
  if (!transaction.captureTimings) {
    if (transaction.type === _common_constants__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD) {
      transaction._start = 0;
    }

    return;
  }

  var trEnd = transaction._end;

  if (transaction.type === _common_constants__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD) {
    if (transaction.marks && transaction.marks.custom) {
      var customMarks = transaction.marks.custom;
      Object.keys(customMarks).forEach(function (key) {
        customMarks[key] += transaction._start;
      });
    }

    var trStart = 0;
    transaction._start = trStart;
    var timings = _common_utils__WEBPACK_IMPORTED_MODULE_1__.PERF.timing;
    var baseTime = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.isRedirectInfoAvailable)(timings) ? timings.redirectStart : timings.fetchStart;
    (0,_navigation_timing__WEBPACK_IMPORTED_MODULE_2__.createNavigationTimingSpans)(timings, baseTime, trStart, trEnd).forEach(function (span) {
      span.traceId = transaction.traceId;
      span.sampled = transaction.sampled;

      if (span.pageResponse && transaction.options.pageLoadSpanId) {
        span.id = transaction.options.pageLoadSpanId;
      }

      transaction.spans.push(span);
    });
    transaction.addMarks((0,_marks__WEBPACK_IMPORTED_MODULE_3__.getPageLoadMarks)(timings));
  }

  if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.isPerfTimelineSupported)()) {
    var _trStart = transaction._start;
    var resourceEntries = _common_utils__WEBPACK_IMPORTED_MODULE_1__.PERF.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_0__.RESOURCE);
    (0,_resource_timing__WEBPACK_IMPORTED_MODULE_4__.createResourceTimingSpans)(resourceEntries, _state__WEBPACK_IMPORTED_MODULE_5__.state.bootstrapTime, _trStart, trEnd).forEach(function (span) {
      return transaction.spans.push(span);
    });
    var userEntries = _common_utils__WEBPACK_IMPORTED_MODULE_1__.PERF.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_0__.MEASURE);
    (0,_user_timing__WEBPACK_IMPORTED_MODULE_6__.createUserTimingSpans)(userEntries, _trStart, trEnd).forEach(function (span) {
      return transaction.spans.push(span);
    });
  }
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/navigation/marks.js":
/*!**********************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/marks.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COMPRESSED_NAV_TIMING_MARKS: function() { return /* binding */ COMPRESSED_NAV_TIMING_MARKS; },
/* harmony export */   NAVIGATION_TIMING_MARKS: function() { return /* binding */ NAVIGATION_TIMING_MARKS; },
/* harmony export */   getPageLoadMarks: function() { return /* binding */ getPageLoadMarks; }
/* harmony export */ });
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/utils */ "../rum-core/dist/es/common/utils.js");

var NAVIGATION_TIMING_MARKS = ['fetchStart', 'domainLookupStart', 'domainLookupEnd', 'connectStart', 'connectEnd', 'requestStart', 'responseStart', 'responseEnd', 'domLoading', 'domInteractive', 'domContentLoadedEventStart', 'domContentLoadedEventEnd', 'domComplete', 'loadEventStart', 'loadEventEnd'];
var COMPRESSED_NAV_TIMING_MARKS = ['fs', 'ls', 'le', 'cs', 'ce', 'qs', 'rs', 're', 'dl', 'di', 'ds', 'de', 'dc', 'es', 'ee'];

function getPageLoadMarks(timing) {
  var marks = getNavigationTimingMarks(timing);

  if (marks == null) {
    return null;
  }

  return {
    navigationTiming: marks,
    agent: {
      timeToFirstByte: marks.responseStart,
      domInteractive: marks.domInteractive,
      domComplete: marks.domComplete
    }
  };
}

function getNavigationTimingMarks(timing) {
  var redirectStart = timing.redirectStart,
      fetchStart = timing.fetchStart,
      navigationStart = timing.navigationStart,
      responseStart = timing.responseStart,
      responseEnd = timing.responseEnd;

  if (fetchStart >= navigationStart && responseStart >= fetchStart && responseEnd >= responseStart) {
    var marks = {};
    NAVIGATION_TIMING_MARKS.forEach(function (timingKey) {
      var m = timing[timingKey];

      if (m && m >= fetchStart) {
        if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.isRedirectInfoAvailable)(timing)) {
          marks[timingKey] = parseInt(m - redirectStart);
        } else {
          marks[timingKey] = parseInt(m - fetchStart);
        }
      }
    });
    return marks;
  }

  return null;
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/navigation/navigation-timing.js":
/*!**********************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/navigation-timing.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createNavigationTimingSpans: function() { return /* binding */ createNavigationTimingSpans; }
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/performance-monitoring/navigation/utils.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../span */ "../rum-core/dist/es/performance-monitoring/span.js");


var eventPairs = [['redirectStart', 'redirectEnd', 'Redirect'], ['domainLookupStart', 'domainLookupEnd', 'Domain lookup'], ['connectStart', 'connectEnd', 'Making a connection to the server'], ['requestStart', 'responseEnd', 'Requesting and receiving the document'], ['domLoading', 'domInteractive', 'Parsing the document, executing sync. scripts'], ['domContentLoadedEventStart', 'domContentLoadedEventEnd', 'Fire "DOMContentLoaded" event'], ['loadEventStart', 'loadEventEnd', 'Fire "load" event']];

function createNavigationTimingSpans(timings, baseTime, trStart, trEnd) {
  var spans = [];

  for (var i = 0; i < eventPairs.length; i++) {
    var start = timings[eventPairs[i][0]];
    var end = timings[eventPairs[i][1]];

    if (!(0,_utils__WEBPACK_IMPORTED_MODULE_0__.shouldCreateSpan)(start, end, trStart, trEnd, baseTime)) {
      continue;
    }

    var span = new _span__WEBPACK_IMPORTED_MODULE_1__["default"](eventPairs[i][2], 'hard-navigation.browser-timing');
    var data = null;

    if (eventPairs[i][0] === 'requestStart') {
      span.pageResponse = true;
      data = {
        url: location.origin
      };
    }

    span._start = start - baseTime;
    span.end(end - baseTime, data);
    spans.push(span);
  }

  return spans;
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/navigation/resource-timing.js":
/*!********************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/resource-timing.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createResourceTimingSpans: function() { return /* binding */ createResourceTimingSpans; }
/* harmony export */ });
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/performance-monitoring/navigation/utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../span */ "../rum-core/dist/es/performance-monitoring/span.js");





function createResourceTimingSpan(resourceTimingEntry) {
  var name = resourceTimingEntry.name,
      initiatorType = resourceTimingEntry.initiatorType,
      startTime = resourceTimingEntry.startTime,
      responseEnd = resourceTimingEntry.responseEnd;
  var kind = 'resource';

  if (initiatorType) {
    kind += '.' + initiatorType;
  }

  var spanName = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.stripQueryStringFromUrl)(name);
  var span = new _span__WEBPACK_IMPORTED_MODULE_1__["default"](spanName, kind);
  span._start = startTime;
  span.end(responseEnd, {
    url: name,
    entry: resourceTimingEntry
  });
  return span;
}

function isCapturedByPatching(resourceStartTime, requestPatchTime) {
  return requestPatchTime != null && resourceStartTime > requestPatchTime;
}

function isIntakeAPIEndpoint(url) {
  return /intake\/v\d+\/rum\/events/.test(url);
}

function createResourceTimingSpans(entries, requestPatchTime, trStart, trEnd) {
  var spans = [];

  for (var i = 0; i < entries.length; i++) {
    var _entries$i = entries[i],
        initiatorType = _entries$i.initiatorType,
        name = _entries$i.name,
        startTime = _entries$i.startTime,
        responseEnd = _entries$i.responseEnd;

    if (_common_constants__WEBPACK_IMPORTED_MODULE_2__.RESOURCE_INITIATOR_TYPES.indexOf(initiatorType) === -1 || name == null) {
      continue;
    }

    if ((initiatorType === 'xmlhttprequest' || initiatorType === 'fetch') && (isIntakeAPIEndpoint(name) || isCapturedByPatching(startTime, requestPatchTime))) {
      continue;
    }

    if ((0,_utils__WEBPACK_IMPORTED_MODULE_3__.shouldCreateSpan)(startTime, responseEnd, trStart, trEnd)) {
      spans.push(createResourceTimingSpan(entries[i]));
    }
  }

  return spans;
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/navigation/user-timing.js":
/*!****************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/user-timing.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createUserTimingSpans: function() { return /* binding */ createUserTimingSpans; }
/* harmony export */ });
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/performance-monitoring/navigation/utils.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../span */ "../rum-core/dist/es/performance-monitoring/span.js");




function createUserTimingSpans(entries, trStart, trEnd) {
  var userTimingSpans = [];

  for (var i = 0; i < entries.length; i++) {
    var _entries$i = entries[i],
        name = _entries$i.name,
        startTime = _entries$i.startTime,
        duration = _entries$i.duration;
    var end = startTime + duration;

    if (duration <= _common_constants__WEBPACK_IMPORTED_MODULE_0__.USER_TIMING_THRESHOLD || !(0,_utils__WEBPACK_IMPORTED_MODULE_1__.shouldCreateSpan)(startTime, end, trStart, trEnd)) {
      continue;
    }

    var kind = 'app';
    var span = new _span__WEBPACK_IMPORTED_MODULE_2__["default"](name, kind);
    span._start = startTime;
    span.end(end);
    userTimingSpans.push(span);
  }

  return userTimingSpans;
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/navigation/utils.js":
/*!**********************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/utils.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   shouldCreateSpan: function() { return /* binding */ shouldCreateSpan; }
/* harmony export */ });
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/constants */ "../rum-core/dist/es/common/constants.js");


function shouldCreateSpan(start, end, trStart, trEnd, baseTime) {
  if (baseTime === void 0) {
    baseTime = 0;
  }

  return typeof start === 'number' && typeof end === 'number' && start >= baseTime && end > start && start - baseTime >= trStart && end - baseTime <= trEnd && end - start < _common_constants__WEBPACK_IMPORTED_MODULE_0__.MAX_SPAN_DURATION && start - baseTime < _common_constants__WEBPACK_IMPORTED_MODULE_0__.MAX_SPAN_DURATION && end - baseTime < _common_constants__WEBPACK_IMPORTED_MODULE_0__.MAX_SPAN_DURATION;
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/performance-monitoring.js":
/*!****************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/performance-monitoring.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   adjustTransaction: function() { return /* binding */ adjustTransaction; },
/* harmony export */   "default": function() { return /* binding */ PerformanceMonitoring; },
/* harmony export */   groupSmallContinuouslySimilarSpans: function() { return /* binding */ groupSmallContinuouslySimilarSpans; }
/* harmony export */ });
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/url */ "../rum-core/dist/es/common/url.js");
/* harmony import */ var _common_patching__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/patching */ "../rum-core/dist/es/common/patching/index.js");
/* harmony import */ var _common_patching_patch_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/patching/patch-utils */ "../rum-core/dist/es/common/patching/patch-utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_truncate__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/truncate */ "../rum-core/dist/es/common/truncate.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");







var SIMILAR_SPAN_TO_TRANSACTION_RATIO = 0.05;
var TRANSACTION_DURATION_THRESHOLD = 60000;
function groupSmallContinuouslySimilarSpans(originalSpans, transDuration, threshold) {
  originalSpans.sort(function (spanA, spanB) {
    return spanA._start - spanB._start;
  });
  var spans = [];
  var lastCount = 1;
  originalSpans.forEach(function (span, index) {
    if (spans.length === 0) {
      spans.push(span);
    } else {
      var lastSpan = spans[spans.length - 1];
      var isContinuouslySimilar = lastSpan.type === span.type && lastSpan.subtype === span.subtype && lastSpan.action === span.action && lastSpan.name === span.name && span.duration() / transDuration < threshold && (span._start - lastSpan._end) / transDuration < threshold;
      var isLastSpan = originalSpans.length === index + 1;

      if (isContinuouslySimilar) {
        lastCount++;
        lastSpan._end = span._end;
      }

      if (lastCount > 1 && (!isContinuouslySimilar || isLastSpan)) {
        lastSpan.name = lastCount + 'x ' + lastSpan.name;
        lastCount = 1;
      }

      if (!isContinuouslySimilar) {
        spans.push(span);
      }
    }
  });
  return spans;
}
function adjustTransaction(transaction) {
  if (transaction.sampled) {
    var filterdSpans = transaction.spans.filter(function (span) {
      return span.duration() > 0 && span._start >= transaction._start && span._end <= transaction._end;
    });

    if (transaction.isManaged()) {
      var duration = transaction.duration();
      var similarSpans = groupSmallContinuouslySimilarSpans(filterdSpans, duration, SIMILAR_SPAN_TO_TRANSACTION_RATIO);
      transaction.spans = similarSpans;
    } else {
      transaction.spans = filterdSpans;
    }
  } else {
    transaction.resetFields();
  }

  return transaction;
}

var PerformanceMonitoring = function () {
  function PerformanceMonitoring(apmServer, configService, loggingService, transactionService) {
    this._apmServer = apmServer;
    this._configService = configService;
    this._logginService = loggingService;
    this._transactionService = transactionService;
  }

  var _proto = PerformanceMonitoring.prototype;

  _proto.init = function init(flags) {
    var _this = this;

    if (flags === void 0) {
      flags = {};
    }

    this._configService.events.observe(_common_constants__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_END + _common_constants__WEBPACK_IMPORTED_MODULE_0__.AFTER_EVENT, function (tr) {
      var payload = _this.createTransactionPayload(tr);

      if (payload) {
        _this._apmServer.addTransaction(payload);

        _this._configService.dispatchEvent(_common_constants__WEBPACK_IMPORTED_MODULE_0__.QUEUE_ADD_TRANSACTION);
      }
    });

    if (flags[_common_constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY]) {
      _common_patching__WEBPACK_IMPORTED_MODULE_1__.patchEventHandler.observe(_common_constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY, this.getHistorySub());
    }

    if (flags[_common_constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST]) {
      _common_patching__WEBPACK_IMPORTED_MODULE_1__.patchEventHandler.observe(_common_constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST, this.getXHRSub());
    }

    if (flags[_common_constants__WEBPACK_IMPORTED_MODULE_0__.FETCH]) {
      _common_patching__WEBPACK_IMPORTED_MODULE_1__.patchEventHandler.observe(_common_constants__WEBPACK_IMPORTED_MODULE_0__.FETCH, this.getFetchSub());
    }
  };

  _proto.getHistorySub = function getHistorySub() {
    var transactionService = this._transactionService;
    return function (event, task) {
      if (task.source === _common_constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY && event === _common_constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE) {
        transactionService.startTransaction(task.data.title, 'route-change', {
          managed: true,
          canReuse: true
        });
      }
    };
  };

  _proto.getXHRSub = function getXHRSub() {
    var _this2 = this;

    return function (event, task) {
      if (task.source === _common_constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST && !_common_patching_patch_utils__WEBPACK_IMPORTED_MODULE_2__.globalState.fetchInProgress) {
        _this2.processAPICalls(event, task);
      }
    };
  };

  _proto.getFetchSub = function getFetchSub() {
    var _this3 = this;

    return function (event, task) {
      if (task.source === _common_constants__WEBPACK_IMPORTED_MODULE_0__.FETCH) {
        _this3.processAPICalls(event, task);
      }
    };
  };

  _proto.processAPICalls = function processAPICalls(event, task) {
    var configService = this._configService;
    var transactionService = this._transactionService;

    if (task.data && task.data.url) {
      var endpoints = this._apmServer.getEndpoints();

      var isOwnEndpoint = Object.keys(endpoints).some(function (endpoint) {
        return task.data.url.indexOf(endpoints[endpoint]) !== -1;
      });

      if (isOwnEndpoint) {
        return;
      }
    }

    if (event === _common_constants__WEBPACK_IMPORTED_MODULE_0__.SCHEDULE && task.data) {
      var data = task.data;
      var requestUrl = new _common_url__WEBPACK_IMPORTED_MODULE_3__.Url(data.url);
      var spanName = data.method + ' ' + (requestUrl.relative ? requestUrl.path : (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.stripQueryStringFromUrl)(requestUrl.href));

      if (!transactionService.getCurrentTransaction()) {
        transactionService.startTransaction(spanName, _common_constants__WEBPACK_IMPORTED_MODULE_0__.HTTP_REQUEST_TYPE, {
          managed: true
        });
      }

      var span = transactionService.startSpan(spanName, 'external.http', {
        blocking: true
      });

      if (!span) {
        return;
      }

      var isDtEnabled = configService.get('distributedTracing');
      var dtOrigins = configService.get('distributedTracingOrigins');
      var currentUrl = new _common_url__WEBPACK_IMPORTED_MODULE_3__.Url(window.location.href);
      var isSameOrigin = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.checkSameOrigin)(requestUrl.origin, currentUrl.origin) || (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.checkSameOrigin)(requestUrl.origin, dtOrigins);
      var target = data.target;

      if (isDtEnabled && isSameOrigin && target) {
        this.injectDtHeader(span, target);
        var propagateTracestate = configService.get('propagateTracestate');

        if (propagateTracestate) {
          this.injectTSHeader(span, target);
        }
      } else if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
        this._logginService.debug("Could not inject distributed tracing header to the request origin ('" + requestUrl.origin + "') from the current origin ('" + currentUrl.origin + "')");
      }

      if (data.sync) {
        span.sync = data.sync;
      }

      data.span = span;
    } else if (event === _common_constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE) {
      var _data = task.data;

      if (_data && _data.span) {
        var _span = _data.span,
            response = _data.response,
            _target = _data.target;
        var status;

        if (response) {
          status = response.status;
        } else {
          status = _target.status;
        }

        var outcome;

        if (_data.status != 'abort' && !_data.aborted) {
          if (status >= 400 || status == 0) {
            outcome = _common_constants__WEBPACK_IMPORTED_MODULE_0__.OUTCOME_FAILURE;
          } else {
            outcome = _common_constants__WEBPACK_IMPORTED_MODULE_0__.OUTCOME_SUCCESS;
          }
        } else {
          outcome = _common_constants__WEBPACK_IMPORTED_MODULE_0__.OUTCOME_UNKNOWN;
        }

        _span.outcome = outcome;
        var tr = transactionService.getCurrentTransaction();

        if (tr && tr.type === _common_constants__WEBPACK_IMPORTED_MODULE_0__.HTTP_REQUEST_TYPE) {
          tr.outcome = outcome;
        }

        transactionService.endSpan(_span, _data);
      }
    }
  };

  _proto.injectDtHeader = function injectDtHeader(span, target) {
    var headerName = this._configService.get('distributedTracingHeaderName');

    var headerValue = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.getDtHeaderValue)(span);
    var isHeaderValid = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.isDtHeaderValid)(headerValue);

    if (isHeaderValid && headerValue && headerName) {
      (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.setRequestHeader)(target, headerName, headerValue);
    }
  };

  _proto.injectTSHeader = function injectTSHeader(span, target) {
    var headerValue = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.getTSHeaderValue)(span);

    if (headerValue) {
      (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.setRequestHeader)(target, 'tracestate', headerValue);
    }
  };

  _proto.extractDtHeader = function extractDtHeader(target) {
    var configService = this._configService;
    var headerName = configService.get('distributedTracingHeaderName');

    if (target) {
      return (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.parseDtHeaderValue)(target[headerName]);
    }
  };

  _proto.filterTransaction = function filterTransaction(tr) {
    var duration = tr.duration();

    if (!duration) {
      if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
        var message = "transaction(" + tr.id + ", " + tr.name + ") was discarded! ";

        if (duration === 0) {
          message += "Transaction duration is 0";
        } else {
          message += "Transaction wasn't ended";
        }

        this._logginService.debug(message);
      }

      return false;
    }

    if (tr.isManaged()) {
      if (duration > TRANSACTION_DURATION_THRESHOLD) {
        if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
          this._logginService.debug("transaction(" + tr.id + ", " + tr.name + ") was discarded! Transaction duration (" + duration + ") is greater than managed transaction threshold (" + TRANSACTION_DURATION_THRESHOLD + ")");
        }

        return false;
      }

      if (tr.sampled && tr.spans.length === 0) {
        if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
          this._logginService.debug("transaction(" + tr.id + ", " + tr.name + ") was discarded! Transaction does not have any spans");
        }

        return false;
      }
    }

    return true;
  };

  _proto.createTransactionDataModel = function createTransactionDataModel(transaction) {
    var transactionStart = transaction._start;
    var spans = transaction.spans.map(function (span) {
      var spanData = {
        id: span.id,
        transaction_id: transaction.id,
        parent_id: span.parentId || transaction.id,
        trace_id: transaction.traceId,
        name: span.name,
        type: span.type,
        subtype: span.subtype,
        action: span.action,
        sync: span.sync,
        start: parseInt(span._start - transactionStart),
        duration: span.duration(),
        context: span.context,
        outcome: span.outcome,
        sample_rate: span.sampleRate
      };
      return (0,_common_truncate__WEBPACK_IMPORTED_MODULE_6__.truncateModel)(_common_truncate__WEBPACK_IMPORTED_MODULE_6__.SPAN_MODEL, spanData);
    });
    var transactionData = {
      id: transaction.id,
      trace_id: transaction.traceId,
      session: transaction.session,
      name: transaction.name,
      type: transaction.type,
      duration: transaction.duration(),
      spans: spans,
      context: transaction.context,
      marks: transaction.marks,
      breakdown: transaction.breakdownTimings,
      span_count: {
        started: spans.length
      },
      sampled: transaction.sampled,
      sample_rate: transaction.sampleRate,
      experience: transaction.experience,
      outcome: transaction.outcome
    };
    return (0,_common_truncate__WEBPACK_IMPORTED_MODULE_6__.truncateModel)(_common_truncate__WEBPACK_IMPORTED_MODULE_6__.TRANSACTION_MODEL, transactionData);
  };

  _proto.createTransactionPayload = function createTransactionPayload(transaction) {
    var adjustedTransaction = adjustTransaction(transaction);
    var filtered = this.filterTransaction(adjustedTransaction);

    if (filtered) {
      return this.createTransactionDataModel(transaction);
    }
  };

  return PerformanceMonitoring;
}();



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/span-base.js":
/*!***************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/span-base.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");



var SpanBase = function () {
  function SpanBase(name, type, options) {
    if (options === void 0) {
      options = {};
    }

    if (!name) {
      name = _common_constants__WEBPACK_IMPORTED_MODULE_0__.NAME_UNKNOWN;
    }

    if (!type) {
      type = _common_constants__WEBPACK_IMPORTED_MODULE_0__.TYPE_CUSTOM;
    }

    this.name = name;
    this.type = type;
    this.options = options;
    this.id = options.id || (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.generateRandomId)(16);
    this.traceId = options.traceId;
    this.sampled = options.sampled;
    this.sampleRate = options.sampleRate;
    this.timestamp = options.timestamp;
    this._start = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.getTime)(options.startTime);
    this._end = undefined;
    this.ended = false;
    this.outcome = undefined;
    this.onEnd = options.onEnd;
  }

  var _proto = SpanBase.prototype;

  _proto.ensureContext = function ensureContext() {
    if (!this.context) {
      this.context = {};
    }
  };

  _proto.addLabels = function addLabels(tags) {
    this.ensureContext();
    var ctx = this.context;

    if (!ctx.tags) {
      ctx.tags = {};
    }

    var keys = Object.keys(tags);
    keys.forEach(function (k) {
      return (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.setLabel)(k, tags[k], ctx.tags);
    });
  };

  _proto.addContext = function addContext() {
    for (var _len = arguments.length, context = new Array(_len), _key = 0; _key < _len; _key++) {
      context[_key] = arguments[_key];
    }

    if (context.length === 0) return;
    this.ensureContext();
    _common_utils__WEBPACK_IMPORTED_MODULE_1__.merge.apply(void 0, [this.context].concat(context));
  };

  _proto.end = function end(endTime) {
    if (this.ended) {
      return;
    }

    this.ended = true;
    this._end = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.getTime)(endTime);
    this.callOnEnd();
  };

  _proto.callOnEnd = function callOnEnd() {
    if (typeof this.onEnd === 'function') {
      this.onEnd(this);
    }
  };

  _proto.duration = function duration() {
    return (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.getDuration)(this._start, this._end);
  };

  return SpanBase;
}();

/* harmony default export */ __webpack_exports__["default"] = (SpanBase);

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/span.js":
/*!**********************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/span.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _span_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./span-base */ "../rum-core/dist/es/performance-monitoring/span-base.js");
/* harmony import */ var _common_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/context */ "../rum-core/dist/es/common/context.js");
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}




var Span = function (_SpanBase) {
  _inheritsLoose(Span, _SpanBase);

  function Span(name, type, options) {
    var _this;

    _this = _SpanBase.call(this, name, type, options) || this;
    _this.parentId = _this.options.parentId;
    _this.subtype = undefined;
    _this.action = undefined;

    if (_this.type.indexOf('.') !== -1) {
      var fields = _this.type.split('.', 3);

      _this.type = fields[0];
      _this.subtype = fields[1];
      _this.action = fields[2];
    }

    _this.sync = _this.options.sync;
    return _this;
  }

  var _proto = Span.prototype;

  _proto.end = function end(endTime, data) {
    _SpanBase.prototype.end.call(this, endTime);

    (0,_common_context__WEBPACK_IMPORTED_MODULE_0__.addSpanContext)(this, data);
  };

  return Span;
}(_span_base__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Span);

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/transaction-service.js":
/*!*************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/transaction-service.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_polyfills__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/polyfills */ "../rum-core/dist/es/common/polyfills.js");
/* harmony import */ var _transaction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transaction */ "../rum-core/dist/es/performance-monitoring/transaction.js");
/* harmony import */ var _metrics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./metrics */ "../rum-core/dist/es/performance-monitoring/metrics.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _navigation_capture_navigation__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./navigation/capture-navigation */ "../rum-core/dist/es/performance-monitoring/navigation/capture-navigation.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_context__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/context */ "../rum-core/dist/es/common/context.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");
/* harmony import */ var _common_url__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/url */ "../rum-core/dist/es/common/url.js");










var TransactionService = function () {
  function TransactionService(logger, config) {
    var _this = this;

    this._config = config;
    this._logger = logger;
    this.currentTransaction = undefined;
    this.respIntervalId = undefined;
    this.recorder = new _metrics__WEBPACK_IMPORTED_MODULE_0__.PerfEntryRecorder(function (list) {
      var tr = _this.getCurrentTransaction();

      if (tr && tr.captureTimings) {
        var _tr$spans;

        var isHardNavigation = tr.type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD;

        var _captureObserverEntri = (0,_metrics__WEBPACK_IMPORTED_MODULE_0__.captureObserverEntries)(list, {
          isHardNavigation: isHardNavigation,
          trStart: isHardNavigation ? 0 : tr._start
        }),
            spans = _captureObserverEntri.spans,
            marks = _captureObserverEntri.marks;

        (_tr$spans = tr.spans).push.apply(_tr$spans, spans);

        tr.addMarks({
          agent: marks
        });
      }
    });
  }

  var _proto = TransactionService.prototype;

  _proto.createCurrentTransaction = function createCurrentTransaction(name, type, options) {
    var tr = new _transaction__WEBPACK_IMPORTED_MODULE_2__["default"](name, type, options);
    this.currentTransaction = tr;
    return tr;
  };

  _proto.getCurrentTransaction = function getCurrentTransaction() {
    if (this.currentTransaction && !this.currentTransaction.ended) {
      return this.currentTransaction;
    }
  };

  _proto.createOptions = function createOptions(options) {
    var config = this._config.config;
    var presetOptions = {
      transactionSampleRate: config.transactionSampleRate
    };
    var perfOptions = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.extend)(presetOptions, options);

    if (perfOptions.managed) {
      perfOptions = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.extend)({
        pageLoadTraceId: config.pageLoadTraceId,
        pageLoadSampled: config.pageLoadSampled,
        pageLoadSpanId: config.pageLoadSpanId,
        pageLoadTransactionName: config.pageLoadTransactionName
      }, perfOptions);
    }

    return perfOptions;
  };

  _proto.startManagedTransaction = function startManagedTransaction(name, type, perfOptions) {
    var tr = this.getCurrentTransaction();
    var isRedefined = false;

    if (!tr) {
      tr = this.createCurrentTransaction(name, type, perfOptions);
    } else if (tr.canReuse() && perfOptions.canReuse) {
      var redefineType = tr.type;
      var currentTypeOrder = _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_TYPE_ORDER.indexOf(tr.type);
      var redefineTypeOrder = _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_TYPE_ORDER.indexOf(type);

      if (currentTypeOrder >= 0 && redefineTypeOrder < currentTypeOrder) {
        redefineType = type;
      }

      if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
        this._logger.debug("redefining transaction(" + tr.id + ", " + tr.name + ", " + tr.type + ")", 'to', "(" + (name || tr.name) + ", " + redefineType + ")", tr);
      }

      tr.redefine(name, redefineType, perfOptions);
      isRedefined = true;
    } else {
      if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
        this._logger.debug("ending previous transaction(" + tr.id + ", " + tr.name + ")", tr);
      }

      tr.end();
      tr = this.createCurrentTransaction(name, type, perfOptions);
    }

    if (tr.type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD) {
      if (!isRedefined) {
        this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LARGEST_CONTENTFUL_PAINT);
        this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.PAINT);
        this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.FIRST_INPUT);
        this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LAYOUT_SHIFT);
      }

      if (perfOptions.pageLoadTraceId) {
        tr.traceId = perfOptions.pageLoadTraceId;
      }

      if (perfOptions.pageLoadSampled) {
        tr.sampled = perfOptions.pageLoadSampled;
      }

      if (tr.name === _common_constants__WEBPACK_IMPORTED_MODULE_1__.NAME_UNKNOWN && perfOptions.pageLoadTransactionName) {
        tr.name = perfOptions.pageLoadTransactionName;
      }
    }

    if (!isRedefined && this._config.get('monitorLongtasks')) {
      this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK);
    }

    if (tr.sampled) {
      tr.captureTimings = true;
    }

    return tr;
  };

  _proto.startTransaction = function startTransaction(name, type, options) {
    var _this2 = this;

    var perfOptions = this.createOptions(options);
    var tr;
    var fireOnstartHook = true;

    if (perfOptions.managed) {
      var current = this.currentTransaction;
      tr = this.startManagedTransaction(name, type, perfOptions);

      if (current === tr) {
        fireOnstartHook = false;
      }
    } else {
      tr = new _transaction__WEBPACK_IMPORTED_MODULE_2__["default"](name, type, perfOptions);
    }

    tr.onEnd = function () {
      return _this2.handleTransactionEnd(tr);
    };

    if (fireOnstartHook) {
      if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
        this._logger.debug("startTransaction(" + tr.id + ", " + tr.name + ", " + tr.type + ")");
      }

      this._config.events.send(_common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_START, [tr]);
    }

    return tr;
  };

  _proto.handleTransactionEnd = function handleTransactionEnd(tr) {
    var _this3 = this;

    this.recorder.stop();
    var currentUrl = window.location.href;
    return _common_polyfills__WEBPACK_IMPORTED_MODULE_5__.Promise.resolve().then(function () {
      var name = tr.name,
          type = tr.type;
      var lastHiddenStart = _state__WEBPACK_IMPORTED_MODULE_4__.state.lastHiddenStart;

      if (lastHiddenStart >= tr._start) {
        if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
          _this3._logger.debug("transaction(" + tr.id + ", " + name + ", " + type + ") was discarded! The page was hidden during the transaction!");
        }

        return;
      }

      if (_this3.shouldIgnoreTransaction(name) || type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.TEMPORARY_TYPE) {
        if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
          _this3._logger.debug("transaction(" + tr.id + ", " + name + ", " + type + ") is ignored");
        }

        return;
      }

      if (type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD) {
        var pageLoadTransactionName = _this3._config.get('pageLoadTransactionName');

        if (name === _common_constants__WEBPACK_IMPORTED_MODULE_1__.NAME_UNKNOWN && pageLoadTransactionName) {
          tr.name = pageLoadTransactionName;
        }

        if (tr.captureTimings) {
          var cls = _metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.cls,
              fid = _metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.fid,
              tbt = _metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.tbt,
              longtask = _metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.longtask;

          if (tbt.duration > 0) {
            tr.spans.push((0,_metrics__WEBPACK_IMPORTED_MODULE_0__.createTotalBlockingTimeSpan)(tbt));
          }

          tr.experience = {};

          if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.isPerfTypeSupported)(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK)) {
            tr.experience.tbt = tbt.duration;
          }

          if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.isPerfTypeSupported)(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LAYOUT_SHIFT)) {
            tr.experience.cls = cls.score;
          }

          if (fid > 0) {
            tr.experience.fid = fid;
          }

          if (longtask.count > 0) {
            tr.experience.longtask = {
              count: longtask.count,
              sum: longtask.duration,
              max: longtask.max
            };
          }
        }

        _this3.setSession(tr);
      }

      if (tr.name === _common_constants__WEBPACK_IMPORTED_MODULE_1__.NAME_UNKNOWN) {
        tr.name = (0,_common_url__WEBPACK_IMPORTED_MODULE_6__.slugifyUrl)(currentUrl);
      }

      (0,_navigation_capture_navigation__WEBPACK_IMPORTED_MODULE_7__.captureNavigation)(tr);

      _this3.adjustTransactionTime(tr);

      var breakdownMetrics = _this3._config.get('breakdownMetrics');

      if (breakdownMetrics) {
        tr.captureBreakdown();
      }

      var configContext = _this3._config.get('context');

      (0,_common_context__WEBPACK_IMPORTED_MODULE_8__.addTransactionContext)(tr, configContext);

      _this3._config.events.send(_common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_END, [tr]);

      if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
        _this3._logger.debug("end transaction(" + tr.id + ", " + tr.name + ", " + tr.type + ")", tr);
      }
    }, function (err) {
      if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
        _this3._logger.debug("error ending transaction(" + tr.id + ", " + tr.name + ")", err);
      }
    });
  };

  _proto.setSession = function setSession(tr) {
    var session = this._config.get('session');

    if (session) {
      if (typeof session == 'boolean') {
        tr.session = {
          id: (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.generateRandomId)(16),
          sequence: 1
        };
      } else {
        if (session.timestamp && Date.now() - session.timestamp > _common_constants__WEBPACK_IMPORTED_MODULE_1__.SESSION_TIMEOUT) {
          tr.session = {
            id: (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.generateRandomId)(16),
            sequence: 1
          };
        } else {
          tr.session = {
            id: session.id,
            sequence: session.sequence ? session.sequence + 1 : 1
          };
        }
      }

      var sessionConfig = {
        session: {
          id: tr.session.id,
          sequence: tr.session.sequence,
          timestamp: Date.now()
        }
      };

      this._config.setConfig(sessionConfig);

      this._config.setLocalConfig(sessionConfig, true);
    }
  };

  _proto.adjustTransactionTime = function adjustTransactionTime(transaction) {
    var spans = transaction.spans;
    var earliestSpan = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.getEarliestSpan)(spans);

    if (earliestSpan && earliestSpan._start < transaction._start) {
      transaction._start = earliestSpan._start;
    }

    var latestSpan = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.getLatestNonXHRSpan)(spans) || {};
    var latestSpanEnd = latestSpan._end || 0;

    if (transaction.type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD) {
      var transactionEndWithoutDelay = transaction._end - _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD_DELAY;
      var lcp = _metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.lcp || 0;
      var latestXHRSpan = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.getLatestXHRSpan)(spans) || {};
      var latestXHRSpanEnd = latestXHRSpan._end || 0;
      transaction._end = Math.max(latestSpanEnd, latestXHRSpanEnd, lcp, transactionEndWithoutDelay);
    } else if (latestSpanEnd > transaction._end) {
      transaction._end = latestSpanEnd;
    }

    this.truncateSpans(spans, transaction._end);
  };

  _proto.truncateSpans = function truncateSpans(spans, transactionEnd) {
    for (var i = 0; i < spans.length; i++) {
      var span = spans[i];

      if (span._end > transactionEnd) {
        span._end = transactionEnd;
        span.type += _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRUNCATED_TYPE;
      }

      if (span._start > transactionEnd) {
        span._start = transactionEnd;
      }
    }
  };

  _proto.shouldIgnoreTransaction = function shouldIgnoreTransaction(transactionName) {
    var ignoreList = this._config.get('ignoreTransactions');

    if (ignoreList && ignoreList.length) {
      for (var i = 0; i < ignoreList.length; i++) {
        var element = ignoreList[i];

        if (typeof element.test === 'function') {
          if (element.test(transactionName)) {
            return true;
          }
        } else if (element === transactionName) {
          return true;
        }
      }
    }

    return false;
  };

  _proto.startSpan = function startSpan(name, type, options) {
    var tr = this.getCurrentTransaction();

    if (!tr) {
      tr = this.createCurrentTransaction(undefined, _common_constants__WEBPACK_IMPORTED_MODULE_1__.TEMPORARY_TYPE, this.createOptions({
        canReuse: true,
        managed: true
      }));
    }

    var span = tr.startSpan(name, type, options);

    if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
      this._logger.debug("startSpan(" + name + ", " + span.type + ")", "on transaction(" + tr.id + ", " + tr.name + ")");
    }

    return span;
  };

  _proto.endSpan = function endSpan(span, context) {
    if (!span) {
      return;
    }

    if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
      var tr = this.getCurrentTransaction();
      tr && this._logger.debug("endSpan(" + span.name + ", " + span.type + ")", "on transaction(" + tr.id + ", " + tr.name + ")");
    }

    span.end(null, context);
  };

  return TransactionService;
}();

/* harmony default export */ __webpack_exports__["default"] = (TransactionService);

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/transaction.js":
/*!*****************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/transaction.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./span */ "../rum-core/dist/es/performance-monitoring/span.js");
/* harmony import */ var _span_base__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./span-base */ "../rum-core/dist/es/performance-monitoring/span-base.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _breakdown__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./breakdown */ "../rum-core/dist/es/performance-monitoring/breakdown.js");
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}







var Transaction = function (_SpanBase) {
  _inheritsLoose(Transaction, _SpanBase);

  function Transaction(name, type, options) {
    var _this;

    _this = _SpanBase.call(this, name, type, options) || this;
    _this.traceId = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.generateRandomId)();
    _this.marks = undefined;
    _this.spans = [];
    _this._activeSpans = {};
    _this._activeTasks = new Set();
    _this.blocked = false;
    _this.captureTimings = false;
    _this.breakdownTimings = [];
    _this.sampleRate = _this.options.transactionSampleRate;
    _this.sampled = Math.random() <= _this.sampleRate;
    return _this;
  }

  var _proto = Transaction.prototype;

  _proto.addMarks = function addMarks(obj) {
    this.marks = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.merge)(this.marks || {}, obj);
  };

  _proto.mark = function mark(key) {
    var skey = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.removeInvalidChars)(key);

    var markTime = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.now)() - this._start;

    var custom = {};
    custom[skey] = markTime;
    this.addMarks({
      custom: custom
    });
  };

  _proto.canReuse = function canReuse() {
    var threshold = this.options.reuseThreshold || _common_constants__WEBPACK_IMPORTED_MODULE_1__.REUSABILITY_THRESHOLD;
    return !!this.options.canReuse && !this.ended && (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.now)() - this._start < threshold;
  };

  _proto.redefine = function redefine(name, type, options) {
    if (name) {
      this.name = name;
    }

    if (type) {
      this.type = type;
    }

    if (options) {
      this.options.reuseThreshold = options.reuseThreshold;
      (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.extend)(this.options, options);
    }
  };

  _proto.startSpan = function startSpan(name, type, options) {
    var _this2 = this;

    if (this.ended) {
      return;
    }

    var opts = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.extend)({}, options);

    opts.onEnd = function (trc) {
      _this2._onSpanEnd(trc);
    };

    opts.traceId = this.traceId;
    opts.sampled = this.sampled;
    opts.sampleRate = this.sampleRate;

    if (!opts.parentId) {
      opts.parentId = this.id;
    }

    var span = new _span__WEBPACK_IMPORTED_MODULE_2__["default"](name, type, opts);
    this._activeSpans[span.id] = span;

    if (opts.blocking) {
      this.addTask(span.id);
    }

    return span;
  };

  _proto.isFinished = function isFinished() {
    return !this.blocked && this._activeTasks.size === 0;
  };

  _proto.detectFinish = function detectFinish() {
    if (this.isFinished()) this.end();
  };

  _proto.end = function end(endTime) {
    if (this.ended) {
      return;
    }

    this.ended = true;
    this._end = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.getTime)(endTime);

    for (var sid in this._activeSpans) {
      var span = this._activeSpans[sid];
      span.type = span.type + _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRUNCATED_TYPE;
      span.end(endTime);
    }

    this.callOnEnd();
  };

  _proto.captureBreakdown = function captureBreakdown() {
    this.breakdownTimings = (0,_breakdown__WEBPACK_IMPORTED_MODULE_3__.captureBreakdown)(this);
  };

  _proto.block = function block(flag) {
    this.blocked = flag;

    if (!this.blocked) {
      this.detectFinish();
    }
  };

  _proto.addTask = function addTask(taskId) {
    if (!taskId) {
      taskId = 'task-' + (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.generateRandomId)(16);
    }

    this._activeTasks.add(taskId);

    return taskId;
  };

  _proto.removeTask = function removeTask(taskId) {
    var deleted = this._activeTasks.delete(taskId);

    deleted && this.detectFinish();
  };

  _proto.resetFields = function resetFields() {
    this.spans = [];
    this.sampleRate = 0;
  };

  _proto._onSpanEnd = function _onSpanEnd(span) {
    this.spans.push(span);
    delete this._activeSpans[span.id];
    this.removeTask(span.id);
  };

  _proto.isManaged = function isManaged() {
    return !!this.options.managed;
  };

  return Transaction;
}(_span_base__WEBPACK_IMPORTED_MODULE_4__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Transaction);

/***/ }),

/***/ "../rum-core/dist/es/state.js":
/*!************************************!*\
  !*** ../rum-core/dist/es/state.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __DEV__: function() { return /* binding */ __DEV__; },
/* harmony export */   state: function() { return /* binding */ state; }
/* harmony export */ });
var __DEV__ = "development" !== 'production';

var state = {
  bootstrapTime: null,
  lastHiddenStart: Number.MIN_SAFE_INTEGER
};


/***/ }),

/***/ "./src/apm-base.js":
/*!*************************!*\
  !*** ./src/apm-base.js ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ApmBase; }
/* harmony export */ });
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/instrument.js");
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/observers/page-visibility.js");
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/observers/page-clicks.js");


var ApmBase = function () {
  function ApmBase(serviceFactory, disable) {
    this._disable = disable;
    this.serviceFactory = serviceFactory;
    this._initialized = false;
  }

  var _proto = ApmBase.prototype;

  _proto.isEnabled = function isEnabled() {
    return !this._disable;
  };

  _proto.isActive = function isActive() {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    return this.isEnabled() && this._initialized && configService.get('active');
  };

  _proto.init = function init(config) {
    var _this = this;

    if (this.isEnabled() && !this._initialized) {
      this._initialized = true;

      var _this$serviceFactory$ = this.serviceFactory.getService([_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE]),
          configService = _this$serviceFactory$[0],
          loggingService = _this$serviceFactory$[1],
          transactionService = _this$serviceFactory$[2];

      configService.setVersion('5.15.0');
      this.config(config);
      var logLevel = configService.get('logLevel');
      loggingService.setLevel(logLevel);
      var isConfigActive = configService.get('active');

      if (isConfigActive) {
        this.serviceFactory.init();
        var flags = (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__.getInstrumentationFlags)(configService.get('instrument'), configService.get('disableInstrumentations'));
        var performanceMonitoring = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PERFORMANCE_MONITORING);
        performanceMonitoring.init(flags);

        if (flags[_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.ERROR]) {
          var errorLogging = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.ERROR_LOGGING);
          errorLogging.registerListeners();
        }

        if (configService.get('session')) {
          var localConfig = configService.getLocalConfig();

          if (localConfig && localConfig.session) {
            configService.setConfig({
              session: localConfig.session
            });
          }
        }

        var sendPageLoad = function sendPageLoad() {
          return flags[_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD] && _this._sendPageLoadMetrics();
        };

        if (configService.get('centralConfig')) {
          this.fetchCentralConfig().then(sendPageLoad);
        } else {
          sendPageLoad();
        }

        (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_2__.observePageVisibility)(configService, transactionService);

        if (flags[_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.EVENT_TARGET] && flags[_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CLICK]) {
          (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_3__.observePageClicks)(transactionService);
        }
      } else {
        this._disable = true;
        loggingService.warn('RUM agent is inactive');
      }
    }

    return this;
  };

  _proto.fetchCentralConfig = function fetchCentralConfig() {
    var _this$serviceFactory$2 = this.serviceFactory.getService([_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.APM_SERVER, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE]),
        apmServer = _this$serviceFactory$2[0],
        loggingService = _this$serviceFactory$2[1],
        configService = _this$serviceFactory$2[2];

    return apmServer.fetchConfig(configService.get('serviceName'), configService.get('environment')).then(function (config) {
      var transactionSampleRate = config['transaction_sample_rate'];

      if (transactionSampleRate) {
        transactionSampleRate = Number(transactionSampleRate);
        var _config2 = {
          transactionSampleRate: transactionSampleRate
        };

        var _configService$valida = configService.validate(_config2),
            invalid = _configService$valida.invalid;

        if (invalid.length === 0) {
          configService.setConfig(_config2);
        } else {
          var _invalid$ = invalid[0],
              key = _invalid$.key,
              value = _invalid$.value,
              allowed = _invalid$.allowed;
          loggingService.warn("invalid value \"" + value + "\" for " + key + ". Allowed: " + allowed + ".");
        }
      }

      return config;
    }).catch(function (error) {
      loggingService.warn('failed fetching config:', error);
    });
  };

  _proto._sendPageLoadMetrics = function _sendPageLoadMetrics() {
    var tr = this.startTransaction(undefined, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD, {
      managed: true,
      canReuse: true
    });

    if (!tr) {
      return;
    }

    tr.addTask(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD);

    var sendPageLoadMetrics = function sendPageLoadMetrics() {
      setTimeout(function () {
        return tr.removeTask(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD);
      }, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD_DELAY);
    };

    if (document.readyState === 'complete') {
      sendPageLoadMetrics();
    } else {
      window.addEventListener('load', sendPageLoadMetrics);
    }
  };

  _proto.observe = function observe(name, fn) {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.events.observe(name, fn);
  };

  _proto.config = function config(_config) {
    var _this$serviceFactory$3 = this.serviceFactory.getService([_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE]),
        configService = _this$serviceFactory$3[0],
        loggingService = _this$serviceFactory$3[1];

    var _configService$valida2 = configService.validate(_config),
        missing = _configService$valida2.missing,
        invalid = _configService$valida2.invalid,
        unknown = _configService$valida2.unknown;

    if (unknown.length > 0) {
      var message = 'Unknown config options are specified for RUM agent: ' + unknown.join(', ');
      loggingService.warn(message);
    }

    if (missing.length === 0 && invalid.length === 0) {
      configService.setConfig(_config);
    } else {
      var separator = ', ';
      var _message = "RUM agent isn't correctly configured. ";

      if (missing.length > 0) {
        _message += missing.join(separator) + ' is missing';

        if (invalid.length > 0) {
          _message += separator;
        }
      }

      invalid.forEach(function (_ref, index) {
        var key = _ref.key,
            value = _ref.value,
            allowed = _ref.allowed;
        _message += key + " \"" + value + "\" contains invalid characters! (allowed: " + allowed + ")" + (index !== invalid.length - 1 ? separator : '');
      });
      loggingService.error(_message);
      configService.setConfig({
        active: false
      });
    }
  };

  _proto.setUserContext = function setUserContext(userContext) {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.setUserContext(userContext);
  };

  _proto.setCustomContext = function setCustomContext(customContext) {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.setCustomContext(customContext);
  };

  _proto.addLabels = function addLabels(labels) {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.addLabels(labels);
  };

  _proto.setInitialPageLoadName = function setInitialPageLoadName(name) {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.setConfig({
      pageLoadTransactionName: name
    });
  };

  _proto.startTransaction = function startTransaction(name, type, options) {
    if (this.isEnabled()) {
      var transactionService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE);
      return transactionService.startTransaction(name, type, options);
    }
  };

  _proto.startSpan = function startSpan(name, type, options) {
    if (this.isEnabled()) {
      var transactionService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE);
      return transactionService.startSpan(name, type, options);
    }
  };

  _proto.getCurrentTransaction = function getCurrentTransaction() {
    if (this.isEnabled()) {
      var transactionService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE);
      return transactionService.getCurrentTransaction();
    }
  };

  _proto.captureError = function captureError(error) {
    if (this.isEnabled()) {
      var errorLogging = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.ERROR_LOGGING);
      return errorLogging.logError(error);
    }
  };

  _proto.addFilter = function addFilter(fn) {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.addFilter(fn);
  };

  return ApmBase;
}();



/***/ }),

/***/ "../../node_modules/error-stack-parser/error-stack-parser.js":
/*!*******************************************************************!*\
  !*** ../../node_modules/error-stack-parser/error-stack-parser.js ***!
  \*******************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! stackframe */ "../../node_modules/stackframe/stackframe.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function ErrorStackParser(StackFrame) {
    'use strict';

    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+\:\d+/;
    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+\:\d+|\(native\))/m;
    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code\])?$/;

    function _map(array, fn, thisArg) {
        if (typeof Array.prototype.map === 'function') {
            return array.map(fn, thisArg);
        } else {
            var output = new Array(array.length);
            for (var i = 0; i < array.length; i++) {
                output[i] = fn.call(thisArg, array[i]);
            }
            return output;
        }
    }

    function _filter(array, fn, thisArg) {
        if (typeof Array.prototype.filter === 'function') {
            return array.filter(fn, thisArg);
        } else {
            var output = [];
            for (var i = 0; i < array.length; i++) {
                if (fn.call(thisArg, array[i])) {
                    output.push(array[i]);
                }
            }
            return output;
        }
    }

    function _indexOf(array, target) {
        if (typeof Array.prototype.indexOf === 'function') {
            return array.indexOf(target);
        } else {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === target) {
                    return i;
                }
            }
            return -1;
        }
    }

    return {
        /**
         * Given an Error object, extract the most information from it.
         *
         * @param {Error} error object
         * @return {Array} of StackFrames
         */
        parse: function ErrorStackParser$$parse(error) {
            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
                return this.parseOpera(error);
            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
                return this.parseV8OrIE(error);
            } else if (error.stack) {
                return this.parseFFOrSafari(error);
            } else {
                throw new Error('Cannot parse given Error object');
            }
        },

        // Separate line and column numbers from a string of the form: (URI:Line:Column)
        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
            // Fail-fast but return locations like "(native)"
            if (urlLike.indexOf(':') === -1) {
                return [urlLike];
            }

            var regExp = /(.+?)(?:\:(\d+))?(?:\:(\d+))?$/;
            var parts = regExp.exec(urlLike.replace(/[\(\)]/g, ''));
            return [parts[1], parts[2] || undefined, parts[3] || undefined];
        },

        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
            var filtered = _filter(error.stack.split('\n'), function(line) {
                return !!line.match(CHROME_IE_STACK_REGEXP);
            }, this);

            return _map(filtered, function(line) {
                if (line.indexOf('(eval ') > -1) {
                    // Throw away eval information until we implement stacktrace.js/stackframe#8
                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, '');
                }
                var tokens = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').split(/\s+/).slice(1);
                var locationParts = this.extractLocation(tokens.pop());
                var functionName = tokens.join(' ') || undefined;
                var fileName = _indexOf(['eval', '<anonymous>'], locationParts[0]) > -1 ? undefined : locationParts[0];

                return new StackFrame(functionName, undefined, fileName, locationParts[1], locationParts[2], line);
            }, this);
        },

        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
            var filtered = _filter(error.stack.split('\n'), function(line) {
                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
            }, this);

            return _map(filtered, function(line) {
                // Throw away eval information until we implement stacktrace.js/stackframe#8
                if (line.indexOf(' > eval') > -1) {
                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g, ':$1');
                }

                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
                    // Safari eval frames only have function names and nothing else
                    return new StackFrame(line);
                } else {
                    var tokens = line.split('@');
                    var locationParts = this.extractLocation(tokens.pop());
                    var functionName = tokens.join('@') || undefined;
                    return new StackFrame(functionName,
                        undefined,
                        locationParts[0],
                        locationParts[1],
                        locationParts[2],
                        line);
                }
            }, this);
        },

        parseOpera: function ErrorStackParser$$parseOpera(e) {
            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
                return this.parseOpera9(e);
            } else if (!e.stack) {
                return this.parseOpera10(e);
            } else {
                return this.parseOpera11(e);
            }
        },

        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
            var lines = e.message.split('\n');
            var result = [];

            for (var i = 2, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(new StackFrame(undefined, undefined, match[2], match[1], undefined, lines[i]));
                }
            }

            return result;
        },

        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
            var lines = e.stacktrace.split('\n');
            var result = [];

            for (var i = 0, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(
                        new StackFrame(
                            match[3] || undefined,
                            undefined,
                            match[2],
                            match[1],
                            undefined,
                            lines[i]
                        )
                    );
                }
            }

            return result;
        },

        // Opera 10.65+ Error.stack very similar to FF/Safari
        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
            var filtered = _filter(error.stack.split('\n'), function(line) {
                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
            }, this);

            return _map(filtered, function(line) {
                var tokens = line.split('@');
                var locationParts = this.extractLocation(tokens.pop());
                var functionCall = (tokens.shift() || '');
                var functionName = functionCall
                        .replace(/<anonymous function(: (\w+))?>/, '$2')
                        .replace(/\([^\)]*\)/g, '') || undefined;
                var argsRaw;
                if (functionCall.match(/\(([^\)]*)\)/)) {
                    argsRaw = functionCall.replace(/^[^\(]+\(([^\)]*)\)$/, '$1');
                }
                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ?
                    undefined : argsRaw.split(',');
                return new StackFrame(
                    functionName,
                    args,
                    locationParts[0],
                    locationParts[1],
                    locationParts[2],
                    line);
            }, this);
        }
    };
}));



/***/ }),

/***/ "../../node_modules/opentracing/lib/constants.js":
/*!*******************************************************!*\
  !*** ../../node_modules/opentracing/lib/constants.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * The FORMAT_BINARY format represents SpanContexts in an opaque binary
 * carrier.
 *
 * Tracer.inject() will set the buffer field to an Array-like (Array,
 * ArrayBuffer, or TypedBuffer) object containing the injected binary data.
 * Any valid Object can be used as long as the buffer field of the object
 * can be set.
 *
 * Tracer.extract() will look for `carrier.buffer`, and that field is
 * expected to be an Array-like object (Array, ArrayBuffer, or
 * TypedBuffer).
 */
exports.FORMAT_BINARY = 'binary';
/**
 * The FORMAT_TEXT_MAP format represents SpanContexts using a
 * string->string map (backed by a Javascript Object) as a carrier.
 *
 * NOTE: Unlike FORMAT_HTTP_HEADERS, FORMAT_TEXT_MAP places no restrictions
 * on the characters used in either the keys or the values of the map
 * entries.
 *
 * The FORMAT_TEXT_MAP carrier map may contain unrelated data (e.g.,
 * arbitrary gRPC metadata); as such, the Tracer implementation should use
 * a prefix or other convention to distinguish Tracer-specific key:value
 * pairs.
 */
exports.FORMAT_TEXT_MAP = 'text_map';
/**
 * The FORMAT_HTTP_HEADERS format represents SpanContexts using a
 * character-restricted string->string map (backed by a Javascript Object)
 * as a carrier.
 *
 * Keys and values in the FORMAT_HTTP_HEADERS carrier must be suitable for
 * use as HTTP headers (without modification or further escaping). That is,
 * the keys have a greatly restricted character set, casing for the keys
 * may not be preserved by various intermediaries, and the values should be
 * URL-escaped.
 *
 * The FORMAT_HTTP_HEADERS carrier map may contain unrelated data (e.g.,
 * arbitrary HTTP headers); as such, the Tracer implementation should use a
 * prefix or other convention to distinguish Tracer-specific key:value
 * pairs.
 */
exports.FORMAT_HTTP_HEADERS = 'http_headers';
/**
 * A Span may be the "child of" a parent Span. In a “child of” reference,
 * the parent Span depends on the child Span in some capacity.
 *
 * See more about reference types at https://github.com/opentracing/specification
 */
exports.REFERENCE_CHILD_OF = 'child_of';
/**
 * Some parent Spans do not depend in any way on the result of their child
 * Spans. In these cases, we say merely that the child Span “follows from”
 * the parent Span in a causal sense.
 *
 * See more about reference types at https://github.com/opentracing/specification
 */
exports.REFERENCE_FOLLOWS_FROM = 'follows_from';
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ "../../node_modules/opentracing/lib/functions.js":
/*!*******************************************************!*\
  !*** ../../node_modules/opentracing/lib/functions.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Constants = __webpack_require__(/*! ./constants */ "../../node_modules/opentracing/lib/constants.js");
var reference_1 = __webpack_require__(/*! ./reference */ "../../node_modules/opentracing/lib/reference.js");
var span_1 = __webpack_require__(/*! ./span */ "../../node_modules/opentracing/lib/span.js");
/**
 * Return a new REFERENCE_CHILD_OF reference.
 *
 * @param {SpanContext} spanContext - the parent SpanContext instance to
 *        reference.
 * @return a REFERENCE_CHILD_OF reference pointing to `spanContext`
 */
function childOf(spanContext) {
    // Allow the user to pass a Span instead of a SpanContext
    if (spanContext instanceof span_1.default) {
        spanContext = spanContext.context();
    }
    return new reference_1.default(Constants.REFERENCE_CHILD_OF, spanContext);
}
exports.childOf = childOf;
/**
 * Return a new REFERENCE_FOLLOWS_FROM reference.
 *
 * @param {SpanContext} spanContext - the parent SpanContext instance to
 *        reference.
 * @return a REFERENCE_FOLLOWS_FROM reference pointing to `spanContext`
 */
function followsFrom(spanContext) {
    // Allow the user to pass a Span instead of a SpanContext
    if (spanContext instanceof span_1.default) {
        spanContext = spanContext.context();
    }
    return new reference_1.default(Constants.REFERENCE_FOLLOWS_FROM, spanContext);
}
exports.followsFrom = followsFrom;
//# sourceMappingURL=functions.js.map

/***/ }),

/***/ "../../node_modules/opentracing/lib/noop.js":
/*!**************************************************!*\
  !*** ../../node_modules/opentracing/lib/noop.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var span_1 = __webpack_require__(/*! ./span */ "../../node_modules/opentracing/lib/span.js");
var span_context_1 = __webpack_require__(/*! ./span_context */ "../../node_modules/opentracing/lib/span_context.js");
var tracer_1 = __webpack_require__(/*! ./tracer */ "../../node_modules/opentracing/lib/tracer.js");
exports.tracer = null;
exports.spanContext = null;
exports.span = null;
// Deferred initialization to avoid a dependency cycle where Tracer depends on
// Span which depends on the noop tracer.
function initialize() {
    exports.tracer = new tracer_1.default();
    exports.span = new span_1.default();
    exports.spanContext = new span_context_1.default();
}
exports.initialize = initialize;
//# sourceMappingURL=noop.js.map

/***/ }),

/***/ "../../node_modules/opentracing/lib/reference.js":
/*!*******************************************************!*\
  !*** ../../node_modules/opentracing/lib/reference.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var span_1 = __webpack_require__(/*! ./span */ "../../node_modules/opentracing/lib/span.js");
/**
 * Reference pairs a reference type constant (e.g., REFERENCE_CHILD_OF or
 * REFERENCE_FOLLOWS_FROM) with the SpanContext it points to.
 *
 * See the exported childOf() and followsFrom() functions at the package level.
 */
var Reference = /** @class */ (function () {
    /**
     * Initialize a new Reference instance.
     *
     * @param {string} type - the Reference type constant (e.g.,
     *        REFERENCE_CHILD_OF or REFERENCE_FOLLOWS_FROM).
     * @param {SpanContext} referencedContext - the SpanContext being referred
     *        to. As a convenience, a Span instance may be passed in instead
     *        (in which case its .context() is used here).
     */
    function Reference(type, referencedContext) {
        this._type = type;
        this._referencedContext = (referencedContext instanceof span_1.default ?
            referencedContext.context() :
            referencedContext);
    }
    /**
     * @return {string} The Reference type (e.g., REFERENCE_CHILD_OF or
     *         REFERENCE_FOLLOWS_FROM).
     */
    Reference.prototype.type = function () {
        return this._type;
    };
    /**
     * @return {SpanContext} The SpanContext being referred to (e.g., the
     *         parent in a REFERENCE_CHILD_OF Reference).
     */
    Reference.prototype.referencedContext = function () {
        return this._referencedContext;
    };
    return Reference;
}());
exports["default"] = Reference;
//# sourceMappingURL=reference.js.map

/***/ }),

/***/ "../../node_modules/opentracing/lib/span.js":
/*!**************************************************!*\
  !*** ../../node_modules/opentracing/lib/span.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var noop = __webpack_require__(/*! ./noop */ "../../node_modules/opentracing/lib/noop.js");
/**
 * Span represents a logical unit of work as part of a broader Trace. Examples
 * of span might include remote procedure calls or a in-process function calls
 * to sub-components. A Trace has a single, top-level "root" Span that in turn
 * may have zero or more child Spans, which in turn may have children.
 */
var Span = /** @class */ (function () {
    function Span() {
    }
    // ---------------------------------------------------------------------- //
    // OpenTracing API methods
    // ---------------------------------------------------------------------- //
    /**
     * Returns the SpanContext object associated with this Span.
     *
     * @return {SpanContext}
     */
    Span.prototype.context = function () {
        return this._context();
    };
    /**
     * Returns the Tracer object used to create this Span.
     *
     * @return {Tracer}
     */
    Span.prototype.tracer = function () {
        return this._tracer();
    };
    /**
     * Sets the string name for the logical operation this span represents.
     *
     * @param {string} name
     */
    Span.prototype.setOperationName = function (name) {
        this._setOperationName(name);
        return this;
    };
    /**
     * Sets a key:value pair on this Span that also propagates to future
     * children of the associated Span.
     *
     * setBaggageItem() enables powerful functionality given a full-stack
     * opentracing integration (e.g., arbitrary application data from a web
     * client can make it, transparently, all the way into the depths of a
     * storage system), and with it some powerful costs: use this feature with
     * care.
     *
     * IMPORTANT NOTE #1: setBaggageItem() will only propagate baggage items to
     * *future* causal descendants of the associated Span.
     *
     * IMPORTANT NOTE #2: Use this thoughtfully and with care. Every key and
     * value is copied into every local *and remote* child of the associated
     * Span, and that can add up to a lot of network and cpu overhead.
     *
     * @param {string} key
     * @param {string} value
     */
    Span.prototype.setBaggageItem = function (key, value) {
        this._setBaggageItem(key, value);
        return this;
    };
    /**
     * Returns the value for a baggage item given its key.
     *
     * @param  {string} key
     *         The key for the given trace attribute.
     * @return {string}
     *         String value for the given key, or undefined if the key does not
     *         correspond to a set trace attribute.
     */
    Span.prototype.getBaggageItem = function (key) {
        return this._getBaggageItem(key);
    };
    /**
     * Adds a single tag to the span.  See `addTags()` for details.
     *
     * @param {string} key
     * @param {any} value
     */
    Span.prototype.setTag = function (key, value) {
        // NOTE: the call is normalized to a call to _addTags()
        this._addTags((_a = {}, _a[key] = value, _a));
        return this;
        var _a;
    };
    /**
     * Adds the given key value pairs to the set of span tags.
     *
     * Multiple calls to addTags() results in the tags being the superset of
     * all calls.
     *
     * The behavior of setting the same key multiple times on the same span
     * is undefined.
     *
     * The supported type of the values is implementation-dependent.
     * Implementations are expected to safely handle all types of values but
     * may choose to ignore unrecognized / unhandle-able values (e.g. objects
     * with cyclic references, function objects).
     *
     * @return {[type]} [description]
     */
    Span.prototype.addTags = function (keyValueMap) {
        this._addTags(keyValueMap);
        return this;
    };
    /**
     * Add a log record to this Span, optionally at a user-provided timestamp.
     *
     * For example:
     *
     *     span.log({
     *         size: rpc.size(),  // numeric value
     *         URI: rpc.URI(),  // string value
     *         payload: rpc.payload(),  // Object value
     *         "keys can be arbitrary strings": rpc.foo(),
     *     });
     *
     *     span.log({
     *         "error.description": someError.description(),
     *     }, someError.timestampMillis());
     *
     * @param {object} keyValuePairs
     *        An object mapping string keys to arbitrary value types. All
     *        Tracer implementations should support bool, string, and numeric
     *        value types, and some may also support Object values.
     * @param {number} timestamp
     *        An optional parameter specifying the timestamp in milliseconds
     *        since the Unix epoch. Fractional values are allowed so that
     *        timestamps with sub-millisecond accuracy can be represented. If
     *        not specified, the implementation is expected to use its notion
     *        of the current time of the call.
     */
    Span.prototype.log = function (keyValuePairs, timestamp) {
        this._log(keyValuePairs, timestamp);
        return this;
    };
    /**
     * DEPRECATED
     */
    Span.prototype.logEvent = function (eventName, payload) {
        return this._log({ event: eventName, payload: payload });
    };
    /**
     * Sets the end timestamp and finalizes Span state.
     *
     * With the exception of calls to Span.context() (which are always allowed),
     * finish() must be the last call made to any span instance, and to do
     * otherwise leads to undefined behavior.
     *
     * @param  {number} finishTime
     *         Optional finish time in milliseconds as a Unix timestamp. Decimal
     *         values are supported for timestamps with sub-millisecond accuracy.
     *         If not specified, the current time (as defined by the
     *         implementation) will be used.
     */
    Span.prototype.finish = function (finishTime) {
        this._finish(finishTime);
        // Do not return `this`. The Span generally should not be used after it
        // is finished so chaining is not desired in this context.
    };
    // ---------------------------------------------------------------------- //
    // Derived classes can choose to implement the below
    // ---------------------------------------------------------------------- //
    // By default returns a no-op SpanContext.
    Span.prototype._context = function () {
        return noop.spanContext;
    };
    // By default returns a no-op tracer.
    //
    // The base class could store the tracer that created it, but it does not
    // in order to ensure the no-op span implementation has zero members,
    // which allows V8 to aggressively optimize calls to such objects.
    Span.prototype._tracer = function () {
        return noop.tracer;
    };
    // By default does nothing
    Span.prototype._setOperationName = function (name) {
    };
    // By default does nothing
    Span.prototype._setBaggageItem = function (key, value) {
    };
    // By default does nothing
    Span.prototype._getBaggageItem = function (key) {
        return undefined;
    };
    // By default does nothing
    //
    // NOTE: both setTag() and addTags() map to this function. keyValuePairs
    // will always be an associative array.
    Span.prototype._addTags = function (keyValuePairs) {
    };
    // By default does nothing
    Span.prototype._log = function (keyValuePairs, timestamp) {
    };
    // By default does nothing
    //
    // finishTime is expected to be either a number or undefined.
    Span.prototype._finish = function (finishTime) {
    };
    return Span;
}());
exports.Span = Span;
exports["default"] = Span;
//# sourceMappingURL=span.js.map

/***/ }),

/***/ "../../node_modules/opentracing/lib/span_context.js":
/*!**********************************************************!*\
  !*** ../../node_modules/opentracing/lib/span_context.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * SpanContext represents Span state that must propagate to descendant Spans
 * and across process boundaries.
 *
 * SpanContext is logically divided into two pieces: the user-level "Baggage"
 * (see setBaggageItem and getBaggageItem) that propagates across Span
 * boundaries and any Tracer-implementation-specific fields that are needed to
 * identify or otherwise contextualize the associated Span instance (e.g., a
 * <trace_id, span_id, sampled> tuple).
 */
var SpanContext = /** @class */ (function () {
    function SpanContext() {
    }
    return SpanContext;
}());
exports.SpanContext = SpanContext;
exports["default"] = SpanContext;
//# sourceMappingURL=span_context.js.map

/***/ }),

/***/ "../../node_modules/opentracing/lib/tracer.js":
/*!****************************************************!*\
  !*** ../../node_modules/opentracing/lib/tracer.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Functions = __webpack_require__(/*! ./functions */ "../../node_modules/opentracing/lib/functions.js");
var Noop = __webpack_require__(/*! ./noop */ "../../node_modules/opentracing/lib/noop.js");
var span_1 = __webpack_require__(/*! ./span */ "../../node_modules/opentracing/lib/span.js");
/**
 * Tracer is the entry-point between the instrumentation API and the tracing
 * implementation.
 *
 * The default object acts as a no-op implementation.
 *
 * Note to implementators: derived classes can choose to directly implement the
 * methods in the "OpenTracing API methods" section, or optionally the subset of
 * underscore-prefixed methods to pick up the argument checking and handling
 * automatically from the base class.
 */
var Tracer = /** @class */ (function () {
    function Tracer() {
    }
    // ---------------------------------------------------------------------- //
    // OpenTracing API methods
    // ---------------------------------------------------------------------- //
    /**
     * Starts and returns a new Span representing a logical unit of work.
     *
     * For example:
     *
     *     // Start a new (parentless) root Span:
     *     var parent = Tracer.startSpan('DoWork');
     *
     *     // Start a new (child) Span:
     *     var child = Tracer.startSpan('load-from-db', {
     *         childOf: parent.context(),
     *     });
     *
     *     // Start a new async (FollowsFrom) Span:
     *     var child = Tracer.startSpan('async-cache-write', {
     *         references: [
     *             opentracing.followsFrom(parent.context())
     *         ],
     *     });
     *
     * @param {string} name - the name of the operation (REQUIRED).
     * @param {SpanOptions} [options] - options for the newly created span.
     * @return {Span} - a new Span object.
     */
    Tracer.prototype.startSpan = function (name, options) {
        if (options === void 0) { options = {}; }
        // Convert options.childOf to fields.references as needed.
        if (options.childOf) {
            // Convert from a Span or a SpanContext into a Reference.
            var childOf = Functions.childOf(options.childOf);
            if (options.references) {
                options.references.push(childOf);
            }
            else {
                options.references = [childOf];
            }
            delete (options.childOf);
        }
        return this._startSpan(name, options);
    };
    /**
     * Injects the given SpanContext instance for cross-process propagation
     * within `carrier`. The expected type of `carrier` depends on the value of
     * `format.
     *
     * OpenTracing defines a common set of `format` values (see
     * FORMAT_TEXT_MAP, FORMAT_HTTP_HEADERS, and FORMAT_BINARY), and each has
     * an expected carrier type.
     *
     * Consider this pseudocode example:
     *
     *     var clientSpan = ...;
     *     ...
     *     // Inject clientSpan into a text carrier.
     *     var headersCarrier = {};
     *     Tracer.inject(clientSpan.context(), Tracer.FORMAT_HTTP_HEADERS, headersCarrier);
     *     // Incorporate the textCarrier into the outbound HTTP request header
     *     // map.
     *     Object.assign(outboundHTTPReq.headers, headersCarrier);
     *     // ... send the httpReq
     *
     * @param  {SpanContext} spanContext - the SpanContext to inject into the
     *         carrier object. As a convenience, a Span instance may be passed
     *         in instead (in which case its .context() is used for the
     *         inject()).
     * @param  {string} format - the format of the carrier.
     * @param  {any} carrier - see the documentation for the chosen `format`
     *         for a description of the carrier object.
     */
    Tracer.prototype.inject = function (spanContext, format, carrier) {
        // Allow the user to pass a Span instead of a SpanContext
        if (spanContext instanceof span_1.default) {
            spanContext = spanContext.context();
        }
        return this._inject(spanContext, format, carrier);
    };
    /**
     * Returns a SpanContext instance extracted from `carrier` in the given
     * `format`.
     *
     * OpenTracing defines a common set of `format` values (see
     * FORMAT_TEXT_MAP, FORMAT_HTTP_HEADERS, and FORMAT_BINARY), and each has
     * an expected carrier type.
     *
     * Consider this pseudocode example:
     *
     *     // Use the inbound HTTP request's headers as a text map carrier.
     *     var headersCarrier = inboundHTTPReq.headers;
     *     var wireCtx = Tracer.extract(Tracer.FORMAT_HTTP_HEADERS, headersCarrier);
     *     var serverSpan = Tracer.startSpan('...', { childOf : wireCtx });
     *
     * @param  {string} format - the format of the carrier.
     * @param  {any} carrier - the type of the carrier object is determined by
     *         the format.
     * @return {SpanContext}
     *         The extracted SpanContext, or null if no such SpanContext could
     *         be found in `carrier`
     */
    Tracer.prototype.extract = function (format, carrier) {
        return this._extract(format, carrier);
    };
    // ---------------------------------------------------------------------- //
    // Derived classes can choose to implement the below
    // ---------------------------------------------------------------------- //
    // NOTE: the input to this method is *always* an associative array. The
    // public-facing startSpan() method normalizes the arguments so that
    // all N implementations do not need to worry about variations in the call
    // signature.
    //
    // The default behavior returns a no-op span.
    Tracer.prototype._startSpan = function (name, fields) {
        return Noop.span;
    };
    // The default behavior is a no-op.
    Tracer.prototype._inject = function (spanContext, format, carrier) {
    };
    // The default behavior is to return a no-op SpanContext.
    Tracer.prototype._extract = function (format, carrier) {
        return Noop.spanContext;
    };
    return Tracer;
}());
exports.Tracer = Tracer;
exports["default"] = Tracer;
//# sourceMappingURL=tracer.js.map

/***/ }),

/***/ "../../node_modules/promise-polyfill/src/finally.js":
/*!**********************************************************!*\
  !*** ../../node_modules/promise-polyfill/src/finally.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * @this {Promise}
 */
function finallyConstructor(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function() {
        // @ts-ignore
        return constructor.reject(reason);
      });
    }
  );
}

/* harmony default export */ __webpack_exports__["default"] = (finallyConstructor);


/***/ }),

/***/ "../../node_modules/promise-polyfill/src/index.js":
/*!********************************************************!*\
  !*** ../../node_modules/promise-polyfill/src/index.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _finally__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./finally */ "../../node_modules/promise-polyfill/src/finally.js");


// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function isArray(x) {
  return Boolean(x && typeof x.length !== 'undefined');
}

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = _finally__WEBPACK_IMPORTED_MODULE_0__["default"];

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.all accepts an array'));
    }

    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.race accepts an array'));
    }

    for (var i = 0, len = arr.length; i < len; i++) {
      Promise.resolve(arr[i]).then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  // @ts-ignore
  (typeof setImmediate === 'function' &&
    function(fn) {
      // @ts-ignore
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

/* harmony default export */ __webpack_exports__["default"] = (Promise);


/***/ }),

/***/ "../../node_modules/stackframe/stackframe.js":
/*!***************************************************!*\
  !*** ../../node_modules/stackframe/stackframe.js ***!
  \***************************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function () {
    'use strict';
    function _isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function StackFrame(functionName, args, fileName, lineNumber, columnNumber, source) {
        if (functionName !== undefined) {
            this.setFunctionName(functionName);
        }
        if (args !== undefined) {
            this.setArgs(args);
        }
        if (fileName !== undefined) {
            this.setFileName(fileName);
        }
        if (lineNumber !== undefined) {
            this.setLineNumber(lineNumber);
        }
        if (columnNumber !== undefined) {
            this.setColumnNumber(columnNumber);
        }
        if (source !== undefined) {
            this.setSource(source);
        }
    }

    StackFrame.prototype = {
        getFunctionName: function () {
            return this.functionName;
        },
        setFunctionName: function (v) {
            this.functionName = String(v);
        },

        getArgs: function () {
            return this.args;
        },
        setArgs: function (v) {
            if (Object.prototype.toString.call(v) !== '[object Array]') {
                throw new TypeError('Args must be an Array');
            }
            this.args = v;
        },

        // NOTE: Property name may be misleading as it includes the path,
        // but it somewhat mirrors V8's JavaScriptStackTraceApi
        // https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi and Gecko's
        // http://mxr.mozilla.org/mozilla-central/source/xpcom/base/nsIException.idl#14
        getFileName: function () {
            return this.fileName;
        },
        setFileName: function (v) {
            this.fileName = String(v);
        },

        getLineNumber: function () {
            return this.lineNumber;
        },
        setLineNumber: function (v) {
            if (!_isNumber(v)) {
                throw new TypeError('Line Number must be a Number');
            }
            this.lineNumber = Number(v);
        },

        getColumnNumber: function () {
            return this.columnNumber;
        },
        setColumnNumber: function (v) {
            if (!_isNumber(v)) {
                throw new TypeError('Column Number must be a Number');
            }
            this.columnNumber = Number(v);
        },

        getSource: function () {
            return this.source;
        },
        setSource: function (v) {
            this.source = String(v);
        },

        toString: function() {
            var functionName = this.getFunctionName() || '{anonymous}';
            var args = '(' + (this.getArgs() || []).join(',') + ')';
            var fileName = this.getFileName() ? ('@' + this.getFileName()) : '';
            var lineNumber = _isNumber(this.getLineNumber()) ? (':' + this.getLineNumber()) : '';
            var columnNumber = _isNumber(this.getColumnNumber()) ? (':' + this.getColumnNumber()) : '';
            return functionName + args + fileName + lineNumber + columnNumber;
        }
    };

    return StackFrame;
}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ApmBase: function() { return /* reexport safe */ _apm_base__WEBPACK_IMPORTED_MODULE_0__["default"]; },
/* harmony export */   apm: function() { return /* binding */ apmBase; },
/* harmony export */   apmBase: function() { return /* binding */ apmBase; },
/* harmony export */   init: function() { return /* binding */ init; }
/* harmony export */ });
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/bootstrap.js");
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/index.js");
/* harmony import */ var _apm_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./apm-base */ "./src/apm-base.js");



function getApmBase() {
  if (_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__.isBrowser && window.elasticApm) {
    return window.elasticApm;
  }

  var enabled = (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_2__.bootstrap)();
  var serviceFactory = (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_3__.createServiceFactory)();
  var apmBase = new _apm_base__WEBPACK_IMPORTED_MODULE_0__["default"](serviceFactory, !enabled);

  if (_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__.isBrowser) {
    window.elasticApm = apmBase;
  }

  return apmBase;
}

var apmBase = getApmBase();
var init = apmBase.init.bind(apmBase);
/* harmony default export */ __webpack_exports__["default"] = (init);

}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxhc3RpYy1hcG0tcnVtLnVtZC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBREE7O0FBSUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7O0FBSUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBT0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTs7QUFFQTtBQUNBOztBQUVBO0FBQUE7O0FBR0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUFBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFEQTtBQUdBO0FBVkE7QUFZQTtBQWJBO0FBZUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUFBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFBQTs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcFdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBOztBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUlBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFQQTtBQVNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFFQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFEQTtBQUdBO0FBVkE7QUFZQTtBQWJBO0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7O0FBV0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQWZBOztBQWtCQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFSQTtBQVVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQURBO0FBSkE7QUFKQTtBQWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUFBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQzFVQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE5QkE7QUFnQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBOztBQUtBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQUE7QUFBQTs7QUFJQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN1FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0REE7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7O0FBRUE7QUFDQTtBQUNBO0FBREE7QUFHQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBUEE7QUFTQTs7QUFFQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBTEE7QUFPQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUxBO0FBT0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFEQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBWEE7O0FBY0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOztBQUlBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3JLQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkRBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFPQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTs7QUFNQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQUE7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2hCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQzNEQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUhBOztBQU1BO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFEQTtBQUtBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQUpBO0FBV0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFGQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZCQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFKQTs7QUFhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3RkE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JEQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUFBO0FBQUE7O0FBSUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUFBO0FBQUE7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFOQTtBQVFBO0FBQ0E7QUFEQTtBQVRBO0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUZBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUZBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQWJBO0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTtBQVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBVEE7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBREE7QUFHQTtBQVpBOztBQWVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZKQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBTEE7O0FBUUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBOztBQUtBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsTUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUlBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoWEE7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQUE7QUFBQTs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBUkE7O0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSkE7QUFTQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBREE7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFNQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBOztBQUtBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUlBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7O0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBTUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakJBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFEQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzRkE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBREE7O0FBSUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQVhBO0FBYUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBWEE7O0FBY0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzSEE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQURBO0FBR0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7O0FBSUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQUE7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUhBO0FBUUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFGQTs7QUFLQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTs7QUFJQTtBQUFBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQU5BO0FBUUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7O0FBSUE7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBTUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBYkE7QUFtQkE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtBO0FBQ0E7QUFDQTtBQUZBOztBQUtBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQURBO0FBR0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTs7QUFJQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7O0FBS0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTs7QUFLQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkRBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUZBO0FBUUE7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQU1BO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3Q0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUlBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFNQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMURBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFJQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFEQTtBQUdBOztBQUVBO0FBQ0E7QUFEQTs7QUFJQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWRBO0FBZ0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFqQkE7QUFtQkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQzdWQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FDdkZBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBRkE7QUFBQTtBQUFBOztBQU9BOztBQUVBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7O0FBS0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQURBOztBQVFBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2haQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FDMUtBOztBQUVBO0FBQ0E7QUFDQTtBQUZBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3VCQTs7QUFpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQUE7O0FBQ0E7QUFDQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTs7QUFZQTtBQUNBO0FBSUE7QUFDQTtBQUlBOztBQUNBO0FBQ0E7QUFFQTtBQUtBO0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7O0FBRUE7QUFBQTtBQUFBOztBQUdBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBOztBQU9BO0FBQ0E7QUFBQTtBQUFBO0FBQUE7O0FBVUE7QUFNQTs7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOztBQUNBO0FBQUE7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUdBO0FBQ0E7O0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUtBO0FBQ0E7QUFDQTtBQUZBOztBQUtBO0FBQ0E7QUFDQTs7QUFFQTs7QUFDQTtBQU9BO0FBQUE7QUFBQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFpQkE7QUFDQTtBQUFBO0FBQUE7O0FBSUE7QUFBQTtBQUFBO0FBQUE7O0FBQ0E7QUFDQTtBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUN0VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN4TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDOU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUMzUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNQQTs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ21CQTtBQUtBOztBQU1BO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUVBO0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvYm9vdHN0cmFwLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vYWZ0ZXItZnJhbWUuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9hcG0tc2VydmVyLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vY29tcHJlc3MuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9jb25maWctc2VydmljZS5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL2NvbnRleHQuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9ldmVudC1oYW5kbGVyLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vaHR0cC9mZXRjaC5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL2h0dHAvcmVzcG9uc2Utc3RhdHVzLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vaHR0cC94aHIuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9pbnN0cnVtZW50LmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vbG9nZ2luZy1zZXJ2aWNlLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vbmRqc29uLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vb2JzZXJ2ZXJzL3BhZ2UtY2xpY2tzLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vb2JzZXJ2ZXJzL3BhZ2UtdmlzaWJpbGl0eS5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL3BhdGNoaW5nL2ZldGNoLXBhdGNoLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vcGF0Y2hpbmcvaGlzdG9yeS1wYXRjaC5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL3BhdGNoaW5nL2luZGV4LmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vcGF0Y2hpbmcvcGF0Y2gtdXRpbHMuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9wYXRjaGluZy94aHItcGF0Y2guanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9wb2x5ZmlsbHMuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9xdWV1ZS5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL3NlcnZpY2UtZmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL3Rocm90dGxlLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vdHJ1bmNhdGUuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi91cmwuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi91dGlscy5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvZXJyb3ItbG9nZ2luZy9lcnJvci1sb2dnaW5nLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9lcnJvci1sb2dnaW5nL2luZGV4LmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9lcnJvci1sb2dnaW5nL3N0YWNrLXRyYWNlLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvb3BlbnRyYWNpbmcvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL29wZW50cmFjaW5nL3NwYW4uanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL29wZW50cmFjaW5nL3RyYWNlci5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9icmVha2Rvd24uanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcvbWV0cmljcy5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9uYXZpZ2F0aW9uL2NhcHR1cmUtbmF2aWdhdGlvbi5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9uYXZpZ2F0aW9uL21hcmtzLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9wZXJmb3JtYW5jZS1tb25pdG9yaW5nL25hdmlnYXRpb24vbmF2aWdhdGlvbi10aW1pbmcuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcvbmF2aWdhdGlvbi9yZXNvdXJjZS10aW1pbmcuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcvbmF2aWdhdGlvbi91c2VyLXRpbWluZy5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9uYXZpZ2F0aW9uL3V0aWxzLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9wZXJmb3JtYW5jZS1tb25pdG9yaW5nL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3Jpbmcvc3Bhbi1iYXNlLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9wZXJmb3JtYW5jZS1tb25pdG9yaW5nL3NwYW4uanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcvdHJhbnNhY3Rpb24tc2VydmljZS5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy90cmFuc2FjdGlvbi5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvc3RhdGUuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uL3NyYy9hcG0tYmFzZS5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uLy4uL25vZGVfbW9kdWxlcy9lcnJvci1zdGFjay1wYXJzZXIvZXJyb3Itc3RhY2stcGFyc2VyLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vLi4vbm9kZV9tb2R1bGVzL29wZW50cmFjaW5nL2xpYi9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi8uLi9ub2RlX21vZHVsZXMvb3BlbnRyYWNpbmcvbGliL2Z1bmN0aW9ucy5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uLy4uL25vZGVfbW9kdWxlcy9vcGVudHJhY2luZy9saWIvbm9vcC5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uLy4uL25vZGVfbW9kdWxlcy9vcGVudHJhY2luZy9saWIvcmVmZXJlbmNlLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vLi4vbm9kZV9tb2R1bGVzL29wZW50cmFjaW5nL2xpYi9zcGFuLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vLi4vbm9kZV9tb2R1bGVzL29wZW50cmFjaW5nL2xpYi9zcGFuX2NvbnRleHQuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi8uLi9ub2RlX21vZHVsZXMvb3BlbnRyYWNpbmcvbGliL3RyYWNlci5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9taXNlLXBvbHlmaWxsL3NyYy9maW5hbGx5LmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vLi4vbm9kZV9tb2R1bGVzL3Byb21pc2UtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vLi4vbm9kZV9tb2R1bGVzL3N0YWNrZnJhbWUvc3RhY2tmcmFtZS5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImVsYXN0aWMtYXBtLXJ1bVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJlbGFzdGljLWFwbS1ydW1cIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCJpbXBvcnQgeyBpc1BsYXRmb3JtU3VwcG9ydGVkLCBpc0Jyb3dzZXIsIG5vdyB9IGZyb20gJy4vY29tbW9uL3V0aWxzJztcbmltcG9ydCB7IHBhdGNoQWxsIH0gZnJvbSAnLi9jb21tb24vcGF0Y2hpbmcnO1xuaW1wb3J0IHsgc3RhdGUgfSBmcm9tICcuL3N0YXRlJztcbnZhciBlbmFibGVkID0gZmFsc2U7XG5leHBvcnQgZnVuY3Rpb24gYm9vdHN0cmFwKCkge1xuICBpZiAoaXNQbGF0Zm9ybVN1cHBvcnRlZCgpKSB7XG4gICAgcGF0Y2hBbGwoKTtcbiAgICBzdGF0ZS5ib290c3RyYXBUaW1lID0gbm93KCk7XG4gICAgZW5hYmxlZCA9IHRydWU7XG4gIH0gZWxzZSBpZiAoaXNCcm93c2VyKSB7XG4gICAgY29uc29sZS5sb2coJ1tFbGFzdGljIEFQTV0gcGxhdGZvcm0gaXMgbm90IHN1cHBvcnRlZCEnKTtcbiAgfVxuXG4gIHJldHVybiBlbmFibGVkO1xufSIsInZhciBSQUZfVElNRU9VVCA9IDEwMDtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFmdGVyRnJhbWUoY2FsbGJhY2spIHtcbiAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbiBoYW5kbGVyKCkge1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZShyYWYpO1xuICAgIHNldFRpbWVvdXQoY2FsbGJhY2spO1xuICB9O1xuXG4gIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChoYW5kbGVyLCBSQUZfVElNRU9VVCk7XG4gIHZhciByYWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoaGFuZGxlcik7XG59IiwiaW1wb3J0IFF1ZXVlIGZyb20gJy4vcXVldWUnO1xuaW1wb3J0IHRocm90dGxlIGZyb20gJy4vdGhyb3R0bGUnO1xuaW1wb3J0IE5ESlNPTiBmcm9tICcuL25kanNvbic7XG5pbXBvcnQgeyB0cnVuY2F0ZU1vZGVsLCBNRVRBREFUQV9NT0RFTCB9IGZyb20gJy4vdHJ1bmNhdGUnO1xuaW1wb3J0IHsgRVJST1JTLCBIVFRQX1JFUVVFU1RfVElNRU9VVCwgUVVFVUVfRkxVU0gsIFRSQU5TQUNUSU9OUyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IFByb21pc2UgfSBmcm9tICcuL3BvbHlmaWxscyc7XG5pbXBvcnQgeyBjb21wcmVzc01ldGFkYXRhLCBjb21wcmVzc1RyYW5zYWN0aW9uLCBjb21wcmVzc0Vycm9yLCBjb21wcmVzc1BheWxvYWQgfSBmcm9tICcuL2NvbXByZXNzJztcbmltcG9ydCB7IF9fREVWX18gfSBmcm9tICcuLi9zdGF0ZSc7XG5pbXBvcnQgeyBzZW5kRmV0Y2hSZXF1ZXN0LCBzaG91bGRVc2VGZXRjaFdpdGhLZWVwQWxpdmUgfSBmcm9tICcuL2h0dHAvZmV0Y2gnO1xuaW1wb3J0IHsgc2VuZFhIUiB9IGZyb20gJy4vaHR0cC94aHInO1xudmFyIFRIUk9UVExFX0lOVEVSVkFMID0gNjAwMDA7XG5cbnZhciBBcG1TZXJ2ZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEFwbVNlcnZlcihjb25maWdTZXJ2aWNlLCBsb2dnaW5nU2VydmljZSkge1xuICAgIHRoaXMuX2NvbmZpZ1NlcnZpY2UgPSBjb25maWdTZXJ2aWNlO1xuICAgIHRoaXMuX2xvZ2dpbmdTZXJ2aWNlID0gbG9nZ2luZ1NlcnZpY2U7XG4gICAgdGhpcy5xdWV1ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRocm90dGxlRXZlbnRzID0gbm9vcDtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBBcG1TZXJ2ZXIucHJvdG90eXBlO1xuXG4gIF9wcm90by5pbml0ID0gZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIHF1ZXVlTGltaXQgPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldCgncXVldWVMaW1pdCcpO1xuXG4gICAgdmFyIGZsdXNoSW50ZXJ2YWwgPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldCgnZmx1c2hJbnRlcnZhbCcpO1xuXG4gICAgdmFyIGxpbWl0ID0gdGhpcy5fY29uZmlnU2VydmljZS5nZXQoJ2V2ZW50c0xpbWl0Jyk7XG5cbiAgICB2YXIgb25GbHVzaCA9IGZ1bmN0aW9uIG9uRmx1c2goZXZlbnRzKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IF90aGlzLnNlbmRFdmVudHMoZXZlbnRzKTtcblxuICAgICAgaWYgKHByb21pc2UpIHtcbiAgICAgICAgcHJvbWlzZS5jYXRjaChmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgICAgX3RoaXMuX2xvZ2dpbmdTZXJ2aWNlLndhcm4oJ0ZhaWxlZCBzZW5kaW5nIGV2ZW50cyEnLCBfdGhpcy5fY29uc3RydWN0RXJyb3IocmVhc29uKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnF1ZXVlID0gbmV3IFF1ZXVlKG9uRmx1c2gsIHtcbiAgICAgIHF1ZXVlTGltaXQ6IHF1ZXVlTGltaXQsXG4gICAgICBmbHVzaEludGVydmFsOiBmbHVzaEludGVydmFsXG4gICAgfSk7XG4gICAgdGhpcy50aHJvdHRsZUV2ZW50cyA9IHRocm90dGxlKHRoaXMucXVldWUuYWRkLmJpbmQodGhpcy5xdWV1ZSksIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBfdGhpcy5fbG9nZ2luZ1NlcnZpY2Uud2FybignRHJvcHBlZCBldmVudHMgZHVlIHRvIHRocm90dGxpbmchJyk7XG4gICAgfSwge1xuICAgICAgbGltaXQ6IGxpbWl0LFxuICAgICAgaW50ZXJ2YWw6IFRIUk9UVExFX0lOVEVSVkFMXG4gICAgfSk7XG5cbiAgICB0aGlzLl9jb25maWdTZXJ2aWNlLm9ic2VydmVFdmVudChRVUVVRV9GTFVTSCwgZnVuY3Rpb24gKCkge1xuICAgICAgX3RoaXMucXVldWUuZmx1c2goKTtcbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8uX3Bvc3RKc29uID0gZnVuY3Rpb24gX3Bvc3RKc29uKGVuZFBvaW50LCBwYXlsb2FkKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICB2YXIgaGVhZGVycyA9IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC1uZGpzb24nXG4gICAgfTtcblxuICAgIHZhciBhcG1SZXF1ZXN0ID0gdGhpcy5fY29uZmlnU2VydmljZS5nZXQoJ2FwbVJlcXVlc3QnKTtcblxuICAgIHZhciBwYXJhbXMgPSB7XG4gICAgICBwYXlsb2FkOiBwYXlsb2FkLFxuICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgIGJlZm9yZVNlbmQ6IGFwbVJlcXVlc3RcbiAgICB9O1xuICAgIHJldHVybiBjb21wcmVzc1BheWxvYWQocGFyYW1zKS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgIF90aGlzMi5fbG9nZ2luZ1NlcnZpY2UuZGVidWcoJ0NvbXByZXNzaW5nIHRoZSBwYXlsb2FkIHVzaW5nIENvbXByZXNzaW9uU3RyZWFtIEFQSSBmYWlsZWQnLCBlcnJvci5tZXNzYWdlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhcmFtcztcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIHJldHVybiBfdGhpczIuX21ha2VIdHRwUmVxdWVzdCgnUE9TVCcsIGVuZFBvaW50LCByZXN1bHQpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgIHZhciByZXNwb25zZVRleHQgPSBfcmVmLnJlc3BvbnNlVGV4dDtcbiAgICAgIHJldHVybiByZXNwb25zZVRleHQ7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLl9jb25zdHJ1Y3RFcnJvciA9IGZ1bmN0aW9uIF9jb25zdHJ1Y3RFcnJvcihyZWFzb24pIHtcbiAgICB2YXIgdXJsID0gcmVhc29uLnVybCxcbiAgICAgICAgc3RhdHVzID0gcmVhc29uLnN0YXR1cyxcbiAgICAgICAgcmVzcG9uc2VUZXh0ID0gcmVhc29uLnJlc3BvbnNlVGV4dDtcblxuICAgIGlmICh0eXBlb2Ygc3RhdHVzID09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gcmVhc29uO1xuICAgIH1cblxuICAgIHZhciBtZXNzYWdlID0gdXJsICsgJyBIVFRQIHN0YXR1czogJyArIHN0YXR1cztcblxuICAgIGlmIChfX0RFVl9fICYmIHJlc3BvbnNlVGV4dCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHNlcnZlckVycm9ycyA9IFtdO1xuICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycyAmJiByZXNwb25zZS5lcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJlc3BvbnNlLmVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2ZXJFcnJvcnMucHVzaChlcnIubWVzc2FnZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbWVzc2FnZSArPSAnICcgKyBzZXJ2ZXJFcnJvcnMuam9pbignLCcpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRoaXMuX2xvZ2dpbmdTZXJ2aWNlLmRlYnVnKCdFcnJvciBwYXJzaW5nIHJlc3BvbnNlIGZyb20gQVBNIHNlcnZlcicsIGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIH07XG5cbiAgX3Byb3RvLl9tYWtlSHR0cFJlcXVlc3QgPSBmdW5jdGlvbiBfbWFrZUh0dHBSZXF1ZXN0KG1ldGhvZCwgdXJsLCBfdGVtcCkge1xuICAgIHZhciBfcmVmMiA9IF90ZW1wID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wLFxuICAgICAgICBfcmVmMiR0aW1lb3V0ID0gX3JlZjIudGltZW91dCxcbiAgICAgICAgdGltZW91dCA9IF9yZWYyJHRpbWVvdXQgPT09IHZvaWQgMCA/IEhUVFBfUkVRVUVTVF9USU1FT1VUIDogX3JlZjIkdGltZW91dCxcbiAgICAgICAgcGF5bG9hZCA9IF9yZWYyLnBheWxvYWQsXG4gICAgICAgIGhlYWRlcnMgPSBfcmVmMi5oZWFkZXJzLFxuICAgICAgICBiZWZvcmVTZW5kID0gX3JlZjIuYmVmb3JlU2VuZDtcblxuICAgIHZhciBzZW5kQ3JlZGVudGlhbHMgPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldCgnc2VuZENyZWRlbnRpYWxzJyk7XG5cbiAgICBpZiAoIWJlZm9yZVNlbmQgJiYgc2hvdWxkVXNlRmV0Y2hXaXRoS2VlcEFsaXZlKG1ldGhvZCwgcGF5bG9hZCkpIHtcbiAgICAgIHJldHVybiBzZW5kRmV0Y2hSZXF1ZXN0KG1ldGhvZCwgdXJsLCB7XG4gICAgICAgIGtlZXBhbGl2ZTogdHJ1ZSxcbiAgICAgICAgdGltZW91dDogdGltZW91dCxcbiAgICAgICAgcGF5bG9hZDogcGF5bG9hZCxcbiAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgc2VuZENyZWRlbnRpYWxzOiBzZW5kQ3JlZGVudGlhbHNcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgaWYgKHJlYXNvbiBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgIHJldHVybiBzZW5kWEhSKG1ldGhvZCwgdXJsLCB7XG4gICAgICAgICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgICAgICAgcGF5bG9hZDogcGF5bG9hZCxcbiAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICAgICBiZWZvcmVTZW5kOiBiZWZvcmVTZW5kLFxuICAgICAgICAgICAgc2VuZENyZWRlbnRpYWxzOiBzZW5kQ3JlZGVudGlhbHNcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IHJlYXNvbjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBzZW5kWEhSKG1ldGhvZCwgdXJsLCB7XG4gICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgcGF5bG9hZDogcGF5bG9hZCxcbiAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICBiZWZvcmVTZW5kOiBiZWZvcmVTZW5kLFxuICAgICAgc2VuZENyZWRlbnRpYWxzOiBzZW5kQ3JlZGVudGlhbHNcbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8uZmV0Y2hDb25maWcgPSBmdW5jdGlvbiBmZXRjaENvbmZpZyhzZXJ2aWNlTmFtZSwgZW52aXJvbm1lbnQpIHtcbiAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgIHZhciBfdGhpcyRnZXRFbmRwb2ludHMgPSB0aGlzLmdldEVuZHBvaW50cygpLFxuICAgICAgICBjb25maWdFbmRwb2ludCA9IF90aGlzJGdldEVuZHBvaW50cy5jb25maWdFbmRwb2ludDtcblxuICAgIGlmICghc2VydmljZU5hbWUpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgnc2VydmljZU5hbWUgaXMgcmVxdWlyZWQgZm9yIGZldGNoaW5nIGNlbnRyYWwgY29uZmlnLicpO1xuICAgIH1cblxuICAgIGNvbmZpZ0VuZHBvaW50ICs9IFwiP3NlcnZpY2UubmFtZT1cIiArIHNlcnZpY2VOYW1lO1xuXG4gICAgaWYgKGVudmlyb25tZW50KSB7XG4gICAgICBjb25maWdFbmRwb2ludCArPSBcIiZzZXJ2aWNlLmVudmlyb25tZW50PVwiICsgZW52aXJvbm1lbnQ7XG4gICAgfVxuXG4gICAgdmFyIGxvY2FsQ29uZmlnID0gdGhpcy5fY29uZmlnU2VydmljZS5nZXRMb2NhbENvbmZpZygpO1xuXG4gICAgaWYgKGxvY2FsQ29uZmlnKSB7XG4gICAgICBjb25maWdFbmRwb2ludCArPSBcIiZpZm5vbmVtYXRjaD1cIiArIGxvY2FsQ29uZmlnLmV0YWc7XG4gICAgfVxuXG4gICAgdmFyIGFwbVJlcXVlc3QgPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldCgnYXBtUmVxdWVzdCcpO1xuXG4gICAgcmV0dXJuIHRoaXMuX21ha2VIdHRwUmVxdWVzdCgnR0VUJywgY29uZmlnRW5kcG9pbnQsIHtcbiAgICAgIHRpbWVvdXQ6IDUwMDAsXG4gICAgICBiZWZvcmVTZW5kOiBhcG1SZXF1ZXN0XG4gICAgfSkudGhlbihmdW5jdGlvbiAoeGhyKSB7XG4gICAgICB2YXIgc3RhdHVzID0geGhyLnN0YXR1cyxcbiAgICAgICAgICByZXNwb25zZVRleHQgPSB4aHIucmVzcG9uc2VUZXh0O1xuXG4gICAgICBpZiAoc3RhdHVzID09PSAzMDQpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsQ29uZmlnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlbW90ZUNvbmZpZyA9IEpTT04ucGFyc2UocmVzcG9uc2VUZXh0KTtcbiAgICAgICAgdmFyIGV0YWcgPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2V0YWcnKTtcblxuICAgICAgICBpZiAoZXRhZykge1xuICAgICAgICAgIHJlbW90ZUNvbmZpZy5ldGFnID0gZXRhZy5yZXBsYWNlKC9bXCJdL2csICcnKTtcblxuICAgICAgICAgIF90aGlzMy5fY29uZmlnU2VydmljZS5zZXRMb2NhbENvbmZpZyhyZW1vdGVDb25maWcsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlbW90ZUNvbmZpZztcbiAgICAgIH1cbiAgICB9KS5jYXRjaChmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICB2YXIgZXJyb3IgPSBfdGhpczMuX2NvbnN0cnVjdEVycm9yKHJlYXNvbik7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLmNyZWF0ZU1ldGFEYXRhID0gZnVuY3Rpb24gY3JlYXRlTWV0YURhdGEoKSB7XG4gICAgdmFyIGNmZyA9IHRoaXMuX2NvbmZpZ1NlcnZpY2U7XG4gICAgdmFyIG1ldGFkYXRhID0ge1xuICAgICAgc2VydmljZToge1xuICAgICAgICBuYW1lOiBjZmcuZ2V0KCdzZXJ2aWNlTmFtZScpLFxuICAgICAgICB2ZXJzaW9uOiBjZmcuZ2V0KCdzZXJ2aWNlVmVyc2lvbicpLFxuICAgICAgICBhZ2VudDoge1xuICAgICAgICAgIG5hbWU6ICdydW0tanMnLFxuICAgICAgICAgIHZlcnNpb246IGNmZy52ZXJzaW9uXG4gICAgICAgIH0sXG4gICAgICAgIGxhbmd1YWdlOiB7XG4gICAgICAgICAgbmFtZTogJ2phdmFzY3JpcHQnXG4gICAgICAgIH0sXG4gICAgICAgIGVudmlyb25tZW50OiBjZmcuZ2V0KCdlbnZpcm9ubWVudCcpXG4gICAgICB9LFxuICAgICAgbGFiZWxzOiBjZmcuZ2V0KCdjb250ZXh0LnRhZ3MnKVxuICAgIH07XG4gICAgcmV0dXJuIHRydW5jYXRlTW9kZWwoTUVUQURBVEFfTU9ERUwsIG1ldGFkYXRhKTtcbiAgfTtcblxuICBfcHJvdG8uYWRkRXJyb3IgPSBmdW5jdGlvbiBhZGRFcnJvcihlcnJvcikge1xuICAgIHZhciBfdGhpcyR0aHJvdHRsZUV2ZW50cztcblxuICAgIHRoaXMudGhyb3R0bGVFdmVudHMoKF90aGlzJHRocm90dGxlRXZlbnRzID0ge30sIF90aGlzJHRocm90dGxlRXZlbnRzW0VSUk9SU10gPSBlcnJvciwgX3RoaXMkdGhyb3R0bGVFdmVudHMpKTtcbiAgfTtcblxuICBfcHJvdG8uYWRkVHJhbnNhY3Rpb24gPSBmdW5jdGlvbiBhZGRUcmFuc2FjdGlvbih0cmFuc2FjdGlvbikge1xuICAgIHZhciBfdGhpcyR0aHJvdHRsZUV2ZW50czI7XG5cbiAgICB0aGlzLnRocm90dGxlRXZlbnRzKChfdGhpcyR0aHJvdHRsZUV2ZW50czIgPSB7fSwgX3RoaXMkdGhyb3R0bGVFdmVudHMyW1RSQU5TQUNUSU9OU10gPSB0cmFuc2FjdGlvbiwgX3RoaXMkdGhyb3R0bGVFdmVudHMyKSk7XG4gIH07XG5cbiAgX3Byb3RvLm5kanNvbkVycm9ycyA9IGZ1bmN0aW9uIG5kanNvbkVycm9ycyhlcnJvcnMsIGNvbXByZXNzKSB7XG4gICAgdmFyIGtleSA9IGNvbXByZXNzID8gJ2UnIDogJ2Vycm9yJztcbiAgICByZXR1cm4gZXJyb3JzLm1hcChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIHZhciBfTkRKU09OJHN0cmluZ2lmeTtcblxuICAgICAgcmV0dXJuIE5ESlNPTi5zdHJpbmdpZnkoKF9OREpTT04kc3RyaW5naWZ5ID0ge30sIF9OREpTT04kc3RyaW5naWZ5W2tleV0gPSBjb21wcmVzcyA/IGNvbXByZXNzRXJyb3IoZXJyb3IpIDogZXJyb3IsIF9OREpTT04kc3RyaW5naWZ5KSk7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLm5kanNvbk1ldHJpY3NldHMgPSBmdW5jdGlvbiBuZGpzb25NZXRyaWNzZXRzKG1ldHJpY3NldHMpIHtcbiAgICByZXR1cm4gbWV0cmljc2V0cy5tYXAoZnVuY3Rpb24gKG1ldHJpY3NldCkge1xuICAgICAgcmV0dXJuIE5ESlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBtZXRyaWNzZXQ6IG1ldHJpY3NldFxuICAgICAgfSk7XG4gICAgfSkuam9pbignJyk7XG4gIH07XG5cbiAgX3Byb3RvLm5kanNvblRyYW5zYWN0aW9ucyA9IGZ1bmN0aW9uIG5kanNvblRyYW5zYWN0aW9ucyh0cmFuc2FjdGlvbnMsIGNvbXByZXNzKSB7XG4gICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICB2YXIga2V5ID0gY29tcHJlc3MgPyAneCcgOiAndHJhbnNhY3Rpb24nO1xuICAgIHJldHVybiB0cmFuc2FjdGlvbnMubWFwKGZ1bmN0aW9uICh0cikge1xuICAgICAgdmFyIF9OREpTT04kc3RyaW5naWZ5MjtcblxuICAgICAgdmFyIHNwYW5zID0gJycsXG4gICAgICAgICAgYnJlYWtkb3ducyA9ICcnO1xuXG4gICAgICBpZiAoIWNvbXByZXNzKSB7XG4gICAgICAgIGlmICh0ci5zcGFucykge1xuICAgICAgICAgIHNwYW5zID0gdHIuc3BhbnMubWFwKGZ1bmN0aW9uIChzcGFuKSB7XG4gICAgICAgICAgICByZXR1cm4gTkRKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgIHNwYW46IHNwYW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pLmpvaW4oJycpO1xuICAgICAgICAgIGRlbGV0ZSB0ci5zcGFucztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0ci5icmVha2Rvd24pIHtcbiAgICAgICAgICBicmVha2Rvd25zID0gX3RoaXM0Lm5kanNvbk1ldHJpY3NldHModHIuYnJlYWtkb3duKTtcbiAgICAgICAgICBkZWxldGUgdHIuYnJlYWtkb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBOREpTT04uc3RyaW5naWZ5KChfTkRKU09OJHN0cmluZ2lmeTIgPSB7fSwgX05ESlNPTiRzdHJpbmdpZnkyW2tleV0gPSBjb21wcmVzcyA/IGNvbXByZXNzVHJhbnNhY3Rpb24odHIpIDogdHIsIF9OREpTT04kc3RyaW5naWZ5MikpICsgc3BhbnMgKyBicmVha2Rvd25zO1xuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5zZW5kRXZlbnRzID0gZnVuY3Rpb24gc2VuZEV2ZW50cyhldmVudHMpIHtcbiAgICB2YXIgX3BheWxvYWQsIF9OREpTT04kc3RyaW5naWZ5MztcblxuICAgIGlmIChldmVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHRyYW5zYWN0aW9ucyA9IFtdO1xuICAgIHZhciBlcnJvcnMgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZXZlbnQgPSBldmVudHNbaV07XG5cbiAgICAgIGlmIChldmVudFtUUkFOU0FDVElPTlNdKSB7XG4gICAgICAgIHRyYW5zYWN0aW9ucy5wdXNoKGV2ZW50W1RSQU5TQUNUSU9OU10pO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnRbRVJST1JTXSkge1xuICAgICAgICBlcnJvcnMucHVzaChldmVudFtFUlJPUlNdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHJhbnNhY3Rpb25zLmxlbmd0aCA9PT0gMCAmJiBlcnJvcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGNmZyA9IHRoaXMuX2NvbmZpZ1NlcnZpY2U7XG4gICAgdmFyIHBheWxvYWQgPSAoX3BheWxvYWQgPSB7fSwgX3BheWxvYWRbVFJBTlNBQ1RJT05TXSA9IHRyYW5zYWN0aW9ucywgX3BheWxvYWRbRVJST1JTXSA9IGVycm9ycywgX3BheWxvYWQpO1xuICAgIHZhciBmaWx0ZXJlZFBheWxvYWQgPSBjZmcuYXBwbHlGaWx0ZXJzKHBheWxvYWQpO1xuXG4gICAgaWYgKCFmaWx0ZXJlZFBheWxvYWQpIHtcbiAgICAgIHRoaXMuX2xvZ2dpbmdTZXJ2aWNlLndhcm4oJ0Ryb3BwZWQgcGF5bG9hZCBkdWUgdG8gZmlsdGVyaW5nIScpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGFwaVZlcnNpb24gPSBjZmcuZ2V0KCdhcGlWZXJzaW9uJyk7XG4gICAgdmFyIGNvbXByZXNzID0gYXBpVmVyc2lvbiA+IDI7XG4gICAgdmFyIG5kanNvbiA9IFtdO1xuICAgIHZhciBtZXRhZGF0YSA9IHRoaXMuY3JlYXRlTWV0YURhdGEoKTtcbiAgICB2YXIgbWV0YWRhdGFLZXkgPSBjb21wcmVzcyA/ICdtJyA6ICdtZXRhZGF0YSc7XG4gICAgbmRqc29uLnB1c2goTkRKU09OLnN0cmluZ2lmeSgoX05ESlNPTiRzdHJpbmdpZnkzID0ge30sIF9OREpTT04kc3RyaW5naWZ5M1ttZXRhZGF0YUtleV0gPSBjb21wcmVzcyA/IGNvbXByZXNzTWV0YWRhdGEobWV0YWRhdGEpIDogbWV0YWRhdGEsIF9OREpTT04kc3RyaW5naWZ5MykpKTtcbiAgICBuZGpzb24gPSBuZGpzb24uY29uY2F0KHRoaXMubmRqc29uRXJyb3JzKGZpbHRlcmVkUGF5bG9hZFtFUlJPUlNdLCBjb21wcmVzcyksIHRoaXMubmRqc29uVHJhbnNhY3Rpb25zKGZpbHRlcmVkUGF5bG9hZFtUUkFOU0FDVElPTlNdLCBjb21wcmVzcykpO1xuICAgIHZhciBuZGpzb25QYXlsb2FkID0gbmRqc29uLmpvaW4oJycpO1xuXG4gICAgdmFyIF90aGlzJGdldEVuZHBvaW50czIgPSB0aGlzLmdldEVuZHBvaW50cygpLFxuICAgICAgICBpbnRha2VFbmRwb2ludCA9IF90aGlzJGdldEVuZHBvaW50czIuaW50YWtlRW5kcG9pbnQ7XG5cbiAgICByZXR1cm4gdGhpcy5fcG9zdEpzb24oaW50YWtlRW5kcG9pbnQsIG5kanNvblBheWxvYWQpO1xuICB9O1xuXG4gIF9wcm90by5nZXRFbmRwb2ludHMgPSBmdW5jdGlvbiBnZXRFbmRwb2ludHMoKSB7XG4gICAgdmFyIHNlcnZlclVybCA9IHRoaXMuX2NvbmZpZ1NlcnZpY2UuZ2V0KCdzZXJ2ZXJVcmwnKTtcblxuICAgIHZhciBhcGlWZXJzaW9uID0gdGhpcy5fY29uZmlnU2VydmljZS5nZXQoJ2FwaVZlcnNpb24nKTtcblxuICAgIHZhciBzZXJ2ZXJVcmxQcmVmaXggPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldCgnc2VydmVyVXJsUHJlZml4JykgfHwgXCIvaW50YWtlL3ZcIiArIGFwaVZlcnNpb24gKyBcIi9ydW0vZXZlbnRzXCI7XG4gICAgdmFyIGludGFrZUVuZHBvaW50ID0gc2VydmVyVXJsICsgc2VydmVyVXJsUHJlZml4O1xuICAgIHZhciBjb25maWdFbmRwb2ludCA9IHNlcnZlclVybCArIFwiL2NvbmZpZy92MS9ydW0vYWdlbnRzXCI7XG4gICAgcmV0dXJuIHtcbiAgICAgIGludGFrZUVuZHBvaW50OiBpbnRha2VFbmRwb2ludCxcbiAgICAgIGNvbmZpZ0VuZHBvaW50OiBjb25maWdFbmRwb2ludFxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIEFwbVNlcnZlcjtcbn0oKTtcblxuZXhwb3J0IGRlZmF1bHQgQXBtU2VydmVyOyIsImltcG9ydCB7IFByb21pc2UgfSBmcm9tICcuL3BvbHlmaWxscyc7XG5pbXBvcnQgeyBOQVZJR0FUSU9OX1RJTUlOR19NQVJLUywgQ09NUFJFU1NFRF9OQVZfVElNSU5HX01BUktTIH0gZnJvbSAnLi4vcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9uYXZpZ2F0aW9uL21hcmtzJztcbmltcG9ydCB7IGlzQmVhY29uSW5zcGVjdGlvbkVuYWJsZWQgfSBmcm9tICcuL3V0aWxzJztcblxuZnVuY3Rpb24gY29tcHJlc3NTdGFja0ZyYW1lcyhmcmFtZXMpIHtcbiAgcmV0dXJuIGZyYW1lcy5tYXAoZnVuY3Rpb24gKGZyYW1lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFwOiBmcmFtZS5hYnNfcGF0aCxcbiAgICAgIGY6IGZyYW1lLmZpbGVuYW1lLFxuICAgICAgZm46IGZyYW1lLmZ1bmN0aW9uLFxuICAgICAgbGk6IGZyYW1lLmxpbmVubyxcbiAgICAgIGNvOiBmcmFtZS5jb2xub1xuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjb21wcmVzc1Jlc3BvbnNlKHJlc3BvbnNlKSB7XG4gIHJldHVybiB7XG4gICAgdHM6IHJlc3BvbnNlLnRyYW5zZmVyX3NpemUsXG4gICAgZWJzOiByZXNwb25zZS5lbmNvZGVkX2JvZHlfc2l6ZSxcbiAgICBkYnM6IHJlc3BvbnNlLmRlY29kZWRfYm9keV9zaXplXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNvbXByZXNzSFRUUChodHRwKSB7XG4gIHZhciBjb21wcmVzc2VkID0ge307XG4gIHZhciBtZXRob2QgPSBodHRwLm1ldGhvZCxcbiAgICAgIHN0YXR1c19jb2RlID0gaHR0cC5zdGF0dXNfY29kZSxcbiAgICAgIHVybCA9IGh0dHAudXJsLFxuICAgICAgcmVzcG9uc2UgPSBodHRwLnJlc3BvbnNlO1xuICBjb21wcmVzc2VkLnVybCA9IHVybDtcblxuICBpZiAobWV0aG9kKSB7XG4gICAgY29tcHJlc3NlZC5tdCA9IG1ldGhvZDtcbiAgfVxuXG4gIGlmIChzdGF0dXNfY29kZSkge1xuICAgIGNvbXByZXNzZWQuc2MgPSBzdGF0dXNfY29kZTtcbiAgfVxuXG4gIGlmIChyZXNwb25zZSkge1xuICAgIGNvbXByZXNzZWQuciA9IGNvbXByZXNzUmVzcG9uc2UocmVzcG9uc2UpO1xuICB9XG5cbiAgcmV0dXJuIGNvbXByZXNzZWQ7XG59XG5cbmZ1bmN0aW9uIGNvbXByZXNzQ29udGV4dChjb250ZXh0KSB7XG4gIGlmICghY29udGV4dCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIGNvbXByZXNzZWQgPSB7fTtcbiAgdmFyIHBhZ2UgPSBjb250ZXh0LnBhZ2UsXG4gICAgICBodHRwID0gY29udGV4dC5odHRwLFxuICAgICAgcmVzcG9uc2UgPSBjb250ZXh0LnJlc3BvbnNlLFxuICAgICAgZGVzdGluYXRpb24gPSBjb250ZXh0LmRlc3RpbmF0aW9uLFxuICAgICAgdXNlciA9IGNvbnRleHQudXNlcixcbiAgICAgIGN1c3RvbSA9IGNvbnRleHQuY3VzdG9tO1xuXG4gIGlmIChwYWdlKSB7XG4gICAgY29tcHJlc3NlZC5wID0ge1xuICAgICAgcmY6IHBhZ2UucmVmZXJlcixcbiAgICAgIHVybDogcGFnZS51cmxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGh0dHApIHtcbiAgICBjb21wcmVzc2VkLmggPSBjb21wcmVzc0hUVFAoaHR0cCk7XG4gIH1cblxuICBpZiAocmVzcG9uc2UpIHtcbiAgICBjb21wcmVzc2VkLnIgPSBjb21wcmVzc1Jlc3BvbnNlKHJlc3BvbnNlKTtcbiAgfVxuXG4gIGlmIChkZXN0aW5hdGlvbikge1xuICAgIHZhciBzZXJ2aWNlID0gZGVzdGluYXRpb24uc2VydmljZTtcbiAgICBjb21wcmVzc2VkLmR0ID0ge1xuICAgICAgc2U6IHtcbiAgICAgICAgbjogc2VydmljZS5uYW1lLFxuICAgICAgICB0OiBzZXJ2aWNlLnR5cGUsXG4gICAgICAgIHJjOiBzZXJ2aWNlLnJlc291cmNlXG4gICAgICB9LFxuICAgICAgYWQ6IGRlc3RpbmF0aW9uLmFkZHJlc3MsXG4gICAgICBwbzogZGVzdGluYXRpb24ucG9ydFxuICAgIH07XG4gIH1cblxuICBpZiAodXNlcikge1xuICAgIGNvbXByZXNzZWQudSA9IHtcbiAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgdW46IHVzZXIudXNlcm5hbWUsXG4gICAgICBlbTogdXNlci5lbWFpbFxuICAgIH07XG4gIH1cblxuICBpZiAoY3VzdG9tKSB7XG4gICAgY29tcHJlc3NlZC5jdSA9IGN1c3RvbTtcbiAgfVxuXG4gIHJldHVybiBjb21wcmVzc2VkO1xufVxuXG5mdW5jdGlvbiBjb21wcmVzc01hcmtzKG1hcmtzKSB7XG4gIGlmICghbWFya3MpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBjb21wcmVzc2VkTnRNYXJrcyA9IGNvbXByZXNzTmF2aWdhdGlvblRpbWluZ01hcmtzKG1hcmtzLm5hdmlnYXRpb25UaW1pbmcpO1xuICB2YXIgY29tcHJlc3NlZCA9IHtcbiAgICBudDogY29tcHJlc3NlZE50TWFya3MsXG4gICAgYTogY29tcHJlc3NBZ2VudE1hcmtzKGNvbXByZXNzZWROdE1hcmtzLCBtYXJrcy5hZ2VudClcbiAgfTtcbiAgcmV0dXJuIGNvbXByZXNzZWQ7XG59XG5cbmZ1bmN0aW9uIGNvbXByZXNzTmF2aWdhdGlvblRpbWluZ01hcmtzKG50TWFya3MpIHtcbiAgaWYgKCFudE1hcmtzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgY29tcHJlc3NlZCA9IHt9O1xuICBDT01QUkVTU0VEX05BVl9USU1JTkdfTUFSS1MuZm9yRWFjaChmdW5jdGlvbiAobWFyaywgaW5kZXgpIHtcbiAgICB2YXIgbWFwcGluZyA9IE5BVklHQVRJT05fVElNSU5HX01BUktTW2luZGV4XTtcbiAgICBjb21wcmVzc2VkW21hcmtdID0gbnRNYXJrc1ttYXBwaW5nXTtcbiAgfSk7XG4gIHJldHVybiBjb21wcmVzc2VkO1xufVxuXG5mdW5jdGlvbiBjb21wcmVzc0FnZW50TWFya3MoY29tcHJlc3NlZE50TWFya3MsIGFnZW50TWFya3MpIHtcbiAgdmFyIGNvbXByZXNzZWQgPSB7fTtcblxuICBpZiAoY29tcHJlc3NlZE50TWFya3MpIHtcbiAgICBjb21wcmVzc2VkID0ge1xuICAgICAgZmI6IGNvbXByZXNzZWROdE1hcmtzLnJzLFxuICAgICAgZGk6IGNvbXByZXNzZWROdE1hcmtzLmRpLFxuICAgICAgZGM6IGNvbXByZXNzZWROdE1hcmtzLmRjXG4gICAgfTtcbiAgfVxuXG4gIGlmIChhZ2VudE1hcmtzKSB7XG4gICAgdmFyIGZwID0gYWdlbnRNYXJrcy5maXJzdENvbnRlbnRmdWxQYWludDtcbiAgICB2YXIgbHAgPSBhZ2VudE1hcmtzLmxhcmdlc3RDb250ZW50ZnVsUGFpbnQ7XG5cbiAgICBpZiAoZnApIHtcbiAgICAgIGNvbXByZXNzZWQuZnAgPSBmcDtcbiAgICB9XG5cbiAgICBpZiAobHApIHtcbiAgICAgIGNvbXByZXNzZWQubHAgPSBscDtcbiAgICB9XG4gIH1cblxuICBpZiAoT2JqZWN0LmtleXMoY29tcHJlc3NlZCkubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gY29tcHJlc3NlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXByZXNzTWV0YWRhdGEobWV0YWRhdGEpIHtcbiAgdmFyIHNlcnZpY2UgPSBtZXRhZGF0YS5zZXJ2aWNlLFxuICAgICAgbGFiZWxzID0gbWV0YWRhdGEubGFiZWxzO1xuICB2YXIgYWdlbnQgPSBzZXJ2aWNlLmFnZW50LFxuICAgICAgbGFuZ3VhZ2UgPSBzZXJ2aWNlLmxhbmd1YWdlO1xuICByZXR1cm4ge1xuICAgIHNlOiB7XG4gICAgICBuOiBzZXJ2aWNlLm5hbWUsXG4gICAgICB2ZTogc2VydmljZS52ZXJzaW9uLFxuICAgICAgYToge1xuICAgICAgICBuOiBhZ2VudC5uYW1lLFxuICAgICAgICB2ZTogYWdlbnQudmVyc2lvblxuICAgICAgfSxcbiAgICAgIGxhOiB7XG4gICAgICAgIG46IGxhbmd1YWdlLm5hbWVcbiAgICAgIH0sXG4gICAgICBlbjogc2VydmljZS5lbnZpcm9ubWVudFxuICAgIH0sXG4gICAgbDogbGFiZWxzXG4gIH07XG59XG5leHBvcnQgZnVuY3Rpb24gY29tcHJlc3NUcmFuc2FjdGlvbih0cmFuc2FjdGlvbikge1xuICB2YXIgc3BhbnMgPSB0cmFuc2FjdGlvbi5zcGFucy5tYXAoZnVuY3Rpb24gKHNwYW4pIHtcbiAgICB2YXIgc3BhbkRhdGEgPSB7XG4gICAgICBpZDogc3Bhbi5pZCxcbiAgICAgIG46IHNwYW4ubmFtZSxcbiAgICAgIHQ6IHNwYW4udHlwZSxcbiAgICAgIHM6IHNwYW4uc3RhcnQsXG4gICAgICBkOiBzcGFuLmR1cmF0aW9uLFxuICAgICAgYzogY29tcHJlc3NDb250ZXh0KHNwYW4uY29udGV4dCksXG4gICAgICBvOiBzcGFuLm91dGNvbWUsXG4gICAgICBzcjogc3Bhbi5zYW1wbGVfcmF0ZVxuICAgIH07XG5cbiAgICBpZiAoc3Bhbi5wYXJlbnRfaWQgIT09IHRyYW5zYWN0aW9uLmlkKSB7XG4gICAgICBzcGFuRGF0YS5waWQgPSBzcGFuLnBhcmVudF9pZDtcbiAgICB9XG5cbiAgICBpZiAoc3Bhbi5zeW5jID09PSB0cnVlKSB7XG4gICAgICBzcGFuRGF0YS5zeSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHNwYW4uc3VidHlwZSkge1xuICAgICAgc3BhbkRhdGEuc3UgPSBzcGFuLnN1YnR5cGU7XG4gICAgfVxuXG4gICAgaWYgKHNwYW4uYWN0aW9uKSB7XG4gICAgICBzcGFuRGF0YS5hYyA9IHNwYW4uYWN0aW9uO1xuICAgIH1cblxuICAgIHJldHVybiBzcGFuRGF0YTtcbiAgfSk7XG4gIHZhciB0ciA9IHtcbiAgICBpZDogdHJhbnNhY3Rpb24uaWQsXG4gICAgdGlkOiB0cmFuc2FjdGlvbi50cmFjZV9pZCxcbiAgICBuOiB0cmFuc2FjdGlvbi5uYW1lLFxuICAgIHQ6IHRyYW5zYWN0aW9uLnR5cGUsXG4gICAgZDogdHJhbnNhY3Rpb24uZHVyYXRpb24sXG4gICAgYzogY29tcHJlc3NDb250ZXh0KHRyYW5zYWN0aW9uLmNvbnRleHQpLFxuICAgIGs6IGNvbXByZXNzTWFya3ModHJhbnNhY3Rpb24ubWFya3MpLFxuICAgIG1lOiBjb21wcmVzc01ldHJpY3NldHModHJhbnNhY3Rpb24uYnJlYWtkb3duKSxcbiAgICB5OiBzcGFucyxcbiAgICB5Yzoge1xuICAgICAgc2Q6IHNwYW5zLmxlbmd0aFxuICAgIH0sXG4gICAgc206IHRyYW5zYWN0aW9uLnNhbXBsZWQsXG4gICAgc3I6IHRyYW5zYWN0aW9uLnNhbXBsZV9yYXRlLFxuICAgIG86IHRyYW5zYWN0aW9uLm91dGNvbWVcbiAgfTtcblxuICBpZiAodHJhbnNhY3Rpb24uZXhwZXJpZW5jZSkge1xuICAgIHZhciBfdHJhbnNhY3Rpb24kZXhwZXJpZW4gPSB0cmFuc2FjdGlvbi5leHBlcmllbmNlLFxuICAgICAgICBjbHMgPSBfdHJhbnNhY3Rpb24kZXhwZXJpZW4uY2xzLFxuICAgICAgICBmaWQgPSBfdHJhbnNhY3Rpb24kZXhwZXJpZW4uZmlkLFxuICAgICAgICB0YnQgPSBfdHJhbnNhY3Rpb24kZXhwZXJpZW4udGJ0LFxuICAgICAgICBsb25ndGFzayA9IF90cmFuc2FjdGlvbiRleHBlcmllbi5sb25ndGFzaztcbiAgICB0ci5leHAgPSB7XG4gICAgICBjbHM6IGNscyxcbiAgICAgIGZpZDogZmlkLFxuICAgICAgdGJ0OiB0YnQsXG4gICAgICBsdDogbG9uZ3Rhc2tcbiAgICB9O1xuICB9XG5cbiAgaWYgKHRyYW5zYWN0aW9uLnNlc3Npb24pIHtcbiAgICB2YXIgX3RyYW5zYWN0aW9uJHNlc3Npb24gPSB0cmFuc2FjdGlvbi5zZXNzaW9uLFxuICAgICAgICBpZCA9IF90cmFuc2FjdGlvbiRzZXNzaW9uLmlkLFxuICAgICAgICBzZXF1ZW5jZSA9IF90cmFuc2FjdGlvbiRzZXNzaW9uLnNlcXVlbmNlO1xuICAgIHRyLnNlcyA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHNlcTogc2VxdWVuY2VcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHRyO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNvbXByZXNzRXJyb3IoZXJyb3IpIHtcbiAgdmFyIGV4Y2VwdGlvbiA9IGVycm9yLmV4Y2VwdGlvbjtcbiAgdmFyIGNvbXByZXNzZWQgPSB7XG4gICAgaWQ6IGVycm9yLmlkLFxuICAgIGNsOiBlcnJvci5jdWxwcml0LFxuICAgIGV4OiB7XG4gICAgICBtZzogZXhjZXB0aW9uLm1lc3NhZ2UsXG4gICAgICBzdDogY29tcHJlc3NTdGFja0ZyYW1lcyhleGNlcHRpb24uc3RhY2t0cmFjZSksXG4gICAgICB0OiBlcnJvci50eXBlXG4gICAgfSxcbiAgICBjOiBjb21wcmVzc0NvbnRleHQoZXJyb3IuY29udGV4dClcbiAgfTtcbiAgdmFyIHRyYW5zYWN0aW9uID0gZXJyb3IudHJhbnNhY3Rpb247XG5cbiAgaWYgKHRyYW5zYWN0aW9uKSB7XG4gICAgY29tcHJlc3NlZC50aWQgPSBlcnJvci50cmFjZV9pZDtcbiAgICBjb21wcmVzc2VkLnBpZCA9IGVycm9yLnBhcmVudF9pZDtcbiAgICBjb21wcmVzc2VkLnhpZCA9IGVycm9yLnRyYW5zYWN0aW9uX2lkO1xuICAgIGNvbXByZXNzZWQueCA9IHtcbiAgICAgIHQ6IHRyYW5zYWN0aW9uLnR5cGUsXG4gICAgICBzbTogdHJhbnNhY3Rpb24uc2FtcGxlZFxuICAgIH07XG4gIH1cblxuICByZXR1cm4gY29tcHJlc3NlZDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb21wcmVzc01ldHJpY3NldHMoYnJlYWtkb3ducykge1xuICByZXR1cm4gYnJlYWtkb3ducy5tYXAoZnVuY3Rpb24gKF9yZWYpIHtcbiAgICB2YXIgc3BhbiA9IF9yZWYuc3BhbixcbiAgICAgICAgc2FtcGxlcyA9IF9yZWYuc2FtcGxlcztcbiAgICByZXR1cm4ge1xuICAgICAgeToge1xuICAgICAgICB0OiBzcGFuLnR5cGVcbiAgICAgIH0sXG4gICAgICBzYToge1xuICAgICAgICB5c2M6IHtcbiAgICAgICAgICB2OiBzYW1wbGVzWydzcGFuLnNlbGZfdGltZS5jb3VudCddLnZhbHVlXG4gICAgICAgIH0sXG4gICAgICAgIHlzczoge1xuICAgICAgICAgIHY6IHNhbXBsZXNbJ3NwYW4uc2VsZl90aW1lLnN1bS51cyddLnZhbHVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb21wcmVzc1BheWxvYWQocGFyYW1zLCB0eXBlKSB7XG4gIGlmICh0eXBlID09PSB2b2lkIDApIHtcbiAgICB0eXBlID0gJ2d6aXAnO1xuICB9XG5cbiAgdmFyIGlzQ29tcHJlc3Npb25TdHJlYW1TdXBwb3J0ZWQgPSB0eXBlb2YgQ29tcHJlc3Npb25TdHJlYW0gPT09ICdmdW5jdGlvbic7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgIGlmICghaXNDb21wcmVzc2lvblN0cmVhbVN1cHBvcnRlZCkge1xuICAgICAgcmV0dXJuIHJlc29sdmUocGFyYW1zKTtcbiAgICB9XG5cbiAgICBpZiAoaXNCZWFjb25JbnNwZWN0aW9uRW5hYmxlZCgpKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZShwYXJhbXMpO1xuICAgIH1cblxuICAgIHZhciBwYXlsb2FkID0gcGFyYW1zLnBheWxvYWQsXG4gICAgICAgIGhlYWRlcnMgPSBwYXJhbXMuaGVhZGVycyxcbiAgICAgICAgYmVmb3JlU2VuZCA9IHBhcmFtcy5iZWZvcmVTZW5kO1xuICAgIHZhciBwYXlsb2FkU3RyZWFtID0gbmV3IEJsb2IoW3BheWxvYWRdKS5zdHJlYW0oKTtcbiAgICB2YXIgY29tcHJlc3NlZFN0cmVhbSA9IHBheWxvYWRTdHJlYW0ucGlwZVRocm91Z2gobmV3IENvbXByZXNzaW9uU3RyZWFtKHR5cGUpKTtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKGNvbXByZXNzZWRTdHJlYW0pLmJsb2IoKS50aGVuKGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICBoZWFkZXJzWydDb250ZW50LUVuY29kaW5nJ10gPSB0eXBlO1xuICAgICAgcmV0dXJuIHJlc29sdmUoe1xuICAgICAgICBwYXlsb2FkOiBwYXlsb2FkLFxuICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICBiZWZvcmVTZW5kOiBiZWZvcmVTZW5kXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59IiwiZnVuY3Rpb24gX2V4dGVuZHMoKSB7IF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTsgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH1cblxuaW1wb3J0IHsgZ2V0Q3VycmVudFNjcmlwdCwgc2V0TGFiZWwsIG1lcmdlLCBleHRlbmQsIGlzVW5kZWZpbmVkIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gJy4vZXZlbnQtaGFuZGxlcic7XG5pbXBvcnQgeyBDT05GSUdfQ0hBTkdFLCBMT0NBTF9DT05GSUdfS0VZIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5mdW5jdGlvbiBnZXRDb25maWdGcm9tU2NyaXB0KCkge1xuICB2YXIgc2NyaXB0ID0gZ2V0Q3VycmVudFNjcmlwdCgpO1xuICB2YXIgY29uZmlnID0gZ2V0RGF0YUF0dHJpYnV0ZXNGcm9tTm9kZShzY3JpcHQpO1xuICByZXR1cm4gY29uZmlnO1xufVxuXG5mdW5jdGlvbiBnZXREYXRhQXR0cmlidXRlc0Zyb21Ob2RlKG5vZGUpIHtcbiAgaWYgKCFub2RlKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgdmFyIGRhdGFBdHRycyA9IHt9O1xuICB2YXIgZGF0YVJlZ2V4ID0gL15kYXRhLShbXFx3LV0rKSQvO1xuICB2YXIgYXR0cnMgPSBub2RlLmF0dHJpYnV0ZXM7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdHRycy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBhdHRyID0gYXR0cnNbaV07XG5cbiAgICBpZiAoZGF0YVJlZ2V4LnRlc3QoYXR0ci5ub2RlTmFtZSkpIHtcbiAgICAgIHZhciBrZXkgPSBhdHRyLm5vZGVOYW1lLm1hdGNoKGRhdGFSZWdleClbMV07XG4gICAgICB2YXIgY2FtZWxDYXNlZGtleSA9IGtleS5zcGxpdCgnLScpLm1hcChmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBpbmRleCA+IDAgPyB2YWx1ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHZhbHVlLnN1YnN0cmluZygxKSA6IHZhbHVlO1xuICAgICAgfSkuam9pbignJyk7XG4gICAgICBkYXRhQXR0cnNbY2FtZWxDYXNlZGtleV0gPSBhdHRyLnZhbHVlIHx8IGF0dHIubm9kZVZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkYXRhQXR0cnM7XG59XG5cbnZhciBDb25maWcgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIENvbmZpZygpIHtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIHNlcnZpY2VOYW1lOiAnJyxcbiAgICAgIHNlcnZpY2VWZXJzaW9uOiAnJyxcbiAgICAgIGVudmlyb25tZW50OiAnJyxcbiAgICAgIHNlcnZlclVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODIwMCcsXG4gICAgICBzZXJ2ZXJVcmxQcmVmaXg6ICcnLFxuICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgaW5zdHJ1bWVudDogdHJ1ZSxcbiAgICAgIGRpc2FibGVJbnN0cnVtZW50YXRpb25zOiBbXSxcbiAgICAgIGxvZ0xldmVsOiAnd2FybicsXG4gICAgICBicmVha2Rvd25NZXRyaWNzOiBmYWxzZSxcbiAgICAgIGlnbm9yZVRyYW5zYWN0aW9uczogW10sXG4gICAgICBldmVudHNMaW1pdDogODAsXG4gICAgICBxdWV1ZUxpbWl0OiAtMSxcbiAgICAgIGZsdXNoSW50ZXJ2YWw6IDUwMCxcbiAgICAgIGRpc3RyaWJ1dGVkVHJhY2luZzogdHJ1ZSxcbiAgICAgIGRpc3RyaWJ1dGVkVHJhY2luZ09yaWdpbnM6IFtdLFxuICAgICAgZGlzdHJpYnV0ZWRUcmFjaW5nSGVhZGVyTmFtZTogJ3RyYWNlcGFyZW50JyxcbiAgICAgIHBhZ2VMb2FkVHJhY2VJZDogJycsXG4gICAgICBwYWdlTG9hZFNwYW5JZDogJycsXG4gICAgICBwYWdlTG9hZFNhbXBsZWQ6IGZhbHNlLFxuICAgICAgcGFnZUxvYWRUcmFuc2FjdGlvbk5hbWU6ICcnLFxuICAgICAgcHJvcGFnYXRlVHJhY2VzdGF0ZTogZmFsc2UsXG4gICAgICB0cmFuc2FjdGlvblNhbXBsZVJhdGU6IDEuMCxcbiAgICAgIGNlbnRyYWxDb25maWc6IGZhbHNlLFxuICAgICAgbW9uaXRvckxvbmd0YXNrczogdHJ1ZSxcbiAgICAgIGFwaVZlcnNpb246IDIsXG4gICAgICBjb250ZXh0OiB7fSxcbiAgICAgIHNlc3Npb246IGZhbHNlLFxuICAgICAgYXBtUmVxdWVzdDogbnVsbCxcbiAgICAgIHNlbmRDcmVkZW50aWFsczogZmFsc2VcbiAgICB9O1xuICAgIHRoaXMuZXZlbnRzID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuICAgIHRoaXMuZmlsdGVycyA9IFtdO1xuICAgIHRoaXMudmVyc2lvbiA9ICcnO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IENvbmZpZy5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLmluaXQgPSBmdW5jdGlvbiBpbml0KCkge1xuICAgIHZhciBzY3JpcHREYXRhID0gZ2V0Q29uZmlnRnJvbVNjcmlwdCgpO1xuICAgIHRoaXMuc2V0Q29uZmlnKHNjcmlwdERhdGEpO1xuICB9O1xuXG4gIF9wcm90by5zZXRWZXJzaW9uID0gZnVuY3Rpb24gc2V0VmVyc2lvbih2ZXJzaW9uKSB7XG4gICAgdGhpcy52ZXJzaW9uID0gdmVyc2lvbjtcbiAgfTtcblxuICBfcHJvdG8uYWRkRmlsdGVyID0gZnVuY3Rpb24gYWRkRmlsdGVyKGNiKSB7XG4gICAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBcmd1bWVudCB0byBtdXN0IGJlIGZ1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgdGhpcy5maWx0ZXJzLnB1c2goY2IpO1xuICB9O1xuXG4gIF9wcm90by5hcHBseUZpbHRlcnMgPSBmdW5jdGlvbiBhcHBseUZpbHRlcnMoZGF0YSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5maWx0ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBkYXRhID0gdGhpcy5maWx0ZXJzW2ldKGRhdGEpO1xuXG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIF9wcm90by5nZXQgPSBmdW5jdGlvbiBnZXQoa2V5KSB7XG4gICAgcmV0dXJuIGtleS5zcGxpdCgnLicpLnJlZHVjZShmdW5jdGlvbiAob2JqLCBvYmpLZXkpIHtcbiAgICAgIHJldHVybiBvYmogJiYgb2JqW29iaktleV07XG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9O1xuXG4gIF9wcm90by5zZXRVc2VyQ29udGV4dCA9IGZ1bmN0aW9uIHNldFVzZXJDb250ZXh0KHVzZXJDb250ZXh0KSB7XG4gICAgaWYgKHVzZXJDb250ZXh0ID09PSB2b2lkIDApIHtcbiAgICAgIHVzZXJDb250ZXh0ID0ge307XG4gICAgfVxuXG4gICAgdmFyIGNvbnRleHQgPSB7fTtcbiAgICB2YXIgX3VzZXJDb250ZXh0ID0gdXNlckNvbnRleHQsXG4gICAgICAgIGlkID0gX3VzZXJDb250ZXh0LmlkLFxuICAgICAgICB1c2VybmFtZSA9IF91c2VyQ29udGV4dC51c2VybmFtZSxcbiAgICAgICAgZW1haWwgPSBfdXNlckNvbnRleHQuZW1haWw7XG5cbiAgICBpZiAodHlwZW9mIGlkID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgaWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb250ZXh0LmlkID0gaWQ7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB1c2VybmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnRleHQudXNlcm5hbWUgPSB1c2VybmFtZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGVtYWlsID09PSAnc3RyaW5nJykge1xuICAgICAgY29udGV4dC5lbWFpbCA9IGVtYWlsO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnLmNvbnRleHQudXNlciA9IGV4dGVuZCh0aGlzLmNvbmZpZy5jb250ZXh0LnVzZXIgfHwge30sIGNvbnRleHQpO1xuICB9O1xuXG4gIF9wcm90by5zZXRDdXN0b21Db250ZXh0ID0gZnVuY3Rpb24gc2V0Q3VzdG9tQ29udGV4dChjdXN0b21Db250ZXh0KSB7XG4gICAgaWYgKGN1c3RvbUNvbnRleHQgPT09IHZvaWQgMCkge1xuICAgICAgY3VzdG9tQ29udGV4dCA9IHt9O1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnLmNvbnRleHQuY3VzdG9tID0gZXh0ZW5kKHRoaXMuY29uZmlnLmNvbnRleHQuY3VzdG9tIHx8IHt9LCBjdXN0b21Db250ZXh0KTtcbiAgfTtcblxuICBfcHJvdG8uYWRkTGFiZWxzID0gZnVuY3Rpb24gYWRkTGFiZWxzKHRhZ3MpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5jb250ZXh0LnRhZ3MpIHtcbiAgICAgIHRoaXMuY29uZmlnLmNvbnRleHQudGFncyA9IHt9O1xuICAgIH1cblxuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModGFncyk7XG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICByZXR1cm4gc2V0TGFiZWwoaywgdGFnc1trXSwgX3RoaXMuY29uZmlnLmNvbnRleHQudGFncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLnNldENvbmZpZyA9IGZ1bmN0aW9uIHNldENvbmZpZyhwcm9wZXJ0aWVzKSB7XG4gICAgaWYgKHByb3BlcnRpZXMgPT09IHZvaWQgMCkge1xuICAgICAgcHJvcGVydGllcyA9IHt9O1xuICAgIH1cblxuICAgIHZhciBfcHJvcGVydGllcyA9IHByb3BlcnRpZXMsXG4gICAgICAgIHRyYW5zYWN0aW9uU2FtcGxlUmF0ZSA9IF9wcm9wZXJ0aWVzLnRyYW5zYWN0aW9uU2FtcGxlUmF0ZSxcbiAgICAgICAgc2VydmVyVXJsID0gX3Byb3BlcnRpZXMuc2VydmVyVXJsO1xuXG4gICAgaWYgKHNlcnZlclVybCkge1xuICAgICAgcHJvcGVydGllcy5zZXJ2ZXJVcmwgPSBzZXJ2ZXJVcmwucmVwbGFjZSgvXFwvKyQvLCAnJyk7XG4gICAgfVxuXG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0cmFuc2FjdGlvblNhbXBsZVJhdGUpKSB7XG4gICAgICBpZiAodHJhbnNhY3Rpb25TYW1wbGVSYXRlIDwgMC4wMDAxICYmIHRyYW5zYWN0aW9uU2FtcGxlUmF0ZSA+IDApIHtcbiAgICAgICAgdHJhbnNhY3Rpb25TYW1wbGVSYXRlID0gMC4wMDAxO1xuICAgICAgfVxuXG4gICAgICBwcm9wZXJ0aWVzLnRyYW5zYWN0aW9uU2FtcGxlUmF0ZSA9IE1hdGgucm91bmQodHJhbnNhY3Rpb25TYW1wbGVSYXRlICogMTAwMDApIC8gMTAwMDA7XG4gICAgfVxuXG4gICAgbWVyZ2UodGhpcy5jb25maWcsIHByb3BlcnRpZXMpO1xuICAgIHRoaXMuZXZlbnRzLnNlbmQoQ09ORklHX0NIQU5HRSwgW3RoaXMuY29uZmlnXSk7XG4gIH07XG5cbiAgX3Byb3RvLnZhbGlkYXRlID0gZnVuY3Rpb24gdmFsaWRhdGUocHJvcGVydGllcykge1xuICAgIGlmIChwcm9wZXJ0aWVzID09PSB2b2lkIDApIHtcbiAgICAgIHByb3BlcnRpZXMgPSB7fTtcbiAgICB9XG5cbiAgICB2YXIgcmVxdWlyZWRLZXlzID0gWydzZXJ2aWNlTmFtZScsICdzZXJ2ZXJVcmwnXTtcbiAgICB2YXIgYWxsS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY29uZmlnKTtcbiAgICB2YXIgZXJyb3JzID0ge1xuICAgICAgbWlzc2luZzogW10sXG4gICAgICBpbnZhbGlkOiBbXSxcbiAgICAgIHVua25vd246IFtdXG4gICAgfTtcbiAgICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIGlmIChyZXF1aXJlZEtleXMuaW5kZXhPZihrZXkpICE9PSAtMSAmJiAhcHJvcGVydGllc1trZXldKSB7XG4gICAgICAgIGVycm9ycy5taXNzaW5nLnB1c2goa2V5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGFsbEtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgICBlcnJvcnMudW5rbm93bi5wdXNoKGtleSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocHJvcGVydGllcy5zZXJ2aWNlTmFtZSAmJiAhL15bYS16QS1aMC05IF8tXSskLy50ZXN0KHByb3BlcnRpZXMuc2VydmljZU5hbWUpKSB7XG4gICAgICBlcnJvcnMuaW52YWxpZC5wdXNoKHtcbiAgICAgICAga2V5OiAnc2VydmljZU5hbWUnLFxuICAgICAgICB2YWx1ZTogcHJvcGVydGllcy5zZXJ2aWNlTmFtZSxcbiAgICAgICAgYWxsb3dlZDogJ2EteiwgQS1aLCAwLTksIF8sIC0sIDxzcGFjZT4nXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgc2FtcGxlUmF0ZSA9IHByb3BlcnRpZXMudHJhbnNhY3Rpb25TYW1wbGVSYXRlO1xuXG4gICAgaWYgKHR5cGVvZiBzYW1wbGVSYXRlICE9PSAndW5kZWZpbmVkJyAmJiAodHlwZW9mIHNhbXBsZVJhdGUgIT09ICdudW1iZXInIHx8IGlzTmFOKHNhbXBsZVJhdGUpIHx8IHNhbXBsZVJhdGUgPCAwIHx8IHNhbXBsZVJhdGUgPiAxKSkge1xuICAgICAgZXJyb3JzLmludmFsaWQucHVzaCh7XG4gICAgICAgIGtleTogJ3RyYW5zYWN0aW9uU2FtcGxlUmF0ZScsXG4gICAgICAgIHZhbHVlOiBzYW1wbGVSYXRlLFxuICAgICAgICBhbGxvd2VkOiAnTnVtYmVyIGJldHdlZW4gMCBhbmQgMSdcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBlcnJvcnM7XG4gIH07XG5cbiAgX3Byb3RvLmdldExvY2FsQ29uZmlnID0gZnVuY3Rpb24gZ2V0TG9jYWxDb25maWcoKSB7XG4gICAgdmFyIHN0b3JhZ2UgPSBzZXNzaW9uU3RvcmFnZTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5zZXNzaW9uKSB7XG4gICAgICBzdG9yYWdlID0gbG9jYWxTdG9yYWdlO1xuICAgIH1cblxuICAgIHZhciBjb25maWcgPSBzdG9yYWdlLmdldEl0ZW0oTE9DQUxfQ09ORklHX0tFWSk7XG5cbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShjb25maWcpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uc2V0TG9jYWxDb25maWcgPSBmdW5jdGlvbiBzZXRMb2NhbENvbmZpZyhjb25maWcsIG1lcmdlKSB7XG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgaWYgKG1lcmdlKSB7XG4gICAgICAgIHZhciBwcmV2Q29uZmlnID0gdGhpcy5nZXRMb2NhbENvbmZpZygpO1xuICAgICAgICBjb25maWcgPSBfZXh0ZW5kcyh7fSwgcHJldkNvbmZpZywgY29uZmlnKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHN0b3JhZ2UgPSBzZXNzaW9uU3RvcmFnZTtcblxuICAgICAgaWYgKHRoaXMuY29uZmlnLnNlc3Npb24pIHtcbiAgICAgICAgc3RvcmFnZSA9IGxvY2FsU3RvcmFnZTtcbiAgICAgIH1cblxuICAgICAgc3RvcmFnZS5zZXRJdGVtKExPQ0FMX0NPTkZJR19LRVksIEpTT04uc3RyaW5naWZ5KGNvbmZpZykpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQobmFtZSwgYXJncykge1xuICAgIHRoaXMuZXZlbnRzLnNlbmQobmFtZSwgYXJncyk7XG4gIH07XG5cbiAgX3Byb3RvLm9ic2VydmVFdmVudCA9IGZ1bmN0aW9uIG9ic2VydmVFdmVudChuYW1lLCBmbikge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5vYnNlcnZlKG5hbWUsIGZuKTtcbiAgfTtcblxuICByZXR1cm4gQ29uZmlnO1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBDb25maWc7IiwidmFyIFNDSEVEVUxFID0gJ3NjaGVkdWxlJztcbnZhciBJTlZPS0UgPSAnaW52b2tlJztcbnZhciBBRERfRVZFTlRfTElTVEVORVJfU1RSID0gJ2FkZEV2ZW50TGlzdGVuZXInO1xudmFyIFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFIgPSAncmVtb3ZlRXZlbnRMaXN0ZW5lcic7XG52YXIgUkVTT1VSQ0VfSU5JVElBVE9SX1RZUEVTID0gWydsaW5rJywgJ2NzcycsICdzY3JpcHQnLCAnaW1nJywgJ3htbGh0dHByZXF1ZXN0JywgJ2ZldGNoJywgJ2JlYWNvbicsICdpZnJhbWUnXTtcbnZhciBSRVVTQUJJTElUWV9USFJFU0hPTEQgPSA1MDAwO1xudmFyIE1BWF9TUEFOX0RVUkFUSU9OID0gNSAqIDYwICogMTAwMDtcbnZhciBQQUdFX0xPQURfREVMQVkgPSAxMDAwO1xudmFyIFBBR0VfTE9BRCA9ICdwYWdlLWxvYWQnO1xudmFyIFJPVVRFX0NIQU5HRSA9ICdyb3V0ZS1jaGFuZ2UnO1xudmFyIFRZUEVfQ1VTVE9NID0gJ2N1c3RvbSc7XG52YXIgVVNFUl9JTlRFUkFDVElPTiA9ICd1c2VyLWludGVyYWN0aW9uJztcbnZhciBIVFRQX1JFUVVFU1RfVFlQRSA9ICdodHRwLXJlcXVlc3QnO1xudmFyIFRFTVBPUkFSWV9UWVBFID0gJ3RlbXBvcmFyeSc7XG52YXIgTkFNRV9VTktOT1dOID0gJ1Vua25vd24nO1xudmFyIFRSQU5TQUNUSU9OX1RZUEVfT1JERVIgPSBbUEFHRV9MT0FELCBST1VURV9DSEFOR0UsIFVTRVJfSU5URVJBQ1RJT04sIEhUVFBfUkVRVUVTVF9UWVBFLCBUWVBFX0NVU1RPTSwgVEVNUE9SQVJZX1RZUEVdO1xudmFyIE9VVENPTUVfU1VDQ0VTUyA9ICdzdWNjZXNzJztcbnZhciBPVVRDT01FX0ZBSUxVUkUgPSAnZmFpbHVyZSc7XG52YXIgT1VUQ09NRV9VTktOT1dOID0gJ3Vua25vd24nO1xudmFyIFVTRVJfVElNSU5HX1RIUkVTSE9MRCA9IDYwO1xudmFyIFRSQU5TQUNUSU9OX1NUQVJUID0gJ3RyYW5zYWN0aW9uOnN0YXJ0JztcbnZhciBUUkFOU0FDVElPTl9FTkQgPSAndHJhbnNhY3Rpb246ZW5kJztcbnZhciBDT05GSUdfQ0hBTkdFID0gJ2NvbmZpZzpjaGFuZ2UnO1xudmFyIFFVRVVFX0ZMVVNIID0gJ3F1ZXVlOmZsdXNoJztcbnZhciBRVUVVRV9BRERfVFJBTlNBQ1RJT04gPSAncXVldWU6YWRkX3RyYW5zYWN0aW9uJztcbnZhciBYTUxIVFRQUkVRVUVTVCA9ICd4bWxodHRwcmVxdWVzdCc7XG52YXIgRkVUQ0ggPSAnZmV0Y2gnO1xudmFyIEhJU1RPUlkgPSAnaGlzdG9yeSc7XG52YXIgRVZFTlRfVEFSR0VUID0gJ2V2ZW50dGFyZ2V0JztcbnZhciBDTElDSyA9ICdjbGljayc7XG52YXIgRVJST1IgPSAnZXJyb3InO1xudmFyIEJFRk9SRV9FVkVOVCA9ICc6YmVmb3JlJztcbnZhciBBRlRFUl9FVkVOVCA9ICc6YWZ0ZXInO1xudmFyIExPQ0FMX0NPTkZJR19LRVkgPSAnZWxhc3RpY19hcG1fY29uZmlnJztcbnZhciBMT05HX1RBU0sgPSAnbG9uZ3Rhc2snO1xudmFyIFBBSU5UID0gJ3BhaW50JztcbnZhciBNRUFTVVJFID0gJ21lYXN1cmUnO1xudmFyIE5BVklHQVRJT04gPSAnbmF2aWdhdGlvbic7XG52YXIgUkVTT1VSQ0UgPSAncmVzb3VyY2UnO1xudmFyIEZJUlNUX0NPTlRFTlRGVUxfUEFJTlQgPSAnZmlyc3QtY29udGVudGZ1bC1wYWludCc7XG52YXIgTEFSR0VTVF9DT05URU5URlVMX1BBSU5UID0gJ2xhcmdlc3QtY29udGVudGZ1bC1wYWludCc7XG52YXIgRklSU1RfSU5QVVQgPSAnZmlyc3QtaW5wdXQnO1xudmFyIExBWU9VVF9TSElGVCA9ICdsYXlvdXQtc2hpZnQnO1xudmFyIEVSUk9SUyA9ICdlcnJvcnMnO1xudmFyIFRSQU5TQUNUSU9OUyA9ICd0cmFuc2FjdGlvbnMnO1xudmFyIENPTkZJR19TRVJWSUNFID0gJ0NvbmZpZ1NlcnZpY2UnO1xudmFyIExPR0dJTkdfU0VSVklDRSA9ICdMb2dnaW5nU2VydmljZSc7XG52YXIgVFJBTlNBQ1RJT05fU0VSVklDRSA9ICdUcmFuc2FjdGlvblNlcnZpY2UnO1xudmFyIEFQTV9TRVJWRVIgPSAnQXBtU2VydmVyJztcbnZhciBQRVJGT1JNQU5DRV9NT05JVE9SSU5HID0gJ1BlcmZvcm1hbmNlTW9uaXRvcmluZyc7XG52YXIgRVJST1JfTE9HR0lORyA9ICdFcnJvckxvZ2dpbmcnO1xudmFyIFRSVU5DQVRFRF9UWVBFID0gJy50cnVuY2F0ZWQnO1xudmFyIEtFWVdPUkRfTElNSVQgPSAxMDI0O1xudmFyIFNFU1NJT05fVElNRU9VVCA9IDMwICogNjAwMDA7XG52YXIgSFRUUF9SRVFVRVNUX1RJTUVPVVQgPSAxMDAwMDtcbmV4cG9ydCB7IFNDSEVEVUxFLCBJTlZPS0UsIEFERF9FVkVOVF9MSVNURU5FUl9TVFIsIFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFIsIFJFU09VUkNFX0lOSVRJQVRPUl9UWVBFUywgUkVVU0FCSUxJVFlfVEhSRVNIT0xELCBNQVhfU1BBTl9EVVJBVElPTiwgUEFHRV9MT0FEX0RFTEFZLCBQQUdFX0xPQUQsIFJPVVRFX0NIQU5HRSwgTkFNRV9VTktOT1dOLCBUWVBFX0NVU1RPTSwgVVNFUl9USU1JTkdfVEhSRVNIT0xELCBUUkFOU0FDVElPTl9TVEFSVCwgVFJBTlNBQ1RJT05fRU5ELCBDT05GSUdfQ0hBTkdFLCBRVUVVRV9GTFVTSCwgUVVFVUVfQUREX1RSQU5TQUNUSU9OLCBYTUxIVFRQUkVRVUVTVCwgRkVUQ0gsIEhJU1RPUlksIEVWRU5UX1RBUkdFVCwgQ0xJQ0ssIEVSUk9SLCBCRUZPUkVfRVZFTlQsIEFGVEVSX0VWRU5ULCBMT0NBTF9DT05GSUdfS0VZLCBIVFRQX1JFUVVFU1RfVFlQRSwgTE9OR19UQVNLLCBQQUlOVCwgTUVBU1VSRSwgTkFWSUdBVElPTiwgUkVTT1VSQ0UsIEZJUlNUX0NPTlRFTlRGVUxfUEFJTlQsIExBUkdFU1RfQ09OVEVOVEZVTF9QQUlOVCwgS0VZV09SRF9MSU1JVCwgVEVNUE9SQVJZX1RZUEUsIFVTRVJfSU5URVJBQ1RJT04sIFRSQU5TQUNUSU9OX1RZUEVfT1JERVIsIEVSUk9SUywgVFJBTlNBQ1RJT05TLCBDT05GSUdfU0VSVklDRSwgTE9HR0lOR19TRVJWSUNFLCBUUkFOU0FDVElPTl9TRVJWSUNFLCBBUE1fU0VSVkVSLCBQRVJGT1JNQU5DRV9NT05JVE9SSU5HLCBFUlJPUl9MT0dHSU5HLCBUUlVOQ0FURURfVFlQRSwgRklSU1RfSU5QVVQsIExBWU9VVF9TSElGVCwgT1VUQ09NRV9TVUNDRVNTLCBPVVRDT01FX0ZBSUxVUkUsIE9VVENPTUVfVU5LTk9XTiwgU0VTU0lPTl9USU1FT1VULCBIVFRQX1JFUVVFU1RfVElNRU9VVCB9OyIsInZhciBfZXhjbHVkZWQgPSBbXCJ0YWdzXCJdO1xuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKSB7IGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9OyB2YXIgdGFyZ2V0ID0ge307IHZhciBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTsgdmFyIGtleSwgaTsgZm9yIChpID0gMDsgaSA8IHNvdXJjZUtleXMubGVuZ3RoOyBpKyspIHsga2V5ID0gc291cmNlS2V5c1tpXTsgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbmltcG9ydCB7IFVybCB9IGZyb20gJy4vdXJsJztcbmltcG9ydCB7IFBBR0VfTE9BRCwgTkFWSUdBVElPTiB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IGdldFNlcnZlclRpbWluZ0luZm8sIFBFUkYsIGlzUGVyZlRpbWVsaW5lU3VwcG9ydGVkIH0gZnJvbSAnLi91dGlscyc7XG52YXIgTEVGVF9TUVVBUkVfQlJBQ0tFVCA9IDkxO1xudmFyIFJJR0hUX1NRVUFSRV9CUkFDS0VUID0gOTM7XG52YXIgRVhURVJOQUwgPSAnZXh0ZXJuYWwnO1xudmFyIFJFU09VUkNFID0gJ3Jlc291cmNlJztcbnZhciBIQVJEX05BVklHQVRJT04gPSAnaGFyZC1uYXZpZ2F0aW9uJztcblxuZnVuY3Rpb24gZ2V0UG9ydE51bWJlcihwb3J0LCBwcm90b2NvbCkge1xuICBpZiAocG9ydCA9PT0gJycpIHtcbiAgICBwb3J0ID0gcHJvdG9jb2wgPT09ICdodHRwOicgPyAnODAnIDogcHJvdG9jb2wgPT09ICdodHRwczonID8gJzQ0MycgOiAnJztcbiAgfVxuXG4gIHJldHVybiBwb3J0O1xufVxuXG5mdW5jdGlvbiBnZXRSZXNwb25zZUNvbnRleHQocGVyZlRpbWluZ0VudHJ5KSB7XG4gIHZhciB0cmFuc2ZlclNpemUgPSBwZXJmVGltaW5nRW50cnkudHJhbnNmZXJTaXplLFxuICAgICAgZW5jb2RlZEJvZHlTaXplID0gcGVyZlRpbWluZ0VudHJ5LmVuY29kZWRCb2R5U2l6ZSxcbiAgICAgIGRlY29kZWRCb2R5U2l6ZSA9IHBlcmZUaW1pbmdFbnRyeS5kZWNvZGVkQm9keVNpemUsXG4gICAgICBzZXJ2ZXJUaW1pbmcgPSBwZXJmVGltaW5nRW50cnkuc2VydmVyVGltaW5nO1xuICB2YXIgcmVzcENvbnRleHQgPSB7XG4gICAgdHJhbnNmZXJfc2l6ZTogdHJhbnNmZXJTaXplLFxuICAgIGVuY29kZWRfYm9keV9zaXplOiBlbmNvZGVkQm9keVNpemUsXG4gICAgZGVjb2RlZF9ib2R5X3NpemU6IGRlY29kZWRCb2R5U2l6ZVxuICB9O1xuICB2YXIgc2VydmVyVGltaW5nU3RyID0gZ2V0U2VydmVyVGltaW5nSW5mbyhzZXJ2ZXJUaW1pbmcpO1xuXG4gIGlmIChzZXJ2ZXJUaW1pbmdTdHIpIHtcbiAgICByZXNwQ29udGV4dC5oZWFkZXJzID0ge1xuICAgICAgJ3NlcnZlci10aW1pbmcnOiBzZXJ2ZXJUaW1pbmdTdHJcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHJlc3BDb250ZXh0O1xufVxuXG5mdW5jdGlvbiBnZXREZXN0aW5hdGlvbihwYXJzZWRVcmwpIHtcbiAgdmFyIHBvcnQgPSBwYXJzZWRVcmwucG9ydCxcbiAgICAgIHByb3RvY29sID0gcGFyc2VkVXJsLnByb3RvY29sLFxuICAgICAgaG9zdG5hbWUgPSBwYXJzZWRVcmwuaG9zdG5hbWU7XG4gIHZhciBwb3J0TnVtYmVyID0gZ2V0UG9ydE51bWJlcihwb3J0LCBwcm90b2NvbCk7XG4gIHZhciBpcHY2SG9zdG5hbWUgPSBob3N0bmFtZS5jaGFyQ29kZUF0KDApID09PSBMRUZUX1NRVUFSRV9CUkFDS0VUICYmIGhvc3RuYW1lLmNoYXJDb2RlQXQoaG9zdG5hbWUubGVuZ3RoIC0gMSkgPT09IFJJR0hUX1NRVUFSRV9CUkFDS0VUO1xuICB2YXIgYWRkcmVzcyA9IGhvc3RuYW1lO1xuXG4gIGlmIChpcHY2SG9zdG5hbWUpIHtcbiAgICBhZGRyZXNzID0gaG9zdG5hbWUuc2xpY2UoMSwgLTEpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzZXJ2aWNlOiB7XG4gICAgICByZXNvdXJjZTogaG9zdG5hbWUgKyAnOicgKyBwb3J0TnVtYmVyLFxuICAgICAgbmFtZTogJycsXG4gICAgICB0eXBlOiAnJ1xuICAgIH0sXG4gICAgYWRkcmVzczogYWRkcmVzcyxcbiAgICBwb3J0OiBOdW1iZXIocG9ydE51bWJlcilcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0UmVzb3VyY2VDb250ZXh0KGRhdGEpIHtcbiAgdmFyIGVudHJ5ID0gZGF0YS5lbnRyeSxcbiAgICAgIHVybCA9IGRhdGEudXJsO1xuICB2YXIgcGFyc2VkVXJsID0gbmV3IFVybCh1cmwpO1xuICB2YXIgZGVzdGluYXRpb24gPSBnZXREZXN0aW5hdGlvbihwYXJzZWRVcmwpO1xuICByZXR1cm4ge1xuICAgIGh0dHA6IHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgcmVzcG9uc2U6IGdldFJlc3BvbnNlQ29udGV4dChlbnRyeSlcbiAgICB9LFxuICAgIGRlc3RpbmF0aW9uOiBkZXN0aW5hdGlvblxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRFeHRlcm5hbENvbnRleHQoZGF0YSkge1xuICB2YXIgdXJsID0gZGF0YS51cmwsXG4gICAgICBtZXRob2QgPSBkYXRhLm1ldGhvZCxcbiAgICAgIHRhcmdldCA9IGRhdGEudGFyZ2V0LFxuICAgICAgcmVzcG9uc2UgPSBkYXRhLnJlc3BvbnNlO1xuICB2YXIgcGFyc2VkVXJsID0gbmV3IFVybCh1cmwpO1xuICB2YXIgZGVzdGluYXRpb24gPSBnZXREZXN0aW5hdGlvbihwYXJzZWRVcmwpO1xuICB2YXIgY29udGV4dCA9IHtcbiAgICBodHRwOiB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogcGFyc2VkVXJsLmhyZWZcbiAgICB9LFxuICAgIGRlc3RpbmF0aW9uOiBkZXN0aW5hdGlvblxuICB9O1xuICB2YXIgc3RhdHVzQ29kZTtcblxuICBpZiAodGFyZ2V0ICYmIHR5cGVvZiB0YXJnZXQuc3RhdHVzICE9PSAndW5kZWZpbmVkJykge1xuICAgIHN0YXR1c0NvZGUgPSB0YXJnZXQuc3RhdHVzO1xuICB9IGVsc2UgaWYgKHJlc3BvbnNlKSB7XG4gICAgc3RhdHVzQ29kZSA9IHJlc3BvbnNlLnN0YXR1cztcbiAgfVxuXG4gIGNvbnRleHQuaHR0cC5zdGF0dXNfY29kZSA9IHN0YXR1c0NvZGU7XG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5mdW5jdGlvbiBnZXROYXZpZ2F0aW9uQ29udGV4dChkYXRhKSB7XG4gIHZhciB1cmwgPSBkYXRhLnVybDtcbiAgdmFyIHBhcnNlZFVybCA9IG5ldyBVcmwodXJsKTtcbiAgdmFyIGRlc3RpbmF0aW9uID0gZ2V0RGVzdGluYXRpb24ocGFyc2VkVXJsKTtcbiAgcmV0dXJuIHtcbiAgICBkZXN0aW5hdGlvbjogZGVzdGluYXRpb25cbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhZ2VDb250ZXh0KCkge1xuICByZXR1cm4ge1xuICAgIHBhZ2U6IHtcbiAgICAgIHJlZmVyZXI6IGRvY3VtZW50LnJlZmVycmVyLFxuICAgICAgdXJsOiBsb2NhdGlvbi5ocmVmXG4gICAgfVxuICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkZFNwYW5Db250ZXh0KHNwYW4sIGRhdGEpIHtcbiAgaWYgKCFkYXRhKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHR5cGUgPSBzcGFuLnR5cGU7XG4gIHZhciBjb250ZXh0O1xuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgRVhURVJOQUw6XG4gICAgICBjb250ZXh0ID0gZ2V0RXh0ZXJuYWxDb250ZXh0KGRhdGEpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFJFU09VUkNFOlxuICAgICAgY29udGV4dCA9IGdldFJlc291cmNlQ29udGV4dChkYXRhKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBIQVJEX05BVklHQVRJT046XG4gICAgICBjb250ZXh0ID0gZ2V0TmF2aWdhdGlvbkNvbnRleHQoZGF0YSk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHNwYW4uYWRkQ29udGV4dChjb250ZXh0KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZGRUcmFuc2FjdGlvbkNvbnRleHQodHJhbnNhY3Rpb24sIF90ZW1wKSB7XG4gIHZhciBfcmVmID0gX3RlbXAgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAsXG4gICAgICB0YWdzID0gX3JlZi50YWdzLFxuICAgICAgY29uZmlnQ29udGV4dCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWYsIF9leGNsdWRlZCk7XG5cbiAgdmFyIHBhZ2VDb250ZXh0ID0gZ2V0UGFnZUNvbnRleHQoKTtcbiAgdmFyIHJlc3BvbnNlQ29udGV4dCA9IHt9O1xuXG4gIGlmICh0cmFuc2FjdGlvbi50eXBlID09PSBQQUdFX0xPQUQgJiYgaXNQZXJmVGltZWxpbmVTdXBwb3J0ZWQoKSkge1xuICAgIHZhciBlbnRyaWVzID0gUEVSRi5nZXRFbnRyaWVzQnlUeXBlKE5BVklHQVRJT04pO1xuXG4gICAgaWYgKGVudHJpZXMgJiYgZW50cmllcy5sZW5ndGggPiAwKSB7XG4gICAgICByZXNwb25zZUNvbnRleHQgPSB7XG4gICAgICAgIHJlc3BvbnNlOiBnZXRSZXNwb25zZUNvbnRleHQoZW50cmllc1swXSlcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgdHJhbnNhY3Rpb24uYWRkQ29udGV4dChwYWdlQ29udGV4dCwgcmVzcG9uc2VDb250ZXh0LCBjb25maWdDb250ZXh0KTtcbn0iLCJpbXBvcnQgeyBCRUZPUkVfRVZFTlQsIEFGVEVSX0VWRU5UIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG52YXIgRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBFdmVudEhhbmRsZXIoKSB7XG4gICAgdGhpcy5vYnNlcnZlcnMgPSB7fTtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBFdmVudEhhbmRsZXIucHJvdG90eXBlO1xuXG4gIF9wcm90by5vYnNlcnZlID0gZnVuY3Rpb24gb2JzZXJ2ZShuYW1lLCBmbikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoIXRoaXMub2JzZXJ2ZXJzW25hbWVdKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzW25hbWVdID0gW107XG4gICAgICB9XG5cbiAgICAgIHRoaXMub2JzZXJ2ZXJzW25hbWVdLnB1c2goZm4pO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gX3RoaXMub2JzZXJ2ZXJzW25hbWVdLmluZGV4T2YoZm4pO1xuXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgX3RoaXMub2JzZXJ2ZXJzW25hbWVdLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5zZW5kT25seSA9IGZ1bmN0aW9uIHNlbmRPbmx5KG5hbWUsIGFyZ3MpIHtcbiAgICB2YXIgb2JzID0gdGhpcy5vYnNlcnZlcnNbbmFtZV07XG5cbiAgICBpZiAob2JzKSB7XG4gICAgICBvYnMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmbi5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLCBlcnJvci5zdGFjayk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uc2VuZCA9IGZ1bmN0aW9uIHNlbmQobmFtZSwgYXJncykge1xuICAgIHRoaXMuc2VuZE9ubHkobmFtZSArIEJFRk9SRV9FVkVOVCwgYXJncyk7XG4gICAgdGhpcy5zZW5kT25seShuYW1lLCBhcmdzKTtcbiAgICB0aGlzLnNlbmRPbmx5KG5hbWUgKyBBRlRFUl9FVkVOVCwgYXJncyk7XG4gIH07XG5cbiAgcmV0dXJuIEV2ZW50SGFuZGxlcjtcbn0oKTtcblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRIYW5kbGVyOyIsImZ1bmN0aW9uIF9leHRlbmRzKCkgeyBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9XG5cbmltcG9ydCB7IEhUVFBfUkVRVUVTVF9USU1FT1VUIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB7IGlzUmVzcG9uc2VTdWNjZXNzZnVsIH0gZnJvbSAnLi9yZXNwb25zZS1zdGF0dXMnO1xuZXhwb3J0IHZhciBCWVRFX0xJTUlUID0gNjAgKiAxMDAwO1xuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZFVzZUZldGNoV2l0aEtlZXBBbGl2ZShtZXRob2QsIHBheWxvYWQpIHtcbiAgaWYgKCFpc0ZldGNoU3VwcG9ydGVkKCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgaXNLZWVwQWxpdmVTdXBwb3J0ZWQgPSAoJ2tlZXBhbGl2ZScgaW4gbmV3IFJlcXVlc3QoJycpKTtcblxuICBpZiAoIWlzS2VlcEFsaXZlU3VwcG9ydGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHNpemUgPSBjYWxjdWxhdGVTaXplKHBheWxvYWQpO1xuICByZXR1cm4gbWV0aG9kID09PSAnUE9TVCcgJiYgc2l6ZSA8IEJZVEVfTElNSVQ7XG59XG5leHBvcnQgZnVuY3Rpb24gc2VuZEZldGNoUmVxdWVzdChtZXRob2QsIHVybCwgX3JlZikge1xuICB2YXIgX3JlZiRrZWVwYWxpdmUgPSBfcmVmLmtlZXBhbGl2ZSxcbiAgICAgIGtlZXBhbGl2ZSA9IF9yZWYka2VlcGFsaXZlID09PSB2b2lkIDAgPyBmYWxzZSA6IF9yZWYka2VlcGFsaXZlLFxuICAgICAgX3JlZiR0aW1lb3V0ID0gX3JlZi50aW1lb3V0LFxuICAgICAgdGltZW91dCA9IF9yZWYkdGltZW91dCA9PT0gdm9pZCAwID8gSFRUUF9SRVFVRVNUX1RJTUVPVVQgOiBfcmVmJHRpbWVvdXQsXG4gICAgICBwYXlsb2FkID0gX3JlZi5wYXlsb2FkLFxuICAgICAgaGVhZGVycyA9IF9yZWYuaGVhZGVycyxcbiAgICAgIHNlbmRDcmVkZW50aWFscyA9IF9yZWYuc2VuZENyZWRlbnRpYWxzO1xuICB2YXIgdGltZW91dENvbmZpZyA9IHt9O1xuXG4gIGlmICh0eXBlb2YgQWJvcnRDb250cm9sbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFyIGNvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgdGltZW91dENvbmZpZy5zaWduYWwgPSBjb250cm9sbGVyLnNpZ25hbDtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBjb250cm9sbGVyLmFib3J0KCk7XG4gICAgfSwgdGltZW91dCk7XG4gIH1cblxuICB2YXIgZmV0Y2hSZXNwb25zZTtcbiAgcmV0dXJuIHdpbmRvdy5mZXRjaCh1cmwsIF9leHRlbmRzKHtcbiAgICBib2R5OiBwYXlsb2FkLFxuICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgbWV0aG9kOiBtZXRob2QsXG4gICAga2VlcGFsaXZlOiBrZWVwYWxpdmUsXG4gICAgY3JlZGVudGlhbHM6IHNlbmRDcmVkZW50aWFscyA/ICdpbmNsdWRlJyA6ICdvbWl0J1xuICB9LCB0aW1lb3V0Q29uZmlnKSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICBmZXRjaFJlc3BvbnNlID0gcmVzcG9uc2U7XG4gICAgcmV0dXJuIGZldGNoUmVzcG9uc2UudGV4dCgpO1xuICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZVRleHQpIHtcbiAgICB2YXIgYm9keVJlc3BvbnNlID0ge1xuICAgICAgdXJsOiB1cmwsXG4gICAgICBzdGF0dXM6IGZldGNoUmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgcmVzcG9uc2VUZXh0OiByZXNwb25zZVRleHRcbiAgICB9O1xuXG4gICAgaWYgKCFpc1Jlc3BvbnNlU3VjY2Vzc2Z1bChmZXRjaFJlc3BvbnNlLnN0YXR1cykpIHtcbiAgICAgIHRocm93IGJvZHlSZXNwb25zZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYm9keVJlc3BvbnNlO1xuICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0ZldGNoU3VwcG9ydGVkKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdy5mZXRjaCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygd2luZG93LlJlcXVlc3QgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZVNpemUocGF5bG9hZCkge1xuICBpZiAoIXBheWxvYWQpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmIChwYXlsb2FkIGluc3RhbmNlb2YgQmxvYikge1xuICAgIHJldHVybiBwYXlsb2FkLnNpemU7XG4gIH1cblxuICByZXR1cm4gbmV3IEJsb2IoW3BheWxvYWRdKS5zaXplO1xufSIsImV4cG9ydCBmdW5jdGlvbiBpc1Jlc3BvbnNlU3VjY2Vzc2Z1bChzdGF0dXMpIHtcbiAgaWYgKHN0YXR1cyA9PT0gMCB8fCBzdGF0dXMgPiAzOTkgJiYgc3RhdHVzIDwgNjAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59IiwiaW1wb3J0IHsgWEhSX0lHTk9SRSB9IGZyb20gJy4uL3BhdGNoaW5nL3BhdGNoLXV0aWxzJztcbmltcG9ydCB7IGlzUmVzcG9uc2VTdWNjZXNzZnVsIH0gZnJvbSAnLi9yZXNwb25zZS1zdGF0dXMnO1xuaW1wb3J0IHsgUHJvbWlzZSB9IGZyb20gJy4uL3BvbHlmaWxscyc7XG5leHBvcnQgZnVuY3Rpb24gc2VuZFhIUihtZXRob2QsIHVybCwgX3JlZikge1xuICB2YXIgX3JlZiR0aW1lb3V0ID0gX3JlZi50aW1lb3V0LFxuICAgICAgdGltZW91dCA9IF9yZWYkdGltZW91dCA9PT0gdm9pZCAwID8gSFRUUF9SRVFVRVNUX1RJTUVPVVQgOiBfcmVmJHRpbWVvdXQsXG4gICAgICBwYXlsb2FkID0gX3JlZi5wYXlsb2FkLFxuICAgICAgaGVhZGVycyA9IF9yZWYuaGVhZGVycyxcbiAgICAgIGJlZm9yZVNlbmQgPSBfcmVmLmJlZm9yZVNlbmQsXG4gICAgICBzZW5kQ3JlZGVudGlhbHMgPSBfcmVmLnNlbmRDcmVkZW50aWFscztcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgeGhyID0gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhocltYSFJfSUdOT1JFXSA9IHRydWU7XG4gICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgIHhoci50aW1lb3V0ID0gdGltZW91dDtcbiAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gc2VuZENyZWRlbnRpYWxzO1xuXG4gICAgaWYgKGhlYWRlcnMpIHtcbiAgICAgIGZvciAodmFyIGhlYWRlciBpbiBoZWFkZXJzKSB7XG4gICAgICAgIGlmIChoZWFkZXJzLmhhc093blByb3BlcnR5KGhlYWRlcikpIHtcbiAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIGhlYWRlcnNbaGVhZGVyXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIHZhciBzdGF0dXMgPSB4aHIuc3RhdHVzLFxuICAgICAgICAgICAgcmVzcG9uc2VUZXh0ID0geGhyLnJlc3BvbnNlVGV4dDtcblxuICAgICAgICBpZiAoaXNSZXNwb25zZVN1Y2Nlc3NmdWwoc3RhdHVzKSkge1xuICAgICAgICAgIHJlc29sdmUoeGhyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3Qoe1xuICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICBzdGF0dXM6IHN0YXR1cyxcbiAgICAgICAgICAgIHJlc3BvbnNlVGV4dDogcmVzcG9uc2VUZXh0XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc3RhdHVzID0geGhyLnN0YXR1cyxcbiAgICAgICAgICByZXNwb25zZVRleHQgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgcmVqZWN0KHtcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgICByZXNwb25zZVRleHQ6IHJlc3BvbnNlVGV4dFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBjYW5TZW5kID0gdHJ1ZTtcblxuICAgIGlmICh0eXBlb2YgYmVmb3JlU2VuZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FuU2VuZCA9IGJlZm9yZVNlbmQoe1xuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgICAgIHhocjogeGhyXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoY2FuU2VuZCkge1xuICAgICAgeGhyLnNlbmQocGF5bG9hZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlamVjdCh7XG4gICAgICAgIHVybDogdXJsLFxuICAgICAgICBzdGF0dXM6IDAsXG4gICAgICAgIHJlc3BvbnNlVGV4dDogJ1JlcXVlc3QgcmVqZWN0ZWQgYnkgdXNlciBjb25maWd1cmF0aW9uLidcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59IiwiaW1wb3J0IHsgWE1MSFRUUFJFUVVFU1QsIEZFVENILCBISVNUT1JZLCBQQUdFX0xPQUQsIEVSUk9SLCBFVkVOVF9UQVJHRVQsIENMSUNLIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuZXhwb3J0IGZ1bmN0aW9uIGdldEluc3RydW1lbnRhdGlvbkZsYWdzKGluc3RydW1lbnQsIGRpc2FibGVkSW5zdHJ1bWVudGF0aW9ucykge1xuICB2YXIgX2ZsYWdzO1xuXG4gIHZhciBmbGFncyA9IChfZmxhZ3MgPSB7fSwgX2ZsYWdzW1hNTEhUVFBSRVFVRVNUXSA9IGZhbHNlLCBfZmxhZ3NbRkVUQ0hdID0gZmFsc2UsIF9mbGFnc1tISVNUT1JZXSA9IGZhbHNlLCBfZmxhZ3NbUEFHRV9MT0FEXSA9IGZhbHNlLCBfZmxhZ3NbRVJST1JdID0gZmFsc2UsIF9mbGFnc1tFVkVOVF9UQVJHRVRdID0gZmFsc2UsIF9mbGFnc1tDTElDS10gPSBmYWxzZSwgX2ZsYWdzKTtcblxuICBpZiAoIWluc3RydW1lbnQpIHtcbiAgICByZXR1cm4gZmxhZ3M7XG4gIH1cblxuICBPYmplY3Qua2V5cyhmbGFncykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKGRpc2FibGVkSW5zdHJ1bWVudGF0aW9ucy5pbmRleE9mKGtleSkgPT09IC0xKSB7XG4gICAgICBmbGFnc1trZXldID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmxhZ3M7XG59IiwiaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4vdXRpbHMnO1xuXG52YXIgTG9nZ2luZ1NlcnZpY2UgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIExvZ2dpbmdTZXJ2aWNlKHNwZWMpIHtcbiAgICBpZiAoc3BlYyA9PT0gdm9pZCAwKSB7XG4gICAgICBzcGVjID0ge307XG4gICAgfVxuXG4gICAgdGhpcy5sZXZlbHMgPSBbJ3RyYWNlJywgJ2RlYnVnJywgJ2luZm8nLCAnd2FybicsICdlcnJvciddO1xuICAgIHRoaXMubGV2ZWwgPSBzcGVjLmxldmVsIHx8ICd3YXJuJztcbiAgICB0aGlzLnByZWZpeCA9IHNwZWMucHJlZml4IHx8ICcnO1xuICAgIHRoaXMucmVzZXRMb2dNZXRob2RzKCk7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gTG9nZ2luZ1NlcnZpY2UucHJvdG90eXBlO1xuXG4gIF9wcm90by5zaG91bGRMb2cgPSBmdW5jdGlvbiBzaG91bGRMb2cobGV2ZWwpIHtcbiAgICByZXR1cm4gdGhpcy5sZXZlbHMuaW5kZXhPZihsZXZlbCkgPj0gdGhpcy5sZXZlbHMuaW5kZXhPZih0aGlzLmxldmVsKTtcbiAgfTtcblxuICBfcHJvdG8uc2V0TGV2ZWwgPSBmdW5jdGlvbiBzZXRMZXZlbChsZXZlbCkge1xuICAgIGlmIChsZXZlbCA9PT0gdGhpcy5sZXZlbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubGV2ZWwgPSBsZXZlbDtcbiAgICB0aGlzLnJlc2V0TG9nTWV0aG9kcygpO1xuICB9O1xuXG4gIF9wcm90by5yZXNldExvZ01ldGhvZHMgPSBmdW5jdGlvbiByZXNldExvZ01ldGhvZHMoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMubGV2ZWxzLmZvckVhY2goZnVuY3Rpb24gKGxldmVsKSB7XG4gICAgICBfdGhpc1tsZXZlbF0gPSBfdGhpcy5zaG91bGRMb2cobGV2ZWwpID8gbG9nIDogbm9vcDtcblxuICAgICAgZnVuY3Rpb24gbG9nKCkge1xuICAgICAgICB2YXIgbm9ybWFsaXplZExldmVsID0gbGV2ZWw7XG5cbiAgICAgICAgaWYgKGxldmVsID09PSAndHJhY2UnIHx8IGxldmVsID09PSAnZGVidWcnKSB7XG4gICAgICAgICAgbm9ybWFsaXplZExldmVsID0gJ2luZm8nO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIGFyZ3NbMF0gPSB0aGlzLnByZWZpeCArIGFyZ3NbMF07XG5cbiAgICAgICAgaWYgKGNvbnNvbGUpIHtcbiAgICAgICAgICB2YXIgcmVhbE1ldGhvZCA9IGNvbnNvbGVbbm9ybWFsaXplZExldmVsXSB8fCBjb25zb2xlLmxvZztcblxuICAgICAgICAgIGlmICh0eXBlb2YgcmVhbE1ldGhvZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmVhbE1ldGhvZC5hcHBseShjb25zb2xlLCBhcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gTG9nZ2luZ1NlcnZpY2U7XG59KCk7XG5cbmV4cG9ydCBkZWZhdWx0IExvZ2dpbmdTZXJ2aWNlOyIsInZhciBOREpTT04gPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE5ESlNPTigpIHt9XG5cbiAgTkRKU09OLnN0cmluZ2lmeSA9IGZ1bmN0aW9uIHN0cmluZ2lmeShvYmplY3QpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqZWN0KSArICdcXG4nO1xuICB9O1xuXG4gIHJldHVybiBOREpTT047XG59KCk7XG5cbmV4cG9ydCBkZWZhdWx0IE5ESlNPTjsiLCJpbXBvcnQgeyBVU0VSX0lOVEVSQUNUSU9OIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbnZhciBJTlRFUkFDVElWRV9TRUxFQ1RPUiA9ICdhW2RhdGEtdHJhbnNhY3Rpb24tbmFtZV0sIGJ1dHRvbltkYXRhLXRyYW5zYWN0aW9uLW5hbWVdJztcbmV4cG9ydCBmdW5jdGlvbiBvYnNlcnZlUGFnZUNsaWNrcyh0cmFuc2FjdGlvblNlcnZpY2UpIHtcbiAgdmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIGNsaWNrSGFuZGxlcihldmVudCkge1xuICAgIGlmIChldmVudC50YXJnZXQgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICBjcmVhdGVVc2VySW50ZXJhY3Rpb25UcmFuc2FjdGlvbih0cmFuc2FjdGlvblNlcnZpY2UsIGV2ZW50LnRhcmdldCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBldmVudE5hbWUgPSAnY2xpY2snO1xuICB2YXIgdXNlQ2FwdHVyZSA9IHRydWU7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2xpY2tIYW5kbGVyLCB1c2VDYXB0dXJlKTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNsaWNrSGFuZGxlciwgdXNlQ2FwdHVyZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVVzZXJJbnRlcmFjdGlvblRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uU2VydmljZSwgdGFyZ2V0KSB7XG4gIHZhciBfZ2V0VHJhbnNhY3Rpb25NZXRhZGEgPSBnZXRUcmFuc2FjdGlvbk1ldGFkYXRhKHRhcmdldCksXG4gICAgICB0cmFuc2FjdGlvbk5hbWUgPSBfZ2V0VHJhbnNhY3Rpb25NZXRhZGEudHJhbnNhY3Rpb25OYW1lLFxuICAgICAgY29udGV4dCA9IF9nZXRUcmFuc2FjdGlvbk1ldGFkYS5jb250ZXh0O1xuXG4gIHZhciB0ciA9IHRyYW5zYWN0aW9uU2VydmljZS5zdGFydFRyYW5zYWN0aW9uKFwiQ2xpY2sgLSBcIiArIHRyYW5zYWN0aW9uTmFtZSwgVVNFUl9JTlRFUkFDVElPTiwge1xuICAgIG1hbmFnZWQ6IHRydWUsXG4gICAgY2FuUmV1c2U6IHRydWUsXG4gICAgcmV1c2VUaHJlc2hvbGQ6IDMwMFxuICB9KTtcblxuICBpZiAodHIgJiYgY29udGV4dCkge1xuICAgIHRyLmFkZENvbnRleHQoY29udGV4dCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VHJhbnNhY3Rpb25NZXRhZGF0YSh0YXJnZXQpIHtcbiAgdmFyIG1ldGFkYXRhID0ge1xuICAgIHRyYW5zYWN0aW9uTmFtZTogbnVsbCxcbiAgICBjb250ZXh0OiBudWxsXG4gIH07XG4gIG1ldGFkYXRhLnRyYW5zYWN0aW9uTmFtZSA9IGJ1aWxkVHJhbnNhY3Rpb25OYW1lKHRhcmdldCk7XG4gIHZhciBjbGFzc2VzID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnY2xhc3MnKTtcblxuICBpZiAoY2xhc3Nlcykge1xuICAgIG1ldGFkYXRhLmNvbnRleHQgPSB7XG4gICAgICBjdXN0b206IHtcbiAgICAgICAgY2xhc3NlczogY2xhc3Nlc1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gbWV0YWRhdGE7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkVHJhbnNhY3Rpb25OYW1lKHRhcmdldCkge1xuICB2YXIgZHROYW1lID0gZmluZEN1c3RvbVRyYW5zYWN0aW9uTmFtZSh0YXJnZXQpO1xuXG4gIGlmIChkdE5hbWUpIHtcbiAgICByZXR1cm4gZHROYW1lO1xuICB9XG5cbiAgdmFyIHRhZ05hbWUgPSB0YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICB2YXIgbmFtZSA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblxuICBpZiAoISFuYW1lKSB7XG4gICAgcmV0dXJuIHRhZ05hbWUgKyBcIltcXFwiXCIgKyBuYW1lICsgXCJcXFwiXVwiO1xuICB9XG5cbiAgcmV0dXJuIHRhZ05hbWU7XG59XG5cbmZ1bmN0aW9uIGZpbmRDdXN0b21UcmFuc2FjdGlvbk5hbWUodGFyZ2V0KSB7XG4gIGlmICh0YXJnZXQuY2xvc2VzdCkge1xuICAgIHZhciBlbGVtZW50ID0gdGFyZ2V0LmNsb3Nlc3QoSU5URVJBQ1RJVkVfU0VMRUNUT1IpO1xuICAgIHJldHVybiBlbGVtZW50ID8gZWxlbWVudC5kYXRhc2V0LnRyYW5zYWN0aW9uTmFtZSA6IG51bGw7XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0LmRhdGFzZXQudHJhbnNhY3Rpb25OYW1lO1xufSIsImltcG9ydCB7IFFVRVVFX0FERF9UUkFOU0FDVElPTiwgUVVFVUVfRkxVU0ggfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgc3RhdGUgfSBmcm9tICcuLi8uLi9zdGF0ZSc7XG5pbXBvcnQgeyBub3cgfSBmcm9tICcuLi91dGlscyc7XG5leHBvcnQgZnVuY3Rpb24gb2JzZXJ2ZVBhZ2VWaXNpYmlsaXR5KGNvbmZpZ1NlcnZpY2UsIHRyYW5zYWN0aW9uU2VydmljZSkge1xuICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAnaGlkZGVuJykge1xuICAgIHN0YXRlLmxhc3RIaWRkZW5TdGFydCA9IDA7XG4gIH1cblxuICB2YXIgdmlzaWJpbGl0eUNoYW5nZUhhbmRsZXIgPSBmdW5jdGlvbiB2aXNpYmlsaXR5Q2hhbmdlSGFuZGxlcigpIHtcbiAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAnaGlkZGVuJykge1xuICAgICAgb25QYWdlSGlkZGVuKGNvbmZpZ1NlcnZpY2UsIHRyYW5zYWN0aW9uU2VydmljZSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBwYWdlSGlkZUhhbmRsZXIgPSBmdW5jdGlvbiBwYWdlSGlkZUhhbmRsZXIoKSB7XG4gICAgcmV0dXJuIG9uUGFnZUhpZGRlbihjb25maWdTZXJ2aWNlLCB0cmFuc2FjdGlvblNlcnZpY2UpO1xuICB9O1xuXG4gIHZhciB1c2VDYXB0dXJlID0gdHJ1ZTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCB2aXNpYmlsaXR5Q2hhbmdlSGFuZGxlciwgdXNlQ2FwdHVyZSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwYWdlaGlkZScsIHBhZ2VIaWRlSGFuZGxlciwgdXNlQ2FwdHVyZSk7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCB2aXNpYmlsaXR5Q2hhbmdlSGFuZGxlciwgdXNlQ2FwdHVyZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BhZ2VoaWRlJywgcGFnZUhpZGVIYW5kbGVyLCB1c2VDYXB0dXJlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gb25QYWdlSGlkZGVuKGNvbmZpZ1NlcnZpY2UsIHRyYW5zYWN0aW9uU2VydmljZSkge1xuICB2YXIgdHIgPSB0cmFuc2FjdGlvblNlcnZpY2UuZ2V0Q3VycmVudFRyYW5zYWN0aW9uKCk7XG5cbiAgaWYgKHRyKSB7XG4gICAgdmFyIHVub2JzZXJ2ZSA9IGNvbmZpZ1NlcnZpY2Uub2JzZXJ2ZUV2ZW50KFFVRVVFX0FERF9UUkFOU0FDVElPTiwgZnVuY3Rpb24gKCkge1xuICAgICAgY29uZmlnU2VydmljZS5kaXNwYXRjaEV2ZW50KFFVRVVFX0ZMVVNIKTtcbiAgICAgIHN0YXRlLmxhc3RIaWRkZW5TdGFydCA9IG5vdygpO1xuICAgICAgdW5vYnNlcnZlKCk7XG4gICAgfSk7XG4gICAgdHIuZW5kKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnU2VydmljZS5kaXNwYXRjaEV2ZW50KFFVRVVFX0ZMVVNIKTtcbiAgICBzdGF0ZS5sYXN0SGlkZGVuU3RhcnQgPSBub3coKTtcbiAgfVxufSIsImltcG9ydCB7IFByb21pc2UgfSBmcm9tICcuLi9wb2x5ZmlsbHMnO1xuaW1wb3J0IHsgZ2xvYmFsU3RhdGUgfSBmcm9tICcuL3BhdGNoLXV0aWxzJztcbmltcG9ydCB7IFNDSEVEVUxFLCBJTlZPS0UsIEZFVENIIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB7IHNjaGVkdWxlTWljcm9UYXNrIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgaXNGZXRjaFN1cHBvcnRlZCB9IGZyb20gJy4uL2h0dHAvZmV0Y2gnO1xuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoRmV0Y2goY2FsbGJhY2spIHtcbiAgaWYgKCFpc0ZldGNoU3VwcG9ydGVkKCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmdW5jdGlvbiBzY2hlZHVsZVRhc2sodGFzaykge1xuICAgIHRhc2suc3RhdGUgPSBTQ0hFRFVMRTtcbiAgICBjYWxsYmFjayhTQ0hFRFVMRSwgdGFzayk7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZva2VUYXNrKHRhc2spIHtcbiAgICB0YXNrLnN0YXRlID0gSU5WT0tFO1xuICAgIGNhbGxiYWNrKElOVk9LRSwgdGFzayk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVSZXNwb25zZUVycm9yKHRhc2ssIGVycm9yKSB7XG4gICAgdGFzay5kYXRhLmFib3J0ZWQgPSBpc0Fib3J0RXJyb3IoZXJyb3IpO1xuICAgIHRhc2suZGF0YS5lcnJvciA9IGVycm9yO1xuICAgIGludm9rZVRhc2sodGFzayk7XG4gIH1cblxuICBmdW5jdGlvbiByZWFkU3RyZWFtKHN0cmVhbSwgdGFzaykge1xuICAgIHZhciByZWFkZXIgPSBzdHJlYW0uZ2V0UmVhZGVyKCk7XG5cbiAgICB2YXIgcmVhZCA9IGZ1bmN0aW9uIHJlYWQoKSB7XG4gICAgICByZWFkZXIucmVhZCgpLnRoZW4oZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgICAgdmFyIGRvbmUgPSBfcmVmLmRvbmU7XG5cbiAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICBpbnZva2VUYXNrKHRhc2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlYWQoKTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGhhbmRsZVJlc3BvbnNlRXJyb3IodGFzaywgZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJlYWQoKTtcbiAgfVxuXG4gIHZhciBuYXRpdmVGZXRjaCA9IHdpbmRvdy5mZXRjaDtcblxuICB3aW5kb3cuZmV0Y2ggPSBmdW5jdGlvbiAoaW5wdXQsIGluaXQpIHtcbiAgICB2YXIgZmV0Y2hTZWxmID0gdGhpcztcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgcmVxdWVzdCwgdXJsO1xuICAgIHZhciBpc1VSTCA9IGlucHV0IGluc3RhbmNlb2YgVVJMO1xuXG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgfHwgaXNVUkwpIHtcbiAgICAgIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChpbnB1dCwgaW5pdCk7XG5cbiAgICAgIGlmIChpc1VSTCkge1xuICAgICAgICB1cmwgPSByZXF1ZXN0LnVybDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVybCA9IGlucHV0O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaW5wdXQpIHtcbiAgICAgIHJlcXVlc3QgPSBpbnB1dDtcbiAgICAgIHVybCA9IHJlcXVlc3QudXJsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmF0aXZlRmV0Y2guYXBwbHkoZmV0Y2hTZWxmLCBhcmdzKTtcbiAgICB9XG5cbiAgICB2YXIgdGFzayA9IHtcbiAgICAgIHNvdXJjZTogRkVUQ0gsXG4gICAgICBzdGF0ZTogJycsXG4gICAgICB0eXBlOiAnbWFjcm9UYXNrJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdGFyZ2V0OiByZXF1ZXN0LFxuICAgICAgICBtZXRob2Q6IHJlcXVlc3QubWV0aG9kLFxuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgYWJvcnRlZDogZmFsc2VcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBnbG9iYWxTdGF0ZS5mZXRjaEluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgc2NoZWR1bGVUYXNrKHRhc2spO1xuICAgICAgdmFyIHByb21pc2U7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHByb21pc2UgPSBuYXRpdmVGZXRjaC5hcHBseShmZXRjaFNlbGYsIFtyZXF1ZXN0XSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICB0YXNrLmRhdGEuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgaW52b2tlVGFzayh0YXNrKTtcbiAgICAgICAgZ2xvYmFsU3RhdGUuZmV0Y2hJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB2YXIgY2xvbmVkUmVzcG9uc2UgPSByZXNwb25zZS5jbG9uZSA/IHJlc3BvbnNlLmNsb25lKCkgOiB7fTtcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgIHNjaGVkdWxlTWljcm9UYXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0YXNrLmRhdGEucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgICAgICAgICB2YXIgYm9keSA9IGNsb25lZFJlc3BvbnNlLmJvZHk7XG5cbiAgICAgICAgICBpZiAoYm9keSkge1xuICAgICAgICAgICAgcmVhZFN0cmVhbShib2R5LCB0YXNrKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW52b2tlVGFzayh0YXNrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIHNjaGVkdWxlTWljcm9UYXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBoYW5kbGVSZXNwb25zZUVycm9yKHRhc2ssIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGdsb2JhbFN0YXRlLmZldGNoSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBpc0Fib3J0RXJyb3IoZXJyb3IpIHtcbiAgcmV0dXJuIGVycm9yICYmIGVycm9yLm5hbWUgPT09ICdBYm9ydEVycm9yJztcbn0iLCJpbXBvcnQgeyBJTlZPS0UsIEhJU1RPUlkgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoSGlzdG9yeShjYWxsYmFjaykge1xuICBpZiAoIXdpbmRvdy5oaXN0b3J5KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIG5hdGl2ZVB1c2hTdGF0ZSA9IGhpc3RvcnkucHVzaFN0YXRlO1xuXG4gIGlmICh0eXBlb2YgbmF0aXZlUHVzaFN0YXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgaGlzdG9yeS5wdXNoU3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUsIHRpdGxlLCB1cmwpIHtcbiAgICAgIHZhciB0YXNrID0ge1xuICAgICAgICBzb3VyY2U6IEhJU1RPUlksXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICAgIHVybDogdXJsXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjYWxsYmFjayhJTlZPS0UsIHRhc2spO1xuICAgICAgbmF0aXZlUHVzaFN0YXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxufSIsImltcG9ydCB7IHBhdGNoWE1MSHR0cFJlcXVlc3QgfSBmcm9tICcuL3hoci1wYXRjaCc7XG5pbXBvcnQgeyBwYXRjaEZldGNoIH0gZnJvbSAnLi9mZXRjaC1wYXRjaCc7XG5pbXBvcnQgeyBwYXRjaEhpc3RvcnkgfSBmcm9tICcuL2hpc3RvcnktcGF0Y2gnO1xuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tICcuLi9ldmVudC1oYW5kbGVyJztcbmltcG9ydCB7IEhJU1RPUlksIEZFVENILCBYTUxIVFRQUkVRVUVTVCB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG52YXIgcGF0Y2hFdmVudEhhbmRsZXIgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG52YXIgYWxyZWFkeVBhdGNoZWQgPSBmYWxzZTtcblxuZnVuY3Rpb24gcGF0Y2hBbGwoKSB7XG4gIGlmICghYWxyZWFkeVBhdGNoZWQpIHtcbiAgICBhbHJlYWR5UGF0Y2hlZCA9IHRydWU7XG4gICAgcGF0Y2hYTUxIdHRwUmVxdWVzdChmdW5jdGlvbiAoZXZlbnQsIHRhc2spIHtcbiAgICAgIHBhdGNoRXZlbnRIYW5kbGVyLnNlbmQoWE1MSFRUUFJFUVVFU1QsIFtldmVudCwgdGFza10pO1xuICAgIH0pO1xuICAgIHBhdGNoRmV0Y2goZnVuY3Rpb24gKGV2ZW50LCB0YXNrKSB7XG4gICAgICBwYXRjaEV2ZW50SGFuZGxlci5zZW5kKEZFVENILCBbZXZlbnQsIHRhc2tdKTtcbiAgICB9KTtcbiAgICBwYXRjaEhpc3RvcnkoZnVuY3Rpb24gKGV2ZW50LCB0YXNrKSB7XG4gICAgICBwYXRjaEV2ZW50SGFuZGxlci5zZW5kKEhJU1RPUlksIFtldmVudCwgdGFza10pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHBhdGNoRXZlbnRIYW5kbGVyO1xufVxuXG5leHBvcnQgeyBwYXRjaEFsbCwgcGF0Y2hFdmVudEhhbmRsZXIgfTsiLCJleHBvcnQgdmFyIGdsb2JhbFN0YXRlID0ge1xuICBmZXRjaEluUHJvZ3Jlc3M6IGZhbHNlXG59O1xuZXhwb3J0IGZ1bmN0aW9uIGFwbVN5bWJvbChuYW1lKSB7XG4gIHJldHVybiAnX19hcG1fc3ltYm9sX18nICsgbmFtZTtcbn1cblxuZnVuY3Rpb24gaXNQcm9wZXJ0eVdyaXRhYmxlKHByb3BlcnR5RGVzYykge1xuICBpZiAoIXByb3BlcnR5RGVzYykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHByb3BlcnR5RGVzYy53cml0YWJsZSA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gISh0eXBlb2YgcHJvcGVydHlEZXNjLmdldCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgcHJvcGVydHlEZXNjLnNldCA9PT0gJ3VuZGVmaW5lZCcpO1xufVxuXG5mdW5jdGlvbiBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQocGF0Y2hlZCwgb3JpZ2luYWwpIHtcbiAgcGF0Y2hlZFthcG1TeW1ib2woJ09yaWdpbmFsRGVsZWdhdGUnKV0gPSBvcmlnaW5hbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoTWV0aG9kKHRhcmdldCwgbmFtZSwgcGF0Y2hGbikge1xuICB2YXIgcHJvdG8gPSB0YXJnZXQ7XG5cbiAgd2hpbGUgKHByb3RvICYmICFwcm90by5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgfVxuXG4gIGlmICghcHJvdG8gJiYgdGFyZ2V0W25hbWVdKSB7XG4gICAgcHJvdG8gPSB0YXJnZXQ7XG4gIH1cblxuICB2YXIgZGVsZWdhdGVOYW1lID0gYXBtU3ltYm9sKG5hbWUpO1xuICB2YXIgZGVsZWdhdGU7XG5cbiAgaWYgKHByb3RvICYmICEoZGVsZWdhdGUgPSBwcm90b1tkZWxlZ2F0ZU5hbWVdKSkge1xuICAgIGRlbGVnYXRlID0gcHJvdG9bZGVsZWdhdGVOYW1lXSA9IHByb3RvW25hbWVdO1xuICAgIHZhciBkZXNjID0gcHJvdG8gJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgbmFtZSk7XG5cbiAgICBpZiAoaXNQcm9wZXJ0eVdyaXRhYmxlKGRlc2MpKSB7XG4gICAgICB2YXIgcGF0Y2hEZWxlZ2F0ZSA9IHBhdGNoRm4oZGVsZWdhdGUsIGRlbGVnYXRlTmFtZSwgbmFtZSk7XG5cbiAgICAgIHByb3RvW25hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcGF0Y2hEZWxlZ2F0ZSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcblxuICAgICAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHByb3RvW25hbWVdLCBkZWxlZ2F0ZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlbGVnYXRlO1xufVxuZXhwb3J0IHZhciBYSFJfSUdOT1JFID0gYXBtU3ltYm9sKCd4aHJJZ25vcmUnKTtcbmV4cG9ydCB2YXIgWEhSX1NZTkMgPSBhcG1TeW1ib2woJ3hoclN5bmMnKTtcbmV4cG9ydCB2YXIgWEhSX1VSTCA9IGFwbVN5bWJvbCgneGhyVVJMJyk7XG5leHBvcnQgdmFyIFhIUl9NRVRIT0QgPSBhcG1TeW1ib2woJ3hock1ldGhvZCcpOyIsImltcG9ydCB7IHBhdGNoTWV0aG9kLCBYSFJfU1lOQywgWEhSX1VSTCwgWEhSX01FVEhPRCwgWEhSX0lHTk9SRSB9IGZyb20gJy4vcGF0Y2gtdXRpbHMnO1xuaW1wb3J0IHsgU0NIRURVTEUsIElOVk9LRSwgWE1MSFRUUFJFUVVFU1QsIEFERF9FVkVOVF9MSVNURU5FUl9TVFIgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoWE1MSHR0cFJlcXVlc3QoY2FsbGJhY2spIHtcbiAgdmFyIFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlID0gWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlO1xuXG4gIGlmICghWE1MSHR0cFJlcXVlc3RQcm90b3R5cGUgfHwgIVhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlW0FERF9FVkVOVF9MSVNURU5FUl9TVFJdKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIFJFQURZX1NUQVRFX0NIQU5HRSA9ICdyZWFkeXN0YXRlY2hhbmdlJztcbiAgdmFyIExPQUQgPSAnbG9hZCc7XG4gIHZhciBFUlJPUiA9ICdlcnJvcic7XG4gIHZhciBUSU1FT1VUID0gJ3RpbWVvdXQnO1xuICB2YXIgQUJPUlQgPSAnYWJvcnQnO1xuXG4gIGZ1bmN0aW9uIGludm9rZVRhc2sodGFzaywgc3RhdHVzKSB7XG4gICAgaWYgKHRhc2suc3RhdGUgIT09IElOVk9LRSkge1xuICAgICAgdGFzay5zdGF0ZSA9IElOVk9LRTtcbiAgICAgIHRhc2suZGF0YS5zdGF0dXMgPSBzdGF0dXM7XG4gICAgICBjYWxsYmFjayhJTlZPS0UsIHRhc2spO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNjaGVkdWxlVGFzayh0YXNrKSB7XG4gICAgaWYgKHRhc2suc3RhdGUgPT09IFNDSEVEVUxFKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGFzay5zdGF0ZSA9IFNDSEVEVUxFO1xuICAgIGNhbGxiYWNrKFNDSEVEVUxFLCB0YXNrKTtcbiAgICB2YXIgdGFyZ2V0ID0gdGFzay5kYXRhLnRhcmdldDtcblxuICAgIGZ1bmN0aW9uIGFkZExpc3RlbmVyKG5hbWUpIHtcbiAgICAgIHRhcmdldFtBRERfRVZFTlRfTElTVEVORVJfU1RSXShuYW1lLCBmdW5jdGlvbiAoX3JlZikge1xuICAgICAgICB2YXIgdHlwZSA9IF9yZWYudHlwZTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gUkVBRFlfU1RBVEVfQ0hBTkdFKSB7XG4gICAgICAgICAgaWYgKHRhcmdldC5yZWFkeVN0YXRlID09PSA0ICYmIHRhcmdldC5zdGF0dXMgIT09IDApIHtcbiAgICAgICAgICAgIGludm9rZVRhc2sodGFzaywgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHN0YXR1cyA9IHR5cGUgPT09IExPQUQgPyAnc3VjY2VzcycgOiB0eXBlO1xuICAgICAgICAgIGludm9rZVRhc2sodGFzaywgc3RhdHVzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkTGlzdGVuZXIoUkVBRFlfU1RBVEVfQ0hBTkdFKTtcbiAgICBhZGRMaXN0ZW5lcihMT0FEKTtcbiAgICBhZGRMaXN0ZW5lcihUSU1FT1VUKTtcbiAgICBhZGRMaXN0ZW5lcihFUlJPUik7XG4gICAgYWRkTGlzdGVuZXIoQUJPUlQpO1xuICB9XG5cbiAgdmFyIG9wZW5OYXRpdmUgPSBwYXRjaE1ldGhvZChYTUxIdHRwUmVxdWVzdFByb3RvdHlwZSwgJ29wZW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICBpZiAoIXNlbGZbWEhSX0lHTk9SRV0pIHtcbiAgICAgICAgc2VsZltYSFJfTUVUSE9EXSA9IGFyZ3NbMF07XG4gICAgICAgIHNlbGZbWEhSX1VSTF0gPSBhcmdzWzFdO1xuICAgICAgICBzZWxmW1hIUl9TWU5DXSA9IGFyZ3NbMl0gPT09IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3Blbk5hdGl2ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICB9O1xuICB9KTtcbiAgdmFyIHNlbmROYXRpdmUgPSBwYXRjaE1ldGhvZChYTUxIdHRwUmVxdWVzdFByb3RvdHlwZSwgJ3NlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICBpZiAoc2VsZltYSFJfSUdOT1JFXSkge1xuICAgICAgICByZXR1cm4gc2VuZE5hdGl2ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRhc2sgPSB7XG4gICAgICAgIHNvdXJjZTogWE1MSFRUUFJFUVVFU1QsXG4gICAgICAgIHN0YXRlOiAnJyxcbiAgICAgICAgdHlwZTogJ21hY3JvVGFzaycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0YXJnZXQ6IHNlbGYsXG4gICAgICAgICAgbWV0aG9kOiBzZWxmW1hIUl9NRVRIT0RdLFxuICAgICAgICAgIHN5bmM6IHNlbGZbWEhSX1NZTkNdLFxuICAgICAgICAgIHVybDogc2VsZltYSFJfVVJMXSxcbiAgICAgICAgICBzdGF0dXM6ICcnXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHNjaGVkdWxlVGFzayh0YXNrKTtcbiAgICAgICAgcmV0dXJuIHNlbmROYXRpdmUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGludm9rZVRhc2sodGFzaywgRVJST1IpO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xufSIsImltcG9ydCBQcm9taXNlUG9sbHlmaWxsIGZyb20gJ3Byb21pc2UtcG9seWZpbGwnO1xuaW1wb3J0IHsgaXNCcm93c2VyIH0gZnJvbSAnLi91dGlscyc7XG52YXIgbG9jYWwgPSB7fTtcblxuaWYgKGlzQnJvd3Nlcikge1xuICBsb2NhbCA9IHdpbmRvdztcbn0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gIGxvY2FsID0gc2VsZjtcbn1cblxudmFyIFByb21pc2UgPSAnUHJvbWlzZScgaW4gbG9jYWwgPyBsb2NhbC5Qcm9taXNlIDogUHJvbWlzZVBvbGx5ZmlsbDtcbmV4cG9ydCB7IFByb21pc2UgfTsiLCJ2YXIgUXVldWUgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFF1ZXVlKG9uRmx1c2gsIG9wdHMpIHtcbiAgICBpZiAob3B0cyA9PT0gdm9pZCAwKSB7XG4gICAgICBvcHRzID0ge307XG4gICAgfVxuXG4gICAgdGhpcy5vbkZsdXNoID0gb25GbHVzaDtcbiAgICB0aGlzLml0ZW1zID0gW107XG4gICAgdGhpcy5xdWV1ZUxpbWl0ID0gb3B0cy5xdWV1ZUxpbWl0IHx8IC0xO1xuICAgIHRoaXMuZmx1c2hJbnRlcnZhbCA9IG9wdHMuZmx1c2hJbnRlcnZhbCB8fCAwO1xuICAgIHRoaXMudGltZW91dElkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFF1ZXVlLnByb3RvdHlwZTtcblxuICBfcHJvdG8uX3NldFRpbWVyID0gZnVuY3Rpb24gX3NldFRpbWVyKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLnRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF90aGlzLmZsdXNoKCk7XG4gICAgfSwgdGhpcy5mbHVzaEludGVydmFsKTtcbiAgfTtcblxuICBfcHJvdG8uX2NsZWFyID0gZnVuY3Rpb24gX2NsZWFyKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy50aW1lb3V0SWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xuICAgICAgdGhpcy50aW1lb3V0SWQgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdGhpcy5pdGVtcyA9IFtdO1xuICB9O1xuXG4gIF9wcm90by5mbHVzaCA9IGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHRoaXMub25GbHVzaCh0aGlzLml0ZW1zKTtcblxuICAgIHRoaXMuX2NsZWFyKCk7XG4gIH07XG5cbiAgX3Byb3RvLmFkZCA9IGZ1bmN0aW9uIGFkZChpdGVtKSB7XG4gICAgdGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xuXG4gICAgaWYgKHRoaXMucXVldWVMaW1pdCAhPT0gLTEgJiYgdGhpcy5pdGVtcy5sZW5ndGggPj0gdGhpcy5xdWV1ZUxpbWl0KSB7XG4gICAgICB0aGlzLmZsdXNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy50aW1lb3V0SWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMuX3NldFRpbWVyKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBRdWV1ZTtcbn0oKTtcblxuZXhwb3J0IGRlZmF1bHQgUXVldWU7IiwidmFyIF9zZXJ2aWNlQ3JlYXRvcnM7XG5cbmltcG9ydCBBcG1TZXJ2ZXIgZnJvbSAnLi9hcG0tc2VydmVyJztcbmltcG9ydCBDb25maWdTZXJ2aWNlIGZyb20gJy4vY29uZmlnLXNlcnZpY2UnO1xuaW1wb3J0IExvZ2dpbmdTZXJ2aWNlIGZyb20gJy4vbG9nZ2luZy1zZXJ2aWNlJztcbmltcG9ydCB7IENPTkZJR19DSEFOR0UsIENPTkZJR19TRVJWSUNFLCBMT0dHSU5HX1NFUlZJQ0UsIEFQTV9TRVJWRVIgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBfX0RFVl9fIH0gZnJvbSAnLi4vc3RhdGUnO1xudmFyIHNlcnZpY2VDcmVhdG9ycyA9IChfc2VydmljZUNyZWF0b3JzID0ge30sIF9zZXJ2aWNlQ3JlYXRvcnNbQ09ORklHX1NFUlZJQ0VdID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gbmV3IENvbmZpZ1NlcnZpY2UoKTtcbn0sIF9zZXJ2aWNlQ3JlYXRvcnNbTE9HR0lOR19TRVJWSUNFXSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIG5ldyBMb2dnaW5nU2VydmljZSh7XG4gICAgcHJlZml4OiAnW0VsYXN0aWMgQVBNXSAnXG4gIH0pO1xufSwgX3NlcnZpY2VDcmVhdG9yc1tBUE1fU0VSVkVSXSA9IGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gIHZhciBfZmFjdG9yeSRnZXRTZXJ2aWNlID0gZmFjdG9yeS5nZXRTZXJ2aWNlKFtDT05GSUdfU0VSVklDRSwgTE9HR0lOR19TRVJWSUNFXSksXG4gICAgICBjb25maWdTZXJ2aWNlID0gX2ZhY3RvcnkkZ2V0U2VydmljZVswXSxcbiAgICAgIGxvZ2dpbmdTZXJ2aWNlID0gX2ZhY3RvcnkkZ2V0U2VydmljZVsxXTtcblxuICByZXR1cm4gbmV3IEFwbVNlcnZlcihjb25maWdTZXJ2aWNlLCBsb2dnaW5nU2VydmljZSk7XG59LCBfc2VydmljZUNyZWF0b3JzKTtcblxudmFyIFNlcnZpY2VGYWN0b3J5ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTZXJ2aWNlRmFjdG9yeSgpIHtcbiAgICB0aGlzLmluc3RhbmNlcyA9IHt9O1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBTZXJ2aWNlRmFjdG9yeS5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLmluaXQgPSBmdW5jdGlvbiBpbml0KCkge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgdmFyIGNvbmZpZ1NlcnZpY2UgPSB0aGlzLmdldFNlcnZpY2UoQ09ORklHX1NFUlZJQ0UpO1xuICAgIGNvbmZpZ1NlcnZpY2UuaW5pdCgpO1xuXG4gICAgdmFyIF90aGlzJGdldFNlcnZpY2UgPSB0aGlzLmdldFNlcnZpY2UoW0xPR0dJTkdfU0VSVklDRSwgQVBNX1NFUlZFUl0pLFxuICAgICAgICBsb2dnaW5nU2VydmljZSA9IF90aGlzJGdldFNlcnZpY2VbMF0sXG4gICAgICAgIGFwbVNlcnZlciA9IF90aGlzJGdldFNlcnZpY2VbMV07XG5cbiAgICBjb25maWdTZXJ2aWNlLmV2ZW50cy5vYnNlcnZlKENPTkZJR19DSEFOR0UsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBsb2dMZXZlbCA9IGNvbmZpZ1NlcnZpY2UuZ2V0KCdsb2dMZXZlbCcpO1xuICAgICAgbG9nZ2luZ1NlcnZpY2Uuc2V0TGV2ZWwobG9nTGV2ZWwpO1xuICAgIH0pO1xuICAgIGFwbVNlcnZlci5pbml0KCk7XG4gIH07XG5cbiAgX3Byb3RvLmdldFNlcnZpY2UgPSBmdW5jdGlvbiBnZXRTZXJ2aWNlKG5hbWUpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKCF0aGlzLmluc3RhbmNlc1tuYW1lXSkge1xuICAgICAgICBpZiAodHlwZW9mIHNlcnZpY2VDcmVhdG9yc1tuYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRoaXMuaW5zdGFuY2VzW25hbWVdID0gc2VydmljZUNyZWF0b3JzW25hbWVdKHRoaXMpO1xuICAgICAgICB9IGVsc2UgaWYgKF9fREVWX18pIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnQ2Fubm90IGdldCBzZXJ2aWNlLCBObyBjcmVhdG9yIGZvcjogJyArIG5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlc1tuYW1lXTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkobmFtZSkpIHtcbiAgICAgIHJldHVybiBuYW1lLm1hcChmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4gX3RoaXMuZ2V0U2VydmljZShuKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gU2VydmljZUZhY3Rvcnk7XG59KCk7XG5cbmV4cG9ydCB7IHNlcnZpY2VDcmVhdG9ycywgU2VydmljZUZhY3RvcnkgfTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0aHJvdHRsZShmbiwgb25UaHJvdHRsZSwgb3B0cykge1xuICB2YXIgY29udGV4dCA9IHRoaXM7XG4gIHZhciBsaW1pdCA9IG9wdHMubGltaXQ7XG4gIHZhciBpbnRlcnZhbCA9IG9wdHMuaW50ZXJ2YWw7XG4gIHZhciBjb3VudGVyID0gMDtcbiAgdmFyIHRpbWVvdXRJZDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBjb3VudGVyKys7XG5cbiAgICBpZiAodHlwZW9mIHRpbWVvdXRJZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb3VudGVyID0gMDtcbiAgICAgICAgdGltZW91dElkID0gdW5kZWZpbmVkO1xuICAgICAgfSwgaW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIGlmIChjb3VudGVyID4gbGltaXQgJiYgdHlwZW9mIG9uVGhyb3R0bGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBvblRocm90dGxlLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmbi5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfTtcbn0iLCJpbXBvcnQgeyBLRVlXT1JEX0xJTUlUIH0gZnJvbSAnLi9jb25zdGFudHMnO1xudmFyIE1FVEFEQVRBX01PREVMID0ge1xuICBzZXJ2aWNlOiB7XG4gICAgbmFtZTogW0tFWVdPUkRfTElNSVQsIHRydWVdLFxuICAgIHZlcnNpb246IHRydWUsXG4gICAgYWdlbnQ6IHtcbiAgICAgIHZlcnNpb246IFtLRVlXT1JEX0xJTUlULCB0cnVlXVxuICAgIH0sXG4gICAgZW52aXJvbm1lbnQ6IHRydWVcbiAgfSxcbiAgbGFiZWxzOiB7XG4gICAgJyonOiB0cnVlXG4gIH1cbn07XG52YXIgUkVTUE9OU0VfTU9ERUwgPSB7XG4gICcqJzogdHJ1ZSxcbiAgaGVhZGVyczoge1xuICAgICcqJzogdHJ1ZVxuICB9XG59O1xudmFyIERFU1RJTkFUSU9OX01PREVMID0ge1xuICBhZGRyZXNzOiBbS0VZV09SRF9MSU1JVF0sXG4gIHNlcnZpY2U6IHtcbiAgICAnKic6IFtLRVlXT1JEX0xJTUlULCB0cnVlXVxuICB9XG59O1xudmFyIENPTlRFWFRfTU9ERUwgPSB7XG4gIHVzZXI6IHtcbiAgICBpZDogdHJ1ZSxcbiAgICBlbWFpbDogdHJ1ZSxcbiAgICB1c2VybmFtZTogdHJ1ZVxuICB9LFxuICB0YWdzOiB7XG4gICAgJyonOiB0cnVlXG4gIH0sXG4gIGh0dHA6IHtcbiAgICByZXNwb25zZTogUkVTUE9OU0VfTU9ERUxcbiAgfSxcbiAgZGVzdGluYXRpb246IERFU1RJTkFUSU9OX01PREVMLFxuICByZXNwb25zZTogUkVTUE9OU0VfTU9ERUxcbn07XG52YXIgU1BBTl9NT0RFTCA9IHtcbiAgbmFtZTogW0tFWVdPUkRfTElNSVQsIHRydWVdLFxuICB0eXBlOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIGlkOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIHRyYWNlX2lkOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIHBhcmVudF9pZDogW0tFWVdPUkRfTElNSVQsIHRydWVdLFxuICB0cmFuc2FjdGlvbl9pZDogW0tFWVdPUkRfTElNSVQsIHRydWVdLFxuICBzdWJ0eXBlOiB0cnVlLFxuICBhY3Rpb246IHRydWUsXG4gIGNvbnRleHQ6IENPTlRFWFRfTU9ERUxcbn07XG52YXIgVFJBTlNBQ1RJT05fTU9ERUwgPSB7XG4gIG5hbWU6IHRydWUsXG4gIHBhcmVudF9pZDogdHJ1ZSxcbiAgdHlwZTogW0tFWVdPUkRfTElNSVQsIHRydWVdLFxuICBpZDogW0tFWVdPUkRfTElNSVQsIHRydWVdLFxuICB0cmFjZV9pZDogW0tFWVdPUkRfTElNSVQsIHRydWVdLFxuICBzcGFuX2NvdW50OiB7XG4gICAgc3RhcnRlZDogW0tFWVdPUkRfTElNSVQsIHRydWVdXG4gIH0sXG4gIGNvbnRleHQ6IENPTlRFWFRfTU9ERUxcbn07XG52YXIgRVJST1JfTU9ERUwgPSB7XG4gIGlkOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIHRyYWNlX2lkOiB0cnVlLFxuICB0cmFuc2FjdGlvbl9pZDogdHJ1ZSxcbiAgcGFyZW50X2lkOiB0cnVlLFxuICBjdWxwcml0OiB0cnVlLFxuICBleGNlcHRpb246IHtcbiAgICB0eXBlOiB0cnVlXG4gIH0sXG4gIHRyYW5zYWN0aW9uOiB7XG4gICAgdHlwZTogdHJ1ZVxuICB9LFxuICBjb250ZXh0OiBDT05URVhUX01PREVMXG59O1xuXG5mdW5jdGlvbiB0cnVuY2F0ZSh2YWx1ZSwgbGltaXQsIHJlcXVpcmVkLCBwbGFjZWhvbGRlcikge1xuICBpZiAobGltaXQgPT09IHZvaWQgMCkge1xuICAgIGxpbWl0ID0gS0VZV09SRF9MSU1JVDtcbiAgfVxuXG4gIGlmIChyZXF1aXJlZCA9PT0gdm9pZCAwKSB7XG4gICAgcmVxdWlyZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGlmIChwbGFjZWhvbGRlciA9PT0gdm9pZCAwKSB7XG4gICAgcGxhY2Vob2xkZXIgPSAnTi9BJztcbiAgfVxuXG4gIGlmIChyZXF1aXJlZCAmJiBpc0VtcHR5KHZhbHVlKSkge1xuICAgIHZhbHVlID0gcGxhY2Vob2xkZXI7XG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZS5zdWJzdHJpbmcoMCwgbGltaXQpO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09PSAnJyB8fCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnO1xufVxuXG5mdW5jdGlvbiByZXBsYWNlVmFsdWUodGFyZ2V0LCBrZXksIGN1cnJNb2RlbCkge1xuICB2YXIgdmFsdWUgPSB0cnVuY2F0ZSh0YXJnZXRba2V5XSwgY3Vyck1vZGVsWzBdLCBjdXJyTW9kZWxbMV0pO1xuXG4gIGlmIChpc0VtcHR5KHZhbHVlKSkge1xuICAgIGRlbGV0ZSB0YXJnZXRba2V5XTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0YXJnZXRba2V5XSA9IHZhbHVlO1xufVxuXG5mdW5jdGlvbiB0cnVuY2F0ZU1vZGVsKG1vZGVsLCB0YXJnZXQsIGNoaWxkVGFyZ2V0KSB7XG4gIGlmIChtb2RlbCA9PT0gdm9pZCAwKSB7XG4gICAgbW9kZWwgPSB7fTtcbiAgfVxuXG4gIGlmIChjaGlsZFRhcmdldCA9PT0gdm9pZCAwKSB7XG4gICAgY2hpbGRUYXJnZXQgPSB0YXJnZXQ7XG4gIH1cblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG1vZGVsKTtcbiAgdmFyIGVtcHR5QXJyID0gW107XG5cbiAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3AoaSkge1xuICAgIHZhciBjdXJyS2V5ID0ga2V5c1tpXTtcbiAgICB2YXIgY3Vyck1vZGVsID0gbW9kZWxbY3VycktleV0gPT09IHRydWUgPyBlbXB0eUFyciA6IG1vZGVsW2N1cnJLZXldO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGN1cnJNb2RlbCkpIHtcbiAgICAgIHRydW5jYXRlTW9kZWwoY3Vyck1vZGVsLCB0YXJnZXQsIGNoaWxkVGFyZ2V0W2N1cnJLZXldKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGN1cnJLZXkgPT09ICcqJykge1xuICAgICAgICBPYmplY3Qua2V5cyhjaGlsZFRhcmdldCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHJlcGxhY2VWYWx1ZShjaGlsZFRhcmdldCwga2V5LCBjdXJyTW9kZWwpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcGxhY2VWYWx1ZShjaGlsZFRhcmdldCwgY3VycktleSwgY3Vyck1vZGVsKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgX2xvb3AoaSk7XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5leHBvcnQgeyB0cnVuY2F0ZSwgdHJ1bmNhdGVNb2RlbCwgU1BBTl9NT0RFTCwgVFJBTlNBQ1RJT05fTU9ERUwsIEVSUk9SX01PREVMLCBNRVRBREFUQV9NT0RFTCwgUkVTUE9OU0VfTU9ERUwgfTsiLCJpbXBvcnQgeyBpc0Jyb3dzZXIgfSBmcm9tICcuL3V0aWxzJztcblxuZnVuY3Rpb24gaXNEZWZhdWx0UG9ydChwb3J0LCBwcm90b2NvbCkge1xuICBzd2l0Y2ggKHByb3RvY29sKSB7XG4gICAgY2FzZSAnaHR0cDonOlxuICAgICAgcmV0dXJuIHBvcnQgPT09ICc4MCc7XG5cbiAgICBjYXNlICdodHRwczonOlxuICAgICAgcmV0dXJuIHBvcnQgPT09ICc0NDMnO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbnZhciBSVUxFUyA9IFtbJyMnLCAnaGFzaCddLCBbJz8nLCAncXVlcnknXSwgWycvJywgJ3BhdGgnXSwgWydAJywgJ2F1dGgnLCAxXSwgW05hTiwgJ2hvc3QnLCB1bmRlZmluZWQsIDFdXTtcbnZhciBQUk9UT0NPTF9SRUdFWCA9IC9eKFthLXpdW2EtejAtOS4rLV0qOik/KFxcL1xcLyk/KFtcXFNcXHNdKikvaTtcbmV4cG9ydCB2YXIgVXJsID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBVcmwodXJsKSB7XG4gICAgdmFyIF90aGlzJGV4dHJhY3RQcm90b2NvbCA9IHRoaXMuZXh0cmFjdFByb3RvY29sKHVybCB8fCAnJyksXG4gICAgICAgIHByb3RvY29sID0gX3RoaXMkZXh0cmFjdFByb3RvY29sLnByb3RvY29sLFxuICAgICAgICBhZGRyZXNzID0gX3RoaXMkZXh0cmFjdFByb3RvY29sLmFkZHJlc3MsXG4gICAgICAgIHNsYXNoZXMgPSBfdGhpcyRleHRyYWN0UHJvdG9jb2wuc2xhc2hlcztcblxuICAgIHZhciByZWxhdGl2ZSA9ICFwcm90b2NvbCAmJiAhc2xhc2hlcztcbiAgICB2YXIgbG9jYXRpb24gPSB0aGlzLmdldExvY2F0aW9uKCk7XG4gICAgdmFyIGluc3RydWN0aW9ucyA9IFJVTEVTLnNsaWNlKCk7XG4gICAgYWRkcmVzcyA9IGFkZHJlc3MucmVwbGFjZSgnXFxcXCcsICcvJyk7XG5cbiAgICBpZiAoIXNsYXNoZXMpIHtcbiAgICAgIGluc3RydWN0aW9uc1syXSA9IFtOYU4sICdwYXRoJ107XG4gICAgfVxuXG4gICAgdmFyIGluZGV4O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnN0cnVjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpbnN0cnVjdGlvbiA9IGluc3RydWN0aW9uc1tpXTtcbiAgICAgIHZhciBwYXJzZSA9IGluc3RydWN0aW9uWzBdO1xuICAgICAgdmFyIGtleSA9IGluc3RydWN0aW9uWzFdO1xuXG4gICAgICBpZiAodHlwZW9mIHBhcnNlID09PSAnc3RyaW5nJykge1xuICAgICAgICBpbmRleCA9IGFkZHJlc3MuaW5kZXhPZihwYXJzZSk7XG5cbiAgICAgICAgaWYgKH5pbmRleCkge1xuICAgICAgICAgIHZhciBpbnN0TGVuZ3RoID0gaW5zdHJ1Y3Rpb25bMl07XG5cbiAgICAgICAgICBpZiAoaW5zdExlbmd0aCkge1xuICAgICAgICAgICAgdmFyIG5ld0luZGV4ID0gYWRkcmVzcy5sYXN0SW5kZXhPZihwYXJzZSk7XG4gICAgICAgICAgICBpbmRleCA9IE1hdGgubWF4KGluZGV4LCBuZXdJbmRleCk7XG4gICAgICAgICAgICB0aGlzW2tleV0gPSBhZGRyZXNzLnNsaWNlKDAsIGluZGV4KTtcbiAgICAgICAgICAgIGFkZHJlc3MgPSBhZGRyZXNzLnNsaWNlKGluZGV4ICsgaW5zdExlbmd0aCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IGFkZHJlc3Muc2xpY2UoaW5kZXgpO1xuICAgICAgICAgICAgYWRkcmVzcyA9IGFkZHJlc3Muc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1trZXldID0gYWRkcmVzcztcbiAgICAgICAgYWRkcmVzcyA9ICcnO1xuICAgICAgfVxuXG4gICAgICB0aGlzW2tleV0gPSB0aGlzW2tleV0gfHwgKHJlbGF0aXZlICYmIGluc3RydWN0aW9uWzNdID8gbG9jYXRpb25ba2V5XSB8fCAnJyA6ICcnKTtcbiAgICAgIGlmIChpbnN0cnVjdGlvblszXSkgdGhpc1trZXldID0gdGhpc1trZXldLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgaWYgKHJlbGF0aXZlICYmIHRoaXMucGF0aC5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgICAgdGhpcy5wYXRoID0gJy8nICsgdGhpcy5wYXRoO1xuICAgIH1cblxuICAgIHRoaXMucmVsYXRpdmUgPSByZWxhdGl2ZTtcbiAgICB0aGlzLnByb3RvY29sID0gcHJvdG9jb2wgfHwgbG9jYXRpb24ucHJvdG9jb2w7XG4gICAgdGhpcy5ob3N0bmFtZSA9IHRoaXMuaG9zdDtcbiAgICB0aGlzLnBvcnQgPSAnJztcblxuICAgIGlmICgvOlxcZCskLy50ZXN0KHRoaXMuaG9zdCkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMuaG9zdC5zcGxpdCgnOicpO1xuICAgICAgdmFyIHBvcnQgPSB2YWx1ZS5wb3AoKTtcbiAgICAgIHZhciBob3N0bmFtZSA9IHZhbHVlLmpvaW4oJzonKTtcblxuICAgICAgaWYgKGlzRGVmYXVsdFBvcnQocG9ydCwgdGhpcy5wcm90b2NvbCkpIHtcbiAgICAgICAgdGhpcy5ob3N0ID0gaG9zdG5hbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnBvcnQgPSBwb3J0O1xuICAgICAgfVxuXG4gICAgICB0aGlzLmhvc3RuYW1lID0gaG9zdG5hbWU7XG4gICAgfVxuXG4gICAgdGhpcy5vcmlnaW4gPSB0aGlzLnByb3RvY29sICYmIHRoaXMuaG9zdCAmJiB0aGlzLnByb3RvY29sICE9PSAnZmlsZTonID8gdGhpcy5wcm90b2NvbCArICcvLycgKyB0aGlzLmhvc3QgOiAnbnVsbCc7XG4gICAgdGhpcy5ocmVmID0gdGhpcy50b1N0cmluZygpO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFVybC5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgdmFyIHJlc3VsdCA9IHRoaXMucHJvdG9jb2w7XG4gICAgcmVzdWx0ICs9ICcvLyc7XG5cbiAgICBpZiAodGhpcy5hdXRoKSB7XG4gICAgICB2YXIgUkVEQUNURUQgPSAnW1JFREFDVEVEXSc7XG4gICAgICB2YXIgdXNlcnBhc3MgPSB0aGlzLmF1dGguc3BsaXQoJzonKTtcbiAgICAgIHZhciB1c2VybmFtZSA9IHVzZXJwYXNzWzBdID8gUkVEQUNURUQgOiAnJztcbiAgICAgIHZhciBwYXNzd29yZCA9IHVzZXJwYXNzWzFdID8gJzonICsgUkVEQUNURUQgOiAnJztcbiAgICAgIHJlc3VsdCArPSB1c2VybmFtZSArIHBhc3N3b3JkICsgJ0AnO1xuICAgIH1cblxuICAgIHJlc3VsdCArPSB0aGlzLmhvc3Q7XG4gICAgcmVzdWx0ICs9IHRoaXMucGF0aDtcbiAgICByZXN1bHQgKz0gdGhpcy5xdWVyeTtcbiAgICByZXN1bHQgKz0gdGhpcy5oYXNoO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgX3Byb3RvLmdldExvY2F0aW9uID0gZnVuY3Rpb24gZ2V0TG9jYXRpb24oKSB7XG4gICAgdmFyIGdsb2JhbFZhciA9IHt9O1xuXG4gICAgaWYgKGlzQnJvd3Nlcikge1xuICAgICAgZ2xvYmFsVmFyID0gd2luZG93O1xuICAgIH1cblxuICAgIHJldHVybiBnbG9iYWxWYXIubG9jYXRpb247XG4gIH07XG5cbiAgX3Byb3RvLmV4dHJhY3RQcm90b2NvbCA9IGZ1bmN0aW9uIGV4dHJhY3RQcm90b2NvbCh1cmwpIHtcbiAgICB2YXIgbWF0Y2ggPSBQUk9UT0NPTF9SRUdFWC5leGVjKHVybCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb3RvY29sOiBtYXRjaFsxXSA/IG1hdGNoWzFdLnRvTG93ZXJDYXNlKCkgOiAnJyxcbiAgICAgIHNsYXNoZXM6ICEhbWF0Y2hbMl0sXG4gICAgICBhZGRyZXNzOiBtYXRjaFszXVxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIFVybDtcbn0oKTtcbmV4cG9ydCBmdW5jdGlvbiBzbHVnaWZ5VXJsKHVybFN0ciwgZGVwdGgpIHtcbiAgaWYgKGRlcHRoID09PSB2b2lkIDApIHtcbiAgICBkZXB0aCA9IDI7XG4gIH1cblxuICB2YXIgcGFyc2VkVXJsID0gbmV3IFVybCh1cmxTdHIpO1xuICB2YXIgcXVlcnkgPSBwYXJzZWRVcmwucXVlcnksXG4gICAgICBwYXRoID0gcGFyc2VkVXJsLnBhdGg7XG4gIHZhciBwYXRoUGFydHMgPSBwYXRoLnN1YnN0cmluZygxKS5zcGxpdCgnLycpO1xuICB2YXIgcmVkYWN0U3RyaW5nID0gJzppZCc7XG4gIHZhciB3aWxkY2FyZCA9ICcqJztcbiAgdmFyIHNwZWNpYWxDaGFyc1JlZ2V4ID0gL1xcV3xfL2c7XG4gIHZhciBkaWdpdHNSZWdleCA9IC9bMC05XS9nO1xuICB2YXIgbG93ZXJDYXNlUmVnZXggPSAvW2Etel0vZztcbiAgdmFyIHVwcGVyQ2FzZVJlZ2V4ID0gL1tBLVpdL2c7XG4gIHZhciByZWRhY3RlZFBhcnRzID0gW107XG4gIHZhciByZWRhY3RlZEJlZm9yZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBwYXRoUGFydHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgdmFyIHBhcnQgPSBwYXRoUGFydHNbaW5kZXhdO1xuXG4gICAgaWYgKHJlZGFjdGVkQmVmb3JlIHx8IGluZGV4ID4gZGVwdGggLSAxKSB7XG4gICAgICBpZiAocGFydCkge1xuICAgICAgICByZWRhY3RlZFBhcnRzLnB1c2god2lsZGNhcmQpO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgbnVtYmVyT2ZTcGVjaWFsQ2hhcnMgPSAocGFydC5tYXRjaChzcGVjaWFsQ2hhcnNSZWdleCkgfHwgW10pLmxlbmd0aDtcblxuICAgIGlmIChudW1iZXJPZlNwZWNpYWxDaGFycyA+PSAyKSB7XG4gICAgICByZWRhY3RlZFBhcnRzLnB1c2gocmVkYWN0U3RyaW5nKTtcbiAgICAgIHJlZGFjdGVkQmVmb3JlID0gdHJ1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciBudW1iZXJPZkRpZ2l0cyA9IChwYXJ0Lm1hdGNoKGRpZ2l0c1JlZ2V4KSB8fCBbXSkubGVuZ3RoO1xuXG4gICAgaWYgKG51bWJlck9mRGlnaXRzID4gMyB8fCBwYXJ0Lmxlbmd0aCA+IDMgJiYgbnVtYmVyT2ZEaWdpdHMgLyBwYXJ0Lmxlbmd0aCA+PSAwLjMpIHtcbiAgICAgIHJlZGFjdGVkUGFydHMucHVzaChyZWRhY3RTdHJpbmcpO1xuICAgICAgcmVkYWN0ZWRCZWZvcmUgPSB0cnVlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIG51bWJlcm9mVXBwZXJDYXNlID0gKHBhcnQubWF0Y2godXBwZXJDYXNlUmVnZXgpIHx8IFtdKS5sZW5ndGg7XG4gICAgdmFyIG51bWJlcm9mTG93ZXJDYXNlID0gKHBhcnQubWF0Y2gobG93ZXJDYXNlUmVnZXgpIHx8IFtdKS5sZW5ndGg7XG4gICAgdmFyIGxvd2VyQ2FzZVJhdGUgPSBudW1iZXJvZkxvd2VyQ2FzZSAvIHBhcnQubGVuZ3RoO1xuICAgIHZhciB1cHBlckNhc2VSYXRlID0gbnVtYmVyb2ZVcHBlckNhc2UgLyBwYXJ0Lmxlbmd0aDtcblxuICAgIGlmIChwYXJ0Lmxlbmd0aCA+IDUgJiYgKHVwcGVyQ2FzZVJhdGUgPiAwLjMgJiYgdXBwZXJDYXNlUmF0ZSA8IDAuNiB8fCBsb3dlckNhc2VSYXRlID4gMC4zICYmIGxvd2VyQ2FzZVJhdGUgPCAwLjYpKSB7XG4gICAgICByZWRhY3RlZFBhcnRzLnB1c2gocmVkYWN0U3RyaW5nKTtcbiAgICAgIHJlZGFjdGVkQmVmb3JlID0gdHJ1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHBhcnQgJiYgcmVkYWN0ZWRQYXJ0cy5wdXNoKHBhcnQpO1xuICB9XG5cbiAgdmFyIHJlZGFjdGVkID0gJy8nICsgKHJlZGFjdGVkUGFydHMubGVuZ3RoID49IDIgPyByZWRhY3RlZFBhcnRzLmpvaW4oJy8nKSA6IHJlZGFjdGVkUGFydHMuam9pbignJykpICsgKHF1ZXJ5ID8gJz97cXVlcnl9JyA6ICcnKTtcbiAgcmV0dXJuIHJlZGFjdGVkO1xufSIsImltcG9ydCB7IFByb21pc2UgfSBmcm9tICcuL3BvbHlmaWxscyc7XG52YXIgc2xpY2UgPSBbXS5zbGljZTtcbnZhciBpc0Jyb3dzZXIgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbnZhciBQRVJGID0gaXNCcm93c2VyICYmIHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gJ3VuZGVmaW5lZCcgPyBwZXJmb3JtYW5jZSA6IHt9O1xuXG5mdW5jdGlvbiBpc0NPUlNTdXBwb3J0ZWQoKSB7XG4gIHZhciB4aHIgPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KCk7XG4gIHJldHVybiAnd2l0aENyZWRlbnRpYWxzJyBpbiB4aHI7XG59XG5cbnZhciBieXRlVG9IZXggPSBbXTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBieXRlVG9IZXhbaV0gPSAoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpO1xufVxuXG5mdW5jdGlvbiBieXRlc1RvSGV4KGJ1ZmZlcikge1xuICB2YXIgaGV4T2N0ZXRzID0gW107XG5cbiAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGJ1ZmZlci5sZW5ndGg7IF9pKyspIHtcbiAgICBoZXhPY3RldHMucHVzaChieXRlVG9IZXhbYnVmZmVyW19pXV0pO1xuICB9XG5cbiAgcmV0dXJuIGhleE9jdGV0cy5qb2luKCcnKTtcbn1cblxudmFyIGRlc3RpbmF0aW9uID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuXG5mdW5jdGlvbiBybmcoKSB7XG4gIGlmICh0eXBlb2YgY3J5cHRvICE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzID09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhkZXN0aW5hdGlvbik7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1zQ3J5cHRvICE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcmV0dXJuIGRlc3RpbmF0aW9uO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbUlkKGxlbmd0aCkge1xuICB2YXIgaWQgPSBieXRlc1RvSGV4KHJuZygpKTtcbiAgcmV0dXJuIGlkLnN1YnN0cigwLCBsZW5ndGgpO1xufVxuXG5mdW5jdGlvbiBnZXREdEhlYWRlclZhbHVlKHNwYW4pIHtcbiAgdmFyIGR0VmVyc2lvbiA9ICcwMCc7XG4gIHZhciBkdFVuU2FtcGxlZEZsYWdzID0gJzAwJztcbiAgdmFyIGR0U2FtcGxlZEZsYWdzID0gJzAxJztcblxuICBpZiAoc3BhbiAmJiBzcGFuLnRyYWNlSWQgJiYgc3Bhbi5pZCAmJiBzcGFuLnBhcmVudElkKSB7XG4gICAgdmFyIGZsYWdzID0gc3Bhbi5zYW1wbGVkID8gZHRTYW1wbGVkRmxhZ3MgOiBkdFVuU2FtcGxlZEZsYWdzO1xuICAgIHZhciBpZCA9IHNwYW4uc2FtcGxlZCA/IHNwYW4uaWQgOiBzcGFuLnBhcmVudElkO1xuICAgIHJldHVybiBkdFZlcnNpb24gKyAnLScgKyBzcGFuLnRyYWNlSWQgKyAnLScgKyBpZCArICctJyArIGZsYWdzO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlRHRIZWFkZXJWYWx1ZSh2YWx1ZSkge1xuICB2YXIgcGFyc2VkID0gL14oW1xcZGEtZl17Mn0pLShbXFxkYS1mXXszMn0pLShbXFxkYS1mXXsxNn0pLShbXFxkYS1mXXsyfSkkLy5leGVjKHZhbHVlKTtcblxuICBpZiAocGFyc2VkKSB7XG4gICAgdmFyIGZsYWdzID0gcGFyc2VkWzRdO1xuICAgIHZhciBzYW1wbGVkID0gZmxhZ3MgIT09ICcwMCc7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRyYWNlSWQ6IHBhcnNlZFsyXSxcbiAgICAgIGlkOiBwYXJzZWRbM10sXG4gICAgICBzYW1wbGVkOiBzYW1wbGVkXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0R0SGVhZGVyVmFsaWQoaGVhZGVyKSB7XG4gIHJldHVybiAvXltcXGRhLWZdezJ9LVtcXGRhLWZdezMyfS1bXFxkYS1mXXsxNn0tW1xcZGEtZl17Mn0kLy50ZXN0KGhlYWRlcikgJiYgaGVhZGVyLnNsaWNlKDMsIDM1KSAhPT0gJzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwJyAmJiBoZWFkZXIuc2xpY2UoMzYsIDUyKSAhPT0gJzAwMDAwMDAwMDAwMDAwMDAnO1xufVxuXG5mdW5jdGlvbiBnZXRUU0hlYWRlclZhbHVlKF9yZWYpIHtcbiAgdmFyIHNhbXBsZVJhdGUgPSBfcmVmLnNhbXBsZVJhdGU7XG5cbiAgaWYgKHR5cGVvZiBzYW1wbGVSYXRlICE9PSAnbnVtYmVyJyB8fCBTdHJpbmcoc2FtcGxlUmF0ZSkubGVuZ3RoID4gMjU2KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIE5BTUVTUEFDRSA9ICdlcyc7XG4gIHZhciBTRVBBUkFUT1IgPSAnPSc7XG4gIHJldHVybiBcIlwiICsgTkFNRVNQQUNFICsgU0VQQVJBVE9SICsgXCJzOlwiICsgc2FtcGxlUmF0ZTtcbn1cblxuZnVuY3Rpb24gc2V0UmVxdWVzdEhlYWRlcih0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdGFyZ2V0LnNldFJlcXVlc3RIZWFkZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0YXJnZXQuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSk7XG4gIH0gZWxzZSBpZiAodGFyZ2V0LmhlYWRlcnMgJiYgdHlwZW9mIHRhcmdldC5oZWFkZXJzLmFwcGVuZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRhcmdldC5oZWFkZXJzLmFwcGVuZChuYW1lLCB2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0W25hbWVdID0gdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tTYW1lT3JpZ2luKHNvdXJjZSwgdGFyZ2V0KSB7XG4gIHZhciBpc1NhbWUgPSBmYWxzZTtcblxuICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICBpc1NhbWUgPSBzb3VyY2UgPT09IHRhcmdldDtcbiAgfSBlbHNlIGlmICh0YXJnZXQgJiYgdHlwZW9mIHRhcmdldC50ZXN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgaXNTYW1lID0gdGFyZ2V0LnRlc3Qoc291cmNlKTtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcbiAgICB0YXJnZXQuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgaWYgKCFpc1NhbWUpIHtcbiAgICAgICAgaXNTYW1lID0gY2hlY2tTYW1lT3JpZ2luKHNvdXJjZSwgdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gaXNTYW1lO1xufVxuXG5mdW5jdGlvbiBpc1BsYXRmb3JtU3VwcG9ydGVkKCkge1xuICByZXR1cm4gaXNCcm93c2VyICYmIHR5cGVvZiBTZXQgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIEpTT04uc3RyaW5naWZ5ID09PSAnZnVuY3Rpb24nICYmIFBFUkYgJiYgdHlwZW9mIFBFUkYubm93ID09PSAnZnVuY3Rpb24nICYmIGlzQ09SU1N1cHBvcnRlZCgpO1xufVxuXG5mdW5jdGlvbiBzZXRMYWJlbChrZXksIHZhbHVlLCBvYmopIHtcbiAgaWYgKCFvYmogfHwgIWtleSkgcmV0dXJuO1xuICB2YXIgc2tleSA9IHJlbW92ZUludmFsaWRDaGFycyhrZXkpO1xuICB2YXIgdmFsdWVUeXBlID0gdHlwZW9mIHZhbHVlO1xuXG4gIGlmICh2YWx1ZSAhPSB1bmRlZmluZWQgJiYgdmFsdWVUeXBlICE9PSAnYm9vbGVhbicgJiYgdmFsdWVUeXBlICE9PSAnbnVtYmVyJykge1xuICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIG9ialtza2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqO1xufVxuXG5mdW5jdGlvbiBnZXRTZXJ2ZXJUaW1pbmdJbmZvKHNlcnZlclRpbWluZ0VudHJpZXMpIHtcbiAgaWYgKHNlcnZlclRpbWluZ0VudHJpZXMgPT09IHZvaWQgMCkge1xuICAgIHNlcnZlclRpbWluZ0VudHJpZXMgPSBbXTtcbiAgfVxuXG4gIHZhciBzZXJ2ZXJUaW1pbmdJbmZvID0gW107XG4gIHZhciBlbnRyeVNlcGFyYXRvciA9ICcsICc7XG4gIHZhciB2YWx1ZVNlcGFyYXRvciA9ICc7JztcblxuICBmb3IgKHZhciBfaTIgPSAwOyBfaTIgPCBzZXJ2ZXJUaW1pbmdFbnRyaWVzLmxlbmd0aDsgX2kyKyspIHtcbiAgICB2YXIgX3NlcnZlclRpbWluZ0VudHJpZXMkID0gc2VydmVyVGltaW5nRW50cmllc1tfaTJdLFxuICAgICAgICBuYW1lID0gX3NlcnZlclRpbWluZ0VudHJpZXMkLm5hbWUsXG4gICAgICAgIGR1cmF0aW9uID0gX3NlcnZlclRpbWluZ0VudHJpZXMkLmR1cmF0aW9uLFxuICAgICAgICBkZXNjcmlwdGlvbiA9IF9zZXJ2ZXJUaW1pbmdFbnRyaWVzJC5kZXNjcmlwdGlvbjtcbiAgICB2YXIgdGltaW5nVmFsdWUgPSBuYW1lO1xuXG4gICAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgICB0aW1pbmdWYWx1ZSArPSB2YWx1ZVNlcGFyYXRvciArICdkZXNjPScgKyBkZXNjcmlwdGlvbjtcbiAgICB9XG5cbiAgICBpZiAoZHVyYXRpb24pIHtcbiAgICAgIHRpbWluZ1ZhbHVlICs9IHZhbHVlU2VwYXJhdG9yICsgJ2R1cj0nICsgZHVyYXRpb247XG4gICAgfVxuXG4gICAgc2VydmVyVGltaW5nSW5mby5wdXNoKHRpbWluZ1ZhbHVlKTtcbiAgfVxuXG4gIHJldHVybiBzZXJ2ZXJUaW1pbmdJbmZvLmpvaW4oZW50cnlTZXBhcmF0b3IpO1xufVxuXG5mdW5jdGlvbiBnZXRUaW1lT3JpZ2luKCkge1xuICByZXR1cm4gUEVSRi50aW1pbmcuZmV0Y2hTdGFydDtcbn1cblxuZnVuY3Rpb24gc3RyaXBRdWVyeVN0cmluZ0Zyb21VcmwodXJsKSB7XG4gIHJldHVybiB1cmwgJiYgdXJsLnNwbGl0KCc/JylbMF07XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnO1xufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGJhc2VFeHRlbmQoZHN0LCBvYmpzLCBkZWVwKSB7XG4gIGZvciAodmFyIGkgPSAwLCBpaSA9IG9ianMubGVuZ3RoOyBpIDwgaWk7ICsraSkge1xuICAgIHZhciBvYmogPSBvYmpzW2ldO1xuICAgIGlmICghaXNPYmplY3Qob2JqKSAmJiAhaXNGdW5jdGlvbihvYmopKSBjb250aW51ZTtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG5cbiAgICBmb3IgKHZhciBqID0gMCwgamogPSBrZXlzLmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2pdO1xuICAgICAgdmFyIHNyYyA9IG9ialtrZXldO1xuXG4gICAgICBpZiAoZGVlcCAmJiBpc09iamVjdChzcmMpKSB7XG4gICAgICAgIGlmICghaXNPYmplY3QoZHN0W2tleV0pKSBkc3Rba2V5XSA9IEFycmF5LmlzQXJyYXkoc3JjKSA/IFtdIDoge307XG4gICAgICAgIGJhc2VFeHRlbmQoZHN0W2tleV0sIFtzcmNdLCBmYWxzZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkc3Rba2V5XSA9IHNyYztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZHN0O1xufVxuXG5mdW5jdGlvbiBnZXRFbGFzdGljU2NyaXB0KCkge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBzY3JpcHRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdmFyIHNjID0gc2NyaXB0c1tpXTtcblxuICAgICAgaWYgKHNjLnNyYy5pbmRleE9mKCdlbGFzdGljJykgPiAwKSB7XG4gICAgICAgIHJldHVybiBzYztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Q3VycmVudFNjcmlwdCgpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB2YXIgY3VycmVudFNjcmlwdCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQ7XG5cbiAgICBpZiAoIWN1cnJlbnRTY3JpcHQpIHtcbiAgICAgIHJldHVybiBnZXRFbGFzdGljU2NyaXB0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnJlbnRTY3JpcHQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gZXh0ZW5kKGRzdCkge1xuICByZXR1cm4gYmFzZUV4dGVuZChkc3QsIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBtZXJnZShkc3QpIHtcbiAgcmV0dXJuIGJhc2VFeHRlbmQoZHN0LCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIHRydWUpO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnO1xufVxuXG5mdW5jdGlvbiBub29wKCkge31cblxuZnVuY3Rpb24gZmluZChhcnJheSwgcHJlZGljYXRlLCB0aGlzQXJnKSB7XG4gIGlmIChhcnJheSA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJyYXkgaXMgbnVsbCBvciBub3QgZGVmaW5lZCcpO1xuICB9XG5cbiAgdmFyIG8gPSBPYmplY3QoYXJyYXkpO1xuICB2YXIgbGVuID0gby5sZW5ndGggPj4+IDA7XG5cbiAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdwcmVkaWNhdGUgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gIH1cblxuICB2YXIgayA9IDA7XG5cbiAgd2hpbGUgKGsgPCBsZW4pIHtcbiAgICB2YXIga1ZhbHVlID0gb1trXTtcblxuICAgIGlmIChwcmVkaWNhdGUuY2FsbCh0aGlzQXJnLCBrVmFsdWUsIGssIG8pKSB7XG4gICAgICByZXR1cm4ga1ZhbHVlO1xuICAgIH1cblxuICAgIGsrKztcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUludmFsaWRDaGFycyhrZXkpIHtcbiAgcmV0dXJuIGtleS5yZXBsYWNlKC9bLipcIl0vZywgJ18nKTtcbn1cblxuZnVuY3Rpb24gZ2V0TGF0ZXN0U3BhbihzcGFucywgdHlwZUZpbHRlcikge1xuICB2YXIgbGF0ZXN0U3BhbiA9IG51bGw7XG5cbiAgZm9yICh2YXIgX2kzID0gMDsgX2kzIDwgc3BhbnMubGVuZ3RoOyBfaTMrKykge1xuICAgIHZhciBzcGFuID0gc3BhbnNbX2kzXTtcblxuICAgIGlmICh0eXBlRmlsdGVyICYmIHR5cGVGaWx0ZXIoc3Bhbi50eXBlKSAmJiAoIWxhdGVzdFNwYW4gfHwgbGF0ZXN0U3Bhbi5fZW5kIDwgc3Bhbi5fZW5kKSkge1xuICAgICAgbGF0ZXN0U3BhbiA9IHNwYW47XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGxhdGVzdFNwYW47XG59XG5cbmZ1bmN0aW9uIGdldExhdGVzdE5vblhIUlNwYW4oc3BhbnMpIHtcbiAgcmV0dXJuIGdldExhdGVzdFNwYW4oc3BhbnMsIGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgcmV0dXJuIFN0cmluZyh0eXBlKS5pbmRleE9mKCdleHRlcm5hbCcpID09PSAtMTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldExhdGVzdFhIUlNwYW4oc3BhbnMpIHtcbiAgcmV0dXJuIGdldExhdGVzdFNwYW4oc3BhbnMsIGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgcmV0dXJuIFN0cmluZyh0eXBlKS5pbmRleE9mKCdleHRlcm5hbCcpICE9PSAtMTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEVhcmxpZXN0U3BhbihzcGFucykge1xuICB2YXIgZWFybGllc3RTcGFuID0gc3BhbnNbMF07XG5cbiAgZm9yICh2YXIgX2k0ID0gMTsgX2k0IDwgc3BhbnMubGVuZ3RoOyBfaTQrKykge1xuICAgIHZhciBzcGFuID0gc3BhbnNbX2k0XTtcblxuICAgIGlmIChlYXJsaWVzdFNwYW4uX3N0YXJ0ID4gc3Bhbi5fc3RhcnQpIHtcbiAgICAgIGVhcmxpZXN0U3BhbiA9IHNwYW47XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVhcmxpZXN0U3Bhbjtcbn1cblxuZnVuY3Rpb24gbm93KCkge1xuICByZXR1cm4gUEVSRi5ub3coKTtcbn1cblxuZnVuY3Rpb24gZ2V0VGltZSh0aW1lKSB7XG4gIHJldHVybiB0eXBlb2YgdGltZSA9PT0gJ251bWJlcicgJiYgdGltZSA+PSAwID8gdGltZSA6IG5vdygpO1xufVxuXG5mdW5jdGlvbiBnZXREdXJhdGlvbihzdGFydCwgZW5kKSB7XG4gIGlmIChpc1VuZGVmaW5lZChlbmQpIHx8IGlzVW5kZWZpbmVkKHN0YXJ0KSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHBhcnNlSW50KGVuZCAtIHN0YXJ0KTtcbn1cblxuZnVuY3Rpb24gc2NoZWR1bGVNYWNyb1Rhc2soY2FsbGJhY2spIHtcbiAgc2V0VGltZW91dChjYWxsYmFjaywgMCk7XG59XG5cbmZ1bmN0aW9uIHNjaGVkdWxlTWljcm9UYXNrKGNhbGxiYWNrKSB7XG4gIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oY2FsbGJhY2spO1xufVxuXG5mdW5jdGlvbiBpc1BlcmZUaW1lbGluZVN1cHBvcnRlZCgpIHtcbiAgcmV0dXJuIHR5cGVvZiBQRVJGLmdldEVudHJpZXNCeVR5cGUgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzUGVyZlR5cGVTdXBwb3J0ZWQodHlwZSkge1xuICByZXR1cm4gdHlwZW9mIFBlcmZvcm1hbmNlT2JzZXJ2ZXIgIT09ICd1bmRlZmluZWQnICYmIFBlcmZvcm1hbmNlT2JzZXJ2ZXIuc3VwcG9ydGVkRW50cnlUeXBlcyAmJiBQZXJmb3JtYW5jZU9ic2VydmVyLnN1cHBvcnRlZEVudHJ5VHlwZXMuaW5kZXhPZih0eXBlKSA+PSAwO1xufVxuXG5mdW5jdGlvbiBpc0JlYWNvbkluc3BlY3Rpb25FbmFibGVkKCkge1xuICB2YXIgZmxhZ05hbWUgPSAnX2VsYXN0aWNfaW5zcGVjdF9iZWFjb25fJztcblxuICBpZiAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShmbGFnTmFtZSkgIT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKCF3aW5kb3cuVVJMIHx8ICF3aW5kb3cuVVJMU2VhcmNoUGFyYW1zKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdHJ5IHtcbiAgICB2YXIgcGFyc2VkVXJsID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgdmFyIGlzRmxhZ1NldCA9IHBhcnNlZFVybC5zZWFyY2hQYXJhbXMuaGFzKGZsYWdOYW1lKTtcblxuICAgIGlmIChpc0ZsYWdTZXQpIHtcbiAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oZmxhZ05hbWUsIHRydWUpO1xuICAgIH1cblxuICAgIHJldHVybiBpc0ZsYWdTZXQ7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc1JlZGlyZWN0SW5mb0F2YWlsYWJsZSh0aW1pbmcpIHtcbiAgcmV0dXJuIHRpbWluZy5yZWRpcmVjdFN0YXJ0ID4gMDtcbn1cblxuZXhwb3J0IHsgZXh0ZW5kLCBtZXJnZSwgaXNVbmRlZmluZWQsIG5vb3AsIGJhc2VFeHRlbmQsIGJ5dGVzVG9IZXgsIGlzQ09SU1N1cHBvcnRlZCwgaXNPYmplY3QsIGlzRnVuY3Rpb24sIGlzUGxhdGZvcm1TdXBwb3J0ZWQsIGlzRHRIZWFkZXJWYWxpZCwgcGFyc2VEdEhlYWRlclZhbHVlLCBnZXRTZXJ2ZXJUaW1pbmdJbmZvLCBnZXREdEhlYWRlclZhbHVlLCBnZXRUU0hlYWRlclZhbHVlLCBnZXRDdXJyZW50U2NyaXB0LCBnZXRFbGFzdGljU2NyaXB0LCBnZXRUaW1lT3JpZ2luLCBnZW5lcmF0ZVJhbmRvbUlkLCBnZXRFYXJsaWVzdFNwYW4sIGdldExhdGVzdE5vblhIUlNwYW4sIGdldExhdGVzdFhIUlNwYW4sIGdldER1cmF0aW9uLCBnZXRUaW1lLCBub3csIHJuZywgY2hlY2tTYW1lT3JpZ2luLCBzY2hlZHVsZU1hY3JvVGFzaywgc2NoZWR1bGVNaWNyb1Rhc2ssIHNldExhYmVsLCBzZXRSZXF1ZXN0SGVhZGVyLCBzdHJpcFF1ZXJ5U3RyaW5nRnJvbVVybCwgZmluZCwgcmVtb3ZlSW52YWxpZENoYXJzLCBQRVJGLCBpc1BlcmZUaW1lbGluZVN1cHBvcnRlZCwgaXNCcm93c2VyLCBpc1BlcmZUeXBlU3VwcG9ydGVkLCBpc0JlYWNvbkluc3BlY3Rpb25FbmFibGVkLCBpc1JlZGlyZWN0SW5mb0F2YWlsYWJsZSB9OyIsInZhciBfZXhjbHVkZWQgPSBbXCJ0YWdzXCJdO1xuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKSB7IGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9OyB2YXIgdGFyZ2V0ID0ge307IHZhciBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTsgdmFyIGtleSwgaTsgZm9yIChpID0gMDsgaSA8IHNvdXJjZUtleXMubGVuZ3RoOyBpKyspIHsga2V5ID0gc291cmNlS2V5c1tpXTsgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbmltcG9ydCB7IGNyZWF0ZVN0YWNrVHJhY2VzLCBmaWx0ZXJJbnZhbGlkRnJhbWVzIH0gZnJvbSAnLi9zdGFjay10cmFjZSc7XG5pbXBvcnQgeyBnZW5lcmF0ZVJhbmRvbUlkLCBtZXJnZSwgZXh0ZW5kIH0gZnJvbSAnLi4vY29tbW9uL3V0aWxzJztcbmltcG9ydCB7IGdldFBhZ2VDb250ZXh0IH0gZnJvbSAnLi4vY29tbW9uL2NvbnRleHQnO1xuaW1wb3J0IHsgdHJ1bmNhdGVNb2RlbCwgRVJST1JfTU9ERUwgfSBmcm9tICcuLi9jb21tb24vdHJ1bmNhdGUnO1xuaW1wb3J0IHN0YWNrUGFyc2VyIGZyb20gJ2Vycm9yLXN0YWNrLXBhcnNlcic7XG52YXIgSUdOT1JFX0tFWVMgPSBbJ3N0YWNrJywgJ21lc3NhZ2UnXTtcbnZhciBQUk9NSVNFX1JFSkVDVElPTl9QUkVGSVggPSAnVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uOiAnO1xuXG5mdW5jdGlvbiBnZXRFcnJvclByb3BlcnRpZXMoZXJyb3IpIHtcbiAgdmFyIHByb3BlcnR5Rm91bmQgPSBmYWxzZTtcbiAgdmFyIHByb3BlcnRpZXMgPSB7fTtcbiAgT2JqZWN0LmtleXMoZXJyb3IpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGlmIChJR05PUkVfS0VZUy5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciB2YWwgPSBlcnJvcltrZXldO1xuXG4gICAgaWYgKHZhbCA9PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsLnRvSVNPU3RyaW5nICE9PSAnZnVuY3Rpb24nKSByZXR1cm47XG4gICAgICB2YWwgPSB2YWwudG9JU09TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBwcm9wZXJ0aWVzW2tleV0gPSB2YWw7XG4gICAgcHJvcGVydHlGb3VuZCA9IHRydWU7XG4gIH0pO1xuXG4gIGlmIChwcm9wZXJ0eUZvdW5kKSB7XG4gICAgcmV0dXJuIHByb3BlcnRpZXM7XG4gIH1cbn1cblxudmFyIEVycm9yTG9nZ2luZyA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRXJyb3JMb2dnaW5nKGFwbVNlcnZlciwgY29uZmlnU2VydmljZSwgdHJhbnNhY3Rpb25TZXJ2aWNlKSB7XG4gICAgdGhpcy5fYXBtU2VydmVyID0gYXBtU2VydmVyO1xuICAgIHRoaXMuX2NvbmZpZ1NlcnZpY2UgPSBjb25maWdTZXJ2aWNlO1xuICAgIHRoaXMuX3RyYW5zYWN0aW9uU2VydmljZSA9IHRyYW5zYWN0aW9uU2VydmljZTtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBFcnJvckxvZ2dpbmcucHJvdG90eXBlO1xuXG4gIF9wcm90by5jcmVhdGVFcnJvckRhdGFNb2RlbCA9IGZ1bmN0aW9uIGNyZWF0ZUVycm9yRGF0YU1vZGVsKGVycm9yRXZlbnQpIHtcbiAgICB2YXIgZnJhbWVzID0gY3JlYXRlU3RhY2tUcmFjZXMoc3RhY2tQYXJzZXIsIGVycm9yRXZlbnQpO1xuICAgIHZhciBmaWx0ZXJlZEZyYW1lcyA9IGZpbHRlckludmFsaWRGcmFtZXMoZnJhbWVzKTtcbiAgICB2YXIgY3VscHJpdCA9ICcoaW5saW5lIHNjcmlwdCknO1xuICAgIHZhciBsYXN0RnJhbWUgPSBmaWx0ZXJlZEZyYW1lc1tmaWx0ZXJlZEZyYW1lcy5sZW5ndGggLSAxXTtcblxuICAgIGlmIChsYXN0RnJhbWUgJiYgbGFzdEZyYW1lLmZpbGVuYW1lKSB7XG4gICAgICBjdWxwcml0ID0gbGFzdEZyYW1lLmZpbGVuYW1lO1xuICAgIH1cblxuICAgIHZhciBtZXNzYWdlID0gZXJyb3JFdmVudC5tZXNzYWdlLFxuICAgICAgICBlcnJvciA9IGVycm9yRXZlbnQuZXJyb3I7XG4gICAgdmFyIGVycm9yTWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdmFyIGVycm9yVHlwZSA9ICcnO1xuICAgIHZhciBlcnJvckNvbnRleHQgPSB7fTtcblxuICAgIGlmIChlcnJvciAmJiB0eXBlb2YgZXJyb3IgPT09ICdvYmplY3QnKSB7XG4gICAgICBlcnJvck1lc3NhZ2UgPSBlcnJvck1lc3NhZ2UgfHwgZXJyb3IubWVzc2FnZTtcbiAgICAgIGVycm9yVHlwZSA9IGVycm9yLm5hbWU7XG4gICAgICB2YXIgY3VzdG9tUHJvcGVydGllcyA9IGdldEVycm9yUHJvcGVydGllcyhlcnJvcik7XG5cbiAgICAgIGlmIChjdXN0b21Qcm9wZXJ0aWVzKSB7XG4gICAgICAgIGVycm9yQ29udGV4dC5jdXN0b20gPSBjdXN0b21Qcm9wZXJ0aWVzO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZXJyb3JUeXBlKSB7XG4gICAgICBpZiAoZXJyb3JNZXNzYWdlICYmIGVycm9yTWVzc2FnZS5pbmRleE9mKCc6JykgPiAtMSkge1xuICAgICAgICBlcnJvclR5cGUgPSBlcnJvck1lc3NhZ2Uuc3BsaXQoJzonKVswXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY3VycmVudFRyYW5zYWN0aW9uID0gdGhpcy5fdHJhbnNhY3Rpb25TZXJ2aWNlLmdldEN1cnJlbnRUcmFuc2FjdGlvbigpO1xuXG4gICAgdmFyIHRyYW5zYWN0aW9uQ29udGV4dCA9IGN1cnJlbnRUcmFuc2FjdGlvbiA/IGN1cnJlbnRUcmFuc2FjdGlvbi5jb250ZXh0IDoge307XG5cbiAgICB2YXIgX3RoaXMkX2NvbmZpZ1NlcnZpY2UkID0gdGhpcy5fY29uZmlnU2VydmljZS5nZXQoJ2NvbnRleHQnKSxcbiAgICAgICAgdGFncyA9IF90aGlzJF9jb25maWdTZXJ2aWNlJC50YWdzLFxuICAgICAgICBjb25maWdDb250ZXh0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3RoaXMkX2NvbmZpZ1NlcnZpY2UkLCBfZXhjbHVkZWQpO1xuXG4gICAgdmFyIHBhZ2VDb250ZXh0ID0gZ2V0UGFnZUNvbnRleHQoKTtcbiAgICB2YXIgY29udGV4dCA9IG1lcmdlKHt9LCBwYWdlQ29udGV4dCwgdHJhbnNhY3Rpb25Db250ZXh0LCBjb25maWdDb250ZXh0LCBlcnJvckNvbnRleHQpO1xuICAgIHZhciBlcnJvck9iamVjdCA9IHtcbiAgICAgIGlkOiBnZW5lcmF0ZVJhbmRvbUlkKCksXG4gICAgICBjdWxwcml0OiBjdWxwcml0LFxuICAgICAgZXhjZXB0aW9uOiB7XG4gICAgICAgIG1lc3NhZ2U6IGVycm9yTWVzc2FnZSxcbiAgICAgICAgc3RhY2t0cmFjZTogZmlsdGVyZWRGcmFtZXMsXG4gICAgICAgIHR5cGU6IGVycm9yVHlwZVxuICAgICAgfSxcbiAgICAgIGNvbnRleHQ6IGNvbnRleHRcbiAgICB9O1xuXG4gICAgaWYgKGN1cnJlbnRUcmFuc2FjdGlvbikge1xuICAgICAgZXJyb3JPYmplY3QgPSBleHRlbmQoZXJyb3JPYmplY3QsIHtcbiAgICAgICAgdHJhY2VfaWQ6IGN1cnJlbnRUcmFuc2FjdGlvbi50cmFjZUlkLFxuICAgICAgICBwYXJlbnRfaWQ6IGN1cnJlbnRUcmFuc2FjdGlvbi5pZCxcbiAgICAgICAgdHJhbnNhY3Rpb25faWQ6IGN1cnJlbnRUcmFuc2FjdGlvbi5pZCxcbiAgICAgICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICAgICB0eXBlOiBjdXJyZW50VHJhbnNhY3Rpb24udHlwZSxcbiAgICAgICAgICBzYW1wbGVkOiBjdXJyZW50VHJhbnNhY3Rpb24uc2FtcGxlZFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1bmNhdGVNb2RlbChFUlJPUl9NT0RFTCwgZXJyb3JPYmplY3QpO1xuICB9O1xuXG4gIF9wcm90by5sb2dFcnJvckV2ZW50ID0gZnVuY3Rpb24gbG9nRXJyb3JFdmVudChlcnJvckV2ZW50KSB7XG4gICAgaWYgKHR5cGVvZiBlcnJvckV2ZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBlcnJvck9iamVjdCA9IHRoaXMuY3JlYXRlRXJyb3JEYXRhTW9kZWwoZXJyb3JFdmVudCk7XG5cbiAgICBpZiAodHlwZW9mIGVycm9yT2JqZWN0LmV4Y2VwdGlvbi5tZXNzYWdlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2FwbVNlcnZlci5hZGRFcnJvcihlcnJvck9iamVjdCk7XG4gIH07XG5cbiAgX3Byb3RvLnJlZ2lzdGVyTGlzdGVuZXJzID0gZnVuY3Rpb24gcmVnaXN0ZXJMaXN0ZW5lcnMoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvckV2ZW50KSB7XG4gICAgICByZXR1cm4gX3RoaXMubG9nRXJyb3JFdmVudChlcnJvckV2ZW50KTtcbiAgICB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndW5oYW5kbGVkcmVqZWN0aW9uJywgZnVuY3Rpb24gKHByb21pc2VSZWplY3Rpb25FdmVudCkge1xuICAgICAgcmV0dXJuIF90aGlzLmxvZ1Byb21pc2VFdmVudChwcm9taXNlUmVqZWN0aW9uRXZlbnQpO1xuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5sb2dQcm9taXNlRXZlbnQgPSBmdW5jdGlvbiBsb2dQcm9taXNlRXZlbnQocHJvbWlzZVJlamVjdGlvbkV2ZW50KSB7XG4gICAgdmFyIHJlYXNvbiA9IHByb21pc2VSZWplY3Rpb25FdmVudC5yZWFzb247XG5cbiAgICBpZiAocmVhc29uID09IG51bGwpIHtcbiAgICAgIHJlYXNvbiA9ICc8bm8gcmVhc29uIHNwZWNpZmllZD4nO1xuICAgIH1cblxuICAgIHZhciBlcnJvckV2ZW50O1xuXG4gICAgaWYgKHR5cGVvZiByZWFzb24ubWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHZhciBuYW1lID0gcmVhc29uLm5hbWUgPyByZWFzb24ubmFtZSArICc6ICcgOiAnJztcbiAgICAgIGVycm9yRXZlbnQgPSB7XG4gICAgICAgIGVycm9yOiByZWFzb24sXG4gICAgICAgIG1lc3NhZ2U6IFBST01JU0VfUkVKRUNUSU9OX1BSRUZJWCArIG5hbWUgKyByZWFzb24ubWVzc2FnZVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3JFdmVudCA9IHRoaXMuX3BhcnNlUmVqZWN0UmVhc29uKHJlYXNvbik7XG4gICAgfVxuXG4gICAgdGhpcy5sb2dFcnJvckV2ZW50KGVycm9yRXZlbnQpO1xuICB9O1xuXG4gIF9wcm90by5sb2dFcnJvciA9IGZ1bmN0aW9uIGxvZ0Vycm9yKG1lc3NhZ2VPckVycm9yKSB7XG4gICAgdmFyIGVycm9yRXZlbnQgPSB7fTtcblxuICAgIGlmICh0eXBlb2YgbWVzc2FnZU9yRXJyb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlcnJvckV2ZW50Lm1lc3NhZ2UgPSBtZXNzYWdlT3JFcnJvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3JFdmVudC5lcnJvciA9IG1lc3NhZ2VPckVycm9yO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmxvZ0Vycm9yRXZlbnQoZXJyb3JFdmVudCk7XG4gIH07XG5cbiAgX3Byb3RvLl9wYXJzZVJlamVjdFJlYXNvbiA9IGZ1bmN0aW9uIF9wYXJzZVJlamVjdFJlYXNvbihyZWFzb24pIHtcbiAgICB2YXIgZXJyb3JFdmVudCA9IHtcbiAgICAgIG1lc3NhZ2U6IFBST01JU0VfUkVKRUNUSU9OX1BSRUZJWFxuICAgIH07XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShyZWFzb24pKSB7XG4gICAgICBlcnJvckV2ZW50Lm1lc3NhZ2UgKz0gJzxvYmplY3Q+JztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiByZWFzb24gPT09ICdvYmplY3QnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBlcnJvckV2ZW50Lm1lc3NhZ2UgKz0gSlNPTi5zdHJpbmdpZnkocmVhc29uKTtcbiAgICAgICAgZXJyb3JFdmVudC5lcnJvciA9IHJlYXNvbjtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGVycm9yRXZlbnQubWVzc2FnZSArPSAnPG9iamVjdD4nO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlYXNvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZXJyb3JFdmVudC5tZXNzYWdlICs9ICc8ZnVuY3Rpb24+JztcbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3JFdmVudC5tZXNzYWdlICs9IHJlYXNvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gZXJyb3JFdmVudDtcbiAgfTtcblxuICByZXR1cm4gRXJyb3JMb2dnaW5nO1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBFcnJvckxvZ2dpbmc7IiwiaW1wb3J0IEVycm9yTG9nZ2luZyBmcm9tICcuL2Vycm9yLWxvZ2dpbmcnO1xuaW1wb3J0IHsgQ09ORklHX1NFUlZJQ0UsIFRSQU5TQUNUSU9OX1NFUlZJQ0UsIEVSUk9SX0xPR0dJTkcsIEFQTV9TRVJWRVIgfSBmcm9tICcuLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IHNlcnZpY2VDcmVhdG9ycyB9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlLWZhY3RvcnknO1xuXG5mdW5jdGlvbiByZWdpc3RlclNlcnZpY2VzKCkge1xuICBzZXJ2aWNlQ3JlYXRvcnNbRVJST1JfTE9HR0lOR10gPSBmdW5jdGlvbiAoc2VydmljZUZhY3RvcnkpIHtcbiAgICB2YXIgX3NlcnZpY2VGYWN0b3J5JGdldFNlID0gc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShbQVBNX1NFUlZFUiwgQ09ORklHX1NFUlZJQ0UsIFRSQU5TQUNUSU9OX1NFUlZJQ0VdKSxcbiAgICAgICAgYXBtU2VydmVyID0gX3NlcnZpY2VGYWN0b3J5JGdldFNlWzBdLFxuICAgICAgICBjb25maWdTZXJ2aWNlID0gX3NlcnZpY2VGYWN0b3J5JGdldFNlWzFdLFxuICAgICAgICB0cmFuc2FjdGlvblNlcnZpY2UgPSBfc2VydmljZUZhY3RvcnkkZ2V0U2VbMl07XG5cbiAgICByZXR1cm4gbmV3IEVycm9yTG9nZ2luZyhhcG1TZXJ2ZXIsIGNvbmZpZ1NlcnZpY2UsIHRyYW5zYWN0aW9uU2VydmljZSk7XG4gIH07XG59XG5cbmV4cG9ydCB7IHJlZ2lzdGVyU2VydmljZXMgfTsiLCJmdW5jdGlvbiBmaWxlUGF0aFRvRmlsZU5hbWUoZmlsZVVybCkge1xuICB2YXIgb3JpZ2luID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiB8fCB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lICsgKHdpbmRvdy5sb2NhdGlvbi5wb3J0ID8gJzonICsgd2luZG93LmxvY2F0aW9uLnBvcnQgOiAnJyk7XG5cbiAgaWYgKGZpbGVVcmwuaW5kZXhPZihvcmlnaW4pID4gLTEpIHtcbiAgICBmaWxlVXJsID0gZmlsZVVybC5yZXBsYWNlKG9yaWdpbiArICcvJywgJycpO1xuICB9XG5cbiAgcmV0dXJuIGZpbGVVcmw7XG59XG5cbmZ1bmN0aW9uIGNsZWFuRmlsZVBhdGgoZmlsZVBhdGgpIHtcbiAgaWYgKGZpbGVQYXRoID09PSB2b2lkIDApIHtcbiAgICBmaWxlUGF0aCA9ICcnO1xuICB9XG5cbiAgaWYgKGZpbGVQYXRoID09PSAnPGFub255bW91cz4nKSB7XG4gICAgZmlsZVBhdGggPSAnJztcbiAgfVxuXG4gIHJldHVybiBmaWxlUGF0aDtcbn1cblxuZnVuY3Rpb24gaXNGaWxlSW5saW5lKGZpbGVVcmwpIHtcbiAgaWYgKGZpbGVVcmwpIHtcbiAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZihmaWxlVXJsKSA9PT0gMDtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplU3RhY2tGcmFtZXMoc3RhY2tGcmFtZXMpIHtcbiAgcmV0dXJuIHN0YWNrRnJhbWVzLm1hcChmdW5jdGlvbiAoZnJhbWUpIHtcbiAgICBpZiAoZnJhbWUuZnVuY3Rpb25OYW1lKSB7XG4gICAgICBmcmFtZS5mdW5jdGlvbk5hbWUgPSBub3JtYWxpemVGdW5jdGlvbk5hbWUoZnJhbWUuZnVuY3Rpb25OYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnJhbWU7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVGdW5jdGlvbk5hbWUoZm5OYW1lKSB7XG4gIHZhciBwYXJ0cyA9IGZuTmFtZS5zcGxpdCgnLycpO1xuXG4gIGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XG4gICAgZm5OYW1lID0gWydPYmplY3QnLCBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXV0uam9pbignLicpO1xuICB9IGVsc2Uge1xuICAgIGZuTmFtZSA9IHBhcnRzWzBdO1xuICB9XG5cbiAgZm5OYW1lID0gZm5OYW1lLnJlcGxhY2UoLy48JC9naSwgJy48YW5vbnltb3VzPicpO1xuICBmbk5hbWUgPSBmbk5hbWUucmVwbGFjZSgvXkFub255bW91cyBmdW5jdGlvbiQvLCAnPGFub255bW91cz4nKTtcbiAgcGFydHMgPSBmbk5hbWUuc3BsaXQoJy4nKTtcblxuICBpZiAocGFydHMubGVuZ3RoID4gMSkge1xuICAgIGZuTmFtZSA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xuICB9IGVsc2Uge1xuICAgIGZuTmFtZSA9IHBhcnRzWzBdO1xuICB9XG5cbiAgcmV0dXJuIGZuTmFtZTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZFN0YWNrVHJhY2Uoc3RhY2tUcmFjZXMpIHtcbiAgaWYgKHN0YWNrVHJhY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChzdGFja1RyYWNlcy5sZW5ndGggPT09IDEpIHtcbiAgICB2YXIgc3RhY2tUcmFjZSA9IHN0YWNrVHJhY2VzWzBdO1xuICAgIHJldHVybiAnbGluZU51bWJlcicgaW4gc3RhY2tUcmFjZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3RhY2tUcmFjZXMoc3RhY2tQYXJzZXIsIGVycm9yRXZlbnQpIHtcbiAgdmFyIGVycm9yID0gZXJyb3JFdmVudC5lcnJvcixcbiAgICAgIGZpbGVuYW1lID0gZXJyb3JFdmVudC5maWxlbmFtZSxcbiAgICAgIGxpbmVubyA9IGVycm9yRXZlbnQubGluZW5vLFxuICAgICAgY29sbm8gPSBlcnJvckV2ZW50LmNvbG5vO1xuICB2YXIgc3RhY2tUcmFjZXMgPSBbXTtcblxuICBpZiAoZXJyb3IpIHtcbiAgICB0cnkge1xuICAgICAgc3RhY2tUcmFjZXMgPSBzdGFja1BhcnNlci5wYXJzZShlcnJvcik7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuXG4gIGlmICghaXNWYWxpZFN0YWNrVHJhY2Uoc3RhY2tUcmFjZXMpKSB7XG4gICAgc3RhY2tUcmFjZXMgPSBbe1xuICAgICAgZmlsZU5hbWU6IGZpbGVuYW1lLFxuICAgICAgbGluZU51bWJlcjogbGluZW5vLFxuICAgICAgY29sdW1uTnVtYmVyOiBjb2xub1xuICAgIH1dO1xuICB9XG5cbiAgdmFyIG5vcm1hbGl6ZWRTdGFja1RyYWNlcyA9IG5vcm1hbGl6ZVN0YWNrRnJhbWVzKHN0YWNrVHJhY2VzKTtcbiAgcmV0dXJuIG5vcm1hbGl6ZWRTdGFja1RyYWNlcy5tYXAoZnVuY3Rpb24gKHN0YWNrKSB7XG4gICAgdmFyIGZpbGVOYW1lID0gc3RhY2suZmlsZU5hbWUsXG4gICAgICAgIGxpbmVOdW1iZXIgPSBzdGFjay5saW5lTnVtYmVyLFxuICAgICAgICBjb2x1bW5OdW1iZXIgPSBzdGFjay5jb2x1bW5OdW1iZXIsXG4gICAgICAgIF9zdGFjayRmdW5jdGlvbk5hbWUgPSBzdGFjay5mdW5jdGlvbk5hbWUsXG4gICAgICAgIGZ1bmN0aW9uTmFtZSA9IF9zdGFjayRmdW5jdGlvbk5hbWUgPT09IHZvaWQgMCA/ICc8YW5vbnltb3VzPicgOiBfc3RhY2skZnVuY3Rpb25OYW1lO1xuXG4gICAgaWYgKCFmaWxlTmFtZSAmJiAhbGluZU51bWJlcikge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIGlmICghY29sdW1uTnVtYmVyICYmICFsaW5lTnVtYmVyKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgdmFyIGZpbGVQYXRoID0gY2xlYW5GaWxlUGF0aChmaWxlTmFtZSk7XG4gICAgdmFyIGNsZWFuZWRGaWxlTmFtZSA9IGZpbGVQYXRoVG9GaWxlTmFtZShmaWxlUGF0aCk7XG5cbiAgICBpZiAoaXNGaWxlSW5saW5lKGZpbGVQYXRoKSkge1xuICAgICAgY2xlYW5lZEZpbGVOYW1lID0gJyhpbmxpbmUgc2NyaXB0KSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFic19wYXRoOiBmaWxlTmFtZSxcbiAgICAgIGZpbGVuYW1lOiBjbGVhbmVkRmlsZU5hbWUsXG4gICAgICBmdW5jdGlvbjogZnVuY3Rpb25OYW1lLFxuICAgICAgbGluZW5vOiBsaW5lTnVtYmVyLFxuICAgICAgY29sbm86IGNvbHVtbk51bWJlclxuICAgIH07XG4gIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckludmFsaWRGcmFtZXMoZnJhbWVzKSB7XG4gIHJldHVybiBmcmFtZXMuZmlsdGVyKGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgdmFyIGZpbGVuYW1lID0gX3JlZi5maWxlbmFtZSxcbiAgICAgICAgbGluZW5vID0gX3JlZi5saW5lbm87XG4gICAgcmV0dXJuIHR5cGVvZiBmaWxlbmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGxpbmVubyAhPT0gJ3VuZGVmaW5lZCc7XG4gIH0pO1xufSIsImltcG9ydCB7IHJlZ2lzdGVyU2VydmljZXMgYXMgcmVnaXN0ZXJFcnJvclNlcnZpY2VzIH0gZnJvbSAnLi9lcnJvci1sb2dnaW5nJztcbmltcG9ydCB7IHJlZ2lzdGVyU2VydmljZXMgYXMgcmVnaXN0ZXJQZXJmU2VydmljZXMgfSBmcm9tICcuL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcnO1xuaW1wb3J0IHsgU2VydmljZUZhY3RvcnkgfSBmcm9tICcuL2NvbW1vbi9zZXJ2aWNlLWZhY3RvcnknO1xuaW1wb3J0IHsgaXNQbGF0Zm9ybVN1cHBvcnRlZCwgc2NoZWR1bGVNaWNyb1Rhc2ssIHNjaGVkdWxlTWFjcm9UYXNrLCBpc0Jyb3dzZXIgfSBmcm9tICcuL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgeyBwYXRjaEFsbCwgcGF0Y2hFdmVudEhhbmRsZXIgfSBmcm9tICcuL2NvbW1vbi9wYXRjaGluZyc7XG5pbXBvcnQgeyBvYnNlcnZlUGFnZVZpc2liaWxpdHksIG9ic2VydmVQYWdlQ2xpY2tzIH0gZnJvbSAnLi9jb21tb24vb2JzZXJ2ZXJzJztcbmltcG9ydCB7IFBBR0VfTE9BRF9ERUxBWSwgUEFHRV9MT0FELCBFUlJPUiwgQ09ORklHX1NFUlZJQ0UsIExPR0dJTkdfU0VSVklDRSwgVFJBTlNBQ1RJT05fU0VSVklDRSwgQVBNX1NFUlZFUiwgUEVSRk9STUFOQ0VfTU9OSVRPUklORywgRVJST1JfTE9HR0lORywgRVZFTlRfVEFSR0VULCBDTElDSyB9IGZyb20gJy4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBnZXRJbnN0cnVtZW50YXRpb25GbGFncyB9IGZyb20gJy4vY29tbW9uL2luc3RydW1lbnQnO1xuaW1wb3J0IGFmdGVyRnJhbWUgZnJvbSAnLi9jb21tb24vYWZ0ZXItZnJhbWUnO1xuaW1wb3J0IHsgYm9vdHN0cmFwIH0gZnJvbSAnLi9ib290c3RyYXAnO1xuaW1wb3J0IHsgY3JlYXRlVHJhY2VyIH0gZnJvbSAnLi9vcGVudHJhY2luZyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlcnZpY2VGYWN0b3J5KCkge1xuICByZWdpc3RlclBlcmZTZXJ2aWNlcygpO1xuICByZWdpc3RlckVycm9yU2VydmljZXMoKTtcbiAgdmFyIHNlcnZpY2VGYWN0b3J5ID0gbmV3IFNlcnZpY2VGYWN0b3J5KCk7XG4gIHJldHVybiBzZXJ2aWNlRmFjdG9yeTtcbn1cblxuZXhwb3J0IHsgY3JlYXRlU2VydmljZUZhY3RvcnksIFNlcnZpY2VGYWN0b3J5LCBwYXRjaEFsbCwgcGF0Y2hFdmVudEhhbmRsZXIsIGlzUGxhdGZvcm1TdXBwb3J0ZWQsIGlzQnJvd3NlciwgZ2V0SW5zdHJ1bWVudGF0aW9uRmxhZ3MsIGNyZWF0ZVRyYWNlciwgc2NoZWR1bGVNaWNyb1Rhc2ssIHNjaGVkdWxlTWFjcm9UYXNrLCBhZnRlckZyYW1lLCBFUlJPUiwgUEFHRV9MT0FEX0RFTEFZLCBQQUdFX0xPQUQsIENPTkZJR19TRVJWSUNFLCBMT0dHSU5HX1NFUlZJQ0UsIFRSQU5TQUNUSU9OX1NFUlZJQ0UsIEFQTV9TRVJWRVIsIFBFUkZPUk1BTkNFX01PTklUT1JJTkcsIEVSUk9SX0xPR0dJTkcsIEVWRU5UX1RBUkdFVCwgQ0xJQ0ssIGJvb3RzdHJhcCwgb2JzZXJ2ZVBhZ2VWaXNpYmlsaXR5LCBvYnNlcnZlUGFnZUNsaWNrcyB9OyIsImltcG9ydCBUcmFjZXIgZnJvbSAnLi90cmFjZXInO1xuaW1wb3J0IFNwYW4gZnJvbSAnLi9zcGFuJztcbmltcG9ydCB7IFRSQU5TQUNUSU9OX1NFUlZJQ0UsIExPR0dJTkdfU0VSVklDRSwgUEVSRk9STUFOQ0VfTU9OSVRPUklORywgRVJST1JfTE9HR0lORyB9IGZyb20gJy4uL2NvbW1vbi9jb25zdGFudHMnO1xuXG5mdW5jdGlvbiBjcmVhdGVUcmFjZXIoc2VydmljZUZhY3RvcnkpIHtcbiAgdmFyIHBlcmZvcm1hbmNlTW9uaXRvcmluZyA9IHNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoUEVSRk9STUFOQ0VfTU9OSVRPUklORyk7XG4gIHZhciB0cmFuc2FjdGlvblNlcnZpY2UgPSBzZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKFRSQU5TQUNUSU9OX1NFUlZJQ0UpO1xuICB2YXIgZXJyb3JMb2dnaW5nID0gc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShFUlJPUl9MT0dHSU5HKTtcbiAgdmFyIGxvZ2dpbmdTZXJ2aWNlID0gc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShMT0dHSU5HX1NFUlZJQ0UpO1xuICByZXR1cm4gbmV3IFRyYWNlcihwZXJmb3JtYW5jZU1vbml0b3JpbmcsIHRyYW5zYWN0aW9uU2VydmljZSwgbG9nZ2luZ1NlcnZpY2UsIGVycm9yTG9nZ2luZyk7XG59XG5cbmV4cG9ydCB7IFNwYW4sIFRyYWNlciwgY3JlYXRlVHJhY2VyIH07IiwiZnVuY3Rpb24gX2luaGVyaXRzTG9vc2Uoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzLnByb3RvdHlwZSk7IHN1YkNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHN1YkNsYXNzOyBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmltcG9ydCB7IFNwYW4gYXMgb3RTcGFuIH0gZnJvbSAnb3BlbnRyYWNpbmcvbGliL3NwYW4nO1xuaW1wb3J0IHsgZXh0ZW5kLCBnZXRUaW1lT3JpZ2luIH0gZnJvbSAnLi4vY29tbW9uL3V0aWxzJztcbmltcG9ydCBUcmFuc2FjdGlvbiBmcm9tICcuLi9wZXJmb3JtYW5jZS1tb25pdG9yaW5nL3RyYW5zYWN0aW9uJztcblxudmFyIFNwYW4gPSBmdW5jdGlvbiAoX290U3Bhbikge1xuICBfaW5oZXJpdHNMb29zZShTcGFuLCBfb3RTcGFuKTtcblxuICBmdW5jdGlvbiBTcGFuKHRyYWNlciwgc3Bhbikge1xuICAgIHZhciBfdGhpcztcblxuICAgIF90aGlzID0gX290U3Bhbi5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgX3RoaXMuX190cmFjZXIgPSB0cmFjZXI7XG4gICAgX3RoaXMuc3BhbiA9IHNwYW47XG4gICAgX3RoaXMuaXNUcmFuc2FjdGlvbiA9IHNwYW4gaW5zdGFuY2VvZiBUcmFuc2FjdGlvbjtcbiAgICBfdGhpcy5zcGFuQ29udGV4dCA9IHtcbiAgICAgIGlkOiBzcGFuLmlkLFxuICAgICAgdHJhY2VJZDogc3Bhbi50cmFjZUlkLFxuICAgICAgc2FtcGxlZDogc3Bhbi5zYW1wbGVkXG4gICAgfTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gU3Bhbi5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLl9jb250ZXh0ID0gZnVuY3Rpb24gX2NvbnRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3BhbkNvbnRleHQ7XG4gIH07XG5cbiAgX3Byb3RvLl90cmFjZXIgPSBmdW5jdGlvbiBfdHJhY2VyKCkge1xuICAgIHJldHVybiB0aGlzLl9fdHJhY2VyO1xuICB9O1xuXG4gIF9wcm90by5fc2V0T3BlcmF0aW9uTmFtZSA9IGZ1bmN0aW9uIF9zZXRPcGVyYXRpb25OYW1lKG5hbWUpIHtcbiAgICB0aGlzLnNwYW4ubmFtZSA9IG5hbWU7XG4gIH07XG5cbiAgX3Byb3RvLl9hZGRUYWdzID0gZnVuY3Rpb24gX2FkZFRhZ3Moa2V5VmFsdWVQYWlycykge1xuICAgIHZhciB0YWdzID0gZXh0ZW5kKHt9LCBrZXlWYWx1ZVBhaXJzKTtcblxuICAgIGlmICh0YWdzLnR5cGUpIHtcbiAgICAgIHRoaXMuc3Bhbi50eXBlID0gdGFncy50eXBlO1xuICAgICAgZGVsZXRlIHRhZ3MudHlwZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc1RyYW5zYWN0aW9uKSB7XG4gICAgICB2YXIgdXNlcklkID0gdGFnc1sndXNlci5pZCddO1xuICAgICAgdmFyIHVzZXJuYW1lID0gdGFnc1sndXNlci51c2VybmFtZSddO1xuICAgICAgdmFyIGVtYWlsID0gdGFnc1sndXNlci5lbWFpbCddO1xuXG4gICAgICBpZiAodXNlcklkIHx8IHVzZXJuYW1lIHx8IGVtYWlsKSB7XG4gICAgICAgIHRoaXMuc3Bhbi5hZGRDb250ZXh0KHtcbiAgICAgICAgICB1c2VyOiB7XG4gICAgICAgICAgICBpZDogdXNlcklkLFxuICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGVsZXRlIHRhZ3NbJ3VzZXIuaWQnXTtcbiAgICAgICAgZGVsZXRlIHRhZ3NbJ3VzZXIudXNlcm5hbWUnXTtcbiAgICAgICAgZGVsZXRlIHRhZ3NbJ3VzZXIuZW1haWwnXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNwYW4uYWRkTGFiZWxzKHRhZ3MpO1xuICB9O1xuXG4gIF9wcm90by5fbG9nID0gZnVuY3Rpb24gX2xvZyhsb2csIHRpbWVzdGFtcCkge1xuICAgIGlmIChsb2cuZXZlbnQgPT09ICdlcnJvcicpIHtcbiAgICAgIGlmIChsb2dbJ2Vycm9yLm9iamVjdCddKSB7XG4gICAgICAgIHRoaXMuX190cmFjZXIuZXJyb3JMb2dnaW5nLmxvZ0Vycm9yKGxvZ1snZXJyb3Iub2JqZWN0J10pO1xuICAgICAgfSBlbHNlIGlmIChsb2cubWVzc2FnZSkge1xuICAgICAgICB0aGlzLl9fdHJhY2VyLmVycm9yTG9nZ2luZy5sb2dFcnJvcihsb2cubWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5fZmluaXNoID0gZnVuY3Rpb24gX2ZpbmlzaChmaW5pc2hUaW1lKSB7XG4gICAgdGhpcy5zcGFuLmVuZCgpO1xuXG4gICAgaWYgKGZpbmlzaFRpbWUpIHtcbiAgICAgIHRoaXMuc3Bhbi5fZW5kID0gZmluaXNoVGltZSAtIGdldFRpbWVPcmlnaW4oKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFNwYW47XG59KG90U3Bhbik7XG5cbmV4cG9ydCBkZWZhdWx0IFNwYW47IiwiZnVuY3Rpb24gX2luaGVyaXRzTG9vc2Uoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzLnByb3RvdHlwZSk7IHN1YkNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHN1YkNsYXNzOyBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmltcG9ydCB7IFRyYWNlciBhcyBvdFRyYWNlciB9IGZyb20gJ29wZW50cmFjaW5nL2xpYi90cmFjZXInO1xuaW1wb3J0IHsgUkVGRVJFTkNFX0NISUxEX09GLCBGT1JNQVRfVEVYVF9NQVAsIEZPUk1BVF9IVFRQX0hFQURFUlMsIEZPUk1BVF9CSU5BUlkgfSBmcm9tICdvcGVudHJhY2luZy9saWIvY29uc3RhbnRzJztcbmltcG9ydCB7IFNwYW4gYXMgTm9vcFNwYW4gfSBmcm9tICdvcGVudHJhY2luZy9saWIvc3Bhbic7XG5pbXBvcnQgeyBnZXRUaW1lT3JpZ2luLCBmaW5kIH0gZnJvbSAnLi4vY29tbW9uL3V0aWxzJztcbmltcG9ydCB7IF9fREVWX18gfSBmcm9tICcuLi9zdGF0ZSc7XG5pbXBvcnQgU3BhbiBmcm9tICcuL3NwYW4nO1xuXG52YXIgVHJhY2VyID0gZnVuY3Rpb24gKF9vdFRyYWNlcikge1xuICBfaW5oZXJpdHNMb29zZShUcmFjZXIsIF9vdFRyYWNlcik7XG5cbiAgZnVuY3Rpb24gVHJhY2VyKHBlcmZvcm1hbmNlTW9uaXRvcmluZywgdHJhbnNhY3Rpb25TZXJ2aWNlLCBsb2dnaW5nU2VydmljZSwgZXJyb3JMb2dnaW5nKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX3RoaXMgPSBfb3RUcmFjZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgIF90aGlzLnBlcmZvcm1hbmNlTW9uaXRvcmluZyA9IHBlcmZvcm1hbmNlTW9uaXRvcmluZztcbiAgICBfdGhpcy50cmFuc2FjdGlvblNlcnZpY2UgPSB0cmFuc2FjdGlvblNlcnZpY2U7XG4gICAgX3RoaXMubG9nZ2luZ1NlcnZpY2UgPSBsb2dnaW5nU2VydmljZTtcbiAgICBfdGhpcy5lcnJvckxvZ2dpbmcgPSBlcnJvckxvZ2dpbmc7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFRyYWNlci5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLl9zdGFydFNwYW4gPSBmdW5jdGlvbiBfc3RhcnRTcGFuKG5hbWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgc3Bhbk9wdGlvbnMgPSB7XG4gICAgICBtYW5hZ2VkOiB0cnVlXG4gICAgfTtcblxuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICBzcGFuT3B0aW9ucy50aW1lc3RhbXAgPSBvcHRpb25zLnN0YXJ0VGltZTtcblxuICAgICAgaWYgKG9wdGlvbnMuY2hpbGRPZikge1xuICAgICAgICBzcGFuT3B0aW9ucy5wYXJlbnRJZCA9IG9wdGlvbnMuY2hpbGRPZi5pZDtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5yZWZlcmVuY2VzICYmIG9wdGlvbnMucmVmZXJlbmNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmIChvcHRpb25zLnJlZmVyZW5jZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dpbmdTZXJ2aWNlLmRlYnVnKCdFbGFzdGljIEFQTSBPcGVuVHJhY2luZzogVW5zdXBwb3J0ZWQgbnVtYmVyIG9mIHJlZmVyZW5jZXMsIG9ubHkgdGhlIGZpcnN0IGNoaWxkT2YgcmVmZXJlbmNlIHdpbGwgYmUgcmVjb3JkZWQuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaWxkUmVmID0gZmluZChvcHRpb25zLnJlZmVyZW5jZXMsIGZ1bmN0aW9uIChyZWYpIHtcbiAgICAgICAgICByZXR1cm4gcmVmLnR5cGUoKSA9PT0gUkVGRVJFTkNFX0NISUxEX09GO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoY2hpbGRSZWYpIHtcbiAgICAgICAgICBzcGFuT3B0aW9ucy5wYXJlbnRJZCA9IGNoaWxkUmVmLnJlZmVyZW5jZWRDb250ZXh0KCkuaWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc3BhbjtcbiAgICB2YXIgY3VycmVudFRyYW5zYWN0aW9uID0gdGhpcy50cmFuc2FjdGlvblNlcnZpY2UuZ2V0Q3VycmVudFRyYW5zYWN0aW9uKCk7XG5cbiAgICBpZiAoY3VycmVudFRyYW5zYWN0aW9uKSB7XG4gICAgICBzcGFuID0gdGhpcy50cmFuc2FjdGlvblNlcnZpY2Uuc3RhcnRTcGFuKG5hbWUsIHVuZGVmaW5lZCwgc3Bhbk9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzcGFuID0gdGhpcy50cmFuc2FjdGlvblNlcnZpY2Uuc3RhcnRUcmFuc2FjdGlvbihuYW1lLCB1bmRlZmluZWQsIHNwYW5PcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAoIXNwYW4pIHtcbiAgICAgIHJldHVybiBuZXcgTm9vcFNwYW4oKTtcbiAgICB9XG5cbiAgICBpZiAoc3Bhbk9wdGlvbnMudGltZXN0YW1wKSB7XG4gICAgICBzcGFuLl9zdGFydCA9IHNwYW5PcHRpb25zLnRpbWVzdGFtcCAtIGdldFRpbWVPcmlnaW4oKTtcbiAgICB9XG5cbiAgICB2YXIgb3RTcGFuID0gbmV3IFNwYW4odGhpcywgc3Bhbik7XG5cbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnRhZ3MpIHtcbiAgICAgIG90U3Bhbi5hZGRUYWdzKG9wdGlvbnMudGFncyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG90U3BhbjtcbiAgfTtcblxuICBfcHJvdG8uX2luamVjdCA9IGZ1bmN0aW9uIF9pbmplY3Qoc3BhbkNvbnRleHQsIGZvcm1hdCwgY2Fycmllcikge1xuICAgIHN3aXRjaCAoZm9ybWF0KSB7XG4gICAgICBjYXNlIEZPUk1BVF9URVhUX01BUDpcbiAgICAgIGNhc2UgRk9STUFUX0hUVFBfSEVBREVSUzpcbiAgICAgICAgdGhpcy5wZXJmb3JtYW5jZU1vbml0b3JpbmcuaW5qZWN0RHRIZWFkZXIoc3BhbkNvbnRleHQsIGNhcnJpZXIpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBGT1JNQVRfQklOQVJZOlxuICAgICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICAgIHRoaXMubG9nZ2luZ1NlcnZpY2UuZGVidWcoJ0VsYXN0aWMgQVBNIE9wZW5UcmFjaW5nOiBiaW5hcnkgY2FycmllciBmb3JtYXQgaXMgbm90IHN1cHBvcnRlZC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uX2V4dHJhY3QgPSBmdW5jdGlvbiBfZXh0cmFjdChmb3JtYXQsIGNhcnJpZXIpIHtcbiAgICB2YXIgY3R4O1xuXG4gICAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICAgIGNhc2UgRk9STUFUX1RFWFRfTUFQOlxuICAgICAgY2FzZSBGT1JNQVRfSFRUUF9IRUFERVJTOlxuICAgICAgICBjdHggPSB0aGlzLnBlcmZvcm1hbmNlTW9uaXRvcmluZy5leHRyYWN0RHRIZWFkZXIoY2Fycmllcik7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIEZPUk1BVF9CSU5BUlk6XG4gICAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgICAgdGhpcy5sb2dnaW5nU2VydmljZS5kZWJ1ZygnRWxhc3RpYyBBUE0gT3BlblRyYWNpbmc6IGJpbmFyeSBjYXJyaWVyIGZvcm1hdCBpcyBub3Qgc3VwcG9ydGVkLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKCFjdHgpIHtcbiAgICAgIGN0eCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN0eDtcbiAgfTtcblxuICByZXR1cm4gVHJhY2VyO1xufShvdFRyYWNlcik7XG5cbmV4cG9ydCBkZWZhdWx0IFRyYWNlcjsiLCJpbXBvcnQgeyBnZXREdXJhdGlvbiwgUEVSRiB9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgeyBQQUdFX0xPQUQsIFRSVU5DQVRFRF9UWVBFIH0gZnJvbSAnLi4vY29tbW9uL2NvbnN0YW50cyc7XG52YXIgcGFnZUxvYWRCcmVha2Rvd25zID0gW1snZG9tYWluTG9va3VwU3RhcnQnLCAnZG9tYWluTG9va3VwRW5kJywgJ0ROUyddLCBbJ2Nvbm5lY3RTdGFydCcsICdjb25uZWN0RW5kJywgJ1RDUCddLCBbJ3JlcXVlc3RTdGFydCcsICdyZXNwb25zZVN0YXJ0JywgJ1JlcXVlc3QnXSwgWydyZXNwb25zZVN0YXJ0JywgJ3Jlc3BvbnNlRW5kJywgJ1Jlc3BvbnNlJ10sIFsnZG9tTG9hZGluZycsICdkb21Db21wbGV0ZScsICdQcm9jZXNzaW5nJ10sIFsnbG9hZEV2ZW50U3RhcnQnLCAnbG9hZEV2ZW50RW5kJywgJ0xvYWQnXV07XG5cbmZ1bmN0aW9uIGdldFZhbHVlKHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZVNlbGZUaW1lKHRyYW5zYWN0aW9uKSB7XG4gIHZhciBzcGFucyA9IHRyYW5zYWN0aW9uLnNwYW5zLFxuICAgICAgX3N0YXJ0ID0gdHJhbnNhY3Rpb24uX3N0YXJ0LFxuICAgICAgX2VuZCA9IHRyYW5zYWN0aW9uLl9lbmQ7XG5cbiAgaWYgKHNwYW5zLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cmFuc2FjdGlvbi5kdXJhdGlvbigpO1xuICB9XG5cbiAgc3BhbnMuc29ydChmdW5jdGlvbiAoc3BhbjEsIHNwYW4yKSB7XG4gICAgcmV0dXJuIHNwYW4xLl9zdGFydCAtIHNwYW4yLl9zdGFydDtcbiAgfSk7XG4gIHZhciBzcGFuID0gc3BhbnNbMF07XG4gIHZhciBzcGFuRW5kID0gc3Bhbi5fZW5kO1xuICB2YXIgc3BhblN0YXJ0ID0gc3Bhbi5fc3RhcnQ7XG4gIHZhciBsYXN0Q29udGludW91c0VuZCA9IHNwYW5FbmQ7XG4gIHZhciBzZWxmVGltZSA9IHNwYW5TdGFydCAtIF9zdGFydDtcblxuICBmb3IgKHZhciBpID0gMTsgaSA8IHNwYW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgc3BhbiA9IHNwYW5zW2ldO1xuICAgIHNwYW5TdGFydCA9IHNwYW4uX3N0YXJ0O1xuICAgIHNwYW5FbmQgPSBzcGFuLl9lbmQ7XG5cbiAgICBpZiAoc3BhblN0YXJ0ID4gbGFzdENvbnRpbnVvdXNFbmQpIHtcbiAgICAgIHNlbGZUaW1lICs9IHNwYW5TdGFydCAtIGxhc3RDb250aW51b3VzRW5kO1xuICAgICAgbGFzdENvbnRpbnVvdXNFbmQgPSBzcGFuRW5kO1xuICAgIH0gZWxzZSBpZiAoc3BhbkVuZCA+IGxhc3RDb250aW51b3VzRW5kKSB7XG4gICAgICBsYXN0Q29udGludW91c0VuZCA9IHNwYW5FbmQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKGxhc3RDb250aW51b3VzRW5kIDwgX2VuZCkge1xuICAgIHNlbGZUaW1lICs9IF9lbmQgLSBsYXN0Q29udGludW91c0VuZDtcbiAgfVxuXG4gIHJldHVybiBzZWxmVGltZTtcbn1cblxuZnVuY3Rpb24gZ3JvdXBTcGFucyh0cmFuc2FjdGlvbikge1xuICB2YXIgc3Bhbk1hcCA9IHt9O1xuICB2YXIgdHJhbnNhY3Rpb25TZWxmVGltZSA9IGNhbGN1bGF0ZVNlbGZUaW1lKHRyYW5zYWN0aW9uKTtcbiAgc3Bhbk1hcFsnYXBwJ10gPSB7XG4gICAgY291bnQ6IDEsXG4gICAgZHVyYXRpb246IHRyYW5zYWN0aW9uU2VsZlRpbWVcbiAgfTtcbiAgdmFyIHNwYW5zID0gdHJhbnNhY3Rpb24uc3BhbnM7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcGFucy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzcGFuID0gc3BhbnNbaV07XG4gICAgdmFyIGR1cmF0aW9uID0gc3Bhbi5kdXJhdGlvbigpO1xuXG4gICAgaWYgKGR1cmF0aW9uID09PSAwIHx8IGR1cmF0aW9uID09IG51bGwpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciB0eXBlID0gc3Bhbi50eXBlLFxuICAgICAgICBzdWJ0eXBlID0gc3Bhbi5zdWJ0eXBlO1xuICAgIHZhciBrZXkgPSB0eXBlLnJlcGxhY2UoVFJVTkNBVEVEX1RZUEUsICcnKTtcblxuICAgIGlmIChzdWJ0eXBlKSB7XG4gICAgICBrZXkgKz0gJy4nICsgc3VidHlwZTtcbiAgICB9XG5cbiAgICBpZiAoIXNwYW5NYXBba2V5XSkge1xuICAgICAgc3Bhbk1hcFtrZXldID0ge1xuICAgICAgICBkdXJhdGlvbjogMCxcbiAgICAgICAgY291bnQ6IDBcbiAgICAgIH07XG4gICAgfVxuXG4gICAgc3Bhbk1hcFtrZXldLmNvdW50Kys7XG4gICAgc3Bhbk1hcFtrZXldLmR1cmF0aW9uICs9IGR1cmF0aW9uO1xuICB9XG5cbiAgcmV0dXJuIHNwYW5NYXA7XG59XG5cbmZ1bmN0aW9uIGdldFNwYW5CcmVha2Rvd24odHJhbnNhY3Rpb25EZXRhaWxzLCBfcmVmKSB7XG4gIHZhciBkZXRhaWxzID0gX3JlZi5kZXRhaWxzLFxuICAgICAgX3JlZiRjb3VudCA9IF9yZWYuY291bnQsXG4gICAgICBjb3VudCA9IF9yZWYkY291bnQgPT09IHZvaWQgMCA/IDEgOiBfcmVmJGNvdW50LFxuICAgICAgZHVyYXRpb24gPSBfcmVmLmR1cmF0aW9uO1xuICByZXR1cm4ge1xuICAgIHRyYW5zYWN0aW9uOiB0cmFuc2FjdGlvbkRldGFpbHMsXG4gICAgc3BhbjogZGV0YWlscyxcbiAgICBzYW1wbGVzOiB7XG4gICAgICAnc3Bhbi5zZWxmX3RpbWUuY291bnQnOiBnZXRWYWx1ZShjb3VudCksXG4gICAgICAnc3Bhbi5zZWxmX3RpbWUuc3VtLnVzJzogZ2V0VmFsdWUoZHVyYXRpb24gKiAxMDAwKVxuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcHR1cmVCcmVha2Rvd24odHJhbnNhY3Rpb24sIHRpbWluZ3MpIHtcbiAgaWYgKHRpbWluZ3MgPT09IHZvaWQgMCkge1xuICAgIHRpbWluZ3MgPSBQRVJGLnRpbWluZztcbiAgfVxuXG4gIHZhciBicmVha2Rvd25zID0gW107XG4gIHZhciBuYW1lID0gdHJhbnNhY3Rpb24ubmFtZSxcbiAgICAgIHR5cGUgPSB0cmFuc2FjdGlvbi50eXBlLFxuICAgICAgc2FtcGxlZCA9IHRyYW5zYWN0aW9uLnNhbXBsZWQ7XG4gIHZhciB0cmFuc2FjdGlvbkRldGFpbHMgPSB7XG4gICAgbmFtZTogbmFtZSxcbiAgICB0eXBlOiB0eXBlXG4gIH07XG5cbiAgaWYgKCFzYW1wbGVkKSB7XG4gICAgcmV0dXJuIGJyZWFrZG93bnM7XG4gIH1cblxuICBpZiAodHlwZSA9PT0gUEFHRV9MT0FEICYmIHRpbWluZ3MpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VMb2FkQnJlYWtkb3ducy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGN1cnJlbnQgPSBwYWdlTG9hZEJyZWFrZG93bnNbaV07XG4gICAgICB2YXIgc3RhcnQgPSB0aW1pbmdzW2N1cnJlbnRbMF1dO1xuICAgICAgdmFyIGVuZCA9IHRpbWluZ3NbY3VycmVudFsxXV07XG4gICAgICB2YXIgZHVyYXRpb24gPSBnZXREdXJhdGlvbihzdGFydCwgZW5kKTtcblxuICAgICAgaWYgKGR1cmF0aW9uID09PSAwIHx8IGR1cmF0aW9uID09IG51bGwpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrZG93bnMucHVzaChnZXRTcGFuQnJlYWtkb3duKHRyYW5zYWN0aW9uRGV0YWlscywge1xuICAgICAgICBkZXRhaWxzOiB7XG4gICAgICAgICAgdHlwZTogY3VycmVudFsyXVxuICAgICAgICB9LFxuICAgICAgICBkdXJhdGlvbjogZHVyYXRpb25cbiAgICAgIH0pKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIHNwYW5NYXAgPSBncm91cFNwYW5zKHRyYW5zYWN0aW9uKTtcbiAgICBPYmplY3Qua2V5cyhzcGFuTWFwKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBfa2V5JHNwbGl0ID0ga2V5LnNwbGl0KCcuJyksXG4gICAgICAgICAgdHlwZSA9IF9rZXkkc3BsaXRbMF0sXG4gICAgICAgICAgc3VidHlwZSA9IF9rZXkkc3BsaXRbMV07XG5cbiAgICAgIHZhciBfc3Bhbk1hcCRrZXkgPSBzcGFuTWFwW2tleV0sXG4gICAgICAgICAgZHVyYXRpb24gPSBfc3Bhbk1hcCRrZXkuZHVyYXRpb24sXG4gICAgICAgICAgY291bnQgPSBfc3Bhbk1hcCRrZXkuY291bnQ7XG4gICAgICBicmVha2Rvd25zLnB1c2goZ2V0U3BhbkJyZWFrZG93bih0cmFuc2FjdGlvbkRldGFpbHMsIHtcbiAgICAgICAgZGV0YWlsczoge1xuICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgc3VidHlwZTogc3VidHlwZVxuICAgICAgICB9LFxuICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgIGNvdW50OiBjb3VudFxuICAgICAgfSkpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGJyZWFrZG93bnM7XG59IiwiaW1wb3J0IFBlcmZvcm1hbmNlTW9uaXRvcmluZyBmcm9tICcuL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcnO1xuaW1wb3J0IFRyYW5zYWN0aW9uU2VydmljZSBmcm9tICcuL3RyYW5zYWN0aW9uLXNlcnZpY2UnO1xuaW1wb3J0IHsgQVBNX1NFUlZFUiwgQ09ORklHX1NFUlZJQ0UsIExPR0dJTkdfU0VSVklDRSwgVFJBTlNBQ1RJT05fU0VSVklDRSwgUEVSRk9STUFOQ0VfTU9OSVRPUklORyB9IGZyb20gJy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHsgc2VydmljZUNyZWF0b3JzIH0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2UtZmFjdG9yeSc7XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyU2VydmljZXMoKSB7XG4gIHNlcnZpY2VDcmVhdG9yc1tUUkFOU0FDVElPTl9TRVJWSUNFXSA9IGZ1bmN0aW9uIChzZXJ2aWNlRmFjdG9yeSkge1xuICAgIHZhciBfc2VydmljZUZhY3RvcnkkZ2V0U2UgPSBzZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKFtMT0dHSU5HX1NFUlZJQ0UsIENPTkZJR19TRVJWSUNFXSksXG4gICAgICAgIGxvZ2dpbmdTZXJ2aWNlID0gX3NlcnZpY2VGYWN0b3J5JGdldFNlWzBdLFxuICAgICAgICBjb25maWdTZXJ2aWNlID0gX3NlcnZpY2VGYWN0b3J5JGdldFNlWzFdO1xuXG4gICAgcmV0dXJuIG5ldyBUcmFuc2FjdGlvblNlcnZpY2UobG9nZ2luZ1NlcnZpY2UsIGNvbmZpZ1NlcnZpY2UpO1xuICB9O1xuXG4gIHNlcnZpY2VDcmVhdG9yc1tQRVJGT1JNQU5DRV9NT05JVE9SSU5HXSA9IGZ1bmN0aW9uIChzZXJ2aWNlRmFjdG9yeSkge1xuICAgIHZhciBfc2VydmljZUZhY3RvcnkkZ2V0U2UyID0gc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShbQVBNX1NFUlZFUiwgQ09ORklHX1NFUlZJQ0UsIExPR0dJTkdfU0VSVklDRSwgVFJBTlNBQ1RJT05fU0VSVklDRV0pLFxuICAgICAgICBhcG1TZXJ2ZXIgPSBfc2VydmljZUZhY3RvcnkkZ2V0U2UyWzBdLFxuICAgICAgICBjb25maWdTZXJ2aWNlID0gX3NlcnZpY2VGYWN0b3J5JGdldFNlMlsxXSxcbiAgICAgICAgbG9nZ2luZ1NlcnZpY2UgPSBfc2VydmljZUZhY3RvcnkkZ2V0U2UyWzJdLFxuICAgICAgICB0cmFuc2FjdGlvblNlcnZpY2UgPSBfc2VydmljZUZhY3RvcnkkZ2V0U2UyWzNdO1xuXG4gICAgcmV0dXJuIG5ldyBQZXJmb3JtYW5jZU1vbml0b3JpbmcoYXBtU2VydmVyLCBjb25maWdTZXJ2aWNlLCBsb2dnaW5nU2VydmljZSwgdHJhbnNhY3Rpb25TZXJ2aWNlKTtcbiAgfTtcbn1cblxuZXhwb3J0IHsgcmVnaXN0ZXJTZXJ2aWNlcyB9OyIsImltcG9ydCB7IExPTkdfVEFTSywgTEFSR0VTVF9DT05URU5URlVMX1BBSU5ULCBGSVJTVF9DT05URU5URlVMX1BBSU5ULCBGSVJTVF9JTlBVVCwgTEFZT1VUX1NISUZUIH0gZnJvbSAnLi4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBub29wLCBQRVJGLCBpc1BlcmZUeXBlU3VwcG9ydGVkLCBpc1JlZGlyZWN0SW5mb0F2YWlsYWJsZSB9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgU3BhbiBmcm9tICcuL3NwYW4nO1xuZXhwb3J0IHZhciBtZXRyaWNzID0ge1xuICBmaWQ6IDAsXG4gIGZjcDogMCxcbiAgdGJ0OiB7XG4gICAgc3RhcnQ6IEluZmluaXR5LFxuICAgIGR1cmF0aW9uOiAwXG4gIH0sXG4gIGNsczoge1xuICAgIHNjb3JlOiAwLFxuICAgIGZpcnN0RW50cnlUaW1lOiBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFksXG4gICAgcHJldkVudHJ5VGltZTogTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZLFxuICAgIGN1cnJlbnRTZXNzaW9uU2NvcmU6IDBcbiAgfSxcbiAgbG9uZ3Rhc2s6IHtcbiAgICBjb3VudDogMCxcbiAgICBkdXJhdGlvbjogMCxcbiAgICBtYXg6IDBcbiAgfVxufTtcbnZhciBMT05HX1RBU0tfVEhSRVNIT0xEID0gNTA7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTG9uZ1Rhc2tTcGFucyhsb25ndGFza3MsIGFnZykge1xuICB2YXIgc3BhbnMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxvbmd0YXNrcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBfbG9uZ3Rhc2tzJGkgPSBsb25ndGFza3NbaV0sXG4gICAgICAgIG5hbWUgPSBfbG9uZ3Rhc2tzJGkubmFtZSxcbiAgICAgICAgc3RhcnRUaW1lID0gX2xvbmd0YXNrcyRpLnN0YXJ0VGltZSxcbiAgICAgICAgZHVyYXRpb24gPSBfbG9uZ3Rhc2tzJGkuZHVyYXRpb24sXG4gICAgICAgIGF0dHJpYnV0aW9uID0gX2xvbmd0YXNrcyRpLmF0dHJpYnV0aW9uO1xuICAgIHZhciBlbmQgPSBzdGFydFRpbWUgKyBkdXJhdGlvbjtcbiAgICB2YXIgc3BhbiA9IG5ldyBTcGFuKFwiTG9uZ3Rhc2soXCIgKyBuYW1lICsgXCIpXCIsIExPTkdfVEFTSywge1xuICAgICAgc3RhcnRUaW1lOiBzdGFydFRpbWVcbiAgICB9KTtcbiAgICBhZ2cuY291bnQrKztcbiAgICBhZ2cuZHVyYXRpb24gKz0gZHVyYXRpb247XG4gICAgYWdnLm1heCA9IE1hdGgubWF4KGR1cmF0aW9uLCBhZ2cubWF4KTtcblxuICAgIGlmIChhdHRyaWJ1dGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgX2F0dHJpYnV0aW9uJCA9IGF0dHJpYnV0aW9uWzBdLFxuICAgICAgICAgIF9uYW1lID0gX2F0dHJpYnV0aW9uJC5uYW1lLFxuICAgICAgICAgIGNvbnRhaW5lclR5cGUgPSBfYXR0cmlidXRpb24kLmNvbnRhaW5lclR5cGUsXG4gICAgICAgICAgY29udGFpbmVyTmFtZSA9IF9hdHRyaWJ1dGlvbiQuY29udGFpbmVyTmFtZSxcbiAgICAgICAgICBjb250YWluZXJJZCA9IF9hdHRyaWJ1dGlvbiQuY29udGFpbmVySWQ7XG4gICAgICB2YXIgY3VzdG9tQ29udGV4dCA9IHtcbiAgICAgICAgYXR0cmlidXRpb246IF9uYW1lLFxuICAgICAgICB0eXBlOiBjb250YWluZXJUeXBlXG4gICAgICB9O1xuXG4gICAgICBpZiAoY29udGFpbmVyTmFtZSkge1xuICAgICAgICBjdXN0b21Db250ZXh0Lm5hbWUgPSBjb250YWluZXJOYW1lO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29udGFpbmVySWQpIHtcbiAgICAgICAgY3VzdG9tQ29udGV4dC5pZCA9IGNvbnRhaW5lcklkO1xuICAgICAgfVxuXG4gICAgICBzcGFuLmFkZENvbnRleHQoe1xuICAgICAgICBjdXN0b206IGN1c3RvbUNvbnRleHRcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHNwYW4uZW5kKGVuZCk7XG4gICAgc3BhbnMucHVzaChzcGFuKTtcbiAgfVxuXG4gIHJldHVybiBzcGFucztcbn1cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVGaXJzdElucHV0RGVsYXlTcGFuKGZpZEVudHJpZXMpIHtcbiAgdmFyIGZpcnN0SW5wdXQgPSBmaWRFbnRyaWVzWzBdO1xuXG4gIGlmIChmaXJzdElucHV0KSB7XG4gICAgdmFyIHN0YXJ0VGltZSA9IGZpcnN0SW5wdXQuc3RhcnRUaW1lLFxuICAgICAgICBwcm9jZXNzaW5nU3RhcnQgPSBmaXJzdElucHV0LnByb2Nlc3NpbmdTdGFydDtcbiAgICB2YXIgc3BhbiA9IG5ldyBTcGFuKCdGaXJzdCBJbnB1dCBEZWxheScsIEZJUlNUX0lOUFVULCB7XG4gICAgICBzdGFydFRpbWU6IHN0YXJ0VGltZVxuICAgIH0pO1xuICAgIHNwYW4uZW5kKHByb2Nlc3NpbmdTdGFydCk7XG4gICAgcmV0dXJuIHNwYW47XG4gIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUb3RhbEJsb2NraW5nVGltZVNwYW4odGJ0T2JqZWN0KSB7XG4gIHZhciBzdGFydCA9IHRidE9iamVjdC5zdGFydCxcbiAgICAgIGR1cmF0aW9uID0gdGJ0T2JqZWN0LmR1cmF0aW9uO1xuICB2YXIgdGJ0U3BhbiA9IG5ldyBTcGFuKCdUb3RhbCBCbG9ja2luZyBUaW1lJywgTE9OR19UQVNLLCB7XG4gICAgc3RhcnRUaW1lOiBzdGFydFxuICB9KTtcbiAgdGJ0U3Bhbi5lbmQoc3RhcnQgKyBkdXJhdGlvbik7XG4gIHJldHVybiB0YnRTcGFuO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNhbGN1bGF0ZVRvdGFsQmxvY2tpbmdUaW1lKGxvbmd0YXNrRW50cmllcykge1xuICBsb25ndGFza0VudHJpZXMuZm9yRWFjaChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICB2YXIgbmFtZSA9IGVudHJ5Lm5hbWUsXG4gICAgICAgIHN0YXJ0VGltZSA9IGVudHJ5LnN0YXJ0VGltZSxcbiAgICAgICAgZHVyYXRpb24gPSBlbnRyeS5kdXJhdGlvbjtcblxuICAgIGlmIChzdGFydFRpbWUgPCBtZXRyaWNzLmZjcCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChuYW1lICE9PSAnc2VsZicgJiYgbmFtZS5pbmRleE9mKCdzYW1lLW9yaWdpbicpID09PSAtMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG1ldHJpY3MudGJ0LnN0YXJ0ID0gTWF0aC5taW4obWV0cmljcy50YnQuc3RhcnQsIHN0YXJ0VGltZSk7XG4gICAgdmFyIGJsb2NraW5nVGltZSA9IGR1cmF0aW9uIC0gTE9OR19UQVNLX1RIUkVTSE9MRDtcblxuICAgIGlmIChibG9ja2luZ1RpbWUgPiAwKSB7XG4gICAgICBtZXRyaWNzLnRidC5kdXJhdGlvbiArPSBibG9ja2luZ1RpbWU7XG4gICAgfVxuICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVDdW11bGF0aXZlTGF5b3V0U2hpZnQoY2xzRW50cmllcykge1xuICBjbHNFbnRyaWVzLmZvckVhY2goZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgaWYgKCFlbnRyeS5oYWRSZWNlbnRJbnB1dCAmJiBlbnRyeS52YWx1ZSkge1xuICAgICAgdmFyIHNob3VsZENyZWF0ZU5ld1Nlc3Npb24gPSBlbnRyeS5zdGFydFRpbWUgLSBtZXRyaWNzLmNscy5maXJzdEVudHJ5VGltZSA+IDUwMDAgfHwgZW50cnkuc3RhcnRUaW1lIC0gbWV0cmljcy5jbHMucHJldkVudHJ5VGltZSA+IDEwMDA7XG5cbiAgICAgIGlmIChzaG91bGRDcmVhdGVOZXdTZXNzaW9uKSB7XG4gICAgICAgIG1ldHJpY3MuY2xzLmZpcnN0RW50cnlUaW1lID0gZW50cnkuc3RhcnRUaW1lO1xuICAgICAgICBtZXRyaWNzLmNscy5jdXJyZW50U2Vzc2lvblNjb3JlID0gMDtcbiAgICAgIH1cblxuICAgICAgbWV0cmljcy5jbHMucHJldkVudHJ5VGltZSA9IGVudHJ5LnN0YXJ0VGltZTtcbiAgICAgIG1ldHJpY3MuY2xzLmN1cnJlbnRTZXNzaW9uU2NvcmUgKz0gZW50cnkudmFsdWU7XG4gICAgICBtZXRyaWNzLmNscy5zY29yZSA9IE1hdGgubWF4KG1ldHJpY3MuY2xzLnNjb3JlLCBtZXRyaWNzLmNscy5jdXJyZW50U2Vzc2lvblNjb3JlKTtcbiAgICB9XG4gIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNhcHR1cmVPYnNlcnZlckVudHJpZXMobGlzdCwgX3JlZikge1xuICB2YXIgaXNIYXJkTmF2aWdhdGlvbiA9IF9yZWYuaXNIYXJkTmF2aWdhdGlvbixcbiAgICAgIHRyU3RhcnQgPSBfcmVmLnRyU3RhcnQ7XG4gIHZhciBsb25ndGFza0VudHJpZXMgPSBsaXN0LmdldEVudHJpZXNCeVR5cGUoTE9OR19UQVNLKS5maWx0ZXIoZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgcmV0dXJuIGVudHJ5LnN0YXJ0VGltZSA+PSB0clN0YXJ0O1xuICB9KTtcbiAgdmFyIGxvbmdUYXNrU3BhbnMgPSBjcmVhdGVMb25nVGFza1NwYW5zKGxvbmd0YXNrRW50cmllcywgbWV0cmljcy5sb25ndGFzayk7XG4gIHZhciByZXN1bHQgPSB7XG4gICAgc3BhbnM6IGxvbmdUYXNrU3BhbnMsXG4gICAgbWFya3M6IHt9XG4gIH07XG5cbiAgaWYgKCFpc0hhcmROYXZpZ2F0aW9uKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHZhciBsY3BFbnRyaWVzID0gbGlzdC5nZXRFbnRyaWVzQnlUeXBlKExBUkdFU1RfQ09OVEVOVEZVTF9QQUlOVCk7XG4gIHZhciBsYXN0TGNwRW50cnkgPSBsY3BFbnRyaWVzW2xjcEVudHJpZXMubGVuZ3RoIC0gMV07XG5cbiAgaWYgKGxhc3RMY3BFbnRyeSkge1xuICAgIHZhciBsY3AgPSBwYXJzZUludChsYXN0TGNwRW50cnkuc3RhcnRUaW1lKTtcbiAgICBtZXRyaWNzLmxjcCA9IGxjcDtcbiAgICByZXN1bHQubWFya3MubGFyZ2VzdENvbnRlbnRmdWxQYWludCA9IGxjcDtcbiAgfVxuXG4gIHZhciB0aW1pbmcgPSBQRVJGLnRpbWluZztcbiAgdmFyIHVubG9hZERpZmYgPSB0aW1pbmcuZmV0Y2hTdGFydCAtIHRpbWluZy5uYXZpZ2F0aW9uU3RhcnQ7XG5cbiAgaWYgKGlzUmVkaXJlY3RJbmZvQXZhaWxhYmxlKHRpbWluZykpIHtcbiAgICB1bmxvYWREaWZmID0gMDtcbiAgfVxuXG4gIHZhciBmY3BFbnRyeSA9IGxpc3QuZ2V0RW50cmllc0J5TmFtZShGSVJTVF9DT05URU5URlVMX1BBSU5UKVswXTtcblxuICBpZiAoZmNwRW50cnkpIHtcbiAgICB2YXIgZmNwID0gcGFyc2VJbnQodW5sb2FkRGlmZiA+PSAwID8gZmNwRW50cnkuc3RhcnRUaW1lIC0gdW5sb2FkRGlmZiA6IGZjcEVudHJ5LnN0YXJ0VGltZSk7XG4gICAgbWV0cmljcy5mY3AgPSBmY3A7XG4gICAgcmVzdWx0Lm1hcmtzLmZpcnN0Q29udGVudGZ1bFBhaW50ID0gZmNwO1xuICB9XG5cbiAgdmFyIGZpZEVudHJpZXMgPSBsaXN0LmdldEVudHJpZXNCeVR5cGUoRklSU1RfSU5QVVQpO1xuICB2YXIgZmlkU3BhbiA9IGNyZWF0ZUZpcnN0SW5wdXREZWxheVNwYW4oZmlkRW50cmllcyk7XG5cbiAgaWYgKGZpZFNwYW4pIHtcbiAgICBtZXRyaWNzLmZpZCA9IGZpZFNwYW4uZHVyYXRpb24oKTtcbiAgICByZXN1bHQuc3BhbnMucHVzaChmaWRTcGFuKTtcbiAgfVxuXG4gIGNhbGN1bGF0ZVRvdGFsQmxvY2tpbmdUaW1lKGxvbmd0YXNrRW50cmllcyk7XG4gIHZhciBjbHNFbnRyaWVzID0gbGlzdC5nZXRFbnRyaWVzQnlUeXBlKExBWU9VVF9TSElGVCk7XG4gIGNhbGN1bGF0ZUN1bXVsYXRpdmVMYXlvdXRTaGlmdChjbHNFbnRyaWVzKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydCB2YXIgUGVyZkVudHJ5UmVjb3JkZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFBlcmZFbnRyeVJlY29yZGVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5wbyA9IHtcbiAgICAgIG9ic2VydmU6IG5vb3AsXG4gICAgICBkaXNjb25uZWN0OiBub29wXG4gICAgfTtcblxuICAgIGlmICh3aW5kb3cuUGVyZm9ybWFuY2VPYnNlcnZlcikge1xuICAgICAgdGhpcy5wbyA9IG5ldyBQZXJmb3JtYW5jZU9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICB2YXIgX3Byb3RvID0gUGVyZkVudHJ5UmVjb3JkZXIucHJvdG90eXBlO1xuXG4gIF9wcm90by5zdGFydCA9IGZ1bmN0aW9uIHN0YXJ0KHR5cGUpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKCFpc1BlcmZUeXBlU3VwcG9ydGVkKHR5cGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wby5vYnNlcnZlKHtcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgYnVmZmVyZWQ6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKF8pIHt9XG4gIH07XG5cbiAgX3Byb3RvLnN0b3AgPSBmdW5jdGlvbiBzdG9wKCkge1xuICAgIHRoaXMucG8uZGlzY29ubmVjdCgpO1xuICB9O1xuXG4gIHJldHVybiBQZXJmRW50cnlSZWNvcmRlcjtcbn0oKTsiLCJpbXBvcnQgeyBQRVJGLCBpc1BlcmZUaW1lbGluZVN1cHBvcnRlZCwgaXNSZWRpcmVjdEluZm9BdmFpbGFibGUgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMnO1xuaW1wb3J0IHsgUEFHRV9MT0FELCBSRVNPVVJDRSwgTUVBU1VSRSB9IGZyb20gJy4uLy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHsgc3RhdGUgfSBmcm9tICcuLi8uLi9zdGF0ZSc7XG5pbXBvcnQgeyBjcmVhdGVOYXZpZ2F0aW9uVGltaW5nU3BhbnMgfSBmcm9tICcuL25hdmlnYXRpb24tdGltaW5nJztcbmltcG9ydCB7IGNyZWF0ZVVzZXJUaW1pbmdTcGFucyB9IGZyb20gJy4vdXNlci10aW1pbmcnO1xuaW1wb3J0IHsgY3JlYXRlUmVzb3VyY2VUaW1pbmdTcGFucyB9IGZyb20gJy4vcmVzb3VyY2UtdGltaW5nJztcbmltcG9ydCB7IGdldFBhZ2VMb2FkTWFya3MgfSBmcm9tICcuL21hcmtzJztcblxuZnVuY3Rpb24gY2FwdHVyZU5hdmlnYXRpb24odHJhbnNhY3Rpb24pIHtcbiAgaWYgKCF0cmFuc2FjdGlvbi5jYXB0dXJlVGltaW5ncykge1xuICAgIGlmICh0cmFuc2FjdGlvbi50eXBlID09PSBQQUdFX0xPQUQpIHtcbiAgICAgIHRyYW5zYWN0aW9uLl9zdGFydCA9IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHRyRW5kID0gdHJhbnNhY3Rpb24uX2VuZDtcblxuICBpZiAodHJhbnNhY3Rpb24udHlwZSA9PT0gUEFHRV9MT0FEKSB7XG4gICAgaWYgKHRyYW5zYWN0aW9uLm1hcmtzICYmIHRyYW5zYWN0aW9uLm1hcmtzLmN1c3RvbSkge1xuICAgICAgdmFyIGN1c3RvbU1hcmtzID0gdHJhbnNhY3Rpb24ubWFya3MuY3VzdG9tO1xuICAgICAgT2JqZWN0LmtleXMoY3VzdG9tTWFya3MpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBjdXN0b21NYXJrc1trZXldICs9IHRyYW5zYWN0aW9uLl9zdGFydDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciB0clN0YXJ0ID0gMDtcbiAgICB0cmFuc2FjdGlvbi5fc3RhcnQgPSB0clN0YXJ0O1xuICAgIHZhciB0aW1pbmdzID0gUEVSRi50aW1pbmc7XG4gICAgdmFyIGJhc2VUaW1lID0gaXNSZWRpcmVjdEluZm9BdmFpbGFibGUodGltaW5ncykgPyB0aW1pbmdzLnJlZGlyZWN0U3RhcnQgOiB0aW1pbmdzLmZldGNoU3RhcnQ7XG4gICAgY3JlYXRlTmF2aWdhdGlvblRpbWluZ1NwYW5zKHRpbWluZ3MsIGJhc2VUaW1lLCB0clN0YXJ0LCB0ckVuZCkuZm9yRWFjaChmdW5jdGlvbiAoc3Bhbikge1xuICAgICAgc3Bhbi50cmFjZUlkID0gdHJhbnNhY3Rpb24udHJhY2VJZDtcbiAgICAgIHNwYW4uc2FtcGxlZCA9IHRyYW5zYWN0aW9uLnNhbXBsZWQ7XG5cbiAgICAgIGlmIChzcGFuLnBhZ2VSZXNwb25zZSAmJiB0cmFuc2FjdGlvbi5vcHRpb25zLnBhZ2VMb2FkU3BhbklkKSB7XG4gICAgICAgIHNwYW4uaWQgPSB0cmFuc2FjdGlvbi5vcHRpb25zLnBhZ2VMb2FkU3BhbklkO1xuICAgICAgfVxuXG4gICAgICB0cmFuc2FjdGlvbi5zcGFucy5wdXNoKHNwYW4pO1xuICAgIH0pO1xuICAgIHRyYW5zYWN0aW9uLmFkZE1hcmtzKGdldFBhZ2VMb2FkTWFya3ModGltaW5ncykpO1xuICB9XG5cbiAgaWYgKGlzUGVyZlRpbWVsaW5lU3VwcG9ydGVkKCkpIHtcbiAgICB2YXIgX3RyU3RhcnQgPSB0cmFuc2FjdGlvbi5fc3RhcnQ7XG4gICAgdmFyIHJlc291cmNlRW50cmllcyA9IFBFUkYuZ2V0RW50cmllc0J5VHlwZShSRVNPVVJDRSk7XG4gICAgY3JlYXRlUmVzb3VyY2VUaW1pbmdTcGFucyhyZXNvdXJjZUVudHJpZXMsIHN0YXRlLmJvb3RzdHJhcFRpbWUsIF90clN0YXJ0LCB0ckVuZCkuZm9yRWFjaChmdW5jdGlvbiAoc3Bhbikge1xuICAgICAgcmV0dXJuIHRyYW5zYWN0aW9uLnNwYW5zLnB1c2goc3Bhbik7XG4gICAgfSk7XG4gICAgdmFyIHVzZXJFbnRyaWVzID0gUEVSRi5nZXRFbnRyaWVzQnlUeXBlKE1FQVNVUkUpO1xuICAgIGNyZWF0ZVVzZXJUaW1pbmdTcGFucyh1c2VyRW50cmllcywgX3RyU3RhcnQsIHRyRW5kKS5mb3JFYWNoKGZ1bmN0aW9uIChzcGFuKSB7XG4gICAgICByZXR1cm4gdHJhbnNhY3Rpb24uc3BhbnMucHVzaChzcGFuKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgeyBjYXB0dXJlTmF2aWdhdGlvbiwgY3JlYXRlTmF2aWdhdGlvblRpbWluZ1NwYW5zLCBjcmVhdGVSZXNvdXJjZVRpbWluZ1NwYW5zLCBjcmVhdGVVc2VyVGltaW5nU3BhbnMsIGdldFBhZ2VMb2FkTWFya3MgfTsiLCJpbXBvcnQgeyBpc1JlZGlyZWN0SW5mb0F2YWlsYWJsZSB9IGZyb20gJy4uLy4uL2NvbW1vbi91dGlscyc7XG52YXIgTkFWSUdBVElPTl9USU1JTkdfTUFSS1MgPSBbJ2ZldGNoU3RhcnQnLCAnZG9tYWluTG9va3VwU3RhcnQnLCAnZG9tYWluTG9va3VwRW5kJywgJ2Nvbm5lY3RTdGFydCcsICdjb25uZWN0RW5kJywgJ3JlcXVlc3RTdGFydCcsICdyZXNwb25zZVN0YXJ0JywgJ3Jlc3BvbnNlRW5kJywgJ2RvbUxvYWRpbmcnLCAnZG9tSW50ZXJhY3RpdmUnLCAnZG9tQ29udGVudExvYWRlZEV2ZW50U3RhcnQnLCAnZG9tQ29udGVudExvYWRlZEV2ZW50RW5kJywgJ2RvbUNvbXBsZXRlJywgJ2xvYWRFdmVudFN0YXJ0JywgJ2xvYWRFdmVudEVuZCddO1xudmFyIENPTVBSRVNTRURfTkFWX1RJTUlOR19NQVJLUyA9IFsnZnMnLCAnbHMnLCAnbGUnLCAnY3MnLCAnY2UnLCAncXMnLCAncnMnLCAncmUnLCAnZGwnLCAnZGknLCAnZHMnLCAnZGUnLCAnZGMnLCAnZXMnLCAnZWUnXTtcblxuZnVuY3Rpb24gZ2V0UGFnZUxvYWRNYXJrcyh0aW1pbmcpIHtcbiAgdmFyIG1hcmtzID0gZ2V0TmF2aWdhdGlvblRpbWluZ01hcmtzKHRpbWluZyk7XG5cbiAgaWYgKG1hcmtzID09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmF2aWdhdGlvblRpbWluZzogbWFya3MsXG4gICAgYWdlbnQ6IHtcbiAgICAgIHRpbWVUb0ZpcnN0Qnl0ZTogbWFya3MucmVzcG9uc2VTdGFydCxcbiAgICAgIGRvbUludGVyYWN0aXZlOiBtYXJrcy5kb21JbnRlcmFjdGl2ZSxcbiAgICAgIGRvbUNvbXBsZXRlOiBtYXJrcy5kb21Db21wbGV0ZVxuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0TmF2aWdhdGlvblRpbWluZ01hcmtzKHRpbWluZykge1xuICB2YXIgcmVkaXJlY3RTdGFydCA9IHRpbWluZy5yZWRpcmVjdFN0YXJ0LFxuICAgICAgZmV0Y2hTdGFydCA9IHRpbWluZy5mZXRjaFN0YXJ0LFxuICAgICAgbmF2aWdhdGlvblN0YXJ0ID0gdGltaW5nLm5hdmlnYXRpb25TdGFydCxcbiAgICAgIHJlc3BvbnNlU3RhcnQgPSB0aW1pbmcucmVzcG9uc2VTdGFydCxcbiAgICAgIHJlc3BvbnNlRW5kID0gdGltaW5nLnJlc3BvbnNlRW5kO1xuXG4gIGlmIChmZXRjaFN0YXJ0ID49IG5hdmlnYXRpb25TdGFydCAmJiByZXNwb25zZVN0YXJ0ID49IGZldGNoU3RhcnQgJiYgcmVzcG9uc2VFbmQgPj0gcmVzcG9uc2VTdGFydCkge1xuICAgIHZhciBtYXJrcyA9IHt9O1xuICAgIE5BVklHQVRJT05fVElNSU5HX01BUktTLmZvckVhY2goZnVuY3Rpb24gKHRpbWluZ0tleSkge1xuICAgICAgdmFyIG0gPSB0aW1pbmdbdGltaW5nS2V5XTtcblxuICAgICAgaWYgKG0gJiYgbSA+PSBmZXRjaFN0YXJ0KSB7XG4gICAgICAgIGlmIChpc1JlZGlyZWN0SW5mb0F2YWlsYWJsZSh0aW1pbmcpKSB7XG4gICAgICAgICAgbWFya3NbdGltaW5nS2V5XSA9IHBhcnNlSW50KG0gLSByZWRpcmVjdFN0YXJ0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXJrc1t0aW1pbmdLZXldID0gcGFyc2VJbnQobSAtIGZldGNoU3RhcnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG1hcmtzO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCB7IGdldFBhZ2VMb2FkTWFya3MsIE5BVklHQVRJT05fVElNSU5HX01BUktTLCBDT01QUkVTU0VEX05BVl9USU1JTkdfTUFSS1MgfTsiLCJpbXBvcnQgeyBzaG91bGRDcmVhdGVTcGFuIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgU3BhbiBmcm9tICcuLi9zcGFuJztcbnZhciBldmVudFBhaXJzID0gW1sncmVkaXJlY3RTdGFydCcsICdyZWRpcmVjdEVuZCcsICdSZWRpcmVjdCddLCBbJ2RvbWFpbkxvb2t1cFN0YXJ0JywgJ2RvbWFpbkxvb2t1cEVuZCcsICdEb21haW4gbG9va3VwJ10sIFsnY29ubmVjdFN0YXJ0JywgJ2Nvbm5lY3RFbmQnLCAnTWFraW5nIGEgY29ubmVjdGlvbiB0byB0aGUgc2VydmVyJ10sIFsncmVxdWVzdFN0YXJ0JywgJ3Jlc3BvbnNlRW5kJywgJ1JlcXVlc3RpbmcgYW5kIHJlY2VpdmluZyB0aGUgZG9jdW1lbnQnXSwgWydkb21Mb2FkaW5nJywgJ2RvbUludGVyYWN0aXZlJywgJ1BhcnNpbmcgdGhlIGRvY3VtZW50LCBleGVjdXRpbmcgc3luYy4gc2NyaXB0cyddLCBbJ2RvbUNvbnRlbnRMb2FkZWRFdmVudFN0YXJ0JywgJ2RvbUNvbnRlbnRMb2FkZWRFdmVudEVuZCcsICdGaXJlIFwiRE9NQ29udGVudExvYWRlZFwiIGV2ZW50J10sIFsnbG9hZEV2ZW50U3RhcnQnLCAnbG9hZEV2ZW50RW5kJywgJ0ZpcmUgXCJsb2FkXCIgZXZlbnQnXV07XG5cbmZ1bmN0aW9uIGNyZWF0ZU5hdmlnYXRpb25UaW1pbmdTcGFucyh0aW1pbmdzLCBiYXNlVGltZSwgdHJTdGFydCwgdHJFbmQpIHtcbiAgdmFyIHNwYW5zID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBldmVudFBhaXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHN0YXJ0ID0gdGltaW5nc1tldmVudFBhaXJzW2ldWzBdXTtcbiAgICB2YXIgZW5kID0gdGltaW5nc1tldmVudFBhaXJzW2ldWzFdXTtcblxuICAgIGlmICghc2hvdWxkQ3JlYXRlU3BhbihzdGFydCwgZW5kLCB0clN0YXJ0LCB0ckVuZCwgYmFzZVRpbWUpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIgc3BhbiA9IG5ldyBTcGFuKGV2ZW50UGFpcnNbaV1bMl0sICdoYXJkLW5hdmlnYXRpb24uYnJvd3Nlci10aW1pbmcnKTtcbiAgICB2YXIgZGF0YSA9IG51bGw7XG5cbiAgICBpZiAoZXZlbnRQYWlyc1tpXVswXSA9PT0gJ3JlcXVlc3RTdGFydCcpIHtcbiAgICAgIHNwYW4ucGFnZVJlc3BvbnNlID0gdHJ1ZTtcbiAgICAgIGRhdGEgPSB7XG4gICAgICAgIHVybDogbG9jYXRpb24ub3JpZ2luXG4gICAgICB9O1xuICAgIH1cblxuICAgIHNwYW4uX3N0YXJ0ID0gc3RhcnQgLSBiYXNlVGltZTtcbiAgICBzcGFuLmVuZChlbmQgLSBiYXNlVGltZSwgZGF0YSk7XG4gICAgc3BhbnMucHVzaChzcGFuKTtcbiAgfVxuXG4gIHJldHVybiBzcGFucztcbn1cblxuZXhwb3J0IHsgY3JlYXRlTmF2aWdhdGlvblRpbWluZ1NwYW5zIH07IiwiaW1wb3J0IHsgc3RyaXBRdWVyeVN0cmluZ0Zyb21VcmwgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMnO1xuaW1wb3J0IHsgc2hvdWxkQ3JlYXRlU3BhbiB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgUkVTT1VSQ0VfSU5JVElBVE9SX1RZUEVTIH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgU3BhbiBmcm9tICcuLi9zcGFuJztcblxuZnVuY3Rpb24gY3JlYXRlUmVzb3VyY2VUaW1pbmdTcGFuKHJlc291cmNlVGltaW5nRW50cnkpIHtcbiAgdmFyIG5hbWUgPSByZXNvdXJjZVRpbWluZ0VudHJ5Lm5hbWUsXG4gICAgICBpbml0aWF0b3JUeXBlID0gcmVzb3VyY2VUaW1pbmdFbnRyeS5pbml0aWF0b3JUeXBlLFxuICAgICAgc3RhcnRUaW1lID0gcmVzb3VyY2VUaW1pbmdFbnRyeS5zdGFydFRpbWUsXG4gICAgICByZXNwb25zZUVuZCA9IHJlc291cmNlVGltaW5nRW50cnkucmVzcG9uc2VFbmQ7XG4gIHZhciBraW5kID0gJ3Jlc291cmNlJztcblxuICBpZiAoaW5pdGlhdG9yVHlwZSkge1xuICAgIGtpbmQgKz0gJy4nICsgaW5pdGlhdG9yVHlwZTtcbiAgfVxuXG4gIHZhciBzcGFuTmFtZSA9IHN0cmlwUXVlcnlTdHJpbmdGcm9tVXJsKG5hbWUpO1xuICB2YXIgc3BhbiA9IG5ldyBTcGFuKHNwYW5OYW1lLCBraW5kKTtcbiAgc3Bhbi5fc3RhcnQgPSBzdGFydFRpbWU7XG4gIHNwYW4uZW5kKHJlc3BvbnNlRW5kLCB7XG4gICAgdXJsOiBuYW1lLFxuICAgIGVudHJ5OiByZXNvdXJjZVRpbWluZ0VudHJ5XG4gIH0pO1xuICByZXR1cm4gc3Bhbjtcbn1cblxuZnVuY3Rpb24gaXNDYXB0dXJlZEJ5UGF0Y2hpbmcocmVzb3VyY2VTdGFydFRpbWUsIHJlcXVlc3RQYXRjaFRpbWUpIHtcbiAgcmV0dXJuIHJlcXVlc3RQYXRjaFRpbWUgIT0gbnVsbCAmJiByZXNvdXJjZVN0YXJ0VGltZSA+IHJlcXVlc3RQYXRjaFRpbWU7XG59XG5cbmZ1bmN0aW9uIGlzSW50YWtlQVBJRW5kcG9pbnQodXJsKSB7XG4gIHJldHVybiAvaW50YWtlXFwvdlxcZCtcXC9ydW1cXC9ldmVudHMvLnRlc3QodXJsKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUmVzb3VyY2VUaW1pbmdTcGFucyhlbnRyaWVzLCByZXF1ZXN0UGF0Y2hUaW1lLCB0clN0YXJ0LCB0ckVuZCkge1xuICB2YXIgc3BhbnMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgX2VudHJpZXMkaSA9IGVudHJpZXNbaV0sXG4gICAgICAgIGluaXRpYXRvclR5cGUgPSBfZW50cmllcyRpLmluaXRpYXRvclR5cGUsXG4gICAgICAgIG5hbWUgPSBfZW50cmllcyRpLm5hbWUsXG4gICAgICAgIHN0YXJ0VGltZSA9IF9lbnRyaWVzJGkuc3RhcnRUaW1lLFxuICAgICAgICByZXNwb25zZUVuZCA9IF9lbnRyaWVzJGkucmVzcG9uc2VFbmQ7XG5cbiAgICBpZiAoUkVTT1VSQ0VfSU5JVElBVE9SX1RZUEVTLmluZGV4T2YoaW5pdGlhdG9yVHlwZSkgPT09IC0xIHx8IG5hbWUgPT0gbnVsbCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKChpbml0aWF0b3JUeXBlID09PSAneG1saHR0cHJlcXVlc3QnIHx8IGluaXRpYXRvclR5cGUgPT09ICdmZXRjaCcpICYmIChpc0ludGFrZUFQSUVuZHBvaW50KG5hbWUpIHx8IGlzQ2FwdHVyZWRCeVBhdGNoaW5nKHN0YXJ0VGltZSwgcmVxdWVzdFBhdGNoVGltZSkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoc2hvdWxkQ3JlYXRlU3BhbihzdGFydFRpbWUsIHJlc3BvbnNlRW5kLCB0clN0YXJ0LCB0ckVuZCkpIHtcbiAgICAgIHNwYW5zLnB1c2goY3JlYXRlUmVzb3VyY2VUaW1pbmdTcGFuKGVudHJpZXNbaV0pKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3BhbnM7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZVJlc291cmNlVGltaW5nU3BhbnMgfTsiLCJpbXBvcnQgeyBVU0VSX1RJTUlOR19USFJFU0hPTEQgfSBmcm9tICcuLi8uLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IHNob3VsZENyZWF0ZVNwYW4gfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBTcGFuIGZyb20gJy4uL3NwYW4nO1xuXG5mdW5jdGlvbiBjcmVhdGVVc2VyVGltaW5nU3BhbnMoZW50cmllcywgdHJTdGFydCwgdHJFbmQpIHtcbiAgdmFyIHVzZXJUaW1pbmdTcGFucyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBfZW50cmllcyRpID0gZW50cmllc1tpXSxcbiAgICAgICAgbmFtZSA9IF9lbnRyaWVzJGkubmFtZSxcbiAgICAgICAgc3RhcnRUaW1lID0gX2VudHJpZXMkaS5zdGFydFRpbWUsXG4gICAgICAgIGR1cmF0aW9uID0gX2VudHJpZXMkaS5kdXJhdGlvbjtcbiAgICB2YXIgZW5kID0gc3RhcnRUaW1lICsgZHVyYXRpb247XG5cbiAgICBpZiAoZHVyYXRpb24gPD0gVVNFUl9USU1JTkdfVEhSRVNIT0xEIHx8ICFzaG91bGRDcmVhdGVTcGFuKHN0YXJ0VGltZSwgZW5kLCB0clN0YXJ0LCB0ckVuZCkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciBraW5kID0gJ2FwcCc7XG4gICAgdmFyIHNwYW4gPSBuZXcgU3BhbihuYW1lLCBraW5kKTtcbiAgICBzcGFuLl9zdGFydCA9IHN0YXJ0VGltZTtcbiAgICBzcGFuLmVuZChlbmQpO1xuICAgIHVzZXJUaW1pbmdTcGFucy5wdXNoKHNwYW4pO1xuICB9XG5cbiAgcmV0dXJuIHVzZXJUaW1pbmdTcGFucztcbn1cblxuZXhwb3J0IHsgY3JlYXRlVXNlclRpbWluZ1NwYW5zIH07IiwiaW1wb3J0IHsgTUFYX1NQQU5fRFVSQVRJT04gfSBmcm9tICcuLi8uLi9jb21tb24vY29uc3RhbnRzJztcblxuZnVuY3Rpb24gc2hvdWxkQ3JlYXRlU3BhbihzdGFydCwgZW5kLCB0clN0YXJ0LCB0ckVuZCwgYmFzZVRpbWUpIHtcbiAgaWYgKGJhc2VUaW1lID09PSB2b2lkIDApIHtcbiAgICBiYXNlVGltZSA9IDA7XG4gIH1cblxuICByZXR1cm4gdHlwZW9mIHN0YXJ0ID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgZW5kID09PSAnbnVtYmVyJyAmJiBzdGFydCA+PSBiYXNlVGltZSAmJiBlbmQgPiBzdGFydCAmJiBzdGFydCAtIGJhc2VUaW1lID49IHRyU3RhcnQgJiYgZW5kIC0gYmFzZVRpbWUgPD0gdHJFbmQgJiYgZW5kIC0gc3RhcnQgPCBNQVhfU1BBTl9EVVJBVElPTiAmJiBzdGFydCAtIGJhc2VUaW1lIDwgTUFYX1NQQU5fRFVSQVRJT04gJiYgZW5kIC0gYmFzZVRpbWUgPCBNQVhfU1BBTl9EVVJBVElPTjtcbn1cblxuZXhwb3J0IHsgc2hvdWxkQ3JlYXRlU3BhbiB9OyIsImltcG9ydCB7IGNoZWNrU2FtZU9yaWdpbiwgaXNEdEhlYWRlclZhbGlkLCBwYXJzZUR0SGVhZGVyVmFsdWUsIGdldER0SGVhZGVyVmFsdWUsIGdldFRTSGVhZGVyVmFsdWUsIHN0cmlwUXVlcnlTdHJpbmdGcm9tVXJsLCBzZXRSZXF1ZXN0SGVhZGVyIH0gZnJvbSAnLi4vY29tbW9uL3V0aWxzJztcbmltcG9ydCB7IFVybCB9IGZyb20gJy4uL2NvbW1vbi91cmwnO1xuaW1wb3J0IHsgcGF0Y2hFdmVudEhhbmRsZXIgfSBmcm9tICcuLi9jb21tb24vcGF0Y2hpbmcnO1xuaW1wb3J0IHsgZ2xvYmFsU3RhdGUgfSBmcm9tICcuLi9jb21tb24vcGF0Y2hpbmcvcGF0Y2gtdXRpbHMnO1xuaW1wb3J0IHsgU0NIRURVTEUsIElOVk9LRSwgVFJBTlNBQ1RJT05fRU5ELCBBRlRFUl9FVkVOVCwgRkVUQ0gsIEhJU1RPUlksIFhNTEhUVFBSRVFVRVNULCBIVFRQX1JFUVVFU1RfVFlQRSwgT1VUQ09NRV9GQUlMVVJFLCBPVVRDT01FX1NVQ0NFU1MsIE9VVENPTUVfVU5LTk9XTiwgUVVFVUVfQUREX1RSQU5TQUNUSU9OIH0gZnJvbSAnLi4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyB0cnVuY2F0ZU1vZGVsLCBTUEFOX01PREVMLCBUUkFOU0FDVElPTl9NT0RFTCB9IGZyb20gJy4uL2NvbW1vbi90cnVuY2F0ZSc7XG5pbXBvcnQgeyBfX0RFVl9fIH0gZnJvbSAnLi4vc3RhdGUnO1xudmFyIFNJTUlMQVJfU1BBTl9UT19UUkFOU0FDVElPTl9SQVRJTyA9IDAuMDU7XG52YXIgVFJBTlNBQ1RJT05fRFVSQVRJT05fVEhSRVNIT0xEID0gNjAwMDA7XG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBTbWFsbENvbnRpbnVvdXNseVNpbWlsYXJTcGFucyhvcmlnaW5hbFNwYW5zLCB0cmFuc0R1cmF0aW9uLCB0aHJlc2hvbGQpIHtcbiAgb3JpZ2luYWxTcGFucy5zb3J0KGZ1bmN0aW9uIChzcGFuQSwgc3BhbkIpIHtcbiAgICByZXR1cm4gc3BhbkEuX3N0YXJ0IC0gc3BhbkIuX3N0YXJ0O1xuICB9KTtcbiAgdmFyIHNwYW5zID0gW107XG4gIHZhciBsYXN0Q291bnQgPSAxO1xuICBvcmlnaW5hbFNwYW5zLmZvckVhY2goZnVuY3Rpb24gKHNwYW4sIGluZGV4KSB7XG4gICAgaWYgKHNwYW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgc3BhbnMucHVzaChzcGFuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGxhc3RTcGFuID0gc3BhbnNbc3BhbnMubGVuZ3RoIC0gMV07XG4gICAgICB2YXIgaXNDb250aW51b3VzbHlTaW1pbGFyID0gbGFzdFNwYW4udHlwZSA9PT0gc3Bhbi50eXBlICYmIGxhc3RTcGFuLnN1YnR5cGUgPT09IHNwYW4uc3VidHlwZSAmJiBsYXN0U3Bhbi5hY3Rpb24gPT09IHNwYW4uYWN0aW9uICYmIGxhc3RTcGFuLm5hbWUgPT09IHNwYW4ubmFtZSAmJiBzcGFuLmR1cmF0aW9uKCkgLyB0cmFuc0R1cmF0aW9uIDwgdGhyZXNob2xkICYmIChzcGFuLl9zdGFydCAtIGxhc3RTcGFuLl9lbmQpIC8gdHJhbnNEdXJhdGlvbiA8IHRocmVzaG9sZDtcbiAgICAgIHZhciBpc0xhc3RTcGFuID0gb3JpZ2luYWxTcGFucy5sZW5ndGggPT09IGluZGV4ICsgMTtcblxuICAgICAgaWYgKGlzQ29udGludW91c2x5U2ltaWxhcikge1xuICAgICAgICBsYXN0Q291bnQrKztcbiAgICAgICAgbGFzdFNwYW4uX2VuZCA9IHNwYW4uX2VuZDtcbiAgICAgIH1cblxuICAgICAgaWYgKGxhc3RDb3VudCA+IDEgJiYgKCFpc0NvbnRpbnVvdXNseVNpbWlsYXIgfHwgaXNMYXN0U3BhbikpIHtcbiAgICAgICAgbGFzdFNwYW4ubmFtZSA9IGxhc3RDb3VudCArICd4ICcgKyBsYXN0U3Bhbi5uYW1lO1xuICAgICAgICBsYXN0Q291bnQgPSAxO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzQ29udGludW91c2x5U2ltaWxhcikge1xuICAgICAgICBzcGFucy5wdXNoKHNwYW4pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzcGFucztcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZGp1c3RUcmFuc2FjdGlvbih0cmFuc2FjdGlvbikge1xuICBpZiAodHJhbnNhY3Rpb24uc2FtcGxlZCkge1xuICAgIHZhciBmaWx0ZXJkU3BhbnMgPSB0cmFuc2FjdGlvbi5zcGFucy5maWx0ZXIoZnVuY3Rpb24gKHNwYW4pIHtcbiAgICAgIHJldHVybiBzcGFuLmR1cmF0aW9uKCkgPiAwICYmIHNwYW4uX3N0YXJ0ID49IHRyYW5zYWN0aW9uLl9zdGFydCAmJiBzcGFuLl9lbmQgPD0gdHJhbnNhY3Rpb24uX2VuZDtcbiAgICB9KTtcblxuICAgIGlmICh0cmFuc2FjdGlvbi5pc01hbmFnZWQoKSkge1xuICAgICAgdmFyIGR1cmF0aW9uID0gdHJhbnNhY3Rpb24uZHVyYXRpb24oKTtcbiAgICAgIHZhciBzaW1pbGFyU3BhbnMgPSBncm91cFNtYWxsQ29udGludW91c2x5U2ltaWxhclNwYW5zKGZpbHRlcmRTcGFucywgZHVyYXRpb24sIFNJTUlMQVJfU1BBTl9UT19UUkFOU0FDVElPTl9SQVRJTyk7XG4gICAgICB0cmFuc2FjdGlvbi5zcGFucyA9IHNpbWlsYXJTcGFucztcbiAgICB9IGVsc2Uge1xuICAgICAgdHJhbnNhY3Rpb24uc3BhbnMgPSBmaWx0ZXJkU3BhbnM7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRyYW5zYWN0aW9uLnJlc2V0RmllbGRzKCk7XG4gIH1cblxuICByZXR1cm4gdHJhbnNhY3Rpb247XG59XG5cbnZhciBQZXJmb3JtYW5jZU1vbml0b3JpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFBlcmZvcm1hbmNlTW9uaXRvcmluZyhhcG1TZXJ2ZXIsIGNvbmZpZ1NlcnZpY2UsIGxvZ2dpbmdTZXJ2aWNlLCB0cmFuc2FjdGlvblNlcnZpY2UpIHtcbiAgICB0aGlzLl9hcG1TZXJ2ZXIgPSBhcG1TZXJ2ZXI7XG4gICAgdGhpcy5fY29uZmlnU2VydmljZSA9IGNvbmZpZ1NlcnZpY2U7XG4gICAgdGhpcy5fbG9nZ2luU2VydmljZSA9IGxvZ2dpbmdTZXJ2aWNlO1xuICAgIHRoaXMuX3RyYW5zYWN0aW9uU2VydmljZSA9IHRyYW5zYWN0aW9uU2VydmljZTtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBQZXJmb3JtYW5jZU1vbml0b3JpbmcucHJvdG90eXBlO1xuXG4gIF9wcm90by5pbml0ID0gZnVuY3Rpb24gaW5pdChmbGFncykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoZmxhZ3MgPT09IHZvaWQgMCkge1xuICAgICAgZmxhZ3MgPSB7fTtcbiAgICB9XG5cbiAgICB0aGlzLl9jb25maWdTZXJ2aWNlLmV2ZW50cy5vYnNlcnZlKFRSQU5TQUNUSU9OX0VORCArIEFGVEVSX0VWRU5ULCBmdW5jdGlvbiAodHIpIHtcbiAgICAgIHZhciBwYXlsb2FkID0gX3RoaXMuY3JlYXRlVHJhbnNhY3Rpb25QYXlsb2FkKHRyKTtcblxuICAgICAgaWYgKHBheWxvYWQpIHtcbiAgICAgICAgX3RoaXMuX2FwbVNlcnZlci5hZGRUcmFuc2FjdGlvbihwYXlsb2FkKTtcblxuICAgICAgICBfdGhpcy5fY29uZmlnU2VydmljZS5kaXNwYXRjaEV2ZW50KFFVRVVFX0FERF9UUkFOU0FDVElPTik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoZmxhZ3NbSElTVE9SWV0pIHtcbiAgICAgIHBhdGNoRXZlbnRIYW5kbGVyLm9ic2VydmUoSElTVE9SWSwgdGhpcy5nZXRIaXN0b3J5U3ViKCkpO1xuICAgIH1cblxuICAgIGlmIChmbGFnc1tYTUxIVFRQUkVRVUVTVF0pIHtcbiAgICAgIHBhdGNoRXZlbnRIYW5kbGVyLm9ic2VydmUoWE1MSFRUUFJFUVVFU1QsIHRoaXMuZ2V0WEhSU3ViKCkpO1xuICAgIH1cblxuICAgIGlmIChmbGFnc1tGRVRDSF0pIHtcbiAgICAgIHBhdGNoRXZlbnRIYW5kbGVyLm9ic2VydmUoRkVUQ0gsIHRoaXMuZ2V0RmV0Y2hTdWIoKSk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5nZXRIaXN0b3J5U3ViID0gZnVuY3Rpb24gZ2V0SGlzdG9yeVN1YigpIHtcbiAgICB2YXIgdHJhbnNhY3Rpb25TZXJ2aWNlID0gdGhpcy5fdHJhbnNhY3Rpb25TZXJ2aWNlO1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQsIHRhc2spIHtcbiAgICAgIGlmICh0YXNrLnNvdXJjZSA9PT0gSElTVE9SWSAmJiBldmVudCA9PT0gSU5WT0tFKSB7XG4gICAgICAgIHRyYW5zYWN0aW9uU2VydmljZS5zdGFydFRyYW5zYWN0aW9uKHRhc2suZGF0YS50aXRsZSwgJ3JvdXRlLWNoYW5nZScsIHtcbiAgICAgICAgICBtYW5hZ2VkOiB0cnVlLFxuICAgICAgICAgIGNhblJldXNlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgX3Byb3RvLmdldFhIUlN1YiA9IGZ1bmN0aW9uIGdldFhIUlN1YigpIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQsIHRhc2spIHtcbiAgICAgIGlmICh0YXNrLnNvdXJjZSA9PT0gWE1MSFRUUFJFUVVFU1QgJiYgIWdsb2JhbFN0YXRlLmZldGNoSW5Qcm9ncmVzcykge1xuICAgICAgICBfdGhpczIucHJvY2Vzc0FQSUNhbGxzKGV2ZW50LCB0YXNrKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIF9wcm90by5nZXRGZXRjaFN1YiA9IGZ1bmN0aW9uIGdldEZldGNoU3ViKCkge1xuICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCwgdGFzaykge1xuICAgICAgaWYgKHRhc2suc291cmNlID09PSBGRVRDSCkge1xuICAgICAgICBfdGhpczMucHJvY2Vzc0FQSUNhbGxzKGV2ZW50LCB0YXNrKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIF9wcm90by5wcm9jZXNzQVBJQ2FsbHMgPSBmdW5jdGlvbiBwcm9jZXNzQVBJQ2FsbHMoZXZlbnQsIHRhc2spIHtcbiAgICB2YXIgY29uZmlnU2VydmljZSA9IHRoaXMuX2NvbmZpZ1NlcnZpY2U7XG4gICAgdmFyIHRyYW5zYWN0aW9uU2VydmljZSA9IHRoaXMuX3RyYW5zYWN0aW9uU2VydmljZTtcblxuICAgIGlmICh0YXNrLmRhdGEgJiYgdGFzay5kYXRhLnVybCkge1xuICAgICAgdmFyIGVuZHBvaW50cyA9IHRoaXMuX2FwbVNlcnZlci5nZXRFbmRwb2ludHMoKTtcblxuICAgICAgdmFyIGlzT3duRW5kcG9pbnQgPSBPYmplY3Qua2V5cyhlbmRwb2ludHMpLnNvbWUoZnVuY3Rpb24gKGVuZHBvaW50KSB7XG4gICAgICAgIHJldHVybiB0YXNrLmRhdGEudXJsLmluZGV4T2YoZW5kcG9pbnRzW2VuZHBvaW50XSkgIT09IC0xO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChpc093bkVuZHBvaW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZXZlbnQgPT09IFNDSEVEVUxFICYmIHRhc2suZGF0YSkge1xuICAgICAgdmFyIGRhdGEgPSB0YXNrLmRhdGE7XG4gICAgICB2YXIgcmVxdWVzdFVybCA9IG5ldyBVcmwoZGF0YS51cmwpO1xuICAgICAgdmFyIHNwYW5OYW1lID0gZGF0YS5tZXRob2QgKyAnICcgKyAocmVxdWVzdFVybC5yZWxhdGl2ZSA/IHJlcXVlc3RVcmwucGF0aCA6IHN0cmlwUXVlcnlTdHJpbmdGcm9tVXJsKHJlcXVlc3RVcmwuaHJlZikpO1xuXG4gICAgICBpZiAoIXRyYW5zYWN0aW9uU2VydmljZS5nZXRDdXJyZW50VHJhbnNhY3Rpb24oKSkge1xuICAgICAgICB0cmFuc2FjdGlvblNlcnZpY2Uuc3RhcnRUcmFuc2FjdGlvbihzcGFuTmFtZSwgSFRUUF9SRVFVRVNUX1RZUEUsIHtcbiAgICAgICAgICBtYW5hZ2VkOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3BhbiA9IHRyYW5zYWN0aW9uU2VydmljZS5zdGFydFNwYW4oc3Bhbk5hbWUsICdleHRlcm5hbC5odHRwJywge1xuICAgICAgICBibG9ja2luZzogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghc3Bhbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBpc0R0RW5hYmxlZCA9IGNvbmZpZ1NlcnZpY2UuZ2V0KCdkaXN0cmlidXRlZFRyYWNpbmcnKTtcbiAgICAgIHZhciBkdE9yaWdpbnMgPSBjb25maWdTZXJ2aWNlLmdldCgnZGlzdHJpYnV0ZWRUcmFjaW5nT3JpZ2lucycpO1xuICAgICAgdmFyIGN1cnJlbnRVcmwgPSBuZXcgVXJsKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAgIHZhciBpc1NhbWVPcmlnaW4gPSBjaGVja1NhbWVPcmlnaW4ocmVxdWVzdFVybC5vcmlnaW4sIGN1cnJlbnRVcmwub3JpZ2luKSB8fCBjaGVja1NhbWVPcmlnaW4ocmVxdWVzdFVybC5vcmlnaW4sIGR0T3JpZ2lucyk7XG4gICAgICB2YXIgdGFyZ2V0ID0gZGF0YS50YXJnZXQ7XG5cbiAgICAgIGlmIChpc0R0RW5hYmxlZCAmJiBpc1NhbWVPcmlnaW4gJiYgdGFyZ2V0KSB7XG4gICAgICAgIHRoaXMuaW5qZWN0RHRIZWFkZXIoc3BhbiwgdGFyZ2V0KTtcbiAgICAgICAgdmFyIHByb3BhZ2F0ZVRyYWNlc3RhdGUgPSBjb25maWdTZXJ2aWNlLmdldCgncHJvcGFnYXRlVHJhY2VzdGF0ZScpO1xuXG4gICAgICAgIGlmIChwcm9wYWdhdGVUcmFjZXN0YXRlKSB7XG4gICAgICAgICAgdGhpcy5pbmplY3RUU0hlYWRlcihzcGFuLCB0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKF9fREVWX18pIHtcbiAgICAgICAgdGhpcy5fbG9nZ2luU2VydmljZS5kZWJ1ZyhcIkNvdWxkIG5vdCBpbmplY3QgZGlzdHJpYnV0ZWQgdHJhY2luZyBoZWFkZXIgdG8gdGhlIHJlcXVlc3Qgb3JpZ2luICgnXCIgKyByZXF1ZXN0VXJsLm9yaWdpbiArIFwiJykgZnJvbSB0aGUgY3VycmVudCBvcmlnaW4gKCdcIiArIGN1cnJlbnRVcmwub3JpZ2luICsgXCInKVwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGEuc3luYykge1xuICAgICAgICBzcGFuLnN5bmMgPSBkYXRhLnN5bmM7XG4gICAgICB9XG5cbiAgICAgIGRhdGEuc3BhbiA9IHNwYW47XG4gICAgfSBlbHNlIGlmIChldmVudCA9PT0gSU5WT0tFKSB7XG4gICAgICB2YXIgX2RhdGEgPSB0YXNrLmRhdGE7XG5cbiAgICAgIGlmIChfZGF0YSAmJiBfZGF0YS5zcGFuKSB7XG4gICAgICAgIHZhciBfc3BhbiA9IF9kYXRhLnNwYW4sXG4gICAgICAgICAgICByZXNwb25zZSA9IF9kYXRhLnJlc3BvbnNlLFxuICAgICAgICAgICAgX3RhcmdldCA9IF9kYXRhLnRhcmdldDtcbiAgICAgICAgdmFyIHN0YXR1cztcblxuICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RhdHVzID0gX3RhcmdldC5zdGF0dXM7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb3V0Y29tZTtcblxuICAgICAgICBpZiAoX2RhdGEuc3RhdHVzICE9ICdhYm9ydCcgJiYgIV9kYXRhLmFib3J0ZWQpIHtcbiAgICAgICAgICBpZiAoc3RhdHVzID49IDQwMCB8fCBzdGF0dXMgPT0gMCkge1xuICAgICAgICAgICAgb3V0Y29tZSA9IE9VVENPTUVfRkFJTFVSRTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0Y29tZSA9IE9VVENPTUVfU1VDQ0VTUztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0Y29tZSA9IE9VVENPTUVfVU5LTk9XTjtcbiAgICAgICAgfVxuXG4gICAgICAgIF9zcGFuLm91dGNvbWUgPSBvdXRjb21lO1xuICAgICAgICB2YXIgdHIgPSB0cmFuc2FjdGlvblNlcnZpY2UuZ2V0Q3VycmVudFRyYW5zYWN0aW9uKCk7XG5cbiAgICAgICAgaWYgKHRyICYmIHRyLnR5cGUgPT09IEhUVFBfUkVRVUVTVF9UWVBFKSB7XG4gICAgICAgICAgdHIub3V0Y29tZSA9IG91dGNvbWU7XG4gICAgICAgIH1cblxuICAgICAgICB0cmFuc2FjdGlvblNlcnZpY2UuZW5kU3Bhbihfc3BhbiwgX2RhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uaW5qZWN0RHRIZWFkZXIgPSBmdW5jdGlvbiBpbmplY3REdEhlYWRlcihzcGFuLCB0YXJnZXQpIHtcbiAgICB2YXIgaGVhZGVyTmFtZSA9IHRoaXMuX2NvbmZpZ1NlcnZpY2UuZ2V0KCdkaXN0cmlidXRlZFRyYWNpbmdIZWFkZXJOYW1lJyk7XG5cbiAgICB2YXIgaGVhZGVyVmFsdWUgPSBnZXREdEhlYWRlclZhbHVlKHNwYW4pO1xuICAgIHZhciBpc0hlYWRlclZhbGlkID0gaXNEdEhlYWRlclZhbGlkKGhlYWRlclZhbHVlKTtcblxuICAgIGlmIChpc0hlYWRlclZhbGlkICYmIGhlYWRlclZhbHVlICYmIGhlYWRlck5hbWUpIHtcbiAgICAgIHNldFJlcXVlc3RIZWFkZXIodGFyZ2V0LCBoZWFkZXJOYW1lLCBoZWFkZXJWYWx1ZSk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5pbmplY3RUU0hlYWRlciA9IGZ1bmN0aW9uIGluamVjdFRTSGVhZGVyKHNwYW4sIHRhcmdldCkge1xuICAgIHZhciBoZWFkZXJWYWx1ZSA9IGdldFRTSGVhZGVyVmFsdWUoc3Bhbik7XG5cbiAgICBpZiAoaGVhZGVyVmFsdWUpIHtcbiAgICAgIHNldFJlcXVlc3RIZWFkZXIodGFyZ2V0LCAndHJhY2VzdGF0ZScsIGhlYWRlclZhbHVlKTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmV4dHJhY3REdEhlYWRlciA9IGZ1bmN0aW9uIGV4dHJhY3REdEhlYWRlcih0YXJnZXQpIHtcbiAgICB2YXIgY29uZmlnU2VydmljZSA9IHRoaXMuX2NvbmZpZ1NlcnZpY2U7XG4gICAgdmFyIGhlYWRlck5hbWUgPSBjb25maWdTZXJ2aWNlLmdldCgnZGlzdHJpYnV0ZWRUcmFjaW5nSGVhZGVyTmFtZScpO1xuXG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgcmV0dXJuIHBhcnNlRHRIZWFkZXJWYWx1ZSh0YXJnZXRbaGVhZGVyTmFtZV0pO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uZmlsdGVyVHJhbnNhY3Rpb24gPSBmdW5jdGlvbiBmaWx0ZXJUcmFuc2FjdGlvbih0cikge1xuICAgIHZhciBkdXJhdGlvbiA9IHRyLmR1cmF0aW9uKCk7XG5cbiAgICBpZiAoIWR1cmF0aW9uKSB7XG4gICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICB2YXIgbWVzc2FnZSA9IFwidHJhbnNhY3Rpb24oXCIgKyB0ci5pZCArIFwiLCBcIiArIHRyLm5hbWUgKyBcIikgd2FzIGRpc2NhcmRlZCEgXCI7XG5cbiAgICAgICAgaWYgKGR1cmF0aW9uID09PSAwKSB7XG4gICAgICAgICAgbWVzc2FnZSArPSBcIlRyYW5zYWN0aW9uIGR1cmF0aW9uIGlzIDBcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZXNzYWdlICs9IFwiVHJhbnNhY3Rpb24gd2Fzbid0IGVuZGVkXCI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb2dnaW5TZXJ2aWNlLmRlYnVnKG1lc3NhZ2UpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRyLmlzTWFuYWdlZCgpKSB7XG4gICAgICBpZiAoZHVyYXRpb24gPiBUUkFOU0FDVElPTl9EVVJBVElPTl9USFJFU0hPTEQpIHtcbiAgICAgICAgaWYgKF9fREVWX18pIHtcbiAgICAgICAgICB0aGlzLl9sb2dnaW5TZXJ2aWNlLmRlYnVnKFwidHJhbnNhY3Rpb24oXCIgKyB0ci5pZCArIFwiLCBcIiArIHRyLm5hbWUgKyBcIikgd2FzIGRpc2NhcmRlZCEgVHJhbnNhY3Rpb24gZHVyYXRpb24gKFwiICsgZHVyYXRpb24gKyBcIikgaXMgZ3JlYXRlciB0aGFuIG1hbmFnZWQgdHJhbnNhY3Rpb24gdGhyZXNob2xkIChcIiArIFRSQU5TQUNUSU9OX0RVUkFUSU9OX1RIUkVTSE9MRCArIFwiKVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRyLnNhbXBsZWQgJiYgdHIuc3BhbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgICAgdGhpcy5fbG9nZ2luU2VydmljZS5kZWJ1ZyhcInRyYW5zYWN0aW9uKFwiICsgdHIuaWQgKyBcIiwgXCIgKyB0ci5uYW1lICsgXCIpIHdhcyBkaXNjYXJkZWQhIFRyYW5zYWN0aW9uIGRvZXMgbm90IGhhdmUgYW55IHNwYW5zXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIF9wcm90by5jcmVhdGVUcmFuc2FjdGlvbkRhdGFNb2RlbCA9IGZ1bmN0aW9uIGNyZWF0ZVRyYW5zYWN0aW9uRGF0YU1vZGVsKHRyYW5zYWN0aW9uKSB7XG4gICAgdmFyIHRyYW5zYWN0aW9uU3RhcnQgPSB0cmFuc2FjdGlvbi5fc3RhcnQ7XG4gICAgdmFyIHNwYW5zID0gdHJhbnNhY3Rpb24uc3BhbnMubWFwKGZ1bmN0aW9uIChzcGFuKSB7XG4gICAgICB2YXIgc3BhbkRhdGEgPSB7XG4gICAgICAgIGlkOiBzcGFuLmlkLFxuICAgICAgICB0cmFuc2FjdGlvbl9pZDogdHJhbnNhY3Rpb24uaWQsXG4gICAgICAgIHBhcmVudF9pZDogc3Bhbi5wYXJlbnRJZCB8fCB0cmFuc2FjdGlvbi5pZCxcbiAgICAgICAgdHJhY2VfaWQ6IHRyYW5zYWN0aW9uLnRyYWNlSWQsXG4gICAgICAgIG5hbWU6IHNwYW4ubmFtZSxcbiAgICAgICAgdHlwZTogc3Bhbi50eXBlLFxuICAgICAgICBzdWJ0eXBlOiBzcGFuLnN1YnR5cGUsXG4gICAgICAgIGFjdGlvbjogc3Bhbi5hY3Rpb24sXG4gICAgICAgIHN5bmM6IHNwYW4uc3luYyxcbiAgICAgICAgc3RhcnQ6IHBhcnNlSW50KHNwYW4uX3N0YXJ0IC0gdHJhbnNhY3Rpb25TdGFydCksXG4gICAgICAgIGR1cmF0aW9uOiBzcGFuLmR1cmF0aW9uKCksXG4gICAgICAgIGNvbnRleHQ6IHNwYW4uY29udGV4dCxcbiAgICAgICAgb3V0Y29tZTogc3Bhbi5vdXRjb21lLFxuICAgICAgICBzYW1wbGVfcmF0ZTogc3Bhbi5zYW1wbGVSYXRlXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHRydW5jYXRlTW9kZWwoU1BBTl9NT0RFTCwgc3BhbkRhdGEpO1xuICAgIH0pO1xuICAgIHZhciB0cmFuc2FjdGlvbkRhdGEgPSB7XG4gICAgICBpZDogdHJhbnNhY3Rpb24uaWQsXG4gICAgICB0cmFjZV9pZDogdHJhbnNhY3Rpb24udHJhY2VJZCxcbiAgICAgIHNlc3Npb246IHRyYW5zYWN0aW9uLnNlc3Npb24sXG4gICAgICBuYW1lOiB0cmFuc2FjdGlvbi5uYW1lLFxuICAgICAgdHlwZTogdHJhbnNhY3Rpb24udHlwZSxcbiAgICAgIGR1cmF0aW9uOiB0cmFuc2FjdGlvbi5kdXJhdGlvbigpLFxuICAgICAgc3BhbnM6IHNwYW5zLFxuICAgICAgY29udGV4dDogdHJhbnNhY3Rpb24uY29udGV4dCxcbiAgICAgIG1hcmtzOiB0cmFuc2FjdGlvbi5tYXJrcyxcbiAgICAgIGJyZWFrZG93bjogdHJhbnNhY3Rpb24uYnJlYWtkb3duVGltaW5ncyxcbiAgICAgIHNwYW5fY291bnQ6IHtcbiAgICAgICAgc3RhcnRlZDogc3BhbnMubGVuZ3RoXG4gICAgICB9LFxuICAgICAgc2FtcGxlZDogdHJhbnNhY3Rpb24uc2FtcGxlZCxcbiAgICAgIHNhbXBsZV9yYXRlOiB0cmFuc2FjdGlvbi5zYW1wbGVSYXRlLFxuICAgICAgZXhwZXJpZW5jZTogdHJhbnNhY3Rpb24uZXhwZXJpZW5jZSxcbiAgICAgIG91dGNvbWU6IHRyYW5zYWN0aW9uLm91dGNvbWVcbiAgICB9O1xuICAgIHJldHVybiB0cnVuY2F0ZU1vZGVsKFRSQU5TQUNUSU9OX01PREVMLCB0cmFuc2FjdGlvbkRhdGEpO1xuICB9O1xuXG4gIF9wcm90by5jcmVhdGVUcmFuc2FjdGlvblBheWxvYWQgPSBmdW5jdGlvbiBjcmVhdGVUcmFuc2FjdGlvblBheWxvYWQodHJhbnNhY3Rpb24pIHtcbiAgICB2YXIgYWRqdXN0ZWRUcmFuc2FjdGlvbiA9IGFkanVzdFRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uKTtcbiAgICB2YXIgZmlsdGVyZWQgPSB0aGlzLmZpbHRlclRyYW5zYWN0aW9uKGFkanVzdGVkVHJhbnNhY3Rpb24pO1xuXG4gICAgaWYgKGZpbHRlcmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGVUcmFuc2FjdGlvbkRhdGFNb2RlbCh0cmFuc2FjdGlvbik7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBQZXJmb3JtYW5jZU1vbml0b3Jpbmc7XG59KCk7XG5cbmV4cG9ydCB7IFBlcmZvcm1hbmNlTW9uaXRvcmluZyBhcyBkZWZhdWx0IH07IiwiaW1wb3J0IHsgZ2VuZXJhdGVSYW5kb21JZCwgc2V0TGFiZWwsIG1lcmdlLCBnZXREdXJhdGlvbiwgZ2V0VGltZSB9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgeyBOQU1FX1VOS05PV04sIFRZUEVfQ1VTVE9NIH0gZnJvbSAnLi4vY29tbW9uL2NvbnN0YW50cyc7XG5cbnZhciBTcGFuQmFzZSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU3BhbkJhc2UobmFtZSwgdHlwZSwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgIG5hbWUgPSBOQU1FX1VOS05PV047XG4gICAgfVxuXG4gICAgaWYgKCF0eXBlKSB7XG4gICAgICB0eXBlID0gVFlQRV9DVVNUT007XG4gICAgfVxuXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5pZCA9IG9wdGlvbnMuaWQgfHwgZ2VuZXJhdGVSYW5kb21JZCgxNik7XG4gICAgdGhpcy50cmFjZUlkID0gb3B0aW9ucy50cmFjZUlkO1xuICAgIHRoaXMuc2FtcGxlZCA9IG9wdGlvbnMuc2FtcGxlZDtcbiAgICB0aGlzLnNhbXBsZVJhdGUgPSBvcHRpb25zLnNhbXBsZVJhdGU7XG4gICAgdGhpcy50aW1lc3RhbXAgPSBvcHRpb25zLnRpbWVzdGFtcDtcbiAgICB0aGlzLl9zdGFydCA9IGdldFRpbWUob3B0aW9ucy5zdGFydFRpbWUpO1xuICAgIHRoaXMuX2VuZCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmVuZGVkID0gZmFsc2U7XG4gICAgdGhpcy5vdXRjb21lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMub25FbmQgPSBvcHRpb25zLm9uRW5kO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFNwYW5CYXNlLnByb3RvdHlwZTtcblxuICBfcHJvdG8uZW5zdXJlQ29udGV4dCA9IGZ1bmN0aW9uIGVuc3VyZUNvbnRleHQoKSB7XG4gICAgaWYgKCF0aGlzLmNvbnRleHQpIHtcbiAgICAgIHRoaXMuY29udGV4dCA9IHt9O1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uYWRkTGFiZWxzID0gZnVuY3Rpb24gYWRkTGFiZWxzKHRhZ3MpIHtcbiAgICB0aGlzLmVuc3VyZUNvbnRleHQoKTtcbiAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgaWYgKCFjdHgudGFncykge1xuICAgICAgY3R4LnRhZ3MgPSB7fTtcbiAgICB9XG5cbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHRhZ3MpO1xuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgcmV0dXJuIHNldExhYmVsKGssIHRhZ3Nba10sIGN0eC50YWdzKTtcbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8uYWRkQ29udGV4dCA9IGZ1bmN0aW9uIGFkZENvbnRleHQoKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGNvbnRleHQgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBjb250ZXh0W19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIGlmIChjb250ZXh0Lmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIHRoaXMuZW5zdXJlQ29udGV4dCgpO1xuICAgIG1lcmdlLmFwcGx5KHZvaWQgMCwgW3RoaXMuY29udGV4dF0uY29uY2F0KGNvbnRleHQpKTtcbiAgfTtcblxuICBfcHJvdG8uZW5kID0gZnVuY3Rpb24gZW5kKGVuZFRpbWUpIHtcbiAgICBpZiAodGhpcy5lbmRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZW5kZWQgPSB0cnVlO1xuICAgIHRoaXMuX2VuZCA9IGdldFRpbWUoZW5kVGltZSk7XG4gICAgdGhpcy5jYWxsT25FbmQoKTtcbiAgfTtcblxuICBfcHJvdG8uY2FsbE9uRW5kID0gZnVuY3Rpb24gY2FsbE9uRW5kKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vbkVuZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5vbkVuZCh0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmR1cmF0aW9uID0gZnVuY3Rpb24gZHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIGdldER1cmF0aW9uKHRoaXMuX3N0YXJ0LCB0aGlzLl9lbmQpO1xuICB9O1xuXG4gIHJldHVybiBTcGFuQmFzZTtcbn0oKTtcblxuZXhwb3J0IGRlZmF1bHQgU3BhbkJhc2U7IiwiZnVuY3Rpb24gX2luaGVyaXRzTG9vc2Uoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzLnByb3RvdHlwZSk7IHN1YkNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHN1YkNsYXNzOyBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmltcG9ydCBTcGFuQmFzZSBmcm9tICcuL3NwYW4tYmFzZSc7XG5pbXBvcnQgeyBhZGRTcGFuQ29udGV4dCB9IGZyb20gJy4uL2NvbW1vbi9jb250ZXh0JztcblxudmFyIFNwYW4gPSBmdW5jdGlvbiAoX1NwYW5CYXNlKSB7XG4gIF9pbmhlcml0c0xvb3NlKFNwYW4sIF9TcGFuQmFzZSk7XG5cbiAgZnVuY3Rpb24gU3BhbihuYW1lLCB0eXBlLCBvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX3RoaXMgPSBfU3BhbkJhc2UuY2FsbCh0aGlzLCBuYW1lLCB0eXBlLCBvcHRpb25zKSB8fCB0aGlzO1xuICAgIF90aGlzLnBhcmVudElkID0gX3RoaXMub3B0aW9ucy5wYXJlbnRJZDtcbiAgICBfdGhpcy5zdWJ0eXBlID0gdW5kZWZpbmVkO1xuICAgIF90aGlzLmFjdGlvbiA9IHVuZGVmaW5lZDtcblxuICAgIGlmIChfdGhpcy50eXBlLmluZGV4T2YoJy4nKSAhPT0gLTEpIHtcbiAgICAgIHZhciBmaWVsZHMgPSBfdGhpcy50eXBlLnNwbGl0KCcuJywgMyk7XG5cbiAgICAgIF90aGlzLnR5cGUgPSBmaWVsZHNbMF07XG4gICAgICBfdGhpcy5zdWJ0eXBlID0gZmllbGRzWzFdO1xuICAgICAgX3RoaXMuYWN0aW9uID0gZmllbGRzWzJdO1xuICAgIH1cblxuICAgIF90aGlzLnN5bmMgPSBfdGhpcy5vcHRpb25zLnN5bmM7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFNwYW4ucHJvdG90eXBlO1xuXG4gIF9wcm90by5lbmQgPSBmdW5jdGlvbiBlbmQoZW5kVGltZSwgZGF0YSkge1xuICAgIF9TcGFuQmFzZS5wcm90b3R5cGUuZW5kLmNhbGwodGhpcywgZW5kVGltZSk7XG5cbiAgICBhZGRTcGFuQ29udGV4dCh0aGlzLCBkYXRhKTtcbiAgfTtcblxuICByZXR1cm4gU3Bhbjtcbn0oU3BhbkJhc2UpO1xuXG5leHBvcnQgZGVmYXVsdCBTcGFuOyIsImltcG9ydCB7IFByb21pc2UgfSBmcm9tICcuLi9jb21tb24vcG9seWZpbGxzJztcbmltcG9ydCBUcmFuc2FjdGlvbiBmcm9tICcuL3RyYW5zYWN0aW9uJztcbmltcG9ydCB7IFBlcmZFbnRyeVJlY29yZGVyLCBjYXB0dXJlT2JzZXJ2ZXJFbnRyaWVzLCBtZXRyaWNzLCBjcmVhdGVUb3RhbEJsb2NraW5nVGltZVNwYW4gfSBmcm9tICcuL21ldHJpY3MnO1xuaW1wb3J0IHsgZXh0ZW5kLCBnZXRFYXJsaWVzdFNwYW4sIGdldExhdGVzdE5vblhIUlNwYW4sIGdldExhdGVzdFhIUlNwYW4sIGlzUGVyZlR5cGVTdXBwb3J0ZWQsIGdlbmVyYXRlUmFuZG9tSWQgfSBmcm9tICcuLi9jb21tb24vdXRpbHMnO1xuaW1wb3J0IHsgY2FwdHVyZU5hdmlnYXRpb24gfSBmcm9tICcuL25hdmlnYXRpb24vY2FwdHVyZS1uYXZpZ2F0aW9uJztcbmltcG9ydCB7IFBBR0VfTE9BRCwgTkFNRV9VTktOT1dOLCBUUkFOU0FDVElPTl9TVEFSVCwgVFJBTlNBQ1RJT05fRU5ELCBURU1QT1JBUllfVFlQRSwgVFJBTlNBQ1RJT05fVFlQRV9PUkRFUiwgTEFSR0VTVF9DT05URU5URlVMX1BBSU5ULCBMT05HX1RBU0ssIFBBSU5ULCBUUlVOQ0FURURfVFlQRSwgRklSU1RfSU5QVVQsIExBWU9VVF9TSElGVCwgU0VTU0lPTl9USU1FT1VULCBQQUdFX0xPQURfREVMQVkgfSBmcm9tICcuLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IGFkZFRyYW5zYWN0aW9uQ29udGV4dCB9IGZyb20gJy4uL2NvbW1vbi9jb250ZXh0JztcbmltcG9ydCB7IF9fREVWX18sIHN0YXRlIH0gZnJvbSAnLi4vc3RhdGUnO1xuaW1wb3J0IHsgc2x1Z2lmeVVybCB9IGZyb20gJy4uL2NvbW1vbi91cmwnO1xuXG52YXIgVHJhbnNhY3Rpb25TZXJ2aWNlID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBUcmFuc2FjdGlvblNlcnZpY2UobG9nZ2VyLCBjb25maWcpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5fY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuX2xvZ2dlciA9IGxvZ2dlcjtcbiAgICB0aGlzLmN1cnJlbnRUcmFuc2FjdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnJlc3BJbnRlcnZhbElkID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucmVjb3JkZXIgPSBuZXcgUGVyZkVudHJ5UmVjb3JkZXIoZnVuY3Rpb24gKGxpc3QpIHtcbiAgICAgIHZhciB0ciA9IF90aGlzLmdldEN1cnJlbnRUcmFuc2FjdGlvbigpO1xuXG4gICAgICBpZiAodHIgJiYgdHIuY2FwdHVyZVRpbWluZ3MpIHtcbiAgICAgICAgdmFyIF90ciRzcGFucztcblxuICAgICAgICB2YXIgaXNIYXJkTmF2aWdhdGlvbiA9IHRyLnR5cGUgPT09IFBBR0VfTE9BRDtcblxuICAgICAgICB2YXIgX2NhcHR1cmVPYnNlcnZlckVudHJpID0gY2FwdHVyZU9ic2VydmVyRW50cmllcyhsaXN0LCB7XG4gICAgICAgICAgaXNIYXJkTmF2aWdhdGlvbjogaXNIYXJkTmF2aWdhdGlvbixcbiAgICAgICAgICB0clN0YXJ0OiBpc0hhcmROYXZpZ2F0aW9uID8gMCA6IHRyLl9zdGFydFxuICAgICAgICB9KSxcbiAgICAgICAgICAgIHNwYW5zID0gX2NhcHR1cmVPYnNlcnZlckVudHJpLnNwYW5zLFxuICAgICAgICAgICAgbWFya3MgPSBfY2FwdHVyZU9ic2VydmVyRW50cmkubWFya3M7XG5cbiAgICAgICAgKF90ciRzcGFucyA9IHRyLnNwYW5zKS5wdXNoLmFwcGx5KF90ciRzcGFucywgc3BhbnMpO1xuXG4gICAgICAgIHRyLmFkZE1hcmtzKHtcbiAgICAgICAgICBhZ2VudDogbWFya3NcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gVHJhbnNhY3Rpb25TZXJ2aWNlLnByb3RvdHlwZTtcblxuICBfcHJvdG8uY3JlYXRlQ3VycmVudFRyYW5zYWN0aW9uID0gZnVuY3Rpb24gY3JlYXRlQ3VycmVudFRyYW5zYWN0aW9uKG5hbWUsIHR5cGUsIG9wdGlvbnMpIHtcbiAgICB2YXIgdHIgPSBuZXcgVHJhbnNhY3Rpb24obmFtZSwgdHlwZSwgb3B0aW9ucyk7XG4gICAgdGhpcy5jdXJyZW50VHJhbnNhY3Rpb24gPSB0cjtcbiAgICByZXR1cm4gdHI7XG4gIH07XG5cbiAgX3Byb3RvLmdldEN1cnJlbnRUcmFuc2FjdGlvbiA9IGZ1bmN0aW9uIGdldEN1cnJlbnRUcmFuc2FjdGlvbigpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50VHJhbnNhY3Rpb24gJiYgIXRoaXMuY3VycmVudFRyYW5zYWN0aW9uLmVuZGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50VHJhbnNhY3Rpb247XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5jcmVhdGVPcHRpb25zID0gZnVuY3Rpb24gY3JlYXRlT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgdmFyIGNvbmZpZyA9IHRoaXMuX2NvbmZpZy5jb25maWc7XG4gICAgdmFyIHByZXNldE9wdGlvbnMgPSB7XG4gICAgICB0cmFuc2FjdGlvblNhbXBsZVJhdGU6IGNvbmZpZy50cmFuc2FjdGlvblNhbXBsZVJhdGVcbiAgICB9O1xuICAgIHZhciBwZXJmT3B0aW9ucyA9IGV4dGVuZChwcmVzZXRPcHRpb25zLCBvcHRpb25zKTtcblxuICAgIGlmIChwZXJmT3B0aW9ucy5tYW5hZ2VkKSB7XG4gICAgICBwZXJmT3B0aW9ucyA9IGV4dGVuZCh7XG4gICAgICAgIHBhZ2VMb2FkVHJhY2VJZDogY29uZmlnLnBhZ2VMb2FkVHJhY2VJZCxcbiAgICAgICAgcGFnZUxvYWRTYW1wbGVkOiBjb25maWcucGFnZUxvYWRTYW1wbGVkLFxuICAgICAgICBwYWdlTG9hZFNwYW5JZDogY29uZmlnLnBhZ2VMb2FkU3BhbklkLFxuICAgICAgICBwYWdlTG9hZFRyYW5zYWN0aW9uTmFtZTogY29uZmlnLnBhZ2VMb2FkVHJhbnNhY3Rpb25OYW1lXG4gICAgICB9LCBwZXJmT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBlcmZPcHRpb25zO1xuICB9O1xuXG4gIF9wcm90by5zdGFydE1hbmFnZWRUcmFuc2FjdGlvbiA9IGZ1bmN0aW9uIHN0YXJ0TWFuYWdlZFRyYW5zYWN0aW9uKG5hbWUsIHR5cGUsIHBlcmZPcHRpb25zKSB7XG4gICAgdmFyIHRyID0gdGhpcy5nZXRDdXJyZW50VHJhbnNhY3Rpb24oKTtcbiAgICB2YXIgaXNSZWRlZmluZWQgPSBmYWxzZTtcblxuICAgIGlmICghdHIpIHtcbiAgICAgIHRyID0gdGhpcy5jcmVhdGVDdXJyZW50VHJhbnNhY3Rpb24obmFtZSwgdHlwZSwgcGVyZk9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAodHIuY2FuUmV1c2UoKSAmJiBwZXJmT3B0aW9ucy5jYW5SZXVzZSkge1xuICAgICAgdmFyIHJlZGVmaW5lVHlwZSA9IHRyLnR5cGU7XG4gICAgICB2YXIgY3VycmVudFR5cGVPcmRlciA9IFRSQU5TQUNUSU9OX1RZUEVfT1JERVIuaW5kZXhPZih0ci50eXBlKTtcbiAgICAgIHZhciByZWRlZmluZVR5cGVPcmRlciA9IFRSQU5TQUNUSU9OX1RZUEVfT1JERVIuaW5kZXhPZih0eXBlKTtcblxuICAgICAgaWYgKGN1cnJlbnRUeXBlT3JkZXIgPj0gMCAmJiByZWRlZmluZVR5cGVPcmRlciA8IGN1cnJlbnRUeXBlT3JkZXIpIHtcbiAgICAgICAgcmVkZWZpbmVUeXBlID0gdHlwZTtcbiAgICAgIH1cblxuICAgICAgaWYgKF9fREVWX18pIHtcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmRlYnVnKFwicmVkZWZpbmluZyB0cmFuc2FjdGlvbihcIiArIHRyLmlkICsgXCIsIFwiICsgdHIubmFtZSArIFwiLCBcIiArIHRyLnR5cGUgKyBcIilcIiwgJ3RvJywgXCIoXCIgKyAobmFtZSB8fCB0ci5uYW1lKSArIFwiLCBcIiArIHJlZGVmaW5lVHlwZSArIFwiKVwiLCB0cik7XG4gICAgICB9XG5cbiAgICAgIHRyLnJlZGVmaW5lKG5hbWUsIHJlZGVmaW5lVHlwZSwgcGVyZk9wdGlvbnMpO1xuICAgICAgaXNSZWRlZmluZWQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICB0aGlzLl9sb2dnZXIuZGVidWcoXCJlbmRpbmcgcHJldmlvdXMgdHJhbnNhY3Rpb24oXCIgKyB0ci5pZCArIFwiLCBcIiArIHRyLm5hbWUgKyBcIilcIiwgdHIpO1xuICAgICAgfVxuXG4gICAgICB0ci5lbmQoKTtcbiAgICAgIHRyID0gdGhpcy5jcmVhdGVDdXJyZW50VHJhbnNhY3Rpb24obmFtZSwgdHlwZSwgcGVyZk9wdGlvbnMpO1xuICAgIH1cblxuICAgIGlmICh0ci50eXBlID09PSBQQUdFX0xPQUQpIHtcbiAgICAgIGlmICghaXNSZWRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5yZWNvcmRlci5zdGFydChMQVJHRVNUX0NPTlRFTlRGVUxfUEFJTlQpO1xuICAgICAgICB0aGlzLnJlY29yZGVyLnN0YXJ0KFBBSU5UKTtcbiAgICAgICAgdGhpcy5yZWNvcmRlci5zdGFydChGSVJTVF9JTlBVVCk7XG4gICAgICAgIHRoaXMucmVjb3JkZXIuc3RhcnQoTEFZT1VUX1NISUZUKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBlcmZPcHRpb25zLnBhZ2VMb2FkVHJhY2VJZCkge1xuICAgICAgICB0ci50cmFjZUlkID0gcGVyZk9wdGlvbnMucGFnZUxvYWRUcmFjZUlkO1xuICAgICAgfVxuXG4gICAgICBpZiAocGVyZk9wdGlvbnMucGFnZUxvYWRTYW1wbGVkKSB7XG4gICAgICAgIHRyLnNhbXBsZWQgPSBwZXJmT3B0aW9ucy5wYWdlTG9hZFNhbXBsZWQ7XG4gICAgICB9XG5cbiAgICAgIGlmICh0ci5uYW1lID09PSBOQU1FX1VOS05PV04gJiYgcGVyZk9wdGlvbnMucGFnZUxvYWRUcmFuc2FjdGlvbk5hbWUpIHtcbiAgICAgICAgdHIubmFtZSA9IHBlcmZPcHRpb25zLnBhZ2VMb2FkVHJhbnNhY3Rpb25OYW1lO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghaXNSZWRlZmluZWQgJiYgdGhpcy5fY29uZmlnLmdldCgnbW9uaXRvckxvbmd0YXNrcycpKSB7XG4gICAgICB0aGlzLnJlY29yZGVyLnN0YXJ0KExPTkdfVEFTSyk7XG4gICAgfVxuXG4gICAgaWYgKHRyLnNhbXBsZWQpIHtcbiAgICAgIHRyLmNhcHR1cmVUaW1pbmdzID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHI7XG4gIH07XG5cbiAgX3Byb3RvLnN0YXJ0VHJhbnNhY3Rpb24gPSBmdW5jdGlvbiBzdGFydFRyYW5zYWN0aW9uKG5hbWUsIHR5cGUsIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIHZhciBwZXJmT3B0aW9ucyA9IHRoaXMuY3JlYXRlT3B0aW9ucyhvcHRpb25zKTtcbiAgICB2YXIgdHI7XG4gICAgdmFyIGZpcmVPbnN0YXJ0SG9vayA9IHRydWU7XG5cbiAgICBpZiAocGVyZk9wdGlvbnMubWFuYWdlZCkge1xuICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLmN1cnJlbnRUcmFuc2FjdGlvbjtcbiAgICAgIHRyID0gdGhpcy5zdGFydE1hbmFnZWRUcmFuc2FjdGlvbihuYW1lLCB0eXBlLCBwZXJmT3B0aW9ucyk7XG5cbiAgICAgIGlmIChjdXJyZW50ID09PSB0cikge1xuICAgICAgICBmaXJlT25zdGFydEhvb2sgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdHIgPSBuZXcgVHJhbnNhY3Rpb24obmFtZSwgdHlwZSwgcGVyZk9wdGlvbnMpO1xuICAgIH1cblxuICAgIHRyLm9uRW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF90aGlzMi5oYW5kbGVUcmFuc2FjdGlvbkVuZCh0cik7XG4gICAgfTtcblxuICAgIGlmIChmaXJlT25zdGFydEhvb2spIHtcbiAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgIHRoaXMuX2xvZ2dlci5kZWJ1ZyhcInN0YXJ0VHJhbnNhY3Rpb24oXCIgKyB0ci5pZCArIFwiLCBcIiArIHRyLm5hbWUgKyBcIiwgXCIgKyB0ci50eXBlICsgXCIpXCIpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jb25maWcuZXZlbnRzLnNlbmQoVFJBTlNBQ1RJT05fU1RBUlQsIFt0cl0pO1xuICAgIH1cblxuICAgIHJldHVybiB0cjtcbiAgfTtcblxuICBfcHJvdG8uaGFuZGxlVHJhbnNhY3Rpb25FbmQgPSBmdW5jdGlvbiBoYW5kbGVUcmFuc2FjdGlvbkVuZCh0cikge1xuICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgdGhpcy5yZWNvcmRlci5zdG9wKCk7XG4gICAgdmFyIGN1cnJlbnRVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbmFtZSA9IHRyLm5hbWUsXG4gICAgICAgICAgdHlwZSA9IHRyLnR5cGU7XG4gICAgICB2YXIgbGFzdEhpZGRlblN0YXJ0ID0gc3RhdGUubGFzdEhpZGRlblN0YXJ0O1xuXG4gICAgICBpZiAobGFzdEhpZGRlblN0YXJ0ID49IHRyLl9zdGFydCkge1xuICAgICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICAgIF90aGlzMy5fbG9nZ2VyLmRlYnVnKFwidHJhbnNhY3Rpb24oXCIgKyB0ci5pZCArIFwiLCBcIiArIG5hbWUgKyBcIiwgXCIgKyB0eXBlICsgXCIpIHdhcyBkaXNjYXJkZWQhIFRoZSBwYWdlIHdhcyBoaWRkZW4gZHVyaW5nIHRoZSB0cmFuc2FjdGlvbiFcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGhpczMuc2hvdWxkSWdub3JlVHJhbnNhY3Rpb24obmFtZSkgfHwgdHlwZSA9PT0gVEVNUE9SQVJZX1RZUEUpIHtcbiAgICAgICAgaWYgKF9fREVWX18pIHtcbiAgICAgICAgICBfdGhpczMuX2xvZ2dlci5kZWJ1ZyhcInRyYW5zYWN0aW9uKFwiICsgdHIuaWQgKyBcIiwgXCIgKyBuYW1lICsgXCIsIFwiICsgdHlwZSArIFwiKSBpcyBpZ25vcmVkXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZSA9PT0gUEFHRV9MT0FEKSB7XG4gICAgICAgIHZhciBwYWdlTG9hZFRyYW5zYWN0aW9uTmFtZSA9IF90aGlzMy5fY29uZmlnLmdldCgncGFnZUxvYWRUcmFuc2FjdGlvbk5hbWUnKTtcblxuICAgICAgICBpZiAobmFtZSA9PT0gTkFNRV9VTktOT1dOICYmIHBhZ2VMb2FkVHJhbnNhY3Rpb25OYW1lKSB7XG4gICAgICAgICAgdHIubmFtZSA9IHBhZ2VMb2FkVHJhbnNhY3Rpb25OYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRyLmNhcHR1cmVUaW1pbmdzKSB7XG4gICAgICAgICAgdmFyIGNscyA9IG1ldHJpY3MuY2xzLFxuICAgICAgICAgICAgICBmaWQgPSBtZXRyaWNzLmZpZCxcbiAgICAgICAgICAgICAgdGJ0ID0gbWV0cmljcy50YnQsXG4gICAgICAgICAgICAgIGxvbmd0YXNrID0gbWV0cmljcy5sb25ndGFzaztcblxuICAgICAgICAgIGlmICh0YnQuZHVyYXRpb24gPiAwKSB7XG4gICAgICAgICAgICB0ci5zcGFucy5wdXNoKGNyZWF0ZVRvdGFsQmxvY2tpbmdUaW1lU3Bhbih0YnQpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0ci5leHBlcmllbmNlID0ge307XG5cbiAgICAgICAgICBpZiAoaXNQZXJmVHlwZVN1cHBvcnRlZChMT05HX1RBU0spKSB7XG4gICAgICAgICAgICB0ci5leHBlcmllbmNlLnRidCA9IHRidC5kdXJhdGlvbjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXNQZXJmVHlwZVN1cHBvcnRlZChMQVlPVVRfU0hJRlQpKSB7XG4gICAgICAgICAgICB0ci5leHBlcmllbmNlLmNscyA9IGNscy5zY29yZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZmlkID4gMCkge1xuICAgICAgICAgICAgdHIuZXhwZXJpZW5jZS5maWQgPSBmaWQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGxvbmd0YXNrLmNvdW50ID4gMCkge1xuICAgICAgICAgICAgdHIuZXhwZXJpZW5jZS5sb25ndGFzayA9IHtcbiAgICAgICAgICAgICAgY291bnQ6IGxvbmd0YXNrLmNvdW50LFxuICAgICAgICAgICAgICBzdW06IGxvbmd0YXNrLmR1cmF0aW9uLFxuICAgICAgICAgICAgICBtYXg6IGxvbmd0YXNrLm1heFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpczMuc2V0U2Vzc2lvbih0cik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0ci5uYW1lID09PSBOQU1FX1VOS05PV04pIHtcbiAgICAgICAgdHIubmFtZSA9IHNsdWdpZnlVcmwoY3VycmVudFVybCk7XG4gICAgICB9XG5cbiAgICAgIGNhcHR1cmVOYXZpZ2F0aW9uKHRyKTtcblxuICAgICAgX3RoaXMzLmFkanVzdFRyYW5zYWN0aW9uVGltZSh0cik7XG5cbiAgICAgIHZhciBicmVha2Rvd25NZXRyaWNzID0gX3RoaXMzLl9jb25maWcuZ2V0KCdicmVha2Rvd25NZXRyaWNzJyk7XG5cbiAgICAgIGlmIChicmVha2Rvd25NZXRyaWNzKSB7XG4gICAgICAgIHRyLmNhcHR1cmVCcmVha2Rvd24oKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbmZpZ0NvbnRleHQgPSBfdGhpczMuX2NvbmZpZy5nZXQoJ2NvbnRleHQnKTtcblxuICAgICAgYWRkVHJhbnNhY3Rpb25Db250ZXh0KHRyLCBjb25maWdDb250ZXh0KTtcblxuICAgICAgX3RoaXMzLl9jb25maWcuZXZlbnRzLnNlbmQoVFJBTlNBQ1RJT05fRU5ELCBbdHJdKTtcblxuICAgICAgaWYgKF9fREVWX18pIHtcbiAgICAgICAgX3RoaXMzLl9sb2dnZXIuZGVidWcoXCJlbmQgdHJhbnNhY3Rpb24oXCIgKyB0ci5pZCArIFwiLCBcIiArIHRyLm5hbWUgKyBcIiwgXCIgKyB0ci50eXBlICsgXCIpXCIsIHRyKTtcbiAgICAgIH1cbiAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICBfdGhpczMuX2xvZ2dlci5kZWJ1ZyhcImVycm9yIGVuZGluZyB0cmFuc2FjdGlvbihcIiArIHRyLmlkICsgXCIsIFwiICsgdHIubmFtZSArIFwiKVwiLCBlcnIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5zZXRTZXNzaW9uID0gZnVuY3Rpb24gc2V0U2Vzc2lvbih0cikge1xuICAgIHZhciBzZXNzaW9uID0gdGhpcy5fY29uZmlnLmdldCgnc2Vzc2lvbicpO1xuXG4gICAgaWYgKHNlc3Npb24pIHtcbiAgICAgIGlmICh0eXBlb2Ygc2Vzc2lvbiA9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgdHIuc2Vzc2lvbiA9IHtcbiAgICAgICAgICBpZDogZ2VuZXJhdGVSYW5kb21JZCgxNiksXG4gICAgICAgICAgc2VxdWVuY2U6IDFcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzZXNzaW9uLnRpbWVzdGFtcCAmJiBEYXRlLm5vdygpIC0gc2Vzc2lvbi50aW1lc3RhbXAgPiBTRVNTSU9OX1RJTUVPVVQpIHtcbiAgICAgICAgICB0ci5zZXNzaW9uID0ge1xuICAgICAgICAgICAgaWQ6IGdlbmVyYXRlUmFuZG9tSWQoMTYpLFxuICAgICAgICAgICAgc2VxdWVuY2U6IDFcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyLnNlc3Npb24gPSB7XG4gICAgICAgICAgICBpZDogc2Vzc2lvbi5pZCxcbiAgICAgICAgICAgIHNlcXVlbmNlOiBzZXNzaW9uLnNlcXVlbmNlID8gc2Vzc2lvbi5zZXF1ZW5jZSArIDEgOiAxXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgc2Vzc2lvbkNvbmZpZyA9IHtcbiAgICAgICAgc2Vzc2lvbjoge1xuICAgICAgICAgIGlkOiB0ci5zZXNzaW9uLmlkLFxuICAgICAgICAgIHNlcXVlbmNlOiB0ci5zZXNzaW9uLnNlcXVlbmNlLFxuICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB0aGlzLl9jb25maWcuc2V0Q29uZmlnKHNlc3Npb25Db25maWcpO1xuXG4gICAgICB0aGlzLl9jb25maWcuc2V0TG9jYWxDb25maWcoc2Vzc2lvbkNvbmZpZywgdHJ1ZSk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5hZGp1c3RUcmFuc2FjdGlvblRpbWUgPSBmdW5jdGlvbiBhZGp1c3RUcmFuc2FjdGlvblRpbWUodHJhbnNhY3Rpb24pIHtcbiAgICB2YXIgc3BhbnMgPSB0cmFuc2FjdGlvbi5zcGFucztcbiAgICB2YXIgZWFybGllc3RTcGFuID0gZ2V0RWFybGllc3RTcGFuKHNwYW5zKTtcblxuICAgIGlmIChlYXJsaWVzdFNwYW4gJiYgZWFybGllc3RTcGFuLl9zdGFydCA8IHRyYW5zYWN0aW9uLl9zdGFydCkge1xuICAgICAgdHJhbnNhY3Rpb24uX3N0YXJ0ID0gZWFybGllc3RTcGFuLl9zdGFydDtcbiAgICB9XG5cbiAgICB2YXIgbGF0ZXN0U3BhbiA9IGdldExhdGVzdE5vblhIUlNwYW4oc3BhbnMpIHx8IHt9O1xuICAgIHZhciBsYXRlc3RTcGFuRW5kID0gbGF0ZXN0U3Bhbi5fZW5kIHx8IDA7XG5cbiAgICBpZiAodHJhbnNhY3Rpb24udHlwZSA9PT0gUEFHRV9MT0FEKSB7XG4gICAgICB2YXIgdHJhbnNhY3Rpb25FbmRXaXRob3V0RGVsYXkgPSB0cmFuc2FjdGlvbi5fZW5kIC0gUEFHRV9MT0FEX0RFTEFZO1xuICAgICAgdmFyIGxjcCA9IG1ldHJpY3MubGNwIHx8IDA7XG4gICAgICB2YXIgbGF0ZXN0WEhSU3BhbiA9IGdldExhdGVzdFhIUlNwYW4oc3BhbnMpIHx8IHt9O1xuICAgICAgdmFyIGxhdGVzdFhIUlNwYW5FbmQgPSBsYXRlc3RYSFJTcGFuLl9lbmQgfHwgMDtcbiAgICAgIHRyYW5zYWN0aW9uLl9lbmQgPSBNYXRoLm1heChsYXRlc3RTcGFuRW5kLCBsYXRlc3RYSFJTcGFuRW5kLCBsY3AsIHRyYW5zYWN0aW9uRW5kV2l0aG91dERlbGF5KTtcbiAgICB9IGVsc2UgaWYgKGxhdGVzdFNwYW5FbmQgPiB0cmFuc2FjdGlvbi5fZW5kKSB7XG4gICAgICB0cmFuc2FjdGlvbi5fZW5kID0gbGF0ZXN0U3BhbkVuZDtcbiAgICB9XG5cbiAgICB0aGlzLnRydW5jYXRlU3BhbnMoc3BhbnMsIHRyYW5zYWN0aW9uLl9lbmQpO1xuICB9O1xuXG4gIF9wcm90by50cnVuY2F0ZVNwYW5zID0gZnVuY3Rpb24gdHJ1bmNhdGVTcGFucyhzcGFucywgdHJhbnNhY3Rpb25FbmQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNwYW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc3BhbiA9IHNwYW5zW2ldO1xuXG4gICAgICBpZiAoc3Bhbi5fZW5kID4gdHJhbnNhY3Rpb25FbmQpIHtcbiAgICAgICAgc3Bhbi5fZW5kID0gdHJhbnNhY3Rpb25FbmQ7XG4gICAgICAgIHNwYW4udHlwZSArPSBUUlVOQ0FURURfVFlQRTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNwYW4uX3N0YXJ0ID4gdHJhbnNhY3Rpb25FbmQpIHtcbiAgICAgICAgc3Bhbi5fc3RhcnQgPSB0cmFuc2FjdGlvbkVuZDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLnNob3VsZElnbm9yZVRyYW5zYWN0aW9uID0gZnVuY3Rpb24gc2hvdWxkSWdub3JlVHJhbnNhY3Rpb24odHJhbnNhY3Rpb25OYW1lKSB7XG4gICAgdmFyIGlnbm9yZUxpc3QgPSB0aGlzLl9jb25maWcuZ2V0KCdpZ25vcmVUcmFuc2FjdGlvbnMnKTtcblxuICAgIGlmIChpZ25vcmVMaXN0ICYmIGlnbm9yZUxpc3QubGVuZ3RoKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlnbm9yZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBpZ25vcmVMaXN0W2ldO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudC50ZXN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgaWYgKGVsZW1lbnQudGVzdCh0cmFuc2FjdGlvbk5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudCA9PT0gdHJhbnNhY3Rpb25OYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgX3Byb3RvLnN0YXJ0U3BhbiA9IGZ1bmN0aW9uIHN0YXJ0U3BhbihuYW1lLCB0eXBlLCBvcHRpb25zKSB7XG4gICAgdmFyIHRyID0gdGhpcy5nZXRDdXJyZW50VHJhbnNhY3Rpb24oKTtcblxuICAgIGlmICghdHIpIHtcbiAgICAgIHRyID0gdGhpcy5jcmVhdGVDdXJyZW50VHJhbnNhY3Rpb24odW5kZWZpbmVkLCBURU1QT1JBUllfVFlQRSwgdGhpcy5jcmVhdGVPcHRpb25zKHtcbiAgICAgICAgY2FuUmV1c2U6IHRydWUsXG4gICAgICAgIG1hbmFnZWQ6IHRydWVcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICB2YXIgc3BhbiA9IHRyLnN0YXJ0U3BhbihuYW1lLCB0eXBlLCBvcHRpb25zKTtcblxuICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICB0aGlzLl9sb2dnZXIuZGVidWcoXCJzdGFydFNwYW4oXCIgKyBuYW1lICsgXCIsIFwiICsgc3Bhbi50eXBlICsgXCIpXCIsIFwib24gdHJhbnNhY3Rpb24oXCIgKyB0ci5pZCArIFwiLCBcIiArIHRyLm5hbWUgKyBcIilcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNwYW47XG4gIH07XG5cbiAgX3Byb3RvLmVuZFNwYW4gPSBmdW5jdGlvbiBlbmRTcGFuKHNwYW4sIGNvbnRleHQpIHtcbiAgICBpZiAoIXNwYW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoX19ERVZfXykge1xuICAgICAgdmFyIHRyID0gdGhpcy5nZXRDdXJyZW50VHJhbnNhY3Rpb24oKTtcbiAgICAgIHRyICYmIHRoaXMuX2xvZ2dlci5kZWJ1ZyhcImVuZFNwYW4oXCIgKyBzcGFuLm5hbWUgKyBcIiwgXCIgKyBzcGFuLnR5cGUgKyBcIilcIiwgXCJvbiB0cmFuc2FjdGlvbihcIiArIHRyLmlkICsgXCIsIFwiICsgdHIubmFtZSArIFwiKVwiKTtcbiAgICB9XG5cbiAgICBzcGFuLmVuZChudWxsLCBjb250ZXh0KTtcbiAgfTtcblxuICByZXR1cm4gVHJhbnNhY3Rpb25TZXJ2aWNlO1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBUcmFuc2FjdGlvblNlcnZpY2U7IiwiZnVuY3Rpb24gX2luaGVyaXRzTG9vc2Uoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzLnByb3RvdHlwZSk7IHN1YkNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHN1YkNsYXNzOyBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmltcG9ydCBTcGFuIGZyb20gJy4vc3Bhbic7XG5pbXBvcnQgU3BhbkJhc2UgZnJvbSAnLi9zcGFuLWJhc2UnO1xuaW1wb3J0IHsgZ2VuZXJhdGVSYW5kb21JZCwgbWVyZ2UsIG5vdywgZ2V0VGltZSwgZXh0ZW5kLCByZW1vdmVJbnZhbGlkQ2hhcnMgfSBmcm9tICcuLi9jb21tb24vdXRpbHMnO1xuaW1wb3J0IHsgUkVVU0FCSUxJVFlfVEhSRVNIT0xELCBUUlVOQ0FURURfVFlQRSB9IGZyb20gJy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHsgY2FwdHVyZUJyZWFrZG93biBhcyBfY2FwdHVyZUJyZWFrZG93biB9IGZyb20gJy4vYnJlYWtkb3duJztcblxudmFyIFRyYW5zYWN0aW9uID0gZnVuY3Rpb24gKF9TcGFuQmFzZSkge1xuICBfaW5oZXJpdHNMb29zZShUcmFuc2FjdGlvbiwgX1NwYW5CYXNlKTtcblxuICBmdW5jdGlvbiBUcmFuc2FjdGlvbihuYW1lLCB0eXBlLCBvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX3RoaXMgPSBfU3BhbkJhc2UuY2FsbCh0aGlzLCBuYW1lLCB0eXBlLCBvcHRpb25zKSB8fCB0aGlzO1xuICAgIF90aGlzLnRyYWNlSWQgPSBnZW5lcmF0ZVJhbmRvbUlkKCk7XG4gICAgX3RoaXMubWFya3MgPSB1bmRlZmluZWQ7XG4gICAgX3RoaXMuc3BhbnMgPSBbXTtcbiAgICBfdGhpcy5fYWN0aXZlU3BhbnMgPSB7fTtcbiAgICBfdGhpcy5fYWN0aXZlVGFza3MgPSBuZXcgU2V0KCk7XG4gICAgX3RoaXMuYmxvY2tlZCA9IGZhbHNlO1xuICAgIF90aGlzLmNhcHR1cmVUaW1pbmdzID0gZmFsc2U7XG4gICAgX3RoaXMuYnJlYWtkb3duVGltaW5ncyA9IFtdO1xuICAgIF90aGlzLnNhbXBsZVJhdGUgPSBfdGhpcy5vcHRpb25zLnRyYW5zYWN0aW9uU2FtcGxlUmF0ZTtcbiAgICBfdGhpcy5zYW1wbGVkID0gTWF0aC5yYW5kb20oKSA8PSBfdGhpcy5zYW1wbGVSYXRlO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBUcmFuc2FjdGlvbi5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLmFkZE1hcmtzID0gZnVuY3Rpb24gYWRkTWFya3Mob2JqKSB7XG4gICAgdGhpcy5tYXJrcyA9IG1lcmdlKHRoaXMubWFya3MgfHwge30sIG9iaik7XG4gIH07XG5cbiAgX3Byb3RvLm1hcmsgPSBmdW5jdGlvbiBtYXJrKGtleSkge1xuICAgIHZhciBza2V5ID0gcmVtb3ZlSW52YWxpZENoYXJzKGtleSk7XG5cbiAgICB2YXIgbWFya1RpbWUgPSBub3coKSAtIHRoaXMuX3N0YXJ0O1xuXG4gICAgdmFyIGN1c3RvbSA9IHt9O1xuICAgIGN1c3RvbVtza2V5XSA9IG1hcmtUaW1lO1xuICAgIHRoaXMuYWRkTWFya3Moe1xuICAgICAgY3VzdG9tOiBjdXN0b21cbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8uY2FuUmV1c2UgPSBmdW5jdGlvbiBjYW5SZXVzZSgpIHtcbiAgICB2YXIgdGhyZXNob2xkID0gdGhpcy5vcHRpb25zLnJldXNlVGhyZXNob2xkIHx8IFJFVVNBQklMSVRZX1RIUkVTSE9MRDtcbiAgICByZXR1cm4gISF0aGlzLm9wdGlvbnMuY2FuUmV1c2UgJiYgIXRoaXMuZW5kZWQgJiYgbm93KCkgLSB0aGlzLl9zdGFydCA8IHRocmVzaG9sZDtcbiAgfTtcblxuICBfcHJvdG8ucmVkZWZpbmUgPSBmdW5jdGlvbiByZWRlZmluZShuYW1lLCB0eXBlLCBvcHRpb25zKSB7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgfVxuXG4gICAgaWYgKHR5cGUpIHtcbiAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5yZXVzZVRocmVzaG9sZCA9IG9wdGlvbnMucmV1c2VUaHJlc2hvbGQ7XG4gICAgICBleHRlbmQodGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLnN0YXJ0U3BhbiA9IGZ1bmN0aW9uIHN0YXJ0U3BhbihuYW1lLCB0eXBlLCBvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5lbmRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBvcHRzID0gZXh0ZW5kKHt9LCBvcHRpb25zKTtcblxuICAgIG9wdHMub25FbmQgPSBmdW5jdGlvbiAodHJjKSB7XG4gICAgICBfdGhpczIuX29uU3BhbkVuZCh0cmMpO1xuICAgIH07XG5cbiAgICBvcHRzLnRyYWNlSWQgPSB0aGlzLnRyYWNlSWQ7XG4gICAgb3B0cy5zYW1wbGVkID0gdGhpcy5zYW1wbGVkO1xuICAgIG9wdHMuc2FtcGxlUmF0ZSA9IHRoaXMuc2FtcGxlUmF0ZTtcblxuICAgIGlmICghb3B0cy5wYXJlbnRJZCkge1xuICAgICAgb3B0cy5wYXJlbnRJZCA9IHRoaXMuaWQ7XG4gICAgfVxuXG4gICAgdmFyIHNwYW4gPSBuZXcgU3BhbihuYW1lLCB0eXBlLCBvcHRzKTtcbiAgICB0aGlzLl9hY3RpdmVTcGFuc1tzcGFuLmlkXSA9IHNwYW47XG5cbiAgICBpZiAob3B0cy5ibG9ja2luZykge1xuICAgICAgdGhpcy5hZGRUYXNrKHNwYW4uaWQpO1xuICAgIH1cblxuICAgIHJldHVybiBzcGFuO1xuICB9O1xuXG4gIF9wcm90by5pc0ZpbmlzaGVkID0gZnVuY3Rpb24gaXNGaW5pc2hlZCgpIHtcbiAgICByZXR1cm4gIXRoaXMuYmxvY2tlZCAmJiB0aGlzLl9hY3RpdmVUYXNrcy5zaXplID09PSAwO1xuICB9O1xuXG4gIF9wcm90by5kZXRlY3RGaW5pc2ggPSBmdW5jdGlvbiBkZXRlY3RGaW5pc2goKSB7XG4gICAgaWYgKHRoaXMuaXNGaW5pc2hlZCgpKSB0aGlzLmVuZCgpO1xuICB9O1xuXG4gIF9wcm90by5lbmQgPSBmdW5jdGlvbiBlbmQoZW5kVGltZSkge1xuICAgIGlmICh0aGlzLmVuZGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5lbmRlZCA9IHRydWU7XG4gICAgdGhpcy5fZW5kID0gZ2V0VGltZShlbmRUaW1lKTtcblxuICAgIGZvciAodmFyIHNpZCBpbiB0aGlzLl9hY3RpdmVTcGFucykge1xuICAgICAgdmFyIHNwYW4gPSB0aGlzLl9hY3RpdmVTcGFuc1tzaWRdO1xuICAgICAgc3Bhbi50eXBlID0gc3Bhbi50eXBlICsgVFJVTkNBVEVEX1RZUEU7XG4gICAgICBzcGFuLmVuZChlbmRUaW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmNhbGxPbkVuZCgpO1xuICB9O1xuXG4gIF9wcm90by5jYXB0dXJlQnJlYWtkb3duID0gZnVuY3Rpb24gY2FwdHVyZUJyZWFrZG93bigpIHtcbiAgICB0aGlzLmJyZWFrZG93blRpbWluZ3MgPSBfY2FwdHVyZUJyZWFrZG93bih0aGlzKTtcbiAgfTtcblxuICBfcHJvdG8uYmxvY2sgPSBmdW5jdGlvbiBibG9jayhmbGFnKSB7XG4gICAgdGhpcy5ibG9ja2VkID0gZmxhZztcblxuICAgIGlmICghdGhpcy5ibG9ja2VkKSB7XG4gICAgICB0aGlzLmRldGVjdEZpbmlzaCgpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uYWRkVGFzayA9IGZ1bmN0aW9uIGFkZFRhc2sodGFza0lkKSB7XG4gICAgaWYgKCF0YXNrSWQpIHtcbiAgICAgIHRhc2tJZCA9ICd0YXNrLScgKyBnZW5lcmF0ZVJhbmRvbUlkKDE2KTtcbiAgICB9XG5cbiAgICB0aGlzLl9hY3RpdmVUYXNrcy5hZGQodGFza0lkKTtcblxuICAgIHJldHVybiB0YXNrSWQ7XG4gIH07XG5cbiAgX3Byb3RvLnJlbW92ZVRhc2sgPSBmdW5jdGlvbiByZW1vdmVUYXNrKHRhc2tJZCkge1xuICAgIHZhciBkZWxldGVkID0gdGhpcy5fYWN0aXZlVGFza3MuZGVsZXRlKHRhc2tJZCk7XG5cbiAgICBkZWxldGVkICYmIHRoaXMuZGV0ZWN0RmluaXNoKCk7XG4gIH07XG5cbiAgX3Byb3RvLnJlc2V0RmllbGRzID0gZnVuY3Rpb24gcmVzZXRGaWVsZHMoKSB7XG4gICAgdGhpcy5zcGFucyA9IFtdO1xuICAgIHRoaXMuc2FtcGxlUmF0ZSA9IDA7XG4gIH07XG5cbiAgX3Byb3RvLl9vblNwYW5FbmQgPSBmdW5jdGlvbiBfb25TcGFuRW5kKHNwYW4pIHtcbiAgICB0aGlzLnNwYW5zLnB1c2goc3Bhbik7XG4gICAgZGVsZXRlIHRoaXMuX2FjdGl2ZVNwYW5zW3NwYW4uaWRdO1xuICAgIHRoaXMucmVtb3ZlVGFzayhzcGFuLmlkKTtcbiAgfTtcblxuICBfcHJvdG8uaXNNYW5hZ2VkID0gZnVuY3Rpb24gaXNNYW5hZ2VkKCkge1xuICAgIHJldHVybiAhIXRoaXMub3B0aW9ucy5tYW5hZ2VkO1xuICB9O1xuXG4gIHJldHVybiBUcmFuc2FjdGlvbjtcbn0oU3BhbkJhc2UpO1xuXG5leHBvcnQgZGVmYXVsdCBUcmFuc2FjdGlvbjsiLCJ2YXIgX19ERVZfXyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbic7XG5cbnZhciBzdGF0ZSA9IHtcbiAgYm9vdHN0cmFwVGltZTogbnVsbCxcbiAgbGFzdEhpZGRlblN0YXJ0OiBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUlxufTtcbmV4cG9ydCB7IF9fREVWX18sIHN0YXRlIH07IiwiLyoqXG4gKiBNSVQgTGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNy1wcmVzZW50LCBFbGFzdGljc2VhcmNoIEJWXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqXG4gKi9cblxuaW1wb3J0IHtcbiAgZ2V0SW5zdHJ1bWVudGF0aW9uRmxhZ3MsXG4gIFBBR0VfTE9BRF9ERUxBWSxcbiAgUEFHRV9MT0FELFxuICBFUlJPUixcbiAgQ09ORklHX1NFUlZJQ0UsXG4gIExPR0dJTkdfU0VSVklDRSxcbiAgVFJBTlNBQ1RJT05fU0VSVklDRSxcbiAgUEVSRk9STUFOQ0VfTU9OSVRPUklORyxcbiAgRVJST1JfTE9HR0lORyxcbiAgQVBNX1NFUlZFUixcbiAgRVZFTlRfVEFSR0VULFxuICBDTElDSyxcbiAgb2JzZXJ2ZVBhZ2VWaXNpYmlsaXR5LFxuICBvYnNlcnZlUGFnZUNsaWNrc1xufSBmcm9tICdAZWxhc3RpYy9hcG0tcnVtLWNvcmUnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwbUJhc2Uge1xuICBjb25zdHJ1Y3RvcihzZXJ2aWNlRmFjdG9yeSwgZGlzYWJsZSkge1xuICAgIHRoaXMuX2Rpc2FibGUgPSBkaXNhYmxlXG4gICAgdGhpcy5zZXJ2aWNlRmFjdG9yeSA9IHNlcnZpY2VGYWN0b3J5XG4gICAgdGhpcy5faW5pdGlhbGl6ZWQgPSBmYWxzZVxuICB9XG5cbiAgaXNFbmFibGVkKCkge1xuICAgIHJldHVybiAhdGhpcy5fZGlzYWJsZVxuICB9XG5cbiAgaXNBY3RpdmUoKSB7XG4gICAgY29uc3QgY29uZmlnU2VydmljZSA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShDT05GSUdfU0VSVklDRSlcbiAgICByZXR1cm4gdGhpcy5pc0VuYWJsZWQoKSAmJiB0aGlzLl9pbml0aWFsaXplZCAmJiBjb25maWdTZXJ2aWNlLmdldCgnYWN0aXZlJylcbiAgfVxuXG4gIGluaXQoY29uZmlnKSB7XG4gICAgaWYgKHRoaXMuaXNFbmFibGVkKCkgJiYgIXRoaXMuX2luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLl9pbml0aWFsaXplZCA9IHRydWVcbiAgICAgIGNvbnN0IFtcbiAgICAgICAgY29uZmlnU2VydmljZSxcbiAgICAgICAgbG9nZ2luZ1NlcnZpY2UsXG4gICAgICAgIHRyYW5zYWN0aW9uU2VydmljZVxuICAgICAgXSA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShbXG4gICAgICAgIENPTkZJR19TRVJWSUNFLFxuICAgICAgICBMT0dHSU5HX1NFUlZJQ0UsXG4gICAgICAgIFRSQU5TQUNUSU9OX1NFUlZJQ0VcbiAgICAgIF0pXG4gICAgICAvKipcbiAgICAgICAqIFNldCBBZ2VudCB2ZXJzaW9uIHRvIGJlIHNlbnQgYXMgcGFydCBvZiBtZXRhZGF0YSB0byB0aGUgQVBNIFNlcnZlclxuICAgICAgICovXG4gICAgICBjb25maWdTZXJ2aWNlLnNldFZlcnNpb24oJzUuMTUuMCcpXG4gICAgICB0aGlzLmNvbmZpZyhjb25maWcpXG4gICAgICAvKipcbiAgICAgICAqIFNldCBsZXZlbCBoZXJlIHRvIGFjY291bnQgZm9yIGJvdGggYWN0aXZlIGFuZCBpbmFjdGl2ZSBjYXNlc1xuICAgICAgICovXG4gICAgICBjb25zdCBsb2dMZXZlbCA9IGNvbmZpZ1NlcnZpY2UuZ2V0KCdsb2dMZXZlbCcpXG4gICAgICBsb2dnaW5nU2VydmljZS5zZXRMZXZlbChsb2dMZXZlbClcbiAgICAgIC8qKlxuICAgICAgICogRGVhY3RpdmUgYWdlbnQgd2hlbiB0aGUgYWN0aXZlIGNvbmZpZyBmbGFnIGlzIHNldCB0byBmYWxzZVxuICAgICAgICovXG4gICAgICBjb25zdCBpc0NvbmZpZ0FjdGl2ZSA9IGNvbmZpZ1NlcnZpY2UuZ2V0KCdhY3RpdmUnKVxuICAgICAgaWYgKGlzQ29uZmlnQWN0aXZlKSB7XG4gICAgICAgIHRoaXMuc2VydmljZUZhY3RvcnkuaW5pdCgpXG5cbiAgICAgICAgY29uc3QgZmxhZ3MgPSBnZXRJbnN0cnVtZW50YXRpb25GbGFncyhcbiAgICAgICAgICBjb25maWdTZXJ2aWNlLmdldCgnaW5zdHJ1bWVudCcpLFxuICAgICAgICAgIGNvbmZpZ1NlcnZpY2UuZ2V0KCdkaXNhYmxlSW5zdHJ1bWVudGF0aW9ucycpXG4gICAgICAgIClcblxuICAgICAgICBjb25zdCBwZXJmb3JtYW5jZU1vbml0b3JpbmcgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoXG4gICAgICAgICAgUEVSRk9STUFOQ0VfTU9OSVRPUklOR1xuICAgICAgICApXG4gICAgICAgIHBlcmZvcm1hbmNlTW9uaXRvcmluZy5pbml0KGZsYWdzKVxuXG4gICAgICAgIGlmIChmbGFnc1tFUlJPUl0pIHtcbiAgICAgICAgICBjb25zdCBlcnJvckxvZ2dpbmcgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoRVJST1JfTE9HR0lORylcbiAgICAgICAgICBlcnJvckxvZ2dpbmcucmVnaXN0ZXJMaXN0ZW5lcnMoKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ1NlcnZpY2UuZ2V0KCdzZXNzaW9uJykpIHtcbiAgICAgICAgICBsZXQgbG9jYWxDb25maWcgPSBjb25maWdTZXJ2aWNlLmdldExvY2FsQ29uZmlnKClcbiAgICAgICAgICBpZiAobG9jYWxDb25maWcgJiYgbG9jYWxDb25maWcuc2Vzc2lvbikge1xuICAgICAgICAgICAgY29uZmlnU2VydmljZS5zZXRDb25maWcoe1xuICAgICAgICAgICAgICBzZXNzaW9uOiBsb2NhbENvbmZpZy5zZXNzaW9uXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNlbmRQYWdlTG9hZCA9ICgpID0+XG4gICAgICAgICAgZmxhZ3NbUEFHRV9MT0FEXSAmJiB0aGlzLl9zZW5kUGFnZUxvYWRNZXRyaWNzKClcblxuICAgICAgICBpZiAoY29uZmlnU2VydmljZS5nZXQoJ2NlbnRyYWxDb25maWcnKSkge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFdhaXRpbmcgZm9yIHRoZSByZW1vdGUgY29uZmlnIGJlZm9yZSBzZW5kaW5nIHRoZSBwYWdlIGxvYWQgdHJhbnNhY3Rpb25cbiAgICAgICAgICAgKi9cbiAgICAgICAgICB0aGlzLmZldGNoQ2VudHJhbENvbmZpZygpLnRoZW4oc2VuZFBhZ2VMb2FkKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbmRQYWdlTG9hZCgpXG4gICAgICAgIH1cblxuICAgICAgICBvYnNlcnZlUGFnZVZpc2liaWxpdHkoY29uZmlnU2VydmljZSwgdHJhbnNhY3Rpb25TZXJ2aWNlKVxuICAgICAgICBpZiAoZmxhZ3NbRVZFTlRfVEFSR0VUXSAmJiBmbGFnc1tDTElDS10pIHtcbiAgICAgICAgICBvYnNlcnZlUGFnZUNsaWNrcyh0cmFuc2FjdGlvblNlcnZpY2UpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Rpc2FibGUgPSB0cnVlXG4gICAgICAgIGxvZ2dpbmdTZXJ2aWNlLndhcm4oJ1JVTSBhZ2VudCBpcyBpbmFjdGl2ZScpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKipcbiAgICogYGZldGNoQ2VudHJhbENvbmZpZ2AgcmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGFsd2F5cyByZXNvbHZlXG4gICAqIGlmIHRoZSBpbnRlcm5hbCBjb25maWcgZmV0Y2ggZmFpbHMgdGhlIHRoZSBwcm9taXNlIHJlc29sdmVzIHRvIGB1bmRlZmluZWRgIG90aGVyd2lzZVxuICAgKiBpdCByZXNvbHZlcyB0byB0aGUgZmV0Y2hlZCBjb25maWcuXG4gICAqL1xuICBmZXRjaENlbnRyYWxDb25maWcoKSB7XG4gICAgY29uc3QgW1xuICAgICAgYXBtU2VydmVyLFxuICAgICAgbG9nZ2luZ1NlcnZpY2UsXG4gICAgICBjb25maWdTZXJ2aWNlXG4gICAgXSA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShbXG4gICAgICBBUE1fU0VSVkVSLFxuICAgICAgTE9HR0lOR19TRVJWSUNFLFxuICAgICAgQ09ORklHX1NFUlZJQ0VcbiAgICBdKVxuXG4gICAgcmV0dXJuIGFwbVNlcnZlclxuICAgICAgLmZldGNoQ29uZmlnKFxuICAgICAgICBjb25maWdTZXJ2aWNlLmdldCgnc2VydmljZU5hbWUnKSxcbiAgICAgICAgY29uZmlnU2VydmljZS5nZXQoJ2Vudmlyb25tZW50JylcbiAgICAgIClcbiAgICAgIC50aGVuKGNvbmZpZyA9PiB7XG4gICAgICAgIHZhciB0cmFuc2FjdGlvblNhbXBsZVJhdGUgPSBjb25maWdbJ3RyYW5zYWN0aW9uX3NhbXBsZV9yYXRlJ11cbiAgICAgICAgaWYgKHRyYW5zYWN0aW9uU2FtcGxlUmF0ZSkge1xuICAgICAgICAgIHRyYW5zYWN0aW9uU2FtcGxlUmF0ZSA9IE51bWJlcih0cmFuc2FjdGlvblNhbXBsZVJhdGUpXG4gICAgICAgICAgY29uc3QgY29uZmlnID0geyB0cmFuc2FjdGlvblNhbXBsZVJhdGUgfVxuICAgICAgICAgIGNvbnN0IHsgaW52YWxpZCB9ID0gY29uZmlnU2VydmljZS52YWxpZGF0ZShjb25maWcpXG4gICAgICAgICAgaWYgKGludmFsaWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBjb25maWdTZXJ2aWNlLnNldENvbmZpZyhjb25maWcpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHsga2V5LCB2YWx1ZSwgYWxsb3dlZCB9ID0gaW52YWxpZFswXVxuICAgICAgICAgICAgbG9nZ2luZ1NlcnZpY2Uud2FybihcbiAgICAgICAgICAgICAgYGludmFsaWQgdmFsdWUgXCIke3ZhbHVlfVwiIGZvciAke2tleX0uIEFsbG93ZWQ6ICR7YWxsb3dlZH0uYFxuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29uZmlnXG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgbG9nZ2luZ1NlcnZpY2Uud2FybignZmFpbGVkIGZldGNoaW5nIGNvbmZpZzonLCBlcnJvcilcbiAgICAgIH0pXG4gIH1cblxuICBfc2VuZFBhZ2VMb2FkTWV0cmljcygpIHtcbiAgICAvKipcbiAgICAgKiBOYW1lIG9mIHRoZSB0cmFuc2FjdGlvbiBpcyBzZXQgaW4gdHJhbnNhY3Rpb24gc2VydmljZSB0b1xuICAgICAqIGF2b2lkIGR1cGxpY2F0aW5nIHRoZSBsb2dpYyBhdCBtdWx0aXBsZSBwbGFjZXNcbiAgICAgKi9cbiAgICBjb25zdCB0ciA9IHRoaXMuc3RhcnRUcmFuc2FjdGlvbih1bmRlZmluZWQsIFBBR0VfTE9BRCwge1xuICAgICAgbWFuYWdlZDogdHJ1ZSxcbiAgICAgIGNhblJldXNlOiB0cnVlXG4gICAgfSlcblxuICAgIGlmICghdHIpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRyLmFkZFRhc2soUEFHRV9MT0FEKVxuICAgIGNvbnN0IHNlbmRQYWdlTG9hZE1ldHJpY3MgPSAoKSA9PiB7XG4gICAgICAvLyBUaGUgcmVhc29ucyBvZiB0aGlzIHRpbWVvdXQgYXJlOlxuICAgICAgLy8gMS4gdG8gbWFrZSBzdXJlIFBlcmZvcm1hbmNlVGltaW5nLmxvYWRFdmVudEVuZCBoYXMgYSB2YWx1ZS5cbiAgICAgIC8vIDIuIHRvIG1ha2Ugc3VyZSB0aGUgYWdlbnQgaW50ZXJjZXB0cyBhbGwgdGhlIExDUCBlbnRyaWVzIHRyaWdnZXJlZCBieSB0aGUgYnJvd3NlciAoYWRkaW5nIGEgZGVsYXkgaW4gdGhlIHRpbWVvdXQpLlxuICAgICAgLy8gVGhlIGJyb3dzZXIgbWlnaHQgbmVlZCBtb3JlIHRpbWUgYWZ0ZXIgdGhlIHBhZ2Vsb2FkIGV2ZW50IHRvIHJlbmRlciBvdGhlciBlbGVtZW50cyAoZS5nLiBpbWFnZXMpLlxuICAgICAgLy8gVGhhdCdzIGltcG9ydGFudCBiZWNhdXNlIGEgTENQIGlzIG9ubHkgdHJpZ2dlcmVkIHdoZW4gdGhlIHJlbGF0ZWQgZWxlbWVudCBpcyBjb21wbGV0ZWx5IHJlbmRlcmVkLlxuICAgICAgLy8gaHR0cHM6Ly93M2MuZ2l0aHViLmlvL2xhcmdlc3QtY29udGVudGZ1bC1wYWludC8jc2VjLWFkZC1sY3AtZW50cnlcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdHIucmVtb3ZlVGFzayhQQUdFX0xPQUQpLCBQQUdFX0xPQURfREVMQVkpXG4gICAgfVxuXG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgIHNlbmRQYWdlTG9hZE1ldHJpY3MoKVxuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHNlbmRQYWdlTG9hZE1ldHJpY3MpXG4gICAgfVxuICB9XG5cbiAgb2JzZXJ2ZShuYW1lLCBmbikge1xuICAgIGNvbnN0IGNvbmZpZ1NlcnZpY2UgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoQ09ORklHX1NFUlZJQ0UpXG4gICAgY29uZmlnU2VydmljZS5ldmVudHMub2JzZXJ2ZShuYW1lLCBmbilcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIHRoZSByZXF1aXJlZCBjb25maWcga2V5cyBhcmUgaW52YWxpZCwgdGhlIGFnZW50IGlzIGRlYWN0aXZhdGVkIHdpdGhcbiAgICogbG9nZ2luZyBlcnJvciB0byB0aGUgY29uc29sZVxuICAgKlxuICAgKiB2YWxpZGF0aW9uIGVycm9yIGZvcm1hdFxuICAgKiB7XG4gICAqICBtaXNzaW5nOiBbICdrZXkxJywgJ2tleTInXSxcbiAgICogIGludmFsaWQ6IFt7XG4gICAqICAgIGtleTogJ2EnLFxuICAgKiAgICB2YWx1ZTogJ2FiY2QnLFxuICAgKiAgICBhbGxvd2VkOiAnc3RyaW5nJ1xuICAgKiAgfV0sXG4gICAqICB1bmtub3duOiBbJ2tleTMnLCAna2V5NCddXG4gICAqIH1cbiAgICovXG4gIGNvbmZpZyhjb25maWcpIHtcbiAgICBjb25zdCBbY29uZmlnU2VydmljZSwgbG9nZ2luZ1NlcnZpY2VdID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKFtcbiAgICAgIENPTkZJR19TRVJWSUNFLFxuICAgICAgTE9HR0lOR19TRVJWSUNFXG4gICAgXSlcbiAgICBjb25zdCB7IG1pc3NpbmcsIGludmFsaWQsIHVua25vd24gfSA9IGNvbmZpZ1NlcnZpY2UudmFsaWRhdGUoY29uZmlnKVxuICAgIGlmICh1bmtub3duLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPVxuICAgICAgICAnVW5rbm93biBjb25maWcgb3B0aW9ucyBhcmUgc3BlY2lmaWVkIGZvciBSVU0gYWdlbnQ6ICcgK1xuICAgICAgICB1bmtub3duLmpvaW4oJywgJylcbiAgICAgIGxvZ2dpbmdTZXJ2aWNlLndhcm4obWVzc2FnZSlcbiAgICB9XG5cbiAgICBpZiAobWlzc2luZy5sZW5ndGggPT09IDAgJiYgaW52YWxpZC5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbmZpZ1NlcnZpY2Uuc2V0Q29uZmlnKGNvbmZpZylcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2VwYXJhdG9yID0gJywgJ1xuICAgICAgbGV0IG1lc3NhZ2UgPSBcIlJVTSBhZ2VudCBpc24ndCBjb3JyZWN0bHkgY29uZmlndXJlZC4gXCJcblxuICAgICAgaWYgKG1pc3NpbmcubGVuZ3RoID4gMCkge1xuICAgICAgICBtZXNzYWdlICs9IG1pc3Npbmcuam9pbihzZXBhcmF0b3IpICsgJyBpcyBtaXNzaW5nJ1xuICAgICAgICBpZiAoaW52YWxpZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgbWVzc2FnZSArPSBzZXBhcmF0b3JcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpbnZhbGlkLmZvckVhY2goKHsga2V5LCB2YWx1ZSwgYWxsb3dlZCB9LCBpbmRleCkgPT4ge1xuICAgICAgICBtZXNzYWdlICs9XG4gICAgICAgICAgYCR7a2V5fSBcIiR7dmFsdWV9XCIgY29udGFpbnMgaW52YWxpZCBjaGFyYWN0ZXJzISAoYWxsb3dlZDogJHthbGxvd2VkfSlgICtcbiAgICAgICAgICAoaW5kZXggIT09IGludmFsaWQubGVuZ3RoIC0gMSA/IHNlcGFyYXRvciA6ICcnKVxuICAgICAgfSlcbiAgICAgIGxvZ2dpbmdTZXJ2aWNlLmVycm9yKG1lc3NhZ2UpXG4gICAgICBjb25maWdTZXJ2aWNlLnNldENvbmZpZyh7IGFjdGl2ZTogZmFsc2UgfSlcbiAgICB9XG4gIH1cblxuICBzZXRVc2VyQ29udGV4dCh1c2VyQ29udGV4dCkge1xuICAgIHZhciBjb25maWdTZXJ2aWNlID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKENPTkZJR19TRVJWSUNFKVxuICAgIGNvbmZpZ1NlcnZpY2Uuc2V0VXNlckNvbnRleHQodXNlckNvbnRleHQpXG4gIH1cblxuICBzZXRDdXN0b21Db250ZXh0KGN1c3RvbUNvbnRleHQpIHtcbiAgICB2YXIgY29uZmlnU2VydmljZSA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShDT05GSUdfU0VSVklDRSlcbiAgICBjb25maWdTZXJ2aWNlLnNldEN1c3RvbUNvbnRleHQoY3VzdG9tQ29udGV4dClcbiAgfVxuXG4gIGFkZExhYmVscyhsYWJlbHMpIHtcbiAgICB2YXIgY29uZmlnU2VydmljZSA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShDT05GSUdfU0VSVklDRSlcbiAgICBjb25maWdTZXJ2aWNlLmFkZExhYmVscyhsYWJlbHMpXG4gIH1cblxuICAvLyBTaG91bGQgY2FsbCB0aGlzIG1ldGhvZCBiZWZvcmUgJ2xvYWQnIGV2ZW50IG9uIHdpbmRvdyBpcyBmaXJlZFxuICBzZXRJbml0aWFsUGFnZUxvYWROYW1lKG5hbWUpIHtcbiAgICBjb25zdCBjb25maWdTZXJ2aWNlID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKENPTkZJR19TRVJWSUNFKVxuICAgIGNvbmZpZ1NlcnZpY2Uuc2V0Q29uZmlnKHtcbiAgICAgIHBhZ2VMb2FkVHJhbnNhY3Rpb25OYW1lOiBuYW1lXG4gICAgfSlcbiAgfVxuXG4gIHN0YXJ0VHJhbnNhY3Rpb24obmFtZSwgdHlwZSwgb3B0aW9ucykge1xuICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICB2YXIgdHJhbnNhY3Rpb25TZXJ2aWNlID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKFxuICAgICAgICBUUkFOU0FDVElPTl9TRVJWSUNFXG4gICAgICApXG4gICAgICByZXR1cm4gdHJhbnNhY3Rpb25TZXJ2aWNlLnN0YXJ0VHJhbnNhY3Rpb24obmFtZSwgdHlwZSwgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICBzdGFydFNwYW4obmFtZSwgdHlwZSwgb3B0aW9ucykge1xuICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICB2YXIgdHJhbnNhY3Rpb25TZXJ2aWNlID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKFxuICAgICAgICBUUkFOU0FDVElPTl9TRVJWSUNFXG4gICAgICApXG4gICAgICByZXR1cm4gdHJhbnNhY3Rpb25TZXJ2aWNlLnN0YXJ0U3BhbihuYW1lLCB0eXBlLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIGdldEN1cnJlbnRUcmFuc2FjdGlvbigpIHtcbiAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgdmFyIHRyYW5zYWN0aW9uU2VydmljZSA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShcbiAgICAgICAgVFJBTlNBQ1RJT05fU0VSVklDRVxuICAgICAgKVxuICAgICAgcmV0dXJuIHRyYW5zYWN0aW9uU2VydmljZS5nZXRDdXJyZW50VHJhbnNhY3Rpb24oKVxuICAgIH1cbiAgfVxuXG4gIGNhcHR1cmVFcnJvcihlcnJvcikge1xuICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICB2YXIgZXJyb3JMb2dnaW5nID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKEVSUk9SX0xPR0dJTkcpXG4gICAgICByZXR1cm4gZXJyb3JMb2dnaW5nLmxvZ0Vycm9yKGVycm9yKVxuICAgIH1cbiAgfVxuXG4gIGFkZEZpbHRlcihmbikge1xuICAgIHZhciBjb25maWdTZXJ2aWNlID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKENPTkZJR19TRVJWSUNFKVxuICAgIGNvbmZpZ1NlcnZpY2UuYWRkRmlsdGVyKGZuKVxuICB9XG59XG4iLCIoZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvLyBVbml2ZXJzYWwgTW9kdWxlIERlZmluaXRpb24gKFVNRCkgdG8gc3VwcG9ydCBBTUQsIENvbW1vbkpTL05vZGUuanMsIFJoaW5vLCBhbmQgYnJvd3NlcnMuXG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKCdlcnJvci1zdGFjay1wYXJzZXInLCBbJ3N0YWNrZnJhbWUnXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJ3N0YWNrZnJhbWUnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5FcnJvclN0YWNrUGFyc2VyID0gZmFjdG9yeShyb290LlN0YWNrRnJhbWUpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlcihTdGFja0ZyYW1lKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIEZJUkVGT1hfU0FGQVJJX1NUQUNLX1JFR0VYUCA9IC8oXnxAKVxcUytcXDpcXGQrLztcbiAgICB2YXIgQ0hST01FX0lFX1NUQUNLX1JFR0VYUCA9IC9eXFxzKmF0IC4qKFxcUytcXDpcXGQrfFxcKG5hdGl2ZVxcKSkvbTtcbiAgICB2YXIgU0FGQVJJX05BVElWRV9DT0RFX1JFR0VYUCA9IC9eKGV2YWxAKT8oXFxbbmF0aXZlIGNvZGVcXF0pPyQvO1xuXG4gICAgZnVuY3Rpb24gX21hcChhcnJheSwgZm4sIHRoaXNBcmcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBBcnJheS5wcm90b3R5cGUubWFwID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXkubWFwKGZuLCB0aGlzQXJnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBuZXcgQXJyYXkoYXJyYXkubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRbaV0gPSBmbi5jYWxsKHRoaXNBcmcsIGFycmF5W2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfZmlsdGVyKGFycmF5LCBmbiwgdGhpc0FyZykge1xuICAgICAgICBpZiAodHlwZW9mIEFycmF5LnByb3RvdHlwZS5maWx0ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBhcnJheS5maWx0ZXIoZm4sIHRoaXNBcmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChmbi5jYWxsKHRoaXNBcmcsIGFycmF5W2ldKSkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChhcnJheVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9pbmRleE9mKGFycmF5LCB0YXJnZXQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5LmluZGV4T2YodGFyZ2V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJyYXlbaV0gPT09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2l2ZW4gYW4gRXJyb3Igb2JqZWN0LCBleHRyYWN0IHRoZSBtb3N0IGluZm9ybWF0aW9uIGZyb20gaXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIG9iamVjdFxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX0gb2YgU3RhY2tGcmFtZXNcbiAgICAgICAgICovXG4gICAgICAgIHBhcnNlOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZShlcnJvcikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBlcnJvci5zdGFja3RyYWNlICE9PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgZXJyb3JbJ29wZXJhI3NvdXJjZWxvYyddICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT3BlcmEoZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5zdGFjayAmJiBlcnJvci5zdGFjay5tYXRjaChDSFJPTUVfSUVfU1RBQ0tfUkVHRVhQKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlVjhPcklFKGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3RhY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUZGT3JTYWZhcmkoZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBwYXJzZSBnaXZlbiBFcnJvciBvYmplY3QnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBTZXBhcmF0ZSBsaW5lIGFuZCBjb2x1bW4gbnVtYmVycyBmcm9tIGEgc3RyaW5nIG9mIHRoZSBmb3JtOiAoVVJJOkxpbmU6Q29sdW1uKVxuICAgICAgICBleHRyYWN0TG9jYXRpb246IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJGV4dHJhY3RMb2NhdGlvbih1cmxMaWtlKSB7XG4gICAgICAgICAgICAvLyBGYWlsLWZhc3QgYnV0IHJldHVybiBsb2NhdGlvbnMgbGlrZSBcIihuYXRpdmUpXCJcbiAgICAgICAgICAgIGlmICh1cmxMaWtlLmluZGV4T2YoJzonKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW3VybExpa2VdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcmVnRXhwID0gLyguKz8pKD86XFw6KFxcZCspKT8oPzpcXDooXFxkKykpPyQvO1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gcmVnRXhwLmV4ZWModXJsTGlrZS5yZXBsYWNlKC9bXFwoXFwpXS9nLCAnJykpO1xuICAgICAgICAgICAgcmV0dXJuIFtwYXJ0c1sxXSwgcGFydHNbMl0gfHwgdW5kZWZpbmVkLCBwYXJ0c1szXSB8fCB1bmRlZmluZWRdO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlVjhPcklFOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZVY4T3JJRShlcnJvcikge1xuICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gX2ZpbHRlcihlcnJvci5zdGFjay5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFsaW5lLm1hdGNoKENIUk9NRV9JRV9TVEFDS19SRUdFWFApO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBfbWFwKGZpbHRlcmVkLCBmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpbmUuaW5kZXhPZignKGV2YWwgJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaHJvdyBhd2F5IGV2YWwgaW5mb3JtYXRpb24gdW50aWwgd2UgaW1wbGVtZW50IHN0YWNrdHJhY2UuanMvc3RhY2tmcmFtZSM4XG4gICAgICAgICAgICAgICAgICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoL2V2YWwgY29kZS9nLCAnZXZhbCcpLnJlcGxhY2UoLyhcXChldmFsIGF0IFteXFwoKV0qKXwoXFwpXFwsLiokKS9nLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB0b2tlbnMgPSBsaW5lLnJlcGxhY2UoL15cXHMrLywgJycpLnJlcGxhY2UoL1xcKGV2YWwgY29kZS9nLCAnKCcpLnNwbGl0KC9cXHMrLykuc2xpY2UoMSk7XG4gICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uUGFydHMgPSB0aGlzLmV4dHJhY3RMb2NhdGlvbih0b2tlbnMucG9wKCkpO1xuICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSB0b2tlbnMuam9pbignICcpIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBfaW5kZXhPZihbJ2V2YWwnLCAnPGFub255bW91cz4nXSwgbG9jYXRpb25QYXJ0c1swXSkgPiAtMSA/IHVuZGVmaW5lZCA6IGxvY2F0aW9uUGFydHNbMF07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFN0YWNrRnJhbWUoZnVuY3Rpb25OYW1lLCB1bmRlZmluZWQsIGZpbGVOYW1lLCBsb2NhdGlvblBhcnRzWzFdLCBsb2NhdGlvblBhcnRzWzJdLCBsaW5lKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlRkZPclNhZmFyaTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VGRk9yU2FmYXJpKGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyZWQgPSBfZmlsdGVyKGVycm9yLnN0YWNrLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhbGluZS5tYXRjaChTQUZBUklfTkFUSVZFX0NPREVfUkVHRVhQKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gX21hcChmaWx0ZXJlZCwgZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIC8vIFRocm93IGF3YXkgZXZhbCBpbmZvcm1hdGlvbiB1bnRpbCB3ZSBpbXBsZW1lbnQgc3RhY2t0cmFjZS5qcy9zdGFja2ZyYW1lIzhcbiAgICAgICAgICAgICAgICBpZiAobGluZS5pbmRleE9mKCcgPiBldmFsJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICBsaW5lID0gbGluZS5yZXBsYWNlKC8gbGluZSAoXFxkKykoPzogPiBldmFsIGxpbmUgXFxkKykqID4gZXZhbFxcOlxcZCtcXDpcXGQrL2csICc6JDEnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobGluZS5pbmRleE9mKCdAJykgPT09IC0xICYmIGxpbmUuaW5kZXhPZignOicpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkgZXZhbCBmcmFtZXMgb25seSBoYXZlIGZ1bmN0aW9uIG5hbWVzIGFuZCBub3RoaW5nIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKGxpbmUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0b2tlbnMgPSBsaW5lLnNwbGl0KCdAJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvblBhcnRzID0gdGhpcy5leHRyYWN0TG9jYXRpb24odG9rZW5zLnBvcCgpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IHRva2Vucy5qb2luKCdAJykgfHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFN0YWNrRnJhbWUoZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb25QYXJ0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uUGFydHNbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvblBhcnRzWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VPcGVyYTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYShlKSB7XG4gICAgICAgICAgICBpZiAoIWUuc3RhY2t0cmFjZSB8fCAoZS5tZXNzYWdlLmluZGV4T2YoJ1xcbicpID4gLTEgJiZcbiAgICAgICAgICAgICAgICBlLm1lc3NhZ2Uuc3BsaXQoJ1xcbicpLmxlbmd0aCA+IGUuc3RhY2t0cmFjZS5zcGxpdCgnXFxuJykubGVuZ3RoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT3BlcmE5KGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghZS5zdGFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT3BlcmExMChlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VPcGVyYTExKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlT3BlcmE5OiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZU9wZXJhOShlKSB7XG4gICAgICAgICAgICB2YXIgbGluZVJFID0gL0xpbmUgKFxcZCspLipzY3JpcHQgKD86aW4gKT8oXFxTKykvaTtcbiAgICAgICAgICAgIHZhciBsaW5lcyA9IGUubWVzc2FnZS5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAyLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IGxpbmVSRS5leGVjKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3IFN0YWNrRnJhbWUodW5kZWZpbmVkLCB1bmRlZmluZWQsIG1hdGNoWzJdLCBtYXRjaFsxXSwgdW5kZWZpbmVkLCBsaW5lc1tpXSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZU9wZXJhMTA6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlT3BlcmExMChlKSB7XG4gICAgICAgICAgICB2YXIgbGluZVJFID0gL0xpbmUgKFxcZCspLipzY3JpcHQgKD86aW4gKT8oXFxTKykoPzo6IEluIGZ1bmN0aW9uIChcXFMrKSk/JC9pO1xuICAgICAgICAgICAgdmFyIGxpbmVzID0gZS5zdGFja3RyYWNlLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gbGluZVJFLmV4ZWMobGluZXNbaV0pO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBTdGFja0ZyYW1lKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoWzNdIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hbMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIE9wZXJhIDEwLjY1KyBFcnJvci5zdGFjayB2ZXJ5IHNpbWlsYXIgdG8gRkYvU2FmYXJpXG4gICAgICAgIHBhcnNlT3BlcmExMTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYTExKGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyZWQgPSBfZmlsdGVyKGVycm9yLnN0YWNrLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhIWxpbmUubWF0Y2goRklSRUZPWF9TQUZBUklfU1RBQ0tfUkVHRVhQKSAmJiAhbGluZS5tYXRjaCgvXkVycm9yIGNyZWF0ZWQgYXQvKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gX21hcChmaWx0ZXJlZCwgZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHZhciB0b2tlbnMgPSBsaW5lLnNwbGl0KCdAJyk7XG4gICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uUGFydHMgPSB0aGlzLmV4dHJhY3RMb2NhdGlvbih0b2tlbnMucG9wKCkpO1xuICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbkNhbGwgPSAodG9rZW5zLnNoaWZ0KCkgfHwgJycpO1xuICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSBmdW5jdGlvbkNhbGxcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC88YW5vbnltb3VzIGZ1bmN0aW9uKDogKFxcdyspKT8+LywgJyQyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXChbXlxcKV0qXFwpL2csICcnKSB8fCB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3NSYXc7XG4gICAgICAgICAgICAgICAgaWYgKGZ1bmN0aW9uQ2FsbC5tYXRjaCgvXFwoKFteXFwpXSopXFwpLykpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnc1JhdyA9IGZ1bmN0aW9uQ2FsbC5yZXBsYWNlKC9eW15cXChdK1xcKChbXlxcKV0qKVxcKSQvLCAnJDEnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSAoYXJnc1JhdyA9PT0gdW5kZWZpbmVkIHx8IGFyZ3NSYXcgPT09ICdbYXJndW1lbnRzIG5vdCBhdmFpbGFibGVdJykgP1xuICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQgOiBhcmdzUmF3LnNwbGl0KCcsJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MsXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uUGFydHNbMF0sXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uUGFydHNbMV0sXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uUGFydHNbMl0sXG4gICAgICAgICAgICAgICAgICAgIGxpbmUpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xufSkpO1xuXG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8qKlxuICogVGhlIEZPUk1BVF9CSU5BUlkgZm9ybWF0IHJlcHJlc2VudHMgU3BhbkNvbnRleHRzIGluIGFuIG9wYXF1ZSBiaW5hcnlcbiAqIGNhcnJpZXIuXG4gKlxuICogVHJhY2VyLmluamVjdCgpIHdpbGwgc2V0IHRoZSBidWZmZXIgZmllbGQgdG8gYW4gQXJyYXktbGlrZSAoQXJyYXksXG4gKiBBcnJheUJ1ZmZlciwgb3IgVHlwZWRCdWZmZXIpIG9iamVjdCBjb250YWluaW5nIHRoZSBpbmplY3RlZCBiaW5hcnkgZGF0YS5cbiAqIEFueSB2YWxpZCBPYmplY3QgY2FuIGJlIHVzZWQgYXMgbG9uZyBhcyB0aGUgYnVmZmVyIGZpZWxkIG9mIHRoZSBvYmplY3RcbiAqIGNhbiBiZSBzZXQuXG4gKlxuICogVHJhY2VyLmV4dHJhY3QoKSB3aWxsIGxvb2sgZm9yIGBjYXJyaWVyLmJ1ZmZlcmAsIGFuZCB0aGF0IGZpZWxkIGlzXG4gKiBleHBlY3RlZCB0byBiZSBhbiBBcnJheS1saWtlIG9iamVjdCAoQXJyYXksIEFycmF5QnVmZmVyLCBvclxuICogVHlwZWRCdWZmZXIpLlxuICovXG5leHBvcnRzLkZPUk1BVF9CSU5BUlkgPSAnYmluYXJ5Jztcbi8qKlxuICogVGhlIEZPUk1BVF9URVhUX01BUCBmb3JtYXQgcmVwcmVzZW50cyBTcGFuQ29udGV4dHMgdXNpbmcgYVxuICogc3RyaW5nLT5zdHJpbmcgbWFwIChiYWNrZWQgYnkgYSBKYXZhc2NyaXB0IE9iamVjdCkgYXMgYSBjYXJyaWVyLlxuICpcbiAqIE5PVEU6IFVubGlrZSBGT1JNQVRfSFRUUF9IRUFERVJTLCBGT1JNQVRfVEVYVF9NQVAgcGxhY2VzIG5vIHJlc3RyaWN0aW9uc1xuICogb24gdGhlIGNoYXJhY3RlcnMgdXNlZCBpbiBlaXRoZXIgdGhlIGtleXMgb3IgdGhlIHZhbHVlcyBvZiB0aGUgbWFwXG4gKiBlbnRyaWVzLlxuICpcbiAqIFRoZSBGT1JNQVRfVEVYVF9NQVAgY2FycmllciBtYXAgbWF5IGNvbnRhaW4gdW5yZWxhdGVkIGRhdGEgKGUuZy4sXG4gKiBhcmJpdHJhcnkgZ1JQQyBtZXRhZGF0YSk7IGFzIHN1Y2gsIHRoZSBUcmFjZXIgaW1wbGVtZW50YXRpb24gc2hvdWxkIHVzZVxuICogYSBwcmVmaXggb3Igb3RoZXIgY29udmVudGlvbiB0byBkaXN0aW5ndWlzaCBUcmFjZXItc3BlY2lmaWMga2V5OnZhbHVlXG4gKiBwYWlycy5cbiAqL1xuZXhwb3J0cy5GT1JNQVRfVEVYVF9NQVAgPSAndGV4dF9tYXAnO1xuLyoqXG4gKiBUaGUgRk9STUFUX0hUVFBfSEVBREVSUyBmb3JtYXQgcmVwcmVzZW50cyBTcGFuQ29udGV4dHMgdXNpbmcgYVxuICogY2hhcmFjdGVyLXJlc3RyaWN0ZWQgc3RyaW5nLT5zdHJpbmcgbWFwIChiYWNrZWQgYnkgYSBKYXZhc2NyaXB0IE9iamVjdClcbiAqIGFzIGEgY2Fycmllci5cbiAqXG4gKiBLZXlzIGFuZCB2YWx1ZXMgaW4gdGhlIEZPUk1BVF9IVFRQX0hFQURFUlMgY2FycmllciBtdXN0IGJlIHN1aXRhYmxlIGZvclxuICogdXNlIGFzIEhUVFAgaGVhZGVycyAod2l0aG91dCBtb2RpZmljYXRpb24gb3IgZnVydGhlciBlc2NhcGluZykuIFRoYXQgaXMsXG4gKiB0aGUga2V5cyBoYXZlIGEgZ3JlYXRseSByZXN0cmljdGVkIGNoYXJhY3RlciBzZXQsIGNhc2luZyBmb3IgdGhlIGtleXNcbiAqIG1heSBub3QgYmUgcHJlc2VydmVkIGJ5IHZhcmlvdXMgaW50ZXJtZWRpYXJpZXMsIGFuZCB0aGUgdmFsdWVzIHNob3VsZCBiZVxuICogVVJMLWVzY2FwZWQuXG4gKlxuICogVGhlIEZPUk1BVF9IVFRQX0hFQURFUlMgY2FycmllciBtYXAgbWF5IGNvbnRhaW4gdW5yZWxhdGVkIGRhdGEgKGUuZy4sXG4gKiBhcmJpdHJhcnkgSFRUUCBoZWFkZXJzKTsgYXMgc3VjaCwgdGhlIFRyYWNlciBpbXBsZW1lbnRhdGlvbiBzaG91bGQgdXNlIGFcbiAqIHByZWZpeCBvciBvdGhlciBjb252ZW50aW9uIHRvIGRpc3Rpbmd1aXNoIFRyYWNlci1zcGVjaWZpYyBrZXk6dmFsdWVcbiAqIHBhaXJzLlxuICovXG5leHBvcnRzLkZPUk1BVF9IVFRQX0hFQURFUlMgPSAnaHR0cF9oZWFkZXJzJztcbi8qKlxuICogQSBTcGFuIG1heSBiZSB0aGUgXCJjaGlsZCBvZlwiIGEgcGFyZW50IFNwYW4uIEluIGEg4oCcY2hpbGQgb2bigJ0gcmVmZXJlbmNlLFxuICogdGhlIHBhcmVudCBTcGFuIGRlcGVuZHMgb24gdGhlIGNoaWxkIFNwYW4gaW4gc29tZSBjYXBhY2l0eS5cbiAqXG4gKiBTZWUgbW9yZSBhYm91dCByZWZlcmVuY2UgdHlwZXMgYXQgaHR0cHM6Ly9naXRodWIuY29tL29wZW50cmFjaW5nL3NwZWNpZmljYXRpb25cbiAqL1xuZXhwb3J0cy5SRUZFUkVOQ0VfQ0hJTERfT0YgPSAnY2hpbGRfb2YnO1xuLyoqXG4gKiBTb21lIHBhcmVudCBTcGFucyBkbyBub3QgZGVwZW5kIGluIGFueSB3YXkgb24gdGhlIHJlc3VsdCBvZiB0aGVpciBjaGlsZFxuICogU3BhbnMuIEluIHRoZXNlIGNhc2VzLCB3ZSBzYXkgbWVyZWx5IHRoYXQgdGhlIGNoaWxkIFNwYW4g4oCcZm9sbG93cyBmcm9t4oCdXG4gKiB0aGUgcGFyZW50IFNwYW4gaW4gYSBjYXVzYWwgc2Vuc2UuXG4gKlxuICogU2VlIG1vcmUgYWJvdXQgcmVmZXJlbmNlIHR5cGVzIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9vcGVudHJhY2luZy9zcGVjaWZpY2F0aW9uXG4gKi9cbmV4cG9ydHMuUkVGRVJFTkNFX0ZPTExPV1NfRlJPTSA9ICdmb2xsb3dzX2Zyb20nO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29uc3RhbnRzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIENvbnN0YW50cyA9IHJlcXVpcmUoXCIuL2NvbnN0YW50c1wiKTtcbnZhciByZWZlcmVuY2VfMSA9IHJlcXVpcmUoXCIuL3JlZmVyZW5jZVwiKTtcbnZhciBzcGFuXzEgPSByZXF1aXJlKFwiLi9zcGFuXCIpO1xuLyoqXG4gKiBSZXR1cm4gYSBuZXcgUkVGRVJFTkNFX0NISUxEX09GIHJlZmVyZW5jZS5cbiAqXG4gKiBAcGFyYW0ge1NwYW5Db250ZXh0fSBzcGFuQ29udGV4dCAtIHRoZSBwYXJlbnQgU3BhbkNvbnRleHQgaW5zdGFuY2UgdG9cbiAqICAgICAgICByZWZlcmVuY2UuXG4gKiBAcmV0dXJuIGEgUkVGRVJFTkNFX0NISUxEX09GIHJlZmVyZW5jZSBwb2ludGluZyB0byBgc3BhbkNvbnRleHRgXG4gKi9cbmZ1bmN0aW9uIGNoaWxkT2Yoc3BhbkNvbnRleHQpIHtcbiAgICAvLyBBbGxvdyB0aGUgdXNlciB0byBwYXNzIGEgU3BhbiBpbnN0ZWFkIG9mIGEgU3BhbkNvbnRleHRcbiAgICBpZiAoc3BhbkNvbnRleHQgaW5zdGFuY2VvZiBzcGFuXzEuZGVmYXVsdCkge1xuICAgICAgICBzcGFuQ29udGV4dCA9IHNwYW5Db250ZXh0LmNvbnRleHQoKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyByZWZlcmVuY2VfMS5kZWZhdWx0KENvbnN0YW50cy5SRUZFUkVOQ0VfQ0hJTERfT0YsIHNwYW5Db250ZXh0KTtcbn1cbmV4cG9ydHMuY2hpbGRPZiA9IGNoaWxkT2Y7XG4vKipcbiAqIFJldHVybiBhIG5ldyBSRUZFUkVOQ0VfRk9MTE9XU19GUk9NIHJlZmVyZW5jZS5cbiAqXG4gKiBAcGFyYW0ge1NwYW5Db250ZXh0fSBzcGFuQ29udGV4dCAtIHRoZSBwYXJlbnQgU3BhbkNvbnRleHQgaW5zdGFuY2UgdG9cbiAqICAgICAgICByZWZlcmVuY2UuXG4gKiBAcmV0dXJuIGEgUkVGRVJFTkNFX0ZPTExPV1NfRlJPTSByZWZlcmVuY2UgcG9pbnRpbmcgdG8gYHNwYW5Db250ZXh0YFxuICovXG5mdW5jdGlvbiBmb2xsb3dzRnJvbShzcGFuQ29udGV4dCkge1xuICAgIC8vIEFsbG93IHRoZSB1c2VyIHRvIHBhc3MgYSBTcGFuIGluc3RlYWQgb2YgYSBTcGFuQ29udGV4dFxuICAgIGlmIChzcGFuQ29udGV4dCBpbnN0YW5jZW9mIHNwYW5fMS5kZWZhdWx0KSB7XG4gICAgICAgIHNwYW5Db250ZXh0ID0gc3BhbkNvbnRleHQuY29udGV4dCgpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IHJlZmVyZW5jZV8xLmRlZmF1bHQoQ29uc3RhbnRzLlJFRkVSRU5DRV9GT0xMT1dTX0ZST00sIHNwYW5Db250ZXh0KTtcbn1cbmV4cG9ydHMuZm9sbG93c0Zyb20gPSBmb2xsb3dzRnJvbTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZ1bmN0aW9ucy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBzcGFuXzEgPSByZXF1aXJlKFwiLi9zcGFuXCIpO1xudmFyIHNwYW5fY29udGV4dF8xID0gcmVxdWlyZShcIi4vc3Bhbl9jb250ZXh0XCIpO1xudmFyIHRyYWNlcl8xID0gcmVxdWlyZShcIi4vdHJhY2VyXCIpO1xuZXhwb3J0cy50cmFjZXIgPSBudWxsO1xuZXhwb3J0cy5zcGFuQ29udGV4dCA9IG51bGw7XG5leHBvcnRzLnNwYW4gPSBudWxsO1xuLy8gRGVmZXJyZWQgaW5pdGlhbGl6YXRpb24gdG8gYXZvaWQgYSBkZXBlbmRlbmN5IGN5Y2xlIHdoZXJlIFRyYWNlciBkZXBlbmRzIG9uXG4vLyBTcGFuIHdoaWNoIGRlcGVuZHMgb24gdGhlIG5vb3AgdHJhY2VyLlxuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBleHBvcnRzLnRyYWNlciA9IG5ldyB0cmFjZXJfMS5kZWZhdWx0KCk7XG4gICAgZXhwb3J0cy5zcGFuID0gbmV3IHNwYW5fMS5kZWZhdWx0KCk7XG4gICAgZXhwb3J0cy5zcGFuQ29udGV4dCA9IG5ldyBzcGFuX2NvbnRleHRfMS5kZWZhdWx0KCk7XG59XG5leHBvcnRzLmluaXRpYWxpemUgPSBpbml0aWFsaXplO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bm9vcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBzcGFuXzEgPSByZXF1aXJlKFwiLi9zcGFuXCIpO1xuLyoqXG4gKiBSZWZlcmVuY2UgcGFpcnMgYSByZWZlcmVuY2UgdHlwZSBjb25zdGFudCAoZS5nLiwgUkVGRVJFTkNFX0NISUxEX09GIG9yXG4gKiBSRUZFUkVOQ0VfRk9MTE9XU19GUk9NKSB3aXRoIHRoZSBTcGFuQ29udGV4dCBpdCBwb2ludHMgdG8uXG4gKlxuICogU2VlIHRoZSBleHBvcnRlZCBjaGlsZE9mKCkgYW5kIGZvbGxvd3NGcm9tKCkgZnVuY3Rpb25zIGF0IHRoZSBwYWNrYWdlIGxldmVsLlxuICovXG52YXIgUmVmZXJlbmNlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgYSBuZXcgUmVmZXJlbmNlIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSB0aGUgUmVmZXJlbmNlIHR5cGUgY29uc3RhbnQgKGUuZy4sXG4gICAgICogICAgICAgIFJFRkVSRU5DRV9DSElMRF9PRiBvciBSRUZFUkVOQ0VfRk9MTE9XU19GUk9NKS5cbiAgICAgKiBAcGFyYW0ge1NwYW5Db250ZXh0fSByZWZlcmVuY2VkQ29udGV4dCAtIHRoZSBTcGFuQ29udGV4dCBiZWluZyByZWZlcnJlZFxuICAgICAqICAgICAgICB0by4gQXMgYSBjb252ZW5pZW5jZSwgYSBTcGFuIGluc3RhbmNlIG1heSBiZSBwYXNzZWQgaW4gaW5zdGVhZFxuICAgICAqICAgICAgICAoaW4gd2hpY2ggY2FzZSBpdHMgLmNvbnRleHQoKSBpcyB1c2VkIGhlcmUpLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFJlZmVyZW5jZSh0eXBlLCByZWZlcmVuY2VkQ29udGV4dCkge1xuICAgICAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5fcmVmZXJlbmNlZENvbnRleHQgPSAocmVmZXJlbmNlZENvbnRleHQgaW5zdGFuY2VvZiBzcGFuXzEuZGVmYXVsdCA/XG4gICAgICAgICAgICByZWZlcmVuY2VkQ29udGV4dC5jb250ZXh0KCkgOlxuICAgICAgICAgICAgcmVmZXJlbmNlZENvbnRleHQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBSZWZlcmVuY2UgdHlwZSAoZS5nLiwgUkVGRVJFTkNFX0NISUxEX09GIG9yXG4gICAgICogICAgICAgICBSRUZFUkVOQ0VfRk9MTE9XU19GUk9NKS5cbiAgICAgKi9cbiAgICBSZWZlcmVuY2UucHJvdG90eXBlLnR5cGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQHJldHVybiB7U3BhbkNvbnRleHR9IFRoZSBTcGFuQ29udGV4dCBiZWluZyByZWZlcnJlZCB0byAoZS5nLiwgdGhlXG4gICAgICogICAgICAgICBwYXJlbnQgaW4gYSBSRUZFUkVOQ0VfQ0hJTERfT0YgUmVmZXJlbmNlKS5cbiAgICAgKi9cbiAgICBSZWZlcmVuY2UucHJvdG90eXBlLnJlZmVyZW5jZWRDb250ZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVmZXJlbmNlZENvbnRleHQ7XG4gICAgfTtcbiAgICByZXR1cm4gUmVmZXJlbmNlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFJlZmVyZW5jZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlZmVyZW5jZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBub29wID0gcmVxdWlyZShcIi4vbm9vcFwiKTtcbi8qKlxuICogU3BhbiByZXByZXNlbnRzIGEgbG9naWNhbCB1bml0IG9mIHdvcmsgYXMgcGFydCBvZiBhIGJyb2FkZXIgVHJhY2UuIEV4YW1wbGVzXG4gKiBvZiBzcGFuIG1pZ2h0IGluY2x1ZGUgcmVtb3RlIHByb2NlZHVyZSBjYWxscyBvciBhIGluLXByb2Nlc3MgZnVuY3Rpb24gY2FsbHNcbiAqIHRvIHN1Yi1jb21wb25lbnRzLiBBIFRyYWNlIGhhcyBhIHNpbmdsZSwgdG9wLWxldmVsIFwicm9vdFwiIFNwYW4gdGhhdCBpbiB0dXJuXG4gKiBtYXkgaGF2ZSB6ZXJvIG9yIG1vcmUgY2hpbGQgU3BhbnMsIHdoaWNoIGluIHR1cm4gbWF5IGhhdmUgY2hpbGRyZW4uXG4gKi9cbnZhciBTcGFuID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNwYW4oKSB7XG4gICAgfVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cbiAgICAvLyBPcGVuVHJhY2luZyBBUEkgbWV0aG9kc1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBTcGFuQ29udGV4dCBvYmplY3QgYXNzb2NpYXRlZCB3aXRoIHRoaXMgU3Bhbi5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NwYW5Db250ZXh0fVxuICAgICAqL1xuICAgIFNwYW4ucHJvdG90eXBlLmNvbnRleHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb250ZXh0KCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBUcmFjZXIgb2JqZWN0IHVzZWQgdG8gY3JlYXRlIHRoaXMgU3Bhbi5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1RyYWNlcn1cbiAgICAgKi9cbiAgICBTcGFuLnByb3RvdHlwZS50cmFjZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90cmFjZXIoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHN0cmluZyBuYW1lIGZvciB0aGUgbG9naWNhbCBvcGVyYXRpb24gdGhpcyBzcGFuIHJlcHJlc2VudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgICAqL1xuICAgIFNwYW4ucHJvdG90eXBlLnNldE9wZXJhdGlvbk5hbWUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB0aGlzLl9zZXRPcGVyYXRpb25OYW1lKG5hbWUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFNldHMgYSBrZXk6dmFsdWUgcGFpciBvbiB0aGlzIFNwYW4gdGhhdCBhbHNvIHByb3BhZ2F0ZXMgdG8gZnV0dXJlXG4gICAgICogY2hpbGRyZW4gb2YgdGhlIGFzc29jaWF0ZWQgU3Bhbi5cbiAgICAgKlxuICAgICAqIHNldEJhZ2dhZ2VJdGVtKCkgZW5hYmxlcyBwb3dlcmZ1bCBmdW5jdGlvbmFsaXR5IGdpdmVuIGEgZnVsbC1zdGFja1xuICAgICAqIG9wZW50cmFjaW5nIGludGVncmF0aW9uIChlLmcuLCBhcmJpdHJhcnkgYXBwbGljYXRpb24gZGF0YSBmcm9tIGEgd2ViXG4gICAgICogY2xpZW50IGNhbiBtYWtlIGl0LCB0cmFuc3BhcmVudGx5LCBhbGwgdGhlIHdheSBpbnRvIHRoZSBkZXB0aHMgb2YgYVxuICAgICAqIHN0b3JhZ2Ugc3lzdGVtKSwgYW5kIHdpdGggaXQgc29tZSBwb3dlcmZ1bCBjb3N0czogdXNlIHRoaXMgZmVhdHVyZSB3aXRoXG4gICAgICogY2FyZS5cbiAgICAgKlxuICAgICAqIElNUE9SVEFOVCBOT1RFICMxOiBzZXRCYWdnYWdlSXRlbSgpIHdpbGwgb25seSBwcm9wYWdhdGUgYmFnZ2FnZSBpdGVtcyB0b1xuICAgICAqICpmdXR1cmUqIGNhdXNhbCBkZXNjZW5kYW50cyBvZiB0aGUgYXNzb2NpYXRlZCBTcGFuLlxuICAgICAqXG4gICAgICogSU1QT1JUQU5UIE5PVEUgIzI6IFVzZSB0aGlzIHRob3VnaHRmdWxseSBhbmQgd2l0aCBjYXJlLiBFdmVyeSBrZXkgYW5kXG4gICAgICogdmFsdWUgaXMgY29waWVkIGludG8gZXZlcnkgbG9jYWwgKmFuZCByZW1vdGUqIGNoaWxkIG9mIHRoZSBhc3NvY2lhdGVkXG4gICAgICogU3BhbiwgYW5kIHRoYXQgY2FuIGFkZCB1cCB0byBhIGxvdCBvZiBuZXR3b3JrIGFuZCBjcHUgb3ZlcmhlYWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gICAgICovXG4gICAgU3Bhbi5wcm90b3R5cGUuc2V0QmFnZ2FnZUl0ZW0gPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICB0aGlzLl9zZXRCYWdnYWdlSXRlbShrZXksIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBmb3IgYSBiYWdnYWdlIGl0ZW0gZ2l2ZW4gaXRzIGtleS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge3N0cmluZ30ga2V5XG4gICAgICogICAgICAgICBUaGUga2V5IGZvciB0aGUgZ2l2ZW4gdHJhY2UgYXR0cmlidXRlLlxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKiAgICAgICAgIFN0cmluZyB2YWx1ZSBmb3IgdGhlIGdpdmVuIGtleSwgb3IgdW5kZWZpbmVkIGlmIHRoZSBrZXkgZG9lcyBub3RcbiAgICAgKiAgICAgICAgIGNvcnJlc3BvbmQgdG8gYSBzZXQgdHJhY2UgYXR0cmlidXRlLlxuICAgICAqL1xuICAgIFNwYW4ucHJvdG90eXBlLmdldEJhZ2dhZ2VJdGVtID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0QmFnZ2FnZUl0ZW0oa2V5KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFkZHMgYSBzaW5nbGUgdGFnIHRvIHRoZSBzcGFuLiAgU2VlIGBhZGRUYWdzKClgIGZvciBkZXRhaWxzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgICAqL1xuICAgIFNwYW4ucHJvdG90eXBlLnNldFRhZyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIC8vIE5PVEU6IHRoZSBjYWxsIGlzIG5vcm1hbGl6ZWQgdG8gYSBjYWxsIHRvIF9hZGRUYWdzKClcbiAgICAgICAgdGhpcy5fYWRkVGFncygoX2EgPSB7fSwgX2Fba2V5XSA9IHZhbHVlLCBfYSkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgdmFyIF9hO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQWRkcyB0aGUgZ2l2ZW4ga2V5IHZhbHVlIHBhaXJzIHRvIHRoZSBzZXQgb2Ygc3BhbiB0YWdzLlxuICAgICAqXG4gICAgICogTXVsdGlwbGUgY2FsbHMgdG8gYWRkVGFncygpIHJlc3VsdHMgaW4gdGhlIHRhZ3MgYmVpbmcgdGhlIHN1cGVyc2V0IG9mXG4gICAgICogYWxsIGNhbGxzLlxuICAgICAqXG4gICAgICogVGhlIGJlaGF2aW9yIG9mIHNldHRpbmcgdGhlIHNhbWUga2V5IG11bHRpcGxlIHRpbWVzIG9uIHRoZSBzYW1lIHNwYW5cbiAgICAgKiBpcyB1bmRlZmluZWQuXG4gICAgICpcbiAgICAgKiBUaGUgc3VwcG9ydGVkIHR5cGUgb2YgdGhlIHZhbHVlcyBpcyBpbXBsZW1lbnRhdGlvbi1kZXBlbmRlbnQuXG4gICAgICogSW1wbGVtZW50YXRpb25zIGFyZSBleHBlY3RlZCB0byBzYWZlbHkgaGFuZGxlIGFsbCB0eXBlcyBvZiB2YWx1ZXMgYnV0XG4gICAgICogbWF5IGNob29zZSB0byBpZ25vcmUgdW5yZWNvZ25pemVkIC8gdW5oYW5kbGUtYWJsZSB2YWx1ZXMgKGUuZy4gb2JqZWN0c1xuICAgICAqIHdpdGggY3ljbGljIHJlZmVyZW5jZXMsIGZ1bmN0aW9uIG9iamVjdHMpLlxuICAgICAqXG4gICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAgICovXG4gICAgU3Bhbi5wcm90b3R5cGUuYWRkVGFncyA9IGZ1bmN0aW9uIChrZXlWYWx1ZU1hcCkge1xuICAgICAgICB0aGlzLl9hZGRUYWdzKGtleVZhbHVlTWFwKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBZGQgYSBsb2cgcmVjb3JkIHRvIHRoaXMgU3Bhbiwgb3B0aW9uYWxseSBhdCBhIHVzZXItcHJvdmlkZWQgdGltZXN0YW1wLlxuICAgICAqXG4gICAgICogRm9yIGV4YW1wbGU6XG4gICAgICpcbiAgICAgKiAgICAgc3Bhbi5sb2coe1xuICAgICAqICAgICAgICAgc2l6ZTogcnBjLnNpemUoKSwgIC8vIG51bWVyaWMgdmFsdWVcbiAgICAgKiAgICAgICAgIFVSSTogcnBjLlVSSSgpLCAgLy8gc3RyaW5nIHZhbHVlXG4gICAgICogICAgICAgICBwYXlsb2FkOiBycGMucGF5bG9hZCgpLCAgLy8gT2JqZWN0IHZhbHVlXG4gICAgICogICAgICAgICBcImtleXMgY2FuIGJlIGFyYml0cmFyeSBzdHJpbmdzXCI6IHJwYy5mb28oKSxcbiAgICAgKiAgICAgfSk7XG4gICAgICpcbiAgICAgKiAgICAgc3Bhbi5sb2coe1xuICAgICAqICAgICAgICAgXCJlcnJvci5kZXNjcmlwdGlvblwiOiBzb21lRXJyb3IuZGVzY3JpcHRpb24oKSxcbiAgICAgKiAgICAgfSwgc29tZUVycm9yLnRpbWVzdGFtcE1pbGxpcygpKTtcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBrZXlWYWx1ZVBhaXJzXG4gICAgICogICAgICAgIEFuIG9iamVjdCBtYXBwaW5nIHN0cmluZyBrZXlzIHRvIGFyYml0cmFyeSB2YWx1ZSB0eXBlcy4gQWxsXG4gICAgICogICAgICAgIFRyYWNlciBpbXBsZW1lbnRhdGlvbnMgc2hvdWxkIHN1cHBvcnQgYm9vbCwgc3RyaW5nLCBhbmQgbnVtZXJpY1xuICAgICAqICAgICAgICB2YWx1ZSB0eXBlcywgYW5kIHNvbWUgbWF5IGFsc28gc3VwcG9ydCBPYmplY3QgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lc3RhbXBcbiAgICAgKiAgICAgICAgQW4gb3B0aW9uYWwgcGFyYW1ldGVyIHNwZWNpZnlpbmcgdGhlIHRpbWVzdGFtcCBpbiBtaWxsaXNlY29uZHNcbiAgICAgKiAgICAgICAgc2luY2UgdGhlIFVuaXggZXBvY2guIEZyYWN0aW9uYWwgdmFsdWVzIGFyZSBhbGxvd2VkIHNvIHRoYXRcbiAgICAgKiAgICAgICAgdGltZXN0YW1wcyB3aXRoIHN1Yi1taWxsaXNlY29uZCBhY2N1cmFjeSBjYW4gYmUgcmVwcmVzZW50ZWQuIElmXG4gICAgICogICAgICAgIG5vdCBzcGVjaWZpZWQsIHRoZSBpbXBsZW1lbnRhdGlvbiBpcyBleHBlY3RlZCB0byB1c2UgaXRzIG5vdGlvblxuICAgICAqICAgICAgICBvZiB0aGUgY3VycmVudCB0aW1lIG9mIHRoZSBjYWxsLlxuICAgICAqL1xuICAgIFNwYW4ucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uIChrZXlWYWx1ZVBhaXJzLCB0aW1lc3RhbXApIHtcbiAgICAgICAgdGhpcy5fbG9nKGtleVZhbHVlUGFpcnMsIHRpbWVzdGFtcCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogREVQUkVDQVRFRFxuICAgICAqL1xuICAgIFNwYW4ucHJvdG90eXBlLmxvZ0V2ZW50ID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgcGF5bG9hZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9nKHsgZXZlbnQ6IGV2ZW50TmFtZSwgcGF5bG9hZDogcGF5bG9hZCB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGVuZCB0aW1lc3RhbXAgYW5kIGZpbmFsaXplcyBTcGFuIHN0YXRlLlxuICAgICAqXG4gICAgICogV2l0aCB0aGUgZXhjZXB0aW9uIG9mIGNhbGxzIHRvIFNwYW4uY29udGV4dCgpICh3aGljaCBhcmUgYWx3YXlzIGFsbG93ZWQpLFxuICAgICAqIGZpbmlzaCgpIG11c3QgYmUgdGhlIGxhc3QgY2FsbCBtYWRlIHRvIGFueSBzcGFuIGluc3RhbmNlLCBhbmQgdG8gZG9cbiAgICAgKiBvdGhlcndpc2UgbGVhZHMgdG8gdW5kZWZpbmVkIGJlaGF2aW9yLlxuICAgICAqXG4gICAgICogQHBhcmFtICB7bnVtYmVyfSBmaW5pc2hUaW1lXG4gICAgICogICAgICAgICBPcHRpb25hbCBmaW5pc2ggdGltZSBpbiBtaWxsaXNlY29uZHMgYXMgYSBVbml4IHRpbWVzdGFtcC4gRGVjaW1hbFxuICAgICAqICAgICAgICAgdmFsdWVzIGFyZSBzdXBwb3J0ZWQgZm9yIHRpbWVzdGFtcHMgd2l0aCBzdWItbWlsbGlzZWNvbmQgYWNjdXJhY3kuXG4gICAgICogICAgICAgICBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgY3VycmVudCB0aW1lIChhcyBkZWZpbmVkIGJ5IHRoZVxuICAgICAqICAgICAgICAgaW1wbGVtZW50YXRpb24pIHdpbGwgYmUgdXNlZC5cbiAgICAgKi9cbiAgICBTcGFuLnByb3RvdHlwZS5maW5pc2ggPSBmdW5jdGlvbiAoZmluaXNoVGltZSkge1xuICAgICAgICB0aGlzLl9maW5pc2goZmluaXNoVGltZSk7XG4gICAgICAgIC8vIERvIG5vdCByZXR1cm4gYHRoaXNgLiBUaGUgU3BhbiBnZW5lcmFsbHkgc2hvdWxkIG5vdCBiZSB1c2VkIGFmdGVyIGl0XG4gICAgICAgIC8vIGlzIGZpbmlzaGVkIHNvIGNoYWluaW5nIGlzIG5vdCBkZXNpcmVkIGluIHRoaXMgY29udGV4dC5cbiAgICB9O1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cbiAgICAvLyBEZXJpdmVkIGNsYXNzZXMgY2FuIGNob29zZSB0byBpbXBsZW1lbnQgdGhlIGJlbG93XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuICAgIC8vIEJ5IGRlZmF1bHQgcmV0dXJucyBhIG5vLW9wIFNwYW5Db250ZXh0LlxuICAgIFNwYW4ucHJvdG90eXBlLl9jb250ZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbm9vcC5zcGFuQ29udGV4dDtcbiAgICB9O1xuICAgIC8vIEJ5IGRlZmF1bHQgcmV0dXJucyBhIG5vLW9wIHRyYWNlci5cbiAgICAvL1xuICAgIC8vIFRoZSBiYXNlIGNsYXNzIGNvdWxkIHN0b3JlIHRoZSB0cmFjZXIgdGhhdCBjcmVhdGVkIGl0LCBidXQgaXQgZG9lcyBub3RcbiAgICAvLyBpbiBvcmRlciB0byBlbnN1cmUgdGhlIG5vLW9wIHNwYW4gaW1wbGVtZW50YXRpb24gaGFzIHplcm8gbWVtYmVycyxcbiAgICAvLyB3aGljaCBhbGxvd3MgVjggdG8gYWdncmVzc2l2ZWx5IG9wdGltaXplIGNhbGxzIHRvIHN1Y2ggb2JqZWN0cy5cbiAgICBTcGFuLnByb3RvdHlwZS5fdHJhY2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbm9vcC50cmFjZXI7XG4gICAgfTtcbiAgICAvLyBCeSBkZWZhdWx0IGRvZXMgbm90aGluZ1xuICAgIFNwYW4ucHJvdG90eXBlLl9zZXRPcGVyYXRpb25OYW1lID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB9O1xuICAgIC8vIEJ5IGRlZmF1bHQgZG9lcyBub3RoaW5nXG4gICAgU3Bhbi5wcm90b3R5cGUuX3NldEJhZ2dhZ2VJdGVtID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICB9O1xuICAgIC8vIEJ5IGRlZmF1bHQgZG9lcyBub3RoaW5nXG4gICAgU3Bhbi5wcm90b3R5cGUuX2dldEJhZ2dhZ2VJdGVtID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgLy8gQnkgZGVmYXVsdCBkb2VzIG5vdGhpbmdcbiAgICAvL1xuICAgIC8vIE5PVEU6IGJvdGggc2V0VGFnKCkgYW5kIGFkZFRhZ3MoKSBtYXAgdG8gdGhpcyBmdW5jdGlvbi4ga2V5VmFsdWVQYWlyc1xuICAgIC8vIHdpbGwgYWx3YXlzIGJlIGFuIGFzc29jaWF0aXZlIGFycmF5LlxuICAgIFNwYW4ucHJvdG90eXBlLl9hZGRUYWdzID0gZnVuY3Rpb24gKGtleVZhbHVlUGFpcnMpIHtcbiAgICB9O1xuICAgIC8vIEJ5IGRlZmF1bHQgZG9lcyBub3RoaW5nXG4gICAgU3Bhbi5wcm90b3R5cGUuX2xvZyA9IGZ1bmN0aW9uIChrZXlWYWx1ZVBhaXJzLCB0aW1lc3RhbXApIHtcbiAgICB9O1xuICAgIC8vIEJ5IGRlZmF1bHQgZG9lcyBub3RoaW5nXG4gICAgLy9cbiAgICAvLyBmaW5pc2hUaW1lIGlzIGV4cGVjdGVkIHRvIGJlIGVpdGhlciBhIG51bWJlciBvciB1bmRlZmluZWQuXG4gICAgU3Bhbi5wcm90b3R5cGUuX2ZpbmlzaCA9IGZ1bmN0aW9uIChmaW5pc2hUaW1lKSB7XG4gICAgfTtcbiAgICByZXR1cm4gU3Bhbjtcbn0oKSk7XG5leHBvcnRzLlNwYW4gPSBTcGFuO1xuZXhwb3J0cy5kZWZhdWx0ID0gU3Bhbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNwYW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4vKipcbiAqIFNwYW5Db250ZXh0IHJlcHJlc2VudHMgU3BhbiBzdGF0ZSB0aGF0IG11c3QgcHJvcGFnYXRlIHRvIGRlc2NlbmRhbnQgU3BhbnNcbiAqIGFuZCBhY3Jvc3MgcHJvY2VzcyBib3VuZGFyaWVzLlxuICpcbiAqIFNwYW5Db250ZXh0IGlzIGxvZ2ljYWxseSBkaXZpZGVkIGludG8gdHdvIHBpZWNlczogdGhlIHVzZXItbGV2ZWwgXCJCYWdnYWdlXCJcbiAqIChzZWUgc2V0QmFnZ2FnZUl0ZW0gYW5kIGdldEJhZ2dhZ2VJdGVtKSB0aGF0IHByb3BhZ2F0ZXMgYWNyb3NzIFNwYW5cbiAqIGJvdW5kYXJpZXMgYW5kIGFueSBUcmFjZXItaW1wbGVtZW50YXRpb24tc3BlY2lmaWMgZmllbGRzIHRoYXQgYXJlIG5lZWRlZCB0b1xuICogaWRlbnRpZnkgb3Igb3RoZXJ3aXNlIGNvbnRleHR1YWxpemUgdGhlIGFzc29jaWF0ZWQgU3BhbiBpbnN0YW5jZSAoZS5nLiwgYVxuICogPHRyYWNlX2lkLCBzcGFuX2lkLCBzYW1wbGVkPiB0dXBsZSkuXG4gKi9cbnZhciBTcGFuQ29udGV4dCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTcGFuQ29udGV4dCgpIHtcbiAgICB9XG4gICAgcmV0dXJuIFNwYW5Db250ZXh0O1xufSgpKTtcbmV4cG9ydHMuU3BhbkNvbnRleHQgPSBTcGFuQ29udGV4dDtcbmV4cG9ydHMuZGVmYXVsdCA9IFNwYW5Db250ZXh0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3Bhbl9jb250ZXh0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEZ1bmN0aW9ucyA9IHJlcXVpcmUoXCIuL2Z1bmN0aW9uc1wiKTtcbnZhciBOb29wID0gcmVxdWlyZShcIi4vbm9vcFwiKTtcbnZhciBzcGFuXzEgPSByZXF1aXJlKFwiLi9zcGFuXCIpO1xuLyoqXG4gKiBUcmFjZXIgaXMgdGhlIGVudHJ5LXBvaW50IGJldHdlZW4gdGhlIGluc3RydW1lbnRhdGlvbiBBUEkgYW5kIHRoZSB0cmFjaW5nXG4gKiBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBUaGUgZGVmYXVsdCBvYmplY3QgYWN0cyBhcyBhIG5vLW9wIGltcGxlbWVudGF0aW9uLlxuICpcbiAqIE5vdGUgdG8gaW1wbGVtZW50YXRvcnM6IGRlcml2ZWQgY2xhc3NlcyBjYW4gY2hvb3NlIHRvIGRpcmVjdGx5IGltcGxlbWVudCB0aGVcbiAqIG1ldGhvZHMgaW4gdGhlIFwiT3BlblRyYWNpbmcgQVBJIG1ldGhvZHNcIiBzZWN0aW9uLCBvciBvcHRpb25hbGx5IHRoZSBzdWJzZXQgb2ZcbiAqIHVuZGVyc2NvcmUtcHJlZml4ZWQgbWV0aG9kcyB0byBwaWNrIHVwIHRoZSBhcmd1bWVudCBjaGVja2luZyBhbmQgaGFuZGxpbmdcbiAqIGF1dG9tYXRpY2FsbHkgZnJvbSB0aGUgYmFzZSBjbGFzcy5cbiAqL1xudmFyIFRyYWNlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBUcmFjZXIoKSB7XG4gICAgfVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cbiAgICAvLyBPcGVuVHJhY2luZyBBUEkgbWV0aG9kc1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cbiAgICAvKipcbiAgICAgKiBTdGFydHMgYW5kIHJldHVybnMgYSBuZXcgU3BhbiByZXByZXNlbnRpbmcgYSBsb2dpY2FsIHVuaXQgb2Ygd29yay5cbiAgICAgKlxuICAgICAqIEZvciBleGFtcGxlOlxuICAgICAqXG4gICAgICogICAgIC8vIFN0YXJ0IGEgbmV3IChwYXJlbnRsZXNzKSByb290IFNwYW46XG4gICAgICogICAgIHZhciBwYXJlbnQgPSBUcmFjZXIuc3RhcnRTcGFuKCdEb1dvcmsnKTtcbiAgICAgKlxuICAgICAqICAgICAvLyBTdGFydCBhIG5ldyAoY2hpbGQpIFNwYW46XG4gICAgICogICAgIHZhciBjaGlsZCA9IFRyYWNlci5zdGFydFNwYW4oJ2xvYWQtZnJvbS1kYicsIHtcbiAgICAgKiAgICAgICAgIGNoaWxkT2Y6IHBhcmVudC5jb250ZXh0KCksXG4gICAgICogICAgIH0pO1xuICAgICAqXG4gICAgICogICAgIC8vIFN0YXJ0IGEgbmV3IGFzeW5jIChGb2xsb3dzRnJvbSkgU3BhbjpcbiAgICAgKiAgICAgdmFyIGNoaWxkID0gVHJhY2VyLnN0YXJ0U3BhbignYXN5bmMtY2FjaGUtd3JpdGUnLCB7XG4gICAgICogICAgICAgICByZWZlcmVuY2VzOiBbXG4gICAgICogICAgICAgICAgICAgb3BlbnRyYWNpbmcuZm9sbG93c0Zyb20ocGFyZW50LmNvbnRleHQoKSlcbiAgICAgKiAgICAgICAgIF0sXG4gICAgICogICAgIH0pO1xuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgb3BlcmF0aW9uIChSRVFVSVJFRCkuXG4gICAgICogQHBhcmFtIHtTcGFuT3B0aW9uc30gW29wdGlvbnNdIC0gb3B0aW9ucyBmb3IgdGhlIG5ld2x5IGNyZWF0ZWQgc3Bhbi5cbiAgICAgKiBAcmV0dXJuIHtTcGFufSAtIGEgbmV3IFNwYW4gb2JqZWN0LlxuICAgICAqL1xuICAgIFRyYWNlci5wcm90b3R5cGUuc3RhcnRTcGFuID0gZnVuY3Rpb24gKG5hbWUsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cbiAgICAgICAgLy8gQ29udmVydCBvcHRpb25zLmNoaWxkT2YgdG8gZmllbGRzLnJlZmVyZW5jZXMgYXMgbmVlZGVkLlxuICAgICAgICBpZiAob3B0aW9ucy5jaGlsZE9mKSB7XG4gICAgICAgICAgICAvLyBDb252ZXJ0IGZyb20gYSBTcGFuIG9yIGEgU3BhbkNvbnRleHQgaW50byBhIFJlZmVyZW5jZS5cbiAgICAgICAgICAgIHZhciBjaGlsZE9mID0gRnVuY3Rpb25zLmNoaWxkT2Yob3B0aW9ucy5jaGlsZE9mKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnJlZmVyZW5jZXMpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLnJlZmVyZW5jZXMucHVzaChjaGlsZE9mKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMucmVmZXJlbmNlcyA9IFtjaGlsZE9mXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSAob3B0aW9ucy5jaGlsZE9mKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fc3RhcnRTcGFuKG5hbWUsIG9wdGlvbnMpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSW5qZWN0cyB0aGUgZ2l2ZW4gU3BhbkNvbnRleHQgaW5zdGFuY2UgZm9yIGNyb3NzLXByb2Nlc3MgcHJvcGFnYXRpb25cbiAgICAgKiB3aXRoaW4gYGNhcnJpZXJgLiBUaGUgZXhwZWN0ZWQgdHlwZSBvZiBgY2FycmllcmAgZGVwZW5kcyBvbiB0aGUgdmFsdWUgb2ZcbiAgICAgKiBgZm9ybWF0LlxuICAgICAqXG4gICAgICogT3BlblRyYWNpbmcgZGVmaW5lcyBhIGNvbW1vbiBzZXQgb2YgYGZvcm1hdGAgdmFsdWVzIChzZWVcbiAgICAgKiBGT1JNQVRfVEVYVF9NQVAsIEZPUk1BVF9IVFRQX0hFQURFUlMsIGFuZCBGT1JNQVRfQklOQVJZKSwgYW5kIGVhY2ggaGFzXG4gICAgICogYW4gZXhwZWN0ZWQgY2FycmllciB0eXBlLlxuICAgICAqXG4gICAgICogQ29uc2lkZXIgdGhpcyBwc2V1ZG9jb2RlIGV4YW1wbGU6XG4gICAgICpcbiAgICAgKiAgICAgdmFyIGNsaWVudFNwYW4gPSAuLi47XG4gICAgICogICAgIC4uLlxuICAgICAqICAgICAvLyBJbmplY3QgY2xpZW50U3BhbiBpbnRvIGEgdGV4dCBjYXJyaWVyLlxuICAgICAqICAgICB2YXIgaGVhZGVyc0NhcnJpZXIgPSB7fTtcbiAgICAgKiAgICAgVHJhY2VyLmluamVjdChjbGllbnRTcGFuLmNvbnRleHQoKSwgVHJhY2VyLkZPUk1BVF9IVFRQX0hFQURFUlMsIGhlYWRlcnNDYXJyaWVyKTtcbiAgICAgKiAgICAgLy8gSW5jb3Jwb3JhdGUgdGhlIHRleHRDYXJyaWVyIGludG8gdGhlIG91dGJvdW5kIEhUVFAgcmVxdWVzdCBoZWFkZXJcbiAgICAgKiAgICAgLy8gbWFwLlxuICAgICAqICAgICBPYmplY3QuYXNzaWduKG91dGJvdW5kSFRUUFJlcS5oZWFkZXJzLCBoZWFkZXJzQ2Fycmllcik7XG4gICAgICogICAgIC8vIC4uLiBzZW5kIHRoZSBodHRwUmVxXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtTcGFuQ29udGV4dH0gc3BhbkNvbnRleHQgLSB0aGUgU3BhbkNvbnRleHQgdG8gaW5qZWN0IGludG8gdGhlXG4gICAgICogICAgICAgICBjYXJyaWVyIG9iamVjdC4gQXMgYSBjb252ZW5pZW5jZSwgYSBTcGFuIGluc3RhbmNlIG1heSBiZSBwYXNzZWRcbiAgICAgKiAgICAgICAgIGluIGluc3RlYWQgKGluIHdoaWNoIGNhc2UgaXRzIC5jb250ZXh0KCkgaXMgdXNlZCBmb3IgdGhlXG4gICAgICogICAgICAgICBpbmplY3QoKSkuXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBmb3JtYXQgLSB0aGUgZm9ybWF0IG9mIHRoZSBjYXJyaWVyLlxuICAgICAqIEBwYXJhbSAge2FueX0gY2FycmllciAtIHNlZSB0aGUgZG9jdW1lbnRhdGlvbiBmb3IgdGhlIGNob3NlbiBgZm9ybWF0YFxuICAgICAqICAgICAgICAgZm9yIGEgZGVzY3JpcHRpb24gb2YgdGhlIGNhcnJpZXIgb2JqZWN0LlxuICAgICAqL1xuICAgIFRyYWNlci5wcm90b3R5cGUuaW5qZWN0ID0gZnVuY3Rpb24gKHNwYW5Db250ZXh0LCBmb3JtYXQsIGNhcnJpZXIpIHtcbiAgICAgICAgLy8gQWxsb3cgdGhlIHVzZXIgdG8gcGFzcyBhIFNwYW4gaW5zdGVhZCBvZiBhIFNwYW5Db250ZXh0XG4gICAgICAgIGlmIChzcGFuQ29udGV4dCBpbnN0YW5jZW9mIHNwYW5fMS5kZWZhdWx0KSB7XG4gICAgICAgICAgICBzcGFuQ29udGV4dCA9IHNwYW5Db250ZXh0LmNvbnRleHQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5faW5qZWN0KHNwYW5Db250ZXh0LCBmb3JtYXQsIGNhcnJpZXIpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIFNwYW5Db250ZXh0IGluc3RhbmNlIGV4dHJhY3RlZCBmcm9tIGBjYXJyaWVyYCBpbiB0aGUgZ2l2ZW5cbiAgICAgKiBgZm9ybWF0YC5cbiAgICAgKlxuICAgICAqIE9wZW5UcmFjaW5nIGRlZmluZXMgYSBjb21tb24gc2V0IG9mIGBmb3JtYXRgIHZhbHVlcyAoc2VlXG4gICAgICogRk9STUFUX1RFWFRfTUFQLCBGT1JNQVRfSFRUUF9IRUFERVJTLCBhbmQgRk9STUFUX0JJTkFSWSksIGFuZCBlYWNoIGhhc1xuICAgICAqIGFuIGV4cGVjdGVkIGNhcnJpZXIgdHlwZS5cbiAgICAgKlxuICAgICAqIENvbnNpZGVyIHRoaXMgcHNldWRvY29kZSBleGFtcGxlOlxuICAgICAqXG4gICAgICogICAgIC8vIFVzZSB0aGUgaW5ib3VuZCBIVFRQIHJlcXVlc3QncyBoZWFkZXJzIGFzIGEgdGV4dCBtYXAgY2Fycmllci5cbiAgICAgKiAgICAgdmFyIGhlYWRlcnNDYXJyaWVyID0gaW5ib3VuZEhUVFBSZXEuaGVhZGVycztcbiAgICAgKiAgICAgdmFyIHdpcmVDdHggPSBUcmFjZXIuZXh0cmFjdChUcmFjZXIuRk9STUFUX0hUVFBfSEVBREVSUywgaGVhZGVyc0NhcnJpZXIpO1xuICAgICAqICAgICB2YXIgc2VydmVyU3BhbiA9IFRyYWNlci5zdGFydFNwYW4oJy4uLicsIHsgY2hpbGRPZiA6IHdpcmVDdHggfSk7XG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGZvcm1hdCAtIHRoZSBmb3JtYXQgb2YgdGhlIGNhcnJpZXIuXG4gICAgICogQHBhcmFtICB7YW55fSBjYXJyaWVyIC0gdGhlIHR5cGUgb2YgdGhlIGNhcnJpZXIgb2JqZWN0IGlzIGRldGVybWluZWQgYnlcbiAgICAgKiAgICAgICAgIHRoZSBmb3JtYXQuXG4gICAgICogQHJldHVybiB7U3BhbkNvbnRleHR9XG4gICAgICogICAgICAgICBUaGUgZXh0cmFjdGVkIFNwYW5Db250ZXh0LCBvciBudWxsIGlmIG5vIHN1Y2ggU3BhbkNvbnRleHQgY291bGRcbiAgICAgKiAgICAgICAgIGJlIGZvdW5kIGluIGBjYXJyaWVyYFxuICAgICAqL1xuICAgIFRyYWNlci5wcm90b3R5cGUuZXh0cmFjdCA9IGZ1bmN0aW9uIChmb3JtYXQsIGNhcnJpZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V4dHJhY3QoZm9ybWF0LCBjYXJyaWVyKTtcbiAgICB9O1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cbiAgICAvLyBEZXJpdmVkIGNsYXNzZXMgY2FuIGNob29zZSB0byBpbXBsZW1lbnQgdGhlIGJlbG93XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuICAgIC8vIE5PVEU6IHRoZSBpbnB1dCB0byB0aGlzIG1ldGhvZCBpcyAqYWx3YXlzKiBhbiBhc3NvY2lhdGl2ZSBhcnJheS4gVGhlXG4gICAgLy8gcHVibGljLWZhY2luZyBzdGFydFNwYW4oKSBtZXRob2Qgbm9ybWFsaXplcyB0aGUgYXJndW1lbnRzIHNvIHRoYXRcbiAgICAvLyBhbGwgTiBpbXBsZW1lbnRhdGlvbnMgZG8gbm90IG5lZWQgdG8gd29ycnkgYWJvdXQgdmFyaWF0aW9ucyBpbiB0aGUgY2FsbFxuICAgIC8vIHNpZ25hdHVyZS5cbiAgICAvL1xuICAgIC8vIFRoZSBkZWZhdWx0IGJlaGF2aW9yIHJldHVybnMgYSBuby1vcCBzcGFuLlxuICAgIFRyYWNlci5wcm90b3R5cGUuX3N0YXJ0U3BhbiA9IGZ1bmN0aW9uIChuYW1lLCBmaWVsZHMpIHtcbiAgICAgICAgcmV0dXJuIE5vb3Auc3BhbjtcbiAgICB9O1xuICAgIC8vIFRoZSBkZWZhdWx0IGJlaGF2aW9yIGlzIGEgbm8tb3AuXG4gICAgVHJhY2VyLnByb3RvdHlwZS5faW5qZWN0ID0gZnVuY3Rpb24gKHNwYW5Db250ZXh0LCBmb3JtYXQsIGNhcnJpZXIpIHtcbiAgICB9O1xuICAgIC8vIFRoZSBkZWZhdWx0IGJlaGF2aW9yIGlzIHRvIHJldHVybiBhIG5vLW9wIFNwYW5Db250ZXh0LlxuICAgIFRyYWNlci5wcm90b3R5cGUuX2V4dHJhY3QgPSBmdW5jdGlvbiAoZm9ybWF0LCBjYXJyaWVyKSB7XG4gICAgICAgIHJldHVybiBOb29wLnNwYW5Db250ZXh0O1xuICAgIH07XG4gICAgcmV0dXJuIFRyYWNlcjtcbn0oKSk7XG5leHBvcnRzLlRyYWNlciA9IFRyYWNlcjtcbmV4cG9ydHMuZGVmYXVsdCA9IFRyYWNlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRyYWNlci5qcy5tYXAiLCIvKipcbiAqIEB0aGlzIHtQcm9taXNlfVxuICovXG5mdW5jdGlvbiBmaW5hbGx5Q29uc3RydWN0b3IoY2FsbGJhY2spIHtcbiAgdmFyIGNvbnN0cnVjdG9yID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgcmV0dXJuIHRoaXMudGhlbihcbiAgICBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlc29sdmUoY2FsbGJhY2soKSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5yZXNvbHZlKGNhbGxiYWNrKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlamVjdChyZWFzb24pO1xuICAgICAgfSk7XG4gICAgfVxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmaW5hbGx5Q29uc3RydWN0b3I7XG4iLCJpbXBvcnQgcHJvbWlzZUZpbmFsbHkgZnJvbSAnLi9maW5hbGx5JztcblxuLy8gU3RvcmUgc2V0VGltZW91dCByZWZlcmVuY2Ugc28gcHJvbWlzZS1wb2x5ZmlsbCB3aWxsIGJlIHVuYWZmZWN0ZWQgYnlcbi8vIG90aGVyIGNvZGUgbW9kaWZ5aW5nIHNldFRpbWVvdXQgKGxpa2Ugc2lub24udXNlRmFrZVRpbWVycygpKVxudmFyIHNldFRpbWVvdXRGdW5jID0gc2V0VGltZW91dDtcblxuZnVuY3Rpb24gaXNBcnJheSh4KSB7XG4gIHJldHVybiBCb29sZWFuKHggJiYgdHlwZW9mIHgubGVuZ3RoICE9PSAndW5kZWZpbmVkJyk7XG59XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG4vLyBQb2x5ZmlsbCBmb3IgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRcbmZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICovXG5mdW5jdGlvbiBQcm9taXNlKGZuKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBQcm9taXNlKSlcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9taXNlcyBtdXN0IGJlIGNvbnN0cnVjdGVkIHZpYSBuZXcnKTtcbiAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykgdGhyb3cgbmV3IFR5cGVFcnJvcignbm90IGEgZnVuY3Rpb24nKTtcbiAgLyoqIEB0eXBlIHshbnVtYmVyfSAqL1xuICB0aGlzLl9zdGF0ZSA9IDA7XG4gIC8qKiBAdHlwZSB7IWJvb2xlYW59ICovXG4gIHRoaXMuX2hhbmRsZWQgPSBmYWxzZTtcbiAgLyoqIEB0eXBlIHtQcm9taXNlfHVuZGVmaW5lZH0gKi9cbiAgdGhpcy5fdmFsdWUgPSB1bmRlZmluZWQ7XG4gIC8qKiBAdHlwZSB7IUFycmF5PCFGdW5jdGlvbj59ICovXG4gIHRoaXMuX2RlZmVycmVkcyA9IFtdO1xuXG4gIGRvUmVzb2x2ZShmbiwgdGhpcyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZShzZWxmLCBkZWZlcnJlZCkge1xuICB3aGlsZSAoc2VsZi5fc3RhdGUgPT09IDMpIHtcbiAgICBzZWxmID0gc2VsZi5fdmFsdWU7XG4gIH1cbiAgaWYgKHNlbGYuX3N0YXRlID09PSAwKSB7XG4gICAgc2VsZi5fZGVmZXJyZWRzLnB1c2goZGVmZXJyZWQpO1xuICAgIHJldHVybjtcbiAgfVxuICBzZWxmLl9oYW5kbGVkID0gdHJ1ZTtcbiAgUHJvbWlzZS5faW1tZWRpYXRlRm4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNiID0gc2VsZi5fc3RhdGUgPT09IDEgPyBkZWZlcnJlZC5vbkZ1bGZpbGxlZCA6IGRlZmVycmVkLm9uUmVqZWN0ZWQ7XG4gICAgaWYgKGNiID09PSBudWxsKSB7XG4gICAgICAoc2VsZi5fc3RhdGUgPT09IDEgPyByZXNvbHZlIDogcmVqZWN0KShkZWZlcnJlZC5wcm9taXNlLCBzZWxmLl92YWx1ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciByZXQ7XG4gICAgdHJ5IHtcbiAgICAgIHJldCA9IGNiKHNlbGYuX3ZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlc29sdmUoZGVmZXJyZWQucHJvbWlzZSwgcmV0KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmUoc2VsZiwgbmV3VmFsdWUpIHtcbiAgdHJ5IHtcbiAgICAvLyBQcm9taXNlIFJlc29sdXRpb24gUHJvY2VkdXJlOiBodHRwczovL2dpdGh1Yi5jb20vcHJvbWlzZXMtYXBsdXMvcHJvbWlzZXMtc3BlYyN0aGUtcHJvbWlzZS1yZXNvbHV0aW9uLXByb2NlZHVyZVxuICAgIGlmIChuZXdWYWx1ZSA9PT0gc2VsZilcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZSBjYW5ub3QgYmUgcmVzb2x2ZWQgd2l0aCBpdHNlbGYuJyk7XG4gICAgaWYgKFxuICAgICAgbmV3VmFsdWUgJiZcbiAgICAgICh0eXBlb2YgbmV3VmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICApIHtcbiAgICAgIHZhciB0aGVuID0gbmV3VmFsdWUudGhlbjtcbiAgICAgIGlmIChuZXdWYWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgc2VsZi5fc3RhdGUgPSAzO1xuICAgICAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICBmaW5hbGUoc2VsZik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZG9SZXNvbHZlKGJpbmQodGhlbiwgbmV3VmFsdWUpLCBzZWxmKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBzZWxmLl9zdGF0ZSA9IDE7XG4gICAgc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBmaW5hbGUoc2VsZik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZWplY3Qoc2VsZiwgZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVqZWN0KHNlbGYsIG5ld1ZhbHVlKSB7XG4gIHNlbGYuX3N0YXRlID0gMjtcbiAgc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgZmluYWxlKHNlbGYpO1xufVxuXG5mdW5jdGlvbiBmaW5hbGUoc2VsZikge1xuICBpZiAoc2VsZi5fc3RhdGUgPT09IDIgJiYgc2VsZi5fZGVmZXJyZWRzLmxlbmd0aCA9PT0gMCkge1xuICAgIFByb21pc2UuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFzZWxmLl9oYW5kbGVkKSB7XG4gICAgICAgIFByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuKHNlbGYuX3ZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzZWxmLl9kZWZlcnJlZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBoYW5kbGUoc2VsZiwgc2VsZi5fZGVmZXJyZWRzW2ldKTtcbiAgfVxuICBzZWxmLl9kZWZlcnJlZHMgPSBudWxsO1xufVxuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBwcm9taXNlKSB7XG4gIHRoaXMub25GdWxmaWxsZWQgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IG51bGw7XG4gIHRoaXMub25SZWplY3RlZCA9IHR5cGVvZiBvblJlamVjdGVkID09PSAnZnVuY3Rpb24nID8gb25SZWplY3RlZCA6IG51bGw7XG4gIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG59XG5cbi8qKlxuICogVGFrZSBhIHBvdGVudGlhbGx5IG1pc2JlaGF2aW5nIHJlc29sdmVyIGZ1bmN0aW9uIGFuZCBtYWtlIHN1cmVcbiAqIG9uRnVsZmlsbGVkIGFuZCBvblJlamVjdGVkIGFyZSBvbmx5IGNhbGxlZCBvbmNlLlxuICpcbiAqIE1ha2VzIG5vIGd1YXJhbnRlZXMgYWJvdXQgYXN5bmNocm9ueS5cbiAqL1xuZnVuY3Rpb24gZG9SZXNvbHZlKGZuLCBzZWxmKSB7XG4gIHZhciBkb25lID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgZm4oXG4gICAgICBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgcmVzb2x2ZShzZWxmLCB2YWx1ZSk7XG4gICAgICB9LFxuICAgICAgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICByZWplY3Qoc2VsZiwgcmVhc29uKTtcbiAgICAgIH1cbiAgICApO1xuICB9IGNhdGNoIChleCkge1xuICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgZG9uZSA9IHRydWU7XG4gICAgcmVqZWN0KHNlbGYsIGV4KTtcbiAgfVxufVxuXG5Qcm9taXNlLnByb3RvdHlwZVsnY2F0Y2gnXSA9IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpIHtcbiAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGVkKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICAvLyBAdHMtaWdub3JlXG4gIHZhciBwcm9tID0gbmV3IHRoaXMuY29uc3RydWN0b3Iobm9vcCk7XG5cbiAgaGFuZGxlKHRoaXMsIG5ldyBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBwcm9tKSk7XG4gIHJldHVybiBwcm9tO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGVbJ2ZpbmFsbHknXSA9IHByb21pc2VGaW5hbGx5O1xuXG5Qcm9taXNlLmFsbCA9IGZ1bmN0aW9uKGFycikge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgaWYgKCFpc0FycmF5KGFycikpIHtcbiAgICAgIHJldHVybiByZWplY3QobmV3IFR5cGVFcnJvcignUHJvbWlzZS5hbGwgYWNjZXB0cyBhbiBhcnJheScpKTtcbiAgICB9XG5cbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFycik7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgdmFyIHJlbWFpbmluZyA9IGFyZ3MubGVuZ3RoO1xuXG4gICAgZnVuY3Rpb24gcmVzKGksIHZhbCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHZhbCAmJiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICB2YXIgdGhlbiA9IHZhbC50aGVuO1xuICAgICAgICAgIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhlbi5jYWxsKFxuICAgICAgICAgICAgICB2YWwsXG4gICAgICAgICAgICAgIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgIHJlcyhpLCB2YWwpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFyZ3NbaV0gPSB2YWw7XG4gICAgICAgIGlmICgtLXJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICAgIHJlc29sdmUoYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIHJlamVjdChleCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXMoaSwgYXJnc1tpXSk7XG4gICAgfVxuICB9KTtcbn07XG5cblByb21pc2UucmVzb2x2ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLmNvbnN0cnVjdG9yID09PSBQcm9taXNlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICByZXNvbHZlKHZhbHVlKTtcbiAgfSk7XG59O1xuXG5Qcm9taXNlLnJlamVjdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICByZWplY3QodmFsdWUpO1xuICB9KTtcbn07XG5cblByb21pc2UucmFjZSA9IGZ1bmN0aW9uKGFycikge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgaWYgKCFpc0FycmF5KGFycikpIHtcbiAgICAgIHJldHVybiByZWplY3QobmV3IFR5cGVFcnJvcignUHJvbWlzZS5yYWNlIGFjY2VwdHMgYW4gYXJyYXknKSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKGFycltpXSkudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgIH1cbiAgfSk7XG59O1xuXG4vLyBVc2UgcG9seWZpbGwgZm9yIHNldEltbWVkaWF0ZSBmb3IgcGVyZm9ybWFuY2UgZ2FpbnNcblByb21pc2UuX2ltbWVkaWF0ZUZuID1cbiAgLy8gQHRzLWlnbm9yZVxuICAodHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIGZ1bmN0aW9uKGZuKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBzZXRJbW1lZGlhdGUoZm4pO1xuICAgIH0pIHx8XG4gIGZ1bmN0aW9uKGZuKSB7XG4gICAgc2V0VGltZW91dEZ1bmMoZm4sIDApO1xuICB9O1xuXG5Qcm9taXNlLl91bmhhbmRsZWRSZWplY3Rpb25GbiA9IGZ1bmN0aW9uIF91bmhhbmRsZWRSZWplY3Rpb25GbihlcnIpIHtcbiAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBjb25zb2xlKSB7XG4gICAgY29uc29sZS53YXJuKCdQb3NzaWJsZSBVbmhhbmRsZWQgUHJvbWlzZSBSZWplY3Rpb246JywgZXJyKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFByb21pc2U7XG4iLCIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy8gVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uIChVTUQpIHRvIHN1cHBvcnQgQU1ELCBDb21tb25KUy9Ob2RlLmpzLCBSaGlubywgYW5kIGJyb3dzZXJzLlxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZSgnc3RhY2tmcmFtZScsIFtdLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LlN0YWNrRnJhbWUgPSBmYWN0b3J5KCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGZ1bmN0aW9uIF9pc051bWJlcihuKSB7XG4gICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gU3RhY2tGcmFtZShmdW5jdGlvbk5hbWUsIGFyZ3MsIGZpbGVOYW1lLCBsaW5lTnVtYmVyLCBjb2x1bW5OdW1iZXIsIHNvdXJjZSkge1xuICAgICAgICBpZiAoZnVuY3Rpb25OYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RnVuY3Rpb25OYW1lKGZ1bmN0aW9uTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZ3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRBcmdzKGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWxlTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnNldEZpbGVOYW1lKGZpbGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGluZU51bWJlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnNldExpbmVOdW1iZXIobGluZU51bWJlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbHVtbk51bWJlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnNldENvbHVtbk51bWJlcihjb2x1bW5OdW1iZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzb3VyY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTb3VyY2Uoc291cmNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFN0YWNrRnJhbWUucHJvdG90eXBlID0ge1xuICAgICAgICBnZXRGdW5jdGlvbk5hbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZ1bmN0aW9uTmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0RnVuY3Rpb25OYW1lOiBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgdGhpcy5mdW5jdGlvbk5hbWUgPSBTdHJpbmcodik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0QXJnczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXJncztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0QXJnczogZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodikgIT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmdzIG11c3QgYmUgYW4gQXJyYXknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYXJncyA9IHY7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gTk9URTogUHJvcGVydHkgbmFtZSBtYXkgYmUgbWlzbGVhZGluZyBhcyBpdCBpbmNsdWRlcyB0aGUgcGF0aCxcbiAgICAgICAgLy8gYnV0IGl0IHNvbWV3aGF0IG1pcnJvcnMgVjgncyBKYXZhU2NyaXB0U3RhY2tUcmFjZUFwaVxuICAgICAgICAvLyBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L3dpa2kvSmF2YVNjcmlwdFN0YWNrVHJhY2VBcGkgYW5kIEdlY2tvJ3NcbiAgICAgICAgLy8gaHR0cDovL214ci5tb3ppbGxhLm9yZy9tb3ppbGxhLWNlbnRyYWwvc291cmNlL3hwY29tL2Jhc2UvbnNJRXhjZXB0aW9uLmlkbCMxNFxuICAgICAgICBnZXRGaWxlTmFtZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsZU5hbWU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEZpbGVOYW1lOiBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgdGhpcy5maWxlTmFtZSA9IFN0cmluZyh2KTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRMaW5lTnVtYmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saW5lTnVtYmVyO1xuICAgICAgICB9LFxuICAgICAgICBzZXRMaW5lTnVtYmVyOiBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgaWYgKCFfaXNOdW1iZXIodikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdMaW5lIE51bWJlciBtdXN0IGJlIGEgTnVtYmVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmxpbmVOdW1iZXIgPSBOdW1iZXIodik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Q29sdW1uTnVtYmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW5OdW1iZXI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldENvbHVtbk51bWJlcjogZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgIGlmICghX2lzTnVtYmVyKHYpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ29sdW1uIE51bWJlciBtdXN0IGJlIGEgTnVtYmVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNvbHVtbk51bWJlciA9IE51bWJlcih2KTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRTb3VyY2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0U291cmNlOiBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2UgPSBTdHJpbmcodik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IHRoaXMuZ2V0RnVuY3Rpb25OYW1lKCkgfHwgJ3thbm9ueW1vdXN9JztcbiAgICAgICAgICAgIHZhciBhcmdzID0gJygnICsgKHRoaXMuZ2V0QXJncygpIHx8IFtdKS5qb2luKCcsJykgKyAnKSc7XG4gICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSB0aGlzLmdldEZpbGVOYW1lKCkgPyAoJ0AnICsgdGhpcy5nZXRGaWxlTmFtZSgpKSA6ICcnO1xuICAgICAgICAgICAgdmFyIGxpbmVOdW1iZXIgPSBfaXNOdW1iZXIodGhpcy5nZXRMaW5lTnVtYmVyKCkpID8gKCc6JyArIHRoaXMuZ2V0TGluZU51bWJlcigpKSA6ICcnO1xuICAgICAgICAgICAgdmFyIGNvbHVtbk51bWJlciA9IF9pc051bWJlcih0aGlzLmdldENvbHVtbk51bWJlcigpKSA/ICgnOicgKyB0aGlzLmdldENvbHVtbk51bWJlcigpKSA6ICcnO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uTmFtZSArIGFyZ3MgKyBmaWxlTmFtZSArIGxpbmVOdW1iZXIgKyBjb2x1bW5OdW1iZXI7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIFN0YWNrRnJhbWU7XG59KSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcblx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIG1vZHVsZTsgfTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLyoqXG4gKiBNSVQgTGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNy1wcmVzZW50LCBFbGFzdGljc2VhcmNoIEJWXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqXG4gKi9cblxuaW1wb3J0IHtcbiAgY3JlYXRlU2VydmljZUZhY3RvcnksXG4gIGJvb3RzdHJhcCxcbiAgaXNCcm93c2VyXG59IGZyb20gJ0BlbGFzdGljL2FwbS1ydW0tY29yZSdcbmltcG9ydCBBcG1CYXNlIGZyb20gJy4vYXBtLWJhc2UnXG5cbi8qKlxuICogVXNlIGEgc2luZ2xlIGluc3RhbmNlIG9mIEFwbUJhc2UgYWNyb3NzIGFsbCBpbnN0YW5jZSBvZiB0aGUgYWdlbnRcbiAqIGluY2x1ZGluZyB0aGUgaW5zdGFuY2VzIHVzZWQgaW4gZnJhbWV3b3JrIHNwZWNpZmljIGludGVncmF0aW9uc1xuICovXG5mdW5jdGlvbiBnZXRBcG1CYXNlKCkge1xuICBpZiAoaXNCcm93c2VyICYmIHdpbmRvdy5lbGFzdGljQXBtKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5lbGFzdGljQXBtXG4gIH1cbiAgY29uc3QgZW5hYmxlZCA9IGJvb3RzdHJhcCgpXG4gIGNvbnN0IHNlcnZpY2VGYWN0b3J5ID0gY3JlYXRlU2VydmljZUZhY3RvcnkoKVxuICBjb25zdCBhcG1CYXNlID0gbmV3IEFwbUJhc2Uoc2VydmljZUZhY3RvcnksICFlbmFibGVkKVxuXG4gIGlmIChpc0Jyb3dzZXIpIHtcbiAgICB3aW5kb3cuZWxhc3RpY0FwbSA9IGFwbUJhc2VcbiAgfVxuXG4gIHJldHVybiBhcG1CYXNlXG59XG5cbmNvbnN0IGFwbUJhc2UgPSBnZXRBcG1CYXNlKClcblxuY29uc3QgaW5pdCA9IGFwbUJhc2UuaW5pdC5iaW5kKGFwbUJhc2UpXG5cbmV4cG9ydCBkZWZhdWx0IGluaXRcbmV4cG9ydCB7IGluaXQsIGFwbUJhc2UsIEFwbUJhc2UsIGFwbUJhc2UgYXMgYXBtIH1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==