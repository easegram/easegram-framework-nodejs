"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.sendFile = exports.send = exports.body = exports.webapp = exports.WebApp = void 0;
const https_1 = __importDefault(require("https"));
const http2_1 = __importDefault(require("http2"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const koa2_cors_1 = __importDefault(require("koa2-cors"));
const koa_static_router_1 = __importDefault(require("koa-static-router"));
const body_1 = __importDefault(require("../body"));
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const common_1 = require("../common");
const cop = __importStar(require("../cop"));
const util = __importStar(require("../util"));
;
/**
 * WebApp
 * * Web服务端应用，从Koa继承而来。
 */
class WebApp extends koa_1.default {
    /**
     * https监听。
     */
    listenSafely;
    /**
     * 静态资源服务。
     */
    static;
    /**
     * 路由注册。
     */
    route;
    /**
     * 启动服务
     */
    start;
}
exports.WebApp = WebApp;
/**
 * 创建一个基于koa2的web应用。
*/
const webapp = function (args) {
    args = args || {
        name: 'http',
        host: '127.0.0.1',
        port: 80
    };
    const app = new WebApp();
    app.on('error', (err, ctx) => {
        if (ctx) {
            const req = ctx.request;
            const ua = (0, ua_parser_js_1.default)(ctx.headers['user-agent']);
            const meta = {
                time: Date.now(),
                ip: req.ip,
                protocol: req.protocol.toUpperCase(),
                method: req.method,
                url: req.url,
                device: ua.device,
                cpu: ua.cpu,
                os: ua.os,
                client: ua.browser ? {
                    browser: ua.browser,
                    engine: ua.engine,
                } : null,
            };
            console['meta'] = meta;
        }
        console.error(err);
        console['meta'] = null;
    });
    if (args.proxy) {
        app.proxy = true;
    }
    if (args.log) {
        app.use(async (ctx, next) => {
            let req = ctx.request;
            console.log(`http: ${req.ip} ${req.protocol.toUpperCase()} ${req.method} ${req.url}`);
            return next();
        });
    }
    if (args.cors) {
        app.use((0, koa2_cors_1.default)());
    }
    if (args.body !== false) {
        let bodyType = typeof args.body;
        if (bodyType === 'object') {
            app.use((0, body_1.default)(args.body));
        }
        else if (bodyType === 'function') {
            app.use(args.body);
        }
        else {
            app.use((0, body_1.default)());
        }
    }
    app.listenSafely = function () {
        if (!args.https_cert || !args.https_key) {
            throw (0, common_1.error)('ERR_NOT_IMPLEMENTS', `the method WebApp.listenSafely is not implements, please configure it.`);
        }
        if (args.https_hsts) {
            app.use((ctx, next) => {
                let res = ctx.response;
                res.set("Strict-Transport-Security", "max-age=31536000");
                return next();
            });
        }
        let cert = fs_1.default.readFileSync(util.absolutePath(args.https_cert));
        let key = fs_1.default.readFileSync(util.absolutePath(args.https_key));
        let options = { cert: cert, key: key };
        if (args.http2 === true) {
            let server = http2_1.default.createSecureServer(options, app.callback());
            server.listen.apply(server, arguments);
        }
        else {
            let server = https_1.default.createServer(options, app.callback());
            server.listen.apply(server, arguments);
        }
    };
    app.static = function (...args) {
        app.use((0, koa_static_router_1.default)(args));
    };
    app.route = function (func) {
        let router = new koa_router_1.default();
        router.use(async (ctx, next) => {
            try {
                await next();
            }
            catch (err) {
                ctx.body = cop.make(err, null);
                ctx.app.emit('error', err, ctx);
            }
        });
        if (args.ping) {
            router.post('/_ping', async function (ctx, next) {
                ctx.response.body = cop.make(true);
            });
        }
        func(router);
        app.use(router.routes()).use(router.allowedMethods());
    };
    app.start = function () {
        if (!args) {
            return;
        }
        if (args.host && args.port > 0) {
            app.listen(args.port, args.host, function () {
                console.log(`http service '${args.name}' is listening on ${args.host}:${args.port}`);
            });
        }
        if (args.https_host && args.https_port > 0 && args.https_cert && args.https_key) {
            app.listenSafely(args.https_port, args.https_host, function () {
                console.log(`https service '${args.name}' is listening on ${args.https_host}:${args.https_port}`);
            });
        }
    };
    return app;
};
exports.webapp = webapp;
/**
 * 创建一个body解析器中间件，详细选项设置请参考body模块。
*/
const body = function (options) {
    return (0, body_1.default)(options);
};
exports.body = body;
/**
 * 发送http响应
*/
const send = function (ctx, arg1, arg2) {
    let message = cop.make(arg1, arg2);
    //console.log(`http: send ${JSON.stringify(message)}`);
    ctx.response.body = message;
};
exports.send = send;
/**
 * 发送响应文件。
*/
const sendFile = async function (ctx, filepath, options) {
    let fileext = '';
    if (options.brotli !== false && ctx.acceptsEncodings('br', 'identity') === 'br' && (fs_1.default.existsSync(filepath + '.br'))) {
        ctx.set('Content-Encoding', 'br');
        ctx.res.removeHeader('Content-Length');
        filepath = `${filepath}.br`;
        fileext = '.br';
    }
    else if (options.gzip !== false && ctx.acceptsEncodings('gzip', 'identity') === 'gzip' && (fs_1.default.existsSync(filepath + '.gz'))) {
        ctx.set('Content-Encoding', 'gzip');
        ctx.res.removeHeader('Content-Length');
        filepath = `${filepath}.gz`;
        fileext = '.gz';
    }
    let stats = fs_1.default.statSync(filepath);
    ctx.set('Content-Length', stats.size);
    ctx.set('Last-Modified', stats.mtime.toUTCString());
    if (options.maxAge > 0) {
        const directives = [`max-age=${options.maxAge | 0}`];
        if (options.immutable) {
            directives.push('immutable');
        }
        ctx.set('Cache-Control', directives.join(','));
    }
    if (!ctx.type) {
        let type = function (file, ext) {
            return ext !== '' ? path_1.default.extname(path_1.default.basename(file, ext)) : path_1.default.extname(file);
        };
        ctx.type = type(filepath, fileext);
    }
    ctx.body = fs_1.default.createReadStream(filepath);
};
exports.sendFile = sendFile;
/**
 * 将func函数包装成一个中间件
*/
const handler = function (func) {
    if (typeof (func) !== 'function') {
        throw (0, common_1.error)(`ERR_INVALID_ARGS`, `the type of 'func' is not a 'async function'.`);
    }
    return async function (ctx) {
        let args = {
            ...(ctx.params || {}),
            ...(ctx.request.query || {}),
            ...(ctx.request.body || {}),
        };
        let ret = await func(args);
        (0, exports.send)(ctx, ret);
    };
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2Jhc2UvaHR0cC9zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxrREFBMEI7QUFDMUIsa0RBQTBCO0FBQzFCLDRDQUFvQjtBQUNwQixnREFBd0I7QUFFeEIsOENBQXNCO0FBQ3RCLDREQUFtQztBQUNuQywwREFBZ0M7QUFDaEMsMEVBQWdEO0FBQ2hELG1EQUE4QjtBQUM5QixnRUFBb0M7QUFFcEMsc0NBQWtDO0FBQ2xDLDRDQUE4QjtBQUM5Qiw4Q0FBZ0M7QUEwRS9CLENBQUM7QUFFRjs7O0dBR0c7QUFDSCxNQUFhLE1BQU8sU0FBUSxhQUFHO0lBQzNCOztPQUVHO0lBQ0ksWUFBWSxDQUF5QjtJQUU1Qzs7T0FFRztJQUNJLE1BQU0sQ0FBeUI7SUFFdEM7O09BRUc7SUFDSSxLQUFLLENBQThDO0lBRTFEOztPQUVHO0lBQ0ksS0FBSyxDQUFhO0NBQzVCO0FBcEJELHdCQW9CQztBQUVEOztFQUVFO0FBQ0ssTUFBTSxNQUFNLEdBQUcsVUFBVSxJQUFnQjtJQUM1QyxJQUFJLEdBQUcsSUFBSSxJQUFJO1FBQ1gsSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsV0FBVztRQUNqQixJQUFJLEVBQUUsRUFBRTtLQUNYLENBQUM7SUFFRixNQUFNLEdBQUcsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO0lBRXpCLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQ3pCLElBQUksR0FBRyxFQUFFO1lBQ0wsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUN4QixNQUFNLEVBQUUsR0FBRyxJQUFBLHNCQUFRLEVBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sSUFBSSxHQUFHO2dC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