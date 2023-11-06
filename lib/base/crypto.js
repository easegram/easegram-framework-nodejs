"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rsop = exports.rsow = exports.rsoa = exports.rsox = exports.rsod = exports.rs = exports.decode_hex64 = exports.encode_hex64 = exports.decode_base64 = exports.encode_base64 = exports.decode_aes_256_cbc = exports.encode_aes_256_cbc = exports.sha256 = exports.md5 = exports.hash = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * 用指定hash算法计算data的hash编码。
 * @param {string} alg hash算法的名称
 * @param {string|Buffer} data 用来做hash计算的数据
 * @returns {string} data的hash值
*/
const hash = function (alg, data) {
    let hash = crypto_1.default.createHash(alg);
    hash.update(data);
    return hash.digest('hex');
};
exports.hash = hash;
/**
 * 计算data的md5值
 * @param {string|Buffer} data 用于做md5计算的数据
 * @returns {string} data的md5值
*/
const md5 = function (data) {
    return (0, exports.hash)("md5", data);
};
exports.md5 = md5;
/**
 * 计算data的sha256值
 * @param {string | Buffer} data 用于计算sha256的数据
 * @returns {string} data的sha256值
*/
const sha256 = function (data) {
    return (0, exports.hash)("sha256", data);
};
exports.sha256 = sha256;
/**
 * 使用aes-256-cbc算法对数据进行编码
 * @param {string} key 用于加密的密钥
 * @param {string} content 被加密的数据
 * @returns {string} 加密后的密文
 */
const encode_aes_256_cbc = function (key, content) {
    let cipher = crypto_1.default.createCipher("aes-256-cbc", key);
    let cryptex = cipher.update(content, "utf8", "hex");
    cryptex += cipher.final("hex");
    return cryptex;
};
exports.encode_aes_256_cbc = encode_aes_256_cbc;
/**
 * 对一串使用aes-256-cbc算法加密的密文进行解码
 * @param {string} key 解密密钥
 * @param {string} content 密文数据
 * @returns {string} 解码后的数据
*/
const decode_aes_256_cbc = function (key, content) {
    let decipher = crypto_1.default.createDecipher("aes-256-cbc", key);
    let decryptex = decipher.update(content, "hex", "utf8");
    decryptex += decipher.final("utf8");
    return decryptex;
};
exports.decode_aes_256_cbc = decode_aes_256_cbc;
/**
 * 对数据进行base64编码
 * @param {string} content 用于base64编码的数据
 * @returns {string} base64字符串
*/
const encode_base64 = function (content) {
    return Buffer.from(content).toString('base64');
};
exports.encode_base64 = encode_base64;
/**
 * 对base64编码的字符串进行解码
 * @param {string} content base64编码字符串
 * @returns {string} base64解码后的数据
*/
const decode_base64 = function (content) {
    return Buffer.from(content, 'base64').toString();
};
exports.decode_base64 = decode_base64;
/**
 * 将一段十六进制的字符串进行base64编码
 * @param {string} content 十六进制字符串
 * @returns 编码后的数据
*/
const encode_hex64 = function (content) {
    return Buffer.from(content, 'hex').toString('base64');
};
exports.encode_hex64 = encode_hex64;
/**
 * 对一段被base64编码过的十六进制字符串进行解码
 * @param {string} content base64字符串
 * @returns {string} 十六进制字符串
*/
const decode_hex64 = function (content) {
    return Buffer.from(content, 'base64').toString('hex');
};
exports.decode_hex64 = decode_hex64;
/**
 * 获取一个随机字符串（random string）
 * @param {number} length 随机字符串的长度
 * @param {char[]} characters 随机字符串的字符表，随机字符串中的所有字符将从此自负表中随机抽取。
 * @returns {string} 随机字符串
*/
const rs = function (len, characters) {
    let str = "";
    for (let i = 0; i < len; i++) {
        let index = Math.floor(Math.random() * characters.length);
        str += characters[index];
    }
    return str;
};
exports.rs = rs;
/**
 * 获取一个十进制的随机数字字符串（random string of digit）
 * @param {number} len 字符串的长度
 * @returns {string} 随机十进制数字字符串
*/
const rsod = function (len) {
    let str = "";
    for (let i = 0; i < len; i++) {
        str += Math.floor(Math.random() * 10);
    }
    return str;
};
exports.rsod = rsod;
/**
 * 获取一个十六进制的随机数字字符串（random string of hex）
 * @param {number} len 字符串的长度
 * @returns {string} 随机十六进制数字字符串
*/
const rsox = function (len) {
    let characters = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'A', 'B', 'C', 'D', 'E', 'F',
    ];
    return (0, exports.rs)(len, characters);
};
exports.rsox = rsox;
/**
 * 获取一个随机字母字符串（random string of alpha）
 * @param {number} len 字符串的长度
 * @returns {string} 随机字母字符串
*/
const rsoa = function (len) {
    let characters = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z',
    ];
    return (0, exports.rs)(len, characters);
};
exports.rsoa = rsoa;
/**
 * 获取一个由数字、字母组成的随机字符串（random string of word）
 * @param {number} len 字符串的长度
 * @returns {string} 由数字、字母组成的随机字符串.
*/
const rsow = function (len) {
    let characters = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z',
    ];
    return (0, exports.rs)(len, characters);
};
exports.rsow = rsow;
/**
 * 获取一个由可打印字符组成的随机字符串（random string of printable)
 * @param {number} len 字符串长度
 * @returns {string} 一个由可打印字符组成的随机字符串
*/
const rsop = function (len) {
    let characters = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z',
        '~', '!', '#', '$', '%', '^', '*', '(', ')', '+',
        '-', '_', '<', '>', '[', ']', '{', '}', '|', '/',
    ];
    return (0, exports.rs)(len, characters);
};
exports.rsop = rsop;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J5cHRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jhc2UvY3J5cHRvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9EQUE0QjtBQUU1Qjs7Ozs7RUFLRTtBQUNLLE1BQU0sSUFBSSxHQUFHLFVBQVMsR0FBVyxFQUFFLElBQXFCO0lBQzNELElBQUksSUFBSSxHQUFHLGdCQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlCLENBQUMsQ0FBQztBQUpXLFFBQUEsSUFBSSxRQUlmO0FBRUY7Ozs7RUFJRTtBQUNLLE1BQU0sR0FBRyxHQUFHLFVBQVMsSUFBcUI7SUFDN0MsT0FBTyxJQUFBLFlBQUksRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDN0IsQ0FBQyxDQUFDO0FBRlcsUUFBQSxHQUFHLE9BRWQ7QUFFRjs7OztFQUlFO0FBQ0ssTUFBTSxNQUFNLEdBQUcsVUFBVSxJQUFxQjtJQUNqRCxPQUFPLElBQUEsWUFBSSxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNoQyxDQUFDLENBQUM7QUFGVyxRQUFBLE1BQU0sVUFFakI7QUFFRjs7Ozs7R0FLRztBQUNJLE1BQU0sa0JBQWtCLEdBQUcsVUFBVSxHQUFXLEVBQUUsT0FBZTtJQUNwRSxJQUFJLE1BQU0sR0FBRyxnQkFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDckQsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3BELE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLE9BQU8sT0FBTyxDQUFDO0FB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