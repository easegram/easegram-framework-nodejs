/**
 * obj中是否存在field字段
 * @param {object} obj 待检查的对象
 * @param {string} field 待检查的字段名称
 * @returns {boolean} 结果
*/
export declare const has: (obj: object, field: string) => boolean;
/**
 * 字段列表中的其中一个字段在obj中是否存在。
 * @param {object} obj 待检查的对象
 * @param {string[]} fields 待检查的字段列表
 * @returns {boolean} 结果
*/
export declare const hasOne: (obj: object, fields: string[]) => boolean;
/**
 * 字段列表中的字段在obj中是否全部存在。
 * @param {object} obj 待检查的对象
 * @param {string[]} fields 待检查的字段列表
 * @returns {boolean} 结果
*/
export declare const hasAll: (obj: object, fields: string[]) => boolean;
/**
 * 断言字段列表fields中的字段在对象obj中至少存在一个。如果断言失败，会抛出错误。
 * @param {object} obj 待检查的对象
 * @param {string[]} fields 待检查的字段列表
*/
export declare const assertOne: (obj: object, fields: string[]) => void;
/**
 * 断言字段列表fields中的全部字段在对象obj中都存在。断言失败会抛出错误。
 * @param {object} obj 待检查的对象
 * @param {string[]} fields 待检查的字段列表
*/
export declare const assertAll: (obj: object, fields: string[]) => void;
/**
 * 数据格式校验规则，其中包含两类：
 * * 正则表达式
 * * 接口：{test: (val)=>boolean}
*/
export declare const rules: {
    string: {
        test: (val: any) => boolean;
    };
    number: {
        test: (val: any) => boolean;
    };
    boolean: {
        test: (val: any) => boolean;
    };
    function: {
        test: (val: any) => boolean;
    };
    object: {
        test: (val: any) => boolean;
    };
    array: {
        test: (val: any) => boolean;
    };
    integer: {
        test: (val: any) => boolean;
    };
    float: {
        test: (val: any) => boolean;
    };
    alpha: RegExp;
    number_str: RegExp;
    integer_str: RegExp;
    float_str: RegExp;
    hex: RegExp;
    word: RegExp;
    chinese: RegExp;
    name: RegExp;
    identifier: RegExp;
    username: RegExp;
    password: RegExp;
    email: RegExp;
    url: RegExp;
    ipv4: RegExp;
    ipv6: RegExp;
    html: RegExp;
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
export declare const optional: <T>(field: T, format: string | RegExp, minlen: number, maxlen: number, defaultValue: T) => boolean;
/**
 * 必备项检查，如果字段存在就进行数据格式校验，如果字段不存在就抛出错误。
 * @param {T} field 待检查的字段值
 * @param {string|RegExp} format 校验规则
 * @param {number} minlen 最小长度
 * @param {number} maxlen 最大长度
 * @returns {boolean} 字段是否存在
*/
export declare const required: <T>(field: T, format: string, minlen?: number, maxlen?: number) => boolean;
