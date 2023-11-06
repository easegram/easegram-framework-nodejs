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
exports.rpc = exports.makeRPC = exports.call = exports.post = exports.get = exports.request = exports.getRequestOptions = void 0;
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const url_1 = __importDefault(require("url"));
const common_1 = require("../common");
const util = __importStar(require("../util"));
const basic_1 = require("./basic");
/**
 * 将url解析成通用的请求选项参数。
*/
const getRequestOptions = function (optionsOrUrl) {
    if (typeof (optionsOrUrl) === 'object') {
        return optionsOrUrl;
    }
    else if (typeof (optionsOrUrl) === 'string' && optionsOrUrl.length > 0) {
        let urlinfo = url_1.default.parse(optionsOrUrl);
        return {
            hostname: urlinfo.hostname,
            port: urlinfo.port,
            path: urlinfo.path,
            safe: (0, basic_1.isHttps)(optionsOrUrl),
        };
    }
    return null;
};
exports.getRequestOptions = getRequestOptions;
/**
 * 发起一次HTTP请求
*/
const request = async function (options, data) {
    options = options || {};
    options.headers = options.headers || {};
    options.timeout = options.timeout || undefined;
    data = data || {};
    let content_seq = '';
    let content_len = 0;
    if (typeof (data) === 'object') {
        content_seq = JSON.stringify(data);
        content_len = Buffer.byteLength(content_seq, "utf8");
    }
    else if (typeof (data) === 'string' || Buffer.isBuffer(data)) {
        content_seq = data;
        content_len = Buffer.byteLength(content_seq);
    }
    if (options.method === 'GET') {
        options.path = (0, basic_1.combineUrlAndParams)(options.path, data);
    }
    else if (options.method === 'POST') {
        options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
        options.headers['Content-Length'] = content_len;
    }
    let send = async function () {
        return await new Promise(function (resolve, reject) {
            let proto = options.safe ? https_1.default : http_1.default;
            let req = proto.request(options, (res) => {
                return resolve(res);
            });
            req.on('error', function (err) {
                return reject(err);
            });
            req.on('timeout', () => {
                req.abort();
                return resolve(resp({ status: 408, headers: {}, content: {} }));
            });
            if (options.method === 'POST') {
                req.write(content_seq);
            }
            req.end();
        });
    };
    let resp = async function (res) {
        if (res && res.status && res.headers && res.content) {
            return res;
        }
        return await new Promise(function (resolve, reject) {
            let body = [];
            res.on('error', (err) => {
                return reject(err);
            });
            res.on("data", (data) => {
                body.push(data);
            });
            res.on("end", () => {
                try {
                    let contentType = res.headers['content-type'].toLowerCase();
                    let type = '';
                    let charset = 'utf8';
                    if (contentType.indexOf('text') >= 0) {
                        type = 'text';
                    }
                    else if (contentType.indexOf('json') >= 0) {
                        type = 'json';
                    }
                    let content = Buffer.concat(body);
                    if (type === 'text') {
                        content = content.toString(charset);
                    }
                    else if (type === 'json') {
                        content = content.toString(charset);
                        content = JSON.parse(content);
                    }
                    return resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        content: content
                    });
                }
                catch (err) {
                    return reject(err);
                }
            });
        });
    };
    let res = await send();
    let ret = await resp(res);
    return ret;
};
exports.request = request;
/**
 * 发起一次HTTP的GET请求。
*/
const get = async function (args, data) {
    let options = (0, exports.getRequestOptions)(args);
    if (!options) {
        throw (0, common_1.error)('ERR_INVALID_ARGS', 'the args of http.get is invalid.');
    }
    options.method = 'GET';
    return await (0, exports.request)(options, data);
};
exports.get = get;
/**
 * 发起一次HTTP的POST请求。
*/
const post = async function (args, data) {
    let options = (0, exports.getRequestOptions)(args);
    if (!options) {
        throw (0, common_1.error)('ERR_INVALID_ARGS', 'the args of http.post is invalid.');
    }
    options.method = 'POST';
    return await (0, exports.request)(options, data);
};
exports.post = post;
/**
 * 调用一次HTTP接口。HTTP接口统一采用POST方式进行通讯。
*/
const call = async function (args, data) {
    let ret = await (0, exports.post)(args, data);
    if (!ret || ret.status !== 200 || !ret.content) {
        throw (0, common_1.error)(`ERR_HTTP_RPC`, `invoke http rpc failed.`);
    }
    let content = ret.content;
    if (content.result !== 'ok') {
        throw (0, common_1.error)(content.result, content.data);
    }
    return content.data;
};
exports.call = call;
/**
 * 定义一组以base地址开头的接口列表，返回接口对象。接口对象会被转换成驼峰命名。
*/
const makeRPC = function (base, rps) {
    let lm = {};
    Object.keys(rps).forEach(key => {
        let rm = rps[key];
        if (!Array.isArray(rm)) {
            return;
        }
        rm.forEach(rp => {
            let lp = util.camelCase(rp);
            lm[lp] = async function (data) {
                return await (0, exports.call)(`${base}/${key}/${rp}`, data);
            };
        });
    });
    return lm;
};
exports.makeRPC = makeRPC;
/**
 * 定义一组以base地址开头的接口列表，返回接口对象。接口对象会被转换成驼峰命名。
*/
const rpc = function (base, rps) {
    console.warn(`http.rpc is deprecated, please use http.makeRPC instead.`);
    return (0, exports.makeRPC)(base, rps);
};
exports.rpc = rpc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2Jhc2UvaHR0cC9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxnREFBd0I7QUFDeEIsa0RBQTBCO0FBQzFCLDhDQUF5QjtBQUV6QixzQ0FBa0M7QUFDbEMsOENBQWdDO0FBRWhDLG1DQUtpQjtBQUVqQjs7RUFFRTtBQUNLLE1BQU0saUJBQWlCLEdBQUcsVUFBVSxZQUF5QztJQUNoRixJQUFHLE9BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDbEMsT0FBTyxZQUFZLENBQUM7S0FDdkI7U0FDSSxJQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxRQUFRLElBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDcEUsSUFBSSxPQUFPLEdBQUcsYUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN6QyxPQUFPO1lBQ0gsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO1lBQzFCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtZQUNsQixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7WUFDbEIsSUFBSSxFQUFFLElBQUEsZUFBTyxFQUFDLFlBQVksQ0FBQztTQUM5QixDQUFDO0tBQ0w7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDLENBQUM7QUFmVyxRQUFBLGlCQUFpQixxQkFlNUI7QUFFRjs7RUFFRTtBQUNLLE1BQU0sT0FBTyxHQUFHLEtBQUssV0FBVyxPQUEyQixFQUFFLElBQVM7SUFDekUsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7SUFDeEIsT0FBTyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUN4QyxPQUFPLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksU0FBUyxDQUFDO0lB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