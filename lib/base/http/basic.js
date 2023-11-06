"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = exports.combineUrlAndParams = exports.isHttps = void 0;
const querystring_1 = __importDefault(require("querystring"));
const crypto_1 = require("../crypto");
/**
 * 判断url是否是https
*/
function isHttps(url) {
    return url.indexOf('https://') === 0;
}
exports.isHttps = isHttps;
;
/**
 * 将data对象的数据以key=value的方式合并到url之后，并返回合并之后的url。
*/
function combineUrlAndParams(url, data) {
    if (typeof (data) !== 'object' || data === null) {
        return url;
    }
    let params = querystring_1.default.stringify(data);
    if (!params || params.length <= 0) {
        return url;
    }
    let ret = url;
    let index = url.indexOf("?", 0);
    if (index < 0 || index >= url.length) {
        ret = url + "?" + params;
    }
    else if (index < url.length - 1) {
        ret = url + "&" + params;
    }
    else {
        ret = url + params;
    }
    return ret;
}
exports.combineUrlAndParams = combineUrlAndParams;
;
/**
 * 对http请求数据签名，内部采用MD5算法生成签名指纹。
 * @param {object} data 用于签名的http请求数据。
 * @param {string} secret 用于签名的密钥。
 * @returns {string} 签名指纹
 */
function sign(data, secret) {
    const str = Object.keys(data).sort().map(key => `${key}=${data[key]}`).join('&');
    return (0, crypto_1.md5)(str + secret);
}
exports.sign = sign;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYmFzZS9odHRwL2Jhc2ljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhEQUFnQztBQUNoQyxzQ0FBZ0M7QUErRGhDOztFQUVFO0FBQ0YsU0FBZ0IsT0FBTyxDQUFDLEdBQVc7SUFDL0IsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QyxDQUFDO0FBRkQsMEJBRUM7QUFBQSxDQUFDO0FBRUY7O0VBRUU7QUFDRixTQUFnQixtQkFBbUIsQ0FBQyxHQUFXLEVBQUUsSUFBK0I7SUFDNUUsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssUUFBUSxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7UUFDN0MsT0FBTyxHQUFHLENBQUM7S0FDZDtJQUVELElBQUksTUFBTSxHQUFHLHFCQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7UUFDL0IsT0FBTyxHQUFHLENBQUM7S0FDZDtJQUVELElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNkLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRTtRQUNsQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUM7S0FDNUI7U0FDSSxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUM3QixHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUM7S0FDNUI7U0FDSTtRQUNELEdBQUcsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDO0tBQ3RCO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBdEJELGtEQXNCQztBQUFBLENBQUM7QUFFRjs7Ozs7R0FLRztBQUNILFNBQWdCLElBQUksQ0FBQyxJQUFZLEVBQUUsTUFBYztJQUM3QyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FDcEMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FDL0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixPQUFPLElBQUEsWUFBRyxFQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQztBQUM3QixDQUFDO0FBTEQsb0JBS0MifQ==