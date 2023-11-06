"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const net_1 = __importDefault(require("net"));
const url_1 = __importDefault(require("url"));
const http_1 = __importDefault(require("http"));
const assert = require('assert');
const debug = require('debug')('proxy');
debug.request = require('debug')('proxy ← ← ←');
debug.response = require('debug')('proxy → → →');
debug.proxyRequest = require('debug')('proxy ↑ ↑ ↑');
debug.proxyResponse = require('debug')('proxy ↓ ↓ ↓');
// hostname
const hostname = require('os').hostname();
/**
 * Sets up an `http.Server` or `https.Server` instance with the necessary
 * "request" and "connect" event listeners in order to make the server act as an
 * HTTP proxy.
 *
 * @param {http.Server|https.Server} proxyServer
 * @param {Object} proxyOptions
 * @api public
 */
function setup(proxyServer, proxyOptions) {
    if (!proxyServer) {
        proxyServer = http_1.default.createServer();
    }
    proxyOptions = proxyOptions || {
        name: 'proxy',
    };
    proxyServer.on('request', (req, res) => {
        onrequest(proxyServer, proxyOptions, req, res);
    });
    proxyServer.on('connect', (req, socket, head) => {
        onconnect(proxyServer, proxyOptions, req, socket, head);
    });
    return proxyServer;
}
exports.setup = setup;
/**
 * 13.5.1 End-to-end and Hop-by-hop Headers
 *
 * Hop-by-hop headers must be removed by the proxy before passing it on to the
 * next endpoint. Per-request basis hop-by-hop headers MUST be listed in a
 * Connection header, (section 14.10) to be introduced into HTTP/1.1 (or later).
 */
let hopByHopHeaders = [
    'Connection',
    'Keep-Alive',
    'Proxy-Authenticate',
    'Proxy-Authorization',
    'TE',
    'Trailers',
    'Transfer-Encoding',
    'Upgrade'
];
// create a case-insensitive RegExp to match "hop by hop" headers
let isHopByHop = new RegExp('^(' + hopByHopHeaders.join('|') + ')$', 'i');
/**
 * Iterator function for the request/response's "headers".
 * Invokes `fn` for "each" header entry in the request.
 *
 * @api private
 */
function eachHeader(obj, fn) {
    if (Array.isArray(obj.rawHeaders)) {
        // ideal scenario... >= node v0.11.x
        // every even entry is a "key", every odd entry is a "value"
        let key = null;
        obj.rawHeaders.forEach(function (v) {
            if (key === null) {
                key = v;
            }
            else {
                fn(key, v);
                key = null;
            }
        });
    }
    else {
        // otherwise we can *only* proxy the header names as lowercase'd
        let headers = obj.headers;
        if (!headers)
            return;
        Object.keys(headers).forEach(function (key) {
            let value = headers[key];
            if (Array.isArray(value)) {
                // set-cookie
                value.forEach(function (val) {
                    fn(key, val);
                });
            }
            else {
                fn(key, value);
            }
        });
    }
}
/**
 * HTTP GET/POST/DELETE/PUT, etc. proxy requests.
 */
