"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeGeoDistance = exports.compareVersion = exports.camelCaseKeys = exports.camelCase = exports.absolutePath = exports.delay = void 0;
const path_1 = __importDefault(require("path"));
/**
 * 延迟，一般用法为:
 * ``` js
 * await delay(0.5) // 延迟0.5秒
 * ```
 * @param {number} time 需要延迟的时间，单位为秒。
*/
const delay = async function (time) {
    await new Promise((resolve) => {
        let timer = setTimeout(() => {
            clearTimeout(timer);
            resolve();
        }, time * 1000);
    });
};
exports.delay = delay;
/**
 * 获取路径p的绝对路径
 * * 如果p以 '/' 开始，返回相对于当前进程cwd的绝对路径。
*/
const absolutePath = function (p) {
    const c = p.charAt(0);
    if (c === '/') {
        return path_1.default.resolve(process.cwd(), p);
    }
    if (c === '.') {
        console.warn(`util.absolutePath(${p}) is deprecated, please use util.absolutePath(/${p.substr(1)}) instead.`);
        return path_1.default.resolve(process.cwd(), p);
    }
    return path_1.default.resolve(p);
};
exports.absolutePath = absolutePath;
/**
 * 获取name的驼峰形式。如：
 * ```
 * get_user_info => getUserInfo
 * _get_user_info => GetUserInfo
 * ```
*/
const camelCase = function (name) {
    return name.replace(/_(\w)/g, (all, letter) => {
        return letter.toUpperCase();
    });
};
exports.camelCase = camelCase;
/**
 * 将对象obj的key全部变成驼峰形式。
*/
const camelCaseKeys = function (obj) {
    let ret = {};
    Object.keys(obj).forEach(key => {
        ret[(0, exports.camelCase)(key)] = obj[key];
    });
    return ret;
};
exports.camelCaseKeys = camelCaseKeys;
/**
 * 对两个版本进行比较
 * * versionA === versionB：返回 0
 * * versionA < versionB： 返回 -1
 * * versionA > versionB： 返回 1
 * @param {string} versionA 第一个版本号字符串
 * @param {string} versionB 第二个版本号字符串
 * @return {number}
*/
const compareVersion = function (versionA, versionB) {
    if (typeof versionA !== 'string') {
        console.warn(`Expected String, got ${typeof versionA}.`);
    }
    if (typeof versionB !== 'string') {
        console.warn(`Expected String, got ${typeof versionB}.`);
    }
    const arrA = versionA.split('.');
    const arrB = versionB.split('.');
    for (let i = 0; i < Math.max(arrA.length, arrB.length); i++) {
        if (arrA[i] === undefined) {
            arrA[i] = '0';
        }
        if (arrB[i] === undefined) {
            arrB[i] = '0';
        }
        if (+arrA[i] < +arrB[i]) {
            return -1;
        }
        if (+arrA[i] > +arrB[i]) {
            return 1;
        }
    }
    return 0;
};
exports.compareVersion = compareVersion;
/**
 * 计算地球球面上两个经纬点之间的地理距离。
*/
const computeGeoDistance = function (lat1, lng1, lat2, lng2) {
    let sqrt = Math.sqrt;
    let sin = Math.sin;
    let cos = Math.cos;
    let asin = Math.asin;
    let R = 6378.137;
    let RPA = Math.PI / 180.0;
    lat1 = lat1 * RPA;
    lng1 = lng1 * RPA;
    lat2 = lat2 * RPA;
    lng2 = lng2 * RPA;
    let a = (lat1 - lat2) / 2;
    let b = (lng1 - lng2) / 2;
    return R * 2 * asin(sqrt(sin(a) * sin(a) + cos(lat1) * cos(lat2) * sin(b) * sin(b)));
};
exports.computeGeoDistance = computeGeoDistance;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0RBQXdCO0FBRXhCOzs7Ozs7RUFNRTtBQUNLLE1BQU0sS0FBSyxHQUFHLEtBQUssV0FBVyxJQUFZO0lBQzdDLE1BQU0sSUFBSSxPQUFPLENBQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRTtRQUNoQyxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ3hCLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQixPQUFPLEVBQUUsQ0FBQztRQUNkLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDcEIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUE7QUFQWSxRQUFBLEtBQUssU0FPakI7QUFFRDs7O0VBR0U7QUFDSyxNQUFNLFlBQVksR0FBRyxVQUFVLENBQVM7SUFDM0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUU7UUFDWCxPQUFPLGNBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3pDO0lBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFO1FBQ1gsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDOUcsT0FBTyxjQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUN6QztJQUNELE9BQU8sY0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQixDQUFDLENBQUE7QUFWWSxRQUFBLFlBQVksZ0JBVXhCO0FBRUQ7Ozs7OztFQU1FO0FBQ0ssTUFBTSxTQUFTLEdBQUcsVUFBVSxJQUFZO0lBQzNDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDMUMsT0FBTyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDaEMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFKVyxRQUFBLFNBQVMsYUFJcEI7QUFFRjs7RUFFRTtBQUNLLE1BQU0sYUFBYSxHQUFHLFVBQVUsR0FBVztJQUM5QyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDYixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUMzQixHQUFHLENBQUMsSUFBQSxpQkFBUyxFQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25DLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDLENBQUM7QUFOVyxRQUFBLGFBQWEsaUJBTXhCO0FBRUY7Ozs7Ozs7O0VBUUU7QUFDSyxNQUFNLGNBQWMsR0FBRyxVQUFTLFFBQWdCLEVBQUUsUUFBZ0I7SUFDckUsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7UUFDOUIsT0FBTyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsT0FBTyxRQUFRLEdBQUcsQ0FBQyxDQUFBO0tBQzNEO0lBQ0QsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7UUFDOUIsT0FBTyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsT0FBTyxRQUFRLEdBQUcsQ0FBQyxDQUFBO0tBQzNEO0lBRUQsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRWpDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3pELElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsRUFBRTtZQUN2QixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1NBQ2pCO1FBQ0QsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7U0FDakI7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3JCLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDYjtRQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDdkIsT0FBTyxDQUFDLENBQUM7U0FDWjtLQUNKO0lBQ0QsT0FBTyxDQUFDLENBQUM7QUFFYixDQUFDLENBQUE7QUExQlksUUFBQSxjQUFjLGtCQTBCMUI7QUFFRDs7RUFFRTtBQUNLLE1BQU0sa0JBQWtCLEdBQUcsVUFBVSxJQUFZLEVBQUUsSUFBWSxFQUFFLElBQVksRUFBRSxJQUFZO0lBQzlGLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDckIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNuQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ25CLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFFckIsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDO0lBRWpCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQzFCLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQ2xCLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQ2xCLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQ2xCLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBRWxCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pGLENBQUMsQ0FBQztBQWpCVyxRQUFBLGtCQUFrQixzQkFpQjdCIn0=