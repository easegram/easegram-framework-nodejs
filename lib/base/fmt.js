"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.required = exports.optional = exports.rules = exports.assertAll = exports.assertOne = exports.hasAll = exports.hasOne = exports.has = void 0;
const common_1 = require("./common");
/**
 * obj中是否存在field字段
 * @param {object} obj 待检查的对象
 * @param {string} field 待检查的字段名称
 * @returns {boolean} 结果
*/
const has = function (obj, field) {
    if (!obj) {
        return false;
    }
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        let k = keys[i];
        let f = obj[k];
        if (k === field && f !== undefined && f !== null) {
            return true;
        }
    }
    return false;
};
exports.has = has;
/**
 * 字段列表中的其中一个字段在obj中是否存在。
 * @param {object} obj 待检查的对象
 * @param {string[]} fields 待检查的字段列表
 * @returns {boolean} 结果
*/
const hasOne = function (obj, fields) {
    for (let i = 0; i < fields.length; i++) {
        let f = fields[i];
        if ((0, exports.has)(obj, f)) {
            return true;
        }
    }
    return false;
};
exports.hasOne = hasOne;
/**
 * 字段列表中的字段在obj中是否全部存在。
 * @param {object} obj 待检查的对象
 * @param {string[]} fields 待检查的字段列表
 * @returns {boolean} 结果
*/
const hasAll = function (obj, fields) {
    for (let i = 0; i < fields.length; i++) {
        let f = fields[i];
        if (!(0, exports.has)(obj, f)) {
            return false;
        }
    }
    return true;
};
exports.hasAll = hasAll;
/**
 * 断言字段列表fields中的字段在对象obj中至少存在一个。如果断言失败，会抛出错误。
 * @param {object} obj 待检查的对象
 * @param {string[]} fields 待检查的字段列表
*/
const assertOne = function (obj, fields) {
    for (let i = 0; i < fields.length; i++) {
        let f = fields[i];
        if ((0, exports.has)(obj, f)) {
            return;
        }
    }
    throw (0, common_1.error)("ERR_FIELED_REQUIRED", `Nothing is defined in the object.`);
};
exports.assertOne = assertOne;
/**
 * 断言字段列表fields中的全部字段在对象obj中都存在。断言失败会抛出错误。
 * @param {object} obj 待检查的对象
 * @param {string[]} fields 待检查的字段列表
*/
const assertAll = function (obj, fields) {
    for (let i = 0; i < fields.length; i++) {
        let f = fields[i];
        if (!(0, exports.has)(obj, f)) {
            throw (0, common_1.error)("ERR_FIELED_REQUIRED", `Required field '${f}' is not defined in the object.`);
        }
    }
};
exports.assertAll = assertAll;
/**
 * 数据格式校验规则，其中包含两类：
 * * 正则表达式
 * * 接口：{test: (val)=>boolean}
*/
exports.rules = {
    'string': {
        test: function (val) {
            return typeof (val) === 'string';
        }
    },
    'number': {
        test: function (val) {
            return typeof (val) === 'number';
        }
    },
    'boolean': {
        test: function (val) {
            return typeof (val) === 'boolean';
        }
    },
    'function': {
        test: function (val) {
            return typeof (val) === 'function';
        }
    },
    'object': {
        test: function (val) {
            return typeof (val) === 'object';
        }
    },
    'array': {
        test: function (val) {
            return Array.isArray(val);
        }
    },
    'integer': {
        test: function (val) {
            return typeof (val) === 'number' && exports.rules['integer_str'].test(val.toString());
        }
    },
    'float': {
        test: function (val) {
            return typeof (val) === 'number' && exports.rules['float_str'].test(val.toString());
        }
    },
    'alpha': /^[a-zA-Z]+$/,
    'number_str': /^\d+$/,
    'integer_str': /^[-+]?\d+$/,
    'float_str': /^[-+]?\d+(\.\d+)?$/,
    'hex': /^(0x|0X)?[a-fA-F\d]+$/,
    'word': /^\w+$/,
    'chinese': /^[\u4E00-\u9FA5]+$/,
    'name': /^[\w-.]+$/,
    'identifier': /^[A-Za-z_]\w*$/,
    'username': /^[\w@+\-.]+$/,
    'password': /^[\w~!@#$%^&*()+=\-.,:{}\[\]|\\]+$/,
    'email': /^[\w\-]+(\.[\w\-]+)*@[\w\-]+(\.[\w\-]+)+$/,
    'url': /^[a-zA-z]+:\/\/(\w+(-\w+)*)(\.(\w+(-\w+)*))*(\?\S*)?$/,
    'ipv4': /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
    'ipv6': /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    'html': /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/
};
/**
 * 可选项检查，如果字段存在就进行数据格式校验，如果字段不存在就返回默认值。
 * @param {T} field 待检查的字段值
 * @param {string|RegExp} format 校验规则
 * @param {number} minlen 最小长度
 * @param {number} maxlen 最大长度
 * @param {T} defaultValue 默认值
 * @returns {boolean} 字段是否存在
*/
const optional = function (field, format, minlen, maxlen, defaultValue) {
    if (field === undefined || field === null) {
        if (defaultValue !== undefined) {
            field = defaultValue;
        }
        return false;
    }
    if (format === '*') {
        // do nothing.
    }
    else if (typeof (format) === 'string') {
        let rule = exports.rules[format];
        if (!rule) {
            throw (0, common_1.error)('ERR_FORMAT_UNDEFINED', `the format '${format}' is undefined.`);
        }
        if (!rule.test(field)) {
            throw (0, common_1.error)('ERR_FORMAT_INVALID', `data format of field is invalid, '${format}' expected.`);
        }
    }
    else if (format instanceof RegExp) {
        if (!format.test(field.toString())) {
            throw (0, common_1.error)('ERR_FORMAT_INVALID', `data format of field is invalid, '${format}' expected.`);
        }
    }
    else {
        throw (0, common_1.error)('ERR_FORMAT_UNDEFINED', `the format '${format}' is undefined.`);
    }
    const length = (field) => {
        if (typeof (field.length) === 'number') {
            return field.length;
        }
        if (typeof (field.length) === 'function') {
            return field.length();
        }
        return field.toString().length;
    };
    if (typeof (minlen) === 'number' && length(field) < minlen) {
        throw (0, common_1.error)('ERR_FORMAT_INVALID', `data format of field is invalid, data is too short.`);
    }
    if (typeof (maxlen) === 'number' && length(field) > maxlen) {
        throw (0, common_1.error)('ERR_FORMAT_INVALID', `data format of field is invalid, data is too long.`);
    }
    return true;
};
exports.optional = optional;
/**
 * 必备项检查，如果字段存在就进行数据格式校验，如果字段不存在就抛出错误。
 * @param {T} field 待检查的字段值
 * @param {string|RegExp} format 校验规则
 * @param {number} minlen 最小长度
 * @param {number} maxlen 最大长度
 * @returns {boolean} 字段是否存在
*/
const required = function (field, format, minlen, maxlen) {
    if (field === undefined || field === null) {
        throw (0, common_1.error)('ERR_FIELD_REQUIRED', `field is null or undefined.`);
    }
    return (0, exports.optional)(field, format, minlen, maxlen, undefined);
};
exports.required = required;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm10LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jhc2UvZm10LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFpQztBQUVqQzs7Ozs7RUFLRTtBQUNLLE1BQU0sR0FBRyxHQUFHLFVBQVUsR0FBVyxFQUFFLEtBQWE7SUFDbkQsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNOLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBRUQsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNsQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxTQUFTLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtZQUM5QyxPQUFPLElBQUksQ0FBQztTQUNmO0tBQ0o7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDLENBQUE7QUFmWSxRQUFBLEdBQUcsT0FlZjtBQUVEOzs7OztFQUtFO0FBQ0ssTUFBTSxNQUFNLEdBQUcsVUFBVSxHQUFXLEVBQUUsTUFBZ0I7SUFDekQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDcEMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLElBQUksSUFBQSxXQUFHLEVBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFO1lBQ2IsT0FBTyxJQUFJLENBQUM7U0FDZjtLQUNKO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDakIs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