function onrequest(proxyServer, proxyOptions, req, res) {
    debug.request('%s %s HTTP/%s ', req.method, req.url, req.httpVersion);
    let socket = req.socket;
    // pause the socket during authentication so no data is lost
    socket.pause();
    authenticate(proxyServer, req, function (err, auth) {
        socket.resume();
        if (err) {
            // an error occured during login!
            res.writeHead(500);
            res.end((err.stack || err.message || err) + '\n');
            return;
        }
        if (!auth) {
            return requestAuthorization(req, res);
        }
        let parsed = url_1.default.parse(req.url);
        if ('http:' != parsed.protocol) {
            // only "http://" is supported, "https://" should use CONNECT method
            res.writeHead(400);
            res.end('Only "http:" protocol prefix is supported\n');
            return;
        }
        // Proxy Request Options
        let options = {
            method: req.method,
            ...parsed,
        };
        if (proxyServer.localAddress) {
            options.localAddress = proxyServer.localAddress;
        }
        // ProxyReq Options
        const headers = options.headers = {};
        const via = `1.1 ${hostname} (${proxyOptions.name})`;
        let hasXForwardedFor = false;
        let hasVia = false;
        eachHeader(req, function (key, value) {
            debug.request('Request Header: "%s: %s"', key, value);
            let keyLower = key.toLowerCase();
            if (!hasXForwardedFor && 'x-forwarded-for' === keyLower) {
                // append to existing "X-Forwarded-For" header
                // http://en.wikipedia.org/wiki/X-Forwarded-For
                hasXForwardedFor = true;
                value += ', ' + socket.remoteAddress;
                debug.proxyRequest('appending to existing "%s" header: "%s"', key, value);
            }
            if (!hasVia && 'via' === keyLower) {
                // append to existing "Via" header
                hasVia = true;
                value += ', ' + via;
                debug.proxyRequest('appending to existing "%s" header: "%s"', key, value);
            }
            if (isHopByHop.test(key)) {
                debug.proxyRequest('ignoring hop-by-hop header "%s"', key);
            }
            else {
                let v = headers[key];
                if (Array.isArray(v)) {
                    v.push(value);
                }
                else if (null != v) {
                    headers[key] = [v, value];
                }
                else {
                    headers[key] = value;
                }
            }
        });
        // add "X-Forwarded-For" header if it's still not here by now
        // http://en.wikipedia.org/wiki/X-Forwarded-For
        if (!hasXForwardedFor) {
            headers['X-Forwarded-For'] = socket.remoteAddress;
            debug.proxyRequest('adding new "X-Forwarded-For" header: "%s"', headers['X-Forwarded-For']);
        }
        // add "Via" header if still not set by now
        if (!hasVia) {
            headers['Via'] = via;
            debug.proxyRequest('adding new "Via" header: "%s"', headers['Via']);
        }
        let gotResponse = false;
        let proxyReq = http_1.default.request(options);
        debug.proxyRequest('%s %s HTTP/1.1 ', proxyReq.method, proxyReq.path);
        proxyReq.on('response', function (proxyRes) {
            debug.proxyResponse('HTTP/1.1 %s', proxyRes.statusCode);
            gotResponse = true;
            const headers = {};
            eachHeader(proxyRes, function (key, value) {
                debug.proxyResponse('Proxy Response Header: "%s: %s"', key, value);
                if (isHopByHop.test(key)) {
                    debug.response('ignoring hop-by-hop header "%s"', key);
                }
                else {
                    let v = headers[key];
                    if (Array.isArray(v)) {
                        v.push(value);
                    }
                    else if (null != v) {
                        headers[key] = [v, value];
                    }
                    else {
                        headers[key] = value;
                    }
                }
            });
            debug.response('HTTP/1.1 %s', proxyRes.statusCode);
            res.writeHead(proxyRes.statusCode, headers);
            proxyRes.pipe(res);
            res.on('finish', onfinish);
        });
        proxyReq.on('error', function (err) {
            debug.proxyResponse('proxy HTTP request "error" event\n%s', err.stack || err);
            cleanup();
            if (gotResponse) {
                debug.response('already sent a response, just destroying the socket...');
                socket.destroy();
            }
            else if ('ENOTFOUND' == err.code) {
                debug.response('HTTP/1.1 404 Not Found');
                res.writeHead(404);
                res.end();
            }
            else {
                debug.response('HTTP/1.1 500 Internal Server Error');
                res.writeHead(500);
                res.end();
            }
        });
        // if the client closes the connection prematurely,
        // then close the upstream socket
        function onclose() {
            debug.request('client socket "close" event, aborting HTTP request to "%s"', req.url);
            proxyReq.abort();
            cleanup();
        }
        socket.on('close', onclose);
        function onfinish() {
            debug.response('"finish" event');
            cleanup();
        }
        function cleanup() {
            debug.response('cleanup');
            socket.removeListener('close', onclose);
            res.removeListener('finish', onfinish);
        }
        req.pipe(proxyReq);
    });
}
/**
 * HTTP CONNECT proxy requests.
 */
