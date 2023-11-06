"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const util_1 = __importDefault(require("util"));
const chalk_1 = __importDefault(require("chalk"));
const client_1 = require("./http/client");
const basic_1 = require("./http/basic");
const cache = Symbol('cache');
/**
 * 初始化日志模块
 * @param {string} scope 日志的前缀标签
*/
const init = function (options) {
    let scope, server, handler;
    if (typeof options === 'string') {
        scope = options;
    }
    else {
        scope = options.scope;
        server = options.server;
        handler = options.handler;
    }
    const pad2 = function (val) {
        return val < 10 ? `0${val}` : val;
    };
    const getTime = function () {
        let t = new Date();
        let Y = t.getFullYear();
        let M = pad2(t.getMonth() + 1);
        let D = pad2(t.getDate());
        let h = pad2(t.getHours());
        let m = pad2(t.getMinutes());
        let s = pad2(t.getSeconds());
        return `${Y}-${M}-${D} ${h}:${m}:${s}`;
    };
    const sendLogs = async function (logs) {
        const { appid, secret, url } = server;
        const data = {
            logs,
            scope,
            appid
        };
        data['$_appid'] = appid;
        data['$_sign'] = (0, basic_1.sign)(data, secret);
        return (0, client_1.post)(url, data);
    };
    const configs = {
        log: {
            tag: 'LOG',
            style: chalk_1.default.white
        },
        info: {
            tag: 'INFO',
            style: chalk_1.default.green
        },
        notice: {
            tag: 'NOTICE',
            style: chalk_1.default.blue
        },
        warn: {
            tag: 'WARN',
            style: chalk_1.default.yellow.bold
        },
        error: {
            tag: 'ERROR',
            style: chalk_1.default.red.bold
        }
    };
    const console_log = console.log;
    console[cache] = [];
    for (let x in configs) {
        let cfg = configs[x];
        const time = getTime();
        const tag = cfg.tag;
        console[x] = function () {
            let content = `[${scope}] ${time}|${tag}| ${util_1.default.format.apply(this, arguments)}`;
            console_log(cfg.style(content));
            if (handler) {
                handler(tag, content);
            }
            if (server) {
                console[cache].push({
                    time,
                    tag,
                    meta: console['meta'] || undefined,
                    content: util_1.default.format.apply(this, arguments)
                });
                if (console[cache].length > 256) {
                    sendLogs(console[cache]);
                    console[cache] = [];
                }
            }
        };
    }
    if (server) {
        setInterval(() => {
            if (console[cache].length) {
                sendLogs(console[cache]);
                console[cache] = [];
            }
        }, server.interval || 6000);
    }
};
exports.init = init;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jhc2UvbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGdEQUF3QjtBQUN4QixrREFBMEI7QUFDMUIsMENBQXFDO0FBQ3JDLHdDQUFvQztBQUVwQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFnRTlCOzs7RUFHRTtBQUNLLE1BQU0sSUFBSSxHQUFHLFVBQVUsT0FBNEI7SUFFekQsSUFBSSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQztJQUUzQixJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtRQUNoQyxLQUFLLEdBQUcsT0FBTyxDQUFDO0tBQ2hCO1NBQU07UUFDTixLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUN0QixNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUN4QixPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztLQUMxQjtJQUVELE1BQU0sSUFBSSxHQUFHLFVBQVUsR0FBRztRQUN6QixPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNuQyxDQUFDLENBQUM7SUFFRixNQUFNLE9BQU8sR0FBRztRQUNmLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMs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