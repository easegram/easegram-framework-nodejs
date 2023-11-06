/**
 * 构造一个新的错误对象，一般调用方式形如：throw error('ERR_NAME', 'message');
 * @param {name} 错误名称，推荐使用形如‘ERR_INVALID_ARGS’的命名规则，具体业务不做强制要求。
 * @param {string} message 错误信息
 * @returns {Error} 构建的错误对象
*/
export declare const error: (name: string, message: string) => Error;
/**
 * 检查错误，此函数会检查形如（err, ret）的错误。检查规则：
 * * err是一个Error实例，返回true。
 * * ret.result !== 'ok', 返回true。
*/
export declare const checkError: (err: Error, ret?: any) => boolean;