function onconnect(proxyServer, proxyOptions, req, socket, head) {
    debug.request('%s %s HTTP/%s ', req.method, req.url, req.httpVersion);
    assert(!head || 0 == head.length, '"head" should be empty for proxy requests');
    // create the `res` instance for this request since Node.js
    // doesn't provide us with one :(
    // XXX: this is undocumented API, so it will break some day.
    let res = new http_1.default.ServerResponse(req);
    res.shouldKeepAlive = false;
    res.chunkedEncoding = false;
    res.useChunkedEncodingByDefault = false;
    res.assignSocket(socket);
    // called for the ServerResponse's "finish" event
    // XXX: normally, node's "http" module has a "finish" event listener that would
    // take care of closing the socket once the HTTP response has completed, but
    // since we're making this ServerResponse instance manually, that event handler
    // never gets hooked up, so we must manually close the socket...
    function onfinish() {
        debug.response('response "finish" event');
        res.detachSocket(socket);
        socket.end();
    }
    res.once('finish', onfinish);
    let gotResponse = false;
    // define request socket event listeners
    socket.on('close', function onclientclose() {
        debug.request('HTTP request %s socket "close" event', req.url);
    });
    socket.on('end', function onclientend() {
        debug.request('HTTP request %s socket "end" event', req.url);
    });
    socket.on('error', function onclienterror(err) {
        debug.request('HTTP request %s socket "error" event:\n%s', req.url, err.stack || err);
    });
    // pause the socket during authentication so no data is lost
    socket.pause();
    authenticate(proxyServer, req, function (err, auth) {
        socket.resume();
        if (err) {
            res.writeHead(500);
            res.end((err.stack || err.message || err) + '\n');
            return;
        }
        if (!auth) {
            return requestAuthorization(req, res);
        }
        let parts = req.url.split(':');
        let host = parts[0];
        let port = +parts[1];
        let opts = { host: host, port: port };
        debug.proxyRequest('connecting to proxy target %j', opts);
        const target = net_1.default.connect(opts);
        target.on('connect', () => {
            debug.proxyResponse('proxy target %s "connect" event', req.url);
            debug.response('HTTP/1.1 200 Connection established');
            gotResponse = true;
            res.removeListener('finish', onfinish);
            res.writeHead(200, 'Connection established');
            res.flushHeaders();
            // relinquish control of the `socket` from the ServerResponse instance
            // nullify the ServerResponse object, so that it can be cleaned
            // up before this socket proxying is completed
            res.detachSocket(socket);
            res = null;
            // pipe streams
            socket.pipe(target);
            target.pipe(socket);
        });
        target.on('close', () => {
            debug.proxyResponse('proxy target %s "close" event', req.url);
            socket.destroy();
        });
        target.on('end', () => {
            debug.proxyResponse('proxy target %s "end" event', req.url);
        });
        target.on('error', (err) => {
            debug.proxyResponse('proxy target %s "error" event:\n%s', req.url, err.stack || err);
            if (gotResponse) {
                debug.response('already sent a response, just destroying the socket...');
                socket.destroy();
            }
            else if ('ENOTFOUND' == err.code) {
                debug.response('HTTP/1.1 404 Not Found');
                res.writeHead(404);
                res.end();
            }
            else {
                debug.response('HTTP/1.1 500 Internal Server Error');
                res.writeHead(500);
                res.end();
            }
        });
    });
}
/**
 * Checks `Proxy-Authorization` request headers. Same logic applied to CONNECT
 * requests as well as regular HTTP requests.
 *
 * @param {http.Server} server
 * @param {http.ServerRequest} req
 * @param {Function} fn callback function
 * @api private
 */
function authenticate(server, req, fn) {
    let hasAuthenticate = 'function' == typeof server.authenticate;
    if (hasAuthenticate) {
        debug.request('authenticating request "%s %s"', req.method, req.url);
        server.authenticate(req, fn);
    }
    else {
        // no `server.authenticate()` function, so just allow the request
        fn(null, true);
    }
}
/**
 * Sends a "407 Proxy Authentication Required" HTTP response to the `socket`.
 *
 * @api private
 */
function requestAuthorization(req, res) {
    // request Basic proxy authorization
    debug.response('requesting proxy authorization for "%s %s"', req.method, req.url);
    // TODO: make "realm" and "type" (Basic) be configurable...
    let realm = 'proxy';
    let headers = {
        'Proxy-Authenticate': 'Basic realm="' + realm + '"'
    };
    res.writeHead(407, headers);
    res.end();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYmFzZS9odHRwL3Byb3h5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDhDQUFzQjtBQUN0Qiw4Q0FBc0I7QUFDdEIsZ0RBQXdCO0FBR3hCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDaEQsS0FBSyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDakQsS0FBSyxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDckQsS0FBSyxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7QUFFdEQsV0FBVztBQUNYLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQVExQzs7Ozs7Ozs7R0FRRztBQUVILFNBQWdCLEtBQUssQ0FBQyxXQUF3QixFQUFFLFlBQTBCO0lBQ3RFLElBQUksQ0FBQyxXQUFXLEVBQUU7UUFDZCxXQUFXLEdBQUcsY0FBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQ3JDO0lBRUQsWUFBWSxHQUFHLFlBQVksSUFBSTtRQUMzQixJQUFJLEVBQUUsT0FBTztLQUNoQixDQUFBO0lBRUQsV0FBVyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDbkMsU0FBUyxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsR0FBRyxFQUFFLEdB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