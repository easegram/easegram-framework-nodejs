"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkError = exports.error = void 0;
/**
 * 构造一个新的错误对象，一般调用方式形如：throw error('ERR_NAME', 'message');
 * @param {name} 错误名称，推荐使用形如‘ERR_INVALID_ARGS’的命名规则，具体业务不做强制要求。
 * @param {string} message 错误信息
 * @returns {Error} 构建的错误对象
*/
const error = function (name, message) {
    let err = new Error(message);
    err.name = name;
    return err;
};
exports.error = error;
/**
 * 检查错误，此函数会检查形如（err, ret）的错误。检查规则：
 * * err是一个Error实例，返回true。
 * * ret.result !== 'ok', 返回true。
*/
const checkError = function (err, ret) {
    if (err) {
        return true;
    }
    if (ret && ret.result !== undefined) {
        if (ret.result !== 0 && ret.result !== true && ret.result !== 'ok') {
            return true;
        }
    }
    return false;
};
exports.checkError = checkError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jhc2UvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBOzs7OztFQUtFO0FBQ0ssTUFBTSxLQUFLLEdBQUcsVUFBVSxJQUFZLEVBQUUsT0FBZTtJQUN4RCxJQUFJLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM3QixHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNoQixPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUMsQ0FBQTtBQUpZLFFBQUEsS0FBSyxTQUlqQjtBQUVEOzs7O0VBSUU7QUFDSyxNQUFNLFVBQVUsR0FBRyxVQUFVLEdBQVUsRUFBRSxHQUFTO0lBQ3JELElBQUksR0FBRyxFQUFFO1FBQ0wsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO1FBQ2pDLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7WUFDaEUsT0FBTyxJQUFJLENBQUM7U0FDZjtLQUNKO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQyxDQUFDO0FBVlcsUUFBQSxVQUFVLGNBVXJCIn0=